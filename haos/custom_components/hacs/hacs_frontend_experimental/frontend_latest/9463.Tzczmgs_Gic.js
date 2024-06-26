export const id = 9463;
export const ids = [9463];
export const modules = {
  65095: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          d = i(95260),
          s = i(73908),
          l = (i(16591), e([s]));
        s = (l.then ? (await l)() : l)[0];
        (0, a.Z)(
          [(0, d.Mo)("ha-entity-attribute-picker")],
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
                  decorators: [(0, d.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "entityId",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, d.Cb)({ type: Array, attribute: "hide-attributes" }),
                  ],
                  key: "hideAttributes",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)({ type: Boolean })],
                  key: "autofocus",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)({ type: Boolean })],
                  key: "required",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, d.Cb)({
                      type: Boolean,
                      attribute: "allow-custom-value",
                    }),
                  ],
                  key: "allowCustomValue",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.Cb)()],
                  key: "helper",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, d.SB)()],
                  key: "_opened",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, d.IO)("ha-combo-box", !0)],
                  key: "_comboBox",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "shouldUpdate",
                  value: function (e) {
                    return !(!e.has("_opened") && this._opened);
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    if (e.has("_opened") && this._opened) {
                      const e = this.entityId
                        ? this.hass.states[this.entityId]
                        : void 0;
                      this._comboBox.items = e
                        ? Object.keys(e.attributes)
                            .filter((e) => {
                              var t;
                              return !(
                                null !== (t = this.hideAttributes) &&
                                void 0 !== t &&
                                t.includes(e)
                              );
                            })
                            .map((t) => ({
                              value: t,
                              label: (0, s.S)(
                                this.hass.localize,
                                e,
                                this.hass.entities,
                                t
                              ),
                            }))
                        : [];
                    }
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e;
                    return this.hass
                      ? o.dy` <ha-combo-box .hass="${this.hass}" .value="${
                          this.value
                            ? (0, s.S)(
                                this.hass.localize,
                                this.hass.states[this.entityId],
                                this.hass.entities,
                                this.value
                              )
                            : ""
                        }" .autofocus="${this.autofocus}" .label="${
                          null !== (e = this.label) && void 0 !== e
                            ? e
                            : this.hass.localize(
                                "ui.components.entity.entity-attribute-picker.attribute"
                              )
                        }" .disabled="${
                          this.disabled || !this.entityId
                        }" .required="${this.required}" .helper="${
                          this.helper
                        }" .allowCustomValue="${
                          this.allowCustomValue
                        }" item-value-path="value" item-label-path="label" @opened-changed="${
                          this._openedChanged
                        }" @value-changed="${
                          this._valueChanged
                        }"> </ha-combo-box> `
                      : o.Ld;
                  },
                },
                {
                  kind: "method",
                  key: "_openedChanged",
                  value: function (e) {
                    this._opened = e.detail.value;
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value: function (e) {
                    this.value = e.detail.value;
                  },
                },
              ],
            };
          },
          o.oi
        );
        t();
      } catch (e) {
        t(e);
      }
    });
  },
  72552: (e, t, i) => {
    i.a(e, async (e, a) => {
      try {
        i.r(t), i.d(t, { HaSelectorAttribute: () => c });
        var o = i(309),
          d = i(34541),
          s = i(47838),
          l = i(5095),
          r = i(95260),
          n = i(18394),
          u = i(65095),
          h = e([u]);
        u = (h.then ? (await h)() : h)[0];
        let c = (0, o.Z)(
          [(0, r.Mo)("ha-selector-attribute")],
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
                  decorators: [(0, r.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)({ attribute: !1 })],
                  key: "selector",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)()],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)()],
                  key: "helper",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)({ type: Boolean })],
                  key: "required",
                  value: () => !0,
                },
                {
                  kind: "field",
                  decorators: [(0, r.Cb)({ attribute: !1 })],
                  key: "context",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e, t, i;
                    return l.dy` <ha-entity-attribute-picker .hass="${
                      this.hass
                    }" .entityId="${
                      (null === (e = this.selector.attribute) || void 0 === e
                        ? void 0
                        : e.entity_id) ||
                      (null === (t = this.context) || void 0 === t
                        ? void 0
                        : t.filter_entity)
                    }" .hideAttributes="${
                      null === (i = this.selector.attribute) || void 0 === i
                        ? void 0
                        : i.hide_attributes
                    }" .value="${this.value}" .label="${this.label}" .helper="${
                      this.helper
                    }" .disabled="${this.disabled}" .required="${
                      this.required
                    }" allow-custom-value></ha-entity-attribute-picker> `;
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    var t;
                    if (
                      ((0, d.Z)((0, s.Z)(i.prototype), "updated", this).call(
                        this,
                        e
                      ),
                      !this.value ||
                        (null !== (t = this.selector.attribute) &&
                          void 0 !== t &&
                          t.entity_id) ||
                        !e.has("context"))
                    )
                      return;
                    const a = e.get("context");
                    if (
                      !this.context ||
                      !a ||
                      a.filter_entity === this.context.filter_entity
                    )
                      return;
                    let o = !1;
                    if (this.context.filter_entity) {
                      const e = this.hass.states[this.context.filter_entity];
                      (e && this.value in e.attributes) || (o = !0);
                    } else o = void 0 !== this.value;
                    o && (0, n.B)(this, "value-changed", { value: void 0 });
                  },
                },
              ],
            };
          },
          l.oi
        );
        a();
      } catch (e) {
        a(e);
      }
    });
  },
};
//# sourceMappingURL=9463.Tzczmgs_Gic.js.map
