import {
  f as e,
  e as t,
  B as i,
  i as d,
  a3 as l,
  t as c,
  h as o,
  a4 as n,
  R as a,
  y as r,
  k as s,
  p as m,
  d as h,
  _ as p,
  n as f,
  x as u,
  z as x,
  M as b,
  P as g,
  Q as _,
  T as v,
  A as y,
  ab as k,
  U as w,
  ac as E,
  D as I,
  E as C,
  G as A,
  q as L,
  ad as T,
} from "./main-ec7846c8.js";
import { o as R } from "./c.8e28b461.js";
import {
  L as O,
  s as F,
  n as z,
  a as S,
  K as V,
  C as D,
} from "./c.eea05cf6.js";
var $, B;
const M =
  null !==
    (B = null === ($ = window.ShadyDOM) || void 0 === $ ? void 0 : $.inUse) &&
  void 0 !== B &&
  B;
class N extends i {
  constructor() {
    super(...arguments),
      (this.disabled = !1),
      (this.containingForm = null),
      (this.formDataListener = (e) => {
        this.disabled || this.setFormData(e.formData);
      });
  }
  findFormElement() {
    if (!this.shadowRoot || M) return null;
    const e = this.getRootNode().querySelectorAll("form");
    for (const t of Array.from(e)) if (t.contains(this)) return t;
    return null;
  }
  connectedCallback() {
    var e;
    super.connectedCallback(),
      (this.containingForm = this.findFormElement()),
      null === (e = this.containingForm) ||
        void 0 === e ||
        e.addEventListener("formdata", this.formDataListener);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(),
      null === (e = this.containingForm) ||
        void 0 === e ||
        e.removeEventListener("formdata", this.formDataListener),
      (this.containingForm = null);
  }
  click() {
    this.formElement &&
      !this.disabled &&
      (this.formElement.focus(), this.formElement.click());
  }
  firstUpdated() {
    super.firstUpdated(),
      this.shadowRoot &&
        this.mdcRoot.addEventListener("change", (e) => {
          this.dispatchEvent(new Event("change", e));
        });
  }
}
(N.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
  e([t({ type: Boolean })], N.prototype, "disabled", void 0);
class P extends N {
  constructor() {
    super(...arguments),
      (this.checked = !1),
      (this.indeterminate = !1),
      (this.disabled = !1),
      (this.name = ""),
      (this.value = "on"),
      (this.reducedTouchTarget = !1),
      (this.animationClass = ""),
      (this.shouldRenderRipple = !1),
      (this.focused = !1),
      (this.mdcFoundationClass = void 0),
      (this.mdcFoundation = void 0),
      (this.rippleElement = null),
      (this.rippleHandlers = new a(
        () => (
          (this.shouldRenderRipple = !0),
          this.ripple.then((e) => (this.rippleElement = e)),
          this.ripple
        )
      ));
  }
  createAdapter() {
    return {};
  }
  update(e) {
    const t = e.get("indeterminate"),
      i = e.get("checked"),
      d = e.get("disabled");
    if (void 0 !== t || void 0 !== i || void 0 !== d) {
      const e = this.calculateAnimationStateName(!!i, !!t, !!d),
        l = this.calculateAnimationStateName(
          this.checked,
          this.indeterminate,
          this.disabled
        );
      this.animationClass = `${e}-${l}`;
    }
    super.update(e);
  }
  calculateAnimationStateName(e, t, i) {
    return i ? "disabled" : t ? "indeterminate" : e ? "checked" : "unchecked";
  }
  renderRipple() {
    return this.shouldRenderRipple ? this.renderRippleTemplate() : "";
  }
  renderRippleTemplate() {
    return r`<mwc-ripple
        .disabled="${this.disabled}"
        unbounded></mwc-ripple>`;
  }
  render() {
    const e = this.indeterminate || this.checked,
      t = {
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
      i = this.indeterminate ? "mixed" : void 0;
    return r`
      <div class="mdc-checkbox mdc-checkbox--upgraded ${s(t)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              name="${m(this.name)}"
              aria-checked="${m(i)}"
              aria-label="${m(this.ariaLabel)}"
              aria-labelledby="${m(this.ariaLabelledBy)}"
              aria-describedby="${m(this.ariaDescribedBy)}"
              data-indeterminate="${this.indeterminate ? "true" : "false"}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this.handleChange}"
              @focus="${this.handleFocus}"
              @blur="${this.handleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
        <div class="mdc-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
  }
  setFormData(e) {
    this.name && this.checked && e.append(this.name, this.value);
  }
  handleFocus() {
    (this.focused = !0), this.handleRippleFocus();
  }
  handleBlur() {
    (this.focused = !1), this.handleRippleBlur();
  }
  handleRippleMouseDown(e) {
    const t = () => {
      window.removeEventListener("mouseup", t), this.handleRippleDeactivate();
    };
    window.addEventListener("mouseup", t), this.rippleHandlers.startPress(e);
  }
  handleRippleTouchStart(e) {
    this.rippleHandlers.startPress(e);
  }
  handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }
  handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }
  handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }
  handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }
  handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
  handleChange() {
    (this.checked = this.formElement.checked),
      (this.indeterminate = this.formElement.indeterminate);
  }
  resetAnimationClass() {
    this.animationClass = "";
  }
  get isRippleActive() {
    var e;
    return (
      (null === (e = this.rippleElement) || void 0 === e
        ? void 0
        : e.isActive) || !1
    );
  }
}
e([d(".mdc-checkbox")], P.prototype, "mdcRoot", void 0),
  e([d("input")], P.prototype, "formElement", void 0),
  e([t({ type: Boolean, reflect: !0 })], P.prototype, "checked", void 0),
  e([t({ type: Boolean })], P.prototype, "indeterminate", void 0),
  e([t({ type: Boolean, reflect: !0 })], P.prototype, "disabled", void 0),
  e([t({ type: String, reflect: !0 })], P.prototype, "name", void 0),
  e([t({ type: String })], P.prototype, "value", void 0),
  e(
    [l, t({ type: String, attribute: "aria-label" })],
    P.prototype,
    "ariaLabel",
    void 0
  ),
  e(
    [l, t({ type: String, attribute: "aria-labelledby" })],
    P.prototype,
    "ariaLabelledBy",
    void 0
  ),
  e(
    [l, t({ type: String, attribute: "aria-describedby" })],
    P.prototype,
    "ariaDescribedBy",
    void 0
  ),
  e([t({ type: Boolean })], P.prototype, "reducedTouchTarget", void 0),
  e([c()], P.prototype, "animationClass", void 0),
  e([c()], P.prototype, "shouldRenderRipple", void 0),
  e([c()], P.prototype, "focused", void 0),
  e([o("mwc-ripple")], P.prototype, "ripple", void 0),
  e([n({ passive: !0 })], P.prototype, "handleRippleTouchStart", null);
const H = h`.mdc-checkbox{padding:calc((40px - 18px) / 2);padding:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);margin:calc((40px - 40px) / 2);margin:calc((var(--mdc-checkbox-touch-target-size, 40px) - 40px) / 2)}.mdc-checkbox .mdc-checkbox__ripple::before,.mdc-checkbox .mdc-checkbox__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-checkbox:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px) / 2);top:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);left:calc((40px - 18px) / 2);left:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px) / 2);top:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);right:calc((40px - 40px) / 2);right:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);left:calc((40px - 40px) / 2);left:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);width:40px;width:var(--mdc-checkbox-touch-target-size, 40px);height:40px;height:var(--mdc-checkbox-touch-target-size, 40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}100%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.38);border-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0, 0, 0, 0.38);background-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:GrayText;border-color:var(--mdc-checkbox-disabled-color, GrayText);background-color:transparent}.mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:GrayText;background-color:transparent;background-color:var(--mdc-checkbox-disabled-color, transparent)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:GrayText;color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:GrayText;border-color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size, 48px) - var(--mdc-checkbox-state-layer-size, 40px)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px) / 2);top:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);right:calc((40px - 48px) / 2);right:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);left:calc((40px - 48px) / 2);left:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);width:48px;width:var(--mdc-checkbox-state-layer-size, 48px);height:48px;height:var(--mdc-checkbox-state-layer-size, 48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:none;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}`;
p(
  [f("ha-checkbox")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            H,
            h`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  P
);
var U = { NOTCH_ELEMENT_SELECTOR: ".mdc-notched-outline__notch" },
  Y = { NOTCH_ELEMENT_PADDING: 8 },
  X = {
    NO_LABEL: "mdc-notched-outline--no-label",
    OUTLINE_NOTCHED: "mdc-notched-outline--notched",
    OUTLINE_UPGRADED: "mdc-notched-outline--upgraded",
  },
  W = (function (e) {
    function t(i) {
      return e.call(this, x(x({}, t.defaultAdapter), i)) || this;
    }
    return (
      u(t, e),
      Object.defineProperty(t, "strings", {
        get: function () {
          return U;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return X;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "numbers", {
        get: function () {
          return Y;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            setNotchWidthProperty: function () {},
            removeNotchWidthProperty: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.notch = function (e) {
        var i = t.cssClasses.OUTLINE_NOTCHED;
        e > 0 && (e += Y.NOTCH_ELEMENT_PADDING),
          this.adapter.setNotchWidthProperty(e),
          this.adapter.addClass(i);
      }),
      (t.prototype.closeNotch = function () {
        var e = t.cssClasses.OUTLINE_NOTCHED;
        this.adapter.removeClass(e), this.adapter.removeNotchWidthProperty();
      }),
      t
    );
  })(b);
class q extends i {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = W),
      (this.width = 0),
      (this.open = !1),
      (this.lastOpen = this.open);
  }
  createAdapter() {
    return {
      addClass: (e) => this.mdcRoot.classList.add(e),
      removeClass: (e) => this.mdcRoot.classList.remove(e),
      setNotchWidthProperty: (e) =>
        this.notchElement.style.setProperty("width", `${e}px`),
      removeNotchWidthProperty: () =>
        this.notchElement.style.removeProperty("width"),
    };
  }
  openOrClose(e, t) {
    this.mdcFoundation &&
      (e && void 0 !== t
        ? this.mdcFoundation.notch(t)
        : this.mdcFoundation.closeNotch());
  }
  render() {
    this.openOrClose(this.open, this.width);
    const e = s({ "mdc-notched-outline--notched": this.open });
    return r`
      <span class="mdc-notched-outline ${e}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
  }
}
e([d(".mdc-notched-outline")], q.prototype, "mdcRoot", void 0),
  e([t({ type: Number })], q.prototype, "width", void 0),
  e([t({ type: Boolean, reflect: !0 })], q.prototype, "open", void 0),
  e([d(".mdc-notched-outline__notch")], q.prototype, "notchElement", void 0);
const G = h`.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] :host,:host([dir=rtl]){text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / 0.75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading,.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color, var(--mdc-theme-primary, #6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width, 1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset, 0)}`;
let j = class extends q {};
(j.styles = [G]), (j = e([f("mwc-notched-outline")], j));
var K = {
    LABEL_FLOAT_ABOVE: "mdc-floating-label--float-above",
    LABEL_REQUIRED: "mdc-floating-label--required",
    LABEL_SHAKE: "mdc-floating-label--shake",
    ROOT: "mdc-floating-label",
  },
  Q = (function (e) {
    function t(i) {
      var d = e.call(this, x(x({}, t.defaultAdapter), i)) || this;
      return (
        (d.shakeAnimationEndHandler = function () {
          d.handleShakeAnimationEnd();
        }),
        d
      );
    }
    return (
      u(t, e),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return K;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            getWidth: function () {
              return 0;
            },
            registerInteractionHandler: function () {},
            deregisterInteractionHandler: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.init = function () {
        this.adapter.registerInteractionHandler(
          "animationend",
          this.shakeAnimationEndHandler
        );
      }),
      (t.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler(
          "animationend",
          this.shakeAnimationEndHandler
        );
      }),
      (t.prototype.getWidth = function () {
        return this.adapter.getWidth();
      }),
      (t.prototype.shake = function (e) {
        var i = t.cssClasses.LABEL_SHAKE;
        e ? this.adapter.addClass(i) : this.adapter.removeClass(i);
      }),
      (t.prototype.float = function (e) {
        var i = t.cssClasses,
          d = i.LABEL_FLOAT_ABOVE,
          l = i.LABEL_SHAKE;
        e
          ? this.adapter.addClass(d)
          : (this.adapter.removeClass(d), this.adapter.removeClass(l));
      }),
      (t.prototype.setRequired = function (e) {
        var i = t.cssClasses.LABEL_REQUIRED;
        e ? this.adapter.addClass(i) : this.adapter.removeClass(i);
      }),
      (t.prototype.handleShakeAnimationEnd = function () {
        var e = t.cssClasses.LABEL_SHAKE;
        this.adapter.removeClass(e);
      }),
      t
    );
  })(b);
const J = g(
  class extends _ {
    constructor(e) {
      switch (
        (super(e), (this.foundation = null), (this.previousPart = null), e.type)
      ) {
        case v.ATTRIBUTE:
        case v.PROPERTY:
          break;
        default:
          throw new Error(
            "FloatingLabel directive only support attribute and property parts"
          );
      }
    }
    update(e, [t]) {
      if (e !== this.previousPart) {
        this.foundation && this.foundation.destroy(), (this.previousPart = e);
        const t = e.element;
        t.classList.add("mdc-floating-label");
        const i = ((e) => ({
          addClass: (t) => e.classList.add(t),
          removeClass: (t) => e.classList.remove(t),
          getWidth: () => e.scrollWidth,
          registerInteractionHandler: (t, i) => {
            e.addEventListener(t, i);
          },
          deregisterInteractionHandler: (t, i) => {
            e.removeEventListener(t, i);
          },
        }))(t);
        (this.foundation = new Q(i)), this.foundation.init();
      }
      return this.render(t);
    }
    render(e) {
      return this.foundation;
    }
  }
);
var Z = {
    LINE_RIPPLE_ACTIVE: "mdc-line-ripple--active",
    LINE_RIPPLE_DEACTIVATING: "mdc-line-ripple--deactivating",
  },
  ee = (function (e) {
    function t(i) {
      var d = e.call(this, x(x({}, t.defaultAdapter), i)) || this;
      return (
        (d.transitionEndHandler = function (e) {
          d.handleTransitionEnd(e);
        }),
        d
      );
    }
    return (
      u(t, e),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return Z;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            hasClass: function () {
              return !1;
            },
            setStyle: function () {},
            registerEventHandler: function () {},
            deregisterEventHandler: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.init = function () {
        this.adapter.registerEventHandler(
          "transitionend",
          this.transitionEndHandler
        );
      }),
      (t.prototype.destroy = function () {
        this.adapter.deregisterEventHandler(
          "transitionend",
          this.transitionEndHandler
        );
      }),
      (t.prototype.activate = function () {
        this.adapter.removeClass(Z.LINE_RIPPLE_DEACTIVATING),
          this.adapter.addClass(Z.LINE_RIPPLE_ACTIVE);
      }),
      (t.prototype.setRippleCenter = function (e) {
        this.adapter.setStyle("transform-origin", e + "px center");
      }),
      (t.prototype.deactivate = function () {
        this.adapter.addClass(Z.LINE_RIPPLE_DEACTIVATING);
      }),
      (t.prototype.handleTransitionEnd = function (e) {
        var t = this.adapter.hasClass(Z.LINE_RIPPLE_DEACTIVATING);
        "opacity" === e.propertyName &&
          t &&
          (this.adapter.removeClass(Z.LINE_RIPPLE_ACTIVE),
          this.adapter.removeClass(Z.LINE_RIPPLE_DEACTIVATING));
      }),
      t
    );
  })(b);
const te = g(
  class extends _ {
    constructor(e) {
      switch (
        (super(e), (this.previousPart = null), (this.foundation = null), e.type)
      ) {
        case v.ATTRIBUTE:
        case v.PROPERTY:
          return;
        default:
          throw new Error(
            "LineRipple only support attribute and property parts."
          );
      }
    }
    update(e, t) {
      if (this.previousPart !== e) {
        this.foundation && this.foundation.destroy(), (this.previousPart = e);
        const t = e.element;
        t.classList.add("mdc-line-ripple");
        const i = ((e) => ({
          addClass: (t) => e.classList.add(t),
          removeClass: (t) => e.classList.remove(t),
          hasClass: (t) => e.classList.contains(t),
          setStyle: (t, i) => e.style.setProperty(t, i),
          registerEventHandler: (t, i) => {
            e.addEventListener(t, i);
          },
          deregisterEventHandler: (t, i) => {
            e.removeEventListener(t, i);
          },
        }))(t);
        (this.foundation = new ee(i)), this.foundation.init();
      }
      return this.render();
    }
    render() {
      return this.foundation;
    }
  }
);
var ie = {
    ARIA_CONTROLS: "aria-controls",
    ARIA_DESCRIBEDBY: "aria-describedby",
    INPUT_SELECTOR: ".mdc-text-field__input",
    LABEL_SELECTOR: ".mdc-floating-label",
    LEADING_ICON_SELECTOR: ".mdc-text-field__icon--leading",
    LINE_RIPPLE_SELECTOR: ".mdc-line-ripple",
    OUTLINE_SELECTOR: ".mdc-notched-outline",
    PREFIX_SELECTOR: ".mdc-text-field__affix--prefix",
    SUFFIX_SELECTOR: ".mdc-text-field__affix--suffix",
    TRAILING_ICON_SELECTOR: ".mdc-text-field__icon--trailing",
  },
  de = {
    DISABLED: "mdc-text-field--disabled",
    FOCUSED: "mdc-text-field--focused",
    HELPER_LINE: "mdc-text-field-helper-line",
    INVALID: "mdc-text-field--invalid",
    LABEL_FLOATING: "mdc-text-field--label-floating",
    NO_LABEL: "mdc-text-field--no-label",
    OUTLINED: "mdc-text-field--outlined",
    ROOT: "mdc-text-field",
    TEXTAREA: "mdc-text-field--textarea",
    WITH_LEADING_ICON: "mdc-text-field--with-leading-icon",
    WITH_TRAILING_ICON: "mdc-text-field--with-trailing-icon",
    WITH_INTERNAL_COUNTER: "mdc-text-field--with-internal-counter",
  },
  le = { LABEL_SCALE: 0.75 },
  ce = ["pattern", "min", "max", "required", "step", "minlength", "maxlength"],
  oe = ["color", "date", "datetime-local", "month", "range", "time", "week"],
  ne = ["mousedown", "touchstart"],
  ae = ["click", "keydown"],
  re = (function (e) {
    function t(i, d) {
      void 0 === d && (d = {});
      var l = e.call(this, x(x({}, t.defaultAdapter), i)) || this;
      return (
        (l.isFocused = !1),
        (l.receivedUserInput = !1),
        (l.valid = !0),
        (l.useNativeValidation = !0),
        (l.validateOnValueChange = !0),
        (l.helperText = d.helperText),
        (l.characterCounter = d.characterCounter),
        (l.leadingIcon = d.leadingIcon),
        (l.trailingIcon = d.trailingIcon),
        (l.inputFocusHandler = function () {
          l.activateFocus();
        }),
        (l.inputBlurHandler = function () {
          l.deactivateFocus();
        }),
        (l.inputInputHandler = function () {
          l.handleInput();
        }),
        (l.setPointerXOffset = function (e) {
          l.setTransformOrigin(e);
        }),
        (l.textFieldInteractionHandler = function () {
          l.handleTextFieldInteraction();
        }),
        (l.validationAttributeChangeHandler = function (e) {
          l.handleValidationAttributeChange(e);
        }),
        l
      );
    }
    return (
      u(t, e),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return de;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "strings", {
        get: function () {
          return ie;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "numbers", {
        get: function () {
          return le;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "shouldAlwaysFloat", {
        get: function () {
          var e = this.getNativeInput().type;
          return oe.indexOf(e) >= 0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "shouldFloat", {
        get: function () {
          return (
            this.shouldAlwaysFloat ||
            this.isFocused ||
            !!this.getValue() ||
            this.isBadInput()
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "shouldShake", {
        get: function () {
          return !this.isFocused && !this.isValid() && !!this.getValue();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            hasClass: function () {
              return !0;
            },
            setInputAttr: function () {},
            removeInputAttr: function () {},
            registerTextFieldInteractionHandler: function () {},
            deregisterTextFieldInteractionHandler: function () {},
            registerInputInteractionHandler: function () {},
            deregisterInputInteractionHandler: function () {},
            registerValidationAttributeChangeHandler: function () {
              return new MutationObserver(function () {});
            },
            deregisterValidationAttributeChangeHandler: function () {},
            getNativeInput: function () {
              return null;
            },
            isFocused: function () {
              return !1;
            },
            activateLineRipple: function () {},
            deactivateLineRipple: function () {},
            setLineRippleTransformOrigin: function () {},
            shakeLabel: function () {},
            floatLabel: function () {},
            setLabelRequired: function () {},
            hasLabel: function () {
              return !1;
            },
            getLabelWidth: function () {
              return 0;
            },
            hasOutline: function () {
              return !1;
            },
            notchOutline: function () {},
            closeOutline: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.init = function () {
        var e, t, i, d;
        this.adapter.hasLabel() &&
          this.getNativeInput().required &&
          this.adapter.setLabelRequired(!0),
          this.adapter.isFocused()
            ? this.inputFocusHandler()
            : this.adapter.hasLabel() &&
              this.shouldFloat &&
              (this.notchOutline(!0),
              this.adapter.floatLabel(!0),
              this.styleFloating(!0)),
          this.adapter.registerInputInteractionHandler(
            "focus",
            this.inputFocusHandler
          ),
          this.adapter.registerInputInteractionHandler(
            "blur",
            this.inputBlurHandler
          ),
          this.adapter.registerInputInteractionHandler(
            "input",
            this.inputInputHandler
          );
        try {
          for (var l = y(ne), c = l.next(); !c.done; c = l.next()) {
            var o = c.value;
            this.adapter.registerInputInteractionHandler(
              o,
              this.setPointerXOffset
            );
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            c && !c.done && (t = l.return) && t.call(l);
          } finally {
            if (e) throw e.error;
          }
        }
        try {
          for (var n = y(ae), a = n.next(); !a.done; a = n.next()) {
            o = a.value;
            this.adapter.registerTextFieldInteractionHandler(
              o,
              this.textFieldInteractionHandler
            );
          }
        } catch (e) {
          i = { error: e };
        } finally {
          try {
            a && !a.done && (d = n.return) && d.call(n);
          } finally {
            if (i) throw i.error;
          }
        }
        (this.validationObserver =
          this.adapter.registerValidationAttributeChangeHandler(
            this.validationAttributeChangeHandler
          )),
          this.setcharacterCounter(this.getValue().length);
      }),
      (t.prototype.destroy = function () {
        var e, t, i, d;
        this.adapter.deregisterInputInteractionHandler(
          "focus",
          this.inputFocusHandler
        ),
          this.adapter.deregisterInputInteractionHandler(
            "blur",
            this.inputBlurHandler
          ),
          this.adapter.deregisterInputInteractionHandler(
            "input",
            this.inputInputHandler
          );
        try {
          for (var l = y(ne), c = l.next(); !c.done; c = l.next()) {
            var o = c.value;
            this.adapter.deregisterInputInteractionHandler(
              o,
              this.setPointerXOffset
            );
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            c && !c.done && (t = l.return) && t.call(l);
          } finally {
            if (e) throw e.error;
          }
        }
        try {
          for (var n = y(ae), a = n.next(); !a.done; a = n.next()) {
            o = a.value;
            this.adapter.deregisterTextFieldInteractionHandler(
              o,
              this.textFieldInteractionHandler
            );
          }
        } catch (e) {
          i = { error: e };
        } finally {
          try {
            a && !a.done && (d = n.return) && d.call(n);
          } finally {
            if (i) throw i.error;
          }
        }
        this.adapter.deregisterValidationAttributeChangeHandler(
          this.validationObserver
        );
      }),
      (t.prototype.handleTextFieldInteraction = function () {
        var e = this.adapter.getNativeInput();
        (e && e.disabled) || (this.receivedUserInput = !0);
      }),
      (t.prototype.handleValidationAttributeChange = function (e) {
        var t = this;
        e.some(function (e) {
          return (
            ce.indexOf(e) > -1 &&
            (t.styleValidity(!0),
            t.adapter.setLabelRequired(t.getNativeInput().required),
            !0)
          );
        }),
          e.indexOf("maxlength") > -1 &&
            this.setcharacterCounter(this.getValue().length);
      }),
      (t.prototype.notchOutline = function (e) {
        if (this.adapter.hasOutline() && this.adapter.hasLabel())
          if (e) {
            var t = this.adapter.getLabelWidth() * le.LABEL_SCALE;
            this.adapter.notchOutline(t);
          } else this.adapter.closeOutline();
      }),
      (t.prototype.activateFocus = function () {
        (this.isFocused = !0),
          this.styleFocused(this.isFocused),
          this.adapter.activateLineRipple(),
          this.adapter.hasLabel() &&
            (this.notchOutline(this.shouldFloat),
            this.adapter.floatLabel(this.shouldFloat),
            this.styleFloating(this.shouldFloat),
            this.adapter.shakeLabel(this.shouldShake)),
          !this.helperText ||
            (!this.helperText.isPersistent() &&
              this.helperText.isValidation() &&
              this.valid) ||
            this.helperText.showToScreenReader();
      }),
      (t.prototype.setTransformOrigin = function (e) {
        if (!this.isDisabled() && !this.adapter.hasOutline()) {
          var t = e.touches,
            i = t ? t[0] : e,
            d = i.target.getBoundingClientRect(),
            l = i.clientX - d.left;
          this.adapter.setLineRippleTransformOrigin(l);
        }
      }),
      (t.prototype.handleInput = function () {
        this.autoCompleteFocus(),
          this.setcharacterCounter(this.getValue().length);
      }),
      (t.prototype.autoCompleteFocus = function () {
        this.receivedUserInput || this.activateFocus();
      }),
      (t.prototype.deactivateFocus = function () {
        (this.isFocused = !1), this.adapter.deactivateLineRipple();
        var e = this.isValid();
        this.styleValidity(e),
          this.styleFocused(this.isFocused),
          this.adapter.hasLabel() &&
            (this.notchOutline(this.shouldFloat),
            this.adapter.floatLabel(this.shouldFloat),
            this.styleFloating(this.shouldFloat),
            this.adapter.shakeLabel(this.shouldShake)),
          this.shouldFloat || (this.receivedUserInput = !1);
      }),
      (t.prototype.getValue = function () {
        return this.getNativeInput().value;
      }),
      (t.prototype.setValue = function (e) {
        if (
          (this.getValue() !== e && (this.getNativeInput().value = e),
          this.setcharacterCounter(e.length),
          this.validateOnValueChange)
        ) {
          var t = this.isValid();
          this.styleValidity(t);
        }
        this.adapter.hasLabel() &&
          (this.notchOutline(this.shouldFloat),
          this.adapter.floatLabel(this.shouldFloat),
          this.styleFloating(this.shouldFloat),
          this.validateOnValueChange &&
            this.adapter.shakeLabel(this.shouldShake));
      }),
      (t.prototype.isValid = function () {
        return this.useNativeValidation
          ? this.isNativeInputValid()
          : this.valid;
      }),
      (t.prototype.setValid = function (e) {
        (this.valid = e), this.styleValidity(e);
        var t = !e && !this.isFocused && !!this.getValue();
        this.adapter.hasLabel() && this.adapter.shakeLabel(t);
      }),
      (t.prototype.setValidateOnValueChange = function (e) {
        this.validateOnValueChange = e;
      }),
      (t.prototype.getValidateOnValueChange = function () {
        return this.validateOnValueChange;
      }),
      (t.prototype.setUseNativeValidation = function (e) {
        this.useNativeValidation = e;
      }),
      (t.prototype.isDisabled = function () {
        return this.getNativeInput().disabled;
      }),
      (t.prototype.setDisabled = function (e) {
        (this.getNativeInput().disabled = e), this.styleDisabled(e);
      }),
      (t.prototype.setHelperTextContent = function (e) {
        this.helperText && this.helperText.setContent(e);
      }),
      (t.prototype.setLeadingIconAriaLabel = function (e) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(e);
      }),
      (t.prototype.setLeadingIconContent = function (e) {
        this.leadingIcon && this.leadingIcon.setContent(e);
      }),
      (t.prototype.setTrailingIconAriaLabel = function (e) {
        this.trailingIcon && this.trailingIcon.setAriaLabel(e);
      }),
      (t.prototype.setTrailingIconContent = function (e) {
        this.trailingIcon && this.trailingIcon.setContent(e);
      }),
      (t.prototype.setcharacterCounter = function (e) {
        if (this.characterCounter) {
          var t = this.getNativeInput().maxLength;
          if (-1 === t)
            throw new Error(
              "MDCTextFieldFoundation: Expected maxlength html property on text input or textarea."
            );
          this.characterCounter.setCounterValue(e, t);
        }
      }),
      (t.prototype.isBadInput = function () {
        return this.getNativeInput().validity.badInput || !1;
      }),
      (t.prototype.isNativeInputValid = function () {
        return this.getNativeInput().validity.valid;
      }),
      (t.prototype.styleValidity = function (e) {
        var i = t.cssClasses.INVALID;
        if (
          (e ? this.adapter.removeClass(i) : this.adapter.addClass(i),
          this.helperText)
        ) {
          if ((this.helperText.setValidity(e), !this.helperText.isValidation()))
            return;
          var d = this.helperText.isVisible(),
            l = this.helperText.getId();
          d && l
            ? this.adapter.setInputAttr(ie.ARIA_DESCRIBEDBY, l)
            : this.adapter.removeInputAttr(ie.ARIA_DESCRIBEDBY);
        }
      }),
      (t.prototype.styleFocused = function (e) {
        var i = t.cssClasses.FOCUSED;
        e ? this.adapter.addClass(i) : this.adapter.removeClass(i);
      }),
      (t.prototype.styleDisabled = function (e) {
        var i = t.cssClasses,
          d = i.DISABLED,
          l = i.INVALID;
        e
          ? (this.adapter.addClass(d), this.adapter.removeClass(l))
          : this.adapter.removeClass(d),
          this.leadingIcon && this.leadingIcon.setDisabled(e),
          this.trailingIcon && this.trailingIcon.setDisabled(e);
      }),
      (t.prototype.styleFloating = function (e) {
        var i = t.cssClasses.LABEL_FLOATING;
        e ? this.adapter.addClass(i) : this.adapter.removeClass(i);
      }),
      (t.prototype.getNativeInput = function () {
        return (
          (this.adapter ? this.adapter.getNativeInput() : null) || {
            disabled: !1,
            maxLength: -1,
            required: !1,
            type: "input",
            validity: { badInput: !1, valid: !0 },
            value: "",
          }
        );
      }),
      t
    );
  })(b),
  se = re;
const { I: me } = k,
  he = (e) => null === e || ("object" != typeof e && "function" != typeof e),
  pe = (e, t) =>
    void 0 === t
      ? void 0 !== (null == e ? void 0 : e._$litType$)
      : (null == e ? void 0 : e._$litType$) === t,
  fe = (e) => void 0 === e.strings,
  ue = () => document.createComment(""),
  xe = (e, t, i) => {
    var d;
    const l = e._$AA.parentNode,
      c = void 0 === t ? e._$AB : t._$AA;
    if (void 0 === i) {
      const t = l.insertBefore(ue(), c),
        d = l.insertBefore(ue(), c);
      i = new me(t, d, e, e.options);
    } else {
      const t = i._$AB.nextSibling,
        o = i._$AM,
        n = o !== e;
      if (n) {
        let t;
        null === (d = i._$AQ) || void 0 === d || d.call(i, e),
          (i._$AM = e),
          void 0 !== i._$AP && (t = e._$AU) !== o._$AU && i._$AP(t);
      }
      if (t !== c || n) {
        let e = i._$AA;
        for (; e !== t; ) {
          const t = e.nextSibling;
          l.insertBefore(e, c), (e = t);
        }
      }
    }
    return i;
  },
  be = (e, t, i = e) => (e._$AI(t, i), e),
  ge = {},
  _e = (e, t = ge) => (e._$AH = t),
  ve = (e) => e._$AH,
  ye = (e) => {
    var t;
    null === (t = e._$AP) || void 0 === t || t.call(e, !1, !0);
    let i = e._$AA;
    const d = e._$AB.nextSibling;
    for (; i !== d; ) {
      const e = i.nextSibling;
      i.remove(), (i = e);
    }
  },
  ke = (e) => {
    e._$AR();
  },
  we = g(
    class extends _ {
      constructor(e) {
        if (
          (super(e),
          e.type !== v.PROPERTY &&
            e.type !== v.ATTRIBUTE &&
            e.type !== v.BOOLEAN_ATTRIBUTE)
        )
          throw Error(
            "The `live` directive is not allowed on child or event bindings"
          );
        if (!fe(e))
          throw Error("`live` bindings can only contain a single expression");
      }
      render(e) {
        return e;
      }
      update(e, [t]) {
        if (t === w || t === E) return t;
        const i = e.element,
          d = e.name;
        if (e.type === v.PROPERTY) {
          if (t === i[d]) return w;
        } else if (e.type === v.BOOLEAN_ATTRIBUTE) {
          if (!!t === i.hasAttribute(d)) return w;
        } else if (e.type === v.ATTRIBUTE && i.getAttribute(d) === t + "")
          return w;
        return _e(e), t;
      }
    }
  ),
  Ee = ["touchstart", "touchmove", "scroll", "mousewheel"],
  Ie = (e = {}) => {
    const t = {};
    for (const i in e) t[i] = e[i];
    return Object.assign(
      {
        badInput: !1,
        customError: !1,
        patternMismatch: !1,
        rangeOverflow: !1,
        rangeUnderflow: !1,
        stepMismatch: !1,
        tooLong: !1,
        tooShort: !1,
        typeMismatch: !1,
        valid: !0,
        valueMissing: !1,
      },
      t
    );
  };
class Ce extends N {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = se),
      (this.value = ""),
      (this.type = "text"),
      (this.placeholder = ""),
      (this.label = ""),
      (this.icon = ""),
      (this.iconTrailing = ""),
      (this.disabled = !1),
      (this.required = !1),
      (this.minLength = -1),
      (this.maxLength = -1),
      (this.outlined = !1),
      (this.helper = ""),
      (this.validateOnInitialRender = !1),
      (this.validationMessage = ""),
      (this.autoValidate = !1),
      (this.pattern = ""),
      (this.min = ""),
      (this.max = ""),
      (this.step = null),
      (this.size = null),
      (this.helperPersistent = !1),
      (this.charCounter = !1),
      (this.endAligned = !1),
      (this.prefix = ""),
      (this.suffix = ""),
      (this.name = ""),
      (this.readOnly = !1),
      (this.autocapitalize = ""),
      (this.outlineOpen = !1),
      (this.outlineWidth = 0),
      (this.isUiValid = !0),
      (this.focused = !1),
      (this._validity = Ie()),
      (this.validityTransform = null);
  }
  get validity() {
    return this._checkValidity(this.value), this._validity;
  }
  get willValidate() {
    return this.formElement.willValidate;
  }
  get selectionStart() {
    return this.formElement.selectionStart;
  }
  get selectionEnd() {
    return this.formElement.selectionEnd;
  }
  focus() {
    const e = new CustomEvent("focus");
    this.formElement.dispatchEvent(e), this.formElement.focus();
  }
  blur() {
    const e = new CustomEvent("blur");
    this.formElement.dispatchEvent(e), this.formElement.blur();
  }
  select() {
    this.formElement.select();
  }
  setSelectionRange(e, t, i) {
    this.formElement.setSelectionRange(e, t, i);
  }
  update(e) {
    e.has("autoValidate") &&
      this.mdcFoundation &&
      this.mdcFoundation.setValidateOnValueChange(this.autoValidate),
      e.has("value") &&
        "string" != typeof this.value &&
        (this.value = `${this.value}`),
      super.update(e);
  }
  setFormData(e) {
    this.name && e.append(this.name, this.value);
  }
  render() {
    const e = this.charCounter && -1 !== this.maxLength,
      t = !!this.helper || !!this.validationMessage || e,
      i = {
        "mdc-text-field--disabled": this.disabled,
        "mdc-text-field--no-label": !this.label,
        "mdc-text-field--filled": !this.outlined,
        "mdc-text-field--outlined": this.outlined,
        "mdc-text-field--with-leading-icon": this.icon,
        "mdc-text-field--with-trailing-icon": this.iconTrailing,
        "mdc-text-field--end-aligned": this.endAligned,
      };
    return r`
      <label class="mdc-text-field ${s(i)}">
        ${this.renderRipple()}
        ${this.outlined ? this.renderOutline() : this.renderLabel()}
        ${this.renderLeadingIcon()}
        ${this.renderPrefix()}
        ${this.renderInput(t)}
        ${this.renderSuffix()}
        ${this.renderTrailingIcon()}
        ${this.renderLineRipple()}
      </label>
      ${this.renderHelperText(t, e)}
    `;
  }
  updated(e) {
    e.has("value") &&
      void 0 !== e.get("value") &&
      (this.mdcFoundation.setValue(this.value),
      this.autoValidate && this.reportValidity());
  }
  renderRipple() {
    return this.outlined
      ? ""
      : r`
      <span class="mdc-text-field__ripple"></span>
    `;
  }
  renderOutline() {
    return this.outlined
      ? r`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`
      : "";
  }
  renderLabel() {
    return this.label
      ? r`
      <span
          .floatingLabelFoundation=${J(this.label)}
          id="label">${this.label}</span>
    `
      : "";
  }
  renderLeadingIcon() {
    return this.icon ? this.renderIcon(this.icon) : "";
  }
  renderTrailingIcon() {
    return this.iconTrailing ? this.renderIcon(this.iconTrailing, !0) : "";
  }
  renderIcon(e, t = !1) {
    return r`<i class="material-icons mdc-text-field__icon ${s({
      "mdc-text-field__icon--leading": !t,
      "mdc-text-field__icon--trailing": t,
    })}">${e}</i>`;
  }
  renderPrefix() {
    return this.prefix ? this.renderAffix(this.prefix) : "";
  }
  renderSuffix() {
    return this.suffix ? this.renderAffix(this.suffix, !0) : "";
  }
  renderAffix(e, t = !1) {
    return r`<span class="mdc-text-field__affix ${s({
      "mdc-text-field__affix--prefix": !t,
      "mdc-text-field__affix--suffix": t,
    })}">
        ${e}</span>`;
  }
  renderInput(e) {
    const t = -1 === this.minLength ? void 0 : this.minLength,
      i = -1 === this.maxLength ? void 0 : this.maxLength,
      d = this.autocapitalize ? this.autocapitalize : void 0,
      l = this.validationMessage && !this.isUiValid,
      c = this.label ? "label" : void 0,
      o = e ? "helper-text" : void 0,
      n = this.focused || this.helperPersistent || l ? "helper-text" : void 0;
    return r`
      <input
          aria-labelledby=${m(c)}
          aria-controls="${m(o)}"
          aria-describedby="${m(n)}"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${we(this.value)}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${m(t)}"
          maxlength="${m(i)}"
          pattern="${m(this.pattern ? this.pattern : void 0)}"
          min="${m("" === this.min ? void 0 : this.min)}"
          max="${m("" === this.max ? void 0 : this.max)}"
          step="${m(null === this.step ? void 0 : this.step)}"
          size="${m(null === this.size ? void 0 : this.size)}"
          name="${m("" === this.name ? void 0 : this.name)}"
          inputmode="${m(this.inputMode)}"
          autocapitalize="${m(d)}"
          @input="${this.handleInputChange}"
          @focus="${this.onInputFocus}"
          @blur="${this.onInputBlur}">`;
  }
  renderLineRipple() {
    return this.outlined
      ? ""
      : r`
      <span .lineRippleFoundation=${te()}></span>
    `;
  }
  renderHelperText(e, t) {
    const i = this.validationMessage && !this.isUiValid,
      d = {
        "mdc-text-field-helper-text--persistent": this.helperPersistent,
        "mdc-text-field-helper-text--validation-msg": i,
      },
      l = this.focused || this.helperPersistent || i ? void 0 : "true",
      c = i ? this.validationMessage : this.helper;
    return e
      ? r`
      <div class="mdc-text-field-helper-line">
        <div id="helper-text"
             aria-hidden="${m(l)}"
             class="mdc-text-field-helper-text ${s(d)}"
             >${c}</div>
        ${this.renderCharCounter(t)}
      </div>`
      : "";
  }
  renderCharCounter(e) {
    const t = Math.min(this.value.length, this.maxLength);
    return e
      ? r`
      <span class="mdc-text-field-character-counter"
            >${t} / ${this.maxLength}</span>`
      : "";
  }
  onInputFocus() {
    this.focused = !0;
  }
  onInputBlur() {
    (this.focused = !1), this.reportValidity();
  }
  checkValidity() {
    const e = this._checkValidity(this.value);
    if (!e) {
      const e = new Event("invalid", { bubbles: !1, cancelable: !0 });
      this.dispatchEvent(e);
    }
    return e;
  }
  reportValidity() {
    const e = this.checkValidity();
    return this.mdcFoundation.setValid(e), (this.isUiValid = e), e;
  }
  _checkValidity(e) {
    const t = this.formElement.validity;
    let i = Ie(t);
    if (this.validityTransform) {
      const t = this.validityTransform(e, i);
      (i = Object.assign(Object.assign({}, i), t)),
        this.mdcFoundation.setUseNativeValidation(!1);
    } else this.mdcFoundation.setUseNativeValidation(!0);
    return (this._validity = i), this._validity.valid;
  }
  setCustomValidity(e) {
    (this.validationMessage = e), this.formElement.setCustomValidity(e);
  }
  handleInputChange() {
    this.value = this.formElement.value;
  }
  createAdapter() {
    return Object.assign(
      Object.assign(
        Object.assign(
          Object.assign(
            Object.assign({}, this.getRootAdapterMethods()),
            this.getInputAdapterMethods()
          ),
          this.getLabelAdapterMethods()
        ),
        this.getLineRippleAdapterMethods()
      ),
      this.getOutlineAdapterMethods()
    );
  }
  getRootAdapterMethods() {
    return Object.assign(
      {
        registerTextFieldInteractionHandler: (e, t) =>
          this.addEventListener(e, t),
        deregisterTextFieldInteractionHandler: (e, t) =>
          this.removeEventListener(e, t),
        registerValidationAttributeChangeHandler: (e) => {
          const t = new MutationObserver((t) => {
            e(((e) => e.map((e) => e.attributeName).filter((e) => e))(t));
          });
          return t.observe(this.formElement, { attributes: !0 }), t;
        },
        deregisterValidationAttributeChangeHandler: (e) => e.disconnect(),
      },
      I(this.mdcRoot)
    );
  }
  getInputAdapterMethods() {
    return {
      getNativeInput: () => this.formElement,
      setInputAttr: () => {},
      removeInputAttr: () => {},
      isFocused: () =>
        !!this.shadowRoot && this.shadowRoot.activeElement === this.formElement,
      registerInputInteractionHandler: (e, t) =>
        this.formElement.addEventListener(e, t, { passive: e in Ee }),
      deregisterInputInteractionHandler: (e, t) =>
        this.formElement.removeEventListener(e, t),
    };
  }
  getLabelAdapterMethods() {
    return {
      floatLabel: (e) =>
        this.labelElement && this.labelElement.floatingLabelFoundation.float(e),
      getLabelWidth: () =>
        this.labelElement
          ? this.labelElement.floatingLabelFoundation.getWidth()
          : 0,
      hasLabel: () => Boolean(this.labelElement),
      shakeLabel: (e) =>
        this.labelElement && this.labelElement.floatingLabelFoundation.shake(e),
      setLabelRequired: (e) => {
        this.labelElement &&
          this.labelElement.floatingLabelFoundation.setRequired(e);
      },
    };
  }
  getLineRippleAdapterMethods() {
    return {
      activateLineRipple: () => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.activate();
      },
      deactivateLineRipple: () => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.deactivate();
      },
      setLineRippleTransformOrigin: (e) => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.setRippleCenter(e);
      },
    };
  }
  async getUpdateComplete() {
    var e;
    const t = await super.getUpdateComplete();
    return (
      await (null === (e = this.outlineElement) || void 0 === e
        ? void 0
        : e.updateComplete),
      t
    );
  }
  firstUpdated() {
    var e;
    super.firstUpdated(),
      this.mdcFoundation.setValidateOnValueChange(this.autoValidate),
      this.validateOnInitialRender && this.reportValidity(),
      null === (e = this.outlineElement) ||
        void 0 === e ||
        e.updateComplete.then(() => {
          var e;
          this.outlineWidth =
            (null === (e = this.labelElement) || void 0 === e
              ? void 0
              : e.floatingLabelFoundation.getWidth()) || 0;
        });
  }
  getOutlineAdapterMethods() {
    return {
      closeOutline: () => this.outlineElement && (this.outlineOpen = !1),
      hasOutline: () => Boolean(this.outlineElement),
      notchOutline: (e) => {
        this.outlineElement &&
          !this.outlineOpen &&
          ((this.outlineWidth = e), (this.outlineOpen = !0));
      },
    };
  }
  async layout() {
    await this.updateComplete;
    const e = this.labelElement;
    if (!e) return void (this.outlineOpen = !1);
    const t = !!this.label && !!this.value;
    if ((e.floatingLabelFoundation.float(t), !this.outlined)) return;
    (this.outlineOpen = t), await this.updateComplete;
    const i = e.floatingLabelFoundation.getWidth();
    this.outlineOpen && ((this.outlineWidth = i), await this.updateComplete);
  }
}
e([d(".mdc-text-field")], Ce.prototype, "mdcRoot", void 0),
  e([d("input")], Ce.prototype, "formElement", void 0),
  e([d(".mdc-floating-label")], Ce.prototype, "labelElement", void 0),
  e([d(".mdc-line-ripple")], Ce.prototype, "lineRippleElement", void 0),
  e([d("mwc-notched-outline")], Ce.prototype, "outlineElement", void 0),
  e([d(".mdc-notched-outline__notch")], Ce.prototype, "notchElement", void 0),
  e([t({ type: String })], Ce.prototype, "value", void 0),
  e([t({ type: String })], Ce.prototype, "type", void 0),
  e([t({ type: String })], Ce.prototype, "placeholder", void 0),
  e(
    [
      t({ type: String }),
      R(function (e, t) {
        void 0 !== t && this.label !== t && this.layout();
      }),
    ],
    Ce.prototype,
    "label",
    void 0
  ),
  e([t({ type: String })], Ce.prototype, "icon", void 0),
  e([t({ type: String })], Ce.prototype, "iconTrailing", void 0),
  e([t({ type: Boolean, reflect: !0 })], Ce.prototype, "disabled", void 0),
  e([t({ type: Boolean })], Ce.prototype, "required", void 0),
  e([t({ type: Number })], Ce.prototype, "minLength", void 0),
  e([t({ type: Number })], Ce.prototype, "maxLength", void 0),
  e(
    [
      t({ type: Boolean, reflect: !0 }),
      R(function (e, t) {
        void 0 !== t && this.outlined !== t && this.layout();
      }),
    ],
    Ce.prototype,
    "outlined",
    void 0
  ),
  e([t({ type: String })], Ce.prototype, "helper", void 0),
  e([t({ type: Boolean })], Ce.prototype, "validateOnInitialRender", void 0),
  e([t({ type: String })], Ce.prototype, "validationMessage", void 0),
  e([t({ type: Boolean })], Ce.prototype, "autoValidate", void 0),
  e([t({ type: String })], Ce.prototype, "pattern", void 0),
  e([t({ type: String })], Ce.prototype, "min", void 0),
  e([t({ type: String })], Ce.prototype, "max", void 0),
  e([t({ type: String })], Ce.prototype, "step", void 0),
  e([t({ type: Number })], Ce.prototype, "size", void 0),
  e([t({ type: Boolean })], Ce.prototype, "helperPersistent", void 0),
  e([t({ type: Boolean })], Ce.prototype, "charCounter", void 0),
  e([t({ type: Boolean })], Ce.prototype, "endAligned", void 0),
  e([t({ type: String })], Ce.prototype, "prefix", void 0),
  e([t({ type: String })], Ce.prototype, "suffix", void 0),
  e([t({ type: String })], Ce.prototype, "name", void 0),
  e([t({ type: String })], Ce.prototype, "inputMode", void 0),
  e([t({ type: Boolean })], Ce.prototype, "readOnly", void 0),
  e([t({ type: String })], Ce.prototype, "autocapitalize", void 0),
  e([c()], Ce.prototype, "outlineOpen", void 0),
  e([c()], Ce.prototype, "outlineWidth", void 0),
  e([c()], Ce.prototype, "isUiValid", void 0),
  e([c()], Ce.prototype, "focused", void 0),
  e([n({ passive: !0 })], Ce.prototype, "handleInputChange", null);
const Ae = h`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0, 0, 0, 0.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);width:100%;min-width:0;border:none;border-radius:0;background:none;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens: none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field__affix--prefix,.mdc-text-field__affix--prefix[dir=rtl]{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl]{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field__affix--suffix,.mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-text-field--filled:hover .mdc-text-field__ripple::before,.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:whitesmoke}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-text-field--filled .mdc-floating-label,.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens: none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-text-field--outlined{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined{padding-right:max(16px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px, var(--mdc-shape-small, 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-right:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::before,.mdc-text-field--outlined .mdc-text-field__ripple::after{content:none}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-10.25px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-10.25px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-24.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-24.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer,.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl]{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateX(1px) translateY(1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl]{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}[dir=rtl] .mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake,.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}[dir=rtl] .mdc-text-field--with-trailing-icon,.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0, 0, 0, 0.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl]{text-align:left}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix{direction:ltr}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading{order:1}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{order:2}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input{order:3}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{order:4}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing{order:5}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix{padding-right:12px}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}[dir=rtl] .mdc-text-field__icon--leading,.mdc-text-field__icon--leading[dir=rtl]{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0px;margin-right:0px}[dir=rtl] .mdc-text-field__icon--trailing,.mdc-text-field__icon--trailing[dir=rtl]{margin-left:0px;margin-right:0px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:none}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06);border-bottom-color:var(--mdc-text-field-disabled-line-color, rgba(0, 0, 0, 0.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field__input{direction:inherit}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon{color:var(--mdc-text-field-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}`;
p(
  [f("ha-textfield")],
  function (e, i) {
    class d extends i {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: d,
      d: [
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "invalid",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ attribute: "error-message" })],
          key: "errorMessage",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "icon",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "iconTrailing",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t()],
          key: "autocomplete",
          value: void 0,
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            C(A(d.prototype), "updated", this).call(this, e),
              ((e.has("invalid") &&
                (this.invalid || void 0 !== e.get("invalid"))) ||
                e.has("errorMessage")) &&
                (this.setCustomValidity(
                  this.invalid ? this.errorMessage || "Invalid" : ""
                ),
                this.reportValidity()),
              e.has("autocomplete") &&
                (this.autocomplete
                  ? this.formElement.setAttribute(
                      "autocomplete",
                      this.autocomplete
                    )
                  : this.formElement.removeAttribute("autocomplete"));
          },
        },
        {
          kind: "method",
          key: "renderIcon",
          value: function (e, t = !1) {
            const i = t ? "trailing" : "leading";
            return r`
      <span
        class="mdc-text-field__icon mdc-text-field__icon--${i}"
        tabindex=${t ? 1 : -1}
      >
        <slot name="${i}Icon"></slot>
      </span>
    `;
          },
        },
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            Ae,
            h`
      .mdc-text-field__input {
        width: var(--ha-textfield-input-width, 100%);
      }
      .mdc-text-field:not(.mdc-text-field--with-leading-icon) {
        padding: var(--text-field-padding, 0px 16px);
      }
      .mdc-text-field__affix--suffix {
        padding-left: var(--text-field-suffix-padding-left, 12px);
        padding-right: var(--text-field-suffix-padding-right, 0px);
        padding-inline-start: var(--text-field-suffix-padding-left, 12px);
        padding-inline-end: var(--text-field-suffix-padding-right, 0px);
        direction: var(--direction);
      }
      .mdc-text-field--with-leading-icon {
        padding-inline-start: var(--text-field-suffix-padding-left, 0px);
        padding-inline-end: var(--text-field-suffix-padding-right, 16px);
        direction: var(--direction);
      }

      .mdc-text-field:not(.mdc-text-field--disabled)
        .mdc-text-field__affix--suffix {
        color: var(--secondary-text-color);
      }

      .mdc-text-field__icon {
        color: var(--secondary-text-color);
      }

      .mdc-text-field__icon--leading {
        margin-inline-start: 16px;
        margin-inline-end: 8px;
        direction: var(--direction);
      }

      .mdc-floating-label:not(.mdc-floating-label--float-above) {
        text-overflow: ellipsis;
        width: inherit;
        padding-right: 30px;
        padding-inline-end: 30px;
        padding-inline-start: initial;
        box-sizing: border-box;
        direction: var(--direction);
      }

      input {
        text-align: var(--text-field-text-align, start);
      }

      /* Chrome, Safari, Edge, Opera */
      :host([no-spinner]) input::-webkit-outer-spin-button,
      :host([no-spinner]) input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      :host([no-spinner]) input[type="number"] {
        -moz-appearance: textfield;
      }

      .mdc-text-field__ripple {
        overflow: hidden;
      }

      .mdc-text-field {
        overflow: var(--text-field-overflow);
      }

      .mdc-floating-label {
        inset-inline-start: 16px !important;
        inset-inline-end: initial !important;
        transform-origin: var(--float-start);
        direction: var(--direction);
        text-align: var(--float-start);
      }

      .mdc-text-field--with-leading-icon.mdc-text-field--filled
        .mdc-floating-label {
        max-width: calc(100% - 48px);
        inset-inline-start: 48px !important;
        inset-inline-end: initial !important;
        direction: var(--direction);
      }

      .mdc-text-field__input[type="number"] {
        direction: var(--direction);
      }
    `,
            "rtl" === document.dir
              ? h`
          .mdc-text-field__affix--suffix,
          .mdc-text-field--with-leading-icon,
          .mdc-text-field__icon--leading,
          .mdc-floating-label,
          .mdc-text-field--with-leading-icon.mdc-text-field--filled
            .mdc-floating-label,
          .mdc-text-field__input[type="number"] {
            direction: rtl;
          }
        `
              : h``,
          ],
        },
      ],
    };
  },
  Ce
);
let Le = class extends P {};
(Le.styles = [H]), (Le = e([f("mwc-checkbox")], Le));
class Te extends O {
  constructor() {
    super(...arguments), (this.left = !1), (this.graphic = "control");
  }
  render() {
    const e = {
        "mdc-deprecated-list-item__graphic": this.left,
        "mdc-deprecated-list-item__meta": !this.left,
      },
      t = this.renderText(),
      i =
        this.graphic && "control" !== this.graphic && !this.left
          ? this.renderGraphic()
          : r``,
      d = this.hasMeta && this.left ? this.renderMeta() : r``,
      l = this.renderRipple();
    return r`
      ${l}
      ${i}
      ${this.left ? "" : t}
      <span class=${s(e)}>
        <mwc-checkbox
            reducedTouchTarget
            tabindex=${this.tabindex}
            .checked=${this.selected}
            ?disabled=${this.disabled}
            @change=${this.onChange}>
        </mwc-checkbox>
      </span>
      ${this.left ? t : ""}
      ${d}`;
  }
  async onChange(e) {
    const t = e.target;
    this.selected === t.checked ||
      ((this._skipPropRequest = !0),
      (this.selected = t.checked),
      await this.updateComplete,
      (this._skipPropRequest = !1));
  }
}
e([d("slot")], Te.prototype, "slotElement", void 0),
  e([d("mwc-checkbox")], Te.prototype, "checkboxElement", void 0),
  e([t({ type: Boolean })], Te.prototype, "left", void 0),
  e([t({ type: String, reflect: !0 })], Te.prototype, "graphic", void 0);
