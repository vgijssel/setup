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
    STATE_ENTERING,
    STATE_ENTERING_CONFIRM,
    STATE_LEAVING,
    STATE_LEAVING_CONFIRM,
    ATTR_ENTERING_TIMER,
    ATTR_ENTERING_CONFIRM_TIMER,
    ATTR_LEAVING_TIMER,
    ATTR_LEAVING_CONFIRM_TIMER,
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


async def _create_area_timer(hass, area_id, state):
    timer_id = f"{area_id}_{state}"
    timer = await create_timer(hass, timer_id)
    return timer.entity_id


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
            ATTR_OCCUPANCY_SENSORS: area_config[ATTR_OCCUPANCY_SENSORS],
            # Adding the binary sensor domain to the door references. Maybe this
            # also requires some validation for the user, so they know they shouldn't
            # provide an entity reference but a door name.
            ATTR_DOORS: [
                f"{BINARY_SENSOR_DOMAIN}.{door}" for door in area_config[ATTR_DOORS]
            ],
            ATTR_ENTERING_TIMER: await _create_area_timer(
                hass, area_id, STATE_ENTERING
            ),
            ATTR_ENTERING_CONFIRM_TIMER: await _create_area_timer(
                hass, area_id, STATE_ENTERING_CONFIRM
            ),
            ATTR_LEAVING_TIMER: await _create_area_timer(hass, area_id, STATE_LEAVING),
            ATTR_LEAVING_CONFIRM_TIMER: await _create_area_timer(
                hass, area_id, STATE_LEAVING_CONFIRM
            ),
        }

        data[ATTR_AREAS][area_id] = area_config

        hass.async_create_task(
            hass.helpers.discovery.async_load_platform(
                SELECT_DOMAIN, DOMAIN, {"area_id": area_id}, config
            )
        )

    _LOGGER.debug("async_setup done")
    return True
