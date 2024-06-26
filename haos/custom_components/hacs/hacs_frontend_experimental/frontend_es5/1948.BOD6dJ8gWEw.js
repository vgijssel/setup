"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1948],
  {
    86089: function (e, i, t) {
      t.d(i, {
        U: function () {
          return n;
        },
      });
      var n = function (e) {
        return e.stopPropagation();
      };
    },
    27056: function (e, i, t) {
      var n,
        a,
        d = t(99312),
        r = t(81043),
        s = t(33368),
        c = t(71650),
        o = t(68308),
        l = t(82390),
        u = t(69205),
        h = t(91808),
        v = t(88962),
        p =
          (t(22859),
          t(97393),
          t(87438),
          t(46798),
          t(9849),
          t(22890),
          t(13526),
          t(40271),
          t(60163),
          t(49089),
          t(46349),
          t(70320),
          t(37313),
          t(10733),
          t(5095)),
        _ = t(95260),
        m = t(14516),
        y = t(18394),
        f = t(36655),
        k = t(28858),
        g = t(1913),
        b = t(16061),
        C =
          (t(16591),
          t(90532),
          function (e) {
            return (0, p.dy)(
              n ||
                (n = (0, v.Z)([
                  '<ha-list-item .twoline="',
                  '"> <span>',
                  '</span> <span slot="secondary">',
                  "</span> </ha-list-item>",
                ])),
              !!e.area,
              e.name,
              e.area
            );
          });
      (0, h.Z)(
        [(0, _.Mo)("ha-device-picker")],
        function (e, i) {
          var t,
            n,
            h = (function (i) {
              function t() {
                var i;
                (0, c.Z)(this, t);
                for (
                  var n = arguments.length, a = new Array(n), d = 0;
                  d < n;
                  d++
                )
                  a[d] = arguments[d];
                return (i = (0, o.Z)(this, t, [].concat(a))), e((0, l.Z)(i)), i;
              }
              return (0, u.Z)(t, i), (0, s.Z)(t);
            })(i);
          return {
            F: h,
            d: [
              {
                kind: "field",
                decorators: [(0, _.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "label",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "value",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "helper",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "include-domains" }),
                ],
                key: "includeDomains",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "exclude-domains" }),
                ],
                key: "excludeDomains",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({
                    type: Array,
                    attribute: "include-device-classes",
                  }),
                ],
                key: "includeDeviceClasses",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [
                  (0, _.Cb)({ type: Array, attribute: "exclude-devices" }),
                ],
                key: "excludeDevices",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "deviceFilter",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)()],
                key: "entityFilter",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)({ type: Boolean })],
                key: "disabled",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, _.Cb)({ type: Boolean })],
                key: "required",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                decorators: [(0, _.SB)()],
                key: "_opened",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, _.IO)("ha-combo-box", !0)],
                key: "comboBox",
                value: void 0,
              },
              {
                kind: "field",
                key: "_init",
                value: function () {
                  return !1;
                },
              },
              {
                kind: "field",
                key: "_getDevices",
                value: function () {
                  var e = this;
                  return (0, m.Z)(function (i, t, n, a, d, r, s, c, o) {
                    if (!i.length)
                      return [
                        {
                          id: "no_devices",
                          area: "",
                          name: e.hass.localize(
                            "ui.components.device-picker.no_devices"
                          ),
                          strings: [],
                        },
                      ];
                    var l = {};
                    (a || d || r || c) && (l = (0, b.R6)(n));
                    var u = i.filter(function (i) {
                      return i.id === e.value || !i.disabled_by;
                    });
                    a &&
                      (u = u.filter(function (e) {
                        var i = l[e.id];
                        return (
                          !(!i || !i.length) &&
                          l[e.id].some(function (e) {
                            return a.includes((0, f.M)(e.entity_id));
                          })
                        );
                      })),
                      d &&
                        (u = u.filter(function (e) {
                          var i = l[e.id];
                          return (
                            !i ||
                            !i.length ||
                            n.every(function (e) {
                              return !d.includes((0, f.M)(e.entity_id));
                            })
                          );
                        })),
                      o &&
                        (u = u.filter(function (e) {
                          return !o.includes(e.id);
                        })),
                      r &&
                        (u = u.filter(function (i) {
                          var t = l[i.id];
                          return (
                            !(!t || !t.length) &&
                            l[i.id].some(function (i) {
                              var t = e.hass.states[i.entity_id];
                              return (
                                !!t &&
                                t.attributes.device_class &&
                                r.includes(t.attributes.device_class)
                              );
                            })
                          );
                        })),
                      c &&
                        (u = u.filter(function (i) {
                          var t = l[i.id];
                          return (
                            !(!t || !t.length) &&
                            t.some(function (i) {
                              var t = e.hass.states[i.entity_id];
                              return !!t && c(t);
                            })
                          );
                        })),
                      s &&
                        (u = u.filter(function (i) {
                          return i.id === e.value || s(i);
                        }));
                    var h = u.map(function (i) {
                      var n = (0, b.jL)(i, e.hass, l[i.id]);
                      return {
                        id: i.id,
                        name: n,
                        area:
                          i.area_id && t[i.area_id]
                            ? t[i.area_id].name
                            : e.hass.localize(
                                "ui.components.device-picker.no_area"
                              ),
                        strings: [n || ""],
                      };
                    });
                    return h.length
                      ? 1 === h.length
                        ? h
                        : h.sort(function (i, t) {
                            return (0, k.$)(
                              i.name || "",
                              t.name || "",
                              e.hass.locale.language
                            );
                          })
                      : [
                          {
                            id: "no_devices",
                            area: "",
                            name: e.hass.localize(
                              "ui.components.device-picker.no_match"
                            ),
                            strings: [],
                          },
                        ];
                  });
                },
              },
              {
                kind: "method",
                key: "open",
                value:
                  ((n = (0, r.Z)(
                    (0, d.Z)().mark(function e() {
                      var i;
                      return (0, d.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.updateComplete;
                              case 2:
                                return (
                                  (e.next = 4),
                                  null === (i = this.comboBox) || void 0 === i
                                    ? void 0
                                    : i.open()
                                );
                              case 4:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return n.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "focus",
                value:
                  ((t = (0, r.Z)(
                    (0, d.Z)().mark(function e() {
                      var i;
                      return (0, d.Z)().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.updateComplete;
                              case 2:
                                return (
                                  (e.next = 4),
                                  null === (i = this.comboBox) || void 0 === i
                                    ? void 0
                                    : i.focus()
                                );
                              case 4:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return t.apply(this, arguments);
                  }),
              },
              {
                kind: "method",
                key: "updated",
                value: function (e) {
                  if (
                    (!this._init && this.hass) ||
                    (this._init && e.has("_opened") && this._opened)
                  ) {
                    this._init = !0;
                    var i = this._getDevices(
                      Object.values(this.hass.devices),
                      this.hass.areas,
                      Object.values(this.hass.entities),
                      this.includeDomains,
                      this.excludeDomains,
                      this.includeDeviceClasses,
                      this.deviceFilter,
                      this.entityFilter,
                      this.excludeDevices
                    );
                    (this.comboBox.items = i),
                      (this.comboBox.filteredItems = i);
                  }
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, p.dy)(
                    a ||
                      (a = (0, v.Z)([
                        ' <ha-combo-box .hass="',
                        '" .label="',
                        '" .value="',
                        '" .helper="',
                        '" .renderer="',
                        '" .disabled="',
                        '" .required="',
                        '" item-id-path="id" item-value-path="id" item-label-path="name" @opened-changed="',
                        '" @value-changed="',
                        '" @filter-changed="',
                        '"></ha-combo-box> ',
                      ])),
                    this.hass,
                    void 0 === this.label && this.hass
                      ? this.hass.localize("ui.components.device-picker.device")
                      : this.label,
                    this._value,
                    this.helper,
                    C,
                    this.disabled,
                    this.required,
                    this._openedChanged,
                    this._deviceChanged,
                    this._filterChanged
                  );
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
                key: "_filterChanged",
                value: function (e) {
                  var i = e.target,
                    t = e.detail.value.toLowerCase();
                  i.filteredItems = t.length
                    ? (0, g.q)(t, i.items || [])
                    : i.items;
                },
              },
              {
                kind: "method",
                key: "_deviceChanged",
                value: function (e) {
                  e.stopPropagation();
                  var i = e.detail.value;
                  "no_devices" === i && (i = ""),
                    i !== this._value && this._setValue(i);
                },
              },
              {
                kind: "method",
                key: "_openedChanged",
                value: function (e) {
                  this._opened = e.detail.value;
                },
              },
              {
                kind: "method",
                key: "_setValue",
                value: function (e) {
                  var i = this;
                  (this.value = e),
                    setTimeout(function () {
                      (0, y.B)(i, "value-changed", { value: e }),
                        (0, y.B)(i, "change");
                    }, 0);
                },
              },
            ],
          };
        },
        p.oi
      );
    },
    7265: function (e, i, t) {
      var n,
        a,
        d = t(88962),
        r = t(33368),
        s = t(71650),
        c = t(68308),
        o = t(82390),
        l = t(69205),
        u = t(91808),
        h = (t(97393), t(5095)),
        v = t(95260);
      (0, u.Z)(
        [(0, v.Mo)("ha-input-helper-text")],
        function (e, i) {
          var t = (function (i) {
            function t() {
              var i;
              (0, s.Z)(this, t);
              for (
                var n = arguments.length, a = new Array(n), d = 0;
                d < n;
                d++
              )
                a[d] = arguments[d];
              return (i = (0, c.Z)(this, t, [].concat(a))), e((0, o.Z)(i)), i;
            }
            return (0, l.Z)(t, i), (0, r.Z)(t);
          })(i);
          return {
            F: t,
            d: [
              {
                kind: "method",
                key: "render",
                value: function () {
                  return (0, h.dy)(n || (n = (0, d.Z)(["<slot></slot>"])));
                },
              },
              {
                kind: "field",
                static: !0,
                key: "styles",
                value: function () {
                  return (0, h.iv)(
                    a ||
                      (a = (0, d.Z)([
                        ":host{display:block;color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6));font-size:.75rem;padding-left:16px;padding-right:16px}",
                      ]))
                  );
                },
              },
            ],
          };
        },
        h.oi
      );
    },
    51948: function (e, i, t) {
      t.r(i),
        t.d(i, {
          HaTargetSelector: function () {
            return J;
          },
        });
      var n,
        a,
        d,
        r,
        s,
        c,
        o,
        l,
        u,
        h,
        v,
        p,
        _,
        m,
        y,
        f,
        k = t(88962),
        g = t(33368),
        b = t(71650),
        C = t(68308),
        x = t(82390),
        Z = t(69205),
        D = t(91808),
        V = t(34541),
        F = t(47838),
        M = (t(97393), t(46798), t(9849), t(13526), t(10733), t(5095)),
        L = t(95260),
        w = t(14516),
        H = t(4771),
        O = t(16061),
        z = t(92794),
        j = t(29934),
        I = t(99312),
        B = t(81043),
        P = t(46097),
        S = t(93359),
        E =
          (t(46349),
          t(70320),
          t(22859),
          t(40271),
          t(60163),
          t(85717),
          t(50289),
          t(94167),
          t(36513),
          t(87438),
          t(22890),
          t(65974),
          t(33829),
          t(67182)),
        A = (t(14271), t(99608), t(53180)),
        T = t(18394),
        R = t(86089),
        q = t(36655),
        $ = t(2733),
        U = t(11705),
        G =
          (t(27056),
          t(91998),
          t(25718),
          t(54371),
          t(7265),
          t(37662),
          "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"),
        J =
          ((0, D.Z)(
            [(0, L.Mo)("ha-target-picker")],
            function (e, i) {
              var t,
                y = (function (i) {
                  function t() {
                    var i;
                    (0, b.Z)(this, t);
                    for (
                      var n = arguments.length, a = new Array(n), d = 0;
                      d < n;
                      d++
                    )
                      a[d] = arguments[d];
                    return (
                      (i = (0, C.Z)(this, t, [].concat(a))), e((0, x.Z)(i)), i
                    );
                  }
                  return (0, Z.Z)(t, i), (0, g.Z)(t);
                })(i);
              return {
                F: y,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ attribute: !1 })],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, L.Cb)({ type: Array, attribute: "include-domains" }),
                    ],
                    key: "includeDomains",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, L.Cb)({
                        type: Array,
                        attribute: "include-device-classes",
                      }),
                    ],
                    key: "includeDeviceClasses",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "deviceFilter",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "entityFilter",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ type: Boolean, reflect: !0 })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ type: Boolean })],
                    key: "addOnTop",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.SB)()],
                    key: "_addMode",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.IO)("#input")],
                    key: "_inputElement",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.IO)(".add-container", !0)],
                    key: "_addContainer",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    key: "_opened",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this.addOnTop
                        ? (0, M.dy)(
                            n || (n = (0, k.Z)([" ", " ", " "])),
                            this._renderChips(),
                            this._renderItems()
                          )
                        : (0, M.dy)(
                            a || (a = (0, k.Z)([" ", " ", " "])),
                            this._renderItems(),
                            this._renderChips()
                          );
                    },
                  },
                  {
                    kind: "method",
                    key: "_renderItems",
                    value: function () {
                      var e,
                        i,
                        t,
                        n = this;
                      return (0, M.dy)(
                        d ||
                          (d = (0, k.Z)([
                            ' <div class="mdc-chip-set items"> ',
                            " ",
                            " ",
                            " </div> ",
                          ])),
                        null !== (e = this.value) && void 0 !== e && e.area_id
                          ? (0, H.r)(this.value.area_id).map(function (e) {
                              var i = n.hass.areas[e];
                              return n._renderChip(
                                "area_id",
                                e,
                                (null == i ? void 0 : i.name) || e,
                                void 0,
                                "M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z"
                              );
                            })
                          : "",
                        null !== (i = this.value) && void 0 !== i && i.device_id
                          ? (0, H.r)(this.value.device_id).map(function (e) {
                              var i = n.hass.devices[e];
                              return n._renderChip(
                                "device_id",
                                e,
                                i ? (0, O.jL)(i, n.hass) : e,
                                void 0,
                                "M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"
                              );
                            })
                          : "",
                        null !== (t = this.value) && void 0 !== t && t.entity_id
                          ? (0, H.r)(this.value.entity_id).map(function (e) {
                              var i = n.hass.states[e];
                              return n._renderChip(
                                "entity_id",
                                e,
                                i ? (0, $.C)(i) : e,
                                i
                              );
                            })
                          : ""
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_renderChips",
                    value: function () {
                      return (0, M.dy)(
                        r ||
                          (r = (0, k.Z)([
                            ' <div class="mdc-chip-set add-container"> <div class="mdc-chip area_id add" .type="',
                            '" @click="',
                            '"> <div class="mdc-chip__ripple"></div> <ha-svg-icon class="mdc-chip__icon mdc-chip__icon--leading" .path="',
                            '"></ha-svg-icon> <span role="gridcell"> <span role="button" tabindex="0" class="mdc-chip__primary-action"> <span class="mdc-chip__text">',
                            '</span> </span> </span> </div> <div class="mdc-chip device_id add" .type="',
                            '" @click="',
                            '"> <div class="mdc-chip__ripple"></div> <ha-svg-icon class="mdc-chip__icon mdc-chip__icon--leading" .path="',
                            '"></ha-svg-icon> <span role="gridcell"> <span role="button" tabindex="0" class="mdc-chip__primary-action"> <span class="mdc-chip__text">',
                            '</span> </span> </span> </div> <div class="mdc-chip entity_id add" .type="',
                            '" @click="',
                            '"> <div class="mdc-chip__ripple"></div> <ha-svg-icon class="mdc-chip__icon mdc-chip__icon--leading" .path="',
                            '"></ha-svg-icon> <span role="gridcell"> <span role="button" tabindex="0" class="mdc-chip__primary-action"> <span class="mdc-chip__text">',
                            "</span> </span> </span> </div> ",
                            " </div> ",
                            " ",
                          ])),
                        "area_id",
                        this._showPicker,
                        G,
                        this.hass.localize(
                          "ui.components.target-picker.add_area_id"
                        ),
                        "device_id",
                        this._showPicker,
                        G,
                        this.hass.localize(
                          "ui.components.target-picker.add_device_id"
                        ),
                        "entity_id",
                        this._showPicker,
                        G,
                        this.hass.localize(
                          "ui.components.target-picker.add_entity_id"
                        ),
                        this._renderPicker(),
                        this.helper
                          ? (0, M.dy)(
                              s ||
                                (s = (0, k.Z)([
                                  "<ha-input-helper-text>",
                                  "</ha-input-helper-text>",
                                ])),
                              this.helper
                            )
                          : ""
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_showPicker",
                    value: function (e) {
                      this._addMode = e.currentTarget.type;
                    },
                  },
                  {
                    kind: "method",
                    key: "_renderChip",
                    value: function (e, i, t, n, a) {
                      return (0, M.dy)(
                        c ||
                          (c = (0, k.Z)([
                            ' <div class="mdc-chip ',
                            '"> ',
                            " ",
                            ' <span role="gridcell"> <span role="button" tabindex="0" class="mdc-chip__primary-action"> <span class="mdc-chip__text">',
                            "</span> </span> </span> ",
                            ' <span role="gridcell"> <ha-icon-button class="mdc-chip__icon mdc-chip__icon--trailing" .label="',
                            '" .path="',
                            '" hideTooltip .id="',
                            '" .type="',
                            '" @click="',
                            '"></ha-icon-button> <simple-tooltip animation-delay="0">',
                            "</simple-tooltip> </span> </div> ",
                          ])),
                        (0, A.$)((0, S.Z)({}, e, !0)),
                        a
                          ? (0, M.dy)(
                              o ||
                                (o = (0, k.Z)([
                                  '<ha-svg-icon class="mdc-chip__icon mdc-chip__icon--leading" .path="',
                                  '"></ha-svg-icon>',
                                ])),
                              a
                            )
                          : "",
                        n
                          ? (0, M.dy)(
                              l ||
                                (l = (0, k.Z)([
                                  '<ha-state-icon class="mdc-chip__icon mdc-chip__icon--leading" .hass="',
                                  '" .stateObj="',
                                  '"></ha-state-icon>',
                                ])),
                              this.hass,
                              n
                            )
                          : "",
                        t,
                        "entity_id" === e
                          ? ""
                          : (0, M.dy)(
                              u ||
                                (u = (0, k.Z)([
                                  '<span role="gridcell"> <ha-icon-button class="expand-btn mdc-chip__icon mdc-chip__icon--trailing" .label="',
                                  '" .path="',
                                  '" hideTooltip .id="',
                                  '" .type="',
                                  '" @click="',
                                  '"></ha-icon-button> <simple-tooltip class="expand" animation-delay="0">',
                                  "</simple-tooltip> </span>",
                                ])),
                              this.hass.localize(
                                "ui.components.target-picker.expand"
                              ),
                              "M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z",
                              i,
                              e,
                              this._handleExpand,
                              this.hass.localize(
                                "ui.components.target-picker.expand_".concat(e)
                              )
                            ),
                        this.hass.localize(
                          "ui.components.target-picker.remove"
                        ),
                        "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
                        i,
                        e,
                        this._handleRemove,
                        this.hass.localize(
                          "ui.components.target-picker.remove_".concat(e)
                        )
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_renderPicker",
                    value: function () {
                      var e, i, t;
                      return this._addMode
                        ? (0, M.dy)(
                            h ||
                              (h = (0, k.Z)([
                                '<mwc-menu-surface open .anchor="',
                                '" @closed="',
                                '" @opened="',
                                '" @opened-changed="',
                                '" @input="',
                                '">',
                                "</mwc-menu-surface>",
                              ])),
                            this._addContainer,
                            this._onClosed,
                            this._onOpened,
                            this._openedChanged,
                            R.U,
                            "area_id" === this._addMode
                              ? (0, M.dy)(
                                  v ||
                                    (v = (0, k.Z)([
                                      ' <ha-area-picker .hass="',
                                      '" id="input" .type="',
                                      '" .label="',
                                      '" no-add .deviceFilter="',
                                      '" .entityFilter="',
                                      '" .includeDeviceClasses="',
                                      '" .includeDomains="',
                                      '" .excludeAreas="',
                                      '" @value-changed="',
                                      '" @click="',
                                      '"></ha-area-picker> ',
                                    ])),
                                  this.hass,
                                  "area_id",
                                  this.hass.localize(
                                    "ui.components.target-picker.add_area_id"
                                  ),
                                  this.deviceFilter,
                                  this.entityFilter,
                                  this.includeDeviceClasses,
                                  this.includeDomains,
                                  (0, H.r)(
                                    null === (e = this.value) || void 0 === e
                                      ? void 0
                                      : e.area_id
                                  ),
                                  this._targetPicked,
                                  this._preventDefault
                                )
                              : "device_id" === this._addMode
                              ? (0, M.dy)(
                                  p ||
                                    (p = (0, k.Z)([
                                      ' <ha-device-picker .hass="',
                                      '" id="input" .type="',
                                      '" .label="',
                                      '" .deviceFilter="',
                                      '" .entityFilter="',
                                      '" .includeDeviceClasses="',
                                      '" .includeDomains="',
                                      '" .excludeDevices="',
                                      '" @value-changed="',
                                      '" @click="',
                                      '"></ha-device-picker> ',
                                    ])),
                                  this.hass,
                                  "device_id",
                                  this.hass.localize(
                                    "ui.components.target-picker.add_device_id"
                                  ),
                                  this.deviceFilter,
                                  this.entityFilter,
                                  this.includeDeviceClasses,
                                  this.includeDomains,
                                  (0, H.r)(
                                    null === (i = this.value) || void 0 === i
                                      ? void 0
                                      : i.device_id
                                  ),
                                  this._targetPicked,
                                  this._preventDefault
                                )
                              : (0, M.dy)(
                                  _ ||
                                    (_ = (0, k.Z)([
                                      ' <ha-entity-picker .hass="',
                                      '" id="input" .type="',
                                      '" .label="',
                                      '" .entityFilter="',
                                      '" .includeDeviceClasses="',
                                      '" .includeDomains="',
                                      '" .excludeEntities="',
                                      '" @value-changed="',
                                      '" @click="',
                                      '" allow-custom-entity></ha-entity-picker> ',
                                    ])),
                                  this.hass,
                                  "entity_id",
                                  this.hass.localize(
                                    "ui.components.target-picker.add_entity_id"
                                  ),
                                  this.entityFilter,
                                  this.includeDeviceClasses,
                                  this.includeDomains,
                                  (0, H.r)(
                                    null === (t = this.value) || void 0 === t
                                      ? void 0
                                      : t.entity_id
                                  ),
                                  this._targetPicked,
                                  this._preventDefault
                                )
                          )
                        : M.Ld;
                    },
                  },
                  {
                    kind: "method",
                    key: "_targetPicked",
                    value: function (e) {
                      if ((e.stopPropagation(), e.detail.value)) {
                        var i = e.detail.value,
                          t = e.currentTarget;
                        ("entity_id" !== t.type || (0, U.T)(i)) &&
                          ((t.value = ""),
                          (this.value &&
                            this.value[t.type] &&
                            (0, H.r)(this.value[t.type]).includes(i)) ||
                            (0, T.B)(this, "value-changed", {
                              value: this.value
                                ? Object.assign(
                                    Object.assign({}, this.value),
                                    {},
                                    (0, S.Z)(
                                      {},
                                      t.type,
                                      this.value[t.type]
                                        ? [].concat(
                                            (0, P.Z)(
                                              (0, H.r)(this.value[t.type])
                                            ),
                                            [i]
                                          )
                                        : i
                                    )
                                  )
                                : (0, S.Z)({}, t.type, i),
                            }));
                      }
                    },
                  },
                  {
                    kind: "method",
                    key: "_handleExpand",
                    value: function (e) {
                      var i = this,
                        t = e.currentTarget,
                        n = [],
                        a = [];
                      if ("area_id" === t.type)
                        Object.values(this.hass.devices).forEach(function (e) {
                          var a;
                          e.area_id !== t.id ||
                            (null !== (a = i.value.device_id) &&
                              void 0 !== a &&
                              a.includes(e.id)) ||
                            !i._deviceMeetsFilter(e) ||
                            n.push(e.id);
                        }),
                          Object.values(this.hass.entities).forEach(
                            function (e) {
                              var n;
                              e.area_id !== t.id ||
                                (null !== (n = i.value.entity_id) &&
                                  void 0 !== n &&
                                  n.includes(e.entity_id)) ||
                                !i._entityRegMeetsFilter(e) ||
                                a.push(e.entity_id);
                            }
                          );
                      else {
                        if ("device_id" !== t.type) return;
                        Object.values(this.hass.entities).forEach(function (e) {
                          var n;
                          e.device_id !== t.id ||
                            (null !== (n = i.value.entity_id) &&
                              void 0 !== n &&
                              n.includes(e.entity_id)) ||
                            !i._entityRegMeetsFilter(e) ||
                            a.push(e.entity_id);
                        });
                      }
                      var d = this.value;
                      a.length && (d = this._addItems(d, "entity_id", a)),
                        n.length && (d = this._addItems(d, "device_id", n)),
                        (d = this._removeItem(d, t.type, t.id)),
                        (0, T.B)(this, "value-changed", { value: d });
                    },
                  },
                  {
                    kind: "method",
                    key: "_handleRemove",
                    value: function (e) {
                      var i = e.currentTarget;
                      (0, T.B)(this, "value-changed", {
                        value: this._removeItem(this.value, i.type, i.id),
                      });
                    },
                  },
                  {
                    kind: "method",
                    key: "_addItems",
                    value: function (e, i, t) {
                      return Object.assign(
                        Object.assign({}, e),
                        {},
                        (0, S.Z)({}, i, e[i] ? (0, H.r)(e[i]).concat(t) : t)
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_removeItem",
                    value: function (e, i, t) {
                      var n = (0, H.r)(e[i]).filter(function (e) {
                        return String(e) !== t;
                      });
                      if (n.length)
                        return Object.assign(
                          Object.assign({}, e),
                          {},
                          (0, S.Z)({}, i, n)
                        );
                      var a = Object.assign({}, e);
                      return delete a[i], Object.keys(a).length ? a : void 0;
                    },
                  },
                  {
                    kind: "method",
                    key: "_onClosed",
                    value: function (e) {
                      e.stopPropagation(), (e.target.open = !0);
                    },
                  },
                  {
                    kind: "method",
                    key: "_onOpened",
                    value:
                      ((t = (0, B.Z)(
                        (0, I.Z)().mark(function e() {
                          var i, t;
                          return (0, I.Z)().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (this._addMode) {
                                      e.next = 2;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 2:
                                    return (
                                      (e.next = 4),
                                      null === (i = this._inputElement) ||
                                      void 0 === i
                                        ? void 0
                                        : i.focus()
                                    );
                                  case 4:
                                    return (
                                      (e.next = 6),
                                      null === (t = this._inputElement) ||
                                      void 0 === t
                                        ? void 0
                                        : t.open()
                                    );
                                  case 6:
                                    this._opened = !0;
                                  case 7:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function () {
                        return t.apply(this, arguments);
                      }),
                  },
                  {
                    kind: "method",
                    key: "_openedChanged",
                    value: function (e) {
                      this._opened &&
                        !e.detail.value &&
                        ((this._opened = !1), (this._addMode = void 0));
                    },
                  },
                  {
                    kind: "method",
                    key: "_preventDefault",
                    value: function (e) {
                      e.preventDefault();
                    },
                  },
                  {
                    kind: "method",
                    key: "_deviceMeetsFilter",
                    value: function (e) {
                      var i = this,
                        t = Object.values(this.hass.entities).filter(
                          function (i) {
                            return i.device_id === e.id;
                          }
                        );
                      if (this.includeDomains) {
                        if (!t || !t.length) return !1;
                        if (
                          !t.some(function (e) {
                            return i.includeDomains.includes(
                              (0, q.M)(e.entity_id)
                            );
                          })
                        )
                          return !1;
                      }
                      if (this.includeDeviceClasses) {
                        if (!t || !t.length) return !1;
                        if (
                          !t.some(function (e) {
                            var t = i.hass.states[e.entity_id];
                            return (
                              !!t &&
                              t.attributes.device_class &&
                              i.includeDeviceClasses.includes(
                                t.attributes.device_class
                              )
                            );
                          })
                        )
                          return !1;
                      }
                      return (
                        !(this.deviceFilter && !this.deviceFilter(e)) &&
                        !(
                          this.entityFilter &&
                          !t.some(function (e) {
                            var t = i.hass.states[e.entity_id];
                            return !!t && i.entityFilter(t);
                          })
                        )
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "_entityRegMeetsFilter",
                    value: function (e) {
                      if (e.entity_category) return !1;
                      if (
                        this.includeDomains &&
                        !this.includeDomains.includes((0, q.M)(e.entity_id))
                      )
                        return !1;
                      if (this.includeDeviceClasses) {
                        var i = this.hass.states[e.entity_id];
                        if (!i) return !1;
                        if (
                          !i.attributes.device_class ||
                          !this.includeDeviceClasses.includes(
                            i.attributes.device_class
                          )
                        )
                          return !1;
                      }
                      if (this.entityFilter) {
                        var t = this.hass.states[e.entity_id];
                        if (!t) return !1;
                        if (!this.entityFilter(t)) return !1;
                      }
                      return !0;
                    },
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, M.iv)(
                        m ||
                          (m = (0, k.Z)([
                            "",
                            " .mdc-chip{color:var(--primary-text-color)}.items{z-index:2}.mdc-chip-set{padding:4px 0}.mdc-chip.add{color:rgba(0,0,0,.87)}.add-container{position:relative;display:inline-flex}.mdc-chip:not(.add){cursor:default}.mdc-chip ha-icon-button{--mdc-icon-button-size:24px;display:flex;align-items:center;outline:0}.mdc-chip ha-icon-button ha-svg-icon{border-radius:50%;background:var(--secondary-text-color)}.mdc-chip__icon.mdc-chip__icon--trailing{width:16px;height:16px;--mdc-icon-size:14px;color:var(--secondary-text-color);margin-inline-start:4px!important;margin-inline-end:-4px!important;direction:var(--direction)}.mdc-chip__icon--leading{display:flex;align-items:center;justify-content:center;--mdc-icon-size:20px;border-radius:50%;padding:6px;margin-left:-14px!important;margin-inline-start:-14px!important;margin-inline-end:4px!important;direction:var(--direction)}.expand-btn{margin-right:0}.mdc-chip.area_id:not(.add){border:2px solid #fed6a4;background:var(--card-background-color)}.mdc-chip.area_id.add,.mdc-chip.area_id:not(.add) .mdc-chip__icon--leading{background:#fed6a4}.mdc-chip.device_id:not(.add){border:2px solid #a8e1fb;background:var(--card-background-color)}.mdc-chip.device_id.add,.mdc-chip.device_id:not(.add) .mdc-chip__icon--leading{background:#a8e1fb}.mdc-chip.entity_id:not(.add){border:2px solid #d2e7b9;background:var(--card-background-color)}.mdc-chip.entity_id.add,.mdc-chip.entity_id:not(.add) .mdc-chip__icon--leading{background:#d2e7b9}.mdc-chip:hover{z-index:5}simple-tooltip.expand{min-width:200px}:host([disabled]) .mdc-chip{opacity:var(--light-disabled-opacity);pointer-events:none}mwc-menu-surface{--mdc-menu-min-width:100%}ha-area-picker,ha-device-picker,ha-entity-picker{display:block;width:100%}",
                          ])),
                        (0, M.$m)(E)
                      );
                    },
                  },
                ],
              };
            },
            M.oi
          ),
          (0, D.Z)(
            [(0, L.Mo)("ha-selector-target")],
            function (e, i) {
              var t = (function (i) {
                function t() {
                  var i;
                  (0, b.Z)(this, t);
                  for (
                    var n = arguments.length, a = new Array(n), d = 0;
                    d < n;
                    d++
                  )
                    a[d] = arguments[d];
                  return (
                    (i = (0, C.Z)(this, t, [].concat(a))), e((0, x.Z)(i)), i
                  );
                }
                return (0, Z.Z)(t, i), (0, g.Z)(t);
              })(i);
              return {
                F: t,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "value",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)()],
                    key: "helper",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, L.SB)()],
                    key: "_entitySources",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    key: "_deviceIntegrationLookup",
                    value: function () {
                      return (0, w.Z)(O.HP);
                    },
                  },
                  {
                    kind: "method",
                    key: "_hasIntegration",
                    value: function (e) {
                      var i, t;
                      return (
                        ((null === (i = e.target) || void 0 === i
                          ? void 0
                          : i.entity) &&
                          (0, H.r)(e.target.entity).some(function (e) {
                            return e.integration;
                          })) ||
                        ((null === (t = e.target) || void 0 === t
                          ? void 0
                          : t.device) &&
                          (0, H.r)(e.target.device).some(function (e) {
                            return e.integration;
                          }))
                      );
                    },
                  },
                  {
                    kind: "method",
                    key: "updated",
                    value: function (e) {
                      var i = this;
                      (0, V.Z)((0, F.Z)(t.prototype), "updated", this).call(
                        this,
                        e
                      ),
                        e.has("selector") &&
                          this._hasIntegration(this.selector) &&
                          !this._entitySources &&
                          (0, z.m)(this.hass).then(function (e) {
                            i._entitySources = e;
                          });
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this._hasIntegration(this.selector) &&
                        !this._entitySources
                        ? M.Ld
                        : (0, M.dy)(
                            y ||
                              (y = (0, k.Z)([
                                '<ha-target-picker .hass="',
                                '" .value="',
                                '" .helper="',
                                '" .deviceFilter="',
                                '" .entityFilter="',
                                '" .disabled="',
                                '"></ha-target-picker>',
                              ])),
                            this.hass,
                            this.value,
                            this.helper,
                            this._filterDevices,
                            this._filterEntities,
                            this.disabled
                          );
                    },
                  },
                  {
                    kind: "field",
                    key: "_filterEntities",
                    value: function () {
                      var e = this;
                      return function (i) {
                        var t;
                        return (
                          null === (t = e.selector.target) ||
                          void 0 === t ||
                          !t.entity ||
                          (0, H.r)(e.selector.target.entity).some(function (t) {
                            return (0, j.lV)(t, i, e._entitySources);
                          })
                        );
                      };
                    },
                  },
                  {
                    kind: "field",
                    key: "_filterDevices",
                    value: function () {
                      var e = this;
                      return function (i) {
                        var t;
                        if (
                          null === (t = e.selector.target) ||
                          void 0 === t ||
                          !t.device
                        )
                          return !0;
                        var n = e._entitySources
                          ? e._deviceIntegrationLookup(
                              e._entitySources,
                              Object.values(e.hass.entities)
                            )
                          : void 0;
                        return (0, H.r)(e.selector.target.device).some(
                          function (e) {
                            return (0, j.lE)(e, i, n);
                          }
                        );
                      };
                    },
                  },
                  {
                    kind: "get",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, M.iv)(
                        f || (f = (0, k.Z)(["ha-target-picker{display:block}"]))
                      );
                    },
                  },
                ],
              };
            },
            M.oi
          ));
    },
  },
]);
//# sourceMappingURL=1948.BOD6dJ8gWEw.js.map
