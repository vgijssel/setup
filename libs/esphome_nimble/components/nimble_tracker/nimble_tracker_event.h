#pragma once

#include "NimBLEDevice.h"

namespace esphome
{
    namespace nimble_tracker
    {
        class NimbleTrackerEvent
        {
        public:
            NimbleTrackerEvent(NimBLEAddress address, uint8_t address_type, int rssi, int8_t tx_power);
            int8_t getTXPower();
            int getRSSI();
            uint8_t getAddressType();
            NimBLEAddress getAddress();
            std::string toString();

        protected:
            int8_t tx_power_;
            int rssi_;
            uint8_t address_type_;
            NimBLEAddress address_;
        };

    } // namespace nimble_tracker

} // namespace esphome