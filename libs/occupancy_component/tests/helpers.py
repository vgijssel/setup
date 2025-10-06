from datetime import timedelta

import homeassistant.util.dt as dt_util
from custom_components.occupancy.const import ATTR_AREAS, OCCUPANCY_DATA
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.components.stream.core import IdleTimer
from pytest_homeassistant_custom_component.common import async_fire_time_changed


async def wait(hass, seconds=10):
    next_update = dt_util.utcnow() + timedelta(seconds=seconds)
    async_fire_time_changed(hass, next_update)
    await hass.async_block_till_done()


async def wait_for_state_propagation(hass):
    """Wait for all state changes to propagate through the system."""
    import asyncio

    await asyncio.sleep(0.1)
    await hass.async_block_till_done()


class ContactSensor(BinarySensorEntity):
    def __init__(self, entity_id, state):
        self.entity_id = entity_id
        self._attr_is_on = state
        self._attr_device_class = BinarySensorDeviceClass.DOOR

    async def open(self):
        self._attr_is_on = True
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def close(self):
        self._attr_is_on = False
        self.async_write_ha_state()
        await self.hass.async_block_till_done()


class MotionSensor(BinarySensorEntity):
    def __init__(self, entity_id, state, timeout):
        self.entity_id = entity_id
        self._attr_is_on = state
        self._attr_device_class = BinarySensorDeviceClass.OCCUPANCY
        self._timeout = timeout

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()

        self._reset_motion_presence_timer = IdleTimer(
            self.hass, self._timeout, self._reset_motion_presence
        )
        # The starting state of the timer should be idle, so
        # we're able to differentiate between an event just happened or not.
        self._reset_motion_presence_timer.idle = True

        self.async_on_remove(
            self._reset_motion_presence_timer.clear,
        )

    async def motion(self):
        self._attr_is_on = True
        self.async_write_ha_state()
        self._reset_motion_presence_timer.awake()
        await self.hass.async_block_till_done()

    async def away(self):
        self._attr_is_on = False
        self.async_write_ha_state()
        self._reset_motion_presence_timer.clear()
        await self.hass.async_block_till_done()

    async def _reset_motion_presence(self) -> None:
        await self.away()


def contact_sensor(entity_id, state):
    entity = ContactSensor(entity_id, state)
    return entity


def motion_sensor(entity_id, state, timeout=5):
    entity = MotionSensor(entity_id, state, timeout)
    return entity


def occupancy_sensor(entity_id, state, timeout=30):
    entity = MotionSensor(entity_id, state, timeout)
    return entity


def get_area(hass, area_id):
    return hass.data[OCCUPANCY_DATA][ATTR_AREAS][area_id]["entity"]


async def update_area(hass, area_id, new_state):
    area = get_area(hass, area_id)
    await area.async_select_option(new_state)
    await hass.async_block_till_done()
