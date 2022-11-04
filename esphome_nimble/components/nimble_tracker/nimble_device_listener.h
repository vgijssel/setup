#pragma once

#include "NimBLEDevice.h"
#include "string_utils.h"
#include "irk_utils.h"

namespace esphome
{
    namespace nimble_tracker
    {
        class NimbleDeviceListener
        {

        public:
            bool parse_device(NimBLEAdvertisedDevice *advertised_device);
            void set_irk(std::string irk_hex);

        protected:
            virtual bool update_state(NimBLEAdvertisedDevice *advertised_device) = 0;

            enum MatchType
            {
                MATCH_BY_IRK,
            };
            MatchType match_by_;

            uint8_t *irk_;
        };

    } // namespace nimble_tracker

} // namespace esphome