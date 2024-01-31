"""pytest fixtures."""
import pytest
from homeassistant.setup import async_setup_component

from custom_components.occupancy.const import DOMAIN
from homeassistant.components.demo.binary_sensor import DemoBinarySensor


class DoorContactSensor(DemoBinarySensor):
    def __init__(self, hass, *args, **kwargs):
        super(DoorContactSensor, self).__init__(*args, **kwargs)
        self.hass = hass

    async def open(self):
        self._state = True
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def close(self):
        self._state = False
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def unknown(self):
        self._state = None
        self.async_write_ha_state()
        await self.hass.async_block_till_done()


class MotionSensor(DemoBinarySensor):
    def __init__(self, hass, *args, **kwargs):
        super(MotionSensor, self).__init__(*args, **kwargs)
        self.hass = hass

    async def motion(self):
        self._state = True
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def away(self):
        self._state = False
        self.async_write_ha_state()
        await self.hass.async_block_till_done()

    async def unknown(self):
        self._state = None
        self.async_write_ha_state()
        await self.hass.async_block_till_done()


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations defined in the test dir."""
    yield


@pytest.fixture()
async def init_integration(hass) -> None:
    config = {
        "occupancy": {
            "doors": {
                "front_door": {
                    "entry": True,
                    "contact_sensor": "binary_sensor.front_door_contact",
                    "motion_sensor": "binary_sensor.front_door_motion",
                }
            },
            "areas": {
                "hallway": {
                    "occupancy_sensors": ["binary_sensor.hallway_occupancy"],
                    "doors": ["front_door"],
                }
            },
        },
    }
    await async_setup_component(hass, DOMAIN, config) is True
    await hass.async_block_till_done()


@pytest.fixture()
async def door_contact_sensor(hass) -> DoorContactSensor:
    sensor = DoorContactSensor(
        hass, None, "Front Door Contact", state=False, device_class="door"
    )
    sensor.entity_id = "binary_sensor.front_door_contact"
    return sensor


@pytest.fixture()
async def door_motion_sensor(hass) -> DoorContactSensor:
    sensor = MotionSensor(
        hass, None, "Front Door Motion", state=False, device_class="presence"
    )
    sensor.entity_id = "binary_sensor.front_door_motion"
    return sensor
