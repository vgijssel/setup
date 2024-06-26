/*! For license information please see 6716.ipA_5DF60V4.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [6716],
  {
    6371: function (e, t, i) {
      i.r(t),
        i.d(t, {
          HaEntitySelector: function () {
            return D;
          },
        });
      var n,
        r,
        u,
        a,
        s,
        l,
        d = i(88962),
        o = i(33368),
        c = i(71650),
        h = i(68308),
        v = i(82390),
        f = i(69205),
        y = i(91808),
        k = i(34541),
        p = i(47838),
        b =
          (i(97393), i(87438), i(46798), i(9849), i(22890), i(13526), i(5095)),
        _ = i(95260),
        C = i(4771),
        m = i(18394),
        Z = i(92794),
        E = i(29934),
        g = i(46097),
        x = i(99312),
        w = i(81043),
        $ = (i(46349), i(70320), i(40271), i(60163), i(14516)),
        A = i(11705),
        D =
          (i(91998),
          (0, y.Z)(
            [(0, _.Mo)("ha-entities-picker")],
            function (e, t) {
              var i,
                a,
                s = (function (t) {
                  function i() {
                    var t;
                    (0, c.Z)(this, i);
                    for (
                      var n = arguments.length, r = new Array(n), u = 0;
                      u < n;
                      u++
                    )
                      r[u] = arguments[u];
                    return (
                      (t = (0, h.Z)(this, i, [].concat(r))), e((0, v.Z)(t)), t
                    );
                  }
                  return (0, f.Z)(i, t), (0, o.Z)(i);
                })(t);
              return {
                F: s,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)({ type: Array })],
                    key: "value",
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
                    decorators: [(0, _.Cb)()],
                    key: "helper",
                    value: void 0,
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
                      (0, _.Cb)({
                        type: Array,
                        attribute: "include-unit-of-measurement",
                      }),
                    ],
                    key: "includeUnitOfMeasurement",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, _.Cb)({ type: Array, attribute: "include-entities" }),
                    ],
                    key: "includeEntities",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, _.Cb)({ type: Array, attribute: "exclude-entities" }),
                    ],
                    key: "excludeEntities",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, _.Cb)({ attribute: "picked-entity-label" }),
                    ],
                    key: "pickedEntityLabel",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)({ attribute: "pick-entity-label" })],
                    key: "pickEntityLabel",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)()],
                    key: "entityFilter",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e = this;
                      if (!this.hass) return b.Ld;
                      var t = this._currentEntities;
                      return (0, b.dy)(
                        n ||
                          (n = (0, d.Z)([
                            " ",
                            ' <div> <ha-entity-picker allow-custom-entity .hass="',
                            '" .includeDomains="',
                            '" .excludeDomains="',
                            '" .includeEntities="',
                            '" .excludeEntities="',
                            '" .includeDeviceClasses="',
                            '" .includeUnitOfMeasurement="',
                            '" .entityFilter="',
                            '" .label="',
                            '" .helper="',
                            '" .disabled="',
                            '" .required="',
                            '" @value-changed="',
                            '"></ha-entity-picker> </div> ',
                          ])),
                        t.map(function (t) {
                          return (0, b.dy)(
                            r ||
                              (r = (0, d.Z)([
                                ' <div> <ha-entity-picker allow-custom-entity .curValue="',
                                '" .hass="',
                                '" .includeDomains="',
                                '" .excludeDomains="',
                                '" .includeEntities="',
                                '" .excludeEntities="',
                                '" .includeDeviceClasses="',
                                '" .includeUnitOfMeasurement="',
                                '" .entityFilter="',
                                '" .value="',
                                '" .label="',
                                '" .disabled="',
                                '" @value-changed="',
                                '"></ha-entity-picker> </div> ',
                              ])),
                            t,
                            e.hass,
                            e.includeDomains,
                            e.excludeDomains,
                            e.includeEntities,
                            e.excludeEntities,
                            e.includeDeviceClasses,
                            e.includeUnitOfMeasurement,
                            e._getEntityFilter(e.value, e.entityFilter),
                            t,
                            e.pickedEntityLabel,
                            e.disabled,
                            e._entityChanged
                          );
                        }),
                        this.hass,
                        this.includeDomains,
                        this.excludeDomains,
                        this.includeEntities,
                        this.excludeEntities,
                        this.includeDeviceClasses,
                        this.includeUnitOfMeasurement,
                        this._getEntityFilter(this.value, this.entityFilter),
                        this.pickEntityLabel,
                        this.helper,
                        this.disabled,
                        this.required && !t.length,
                        this._addEntity
                      );
                    },
                  },
                  {
                    kind: "field",
                    key: "_getEntityFilter",
                    value: function () {
                      return (0, $.Z)(function (e, t) {
                        return function (i) {
                          return (
                            (!e || !e.includes(i.entity_id)) && (!t || t(i))
                          );
                        };
                      });
                    },
                  },
                  {
                    kind: "get",
                    key: "_currentEntities",
                    value: function () {
                      return this.value || [];
                    },
                  },
                  {
                    kind: "method",
                    key: "_updateEntities",
                    value:
                      ((a = (0, w.Z)(
                        (0, x.Z)().mark(function e(t) {
                          return (0, x.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    (this.value = t),
                                      (0, m.B)(this, "value-changed", {
                                        value: t,
                                      });
                                  case 2:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e) {
                        return a.apply(this, arguments);
                      }),
                  },
                  {
                    kind: "method",
                    key: "_entityChanged",
                    value: function (e) {
                      e.stopPropagation();
                      var t = e.currentTarget.curValue,
                        i = e.detail.value;
                      if (i !== t && (void 0 === i || (0, A.T)(i))) {
                        var n = this._currentEntities;
                        i && !n.includes(i)
                          ? this._updateEntities(
                              n.map(function (e) {
                                return e === t ? i : e;
                              })
                            )
                          : this._updateEntities(
                              n.filter(function (e) {
                                return e !== t;
                              })
                            );
                      }
                    },
                  },
                  {
                    kind: "method",
                    key: "_addEntity",
                    value:
                      ((i = (0, w.Z)(
                        (0, x.Z)().mark(function e(t) {
                          var i, n;
                          return (0, x.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      (t.stopPropagation(),
                                      (i = t.detail.value))
                                    ) {
                                      e.next = 4;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 4:
                                    if (((t.currentTarget.value = ""), i)) {
                                      e.next = 7;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 7:
                                    if (
                                      !(n = this._currentEntities).includes(i)
                                    ) {
                                      e.next = 10;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 10:
                                    this._updateEntities(
                                      [].concat((0, g.Z)(n), [i])
                                    );
                                  case 11:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e) {
                        return i.apply(this, arguments);
                      }),
                  },
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, b.iv)(
                        u || (u = (0, d.Z)(["div{margin-top:8px}"]))
                      );
                    },
                  },
                ],
              };
            },
            b.oi
          ),
          (0, y.Z)(
            [(0, _.Mo)("ha-selector-entity")],
            function (e, t) {
              var i = (function (t) {
                function i() {
                  var t;
                  (0, c.Z)(this, i);
                  for (
                    var n = arguments.length, r = new Array(n), u = 0;
                    u < n;
                    u++
                  )
                    r[u] = arguments[u];
                  return (
                    (t = (0, h.Z)(this, i, [].concat(r))), e((0, v.Z)(t)), t
                  );
                }
                return (0, f.Z)(i, t), (0, o.Z)(i);
              })(t);
              return {
                F: i,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, _.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, _.SB)()],
                    key: "_entitySources",
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
                    key: "label",
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
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "_hasIntegration",
                    value: function (e) {
                      var t;
                      return (
                        (null === (t = e.entity) || void 0 === t
                          ? void 0
                          : t.filter) &&
                        (0, C.r)(e.entity.filter).some(function (e) {
                          return e.integration;
                        })
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "willUpdate",
                    value: function (e) {
                      var t, i;
                      e.has("selector") &&
                        void 0 !== this.value &&
                        (null !== (t = this.selector.entity) &&
                        void 0 !== t &&
                        t.multiple &&
                        !Array.isArray(this.value)
                          ? ((this.value = [this.value]),
                            (0, m.B)(this, "value-changed", {
                              value: this.value,
                            }))
                          : (null !== (i = this.selector.entity) &&
                              void 0 !== i &&
                              i.multiple) ||
                            !Array.isArray(this.value) ||
                            ((this.value = this.value[0]),
                            (0, m.B)(this, "value-changed", {
                              value: this.value,
                            })));
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e, t, i;
                      return this._hasIntegration(this.selector) &&
                        !this._entitySources
                        ? b.Ld
                        : null !== (e = this.selector.entity) &&
                          void 0 !== e &&
                          e.multiple
                        ? (0, b.dy)(
                            s ||
                              (s = (0, d.Z)([
                                " ",
                                ' <ha-entities-picker .hass="',
                                '" .value="',
                                '" .helper="',
                                '" .includeEntities="',
                                '" .excludeEntities="',
                                '" .entityFilter="',
                                '" .disabled="',
                                '" .required="',
                                '"></ha-entities-picker> ',
                              ])),
                            this.label
                              ? (0, b.dy)(
                                  l || (l = (0, d.Z)(["<label>", "</label>"])),
                                  this.label
                                )
                              : "",
                            this.hass,
                            this.value,
                            this.helper,
                            this.selector.entity.include_entities,
                            this.selector.entity.exclude_entities,
                            this._filterEntities,
                            this.disabled,
                            this.required
                          )
                        : (0, b.dy)(
                            a ||
                              (a = (0, d.Z)([
                                '<ha-entity-picker .hass="',
                                '" .value="',
                                '" .label="',
                                '" .helper="',
                                '" .includeEntities="',
                                '" .excludeEntities="',
                                '" .entityFilter="',
                                '" .disabled="',
                                '" .required="',
                                '" allow-custom-entity></ha-entity-picker>',
                              ])),
                            this.hass,
                            this.value,
                            this.label,
                            this.helper,
                            null === (t = this.selector.entity) || void 0 === t
                              ? void 0
                              : t.include_entities,
                            null === (i = this.selector.entity) || void 0 === i
                              ? void 0
                              : i.exclude_entities,
                            this._filterEntities,
                            this.disabled,
                            this.required
                          );
                    },
                  },
                  {
                    kind: "method",
                    key: "updated",
                    value: function (e) {
                      var t = this;
                      (0, k.Z)((0, p.Z)(i.prototype), "updated", this).call(
                        this,
                        e
                      ),
                        e.has("selector") &&
                          this._hasIntegration(this.selector) &&
                          !this._entitySources &&
                          (0, Z.m)(this.hass).then(function (e) {
                            t._entitySources = e;
                          });
                    },
                  },
                  {
                    kind: "field",
                    key: "_filterEntities",
                    value: function () {
                      var e = this;
                      return function (t) {
                        var i;
                        return (
                          null === (i = e.selector) ||
                          void 0 === i ||
                          null === (i = i.entity) ||
                          void 0 === i ||
                          !i.filter ||
                          (0, C.r)(e.selector.entity.filter).some(function (i) {
                            return (0, E.lV)(i, t, e._entitySources);
                          })
                        );
                      };
                    },
                  },
                ],
              };
            },
            b.oi
          ));
    },
    95818: function (e, t, i) {
      i(68077)(
        { target: "Number", stat: !0, nonConfigurable: !0, nonWritable: !0 },
        { MIN_SAFE_INTEGER: -9007199254740991 }
      );
    },
    36142: function (e, t, i) {
      i.d(t, {
        C: function () {
          return _;
        },
      });
      var n = i(99312),
        r = i(81043),
        u = i(71650),
        a = i(33368),
        s = i(68308),
        l = i(82390),
        d = i(69205),
        o =
          (i(85472), i(46798), i(9849), i(90126), i(47084), i(56308), i(32982)),
        c = i(41005),
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
          function e(t) {
            (0, u.Z)(this, e), (this.G = t);
          }
          return (
            (0, a.Z)(e, [
              {
                key: "disconnect",
                value: function () {
                  this.G = void 0;
                },
              },
              {
                key: "reconnect",
                value: function (e) {
                  this.G = e;
                },
              },
              {
                key: "deref",
                value: function () {
                  return this.G;
                },
              },
            ]),
            e
          );
        })(),
        f = (function () {
          function e() {
            (0, u.Z)(this, e), (this.Y = void 0), (this.Z = void 0);
          }
          return (
            (0, a.Z)(e, [
              {
                key: "get",
                value: function () {
                  return this.Y;
                },
              },
              {
                key: "pause",
                value: function () {
                  var e,
                    t = this;
                  (null !== (e = this.Y) && void 0 !== e) ||
                    (this.Y = new Promise(function (e) {
                      return (t.Z = e);
                    }));
                },
              },
              {
                key: "resume",
                value: function () {
                  var e;
                  null === (e = this.Z) || void 0 === e || e.call(this),
                    (this.Y = this.Z = void 0);
                },
              },
            ]),
            e
          );
        })(),
        y = i(16616),
        k = function (e) {
          return !(0, c.pt)(e) && "function" == typeof e.then;
        },
        p = 1073741823,
        b = (function (e) {
          function t() {
            var e;
            return (
              (0, u.Z)(this, t),
              ((e = (0, s.Z)(this, t, arguments))._$C_t = p),
              (e._$Cwt = []),
              (e._$Cq = new v((0, l.Z)(e))),
              (e._$CK = new f()),
              e
            );
          }
          return (
            (0, d.Z)(t, e),
            (0, a.Z)(t, [
              {
                key: "render",
                value: function () {
                  for (
                    var e, t = arguments.length, i = new Array(t), n = 0;
                    n < t;
                    n++
                  )
                    i[n] = arguments[n];
                  return null !==
                    (e = i.find(function (e) {
                      return !k(e);
                    })) && void 0 !== e
                    ? e
                    : o.Jb;
                },
              },
              {
                key: "update",
                value: function (e, t) {
                  var i = this,
                    u = this._$Cwt,
                    a = u.length;
                  this._$Cwt = t;
                  var s = this._$Cq,
                    l = this._$CK;
                  this.isConnected || this.disconnected();
                  for (
                    var d,
                      c = function () {
                        var e = t[h];
                        if (!k(e)) return { v: ((i._$C_t = h), e) };
                        (h < a && e === u[h]) ||
                          ((i._$C_t = p),
                          (a = 0),
                          Promise.resolve(e).then(
                            (function () {
                              var t = (0, r.Z)(
                                (0, n.Z)().mark(function t(i) {
                                  var r, u;
                                  return (0, n.Z)().wrap(function (t) {
                                    for (;;)
                                      switch ((t.prev = t.next)) {
                                        case 0:
                                          if (!l.get()) {
                                            t.next = 5;
                                            break;
                                          }
                                          return (t.next = 3), l.get();
                                        case 3:
                                          t.next = 0;
                                          break;
                                        case 5:
                                          void 0 !== (r = s.deref()) &&
                                            (u = r._$Cwt.indexOf(e)) > -1 &&
                                            u < r._$C_t &&
                                            ((r._$C_t = u), r.setValue(i));
                                        case 7:
                                        case "end":
                                          return t.stop();
                                      }
                                  }, t);
                                })
                              );
                              return function (e) {
                                return t.apply(this, arguments);
                              };
                            })()
                          ));
                      },
                      h = 0;
                    h < t.length && !(h > this._$C_t);
                    h++
                  )
                    if ((d = c())) return d.v;
                  return o.Jb;
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
            t
          );
        })(h.sR),
        _ = (0, y.XM)(b);
    },
  },
]);
//# sourceMappingURL=6716.ipA_5DF60V4.js.map
