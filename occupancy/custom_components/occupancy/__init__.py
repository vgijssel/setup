import logging
import voluptuous as vol
from occupancy.custom_components.occupancy.const import (
    DOMAIN,
)

LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = vol.Schema({
    DOMAIN: vol.Schema({})
})

# - [ ] setup schema which is used within configuration.yml
# - [ ] each occupancy thing is a device within home assistant re-exposing associated data
# - [ ] exposes a select sensor for the state machine
async def async_setup(hass: core.HomeAssistant, config: dict) -> bool:
    """Set up the Occupancy component."""
    # @TODO: Add setup code.
    return True
