"""Test component setup."""

from homeassistant.setup import async_setup_component
from homeassistant.const import (
    STATE_ON,
)
from custom_components.occupancy.const import DOMAIN
from homeassistant.components.demo.binary_sensor import DemoBinarySensor

async def test_async_setup(hass):
    config = {
        'occupancy': {
            'doors': {
                'front_door': {
                    'entry': True,
                    'contact_sensor': 'binary_sensor.front_door_contact',
                    'motion_sensor': 'binary_sensor.front_door_motion',
                }
            },
            'areas': {
                'hallway': {
                    'occupancy_sensors': ['binary_sensor.hallway_occupancy'],
                    'doors': ['front_door']
                }
            }
        },
    }

    """Test the component gets setup."""
    assert await async_setup_component(hass, DOMAIN, config) is True

async def test_door_contact_sensor(hass, init_integration):
    sensor = DemoBinarySensor(
        None, "Front Door Contact", state=True, device_class='door'
    )
    sensor.hass = hass
    sensor.entity_id = "binary_sensor.front_door_contact"
    await sensor.async_update_ha_state()
    await hass.async_block_till_done()

    assert hass.states.get('occupancy.front_door').state == STATE_ON