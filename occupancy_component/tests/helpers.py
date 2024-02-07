import homeassistant.util.dt as dt_util
from datetime import timedelta
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.helpers.event import async_call_later

import logging

_LOGGER = logging.getLogger(__name__)


async def wait(hass, seconds=10):
    next_update = dt_util.utcnow() + timedelta(seconds=seconds)
    async_fire_time_changed(hass, next_update)
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

    async def motion(self):
        self._attr_is_on = True
        self.async_write_ha_state()
        self._listener_reset_motion_presence = async_call_later(
            self.hass, self._timeout, self._reset_motion_presence
        )
        await self.hass.async_block_till_done()

    async def away(self):
        self._attr_is_on = False
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def _reset_motion_presence(self, now):
        _LOGGER.debug("Called '_reset_motion_presence'")
        self._listener_reset_motion_presence = None
        await self.away()


def contact_sensor(entity_id, state):
    entity = ContactSensor(entity_id, state)
    return entity


def motion_sensor(entity_id, state, timeout=5):
    entity = MotionSensor(entity_id, state, timeout)
    return entity
