#include "nimble_distance_sensor.h"

namespace esphome
{
    namespace nimble_distance
    {
        static const char *const TAG = "nimble_distance";

        bool NimbleDistanceSensor::update_state(NimBLEAdvertisedDevice *advertised_device)
        {
            // this->publish_state(advertised_device->getRSSI());
            return true;
        }
    } // namespace nimble_distance

} // namespace esphome