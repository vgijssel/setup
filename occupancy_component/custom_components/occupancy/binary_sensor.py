"""Platform for sensor integration."""
from __future__ import annotations

from homeassistant.const import TEMP_CELSIUS
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import (
    async_track_state_change_event,
)

from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntityDescription,
    BinarySensorEntity,
)

from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    STATE_OFF,
    STATE_ON,
)

import logging

_LOGGER = logging.getLogger(__name__)

from custom_components.occupancy.const import (
    DOMAIN,
    ATTR_ENTRY,
    ATTR_CONTACT_SENSOR,
    ATTR_MOTION_SENSOR,
    ATTR_DOORS,
    OCCUPANCY_DATA,
)


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Set up the sensor platform."""

    if discovery_info is None:
        return

    data = hass.data[OCCUPANCY_DATA]

    _LOGGER.debug("async_setup_platform called with discovery_info: %s", discovery_info)
    _LOGGER.debug("async_setup_platform called with config: %s", config)
    _LOGGER.debug("async_setup_platform called with data: %s", data)

    door_id = discovery_info["door_id"]
    door_config = data[ATTR_DOORS][door_id]

    entry = door_config.get(ATTR_ENTRY, False)
    contact_sensor = door_config.get(ATTR_CONTACT_SENSOR)
    motion_sensor = door_config.get(ATTR_MOTION_SENSOR)

    async_add_entities(
        [
            Door(
                hass=hass,
                door_id=door_id,
                entry=entry,
                contact_sensor=contact_sensor,
                motion_sensor=motion_sensor,
                entity_description=BinarySensorEntityDescription(
                    key="occupancy_door",
                    name="Door",
                    device_class=BinarySensorDeviceClass.DOOR,
                ),
            )
        ]
    )


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

    @property
    def name(self):
        """Return the name of the device if any."""
        return self._door_id

    @property
    def unique_id(self):
        """Return the unique ID of entity."""
        return self._unique_id

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
