(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [2519],
  {
    61320: function (e, t, n) {
      var r = {
        "./ha-alert": [23860],
        "./ha-alert.ts": [23860],
        "./ha-icon": [87386, 7386],
        "./ha-icon-button": [54371],
        "./ha-icon-button-arrow-next": [77716, 6924],
        "./ha-icon-button-arrow-next.ts": [77716, 6924],
        "./ha-icon-button-arrow-prev": [33358],
        "./ha-icon-button-arrow-prev.ts": [33358],
        "./ha-icon-button-group": [7625, 7625],
        "./ha-icon-button-group.ts": [7625, 7625],
        "./ha-icon-button-next": [6765, 6765],
        "./ha-icon-button-next.ts": [6765, 6765],
        "./ha-icon-button-prev": [49233, 9233],
        "./ha-icon-button-prev.ts": [49233, 9233],
        "./ha-icon-button-toggle": [61318, 1318],
        "./ha-icon-button-toggle.ts": [61318, 1318],
        "./ha-icon-button.ts": [54371],
        "./ha-icon-next": [68245, 8245],
        "./ha-icon-next.ts": [68245, 8245],
        "./ha-icon-overflow-menu": [62082],
        "./ha-icon-overflow-menu.ts": [62082],
        "./ha-icon-picker": [2638, 2638],
        "./ha-icon-picker.ts": [2638, 2638],
        "./ha-icon-prev": [28827, 8827],
        "./ha-icon-prev.ts": [28827, 8827],
        "./ha-icon.ts": [87386, 7386],
        "./ha-qr-code": [31195, 2771, 1970, 1195],
        "./ha-qr-code.ts": [31195, 2771, 1970, 1195],
        "./ha-svg-icon": [37662],
        "./ha-svg-icon.ts": [37662],
      };
      function i(e) {
        if (!n.o(r, e))
          return Promise.resolve().then(function () {
            var t = new Error("Cannot find module '" + e + "'");
            throw ((t.code = "MODULE_NOT_FOUND"), t);
          });
        var t = r[e],
          i = t[0];
        return Promise.all(t.slice(1).map(n.e)).then(function () {
          return n(i);
        });
      }
      (i.keys = function () {
        return Object.keys(r);
      }),
        (i.id = 61320),
        (e.exports = i);
    },
    47715: function (e, t, n) {
      "use strict";
      n.d(t, {
        i: function () {
          return i;
        },
      });
      var r = (0, n(89878).P)(function (e) {
          history.replaceState({ scrollPosition: e }, "");
        }, 300),
        i = function (e) {
          return function (t) {
            return {
              kind: "method",
              placement: "prototype",
              key: t.key,
              descriptor: {
                set: function (e) {
                  r(e), (this["__".concat(String(t.key))] = e);
                },
                get: function () {
                  var e;
                  return (
                    this["__".concat(String(t.key))] ||
                    (null === (e = history.state) || void 0 === e
                      ? void 0
                      : e.scrollPosition)
                  );
                },
                enumerable: !0,
                configurable: !0,
              },
              finisher: function (n) {
                var r = n.prototype.connectedCallback;
                n.prototype.connectedCallback = function () {
                  var n = this;
                  r.call(this);
                  var i = this[t.key];
                  i &&
                    this.updateComplete.then(function () {
                      var t = n.renderRoot.querySelector(e);
                      t &&
                        setTimeout(function () {
                          t.scrollTop = i;
                        }, 0);
                    });
                };
              },
            };
          };
        };
    },
    51750: function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.language || "en";
        return (
          (e.translationMetadata.translations[t] &&
            e.translationMetadata.translations[t].isRTL) ||
          !1
        );
      }
      function i(e) {
        return o(r(e));
      }
      function o(e) {
        return e ? "rtl" : "ltr";
      }
      n.d(t, {
        HE: function () {
          return r;
        },
        Zu: function () {
          return i;
        },
      });
    },
    89878: function (e, t, n) {
      "use strict";
      n.d(t, {
        P: function () {
          return r;
        },
      });
      var r = function (e, t) {
        var n,
          r =
            !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
          i =
            !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
          o = 0,
          a = function () {
            for (var a = arguments.length, c = new Array(a), l = 0; l < a; l++)
              c[l] = arguments[l];
            var s = Date.now();
            o || !1 !== r || (o = s);
            var u = t - (s - o);
            u <= 0 || u > t
              ? (n && (clearTimeout(n), (n = void 0)),
                (o = s),
                e.apply(void 0, c))
              : n ||
                !1 === i ||
                (n = window.setTimeout(function () {
                  (o = !1 === r ? 0 : Date.now()),
                    (n = void 0),
                    e.apply(void 0, c);
                }, u));
          };
        return (
          (a.cancel = function () {
            clearTimeout(n), (n = void 0), (o = 0);
          }),
          a
        );
      };
    },
    85878: function (e, t, n) {
      "use strict";
      var r,
        i,
        o = n(88962),
        a = n(33368),
        c = n(71650),
        l = n(68308),
        s = n(82390),
        u = n(69205),
        d = n(91808),
        f = n(34541),
        h = n(47838),
        m =
          (n(97393),
          n(76843),
          n(73855),
          n(46798),
          n(9849),
          n(50289),
          n(94167),
          n(80641),
          n(65666),
          n(5095)),
        p = n(95260),
        v = n(67684),
        g = n(60625);
      (0, d.Z)(
        [(0, p.Mo)("ha-button-menu")],
        function (e, t) {
          var n = (function (t) {
            function n() {
              var t;
              (0, c.Z)(this, n);
              for (
                var r = arguments.length, i = new Array(r), o = 0;
                o < r;
                o++
              )
                i[o] = arguments[o];
              return (t = (0, l.Z)(this, n, [].concat(i))), e((0, s.Z)(t)), t;
            }
            return (0, u.Z)(n, t), (0, a.Z)(n);
          })(t);
          return {
            F: n,
            d: [
              { kind: "field", key: g.gA, value: void 0 },
              {
                kind: "field",
                decorators: [(0, p.Cb)()],
                key: "corner",
                value: function () {
                  return "BOTTOM_START";
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)()],
                key: "menuCorner",
                value: function () {
                  return "START";
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Number })],
                key: "x",
                value: function () {
                  return null;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Number })],
                key: "y",
                value: function () {
                  return null;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Boolean })],
                key: "multi",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Boolean })],
                key: "activatable",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Boolean })],
                key: "disabled",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Boolean })],
                key: "fixed",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, p.Cb)({ type: Boolean, attribute: "no-anchor" }),
                ],
                key: "noAnchor",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, p.IO)("mwc-menu", !0)],
                key: "_menu",
                value: void 0,
              },
              {
                kind: "get",
                key: "items",
                value: function () {
                  var e;
                  return null === (e = this._menu) || void 0 === e
                    ? void 0
                    : e.items;
                },
              },
              {
                kind: "get",
                key: "selected",
                value: function () {
                  var e;
                  return null === (e = this._menu) || void 0 === e
                    ? void 0
                    : e.selected;
                },
              },
              {
                kind: "method",
                key: "focus",
                value: function () {
                  var e, t;
                  null !== (e = this._menu) && void 0 !== e && e.open
                    ? this._menu.focusItemAtIndex(0)
                    : null === (t = this._triggerButton) ||
                      void 0 === t ||
                      t.focus();
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, m.dy)(
                    r ||
                      (r = (0, o.Z)([
                        ' <div @click="',
                        '"> <slot name="trigger" @slotchange="',
                        '"></slot> </div> <mwc-menu .corner="',
                        '" .menuCorner="',
                        '" .fixed="',
                        '" .multi="',
                        '" .activatable="',
                        '" .y="',
                        '" .x="',
                        '"> <slot></slot> </mwc-menu> ',
                      ])),
                    this._handleClick,
                    this._setTriggerAria,
                    this.corner,
                    this.menuCorner,
                    this.fixed,
                    this.multi,
                    this.activatable,
                    this.y,
                    this.x
                  );
                },
              },
              {
                kind: "method",
                key: "firstUpdated",
                value: function (e) {
                  var t = this;
                  (0, f.Z)((0, h.Z)(n.prototype), "firstUpdated", this).call(
                    this,
                    e
                  ),
                    "rtl" === v.E.document.dir &&
                      this.updateComplete.then(function () {
                        t.querySelectorAll("mwc-list-item").forEach(
                          function (e) {
                            var t = document.createElement("style");
                            (t.innerHTML =
                              "span.material-icons:first-of-type { margin-left: var(--mdc-list-item-graphic-margin, 32px) !important; margin-right: 0px !important;}"),
                              e.shadowRoot.appendChild(t);
                          }
                        );
                      });
                },
              },
              {
                kind: "method",
                key: "_handleClick",
                value: function () {
                  this.disabled ||
                    ((this._menu.anchor = this.noAnchor ? null : this),
                    this._menu.show());
                },
              },
              {
                kind: "get",
                key: "_triggerButton",
                value: function () {
                  return this.querySelector(
                    'ha-icon-button[slot="trigger"], mwc-button[slot="trigger"]'
                  );
                },
              },
              {
                kind: "method",
                key: "_setTriggerAria",
                value: function () {
                  this._triggerButton &&
                    (this._triggerButton.ariaHasPopup = "menu");
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, m.iv)(
                    i ||
                      (i = (0, o.Z)([
                        ":host{display:inline-block;position:relative}::slotted([disabled]){color:var(--disabled-text-color)}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        m.oi
      );
    },
    99040: function (e, t, n) {
      "use strict";
      var r,
        i,
        o,
        a = n(88962),
        c = n(33368),
        l = n(71650),
        s = n(68308),
        u = n(82390),
        d = n(69205),
        f = n(91808),
        h = n(34541),
        m = n(47838),
        p = (n(97393), n(48095)),
        v = n(72477),
        g = n(95260),
        y = n(5095),
        k = n(67684);
      (0, f.Z)(
        [(0, g.Mo)("ha-fab")],
        function (e, t) {
          var n = (function (t) {
            function n() {
              var t;
              (0, l.Z)(this, n);
              for (
                var r = arguments.length, i = new Array(r), o = 0;
                o < r;
                o++
              )
                i[o] = arguments[o];
              return (t = (0, s.Z)(this, n, [].concat(i))), e((0, u.Z)(t)), t;
            }
            return (0, d.Z)(n, t), (0, c.Z)(n);
          })(t);
          return {
            F: n,
            d: [
              {
                kind: "method",
                key: "firstUpdated",
                value: function (e) {
                  (0, h.Z)((0, m.Z)(n.prototype), "firstUpdated", this).call(
                    this,
                    e
                  ),
                    this.style.setProperty(
                      "--mdc-theme-secondary",
                      "var(--primary-color)"
                    );
                },
              },
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    v.W,
                    (0, y.iv)(
                      r ||
                        (r = (0, a.Z)([
                          ":host .mdc-fab--extended .mdc-fab__icon{margin-inline-start:-8px;margin-inline-end:12px;direction:var(--direction)}",
                        ]))
                    ),
                    "rtl" === k.E.document.dir
                      ? (0, y.iv)(
                          i ||
                            (i = (0, a.Z)([
                              ":host .mdc-fab--extended .mdc-fab__icon{direction:rtl}",
                            ]))
                        )
                      : (0, y.iv)(o || (o = (0, a.Z)([""]))),
                  ];
                },
              },
            ],
          };
        },
        p._
      );
    },
    62082: function (e, t, n) {
      "use strict";
      n.r(t),
        n.d(t, {
          HaIconOverflowMenu: function () {
            return C;
          },
        });
      var r,
        i,
        o,
        a,
        c,
        l,
        s,
        u,
        d,
        f = n(88962),
        h = n(33368),
        m = n(71650),
        p = n(68308),
        v = n(82390),
        g = n(69205),
        y = n(91808),
        k = (n(97393), n(46349), n(70320), n(33829), n(5095)),
        b = n(95260),
        w = n(53180),
        Z = n(29950),
        C =
          (n(85878),
          n(54371),
          n(90532),
          n(37662),
          (0, y.Z)(
            [(0, b.Mo)("ha-icon-overflow-menu")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, m.Z)(this, n);
                  for (
                    var r = arguments.length, i = new Array(r), o = 0;
                    o < r;
                    o++
                  )
                    i[o] = arguments[o];
                  return (
                    (t = (0, p.Z)(this, n, [].concat(i))), e((0, v.Z)(t)), t
                  );
                }
                return (0, g.Z)(n, t), (0, h.Z)(n);
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
                    decorators: [(0, b.Cb)({ type: Array })],
                    key: "items",
                    value: function () {
                      return [];
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
                    kind: "method",
                    key: "render",
                    value: function () {
                      return (0, k.dy)(
                        r || (r = (0, f.Z)([" ", " "])),
                        this.narrow
                          ? (0, k.dy)(
                              i ||
                                (i = (0, f.Z)([
                                  ' <ha-button-menu @click="',
                                  '" @closed="',
                                  '" class="ha-icon-overflow-menu-overflow" absolute> <ha-icon-button .label="',
                                  '" .path="',
                                  '" slot="trigger"></ha-icon-button> ',
                                  " </ha-button-menu>",
                                ])),
                              this._handleIconOverflowMenuOpened,
                              this._handleIconOverflowMenuClosed,
                              this.hass.localize("ui.common.overflow_menu"),
                              "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
                              this.items.map(function (e) {
                                return e.divider
                                  ? (0, k.dy)(
                                      o ||
                                        (o = (0, f.Z)([
                                          '<li divider role="separator"></li>',
                                        ]))
                                    )
                                  : (0, k.dy)(
                                      a ||
                                        (a = (0, f.Z)([
                                          '<ha-list-item graphic="icon" ?disabled="',
                                          '" @click="',
                                          '" class="',
                                          '"> <div slot="graphic"> <ha-svg-icon class="',
                                          '" .path="',
                                          '"></ha-svg-icon> </div> ',
                                          " </ha-list-item> ",
                                        ])),
                                      e.disabled,
                                      e.action,
                                      (0, w.$)({ warning: Boolean(e.warning) }),
                                      (0, w.$)({ warning: Boolean(e.warning) }),
                                      e.path,
                                      e.label
                                    );
                              })
                            )
                          : (0, k.dy)(
                              c || (c = (0, f.Z)([" ", " "])),
                              this.items.map(function (e) {
                                return e.narrowOnly
                                  ? ""
                                  : e.divider
                                  ? (0, k.dy)(
                                      l ||
                                        (l = (0, f.Z)([
                                          '<div role="separator"></div>',
                                        ]))
                                    )
                                  : (0, k.dy)(
                                      s ||
                                        (s = (0, f.Z)([
                                          "<div> ",
                                          ' <ha-icon-button @click="',
                                          '" .label="',
                                          '" .path="',
                                          '" ?disabled="',
                                          '"></ha-icon-button> </div> ',
                                        ])),
                                      e.tooltip
                                        ? (0, k.dy)(
                                            u ||
                                              (u = (0, f.Z)([
                                                '<simple-tooltip animation-delay="0" position="left"> ',
                                                " </simple-tooltip>",
                                              ])),
                                            e.tooltip
                                          )
                                        : "",
                                      e.action,
                                      e.label,
                                      e.path,
                                      e.disabled
                                    );
                              })
                            )
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_handleIconOverflowMenuOpened",
                    value: function (e) {
                      e.stopPropagation();
                      var t = this.closest(".mdc-data-table__row");
                      t && (t.style.zIndex = "1");
                    },
                  },
                  {
                    kind: "method",
                    key: "_handleIconOverflowMenuClosed",
                    value: function () {
                      var e = this.closest(".mdc-data-table__row");
                      e && (e.style.zIndex = "");
                    },
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return [
                        Z.Qx,
                        (0, k.iv)(
                          d ||
                            (d = (0, f.Z)([
                              ":host{display:flex;justify-content:flex-end}li[role=separator]{border-bottom-color:var(--divider-color)}div[role=separator]{border-right:1px solid var(--divider-color);width:1px}ha-list-item[disabled] ha-svg-icon{color:var(--disabled-text-color)}",
                            ]))
                        ),
                      ];
                    },
                  },
                ],
              };
            },
            k.oi
          ));
    },
    90532: function (e, t, n) {
      "use strict";
      var r,
        i,
        o,
        a = n(88962),
        c = n(33368),
        l = n(71650),
        s = n(68308),
        u = n(82390),
        d = n(69205),
        f = n(91808),
        h = n(34541),
        m = n(47838),
        p = (n(97393), n(61092)),
        v = n(96762),
        g = n(5095),
        y = n(95260);
      (0, f.Z)(
        [(0, y.Mo)("ha-list-item")],
        function (e, t) {
          var n = (function (t) {
            function n() {
              var t;
              (0, l.Z)(this, n);
              for (
                var r = arguments.length, i = new Array(r), o = 0;
                o < r;
                o++
              )
                i[o] = arguments[o];
              return (t = (0, s.Z)(this, n, [].concat(i))), e((0, u.Z)(t)), t;
            }
            return (0, d.Z)(n, t), (0, c.Z)(n);
          })(t);
          return {
            F: n,
            d: [
              {
                kind: "method",
                key: "renderRipple",
                value: function () {
                  return this.noninteractive
                    ? ""
                    : (0, h.Z)(
                        (0, m.Z)(n.prototype),
                        "renderRipple",
                        this
                      ).call(this);
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    v.W,
                    (0, g.iv)(
                      r ||
                        (r = (0, a.Z)([
                          ":host{padding-left:var(--mdc-list-side-padding-left,var(--mdc-list-side-padding,20px));padding-right:var(--mdc-list-side-padding-right,var(--mdc-list-side-padding,20px))}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:48px}span.material-icons:first-of-type{margin-inline-start:0px!important;margin-inline-end:var(--mdc-list-item-graphic-margin,16px)!important;direction:var(--direction)!important}span.material-icons:last-of-type{margin-inline-start:auto!important;margin-inline-end:0px!important;direction:var(--direction)!important}.mdc-deprecated-list-item__meta{display:var(--mdc-list-item-meta-display);align-items:center;flex-shrink:0}:host([graphic=icon]:not([twoline])) .mdc-deprecated-list-item__graphic{margin-inline-end:var(--mdc-list-item-graphic-margin,20px)!important}:host([multiline-secondary]){height:auto}:host([multiline-secondary]) .mdc-deprecated-list-item__text{padding:8px 0}:host([multiline-secondary]) .mdc-deprecated-list-item__secondary-text{text-overflow:initial;white-space:normal;overflow:auto;display:inline-block;margin-top:10px}:host([multiline-secondary]) .mdc-deprecated-list-item__primary-text{margin-top:10px}:host([multiline-secondary]) .mdc-deprecated-list-item__secondary-text::before{display:none}:host([multiline-secondary]) .mdc-deprecated-list-item__primary-text::before{display:none}:host([disabled]){color:var(--disabled-text-color)}:host([noninteractive]){pointer-events:unset}",
                        ]))
                    ),
                    "rtl" === document.dir
                      ? (0, g.iv)(
                          i ||
                            (i = (0, a.Z)([
                              "span.material-icons:first-of-type,span.material-icons:last-of-type{direction:rtl!important}",
                            ]))
                        )
                      : (0, g.iv)(o || (o = (0, a.Z)([""]))),
                  ];
                },
              },
            ],
          };
        },
        p.K
      );
    },
    21162: function (e, t, n) {
      "use strict";
      var r,
        i,
        o,
        a = n(88962),
        c = n(33368),
        l = n(71650),
        s = n(68308),
        u = n(82390),
        d = n(69205),
        f = n(91808),
        h = (n(97393), n(5095)),
        m = n(95260),
        p = n(99312),
        v = n(40039),
        g = n(81043),
        y = n(34541),
        k = n(47838),
        b =
          (n(10187),
          n(32797),
          n(5239),
          n(17692),
          n(86439),
          n(40271),
          n(51358),
          n(46798),
          n(47084),
          n(98490),
          n(18394)),
        w = (n(31528), n(7695), n(44758), n(80354), n(68630), n(93217)),
        Z = (function () {
          var e = (0, g.Z)(
            (0, p.Z)().mark(function e(t, i, o) {
              return (0, p.Z)().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        r ||
                          (r = (0, w.Ud)(
                            new Worker(new URL(n.p + n.u(1402), n.b))
                          )),
                        e.abrupt("return", r.renderMarkdown(t, i, o))
                      );
                    case 2:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t, n, r) {
            return e.apply(this, arguments);
          };
        })(),
        C = { Note: "info", Warning: "warning" },
        _ = {
          "[!NOTE]": "info",
          "[!TIP]": "success",
          "[!IMPORTANT]": "info",
          "[!WARNING]": "warning",
          "[!CAUTION]": "error",
        };
      (0, f.Z)(
        [(0, m.Mo)("ha-markdown-element")],
        function (e, t) {
          var r,
            i = (function (t) {
              function n() {
                var t;
                (0, l.Z)(this, n);
                for (
                  var r = arguments.length, i = new Array(r), o = 0;
                  o < r;
                  o++
                )
                  i[o] = arguments[o];
                return (t = (0, s.Z)(this, n, [].concat(i))), e((0, u.Z)(t)), t;
              }
              return (0, d.Z)(n, t), (0, c.Z)(n);
            })(t);
          return {
            F: i,
            d: [
              {
                kind: "field",
                decorators: [(0, m.Cb)()],
                key: "content",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, m.Cb)({ type: Boolean })],
                key: "allowSvg",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, m.Cb)({ type: Boolean })],
                key: "breaks",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, m.Cb)({ type: Boolean, attribute: "lazy-images" }),
                ],
                key: "lazyImages",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "method",
                key: "createRenderRoot",
                value: function () {
                  return this;
                },
              },
              {
                kind: "method",
                key: "update",
                value: function (e) {
                  (0, y.Z)((0, k.Z)(i.prototype), "update", this).call(this, e),
                    void 0 !== this.content && this._render();
                },
              },
              {
                kind: "method",
                key: "_render",
                value:
                  ((r = (0, g.Z)(
                    (0, p.Z)().mark(function e() {
                      var t, r, i, o, a, c, l, s, u, d, f, h, m;
                      return (0, p.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.next = 2),
                                  Z(
                                    String(this.content),
                                    { breaks: this.breaks, gfm: !0 },
                                    { allowSvg: this.allowSvg }
                                  )
                                );
                              case 2:
                                for (
                                  this.innerHTML = e.sent,
                                    this._resize(),
                                    t = document.createTreeWalker(
                                      this,
                                      NodeFilter.SHOW_ELEMENT,
                                      null
                                    );
                                  t.nextNode();

                                )
                                  if (
                                    (r = t.currentNode) instanceof
                                      HTMLAnchorElement &&
                                    r.host !== document.location.host
                                  )
                                    (r.target = "_blank"),
                                      (r.rel = "noreferrer noopener");
                                  else if (r instanceof HTMLImageElement)
                                    this.lazyImages && (r.loading = "lazy"),
                                      r.addEventListener("load", this._resize);
                                  else if (r instanceof HTMLQuoteElement) {
                                    if (
                                      ((o = r.firstElementChild),
                                      (a =
                                        null == o
                                          ? void 0
                                          : o.firstElementChild),
                                      (c =
                                        (null == o ||
                                        null === (i = o.firstChild) ||
                                        void 0 === i
                                          ? void 0
                                          : i.textContent) &&
                                        _[o.firstChild.textContent]),
                                      (l =
                                        !c &&
                                        (null == a ? void 0 : a.textContent) &&
                                        C[a.textContent]),
                                      c ||
                                        ("STRONG" ===
                                          (null == a ? void 0 : a.nodeName) &&
                                          l))
                                    ) {
                                      ((u =
                                        document.createElement(
                                          "ha-alert"
                                        )).alertType = c || l),
                                        (u.title = c
                                          ? ""
                                          : ("#text" ===
                                              o.childNodes[1].nodeName &&
                                              (null ===
                                                (s =
                                                  o.childNodes[1]
                                                    .textContent) ||
                                              void 0 === s
                                                ? void 0
                                                : s.trimStart())) ||
                                            ""),
                                        (d = Array.from(o.childNodes)),
                                        (f = (0, v.Z)(
                                          d.slice(
                                            d.findIndex(function (e) {
                                              return e instanceof HTMLBRElement;
                                            }) + 1
                                          )
                                        ));
                                      try {
                                        for (f.s(); !(h = f.n()).done; )
                                          (m = h.value), u.appendChild(m);
                                      } catch (p) {
                                        f.e(p);
                                      } finally {
                                        f.f();
                                      }
                                      r.firstElementChild.replaceWith(u);
                                    }
                                  } else
                                    r instanceof HTMLElement &&
                                      [
                                        "ha-alert",
                                        "ha-qr-code",
                                        "ha-icon",
                                        "ha-svg-icon",
                                      ].includes(r.localName) &&
                                      n(61320)("./".concat(r.localName));
                              case 6:
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
                    return r.apply(this, arguments);
                  }),
              },
              {
                kind: "field",
                key: "_resize",
                value: function () {
                  var e = this;
                  return function () {
                    return (0, b.B)(e, "content-resize");
                  };
                },
              },
            ],
          };
        },
        h.fl
      ),
        (0, f.Z)(
          [(0, m.Mo)("ha-markdown")],
          function (e, t) {
            var n = (function (t) {
              function n() {
                var t;
                (0, l.Z)(this, n);
                for (
                  var r = arguments.length, i = new Array(r), o = 0;
                  o < r;
                  o++
                )
                  i[o] = arguments[o];
                return (t = (0, s.Z)(this, n, [].concat(i))), e((0, u.Z)(t)), t;
              }
              return (0, d.Z)(n, t), (0, c.Z)(n);
            })(t);
            return {
              F: n,
              d: [
                {
                  kind: "field",
                  decorators: [(0, m.Cb)()],
                  key: "content",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, m.Cb)({ type: Boolean })],
                  key: "allowSvg",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, m.Cb)({ type: Boolean })],
                  key: "breaks",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [
                    (0, m.Cb)({ type: Boolean, attribute: "lazy-images" }),
                  ],
                  key: "lazyImages",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return this.content
                      ? (0, h.dy)(
                          i ||
                            (i = (0, a.Z)([
                              '<ha-markdown-element .content="',
                              '" .allowSvg="',
                              '" .breaks="',
                              '" .lazyImages="',
                              '"></ha-markdown-element>',
                            ])),
                          this.content,
                          this.allowSvg,
                          this.breaks,
                          this.lazyImages
                        )
                      : h.Ld;
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return (0, h.iv)(
                      o ||
                        (o = (0, a.Z)([
                          ":host{display:block}ha-markdown-element{-ms-user-select:text;-webkit-user-select:text;-moz-user-select:text}ha-markdown-element>:first-child{margin-top:0}ha-markdown-element>:last-child{margin-bottom:0}a{color:var(--primary-color)}img{max-width:100%}code,pre{background-color:var(--markdown-code-background-color,none);border-radius:3px}svg{background-color:var(--markdown-svg-background-color,none);color:var(--markdown-svg-color,none)}code{font-size:85%;padding:.2em .4em}pre code{padding:0}pre{padding:16px;overflow:auto;line-height:1.45;font-family:var(--code-font-family, monospace)}h1,h2,h3,h4,h5,h6{line-height:initial}h2{font-size:1.5em;font-weight:700}",
                        ]))
                    );
                  },
                },
              ],
            };
          },
          h.oi
        );
    },
    60470: function (e, t, n) {
      "use strict";
      n.d(t, {
        RQ: function () {
          return i;
        },
        pB: function () {
          return r;
        },
      });
      n(46097), n(85717), n(37313);
      var r = function (e, t) {
          var n = {};
          return (
            t &&
              (t.type && (n.type_filter = t.type),
              t.domain && (n.domain = t.domain)),
            e.callWS(Object.assign({ type: "config_entries/get" }, n))
          );
        },
        i = function (e, t) {
          return e.callWS({ type: "config_entries/get_single", entry_id: t });
        };
    },
    32218: function (e, t, n) {
      "use strict";
      n.d(t, {
        SN: function () {
          return i;
        },
        eL: function () {
          return r;
        },
        fg: function () {
          return a;
        },
        id: function () {
          return o;
        },
      });
      n(85717);
      var r = function (e) {
          return e.sendMessagePromise({ type: "lovelace/resources" });
        },
        i = function (e, t) {
          return e.callWS(
            Object.assign({ type: "lovelace/resources/create" }, t)
          );
        },
        o = function (e, t, n) {
          return e.callWS(
            Object.assign(
              { type: "lovelace/resources/update", resource_id: t },
              n
            )
          );
        },
        a = function (e, t) {
          return e.callWS({
            type: "lovelace/resources/delete",
            resource_id: t,
          });
        };
    },
    11285: function (e, t, n) {
      "use strict";
      n.d(t, {
        D9: function () {
          return l;
        },
        Ys: function () {
          return a;
        },
        g7: function () {
          return c;
        },
      });
      n(51358), n(46798), n(47084), n(5239), n(98490), n(85717);
      var r = n(18394),
        i = function () {
          return Promise.all([n.e(8597), n.e(8942), n.e(4338)]).then(
            n.bind(n, 44338)
          );
        },
        o = function (e, t, n) {
          return new Promise(function (o) {
            var a = t.cancel,
              c = t.confirm;
            (0, r.B)(e, "show-dialog", {
              dialogTag: "dialog-box",
              dialogImport: i,
              dialogParams: Object.assign(
                Object.assign(Object.assign({}, t), n),
                {},
                {
                  cancel: function () {
                    o(!(null == n || !n.prompt) && null), a && a();
                  },
                  confirm: function (e) {
                    o(null == n || !n.prompt || e), c && c(e);
                  },
                }
              ),
            });
          });
        },
        a = function (e, t) {
          return o(e, t);
        },
        c = function (e, t) {
          return o(e, t, { confirmation: !0 });
        },
        l = function (e, t) {
          return o(e, t, { prompt: !0 });
        };
    },
    33367: function (e, t, n) {
      "use strict";
      n.d(t, {
        U8: function () {
          return a;
        },
        lU: function () {
          return i;
        },
        px: function () {
          return o;
        },
      });
      n(51358), n(46798), n(47084), n(5239), n(98490);
      var r = n(18394),
        i = function (e, t) {
          (0, r.B)(e, "show-dialog", {
            dialogTag: "hacs-form-dialog",
            dialogImport: function () {
              return Promise.all([
                n.e(8597),
                n.e(2692),
                n.e(9663),
                n.e(4833),
              ]).then(n.bind(n, 4833));
            },
            dialogParams: t,
          });
        },
        o = function (e, t) {
          (0, r.B)(e, "show-dialog", {
            dialogTag: "hacs-download-dialog",
            dialogImport: function () {
              return Promise.all([
                n.e(8597),
                n.e(2692),
                n.e(9663),
                n.e(5563),
              ]).then(n.bind(n, 25563));
            },
            dialogParams: t,
          });
        },
        a = function (e, t) {
          (0, r.B)(e, "show-dialog", {
            dialogTag: "hacs-custom-repositories-dialog",
            dialogImport: function () {
              return Promise.all([
                n.e(8597),
                n.e(2692),
                n.e(9663),
                n.e(1064),
              ]).then(n.bind(n, 91064));
            },
            dialogParams: t,
          });
        };
    },
    90012: function (e, t, n) {
      "use strict";
      n.d(t, {
        G: function () {
          return m;
        },
      });
      var r = n(99312),
        i = n(81043),
        o = n(46097),
        a =
          (n(97393),
          n(46798),
          n(9849),
          n(13526),
          n(22859),
          n(50289),
          n(94167),
          n(87438),
          n(22890),
          n(88640),
          n(14516)),
        c = n(67684),
        l = n(38480),
        s = n(60470),
        u = n(32218),
        d = n(11285),
        f = n(46797),
        h = n(33367),
        m = (0, a.Z)(function (e, t) {
          return [].concat(
            (0, o.Z)(
              "HACS-EXPERIMENTAL-PANEL" === e.nodeName
                ? [
                    {
                      path: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
                      label: e.hacs.localize("common.show"),
                      action: function () {
                        return (0, l.c)("/hacs/repository/".concat(t.id));
                      },
                    },
                  ]
                : []
            ),
            [
              {
                path: "M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z",
                label: e.hacs.localize("common.repository"),
                action: function () {
                  return c.E.open(
                    "https://github.com/".concat(t.full_name),
                    "_blank",
                    "noreferrer=true"
                  );
                },
              },
              {
                path: "M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z",
                label: e.hacs.localize("repository_card.update_information"),
                action:
                  ((a = (0, i.Z)(
                    (0, r.Z)().mark(function n() {
                      return (0, r.Z)().wrap(function (n) {
                        for (;;)
                          switch ((n.prev = n.next)) {
                            case 0:
                              return (
                                (n.next = 2), (0, f.yx)(e.hass, String(t.id))
                              );
                            case 2:
                            case "end":
                              return n.stop();
                          }
                      }, n);
                    })
                  )),
                  function () {
                    return a.apply(this, arguments);
                  }),
              },
            ],
            (0, o.Z)(
              t.installed_version
                ? [
                    {
                      path: "M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z",
                      label: e.hacs.localize("repository_card.redownload"),
                      action: function () {
                        return (0, h.px)(e, {
                          hacs: e.hacs,
                          repositoryId: t.id,
                        });
                      },
                      hideForUninstalled: !0,
                    },
                  ]
                : []
            ),
            (0, o.Z)(
              "plugin" === t.category && t.installed_version
                ? [
                    {
                      path: "M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z",
                      label: e.hacs.localize("repository_card.open_source"),
                      action: function () {
                        return c.E.open(
                          "/hacsfiles/"
                            .concat(t.local_path.split("/").pop(), "/")
                            .concat(t.file_name),
                          "_blank",
                          "noreferrer=true"
                        );
                      },
                    },
                  ]
                : []
            ),
            [
              { divider: !0 },
              {
                path: "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
                label: e.hacs.localize("repository_card.open_issue"),
                action: function () {
                  return c.E.open(
                    "https://github.com/".concat(t.full_name, "/issues"),
                    "_blank",
                    "noreferrer=true"
                  );
                },
              },
            ],
            (0, o.Z)(
              "172733314" !== t.id && t.installed_version
                ? [
                    {
                      path: "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z",
                      label: e.hacs.localize("repository_card.report"),
                      action: function () {
                        return c.E.open(
                          "https://github.com/hacs/integration/issues/new?assignees=ludeeus&labels=flag&template=removal.yml&repo="
                            .concat(
                              t.full_name,
                              "&title=Request for removal of "
                            )
                            .concat(t.full_name),
                          "_blank",
                          "noreferrer=true"
                        );
                      },
                      warning: !0,
                    },
                    {
                      path: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
                      label: e.hacs.localize("common.remove"),
                      action:
                        ((n = (0, i.Z)(
                          (0, r.Z)().mark(function n() {
                            return (0, r.Z)().wrap(function (n) {
                              for (;;)
                                switch ((n.prev = n.next)) {
                                  case 0:
                                    if (
                                      "integration" !== t.category ||
                                      !t.config_flow
                                    ) {
                                      n.next = 10;
                                      break;
                                    }
                                    return (n.next = 3), (0, s.pB)(e.hass);
                                  case 3:
                                    if (
                                      !n.sent.some(function (e) {
                                        return e.domain === t.domain;
                                      })
                                    ) {
                                      n.next = 10;
                                      break;
                                    }
                                    return (
                                      (n.next = 7),
                                      (0, d.g7)(e, {
                                        title: e.hacs.localize(
                                          "dialog.configured.title"
                                        ),
                                        text: e.hacs.localize(
                                          "dialog.configured.message",
                                          { name: t.name }
                                        ),
                                        dismissText:
                                          e.hacs.localize("common.ignore"),
                                        confirmText:
                                          e.hacs.localize("common.navigate"),
                                        confirm: function () {
                                          (0, l.c)("/config/integrations", {
                                            replace: !0,
                                          });
                                        },
                                      })
                                    );
                                  case 7:
                                    if (!n.sent) {
                                      n.next = 10;
                                      break;
                                    }
                                    return n.abrupt("return");
                                  case 10:
                                    (0, h.lU)(e, {
                                      hacs: e.hacs,
                                      title: e.hacs.localize(
                                        "dialog.remove.title"
                                      ),
                                      saveLabel: e.hacs.localize(
                                        "dialog.remove.title"
                                      ),
                                      description: e.hacs.localize(
                                        "dialog.remove.message",
                                        { name: t.name }
                                      ),
                                      saveAction: (function () {
                                        var n = (0, i.Z)(
                                          (0, r.Z)().mark(function n() {
                                            return (0, r.Z)().wrap(function (
                                              n
                                            ) {
                                              for (;;)
                                                switch ((n.prev = n.next)) {
                                                  case 0:
                                                    return (
                                                      (n.next = 2), p(e, t)
                                                    );
                                                  case 2:
                                                  case "end":
                                                    return n.stop();
                                                }
                                            }, n);
                                          })
                                        );
                                        return function () {
                                          return n.apply(this, arguments);
                                        };
                                      })(),
                                      destructive: !0,
                                    });
                                  case 11:
                                  case "end":
                                    return n.stop();
                                }
                            }, n);
                          })
                        )),
                        function () {
                          return n.apply(this, arguments);
                        }),
                      warning: !0,
                    },
                  ]
                : []
            )
          );
          var n, a;
        }),
        p = (function () {
          var e = (0, i.Z)(
            (0, r.Z)().mark(function e(t, n) {
              var o;
              return (0, r.Z)().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        "plugin" !== n.category ||
                        "yaml" ===
                          (null === (o = t.hacs.info) || void 0 === o
                            ? void 0
                            : o.lovelace_mode)
                      ) {
                        e.next = 5;
                        break;
                      }
                      return (e.next = 3), (0, u.eL)(t.hass.connection);
                    case 3:
                      e.sent
                        .filter(function (e) {
                          return e.url.startsWith(
                            "/hacsfiles/"
                              .concat(n.full_name.split("/")[1], "/")
                              .concat(n.file_name)
                          );
                        })
                        .forEach(
                          (function () {
                            var e = (0, i.Z)(
                              (0, r.Z)().mark(function e(n) {
                                return (0, r.Z)().wrap(function (e) {
                                  for (;;)
                                    switch ((e.prev = e.next)) {
                                      case 0:
                                        return (
                                          (e.next = 2),
                                          (0, u.fg)(t.hass, String(n.id))
                                        );
                                      case 2:
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
                        );
                    case 5:
                      return (e.next = 7), (0, f.jW)(t.hass, String(n.id));
                    case 7:
                      "HACS-REPOSITORY-PANEL" === t.nodeName && history.back();
                    case 8:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t, n) {
            return e.apply(this, arguments);
          };
        })();
    },
  },
]);
//# sourceMappingURL=2519.ykGi5kXz9uA.js.map
