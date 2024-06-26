export const id = 5734;
export const ids = [5734];
export const modules = {
  25718: (e, i, t) => {
    var a = t(309),
      s = t(5095),
      d = t(95260),
      r = t(53180),
      l = t(14516),
      n = t(18394),
      o = t(36655),
      u = t(1913),
      c = t(97477),
      h = t(16061),
      v = t(11285);
    t(16591), t(54371), t(90532), t(37662);
    const k = (e) =>
      s.dy`<ha-list-item class="${(0, r.$)({
        "add-new": "add_new" === e.area_id,
      })}"> ${e.name} </ha-list-item>`;
    (0, a.Z)(
      [(0, d.Mo)("ha-area-picker")],
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
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "placeholder",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean, attribute: "no-add" })],
              key: "noAdd",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "include-domains" }),
              ],
              key: "includeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "exclude-domains" }),
              ],
              key: "excludeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "include-device-classes" }),
              ],
              key: "includeDeviceClasses",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "exclude-areas" }),
              ],
              key: "excludeAreas",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "deviceFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "entityFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_opened",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.IO)("ha-combo-box", !0)],
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
                return (0, l.Z)((e, i, t, a, s, d, r, l, n, u) => {
                  if (!e.length)
                    return [
                      {
                        area_id: "no_areas",
                        name: this.hass.localize(
                          "ui.components.area-picker.no_areas"
                        ),
                        picture: null,
                        aliases: [],
                      },
                    ];
                  let c,
                    v,
                    k = {};
                  (a || s || d || r || l) &&
                    ((k = (0, h.R6)(t)),
                    (c = i),
                    (v = t.filter((e) => e.area_id)),
                    a &&
                      ((c = c.filter((e) => {
                        const i = k[e.id];
                        return (
                          !(!i || !i.length) &&
                          k[e.id].some((e) => a.includes((0, o.M)(e.entity_id)))
                        );
                      })),
                      (v = v.filter((e) => a.includes((0, o.M)(e.entity_id))))),
                    s &&
                      ((c = c.filter((e) => {
                        const i = k[e.id];
                        return (
                          !i ||
                          !i.length ||
                          t.every((e) => !s.includes((0, o.M)(e.entity_id)))
                        );
                      })),
                      (v = v.filter(
                        (e) => !s.includes((0, o.M)(e.entity_id))
                      ))),
                    d &&
                      ((c = c.filter((e) => {
                        const i = k[e.id];
                        return (
                          !(!i || !i.length) &&
                          k[e.id].some((e) => {
                            const i = this.hass.states[e.entity_id];
                            return (
                              !!i &&
                              i.attributes.device_class &&
                              d.includes(i.attributes.device_class)
                            );
                          })
                        );
                      })),
                      (v = v.filter((e) => {
                        const i = this.hass.states[e.entity_id];
                        return (
                          i.attributes.device_class &&
                          d.includes(i.attributes.device_class)
                        );
                      }))),
                    r && (c = c.filter((e) => r(e))),
                    l &&
                      ((c = c.filter((e) => {
                        const i = k[e.id];
                        return (
                          !(!i || !i.length) &&
                          k[e.id].some((e) => {
                            const i = this.hass.states[e.entity_id];
                            return !!i && l(i);
                          })
                        );
                      })),
                      (v = v.filter((e) => {
                        const i = this.hass.states[e.entity_id];
                        return !!i && l(i);
                      }))));
                  let y,
                    b = e;
                  var p;
                  (c && (y = c.filter((e) => e.area_id).map((e) => e.area_id)),
                  v) &&
                    (y = (null !== (p = y) && void 0 !== p ? p : []).concat(
                      v.filter((e) => e.area_id).map((e) => e.area_id)
                    ));
                  return (
                    y && (b = e.filter((e) => y.includes(e.area_id))),
                    u && (b = b.filter((e) => !u.includes(e.area_id))),
                    b.length ||
                      (b = [
                        {
                          area_id: "no_areas",
                          name: this.hass.localize(
                            "ui.components.area-picker.no_match"
                          ),
                          picture: null,
                          aliases: [],
                        },
                      ]),
                    n
                      ? b
                      : [
                          ...b,
                          {
                            area_id: "add_new",
                            name: this.hass.localize(
                              "ui.components.area-picker.add_new"
                            ),
                            picture: null,
                            aliases: [],
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
                if (
                  (!this._init && this.hass) ||
                  (this._init && e.has("_opened") && this._opened)
                ) {
                  this._init = !0;
                  const e = this._getAreas(
                    Object.values(this.hass.areas),
                    Object.values(this.hass.devices),
                    Object.values(this.hass.entities),
                    this.includeDomains,
                    this.excludeDomains,
                    this.includeDeviceClasses,
                    this.deviceFilter,
                    this.entityFilter,
                    this.noAdd,
                    this.excludeAreas
                  ).map((e) => ({
                    ...e,
                    strings: [e.area_id, ...e.aliases, e.name],
                  }));
                  (this.comboBox.items = e), (this.comboBox.filteredItems = e);
                }
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return s.dy` <ha-combo-box .hass="${this.hass}" .helper="${
                  this.helper
                }" item-value-path="area_id" item-id-path="area_id" item-label-path="name" .value="${
                  this._value
                }" .disabled="${this.disabled}" .required="${
                  this.required
                }" .label="${
                  void 0 === this.label && this.hass
                    ? this.hass.localize("ui.components.area-picker.area")
                    : this.label
                }" .placeholder="${
                  this.placeholder
                    ? null === (e = this.hass.areas[this.placeholder]) ||
                      void 0 === e
                      ? void 0
                      : e.name
                    : void 0
                }" .renderer="${k}" @filter-changed="${
                  this._filterChanged
                }" @opened-changed="${this._openedChanged}" @value-changed="${
                  this._areaChanged
                }"> </ha-combo-box> `;
              },
            },
            {
              kind: "method",
              key: "_filterChanged",
              value: function (e) {
                const i = e.target,
                  t = e.detail.value;
                if (!t)
                  return void (this.comboBox.filteredItems =
                    this.comboBox.items);
                const a = (0, u.q)(t, i.items || []);
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
                      (0, v.D9)(this, {
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
                          "add_new_suggestion" === i
                            ? this._suggestion
                            : void 0,
                        confirm: async (e) => {
                          if (e)
                            try {
                              const i = await (0, c.Lo)(this.hass, { name: e }),
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
                                this.noAdd,
                                this.excludeAreas
                              )),
                                await this.updateComplete,
                                await this.comboBox.updateComplete,
                                this._setValue(i.area_id);
                            } catch (e) {
                              (0, v.Ys)(this, {
                                title: this.hass.localize(
                                  "ui.components.area-picker.add_dialog.failed_create_area"
                                ),
                                text: e.message,
                              });
                            }
                        },
                        cancel: () => {
                          this._setValue(void 0),
                            (this._suggestion = void 0),
                            this.comboBox.setInputValue("");
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
                    (0, n.B)(this, "value-changed", { value: e }),
                      (0, n.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  15734: (e, i, t) => {
    t.r(i), t.d(i, { HaAreaSelector: () => v });
    var a = t(309),
      s = t(5095),
      d = t(95260),
      r = t(14516),
      l = t(4771),
      n = t(16061),
      o = t(18394),
      u = t(92794),
      c = t(29934),
      h = (t(25718), t(49389));
    (0, a.Z)(
      [(0, d.Mo)("ha-areas-picker")],
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
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "placeholder",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean, attribute: "no-add" })],
              key: "noAdd",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "include-domains" }),
              ],
              key: "includeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "exclude-domains" }),
              ],
              key: "excludeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, d.Cb)({ type: Array, attribute: "include-device-classes" }),
              ],
              key: "includeDeviceClasses",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "deviceFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "entityFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: "picked-area-label" })],
              key: "pickedAreaLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: "pick-area-label" })],
              key: "pickAreaLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                if (!this.hass) return s.Ld;
                const e = this._currentAreas;
                return s.dy` ${e.map(
                  (e) =>
                    s.dy` <div> <ha-area-picker .curValue="${e}" .noAdd="${this.noAdd}" .hass="${this.hass}" .value="${e}" .label="${this.pickedAreaLabel}" .includeDomains="${this.includeDomains}" .excludeDomains="${this.excludeDomains}" .includeDeviceClasses="${this.includeDeviceClasses}" .deviceFilter="${this.deviceFilter}" .entityFilter="${this.entityFilter}" .disabled="${this.disabled}" @value-changed="${this._areaChanged}"></ha-area-picker> </div> `
                )} <div> <ha-area-picker .noAdd="${this.noAdd}" .hass="${
                  this.hass
                }" .label="${this.pickAreaLabel}" .helper="${
                  this.helper
                }" .includeDomains="${this.includeDomains}" .excludeDomains="${
                  this.excludeDomains
                }" .includeDeviceClasses="${
                  this.includeDeviceClasses
                }" .deviceFilter="${this.deviceFilter}" .entityFilter="${
                  this.entityFilter
                }" .disabled="${this.disabled}" .placeholder="${
                  this.placeholder
                }" .required="${this.required && !e.length}" @value-changed="${
                  this._addArea
                }" .excludeAreas="${e}"></ha-area-picker> </div> `;
              },
            },
            {
              kind: "get",
              key: "_currentAreas",
              value: function () {
                return this.value || [];
              },
            },
            {
              kind: "method",
              key: "_updateAreas",
              value: async function (e) {
                (this.value = e), (0, o.B)(this, "value-changed", { value: e });
              },
            },
            {
              kind: "method",
              key: "_areaChanged",
              value: function (e) {
                e.stopPropagation();
                const i = e.currentTarget.curValue,
                  t = e.detail.value;
                if (t === i) return;
                const a = this._currentAreas;
                t && !a.includes(t)
                  ? this._updateAreas(a.map((e) => (e === i ? t : e)))
                  : this._updateAreas(a.filter((e) => e !== i));
              },
            },
            {
              kind: "method",
              key: "_addArea",
              value: function (e) {
                e.stopPropagation();
                const i = e.detail.value;
                if (!i) return;
                e.currentTarget.value = "";
                const t = this._currentAreas;
                t.includes(i) || this._updateAreas([...t, i]);
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => s.iv`div{margin-top:8px}`,
            },
          ],
        };
      },
      (0, h.f)(s.oi)
    );
    let v = (0, a.Z)(
      [(0, d.Mo)("ha-selector-area")],
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
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_entitySources",
              value: void 0,
            },
            {
              kind: "field",
              key: "_deviceIntegrationLookup",
              value: () => (0, r.Z)(n.HP),
            },
            {
              kind: "method",
              key: "_hasIntegration",
              value: function (e) {
                var i, t;
                return (
                  ((null === (i = e.area) || void 0 === i
                    ? void 0
                    : i.entity) &&
                    (0, l.r)(e.area.entity).some((e) => e.integration)) ||
                  ((null === (t = e.area) || void 0 === t
                    ? void 0
                    : t.device) &&
                    (0, l.r)(e.area.device).some((e) => e.integration))
                );
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                var i, t;
                e.has("selector") &&
                  void 0 !== this.value &&
                  (null !== (i = this.selector.area) &&
                  void 0 !== i &&
                  i.multiple &&
                  !Array.isArray(this.value)
                    ? ((this.value = [this.value]),
                      (0, o.B)(this, "value-changed", { value: this.value }))
                    : (null !== (t = this.selector.area) &&
                        void 0 !== t &&
                        t.multiple) ||
                      !Array.isArray(this.value) ||
                      ((this.value = this.value[0]),
                      (0, o.B)(this, "value-changed", { value: this.value })));
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                e.has("selector") &&
                  this._hasIntegration(this.selector) &&
                  !this._entitySources &&
                  (0, u.m)(this.hass).then((e) => {
                    this._entitySources = e;
                  });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return this._hasIntegration(this.selector) &&
                  !this._entitySources
                  ? s.Ld
                  : null !== (e = this.selector.area) &&
                    void 0 !== e &&
                    e.multiple
                  ? s.dy` <ha-areas-picker .hass="${this.hass}" .value="${this.value}" .helper="${this.helper}" .pickAreaLabel="${this.label}" no-add .deviceFilter="${this._filterDevices}" .entityFilter="${this._filterEntities}" .disabled="${this.disabled}" .required="${this.required}"></ha-areas-picker> `
                  : s.dy` <ha-area-picker .hass="${this.hass}" .value="${this.value}" .label="${this.label}" .helper="${this.helper}" no-add .deviceFilter="${this._filterDevices}" .entityFilter="${this._filterEntities}" .disabled="${this.disabled}" .required="${this.required}"></ha-area-picker> `;
              },
            },
            {
              kind: "field",
              key: "_filterEntities",
              value() {
                return (e) => {
                  var i;
                  return (
                    null === (i = this.selector.area) ||
                    void 0 === i ||
                    !i.entity ||
                    (0, l.r)(this.selector.area.entity).some((i) =>
                      (0, c.lV)(i, e, this._entitySources)
                    )
                  );
                };
              },
            },
            {
              kind: "field",
              key: "_filterDevices",
              value() {
                return (e) => {
                  var i;
                  if (
                    null === (i = this.selector.area) ||
                    void 0 === i ||
                    !i.device
                  )
                    return !0;
                  const t = this._entitySources
                    ? this._deviceIntegrationLookup(
                        this._entitySources,
                        Object.values(this.hass.entities)
                      )
                    : void 0;
                  return (0, l.r)(this.selector.area.device).some((i) =>
                    (0, c.lE)(i, e, t)
                  );
                };
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  97477: (e, i, t) => {
    t.d(i, { a: () => u, Lo: () => o, sG: () => n });
    var a = t(28858),
      s = t(72881),
      d = t(72218);
    const r = (e) =>
        e
          .sendMessagePromise({ type: "config/area_registry/list" })
          .then((e) => e.sort((e, i) => (0, a.$)(e.name, i.name))),
      l = (e, i) =>
        e.subscribeEvents(
          (0, d.D)(() => r(e).then((e) => i.setState(e, !0)), 500, !0),
          "area_registry_updated"
        ),
      n = (e, i) => (0, s.B)("_areaRegistry", r, l, e, i),
      o = (e, i) => e.callWS({ type: "config/area_registry/create", ...i }),
      u = (e, i) => (t, s) => {
        const d = i ? i.indexOf(t) : -1,
          r = i ? i.indexOf(s) : -1;
        if (-1 === d && -1 === r) {
          var l, n, o, u;
          const i =
              null !==
                (l =
                  null == e || null === (n = e[t]) || void 0 === n
                    ? void 0
                    : n.name) && void 0 !== l
                ? l
                : t,
            d =
              null !==
                (o =
                  null == e || null === (u = e[s]) || void 0 === u
                    ? void 0
                    : u.name) && void 0 !== o
                ? o
                : s;
          return (0, a.$)(i, d);
        }
        return -1 === d ? 1 : -1 === r ? -1 : d - r;
      };
  },
  92794: (e, i, t) => {
    t.d(i, { m: () => d });
    const a = async (e, i, t, s, d, ...r) => {
        const l = d,
          n = l[e],
          o = (n) =>
            s && s(d, n.result) !== n.cacheKey
              ? ((l[e] = void 0), a(e, i, t, s, d, ...r))
              : n.result;
        if (n) return n instanceof Promise ? n.then(o) : o(n);
        const u = t(d, ...r);
        return (
          (l[e] = u),
          u.then(
            (t) => {
              (l[e] = { result: t, cacheKey: null == s ? void 0 : s(d, t) }),
                setTimeout(() => {
                  l[e] = void 0;
                }, i);
            },
            () => {
              l[e] = void 0;
            }
          ),
          u
        );
      },
      s = (e) => e.callWS({ type: "entity/source" }),
      d = (e) =>
        a("_entitySources", 3e4, s, (e) => Object.keys(e.states).length, e);
  },
  49389: (e, i, t) => {
    t.d(i, { f: () => l });
    var a = t(309),
      s = t(34541),
      d = t(47838),
      r = t(95260);
    const l = (e) =>
      (0, a.Z)(
        null,
        function (e, i) {
          class t extends i {
            constructor(...i) {
              super(...i), e(this);
            }
          }
          return {
            F: t,
            d: [
              {
                kind: "field",
                decorators: [(0, r.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                key: "hassSubscribeRequiredHostProps",
                value: void 0,
              },
              { kind: "field", key: "__unsubs", value: void 0 },
              {
                kind: "method",
                key: "connectedCallback",
                value: function () {
                  (0, s.Z)(
                    (0, d.Z)(t.prototype),
                    "connectedCallback",
                    this
                  ).call(this),
                    this.__checkSubscribed();
                },
              },
              {
                kind: "method",
                key: "disconnectedCallback",
                value: function () {
                  if (
                    ((0, s.Z)(
                      (0, d.Z)(t.prototype),
                      "disconnectedCallback",
                      this
                    ).call(this),
                    this.__unsubs)
                  ) {
                    for (; this.__unsubs.length; ) {
                      const e = this.__unsubs.pop();
                      e instanceof Promise ? e.then((e) => e()) : e();
                    }
                    this.__unsubs = void 0;
                  }
                },
              },
              {
                kind: "method",
                key: "updated",
                value: function (e) {
                  if (
                    ((0, s.Z)((0, d.Z)(t.prototype), "updated", this).call(
                      this,
                      e
                    ),
                    e.has("hass"))
                  )
                    this.__checkSubscribed();
                  else if (this.hassSubscribeRequiredHostProps)
                    for (const i of e.keys())
                      if (this.hassSubscribeRequiredHostProps.includes(i))
                        return void this.__checkSubscribed();
                },
              },
              {
                kind: "method",
                key: "hassSubscribe",
                value: function () {
                  return [];
                },
              },
              {
                kind: "method",
                key: "__checkSubscribed",
                value: function () {
                  var e;
                  void 0 !== this.__unsubs ||
                    !this.isConnected ||
                    void 0 === this.hass ||
                    (null !== (e = this.hassSubscribeRequiredHostProps) &&
                      void 0 !== e &&
                      e.some((e) => void 0 === this[e])) ||
                    (this.__unsubs = this.hassSubscribe());
                },
              },
            ],
          };
        },
        e
      );
  },
};
//# sourceMappingURL=5734.8LqDfnEY8eM.js.map
