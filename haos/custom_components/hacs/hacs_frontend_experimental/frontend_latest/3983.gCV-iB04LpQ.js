export const id = 3983;
export const ids = [3983];
export const modules = {
  86089: (e, t, i) => {
    i.d(t, { U: () => n });
    const n = (e) => e.stopPropagation();
  },
  71133: (e, t, i) => {
    var n = i(309),
      a = i(34541),
      l = i(47838),
      d = i(49412),
      s = i(3762),
      o = i(5095),
      r = i(95260),
      c = i(72218),
      u = i(2537);
    i(54371);
    (0, n.Z)(
      [(0, r.Mo)("ha-select")],
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
              decorators: [(0, r.Cb)({ type: Boolean })],
              key: "icon",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)({ type: Boolean, reflect: !0 })],
              key: "clearable",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` ${(0, a.Z)(
                  (0, l.Z)(i.prototype),
                  "render",
                  this
                ).call(this)} ${
                  this.clearable &&
                  !this.required &&
                  !this.disabled &&
                  this.value
                    ? o.dy`<ha-icon-button label="clear" @click="${
                        this._clearValue
                      }" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}"></ha-icon-button>`
                    : o.Ld
                } `;
              },
            },
            {
              kind: "method",
              key: "renderLeadingIcon",
              value: function () {
                return this.icon
                  ? o.dy`<span class="mdc-select__icon"><slot name="icon"></slot></span>`
                  : o.Ld;
              },
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, a.Z)((0, l.Z)(i.prototype), "connectedCallback", this).call(
                  this
                ),
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
                (0, a.Z)(
                  (0, l.Z)(i.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  window.removeEventListener(
                    "translations-updated",
                    this._translationsUpdated
                  );
              },
            },
            {
              kind: "method",
              key: "_clearValue",
              value: function () {
                !this.disabled &&
                  this.value &&
                  ((this.valueSetDirectly = !0),
                  this.select(-1),
                  this.mdcFoundation.handleChange());
              },
            },
            {
              kind: "field",
              key: "_translationsUpdated",
              value() {
                return (0, c.D)(async () => {
                  await (0, u.y)(), this.layoutOptions();
                }, 500);
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                s.W,
                o.iv`:host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      d.K
    );
  },
  23983: (e, t, i) => {
    i.r(t), i.d(t, { HaTTSSelector: () => p });
    var n = i(309),
      a = i(5095),
      l = i(95260),
      d = i(34541),
      s = i(47838),
      o = i(18394),
      r = i(86089),
      c = i(2733),
      u = i(72218),
      h = i(56112);
    i(90532), i(71133);
    const v = "__NONE_OPTION__",
      g = {
        cloud: "Home Assistant Cloud",
        google_translate: "Google Translate",
      };
    (0, n.Z)(
      [(0, l.Mo)("ha-tts-picker")],
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
              decorators: [(0, l.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "language",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean, reflect: !0 })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.SB)()],
              key: "_engines",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                if (!this._engines) return a.Ld;
                const t =
                  null !== (e = this.value) && void 0 !== e
                    ? e
                    : this.required
                    ? this._engines.find((e) => {
                        var t;
                        return (
                          0 !==
                          (null === (t = e.supported_languages) || void 0 === t
                            ? void 0
                            : t.length)
                        );
                      })
                    : v;
                return a.dy` <ha-select .label="${
                  this.label ||
                  this.hass.localize("ui.components.tts-picker.tts")
                }" .value="${t}" .required="${this.required}" .disabled="${
                  this.disabled
                }" @selected="${this._changed}" @closed="${
                  r.U
                }" fixedMenuPosition naturalMenuWidth> ${
                  this.required
                    ? a.Ld
                    : a.dy`<ha-list-item .value="${v}"> ${this.hass.localize(
                        "ui.components.tts-picker.none"
                      )} </ha-list-item>`
                } ${this._engines.map((e) => {
                  var t;
                  let i = e.engine_id;
                  if (e.engine_id.includes(".")) {
                    const t = this.hass.states[e.engine_id];
                    i = t ? (0, c.C)(t) : e.engine_id;
                  } else e.engine_id in g && (i = g[e.engine_id]);
                  return a.dy`<ha-list-item .value="${
                    e.engine_id
                  }" .disabled="${
                    0 ===
                    (null === (t = e.supported_languages) || void 0 === t
                      ? void 0
                      : t.length)
                  }"> ${i} </ha-list-item>`;
                })} </ha-select> `;
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, d.Z)((0, s.Z)(i.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  this.hasUpdated
                    ? e.has("language") && this._debouncedUpdateEngines()
                    : this._updateEngines();
              },
            },
            {
              kind: "field",
              key: "_debouncedUpdateEngines",
              value() {
                return (0, u.D)(() => this._updateEngines(), 500);
              },
            },
            {
              kind: "method",
              key: "_updateEngines",
              value: async function () {
                var e;
                if (
                  ((this._engines = (
                    await (0, h.Wg)(
                      this.hass,
                      this.language,
                      this.hass.config.country || void 0
                    )
                  ).providers),
                  !this.value)
                )
                  return;
                const t = this._engines.find((e) => e.engine_id === this.value);
                (0, o.B)(this, "supported-languages-changed", {
                  value: null == t ? void 0 : t.supported_languages,
                }),
                  (t &&
                    0 !==
                      (null === (e = t.supported_languages) || void 0 === e
                        ? void 0
                        : e.length)) ||
                    ((this.value = void 0),
                    (0, o.B)(this, "value-changed", { value: this.value }));
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return a.iv`ha-select{width:100%}`;
              },
            },
            {
              kind: "method",
              key: "_changed",
              value: function (e) {
                var t;
                const i = e.target;
                !this.hass ||
                  "" === i.value ||
                  i.value === this.value ||
                  (void 0 === this.value && i.value === v) ||
                  ((this.value = i.value === v ? void 0 : i.value),
                  (0, o.B)(this, "value-changed", { value: this.value }),
                  (0, o.B)(this, "supported-languages-changed", {
                    value:
                      null ===
                        (t = this._engines.find(
                          (e) => e.engine_id === this.value
                        )) || void 0 === t
                        ? void 0
                        : t.supported_languages,
                  }));
              },
            },
          ],
        };
      },
      a.oi
    );
    let p = (0, n.Z)(
      [(0, l.Mo)("ha-selector-tts")],
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
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "context",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                return a.dy`<ha-tts-picker .hass="${this.hass}" .value="${
                  this.value
                }" .label="${this.label}" .helper="${this.helper}" .language="${
                  (null === (e = this.selector.tts) || void 0 === e
                    ? void 0
                    : e.language) ||
                  (null === (t = this.context) || void 0 === t
                    ? void 0
                    : t.language)
                }" .disabled="${this.disabled}" .required="${
                  this.required
                }"></ha-tts-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => a.iv`ha-tts-picker{width:100%}`,
            },
          ],
        };
      },
      a.oi
    );
  },
  56112: (e, t, i) => {
    i.d(t, { MV: () => o, Wg: () => d, Xk: () => l, b_: () => a, yP: () => s });
    const n = "media-source://tts/",
      a = (e) => e.startsWith(n),
      l = (e) => e.substring(19),
      d = (e, t, i) =>
        e.callWS({ type: "tts/engine/list", language: t, country: i }),
      s = (e, t) => e.callWS({ type: "tts/engine/get", engine_id: t }),
      o = (e, t, i) =>
        e.callWS({ type: "tts/engine/voices", engine_id: t, language: i });
  },
};
//# sourceMappingURL=3983.gCV-iB04LpQ.js.map
