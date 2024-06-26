"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [8689],
  {
    47322: function (e, t, n) {
      var a = n(40039),
        i = n(62746),
        o = n(99312),
        r = n(81043),
        l = n(33368),
        s = n(71650),
        u = n(68308),
        d = n(82390),
        c = n(69205),
        h = n(91808),
        v = n(88962),
        p =
          (n(97393),
          n(46349),
          n(70320),
          n(82073),
          n(85717),
          n(87438),
          n(46798),
          n(9849),
          n(22890),
          n(51358),
          n(47084),
          n(5239),
          n(98490),
          n(96043),
          n(36513),
          n(50289),
          n(94167),
          n(40271),
          n(60163),
          n(44577),
          n(5095)),
        f = n(95260),
        k = n(18394),
        m =
          (n(63789),
          n(24074),
          function (e) {
            return e.replace(/^_*(.)|_+(.)/g, function (e, t, n) {
              return t ? t.toUpperCase() : " " + n.toUpperCase();
            });
          });
      n(16591);
      var b,
        g,
        y,
        _ = [],
        C = function (e) {
          return (0, p.dy)(
            b ||
              (b = (0, v.Z)([
                ' <mwc-list-item graphic="icon" .twoline="',
                '"> <ha-icon .icon="',
                '" slot="graphic"></ha-icon> <span>',
                '</span> <span slot="secondary">',
                "</span> </mwc-list-item> ",
              ])),
            !!e.title,
            e.icon,
            e.title || e.path,
            e.path
          );
        },
        Z = function (e, t, n) {
          var a, i, o;
          return {
            path: "/"
              .concat(e, "/")
              .concat(null !== (a = t.path) && void 0 !== a ? a : n),
            icon:
              null !== (i = t.icon) && void 0 !== i ? i : "mdi:view-compact",
            title:
              null !== (o = t.title) && void 0 !== o
                ? o
                : t.path
                ? m(t.path)
                : "".concat(n),
          };
        },
        w = function (e, t) {
          var n;
          return {
            path: "/".concat(t.url_path),
            icon:
              null !== (n = t.icon) && void 0 !== n ? n : "mdi:view-dashboard",
            title:
              t.url_path === e.defaultPanel
                ? e.localize("panel.states")
                : e.localize("panel.".concat(t.title)) ||
                  t.title ||
                  (t.url_path ? m(t.url_path) : ""),
          };
        };
      (0, h.Z)(
        [(0, f.Mo)("ha-navigation-picker")],
        function (e, t) {
          var n,
            h,
            m = (function (t) {
              function n() {
                var t;
                (0, s.Z)(this, n);
                for (
                  var a = arguments.length, i = new Array(a), o = 0;
                  o < a;
                  o++
                )
                  i[o] = arguments[o];
                return (t = (0, u.Z)(this, n, [].concat(i))), e((0, d.Z)(t)), t;
              }
              return (0, c.Z)(n, t), (0, l.Z)(n);
            })(t);
          return {
            F: m,
            d: [
              {
                kind: "field",
                decorators: [(0, f.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)()],
                key: "label",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)()],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)()],
                key: "helper",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)({ type: Boolean })],
                key: "disabled",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)({ type: Boolean })],
                key: "required",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, f.SB)()],
                key: "_opened",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                key: "navigationItemsLoaded",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                key: "navigationItems",
                value: function () {
                  return _;
                },
              },
              {
                kind: "field",
                decorators: [(0, f.IO)("ha-combo-box", !0)],
                key: "comboBox",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, p.dy)(
                    g ||
                      (g = (0, v.Z)([
                        ' <ha-combo-box .hass="',
                        '" item-value-path="path" item-label-path="path" .value="',
                        '" allow-custom-value .filteredItems="',
                        '" .label="',
                        '" .helper="',
                        '" .disabled="',
                        '" .required="',
                        '" .renderer="',
                        '" @opened-changed="',
                        '" @value-changed="',
                        '" @filter-changed="',
                        '"> </ha-combo-box> ',
                      ])),
                    this.hass,
                    this._value,
                    this.navigationItems,
                    this.label,
                    this.helper,
                    this.disabled,
                    this.required,
                    C,
                    this._openedChanged,
                    this._valueChanged,
                    this._filterChanged
                  );
                },
              },
              {
                kind: "method",
                key: "_openedChanged",
                value:
                  ((h = (0, r.Z)(
                    (0, o.Z)().mark(function e(t) {
                      return (0, o.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                (this._opened = t.detail.value),
                                  this._opened &&
                                    !this.navigationItemsLoaded &&
                                    this._loadNavigationItems();
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
                    return h.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "_loadNavigationItems",
                value:
                  ((n = (0, r.Z)(
                    (0, o.Z)().mark(function e() {
                      var t,
                        n,
                        r,
                        l,
                        s,
                        u,
                        d,
                        c = this;
                      return (0, o.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (this.navigationItemsLoaded = !0),
                                  (t = Object.entries(this.hass.panels).map(
                                    function (e) {
                                      var t = (0, i.Z)(e, 2),
                                        n = t[0],
                                        a = t[1];
                                      return Object.assign({ id: n }, a);
                                    }
                                  )),
                                  (n = t.filter(function (e) {
                                    return "lovelace" === e.component_name;
                                  })),
                                  (e.next = 5),
                                  Promise.all(
                                    n.map(function (e) {
                                      return ((t = c.hass.connection),
                                      (n =
                                        "lovelace" === e.url_path
                                          ? null
                                          : e.url_path),
                                      (a = !0),
                                      t.sendMessagePromise({
                                        type: "lovelace/config",
                                        url_path: n,
                                        force: a,
                                      }))
                                        .then(function (t) {
                                          return [e.id, t];
                                        })
                                        .catch(function (t) {
                                          return [e.id, void 0];
                                        });
                                      var t, n, a;
                                    })
                                  )
                                );
                              case 5:
                                (r = e.sent),
                                  (l = new Map(r)),
                                  (this.navigationItems = []),
                                  (s = (0, a.Z)(t)),
                                  (e.prev = 9),
                                  (d = (0, o.Z)().mark(function e() {
                                    var t, n;
                                    return (0, o.Z)().wrap(function (e) {
                                      for (;;)
                                        switch ((e.prev = e.next)) {
                                          case 0:
                                            if (
                                              ((t = u.value),
                                              c.navigationItems.push(
                                                w(c.hass, t)
                                              ),
                                              (n = l.get(t.id)) && "views" in n)
                                            ) {
                                              e.next = 5;
                                              break;
                                            }
                                            return e.abrupt("return", 1);
                                          case 5:
                                            n.views.forEach(function (e, n) {
                                              return c.navigationItems.push(
                                                Z(t.url_path, e, n)
                                              );
                                            });
                                          case 6:
                                          case "end":
                                            return e.stop();
                                        }
                                    }, e);
                                  })),
                                  s.s();
                              case 12:
                                if ((u = s.n()).done) {
                                  e.next = 18;
                                  break;
                                }
                                return e.delegateYield(d(), "t0", 14);
                              case 14:
                                if (!e.t0) {
                                  e.next = 16;
                                  break;
                                }
                                return e.abrupt("continue", 16);
                              case 16:
                                e.next = 12;
                                break;
                              case 18:
                                e.next = 23;
                                break;
                              case 20:
                                (e.prev = 20), (e.t1 = e.catch(9)), s.e(e.t1);
                              case 23:
                                return (e.prev = 23), s.f(), e.finish(23);
                              case 26:
                                this.comboBox.filteredItems =
                                  this.navigationItems;
                              case 27:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this,
                        [[9, 20, 23, 26]]
                      );
                    })
                  )),
                  function () {
                    return n.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "shouldUpdate",
                value: function (e) {
                  return !this._opened || e.has("_opened");
                },
              },
              {
                kind: "method",
                key: "_valueChanged",
                value: function (e) {
                  e.stopPropagation(), this._setValue(e.detail.value);
                },
              },
              {
                kind: "method",
                key: "_setValue",
                value: function (e) {
                  (this.value = e),
                    (0, k.B)(
                      this,
                      "value-changed",
                      { value: this._value },
                      { bubbles: !1, composed: !1 }
                    );
                },
              },
              {
                kind: "method",
                key: "_filterChanged",
                value: function (e) {
                  var t = e.detail.value.toLowerCase();
                  if (t.length >= 2) {
                    var n = [];
                    this.navigationItems.forEach(function (e) {
                      (e.path.toLowerCase().includes(t) ||
                        e.title.toLowerCase().includes(t)) &&
                        n.push(e);
                    }),
                      n.length > 0
                        ? (this.comboBox.filteredItems = n)
                        : (this.comboBox.filteredItems = []);
                  } else this.comboBox.filteredItems = this.navigationItems;
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
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, p.iv)(
                    y ||
                      (y = (0, v.Z)([
                        "ha-icon,ha-svg-icon{color:var(--primary-text-color);position:relative;bottom:0px}[slot=prefix]{margin-right:8px}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        p.oi
      );
    },
    78689: function (e, t, n) {
      n.r(t),
        n.d(t, {
          HaNavigationSelector: function () {
            return p;
          },
        });
      var a,
        i = n(88962),
        o = n(33368),
        r = n(71650),
        l = n(68308),
        s = n(82390),
        u = n(69205),
        d = n(91808),
        c = (n(97393), n(5095)),
        h = n(95260),
        v = n(18394),
        p =
          (n(47322),
          (0, d.Z)(
            [(0, h.Mo)("ha-selector-navigation")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, r.Z)(this, n);
                  for (
                    var a = arguments.length, i = new Array(a), o = 0;
                    o < a;
                    o++
                  )
                    i[o] = arguments[o];
                  return (
                    (t = (0, l.Z)(this, n, [].concat(i))), e((0, s.Z)(t)), t
                  );
                }
                return (0, u.Z)(n, t), (0, o.Z)(n);
              })(t);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ type: Boolean, reflect: !0 })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return (0, c.dy)(
                        a ||
                          (a = (0, i.Z)([
                            ' <ha-navigation-picker .hass="',
                            '" .label="',
                            '" .value="',
                            '" .required="',
                            '" .disabled="',
                            '" .helper="',
                            '" @value-changed="',
                            '"></ha-navigation-picker> ',
                          ])),
                        this.hass,
                        this.label,
                        this.value,
                        this.required,
                        this.disabled,
                        this.helper,
                        this._valueChanged
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_valueChanged",
                    value: function (e) {
                      (0, v.B)(this, "value-changed", {
                        value: e.detail.value,
                      });
                    },
                  },
                ],
              };
            },
            c.oi
          ));
    },
  },
]);
//# sourceMappingURL=8689.LZtFXvwEzsE.js.map
