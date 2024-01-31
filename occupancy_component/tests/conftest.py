"""pytest fixtures."""
import pytest
from homeassistant.setup import async_setup_component

from custom_components.occupancy.const import DOMAIN

from homeassistant.const import STATE_ON, STATE_OFF, STATE_UNKNOWN
from homeassistant.components.template.const import DOMAIN as TEMPLATE_DOMAIN
from tests.helpers import wait


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


class ContactSensor:
    def __init__(self, hass, entity_id):
        self._entity_id = entity_id
        self._hass = hass

    async def open(self):
        self._hass.states.async_set(self._entity_id, STATE_ON, {})
        await self._hass.async_block_till_done()

    async def close(self):
        self._hass.states.async_set(self._entity_id, STATE_OFF, {})
        await self._hass.async_block_till_done()

    async def unknown(self):
        self._hass.states.async_set(self._entity_id, STATE_UNKNOWN, {})
        await self._hass.async_block_till_done()


@pytest.fixture()
def door_contact_sensor(hass):
    async def _door_contact_sensor(state):
        config = {
            TEMPLATE_DOMAIN: {
                "binary_sensor": {
                    "state": "",
                    "name": "front_door_contact",
                    "device_class": "door",
                }
            }
        }

        await async_setup_component(
            hass,
            TEMPLATE_DOMAIN,
            config,
        )
        await hass.async_block_till_done()
        await wait(hass)

        # return hass.data["binary_sensor"].get_entity("binary_sensor.front_door_contact")
        contact_sensor = ContactSensor(hass, "binary_sensor.front_door_contact")

        if state is True:
            await contact_sensor.open()
        elif state is False:
            await contact_sensor.close()
        else:
            await contact_sensor.unknown()

        await wait(hass)

        return contact_sensor

    return _door_contact_sensor


@pytest.fixture()
async def door_motion_sensor(hass):
    def _door_motion_sensor(state):
        sensor = MotionSensor(
            hass, None, "Front Door Motion", state=state, device_class="presence"
        )
        sensor.entity_id = "binary_sensor.front_door_motion"
        return sensor

    return _door_motion_sensor
