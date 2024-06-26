"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [4755],
  {
    34755: function (e, t, a) {
      a.r(t),
        a.d(t, {
          HaSelectorSelector: function () {
            return g;
          },
        });
      var n,
        o,
        l = a(93359),
        i = a(88962),
        r = a(76775),
        s = a(46097),
        c = a(33368),
        d = a(71650),
        u = a(68308),
        m = a(82390),
        p = a(69205),
        b = a(91808),
        h =
          (a(97393),
          a(46349),
          a(70320),
          a(65974),
          a(10733),
          a(85717),
          a(22859),
          a(5095)),
        v = a(95260),
        f = a(14516),
        y = a(18394),
        k = (a(23860), a(39663), { number: { min: 1, max: 100 } }),
        x = {
          action: [],
          area: [{ name: "multiple", selector: { boolean: {} } }],
          attribute: [{ name: "entity_id", selector: { entity: {} } }],
          boolean: [],
          color_temp: [
            {
              name: "unit",
              selector: { select: { options: ["kelvin", "mired"] } },
            },
            { name: "min", selector: { number: { mode: "box" } } },
            { name: "max", selector: { number: { mode: "box" } } },
          ],
          condition: [],
          date: [],
          datetime: [],
          device: [{ name: "multiple", selector: { boolean: {} } }],
          duration: [{ name: "enable_day", selector: { boolean: {} } }],
          entity: [{ name: "multiple", selector: { boolean: {} } }],
          icon: [],
          location: [],
          media: [],
          number: [
            { name: "min", selector: { number: { mode: "box", step: "any" } } },
            { name: "max", selector: { number: { mode: "box", step: "any" } } },
            {
              name: "step",
              selector: { number: { mode: "box", step: "any" } },
            },
          ],
          object: [],
          color_rgb: [],
          select: [
            { name: "options", selector: { object: {} } },
            { name: "multiple", selector: { boolean: {} } },
          ],
          state: [{ name: "entity_id", selector: { entity: {} } }],
          target: [],
          template: [],
          text: [
            { name: "multiple", selector: { boolean: {} } },
            { name: "multiline", selector: { boolean: {} } },
            { name: "prefix", selector: { text: {} } },
            { name: "suffix", selector: { text: {} } },
          ],
          theme: [],
          time: [],
        },
        g = (0, b.Z)(
          [(0, v.Mo)("ha-selector-selector")],
          function (e, t) {
            var a = (function (t) {
              function a() {
                var t;
                (0, d.Z)(this, a);
                for (
                  var n = arguments.length, o = new Array(n), l = 0;
                  l < n;
                  l++
                )
                  o[l] = arguments[l];
                return (t = (0, u.Z)(this, a, [].concat(o))), e((0, m.Z)(t)), t;
              }
              return (0, p.Z)(a, t), (0, c.Z)(a);
            })(t);
            return {
              F: a,
              d: [
                {
                  kind: "field",
                  decorators: [(0, v.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, v.Cb)({ attribute: !1 })],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, v.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, v.Cb)()],
                  key: "helper",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, v.Cb)({ type: Boolean, reflect: !0 })],
                  key: "disabled",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, v.Cb)({ type: Boolean, reflect: !0 })],
                  key: "required",
                  value: function () {
                    return !0;
                  },
                },
                {
                  kind: "field",
                  key: "_yamlMode",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "method",
                  key: "shouldUpdate",
                  value: function (e) {
                    return 1 !== e.size || !e.has("hass");
                  },
                },
                {
                  kind: "field",
                  key: "_schema",
                  value: function () {
                    return (0, f.Z)(function (e, t) {
                      return [
                        {
                          name: "type",
                          selector: {
                            select: {
                              mode: "dropdown",
                              required: !0,
                              options: Object.keys(x)
                                .concat("manual")
                                .map(function (e) {
                                  return {
                                    label:
                                      t(
                                        "ui.components.selectors.selector.types.".concat(
                                          e
                                        )
                                      ) || e,
                                    value: e,
                                  };
                                }),
                            },
                          },
                        },
                      ].concat(
                        (0, s.Z)(
                          "manual" === e
                            ? [{ name: "manual", selector: { object: {} } }]
                            : []
                        ),
                        (0, s.Z)(
                          x[e]
                            ? x[e].length > 1
                              ? [
                                  {
                                    name: "",
                                    type: "expandable",
                                    title: t(
                                      "ui.components.selectors.selector.options"
                                    ),
                                    schema: x[e],
                                  },
                                ]
                              : x[e]
                            : []
                        )
                      );
                    });
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e, t;
                    if (this._yamlMode)
                      e = { type: (t = "manual"), manual: this.value };
                    else {
                      t = Object.keys(this.value)[0];
                      var a = Object.values(this.value)[0];
                      e = Object.assign(
                        { type: t },
                        "object" === (0, r.Z)(a) ? a : []
                      );
                    }
                    var o = this._schema(t, this.hass.localize);
                    return (0, h.dy)(
                      n ||
                        (n = (0, i.Z)([
                          '<ha-card> <div class="card-content"> <p>',
                          '</p> <ha-form .hass="',
                          '" .data="',
                          '" .schema="',
                          '" .computeLabel="',
                          '" @value-changed="',
                          '"></ha-form></div></ha-card>',
                        ])),
                      this.label ? this.label : "",
                      this.hass,
                      e,
                      o,
                      this._computeLabelCallback,
                      this._valueChanged
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value: function (e) {
                    e.stopPropagation();
                    var t = e.detail.value,
                      a = t.type;
                    if (
                      a &&
                      "object" === (0, r.Z)(t) &&
                      0 !== Object.keys(t).length
                    ) {
                      var n,
                        o = Object.keys(this.value)[0];
                      if ("manual" === a && !this._yamlMode)
                        return (this._yamlMode = !0), void this.requestUpdate();
                      if ("manual" !== a || void 0 !== t.manual)
                        "manual" !== a && (this._yamlMode = !1),
                          delete t.type,
                          (n =
                            "manual" === a
                              ? t.manual
                              : a === o
                              ? (0, l.Z)(
                                  {},
                                  a,
                                  Object.assign({}, t.manual ? t.manual[o] : t)
                                )
                              : (0, l.Z)({}, a, Object.assign({}, k[a]))),
                          (0, y.B)(this, "value-changed", { value: n });
                    }
                  },
                },
                {
                  kind: "field",
                  key: "_computeLabelCallback",
                  value: function () {
                    var e = this;
                    return function (t) {
                      return (
                        e.hass.localize(
                          "ui.components.selectors.selector.".concat(t.name)
                        ) || t.name
                      );
                    };
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return (0, h.iv)(
                      o ||
                        (o = (0, i.Z)([
                          ":host{--expansion-panel-summary-padding:0 16px}ha-alert{display:block;margin-bottom:16px}ha-card{margin:0 0 16px 0}ha-card.disabled{pointer-events:none;color:var(--disabled-text-color)}.card-content{padding:0px 16px 16px 16px}.title{font-size:16px;padding-top:16px;overflow:hidden;text-overflow:ellipsis;margin-bottom:16px;padding-left:16px;padding-right:4px;white-space:nowrap}",
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
  },
]);
//# sourceMappingURL=4755.1nook-Cclgc.js.map
