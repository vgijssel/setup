#include "nimble_rssi_sensor.h"

namespace esphome
{
    namespace nimble_rssi
    {
        static const char *const TAG = "nimble_rssi";

        bool NimbleRssiSensor::update_state(NimBLEAdvertisedDevice *advertised_device)
        {
            this->publish_state(advertised_device->getRSSI());
            return true;
        }
    } // namespace nimble_tracker

} // namespace esphome