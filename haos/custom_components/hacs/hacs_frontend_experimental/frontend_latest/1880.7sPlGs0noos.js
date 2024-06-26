export const id = 1880;
export const ids = [1880];
export const modules = {
  21880: (e, t, i) => {
    i.r(t), i.d(t, { HaFormGrid: () => l });
    var o = i(309),
      a = i(34541),
      d = i(47838),
      r = (i(39663), i(5095)),
      s = i(95260);
    let l = (0, o.Z)(
      [(0, s.Mo)("ha-form-grid")],
      function (e, t) {
        class i extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: i,
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "computeLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "computeHelper",
              value: void 0,
            },
            {
              kind: "method",
              key: "focus",
              value: async function () {
                var e;
                await this.updateComplete,
                  null === (e = this.renderRoot.querySelector("ha-form")) ||
                    void 0 === e ||
                    e.focus();
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, a.Z)((0, d.Z)(i.prototype), "updated", this).call(this, e),
                  e.has("schema") &&
                    (this.schema.column_min_width
                      ? this.style.setProperty(
                          "--form-grid-min-width",
                          this.schema.column_min_width
                        )
                      : this.style.setProperty("--form-grid-min-width", ""));
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return r.dy` ${this.schema.schema.map(
                  (e) =>
                    r.dy` <ha-form .hass="${this.hass}" .data="${
                      this.data
                    }" .schema="${[e]}" .disabled="${
                      this.disabled
                    }" .computeLabel="${this.computeLabel}" .computeHelper="${
                      this.computeHelper
                    }"></ha-form> `
                )} `;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return r.iv`:host{display:grid!important;grid-template-columns:repeat(var(--form-grid-column-count,auto-fit),minmax(var(--form-grid-min-width,200px),1fr));grid-column-gap:8px;grid-row-gap:24px}:host>ha-form{display:block}`;
              },
            },
          ],
        };
      },
      r.oi
    );
  },
};
//# sourceMappingURL=1880.7sPlGs0noos.js.map
