import {
  l as t,
  f as e,
  _ as i,
  i as s,
  g as r,
  e as d,
  t as a,
  h as n,
  R as o,
  $ as c,
  o as l,
  r as m,
  n as h,
  M as p,
  B as u,
  j as g,
  k as _,
  p as f,
  q as x,
} from "./main-ad130be7.js";
import { o as v } from "./c.8e28b461.js";
function E(i, s, r) {
  let d,
    a = i;
  return (
    "object" == typeof i ? ((a = i.slot), (d = i)) : (d = { flatten: s }),
    r
      ? t({ slot: a, flatten: s, selector: r })
      : e({
          descriptor: (t) => ({
            get() {
              var t, e;
              const i = "slot" + (a ? `[name=${a}]` : ":not([name])"),
                s =
                  null === (t = this.renderRoot) || void 0 === t
                    ? void 0
                    : t.querySelector(i);
              return null !== (e = null == s ? void 0 : s.assignedNodes(d)) &&
                void 0 !== e
                ? e
                : [];
            },
            enumerable: !0,
            configurable: !0,
          }),
        })
  );
}
class I extends n {
  constructor() {
    super(...arguments),
      (this.value = ""),
      (this.group = null),
      (this.tabindex = -1),
      (this.disabled = !1),
      (this.twoline = !1),
      (this.activated = !1),
      (this.graphic = null),
      (this.multipleGraphics = !1),
      (this.hasMeta = !1),
      (this.noninteractive = !1),
      (this.selected = !1),
      (this.shouldRenderRipple = !1),
      (this._managingList = null),
      (this.boundOnClick = this.onClick.bind(this)),
      (this._firstChanged = !0),
      (this._skipPropRequest = !1),
      (this.rippleHandlers = new o(
        () => ((this.shouldRenderRipple = !0), this.ripple)
      )),
      (this.listeners = [
        {
          target: this,
          eventNames: ["click"],
          cb: () => {
            this.onClick();
          },
        },
        {
          target: this,
          eventNames: ["mouseenter"],
          cb: this.rippleHandlers.startHover,
        },
        {
          target: this,
          eventNames: ["mouseleave"],
          cb: this.rippleHandlers.endHover,
        },
        {
          target: this,
          eventNames: ["focus"],
          cb: this.rippleHandlers.startFocus,
        },
        {
          target: this,
          eventNames: ["blur"],
          cb: this.rippleHandlers.endFocus,
        },
        {
          target: this,
          eventNames: ["mousedown", "touchstart"],
          cb: (t) => {
            const e = t.type;
            this.onDown("mousedown" === e ? "mouseup" : "touchend", t);
          },
        },
      ]);
  }
  get text() {
    const t = this.textContent;
    return t ? t.trim() : "";
  }
  render() {
    const t = this.renderText(),
      e = this.graphic ? this.renderGraphic() : c``,
      i = this.hasMeta ? this.renderMeta() : c``;
    return c`
      ${this.renderRipple()}
      ${e}
      ${t}
      ${i}`;
  }
  renderRipple() {
    return this.shouldRenderRipple
      ? c`
      <mwc-ripple
        .activated=${this.activated}>
      </mwc-ripple>`
      : this.activated
      ? c`<div class="fake-activated-ripple"></div>`
      : "";
  }
  renderGraphic() {
    const t = { multi: this.multipleGraphics };
    return c`
      <span class="mdc-deprecated-list-item__graphic material-icons ${l(t)}">
        <slot name="graphic"></slot>
      </span>`;
  }
  renderMeta() {
    return c`
      <span class="mdc-deprecated-list-item__meta material-icons">
        <slot name="meta"></slot>
      </span>`;
  }
  renderText() {
    const t = this.twoline ? this.renderTwoline() : this.renderSingleLine();
    return c`
      <span class="mdc-deprecated-list-item__text">
        ${t}
      </span>`;
  }
  renderSingleLine() {
    return c`<slot></slot>`;
  }
  renderTwoline() {
    return c`
      <span class="mdc-deprecated-list-item__primary-text">
        <slot></slot>
      </span>
      <span class="mdc-deprecated-list-item__secondary-text">
        <slot name="secondary"></slot>
      </span>
    `;
  }
  onClick() {
    this.fireRequestSelected(!this.selected, "interaction");
  }
  onDown(t, e) {
    const i = () => {
      window.removeEventListener(t, i), this.rippleHandlers.endPress();
    };
    window.addEventListener(t, i), this.rippleHandlers.startPress(e);
  }
  fireRequestSelected(t, e) {
    if (this.noninteractive) return;
    const i = new CustomEvent("request-selected", {
      bubbles: !0,
      composed: !0,
      detail: { source: e, selected: t },
    });
    this.dispatchEvent(i);
  }
  connectedCallback() {
    super.connectedCallback(),
      this.noninteractive || this.setAttribute("mwc-list-item", "");
    for (const t of this.listeners)
      for (const e of t.eventNames)
        t.target.addEventListener(e, t.cb, { passive: !0 });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this.listeners)
      for (const e of t.eventNames) t.target.removeEventListener(e, t.cb);
    this._managingList &&
      (this._managingList.debouncedLayout
        ? this._managingList.debouncedLayout(!0)
        : this._managingList.layout(!0));
  }
  firstUpdated() {
    const t = new Event("list-item-rendered", { bubbles: !0, composed: !0 });
    this.dispatchEvent(t);
  }
}
i([s("slot")], I.prototype, "slotElement", void 0),
  i([r("mwc-ripple")], I.prototype, "ripple", void 0),
  i([d({ type: String })], I.prototype, "value", void 0),
  i([d({ type: String, reflect: !0 })], I.prototype, "group", void 0),
  i([d({ type: Number, reflect: !0 })], I.prototype, "tabindex", void 0),
  i(
    [
      d({ type: Boolean, reflect: !0 }),
      v(function (t) {
        t
          ? this.setAttribute("aria-disabled", "true")
          : this.setAttribute("aria-disabled", "false");
      }),
    ],
    I.prototype,
    "disabled",
    void 0
  ),
  i([d({ type: Boolean, reflect: !0 })], I.prototype, "twoline", void 0),
  i([d({ type: Boolean, reflect: !0 })], I.prototype, "activated", void 0),
  i([d({ type: String, reflect: !0 })], I.prototype, "graphic", void 0),
  i([d({ type: Boolean })], I.prototype, "multipleGraphics", void 0),
  i([d({ type: Boolean })], I.prototype, "hasMeta", void 0),
  i(
    [
      d({ type: Boolean, reflect: !0 }),
      v(function (t) {
        t
          ? (this.removeAttribute("aria-checked"),
            this.removeAttribute("mwc-list-item"),
            (this.selected = !1),
            (this.activated = !1),
            (this.tabIndex = -1))
          : this.setAttribute("mwc-list-item", "");
      }),
    ],
    I.prototype,
    "noninteractive",
    void 0
  ),
  i(
    [
      d({ type: Boolean, reflect: !0 }),
      v(function (t) {
        const e = this.getAttribute("role"),
          i = "gridcell" === e || "option" === e || "row" === e || "tab" === e;
        i && t
          ? this.setAttribute("aria-selected", "true")
          : i && this.setAttribute("aria-selected", "false"),
          this._firstChanged
            ? (this._firstChanged = !1)
            : this._skipPropRequest || this.fireRequestSelected(t, "property");
      }),
    ],
    I.prototype,
    "selected",
    void 0
  ),
  i([a()], I.prototype, "shouldRenderRipple", void 0),
  i([a()], I.prototype, "_managingList", void 0);
