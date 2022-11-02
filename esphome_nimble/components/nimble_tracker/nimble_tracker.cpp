#include "nimble_tracker.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"

#define Sprintf(f, ...) ({ char* s; asprintf(&s, f, __VA_ARGS__); std::string r = s; free(s); r; })

// For the known_irk to irks conversion
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

static constexpr char hexmap[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

std::string hexStr(const uint8_t *data, int len)
{
    std::string s(len * 2, ' ');
    for (int i = 0; i < len; ++i)
    {
        s[2 * i] = hexmap[(data[i] & 0xF0) >> 4];
        s[2 * i + 1] = hexmap[data[i] & 0x0F];
    }
    return s;
}

uint8_t hextob(char ch)
{
    if (ch >= '0' && ch <= '9')
        return ch - '0';
    if (ch >= 'A' && ch <= 'F')
        return ch - 'A' + 10;
    if (ch >= 'a' && ch <= 'f')
        return ch - 'a' + 10;
    return 0;
}

bool hextostr(const std::string &hexStr, uint8_t *output, size_t len)
{
    if (len & 1)
        return false;
    if (hexStr.length() < len * 2)
        return false;
    int k = 0;
    for (size_t i = 0; i < len * 2; i += 2)
        output[k++] = (hextob(hexStr[i]) << 4) | hextob(hexStr[i + 1]);
    return true;
}

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
            std::istringstream iss(this->known_irk_.c_str());
            std::string irk_hex;
            while (iss >> irk_hex)
            {
                uint8_t *irk = new uint8_t[16];
                if (!hextostr(irk_hex.c_str(), irk, 16))
                {
                    ESP_LOGE("nimble_tracker", "Something is wrong with the irk");
                    continue;
                }

                this->irks_.push_back(irk);
            }

            // TODO: instead of doing the hacky global variable, why not add a reference to this to the callback instance?
            global_nimble_tracker = this;

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
                        std::string address_type;
                        switch (advertised_device->getAddressType())
                        {
                        case BLE_ADDR_PUBLIC:
                        {

                            address_type = "public";
                            break;
                        }
                        case BLE_ADDR_PUBLIC_ID:
                        {
                            address_type = "public_id";
                            break;
                        }
                        case BLE_ADDR_RANDOM:
                        {
                            // TODO: try to resolve the irk from the apple watch here with logic from ESPresence.
                            address_type = "random";
                            break;
                        }
                        case BLE_ADDR_RANDOM_ID:
                        {
                            address_type = "random_id";
                            break;
                        }
                        default:
                        {
                            ESP_LOGE("nimble_tracker", "Unknown address type");
                            address_type = "unknown";
                            break;
                        }
                        }
                        ESP_LOGV("nimble_tracker", "Device with RSSI %i Address Type %s: %s", advertised_device->getRSSI(), address_type.c_str(), advertised_device->toString().c_str());
                    }
                }
                advertised_device = this->advertised_devices_.pop();
            }
        };

    } // namespace esp32_ble_tracker

} // namespace esphome