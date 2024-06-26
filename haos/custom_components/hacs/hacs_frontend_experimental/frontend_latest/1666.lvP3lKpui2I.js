export const id = 1666;
export const ids = [1666];
export const modules = {
  86089: (e, t, i) => {
    i.d(t, { U: () => a });
    const a = (e) => e.stopPropagation();
  },
  71133: (e, t, i) => {
    var a = i(309),
      d = i(34541),
      l = i(47838),
      n = i(49412),
      s = i(3762),
      o = i(5095),
      c = i(95260),
      r = i(72218),
      u = i(2537);
    i(54371);
    (0, a.Z)(
      [(0, c.Mo)("ha-select")],
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
              decorators: [(0, c.Cb)({ type: Boolean })],
              key: "icon",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, c.Cb)({ type: Boolean, reflect: !0 })],
              key: "clearable",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` ${(0, d.Z)(
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
                (0, d.Z)((0, l.Z)(i.prototype), "connectedCallback", this).call(
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
                (0, d.Z)(
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
                return (0, r.D)(async () => {
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
      n.K
    );
  },
  71666: (e, t, i) => {
    i.r(t), i.d(t, { HaTTSVoiceSelector: () => n });
    var a = i(309),
      d = i(5095),
      l = i(95260);
    i(60298);
    let n = (0, a.Z)(
      [(0, l.Mo)("ha-selector-tts_voice")],
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
                var e, t, i, a;
                return d.dy`<ha-tts-voice-picker .hass="${this.hass}" .value="${
                  this.value
                }" .label="${this.label}" .helper="${this.helper}" .language="${
                  (null === (e = this.selector.tts_voice) || void 0 === e
                    ? void 0
                    : e.language) ||
                  (null === (t = this.context) || void 0 === t
                    ? void 0
                    : t.language)
                }" .engineId="${
                  (null === (i = this.selector.tts_voice) || void 0 === i
                    ? void 0
                    : i.engineId) ||
                  (null === (a = this.context) || void 0 === a
                    ? void 0
                    : a.engineId)
                }" .disabled="${this.disabled}" .required="${
                  this.required
                }"></ha-tts-voice-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => d.iv`ha-tts-picker{width:100%}`,
            },
          ],
        };
      },
      d.oi
    );
  },
  60298: (e, t, i) => {
    var a = i(309),
      d = i(34541),
      l = i(47838),
      n = i(5095),
      s = i(95260),
      o = i(18394),
      c = i(86089),
      r = i(72218),
      u = i(56112);
    i(90532), i(71133);
    const h = "__NONE_OPTION__";
    (0, a.Z)(
      [(0, s.Mo)("ha-tts-voice-picker")],
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
              decorators: [(0, s.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "engineId",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "language",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean, reflect: !0 })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_voices",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.IO)("ha-select")],
              key: "_select",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                if (!this._voices) return n.Ld;
                const i =
                  null !== (e = this.value) && void 0 !== e
                    ? e
                    : this.required
                    ? null === (t = this._voices[0]) || void 0 === t
                      ? void 0
                      : t.voice_id
                    : h;
                return n.dy` <ha-select .label="${
                  this.label ||
                  this.hass.localize("ui.components.tts-voice-picker.voice")
                }" .value="${i}" .required="${this.required}" .disabled="${
                  this.disabled
                }" @selected="${this._changed}" @closed="${
                  c.U
                }" fixedMenuPosition naturalMenuWidth> ${
                  this.required
                    ? n.Ld
                    : n.dy`<ha-list-item .value="${h}"> ${this.hass.localize(
                        "ui.components.tts-voice-picker.none"
                      )} </ha-list-item>`
                } ${this._voices.map(
                  (e) =>
                    n.dy`<ha-list-item .value="${e.voice_id}"> ${e.name} </ha-list-item>`
                )} </ha-select> `;
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, d.Z)((0, l.Z)(i.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  this.hasUpdated
                    ? (e.has("language") || e.has("engineId")) &&
                      this._debouncedUpdateVoices()
                    : this._updateVoices();
              },
            },
            {
              kind: "field",
              key: "_debouncedUpdateVoices",
              value() {
                return (0, r.D)(() => this._updateVoices(), 500);
              },
            },
            {
              kind: "method",
              key: "_updateVoices",
              value: async function () {
                this.engineId && this.language
                  ? ((this._voices = (
                      await (0, u.MV)(this.hass, this.engineId, this.language)
                    ).voices),
                    this.value &&
                      ((this._voices &&
                        this._voices.find((e) => e.voice_id === this.value)) ||
                        ((this.value = void 0),
                        (0, o.B)(this, "value-changed", {
                          value: this.value,
                        }))))
                  : (this._voices = void 0);
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                var t, a, n;
                ((0, d.Z)((0, l.Z)(i.prototype), "updated", this).call(this, e),
                e.has("_voices") &&
                  (null === (t = this._select) || void 0 === t
                    ? void 0
                    : t.value) !== this.value) &&
                  (null === (a = this._select) ||
                    void 0 === a ||
                    a.layoutOptions(),
                  (0, o.B)(this, "value-changed", {
                    value:
                      null === (n = this._select) || void 0 === n
                        ? void 0
                        : n.value,
                  }));
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return n.iv`ha-select{width:100%}`;
              },
            },
            {
              kind: "method",
              key: "_changed",
              value: function (e) {
                const t = e.target;
                !this.hass ||
                  "" === t.value ||
                  t.value === this.value ||
                  (void 0 === this.value && t.value === h) ||
                  ((this.value = t.value === h ? void 0 : t.value),
                  (0, o.B)(this, "value-changed", { value: this.value }));
              },
            },
          ],
        };
      },
      n.oi
    );
  },
  56112: (e, t, i) => {
    i.d(t, { MV: () => o, Wg: () => n, Xk: () => l, b_: () => d, yP: () => s });
    const a = "media-source://tts/",
      d = (e) => e.startsWith(a),
      l = (e) => e.substring(19),
      n = (e, t, i) =>
        e.callWS({ type: "tts/engine/list", language: t, country: i }),
      s = (e, t) => e.callWS({ type: "tts/engine/get", engine_id: t }),
      o = (e, t, i) =>
        e.callWS({ type: "tts/engine/voices", engine_id: t, language: i });
  },
};
//# sourceMappingURL=1666.lvP3lKpui2I.js.map
