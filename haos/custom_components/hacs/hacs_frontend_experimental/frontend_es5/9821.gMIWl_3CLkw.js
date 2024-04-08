"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [9821],
  {
    59821: function (i, e, t) {
      t.r(e),
        t.d(e, {
          DialogAddApplicationCredential: function () {
            return H;
          },
        });
      var a,
        n,
        s,
        r,
        o,
        l,
        c,
        d,
        h,
        p,
        u,
        _ = t(99312),
        m = t(81043),
        f = t(33368),
        v = t(71650),
        g = t(68308),
        k = t(82390),
        y = t(69205),
        b = t(91808),
        Z = t(88962),
        x =
          (t(22859),
          t(97393),
          t(46349),
          t(70320),
          t(65974),
          t(14271),
          t(44577),
          t(5095)),
        w = t(95260),
        z = t(18394),
        S = (t(23860), t(7006), t(16591), t(9828)),
        D =
          (t(21162),
          t(51520),
          (function () {
            var i = (0, m.Z)(
              (0, _.Z)().mark(function i(e) {
                return (0, _.Z)().wrap(function (i) {
                  for (;;)
                    switch ((i.prev = i.next)) {
                      case 0:
                        return i.abrupt(
                          "return",
                          e.callWS({ type: "application_credentials/config" })
                        );
                      case 1:
                      case "end":
                        return i.stop();
                    }
                }, i);
              })
            );
            return function (e) {
              return i.apply(this, arguments);
            };
          })()),
        C = (function () {
          var i = (0, m.Z)(
            (0, _.Z)().mark(function i(e, t, a, n, s) {
              return (0, _.Z)().wrap(function (i) {
                for (;;)
                  switch ((i.prev = i.next)) {
                    case 0:
                      return i.abrupt(
                        "return",
                        e.callWS({
                          type: "application_credentials/create",
                          domain: t,
                          client_id: a,
                          client_secret: n,
                          name: s,
                        })
                      );
                    case 1:
                    case "end":
                      return i.stop();
                  }
              }, i);
            })
          );
          return function (e, t, a, n, s) {
            return i.apply(this, arguments);
          };
        })(),
        A = t(64346),
        B = t(29950),
        V = t(84728),
        I =
          "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",
        q = function (i) {
          return (0, x.dy)(
            a ||
              (a = (0, Z.Z)([
                "<mwc-list-item> <span>",
                "</span> </mwc-list-item>",
              ])),
            i.name
          );
        },
        H = (0, b.Z)(
          [(0, w.Mo)("dialog-add-application-credential")],
          function (i, e) {
            var t,
              a,
              b,
              H = (function (e) {
                function t() {
                  var e;
                  (0, v.Z)(this, t);
                  for (
                    var a = arguments.length, n = new Array(a), s = 0;
                    s < a;
                    s++
                  )
                    n[s] = arguments[s];
                  return (
                    (e = (0, g.Z)(this, t, [].concat(n))), i((0, k.Z)(e)), e
                  );
                }
                return (0, y.Z)(t, e), (0, f.Z)(t);
              })(e);
            return {
              F: H,
              d: [
                {
                  kind: "field",
                  decorators: [(0, w.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_loading",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_error",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_params",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_domain",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_manifest",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_name",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_description",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_clientId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_clientSecret",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_domains",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, w.SB)()],
                  key: "_config",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "showDialog",
                  value: function (i) {
                    (this._params = i),
                      (this._domain = i.selectedDomain),
                      (this._manifest = i.manifest),
                      (this._name = ""),
                      (this._description = ""),
                      (this._clientId = ""),
                      (this._clientSecret = ""),
                      (this._error = void 0),
                      (this._loading = !1),
                      this._fetchConfig();
                  },
                },
                {
                  kind: "method",
                  key: "_fetchConfig",
                  value:
                    ((b = (0, m.Z)(
                      (0, _.Z)().mark(function i() {
                        var e = this;
                        return (0, _.Z)().wrap(
                          function (i) {
                            for (;;)
                              switch ((i.prev = i.next)) {
                                case 0:
                                  return (i.next = 2), D(this.hass);
                                case 2:
                                  return (
                                    (this._config = i.sent),
                                    (this._domains = Object.keys(
                                      this._config.integrations
                                    ).map(function (i) {
                                      return {
                                        id: i,
                                        name: (0, A.Lh)(e.hass.localize, i),
                                      };
                                    })),
                                    (i.next = 6),
                                    this.hass.loadBackendTranslation(
                                      "application_credentials"
                                    )
                                  );
                                case 6:
                                  this._updateDescription();
                                case 7:
                                case "end":
                                  return i.stop();
                              }
                          },
                          i,
                          this
                        );
                      })
                    )),
                    function () {
                      return b.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var i, e;
                    if (!this._params || !this._domains) return x.Ld;
                    var t = this._params.selectedDomain
                      ? (0, A.Lh)(this.hass.localize, this._domain)
                      : "";
                    return (0, x.dy)(
                      n ||
                        (n = (0, Z.Z)([
                          ' <ha-dialog open @closed="',
                          '" scrimClickAction escapeKeyAction .heading="',
                          '"> <div> ',
                          " ",
                          " ",
                          " ",
                          " ",
                          ' <ha-textfield class="name" name="name" .label="',
                          '" .value="',
                          '" required @input="',
                          '" .validationMessage="',
                          '" dialogInitialFocus></ha-textfield> <ha-textfield class="clientId" name="clientId" .label="',
                          '" .value="',
                          '" required @input="',
                          '" .validationMessage="',
                          '" dialogInitialFocus .helper="',
                          '" helperPersistent></ha-textfield> <ha-textfield .label="',
                          '" type="password" name="clientSecret" .value="',
                          '" required @input="',
                          '" .validationMessage="',
                          '" .helper="',
                          '" helperPersistent></ha-textfield> </div> ',
                          " </ha-dialog> ",
                        ])),
                      this._abortDialog,
                      (0, S.i)(
                        this.hass,
                        this.hass.localize(
                          "ui.panel.config.application_credentials.editor.caption"
                        )
                      ),
                      this._error
                        ? (0, x.dy)(
                            s ||
                              (s = (0, Z.Z)([
                                '<ha-alert alert-type="error">',
                                "</ha-alert> ",
                              ])),
                            this._error
                          )
                        : "",
                      this._params.selectedDomain && !this._description
                        ? (0, x.dy)(
                            r || (r = (0, Z.Z)(["<p> ", " ", " </p>"])),
                            this.hass.localize(
                              "ui.panel.config.application_credentials.editor.missing_credentials",
                              { integration: t }
                            ),
                            (null !== (i = this._manifest) &&
                              void 0 !== i &&
                              i.is_built_in) ||
                              (null !== (e = this._manifest) &&
                                void 0 !== e &&
                                e.documentation)
                              ? (0, x.dy)(
                                  o ||
                                    (o = (0, Z.Z)([
                                      '<a href="',
                                      '" target="_blank" rel="noreferrer"> ',
                                      ' <ha-svg-icon .path="',
                                      '"></ha-svg-icon> </a>',
                                    ])),
                                  this._manifest.is_built_in
                                    ? (0, V.R)(
                                        this.hass,
                                        "/integrations/".concat(this._domain)
                                      )
                                    : this._manifest.documentation,
                                  this.hass.localize(
                                    "ui.panel.config.application_credentials.editor.missing_credentials_domain_link",
                                    { integration: t }
                                  ),
                                  I
                                )
                              : ""
                          )
                        : "",
                      this._params.selectedDomain && this._description
                        ? ""
                        : (0, x.dy)(
                            l ||
                              (l = (0, Z.Z)([
                                "<p> ",
                                ' <a href="',
                                '" target="_blank" rel="noreferrer"> ',
                                ' <ha-svg-icon .path="',
                                '"></ha-svg-icon> </a> </p>',
                              ])),
                            this.hass.localize(
                              "ui.panel.config.application_credentials.editor.description"
                            ),
                            (0, V.R)(
                              this.hass,
                              "/integrations/application_credentials"
                            ),
                            this.hass.localize(
                              "ui.panel.config.application_credentials.editor.view_documentation"
                            ),
                            I
                          ),
                      this._params.selectedDomain
                        ? ""
                        : (0, x.dy)(
                            c ||
                              (c = (0, Z.Z)([
                                '<ha-combo-box name="domain" .hass="',
                                '" .label="',
                                '" .value="',
                                '" .renderer="',
                                '" .items="',
                                '" item-id-path="id" item-value-path="id" item-label-path="name" required @value-changed="',
                                '"></ha-combo-box>',
                              ])),
                            this.hass,
                            this.hass.localize(
                              "ui.panel.config.application_credentials.editor.domain"
                            ),
                            this._domain,
                            q,
                            this._domains,
                            this._handleDomainPicked
                          ),
                      this._description
                        ? (0, x.dy)(
                            d ||
                              (d = (0, Z.Z)([
                                '<ha-markdown breaks .content="',
                                '"></ha-markdown>',
                              ])),
                            this._description
                          )
                        : "",
                      this.hass.localize(
                        "ui.panel.config.application_credentials.editor.name"
                      ),
                      this._name,
                      this._handleValueChanged,
                      this.hass.localize("ui.common.error_required"),
                      this.hass.localize(
                        "ui.panel.config.application_credentials.editor.client_id"
                      ),
                      this._clientId,
                      this._handleValueChanged,
                      this.hass.localize("ui.common.error_required"),
                      this.hass.localize(
                        "ui.panel.config.application_credentials.editor.client_id_helper"
                      ),
                      this.hass.localize(
                        "ui.panel.config.application_credentials.editor.client_secret"
                      ),
                      this._clientSecret,
                      this._handleValueChanged,
                      this.hass.localize("ui.common.error_required"),
                      this.hass.localize(
                        "ui.panel.config.application_credentials.editor.client_secret_helper"
                      ),
                      this._loading
                        ? (0, x.dy)(
                            h ||
                              (h = (0, Z.Z)([
                                ' <div slot="primaryAction" class="submit-spinner"> <ha-circular-progress indeterminate></ha-circular-progress> </div> ',
                              ]))
                          )
                        : (0, x.dy)(
                            p ||
                              (p = (0, Z.Z)([
                                ' <mwc-button slot="primaryAction" @click="',
                                '"> ',
                                ' </mwc-button> <mwc-button slot="primaryAction" .disabled="',
                                '" @click="',
                                '"> ',
                                " </mwc-button> ",
                              ])),
                            this._abortDialog,
                            this.hass.localize("ui.common.cancel"),
                            !this._domain ||
                              !this._clientId ||
                              !this._clientSecret,
                            this._addApplicationCredential,
                            this.hass.localize(
                              "ui.panel.config.application_credentials.editor.add"
                            )
                          )
                    );
                  },
                },
                {
                  kind: "method",
                  key: "closeDialog",
                  value: function () {
                    (this._params = void 0),
                      (this._domains = void 0),
                      (0, z.B)(this, "dialog-closed", {
                        dialog: this.localName,
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_handleDomainPicked",
                  value: function (i) {
                    i.stopPropagation(),
                      (this._domain = i.detail.value),
                      this._updateDescription();
                  },
                },
                {
                  kind: "method",
                  key: "_updateDescription",
                  value:
                    ((a = (0, m.Z)(
                      (0, _.Z)().mark(function i() {
                        var e;
                        return (0, _.Z)().wrap(
                          function (i) {
                            for (;;)
                              switch ((i.prev = i.next)) {
                                case 0:
                                  if (this._domain) {
                                    i.next = 2;
                                    break;
                                  }
                                  return i.abrupt("return");
                                case 2:
                                  return (
                                    (i.next = 4),
                                    this.hass.loadBackendTranslation(
                                      "application_credentials",
                                      this._domain
                                    )
                                  );
                                case 4:
                                  (e = this._config.integrations[this._domain]),
                                    (this._description = this.hass.localize(
                                      "component.".concat(
                                        this._domain,
                                        ".application_credentials.description"
                                      ),
                                      e.description_placeholders
                                    ));
                                case 6:
                                case "end":
                                  return i.stop();
                              }
                          },
                          i,
                          this
                        );
                      })
                    )),
                    function () {
                      return a.apply(this, arguments);
                    }),
                },
                {
                  kind: "method",
                  key: "_handleValueChanged",
                  value: function (i) {
                    this._error = void 0;
                    var e = i.target.name,
                      t = i.target.value;
                    this["_".concat(e)] = t;
                  },
                },
                {
                  kind: "method",
                  key: "_abortDialog",
                  value: function () {
                    this._params &&
                      this._params.dialogAbortedCallback &&
                      this._params.dialogAbortedCallback(),
                      this.closeDialog();
                  },
                },
                {
                  kind: "method",
                  key: "_addApplicationCredential",
                  value:
                    ((t = (0, m.Z)(
                      (0, _.Z)().mark(function i(e) {
                        var t;
                        return (0, _.Z)().wrap(
                          function (i) {
                            for (;;)
                              switch ((i.prev = i.next)) {
                                case 0:
                                  if (
                                    (e.preventDefault(),
                                    this._domain &&
                                      this._clientId &&
                                      this._clientSecret)
                                  ) {
                                    i.next = 3;
                                    break;
                                  }
                                  return i.abrupt("return");
                                case 3:
                                  return (
                                    (this._loading = !0),
                                    (this._error = ""),
                                    (i.prev = 5),
                                    (i.next = 8),
                                    C(
                                      this.hass,
                                      this._domain,
                                      this._clientId,
                                      this._clientSecret,
                                      this._name
                                    )
                                  );
                                case 8:
                                  (t = i.sent), (i.next = 16);
                                  break;
                                case 11:
                                  return (
                                    (i.prev = 11),
                                    (i.t0 = i.catch(5)),
                                    (this._loading = !1),
                                    (this._error = i.t0.message),
                                    i.abrupt("return")
                                  );
                                case 16:
                                  this._params.applicationCredentialAddedCallback(
                                    t
                                  ),
                                    this.closeDialog();
                                case 18:
                                case "end":
                                  return i.stop();
                              }
                          },
                          i,
                          this,
                          [[5, 11]]
                        );
                      })
                    )),
                    function (i) {
                      return t.apply(this, arguments);
                    }),
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      B.yu,
                      (0, x.iv)(
                        u ||
                          (u = (0, Z.Z)([
                            "ha-dialog{--mdc-dialog-max-width:500px;--dialog-z-index:10}.row{display:flex;padding:8px 0}ha-combo-box{display:block;margin-bottom:24px}ha-textfield{display:block;margin-bottom:24px}a{text-decoration:none}a ha-svg-icon{--mdc-icon-size:16px}ha-markdown{margin-bottom:16px}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          x.oi
        );
    },
  },
]);
//# sourceMappingURL=9821.gMIWl_3CLkw.js.map
