export const id = 9948;
export const ids = [9948];
export const modules = {
  9948: (e, t, s) => {
    s.r(t), s.d(t, { HaFormConstant: () => i });
    var o = s(309),
      a = s(5095),
      n = s(95260);
    let i = (0, o.Z)(
      [(0, n.Mo)("ha-form-constant")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return a.dy`<span class="label">${this.label}</span>${
                  this.schema.value ? `: ${this.schema.value}` : ""
                }`;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return a.iv`:host{display:block}.label{font-weight:500}`;
              },
            },
          ],
        };
      },
      a.oi
    );
  },
};
//# sourceMappingURL=9948.saoA_MmSI3g.js.map
