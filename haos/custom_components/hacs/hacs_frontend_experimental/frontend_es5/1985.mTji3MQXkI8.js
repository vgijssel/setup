"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1985],
  {
    58417: function (e, c, o) {
      o.d(c, {
        A: function () {
          return g;
        },
      });
      var d,
        a,
        r = o(88962),
        t = o(71650),
        i = o(33368),
        n = o(68308),
        m = o(34541),
        h = o(47838),
        k = o(69205),
        b = (o(22859), o(97393), o(43204)),
        l = (o(27763), o(38103)),
        s = o(18601),
        p = o(98734),
        x = o(5095),
        u = o(95260),
        _ = o(53180),
        f = o(10694),
        g = (function (e) {
          function c() {
            var e;
            return (
              (0, t.Z)(this, c),
              ((e = (0, n.Z)(this, c, arguments)).checked = !1),
              (e.indeterminate = !1),
              (e.disabled = !1),
              (e.name = ""),
              (e.value = "on"),
              (e.reducedTouchTarget = !1),
              (e.animationClass = ""),
              (e.shouldRenderRipple = !1),
              (e.focused = !1),
              (e.mdcFoundationClass = void 0),
              (e.mdcFoundation = void 0),
              (e.rippleElement = null),
              (e.rippleHandlers = new p.A(function () {
                return (
                  (e.shouldRenderRipple = !0),
                  e.ripple.then(function (c) {
                    return (e.rippleElement = c);
                  }),
                  e.ripple
                );
              })),
              e
            );
          }
          return (
            (0, k.Z)(c, e),
            (0, i.Z)(c, [
              {
                key: "createAdapter",
                value: function () {
                  return {};
                },
              },
              {
                key: "update",
                value: function (e) {
                  var o = e.get("indeterminate"),
                    d = e.get("checked"),
                    a = e.get("disabled");
                  if (void 0 !== o || void 0 !== d || void 0 !== a) {
                    var r = this.calculateAnimationStateName(!!d, !!o, !!a),
                      t = this.calculateAnimationStateName(
                        this.checked,
                        this.indeterminate,
                        this.disabled
                      );
                    this.animationClass = "".concat(r, "-").concat(t);
                  }
                  (0, m.Z)((0, h.Z)(c.prototype), "update", this).call(this, e);
                },
              },
              {
                key: "calculateAnimationStateName",
                value: function (e, c, o) {
                  return o
                    ? "disabled"
                    : c
                    ? "indeterminate"
                    : e
                    ? "checked"
                    : "unchecked";
                },
              },
              {
                key: "renderRipple",
                value: function () {
                  return this.shouldRenderRipple
                    ? this.renderRippleTemplate()
                    : "";
                },
              },
              {
                key: "renderRippleTemplate",
                value: function () {
                  return (0, x.dy)(
                    d ||
                      (d = (0, r.Z)([
                        '<mwc-ripple .disabled="',
                        '" unbounded></mwc-ripple>',
                      ])),
                    this.disabled
                  );
                },
              },
              {
                key: "render",
                value: function () {
                  var e = this.indeterminate || this.checked,
                    c = {
                      "mdc-checkbox--disabled": this.disabled,
                      "mdc-checkbox--selected": e,
                      "mdc-checkbox--touch": !this.reducedTouchTarget,
                      "mdc-ripple-upgraded--background-focused": this.focused,
                      "mdc-checkbox--anim-checked-indeterminate":
                        "checked-indeterminate" == this.animationClass,
                      "mdc-checkbox--anim-checked-unchecked":
                        "checked-unchecked" == this.animationClass,
                      "mdc-checkbox--anim-indeterminate-checked":
                        "indeterminate-checked" == this.animationClass,
                      "mdc-checkbox--anim-indeterminate-unchecked":
                        "indeterminate-unchecked" == this.animationClass,
                      "mdc-checkbox--anim-unchecked-checked":
                        "unchecked-checked" == this.animationClass,
                      "mdc-checkbox--anim-unchecked-indeterminate":
                        "unchecked-indeterminate" == this.animationClass,
                    },
                    o = this.indeterminate ? "mixed" : void 0;
                  return (0, x.dy)(
                    a ||
                      (a = (0, r.Z)([
                        ' <div class="mdc-checkbox mdc-checkbox--upgraded ',
                        '"> <input type="checkbox" class="mdc-checkbox__native-control" name="',
                        '" aria-checked="',
                        '" aria-label="',
                        '" aria-labelledby="',
                        '" aria-describedby="',
                        '" data-indeterminate="',
                        '" ?disabled="',
                        '" .indeterminate="',
                        '" .checked="',
                        '" .value="',
                        '" @change="',
                        '" @focus="',
                        '" @blur="',
                        '" @mousedown="',
                        '" @mouseenter="',
                        '" @mouseleave="',
                        '" @touchstart="',
                        '" @touchend="',
                        '" @touchcancel="',
                        '"> <div class="mdc-checkbox__background" @animationend="',
                        '"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> ',
                        " </div>",
                      ])),
                    (0, _.$)(c),
                    (0, f.o)(this.name),
                    (0, f.o)(o),
                    (0, f.o)(this.ariaLabel),
                    (0, f.o)(this.ariaLabelledBy),
                    (0, f.o)(this.ariaDescribedBy),
                    this.indeterminate ? "true" : "false",
                    this.disabled,
                    this.indeterminate,
                    this.checked,
                    this.value,
                    this.handleChange,
                    this.handleFocus,
                    this.handleBlur,
                    this.handleRippleMouseDown,
                    this.handleRippleMouseEnter,
                    this.handleRippleMouseLeave,
                    this.handleRippleTouchStart,
                    this.handleRippleDeactivate,
                    this.handleRippleDeactivate,
                    this.resetAnimationClass,
                    this.renderRipple()
                  );
                },
              },
              {
                key: "setFormData",
                value: function (e) {
                  this.name && this.checked && e.append(this.name, this.value);
                },
              },
              {
                key: "handleFocus",
                value: function () {
                  (this.focused = !0), this.handleRippleFocus();
                },
              },
              {
                key: "handleBlur",
                value: function () {
                  (this.focused = !1), this.handleRippleBlur();
                },
              },
              {
                key: "handleRippleMouseDown",
                value: function (e) {
                  var c = this;
                  window.addEventListener("mouseup", function e() {
                    window.removeEventListener("mouseup", e),
                      c.handleRippleDeactivate();
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
              {
                key: "handleChange",
                value: function () {
                  (this.checked = this.formElement.checked),
                    (this.indeterminate = this.formElement.indeterminate);
                },
              },
              {
                key: "resetAnimationClass",
                value: function () {
                  this.animationClass = "";
                },
              },
              {
                key: "isRippleActive",
                get: function () {
                  var e;
                  return (
                    (null === (e = this.rippleElement) || void 0 === e
                      ? void 0
                      : e.isActive) || !1
                  );
                },
              },
            ]),
            c
          );
        })(s.Wg);
      (0, b.__decorate)(
        [(0, u.IO)(".mdc-checkbox")],
        g.prototype,
        "mdcRoot",
        void 0
      ),
        (0, b.__decorate)(
          [(0, u.IO)("input")],
          g.prototype,
          "formElement",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: Boolean, reflect: !0 })],
          g.prototype,
          "checked",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: Boolean })],
          g.prototype,
          "indeterminate",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: Boolean, reflect: !0 })],
          g.prototype,
          "disabled",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: String, reflect: !0 })],
          g.prototype,
          "name",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: String })],
          g.prototype,
          "value",
          void 0
        ),
        (0, b.__decorate)(
          [l.L, (0, u.Cb)({ type: String, attribute: "aria-label" })],
          g.prototype,
          "ariaLabel",
          void 0
        ),
        (0, b.__decorate)(
          [l.L, (0, u.Cb)({ type: String, attribute: "aria-labelledby" })],
          g.prototype,
          "ariaLabelledBy",
          void 0
        ),
        (0, b.__decorate)(
          [l.L, (0, u.Cb)({ type: String, attribute: "aria-describedby" })],
          g.prototype,
          "ariaDescribedBy",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.Cb)({ type: Boolean })],
          g.prototype,
          "reducedTouchTarget",
          void 0
        ),
        (0, b.__decorate)([(0, u.SB)()], g.prototype, "animationClass", void 0),
        (0, b.__decorate)(
          [(0, u.SB)()],
          g.prototype,
          "shouldRenderRipple",
          void 0
        ),
        (0, b.__decorate)([(0, u.SB)()], g.prototype, "focused", void 0),
        (0, b.__decorate)(
          [(0, u.GC)("mwc-ripple")],
          g.prototype,
          "ripple",
          void 0
        ),
        (0, b.__decorate)(
          [(0, u.hO)({ passive: !0 })],
          g.prototype,
          "handleRippleTouchStart",
          null
        );
    },
    39274: function (e, c, o) {
      o.d(c, {
        W: function () {
          return r;
        },
      });
      var d,
        a = o(88962),
        r = (0, o(5095).iv)(
          d ||
            (d = (0, a.Z)([
              '.mdc-checkbox{padding:calc((40px - 18px)/ 2);padding:calc((var(--mdc-checkbox-ripple-size,40px) - 18px)/ 2);margin:calc((40px - 40px)/ 2);margin:calc((var(--mdc-checkbox-touch-target-size,40px) - 40px)/ 2)}.mdc-checkbox .mdc-checkbox__ripple::after,.mdc-checkbox .mdc-checkbox__ripple::before{background-color:#000;background-color:var(--mdc-ripple-color,#000)}.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before,.mdc-checkbox:hover .mdc-checkbox__ripple::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity, .04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity, .12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity, .12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before{background-color:#018786;background-color:var(--mdc-ripple-color,var(--mdc-theme-secondary,#018786))}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity, .04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity, .12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity, .12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before{background-color:#018786;background-color:var(--mdc-ripple-color,var(--mdc-theme-secondary,#018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px)/ 2);top:calc((var(--mdc-checkbox-ripple-size,40px) - 18px)/ 2);left:calc((40px - 18px)/ 2);left:calc((var(--mdc-checkbox-ripple-size,40px) - 18px)/ 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px)/ 2);top:calc((40px - var(--mdc-checkbox-touch-target-size,40px))/ 2);right:calc((40px - 40px)/ 2);right:calc((40px - var(--mdc-checkbox-touch-target-size,40px))/ 2);left:calc((40px - 40px)/ 2);left:calc((40px - var(--mdc-checkbox-touch-target-size,40px))/ 2);width:40px;width:var(--mdc-checkbox-touch-target-size,40px);height:40px;height:var(--mdc-checkbox-touch-target-size,40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0,0,0,.54);border-color:var(--mdc-checkbox-unchecked-color,rgba(0,0,0,.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0,0,0,.54);border-color:var(--mdc-checkbox-unchecked-color,rgba(0,0,0,.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color,var(--mdc-theme-secondary,#018786))}100%{border-color:rgba(0,0,0,.54);border-color:var(--mdc-checkbox-unchecked-color,rgba(0,0,0,.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0,0,0,.38);border-color:var(--mdc-checkbox-disabled-color,rgba(0,0,0,.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0,0,0,.38);background-color:var(--mdc-checkbox-disabled-color,rgba(0,0,0,.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color,#fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color,#fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color,#fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color,#fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0,0,0.2,1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0,0,0,1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4,0,1,1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0,0,0.2,1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14,0,0,1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14,0,0,1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}100%,32.8%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:100%;width:100%}@media screen and (forced-colors:active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{border-color:CanvasText}}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors:active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{border-color:CanvasText}}@media all and (-ms-high-contrast:none){.mdc-checkbox .mdc-checkbox__focus-ring{display:none}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0s cubic-bezier(.4, 0, .6, 1),border-color 90ms 0s cubic-bezier(.4, 0, .6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0s cubic-bezier(.4, 0, .6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0s cubic-bezier(.4, 0, .6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0s cubic-bezier(.4, 0, .6, 1),transform 90ms 0s cubic-bezier(.4, 0, .6, 1)}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark .5s linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark .5s linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark .3s linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0s cubic-bezier(0, 0, .2, 1),background-color 90ms 0s cubic-bezier(0, 0, .2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px)/ 2);margin:calc((var(--mdc-checkbox-state-layer-size,48px) - var(--mdc-checkbox-state-layer-size,40px))/ 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px)/ 2);top:calc((var(--mdc-checkbox-state-layer-size,40px) - var(--mdc-checkbox-state-layer-size,48px))/ 2);right:calc((40px - 48px)/ 2);right:calc((var(--mdc-checkbox-state-layer-size,40px) - var(--mdc-checkbox-state-layer-size,48px))/ 2);left:calc((40px - 48px)/ 2);left:calc((var(--mdc-checkbox-state-layer-size,40px) - var(--mdc-checkbox-state-layer-size,48px))/ 2);width:48px;width:var(--mdc-checkbox-state-layer-size,48px);height:48px;height:var(--mdc-checkbox-state-layer-size,48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0s cubic-bezier(0, 0, .2, 1),transform 180ms 0s cubic-bezier(0, 0, .2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0s cubic-bezier(.4, 0, .6, 1),transform 90ms 0s cubic-bezier(.4, 0, .6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:0;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}',
            ]))
        );
    },
  },
]);
//# sourceMappingURL=1985.mTji3MQXkI8.js.map
