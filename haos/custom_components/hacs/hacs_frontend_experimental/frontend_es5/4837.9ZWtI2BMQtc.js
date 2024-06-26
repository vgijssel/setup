"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [4837, 1908],
  {
    85763: function (r, e, t) {
      t.d(e, {
        Q2: function () {
          return i;
        },
        ou: function () {
          return c;
        },
      });
      var o = t(62746),
        a = t(40039),
        n =
          (t(51358),
          t(46798),
          t(5239),
          t(98490),
          t(7695),
          t(44758),
          t(80354),
          t(68630),
          t(63789),
          t(35221),
          t(9849),
          t(50289),
          t(94167),
          t(82073),
          t(94570),
          t(67684)),
        i = function () {
          var r,
            e = {},
            t = new URLSearchParams(n.E.location.search),
            i = (0, a.Z)(t.entries());
          try {
            for (i.s(); !(r = i.n()).done; ) {
              var c = (0, o.Z)(r.value, 2),
                s = c[0],
                d = c[1];
              e[s] = d;
            }
          } catch (h) {
            i.e(h);
          } finally {
            i.f();
          }
          return e;
        },
        c = function (r) {
          var e = new URLSearchParams();
          return (
            Object.entries(r).forEach(function (r) {
              var t = (0, o.Z)(r, 2),
                a = t[0],
                n = t[1];
              e.append(a, n);
            }),
            e.toString()
          );
        };
    },
    11908: function (r, e, t) {
      t.r(e);
      var o,
        a,
        n,
        i,
        c,
        s = t(88962),
        d = t(33368),
        h = t(71650),
        u = t(68308),
        l = t(82390),
        v = t(69205),
        f = t(91808),
        k = (t(97393), t(14271), t(5095)),
        p = t(95260);
      t(33358),
        t(73957),
        t(23860),
        (0, f.Z)(
          [(0, p.Mo)("hass-error-screen")],
          function (r, e) {
            var t = (function (e) {
              function t() {
                var e;
                (0, h.Z)(this, t);
                for (
                  var o = arguments.length, a = new Array(o), n = 0;
                  n < o;
                  n++
                )
                  a[n] = arguments[n];
                return (e = (0, u.Z)(this, t, [].concat(a))), r((0, l.Z)(e)), e;
              }
              return (0, v.Z)(t, e), (0, d.Z)(t);
            })(e);
            return {
              F: t,
              d: [
                {
                  kind: "field",
                  decorators: [(0, p.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, p.Cb)({ type: Boolean })],
                  key: "toolbar",
                  value: function () {
                    return !0;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, p.Cb)({ type: Boolean })],
                  key: "rootnav",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, p.Cb)({ type: Boolean })],
                  key: "narrow",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, p.Cb)()],
                  key: "error",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var r, e;
                    return (0, k.dy)(
                      o ||
                        (o = (0, s.Z)([
                          " ",
                          ' <div class="content"> <ha-alert alert-type="error">',
                          '</ha-alert> <slot> <mwc-button @click="',
                          '"> ',
                          " </mwc-button> </slot> </div> ",
                        ])),
                      this.toolbar
                        ? (0, k.dy)(
                            a ||
                              (a = (0, s.Z)([
                                '<div class="toolbar"> ',
                                " </div>",
                              ])),
                            this.rootnav ||
                              (null !== (r = history.state) &&
                                void 0 !== r &&
                                r.root)
                              ? (0, k.dy)(
                                  n ||
                                    (n = (0, s.Z)([
                                      ' <ha-menu-button .hass="',
                                      '" .narrow="',
                                      '"></ha-menu-button> ',
                                    ])),
                                  this.hass,
                                  this.narrow
                                )
                              : (0, k.dy)(
                                  i ||
                                    (i = (0, s.Z)([
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
                      (0, k.iv)(
                        c ||
                          (c = (0, s.Z)([
                            ":host{display:block;height:100%;background-color:var(--primary-background-color)}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;pointer-events:none;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}ha-icon-button-arrow-prev{pointer-events:auto}.content{color:var(--primary-text-color);height:calc(100% - var(--header-height));display:flex;padding:16px;align-items:center;justify-content:center;flex-direction:column;box-sizing:border-box}a{color:var(--primary-color)}ha-alert{margin-bottom:16px}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          k.oi
        );
    },
    44837: function (r, e, t) {
      t.r(e),
        t.d(e, {
          REDIRECTS: function () {
            return y;
          },
        });
      var o,
        a,
        n = t(62746),
        i = t(88962),
        c = t(33368),
        s = t(71650),
        d = t(68308),
        h = t(82390),
        u = t(69205),
        l = t(91808),
        v =
          (t(97393), t(56308), t(65974), t(82073), t(2094), t(51467), t(5095)),
        f = t(95260),
        k = t(38480),
        p = t(85763),
        y =
          (t(11908),
          {
            hacs_repository: {
              redirect: "/hacs/repository",
              params: {
                owner: "string",
                repository: "string",
                category: "string?",
              },
            },
          });
      (0, l.Z)(
        [(0, f.Mo)("hacs-my-redirect")],
        function (r, e) {
          var t = (function (e) {
            function t() {
              var e;
              (0, s.Z)(this, t);
              for (
                var o = arguments.length, a = new Array(o), n = 0;
                n < o;
                n++
              )
                a[n] = arguments[n];
              return (e = (0, d.Z)(this, t, [].concat(a))), r((0, h.Z)(e)), e;
            }
            return (0, u.Z)(t, e), (0, c.Z)(t);
          })(e);
          return {
            F: t,
            d: [
              {
                kind: "field",
                decorators: [(0, f.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)({ attribute: !1 })],
                key: "hacs",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.Cb)({ attribute: !1 })],
                key: "route",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, f.SB)()],
                key: "_error",
                value: void 0,
              },
              {
                kind: "method",
                key: "firstUpdated",
                value: function (r) {
                  var e = this.route.path.indexOf("/", 1),
                    t = this.route.path.substr(e + 1),
                    a = y[t];
                  if (a) {
                    var n;
                    try {
                      n = this._createRedirectUrl(a);
                    } catch (c) {
                      return void (this._error =
                        this.hacs.localize("my.error"));
                    }
                    (0, k.c)(n, { replace: !0 });
                  } else
                    this._error = this.hacs.localize("my.not_supported", {
                      link: (0, v.dy)(
                        o ||
                          (o = (0, i.Z)([
                            '<a target="_blank" rel="noreferrer noopener" href="https://my.home-assistant.io/faq.html#supported-pages"> ',
                            " </a>",
                          ])),
                        this.hacs.localize("my.faq_link")
                      ),
                    });
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return this._error
                    ? (0, v.dy)(
                        a ||
                          (a = (0, i.Z)([
                            '<hass-error-screen .error="',
                            '"></hass-error-screen>',
                          ])),
                        this._error
                      )
                    : v.Ld;
                },
              },
              {
                kind: "method",
                key: "_createRedirectUrl",
                value: function (r) {
                  var e = this._createRedirectParams(r);
                  return "".concat(r.redirect).concat(e);
                },
              },
              {
                kind: "method",
                key: "_createRedirectParams",
                value: function (r) {
                  var e = (0, p.Q2)();
                  if (!r.params && !Object.keys(e).length) return "";
                  for (
                    var t = {}, o = 0, a = Object.entries(r.params || {});
                    o < a.length;
                    o++
                  ) {
                    var i = (0, n.Z)(a[o], 2),
                      c = i[0],
                      s = i[1];
                    if (e[c] || !s.endsWith("?")) {
                      if (!e[c] || !this._checkParamType(s, e[c]))
                        throw Error();
                      t[c] = e[c];
                    }
                  }
                  return "?".concat((0, p.ou)(t));
                },
              },
              {
                kind: "method",
                key: "_checkParamType",
                value: function (r, e) {
                  return "string" === r || "string?" === r;
                },
              },
            ],
          };
        },
        v.oi
      );
    },
  },
]);
//# sourceMappingURL=4837.9ZWtI2BMQtc.js.map
