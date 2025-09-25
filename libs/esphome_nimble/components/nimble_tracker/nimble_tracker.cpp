#include "nimble_tracker.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"

// using namespace esphome;
namespace esphome
{
    namespace nimble_tracker
    {
        static const char *const TAG = "nimble_tracker";

        class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
        {
        public:
            MyAdvertisedDeviceCallbacks(NimbleTracker *nimble_tracker)
            {
                nimble_tracker_ = nimble_tracker;
            }

            void onResult(BLEAdvertisedDevice *advertised_device)
            {
                // Because setMaxResults is set to 0 for the NimBLEScan, we need to make a copy
                // of the data of the advertised device, because this is deleted immediately by NimBLESCan
                // after this callback is called.
                auto *tracker_event = new NimbleTrackerEvent(
                    advertised_device->getAddress(),
                    advertised_device->getAddressType(),
                    advertised_device->getRSSI(),
                    advertised_device->getTXPower());

                nimble_tracker_->tracker_events_.push(tracker_event);
            }

        protected:
            NimbleTracker *nimble_tracker_;
        };

        void NimbleTracker::setup()
        {
            // Set the name to empty string to not broadcast the name
            NimBLEDevice::init("");
            this->pBLEScan_ = NimBLEDevice::getScan();
            this->pBLEScan_->setInterval(this->scan_interval_);
            this->pBLEScan_->setWindow(this->scan_window_);
            this->pBLEScan_->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(this), true);
            this->pBLEScan_->setActiveScan(this->scan_active_);
            this->pBLEScan_->setDuplicateFilter(false);
            this->pBLEScan_->setMaxResults(0);

            ESP_LOGV(TAG, "Trying to start the scan");

            if (!pBLEScan_->start(0, nullptr, false))
            {
                ESP_LOGE(TAG, "Error starting continuous ble scan");
                // this->mark_failed();
                return;
            }

            // TODO: It takes some time to setup bluetooth? Why not just move this to loop?
            delay(200);
        }

        void NimbleTracker::loop()
        {
            if (!this->pBLEScan_->isScanning())
            {
                if (!this->pBLEScan_->start(0, nullptr, false))
                {
                    ESP_LOGE(TAG, "Error starting continuous ble scan");
                    return;
                }

                // TODO: we shouldn't block the main thread here, instead work with a setTimeout callback?
                delay(200);
            }

            NimbleTrackerEvent *tracker_event = this->tracker_events_.pop();

            while (tracker_event != nullptr)
            {
                for (NimbleDeviceListener *listener : this->listeners_)
                {
                    listener->parse_event(tracker_event);
                }

                delete tracker_event;
                tracker_event = this->tracker_events_.pop();
            }
        };

    } // namespace esp32_ble_tracker

} // namespace esphome