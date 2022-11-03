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

            if (ble_ll_resolv_rpa(naddress, this->irk_))
            {
                ESP_LOGD(TAG, "Found device %s", advertised_device->toString().c_str());
                this->publish_state(advertised_device->getRSSI());
                return true;
            }
            else
            {
                return false;
            }
        };

    } // namespace nimble_tracker

} // namespace esphome