"""Platform for sensor integration."""

from __future__ import annotations

from homeassistant.const import TEMP_CELSIUS
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
            )
        ]
    )


class Area(SelectEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    STATES = [
        "absent",
        "entering",
        "entering_confirm",
        "present",
        "leaving",
        "leaving_confirm",
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
        self._current_state = None

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

        # state = await self.async_get_last_state()
        # if not state or state.state not in self._tariffs:
        #     self._current_tariff = self._tariffs[0]
        # else:
        #     self._current_tariff = state.state

    async def async_select_option(self, option: str) -> None:
        """Select new tariff (option)."""
        self._current_state = option
        self.async_write_ha_state()
