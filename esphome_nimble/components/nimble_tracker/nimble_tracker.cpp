#include "nimble_tracker.h"
#include "esphome/core/log.h"
#include "esphome/core/hal.h"

#include "string_utils.h"

// For the known_irk to irks conversion
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "mbedtls/aes.h"

int bt_encrypt_be(const uint8_t *key, const uint8_t *plaintext, uint8_t *enc_data)
{
    mbedtls_aes_context s = {0};
    mbedtls_aes_init(&s);

    if (mbedtls_aes_setkey_enc(&s, key, 128) != 0)
    {
        mbedtls_aes_free(&s);
        return BLE_HS_EUNKNOWN;
    }

    if (mbedtls_aes_crypt_ecb(&s, MBEDTLS_AES_ENCRYPT, plaintext, enc_data) != 0)
    {
        mbedtls_aes_free(&s);
        return BLE_HS_EUNKNOWN;
    }

    mbedtls_aes_free(&s);
    return 0;
}

struct encryption_block
{
    uint8_t key[16];
    uint8_t plain_text[16];
    uint8_t cipher_text[16];
};

bool ble_ll_resolv_rpa(const uint8_t *rpa, const uint8_t *irk)
{
    struct encryption_block ecb;

    auto irk32 = (const uint32_t *)irk;
    auto key32 = (uint32_t *)&ecb.key[0];
    auto pt32 = (uint32_t *)&ecb.plain_text[0];

    key32[0] = irk32[0];
    key32[1] = irk32[1];
    key32[2] = irk32[2];
    key32[3] = irk32[3];

    pt32[0] = 0;
    pt32[1] = 0;
    pt32[2] = 0;
    pt32[3] = 0;

    ecb.plain_text[15] = rpa[3];
    ecb.plain_text[14] = rpa[4];
    ecb.plain_text[13] = rpa[5];

    auto err = bt_encrypt_be(ecb.key, ecb.plain_text, ecb.cipher_text);

    if (ecb.cipher_text[15] != rpa[0] || ecb.cipher_text[14] != rpa[1] || ecb.cipher_text[13] != rpa[2])
        return false;

    // Serial.printf("RPA resolved %d %02x%02x%02x %02x%02x%02x\n", err, rpa[0], rpa[1], rpa[2], ecb.cipher_text[15], ecb.cipher_text[14], ecb.cipher_text[13]);

    return true;
}

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

            // Set the name to empty string to not broadcast the name
            NimBLEDevice::init("");
            this->pBLEScan_ = NimBLEDevice::getScan();
            this->pBLEScan_->setInterval(this->scan_interval_);
            this->pBLEScan_->setWindow(this->scan_window_);
            this->pBLEScan_->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(this), true);
            this->pBLEScan_->setActiveScan(this->scan_active_);
            this->pBLEScan_->setDuplicateFilter(false);

            // TODO: espresence has this set to 0, but this results REALLY quickly in a crash. Why is that?
            // why does this work there and not here?
            this->pBLEScan_->setMaxResults(50);

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
                            address_type = "random";

                            auto address = advertised_device->getAddress();
                            auto naddress = address.getNative();
                            auto irks = this->irks_;

                            auto it = std::find_if(irks.begin(), irks.end(), [naddress](uint8_t *irk)
                                                   { return ble_ll_resolv_rpa(naddress, irk); });
                            if (it != irks.end())
                            {
                                auto irk_hex = hexStr(*it, 16);

                                ESP_LOGD("nimble_tracker", "Found a match for %s with irk %s", address.toString().c_str(), irk_hex.c_str());
                            }

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