"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [9030],
  {
    79030: function (e, i, a) {
      a.r(i),
        a.d(i, {
          HaFormInteger: function () {
            return y;
          },
        });
      var t,
        d,
        s,
        l,
        h,
        r = a(88962),
        n = a(33368),
        u = a(71650),
        o = a(68308),
        c = a(82390),
        v = a(69205),
        f = a(91808),
        m = (a(97393), a(94738), a(98214), a(27392), a(5095)),
        k = a(95260),
        p = a(18394),
        y =
          (a(8956),
          (0, f.Z)(
            [(0, k.Mo)("ha-form-integer")],
            function (e, i) {
              var a = (function (i) {
                function a() {
                  var i;
                  (0, u.Z)(this, a);
                  for (
                    var t = arguments.length, d = new Array(t), s = 0;
                    s < t;
                    s++
                  )
                    d[s] = arguments[s];
                  return (
                    (i = (0, o.Z)(this, a, [].concat(d))), e((0, c.Z)(i)), i
                  );
                }
                return (0, v.Z)(a, i), (0, n.Z)(a);
              })(i);
              return {
                F: a,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "localize",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "schema",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, k.Cb)({ attribute: !1 })],
                    key: "data",
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
                    decorators: [(0, k.IO)("ha-textfield ha-slider")],
                    key: "_input",
                    value: void 0,
                  },
                  { kind: "field", key: "_lastValue", value: void 0 },
                  {
                    kind: "method",
                    key: "focus",
                    value: function () {
                      this._input && this._input.focus();
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e, i;
                      return void 0 !== this.schema.valueMin &&
                        void 0 !== this.schema.valueMax &&
                        this.schema.valueMax - this.schema.valueMin < 256
                        ? (0, m.dy)(
                            t ||
                              (t = (0, r.Z)([
                                " <div> ",
                                ' <div class="flex"> ',
                                ' <ha-slider labeled .value="',
                                '" .min="',
                                '" .max="',
                                '" .disabled="',
                                '" @change="',
                                '"></ha-slider> </div> ',
                                " </div> ",
                              ])),
                            this.label,
                            this.schema.required
                              ? ""
                              : (0, m.dy)(
                                  d ||
                                    (d = (0, r.Z)([
                                      ' <ha-checkbox @change="',
                                      '" .checked="',
                                      '" .disabled="',
                                      '"></ha-checkbox> ',
                                    ])),
                                  this._handleCheckboxChange,
                                  void 0 !== this.data,
                                  this.disabled
                                ),
                            this._value,
                            this.schema.valueMin,
                            this.schema.valueMax,
                            this.disabled ||
                              (void 0 === this.data && !this.schema.required),
                            this._valueChanged,
                            this.helper
                              ? (0, m.dy)(
                                  s ||
                                    (s = (0, r.Z)([
                                      "<ha-input-helper-text>",
                                      "</ha-input-helper-text>",
                                    ])),
                                  this.helper
                                )
                              : ""
                          )
                        : (0, m.dy)(
                            l ||
                              (l = (0, r.Z)([
                                ' <ha-textfield type="number" inputMode="numeric" .label="',
                                '" .helper="',
                                '" helperPersistent .value="',
                                '" .disabled="',
                                '" .required="',
                                '" .autoValidate="',
                                '" .suffix="',
                                '" .validationMessage="',
                                '" @input="',
                                '"></ha-textfield> ',
                              ])),
                            this.label,
                            this.helper,
                            void 0 !== this.data ? this.data : "",
                            this.disabled,
                            this.schema.required,
                            this.schema.required,
                            null === (e = this.schema.description) ||
                              void 0 === e
                              ? void 0
                              : e.suffix,
                            this.schema.required
                              ? null === (i = this.localize) || void 0 === i
                                ? void 0
                                : i.call(this, "ui.common.error_required")
                              : void 0,
                            this._valueChanged
                          );
                    },
                  },
                  {
                    kind: "method",
                    key: "updated",
                    value: function (e) {
                      e.has("schema") &&
                        this.toggleAttribute(
                          "own-margin",
                          !(
                            ("valueMin" in this.schema &&
                              "valueMax" in this.schema) ||
                            !this.schema.required
                          )
                        );
                    },
                  },
                  {
                    kind: "get",
                    key: "_value",
                    value: function () {
                      var e, i;
                      return void 0 !== this.data
                        ? this.data
                        : this.schema.required
                        ? (void 0 !==
                            (null === (e = this.schema.description) ||
                            void 0 === e
                              ? void 0
                              : e.suggested_value) &&
                            null !==
                              (null === (i = this.schema.description) ||
                              void 0 === i
                                ? void 0
                                : i.suggested_value)) ||
                          this.schema.default ||
                          this.schema.valueMin ||
                          0
                        : this.schema.valueMin || 0;
                    },
                  },
                  {
                    kind: "method",
                    key: "_handleCheckboxChange",
                    value: function (e) {
                      var i;
                      if (e.target.checked)
                        for (
                          var a = 0,
                            t = [
                              this._lastValue,
                              null === (d = this.schema.description) ||
                              void 0 === d
                                ? void 0
                                : d.suggested_value,
                              this.schema.default,
                              0,
                            ];
                          a < t.length;
                          a++
                        ) {
                          var d,
                            s = t[a];
                          if (void 0 !== s) {
                            i = s;
                            break;
                          }
                        }
                      else this._lastValue = this.data;
                      (0, p.B)(this, "value-changed", { value: i });
                    },
                  },
                  {
                    kind: "method",
                    key: "_valueChanged",
                    value: function (e) {
                      var i,
                        a = e.target,
                        t = a.value;
                      if (
                        ("" !== t && (i = parseInt(String(t))), this.data !== i)
                      )
                        (0, p.B)(this, "value-changed", { value: i });
                      else {
                        var d = void 0 === i ? "" : String(i);
                        a.value !== d && (a.value = d);
                      }
                    },
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, m.iv)(
                        h ||
                          (h = (0, r.Z)([
                            ":host([own-margin]){margin-bottom:5px}.flex{display:flex}ha-slider{flex:1}ha-textfield{display:block}",
                          ]))
                      );
                    },
                  },
                ],
              };
            },
            m.oi
          ));
    },
    8956: function (e, i, a) {
      var t,
        d = a(88962),
        s = a(46097),
        l = a(33368),
        h = a(71650),
        r = a(68308),
        n = a(82390),
        u = a(69205),
        o = a(91808),
        c = (a(97393), a(95260)),
        v = (a(34131), a(96985)),
        f = a(5095);
      (0, o.Z)(
        [(0, c.Mo)("ha-slider")],
        function (e, i) {
          var a = (function (i) {
            function a() {
              var i;
              (0, h.Z)(this, a);
              for (
                var t = arguments.length, d = new Array(t), s = 0;
                s < t;
                s++
              )
                d[s] = arguments[s];
              return (i = (0, r.Z)(this, a, [].concat(d))), e((0, n.Z)(i)), i;
            }
            return (0, u.Z)(a, i), (0, l.Z)(a);
          })(i);
          return {
            F: a,
            d: [
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return [].concat((0, s.Z)(v.$.styles), [
                    (0, f.iv)(
                      t ||
                        (t = (0, d.Z)([
                          ":host{--md-sys-color-primary:var(--primary-color);--md-sys-color-outline:var(--outline-color);--md-sys-color-on-surface:var(--primary-text-color);--md-slider-handle-width:14px;--md-slider-handle-height:14px;min-width:100px;min-inline-size:100px;width:200px}",
                        ]))
                    ),
                  ]);
                },
              },
            ],
          };
        },
        v.$
      );
    },
  },
]);
//# sourceMappingURL=9030.VD_2kkT3HVo.js.map
