export const id = 9233;
export const ids = [9233];
export const modules = {
  49233: (e, o, t) => {
    t.r(o), t.d(o, { HaIconButtonPrev: () => r });
    var i = t(309),
      d = t(5095),
      n = t(95260),
      a = t(67684);
    t(54371);
    let r = (0, i.Z)(
      [(0, n.Mo)("ha-icon-button-prev")],
      function (e, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), e(this);
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
                  ? "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                  : "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",
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
                    : e.localize("ui.common.back")) ||
                  "Back"
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
//# sourceMappingURL=9233.oQ9SCeH1uwE.js.map
