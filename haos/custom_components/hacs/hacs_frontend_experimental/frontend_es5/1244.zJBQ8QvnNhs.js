"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1244],
  {
    52996: function (e, t, n) {
      n.d(t, {
        p: function () {
          return i;
        },
      });
      n(40271), n(60163);
      var i = function (e, t) {
        return e && e.config.components.includes(t);
      };
    },
    86089: function (e, t, n) {
      n.d(t, {
        U: function () {
          return i;
        },
      });
      var i = function (e) {
        return e.stopPropagation();
      };
    },
    71133: function (e, t, n) {
      var i,
        a,
        r,
        o,
        s = n(99312),
        l = n(81043),
        c = n(88962),
        u = n(33368),
        d = n(71650),
        h = n(68308),
        p = n(82390),
        f = n(69205),
        v = n(91808),
        k = n(34541),
        m = n(47838),
        b = (n(97393), n(49412)),
        y = n(3762),
        _ = n(5095),
        g = n(95260),
        Z = n(72218),
        C = n(2537);
      n(54371),
        (0, v.Z)(
          [(0, g.Mo)("ha-select")],
          function (e, t) {
            var n = (function (t) {
              function n() {
                var t;
                (0, d.Z)(this, n);
                for (
                  var i = arguments.length, a = new Array(i), r = 0;
                  r < i;
                  r++
                )
                  a[r] = arguments[r];
                return (t = (0, h.Z)(this, n, [].concat(a))), e((0, p.Z)(t)), t;
              }
              return (0, f.Z)(n, t), (0, u.Z)(n);
            })(t);
            return {
              F: n,
              d: [
                {
                  kind: "field",
                  decorators: [(0, g.Cb)({ type: Boolean })],
                  key: "icon",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, g.Cb)({ type: Boolean, reflect: !0 })],
                  key: "clearable",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return (0, _.dy)(
                      i || (i = (0, c.Z)([" ", " ", " "])),
                      (0, k.Z)((0, m.Z)(n.prototype), "render", this).call(
                        this
                      ),
                      this.clearable &&
                        !this.required &&
                        !this.disabled &&
                        this.value
                        ? (0, _.dy)(
                            a ||
                              (a = (0, c.Z)([
                                '<ha-icon-button label="clear" @click="',
                                '" .path="',
                                '"></ha-icon-button>',
                              ])),
                            this._clearValue,
                            "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                          )
                        : _.Ld
                    );
                  },
                },
                {
                  kind: "method",
                  key: "renderLeadingIcon",
                  value: function () {
                    return this.icon
                      ? (0, _.dy)(
                          r ||
                            (r = (0, c.Z)([
                              '<span class="mdc-select__icon"><slot name="icon"></slot></span>',
                            ]))
                        )
                      : _.Ld;
                  },
                },
                {
                  kind: "method",
                  key: "connectedCallback",
                  value: function () {
                    (0, k.Z)(
                      (0, m.Z)(n.prototype),
                      "connectedCallback",
                      this
                    ).call(this),
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
                    (0, k.Z)(
                      (0, m.Z)(n.prototype),
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
                  value: function () {
                    var e = this;
                    return (0, Z.D)(
                      (0, l.Z)(
                        (0, s.Z)().mark(function t() {
                          return (0, s.Z)().wrap(function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (t.next = 2), (0, C.y)();
                                case 2:
                                  e.layoutOptions();
                                case 3:
                                case "end":
                                  return t.stop();
                              }
                          }, t);
                        })
                      ),
                      500
                    );
                  },
                },
                {
                  kind: "field",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      y.W,
                      (0, _.iv)(
                        o ||
                          (o = (0, c.Z)([
                            ":host([clearable]){position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:var(--secondary-text-color)}.mdc-select__anchor{width:var(--ha-select-min-width,200px)}.mdc-select--filled .mdc-select__anchor{height:var(--ha-select-height,56px)}.mdc-select--filled .mdc-floating-label{inset-inline-start:12px;inset-inline-end:initial;direction:var(--direction)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{inset-inline-start:48px;inset-inline-end:initial;direction:var(--direction)}.mdc-select .mdc-select__anchor{padding-inline-start:12px;padding-inline-end:0px;direction:var(--direction)}.mdc-select__anchor .mdc-floating-label--float-above{transform-origin:var(--float-start)}.mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,0px)}:host([clearable]) .mdc-select__selected-text-container{padding-inline-end:var(--select-selected-text-padding-end,12px)}ha-icon-button{position:absolute;top:10px;right:28px;--mdc-icon-button-size:36px;--mdc-icon-size:20px;color:var(--secondary-text-color);inset-inline-start:initial;inset-inline-end:28px;direction:var(--direction)}",
                          ]))
                      ),
                    ];
                  },
                },
              ],
            };
          },
          b.K
        );
    },
    21244: function (e, t, n) {
      n.r(t),
        n.d(t, {
          HaBackupLocationSelector: function () {
            return B;
          },
        });
      var i,
        a,
        r,
        o,
        s,
        l,
        c = n(88962),
        u = n(33368),
        d = n(71650),
        h = n(68308),
        p = n(82390),
        f = n(69205),
        v = n(91808),
        k = (n(97393), n(5095)),
        m = n(95260),
        b = n(99312),
        y = n(81043),
        _ =
          (n(46349),
          n(70320),
          n(22859),
          n(87438),
          n(46798),
          n(9849),
          n(22890),
          n(40271),
          n(60163),
          n(37313),
          n(14516)),
        g = n(52996),
        Z = n(18394),
        C = n(86089),
        A = n(28858),
        L = (function (e) {
          return (e.BIND = "bind"), (e.CIFS = "cifs"), (e.NFS = "nfs"), e;
        })({}),
        x = (function (e) {
          return (
            (e.BACKUP = "backup"), (e.MEDIA = "media"), (e.SHARE = "share"), e
          );
        })({}),
        M = (function () {
          var e = (0, y.Z)(
            (0, b.Z)().mark(function e(t) {
              return (0, b.Z)().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        t.callWS({
                          type: "supervisor/api",
                          endpoint: "/mounts",
                          method: "get",
                          timeout: null,
                        })
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t) {
            return e.apply(this, arguments);
          };
        })(),
        w = (n(23860), n(90532), n(71133), "/backup"),
        B =
          ((0, v.Z)(
            [(0, m.Mo)("ha-mount-picker")],
            function (e, t) {
              var n,
                s = (function (t) {
                  function n() {
                    var t;
                    (0, d.Z)(this, n);
                    for (
                      var i = arguments.length, a = new Array(i), r = 0;
                      r < i;
                      r++
                    )
                      a[r] = arguments[r];
                    return (
                      (t = (0, h.Z)(this, n, [].concat(a))), e((0, p.Z)(t)), t
                    );
                  }
                  return (0, f.Z)(n, t), (0, u.Z)(n);
                })(t);
              return {
                F: s,
                d: [
                  { kind: "field", key: "hass", value: void 0 },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "usage",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.SB)()],
                    key: "_mounts",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.SB)()],
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
                        return (0, k.dy)(
                          i ||
                            (i = (0, c.Z)([
                              '<ha-alert alert-type="error">',
                              "</ha-alert>",
                            ])),
                          this._error
                        );
                      if (!this._mounts) return k.Ld;
                      var e = (0, k.dy)(
                        a ||
                          (a = (0, c.Z)([
                            '<ha-list-item graphic="icon" .value="',
                            '"> <span> ',
                            ' </span> <ha-svg-icon slot="graphic" .path="',
                            '"></ha-svg-icon> </ha-list-item>',
                          ])),
                        w,
                        this.hass.localize(
                          "ui.components.mount-picker.use_datadisk"
                        ) || "Use data disk for backup",
                        "M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z"
                      );
                      return (0, k.dy)(
                        r ||
                          (r = (0, c.Z)([
                            ' <ha-select .label="',
                            '" .value="',
                            '" .required="',
                            '" .disabled="',
                            '" .helper="',
                            '" @selected="',
                            '" @closed="',
                            '" fixedMenuPosition naturalMenuWidth> ',
                            " ",
                            " ",
                            " </ha-select> ",
                          ])),
                        void 0 === this.label && this.hass
                          ? this.hass.localize(
                              "ui.components.mount-picker.mount"
                            )
                          : this.label,
                        this._value,
                        this.required,
                        this.disabled,
                        this.helper,
                        this._mountChanged,
                        C.U,
                        this.usage !== x.BACKUP ||
                          (this._mounts.default_backup_mount &&
                            this._mounts.default_backup_mount !== w)
                          ? k.Ld
                          : e,
                        this._filterMounts(this._mounts, this.usage).map(
                          function (e) {
                            return (0, k.dy)(
                              o ||
                                (o = (0, c.Z)([
                                  '<ha-list-item twoline graphic="icon" .value="',
                                  '"> <span>',
                                  '</span> <span slot="secondary">',
                                  "",
                                  "",
                                  '</span> <ha-svg-icon slot="graphic" .path="',
                                  '"></ha-svg-icon> </ha-list-item>',
                                ])),
                              e.name,
                              e.name,
                              e.server,
                              e.port ? ":".concat(e.port) : k.Ld,
                              e.type === L.NFS ? e.path : ":".concat(e.share),
                              e.usage === x.MEDIA
                                ? "M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M10 16V8L15 12"
                                : e.usage === x.SHARE
                                ? "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
                                : "M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z"
                            );
                          }
                        ),
                        this.usage === x.BACKUP &&
                          this._mounts.default_backup_mount
                          ? e
                          : k.Ld
                      );
                    },
                  },
                  {
                    kind: "field",
                    key: "_filterMounts",
                    value: function () {
                      var e = this;
                      return (0, _.Z)(function (t, n) {
                        var i = t.mounts.filter(function (e) {
                          return [L.CIFS, L.NFS].includes(e.type);
                        });
                        return (
                          n &&
                            (i = t.mounts.filter(function (e) {
                              return e.usage === n;
                            })),
                          i.sort(function (n, i) {
                            return n.name === t.default_backup_mount
                              ? -1
                              : i.name === t.default_backup_mount
                              ? 1
                              : (0, A.f)(
                                  n.name,
                                  i.name,
                                  e.hass.locale.language
                                );
                          })
                        );
                      });
                    },
                  },
                  {
                    kind: "method",
                    key: "_getMounts",
                    value:
                      ((n = (0, y.Z)(
                        (0, b.Z)().mark(function e() {
                          return (0, b.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((e.prev = 0),
                                      !(0, g.p)(this.hass, "hassio"))
                                    ) {
                                      e.next = 8;
                                      break;
                                    }
                                    return (e.next = 4), M(this.hass);
                                  case 4:
                                    (this._mounts = e.sent),
                                      this.usage !== x.BACKUP ||
                                        this.value ||
                                        (this.value =
                                          this._mounts.default_backup_mount ||
                                          w),
                                      (e.next = 9);
                                    break;
                                  case 8:
                                    this._error = this.hass.localize(
                                      "ui.components.mount-picker.error.no_supervisor"
                                    );
                                  case 9:
                                    e.next = 14;
                                    break;
                                  case 11:
                                    (e.prev = 11),
                                      (e.t0 = e.catch(0)),
                                      (this._error = this.hass.localize(
                                        "ui.components.mount-picker.error.fetch_mounts"
                                      ));
                                  case 14:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this,
                            [[0, 11]]
                          );
                        })
                      )),
                      function () {
                        return n.apply(this, arguments);
                      }),
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
                      var t = e.target.value;
                      t !== this._value && this._setValue(t);
                    },
                  },
                  {
                    kind: "method",
                    key: "_setValue",
                    value: function (e) {
                      var t = this;
                      (this.value = e),
                        setTimeout(function () {
                          (0, Z.B)(t, "value-changed", { value: e }),
                            (0, Z.B)(t, "change");
                        }, 0);
                    },
                  },
                ],
              };
            },
            k.oi
          ),
          (0, v.Z)(
            [(0, m.Mo)("ha-selector-backup_location")],
            function (e, t) {
              var n = (function (t) {
                function n() {
                  var t;
                  (0, d.Z)(this, n);
                  for (
                    var i = arguments.length, a = new Array(i), r = 0;
                    r < i;
                    r++
                  )
                    a[r] = arguments[r];
                  return (
                    (t = (0, h.Z)(this, n, [].concat(a))), e((0, p.Z)(t)), t
                  );
                }
                return (0, f.Z)(n, t), (0, u.Z)(n);
              })(t);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return (0, k.dy)(
                        s ||
                          (s = (0, c.Z)([
                            '<ha-mount-picker .hass="',
                            '" .value="',
                            '" .label="',
                            '" .helper="',
                            '" .disabled="',
                            '" .required="',
                            '" usage="backup"></ha-mount-picker>',
                          ])),
                        this.hass,
                        this.value,
                        this.label,
                        this.helper,
                        this.disabled,
                        this.required
                      );
                    },
                  },
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, k.iv)(
                        l || (l = (0, c.Z)(["ha-mount-picker{width:100%}"]))
                      );
                    },
                  },
                ],
              };
            },
            k.oi
          ));
    },
  },
]);
//# sourceMappingURL=1244.zJBQ8QvnNhs.js.map
