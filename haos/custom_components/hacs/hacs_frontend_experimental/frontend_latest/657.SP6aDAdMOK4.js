export const id = 657;
export const ids = [657];
export const modules = {
  52996: (e, o, i) => {
    i.d(o, { p: () => a });
    const a = (e, o) => e && e.config.components.includes(o);
  },
  20657: (e, o, i) => {
    i.r(o), i.d(o, { HaAddonSelector: () => c });
    var a = i(309),
      d = i(5095),
      s = i(95260),
      t = i(52996),
      n = i(18394),
      r = i(28858);
    const l = (e) => e.data,
      u =
        (new Set([502, 503, 504]),
        async (e) =>
          ((e, o, i, a) => {
            const [d, s, t] = e.split(".", 3);
            return (
              Number(d) > o ||
              (Number(d) === o &&
                (void 0 === a ? Number(s) >= i : Number(s) > i)) ||
              (void 0 !== a &&
                Number(d) === o &&
                Number(s) === i &&
                Number(t) >= a)
            );
          })(e.config.version, 2021, 2, 4)
            ? e.callWS({
                type: "supervisor/api",
                endpoint: "/addons",
                method: "get",
              })
            : l(await e.callApi("GET", "hassio/addons")));
    i(23860), i(16591), i(90532);
    const h = (e) =>
      d.dy`<ha-list-item twoline graphic="icon"> <span>${
        e.name
      }</span> <span slot="secondary">${e.slug}</span> ${
        e.icon
          ? d.dy`<img alt="" slot="graphic" .src="/api/hassio/addons/${e.slug}/icon">`
          : ""
      } </ha-list-item>`;
    (0, a.Z)(
      [(0, s.Mo)("ha-addon-picker")],
      function (e, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), e(this);
            }
          },
          d: [
            { kind: "field", key: "hass", value: void 0 },
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
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_addons",
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
              decorators: [(0, s.IO)("ha-combo-box")],
              key: "_comboBox",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_error",
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
                this._getAddons();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return this._error
                  ? d.dy`<ha-alert alert-type="error">${this._error}</ha-alert>`
                  : this._addons
                  ? d.dy` <ha-combo-box .hass="${this.hass}" .label="${
                      void 0 === this.label && this.hass
                        ? this.hass.localize("ui.components.addon-picker.addon")
                        : this.label
                    }" .value="${this._value}" .required="${
                      this.required
                    }" .disabled="${this.disabled}" .helper="${
                      this.helper
                    }" .renderer="${h}" .items="${
                      this._addons
                    }" item-value-path="slug" item-id-path="slug" item-label-path="name" @value-changed="${
                      this._addonChanged
                    }"></ha-combo-box> `
                  : d.Ld;
              },
            },
            {
              kind: "method",
              key: "_getAddons",
              value: async function () {
                try {
                  if ((0, t.p)(this.hass, "hassio")) {
                    const e = await u(this.hass);
                    this._addons = e.addons
                      .filter((e) => e.version)
                      .sort((e, o) =>
                        (0, r.$)(e.name, o.name, this.hass.locale.language)
                      );
                  } else
                    this._error = this.hass.localize(
                      "ui.components.addon-picker.error.no_supervisor"
                    );
                } catch (e) {
                  this._error = this.hass.localize(
                    "ui.components.addon-picker.error.fetch_addons"
                  );
                }
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
              key: "_addonChanged",
              value: function (e) {
                e.stopPropagation();
                const o = e.detail.value;
                o !== this._value && this._setValue(o);
              },
            },
            {
              kind: "method",
              key: "_setValue",
              value: function (e) {
                (this.value = e),
                  setTimeout(() => {
                    (0, n.B)(this, "value-changed", { value: e }),
                      (0, n.B)(this, "change");
                  }, 0);
              },
            },
          ],
        };
      },
      d.oi
    );
    let c = (0, a.Z)(
      [(0, s.Mo)("ha-selector-addon")],
      function (e, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), e(this);
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
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return d.dy`<ha-addon-picker .hass="${this.hass}" .value="${this.value}" .label="${this.label}" .helper="${this.helper}" .disabled="${this.disabled}" .required="${this.required}" allow-custom-entity></ha-addon-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => d.iv`ha-addon-picker{width:100%}`,
            },
          ],
        };
      },
      d.oi
    );
  },
};
//# sourceMappingURL=657.SP6aDAdMOK4.js.map
