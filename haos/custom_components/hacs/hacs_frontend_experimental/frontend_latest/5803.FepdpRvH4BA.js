export const id = 5803;
export const ids = [5803];
export const modules = {
  86089: (e, t, n) => {
    n.d(t, { U: () => i });
    const i = (e) => e.stopPropagation();
  },
  71133: (e, t, n) => {
    var i = n(309),
      o = n(34541),
      a = n(47838),
      l = n(49412),
      s = n(3762),
      d = n(5095),
      r = n(95260),
      c = n(72218),
      p = n(2537);
    n(54371);
    (0, i.Z)(
      [(0, r.Mo)("ha-select")],
      function (e, t) {
        class n extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: n,
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
                return d.dy` ${(0, o.Z)(
                  (0, a.Z)(n.prototype),
                  "render",
                  this
                ).call(this)} ${
                  this.clearable &&
                  !this.required &&
                  !this.disabled &&
                  this.value
                    ? d.dy`<ha-icon-button label="clear" @click="${
                        this._clearValue
                      }" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}"></ha-icon-button>`
                    : d.Ld
                } `;
              },
            },
            {
              kind: "method",
              key: "renderLeadingIcon",
              value: function () {
                return this.icon
                  ? d.dy`<span class="mdc-select__icon"><slot name="icon"></slot></span>`
                  : d.Ld;
              },
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, o.Z)((0, a.Z)(n.prototype), "connectedCallback", this).call(
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
                (0, o.Z)(
                  (0, a.Z)(n.prototype),
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
                  await (0, p.y)(), this.layoutOptions();
                }, 500);
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                s.W,
                d.iv`:host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      l.K
    );
  },
  65803: (e, t, n) => {
    n.r(t), n.d(t, { HaConversationAgentSelector: () => y });
    var i = n(309),
      o = n(5095),
      a = n(95260),
      l = n(34541),
      s = n(47838),
      d = n(18394),
      r = n(86089),
      c = n(72218),
      p = n(60470);
    var h = n(64346);
    const u = (e, t) => {
        var n;
        return e.callApi("POST", "config/config_entries/options/flow", {
          handler: t,
          show_advanced_options: Boolean(
            null === (n = e.userData) || void 0 === n ? void 0 : n.showAdvanced
          ),
        });
      },
      v = (e, t) => e.callApi("GET", `config/config_entries/options/flow/${t}`),
      g = (e, t, n) =>
        e.callApi("POST", `config/config_entries/options/flow/${t}`, n),
      m = (e, t) =>
        e.callApi("DELETE", `config/config_entries/options/flow/${t}`);
    var k = n(46739);
    n(90532), n(71133);
    const f = "__NONE_OPTION__";
    (0, i.Z)(
      [(0, a.Mo)("ha-conversation-agent-picker")],
      function (e, t) {
        class n extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: n,
          d: [
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "language",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean, reflect: !0 })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.SB)()],
              key: "_agents",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.SB)()],
              key: "_configEntry",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t, n;
                if (!this._agents) return o.Ld;
                const i =
                  null !== (e = this.value) && void 0 !== e
                    ? e
                    : this.required &&
                      (!this.language ||
                        (null !==
                          (t = this._agents.find(
                            (e) => "homeassistant" === e.id
                          )) &&
                          void 0 !== t &&
                          t.supported_languages.includes(this.language)))
                    ? "homeassistant"
                    : f;
                return o.dy` <ha-select .label="${
                  this.label ||
                  this.hass.localize(
                    "ui.components.coversation-agent-picker.conversation_agent"
                  )
                }" .value="${i}" .required="${this.required}" .disabled="${
                  this.disabled
                }" @selected="${this._changed}" @closed="${
                  r.U
                }" fixedMenuPosition naturalMenuWidth> ${
                  this.required
                    ? o.Ld
                    : o.dy`<ha-list-item .value="${f}"> ${this.hass.localize(
                        "ui.components.coversation-agent-picker.none"
                      )} </ha-list-item>`
                } ${this._agents.map(
                  (e) =>
                    o.dy`<ha-list-item .value="${e.id}" .disabled="${
                      "*" !== e.supported_languages &&
                      0 === e.supported_languages.length
                    }"> ${e.name} </ha-list-item>`
                )}</ha-select>${
                  null !== (n = this._configEntry) &&
                  void 0 !== n &&
                  n.supports_options
                    ? o.dy`<ha-icon-button .path="${"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"}" @click="${
                        this._openOptionsFlow
                      }"></ha-icon-button>`
                    : ""
                } `;
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, l.Z)((0, s.Z)(n.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  this.hasUpdated
                    ? e.has("language") && this._debouncedUpdateAgents()
                    : this._updateAgents(),
                  e.has("value") && this._maybeFetchConfigEntry();
              },
            },
            {
              kind: "method",
              key: "_maybeFetchConfigEntry",
              value: async function () {
                if (this.value && "homeassistant" !== this.value)
                  try {
                    this._configEntry = (
                      await (0, p.RQ)(this.hass, this.value)
                    ).config_entry;
                  } catch (e) {
                    this._configEntry = void 0;
                  }
                else this._configEntry = void 0;
              },
            },
            {
              kind: "field",
              key: "_debouncedUpdateAgents",
              value() {
                return (0, c.D)(() => this._updateAgents(), 500);
              },
            },
            {
              kind: "method",
              key: "_updateAgents",
              value: async function () {
                const { agents: e } = await ((t = this.hass),
                (n = this.language),
                (i = this.hass.config.country || void 0),
                t.callWS({
                  type: "conversation/agent/list",
                  language: n,
                  country: i,
                }));
                var t, n, i;
                if (((this._agents = e), !this.value)) return;
                const o = e.find((e) => e.id === this.value);
                (0, d.B)(this, "supported-languages-changed", {
                  value: null == o ? void 0 : o.supported_languages,
                }),
                  (!o ||
                    ("*" !== o.supported_languages &&
                      0 === o.supported_languages.length)) &&
                    ((this.value = void 0),
                    (0, d.B)(this, "value-changed", { value: this.value }));
              },
            },
            {
              kind: "method",
              key: "_openOptionsFlow",
              value: async function () {
                var e, t, n;
                this._configEntry &&
                  ((e = this),
                  (t = this._configEntry),
                  (n = {
                    manifest: await (0, h.t4)(
                      this.hass,
                      this._configEntry.domain
                    ),
                  }),
                  (0, k.w)(
                    e,
                    { startFlowHandler: t.entry_id, domain: t.domain, ...n },
                    {
                      flowType: "options_flow",
                      loadDevicesAndAreas: !1,
                      createFlow: async (e, n) => {
                        const [i] = await Promise.all([
                          u(e, n),
                          e.loadFragmentTranslation("config"),
                          e.loadBackendTranslation("options", t.domain),
                          e.loadBackendTranslation("selector", t.domain),
                        ]);
                        return i;
                      },
                      fetchFlow: async (e, n) => {
                        const [i] = await Promise.all([
                          v(e, n),
                          e.loadFragmentTranslation("config"),
                          e.loadBackendTranslation("options", t.domain),
                          e.loadBackendTranslation("selector", t.domain),
                        ]);
                        return i;
                      },
                      handleFlowStep: g,
                      deleteFlow: m,
                      renderAbortDescription(e, n) {
                        const i = e.localize(
                          `component.${t.domain}.options.abort.${n.reason}`,
                          n.description_placeholders
                        );
                        return i
                          ? o.dy` <ha-markdown breaks allowsvg .content="${i}"></ha-markdown> `
                          : "";
                      },
                      renderShowFormStepHeader: (e, n) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.title`,
                          n.description_placeholders
                        ) || e.localize("ui.dialogs.options_flow.form.header"),
                      renderShowFormStepDescription(e, n) {
                        const i = e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.description`,
                          n.description_placeholders
                        );
                        return i
                          ? o.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
                          : "";
                      },
                      renderShowFormStepFieldLabel: (e, n, i) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.data.${i.name}`
                        ),
                      renderShowFormStepFieldHelper(e, n, i) {
                        const a = e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.data_description.${i.name}`,
                          n.description_placeholders
                        );
                        return a
                          ? o.dy`<ha-markdown breaks .content="${a}"></ha-markdown>`
                          : "";
                      },
                      renderShowFormStepFieldError: (e, n, i) =>
                        e.localize(
                          `component.${t.domain}.options.error.${i}`,
                          n.description_placeholders
                        ) || i,
                      renderShowFormStepFieldLocalizeValue: (e, n, i) =>
                        e.localize(`component.${t.domain}.selector.${i}`),
                      renderShowFormStepSubmitButton: (e, n) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.submit`
                        ) ||
                        e.localize(
                          "ui.panel.config.integrations.config_flow." +
                            (!1 === n.last_step ? "next" : "submit")
                        ),
                      renderExternalStepHeader: (e, t) => "",
                      renderExternalStepDescription: (e, t) => "",
                      renderCreateEntryDescription: (e, t) =>
                        o.dy` <p>${e.localize(
                          "ui.dialogs.options_flow.success.description"
                        )}</p> `,
                      renderShowFormProgressHeader: (e, n) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.title`
                        ) || e.localize(`component.${t.domain}.title`),
                      renderShowFormProgressDescription(e, n) {
                        const i = e.localize(
                          `component.${t.domain}.options.progress.${n.progress_action}`,
                          n.description_placeholders
                        );
                        return i
                          ? o.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
                          : "";
                      },
                      renderMenuHeader: (e, n) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.title`
                        ) || e.localize(`component.${t.domain}.title`),
                      renderMenuDescription(e, n) {
                        const i = e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.description`,
                          n.description_placeholders
                        );
                        return i
                          ? o.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
                          : "";
                      },
                      renderMenuOption: (e, n, i) =>
                        e.localize(
                          `component.${t.domain}.options.step.${n.step_id}.menu_options.${i}`,
                          n.description_placeholders
                        ),
                      renderLoadingDescription: (e, n) =>
                        e.localize(`component.${t.domain}.options.loading`) ||
                        ("loading_flow" === n || "loading_step" === n
                          ? e.localize(`ui.dialogs.options_flow.loading.${n}`, {
                              integration: (0, h.Lh)(e.localize, t.domain),
                            })
                          : ""),
                    }
                  ));
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`:host{display:flex;align-items:center}ha-select{width:100%}ha-icon-button{color:var(--secondary-text-color)}`;
              },
            },
            {
              kind: "method",
              key: "_changed",
              value: function (e) {
                var t;
                const n = e.target;
                !this.hass ||
                  "" === n.value ||
                  n.value === this.value ||
                  (void 0 === this.value && n.value === f) ||
                  ((this.value = n.value === f ? void 0 : n.value),
                  (0, d.B)(this, "value-changed", { value: this.value }),
                  (0, d.B)(this, "supported-languages-changed", {
                    value:
                      null ===
                        (t = this._agents.find((e) => e.id === this.value)) ||
                      void 0 === t
                        ? void 0
                        : t.supported_languages,
                  }));
              },
            },
          ],
        };
      },
      o.oi
    );
    let y = (0, i.Z)(
      [(0, a.Mo)("ha-selector-conversation_agent")],
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
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "value",
              value: void 0,
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
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "context",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                return o.dy`<ha-conversation-agent-picker .hass="${
                  this.hass
                }" .value="${this.value}" .language="${
                  (null === (e = this.selector.conversation_agent) ||
                  void 0 === e
                    ? void 0
                    : e.language) ||
                  (null === (t = this.context) || void 0 === t
                    ? void 0
                    : t.language)
                }" .label="${this.label}" .helper="${this.helper}" .disabled="${
                  this.disabled
                }" .required="${
                  this.required
                }"></ha-conversation-agent-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => o.iv`ha-conversation-agent-picker{width:100%}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  64346: (e, t, n) => {
    n.d(t, { F3: () => o, Lh: () => i, t4: () => a });
    const i = (e, t, n) =>
        e(`component.${t}.title`) || (null == n ? void 0 : n.name) || t,
      o = (e, t) => {
        const n = { type: "manifest/list" };
        return t && (n.integrations = t), e.callWS(n);
      },
      a = (e, t) => e.callWS({ type: "manifest/get", integration: t });
  },
  46739: (e, t, n) => {
    n.d(t, { w: () => a });
    var i = n(18394);
    const o = () =>
        Promise.all([
          n.e(2850),
          n.e(303),
          n.e(6023),
          n.e(8597),
          n.e(6591),
          n.e(1913),
          n.e(1675),
        ]).then(n.bind(n, 61675)),
      a = (e, t, n) => {
        (0, i.B)(e, "show-dialog", {
          dialogTag: "dialog-data-entry-flow",
          dialogImport: o,
          dialogParams: { ...t, flowConfig: n, dialogParentElement: e },
        });
      };
  },
};
//# sourceMappingURL=5803.FepdpRvH4BA.js.map
