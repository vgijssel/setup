#pragma once

#include "esphome/core/component.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/nimble_tracker/nimble_tracker.h"

namespace esphome
{
    namespace nimble_rssi
    {
        class NimbleRssiSensor : public sensor::Sensor, public Component, public nimble_tracker::NimbleDeviceListener
        {
        protected:
            bool update_state(nimble_tracker::NimbleTrackerEvent *tracker_event) override;
        };
    } // namespace nimble_rssi
} // namespace esphome