const b = m`:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding, 16px);padding-right:var(--mdc-list-side-padding, 16px);outline:none;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host:focus{outline:none}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary, #6200ee);--mdc-ripple-color: var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12);background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size, 24px);height:var(--mdc-list-item-meta-size, 24px);margin-left:auto;margin-right:0;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size, 24px);line-height:var(--mdc-list-item-meta-size, 24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size, 24px) !important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit)}[dir=rtl] .mdc-deprecated-list-item__meta,.mdc-deprecated-list-item__meta[dir=rtl]{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0, 0, 0, 0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 40px);height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 40px);line-height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 40px) !important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 16px)}[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 24px);height:var(--mdc-list-item-graphic-size, 24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 24px);line-height:var(--mdc-list-item-graphic-size, 24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 24px) !important}[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic,:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=medium]:not([twoLine])),:host([graphic=large]:not([twoLine])){height:72px}:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 56px);height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 56px);line-height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 56px) !important}:host([graphic=large]){padding-left:0px}`;
let y = class extends I {};
(y.styles = [b]), (y = i([h("mwc-list-item")], y));
var S = {
    UNKNOWN: "Unknown",
    BACKSPACE: "Backspace",
    ENTER: "Enter",
    SPACEBAR: "Spacebar",
    PAGE_UP: "PageUp",
    PAGE_DOWN: "PageDown",
    END: "End",
    HOME: "Home",
    ARROW_LEFT: "ArrowLeft",
    ARROW_UP: "ArrowUp",
    ARROW_RIGHT: "ArrowRight",
    ARROW_DOWN: "ArrowDown",
    DELETE: "Delete",
    ESCAPE: "Escape",
    TAB: "Tab",
  },
  A = new Set();
