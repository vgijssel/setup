"""Test component setup."""

from custom_components.occupancy.const import (
    STATUS_ABSENT,
    STATUS_ENTERING,
    STATUS_ENTERING_CONFIRM,
    STATUS_LEAVING,
    STATUS_LEAVING_CONFIRM,
    STATUS_PRESENT,
)
from homeassistant.components.timer import STATUS_ACTIVE as TIMER_STATUS_ACTIVE
from homeassistant.components.timer import STATUS_IDLE as TIMER_STATUS_IDLE
from homeassistant.components.timer import STATUS_PAUSED as TIMER_STATUS_PAUSED
from tests.helpers import (
    contact_sensor,
    motion_sensor,
    occupancy_sensor,
    update_area,
    wait,
)


async def test_area_absent(hass, init_integration, init_entities):
    await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
    )

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_absent_door_closed_has_motion(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_motion.motion()

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the motion sensor to become inactive
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_door_opens(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_contact.open()

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_PAUSED
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the door to become inactive to trigger the timer to become active
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_door_open_has_motion(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", True),
        motion_sensor("binary_sensor.front_door_motion", False),
    )

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_motion.motion()

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_PAUSED
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the motion sensor to become inactive to trigger the timer to become active
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_has_occupancy(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_ENTERING)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await hallway_occupancy.motion()

    assert hass.states.get("select.hallway").state == STATUS_ENTERING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert (
        hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_ACTIVE
    )
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_without_occupancy(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_ENTERING)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_status_door_opens(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_ENTERING)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_contact.open()

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_PAUSED
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the door to become inactive to trigger the timer to become active
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await wait(hass, 15)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_confirm_has_occupancy(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_ENTERING_CONFIRM)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert (
        hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_ACTIVE
    )
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the confirm timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_entering_confirm_no_occupancy(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_ENTERING_CONFIRM)

    assert hass.states.get("select.hallway").state == STATUS_ENTERING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert (
        hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_ACTIVE
    )
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await hallway_occupancy.away()

    assert hass.states.get("select.hallway").state == STATUS_ENTERING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_present_occupancy_goes_away(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_PRESENT)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await hallway_occupancy.away()

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_present_occupancy_door_opens(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_PRESENT)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_contact.open()

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_PAUSED
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the door activity to go away
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for both the door activity and the leaving timer to expire
    await wait(hass, 15)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_present_occupancy_away_door_opens(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_PRESENT)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_contact.open()

    assert hass.states.get("select.hallway").state == STATUS_LEAVING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_ACTIVE

    # Wait for the leaving confirm timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_leaving_has_occupancy(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_LEAVING)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the leaving timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_leaving_occupancy_goes_away(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_LEAVING)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await hallway_occupancy.away()

    assert hass.states.get("select.hallway").state == STATUS_LEAVING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_ACTIVE

    # Wait for the leaving confirm timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_leaving_door_open_has_motion(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", True),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", True),
    )

    await update_area(hass, "hallway", STATUS_LEAVING)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    await front_door_motion.motion()

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_PAUSED
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the motion sensor to become inactive to trigger the timer to become active
    await wait(hass, 5)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_leaving_confirm_no_occupancy(hass, init_integration, init_entities):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", True),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_LEAVING_CONFIRM)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_ACTIVE

    # Wait for the leaving confirm timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE


async def test_area_leaving_confirm_has_occupancy(
    hass, init_integration, init_entities
):
    [front_door_contact, front_door_motion, hallway_occupancy] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", True),
        motion_sensor("binary_sensor.front_door_motion", False),
        occupancy_sensor("binary_sensor.hallway_occupancy", False),
    )

    await update_area(hass, "hallway", STATUS_LEAVING_CONFIRM)

    assert hass.states.get("select.hallway").state == STATUS_LEAVING_CONFIRM
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_ACTIVE

    await hallway_occupancy.motion()

    assert hass.states.get("select.hallway").state == STATUS_LEAVING
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_ACTIVE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE

    # Wait for the leaving timer to expire
    await wait(hass, 10)

    assert hass.states.get("select.hallway").state == STATUS_PRESENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE
