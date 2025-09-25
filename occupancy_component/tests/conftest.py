"""pytest fixtures."""

import logging

import pytest
from custom_components.occupancy.const import (
    ATTR_AREAS,
    ATTR_DOORS,
    ATTR_TIMER_ENTITIES,
    DOMAIN,
    OCCUPANCY_DATA,
)
from homeassistant.components import binary_sensor
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockEntityPlatform
from tests.helpers import wait

_LOGGER = logging.getLogger(__name__)


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
                },
                "living_room_door": {
                    "contact_sensor": "binary_sensor.living_room_door_contact",
                    "motion_sensor": "binary_sensor.living_room_door_motion",
                },
            },
            "areas": {
                "hallway": {
                    "occupancy_sensors": ["binary_sensor.hallway_occupancy"],
                    "doors": ["front_door", "living_room_door"],
                }
            },
        },
    }
    await async_setup_component(hass, DOMAIN, config) is True

    await hass.async_block_till_done()

    yield

    for door in hass.data[OCCUPANCY_DATA][ATTR_DOORS].values():
        await door["entity"].async_remove()

    for area in hass.data[OCCUPANCY_DATA][ATTR_AREAS].values():
        await area["entity"].async_remove()

        for timer in area[ATTR_TIMER_ENTITIES]:
            timer.async_cancel()
            await timer.async_remove()


@pytest.fixture()
async def init_entities(hass):
    tracked_entities = None

    async def _init_entities(*entities):
        nonlocal tracked_entities
        entity_platform = MockEntityPlatform(
            hass, domain=binary_sensor.DOMAIN, platform_name="test", platform=None
        )
        tracked_entities = entities

        await entity_platform.async_add_entities(entities)
        # We have to wait here, because adding entities to hass will trigger a state change
        await wait(hass)
        return entities

    yield _init_entities

    for entity in tracked_entities:
        await entity.async_remove()

    await hass.async_block_till_done()
