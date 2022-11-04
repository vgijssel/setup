#include "nimble_device_listener.h"
#include "esphome/core/log.h"

namespace esphome
{
    namespace nimble_tracker
    {
        static const char *const TAG = "nimble_device_listener";

        void NimbleDeviceListener::set_irk(std::string irk_hex)
        {
            this->match_by_ = MATCH_BY_IRK;
            this->irk_ = new uint8_t[16];

            if (!hextostr(irk_hex.c_str(), this->irk_, 16))
            {
                // TODO: this logic should be moved to Python validation
                ESP_LOGE(TAG, "Something is wrong with the irk!");
            }
        }

        bool NimbleDeviceListener::parse_device(NimBLEAdvertisedDevice *advertised_device)
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
                return this->update_state(advertised_device);
            }
            else
            {
                return false;
            }
        };
    } // namespace nimble_tracker

} // namespace esphome