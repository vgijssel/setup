"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [5107],
  {
    74376: function (e, t, n) {
      var r,
        i = n(88962),
        o = n(33368),
        a = n(71650),
        l = n(68308),
        d = n(82390),
        c = n(69205),
        s = n(91808),
        f = (n(97393), n(58417)),
        u = n(39274),
        m = n(5095),
        p = n(95260);
      (0, s.Z)(
        [(0, p.Mo)("ha-checkbox")],
        function (e, t) {
          var n = (function (t) {
            function n() {
              var t;
              (0, a.Z)(this, n);
              for (
                var r = arguments.length, i = new Array(r), o = 0;
                o < r;
                o++
              )
                i[o] = arguments[o];
              return (t = (0, l.Z)(this, n, [].concat(i))), e((0, d.Z)(t)), t;
            }
            return (0, c.Z)(n, t), (0, o.Z)(n);
          })(t);
          return {
            F: n,
            d: [
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    u.W,
                    (0, m.iv)(
                      r ||
                        (r = (0, i.Z)([
                          ":host{--mdc-theme-secondary:var(--primary-color)}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        f.A
      );
    },
    45107: function (e, t, n) {
      n.r(t),
        n.d(t, {
          HaFormBoolean: function () {
            return v;
          },
        });
      var r = n(88962),
        i = n(33368),
        o = n(71650),
        a = n(68308),
        l = n(82390),
        d = n(69205),
        c = n(91808),
        s = (n(97393), n(43204)),
        f = n(95260),
        u = n(8485),
        m = n(92038),
        p = (function (e) {
          function t() {
            return (0, o.Z)(this, t), (0, a.Z)(this, t, arguments);
          }
          return (0, d.Z)(t, e), (0, i.Z)(t);
        })(u.a);
      (p.styles = [m.W]),
        (p = (0, s.__decorate)([(0, f.Mo)("mwc-formfield")], p));
      var h,
        g = n(5095),
        y = n(18394),
        v =
          (n(74376),
          (0, c.Z)(
            [(0, f.Mo)("ha-form-boolean")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, o.Z)(this, n);
                  for (
                    var r = arguments.length, i = new Array(r), d = 0;
                    d < r;
                    d++
                  )
                    i[d] = arguments[d];
                  return (
                    (t = (0, a.Z)(this, n, [].concat(i))), e((0, l.Z)(t)), t
                  );
                }
                return (0, d.Z)(n, t), (0, i.Z)(n);
              })(t);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, f.Cb)()],
                    key: "schema",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, f.Cb)()],
                    key: "data",
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
                    decorators: [(0, f.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, f.IO)("ha-checkbox", !0)],
                    key: "_input",
                    value: void 0,
                  },
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
                      return (0, g.dy)(
                        h ||
                          (h = (0, r.Z)([
                            ' <mwc-formfield .label="',
                            '"> <ha-checkbox .checked="',
                            '" .disabled="',
                            '" @change="',
                            '"></ha-checkbox> </mwc-formfield> ',
                          ])),
                        this.label,
                        this.data,
                        this.disabled,
                        this._valueChanged
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_valueChanged",
                    value: function (e) {
                      (0, y.B)(this, "value-changed", {
                        value: e.target.checked,
                      });
                    },
                  },
                ],
              };
            },
            g.oi
          ));
    },
    18601: function (e, t, n) {
      n.d(t, {
        Wg: function () {
          return h;
        },
        qN: function () {
          return m.q;
        },
      });
      var r,
        i,
        o = n(71650),
        a = n(33368),
        l = n(68308),
        d = n(34541),
        c = n(47838),
        s = n(69205),
        f = (n(32797), n(5239), n(43204)),
        u = n(95260),
        m = n(78220),
        p =
          null !==
            (i =
              null === (r = window.ShadyDOM) || void 0 === r
                ? void 0
                : r.inUse) &&
          void 0 !== i &&
          i,
        h = (function (e) {
          function t() {
            var e;
            return (
              (0, o.Z)(this, t),
              ((e = (0, l.Z)(this, t, arguments)).disabled = !1),
              (e.containingForm = null),
              (e.formDataListener = function (t) {
                e.disabled || e.setFormData(t.formData);
              }),
              e
            );
          }
          return (
            (0, s.Z)(t, e),
            (0, a.Z)(t, [
              {
                key: "findFormElement",
                value: function () {
                  if (!this.shadowRoot || p) return null;
                  for (
                    var e = this.getRootNode().querySelectorAll("form"),
                      t = 0,
                      n = Array.from(e);
                    t < n.length;
                    t++
                  ) {
                    var r = n[t];
                    if (r.contains(this)) return r;
                  }
                  return null;
                },
              },
              {
                key: "connectedCallback",
                value: function () {
                  var e;
                  (0, d.Z)(
                    (0, c.Z)(t.prototype),
                    "connectedCallback",
                    this
                  ).call(this),
                    (this.containingForm = this.findFormElement()),
                    null === (e = this.containingForm) ||
                      void 0 === e ||
                      e.addEventListener("formdata", this.formDataListener);
                },
              },
              {
                key: "disconnectedCallback",
                value: function () {
                  var e;
                  (0, d.Z)(
                    (0, c.Z)(t.prototype),
                    "disconnectedCallback",
                    this
                  ).call(this),
                    null === (e = this.containingForm) ||
                      void 0 === e ||
                      e.removeEventListener("formdata", this.formDataListener),
                    (this.containingForm = null);
                },
              },
              {
                key: "click",
                value: function () {
                  this.formElement &&
                    !this.disabled &&
                    (this.formElement.focus(), this.formElement.click());
                },
              },
              {
                key: "firstUpdated",
                value: function () {
                  var e = this;
                  (0, d.Z)((0, c.Z)(t.prototype), "firstUpdated", this).call(
                    this
                  ),
                    this.shadowRoot &&
                      this.mdcRoot.addEventListener("change", function (t) {
                        e.dispatchEvent(new Event("change", t));
                      });
                },
              },
            ]),
            t
          );
        })(m.H);
      (h.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
        (0, f.__decorate)(
          [(0, u.Cb)({ type: Boolean })],
          h.prototype,
          "disabled",
          void 0
        );
    },
    8485: function (e, t, n) {
      n.d(t, {
        a: function () {
          return Z;
        },
      });
      var r,
        i = n(88962),
        o = n(99312),
        a = n(81043),
        l = n(71650),
        d = n(33368),
        c = n(68308),
        s = n(69205),
        f = n(43204),
        u = n(72774),
        m = { ROOT: "mdc-form-field" },
        p = { LABEL_SELECTOR: ".mdc-form-field > label" },
        h = (function (e) {
          function t(n) {
            var r =
              e.call(
                this,
                (0, f.__assign)((0, f.__assign)({}, t.defaultAdapter), n)
              ) || this;
            return (
              (r.click = function () {
                r.handleClick();
              }),
              r
            );
          }
          return (
            (0, f.__extends)(t, e),
            Object.defineProperty(t, "cssClasses", {
              get: function () {
                return m;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t, "strings", {
              get: function () {
                return p;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t, "defaultAdapter", {
              get: function () {
                return {
                  activateInputRipple: function () {},
                  deactivateInputRipple: function () {},
                  deregisterInteractionHandler: function () {},
                  registerInteractionHandler: function () {},
                };
              },
              enumerable: !1,
              configurable: !0,
            }),
            (t.prototype.init = function () {
              this.adapter.registerInteractionHandler("click", this.click);
            }),
            (t.prototype.destroy = function () {
              this.adapter.deregisterInteractionHandler("click", this.click);
            }),
            (t.prototype.handleClick = function () {
              var e = this;
              this.adapter.activateInputRipple(),
                requestAnimationFrame(function () {
                  e.adapter.deactivateInputRipple();
                });
            }),
            t
          );
        })(u.K),
        g = n(78220),
        y = n(18601),
        v = n(14114),
        b = n(5095),
        k = n(95260),
        w = n(53180),
        Z = (function (e) {
          function t() {
            var e;
            return (
              (0, l.Z)(this, t),
              ((e = (0, c.Z)(this, t, arguments)).alignEnd = !1),
              (e.spaceBetween = !1),
              (e.nowrap = !1),
              (e.label = ""),
              (e.mdcFoundationClass = h),
              e
            );
          }
          return (
            (0, s.Z)(t, e),
            (0, d.Z)(t, [
              {
                key: "createAdapter",
                value: function () {
                  var e,
                    t,
                    n = this;
                  return {
                    registerInteractionHandler: function (e, t) {
                      n.labelEl.addEventListener(e, t);
                    },
                    deregisterInteractionHandler: function (e, t) {
                      n.labelEl.removeEventListener(e, t);
                    },
                    activateInputRipple:
                      ((t = (0, a.Z)(
                        (0, o.Z)().mark(function e() {
                          var t, r;
                          return (0, o.Z)().wrap(function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (!((t = n.input) instanceof y.Wg)) {
                                    e.next = 6;
                                    break;
                                  }
                                  return (e.next = 4), t.ripple;
                                case 4:
                                  (r = e.sent) && r.startPress();
                                case 6:
                                case "end":
                                  return e.stop();
                              }
                          }, e);
                        })
                      )),
                      function () {
                        return t.apply(this, arguments);
                      }),
                    deactivateInputRipple:
                      ((e = (0, a.Z)(
                        (0, o.Z)().mark(function e() {
                          var t, r;
                          return (0, o.Z)().wrap(function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (!((t = n.input) instanceof y.Wg)) {
                                    e.next = 6;
                                    break;
                                  }
                                  return (e.next = 4), t.ripple;
                                case 4:
                                  (r = e.sent) && r.endPress();
                                case 6:
                                case "end":
                                  return e.stop();
                              }
                          }, e);
                        })
                      )),
                      function () {
                        return e.apply(this, arguments);
                      }),
                  };
                },
              },
              {
                key: "input",
                get: function () {
                  var e, t;
                  return null !==
                    (t =
                      null === (e = this.slottedInputs) || void 0 === e
                        ? void 0
                        : e[0]) && void 0 !== t
                    ? t
                    : null;
                },
              },
              {
                key: "render",
                value: function () {
                  var e = {
                    "mdc-form-field--align-end": this.alignEnd,
                    "mdc-form-field--space-between": this.spaceBetween,
                    "mdc-form-field--nowrap": this.nowrap,
                  };
                  return (0, b.dy)(
                    r ||
                      (r = (0, i.Z)([
                        ' <div class="mdc-form-field ',
                        '"> <slot></slot> <label class="mdc-label" @click="',
                        '">',
                        "</label> </div>",
                      ])),
                    (0, w.$)(e),
                    this._labelClick,
                    this.label
                  );
                },
              },
              {
                key: "click",
                value: function () {
                  this._labelClick();
                },
              },
              {
                key: "_labelClick",
                value: function () {
                  var e = this.input;
                  e && (e.focus(), e.click());
                },
              },
            ]),
            t
          );
        })(g.H);
      (0, f.__decorate)(
        [(0, k.Cb)({ type: Boolean })],
        Z.prototype,
        "alignEnd",
        void 0
      ),
        (0, f.__decorate)(
          [(0, k.Cb)({ type: Boolean })],
          Z.prototype,
          "spaceBetween",
          void 0
        ),
        (0, f.__decorate)(
          [(0, k.Cb)({ type: Boolean })],
          Z.prototype,
          "nowrap",
          void 0
        ),
        (0, f.__decorate)(
          [
            (0, k.Cb)({ type: String }),
            (0, v.P)(
              (function () {
                var e = (0, a.Z)(
                  (0, o.Z)().mark(function e(t) {
                    var n;
                    return (0, o.Z)().wrap(
                      function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              null === (n = this.input) ||
                                void 0 === n ||
                                n.setAttribute("aria-label", t);
                            case 1:
                            case "end":
                              return e.stop();
                          }
                      },
                      e,
                      this
                    );
                  })
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })()
            ),
          ],
          Z.prototype,
          "label",
          void 0
        ),
        (0, f.__decorate)(
          [(0, k.IO)(".mdc-form-field")],
          Z.prototype,
          "mdcRoot",
          void 0
        ),
        (0, f.__decorate)(
          [(0, k.vZ)("", !0, "*")],
          Z.prototype,
          "slottedInputs",
          void 0
        ),
        (0, f.__decorate)([(0, k.IO)("label")], Z.prototype, "labelEl", void 0);
    },
    92038: function (e, t, n) {
      n.d(t, {
        W: function () {
          return o;
        },
      });
      var r,
        i = n(88962),
        o = (0, n(5095).iv)(
          r ||
            (r = (0, i.Z)([
              ".mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{margin-left:auto;margin-right:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{margin-left:0;margin-right:auto}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}.mdc-form-field--space-between>label[dir=rtl],[dir=rtl] .mdc-form-field--space-between>label{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))}::slotted(mwc-switch){margin-right:10px}::slotted(mwc-switch[dir=rtl]),[dir=rtl] ::slotted(mwc-switch){margin-left:10px}",
            ]))
        );
    },
  },
]);
//# sourceMappingURL=5107.KzgGAZW2sYI.js.map
