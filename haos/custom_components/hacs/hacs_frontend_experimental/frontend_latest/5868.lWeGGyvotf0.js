export const id = 5868;
export const ids = [5868];
export const modules = {
  42732: (t, e, i) => {
    i.d(e, { I2: () => h, Hh: () => c });
    var a = i(21157),
      o = i(97315);
    var s = i(26654);
    var r = i(36655),
      n = i(58664);
    const l = new Set([
        "alarm_control_panel",
        "alert",
        "automation",
        "binary_sensor",
        "calendar",
        "camera",
        "climate",
        "cover",
        "device_tracker",
        "fan",
        "group",
        "humidifier",
        "input_boolean",
        "lawn_mower",
        "light",
        "lock",
        "media_player",
        "person",
        "plant",
        "remote",
        "schedule",
        "script",
        "siren",
        "sun",
        "switch",
        "timer",
        "update",
        "vacuum",
        "valve",
        "water_heater",
      ]),
      c = (t, e) => {
        if ((void 0 !== e ? e : null == t ? void 0 : t.state) === a.nZ)
          return "var(--state-unavailable-color)";
        const i = u(t, e);
        return i
          ? ((o = i),
            Array.isArray(o)
              ? o
                  .reverse()
                  .reduce((t, e) => `var(${e}${t ? `, ${t}` : ""})`, void 0)
              : `var(${o})`)
          : void 0;
        var o;
      },
      d = (t, e, i) => {
        const a = void 0 !== i ? i : e.state,
          o = (0, n.v)(e, i),
          r = [],
          l = (0, s.l)(a, "_"),
          c = o ? "active" : "inactive",
          d = e.attributes.device_class;
        return (
          d && r.push(`--state-${t}-${d}-${l}-color`),
          r.push(
            `--state-${t}-${l}-color`,
            `--state-${t}-${c}-color`,
            `--state-${c}-color`
          ),
          r
        );
      },
      u = (t, e) => {
        const i = void 0 !== e ? e : null == t ? void 0 : t.state,
          a = (0, r.M)(t.entity_id),
          s = t.attributes.device_class;
        if ("sensor" === a && "battery" === s) {
          const t = ((t) => {
            const e = Number(t);
            if (!isNaN(e))
              return e >= 70
                ? "--state-sensor-battery-high-color"
                : e >= 30
                ? "--state-sensor-battery-medium-color"
                : "--state-sensor-battery-low-color";
          })(i);
          if (t) return [t];
        }
        if ("group" === a) {
          const i = (0, o.W)(t);
          if (i && l.has(i)) return d(i, t, e);
        }
        if (l.has(a)) return d(a, t, e);
      },
      h = (t) => {
        if (t.attributes.brightness && "plant" !== (0, r.M)(t.entity_id)) {
          return `brightness(${(t.attributes.brightness + 245) / 5}%)`;
        }
        return "";
      };
  },
  26654: (t, e, i) => {
    i.d(e, { l: () => a });
    const a = (t, e = "_") => {
      const i =
          "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·",
        a = `aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz${e}`,
        o = new RegExp(i.split("").join("|"), "g");
      let s;
      return (
        "" === t
          ? (s = "")
          : ((s = t
              .toString()
              .toLowerCase()
              .replace(o, (t) => a.charAt(i.indexOf(t)))
              .replace(/(\d),(?=\d)/g, "$1")
              .replace(/[^a-z0-9]+/g, e)
              .replace(new RegExp(`(${e})\\1+`, "g"), "$1")
              .replace(new RegExp(`^${e}+`), "")
              .replace(new RegExp(`${e}+$`), "")),
            "" === s && (s = "unknown")),
        s
      );
    };
  },
  75868: (t, e, i) => {
    var a = i(309),
      o = i(34541),
      s = i(47838),
      r = i(5095),
      n = i(95260),
      l = i(10694),
      c = i(86634),
      d = i(36655),
      u = i(3850),
      h = i(42732);
    const v = r.iv`ha-state-icon[data-domain=alarm_control_panel][data-state=arming],ha-state-icon[data-domain=alarm_control_panel][data-state=pending],ha-state-icon[data-domain=alarm_control_panel][data-state=triggered],ha-state-icon[data-domain=lock][data-state=jammed]{animation:pulse 1s infinite}@keyframes pulse{0%{opacity:1}50%{opacity:0}100%{opacity:1}}ha-state-icon[data-state=unavailable]{color:var(--state-unavailable-color)}`,
      b = (t, e, i) => `${t}&width=${e}&height=${i}`;
    ["auto", "heat_cool", "heat", "cool", "dry", "fan_only", "off"].reduce(
      (t, e, i) => ((t[e] = i), t),
      {}
    );
    const p = {
      cooling: "cool",
      drying: "dry",
      fan: "fan_only",
      preheating: "heat",
      heating: "heat",
      idle: "off",
      off: "off",
    };
    var y = i(60307),
      f = i(4138),
      g = i(81454);
    var _ = i(30045);
    i(37662);
    (0, a.Z)(
      [(0, n.Mo)("ha-state-icon")],
      function (t, e) {
        return {
          F: class extends e {
            constructor(...e) {
              super(...e), t(this);
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "stateObj",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "icon",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var t, e;
                const i =
                  this.icon ||
                  (this.stateObj &&
                    (null === (t = this.hass) ||
                    void 0 === t ||
                    null === (t = t.entities[this.stateObj.entity_id]) ||
                    void 0 === t
                      ? void 0
                      : t.icon)) ||
                  (null === (e = this.stateObj) || void 0 === e
                    ? void 0
                    : e.attributes.icon);
                if (i) return r.dy`<ha-icon .icon="${i}"></ha-icon>`;
                if (!this.stateObj) return r.Ld;
                if (!this.hass) return this._renderFallback();
                const a = (0, _.gD)(this.hass, this.stateObj).then((t) =>
                  t
                    ? r.dy`<ha-icon .icon="${t}"></ha-icon>`
                    : this._renderFallback()
                );
                return r.dy`${(0, y.C)(a)}`;
              },
            },
            {
              kind: "method",
              key: "_renderFallback",
              value: function () {
                return r.dy`<ha-svg-icon .path="${
                  ((t = this.stateObj),
                  t ? (0, g.K)((0, d.M)(t.entity_id), t) : f.Rb)
                }"></ha-svg-icon>`;
                var t;
              },
            },
          ],
        };
      },
      r.oi
    );
    let k = (0, a.Z)(
      null,
      function (t, e) {
        class i extends e {
          constructor(...e) {
            super(...e), t(this);
          }
        }
        return {
          F: i,
          d: [
            { kind: "field", key: "hass", value: void 0 },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "stateObj",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "overrideIcon",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "overrideImage",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "stateColor",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "color",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean, reflect: !0 })],
              key: "icon",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_iconStyle",
              value: () => ({}),
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                var t, e;
                (0, o.Z)((0, s.Z)(i.prototype), "connectedCallback", this).call(
                  this
                ),
                  this.hasUpdated &&
                    void 0 === this.overrideImage &&
                    ((null !== (t = this.stateObj) &&
                      void 0 !== t &&
                      t.attributes.entity_picture) ||
                      (null !== (e = this.stateObj) &&
                        void 0 !== e &&
                        e.attributes.entity_picture_local)) &&
                    this.requestUpdate("stateObj");
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                var t, e;
                (0, o.Z)(
                  (0, s.Z)(i.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  void 0 === this.overrideImage &&
                    ((null !== (t = this.stateObj) &&
                      void 0 !== t &&
                      t.attributes.entity_picture) ||
                      (null !== (e = this.stateObj) &&
                        void 0 !== e &&
                        e.attributes.entity_picture_local)) &&
                    (this.style.backgroundImage = "");
              },
            },
            {
              kind: "get",
              key: "_stateColor",
              value: function () {
                const t = this.stateObj ? (0, u.N)(this.stateObj) : void 0;
                return (
                  this.stateColor || ("light" === t && !1 !== this.stateColor)
                );
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                const t = this.stateObj;
                if (!t && !this.overrideIcon && !this.overrideImage)
                  return r.dy`<div class="missing"> <ha-svg-icon .path="${"M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z"}"></ha-svg-icon> </div>`;
                if (!this.icon) return r.Ld;
                const e = t ? (0, u.N)(t) : void 0;
                return r.dy`<ha-state-icon .hass="${this.hass}" style="${(0,
                c.V)(this._iconStyle)}" data-domain="${(0, l.o)(
                  e
                )}" data-state="${(0, l.o)(
                  null == t ? void 0 : t.state
                )}" .icon="${
                  this.overrideIcon
                }" .stateObj="${t}"></ha-state-icon>`;
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (t) {
                if (
                  ((0, o.Z)((0, s.Z)(i.prototype), "willUpdate", this).call(
                    this,
                    t
                  ),
                  !(
                    t.has("stateObj") ||
                    t.has("overrideImage") ||
                    t.has("overrideIcon") ||
                    t.has("stateColor") ||
                    t.has("color")
                  ))
                )
                  return;
                const e = this.stateObj,
                  a = {};
                let r = "";
                if (((this.icon = !0), e && void 0 === this.overrideImage))
                  if (
                    (!e.attributes.entity_picture_local &&
                      !e.attributes.entity_picture) ||
                    this.overrideIcon
                  ) {
                    if (this.color) a.color = this.color;
                    else if (this._stateColor) {
                      const t = (0, h.Hh)(e);
                      if (
                        (t && (a.color = t),
                        e.attributes.rgb_color &&
                          (a.color = `rgb(${e.attributes.rgb_color.join(
                            ","
                          )})`),
                        e.attributes.brightness)
                      ) {
                        const t = e.attributes.brightness;
                        if ("number" != typeof t) {
                          const i = `Type error: state-badge expected number, but type of ${
                            e.entity_id
                          }.attributes.brightness is ${typeof t} (${t})`;
                          console.warn(i);
                        }
                        a.filter = (0, h.I2)(e);
                      }
                      if (e.attributes.hvac_action) {
                        const t = e.attributes.hvac_action;
                        t in p
                          ? (a.color = (0, h.Hh)(e, p[t]))
                          : delete a.color;
                      }
                    }
                  } else {
                    let t =
                      e.attributes.entity_picture_local ||
                      e.attributes.entity_picture;
                    this.hass && (t = this.hass.hassUrl(t));
                    const i = (0, d.M)(e.entity_id);
                    "camera" === i && (t = b(t, 80, 80)),
                      (r = `url(${t})`),
                      (this.icon = !1),
                      "update" === i
                        ? (this.style.borderRadius = "0")
                        : "media_player" === i &&
                          (this.style.borderRadius = "8%");
                  }
                else if (this.overrideImage) {
                  let t = this.overrideImage;
                  this.hass && (t = this.hass.hassUrl(t)),
                    (r = `url(${t})`),
                    (this.icon = !1);
                }
                (this._iconStyle = a), (this.style.backgroundImage = r);
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  v,
                  r.iv`:host{position:relative;display:inline-block;width:40px;color:var(--paper-item-icon-color,#44739e);border-radius:50%;height:40px;text-align:center;background-size:cover;line-height:40px;vertical-align:middle;box-sizing:border-box;--state-inactive-color:initial}:host(:focus){outline:0}:host(:not([icon]):focus){border:2px solid var(--divider-color)}:host([icon]:focus){background:var(--divider-color)}ha-state-icon{transition:color .3s ease-in-out,filter .3s ease-in-out}.missing{color:#fce588}`,
                ];
              },
            },
          ],
        };
      },
      r.oi
    );
    customElements.define("state-badge", k);
  },
  97315: (t, e, i) => {
    i.d(e, { W: () => o, Z: () => s });
    var a = i(36655);
    const o = (t) => {
        const e = t.attributes.entity_id || [],
          i = [...new Set(e.map((t) => (0, a.M)(t)))];
        return 1 === i.length ? i[0] : void 0;
      },
      s = (t, e, i, a, o) =>
        t.connection.subscribeMessage(o, {
          type: "group/start_preview",
          flow_id: e,
          flow_type: i,
          user_input: a,
        });
  },
};
//# sourceMappingURL=5868.lWeGGyvotf0.js.map
