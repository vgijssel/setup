"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [5563],
  {
    92295: function (t, e, i) {
      var o,
        r = i(88962),
        a = i(33368),
        n = i(71650),
        s = i(68308),
        l = i(82390),
        c = i(69205),
        d = i(91808),
        h = (i(97393), i(14271)),
        u = i(5095),
        p = i(95260),
        g = i(3712);
      (0, d.Z)(
        [(0, p.Mo)("ha-button")],
        function (t, e) {
          var i = (function (e) {
            function i() {
              var e;
              (0, n.Z)(this, i);
              for (
                var o = arguments.length, r = new Array(o), a = 0;
                a < o;
                a++
              )
                r[a] = arguments[a];
              return (e = (0, s.Z)(this, i, [].concat(r))), t((0, l.Z)(e)), e;
            }
            return (0, c.Z)(i, e), (0, a.Z)(i);
          })(e);
          return {
            F: i,
            d: [
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return [
                    g.W,
                    (0, u.iv)(
                      o ||
                        (o = (0, r.Z)([
                          "::slotted([slot=icon]){margin-inline-start:0px;margin-inline-end:8px;direction:var(--direction);display:block}.mdc-button{height:var(--button-height,36px)}.trailing-icon{display:flex}.slot-container{overflow:var(--button-slot-container-overflow,visible)}",
                        ]))
                    ),
                  ];
                },
              },
            ],
          };
        },
        h.z
      );
    },
    9828: function (t, e, i) {
      i.d(e, {
        i: function () {
          return k;
        },
      });
      var o,
        r,
        a,
        n = i(33368),
        s = i(71650),
        l = i(68308),
        c = i(82390),
        d = i(69205),
        h = i(91808),
        u = i(34541),
        p = i(47838),
        g = i(88962),
        m = (i(97393), i(91989), i(87762)),
        _ = i(91632),
        v = i(5095),
        f = i(95260),
        y = i(60625),
        b = (i(54371), ["button", "ha-list-item"]),
        k = function (t, e) {
          var i;
          return (0, v.dy)(
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
        [(0, f.Mo)("ha-dialog")],
        function (t, e) {
          var i = (function (e) {
            function i() {
              var e;
              (0, s.Z)(this, i);
              for (
                var o = arguments.length, r = new Array(o), a = 0;
                a < o;
                a++
              )
                r[a] = arguments[a];
              return (e = (0, l.Z)(this, i, [].concat(r))), t((0, c.Z)(e)), e;
            }
            return (0, d.Z)(i, e), (0, n.Z)(i);
          })(e);
          return {
            F: i,
            d: [
              { kind: "field", key: y.gA, value: void 0 },
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
                  return (0, v.dy)(
                    r || (r = (0, g.Z)(['<slot name="heading"> ', " </slot>"])),
                    (0, u.Z)((0, p.Z)(i.prototype), "renderHeading", this).call(
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
                  (0, u.Z)((0, p.Z)(i.prototype), "firstUpdated", this).call(
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
                    (0, p.Z)(i.prototype),
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
                    _.W,
                    (0, v.iv)(
                      a ||
                        (a = (0, g.Z)([
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
    25563: function (t, e, i) {
      i.r(e),
        i.d(e, {
          HacsDonwloadDialog: function () {
            return j;
          },
        });
      var o = i(88962),
        r = i(99312),
        a = i(81043),
        n = i(33368),
        s = i(71650),
        l = i(68308),
        c = i(82390),
        d = i(69205),
        h = i(91808),
        u = (i(97393), i(40271), i(22859), i(14271), i(82692), i(5095)),
        p = i(95260),
        g = i(14516),
        m = i(18394),
        _ = i(67684),
        v = i(51750),
        f = (i(23860), i(92295), i(9828), i(39663), i(11285)),
        y = i(84643),
        b = i(8179),
        k = i(46797),
        x = i(61422),
        w =
          (i(63789),
          i(24074),
          i(85472),
          i(46798),
          i(9849),
          i(90126),
          i(60163),
          i(46349),
          i(70320),
          i(32218)),
        Z = i(23792);
      function P(t, e, i) {
        return z.apply(this, arguments);
      }
      function z() {
        return (
          (z = (0, a.Z)(
            (0, r.Z)().mark(function t(e, i, o) {
              var a, n, s, l, c;
              return (0, r.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (a = new Z.J("updateLovelaceResources")),
                        (t.next = 3),
                        (0, w.eL)(e.connection)
                      );
                    case 3:
                      if (
                        ((n = t.sent),
                        (s = "/hacsfiles/".concat(i.full_name.split("/")[1])),
                        (l = H({ repository: i, version: o })),
                        (c = n.find(function (t) {
                          return t.url.includes(s);
                        })),
                        a.debug({ namespace: s, url: l, exsisting: c }),
                        !c || c.url === l)
                      ) {
                        t.next = 14;
                        break;
                      }
                      return (
                        a.debug("Updating exsusting resource for ".concat(s)),
                        (t.next = 12),
                        (0, w.id)(e, c.id, { url: l, res_type: c.type })
                      );
                    case 12:
                      t.next = 18;
                      break;
                    case 14:
                      if (
                        n
                          .map(function (t) {
                            return t.url;
                          })
                          .includes(l)
                      ) {
                        t.next = 18;
                        break;
                      }
                      return (
                        a.debug("Adding ".concat(l, " to Lovelace resources")),
                        (t.next = 18),
                        (0, w.SN)(e, { url: l, res_type: "module" })
                      );
                    case 18:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          )),
          z.apply(this, arguments)
        );
      }
      var L,
        S,
        E,
        A,
        C,
        R,
        D,
        M,
        T,
        B,
        H = function (t) {
          return "/hacsfiles/"
            .concat(t.repository.full_name.split("/")[1], "/")
            .concat(t.repository.file_name)
            .concat(
              t.skipTag
                ? ""
                : "?hacstag=".concat(
                    (function (t, e) {
                      return String(
                        ""
                          .concat(t.id)
                          .concat(
                            (
                              e ||
                              t.installed_version ||
                              t.selected_tag ||
                              t.available_version
                            ).replace(/\D+/g, "")
                          )
                      );
                    })(t.repository, t.version)
                  )
            );
        },
        I = i(25287),
        j = (0, h.Z)(
          [(0, p.Mo)("hacs-download-dialog")],
          function (t, e) {
            var i,
              h,
              w,
              Z,
              z = (function (e) {
                function i() {
                  var e;
                  (0, s.Z)(this, i);
                  for (
                    var o = arguments.length, r = new Array(o), a = 0;
                    a < o;
                    a++
                  )
                    r[a] = arguments[a];
                  return (
                    (e = (0, l.Z)(this, i, [].concat(r))), t((0, c.Z)(e)), e
                  );
                }
                return (0, d.Z)(i, e), (0, n.Z)(i);
              })(e);
            return {
              F: z,
              d: [
                {
                  kind: "field",
                  decorators: [(0, p.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, p.SB)()],
                  key: "_waiting",
                  value: function () {
                    return !0;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, p.SB)()],
                  key: "_installing",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, p.SB)()],
                  key: "_error",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, p.SB)()],
                  key: "_repository",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, p.SB)()],
                  key: "_dialogParams",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "showDialog",
                  value:
                    ((Z = (0, a.Z)(
                      (0, r.Z)().mark(function t(e) {
                        var i = this;
                        return (0, r.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  if (
                                    ((this._dialogParams = e),
                                    (this._waiting = !1),
                                    !e.repository)
                                  ) {
                                    t.next = 6;
                                    break;
                                  }
                                  (this._repository = e.repository),
                                    (t.next = 8);
                                  break;
                                case 6:
                                  return (t.next = 8), this._fetchRepository();
                                case 8:
                                  return (
                                    (0, k.CE)(
                                      this.hass,
                                      function (t) {
                                        (i._error = t), (i._installing = !1);
                                      },
                                      y.p.ERROR
                                    ),
                                    (t.next = 11),
                                    this.updateComplete
                                  );
                                case 11:
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
                      return Z.apply(this, arguments);
                    }),
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
                      (0, m.B)(this, "dialog-closed", {
                        dialog: this.localName,
                      });
                  },
                },
                {
                  kind: "field",
                  key: "_getInstallPath",
                  value: function () {
                    return (0, g.Z)(function (t) {
                      var e = t.local_path;
                      return (
                        ["template", "theme", "python_script"].includes(
                          t.category
                        ) && (e = "".concat(e, "/").concat(t.file_name)),
                        e
                      );
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_fetchRepository",
                  value:
                    ((w = (0, a.Z)(
                      (0, r.Z)().mark(function t() {
                        return (0, r.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (t.next = 2),
                                    (0, b.nj)(
                                      this.hass,
                                      this._dialogParams.repositoryId
                                    )
                                  );
                                case 2:
                                  this._repository = t.sent;
                                case 3:
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
                      return w.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var t,
                      e = this;
                    if (!this._dialogParams || !this._repository) return u.Ld;
                    var i = this._getInstallPath(this._repository),
                      r = [
                        { name: "beta", selector: { boolean: {} } },
                        {
                          name: "version",
                          selector: {
                            select: {
                              options: this._repository.releases.concat(
                                "hacs/integration" ===
                                  this._repository.full_name ||
                                  this._repository.hide_default_branch
                                  ? []
                                  : [this._repository.default_branch]
                              ),
                              mode: "dropdown",
                            },
                          },
                        },
                      ];
                    return (0, u.dy)(
                      L ||
                        (L = (0, o.Z)([
                          ' <ha-dialog open scrimClickAction escapeKeyAction .heading="',
                          '" @closed="',
                          '"> <div class="content"> ',
                          " ",
                          ' <div class="note"> ',
                          " ",
                          " ",
                          " </div> ",
                          " ",
                          ' </div> <mwc-button slot="secondaryAction" @click="',
                          '" dialogInitialFocus> ',
                          ' </mwc-button> <mwc-button slot="primaryAction" ?disabled="',
                          '" @click="',
                          '"> ',
                          " </mwc-button> </ha-dialog> ",
                        ])),
                      this._repository.name,
                      this.closeDialog,
                      "version" === this._repository.version_or_commit &&
                        this._repository.installed
                        ? (0, u.dy)(
                            S ||
                              (S = (0, o.Z)([
                                ' <ha-form .disabled="',
                                '" .data="',
                                '" .schema="',
                                '" .computeLabel="',
                                '" @value-changed="',
                                '"> </ha-form> <ha-alert alert-type="info" .rtl="',
                                '"> ',
                                ' <a class="learn_more" href="',
                                '" slot="action" target="_blank" rel="noreferrer"> ',
                                "</a> </ha-alert> ",
                              ])),
                            this._waiting,
                            "version" === this._repository.version_or_commit
                              ? {
                                  beta: this._repository.beta,
                                  version: this._repository.releases[0],
                                }
                              : {},
                            r,
                            function (t) {
                              return "beta" === t.name
                                ? e._dialogParams.hacs.localize(
                                    "dialog_download.show_beta"
                                  )
                                : e._dialogParams.hacs.localize(
                                    "dialog_download.select_version"
                                  );
                            },
                            this._valueChanged,
                            (0, v.HE)(this.hass),
                            this._dialogParams.hacs.localize(
                              "dialog_download.selector_note"
                            ),
                            (0, I.R)({
                              path: "/docs/entities/update_entities#install-service",
                              experimental:
                                this._dialogParams.hacs.info.experimental,
                            }),
                            this._dialogParams.hacs.localize(
                              "common.learn_more"
                            )
                          )
                        : u.Ld,
                      this._repository.can_download
                        ? ""
                        : (0, u.dy)(
                            E ||
                              (E = (0, o.Z)([
                                '<ha-alert alert-type="error" .rtl="',
                                '"> ',
                                " </ha-alert>",
                              ])),
                            (0, v.HE)(this.hass),
                            this._dialogParams.hacs.localize(
                              "confirm.home_assistant_version_not_correct",
                              {
                                haversion: this.hass.config.version,
                                minversion: this._repository.homeassistant,
                              }
                            )
                          ),
                      this._dialogParams.hacs.localize(
                        "dialog_download.note_downloaded",
                        {
                          location: (0, u.dy)(
                            A || (A = (0, o.Z)(["<code>'", "'</code>"])),
                            i
                          ),
                        }
                      ),
                      "plugin" === this._repository.category &&
                        "storage" !== this._dialogParams.hacs.info.lovelace_mode
                        ? (0, u.dy)(
                            C ||
                              (C = (0, o.Z)([
                                " <p>",
                                "</p> <pre>\n                url: ",
                                "\n                type: module\n                </pre> ",
                              ])),
                            this._dialogParams.hacs.localize(
                              "dialog_download.lovelace_instruction"
                            ),
                            H({ repository: this._repository, skipTag: !0 })
                          )
                        : u.Ld,
                      "integration" === this._repository.category
                        ? (0, u.dy)(
                            R || (R = (0, o.Z)(["<p>", "</p>"])),
                            this._dialogParams.hacs.localize(
                              "dialog_download.restart"
                            )
                          )
                        : u.Ld,
                      null !== (t = this._error) && void 0 !== t && t.message
                        ? (0, u.dy)(
                            D ||
                              (D = (0, o.Z)([
                                '<ha-alert alert-type="error" .rtl="',
                                '"> ',
                                " </ha-alert>",
                              ])),
                            (0, v.HE)(this.hass),
                            this._error.message
                          )
                        : u.Ld,
                      this._installing
                        ? (0, u.dy)(
                            M ||
                              (M = (0, o.Z)([
                                "<mwc-linear-progress indeterminate></mwc-linear-progress>",
                              ]))
                          )
                        : u.Ld,
                      this.closeDialog,
                      this._dialogParams.hacs.localize("common.cancel"),
                      !this._repository.can_download ||
                        this._waiting ||
                        this._installing,
                      this._installRepository,
                      this._dialogParams.hacs.localize("common.download")
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value:
                    ((h = (0, a.Z)(
                      (0, r.Z)().mark(function t(e) {
                        var i;
                        return (0, r.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  if (
                                    ((i = !1),
                                    this._repository.beta ===
                                      e.detail.value.beta)
                                  ) {
                                    t.next = 6;
                                    break;
                                  }
                                  return (
                                    (i = !0),
                                    (this._waiting = !0),
                                    (t.next = 6),
                                    (0, k.EK)(
                                      this.hass,
                                      this._dialogParams.repositoryId,
                                      e.detail.value.beta
                                    )
                                  );
                                case 6:
                                  if (!e.detail.value.version) {
                                    t.next = 11;
                                    break;
                                  }
                                  return (
                                    (i = !0),
                                    (this._waiting = !0),
                                    (t.next = 11),
                                    (0, b.zD)(
                                      this.hass,
                                      this._dialogParams.repositoryId,
                                      e.detail.value.version
                                    )
                                  );
                                case 11:
                                  if (!i) {
                                    t.next = 15;
                                    break;
                                  }
                                  return (t.next = 14), this._fetchRepository();
                                case 14:
                                  this._waiting = !1;
                                case 15:
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
                      return h.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "_installRepository",
                  value:
                    ((i = (0, a.Z)(
                      (0, r.Z)().mark(function t() {
                        var e, i;
                        return (0, r.Z)().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  if (
                                    ((this._installing = !0),
                                    (this._error = void 0),
                                    this._repository)
                                  ) {
                                    t.next = 4;
                                    break;
                                  }
                                  return t.abrupt("return");
                                case 4:
                                  return (
                                    (e =
                                      this._repository.selected_tag ||
                                      this._repository.available_version ||
                                      this._repository.default_branch),
                                    (t.prev = 5),
                                    (t.next = 8),
                                    (0, b.hZ)(
                                      this.hass,
                                      String(this._repository.id),
                                      "commit" !==
                                        (null === (i = this._repository) ||
                                        void 0 === i
                                          ? void 0
                                          : i.version_or_commit)
                                        ? e
                                        : void 0
                                    )
                                  );
                                case 8:
                                  t.next = 15;
                                  break;
                                case 10:
                                  return (
                                    (t.prev = 10),
                                    (t.t0 = t.catch(5)),
                                    (this._error = t.t0 || {
                                      message:
                                        "Could not download repository, check core logs for more information.",
                                    }),
                                    (this._installing = !1),
                                    t.abrupt("return")
                                  );
                                case 15:
                                  if (
                                    (this._dialogParams.hacs.log.debug(
                                      this._repository.category,
                                      "_installRepository"
                                    ),
                                    this._dialogParams.hacs.log.debug(
                                      this._dialogParams.hacs.info
                                        .lovelace_mode,
                                      "_installRepository"
                                    ),
                                    "plugin" !== this._repository.category ||
                                      "storage" !==
                                        this._dialogParams.hacs.info
                                          .lovelace_mode)
                                  ) {
                                    t.next = 20;
                                    break;
                                  }
                                  return (
                                    (t.next = 20),
                                    P(this.hass, this._repository, e)
                                  );
                                case 20:
                                  (this._installing = !1),
                                    "plugin" === this._repository.category &&
                                      (0, f.g7)(this, {
                                        title:
                                          this._dialogParams.hacs.localize(
                                            "common.reload"
                                          ),
                                        text: (0, u.dy)(
                                          T || (T = (0, o.Z)(["", "<br>", ""])),
                                          this._dialogParams.hacs.localize(
                                            "dialog.reload.description"
                                          ),
                                          this._dialogParams.hacs.localize(
                                            "dialog.reload.confirm"
                                          )
                                        ),
                                        dismissText:
                                          this._dialogParams.hacs.localize(
                                            "common.cancel"
                                          ),
                                        confirmText:
                                          this._dialogParams.hacs.localize(
                                            "common.reload"
                                          ),
                                        confirm: function () {
                                          _.E.location.href = _.E.location.href;
                                        },
                                      }),
                                    void 0 === this._error &&
                                      this.closeDialog();
                                case 23:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this,
                          [[5, 10]]
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
                      x.w,
                      (0, u.iv)(
                        B ||
                          (B = (0, o.Z)([
                            ".note{margin-top:12px}.lovelace{margin-top:8px}.learn_more{color:var(--hcv-text-color-primary)}pre{white-space:pre-line;user-select:all}mwc-linear-progress{margin-bottom:-8px;margin-top:4px}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          u.oi
        );
    },
    8179: function (t, e, i) {
      i.d(e, {
        hZ: function () {
          return n;
        },
        nj: function () {
          return a;
        },
        zD: function () {
          return s;
        },
      });
      var o = i(99312),
        r = i(81043),
        a = (function () {
          var t = (0, r.Z)(
            (0, o.Z)().mark(function t(e, i) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/info",
                          repository_id: i,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, i) {
            return t.apply(this, arguments);
          };
        })(),
        n = (function () {
          var t = (0, r.Z)(
            (0, o.Z)().mark(function t(e, i, r) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/download",
                          repository: i,
                          version: r,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, i, o) {
            return t.apply(this, arguments);
          };
        })(),
        s = (function () {
          var t = (0, r.Z)(
            (0, o.Z)().mark(function t(e, i, r) {
              return (0, o.Z)().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return t.abrupt(
                        "return",
                        e.connection.sendMessagePromise({
                          type: "hacs/repository/version",
                          repository: i,
                          version: r,
                        })
                      );
                    case 1:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
          return function (e, i, o) {
            return t.apply(this, arguments);
          };
        })();
    },
    25287: function (t, e, i) {
      i.d(e, {
        R: function () {
          return o;
        },
      });
      i(97393);
      var o = function (t) {
        var e =
          null != t && t.experimental
            ? "experimental.hacs.xyz"
            : "www.hacs.xyz";
        return "https://".concat(e).concat((null == t ? void 0 : t.path) || "");
      };
    },
  },
]);
//# sourceMappingURL=5563.O3izg8C0DX8.js.map
