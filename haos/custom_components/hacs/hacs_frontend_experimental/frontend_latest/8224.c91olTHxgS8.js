export const id = 8224;
export const ids = [8224];
export const modules = {
  78224: (e, i, t) => {
    t.r(i), t.d(i, { HaFormFloat: () => r });
    var d = t(309),
      a = t(5095),
      n = t(95260),
      l = t(18394);
    t(51520);
    let r = (0, d.Z)(
      [(0, n.Mo)("ha-form-float")],
      function (e, i) {
        return {
          F: class extends i {
            constructor(...i) {
              super(...i), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "localize",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
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
              decorators: [(0, n.Cb)()],
              key: "helper",
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
              decorators: [(0, n.IO)("ha-textfield")],
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
                var e, i;
                return a.dy` <ha-textfield type="numeric" inputMode="decimal" .label="${
                  this.label
                }" .helper="${this.helper}" helperPersistent .value="${
                  void 0 !== this.data ? this.data : ""
                }" .disabled="${this.disabled}" .required="${
                  this.schema.required
                }" .autoValidate="${this.schema.required}" .suffix="${
                  null === (e = this.schema.description) || void 0 === e
                    ? void 0
                    : e.suffix
                }" .validationMessage="${
                  this.schema.required
                    ? null === (i = this.localize) || void 0 === i
                      ? void 0
                      : i.call(this, "ui.common.error_required")
                    : void 0
                }" @input="${this._valueChanged}"></ha-textfield> `;
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                e.has("schema") &&
                  this.toggleAttribute("own-margin", !!this.schema.required);
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                const i = e.target,
                  t = i.value.replace(",", ".");
                let d;
                if (!t.endsWith(".") && "-" !== t)
                  if (
                    ("" !== t &&
                      ((d = parseFloat(t)), isNaN(d) && (d = void 0)),
                    this.data !== d)
                  )
                    (0, l.B)(this, "value-changed", { value: d });
                  else {
                    const e = void 0 === d ? "" : String(d);
                    i.value !== e && (i.value = e);
                  }
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                a.iv`:host([own-margin]){margin-bottom:5px}ha-textfield{display:block}`,
            },
          ],
        };
      },
      a.oi
    );
  },
  51520: (e, i, t) => {
    var d = t(309),
      a = t(34541),
      n = t(47838),
      l = t(42977),
      r = t(31338),
      o = t(5095),
      s = t(95260),
      c = t(67684);
    (0, d.Z)(
      [(0, s.Mo)("ha-textfield")],
      function (e, i) {
        class t extends i {
          constructor(...i) {
            super(...i), e(this);
          }
        }
        return {
          F: t,
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "invalid",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "error-message" })],
              key: "errorMessage",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "icon",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "iconTrailing",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "autocomplete",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "autocorrect",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "input-spellcheck" })],
              key: "inputSpellcheck",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.IO)("input")],
              key: "formElement",
              value: void 0,
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, a.Z)((0, n.Z)(t.prototype), "updated", this).call(this, e),
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
                      : this.formElement.removeAttribute("autocomplete")),
                  e.has("autocorrect") &&
                    (this.autocorrect
                      ? this.formElement.setAttribute(
                          "autocorrect",
                          this.autocorrect
                        )
                      : this.formElement.removeAttribute("autocorrect")),
                  e.has("inputSpellcheck") &&
                    (this.inputSpellcheck
                      ? this.formElement.setAttribute(
                          "spellcheck",
                          this.inputSpellcheck
                        )
                      : this.formElement.removeAttribute("spellcheck"));
              },
            },
            {
              kind: "method",
              key: "renderIcon",
              value: function (e, i = !1) {
                const t = i ? "trailing" : "leading";
                return o.dy` <span class="mdc-text-field__icon mdc-text-field__icon--${t}" tabindex="${
                  i ? 1 : -1
                }"> <slot name="${t}Icon"></slot> </span> `;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                r.W,
                o.iv`.mdc-text-field__input{width:var(--ha-textfield-input-width,100%)}.mdc-text-field:not(.mdc-text-field--with-leading-icon){padding:var(--text-field-padding,0px 16px)}.mdc-text-field__affix--suffix{padding-left:var(--text-field-suffix-padding-left,12px);padding-right:var(--text-field-suffix-padding-right,0px);padding-inline-start:var(--text-field-suffix-padding-left,12px);padding-inline-end:var(--text-field-suffix-padding-right,0px);direction:var(--direction)}.mdc-text-field--with-leading-icon{padding-inline-start:var(--text-field-suffix-padding-left,0px);padding-inline-end:var(--text-field-suffix-padding-right,16px);direction:var(--direction)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:var(--text-field-suffix-padding-left,0px);padding-right:var(--text-field-suffix-padding-right,0px);padding-inline-start:var(--text-field-suffix-padding-left,0px);padding-inline-end:var(--text-field-suffix-padding-right,0px)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:var(--secondary-text-color)}.mdc-text-field__icon{color:var(--secondary-text-color)}.mdc-text-field__icon--leading{margin-inline-start:16px;margin-inline-end:8px;direction:var(--direction)}.mdc-text-field__icon--trailing{padding:var(--textfield-icon-trailing-padding,12px)}.mdc-floating-label:not(.mdc-floating-label--float-above){text-overflow:ellipsis;width:inherit;padding-right:30px;padding-inline-end:30px;padding-inline-start:initial;box-sizing:border-box;direction:var(--direction)}input{text-align:var(--text-field-text-align,start)}::-ms-reveal{display:none}:host([no-spinner]) input::-webkit-inner-spin-button,:host([no-spinner]) input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}:host([no-spinner]) input[type=number]{-moz-appearance:textfield}.mdc-text-field__ripple{overflow:hidden}.mdc-text-field{overflow:var(--text-field-overflow)}.mdc-floating-label{inset-inline-start:16px!important;inset-inline-end:initial!important;transform-origin:var(--float-start);direction:var(--direction);text-align:var(--float-start)}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px - var(--text-field-suffix-padding-left,0px));inset-inline-start:calc(48px + var(--text-field-suffix-padding-left,0px))!important;inset-inline-end:initial!important;direction:var(--direction)}.mdc-text-field__input[type=number]{direction:var(--direction)}.mdc-text-field__affix--prefix{padding-right:var(--text-field-prefix-padding-right,2px)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:var(--mdc-text-field-label-ink-color)}`,
                "rtl" === c.E.document.dir
                  ? o.iv`.mdc-floating-label,.mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field__affix--suffix,.mdc-text-field__icon--leading,.mdc-text-field__input[type=number]{direction:rtl}`
                  : o.iv``,
              ],
            },
          ],
        };
      },
      l.P
    );
  },
};
//# sourceMappingURL=8224.c91olTHxgS8.js.map
