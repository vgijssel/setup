"""Test component setup."""

from homeassistant.setup import async_setup_component
from homeassistant.const import STATE_ON, STATE_OFF
from custom_components.occupancy.const import DOMAIN
from tests.helpers import wait


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

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )


async def test_door_closes(hass, init_integration, door_contact_sensor):
    await door_contact_sensor.open()
    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )

    await door_contact_sensor.close()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )


async def test_door_unknown_to_open(hass, init_integration, door_contact_sensor):
    await door_contact_sensor.unknown()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

    await wait(hass)

    await door_contact_sensor.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF


async def test_door_unknown_to_close(hass, init_integration, door_contact_sensor):
    await door_contact_sensor.unknown()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

    await wait(hass)

    await door_contact_sensor.close()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF


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
