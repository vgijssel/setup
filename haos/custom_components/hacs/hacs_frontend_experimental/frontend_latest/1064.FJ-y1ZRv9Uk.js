export const id = 1064;
export const ids = [1064];
export const modules = {
  9828: (i, t, e) => {
    e.d(t, { i: () => p });
    var o = e(309),
      a = e(34541),
      s = e(47838),
      n = e(87762),
      r = e(91632),
      d = e(5095),
      l = e(95260),
      c = e(60625);
    e(54371);
    const h = ["button", "ha-list-item"],
      p = (i, t) => {
        var e;
        return d.dy` <div class="header_title"> <span>${t}</span> <ha-icon-button .label="${
          null !==
            (e = null == i ? void 0 : i.localize("ui.dialogs.generic.close")) &&
          void 0 !== e
            ? e
            : "Close"
        }" .path="${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}" dialogAction="close" class="header_button"></ha-icon-button> </div> `;
      };
    (0, o.Z)(
      [(0, l.Mo)("ha-dialog")],
      function (i, t) {
        class e extends t {
          constructor(...t) {
            super(...t), i(this);
          }
        }
        return {
          F: e,
          d: [
            { kind: "field", key: c.gA, value: void 0 },
            {
              kind: "method",
              key: "scrollToPos",
              value: function (i, t) {
                var e;
                null === (e = this.contentElement) ||
                  void 0 === e ||
                  e.scrollTo(i, t);
              },
            },
            {
              kind: "method",
              key: "renderHeading",
              value: function () {
                return d.dy`<slot name="heading"> ${(0, a.Z)(
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
                r.W,
                d.iv`:host([scrolled]) ::slotted(ha-dialog-header){border-bottom:1px solid var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog{--mdc-dialog-scroll-divider-color:var(
          --dialog-scroll-divider-color,
          var(--divider-color)
        );z-index:var(--dialog-z-index,8);-webkit-backdrop-filter:var(--dialog-backdrop-filter,none);backdrop-filter:var(--dialog-backdrop-filter,none);--mdc-dialog-box-shadow:var(--dialog-box-shadow, none);--mdc-typography-headline6-font-weight:400;--mdc-typography-headline6-font-size:1.574rem}.mdc-dialog__actions{justify-content:var(--justify-action-buttons,flex-end);padding-bottom:max(env(safe-area-inset-bottom),24px)}.mdc-dialog__actions span:first-child{flex:var(--secondary-action-button-flex,unset)}.mdc-dialog__actions span:nth-child(2){flex:var(--primary-action-button-flex,unset)}.mdc-dialog__container{align-items:var(--vertical-align-dialog,center)}.mdc-dialog__title{padding:24px 24px 0 24px}.mdc-dialog__actions{padding:12px 24px 12px 24px}.mdc-dialog__title::before{content:unset}.mdc-dialog .mdc-dialog__content{position:var(--dialog-content-position,relative);padding:var(--dialog-content-padding,24px)}:host([hideactions]) .mdc-dialog .mdc-dialog__content{padding-bottom:max(var(--dialog-content-padding,24px),env(safe-area-inset-bottom))}.mdc-dialog .mdc-dialog__surface{position:var(--dialog-surface-position,relative);top:var(--dialog-surface-top);margin-top:var(--dialog-surface-margin-top);min-height:var(--mdc-dialog-min-height,auto);border-radius:var(--ha-dialog-border-radius,28px)}:host([flexContent]) .mdc-dialog .mdc-dialog__content{display:flex;flex-direction:column}.header_title{position:relative;padding-right:40px;padding-inline-end:40px;padding-inline-start:initial;direction:var(--direction)}.header_title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.header_button{position:absolute;right:-8px;top:-8px;text-decoration:none;color:inherit;inset-inline-start:initial;inset-inline-end:-8px;direction:var(--direction)}.dialog-actions{inset-inline-start:initial!important;inset-inline-end:0px!important;direction:var(--direction)}`,
              ],
            },
          ],
        };
      },
      n.M
    );
  },
  3017: (i, t, e) => {
    var o = e(309),
      a = e(5095),
      s = e(95260);
    (0, o.Z)(
      [(0, s.Mo)("ha-settings-row")],
      function (i, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), i(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean, reflect: !0 })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [
                (0, s.Cb)({ type: Boolean, attribute: "three-line" }),
              ],
              key: "threeLine",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return a.dy` <div class="prefix-wrap"> <slot name="prefix"></slot> <div class="body" ?two-line="${!this
                  .threeLine}" ?three-line="${
                  this.threeLine
                }"> <slot name="heading"></slot> <div class="secondary"><slot name="description"></slot></div> </div> </div> <div class="content"><slot></slot></div> `;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return a.iv`:host{display:flex;padding:0 16px;align-content:normal;align-self:auto;align-items:center}.body{padding-top:8px;padding-bottom:8px;padding-left:0;padding-inline-start:0;padding-right:16x;padding-inline-end:16px;overflow:hidden;display:var(--layout-vertical_-_display);flex-direction:var(--layout-vertical_-_flex-direction);justify-content:var(--layout-center-justified_-_justify-content);flex:var(--layout-flex_-_flex);flex-basis:var(--layout-flex_-_flex-basis)}.body[three-line]{min-height:var(--paper-item-body-three-line-min-height,88px)}.body>*{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body>.secondary{display:block;padding-top:4px;font-family:var(
          --mdc-typography-body2-font-family,
          var(--mdc-typography-font-family, Roboto, sans-serif)
        );-webkit-font-smoothing:antialiased;font-size:var(--mdc-typography-body2-font-size, .875rem);font-weight:var(--mdc-typography-body2-font-weight,400);line-height:normal;color:var(--secondary-text-color)}.body[two-line]{min-height:calc(var(--paper-item-body-two-line-min-height,72px) - 16px);flex:1}.content{display:contents}:host(:not([narrow])) .content{display:var(--settings-row-content-display,flex);justify-content:flex-end;flex:1;padding:16px 0}.content ::slotted(*){width:var(--settings-row-content-width)}:host([narrow]){align-items:normal;flex-direction:column;border-top:1px solid var(--divider-color);padding-bottom:8px}::slotted(ha-switch){padding:16px 0}.secondary{white-space:normal}.prefix-wrap{display:var(--settings-row-prefix-display)}:host([narrow]) .prefix-wrap{display:flex;align-items:center}`;
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  91064: (i, t, e) => {
    e.r(t), e.d(t, { HacsCustomRepositoriesDialog: () => c });
    var o = e(309),
      a = (e(14271), e(82692), e(5095)),
      s = e(95260),
      n = e(18394),
      r = e(9828),
      d = (e(39663), e(3017), e(37662), e(84643)),
      l = e(46797);
    let c = (0, o.Z)(
      [(0, s.Mo)("hacs-custom-repositories-dialog")],
      function (i, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), i(this);
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
              key: "_dialogParams",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_waiting",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_errors",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_data",
              value: void 0,
            },
            { kind: "field", key: "_errorSubscription", value: void 0 },
            {
              kind: "method",
              key: "showDialog",
              value: async function (i) {
                (this._dialogParams = i),
                  (this._errorSubscription = await (0, l.CE)(
                    this.hass,
                    (i) => {
                      console.log(i),
                        (this._errors = {
                          base: (null == i ? void 0 : i.message) || i,
                        });
                    },
                    d.p.ERROR
                  )),
                  await this.updateComplete;
              },
            },
            {
              kind: "method",
              key: "closeDialog",
              value: function () {
                (this._dialogParams = void 0),
                  (this._waiting = void 0),
                  (this._errors = void 0),
                  this._errorSubscription && this._errorSubscription(),
                  (0, n.B)(this, "dialog-closed", { dialog: this.localName });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var i;
                return this._dialogParams
                  ? a.dy` <ha-dialog open scrimClickAction escapeKeyAction .heading="${(0,
                    r.i)(
                      this.hass,
                      this._dialogParams.hacs.localize(
                        "dialog_custom_repositories.title"
                      )
                    )}" @closed="${
                      this.closeDialog
                    }"> <div> <div class="list"> ${
                      null ===
                        (i = this._dialogParams.hacs.repositories.filter(
                          (i) => i.custom
                        )) || void 0 === i
                        ? void 0
                        : i
                            .filter((i) =>
                              this._dialogParams.hacs.info.categories.includes(
                                i.category
                              )
                            )
                            .map(
                              (i) =>
                                a.dy` <ha-settings-row> <span slot="heading">${
                                  i.name
                                }</span> <span slot="description">${
                                  i.full_name
                                } (${
                                  i.category
                                })</span> <mwc-icon-button @click="${(t) => {
                                  t.preventDefault(),
                                    this._removeRepository(String(i.id)),
                                    this.dispatchEvent(
                                      new CustomEvent("closed", {
                                        bubbles: !0,
                                        composed: !0,
                                      })
                                    );
                                }}"> <ha-svg-icon class="delete" .path="${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}"></ha-svg-icon> </mwc-icon-button> </ha-settings-row>`
                            )
                    } </div> <ha-form .hass="${this.hass}" .data="${
                      this._data
                    }" .schema="${[
                      { name: "repository", selector: { text: {} } },
                      {
                        name: "category",
                        selector: {
                          select: {
                            mode: "dropdown",
                            options:
                              this._dialogParams.hacs.info.categories.map(
                                (i) => ({
                                  value: i,
                                  label: this._dialogParams.hacs.localize(
                                    `common.${i}`
                                  ),
                                })
                              ),
                          },
                        },
                      },
                    ]}" .error="${this._errors}" .computeLabel="${(i) =>
                      "category" === i.name
                        ? this._dialogParams.hacs.localize(
                            "dialog_custom_repositories.category"
                          )
                        : this._dialogParams.hacs.localize(
                            "common.repository"
                          )}" @value-changed="${
                      this._valueChanged
                    }" dialogInitialFocus></ha-form> ${
                      this._waiting
                        ? a.dy`<mwc-linear-progress indeterminate></mwc-linear-progress>`
                        : a.Ld
                    } </div> <mwc-button slot="secondaryAction" @click="${
                      this.closeDialog
                    }" dialogInitialFocus> ${this._dialogParams.hacs.localize(
                      "common.cancel"
                    )} </mwc-button> <mwc-button .disabled="${
                      this._waiting ||
                      !this._data ||
                      !this._data.repository ||
                      !this._data.category
                    }" slot="primaryAction" @click="${
                      this._addRepository
                    }"> ${this._dialogParams.hacs.localize(
                      "common.add"
                    )} </mwc-button> </ha-dialog> `
                  : a.Ld;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (i) {
                this._data = { ...this._data, ...i.detail.value };
              },
            },
            {
              kind: "method",
              key: "_addRepository",
              value: async function () {
                var i, t;
                (this._errors = {}),
                  null !== (i = this._data) && void 0 !== i && i.category
                    ? null !== (t = this._data) && void 0 !== t && t.repository
                      ? ((this._waiting = !1),
                        await (0, l.NA)(
                          this.hass,
                          this._data.repository,
                          this._data.category
                        ),
                        await this._updateRepositories())
                      : (this._errors = {
                          base: this._dialogParams.hacs.localize(
                            "dialog_custom_repositories.no_repository"
                          ),
                        })
                    : (this._errors = {
                        base: this._dialogParams.hacs.localize(
                          "dialog_custom_repositories.no_category"
                        ),
                      });
              },
            },
            {
              kind: "method",
              key: "_removeRepository",
              value: async function (i) {
                (this._waiting = !0),
                  await (0, l.jN)(this.hass, i),
                  await this._updateRepositories(),
                  (this._waiting = !1);
              },
            },
            {
              kind: "method",
              key: "_updateRepositories",
              value: async function () {
                const i = await (0, l.ER)(this.hass);
                this.dispatchEvent(
                  new CustomEvent("update-hacs", {
                    detail: { repositories: i },
                    bubbles: !0,
                    composed: !0,
                  })
                ),
                  (this._dialogParams = {
                    ...this._dialogParams,
                    hacs: { ...this._dialogParams.hacs, repositories: i },
                  });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  a.iv`.list{position:relative;max-height:calc(100vh - 500px);overflow:auto}a{all:unset}mwc-linear-progress{margin-bottom:-8px;margin-top:4px}ha-svg-icon{--mdc-icon-size:36px}ha-svg-icon:not(.delete){margin-right:4px}ha-settings-row{cursor:pointer;padding:0}.delete{color:var(--hcv-color-error)}@media all and (max-width:450px),all and (max-height:500px){.list{max-height:calc(100vh - 162px)}}`,
                ];
              },
            },
          ],
        };
      },
      a.oi
    );
  },
};
//# sourceMappingURL=1064.FJ-y1ZRv9Uk.js.map
