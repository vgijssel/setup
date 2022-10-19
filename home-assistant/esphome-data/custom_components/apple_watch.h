#include "esphome.h"

// I think this comes from https://github.com/espressif/mbedtls/blob/mbedtls-3.2.1-idf/include/mbedtls/aes.h
#include "mbedtls/aes.h"

// From https://github.com/eblot/tde-nimble/blob/master/nimble/host/include/host/ble_hs.h#L83
#define BLE_HS_EUNKNOWN             17

// Compiling .pioenvs/office-shelly/mbedtls/port/aes/block/esp_aes.o
// is that pointing to https://github.com/espressif/esp-idf/blob/master/components/mbedtls/port/aes/block/esp_aes.c?
// 
// Do we need to set this flag somewhere to get what we want?
// CONFIG_MBEDTLS_HARDWARE_AES
// 
// can ESPHome or platformio override the sdkconfig file? Maybe we need to set the previous flag!

// From https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/BleFingerprint.cpp#L135
int bt_encrypt_be(const uint8_t *key, const uint8_t *plaintext, uint8_t *enc_data)
{
    mbedtls_aes_context s = {0};
    mbedtls_aes_init(&s);

    if (mbedtls_aes_setkey_enc(&s, key, 128) != 0) {
        mbedtls_aes_free(&s);
        return BLE_HS_EUNKNOWN;
    }

    if (mbedtls_aes_crypt_ecb(&s, MBEDTLS_AES_ENCRYPT, plaintext, enc_data) != 0) {
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

bool ble_ll_resolv_rpa(const uint8_t *rpa, const uint8_t *irk) {
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

    if (ecb.cipher_text[15] != rpa[0] || ecb.cipher_text[14] != rpa[1] || ecb.cipher_text[13] != rpa[2]) {

        // ESP_LOGD("ble_adv", "  Advertised manufacturer data:");
        // Serial.printf("No RPA match");
        return false;
    } else {
        // Serial.printf("RPA resolved %d %02x%02x%02x %02x%02x%02x\n", err, rpa[0], rpa[1], rpa[2], ecb.cipher_text[15], ecb.cipher_text[14], ecb.cipher_text[13]);
        return true;
    }
}