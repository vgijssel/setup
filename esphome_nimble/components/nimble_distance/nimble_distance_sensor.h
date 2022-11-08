#pragma once

// For Filter
#include <cstddef>
#include "esp_timer.h"
#include "SoftFilters.h"
// #define ONE_EURO_FCMIN 1e-5f
// #define ONE_EURO_BETA 1e-7f
// #define ONE_EURO_DCUTOFF 1e-5f

// From https://github.com/rpatel3001/BleDistance/blob/master/ble_dist.h
#define ONE_EURO_FCMIN 0.0001
#define ONE_EURO_BETA 0.05
#define ONE_EURO_DCUTOFF 1.0

#define NO_RSSI (-128)
#define DEFAULT_TX (-6)

// For NimbleDistanceSensor
#include "esphome/core/component.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/nimble_tracker/nimble_tracker.h"

namespace esphome
{
    namespace nimble_distance
    {
        class Filter
        {
        public:
            Filter(float fcmin, float beta, float dcutoff);
            bool filter(float rssi);
            Reading<Differential<float>> output;

        protected:
            OneEuroFilter<float, unsigned long> one_euro_;
            DifferentialFilter<float, unsigned long> diff_filter_;
        };

        class NimbleDistanceSensor : public sensor::Sensor,
                                     public Component,
                                     public nimble_tracker::NimbleDeviceListener
        {
        public:
            void setup() override;
            int get_1m_rssi(nimble_tracker::NimbleTrackerEvent *tracker_event);

        protected:
            bool update_state(nimble_tracker::NimbleTrackerEvent *tracker_event) override;
            Filter *filter_;
            int rssi_ = NO_RSSI, newest_ = NO_RSSI, recent_ = NO_RSSI, oldest_ = NO_RSSI;

            int8_t ref_rssi_ = -65;
            float absorption_ = 3.5f;
            float last_reported_position_ = 0;
            int64_t last_reported_micro_seconds_ = 0;
        };
    } // namespace nimble_distance
} // namespace esphome