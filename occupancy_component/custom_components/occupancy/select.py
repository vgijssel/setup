"""Platform for sensor integration."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from homeassistant.components.select import (
    SelectEntity,
    DOMAIN as SELECT_DOMAIN,
    SERVICE_SELECT_OPTION,
)
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.components.timer import (
    DOMAIN as TIMER_DOMAIN,
    SERVICE_START as TIMER_SERVICE_START,
    SERVICE_CANCEL as TIMER_SERVICE_CANCEL,
    SERVICE_PAUSE as TIMER_SERVICE_PAUSE,
    STATUS_IDLE as TIMER_STATUS_IDLE,
    STATUS_PAUSED as TIMER_STATUS_PAUSED,
)

from homeassistant.const import (
    STATE_OFF,
    STATE_ON,
)

import logging

_LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import (
    ATTR_AREAS,
    OCCUPANCY_DATA,
    ATTR_OCCUPANCY_SENSORS,
    ATTR_DOORS,
    STATUS_ABSENT,
    STATUS_ENTERING,
    STATUS_ENTERING_CONFIRM,
    STATUS_PRESENT,
    STATUS_LEAVING,
    STATUS_LEAVING_CONFIRM,
    ATTR_ENTERING_TIMER,
    ATTR_ENTERING_CONFIRM_TIMER,
    ATTR_LEAVING_TIMER,
    ATTR_LEAVING_CONFIRM_TIMER,
)


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Set up the sensor platform."""

    if discovery_info is None:
        return

    data = hass.data[OCCUPANCY_DATA]

    _LOGGER.debug(
        "select async_setup_platform called with discovery_info: %s", discovery_info
    )

    area_id = discovery_info["area_id"]
    area_config = data[ATTR_AREAS][area_id]

    occupancy_sensors = area_config.get(ATTR_OCCUPANCY_SENSORS)
    doors = area_config.get(ATTR_DOORS)
    entering_timer = area_config.get(ATTR_ENTERING_TIMER)
    entering_confirm_timer = area_config.get(ATTR_ENTERING_CONFIRM_TIMER)
    leaving_timer = area_config.get(ATTR_LEAVING_TIMER)
    leaving_confirm_timer = area_config.get(ATTR_LEAVING_CONFIRM_TIMER)

    async_add_entities(
        [
            Area(
                name=area_id,
                unique_id=area_id,
                occupancy_sensors=occupancy_sensors,
                doors=doors,
                entering_timer=entering_timer,
                entering_confirm_timer=entering_confirm_timer,
                leaving_timer=leaving_timer,
                leaving_confirm_timer=leaving_confirm_timer,
            ),
        ]
    )


