"""Platform for sensor integration."""

from __future__ import annotations

import logging

from custom_components.occupancy.const import (
    ATTR_CONTACT_SENSOR,
    ATTR_DOORS,
    ATTR_ENTRY,
    ATTR_MOTION_SENSOR,
    OCCUPANCY_DATA,
)
from custom_components.occupancy.internal_state import InternalState
from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.components.stream.core import IdleTimer
from homeassistant.const import STATE_OFF, STATE_ON
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
        "binary_sensor async_setup_platform called with discovery_info: %s",
        discovery_info,
    )

    door_id = discovery_info["door_id"]
    door_config = data[ATTR_DOORS][door_id]

    entry = door_config.get(ATTR_ENTRY, False)
    contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
    motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

    entity = Door(
        name=door_id,
        unique_id=door_id,
        entry=entry,
        contact_sensor=contact_sensor,
        motion_sensor=motion_sensor,
    )

    door_config["entity"] = entity

    async_add_entities([entity])


class Door(BinarySensorEntity, RestoreEntity):
    def __init__(
        self,
        name,
        unique_id,
        entry: bool,
        contact_sensor: str = None,
        motion_sensor: str = None,
    ):
        self._attr_name = name
        self._attr_unique_id = unique_id
        self._attr_is_on = False

        self._entry = entry
        self._contact_sensor = contact_sensor
        self._motion_sensor = motion_sensor
        self._internal_state = InternalState()

    @property
    def icon(self):
        """Return the icon to use for the valve."""
        if self._door_is_open:
            return "mdi:door-open"
        else:
            return "mdi:door-closed"

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()

        self._internal_state.register_entity(self._contact_sensor)
        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                self._contact_sensor,
                self._contact_sensor_event,
            )
        )

        self._internal_state.register_entity(self._motion_sensor)
        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                self._motion_sensor,
                self._motion_sensor_event,
            )
        )

        self._reset_contact_presence_timer = IdleTimer(
            self.hass, 5, self._reset_contact_presence
        )
        # The starting state of the timer should be idle, so
        # we're able to differentiate between an event just happened or not.
        self._reset_contact_presence_timer.idle = True

        self.async_on_remove(
            self._reset_contact_presence_timer.clear,
        )

    async def _contact_sensor_event(self, event: EventType):
        self._internal_state.set(event.data["entity_id"], event.data["new_state"])

        _LOGGER.debug(
            "Called '_contact_sensor_event' with data %s - new state %s",
            event.data,
            self._internal_state,
        )

        # old_state is None happens when the entity is added to home assistant
        if event.data["old_state"] is None:
            from_state = None
        else:
            from_state = event.data["old_state"].state

        # new_state is None happens when the entity is removed from home assisstant
        if event.data["new_state"] is None:
            to_state = None
        else:
            to_state = event.data["new_state"].state

        if from_state == STATE_OFF and to_state == STATE_ON:
            self._reset_contact_presence_timer.awake()

        elif from_state == STATE_ON and to_state == STATE_OFF:
            self._reset_contact_presence_timer.awake()

        self._calculate_presence()

    async def _motion_sensor_event(self, event: EventType):
        self._internal_state.set(event.data["entity_id"], event.data["new_state"])

        _LOGGER.debug(
            "Called '_motion_sensor_event' with data %s - new state %s",
            event.data,
            self._internal_state,
        )

        self._calculate_presence()

    def _door_is_open(self):
        return self._internal_state.get(self._contact_sensor) == STATE_ON

    def _door_is_closed(self):
        return self._internal_state.get(self._contact_sensor) == STATE_OFF

    def _door_has_motion(self):
        return self._internal_state.get(self._motion_sensor) == STATE_ON

    def _door_just_opened(self):
        return self._door_is_open() and self._reset_contact_presence_timer.idle is False

    def _door_just_closed(self):
        return (
            self._door_is_closed() and self._reset_contact_presence_timer.idle is False
        )

    def _calculate_presence(self):
        door_just_opened = self._door_just_opened()
        door_just_closed = self._door_just_closed()
        door_is_open = self._door_is_open()
        door_has_motion = self._door_has_motion()

        if door_just_closed:
            self._attr_is_on = True
        elif door_just_opened:
            self._attr_is_on = True
        elif door_is_open and door_has_motion:
            self._attr_is_on = True
        else:
            self._attr_is_on = False

        _LOGGER.debug(
            f"_calculate_presence with {door_just_closed} - {door_just_opened} - {door_is_open} - {door_has_motion} calculated: {self._attr_is_on}"
        )
        self.async_write_ha_state()

    async def _reset_contact_presence(self) -> None:
        self._calculate_presence()

    @property
    def extra_state_attributes(self):
        door_state = "open" if self._door_is_open() else "closed"
        motion_state = "motion" if self._door_has_motion() else "no motion"

        return {"door_state": door_state, "motion_state": motion_state}
