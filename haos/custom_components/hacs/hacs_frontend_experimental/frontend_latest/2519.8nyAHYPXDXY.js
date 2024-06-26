export const id = 2519;
export const ids = [2519];
export const modules = {
  61320: (e, t, o) => {
    var i = {
      "./ha-alert": [23860],
      "./ha-alert.ts": [23860],
      "./ha-icon": [87386, 7386],
      "./ha-icon-button": [54371],
      "./ha-icon-button-arrow-next": [77716, 6924],
      "./ha-icon-button-arrow-next.ts": [77716, 6924],
      "./ha-icon-button-arrow-prev": [33358],
      "./ha-icon-button-arrow-prev.ts": [33358],
      "./ha-icon-button-group": [7625, 7625],
      "./ha-icon-button-group.ts": [7625, 7625],
      "./ha-icon-button-next": [6765, 6765],
      "./ha-icon-button-next.ts": [6765, 6765],
      "./ha-icon-button-prev": [49233, 9233],
      "./ha-icon-button-prev.ts": [49233, 9233],
      "./ha-icon-button-toggle": [61318, 1318],
      "./ha-icon-button-toggle.ts": [61318, 1318],
      "./ha-icon-button.ts": [54371],
      "./ha-icon-next": [68245, 8245],
      "./ha-icon-next.ts": [68245, 8245],
      "./ha-icon-overflow-menu": [62082],
      "./ha-icon-overflow-menu.ts": [62082],
      "./ha-icon-picker": [2638, 2638],
      "./ha-icon-picker.ts": [2638, 2638],
      "./ha-icon-prev": [28827, 8827],
      "./ha-icon-prev.ts": [28827, 8827],
      "./ha-icon.ts": [87386, 7386],
      "./ha-qr-code": [31195, 1970, 1195],
      "./ha-qr-code.ts": [31195, 1970, 1195],
      "./ha-svg-icon": [37662],
      "./ha-svg-icon.ts": [37662],
    };
    function n(e) {
      if (!o.o(i, e))
        return Promise.resolve().then(() => {
          var t = new Error("Cannot find module '" + e + "'");
          throw ((t.code = "MODULE_NOT_FOUND"), t);
        });
      var t = i[e],
        n = t[0];
      return Promise.all(t.slice(1).map(o.e)).then(() => o(n));
    }
    (n.keys = () => Object.keys(i)), (n.id = 61320), (e.exports = n);
  },
  47715: (e, t, o) => {
    o.d(t, { i: () => n });
    const i = (0, o(89878).P)((e) => {
        history.replaceState({ scrollPosition: e }, "");
      }, 300),
      n = (e) => (t) => ({
        kind: "method",
        placement: "prototype",
        key: t.key,
        descriptor: {
          set(e) {
            i(e), (this[`__${String(t.key)}`] = e);
          },
          get() {
            var e;
            return (
              this[`__${String(t.key)}`] ||
              (null === (e = history.state) || void 0 === e
                ? void 0
                : e.scrollPosition)
            );
          },
          enumerable: !0,
          configurable: !0,
        },
        finisher(o) {
          const i = o.prototype.connectedCallback;
          o.prototype.connectedCallback = function () {
            i.call(this);
            const o = this[t.key];
            o &&
              this.updateComplete.then(() => {
                const t = this.renderRoot.querySelector(e);
                t &&
                  setTimeout(() => {
                    t.scrollTop = o;
                  }, 0);
              });
          };
        },
      });
  },
  51750: (e, t, o) => {
    function i(e) {
      const t = e.language || "en";
      return (
        (e.translationMetadata.translations[t] &&
          e.translationMetadata.translations[t].isRTL) ||
        !1
      );
    }
    function n(e) {
      return a(i(e));
    }
    function a(e) {
      return e ? "rtl" : "ltr";
    }
    o.d(t, { HE: () => i, Zu: () => n });
  },
  89878: (e, t, o) => {
    o.d(t, { P: () => i });
    const i = (e, t, o = !0, i = !0) => {
      let n,
        a = 0;
      const r = (...r) => {
        const l = () => {
            (a = !1 === o ? 0 : Date.now()), (n = void 0), e(...r);
          },
          s = Date.now();
        a || !1 !== o || (a = s);
        const d = t - (s - a);
        d <= 0 || d > t
          ? (n && (clearTimeout(n), (n = void 0)), (a = s), e(...r))
          : n || !1 === i || (n = window.setTimeout(l, d));
      };
      return (
        (r.cancel = () => {
          clearTimeout(n), (n = void 0), (a = 0);
        }),
        r
      );
    };
  },
  85878: (e, t, o) => {
    var i = o(309),
      n = o(34541),
      a = o(47838),
      r = (o(65666), o(5095)),
      l = o(95260),
      s = o(67684),
      d = o(60625);
    (0, i.Z)(
      [(0, l.Mo)("ha-button-menu")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            { kind: "field", key: d.gA, value: void 0 },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "corner",
              value: () => "BOTTOM_START",
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "menuCorner",
              value: () => "START",
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Number })],
              key: "x",
              value: () => null,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Number })],
              key: "y",
              value: () => null,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "multi",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "activatable",
              value: () => !1,
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
              key: "fixed",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, l.Cb)({ type: Boolean, attribute: "no-anchor" }),
              ],
              key: "noAnchor",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.IO)("mwc-menu", !0)],
              key: "_menu",
              value: void 0,
            },
            {
              kind: "get",
              key: "items",
              value: function () {
                var e;
                return null === (e = this._menu) || void 0 === e
                  ? void 0
                  : e.items;
              },
            },
            {
              kind: "get",
              key: "selected",
              value: function () {
                var e;
                return null === (e = this._menu) || void 0 === e
                  ? void 0
                  : e.selected;
              },
            },
            {
              kind: "method",
              key: "focus",
              value: function () {
                var e, t;
                null !== (e = this._menu) && void 0 !== e && e.open
                  ? this._menu.focusItemAtIndex(0)
                  : null === (t = this._triggerButton) ||
                    void 0 === t ||
                    t.focus();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return r.dy` <div @click="${this._handleClick}"> <slot name="trigger" @slotchange="${this._setTriggerAria}"></slot> </div> <mwc-menu .corner="${this.corner}" .menuCorner="${this.menuCorner}" .fixed="${this.fixed}" .multi="${this.multi}" .activatable="${this.activatable}" .y="${this.y}" .x="${this.x}"> <slot></slot> </mwc-menu> `;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, n.Z)((0, a.Z)(o.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  "rtl" === s.E.document.dir &&
                    this.updateComplete.then(() => {
                      this.querySelectorAll("mwc-list-item").forEach((e) => {
                        const t = document.createElement("style");
                        (t.innerHTML =
                          "span.material-icons:first-of-type { margin-left: var(--mdc-list-item-graphic-margin, 32px) !important; margin-right: 0px !important;}"),
                          e.shadowRoot.appendChild(t);
                      });
                    });
              },
            },
            {
              kind: "method",
              key: "_handleClick",
              value: function () {
                this.disabled ||
                  ((this._menu.anchor = this.noAnchor ? null : this),
                  this._menu.show());
              },
            },
            {
              kind: "get",
              key: "_triggerButton",
              value: function () {
                return this.querySelector(
                  'ha-icon-button[slot="trigger"], mwc-button[slot="trigger"]'
                );
              },
            },
            {
              kind: "method",
              key: "_setTriggerAria",
              value: function () {
                this._triggerButton &&
                  (this._triggerButton.ariaHasPopup = "menu");
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return r.iv`:host{display:inline-block;position:relative}::slotted([disabled]){color:var(--disabled-text-color)}`;
              },
            },
          ],
        };
      },
      r.oi
    );
  },
  99040: (e, t, o) => {
    var i = o(309),
      n = o(34541),
      a = o(47838),
      r = o(48095),
      l = o(72477),
      s = o(95260),
      d = o(5095),
      c = o(67684);
    (0, i.Z)(
      [(0, s.Mo)("ha-fab")],
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
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, n.Z)((0, a.Z)(o.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  this.style.setProperty(
                    "--mdc-theme-secondary",
                    "var(--primary-color)"
                  );
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                l.W,
                d.iv`:host .mdc-fab--extended .mdc-fab__icon{margin-inline-start:-8px;margin-inline-end:12px;direction:var(--direction)}`,
                "rtl" === c.E.document.dir
                  ? d.iv`:host .mdc-fab--extended .mdc-fab__icon{direction:rtl}`
                  : d.iv``,
              ],
            },
          ],
        };
      },
      r._
    );
  },
  62082: (e, t, o) => {
    o.r(t), o.d(t, { HaIconOverflowMenu: () => s });
    var i = o(309),
      n = (o(33829), o(5095)),
      a = o(95260),
      r = o(53180),
      l = o(29950);
    o(85878), o(54371), o(90532), o(37662);
    let s = (0, i.Z)(
      [(0, a.Mo)("ha-icon-overflow-menu")],
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
              decorators: [(0, a.Cb)({ type: Array })],
              key: "items",
              value: () => [],
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return n.dy` ${
                  this.narrow
                    ? n.dy` <ha-button-menu @click="${
                        this._handleIconOverflowMenuOpened
                      }" @closed="${
                        this._handleIconOverflowMenuClosed
                      }" class="ha-icon-overflow-menu-overflow" absolute> <ha-icon-button .label="${this.hass.localize(
                        "ui.common.overflow_menu"
                      )}" .path="${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"}" slot="trigger"></ha-icon-button> ${this.items.map(
                        (e) =>
                          e.divider
                            ? n.dy`<li divider role="separator"></li>`
                            : n.dy`<ha-list-item graphic="icon" ?disabled="${
                                e.disabled
                              }" @click="${e.action}" class="${(0, r.$)({
                                warning: Boolean(e.warning),
                              })}"> <div slot="graphic"> <ha-svg-icon class="${(0,
                              r.$)({ warning: Boolean(e.warning) })}" .path="${
                                e.path
                              }"></ha-svg-icon> </div> ${
                                e.label
                              } </ha-list-item> `
                      )} </ha-button-menu>`
                    : n.dy` ${this.items.map((e) =>
                        e.narrowOnly
                          ? ""
                          : e.divider
                          ? n.dy`<div role="separator"></div>`
                          : n.dy`<div> ${
                              e.tooltip
                                ? n.dy`<simple-tooltip animation-delay="0" position="left"> ${e.tooltip} </simple-tooltip>`
                                : ""
                            } <ha-icon-button @click="${e.action}" .label="${
                              e.label
                            }" .path="${e.path}" ?disabled="${
                              e.disabled
                            }"></ha-icon-button> </div> `
                      )} `
                } `;
              },
            },
            {
              kind: "method",
              key: "_handleIconOverflowMenuOpened",
              value: function (e) {
                e.stopPropagation();
                const t = this.closest(".mdc-data-table__row");
                t && (t.style.zIndex = "1");
              },
            },
            {
              kind: "method",
              key: "_handleIconOverflowMenuClosed",
              value: function () {
                const e = this.closest(".mdc-data-table__row");
                e && (e.style.zIndex = "");
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  l.Qx,
                  n.iv`:host{display:flex;justify-content:flex-end}li[role=separator]{border-bottom-color:var(--divider-color)}div[role=separator]{border-right:1px solid var(--divider-color);width:1px}ha-list-item[disabled] ha-svg-icon{color:var(--disabled-text-color)}`,
                ];
              },
            },
          ],
        };
      },
      n.oi
    );
  },
  90532: (e, t, o) => {
    var i = o(309),
      n = o(34541),
      a = o(47838),
      r = o(61092),
      l = o(96762),
      s = o(5095),
      d = o(95260);
    (0, i.Z)(
      [(0, d.Mo)("ha-list-item")],
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
              kind: "method",
              key: "renderRipple",
              value: function () {
                return this.noninteractive
                  ? ""
                  : (0, n.Z)((0, a.Z)(o.prototype), "renderRipple", this).call(
                      this
                    );
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  l.W,
                  s.iv`:host{padding-left:var(--mdc-list-side-padding-left,var(--mdc-list-side-padding,20px));padding-right:var(--mdc-list-side-padding-right,var(--mdc-list-side-padding,20px))}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:48px}span.material-icons:first-of-type{margin-inline-start:0px!important;margin-inline-end:var(--mdc-list-item-graphic-margin,16px)!important;direction:var(--direction)!important}span.material-icons:last-of-type{margin-inline-start:auto!important;margin-inline-end:0px!important;direction:var(--direction)!important}.mdc-deprecated-list-item__meta{display:var(--mdc-list-item-meta-display);align-items:center;flex-shrink:0}:host([graphic=icon]:not([twoline])) .mdc-deprecated-list-item__graphic{margin-inline-end:var(--mdc-list-item-graphic-margin,20px)!important}:host([multiline-secondary]){height:auto}:host([multiline-secondary]) .mdc-deprecated-list-item__text{padding:8px 0}:host([multiline-secondary]) .mdc-deprecated-list-item__secondary-text{text-overflow:initial;white-space:normal;overflow:auto;display:inline-block;margin-top:10px}:host([multiline-secondary]) .mdc-deprecated-list-item__primary-text{margin-top:10px}:host([multiline-secondary]) .mdc-deprecated-list-item__secondary-text::before{display:none}:host([multiline-secondary]) .mdc-deprecated-list-item__primary-text::before{display:none}:host([disabled]){color:var(--disabled-text-color)}:host([noninteractive]){pointer-events:unset}`,
                  "rtl" === document.dir
                    ? s.iv`span.material-icons:first-of-type,span.material-icons:last-of-type{direction:rtl!important}`
                    : s.iv``,
                ];
              },
            },
          ],
        };
      },
      r.K
    );
  },
  21162: (e, t, o) => {
    var i = o(309),
      n = o(5095),
      a = o(95260),
      r = o(34541),
      l = o(47838),
      s = o(18394),
      d = o(93217);
    let c;
    const h = { Note: "info", Warning: "warning" },
      u = {
        "[!NOTE]": "info",
        "[!TIP]": "success",
        "[!IMPORTANT]": "info",
        "[!WARNING]": "warning",
        "[!CAUTION]": "error",
      };
    (0, i.Z)(
      [(0, a.Mo)("ha-markdown-element")],
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
              decorators: [(0, a.Cb)()],
              key: "content",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "allowSvg",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "breaks",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, a.Cb)({ type: Boolean, attribute: "lazy-images" }),
              ],
              key: "lazyImages",
              value: () => !1,
            },
            {
              kind: "method",
              key: "createRenderRoot",
              value: function () {
                return this;
              },
            },
            {
              kind: "method",
              key: "update",
              value: function (e) {
                (0, r.Z)((0, l.Z)(i.prototype), "update", this).call(this, e),
                  void 0 !== this.content && this._render();
              },
            },
            {
              kind: "method",
              key: "_render",
              value: async function () {
                (this.innerHTML = await (async (e, t, i) => (
                  c ||
                    (c = (0, d.Ud)(
                      new Worker(new URL(o.p + o.u(1402), o.b), {
                        type: "module",
                      })
                    )),
                  c.renderMarkdown(e, t, i)
                ))(
                  String(this.content),
                  { breaks: this.breaks, gfm: !0 },
                  { allowSvg: this.allowSvg }
                )),
                  this._resize();
                const e = document.createTreeWalker(
                  this,
                  NodeFilter.SHOW_ELEMENT,
                  null
                );
                for (; e.nextNode(); ) {
                  const n = e.currentNode;
                  if (
                    n instanceof HTMLAnchorElement &&
                    n.host !== document.location.host
                  )
                    (n.target = "_blank"), (n.rel = "noreferrer noopener");
                  else if (n instanceof HTMLImageElement)
                    this.lazyImages && (n.loading = "lazy"),
                      n.addEventListener("load", this._resize);
                  else if (n instanceof HTMLQuoteElement) {
                    var t;
                    const e = n.firstElementChild,
                      o = null == e ? void 0 : e.firstElementChild,
                      a =
                        (null == e ||
                        null === (t = e.firstChild) ||
                        void 0 === t
                          ? void 0
                          : t.textContent) && u[e.firstChild.textContent],
                      r =
                        !a &&
                        (null == o ? void 0 : o.textContent) &&
                        h[o.textContent];
                    if (
                      a ||
                      ("STRONG" === (null == o ? void 0 : o.nodeName) && r)
                    ) {
                      var i;
                      const t = document.createElement("ha-alert");
                      (t.alertType = a || r),
                        (t.title = a
                          ? ""
                          : ("#text" === e.childNodes[1].nodeName &&
                              (null === (i = e.childNodes[1].textContent) ||
                              void 0 === i
                                ? void 0
                                : i.trimStart())) ||
                            "");
                      const o = Array.from(e.childNodes);
                      for (const e of o.slice(
                        o.findIndex((e) => e instanceof HTMLBRElement) + 1
                      ))
                        t.appendChild(e);
                      n.firstElementChild.replaceWith(t);
                    }
                  } else
                    n instanceof HTMLElement &&
                      [
                        "ha-alert",
                        "ha-qr-code",
                        "ha-icon",
                        "ha-svg-icon",
                      ].includes(n.localName) &&
                      o(61320)(`./${n.localName}`);
                }
              },
            },
            {
              kind: "field",
              key: "_resize",
              value() {
                return () => (0, s.B)(this, "content-resize");
              },
            },
          ],
        };
      },
      n.fl
    ),
      (0, i.Z)(
        [(0, a.Mo)("ha-markdown")],
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
                decorators: [(0, a.Cb)()],
                key: "content",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, a.Cb)({ type: Boolean })],
                key: "allowSvg",
                value: () => !1,
              },
              {
                kind: "field",
                decorators: [(0, a.Cb)({ type: Boolean })],
                key: "breaks",
                value: () => !1,
              },
              {
                kind: "field",
                decorators: [
                  (0, a.Cb)({ type: Boolean, attribute: "lazy-images" }),
                ],
                key: "lazyImages",
                value: () => !1,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return this.content
                    ? n.dy`<ha-markdown-element .content="${this.content}" .allowSvg="${this.allowSvg}" .breaks="${this.breaks}" .lazyImages="${this.lazyImages}"></ha-markdown-element>`
                    : n.Ld;
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return n.iv`:host{display:block}ha-markdown-element{-ms-user-select:text;-webkit-user-select:text;-moz-user-select:text}ha-markdown-element>:first-child{margin-top:0}ha-markdown-element>:last-child{margin-bottom:0}a{color:var(--primary-color)}img{max-width:100%}code,pre{background-color:var(--markdown-code-background-color,none);border-radius:3px}svg{background-color:var(--markdown-svg-background-color,none);color:var(--markdown-svg-color,none)}code{font-size:85%;padding:.2em .4em}pre code{padding:0}pre{padding:16px;overflow:auto;line-height:1.45;font-family:var(--code-font-family, monospace)}h1,h2,h3,h4,h5,h6{line-height:initial}h2{font-size:1.5em;font-weight:700}`;
                },
              },
            ],
          };
        },
        n.oi
      );
  },
  60470: (e, t, o) => {
    o.d(t, { RQ: () => n, pB: () => i });
    const i = (e, t) => {
        const o = {};
        return (
          t &&
            (t.type && (o.type_filter = t.type),
            t.domain && (o.domain = t.domain)),
          e.callWS({ type: "config_entries/get", ...o })
        );
      },
      n = (e, t) =>
        e.callWS({ type: "config_entries/get_single", entry_id: t });
  },
  32218: (e, t, o) => {
    o.d(t, { SN: () => n, eL: () => i, fg: () => r, id: () => a });
    const i = (e) => e.sendMessagePromise({ type: "lovelace/resources" }),
      n = (e, t) => e.callWS({ type: "lovelace/resources/create", ...t }),
      a = (e, t, o) =>
        e.callWS({ type: "lovelace/resources/update", resource_id: t, ...o }),
      r = (e, t) =>
        e.callWS({ type: "lovelace/resources/delete", resource_id: t });
  },
  11285: (e, t, o) => {
    o.d(t, { D9: () => s, Ys: () => r, g7: () => l });
    var i = o(18394);
    const n = () => Promise.all([o.e(8597), o.e(4338)]).then(o.bind(o, 44338)),
      a = (e, t, o) =>
        new Promise((a) => {
          const r = t.cancel,
            l = t.confirm;
          (0, i.B)(e, "show-dialog", {
            dialogTag: "dialog-box",
            dialogImport: n,
            dialogParams: {
              ...t,
              ...o,
              cancel: () => {
                a(!(null == o || !o.prompt) && null), r && r();
              },
              confirm: (e) => {
                a(null == o || !o.prompt || e), l && l(e);
              },
            },
          });
        }),
      r = (e, t) => a(e, t),
      l = (e, t) => a(e, t, { confirmation: !0 }),
      s = (e, t) => a(e, t, { prompt: !0 });
  },
  33367: (e, t, o) => {
    o.d(t, { U8: () => r, lU: () => n, px: () => a });
    var i = o(18394);
    const n = (e, t) => {
        (0, i.B)(e, "show-dialog", {
          dialogTag: "hacs-form-dialog",
          dialogImport: () =>
            Promise.all([o.e(8597), o.e(5649), o.e(9663), o.e(4833)]).then(
              o.bind(o, 4833)
            ),
          dialogParams: t,
        });
      },
      a = (e, t) => {
        (0, i.B)(e, "show-dialog", {
          dialogTag: "hacs-download-dialog",
          dialogImport: () =>
            Promise.all([o.e(8597), o.e(8779), o.e(9663), o.e(5563)]).then(
              o.bind(o, 25563)
            ),
          dialogParams: t,
        });
      },
      r = (e, t) => {
        (0, i.B)(e, "show-dialog", {
          dialogTag: "hacs-custom-repositories-dialog",
          dialogImport: () =>
            Promise.all([o.e(8597), o.e(8614), o.e(9663), o.e(1064)]).then(
              o.bind(o, 91064)
            ),
          dialogParams: t,
        });
      };
  },
  90012: (e, t, o) => {
    o.d(t, { G: () => h });
    var i = o(14516),
      n = o(67684),
      a = o(38480),
      r = o(60470),
      l = o(32218),
      s = o(11285),
      d = o(46797),
      c = o(33367);
    const h = (0, i.Z)((e, t) => [
        ...("HACS-EXPERIMENTAL-PANEL" === e.nodeName
          ? [
              {
                path: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
                label: e.hacs.localize("common.show"),
                action: () => (0, a.c)(`/hacs/repository/${t.id}`),
              },
            ]
          : []),
        {
          path: "M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z",
          label: e.hacs.localize("common.repository"),
          action: () =>
            n.E.open(
              `https://github.com/${t.full_name}`,
              "_blank",
              "noreferrer=true"
            ),
        },
        {
          path: "M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z",
          label: e.hacs.localize("repository_card.update_information"),
          action: async () => {
            await (0, d.yx)(e.hass, String(t.id));
          },
        },
        ...(t.installed_version
          ? [
              {
                path: "M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z",
                label: e.hacs.localize("repository_card.redownload"),
                action: () =>
                  (0, c.px)(e, { hacs: e.hacs, repositoryId: t.id }),
                hideForUninstalled: !0,
              },
            ]
          : []),
        ...("plugin" === t.category && t.installed_version
          ? [
              {
                path: "M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z",
                label: e.hacs.localize("repository_card.open_source"),
                action: () =>
                  n.E.open(
                    `/hacsfiles/${t.local_path.split("/").pop()}/${
                      t.file_name
                    }`,
                    "_blank",
                    "noreferrer=true"
                  ),
              },
            ]
          : []),
        { divider: !0 },
        {
          path: "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
          label: e.hacs.localize("repository_card.open_issue"),
          action: () =>
            n.E.open(
              `https://github.com/${t.full_name}/issues`,
              "_blank",
              "noreferrer=true"
            ),
        },
        ...("172733314" !== t.id && t.installed_version
          ? [
              {
                path: "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z",
                label: e.hacs.localize("repository_card.report"),
                action: () =>
                  n.E.open(
                    `https://github.com/hacs/integration/issues/new?assignees=ludeeus&labels=flag&template=removal.yml&repo=${t.full_name}&title=Request for removal of ${t.full_name}`,
                    "_blank",
                    "noreferrer=true"
                  ),
                warning: !0,
              },
              {
                path: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
                label: e.hacs.localize("common.remove"),
                action: async () => {
                  if ("integration" === t.category && t.config_flow) {
                    if (
                      (await (0, r.pB)(e.hass)).some(
                        (e) => e.domain === t.domain
                      )
                    ) {
                      if (
                        await (0, s.g7)(e, {
                          title: e.hacs.localize("dialog.configured.title"),
                          text: e.hacs.localize("dialog.configured.message", {
                            name: t.name,
                          }),
                          dismissText: e.hacs.localize("common.ignore"),
                          confirmText: e.hacs.localize("common.navigate"),
                          confirm: () => {
                            (0, a.c)("/config/integrations", { replace: !0 });
                          },
                        })
                      )
                        return;
                    }
                  }
                  (0, c.lU)(e, {
                    hacs: e.hacs,
                    title: e.hacs.localize("dialog.remove.title"),
                    saveLabel: e.hacs.localize("dialog.remove.title"),
                    description: e.hacs.localize("dialog.remove.message", {
                      name: t.name,
                    }),
                    saveAction: async () => {
                      await u(e, t);
                    },
                    destructive: !0,
                  });
                },
                warning: !0,
              },
            ]
          : []),
      ]),
      u = async (e, t) => {
        var o;
        if (
          "plugin" === t.category &&
          "yaml" !==
            (null === (o = e.hacs.info) || void 0 === o
              ? void 0
              : o.lovelace_mode)
        ) {
          (await (0, l.eL)(e.hass.connection))
            .filter((e) =>
              e.url.startsWith(
                `/hacsfiles/${t.full_name.split("/")[1]}/${t.file_name}`
              )
            )
            .forEach(async (t) => {
              await (0, l.fg)(e.hass, String(t.id));
            });
        }
        await (0, d.jW)(e.hass, String(t.id)),
          "HACS-REPOSITORY-PANEL" === e.nodeName && history.back();
      };
  },
};
//# sourceMappingURL=2519.8nyAHYPXDXY.js.map
