export const id = 5563;
export const ids = [5563];
export const modules = {
  92295: (i, o, e) => {
    var t = e(309),
      a = e(14271),
      s = e(5095),
      r = e(95260),
      l = e(3712);
    (0, t.Z)(
      [(0, r.Mo)("ha-button")],
      function (i, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), i(this);
            }
          },
          d: [
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => [
                l.W,
                s.iv`::slotted([slot=icon]){margin-inline-start:0px;margin-inline-end:8px;direction:var(--direction);display:block}.mdc-button{height:var(--button-height,36px)}.trailing-icon{display:flex}.slot-container{overflow:var(--button-slot-container-overflow,visible)}`,
              ],
            },
          ],
        };
      },
      a.z
    );
  },
  9828: (i, o, e) => {
    e.d(o, { i: () => p });
    var t = e(309),
      a = e(34541),
      s = e(47838),
      r = e(87762),
      l = e(91632),
      n = e(5095),
      d = e(95260),
      c = e(60625);
    e(54371);
    const h = ["button", "ha-list-item"],
      p = (i, o) => {
        var e;
        return n.dy` <div class="header_title"> <span>${o}</span> <ha-icon-button .label="${
          null !==
            (e = null == i ? void 0 : i.localize("ui.dialogs.generic.close")) &&
          void 0 !== e
            ? e
            : "Close"
        }" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}" dialogAction="close" class="header_button"></ha-icon-button> </div> `;
      };
    (0, t.Z)(
      [(0, d.Mo)("ha-dialog")],
      function (i, o) {
        class e extends o {
          constructor(...o) {
            super(...o), i(this);
          }
        }
        return {
          F: e,
          d: [
            { kind: "field", key: c.gA, value: void 0 },
            {
              kind: "method",
              key: "scrollToPos",
              value: function (i, o) {
                var e;
                null === (e = this.contentElement) ||
                  void 0 === e ||
                  e.scrollTo(i, o);
              },
            },
            {
              kind: "method",
              key: "renderHeading",
              value: function () {
                return n.dy`<slot name="heading"> ${(0, a.Z)(
                  (0, s.Z)(e.prototype),
                  "renderHeading",
                  this
                ).call(this)} </slot>`;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                var i;
                (0, a.Z)((0, s.Z)(e.prototype), "firstUpdated", this).call(
                  this
                ),
                  (this.suppressDefaultPressSelector = [
                    this.suppressDefaultPressSelector,
                    h,
                  ].join(", ")),
                  this._updateScrolledAttribute(),
                  null === (i = this.contentElement) ||
                    void 0 === i ||
                    i.addEventListener("scroll", this._onScroll, {
                      passive: !0,
                    });
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, a.Z)(
                  (0, s.Z)(e.prototype),
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
                l.W,
                n.iv`:host([scrolled]) ::slotted(ha-dialog-header){border-bottom:1px solid var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog{--mdc-dialog-scroll-divider-color:var(
          --dialog-scroll-divider-color,
          var(--divider-color)
        );z-index:var(--dialog-z-index,8);-webkit-backdrop-filter:var(--dialog-backdrop-filter,none);backdrop-filter:var(--dialog-backdrop-filter,none);--mdc-dialog-box-shadow:var(--dialog-box-shadow, none);--mdc-typography-headline6-font-weight:400;--mdc-typography-headline6-font-size:1.574rem}.mdc-dialog__actions{justify-content:var(--justify-action-buttons,flex-end);padding-bottom:max(env(safe-area-inset-bottom),24px)}.mdc-dialog__actions span:first-child{flex:var(--secondary-action-button-flex,unset)}.mdc-dialog__actions span:nth-child(2){flex:var(--primary-action-button-flex,unset)}.mdc-dialog__container{align-items:var(--vertical-align-dialog,center)}.mdc-dialog__title{padding:24px 24px 0 24px}.mdc-dialog__actions{padding:12px 24px 12px 24px}.mdc-dialog__title::before{content:unset}.mdc-dialog .mdc-dialog__content{position:var(--dialog-content-position,relative);padding:var(--dialog-content-padding,24px)}:host([hideactions]) .mdc-dialog .mdc-dialog__content{padding-bottom:max(var(--dialog-content-padding,24px),env(safe-area-inset-bottom))}.mdc-dialog .mdc-dialog__surface{position:var(--dialog-surface-position,relative);top:var(--dialog-surface-top);margin-top:var(--dialog-surface-margin-top);min-height:var(--mdc-dialog-min-height,auto);border-radius:var(--ha-dialog-border-radius,28px)}:host([flexContent]) .mdc-dialog .mdc-dialog__content{display:flex;flex-direction:column}.header_title{position:relative;padding-right:40px;padding-inline-end:40px;padding-inline-start:initial;direction:var(--direction)}.header_title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.header_button{position:absolute;right:-8px;top:-8px;text-decoration:none;color:inherit;inset-inline-start:initial;inset-inline-end:-8px;direction:var(--direction)}.dialog-actions{inset-inline-start:initial!important;inset-inline-end:0px!important;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      r.M
    );
  },
  25563: (i, o, e) => {
    e.r(o), e.d(o, { HacsDonwloadDialog: () => f });
    var t = e(309),
      a = (e(14271), e(82692), e(5095)),
      s = e(95260),
      r = e(14516),
      l = e(18394),
      n = e(67684),
      d = e(51750),
      c = (e(23860), e(92295), e(9828), e(39663), e(11285)),
      h = e(84643),
      p = e(8179),
      g = e(46797),
      _ = e(61422),
      m = e(32218),
      u = e(23792);
    const v = (i) =>
      `/hacsfiles/${i.repository.full_name.split("/")[1]}/${
        i.repository.file_name
      }${
        i.skipTag
          ? ""
          : `?hacstag=${((i, o) =>
              String(
                `${i.id}${(
                  o ||
                  i.installed_version ||
                  i.selected_tag ||
                  i.available_version
                ).replace(/\D+/g, "")}`
              ))(i.repository, i.version)}`
      }`;
    var y = e(25287);
    let f = (0, t.Z)(
      [(0, s.Mo)("hacs-download-dialog")],
      function (i, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), i(this);
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
              decorators: [(0, s.SB)()],
              key: "_waiting",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_installing",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_error",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_repository",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_dialogParams",
              value: void 0,
            },
            {
              kind: "method",
              key: "showDialog",
              value: async function (i) {
                (this._dialogParams = i),
                  (this._waiting = !1),
                  i.repository
                    ? (this._repository = i.repository)
                    : await this._fetchRepository(),
                  (0, g.CE)(
                    this.hass,
                    (i) => {
                      (this._error = i), (this._installing = !1);
                    },
                    h.p.ERROR
                  ),
                  await this.updateComplete;
              },
            },
            {
              kind: "method",
              key: "closeDialog",
              value: function () {
                (this._dialogParams = void 0),
                  (this._repository = void 0),
                  (this._error = void 0),
                  (this._installing = !1),
                  (this._waiting = !1),
                  (0, l.B)(this, "dialog-closed", { dialog: this.localName });
              },
            },
            {
              kind: "field",
              key: "_getInstallPath",
              value: () =>
                (0, r.Z)((i) => {
                  let o = i.local_path;
                  return (
                    ["template", "theme", "python_script"].includes(
                      i.category
                    ) && (o = `${o}/${i.file_name}`),
                    o
                  );
                }),
            },
            {
              kind: "method",
              key: "_fetchRepository",
              value: async function () {
                this._repository = await (0, p.nj)(
                  this.hass,
                  this._dialogParams.repositoryId
                );
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var i;
                if (!this._dialogParams || !this._repository) return a.Ld;
                const o = this._getInstallPath(this._repository),
                  e = [
                    { name: "beta", selector: { boolean: {} } },
                    {
                      name: "version",
                      selector: {
                        select: {
                          options: this._repository.releases.concat(
                            "hacs/integration" === this._repository.full_name ||
                              this._repository.hide_default_branch
                              ? []
                              : [this._repository.default_branch]
                          ),
                          mode: "dropdown",
                        },
                      },
                    },
                  ];
                return a.dy` <ha-dialog open scrimClickAction escapeKeyAction .heading="${
                  this._repository.name
                }" @closed="${this.closeDialog}"> <div class="content"> ${
                  "version" === this._repository.version_or_commit &&
                  this._repository.installed
                    ? a.dy` <ha-form .disabled="${this._waiting}" .data="${
                        "version" === this._repository.version_or_commit
                          ? {
                              beta: this._repository.beta,
                              version: this._repository.releases[0],
                            }
                          : {}
                      }" .schema="${e}" .computeLabel="${(i) =>
                        "beta" === i.name
                          ? this._dialogParams.hacs.localize(
                              "dialog_download.show_beta"
                            )
                          : this._dialogParams.hacs.localize(
                              "dialog_download.select_version"
                            )}" @value-changed="${
                        this._valueChanged
                      }"> </ha-form> <ha-alert alert-type="info" .rtl="${(0,
                      d.HE)(this.hass)}"> ${this._dialogParams.hacs.localize(
                        "dialog_download.selector_note"
                      )} <a class="learn_more" href="${(0, y.R)({
                        path: "/docs/entities/update_entities#install-service",
                        experimental: this._dialogParams.hacs.info.experimental,
                      })}" slot="action" target="_blank" rel="noreferrer"> ${this._dialogParams.hacs.localize(
                        "common.learn_more"
                      )}</a> </ha-alert> `
                    : a.Ld
                } ${
                  this._repository.can_download
                    ? ""
                    : a.dy`<ha-alert alert-type="error" .rtl="${(0, d.HE)(
                        this.hass
                      )}"> ${this._dialogParams.hacs.localize(
                        "confirm.home_assistant_version_not_correct",
                        {
                          haversion: this.hass.config.version,
                          minversion: this._repository.homeassistant,
                        }
                      )} </ha-alert>`
                } <div class="note"> ${this._dialogParams.hacs.localize(
                  "dialog_download.note_downloaded",
                  { location: a.dy`<code>'${o}'</code>` }
                )} ${
                  "plugin" === this._repository.category &&
                  "storage" !== this._dialogParams.hacs.info.lovelace_mode
                    ? a.dy` <p>${this._dialogParams.hacs.localize(
                        "dialog_download.lovelace_instruction"
                      )}</p> <pre>
                url: ${v({ repository: this._repository, skipTag: !0 })}
                type: module
                </pre> `
                    : a.Ld
                } ${
                  "integration" === this._repository.category
                    ? a.dy`<p>${this._dialogParams.hacs.localize(
                        "dialog_download.restart"
                      )}</p>`
                    : a.Ld
                } </div> ${
                  null !== (i = this._error) && void 0 !== i && i.message
                    ? a.dy`<ha-alert alert-type="error" .rtl="${(0, d.HE)(
                        this.hass
                      )}"> ${this._error.message} </ha-alert>`
                    : a.Ld
                } ${
                  this._installing
                    ? a.dy`<mwc-linear-progress indeterminate></mwc-linear-progress>`
                    : a.Ld
                } </div> <mwc-button slot="secondaryAction" @click="${
                  this.closeDialog
                }" dialogInitialFocus> ${this._dialogParams.hacs.localize(
                  "common.cancel"
                )} </mwc-button> <mwc-button slot="primaryAction" ?disabled="${
                  !this._repository.can_download ||
                  this._waiting ||
                  this._installing
                }" @click="${
                  this._installRepository
                }"> ${this._dialogParams.hacs.localize(
                  "common.download"
                )} </mwc-button> </ha-dialog> `;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: async function (i) {
                let o = !1;
                this._repository.beta !== i.detail.value.beta &&
                  ((o = !0),
                  (this._waiting = !0),
                  await (0, g.EK)(
                    this.hass,
                    this._dialogParams.repositoryId,
                    i.detail.value.beta
                  )),
                  i.detail.value.version &&
                    ((o = !0),
                    (this._waiting = !0),
                    await (0, p.zD)(
                      this.hass,
                      this._dialogParams.repositoryId,
                      i.detail.value.version
                    )),
                  o && (await this._fetchRepository(), (this._waiting = !1));
              },
            },
            {
              kind: "method",
              key: "_installRepository",
              value: async function () {
                if (
                  ((this._installing = !0),
                  (this._error = void 0),
                  !this._repository)
                )
                  return;
                const i =
                  this._repository.selected_tag ||
                  this._repository.available_version ||
                  this._repository.default_branch;
                try {
                  var o;
                  await (0, p.hZ)(
                    this.hass,
                    String(this._repository.id),
                    "commit" !==
                      (null === (o = this._repository) || void 0 === o
                        ? void 0
                        : o.version_or_commit)
                      ? i
                      : void 0
                  );
                } catch (i) {
                  return (
                    (this._error = i || {
                      message:
                        "Could not download repository, check core logs for more information.",
                    }),
                    void (this._installing = !1)
                  );
                }
                this._dialogParams.hacs.log.debug(
                  this._repository.category,
                  "_installRepository"
                ),
                  this._dialogParams.hacs.log.debug(
                    this._dialogParams.hacs.info.lovelace_mode,
                    "_installRepository"
                  ),
                  "plugin" === this._repository.category &&
                    "storage" === this._dialogParams.hacs.info.lovelace_mode &&
                    (await (async function (i, o, e) {
                      const t = new u.J("updateLovelaceResources"),
                        a = await (0, m.eL)(i.connection),
                        s = `/hacsfiles/${o.full_name.split("/")[1]}`,
                        r = v({ repository: o, version: e }),
                        l = a.find((i) => i.url.includes(s));
                      t.debug({ namespace: s, url: r, exsisting: l }),
                        l && l.url !== r
                          ? (t.debug(`Updating exsusting resource for ${s}`),
                            await (0, m.id)(i, l.id, {
                              url: r,
                              res_type: l.type,
                            }))
                          : a.map((i) => i.url).includes(r) ||
                            (t.debug(`Adding ${r} to Lovelace resources`),
                            await (0, m.SN)(i, { url: r, res_type: "module" }));
                    })(this.hass, this._repository, i)),
                  (this._installing = !1),
                  "plugin" === this._repository.category &&
                    (0, c.g7)(this, {
                      title: this._dialogParams.hacs.localize("common.reload"),
                      text: a.dy`${this._dialogParams.hacs.localize(
                        "dialog.reload.description"
                      )}<br>${this._dialogParams.hacs.localize(
                        "dialog.reload.confirm"
                      )}`,
                      dismissText:
                        this._dialogParams.hacs.localize("common.cancel"),
                      confirmText:
                        this._dialogParams.hacs.localize("common.reload"),
                      confirm: () => {
                        n.E.location.href = n.E.location.href;
                      },
                    }),
                  void 0 === this._error && this.closeDialog();
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  _.w,
                  a.iv`.note{margin-top:12px}.lovelace{margin-top:8px}.learn_more{color:var(--hcv-text-color-primary)}pre{white-space:pre-line;user-select:all}mwc-linear-progress{margin-bottom:-8px;margin-top:4px}`,
                ];
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  8179: (i, o, e) => {
    e.d(o, { hZ: () => a, nj: () => t, zD: () => s });
    const t = async (i, o) =>
        i.connection.sendMessagePromise({
          type: "hacs/repository/info",
          repository_id: o,
        }),
      a = async (i, o, e) =>
        i.connection.sendMessagePromise({
          type: "hacs/repository/download",
          repository: o,
          version: e,
        }),
      s = async (i, o, e) =>
        i.connection.sendMessagePromise({
          type: "hacs/repository/version",
          repository: o,
          version: e,
        });
  },
  25287: (i, o, e) => {
    e.d(o, { R: () => t });
    const t = (i) =>
      `https://${
        null != i && i.experimental ? "experimental.hacs.xyz" : "www.hacs.xyz"
      }${(null == i ? void 0 : i.path) || ""}`;
  },
};
//# sourceMappingURL=5563.oU9QcJqDoTY.js.map
