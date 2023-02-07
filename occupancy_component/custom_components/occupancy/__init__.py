import logging
from homeassistant.helpers.typing import (
    HomeAssistantType,
    EventType,
)
from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    STATE_OFF,
    STATE_ON,
    CONF_SOURCE,
)
from homeassistant.config_entries import SOURCE_IMPORT

from homeassistant.helpers.event import (
    async_track_state_change_event,
)
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntityDescription,
    BinarySensorEntity,
)
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import (
    DOMAIN,
    ATTR_DOORS,
    ATTR_ENTRY,
    ATTR_CONTACT_SENSOR,
    ATTR_MOTION_SENSOR,
    ATTR_AREAS,
    ATTR_OCCUPANCY_SENSORS,
)

# ENTITY_ID_FORMAT = DOMAIN + ".{}"

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.entity_component import EntityComponent

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

# For each occupancy configuration call the async_init method, or update or remove
# hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_IMPORT}, data=firmata_config)
# hass.config_entries.async_update_entry(entry, data=firmata_config)
# hass.config_entries.async_remove(entry.entry_id)
#
# Once this is done call "async_forward_entry_setups" to setup each category of sensors. For example "binary_sensor"
# This will call async_setup_entry in the binary_sensor which in turn will create the actual entities.
#
# why use "async_load_platform" instead of "async_forward_entry_setups"?
#
# Use https://www.home-assistant.io/integrations/firmata and https://www.home-assistant.io/integrations/aws as examples
#
# configuration.yaml is considered an "import" source
async def async_setup(hass: HomeAssistantType, config: dict) -> bool:
    # hass.data[DATA_HASS_CONFIG] = config

    # if (conf := config.get(DOMAIN)) is None:
    #     # create a default conf using default profile
    #     conf = CONFIG_SCHEMA({ATTR_CREDENTIALS: DEFAULT_CREDENTIAL})

    # hass.data[DATA_CONFIG] = conf
    # hass.data[DATA_SESSIONS] = OrderedDict()

    hass.async_create_task(
        hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_IMPORT}, data=config
        )
    )

    return True


# async def async_setup(hass: HomeAssistantType, config: dict) -> bool:
#     _LOGGER.debug("async_setup")
#     # component = EntityComponent(_LOGGER, "binary_sensor", hass)
#     # entities = []

#     # for door_id, door_config in config[DOMAIN]["doors"].items():
#     #     entry = door_config.get(ATTR_ENTRY, False)
#     #     contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
#     #     motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

#     #     entities.append(
#     #         Door(
#     #             hass=hass,
#     #             door_id=door_id,
#     #             entry=entry,
#     #             contact_sensor=contact_sensor,
#     #             motion_sensor=motion_sensor,
#     #             entity_description=BinarySensorEntityDescription(
#     #                 key="occupancy_door"cache_test_results,
#     #                 name="Door",
#     #                 device_class=BinarySensorDeviceClass.DOOR,
#     #             ),
#     #         )
#     #     )

#     # await component.async_add_entities(entities)

#     # return True

#     # print("kerk")
#     # _LOGGER.debug("START")

#     # if DOMAIN in config:
#     #     for entry in config[DOMAIN]:
#     #         _LOGGER.debug("PAPI")
#     #         _LOGGER.debug(entry)
#     #         hass.async_create_task(
#     #             hass.config_entries.flow.async_init(
#     #                 DOMAIN, context={CONF_SOURCE: SOURCE_IMPORT}, data=entry
#     #             )
#     #         )

#     # _LOGGER.debug("END")

#     return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    _LOGGER("async_setup_entry", entry)
    """Set up Hello World from a config entry."""
    # Store an instance of the "connecting" class that does the work of speaking
    # with your actual devices.
    # hass.data.setdefault(DOMAIN, {})[entry.entry_id] = hub.Hub(hass, entry.data["host"])

    # This creates each HA object for each platform your device requires.
    # It's done by calling the `async_setup_entry` function in each platform module.
    # hass.config_entries.async_setup_platforms(entry, PLATFORMS)
    return True


# TODO:
# - [ ] Setup icon when door is open or closes
# so it looks like that the trick is to call the "async_add_entities" on a EntityComponent with domain of "binary_sensor".
# is there a generic way we can add entities like this? So we don't have to create a new EntityComponent for each type of entity?
#
# - [ ] Setup device_class for the door entity sensor
# - [ ] When door opens it is active for X seconds
# - [ ] When door closes it is active for X seconds
# - [ ] When door is open and motion sensor triggers the door should be active for X seconds
# - [ ] When door is closed and motion sensor triggers the door not becomes active
# - [ ] When door is active make icon yellow
# - [ ] Ability to restore state after restart
# - [ ] Should we move the Door sensor to the sensor.py file according to the documentation?
#
# https://www.home-assistant.io/integrations/binary_sensor/#device-class
# Example of various device classes icons in `on` and `off` state. The on image in this example has `state_color: true` specified in the Entities card configuration to receive the icon coloring.
#
# Door is exposes as a sensor, with simply on/off behaviour
# on means there is activity at the door
# active means either
# - door opened from closed state for a duration of (timeout) seconds
# - associated motion sensor is triggering
# change the icon based if the contact sensor is open or closed
# change the color based if there is activity or not (yellow vs blue)


class Door(BinarySensorEntity, RestoreEntity):
    """Representation of a Adaptive Lighting switch."""

    entity_description: BinarySensorEntityDescription

    def __init__(
        self,
        hass,
        door_id: str,
        entry: bool,
        entity_description: BinarySensorEntityDescription,
        contact_sensor: str = None,
        motion_sensor: str = None,
    ):
        self.entity_description = entity_description
        self._attr_is_on = False

        self._hass = hass
        # self._entity_id = ENTITY_ID_FORMAT.format(door_id)

        self._door_id = door_id
        self._unique_id = f"{DOMAIN}_{door_id}"

        self._entry = entry
        self._contact_sensor = contact_sensor
        self._motion_sensor = motion_sensor
        self._remove_listeners = []

    # icons:
    # door-open
    # door-closed

    @property
    def name(self):
        """Return the name of the device if any."""
        return self._door_id

    @property
    def unique_id(self):
        """Return the unique ID of entity."""
        return self._unique_id

    # @property
    # def device_class(self):
    #     parent = super().device_class
    #     _LOGGER.debug(f"the parent device_class is {parent}")

    #     """Return the name of the device if any."""
    #     return parent

    # @property
    # def icon(self) -> str:
    #     parent = super().device_class
    #     _LOGGER.debug(f"the parent iconn is {parent}")

    #     raise (ValueError("kerk"))
    #     """Return the name of the device if any."""
    #     return parent

    #     """Icon to use in the frontend, if any."""
    #     # return self._icon
    #     return None

    # @property
    # def is_on(self) -> bool | None:
    #     """Return true if adaptive lighting is on."""
    #     return self._state

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

        # self._attr_is_on = await self.async_get_last_state()
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

        # from_state = event.data['old_state'].state
        to_state = event.data["new_state"].state

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
            self._attr_is_on = True
        else:
            self._attr_is_on = False

        # TODO: what exactly is the difference between these two methods?
        # self.async_schedule_update_ha_state()
        await self.async_update_ha_state()
