# Setup is very similar to homeassistant/components/compensation/__init__.py
import logging

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from custom_components.occupancy.const import (
    ATTR_AREAS,
    ATTR_CONTACT_SENSOR,
    ATTR_DOORS,
    ATTR_ENTERING_CONFIRM_TIMER,
    ATTR_ENTERING_TIMER,
    ATTR_ENTRY,
    ATTR_LEAVING_CONFIRM_TIMER,
    ATTR_LEAVING_TIMER,
    ATTR_MOTION_SENSOR,
    ATTR_OCCUPANCY_SENSORS,
    ATTR_TIMER_ENTITIES,
    DOMAIN,
    OCCUPANCY_DATA,
    STATUS_ENTERING,
    STATUS_ENTERING_CONFIRM,
    STATUS_LEAVING,
    STATUS_LEAVING_CONFIRM,
)
from custom_components.occupancy.helpers import create_timer
from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_DOMAIN
from homeassistant.components.select import DOMAIN as SELECT_DOMAIN
from homeassistant.helpers.typing import HomeAssistantType

_LOGGER = logging.getLogger(__name__)

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
    return timer


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
        entering_timer = await _create_area_timer(hass, area_id, STATUS_ENTERING)
        entering_confirm_timer = await _create_area_timer(
            hass, area_id, STATUS_ENTERING_CONFIRM
        )
        leaving_timer = await _create_area_timer(hass, area_id, STATUS_LEAVING)
        leaving_confirm_timer = await _create_area_timer(
            hass, area_id, STATUS_LEAVING_CONFIRM
        )

        area_config = {
            ATTR_TIMER_ENTITIES: [
                entering_timer,
                entering_confirm_timer,
                leaving_timer,
                leaving_confirm_timer,
            ],
            ATTR_OCCUPANCY_SENSORS: area_config[ATTR_OCCUPANCY_SENSORS],
            # Adding the binary sensor domain to the door references. Maybe this
            # also requires some validation for the user, so they know they shouldn't
            # provide an entity reference but a door name.
            ATTR_DOORS: [
                f"{BINARY_SENSOR_DOMAIN}.{door}" for door in area_config[ATTR_DOORS]
            ],
            ATTR_ENTERING_TIMER: entering_timer.entity_id,
            ATTR_ENTERING_CONFIRM_TIMER: entering_confirm_timer.entity_id,
            ATTR_LEAVING_TIMER: leaving_timer.entity_id,
            ATTR_LEAVING_CONFIRM_TIMER: leaving_confirm_timer.entity_id,
        }

        data[ATTR_AREAS][area_id] = area_config

        hass.async_create_task(
            hass.helpers.discovery.async_load_platform(
                SELECT_DOMAIN, DOMAIN, {"area_id": area_id}, config
            )
        )

    _LOGGER.debug("async_setup done")
    return True
