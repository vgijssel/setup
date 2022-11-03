#include "nimble_rssi_sensor.h"

namespace esphome
{
    namespace nimble_rssi
    {
        static const char *const TAG = "nimble_rssi";

        bool NimbleRssiSensor::parse_device(NimBLEAdvertisedDevice *advertised_device)
        {
            // TODO: implement irk logic here
            return true;
        }

    } // namespace nimble_tracker

} // namespace esphome