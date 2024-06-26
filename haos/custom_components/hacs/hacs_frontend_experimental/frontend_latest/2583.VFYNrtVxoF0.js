export const id = 2583;
export const ids = [2583];
export const modules = {
  72583: (e, i, t) => {
    t.a(e, async (e, s) => {
      try {
        t.r(i);
        var d = t(309),
          n = t(34541),
          o = t(47838),
          r = t(5095),
          a = t(95260),
          u = t(97315),
          l = t(93843),
          v = t(72218),
          c = e([l]);
        l = (c.then ? (await c)() : c)[0];
        (0, d.Z)(
          [(0, a.Mo)("flow-preview-group")],
          function (e, i) {
            class t extends i {
              constructor(...i) {
                super(...i), e(this);
              }
            }
            return {
              F: t,
              d: [
                {
                  kind: "field",
                  decorators: [(0, a.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, a.Cb)()],
                  key: "flowType",
                  value: void 0,
                },
                { kind: "field", key: "handler", value: void 0 },
                {
                  kind: "field",
                  decorators: [(0, a.Cb)()],
                  key: "stepId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, a.Cb)()],
                  key: "flowId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, a.Cb)()],
                  key: "stepData",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, a.SB)()],
                  key: "_preview",
                  value: void 0,
                },
                { kind: "field", key: "_unsub", value: void 0 },
                {
                  kind: "method",
                  key: "disconnectedCallback",
                  value: function () {
                    (0, n.Z)(
                      (0, o.Z)(t.prototype),
                      "disconnectedCallback",
                      this
                    ).call(this),
                      this._unsub &&
                        (this._unsub.then((e) => e()), (this._unsub = void 0));
                  },
                },
                {
                  kind: "method",
                  key: "willUpdate",
                  value: function (e) {
                    e.has("stepData") && this._debouncedSubscribePreview();
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return r.dy`<entity-preview-row .hass="${this.hass}" .stateObj="${this._preview}"></entity-preview-row>`;
                  },
                },
                {
                  kind: "field",
                  key: "_setPreview",
                  value() {
                    return (e) => {
                      const i = new Date().toISOString();
                      this._preview = {
                        entity_id: `${this.stepId}.___flow_preview___`,
                        last_changed: i,
                        last_updated: i,
                        context: { id: "", parent_id: null, user_id: null },
                        ...e,
                      };
                    };
                  },
                },
                {
                  kind: "field",
                  key: "_debouncedSubscribePreview",
                  value() {
                    return (0, v.D)(() => {
                      this._subscribePreview();
                    }, 250);
                  },
                },
                {
                  kind: "method",
                  key: "_subscribePreview",
                  value: async function () {
                    if (
                      (this._unsub &&
                        ((await this._unsub)(), (this._unsub = void 0)),
                      "repair_flow" !== this.flowType)
                    )
                      try {
                        this._unsub = (0, u.Z)(
                          this.hass,
                          this.flowId,
                          this.flowType,
                          this.stepData,
                          this._setPreview
                        );
                      } catch (e) {
                        this._preview = void 0;
                      }
                  },
                },
              ],
            };
          },
          r.oi
        );
        s();
      } catch (e) {
        s(e);
      }
    });
  },
};
//# sourceMappingURL=2583.VFYNrtVxoF0.js.map
