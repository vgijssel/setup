"""pytest fixtures."""
import pytest
from homeassistant.setup import async_setup_component
from custom_components.occupancy.const import DOMAIN

@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations defined in the test dir."""
    yield

@pytest.fixture()
async def init_integration(hass) -> None:
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
    await async_setup_component(hass, DOMAIN, config) is True
    await hass.async_block_till_done()