const Re = h`:host(:not([twoline])){height:56px}:host(:not([left])) .mdc-deprecated-list-item__meta{height:40px;width:40px}`;
p(
  [f("ha-check-list-item")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            F,
            Re,
            h`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  Te
);
const Oe = (e) => e.stopPropagation();
var Fe = ["input", "button", "textarea", "select"],
  ze = function (e) {
    var t = e.target;
    if (t) {
      var i = ("" + t.tagName).toLowerCase();
      -1 === Fe.indexOf(i) && e.preventDefault();
    }
  };
function Se(e, t) {
  for (var i = new Map(), d = 0; d < e; d++) {
    var l = t(d).trim();
    if (l) {
      var c = l[0].toLowerCase();
      i.has(c) || i.set(c, []),
        i.get(c).push({ text: l.toLowerCase(), index: d });
    }
  }
  return (
    i.forEach(function (e) {
      e.sort(function (e, t) {
        return e.index - t.index;
      });
    }),
    i
  );
}
function Ve(e, t) {
  var i,
    d = e.nextChar,
    l = e.focusItemAtIndex,
    c = e.sortedIndexByFirstChar,
    o = e.focusedItemIndex,
    n = e.skipFocus,
    a = e.isItemAtIndexDisabled;
  return (
    clearTimeout(t.bufferClearTimeout),
    (t.bufferClearTimeout = setTimeout(function () {
      !(function (e) {
        e.typeaheadBuffer = "";
      })(t);
    }, z.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS)),
    (t.typeaheadBuffer = t.typeaheadBuffer + d),
    (i =
      1 === t.typeaheadBuffer.length
        ? (function (e, t, i, d) {
            var l = d.typeaheadBuffer[0],
              c = e.get(l);
            if (!c) return -1;
            if (
              l === d.currentFirstChar &&
              c[d.sortedIndexCursor].index === t
            ) {
              d.sortedIndexCursor = (d.sortedIndexCursor + 1) % c.length;
              var o = c[d.sortedIndexCursor].index;
              if (!i(o)) return o;
            }
            d.currentFirstChar = l;
            var n,
              a = -1;
            for (n = 0; n < c.length; n++)
              if (!i(c[n].index)) {
                a = n;
                break;
              }
            for (; n < c.length; n++)
              if (c[n].index > t && !i(c[n].index)) {
                a = n;
                break;
              }
            if (-1 !== a)
              return (d.sortedIndexCursor = a), c[d.sortedIndexCursor].index;
            return -1;
          })(c, o, a, t)
        : (function (e, t, i) {
            var d = i.typeaheadBuffer[0],
              l = e.get(d);
            if (!l) return -1;
            var c = l[i.sortedIndexCursor];
            if (0 === c.text.lastIndexOf(i.typeaheadBuffer, 0) && !t(c.index))
              return c.index;
            var o = (i.sortedIndexCursor + 1) % l.length,
              n = -1;
            for (; o !== i.sortedIndexCursor; ) {
              var a = l[o],
                r = 0 === a.text.lastIndexOf(i.typeaheadBuffer, 0),
                s = !t(a.index);
              if (r && s) {
                n = o;
                break;
              }
              o = (o + 1) % l.length;
            }
            if (-1 !== n)
              return (i.sortedIndexCursor = n), l[i.sortedIndexCursor].index;
            return -1;
          })(c, a, t)),
    -1 === i || n || l(i),
    i
  );
}
function De(e) {
  return e.typeaheadBuffer.length > 0;
}
var $e = {
    ACTIVATED: "mdc-select--activated",
    DISABLED: "mdc-select--disabled",
    FOCUSED: "mdc-select--focused",
    INVALID: "mdc-select--invalid",
    MENU_INVALID: "mdc-select__menu--invalid",
    OUTLINED: "mdc-select--outlined",
    REQUIRED: "mdc-select--required",
    ROOT: "mdc-select",
    WITH_LEADING_ICON: "mdc-select--with-leading-icon",
  },
  Be = {
    ARIA_CONTROLS: "aria-controls",
    ARIA_DESCRIBEDBY: "aria-describedby",
    ARIA_SELECTED_ATTR: "aria-selected",
    CHANGE_EVENT: "MDCSelect:change",
    HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
    LABEL_SELECTOR: ".mdc-floating-label",
    LEADING_ICON_SELECTOR: ".mdc-select__icon",
    LINE_RIPPLE_SELECTOR: ".mdc-line-ripple",
    MENU_SELECTOR: ".mdc-select__menu",
    OUTLINE_SELECTOR: ".mdc-notched-outline",
    SELECTED_TEXT_SELECTOR: ".mdc-select__selected-text",
    SELECT_ANCHOR_SELECTOR: ".mdc-select__anchor",
    VALUE_ATTR: "data-value",
  },
  Me = { LABEL_SCALE: 0.75, UNSET_INDEX: -1, CLICK_DEBOUNCE_TIMEOUT_MS: 330 },
  Ne = (function (e) {
    function t(i, d) {
      void 0 === d && (d = {});
      var l = e.call(this, x(x({}, t.defaultAdapter), i)) || this;
      return (
        (l.disabled = !1),
        (l.isMenuOpen = !1),
        (l.useDefaultValidation = !0),
        (l.customValidity = !0),
        (l.lastSelectedIndex = Me.UNSET_INDEX),
        (l.clickDebounceTimeout = 0),
        (l.recentlyClicked = !1),
        (l.leadingIcon = d.leadingIcon),
        (l.helperText = d.helperText),
        l
      );
    }
    return (
      u(t, e),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return $e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "numbers", {
        get: function () {
          return Me;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "strings", {
        get: function () {
          return Be;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            hasClass: function () {
              return !1;
            },
            activateBottomLine: function () {},
            deactivateBottomLine: function () {},
            getSelectedIndex: function () {
              return -1;
            },
            setSelectedIndex: function () {},
            hasLabel: function () {
              return !1;
            },
            floatLabel: function () {},
            getLabelWidth: function () {
              return 0;
            },
            setLabelRequired: function () {},
            hasOutline: function () {
              return !1;
            },
            notchOutline: function () {},
            closeOutline: function () {},
            setRippleCenter: function () {},
            notifyChange: function () {},
            setSelectedText: function () {},
            isSelectAnchorFocused: function () {
              return !1;
            },
            getSelectAnchorAttr: function () {
              return "";
            },
            setSelectAnchorAttr: function () {},
            removeSelectAnchorAttr: function () {},
            addMenuClass: function () {},
            removeMenuClass: function () {},
            openMenu: function () {},
            closeMenu: function () {},
            getAnchorElement: function () {
              return null;
            },
            setMenuAnchorElement: function () {},
            setMenuAnchorCorner: function () {},
            setMenuWrapFocus: function () {},
            focusMenuItemAtIndex: function () {},
            getMenuItemCount: function () {
              return 0;
            },
            getMenuItemValues: function () {
              return [];
            },
            getMenuItemTextAtIndex: function () {
              return "";
            },
            isTypeaheadInProgress: function () {
              return !1;
            },
            typeaheadMatchItem: function () {
              return -1;
            },
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.getSelectedIndex = function () {
        return this.adapter.getSelectedIndex();
      }),
      (t.prototype.setSelectedIndex = function (e, t, i) {
        void 0 === t && (t = !1),
          void 0 === i && (i = !1),
          e >= this.adapter.getMenuItemCount() ||
            (e === Me.UNSET_INDEX
              ? this.adapter.setSelectedText("")
              : this.adapter.setSelectedText(
                  this.adapter.getMenuItemTextAtIndex(e).trim()
                ),
            this.adapter.setSelectedIndex(e),
            t && this.adapter.closeMenu(),
            i || this.lastSelectedIndex === e || this.handleChange(),
            (this.lastSelectedIndex = e));
      }),
      (t.prototype.setValue = function (e, t) {
        void 0 === t && (t = !1);
        var i = this.adapter.getMenuItemValues().indexOf(e);
        this.setSelectedIndex(i, !1, t);
      }),
      (t.prototype.getValue = function () {
        var e = this.adapter.getSelectedIndex(),
          t = this.adapter.getMenuItemValues();
        return e !== Me.UNSET_INDEX ? t[e] : "";
      }),
      (t.prototype.getDisabled = function () {
        return this.disabled;
      }),
      (t.prototype.setDisabled = function (e) {
        (this.disabled = e),
          this.disabled
            ? (this.adapter.addClass($e.DISABLED), this.adapter.closeMenu())
            : this.adapter.removeClass($e.DISABLED),
          this.leadingIcon && this.leadingIcon.setDisabled(this.disabled),
          this.disabled
            ? this.adapter.removeSelectAnchorAttr("tabindex")
            : this.adapter.setSelectAnchorAttr("tabindex", "0"),
          this.adapter.setSelectAnchorAttr(
            "aria-disabled",
            this.disabled.toString()
          );
      }),
      (t.prototype.openMenu = function () {
        this.adapter.addClass($e.ACTIVATED),
          this.adapter.openMenu(),
          (this.isMenuOpen = !0),
          this.adapter.setSelectAnchorAttr("aria-expanded", "true");
      }),
      (t.prototype.setHelperTextContent = function (e) {
        this.helperText && this.helperText.setContent(e);
      }),
      (t.prototype.layout = function () {
        if (this.adapter.hasLabel()) {
          var e = this.getValue().length > 0,
            t = this.adapter.hasClass($e.FOCUSED),
            i = e || t,
            d = this.adapter.hasClass($e.REQUIRED);
          this.notchOutline(i),
            this.adapter.floatLabel(i),
            this.adapter.setLabelRequired(d);
        }
      }),
      (t.prototype.layoutOptions = function () {
        var e = this.adapter.getMenuItemValues().indexOf(this.getValue());
        this.setSelectedIndex(e, !1, !0);
      }),
      (t.prototype.handleMenuOpened = function () {
        if (0 !== this.adapter.getMenuItemValues().length) {
          var e = this.getSelectedIndex(),
            t = e >= 0 ? e : 0;
          this.adapter.focusMenuItemAtIndex(t);
        }
      }),
      (t.prototype.handleMenuClosing = function () {
        this.adapter.setSelectAnchorAttr("aria-expanded", "false");
      }),
      (t.prototype.handleMenuClosed = function () {
        this.adapter.removeClass($e.ACTIVATED),
          (this.isMenuOpen = !1),
          this.adapter.isSelectAnchorFocused() || this.blur();
      }),
      (t.prototype.handleChange = function () {
        this.layout(),
          this.adapter.notifyChange(this.getValue()),
          this.adapter.hasClass($e.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (t.prototype.handleMenuItemAction = function (e) {
        this.setSelectedIndex(e, !0);
      }),
      (t.prototype.handleFocus = function () {
        this.adapter.addClass($e.FOCUSED),
          this.layout(),
          this.adapter.activateBottomLine();
      }),
      (t.prototype.handleBlur = function () {
        this.isMenuOpen || this.blur();
      }),
      (t.prototype.handleClick = function (e) {
        this.disabled ||
          this.recentlyClicked ||
          (this.setClickDebounceTimeout(),
          this.isMenuOpen
            ? this.adapter.closeMenu()
            : (this.adapter.setRippleCenter(e), this.openMenu()));
      }),
      (t.prototype.handleKeydown = function (e) {
        if (!this.isMenuOpen && this.adapter.hasClass($e.FOCUSED)) {
          var t = S(e) === V.ENTER,
            i = S(e) === V.SPACEBAR,
            d = S(e) === V.ARROW_UP,
            l = S(e) === V.ARROW_DOWN;
          if (
            !(e.ctrlKey || e.metaKey) &&
            ((!i && e.key && 1 === e.key.length) ||
              (i && this.adapter.isTypeaheadInProgress()))
          ) {
            var c = i ? " " : e.key,
              o = this.adapter.typeaheadMatchItem(c, this.getSelectedIndex());
            return o >= 0 && this.setSelectedIndex(o), void e.preventDefault();
          }
          (t || i || d || l) &&
            (d && this.getSelectedIndex() > 0
              ? this.setSelectedIndex(this.getSelectedIndex() - 1)
              : l &&
                this.getSelectedIndex() < this.adapter.getMenuItemCount() - 1 &&
                this.setSelectedIndex(this.getSelectedIndex() + 1),
            this.openMenu(),
            e.preventDefault());
        }
      }),
      (t.prototype.notchOutline = function (e) {
        if (this.adapter.hasOutline()) {
          var t = this.adapter.hasClass($e.FOCUSED);
          if (e) {
            var i = Me.LABEL_SCALE,
              d = this.adapter.getLabelWidth() * i;
            this.adapter.notchOutline(d);
          } else t || this.adapter.closeOutline();
        }
      }),
      (t.prototype.setLeadingIconAriaLabel = function (e) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(e);
      }),
      (t.prototype.setLeadingIconContent = function (e) {
        this.leadingIcon && this.leadingIcon.setContent(e);
      }),
      (t.prototype.getUseDefaultValidation = function () {
        return this.useDefaultValidation;
      }),
      (t.prototype.setUseDefaultValidation = function (e) {
        this.useDefaultValidation = e;
      }),
      (t.prototype.setValid = function (e) {
        this.useDefaultValidation || (this.customValidity = e),
          this.adapter.setSelectAnchorAttr("aria-invalid", (!e).toString()),
          e
            ? (this.adapter.removeClass($e.INVALID),
              this.adapter.removeMenuClass($e.MENU_INVALID))
            : (this.adapter.addClass($e.INVALID),
              this.adapter.addMenuClass($e.MENU_INVALID)),
          this.syncHelperTextValidity(e);
      }),
      (t.prototype.isValid = function () {
        return this.useDefaultValidation &&
          this.adapter.hasClass($e.REQUIRED) &&
          !this.adapter.hasClass($e.DISABLED)
          ? this.getSelectedIndex() !== Me.UNSET_INDEX &&
              (0 !== this.getSelectedIndex() || Boolean(this.getValue()))
          : this.customValidity;
      }),
      (t.prototype.setRequired = function (e) {
        e
          ? this.adapter.addClass($e.REQUIRED)
          : this.adapter.removeClass($e.REQUIRED),
          this.adapter.setSelectAnchorAttr("aria-required", e.toString()),
          this.adapter.setLabelRequired(e);
      }),
      (t.prototype.getRequired = function () {
        return "true" === this.adapter.getSelectAnchorAttr("aria-required");
      }),
      (t.prototype.init = function () {
        var e = this.adapter.getAnchorElement();
        e &&
          (this.adapter.setMenuAnchorElement(e),
          this.adapter.setMenuAnchorCorner(D.BOTTOM_START)),
          this.adapter.setMenuWrapFocus(!1),
          this.setDisabled(this.adapter.hasClass($e.DISABLED)),
          this.syncHelperTextValidity(!this.adapter.hasClass($e.INVALID)),
          this.layout(),
          this.layoutOptions();
      }),
      (t.prototype.blur = function () {
        this.adapter.removeClass($e.FOCUSED),
          this.layout(),
          this.adapter.deactivateBottomLine(),
          this.adapter.hasClass($e.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (t.prototype.syncHelperTextValidity = function (e) {
        if (this.helperText) {
          this.helperText.setValidity(e);
          var t = this.helperText.isVisible(),
            i = this.helperText.getId();
          t && i
            ? this.adapter.setSelectAnchorAttr(Be.ARIA_DESCRIBEDBY, i)
            : this.adapter.removeSelectAnchorAttr(Be.ARIA_DESCRIBEDBY);
        }
      }),
      (t.prototype.setClickDebounceTimeout = function () {
        var e = this;
        clearTimeout(this.clickDebounceTimeout),
          (this.clickDebounceTimeout = setTimeout(function () {
            e.recentlyClicked = !1;
          }, Me.CLICK_DEBOUNCE_TIMEOUT_MS)),
          (this.recentlyClicked = !0);
      }),
      t
    );
  })(b);
const Pe = (e = {}) => {
  const t = {};
  for (const i in e) t[i] = e[i];
  return Object.assign(
    {
      badInput: !1,
      customError: !1,
      patternMismatch: !1,
      rangeOverflow: !1,
      rangeUnderflow: !1,
      stepMismatch: !1,
      tooLong: !1,
      tooShort: !1,
      typeMismatch: !1,
      valid: !0,
      valueMissing: !1,
    },
    t
  );
};
class He extends N {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = Ne),
      (this.disabled = !1),
      (this.outlined = !1),
      (this.label = ""),
      (this.outlineOpen = !1),
      (this.outlineWidth = 0),
      (this.value = ""),
      (this.name = ""),
      (this.selectedText = ""),
      (this.icon = ""),
      (this.menuOpen = !1),
      (this.helper = ""),
      (this.validateOnInitialRender = !1),
      (this.validationMessage = ""),
      (this.required = !1),
      (this.naturalMenuWidth = !1),
      (this.isUiValid = !0),
      (this.fixedMenuPosition = !1),
      (this.typeaheadState = {
        bufferClearTimeout: 0,
        currentFirstChar: "",
        sortedIndexCursor: 0,
        typeaheadBuffer: "",
      }),
      (this.sortedIndexByFirstChar = new Map()),
      (this.menuElement_ = null),
      (this.listeners = []),
      (this.onBodyClickBound = () => {}),
      (this._menuUpdateComplete = null),
      (this.valueSetDirectly = !1),
      (this.validityTransform = null),
      (this._validity = Pe());
  }
  get items() {
    return (
      this.menuElement_ || (this.menuElement_ = this.menuElement),
      this.menuElement_ ? this.menuElement_.items : []
    );
  }
  get selected() {
    const e = this.menuElement;
    return e ? e.selected : null;
  }
  get index() {
    const e = this.menuElement;
    return e ? e.index : -1;
  }
  get shouldRenderHelperText() {
    return !!this.helper || !!this.validationMessage;
  }
  get validity() {
    return this._checkValidity(this.value), this._validity;
  }
  render() {
    const e = {
        "mdc-select--disabled": this.disabled,
        "mdc-select--no-label": !this.label,
        "mdc-select--filled": !this.outlined,
        "mdc-select--outlined": this.outlined,
        "mdc-select--with-leading-icon": !!this.icon,
        "mdc-select--required": this.required,
        "mdc-select--invalid": !this.isUiValid,
      },
      t = { "mdc-select__menu--invalid": !this.isUiValid },
      i = this.label ? "label" : void 0,
      d = this.shouldRenderHelperText ? "helper-text" : void 0;
    return r`
      <div
          class="mdc-select ${s(e)}">
        <input
            class="formElement"
            name="${this.name}"
            .value="${this.value}"
            hidden
            ?disabled="${this.disabled}"
            ?required=${this.required}>
        <!-- @ts-ignore -->
        <div class="mdc-select__anchor"
            aria-autocomplete="none"
            role="combobox"
            aria-expanded=${this.menuOpen}
            aria-invalid=${!this.isUiValid}
            aria-haspopup="listbox"
            aria-labelledby=${m(i)}
            aria-required=${this.required}
            aria-describedby=${m(d)}
            @click=${this.onClick}
            @focus=${this.onFocus}
            @blur=${this.onBlur}
            @keydown=${this.onKeydown}>
          ${this.renderRipple()}
          ${this.outlined ? this.renderOutline() : this.renderLabel()}
          ${this.renderLeadingIcon()}
          <span class="mdc-select__selected-text-container">
            <span class="mdc-select__selected-text">${this.selectedText}</span>
          </span>
          <span class="mdc-select__dropdown-icon">
            <svg
                class="mdc-select__dropdown-icon-graphic"
                viewBox="7 10 10 5"
                focusable="false">
              <polygon
                  class="mdc-select__dropdown-icon-inactive"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 10 12 15 17 10">
              </polygon>
              <polygon
                  class="mdc-select__dropdown-icon-active"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 15 12 10 17 15">
              </polygon>
            </svg>
          </span>
          ${this.renderLineRipple()}
        </div>
        <mwc-menu
            innerRole="listbox"
            wrapFocus
            class="mdc-select__menu mdc-menu mdc-menu-surface ${s(t)}"
            activatable
            .fullwidth=${!this.fixedMenuPosition && !this.naturalMenuWidth}
            .open=${this.menuOpen}
            .anchor=${this.anchorElement}
            .fixed=${this.fixedMenuPosition}
            @selected=${this.onSelected}
            @opened=${this.onOpened}
            @closed=${this.onClosed}
            @items-updated=${this.onItemsUpdated}
            @keydown=${this.handleTypeahead}>
          <slot></slot>
        </mwc-menu>
      </div>
      ${this.renderHelperText()}`;
  }
  renderRipple() {
    return this.outlined
      ? E
      : r`
      <span class="mdc-select__ripple"></span>
    `;
  }
  renderOutline() {
    return this.outlined
      ? r`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`
      : E;
  }
  renderLabel() {
    return this.label
      ? r`
      <span
          .floatingLabelFoundation=${J(this.label)}
          id="label">${this.label}</span>
    `
      : E;
  }
  renderLeadingIcon() {
    return this.icon
      ? r`<mwc-icon class="mdc-select__icon"><div>${this.icon}</div></mwc-icon>`
      : E;
  }
  renderLineRipple() {
    return this.outlined
      ? E
      : r`
      <span .lineRippleFoundation=${te()}></span>
    `;
  }
  renderHelperText() {
    if (!this.shouldRenderHelperText) return E;
    const e = this.validationMessage && !this.isUiValid;
    return r`
        <p
          class="mdc-select-helper-text ${s({
            "mdc-select-helper-text--validation-msg": e,
          })}"
          id="helper-text">${e ? this.validationMessage : this.helper}</p>`;
  }
  createAdapter() {
    return Object.assign(Object.assign({}, I(this.mdcRoot)), {
      activateBottomLine: () => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.activate();
      },
      deactivateBottomLine: () => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.deactivate();
      },
      hasLabel: () => !!this.label,
      floatLabel: (e) => {
        this.labelElement && this.labelElement.floatingLabelFoundation.float(e);
      },
      getLabelWidth: () =>
        this.labelElement
          ? this.labelElement.floatingLabelFoundation.getWidth()
          : 0,
      setLabelRequired: (e) => {
        this.labelElement &&
          this.labelElement.floatingLabelFoundation.setRequired(e);
      },
      hasOutline: () => this.outlined,
      notchOutline: (e) => {
        this.outlineElement &&
          !this.outlineOpen &&
          ((this.outlineWidth = e), (this.outlineOpen = !0));
      },
      closeOutline: () => {
        this.outlineElement && (this.outlineOpen = !1);
      },
      setRippleCenter: (e) => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.setRippleCenter(e);
        }
      },
      notifyChange: async (e) => {
        if (!this.valueSetDirectly && e === this.value) return;
        (this.valueSetDirectly = !1),
          (this.value = e),
          await this.updateComplete;
        const t = new Event("change", { bubbles: !0 });
        this.dispatchEvent(t);
      },
      setSelectedText: (e) => (this.selectedText = e),
      isSelectAnchorFocused: () => {
        const e = this.anchorElement;
        if (!e) return !1;
        return e.getRootNode().activeElement === e;
      },
      getSelectAnchorAttr: (e) => {
        const t = this.anchorElement;
        return t ? t.getAttribute(e) : null;
      },
      setSelectAnchorAttr: (e, t) => {
        const i = this.anchorElement;
        i && i.setAttribute(e, t);
      },
      removeSelectAnchorAttr: (e) => {
        const t = this.anchorElement;
        t && t.removeAttribute(e);
      },
      openMenu: () => {
        this.menuOpen = !0;
      },
      closeMenu: () => {
        this.menuOpen = !1;
      },
      addMenuClass: () => {},
      removeMenuClass: () => {},
      getAnchorElement: () => this.anchorElement,
      setMenuAnchorElement: () => {},
      setMenuAnchorCorner: () => {
        const e = this.menuElement;
        e && (e.corner = "BOTTOM_START");
      },
      setMenuWrapFocus: (e) => {
        const t = this.menuElement;
        t && (t.wrapFocus = e);
      },
      focusMenuItemAtIndex: (e) => {
        const t = this.menuElement;
        if (!t) return;
        const i = t.items[e];
        i && i.focus();
      },
      getMenuItemCount: () => {
        const e = this.menuElement;
        return e ? e.items.length : 0;
      },
      getMenuItemValues: () => {
        const e = this.menuElement;
        if (!e) return [];
        return e.items.map((e) => e.value);
      },
      getMenuItemTextAtIndex: (e) => {
        const t = this.menuElement;
        if (!t) return "";
        const i = t.items[e];
        return i ? i.text : "";
      },
      getSelectedIndex: () => this.index,
      setSelectedIndex: () => {},
      isTypeaheadInProgress: () => De(this.typeaheadState),
      typeaheadMatchItem: (e, t) => {
        if (!this.menuElement) return -1;
        const i = {
            focusItemAtIndex: (e) => {
              this.menuElement.focusItemAtIndex(e);
            },
            focusedItemIndex: t || this.menuElement.getFocusedItemIndex(),
            nextChar: e,
            sortedIndexByFirstChar: this.sortedIndexByFirstChar,
            skipFocus: !1,
            isItemAtIndexDisabled: (e) => this.items[e].disabled,
          },
          d = Ve(i, this.typeaheadState);
        return -1 !== d && this.select(d), d;
      },
    });
  }
  checkValidity() {
    const e = this._checkValidity(this.value);
    if (!e) {
      const e = new Event("invalid", { bubbles: !1, cancelable: !0 });
      this.dispatchEvent(e);
    }
    return e;
  }
  reportValidity() {
    const e = this.checkValidity();
    return (this.isUiValid = e), e;
  }
  _checkValidity(e) {
    const t = this.formElement.validity;
    let i = Pe(t);
    if (this.validityTransform) {
      const t = this.validityTransform(e, i);
      i = Object.assign(Object.assign({}, i), t);
    }
    return (this._validity = i), this._validity.valid;
  }
  setCustomValidity(e) {
    (this.validationMessage = e), this.formElement.setCustomValidity(e);
  }
  async getUpdateComplete() {
    await this._menuUpdateComplete;
    return await super.getUpdateComplete();
  }
  async firstUpdated() {
    const e = this.menuElement;
    if (
      (e &&
        ((this._menuUpdateComplete = e.updateComplete),
        await this._menuUpdateComplete),
      super.firstUpdated(),
      (this.mdcFoundation.isValid = () => !0),
      (this.mdcFoundation.setValid = () => {}),
      this.mdcFoundation.setDisabled(this.disabled),
      this.validateOnInitialRender && this.reportValidity(),
      !this.selected)
    ) {
      !this.items.length &&
        this.slotElement &&
        this.slotElement.assignedNodes({ flatten: !0 }).length &&
        (await new Promise((e) => requestAnimationFrame(e)),
        await this.layout());
      const e = this.items.length && "" === this.items[0].value;
      if (!this.value && e) return void this.select(0);
      this.selectByValue(this.value);
    }
    this.sortedIndexByFirstChar = Se(
      this.items.length,
      (e) => this.items[e].text
    );
  }
  onItemsUpdated() {
    this.sortedIndexByFirstChar = Se(
      this.items.length,
      (e) => this.items[e].text
    );
  }
  select(e) {
    const t = this.menuElement;
    t && t.select(e);
  }
  selectByValue(e) {
    let t = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].value === e) {
        t = i;
        break;
      }
    }
    (this.valueSetDirectly = !0),
      this.select(t),
      this.mdcFoundation.handleChange();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const e of this.listeners) e.target.removeEventListener(e.name, e.cb);
  }
  focus() {
    const e = new CustomEvent("focus"),
      t = this.anchorElement;
    t && (t.dispatchEvent(e), t.focus());
  }
  blur() {
    const e = new CustomEvent("blur"),
      t = this.anchorElement;
    t && (t.dispatchEvent(e), t.blur());
  }
  onFocus() {
    this.mdcFoundation && this.mdcFoundation.handleFocus();
  }
  onBlur() {
    this.mdcFoundation && this.mdcFoundation.handleBlur();
    const e = this.menuElement;
    e && !e.open && this.reportValidity();
  }
  onClick(e) {
    if (this.mdcFoundation) {
      this.focus();
      const t = e.target.getBoundingClientRect();
      let i = 0;
      i = "touches" in e ? e.touches[0].clientX : e.clientX;
      const d = i - t.left;
      this.mdcFoundation.handleClick(d);
    }
  }
  onKeydown(e) {
    const t = S(e) === V.ARROW_UP,
      i = S(e) === V.ARROW_DOWN;
    if (i || t) {
      const d = t && this.index > 0,
        l = i && this.index < this.items.length - 1;
      return (
        d ? this.select(this.index - 1) : l && this.select(this.index + 1),
        e.preventDefault(),
        void this.mdcFoundation.openMenu()
      );
    }
    this.mdcFoundation.handleKeydown(e);
  }
  handleTypeahead(e) {
    if (!this.menuElement) return;
    const t = this.menuElement.getFocusedItemIndex(),
      i = L(e.target) ? e.target : null;
    !(function (e, t) {
      var i = e.event,
        d = e.isTargetListItem,
        l = e.focusedItemIndex,
        c = e.focusItemAtIndex,
        o = e.sortedIndexByFirstChar,
        n = e.isItemAtIndexDisabled,
        a = "ArrowLeft" === S(i),
        r = "ArrowUp" === S(i),
        s = "ArrowRight" === S(i),
        m = "ArrowDown" === S(i),
        h = "Home" === S(i),
        p = "End" === S(i),
        f = "Enter" === S(i),
        u = "Spacebar" === S(i);
      i.ctrlKey ||
        i.metaKey ||
        a ||
        r ||
        s ||
        m ||
        h ||
        p ||
        f ||
        (u || 1 !== i.key.length
          ? u &&
            (d && ze(i),
            d &&
              De(t) &&
              Ve(
                {
                  focusItemAtIndex: c,
                  focusedItemIndex: l,
                  nextChar: " ",
                  sortedIndexByFirstChar: o,
                  skipFocus: !1,
                  isItemAtIndexDisabled: n,
                },
                t
              ))
          : (ze(i),
            Ve(
              {
                focusItemAtIndex: c,
                focusedItemIndex: l,
                nextChar: i.key.toLowerCase(),
                sortedIndexByFirstChar: o,
                skipFocus: !1,
                isItemAtIndexDisabled: n,
              },
              t
            )));
    })(
      {
        event: e,
        focusItemAtIndex: (e) => {
          this.menuElement.focusItemAtIndex(e);
        },
        focusedItemIndex: t,
        isTargetListItem: !!i && i.hasAttribute("mwc-list-item"),
        sortedIndexByFirstChar: this.sortedIndexByFirstChar,
        isItemAtIndexDisabled: (e) => this.items[e].disabled,
      },
      this.typeaheadState
    );
  }
  async onSelected(e) {
    this.mdcFoundation || (await this.updateComplete),
      this.mdcFoundation.handleMenuItemAction(e.detail.index);
    const t = this.items[e.detail.index];
    t && (this.value = t.value);
  }
  onOpened() {
    this.mdcFoundation &&
      ((this.menuOpen = !0), this.mdcFoundation.handleMenuOpened());
  }
  onClosed() {
    this.mdcFoundation &&
      ((this.menuOpen = !1), this.mdcFoundation.handleMenuClosed());
  }
  setFormData(e) {
    this.name && null !== this.selected && e.append(this.name, this.value);
  }
  async layout(e = !0) {
    this.mdcFoundation && this.mdcFoundation.layout(),
      await this.updateComplete;
    const t = this.menuElement;
    t && t.layout(e);
    const i = this.labelElement;
    if (!i) return void (this.outlineOpen = !1);
    const d = !!this.label && !!this.value;
    if ((i.floatingLabelFoundation.float(d), !this.outlined)) return;
    (this.outlineOpen = d), await this.updateComplete;
    const l = i.floatingLabelFoundation.getWidth();
    this.outlineOpen && (this.outlineWidth = l);
  }
  async layoutOptions() {
    this.mdcFoundation && this.mdcFoundation.layoutOptions();
  }
}
e([d(".mdc-select")], He.prototype, "mdcRoot", void 0),
  e([d(".formElement")], He.prototype, "formElement", void 0),
  e([d("slot")], He.prototype, "slotElement", void 0),
  e([d("select")], He.prototype, "nativeSelectElement", void 0),
  e([d("input")], He.prototype, "nativeInputElement", void 0),
  e([d(".mdc-line-ripple")], He.prototype, "lineRippleElement", void 0),
  e([d(".mdc-floating-label")], He.prototype, "labelElement", void 0),
  e([d("mwc-notched-outline")], He.prototype, "outlineElement", void 0),
  e([d(".mdc-menu")], He.prototype, "menuElement", void 0),
  e([d(".mdc-select__anchor")], He.prototype, "anchorElement", void 0),
  e(
    [
      t({ type: Boolean, attribute: "disabled", reflect: !0 }),
      R(function (e) {
        this.mdcFoundation && this.mdcFoundation.setDisabled(e);
      }),
    ],
    He.prototype,
    "disabled",
    void 0
  ),
  e(
    [
      t({ type: Boolean }),
      R(function (e, t) {
        void 0 !== t && this.outlined !== t && this.layout(!1);
      }),
    ],
    He.prototype,
    "outlined",
    void 0
  ),
  e(
    [
      t({ type: String }),
      R(function (e, t) {
        void 0 !== t && this.label !== t && this.layout(!1);
      }),
    ],
    He.prototype,
    "label",
    void 0
  ),
  e([c()], He.prototype, "outlineOpen", void 0),
  e([c()], He.prototype, "outlineWidth", void 0),
  e(
    [
      t({ type: String }),
      R(function (e) {
        if (this.mdcFoundation) {
          const t = null === this.selected && !!e,
            i = this.selected && this.selected.value !== e;
          (t || i) && this.selectByValue(e), this.reportValidity();
        }
      }),
    ],
    He.prototype,
    "value",
    void 0
  ),
  e([t()], He.prototype, "name", void 0),
  e([c()], He.prototype, "selectedText", void 0),
  e([t({ type: String })], He.prototype, "icon", void 0),
  e([c()], He.prototype, "menuOpen", void 0),
  e([t({ type: String })], He.prototype, "helper", void 0),
  e([t({ type: Boolean })], He.prototype, "validateOnInitialRender", void 0),
  e([t({ type: String })], He.prototype, "validationMessage", void 0),
  e([t({ type: Boolean })], He.prototype, "required", void 0),
  e([t({ type: Boolean })], He.prototype, "naturalMenuWidth", void 0),
  e([c()], He.prototype, "isUiValid", void 0),
  e([t({ type: Boolean })], He.prototype, "fixedMenuPosition", void 0),
  e([n({ capture: !0 })], He.prototype, "handleTypeahead", null);
const Ue = h`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-select{display:inline-flex;position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87)}.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-select.mdc-select--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#6200ee;fill:var(--mdc-theme-primary, #6200ee)}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled)+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:rgba(0, 0, 0, 0.54)}.mdc-select.mdc-select--disabled .mdc-select__icon{color:rgba(0, 0, 0, 0.38)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:red}.mdc-select.mdc-select--disabled .mdc-floating-label{color:GrayText}.mdc-select.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}.mdc-select.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select.mdc-select--disabled .mdc-notched-outline__trailing{border-color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__icon{color:GrayText}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:GrayText}}.mdc-select .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-select .mdc-select__anchor{padding-left:16px;padding-right:0}[dir=rtl] .mdc-select .mdc-select__anchor,.mdc-select .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:16px}.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor{padding-left:0;padding-right:0}[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-select__anchor,.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:0}.mdc-select .mdc-select__icon{width:24px;height:24px;font-size:24px}.mdc-select .mdc-select__dropdown-icon{width:24px;height:24px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item,.mdc-select .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:12px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic,.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:12px;margin-right:0}.mdc-select__dropdown-icon{margin-left:12px;margin-right:12px;display:inline-flex;position:relative;align-self:center;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active,.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{position:absolute;top:0;left:0}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-graphic{width:41.6666666667%;height:20.8333333333%}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:1;transition:opacity 75ms linear 75ms}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:0;transition:opacity 75ms linear}[dir=rtl] .mdc-select__dropdown-icon,.mdc-select__dropdown-icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:0;transition:opacity 49.5ms linear}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:1;transition:opacity 100.5ms linear 49.5ms}.mdc-select__anchor{width:200px;min-width:0;flex:1 1 auto;position:relative;box-sizing:border-box;overflow:hidden;outline:none;cursor:pointer}.mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-select__selected-text-container{display:flex;appearance:none;pointer-events:none;box-sizing:border-box;width:auto;min-width:0;flex-grow:1;height:28px;border:none;outline:none;padding:0;background-color:transparent;color:inherit}.mdc-select__selected-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;width:100%;text-align:left}[dir=rtl] .mdc-select__selected-text,.mdc-select__selected-text[dir=rtl]{text-align:right}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid+.mdc-select-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--disabled{cursor:default;pointer-events:none}.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item{padding-left:12px;padding-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item,.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:12px;padding-right:12px}.mdc-select__menu .mdc-deprecated-list .mdc-select__icon,.mdc-select__menu .mdc-list .mdc-select__icon{margin-left:0;margin-right:0}[dir=rtl] .mdc-select__menu .mdc-deprecated-list .mdc-select__icon,[dir=rtl] .mdc-select__menu .mdc-list .mdc-select__icon,.mdc-select__menu .mdc-deprecated-list .mdc-select__icon[dir=rtl],.mdc-select__menu .mdc-list .mdc-select__icon[dir=rtl]{margin-left:0;margin-right:0}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-list-item__start{display:inline-flex;align-items:center}.mdc-select__option{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select__option,.mdc-select__option[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select__one-line-option.mdc-list-item--with-one-line{height:48px}.mdc-select__two-line-option.mdc-list-item--with-two-lines{height:64px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__start{margin-top:20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text{display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before{display:inline-block;width:0;height:28px;content:"";vertical-align:0}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end{display:block;margin-top:0;line-height:normal}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before{display:inline-block;width:0;height:36px;content:"";vertical-align:0}.mdc-select__option-with-leading-content{padding-left:0;padding-right:12px}.mdc-select__option-with-leading-content.mdc-list-item{padding-left:0;padding-right:auto}[dir=rtl] .mdc-select__option-with-leading-content.mdc-list-item,.mdc-select__option-with-leading-content.mdc-list-item[dir=rtl]{padding-left:auto;padding-right:0}.mdc-select__option-with-leading-content .mdc-list-item__start{margin-left:12px;margin-right:0}[dir=rtl] .mdc-select__option-with-leading-content .mdc-list-item__start,.mdc-select__option-with-leading-content .mdc-list-item__start[dir=rtl]{margin-left:0;margin-right:12px}.mdc-select__option-with-leading-content .mdc-list-item__start{width:36px;height:24px}[dir=rtl] .mdc-select__option-with-leading-content,.mdc-select__option-with-leading-content[dir=rtl]{padding-left:12px;padding-right:0}.mdc-select__option-with-meta.mdc-list-item{padding-left:auto;padding-right:0}[dir=rtl] .mdc-select__option-with-meta.mdc-list-item,.mdc-select__option-with-meta.mdc-list-item[dir=rtl]{padding-left:0;padding-right:auto}.mdc-select__option-with-meta .mdc-list-item__end{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select__option-with-meta .mdc-list-item__end,.mdc-select__option-with-meta .mdc-list-item__end[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--filled .mdc-select__anchor{height:56px;display:flex;align-items:baseline}.mdc-select--filled .mdc-select__anchor::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor::before{display:none}.mdc-select--filled .mdc-select__anchor{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-select--filled:not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke}.mdc-select--filled.mdc-select--disabled .mdc-select__anchor{background-color:#fafafa}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-select--filled:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--filled.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-select--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-select--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-select--filled .mdc-menu-surface--is-open-below{border-top-left-radius:0px;border-top-right-radius:0px}.mdc-select--filled.mdc-select--focused.mdc-line-ripple::after{transform:scale(1, 2);opacity:1}.mdc-select--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-select--filled .mdc-floating-label,.mdc-select--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{left:48px;right:initial}[dir=rtl] .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined{border:none}.mdc-select--outlined .mdc-select__anchor{height:56px}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-56px{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-select--outlined .mdc-select__anchor{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-select--outlined+.mdc-select-helper-text{margin-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-select__anchor{background-color:transparent}.mdc-select--outlined.mdc-select--disabled .mdc-select__anchor{background-color:transparent}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}.mdc-select--outlined .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-select--outlined .mdc-select__anchor{display:flex;align-items:baseline;overflow:visible}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined 250ms 1}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--outlined .mdc-select__anchor::before{display:none}.mdc-select--outlined .mdc-select__selected-text-container{display:flex;border:none;z-index:1;background-color:transparent}.mdc-select--outlined .mdc-select__icon{z-index:2}.mdc-select--outlined .mdc-floating-label{line-height:1.15rem;left:4px;right:initial}[dir=rtl] .mdc-select--outlined .mdc-floating-label,.mdc-select--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-select--outlined.mdc-select--focused .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake,.mdc-select--outlined.mdc-select--with-leading-icon[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 96px)}.mdc-select--outlined .mdc-menu-surface{margin-bottom:8px}.mdc-select--outlined.mdc-select--no-label .mdc-menu-surface,.mdc-select--outlined .mdc-menu-surface--is-open-below{margin-bottom:0}.mdc-select__anchor{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-select__anchor .mdc-select__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-select__anchor .mdc-select__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-select__anchor.mdc-ripple-upgraded--unbounded .mdc-select__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-select__anchor.mdc-ripple-upgraded--foreground-activation .mdc-select__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-select__anchor.mdc-ripple-upgraded--foreground-deactivation .mdc-select__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-select__anchor:hover .mdc-select__ripple::before,.mdc-select__anchor.mdc-ripple-surface--hover .mdc-select__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__anchor.mdc-ripple-upgraded--background-focused .mdc-select__ripple::before,.mdc-select__anchor:not(.mdc-ripple-upgraded):focus .mdc-select__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__anchor .mdc-select__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-deprecated-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-deprecated-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-deprecated-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-deprecated-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select-helper-text{margin:0;margin-left:16px;margin-right:16px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal}[dir=rtl] .mdc-select-helper-text,.mdc-select-helper-text[dir=rtl]{margin-left:16px;margin-right:16px}.mdc-select-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-select-helper-text--validation-msg{opacity:0;transition:opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-select--invalid+.mdc-select-helper-text--validation-msg,.mdc-select-helper-text--validation-msg-persistent{opacity:1}.mdc-select--with-leading-icon .mdc-select__icon{display:inline-block;box-sizing:border-box;border:none;text-decoration:none;cursor:pointer;user-select:none;flex-shrink:0;align-self:center;background-color:transparent;fill:currentColor}.mdc-select--with-leading-icon .mdc-select__icon{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon,.mdc-select--with-leading-icon .mdc-select__icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex="-1"]{cursor:default;pointer-events:none}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-block;vertical-align:top;outline:none}.mdc-select{width:100%}[hidden]{display:none}.mdc-select__icon{z-index:2}.mdc-select--with-leading-icon{--mdc-list-item-graphic-margin: calc( 48px - var(--mdc-list-item-graphic-size, 24px) - var(--mdc-list-side-padding, 16px) )}.mdc-select .mdc-select__anchor .mdc-select__selected-text{overflow:hidden}.mdc-select .mdc-select__anchor *{display:inline-flex}.mdc-select .mdc-select__anchor .mdc-floating-label{display:inline-block}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-idle-border-color, rgba(0, 0, 0, 0.38) );--mdc-notched-outline-notch-offset: 1px}:host(:not([disabled]):hover) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87);color:var(--mdc-select-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-select-idle-line-color, rgba(0, 0, 0, 0.42))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-select-hover-line-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--outlined):not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke;background-color:var(--mdc-select-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-select__dropdown-icon{fill:var(--mdc-select-error-dropdown-icon-color, var(--mdc-select-error-color, var(--mdc-theme-error, #b00020)))}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label,:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label::after{color:var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select.mdc-select--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}.mdc-select__menu--invalid{--mdc-theme-primary: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.6);color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54);fill:var(--mdc-select-dropdown-icon-color, rgba(0, 0, 0, 0.54))}:host(:not([disabled])) .mdc-select.mdc-select--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px;--mdc-notched-outline-notch-offset: 2px}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-select__dropdown-icon{fill:rgba(98,0,238,.87);fill:var(--mdc-select-focused-dropdown-icon-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)))}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label::after{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg){color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-select:not(.mdc-select--outlined).mdc-select--disabled .mdc-select__anchor{background-color:#fafafa;background-color:var(--mdc-select-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-select.mdc-select--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-select .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38);fill:var(--mdc-select-disabled-dropdown-icon-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select-helper-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}`,
  Ye = (e, t, i = !1) => {
    let d;
    const l = (...l) => {
      const c = i && !d;
      clearTimeout(d),
        (d = window.setTimeout(() => {
          (d = void 0), i || e(...l);
        }, t)),
        c && e(...l);
    };
    return (
      (l.cancel = () => {
        clearTimeout(d);
      }),
      l
    );
  };
