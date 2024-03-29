import {
  _ as e,
  j as t,
  e as i,
  t as a,
  i as s,
  a5 as n,
  y as d,
  O as l,
  n as o,
} from "./main-85e087f9.js";
import "./c.eab7754a.js";
import { c as r } from "./c.d2f13ac1.js";
import { c as u } from "./c.6eb9fcd4.js";
import { c } from "./c.874c8cfd.js";
import "./c.fea0de05.js";
import "./c.50a2e981.js";
const h = (e) => d`<mwc-list-item graphic="avatar" .twoline=${!!e.entity_id}>
    ${
      e.state
        ? d`<state-badge slot="graphic" .stateObj=${e}></state-badge>`
        : ""
    }
    <span>${e.friendly_name}</span>
    <span slot="secondary">${e.entity_id}</span>
  </mwc-list-item>`;
e(
  [o("ha-entity-picker")],
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
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "required",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean, attribute: "allow-custom-entity" })],
          key: "allowCustomEntity",
          value: void 0,
        },
        { kind: "field", decorators: [i()], key: "label", value: void 0 },
        { kind: "field", decorators: [i()], key: "value", value: void 0 },
        { kind: "field", decorators: [i()], key: "helper", value: void 0 },
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
          decorators: [
            i({ type: Array, attribute: "include-unit-of-measurement" }),
          ],
          key: "includeUnitOfMeasurement",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Array, attribute: "include-entities" })],
          key: "includeEntities",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Array, attribute: "exclude-entities" })],
          key: "excludeEntities",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i()],
          key: "entityFilter",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [i({ type: Boolean })],
          key: "hideClearIcon",
          value: () => !1,
        },
        { kind: "field", decorators: [a()], key: "_opened", value: () => !1 },
        {
          kind: "field",
          decorators: [s("ha-combo-box", !0)],
          key: "comboBox",
          value: void 0,
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
        { kind: "field", key: "_initedStates", value: () => !1 },
        { kind: "field", key: "_states", value: () => [] },
        {
          kind: "field",
          key: "_getStates",
          value() {
            return n((e, t, i, a, s, n, d, l, o) => {
              let h = [];
              if (!t) return [];
              let y = Object.keys(t.states);
              return y.length
                ? l
                  ? ((y = y.filter((e) => this.includeEntities.includes(e))),
                    y
                      .map((e) => ({
                        ...t.states[e],
                        friendly_name: u(t.states[e]) || e,
                      }))
                      .sort((e, t) => c(e.friendly_name, t.friendly_name)))
                  : (o && (y = y.filter((e) => !o.includes(e))),
                    i && (y = y.filter((e) => i.includes(r(e)))),
                    a && (y = y.filter((e) => !a.includes(r(e)))),
                    (h = y
                      .map((e) => ({
                        ...t.states[e],
                        friendly_name: u(t.states[e]) || e,
                      }))
                      .sort((e, t) => c(e.friendly_name, t.friendly_name))),
                    n &&
                      (h = h.filter(
                        (e) =>
                          e.entity_id === this.value ||
                          (e.attributes.device_class &&
                            n.includes(e.attributes.device_class))
                      )),
                    d &&
                      (h = h.filter(
                        (e) =>
                          e.entity_id === this.value ||
                          (e.attributes.unit_of_measurement &&
                            d.includes(e.attributes.unit_of_measurement))
                      )),
                    s &&
                      (h = h.filter((e) => e.entity_id === this.value || s(e))),
                    h.length
                      ? h
                      : [
                          {
                            entity_id: "",
                            state: "",
                            last_changed: "",
                            last_updated: "",
                            context: { id: "", user_id: null, parent_id: null },
                            friendly_name: this.hass.localize(
                              "ui.components.entity.entity-picker.no_match"
                            ),
                            attributes: {
                              friendly_name: this.hass.localize(
                                "ui.components.entity.entity-picker.no_match"
                              ),
                              icon: "mdi:magnify",
                            },
                          },
                        ])
                : [
                    {
                      entity_id: "",
                      state: "",
                      last_changed: "",
                      last_updated: "",
                      context: { id: "", user_id: null, parent_id: null },
                      friendly_name: this.hass.localize(
                        "ui.components.entity.entity-picker.no_entities"
                      ),
                      attributes: {
                        friendly_name: this.hass.localize(
                          "ui.components.entity.entity-picker.no_entities"
                        ),
                        icon: "mdi:magnify",
                      },
                    },
                  ];
            });
          },
        },
        {
          kind: "method",
          key: "shouldUpdate",
          value: function (e) {
            return (
              !!(e.has("value") || e.has("label") || e.has("disabled")) ||
              !(!e.has("_opened") && this._opened)
            );
          },
        },
        {
          kind: "method",
          key: "willUpdate",
          value: function (e) {
            (!this._initedStates || (e.has("_opened") && this._opened)) &&
              ((this._states = this._getStates(
                this._opened,
                this.hass,
                this.includeDomains,
                this.excludeDomains,
                this.entityFilter,
                this.includeDeviceClasses,
                this.includeUnitOfMeasurement,
                this.includeEntities,
                this.excludeEntities
              )),
              this._initedStates &&
                (this.comboBox.filteredItems = this._states),
              (this._initedStates = !0));
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            return d`
      <ha-combo-box
        item-value-path="entity_id"
        item-label-path="friendly_name"
        .hass=${this.hass}
        .value=${this._value}
        .label=${
          void 0 === this.label
            ? this.hass.localize("ui.components.entity.entity-picker.entity")
            : this.label
        }
        .helper=${this.helper}
        .allowCustomValue=${this.allowCustomEntity}
        .filteredItems=${this._states}
        .renderer=${h}
        .required=${this.required}
        .disabled=${this.disabled}
        @opened-changed=${this._openedChanged}
        @value-changed=${this._valueChanged}
        @filter-changed=${this._filterChanged}
      >
      </ha-combo-box>
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
          key: "_filterChanged",
          value: function (e) {
            const t = e.detail.value.toLowerCase();
            this.comboBox.filteredItems = this._states.filter(
              (e) =>
                e.entity_id.toLowerCase().includes(t) ||
                u(e).toLowerCase().includes(t)
            );
          },
        },
        {
          kind: "method",
          key: "_setValue",
          value: function (e) {
            (this.value = e),
              setTimeout(() => {
                l(this, "value-changed", { value: e }), l(this, "change");
              }, 0);
          },
        },
      ],
    };
  },
  t
);
