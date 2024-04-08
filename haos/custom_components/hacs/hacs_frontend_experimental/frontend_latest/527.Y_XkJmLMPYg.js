export const id = 527;
export const ids = [527];
export const modules = {
  86089: (e, t, o) => {
    o.d(t, { U: () => i });
    const i = (e) => e.stopPropagation();
  },
  26874: (e, t, o) => {
    o.d(t, { v: () => i });
    const i = async (e) => {
      if (navigator.clipboard)
        try {
          return void (await navigator.clipboard.writeText(e));
        } catch (e) {}
      const t = document.createElement("textarea");
      (t.value = e),
        document.body.appendChild(t),
        t.select(),
        document.execCommand("copy"),
        document.body.removeChild(t);
    };
  },
  25799: (e, t, o) => {
    var i = o(309),
      r = o(34541),
      a = o(47838),
      d = o(5095),
      l = o(95260),
      s = o(14516),
      n = o(18394),
      h = o(86089);
    const c = {
        key: "Mod-s",
        run: (e) => ((0, n.B)(e.dom, "editor-save"), !0),
      },
      u = (e) => {
        const t = document.createElement("ha-icon");
        return (t.icon = e.label), t;
      };
    (0, i.Z)(
      [(0, l.Mo)("ha-code-editor")],
      function (e, t) {
        class i extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: i,
          d: [
            { kind: "field", key: "codemirror", value: void 0 },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "mode",
              value: () => "yaml",
            },
            { kind: "field", key: "hass", value: void 0 },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "autofocus",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "readOnly",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, l.Cb)({
                  type: Boolean,
                  attribute: "autocomplete-entities",
                }),
              ],
              key: "autocompleteEntities",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, l.Cb)({ type: Boolean, attribute: "autocomplete-icons" }),
              ],
              key: "autocompleteIcons",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "error",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.SB)()],
              key: "_value",
              value: () => "",
            },
            { kind: "field", key: "_loadedCodeMirror", value: void 0 },
            { kind: "field", key: "_iconList", value: void 0 },
            {
              kind: "set",
              key: "value",
              value: function (e) {
                this._value = e;
              },
            },
            {
              kind: "get",
              key: "value",
              value: function () {
                return this.codemirror
                  ? this.codemirror.state.doc.toString()
                  : this._value;
              },
            },
            {
              kind: "get",
              key: "hasComments",
              value: function () {
                if (!this.codemirror || !this._loadedCodeMirror) return !1;
                const e = this._loadedCodeMirror.highlightingFor(
                  this.codemirror.state,
                  [this._loadedCodeMirror.tags.comment]
                );
                return !!this.renderRoot.querySelector(`span.${e}`);
              },
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, r.Z)((0, a.Z)(i.prototype), "connectedCallback", this).call(
                  this
                ),
                  this.hasUpdated && this.requestUpdate(),
                  this.addEventListener("keydown", h.U),
                  this.codemirror &&
                    !1 !== this.autofocus &&
                    this.codemirror.focus();
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, r.Z)(
                  (0, a.Z)(i.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  this.removeEventListener("keydown", h.U),
                  this.updateComplete.then(() => {
                    this.codemirror.destroy(), delete this.codemirror;
                  });
              },
            },
            {
              kind: "method",
              key: "scheduleUpdate",
              value: async function () {
                var e;
                (null !== (e = this._loadedCodeMirror) && void 0 !== e) ||
                  (this._loadedCodeMirror = await Promise.all([
                    o.e(2562),
                    o.e(9146),
                  ]).then(o.bind(o, 59146))),
                  (0, r.Z)((0, a.Z)(i.prototype), "scheduleUpdate", this).call(
                    this
                  );
              },
            },
            {
              kind: "method",
              key: "update",
              value: function (e) {
                if (
                  ((0, r.Z)((0, a.Z)(i.prototype), "update", this).call(
                    this,
                    e
                  ),
                  !this.codemirror)
                )
                  return void this._createCodeMirror();
                const t = [];
                e.has("mode") &&
                  t.push({
                    effects: this._loadedCodeMirror.langCompartment.reconfigure(
                      this._mode
                    ),
                  }),
                  e.has("readOnly") &&
                    t.push({
                      effects:
                        this._loadedCodeMirror.readonlyCompartment.reconfigure(
                          this._loadedCodeMirror.EditorView.editable.of(
                            !this.readOnly
                          )
                        ),
                    }),
                  e.has("_value") &&
                    this._value !== this.value &&
                    t.push({
                      changes: {
                        from: 0,
                        to: this.codemirror.state.doc.length,
                        insert: this._value,
                      },
                    }),
                  t.length > 0 && this.codemirror.dispatch(...t),
                  e.has("error") &&
                    this.classList.toggle("error-state", this.error);
              },
            },
            {
              kind: "get",
              key: "_mode",
              value: function () {
                return this._loadedCodeMirror.langs[this.mode];
              },
            },
            {
              kind: "method",
              key: "_createCodeMirror",
              value: function () {
                if (!this._loadedCodeMirror)
                  throw new Error(
                    "Cannot create editor before CodeMirror is loaded"
                  );
                const e = [
                  this._loadedCodeMirror.lineNumbers(),
                  this._loadedCodeMirror.history(),
                  this._loadedCodeMirror.drawSelection(),
                  this._loadedCodeMirror.EditorState.allowMultipleSelections.of(
                    !0
                  ),
                  this._loadedCodeMirror.rectangularSelection(),
                  this._loadedCodeMirror.crosshairCursor(),
                  this._loadedCodeMirror.highlightSelectionMatches(),
                  this._loadedCodeMirror.highlightActiveLine(),
                  this._loadedCodeMirror.keymap.of([
                    ...this._loadedCodeMirror.defaultKeymap,
                    ...this._loadedCodeMirror.searchKeymap,
                    ...this._loadedCodeMirror.historyKeymap,
                    ...this._loadedCodeMirror.tabKeyBindings,
                    c,
                  ]),
                  this._loadedCodeMirror.langCompartment.of(this._mode),
                  this._loadedCodeMirror.haTheme,
                  this._loadedCodeMirror.haSyntaxHighlighting,
                  this._loadedCodeMirror.readonlyCompartment.of(
                    this._loadedCodeMirror.EditorView.editable.of(
                      !this.readOnly
                    )
                  ),
                  this._loadedCodeMirror.EditorView.updateListener.of(
                    this._onUpdate
                  ),
                ];
                if (!this.readOnly) {
                  const t = [];
                  this.autocompleteEntities &&
                    this.hass &&
                    t.push(this._entityCompletions.bind(this)),
                    this.autocompleteIcons &&
                      t.push(this._mdiCompletions.bind(this)),
                    t.length > 0 &&
                      e.push(
                        this._loadedCodeMirror.autocompletion({
                          override: t,
                          maxRenderedOptions: 10,
                        })
                      );
                }
                this.codemirror = new this._loadedCodeMirror.EditorView({
                  state: this._loadedCodeMirror.EditorState.create({
                    doc: this._value,
                    extensions: e,
                  }),
                  parent: this.renderRoot,
                });
              },
            },
            {
              kind: "field",
              key: "_getStates",
              value: () =>
                (0, s.Z)((e) => {
                  if (!e) return [];
                  return Object.keys(e).map((t) => ({
                    type: "variable",
                    label: t,
                    detail: e[t].attributes.friendly_name,
                    info: `State: ${e[t].state}`,
                  }));
                }),
            },
            {
              kind: "method",
              key: "_entityCompletions",
              value: function (e) {
                const t = e.matchBefore(/[a-z_]{3,}\.\w*/);
                if (!t || (t.from === t.to && !e.explicit)) return null;
                const o = this._getStates(this.hass.states);
                return o && o.length
                  ? {
                      from: Number(t.from),
                      options: o,
                      validFor: /^[a-z_]{3,}\.\w*$/,
                    }
                  : null;
              },
            },
            {
              kind: "field",
              key: "_getIconItems",
              value() {
                return async () => {
                  if (!this._iconList) {
                    let e;
                    (e = []),
                      (this._iconList = e.map((e) => ({
                        type: "variable",
                        label: `mdi:${e.name}`,
                        detail: e.keywords.join(", "),
                        info: u,
                      })));
                  }
                  return this._iconList;
                };
              },
            },
            {
              kind: "method",
              key: "_mdiCompletions",
              value: async function (e) {
                const t = e.matchBefore(/mdi:\S*/);
                if (!t || (t.from === t.to && !e.explicit)) return null;
                const o = await this._getIconItems();
                return {
                  from: Number(t.from),
                  options: o,
                  validFor: /^mdi:\S*$/,
                };
              },
            },
            {
              kind: "field",
              key: "_onUpdate",
              value() {
                return (e) => {
                  e.docChanged &&
                    ((this._value = e.state.doc.toString()),
                    (0, n.B)(this, "value-changed", { value: this._value }));
                };
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return d.iv`:host(.error-state) .cm-gutters{border-color:var(--error-state-color,red)}`;
              },
            },
          ],
        };
      },
      d.fl
    );
  },
  7265: (e, t, o) => {
    var i = o(309),
      r = o(5095),
      a = o(95260);
    (0, i.Z)(
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
                return r.dy`<slot></slot>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                r.iv`:host{display:block;color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6));font-size:.75rem;padding-left:16px;padding-right:16px}`,
            },
          ],
        };
      },
      r.oi
    );
  },
  50527: (e, t, o) => {
    o.r(t), o.d(t, { HaObjectSelector: () => n });
    var i = o(309),
      r = o(34541),
      a = o(47838),
      d = o(5095),
      l = o(95260),
      s = o(18394);
    o(80392), o(7265);
    let n = (0, i.Z)(
      [(0, l.Mo)("ha-selector-object")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "hass",
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
              decorators: [(0, l.Cb)()],
              key: "placeholder",
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
              decorators: [(0, l.IO)("ha-yaml-editor", !0)],
              key: "_yamlEditor",
              value: void 0,
            },
            { kind: "field", key: "_valueChangedFromChild", value: () => !1 },
            {
              kind: "method",
              key: "render",
              value: function () {
                return d.dy`<ha-yaml-editor .hass="${this.hass}" .readonly="${
                  this.disabled
                }" .label="${this.label}" .required="${
                  this.required
                }" .placeholder="${this.placeholder}" .defaultValue="${
                  this.value
                }" @value-changed="${this._handleChange}"></ha-yaml-editor> ${
                  this.helper
                    ? d.dy`<ha-input-helper-text>${this.helper}</ha-input-helper-text>`
                    : ""
                } `;
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, r.Z)((0, a.Z)(o.prototype), "updated", this).call(this, e),
                  e.has("value") &&
                    !this._valueChangedFromChild &&
                    this._yamlEditor.setValue(this.value),
                  (this._valueChangedFromChild = !1);
              },
            },
            {
              kind: "method",
              key: "_handleChange",
              value: function (e) {
                this._valueChangedFromChild = !0;
                const t = e.target.value;
                e.target.isValid &&
                  this.value !== t &&
                  (0, s.B)(this, "value-changed", { value: t });
              },
            },
          ],
        };
      },
      d.oi
    );
  },
  80392: (e, t, o) => {
    var i = o(309),
      r = o(34541),
      a = o(47838),
      d = o(77426),
      l = o(5095),
      s = o(95260),
      n = o(18394),
      h = o(29950),
      c = (o(25799), o(33849)),
      u = o(26874);
    (0, i.Z)(
      [(0, s.Mo)("ha-yaml-editor")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "yamlSchema",
              value: () => d.oW,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "defaultValue",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "isValid",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "autoUpdate",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "readOnly",
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
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "copyClipboard",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_yaml",
              value: () => "",
            },
            {
              kind: "method",
              key: "setValue",
              value: function (e) {
                try {
                  this._yaml =
                    e &&
                    !((e) => {
                      if ("object" != typeof e) return !1;
                      for (const t in e)
                        if (Object.prototype.hasOwnProperty.call(e, t))
                          return !1;
                      return !0;
                    })(e)
                      ? (0, d.$w)(e, {
                          schema: this.yamlSchema,
                          quotingType: '"',
                          noRefs: !0,
                        })
                      : "";
                } catch (t) {
                  console.error(t, e),
                    alert(`There was an error converting to YAML: ${t}`);
                }
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                this.defaultValue && this.setValue(this.defaultValue);
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, r.Z)((0, a.Z)(o.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  this.autoUpdate &&
                    e.has("value") &&
                    this.setValue(this.value);
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return void 0 === this._yaml
                  ? l.Ld
                  : l.dy` ${
                      this.label
                        ? l.dy`<p>${this.label}${this.required ? " *" : ""}</p>`
                        : ""
                    } <ha-code-editor .hass="${this.hass}" .value="${
                      this._yaml
                    }" .readOnly="${
                      this.readOnly
                    }" mode="yaml" autocomplete-entities autocomplete-icons .error="${
                      !1 === this.isValid
                    }" @value-changed="${
                      this._onChange
                    }" dir="ltr"></ha-code-editor> ${
                      this.copyClipboard
                        ? l.dy`<div class="card-actions"> <mwc-button @click="${
                            this._copyYaml
                          }"> ${this.hass.localize(
                            "ui.components.yaml-editor.copy_to_clipboard"
                          )} </mwc-button> </div>`
                        : l.Ld
                    } `;
              },
            },
            {
              kind: "method",
              key: "_onChange",
              value: function (e) {
                let t;
                e.stopPropagation(), (this._yaml = e.detail.value);
                let o = !0;
                if (this._yaml)
                  try {
                    t = (0, d.zD)(this._yaml, { schema: this.yamlSchema });
                  } catch (e) {
                    o = !1;
                  }
                else t = {};
                (this.value = t),
                  (this.isValid = o),
                  (0, n.B)(this, "value-changed", { value: t, isValid: o });
              },
            },
            {
              kind: "get",
              key: "yaml",
              value: function () {
                return this._yaml;
              },
            },
            {
              kind: "method",
              key: "_copyYaml",
              value: async function () {
                this.yaml &&
                  (await (0, u.v)(this.yaml),
                  (0, c.C)(this, {
                    message: this.hass.localize("ui.common.copied_clipboard"),
                  }));
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  h.Qx,
                  l.iv`.card-actions{border-radius:var(--actions-border-radius,0px 0px var(--ha-card-border-radius,12px) var(--ha-card-border-radius,12px));border:1px solid var(--divider-color);padding:5px 16px}ha-code-editor{flex-grow:1}`,
                ];
              },
            },
          ],
        };
      },
      l.oi
    );
  },
  33849: (e, t, o) => {
    o.d(t, { C: () => r });
    var i = o(18394);
    const r = (e, t) => (0, i.B)(e, "hass-notification", t);
  },
};
//# sourceMappingURL=527.Y_XkJmLMPYg.js.map
