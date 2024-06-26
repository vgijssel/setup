"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1064],
  {
    9828: function (t, e, i) {
      i.d(e, {
        i: function () {
          return b;
        },
      });
      var o,
        a,
        n,
        r = i(33368),
        s = i(71650),
        d = i(68308),
        l = i(82390),
        c = i(69205),
        h = i(91808),
        p = i(34541),
        u = i(47838),
        g = i(88962),
        m = (i(97393), i(91989), i(87762)),
        v = i(91632),
        f = i(5095),
        y = i(95260),
        _ = i(60625),
        x = (i(54371), ["button", "ha-list-item"]),
        b = function (t, e) {
          var i;
          return (0, f.dy)(
            o ||
              (o = (0, g.Z)([
                ' <div class="header_title"> <span>',
                '</span> <ha-icon-button .label="',
                '" .path="',
                '" dialogAction="close" class="header_button"></ha-icon-button> </div> ',
              ])),
            e,
            null !==
              (i =
                null == t ? void 0 : t.localize("ui.dialogs.generic.close")) &&
              void 0 !== i
              ? i
              : "Close",
            "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          );
        };
      (0, h.Z)(
        [(0, y.Mo)("ha-dialog")],
        function (t, e) {
          var i = (function (e) {
            function i() {
              var e;
              (0, s.Z)(this, i);
              for (
                var o = arguments.length, a = new Array(o), n = 0;
                n < o;
                n++
              )
                a[n] = arguments[n];
              return (e = (0, d.Z)(this, i, [].concat(a))), t((0, l.Z)(e)), e;
            }
            return (0, c.Z)(i, e), (0, r.Z)(i);
          })(e);
          return {
            F: i,
            d: [
              { kind: "field", key: _.gA, value: void 0 },
              {
                kind: "method",
                key: "scrollToPos",
                value: function (t, e) {
                  var i;
                  null === (i = this.contentElement) ||
                    void 0 === i ||
                    i.scrollTo(t, e);
                },
              },
              {
                kind: "method",
                key: "renderHeading",
                value: function () {
                  return (0, f.dy)(
                    a || (a = (0, g.Z)(['<slot name="heading"> ', " </slot>"])),
                    (0, p.Z)((0, u.Z)(i.prototype), "renderHeading", this).call(
                      this
                    )
                  );
                },
              },
              {
                kind: "method",
                key: "firstUpdated",
                value: function () {
                  var t;
                  (0, p.Z)((0, u.Z)(i.prototype), "firstUpdated", this).call(
                    this
                  ),
                    (this.suppressDefaultPressSelector = [
                      this.suppressDefaultPressSelector,
                      x,
                    ].join(", ")),
                    this._updateScrolledAttribute(),
                    null === (t = this.contentElement) ||
                      void 0 === t ||
                      t.addEventListener("scroll", this._onScroll, {
                        passive: !0,
                      });
                },
              },
              {
                kind: "method",
                key: "disconnectedCallback",
                value: function () {
                  (0, p.Z)(
                    (0, u.Z)(i.prototype),
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
                value: function () {
                  var t = this;
                  return function () {
                    t._updateScrolledAttribute();
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
                value: function () {
                  return [
                    v.W,
                    (0, f.iv)(
                      n ||
                        (n = (0, g.Z)([
                          ":host([scrolled]) ::slotted(ha-dialog-header){border-bottom:1px solid var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog{--mdc-dialog-scroll-divider-color:var(\n          --dialog-scroll-divider-color,\n          var(--divider-color)\n        );z-index:var(--dialog-z-index,8);-webkit-backdrop-filter:var(--dialog-backdrop-filter,none);backdrop-filter:var(--dialog-backdrop-filter,none);--mdc-dialog-box-shadow:var(--dialog-box-shadow, none);--mdc-typography-headline6-font-weight:400;--mdc-typography-headline6-font-size:1.574rem}.mdc-dialog__actions{justify-content:var(--justify-action-buttons,flex-end);padding-bottom:max(env(safe-area-inset-bottom),24px)}.mdc-dialog__actions span:first-child{flex:var(--secondary-action-button-flex,unset)}.mdc-dialog__actions span:nth-child(2){flex:var(--primary-action-button-flex,unset)}.mdc-dialog__container{align-items:var(--vertical-align-dialog,center)}.mdc-dialog__title{padding:24px 24px 0 24px}.mdc-dialog__actions{padding:12px 24px 12px 24px}.mdc-dialog__title::before{content:unset}.mdc-dialog .mdc-dialog__content{position:var(--dialog-content-position,relative);padding:var(--dialog-content-padding,24px)}:host([hideactions]) .mdc-dialog .mdc-dialog__content{padding-bottom:max(var(--dialog-content-padding,24px),env(safe-area-inset-bottom))}.mdc-dialog .mdc-dialog__surface{position:var(--dialog-surface-position,relative);top:var(--dialog-surface-top);margin-top:var(--dialog-surface-margin-top);min-height:var(--mdc-dialog-min-height,auto);border-radius:var(--ha-dialog-border-radius,28px)}:host([flexContent]) .mdc-dialog .mdc-dialog__content{display:flex;flex-direction:column}.header_title{position:relative;padding-right:40px;padding-inline-end:40px;padding-inline-start:initial;direction:var(--direction)}.header_title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.header_button{position:absolute;right:-8px;top:-8px;text-decoration:none;color:inherit;inset-inline-start:initial;inset-inline-end:-8px;direction:var(--direction)}.dialog-actions{inset-inline-start:initial!important;inset-inline-end:0px!important;direction:var(--direction)}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        m.M
      );
    },
    3017: function (t, e, i) {
      var o,
        a,
        n = i(88962),
        r = i(33368),
        s = i(71650),
        d = i(68308),
        l = i(82390),
        c = i(69205),
        h = i(91808),
        p = (i(97393), i(5095)),
        u = i(95260);
      (0, h.Z)(
        [(0, u.Mo)("ha-settings-row")],
        function (t, e) {
          var i = (function (e) {
            function i() {
              var e;
              (0, s.Z)(this, i);
              for (
                var o = arguments.length, a = new Array(o), n = 0;
                n < o;
                n++
              )
                a[n] = arguments[n];
              return (e = (0, d.Z)(this, i, [].concat(a))), t((0, l.Z)(e)), e;
            }
            return (0, c.Z)(i, e), (0, r.Z)(i);
          })(e);
          return {
            F: i,
            d: [
              {
                kind: "field",
                decorators: [(0, u.Cb)({ type: Boolean, reflect: !0 })],
                key: "narrow",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, u.Cb)({ type: Boolean, attribute: "three-line" }),
                ],
                key: "threeLine",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, p.dy)(
                    o ||
                      (o = (0, n.Z)([
                        ' <div class="prefix-wrap"> <slot name="prefix"></slot> <div class="body" ?two-line="',
                        '" ?three-line="',
                        '"> <slot name="heading"></slot> <div class="secondary"><slot name="description"></slot></div> </div> </div> <div class="content"><slot></slot></div> ',
                      ])),
                    !this.threeLine,
                    this.threeLine
                  );
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, p.iv)(
                    a ||
                      (a = (0, n.Z)([
                        ":host{display:flex;padding:0 16px;align-content:normal;align-self:auto;align-items:center}.body{padding-top:8px;padding-bottom:8px;padding-left:0;padding-inline-start:0;padding-right:16x;padding-inline-end:16px;overflow:hidden;display:var(--layout-vertical_-_display);flex-direction:var(--layout-vertical_-_flex-direction);justify-content:var(--layout-center-justified_-_justify-content);flex:var(--layout-flex_-_flex);flex-basis:var(--layout-flex_-_flex-basis)}.body[three-line]{min-height:var(--paper-item-body-three-line-min-height,88px)}.body>*{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body>.secondary{display:block;padding-top:4px;font-family:var(\n          --mdc-typography-body2-font-family,\n          var(--mdc-typography-font-family, Roboto, sans-serif)\n        );-webkit-font-smoothing:antialiased;font-size:var(--mdc-typography-body2-font-size, .875rem);font-weight:var(--mdc-typography-body2-font-weight,400);line-height:normal;color:var(--secondary-text-color)}.body[two-line]{min-height:calc(var(--paper-item-body-two-line-min-height,72px) - 16px);flex:1}.content{display:contents}:host(:not([narrow])) .content{display:var(--settings-row-content-display,flex);justify-content:flex-end;flex:1;padding:16px 0}.content ::slotted(*){width:var(--settings-row-content-width)}:host([narrow]){align-items:normal;flex-direction:column;border-top:1px solid var(--divider-color);padding-bottom:8px}::slotted(ha-switch){padding:16px 0}.secondary{white-space:normal}.prefix-wrap{display:var(--settings-row-prefix-display)}:host([narrow]) .prefix-wrap{display:flex;align-items:center}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        p.oi
      );
    },
    91064: function (t, e, i) {
      i.r(e),
        i.d(e, {
          HacsCustomRepositoriesDialog: function () {
            return k;
          },
        });
      var o,
        a,
        n,
        r,
        s = i(88962),
        d = i(99312),
        l = i(81043),
        c = i(33368),
        h = i(71650),
        p = i(68308),
        u = i(82390),
        g = i(69205),
        m = i(91808),
        v =
          (i(97393),
          i(87438),
          i(46798),
          i(9849),
          i(22890),
          i(46349),
          i(70320),
          i(40271),
          i(60163),
          i(22859),
          i(85717),
          i(14271),
          i(82692),
          i(5095)),
        f = i(95260),
        y = i(18394),
        _ = i(9828),
        x = (i(39663), i(3017), i(37662), i(84643)),
        b = i(46797),
        k = (0, m.Z)(
          [(0, f.Mo)("hacs-custom-repositories-dialog")],
          function (t, e) {
            var i,
              m,
              k,
              w,
              Z = (function (e) {
                function i() {
                  var e;
                  (0, h.Z)(this, i);
                  for (
                    var o = arguments.length, a = new Array(o), n = 0;
                    n < o;
                    n++
                  )
                    a[n] = arguments[n];
                  return (
                    (e = (0, p.Z)(this, i, [].concat(a))), t((0, u.Z)(e)), e
                  );
                }
                return (0, g.Z)(i, e), (0, c.Z)(i);
              })(e);
            return {
              F: Z,
              d: [
                {
                  kind: "field",
                  decorators: [(0, f.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, f.SB)()],
                  key: "_dialogParams",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, f.SB)()],
                  key: "_waiting",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, f.SB)()],
                  key: "_errors",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, f.SB)()],
                  key: "_data",
                  value: void 0,
                },
                { kind: "field", key: "_errorSubscription", value: void 0 },
                {
                  kind: "method",
                  key: "showDialog",
                  value:
                    ((w = (0, l.Z)(
                      (0, d.Z)().mark(function t(e) {
                        var i = this;
                        return (0, d.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (this._dialogParams = e),
                                    (t.next = 3),
                                    (0, b.CE)(
                                      this.hass,
                                      function (t) {
                                        console.log(t),
                                          (i._errors = {
                                            base:
                                              (null == t
                                                ? void 0
                                                : t.message) || t,
                                          });
                                      },
                                      x.p.ERROR
                                    )
                                  );
                                case 3:
                                  return (
                                    (this._errorSubscription = t.sent),
                                    (t.next = 6),
                                    this.updateComplete
                                  );
                                case 6:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this
                        );
                      })
                    )),
                    function (t) {
                      return w.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "closeDialog",
                  value: function () {
                    (this._dialogParams = void 0),
                      (this._waiting = void 0),
                      (this._errors = void 0),
                      this._errorSubscription && this._errorSubscription(),
                      (0, y.B)(this, "dialog-closed", {
                        dialog: this.localName,
                      });
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var t,
                      e = this;
                    return this._dialogParams
                      ? (0, v.dy)(
                          o ||
                            (o = (0, s.Z)([
                              ' <ha-dialog open scrimClickAction escapeKeyAction .heading="',
                              '" @closed="',
                              '"> <div> <div class="list"> ',
                              ' </div> <ha-form .hass="',
                              '" .data="',
                              '" .schema="',
                              '" .error="',
                              '" .computeLabel="',
                              '" @value-changed="',
                              '" dialogInitialFocus></ha-form> ',
                              ' </div> <mwc-button slot="secondaryAction" @click="',
                              '" dialogInitialFocus> ',
                              ' </mwc-button> <mwc-button .disabled="',
                              '" slot="primaryAction" @click="',
                              '"> ',
                              " </mwc-button> </ha-dialog> ",
                            ])),
                          (0, _.i)(
                            this.hass,
                            this._dialogParams.hacs.localize(
                              "dialog_custom_repositories.title"
                            )
                          ),
                          this.closeDialog,
                          null ===
                            (t = this._dialogParams.hacs.repositories.filter(
                              function (t) {
                                return t.custom;
                              }
                            )) || void 0 === t
                            ? void 0
                            : t
                                .filter(function (t) {
                                  return e._dialogParams.hacs.info.categories.includes(
                                    t.category
                                  );
                                })
                                .map(function (t) {
                                  return (0, v.dy)(
                                    a ||
                                      (a = (0, s.Z)([
                                        ' <ha-settings-row> <span slot="heading">',
                                        '</span> <span slot="description">',
                                        " (",
                                        ')</span> <mwc-icon-button @click="',
                                        '"> <ha-svg-icon class="delete" .path="',
                                        '"></ha-svg-icon> </mwc-icon-button> </ha-settings-row>',
                                      ])),
                                    t.name,
                                    t.full_name,
                                    t.category,
                                    function (i) {
                                      i.preventDefault(),
                                        e._removeRepository(String(t.id)),
                                        e.dispatchEvent(
                                          new CustomEvent("closed", {
                                            bubbles: !0,
                                            composed: !0,
                                          })
                                        );
                                    },
                                    "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                                  );
                                }),
                          this.hass,
                          this._data,
                          [
                            { name: "repository", selector: { text: {} } },
                            {
                              name: "category",
                              selector: {
                                select: {
                                  mode: "dropdown",
                                  options:
                                    this._dialogParams.hacs.info.categories.map(
                                      function (t) {
                                        return {
                                          value: t,
                                          label: e._dialogParams.hacs.localize(
                                            "common.".concat(t)
                                          ),
                                        };
                                      }
                                    ),
                                },
                              },
                            },
                          ],
                          this._errors,
                          function (t) {
                            return "category" === t.name
                              ? e._dialogParams.hacs.localize(
                                  "dialog_custom_repositories.category"
                                )
                              : e._dialogParams.hacs.localize(
                                  "common.repository"
                                );
                          },
                          this._valueChanged,
                          this._waiting
                            ? (0, v.dy)(
                                n ||
                                  (n = (0, s.Z)([
                                    "<mwc-linear-progress indeterminate></mwc-linear-progress>",
                                  ]))
                              )
                            : v.Ld,
                          this.closeDialog,
                          this._dialogParams.hacs.localize("common.cancel"),
                          this._waiting ||
                            !this._data ||
                            !this._data.repository ||
                            !this._data.category,
                          this._addRepository,
                          this._dialogParams.hacs.localize("common.add")
                        )
                      : v.Ld;
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value: function (t) {
                    this._data = Object.assign(
                      Object.assign({}, this._data),
                      t.detail.value
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_addRepository",
                  value:
                    ((k = (0, l.Z)(
                      (0, d.Z)().mark(function t() {
                        var e, i;
                        return (0, d.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  if (
                                    ((this._errors = {}),
                                    null !== (e = this._data) &&
                                      void 0 !== e &&
                                      e.category)
                                  ) {
                                    t.next = 4;
                                    break;
                                  }
                                  return (
                                    (this._errors = {
                                      base: this._dialogParams.hacs.localize(
                                        "dialog_custom_repositories.no_category"
                                      ),
                                    }),
                                    t.abrupt("return")
                                  );
                                case 4:
                                  if (
                                    null !== (i = this._data) &&
                                    void 0 !== i &&
                                    i.repository
                                  ) {
                                    t.next = 7;
                                    break;
                                  }
                                  return (
                                    (this._errors = {
                                      base: this._dialogParams.hacs.localize(
                                        "dialog_custom_repositories.no_repository"
                                      ),
                                    }),
                                    t.abrupt("return")
                                  );
                                case 7:
                                  return (
                                    (this._waiting = !1),
                                    (t.next = 10),
                                    (0, b.NA)(
                                      this.hass,
                                      this._data.repository,
                                      this._data.category
                                    )
                                  );
                                case 10:
                                  return (
                                    (t.next = 12), this._updateRepositories()
                                  );
                                case 12:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this
                        );
                      })
                    )),
                    function () {
                      return k.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "_removeRepository",
                  value:
                    ((m = (0, l.Z)(
                      (0, d.Z)().mark(function t(e) {
                        return (0, d.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (this._waiting = !0),
                                    (t.next = 3),
                                    (0, b.jN)(this.hass, e)
                                  );
                                case 3:
                                  return (
                                    (t.next = 5), this._updateRepositories()
                                  );
                                case 5:
                                  this._waiting = !1;
                                case 6:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this
                        );
                      })
                    )),
                    function (t) {
                      return m.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "_updateRepositories",
                  value:
                    ((i = (0, l.Z)(
                      (0, d.Z)().mark(function t() {
                        var e;
                        return (0, d.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (t.next = 2), (0, b.ER)(this.hass);
                                case 2:
                                  (e = t.sent),
                                    this.dispatchEvent(
                                      new CustomEvent("update-hacs", {
                                        detail: { repositories: e },
                                        bubbles: !0,
                                        composed: !0,
                                      })
                                    ),
                                    (this._dialogParams = Object.assign(
                                      Object.assign({}, this._dialogParams),
                                      {},
                                      {
                                        hacs: Object.assign(
                                          Object.assign(
                                            {},
                                            this._dialogParams.hacs
                                          ),
                                          {},
                                          { repositories: e }
                                        ),
                                      }
                                    ));
                                case 5:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this
                        );
                      })
                    )),
                    function () {
                      return i.apply(this, arguments);
                    }),
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      (0, v.iv)(
                        r ||
                          (r = (0, s.Z)([
                            ".list{position:relative;max-height:calc(100vh - 500px);overflow:auto}a{all:unset}mwc-linear-progress{margin-bottom:-8px;margin-top:4px}ha-svg-icon{--mdc-icon-size:36px}ha-svg-icon:not(.delete){margin-right:4px}ha-settings-row{cursor:pointer;padding:0}.delete{color:var(--hcv-color-error)}@media all and (max-width:450px),all and (max-height:500px){.list{max-height:calc(100vh - 162px)}}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          v.oi
        );
    },
  },
]);
//# sourceMappingURL=1064._Oj9KHqBMEk.js.map
