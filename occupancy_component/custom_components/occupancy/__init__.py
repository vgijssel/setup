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
from custom_components.occupancy.helper import create_timer

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.components.select import DOMAIN as SELECT_DOMAIN
from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_DOMAIN


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
    data[ATTR_AREAS] = {}
    hass.data[OCCUPANCY_DATA] = data

    for door_id, door_config in config[DOMAIN][ATTR_DOORS].items():
        data[ATTR_DOORS][door_id] = door_config

        hass.async_create_task(
            hass.helpers.discovery.async_load_platform(
                BINARY_SENSOR_DOMAIN, DOMAIN, {"door_id": door_id}, config
            )
        )

    for area_id, area_config in config[DOMAIN][ATTR_AREAS].items():
        area_config = {
            "occupancy_sensors": area_config[ATTR_OCCUPANCY_SENSORS],
            # Adding the binary sensor domain to the door references. Maybe this
            # also requires some validation for the user, so they know they shouldn't
            # provide an entity reference but a door name.
            "doors": [
                f"{BINARY_SENSOR_DOMAIN}.{door}" for door in area_config[ATTR_DOORS]
            ],
        }

        data[ATTR_AREAS][area_id] = area_config

        hass.async_create_task(
            hass.helpers.discovery.async_load_platform(
                SELECT_DOMAIN, DOMAIN, {"area_id": area_id}, config
            )
        )

    await create_timer(hass, "test")

    _LOGGER.debug("async_setup done")
    return True
