"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1666],
  {
    86089: function (e, t, i) {
      i.d(t, {
        U: function () {
          return n;
        },
      });
      var n = function (e) {
        return e.stopPropagation();
      };
    },
    71133: function (e, t, i) {
      var n,
        a,
        o,
        r,
        l = i(99312),
        d = i(81043),
        s = i(88962),
        c = i(33368),
        u = i(71650),
        v = i(68308),
        h = i(82390),
        f = i(69205),
        k = i(91808),
        p = i(34541),
        y = i(47838),
        b = (i(97393), i(49412)),
        g = i(3762),
        _ = i(5095),
        m = i(95260),
        Z = i(72218),
        x = i(2537);
      i(54371),
        (0, k.Z)(
          [(0, m.Mo)("ha-select")],
          function (e, t) {
            var i = (function (t) {
              function i() {
                var t;
                (0, u.Z)(this, i);
                for (
                  var n = arguments.length, a = new Array(n), o = 0;
                  o < n;
                  o++
                )
                  a[o] = arguments[o];
                return (t = (0, v.Z)(this, i, [].concat(a))), e((0, h.Z)(t)), t;
              }
              return (0, f.Z)(i, t), (0, c.Z)(i);
            })(t);
            return {
              F: i,
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
                      n || (n = (0, s.Z)([" ", " ", " "])),
                      (0, p.Z)((0, y.Z)(i.prototype), "render", this).call(
                        this
                      ),
                      this.clearable &&
                        !this.required &&
                        !this.disabled &&
                        this.value
                        ? (0, _.dy)(
                            a ||
                              (a = (0, s.Z)([
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
                          o ||
                            (o = (0, s.Z)([
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
                    (0, p.Z)(
                      (0, y.Z)(i.prototype),
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
                    (0, p.Z)(
                      (0, y.Z)(i.prototype),
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
                      (0, d.Z)(
                        (0, l.Z)().mark(function t() {
                          return (0, l.Z)().wrap(function (t) {
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
                      g.W,
                      (0, _.iv)(
                        r ||
                          (r = (0, s.Z)([
                            ":host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          b.K
        );
    },
    71666: function (e, t, i) {
      i.r(t),
        i.d(t, {
          HaTTSVoiceSelector: function () {
            return f;
          },
        });
      var n,
        a,
        o = i(88962),
        r = i(33368),
        l = i(71650),
        d = i(68308),
        s = i(82390),
        c = i(69205),
        u = i(91808),
        v = (i(97393), i(5095)),
        h = i(95260),
        f =
          (i(60298),
          (0, u.Z)(
            [(0, h.Mo)("ha-selector-tts_voice")],
            function (e, t) {
              var i = (function (t) {
                function i() {
                  var t;
                  (0, l.Z)(this, i);
                  for (
                    var n = arguments.length, a = new Array(n), o = 0;
                    o < n;
                    o++
                  )
                    a[o] = arguments[o];
                  return (
                    (t = (0, d.Z)(this, i, [].concat(a))), e((0, s.Z)(t)), t
                  );
                }
                return (0, c.Z)(i, t), (0, r.Z)(i);
              })(t);
              return {
                F: i,
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
                    decorators: [(0, h.Cb)({ type: Boolean })],
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
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "context",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e, t, i, a;
                      return (0, v.dy)(
                        n ||
                          (n = (0, o.Z)([
                            '<ha-tts-voice-picker .hass="',
                            '" .value="',
                            '" .label="',
                            '" .helper="',
                            '" .language="',
                            '" .engineId="',
                            '" .disabled="',
                            '" .required="',
                            '"></ha-tts-voice-picker>',
                          ])),
                        this.hass,
                        this.value,
                        this.label,
                        this.helper,
                        (null === (e = this.selector.tts_voice) || void 0 === e
                          ? void 0
                          : e.language) ||
                          (null === (t = this.context) || void 0 === t
                            ? void 0
                            : t.language),
                        (null === (i = this.selector.tts_voice) || void 0 === i
                          ? void 0
                          : i.engineId) ||
                          (null === (a = this.context) || void 0 === a
                            ? void 0
                            : a.engineId),
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
                      return (0, v.iv)(
                        a || (a = (0, o.Z)(["ha-tts-picker{width:100%}"]))
                      );
                    },
                  },
                ],
              };
            },
            v.oi
          ));
    },
    60298: function (e, t, i) {
      var n,
        a,
        o,
        r,
        l = i(99312),
        d = i(81043),
        s = i(88962),
        c = i(33368),
        u = i(71650),
        v = i(68308),
        h = i(82390),
        f = i(69205),
        k = i(91808),
        p = i(34541),
        y = i(47838),
        b =
          (i(97393),
          i(46349),
          i(70320),
          i(22859),
          i(85472),
          i(46798),
          i(9849),
          i(90126),
          i(5095)),
        g = i(95260),
        _ = i(18394),
        m = i(86089),
        Z = i(72218),
        x = i(56112),
        C = (i(90532), i(71133), "__NONE_OPTION__");
      (0, k.Z)(
        [(0, g.Mo)("ha-tts-voice-picker")],
        function (e, t) {
          var i,
            k = (function (t) {
              function i() {
                var t;
                (0, u.Z)(this, i);
                for (
                  var n = arguments.length, a = new Array(n), o = 0;
                  o < n;
                  o++
                )
                  a[o] = arguments[o];
                return (t = (0, v.Z)(this, i, [].concat(a))), e((0, h.Z)(t)), t;
              }
              return (0, f.Z)(i, t), (0, c.Z)(i);
            })(t);
          return {
            F: k,
            d: [
              {
                kind: "field",
                decorators: [(0, g.Cb)()],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)()],
                key: "label",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)()],
                key: "engineId",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)()],
                key: "language",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)({ type: Boolean, reflect: !0 })],
                key: "disabled",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, g.Cb)({ type: Boolean })],
                key: "required",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, g.SB)()],
                key: "_voices",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, g.IO)("ha-select")],
                key: "_select",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  var e, t;
                  if (!this._voices) return b.Ld;
                  var i =
                    null !== (e = this.value) && void 0 !== e
                      ? e
                      : this.required
                      ? null === (t = this._voices[0]) || void 0 === t
                        ? void 0
                        : t.voice_id
                      : C;
                  return (0, b.dy)(
                    n ||
                      (n = (0, s.Z)([
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
                      this.hass.localize(
                        "ui.components.tts-voice-picker.voice"
                      ),
                    i,
                    this.required,
                    this.disabled,
                    this._changed,
                    m.U,
                    this.required
                      ? b.Ld
                      : (0, b.dy)(
                          a ||
                            (a = (0, s.Z)([
                              '<ha-list-item .value="',
                              '"> ',
                              " </ha-list-item>",
                            ])),
                          C,
                          this.hass.localize(
                            "ui.components.tts-voice-picker.none"
                          )
                        ),
                    this._voices.map(function (e) {
                      return (0, b.dy)(
                        o ||
                          (o = (0, s.Z)([
                            '<ha-list-item .value="',
                            '"> ',
                            " </ha-list-item>",
                          ])),
                        e.voice_id,
                        e.name
                      );
                    })
                  );
                },
              },
              {
                kind: "method",
                key: "willUpdate",
                value: function (e) {
                  (0, p.Z)((0, y.Z)(k.prototype), "willUpdate", this).call(
                    this,
                    e
                  ),
                    this.hasUpdated
                      ? (e.has("language") || e.has("engineId")) &&
                        this._debouncedUpdateVoices()
                      : this._updateVoices();
                },
              },
              {
                kind: "field",
                key: "_debouncedUpdateVoices",
                value: function () {
                  var e = this;
                  return (0, Z.D)(function () {
                    return e._updateVoices();
                  }, 500);
                },
              },
              {
                kind: "method",
                key: "_updateVoices",
                value:
                  ((i = (0, d.Z)(
                    (0, l.Z)().mark(function e() {
                      var t = this;
                      return (0, l.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (this.engineId && this.language) {
                                  e.next = 3;
                                  break;
                                }
                                return (
                                  (this._voices = void 0), e.abrupt("return")
                                );
                              case 3:
                                return (
                                  (e.next = 5),
                                  (0, x.MV)(
                                    this.hass,
                                    this.engineId,
                                    this.language
                                  )
                                );
                              case 5:
                                if (
                                  ((this._voices = e.sent.voices), this.value)
                                ) {
                                  e.next = 8;
                                  break;
                                }
                                return e.abrupt("return");
                              case 8:
                                (this._voices &&
                                  this._voices.find(function (e) {
                                    return e.voice_id === t.value;
                                  })) ||
                                  ((this.value = void 0),
                                  (0, _.B)(this, "value-changed", {
                                    value: this.value,
                                  }));
                              case 9:
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
                kind: "method",
                key: "updated",
                value: function (e) {
                  var t, i, n;
                  ((0, p.Z)((0, y.Z)(k.prototype), "updated", this).call(
                    this,
                    e
                  ),
                  e.has("_voices") &&
                    (null === (t = this._select) || void 0 === t
                      ? void 0
                      : t.value) !== this.value) &&
                    (null === (i = this._select) ||
                      void 0 === i ||
                      i.layoutOptions(),
                    (0, _.B)(this, "value-changed", {
                      value:
                        null === (n = this._select) || void 0 === n
                          ? void 0
                          : n.value,
                    }));
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, b.iv)(
                    r || (r = (0, s.Z)(["ha-select{width:100%}"]))
                  );
                },
              },
              {
                kind: "method",
                key: "_changed",
                value: function (e) {
                  var t = e.target;
                  !this.hass ||
                    "" === t.value ||
                    t.value === this.value ||
                    (void 0 === this.value && t.value === C) ||
                    ((this.value = t.value === C ? void 0 : t.value),
                    (0, _.B)(this, "value-changed", { value: this.value }));
                },
              },
            ],
          };
        },
        b.oi
      );
    },
    56112: function (e, t, i) {
      i.d(t, {
        MV: function () {
          return d;
        },
        Wg: function () {
          return r;
        },
        Xk: function () {
          return o;
        },
        b_: function () {
          return a;
        },
        yP: function () {
          return l;
        },
      });
      i(88640);
      var n = "media-source://tts/",
        a = function (e) {
          return e.startsWith(n);
        },
        o = function (e) {
          return e.substring(19);
        },
        r = function (e, t, i) {
          return e.callWS({ type: "tts/engine/list", language: t, country: i });
        },
        l = function (e, t) {
          return e.callWS({ type: "tts/engine/get", engine_id: t });
        },
        d = function (e, t, i) {
          return e.callWS({
            type: "tts/engine/voices",
            engine_id: t,
            language: i,
          });
        };
    },
  },
]);
//# sourceMappingURL=1666.DwU_QWcSm10.js.map
