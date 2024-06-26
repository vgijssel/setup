export const id = 9030;
export const ids = [9030];
export const modules = {
  79030: (e, i, t) => {
    t.r(i), t.d(i, { HaFormInteger: () => h });
    var a = t(309),
      s = t(5095),
      d = t(95260),
      l = t(18394);
    t(8956);
    let h = (0, a.Z)(
      [(0, d.Mo)("ha-form-integer")],
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
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "localize",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.IO)("ha-textfield ha-slider")],
              key: "_input",
              value: void 0,
            },
            { kind: "field", key: "_lastValue", value: void 0 },
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
                return void 0 !== this.schema.valueMin &&
                  void 0 !== this.schema.valueMax &&
                  this.schema.valueMax - this.schema.valueMin < 256
                  ? s.dy` <div> ${this.label} <div class="flex"> ${
                      this.schema.required
                        ? ""
                        : s.dy` <ha-checkbox @change="${
                            this._handleCheckboxChange
                          }" .checked="${void 0 !== this.data}" .disabled="${
                            this.disabled
                          }"></ha-checkbox> `
                    } <ha-slider labeled .value="${this._value}" .min="${
                      this.schema.valueMin
                    }" .max="${this.schema.valueMax}" .disabled="${
                      this.disabled ||
                      (void 0 === this.data && !this.schema.required)
                    }" @change="${this._valueChanged}"></ha-slider> </div> ${
                      this.helper
                        ? s.dy`<ha-input-helper-text>${this.helper}</ha-input-helper-text>`
                        : ""
                    } </div> `
                  : s.dy` <ha-textfield type="number" inputMode="numeric" .label="${
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
                  this.toggleAttribute(
                    "own-margin",
                    !(
                      ("valueMin" in this.schema &&
                        "valueMax" in this.schema) ||
                      !this.schema.required
                    )
                  );
              },
            },
            {
              kind: "get",
              key: "_value",
              value: function () {
                var e, i;
                return void 0 !== this.data
                  ? this.data
                  : this.schema.required
                  ? (void 0 !==
                      (null === (e = this.schema.description) || void 0 === e
                        ? void 0
                        : e.suggested_value) &&
                      null !==
                        (null === (i = this.schema.description) || void 0 === i
                          ? void 0
                          : i.suggested_value)) ||
                    this.schema.default ||
                    this.schema.valueMin ||
                    0
                  : this.schema.valueMin || 0;
              },
            },
            {
              kind: "method",
              key: "_handleCheckboxChange",
              value: function (e) {
                let i;
                if (e.target.checked)
                  for (const e of [
                    this._lastValue,
                    null === (t = this.schema.description) || void 0 === t
                      ? void 0
                      : t.suggested_value,
                    this.schema.default,
                    0,
                  ]) {
                    var t;
                    if (void 0 !== e) {
                      i = e;
                      break;
                    }
                  }
                else this._lastValue = this.data;
                (0, l.B)(this, "value-changed", { value: i });
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                const i = e.target,
                  t = i.value;
                let a;
                if (("" !== t && (a = parseInt(String(t))), this.data !== a))
                  (0, l.B)(this, "value-changed", { value: a });
                else {
                  const e = void 0 === a ? "" : String(a);
                  i.value !== e && (i.value = e);
                }
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return s.iv`:host([own-margin]){margin-bottom:5px}.flex{display:flex}ha-slider{flex:1}ha-textfield{display:block}`;
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  8956: (e, i, t) => {
    var a = t(309),
      s = t(95260),
      d = (t(34131), t(96985)),
      l = t(5095);
    (0, a.Z)(
      [(0, s.Mo)("ha-slider")],
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
              static: !0,
              key: "styles",
              value: () => [
                ...d.$.styles,
                l.iv`:host{--md-sys-color-primary:var(--primary-color);--md-sys-color-outline:var(--outline-color);--md-sys-color-on-surface:var(--primary-text-color);--md-slider-handle-width:14px;--md-slider-handle-height:14px;min-width:100px;min-inline-size:100px;width:200px}`,
              ],
            },
          ],
        };
      },
      d.$
    );
  },
};
//# sourceMappingURL=9030.ZMlC_inwqcY.js.map
