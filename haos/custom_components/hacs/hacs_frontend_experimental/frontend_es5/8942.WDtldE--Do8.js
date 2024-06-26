/*! For license information please see 8942.WDtldE--Do8.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [8942],
  {
    8942: function (e, t, c) {
      var i,
        r,
        o,
        n = c(88962),
        a = c(33368),
        d = c(71650),
        s = c(68308),
        l = c(82390),
        h = c(69205),
        u = c(91808),
        p = c(34541),
        m = c(47838),
        b = (c(97393), c(85717), c(43204)),
        f = (c(27763), c(38103)),
        v = c(78220),
        w = c(14114),
        _ = c(98734),
        k = c(72774),
        y = {
          CHECKED: "mdc-switch--checked",
          DISABLED: "mdc-switch--disabled",
        },
        g = {
          ARIA_CHECKED_ATTR: "aria-checked",
          NATIVE_CONTROL_SELECTOR: ".mdc-switch__native-control",
          RIPPLE_SURFACE_SELECTOR: ".mdc-switch__thumb-underlay",
        },
        C = (function (e) {
          function t(c) {
            return (
              e.call(
                this,
                (0, b.__assign)((0, b.__assign)({}, t.defaultAdapter), c)
              ) || this
            );
          }
          return (
            (0, b.__extends)(t, e),
            Object.defineProperty(t, "strings", {
              get: function () {
                return g;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t, "cssClasses", {
              get: function () {
                return y;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(t, "defaultAdapter", {
              get: function () {
                return {
                  addClass: function () {},
                  removeClass: function () {},
                  setNativeControlChecked: function () {},
                  setNativeControlDisabled: function () {},
                  setNativeControlAttr: function () {},
                };
              },
              enumerable: !1,
              configurable: !0,
            }),
            (t.prototype.setChecked = function (e) {
              this.adapter.setNativeControlChecked(e),
                this.updateAriaChecked(e),
                this.updateCheckedStyling(e);
            }),
            (t.prototype.setDisabled = function (e) {
              this.adapter.setNativeControlDisabled(e),
                e
                  ? this.adapter.addClass(y.DISABLED)
                  : this.adapter.removeClass(y.DISABLED);
            }),
            (t.prototype.handleChange = function (e) {
              var t = e.target;
              this.updateAriaChecked(t.checked),
                this.updateCheckedStyling(t.checked);
            }),
            (t.prototype.updateCheckedStyling = function (e) {
              e
                ? this.adapter.addClass(y.CHECKED)
                : this.adapter.removeClass(y.CHECKED);
            }),
            (t.prototype.updateAriaChecked = function (e) {
              this.adapter.setNativeControlAttr(g.ARIA_CHECKED_ATTR, "" + !!e);
            }),
            t
          );
        })(k.K),
        x = c(5095),
        R = c(95260),
        E = c(10694),
        A = (function (e) {
          function t() {
            var e;
            return (
              (0, d.Z)(this, t),
              ((e = (0, s.Z)(this, t, arguments)).checked = !1),
              (e.disabled = !1),
              (e.shouldRenderRipple = !1),
              (e.mdcFoundationClass = C),
              (e.rippleHandlers = new _.A(function () {
                return (e.shouldRenderRipple = !0), e.ripple;
              })),
              e
            );
          }
          return (
            (0, h.Z)(t, e),
            (0, a.Z)(t, [
              {
                key: "changeHandler",
                value: function (e) {
                  this.mdcFoundation.handleChange(e),
                    (this.checked = this.formElement.checked);
                },
              },
              {
                key: "createAdapter",
                value: function () {
                  var e = this;
                  return Object.assign(
                    Object.assign({}, (0, v.q)(this.mdcRoot)),
                    {
                      setNativeControlChecked: function (t) {
                        e.formElement.checked = t;
                      },
                      setNativeControlDisabled: function (t) {
                        e.formElement.disabled = t;
                      },
                      setNativeControlAttr: function (t, c) {
                        e.formElement.setAttribute(t, c);
                      },
                    }
                  );
                },
              },
              {
                key: "renderRipple",
                value: function () {
                  return this.shouldRenderRipple
                    ? (0, x.dy)(
                        i ||
                          (i = (0, n.Z)([
                            ' <mwc-ripple .accent="',
                            '" .disabled="',
                            '" unbounded> </mwc-ripple>',
                          ])),
                        this.checked,
                        this.disabled
                      )
                    : "";
                },
              },
              {
                key: "focus",
                value: function () {
                  var e = this.formElement;
                  e && (this.rippleHandlers.startFocus(), e.focus());
                },
              },
              {
                key: "blur",
                value: function () {
                  var e = this.formElement;
                  e && (this.rippleHandlers.endFocus(), e.blur());
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
                  (0, p.Z)((0, m.Z)(t.prototype), "firstUpdated", this).call(
                    this
                  ),
                    this.shadowRoot &&
                      this.mdcRoot.addEventListener("change", function (t) {
                        e.dispatchEvent(new Event("change", t));
                      });
                },
              },
              {
                key: "render",
                value: function () {
                  return (0, x.dy)(
                    r ||
                      (r = (0, n.Z)([
                        ' <div class="mdc-switch"> <div class="mdc-switch__track"></div> <div class="mdc-switch__thumb-underlay"> ',
                        ' <div class="mdc-switch__thumb"> <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" aria-label="',
                        '" aria-labelledby="',
                        '" @change="',
                        '" @focus="',
                        '" @blur="',
                        '" @mousedown="',
                        '" @mouseenter="',
                        '" @mouseleave="',
                        '" @touchstart="',
                        '" @touchend="',
                        '" @touchcancel="',
                        '"> </div> </div> </div>',
                      ])),
                    this.renderRipple(),
                    (0, E.o)(this.ariaLabel),
                    (0, E.o)(this.ariaLabelledBy),
                    this.changeHandler,
                    this.handleRippleFocus,
                    this.handleRippleBlur,
                    this.handleRippleMouseDown,
                    this.handleRippleMouseEnter,
                    this.handleRippleMouseLeave,
                    this.handleRippleTouchStart,
                    this.handleRippleDeactivate,
                    this.handleRippleDeactivate
                  );
                },
              },
              {
                key: "handleRippleMouseDown",
                value: function (e) {
                  var t = this;
                  window.addEventListener("mouseup", function e() {
                    window.removeEventListener("mouseup", e),
                      t.handleRippleDeactivate();
                  }),
                    this.rippleHandlers.startPress(e);
                },
              },
              {
                key: "handleRippleTouchStart",
                value: function (e) {
                  this.rippleHandlers.startPress(e);
                },
              },
              {
                key: "handleRippleDeactivate",
                value: function () {
                  this.rippleHandlers.endPress();
                },
              },
              {
                key: "handleRippleMouseEnter",
                value: function () {
                  this.rippleHandlers.startHover();
                },
              },
              {
                key: "handleRippleMouseLeave",
                value: function () {
                  this.rippleHandlers.endHover();
                },
              },
              {
                key: "handleRippleFocus",
                value: function () {
                  this.rippleHandlers.startFocus();
                },
              },
              {
                key: "handleRippleBlur",
                value: function () {
                  this.rippleHandlers.endFocus();
                },
              },
            ]),
            t
          );
        })(v.H);
      (0, b.__decorate)(
        [
          (0, R.Cb)({ type: Boolean }),
          (0, w.P)(function (e) {
            this.mdcFoundation.setChecked(e);
          }),
        ],
        A.prototype,
        "checked",
        void 0
      ),
        (0, b.__decorate)(
          [
            (0, R.Cb)({ type: Boolean }),
            (0, w.P)(function (e) {
              this.mdcFoundation.setDisabled(e);
            }),
          ],
          A.prototype,
          "disabled",
          void 0
        ),
        (0, b.__decorate)(
          [f.L, (0, R.Cb)({ attribute: "aria-label" })],
          A.prototype,
          "ariaLabel",
          void 0
        ),
        (0, b.__decorate)(
          [f.L, (0, R.Cb)({ attribute: "aria-labelledby" })],
          A.prototype,
          "ariaLabelledBy",
          void 0
        ),
        (0, b.__decorate)(
          [(0, R.IO)(".mdc-switch")],
          A.prototype,
          "mdcRoot",
          void 0
        ),
        (0, b.__decorate)(
          [(0, R.IO)("input")],
          A.prototype,
          "formElement",
          void 0
        ),
        (0, b.__decorate)(
          [(0, R.GC)("mwc-ripple")],
          A.prototype,
          "ripple",
          void 0
        ),
        (0, b.__decorate)(
          [(0, R.SB)()],
          A.prototype,
          "shouldRenderRipple",
          void 0
        ),
        (0, b.__decorate)(
          [(0, R.hO)({ passive: !0 })],
          A.prototype,
          "handleRippleMouseDown",
          null
        ),
        (0, b.__decorate)(
          [(0, R.hO)({ passive: !0 })],
          A.prototype,
          "handleRippleTouchStart",
          null
        );
      var D,
        H = (0, x.iv)(
          o ||
            (o = (0, n.Z)([
              ".mdc-switch__thumb-underlay{left:-14px;right:initial;top:-17px;width:48px;height:48px}.mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch__thumb-underlay{left:initial;right:-14px}.mdc-switch__native-control{width:64px;height:48px}.mdc-switch{display:inline-block;position:relative;outline:0;user-select:none}.mdc-switch.mdc-switch--checked .mdc-switch__track{background-color:#018786;background-color:var(--mdc-theme-secondary,#018786)}.mdc-switch.mdc-switch--checked .mdc-switch__thumb{background-color:#018786;background-color:var(--mdc-theme-secondary,#018786);border-color:#018786;border-color:var(--mdc-theme-secondary,#018786)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__track{background-color:#000;background-color:var(--mdc-theme-on-surface,#000)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb{background-color:#fff;background-color:var(--mdc-theme-surface,#fff);border-color:#fff;border-color:var(--mdc-theme-surface,#fff)}.mdc-switch__native-control{left:0;right:initial;position:absolute;top:0;margin:0;opacity:0;cursor:pointer;pointer-events:auto;transition:transform 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch__native-control{left:initial;right:0}.mdc-switch__track{box-sizing:border-box;width:36px;height:14px;border:1px solid transparent;border-radius:7px;opacity:.38;transition:opacity 90ms cubic-bezier(.4, 0, .2, 1),background-color 90ms cubic-bezier(.4, 0, .2, 1),border-color 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__thumb-underlay{display:flex;position:absolute;align-items:center;justify-content:center;transform:translateX(0);transition:transform 90ms cubic-bezier(.4, 0, .2, 1),background-color 90ms cubic-bezier(.4, 0, .2, 1),border-color 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__thumb{box-shadow:0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12);box-sizing:border-box;width:20px;height:20px;border:10px solid;border-radius:50%;pointer-events:none;z-index:1}.mdc-switch--checked .mdc-switch__track{opacity:.54}.mdc-switch--checked .mdc-switch__thumb-underlay{transform:translateX(16px)}.mdc-switch--checked .mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__thumb-underlay{transform:translateX(-16px)}.mdc-switch--checked .mdc-switch__native-control{transform:translateX(-16px)}.mdc-switch--checked .mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__native-control{transform:translateX(16px)}.mdc-switch--disabled{opacity:.38;pointer-events:none}.mdc-switch--disabled .mdc-switch__thumb{border-width:1px}.mdc-switch--disabled .mdc-switch__native-control{cursor:default;pointer-events:none}:host{display:inline-flex;outline:0;-webkit-tap-highlight-color:transparent}",
            ]))
        ),
        L = c(18394);
      (0, u.Z)(
        [(0, R.Mo)("ha-switch")],
        function (e, t) {
          var c = (function (t) {
            function c() {
              var t;
              (0, d.Z)(this, c);
              for (
                var i = arguments.length, r = new Array(i), o = 0;
                o < i;
                o++
              )
                r[o] = arguments[o];
              return (t = (0, s.Z)(this, c, [].concat(r))), e((0, l.Z)(t)), t;
            }
            return (0, h.Z)(c, t), (0, a.Z)(c);
          })(t);
          return {
            F: c,
            d: [
              {
                kind: "field",
                decorators: [(0, R.Cb)({ type: Boolean })],
                key: "haptic",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "method",
                key: "firstUpdated",
                value: function () {
                  var e = this;
                  (0, p.Z)((0, m.Z)(c.prototype), "firstUpdated", this).call(
                    this
                  ),
                    this.addEventListener("change", function () {
                      var t;
                      e.haptic &&
                        ((t = "light"), (0, L.B)(window, "haptic", t));
                    });
                },
              },
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    H,
                    (0, x.iv)(
                      D ||
                        (D = (0, n.Z)([
                          ":host{--mdc-theme-secondary:var(--switch-checked-color)}.mdc-switch.mdc-switch--checked .mdc-switch__thumb{background-color:var(--switch-checked-button-color);border-color:var(--switch-checked-button-color)}.mdc-switch.mdc-switch--checked .mdc-switch__track{background-color:var(--switch-checked-track-color);border-color:var(--switch-checked-track-color)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb{background-color:var(--switch-unchecked-button-color);border-color:var(--switch-unchecked-button-color)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__track{background-color:var(--switch-unchecked-track-color);border-color:var(--switch-unchecked-track-color)}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        A
      );
    },
  },
]);
//# sourceMappingURL=8942.WDtldE--Do8.js.map
