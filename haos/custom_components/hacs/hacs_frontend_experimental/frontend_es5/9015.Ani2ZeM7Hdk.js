"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [9015, 1908],
  {
    85763: function (t, e, r) {
      r.d(e, {
        Q2: function () {
          return n;
        },
        ou: function () {
          return s;
        },
      });
      var o = r(62746),
        a = r(40039),
        i =
          (r(51358),
          r(46798),
          r(5239),
          r(98490),
          r(7695),
          r(44758),
          r(80354),
          r(68630),
          r(63789),
          r(35221),
          r(9849),
          r(50289),
          r(94167),
          r(82073),
          r(94570),
          r(67684)),
        n = function () {
          var t,
            e = {},
            r = new URLSearchParams(i.E.location.search),
            n = (0, a.Z)(r.entries());
          try {
            for (n.s(); !(t = n.n()).done; ) {
              var s = (0, o.Z)(t.value, 2),
                c = s[0],
                l = s[1];
              e[c] = l;
            }
          } catch (d) {
            n.e(d);
          } finally {
            n.f();
          }
          return e;
        },
        s = function (t) {
          var e = new URLSearchParams();
          return (
            Object.entries(t).forEach(function (t) {
              var r = (0, o.Z)(t, 2),
                a = r[0],
                i = r[1];
              e.append(a, i);
            }),
            e.toString()
          );
        };
    },
    50057: function (t, e, r) {
      var o = r(33368),
        a = r(71650),
        i = r(68308),
        n = r(82390),
        s = r(69205),
        c = r(91808),
        l = (r(97393), r(34131), r(18846)),
        d = r(95260);
      (0, c.Z)(
        [(0, d.Mo)("ha-chip-set")],
        function (t, e) {
          var r = (function (e) {
            function r() {
              var e;
              (0, a.Z)(this, r);
              for (
                var o = arguments.length, s = new Array(o), c = 0;
                c < o;
                c++
              )
                s[c] = arguments[c];
              return (e = (0, i.Z)(this, r, [].concat(s))), t((0, n.Z)(e)), e;
            }
            return (0, s.Z)(r, e), (0, o.Z)(r);
          })(e);
          return { F: r, d: [] };
        },
        l.l
      );
    },
    68336: function (t, e, r) {
      var o,
        a,
        i,
        n = r(88962),
        s = r(33368),
        c = r(71650),
        l = r(68308),
        d = r(82390),
        h = r(69205),
        u = r(91808),
        p = (r(97393), r(5095)),
        f = r(95260);
      (0, u.Z)(
        [(0, f.Mo)("ha-card")],
        function (t, e) {
          var r = (function (e) {
            function r() {
              var e;
              (0, c.Z)(this, r);
              for (
                var o = arguments.length, a = new Array(o), i = 0;
                i < o;
                i++
              )
                a[i] = arguments[i];
              return (e = (0, l.Z)(this, r, [].concat(a))), t((0, d.Z)(e)), e;
            }
            return (0, h.Z)(r, e), (0, s.Z)(r);
          })(e);
          return {
            F: r,
            d: [
              {
                kind: "field",
                decorators: [(0, f.Cb)()],
                key: "header",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)({ type: Boolean, reflect: !0 })],
                key: "raised",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, p.iv)(
                    o ||
                      (o = (0, n.Z)([
                        ":host{background:var(--ha-card-background,var(--card-background-color,#fff));box-shadow:var(--ha-card-box-shadow,none);box-sizing:border-box;border-radius:var(--ha-card-border-radius,12px);border-width:var(--ha-card-border-width,1px);border-style:solid;border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0));color:var(--primary-text-color);display:block;transition:all .3s ease-out;position:relative}:host([raised]){border:none;box-shadow:var(--ha-card-box-shadow,0px 2px 1px -1px rgba(0,0,0,.2),0px 1px 1px 0px rgba(0,0,0,.14),0px 1px 3px 0px rgba(0,0,0,.12))}.card-header,:host ::slotted(.card-header){color:var(--ha-card-header-color,--primary-text-color);font-family:var(--ha-card-header-font-family, inherit);font-size:var(--ha-card-header-font-size, 24px);letter-spacing:-.012em;line-height:48px;padding:12px 16px 16px;display:block;margin-block-start:0px;margin-block-end:0px;font-weight:400}:host ::slotted(.card-content:not(:first-child)),slot:not(:first-child)::slotted(.card-content){padding-top:0px;margin-top:-8px}:host ::slotted(.card-content){padding:16px}:host ::slotted(.card-actions){border-top:1px solid var(--divider-color,#e8e8e8);padding:5px 16px}",
                      ]))
                  );
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, p.dy)(
                    a || (a = (0, n.Z)([" ", " <slot></slot> "])),
                    this.header
                      ? (0, p.dy)(
                          i ||
                            (i = (0, n.Z)([
                              '<h1 class="card-header">',
                              "</h1>",
                            ])),
                          this.header
                        )
                      : p.Ld
                  );
                },
              },
            ],
          };
        },
        p.oi
      );
    },
    7006: function (t, e, r) {
      var o,
        a = r(88962),
        i = r(46097),
        n = r(33368),
        s = r(71650),
        c = r(68308),
        l = r(82390),
        d = r(69205),
        h = r(91808),
        u = r(34541),
        p = r(47838),
        f = (r(97393), r(34131), r(22129)),
        v = r(5095),
        b = r(95260);
      (0, h.Z)(
        [(0, b.Mo)("ha-circular-progress")],
        function (t, e) {
          var r = (function (e) {
            function r() {
              var e;
              (0, s.Z)(this, r);
              for (
                var o = arguments.length, a = new Array(o), i = 0;
                i < o;
                i++
              )
                a[i] = arguments[i];
              return (e = (0, c.Z)(this, r, [].concat(a))), t((0, l.Z)(e)), e;
            }
            return (0, d.Z)(r, e), (0, n.Z)(r);
          })(e);
          return {
            F: r,
            d: [
              {
                kind: "field",
                decorators: [
                  (0, b.Cb)({ attribute: "aria-label", type: String }),
                ],
                key: "ariaLabel",
                value: function () {
                  return "Loading";
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)()],
                key: "size",
                value: function () {
                  return "medium";
                },
              },
              {
                kind: "method",
                key: "updated",
                value: function (t) {
                  if (
                    ((0, u.Z)((0, p.Z)(r.prototype), "updated", this).call(
                      this,
                      t
                    ),
                    t.has("size"))
                  )
                    switch (this.size) {
                      case "tiny":
                        this.style.setProperty(
                          "--md-circular-progress-size",
                          "16px"
                        );
                        break;
                      case "small":
                        this.style.setProperty(
                          "--md-circular-progress-size",
                          "28px"
                        );
                        break;
                      case "medium":
                        this.style.setProperty(
                          "--md-circular-progress-size",
                          "48px"
                        );
                        break;
                      case "large":
                        this.style.setProperty(
                          "--md-circular-progress-size",
                          "68px"
                        );
                    }
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [].concat(
                    (0, i.Z)((0, u.Z)((0, p.Z)(r), "styles", this)),
                    [
                      (0, v.iv)(
                        o ||
                          (o = (0, a.Z)([
                            ":host{--md-sys-color-primary:var(--primary-color);--md-circular-progress-size:48px}",
                          ]))
                      ),
                    ]
                  );
                },
              },
            ],
          };
        },
        f.B
      );
    },
    11908: function (t, e, r) {
      r.r(e);
      var o,
        a,
        i,
        n,
        s,
        c = r(88962),
        l = r(33368),
        d = r(71650),
        h = r(68308),
        u = r(82390),
        p = r(69205),
        f = r(91808),
        v = (r(97393), r(14271), r(5095)),
        b = r(95260);
      r(33358),
        r(73957),
        r(23860),
        (0, f.Z)(
          [(0, b.Mo)("hass-error-screen")],
          function (t, e) {
            var r = (function (e) {
              function r() {
                var e;
                (0, d.Z)(this, r);
                for (
                  var o = arguments.length, a = new Array(o), i = 0;
                  i < o;
                  i++
                )
                  a[i] = arguments[i];
                return (e = (0, h.Z)(this, r, [].concat(a))), t((0, u.Z)(e)), e;
              }
              return (0, p.Z)(r, e), (0, l.Z)(r);
            })(e);
            return {
              F: r,
              d: [
                {
                  kind: "field",
                  decorators: [(0, b.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, b.Cb)({ type: Boolean })],
                  key: "toolbar",
                  value: function () {
                    return !0;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, b.Cb)({ type: Boolean })],
                  key: "rootnav",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, b.Cb)({ type: Boolean })],
                  key: "narrow",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, b.Cb)()],
                  key: "error",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var t, e;
                    return (0, v.dy)(
                      o ||
                        (o = (0, c.Z)([
                          " ",
                          ' <div class="content"> <ha-alert alert-type="error">',
                          '</ha-alert> <slot> <mwc-button @click="',
                          '"> ',
                          " </mwc-button> </slot> </div> ",
                        ])),
                      this.toolbar
                        ? (0, v.dy)(
                            a ||
                              (a = (0, c.Z)([
                                '<div class="toolbar"> ',
                                " </div>",
                              ])),
                            this.rootnav ||
                              (null !== (t = history.state) &&
                                void 0 !== t &&
                                t.root)
                              ? (0, v.dy)(
                                  i ||
                                    (i = (0, c.Z)([
                                      ' <ha-menu-button .hass="',
                                      '" .narrow="',
                                      '"></ha-menu-button> ',
                                    ])),
                                  this.hass,
                                  this.narrow
                                )
                              : (0, v.dy)(
                                  n ||
                                    (n = (0, c.Z)([
                                      ' <ha-icon-button-arrow-prev .hass="',
                                      '" @click="',
                                      '"></ha-icon-button-arrow-prev> ',
                                    ])),
                                  this.hass,
                                  this._handleBack
                                )
                          )
                        : "",
                      this.error,
                      this._handleBack,
                      null === (e = this.hass) || void 0 === e
                        ? void 0
                        : e.localize("ui.common.back")
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_handleBack",
                  value: function () {
                    history.back();
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      (0, v.iv)(
                        s ||
                          (s = (0, c.Z)([
                            ":host{display:block;height:100%;background-color:var(--primary-background-color)}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;pointer-events:none;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}ha-icon-button-arrow-prev{pointer-events:auto}.content{color:var(--primary-text-color);height:calc(100% - var(--header-height));display:flex;padding:16px;align-items:center;justify-content:center;flex-direction:column;box-sizing:border-box}a{color:var(--primary-color)}ha-alert{margin-bottom:16px}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          v.oi
        );
    },
    84776: function (t, e, r) {
      r.r(e);
      var o,
        a,
        i,
        n,
        s,
        c,
        l = r(88962),
        d = r(33368),
        h = r(71650),
        u = r(68308),
        p = r(82390),
        f = r(69205),
        v = r(91808),
        b = (r(97393), r(5095)),
        y = r(95260),
        k = (r(7006), r(33358), r(73957), r(29950));
      (0, v.Z)(
        [(0, y.Mo)("hass-loading-screen")],
        function (t, e) {
          var r = (function (e) {
            function r() {
              var e;
              (0, h.Z)(this, r);
              for (
                var o = arguments.length, a = new Array(o), i = 0;
                i < o;
                i++
              )
                a[i] = arguments[i];
              return (e = (0, u.Z)(this, r, [].concat(a))), t((0, p.Z)(e)), e;
            }
            return (0, f.Z)(r, e), (0, d.Z)(r);
          })(e);
          return {
            F: r,
            d: [
              {
                kind: "field",
                decorators: [(0, y.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, y.Cb)({ type: Boolean, attribute: "no-toolbar" }),
                ],
                key: "noToolbar",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.Cb)({ type: Boolean })],
                key: "rootnav",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.Cb)({ type: Boolean })],
                key: "narrow",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.Cb)()],
                key: "message",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  var t;
                  return (0, b.dy)(
                    o ||
                      (o = (0, l.Z)([
                        " ",
                        ' <div class="content"> <ha-circular-progress indeterminate></ha-circular-progress> ',
                        " </div> ",
                      ])),
                    this.noToolbar
                      ? ""
                      : (0, b.dy)(
                          a ||
                            (a = (0, l.Z)([
                              '<div class="toolbar"> ',
                              " </div>",
                            ])),
                          this.rootnav ||
                            (null !== (t = history.state) &&
                              void 0 !== t &&
                              t.root)
                            ? (0, b.dy)(
                                i ||
                                  (i = (0, l.Z)([
                                    ' <ha-menu-button .hass="',
                                    '" .narrow="',
                                    '"></ha-menu-button> ',
                                  ])),
                                this.hass,
                                this.narrow
                              )
                            : (0, b.dy)(
                                n ||
                                  (n = (0, l.Z)([
                                    ' <ha-icon-button-arrow-prev .hass="',
                                    '" @click="',
                                    '"></ha-icon-button-arrow-prev> ',
                                  ])),
                                this.hass,
                                this._handleBack
                              )
                        ),
                    this.message
                      ? (0, b.dy)(
                          s ||
                            (s = (0, l.Z)([
                              '<div id="loading-text">',
                              "</div>",
                            ])),
                          this.message
                        )
                      : b.Ld
                  );
                },
              },
              {
                kind: "method",
                key: "_handleBack",
                value: function () {
                  history.back();
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    k.Qx,
                    (0, b.iv)(
                      c ||
                        (c = (0, l.Z)([
                          ":host{display:block;height:100%;background-color:var(--primary-background-color)}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;pointer-events:none;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}ha-icon-button-arrow-prev,ha-menu-button{pointer-events:auto}.content{height:calc(100% - var(--header-height));display:flex;flex-direction:column;align-items:center;justify-content:center}#loading-text{max-width:350px;margin-top:16px}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        b.oi
      );
    },
    49015: function (t, e, r) {
      r.r(e),
        r.d(e, {
          HacsRepositoryDashboard: function () {
            return G;
          },
        });
      var o,
        a,
        i,
        n,
        s,
        c,
        l,
        d,
        h,
        u,
        p,
        f,
        v,
        b,
        y,
        k = r(88962),
        g = r(99312),
        m = r(81043),
        x = r(33368),
        Z = r(71650),
        w = r(68308),
        _ = r(82390),
        C = r(69205),
        L = r(91808),
        z = r(34541),
        M = r(47838),
        B =
          (r(97393),
          r(88640),
          r(51358),
          r(46798),
          r(5239),
          r(98490),
          r(7695),
          r(44758),
          r(80354),
          r(68630),
          r(94570),
          r(82073),
          r(85472),
          r(9849),
          r(90126),
          r(56308),
          r(50289),
          r(94167),
          r(36513),
          r(63789),
          r(24074),
          r(40271),
          r(22859),
          r(46349),
          r(70320),
          r(5095)),
        P = r(95260),
        S = r(14516),
        A = r(67684),
        H = r(85763),
        V = (r(68336), r(50057), r(46097)),
        R = (r(34131), r(10996)),
        F =
          ((0, L.Z)(
            [(0, P.Mo)("ha-assist-chip")],
            function (t, e) {
              var r = (function (e) {
                function r() {
                  var e;
                  (0, Z.Z)(this, r);
                  for (
                    var o = arguments.length, a = new Array(o), i = 0;
                    i < o;
                    i++
                  )
                    a[i] = arguments[i];
                  return (
                    (e = (0, w.Z)(this, r, [].concat(a))), t((0, _.Z)(e)), e
                  );
                }
                return (0, C.Z)(r, e), (0, x.Z)(r);
              })(e);
              return {
                F: r,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)({ type: Boolean, reflect: !0 })],
                    key: "filled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return [].concat(
                        (0, V.Z)((0, z.Z)((0, M.Z)(r), "styles", this)),
                        [
                          (0, B.iv)(
                            o ||
                              (o = (0, k.Z)([
                                ":host{--md-sys-color-primary:var(--primary-text-color);--md-sys-color-on-surface:var(--primary-text-color);--md-assist-chip-container-shape:16px;--md-assist-chip-outline-color:var(--outline-color);--md-assist-chip-label-text-weight:400;--ha-assist-chip-filled-container-color:rgba(\n          var(--rgb-primary-text-color),\n          0.15\n        )}.filled{display:flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;background-color:var(--ha-assist-chip-filled-container-color)}::slotted([slot=icon]){display:flex;--mdc-icon-size:var(--md-input-chip-icon-size, 18px)}",
                              ]))
                          ),
                        ]
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "renderOutline",
                    value: function () {
                      return this.filled
                        ? (0, B.dy)(
                            a ||
                              (a = (0, k.Z)(['<span class="filled"></span>']))
                          )
                        : (0, z.Z)(
                            (0, M.Z)(r.prototype),
                            "renderOutline",
                            this
                          ).call(this);
                    },
                  },
                ],
              };
            },
            R.X
          ),
          r(99040),
          r(62082),
          r(21162),
          r(11285)),
        E = (r(11908), r(84776), r(47715)),
        T = r(51750),
        U = (r(33358), r(73957), r(29950)),
        j =
          ((0, L.Z)(
            [(0, P.Mo)("hass-subpage")],
            function (t, e) {
              var r = (function (e) {
                function r() {
                  var e;
                  (0, Z.Z)(this, r);
                  for (
                    var o = arguments.length, a = new Array(o), i = 0;
                    i < o;
                    i++
                  )
                    a[i] = arguments[i];
                  return (
                    (e = (0, w.Z)(this, r, [].concat(a))), t((0, _.Z)(e)), e
                  );
                }
                return (0, C.Z)(r, e), (0, x.Z)(r);
              })(e);
              return {
                F: r,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)()],
                    key: "header",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, P.Cb)({ type: Boolean, attribute: "main-page" }),
                    ],
                    key: "mainPage",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, P.Cb)({ type: String, attribute: "back-path" }),
                    ],
                    key: "backPath",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)()],
                    key: "backCallback",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)({ type: Boolean, reflect: !0 })],
                    key: "narrow",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, P.Cb)({ type: Boolean })],
                    key: "supervisor",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, E.i)(".content")],
                    key: "_savedScrollPos",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "willUpdate",
                    value: function (t) {
                      if (
                        ((0, z.Z)(
                          (0, M.Z)(r.prototype),
                          "willUpdate",
                          this
                        ).call(this, t),
                        t.has("hass"))
                      ) {
                        var e,
                          o,
                          a,
                          i = t.get("hass");
                        (i && i.locale === this.hass.locale) ||
                          ((e = this),
                          (o = "rtl"),
                          void 0 !== (a = (0, T.HE)(this.hass)) && (a = !!a),
                          e.hasAttribute(o)
                            ? a || e.removeAttribute(o)
                            : !1 !== a && e.setAttribute(o, ""));
                      }
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var t;
                      return (0, B.dy)(
                        i ||
                          (i = (0, k.Z)([
                            ' <div class="toolbar"> ',
                            ' <div class="main-title"><slot name="header">',
                            '</slot></div> <slot name="toolbar-icon"></slot> </div> <div class="content ha-scrollbar" @scroll="',
                            '"> <slot></slot> </div> <div id="fab"> <slot name="fab"></slot> </div> ',
                          ])),
                        this.mainPage ||
                          (null !== (t = history.state) &&
                            void 0 !== t &&
                            t.root)
                          ? (0, B.dy)(
                              n ||
                                (n = (0, k.Z)([
                                  ' <ha-menu-button .hassio="',
                                  '" .hass="',
                                  '" .narrow="',
                                  '"></ha-menu-button> ',
                                ])),
                              this.supervisor,
                              this.hass,
                              this.narrow
                            )
                          : this.backPath
                          ? (0, B.dy)(
                              s ||
                                (s = (0, k.Z)([
                                  ' <a href="',
                                  '"> <ha-icon-button-arrow-prev .hass="',
                                  '"></ha-icon-button-arrow-prev> </a> ',
                                ])),
                              this.backPath,
                              this.hass
                            )
                          : (0, B.dy)(
                              c ||
                                (c = (0, k.Z)([
                                  ' <ha-icon-button-arrow-prev .hass="',
                                  '" @click="',
                                  '"></ha-icon-button-arrow-prev> ',
                                ])),
                              this.hass,
                              this._backTapped
                            ),
                        this.header,
                        this._saveScrollPos
                      );
                    },
                  },
                  {
                    kind: "method",
                    decorators: [(0, P.hO)({ passive: !0 })],
                    key: "_saveScrollPos",
                    value: function (t) {
                      this._savedScrollPos = t.target.scrollTop;
                    },
                  },
                  {
                    kind: "method",
                    key: "_backTapped",
                    value: function () {
                      this.backCallback ? this.backCallback() : history.back();
                    },
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return [
                        U.$c,
                        (0, B.iv)(
                          l ||
                            (l = (0, k.Z)([
                              ":host{display:block;height:100%;background-color:var(--primary-background-color);overflow:hidden;position:relative}:host([narrow]){width:100%;position:fixed}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}.toolbar a{color:var(--sidebar-text-color);text-decoration:none}::slotted([slot=toolbar-icon]),ha-icon-button-arrow-prev,ha-menu-button{pointer-events:auto;color:var(--sidebar-icon-color)}.main-title{margin:0 0 0 24px;line-height:20px;flex-grow:1}.content{position:relative;width:100%;height:calc(100% - 1px - var(--header-height));overflow-y:auto;overflow:auto;-webkit-overflow-scrolling:touch}#fab{position:absolute;right:calc(16px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:1}:host([narrow]) #fab.tabs{bottom:calc(84px + env(safe-area-inset-bottom))}#fab[is-wide]{bottom:24px;right:24px}:host([rtl]) #fab{right:auto;left:calc(16px + env(safe-area-inset-left))}:host([rtl][is-wide]) #fab{bottom:24px;left:24px;right:auto}",
                            ]))
                        ),
                      ];
                    },
                  },
                ],
              };
            },
            B.oi
          ),
          r(33367)),
        O = r(90012),
        D = r(8179),
        K = r(46797),
        Q = r(61422),
        I = r(62746),
        W =
          (r(60163),
          function (t) {
            return (
              t.toLowerCase().includes(".md") ||
              t.toLowerCase().includes(".markdown")
            );
          }),
        G = (0, L.Z)(
          [(0, P.Mo)("hacs-repository-dashboard")],
          function (t, e) {
            var r,
              o,
              a = (function (e) {
                function r() {
                  var e;
                  (0, Z.Z)(this, r);
                  for (
                    var o = arguments.length, a = new Array(o), i = 0;
                    i < o;
                    i++
                  )
                    a[i] = arguments[i];
                  return (
                    (e = (0, w.Z)(this, r, [].concat(a))), t((0, _.Z)(e)), e
                  );
                }
                return (0, C.Z)(r, e), (0, x.Z)(r);
              })(e);
            return {
              F: a,
              d: [
                {
                  kind: "field",
                  decorators: [(0, P.Cb)({ attribute: !1 })],
                  key: "hacs",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.Cb)({ attribute: !1 })],
                  key: "narrow",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.Cb)({ attribute: !1 })],
                  key: "isWide",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.Cb)({ attribute: !1 })],
                  key: "route",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.SB)()],
                  key: "_repository",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, P.SB)()],
                  key: "_error",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "connectedCallback",
                  value: function () {
                    (0, z.Z)(
                      (0, M.Z)(a.prototype),
                      "connectedCallback",
                      this
                    ).call(this),
                      document.body.addEventListener(
                        "keydown",
                        this._generateMyLink
                      );
                  },
                },
                {
                  kind: "method",
                  key: "disconnectedCallback",
                  value: function () {
                    (0, z.Z)(
                      (0, M.Z)(a.prototype),
                      "disconnectedCallback",
                      this
                    ).call(this),
                      document.body.removeEventListener(
                        "keydown",
                        this._generateMyLink
                      );
                  },
                },
                {
                  kind: "field",
                  key: "_generateMyLink",
                  value: function () {
                    var t = this;
                    return function (e) {
                      if (
                        !(e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) &&
                        "m" === e.key &&
                        A.E.location.pathname.startsWith("/hacs/repository/")
                      ) {
                        if (!t._repository) return;
                        var r = new URLSearchParams({
                          redirect: "hacs_repository",
                          owner: t._repository.full_name.split("/")[0],
                          repository: t._repository.full_name.split("/")[1],
                          category: t._repository.category,
                        });
                        window.open(
                          "https://my.home-assistant.io/create-link/?".concat(
                            r.toString()
                          ),
                          "_blank"
                        );
                      }
                    };
                  },
                },
                {
                  kind: "method",
                  key: "firstUpdated",
                  value:
                    ((o = (0, m.Z)(
                      (0, g.Z)().mark(function t(e) {
                        var r, o, i, n, s;
                        return (0, g.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  if (
                                    ((0, z.Z)(
                                      (0, M.Z)(a.prototype),
                                      "firstUpdated",
                                      this
                                    ).call(this, e),
                                    (r = (0, H.Q2)()),
                                    !Object.entries(r).length)
                                  ) {
                                    t.next = 27;
                                    break;
                                  }
                                  if (
                                    ((i = ""
                                      .concat(r.owner, "/")
                                      .concat(r.repository)),
                                    (o = this.hacs.repositories.find(
                                      function (t) {
                                        return (
                                          t.full_name.toLocaleLowerCase() ===
                                          i.toLocaleLowerCase()
                                        );
                                      }
                                    )),
                                    o || !r.category)
                                  ) {
                                    t.next = 24;
                                    break;
                                  }
                                  return (
                                    (t.next = 8),
                                    (0, F.g7)(this, {
                                      title: this.hacs.localize(
                                        "my.add_repository_title"
                                      ),
                                      text: this.hacs.localize(
                                        "my.add_repository_description",
                                        { repository: i }
                                      ),
                                      confirmText:
                                        this.hacs.localize("common.add"),
                                      dismissText:
                                        this.hacs.localize("common.cancel"),
                                    })
                                  );
                                case 8:
                                  if (t.sent) {
                                    t.next = 11;
                                    break;
                                  }
                                  return (
                                    (this._error = this.hacs.localize(
                                      "my.repository_not_found",
                                      { repository: i }
                                    )),
                                    t.abrupt("return")
                                  );
                                case 11:
                                  return (
                                    (t.prev = 11),
                                    (t.next = 14),
                                    (0, K.NA)(this.hass, i, r.category)
                                  );
                                case 14:
                                  return (t.next = 16), (0, K.ER)(this.hass);
                                case 16:
                                  (this.hacs.repositories = t.sent),
                                    (o = this.hacs.repositories.find(
                                      function (t) {
                                        return (
                                          t.full_name.toLocaleLowerCase() ===
                                          i.toLocaleLowerCase()
                                        );
                                      }
                                    )),
                                    (t.next = 24);
                                  break;
                                case 20:
                                  return (
                                    (t.prev = 20),
                                    (t.t0 = t.catch(11)),
                                    (this._error = t.t0),
                                    t.abrupt("return")
                                  );
                                case 24:
                                  o
                                    ? this._fetchRepository(String(o.id))
                                    : (this._error = this.hacs.localize(
                                        "my.repository_not_found",
                                        { repository: i }
                                      )),
                                    (t.next = 33);
                                  break;
                                case 27:
                                  if (
                                    ((n = this.route.path.indexOf("/", 1)),
                                    (s = this.route.path.substr(n + 1)))
                                  ) {
                                    t.next = 32;
                                    break;
                                  }
                                  return (
                                    (this._error =
                                      "Missing repositoryId from route"),
                                    t.abrupt("return")
                                  );
                                case 32:
                                  this._fetchRepository(s);
                                case 33:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this,
                          [[11, 20]]
                        );
                      })
                    )),
                    function (t) {
                      return o.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (t) {
                    (0, z.Z)((0, M.Z)(a.prototype), "updated", this).call(
                      this,
                      t
                    ),
                      t.has("repositories") &&
                        this._repository &&
                        this._fetchRepository();
                  },
                },
                {
                  kind: "method",
                  key: "_fetchRepository",
                  value:
                    ((r = (0, m.Z)(
                      (0, g.Z)().mark(function t(e) {
                        return (0, g.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (t.prev = 0),
                                    (t.next = 3),
                                    (0, D.nj)(
                                      this.hass,
                                      e || String(this._repository.id)
                                    )
                                  );
                                case 3:
                                  (this._repository = t.sent), (t.next = 9);
                                  break;
                                case 6:
                                  (t.prev = 6),
                                    (t.t0 = t.catch(0)),
                                    (this._error =
                                      null === t.t0 || void 0 === t.t0
                                        ? void 0
                                        : t.t0.message);
                                case 9:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this,
                          [[0, 6]]
                        );
                      })
                    )),
                    function (t) {
                      return r.apply(this, arguments);
                    }),
                },
                {
                  kind: "field",
                  key: "_getAuthors",
                  value: function () {
                    return (0, S.Z)(function (t) {
                      var e = [];
                      if (!t.authors) return e;
                      if (
                        (t.authors.forEach(function (t) {
                          return e.push(t.replace("@", ""));
                        }),
                        0 === e.length)
                      ) {
                        var r = t.full_name.split("/")[0];
                        if (
                          [
                            "custom-cards",
                            "custom-components",
                            "home-assistant-community-themes",
                          ].includes(r)
                        )
                          return e;
                        e.push(r);
                      }
                      return e;
                    });
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var t = this;
                    if (this._error)
                      return (0, B.dy)(
                        d ||
                          (d = (0, k.Z)([
                            '<hass-error-screen .error="',
                            '"></hass-error-screen>',
                          ])),
                        this._error
                      );
                    if (!this._repository)
                      return (0, B.dy)(
                        h ||
                          (h = (0, k.Z)([
                            "<hass-loading-screen></hass-loading-screen>",
                          ]))
                      );
                    var e = this._getAuthors(this._repository);
                    return (0, B.dy)(
                      u ||
                        (u = (0, k.Z)([
                          ' <hass-subpage .hass="',
                          '" .narrow="',
                          '" .route="',
                          '" .header="',
                          '" hasFab> <ha-icon-overflow-menu .hass="',
                          '" slot="toolbar-icon" narrow .items="',
                          '"> </ha-icon-overflow-menu> <div class="content"> <ha-card> <ha-chip-set> ',
                          " ",
                          " ",
                          ' <ha-assist-chip .label="',
                          '" title="',
                          '"> <ha-svg-icon slot="icon" .path="',
                          '"></ha-svg-icon> ',
                          ' </ha-assist-chip> <a href="https://github.com/',
                          '/issues" target="_blank" rel="noreferrer noopener"> <ha-assist-chip .label="',
                          '" title="',
                          '"> <ha-svg-icon slot="icon" .path="',
                          '"></ha-svg-icon> ',
                          ' </ha-assist-chip> </a> </ha-chip-set> <ha-markdown .content="',
                          '"></ha-markdown> </ha-card> </div> ',
                          " </hass-subpage> ",
                        ])),
                      this.hass,
                      this.narrow,
                      this.route,
                      this._repository.name,
                      this.hass,
                      (0, O.G)(this, this._repository),
                      this._repository.installed
                        ? (0, B.dy)(
                            p ||
                              (p = (0, k.Z)([
                                ' <ha-assist-chip .label="',
                                '" title="',
                                '"> <ha-svg-icon slot="icon" .path="',
                                '"></ha-svg-icon> </ha-assist-chip> ',
                              ])),
                            this._repository.installed_version,
                            this.hacs.localize("dialog_info.version_installed"),
                            "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"
                          )
                        : "",
                      e
                        ? e.map(function (e) {
                            return (0, B.dy)(
                              f ||
                                (f = (0, k.Z)([
                                  '<a href="https://github.com/',
                                  '" target="_blank" rel="noreferrer noopener"> <ha-assist-chip .label="',
                                  '" title="',
                                  '"> <ha-svg-icon slot="icon" .path="',
                                  '"></ha-svg-icon> @',
                                  " </ha-assist-chip> </a>",
                                ])),
                              e,
                              e,
                              t.hacs.localize("dialog_info.author"),
                              "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
                              e
                            );
                          })
                        : "",
                      this._repository.downloads
                        ? (0, B.dy)(
                            v ||
                              (v = (0, k.Z)([
                                ' <ha-assist-chip title="',
                                '" .label="',
                                '"> <ha-svg-icon slot="icon" .path="',
                                '"></ha-svg-icon> </ha-assist-chip>',
                              ])),
                            this.hacs.localize("dialog_info.downloads"),
                            String(this._repository.downloads),
                            "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z"
                          )
                        : "",
                      String(this._repository.stars),
                      this.hacs.localize("dialog_info.stars"),
                      "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",
                      this._repository.stars,
                      this._repository.full_name,
                      String(this._repository.issues),
                      this.hacs.localize("dialog_info.open_issues"),
                      "M10 3H14V14H10V3M10 21V17H14V21H10Z",
                      this._repository.issues,
                      (function (t, e) {
                        return (
                          (t = t.replace(
                            /(https:\/\/github\.com\/.*.\/blob*.[^\s]+)/g,
                            function (t) {
                              return W(t)
                                ? t
                                : t
                                    .replace(
                                      "https://github.com/",
                                      "https://raw.githubusercontent.com/"
                                    )
                                    .replace("/blob/", "/");
                            }
                          )),
                          e &&
                            (t = (t = (t = t.replace(
                              /(!)?\[*.*\]\((?!.*:\/\/).*\/*.*\.\w*\)/g,
                              function (t) {
                                return t.replace("(/", "(").replace(
                                  "(",
                                  "("
                                    .concat(
                                      W(t)
                                        ? "https://github.com"
                                        : "https://raw.githubusercontent.com",
                                      "/"
                                    )
                                    .concat(e.full_name)
                                    .concat(W(t) ? "/blob" : "", "/")
                                    .concat(
                                      e.available_version || e.default_branch,
                                      "/"
                                    )
                                );
                              }
                            )).replace(/\[*.*\]\(\#.*\)/g, function (t) {
                              return t.replace(
                                "(#",
                                "(/hacs/repository/".concat(e.id, "#")
                              );
                            })).replace(
                              /(?:\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/g,
                              function (t) {
                                var r = t
                                    .replace(/^#/, "".concat(e.full_name, "#"))
                                    .split("#"),
                                  o = (0, I.Z)(r, 2),
                                  a = o[0],
                                  i = o[1];
                                return "["
                                  .concat(t, "](https://github.com/")
                                  .concat(a, "/issues/")
                                  .concat(i, ")");
                              }
                            )),
                          t.replace(
                            /[^(]https:\/\/github\.com\/\S*\/commit\/([0-9a-f]{40})/g,
                            function (t, e) {
                              return "[`"
                                .concat(e.substr(0, 7), "`](")
                                .concat(t, ")");
                            }
                          )
                        );
                      })(this._repository.additional_info, this._repository) ||
                        this.hacs.localize("dialog_info.no_info"),
                      this._repository.installed_version
                        ? ""
                        : (0, B.dy)(
                            b ||
                              (b = (0, k.Z)([
                                '<ha-fab .label="',
                                '" .extended="',
                                '" @click="',
                                '"> <ha-svg-icon slot="icon" .path="',
                                '"></ha-svg-icon> </ha-fab>',
                              ])),
                            this.hacs.localize("common.download"),
                            !this.narrow,
                            this._downloadRepositoryDialog,
                            "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
                          )
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_downloadRepositoryDialog",
                  value: function () {
                    (0, j.px)(this, {
                      hacs: this.hacs,
                      repositoryId: this._repository.id,
                      repository: this._repository,
                    });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      Q.w,
                      (0, B.iv)(
                        y ||
                          (y = (0, k.Z)([
                            "hass-loading-screen{--app-header-background-color:var(--sidebar-background-color);--app-header-text-color:var(--sidebar-text-color);height:100vh}hass-subpage{position:absolute;width:100vw}ha-svg-icon{color:var(--hcv-text-color-on-background)}ha-fab{position:fixed;float:right;right:calc(18px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:1}ha-fab.rtl{float:left;right:auto;left:calc(18px + env(safe-area-inset-left))}ha-card{display:block;padding:16px}.content{margin:auto;padding:8px;max-width:1536px}ha-chip-set{padding-bottom:8px}@media all and (max-width:500px){.content{margin:8px 4px 64px;max-width:none}}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          B.oi
        );
    },
    8179: function (t, e, r) {
      r.d(e, {
        hZ: function () {
          return n;
        },
        nj: function () {
          return i;
        },
        zD: function () {
          return s;
        },
      });
      var o = r(99312),
        a = r(81043),
        i = (function () {
          var t = (0, a.Z)(
            (0, o.Z)().mark(function t(e, r) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/info",
                          repository_id: r,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, r) {
            return t.apply(this, arguments);
          };
        })(),
        n = (function () {
          var t = (0, a.Z)(
            (0, o.Z)().mark(function t(e, r, a) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/download",
                          repository: r,
                          version: a,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, r, o) {
            return t.apply(this, arguments);
          };
        })(),
        s = (function () {
          var t = (0, a.Z)(
            (0, o.Z)().mark(function t(e, r, a) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/version",
                          repository: r,
                          version: a,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, r, o) {
            return t.apply(this, arguments);
          };
        })();
    },
  },
]);
//# sourceMappingURL=9015.Ani2ZeM7Hdk.js.map
