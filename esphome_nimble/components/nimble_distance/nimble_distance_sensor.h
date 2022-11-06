#pragma once

// For Filter
#include <cstddef>
#include "esp_timer.h"
#include "SoftFilters.h"
#define ONE_EURO_FCMIN 1e-5f
#define ONE_EURO_BETA 1e-7f
#define ONE_EURO_DCUTOFF 1e-5f

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

        protected:
            bool update_state(NimBLEAdvertisedDevice *advertised_device) override;
            Filter *filter_;
        };
    } // namespace nimble_distance
} // namespace esphome