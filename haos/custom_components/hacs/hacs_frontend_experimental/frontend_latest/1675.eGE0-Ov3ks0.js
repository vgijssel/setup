/*! For license information please see 1675.eGE0-Ov3ks0.js.LICENSE.txt */
export const id = 1675;
export const ids = [1675, 8245];
export const modules = {
  47540: (e, t, i) => {
    var o = {
      "./flow-preview-group": [72583, 1866, 3316, 3687, 9503, 5868, 2528, 2583],
      "./flow-preview-group.ts": [
        72583, 1866, 3316, 3687, 9503, 5868, 2528, 2583,
      ],
      "./flow-preview-template": [
        21904, 1866, 3316, 3687, 9503, 5868, 2528, 1904,
      ],
      "./flow-preview-template.ts": [
        21904, 1866, 3316, 3687, 9503, 5868, 2528, 1904,
      ],
    };
    function a(e) {
      if (!i.o(o, e))
        return Promise.resolve().then(() => {
          var t = new Error("Cannot find module '" + e + "'");
          throw ((t.code = "MODULE_NOT_FOUND"), t);
        });
      var t = o[e],
        a = t[0];
      return Promise.all(t.slice(1).map(i.e)).then(() => i(a));
    }
    (a.keys = () => Object.keys(o)), (a.id = 47540), (e.exports = a);
  },
  25718: (e, t, i) => {
    var o = i(309),
      a = i(5095),
      r = i(95260),
      s = i(53180),
      n = i(14516),
      l = i(18394),
      d = i(36655),
      c = i(1913),
      h = i(97477),
      p = i(16061),
      u = i(11285);
    i(16591), i(54371), i(90532), i(37662);
    const f = (e) =>
      a.dy`<ha-list-item class="${(0, s.$)({
        "add-new": "add_new" === e.area_id,
      })}"> ${e.name} </ha-list-item>`;
    (0, o.Z)(
      [(0, r.Mo)("ha-area-picker")],
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
              decorators: [(0, r.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "placeholder",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)({ type: Boolean, attribute: "no-add" })],
              key: "noAdd",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, r.Cb)({ type: Array, attribute: "include-domains" }),
              ],
              key: "includeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, r.Cb)({ type: Array, attribute: "exclude-domains" }),
              ],
              key: "excludeDomains",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, r.Cb)({ type: Array, attribute: "include-device-classes" }),
              ],
              key: "includeDeviceClasses",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, r.Cb)({ type: Array, attribute: "exclude-areas" }),
              ],
              key: "excludeAreas",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "deviceFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)()],
              key: "entityFilter",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, r.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, r.SB)()],
              key: "_opened",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, r.IO)("ha-combo-box", !0)],
              key: "comboBox",
              value: void 0,
            },
            { kind: "field", key: "_suggestion", value: void 0 },
            { kind: "field", key: "_init", value: () => !1 },
            {
              kind: "method",
              key: "open",
              value: async function () {
                var e;
                await this.updateComplete,
                  await (null === (e = this.comboBox) || void 0 === e
                    ? void 0
                    : e.open());
              },
            },
            {
              kind: "method",
              key: "focus",
              value: async function () {
                var e;
                await this.updateComplete,
                  await (null === (e = this.comboBox) || void 0 === e
                    ? void 0
                    : e.focus());
              },
            },
            {
              kind: "field",
              key: "_getAreas",
              value() {
                return (0, n.Z)((e, t, i, o, a, r, s, n, l, c) => {
                  if (!e.length)
                    return [
                      {
                        area_id: "no_areas",
                        name: this.hass.localize(
                          "ui.components.area-picker.no_areas"
                        ),
                        picture: null,
                        aliases: [],
                      },
                    ];
                  let h,
                    u,
                    f = {};
                  (o || a || r || s || n) &&
                    ((f = (0, p.R6)(i)),
                    (h = t),
                    (u = i.filter((e) => e.area_id)),
                    o &&
                      ((h = h.filter((e) => {
                        const t = f[e.id];
                        return (
                          !(!t || !t.length) &&
                          f[e.id].some((e) => o.includes((0, d.M)(e.entity_id)))
                        );
                      })),
                      (u = u.filter((e) => o.includes((0, d.M)(e.entity_id))))),
                    a &&
                      ((h = h.filter((e) => {
                        const t = f[e.id];
                        return (
                          !t ||
                          !t.length ||
                          i.every((e) => !a.includes((0, d.M)(e.entity_id)))
                        );
                      })),
                      (u = u.filter(
                        (e) => !a.includes((0, d.M)(e.entity_id))
                      ))),
                    r &&
                      ((h = h.filter((e) => {
                        const t = f[e.id];
                        return (
                          !(!t || !t.length) &&
                          f[e.id].some((e) => {
                            const t = this.hass.states[e.entity_id];
                            return (
                              !!t &&
                              t.attributes.device_class &&
                              r.includes(t.attributes.device_class)
                            );
                          })
                        );
                      })),
                      (u = u.filter((e) => {
                        const t = this.hass.states[e.entity_id];
                        return (
                          t.attributes.device_class &&
                          r.includes(t.attributes.device_class)
                        );
                      }))),
                    s && (h = h.filter((e) => s(e))),
                    n &&
                      ((h = h.filter((e) => {
                        const t = f[e.id];
                        return (
                          !(!t || !t.length) &&
                          f[e.id].some((e) => {
                            const t = this.hass.states[e.entity_id];
                            return !!t && n(t);
                          })
                        );
                      })),
                      (u = u.filter((e) => {
                        const t = this.hass.states[e.entity_id];
                        return !!t && n(t);
                      }))));
                  let v,
                    m = e;
                  var g;
                  (h && (v = h.filter((e) => e.area_id).map((e) => e.area_id)),
                  u) &&
                    (v = (null !== (g = v) && void 0 !== g ? g : []).concat(
                      u.filter((e) => e.area_id).map((e) => e.area_id)
                    ));
                  return (
                    v && (m = e.filter((e) => v.includes(e.area_id))),
                    c && (m = m.filter((e) => !c.includes(e.area_id))),
                    m.length ||
                      (m = [
                        {
                          area_id: "no_areas",
                          name: this.hass.localize(
                            "ui.components.area-picker.no_match"
                          ),
                          picture: null,
                          aliases: [],
                        },
                      ]),
                    l
                      ? m
                      : [
                          ...m,
                          {
                            area_id: "add_new",
                            name: this.hass.localize(
                              "ui.components.area-picker.add_new"
                            ),
                            picture: null,
                            aliases: [],
                          },
                        ]
                  );
                });
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                if (
                  (!this._init && this.hass) ||
                  (this._init && e.has("_opened") && this._opened)
                ) {
                  this._init = !0;
                  const e = this._getAreas(
                    Object.values(this.hass.areas),
                    Object.values(this.hass.devices),
                    Object.values(this.hass.entities),
                    this.includeDomains,
                    this.excludeDomains,
                    this.includeDeviceClasses,
                    this.deviceFilter,
                    this.entityFilter,
                    this.noAdd,
                    this.excludeAreas
                  ).map((e) => ({
                    ...e,
                    strings: [e.area_id, ...e.aliases, e.name],
                  }));
                  (this.comboBox.items = e), (this.comboBox.filteredItems = e);
                }
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return a.dy` <ha-combo-box .hass="${this.hass}" .helper="${
                  this.helper
                }" item-value-path="area_id" item-id-path="area_id" item-label-path="name" .value="${
                  this._value
                }" .disabled="${this.disabled}" .required="${
                  this.required
                }" .label="${
                  void 0 === this.label && this.hass
                    ? this.hass.localize("ui.components.area-picker.area")
                    : this.label
                }" .placeholder="${
                  this.placeholder
                    ? null === (e = this.hass.areas[this.placeholder]) ||
                      void 0 === e
                      ? void 0
                      : e.name
                    : void 0
                }" .renderer="${f}" @filter-changed="${
                  this._filterChanged
                }" @opened-changed="${this._openedChanged}" @value-changed="${
                  this._areaChanged
                }"> </ha-combo-box> `;
              },
            },
            {
              kind: "method",
              key: "_filterChanged",
              value: function (e) {
                const t = e.target,
                  i = e.detail.value;
                if (!i)
                  return void (this.comboBox.filteredItems =
                    this.comboBox.items);
                const o = (0, c.q)(i, t.items || []);
                this.noAdd || 0 !== (null == o ? void 0 : o.length)
                  ? (this.comboBox.filteredItems = o)
                  : ((this._suggestion = i),
                    (this.comboBox.filteredItems = [
                      {
                        area_id: "add_new_suggestion",
                        name: this.hass.localize(
                          "ui.components.area-picker.add_new_sugestion",
                          { name: this._suggestion }
                        ),
                        picture: null,
                      },
                    ]));
              },
            },
            {
              kind: "get",
              key: "_value",
              value: function () {
                return this.value || "";
              },
            },
            {
              kind: "method",
              key: "_openedChanged",
              value: function (e) {
                this._opened = e.detail.value;
              },
            },
            {
              kind: "method",
              key: "_areaChanged",
              value: function (e) {
                e.stopPropagation();
                let t = e.detail.value;
                "no_areas" === t && (t = ""),
                  ["add_new_suggestion", "add_new"].includes(t)
                    ? ((e.target.value = this._value),
                      (0, u.D9)(this, {
                        title: this.hass.localize(
                          "ui.components.area-picker.add_dialog.title"
                        ),
                        text: this.hass.localize(
                          "ui.components.area-picker.add_dialog.text"
                        ),
                        confirmText: this.hass.localize(
                          "ui.components.area-picker.add_dialog.add"
                        ),
                        inputLabel: this.hass.localize(
                          "ui.components.area-picker.add_dialog.name"
                        ),
                        defaultValue:
                          "add_new_suggestion" === t
                            ? this._suggestion
                            : void 0,
                        confirm: async (e) => {
                          if (e)
                            try {
                              const t = await (0, h.Lo)(this.hass, { name: e }),
                                i = [...Object.values(this.hass.areas), t];
                              (this.comboBox.filteredItems = this._getAreas(
                                i,
                                Object.values(this.hass.devices),
                                Object.values(this.hass.entities),
                                this.includeDomains,
                                this.excludeDomains,
                                this.includeDeviceClasses,
                                this.deviceFilter,
                                this.entityFilter,
                                this.noAdd,
                                this.excludeAreas
                              )),
                                await this.updateComplete,
                                await this.comboBox.updateComplete,
                                this._setValue(t.area_id);
                            } catch (e) {
                              (0, u.Ys)(this, {
                                title: this.hass.localize(
                                  "ui.components.area-picker.add_dialog.failed_create_area"
                                ),
                                text: e.message,
                              });
                            }
                        },
                        cancel: () => {
                          this._setValue(void 0),
                            (this._suggestion = void 0),
                            this.comboBox.setInputValue("");
                        },
                      }))
                    : t !== this._value && this._setValue(t);
              },
            },
            {
              kind: "method",
              key: "_setValue",
              value: function (e) {
                (this.value = e),
                  setTimeout(() => {
                    (0, l.B)(this, "value-changed", { value: e }),
                      (0, l.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  7006: (e, t, i) => {
    var o = i(309),
      a = i(34541),
      r = i(47838),
      s = (i(34131), i(22129)),
      n = i(5095),
      l = i(95260);
    (0, o.Z)(
      [(0, l.Mo)("ha-circular-progress")],
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
              decorators: [
                (0, l.Cb)({ attribute: "aria-label", type: String }),
              ],
              key: "ariaLabel",
              value: () => "Loading",
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "size",
              value: () => "medium",
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                if (
                  ((0, a.Z)((0, r.Z)(i.prototype), "updated", this).call(
                    this,
                    e
                  ),
                  e.has("size"))
                )
                  switch (this.size) {
                    case "tiny":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "16px"
                      );
                      break;
                    case "small":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "28px"
                      );
                      break;
                    case "medium":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "48px"
                      );
                      break;
                    case "large":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "68px"
                      );
                  }
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  ...(0, a.Z)((0, r.Z)(i), "styles", this),
                  n.iv`:host{--md-sys-color-primary:var(--primary-color);--md-circular-progress-size:48px}`,
                ];
              },
            },
          ],
        };
      },
      s.B
    );
  },
  9828: (e, t, i) => {
    i.d(t, { i: () => p });
    var o = i(309),
      a = i(34541),
      r = i(47838),
      s = i(87762),
      n = i(91632),
      l = i(5095),
      d = i(95260),
      c = i(60625);
    i(54371);
    const h = ["button", "ha-list-item"],
      p = (e, t) => {
        var i;
        return l.dy` <div class="header_title"> <span>${t}</span> <ha-icon-button .label="${
          null !==
            (i = null == e ? void 0 : e.localize("ui.dialogs.generic.close")) &&
          void 0 !== i
            ? i
            : "Close"
        }" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}" dialogAction="close" class="header_button"></ha-icon-button> </div> `;
      };
    (0, o.Z)(
      [(0, d.Mo)("ha-dialog")],
      function (e, t) {
        class i extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: i,
          d: [
            { kind: "field", key: c.gA, value: void 0 },
            {
              kind: "method",
              key: "scrollToPos",
              value: function (e, t) {
                var i;
                null === (i = this.contentElement) ||
                  void 0 === i ||
                  i.scrollTo(e, t);
              },
            },
            {
              kind: "method",
              key: "renderHeading",
              value: function () {
                return l.dy`<slot name="heading"> ${(0, a.Z)(
                  (0, r.Z)(i.prototype),
                  "renderHeading",
                  this
                ).call(this)} </slot>`;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                var e;
                (0, a.Z)((0, r.Z)(i.prototype), "firstUpdated", this).call(
                  this
                ),
                  (this.suppressDefaultPressSelector = [
                    this.suppressDefaultPressSelector,
                    h,
                  ].join(", ")),
                  this._updateScrolledAttribute(),
                  null === (e = this.contentElement) ||
                    void 0 === e ||
                    e.addEventListener("scroll", this._onScroll, {
                      passive: !0,
                    });
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, a.Z)(
                  (0, r.Z)(i.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  this.contentElement.removeEventListener(
                    "scroll",
                    this._onScroll
                  );
              },
            },
            {
              kind: "field",
              key: "_onScroll",
              value() {
                return () => {
                  this._updateScrolledAttribute();
                };
              },
            },
            {
              kind: "method",
              key: "_updateScrolledAttribute",
              value: function () {
                this.contentElement &&
                  this.toggleAttribute(
                    "scrolled",
                    0 !== this.contentElement.scrollTop
                  );
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                n.W,
                l.iv`:host([scrolled]) ::slotted(ha-dialog-header){border-bottom:1px solid var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog{--mdc-dialog-scroll-divider-color:var(
          --dialog-scroll-divider-color,
          var(--divider-color)
        );z-index:var(--dialog-z-index,8);-webkit-backdrop-filter:var(--dialog-backdrop-filter,none);backdrop-filter:var(--dialog-backdrop-filter,none);--mdc-dialog-box-shadow:var(--dialog-box-shadow, none);--mdc-typography-headline6-font-weight:400;--mdc-typography-headline6-font-size:1.574rem}.mdc-dialog__actions{justify-content:var(--justify-action-buttons,flex-end);padding-bottom:max(env(safe-area-inset-bottom),24px)}.mdc-dialog__actions span:first-child{flex:var(--secondary-action-button-flex,unset)}.mdc-dialog__actions span:nth-child(2){flex:var(--primary-action-button-flex,unset)}.mdc-dialog__container{align-items:var(--vertical-align-dialog,center)}.mdc-dialog__title{padding:24px 24px 0 24px}.mdc-dialog__actions{padding:12px 24px 12px 24px}.mdc-dialog__title::before{content:unset}.mdc-dialog .mdc-dialog__content{position:var(--dialog-content-position,relative);padding:var(--dialog-content-padding,24px)}:host([hideactions]) .mdc-dialog .mdc-dialog__content{padding-bottom:max(var(--dialog-content-padding,24px),env(safe-area-inset-bottom))}.mdc-dialog .mdc-dialog__surface{position:var(--dialog-surface-position,relative);top:var(--dialog-surface-top);margin-top:var(--dialog-surface-margin-top);min-height:var(--mdc-dialog-min-height,auto);border-radius:var(--ha-dialog-border-radius,28px)}:host([flexContent]) .mdc-dialog .mdc-dialog__content{display:flex;flex-direction:column}.header_title{position:relative;padding-right:40px;padding-inline-end:40px;padding-inline-start:initial;direction:var(--direction)}.header_title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.header_button{position:absolute;right:-8px;top:-8px;text-decoration:none;color:inherit;inset-inline-start:initial;inset-inline-end:-8px;direction:var(--direction)}.dialog-actions{inset-inline-start:initial!important;inset-inline-end:0px!important;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      s.M
    );
  },
  68245: (e, t, i) => {
    i.r(t), i.d(t, { HaIconNext: () => n });
    var o = i(309),
      a = i(95260),
      r = i(67684),
      s = i(37662);
    let n = (0, o.Z)(
      [(0, a.Mo)("ha-icon-next")],
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
              key: "path",
              value: () =>
                "rtl" === r.E.document.dir
                  ? "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  : "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
            },
          ],
        };
      },
      s.HaSvgIcon
    );
  },
  97477: (e, t, i) => {
    i.d(t, { a: () => c, Lo: () => d, sG: () => l });
    var o = i(28858),
      a = i(72881),
      r = i(72218);
    const s = (e) =>
        e
          .sendMessagePromise({ type: "config/area_registry/list" })
          .then((e) => e.sort((e, t) => (0, o.$)(e.name, t.name))),
      n = (e, t) =>
        e.subscribeEvents(
          (0, r.D)(() => s(e).then((e) => t.setState(e, !0)), 500, !0),
          "area_registry_updated"
        ),
      l = (e, t) => (0, a.B)("_areaRegistry", s, n, e, t),
      d = (e, t) => e.callWS({ type: "config/area_registry/create", ...t }),
      c = (e, t) => (i, a) => {
        const r = t ? t.indexOf(i) : -1,
          s = t ? t.indexOf(a) : -1;
        if (-1 === r && -1 === s) {
          var n, l, d, c;
          const t =
              null !==
                (n =
                  null == e || null === (l = e[i]) || void 0 === l
                    ? void 0
                    : l.name) && void 0 !== n
                ? n
                : i,
            r =
              null !==
                (d =
                  null == e || null === (c = e[a]) || void 0 === c
                    ? void 0
                    : c.name) && void 0 !== d
                ? d
                : a;
          return (0, o.$)(t, r);
        }
        return -1 === r ? 1 : -1 === s ? -1 : r - s;
      };
  },
  92599: (e, t, i) => {
    i.d(t, { iI: () => a, oT: () => o });
    const o = (e) =>
        e.map((e) => {
          if ("string" !== e.type) return e;
          switch (e.name) {
            case "username":
              return { ...e, autocomplete: "username" };
            case "password":
              return { ...e, autocomplete: "current-password" };
            case "code":
              return { ...e, autocomplete: "one-time-code" };
            default:
              return e;
          }
        }),
      a = (e, t) => e.callWS({ type: "auth/sign_path", path: t });
  },
  61675: (e, t, i) => {
    i.r(t);
    var o = i(309),
      a = i(34541),
      r = i(47838),
      s = (i(14271), i(5095)),
      n = i(95260),
      l = i(18394),
      d = (i(7006), i(9828), i(54371), i(97477));
    var c = i(16061),
      h = i(29950),
      p = i(84728),
      u = i(11285);
    const f = () => i.e(9821).then(i.bind(i, 59821));
    var v = i(64346);
    const m = { "HA-Frontend-Base": `${location.protocol}//${location.host}` },
      g = (e, t) => {
        var i;
        return e.callApi(
          "POST",
          "config/config_entries/flow",
          {
            handler: t,
            show_advanced_options: Boolean(
              null === (i = e.userData) || void 0 === i
                ? void 0
                : i.showAdvanced
            ),
          },
          m
        );
      },
      _ = (e, t, i) =>
        e.callApi("POST", `config/config_entries/flow/${t}`, i, m),
      y = (e, t) => e.callApi("DELETE", `config/config_entries/flow/${t}`);
    var k = i(46739);
    const b = (e, t) =>
        (0, k.w)(e, t, {
          flowType: "config_flow",
          loadDevicesAndAreas: !0,
          createFlow: async (e, t) => {
            const [i] = await Promise.all([
              g(e, t),
              e.loadFragmentTranslation("config"),
              e.loadBackendTranslation("config", t),
              e.loadBackendTranslation("selector", t),
              e.loadBackendTranslation("title", t),
            ]);
            return i;
          },
          fetchFlow: async (e, t) => {
            const i = await ((e, t) =>
              e.callApi("GET", `config/config_entries/flow/${t}`, void 0, m))(
              e,
              t
            );
            return (
              await e.loadFragmentTranslation("config"),
              await e.loadBackendTranslation("config", i.handler),
              await e.loadBackendTranslation("selector", i.handler),
              i
            );
          },
          handleFlowStep: _,
          deleteFlow: y,
          renderAbortDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.abort.${t.reason}`,
              t.description_placeholders
            );
            return i
              ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
              : "";
          },
          renderShowFormStepHeader: (e, t) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.title`,
              t.description_placeholders
            ) || e.localize(`component.${t.handler}.title`),
          renderShowFormStepDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.step.${t.step_id}.description`,
              t.description_placeholders
            );
            return i
              ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
              : "";
          },
          renderShowFormStepFieldLabel: (e, t, i) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.data.${i.name}`
            ),
          renderShowFormStepFieldHelper(e, t, i) {
            const o = e.localize(
              `component.${t.handler}.config.step.${t.step_id}.data_description.${i.name}`,
              t.description_placeholders
            );
            return o
              ? s.dy`<ha-markdown breaks .content="${o}"></ha-markdown>`
              : "";
          },
          renderShowFormStepFieldError: (e, t, i) =>
            e.localize(
              `component.${t.handler}.config.error.${i}`,
              t.description_placeholders
            ) || i,
          renderShowFormStepFieldLocalizeValue: (e, t, i) =>
            e.localize(`component.${t.handler}.selector.${i}`),
          renderShowFormStepSubmitButton: (e, t) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.submit`
            ) ||
            e.localize(
              "ui.panel.config.integrations.config_flow." +
                (!1 === t.last_step ? "next" : "submit")
            ),
          renderExternalStepHeader: (e, t) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.title`
            ) ||
            e.localize(
              "ui.panel.config.integrations.config_flow.external_step.open_site"
            ),
          renderExternalStepDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.${t.step_id}.description`,
              t.description_placeholders
            );
            return s.dy` <p> ${e.localize(
              "ui.panel.config.integrations.config_flow.external_step.description"
            )} </p> ${
              i
                ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
                : ""
            } `;
          },
          renderCreateEntryDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.create_entry.${
                t.description || "default"
              }`,
              t.description_placeholders
            );
            return s.dy` ${
              i
                ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
                : ""
            } <p> ${e.localize(
              "ui.panel.config.integrations.config_flow.created_config",
              { name: t.title }
            )} </p> `;
          },
          renderShowFormProgressHeader: (e, t) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.title`
            ) || e.localize(`component.${t.handler}.title`),
          renderShowFormProgressDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.progress.${t.progress_action}`,
              t.description_placeholders
            );
            return i
              ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
              : "";
          },
          renderMenuHeader: (e, t) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.title`
            ) || e.localize(`component.${t.handler}.title`),
          renderMenuDescription(e, t) {
            const i = e.localize(
              `component.${t.handler}.config.step.${t.step_id}.description`,
              t.description_placeholders
            );
            return i
              ? s.dy` <ha-markdown allowsvg breaks .content="${i}"></ha-markdown> `
              : "";
          },
          renderMenuOption: (e, t, i) =>
            e.localize(
              `component.${t.handler}.config.step.${t.step_id}.menu_options.${i}`,
              t.description_placeholders
            ),
          renderLoadingDescription(e, t, i, o) {
            if ("loading_flow" !== t && "loading_step" !== t) return "";
            const a = (null == o ? void 0 : o.handler) || i;
            return e.localize(
              `ui.panel.config.integrations.config_flow.loading.${t}`,
              {
                integration: a
                  ? (0, v.Lh)(e.localize, a)
                  : e.localize(
                      "ui.panel.config.integrations.config_flow.loading.fallback_title"
                    ),
              }
            );
          },
        }),
      w = s.iv`h2{margin:24px 38px 0 0;margin-inline-start:0px;margin-inline-end:38px;padding:0 24px;padding-inline-start:24px;padding-inline-end:24px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(
      --mdc-typography-headline6-font-family,
      var(--mdc-typography-font-family, Roboto, sans-serif)
    );font-size:var(--mdc-typography-headline6-font-size, 1.25rem);line-height:var(--mdc-typography-headline6-line-height, 2rem);font-weight:var(--mdc-typography-headline6-font-weight,500);letter-spacing:var(--mdc-typography-headline6-letter-spacing, .0125em);text-decoration:var(--mdc-typography-headline6-text-decoration,inherit);text-transform:var(--mdc-typography-headline6-text-transform,inherit);box-sizing:border-box}.content,.preview{margin-top:20px;padding:0 24px}.buttons{position:relative;padding:8px 16px 8px 24px;margin:8px 0 0;color:var(--primary-color);display:flex;justify-content:flex-end}ha-markdown{overflow-wrap:break-word}ha-markdown a{color:var(--primary-color)}ha-markdown img:first-child:last-child{display:block;margin:0 auto}`;
    (0, o.Z)(
      [(0, n.Mo)("step-flow-abort")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "params",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "step",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "domain",
              value: void 0,
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, a.Z)((0, r.Z)(i.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  "missing_credentials" === this.step.reason &&
                    this._handleMissingCreds();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return "missing_credentials" === this.step.reason
                  ? s.Ld
                  : s.dy` <h2>${this.hass.localize(
                      `component.${this.domain}.title`
                    )}</h2> <div class="content"> ${this.params.flowConfig.renderAbortDescription(
                      this.hass,
                      this.step
                    )} </div> <div class="buttons"> <mwc-button @click="${
                      this._flowDone
                    }">${this.hass.localize(
                      "ui.panel.config.integrations.config_flow.close"
                    )}</mwc-button> </div> `;
              },
            },
            {
              kind: "method",
              key: "_handleMissingCreds",
              value: async function () {
                var e, t;
                this._flowDone(),
                  (e = this.params.dialogParentElement),
                  (t = {
                    selectedDomain: this.domain,
                    manifest: this.params.manifest,
                    applicationCredentialAddedCallback: () => {
                      var e;
                      b(this.params.dialogParentElement, {
                        dialogClosedCallback: this.params.dialogClosedCallback,
                        startFlowHandler: this.domain,
                        showAdvanced:
                          null === (e = this.hass.userData) || void 0 === e
                            ? void 0
                            : e.showAdvanced,
                      });
                    },
                  }),
                  (0, l.B)(e, "show-dialog", {
                    dialogTag: "dialog-add-application-credential",
                    dialogImport: f,
                    dialogParams: t,
                  });
              },
            },
            {
              kind: "method",
              key: "_flowDone",
              value: function () {
                (0, l.B)(this, "flow-update", { step: void 0 });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return w;
              },
            },
          ],
        };
      },
      s.oi
    );
    i(25718);
    (0, o.Z)(
      [(0, n.Mo)("step-flow-create-entry")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "flowConfig",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "step",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "devices",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                const t = this.hass.localize;
                return s.dy` <h2>${t(
                  "ui.panel.config.integrations.config_flow.success"
                )}!</h2> <div class="content"> ${this.flowConfig.renderCreateEntryDescription(
                  this.hass,
                  this.step
                )} ${
                  "not_loaded" ===
                  (null === (e = this.step.result) || void 0 === e
                    ? void 0
                    : e.state)
                    ? s.dy`<span class="error">${t(
                        "ui.panel.config.integrations.config_flow.not_loaded"
                      )}</span>`
                    : ""
                } ${
                  0 === this.devices.length
                    ? ""
                    : s.dy` <p> ${t(
                        "ui.panel.config.integrations.config_flow.found_following_devices"
                      )}: </p> <div class="devices"> ${this.devices.map((e) => {
                        var t;
                        return s.dy` <div class="device"> <div> <b>${(0, c.jL)(
                          e,
                          this.hass
                        )}</b><br> ${
                          e.model || e.manufacturer
                            ? s.dy`${e.model} ${
                                e.manufacturer ? s.dy`(${e.manufacturer})` : ""
                              }`
                            : s.dy` `
                        } </div> <ha-area-picker .hass="${
                          this.hass
                        }" .device="${e.id}" .value="${
                          null !== (t = e.area_id) && void 0 !== t ? t : void 0
                        }" @value-changed="${
                          this._areaPicked
                        }"></ha-area-picker> </div> `;
                      })} </div> `
                } </div> <div class="buttons"> <mwc-button @click="${
                  this._flowDone
                }">${t(
                  "ui.panel.config.integrations.config_flow.finish"
                )}</mwc-button> </div> `;
              },
            },
            {
              kind: "method",
              key: "_flowDone",
              value: function () {
                (0, l.B)(this, "flow-update", { step: void 0 });
              },
            },
            {
              kind: "method",
              key: "_areaPicked",
              value: async function (e) {
                const t = e.currentTarget,
                  i = t.device,
                  o = e.detail.value;
                try {
                  await (0, c.t1)(this.hass, i, { area_id: o });
                } catch (e) {
                  (0, u.Ys)(this, {
                    text: this.hass.localize(
                      "ui.panel.config.integrations.config_flow.error_saving_area",
                      { error: e.message }
                    ),
                  }),
                    (t.value = null);
                }
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  w,
                  s.iv`.devices{display:flex;flex-wrap:wrap;margin:-4px;max-height:600px;overflow-y:auto}.device{border:1px solid var(--divider-color);padding:5px;border-radius:4px;margin:4px;display:inline-block;width:250px}.buttons>:last-child{margin-left:auto}@media all and (max-width:450px),all and (max-height:500px){.device{width:100%}}.error{color:var(--error-color)}`,
                ];
              },
            },
          ],
        };
      },
      s.oi
    ),
      (0, o.Z)(
        [(0, n.Mo)("step-flow-external")],
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
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "flowConfig",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "step",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  const e = this.hass.localize;
                  return s.dy` <h2>${this.flowConfig.renderExternalStepHeader(
                    this.hass,
                    this.step
                  )}</h2> <div class="content"> ${this.flowConfig.renderExternalStepDescription(
                    this.hass,
                    this.step
                  )} <div class="open-button"> <a href="${
                    this.step.url
                  }" target="_blank" rel="noreferrer"> <mwc-button raised> ${e(
                    "ui.panel.config.integrations.config_flow.external_step.open_site"
                  )} </mwc-button> </a> </div> </div> `;
                },
              },
              {
                kind: "method",
                key: "firstUpdated",
                value: function (e) {
                  (0, a.Z)((0, r.Z)(i.prototype), "firstUpdated", this).call(
                    this,
                    e
                  ),
                    window.open(this.step.url);
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    w,
                    s.iv`.open-button{text-align:center;padding:24px 0}.open-button a{text-decoration:none}`,
                  ];
                },
              },
            ],
          };
        },
        s.oi
      );
    i(33829);
    var x = i(17267),
      $ = i(6429);
    i(23860);
    i(39663), i(21162);
    var C = i(92599);
    (0, o.Z)(
      [(0, n.Mo)("step-flow-form")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "flowConfig",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "step",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_loading",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_stepData",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_errorMsg",
              value: void 0,
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, a.Z)(
                  (0, r.Z)(o.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  this.removeEventListener("keydown", this._handleKeyDown);
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                const e = this.step,
                  t = this._stepDataProcessed;
                return s.dy` <h2>${this.flowConfig.renderShowFormStepHeader(
                  this.hass,
                  this.step
                )}</h2> <div class="content" @click="${
                  this._clickHandler
                }"> ${this.flowConfig.renderShowFormStepDescription(
                  this.hass,
                  this.step
                )} ${
                  this._errorMsg
                    ? s.dy`<ha-alert alert-type="error">${this._errorMsg}</ha-alert>`
                    : ""
                } <ha-form .hass="${this.hass}" .data="${t}" .disabled="${
                  this._loading
                }" @value-changed="${this._stepDataChanged}" .schema="${(0,
                C.oT)(e.data_schema)}" .error="${e.errors}" .computeLabel="${
                  this._labelCallback
                }" .computeHelper="${this._helperCallback}" .computeError="${
                  this._errorCallback
                }" .localizeValue="${
                  this._localizeValueCallback
                }"></ha-form> </div> ${
                  e.preview
                    ? s.dy`<div class="preview" @set-flow-errors="${
                        this._setError
                      }"> <h3> ${this.hass.localize(
                        "ui.panel.config.integrations.config_flow.preview"
                      )}: </h3> ${(0, x.h)(
                        `flow-preview-${this.step.preview}`,
                        {
                          hass: this.hass,
                          flowType: this.flowConfig.flowType,
                          handler: e.handler,
                          stepId: e.step_id,
                          flowId: e.flow_id,
                          stepData: t,
                        }
                      )} </div>`
                    : s.Ld
                } <div class="buttons"> ${
                  this._loading
                    ? s.dy` <div class="submit-spinner"> <ha-circular-progress indeterminate></ha-circular-progress> </div> `
                    : s.dy` <div> <mwc-button @click="${
                        this._submitStep
                      }"> ${this.flowConfig.renderShowFormStepSubmitButton(
                        this.hass,
                        this.step
                      )} </mwc-button> </div> `
                } </div> `;
              },
            },
            {
              kind: "method",
              key: "_setError",
              value: function (e) {
                this.step = { ...this.step, errors: e.detail };
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, a.Z)((0, r.Z)(o.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  setTimeout(
                    () => this.shadowRoot.querySelector("ha-form").focus(),
                    0
                  ),
                  this.addEventListener("keydown", this._handleKeyDown);
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                var t;
                (0, a.Z)((0, r.Z)(o.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  e.has("step") &&
                    null !== (t = this.step) &&
                    void 0 !== t &&
                    t.preview &&
                    i(47540)(`./flow-preview-${this.step.preview}`);
              },
            },
            {
              kind: "method",
              key: "_clickHandler",
              value: function (e) {
                (0, $.J)(e, !1) &&
                  (0, l.B)(this, "flow-update", { step: void 0 });
              },
            },
            {
              kind: "field",
              key: "_handleKeyDown",
              value() {
                return (e) => {
                  "Enter" === e.key && this._submitStep();
                };
              },
            },
            {
              kind: "get",
              key: "_stepDataProcessed",
              value: function () {
                return (
                  void 0 !== this._stepData ||
                    (this._stepData = ((e) => {
                      const t = {};
                      return (
                        e.forEach((e) => {
                          var i, o;
                          if (
                            void 0 !==
                              (null === (i = e.description) || void 0 === i
                                ? void 0
                                : i.suggested_value) &&
                            null !==
                              (null === (o = e.description) || void 0 === o
                                ? void 0
                                : o.suggested_value)
                          )
                            t[e.name] = e.description.suggested_value;
                          else if ("default" in e) t[e.name] = e.default;
                          else if (e.required)
                            if ("boolean" === e.type) t[e.name] = !1;
                            else if ("string" === e.type) t[e.name] = "";
                            else if ("integer" === e.type)
                              t[e.name] = "valueMin" in e ? e.valueMin : 0;
                            else if ("constant" === e.type) t[e.name] = e.value;
                            else if ("float" === e.type) t[e.name] = 0;
                            else if ("select" === e.type) {
                              if (e.options.length) {
                                const i = e.options[0];
                                t[e.name] = Array.isArray(i) ? i[0] : i;
                              }
                            } else if ("positive_time_period_dict" === e.type)
                              t[e.name] = { hours: 0, minutes: 0, seconds: 0 };
                            else if ("selector" in e) {
                              const i = e.selector;
                              var a;
                              if ("device" in i)
                                t[e.name] =
                                  null !== (a = i.device) &&
                                  void 0 !== a &&
                                  a.multiple
                                    ? []
                                    : "";
                              else if ("entity" in i) {
                                var r;
                                t[e.name] =
                                  null !== (r = i.entity) &&
                                  void 0 !== r &&
                                  r.multiple
                                    ? []
                                    : "";
                              } else if ("area" in i) {
                                var s;
                                t[e.name] =
                                  null !== (s = i.area) &&
                                  void 0 !== s &&
                                  s.multiple
                                    ? []
                                    : "";
                              } else if ("boolean" in i) t[e.name] = !1;
                              else if (
                                "addon" in i ||
                                "attribute" in i ||
                                "file" in i ||
                                "icon" in i ||
                                "template" in i ||
                                "text" in i ||
                                "theme" in i
                              )
                                t[e.name] = "";
                              else if ("number" in i) {
                                var n, l;
                                t[e.name] =
                                  null !==
                                    (n =
                                      null === (l = i.number) || void 0 === l
                                        ? void 0
                                        : l.min) && void 0 !== n
                                    ? n
                                    : 0;
                              } else if ("select" in i) {
                                var d;
                                if (
                                  null !== (d = i.select) &&
                                  void 0 !== d &&
                                  d.options.length
                                ) {
                                  const o = i.select.options[0],
                                    a = "string" == typeof o ? o : o.value;
                                  t[e.name] = i.select.multiple ? [a] : a;
                                }
                              } else if ("country" in i) {
                                var c;
                                null !== (c = i.country) &&
                                  void 0 !== c &&
                                  null !== (c = c.countries) &&
                                  void 0 !== c &&
                                  c.length &&
                                  (t[e.name] = i.country.countries[0]);
                              } else if ("duration" in i)
                                t[e.name] = {
                                  hours: 0,
                                  minutes: 0,
                                  seconds: 0,
                                };
                              else if ("time" in i) t[e.name] = "00:00:00";
                              else if ("date" in i || "datetime" in i) {
                                const i = new Date().toISOString().slice(0, 10);
                                t[e.name] = `${i}T00:00:00`;
                              } else if ("color_rgb" in i)
                                t[e.name] = [0, 0, 0];
                              else if ("color_temp" in i) {
                                var h, p;
                                t[e.name] =
                                  null !==
                                    (h =
                                      null === (p = i.color_temp) ||
                                      void 0 === p
                                        ? void 0
                                        : p.min_mireds) && void 0 !== h
                                    ? h
                                    : 153;
                              } else {
                                if (
                                  !(
                                    "action" in i ||
                                    "media" in i ||
                                    "target" in i
                                  )
                                )
                                  throw new Error(
                                    "Selector not supported in initial form data"
                                  );
                                t[e.name] = {};
                              }
                            }
                        }),
                        t
                      );
                    })(this.step.data_schema)),
                  this._stepData
                );
              },
            },
            {
              kind: "method",
              key: "_submitStep",
              value: async function () {
                const e = this._stepData || {};
                if (
                  !(void 0 === e
                    ? void 0 === this.step.data_schema.find((e) => e.required)
                    : e &&
                      this.step.data_schema.every(
                        (t) => !t.required || !["", void 0].includes(e[t.name])
                      ))
                )
                  return void (this._errorMsg = this.hass.localize(
                    "ui.panel.config.integrations.config_flow.not_all_required_fields"
                  ));
                (this._loading = !0), (this._errorMsg = void 0);
                const t = this.step.flow_id,
                  i = {};
                Object.keys(e).forEach((t) => {
                  const o = e[t];
                  [void 0, ""].includes(o) || (i[t] = o);
                });
                try {
                  const e = await this.flowConfig.handleFlowStep(
                    this.hass,
                    this.step.flow_id,
                    i
                  );
                  if (!this.step || t !== this.step.flow_id) return;
                  (0, l.B)(this, "flow-update", { step: e });
                } catch (e) {
                  this._errorMsg =
                    (e && e.body && e.body.message) || "Unknown error occurred";
                } finally {
                  this._loading = !1;
                }
              },
            },
            {
              kind: "method",
              key: "_stepDataChanged",
              value: function (e) {
                this._stepData = e.detail.value;
              },
            },
            {
              kind: "field",
              key: "_labelCallback",
              value() {
                return (e) =>
                  this.flowConfig.renderShowFormStepFieldLabel(
                    this.hass,
                    this.step,
                    e
                  );
              },
            },
            {
              kind: "field",
              key: "_helperCallback",
              value() {
                return (e) =>
                  this.flowConfig.renderShowFormStepFieldHelper(
                    this.hass,
                    this.step,
                    e
                  );
              },
            },
            {
              kind: "field",
              key: "_errorCallback",
              value() {
                return (e) =>
                  this.flowConfig.renderShowFormStepFieldError(
                    this.hass,
                    this.step,
                    e
                  );
              },
            },
            {
              kind: "field",
              key: "_localizeValueCallback",
              value() {
                return (e) =>
                  this.flowConfig.renderShowFormStepFieldLocalizeValue(
                    this.hass,
                    this.step,
                    e
                  );
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  h.Qx,
                  w,
                  s.iv`.error{color:red}.submit-spinner{margin-right:16px}ha-alert,ha-form{margin-top:24px;display:block}h2{word-break:break-word;padding-inline-end:72px;direction:var(--direction)}`,
                ];
              },
            },
          ],
        };
      },
      s.oi
    ),
      (0, o.Z)(
        [(0, n.Mo)("step-flow-loading")],
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
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "flowConfig",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)()],
                key: "loadingReason",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)()],
                key: "handler",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "step",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  const e = this.flowConfig.renderLoadingDescription(
                    this.hass,
                    this.loadingReason,
                    this.handler,
                    this.step
                  );
                  return s.dy` <div class="init-spinner"> ${
                    e ? s.dy`<div>${e}</div>` : ""
                  } <ha-circular-progress indeterminate></ha-circular-progress> </div> `;
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return s.iv`.init-spinner{padding:50px 100px;text-align:center}ha-circular-progress{margin-top:16px}`;
                },
              },
            ],
          };
        },
        s.oi
      );
    i(44577), i(68245);
    (0, o.Z)(
      [(0, n.Mo)("step-flow-menu")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "flowConfig",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "step",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                let e, t;
                if (Array.isArray(this.step.menu_options)) {
                  (e = this.step.menu_options), (t = {});
                  for (const i of e)
                    t[i] = this.flowConfig.renderMenuOption(
                      this.hass,
                      this.step,
                      i
                    );
                } else
                  (e = Object.keys(this.step.menu_options)),
                    (t = this.step.menu_options);
                const i = this.flowConfig.renderMenuDescription(
                  this.hass,
                  this.step
                );
                return s.dy` <h2>${this.flowConfig.renderMenuHeader(
                  this.hass,
                  this.step
                )}</h2> ${
                  i ? s.dy`<div class="content">${i}</div>` : ""
                } <div class="options"> ${e.map(
                  (e) =>
                    s.dy` <mwc-list-item hasMeta .step="${e}" @click="${this._handleStep}"> <span>${t[e]}</span> <ha-icon-next slot="meta"></ha-icon-next> </mwc-list-item> `
                )} </div> `;
              },
            },
            {
              kind: "method",
              key: "_handleStep",
              value: function (e) {
                (0, l.B)(this, "flow-update", {
                  stepPromise: this.flowConfig.handleFlowStep(
                    this.hass,
                    this.step.flow_id,
                    { next_step_id: e.currentTarget.step }
                  ),
                });
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                w,
                s.iv`.options{margin-top:20px;margin-bottom:8px}.content{padding-bottom:16px;border-bottom:1px solid var(--divider-color)}.content+.options{margin-top:8px}mwc-list-item{--mdc-list-side-padding:24px}`,
              ],
            },
          ],
        };
      },
      s.oi
    ),
      (0, o.Z)(
        [(0, n.Mo)("step-flow-progress")],
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
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "flowConfig",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, n.Cb)({ attribute: !1 })],
                key: "step",
                value: void 0,
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return s.dy` <h2> ${this.flowConfig.renderShowFormProgressHeader(
                    this.hass,
                    this.step
                  )} </h2> <div class="content"> <ha-circular-progress indeterminate></ha-circular-progress> ${this.flowConfig.renderShowFormProgressDescription(
                    this.hass,
                    this.step
                  )} </div> `;
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    w,
                    s.iv`.content{padding:50px 100px;text-align:center}ha-circular-progress{margin-bottom:16px}`,
                  ];
                },
              },
            ],
          };
        },
        s.oi
      );
    let S = 0;
    (0, o.Z)(
      [(0, n.Mo)("dialog-data-entry-flow")],
      function (e, t) {
        class i extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: i,
          d: [
            { kind: "field", key: "hass", value: void 0 },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_params",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_loading",
              value: void 0,
            },
            { kind: "field", key: "_instance", value: () => S },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_step",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_devices",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_areas",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_handler",
              value: void 0,
            },
            { kind: "field", key: "_unsubAreas", value: void 0 },
            { kind: "field", key: "_unsubDevices", value: void 0 },
            {
              kind: "field",
              key: "_unsubDataEntryFlowProgressed",
              value: void 0,
            },
            {
              kind: "method",
              key: "showDialog",
              value: async function (e) {
                (this._params = e), (this._instance = S++);
                const t = this._instance;
                let i;
                if (e.startFlowHandler) {
                  (this._loading = "loading_flow"),
                    (this._handler = e.startFlowHandler);
                  try {
                    i = await this._params.flowConfig.createFlow(
                      this.hass,
                      e.startFlowHandler
                    );
                  } catch (e) {
                    this.closeDialog();
                    let t = e.message || e.body || "Unknown error";
                    return (
                      "string" != typeof t && (t = JSON.stringify(t)),
                      void (0, u.Ys)(this, {
                        title: this.hass.localize(
                          "ui.panel.config.integrations.config_flow.error"
                        ),
                        text: `${this.hass.localize(
                          "ui.panel.config.integrations.config_flow.could_not_load"
                        )}: ${t}`,
                      })
                    );
                  }
                  if (t !== this._instance) return;
                } else {
                  if (!e.continueFlowId) return;
                  this._loading = "loading_flow";
                  try {
                    i = await e.flowConfig.fetchFlow(
                      this.hass,
                      e.continueFlowId
                    );
                  } catch (e) {
                    this.closeDialog();
                    let t = e.message || e.body || "Unknown error";
                    return (
                      "string" != typeof t && (t = JSON.stringify(t)),
                      void (0, u.Ys)(this, {
                        title: this.hass.localize(
                          "ui.panel.config.integrations.config_flow.error"
                        ),
                        text: `${this.hass.localize(
                          "ui.panel.config.integrations.config_flow.could_not_load"
                        )}: ${t}`,
                      })
                    );
                  }
                }
                t === this._instance &&
                  (this._processStep(i), (this._loading = void 0));
              },
            },
            {
              kind: "method",
              key: "closeDialog",
              value: function () {
                if (!this._params) return;
                const e = Boolean(
                  this._step &&
                    ["create_entry", "abort"].includes(this._step.type)
                );
                var t;
                (!this._step ||
                  e ||
                  this._params.continueFlowId ||
                  this._params.flowConfig.deleteFlow(
                    this.hass,
                    this._step.flow_id
                  ),
                this._step && this._params.dialogClosedCallback) &&
                  this._params.dialogClosedCallback({
                    flowFinished: e,
                    entryId:
                      "result" in this._step
                        ? null === (t = this._step.result) || void 0 === t
                          ? void 0
                          : t.entry_id
                        : void 0,
                  });
                (this._loading = void 0),
                  (this._step = void 0),
                  (this._params = void 0),
                  (this._devices = void 0),
                  (this._handler = void 0),
                  this._unsubAreas &&
                    (this._unsubAreas(), (this._unsubAreas = void 0)),
                  this._unsubDevices &&
                    (this._unsubDevices(), (this._unsubDevices = void 0)),
                  this._unsubDataEntryFlowProgressed &&
                    (this._unsubDataEntryFlowProgressed.then((e) => {
                      e();
                    }),
                    (this._unsubDataEntryFlowProgressed = void 0)),
                  (0, l.B)(this, "dialog-closed", { dialog: this.localName });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t, i, o;
                return this._params
                  ? s.dy` <ha-dialog open @closed="${
                      this.closeDialog
                    }" scrimClickAction escapeKeyAction hideActions> <div> ${
                      this._loading || null === this._step
                        ? s.dy` <step-flow-loading .flowConfig="${this._params.flowConfig}" .hass="${this.hass}" .loadingReason="${this._loading}" .handler="${this._handler}" .step="${this._step}"></step-flow-loading> `
                        : void 0 === this._step
                        ? ""
                        : s.dy` <div class="dialog-actions"> ${
                            ([
                              "form",
                              "menu",
                              "external",
                              "progress",
                              "data_entry_flow_progressed",
                            ].includes(
                              null === (e = this._step) || void 0 === e
                                ? void 0
                                : e.type
                            ) &&
                              null !== (t = this._params.manifest) &&
                              void 0 !== t &&
                              t.is_built_in) ||
                            (null !== (i = this._params.manifest) &&
                              void 0 !== i &&
                              i.documentation)
                              ? s.dy` <a href="${
                                  this._params.manifest.is_built_in
                                    ? (0, p.R)(
                                        this.hass,
                                        `/integrations/${this._params.manifest.domain}`
                                      )
                                    : null === (o = this._params) ||
                                      void 0 === o ||
                                      null === (o = o.manifest) ||
                                      void 0 === o
                                    ? void 0
                                    : o.documentation
                                }" target="_blank" rel="noreferrer noopener"> <ha-icon-button .label="${this.hass.localize(
                                  "ui.common.help"
                                )}" .path="${"M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"}"> </ha-icon-button></a> `
                              : ""
                          } <ha-icon-button .label="${this.hass.localize(
                            "ui.panel.config.integrations.config_flow.dismiss"
                          )}" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}" dialogAction="close"></ha-icon-button> </div> ${
                            "form" === this._step.type
                              ? s.dy` <step-flow-form .flowConfig="${this._params.flowConfig}" .step="${this._step}" .hass="${this.hass}"></step-flow-form> `
                              : "external" === this._step.type
                              ? s.dy` <step-flow-external .flowConfig="${this._params.flowConfig}" .step="${this._step}" .hass="${this.hass}"></step-flow-external> `
                              : "abort" === this._step.type
                              ? s.dy` <step-flow-abort .params="${this._params}" .step="${this._step}" .hass="${this.hass}" .domain="${this._step.handler}"></step-flow-abort> `
                              : "progress" === this._step.type
                              ? s.dy` <step-flow-progress .flowConfig="${this._params.flowConfig}" .step="${this._step}" .hass="${this.hass}"></step-flow-progress> `
                              : "menu" === this._step.type
                              ? s.dy` <step-flow-menu .flowConfig="${this._params.flowConfig}" .step="${this._step}" .hass="${this.hass}"></step-flow-menu> `
                              : void 0 === this._devices ||
                                void 0 === this._areas
                              ? s.dy` <step-flow-loading .flowConfig="${this._params.flowConfig}" .hass="${this.hass}" loadingReason="loading_devices_areas"></step-flow-loading> `
                              : s.dy` <step-flow-create-entry .flowConfig="${this._params.flowConfig}" .step="${this._step}" .hass="${this.hass}" .devices="${this._devices}" .areas="${this._areas}"></step-flow-create-entry> `
                          } `
                    } </div> </ha-dialog> `
                  : s.Ld;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, a.Z)((0, r.Z)(i.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  this.addEventListener("flow-update", (e) => {
                    const { step: t, stepPromise: i } = e.detail;
                    this._processStep(t || i);
                  });
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, a.Z)((0, r.Z)(i.prototype), "willUpdate", this).call(
                  this,
                  e
                ),
                  e.has("_step") &&
                    this._step &&
                    (["external", "progress"].includes(this._step.type) &&
                      this._subscribeDataEntryFlowProgressed(),
                    "create_entry" === this._step.type &&
                      (this._step.result &&
                      this._params.flowConfig.loadDevicesAndAreas
                        ? (this._fetchDevices(this._step.result.entry_id),
                          this._fetchAreas())
                        : ((this._devices = []), (this._areas = []))));
              },
            },
            {
              kind: "method",
              key: "_fetchDevices",
              value: async function (e) {
                this._unsubDevices = (0, c.q4)(this.hass.connection, (t) => {
                  this._devices = t.filter((t) => t.config_entries.includes(e));
                });
              },
            },
            {
              kind: "method",
              key: "_fetchAreas",
              value: async function () {
                this._unsubAreas = (0, d.sG)(this.hass.connection, (e) => {
                  this._areas = e;
                });
              },
            },
            {
              kind: "method",
              key: "_processStep",
              value: async function (e) {
                if (e instanceof Promise) {
                  this._loading = "loading_step";
                  try {
                    this._step = await e;
                  } catch (e) {
                    var t;
                    return (
                      this.closeDialog(),
                      void (0, u.Ys)(this, {
                        title: this.hass.localize(
                          "ui.panel.config.integrations.config_flow.error"
                        ),
                        text:
                          null == e || null === (t = e.body) || void 0 === t
                            ? void 0
                            : t.message,
                      })
                    );
                  } finally {
                    this._loading = void 0;
                  }
                } else
                  void 0 !== e
                    ? ((this._step = void 0),
                      await this.updateComplete,
                      (this._step = e))
                    : this.closeDialog();
              },
            },
            {
              kind: "method",
              key: "_subscribeDataEntryFlowProgressed",
              value: async function () {
                var e, t;
                this._unsubDataEntryFlowProgressed ||
                  (this._unsubDataEntryFlowProgressed =
                    ((e = this.hass.connection),
                    (t = async (e) => {
                      var t;
                      e.data.flow_id ===
                        (null === (t = this._step) || void 0 === t
                          ? void 0
                          : t.flow_id) &&
                        this._processStep(
                          this._params.flowConfig.fetchFlow(
                            this.hass,
                            this._step.flow_id
                          )
                        );
                    }),
                    e.subscribeEvents(t, "data_entry_flow_progressed")));
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  h.yu,
                  s.iv`ha-dialog{--dialog-content-padding:0}.dialog-actions{padding:16px;position:absolute;top:0;right:0;inset-inline-start:initial;inset-inline-end:0px;direction:var(--direction)}.dialog-actions>*{color:var(--secondary-text-color)}`,
                ];
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  84728: (e, t, i) => {
    i.d(t, { R: () => o });
    const o = (e, t) =>
      `https://${
        e.config.version.includes("b")
          ? "rc"
          : e.config.version.includes("dev")
          ? "next"
          : "www"
      }.home-assistant.io${t}`;
  },
  22129: (e, t, i) => {
    i.d(t, { B: () => h });
    var o = i(43204),
      a = i(95260),
      r = i(5095),
      s = i(53180),
      n = i(6157);
    class l extends r.oi {
      constructor() {
        super(...arguments),
          (this.value = 0),
          (this.max = 1),
          (this.indeterminate = !1),
          (this.fourColor = !1);
      }
      render() {
        const { ariaLabel: e } = this;
        return r.dy` <div class="progress ${(0, s.$)(
          this.getRenderClasses()
        )}" role="progressbar" aria-label="${
          e || r.Ld
        }" aria-valuemin="0" aria-valuemax="${this.max}" aria-valuenow="${
          this.indeterminate ? r.Ld : this.value
        }">${this.renderIndicator()}</div> `;
      }
      getRenderClasses() {
        return {
          indeterminate: this.indeterminate,
          "four-color": this.fourColor,
        };
      }
    }
    (0, n.d)(l),
      (0, o.__decorate)(
        [(0, a.Cb)({ type: Number })],
        l.prototype,
        "value",
        void 0
      ),
      (0, o.__decorate)(
        [(0, a.Cb)({ type: Number })],
        l.prototype,
        "max",
        void 0
      ),
      (0, o.__decorate)(
        [(0, a.Cb)({ type: Boolean })],
        l.prototype,
        "indeterminate",
        void 0
      ),
      (0, o.__decorate)(
        [(0, a.Cb)({ type: Boolean, attribute: "four-color" })],
        l.prototype,
        "fourColor",
        void 0
      );
    class d extends l {
      renderIndicator() {
        return this.indeterminate
          ? this.renderIndeterminateContainer()
          : this.renderDeterminateContainer();
      }
      renderDeterminateContainer() {
        const e = 100 * (1 - this.value / this.max);
        return r.dy` <svg viewBox="0 0 4800 4800"> <circle class="track" pathLength="100"></circle> <circle class="active-track" pathLength="100" stroke-dashoffset="${e}"></circle> </svg> `;
      }
      renderIndeterminateContainer() {
        return r.dy` <div class="spinner"> <div class="left"> <div class="circle"></div> </div> <div class="right"> <div class="circle"></div> </div> </div>`;
      }
    }
    const c = r.iv`:host{--_active-indicator-color:var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width:var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color:var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color:var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color:var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color:var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size:var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.active-track,.circle,.left,.progress,.right,.spinner,.track,svg{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/ 100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset .5s cubic-bezier(0, 0, .2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1.568s}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4,0,0.2,1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/ 100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) transparent transparent;animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4,0,0.2,1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-.666s,0s}@media(forced-colors:active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}`;
    let h = class extends d {};
    (h.styles = [c]),
      (h = (0, o.__decorate)([(0, a.Mo)("md-circular-progress")], h));
  },
};
//# sourceMappingURL=1675.eGE0-Ov3ks0.js.map
