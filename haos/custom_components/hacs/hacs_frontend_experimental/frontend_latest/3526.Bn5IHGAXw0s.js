export const id = 3526;
export const ids = [3526];
export const modules = {
  93526: (t, e, o) => {
    o.a(t, async (t, i) => {
      try {
        o.r(e), o.d(e, { HaConditionSelector: () => r });
        var a = o(309),
          d = o(5095),
          n = o(95260),
          l = o(61563),
          s = t([l]);
        l = (s.then ? (await s)() : s)[0];
        let r = (0, a.Z)(
          [(0, n.Mo)("ha-selector-condition")],
          function (t, e) {
            return {
              F: class extends e {
                constructor(...e) {
                  super(...e), t(this);
                }
              },
              d: [
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "selector",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)()],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ type: Boolean, reflect: !0 })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var t;
                    return d.dy` ${
                      this.label ? d.dy`<label>${this.label}</label>` : d.Ld
                    } <ha-automation-condition .disabled="${
                      this.disabled
                    }" .conditions="${this.value || []}" .hass="${
                      this.hass
                    }" .path="${
                      null === (t = this.selector.condition) || void 0 === t
                        ? void 0
                        : t.path
                    }"></ha-automation-condition> `;
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return d.iv`ha-automation-condition{display:block;margin-bottom:16px}:host([disabled]) ha-automation-condition{opacity:var(--light-disabled-opacity);pointer-events:none}label{display:block;margin-bottom:4px;font-weight:500}`;
                  },
                },
              ],
            };
          },
          d.oi
        );
        i();
      } catch (t) {
        i(t);
      }
    });
  },
};
//# sourceMappingURL=3526.Bn5IHGAXw0s.js.map
