"""Platform for sensor integration."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from datetime import datetime

from homeassistant.components.timer import (
    Timer,
    CONF_ICON,
    CONF_ID,
    CONF_NAME,
    CONF_DURATION,
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
    if discovery_info is None:
        return

    _LOGGER.debug(
        "timer async_setup_platform called with discovery_info: %s", discovery_info
    )

    area_id = discovery_info["area_id"]
    entering_timer_id = f"{area_id}_entering_timer"

    timer_config = {
        CONF_ID: entering_timer_id,
        CONF_DURATION: "00:00:30",
        CONF_NAME: entering_timer_id,
        CONF_ICON: "",
    }

    async_add_entities([AreaTimer.from_yaml(timer_config)])


class AreaTimer(Timer):
    pass
