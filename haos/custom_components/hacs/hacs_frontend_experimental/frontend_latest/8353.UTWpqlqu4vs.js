/*! For license information please see 8353.UTWpqlqu4vs.js.LICENSE.txt */
export const id = 8353;
export const ids = [8353];
export const modules = {
  25551: (e, t, i) => {
    i.d(t, { u: () => o });
    var a = i(14516);
    const o = (e, t) => {
        try {
          var i, a;
          return null !==
            (i = null === (a = s(t)) || void 0 === a ? void 0 : a.of(e)) &&
            void 0 !== i
            ? i
            : e;
        } catch (t) {
          return e;
        }
      },
      s = (0, a.Z)((e) =>
        Intl && "DisplayNames" in Intl
          ? new Intl.DisplayNames(e.language, {
              type: "language",
              fallback: "code",
            })
          : void 0
      );
  },
  95352: (e, t, i) => {
    var a = i(309),
      o = i(34541),
      s = i(47838),
      n = i(5095),
      l = i(95260),
      d = i(18394),
      r = i(86089),
      c = i(25551);
    i(90532), i(71133);
    const h = "preferred",
      u = "last_used";
    (0, a.Z)(
      [(0, l.Mo)("ha-assist-pipeline-picker")],
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
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "includeLastUsed",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.SB)()],
              key: "_pipelines",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.SB)()],
              key: "_preferredPipeline",
              value: () => null,
            },
            {
              kind: "get",
              key: "_default",
              value: function () {
                return this.includeLastUsed ? u : h;
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                if (!this._pipelines) return n.Ld;
                const i =
                  null !== (e = this.value) && void 0 !== e ? e : this._default;
                return n.dy` <ha-select .label="${
                  this.label ||
                  this.hass.localize("ui.components.pipeline-picker.pipeline")
                }" .value="${i}" .required="${this.required}" .disabled="${
                  this.disabled
                }" @selected="${this._changed}" @closed="${
                  r.U
                }" fixedMenuPosition naturalMenuWidth> ${
                  this.includeLastUsed
                    ? n.dy` <ha-list-item .value="${u}"> ${this.hass.localize(
                        "ui.components.pipeline-picker.last_used"
                      )} </ha-list-item> `
                    : null
                } <ha-list-item .value="${h}"> ${this.hass.localize(
                  "ui.components.pipeline-picker.preferred",
                  {
                    preferred:
                      null ===
                        (t = this._pipelines.find(
                          (e) => e.id === this._preferredPipeline
                        )) || void 0 === t
                        ? void 0
                        : t.name,
                  }
                )} </ha-list-item> ${this._pipelines.map(
                  (e) =>
                    n.dy`<ha-list-item .value="${e.id}"> ${e.name} (${(0, c.u)(
                      e.language,
                      this.hass.locale
                    )}) </ha-list-item>`
                )} </ha-select> `;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                var t;
                (0, o.Z)((0, s.Z)(i.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  ((t = this.hass),
                  t.callWS({ type: "assist_pipeline/pipeline/list" })).then(
                    (e) => {
                      (this._pipelines = e.pipelines),
                        (this._preferredPipeline = e.preferred_pipeline);
                    }
                  );
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
                  (void 0 === this.value && t.value === this._default) ||
                  ((this.value = t.value === this._default ? void 0 : t.value),
                  (0, d.B)(this, "value-changed", { value: this.value }));
              },
            },
          ],
        };
      },
      n.oi
    );
  },
  47322: (e, t, i) => {
    var a = i(309),
      o = (i(44577), i(5095)),
      s = i(95260),
      n = i(18394);
    const l = (e) =>
      e.replace(/^_*(.)|_+(.)/g, (e, t, i) =>
        t ? t.toUpperCase() : " " + i.toUpperCase()
      );
    i(16591);
    const d = [],
      r = (e) =>
        o.dy` <mwc-list-item graphic="icon" .twoline="${!!e.title}"> <ha-icon .icon="${
          e.icon
        }" slot="graphic"></ha-icon> <span>${
          e.title || e.path
        }</span> <span slot="secondary">${e.path}</span> </mwc-list-item> `,
      c = (e, t, i) => {
        var a, o, s;
        return {
          path: `/${e}/${null !== (a = t.path) && void 0 !== a ? a : i}`,
          icon: null !== (o = t.icon) && void 0 !== o ? o : "mdi:view-compact",
          title:
            null !== (s = t.title) && void 0 !== s
              ? s
              : t.path
              ? l(t.path)
              : `${i}`,
        };
      },
      h = (e, t) => {
        var i;
        return {
          path: `/${t.url_path}`,
          icon:
            null !== (i = t.icon) && void 0 !== i ? i : "mdi:view-dashboard",
          title:
            t.url_path === e.defaultPanel
              ? e.localize("panel.states")
              : e.localize(`panel.${t.title}`) ||
                t.title ||
                (t.url_path ? l(t.url_path) : ""),
        };
      };
    (0, a.Z)(
      [(0, s.Mo)("ha-navigation-picker")],
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
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
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
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
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
              key: "_opened",
              value: () => !1,
            },
            { kind: "field", key: "navigationItemsLoaded", value: () => !1 },
            { kind: "field", key: "navigationItems", value: () => d },
            {
              kind: "field",
              decorators: [(0, s.IO)("ha-combo-box", !0)],
              key: "comboBox",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-combo-box .hass="${this.hass}" item-value-path="path" item-label-path="path" .value="${this._value}" allow-custom-value .filteredItems="${this.navigationItems}" .label="${this.label}" .helper="${this.helper}" .disabled="${this.disabled}" .required="${this.required}" .renderer="${r}" @opened-changed="${this._openedChanged}" @value-changed="${this._valueChanged}" @filter-changed="${this._filterChanged}"> </ha-combo-box> `;
              },
            },
            {
              kind: "method",
              key: "_openedChanged",
              value: async function (e) {
                (this._opened = e.detail.value),
                  this._opened &&
                    !this.navigationItemsLoaded &&
                    this._loadNavigationItems();
              },
            },
            {
              kind: "method",
              key: "_loadNavigationItems",
              value: async function () {
                this.navigationItemsLoaded = !0;
                const e = Object.entries(this.hass.panels).map(([e, t]) => ({
                    id: e,
                    ...t,
                  })),
                  t = e.filter((e) => "lovelace" === e.component_name),
                  i = await Promise.all(
                    t.map((e) => {
                      return ((t = this.hass.connection),
                      (i = "lovelace" === e.url_path ? null : e.url_path),
                      (a = !0),
                      t.sendMessagePromise({
                        type: "lovelace/config",
                        url_path: i,
                        force: a,
                      }))
                        .then((t) => [e.id, t])
                        .catch((t) => [e.id, void 0]);
                      var t, i, a;
                    })
                  ),
                  a = new Map(i);
                this.navigationItems = [];
                for (const t of e) {
                  this.navigationItems.push(h(this.hass, t));
                  const e = a.get(t.id);
                  e &&
                    "views" in e &&
                    e.views.forEach((e, i) =>
                      this.navigationItems.push(c(t.url_path, e, i))
                    );
                }
                this.comboBox.filteredItems = this.navigationItems;
              },
            },
            {
              kind: "method",
              key: "shouldUpdate",
              value: function (e) {
                return !this._opened || e.has("_opened");
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                e.stopPropagation(), this._setValue(e.detail.value);
              },
            },
            {
              kind: "method",
              key: "_setValue",
              value: function (e) {
                (this.value = e),
                  (0, n.B)(
                    this,
                    "value-changed",
                    { value: this._value },
                    { bubbles: !1, composed: !1 }
                  );
              },
            },
            {
              kind: "method",
              key: "_filterChanged",
              value: function (e) {
                const t = e.detail.value.toLowerCase();
                if (t.length >= 2) {
                  const e = [];
                  this.navigationItems.forEach((i) => {
                    (i.path.toLowerCase().includes(t) ||
                      i.title.toLowerCase().includes(t)) &&
                      e.push(i);
                  }),
                    e.length > 0
                      ? (this.comboBox.filteredItems = e)
                      : (this.comboBox.filteredItems = []);
                } else this.comboBox.filteredItems = this.navigationItems;
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
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`ha-icon,ha-svg-icon{color:var(--primary-text-color);position:relative;bottom:0px}[slot=prefix]{margin-right:8px}`;
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  41932: (e, t, i) => {
    i.r(t), i.d(t, { HaSelectorUiAction: () => p });
    var a = i(309),
      o = i(5095),
      s = i(95260),
      n = i(18394),
      l = i(34541),
      d = i(47838),
      r = i(14516),
      c = i(86089);
    i(95352), i(33829), i(37662);
    (0, a.Z)(
      [(0, s.Mo)("ha-help-tooltip")],
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
              decorators: [(0, s.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "position",
              value: () => "top",
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-svg-icon .path="${"M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"}"></ha-svg-icon> <simple-tooltip offset="4" .position="${
                  this.position
                }" .fitToVisibleBounds="${!0}">${this.label}</simple-tooltip> `;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`ha-svg-icon{--mdc-icon-size:var(--ha-help-tooltip-size, 14px);color:var(--ha-help-tooltip-color,var(--disabled-text-color))}`;
              },
            },
          ],
        };
      },
      o.oi
    );
    i(47322), i(84871);
    const h = [
        "more-info",
        "toggle",
        "navigate",
        "url",
        "call-service",
        "assist",
        "none",
      ],
      u = [{ name: "navigation_path", selector: { navigation: {} } }],
      v = [
        {
          type: "grid",
          name: "",
          schema: [
            {
              name: "pipeline_id",
              selector: { assist_pipeline: { include_last_used: !0 } },
            },
            { name: "start_listening", selector: { boolean: {} } },
          ],
        },
      ];
    (0, a.Z)(
      [(0, s.Mo)("hui-action-editor")],
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
              key: "config",
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
              key: "actions",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "defaultAction",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "tooltipText",
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
              decorators: [(0, s.IO)("ha-select")],
              key: "_select",
              value: void 0,
            },
            {
              kind: "get",
              key: "_navigation_path",
              value: function () {
                const e = this.config;
                return (null == e ? void 0 : e.navigation_path) || "";
              },
            },
            {
              kind: "get",
              key: "_url_path",
              value: function () {
                const e = this.config;
                return (null == e ? void 0 : e.url_path) || "";
              },
            },
            {
              kind: "get",
              key: "_service",
              value: function () {
                const e = this.config;
                return (null == e ? void 0 : e.service) || "";
              },
            },
            {
              kind: "field",
              key: "_serviceAction",
              value() {
                return (0, r.Z)((e) => {
                  var t;
                  return {
                    service: this._service,
                    ...(e.data || e.service_data
                      ? {
                          data:
                            null !== (t = e.data) && void 0 !== t
                              ? t
                              : e.service_data,
                        }
                      : null),
                    target: e.target,
                  };
                });
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, l.Z)((0, d.Z)(i.prototype), "updated", this).call(this, e),
                  e.has("defaultAction") &&
                    e.get("defaultAction") !== this.defaultAction &&
                    this._select.layoutOptions();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t, i, a, s, n, l, d;
                if (!this.hass) return o.Ld;
                const r = null !== (e = this.actions) && void 0 !== e ? e : h;
                return o.dy` <div class="dropdown"> <ha-select .label="${
                  this.label
                }" .configValue="${"action"}" @selected="${
                  this._actionPicked
                }" .value="${
                  null !==
                    (t =
                      null === (i = this.config) || void 0 === i
                        ? void 0
                        : i.action) && void 0 !== t
                    ? t
                    : "default"
                }" @closed="${
                  c.U
                }" fixedMenuPosition naturalMenuWidt> <mwc-list-item value="default"> ${this.hass.localize(
                  "ui.panel.lovelace.editor.action-editor.actions.default_action"
                )} ${
                  this.defaultAction
                    ? ` (${this.hass
                        .localize(
                          `ui.panel.lovelace.editor.action-editor.actions.${this.defaultAction}`
                        )
                        .toLowerCase()})`
                    : o.Ld
                } </mwc-list-item> ${r.map(
                  (e) =>
                    o.dy` <mwc-list-item .value="${e}"> ${this.hass.localize(
                      `ui.panel.lovelace.editor.action-editor.actions.${e}`
                    )} </mwc-list-item> `
                )} </ha-select> ${
                  this.tooltipText
                    ? o.dy` <ha-help-tooltip .label="${this.tooltipText}"></ha-help-tooltip> `
                    : o.Ld
                } </div> ${
                  "navigate" ===
                  (null === (a = this.config) || void 0 === a
                    ? void 0
                    : a.action)
                    ? o.dy` <ha-form .hass="${this.hass}" .schema="${u}" .data="${this.config}" .computeLabel="${this._computeFormLabel}" @value-changed="${this._formValueChanged}"> </ha-form> `
                    : o.Ld
                } ${
                  "url" ===
                  (null === (s = this.config) || void 0 === s
                    ? void 0
                    : s.action)
                    ? o.dy` <ha-textfield .label="${this.hass.localize(
                        "ui.panel.lovelace.editor.action-editor.url_path"
                      )}" .value="${
                        this._url_path
                      }" .configValue="${"url_path"}" @input="${
                        this._valueChanged
                      }"></ha-textfield> `
                    : o.Ld
                } ${
                  "call-service" ===
                  (null === (n = this.config) || void 0 === n
                    ? void 0
                    : n.action)
                    ? o.dy` <ha-service-control .hass="${
                        this.hass
                      }" .value="${this._serviceAction(
                        this.config
                      )}" .showAdvanced="${
                        null === (l = this.hass.userData) || void 0 === l
                          ? void 0
                          : l.showAdvanced
                      }" narrow @value-changed="${
                        this._serviceValueChanged
                      }"></ha-service-control> `
                    : o.Ld
                } ${
                  "assist" ===
                  (null === (d = this.config) || void 0 === d
                    ? void 0
                    : d.action)
                    ? o.dy` <ha-form .hass="${this.hass}" .schema="${v}" .data="${this.config}" .computeLabel="${this._computeFormLabel}" @value-changed="${this._formValueChanged}"> </ha-form> `
                    : o.Ld
                } `;
              },
            },
            {
              kind: "method",
              key: "_actionPicked",
              value: function (e) {
                var t;
                if ((e.stopPropagation(), !this.hass)) return;
                const i = e.target.value;
                if (
                  (null === (t = this.config) || void 0 === t
                    ? void 0
                    : t.action) === i
                )
                  return;
                if ("default" === i)
                  return void (0, n.B)(this, "value-changed", {
                    value: void 0,
                  });
                let a;
                switch (i) {
                  case "url":
                    a = { url_path: this._url_path };
                    break;
                  case "call-service":
                    a = { service: this._service };
                    break;
                  case "navigate":
                    a = { navigation_path: this._navigation_path };
                }
                (0, n.B)(this, "value-changed", { value: { action: i, ...a } });
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                var t;
                if ((e.stopPropagation(), !this.hass)) return;
                const i = e.target,
                  a =
                    null !== (t = e.target.value) && void 0 !== t
                      ? t
                      : e.target.checked;
                this[`_${i.configValue}`] !== a &&
                  i.configValue &&
                  (0, n.B)(this, "value-changed", {
                    value: { ...this.config, [i.configValue]: a },
                  });
              },
            },
            {
              kind: "method",
              key: "_formValueChanged",
              value: function (e) {
                e.stopPropagation();
                const t = e.detail.value;
                (0, n.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "method",
              key: "_computeFormLabel",
              value: function (e) {
                var t;
                return null === (t = this.hass) || void 0 === t
                  ? void 0
                  : t.localize(
                      `ui.panel.lovelace.editor.action-editor.${e.name}`
                    );
              },
            },
            {
              kind: "method",
              key: "_serviceValueChanged",
              value: function (e) {
                e.stopPropagation();
                const t = {
                  ...this.config,
                  service: e.detail.value.service || "",
                  data: e.detail.value.data,
                  target: e.detail.value.target || {},
                };
                e.detail.value.data || delete t.data,
                  "service_data" in t && delete t.service_data,
                  (0, n.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`.dropdown{position:relative}ha-help-tooltip{position:absolute;right:40px;top:16px;inset-inline-start:initial;inset-inline-end:40px;direction:var(--direction)}ha-select,ha-textfield{width:100%}ha-form,ha-navigation-picker,ha-service-control{display:block}ha-form,ha-navigation-picker,ha-service-control,ha-textfield{margin-top:8px}ha-service-control{--service-control-padding:0}ha-formfield{display:flex;height:56px;align-items:center;--mdc-typography-body2-font-size:1em}`;
              },
            },
          ],
        };
      },
      o.oi
    );
    let p = (0, a.Z)(
      [(0, s.Mo)("ha-selector-ui_action")],
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
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "selector",
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
              decorators: [(0, s.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                return o.dy` <hui-action-editor .label="${this.label}" .hass="${
                  this.hass
                }" .config="${this.value}" .actions="${
                  null === (e = this.selector.ui_action) || void 0 === e
                    ? void 0
                    : e.actions
                }" .defaultAction="${
                  null === (t = this.selector.ui_action) || void 0 === t
                    ? void 0
                    : t.default_action
                }" .tooltipText="${this.helper}" @value-changed="${
                  this._valueChanged
                }"></hui-action-editor> `;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                (0, n.B)(this, "value-changed", { value: e.detail.value });
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  52407: (e, t, i) => {
    i.d(t, { y: () => a });
    class a extends Event {
      constructor(e, t, i) {
        super("context-request", { bubbles: !0, composed: !0 }),
          (this.context = e),
          (this.callback = t),
          (this.subscribe = null != i && i);
      }
    }
  },
  58467: (e, t, i) => {
    i.d(t, { H: () => n });
    var a = i(52407);
    class o {
      constructor(e) {
        (this.subscriptions = new Map()),
          (this.updateObservers = () => {
            for (const [e, { disposer: t }] of this.subscriptions) e(this.o, t);
          }),
          void 0 !== e && (this.value = e);
      }
      get value() {
        return this.o;
      }
      set value(e) {
        this.setValue(e);
      }
      setValue(e, t = !1) {
        const i = t || !Object.is(e, this.o);
        (this.o = e), i && this.updateObservers();
      }
      addCallback(e, t, i) {
        if (!i) return void e(this.value);
        this.subscriptions.has(e) ||
          this.subscriptions.set(e, {
            disposer: () => {
              this.subscriptions.delete(e);
            },
            consumerHost: t,
          });
        const { disposer: a } = this.subscriptions.get(e);
        e(this.value, a);
      }
      clearCallbacks() {
        this.subscriptions.clear();
      }
    }
    class s extends Event {
      constructor(e) {
        super("context-provider", { bubbles: !0, composed: !0 }),
          (this.context = e);
      }
    }
    class n extends o {
      constructor(e, t, i) {
        super(void 0 !== t.context ? t.initialValue : i),
          (this.onContextRequest = (e) => {
            const t = e.composedPath()[0];
            e.context === this.context &&
              t !== this.host &&
              (e.stopPropagation(),
              this.addCallback(e.callback, t, e.subscribe));
          }),
          (this.onProviderRequest = (e) => {
            const t = e.composedPath()[0];
            if (e.context !== this.context || t === this.host) return;
            const i = new Set();
            for (const [e, { consumerHost: t }] of this.subscriptions)
              i.has(e) ||
                (i.add(e), t.dispatchEvent(new a.y(this.context, e, !0)));
            e.stopPropagation();
          }),
          (this.host = e),
          void 0 !== t.context
            ? (this.context = t.context)
            : (this.context = t),
          this.attachListeners(),
          this.host.addController(this);
      }
      attachListeners() {
        this.host.addEventListener("context-request", this.onContextRequest),
          this.host.addEventListener(
            "context-provider",
            this.onProviderRequest
          );
      }
      hostConnected() {
        this.host.dispatchEvent(new s(this.context));
      }
    }
  },
  45245: (e, t, i) => {
    function a(e) {
      return e;
    }
    i.d(t, { k: () => a });
  },
};
//# sourceMappingURL=8353.UTWpqlqu4vs.js.map
