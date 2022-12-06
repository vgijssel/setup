// Copied from https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/string_utils.cpp
#include "string_utils.h"

namespace esphome
{
    namespace nimble_tracker
    {

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

    } // namespace nimble_tracker

} // namespece esphome