export const id = 4340;
export const ids = [4340];
export const modules = {
  24340: (e, t, d) => {
    d.a(e, async (e, a) => {
      try {
        d.r(t), d.d(t, { HaDateSelector: () => n });
        var i = d(309),
          r = d(5095),
          l = d(95260),
          o = d(99683),
          s = e([o]);
        o = (s.then ? (await s)() : s)[0];
        let n = (0, i.Z)(
          [(0, l.Mo)("ha-selector-date")],
          function (e, t) {
            return {
              F: class extends t {
                constructor(...t) {
                  super(...t), e(this);
                }
              },
              d: [
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ attribute: !1 })],
                  key: "selector",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)()],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)()],
                  key: "helper",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ type: Boolean, reflect: !0 })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ type: Boolean })],
                  key: "required",
                  value: () => !0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return r.dy` <ha-date-input .label="${
                      this.label
                    }" .locale="${this.hass.locale}" .disabled="${
                      this.disabled
                    }" .value="${
                      "string" == typeof this.value ? this.value : void 0
                    }" .required="${this.required}" .helper="${
                      this.helper
                    }"> </ha-date-input> `;
                  },
                },
              ],
            };
          },
          r.oi
        );
        a();
      } catch (e) {
        a(e);
      }
    });
  },
};
//# sourceMappingURL=4340.V8BUakn-MR4.js.map
