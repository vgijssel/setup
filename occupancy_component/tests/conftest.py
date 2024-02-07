"""pytest fixtures."""

import pytest
from homeassistant.setup import async_setup_component

from custom_components.occupancy.const import DOMAIN

from homeassistant.const import STATE_ON, STATE_OFF, STATE_UNKNOWN
from homeassistant.components.template.const import DOMAIN as TEMPLATE_DOMAIN
from tests.helpers import wait
from homeassistant.components import binary_sensor
from pytest_homeassistant_custom_component.common import MockEntityPlatform


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
    yield

    # TODO: can we also teardown the integration / entities instead of waiting?
    # This waits for 24 hours to make sure all the timers are reset
    await wait(hass, 86400)


@pytest.fixture()
def init_entities(hass):
    async def _init_entities(*entities):
        entity_platform = MockEntityPlatform(
            hass, domain=binary_sensor.DOMAIN, platform_name="test", platform=None
        )
        await entity_platform.async_add_entities(entities)
        # We have to wait here, because adding entities to hass will trigger a state change
        await wait(hass)
        return entities

    return _init_entities
