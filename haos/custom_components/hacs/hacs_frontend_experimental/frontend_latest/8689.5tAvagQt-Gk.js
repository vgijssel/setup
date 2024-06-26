export const id = 8689;
export const ids = [8689];
export const modules = {
  47322: (e, t, a) => {
    var i = a(309),
      o = (a(44577), a(5095)),
      l = a(95260),
      n = a(18394);
    const s = (e) =>
      e.replace(/^_*(.)|_+(.)/g, (e, t, a) =>
        t ? t.toUpperCase() : " " + a.toUpperCase()
      );
    a(16591);
    const d = [],
      r = (e) =>
        o.dy` <mwc-list-item graphic="icon" .twoline="${!!e.title}"> <ha-icon .icon="${
          e.icon
        }" slot="graphic"></ha-icon> <span>${
          e.title || e.path
        }</span> <span slot="secondary">${e.path}</span> </mwc-list-item> `,
      h = (e, t, a) => {
        var i, o, l;
        return {
          path: `/${e}/${null !== (i = t.path) && void 0 !== i ? i : a}`,
          icon: null !== (o = t.icon) && void 0 !== o ? o : "mdi:view-compact",
          title:
            null !== (l = t.title) && void 0 !== l
              ? l
              : t.path
              ? s(t.path)
              : `${a}`,
        };
      },
      u = (e, t) => {
        var a;
        return {
          path: `/${t.url_path}`,
          icon:
            null !== (a = t.icon) && void 0 !== a ? a : "mdi:view-dashboard",
          title:
            t.url_path === e.defaultPanel
              ? e.localize("panel.states")
              : e.localize(`panel.${t.title}`) ||
                t.title ||
                (t.url_path ? s(t.url_path) : ""),
        };
      };
    (0, i.Z)(
      [(0, l.Mo)("ha-navigation-picker")],
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
              decorators: [(0, l.Cb)()],
              key: "label",
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
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.SB)()],
              key: "_opened",
              value: () => !1,
            },
            { kind: "field", key: "navigationItemsLoaded", value: () => !1 },
            { kind: "field", key: "navigationItems", value: () => d },
            {
              kind: "field",
              decorators: [(0, l.IO)("ha-combo-box", !0)],
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
                  a = await Promise.all(
                    t.map((e) => {
                      return ((t = this.hass.connection),
                      (a = "lovelace" === e.url_path ? null : e.url_path),
                      (i = !0),
                      t.sendMessagePromise({
                        type: "lovelace/config",
                        url_path: a,
                        force: i,
                      }))
                        .then((t) => [e.id, t])
                        .catch((t) => [e.id, void 0]);
                      var t, a, i;
                    })
                  ),
                  i = new Map(a);
                this.navigationItems = [];
                for (const t of e) {
                  this.navigationItems.push(u(this.hass, t));
                  const e = i.get(t.id);
                  e &&
                    "views" in e &&
                    e.views.forEach((e, a) =>
                      this.navigationItems.push(h(t.url_path, e, a))
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
                  this.navigationItems.forEach((a) => {
                    (a.path.toLowerCase().includes(t) ||
                      a.title.toLowerCase().includes(t)) &&
                      e.push(a);
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
  78689: (e, t, a) => {
    a.r(t), a.d(t, { HaNavigationSelector: () => s });
    var i = a(309),
      o = a(5095),
      l = a(95260),
      n = a(18394);
    a(47322);
    let s = (0, i.Z)(
      [(0, l.Mo)("ha-selector-navigation")],
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
              decorators: [(0, l.Cb)({ type: Boolean, reflect: !0 })],
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
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-navigation-picker .hass="${this.hass}" .label="${this.label}" .value="${this.value}" .required="${this.required}" .disabled="${this.disabled}" .helper="${this.helper}" @value-changed="${this._valueChanged}"></ha-navigation-picker> `;
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
};
//# sourceMappingURL=8689.5tAvagQt-Gk.js.map
