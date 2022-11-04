import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import sensor, nimble_tracker
from esphome.const import (
    DEVICE_CLASS_DISTANCE,
    STATE_CLASS_MEASUREMENT,
    UNIT_METER,
)

CONF_IRK = 'irk'

DEPENDENCIES = ["nimble_tracker"]

nimble_distance_ns = cg.esphome_ns.namespace("nimble_distance")
NimbleDistanceSensor = nimble_distance_ns.class_(
    "NimbleDistanceSensor", sensor.Sensor, cg.Component, nimble_tracker.NimbleDeviceListener
)


CONFIG_SCHEMA = cv.All(
    sensor.sensor_schema(
        NimbleDistanceSensor,
        unit_of_measurement=UNIT_METER,
        accuracy_decimals=2,
        device_class=DEVICE_CLASS_DISTANCE,
        state_class=STATE_CLASS_MEASUREMENT,
    )
    # TODO: move this into nimble_tracker shared schema
    .extend(
        {
            cv.Optional(CONF_IRK): cv.string,
        }
    )
    .extend(nimble_tracker.NIMBLE_DEVICE_SCHEMA)
    .extend(cv.COMPONENT_SCHEMA),
    cv.has_exactly_one_key(CONF_IRK),
)

# TODO: move code generation into nimble_tracker shared code
async def to_code(config):
    var = await sensor.new_sensor(config)
    await cg.register_component(var, config)
    await nimble_tracker.register_ble_device(var, config)

    if CONF_IRK in config:
        cg.add(var.set_irk(config[CONF_IRK]))