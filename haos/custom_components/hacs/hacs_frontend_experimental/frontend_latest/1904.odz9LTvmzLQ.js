export const id = 1904;
export const ids = [1904];
export const modules = {
  837: (e, t, i) => {
    i.d(t, { Z: () => s });
    const s = (e, t, i, s, r) =>
      e.connection.subscribeMessage(r, {
        type: "template/start_preview",
        flow_id: t,
        flow_type: i,
        user_input: s,
      });
  },
  21904: (e, t, i) => {
    i.a(e, async (e, s) => {
      try {
        i.r(t);
        var r = i(309),
          l = i(34541),
          a = i(47838),
          o = i(5095),
          d = i(95260),
          n = i(72218),
          h = i(837),
          u = i(93843),
          _ = i(18394),
          p = e([u]);
        u = (p.then ? (await p)() : p)[0];
        (0, r.Z)(
          [(0, d.Mo)("flow-preview-template")],
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
                  decorators: [(0, d.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "flowType",
                  value: void 0,
                },
                { kind: "field", key: "handler", value: void 0 },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "stepId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "flowId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "stepData",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.SB)()],
                  key: "_preview",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.SB)()],
                  key: "_listeners",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.SB)()],
                  key: "_error",
                  value: void 0,
                },
                { kind: "field", key: "_unsub", value: void 0 },
                {
                  kind: "method",
                  key: "disconnectedCallback",
                  value: function () {
                    (0, l.Z)(
                      (0, a.Z)(i.prototype),
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
                    var e;
                    return this._error
                      ? o.dy`<ha-alert alert-type="error">${this._error}</ha-alert>`
                      : o.dy`<entity-preview-row .hass="${
                          this.hass
                        }" .stateObj="${this._preview}"></entity-preview-row> ${
                          null !== (e = this._listeners) &&
                          void 0 !== e &&
                          e.time
                            ? o.dy` <p> ${this.hass.localize(
                                "ui.dialogs.helper_settings.template.time"
                              )} </p> `
                            : o.Ld
                        } ${
                          this._listeners
                            ? this._listeners.all
                              ? o.dy` <p class="all_listeners"> ${this.hass.localize(
                                  "ui.dialogs.helper_settings.template.all_listeners"
                                )} </p> `
                              : this._listeners.domains.length ||
                                this._listeners.entities.length
                              ? o.dy` <p> ${this.hass.localize(
                                  "ui.dialogs.helper_settings.template.listeners"
                                )} </p> <ul> ${this._listeners.domains
                                  .sort()
                                  .map(
                                    (e) =>
                                      o.dy` <li> <b>${this.hass.localize(
                                        "ui.dialogs.helper_settings.template.domain"
                                      )}</b>: ${e} </li> `
                                  )} ${this._listeners.entities
                                  .sort()
                                  .map(
                                    (e) =>
                                      o.dy` <li> <b>${this.hass.localize(
                                        "ui.dialogs.helper_settings.template.entity"
                                      )}</b>: ${e} </li> `
                                  )} </ul> `
                              : this._listeners.time
                              ? o.Ld
                              : o.dy`<p class="all_listeners"> ${this.hass.localize(
                                  "ui.dialogs.helper_settings.template.no_listeners"
                                )} </p>`
                            : o.Ld
                        } `;
                  },
                },
                {
                  kind: "field",
                  key: "_setPreview",
                  value() {
                    return (e) => {
                      if ("error" in e)
                        return (
                          (this._error = e.error), void (this._preview = void 0)
                        );
                      (this._error = void 0), (this._listeners = e.listeners);
                      const t = new Date().toISOString();
                      this._preview = {
                        entity_id: `${this.stepId}.___flow_preview___`,
                        last_changed: t,
                        last_updated: t,
                        context: { id: "", parent_id: null, user_id: null },
                        attributes: e.attributes,
                        state: e.state,
                      };
                    };
                  },
                },
                {
                  kind: "field",
                  key: "_debouncedSubscribePreview",
                  value() {
                    return (0, n.D)(() => {
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
                        (this._unsub = (0, h.Z)(
                          this.hass,
                          this.flowId,
                          this.flowType,
                          this.stepData,
                          this._setPreview
                        )),
                          await this._unsub,
                          (0, _.B)(this, "set-flow-errors", { errors: {} });
                      } catch (e) {
                        "string" == typeof e.message
                          ? (this._error = e.message)
                          : ((this._error = void 0),
                            (0, _.B)(this, "set-flow-errors", e.message)),
                          (this._unsub = void 0),
                          (this._preview = void 0);
                      }
                  },
                },
              ],
            };
          },
          o.oi
        );
        s();
      } catch (e) {
        s(e);
      }
    });
  },
};
//# sourceMappingURL=1904.odz9LTvmzLQ.js.map
