"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1908],
  {
    11908: function (o, r, e) {
      e.r(r);
      var t,
        a,
        n,
        i,
        c,
        d = e(88962),
        l = e(33368),
        s = e(71650),
        h = e(68308),
        u = e(82390),
        b = e(69205),
        v = e(91808),
        p = (e(97393), e(14271), e(5095)),
        k = e(95260);
      e(33358),
        e(73957),
        e(23860),
        (0, v.Z)(
          [(0, k.Mo)("hass-error-screen")],
          function (o, r) {
            var e = (function (r) {
              function e() {
                var r;
                (0, s.Z)(this, e);
                for (
                  var t = arguments.length, a = new Array(t), n = 0;
                  n < t;
                  n++
                )
                  a[n] = arguments[n];
                return (r = (0, h.Z)(this, e, [].concat(a))), o((0, u.Z)(r)), r;
              }
              return (0, b.Z)(e, r), (0, l.Z)(e);
            })(r);
            return {
              F: e,
              d: [
                {
                  kind: "field",
                  decorators: [(0, k.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, k.Cb)({ type: Boolean })],
                  key: "toolbar",
                  value: function () {
                    return !0;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, k.Cb)({ type: Boolean })],
                  key: "rootnav",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, k.Cb)({ type: Boolean })],
                  key: "narrow",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, k.Cb)()],
                  key: "error",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var o, r;
                    return (0, p.dy)(
                      t ||
                        (t = (0, d.Z)([
                          " ",
                          ' <div class="content"> <ha-alert alert-type="error">',
                          '</ha-alert> <slot> <mwc-button @click="',
                          '"> ',
                          " </mwc-button> </slot> </div> ",
                        ])),
                      this.toolbar
                        ? (0, p.dy)(
                            a ||
                              (a = (0, d.Z)([
                                '<div class="toolbar"> ',
                                " </div>",
                              ])),
                            this.rootnav ||
                              (null !== (o = history.state) &&
                                void 0 !== o &&
                                o.root)
                              ? (0, p.dy)(
                                  n ||
                                    (n = (0, d.Z)([
                                      ' <ha-menu-button .hass="',
                                      '" .narrow="',
                                      '"></ha-menu-button> ',
                                    ])),
                                  this.hass,
                                  this.narrow
                                )
                              : (0, p.dy)(
                                  i ||
                                    (i = (0, d.Z)([
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
                      null === (r = this.hass) || void 0 === r
                        ? void 0
                        : r.localize("ui.common.back")
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
                      (0, p.iv)(
                        c ||
                          (c = (0, d.Z)([
                            ":host{display:block;height:100%;background-color:var(--primary-background-color)}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;pointer-events:none;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}ha-icon-button-arrow-prev{pointer-events:auto}.content{color:var(--primary-text-color);height:calc(100% - var(--header-height));display:flex;padding:16px;align-items:center;justify-content:center;flex-direction:column;box-sizing:border-box}a{color:var(--primary-color)}ha-alert{margin-bottom:16px}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          p.oi
        );
    },
  },
]);
//# sourceMappingURL=1908.y8mh-Mlw64U.js.map
