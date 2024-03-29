import {
  a5 as e,
  _ as t,
  j as a,
  e as i,
  i as o,
  y as s,
  O as r,
  n,
} from "./main-85e087f9.js";
import { S as d } from "./c.59ae3c13.js";
import { a as u, U as l, b as c, c as m, d as h } from "./c.704dab74.js";
import { s as p } from "./c.468b43fb.js";
import { f as _ } from "./c.89ccd556.js";
import { i as f, a as v, g as y, b, d as g } from "./c.8e31888c.js";
import { p as k } from "./c.ef7f8e16.js";
import { u as w } from "./c.e3f3a0be.js";
import { c as $ } from "./c.d2f13ac1.js";
import { a as j } from "./c.04ecc0ad.js";
import { c as x } from "./c.fa0ef026.js";
import "./c.fea0de05.js";
import "./c.a42008f9.js";
import "./c.388f6c87.js";
import "./c.8e28b461.js";
import "./c.eab7754a.js";
import "./c.2610e8cd.js";
import "./c.743a15a1.js";
import "./c.a0946910.js";
import "./c.7398f5d5.js";
const D = { s: 1, min: 60, h: 3600, d: 86400 };
k && (await k);
const I = (e, t) => B(t).format(e),
  B = e(
    (e) =>
      new Intl.DateTimeFormat(
        "en" !== e.language || w(e) ? e.language : "en-u-hc-h23",
        { hour: "numeric", minute: "2-digit", hour12: w(e) }
      )
  );
e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || w(e) ? e.language : "en-u-hc-h23",
      {
        hour: w(e) ? "numeric" : "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: w(e),
      }
    )
),
  e(
    (e) =>
      new Intl.DateTimeFormat(
        "en" !== e.language || w(e) ? e.language : "en-u-hc-h23",
        {
          weekday: "long",
          hour: w(e) ? "numeric" : "2-digit",
          minute: "2-digit",
          hour12: w(e),
        }
      )
  ),
  e(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: !1,
      })
  );
