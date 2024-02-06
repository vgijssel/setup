import homeassistant.util.dt as dt_util
from datetime import timedelta
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.const import STATE_ON, STATE_OFF


async def wait(hass, seconds=10):
    next_update = dt_util.utcnow() + timedelta(seconds)
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


def contact_sensor(entity_id, state):
    entity = ContactSensor(entity_id, state)
    return entity
