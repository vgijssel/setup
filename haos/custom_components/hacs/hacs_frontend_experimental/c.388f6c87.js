import {
  x as e,
  z as t,
  M as i,
  f as d,
  e as o,
  B as c,
  i as l,
  y as n,
  k as a,
  d as r,
  ab as s,
  t as m,
  h,
  ac as p,
  R as f,
  p as u,
  _ as b,
  n as x,
  I as g,
  J as _,
  L as v,
  A as y,
  ad as k,
  N as w,
  Z as E,
  D as I,
  E as C,
  G as A,
  O as L,
  q as R,
  ae as T,
} from "./main-85e087f9.js";
import { o as O } from "./c.8e28b461.js";
import {
  o as z,
  L as F,
  s as S,
  n as D,
  a as $,
  K as V,
  C as B,
} from "./c.eab7754a.js";
var N,
  M,
  H = { ROOT: "mdc-form-field" },
  P = { LABEL_SELECTOR: ".mdc-form-field > label" },
  U = (function (i) {
    function d(e) {
      var o = i.call(this, t(t({}, d.defaultAdapter), e)) || this;
      return (
        (o.click = function () {
          o.handleClick();
        }),
        o
      );
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return H;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "strings", {
        get: function () {
          return P;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.init = function () {
        this.adapter.registerInteractionHandler("click", this.click);
      }),
      (d.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler("click", this.click);
      }),
      (d.prototype.handleClick = function () {
        var e = this;
        this.adapter.activateInputRipple(),
          requestAnimationFrame(function () {
            e.adapter.deactivateInputRipple();
          });
      }),
      d
    );
  })(i);
const Y =
  null !==
    (M = null === (N = window.ShadyDOM) || void 0 === N ? void 0 : N.inUse) &&
  void 0 !== M &&
  M;
class X extends c {
  constructor() {
    super(...arguments),
      (this.disabled = !1),
      (this.containingForm = null),
      (this.formDataListener = (e) => {
        this.disabled || this.setFormData(e.formData);
      });
  }
  findFormElement() {
    if (!this.shadowRoot || Y) return null;
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
(X.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
  d([o({ type: Boolean })], X.prototype, "disabled", void 0);
class W extends c {
  constructor() {
    super(...arguments),
      (this.alignEnd = !1),
      (this.spaceBetween = !1),
      (this.nowrap = !1),
      (this.label = ""),
      (this.mdcFoundationClass = U);
  }
  createAdapter() {
    return {
      registerInteractionHandler: (e, t) => {
        this.labelEl.addEventListener(e, t);
      },
      deregisterInteractionHandler: (e, t) => {
        this.labelEl.removeEventListener(e, t);
      },
      activateInputRipple: async () => {
        const e = this.input;
        if (e instanceof X) {
          const t = await e.ripple;
          t && t.startPress();
        }
      },
      deactivateInputRipple: async () => {
        const e = this.input;
        if (e instanceof X) {
          const t = await e.ripple;
          t && t.endPress();
        }
      },
    };
  }
  get input() {
    var e, t;
    return null !==
      (t = null === (e = this.slottedInputs) || void 0 === e ? void 0 : e[0]) &&
      void 0 !== t
      ? t
      : null;
  }
  render() {
    const e = {
      "mdc-form-field--align-end": this.alignEnd,
      "mdc-form-field--space-between": this.spaceBetween,
      "mdc-form-field--nowrap": this.nowrap,
    };
    return n`
      <div class="mdc-form-field ${a(e)}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
      </div>`;
  }
  click() {
    this._labelClick();
  }
  _labelClick() {
    const e = this.input;
    e && (e.focus(), e.click());
  }
}
d([o({ type: Boolean })], W.prototype, "alignEnd", void 0),
  d([o({ type: Boolean })], W.prototype, "spaceBetween", void 0),
  d([o({ type: Boolean })], W.prototype, "nowrap", void 0),
  d(
    [
      o({ type: String }),
      O(async function (e) {
        var t;
        null === (t = this.input) ||
          void 0 === t ||
          t.setAttribute("aria-label", e);
      }),
    ],
    W.prototype,
    "label",
    void 0
  ),
  d([l(".mdc-form-field")], W.prototype, "mdcRoot", void 0),
  d([z("", !0, "*")], W.prototype, "slottedInputs", void 0),
  d([l("label")], W.prototype, "labelEl", void 0);
const j = r`.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{margin-left:auto;margin-right:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}[dir=rtl] .mdc-form-field--space-between>label,.mdc-form-field--space-between>label[dir=rtl]{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}::slotted(mwc-switch){margin-right:10px}[dir=rtl] ::slotted(mwc-switch),::slotted(mwc-switch[dir=rtl]){margin-left:10px}`;
class G extends X {
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
      (this.rippleHandlers = new f(
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
        o = this.calculateAnimationStateName(
          this.checked,
          this.indeterminate,
          this.disabled
        );
      this.animationClass = `${e}-${o}`;
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
    return n`<mwc-ripple
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
    return n`
      <div class="mdc-checkbox mdc-checkbox--upgraded ${a(t)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              name="${u(this.name)}"
              aria-checked="${u(i)}"
              aria-label="${u(this.ariaLabel)}"
              aria-labelledby="${u(this.ariaLabelledBy)}"
              aria-describedby="${u(this.ariaDescribedBy)}"
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
d([l(".mdc-checkbox")], G.prototype, "mdcRoot", void 0),
  d([l("input")], G.prototype, "formElement", void 0),
  d([o({ type: Boolean, reflect: !0 })], G.prototype, "checked", void 0),
  d([o({ type: Boolean })], G.prototype, "indeterminate", void 0),
  d([o({ type: Boolean, reflect: !0 })], G.prototype, "disabled", void 0),
  d([o({ type: String, reflect: !0 })], G.prototype, "name", void 0),
  d([o({ type: String })], G.prototype, "value", void 0),
  d(
    [s, o({ type: String, attribute: "aria-label" })],
    G.prototype,
    "ariaLabel",
    void 0
  ),
  d(
    [s, o({ type: String, attribute: "aria-labelledby" })],
    G.prototype,
    "ariaLabelledBy",
    void 0
  ),
  d(
    [s, o({ type: String, attribute: "aria-describedby" })],
    G.prototype,
    "ariaDescribedBy",
    void 0
  ),
  d([o({ type: Boolean })], G.prototype, "reducedTouchTarget", void 0),
  d([m()], G.prototype, "animationClass", void 0),
  d([m()], G.prototype, "shouldRenderRipple", void 0),
  d([m()], G.prototype, "focused", void 0),
  d([h("mwc-ripple")], G.prototype, "ripple", void 0),
  d([p({ passive: !0 })], G.prototype, "handleRippleTouchStart", null);
const q = r`.mdc-checkbox{padding:calc((40px - 18px) / 2);padding:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);margin:calc((40px - 40px) / 2);margin:calc((var(--mdc-checkbox-touch-target-size, 40px) - 40px) / 2)}.mdc-checkbox .mdc-checkbox__ripple::before,.mdc-checkbox .mdc-checkbox__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-checkbox:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px) / 2);top:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);left:calc((40px - 18px) / 2);left:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px) / 2);top:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);right:calc((40px - 40px) / 2);right:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);left:calc((40px - 40px) / 2);left:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);width:40px;width:var(--mdc-checkbox-touch-target-size, 40px);height:40px;height:var(--mdc-checkbox-touch-target-size, 40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}100%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.38);border-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0, 0, 0, 0.38);background-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:GrayText;border-color:var(--mdc-checkbox-disabled-color, GrayText);background-color:transparent}.mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:GrayText;background-color:transparent;background-color:var(--mdc-checkbox-disabled-color, transparent)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:GrayText;color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:GrayText;border-color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size, 48px) - var(--mdc-checkbox-state-layer-size, 40px)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px) / 2);top:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);right:calc((40px - 48px) / 2);right:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);left:calc((40px - 48px) / 2);left:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);width:48px;width:var(--mdc-checkbox-state-layer-size, 48px);height:48px;height:var(--mdc-checkbox-state-layer-size, 48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:none;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}`;
b(
  [x("ha-checkbox")],
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
            q,
            r`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  G
);
var K = { NOTCH_ELEMENT_SELECTOR: ".mdc-notched-outline__notch" },
  Q = { NOTCH_ELEMENT_PADDING: 8 },
  J = {
    NO_LABEL: "mdc-notched-outline--no-label",
    OUTLINE_NOTCHED: "mdc-notched-outline--notched",
    OUTLINE_UPGRADED: "mdc-notched-outline--upgraded",
  },
  Z = (function (i) {
    function d(e) {
      return i.call(this, t(t({}, d.defaultAdapter), e)) || this;
    }
    return (
      e(d, i),
      Object.defineProperty(d, "strings", {
        get: function () {
          return K;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return J;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "numbers", {
        get: function () {
          return Q;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.notch = function (e) {
        var t = d.cssClasses.OUTLINE_NOTCHED;
        e > 0 && (e += Q.NOTCH_ELEMENT_PADDING),
          this.adapter.setNotchWidthProperty(e),
          this.adapter.addClass(t);
      }),
      (d.prototype.closeNotch = function () {
        var e = d.cssClasses.OUTLINE_NOTCHED;
        this.adapter.removeClass(e), this.adapter.removeNotchWidthProperty();
      }),
      d
    );
  })(i);
class ee extends c {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = Z),
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
    const e = a({ "mdc-notched-outline--notched": this.open });
    return n`
      <span class="mdc-notched-outline ${e}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
  }
}
d([l(".mdc-notched-outline")], ee.prototype, "mdcRoot", void 0),
  d([o({ type: Number })], ee.prototype, "width", void 0),
  d([o({ type: Boolean, reflect: !0 })], ee.prototype, "open", void 0),
  d([l(".mdc-notched-outline__notch")], ee.prototype, "notchElement", void 0);
const te = r`.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] :host,:host([dir=rtl]){text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / 0.75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading,.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color, var(--mdc-theme-primary, #6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width, 1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset, 0)}`;
let ie = class extends ee {};
(ie.styles = [te]), (ie = d([x("mwc-notched-outline")], ie));
var de = {
    LABEL_FLOAT_ABOVE: "mdc-floating-label--float-above",
    LABEL_REQUIRED: "mdc-floating-label--required",
    LABEL_SHAKE: "mdc-floating-label--shake",
    ROOT: "mdc-floating-label",
  },
  oe = (function (i) {
    function d(e) {
      var o = i.call(this, t(t({}, d.defaultAdapter), e)) || this;
      return (
        (o.shakeAnimationEndHandler = function () {
          o.handleShakeAnimationEnd();
        }),
        o
      );
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return de;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.init = function () {
        this.adapter.registerInteractionHandler(
          "animationend",
          this.shakeAnimationEndHandler
        );
      }),
      (d.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler(
          "animationend",
          this.shakeAnimationEndHandler
        );
      }),
      (d.prototype.getWidth = function () {
        return this.adapter.getWidth();
      }),
      (d.prototype.shake = function (e) {
        var t = d.cssClasses.LABEL_SHAKE;
        e ? this.adapter.addClass(t) : this.adapter.removeClass(t);
      }),
      (d.prototype.float = function (e) {
        var t = d.cssClasses,
          i = t.LABEL_FLOAT_ABOVE,
          o = t.LABEL_SHAKE;
        e
          ? this.adapter.addClass(i)
          : (this.adapter.removeClass(i), this.adapter.removeClass(o));
      }),
      (d.prototype.setRequired = function (e) {
        var t = d.cssClasses.LABEL_REQUIRED;
        e ? this.adapter.addClass(t) : this.adapter.removeClass(t);
      }),
      (d.prototype.handleShakeAnimationEnd = function () {
        var e = d.cssClasses.LABEL_SHAKE;
        this.adapter.removeClass(e);
      }),
      d
    );
  })(i);
const ce = g(
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
        (this.foundation = new oe(i)), this.foundation.init();
      }
      return this.render(t);
    }
    render(e) {
      return this.foundation;
    }
  }
);
var le = {
    LINE_RIPPLE_ACTIVE: "mdc-line-ripple--active",
    LINE_RIPPLE_DEACTIVATING: "mdc-line-ripple--deactivating",
  },
  ne = (function (i) {
    function d(e) {
      var o = i.call(this, t(t({}, d.defaultAdapter), e)) || this;
      return (
        (o.transitionEndHandler = function (e) {
          o.handleTransitionEnd(e);
        }),
        o
      );
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return le;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.init = function () {
        this.adapter.registerEventHandler(
          "transitionend",
          this.transitionEndHandler
        );
      }),
      (d.prototype.destroy = function () {
        this.adapter.deregisterEventHandler(
          "transitionend",
          this.transitionEndHandler
        );
      }),
      (d.prototype.activate = function () {
        this.adapter.removeClass(le.LINE_RIPPLE_DEACTIVATING),
          this.adapter.addClass(le.LINE_RIPPLE_ACTIVE);
      }),
      (d.prototype.setRippleCenter = function (e) {
        this.adapter.setStyle("transform-origin", e + "px center");
      }),
      (d.prototype.deactivate = function () {
        this.adapter.addClass(le.LINE_RIPPLE_DEACTIVATING);
      }),
      (d.prototype.handleTransitionEnd = function (e) {
        var t = this.adapter.hasClass(le.LINE_RIPPLE_DEACTIVATING);
        "opacity" === e.propertyName &&
          t &&
          (this.adapter.removeClass(le.LINE_RIPPLE_ACTIVE),
          this.adapter.removeClass(le.LINE_RIPPLE_DEACTIVATING));
      }),
      d
    );
  })(i);
