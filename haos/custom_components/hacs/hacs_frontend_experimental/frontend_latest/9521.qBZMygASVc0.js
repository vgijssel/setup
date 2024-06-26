/*! For license information please see 9521.qBZMygASVc0.js.LICENSE.txt */
export const id = 9521;
export const ids = [9521, 8664];
export const modules = {
  58135: (t, e, i) => {
    i.d(e, { z: () => s });
    const s = (t) => (e, i) => t.includes(e, i);
  },
  58664: (t, e, i) => {
    i.d(e, { v: () => n });
    var s = i(21157),
      a = i(36655);
    function n(t, e) {
      const i = (0, a.M)(t.entity_id),
        n = void 0 !== e ? e : null == t ? void 0 : t.state;
      if (["button", "event", "input_button", "scene"].includes(i))
        return n !== s.nZ;
      if ((0, s.rk)(n)) return !1;
      if (n === s.PX && "alert" !== i) return !1;
      switch (i) {
        case "alarm_control_panel":
          return "disarmed" !== n;
        case "alert":
          return "idle" !== n;
        case "cover":
        case "valve":
          return "closed" !== n;
        case "device_tracker":
        case "person":
          return "not_home" !== n;
        case "lawn_mower":
          return ["mowing", "error"].includes(n);
        case "lock":
          return "locked" !== n;
        case "media_player":
          return "standby" !== n;
        case "vacuum":
          return !["idle", "docked", "paused"].includes(n);
        case "plant":
          return "problem" === n;
        case "group":
          return ["on", "home", "open", "locked", "problem"].includes(n);
        case "timer":
          return "active" === n;
        case "camera":
          return "streaming" === n;
      }
      return !0;
    }
  },
  28112: (t, e, i) => {
    i.r(e), i.d(e, { HaStatisticSelector: () => f });
    var s = i(309),
      a = i(5095),
      n = i(95260),
      l = i(99266),
      d = i(18394),
      c = i(14516),
      r = i(4771),
      o = i(28858),
      u = i(2733);
    const h = (t, e, i) => {
      const s = t.states[e];
      return s ? (0, u.C)(s) : (null == i ? void 0 : i.name) || e;
    };
    var v = i(84728),
      k = (i(16591), i(37662), i(75868), i(1913));
    (0, s.Z)(
      [(0, n.Mo)("ha-statistic-picker")],
      function (t, e) {
        return {
          F: class extends e {
            constructor(...e) {
              super(...e), t(this);
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
              key: "label",
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
              decorators: [(0, n.Cb)({ attribute: "statistic-types" })],
              key: "statisticTypes",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Boolean, attribute: "allow-custom-entity" }),
              ],
              key: "allowCustomEntity",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Array })],
              key: "statisticIds",
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
              decorators: [
                (0, n.Cb)({
                  type: Array,
                  attribute: "include-statistics-unit-of-measurement",
                }),
              ],
              key: "includeStatisticsUnitOfMeasurement",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: "include-unit-class" })],
              key: "includeUnitClass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: "include-device-class" })],
              key: "includeDeviceClass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Boolean, attribute: "entities-only" }),
              ],
              key: "entitiesOnly",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Array, attribute: "exclude-statistics" }),
              ],
              key: "excludeStatistics",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helpMissingEntityUrl",
              value: () => "/more-info/statistics/",
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_opened",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.IO)("ha-combo-box", !0)],
              key: "comboBox",
              value: void 0,
            },
            { kind: "field", key: "_init", value: () => !1 },
            { kind: "field", key: "_statistics", value: () => [] },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_filteredItems",
              value() {},
            },
            {
              kind: "field",
              key: "_rowRenderer",
              value() {
                return (t) =>
                  a.dy`<mwc-list-item graphic="avatar" twoline> ${
                    t.state
                      ? a.dy`<state-badge slot="graphic" .stateObj="${t.state}" .hass="${this.hass}"></state-badge>`
                      : ""
                  } <span>${t.name}</span> <span slot="secondary">${
                    "" === t.id || "__missing" === t.id
                      ? a.dy`<a target="_blank" rel="noopener noreferrer" href="${(0,
                        v.R)(
                          this.hass,
                          this.helpMissingEntityUrl
                        )}">${this.hass.localize(
                          "ui.components.statistic-picker.learn_more"
                        )}</a>`
                      : t.id
                  }</span> </mwc-list-item>`;
              },
            },
            {
              kind: "field",
              key: "_getStatistics",
              value() {
                return (0, c.Z)((t, e, i, s, a, n, l) => {
                  if (!t.length)
                    return [
                      {
                        id: "",
                        name: this.hass.localize(
                          "ui.components.statistic-picker.no_statistics"
                        ),
                        strings: [],
                      },
                    ];
                  if (e) {
                    const i = (0, r.r)(e);
                    t = t.filter((t) =>
                      i.includes(t.statistics_unit_of_measurement)
                    );
                  }
                  if (i) {
                    const e = (0, r.r)(i);
                    t = t.filter((t) => e.includes(t.unit_class));
                  }
                  if (s) {
                    const e = (0, r.r)(s);
                    t = t.filter((t) => {
                      const i = this.hass.states[t.statistic_id];
                      return !i || e.includes(i.attributes.device_class || "");
                    });
                  }
                  const d = [];
                  return (
                    t.forEach((t) => {
                      if (
                        n &&
                        t.statistic_id !== l &&
                        n.includes(t.statistic_id)
                      )
                        return;
                      const e = this.hass.states[t.statistic_id];
                      if (!e) {
                        if (!a) {
                          const e = t.statistic_id,
                            i = h(this.hass, t.statistic_id, t);
                          d.push({ id: e, name: i, strings: [e, i] });
                        }
                        return;
                      }
                      const i = t.statistic_id,
                        s = h(this.hass, t.statistic_id, t);
                      d.push({ id: i, name: s, state: e, strings: [i, s] });
                    }),
                    d.length
                      ? (d.length > 1 &&
                          d.sort((t, e) =>
                            (0, o.$)(
                              t.name || "",
                              e.name || "",
                              this.hass.locale.language
                            )
                          ),
                        d.push({
                          id: "__missing",
                          name: this.hass.localize(
                            "ui.components.statistic-picker.missing_entity"
                          ),
                          strings: [],
                        }),
                        d)
                      : [
                          {
                            id: "",
                            name: this.hass.localize(
                              "ui.components.statistic-picker.no_match"
                            ),
                            strings: [],
                          },
                        ]
                  );
                });
              },
            },
            {
              kind: "method",
              key: "open",
              value: function () {
                var t;
                null === (t = this.comboBox) || void 0 === t || t.open();
              },
            },
            {
              kind: "method",
              key: "focus",
              value: function () {
                var t;
                null === (t = this.comboBox) || void 0 === t || t.focus();
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (t) {
                ((!this.hasUpdated && !this.statisticIds) ||
                  t.has("statisticTypes")) &&
                  this._getStatisticIds(),
                  ((!this._init && this.statisticIds) ||
                    (t.has("_opened") && this._opened)) &&
                    ((this._init = !0),
                    this.hasUpdated
                      ? (this._statistics = this._getStatistics(
                          this.statisticIds,
                          this.includeStatisticsUnitOfMeasurement,
                          this.includeUnitClass,
                          this.includeDeviceClass,
                          this.entitiesOnly,
                          this.excludeStatistics,
                          this.value
                        ))
                      : this.updateComplete.then(() => {
                          this._statistics = this._getStatistics(
                            this.statisticIds,
                            this.includeStatisticsUnitOfMeasurement,
                            this.includeUnitClass,
                            this.includeDeviceClass,
                            this.entitiesOnly,
                            this.excludeStatistics,
                            this.value
                          );
                        }));
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var t;
                return 0 === this._statistics.length
                  ? a.Ld
                  : a.dy` <ha-combo-box .hass="${this.hass}" .label="${
                      void 0 === this.label && this.hass
                        ? this.hass.localize(
                            "ui.components.statistic-picker.statistic"
                          )
                        : this.label
                    }" .value="${this._value}" .renderer="${
                      this._rowRenderer
                    }" .disabled="${this.disabled}" .allowCustomValue="${
                      this.allowCustomEntity
                    }" .items="${this._statistics}" .filteredItems="${
                      null !== (t = this._filteredItems) && void 0 !== t
                        ? t
                        : this._statistics
                    }" item-value-path="id" item-id-path="id" item-label-path="name" @opened-changed="${
                      this._openedChanged
                    }" @value-changed="${
                      this._statisticChanged
                    }" @filter-changed="${
                      this._filterChanged
                    }"></ha-combo-box> `;
              },
            },
            {
              kind: "method",
              key: "_getStatisticIds",
              value: async function () {
                var t, e;
                this.statisticIds = await ((t = this.hass),
                (e = this.statisticTypes),
                t.callWS({
                  type: "recorder/list_statistic_ids",
                  statistic_type: e,
                }));
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
              key: "_statisticChanged",
              value: function (t) {
                t.stopPropagation();
                let e = t.detail.value;
                "__missing" === e && (e = ""),
                  e !== this._value && this._setValue(e);
              },
            },
            {
              kind: "method",
              key: "_openedChanged",
              value: function (t) {
                this._opened = t.detail.value;
              },
            },
            {
              kind: "method",
              key: "_filterChanged",
              value: function (t) {
                const e = t.detail.value.toLowerCase();
                this._filteredItems = e.length
                  ? (0, k.q)(e, this._statistics)
                  : void 0;
              },
            },
            {
              kind: "method",
              key: "_setValue",
              value: function (t) {
                (this.value = t),
                  setTimeout(() => {
                    (0, d.B)(this, "value-changed", { value: t }),
                      (0, d.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      a.oi
    ),
      (0, s.Z)(
        [(0, n.Mo)("ha-statistics-picker")],
        function (t, e) {
          return {
            F: class extends e {
              constructor(...e) {
                super(...e), t(this);
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
                decorators: [(0, n.Cb)({ type: Array })],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ type: Array })],
                key: "statisticIds",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: "statistic-types" })],
                key: "statisticTypes",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, n.Cb)({ attribute: "picked-statistic-label" }),
                ],
                key: "pickedStatisticLabel",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: "pick-statistic-label" })],
                key: "pickStatisticLabel",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, n.Cb)({
                    type: Boolean,
                    attribute: "allow-custom-entity",
                  }),
                ],
                key: "allowCustomEntity",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, n.Cb)({
                    attribute: "include-statistics-unit-of-measurement",
                  }),
                ],
                key: "includeStatisticsUnitOfMeasurement",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: "include-unit-class" })],
                key: "includeUnitClass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: "include-device-class" })],
                key: "includeDeviceClass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, n.Cb)({
                    type: Boolean,
                    attribute: "ignore-restrictions-on-first-statistic",
                  }),
                ],
                key: "ignoreRestrictionsOnFirstStatistic",
                value: () => !1,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  if (!this.hass) return a.Ld;
                  const t =
                      this.ignoreRestrictionsOnFirstStatistic &&
                      this._currentStatistics.length <= 1,
                    e = t ? void 0 : this.includeStatisticsUnitOfMeasurement,
                    i = t ? void 0 : this.includeUnitClass,
                    s = t ? void 0 : this.includeDeviceClass,
                    n = t ? void 0 : this.statisticTypes;
                  return a.dy` ${(0, l.r)(
                    this._currentStatistics,
                    (t) => t,
                    (t) =>
                      a.dy` <div> <ha-statistic-picker .curValue="${t}" .hass="${this.hass}" .includeStatisticsUnitOfMeasurement="${e}" .includeUnitClass="${i}" .includeDeviceClass="${s}" .value="${t}" .statisticTypes="${n}" .statisticIds="${this.statisticIds}" .label="${this.pickedStatisticLabel}" .excludeStatistics="${this.value}" .allowCustomEntity="${this.allowCustomEntity}" @value-changed="${this._statisticChanged}"></ha-statistic-picker> </div> `
                  )} <div> <ha-statistic-picker .hass="${
                    this.hass
                  }" .includeStatisticsUnitOfMeasurement="${
                    this.includeStatisticsUnitOfMeasurement
                  }" .includeUnitClass="${
                    this.includeUnitClass
                  }" .includeDeviceClass="${
                    this.includeDeviceClass
                  }" .statisticTypes="${this.statisticTypes}" .statisticIds="${
                    this.statisticIds
                  }" .label="${this.pickStatisticLabel}" .excludeStatistics="${
                    this.value
                  }" .allowCustomEntity="${
                    this.allowCustomEntity
                  }" @value-changed="${
                    this._addStatistic
                  }"></ha-statistic-picker> </div> `;
                },
              },
              {
                kind: "get",
                key: "_currentStatistics",
                value: function () {
                  return this.value || [];
                },
              },
              {
                kind: "method",
                key: "_updateStatistics",
                value: async function (t) {
                  (this.value = t),
                    (0, d.B)(this, "value-changed", { value: t });
                },
              },
              {
                kind: "method",
                key: "_statisticChanged",
                value: function (t) {
                  t.stopPropagation();
                  const e = t.currentTarget.curValue,
                    i = t.detail.value;
                  if (i === e) return;
                  const s = this._currentStatistics;
                  i && !s.includes(i)
                    ? this._updateStatistics(s.map((t) => (t === e ? i : t)))
                    : this._updateStatistics(s.filter((t) => t !== e));
                },
              },
              {
                kind: "method",
                key: "_addStatistic",
                value: async function (t) {
                  t.stopPropagation();
                  const e = t.detail.value;
                  if (!e) return;
                  if (((t.currentTarget.value = ""), !e)) return;
                  const i = this._currentStatistics;
                  i.includes(e) || this._updateStatistics([...i, e]);
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return a.iv`:host{width:200px;display:block}ha-statistic-picker{display:block;width:100%;margin-top:8px}`;
                },
              },
            ],
          };
        },
        a.oi
      );
    let f = (0, s.Z)(
      [(0, n.Mo)("ha-selector-statistic")],
      function (t, e) {
        return {
          F: class extends e {
            constructor(...e) {
              super(...e), t(this);
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "selector",
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
              kind: "method",
              key: "render",
              value: function () {
                return this.selector.statistic.multiple
                  ? a.dy` ${
                      this.label ? a.dy`<label>${this.label}</label>` : ""
                    } <ha-statistics-picker .hass="${this.hass}" .value="${
                      this.value
                    }" .helper="${this.helper}" .disabled="${
                      this.disabled
                    }" .required="${this.required}"></ha-statistics-picker> `
                  : a.dy`<ha-statistic-picker .hass="${this.hass}" .value="${this.value}" .label="${this.label}" .helper="${this.helper}" .disabled="${this.disabled}" .required="${this.required}" allow-custom-entity></ha-statistic-picker>`;
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  21157: (t, e, i) => {
    i.d(e, { PX: () => l, V_: () => d, nZ: () => a, rk: () => r });
    var s = i(58135);
    const a = "unavailable",
      n = "unknown",
      l = "off",
      d = [a, n],
      c = [a, n, l],
      r = (0, s.z)(d);
    (0, s.z)(c);
  },
  84728: (t, e, i) => {
    i.d(e, { R: () => s });
    const s = (t, e) =>
      `https://${
        t.config.version.includes("b")
          ? "rc"
          : t.config.version.includes("dev")
          ? "next"
          : "www"
      }.home-assistant.io${e}`;
  },
  99266: (t, e, i) => {
    i.d(e, { r: () => d });
    var s = i(32982),
      a = i(16616),
      n = i(41005);
    const l = (t, e, i) => {
        const s = new Map();
        for (let a = e; a <= i; a++) s.set(t[a], a);
        return s;
      },
      d = (0, a.XM)(
        class extends a.Xe {
          constructor(t) {
            if ((super(t), t.type !== a.pX.CHILD))
              throw Error("repeat() can only be used in text expressions");
          }
          ct(t, e, i) {
            let s;
            void 0 === i ? (i = e) : void 0 !== e && (s = e);
            const a = [],
              n = [];
            let l = 0;
            for (const e of t) (a[l] = s ? s(e, l) : l), (n[l] = i(e, l)), l++;
            return { values: n, keys: a };
          }
          render(t, e, i) {
            return this.ct(t, e, i).values;
          }
          update(t, [e, i, a]) {
            var d;
            const c = (0, n.i9)(t),
              { values: r, keys: o } = this.ct(e, i, a);
            if (!Array.isArray(c)) return (this.ut = o), r;
            const u =
                null !== (d = this.ut) && void 0 !== d ? d : (this.ut = []),
              h = [];
            let v,
              k,
              f = 0,
              p = c.length - 1,
              y = 0,
              _ = r.length - 1;
            for (; f <= p && y <= _; )
              if (null === c[f]) f++;
              else if (null === c[p]) p--;
              else if (u[f] === o[y]) (h[y] = (0, n.fk)(c[f], r[y])), f++, y++;
              else if (u[p] === o[_]) (h[_] = (0, n.fk)(c[p], r[_])), p--, _--;
              else if (u[f] === o[_])
                (h[_] = (0, n.fk)(c[f], r[_])),
                  (0, n._Y)(t, h[_ + 1], c[f]),
                  f++,
                  _--;
              else if (u[p] === o[y])
                (h[y] = (0, n.fk)(c[p], r[y])),
                  (0, n._Y)(t, c[f], c[p]),
                  p--,
                  y++;
              else if (
                (void 0 === v && ((v = l(o, y, _)), (k = l(u, f, p))),
                v.has(u[f]))
              )
                if (v.has(u[p])) {
                  const e = k.get(o[y]),
                    i = void 0 !== e ? c[e] : null;
                  if (null === i) {
                    const e = (0, n._Y)(t, c[f]);
                    (0, n.fk)(e, r[y]), (h[y] = e);
                  } else
                    (h[y] = (0, n.fk)(i, r[y])),
                      (0, n._Y)(t, c[f], i),
                      (c[e] = null);
                  y++;
                } else (0, n.ws)(c[p]), p--;
              else (0, n.ws)(c[f]), f++;
            for (; y <= _; ) {
              const e = (0, n._Y)(t, h[_ + 1]);
              (0, n.fk)(e, r[y]), (h[y++] = e);
            }
            for (; f <= p; ) {
              const t = c[f++];
              null !== t && (0, n.ws)(t);
            }
            return (this.ut = o), (0, n.hl)(t, h), s.Jb;
          }
        }
      );
  },
  60307: (t, e, i) => {
    i.d(e, { C: () => h });
    var s = i(32982),
      a = i(41005),
      n = i(36585);
    class l {
      constructor(t) {
        this.G = t;
      }
      disconnect() {
        this.G = void 0;
      }
      reconnect(t) {
        this.G = t;
      }
      deref() {
        return this.G;
      }
    }
    class d {
      constructor() {
        (this.Y = void 0), (this.Z = void 0);
      }
      get() {
        return this.Y;
      }
      pause() {
        var t;
        (null !== (t = this.Y) && void 0 !== t) ||
          (this.Y = new Promise((t) => (this.Z = t)));
      }
      resume() {
        var t;
        null === (t = this.Z) || void 0 === t || t.call(this),
          (this.Y = this.Z = void 0);
      }
    }
    var c = i(16616);
    const r = (t) => !(0, a.pt)(t) && "function" == typeof t.then,
      o = 1073741823;
    class u extends n.sR {
      constructor() {
        super(...arguments),
          (this._$C_t = o),
          (this._$Cwt = []),
          (this._$Cq = new l(this)),
          (this._$CK = new d());
      }
      render(...t) {
        var e;
        return null !== (e = t.find((t) => !r(t))) && void 0 !== e ? e : s.Jb;
      }
      update(t, e) {
        const i = this._$Cwt;
        let a = i.length;
        this._$Cwt = e;
        const n = this._$Cq,
          l = this._$CK;
        this.isConnected || this.disconnected();
        for (let t = 0; t < e.length && !(t > this._$C_t); t++) {
          const s = e[t];
          if (!r(s)) return (this._$C_t = t), s;
          (t < a && s === i[t]) ||
            ((this._$C_t = o),
            (a = 0),
            Promise.resolve(s).then(async (t) => {
              for (; l.get(); ) await l.get();
              const e = n.deref();
              if (void 0 !== e) {
                const i = e._$Cwt.indexOf(s);
                i > -1 && i < e._$C_t && ((e._$C_t = i), e.setValue(t));
              }
            }));
        }
        return s.Jb;
      }
      disconnected() {
        this._$Cq.disconnect(), this._$CK.pause();
      }
      reconnected() {
        this._$Cq.reconnect(this), this._$CK.resume();
      }
    }
    const h = (0, c.XM)(u);
  },
};
//# sourceMappingURL=9521.qBZMygASVc0.js.map
