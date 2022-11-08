#include "nimble_rssi_sensor.h"

namespace esphome
{
    namespace nimble_rssi
    {
        static const char *const TAG = "nimble_rssi";

        bool NimbleRssiSensor::update_state(nimble_tracker::NimbleTrackerEvent *tracker_event)
        {
            this->publish_state(advertised_device->getRSSI());
            return true;
        }
    } // namespace nimble_rssi

} // namespace esphome