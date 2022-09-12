import logging
from homeassistant.helpers.typing import (
    HomeAssistantType,
)

LOGGER = logging.getLogger(__name__)
from custom_components.occupancy.const import DOMAIN, ATTR_DOORS, ATTR_ENTRY, ATTR_CONTACT_SENSOR, ATTR_MOTION_SENSOR, ATTR_AREAS, ATTR_OCCUPANCY_SENSORS
import homeassistant.helpers.config_validation as cv
import voluptuous as vol


CONFIG_SCHEMA = vol.Schema({
    DOMAIN: vol.Schema({
        vol.Required(ATTR_DOORS): vol.Schema({
            cv.slug: vol.Schema({
                vol.Optional(ATTR_ENTRY): cv.boolean, # default false
                vol.Optional(ATTR_CONTACT_SENSOR): cv.string, # or null
                vol.Optional(ATTR_MOTION_SENSOR): cv.string, # or null
            })
        }),
        vol.Required(ATTR_AREAS): vol.Schema({
            cv.slug: vol.Schema({
                vol.Optional(ATTR_OCCUPANCY_SENSORS): vol.All(cv.ensure_list, [cv.string]),
                vol.Optional(ATTR_DOORS): vol.All(cv.ensure_list, [cv.string]),
            })
        })
    })
})

# - [ ] setup schema which is used within configuration.yml
# - [ ] each occupancy thing is a device within home assistant re-exposing associated data
# - [ ] exposes a select sensor for the state machine
async def async_setup(hass: HomeAssistantType, config: dict) -> bool:

    """Set up the Occupancy component."""
    # @TODO: Add setup code.
    return True