const ae = g(
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
        (this.foundation = new ne(i)), this.foundation.init();
      }
      return this.render();
    }
    render() {
      return this.foundation;
    }
  }
);
var re = {
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
  se = {
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
  me = { LABEL_SCALE: 0.75 },
  he = ["pattern", "min", "max", "required", "step", "minlength", "maxlength"],
  pe = ["color", "date", "datetime-local", "month", "range", "time", "week"],
  fe = ["mousedown", "touchstart"],
  ue = ["click", "keydown"],
  be = (function (i) {
    function d(e, o) {
      void 0 === o && (o = {});
      var c = i.call(this, t(t({}, d.defaultAdapter), e)) || this;
      return (
        (c.isFocused = !1),
        (c.receivedUserInput = !1),
        (c.valid = !0),
        (c.useNativeValidation = !0),
        (c.validateOnValueChange = !0),
        (c.helperText = o.helperText),
        (c.characterCounter = o.characterCounter),
        (c.leadingIcon = o.leadingIcon),
        (c.trailingIcon = o.trailingIcon),
        (c.inputFocusHandler = function () {
          c.activateFocus();
        }),
        (c.inputBlurHandler = function () {
          c.deactivateFocus();
        }),
        (c.inputInputHandler = function () {
          c.handleInput();
        }),
        (c.setPointerXOffset = function (e) {
          c.setTransformOrigin(e);
        }),
        (c.textFieldInteractionHandler = function () {
          c.handleTextFieldInteraction();
        }),
        (c.validationAttributeChangeHandler = function (e) {
          c.handleValidationAttributeChange(e);
        }),
        c
      );
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return se;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "strings", {
        get: function () {
          return re;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "numbers", {
        get: function () {
          return me;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d.prototype, "shouldAlwaysFloat", {
        get: function () {
          var e = this.getNativeInput().type;
          return pe.indexOf(e) >= 0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d.prototype, "shouldFloat", {
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
      Object.defineProperty(d.prototype, "shouldShake", {
        get: function () {
          return !this.isFocused && !this.isValid() && !!this.getValue();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.init = function () {
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
          for (var o = y(fe), c = o.next(); !c.done; c = o.next()) {
            var l = c.value;
            this.adapter.registerInputInteractionHandler(
              l,
              this.setPointerXOffset
            );
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            c && !c.done && (t = o.return) && t.call(o);
          } finally {
            if (e) throw e.error;
          }
        }
        try {
          for (var n = y(ue), a = n.next(); !a.done; a = n.next()) {
            l = a.value;
            this.adapter.registerTextFieldInteractionHandler(
              l,
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
      (d.prototype.destroy = function () {
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
          for (var o = y(fe), c = o.next(); !c.done; c = o.next()) {
            var l = c.value;
            this.adapter.deregisterInputInteractionHandler(
              l,
              this.setPointerXOffset
            );
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            c && !c.done && (t = o.return) && t.call(o);
          } finally {
            if (e) throw e.error;
          }
        }
        try {
          for (var n = y(ue), a = n.next(); !a.done; a = n.next()) {
            l = a.value;
            this.adapter.deregisterTextFieldInteractionHandler(
              l,
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
      (d.prototype.handleTextFieldInteraction = function () {
        var e = this.adapter.getNativeInput();
        (e && e.disabled) || (this.receivedUserInput = !0);
      }),
      (d.prototype.handleValidationAttributeChange = function (e) {
        var t = this;
        e.some(function (e) {
          return (
            he.indexOf(e) > -1 &&
            (t.styleValidity(!0),
            t.adapter.setLabelRequired(t.getNativeInput().required),
            !0)
          );
        }),
          e.indexOf("maxlength") > -1 &&
            this.setcharacterCounter(this.getValue().length);
      }),
      (d.prototype.notchOutline = function (e) {
        if (this.adapter.hasOutline() && this.adapter.hasLabel())
          if (e) {
            var t = this.adapter.getLabelWidth() * me.LABEL_SCALE;
            this.adapter.notchOutline(t);
          } else this.adapter.closeOutline();
      }),
      (d.prototype.activateFocus = function () {
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
      (d.prototype.setTransformOrigin = function (e) {
        if (!this.isDisabled() && !this.adapter.hasOutline()) {
          var t = e.touches,
            i = t ? t[0] : e,
            d = i.target.getBoundingClientRect(),
            o = i.clientX - d.left;
          this.adapter.setLineRippleTransformOrigin(o);
        }
      }),
      (d.prototype.handleInput = function () {
        this.autoCompleteFocus(),
          this.setcharacterCounter(this.getValue().length);
      }),
      (d.prototype.autoCompleteFocus = function () {
        this.receivedUserInput || this.activateFocus();
      }),
      (d.prototype.deactivateFocus = function () {
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
      (d.prototype.getValue = function () {
        return this.getNativeInput().value;
      }),
      (d.prototype.setValue = function (e) {
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
      (d.prototype.isValid = function () {
        return this.useNativeValidation
          ? this.isNativeInputValid()
          : this.valid;
      }),
      (d.prototype.setValid = function (e) {
        (this.valid = e), this.styleValidity(e);
        var t = !e && !this.isFocused && !!this.getValue();
        this.adapter.hasLabel() && this.adapter.shakeLabel(t);
      }),
      (d.prototype.setValidateOnValueChange = function (e) {
        this.validateOnValueChange = e;
      }),
      (d.prototype.getValidateOnValueChange = function () {
        return this.validateOnValueChange;
      }),
      (d.prototype.setUseNativeValidation = function (e) {
        this.useNativeValidation = e;
      }),
      (d.prototype.isDisabled = function () {
        return this.getNativeInput().disabled;
      }),
      (d.prototype.setDisabled = function (e) {
        (this.getNativeInput().disabled = e), this.styleDisabled(e);
      }),
      (d.prototype.setHelperTextContent = function (e) {
        this.helperText && this.helperText.setContent(e);
      }),
      (d.prototype.setLeadingIconAriaLabel = function (e) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(e);
      }),
      (d.prototype.setLeadingIconContent = function (e) {
        this.leadingIcon && this.leadingIcon.setContent(e);
      }),
      (d.prototype.setTrailingIconAriaLabel = function (e) {
        this.trailingIcon && this.trailingIcon.setAriaLabel(e);
      }),
      (d.prototype.setTrailingIconContent = function (e) {
        this.trailingIcon && this.trailingIcon.setContent(e);
      }),
      (d.prototype.setcharacterCounter = function (e) {
        if (this.characterCounter) {
          var t = this.getNativeInput().maxLength;
          if (-1 === t)
            throw new Error(
              "MDCTextFieldFoundation: Expected maxlength html property on text input or textarea."
            );
          this.characterCounter.setCounterValue(e, t);
        }
      }),
      (d.prototype.isBadInput = function () {
        return this.getNativeInput().validity.badInput || !1;
      }),
      (d.prototype.isNativeInputValid = function () {
        return this.getNativeInput().validity.valid;
      }),
      (d.prototype.styleValidity = function (e) {
        var t = d.cssClasses.INVALID;
        if (
          (e ? this.adapter.removeClass(t) : this.adapter.addClass(t),
          this.helperText)
        ) {
          if ((this.helperText.setValidity(e), !this.helperText.isValidation()))
            return;
          var i = this.helperText.isVisible(),
            o = this.helperText.getId();
          i && o
            ? this.adapter.setInputAttr(re.ARIA_DESCRIBEDBY, o)
            : this.adapter.removeInputAttr(re.ARIA_DESCRIBEDBY);
        }
      }),
      (d.prototype.styleFocused = function (e) {
        var t = d.cssClasses.FOCUSED;
        e ? this.adapter.addClass(t) : this.adapter.removeClass(t);
      }),
      (d.prototype.styleDisabled = function (e) {
        var t = d.cssClasses,
          i = t.DISABLED,
          o = t.INVALID;
        e
          ? (this.adapter.addClass(i), this.adapter.removeClass(o))
          : this.adapter.removeClass(i),
          this.leadingIcon && this.leadingIcon.setDisabled(e),
          this.trailingIcon && this.trailingIcon.setDisabled(e);
      }),
      (d.prototype.styleFloating = function (e) {
        var t = d.cssClasses.LABEL_FLOATING;
        e ? this.adapter.addClass(t) : this.adapter.removeClass(t);
      }),
      (d.prototype.getNativeInput = function () {
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
      d
    );
  })(i),
  xe = be;
const { I: ge } = k,
  _e = (e) => null === e || ("object" != typeof e && "function" != typeof e),
  ve = (e, t) =>
    void 0 === t
      ? void 0 !== (null == e ? void 0 : e._$litType$)
      : (null == e ? void 0 : e._$litType$) === t,
  ye = (e) => void 0 === e.strings,
  ke = () => document.createComment(""),
  we = (e, t, i) => {
    var d;
    const o = e._$AA.parentNode,
      c = void 0 === t ? e._$AB : t._$AA;
    if (void 0 === i) {
      const t = o.insertBefore(ke(), c),
        d = o.insertBefore(ke(), c);
      i = new ge(t, d, e, e.options);
    } else {
      const t = i._$AB.nextSibling,
        l = i._$AM,
        n = l !== e;
      if (n) {
        let t;
        null === (d = i._$AQ) || void 0 === d || d.call(i, e),
          (i._$AM = e),
          void 0 !== i._$AP && (t = e._$AU) !== l._$AU && i._$AP(t);
      }
      if (t !== c || n) {
        let e = i._$AA;
        for (; e !== t; ) {
          const t = e.nextSibling;
          o.insertBefore(e, c), (e = t);
        }
      }
    }
    return i;
  },
  Ee = (e, t, i = e) => (e._$AI(t, i), e),
  Ie = {},
  Ce = (e, t = Ie) => (e._$AH = t),
  Ae = (e) => e._$AH,
  Le = (e) => {
    var t;
    null === (t = e._$AP) || void 0 === t || t.call(e, !1, !0);
    let i = e._$AA;
    const d = e._$AB.nextSibling;
    for (; i !== d; ) {
      const e = i.nextSibling;
      i.remove(), (i = e);
    }
  },
  Re = (e) => {
    e._$AR();
  },
  Te = g(
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
        if (!ye(e))
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
        return Ce(e), t;
      }
    }
  ),
  Oe = ["touchstart", "touchmove", "scroll", "mousewheel"],
  ze = (e = {}) => {
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
class Fe extends X {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = xe),
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
      (this._validity = ze()),
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
    return n`
      <label class="mdc-text-field ${a(i)}">
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
      : n`
      <span class="mdc-text-field__ripple"></span>
    `;
  }
  renderOutline() {
    return this.outlined
      ? n`
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
      ? n`
      <span
          .floatingLabelFoundation=${ce(this.label)}
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
    return n`<i class="material-icons mdc-text-field__icon ${a({
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
    return n`<span class="mdc-text-field__affix ${a({
      "mdc-text-field__affix--prefix": !t,
      "mdc-text-field__affix--suffix": t,
    })}">
        ${e}</span>`;
  }
  renderInput(e) {
    const t = -1 === this.minLength ? void 0 : this.minLength,
      i = -1 === this.maxLength ? void 0 : this.maxLength,
      d = this.autocapitalize ? this.autocapitalize : void 0,
      o = this.validationMessage && !this.isUiValid,
      c = this.label ? "label" : void 0,
      l = e ? "helper-text" : void 0,
      a = this.focused || this.helperPersistent || o ? "helper-text" : void 0;
    return n`
      <input
          aria-labelledby=${u(c)}
          aria-controls="${u(l)}"
          aria-describedby="${u(a)}"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${Te(this.value)}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${u(t)}"
          maxlength="${u(i)}"
          pattern="${u(this.pattern ? this.pattern : void 0)}"
          min="${u("" === this.min ? void 0 : this.min)}"
          max="${u("" === this.max ? void 0 : this.max)}"
          step="${u(null === this.step ? void 0 : this.step)}"
          size="${u(null === this.size ? void 0 : this.size)}"
          name="${u("" === this.name ? void 0 : this.name)}"
          inputmode="${u(this.inputMode)}"
          autocapitalize="${u(d)}"
          @input="${this.handleInputChange}"
          @focus="${this.onInputFocus}"
          @blur="${this.onInputBlur}">`;
  }
  renderLineRipple() {
    return this.outlined
      ? ""
      : n`
      <span .lineRippleFoundation=${ae()}></span>
    `;
  }
  renderHelperText(e, t) {
    const i = this.validationMessage && !this.isUiValid,
      d = {
        "mdc-text-field-helper-text--persistent": this.helperPersistent,
        "mdc-text-field-helper-text--validation-msg": i,
      },
      o = this.focused || this.helperPersistent || i ? void 0 : "true",
      c = i ? this.validationMessage : this.helper;
    return e
      ? n`
      <div class="mdc-text-field-helper-line">
        <div id="helper-text"
             aria-hidden="${u(o)}"
             class="mdc-text-field-helper-text ${a(d)}"
             >${c}</div>
        ${this.renderCharCounter(t)}
      </div>`
      : "";
  }
  renderCharCounter(e) {
    const t = Math.min(this.value.length, this.maxLength);
    return e
      ? n`
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
    let i = ze(t);
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
        this.formElement.addEventListener(e, t, { passive: e in Oe }),
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
d([l(".mdc-text-field")], Fe.prototype, "mdcRoot", void 0),
  d([l("input")], Fe.prototype, "formElement", void 0),
  d([l(".mdc-floating-label")], Fe.prototype, "labelElement", void 0),
  d([l(".mdc-line-ripple")], Fe.prototype, "lineRippleElement", void 0),
  d([l("mwc-notched-outline")], Fe.prototype, "outlineElement", void 0),
  d([l(".mdc-notched-outline__notch")], Fe.prototype, "notchElement", void 0),
  d([o({ type: String })], Fe.prototype, "value", void 0),
  d([o({ type: String })], Fe.prototype, "type", void 0),
  d([o({ type: String })], Fe.prototype, "placeholder", void 0),
  d(
    [
      o({ type: String }),
      O(function (e, t) {
        void 0 !== t && this.label !== t && this.layout();
      }),
    ],
    Fe.prototype,
    "label",
    void 0
  ),
  d([o({ type: String })], Fe.prototype, "icon", void 0),
  d([o({ type: String })], Fe.prototype, "iconTrailing", void 0),
  d([o({ type: Boolean, reflect: !0 })], Fe.prototype, "disabled", void 0),
  d([o({ type: Boolean })], Fe.prototype, "required", void 0),
  d([o({ type: Number })], Fe.prototype, "minLength", void 0),
  d([o({ type: Number })], Fe.prototype, "maxLength", void 0),
  d(
    [
      o({ type: Boolean, reflect: !0 }),
      O(function (e, t) {
        void 0 !== t && this.outlined !== t && this.layout();
      }),
    ],
    Fe.prototype,
    "outlined",
    void 0
  ),
  d([o({ type: String })], Fe.prototype, "helper", void 0),
  d([o({ type: Boolean })], Fe.prototype, "validateOnInitialRender", void 0),
  d([o({ type: String })], Fe.prototype, "validationMessage", void 0),
  d([o({ type: Boolean })], Fe.prototype, "autoValidate", void 0),
  d([o({ type: String })], Fe.prototype, "pattern", void 0),
  d([o({ type: String })], Fe.prototype, "min", void 0),
  d([o({ type: String })], Fe.prototype, "max", void 0),
  d([o({ type: String })], Fe.prototype, "step", void 0),
  d([o({ type: Number })], Fe.prototype, "size", void 0),
  d([o({ type: Boolean })], Fe.prototype, "helperPersistent", void 0),
  d([o({ type: Boolean })], Fe.prototype, "charCounter", void 0),
  d([o({ type: Boolean })], Fe.prototype, "endAligned", void 0),
  d([o({ type: String })], Fe.prototype, "prefix", void 0),
  d([o({ type: String })], Fe.prototype, "suffix", void 0),
  d([o({ type: String })], Fe.prototype, "name", void 0),
  d([o({ type: String })], Fe.prototype, "inputMode", void 0),
  d([o({ type: Boolean })], Fe.prototype, "readOnly", void 0),
  d([o({ type: String })], Fe.prototype, "autocapitalize", void 0),
  d([m()], Fe.prototype, "outlineOpen", void 0),
  d([m()], Fe.prototype, "outlineWidth", void 0),
  d([m()], Fe.prototype, "isUiValid", void 0),
  d([m()], Fe.prototype, "focused", void 0),
  d([p({ passive: !0 })], Fe.prototype, "handleInputChange", null);
const Se = r`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0, 0, 0, 0.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);width:100%;min-width:0;border:none;border-radius:0;background:none;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens: none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field__affix--prefix,.mdc-text-field__affix--prefix[dir=rtl]{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl]{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field__affix--suffix,.mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-text-field--filled:hover .mdc-text-field__ripple::before,.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:whitesmoke}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-text-field--filled .mdc-floating-label,.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens: none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-text-field--outlined{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined{padding-right:max(16px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px, var(--mdc-shape-small, 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-right:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::before,.mdc-text-field--outlined .mdc-text-field__ripple::after{content:none}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-10.25px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-10.25px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-24.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-24.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer,.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl]{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateX(1px) translateY(1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl]{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}[dir=rtl] .mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake,.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}[dir=rtl] .mdc-text-field--with-trailing-icon,.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0, 0, 0, 0.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl]{text-align:left}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix{direction:ltr}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading{order:1}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{order:2}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input{order:3}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{order:4}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing{order:5}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix{padding-right:12px}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}[dir=rtl] .mdc-text-field__icon--leading,.mdc-text-field__icon--leading[dir=rtl]{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0px;margin-right:0px}[dir=rtl] .mdc-text-field__icon--trailing,.mdc-text-field__icon--trailing[dir=rtl]{margin-left:0px;margin-right:0px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:none}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06);border-bottom-color:var(--mdc-text-field-disabled-line-color, rgba(0, 0, 0, 0.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field__input{direction:inherit}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon{color:var(--mdc-text-field-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}`;
b(
  [x("ha-textfield")],
  function (e, t) {
    class i extends t {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "invalid",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [o({ attribute: "error-message" })],
          key: "errorMessage",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "icon",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "iconTrailing",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [o()],
          key: "autocomplete",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [l("input")],
          key: "formElement",
          value: void 0,
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            C(A(i.prototype), "updated", this).call(this, e),
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
            return n`
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
            Se,
            r`
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
              ? r`
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
              : r``,
          ],
        },
      ],
    };
  },
  Fe
);
let De = class extends G {};
(De.styles = [q]), (De = d([x("mwc-checkbox")], De));
class $e extends F {
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
          : n``,
      d = this.hasMeta && this.left ? this.renderMeta() : n``,
      o = this.renderRipple();
    return n`
      ${o}
      ${i}
      ${this.left ? "" : t}
      <span class=${a(e)}>
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
d([l("slot")], $e.prototype, "slotElement", void 0),
  d([l("mwc-checkbox")], $e.prototype, "checkboxElement", void 0),
  d([o({ type: Boolean })], $e.prototype, "left", void 0),
  d([o({ type: String, reflect: !0 })], $e.prototype, "graphic", void 0);
const Ve = r`:host(:not([twoline])){height:56px}:host(:not([left])) .mdc-deprecated-list-item__meta{height:40px;width:40px}`;
b(
  [x("ha-check-list-item")],
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
            S,
            Ve,
            r`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  $e
),
  b(
    [x("ha-formfield")],
    function (e, t) {
      return {
        F: class extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        },
        d: [
          {
            kind: "method",
            key: "_labelClick",
            value: function () {
              const e = this.input;
              if (e)
                switch ((e.focus(), e.tagName)) {
                  case "HA-CHECKBOX":
                  case "HA-RADIO":
                    if (e.disabled) break;
                    (e.checked = !e.checked), L(e, "change");
                    break;
                  default:
                    e.click();
                }
            },
          },
          {
            kind: "field",
            static: !0,
            key: "styles",
            value: () => [
              j,
              r`
      :host(:not([alignEnd])) ::slotted(ha-switch) {
        margin-right: 10px;
        margin-inline-end: 10px;
        margin-inline-start: inline;
      }
      .mdc-form-field > label {
        direction: var(--direction);
        margin-inline-start: 0;
        margin-inline-end: auto;
        padding-inline-start: 4px;
        padding-inline-end: 0;
      }
    `,
            ],
          },
        ],
      };
    },
    W
  );
const Be = (e) => e.stopPropagation();
var Ne = ["input", "button", "textarea", "select"],
  Me = function (e) {
    var t = e.target;
    if (t) {
      var i = ("" + t.tagName).toLowerCase();
      -1 === Ne.indexOf(i) && e.preventDefault();
    }
  };
function He(e, t) {
  for (var i = new Map(), d = 0; d < e; d++) {
    var o = t(d).trim();
    if (o) {
      var c = o[0].toLowerCase();
      i.has(c) || i.set(c, []),
        i.get(c).push({ text: o.toLowerCase(), index: d });
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
function Pe(e, t) {
  var i,
    d = e.nextChar,
    o = e.focusItemAtIndex,
    c = e.sortedIndexByFirstChar,
    l = e.focusedItemIndex,
    n = e.skipFocus,
    a = e.isItemAtIndexDisabled;
  return (
    clearTimeout(t.bufferClearTimeout),
    (t.bufferClearTimeout = setTimeout(function () {
      !(function (e) {
        e.typeaheadBuffer = "";
      })(t);
    }, D.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS)),
    (t.typeaheadBuffer = t.typeaheadBuffer + d),
    (i =
      1 === t.typeaheadBuffer.length
        ? (function (e, t, i, d) {
            var o = d.typeaheadBuffer[0],
              c = e.get(o);
            if (!c) return -1;
            if (
              o === d.currentFirstChar &&
              c[d.sortedIndexCursor].index === t
            ) {
              d.sortedIndexCursor = (d.sortedIndexCursor + 1) % c.length;
              var l = c[d.sortedIndexCursor].index;
              if (!i(l)) return l;
            }
            d.currentFirstChar = o;
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
          })(c, l, a, t)
        : (function (e, t, i) {
            var d = i.typeaheadBuffer[0],
              o = e.get(d);
            if (!o) return -1;
            var c = o[i.sortedIndexCursor];
            if (0 === c.text.lastIndexOf(i.typeaheadBuffer, 0) && !t(c.index))
              return c.index;
            var l = (i.sortedIndexCursor + 1) % o.length,
              n = -1;
            for (; l !== i.sortedIndexCursor; ) {
              var a = o[l],
                r = 0 === a.text.lastIndexOf(i.typeaheadBuffer, 0),
                s = !t(a.index);
              if (r && s) {
                n = l;
                break;
              }
              l = (l + 1) % o.length;
            }
            if (-1 !== n)
              return (i.sortedIndexCursor = n), o[i.sortedIndexCursor].index;
            return -1;
          })(c, a, t)),
    -1 === i || n || o(i),
    i
  );
}
function Ue(e) {
  return e.typeaheadBuffer.length > 0;
}
var Ye = {
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
  Xe = {
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
  We = { LABEL_SCALE: 0.75, UNSET_INDEX: -1, CLICK_DEBOUNCE_TIMEOUT_MS: 330 },
  je = (function (i) {
    function d(e, o) {
      void 0 === o && (o = {});
      var c = i.call(this, t(t({}, d.defaultAdapter), e)) || this;
      return (
        (c.disabled = !1),
        (c.isMenuOpen = !1),
        (c.useDefaultValidation = !0),
        (c.customValidity = !0),
        (c.lastSelectedIndex = We.UNSET_INDEX),
        (c.clickDebounceTimeout = 0),
        (c.recentlyClicked = !1),
        (c.leadingIcon = o.leadingIcon),
        (c.helperText = o.helperText),
        c
      );
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return Ye;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "numbers", {
        get: function () {
          return We;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "strings", {
        get: function () {
          return Xe;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
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
      (d.prototype.getSelectedIndex = function () {
        return this.adapter.getSelectedIndex();
      }),
      (d.prototype.setSelectedIndex = function (e, t, i) {
        void 0 === t && (t = !1),
          void 0 === i && (i = !1),
          e >= this.adapter.getMenuItemCount() ||
            (e === We.UNSET_INDEX
              ? this.adapter.setSelectedText("")
              : this.adapter.setSelectedText(
                  this.adapter.getMenuItemTextAtIndex(e).trim()
                ),
            this.adapter.setSelectedIndex(e),
            t && this.adapter.closeMenu(),
            i || this.lastSelectedIndex === e || this.handleChange(),
            (this.lastSelectedIndex = e));
      }),
      (d.prototype.setValue = function (e, t) {
        void 0 === t && (t = !1);
        var i = this.adapter.getMenuItemValues().indexOf(e);
        this.setSelectedIndex(i, !1, t);
      }),
      (d.prototype.getValue = function () {
        var e = this.adapter.getSelectedIndex(),
          t = this.adapter.getMenuItemValues();
        return e !== We.UNSET_INDEX ? t[e] : "";
      }),
      (d.prototype.getDisabled = function () {
        return this.disabled;
      }),
      (d.prototype.setDisabled = function (e) {
        (this.disabled = e),
          this.disabled
            ? (this.adapter.addClass(Ye.DISABLED), this.adapter.closeMenu())
            : this.adapter.removeClass(Ye.DISABLED),
          this.leadingIcon && this.leadingIcon.setDisabled(this.disabled),
          this.disabled
            ? this.adapter.removeSelectAnchorAttr("tabindex")
            : this.adapter.setSelectAnchorAttr("tabindex", "0"),
          this.adapter.setSelectAnchorAttr(
            "aria-disabled",
            this.disabled.toString()
          );
      }),
      (d.prototype.openMenu = function () {
        this.adapter.addClass(Ye.ACTIVATED),
          this.adapter.openMenu(),
          (this.isMenuOpen = !0),
          this.adapter.setSelectAnchorAttr("aria-expanded", "true");
      }),
      (d.prototype.setHelperTextContent = function (e) {
        this.helperText && this.helperText.setContent(e);
      }),
      (d.prototype.layout = function () {
        if (this.adapter.hasLabel()) {
          var e = this.getValue().length > 0,
            t = this.adapter.hasClass(Ye.FOCUSED),
            i = e || t,
            d = this.adapter.hasClass(Ye.REQUIRED);
          this.notchOutline(i),
            this.adapter.floatLabel(i),
            this.adapter.setLabelRequired(d);
        }
      }),
      (d.prototype.layoutOptions = function () {
        var e = this.adapter.getMenuItemValues().indexOf(this.getValue());
        this.setSelectedIndex(e, !1, !0);
      }),
      (d.prototype.handleMenuOpened = function () {
        if (0 !== this.adapter.getMenuItemValues().length) {
          var e = this.getSelectedIndex(),
            t = e >= 0 ? e : 0;
          this.adapter.focusMenuItemAtIndex(t);
        }
      }),
      (d.prototype.handleMenuClosing = function () {
        this.adapter.setSelectAnchorAttr("aria-expanded", "false");
      }),
      (d.prototype.handleMenuClosed = function () {
        this.adapter.removeClass(Ye.ACTIVATED),
          (this.isMenuOpen = !1),
          this.adapter.isSelectAnchorFocused() || this.blur();
      }),
      (d.prototype.handleChange = function () {
        this.layout(),
          this.adapter.notifyChange(this.getValue()),
          this.adapter.hasClass(Ye.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (d.prototype.handleMenuItemAction = function (e) {
        this.setSelectedIndex(e, !0);
      }),
      (d.prototype.handleFocus = function () {
        this.adapter.addClass(Ye.FOCUSED),
          this.layout(),
          this.adapter.activateBottomLine();
      }),
      (d.prototype.handleBlur = function () {
        this.isMenuOpen || this.blur();
      }),
      (d.prototype.handleClick = function (e) {
        this.disabled ||
          this.recentlyClicked ||
          (this.setClickDebounceTimeout(),
          this.isMenuOpen
            ? this.adapter.closeMenu()
            : (this.adapter.setRippleCenter(e), this.openMenu()));
      }),
      (d.prototype.handleKeydown = function (e) {
        if (!this.isMenuOpen && this.adapter.hasClass(Ye.FOCUSED)) {
          var t = $(e) === V.ENTER,
            i = $(e) === V.SPACEBAR,
            d = $(e) === V.ARROW_UP,
            o = $(e) === V.ARROW_DOWN;
          if (
            !(e.ctrlKey || e.metaKey) &&
            ((!i && e.key && 1 === e.key.length) ||
              (i && this.adapter.isTypeaheadInProgress()))
          ) {
            var c = i ? " " : e.key,
              l = this.adapter.typeaheadMatchItem(c, this.getSelectedIndex());
            return l >= 0 && this.setSelectedIndex(l), void e.preventDefault();
          }
          (t || i || d || o) &&
            (d && this.getSelectedIndex() > 0
              ? this.setSelectedIndex(this.getSelectedIndex() - 1)
              : o &&
                this.getSelectedIndex() < this.adapter.getMenuItemCount() - 1 &&
                this.setSelectedIndex(this.getSelectedIndex() + 1),
            this.openMenu(),
            e.preventDefault());
        }
      }),
      (d.prototype.notchOutline = function (e) {
        if (this.adapter.hasOutline()) {
          var t = this.adapter.hasClass(Ye.FOCUSED);
          if (e) {
            var i = We.LABEL_SCALE,
              d = this.adapter.getLabelWidth() * i;
            this.adapter.notchOutline(d);
          } else t || this.adapter.closeOutline();
        }
      }),
      (d.prototype.setLeadingIconAriaLabel = function (e) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(e);
      }),
      (d.prototype.setLeadingIconContent = function (e) {
        this.leadingIcon && this.leadingIcon.setContent(e);
      }),
      (d.prototype.getUseDefaultValidation = function () {
        return this.useDefaultValidation;
      }),
      (d.prototype.setUseDefaultValidation = function (e) {
        this.useDefaultValidation = e;
      }),
      (d.prototype.setValid = function (e) {
        this.useDefaultValidation || (this.customValidity = e),
          this.adapter.setSelectAnchorAttr("aria-invalid", (!e).toString()),
          e
            ? (this.adapter.removeClass(Ye.INVALID),
              this.adapter.removeMenuClass(Ye.MENU_INVALID))
            : (this.adapter.addClass(Ye.INVALID),
              this.adapter.addMenuClass(Ye.MENU_INVALID)),
          this.syncHelperTextValidity(e);
      }),
      (d.prototype.isValid = function () {
        return this.useDefaultValidation &&
          this.adapter.hasClass(Ye.REQUIRED) &&
          !this.adapter.hasClass(Ye.DISABLED)
          ? this.getSelectedIndex() !== We.UNSET_INDEX &&
              (0 !== this.getSelectedIndex() || Boolean(this.getValue()))
          : this.customValidity;
      }),
      (d.prototype.setRequired = function (e) {
        e
          ? this.adapter.addClass(Ye.REQUIRED)
          : this.adapter.removeClass(Ye.REQUIRED),
          this.adapter.setSelectAnchorAttr("aria-required", e.toString()),
          this.adapter.setLabelRequired(e);
      }),
      (d.prototype.getRequired = function () {
        return "true" === this.adapter.getSelectAnchorAttr("aria-required");
      }),
      (d.prototype.init = function () {
        var e = this.adapter.getAnchorElement();
        e &&
          (this.adapter.setMenuAnchorElement(e),
          this.adapter.setMenuAnchorCorner(B.BOTTOM_START)),
          this.adapter.setMenuWrapFocus(!1),
          this.setDisabled(this.adapter.hasClass(Ye.DISABLED)),
          this.syncHelperTextValidity(!this.adapter.hasClass(Ye.INVALID)),
          this.layout(),
          this.layoutOptions();
      }),
      (d.prototype.blur = function () {
        this.adapter.removeClass(Ye.FOCUSED),
          this.layout(),
          this.adapter.deactivateBottomLine(),
          this.adapter.hasClass(Ye.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (d.prototype.syncHelperTextValidity = function (e) {
        if (this.helperText) {
          this.helperText.setValidity(e);
          var t = this.helperText.isVisible(),
            i = this.helperText.getId();
          t && i
            ? this.adapter.setSelectAnchorAttr(Xe.ARIA_DESCRIBEDBY, i)
            : this.adapter.removeSelectAnchorAttr(Xe.ARIA_DESCRIBEDBY);
        }
      }),
      (d.prototype.setClickDebounceTimeout = function () {
        var e = this;
        clearTimeout(this.clickDebounceTimeout),
          (this.clickDebounceTimeout = setTimeout(function () {
            e.recentlyClicked = !1;
          }, We.CLICK_DEBOUNCE_TIMEOUT_MS)),
          (this.recentlyClicked = !0);
      }),
      d
    );
  })(i);
const Ge = (e = {}) => {
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
class qe extends X {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = je),
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
      (this._validity = Ge());
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
    return n`
      <div
          class="mdc-select ${a(e)}">
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
            aria-labelledby=${u(i)}
            aria-required=${this.required}
            aria-describedby=${u(d)}
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
            class="mdc-select__menu mdc-menu mdc-menu-surface ${a(t)}"
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
      : n`
      <span class="mdc-select__ripple"></span>
    `;
  }
  renderOutline() {
    return this.outlined
      ? n`
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
      ? n`
      <span
          .floatingLabelFoundation=${ce(this.label)}
          id="label">${this.label}</span>
    `
      : E;
  }
  renderLeadingIcon() {
    return this.icon
      ? n`<mwc-icon class="mdc-select__icon"><div>${this.icon}</div></mwc-icon>`
      : E;
  }
  renderLineRipple() {
    return this.outlined
      ? E
      : n`
      <span .lineRippleFoundation=${ae()}></span>
    `;
  }
  renderHelperText() {
    if (!this.shouldRenderHelperText) return E;
    const e = this.validationMessage && !this.isUiValid;
    return n`
        <p
          class="mdc-select-helper-text ${a({
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
      isTypeaheadInProgress: () => Ue(this.typeaheadState),
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
          d = Pe(i, this.typeaheadState);
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
    let i = Ge(t);
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
    this.sortedIndexByFirstChar = He(
      this.items.length,
      (e) => this.items[e].text
    );
  }
  onItemsUpdated() {
    this.sortedIndexByFirstChar = He(
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
    const t = $(e) === V.ARROW_UP,
      i = $(e) === V.ARROW_DOWN;
    if (i || t) {
      const d = t && this.index > 0,
        o = i && this.index < this.items.length - 1;
      return (
        d ? this.select(this.index - 1) : o && this.select(this.index + 1),
        e.preventDefault(),
        void this.mdcFoundation.openMenu()
      );
    }
    this.mdcFoundation.handleKeydown(e);
  }
  handleTypeahead(e) {
    if (!this.menuElement) return;
    const t = this.menuElement.getFocusedItemIndex(),
      i = R(e.target) ? e.target : null;
    !(function (e, t) {
      var i = e.event,
        d = e.isTargetListItem,
        o = e.focusedItemIndex,
        c = e.focusItemAtIndex,
        l = e.sortedIndexByFirstChar,
        n = e.isItemAtIndexDisabled,
        a = "ArrowLeft" === $(i),
        r = "ArrowUp" === $(i),
        s = "ArrowRight" === $(i),
        m = "ArrowDown" === $(i),
        h = "Home" === $(i),
        p = "End" === $(i),
        f = "Enter" === $(i),
        u = "Spacebar" === $(i);
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
            (d && Me(i),
            d &&
              Ue(t) &&
              Pe(
                {
                  focusItemAtIndex: c,
                  focusedItemIndex: o,
                  nextChar: " ",
                  sortedIndexByFirstChar: l,
                  skipFocus: !1,
                  isItemAtIndexDisabled: n,
                },
                t
              ))
          : (Me(i),
            Pe(
              {
                focusItemAtIndex: c,
                focusedItemIndex: o,
                nextChar: i.key.toLowerCase(),
                sortedIndexByFirstChar: l,
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
    const o = i.floatingLabelFoundation.getWidth();
    this.outlineOpen && (this.outlineWidth = o);
  }
  async layoutOptions() {
    this.mdcFoundation && this.mdcFoundation.layoutOptions();
  }
}
d([l(".mdc-select")], qe.prototype, "mdcRoot", void 0),
  d([l(".formElement")], qe.prototype, "formElement", void 0),
  d([l("slot")], qe.prototype, "slotElement", void 0),
  d([l("select")], qe.prototype, "nativeSelectElement", void 0),
  d([l("input")], qe.prototype, "nativeInputElement", void 0),
  d([l(".mdc-line-ripple")], qe.prototype, "lineRippleElement", void 0),
  d([l(".mdc-floating-label")], qe.prototype, "labelElement", void 0),
  d([l("mwc-notched-outline")], qe.prototype, "outlineElement", void 0),
  d([l(".mdc-menu")], qe.prototype, "menuElement", void 0),
  d([l(".mdc-select__anchor")], qe.prototype, "anchorElement", void 0),
  d(
    [
      o({ type: Boolean, attribute: "disabled", reflect: !0 }),
      O(function (e) {
        this.mdcFoundation && this.mdcFoundation.setDisabled(e);
      }),
    ],
    qe.prototype,
    "disabled",
    void 0
  ),
  d(
    [
      o({ type: Boolean }),
      O(function (e, t) {
        void 0 !== t && this.outlined !== t && this.layout(!1);
      }),
    ],
    qe.prototype,
    "outlined",
    void 0
  ),
  d(
    [
      o({ type: String }),
      O(function (e, t) {
        void 0 !== t && this.label !== t && this.layout(!1);
      }),
    ],
    qe.prototype,
    "label",
    void 0
  ),
  d([m()], qe.prototype, "outlineOpen", void 0),
  d([m()], qe.prototype, "outlineWidth", void 0),
  d(
    [
      o({ type: String }),
      O(function (e) {
        if (this.mdcFoundation) {
          const t = null === this.selected && !!e,
            i = this.selected && this.selected.value !== e;
          (t || i) && this.selectByValue(e), this.reportValidity();
        }
      }),
    ],
    qe.prototype,
    "value",
    void 0
  ),
  d([o()], qe.prototype, "name", void 0),
  d([m()], qe.prototype, "selectedText", void 0),
  d([o({ type: String })], qe.prototype, "icon", void 0),
  d([m()], qe.prototype, "menuOpen", void 0),
  d([o({ type: String })], qe.prototype, "helper", void 0),
  d([o({ type: Boolean })], qe.prototype, "validateOnInitialRender", void 0),
  d([o({ type: String })], qe.prototype, "validationMessage", void 0),
  d([o({ type: Boolean })], qe.prototype, "required", void 0),
  d([o({ type: Boolean })], qe.prototype, "naturalMenuWidth", void 0),
  d([m()], qe.prototype, "isUiValid", void 0),
  d([o({ type: Boolean })], qe.prototype, "fixedMenuPosition", void 0),
  d([p({ capture: !0 })], qe.prototype, "handleTypeahead", null);
const Ke = r`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-select{display:inline-flex;position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87)}.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-select.mdc-select--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#6200ee;fill:var(--mdc-theme-primary, #6200ee)}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled)+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:rgba(0, 0, 0, 0.54)}.mdc-select.mdc-select--disabled .mdc-select__icon{color:rgba(0, 0, 0, 0.38)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:red}.mdc-select.mdc-select--disabled .mdc-floating-label{color:GrayText}.mdc-select.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}.mdc-select.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select.mdc-select--disabled .mdc-notched-outline__trailing{border-color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__icon{color:GrayText}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:GrayText}}.mdc-select .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-select .mdc-select__anchor{padding-left:16px;padding-right:0}[dir=rtl] .mdc-select .mdc-select__anchor,.mdc-select .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:16px}.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor{padding-left:0;padding-right:0}[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-select__anchor,.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:0}.mdc-select .mdc-select__icon{width:24px;height:24px;font-size:24px}.mdc-select .mdc-select__dropdown-icon{width:24px;height:24px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item,.mdc-select .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:12px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic,.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:12px;margin-right:0}.mdc-select__dropdown-icon{margin-left:12px;margin-right:12px;display:inline-flex;position:relative;align-self:center;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active,.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{position:absolute;top:0;left:0}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-graphic{width:41.6666666667%;height:20.8333333333%}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:1;transition:opacity 75ms linear 75ms}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:0;transition:opacity 75ms linear}[dir=rtl] .mdc-select__dropdown-icon,.mdc-select__dropdown-icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:0;transition:opacity 49.5ms linear}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:1;transition:opacity 100.5ms linear 49.5ms}.mdc-select__anchor{width:200px;min-width:0;flex:1 1 auto;position:relative;box-sizing:border-box;overflow:hidden;outline:none;cursor:pointer}.mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-select__selected-text-container{display:flex;appearance:none;pointer-events:none;box-sizing:border-box;width:auto;min-width:0;flex-grow:1;height:28px;border:none;outline:none;padding:0;background-color:transparent;color:inherit}.mdc-select__selected-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;width:100%;text-align:left}[dir=rtl] .mdc-select__selected-text,.mdc-select__selected-text[dir=rtl]{text-align:right}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid+.mdc-select-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--disabled{cursor:default;pointer-events:none}.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item{padding-left:12px;padding-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item,.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:12px;padding-right:12px}.mdc-select__menu .mdc-deprecated-list .mdc-select__icon,.mdc-select__menu .mdc-list .mdc-select__icon{margin-left:0;margin-right:0}[dir=rtl] .mdc-select__menu .mdc-deprecated-list .mdc-select__icon,[dir=rtl] .mdc-select__menu .mdc-list .mdc-select__icon,.mdc-select__menu .mdc-deprecated-list .mdc-select__icon[dir=rtl],.mdc-select__menu .mdc-list .mdc-select__icon[dir=rtl]{margin-left:0;margin-right:0}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-list-item__start{display:inline-flex;align-items:center}.mdc-select__option{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select__option,.mdc-select__option[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select__one-line-option.mdc-list-item--with-one-line{height:48px}.mdc-select__two-line-option.mdc-list-item--with-two-lines{height:64px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__start{margin-top:20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text{display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before{display:inline-block;width:0;height:28px;content:"";vertical-align:0}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end{display:block;margin-top:0;line-height:normal}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before{display:inline-block;width:0;height:36px;content:"";vertical-align:0}.mdc-select__option-with-leading-content{padding-left:0;padding-right:12px}.mdc-select__option-with-leading-content.mdc-list-item{padding-left:0;padding-right:auto}[dir=rtl] .mdc-select__option-with-leading-content.mdc-list-item,.mdc-select__option-with-leading-content.mdc-list-item[dir=rtl]{padding-left:auto;padding-right:0}.mdc-select__option-with-leading-content .mdc-list-item__start{margin-left:12px;margin-right:0}[dir=rtl] .mdc-select__option-with-leading-content .mdc-list-item__start,.mdc-select__option-with-leading-content .mdc-list-item__start[dir=rtl]{margin-left:0;margin-right:12px}.mdc-select__option-with-leading-content .mdc-list-item__start{width:36px;height:24px}[dir=rtl] .mdc-select__option-with-leading-content,.mdc-select__option-with-leading-content[dir=rtl]{padding-left:12px;padding-right:0}.mdc-select__option-with-meta.mdc-list-item{padding-left:auto;padding-right:0}[dir=rtl] .mdc-select__option-with-meta.mdc-list-item,.mdc-select__option-with-meta.mdc-list-item[dir=rtl]{padding-left:0;padding-right:auto}.mdc-select__option-with-meta .mdc-list-item__end{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select__option-with-meta .mdc-list-item__end,.mdc-select__option-with-meta .mdc-list-item__end[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--filled .mdc-select__anchor{height:56px;display:flex;align-items:baseline}.mdc-select--filled .mdc-select__anchor::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor::before{display:none}.mdc-select--filled .mdc-select__anchor{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-select--filled:not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke}.mdc-select--filled.mdc-select--disabled .mdc-select__anchor{background-color:#fafafa}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-select--filled:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--filled.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-select--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-select--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-select--filled .mdc-menu-surface--is-open-below{border-top-left-radius:0px;border-top-right-radius:0px}.mdc-select--filled.mdc-select--focused.mdc-line-ripple::after{transform:scale(1, 2);opacity:1}.mdc-select--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-select--filled .mdc-floating-label,.mdc-select--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{left:48px;right:initial}[dir=rtl] .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined{border:none}.mdc-select--outlined .mdc-select__anchor{height:56px}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-56px{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-select--outlined .mdc-select__anchor{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-select--outlined+.mdc-select-helper-text{margin-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-select__anchor{background-color:transparent}.mdc-select--outlined.mdc-select--disabled .mdc-select__anchor{background-color:transparent}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}.mdc-select--outlined .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-select--outlined .mdc-select__anchor{display:flex;align-items:baseline;overflow:visible}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined 250ms 1}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--outlined .mdc-select__anchor::before{display:none}.mdc-select--outlined .mdc-select__selected-text-container{display:flex;border:none;z-index:1;background-color:transparent}.mdc-select--outlined .mdc-select__icon{z-index:2}.mdc-select--outlined .mdc-floating-label{line-height:1.15rem;left:4px;right:initial}[dir=rtl] .mdc-select--outlined .mdc-floating-label,.mdc-select--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-select--outlined.mdc-select--focused .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake,.mdc-select--outlined.mdc-select--with-leading-icon[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 96px)}.mdc-select--outlined .mdc-menu-surface{margin-bottom:8px}.mdc-select--outlined.mdc-select--no-label .mdc-menu-surface,.mdc-select--outlined .mdc-menu-surface--is-open-below{margin-bottom:0}.mdc-select__anchor{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-select__anchor .mdc-select__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-select__anchor .mdc-select__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-select__anchor.mdc-ripple-upgraded--unbounded .mdc-select__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-select__anchor.mdc-ripple-upgraded--foreground-activation .mdc-select__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-select__anchor.mdc-ripple-upgraded--foreground-deactivation .mdc-select__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-select__anchor:hover .mdc-select__ripple::before,.mdc-select__anchor.mdc-ripple-surface--hover .mdc-select__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__anchor.mdc-ripple-upgraded--background-focused .mdc-select__ripple::before,.mdc-select__anchor:not(.mdc-ripple-upgraded):focus .mdc-select__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__anchor .mdc-select__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-deprecated-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-deprecated-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-deprecated-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-deprecated-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select-helper-text{margin:0;margin-left:16px;margin-right:16px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal}[dir=rtl] .mdc-select-helper-text,.mdc-select-helper-text[dir=rtl]{margin-left:16px;margin-right:16px}.mdc-select-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-select-helper-text--validation-msg{opacity:0;transition:opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-select--invalid+.mdc-select-helper-text--validation-msg,.mdc-select-helper-text--validation-msg-persistent{opacity:1}.mdc-select--with-leading-icon .mdc-select__icon{display:inline-block;box-sizing:border-box;border:none;text-decoration:none;cursor:pointer;user-select:none;flex-shrink:0;align-self:center;background-color:transparent;fill:currentColor}.mdc-select--with-leading-icon .mdc-select__icon{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon,.mdc-select--with-leading-icon .mdc-select__icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex="-1"]{cursor:default;pointer-events:none}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-block;vertical-align:top;outline:none}.mdc-select{width:100%}[hidden]{display:none}.mdc-select__icon{z-index:2}.mdc-select--with-leading-icon{--mdc-list-item-graphic-margin: calc( 48px - var(--mdc-list-item-graphic-size, 24px) - var(--mdc-list-side-padding, 16px) )}.mdc-select .mdc-select__anchor .mdc-select__selected-text{overflow:hidden}.mdc-select .mdc-select__anchor *{display:inline-flex}.mdc-select .mdc-select__anchor .mdc-floating-label{display:inline-block}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-idle-border-color, rgba(0, 0, 0, 0.38) );--mdc-notched-outline-notch-offset: 1px}:host(:not([disabled]):hover) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87);color:var(--mdc-select-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-select-idle-line-color, rgba(0, 0, 0, 0.42))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-select-hover-line-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--outlined):not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke;background-color:var(--mdc-select-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-select__dropdown-icon{fill:var(--mdc-select-error-dropdown-icon-color, var(--mdc-select-error-color, var(--mdc-theme-error, #b00020)))}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label,:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label::after{color:var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select.mdc-select--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}.mdc-select__menu--invalid{--mdc-theme-primary: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.6);color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54);fill:var(--mdc-select-dropdown-icon-color, rgba(0, 0, 0, 0.54))}:host(:not([disabled])) .mdc-select.mdc-select--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px;--mdc-notched-outline-notch-offset: 2px}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-select__dropdown-icon{fill:rgba(98,0,238,.87);fill:var(--mdc-select-focused-dropdown-icon-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)))}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label::after{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg){color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-select:not(.mdc-select--outlined).mdc-select--disabled .mdc-select__anchor{background-color:#fafafa;background-color:var(--mdc-select-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-select.mdc-select--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-select .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38);fill:var(--mdc-select-disabled-dropdown-icon-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select-helper-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}`,
  Qe = (e, t, i = !1) => {
    let d;
    const o = (...o) => {
      const c = i && !d;
      clearTimeout(d),
        (d = window.setTimeout(() => {
          (d = void 0), i || e(...o);
        }, t)),
        c && e(...o);
    };
    return (
      (o.cancel = () => {
        clearTimeout(d);
      }),
      o
    );
  };
b(
  [x("ha-select")],
  function (e, t) {
    class i extends t {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "icon",
          value: void 0,
        },
        {
          kind: "method",
          key: "renderLeadingIcon",
          value: function () {
            return this.icon
              ? n`<span class="mdc-select__icon"
      ><slot name="icon"></slot
    ></span>`
              : E;
          },
        },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            C(A(i.prototype), "connectedCallback", this).call(this),
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
            C(A(i.prototype), "disconnectedCallback", this).call(this),
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
            return Qe(async () => {
              await T(), this.layoutOptions();
            }, 500);
          },
        },
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            Ke,
            r`
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
  qe
);
const Je = Symbol("selection controller");
class Ze {
  constructor() {
    (this.selected = null), (this.ordered = null), (this.set = new Set());
  }
}
class et {
  constructor(e) {
    (this.sets = {}),
      (this.focusedSet = null),
      (this.mouseIsDown = !1),
      (this.updating = !1),
      e.addEventListener("keydown", (e) => {
        this.keyDownHandler(e);
      }),
      e.addEventListener("mousedown", () => {
        this.mousedownHandler();
      }),
      e.addEventListener("mouseup", () => {
        this.mouseupHandler();
      });
  }
  static getController(e) {
    const t =
      !("global" in e) || ("global" in e && e.global)
        ? document
        : e.getRootNode();
    let i = t[Je];
    return void 0 === i && ((i = new et(t)), (t[Je] = i)), i;
  }
  keyDownHandler(e) {
    const t = e.target;
    "checked" in t &&
      this.has(t) &&
      ("ArrowRight" == e.key || "ArrowDown" == e.key
        ? this.selectNext(t)
        : ("ArrowLeft" != e.key && "ArrowUp" != e.key) ||
          this.selectPrevious(t));
  }
  mousedownHandler() {
    this.mouseIsDown = !0;
  }
  mouseupHandler() {
    this.mouseIsDown = !1;
  }
  has(e) {
    return this.getSet(e.name).set.has(e);
  }
  selectPrevious(e) {
    const t = this.getOrdered(e),
      i = t.indexOf(e),
      d = t[i - 1] || t[t.length - 1];
    return this.select(d), d;
  }
  selectNext(e) {
    const t = this.getOrdered(e),
      i = t.indexOf(e),
      d = t[i + 1] || t[0];
    return this.select(d), d;
  }
  select(e) {
    e.click();
  }
  focus(e) {
    if (this.mouseIsDown) return;
    const t = this.getSet(e.name),
      i = this.focusedSet;
    (this.focusedSet = t),
      i != t && t.selected && t.selected != e && t.selected.focus();
  }
  isAnySelected(e) {
    const t = this.getSet(e.name);
    for (const e of t.set) if (e.checked) return !0;
    return !1;
  }
  getOrdered(e) {
    const t = this.getSet(e.name);
    return (
      t.ordered ||
        ((t.ordered = Array.from(t.set)),
        t.ordered.sort((e, t) =>
          e.compareDocumentPosition(t) == Node.DOCUMENT_POSITION_PRECEDING
            ? 1
            : 0
        )),
      t.ordered
    );
  }
  getSet(e) {
    return this.sets[e] || (this.sets[e] = new Ze()), this.sets[e];
  }
  register(e) {
    const t = e.name || e.getAttribute("name") || "",
      i = this.getSet(t);
    i.set.add(e), (i.ordered = null);
  }
  unregister(e) {
    const t = this.getSet(e.name);
    t.set.delete(e), (t.ordered = null), t.selected == e && (t.selected = null);
  }
  update(e) {
    if (this.updating) return;
    this.updating = !0;
    const t = this.getSet(e.name);
    if (e.checked) {
      for (const i of t.set) i != e && (i.checked = !1);
      t.selected = e;
    }
    if (this.isAnySelected(e))
      for (const e of t.set) {
        if (void 0 === e.formElementTabIndex) break;
        e.formElementTabIndex = e.checked ? 0 : -1;
      }
    this.updating = !1;
  }
}
var tt = { NATIVE_CONTROL_SELECTOR: ".mdc-radio__native-control" },
  it = { DISABLED: "mdc-radio--disabled", ROOT: "mdc-radio" },
  dt = (function (i) {
    function d(e) {
      return i.call(this, t(t({}, d.defaultAdapter), e)) || this;
    }
    return (
      e(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return it;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "strings", {
        get: function () {
          return tt;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            setNativeControlDisabled: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (d.prototype.setDisabled = function (e) {
        var t = d.cssClasses.DISABLED;
        this.adapter.setNativeControlDisabled(e),
          e ? this.adapter.addClass(t) : this.adapter.removeClass(t);
      }),
      d
    );
  })(i);
class ot extends X {
  constructor() {
    super(...arguments),
      (this._checked = !1),
      (this.useStateLayerCustomProperties = !1),
      (this.global = !1),
      (this.disabled = !1),
      (this.value = "on"),
      (this.name = ""),
      (this.reducedTouchTarget = !1),
      (this.mdcFoundationClass = dt),
      (this.formElementTabIndex = 0),
      (this.focused = !1),
      (this.shouldRenderRipple = !1),
      (this.rippleElement = null),
      (this.rippleHandlers = new f(
        () => (
          (this.shouldRenderRipple = !0),
          this.ripple.then((e) => {
            this.rippleElement = e;
          }),
          this.ripple
        )
      ));
  }
  get checked() {
    return this._checked;
  }
  set checked(e) {
    var t, i;
    const d = this._checked;
    e !== d &&
      ((this._checked = e),
      this.formElement && (this.formElement.checked = e),
      null === (t = this._selectionController) ||
        void 0 === t ||
        t.update(this),
      !1 === e && (null === (i = this.formElement) || void 0 === i || i.blur()),
      this.requestUpdate("checked", d),
      this.dispatchEvent(new Event("checked", { bubbles: !0, composed: !0 })));
  }
  _handleUpdatedValue(e) {
    this.formElement.value = e;
  }
  renderRipple() {
    return this.shouldRenderRipple
      ? n`<mwc-ripple unbounded accent
        .internalUseStateLayerCustomProperties="${this.useStateLayerCustomProperties}"
        .disabled="${this.disabled}"></mwc-ripple>`
      : "";
  }
  get isRippleActive() {
    var e;
    return (
      (null === (e = this.rippleElement) || void 0 === e
        ? void 0
        : e.isActive) || !1
    );
  }
  connectedCallback() {
    super.connectedCallback(),
      (this._selectionController = et.getController(this)),
      this._selectionController.register(this),
      this._selectionController.update(this);
  }
  disconnectedCallback() {
    this._selectionController.unregister(this),
      (this._selectionController = void 0);
  }
  focus() {
    this.formElement.focus();
  }
  createAdapter() {
    return Object.assign(Object.assign({}, I(this.mdcRoot)), {
      setNativeControlDisabled: (e) => {
        this.formElement.disabled = e;
      },
    });
  }
  handleFocus() {
    (this.focused = !0), this.handleRippleFocus();
  }
  handleClick() {
    this.formElement.focus();
  }
  handleBlur() {
    (this.focused = !1),
      this.formElement.blur(),
      this.rippleHandlers.endFocus();
  }
  setFormData(e) {
    this.name && this.checked && e.append(this.name, this.value);
  }
  render() {
    const e = {
      "mdc-radio--touch": !this.reducedTouchTarget,
      "mdc-ripple-upgraded--background-focused": this.focused,
      "mdc-radio--disabled": this.disabled,
    };
    return n`
      <div class="mdc-radio ${a(e)}">
        <input
          tabindex="${this.formElementTabIndex}"
          class="mdc-radio__native-control"
          type="radio"
          name="${this.name}"
          aria-label="${u(this.ariaLabel)}"
          aria-labelledby="${u(this.ariaLabelledBy)}"
          .checked="${this.checked}"
          .value="${this.value}"
          ?disabled="${this.disabled}"
          @change="${this.changeHandler}"
          @focus="${this.handleFocus}"
          @click="${this.handleClick}"
          @blur="${this.handleBlur}"
          @mousedown="${this.handleRippleMouseDown}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleTouchStart}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
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
  changeHandler() {
    this.checked = this.formElement.checked;
  }
}
d([l(".mdc-radio")], ot.prototype, "mdcRoot", void 0),
  d([l("input")], ot.prototype, "formElement", void 0),
  d([m()], ot.prototype, "useStateLayerCustomProperties", void 0),
  d([o({ type: Boolean })], ot.prototype, "global", void 0),
  d([o({ type: Boolean, reflect: !0 })], ot.prototype, "checked", null),
  d(
    [
      o({ type: Boolean }),
      O(function (e) {
        this.mdcFoundation.setDisabled(e);
      }),
    ],
    ot.prototype,
    "disabled",
    void 0
  ),
  d(
    [
      o({ type: String }),
      O(function (e) {
        this._handleUpdatedValue(e);
      }),
    ],
    ot.prototype,
    "value",
    void 0
  ),
  d([o({ type: String })], ot.prototype, "name", void 0),
  d([o({ type: Boolean })], ot.prototype, "reducedTouchTarget", void 0),
  d([o({ type: Number })], ot.prototype, "formElementTabIndex", void 0),
  d([m()], ot.prototype, "focused", void 0),
  d([m()], ot.prototype, "shouldRenderRipple", void 0),
  d([h("mwc-ripple")], ot.prototype, "ripple", void 0),
  d([s, o({ attribute: "aria-label" })], ot.prototype, "ariaLabel", void 0),
  d(
    [s, o({ attribute: "aria-labelledby" })],
    ot.prototype,
    "ariaLabelledBy",
    void 0
  ),
  d([p({ passive: !0 })], ot.prototype, "handleRippleTouchStart", null);
const ct = r`.mdc-touch-target-wrapper{display:inline}.mdc-radio{padding:calc((40px - 20px) / 2)}.mdc-radio .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:rgba(0, 0, 0, 0.54)}.mdc-radio .mdc-radio__native-control:enabled:checked+.mdc-radio__background .mdc-radio__outer-circle{border-color:#018786;border-color:var(--mdc-theme-secondary, #018786)}.mdc-radio .mdc-radio__native-control:enabled+.mdc-radio__background .mdc-radio__inner-circle{border-color:#018786;border-color:var(--mdc-theme-secondary, #018786)}.mdc-radio [aria-disabled=true] .mdc-radio__native-control:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:rgba(0, 0, 0, 0.38)}.mdc-radio [aria-disabled=true] .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:checked+.mdc-radio__background .mdc-radio__outer-circle{border-color:rgba(0, 0, 0, 0.38)}.mdc-radio [aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio .mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle{border-color:rgba(0, 0, 0, 0.38)}.mdc-radio .mdc-radio__background::before{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-radio .mdc-radio__background::before{top:calc(-1 * (40px - 20px) / 2);left:calc(-1 * (40px - 20px) / 2);width:40px;height:40px}.mdc-radio .mdc-radio__native-control{top:calc((40px - 40px) / 2);right:calc((40px - 40px) / 2);left:calc((40px - 40px) / 2);width:40px;height:40px}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-radio [aria-disabled=true] .mdc-radio__native-control:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:GrayText}.mdc-radio [aria-disabled=true] .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:checked+.mdc-radio__background .mdc-radio__outer-circle{border-color:GrayText}.mdc-radio [aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio .mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle{border-color:GrayText}}.mdc-radio{display:inline-block;position:relative;flex:0 0 auto;box-sizing:content-box;width:20px;height:20px;cursor:pointer;will-change:opacity,transform,border-color,color}.mdc-radio__background{display:inline-block;position:relative;box-sizing:border-box;width:20px;height:20px}.mdc-radio__background::before{position:absolute;transform:scale(0, 0);border-radius:50%;opacity:0;pointer-events:none;content:"";transition:opacity 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-radio__outer-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;border-width:2px;border-style:solid;border-radius:50%;transition:border-color 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-radio__inner-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;transform:scale(0, 0);border-width:10px;border-style:solid;border-radius:50%;transition:transform 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 120ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-radio__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit;z-index:1}.mdc-radio--touch{margin-top:4px;margin-bottom:4px;margin-right:4px;margin-left:4px}.mdc-radio--touch .mdc-radio__native-control{top:calc((40px - 48px) / 2);right:calc((40px - 48px) / 2);left:calc((40px - 48px) / 2);width:48px;height:48px}.mdc-radio__native-control:checked+.mdc-radio__background,.mdc-radio__native-control:disabled+.mdc-radio__background{transition:opacity 120ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__outer-circle{transition:border-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle{transition:transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1),border-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio--disabled{cursor:default;pointer-events:none}.mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle{transform:scale(0.5);transition:transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1),border-color 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-radio__native-control:disabled+.mdc-radio__background,[aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background{cursor:default}.mdc-radio__native-control:focus+.mdc-radio__background::before{transform:scale(1);opacity:.12;transition:opacity 120ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 120ms 0ms cubic-bezier(0, 0, 0.2, 1)}:host{display:inline-block;outline:none}.mdc-radio{vertical-align:bottom}.mdc-radio .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:var(--mdc-radio-unchecked-color, rgba(0, 0, 0, 0.54))}.mdc-radio [aria-disabled=true] .mdc-radio__native-control:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-radio [aria-disabled=true] .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:checked+.mdc-radio__background .mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-radio [aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio .mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle{border-color:var(--mdc-radio-disabled-color, rgba(0, 0, 0, 0.38))}`;
b(
  [x("ha-radio")],
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
            ct,
            r`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  ot
);
export {
  W as F,
  Fe as T,
  Be as a,
  Ce as b,
  Se as c,
  Qe as d,
  ye as e,
  Re as f,
  Te as l,
  Ae as m,
  ve as n,
  Le as p,
  we as r,
  j as s,
  _e as t,
  Ee as u,
};