const T = (e, t, a, i, o) =>
    q(e, a, i, t.entity_id, t.attributes, void 0 !== o ? o : t.state),
  q = (e, t, a, i, o, s) => {
    if (s === u || s === l) return e(`state.default.${s}`);
    if (f(o)) {
      if (
        "duration" === o.device_class &&
        o.unit_of_measurement &&
        D[o.unit_of_measurement]
      )
        try {
          return (
            (r = s), (n = o.unit_of_measurement), p(parseFloat(r) * D[n]) || "0"
          );
        } catch (e) {}
      if ("monetary" === o.device_class)
        try {
          return v(s, t, {
            style: "currency",
            currency: o.unit_of_measurement,
            minimumFractionDigits: 2,
          });
        } catch (e) {}
      const e = o.unit_of_measurement
        ? "%" === o.unit_of_measurement
          ? ((e) => {
              switch (e.language) {
                case "cz":
                case "de":
                case "fi":
                case "fr":
                case "sk":
                case "sv":
                  return " ";
                default:
                  return "";
              }
            })(t) + "%"
          : ` ${o.unit_of_measurement}`
        : "";
      return `${v(s, t, y({ state: s, attributes: o }))}${e}`;
    }
    var r, n;
    const d = $(i);
    if ("input_datetime" === d) {
      if (void 0 === s) {
        let e;
        return o.has_date && o.has_time
          ? ((e = new Date(o.year, o.month - 1, o.day, o.hour, o.minute)),
            b(e, t))
          : o.has_date
          ? ((e = new Date(o.year, o.month - 1, o.day)), _(e, t))
          : o.has_time
          ? ((e = new Date()), e.setHours(o.hour, o.minute), I(e, t))
          : s;
      }
      try {
        const e = s.split(" ");
        if (2 === e.length) return b(new Date(e.join("T")), t);
        if (1 === e.length) {
          if (s.includes("-")) return _(new Date(`${s}T00:00`), t);
          if (s.includes(":")) {
            const e = new Date();
            return I(new Date(`${e.toISOString().split("T")[0]}T${s}`), t);
          }
        }
        return s;
      } catch (e) {
        return s;
      }
    }
    if ("humidifier" === d && "on" === s && o.humidity)
      return `${o.humidity} %`;
    if ("counter" === d || "number" === d || "input_number" === d)
      return v(s, t, y({ state: s, attributes: o }));
    if (
      "button" === d ||
      "input_button" === d ||
      "scene" === d ||
      ("sensor" === d && "timestamp" === o.device_class)
    )
      try {
        return b(new Date(s), t);
      } catch (e) {
        return s;
      }
    var h;
    if ("update" === d)
      return "on" === s
        ? c(o)
          ? j(o, m) && "number" == typeof o.in_progress
            ? e("ui.card.update.installing_with_progress", {
                progress: o.in_progress,
              })
            : e("ui.card.update.installing")
          : o.latest_version
        : o.skipped_version === o.latest_version
        ? null !== (h = o.latest_version) && void 0 !== h
          ? h
          : e("state.default.unavailable")
        : e("ui.card.update.up_to_date");
    const g = a[i];
    return (
      ((null == g ? void 0 : g.translation_key) &&
        e(
          `component.${g.platform}.entity.${d}.${g.translation_key}.state.${s}`
        )) ||
      (o.device_class && e(`component.${d}.state.${o.device_class}.${s}`)) ||
      e(`component.${d}.state._.${s}`) ||
      s
    );
  },
  F = {
    alarm_control_panel: [
      "armed_away",
      "armed_custom_bypass",
      "armed_home",
      "armed_night",
      "armed_vacation",
      "arming",
      "disarmed",
      "disarming",
      "pending",
      "triggered",
    ],
    automation: ["on", "off"],
    binary_sensor: ["on", "off"],
    button: [],
    calendar: ["on", "off"],
    camera: ["idle", "recording", "streaming"],
    cover: ["closed", "closing", "open", "opening"],
    device_tracker: ["home", "not_home"],
    fan: ["on", "off"],
    humidifier: ["on", "off"],
    input_boolean: ["on", "off"],
    input_button: [],
    light: ["on", "off"],
    lock: ["jammed", "locked", "locking", "unlocked", "unlocking"],
    media_player: ["idle", "off", "paused", "playing", "standby"],
    person: ["home", "not_home"],
    remote: ["on", "off"],
    scene: [],
    schedule: ["on", "off"],
    script: ["on", "off"],
    siren: ["on", "off"],
    sun: ["above_horizon", "below_horizon"],
    switch: ["on", "off"],
    timer: ["active", "idle", "paused"],
    update: ["on", "off"],
    vacuum: ["cleaning", "docked", "error", "idle", "paused", "returning"],
    weather: [
      "clear-night",
      "cloudy",
      "exceptional",
      "fog",
      "hail",
      "lightning-rainy",
      "lightning",
      "partlycloudy",
      "pouring",
      "rainy",
      "snowy-rainy",
      "snowy",
      "sunny",
      "windy-variant",
      "windy",
    ],
  },
  C = {
    alarm_control_panel: { code_format: ["number", "text"] },
    binary_sensor: {
      device_class: [
        "battery",
        "battery_charging",
        "co",
        "cold",
        "connectivity",
        "door",
        "garage_door",
        "gas",
        "heat",
        "light",
        "lock",
        "moisture",
        "motion",
        "moving",
        "occupancy",
        "opening",
        "plug",
        "power",
        "presence",
        "problem",
        "running",
        "safety",
        "smoke",
        "sound",
        "tamper",
        "update",
        "vibration",
        "window",
      ],
    },
    button: { device_class: ["restart", "update"] },
    camera: { frontend_stream_type: ["hls", "web_rtc"] },
    climate: {
      hvac_action: ["off", "idle", "heating", "cooling", "drying", "fan"],
    },
    cover: {
      device_class: [
        "awning",
        "blind",
        "curtain",
        "damper",
        "door",
        "garage",
        "gate",
        "shade",
        "shutter",
        "window",
      ],
    },
    humidifier: { device_class: ["humidifier", "dehumidifier"] },
    media_player: {
      device_class: ["tv", "speaker", "receiver"],
      media_content_type: [
        "app",
        "channel",
        "episode",
        "game",
        "image",
        "movie",
        "music",
        "playlist",
        "tvshow",
        "url",
        "video",
      ],
    },
    number: { device_class: ["temperature"] },
    sensor: {
      device_class: [
        "apparent_power",
        "aqi",
        "battery",
        "carbon_dioxide",
        "carbon_monoxide",
        "current",
        "date",
        "duration",
        "energy",
        "frequency",
        "gas",
        "humidity",
        "illuminance",
        "monetary",
        "nitrogen_dioxide",
        "nitrogen_monoxide",
        "nitrous_oxide",
        "ozone",
        "pm1",
        "pm10",
        "pm25",
        "power_factor",
        "power",
        "pressure",
        "reactive_power",
        "signal_strength",
        "sulphur_dioxide",
        "temperature",
        "timestamp",
        "volatile_organic_compounds",
        "voltage",
      ],
      state_class: ["measurement", "total", "total_increasing"],
    },
    switch: { device_class: ["outlet", "switch"] },
    update: { device_class: ["firmware"] },
    water_heater: { away_mode: ["on", "off"] },
  };
