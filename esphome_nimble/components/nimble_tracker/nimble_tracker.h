#include "esphome.h"
#include "esphome/core/component.h"

// using namespace esphome;
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

            void setup() override
            {
                // This will be called once to set up the component
                // think of it as the setup() call in Arduino
                // pinMode(5, INPUT);
                // pinMode(6, OUTPUT);
            }
            void loop() override
            {
                // This will be called very often after setup time.
                // think of it as the loop() call in Arduino
                // if (digitalRead(5))
                // {
                //     digitalWrite(6, HIGH);

                //     // You can also log messages
                //     ESP_LOGD("custom", "The GPIO pin 5 is HIGH!");
                // }
            }

        protected:
            uint32_t scan_duration_;
            uint32_t scan_interval_;
            uint32_t scan_window_;
            bool scan_active_;
            bool scan_continuous_;
        };

    } // namespace esp32_ble_tracker
} // namespace esphome