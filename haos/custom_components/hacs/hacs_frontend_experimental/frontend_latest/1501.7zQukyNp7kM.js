export const id = 1501;
export const ids = [1501];
export const modules = {
  81501: (e, t, a) => {
    a.a(e, async (e, i) => {
      try {
        a.r(t), a.d(t, { HaTriggerSelector: () => n });
        var o = a(309),
          r = a(5095),
          l = a(95260),
          d = a(41848),
          s = e([d]);
        d = (s.then ? (await s)() : s)[0];
        let n = (0, o.Z)(
          [(0, l.Mo)("ha-selector-trigger")],
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
                  decorators: [(0, l.Cb)({ type: Boolean, reflect: !0 })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e;
                    return r.dy` ${
                      this.label ? r.dy`<label>${this.label}</label>` : r.Ld
                    } <ha-automation-trigger .disabled="${
                      this.disabled
                    }" .triggers="${this.value || []}" .hass="${
                      this.hass
                    }" .path="${
                      null === (e = this.selector.trigger) || void 0 === e
                        ? void 0
                        : e.path
                    }"></ha-automation-trigger> `;
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return r.iv`ha-automation-trigger{display:block;margin-bottom:16px}:host([disabled]) ha-automation-trigger{opacity:var(--light-disabled-opacity);pointer-events:none}label{display:block;margin-bottom:4px;font-weight:500}`;
                  },
                },
              ],
            };
          },
          r.oi
        );
        i();
      } catch (e) {
        i(e);
      }
    });
  },
};
//# sourceMappingURL=1501.7zQukyNp7kM.js.map
