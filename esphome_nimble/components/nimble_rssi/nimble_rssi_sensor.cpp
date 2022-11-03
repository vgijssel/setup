#include "nimble_rssi_sensor.h"

namespace esphome
{
    namespace nimble_rssi
    {
        static const char *const TAG = "nimble_rssi";

        bool NimbleRssiSensor::parse_device(NimBLEAdvertisedDevice *advertised_device)
        {
            if (advertised_device->getAddressType() != BLE_ADDR_RANDOM)
            {
                return false;
            }

            auto address = advertised_device->getAddress();
            auto naddress = address.getNative();

            return ble_ll_resolv_rpa(naddress, this->irk_);
        };

    } // namespace nimble_tracker

} // namespace esphome