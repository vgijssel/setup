"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [657],
  {
    52996: function (e, t, n) {
      n.d(t, {
        p: function () {
          return r;
        },
      });
      n(40271), n(60163);
      var r = function (e, t) {
        return e && e.config.components.includes(t);
      };
    },
    20657: function (e, t, n) {
      n.r(t),
        n.d(t, {
          HaAddonSelector: function () {
            return N;
          },
        });
      var r,
        i,
        a,
        o,
        d,
        s,
        u = n(88962),
        l = n(33368),
        c = n(71650),
        h = n(68308),
        v = n(82390),
        f = n(69205),
        k = n(91808),
        p = (n(97393), n(5095)),
        b = n(95260),
        y = n(99312),
        m = n(81043),
        Z =
          (n(22859), n(37313), n(87438), n(46798), n(9849), n(22890), n(52996)),
        _ = n(18394),
        g = n(28858),
        C = (n(51467), n(85472), n(90126), n(62746)),
        x =
          (n(76843),
          n(40271),
          n(60163),
          n(76775),
          n(51358),
          n(78399),
          n(5239),
          n(56086),
          n(47884),
          n(81912),
          n(64584),
          n(41483),
          n(12367),
          n(9454),
          n(98490),
          function (e) {
            return e.data;
          }),
        w =
          (new Set([502, 503, 504]),
          (function () {
            var e = (0, m.Z)(
              (0, y.Z)().mark(function e(t) {
                return (0, y.Z)().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          ((n = t.config.version),
                          (r = 2021),
                          (i = 2),
                          (a = 4),
                          (o = void 0),
                          (d = void 0),
                          (s = void 0),
                          (u = void 0),
                          (l = void 0),
                          (o = n.split(".", 3)),
                          (d = (0, C.Z)(o, 3)),
                          (s = d[0]),
                          (u = d[1]),
                          (l = d[2]),
                          !(
                            Number(s) > r ||
                            (Number(s) === r &&
                              (void 0 === a
                                ? Number(u) >= i
                                : Number(u) > i)) ||
                            (void 0 !== a &&
                              Number(s) === r &&
                              Number(u) === i &&
                              Number(l) >= a)
                          ))
                        ) {
                          e.next = 2;
                          break;
                        }
                        return e.abrupt(
                          "return",
                          t.callWS({
                            type: "supervisor/api",
                            endpoint: "/addons",
                            method: "get",
                          })
                        );
                      case 2:
                        return (
                          (e.t0 = x),
                          (e.next = 5),
                          t.callApi("GET", "hassio/addons")
                        );
                      case 5:
                        return (
                          (e.t1 = e.sent), e.abrupt("return", (0, e.t0)(e.t1))
                        );
                      case 7:
                      case "end":
                        return e.stop();
                    }
                  var n, r, i, a, o, d, s, u, l;
                }, e);
              })
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })()),
        B =
          (n(23860),
          n(16591),
          n(90532),
          function (e) {
            return (0, p.dy)(
              r ||
                (r = (0, u.Z)([
                  '<ha-list-item twoline graphic="icon"> <span>',
                  '</span> <span slot="secondary">',
                  "</span> ",
                  " </ha-list-item>",
                ])),
              e.name,
              e.slug,
              e.icon
                ? (0, p.dy)(
                    i ||
                      (i = (0, u.Z)([
                        '<img alt="" slot="graphic" .src="/api/hassio/addons/',
                        '/icon">',
                      ])),
                    e.slug
                  )
                : ""
            );
          }),
        N =
          ((0, k.Z)(
            [(0, b.Mo)("ha-addon-picker")],
            function (e, t) {
              var n,
                r = (function (t) {
                  function n() {
                    var t;
                    (0, c.Z)(this, n);
                    for (
                      var r = arguments.length, i = new Array(r), a = 0;
                      a < r;
                      a++
                    )
                      i[a] = arguments[a];
                    return (
                      (t = (0, h.Z)(this, n, [].concat(i))), e((0, v.Z)(t)), t
                    );
                  }
                  return (0, f.Z)(n, t), (0, l.Z)(n);
                })(t);
              return {
                F: r,
                d: [
                  { kind: "field", key: "hass", value: void 0 },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "value",
                    value: function () {
                      return "";
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.SB)()],
                    key: "_addons",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.IO)("ha-combo-box")],
                    key: "_comboBox",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.SB)()],
                    key: "_error",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "open",
                    value: function () {
                      var e;
                      null === (e = this._comboBox) || void 0 === e || e.open();
                    },
                  },
                  {
                    kind: "method",
                    key: "focus",
                    value: function () {
                      var e;
                      null === (e = this._comboBox) ||
                        void 0 === e ||
                        e.focus();
                    },
                  },
                  {
                    kind: "method",
                    key: "firstUpdated",
                    value: function () {
                      this._getAddons();
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this._error
                        ? (0, p.dy)(
                            a ||
                              (a = (0, u.Z)([
                                '<ha-alert alert-type="error">',
                                "</ha-alert>",
                              ])),
                            this._error
                          )
                        : this._addons
                        ? (0, p.dy)(
                            o ||
                              (o = (0, u.Z)([
                                ' <ha-combo-box .hass="',
                                '" .label="',
                                '" .value="',
                                '" .required="',
                                '" .disabled="',
                                '" .helper="',
                                '" .renderer="',
                                '" .items="',
                                '" item-value-path="slug" item-id-path="slug" item-label-path="name" @value-changed="',
                                '"></ha-combo-box> ',
                              ])),
                            this.hass,
                            void 0 === this.label && this.hass
                              ? this.hass.localize(
                                  "ui.components.addon-picker.addon"
                                )
                              : this.label,
                            this._value,
                            this.required,
                            this.disabled,
                            this.helper,
                            B,
                            this._addons,
                            this._addonChanged
                          )
                        : p.Ld;
                    },
                  },
                  {
                    kind: "method",
                    key: "_getAddons",
                    value:
                      ((n = (0, m.Z)(
                        (0, y.Z)().mark(function e() {
                          var t,
                            n = this;
                          return (0, y.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((e.prev = 0),
                                      !(0, Z.p)(this.hass, "hassio"))
                                    ) {
                                      e.next = 8;
                                      break;
                                    }
                                    return (e.next = 4), w(this.hass);
                                  case 4:
                                    (t = e.sent),
                                      (this._addons = t.addons
                                        .filter(function (e) {
                                          return e.version;
                                        })
                                        .sort(function (e, t) {
                                          return (0, g.$)(
                                            e.name,
                                            t.name,
                                            n.hass.locale.language
                                          );
                                        })),
                                      (e.next = 9);
                                    break;
                                  case 8:
                                    this._error = this.hass.localize(
                                      "ui.components.addon-picker.error.no_supervisor"
                                    );
                                  case 9:
                                    e.next = 14;
                                    break;
                                  case 11:
                                    (e.prev = 11),
                                      (e.t0 = e.catch(0)),
                                      (this._error = this.hass.localize(
                                        "ui.components.addon-picker.error.fetch_addons"
                                      ));
                                  case 14:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this,
                            [[0, 11]]
                          );
                        })
                      )),
                      function () {
                        return n.apply(this, arguments);
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
                    key: "_addonChanged",
                    value: function (e) {
                      e.stopPropagation();
                      var t = e.detail.value;
                      t !== this._value && this._setValue(t);
                    },
                  },
                  {
                    kind: "method",
                    key: "_setValue",
                    value: function (e) {
                      var t = this;
                      (this.value = e),
                        setTimeout(function () {
                          (0, _.B)(t, "value-changed", { value: e }),
                            (0, _.B)(t, "change");
                        }, 0);
                    },
                  },
                ],
              };
            },
            p.oi
          ),
          (0, k.Z)(
            [(0, b.Mo)("ha-selector-addon")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, c.Z)(this, n);
                  for (
                    var r = arguments.length, i = new Array(r), a = 0;
                    a < r;
                    a++
                  )
                    i[a] = arguments[a];
                  return (
                    (t = (0, h.Z)(this, n, [].concat(i))), e((0, v.Z)(t)), t
                  );
                }
                return (0, f.Z)(n, t), (0, l.Z)(n);
              })(t);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, b.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return (0, p.dy)(
                        d ||
                          (d = (0, u.Z)([
                            '<ha-addon-picker .hass="',
                            '" .value="',
                            '" .label="',
                            '" .helper="',
                            '" .disabled="',
                            '" .required="',
                            '" allow-custom-entity></ha-addon-picker>',
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
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, p.iv)(
                        s || (s = (0, u.Z)(["ha-addon-picker{width:100%}"]))
                      );
                    },
                  },
                ],
              };
            },
            p.oi
          ));
    },
  },
]);
//# sourceMappingURL=657.fPiB7jeibm8.js.map
