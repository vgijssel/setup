export const id = 6924;
export const ids = [6924];
export const modules = {
  77716: (e, o, t) => {
    t.r(o), t.d(o, { HaIconButtonArrowNext: () => a });
    var i = t(309),
      d = t(5095),
      n = t(95260),
      r = t(67684);
    t(54371);
    let a = (0, i.Z)(
      [(0, n.Mo)("ha-icon-button-arrow-next")],
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
                "rtl" === r.E.document.dir
                  ? "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
                  : "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",
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
//# sourceMappingURL=6924.-X3TDMNJqjM.js.map