A.add(S.BACKSPACE),
  A.add(S.ENTER),
  A.add(S.SPACEBAR),
  A.add(S.PAGE_UP),
  A.add(S.PAGE_DOWN),
  A.add(S.END),
  A.add(S.HOME),
  A.add(S.ARROW_LEFT),
  A.add(S.ARROW_UP),
  A.add(S.ARROW_RIGHT),
  A.add(S.ARROW_DOWN),
  A.add(S.DELETE),
  A.add(S.ESCAPE),
  A.add(S.TAB);
var T = 8,
  R = 13,
  L = 32,
  w = 33,
  C = 34,
  F = 35,
  O = 36,
  D = 37,
  N = 38,
  M = 39,
  k = 40,
  P = 46,
  U = 27,
  z = 9,
  B = new Map();
B.set(T, S.BACKSPACE),
  B.set(R, S.ENTER),
  B.set(L, S.SPACEBAR),
  B.set(w, S.PAGE_UP),
  B.set(C, S.PAGE_DOWN),
  B.set(F, S.END),
  B.set(O, S.HOME),
  B.set(D, S.ARROW_LEFT),
  B.set(N, S.ARROW_UP),
  B.set(M, S.ARROW_RIGHT),
  B.set(k, S.ARROW_DOWN),
  B.set(P, S.DELETE),
  B.set(U, S.ESCAPE),
  B.set(z, S.TAB);
var H,
  W,
  X = new Set();
function V(t) {
  var e = t.key;
  if (A.has(e)) return e;
  var i = B.get(t.keyCode);
  return i || S.UNKNOWN;
}
X.add(S.PAGE_UP),
  X.add(S.PAGE_DOWN),
  X.add(S.END),
  X.add(S.HOME),
  X.add(S.ARROW_LEFT),
  X.add(S.ARROW_UP),
  X.add(S.ARROW_RIGHT),
  X.add(S.ARROW_DOWN);
var G = {
  LIST_ITEM_ACTIVATED_CLASS: "mdc-list-item--activated",
  LIST_ITEM_CLASS: "mdc-list-item",
  LIST_ITEM_DISABLED_CLASS: "mdc-list-item--disabled",
  LIST_ITEM_SELECTED_CLASS: "mdc-list-item--selected",
  LIST_ITEM_TEXT_CLASS: "mdc-list-item__text",
  LIST_ITEM_PRIMARY_TEXT_CLASS: "mdc-list-item__primary-text",
  ROOT: "mdc-list",
};
((H = {})["" + G.LIST_ITEM_ACTIVATED_CLASS] = "mdc-list-item--activated"),
  (H["" + G.LIST_ITEM_CLASS] = "mdc-list-item"),
  (H["" + G.LIST_ITEM_DISABLED_CLASS] = "mdc-list-item--disabled"),
  (H["" + G.LIST_ITEM_SELECTED_CLASS] = "mdc-list-item--selected"),
  (H["" + G.LIST_ITEM_PRIMARY_TEXT_CLASS] = "mdc-list-item__primary-text"),
  (H["" + G.ROOT] = "mdc-list");
var $ =
    (((W = {})["" + G.LIST_ITEM_ACTIVATED_CLASS] =
      "mdc-deprecated-list-item--activated"),
    (W["" + G.LIST_ITEM_CLASS] = "mdc-deprecated-list-item"),
    (W["" + G.LIST_ITEM_DISABLED_CLASS] = "mdc-deprecated-list-item--disabled"),
    (W["" + G.LIST_ITEM_SELECTED_CLASS] = "mdc-deprecated-list-item--selected"),
    (W["" + G.LIST_ITEM_TEXT_CLASS] = "mdc-deprecated-list-item__text"),
    (W["" + G.LIST_ITEM_PRIMARY_TEXT_CLASS] =
      "mdc-deprecated-list-item__primary-text"),
    (W["" + G.ROOT] = "mdc-deprecated-list"),
    W),
  K = {
    ACTION_EVENT: "MDCList:action",
    ARIA_CHECKED: "aria-checked",
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: "aria-current",
    ARIA_DISABLED: "aria-disabled",
    ARIA_ORIENTATION: "aria-orientation",
    ARIA_ORIENTATION_HORIZONTAL: "horizontal",
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: "aria-selected",
    ARIA_INTERACTIVE_ROLES_SELECTOR: '[role="listbox"], [role="menu"]',
    ARIA_MULTI_SELECTABLE_SELECTOR: '[aria-multiselectable="true"]',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"], input[type="radio"]',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX:
      "\n    ." +
      G.LIST_ITEM_CLASS +
      " button:not(:disabled),\n    ." +
      G.LIST_ITEM_CLASS +
      " a,\n    ." +
      $[G.LIST_ITEM_CLASS] +
      " button:not(:disabled),\n    ." +
      $[G.LIST_ITEM_CLASS] +
      " a\n  ",
    DEPRECATED_SELECTOR: ".mdc-deprecated-list",
    FOCUSABLE_CHILD_ELEMENTS:
      "\n    ." +
      G.LIST_ITEM_CLASS +
      " button:not(:disabled),\n    ." +
      G.LIST_ITEM_CLASS +
      " a,\n    ." +
      G.LIST_ITEM_CLASS +
      ' input[type="radio"]:not(:disabled),\n    .' +
      G.LIST_ITEM_CLASS +
      ' input[type="checkbox"]:not(:disabled),\n    .' +
      $[G.LIST_ITEM_CLASS] +
      " button:not(:disabled),\n    ." +
      $[G.LIST_ITEM_CLASS] +
      " a,\n    ." +
      $[G.LIST_ITEM_CLASS] +
      ' input[type="radio"]:not(:disabled),\n    .' +
      $[G.LIST_ITEM_CLASS] +
      ' input[type="checkbox"]:not(:disabled)\n  ',
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]',
  },
  q = { UNSET_INDEX: -1, TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300 };
