export const id = 2722;
export const ids = [2722];
export const modules = {
  27056: (e, i, t) => {
    var s = t(309),
      d = t(5095),
      a = t(95260),
      l = t(14516),
      n = t(18394),
      r = t(36655),
      o = t(28858),
      c = t(1913),
      u = t(16061);
    t(16591), t(90532);
    const v = (e) =>
      d.dy`<ha-list-item .twoline="${!!e.area}"> <span>${
        e.name
      }</span> <span slot="secondary">${e.area}</span> </ha-list-item>`;
    (0, s.Z)(
      [(0, a.Mo)("ha-device-picker")],
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
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, a.Cb)({ type: Array, attribute: "include-domains" }),
              ],
              key: "includeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, a.Cb)({ type: Array, attribute: "exclude-domains" }),
              ],
              key: "excludeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, a.Cb)({ type: Array, attribute: "include-device-classes" }),
              ],
              key: "includeDeviceClasses",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, a.Cb)({ type: Array, attribute: "exclude-devices" }),
              ],
              key: "excludeDevices",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "deviceFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "entityFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.SB)()],
              key: "_opened",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.IO)("ha-combo-box", !0)],
              key: "comboBox",
              value: void 0,
            },
            { kind: "field", key: "_init", value: () => !1 },
            {
              kind: "field",
              key: "_getDevices",
              value() {
                return (0, l.Z)((e, i, t, s, d, a, l, n, c) => {
                  if (!e.length)
                    return [
                      {
                        id: "no_devices",
                        area: "",
                        name: this.hass.localize(
                          "ui.components.device-picker.no_devices"
                        ),
                        strings: [],
                      },
                    ];
                  let v = {};
                  (s || d || a || n) && (v = (0, u.R6)(t));
                  let h = e.filter(
                    (e) => e.id === this.value || !e.disabled_by
                  );
                  s &&
                    (h = h.filter((e) => {
                      const i = v[e.id];
                      return (
                        !(!i || !i.length) &&
                        v[e.id].some((e) => s.includes((0, r.M)(e.entity_id)))
                      );
                    })),
                    d &&
                      (h = h.filter((e) => {
                        const i = v[e.id];
                        return (
                          !i ||
                          !i.length ||
                          t.every((e) => !d.includes((0, r.M)(e.entity_id)))
                        );
                      })),
                    c && (h = h.filter((e) => !c.includes(e.id))),
                    a &&
                      (h = h.filter((e) => {
                        const i = v[e.id];
                        return (
                          !(!i || !i.length) &&
                          v[e.id].some((e) => {
                            const i = this.hass.states[e.entity_id];
                            return (
                              !!i &&
                              i.attributes.device_class &&
                              a.includes(i.attributes.device_class)
                            );
                          })
                        );
                      })),
                    n &&
                      (h = h.filter((e) => {
                        const i = v[e.id];
                        return (
                          !(!i || !i.length) &&
                          i.some((e) => {
                            const i = this.hass.states[e.entity_id];
                            return !!i && n(i);
                          })
                        );
                      })),
                    l && (h = h.filter((e) => e.id === this.value || l(e)));
                  const k = h.map((e) => {
                    const t = (0, u.jL)(e, this.hass, v[e.id]);
                    return {
                      id: e.id,
                      name: t,
                      area:
                        e.area_id && i[e.area_id]
                          ? i[e.area_id].name
                          : this.hass.localize(
                              "ui.components.device-picker.no_area"
                            ),
                      strings: [t || ""],
                    };
                  });
                  return k.length
                    ? 1 === k.length
                      ? k
                      : k.sort((e, i) =>
                          (0, o.$)(
                            e.name || "",
                            i.name || "",
                            this.hass.locale.language
                          )
                        )
                    : [
                        {
                          id: "no_devices",
                          area: "",
                          name: this.hass.localize(
                            "ui.components.device-picker.no_match"
                          ),
                          strings: [],
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
              key: "updated",
              value: function (e) {
                if (
                  (!this._init && this.hass) ||
                  (this._init && e.has("_opened") && this._opened)
                ) {
                  this._init = !0;
                  const e = this._getDevices(
                    Object.values(this.hass.devices),
                    this.hass.areas,
                    Object.values(this.hass.entities),
                    this.includeDomains,
                    this.excludeDomains,
                    this.includeDeviceClasses,
                    this.deviceFilter,
                    this.entityFilter,
                    this.excludeDevices
                  );
                  (this.comboBox.items = e), (this.comboBox.filteredItems = e);
                }
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return d.dy` <ha-combo-box .hass="${this.hass}" .label="${
                  void 0 === this.label && this.hass
                    ? this.hass.localize("ui.components.device-picker.device")
                    : this.label
                }" .value="${this._value}" .helper="${
                  this.helper
                }" .renderer="${v}" .disabled="${this.disabled}" .required="${
                  this.required
                }" item-id-path="id" item-value-path="id" item-label-path="name" @opened-changed="${
                  this._openedChanged
                }" @value-changed="${this._deviceChanged}" @filter-changed="${
                  this._filterChanged
                }"></ha-combo-box> `;
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
              key: "_filterChanged",
              value: function (e) {
                const i = e.target,
                  t = e.detail.value.toLowerCase();
                i.filteredItems = t.length
                  ? (0, c.q)(t, i.items || [])
                  : i.items;
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
                    (0, n.B)(this, "value-changed", { value: e }),
                      (0, n.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      d.oi
    );
  },
  72722: (e, i, t) => {
    t.r(i), t.d(i, { HaDeviceSelector: () => k });
    var s = t(309),
      d = t(34541),
      a = t(47838),
      l = t(5095),
      n = t(95260),
      r = t(14516),
      o = t(4771),
      c = t(18394),
      u = t(16061),
      v = t(92794),
      h = t(29934);
    t(27056);
    (0, s.Z)(
      [(0, n.Mo)("ha-devices-picker")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Array, attribute: "include-domains" }),
              ],
              key: "includeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Array, attribute: "exclude-domains" }),
              ],
              key: "excludeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ attribute: "picked-device-label" }),
                (0, n.Cb)({ type: Array, attribute: "include-device-classes" }),
              ],
              key: "includeDeviceClasses",
              value: void 0,
            },
            { kind: "field", key: "pickedDeviceLabel", value: void 0 },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: "pick-device-label" })],
              key: "pickDeviceLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "deviceFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "entityFilter",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                if (!this.hass) return l.Ld;
                const e = this._currentDevices;
                return l.dy` ${e.map(
                  (e) =>
                    l.dy` <div> <ha-device-picker allow-custom-entity .curValue="${e}" .hass="${this.hass}" .deviceFilter="${this.deviceFilter}" .entityFilter="${this.entityFilter}" .includeDomains="${this.includeDomains}" .excludeDomains="${this.excludeDomains}" .includeDeviceClasses="${this.includeDeviceClasses}" .value="${e}" .label="${this.pickedDeviceLabel}" .disabled="${this.disabled}" @value-changed="${this._deviceChanged}"></ha-device-picker> </div> `
                )} <div> <ha-device-picker allow-custom-entity .hass="${
                  this.hass
                }" .helper="${this.helper}" .deviceFilter="${
                  this.deviceFilter
                }" .entityFilter="${this.entityFilter}" .includeDomains="${
                  this.includeDomains
                }" .excludeDomains="${
                  this.excludeDomains
                }" .excludeDevices="${e}" .includeDeviceClasses="${
                  this.includeDeviceClasses
                }" .label="${this.pickDeviceLabel}" .disabled="${
                  this.disabled
                }" .required="${this.required && !e.length}" @value-changed="${
                  this._addDevice
                }"></ha-device-picker> </div> `;
              },
            },
            {
              kind: "get",
              key: "_currentDevices",
              value: function () {
                return this.value || [];
              },
            },
            {
              kind: "method",
              key: "_updateDevices",
              value: async function (e) {
                (0, c.B)(this, "value-changed", { value: e }), (this.value = e);
              },
            },
            {
              kind: "method",
              key: "_deviceChanged",
              value: function (e) {
                e.stopPropagation();
                const i = e.currentTarget.curValue,
                  t = e.detail.value;
                t !== i &&
                  (void 0 === t
                    ? this._updateDevices(
                        this._currentDevices.filter((e) => e !== i)
                      )
                    : this._updateDevices(
                        this._currentDevices.map((e) => (e === i ? t : e))
                      ));
              },
            },
            {
              kind: "method",
              key: "_addDevice",
              value: async function (e) {
                e.stopPropagation();
                const i = e.detail.value;
                if (((e.currentTarget.value = ""), !i)) return;
                const t = this._currentDevices;
                t.includes(i) || this._updateDevices([...t, i]);
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => l.iv`div{margin-top:8px}`,
            },
          ],
        };
      },
      l.oi
    );
    let k = (0, s.Z)(
      [(0, n.Mo)("ha-selector-device")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_entitySources",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "field",
              key: "_deviceIntegrationLookup",
              value: () => (0, r.Z)(u.HP),
            },
            {
              kind: "method",
              key: "_hasIntegration",
              value: function (e) {
                var i, t;
                return (
                  ((null === (i = e.device) || void 0 === i
                    ? void 0
                    : i.filter) &&
                    (0, o.r)(e.device.filter).some((e) => e.integration)) ||
                  ((null === (t = e.device) || void 0 === t
                    ? void 0
                    : t.entity) &&
                    (0, o.r)(e.device.entity).some((e) => e.integration))
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
                  (null !== (i = this.selector.device) &&
                  void 0 !== i &&
                  i.multiple &&
                  !Array.isArray(this.value)
                    ? ((this.value = [this.value]),
                      (0, c.B)(this, "value-changed", { value: this.value }))
                    : (null !== (t = this.selector.device) &&
                        void 0 !== t &&
                        t.multiple) ||
                      !Array.isArray(this.value) ||
                      ((this.value = this.value[0]),
                      (0, c.B)(this, "value-changed", { value: this.value })));
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, d.Z)((0, a.Z)(t.prototype), "updated", this).call(this, e),
                  e.has("selector") &&
                    this._hasIntegration(this.selector) &&
                    !this._entitySources &&
                    (0, v.m)(this.hass).then((e) => {
                      this._entitySources = e;
                    });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, i, t;
                return this._hasIntegration(this.selector) &&
                  !this._entitySources
                  ? l.Ld
                  : null !== (e = this.selector.device) &&
                    void 0 !== e &&
                    e.multiple
                  ? l.dy` ${
                      this.label ? l.dy`<label>${this.label}</label>` : ""
                    } <ha-devices-picker .hass="${this.hass}" .value="${
                      this.value
                    }" .helper="${this.helper}" .deviceFilter="${
                      this._filterDevices
                    }" .entityFilter="${
                      null !== (i = this.selector.device) &&
                      void 0 !== i &&
                      i.entity
                        ? this._filterEntities
                        : void 0
                    }" .disabled="${this.disabled}" .required="${
                      this.required
                    }"></ha-devices-picker> `
                  : l.dy` <ha-device-picker .hass="${this.hass}" .value="${
                      this.value
                    }" .label="${this.label}" .helper="${
                      this.helper
                    }" .deviceFilter="${this._filterDevices}" .entityFilter="${
                      null !== (t = this.selector.device) &&
                      void 0 !== t &&
                      t.entity
                        ? this._filterEntities
                        : void 0
                    }" .disabled="${this.disabled}" .required="${
                      this.required
                    }" allow-custom-entity></ha-device-picker> `;
              },
            },
            {
              kind: "field",
              key: "_filterDevices",
              value() {
                return (e) => {
                  var i;
                  if (
                    null === (i = this.selector.device) ||
                    void 0 === i ||
                    !i.filter
                  )
                    return !0;
                  const t = this._entitySources
                    ? this._deviceIntegrationLookup(
                        this._entitySources,
                        Object.values(this.hass.entities)
                      )
                    : void 0;
                  return (0, o.r)(this.selector.device.filter).some((i) =>
                    (0, h.lE)(i, e, t)
                  );
                };
              },
            },
            {
              kind: "field",
              key: "_filterEntities",
              value() {
                return (e) =>
                  (0, o.r)(this.selector.device.entity).some((i) =>
                    (0, h.lV)(i, e, this._entitySources)
                  );
              },
            },
          ],
        };
      },
      l.oi
    );
  },
  92794: (e, i, t) => {
    t.d(i, { m: () => a });
    const s = async (e, i, t, d, a, ...l) => {
        const n = a,
          r = n[e],
          o = (r) =>
            d && d(a, r.result) !== r.cacheKey
              ? ((n[e] = void 0), s(e, i, t, d, a, ...l))
              : r.result;
        if (r) return r instanceof Promise ? r.then(o) : o(r);
        const c = t(a, ...l);
        return (
          (n[e] = c),
          c.then(
            (t) => {
              (n[e] = { result: t, cacheKey: null == d ? void 0 : d(a, t) }),
                setTimeout(() => {
                  n[e] = void 0;
                }, i);
            },
            () => {
              n[e] = void 0;
            }
          ),
          c
        );
      },
      d = (e) => e.callWS({ type: "entity/source" }),
      a = (e) =>
        s("_entitySources", 3e4, d, (e) => Object.keys(e.states).length, e);
  },
};
//# sourceMappingURL=2722.wFE90sKscgY.js.map
