"""Platform for sensor integration."""

from __future__ import annotations

from homeassistant.const import TEMP_CELSIUS
from homeassistant.core import HomeAssistant
from homeassistant.components.stream.core import IdleTimer
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from datetime import datetime

from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntityDescription,
    BinarySensorEntity,
)

from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    STATE_OFF,
    STATE_ON,
)

import logging

_LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import (
    DOMAIN,
    ATTR_ENTRY,
    ATTR_CONTACT_SENSOR,
    ATTR_MOTION_SENSOR,
    ATTR_DOORS,
    OCCUPANCY_DATA,
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

    _LOGGER.debug("async_setup_platform called with discovery_info: %s", discovery_info)
    _LOGGER.debug("async_setup_platform called with config: %s", config)
    _LOGGER.debug("async_setup_platform called with data: %s", data)

    door_id = discovery_info["door_id"]
    door_config = data[ATTR_DOORS][door_id]

    entry = door_config.get(ATTR_ENTRY, False)
    contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
    motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

    async_add_entities(
        [
            Door(
                name=door_id,
                unique_id=door_id,
                entry=entry,
                contact_sensor=contact_sensor,
                motion_sensor=motion_sensor,
            )
        ]
    )


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

        self._door_is_open = False
        self._door_has_motion = False

        self._entry = entry
        self._contact_sensor = contact_sensor
        self._motion_sensor = motion_sensor

    @property
    def icon(self):
        """Return the icon to use for the valve."""
        if self._door_is_open:
            return "mdi:door-open"
        else:
            return "mdi:door-closed"

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()

        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                self._contact_sensor,
                self._contact_sensor_event,
            )
        )

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

        self.async_on_remove(
            self._reset_contact_presence_timer.clear,
        )

    async def _contact_sensor_event(self, event: EventType):
        _LOGGER.debug("Called '_contact_sensor_event' with data %s", event.data)

        if event.data["old_state"] == None:
            from_state = None
        else:
            from_state = event.data["old_state"].state

        to_state = event.data["new_state"].state

        if (from_state == STATE_OFF or from_state == None) and to_state == STATE_ON:
            self._door_is_open = True
            self._reset_contact_presence_timer.awake()
            self._calculate_presence()
            self.async_write_ha_state()

        elif (from_state == STATE_ON or from_state == None) and to_state == STATE_OFF:
            self._door_is_open = False
            self._reset_contact_presence_timer.awake()
            self._calculate_presence()
            self.async_write_ha_state()

        else:
            pass

    async def _motion_sensor_event(self, event: EventType):
        _LOGGER.debug("Called '_motion_sensor_event' with data %s", event.data)

        if event.data["old_state"] == None:
            from_state = None
        else:
            from_state = event.data["old_state"].state

        to_state = event.data["new_state"].state

        if (from_state == STATE_OFF or from_state == None) and to_state == STATE_ON:
            self._door_has_motion = True
            self._calculate_presence()
            self.async_write_ha_state()

        elif (from_state == STATE_ON or from_state == None) and to_state == STATE_OFF:
            self._door_has_motion = False
            self._calculate_presence()
            self.async_write_ha_state()

        else:
            pass

    def _calculate_presence(self):
        door_just_opened = (
            self._door_is_open == True
            and self._reset_contact_presence_timer.idle == False
        )
        door_just_closed = (
            self._door_is_open == False
            and self._reset_contact_presence_timer.idle == False
        )

        if door_just_closed:
            self._attr_is_on = True
        elif door_just_opened:
            self._attr_is_on = True
        elif self._door_is_open == True and self._door_has_motion:
            self._attr_is_on = True
        else:
            self._attr_is_on = False

        _LOGGER.debug(
            f"_calculate_presence with {door_just_closed} - {door_just_opened} - {self._door_is_open} - {self._door_has_motion} calculated: {self._attr_is_on}"
        )

    async def _reset_contact_presence(self) -> None:
        self._calculate_presence()
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self):
        door_state = "open" if self._door_is_open else "closed"
        motion_state = "motion" if self._door_has_motion else "no motion"

        return {"door_state": door_state, "motion_state": motion_state}
