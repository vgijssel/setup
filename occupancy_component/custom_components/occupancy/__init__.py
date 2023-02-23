# Setup is very similar to homeassistant/components/compensation/__init__.py
import logging
from homeassistant.helpers.typing import (
    HomeAssistantType,
)

_LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import (
    DOMAIN,
    ATTR_DOORS,
    ATTR_ENTRY,
    ATTR_CONTACT_SENSOR,
    ATTR_MOTION_SENSOR,
    ATTR_AREAS,
    ATTR_OCCUPANCY_SENSORS,
    OCCUPANCY_DATA,
)

import homeassistant.helpers.config_validation as cv
import voluptuous as vol

CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(ATTR_DOORS): vol.Schema(
                    {
                        cv.slug: vol.Schema(
                            {
                                vol.Optional(ATTR_ENTRY): cv.boolean,
                                vol.Optional(ATTR_CONTACT_SENSOR): cv.string,  # or null
                                vol.Optional(ATTR_MOTION_SENSOR): cv.string,  # or null
                            }
                        )
                    }
                ),
                vol.Required(ATTR_AREAS): vol.Schema(
                    {
                        cv.slug: vol.Schema(
                            {
                                vol.Optional(ATTR_OCCUPANCY_SENSORS): vol.All(
                                    cv.ensure_list, [cv.string]
                                ),
                                vol.Optional(ATTR_DOORS): vol.All(
                                    cv.ensure_list, [cv.string]
                                ),
                            }
                        )
                    }
                ),
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistantType, config: dict) -> bool:
    _LOGGER.debug("async_setup start %s", config)

    # Initialize default state for the domain
    data = {}
    data[ATTR_DOORS] = {}
    hass.data[OCCUPANCY_DATA] = data

    for door_id, door_config in config[DOMAIN][ATTR_DOORS].items():
        data["doors"][door_id] = door_config

        hass.async_create_task(
            hass.helpers.discovery.async_load_platform(
                "binary_sensor", DOMAIN, {"door_id": door_id}, config
            )
        )

    _LOGGER.debug("async_setup done")
    return True
