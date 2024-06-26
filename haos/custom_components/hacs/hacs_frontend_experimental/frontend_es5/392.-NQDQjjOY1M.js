"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [392],
  {
    26874: function (e, t, r) {
      r.d(t, {
        v: function () {
          return a;
        },
      });
      var o = r(99312),
        i = r(81043),
        a = (function () {
          var e = (0, i.Z)(
            (0, o.Z)().mark(function e(t) {
              var r;
              return (0, o.Z)().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (!navigator.clipboard) {
                          e.next = 9;
                          break;
                        }
                        return (
                          (e.prev = 1),
                          (e.next = 4),
                          navigator.clipboard.writeText(t)
                        );
                      case 4:
                        return e.abrupt("return");
                      case 7:
                        (e.prev = 7), (e.t0 = e.catch(1));
                      case 9:
                        ((r = document.createElement("textarea")).value = t),
                          document.body.appendChild(r),
                          r.select(),
                          document.execCommand("copy"),
                          document.body.removeChild(r);
                      case 15:
                      case "end":
                        return e.stop();
                    }
                },
                e,
                null,
                [[1, 7]]
              );
            })
          );
          return function (t) {
            return e.apply(this, arguments);
          };
        })();
    },
    25799: function (e, t, r) {
      var o,
        i = r(88962),
        a = r(46097),
        n = r(99312),
        d = r(81043),
        s = r(33368),
        l = r(71650),
        u = r(68308),
        c = r(82390),
        h = r(69205),
        f = r(91808),
        p = r(34541),
        v = r(47838),
        m =
          (r(97393),
          r(46798),
          r(94570),
          r(51358),
          r(47084),
          r(5239),
          r(98490),
          r(36513),
          r(51467),
          r(46349),
          r(70320),
          r(65974),
          r(76843),
          r(22859),
          r(91989),
          r(5095)),
        y = r(95260),
        k = r(14516),
        _ = r(18394),
        C = r(86089),
        b = {
          key: "Mod-s",
          run: function (e) {
            return (0, _.B)(e.dom, "editor-save"), !0;
          },
        },
        g = function (e) {
          var t = document.createElement("ha-icon");
          return (t.icon = e.label), t;
        };
      (0, f.Z)(
        [(0, y.Mo)("ha-code-editor")],
        function (e, t) {
          var f,
            Z,
            M = (function (t) {
              function r() {
                var t;
                (0, l.Z)(this, r);
                for (
                  var o = arguments.length, i = new Array(o), a = 0;
                  a < o;
                  a++
                )
                  i[a] = arguments[a];
                return (t = (0, u.Z)(this, r, [].concat(i))), e((0, c.Z)(t)), t;
              }
              return (0, h.Z)(r, t), (0, s.Z)(r);
            })(t);
          return {
            F: M,
            d: [
              { kind: "field", key: "codemirror", value: void 0 },
              {
                kind: "field",
                decorators: [(0, y.Cb)()],
                key: "mode",
                value: function () {
                  return "yaml";
                },
              },
              { kind: "field", key: "hass", value: void 0 },
              {
                kind: "field",
                decorators: [(0, y.Cb)({ type: Boolean })],
                key: "autofocus",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.Cb)({ type: Boolean })],
                key: "readOnly",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, y.Cb)({
                    type: Boolean,
                    attribute: "autocomplete-entities",
                  }),
                ],
                key: "autocompleteEntities",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, y.Cb)({ type: Boolean, attribute: "autocomplete-icons" }),
                ],
                key: "autocompleteIcons",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.Cb)({ type: Boolean })],
                key: "error",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, y.SB)()],
                key: "_value",
                value: function () {
                  return "";
                },
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
                  var e = this._loadedCodeMirror.highlightingFor(
                    this.codemirror.state,
                    [this._loadedCodeMirror.tags.comment]
                  );
                  return !!this.renderRoot.querySelector("span.".concat(e));
                },
              },
              {
                kind: "method",
                key: "connectedCallback",
                value: function () {
                  (0, p.Z)(
                    (0, v.Z)(M.prototype),
                    "connectedCallback",
                    this
                  ).call(this),
                    this.hasUpdated && this.requestUpdate(),
                    this.addEventListener("keydown", C.U),
                    this.codemirror &&
                      !1 !== this.autofocus &&
                      this.codemirror.focus();
                },
              },
              {
                kind: "method",
                key: "disconnectedCallback",
                value: function () {
                  var e = this;
                  (0, p.Z)(
                    (0, v.Z)(M.prototype),
                    "disconnectedCallback",
                    this
                  ).call(this),
                    this.removeEventListener("keydown", C.U),
                    this.updateComplete.then(function () {
                      e.codemirror.destroy(), delete e.codemirror;
                    });
                },
              },
              {
                kind: "method",
                key: "scheduleUpdate",
                value:
                  ((Z = (0, d.Z)(
                    (0, n.Z)().mark(function e() {
                      var t;
                      return (0, n.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (
                                  null === (t = this._loadedCodeMirror) ||
                                  void 0 === t
                                ) {
                                  e.next = 4;
                                  break;
                                }
                                e.next = 7;
                                break;
                              case 4:
                                return (
                                  (e.next = 6),
                                  Promise.all([
                                    r.e(2771),
                                    r.e(2562),
                                    r.e(9146),
                                  ]).then(r.bind(r, 59146))
                                );
                              case 6:
                                this._loadedCodeMirror = e.sent;
                              case 7:
                                (0, p.Z)(
                                  (0, v.Z)(M.prototype),
                                  "scheduleUpdate",
                                  this
                                ).call(this);
                              case 8:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return Z.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "update",
                value: function (e) {
                  if (
                    ((0, p.Z)((0, v.Z)(M.prototype), "update", this).call(
                      this,
                      e
                    ),
                    this.codemirror)
                  ) {
                    var t,
                      r = [];
                    if (
                      (e.has("mode") &&
                        r.push({
                          effects:
                            this._loadedCodeMirror.langCompartment.reconfigure(
                              this._mode
                            ),
                        }),
                      e.has("readOnly") &&
                        r.push({
                          effects:
                            this._loadedCodeMirror.readonlyCompartment.reconfigure(
                              this._loadedCodeMirror.EditorView.editable.of(
                                !this.readOnly
                              )
                            ),
                        }),
                      e.has("_value") &&
                        this._value !== this.value &&
                        r.push({
                          changes: {
                            from: 0,
                            to: this.codemirror.state.doc.length,
                            insert: this._value,
                          },
                        }),
                      r.length > 0)
                    )
                      (t = this.codemirror).dispatch.apply(t, r);
                    e.has("error") &&
                      this.classList.toggle("error-state", this.error);
                  } else this._createCodeMirror();
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
                  var e = [
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
                    this._loadedCodeMirror.keymap.of(
                      [].concat(
                        (0, a.Z)(this._loadedCodeMirror.defaultKeymap),
                        (0, a.Z)(this._loadedCodeMirror.searchKeymap),
                        (0, a.Z)(this._loadedCodeMirror.historyKeymap),
                        (0, a.Z)(this._loadedCodeMirror.tabKeyBindings),
                        [b]
                      )
                    ),
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
                    var t = [];
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
                value: function () {
                  return (0, k.Z)(function (e) {
                    return e
                      ? Object.keys(e).map(function (t) {
                          return {
                            type: "variable",
                            label: t,
                            detail: e[t].attributes.friendly_name,
                            info: "State: ".concat(e[t].state),
                          };
                        })
                      : [];
                  });
                },
              },
              {
                kind: "method",
                key: "_entityCompletions",
                value: function (e) {
                  var t = e.matchBefore(/[a-z_]{3,}\.\w*/);
                  if (!t || (t.from === t.to && !e.explicit)) return null;
                  var r = this._getStates(this.hass.states);
                  return r && r.length
                    ? {
                        from: Number(t.from),
                        options: r,
                        validFor: /^[a-z_]{3,}\.\w*$/,
                      }
                    : null;
                },
              },
              {
                kind: "field",
                key: "_getIconItems",
                value: function () {
                  var e = this;
                  return (0, d.Z)(
                    (0, n.Z)().mark(function t() {
                      var o;
                      return (0, n.Z)().wrap(function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (e._iconList) {
                                t.next = 9;
                                break;
                              }
                              0, (o = []), (t.next = 8);
                              break;
                            case 5:
                              return (
                                (t.next = 7),
                                r.e(3893).then(r.t.bind(r, 63893, 19))
                              );
                            case 7:
                              o = t.sent.default;
                            case 8:
                              e._iconList = o.map(function (e) {
                                return {
                                  type: "variable",
                                  label: "mdi:".concat(e.name),
                                  detail: e.keywords.join(", "),
                                  info: g,
                                };
                              });
                            case 9:
                              return t.abrupt("return", e._iconList);
                            case 10:
                            case "end":
                              return t.stop();
                          }
                      }, t);
                    })
                  );
                },
              },
              {
                kind: "method",
                key: "_mdiCompletions",
                value:
                  ((f = (0, d.Z)(
                    (0, n.Z)().mark(function e(t) {
                      var r, o;
                      return (0, n.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (
                                  (r = t.matchBefore(/mdi:\S*/)) &&
                                  (r.from !== r.to || t.explicit)
                                ) {
                                  e.next = 3;
                                  break;
                                }
                                return e.abrupt("return", null);
                              case 3:
                                return (e.next = 5), this._getIconItems();
                              case 5:
                                return (
                                  (o = e.sent),
                                  e.abrupt("return", {
                                    from: Number(r.from),
                                    options: o,
                                    validFor: /^mdi:\S*$/,
                                  })
                                );
                              case 7:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function (e) {
                    return f.apply(this, arguments);
                  }),
              },
              {
                kind: "field",
                key: "_onUpdate",
                value: function () {
                  var e = this;
                  return function (t) {
                    t.docChanged &&
                      ((e._value = t.state.doc.toString()),
                      (0, _.B)(e, "value-changed", { value: e._value }));
                  };
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, m.iv)(
                    o ||
                      (o = (0, i.Z)([
                        ":host(.error-state) .cm-gutters{border-color:var(--error-state-color,red)}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        m.fl
      );
    },
    80392: function (e, t, r) {
      var o,
        i,
        a,
        n,
        d = r(99312),
        s = r(81043),
        l = r(88962),
        u = r(33368),
        c = r(71650),
        h = r(68308),
        f = r(82390),
        p = r(69205),
        v = r(91808),
        m = r(34541),
        y = r(47838),
        k = r(76775),
        _ = (r(97393), r(77426)),
        C = r(5095),
        b = r(95260),
        g = r(18394),
        Z = r(29950),
        M = (r(25799), r(33849)),
        w = r(26874);
      (0, v.Z)(
        [(0, b.Mo)("ha-yaml-editor")],
        function (e, t) {
          var r,
            v = (function (t) {
              function r() {
                var t;
                (0, c.Z)(this, r);
                for (
                  var o = arguments.length, i = new Array(o), a = 0;
                  a < o;
                  a++
                )
                  i[a] = arguments[a];
                return (t = (0, h.Z)(this, r, [].concat(i))), e((0, f.Z)(t)), t;
              }
              return (0, p.Z)(r, t), (0, u.Z)(r);
            })(t);
          return {
            F: v,
            d: [
              {
                kind: "field",
                decorators: [(0, b.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)()],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ attribute: !1 })],
                key: "yamlSchema",
                value: function () {
                  return _.oW;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)()],
                key: "defaultValue",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ type: Boolean })],
                key: "isValid",
                value: function () {
                  return !0;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)()],
                key: "label",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ type: Boolean })],
                key: "autoUpdate",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ type: Boolean })],
                key: "readOnly",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ type: Boolean })],
                key: "required",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.Cb)({ type: Boolean })],
                key: "copyClipboard",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, b.SB)()],
                key: "_yaml",
                value: function () {
                  return "";
                },
              },
              {
                kind: "method",
                key: "setValue",
                value: function (e) {
                  try {
                    this._yaml =
                      e &&
                      !(function (e) {
                        if ("object" !== (0, k.Z)(e)) return !1;
                        for (var t in e)
                          if (Object.prototype.hasOwnProperty.call(e, t))
                            return !1;
                        return !0;
                      })(e)
                        ? (0, _.$w)(e, {
                            schema: this.yamlSchema,
                            quotingType: '"',
                            noRefs: !0,
                          })
                        : "";
                  } catch (t) {
                    console.error(t, e),
                      alert(
                        "There was an error converting to YAML: ".concat(t)
                      );
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
                  (0, m.Z)((0, y.Z)(v.prototype), "willUpdate", this).call(
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
                    ? C.Ld
                    : (0, C.dy)(
                        o ||
                          (o = (0, l.Z)([
                            " ",
                            ' <ha-code-editor .hass="',
                            '" .value="',
                            '" .readOnly="',
                            '" mode="yaml" autocomplete-entities autocomplete-icons .error="',
                            '" @value-changed="',
                            '" dir="ltr"></ha-code-editor> ',
                            " ",
                          ])),
                        this.label
                          ? (0, C.dy)(
                              i || (i = (0, l.Z)(["<p>", "", "</p>"])),
                              this.label,
                              this.required ? " *" : ""
                            )
                          : "",
                        this.hass,
                        this._yaml,
                        this.readOnly,
                        !1 === this.isValid,
                        this._onChange,
                        this.copyClipboard
                          ? (0, C.dy)(
                              a ||
                                (a = (0, l.Z)([
                                  '<div class="card-actions"> <mwc-button @click="',
                                  '"> ',
                                  " </mwc-button> </div>",
                                ])),
                              this._copyYaml,
                              this.hass.localize(
                                "ui.components.yaml-editor.copy_to_clipboard"
                              )
                            )
                          : C.Ld
                      );
                },
              },
              {
                kind: "method",
                key: "_onChange",
                value: function (e) {
                  var t;
                  e.stopPropagation(), (this._yaml = e.detail.value);
                  var r = !0;
                  if (this._yaml)
                    try {
                      t = (0, _.zD)(this._yaml, { schema: this.yamlSchema });
                    } catch (o) {
                      r = !1;
                    }
                  else t = {};
                  (this.value = t),
                    (this.isValid = r),
                    (0, g.B)(this, "value-changed", { value: t, isValid: r });
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
                value:
                  ((r = (0, s.Z)(
                    (0, d.Z)().mark(function e() {
                      return (0, d.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (!this.yaml) {
                                  e.next = 4;
                                  break;
                                }
                                return (e.next = 3), (0, w.v)(this.yaml);
                              case 3:
                                (0, M.C)(this, {
                                  message: this.hass.localize(
                                    "ui.common.copied_clipboard"
                                  ),
                                });
                              case 4:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return r.apply(this, arguments);
                  }),
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    Z.Qx,
                    (0, C.iv)(
                      n ||
                        (n = (0, l.Z)([
                          ".card-actions{border-radius:var(--actions-border-radius,0px 0px var(--ha-card-border-radius,12px) var(--ha-card-border-radius,12px));border:1px solid var(--divider-color);padding:5px 16px}ha-code-editor{flex-grow:1}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        C.oi
      );
    },
    33849: function (e, t, r) {
      r.d(t, {
        C: function () {
          return i;
        },
      });
      var o = r(18394),
        i = function (e, t) {
          return (0, o.B)(e, "hass-notification", t);
        };
    },
  },
]);
//# sourceMappingURL=392.-NQDQjjOY1M.js.map
