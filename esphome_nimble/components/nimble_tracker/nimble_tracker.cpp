#include "nimble_tracker.h"
#include "esphome/core/log.h"

// using namespace esphome;
namespace esphome
{
    namespace nimble_tracker
    {
        class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
        {
            void onResult(BLEAdvertisedDevice *advertisedDevice)
            {
                global_nimble_tracker->advertised_devices_.push(advertisedDevice);
            }
        };

        NimbleTracker *global_nimble_tracker = nullptr;

        void NimbleTracker::setup()
        {
            global_nimble_tracker = this;

            this->pBLEScan_ = NimBLEDevice::getScan();
            this->pBLEScan_->setInterval(this->scan_interval_);
            this->pBLEScan_->setWindow(this->scan_window_);
            this->pBLEScan_->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(), true);
            this->pBLEScan_->setActiveScan(this->scan_active_);
            this->pBLEScan_->setDuplicateFilter(false);
            this->pBLEScan_->setMaxResults(0);

            if (!pBLEScan_->start(0, nullptr, false))
            {
                ESP_LOGE("nimble_tracker", "Error starting continuous ble scan");
                this->mark_failed();
                return;
            }
        }

        void NimbleTracker::loop()
        {
            BLEAdvertisedDevice *advertised_device = this->advertised_devices_.pop();

            while (advertised_device != nullptr)
            {
                NimBLEAddress mac = advertised_device->getAddress();

                ESP_LOGV("nimble_tracker", "Found device with mac %s and address type %s", mac.toString().c_str(), mac.getType().c_str());

                delete advertised_device;
                advertised_device = this->advertised_devices_.pop();
            }

            // if (!pBLEScan_->isScanning())
            // {
            //     if (!pBLEScan_->start(0, nullptr, true))
            //         ESP_LOGE("nimble_tracker", "Error re-starting continuous ble scan");
            //     // delay(3000); // If we stopped scanning, don't query for 3 seconds in order for us to catch any missed broadcasts
            // }
            // else
            // {
            //     // delay(100);
            // }
            // This will be called very often after setup time.
            // think of it as the loop() call in Arduino
            // if (digitalRead(5))
            // {
            //     digitalWrite(6, HIGH);

            //     // You can also log messages
            //     ESP_LOGD("custom", "The GPIO pin 5 is HIGH!");
            // }
        };

    } // namespace esp32_ble_tracker

} // namespace esphome