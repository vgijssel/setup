#include "irk_utils.h"

namespace esphome
{
    namespace nimble_tracker
    {
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

            return true;
        }

    } // namespace nimble_tracker

} // namespace esphome
