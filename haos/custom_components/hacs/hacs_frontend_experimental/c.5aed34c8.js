import {
  _ as e,
  j as i,
  e as t,
  t as a,
  i as s,
  a5 as d,
  y as o,
  O as l,
  n,
  k as r,
} from "./main-85e087f9.js";
import { c } from "./c.d2f13ac1.js";
import { f as u } from "./c.1095ea82.js";
import { b as h, a as v } from "./c.ccbe2b52.js";
import "./c.fea0de05.js";
const m = (e) => o`<mwc-list-item
  class=${r({ "add-new": "add_new" === e.area_id })}
>
  ${e.name}
</mwc-list-item>`;
e(
  [n("ha-area-picker")],
  function (e, i) {
    return {
      F: class extends i {
        constructor(...i) {
          super(...i), e(this);
        }
      },
      d: [
        {
          kind: "field",
          decorators: [t({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        { kind: "field", decorators: [t()], key: "label", value: void 0 },
        { kind: "field", decorators: [t()], key: "value", value: void 0 },
        { kind: "field", decorators: [t()], key: "helper", value: void 0 },
        { kind: "field", decorators: [t()], key: "placeholder", value: void 0 },
        {
          kind: "field",
          decorators: [t({ type: Boolean, attribute: "no-add" })],
          key: "noAdd",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Array, attribute: "include-domains" })],
          key: "includeDomains",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Array, attribute: "exclude-domains" })],
          key: "excludeDomains",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Array, attribute: "include-device-classes" })],
          key: "includeDeviceClasses",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t()],
          key: "deviceFilter",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t()],
          key: "entityFilter",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "disabled",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "required",
          value: void 0,
        },
        { kind: "field", decorators: [a()], key: "_opened", value: void 0 },
        {
          kind: "field",
          decorators: [s("ha-combo-box", !0)],
          key: "comboBox",
          value: void 0,
        },
        { kind: "field", key: "_suggestion", value: void 0 },
        { kind: "field", key: "_init", value: () => !1 },
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
            return d((e, i, t, a, s, d, o, l, n) => {
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
              let u, h;
              if (a || s || d) {
                for (const e of t)
                  e.device_id &&
                    (e.device_id in r || (r[e.device_id] = []),
                    r[e.device_id].push(e));
                (u = i), (h = t.filter((e) => e.area_id));
              } else o && (u = i), l && (h = t.filter((e) => e.area_id));
              a &&
                ((u = u.filter((e) => {
                  const i = r[e.id];
                  return (
                    !(!i || !i.length) &&
                    r[e.id].some((e) => a.includes(c(e.entity_id)))
                  );
                })),
                (h = h.filter((e) => a.includes(c(e.entity_id))))),
                s &&
                  ((u = u.filter((e) => {
                    const i = r[e.id];
                    return (
                      !i ||
                      !i.length ||
                      t.every((e) => !s.includes(c(e.entity_id)))
                    );
                  })),
                  (h = h.filter((e) => !s.includes(c(e.entity_id))))),
                d &&
                  ((u = u.filter((e) => {
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
                  (h = h.filter((e) => {
                    const i = this.hass.states[e.entity_id];
                    return (
                      i.attributes.device_class &&
                      d.includes(i.attributes.device_class)
                    );
                  }))),
                o && (u = u.filter((e) => o(e))),
                l && (h = h.filter((e) => l(e)));
              let v,
                m = e;
              var _;
              (u && (v = u.filter((e) => e.area_id).map((e) => e.area_id)),
              h) &&
                (v = (null !== (_ = v) && void 0 !== _ ? _ : []).concat(
                  h.filter((e) => e.area_id).map((e) => e.area_id)
                ));
              return (
                v && (m = e.filter((e) => v.includes(e.area_id))),
                m.length ||
                  (m = [
                    {
                      area_id: "no_areas",
                      name: this.hass.localize(
                        "ui.components.area-picker.no_match"
                      ),
                      picture: null,
                    },
                  ]),
                n
                  ? m
                  : [
                      ...m,
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
            ((!this._init && this.hass) ||
              (this._init && e.has("_opened") && this._opened)) &&
              ((this._init = !0),
              (this.comboBox.items = this._getAreas(
                Object.values(this.hass.areas),
                Object.values(this.hass.devices),
                Object.values(this.hass.entities),
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
            return o`
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
            ? null === (e = this.hass.areas[this.placeholder]) || void 0 === e
              ? void 0
              : e.name
            : void 0
        }
        .renderer=${m}
        @filter-changed=${this._filterChanged}
        @opened-changed=${this._openedChanged}
        @value-changed=${this._areaChanged}
      >
      </ha-combo-box>
    `;
          },
        },
        {
          kind: "method",
          key: "_filterChanged",
          value: function (e) {
            var i;
            const t = e.detail.value;
            if (!t)
              return void (this.comboBox.filteredItems = this.comboBox.items);
            const a =
              null === (i = this.comboBox.items) || void 0 === i
                ? void 0
                : i.filter((e) =>
                    e.name.toLowerCase().includes(t.toLowerCase())
                  );
            this.noAdd || 0 !== (null == a ? void 0 : a.length)
              ? (this.comboBox.filteredItems = a)
              : ((this._suggestion = t),
                (this.comboBox.filteredItems = [
                  {
                    area_id: "add_new_suggestion",
                    name: this.hass.localize(
                      "ui.components.area-picker.add_new_sugestion",
                      { name: this._suggestion }
                    ),
                    picture: null,
                  },
                ]));
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
                  h(this, {
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
                      "add_new_suggestion" === i ? this._suggestion : void 0,
                    confirm: async (e) => {
                      if (e)
                        try {
                          const i = await u(this.hass, { name: e }),
                            t = [...Object.values(this.hass.areas), i];
                          (this.comboBox.filteredItems = this._getAreas(
                            t,
                            Object.values(this.hass.devices),
                            Object.values(this.hass.entities),
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
                          v(this, {
                            title: this.hass.localize(
                              "ui.components.area-picker.add_dialog.failed_create_area"
                            ),
                            text: e.message,
                          });
                        }
                    },
                    cancel: () => {
                      this._setValue(void 0), (this._suggestion = void 0);
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
                l(this, "value-changed", { value: e }), l(this, "change");
              }, 0);
          },
        },
      ],
    };
  },
  i
);
