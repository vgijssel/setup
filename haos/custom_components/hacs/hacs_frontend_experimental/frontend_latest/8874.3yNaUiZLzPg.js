export const id = 8874;
export const ids = [8874];
export const modules = {
  48874: (e, a, o) => {
    o.r(a), o.d(a, { HaFormExpendable: () => s });
    var i = o(309),
      t = o(5095),
      d = o(95260);
    o(39663);
    let s = (0, i.Z)(
      [(0, d.Mo)("ha-form-expandable")],
      function (e, a) {
        return {
          F: class extends a {
            constructor(...a) {
              super(...a), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "computeLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "computeHelper",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, a;
                return t.dy` <ha-expansion-panel outlined .expanded="${Boolean(
                  this.schema.expanded
                )}"> <div slot="header" role="heading" aria-level="${
                  null !==
                    (e =
                      null === (a = this.schema.headingLevel) || void 0 === a
                        ? void 0
                        : a.toString()) && void 0 !== e
                    ? e
                    : "3"
                }"> ${
                  this.schema.icon
                    ? t.dy` <ha-icon .icon="${this.schema.icon}"></ha-icon> `
                    : this.schema.iconPath
                    ? t.dy` <ha-svg-icon .path="${this.schema.iconPath}"></ha-svg-icon> `
                    : t.Ld
                } ${
                  this.schema.title
                } </div> <div class="content"> <ha-form .hass="${
                  this.hass
                }" .data="${this.data}" .schema="${
                  this.schema.schema
                }" .disabled="${this.disabled}" .computeLabel="${
                  this.computeLabel
                }" .computeHelper="${
                  this.computeHelper
                }"></ha-form> </div> </ha-expansion-panel> `;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return t.iv`:host{display:flex!important;flex-direction:column}:host ha-form{display:block}.content{padding:12px}ha-expansion-panel{display:block;--expansion-panel-content-padding:0;border-radius:6px;--ha-card-border-radius:6px}ha-icon,ha-svg-icon{color:var(--secondary-text-color)}`;
              },
            },
          ],
        };
      },
      t.oi
    );
  },
};
//# sourceMappingURL=8874.3yNaUiZLzPg.js.map
