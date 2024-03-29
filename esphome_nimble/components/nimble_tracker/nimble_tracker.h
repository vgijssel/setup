#pragma once

#include "esphome/core/component.h"
#include "queue.h"
#include "NimBLEDevice.h"
#include "NimBLEAdvertisedDevice.h"
#include "nimble_device_listener.h"
#include "nimble_tracker_event.h"

namespace esphome
{
    namespace nimble_tracker
    {
        class NimbleTracker : public Component
        {

        public:
            void set_scan_duration(uint32_t scan_duration) { scan_duration_ = scan_duration; }
            void set_scan_interval(uint32_t scan_interval) { scan_interval_ = scan_interval; }
            void set_scan_window(uint32_t scan_window) { scan_window_ = scan_window; }
            void set_scan_active(bool scan_active) { scan_active_ = scan_active; }
            void set_scan_continuous(bool scan_continuous) { scan_continuous_ = scan_continuous; }
            Queue<NimbleTrackerEvent> tracker_events_;

            void setup() override;
            void loop() override;

            void register_listener(NimbleDeviceListener *listener) { listeners_.push_back(listener); }

        protected:
            uint32_t scan_duration_;
            uint32_t scan_interval_;
            uint32_t scan_window_;
            bool scan_active_;
            bool scan_continuous_;
            NimBLEScan *pBLEScan_;
            std::vector<NimbleDeviceListener *> listeners_;
        };
    } // namespace esp32_ble_tracker

} // namespace esphome