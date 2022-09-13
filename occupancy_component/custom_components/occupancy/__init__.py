import logging
from homeassistant.helpers.typing import (
    HomeAssistantType,
)

LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import DOMAIN, ATTR_DOORS, ATTR_ENTRY, ATTR_CONTACT_SENSOR, ATTR_MOTION_SENSOR, ATTR_AREAS, ATTR_OCCUPANCY_SENSORS

ENTITY_ID_FORMAT = DOMAIN + ".{}"

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.entity_component import EntityComponent

CONFIG_SCHEMA = vol.Schema({
    DOMAIN: vol.Schema({
        vol.Required(ATTR_DOORS): vol.Schema({
            cv.slug: vol.Schema({
                vol.Optional(ATTR_ENTRY): cv.boolean, 
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

# TODO:
# - expose an entity through this component
# - expose doors as entities/devices?
# - expose areas as entities/devices?
async def async_setup(hass: HomeAssistantType, config: dict) -> bool:
    component = EntityComponent(LOGGER, DOMAIN, hass)
    entities = []

    for door_id, door_config in config[DOMAIN]['doors'].items():
        entry = door_config.get(ATTR_ENTRY, False)
        contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
        motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

        entities.append(
            Door(door_id, entry, contact_sensor, motion_sensor)
        )

    # await async_add_entities(entities)
    await component.async_add_entities(entities)

    return True


# - open/closed
# - current_activity
# - recent_activity 
# class Door():

class Door(SwitchEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    def __init__(self, door_id: str, entry: bool, contact_sensor:str = None, motion_sensor:str = None):
        """Initialize the Adaptive Lighting switch."""
        self._door_id = ENTITY_ID_FORMAT.format(door_id)
        self._state = False


    @property
    def name(self):
        """Return the name of the device if any."""
        return self._door_id

    @property
    def icon(self) -> str:
        """Icon to use in the frontend, if any."""
        # return self._icon
        return None

    @property
    def is_on(self) -> bool | None:
        """Return true if adaptive lighting is on."""
        return self._state

    # async def async_added_to_hass(self) -> None:
    #     """Call when entity about to be added to hass."""
    #     last_state = await self.async_get_last_state()
    #     _LOGGER.debug("%s: last state is %s", self._name, last_state)
    #     if (last_state is None and self._initial_state) or (
    #         last_state is not None and last_state.state == STATE_ON
    #     ):
    #         await self.async_turn_on()
    #     else:
    #         await self.async_turn_off()

    # async def async_turn_on(self, **kwargs) -> None:
    #     """Turn on adaptive lighting sleep mode."""
    #     self._state = True

    # async def async_turn_off(self, **kwargs) -> None:
    #     """Turn off adaptive lighting sleep mode."""
    #     self._state = False
