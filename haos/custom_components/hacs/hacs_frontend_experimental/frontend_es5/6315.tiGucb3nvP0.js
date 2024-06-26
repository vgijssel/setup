"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [6315],
  {
    86089: function (e, t, n) {
      n.d(t, {
        U: function () {
          return i;
        },
      });
      var i = function (e) {
        return e.stopPropagation();
      };
    },
    71133: function (e, t, n) {
      var i,
        a,
        d,
        l,
        r = n(99312),
        s = n(81043),
        o = n(88962),
        c = n(33368),
        u = n(71650),
        h = n(68308),
        v = n(82390),
        p = n(69205),
        f = n(91808),
        g = n(34541),
        k = n(47838),
        y = (n(97393), n(49412)),
        b = n(3762),
        _ = n(5095),
        m = n(95260),
        Z = n(72218),
        x = n(2537);
      n(54371),
        (0, f.Z)(
          [(0, m.Mo)("ha-select")],
          function (e, t) {
            var n = (function (t) {
              function n() {
                var t;
                (0, u.Z)(this, n);
                for (
                  var i = arguments.length, a = new Array(i), d = 0;
                  d < i;
                  d++
                )
                  a[d] = arguments[d];
                return (t = (0, h.Z)(this, n, [].concat(a))), e((0, v.Z)(t)), t;
              }
              return (0, p.Z)(n, t), (0, c.Z)(n);
            })(t);
            return {
              F: n,
              d: [
                {
                  kind: "field",
                  decorators: [(0, m.Cb)({ type: Boolean })],
                  key: "icon",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, m.Cb)({ type: Boolean, reflect: !0 })],
                  key: "clearable",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return (0, _.dy)(
                      i || (i = (0, o.Z)([" ", " ", " "])),
                      (0, g.Z)((0, k.Z)(n.prototype), "render", this).call(
                        this
                      ),
                      this.clearable &&
                        !this.required &&
                        !this.disabled &&
                        this.value
                        ? (0, _.dy)(
                            a ||
                              (a = (0, o.Z)([
                                '<ha-icon-button label="clear" @click="',
                                '" .path="',
                                '"></ha-icon-button>',
                              ])),
                            this._clearValue,
                            "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                          )
                        : _.Ld
                    );
                  },
                },
                {
                  kind: "method",
                  key: "renderLeadingIcon",
                  value: function () {
                    return this.icon
                      ? (0, _.dy)(
                          d ||
                            (d = (0, o.Z)([
                              '<span class="mdc-select__icon"><slot name="icon"></slot></span>',
                            ]))
                        )
                      : _.Ld;
                  },
                },
                {
                  kind: "method",
                  key: "connectedCallback",
                  value: function () {
                    (0, g.Z)(
                      (0, k.Z)(n.prototype),
                      "connectedCallback",
                      this
                    ).call(this),
                      window.addEventListener(
                        "translations-updated",
                        this._translationsUpdated
                      );
                  },
                },
                {
                  kind: "method",
                  key: "disconnectedCallback",
                  value: function () {
                    (0, g.Z)(
                      (0, k.Z)(n.prototype),
                      "disconnectedCallback",
                      this
                    ).call(this),
                      window.removeEventListener(
                        "translations-updated",
                        this._translationsUpdated
                      );
                  },
                },
                {
                  kind: "method",
                  key: "_clearValue",
                  value: function () {
                    !this.disabled &&
                      this.value &&
                      ((this.valueSetDirectly = !0),
                      this.select(-1),
                      this.mdcFoundation.handleChange());
                  },
                },
                {
                  kind: "field",
                  key: "_translationsUpdated",
                  value: function () {
                    var e = this;
                    return (0, Z.D)(
                      (0, s.Z)(
                        (0, r.Z)().mark(function t() {
                          return (0, r.Z)().wrap(function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (t.next = 2), (0, x.y)();
                                case 2:
                                  e.layoutOptions();
                                case 3:
                                case "end":
                                  return t.stop();
                              }
                          }, t);
                        })
                      ),
                      500
                    );
                  },
                },
                {
                  kind: "field",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      b.W,
                      (0, _.iv)(
                        l ||
                          (l = (0, o.Z)([
                            ":host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          y.K
        );
    },
    86315: function (e, t, n) {
      n.r(t),
        n.d(t, {
          HaSTTSelector: function () {
            return U;
          },
        });
      var i,
        a,
        d,
        l,
        r,
        s,
        o = n(88962),
        c = n(33368),
        u = n(71650),
        h = n(68308),
        v = n(82390),
        p = n(69205),
        f = n(91808),
        g = (n(97393), n(5095)),
        k = n(95260),
        y = n(99312),
        b = n(81043),
        _ = n(34541),
        m = n(47838),
        Z =
          (n(85472),
          n(46798),
          n(9849),
          n(90126),
          n(46349),
          n(70320),
          n(40271),
          n(60163),
          n(18394)),
        x = n(86089),
        C = n(2733),
        w = n(72218),
        L = (n(90532), n(71133), "__NONE_OPTION__"),
        B = { cloud: "Home Assistant Cloud" },
        U =
          ((0, f.Z)(
            [(0, k.Mo)("ha-stt-picker")],
            function (e, t) {
              var n,
                r = (function (t) {
                  function n() {
                    var t;
                    (0, u.Z)(this, n);
                    for (
                      var i = arguments.length, a = new Array(i), d = 0;
                      d < i;
                      d++
                    )
                      a[d] = arguments[d];
                    return (
                      (t = (0, h.Z)(this, n, [].concat(a))), e((0, v.Z)(t)), t
                    );
                  }
                  return (0, p.Z)(n, t), (0, c.Z)(n);
                })(t);
              return {
                F: r,
                d: [
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
                    key: "language",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ type: Boolean, reflect: !0 })],
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
                    decorators: [(0, k.SB)()],
                    key: "_engines",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e,
                        t = this;
                      if (!this._engines) return g.Ld;
                      var n =
                        null !== (e = this.value) && void 0 !== e
                          ? e
                          : this.required
                          ? this._engines.find(function (e) {
                              var t;
                              return (
                                0 !==
                                (null === (t = e.supported_languages) ||
                                void 0 === t
                                  ? void 0
                                  : t.length)
                              );
                            })
                          : L;
                      return (0, g.dy)(
                        i ||
                          (i = (0, o.Z)([
                            ' <ha-select .label="',
                            '" .value="',
                            '" .required="',
                            '" .disabled="',
                            '" @selected="',
                            '" @closed="',
                            '" fixedMenuPosition naturalMenuWidth> ',
                            " ",
                            " </ha-select> ",
                          ])),
                        this.label ||
                          this.hass.localize("ui.components.stt-picker.stt"),
                        n,
                        this.required,
                        this.disabled,
                        this._changed,
                        x.U,
                        this.required
                          ? g.Ld
                          : (0, g.dy)(
                              a ||
                                (a = (0, o.Z)([
                                  '<ha-list-item .value="',
                                  '"> ',
                                  " </ha-list-item>",
                                ])),
                              L,
                              this.hass.localize(
                                "ui.components.stt-picker.none"
                              )
                            ),
                        this._engines.map(function (e) {
                          var n,
                            i = e.engine_id;
                          if (e.engine_id.includes(".")) {
                            var a = t.hass.states[e.engine_id];
                            i = a ? (0, C.C)(a) : e.engine_id;
                          } else e.engine_id in B && (i = B[e.engine_id]);
                          return (0, g.dy)(
                            d ||
                              (d = (0, o.Z)([
                                '<ha-list-item .value="',
                                '" .disabled="',
                                '"> ',
                                " </ha-list-item>",
                              ])),
                            e.engine_id,
                            0 ===
                              (null === (n = e.supported_languages) ||
                              void 0 === n
                                ? void 0
                                : n.length),
                            i
                          );
                        })
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "willUpdate",
                    value: function (e) {
                      (0, _.Z)((0, m.Z)(r.prototype), "willUpdate", this).call(
                        this,
                        e
                      ),
                        this.hasUpdated
                          ? e.has("language") && this._debouncedUpdateEngines()
                          : this._updateEngines();
                    },
                  },
                  {
                    kind: "field",
                    key: "_debouncedUpdateEngines",
                    value: function () {
                      var e = this;
                      return (0, w.D)(function () {
                        return e._updateEngines();
                      }, 500);
                    },
                  },
                  {
                    kind: "method",
                    key: "_updateEngines",
                    value:
                      ((n = (0, b.Z)(
                        (0, y.Z)().mark(function e() {
                          var t,
                            n,
                            i = this;
                          return (0, y.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return (
                                      (e.next = 2),
                                      (a = this.hass),
                                      (d = this.language),
                                      (l = this.hass.config.country || void 0),
                                      a.callWS({
                                        type: "stt/engine/list",
                                        language: d,
                                        country: l,
                                      })
                                    );
                                  case 2:
                                    if (
                                      ((this._engines = e.sent.providers),
                                      this.value)
                                    ) {
                                      e.next = 5;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 5:
                                    (n = this._engines.find(function (e) {
                                      return e.engine_id === i.value;
                                    })),
                                      (0, Z.B)(
                                        this,
                                        "supported-languages-changed",
                                        {
                                          value:
                                            null == n
                                              ? void 0
                                              : n.supported_languages,
                                        }
                                      ),
                                      (n &&
                                        0 !==
                                          (null ===
                                            (t = n.supported_languages) ||
                                          void 0 === t
                                            ? void 0
                                            : t.length)) ||
                                        ((this.value = void 0),
                                        (0, Z.B)(this, "value-changed", {
                                          value: this.value,
                                        }));
                                  case 8:
                                  case "end":
                                    return e.stop();
                                }
                              var a, d, l;
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
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, g.iv)(
                        l || (l = (0, o.Z)(["ha-select{width:100%}"]))
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_changed",
                    value: function (e) {
                      var t,
                        n = this,
                        i = e.target;
                      !this.hass ||
                        "" === i.value ||
                        i.value === this.value ||
                        (void 0 === this.value && i.value === L) ||
                        ((this.value = i.value === L ? void 0 : i.value),
                        (0, Z.B)(this, "value-changed", { value: this.value }),
                        (0, Z.B)(this, "supported-languages-changed", {
                          value:
                            null ===
                              (t = this._engines.find(function (e) {
                                return e.engine_id === n.value;
                              })) || void 0 === t
                              ? void 0
                              : t.supported_languages,
                        }));
                    },
                  },
                ],
              };
            },
            g.oi
          ),
          (0, f.Z)(
            [(0, k.Mo)("ha-selector-stt")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, u.Z)(this, n);
                  for (
                    var i = arguments.length, a = new Array(i), d = 0;
                    d < i;
                    d++
                  )
                    a[d] = arguments[d];
                  return (
                    (t = (0, h.Z)(this, n, [].concat(a))), e((0, v.Z)(t)), t
                  );
                }
                return (0, p.Z)(n, t), (0, c.Z)(n);
              })(t);
              return {
                F: n,
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
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "context",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e, t;
                      return (0, g.dy)(
                        r ||
                          (r = (0, o.Z)([
                            '<ha-stt-picker .hass="',
                            '" .value="',
                            '" .label="',
                            '" .helper="',
                            '" .language="',
                            '" .disabled="',
                            '" .required="',
                            '"></ha-stt-picker>',
                          ])),
                        this.hass,
                        this.value,
                        this.label,
                        this.helper,
                        (null === (e = this.selector.stt) || void 0 === e
                          ? void 0
                          : e.language) ||
                          (null === (t = this.context) || void 0 === t
                            ? void 0
                            : t.language),
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
                      return (0, g.iv)(
                        s || (s = (0, o.Z)(["ha-stt-picker{width:100%}"]))
                      );
                    },
                  },
                ],
              };
            },
            g.oi
          ));
    },
  },
]);
//# sourceMappingURL=6315.tiGucb3nvP0.js.map
