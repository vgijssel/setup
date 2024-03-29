#include "nimble_distance_sensor.h"

namespace esphome
{
    namespace nimble_distance
    {
        static const char *const TAG = "nimble_distance";

        static int median_of_3(int a, int b, int c)
        {
            int the_max = std::max(std::max(a, b), c);
            int the_min = std::min(std::min(a, b), c);
            // unnecessarily clever code
            int the_median = the_max ^ the_min ^ a ^ b ^ c;
            return (the_median);
        }
        int NimbleDistanceSensor::get_1m_rssi(nimble_tracker::NimbleTrackerEvent *tracker_event)
        {
            return this->ref_rssi_ + tracker_event->getTXPower();
        }

        Filter::Filter(float fcmin, float beta, float dcutoff) : one_euro_{OneEuroFilter<float, unsigned long>(1, fcmin, beta, dcutoff)}
        {
        }

        bool Filter::filter(float rssi)
        {
            Reading<float, unsigned long> inter1, inter2;
            // TODO: should we take into consideration micro seconds (returned from esp_timer_get_time())
            // vs mili seconds (implementation used in ESPresence?)
            inter1.timestamp = esp_timer_get_time();
            inter1.value = rssi;

            return this->one_euro_.push(&inter1, &inter2) && this->diff_filter_.push(&inter2, &this->output);
        }

        void NimbleDistanceSensor::setup()
        {
            this->filter_ = new Filter(ONE_EURO_FCMIN, ONE_EURO_BETA, ONE_EURO_DCUTOFF);
        }

        // Defined distance formula using
        // https://medium.com/beingcoders/convert-rssi-value-of-the-ble-bluetooth-low-energy-beacons-to-meters-63259f307283
        // and copied a lot of code from
        // https://github.com/ESPresense/ESPresense/blob/master/lib/BleFingerprint/BleFingerprint.cpp
        bool NimbleDistanceSensor::update_state(nimble_tracker::NimbleTrackerEvent *tracker_event)
        {
            this->oldest_ = this->recent_;
            this->recent_ = this->newest_;
            this->newest_ = tracker_event->getRSSI();
            this->rssi_ = median_of_3(this->oldest_, this->recent_, this->newest_);

            float ratio = (this->get_1m_rssi(tracker_event) - this->rssi_) / (10.0f * this->absorption_);
            float raw = std::pow(10, ratio);

            if (!this->filter_->filter(raw))
            {
                ESP_LOGD(TAG, "Not enough data to calculate distance.");
                return false;
            }

            auto max_distance = 16.0f;
            if (max_distance > 0 && this->filter_->output.value.position > max_distance)
                return false;

            auto skip_distance = 0.5f;
            auto skip_ms = 5000;
            auto skip_micro_seconds = skip_ms * 1000;
            auto now = esp_timer_get_time();

            if ((abs(this->filter_->output.value.position - this->last_reported_position_) < skip_distance) && (this->last_reported_micro_seconds_ > 0) && ((now - this->last_reported_micro_seconds_) < skip_micro_seconds))
            {
                return false;
            }

            this->last_reported_micro_seconds_ = now;
            this->last_reported_position_ = this->filter_->output.value.position;
            this->publish_state(this->filter_->output.value.position);
            return true;
        }
    } // namespace nimble_distance

} // namespace esphome