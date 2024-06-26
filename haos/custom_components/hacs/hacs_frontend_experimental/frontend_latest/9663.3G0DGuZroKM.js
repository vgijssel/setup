export const id = 9663;
export const ids = [9663];
export const modules = {
  4771: (e, t, i) => {
    function n(e) {
      return void 0 === e || Array.isArray(e) ? e : [e];
    }
    i.d(t, { r: () => n });
  },
  17267: (e, t, i) => {
    i.d(t, { h: () => a });
    var n = i(5095),
      r = i(57835);
    const a = (0, r.XM)(
      class extends r.Xe {
        constructor(e) {
          if ((super(e), (this._element = void 0), e.type !== r.pX.CHILD))
            throw new Error(
              "dynamicElementDirective can only be used in content bindings"
            );
        }
        update(e, [t, i]) {
          return this._element && this._element.localName === t
            ? (i &&
                Object.entries(i).forEach(([e, t]) => {
                  this._element[e] = t;
                }),
              n.Jb)
            : this.render(t, i);
        }
        render(e, t) {
          return (
            (this._element = document.createElement(e)),
            t &&
              Object.entries(t).forEach(([e, t]) => {
                this._element[e] = t;
              }),
            this._element
          );
        }
      }
    );
  },
  36655: (e, t, i) => {
    i.d(t, { M: () => n });
    const n = (e) => e.substr(0, e.indexOf("."));
  },
  44672: (e, t, i) => {
    i.d(t, { p: () => n });
    const n = (e) => e.substr(e.indexOf(".") + 1);
  },
  3850: (e, t, i) => {
    i.d(t, { N: () => r });
    var n = i(36655);
    const r = (e) => (0, n.M)(e.entity_id);
  },
  2733: (e, t, i) => {
    i.d(t, { C: () => r });
    var n = i(44672);
    const r = (e) => {
      return (
        (t = e.entity_id),
        void 0 === (i = e.attributes).friendly_name
          ? (0, n.p)(t).replace(/_/g, " ")
          : (null !== (r = i.friendly_name) && void 0 !== r ? r : "").toString()
      );
      var t, i, r;
    };
  },
  56311: (e, t, i) => {
    i.d(t, { e: () => n });
    const n = (e, t) => r(e.attributes, t),
      r = (e, t) => 0 != (e.supported_features & t);
  },
  28858: (e, t, i) => {
    i.d(t, { $: () => l, f: () => d });
    var n = i(14516);
    const r = (0, n.Z)((e) => new Intl.Collator(e)),
      a = (0, n.Z)((e) => new Intl.Collator(e, { sensitivity: "accent" })),
      o = (e, t) => (e < t ? -1 : e > t ? 1 : 0),
      l = (e, t, i = void 0) => {
        var n;
        return null !== (n = Intl) && void 0 !== n && n.Collator
          ? r(i).compare(e, t)
          : o(e, t);
      },
      d = (e, t, i = void 0) => {
        var n;
        return null !== (n = Intl) && void 0 !== n && n.Collator
          ? a(i).compare(e, t)
          : o(e.toLowerCase(), t.toLowerCase());
      };
  },
  72218: (e, t, i) => {
    i.d(t, { D: () => n });
    const n = (e, t, i = !1) => {
      let n;
      const r = (...r) => {
        const a = i && !n;
        clearTimeout(n),
          (n = window.setTimeout(() => {
            (n = void 0), i || e(...r);
          }, t)),
          a && e(...r);
      };
      return (
        (r.cancel = () => {
          clearTimeout(n);
        }),
        r
      );
    };
  },
  39663: (e, t, i) => {
    var n = i(309),
      r = i(34541),
      a = i(47838),
      o = i(5095),
      l = i(95260),
      d = i(17267),
      s = i(18394);
    i(23860), i(86336);
    const c = {
        boolean: () =>
          Promise.all([i.e(1985), i.e(5107)]).then(i.bind(i, 45107)),
        constant: () => i.e(9948).then(i.bind(i, 9948)),
        float: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(8224)]).then(i.bind(i, 78224)),
        grid: () => i.e(1880).then(i.bind(i, 21880)),
        expandable: () => i.e(8874).then(i.bind(i, 48874)),
        integer: () =>
          Promise.all([i.e(6023), i.e(2488), i.e(6985), i.e(9030)]).then(
            i.bind(i, 79030)
          ),
        multi_select: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(1985), i.e(8663)]).then(
            i.bind(i, 58663)
          ),
        positive_time_period_dict: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(6255)]).then(i.bind(i, 76255)),
        select: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(6023),
            i.e(1985),
            i.e(2488),
            i.e(9433),
            i.e(6591),
            i.e(5778),
          ]).then(i.bind(i, 75778)),
        string: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(947)]).then(i.bind(i, 20947)),
      },
      u = (e, t) => (e ? (t.name ? e[t.name] : e) : null);
    (0, n.Z)(
      [(0, l.Mo)("ha-form")],
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
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ attribute: !1 })],
              key: "schema",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "error",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "warning",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "computeError",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "computeWarning",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "computeLabel",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "computeHelper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "localizeValue",
              value: void 0,
            },
            {
              kind: "method",
              key: "getFormProperties",
              value: function () {
                return {};
              },
            },
            {
              kind: "method",
              key: "focus",
              value: async function () {
                await this.updateComplete;
                const e = this.renderRoot.querySelector(".root");
                if (e)
                  for (const t of e.children)
                    if ("HA-ALERT" !== t.tagName) {
                      t instanceof o.fl && (await t.updateComplete), t.focus();
                      break;
                    }
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                e.has("schema") &&
                  this.schema &&
                  this.schema.forEach((e) => {
                    var t;
                    "selector" in e ||
                      null === (t = c[e.type]) ||
                      void 0 === t ||
                      t.call(c);
                  });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <div class="root" part="root"> ${
                  this.error && this.error.base
                    ? o.dy` <ha-alert alert-type="error"> ${this._computeError(
                        this.error.base,
                        this.schema
                      )} </ha-alert> `
                    : ""
                } ${this.schema.map((e) => {
                  var t;
                  const i = ((e, t) => (e && t.name ? e[t.name] : null))(
                      this.error,
                      e
                    ),
                    n = ((e, t) => (e && t.name ? e[t.name] : null))(
                      this.warning,
                      e
                    );
                  return o.dy` ${
                    i
                      ? o.dy` <ha-alert own-margin alert-type="error"> ${this._computeError(
                          i,
                          e
                        )} </ha-alert> `
                      : n
                      ? o.dy` <ha-alert own-margin alert-type="warning"> ${this._computeWarning(
                          n,
                          e
                        )} </ha-alert> `
                      : ""
                  } ${
                    "selector" in e
                      ? o.dy`<ha-selector .schema="${e}" .hass="${
                          this.hass
                        }" .name="${e.name}" .selector="${
                          e.selector
                        }" .value="${u(
                          this.data,
                          e
                        )}" .label="${this._computeLabel(
                          e,
                          this.data
                        )}" .disabled="${
                          e.disabled || this.disabled || !1
                        }" .placeholder="${
                          e.required ? "" : e.default
                        }" .helper="${this._computeHelper(
                          e
                        )}" .localizeValue="${this.localizeValue}" .required="${
                          e.required || !1
                        }" .context="${this._generateContext(
                          e
                        )}"></ha-selector>`
                      : (0, d.h)(this.fieldElementName(e.type), {
                          schema: e,
                          data: u(this.data, e),
                          label: this._computeLabel(e, this.data),
                          helper: this._computeHelper(e),
                          disabled: this.disabled || e.disabled || !1,
                          hass: this.hass,
                          localize:
                            null === (t = this.hass) || void 0 === t
                              ? void 0
                              : t.localize,
                          computeLabel: this.computeLabel,
                          computeHelper: this.computeHelper,
                          context: this._generateContext(e),
                          ...this.getFormProperties(),
                        })
                  } `;
                })} </div> `;
              },
            },
            {
              kind: "method",
              key: "fieldElementName",
              value: function (e) {
                return `ha-form-${e}`;
              },
            },
            {
              kind: "method",
              key: "_generateContext",
              value: function (e) {
                if (!e.context) return;
                const t = {};
                for (const [i, n] of Object.entries(e.context))
                  t[i] = this.data[n];
                return t;
              },
            },
            {
              kind: "method",
              key: "createRenderRoot",
              value: function () {
                const e = (0, r.Z)(
                  (0, a.Z)(i.prototype),
                  "createRenderRoot",
                  this
                ).call(this);
                return this.addValueChangedListener(e), e;
              },
            },
            {
              kind: "method",
              key: "addValueChangedListener",
              value: function (e) {
                e.addEventListener("value-changed", (e) => {
                  e.stopPropagation();
                  const t = e.target.schema;
                  if (e.target === this) return;
                  const i = t.name
                    ? { [t.name]: e.detail.value }
                    : e.detail.value;
                  (this.data = { ...this.data, ...i }),
                    (0, s.B)(this, "value-changed", { value: this.data });
                });
              },
            },
            {
              kind: "method",
              key: "_computeLabel",
              value: function (e, t) {
                return this.computeLabel
                  ? this.computeLabel(e, t)
                  : e
                  ? e.name
                  : "";
              },
            },
            {
              kind: "method",
              key: "_computeHelper",
              value: function (e) {
                return this.computeHelper ? this.computeHelper(e) : "";
              },
            },
            {
              kind: "method",
              key: "_computeError",
              value: function (e, t) {
                return this.computeError ? this.computeError(e, t) : e;
              },
            },
            {
              kind: "method",
              key: "_computeWarning",
              value: function (e, t) {
                return this.computeWarning ? this.computeWarning(e, t) : e;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`.root>*{display:block}.root>:not([own-margin]):not(:last-child){margin-bottom:24px}ha-alert[own-margin]{margin-bottom:4px}`;
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  86336: (e, t, i) => {
    var n = i(309),
      r = i(5095),
      a = i(95260),
      o = i(14516),
      l = i(17267),
      d = i(29934);
    const s = {
        action: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(1866),
            i.e(1985),
            i.e(7426),
            i.e(6561),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(3908),
            i.e(8846),
            i.e(512),
            i.e(1848),
            i.e(2552),
            i.e(4871),
            i.e(9624),
            i.e(4993),
          ]).then(i.bind(i, 4993)),
        addon: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(657),
          ]).then(i.bind(i, 20657)),
        area: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(1913),
            i.e(5734),
          ]).then(i.bind(i, 15734)),
        area_filter: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(1117)]).then(i.bind(i, 1117)),
        attribute: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(1866),
            i.e(6591),
            i.e(3687),
            i.e(3908),
            i.e(9463),
          ]).then(i.bind(i, 72552)),
        assist_pipeline: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(5059)]).then(i.bind(i, 75059)),
        boolean: () => i.e(339).then(i.bind(i, 10339)),
        color_rgb: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(4529)]).then(i.bind(i, 14529)),
        condition: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(1866),
            i.e(7426),
            i.e(6561),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(3908),
            i.e(8846),
            i.e(512),
            i.e(2552),
            i.e(3526),
          ]).then(i.bind(i, 93526)),
        config_entry: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(3395),
          ]).then(i.bind(i, 93395)),
        conversation_agent: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(5803)]).then(i.bind(i, 65803)),
        constant: () => i.e(9516).then(i.bind(i, 39516)),
        country: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(1866), i.e(2166)]).then(
            i.bind(i, 2166)
          ),
        date: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(1866),
            i.e(9683),
            i.e(4340),
          ]).then(i.bind(i, 24340)),
        datetime: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(1866),
            i.e(9683),
            i.e(8902),
          ]).then(i.bind(i, 58902)),
        device: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(1913),
            i.e(2722),
          ]).then(i.bind(i, 72722)),
        duration: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(6086)]).then(i.bind(i, 86086)),
        entity: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(7648),
          ]).then(i.bind(i, 6371)),
        statistic: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(9521),
          ]).then(i.bind(i, 28112)),
        file: () => i.e(6251).then(i.bind(i, 36251)),
        language: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(1866), i.e(1457)]).then(
            i.bind(i, 71457)
          ),
        navigation: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(8689),
          ]).then(i.bind(i, 78689)),
        number: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(6023),
            i.e(2488),
            i.e(6985),
            i.e(8075),
          ]).then(i.bind(i, 68075)),
        object: () => Promise.all([i.e(7426), i.e(527)]).then(i.bind(i, 50527)),
        select: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(6023),
            i.e(1985),
            i.e(2488),
            i.e(9433),
            i.e(6591),
            i.e(2802),
          ]).then(i.bind(i, 62802)),
        selector: () => i.e(4755).then(i.bind(i, 34755)),
        state: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(6591),
            i.e(6196),
          ]).then(i.bind(i, 56196)),
        backup_location: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(1244)]).then(i.bind(i, 21244)),
        stt: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(6315)]).then(i.bind(i, 86315)),
        target: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(303),
            i.e(3537),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(9880),
          ]).then(i.bind(i, 51948)),
        template: () => i.e(9766).then(i.bind(i, 9766)),
        text: () =>
          Promise.all([i.e(1706), i.e(2850), i.e(1049)]).then(i.bind(i, 1049)),
        time: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(1977)]).then(i.bind(i, 91977)),
        icon: () =>
          Promise.all([i.e(3687), i.e(9503), i.e(9255)]).then(i.bind(i, 89255)),
        media: () => Promise.all([i.e(9624), i.e(8664)]).then(i.bind(i, 39624)),
        theme: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(9877)]).then(i.bind(i, 49877)),
        trigger: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(1866),
            i.e(1985),
            i.e(7426),
            i.e(6561),
            i.e(6591),
            i.e(3687),
            i.e(9503),
            i.e(1913),
            i.e(5868),
            i.e(3908),
            i.e(8846),
            i.e(512),
            i.e(1848),
            i.e(1501),
          ]).then(i.bind(i, 81501)),
        tts: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(3983)]).then(i.bind(i, 23983)),
        tts_voice: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(1666)]).then(i.bind(i, 71666)),
        location: () => i.e(6782).then(i.bind(i, 46782)),
        color_temp: () =>
          Promise.all([
            i.e(6023),
            i.e(2488),
            i.e(6985),
            i.e(6549),
            i.e(5891),
          ]).then(i.bind(i, 65891)),
        ui_action: () =>
          Promise.all([
            i.e(1706),
            i.e(2850),
            i.e(5943),
            i.e(303),
            i.e(1985),
            i.e(7426),
            i.e(6591),
            i.e(8846),
            i.e(4871),
            i.e(8353),
          ]).then(i.bind(i, 41932)),
        ui_color: () =>
          Promise.all([i.e(1706), i.e(5943), i.e(9507)]).then(i.bind(i, 79507)),
      },
      c = new Set(["ui-action", "ui-color"]);
    (0, n.Z)(
      [(0, a.Mo)("ha-selector")],
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
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "name",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "localizeValue",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "placeholder",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)({ type: Boolean })],
              key: "required",
              value: () => !0,
            },
            {
              kind: "field",
              decorators: [(0, a.Cb)()],
              key: "context",
              value: void 0,
            },
            {
              kind: "method",
              key: "focus",
              value: async function () {
                var e;
                await this.updateComplete,
                  null === (e = this.renderRoot.querySelector("#selector")) ||
                    void 0 === e ||
                    e.focus();
              },
            },
            {
              kind: "get",
              key: "_type",
              value: function () {
                const e = Object.keys(this.selector)[0];
                return c.has(e) ? e.replace("-", "_") : e;
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                var t;
                e.has("selector") &&
                  this.selector &&
                  (null === (t = s[this._type]) || void 0 === t || t.call(s));
              },
            },
            {
              kind: "field",
              key: "_handleLegacySelector",
              value() {
                return (0, o.Z)((e) => {
                  if ("entity" in e) return (0, d.CM)(e);
                  if ("device" in e) return (0, d.c9)(e);
                  const t = Object.keys(this.selector)[0];
                  return c.has(t) ? { [t.replace("-", "_")]: e[t] } : e;
                });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return r.dy` ${(0, l.h)(`ha-selector-${this._type}`, {
                  hass: this.hass,
                  name: this.name,
                  selector: this._handleLegacySelector(this.selector),
                  value: this.value,
                  label: this.label,
                  placeholder: this.placeholder,
                  disabled: this.disabled,
                  required: this.required,
                  helper: this.helper,
                  context: this.context,
                  localizeValue: this.localizeValue,
                  id: "selector",
                })} `;
              },
            },
          ],
        };
      },
      r.oi
    );
  },
  16061: (e, t, i) => {
    i.d(t, { jL: () => s, R6: () => u, HP: () => h, q4: () => d, t1: () => c });
    var n = i(2733),
      r = (i(28858), i(72881)),
      a = i(72218);
    const o = (e) =>
        e.sendMessagePromise({ type: "config/device_registry/list" }),
      l = (e, t) =>
        e.subscribeEvents(
          (0, a.D)(() => o(e).then((e) => t.setState(e, !0)), 500, !0),
          "device_registry_updated"
        ),
      d = (e, t) => (0, r.B)("_dr", o, l, e, t),
      s = (e, t, i) =>
        e.name_by_user ||
        e.name ||
        (i &&
          ((e, t) => {
            for (const i of t || []) {
              const t = "string" == typeof i ? i : i.entity_id,
                r = e.states[t];
              if (r) return (0, n.C)(r);
            }
          })(t, i)) ||
        t.localize("ui.panel.config.devices.unnamed_device", {
          type: t.localize(
            `ui.panel.config.devices.type.${e.entry_type || "device"}`
          ),
        }),
      c = (e, t, i) =>
        e.callWS({ type: "config/device_registry/update", device_id: t, ...i }),
      u = (e) => {
        const t = {};
        for (const i of e)
          i.device_id &&
            (i.device_id in t || (t[i.device_id] = []), t[i.device_id].push(i));
        return t;
      },
      h = (e, t) => {
        const i = {};
        for (const n of t) {
          const t = e[n.entity_id];
          null != t &&
            t.domain &&
            null !== n.device_id &&
            (i[n.device_id] || (i[n.device_id] = []),
            i[n.device_id].push(t.domain));
        }
        return i;
      };
  },
  29934: (e, t, i) => {
    i.d(t, {
      CM: () => v,
      QQ: () => u,
      aV: () => d,
      c9: () => b,
      lE: () => h,
      lV: () => m,
      qJ: () => c,
      vI: () => s,
      xO: () => l,
    });
    var n = i(4771),
      r = i(3850),
      a = i(56311),
      o = i(16061);
    const l = (e, t, i, n, r, a) => {
        const o = [],
          l = [];
        return (
          Object.values(i).forEach((i) => {
            i.area_id === t && c(e, Object.values(n), i, r, a) && l.push(i.id);
          }),
          Object.values(n).forEach((i) => {
            i.area_id === t &&
              u(e.states[i.entity_id], r, a) &&
              o.push(i.entity_id);
          }),
          { devices: l, entities: o }
        );
      },
      d = (e, t, i, n, r) => {
        const a = [];
        return (
          Object.values(i).forEach((i) => {
            i.device_id === t &&
              u(e.states[i.entity_id], n, r) &&
              a.push(i.entity_id);
          }),
          { entities: a }
        );
      },
      s = (e, t, i, n, r, a) =>
        !!Object.values(i).some(
          (i) => !(i.area_id !== n || !c(e, Object.values(t), i, r, a))
        ) ||
        Object.values(t).some(
          (t) => !(t.area_id !== n || !u(e.states[t.entity_id], r, a))
        ),
      c = (e, t, i, r, a) => {
        var l, d;
        const s = a ? (0, o.HP)(a, t) : void 0;
        if (
          null !== (l = r.target) &&
          void 0 !== l &&
          l.device &&
          !(0, n.r)(r.target.device).some((e) => h(e, i, s))
        )
          return !1;
        if (null !== (d = r.target) && void 0 !== d && d.entity) {
          return t
            .filter((e) => e.device_id === i.id)
            .some((t) => {
              const i = e.states[t.entity_id];
              return u(i, r, a);
            });
        }
        return !0;
      },
      u = (e, t, i) => {
        var r;
        return (
          null === (r = t.target) ||
          void 0 === r ||
          !r.entity ||
          (0, n.r)(t.target.entity).some((t) => m(t, e, i))
        );
      },
      h = (e, t, i) => {
        const { manufacturer: n, model: r, integration: a } = e;
        if (n && t.manufacturer !== n) return !1;
        if (r && t.model !== r) return !1;
        var o;
        if (
          a &&
          i &&
          (null == i ||
            null === (o = i[t.id]) ||
            void 0 === o ||
            !o.includes(a))
        )
          return !1;
        return !0;
      },
      m = (e, t, i) => {
        var o;
        const {
          domain: l,
          device_class: d,
          supported_features: s,
          integration: c,
        } = e;
        if (l) {
          const e = (0, r.N)(t);
          if (Array.isArray(l) ? !l.includes(e) : e !== l) return !1;
        }
        if (d) {
          const e = t.attributes.device_class;
          if (e && Array.isArray(d) ? !d.includes(e) : e !== d) return !1;
        }
        return (
          !(s && !(0, n.r)(s).some((e) => (0, a.e)(t, e))) &&
          (!c ||
            (null == i || null === (o = i[t.entity_id]) || void 0 === o
              ? void 0
              : o.domain) === c)
        );
      },
      v = (e) => {
        if (!e.entity) return { entity: null };
        if ("filter" in e.entity) return e;
        const { domain: t, integration: i, device_class: n, ...r } = e.entity;
        return t || i || n
          ? {
              entity: {
                ...r,
                filter: { domain: t, integration: i, device_class: n },
              },
            }
          : { entity: r };
      },
      b = (e) => {
        if (!e.device) return { device: null };
        if ("filter" in e.device) return e;
        const { integration: t, manufacturer: i, model: n, ...r } = e.device;
        return t || i || n
          ? {
              device: {
                ...r,
                filter: { integration: t, manufacturer: i, model: n },
              },
            }
          : { device: r };
      };
  },
};
//# sourceMappingURL=9663.3G0DGuZroKM.js.map
