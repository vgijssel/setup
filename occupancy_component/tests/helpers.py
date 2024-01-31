import homeassistant.util.dt as dt_util
from datetime import timedelta
from pytest_homeassistant_custom_component.common import async_fire_time_changed


async def wait(hass, seconds=10):
    next_update = dt_util.utcnow() + timedelta(seconds)
    async_fire_time_changed(hass, next_update)
    await hass.async_block_till_done()
