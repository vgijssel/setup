import logging
from homeassistant.helpers.typing import (
    HomeAssistantType,
    EventType,
)
from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    STATE_OFF,
    STATE_ON,
)
from homeassistant.helpers.event import (
    async_track_state_change_event,
)

_LOGGER = logging.getLogger(__name__)

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
}, extra=vol.ALLOW_EXTRA)

async def async_setup(hass: HomeAssistantType, config: dict) -> bool:
    component = EntityComponent(_LOGGER, DOMAIN, hass)
    entities = []

    for door_id, door_config in config[DOMAIN]['doors'].items():
        entry = door_config.get(ATTR_ENTRY, False)
        contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
        motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

        entities.append(
            Door(hass, door_id, entry, contact_sensor, motion_sensor)
        )

    await component.async_add_entities(entities)

    return True

# TODO:
# - Subscribe to the passed in sensor and motion sensor and generate derived state for the door entity
# - Create area entities represented by a select_input
# - Subscribe to the door entities by the areas and generate state according to the state machine
# - Subscribe to the occupancy sensors and update the state machine accordingly
# - Setup device_class for the door entity sensor
# - Should we move the Door sensor to the sensor.py file according to the documentation?
#
#
# Door is exposes as a sensor, with simply on/off behaviour
# on means there is activity at the door
# active means either
# - door opened from closed state for a duration of (timeout) seconds
# - associated motion sensor is triggering
# change the icon based if the contact sensor is open or closed
# change the color based if there is activity or not (yellow vs blue)
class Door(SwitchEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    def __init__(self, hass, door_id: str, entry: bool, contact_sensor:str = None, motion_sensor:str = None):
        self._hass = hass
        self._door_id = ENTITY_ID_FORMAT.format(door_id)
        self._entry = entry
        self._contact_sensor = contact_sensor
        self._motion_sensor = motion_sensor
        self._state = False
        self._remove_listeners = []

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

    # async def async_turn_on(self, **kwargs) -> None:
    #     """Turn on adaptive lighting sleep mode."""
    #     self._state = True

    # async def async_turn_off(self, **kwargs) -> None:
    #     """Turn off adaptive lighting sleep mode."""
    #     self._state = False

    async def async_added_to_hass(self) -> None:
        """Call when entity about to be added to hass."""
        # await super().async_added_to_hass()

        if self._hass.is_running:
            await self._setup_listeners()
        else:
            self._hass.bus.async_listen_once(
                EVENT_HOMEASSISTANT_STARTED, self._setup_listeners
            )

        # TODO: restore state from associated entities here as well?

        # last_state = await self.async_get_last_state()
        # is_new_entry = last_state is None  # newly added to HA
        # if is_new_entry or last_state.state == STATE_ON:
        #     await self.async_turn_on(adapt_lights=not self._only_once)
        # else:
        #     self._state = False
        #     assert not self.remove_listeners

    async def async_will_remove_from_hass(self):
        self._remove_listeners()

    async def _setup_listeners(self, _=None) -> None:
        _LOGGER.debug("Called '_setup_listeners'")

        remove_contact_sensor = async_track_state_change_event(
            self._hass,
            self._contact_sensor,
            self._contact_sensor_event,
        )

        self._remove_listeners.append(remove_contact_sensor)

    def _remove_listeners(self) -> None:
        while self._remove_listeners:
            remove_listener = self._remove_listeners.pop()
            remove_listener()

    async def _contact_sensor_event(self, event: EventType):
        _LOGGER.debug("Called '_contact_sensor_event' with data %s", event.data)

        from_state = event.data['old_state'].state
        to_state = event.data['new_state'].state

        # Door opened
        if to_state == STATE_ON:
            self._is_door_open = True
            await self._calculate_presence()

        elif to_state == STATE_OFF:
            self._is_door_open = False
            await self._calculate_presence()
        else:
            pass

    async def _calculate_presence(self):
        if self._is_door_open:
            self._state = True
        else:
            self._state = False

        # TODO: what exactly is the difference between these two methods?
        # self.async_schedule_update_ha_state()
        await self.async_update_ha_state()
