export const id = 3395;
export const ids = [3395];
export const modules = {
  93395: (e, i, t) => {
    t.r(i), t.d(i, { HaConfigEntrySelector: () => h });
    var o = t(309),
      a = t(5095),
      n = t(95260),
      d = (t(44577), t(18394)),
      s = t(28858),
      r = t(60470),
      l = t(64346),
      c = t(72824);
    t(16591);
    (0, o.Z)(
      [(0, n.Mo)("ha-config-entry-picker")],
      function (e, i) {
        return {
          F: class extends i {
            constructor(...i) {
              super(...i), e(this);
            }
          },
          d: [
            { kind: "field", key: "hass", value: void 0 },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "integration",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "value",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_configEntries",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.IO)("ha-combo-box")],
              key: "_comboBox",
              value: void 0,
            },
            {
              kind: "method",
              key: "open",
              value: function () {
                var e;
                null === (e = this._comboBox) || void 0 === e || e.open();
              },
            },
            {
              kind: "method",
              key: "focus",
              value: function () {
                var e;
                null === (e = this._comboBox) || void 0 === e || e.focus();
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                this._getConfigEntries();
              },
            },
            {
              kind: "field",
              key: "_rowRenderer",
              value() {
                return (e) => {
                  var i;
                  return a.dy`<mwc-list-item twoline graphic="icon"> <span>${
                    e.title ||
                    this.hass.localize(
                      "ui.panel.config.integrations.config_entry.unnamed_entry"
                    )
                  }</span> <span slot="secondary">${
                    e.localized_domain_name
                  }</span> <img alt="" slot="graphic" src="${(0, c.X1)({
                    domain: e.domain,
                    type: "icon",
                    darkOptimized:
                      null === (i = this.hass.themes) || void 0 === i
                        ? void 0
                        : i.darkMode,
                  })}" crossorigin="anonymous" referrerpolicy="no-referrer" @error="${
                    this._onImageError
                  }" @load="${this._onImageLoad}"> </mwc-list-item>`;
                };
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return this._configEntries
                  ? a.dy` <ha-combo-box .hass="${this.hass}" .label="${
                      void 0 === this.label && this.hass
                        ? this.hass.localize(
                            "ui.components.config-entry-picker.config_entry"
                          )
                        : this.label
                    }" .value="${this._value}" .required="${
                      this.required
                    }" .disabled="${this.disabled}" .helper="${
                      this.helper
                    }" .renderer="${this._rowRenderer}" .items="${
                      this._configEntries
                    }" item-value-path="entry_id" item-id-path="entry_id" item-label-path="title" @value-changed="${
                      this._valueChanged
                    }"></ha-combo-box> `
                  : a.Ld;
              },
            },
            {
              kind: "method",
              key: "_onImageLoad",
              value: function (e) {
                e.target.style.visibility = "initial";
              },
            },
            {
              kind: "method",
              key: "_onImageError",
              value: function (e) {
                e.target.style.visibility = "hidden";
              },
            },
            {
              kind: "method",
              key: "_getConfigEntries",
              value: async function () {
                (0, r.pB)(this.hass, {
                  type: ["device", "hub", "service"],
                  domain: this.integration,
                }).then((e) => {
                  this._configEntries = e
                    .map((e) => ({
                      ...e,
                      localized_domain_name: (0, l.Lh)(
                        this.hass.localize,
                        e.domain
                      ),
                    }))
                    .sort((e, i) =>
                      (0, s.f)(
                        e.localized_domain_name + e.title,
                        i.localized_domain_name + i.title,
                        this.hass.locale.language
                      )
                    );
                });
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
              key: "_valueChanged",
              value: function (e) {
                e.stopPropagation();
                const i = e.detail.value;
                i !== this._value && this._setValue(i);
              },
            },
            {
              kind: "method",
              key: "_setValue",
              value: function (e) {
                (this.value = e),
                  setTimeout(() => {
                    (0, d.B)(this, "value-changed", { value: e }),
                      (0, d.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      a.oi
    );
    let h = (0, o.Z)(
      [(0, n.Mo)("ha-selector-config_entry")],
      function (e, i) {
        return {
          F: class extends i {
            constructor(...i) {
              super(...i), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return a.dy`<ha-config-entry-picker .hass="${
                  this.hass
                }" .value="${this.value}" .label="${this.label}" .helper="${
                  this.helper
                }" .disabled="${this.disabled}" .required="${
                  this.required
                }" .integration="${
                  null === (e = this.selector.config_entry) || void 0 === e
                    ? void 0
                    : e.integration
                }" allow-custom-entity></ha-config-entry-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => a.iv`ha-config-entry-picker{width:100%}`,
            },
          ],
        };
      },
      a.oi
    );
  },
  64346: (e, i, t) => {
    t.d(i, { F3: () => a, Lh: () => o, t4: () => n });
    const o = (e, i, t) =>
        e(`component.${i}.title`) || (null == t ? void 0 : t.name) || i,
      a = (e, i) => {
        const t = { type: "manifest/list" };
        return i && (t.integrations = i), e.callWS(t);
      },
      n = (e, i) => e.callWS({ type: "manifest/get", integration: i });
  },
  72824: (e, i, t) => {
    t.d(i, { X1: () => o, u4: () => a, zC: () => n });
    const o = (e) =>
        `https://brands.home-assistant.io/${e.brand ? "brands/" : ""}${
          e.useFallback ? "_/" : ""
        }${e.domain}/${e.darkOptimized ? "dark_" : ""}${e.type}.png`,
      a = (e) => e.split("/")[4],
      n = (e) => e.startsWith("https://brands.home-assistant.io/");
  },
};
//# sourceMappingURL=3395.JUkRe_aqO38.js.map
