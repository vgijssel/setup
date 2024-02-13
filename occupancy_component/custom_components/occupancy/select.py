"""Platform for sensor integration."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from datetime import datetime

from homeassistant.components.select import SelectEntity
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
    ATTR_AREAS,
    OCCUPANCY_DATA,
    ATTR_OCCUPANCY_SENSORS,
    ATTR_DOORS,
)

from homeassistant.components.timer import (
    Timer,
    CONF_ICON,
    CONF_ID,
    CONF_NAME,
    CONF_DURATION,
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

    async_add_entities(
        [
            Area(
                name=area_id,
                unique_id=area_id,
                occupancy_sensors=occupancy_sensors,
                doors=doors,
            ),
        ]
    )


class Area(SelectEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    ABSENT = "absent"
    ENTERING = "entering"
    ENTERING_CONFIRM = "entering_confirm"
    PRESENT = "present"
    LEAVING = "leaving"
    LEAVING_CONFIRM = "leaving_confirm"

    STATES = [
        ABSENT,
        ENTERING,
        ENTERING_CONFIRM,
        PRESENT,
        LEAVING,
        LEAVING_CONFIRM,
    ]

    def __init__(
        self,
        name,
        unique_id,
        occupancy_sensors,
        doors,
    ):
        self._attr_name = name
        self._attr_unique_id = unique_id
        self._occupancy_sensors = occupancy_sensors
        self._doors = doors
        self._current_state = self.ABSENT

    @property
    def options(self) -> list[str]:
        return self.STATES

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

        if event.data["old_state"] == None:
            from_state = None
        else:
            from_state = event.data["old_state"].state

        to_state = event.data["new_state"].state

        if self._current_state == self.ABSENT:
            if (from_state == STATE_OFF or from_state == None) and to_state == STATE_ON:
                self._current_state = self.ENTERING
                self.async_write_ha_state()

    async def async_select_option(self, option: str) -> None:
        """Select new tariff (option)."""
        _LOGGER.debug("Called 'async_select_option' with data %s", option)

        self._current_state = option
        self.async_write_ha_state()
