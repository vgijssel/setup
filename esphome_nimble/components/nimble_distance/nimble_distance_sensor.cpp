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

        void NimbleDistanceSensor::setup()
        {
            this->filter_ = new Filter(ONE_EURO_FCMIN, ONE_EURO_BETA, ONE_EURO_DCUTOFF);

            // OneEuroFilter<float, unsigned long> one_euro_(0.1, 0.1, 0.1, 0.1);
            // oneEuro { OneEuroFilter<float, unsigned long>(1, fcmin, beta, dcutoff) }
            // one_euro_
            // {
            //     OneEuroFilter<float, unsigned long>(1, fcmin, beta, dcutoff);
            // }
        }

        bool NimbleDistanceSensor::update_state(NimBLEAdvertisedDevice *advertised_device)
        {
            // this->publish_state(advertised_device->getRSSI());
            return true;
        }
    } // namespace nimble_distance

} // namespace esphome