t(
  [n("ha-entity-state-picker")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "field",
          decorators: [i({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        { kind: "field", decorators: [i()], key: "entityId", value: void 0 },
        { kind: "field", decorators: [i()], key: "attribute", value: void 0 },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "autofocus",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "disabled",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "required",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean, attribute: "allow-custom-value" })],
          key: "allowCustomValue",
          value: void 0,
        },
        { kind: "field", decorators: [i()], key: "label", value: void 0 },
        { kind: "field", decorators: [i()], key: "value", value: void 0 },
        { kind: "field", decorators: [i()], key: "helper", value: void 0 },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "_opened",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [o("ha-combo-box", !0)],
          key: "_comboBox",
          value: void 0,
        },
        {
          kind: "method",
          key: "shouldUpdate",
          value: function (e) {
            return !(!e.has("_opened") && this._opened);
          },
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            if (e.has("_opened") && this._opened) {
              const e = this.entityId
                ? this.hass.states[this.entityId]
                : void 0;
              this._comboBox.items =
                this.entityId && e
                  ? ((e, t) => {
                      const a = x(e),
                        i = [];
                      switch (
                        (!t && a in F
                          ? i.push(...F[a])
                          : t && a in C && t in C[a] && i.push(...C[a][t]),
                        a)
                      ) {
                        case "climate":
                          t
                            ? "fan_mode" === t
                              ? i.push(...e.attributes.fan_modes)
                              : "preset_mode" === t
                              ? i.push(...e.attributes.preset_modes)
                              : "swing_mode" === t &&
                                i.push(...e.attributes.swing_modes)
                            : i.push(...e.attributes.hvac_modes);
                          break;
                        case "device_tracker":
                        case "person":
                          t || i.push("home", "not_home");
                          break;
                        case "fan":
                          "preset_mode" === t &&
                            i.push(...e.attributes.preset_modes);
                          break;
                        case "humidifier":
                          "mode" === t &&
                            i.push(...e.attributes.available_modes);
                          break;
                        case "input_select":
                        case "select":
                          t || i.push(...e.attributes.options);
                          break;
                        case "light":
                          "effect" === t && e.attributes.effect_list
                            ? i.push(...e.attributes.effect_list)
                            : "color_mode" === t &&
                              e.attributes.supported_color_modes &&
                              i.push(...e.attributes.supported_color_modes);
                          break;
                        case "media_player":
                          "sound_mode" === t
                            ? i.push(...e.attributes.sound_mode_list)
                            : "source" === t &&
                              i.push(...e.attributes.source_list);
                          break;
                        case "remote":
                          "current_activity" === t &&
                            i.push(...e.attributes.activity_list);
                          break;
                        case "sensor":
                          t ||
                            "enum" !== e.attributes.device_class ||
                            i.push(...e.attributes.options);
                          break;
                        case "vacuum":
                          "fan_speed" === t &&
                            i.push(...e.attributes.fan_speed_list);
                          break;
                        case "water_heater":
                          (t && "operation_mode" !== t) ||
                            i.push(...e.attributes.operation_list);
                      }
                      return t || i.push(...h), [...new Set(i)];
                    })(e, this.attribute).map((t) => ({
                      value: t,
                      label: this.attribute
                        ? g(this.hass, t)
                        : T(
                            this.hass.localize,
                            e,
                            this.hass.locale,
                            this.hass.entities,
                            t
                          ),
                    }))
                  : [];
            }
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            var e;
            return this.hass
              ? s`
      <ha-combo-box
        .hass=${this.hass}
        .value=${this._value}
        .autofocus=${this.autofocus}
        .label=${
          null !== (e = this.label) && void 0 !== e
            ? e
            : this.hass.localize(
                "ui.components.entity.entity-state-picker.state"
              )
        }
        .disabled=${this.disabled || !this.entityId}
        .required=${this.required}
        .helper=${this.helper}
        .allowCustomValue=${this.allowCustomValue}
        item-value-path="value"
        item-label-path="label"
        @opened-changed=${this._openedChanged}
        @value-changed=${this._valueChanged}
      >
      </ha-combo-box>
    `
              : s``;
          },
        },
        {
          kind: "get",
          key: "_value",
          value: function () {
            return this.value || "";
          },
        },
        {
          kind: "method",
          key: "_openedChanged",
          value: function (e) {
            this._opened = e.detail.value;
          },
        },
        {
          kind: "method",
          key: "_valueChanged",
          value: function (e) {
            e.stopPropagation();
            const t = e.detail.value;
            t !== this._value && this._setValue(t);
          },
        },
        {
          kind: "method",
          key: "_setValue",
          value: function (e) {
            (this.value = e),
              setTimeout(() => {
                r(this, "value-changed", { value: e }), r(this, "change");
              }, 0);
          },
        },
      ],
    };
  },
  a
);
let z = t(
  [n("ha-selector-state")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        { kind: "field", decorators: [i()], key: "hass", value: void 0 },
        { kind: "field", decorators: [i()], key: "selector", value: void 0 },
        { kind: "field", decorators: [i()], key: "value", value: void 0 },
        { kind: "field", decorators: [i()], key: "label", value: void 0 },
        { kind: "field", decorators: [i()], key: "helper", value: void 0 },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "disabled",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "required",
          value: () => !0,
        },
        { kind: "field", decorators: [i()], key: "context", value: void 0 },
        {
          kind: "method",
          key: "render",
          value: function () {
            var e, t, a, i;
            return s`
      <ha-entity-state-picker
        .hass=${this.hass}
        .entityId=${
          (null === (e = this.selector.state) || void 0 === e
            ? void 0
            : e.entity_id) ||
          (null === (t = this.context) || void 0 === t
            ? void 0
            : t.filter_entity)
        }
        .attribute=${
          (null === (a = this.selector.state) || void 0 === a
            ? void 0
            : a.attribute) ||
          (null === (i = this.context) || void 0 === i
            ? void 0
            : i.filter_attribute)
        }
        .value=${this.value}
        .label=${this.label}
        .helper=${this.helper}
        .disabled=${this.disabled}
        .required=${this.required}
        allow-custom-value
      ></ha-entity-state-picker>
    `;
          },
        },
      ],
    };
  },
  d(a)
);
export { z as HaSelectorState };
