"""Test component setup."""

from custom_components.occupancy.const import STATUS_ABSENT
from tests.helpers import wait, contact_sensor, motion_sensor
from homeassistant.components.timer import (
    STATUS_IDLE as TIMER_STATUS_IDLE,
    STATUS_PAUSED as TIMER_STATUS_PAUSED,
    STATUS_ACTIVE as TIMER_STATUS_ACTIVE,
)


async def test_area_absent(hass, init_integration, init_entities):
    [front_door_contact] = await init_entities(
        contact_sensor("binary_sensor.front_door_contact", False),
    )

    # await wait(hass, 30)

    assert hass.states.get("select.hallway").state == STATUS_ABSENT
    assert hass.states.get("timer.hallway_entering").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_entering_confirm").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving").state == TIMER_STATUS_IDLE
    assert hass.states.get("timer.hallway_leaving_confirm").state == TIMER_STATUS_IDLE
