/*! For license information please see 9693.kqhOTaEt_9A.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [9693],
  {
    58135: function (t, e, i) {
      i.d(e, {
        z: function () {
          return s;
        },
      });
      i(40271), i(60163);
      var s = function (t) {
        return function (e, i) {
          return t.includes(e, i);
        };
      };
    },
    58664: function (t, e, i) {
      i.d(e, {
        v: function () {
          return a;
        },
      });
      i(40271);
      var s = i(21157),
        n = i(36655);
      function a(t, e) {
        var i = (0, n.M)(t.entity_id),
          a = void 0 !== e ? e : null == t ? void 0 : t.state;
        if (["button", "event", "input_button", "scene"].includes(i))
          return a !== s.nZ;
        if ((0, s.rk)(a)) return !1;
        if (a === s.PX && "alert" !== i) return !1;
        switch (i) {
          case "alarm_control_panel":
            return "disarmed" !== a;
          case "alert":
            return "idle" !== a;
          case "cover":
          case "valve":
            return "closed" !== a;
          case "device_tracker":
          case "person":
            return "not_home" !== a;
          case "lawn_mower":
            return ["mowing", "error"].includes(a);
          case "lock":
            return "locked" !== a;
          case "media_player":
            return "standby" !== a;
          case "vacuum":
            return !["idle", "docked", "paused"].includes(a);
          case "plant":
            return "problem" === a;
          case "group":
            return ["on", "home", "open", "locked", "problem"].includes(a);
          case "timer":
            return "active" === a;
          case "camera":
            return "streaming" === a;
        }
        return !0;
      }
    },
    28112: function (t, e, i) {
      i.r(e),
        i.d(e, {
          HaStatisticSelector: function () {
            return T;
          },
        });
      var s,
        n,
        a,
        r,
        u,
        c,
        o,
        l,
        d,
        h,
        v = i(88962),
        f = i(33368),
        k = i(71650),
        p = i(68308),
        y = i(82390),
        b = i(69205),
        _ = i(91808),
        m = (i(97393), i(5095)),
        C = i(95260),
        g = i(46097),
        Z = i(99312),
        w = i(81043),
        S =
          (i(40271),
          i(60163),
          i(87438),
          i(46798),
          i(9849),
          i(22890),
          i(46349),
          i(70320),
          i(99266)),
        x = i(18394),
        I = (i(22859), i(50289), i(94167), i(36513), i(37313), i(14516)),
        O = i(4771),
        U = i(28858),
        $ = (i(40039), i(13526), i(2733)),
        M = function (t, e, i) {
          var s = t.states[e];
          return s ? (0, $.C)(s) : (null == i ? void 0 : i.name) || e;
        },
        B = i(84728),
        E = (i(16591), i(37662), i(14303), i(1913)),
        T =
          ((0, _.Z)(
            [(0, C.Mo)("ha-statistic-picker")],
            function (t, e) {
              var i,
                u = (function (e) {
                  function i() {
                    var e;
                    (0, k.Z)(this, i);
                    for (
                      var s = arguments.length, n = new Array(s), a = 0;
                      a < s;
                      a++
                    )
                      n[a] = arguments[a];
                    return (
                      (e = (0, p.Z)(this, i, [].concat(n))), t((0, y.Z)(e)), e
                    );
                  }
                  return (0, b.Z)(i, e), (0, f.Z)(i);
                })(e);
              return {
                F: u,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: "statistic-types" })],
                    key: "statisticTypes",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({
                        type: Boolean,
                        attribute: "allow-custom-entity",
                      }),
                    ],
                    key: "allowCustomEntity",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Array })],
                    key: "statisticIds",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({
                        type: Array,
                        attribute: "include-statistics-unit-of-measurement",
                      }),
                    ],
                    key: "includeStatisticsUnitOfMeasurement",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "include-unit-class" }),
                    ],
                    key: "includeUnitClass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "include-device-class" }),
                    ],
                    key: "includeDeviceClass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ type: Boolean, attribute: "entities-only" }),
                    ],
                    key: "entitiesOnly",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({
                        type: Array,
                        attribute: "exclude-statistics",
                      }),
                    ],
                    key: "excludeStatistics",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "helpMissingEntityUrl",
                    value: function () {
                      return "/more-info/statistics/";
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.SB)()],
                    key: "_opened",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.IO)("ha-combo-box", !0)],
                    key: "comboBox",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    key: "_init",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    key: "_statistics",
                    value: function () {
                      return [];
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.SB)()],
                    key: "_filteredItems",
                    value: function () {},
                  },
                  {
                    kind: "field",
                    key: "_rowRenderer",
                    value: function () {
                      var t = this;
                      return function (e) {
                        return (0, m.dy)(
                          s ||
                            (s = (0, v.Z)([
                              '<mwc-list-item graphic="avatar" twoline> ',
                              " <span>",
                              '</span> <span slot="secondary">',
                              "</span> </mwc-list-item>",
                            ])),
                          e.state
                            ? (0, m.dy)(
                                n ||
                                  (n = (0, v.Z)([
                                    '<state-badge slot="graphic" .stateObj="',
                                    '" .hass="',
                                    '"></state-badge>',
                                  ])),
                                e.state,
                                t.hass
                              )
                            : "",
                          e.name,
                          "" === e.id || "__missing" === e.id
                            ? (0, m.dy)(
                                a ||
                                  (a = (0, v.Z)([
                                    '<a target="_blank" rel="noopener noreferrer" href="',
                                    '">',
                                    "</a>",
                                  ])),
                                (0, B.R)(t.hass, t.helpMissingEntityUrl),
                                t.hass.localize(
                                  "ui.components.statistic-picker.learn_more"
                                )
                              )
                            : e.id
                        );
                      };
                    },
                  },
                  {
                    kind: "field",
                    key: "_getStatistics",
                    value: function () {
                      var t = this;
                      return (0, I.Z)(function (e, i, s, n, a, r, u) {
                        if (!e.length)
                          return [
                            {
                              id: "",
                              name: t.hass.localize(
                                "ui.components.statistic-picker.no_statistics"
                              ),
                              strings: [],
                            },
                          ];
                        if (i) {
                          var c = (0, O.r)(i);
                          e = e.filter(function (t) {
                            return c.includes(t.statistics_unit_of_measurement);
                          });
                        }
                        if (s) {
                          var o = (0, O.r)(s);
                          e = e.filter(function (t) {
                            return o.includes(t.unit_class);
                          });
                        }
                        if (n) {
                          var l = (0, O.r)(n);
                          e = e.filter(function (e) {
                            var i = t.hass.states[e.statistic_id];
                            return (
                              !i || l.includes(i.attributes.device_class || "")
                            );
                          });
                        }
                        var d = [];
                        return (
                          e.forEach(function (e) {
                            if (
                              !r ||
                              e.statistic_id === u ||
                              !r.includes(e.statistic_id)
                            ) {
                              var i = t.hass.states[e.statistic_id];
                              if (i) {
                                var s = e.statistic_id,
                                  n = M(t.hass, e.statistic_id, e);
                                d.push({
                                  id: s,
                                  name: n,
                                  state: i,
                                  strings: [s, n],
                                });
                              } else if (!a) {
                                var c = e.statistic_id,
                                  o = M(t.hass, e.statistic_id, e);
                                d.push({ id: c, name: o, strings: [c, o] });
                              }
                            }
                          }),
                          d.length
                            ? (d.length > 1 &&
                                d.sort(function (e, i) {
                                  return (0, U.$)(
                                    e.name || "",
                                    i.name || "",
                                    t.hass.locale.language
                                  );
                                }),
                              d.push({
                                id: "__missing",
                                name: t.hass.localize(
                                  "ui.components.statistic-picker.missing_entity"
                                ),
                                strings: [],
                              }),
                              d)
                            : [
                                {
                                  id: "",
                                  name: t.hass.localize(
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
                      var e = this;
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
                            : this.updateComplete.then(function () {
                                e._statistics = e._getStatistics(
                                  e.statisticIds,
                                  e.includeStatisticsUnitOfMeasurement,
                                  e.includeUnitClass,
                                  e.includeDeviceClass,
                                  e.entitiesOnly,
                                  e.excludeStatistics,
                                  e.value
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
                        ? m.Ld
                        : (0, m.dy)(
                            r ||
                              (r = (0, v.Z)([
                                ' <ha-combo-box .hass="',
                                '" .label="',
                                '" .value="',
                                '" .renderer="',
                                '" .disabled="',
                                '" .allowCustomValue="',
                                '" .items="',
                                '" .filteredItems="',
                                '" item-value-path="id" item-id-path="id" item-label-path="name" @opened-changed="',
                                '" @value-changed="',
                                '" @filter-changed="',
                                '"></ha-combo-box> ',
                              ])),
                            this.hass,
                            void 0 === this.label && this.hass
                              ? this.hass.localize(
                                  "ui.components.statistic-picker.statistic"
                                )
                              : this.label,
                            this._value,
                            this._rowRenderer,
                            this.disabled,
                            this.allowCustomEntity,
                            this._statistics,
                            null !== (t = this._filteredItems) && void 0 !== t
                              ? t
                              : this._statistics,
                            this._openedChanged,
                            this._statisticChanged,
                            this._filterChanged
                          );
                    },
                  },
                  {
                    kind: "method",
                    key: "_getStatisticIds",
                    value:
                      ((i = (0, w.Z)(
                        (0, Z.Z)().mark(function t() {
                          return (0, Z.Z)().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      (t.next = 2),
                                      (e = this.hass),
                                      (i = this.statisticTypes),
                                      e.callWS({
                                        type: "recorder/list_statistic_ids",
                                        statistic_type: i,
                                      })
                                    );
                                  case 2:
                                    this.statisticIds = t.sent;
                                  case 3:
                                  case "end":
                                    return t.stop();
                                }
                              var e, i;
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function () {
                        return i.apply(this, arguments);
                      }),
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
                      var e = t.detail.value;
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
                      var e = t.detail.value.toLowerCase();
                      this._filteredItems = e.length
                        ? (0, E.q)(e, this._statistics)
                        : void 0;
                    },
                  },
                  {
                    kind: "method",
                    key: "_setValue",
                    value: function (t) {
                      var e = this;
                      (this.value = t),
                        setTimeout(function () {
                          (0, x.B)(e, "value-changed", { value: t }),
                            (0, x.B)(e, "change");
                        }, 0);
                    },
                  },
                ],
              };
            },
            m.oi
          ),
          (0, _.Z)(
            [(0, C.Mo)("ha-statistics-picker")],
            function (t, e) {
              var i,
                s,
                n = (function (e) {
                  function i() {
                    var e;
                    (0, k.Z)(this, i);
                    for (
                      var s = arguments.length, n = new Array(s), a = 0;
                      a < s;
                      a++
                    )
                      n[a] = arguments[a];
                    return (
                      (e = (0, p.Z)(this, i, [].concat(n))), t((0, y.Z)(e)), e
                    );
                  }
                  return (0, b.Z)(i, e), (0, f.Z)(i);
                })(e);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Array })],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Array })],
                    key: "statisticIds",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: "statistic-types" })],
                    key: "statisticTypes",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "picked-statistic-label" }),
                    ],
                    key: "pickedStatisticLabel",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "pick-statistic-label" }),
                    ],
                    key: "pickStatisticLabel",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({
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
                      (0, C.Cb)({
                        attribute: "include-statistics-unit-of-measurement",
                      }),
                    ],
                    key: "includeStatisticsUnitOfMeasurement",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "include-unit-class" }),
                    ],
                    key: "includeUnitClass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({ attribute: "include-device-class" }),
                    ],
                    key: "includeDeviceClass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, C.Cb)({
                        type: Boolean,
                        attribute: "ignore-restrictions-on-first-statistic",
                      }),
                    ],
                    key: "ignoreRestrictionsOnFirstStatistic",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var t = this;
                      if (!this.hass) return m.Ld;
                      var e =
                          this.ignoreRestrictionsOnFirstStatistic &&
                          this._currentStatistics.length <= 1,
                        i = e
                          ? void 0
                          : this.includeStatisticsUnitOfMeasurement,
                        s = e ? void 0 : this.includeUnitClass,
                        n = e ? void 0 : this.includeDeviceClass,
                        a = e ? void 0 : this.statisticTypes;
                      return (0, m.dy)(
                        u ||
                          (u = (0, v.Z)([
                            " ",
                            ' <div> <ha-statistic-picker .hass="',
                            '" .includeStatisticsUnitOfMeasurement="',
                            '" .includeUnitClass="',
                            '" .includeDeviceClass="',
                            '" .statisticTypes="',
                            '" .statisticIds="',
                            '" .label="',
                            '" .excludeStatistics="',
                            '" .allowCustomEntity="',
                            '" @value-changed="',
                            '"></ha-statistic-picker> </div> ',
                          ])),
                        (0, S.r)(
                          this._currentStatistics,
                          function (t) {
                            return t;
                          },
                          function (e) {
                            return (0, m.dy)(
                              c ||
                                (c = (0, v.Z)([
                                  ' <div> <ha-statistic-picker .curValue="',
                                  '" .hass="',
                                  '" .includeStatisticsUnitOfMeasurement="',
                                  '" .includeUnitClass="',
                                  '" .includeDeviceClass="',
                                  '" .value="',
                                  '" .statisticTypes="',
                                  '" .statisticIds="',
                                  '" .label="',
                                  '" .excludeStatistics="',
                                  '" .allowCustomEntity="',
                                  '" @value-changed="',
                                  '"></ha-statistic-picker> </div> ',
                                ])),
                              e,
                              t.hass,
                              i,
                              s,
                              n,
                              e,
                              a,
                              t.statisticIds,
                              t.pickedStatisticLabel,
                              t.value,
                              t.allowCustomEntity,
                              t._statisticChanged
                            );
                          }
                        ),
                        this.hass,
                        this.includeStatisticsUnitOfMeasurement,
                        this.includeUnitClass,
                        this.includeDeviceClass,
                        this.statisticTypes,
                        this.statisticIds,
                        this.pickStatisticLabel,
                        this.value,
                        this.allowCustomEntity,
                        this._addStatistic
                      );
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
                    value:
                      ((s = (0, w.Z)(
                        (0, Z.Z)().mark(function t(e) {
                          return (0, Z.Z)().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    (this.value = e),
                                      (0, x.B)(this, "value-changed", {
                                        value: e,
                                      });
                                  case 2:
                                  case "end":
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return s.apply(this, arguments);
                      }),
                  },
                  {
                    kind: "method",
                    key: "_statisticChanged",
                    value: function (t) {
                      t.stopPropagation();
                      var e = t.currentTarget.curValue,
                        i = t.detail.value;
                      if (i !== e) {
                        var s = this._currentStatistics;
                        i && !s.includes(i)
                          ? this._updateStatistics(
                              s.map(function (t) {
                                return t === e ? i : t;
                              })
                            )
                          : this._updateStatistics(
                              s.filter(function (t) {
                                return t !== e;
                              })
                            );
                      }
                    },
                  },
                  {
                    kind: "method",
                    key: "_addStatistic",
                    value:
                      ((i = (0, w.Z)(
                        (0, Z.Z)().mark(function t(e) {
                          var i, s;
                          return (0, Z.Z)().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      (e.stopPropagation(),
                                      (i = e.detail.value))
                                    ) {
                                      t.next = 4;
                                      break;
                                    }
                                    return t.abrupt("return");
                                  case 4:
                                    if (((e.currentTarget.value = ""), i)) {
                                      t.next = 7;
                                      break;
                                    }
                                    return t.abrupt("return");
                                  case 7:
                                    if (
                                      !(s = this._currentStatistics).includes(i)
                                    ) {
                                      t.next = 10;
                                      break;
                                    }
                                    return t.abrupt("return");
                                  case 10:
                                    this._updateStatistics(
                                      [].concat((0, g.Z)(s), [i])
                                    );
                                  case 11:
                                  case "end":
                                    return t.stop();
                                }
                            },
                            t,
                            this
                          );
                        })
                      )),
                      function (t) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, m.iv)(
                        o ||
                          (o = (0, v.Z)([
                            ":host{width:200px;display:block}ha-statistic-picker{display:block;width:100%;margin-top:8px}",
                          ]))
                      );
                    },
                  },
                ],
              };
            },
            m.oi
          ),
          (0, _.Z)(
            [(0, C.Mo)("ha-selector-statistic")],
            function (t, e) {
              var i = (function (e) {
                function i() {
                  var e;
                  (0, k.Z)(this, i);
                  for (
                    var s = arguments.length, n = new Array(s), a = 0;
                    a < s;
                    a++
                  )
                    n[a] = arguments[a];
                  return (
                    (e = (0, p.Z)(this, i, [].concat(n))), t((0, y.Z)(e)), e
                  );
                }
                return (0, b.Z)(i, e), (0, f.Z)(i);
              })(e);
              return {
                F: i,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, C.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this.selector.statistic.multiple
                        ? (0, m.dy)(
                            d ||
                              (d = (0, v.Z)([
                                " ",
                                ' <ha-statistics-picker .hass="',
                                '" .value="',
                                '" .helper="',
                                '" .disabled="',
                                '" .required="',
                                '"></ha-statistics-picker> ',
                              ])),
                            this.label
                              ? (0, m.dy)(
                                  h || (h = (0, v.Z)(["<label>", "</label>"])),
                                  this.label
                                )
                              : "",
                            this.hass,
                            this.value,
                            this.helper,
                            this.disabled,
                            this.required
                          )
                        : (0, m.dy)(
                            l ||
                              (l = (0, v.Z)([
                                '<ha-statistic-picker .hass="',
                                '" .value="',
                                '" .label="',
                                '" .helper="',
                                '" .disabled="',
                                '" .required="',
                                '" allow-custom-entity></ha-statistic-picker>',
                              ])),
                            this.hass,
                            this.value,
                            this.label,
                            this.helper,
                            this.disabled,
                            this.required
                          );
                    },
                  },
                ],
              };
            },
            m.oi
          ));
    },
    92599: function (t, e, i) {
      i.d(e, {
        iI: function () {
          return n;
        },
        oT: function () {
          return s;
        },
      });
      i(99312),
        i(81043),
        i(83609),
        i(97393),
        i(46349),
        i(70320),
        i(22859),
        i(85717),
        i(46798),
        i(47084),
        i(88770),
        i(40271),
        i(60163),
        i(2094),
        "".concat(location.protocol, "//").concat(location.host);
      var s = function (t) {
          return t.map(function (t) {
            if ("string" !== t.type) return t;
            switch (t.name) {
              case "username":
                return Object.assign(
                  Object.assign({}, t),
                  {},
                  { autocomplete: "username" }
                );
              case "password":
                return Object.assign(
                  Object.assign({}, t),
                  {},
                  { autocomplete: "current-password" }
                );
              case "code":
                return Object.assign(
                  Object.assign({}, t),
                  {},
                  { autocomplete: "one-time-code" }
                );
              default:
                return t;
            }
          });
        },
        n = function (t, e) {
          return t.callWS({ type: "auth/sign_path", path: e });
        };
    },
    21157: function (t, e, i) {
      i.d(e, {
        PX: function () {
          return r;
        },
        V_: function () {
          return u;
        },
        nZ: function () {
          return n;
        },
        rk: function () {
          return o;
        },
      });
      var s = i(58135),
        n = "unavailable",
        a = "unknown",
        r = "off",
        u = [n, a],
        c = [n, a, r],
        o = (0, s.z)(u);
      (0, s.z)(c);
    },
    84728: function (t, e, i) {
      i.d(e, {
        R: function () {
          return s;
        },
      });
      i(97393), i(40271), i(60163);
      var s = function (t, e) {
        return "https://"
          .concat(
            t.config.version.includes("b")
              ? "rc"
              : t.config.version.includes("dev")
              ? "next"
              : "www",
            ".home-assistant.io"
          )
          .concat(e);
      };
    },
    95818: function (t, e, i) {
      i(68077)(
        { target: "Number", stat: !0, nonConfigurable: !0, nonWritable: !0 },
        { MIN_SAFE_INTEGER: -9007199254740991 }
      );
    },
    99266: function (t, e, i) {
      i.d(e, {
        r: function () {
          return f;
        },
      });
      var s = i(62746),
        n = i(40039),
        a = i(71650),
        r = i(33368),
        u = i(95281),
        c = i(68308),
        o = i(69205),
        l =
          (i(51358), i(96043), i(46798), i(5239), i(98490), i(51467), i(32982)),
        d = i(16616),
        h = i(41005),
        v = function (t, e, i) {
          for (var s = new Map(), n = e; n <= i; n++) s.set(t[n], n);
          return s;
        },
        f = (0, d.XM)(
          (function (t) {
            function e(t) {
              var i;
              if (
                ((0, a.Z)(this, e),
                (i = (0, c.Z)(this, e, [t])),
                t.type !== d.pX.CHILD)
              )
                throw Error("repeat() can only be used in text expressions");
              return (0, u.Z)(i);
            }
            return (
              (0, o.Z)(e, t),
              (0, r.Z)(e, [
                {
                  key: "ct",
                  value: function (t, e, i) {
                    var s;
                    void 0 === i ? (i = e) : void 0 !== e && (s = e);
                    var a,
                      r = [],
                      u = [],
                      c = 0,
                      o = (0, n.Z)(t);
                    try {
                      for (o.s(); !(a = o.n()).done; ) {
                        var l = a.value;
                        (r[c] = s ? s(l, c) : c), (u[c] = i(l, c)), c++;
                      }
                    } catch (d) {
                      o.e(d);
                    } finally {
                      o.f();
                    }
                    return { values: u, keys: r };
                  },
                },
                {
                  key: "render",
                  value: function (t, e, i) {
                    return this.ct(t, e, i).values;
                  },
                },
                {
                  key: "update",
                  value: function (t, e) {
                    var i,
                      n = (0, s.Z)(e, 3),
                      a = n[0],
                      r = n[1],
                      u = n[2],
                      c = (0, h.i9)(t),
                      o = this.ct(a, r, u),
                      d = o.values,
                      f = o.keys;
                    if (!Array.isArray(c)) return (this.ut = f), d;
                    for (
                      var k,
                        p,
                        y =
                          null !== (i = this.ut) && void 0 !== i
                            ? i
                            : (this.ut = []),
                        b = [],
                        _ = 0,
                        m = c.length - 1,
                        C = 0,
                        g = d.length - 1;
                      _ <= m && C <= g;

                    )
                      if (null === c[_]) _++;
                      else if (null === c[m]) m--;
                      else if (y[_] === f[C])
                        (b[C] = (0, h.fk)(c[_], d[C])), _++, C++;
                      else if (y[m] === f[g])
                        (b[g] = (0, h.fk)(c[m], d[g])), m--, g--;
                      else if (y[_] === f[g])
                        (b[g] = (0, h.fk)(c[_], d[g])),
                          (0, h._Y)(t, b[g + 1], c[_]),
                          _++,
                          g--;
                      else if (y[m] === f[C])
                        (b[C] = (0, h.fk)(c[m], d[C])),
                          (0, h._Y)(t, c[_], c[m]),
                          m--,
                          C++;
                      else if (
                        (void 0 === k && ((k = v(f, C, g)), (p = v(y, _, m))),
                        k.has(y[_]))
                      )
                        if (k.has(y[m])) {
                          var Z = p.get(f[C]),
                            w = void 0 !== Z ? c[Z] : null;
                          if (null === w) {
                            var S = (0, h._Y)(t, c[_]);
                            (0, h.fk)(S, d[C]), (b[C] = S);
                          } else
                            (b[C] = (0, h.fk)(w, d[C])),
                              (0, h._Y)(t, c[_], w),
                              (c[Z] = null);
                          C++;
                        } else (0, h.ws)(c[m]), m--;
                      else (0, h.ws)(c[_]), _++;
                    for (; C <= g; ) {
                      var x = (0, h._Y)(t, b[g + 1]);
                      (0, h.fk)(x, d[C]), (b[C++] = x);
                    }
                    for (; _ <= m; ) {
                      var I = c[_++];
                      null !== I && (0, h.ws)(I);
                    }
                    return (this.ut = f), (0, h.hl)(t, b), l.Jb;
                  },
                },
              ]),
              e
            );
          })(d.Xe)
        );
    },
    36142: function (t, e, i) {
      i.d(e, {
        C: function () {
          return _;
        },
      });
      var s = i(99312),
        n = i(81043),
        a = i(71650),
        r = i(33368),
        u = i(68308),
        c = i(82390),
        o = i(69205),
        l =
          (i(85472), i(46798), i(9849), i(90126), i(47084), i(56308), i(32982)),
        d = i(41005),
        h = i(36585);
      i(94738),
        i(98214),
        i(53918),
        i(20254),
        i(51358),
        i(5239),
        i(98490),
        i(51467);
      var v = (function () {
          function t(e) {
            (0, a.Z)(this, t), (this.G = e);
          }
          return (
            (0, r.Z)(t, [
              {
                key: "disconnect",
                value: function () {
                  this.G = void 0;
                },
              },
              {
                key: "reconnect",
                value: function (t) {
                  this.G = t;
                },
              },
              {
                key: "deref",
                value: function () {
                  return this.G;
                },
              },
            ]),
            t
          );
        })(),
        f = (function () {
          function t() {
            (0, a.Z)(this, t), (this.Y = void 0), (this.Z = void 0);
          }
          return (
            (0, r.Z)(t, [
              {
                key: "get",
                value: function () {
                  return this.Y;
                },
              },
              {
                key: "pause",
                value: function () {
                  var t,
                    e = this;
                  (null !== (t = this.Y) && void 0 !== t) ||
                    (this.Y = new Promise(function (t) {
                      return (e.Z = t);
                    }));
                },
              },
              {
                key: "resume",
                value: function () {
                  var t;
                  null === (t = this.Z) || void 0 === t || t.call(this),
                    (this.Y = this.Z = void 0);
                },
              },
            ]),
            t
          );
        })(),
        k = i(16616),
        p = function (t) {
          return !(0, d.pt)(t) && "function" == typeof t.then;
        },
        y = 1073741823,
        b = (function (t) {
          function e() {
            var t;
            return (
              (0, a.Z)(this, e),
              ((t = (0, u.Z)(this, e, arguments))._$C_t = y),
              (t._$Cwt = []),
              (t._$Cq = new v((0, c.Z)(t))),
              (t._$CK = new f()),
              t
            );
          }
          return (
            (0, o.Z)(e, t),
            (0, r.Z)(e, [
              {
                key: "render",
                value: function () {
                  for (
                    var t, e = arguments.length, i = new Array(e), s = 0;
                    s < e;
                    s++
                  )
                    i[s] = arguments[s];
                  return null !==
                    (t = i.find(function (t) {
                      return !p(t);
                    })) && void 0 !== t
                    ? t
                    : l.Jb;
                },
              },
              {
                key: "update",
                value: function (t, e) {
                  var i = this,
                    a = this._$Cwt,
                    r = a.length;
                  this._$Cwt = e;
                  var u = this._$Cq,
                    c = this._$CK;
                  this.isConnected || this.disconnected();
                  for (
                    var o,
                      d = function () {
                        var t = e[h];
                        if (!p(t)) return { v: ((i._$C_t = h), t) };
                        (h < r && t === a[h]) ||
                          ((i._$C_t = y),
                          (r = 0),
                          Promise.resolve(t).then(
                            (function () {
                              var e = (0, n.Z)(
                                (0, s.Z)().mark(function e(i) {
                                  var n, a;
                                  return (0, s.Z)().wrap(function (e) {
                                    for (;;)
                                      switch ((e.prev = e.next)) {
                                        case 0:
                                          if (!c.get()) {
                                            e.next = 5;
                                            break;
                                          }
                                          return (e.next = 3), c.get();
                                        case 3:
                                          e.next = 0;
                                          break;
                                        case 5:
                                          void 0 !== (n = u.deref()) &&
                                            (a = n._$Cwt.indexOf(t)) > -1 &&
                                            a < n._$C_t &&
                                            ((n._$C_t = a), n.setValue(i));
                                        case 7:
                                        case "end":
                                          return e.stop();
                                      }
                                  }, e);
                                })
                              );
                              return function (t) {
                                return e.apply(this, arguments);
                              };
                            })()
                          ));
                      },
                      h = 0;
                    h < e.length && !(h > this._$C_t);
                    h++
                  )
                    if ((o = d())) return o.v;
                  return l.Jb;
                },
              },
              {
                key: "disconnected",
                value: function () {
                  this._$Cq.disconnect(), this._$CK.pause();
                },
              },
              {
                key: "reconnected",
                value: function () {
                  this._$Cq.reconnect(this), this._$CK.resume();
                },
              },
            ]),
            e
          );
        })(h.sR),
        _ = (0, k.XM)(b);
    },
  },
]);
//# sourceMappingURL=9693.kqhOTaEt_9A.js.map