p(
  [f("ha-select")],
  function (e, i) {
    class d extends i {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: d,
      d: [
        {
          kind: "field",
          decorators: [t({ type: Boolean })],
          key: "icon",
          value: void 0,
        },
        {
          kind: "method",
          key: "renderLeadingIcon",
          value: function () {
            return this.icon
              ? r`<span class="mdc-select__icon"
      ><slot name="icon"></slot
    ></span>`
              : E;
          },
        },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            C(A(d.prototype), "connectedCallback", this).call(this),
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
            C(A(d.prototype), "disconnectedCallback", this).call(this),
              window.removeEventListener(
                "translations-updated",
                this._translationsUpdated
              );
          },
        },
        {
          kind: "field",
          key: "_translationsUpdated",
          value() {
            return Ye(async () => {
              await T(), this.layoutOptions();
            }, 500);
          },
        },
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            Ue,
            h`
      .mdc-select:not(.mdc-select--disabled) .mdc-select__icon {
        color: var(--secondary-text-color);
      }
      .mdc-select__anchor {
        width: var(--ha-select-min-width, 200px);
      }
      .mdc-select--filled .mdc-floating-label {
        inset-inline-start: 12px;
        inset-inline-end: initial;
        direction: var(--direction);
      }
      .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label {
        inset-inline-start: 48px;
        inset-inline-end: initial;
        direction: var(--direction);
      }
      .mdc-select .mdc-select__anchor {
        padding-inline-start: 12px;
        padding-inline-end: 0px;
        direction: var(--direction);
      }
      .mdc-select__anchor .mdc-floating-label--float-above {
        transform-origin: var(--float-start);
      }
    `,
          ],
        },
      ],
    };
  },
  He
);
export {
  N as F,
  Ce as T,
  _e as a,
  Ae as b,
  ke as c,
  Ye as d,
  fe as e,
  we as l,
  ve as m,
  pe as n,
  ye as p,
  xe as r,
  Oe as s,
  he as t,
  be as u,
};
