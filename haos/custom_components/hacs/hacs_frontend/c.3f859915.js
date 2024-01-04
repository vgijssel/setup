import {
  u as t,
  v as e,
  M as i,
  _ as d,
  i as l,
  e as n,
  B as a,
  o,
  $ as r,
  r as c,
  n as s,
  Q as f,
  S as m,
  T as p,
  G as h,
  U as x,
  V as u,
  x as g,
  t as b,
  w as v,
  j as _,
  y,
  a as w,
  L as E,
  N as I,
} from "./main-ad130be7.js";
import { F as L } from "./c.9b92f489.js";
import { o as C } from "./c.8e28b461.js";
var A = { NOTCH_ELEMENT_SELECTOR: ".mdc-notched-outline__notch" },
  T = { NOTCH_ELEMENT_PADDING: 8 },
  O = {
    NO_LABEL: "mdc-notched-outline--no-label",
    OUTLINE_NOTCHED: "mdc-notched-outline--notched",
    OUTLINE_UPGRADED: "mdc-notched-outline--upgraded",
  },
  k = (function (i) {
    function d(t) {
      return i.call(this, e(e({}, d.defaultAdapter), t)) || this;
    }
    return (
      t(d, i),
      Object.defineProperty(d, "strings", {
        get: function () {
          return A;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return O;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "numbers", {
        get: function () {
          return T;
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
      (d.prototype.notch = function (t) {
        var e = d.cssClasses.OUTLINE_NOTCHED;
        t > 0 && (t += T.NOTCH_ELEMENT_PADDING),
          this.adapter.setNotchWidthProperty(t),
          this.adapter.addClass(e);
      }),
      (d.prototype.closeNotch = function () {
        var t = d.cssClasses.OUTLINE_NOTCHED;
        this.adapter.removeClass(t), this.adapter.removeNotchWidthProperty();
      }),
      d
    );
  })(i);
class R extends a {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = k),
      (this.width = 0),
      (this.open = !1),
      (this.lastOpen = this.open);
  }
  createAdapter() {
    return {
      addClass: (t) => this.mdcRoot.classList.add(t),
      removeClass: (t) => this.mdcRoot.classList.remove(t),
      setNotchWidthProperty: (t) =>
        this.notchElement.style.setProperty("width", `${t}px`),
      removeNotchWidthProperty: () =>
        this.notchElement.style.removeProperty("width"),
    };
  }
  openOrClose(t, e) {
    this.mdcFoundation &&
      (t && void 0 !== e
        ? this.mdcFoundation.notch(e)
        : this.mdcFoundation.closeNotch());
  }
  render() {
    this.openOrClose(this.open, this.width);
    const t = o({ "mdc-notched-outline--notched": this.open });
    return r`
      <span class="mdc-notched-outline ${t}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
  }
}
d([l(".mdc-notched-outline")], R.prototype, "mdcRoot", void 0),
  d([n({ type: Number })], R.prototype, "width", void 0),
  d([n({ type: Boolean, reflect: !0 })], R.prototype, "open", void 0),
  d([l(".mdc-notched-outline__notch")], R.prototype, "notchElement", void 0);
const z = c`.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] :host,:host([dir=rtl]){text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / 0.75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading,.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color, var(--mdc-theme-primary, #6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width, 1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset, 0)}`;
let F = class extends R {};
(F.styles = [z]), (F = d([s("mwc-notched-outline")], F));
var V = {
    LABEL_FLOAT_ABOVE: "mdc-floating-label--float-above",
    LABEL_REQUIRED: "mdc-floating-label--required",
    LABEL_SHAKE: "mdc-floating-label--shake",
    ROOT: "mdc-floating-label",
  },
  N = (function (i) {
    function d(t) {
      var l = i.call(this, e(e({}, d.defaultAdapter), t)) || this;
      return (
        (l.shakeAnimationEndHandler = function () {
          l.handleShakeAnimationEnd();
        }),
        l
      );
    }
    return (
      t(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return V;
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
      (d.prototype.shake = function (t) {
        var e = d.cssClasses.LABEL_SHAKE;
        t ? this.adapter.addClass(e) : this.adapter.removeClass(e);
      }),
      (d.prototype.float = function (t) {
        var e = d.cssClasses,
          i = e.LABEL_FLOAT_ABOVE,
          l = e.LABEL_SHAKE;
        t
          ? this.adapter.addClass(i)
          : (this.adapter.removeClass(i), this.adapter.removeClass(l));
      }),
      (d.prototype.setRequired = function (t) {
        var e = d.cssClasses.LABEL_REQUIRED;
        t ? this.adapter.addClass(e) : this.adapter.removeClass(e);
      }),
      (d.prototype.handleShakeAnimationEnd = function () {
        var t = d.cssClasses.LABEL_SHAKE;
        this.adapter.removeClass(t);
      }),
      d
    );
  })(i);
const H = f(
  class extends m {
    constructor(t) {
      switch (
        (super(t), (this.foundation = null), (this.previousPart = null), t.type)
      ) {
        case p.ATTRIBUTE:
        case p.PROPERTY:
          break;
        default:
          throw new Error(
            "FloatingLabel directive only support attribute and property parts"
          );
      }
    }
    update(t, [e]) {
      if (t !== this.previousPart) {
        this.foundation && this.foundation.destroy(), (this.previousPart = t);
        const e = t.element;
        e.classList.add("mdc-floating-label");
        const i = ((t) => ({
          addClass: (e) => t.classList.add(e),
          removeClass: (e) => t.classList.remove(e),
          getWidth: () => t.scrollWidth,
          registerInteractionHandler: (e, i) => {
            t.addEventListener(e, i);
          },
          deregisterInteractionHandler: (e, i) => {
            t.removeEventListener(e, i);
          },
        }))(e);
        (this.foundation = new N(i)), this.foundation.init();
      }
      return this.render(e);
    }
    render(t) {
      return this.foundation;
    }
  }
);
var $ = {
    LINE_RIPPLE_ACTIVE: "mdc-line-ripple--active",
    LINE_RIPPLE_DEACTIVATING: "mdc-line-ripple--deactivating",
  },
  P = (function (i) {
    function d(t) {
      var l = i.call(this, e(e({}, d.defaultAdapter), t)) || this;
      return (
        (l.transitionEndHandler = function (t) {
          l.handleTransitionEnd(t);
        }),
        l
      );
    }
    return (
      t(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return $;
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
        this.adapter.removeClass($.LINE_RIPPLE_DEACTIVATING),
          this.adapter.addClass($.LINE_RIPPLE_ACTIVE);
      }),
      (d.prototype.setRippleCenter = function (t) {
        this.adapter.setStyle("transform-origin", t + "px center");
      }),
      (d.prototype.deactivate = function () {
        this.adapter.addClass($.LINE_RIPPLE_DEACTIVATING);
      }),
      (d.prototype.handleTransitionEnd = function (t) {
        var e = this.adapter.hasClass($.LINE_RIPPLE_DEACTIVATING);
        "opacity" === t.propertyName &&
          e &&
          (this.adapter.removeClass($.LINE_RIPPLE_ACTIVE),
          this.adapter.removeClass($.LINE_RIPPLE_DEACTIVATING));
      }),
      d
    );
  })(i);
const S = f(
  class extends m {
    constructor(t) {
      switch (
        (super(t), (this.previousPart = null), (this.foundation = null), t.type)
      ) {
        case p.ATTRIBUTE:
        case p.PROPERTY:
          return;
        default:
          throw new Error(
            "LineRipple only support attribute and property parts."
          );
      }
    }
    update(t, e) {
      if (this.previousPart !== t) {
        this.foundation && this.foundation.destroy(), (this.previousPart = t);
        const e = t.element;
        e.classList.add("mdc-line-ripple");
        const i = ((t) => ({
          addClass: (e) => t.classList.add(e),
          removeClass: (e) => t.classList.remove(e),
          hasClass: (e) => t.classList.contains(e),
          setStyle: (e, i) => t.style.setProperty(e, i),
          registerEventHandler: (e, i) => {
            t.addEventListener(e, i);
          },
          deregisterEventHandler: (e, i) => {
            t.removeEventListener(e, i);
          },
        }))(e);
        (this.foundation = new P(i)), this.foundation.init();
      }
      return this.render();
    }
    render() {
      return this.foundation;
    }
  }
);
var B = {
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
  Y = {
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
  D = { LABEL_SCALE: 0.75 },
  X = ["pattern", "min", "max", "required", "step", "minlength", "maxlength"],
  U = ["color", "date", "datetime-local", "month", "range", "time", "week"],
  M = ["mousedown", "touchstart"],
  j = ["click", "keydown"],
  W = (function (i) {
    function d(t, l) {
      void 0 === l && (l = {});
      var n = i.call(this, e(e({}, d.defaultAdapter), t)) || this;
      return (
        (n.isFocused = !1),
        (n.receivedUserInput = !1),
        (n.valid = !0),
        (n.useNativeValidation = !0),
        (n.validateOnValueChange = !0),
        (n.helperText = l.helperText),
        (n.characterCounter = l.characterCounter),
        (n.leadingIcon = l.leadingIcon),
        (n.trailingIcon = l.trailingIcon),
        (n.inputFocusHandler = function () {
          n.activateFocus();
        }),
        (n.inputBlurHandler = function () {
          n.deactivateFocus();
        }),
        (n.inputInputHandler = function () {
          n.handleInput();
        }),
        (n.setPointerXOffset = function (t) {
          n.setTransformOrigin(t);
        }),
        (n.textFieldInteractionHandler = function () {
          n.handleTextFieldInteraction();
        }),
        (n.validationAttributeChangeHandler = function (t) {
          n.handleValidationAttributeChange(t);
        }),
        n
      );
    }
    return (
      t(d, i),
      Object.defineProperty(d, "cssClasses", {
        get: function () {
          return Y;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "strings", {
        get: function () {
          return B;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d, "numbers", {
        get: function () {
          return D;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(d.prototype, "shouldAlwaysFloat", {
        get: function () {
          var t = this.getNativeInput().type;
          return U.indexOf(t) >= 0;
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
        var t, e, i, d;
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
          for (var l = h(M), n = l.next(); !n.done; n = l.next()) {
            var a = n.value;
            this.adapter.registerInputInteractionHandler(
              a,
              this.setPointerXOffset
            );
          }
        } catch (e) {
          t = { error: e };
        } finally {
          try {
            n && !n.done && (e = l.return) && e.call(l);
          } finally {
            if (t) throw t.error;
          }
        }
        try {
          for (var o = h(j), r = o.next(); !r.done; r = o.next()) {
            a = r.value;
            this.adapter.registerTextFieldInteractionHandler(
              a,
              this.textFieldInteractionHandler
            );
          }
        } catch (t) {
          i = { error: t };
        } finally {
          try {
            r && !r.done && (d = o.return) && d.call(o);
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
        var t, e, i, d;
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
          for (var l = h(M), n = l.next(); !n.done; n = l.next()) {
            var a = n.value;
            this.adapter.deregisterInputInteractionHandler(
              a,
              this.setPointerXOffset
            );
          }
        } catch (e) {
          t = { error: e };
        } finally {
          try {
            n && !n.done && (e = l.return) && e.call(l);
          } finally {
            if (t) throw t.error;
          }
        }
        try {
          for (var o = h(j), r = o.next(); !r.done; r = o.next()) {
            a = r.value;
            this.adapter.deregisterTextFieldInteractionHandler(
              a,
              this.textFieldInteractionHandler
            );
          }
        } catch (t) {
          i = { error: t };
        } finally {
          try {
            r && !r.done && (d = o.return) && d.call(o);
          } finally {
            if (i) throw i.error;
          }
        }
        this.adapter.deregisterValidationAttributeChangeHandler(
          this.validationObserver
        );
      }),
      (d.prototype.handleTextFieldInteraction = function () {
        var t = this.adapter.getNativeInput();
        (t && t.disabled) || (this.receivedUserInput = !0);
      }),
      (d.prototype.handleValidationAttributeChange = function (t) {
        var e = this;
        t.some(function (t) {
          return (
            X.indexOf(t) > -1 &&
            (e.styleValidity(!0),
            e.adapter.setLabelRequired(e.getNativeInput().required),
            !0)
          );
        }),
          t.indexOf("maxlength") > -1 &&
            this.setcharacterCounter(this.getValue().length);
      }),
      (d.prototype.notchOutline = function (t) {
        if (this.adapter.hasOutline() && this.adapter.hasLabel())
          if (t) {
            var e = this.adapter.getLabelWidth() * D.LABEL_SCALE;
            this.adapter.notchOutline(e);
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
      (d.prototype.setTransformOrigin = function (t) {
        if (!this.isDisabled() && !this.adapter.hasOutline()) {
          var e = t.touches,
            i = e ? e[0] : t,
            d = i.target.getBoundingClientRect(),
            l = i.clientX - d.left;
          this.adapter.setLineRippleTransformOrigin(l);
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
        var t = this.isValid();
        this.styleValidity(t),
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
      (d.prototype.setValue = function (t) {
        if (
          (this.getValue() !== t && (this.getNativeInput().value = t),
          this.setcharacterCounter(t.length),
          this.validateOnValueChange)
        ) {
          var e = this.isValid();
          this.styleValidity(e);
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
      (d.prototype.setValid = function (t) {
        (this.valid = t), this.styleValidity(t);
        var e = !t && !this.isFocused && !!this.getValue();
        this.adapter.hasLabel() && this.adapter.shakeLabel(e);
      }),
      (d.prototype.setValidateOnValueChange = function (t) {
        this.validateOnValueChange = t;
      }),
      (d.prototype.getValidateOnValueChange = function () {
        return this.validateOnValueChange;
      }),
      (d.prototype.setUseNativeValidation = function (t) {
        this.useNativeValidation = t;
      }),
      (d.prototype.isDisabled = function () {
        return this.getNativeInput().disabled;
      }),
      (d.prototype.setDisabled = function (t) {
        (this.getNativeInput().disabled = t), this.styleDisabled(t);
      }),
      (d.prototype.setHelperTextContent = function (t) {
        this.helperText && this.helperText.setContent(t);
      }),
      (d.prototype.setLeadingIconAriaLabel = function (t) {
        this.leadingIcon && this.leadingIcon.setAriaLabel(t);
      }),
      (d.prototype.setLeadingIconContent = function (t) {
        this.leadingIcon && this.leadingIcon.setContent(t);
      }),
      (d.prototype.setTrailingIconAriaLabel = function (t) {
        this.trailingIcon && this.trailingIcon.setAriaLabel(t);
      }),
      (d.prototype.setTrailingIconContent = function (t) {
        this.trailingIcon && this.trailingIcon.setContent(t);
      }),
      (d.prototype.setcharacterCounter = function (t) {
        if (this.characterCounter) {
          var e = this.getNativeInput().maxLength;
          if (-1 === e)
            throw new Error(
              "MDCTextFieldFoundation: Expected maxlength html property on text input or textarea."
            );
          this.characterCounter.setCounterValue(t, e);
        }
      }),
      (d.prototype.isBadInput = function () {
        return this.getNativeInput().validity.badInput || !1;
      }),
      (d.prototype.isNativeInputValid = function () {
        return this.getNativeInput().validity.valid;
      }),
      (d.prototype.styleValidity = function (t) {
        var e = d.cssClasses.INVALID;
        if (
          (t ? this.adapter.removeClass(e) : this.adapter.addClass(e),
          this.helperText)
        ) {
          if ((this.helperText.setValidity(t), !this.helperText.isValidation()))
            return;
          var i = this.helperText.isVisible(),
            l = this.helperText.getId();
          i && l
            ? this.adapter.setInputAttr(B.ARIA_DESCRIBEDBY, l)
            : this.adapter.removeInputAttr(B.ARIA_DESCRIBEDBY);
        }
      }),
      (d.prototype.styleFocused = function (t) {
        var e = d.cssClasses.FOCUSED;
        t ? this.adapter.addClass(e) : this.adapter.removeClass(e);
      }),
      (d.prototype.styleDisabled = function (t) {
        var e = d.cssClasses,
          i = e.DISABLED,
          l = e.INVALID;
        t
          ? (this.adapter.addClass(i), this.adapter.removeClass(l))
          : this.adapter.removeClass(i),
          this.leadingIcon && this.leadingIcon.setDisabled(t),
          this.trailingIcon && this.trailingIcon.setDisabled(t);
      }),
      (d.prototype.styleFloating = function (t) {
        var e = d.cssClasses.LABEL_FLOATING;
        t ? this.adapter.addClass(e) : this.adapter.removeClass(e);
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
  })(i);
const { H: G } = x,
  q = (t) => null === t || ("object" != typeof t && "function" != typeof t),
  K = (t, e) => {
    var i, d;
    return void 0 === e
      ? void 0 !== (null === (i = t) || void 0 === i ? void 0 : i._$litType$)
      : (null === (d = t) || void 0 === d ? void 0 : d._$litType$) === e;
  },
  Q = (t) => void 0 === t.strings,
  J = () => document.createComment(""),
  Z = (t, e, i) => {
    var d;
    const l = t._$AA.parentNode,
      n = void 0 === e ? t._$AB : e._$AA;
    if (void 0 === i) {
      const e = l.insertBefore(J(), n),
        d = l.insertBefore(J(), n);
      i = new G(e, d, t, t.options);
    } else {
      const e = i._$AB.nextSibling,
        a = i._$AM,
        o = a !== t;
      if (o) {
        let e;
        null === (d = i._$AQ) || void 0 === d || d.call(i, t),
          (i._$AM = t),
          void 0 !== i._$AP && (e = t._$AU) !== a._$AU && i._$AP(e);
      }
      if (e !== n || o) {
        let t = i._$AA;
        for (; t !== e; ) {
          const e = t.nextSibling;
          l.insertBefore(t, n), (t = e);
        }
      }
    }
    return i;
  },
  tt = (t, e, i = t) => (t._$AI(e, i), t),
  et = {},
  it = (t, e = et) => (t._$AH = e),
  dt = (t) => t._$AH,
  lt = (t) => {
    var e;
    null === (e = t._$AP) || void 0 === e || e.call(t, !1, !0);
    let i = t._$AA;
    const d = t._$AB.nextSibling;
    for (; i !== d; ) {
      const t = i.nextSibling;
      i.remove(), (i = t);
    }
  },
  nt = (t) => {
    t._$AR();
  },
  at = f(
    class extends m {
      constructor(t) {
        if (
          (super(t),
          t.type !== p.PROPERTY &&
            t.type !== p.ATTRIBUTE &&
            t.type !== p.BOOLEAN_ATTRIBUTE)
        )
          throw Error(
            "The `live` directive is not allowed on child or event bindings"
          );
        if (!Q(t))
          throw Error("`live` bindings can only contain a single expression");
      }
      render(t) {
        return t;
      }
      update(t, [e]) {
        if (e === u || e === g) return e;
        const i = t.element,
          d = t.name;
        if (t.type === p.PROPERTY) {
          if (e === i[d]) return u;
        } else if (t.type === p.BOOLEAN_ATTRIBUTE) {
          if (!!e === i.hasAttribute(d)) return u;
        } else if (t.type === p.ATTRIBUTE && i.getAttribute(d) === e + "")
          return u;
        return it(t), e;
      }
    }
  ),
  ot = ["touchstart", "touchmove", "scroll", "mousewheel"],
  rt = (t = {}) => {
    const e = {};
    for (const i in t) e[i] = t[i];
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
      e
    );
  };
class ct extends L {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = W),
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
      (this._validity = rt()),
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
    const t = new CustomEvent("focus");
    this.formElement.dispatchEvent(t), this.formElement.focus();
  }
  blur() {
    const t = new CustomEvent("blur");
    this.formElement.dispatchEvent(t), this.formElement.blur();
  }
  select() {
    this.formElement.select();
  }
  setSelectionRange(t, e, i) {
    this.formElement.setSelectionRange(t, e, i);
  }
  update(t) {
    t.has("autoValidate") &&
      this.mdcFoundation &&
      this.mdcFoundation.setValidateOnValueChange(this.autoValidate),
      t.has("value") &&
        "string" != typeof this.value &&
        (this.value = `${this.value}`),
      super.update(t);
  }
  setFormData(t) {
    this.name && t.append(this.name, this.value);
  }
  render() {
    const t = this.charCounter && -1 !== this.maxLength,
      e = !!this.helper || !!this.validationMessage || t,
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
      <label class="mdc-text-field ${o(i)}">
        ${this.renderRipple()}
        ${this.outlined ? this.renderOutline() : this.renderLabel()}
        ${this.renderLeadingIcon()}
        ${this.renderPrefix()}
        ${this.renderInput(e)}
        ${this.renderSuffix()}
        ${this.renderTrailingIcon()}
        ${this.renderLineRipple()}
      </label>
      ${this.renderHelperText(e, t)}
    `;
  }
  updated(t) {
    t.has("value") &&
      void 0 !== t.get("value") &&
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
          .floatingLabelFoundation=${H(this.label)}
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
  renderIcon(t, e = !1) {
    return r`<i class="material-icons mdc-text-field__icon ${o({
      "mdc-text-field__icon--leading": !e,
      "mdc-text-field__icon--trailing": e,
    })}">${t}</i>`;
  }
  renderPrefix() {
    return this.prefix ? this.renderAffix(this.prefix) : "";
  }
  renderSuffix() {
    return this.suffix ? this.renderAffix(this.suffix, !0) : "";
  }
  renderAffix(t, e = !1) {
    return r`<span class="mdc-text-field__affix ${o({
      "mdc-text-field__affix--prefix": !e,
      "mdc-text-field__affix--suffix": e,
    })}">
        ${t}</span>`;
  }
  renderInput(t) {
    const e = -1 === this.minLength ? void 0 : this.minLength,
      i = -1 === this.maxLength ? void 0 : this.maxLength,
      d = this.autocapitalize ? this.autocapitalize : void 0,
      l = this.validationMessage && !this.isUiValid,
      n = this.label ? "label" : void 0,
      a = t ? "helper-text" : void 0,
      o = this.focused || this.helperPersistent || l ? "helper-text" : void 0;
    return r`
      <input
          aria-labelledby=${_(n)}
          aria-controls="${_(a)}"
          aria-describedby="${_(o)}"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${at(this.value)}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${_(e)}"
          maxlength="${_(i)}"
          pattern="${_(this.pattern ? this.pattern : void 0)}"
          min="${_("" === this.min ? void 0 : this.min)}"
          max="${_("" === this.max ? void 0 : this.max)}"
          step="${_(null === this.step ? void 0 : this.step)}"
          size="${_(null === this.size ? void 0 : this.size)}"
          name="${_("" === this.name ? void 0 : this.name)}"
          inputmode="${_(this.inputMode)}"
          autocapitalize="${_(d)}"
          @input="${this.handleInputChange}"
          @focus="${this.onInputFocus}"
          @blur="${this.onInputBlur}">`;
  }
  renderLineRipple() {
    return this.outlined
      ? ""
      : r`
      <span .lineRippleFoundation=${S()}></span>
    `;
  }
  renderHelperText(t, e) {
    const i = this.validationMessage && !this.isUiValid,
      d = {
        "mdc-text-field-helper-text--persistent": this.helperPersistent,
        "mdc-text-field-helper-text--validation-msg": i,
      },
      l = this.focused || this.helperPersistent || i ? void 0 : "true",
      n = i ? this.validationMessage : this.helper;
    return t
      ? r`
      <div class="mdc-text-field-helper-line">
        <div id="helper-text"
             aria-hidden="${_(l)}"
             class="mdc-text-field-helper-text ${o(d)}"
             >${n}</div>
        ${this.renderCharCounter(e)}
      </div>`
      : "";
  }
  renderCharCounter(t) {
    const e = Math.min(this.value.length, this.maxLength);
    return t
      ? r`
      <span class="mdc-text-field-character-counter"
            >${e} / ${this.maxLength}</span>`
      : "";
  }
  onInputFocus() {
    this.focused = !0;
  }
  onInputBlur() {
    (this.focused = !1), this.reportValidity();
  }
  checkValidity() {
    const t = this._checkValidity(this.value);
    if (!t) {
      const t = new Event("invalid", { bubbles: !1, cancelable: !0 });
      this.dispatchEvent(t);
    }
    return t;
  }
  reportValidity() {
    const t = this.checkValidity();
    return this.mdcFoundation.setValid(t), (this.isUiValid = t), t;
  }
  _checkValidity(t) {
    const e = this.formElement.validity;
    let i = rt(e);
    if (this.validityTransform) {
      const e = this.validityTransform(t, i);
      (i = Object.assign(Object.assign({}, i), e)),
        this.mdcFoundation.setUseNativeValidation(!1);
    } else this.mdcFoundation.setUseNativeValidation(!0);
    return (this._validity = i), this._validity.valid;
  }
  setCustomValidity(t) {
    (this.validationMessage = t), this.formElement.setCustomValidity(t);
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
        registerTextFieldInteractionHandler: (t, e) =>
          this.addEventListener(t, e),
        deregisterTextFieldInteractionHandler: (t, e) =>
          this.removeEventListener(t, e),
        registerValidationAttributeChangeHandler: (t) => {
          const e = new MutationObserver((e) => {
            t(((t) => t.map((t) => t.attributeName).filter((t) => t))(e));
          });
          return e.observe(this.formElement, { attributes: !0 }), e;
        },
        deregisterValidationAttributeChangeHandler: (t) => t.disconnect(),
      },
      y(this.mdcRoot)
    );
  }
  getInputAdapterMethods() {
    return {
      getNativeInput: () => this.formElement,
      setInputAttr: () => {},
      removeInputAttr: () => {},
      isFocused: () =>
        !!this.shadowRoot && this.shadowRoot.activeElement === this.formElement,
      registerInputInteractionHandler: (t, e) =>
        this.formElement.addEventListener(t, e, { passive: t in ot }),
      deregisterInputInteractionHandler: (t, e) =>
        this.formElement.removeEventListener(t, e),
    };
  }
  getLabelAdapterMethods() {
    return {
      floatLabel: (t) =>
        this.labelElement && this.labelElement.floatingLabelFoundation.float(t),
      getLabelWidth: () =>
        this.labelElement
          ? this.labelElement.floatingLabelFoundation.getWidth()
          : 0,
      hasLabel: () => Boolean(this.labelElement),
      shakeLabel: (t) =>
        this.labelElement && this.labelElement.floatingLabelFoundation.shake(t),
      setLabelRequired: (t) => {
        this.labelElement &&
          this.labelElement.floatingLabelFoundation.setRequired(t);
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
      setLineRippleTransformOrigin: (t) => {
        this.lineRippleElement &&
          this.lineRippleElement.lineRippleFoundation.setRippleCenter(t);
      },
    };
  }
  async getUpdateComplete() {
    var t;
    const e = await super.getUpdateComplete();
    return (
      await (null === (t = this.outlineElement) || void 0 === t
        ? void 0
        : t.updateComplete),
      e
    );
  }
  firstUpdated() {
    var t;
    super.firstUpdated(),
      this.mdcFoundation.setValidateOnValueChange(this.autoValidate),
      this.validateOnInitialRender && this.reportValidity(),
      null === (t = this.outlineElement) ||
        void 0 === t ||
        t.updateComplete.then(() => {
          var t;
          this.outlineWidth =
            (null === (t = this.labelElement) || void 0 === t
              ? void 0
              : t.floatingLabelFoundation.getWidth()) || 0;
        });
  }
  getOutlineAdapterMethods() {
    return {
      closeOutline: () => this.outlineElement && (this.outlineOpen = !1),
      hasOutline: () => Boolean(this.outlineElement),
      notchOutline: (t) => {
        this.outlineElement &&
          !this.outlineOpen &&
          ((this.outlineWidth = t), (this.outlineOpen = !0));
      },
    };
  }
  async layout() {
    await this.updateComplete;
    const t = this.labelElement;
    if (!t) return void (this.outlineOpen = !1);
    const e = !!this.label && !!this.value;
    if ((t.floatingLabelFoundation.float(e), !this.outlined)) return;
    (this.outlineOpen = e), await this.updateComplete;
    const i = t.floatingLabelFoundation.getWidth();
    this.outlineOpen && ((this.outlineWidth = i), await this.updateComplete);
  }
}
d([l(".mdc-text-field")], ct.prototype, "mdcRoot", void 0),
  d([l("input")], ct.prototype, "formElement", void 0),
  d([l(".mdc-floating-label")], ct.prototype, "labelElement", void 0),
  d([l(".mdc-line-ripple")], ct.prototype, "lineRippleElement", void 0),
  d([l("mwc-notched-outline")], ct.prototype, "outlineElement", void 0),
  d([l(".mdc-notched-outline__notch")], ct.prototype, "notchElement", void 0),
  d([n({ type: String })], ct.prototype, "value", void 0),
  d([n({ type: String })], ct.prototype, "type", void 0),
  d([n({ type: String })], ct.prototype, "placeholder", void 0),
  d(
    [
      n({ type: String }),
      C(function (t, e) {
        void 0 !== e && this.label !== e && this.layout();
      }),
    ],
    ct.prototype,
    "label",
    void 0
  ),
  d([n({ type: String })], ct.prototype, "icon", void 0),
  d([n({ type: String })], ct.prototype, "iconTrailing", void 0),
  d([n({ type: Boolean, reflect: !0 })], ct.prototype, "disabled", void 0),
  d([n({ type: Boolean })], ct.prototype, "required", void 0),
  d([n({ type: Number })], ct.prototype, "minLength", void 0),
  d([n({ type: Number })], ct.prototype, "maxLength", void 0),
  d(
    [
      n({ type: Boolean, reflect: !0 }),
      C(function (t, e) {
        void 0 !== e && this.outlined !== e && this.layout();
      }),
    ],
    ct.prototype,
    "outlined",
    void 0
  ),
  d([n({ type: String })], ct.prototype, "helper", void 0),
  d([n({ type: Boolean })], ct.prototype, "validateOnInitialRender", void 0),
  d([n({ type: String })], ct.prototype, "validationMessage", void 0),
  d([n({ type: Boolean })], ct.prototype, "autoValidate", void 0),
  d([n({ type: String })], ct.prototype, "pattern", void 0),
  d([n({ type: String })], ct.prototype, "min", void 0),
  d([n({ type: String })], ct.prototype, "max", void 0),
  d([n({ type: String })], ct.prototype, "step", void 0),
  d([n({ type: Number })], ct.prototype, "size", void 0),
  d([n({ type: Boolean })], ct.prototype, "helperPersistent", void 0),
  d([n({ type: Boolean })], ct.prototype, "charCounter", void 0),
  d([n({ type: Boolean })], ct.prototype, "endAligned", void 0),
  d([n({ type: String })], ct.prototype, "prefix", void 0),
  d([n({ type: String })], ct.prototype, "suffix", void 0),
  d([n({ type: String })], ct.prototype, "name", void 0),
  d([n({ type: String })], ct.prototype, "inputMode", void 0),
  d([n({ type: Boolean })], ct.prototype, "readOnly", void 0),
  d([n({ type: String })], ct.prototype, "autocapitalize", void 0),
  d([b()], ct.prototype, "outlineOpen", void 0),
  d([b()], ct.prototype, "outlineWidth", void 0),
  d([b()], ct.prototype, "isUiValid", void 0),
  d([b()], ct.prototype, "focused", void 0),
  d([v({ passive: !0 })], ct.prototype, "handleInputChange", null);
const st = c`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0, 0, 0, 0.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);width:100%;min-width:0;border:none;border-radius:0;background:none;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens: none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field__affix--prefix,.mdc-text-field__affix--prefix[dir=rtl]{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl]{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field__affix--suffix,.mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-text-field--filled:hover .mdc-text-field__ripple::before,.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:whitesmoke}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-text-field--filled .mdc-floating-label,.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens: none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-text-field--outlined{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined{padding-right:max(16px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px, var(--mdc-shape-small, 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-right:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::before,.mdc-text-field--outlined .mdc-text-field__ripple::after{content:none}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-10.25px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-10.25px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-24.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-24.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer,.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl]{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateX(1px) translateY(1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl]{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}[dir=rtl] .mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake,.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}[dir=rtl] .mdc-text-field--with-trailing-icon,.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0, 0, 0, 0.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl]{text-align:left}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix{direction:ltr}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading{order:1}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{order:2}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input{order:3}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{order:4}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing{order:5}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix{padding-right:12px}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}[dir=rtl] .mdc-text-field__icon--leading,.mdc-text-field__icon--leading[dir=rtl]{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0px;margin-right:0px}[dir=rtl] .mdc-text-field__icon--trailing,.mdc-text-field__icon--trailing[dir=rtl]{margin-left:0px;margin-right:0px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:none}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06);border-bottom-color:var(--mdc-text-field-disabled-line-color, rgba(0, 0, 0, 0.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field__input{direction:inherit}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon{color:var(--mdc-text-field-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}`;
w(
  [s("ha-textfield")],
  function (t, e) {
    class i extends e {
      constructor(...e) {
        super(...e), t(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "invalid",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [n({ attribute: "error-message" })],
          key: "errorMessage",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "icon",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "iconTrailing",
          value: void 0,
        },
        {
          kind: "method",
          key: "updated",
          value: function (t) {
            E(I(i.prototype), "updated", this).call(this, t),
              ((t.has("invalid") &&
                (this.invalid || void 0 !== t.get("invalid"))) ||
                t.has("errorMessage")) &&
                (this.setCustomValidity(
                  this.invalid ? this.errorMessage || "Invalid" : ""
                ),
                this.reportValidity());
          },
        },
        {
          kind: "method",
          key: "renderIcon",
          value: function (t, e = !1) {
            const i = e ? "trailing" : "leading";
            return r`
      <span
        class="mdc-text-field__icon mdc-text-field__icon--${i}"
        tabindex=${e ? 1 : -1}
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
            st,
            c`
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
        transform-origin: var(--float-start);
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
              ? c`
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
              : c``,
          ],
        },
      ],
    };
  },
  ct
);
export {
  ct as T,
  dt as a,
  at as b,
  tt as c,
  st as d,
  H as f,
  S as l,
  lt as m,
  nt as p,
  Q as r,
  it as s,
  q as t,
  Z as u,
  K as v,
};
