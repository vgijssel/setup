import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import sensor, nimble_tracker
from esphome.const import (
    DEVICE_CLASS_SIGNAL_STRENGTH,
    STATE_CLASS_MEASUREMENT,
    UNIT_DECIBEL_MILLIWATT,
)

DEPENDENCIES = ["nimble_tracker"]

nimble_rssi_ns = cg.esphome_ns.namespace("nimble_rssi")
NimbleRssiSensor = nimble_rssi_ns.class_(
    "NimbleRssiSensor", sensor.Sensor, cg.Component, nimble_tracker.NimbleDeviceListener
)


CONFIG_SCHEMA = cv.All(
    sensor.sensor_schema(
        NimbleRssiSensor,
        unit_of_measurement=UNIT_DECIBEL_MILLIWATT,
        accuracy_decimals=0,
        device_class=DEVICE_CLASS_SIGNAL_STRENGTH,
        state_class=STATE_CLASS_MEASUREMENT,
    )
    .extend(nimble_tracker.NIMBLE_DEVICE_LISTENER_SCHEMA)
    .extend(cv.COMPONENT_SCHEMA),
)

async def to_code(config):
    var = await sensor.new_sensor(config)
    await cg.register_component(var, config)
    await nimble_tracker.device_listener_to_code(var, config)
    await nimble_tracker.register_ble_device(var, config)