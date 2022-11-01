// Auto generated code by esphome
// ========== AUTO GENERATED INCLUDE BLOCK BEGIN ===========
#include "esphome.h"
using namespace esphome;
using std::isnan;
using std::min;
using std::max;
esp32::ArduinoInternalGPIOPin *esp32_arduinointernalgpiopin_2;
status_led::StatusLED *status_led_statusled;
preferences::IntervalSyncer *preferences_intervalsyncer;
using namespace output;
gpio::GPIOBinaryOutput *relay_output;
esp32::ArduinoInternalGPIOPin *esp32_arduinointernalgpiopin;
#define yield() esphome::yield()
#define millis() esphome::millis()
#define micros() esphome::micros()
#define delay(x) esphome::delay(x)
#define delayMicroseconds(x) esphome::delayMicroseconds(x)
#include "nimble.h"
// ========== AUTO GENERATED INCLUDE BLOCK END ==========="

void setup() {
  // ========== AUTO GENERATED CODE BEGIN ===========
  // esphome:
  //   name: scanner-shelly
  //   build_path: output
  //   platformio_options:
  //     board_build.f_cpu: 160000000L
  //   includes:
  //   - custom_components/nimble.h
  //   libraries: []
  //   name_add_mac_suffix: false
  //   min_version: 2022.10.1
  App.pre_setup("scanner-shelly", __DATE__ ", " __TIME__, false);
  // status_led:
  //   pin:
  //     number: 0
  //     inverted: true
  //     mode:
  //       output: true
  //       input: false
  //       open_drain: false
  //       pullup: false
  //       pulldown: false
  //     id: esp32_arduinointernalgpiopin_2
  //   id: status_led_statusled
  esp32_arduinointernalgpiopin_2 = new esp32::ArduinoInternalGPIOPin();
  esp32_arduinointernalgpiopin_2->set_pin(0);
  esp32_arduinointernalgpiopin_2->set_inverted(true);
  esp32_arduinointernalgpiopin_2->set_flags(gpio::Flags::FLAG_OUTPUT);
  status_led_statusled = new status_led::StatusLED(esp32_arduinointernalgpiopin_2);
  status_led_statusled->set_component_source("status_led");
  App.register_component(status_led_statusled);
  status_led_statusled->pre_setup();
  // substitutions:
  //   device_name: scanner-shelly
  //   entity_id: scanner_shelly
  // esp32:
  //   board: esp32dev
  //   framework:
  //     version: 1.0.6
  //     source: ~3.10006.0
  //     platform_version: platformio/espressif32 @ 3.5.0
  //     type: arduino
  //   variant: ESP32
  // preferences:
  //   id: preferences_intervalsyncer
  //   flash_write_interval: 60s
  preferences_intervalsyncer = new preferences::IntervalSyncer();
  preferences_intervalsyncer->set_write_interval(60000);
  preferences_intervalsyncer->set_component_source("preferences");
  App.register_component(preferences_intervalsyncer);
  // output:
  // output.gpio:
  //   platform: gpio
  //   id: relay_output
  //   pin:
  //     number: 26
  //     mode:
  //       output: true
  //       input: false
  //       open_drain: false
  //       pullup: false
  //       pulldown: false
  //     id: esp32_arduinointernalgpiopin
  //     inverted: false
  relay_output = new gpio::GPIOBinaryOutput();
  relay_output->set_component_source("gpio.output");
  App.register_component(relay_output);
  esp32_arduinointernalgpiopin = new esp32::ArduinoInternalGPIOPin();
  esp32_arduinointernalgpiopin->set_pin(26);
  esp32_arduinointernalgpiopin->set_inverted(false);
  esp32_arduinointernalgpiopin->set_flags(gpio::Flags::FLAG_OUTPUT);
  relay_output->set_pin(esp32_arduinointernalgpiopin);
  // =========== AUTO GENERATED CODE END ============
  App.setup();
}

void loop() {
  App.loop();
}