const j = (t, e) => t - e,
  Y = ["input", "button", "textarea", "select"];
function Z(t) {
  return t instanceof Set;
}
const J = (t) => {
  const e = t === q.UNSET_INDEX ? new Set() : t;
  return Z(e) ? new Set(e) : new Set([e]);
};
class Q extends p {
  constructor(t) {
    super(Object.assign(Object.assign({}, Q.defaultAdapter), t)),
      (this.isMulti_ = !1),
      (this.wrapFocus_ = !1),
      (this.isVertical_ = !0),
      (this.selectedIndex_ = q.UNSET_INDEX),
      (this.focusedItemIndex_ = q.UNSET_INDEX),
      (this.useActivatedClass_ = !1),
      (this.ariaCurrentAttrValue_ = null);
  }
  static get strings() {
    return K;
  }
  static get numbers() {
    return q;
  }
  static get defaultAdapter() {
    return {
      focusItemAtIndex: () => {},
      getFocusedElementIndex: () => 0,
      getListItemCount: () => 0,
      isFocusInsideList: () => !1,
      isRootFocused: () => !1,
      notifyAction: () => {},
      notifySelected: () => {},
      getSelectedStateForElementIndex: () => !1,
      setDisabledStateForElementIndex: () => {},
      getDisabledStateForElementIndex: () => !1,
      setSelectedStateForElementIndex: () => {},
      setActivatedStateForElementIndex: () => {},
      setTabIndexForElementIndex: () => {},
      setAttributeForElementIndex: () => {},
      getAttributeForElementIndex: () => null,
    };
  }
  setWrapFocus(t) {
    this.wrapFocus_ = t;
  }
  setMulti(t) {
    this.isMulti_ = t;
    const e = this.selectedIndex_;
    if (t) {
      if (!Z(e)) {
        const t = e === q.UNSET_INDEX;
        this.selectedIndex_ = t ? new Set() : new Set([e]);
      }
    } else if (Z(e))
      if (e.size) {
        const t = Array.from(e).sort(j);
        this.selectedIndex_ = t[0];
      } else this.selectedIndex_ = q.UNSET_INDEX;
  }
  setVerticalOrientation(t) {
    this.isVertical_ = t;
  }
  setUseActivatedClass(t) {
    this.useActivatedClass_ = t;
  }
  getSelectedIndex() {
    return this.selectedIndex_;
  }
  setSelectedIndex(t) {
    this.isIndexValid_(t) &&
      (this.isMulti_
        ? this.setMultiSelectionAtIndex_(J(t))
        : this.setSingleSelectionAtIndex_(t));
  }
  handleFocusIn(t, e) {
    e >= 0 && this.adapter.setTabIndexForElementIndex(e, 0);
  }
  handleFocusOut(t, e) {
    e >= 0 && this.adapter.setTabIndexForElementIndex(e, -1),
      setTimeout(() => {
        this.adapter.isFocusInsideList() ||
          this.setTabindexToFirstSelectedItem_();
      }, 0);
  }
  handleKeydown(t, e, i) {
    const s = "ArrowLeft" === V(t),
      r = "ArrowUp" === V(t),
      d = "ArrowRight" === V(t),
      a = "ArrowDown" === V(t),
      n = "Home" === V(t),
      o = "End" === V(t),
      c = "Enter" === V(t),
      l = "Spacebar" === V(t);
    if (this.adapter.isRootFocused())
      return void (r || o
        ? (t.preventDefault(), this.focusLastElement())
        : (a || n) && (t.preventDefault(), this.focusFirstElement()));
    let m,
      h = this.adapter.getFocusedElementIndex();
    if (!(-1 === h && ((h = i), h < 0))) {
      if ((this.isVertical_ && a) || (!this.isVertical_ && d))
        this.preventDefaultEvent(t), (m = this.focusNextElement(h));
      else if ((this.isVertical_ && r) || (!this.isVertical_ && s))
        this.preventDefaultEvent(t), (m = this.focusPrevElement(h));
      else if (n) this.preventDefaultEvent(t), (m = this.focusFirstElement());
      else if (o) this.preventDefaultEvent(t), (m = this.focusLastElement());
      else if ((c || l) && e) {
        const e = t.target;
        if (e && "A" === e.tagName && c) return;
        this.preventDefaultEvent(t), this.setSelectedIndexOnAction_(h, !0);
      }
      (this.focusedItemIndex_ = h),
        void 0 !== m &&
          (this.setTabindexAtIndex_(m), (this.focusedItemIndex_ = m));
    }
  }
  handleSingleSelection(t, e, i) {
    t !== q.UNSET_INDEX &&
      (this.setSelectedIndexOnAction_(t, e, i),
      this.setTabindexAtIndex_(t),
      (this.focusedItemIndex_ = t));
  }
  focusNextElement(t) {
    let e = t + 1;
    if (e >= this.adapter.getListItemCount()) {
      if (!this.wrapFocus_) return t;
      e = 0;
    }
    return this.adapter.focusItemAtIndex(e), e;
  }
  focusPrevElement(t) {
    let e = t - 1;
    if (e < 0) {
      if (!this.wrapFocus_) return t;
      e = this.adapter.getListItemCount() - 1;
    }
    return this.adapter.focusItemAtIndex(e), e;
  }
  focusFirstElement() {
    return this.adapter.focusItemAtIndex(0), 0;
  }
  focusLastElement() {
    const t = this.adapter.getListItemCount() - 1;
    return this.adapter.focusItemAtIndex(t), t;
  }
  setEnabled(t, e) {
    this.isIndexValid_(t) &&
      this.adapter.setDisabledStateForElementIndex(t, !e);
  }
  preventDefaultEvent(t) {
    const e = `${t.target.tagName}`.toLowerCase();
    -1 === Y.indexOf(e) && t.preventDefault();
  }
  setSingleSelectionAtIndex_(t, e = !0) {
    this.selectedIndex_ !== t &&
      (this.selectedIndex_ !== q.UNSET_INDEX &&
        (this.adapter.setSelectedStateForElementIndex(this.selectedIndex_, !1),
        this.useActivatedClass_ &&
          this.adapter.setActivatedStateForElementIndex(
            this.selectedIndex_,
            !1
          )),
      e && this.adapter.setSelectedStateForElementIndex(t, !0),
      this.useActivatedClass_ &&
        this.adapter.setActivatedStateForElementIndex(t, !0),
      this.setAriaForSingleSelectionAtIndex_(t),
      (this.selectedIndex_ = t),
      this.adapter.notifySelected(t));
  }
  setMultiSelectionAtIndex_(t, e = !0) {
    const i = ((t, e) => {
      const i = Array.from(t),
        s = Array.from(e),
        r = { added: [], removed: [] },
        d = i.sort(j),
        a = s.sort(j);
      let n = 0,
        o = 0;
      for (; n < d.length || o < a.length; ) {
        const t = d[n],
          e = a[o];
        t !== e
          ? void 0 !== t && (void 0 === e || t < e)
            ? (r.removed.push(t), n++)
            : void 0 !== e && (void 0 === t || e < t) && (r.added.push(e), o++)
          : (n++, o++);
      }
      return r;
    })(J(this.selectedIndex_), t);
    if (i.removed.length || i.added.length) {
      for (const t of i.removed)
        e && this.adapter.setSelectedStateForElementIndex(t, !1),
          this.useActivatedClass_ &&
            this.adapter.setActivatedStateForElementIndex(t, !1);
      for (const t of i.added)
        e && this.adapter.setSelectedStateForElementIndex(t, !0),
          this.useActivatedClass_ &&
            this.adapter.setActivatedStateForElementIndex(t, !0);
      (this.selectedIndex_ = t), this.adapter.notifySelected(t, i);
    }
  }
  setAriaForSingleSelectionAtIndex_(t) {
    this.selectedIndex_ === q.UNSET_INDEX &&
      (this.ariaCurrentAttrValue_ = this.adapter.getAttributeForElementIndex(
        t,
        K.ARIA_CURRENT
      ));
    const e = null !== this.ariaCurrentAttrValue_,
      i = e ? K.ARIA_CURRENT : K.ARIA_SELECTED;
    this.selectedIndex_ !== q.UNSET_INDEX &&
      this.adapter.setAttributeForElementIndex(this.selectedIndex_, i, "false");
    const s = e ? this.ariaCurrentAttrValue_ : "true";
    this.adapter.setAttributeForElementIndex(t, i, s);
  }
  setTabindexAtIndex_(t) {
    this.focusedItemIndex_ === q.UNSET_INDEX && 0 !== t
      ? this.adapter.setTabIndexForElementIndex(0, -1)
      : this.focusedItemIndex_ >= 0 &&
        this.focusedItemIndex_ !== t &&
        this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_, -1),
      this.adapter.setTabIndexForElementIndex(t, 0);
  }
  setTabindexToFirstSelectedItem_() {
    let t = 0;
    "number" == typeof this.selectedIndex_ &&
    this.selectedIndex_ !== q.UNSET_INDEX
      ? (t = this.selectedIndex_)
      : Z(this.selectedIndex_) &&
        this.selectedIndex_.size > 0 &&
        (t = Math.min(...this.selectedIndex_)),
      this.setTabindexAtIndex_(t);
  }
  isIndexValid_(t) {
    if (t instanceof Set) {
      if (!this.isMulti_)
        throw new Error(
          "MDCListFoundation: Array of index is only supported for checkbox based list"
        );
      if (0 === t.size) return !0;
      {
        let e = !1;
        for (const i of t) if (((e = this.isIndexInRange_(i)), e)) break;
        return e;
      }
    }
    if ("number" == typeof t) {
      if (this.isMulti_)
        throw new Error(
          "MDCListFoundation: Expected array of index for checkbox based list but got number: " +
            t
        );
      return t === q.UNSET_INDEX || this.isIndexInRange_(t);
    }
    return !1;
  }
  isIndexInRange_(t) {
    const e = this.adapter.getListItemCount();
    return t >= 0 && t < e;
  }
  setSelectedIndexOnAction_(t, e, i) {
    if (this.adapter.getDisabledStateForElementIndex(t)) return;
    let s = t;
    if ((this.isMulti_ && (s = new Set([t])), this.isIndexValid_(s))) {
      if (this.isMulti_) this.toggleMultiAtIndex(t, i, e);
      else if (e || i) this.setSingleSelectionAtIndex_(t, e);
      else {
        this.selectedIndex_ === t &&
          this.setSingleSelectionAtIndex_(q.UNSET_INDEX);
      }
      e && this.adapter.notifyAction(t);
    }
  }
  toggleMultiAtIndex(t, e, i = !0) {
    let s = !1;
    s = void 0 === e ? !this.adapter.getSelectedStateForElementIndex(t) : e;
    const r = J(this.selectedIndex_);
    s ? r.add(t) : r.delete(t), this.setMultiSelectionAtIndex_(r, i);
  }
}
const tt = (t) => t.hasAttribute("mwc-list-item");
function et() {
  const t = this.itemsReadyResolver;
  (this.itemsReady = new Promise((t) => (this.itemsReadyResolver = t))), t();
}
class it extends u {
  constructor() {
    super(),
      (this.mdcAdapter = null),
      (this.mdcFoundationClass = Q),
      (this.activatable = !1),
      (this.multi = !1),
      (this.wrapFocus = !1),
      (this.itemRoles = null),
      (this.innerRole = null),
      (this.innerAriaLabel = null),
      (this.rootTabbable = !1),
      (this.previousTabindex = null),
      (this.noninteractive = !1),
      (this.itemsReadyResolver = () => {}),
      (this.itemsReady = Promise.resolve([])),
      (this.items_ = []);
    const t = (function (t, e = 50) {
      let i;
      return function (s = !0) {
        clearTimeout(i),
          (i = setTimeout(() => {
            t(s);
          }, e));
      };
    })(this.layout.bind(this));
    this.debouncedLayout = (e = !0) => {
      et.call(this), t(e);
    };
  }
  async getUpdateComplete() {
    const t = await super.getUpdateComplete();
    return await this.itemsReady, t;
  }
  get items() {
    return this.items_;
  }
  updateItems() {
    var t;
    const e = null !== (t = this.assignedElements) && void 0 !== t ? t : [],
      i = [];
    for (const t of e)
      tt(t) && (i.push(t), (t._managingList = this)),
        t.hasAttribute("divider") &&
          !t.hasAttribute("role") &&
          t.setAttribute("role", "separator");
    this.items_ = i;
    const s = new Set();
    if (
      (this.items_.forEach((t, e) => {
        this.itemRoles
          ? t.setAttribute("role", this.itemRoles)
          : t.removeAttribute("role"),
          t.selected && s.add(e);
      }),
      this.multi)
    )
      this.select(s);
    else {
      const t = s.size ? s.entries().next().value[1] : -1;
      this.select(t);
    }
    const r = new Event("items-updated", { bubbles: !0, composed: !0 });
    this.dispatchEvent(r);
  }
  get selected() {
    const t = this.index;
    if (!Z(t)) return -1 === t ? null : this.items[t];
    const e = [];
    for (const i of t) e.push(this.items[i]);
    return e;
  }
  get index() {
    return this.mdcFoundation ? this.mdcFoundation.getSelectedIndex() : -1;
  }
  render() {
    const t = null === this.innerRole ? void 0 : this.innerRole,
      e = null === this.innerAriaLabel ? void 0 : this.innerAriaLabel,
      i = this.rootTabbable ? "0" : "-1";
    return c`
      <!-- @ts-ignore -->
      <ul
          tabindex=${i}
          role="${g(t)}"
          aria-label="${g(e)}"
          class="mdc-deprecated-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}
          @list-item-rendered=${this.onListItemConnected}>
        <slot></slot>
        ${this.renderPlaceholder()}
      </ul>
    `;
  }
  renderPlaceholder() {
    var t;
    const e = null !== (t = this.assignedElements) && void 0 !== t ? t : [];
    return void 0 !== this.emptyMessage && 0 === e.length
      ? c`
        <mwc-list-item noninteractive>${this.emptyMessage}</mwc-list-item>
      `
      : null;
  }
  firstUpdated() {
    super.firstUpdated(),
      this.items.length ||
        (this.mdcFoundation.setMulti(this.multi), this.layout());
  }
  onFocusIn(t) {
    if (this.mdcFoundation && this.mdcRoot) {
      const e = this.getIndexOfTarget(t);
      this.mdcFoundation.handleFocusIn(t, e);
    }
  }
  onFocusOut(t) {
    if (this.mdcFoundation && this.mdcRoot) {
      const e = this.getIndexOfTarget(t);
      this.mdcFoundation.handleFocusOut(t, e);
    }
  }
  onKeydown(t) {
    if (this.mdcFoundation && this.mdcRoot) {
      const e = this.getIndexOfTarget(t),
        i = t.target,
        s = tt(i);
      this.mdcFoundation.handleKeydown(t, s, e);
    }
  }
  onRequestSelected(t) {
    if (this.mdcFoundation) {
      let e = this.getIndexOfTarget(t);
      if (-1 === e && (this.layout(), (e = this.getIndexOfTarget(t)), -1 === e))
        return;
      if (this.items[e].disabled) return;
      const i = t.detail.selected,
        s = t.detail.source;
      this.mdcFoundation.handleSingleSelection(e, "interaction" === s, i),
        t.stopPropagation();
    }
  }
  getIndexOfTarget(t) {
    const e = this.items,
      i = t.composedPath();
    for (const t of i) {
      let i = -1;
      if ((_(t) && tt(t) && (i = e.indexOf(t)), -1 !== i)) return i;
    }
    return -1;
  }
  createAdapter() {
    return (
      (this.mdcAdapter = {
        getListItemCount: () => (this.mdcRoot ? this.items.length : 0),
        getFocusedElementIndex: this.getFocusedItemIndex,
        getAttributeForElementIndex: (t, e) => {
          if (!this.mdcRoot) return "";
          const i = this.items[t];
          return i ? i.getAttribute(e) : "";
        },
        setAttributeForElementIndex: (t, e, i) => {
          if (!this.mdcRoot) return;
          const s = this.items[t];
          s && s.setAttribute(e, i);
        },
        focusItemAtIndex: (t) => {
          const e = this.items[t];
          e && e.focus();
        },
        setTabIndexForElementIndex: (t, e) => {
          const i = this.items[t];
          i && (i.tabindex = e);
        },
        notifyAction: (t) => {
          const e = { bubbles: !0, composed: !0 };
          e.detail = { index: t };
          const i = new CustomEvent("action", e);
          this.dispatchEvent(i);
        },
        notifySelected: (t, e) => {
          const i = { bubbles: !0, composed: !0 };
          i.detail = { index: t, diff: e };
          const s = new CustomEvent("selected", i);
          this.dispatchEvent(s);
        },
        isFocusInsideList: () => f(this),
        isRootFocused: () => {
          const t = this.mdcRoot;
          return t.getRootNode().activeElement === t;
        },
        setDisabledStateForElementIndex: (t, e) => {
          const i = this.items[t];
          i && (i.disabled = e);
        },
        getDisabledStateForElementIndex: (t) => {
          const e = this.items[t];
          return !!e && e.disabled;
        },
        setSelectedStateForElementIndex: (t, e) => {
          const i = this.items[t];
          i && (i.selected = e);
        },
        getSelectedStateForElementIndex: (t) => {
          const e = this.items[t];
          return !!e && e.selected;
        },
        setActivatedStateForElementIndex: (t, e) => {
          const i = this.items[t];
          i && (i.activated = e);
        },
      }),
      this.mdcAdapter
    );
  }
  selectUi(t, e = !1) {
    const i = this.items[t];
    i && ((i.selected = !0), (i.activated = e));
  }
  deselectUi(t) {
    const e = this.items[t];
    e && ((e.selected = !1), (e.activated = !1));
  }
  select(t) {
    this.mdcFoundation && this.mdcFoundation.setSelectedIndex(t);
  }
  toggle(t, e) {
    this.multi && this.mdcFoundation.toggleMultiAtIndex(t, e);
  }
  onListItemConnected(t) {
    const e = t.target;
    this.layout(-1 === this.items.indexOf(e));
  }
  layout(t = !0) {
    t && this.updateItems();
    const e = this.items[0];
    for (const t of this.items) t.tabindex = -1;
    e &&
      (this.noninteractive
        ? this.previousTabindex || (this.previousTabindex = e)
        : (e.tabindex = 0)),
      this.itemsReadyResolver();
  }
  getFocusedItemIndex() {
    if (!this.mdcRoot) return -1;
    if (!this.items.length) return -1;
    const t = x();
    if (!t.length) return -1;
    for (let e = t.length - 1; e >= 0; e--) {
      const i = t[e];
      if (tt(i)) return this.items.indexOf(i);
    }
    return -1;
  }
  focusItemAtIndex(t) {
    for (const t of this.items)
      if (0 === t.tabindex) {
        t.tabindex = -1;
        break;
      }
    (this.items[t].tabindex = 0), this.items[t].focus();
  }
  focus() {
    const t = this.mdcRoot;
    t && t.focus();
  }
  blur() {
    const t = this.mdcRoot;
    t && t.blur();
  }
}
i([d({ type: String })], it.prototype, "emptyMessage", void 0),
  i([s(".mdc-deprecated-list")], it.prototype, "mdcRoot", void 0),
  i([E("", !0, "*")], it.prototype, "assignedElements", void 0),
  i([E("", !0, '[tabindex="0"]')], it.prototype, "tabbableElements", void 0),
  i(
    [
      d({ type: Boolean }),
      v(function (t) {
        this.mdcFoundation && this.mdcFoundation.setUseActivatedClass(t);
      }),
    ],
    it.prototype,
    "activatable",
    void 0
  ),
  i(
    [
      d({ type: Boolean }),
      v(function (t, e) {
        this.mdcFoundation && this.mdcFoundation.setMulti(t),
          void 0 !== e && this.layout();
      }),
    ],
    it.prototype,
    "multi",
    void 0
  ),
  i(
    [
      d({ type: Boolean }),
      v(function (t) {
        this.mdcFoundation && this.mdcFoundation.setWrapFocus(t);
      }),
    ],
    it.prototype,
    "wrapFocus",
    void 0
  ),
  i(
    [
      d({ type: String }),
      v(function (t, e) {
        void 0 !== e && this.updateItems();
      }),
    ],
    it.prototype,
    "itemRoles",
    void 0
  ),
  i([d({ type: String })], it.prototype, "innerRole", void 0),
  i([d({ type: String })], it.prototype, "innerAriaLabel", void 0),
  i([d({ type: Boolean })], it.prototype, "rootTabbable", void 0),
  i(
    [
      d({ type: Boolean, reflect: !0 }),
      v(function (t) {
        var e, i;
        if (t) {
          const t =
            null !==
              (i =
                null === (e = this.tabbableElements) || void 0 === e
                  ? void 0
                  : e[0]) && void 0 !== i
              ? i
              : null;
          (this.previousTabindex = t), t && t.setAttribute("tabindex", "-1");
        } else !t && this.previousTabindex && (this.previousTabindex.setAttribute("tabindex", "0"), (this.previousTabindex = null));
      }),
    ],
    it.prototype,
    "noninteractive",
    void 0
  );
const st = m`@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));padding:var(--mdc-list-vertical-padding, 8px) 0}.mdc-deprecated-list:focus{outline:none}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0, 0, 0, 0.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding, 16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin, 72px);margin-right:0;width:calc( 100% - var(--mdc-list-inset-margin, 72px) )}[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]),.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]){margin-left:0;margin-right:var(--mdc-list-inset-margin, 72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc( 100% - var(--mdc-list-inset-margin, 72px) - var(--mdc-list-side-padding, 16px) )}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 20px}.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`;
let rt = class extends it {};
(rt.styles = [st]), (rt = i([h("mwc-list")], rt));
export { S as K, I as L, V as a, G as c, q as n, E as o, b as s };
