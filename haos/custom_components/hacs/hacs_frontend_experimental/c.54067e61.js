import {
  _ as e,
  eO as t,
  e as o,
  t as i,
  E as r,
  G as d,
  a5 as a,
  O as s,
  d as n,
  n as l,
} from "./main-85e087f9.js";
let h;
const c = { key: "Mod-s", run: (e) => (s(e.dom, "editor-save"), !0) },
  u = (e) => {
    const t = document.createElement("ha-icon");
    return (t.icon = e.label), t;
  };
e(
  [l("ha-code-editor")],
  function (e, t) {
    class l extends t {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: l,
      d: [
        { kind: "field", key: "codemirror", value: void 0 },
        { kind: "field", decorators: [o()], key: "mode", value: () => "yaml" },
        { kind: "field", key: "hass", value: void 0 },
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "autofocus",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [o({ type: Boolean })],
          key: "readOnly",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [
            o({ type: Boolean, attribute: "autocomplete-entities" }),
          ],
          key: "autocompleteEntities",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [o({ type: Boolean, attribute: "autocomplete-icons" })],
          key: "autocompleteIcons",
          value: () => !1,
        },
        { kind: "field", decorators: [o()], key: "error", value: () => !1 },
        { kind: "field", decorators: [i()], key: "_value", value: () => "" },
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
            const e = this._loadedCodeMirror.HighlightStyle.get(
              this.codemirror.state,
              this._loadedCodeMirror.tags.comment
            );
            return !!this.shadowRoot.querySelector(`span.${e}`);
          },
        },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            r(d(l.prototype), "connectedCallback", this).call(this),
              this.codemirror &&
                !1 !== this.autofocus &&
                this.codemirror.focus();
          },
        },
        {
          kind: "method",
          key: "update",
          value: function (e) {
            r(d(l.prototype), "update", this).call(this, e),
              this.codemirror &&
                (e.has("mode") &&
                  this.codemirror.dispatch({
                    effects: this._loadedCodeMirror.langCompartment.reconfigure(
                      this._mode
                    ),
                  }),
                e.has("readOnly") &&
                  this.codemirror.dispatch({
                    effects:
                      this._loadedCodeMirror.readonlyCompartment.reconfigure(
                        this._loadedCodeMirror.EditorView.editable.of(
                          !this.readOnly
                        )
                      ),
                  }),
                e.has("_value") &&
                  this._value !== this.value &&
                  this.codemirror.dispatch({
                    changes: {
                      from: 0,
                      to: this.codemirror.state.doc.length,
                      insert: this._value,
                    },
                  }),
                e.has("error") &&
                  this.classList.toggle("error-state", this.error));
          },
        },
        {
          kind: "method",
          key: "firstUpdated",
          value: function (e) {
            r(d(l.prototype), "firstUpdated", this).call(this, e),
              this._blockKeyboardShortcuts(),
              this._load();
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
          key: "_load",
          value: async function () {
            this._loadedCodeMirror = await (async () => (
              h || (h = import("./c.10c7d0ce.js")), h
            ))();
            const e = [
              this._loadedCodeMirror.lineNumbers(),
              this._loadedCodeMirror.EditorState.allowMultipleSelections.of(!0),
              this._loadedCodeMirror.history(),
              this._loadedCodeMirror.highlightSelectionMatches(),
              this._loadedCodeMirror.highlightActiveLine(),
              this._loadedCodeMirror.drawSelection(),
              this._loadedCodeMirror.rectangularSelection(),
              this._loadedCodeMirror.keymap.of([
                ...this._loadedCodeMirror.defaultKeymap,
                ...this._loadedCodeMirror.searchKeymap,
                ...this._loadedCodeMirror.historyKeymap,
                ...this._loadedCodeMirror.tabKeyBindings,
                c,
              ]),
              this._loadedCodeMirror.langCompartment.of(this._mode),
              this._loadedCodeMirror.theme,
              this._loadedCodeMirror.Prec.fallback(
                this._loadedCodeMirror.highlightStyle
              ),
              this._loadedCodeMirror.readonlyCompartment.of(
                this._loadedCodeMirror.EditorView.editable.of(!this.readOnly)
              ),
              this._loadedCodeMirror.EditorView.updateListener.of((e) =>
                this._onUpdate(e)
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
              root: this.shadowRoot,
              parent: this.shadowRoot,
            });
          },
        },
        {
          kind: "field",
          key: "_getStates",
          value: () =>
            a((e) => {
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
              ? { from: Number(t.from), options: o, span: /^[a-z_]{3,}\.\w*$/ }
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
            return { from: Number(t.from), options: o, span: /^mdi:\S*$/ };
          },
        },
        {
          kind: "method",
          key: "_blockKeyboardShortcuts",
          value: function () {
            this.addEventListener("keydown", (e) => e.stopPropagation());
          },
        },
        {
          kind: "method",
          key: "_onUpdate",
          value: function (e) {
            if (!e.docChanged) return;
            const t = this.value;
            t !== this._value &&
              ((this._value = t),
              s(this, "value-changed", { value: this._value }));
          },
        },
        {
          kind: "get",
          static: !0,
          key: "styles",
          value: function () {
            return n`
      :host(.error-state) .cm-gutters {
        border-color: var(--error-state-color, red);
      }
    `;
          },
        },
      ],
    };
  },
  t
);
