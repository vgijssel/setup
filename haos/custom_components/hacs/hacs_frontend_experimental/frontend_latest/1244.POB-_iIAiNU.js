export const id = 1244;
export const ids = [1244];
export const modules = {
  52996: (e, t, i) => {
    i.d(t, { p: () => a });
    const a = (e, t) => e && e.config.components.includes(t);
  },
  86089: (e, t, i) => {
    i.d(t, { U: () => a });
    const a = (e) => e.stopPropagation();
  },
  71133: (e, t, i) => {
    var a = i(309),
      n = i(34541),
      s = i(47838),
      o = i(49412),
      l = i(3762),
      d = i(5095),
      r = i(95260),
      c = i(72218),
      u = i(2537);
    i(54371);
    (0, a.Z)(
      [(0, r.Mo)("ha-select")],
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
                return d.dy` ${(0, n.Z)(
                  (0, s.Z)(i.prototype),
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
                (0, n.Z)((0, s.Z)(i.prototype), "connectedCallback", this).call(
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
                (0, n.Z)(
                  (0, s.Z)(i.prototype),
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
                  await (0, u.y)(), this.layoutOptions();
                }, 500);
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                l.W,
                d.iv`:host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      o.K
    );
  },
  21244: (e, t, i) => {
    i.r(t), i.d(t, { HaBackupLocationSelector: () => k });
    var a = i(309),
      n = i(5095),
      s = i(95260),
      o = i(14516),
      l = i(52996),
      d = i(18394),
      r = i(86089),
      c = i(28858);
    let u = (function (e) {
        return (e.BIND = "bind"), (e.CIFS = "cifs"), (e.NFS = "nfs"), e;
      })({}),
      h = (function (e) {
        return (
          (e.BACKUP = "backup"), (e.MEDIA = "media"), (e.SHARE = "share"), e
        );
      })({});
    i(23860), i(90532), i(71133);
    const p = "/backup";
    (0, a.Z)(
      [(0, s.Mo)("ha-mount-picker")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
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
              decorators: [(0, s.Cb)()],
              key: "usage",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_mounts",
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
              key: "firstUpdated",
              value: function () {
                this._getMounts();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                if (this._error)
                  return n.dy`<ha-alert alert-type="error">${this._error}</ha-alert>`;
                if (!this._mounts) return n.Ld;
                const e = n.dy`<ha-list-item graphic="icon" .value="${p}"> <span> ${
                  this.hass.localize(
                    "ui.components.mount-picker.use_datadisk"
                  ) || "Use data disk for backup"
                } </span> <ha-svg-icon slot="graphic" .path="${"M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z"}"></ha-svg-icon> </ha-list-item>`;
                return n.dy` <ha-select .label="${
                  void 0 === this.label && this.hass
                    ? this.hass.localize("ui.components.mount-picker.mount")
                    : this.label
                }" .value="${this._value}" .required="${
                  this.required
                }" .disabled="${this.disabled}" .helper="${
                  this.helper
                }" @selected="${this._mountChanged}" @closed="${
                  r.U
                }" fixedMenuPosition naturalMenuWidth> ${
                  this.usage !== h.BACKUP ||
                  (this._mounts.default_backup_mount &&
                    this._mounts.default_backup_mount !== p)
                    ? n.Ld
                    : e
                } ${this._filterMounts(this._mounts, this.usage).map(
                  (e) =>
                    n.dy`<ha-list-item twoline graphic="icon" .value="${
                      e.name
                    }"> <span>${e.name}</span> <span slot="secondary">${
                      e.server
                    }${e.port ? `:${e.port}` : n.Ld}${
                      e.type === u.NFS ? e.path : `:${e.share}`
                    }</span> <ha-svg-icon slot="graphic" .path="${
                      e.usage === h.MEDIA
                        ? "M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M10 16V8L15 12"
                        : e.usage === h.SHARE
                        ? "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
                        : "M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z"
                    }"></ha-svg-icon> </ha-list-item>`
                )} ${
                  this.usage === h.BACKUP && this._mounts.default_backup_mount
                    ? e
                    : n.Ld
                } </ha-select> `;
              },
            },
            {
              kind: "field",
              key: "_filterMounts",
              value() {
                return (0, o.Z)((e, t) => {
                  let i = e.mounts.filter((e) =>
                    [u.CIFS, u.NFS].includes(e.type)
                  );
                  return (
                    t && (i = e.mounts.filter((e) => e.usage === t)),
                    i.sort((t, i) =>
                      t.name === e.default_backup_mount
                        ? -1
                        : i.name === e.default_backup_mount
                        ? 1
                        : (0, c.f)(t.name, i.name, this.hass.locale.language)
                    )
                  );
                });
              },
            },
            {
              kind: "method",
              key: "_getMounts",
              value: async function () {
                try {
                  (0, l.p)(this.hass, "hassio")
                    ? ((this._mounts = await (async (e) =>
                        e.callWS({
                          type: "supervisor/api",
                          endpoint: "/mounts",
                          method: "get",
                          timeout: null,
                        }))(this.hass)),
                      this.usage !== h.BACKUP ||
                        this.value ||
                        (this.value = this._mounts.default_backup_mount || p))
                    : (this._error = this.hass.localize(
                        "ui.components.mount-picker.error.no_supervisor"
                      ));
                } catch (e) {
                  this._error = this.hass.localize(
                    "ui.components.mount-picker.error.fetch_mounts"
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
              key: "_mountChanged",
              value: function (e) {
                e.stopPropagation();
                const t = e.target.value;
                t !== this._value && this._setValue(t);
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
      n.oi
    );
    let k = (0, a.Z)(
      [(0, s.Mo)("ha-selector-backup_location")],
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
                return n.dy`<ha-mount-picker .hass="${this.hass}" .value="${this.value}" .label="${this.label}" .helper="${this.helper}" .disabled="${this.disabled}" .required="${this.required}" usage="backup"></ha-mount-picker>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => n.iv`ha-mount-picker{width:100%}`,
            },
          ],
        };
      },
      n.oi
    );
  },
};
//# sourceMappingURL=1244.POB-_iIAiNU.js.map
