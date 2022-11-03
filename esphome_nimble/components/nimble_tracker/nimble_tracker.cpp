#include "nimble_tracker.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"

// using namespace esphome;
namespace esphome
{
    namespace nimble_tracker
    {
        class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
        {
        public:
            MyAdvertisedDeviceCallbacks(NimbleTracker *nimble_tracker)
            {
                nimble_tracker_ = nimble_tracker;
            }

            void onResult(BLEAdvertisedDevice *advertisedDevice)
            {
                nimble_tracker_->advertised_devices_.push(advertisedDevice);
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
            this->pBLEScan_->setMaxResults(this->max_results_);

            ESP_LOGV("nimble_tracker", "Trying to start the scan");

            if (!pBLEScan_->start(0, nullptr, false))
            {
                ESP_LOGE("nimble_tracker", "Error starting continuous ble scan");
                // this->mark_failed();
                return;
            }

            // TODO: It takes some time to setup bluetooth? Why not just move this to loop?
            delay(200);
        }

        void NimbleTracker::loop()
        {
            if (!pBLEScan_->isScanning())
            {
                if (!pBLEScan_->start(0, nullptr, false))
                {
                    ESP_LOGE("nimble_tracker", "Error starting continuous ble scan");
                    return;
                }

                // TODO: we shouldn't block the main thread here, instead work with a setTimeout callback?
                delay(200);
            }

            BLEAdvertisedDevice *advertised_device = this->advertised_devices_.pop();

            while (advertised_device != nullptr)
            {
                for (NimbleDeviceListener *listener : this->listeners_)
                {
                    listener->parse_device(advertised_device);
                }

                advertised_device = this->advertised_devices_.pop();
            }
        };

    } // namespace esp32_ble_tracker

} // namespace esphome