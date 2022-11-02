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
                ESP_LOGV("nimble_tracker", "New device found!!");
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
            this->pBLEScan_->setMaxResults(20);

            ESP_LOGV("nimble_tracker", "Trying to start the scan");

            if (!pBLEScan_->start(0, nullptr, false))
            {
                ESP_LOGE("nimble_tracker", "Error starting continuous ble scan");
                // this->mark_failed();
                return;
            }

            // It takes some time to setup bluetooth?
            delay(200);
        }

        void NimbleTracker::print_device(NimBLEAdvertisedDevice *advertised_device)
        {
            if (xSemaphoreTake(this->print_semaphore_, 1000) == pdTRUE)
            {

                int rssi;
                std::string strManufacturerData = advertised_device->getManufacturerData();
                NimBLEAddress mac = advertised_device->getAddress();
                // int tx_power;

                if (advertised_device->haveRSSI())
                {
                    rssi = advertised_device->getRSSI();
                }
                else
                {
                    rssi = 0;
                }

                ESP_LOGV("nimble_tracker", "Found device with mac %s and rssi %i", mac.toString().c_str(), rssi);

                if (xSemaphoreGive(this->print_semaphore_) != pdTRUE)
                    ESP_LOGE("nimble_tracker", "Couldn't give semaphore!");
            }
            else
            {
                ESP_LOGE("nimble_tracker", "Couldn't take semaphore! Skipping...");
            }

            // if (advertised_device->haveTXPower())
            // {
            //     tx_power = advertised_device->getTXPower();
            // }
            // else
            // {
            //     tx_power = -99;
            // }

            // TODO: how to print the address type of the device?
            // TODO: also print rssi and tx_power!

            // delete strManufacturerData;
        }

        // void NimbeTracker::print()
        // {
        //     std::string strManufacturerData;
        //     int rssi;
        //     NimBLEAddress mac;
        //     strManufacturerData = advertised_device->getManufacturerData();

        //     mac = advertised_device->getAddress();
        //     // int tx_power;

        //     if (advertised_device->haveRSSI())
        //     {
        //         rssi = advertised_device->getRSSI();
        //     }
        //     else
        //     {
        //         rssi = 0;
        //     }

        //     // if (advertised_device->haveTXPower())
        //     // {
        //     //     tx_power = advertised_device->getTXPower();
        //     // }
        //     // else
        //     // {
        //     //     tx_power = -99;
        //     // }

        //     // TODO: how to print the address type of the device?
        //     // TODO: also print rssi and tx_power!
        //     ESP_LOGV("nimble_tracker", "Found device with mac %s and rssi %i", mac.toString().c_str(), rssi);
        // };

        void NimbleTracker::loop()
        {
            ESP_LOGV("nimble_tracker", "Starting loop");

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
                this->print_device(advertised_device);
                // delete advertised_device;

                // ESP_LOGV("nimble_tracker", "Device address: %s", copy->getAddress().toString().c_str());
                // ESP_LOGV("nimble_tracker", "Device: %s", copy->toString().c_str());

                // this->print_device(advertised_device);
                // From lib/BleFingerprint/BleFingerprint.cpp
                // TODO: getting this data results in a crash with error:
                // [V]Guru Meditation Error: Core  0 panic'ed (LoadProhibited). Exception was unhandled.
                // https://github.com/espressif/esp-idf/issues/8848 talks about a solution
                // but this might be because we allocate too many string in the loop? And not cleaning up?
                // should we increase the stack size? Or something?
                // Can we figure out how to decode the backtrace thrown by esp-idf?

                // if (strManufacturerData.length() >= 2)
                // {
                //     std::string manuf = Sprintf("%02x%02x", strManufacturerData[1], strManufacturerData[0]);

                //     ESP_LOGV("nimble_tracker", "Manufacturer data %s", manuf.c_str());
                //     // String manuf = Sprintf("%02x%02x", strManufacturerData[1], strManufacturerData[0]);

                //     // if (manuf == "004c") // Apple
                //     // {
                //     // }
                // }

                // ESP_LOGV("nimble_tracker", "Found device with mac %s", mac.toString().c_str());

                // delete advertised_device;
                advertised_device = this->advertised_devices_.pop();
            }

            ESP_LOGV("nimble_tracker", "Stopping loop");

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