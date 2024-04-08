/*! For license information please see 339.dbk8wpd18aA.js.LICENSE.txt */
export const id = 339;
export const ids = [339];
export const modules = {
  48950: (e, t, i) => {
    var r = i(309),
      o = i(8485),
      a = i(92038),
      n = i(5095),
      c = i(95260),
      d = i(18394);
    (0, r.Z)(
      [(0, c.Mo)("ha-formfield")],
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
                if (e && (e.focus(), !e.disabled))
                  switch (e.tagName) {
                    case "HA-CHECKBOX":
                      (e.checked = !e.checked), (0, d.B)(e, "change");
                      break;
                    case "HA-RADIO":
                      (e.checked = !0), (0, d.B)(e, "change");
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
                a.W,
                n.iv`:host(:not([alignEnd])) ::slotted(ha-switch){margin-right:10px;margin-inline-end:10px;margin-inline-start:inline}.mdc-form-field>label{direction:var(--direction);margin-inline-start:0;margin-inline-end:auto;padding-inline-start:4px;padding-inline-end:0}`,
              ],
            },
          ],
        };
      },
      o.a
    );
  },
  7265: (e, t, i) => {
    var r = i(309),
      o = i(5095),
      a = i(95260);
    (0, r.Z)(
      [(0, a.Mo)("ha-input-helper-text")],
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
              key: "render",
              value: function () {
                return o.dy`<slot></slot>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                o.iv`:host{display:block;color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6));font-size:.75rem;padding-left:16px;padding-right:16px}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  10339: (e, t, i) => {
    i.r(t), i.d(t, { HaBooleanSelector: () => c });
    var r = i(309),
      o = i(5095),
      a = i(95260),
      n = i(18394);
    i(48950), i(8942), i(7265);
    let c = (0, r.Z)(
      [(0, a.Mo)("ha-selector-boolean")],
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
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "value",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-formfield alignEnd spaceBetween .label="${
                  this.label
                }"> <ha-switch .checked="${this.value}" @change="${
                  this._handleChange
                }" .disabled="${this.disabled}"></ha-switch> </ha-formfield> ${
                  this.helper
                    ? o.dy`<ha-input-helper-text>${this.helper}</ha-input-helper-text>`
                    : ""
                } `;
              },
            },
            {
              kind: "method",
              key: "_handleChange",
              value: function (e) {
                const t = e.target.checked;
                this.value !== t &&
                  (0, n.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`ha-formfield{display:flex;height:56px;align-items:center;--mdc-typography-body2-font-size:1em}`;
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  8942: (e, t, i) => {
    var r = i(309),
      o = i(34541),
      a = i(47838),
      n = i(43204),
      c = (i(27763), i(38103)),
      d = i(78220),
      s = i(14114),
      l = i(98734),
      h = i(72774),
      p = { CHECKED: "mdc-switch--checked", DISABLED: "mdc-switch--disabled" },
      m = {
        ARIA_CHECKED_ATTR: "aria-checked",
        NATIVE_CONTROL_SELECTOR: ".mdc-switch__native-control",
        RIPPLE_SURFACE_SELECTOR: ".mdc-switch__thumb-underlay",
      };
    const u = (function (e) {
      function t(i) {
        return (
          e.call(
            this,
            (0, n.__assign)((0, n.__assign)({}, t.defaultAdapter), i)
          ) || this
        );
      }
      return (
        (0, n.__extends)(t, e),
        Object.defineProperty(t, "strings", {
          get: function () {
            return m;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t, "cssClasses", {
          get: function () {
            return p;
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
              ? this.adapter.addClass(p.DISABLED)
              : this.adapter.removeClass(p.DISABLED);
        }),
        (t.prototype.handleChange = function (e) {
          var t = e.target;
          this.updateAriaChecked(t.checked),
            this.updateCheckedStyling(t.checked);
        }),
        (t.prototype.updateCheckedStyling = function (e) {
          e
            ? this.adapter.addClass(p.CHECKED)
            : this.adapter.removeClass(p.CHECKED);
        }),
        (t.prototype.updateAriaChecked = function (e) {
          this.adapter.setNativeControlAttr(m.ARIA_CHECKED_ATTR, "" + !!e);
        }),
        t
      );
    })(h.K);
    var f = i(5095),
      b = i(95260),
      g = i(10694);
    class v extends d.H {
      constructor() {
        super(...arguments),
          (this.checked = !1),
          (this.disabled = !1),
          (this.shouldRenderRipple = !1),
          (this.mdcFoundationClass = u),
          (this.rippleHandlers = new l.A(
            () => ((this.shouldRenderRipple = !0), this.ripple)
          ));
      }
      changeHandler(e) {
        this.mdcFoundation.handleChange(e),
          (this.checked = this.formElement.checked);
      }
      createAdapter() {
        return Object.assign(Object.assign({}, (0, d.q)(this.mdcRoot)), {
          setNativeControlChecked: (e) => {
            this.formElement.checked = e;
          },
          setNativeControlDisabled: (e) => {
            this.formElement.disabled = e;
          },
          setNativeControlAttr: (e, t) => {
            this.formElement.setAttribute(e, t);
          },
        });
      }
      renderRipple() {
        return this.shouldRenderRipple
          ? f.dy` <mwc-ripple .accent="${this.checked}" .disabled="${this.disabled}" unbounded> </mwc-ripple>`
          : "";
      }
      focus() {
        const e = this.formElement;
        e && (this.rippleHandlers.startFocus(), e.focus());
      }
      blur() {
        const e = this.formElement;
        e && (this.rippleHandlers.endFocus(), e.blur());
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
      render() {
        return f.dy` <div class="mdc-switch"> <div class="mdc-switch__track"></div> <div class="mdc-switch__thumb-underlay"> ${this.renderRipple()} <div class="mdc-switch__thumb"> <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" aria-label="${(0,
        g.o)(this.ariaLabel)}" aria-labelledby="${(0, g.o)(
          this.ariaLabelledBy
        )}" @change="${this.changeHandler}" @focus="${
          this.handleRippleFocus
        }" @blur="${this.handleRippleBlur}" @mousedown="${
          this.handleRippleMouseDown
        }" @mouseenter="${this.handleRippleMouseEnter}" @mouseleave="${
          this.handleRippleMouseLeave
        }" @touchstart="${this.handleRippleTouchStart}" @touchend="${
          this.handleRippleDeactivate
        }" @touchcancel="${this.handleRippleDeactivate}"> </div> </div> </div>`;
      }
      handleRippleMouseDown(e) {
        const t = () => {
          window.removeEventListener("mouseup", t),
            this.handleRippleDeactivate();
        };
        window.addEventListener("mouseup", t),
          this.rippleHandlers.startPress(e);
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
    }
    (0, n.__decorate)(
      [
        (0, b.Cb)({ type: Boolean }),
        (0, s.P)(function (e) {
          this.mdcFoundation.setChecked(e);
        }),
      ],
      v.prototype,
      "checked",
      void 0
    ),
      (0, n.__decorate)(
        [
          (0, b.Cb)({ type: Boolean }),
          (0, s.P)(function (e) {
            this.mdcFoundation.setDisabled(e);
          }),
        ],
        v.prototype,
        "disabled",
        void 0
      ),
      (0, n.__decorate)(
        [c.L, (0, b.Cb)({ attribute: "aria-label" })],
        v.prototype,
        "ariaLabel",
        void 0
      ),
      (0, n.__decorate)(
        [c.L, (0, b.Cb)({ attribute: "aria-labelledby" })],
        v.prototype,
        "ariaLabelledBy",
        void 0
      ),
      (0, n.__decorate)(
        [(0, b.IO)(".mdc-switch")],
        v.prototype,
        "mdcRoot",
        void 0
      ),
      (0, n.__decorate)(
        [(0, b.IO)("input")],
        v.prototype,
        "formElement",
        void 0
      ),
      (0, n.__decorate)(
        [(0, b.GC)("mwc-ripple")],
        v.prototype,
        "ripple",
        void 0
      ),
      (0, n.__decorate)(
        [(0, b.SB)()],
        v.prototype,
        "shouldRenderRipple",
        void 0
      ),
      (0, n.__decorate)(
        [(0, b.hO)({ passive: !0 })],
        v.prototype,
        "handleRippleMouseDown",
        null
      ),
      (0, n.__decorate)(
        [(0, b.hO)({ passive: !0 })],
        v.prototype,
        "handleRippleTouchStart",
        null
      );
    const y = f.iv`.mdc-switch__thumb-underlay{left:-14px;right:initial;top:-17px;width:48px;height:48px}.mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch__thumb-underlay{left:initial;right:-14px}.mdc-switch__native-control{width:64px;height:48px}.mdc-switch{display:inline-block;position:relative;outline:0;user-select:none}.mdc-switch.mdc-switch--checked .mdc-switch__track{background-color:#018786;background-color:var(--mdc-theme-secondary,#018786)}.mdc-switch.mdc-switch--checked .mdc-switch__thumb{background-color:#018786;background-color:var(--mdc-theme-secondary,#018786);border-color:#018786;border-color:var(--mdc-theme-secondary,#018786)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__track{background-color:#000;background-color:var(--mdc-theme-on-surface,#000)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb{background-color:#fff;background-color:var(--mdc-theme-surface,#fff);border-color:#fff;border-color:var(--mdc-theme-surface,#fff)}.mdc-switch__native-control{left:0;right:initial;position:absolute;top:0;margin:0;opacity:0;cursor:pointer;pointer-events:auto;transition:transform 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch__native-control{left:initial;right:0}.mdc-switch__track{box-sizing:border-box;width:36px;height:14px;border:1px solid transparent;border-radius:7px;opacity:.38;transition:opacity 90ms cubic-bezier(.4, 0, .2, 1),background-color 90ms cubic-bezier(.4, 0, .2, 1),border-color 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__thumb-underlay{display:flex;position:absolute;align-items:center;justify-content:center;transform:translateX(0);transition:transform 90ms cubic-bezier(.4, 0, .2, 1),background-color 90ms cubic-bezier(.4, 0, .2, 1),border-color 90ms cubic-bezier(.4, 0, .2, 1)}.mdc-switch__thumb{box-shadow:0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12);box-sizing:border-box;width:20px;height:20px;border:10px solid;border-radius:50%;pointer-events:none;z-index:1}.mdc-switch--checked .mdc-switch__track{opacity:.54}.mdc-switch--checked .mdc-switch__thumb-underlay{transform:translateX(16px)}.mdc-switch--checked .mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__thumb-underlay{transform:translateX(-16px)}.mdc-switch--checked .mdc-switch__native-control{transform:translateX(-16px)}.mdc-switch--checked .mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__native-control{transform:translateX(16px)}.mdc-switch--disabled{opacity:.38;pointer-events:none}.mdc-switch--disabled .mdc-switch__thumb{border-width:1px}.mdc-switch--disabled .mdc-switch__native-control{cursor:default;pointer-events:none}:host{display:inline-flex;outline:0;-webkit-tap-highlight-color:transparent}`;
    var w = i(18394);
    (0, r.Z)(
      [(0, b.Mo)("ha-switch")],
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
              decorators: [(0, b.Cb)({ type: Boolean })],
              key: "haptic",
              value: () => !1,
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                (0, o.Z)((0, a.Z)(i.prototype), "firstUpdated", this).call(
                  this
                ),
                  this.addEventListener("change", () => {
                    var e;
                    this.haptic &&
                      ((e = "light"), (0, w.B)(window, "haptic", e));
                  });
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                y,
                f.iv`:host{--mdc-theme-secondary:var(--switch-checked-color)}.mdc-switch.mdc-switch--checked .mdc-switch__thumb{background-color:var(--switch-checked-button-color);border-color:var(--switch-checked-button-color)}.mdc-switch.mdc-switch--checked .mdc-switch__track{background-color:var(--switch-checked-track-color);border-color:var(--switch-checked-track-color)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb{background-color:var(--switch-unchecked-button-color);border-color:var(--switch-unchecked-button-color)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__track{background-color:var(--switch-unchecked-track-color);border-color:var(--switch-unchecked-track-color)}`,
              ],
            },
          ],
        };
      },
      v
    );
  },
  18601: (e, t, i) => {
    i.d(t, { Wg: () => s, qN: () => c.q });
    var r,
      o,
      a = i(43204),
      n = i(95260),
      c = i(78220);
    const d =
      null !==
        (o =
          null === (r = window.ShadyDOM) || void 0 === r ? void 0 : r.inUse) &&
      void 0 !== o &&
      o;
    class s extends c.H {
      constructor() {
        super(...arguments),
          (this.disabled = !1),
          (this.containingForm = null),
          (this.formDataListener = (e) => {
            this.disabled || this.setFormData(e.formData);
          });
      }
      findFormElement() {
        if (!this.shadowRoot || d) return null;
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
    (s.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
      (0, a.__decorate)(
        [(0, n.Cb)({ type: Boolean })],
        s.prototype,
        "disabled",
        void 0
      );
  },
  8485: (e, t, i) => {
    i.d(t, { a: () => u });
    var r = i(43204),
      o = i(72774),
      a = { ROOT: "mdc-form-field" },
      n = { LABEL_SELECTOR: ".mdc-form-field > label" };
    const c = (function (e) {
      function t(i) {
        var o =
          e.call(
            this,
            (0, r.__assign)((0, r.__assign)({}, t.defaultAdapter), i)
          ) || this;
        return (
          (o.click = function () {
            o.handleClick();
          }),
          o
        );
      }
      return (
        (0, r.__extends)(t, e),
        Object.defineProperty(t, "cssClasses", {
          get: function () {
            return a;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t, "strings", {
          get: function () {
            return n;
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
    })(o.K);
    var d = i(78220),
      s = i(18601),
      l = i(14114),
      h = i(5095),
      p = i(95260),
      m = i(53180);
    class u extends d.H {
      constructor() {
        super(...arguments),
          (this.alignEnd = !1),
          (this.spaceBetween = !1),
          (this.nowrap = !1),
          (this.label = ""),
          (this.mdcFoundationClass = c);
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
            if (e instanceof s.Wg) {
              const t = await e.ripple;
              t && t.startPress();
            }
          },
          deactivateInputRipple: async () => {
            const e = this.input;
            if (e instanceof s.Wg) {
              const t = await e.ripple;
              t && t.endPress();
            }
          },
        };
      }
      get input() {
        var e, t;
        return null !==
          (t =
            null === (e = this.slottedInputs) || void 0 === e
              ? void 0
              : e[0]) && void 0 !== t
          ? t
          : null;
      }
      render() {
        const e = {
          "mdc-form-field--align-end": this.alignEnd,
          "mdc-form-field--space-between": this.spaceBetween,
          "mdc-form-field--nowrap": this.nowrap,
        };
        return h.dy` <div class="mdc-form-field ${(0, m.$)(
          e
        )}"> <slot></slot> <label class="mdc-label" @click="${
          this._labelClick
        }">${this.label}</label> </div>`;
      }
      click() {
        this._labelClick();
      }
      _labelClick() {
        const e = this.input;
        e && (e.focus(), e.click());
      }
    }
    (0, r.__decorate)(
      [(0, p.Cb)({ type: Boolean })],
      u.prototype,
      "alignEnd",
      void 0
    ),
      (0, r.__decorate)(
        [(0, p.Cb)({ type: Boolean })],
        u.prototype,
        "spaceBetween",
        void 0
      ),
      (0, r.__decorate)(
        [(0, p.Cb)({ type: Boolean })],
        u.prototype,
        "nowrap",
        void 0
      ),
      (0, r.__decorate)(
        [
          (0, p.Cb)({ type: String }),
          (0, l.P)(async function (e) {
            var t;
            null === (t = this.input) ||
              void 0 === t ||
              t.setAttribute("aria-label", e);
          }),
        ],
        u.prototype,
        "label",
        void 0
      ),
      (0, r.__decorate)(
        [(0, p.IO)(".mdc-form-field")],
        u.prototype,
        "mdcRoot",
        void 0
      ),
      (0, r.__decorate)(
        [(0, p.vZ)("", !0, "*")],
        u.prototype,
        "slottedInputs",
        void 0
      ),
      (0, r.__decorate)([(0, p.IO)("label")], u.prototype, "labelEl", void 0);
  },
  92038: (e, t, i) => {
    i.d(t, { W: () => r });
    const r = i(5095)
      .iv`.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{margin-left:auto;margin-right:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{margin-left:0;margin-right:auto}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}.mdc-form-field--space-between>label[dir=rtl],[dir=rtl] .mdc-form-field--space-between>label{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))}::slotted(mwc-switch){margin-right:10px}::slotted(mwc-switch[dir=rtl]),[dir=rtl] ::slotted(mwc-switch){margin-left:10px}`;
  },
};
//# sourceMappingURL=339.dbk8wpd18aA.js.map
