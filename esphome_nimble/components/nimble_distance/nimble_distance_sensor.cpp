// Defined distance formula using
// https://medium.com/beingcoders/convert-rssi-value-of-the-ble-bluetooth-low-energy-beacons-to-meters-63259f307283
// and copied code from
// https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/BleFingerprint.cpp
#include "nimble_distance_sensor.h"

namespace esphome
{
    namespace nimble_distance
    {
        static const char *const TAG = "nimble_distance";

        Filter::Filter(float fcmin, float beta, float dcutoff) : one_euro_{OneEuroFilter<float, unsigned long>(1, fcmin, beta, dcutoff)}
        {
        }

        bool Filter::filter(float rssi)
        {
            Reading<float, unsigned long> inter1, inter2;
            inter1.timestamp = esp_timer_get_time();
            inter1.value = rssi;

            return this->one_euro_.push(&inter1, &inter2) && this->diff_filter_.push(&inter2, &this->output);
        }

        void NimbleDistanceSensor::setup()
        {
            this->filter_ = new Filter(ONE_EURO_FCMIN, ONE_EURO_BETA, ONE_EURO_DCUTOFF);
        }

        bool NimbleDistanceSensor::update_state(NimBLEAdvertisedDevice *advertised_device)
        {
            // auto output = this->filter_->filter(advertised_device->getRSSI());
            if (!this->filter_->filter(advertised_device->getRSSI()))
            {
                return false;
            }

            this->publish_state(this->filter_->output.value.position);
            return true;
        }
    } // namespace nimble_distance

} // namespace esphome