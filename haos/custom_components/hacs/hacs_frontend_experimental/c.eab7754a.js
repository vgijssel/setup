import {
  l as t,
  o as e,
  f as i,
  i as s,
  h as n,
  e as o,
  t as r,
  j as a,
  R as d,
  y as c,
  k as l,
  d as h,
  n as m,
  M as p,
  B as u,
  p as g,
  q as f,
  u as y,
  v as _,
  x,
  z as v,
  A as E,
  C as b,
  D as I,
  _ as T,
  F as A,
  E as O,
  G as S,
} from "./main-85e087f9.js";
import { o as R } from "./c.8e28b461.js";
function C(i, s, n) {
  let o,
    r = i;
  return (
    "object" == typeof i ? ((r = i.slot), (o = i)) : (o = { flatten: s }),
    n
      ? t({ slot: r, flatten: s, selector: n })
      : e({
          descriptor: (t) => ({
            get() {
              var t, e;
              const i = "slot" + (r ? `[name=${r}]` : ":not([name])"),
                s =
                  null === (t = this.renderRoot) || void 0 === t
                    ? void 0
                    : t.querySelector(i);
              return null !== (e = null == s ? void 0 : s.assignedNodes(o)) &&
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
function w(t) {
  const e = t.language || "en";
  return (
    (t.translationMetadata.translations[e] &&
      t.translationMetadata.translations[e].isRTL) ||
    !1
  );
}
function F(t) {
  return w(t) ? "rtl" : "ltr";
}
class N extends a {
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
      (this.rippleHandlers = new d(
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
i([s("slot")], N.prototype, "slotElement", void 0),
  i([n("mwc-ripple")], N.prototype, "ripple", void 0),
  i([o({ type: String })], N.prototype, "value", void 0),
  i([o({ type: String, reflect: !0 })], N.prototype, "group", void 0),
  i([o({ type: Number, reflect: !0 })], N.prototype, "tabindex", void 0),
  i(
    [
      o({ type: Boolean, reflect: !0 }),
      R(function (t) {
        t
          ? this.setAttribute("aria-disabled", "true")
          : this.setAttribute("aria-disabled", "false");
      }),
    ],
    N.prototype,
    "disabled",
    void 0
  ),
  i([o({ type: Boolean, reflect: !0 })], N.prototype, "twoline", void 0),
  i([o({ type: Boolean, reflect: !0 })], N.prototype, "activated", void 0),
  i([o({ type: String, reflect: !0 })], N.prototype, "graphic", void 0),
  i([o({ type: Boolean })], N.prototype, "multipleGraphics", void 0),
  i([o({ type: Boolean })], N.prototype, "hasMeta", void 0),
  i(
    [
      o({ type: Boolean, reflect: !0 }),
      R(function (t) {
        t
          ? (this.removeAttribute("aria-checked"),
            this.removeAttribute("mwc-list-item"),
            (this.selected = !1),
            (this.activated = !1),
            (this.tabIndex = -1))
          : this.setAttribute("mwc-list-item", "");
      }),
    ],
    N.prototype,
    "noninteractive",
    void 0
  ),
  i(
    [
      o({ type: Boolean, reflect: !0 }),
      R(function (t) {
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
    N.prototype,
    "selected",
    void 0
  ),
  i([r()], N.prototype, "shouldRenderRipple", void 0),
  i([r()], N.prototype, "_managingList", void 0);
const M = h`:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding, 16px);padding-right:var(--mdc-list-side-padding, 16px);outline:none;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host:focus{outline:none}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary, #6200ee);--mdc-ripple-color: var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12);background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size, 24px);height:var(--mdc-list-item-meta-size, 24px);margin-left:auto;margin-right:0;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size, 24px);line-height:var(--mdc-list-item-meta-size, 24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size, 24px) !important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit)}[dir=rtl] .mdc-deprecated-list-item__meta,.mdc-deprecated-list-item__meta[dir=rtl]{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0, 0, 0, 0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 40px);height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 40px);line-height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 40px) !important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 16px)}[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 24px);height:var(--mdc-list-item-graphic-size, 24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 24px);line-height:var(--mdc-list-item-graphic-size, 24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 24px) !important}[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic,:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=medium]:not([twoLine])),:host([graphic=large]:not([twoLine])){height:72px}:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 56px);height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 56px);line-height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 56px) !important}:host([graphic=large]){padding-left:0px}`;
let k = class extends N {};
(k.styles = [M]), (k = i([m("mwc-list-item")], k));
var B = {
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
  L = new Set();
L.add(B.BACKSPACE),
  L.add(B.ENTER),
  L.add(B.SPACEBAR),
  L.add(B.PAGE_UP),
  L.add(B.PAGE_DOWN),
  L.add(B.END),
  L.add(B.HOME),
  L.add(B.ARROW_LEFT),
  L.add(B.ARROW_UP),
  L.add(B.ARROW_RIGHT),
  L.add(B.ARROW_DOWN),
  L.add(B.DELETE),
  L.add(B.ESCAPE),
  L.add(B.TAB);
var D = 8,
  P = 13,
  H = 32,
  z = 33,
  U = 34,
  $ = 35,
  G = 36,
  W = 37,
  K = 38,
  V = 39,
  q = 40,
  j = 46,
  X = 27,
  Q = 9,
  Y = new Map();
Y.set(D, B.BACKSPACE),
  Y.set(P, B.ENTER),
  Y.set(H, B.SPACEBAR),
  Y.set(z, B.PAGE_UP),
  Y.set(U, B.PAGE_DOWN),
  Y.set($, B.END),
  Y.set(G, B.HOME),
  Y.set(W, B.ARROW_LEFT),
  Y.set(K, B.ARROW_UP),
  Y.set(V, B.ARROW_RIGHT),
  Y.set(q, B.ARROW_DOWN),
  Y.set(j, B.DELETE),
  Y.set(X, B.ESCAPE),
  Y.set(Q, B.TAB);
var Z,
  J,
  tt = new Set();
function et(t) {
  var e = t.key;
  if (L.has(e)) return e;
  var i = Y.get(t.keyCode);
  return i || B.UNKNOWN;
}
tt.add(B.PAGE_UP),
  tt.add(B.PAGE_DOWN),
  tt.add(B.END),
  tt.add(B.HOME),
  tt.add(B.ARROW_LEFT),
  tt.add(B.ARROW_UP),
  tt.add(B.ARROW_RIGHT),
  tt.add(B.ARROW_DOWN);
var it = "mdc-list-item--activated",
  st = "mdc-list-item",
  nt = "mdc-list-item--disabled",
  ot = "mdc-list-item--selected",
  rt = "mdc-list-item__text",
  at = "mdc-list-item__primary-text",
  dt = "mdc-list";
((Z = {})["" + it] = "mdc-list-item--activated"),
  (Z["" + st] = "mdc-list-item"),
  (Z["" + nt] = "mdc-list-item--disabled"),
  (Z["" + ot] = "mdc-list-item--selected"),
  (Z["" + at] = "mdc-list-item__primary-text"),
  (Z["" + dt] = "mdc-list");
var ct =
    (((J = {})["" + it] = "mdc-deprecated-list-item--activated"),
    (J["" + st] = "mdc-deprecated-list-item"),
    (J["" + nt] = "mdc-deprecated-list-item--disabled"),
    (J["" + ot] = "mdc-deprecated-list-item--selected"),
    (J["" + rt] = "mdc-deprecated-list-item__text"),
    (J["" + at] = "mdc-deprecated-list-item__primary-text"),
    (J["" + dt] = "mdc-deprecated-list"),
    J),
  lt = {
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
      st +
      " button:not(:disabled),\n    ." +
      st +
      " a,\n    ." +
      ct[st] +
      " button:not(:disabled),\n    ." +
      ct[st] +
      " a\n  ",
    DEPRECATED_SELECTOR: ".mdc-deprecated-list",
    FOCUSABLE_CHILD_ELEMENTS:
      "\n    ." +
      st +
      " button:not(:disabled),\n    ." +
      st +
      " a,\n    ." +
      st +
      ' input[type="radio"]:not(:disabled),\n    .' +
      st +
      ' input[type="checkbox"]:not(:disabled),\n    .' +
      ct[st] +
      " button:not(:disabled),\n    ." +
      ct[st] +
      " a,\n    ." +
      ct[st] +
      ' input[type="radio"]:not(:disabled),\n    .' +
      ct[st] +
      ' input[type="checkbox"]:not(:disabled)\n  ',
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]',
  },
  ht = { UNSET_INDEX: -1, TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300 };
const mt = (t, e) => t - e,
  pt = ["input", "button", "textarea", "select"];
function ut(t) {
  return t instanceof Set;
}
const gt = (t) => {
  const e = t === ht.UNSET_INDEX ? new Set() : t;
  return ut(e) ? new Set(e) : new Set([e]);
};
class ft extends p {
  constructor(t) {
    super(Object.assign(Object.assign({}, ft.defaultAdapter), t)),
      (this.isMulti_ = !1),
      (this.wrapFocus_ = !1),
      (this.isVertical_ = !0),
      (this.selectedIndex_ = ht.UNSET_INDEX),
      (this.focusedItemIndex_ = ht.UNSET_INDEX),
      (this.useActivatedClass_ = !1),
      (this.ariaCurrentAttrValue_ = null);
  }
  static get strings() {
    return lt;
  }
  static get numbers() {
    return ht;
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
      if (!ut(e)) {
        const t = e === ht.UNSET_INDEX;
        this.selectedIndex_ = t ? new Set() : new Set([e]);
      }
    } else if (ut(e))
      if (e.size) {
        const t = Array.from(e).sort(mt);
        this.selectedIndex_ = t[0];
      } else this.selectedIndex_ = ht.UNSET_INDEX;
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
        ? this.setMultiSelectionAtIndex_(gt(t))
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
    const s = "ArrowLeft" === et(t),
      n = "ArrowUp" === et(t),
      o = "ArrowRight" === et(t),
      r = "ArrowDown" === et(t),
      a = "Home" === et(t),
      d = "End" === et(t),
      c = "Enter" === et(t),
      l = "Spacebar" === et(t);
    if (this.adapter.isRootFocused())
      return void (n || d
        ? (t.preventDefault(), this.focusLastElement())
        : (r || a) && (t.preventDefault(), this.focusFirstElement()));
    let h,
      m = this.adapter.getFocusedElementIndex();
    if (!(-1 === m && ((m = i), m < 0))) {
      if ((this.isVertical_ && r) || (!this.isVertical_ && o))
        this.preventDefaultEvent(t), (h = this.focusNextElement(m));
      else if ((this.isVertical_ && n) || (!this.isVertical_ && s))
        this.preventDefaultEvent(t), (h = this.focusPrevElement(m));
      else if (a) this.preventDefaultEvent(t), (h = this.focusFirstElement());
      else if (d) this.preventDefaultEvent(t), (h = this.focusLastElement());
      else if ((c || l) && e) {
        const e = t.target;
        if (e && "A" === e.tagName && c) return;
        this.preventDefaultEvent(t), this.setSelectedIndexOnAction_(m, !0);
      }
      (this.focusedItemIndex_ = m),
        void 0 !== h &&
          (this.setTabindexAtIndex_(h), (this.focusedItemIndex_ = h));
    }
  }
  handleSingleSelection(t, e, i) {
    t !== ht.UNSET_INDEX &&
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
    -1 === pt.indexOf(e) && t.preventDefault();
  }
  setSingleSelectionAtIndex_(t, e = !0) {
    this.selectedIndex_ !== t &&
      (this.selectedIndex_ !== ht.UNSET_INDEX &&
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
        n = { added: [], removed: [] },
        o = i.sort(mt),
        r = s.sort(mt);
      let a = 0,
        d = 0;
      for (; a < o.length || d < r.length; ) {
        const t = o[a],
          e = r[d];
        t !== e
          ? void 0 !== t && (void 0 === e || t < e)
            ? (n.removed.push(t), a++)
            : void 0 !== e && (void 0 === t || e < t) && (n.added.push(e), d++)
          : (a++, d++);
      }
      return n;
    })(gt(this.selectedIndex_), t);
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
    this.selectedIndex_ === ht.UNSET_INDEX &&
      (this.ariaCurrentAttrValue_ = this.adapter.getAttributeForElementIndex(
        t,
        lt.ARIA_CURRENT
      ));
    const e = null !== this.ariaCurrentAttrValue_,
      i = e ? lt.ARIA_CURRENT : lt.ARIA_SELECTED;
    this.selectedIndex_ !== ht.UNSET_INDEX &&
      this.adapter.setAttributeForElementIndex(this.selectedIndex_, i, "false");
    const s = e ? this.ariaCurrentAttrValue_ : "true";
    this.adapter.setAttributeForElementIndex(t, i, s);
  }
  setTabindexAtIndex_(t) {
    this.focusedItemIndex_ === ht.UNSET_INDEX && 0 !== t
      ? this.adapter.setTabIndexForElementIndex(0, -1)
      : this.focusedItemIndex_ >= 0 &&
        this.focusedItemIndex_ !== t &&
        this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_, -1),
      this.adapter.setTabIndexForElementIndex(t, 0);
  }
  setTabindexToFirstSelectedItem_() {
    let t = 0;
    "number" == typeof this.selectedIndex_ &&
    this.selectedIndex_ !== ht.UNSET_INDEX
      ? (t = this.selectedIndex_)
      : ut(this.selectedIndex_) &&
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
      return t === ht.UNSET_INDEX || this.isIndexInRange_(t);
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
          this.setSingleSelectionAtIndex_(ht.UNSET_INDEX);
      }
      e && this.adapter.notifyAction(t);
    }
  }
  toggleMultiAtIndex(t, e, i = !0) {
    let s = !1;
    s = void 0 === e ? !this.adapter.getSelectedStateForElementIndex(t) : e;
    const n = gt(this.selectedIndex_);
    s ? n.add(t) : n.delete(t), this.setMultiSelectionAtIndex_(n, i);
  }
}
const yt = (t) => t.hasAttribute("mwc-list-item");
function _t() {
  const t = this.itemsReadyResolver;
  (this.itemsReady = new Promise((t) => (this.itemsReadyResolver = t))), t();
}
class xt extends u {
  constructor() {
    super(),
      (this.mdcAdapter = null),
      (this.mdcFoundationClass = ft),
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
      _t.call(this), t(e);
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
      yt(t) && (i.push(t), (t._managingList = this)),
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
    const n = new Event("items-updated", { bubbles: !0, composed: !0 });
    this.dispatchEvent(n);
  }
  get selected() {
    const t = this.index;
    if (!ut(t)) return -1 === t ? null : this.items[t];
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
        s = yt(i);
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
      if ((f(t) && yt(t) && (i = e.indexOf(t)), -1 !== i)) return i;
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
        isFocusInsideList: () => y(this),
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
    const t = _();
    if (!t.length) return -1;
    for (let e = t.length - 1; e >= 0; e--) {
      const i = t[e];
      if (yt(i)) return this.items.indexOf(i);
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
i([o({ type: String })], xt.prototype, "emptyMessage", void 0),
  i([s(".mdc-deprecated-list")], xt.prototype, "mdcRoot", void 0),
  i([C("", !0, "*")], xt.prototype, "assignedElements", void 0),
  i([C("", !0, '[tabindex="0"]')], xt.prototype, "tabbableElements", void 0),
  i(
    [
      o({ type: Boolean }),
      R(function (t) {
        this.mdcFoundation && this.mdcFoundation.setUseActivatedClass(t);
      }),
    ],
    xt.prototype,
    "activatable",
    void 0
  ),
  i(
    [
      o({ type: Boolean }),
      R(function (t, e) {
        this.mdcFoundation && this.mdcFoundation.setMulti(t),
          void 0 !== e && this.layout();
      }),
    ],
    xt.prototype,
    "multi",
    void 0
  ),
  i(
    [
      o({ type: Boolean }),
      R(function (t) {
        this.mdcFoundation && this.mdcFoundation.setWrapFocus(t);
      }),
    ],
    xt.prototype,
    "wrapFocus",
    void 0
  ),
  i(
    [
      o({ type: String }),
      R(function (t, e) {
        void 0 !== e && this.updateItems();
      }),
    ],
    xt.prototype,
    "itemRoles",
    void 0
  ),
  i([o({ type: String })], xt.prototype, "innerRole", void 0),
  i([o({ type: String })], xt.prototype, "innerAriaLabel", void 0),
  i([o({ type: Boolean })], xt.prototype, "rootTabbable", void 0),
  i(
    [
      o({ type: Boolean, reflect: !0 }),
      R(function (t) {
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
        } else
          !t &&
            this.previousTabindex &&
            (this.previousTabindex.setAttribute("tabindex", "0"),
            (this.previousTabindex = null));
      }),
    ],
    xt.prototype,
    "noninteractive",
    void 0
  );
const vt = h`@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));padding:var(--mdc-list-vertical-padding, 8px) 0}.mdc-deprecated-list:focus{outline:none}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0, 0, 0, 0.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding, 16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin, 72px);margin-right:0;width:calc( 100% - var(--mdc-list-inset-margin, 72px) )}[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]),.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]){margin-left:0;margin-right:var(--mdc-list-inset-margin, 72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc( 100% - var(--mdc-list-inset-margin, 72px) - var(--mdc-list-side-padding, 16px) )}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 20px}.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`;
let Et = class extends xt {};
(Et.styles = [vt]), (Et = i([m("mwc-list")], Et));
var bt,
  It,
  Tt = {
    ANCHOR: "mdc-menu-surface--anchor",
    ANIMATING_CLOSED: "mdc-menu-surface--animating-closed",
    ANIMATING_OPEN: "mdc-menu-surface--animating-open",
    FIXED: "mdc-menu-surface--fixed",
    IS_OPEN_BELOW: "mdc-menu-surface--is-open-below",
    OPEN: "mdc-menu-surface--open",
    ROOT: "mdc-menu-surface",
  },
  At = {
    CLOSED_EVENT: "MDCMenuSurface:closed",
    CLOSING_EVENT: "MDCMenuSurface:closing",
    OPENED_EVENT: "MDCMenuSurface:opened",
    FOCUSABLE_ELEMENTS: [
      "button:not(:disabled)",
      '[href]:not([aria-disabled="true"])',
      "input:not(:disabled)",
      "select:not(:disabled)",
      "textarea:not(:disabled)",
      '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
    ].join(", "),
  },
  Ot = {
    TRANSITION_OPEN_DURATION: 120,
    TRANSITION_CLOSE_DURATION: 75,
    MARGIN_TO_EDGE: 32,
    ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
    TOUCH_EVENT_WAIT_MS: 30,
  };
!(function (t) {
  (t[(t.BOTTOM = 1)] = "BOTTOM"),
    (t[(t.CENTER = 2)] = "CENTER"),
    (t[(t.RIGHT = 4)] = "RIGHT"),
    (t[(t.FLIP_RTL = 8)] = "FLIP_RTL");
})(bt || (bt = {})),
  (function (t) {
    (t[(t.TOP_LEFT = 0)] = "TOP_LEFT"),
      (t[(t.TOP_RIGHT = 4)] = "TOP_RIGHT"),
      (t[(t.BOTTOM_LEFT = 1)] = "BOTTOM_LEFT"),
      (t[(t.BOTTOM_RIGHT = 5)] = "BOTTOM_RIGHT"),
      (t[(t.TOP_START = 8)] = "TOP_START"),
      (t[(t.TOP_END = 12)] = "TOP_END"),
      (t[(t.BOTTOM_START = 9)] = "BOTTOM_START"),
      (t[(t.BOTTOM_END = 13)] = "BOTTOM_END");
  })(It || (It = {}));
var St = (function (t) {
    function e(i) {
      var s = t.call(this, v(v({}, e.defaultAdapter), i)) || this;
      return (
        (s.isSurfaceOpen = !1),
        (s.isQuickOpen = !1),
        (s.isHoistedElement = !1),
        (s.isFixedPosition = !1),
        (s.isHorizontallyCenteredOnViewport = !1),
        (s.maxHeight = 0),
        (s.openBottomBias = 0),
        (s.openAnimationEndTimerId = 0),
        (s.closeAnimationEndTimerId = 0),
        (s.animationRequestId = 0),
        (s.anchorCorner = It.TOP_START),
        (s.originCorner = It.TOP_START),
        (s.anchorMargin = { top: 0, right: 0, bottom: 0, left: 0 }),
        (s.position = { x: 0, y: 0 }),
        s
      );
    }
    return (
      x(e, t),
      Object.defineProperty(e, "cssClasses", {
        get: function () {
          return Tt;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "strings", {
        get: function () {
          return At;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "numbers", {
        get: function () {
          return Ot;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "Corner", {
        get: function () {
          return It;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            hasClass: function () {
              return !1;
            },
            hasAnchor: function () {
              return !1;
            },
            isElementInContainer: function () {
              return !1;
            },
            isFocused: function () {
              return !1;
            },
            isRtl: function () {
              return !1;
            },
            getInnerDimensions: function () {
              return { height: 0, width: 0 };
            },
            getAnchorDimensions: function () {
              return null;
            },
            getWindowDimensions: function () {
              return { height: 0, width: 0 };
            },
            getBodyDimensions: function () {
              return { height: 0, width: 0 };
            },
            getWindowScroll: function () {
              return { x: 0, y: 0 };
            },
            setPosition: function () {},
            setMaxHeight: function () {},
            setTransformOrigin: function () {},
            saveFocus: function () {},
            restoreFocus: function () {},
            notifyClose: function () {},
            notifyOpen: function () {},
            notifyClosing: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.init = function () {
        var t = e.cssClasses,
          i = t.ROOT,
          s = t.OPEN;
        if (!this.adapter.hasClass(i))
          throw new Error(i + " class required in root element.");
        this.adapter.hasClass(s) && (this.isSurfaceOpen = !0);
      }),
      (e.prototype.destroy = function () {
        clearTimeout(this.openAnimationEndTimerId),
          clearTimeout(this.closeAnimationEndTimerId),
          cancelAnimationFrame(this.animationRequestId);
      }),
      (e.prototype.setAnchorCorner = function (t) {
        this.anchorCorner = t;
      }),
      (e.prototype.flipCornerHorizontally = function () {
        this.originCorner = this.originCorner ^ bt.RIGHT;
      }),
      (e.prototype.setAnchorMargin = function (t) {
        (this.anchorMargin.top = t.top || 0),
          (this.anchorMargin.right = t.right || 0),
          (this.anchorMargin.bottom = t.bottom || 0),
          (this.anchorMargin.left = t.left || 0);
      }),
      (e.prototype.setIsHoisted = function (t) {
        this.isHoistedElement = t;
      }),
      (e.prototype.setFixedPosition = function (t) {
        this.isFixedPosition = t;
      }),
      (e.prototype.isFixed = function () {
        return this.isFixedPosition;
      }),
      (e.prototype.setAbsolutePosition = function (t, e) {
        (this.position.x = this.isFinite(t) ? t : 0),
          (this.position.y = this.isFinite(e) ? e : 0);
      }),
      (e.prototype.setIsHorizontallyCenteredOnViewport = function (t) {
        this.isHorizontallyCenteredOnViewport = t;
      }),
      (e.prototype.setQuickOpen = function (t) {
        this.isQuickOpen = t;
      }),
      (e.prototype.setMaxHeight = function (t) {
        this.maxHeight = t;
      }),
      (e.prototype.setOpenBottomBias = function (t) {
        this.openBottomBias = t;
      }),
      (e.prototype.isOpen = function () {
        return this.isSurfaceOpen;
      }),
      (e.prototype.open = function () {
        var t = this;
        this.isSurfaceOpen ||
          (this.adapter.saveFocus(),
          this.isQuickOpen
            ? ((this.isSurfaceOpen = !0),
              this.adapter.addClass(e.cssClasses.OPEN),
              (this.dimensions = this.adapter.getInnerDimensions()),
              this.autoposition(),
              this.adapter.notifyOpen())
            : (this.adapter.addClass(e.cssClasses.ANIMATING_OPEN),
              (this.animationRequestId = requestAnimationFrame(function () {
                (t.dimensions = t.adapter.getInnerDimensions()),
                  t.autoposition(),
                  t.adapter.addClass(e.cssClasses.OPEN),
                  (t.openAnimationEndTimerId = setTimeout(function () {
                    (t.openAnimationEndTimerId = 0),
                      t.adapter.removeClass(e.cssClasses.ANIMATING_OPEN),
                      t.adapter.notifyOpen();
                  }, Ot.TRANSITION_OPEN_DURATION));
              })),
              (this.isSurfaceOpen = !0)));
      }),
      (e.prototype.close = function (t) {
        var i = this;
        if ((void 0 === t && (t = !1), this.isSurfaceOpen)) {
          if ((this.adapter.notifyClosing(), this.isQuickOpen))
            return (
              (this.isSurfaceOpen = !1),
              t || this.maybeRestoreFocus(),
              this.adapter.removeClass(e.cssClasses.OPEN),
              this.adapter.removeClass(e.cssClasses.IS_OPEN_BELOW),
              void this.adapter.notifyClose()
            );
          this.adapter.addClass(e.cssClasses.ANIMATING_CLOSED),
            requestAnimationFrame(function () {
              i.adapter.removeClass(e.cssClasses.OPEN),
                i.adapter.removeClass(e.cssClasses.IS_OPEN_BELOW),
                (i.closeAnimationEndTimerId = setTimeout(function () {
                  (i.closeAnimationEndTimerId = 0),
                    i.adapter.removeClass(e.cssClasses.ANIMATING_CLOSED),
                    i.adapter.notifyClose();
                }, Ot.TRANSITION_CLOSE_DURATION));
            }),
            (this.isSurfaceOpen = !1),
            t || this.maybeRestoreFocus();
        }
      }),
      (e.prototype.handleBodyClick = function (t) {
        var e = t.target;
        this.adapter.isElementInContainer(e) || this.close();
      }),
      (e.prototype.handleKeydown = function (t) {
        var e = t.keyCode;
        ("Escape" === t.key || 27 === e) && this.close();
      }),
      (e.prototype.autoposition = function () {
        var t;
        this.measurements = this.getAutoLayoutmeasurements();
        var i = this.getoriginCorner(),
          s = this.getMenuSurfaceMaxHeight(i),
          n = this.hasBit(i, bt.BOTTOM) ? "bottom" : "top",
          o = this.hasBit(i, bt.RIGHT) ? "right" : "left",
          r = this.getHorizontalOriginOffset(i),
          a = this.getVerticalOriginOffset(i),
          d = this.measurements,
          c = d.anchorSize,
          l = d.surfaceSize,
          h = (((t = {})[o] = r), (t[n] = a), t);
        c.width / l.width > Ot.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO &&
          (o = "center"),
          (this.isHoistedElement || this.isFixedPosition) &&
            this.adjustPositionForHoistedElement(h),
          this.adapter.setTransformOrigin(o + " " + n),
          this.adapter.setPosition(h),
          this.adapter.setMaxHeight(s ? s + "px" : ""),
          this.hasBit(i, bt.BOTTOM) ||
            this.adapter.addClass(e.cssClasses.IS_OPEN_BELOW);
      }),
      (e.prototype.getAutoLayoutmeasurements = function () {
        var t = this.adapter.getAnchorDimensions(),
          e = this.adapter.getBodyDimensions(),
          i = this.adapter.getWindowDimensions(),
          s = this.adapter.getWindowScroll();
        return (
          t ||
            (t = {
              top: this.position.y,
              right: this.position.x,
              bottom: this.position.y,
              left: this.position.x,
              width: 0,
              height: 0,
            }),
          {
            anchorSize: t,
            bodySize: e,
            surfaceSize: this.dimensions,
            viewportDistance: {
              top: t.top,
              right: i.width - t.right,
              bottom: i.height - t.bottom,
              left: t.left,
            },
            viewportSize: i,
            windowScroll: s,
          }
        );
      }),
      (e.prototype.getoriginCorner = function () {
        var t,
          i,
          s = this.originCorner,
          n = this.measurements,
          o = n.viewportDistance,
          r = n.anchorSize,
          a = n.surfaceSize,
          d = e.numbers.MARGIN_TO_EDGE;
        this.hasBit(this.anchorCorner, bt.BOTTOM)
          ? ((t = o.top - d + this.anchorMargin.bottom),
            (i = o.bottom - d - this.anchorMargin.bottom))
          : ((t = o.top - d + this.anchorMargin.top),
            (i = o.bottom - d + r.height - this.anchorMargin.top)),
          !(i - a.height > 0) &&
            t > i + this.openBottomBias &&
            (s = this.setBit(s, bt.BOTTOM));
        var c,
          l,
          h = this.adapter.isRtl(),
          m = this.hasBit(this.anchorCorner, bt.FLIP_RTL),
          p =
            this.hasBit(this.anchorCorner, bt.RIGHT) ||
            this.hasBit(s, bt.RIGHT),
          u = !1;
        (u = h && m ? !p : p)
          ? ((c = o.left + r.width + this.anchorMargin.right),
            (l = o.right - this.anchorMargin.right))
          : ((c = o.left + this.anchorMargin.left),
            (l = o.right + r.width - this.anchorMargin.left));
        var g = c - a.width > 0,
          f = l - a.width > 0,
          y = this.hasBit(s, bt.FLIP_RTL) && this.hasBit(s, bt.RIGHT);
        return (
          (f && y && h) || (!g && y)
            ? (s = this.unsetBit(s, bt.RIGHT))
            : ((g && u && h) || (g && !u && p) || (!f && c >= l)) &&
              (s = this.setBit(s, bt.RIGHT)),
          s
        );
      }),
      (e.prototype.getMenuSurfaceMaxHeight = function (t) {
        if (this.maxHeight > 0) return this.maxHeight;
        var i = this.measurements.viewportDistance,
          s = 0,
          n = this.hasBit(t, bt.BOTTOM),
          o = this.hasBit(this.anchorCorner, bt.BOTTOM),
          r = e.numbers.MARGIN_TO_EDGE;
        return (
          n
            ? ((s = i.top + this.anchorMargin.top - r),
              o || (s += this.measurements.anchorSize.height))
            : ((s =
                i.bottom -
                this.anchorMargin.bottom +
                this.measurements.anchorSize.height -
                r),
              o && (s -= this.measurements.anchorSize.height)),
          s
        );
      }),
      (e.prototype.getHorizontalOriginOffset = function (t) {
        var e = this.measurements.anchorSize,
          i = this.hasBit(t, bt.RIGHT),
          s = this.hasBit(this.anchorCorner, bt.RIGHT);
        if (i) {
          var n = s
            ? e.width - this.anchorMargin.left
            : this.anchorMargin.right;
          return this.isHoistedElement || this.isFixedPosition
            ? n -
                (this.measurements.viewportSize.width -
                  this.measurements.bodySize.width)
            : n;
        }
        return s ? e.width - this.anchorMargin.right : this.anchorMargin.left;
      }),
      (e.prototype.getVerticalOriginOffset = function (t) {
        var e = this.measurements.anchorSize,
          i = this.hasBit(t, bt.BOTTOM),
          s = this.hasBit(this.anchorCorner, bt.BOTTOM);
        return i
          ? s
            ? e.height - this.anchorMargin.top
            : -this.anchorMargin.bottom
          : s
          ? e.height + this.anchorMargin.bottom
          : this.anchorMargin.top;
      }),
      (e.prototype.adjustPositionForHoistedElement = function (t) {
        var e,
          i,
          s = this.measurements,
          n = s.windowScroll,
          o = s.viewportDistance,
          r = s.surfaceSize,
          a = s.viewportSize,
          d = Object.keys(t);
        try {
          for (var c = E(d), l = c.next(); !l.done; l = c.next()) {
            var h = l.value,
              m = t[h] || 0;
            !this.isHorizontallyCenteredOnViewport ||
            ("left" !== h && "right" !== h)
              ? ((m += o[h]),
                this.isFixedPosition ||
                  ("top" === h
                    ? (m += n.y)
                    : "bottom" === h
                    ? (m -= n.y)
                    : "left" === h
                    ? (m += n.x)
                    : (m -= n.x)),
                (t[h] = m))
              : (t[h] = (a.width - r.width) / 2);
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            l && !l.done && (i = c.return) && i.call(c);
          } finally {
            if (e) throw e.error;
          }
        }
      }),
      (e.prototype.maybeRestoreFocus = function () {
        var t = this,
          e = this.adapter.isFocused(),
          i =
            document.activeElement &&
            this.adapter.isElementInContainer(document.activeElement);
        (e || i) &&
          setTimeout(function () {
            t.adapter.restoreFocus();
          }, Ot.TOUCH_EVENT_WAIT_MS);
      }),
      (e.prototype.hasBit = function (t, e) {
        return Boolean(t & e);
      }),
      (e.prototype.setBit = function (t, e) {
        return t | e;
      }),
      (e.prototype.unsetBit = function (t, e) {
        return t ^ e;
      }),
      (e.prototype.isFinite = function (t) {
        return "number" == typeof t && isFinite(t);
      }),
      e
    );
  })(p),
  Rt = St;
const Ct = {
  TOP_LEFT: It.TOP_LEFT,
  TOP_RIGHT: It.TOP_RIGHT,
  BOTTOM_LEFT: It.BOTTOM_LEFT,
  BOTTOM_RIGHT: It.BOTTOM_RIGHT,
  TOP_START: It.TOP_START,
  TOP_END: It.TOP_END,
  BOTTOM_START: It.BOTTOM_START,
  BOTTOM_END: It.BOTTOM_END,
};
class wt extends u {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = Rt),
      (this.absolute = !1),
      (this.fullwidth = !1),
      (this.fixed = !1),
      (this.x = null),
      (this.y = null),
      (this.quick = !1),
      (this.open = !1),
      (this.stayOpenOnBodyClick = !1),
      (this.bitwiseCorner = It.TOP_START),
      (this.previousMenuCorner = null),
      (this.menuCorner = "START"),
      (this.corner = "TOP_START"),
      (this.styleTop = ""),
      (this.styleLeft = ""),
      (this.styleRight = ""),
      (this.styleBottom = ""),
      (this.styleMaxHeight = ""),
      (this.styleTransformOrigin = ""),
      (this.anchor = null),
      (this.previouslyFocused = null),
      (this.previousAnchor = null),
      (this.onBodyClickBound = () => {});
  }
  render() {
    const t = {
        "mdc-menu-surface--fixed": this.fixed,
        "mdc-menu-surface--fullwidth": this.fullwidth,
      },
      e = {
        top: this.styleTop,
        left: this.styleLeft,
        right: this.styleRight,
        bottom: this.styleBottom,
        "max-height": this.styleMaxHeight,
        "transform-origin": this.styleTransformOrigin,
      };
    return c`
      <div
          class="mdc-menu-surface ${l(t)}"
          style="${b(e)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        <slot></slot>
      </div>`;
  }
  createAdapter() {
    return Object.assign(Object.assign({}, I(this.mdcRoot)), {
      hasAnchor: () => !!this.anchor,
      notifyClose: () => {
        const t = new CustomEvent("closed", { bubbles: !0, composed: !0 });
        (this.open = !1), this.mdcRoot.dispatchEvent(t);
      },
      notifyClosing: () => {
        const t = new CustomEvent("closing", { bubbles: !0, composed: !0 });
        this.mdcRoot.dispatchEvent(t);
      },
      notifyOpen: () => {
        const t = new CustomEvent("opened", { bubbles: !0, composed: !0 });
        (this.open = !0), this.mdcRoot.dispatchEvent(t);
      },
      isElementInContainer: () => !1,
      isRtl: () =>
        !!this.mdcRoot && "rtl" === getComputedStyle(this.mdcRoot).direction,
      setTransformOrigin: (t) => {
        this.mdcRoot && (this.styleTransformOrigin = t);
      },
      isFocused: () => y(this),
      saveFocus: () => {
        const t = _(),
          e = t.length;
        e || (this.previouslyFocused = null),
          (this.previouslyFocused = t[e - 1]);
      },
      restoreFocus: () => {
        this.previouslyFocused &&
          "focus" in this.previouslyFocused &&
          this.previouslyFocused.focus();
      },
      getInnerDimensions: () => {
        const t = this.mdcRoot;
        return t
          ? { width: t.offsetWidth, height: t.offsetHeight }
          : { width: 0, height: 0 };
      },
      getAnchorDimensions: () => {
        const t = this.anchor;
        return t ? t.getBoundingClientRect() : null;
      },
      getBodyDimensions: () => ({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }),
      getWindowDimensions: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      getWindowScroll: () => ({ x: window.pageXOffset, y: window.pageYOffset }),
      setPosition: (t) => {
        this.mdcRoot &&
          ((this.styleLeft = "left" in t ? `${t.left}px` : ""),
          (this.styleRight = "right" in t ? `${t.right}px` : ""),
          (this.styleTop = "top" in t ? `${t.top}px` : ""),
          (this.styleBottom = "bottom" in t ? `${t.bottom}px` : ""));
      },
      setMaxHeight: async (t) => {
        this.mdcRoot &&
          ((this.styleMaxHeight = t),
          await this.updateComplete,
          (this.styleMaxHeight = `var(--mdc-menu-max-height, ${t})`));
      },
    });
  }
  onKeydown(t) {
    this.mdcFoundation && this.mdcFoundation.handleKeydown(t);
  }
  onBodyClick(t) {
    if (this.stayOpenOnBodyClick) return;
    -1 === t.composedPath().indexOf(this) && this.close();
  }
  registerBodyClick() {
    (this.onBodyClickBound = this.onBodyClick.bind(this)),
      document.body.addEventListener("click", this.onBodyClickBound, {
        passive: !0,
        capture: !0,
      });
  }
  deregisterBodyClick() {
    document.body.removeEventListener("click", this.onBodyClickBound, {
      capture: !0,
    });
  }
  close() {
    this.open = !1;
  }
  show() {
    this.open = !0;
  }
}
i([s(".mdc-menu-surface")], wt.prototype, "mdcRoot", void 0),
  i([s("slot")], wt.prototype, "slotElement", void 0),
  i(
    [
      o({ type: Boolean }),
      R(function (t) {
        this.mdcFoundation && !this.fixed && this.mdcFoundation.setIsHoisted(t);
      }),
    ],
    wt.prototype,
    "absolute",
    void 0
  ),
  i([o({ type: Boolean })], wt.prototype, "fullwidth", void 0),
  i(
    [
      o({ type: Boolean }),
      R(function (t) {
        this.mdcFoundation &&
          !this.absolute &&
          this.mdcFoundation.setFixedPosition(t);
      }),
    ],
    wt.prototype,
    "fixed",
    void 0
  ),
  i(
    [
      o({ type: Number }),
      R(function (t) {
        this.mdcFoundation &&
          null !== this.y &&
          null !== t &&
          (this.mdcFoundation.setAbsolutePosition(t, this.y),
          this.mdcFoundation.setAnchorMargin({
            left: t,
            top: this.y,
            right: -t,
            bottom: this.y,
          }));
      }),
    ],
    wt.prototype,
    "x",
    void 0
  ),
  i(
    [
      o({ type: Number }),
      R(function (t) {
        this.mdcFoundation &&
          null !== this.x &&
          null !== t &&
          (this.mdcFoundation.setAbsolutePosition(this.x, t),
          this.mdcFoundation.setAnchorMargin({
            left: this.x,
            top: t,
            right: -this.x,
            bottom: t,
          }));
      }),
    ],
    wt.prototype,
    "y",
    void 0
  ),
  i(
    [
      o({ type: Boolean }),
      R(function (t) {
        this.mdcFoundation && this.mdcFoundation.setQuickOpen(t);
      }),
    ],
    wt.prototype,
    "quick",
    void 0
  ),
  i(
    [
      o({ type: Boolean, reflect: !0 }),
      R(function (t, e) {
        this.mdcFoundation &&
          (t
            ? this.mdcFoundation.open()
            : void 0 !== e && this.mdcFoundation.close());
      }),
    ],
    wt.prototype,
    "open",
    void 0
  ),
  i([o({ type: Boolean })], wt.prototype, "stayOpenOnBodyClick", void 0),
  i(
    [
      r(),
      R(function (t) {
        this.mdcFoundation && this.mdcFoundation.setAnchorCorner(t);
      }),
    ],
    wt.prototype,
    "bitwiseCorner",
    void 0
  ),
  i(
    [
      o({ type: String }),
      R(function (t) {
        if (this.mdcFoundation) {
          const e = "START" === t || "END" === t,
            i = null === this.previousMenuCorner,
            s = !i && t !== this.previousMenuCorner;
          e &&
            (s || (i && "END" === t)) &&
            ((this.bitwiseCorner = this.bitwiseCorner ^ bt.RIGHT),
            this.mdcFoundation.flipCornerHorizontally(),
            (this.previousMenuCorner = t));
        }
      }),
    ],
    wt.prototype,
    "menuCorner",
    void 0
  ),
  i(
    [
      o({ type: String }),
      R(function (t) {
        if (this.mdcFoundation && t) {
          let e = Ct[t];
          "END" === this.menuCorner && (e ^= bt.RIGHT),
            (this.bitwiseCorner = e);
        }
      }),
    ],
    wt.prototype,
    "corner",
    void 0
  ),
  i([r()], wt.prototype, "styleTop", void 0),
  i([r()], wt.prototype, "styleLeft", void 0),
  i([r()], wt.prototype, "styleRight", void 0),
  i([r()], wt.prototype, "styleBottom", void 0),
  i([r()], wt.prototype, "styleMaxHeight", void 0),
  i([r()], wt.prototype, "styleTransformOrigin", void 0);
const Ft = h`.mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;transition:opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1),height 250ms cubic-bezier(0, 0, 0.2, 1);box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0,0,0,.12);background-color:#fff;background-color:var(--mdc-theme-surface, #fff);color:#000;color:var(--mdc-theme-on-surface, #000);border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0;transition:opacity .075s linear}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}:host(:not([open])){display:none}.mdc-menu-surface{z-index:8;z-index:var(--mdc-menu-z-index, 8);min-width:112px;min-width:var(--mdc-menu-min-width, 112px)}`;
let Nt = class extends wt {};
(Nt.styles = [Ft]), (Nt = i([m("mwc-menu-surface")], Nt));
var Mt,
  kt = {
    MENU_SELECTED_LIST_ITEM: "mdc-menu-item--selected",
    MENU_SELECTION_GROUP: "mdc-menu__selection-group",
    ROOT: "mdc-menu",
  },
  Bt = {
    ARIA_CHECKED_ATTR: "aria-checked",
    ARIA_DISABLED_ATTR: "aria-disabled",
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    LIST_SELECTOR: ".mdc-list,.mdc-deprecated-list",
    SELECTED_EVENT: "MDCMenu:selected",
    SKIP_RESTORE_FOCUS: "data-menu-item-skip-restore-focus",
  },
  Lt = { FOCUS_ROOT_INDEX: -1 };
!(function (t) {
  (t[(t.NONE = 0)] = "NONE"),
    (t[(t.LIST_ROOT = 1)] = "LIST_ROOT"),
    (t[(t.FIRST_ITEM = 2)] = "FIRST_ITEM"),
    (t[(t.LAST_ITEM = 3)] = "LAST_ITEM");
})(Mt || (Mt = {}));
var Dt = (function (t) {
  function e(i) {
    var s = t.call(this, v(v({}, e.defaultAdapter), i)) || this;
    return (
      (s.closeAnimationEndTimerId = 0),
      (s.defaultFocusState = Mt.LIST_ROOT),
      (s.selectedIndex = -1),
      s
    );
  }
  return (
    x(e, t),
    Object.defineProperty(e, "cssClasses", {
      get: function () {
        return kt;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(e, "strings", {
      get: function () {
        return Bt;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(e, "numbers", {
      get: function () {
        return Lt;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(e, "defaultAdapter", {
      get: function () {
        return {
          addClassToElementAtIndex: function () {},
          removeClassFromElementAtIndex: function () {},
          addAttributeToElementAtIndex: function () {},
          removeAttributeFromElementAtIndex: function () {},
          getAttributeFromElementAtIndex: function () {
            return null;
          },
          elementContainsClass: function () {
            return !1;
          },
          closeSurface: function () {},
          getElementIndex: function () {
            return -1;
          },
          notifySelected: function () {},
          getMenuItemCount: function () {
            return 0;
          },
          focusItemAtIndex: function () {},
          focusListRoot: function () {},
          getSelectedSiblingOfItemAtIndex: function () {
            return -1;
          },
          isSelectableItemAtIndex: function () {
            return !1;
          },
        };
      },
      enumerable: !1,
      configurable: !0,
    }),
    (e.prototype.destroy = function () {
      this.closeAnimationEndTimerId &&
        clearTimeout(this.closeAnimationEndTimerId),
        this.adapter.closeSurface();
    }),
    (e.prototype.handleKeydown = function (t) {
      var e = t.key,
        i = t.keyCode;
      ("Tab" === e || 9 === i) && this.adapter.closeSurface(!0);
    }),
    (e.prototype.handleItemAction = function (t) {
      var e = this,
        i = this.adapter.getElementIndex(t);
      if (!(i < 0)) {
        this.adapter.notifySelected({ index: i });
        var s =
          "true" ===
          this.adapter.getAttributeFromElementAtIndex(i, Bt.SKIP_RESTORE_FOCUS);
        this.adapter.closeSurface(s),
          (this.closeAnimationEndTimerId = setTimeout(function () {
            var i = e.adapter.getElementIndex(t);
            i >= 0 &&
              e.adapter.isSelectableItemAtIndex(i) &&
              e.setSelectedIndex(i);
          }, St.numbers.TRANSITION_CLOSE_DURATION));
      }
    }),
    (e.prototype.handleMenuSurfaceOpened = function () {
      switch (this.defaultFocusState) {
        case Mt.FIRST_ITEM:
          this.adapter.focusItemAtIndex(0);
          break;
        case Mt.LAST_ITEM:
          this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount() - 1);
          break;
        case Mt.NONE:
          break;
        default:
          this.adapter.focusListRoot();
      }
    }),
    (e.prototype.setDefaultFocusState = function (t) {
      this.defaultFocusState = t;
    }),
    (e.prototype.getSelectedIndex = function () {
      return this.selectedIndex;
    }),
    (e.prototype.setSelectedIndex = function (t) {
      if ((this.validatedIndex(t), !this.adapter.isSelectableItemAtIndex(t)))
        throw new Error(
          "MDCMenuFoundation: No selection group at specified index."
        );
      var e = this.adapter.getSelectedSiblingOfItemAtIndex(t);
      e >= 0 &&
        (this.adapter.removeAttributeFromElementAtIndex(
          e,
          Bt.ARIA_CHECKED_ATTR
        ),
        this.adapter.removeClassFromElementAtIndex(
          e,
          kt.MENU_SELECTED_LIST_ITEM
        )),
        this.adapter.addClassToElementAtIndex(t, kt.MENU_SELECTED_LIST_ITEM),
        this.adapter.addAttributeToElementAtIndex(
          t,
          Bt.ARIA_CHECKED_ATTR,
          "true"
        ),
        (this.selectedIndex = t);
    }),
    (e.prototype.setEnabled = function (t, e) {
      this.validatedIndex(t),
        e
          ? (this.adapter.removeClassFromElementAtIndex(t, nt),
            this.adapter.addAttributeToElementAtIndex(
              t,
              Bt.ARIA_DISABLED_ATTR,
              "false"
            ))
          : (this.adapter.addClassToElementAtIndex(t, nt),
            this.adapter.addAttributeToElementAtIndex(
              t,
              Bt.ARIA_DISABLED_ATTR,
              "true"
            ));
    }),
    (e.prototype.validatedIndex = function (t) {
      var e = this.adapter.getMenuItemCount();
      if (!(t >= 0 && t < e))
        throw new Error("MDCMenuFoundation: No list item at specified index.");
    }),
    e
  );
})(p);
class Pt extends u {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = Dt),
      (this.listElement_ = null),
      (this.anchor = null),
      (this.open = !1),
      (this.quick = !1),
      (this.wrapFocus = !1),
      (this.innerRole = "menu"),
      (this.innerAriaLabel = null),
      (this.corner = "TOP_START"),
      (this.x = null),
      (this.y = null),
      (this.absolute = !1),
      (this.multi = !1),
      (this.activatable = !1),
      (this.fixed = !1),
      (this.forceGroupSelection = !1),
      (this.fullwidth = !1),
      (this.menuCorner = "START"),
      (this.stayOpenOnBodyClick = !1),
      (this.defaultFocus = "LIST_ROOT"),
      (this._listUpdateComplete = null);
  }
  get listElement() {
    return (
      this.listElement_ ||
        (this.listElement_ = this.renderRoot.querySelector("mwc-list")),
      this.listElement_
    );
  }
  get items() {
    const t = this.listElement;
    return t ? t.items : [];
  }
  get index() {
    const t = this.listElement;
    return t ? t.index : -1;
  }
  get selected() {
    const t = this.listElement;
    return t ? t.selected : null;
  }
  render() {
    const t = "menu" === this.innerRole ? "menuitem" : "option";
    return c`
      <mwc-menu-surface
          ?hidden=${!this.open}
          .anchor=${this.anchor}
          .open=${this.open}
          .quick=${this.quick}
          .corner=${this.corner}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          .fullwidth=${this.fullwidth}
          .menuCorner=${this.menuCorner}
          ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
          class="mdc-menu mdc-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}>
        <mwc-list
          rootTabbable
          .innerAriaLabel=${this.innerAriaLabel}
          .innerRole=${this.innerRole}
          .multi=${this.multi}
          class="mdc-deprecated-list"
          .itemRoles=${t}
          .wrapFocus=${this.wrapFocus}
          .activatable=${this.activatable}
          @action=${this.onAction}>
        <slot></slot>
      </mwc-list>
    </mwc-menu-surface>`;
  }
  createAdapter() {
    return {
      addClassToElementAtIndex: (t, e) => {
        const i = this.listElement;
        if (!i) return;
        const s = i.items[t];
        s &&
          ("mdc-menu-item--selected" === e
            ? this.forceGroupSelection && !s.selected && i.toggle(t, !0)
            : s.classList.add(e));
      },
      removeClassFromElementAtIndex: (t, e) => {
        const i = this.listElement;
        if (!i) return;
        const s = i.items[t];
        s &&
          ("mdc-menu-item--selected" === e
            ? s.selected && i.toggle(t, !1)
            : s.classList.remove(e));
      },
      addAttributeToElementAtIndex: (t, e, i) => {
        const s = this.listElement;
        if (!s) return;
        const n = s.items[t];
        n && n.setAttribute(e, i);
      },
      removeAttributeFromElementAtIndex: (t, e) => {
        const i = this.listElement;
        if (!i) return;
        const s = i.items[t];
        s && s.removeAttribute(e);
      },
      getAttributeFromElementAtIndex: (t, e) => {
        const i = this.listElement;
        if (!i) return null;
        const s = i.items[t];
        return s ? s.getAttribute(e) : null;
      },
      elementContainsClass: (t, e) => t.classList.contains(e),
      closeSurface: () => {
        this.open = !1;
      },
      getElementIndex: (t) => {
        const e = this.listElement;
        return e ? e.items.indexOf(t) : -1;
      },
      notifySelected: () => {},
      getMenuItemCount: () => {
        const t = this.listElement;
        return t ? t.items.length : 0;
      },
      focusItemAtIndex: (t) => {
        const e = this.listElement;
        if (!e) return;
        const i = e.items[t];
        i && i.focus();
      },
      focusListRoot: () => {
        this.listElement && this.listElement.focus();
      },
      getSelectedSiblingOfItemAtIndex: (t) => {
        const e = this.listElement;
        if (!e) return -1;
        const i = e.items[t];
        if (!i || !i.group) return -1;
        for (let s = 0; s < e.items.length; s++) {
          if (s === t) continue;
          const n = e.items[s];
          if (n.selected && n.group === i.group) return s;
        }
        return -1;
      },
      isSelectableItemAtIndex: (t) => {
        const e = this.listElement;
        if (!e) return !1;
        const i = e.items[t];
        return !!i && i.hasAttribute("group");
      },
    };
  }
  onKeydown(t) {
    this.mdcFoundation && this.mdcFoundation.handleKeydown(t);
  }
  onAction(t) {
    const e = this.listElement;
    if (this.mdcFoundation && e) {
      const i = t.detail.index,
        s = e.items[i];
      s && this.mdcFoundation.handleItemAction(s);
    }
  }
  onOpened() {
    (this.open = !0),
      this.mdcFoundation && this.mdcFoundation.handleMenuSurfaceOpened();
  }
  onClosed() {
    this.open = !1;
  }
  async getUpdateComplete() {
    await this._listUpdateComplete;
    return await super.getUpdateComplete();
  }
  async firstUpdated() {
    super.firstUpdated();
    const t = this.listElement;
    t &&
      ((this._listUpdateComplete = t.updateComplete),
      await this._listUpdateComplete);
  }
  select(t) {
    const e = this.listElement;
    e && e.select(t);
  }
  close() {
    this.open = !1;
  }
  show() {
    this.open = !0;
  }
  getFocusedItemIndex() {
    const t = this.listElement;
    return t ? t.getFocusedItemIndex() : -1;
  }
  focusItemAtIndex(t) {
    const e = this.listElement;
    e && e.focusItemAtIndex(t);
  }
  layout(t = !0) {
    const e = this.listElement;
    e && e.layout(t);
  }
}
i([s(".mdc-menu")], Pt.prototype, "mdcRoot", void 0),
  i([s("slot")], Pt.prototype, "slotElement", void 0),
  i([o({ type: Object })], Pt.prototype, "anchor", void 0),
  i([o({ type: Boolean, reflect: !0 })], Pt.prototype, "open", void 0),
  i([o({ type: Boolean })], Pt.prototype, "quick", void 0),
  i([o({ type: Boolean })], Pt.prototype, "wrapFocus", void 0),
  i([o({ type: String })], Pt.prototype, "innerRole", void 0),
  i([o({ type: String })], Pt.prototype, "innerAriaLabel", void 0),
  i([o({ type: String })], Pt.prototype, "corner", void 0),
  i([o({ type: Number })], Pt.prototype, "x", void 0),
  i([o({ type: Number })], Pt.prototype, "y", void 0),
  i([o({ type: Boolean })], Pt.prototype, "absolute", void 0),
  i([o({ type: Boolean })], Pt.prototype, "multi", void 0),
  i([o({ type: Boolean })], Pt.prototype, "activatable", void 0),
  i([o({ type: Boolean })], Pt.prototype, "fixed", void 0),
  i([o({ type: Boolean })], Pt.prototype, "forceGroupSelection", void 0),
  i([o({ type: Boolean })], Pt.prototype, "fullwidth", void 0),
  i([o({ type: String })], Pt.prototype, "menuCorner", void 0),
  i([o({ type: Boolean })], Pt.prototype, "stayOpenOnBodyClick", void 0),
  i(
    [
      o({ type: String }),
      R(function (t) {
        this.mdcFoundation && this.mdcFoundation.setDefaultFocusState(Mt[t]);
      }),
    ],
    Pt.prototype,
    "defaultFocus",
    void 0
  );
const Ht = h`mwc-list ::slotted([mwc-list-item]:not([twoline])),mwc-list ::slotted([noninteractive]:not([twoline])){height:var(--mdc-menu-item-height, 48px)}`;
let zt = class extends Pt {};
(zt.styles = [Ht]),
  (zt = i([m("mwc-menu")], zt)),
  T(
    [m("ha-button-menu")],
    function (t, e) {
      class i extends e {
        constructor(...e) {
          super(...e), t(this);
        }
      }
      return {
        F: i,
        d: [
          { kind: "field", key: A, value: void 0 },
          {
            kind: "field",
            decorators: [o()],
            key: "corner",
            value: () => "TOP_START",
          },
          {
            kind: "field",
            decorators: [o()],
            key: "menuCorner",
            value: () => "START",
          },
          {
            kind: "field",
            decorators: [o({ type: Number })],
            key: "x",
            value: () => null,
          },
          {
            kind: "field",
            decorators: [o({ type: Number })],
            key: "y",
            value: () => null,
          },
          {
            kind: "field",
            decorators: [o({ type: Boolean })],
            key: "multi",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [o({ type: Boolean })],
            key: "activatable",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [o({ type: Boolean })],
            key: "disabled",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [o({ type: Boolean })],
            key: "fixed",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [s("mwc-menu", !0)],
            key: "_menu",
            value: void 0,
          },
          {
            kind: "get",
            key: "items",
            value: function () {
              var t;
              return null === (t = this._menu) || void 0 === t
                ? void 0
                : t.items;
            },
          },
          {
            kind: "get",
            key: "selected",
            value: function () {
              var t;
              return null === (t = this._menu) || void 0 === t
                ? void 0
                : t.selected;
            },
          },
          {
            kind: "method",
            key: "focus",
            value: function () {
              var t, e;
              null !== (t = this._menu) && void 0 !== t && t.open
                ? this._menu.focusItemAtIndex(0)
                : null === (e = this._triggerButton) ||
                  void 0 === e ||
                  e.focus();
            },
          },
          {
            kind: "method",
            key: "render",
            value: function () {
              return c`
      <div @click=${this._handleClick}>
        <slot name="trigger" @slotchange=${this._setTriggerAria}></slot>
      </div>
      <mwc-menu
        .corner=${this.corner}
        .menuCorner=${this.menuCorner}
        .fixed=${this.fixed}
        .multi=${this.multi}
        .activatable=${this.activatable}
        .y=${this.y}
        .x=${this.x}
      >
        <slot></slot>
      </mwc-menu>
    `;
            },
          },
          {
            kind: "method",
            key: "firstUpdated",
            value: function (t) {
              O(S(i.prototype), "firstUpdated", this).call(this, t),
                "rtl" === document.dir &&
                  this.updateComplete.then(() => {
                    this.querySelectorAll("mwc-list-item").forEach((t) => {
                      const e = document.createElement("style");
                      (e.innerHTML =
                        "span.material-icons:first-of-type { margin-left: var(--mdc-list-item-graphic-margin, 32px) !important; margin-right: 0px !important;}"),
                        t.shadowRoot.appendChild(e);
                    });
                  });
            },
          },
          {
            kind: "method",
            key: "_handleClick",
            value: function () {
              this.disabled || ((this._menu.anchor = this), this._menu.show());
            },
          },
          {
            kind: "get",
            key: "_triggerButton",
            value: function () {
              return this.querySelector(
                'ha-icon-button[slot="trigger"], mwc-button[slot="trigger"]'
              );
            },
          },
          {
            kind: "method",
            key: "_setTriggerAria",
            value: function () {
              this._triggerButton &&
                (this._triggerButton.ariaHasPopup = "menu");
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return h`
      :host {
        display: inline-block;
        position: relative;
      }
      ::slotted([disabled]) {
        color: var(--disabled-text-color);
      }
    `;
            },
          },
        ],
      };
    },
    a
  );
export {
  It as C,
  B as K,
  N as L,
  et as a,
  F as b,
  w as c,
  ht as n,
  C as o,
  M as s,
};
