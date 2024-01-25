"""Test component setup."""

from homeassistant.setup import async_setup_component
from homeassistant.const import STATE_ON, STATE_OFF
from custom_components.occupancy.const import DOMAIN
import homeassistant.util.dt as dt_util
from datetime import timedelta
from pytest_homeassistant_custom_component.common import async_fire_time_changed
import time


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


async def test_door_opens(hass, init_integration, door_contact_sensor):
    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )

    await door_contact_sensor.open()
    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )

    next_update = dt_util.utcnow() + timedelta(seconds=10)
    async_fire_time_changed(hass, next_update)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )


async def test_door_closes(hass, init_integration, door_contact_sensor):
    await door_contact_sensor.open()
    next_update = dt_util.utcnow() + timedelta(seconds=10)
    async_fire_time_changed(hass, next_update)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )

    await door_contact_sensor.close()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )

    next_update = dt_util.utcnow() + timedelta(seconds=10)
    async_fire_time_changed(hass, next_update)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )


# when door is unknown and transitions to open
# when door is unknown and transitions to closed
# when door opens then there is presence for X seconds
# we track door open/close separately for the icon


# when door is closed and there is motion, then no presence emitted
# when door is open and there is motion, then presence emitted
# when door is closed and there is no motion, then no presence emitted
# when there is motion and the door opens, then presence emitted
# async def test_door_closed_motion(
#     hass, init_integration, door_motion_sensor, door_contact_sensor
# ):
#     assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

#     await door_motion_sensor.motion()

#     assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