class Area(SelectEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    STATUSES = [
        STATUS_ABSENT,
        STATUS_ENTERING,
        STATUS_ENTERING_CONFIRM,
        STATUS_PRESENT,
        STATUS_LEAVING,
        STATUS_LEAVING_CONFIRM,
    ]

    def __init__(
        self,
        name,
        unique_id,
        occupancy_sensors,
        doors,
        entering_timer,
        entering_confirm_timer,
        leaving_timer,
        leaving_confirm_timer,
    ):
        self._attr_name = name
        self._attr_unique_id = unique_id
        self._occupancy_sensors = occupancy_sensors
        self._doors = doors
        self._current_state = STATUS_ABSENT
        self._entering_timer = entering_timer
        self._entering_confirm_timer = entering_confirm_timer
        self._leaving_timer = leaving_timer
        self._leaving_confirm_timer = leaving_confirm_timer
        self._timer_mapping = {
            STATUS_ENTERING: self._entering_timer,
            STATUS_ENTERING_CONFIRM: self._entering_confirm_timer,
            STATUS_LEAVING: self._leaving_timer,
            STATUS_LEAVING_CONFIRM: self._leaving_confirm_timer,
        }

    @property
    def options(self) -> list[str]:
        return self.STATUSES

    @property
    def current_option(self) -> str | None:
        """Return current tariff."""
        return self._current_state

    async def async_added_to_hass(self) -> None:
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        for door in self._doors:
            self.async_on_remove(
                async_track_state_change_event(self.hass, door, self._door_event)
            )

        self.async_on_remove(
            async_track_state_change_event(
                self.hass, self._entering_timer, self._timer_event
            )
        )

    async def _timer_event(self, event: EventType):
        _LOGGER.debug("Called '_timer_event' with data %s", event.data)
        await self._calculate_state()

    # TODO:
    # we need to have a single function which runs whenever a door
    # or an occupancy sensor changes state.
    #
    # Whenever the select changes state we should use a service call
    # this way all the state changes, either through the UI or the automation
    # go through the same code path.
    #
    # When the select changes state reset the unnecessary times
    # and start the timers that are relevant for that particular state
    #
    # We need a timer component for each state and inject that timer
    # into each area component. Each time a timer triggers when it's done
    # we need to call the main calculate state function to determine what to do next.
    async def _door_event(self, event: EventType):
        _LOGGER.debug("Called '_door_event' with data %s", event.data)

        # if event.data["old_state"] == None:
        #     from_state = None
        # else:
        #     from_state = event.data["old_state"].state

        # to_state = event.data["new_state"].state

        # if (from_state == STATE_OFF or from_state == None) and to_state == STATE_ON:
        #     # self._door_last_changed = to_state.last_changed
        #     pass
        await self._calculate_state()

    async def async_select_option(self, option: str) -> None:
        """Select new tariff (option)."""
        _LOGGER.debug("Called 'async_select_option' with data %s", option)

        self._current_state = option
        self.async_write_ha_state()
        await self._update_timers_from_status(option)

    async def _update_timers_from_status(self, option: str):
        start_timer = self._timer_mapping.get(option)
        cancel_timers = [
            timer for status, timer in self._timer_mapping.items() if status != option
        ]

        for cancel_timer in cancel_timers:
            await self._cancel_timer(cancel_timer)

        # It's possible there is no start timer for the current state
        if start_timer:
            await self._start_timer(start_timer)

    async def _start_timer(self, timer: str):
        _LOGGER.debug(f"Starting timer {timer}")
        data = {
            "entity_id": timer,
            "duration": "00:00:10",
        }

        await self.hass.services.async_call(TIMER_DOMAIN, TIMER_SERVICE_START, data)

    async def _cancel_timer(self, timer: str):
        _LOGGER.debug(f"Cancel timer {timer}")
        data = {
            "entity_id": timer,
        }

        await self.hass.services.async_call(TIMER_DOMAIN, TIMER_SERVICE_CANCEL, data)

    async def _pause_timer(self, timer: str):
        _LOGGER.debug(f"Pause timer {timer}")
        data = {
            "entity_id": timer,
        }

        await self.hass.services.async_call(TIMER_DOMAIN, TIMER_SERVICE_PAUSE, data)

    async def _resume_timer(self, timer: str):
        _LOGGER.debug(f"Resume timer {timer}")
        data = {
            "entity_id": timer,
        }

        await self.hass.services.async_call(TIMER_DOMAIN, TIMER_SERVICE_START, data)

    def _doors_have_activity(self):
        for door in self._doors:
            state = self.hass.states.get(door)

            if state is not None and state.state == STATE_ON:
                return True

        return False

    def _timer_is_idle(self, timer: str):
        state = self.hass.states.get(timer)

        _LOGGER.debug(f"Getting timer state for {timer} {state}")

        if state is None or state.state == TIMER_STATUS_IDLE:
            return True

        return False

    def _timer_is_paused(self, timer: str):
        state = self.hass.states.get(timer)

        _LOGGER.debug(f"Getting timer state for {timer} {state}")

        if state is None or state.state == TIMER_STATUS_PAUSED:
            return True

        return False

    async def _calculate_state(self):
        doors_have_activity = self._doors_have_activity()

        if self._current_state == STATUS_ABSENT:
            if doors_have_activity:
                await self.async_select_option(STATUS_ENTERING)

        elif self._current_state == STATUS_ENTERING:
            entering_timer_idle = self._timer_is_idle(self._entering_timer)
            entering_timer_paused = self._timer_is_paused(self._entering_timer)

            # If there is activity at the door then pause the timer
            # until there is no longer activity in which case we resume the timer
            if doors_have_activity:
                await self._pause_timer(self._entering_timer)

            elif entering_timer_paused:
                await self._resume_timer(self._entering_timer)

            elif entering_timer_idle:
                await self.async_select_option(STATUS_ABSENT)
