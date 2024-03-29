import {
  _ as e,
  e as i,
  t,
  i as a,
  a5 as s,
  y as d,
  O as o,
  n,
  j as c,
} from "./main-85e087f9.js";
import "./c.eab7754a.js";
import { c as l } from "./c.d2f13ac1.js";
import { s as r } from "./c.874c8cfd.js";
import { a as u, s as h, b as v, d as m } from "./c.1095ea82.js";
import { S as k } from "./c.59ae3c13.js";
import "./c.fea0de05.js";
const f = (e) => d`<mwc-list-item
  .twoline=${!!e.area}
>
  <span>${e.name}</span>
  <span slot="secondary">${e.area}</span>
</mwc-list-item>`;
e(
  [n("ha-device-picker")],
  function (e, n) {
    return {
      F: class extends n {
        constructor(...i) {
          super(...i), e(this);
        }
      },
      d: [
        {
          kind: "field",
          decorators: [i({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        { kind: "field", decorators: [i()], key: "label", value: void 0 },
        { kind: "field", decorators: [i()], key: "value", value: void 0 },
        { kind: "field", decorators: [i()], key: "helper", value: void 0 },
        { kind: "field", decorators: [i()], key: "devices", value: void 0 },
        { kind: "field", decorators: [i()], key: "areas", value: void 0 },
        { kind: "field", decorators: [i()], key: "entities", value: void 0 },
        {
          kind: "field",
          decorators: [i({ type: Array, attribute: "include-domains" })],
          key: "includeDomains",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Array, attribute: "exclude-domains" })],
          key: "excludeDomains",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Array, attribute: "include-device-classes" })],
          key: "includeDeviceClasses",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i()],
          key: "deviceFilter",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "disabled",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "required",
          value: void 0,
        },
        { kind: "field", decorators: [t()], key: "_opened", value: void 0 },
        {
          kind: "field",
          decorators: [a("ha-combo-box", !0)],
          key: "comboBox",
          value: void 0,
        },
        { kind: "field", key: "_init", value: () => !1 },
        {
          kind: "field",
          key: "_getDevices",
          value() {
            return s((e, i, t, a, s, d, o) => {
              if (!e.length)
                return [
                  {
                    id: "no_devices",
                    area: "",
                    name: this.hass.localize(
                      "ui.components.device-picker.no_devices"
                    ),
                  },
                ];
              const n = {};
              if (a || s || d)
                for (const e of t)
                  e.device_id &&
                    (e.device_id in n || (n[e.device_id] = []),
                    n[e.device_id].push(e));
              const c = {};
              for (const e of i) c[e.area_id] = e;
              let h = e.filter((e) => e.id === this.value || !e.disabled_by);
              a &&
                (h = h.filter((e) => {
                  const i = n[e.id];
                  return (
                    !(!i || !i.length) &&
                    n[e.id].some((e) => a.includes(l(e.entity_id)))
                  );
                })),
                s &&
                  (h = h.filter((e) => {
                    const i = n[e.id];
                    return (
                      !i ||
                      !i.length ||
                      t.every((e) => !s.includes(l(e.entity_id)))
                    );
                  })),
                d &&
                  (h = h.filter((e) => {
                    const i = n[e.id];
                    return (
                      !(!i || !i.length) &&
                      n[e.id].some((e) => {
                        const i = this.hass.states[e.entity_id];
                        return (
                          !!i &&
                          i.attributes.device_class &&
                          d.includes(i.attributes.device_class)
                        );
                      })
                    );
                  })),
                o && (h = h.filter((e) => e.id === this.value || o(e)));
              const v = h.map((e) => ({
                id: e.id,
                name: u(e, this.hass, n[e.id]),
                area:
                  e.area_id && c[e.area_id]
                    ? c[e.area_id].name
                    : this.hass.localize("ui.components.device-picker.no_area"),
              }));
              return v.length
                ? 1 === v.length
                  ? v
                  : v.sort((e, i) => r(e.name || "", i.name || ""))
                : [
                    {
                      id: "no_devices",
                      area: "",
                      name: this.hass.localize(
                        "ui.components.device-picker.no_match"
                      ),
                    },
                  ];
            });
          },
        },
        {
          kind: "method",
          key: "open",
          value: async function () {
            var e;
            await this.updateComplete,
              await (null === (e = this.comboBox) || void 0 === e
                ? void 0
                : e.open());
          },
        },
        {
          kind: "method",
          key: "focus",
          value: async function () {
            var e;
            await this.updateComplete,
              await (null === (e = this.comboBox) || void 0 === e
                ? void 0
                : e.focus());
          },
        },
        {
          kind: "method",
          key: "hassSubscribe",
          value: function () {
            return [
              h(this.hass.connection, (e) => {
                this.devices = e;
              }),
              v(this.hass.connection, (e) => {
                this.areas = e;
              }),
              m(this.hass.connection, (e) => {
                this.entities = e;
              }),
            ];
          },
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            ((!this._init && this.devices && this.areas && this.entities) ||
              (this._init && e.has("_opened") && this._opened)) &&
              ((this._init = !0),
              (this.comboBox.items = this._getDevices(
                this.devices,
                this.areas,
                this.entities,
                this.includeDomains,
                this.excludeDomains,
                this.includeDeviceClasses,
                this.deviceFilter
              )));
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            return d`
      <ha-combo-box
        .hass=${this.hass}
        .label=${
          void 0 === this.label && this.hass
            ? this.hass.localize("ui.components.device-picker.device")
            : this.label
        }
        .value=${this._value}
        .helper=${this.helper}
        .renderer=${f}
        .disabled=${this.disabled}
        .required=${this.required}
        item-value-path="id"
        item-label-path="name"
        @opened-changed=${this._openedChanged}
        @value-changed=${this._deviceChanged}
      ></ha-combo-box>
    `;
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
          key: "_deviceChanged",
          value: function (e) {
            e.stopPropagation();
            let i = e.detail.value;
            "no_devices" === i && (i = ""),
              i !== this._value && this._setValue(i);
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
          key: "_setValue",
          value: function (e) {
            (this.value = e),
              setTimeout(() => {
                o(this, "value-changed", { value: e }), o(this, "change");
              }, 0);
          },
        },
      ],
    };
  },
  k(c)
);
