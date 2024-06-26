"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [3395],
  {
    93395: function (e, n, t) {
      t.r(n),
        t.d(n, {
          HaConfigEntrySelector: function () {
            return Z;
          },
        });
      var i,
        o,
        r,
        a,
        d = t(88962),
        l = t(33368),
        s = t(71650),
        u = t(68308),
        c = t(82390),
        h = t(69205),
        f = t(91808),
        v = (t(97393), t(5095)),
        k = t(95260),
        y = t(99312),
        m = t(81043),
        p = (t(37313), t(46349), t(70320), t(85717), t(44577), t(18394)),
        g = t(28858),
        b = t(60470),
        _ = t(64346),
        C = t(72824),
        Z =
          (t(16591),
          (0, f.Z)(
            [(0, k.Mo)("ha-config-entry-picker")],
            function (e, n) {
              var t,
                r = (function (n) {
                  function t() {
                    var n;
                    (0, s.Z)(this, t);
                    for (
                      var i = arguments.length, o = new Array(i), r = 0;
                      r < i;
                      r++
                    )
                      o[r] = arguments[r];
                    return (
                      (n = (0, u.Z)(this, t, [].concat(o))), e((0, c.Z)(n)), n
                    );
                  }
                  return (0, h.Z)(t, n), (0, l.Z)(t);
                })(n);
              return {
                F: r,
                d: [
                  { kind: "field", key: "hass", value: void 0 },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "integration",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "value",
                    value: function () {
                      return "";
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.SB)()],
                    key: "_configEntries",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.IO)("ha-combo-box")],
                    key: "_comboBox",
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
                      this._getConfigEntries();
                    },
                  },
                  {
                    kind: "field",
                    key: "_rowRenderer",
                    value: function () {
                      var e = this;
                      return function (n) {
                        var t;
                        return (0, v.dy)(
                          i ||
                            (i = (0, d.Z)([
                              '<mwc-list-item twoline graphic="icon"> <span>',
                              '</span> <span slot="secondary">',
                              '</span> <img alt="" slot="graphic" src="',
                              '" crossorigin="anonymous" referrerpolicy="no-referrer" @error="',
                              '" @load="',
                              '"> </mwc-list-item>',
                            ])),
                          n.title ||
                            e.hass.localize(
                              "ui.panel.config.integrations.config_entry.unnamed_entry"
                            ),
                          n.localized_domain_name,
                          (0, C.X1)({
                            domain: n.domain,
                            type: "icon",
                            darkOptimized:
                              null === (t = e.hass.themes) || void 0 === t
                                ? void 0
                                : t.darkMode,
                          }),
                          e._onImageError,
                          e._onImageLoad
                        );
                      };
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this._configEntries
                        ? (0, v.dy)(
                            o ||
                              (o = (0, d.Z)([
                                ' <ha-combo-box .hass="',
                                '" .label="',
                                '" .value="',
                                '" .required="',
                                '" .disabled="',
                                '" .helper="',
                                '" .renderer="',
                                '" .items="',
                                '" item-value-path="entry_id" item-id-path="entry_id" item-label-path="title" @value-changed="',
                                '"></ha-combo-box> ',
                              ])),
                            this.hass,
                            void 0 === this.label && this.hass
                              ? this.hass.localize(
                                  "ui.components.config-entry-picker.config_entry"
                                )
                              : this.label,
                            this._value,
                            this.required,
                            this.disabled,
                            this.helper,
                            this._rowRenderer,
                            this._configEntries,
                            this._valueChanged
                          )
                        : v.Ld;
                    },
                  },
                  {
                    kind: "method",
                    key: "_onImageLoad",
                    value: function (e) {
                      e.target.style.visibility = "initial";
                    },
                  },
                  {
                    kind: "method",
                    key: "_onImageError",
                    value: function (e) {
                      e.target.style.visibility = "hidden";
                    },
                  },
                  {
                    kind: "method",
                    key: "_getConfigEntries",
                    value:
                      ((t = (0, m.Z)(
                        (0, y.Z)().mark(function e() {
                          var n = this;
                          return (0, y.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    (0, b.pB)(this.hass, {
                                      type: ["device", "hub", "service"],
                                      domain: this.integration,
                                    }).then(function (e) {
                                      n._configEntries = e
                                        .map(function (e) {
                                          return Object.assign(
                                            Object.assign({}, e),
                                            {},
                                            {
                                              localized_domain_name: (0, _.Lh)(
                                                n.hass.localize,
                                                e.domain
                                              ),
                                            }
                                          );
                                        })
                                        .sort(function (e, t) {
                                          return (0, g.f)(
                                            e.localized_domain_name + e.title,
                                            t.localized_domain_name + t.title,
                                            n.hass.locale.language
                                          );
                                        });
                                    });
                                  case 1:
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
                        return t.apply(this, arguments);
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
                    key: "_valueChanged",
                    value: function (e) {
                      e.stopPropagation();
                      var n = e.detail.value;
                      n !== this._value && this._setValue(n);
                    },
                  },
                  {
                    kind: "method",
                    key: "_setValue",
                    value: function (e) {
                      var n = this;
                      (this.value = e),
                        setTimeout(function () {
                          (0, p.B)(n, "value-changed", { value: e }),
                            (0, p.B)(n, "change");
                        }, 0);
                    },
                  },
                ],
              };
            },
            v.oi
          ),
          (0, f.Z)(
            [(0, k.Mo)("ha-selector-config_entry")],
            function (e, n) {
              var t = (function (n) {
                function t() {
                  var n;
                  (0, s.Z)(this, t);
                  for (
                    var i = arguments.length, o = new Array(i), r = 0;
                    r < i;
                    r++
                  )
                    o[r] = arguments[r];
                  return (
                    (n = (0, u.Z)(this, t, [].concat(o))), e((0, c.Z)(n)), n
                  );
                }
                return (0, h.Z)(t, n), (0, l.Z)(t);
              })(n);
              return {
                F: t,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e;
                      return (0, v.dy)(
                        r ||
                          (r = (0, d.Z)([
                            '<ha-config-entry-picker .hass="',
                            '" .value="',
                            '" .label="',
                            '" .helper="',
                            '" .disabled="',
                            '" .required="',
                            '" .integration="',
                            '" allow-custom-entity></ha-config-entry-picker>',
                          ])),
                        this.hass,
                        this.value,
                        this.label,
                        this.helper,
                        this.disabled,
                        this.required,
                        null === (e = this.selector.config_entry) ||
                          void 0 === e
                          ? void 0
                          : e.integration
                      );
                    },
                  },
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, v.iv)(
                        a ||
                          (a = (0, d.Z)(["ha-config-entry-picker{width:100%}"]))
                      );
                    },
                  },
                ],
              };
            },
            v.oi
          ));
    },
    64346: function (e, n, t) {
      t.d(n, {
        F3: function () {
          return o;
        },
        Lh: function () {
          return i;
        },
        t4: function () {
          return r;
        },
      });
      t(22859);
      var i = function (e, n, t) {
          return (
            e("component.".concat(n, ".title")) ||
            (null == t ? void 0 : t.name) ||
            n
          );
        },
        o = function (e, n) {
          var t = { type: "manifest/list" };
          return n && (t.integrations = n), e.callWS(t);
        },
        r = function (e, n) {
          return e.callWS({ type: "manifest/get", integration: n });
        };
    },
    72824: function (e, n, t) {
      t.d(n, {
        X1: function () {
          return i;
        },
        u4: function () {
          return o;
        },
        zC: function () {
          return r;
        },
      });
      t(97393), t(88640);
      var i = function (e) {
          return "https://brands.home-assistant.io/"
            .concat(e.brand ? "brands/" : "")
            .concat(e.useFallback ? "_/" : "")
            .concat(e.domain, "/")
            .concat(e.darkOptimized ? "dark_" : "")
            .concat(e.type, ".png");
        },
        o = function (e) {
          return e.split("/")[4];
        },
        r = function (e) {
          return e.startsWith("https://brands.home-assistant.io/");
        };
    },
  },
]);
//# sourceMappingURL=3395.C4oPfY7RYU4.js.map
