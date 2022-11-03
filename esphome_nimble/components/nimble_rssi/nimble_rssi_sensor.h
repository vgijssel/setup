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
        public:
            void set_irk(const char *irk)
            {
                this->match_by_ = MATCH_BY_IRK;
                this->irk_ = irk;
            }

            bool parse_device(NimBLEAdvertisedDevice *advertised_device) override;

        protected:
            enum MatchType
            {
                MATCH_BY_IRK,
            };
            MatchType match_by_;
            const char *irk_;
        };

    } // namespace nimble_tracker
} // namespace esphome