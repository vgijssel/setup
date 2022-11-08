#include "nimble_tracker_event.h"

namespace esphome
{
    namespace nimble_tracker
    {
        NimbleTrackerEvent::NimbleTrackerEvent(NimBLEAddress address, uint8_t address_type, int rssi, int8_t tx_power)
        {
            this->address_ = address;
            this->address_type_ = address_type;
            this->rssi_ = rssi;
            this->tx_power_ = tx_power;
        }

        int8_t NimbleTrackerEvent::getTXPower()
        {
            return this->tx_power_;
        }

        int NimbleTrackerEvent::getRSSI()
        {
            return this->rssi_;
        }

        uint8_t NimbleTrackerEvent::getAddressType()
        {
            return this->address_type_;
        }

        NimBLEAddress NimbleTrackerEvent::getAddress()
        {
            return this->address_;
        }

        std::string NimbleTrackerEvent::toString()
        {
            std::string result = "Address: " + this->address_.toString();
            result += " Address type: " + std::to_string(this->address_type_);
            result += " RSSI: " + std::to_string(this->rssi_);
            result += " TX Power: " + std::to_string(this->tx_power_);
            return result;
        }
    } // namespace nimble_tracker

} // namespace esphome