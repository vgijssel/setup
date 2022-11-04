#pragma once

#include "esphome/core/component.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/nimble_tracker/nimble_tracker.h"

namespace esphome
{
    namespace nimble_distance
    {
        class NimbleDistanceSensor : public sensor::Sensor, public Component, public nimble_tracker::NimbleDeviceListener
        {
        protected:
            bool update_state(NimBLEAdvertisedDevice *advertised_device) override;
        };
    } // namespace nimble_distance
} // namespace esphome