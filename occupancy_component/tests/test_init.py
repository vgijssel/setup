"""Test component setup."""

from homeassistant.setup import async_setup_component
from homeassistant.const import STATE_ON, STATE_OFF
from custom_components.occupancy.const import DOMAIN


async def test_async_setup(hass):
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

    """Test the component gets setup."""
    assert await async_setup_component(hass, DOMAIN, config) is True


async def test_door_contact_sensor(hass, init_integration, door_contact_sensor):
    assert hass.states.get("occupancy.front_door").state == STATE_OFF

    await door_contact_sensor.open()

    assert hass.states.get("occupancy.front_door").state == STATE_ON
