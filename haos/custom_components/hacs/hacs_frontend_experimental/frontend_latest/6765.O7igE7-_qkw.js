export const id = 6765;
export const ids = [6765];
export const modules = {
  6765: (e, t, o) => {
    o.r(t), o.d(t, { HaIconButtonNext: () => l });
    var i = o(309),
      d = o(5095),
      n = o(95260),
      a = o(67684);
    o(54371);
    let l = (0, i.Z)(
      [(0, n.Mo)("ha-icon-button-next")],
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
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_icon",
              value: () =>
                "rtl" === a.E.document.dir
                  ? "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  : "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return d.dy` <ha-icon-button .disabled="${
                  this.disabled
                }" .label="${
                  this.label ||
                  (null === (e = this.hass) || void 0 === e
                    ? void 0
                    : e.localize("ui.common.next")) ||
                  "Next"
                }" .path="${this._icon}"></ha-icon-button> `;
              },
            },
          ],
        };
      },
      d.oi
    );
  },
};
//# sourceMappingURL=6765.O7igE7-_qkw.js.map
