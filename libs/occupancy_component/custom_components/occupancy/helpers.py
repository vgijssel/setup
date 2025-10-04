from homeassistant.components.timer import CONF_DURATION, CONF_ICON, CONF_ID, CONF_NAME
from homeassistant.components.timer import DOMAIN as TIMER_DOMAIN
from homeassistant.components.timer import Timer
from homeassistant.helpers.entity_platform import async_get_platforms
from homeassistant.setup import async_setup_component


def find_platform(hass, domain):
    platform_list = async_get_platforms(hass, domain)

    for platform in platform_list:
        if platform.domain == domain:
            return platform

    return None


async def get_platform(hass, domain):
    platform = find_platform(hass, domain)

    if platform is not None:
        return platform

    # Setup the domain because it's not already set up
    await async_setup_component(hass, domain, {})

    platform = find_platform(hass, domain)

    if platform is None:
        raise ValueError(f"Unable to load {domain} platform")
    return platform


async def create_timer(hass, name):
    timer_platform = await get_platform(hass, TIMER_DOMAIN)

    timer_config = {
        CONF_ID: name,
        CONF_DURATION: "00:00:30",
        CONF_NAME: name,
        CONF_ICON: "",
    }

    timer = Timer.from_yaml(timer_config)
    await timer_platform.async_add_entities([timer])
    return timer
