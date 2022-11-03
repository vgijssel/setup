#pragma once

#include "esphome/core/component.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/nimble_tracker/nimble_tracker.h"

#include "string_utils.h"
#include "irk_utils.h"

namespace esphome
{
    namespace nimble_rssi
    {
        class NimbleRssiSensor : public sensor::Sensor, public Component, public nimble_tracker::NimbleDeviceListener
        {
        public:
            void set_irk(std::string irk_hex)
            {
                this->match_by_ = MATCH_BY_IRK;
                this->irk_ = new uint8_t[16];

                if (!hextostr(irk_hex.c_str(), this->irk_, 16))
                {
                    ESP_LOGE("nimble_rssi", "Something is wrong with the irk!");
                }
            }

            bool parse_device(NimBLEAdvertisedDevice *advertised_device) override;

        protected:
            enum MatchType
            {
                MATCH_BY_IRK,
            };
            MatchType match_by_;

            uint8_t *irk_;
        };

    } // namespace nimble_tracker
} // namespace esphome