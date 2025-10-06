"""Platform for sensor integration."""

from __future__ import annotations

import logging

from custom_components.occupancy.const import (
    ATTR_AREAS,
    ATTR_DOORS,
    ATTR_ENTERING_CONFIRM_TIMER,
    ATTR_ENTERING_TIMER,
    ATTR_LEAVING_CONFIRM_TIMER,
    ATTR_LEAVING_TIMER,
    ATTR_OCCUPANCY_SENSORS,
    OCCUPANCY_DATA,
    STATUS_ABSENT,
    STATUS_ENTERING,
    STATUS_ENTERING_CONFIRM,
    STATUS_LEAVING,
    STATUS_LEAVING_CONFIRM,
    STATUS_PRESENT,
)
from custom_components.occupancy.internal_state import InternalState
from homeassistant.components.select import SelectEntity
from homeassistant.components.timer import DOMAIN as TIMER_DOMAIN
from homeassistant.components.timer import SERVICE_CANCEL as TIMER_SERVICE_CANCEL
from homeassistant.components.timer import SERVICE_PAUSE as TIMER_SERVICE_PAUSE
from homeassistant.components.timer import SERVICE_START as TIMER_SERVICE_START
from homeassistant.components.timer import STATUS_ACTIVE as TIMER_STATUS_ACTIVE
from homeassistant.components.timer import STATUS_IDLE as TIMER_STATUS_IDLE
from homeassistant.components.timer import STATUS_PAUSED as TIMER_STATUS_PAUSED
from homeassistant.const import STATE_ON
from homeassistant.core import EventType, HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

