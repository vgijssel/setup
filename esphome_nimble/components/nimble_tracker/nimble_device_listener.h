#pragma once

#include "string_utils.h"
#include "irk_utils.h"
#include "nimble_tracker.h"

namespace esphome
{
    namespace nimble_tracker
    {
        class NimbleDeviceListener
        {

        public:
            bool parse_event(NimbleTrackerEvent *tracker_event);
            void set_irk(std::string irk_hex);

        protected:
            virtual bool update_state(NimbleTrackerEvent *tracker_event) = 0;

            enum MatchType
            {
                MATCH_BY_IRK,
            };
            MatchType match_by_;

            uint8_t *irk_;
        };

    } // namespace nimble_tracker

} // namespace esphome