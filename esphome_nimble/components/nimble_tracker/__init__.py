import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components.esp32 import add_idf_sdkconfig_option
from esphome.const import (
    CONF_ACTIVE,
    CONF_ID,
    CONF_INTERVAL,
    CONF_DURATION,
)

DEPENDENCIES = ["esp32"]

CONF_NIMBLE_ID = "nimble_ble_id"
CONF_SCAN_PARAMETERS = "scan_parameters"

CONF_WINDOW = "window"
CONF_CONTINUOUS = "continuous"

# CONF_ON_SCAN_END = "on_scan_end"
nimble_tracker_ns = cg.esphome_ns.namespace("nimble_tracker")

NimbleTracker = nimble_tracker_ns.class_("NimbleTracker", cg.Component)
NimbleDeviceListener = nimble_tracker_ns.class_("NimbleDeviceListener", cg.Component)

# ESPBTClient = nimble_tracker_ns.class_("ESPBTClient")
# ESPBTDeviceListener = nimble_tracker_ns.class_("ESPBTDeviceListener")
# ESPBTDevice = nimble_tracker_ns.class_("ESPBTDevice")
# ESPBTDeviceConstRef = ESPBTDevice.operator("ref").operator("const")
# adv_data_t = cg.std_vector.template(cg.uint8)
# adv_data_t_const_ref = adv_data_t.operator("ref").operator("const")
# Triggers
# ESPBTAdvertiseTrigger = nimble_tracker_ns.class_(
#     "ESPBTAdvertiseTrigger", automation.Trigger.template(ESPBTDeviceConstRef)
# )
# BLEServiceDataAdvertiseTrigger = nimble_tracker_ns.class_(
#     "BLEServiceDataAdvertiseTrigger", automation.Trigger.template(adv_data_t_const_ref)
# )
# BLEManufacturerDataAdvertiseTrigger = nimble_tracker_ns.class_(
#     "BLEManufacturerDataAdvertiseTrigger",
#     automation.Trigger.template(adv_data_t_const_ref),
# )
# BLEEndOfScanTrigger = nimble_tracker_ns.class_(
#     "BLEEndOfScanTrigger", automation.Trigger.template()
# )
# Actions
# ESP32BLEStartScanAction = nimble_tracker_ns.class_(
#     "ESP32BLEStartScanAction", automation.Action
# )
# ESP32BLEStopScanAction = nimble_tracker_ns.class_(
#     "ESP32BLEStopScanAction", automation.Action
# )


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


# bt_uuid16_format = "XXXX"
# bt_uuid32_format = "XXXXXXXX"
# bt_uuid128_format = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"


# def bt_uuid(value):
#     in_value = cv.string_strict(value)
#     value = in_value.upper()

#     if len(value) == len(bt_uuid16_format):
#         pattern = re.compile("^[A-F|0-9]{4,}$")
#         if not pattern.match(value):
#             raise cv.Invalid(
#                 f"Invalid hexadecimal value for 16 bit UUID format: '{in_value}'"
#             )
#         return value
#     if len(value) == len(bt_uuid32_format):
#         pattern = re.compile("^[A-F|0-9]{8,}$")
#         if not pattern.match(value):
#             raise cv.Invalid(
#                 f"Invalid hexadecimal value for 32 bit UUID format: '{in_value}'"
#             )
#         return value
#     if len(value) == len(bt_uuid128_format):
#         pattern = re.compile(
#             "^[A-F|0-9]{8,}-[A-F|0-9]{4,}-[A-F|0-9]{4,}-[A-F|0-9]{4,}-[A-F|0-9]{12,}$"
#         )
#         if not pattern.match(value):
#             raise cv.Invalid(
#                 f"Invalid hexadecimal value for 128 UUID format: '{in_value}'"
#             )
#         return value
#     raise cv.Invalid(
#         f"Service UUID must be in 16 bit '{bt_uuid16_format}', 32 bit '{bt_uuid32_format}', or 128 bit '{bt_uuid128_format}' format"
#     )


# def as_hex(value):
#     return cg.RawExpression(f"0x{value}ULL")


# def as_hex_array(value):
#     value = value.replace("-", "")
#     cpp_array = [
#         f"0x{part}" for part in [value[i : i + 2] for i in range(0, len(value), 2)]
#     ]
#     return cg.RawExpression(f"(uint8_t*)(const uint8_t[16]){{{','.join(cpp_array)}}}")


# def as_reversed_hex_array(value):
#     value = value.replace("-", "")
#     cpp_array = [
#         f"0x{part}" for part in [value[i : i + 2] for i in range(0, len(value), 2)]
#     ]
#     return cg.RawExpression(
#         f"(uint8_t*)(const uint8_t[16]){{{','.join(reversed(cpp_array))}}}"
#     )

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
                }
            ),
            validate_scan_parameters,
        ),
        # cv.Optional(CONF_ON_BLE_ADVERTISE): automation.validate_automation(
        #     {
        #         cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(ESPBTAdvertiseTrigger),
        #         cv.Optional(CONF_MAC_ADDRESS): cv.mac_address,
        #     }
        # ),
        # cv.Optional(CONF_ON_BLE_SERVICE_DATA_ADVERTISE): automation.validate_automation(
        #     {
        #         cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(
        #             BLEServiceDataAdvertiseTrigger
        #         ),
        #         cv.Optional(CONF_MAC_ADDRESS): cv.mac_address,
        #         cv.Required(CONF_SERVICE_UUID): bt_uuid,
        #     }
        # ),
        # cv.Optional(
        #     CONF_ON_BLE_MANUFACTURER_DATA_ADVERTISE
        # ): automation.validate_automation(
        #     {
        #         cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(
        #             BLEManufacturerDataAdvertiseTrigger
        #         ),
        #         cv.Optional(CONF_MAC_ADDRESS): cv.mac_address,
        #         cv.Required(CONF_MANUFACTURER_ID): bt_uuid,
        #     }
        # ),
        # cv.Optional(CONF_ON_SCAN_END): automation.validate_automation(
        #     {cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(BLEEndOfScanTrigger)}
        # ),
    }
).extend(cv.COMPONENT_SCHEMA)

NIMBLE_DEVICE_SCHEMA = cv.Schema(
    {
        cv.GenerateID(CONF_NIMBLE_ID): cv.use_id(NimbleTracker),
    }
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

    cg.add_library("esp-nimble-cpp=https://github.com/h2zero/esp-nimble-cpp.git#v1.4.1", None)


async def register_ble_device(var, config):
    paren = await cg.get_variable(config[CONF_NIMBLE_ID])
    cg.add(paren.register_listener(var))
    return var