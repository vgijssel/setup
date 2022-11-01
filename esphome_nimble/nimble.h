// I think this comes from https://github.com/espressif/mbedtls/blob/mbedtls-3.2.1-idf/include/mbedtls/aes.h
#include "mbedtls/aes.h"

// Defines ESP_LOGD and ensure to use the right namespace
#include "esphome/core/log.h"
using namespace esphome;

// From https://github.com/eblot/tde-nimble/blob/master/nimble/host/include/host/ble_hs.h#L83
#define BLE_HS_EUNKNOWN 17

// for the doIt function methods
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

// for find_if
#include <algorithm>

// Compiling .pioenvs/office-shelly/mbedtls/port/aes/block/esp_aes.o
// is that pointing to https://github.com/espressif/esp-idf/blob/master/components/mbedtls/port/aes/block/esp_aes.c?
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

// TODO: is there the option to extract LocalName? As to stackoverflow ...

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
    {
        ESP_LOGD("apple_watch", "No RPA match %d %02x%02x%02x %02x%02x%02x\n", err, rpa[0], rpa[1], rpa[2], ecb.cipher_text[15], ecb.cipher_text[14], ecb.cipher_text[13]);
        return false;
    }
    else
    {
        ESP_LOGD("apple_watch", "RPA resolved %d %02x%02x%02x %02x%02x%02x\n", err, rpa[0], rpa[1], rpa[2], ecb.cipher_text[15], ecb.cipher_text[14], ecb.cipher_text[13]);
        return true;
    }
}

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

// TODO: setup knownIrks like https://github.com/ESPresense/ESPresense/blob/11a61d20877bc098b7f05ed52ef30ccd1ce555d6/lib/BleFingerprint/BleFingerprintCollection.cpp#L8
// TODO: translate the knownIrks

// Copied from https://github.com/ESPresense/ESPresense/blob/11a61d20877bc098b7f05ed52ef30ccd1ce555d6/lib/BleFingerprint/BleFingerprintCollection.cpp#L111
void doIt(const uint8_t *rpa)
{
    std::string knownIrk("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    ESP_LOGD("apple_watch", "knownIrk length: %d", knownIrk.length());

    std::vector<uint8_t *> irks;
    std::istringstream iss(knownIrk.c_str());
    std::string irk_hex;

    while (iss >> irk_hex)
    {
        uint8_t *irk = new uint8_t[16];
        if (!hextostr(irk_hex.c_str(), irk, 16))
            continue;

        // ESP_LOGD("apple_watch", "stored irk: %s", irk.length());

        irks.push_back(irk);
    }

    ESP_LOGD("apple_watch", "irks length: %d", irks.size());

    // This is the original implementation from lib/BleFingerprint/BleFingerprint.cpp
    // auto naddress = address.getNative();
    // address = NimBLEAddress(advertisedDevice->getAddress());
    // /**
    //  * @brief Get the native representation of the address.
    //  * @return a pointer to the uint8_t[6] array of the address.
    //  */
    auto naddress = rpa;

    // ESP_LOGD("apple_watch", "address length: %d", rpa.size());

    auto it = std::find_if(irks.begin(), irks.end(), [naddress](uint8_t *irk)
                           { return ble_ll_resolv_rpa(naddress, irk); });

    if (it != irks.end())
    {
        auto irk_hex = hexStr(*it, 16);
        // setId(String("irk:") + irk_hex.c_str(), ID_TYPE_KNOWN_IRK);

        ESP_LOGD("apple_watch", "irk found: %s", irk_hex.c_str());
    }
}