import {
  _ as e,
  e as i,
  t,
  i as a,
  a5 as s,
  y as d,
  J as o,
  n as l,
  k as n,
  j as r,
} from "./main-ec7846c8.js";
import { c } from "./c.d2f13ac1.js";
import { b as h, s as u, d as v, f as _ } from "./c.84dcc549.js";
import { b as m, a as f } from "./c.cb96fbc8.js";
import { S as k } from "./c.79c8c092.js";
import "./c.227858d9.js";
const p = (e) => d`<mwc-list-item
  class=${n({ "add-new": "add_new" === e.area_id })}
>
  ${e.name}
</mwc-list-item>`;
e(
  [l("ha-area-picker")],
  function (e, l) {
    return {
      F: class extends l {
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
        { kind: "field", decorators: [i()], key: "placeholder", value: void 0 },
        {
          kind: "field",
          decorators: [i({ type: Boolean, attribute: "no-add" })],
          key: "noAdd",
          value: void 0,
        },
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
          decorators: [i()],
          key: "entityFilter",
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
        { kind: "field", decorators: [t()], key: "_areas", value: void 0 },
        { kind: "field", decorators: [t()], key: "_devices", value: void 0 },
        { kind: "field", decorators: [t()], key: "_entities", value: void 0 },
        { kind: "field", decorators: [t()], key: "_opened", value: void 0 },
        {
          kind: "field",
          decorators: [a("ha-combo-box", !0)],
          key: "comboBox",
          value: void 0,
        },
        { kind: "field", key: "_filter", value: void 0 },
        { kind: "field", key: "_init", value: () => !1 },
        {
          kind: "method",
          key: "hassSubscribe",
          value: function () {
            return [
              h(this.hass.connection, (e) => {
                this._areas = e;
              }),
              u(this.hass.connection, (e) => {
                this._devices = e;
              }),
              v(this.hass.connection, (e) => {
                this._entities = e;
              }),
            ];
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
          kind: "field",
          key: "_getAreas",
          value() {
            return s((e, i, t, a, s, d, o, l, n) => {
              if (!e.length)
                return [
                  {
                    area_id: "no_areas",
                    name: this.hass.localize(
                      "ui.components.area-picker.no_areas"
                    ),
                    picture: null,
                  },
                ];
              const r = {};
              let h, u;
              if (a || s || d) {
                for (const e of t)
                  e.device_id &&
                    (e.device_id in r || (r[e.device_id] = []),
                    r[e.device_id].push(e));
                (h = i), (u = t.filter((e) => e.area_id));
              } else o && (h = i), l && (u = t.filter((e) => e.area_id));
              a &&
                ((h = h.filter((e) => {
                  const i = r[e.id];
                  return (
                    !(!i || !i.length) &&
                    r[e.id].some((e) => a.includes(c(e.entity_id)))
                  );
                })),
                (u = u.filter((e) => a.includes(c(e.entity_id))))),
                s &&
                  ((h = h.filter((e) => {
                    const i = r[e.id];
                    return (
                      !i ||
                      !i.length ||
                      t.every((e) => !s.includes(c(e.entity_id)))
                    );
                  })),
                  (u = u.filter((e) => !s.includes(c(e.entity_id))))),
                d &&
                  ((h = h.filter((e) => {
                    const i = r[e.id];
                    return (
                      !(!i || !i.length) &&
                      r[e.id].some((e) => {
                        const i = this.hass.states[e.entity_id];
                        return (
                          !!i &&
                          i.attributes.device_class &&
                          d.includes(i.attributes.device_class)
                        );
                      })
                    );
                  })),
                  (u = u.filter((e) => {
                    const i = this.hass.states[e.entity_id];
                    return (
                      i.attributes.device_class &&
                      d.includes(i.attributes.device_class)
                    );
                  }))),
                o && (h = h.filter((e) => o(e))),
                l && (u = u.filter((e) => l(e)));
              let v,
                _ = e;
              var m;
              (h && (v = h.filter((e) => e.area_id).map((e) => e.area_id)),
              u) &&
                (v = (null !== (m = v) && void 0 !== m ? m : []).concat(
                  u.filter((e) => e.area_id).map((e) => e.area_id)
                ));
              return (
                v && (_ = e.filter((e) => v.includes(e.area_id))),
                _.length ||
                  (_ = [
                    {
                      area_id: "no_areas",
                      name: this.hass.localize(
                        "ui.components.area-picker.no_match"
                      ),
                      picture: null,
                    },
                  ]),
                n
                  ? _
                  : [
                      ..._,
                      {
                        area_id: "add_new",
                        name: this.hass.localize(
                          "ui.components.area-picker.add_new"
                        ),
                        picture: null,
                      },
                    ]
              );
            });
          },
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            ((!this._init && this._devices && this._areas && this._entities) ||
              (this._init && e.has("_opened") && this._opened)) &&
              ((this._init = !0),
              (this.comboBox.items = this._getAreas(
                this._areas,
                this._devices,
                this._entities,
                this.includeDomains,
                this.excludeDomains,
                this.includeDeviceClasses,
                this.deviceFilter,
                this.entityFilter,
                this.noAdd
              )));
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            var e;
            return d`
      <ha-combo-box
        .hass=${this.hass}
        .helper=${this.helper}
        item-value-path="area_id"
        item-id-path="area_id"
        item-label-path="name"
        .value=${this.value}
        .disabled=${this.disabled}
        .required=${this.required}
        .label=${
          void 0 === this.label && this.hass
            ? this.hass.localize("ui.components.area-picker.area")
            : this.label
        }
        .placeholder=${
          this.placeholder
            ? null === (e = this._area(this.placeholder)) || void 0 === e
              ? void 0
              : e.name
            : void 0
        }
        .renderer=${p}
        @filter-changed=${this._filterChanged}
        @opened-changed=${this._openedChanged}
        @value-changed=${this._areaChanged}
      >
      </ha-combo-box>
    `;
          },
        },
        {
          kind: "field",
          key: "_area",
          value() {
            return s((e) => {
              var i;
              return null === (i = this._areas) || void 0 === i
                ? void 0
                : i.find((i) => i.area_id === e);
            });
          },
        },
        {
          kind: "method",
          key: "_filterChanged",
          value: function (e) {
            var i, t;
            ((this._filter = e.detail.value), this._filter)
              ? this.noAdd ||
                0 !==
                  (null === (i = this.comboBox._comboBox.filteredItems) ||
                  void 0 === i
                    ? void 0
                    : i.length)
                ? (this.comboBox.filteredItems =
                    null === (t = this.comboBox.items) || void 0 === t
                      ? void 0
                      : t.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(this._filter.toLowerCase())
                        ))
                : (this.comboBox.filteredItems = [
                    {
                      area_id: "add_new_suggestion",
                      name: this.hass.localize(
                        "ui.components.area-picker.add_new_sugestion",
                        { name: this._filter }
                      ),
                      picture: null,
                    },
                  ])
              : (this.comboBox.filteredItems = this.comboBox.items);
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
          key: "_areaChanged",
          value: function (e) {
            e.stopPropagation();
            let i = e.detail.value;
            "no_areas" === i && (i = ""),
              ["add_new_suggestion", "add_new"].includes(i)
                ? ((e.target.value = this._value),
                  m(this, {
                    title: this.hass.localize(
                      "ui.components.area-picker.add_dialog.title"
                    ),
                    text: this.hass.localize(
                      "ui.components.area-picker.add_dialog.text"
                    ),
                    confirmText: this.hass.localize(
                      "ui.components.area-picker.add_dialog.add"
                    ),
                    inputLabel: this.hass.localize(
                      "ui.components.area-picker.add_dialog.name"
                    ),
                    defaultValue:
                      "add_new_suggestion" === i ? this._filter : void 0,
                    confirm: async (e) => {
                      if (e)
                        try {
                          const i = await _(this.hass, { name: e });
                          (this._areas = [...this._areas, i]),
                            (this.comboBox.filteredItems = this._getAreas(
                              this._areas,
                              this._devices,
                              this._entities,
                              this.includeDomains,
                              this.excludeDomains,
                              this.includeDeviceClasses,
                              this.deviceFilter,
                              this.entityFilter,
                              this.noAdd
                            )),
                            await this.updateComplete,
                            await this.comboBox.updateComplete,
                            this._setValue(i.area_id);
                        } catch (e) {
                          f(this, {
                            title: this.hass.localize(
                              "ui.components.area-picker.add_dialog.failed_create_area"
                            ),
                            text: e.message,
                          });
                        }
                    },
                  }))
                : i !== this._value && this._setValue(i);
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
  k(r)
);
