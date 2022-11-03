// Copied from https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/BleFingerprint.cpp
#pragma once

#include "mbedtls/aes.h"

namespace esphome
{
    namespace nimble_tracker
    {
        int bt_encrypt_be(const uint8_t *key, const uint8_t *plaintext, uint8_t *enc_data);

        struct encryption_block
        {
            uint8_t key[16];
            uint8_t plain_text[16];
            uint8_t cipher_text[16];
        };

        bool ble_ll_resolv_rpa(const uint8_t *rpa, const uint8_t *irk);
    } // namespace nimble_tracker

} // namespace esphome
