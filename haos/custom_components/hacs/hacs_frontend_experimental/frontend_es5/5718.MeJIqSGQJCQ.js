"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [5718],
  {
    25718: function (e, t, i) {
      var n,
        a,
        r = i(46097),
        s = i(99312),
        o = i(81043),
        u = i(33368),
        d = i(71650),
        l = i(68308),
        c = i(82390),
        h = i(69205),
        v = i(91808),
        f = i(88962),
        p =
          (i(22859),
          i(97393),
          i(87438),
          i(46798),
          i(9849),
          i(22890),
          i(13526),
          i(40271),
          i(60163),
          i(49089),
          i(46349),
          i(70320),
          i(10733),
          i(85717),
          i(5095)),
        _ = i(95260),
        m = i(53180),
        k = i(14516),
        b = i(18394),
        y = i(36655),
        g = i(1913),
        x = i(97477),
        C = i(16061),
        Z = i(11285),
        B =
          (i(16591),
          i(54371),
          i(90532),
          i(37662),
          function (e) {
            return (0, p.dy)(
              n ||
                (n = (0, f.Z)([
                  '<ha-list-item class="',
                  '"> ',
                  " </ha-list-item>",
                ])),
              (0, m.$)({ "add-new": "add_new" === e.area_id }),
              e.name
            );
          });
      (0, v.Z)(
        [(0, _.Mo)("ha-area-picker")],
        function (e, t) {
          var i,
            n,
            v = (function (t) {
              function i() {
                var t;
                (0, d.Z)(this, i);
                for (
                  var n = arguments.length, a = new Array(n), r = 0;
                  r < n;
                  r++
                )
                  a[r] = arguments[r];
                return (t = (0, l.Z)(this, i, [].concat(a))), e((0, c.Z)(t)), t;
              }
              return (0, h.Z)(i, t), (0, u.Z)(i);
            })(t);
          return {
            F: v,
            d: [
              {
                kind: "field",
                decorators: [(0, _.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "label",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "helper",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "placeholder",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)({ type: Boolean, attribute: "no-add" })],
                key: "noAdd",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "include-domains" }),
                ],
                key: "includeDomains",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "exclude-domains" }),
                ],
                key: "excludeDomains",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({
                    type: Array,
                    attribute: "include-device-classes",
                  }),
                ],
                key: "includeDeviceClasses",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "exclude-areas" }),
                ],
                key: "excludeAreas",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "deviceFilter",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "entityFilter",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)({ type: Boolean })],
                key: "disabled",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)({ type: Boolean })],
                key: "required",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, _.SB)()],
                key: "_opened",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.IO)("ha-combo-box", !0)],
                key: "comboBox",
                value: void 0,
              },
              { kind: "field", key: "_suggestion", value: void 0 },
              {
                kind: "field",
                key: "_init",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "method",
                key: "open",
                value:
                  ((n = (0, o.Z)(
                    (0, s.Z)().mark(function e() {
                      var t;
                      return (0, s.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.updateComplete;
                              case 2:
                                return (
                                  (e.next = 4),
                                  null === (t = this.comboBox) || void 0 === t
                                    ? void 0
                                    : t.open()
                                );
                              case 4:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return n.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "focus",
                value:
                  ((i = (0, o.Z)(
                    (0, s.Z)().mark(function e() {
                      var t;
                      return (0, s.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.updateComplete;
                              case 2:
                                return (
                                  (e.next = 4),
                                  null === (t = this.comboBox) || void 0 === t
                                    ? void 0
                                    : t.focus()
                                );
                              case 4:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return i.apply(this, arguments);
                  }),
              },
              {
                kind: "field",
                key: "_getAreas",
                value: function () {
                  var e = this;
                  return (0, k.Z)(function (t, i, n, a, s, o, u, d, l, c) {
                    if (!t.length)
                      return [
                        {
                          area_id: "no_areas",
                          name: e.hass.localize(
                            "ui.components.area-picker.no_areas"
                          ),
                          picture: null,
                          aliases: [],
                        },
                      ];
                    var h,
                      v,
                      f = {};
                    (a || s || o || u || d) &&
                      ((f = (0, C.R6)(n)),
                      (h = i),
                      (v = n.filter(function (e) {
                        return e.area_id;
                      })),
                      a &&
                        ((h = h.filter(function (e) {
                          var t = f[e.id];
                          return (
                            !(!t || !t.length) &&
                            f[e.id].some(function (e) {
                              return a.includes((0, y.M)(e.entity_id));
                            })
                          );
                        })),
                        (v = v.filter(function (e) {
                          return a.includes((0, y.M)(e.entity_id));
                        }))),
                      s &&
                        ((h = h.filter(function (e) {
                          var t = f[e.id];
                          return (
                            !t ||
                            !t.length ||
                            n.every(function (e) {
                              return !s.includes((0, y.M)(e.entity_id));
                            })
                          );
                        })),
                        (v = v.filter(function (e) {
                          return !s.includes((0, y.M)(e.entity_id));
                        }))),
                      o &&
                        ((h = h.filter(function (t) {
                          var i = f[t.id];
                          return (
                            !(!i || !i.length) &&
                            f[t.id].some(function (t) {
                              var i = e.hass.states[t.entity_id];
                              return (
                                !!i &&
                                i.attributes.device_class &&
                                o.includes(i.attributes.device_class)
                              );
                            })
                          );
                        })),
                        (v = v.filter(function (t) {
                          var i = e.hass.states[t.entity_id];
                          return (
                            i.attributes.device_class &&
                            o.includes(i.attributes.device_class)
                          );
                        }))),
                      u &&
                        (h = h.filter(function (e) {
                          return u(e);
                        })),
                      d &&
                        ((h = h.filter(function (t) {
                          var i = f[t.id];
                          return (
                            !(!i || !i.length) &&
                            f[t.id].some(function (t) {
                              var i = e.hass.states[t.entity_id];
                              return !!i && d(i);
                            })
                          );
                        })),
                        (v = v.filter(function (t) {
                          var i = e.hass.states[t.entity_id];
                          return !!i && d(i);
                        }))));
                    var p,
                      _,
                      m = t;
                    (h &&
                      (p = h
                        .filter(function (e) {
                          return e.area_id;
                        })
                        .map(function (e) {
                          return e.area_id;
                        })),
                    v) &&
                      (p = (null !== (_ = p) && void 0 !== _ ? _ : []).concat(
                        v
                          .filter(function (e) {
                            return e.area_id;
                          })
                          .map(function (e) {
                            return e.area_id;
                          })
                      ));
                    return (
                      p &&
                        (m = t.filter(function (e) {
                          return p.includes(e.area_id);
                        })),
                      c &&
                        (m = m.filter(function (e) {
                          return !c.includes(e.area_id);
                        })),
                      m.length ||
                        (m = [
                          {
                            area_id: "no_areas",
                            name: e.hass.localize(
                              "ui.components.area-picker.no_match"
                            ),
                            picture: null,
                            aliases: [],
                          },
                        ]),
                      l
                        ? m
                        : [].concat((0, r.Z)(m), [
                            {
                              area_id: "add_new",
                              name: e.hass.localize(
                                "ui.components.area-picker.add_new"
                              ),
                              picture: null,
                              aliases: [],
                            },
                          ])
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
                    var t = this._getAreas(
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
                    ).map(function (e) {
                      return Object.assign(
                        Object.assign({}, e),
                        {},
                        {
                          strings: [e.area_id].concat((0, r.Z)(e.aliases), [
                            e.name,
                          ]),
                        }
                      );
                    });
                    (this.comboBox.items = t),
                      (this.comboBox.filteredItems = t);
                  }
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  var e;
                  return (0, p.dy)(
                    a ||
                      (a = (0, f.Z)([
                        ' <ha-combo-box .hass="',
                        '" .helper="',
                        '" item-value-path="area_id" item-id-path="area_id" item-label-path="name" .value="',
                        '" .disabled="',
                        '" .required="',
                        '" .label="',
                        '" .placeholder="',
                        '" .renderer="',
                        '" @filter-changed="',
                        '" @opened-changed="',
                        '" @value-changed="',
                        '"> </ha-combo-box> ',
                      ])),
                    this.hass,
                    this.helper,
                    this._value,
                    this.disabled,
                    this.required,
                    void 0 === this.label && this.hass
                      ? this.hass.localize("ui.components.area-picker.area")
                      : this.label,
                    this.placeholder
                      ? null === (e = this.hass.areas[this.placeholder]) ||
                        void 0 === e
                        ? void 0
                        : e.name
                      : void 0,
                    B,
                    this._filterChanged,
                    this._openedChanged,
                    this._areaChanged
                  );
                },
              },
              {
                kind: "method",
                key: "_filterChanged",
                value: function (e) {
                  var t = e.target,
                    i = e.detail.value;
                  if (i) {
                    var n = (0, g.q)(i, t.items || []);
                    this.noAdd || 0 !== (null == n ? void 0 : n.length)
                      ? (this.comboBox.filteredItems = n)
                      : ((this._suggestion = i),
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
                  } else this.comboBox.filteredItems = this.comboBox.items;
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
                  var t = this;
                  e.stopPropagation();
                  var i,
                    n = e.detail.value;
                  ("no_areas" === n && (n = ""),
                  ["add_new_suggestion", "add_new"].includes(n))
                    ? ((e.target.value = this._value),
                      (0, Z.D9)(this, {
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
                          "add_new_suggestion" === n
                            ? this._suggestion
                            : void 0,
                        confirm:
                          ((i = (0, o.Z)(
                            (0, s.Z)().mark(function e(i) {
                              var n, a;
                              return (0, s.Z)().wrap(
                                function (e) {
                                  for (;;)
                                    switch ((e.prev = e.next)) {
                                      case 0:
                                        if (i) {
                                          e.next = 2;
                                          break;
                                        }
                                        return e.abrupt("return");
                                      case 2:
                                        return (
                                          (e.prev = 2),
                                          (e.next = 5),
                                          (0, x.Lo)(t.hass, { name: i })
                                        );
                                      case 5:
                                        return (
                                          (n = e.sent),
                                          (a = [].concat(
                                            (0, r.Z)(
                                              Object.values(t.hass.areas)
                                            ),
                                            [n]
                                          )),
                                          (t.comboBox.filteredItems =
                                            t._getAreas(
                                              a,
                                              Object.values(t.hass.devices),
                                              Object.values(t.hass.entities),
                                              t.includeDomains,
                                              t.excludeDomains,
                                              t.includeDeviceClasses,
                                              t.deviceFilter,
                                              t.entityFilter,
                                              t.noAdd,
                                              t.excludeAreas
                                            )),
                                          (e.next = 10),
                                          t.updateComplete
                                        );
                                      case 10:
                                        return (
                                          (e.next = 12),
                                          t.comboBox.updateComplete
                                        );
                                      case 12:
                                        t._setValue(n.area_id), (e.next = 18);
                                        break;
                                      case 15:
                                        (e.prev = 15),
                                          (e.t0 = e.catch(2)),
                                          (0, Z.Ys)(t, {
                                            title: t.hass.localize(
                                              "ui.components.area-picker.add_dialog.failed_create_area"
                                            ),
                                            text: e.t0.message,
                                          });
                                      case 18:
                                      case "end":
                                        return e.stop();
                                    }
                                },
                                e,
                                null,
                                [[2, 15]]
                              );
                            })
                          )),
                          function (e) {
                            return i.apply(this, arguments);
                          }),
                        cancel: function () {
                          t._setValue(void 0),
                            (t._suggestion = void 0),
                            t.comboBox.setInputValue("");
                        },
                      }))
                    : n !== this._value && this._setValue(n);
                },
              },
              {
                kind: "method",
                key: "_setValue",
                value: function (e) {
                  var t = this;
                  (this.value = e),
                    setTimeout(function () {
                      (0, b.B)(t, "value-changed", { value: e }),
                        (0, b.B)(t, "change");
                    }, 0);
                },
              },
            ],
          };
        },
        p.oi
      );
    },
    97477: function (e, t, i) {
      i.d(t, {
        a: function () {
          return l;
        },
        Lo: function () {
          return d;
        },
        sG: function () {
          return u;
        },
      });
      i(40039), i(85717), i(36513), i(56308), i(22859);
      var n = i(28858),
        a = (i(37313), i(72881)),
        r = i(72218),
        s = function (e) {
          return e
            .sendMessagePromise({ type: "config/area_registry/list" })
            .then(function (e) {
              return e.sort(function (e, t) {
                return (0, n.$)(e.name, t.name);
              });
            });
        },
        o = function (e, t) {
          return e.subscribeEvents(
            (0, r.D)(
              function () {
                return s(e).then(function (e) {
                  return t.setState(e, !0);
                });
              },
              500,
              !0
            ),
            "area_registry_updated"
          );
        },
        u = function (e, t) {
          return (0, a.B)("_areaRegistry", s, o, e, t);
        },
        d = function (e, t) {
          return e.callWS(
            Object.assign({ type: "config/area_registry/create" }, t)
          );
        },
        l = function (e, t) {
          return function (i, a) {
            var r = t ? t.indexOf(i) : -1,
              s = t ? t.indexOf(a) : -1;
            if (-1 === r && -1 === s) {
              var o,
                u,
                d,
                l,
                c =
                  null !==
                    (o =
                      null == e || null === (u = e[i]) || void 0 === u
                        ? void 0
                        : u.name) && void 0 !== o
                    ? o
                    : i,
                h =
                  null !==
                    (d =
                      null == e || null === (l = e[a]) || void 0 === l
                        ? void 0
                        : l.name) && void 0 !== d
                    ? d
                    : a;
              return (0, n.$)(c, h);
            }
            return -1 === r ? 1 : -1 === s ? -1 : r - s;
          };
        };
    },
  },
]);
//# sourceMappingURL=5718.MeJIqSGQJCQ.js.map
