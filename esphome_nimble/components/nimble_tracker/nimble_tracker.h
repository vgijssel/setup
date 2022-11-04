#pragma once

#include "esphome/core/component.h"
#include "queue.h"
#include "NimBLEDevice.h"

namespace esphome
{
    namespace nimble_tracker
    {
        class NimbleDeviceListener
        {
        public:
            virtual bool parse_device(NimBLEAdvertisedDevice *advertised_device) = 0;
        };

        class NimbleTracker : public Component
        {

        public:
            void set_scan_duration(uint32_t scan_duration) { scan_duration_ = scan_duration; }
            void set_scan_interval(uint32_t scan_interval) { scan_interval_ = scan_interval; }
            void set_scan_window(uint32_t scan_window) { scan_window_ = scan_window; }
            void set_scan_active(bool scan_active) { scan_active_ = scan_active; }
            void set_scan_continuous(bool scan_continuous) { scan_continuous_ = scan_continuous; }
            void set_max_results(uint8_t max_results) { max_results_ = max_results; }
            Queue<NimBLEAdvertisedDevice> advertised_devices_;

            void setup() override;
            void loop() override;

            void register_listener(NimbleDeviceListener *listener) { listeners_.push_back(listener); }

        protected:
            uint32_t scan_duration_;
            uint32_t scan_interval_;
            uint32_t scan_window_;
            uint8_t max_results_;
            bool scan_active_;
            bool scan_continuous_;
            NimBLEScan *pBLEScan_;
            std::vector<NimbleDeviceListener *> listeners_;
        };
    } // namespace esp32_ble_tracker

} // namespace esphome