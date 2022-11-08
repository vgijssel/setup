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

        bool NimbleDeviceListener::parse_event(NimbleTrackerEvent *tracker_event)
        {
            if (tracker_event->getAddressType() != BLE_ADDR_RANDOM)
            {
                return false;
            }

            auto address = tracker_event->getAddress();
            auto naddress = address.getNative();

            if (ble_ll_resolv_rpa(naddress, this->irk_))
            {
                ESP_LOGD(TAG, "Found device %s", tracker_event->toString().c_str());
                return this->update_state(tracker_event);
            }
            else
            {
                return false;
            }
        };
    } // namespace nimble_tracker

} // namespace esphome