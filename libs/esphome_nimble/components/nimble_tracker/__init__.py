import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components.esp32 import add_idf_sdkconfig_option
from esphome.const import CONF_ACTIVE, CONF_DURATION, CONF_ID, CONF_INTERVAL

DEPENDENCIES = ["esp32"]

CONF_NIMBLE_ID = "nimble_ble_id"
CONF_SCAN_PARAMETERS = "scan_parameters"

CONF_WINDOW = "window"
CONF_CONTINUOUS = "continuous"

nimble_tracker_ns = cg.esphome_ns.namespace("nimble_tracker")

NimbleTracker = nimble_tracker_ns.class_("NimbleTracker", cg.Component)
NimbleDeviceListener = nimble_tracker_ns.class_("NimbleDeviceListener", cg.Component)


def validate_scan_parameters(config):
    duration = config[CONF_DURATION]
    interval = config[CONF_INTERVAL]
    window = config[CONF_WINDOW]

    if window > interval:
        raise cv.Invalid(
            f"Scan window ({window}) needs to be smaller than scan interval ({interval})"
        )

    if interval.total_milliseconds * 3 > duration.total_milliseconds:
        raise cv.Invalid(
            "Scan duration needs to be at least three times the scan interval to"
            "cover all BLE channels."
        )

    return config


CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(NimbleTracker),
        cv.Optional(CONF_SCAN_PARAMETERS, default={}): cv.All(
            cv.Schema(
                {
                    cv.Optional(
                        CONF_DURATION, default="5min"
                    ): cv.positive_time_period_seconds,
                    cv.Optional(
                        CONF_INTERVAL, default="320ms"
                    ): cv.positive_time_period_milliseconds,
                    cv.Optional(
                        CONF_WINDOW, default="30ms"
                    ): cv.positive_time_period_milliseconds,
                    cv.Optional(CONF_ACTIVE, default=True): cv.boolean,
                    cv.Optional(CONF_CONTINUOUS, default=True): cv.boolean,
                    cv.Optional(CONF_CONTINUOUS, default=True): cv.boolean,
                }
            ),
            validate_scan_parameters,
        ),
    }
).extend(cv.COMPONENT_SCHEMA)

CONF_IRK = "irk"

NIMBLE_DEVICE_LISTENER_SCHEMA = cv.Schema(
    {
        cv.GenerateID(CONF_NIMBLE_ID): cv.use_id(NimbleTracker),
        cv.Optional(CONF_IRK): cv.string,
    },
    cv.has_exactly_one_key(CONF_IRK),
)


async def to_code(config):
    # this initializes the component in the generated code
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)

    params = config[CONF_SCAN_PARAMETERS]
    cg.add(var.set_scan_duration(params[CONF_DURATION]))
    cg.add(var.set_scan_interval(int(params[CONF_INTERVAL].total_milliseconds / 0.625)))
    cg.add(var.set_scan_window(int(params[CONF_WINDOW].total_milliseconds / 0.625)))
    cg.add(var.set_scan_active(params[CONF_ACTIVE]))
    cg.add(var.set_scan_continuous(params[CONF_CONTINUOUS]))

    add_idf_sdkconfig_option("CONFIG_BT_ENABLED", True)
    add_idf_sdkconfig_option("CONFIG_BT_BLUEDROID_ENABLED", False)
    add_idf_sdkconfig_option("CONFIG_BT_NIMBLE_ENABLED", True)
    add_idf_sdkconfig_option("CONFIG_MBEDTLS_HARDWARE_AES", False)

    cg.add_library(
        "esp-nimble-cpp=https://github.com/h2zero/esp-nimble-cpp.git#v1.4.1", None
    )


async def register_ble_device(var, config):
    paren = await cg.get_variable(config[CONF_NIMBLE_ID])
    cg.add(paren.register_listener(var))
    return var


async def device_listener_to_code(var, config):
    if CONF_IRK in config:
        cg.add(var.set_irk(config[CONF_IRK]))
