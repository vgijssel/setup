/*! For license information please see 5107.Hy1eYp472Ec.js.LICENSE.txt */
export const id = 5107;
export const ids = [5107];
export const modules = {
  74376: (e, t, i) => {
    var o = i(309),
      r = i(58417),
      n = i(39274),
      a = i(5095),
      d = i(95260);
    (0, o.Z)(
      [(0, d.Mo)("ha-checkbox")],
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
                n.W,
                a.iv`:host{--mdc-theme-secondary:var(--primary-color)}`,
              ],
            },
          ],
        };
      },
      r.A
    );
  },
  45107: (e, t, i) => {
    i.r(t), i.d(t, { HaFormBoolean: () => f });
    var o = i(309),
      r = i(43204),
      n = i(95260),
      a = i(8485),
      d = i(92038);
    let l = class extends a.a {};
    (l.styles = [d.W]),
      (l = (0, r.__decorate)([(0, n.Mo)("mwc-formfield")], l));
    var s = i(5095),
      c = i(18394);
    i(74376);
    let f = (0, o.Z)(
      [(0, n.Mo)("ha-form-boolean")],
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
              decorators: [(0, n.Cb)()],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.IO)("ha-checkbox", !0)],
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
                return s.dy` <mwc-formfield .label="${this.label}"> <ha-checkbox .checked="${this.data}" .disabled="${this.disabled}" @change="${this._valueChanged}"></ha-checkbox> </mwc-formfield> `;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                (0, c.B)(this, "value-changed", { value: e.target.checked });
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  18601: (e, t, i) => {
    i.d(t, { Wg: () => s, qN: () => d.q });
    var o,
      r,
      n = i(43204),
      a = i(95260),
      d = i(78220);
    const l =
      null !==
        (r =
          null === (o = window.ShadyDOM) || void 0 === o ? void 0 : o.inUse) &&
      void 0 !== r &&
      r;
    class s extends d.H {
      constructor() {
        super(...arguments),
          (this.disabled = !1),
          (this.containingForm = null),
          (this.formDataListener = (e) => {
            this.disabled || this.setFormData(e.formData);
          });
      }
      findFormElement() {
        if (!this.shadowRoot || l) return null;
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
      (0, n.__decorate)(
        [(0, a.Cb)({ type: Boolean })],
        s.prototype,
        "disabled",
        void 0
      );
  },
  8485: (e, t, i) => {
    i.d(t, { a: () => h });
    var o = i(43204),
      r = i(72774),
      n = { ROOT: "mdc-form-field" },
      a = { LABEL_SELECTOR: ".mdc-form-field > label" };
    const d = (function (e) {
      function t(i) {
        var r =
          e.call(
            this,
            (0, o.__assign)((0, o.__assign)({}, t.defaultAdapter), i)
          ) || this;
        return (
          (r.click = function () {
            r.handleClick();
          }),
          r
        );
      }
      return (
        (0, o.__extends)(t, e),
        Object.defineProperty(t, "cssClasses", {
          get: function () {
            return n;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t, "strings", {
          get: function () {
            return a;
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
    })(r.K);
    var l = i(78220),
      s = i(18601),
      c = i(14114),
      f = i(5095),
      m = i(95260),
      p = i(53180);
    class h extends l.H {
      constructor() {
        super(...arguments),
          (this.alignEnd = !1),
          (this.spaceBetween = !1),
          (this.nowrap = !1),
          (this.label = ""),
          (this.mdcFoundationClass = d);
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
        return f.dy` <div class="mdc-form-field ${(0, p.$)(
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
    (0, o.__decorate)(
      [(0, m.Cb)({ type: Boolean })],
      h.prototype,
      "alignEnd",
      void 0
    ),
      (0, o.__decorate)(
        [(0, m.Cb)({ type: Boolean })],
        h.prototype,
        "spaceBetween",
        void 0
      ),
      (0, o.__decorate)(
        [(0, m.Cb)({ type: Boolean })],
        h.prototype,
        "nowrap",
        void 0
      ),
      (0, o.__decorate)(
        [
          (0, m.Cb)({ type: String }),
          (0, c.P)(async function (e) {
            var t;
            null === (t = this.input) ||
              void 0 === t ||
              t.setAttribute("aria-label", e);
          }),
        ],
        h.prototype,
        "label",
        void 0
      ),
      (0, o.__decorate)(
        [(0, m.IO)(".mdc-form-field")],
        h.prototype,
        "mdcRoot",
        void 0
      ),
      (0, o.__decorate)(
        [(0, m.vZ)("", !0, "*")],
        h.prototype,
        "slottedInputs",
        void 0
      ),
      (0, o.__decorate)([(0, m.IO)("label")], h.prototype, "labelEl", void 0);
  },
  92038: (e, t, i) => {
    i.d(t, { W: () => o });
    const o = i(5095)
      .iv`.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{margin-left:auto;margin-right:0}.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{margin-left:0;margin-right:auto}.mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}.mdc-form-field--space-between>label[dir=rtl],[dir=rtl] .mdc-form-field--space-between>label{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, .0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))}::slotted(mwc-switch){margin-right:10px}::slotted(mwc-switch[dir=rtl]),[dir=rtl] ::slotted(mwc-switch){margin-left:10px}`;
  },
};
//# sourceMappingURL=5107.Hy1eYp472Ec.js.map
