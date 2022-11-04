// Copied from https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/string_utils.h
#pragma once
#include <string>

#define Sprintf(f, ...) ({ char* s; asprintf(&s, f, __VA_ARGS__); std::string r = s; free(s); r; })

namespace esphome
{
    namespace nimble_rssi
    {

        std::string hexStr(const uint8_t *data, int len);
        uint8_t hextob(char ch);
        bool hextostr(const std::string &hexStr, uint8_t *output, size_t len);

    } // namespace nimble_rssi

} // namespace esphome
