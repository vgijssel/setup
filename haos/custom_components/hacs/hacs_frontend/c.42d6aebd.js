import {
  u as e,
  v as t,
  M as i,
  _ as c,
  i as l,
  e as d,
  t as o,
  w as n,
  $ as a,
  o as s,
  j as r,
  x as m,
  y as p,
  k as h,
  r as u,
} from "./main-ad130be7.js";
import { f, l as g } from "./c.3f859915.js";
import { C as b, F as _ } from "./c.9b92f489.js";
import { n as x, a as v, K as y } from "./c.82eccc94.js";
import { o as w } from "./c.8e28b461.js";
var I = ["input", "button", "textarea", "select"],
  E = function (e) {
    var t = e.target;
    if (t) {
      var i = ("" + t.tagName).toLowerCase();
      -1 === I.indexOf(i) && e.preventDefault();
    }
  };
function C(e, t) {
  for (var i = new Map(), c = 0; c < e; c++) {
    var l = t(c).trim();
    if (l) {
      var d = l[0].toLowerCase();
      i.has(d) || i.set(d, []),
        i.get(d).push({ text: l.toLowerCase(), index: c });
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
function A(e, t) {
  var i,
    c = e.nextChar,
    l = e.focusItemAtIndex,
    d = e.sortedIndexByFirstChar,
    o = e.focusedItemIndex,
    n = e.skipFocus,
    a = e.isItemAtIndexDisabled;
  return (
    clearTimeout(t.bufferClearTimeout),
    (t.bufferClearTimeout = setTimeout(function () {
      !(function (e) {
        e.typeaheadBuffer = "";
      })(t);
    }, x.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS)),
    (t.typeaheadBuffer = t.typeaheadBuffer + c),
    (i =
      1 === t.typeaheadBuffer.length
        ? (function (e, t, i, c) {
            var l = c.typeaheadBuffer[0],
              d = e.get(l);
            if (!d) return -1;
            if (
              l === c.currentFirstChar &&
              d[c.sortedIndexCursor].index === t
            ) {
              c.sortedIndexCursor = (c.sortedIndexCursor + 1) % d.length;
              var o = d[c.sortedIndexCursor].index;
              if (!i(o)) return o;
            }
            c.currentFirstChar = l;
            var n,
              a = -1;
            for (n = 0; n < d.length; n++)
              if (!i(d[n].index)) {
                a = n;
                break;
              }
            for (; n < d.length; n++)
              if (d[n].index > t && !i(d[n].index)) {
                a = n;
                break;
              }
            if (-1 !== a)
              return (c.sortedIndexCursor = a), d[c.sortedIndexCursor].index;
            return -1;
          })(d, o, a, t)
        : (function (e, t, i) {
            var c = i.typeaheadBuffer[0],
              l = e.get(c);
            if (!l) return -1;
            var d = l[i.sortedIndexCursor];
            if (0 === d.text.lastIndexOf(i.typeaheadBuffer, 0) && !t(d.index))
              return d.index;
            var o = (i.sortedIndexCursor + 1) % l.length,
              n = -1;
            for (; o !== i.sortedIndexCursor; ) {
              var a = l[o],
                s = 0 === a.text.lastIndexOf(i.typeaheadBuffer, 0),
                r = !t(a.index);
              if (s && r) {
                n = o;
                break;
              }
              o = (o + 1) % l.length;
            }
            if (-1 !== n)
              return (i.sortedIndexCursor = n), l[i.sortedIndexCursor].index;
            return -1;
          })(d, a, t)),
    -1 === i || n || l(i),
    i
  );
}
function k(e) {
  return e.typeaheadBuffer.length > 0;
}
var S = {
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
  T = {
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
  O = { LABEL_SCALE: 0.75, UNSET_INDEX: -1, CLICK_DEBOUNCE_TIMEOUT_MS: 330 },
  R = (function (i) {
    function c(e, l) {
      void 0 === l && (l = {});
      var d = i.call(this, t(t({}, c.defaultAdapter), e)) || this;
      return (
        (d.disabled = !1),
        (d.isMenuOpen = !1),
        (d.useDefaultValidation = !0),
        (d.customValidity = !0),
        (d.lastSelectedIndex = O.UNSET_INDEX),
        (d.clickDebounceTimeout = 0),
        (d.recentlyClicked = !1),
        (d.leadingIcon = l.leadingIcon),
        (d.helperText = l.helperText),
        d
      );
    }
    return (
      e(c, i),
      Object.defineProperty(c, "cssClasses", {
        get: function () {
          return S;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(c, "numbers", {
        get: function () {
          return O;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(c, "strings", {
        get: function () {
          return T;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(c, "defaultAdapter", {
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
      (c.prototype.getSelectedIndex = function () {
        return this.adapter.getSelectedIndex();
      }),
      (c.prototype.setSelectedIndex = function (e, t, i) {
        void 0 === t && (t = !1),
          void 0 === i && (i = !1),
          e >= this.adapter.getMenuItemCount() ||
            (e === O.UNSET_INDEX
              ? this.adapter.setSelectedText("")
              : this.adapter.setSelectedText(
                  this.adapter.getMenuItemTextAtIndex(e).trim()
                ),
            this.adapter.setSelectedIndex(e),
            t && this.adapter.closeMenu(),
            i || this.lastSelectedIndex === e || this.handleChange(),
            (this.lastSelectedIndex = e));
      }),
      (c.prototype.setValue = function (e, t) {
        void 0 === t && (t = !1);
        var i = this.adapter.getMenuItemValues().indexOf(e);
        this.setSelectedIndex(i, !1, t);
      }),
      (c.prototype.getValue = function () {
        var e = this.adapter.getSelectedIndex(),
          t = this.adapter.getMenuItemValues();
        return e !== O.UNSET_INDEX ? t[e] : "";
      }),
      (c.prototype.getDisabled = function () {
        return this.disabled;
      }),
      (c.prototype.setDisabled = function (e) {
        (this.disabled = e),
          this.disabled
            ? (this.adapter.addClass(S.DISABLED), this.adapter.closeMenu())
            : this.adapter.removeClass(S.DISABLED),
          this.leadingIcon && this.leadingIcon.setDisabled(this.disabled),
          this.disabled
            ? this.adapter.removeSelectAnchorAttr("tabindex")
            : this.adapter.setSelectAnchorAttr("tabindex", "0"),
          this.adapter.setSelectAnchorAttr(
            "aria-disabled",
            this.disabled.toString()
          );
      }),
      (c.prototype.openMenu = function () {
        this.adapter.addClass(S.ACTIVATED),
          this.adapter.openMenu(),
          (this.isMenuOpen = !0),
          this.adapter.setSelectAnchorAttr("aria-expanded", "true");
      }),
      (c.prototype.setHelperTextContent = function (e) {
        this.helperText && this.helperText.setContent(e);
      }),
      (c.prototype.layout = function () {
        if (this.adapter.hasLabel()) {
          var e = this.getValue().length > 0,
            t = this.adapter.hasClass(S.FOCUSED),
            i = e || t,
            c = this.adapter.hasClass(S.REQUIRED);
          this.notchOutline(i),
            this.adapter.floatLabel(i),
            this.adapter.setLabelRequired(c);
        }
      }),
      (c.prototype.layoutOptions = function () {
        var e = this.adapter.getMenuItemValues().indexOf(this.getValue());
        this.setSelectedIndex(e, !1, !0);
      }),
      (c.prototype.handleMenuOpened = function () {
        if (0 !== this.adapter.getMenuItemValues().length) {
          var e = this.getSelectedIndex(),
            t = e >= 0 ? e : 0;
          this.adapter.focusMenuItemAtIndex(t);
        }
      }),
      (c.prototype.handleMenuClosing = function () {
        this.adapter.setSelectAnchorAttr("aria-expanded", "false");
      }),
      (c.prototype.handleMenuClosed = function () {
        this.adapter.removeClass(S.ACTIVATED),
          (this.isMenuOpen = !1),
          this.adapter.isSelectAnchorFocused() || this.blur();
      }),
      (c.prototype.handleChange = function () {
        this.layout(),
          this.adapter.notifyChange(this.getValue()),
          this.adapter.hasClass(S.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (c.prototype.handleMenuItemAction = function (e) {
        this.setSelectedIndex(e, !0);
      }),
      (c.prototype.handleFocus = function () {
        this.adapter.addClass(S.FOCUSED),
          this.layout(),
          this.adapter.activateBottomLine();
      }),
      (c.prototype.handleBlur = function () {
        this.isMenuOpen || this.blur();
      }),
      (c.prototype.handleClick = function (e) {
        this.disabled ||
          this.recentlyClicked ||
          (this.setClickDebounceTimeout(),
          this.isMenuOpen
            ? this.adapter.closeMenu()
            : (this.adapter.setRippleCenter(e), this.openMenu()));
      }),
      (c.prototype.handleKeydown = function (e) {
        if (!this.isMenuOpen && this.adapter.hasClass(S.FOCUSED)) {
          var t = v(e) === y.ENTER,
            i = v(e) === y.SPACEBAR,
            c = v(e) === y.ARROW_UP,
            l = v(e) === y.ARROW_DOWN;
          if (
            !(e.ctrlKey || e.metaKey) &&
            ((!i && e.key && 1 === e.key.length) ||
              (i && this.adapter.isTypeaheadInProgress()))
          ) {
            var d = i ? " " : e.key,
              o = this.adapter.typeaheadMatchItem(d, this.getSelectedIndex());
            return o >= 0 && this.setSelectedIndex(o), void e.preventDefault();
          }
          (t || i || c || l) &&
            (c && this.getSelectedIndex() > 0
              ? this.setSelectedIndex(this.getSelectedIndex() - 1)
              : l &&
                this.getSelectedIndex() < this.adapter.getMenuItemCount() - 1 &&
                this.setSelectedIndex(this.getSelectedIndex() + 1),
            this.openMenu(),
            e.preventDefault());
        }
      }),
      (c.prototype.notchOutline = function (e) {
        if (this.adapter.hasOutline()) {
          var t = this.adapter.hasClass(S.FOCUSED);
          if (e) {
            var i = O.LABEL_SCALE,
              c = this.adapter.getLabelWidth() * i;
            this.adapter.notchOutline(c);
          } else t || this.adapter.closeOutline();
        }
      }),
      (c.prototype.setLeadingIconAriaLabel = function (e) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(e);
      }),
      (c.prototype.setLeadingIconContent = function (e) {
        this.leadingIcon && this.leadingIcon.setContent(e);
      }),
      (c.prototype.getUseDefaultValidation = function () {
        return this.useDefaultValidation;
      }),
      (c.prototype.setUseDefaultValidation = function (e) {
        this.useDefaultValidation = e;
      }),
      (c.prototype.setValid = function (e) {
        this.useDefaultValidation || (this.customValidity = e),
          this.adapter.setSelectAnchorAttr("aria-invalid", (!e).toString()),
          e
            ? (this.adapter.removeClass(S.INVALID),
              this.adapter.removeMenuClass(S.MENU_INVALID))
            : (this.adapter.addClass(S.INVALID),
              this.adapter.addMenuClass(S.MENU_INVALID)),
          this.syncHelperTextValidity(e);
      }),
      (c.prototype.isValid = function () {
        return this.useDefaultValidation &&
          this.adapter.hasClass(S.REQUIRED) &&
          !this.adapter.hasClass(S.DISABLED)
          ? this.getSelectedIndex() !== O.UNSET_INDEX &&
              (0 !== this.getSelectedIndex() || Boolean(this.getValue()))
          : this.customValidity;
      }),
      (c.prototype.setRequired = function (e) {
        e
          ? this.adapter.addClass(S.REQUIRED)
          : this.adapter.removeClass(S.REQUIRED),
          this.adapter.setSelectAnchorAttr("aria-required", e.toString()),
          this.adapter.setLabelRequired(e);
      }),
      (c.prototype.getRequired = function () {
        return "true" === this.adapter.getSelectAnchorAttr("aria-required");
      }),
      (c.prototype.init = function () {
        var e = this.adapter.getAnchorElement();
        e &&
          (this.adapter.setMenuAnchorElement(e),
          this.adapter.setMenuAnchorCorner(b.BOTTOM_START)),
          this.adapter.setMenuWrapFocus(!1),
          this.setDisabled(this.adapter.hasClass(S.DISABLED)),
          this.syncHelperTextValidity(!this.adapter.hasClass(S.INVALID)),
          this.layout(),
          this.layoutOptions();
      }),
      (c.prototype.blur = function () {
        this.adapter.removeClass(S.FOCUSED),
          this.layout(),
          this.adapter.deactivateBottomLine(),
          this.adapter.hasClass(S.REQUIRED) &&
            this.useDefaultValidation &&
            this.setValid(this.isValid());
      }),
      (c.prototype.syncHelperTextValidity = function (e) {
        if (this.helperText) {
          this.helperText.setValidity(e);
          var t = this.helperText.isVisible(),
            i = this.helperText.getId();
          t && i
            ? this.adapter.setSelectAnchorAttr(T.ARIA_DESCRIBEDBY, i)
            : this.adapter.removeSelectAnchorAttr(T.ARIA_DESCRIBEDBY);
        }
      }),
      (c.prototype.setClickDebounceTimeout = function () {
        var e = this;
        clearTimeout(this.clickDebounceTimeout),
          (this.clickDebounceTimeout = setTimeout(function () {
            e.recentlyClicked = !1;
          }, O.CLICK_DEBOUNCE_TIMEOUT_MS)),
          (this.recentlyClicked = !0);
      }),
      c
    );
  })(i);
const D = (e = {}) => {
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
class M extends _ {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = R),
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
      (this._validity = D());
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
      c = this.shouldRenderHelperText ? "helper-text" : void 0;
    return a`
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
            aria-labelledby=${r(i)}
            aria-required=${this.required}
            aria-describedby=${r(c)}
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
      ? m
      : a`
      <span class="mdc-select__ripple"></span>
    `;
  }
  renderOutline() {
    return this.outlined
      ? a`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`
      : m;
  }
  renderLabel() {
    return this.label
      ? a`
      <span
          .floatingLabelFoundation=${f(this.label)}
          id="label">${this.label}</span>
    `
      : m;
  }
  renderLeadingIcon() {
    return this.icon
      ? a`<mwc-icon class="mdc-select__icon"><div>${this.icon}</div></mwc-icon>`
      : m;
  }
  renderLineRipple() {
    return this.outlined
      ? m
      : a`
      <span .lineRippleFoundation=${g()}></span>
    `;
  }
  renderHelperText() {
    if (!this.shouldRenderHelperText) return m;
    const e = this.validationMessage && !this.isUiValid;
    return a`
        <p
          class="mdc-select-helper-text ${s({
            "mdc-select-helper-text--validation-msg": e,
          })}"
          id="helper-text">${e ? this.validationMessage : this.helper}</p>`;
  }
  createAdapter() {
    return Object.assign(Object.assign({}, p(this.mdcRoot)), {
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
      isTypeaheadInProgress: () => k(this.typeaheadState),
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
          c = A(i, this.typeaheadState);
        return -1 !== c && this.select(c), c;
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
    let i = D(t);
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
    this.sortedIndexByFirstChar = C(
      this.items.length,
      (e) => this.items[e].text
    );
  }
  onItemsUpdated() {
    this.sortedIndexByFirstChar = C(
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
      const c = i - t.left;
      this.mdcFoundation.handleClick(c);
    }
  }
  onKeydown(e) {
    const t = v(e) === y.ARROW_UP,
      i = v(e) === y.ARROW_DOWN;
    if (i || t) {
      const c = t && this.index > 0,
        l = i && this.index < this.items.length - 1;
      return (
        c ? this.select(this.index - 1) : l && this.select(this.index + 1),
        e.preventDefault(),
        void this.mdcFoundation.openMenu()
      );
    }
    this.mdcFoundation.handleKeydown(e);
  }
  handleTypeahead(e) {
    if (!this.menuElement) return;
    const t = this.menuElement.getFocusedItemIndex(),
      i = h(e.target) ? e.target : null;
    !(function (e, t) {
      var i = e.event,
        c = e.isTargetListItem,
        l = e.focusedItemIndex,
        d = e.focusItemAtIndex,
        o = e.sortedIndexByFirstChar,
        n = e.isItemAtIndexDisabled,
        a = "ArrowLeft" === v(i),
        s = "ArrowUp" === v(i),
        r = "ArrowRight" === v(i),
        m = "ArrowDown" === v(i),
        p = "Home" === v(i),
        h = "End" === v(i),
        u = "Enter" === v(i),
        f = "Spacebar" === v(i);
      i.ctrlKey ||
        i.metaKey ||
        a ||
        s ||
        r ||
        m ||
        p ||
        h ||
        u ||
        (f || 1 !== i.key.length
          ? f &&
            (c && E(i),
            c &&
              k(t) &&
              A(
                {
                  focusItemAtIndex: d,
                  focusedItemIndex: l,
                  nextChar: " ",
                  sortedIndexByFirstChar: o,
                  skipFocus: !1,
                  isItemAtIndexDisabled: n,
                },
                t
              ))
          : (E(i),
            A(
              {
                focusItemAtIndex: d,
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
    const c = !!this.label && !!this.value;
    if ((i.floatingLabelFoundation.float(c), !this.outlined)) return;
    (this.outlineOpen = c), await this.updateComplete;
    const l = i.floatingLabelFoundation.getWidth();
    this.outlineOpen && (this.outlineWidth = l);
  }
  async layoutOptions() {
    this.mdcFoundation && this.mdcFoundation.layoutOptions();
  }
}
c([l(".mdc-select")], M.prototype, "mdcRoot", void 0),
  c([l(".formElement")], M.prototype, "formElement", void 0),
  c([l("slot")], M.prototype, "slotElement", void 0),
  c([l("select")], M.prototype, "nativeSelectElement", void 0),
  c([l("input")], M.prototype, "nativeInputElement", void 0),
  c([l(".mdc-line-ripple")], M.prototype, "lineRippleElement", void 0),
  c([l(".mdc-floating-label")], M.prototype, "labelElement", void 0),
  c([l("mwc-notched-outline")], M.prototype, "outlineElement", void 0),
  c([l(".mdc-menu")], M.prototype, "menuElement", void 0),
  c([l(".mdc-select__anchor")], M.prototype, "anchorElement", void 0),
  c(
    [
      d({ type: Boolean, attribute: "disabled", reflect: !0 }),
      w(function (e) {
        this.mdcFoundation && this.mdcFoundation.setDisabled(e);
      }),
    ],
    M.prototype,
    "disabled",
    void 0
  ),
  c(
    [
      d({ type: Boolean }),
      w(function (e, t) {
        void 0 !== t && this.outlined !== t && this.layout(!1);
      }),
    ],
    M.prototype,
    "outlined",
    void 0
  ),
  c(
    [
      d({ type: String }),
      w(function (e, t) {
        void 0 !== t && this.label !== t && this.layout(!1);
      }),
    ],
    M.prototype,
    "label",
    void 0
  ),
  c([o()], M.prototype, "outlineOpen", void 0),
  c([o()], M.prototype, "outlineWidth", void 0),
  c(
    [
      d({ type: String }),
      w(function (e) {
        if (this.mdcFoundation) {
          const t = null === this.selected && !!e,
            i = this.selected && this.selected.value !== e;
          (t || i) && this.selectByValue(e), this.reportValidity();
        }
      }),
    ],
    M.prototype,
    "value",
    void 0
  ),
  c([d()], M.prototype, "name", void 0),
  c([o()], M.prototype, "selectedText", void 0),
  c([d({ type: String })], M.prototype, "icon", void 0),
  c([o()], M.prototype, "menuOpen", void 0),
  c([d({ type: String })], M.prototype, "helper", void 0),
  c([d({ type: Boolean })], M.prototype, "validateOnInitialRender", void 0),
  c([d({ type: String })], M.prototype, "validationMessage", void 0),
  c([d({ type: Boolean })], M.prototype, "required", void 0),
  c([d({ type: Boolean })], M.prototype, "naturalMenuWidth", void 0),
  c([o()], M.prototype, "isUiValid", void 0),
  c([d({ type: Boolean })], M.prototype, "fixedMenuPosition", void 0),
  c([n({ capture: !0 })], M.prototype, "handleTypeahead", null);
const L = u`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-select{display:inline-flex;position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87)}.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-select.mdc-select--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#6200ee;fill:var(--mdc-theme-primary, #6200ee)}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled)+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:rgba(0, 0, 0, 0.54)}.mdc-select.mdc-select--disabled .mdc-select__icon{color:rgba(0, 0, 0, 0.38)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:red}.mdc-select.mdc-select--disabled .mdc-floating-label{color:GrayText}.mdc-select.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}.mdc-select.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select.mdc-select--disabled .mdc-notched-outline__trailing{border-color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__icon{color:GrayText}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:GrayText}}.mdc-select .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-select .mdc-select__anchor{padding-left:16px;padding-right:0}[dir=rtl] .mdc-select .mdc-select__anchor,.mdc-select .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:16px}.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor{padding-left:0;padding-right:0}[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-select__anchor,.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:0}.mdc-select .mdc-select__icon{width:24px;height:24px;font-size:24px}.mdc-select .mdc-select__dropdown-icon{width:24px;height:24px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item,.mdc-select .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:12px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic,.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:12px;margin-right:0}.mdc-select__dropdown-icon{margin-left:12px;margin-right:12px;display:inline-flex;position:relative;align-self:center;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active,.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{position:absolute;top:0;left:0}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-graphic{width:41.6666666667%;height:20.8333333333%}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:1;transition:opacity 75ms linear 75ms}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:0;transition:opacity 75ms linear}[dir=rtl] .mdc-select__dropdown-icon,.mdc-select__dropdown-icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:0;transition:opacity 49.5ms linear}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:1;transition:opacity 100.5ms linear 49.5ms}.mdc-select__anchor{width:200px;min-width:0;flex:1 1 auto;position:relative;box-sizing:border-box;overflow:hidden;outline:none;cursor:pointer}.mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-select__selected-text-container{display:flex;appearance:none;pointer-events:none;box-sizing:border-box;width:auto;min-width:0;flex-grow:1;height:28px;border:none;outline:none;padding:0;background-color:transparent;color:inherit}.mdc-select__selected-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;width:100%;text-align:left}[dir=rtl] .mdc-select__selected-text,.mdc-select__selected-text[dir=rtl]{text-align:right}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid+.mdc-select-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--disabled{cursor:default;pointer-events:none}.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item{padding-left:12px;padding-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item,.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:12px;padding-right:12px}.mdc-select__menu .mdc-deprecated-list .mdc-select__icon,.mdc-select__menu .mdc-list .mdc-select__icon{margin-left:0;margin-right:0}[dir=rtl] .mdc-select__menu .mdc-deprecated-list .mdc-select__icon,[dir=rtl] .mdc-select__menu .mdc-list .mdc-select__icon,.mdc-select__menu .mdc-deprecated-list .mdc-select__icon[dir=rtl],.mdc-select__menu .mdc-list .mdc-select__icon[dir=rtl]{margin-left:0;margin-right:0}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-list-item__start{display:inline-flex;align-items:center}.mdc-select__option{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select__option,.mdc-select__option[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select__one-line-option.mdc-list-item--with-one-line{height:48px}.mdc-select__two-line-option.mdc-list-item--with-two-lines{height:64px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__start{margin-top:20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text{display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before{display:inline-block;width:0;height:28px;content:"";vertical-align:0}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end{display:block;margin-top:0;line-height:normal}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before{display:inline-block;width:0;height:36px;content:"";vertical-align:0}.mdc-select__option-with-leading-content{padding-left:0;padding-right:12px}.mdc-select__option-with-leading-content.mdc-list-item{padding-left:0;padding-right:auto}[dir=rtl] .mdc-select__option-with-leading-content.mdc-list-item,.mdc-select__option-with-leading-content.mdc-list-item[dir=rtl]{padding-left:auto;padding-right:0}.mdc-select__option-with-leading-content .mdc-list-item__start{margin-left:12px;margin-right:0}[dir=rtl] .mdc-select__option-with-leading-content .mdc-list-item__start,.mdc-select__option-with-leading-content .mdc-list-item__start[dir=rtl]{margin-left:0;margin-right:12px}.mdc-select__option-with-leading-content .mdc-list-item__start{width:36px;height:24px}[dir=rtl] .mdc-select__option-with-leading-content,.mdc-select__option-with-leading-content[dir=rtl]{padding-left:12px;padding-right:0}.mdc-select__option-with-meta.mdc-list-item{padding-left:auto;padding-right:0}[dir=rtl] .mdc-select__option-with-meta.mdc-list-item,.mdc-select__option-with-meta.mdc-list-item[dir=rtl]{padding-left:0;padding-right:auto}.mdc-select__option-with-meta .mdc-list-item__end{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select__option-with-meta .mdc-list-item__end,.mdc-select__option-with-meta .mdc-list-item__end[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--filled .mdc-select__anchor{height:56px;display:flex;align-items:baseline}.mdc-select--filled .mdc-select__anchor::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor::before{display:none}.mdc-select--filled .mdc-select__anchor{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-select--filled:not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke}.mdc-select--filled.mdc-select--disabled .mdc-select__anchor{background-color:#fafafa}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-select--filled:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--filled.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-select--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-select--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-select--filled .mdc-menu-surface--is-open-below{border-top-left-radius:0px;border-top-right-radius:0px}.mdc-select--filled.mdc-select--focused.mdc-line-ripple::after{transform:scale(1, 2);opacity:1}.mdc-select--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-select--filled .mdc-floating-label,.mdc-select--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{left:48px;right:initial}[dir=rtl] .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined{border:none}.mdc-select--outlined .mdc-select__anchor{height:56px}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-56px{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-select--outlined .mdc-select__anchor{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-select--outlined+.mdc-select-helper-text{margin-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-select__anchor{background-color:transparent}.mdc-select--outlined.mdc-select--disabled .mdc-select__anchor{background-color:transparent}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}.mdc-select--outlined .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-select--outlined .mdc-select__anchor{display:flex;align-items:baseline;overflow:visible}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined 250ms 1}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--outlined .mdc-select__anchor::before{display:none}.mdc-select--outlined .mdc-select__selected-text-container{display:flex;border:none;z-index:1;background-color:transparent}.mdc-select--outlined .mdc-select__icon{z-index:2}.mdc-select--outlined .mdc-floating-label{line-height:1.15rem;left:4px;right:initial}[dir=rtl] .mdc-select--outlined .mdc-floating-label,.mdc-select--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-select--outlined.mdc-select--focused .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake,.mdc-select--outlined.mdc-select--with-leading-icon[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 96px)}.mdc-select--outlined .mdc-menu-surface{margin-bottom:8px}.mdc-select--outlined.mdc-select--no-label .mdc-menu-surface,.mdc-select--outlined .mdc-menu-surface--is-open-below{margin-bottom:0}.mdc-select__anchor{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-select__anchor .mdc-select__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-select__anchor .mdc-select__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-select__anchor.mdc-ripple-upgraded--unbounded .mdc-select__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-select__anchor.mdc-ripple-upgraded--foreground-activation .mdc-select__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-select__anchor.mdc-ripple-upgraded--foreground-deactivation .mdc-select__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-select__anchor:hover .mdc-select__ripple::before,.mdc-select__anchor.mdc-ripple-surface--hover .mdc-select__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__anchor.mdc-ripple-upgraded--background-focused .mdc-select__ripple::before,.mdc-select__anchor:not(.mdc-ripple-upgraded):focus .mdc-select__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__anchor .mdc-select__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-deprecated-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-deprecated-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-deprecated-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-deprecated-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select-helper-text{margin:0;margin-left:16px;margin-right:16px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal}[dir=rtl] .mdc-select-helper-text,.mdc-select-helper-text[dir=rtl]{margin-left:16px;margin-right:16px}.mdc-select-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-select-helper-text--validation-msg{opacity:0;transition:opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-select--invalid+.mdc-select-helper-text--validation-msg,.mdc-select-helper-text--validation-msg-persistent{opacity:1}.mdc-select--with-leading-icon .mdc-select__icon{display:inline-block;box-sizing:border-box;border:none;text-decoration:none;cursor:pointer;user-select:none;flex-shrink:0;align-self:center;background-color:transparent;fill:currentColor}.mdc-select--with-leading-icon .mdc-select__icon{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon,.mdc-select--with-leading-icon .mdc-select__icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex="-1"]{cursor:default;pointer-events:none}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-block;vertical-align:top;outline:none}.mdc-select{width:100%}[hidden]{display:none}.mdc-select__icon{z-index:2}.mdc-select--with-leading-icon{--mdc-list-item-graphic-margin: calc( 48px - var(--mdc-list-item-graphic-size, 24px) - var(--mdc-list-side-padding, 16px) )}.mdc-select .mdc-select__anchor .mdc-select__selected-text{overflow:hidden}.mdc-select .mdc-select__anchor *{display:inline-flex}.mdc-select .mdc-select__anchor .mdc-floating-label{display:inline-block}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-idle-border-color, rgba(0, 0, 0, 0.38) );--mdc-notched-outline-notch-offset: 1px}:host(:not([disabled]):hover) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87);color:var(--mdc-select-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-select-idle-line-color, rgba(0, 0, 0, 0.42))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-select-hover-line-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--outlined):not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke;background-color:var(--mdc-select-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-select__dropdown-icon{fill:var(--mdc-select-error-dropdown-icon-color, var(--mdc-select-error-color, var(--mdc-theme-error, #b00020)))}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label,:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label::after{color:var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select.mdc-select--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}.mdc-select__menu--invalid{--mdc-theme-primary: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.6);color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54);fill:var(--mdc-select-dropdown-icon-color, rgba(0, 0, 0, 0.54))}:host(:not([disabled])) .mdc-select.mdc-select--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px;--mdc-notched-outline-notch-offset: 2px}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-select__dropdown-icon{fill:rgba(98,0,238,.87);fill:var(--mdc-select-focused-dropdown-icon-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)))}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label::after{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg){color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-select:not(.mdc-select--outlined).mdc-select--disabled .mdc-select__anchor{background-color:#fafafa;background-color:var(--mdc-select-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-select.mdc-select--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-select .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38);fill:var(--mdc-select-disabled-dropdown-icon-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select-helper-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}`,
  F = (e) => e.stopPropagation();
export { M as S, F as a, L as s };
