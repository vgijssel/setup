"""Test component setup."""

from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNKNOWN
from tests.helpers import contact_sensor, motion_sensor, wait


async def test_door_opens(hass, init_integration, init_entities):
    [front_door_contact] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
    )

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "closed"
    )

    await front_door_contact.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert (
        hass.states.get("binary_sensor.front_door").attributes["door_state"] == "open"
    )


async def test_door_closes(hass, init_integration, init_entities):
    [front_door_contact] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", STATE_ON),
    )

    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

    await front_door_contact.close()

    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door").state == STATE_ON

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF


async def test_door_unknown_to_open(hass, init_integration, init_entities):
    [front_door_contact] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", None),
    )

    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_UNKNOWN
    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

    await front_door_contact.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF


async def test_door_unknown_to_close(hass, init_integration, init_entities):
    [front_door_contact] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", None),
    )

    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_UNKNOWN
    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF

    await front_door_contact.close()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF


async def test_door_open_with_motion(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", True),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF

    await front_door_motion.motion()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF


async def test_door_closed_with_motion(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF

    await front_door_motion.motion()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF


async def test_motion_with_door_open(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    await front_door_motion.motion()

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    await front_door_contact.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    await wait(hass)

    assert hass.states.get("binary_sensor.front_door").state == STATE_OFF
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF


async def test_motion_away_does_not_remove_contact_presence(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False, timeout=2),
    )

    await front_door_motion.motion()
    await front_door_contact.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    # This makes sure the motion sensor is set to away
    await wait(hass, 2)

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_OFF


async def test_contact_timeout_does_not_remove_motion_presence(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False, timeout=10),
    )

    await front_door_motion.motion()
    await front_door_contact.open()

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON

    # This makes sure the contact sensor is set to away
    await wait(hass, 5)

    assert hass.states.get("binary_sensor.front_door").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_contact").state == STATE_ON
    assert hass.states.get("binary_sensor.front_door_motion").state == STATE_ON
