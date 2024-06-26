"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [4833],
  {
    9828: function (t, i, e) {
      e.d(i, {
        i: function () {
          return k;
        },
      });
      var a,
        o,
        n,
        r = e(33368),
        l = e(71650),
        s = e(68308),
        d = e(82390),
        c = e(69205),
        h = e(91808),
        u = e(34541),
        p = e(47838),
        v = e(88962),
        g = (e(97393), e(91989), e(87762)),
        m = e(91632),
        f = e(5095),
        y = e(95260),
        _ = e(60625),
        b = (e(54371), ["button", "ha-list-item"]),
        k = function (t, i) {
          var e;
          return (0, f.dy)(
            a ||
              (a = (0, v.Z)([
                ' <div class="header_title"> <span>',
                '</span> <ha-icon-button .label="',
                '" .path="',
                '" dialogAction="close" class="header_button"></ha-icon-button> </div> ',
              ])),
            i,
            null !==
              (e =
                null == t ? void 0 : t.localize("ui.dialogs.generic.close")) &&
              void 0 !== e
              ? e
              : "Close",
            "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          );
        };
      (0, h.Z)(
        [(0, y.Mo)("ha-dialog")],
        function (t, i) {
          var e = (function (i) {
            function e() {
              var i;
              (0, l.Z)(this, e);
              for (
                var a = arguments.length, o = new Array(a), n = 0;
                n < a;
                n++
              )
                o[n] = arguments[n];
              return (i = (0, s.Z)(this, e, [].concat(o))), t((0, d.Z)(i)), i;
            }
            return (0, c.Z)(e, i), (0, r.Z)(e);
          })(i);
          return {
            F: e,
            d: [
              { kind: "field", key: _.gA, value: void 0 },
              {
                kind: "method",
                key: "scrollToPos",
                value: function (t, i) {
                  var e;
                  null === (e = this.contentElement) ||
                    void 0 === e ||
                    e.scrollTo(t, i);
                },
              },
              {
                kind: "method",
                key: "renderHeading",
                value: function () {
                  return (0, f.dy)(
                    o || (o = (0, v.Z)(['<slot name="heading"> ', " </slot>"])),
                    (0, u.Z)((0, p.Z)(e.prototype), "renderHeading", this).call(
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
                  (0, u.Z)((0, p.Z)(e.prototype), "firstUpdated", this).call(
                    this
                  ),
                    (this.suppressDefaultPressSelector = [
                      this.suppressDefaultPressSelector,
                      b,
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
                  (0, u.Z)(
                    (0, p.Z)(e.prototype),
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
                    m.W,
                    (0, f.iv)(
                      n ||
                        (n = (0, v.Z)([
                          ":host([scrolled]) ::slotted(ha-dialog-header){border-bottom:1px solid var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog{--mdc-dialog-scroll-divider-color:var(\n          --dialog-scroll-divider-color,\n          var(--divider-color)\n        );z-index:var(--dialog-z-index,8);-webkit-backdrop-filter:var(--dialog-backdrop-filter,none);backdrop-filter:var(--dialog-backdrop-filter,none);--mdc-dialog-box-shadow:var(--dialog-box-shadow, none);--mdc-typography-headline6-font-weight:400;--mdc-typography-headline6-font-size:1.574rem}.mdc-dialog__actions{justify-content:var(--justify-action-buttons,flex-end);padding-bottom:max(env(safe-area-inset-bottom),24px)}.mdc-dialog__actions span:first-child{flex:var(--secondary-action-button-flex,unset)}.mdc-dialog__actions span:nth-child(2){flex:var(--primary-action-button-flex,unset)}.mdc-dialog__container{align-items:var(--vertical-align-dialog,center)}.mdc-dialog__title{padding:24px 24px 0 24px}.mdc-dialog__actions{padding:12px 24px 12px 24px}.mdc-dialog__title::before{content:unset}.mdc-dialog .mdc-dialog__content{position:var(--dialog-content-position,relative);padding:var(--dialog-content-padding,24px)}:host([hideactions]) .mdc-dialog .mdc-dialog__content{padding-bottom:max(var(--dialog-content-padding,24px),env(safe-area-inset-bottom))}.mdc-dialog .mdc-dialog__surface{position:var(--dialog-surface-position,relative);top:var(--dialog-surface-top);margin-top:var(--dialog-surface-margin-top);min-height:var(--mdc-dialog-min-height,auto);border-radius:var(--ha-dialog-border-radius,28px)}:host([flexContent]) .mdc-dialog .mdc-dialog__content{display:flex;flex-direction:column}.header_title{position:relative;padding-right:40px;padding-inline-end:40px;padding-inline-start:initial;direction:var(--direction)}.header_title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.header_button{position:absolute;right:-8px;top:-8px;text-decoration:none;color:inherit;inset-inline-start:initial;inset-inline-end:-8px;direction:var(--direction)}.dialog-actions{inset-inline-start:initial!important;inset-inline-end:0px!important;direction:var(--direction)}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        g.M
      );
    },
    3017: function (t, i, e) {
      var a,
        o,
        n = e(88962),
        r = e(33368),
        l = e(71650),
        s = e(68308),
        d = e(82390),
        c = e(69205),
        h = e(91808),
        u = (e(97393), e(5095)),
        p = e(95260);
      (0, h.Z)(
        [(0, p.Mo)("ha-settings-row")],
        function (t, i) {
          var e = (function (i) {
            function e() {
              var i;
              (0, l.Z)(this, e);
              for (
                var a = arguments.length, o = new Array(a), n = 0;
                n < a;
                n++
              )
                o[n] = arguments[n];
              return (i = (0, s.Z)(this, e, [].concat(o))), t((0, d.Z)(i)), i;
            }
            return (0, c.Z)(e, i), (0, r.Z)(e);
          })(i);
          return {
            F: e,
            d: [
              {
                kind: "field",
                decorators: [(0, p.Cb)({ type: Boolean, reflect: !0 })],
                key: "narrow",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [
                  (0, p.Cb)({ type: Boolean, attribute: "three-line" }),
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
                  return (0, u.dy)(
                    a ||
                      (a = (0, n.Z)([
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
                  return (0, u.iv)(
                    o ||
                      (o = (0, n.Z)([
                        ":host{display:flex;padding:0 16px;align-content:normal;align-self:auto;align-items:center}.body{padding-top:8px;padding-bottom:8px;padding-left:0;padding-inline-start:0;padding-right:16x;padding-inline-end:16px;overflow:hidden;display:var(--layout-vertical_-_display);flex-direction:var(--layout-vertical_-_flex-direction);justify-content:var(--layout-center-justified_-_justify-content);flex:var(--layout-flex_-_flex);flex-basis:var(--layout-flex_-_flex-basis)}.body[three-line]{min-height:var(--paper-item-body-three-line-min-height,88px)}.body>*{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body>.secondary{display:block;padding-top:4px;font-family:var(\n          --mdc-typography-body2-font-family,\n          var(--mdc-typography-font-family, Roboto, sans-serif)\n        );-webkit-font-smoothing:antialiased;font-size:var(--mdc-typography-body2-font-size, .875rem);font-weight:var(--mdc-typography-body2-font-weight,400);line-height:normal;color:var(--secondary-text-color)}.body[two-line]{min-height:calc(var(--paper-item-body-two-line-min-height,72px) - 16px);flex:1}.content{display:contents}:host(:not([narrow])) .content{display:var(--settings-row-content-display,flex);justify-content:flex-end;flex:1;padding:16px 0}.content ::slotted(*){width:var(--settings-row-content-width)}:host([narrow]){align-items:normal;flex-direction:column;border-top:1px solid var(--divider-color);padding-bottom:8px}::slotted(ha-switch){padding:16px 0}.secondary{white-space:normal}.prefix-wrap{display:var(--settings-row-prefix-display)}:host([narrow]) .prefix-wrap{display:flex;align-items:center}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        u.oi
      );
    },
    4833: function (t, i, e) {
      e.r(i);
      var a,
        o,
        n,
        r,
        l,
        s = e(88962),
        d = e(99312),
        c = e(81043),
        h = e(33368),
        u = e(71650),
        p = e(68308),
        v = e(82390),
        g = e(69205),
        m = e(91808),
        f =
          (e(97393),
          e(94738),
          e(98214),
          e(46798),
          e(9849),
          e(13526),
          e(85717),
          e(65974),
          e(22859),
          e(14271),
          e(82692),
          e(5095)),
        y = e(95260),
        _ = e(18394),
        b = e(9828),
        k = (e(39663), e(3017), e(84643)),
        x = e(46797);
      (0, m.Z)(
        [(0, y.Mo)("hacs-form-dialog")],
        function (t, i) {
          var e,
            m,
            w = (function (i) {
              function e() {
                var i;
                (0, u.Z)(this, e);
                for (
                  var a = arguments.length, o = new Array(a), n = 0;
                  n < a;
                  n++
                )
                  o[n] = arguments[n];
                return (i = (0, p.Z)(this, e, [].concat(o))), t((0, v.Z)(i)), i;
              }
              return (0, g.Z)(e, i), (0, h.Z)(e);
            })(i);
          return {
            F: w,
            d: [
              {
                kind: "field",
                decorators: [(0, y.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, y.SB)()],
                key: "_dialogParams",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, y.SB)()],
                key: "_waiting",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, y.SB)()],
                key: "_errors",
                value: void 0,
              },
              { kind: "field", key: "_errorSubscription", value: void 0 },
              {
                kind: "method",
                key: "showDialog",
                value:
                  ((m = (0, c.Z)(
                    (0, d.Z)().mark(function t(i) {
                      var e = this;
                      return (0, d.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (this._dialogParams = i),
                                  (t.next = 3),
                                  (0, x.CE)(
                                    this.hass,
                                    function (t) {
                                      console.log(t),
                                        (e._errors = {
                                          base:
                                            (null == t ? void 0 : t.message) ||
                                            t,
                                        });
                                    },
                                    k.p.ERROR
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
                    return m.apply(this, arguments);
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
                    (0, _.B)(this, "dialog-closed", { dialog: this.localName });
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  var t;
                  return this._dialogParams
                    ? (0, f.dy)(
                        a ||
                          (a = (0, s.Z)([
                            ' <ha-dialog open .scrimClickAction="',
                            '" .escapeKeyAction="',
                            '" .heading="',
                            '" @closed="',
                            '"> <div> ',
                            " ",
                            " ",
                            " </div> ",
                            " </ha-dialog> ",
                          ])),
                        void 0 !== this._dialogParams.saveAction,
                        void 0 !== this._dialogParams.saveAction,
                        void 0 === this._dialogParams.saveAction
                          ? (0, b.i)(this.hass, this._dialogParams.title)
                          : this._dialogParams.title,
                        this.closeDialog,
                        this._dialogParams.description || f.Ld,
                        this._dialogParams.schema &&
                          this._dialogParams.saveAction
                          ? (0, f.dy)(
                              o ||
                                (o = (0, s.Z)([
                                  '<ha-form .hass="',
                                  '" .data="',
                                  '" .schema="',
                                  '" .error="',
                                  '" .computeLabel="',
                                  '" .computeHelper="',
                                  '" .computeError="',
                                  '" @value-changed="',
                                  '" dialogInitialFocus></ha-form>',
                                ])),
                              this.hass,
                              this._dialogParams.data || {},
                              this._dialogParams.schema || [],
                              this._errors,
                              this._computeLabel,
                              this._computeHelper,
                              this._computeError,
                              this._valueChanged
                            )
                          : f.Ld,
                        this._waiting
                          ? (0, f.dy)(
                              n ||
                                (n = (0, s.Z)([
                                  "<mwc-linear-progress indeterminate></mwc-linear-progress>",
                                ]))
                            )
                          : f.Ld,
                        this._dialogParams.saveAction
                          ? (0, f.dy)(
                              r ||
                                (r = (0, s.Z)([
                                  '<mwc-button slot="secondaryAction" @click="',
                                  '" dialogInitialFocus> ',
                                  ' </mwc-button> <mwc-button class="',
                                  '" .disabled="',
                                  '" slot="primaryAction" @click="',
                                  '"> ',
                                  " </mwc-button>",
                                ])),
                              this.closeDialog,
                              this._dialogParams.hacs.localize("common.cancel"),
                              this._dialogParams.destructive
                                ? "destructive"
                                : "",
                              this._waiting ||
                                ((null === (t = this._dialogParams.schema) ||
                                void 0 === t
                                  ? void 0
                                  : t.some(function (t) {
                                      return t.required;
                                    })) &&
                                  !this._dialogParams.data),
                              this._saveClicked,
                              this._dialogParams.saveLabel ||
                                this._dialogParams.hacs.localize("common.save")
                            )
                          : f.Ld
                      )
                    : f.Ld;
                },
              },
              {
                kind: "method",
                key: "_valueChanged",
                value: function (t) {
                  this._dialogParams.data = Object.assign(
                    Object.assign({}, this._dialogParams.data),
                    t.detail.value
                  );
                },
              },
              {
                kind: "method",
                key: "_saveClicked",
                value:
                  ((e = (0, c.Z)(
                    (0, d.Z)().mark(function t() {
                      var i;
                      return (0, d.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                if (
                                  null !== (i = this._dialogParams) &&
                                  void 0 !== i &&
                                  i.saveAction
                                ) {
                                  t.next = 2;
                                  break;
                                }
                                return t.abrupt("return");
                              case 2:
                                return (
                                  (this._errors = {}),
                                  (this._waiting = !0),
                                  (t.prev = 4),
                                  (t.next = 7),
                                  this._dialogParams.saveAction(
                                    this._dialogParams.data
                                  )
                                );
                              case 7:
                                t.next = 12;
                                break;
                              case 9:
                                (t.prev = 9),
                                  (t.t0 = t.catch(4)),
                                  (this._errors = {
                                    base:
                                      (null === t.t0 || void 0 === t.t0
                                        ? void 0
                                        : t.t0.message) ||
                                      "Unkown error, check Home Assistant logs",
                                  });
                              case 12:
                                (this._waiting = !1),
                                  Object.keys(this._errors).length ||
                                    this.closeDialog();
                              case 14:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                        [[4, 9]]
                      );
                    })
                  )),
                  function () {
                    return e.apply(this, arguments);
                  }),
              },
              {
                kind: "field",
                key: "_computeLabel",
                value: function () {
                  var t = this;
                  return function (i, e) {
                    var a;
                    return null !== (a = t._dialogParams) &&
                      void 0 !== a &&
                      a.computeLabelCallback
                      ? t._dialogParams.computeLabelCallback(i, e)
                      : i.name || "";
                  };
                },
              },
              {
                kind: "field",
                key: "_computeHelper",
                value: function () {
                  var t = this;
                  return function (i) {
                    var e;
                    return null !== (e = t._dialogParams) &&
                      void 0 !== e &&
                      e.computeHelper
                      ? t._dialogParams.computeHelper(i)
                      : "";
                  };
                },
              },
              {
                kind: "field",
                key: "_computeError",
                value: function () {
                  var t = this;
                  return function (i, e) {
                    var a;
                    return null !== (a = t._dialogParams) &&
                      void 0 !== a &&
                      a.computeError
                      ? t._dialogParams.computeError(i, e)
                      : i || "";
                  };
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, f.iv)(
                    l ||
                      (l = (0, s.Z)([
                        ".root>*{display:block}.root>:not([own-margin]):not(:last-child){margin-bottom:24px}.destructive{--mdc-theme-primary:var(--hcv-color-error)}mwc-linear-progress{margin-bottom:-8px;margin-top:4px}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        f.oi
      );
    },
  },
]);
//# sourceMappingURL=4833.X2k4s7_XUo4.js.map
