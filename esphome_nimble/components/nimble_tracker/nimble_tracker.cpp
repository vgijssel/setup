#include "nimble_tracker.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"

#define Sprintf(f, ...) ({ char* s; asprintf(&s, f, __VA_ARGS__); std::string r = s; free(s); r; })

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
            // TODO: instead of doing the hacky global variable, why not add a reference to this to the callback instance?
            global_nimble_tracker = this;

            this->print_semaphore_ = xSemaphoreCreateBinary();
            xSemaphoreGive(this->print_semaphore_);

            // Set the name to empty string to not broadcast the name
            NimBLEDevice::init("");
            this->pBLEScan_ = NimBLEDevice::getScan();
            this->pBLEScan_->setInterval(this->scan_interval_);
            this->pBLEScan_->setWindow(this->scan_window_);
            this->pBLEScan_->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(), true);
            this->pBLEScan_->setActiveScan(this->scan_active_);
            this->pBLEScan_->setDuplicateFilter(false);

            // TODO: espresence has this set to 0, but this results REALLY quickly in a crash. Why is that?
            // why does this work there and not here?
            this->pBLEScan_->setMaxResults(20);

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
                std::string strManufacturerData = advertised_device->getManufacturerData();

                if (strManufacturerData.length() >= 2)
                {
                    std::string manuf = Sprintf("%02x%02x", strManufacturerData[1], strManufacturerData[0]);

                    if (manuf == "004c")
                    {
                        ESP_LOGV("nimble_tracker", "Device found with RSSI %i: %s", advertised_device->getRSSI(), advertised_device->toString().c_str());
                    }
                }

                advertised_device = this->advertised_devices_.pop();
            }
        };

    } // namespace esp32_ble_tracker

} // namespace esphome