_LOGGER = logging.getLogger(__name__)


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

    entity = Area(
        name=area_id,
        unique_id=area_id,
        occupancy_sensors=occupancy_sensors,
        doors=doors,
        entering_timer=entering_timer,
        entering_confirm_timer=entering_confirm_timer,
        leaving_timer=leaving_timer,
        leaving_confirm_timer=leaving_confirm_timer,
    )

    area_config["entity"] = entity

    async_add_entities([entity])


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
        self._internal_state = InternalState()

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

        self._internal_state.register_entity(self.entity_id, self._current_state)

        for door in self._doors:
            door_state = self.hass.states.get(door)
            self._internal_state.register_entity(
                door, door_state.state if door_state else None
            )

            self.async_on_remove(
                async_track_state_change_event(self.hass, door, self._door_event)
            )

        for occupancy_sensor in self._occupancy_sensors:
            sensor_state = self.hass.states.get(occupancy_sensor)
            self._internal_state.register_entity(
                occupancy_sensor, sensor_state.state if sensor_state else None
            )

            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, occupancy_sensor, self._occupancy_sensor_event
                )
            )

        for timer in self._timer_mapping.values():
            timer_state = self.hass.states.get(timer)
            self._internal_state.register_entity(
                timer, timer_state.state if timer_state else None
            )

            self.async_on_remove(
                async_track_state_change_event(self.hass, timer, self._timer_event)
            )

    async def _timer_event(self, event: EventType):
        self._internal_state.set(event.data["entity_id"], event.data["new_state"])

        _LOGGER.debug(
            "Called '_timer_event' with data %s - new state %s",
            event.data,
            self._internal_state,
        )

        await self._calculate_state()

    async def _door_event(self, event: EventType):
        self._internal_state.set(event.data["entity_id"], event.data["new_state"])

        _LOGGER.debug(
            "Called '_door_event' with data %s - new state %s",
            event.data,
            self._internal_state,
        )

        await self._calculate_state()

    async def _occupancy_sensor_event(self, event: EventType):
        self._internal_state.set(event.data["entity_id"], event.data["new_state"])

        _LOGGER.debug(
            "Called '_occupancy_sensor_event' with data %s - new state %s",
            event.data,
            self._internal_state,
        )
        await self._calculate_state()

    async def async_select_option(self, option: str) -> None:
        start_timer = self._timer_mapping.get(option)
        cancel_timers = [
            timer for status, timer in self._timer_mapping.items() if status != option
        ]

        # We are doing an optimisitc update of the internal state here
        # to prevent any race condition inside the _calculate_state function.
        # If we don't do this when cancelling/starting timers or updating the
        # select state the _calculate_state function might be called while some of the
        # other updates are still in progress resulting in the wrong state being calculated.
        # Basically we want the update of the select and timers to be atomic or
        # in a single transaction, but as those options don't exist we do this
        # by tracking internal state and doing an optimistic update.
        self._internal_state.set(self.entity_id, option)

        for cancel_timer in cancel_timers:
            self._internal_state.set(cancel_timer, TIMER_STATUS_IDLE)

        # It's possible there is no start timer for the current state
        if start_timer:
            self._internal_state.set(start_timer, TIMER_STATUS_ACTIVE)

        _LOGGER.debug(
            "Called 'async_select_option' with data %s - new state %s",
            option,
            self._internal_state,
        )

        self._current_state = option
        self.async_write_ha_state()

        for cancel_timer in cancel_timers:
            await self._cancel_timer(cancel_timer)

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
            state = self._internal_state.get(door)

            if state is not None and state == STATE_ON:
                return True

        return False

    def _area_has_occupancy(self):
        for occupancy_sensor in self._occupancy_sensors:
            state = self._internal_state.get(occupancy_sensor)

            if state is not None and state == STATE_ON:
                return True

        return False

    def _timer_is_idle(self, timer: str):
        state = self._internal_state.get(timer)

        if state is None or state == TIMER_STATUS_IDLE:
            return True

        return False

    def _timer_is_paused(self, timer: str):
        state = self._internal_state.get(timer)

        _LOGGER.debug(f"Got timer state for {timer} {state}")

        if state is None or state == TIMER_STATUS_PAUSED:
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
            area_has_occupancy = self._area_has_occupancy()

            if area_has_occupancy:
                await self.async_select_option(STATUS_ENTERING_CONFIRM)

            # If there is activity at the door then pause the timer
            # until there is no longer activity in which case we resume the timer
            elif doors_have_activity:
                await self._pause_timer(self._entering_timer)

            elif entering_timer_paused:
                await self._resume_timer(self._entering_timer)

            elif entering_timer_idle:
                await self.async_select_option(STATUS_ABSENT)

        elif self._current_state == STATUS_ENTERING_CONFIRM:
            area_has_occupancy = self._area_has_occupancy()
            entering_confirm_timer_idle = self._timer_is_idle(
                self._entering_confirm_timer
            )

            if not area_has_occupancy:
                await self.async_select_option(STATUS_ENTERING)
            elif entering_confirm_timer_idle:
                await self.async_select_option(STATUS_PRESENT)

        elif self._current_state == STATUS_PRESENT:
            if doors_have_activity:
                await self.async_select_option(STATUS_LEAVING)

        elif self._current_state == STATUS_LEAVING:
            leaving_timer_idle = self._timer_is_idle(self._leaving_timer)
            leaving_timer_paused = self._timer_is_paused(self._leaving_timer)
            area_has_occupancy = self._area_has_occupancy()

            if not area_has_occupancy:
                await self.async_select_option(STATUS_LEAVING_CONFIRM)

            elif doors_have_activity:
                await self._pause_timer(self._leaving_timer)

            elif leaving_timer_paused:
                await self._resume_timer(self._leaving_timer)

            elif leaving_timer_idle:
                await self.async_select_option(STATUS_PRESENT)

        elif self._current_state == STATUS_LEAVING_CONFIRM:
            area_has_occupancy = self._area_has_occupancy()
            leaving_confirm_timer_idle = self._timer_is_idle(
                self._leaving_confirm_timer
            )

            if area_has_occupancy:
                await self.async_select_option(STATUS_LEAVING)
            elif leaving_confirm_timer_idle:
                await self.async_select_option(STATUS_ABSENT)
