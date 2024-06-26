export const id = 4993;
export const ids = [4993];
export const modules = {
  64106: (e, t, i) => {
    var a = i(309),
      o = (i(44577), i(5095)),
      n = i(95260),
      s = i(10694),
      d = i(18394),
      l = i(86089);
    i(71133), i(7265);
    (0, a.Z)(
      [(0, n.Mo)("ha-base-time-input")],
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
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "autoValidate",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "format",
              value: () => 12,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "days",
              value: () => 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "hours",
              value: () => 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "minutes",
              value: () => 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "seconds",
              value: () => 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Number })],
              key: "milliseconds",
              value: () => 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "dayLabel",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "hourLabel",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "minLabel",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "secLabel",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "millisecLabel",
              value: () => "",
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "enableSecond",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "enableMillisecond",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "enableDay",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "noHoursLimit",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "amPm",
              value: () => "AM",
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` ${
                  this.label
                    ? o.dy`<label>${this.label}${
                        this.required ? " *" : ""
                      }</label>`
                    : ""
                } <div class="time-input-wrap"> ${
                  this.enableDay
                    ? o.dy` <ha-textfield id="day" type="number" inputmode="numeric" .value="${this.days.toFixed()}" .label="${
                        this.dayLabel
                      }" name="days" @change="${
                        this._valueChanged
                      }" @focusin="${this._onFocus}" no-spinner .required="${
                        this.required
                      }" .autoValidate="${
                        this.autoValidate
                      }" min="0" .disabled="${
                        this.disabled
                      }" suffix=":" class="hasSuffix"> </ha-textfield> `
                    : ""
                } <ha-textfield id="hour" type="number" inputmode="numeric" .value="${this.hours.toFixed()}" .label="${
                  this.hourLabel
                }" name="hours" @change="${this._valueChanged}" @focusin="${
                  this._onFocus
                }" no-spinner .required="${this.required}" .autoValidate="${
                  this.autoValidate
                }" maxlength="2" max="${(0, s.o)(
                  this._hourMax
                )}" min="0" .disabled="${
                  this.disabled
                }" suffix=":" class="hasSuffix"> </ha-textfield> <ha-textfield id="min" type="number" inputmode="numeric" .value="${this._formatValue(
                  this.minutes
                )}" .label="${this.minLabel}" @change="${
                  this._valueChanged
                }" @focusin="${
                  this._onFocus
                }" name="minutes" no-spinner .required="${
                  this.required
                }" .autoValidate="${
                  this.autoValidate
                }" maxlength="2" max="59" min="0" .disabled="${
                  this.disabled
                }" .suffix="${this.enableSecond ? ":" : ""}" class="${
                  this.enableSecond ? "has-suffix" : ""
                }"> </ha-textfield> ${
                  this.enableSecond
                    ? o.dy`<ha-textfield id="sec" type="number" inputmode="numeric" .value="${this._formatValue(
                        this.seconds
                      )}" .label="${this.secLabel}" @change="${
                        this._valueChanged
                      }" @focusin="${
                        this._onFocus
                      }" name="seconds" no-spinner .required="${
                        this.required
                      }" .autoValidate="${
                        this.autoValidate
                      }" maxlength="2" max="59" min="0" .disabled="${
                        this.disabled
                      }" .suffix="${
                        this.enableMillisecond ? ":" : ""
                      }" class="${
                        this.enableMillisecond ? "has-suffix" : ""
                      }"> </ha-textfield>`
                    : ""
                } ${
                  this.enableMillisecond
                    ? o.dy`<ha-textfield id="millisec" type="number" .value="${this._formatValue(
                        this.milliseconds,
                        3
                      )}" .label="${this.millisecLabel}" @change="${
                        this._valueChanged
                      }" @focusin="${
                        this._onFocus
                      }" name="milliseconds" no-spinner .required="${
                        this.required
                      }" .autoValidate="${
                        this.autoValidate
                      }" maxlength="3" max="999" min="0" .disabled="${
                        this.disabled
                      }"> </ha-textfield>`
                    : ""
                } ${
                  24 === this.format
                    ? ""
                    : o.dy`<ha-select .required="${this.required}" .value="${this.amPm}" .disabled="${this.disabled}" name="amPm" naturalMenuWidth fixedMenuPosition @selected="${this._valueChanged}" @closed="${l.U}"> <mwc-list-item value="AM">AM</mwc-list-item> <mwc-list-item value="PM">PM</mwc-list-item> </ha-select>`
                } </div> ${
                  this.helper
                    ? o.dy`<ha-input-helper-text>${this.helper}</ha-input-helper-text>`
                    : ""
                } `;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                const t = e.currentTarget;
                this[t.name] = "amPm" === t.name ? t.value : Number(t.value);
                const i = {
                  hours: this.hours,
                  minutes: this.minutes,
                  seconds: this.seconds,
                  milliseconds: this.milliseconds,
                };
                this.enableDay && (i.days = this.days),
                  12 === this.format && (i.amPm = this.amPm),
                  (0, d.B)(this, "value-changed", { value: i });
              },
            },
            {
              kind: "method",
              key: "_onFocus",
              value: function (e) {
                e.currentTarget.select();
              },
            },
            {
              kind: "method",
              key: "_formatValue",
              value: function (e, t = 2) {
                return e.toString().padStart(t, "0");
              },
            },
            {
              kind: "get",
              key: "_hourMax",
              value: function () {
                if (!this.noHoursLimit) return 12 === this.format ? 12 : 23;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value:
                () => o.iv`:host{display:block}.time-input-wrap{display:flex;border-radius:var(--mdc-shape-small,4px) var(--mdc-shape-small,4px) 0 0;overflow:hidden;position:relative;direction:ltr}ha-textfield{width:40px;text-align:center;--mdc-shape-small:0;--text-field-appearance:none;--text-field-padding:0 4px;--text-field-suffix-padding-left:2px;--text-field-suffix-padding-right:0;--text-field-text-align:center}ha-textfield.hasSuffix{--text-field-padding:0 0 0 4px}ha-textfield:first-child{--text-field-border-top-left-radius:var(--mdc-shape-medium)}ha-textfield:last-child{--text-field-border-top-right-radius:var(--mdc-shape-medium)}ha-select{--mdc-shape-small:0;width:85px}label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(
        --mdc-typography-body2-font-family,
        var(--mdc-typography-font-family, Roboto, sans-serif)
      );font-size:var(--mdc-typography-body2-font-size, .875rem);line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:var(
        --mdc-typography-body2-letter-spacing,
        .0178571429em
      );text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:var(--mdc-typography-body2-text-transform,inherit);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));padding-left:4px}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  92353: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(18394);
    i(64106);
    (0, a.Z)(
      [(0, n.Mo)("ha-duration-input")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "required",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "enableMillisecond",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "enableDay",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.IO)("paper-time-input", !0)],
              key: "_input",
              value: void 0,
            },
            {
              kind: "method",
              key: "focus",
              value: function () {
                this._input && this._input.focus();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-base-time-input .label="${this.label}" .helper="${this.helper}" .required="${this.required}" .autoValidate="${this.required}" .disabled="${this.disabled}" errorMessage="Required" enableSecond .enableMillisecond="${this.enableMillisecond}" .enableDay="${this.enableDay}" format="24" .days="${this._days}" .hours="${this._hours}" .minutes="${this._minutes}" .seconds="${this._seconds}" .milliseconds="${this._milliseconds}" @value-changed="${this._durationChanged}" noHoursLimit dayLabel="dd" hourLabel="hh" minLabel="mm" secLabel="ss" millisecLabel="ms"></ha-base-time-input> `;
              },
            },
            {
              kind: "get",
              key: "_days",
              value: function () {
                var e;
                return null !== (e = this.data) && void 0 !== e && e.days
                  ? Number(this.data.days)
                  : 0;
              },
            },
            {
              kind: "get",
              key: "_hours",
              value: function () {
                var e;
                return null !== (e = this.data) && void 0 !== e && e.hours
                  ? Number(this.data.hours)
                  : 0;
              },
            },
            {
              kind: "get",
              key: "_minutes",
              value: function () {
                var e;
                return null !== (e = this.data) && void 0 !== e && e.minutes
                  ? Number(this.data.minutes)
                  : 0;
              },
            },
            {
              kind: "get",
              key: "_seconds",
              value: function () {
                var e;
                return null !== (e = this.data) && void 0 !== e && e.seconds
                  ? Number(this.data.seconds)
                  : 0;
              },
            },
            {
              kind: "get",
              key: "_milliseconds",
              value: function () {
                var e;
                return null !== (e = this.data) &&
                  void 0 !== e &&
                  e.milliseconds
                  ? Number(this.data.milliseconds)
                  : 0;
              },
            },
            {
              kind: "method",
              key: "_durationChanged",
              value: function (e) {
                e.stopPropagation();
                const t = { ...e.detail.value };
                var i;
                (this.enableMillisecond || t.milliseconds
                  ? t.milliseconds > 999 &&
                    ((t.seconds += Math.floor(t.milliseconds / 1e3)),
                    (t.milliseconds %= 1e3))
                  : delete t.milliseconds,
                t.seconds > 59 &&
                  ((t.minutes += Math.floor(t.seconds / 60)),
                  (t.seconds %= 60)),
                t.minutes > 59 &&
                  ((t.hours += Math.floor(t.minutes / 60)), (t.minutes %= 60)),
                this.enableDay && t.hours > 24) &&
                  ((t.days =
                    (null !== (i = t.days) && void 0 !== i ? i : 0) +
                    Math.floor(t.hours / 24)),
                  (t.hours %= 24));
                (0, s.B)(this, "value-changed", { value: t });
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  7265: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260);
    (0, a.Z)(
      [(0, n.Mo)("ha-input-helper-text")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy`<slot></slot>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                o.iv`:host{display:block;color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6));font-size:.75rem;padding-left:16px;padding-right:16px}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  4993: (e, t, i) => {
    i.a(e, async (e, a) => {
      try {
        i.r(t), i.d(t, { HaActionSelector: () => c });
        var o = i(309),
          n = i(5095),
          s = i(95260),
          d = i(48866),
          l = e([d]);
        d = (l.then ? (await l)() : l)[0];
        let c = (0, o.Z)(
          [(0, s.Mo)("ha-selector-action")],
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
                  decorators: [(0, s.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, s.Cb)({ attribute: !1 })],
                  key: "selector",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, s.Cb)()],
                  key: "value",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, s.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, s.Cb)({ type: Boolean, reflect: !0 })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e;
                    return n.dy` ${
                      this.label ? n.dy`<label>${this.label}</label>` : n.Ld
                    } <ha-automation-action .disabled="${
                      this.disabled
                    }" .actions="${this.value || []}" .hass="${
                      this.hass
                    }" .path="${
                      null === (e = this.selector.action) || void 0 === e
                        ? void 0
                        : e.path
                    }"></ha-automation-action> `;
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return n.iv`ha-automation-action{display:block;margin-bottom:16px}:host([disabled]) ha-automation-action{opacity:var(--light-disabled-opacity);pointer-events:none}label{display:block;margin-bottom:4px;font-weight:500}`;
                  },
                },
              ],
            };
          },
          n.oi
        );
        a();
      } catch (e) {
        a(e);
      }
    });
  },
  22581: (e, t, i) => {
    i.d(t, {
      Ko: () => s,
      cs: () => d,
      du: () => a,
      ko: () => l,
      lL: () => o,
      s3: () => n,
    });
    const a = {
        condition:
          "M4 2A2 2 0 0 0 2 4V12H4V8H6V12H8V4A2 2 0 0 0 6 2H4M4 4H6V6H4M22 15.5V14A2 2 0 0 0 20 12H16V22H20A2 2 0 0 0 22 20V18.5A1.54 1.54 0 0 0 20.5 17A1.54 1.54 0 0 0 22 15.5M20 20H18V18H20V20M20 16H18V14H20M5.79 21.61L4.21 20.39L18.21 2.39L19.79 3.61Z",
        delay:
          "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z",
        event:
          "M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5M11,3A6,6 0 0,1 17,9C17,10.7 16.29,12.23 15.16,13.33L14.16,12.88C15.28,11.96 16,10.56 16,9A5,5 0 0,0 11,4A5,5 0 0,0 6,9C6,11.05 7.23,12.81 9,13.58V14.66C6.67,13.83 5,11.61 5,9A6,6 0 0,1 11,3Z",
        play_media: "M8,5.14V19.14L19,12.14L8,5.14Z",
        activate_scene:
          "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
        service:
          "M12,5A2,2 0 0,1 14,7C14,7.24 13.96,7.47 13.88,7.69C17.95,8.5 21,11.91 21,16H3C3,11.91 6.05,8.5 10.12,7.69C10.04,7.47 10,7.24 10,7A2,2 0 0,1 12,5M22,19H2V17H22V19Z",
        wait_template:
          "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z",
        wait_for_trigger:
          "M12,9A2,2 0 0,1 10,7C10,5.89 10.9,5 12,5C13.11,5 14,5.89 14,7A2,2 0 0,1 12,9M12,14A2,2 0 0,1 10,12C10,10.89 10.9,10 12,10C13.11,10 14,10.89 14,12A2,2 0 0,1 12,14M12,19A2,2 0 0,1 10,17C10,15.89 10.9,15 12,15C13.11,15 14,15.89 14,17A2,2 0 0,1 12,19M20,10H17V8.86C18.72,8.41 20,6.86 20,5H17V4A1,1 0 0,0 16,3H8A1,1 0 0,0 7,4V5H4C4,6.86 5.28,8.41 7,8.86V10H4C4,11.86 5.28,13.41 7,13.86V15H4C4,16.86 5.28,18.41 7,18.86V20A1,1 0 0,0 8,21H16A1,1 0 0,0 17,20V18.86C18.72,18.41 20,16.86 20,15H17V13.86C18.72,13.41 20,11.86 20,10Z",
        repeat:
          "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
        choose:
          "M11,5H8L12,1L16,5H13V9.43C12.25,9.89 11.58,10.46 11,11.12V5M22,11L18,7V10C14.39,9.85 11.31,12.57 11,16.17C9.44,16.72 8.62,18.44 9.17,20C9.72,21.56 11.44,22.38 13,21.83C14.56,21.27 15.38,19.56 14.83,18C14.53,17.14 13.85,16.47 13,16.17C13.47,12.17 17.47,11.97 17.95,11.97V14.97L22,11M10.63,11.59C9.3,10.57 7.67,10 6,10V7L2,11L6,15V12C7.34,12.03 8.63,12.5 9.64,13.4C9.89,12.76 10.22,12.15 10.63,11.59Z",
        if: "M14,4L16.29,6.29L13.41,9.17L14.83,10.59L17.71,7.71L20,10V4M10,4H4V10L6.29,7.71L11,12.41V20H13V11.59L7.71,6.29",
        device_id:
          "M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z",
        stop: "M13 24C9.74 24 6.81 22 5.6 19L2.57 11.37C2.26 10.58 3 9.79 3.81 10.05L4.6 10.31C5.16 10.5 5.62 10.92 5.84 11.47L7.25 15H8V3.25C8 2.56 8.56 2 9.25 2S10.5 2.56 10.5 3.25V12H11.5V1.25C11.5 .56 12.06 0 12.75 0S14 .56 14 1.25V12H15V2.75C15 2.06 15.56 1.5 16.25 1.5C16.94 1.5 17.5 2.06 17.5 2.75V12H18.5V5.75C18.5 5.06 19.06 4.5 19.75 4.5S21 5.06 21 5.75V16C21 20.42 17.42 24 13 24Z",
        parallel:
          "M16,4.5V7H5V9H16V11.5L19.5,8M16,12.5V15H5V17H16V19.5L19.5,16",
        variables:
          "M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2M21 20H3V6H21V20M16.6 8C18.1 9.3 19 11.1 19 13C19 14.9 18.1 16.7 16.6 18L15 17.4C16.3 16.4 17 14.7 17 13S16.3 9.6 15 8.6L16.6 8M7.4 8L9 8.6C7.7 9.6 7 11.3 7 13S7.7 16.4 9 17.4L7.4 18C5.9 16.7 5 14.9 5 13S5.9 9.3 7.4 8M12.1 12L13.5 10H15L12.8 13L14.1 16H12.8L12 14L10.6 16H9L11.3 12.9L10 10H11.3L12.1 12Z",
      },
      o = new Set(["variables"]),
      n = {
        device_id: {},
        helpers: {
          icon: "M21.71 20.29L20.29 21.71A1 1 0 0 1 18.88 21.71L7 9.85A3.81 3.81 0 0 1 6 10A4 4 0 0 1 2.22 4.7L4.76 7.24L5.29 6.71L6.71 5.29L7.24 4.76L4.7 2.22A4 4 0 0 1 10 6A3.81 3.81 0 0 1 9.85 7L21.71 18.88A1 1 0 0 1 21.71 20.29M2.29 18.88A1 1 0 0 0 2.29 20.29L3.71 21.71A1 1 0 0 0 5.12 21.71L10.59 16.25L7.76 13.42M20 2L16 4V6L13.83 8.17L15.83 10.17L18 8H20L22 4Z",
          members: {},
        },
        building_blocks: {
          icon: "M18.5 18.5C19.04 18.5 19.5 18.96 19.5 19.5S19.04 20.5 18.5 20.5H6.5C5.96 20.5 5.5 20.04 5.5 19.5S5.96 18.5 6.5 18.5H18.5M18.5 17H6.5C5.13 17 4 18.13 4 19.5S5.13 22 6.5 22H18.5C19.88 22 21 20.88 21 19.5S19.88 17 18.5 17M21 11H18V7H13L10 11V16H22L21 11M11.54 11L13.5 8.5H16V11H11.54M9.76 3.41L4.76 2L2 11.83C1.66 13.11 2.41 14.44 3.7 14.8L4.86 15.12L8.15 12.29L4.27 11.21L6.15 4.46L8.94 5.24C9.5 5.53 10.71 6.34 11.47 7.37L12.5 6H12.94C11.68 4.41 9.85 3.46 9.76 3.41Z",
          members: {
            condition: {},
            delay: {},
            wait_template: {},
            wait_for_trigger: {},
            repeat: {},
            choose: {},
            if: {},
            stop: {},
            parallel: {},
            variables: {},
          },
        },
        other: {
          icon: "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",
          members: { event: {}, service: {} },
        },
      },
      s = "__SERVICE__",
      d = (e) => (null == e ? void 0 : e.startsWith(s)),
      l = (e) => e.substring(s.length);
  },
  11420: (e, t, i) => {
    i.d(t, { Pw: () => r, TL: () => d });
    var a = i(38768),
      o = i(58135);
    i(38480);
    (0, o.z)(["queued", "parallel"]);
    const n = (0, a.Ry)({
        alias: (0, a.jt)((0, a.Z_)()),
        continue_on_error: (0, a.jt)((0, a.O7)()),
        enabled: (0, a.jt)((0, a.O7)()),
      }),
      s = (0, a.Ry)({
        entity_id: (0, a.jt)((0, a.G0)([(0, a.Z_)(), (0, a.IX)((0, a.Z_)())])),
        device_id: (0, a.jt)((0, a.G0)([(0, a.Z_)(), (0, a.IX)((0, a.Z_)())])),
        area_id: (0, a.jt)((0, a.G0)([(0, a.Z_)(), (0, a.IX)((0, a.Z_)())])),
      }),
      d = (0, a.f0)(
        n,
        (0, a.Ry)({
          service: (0, a.jt)((0, a.Z_)()),
          service_template: (0, a.jt)((0, a.Z_)()),
          entity_id: (0, a.jt)((0, a.Z_)()),
          target: (0, a.jt)(s),
          data: (0, a.jt)((0, a.Ry)()),
          response_variable: (0, a.jt)((0, a.Z_)()),
          metadata: (0, a.jt)((0, a.Ry)()),
        })
      ),
      l = (0, a.f0)(
        n,
        (0, a.Ry)({
          service: (0, a.i0)("media_player.play_media"),
          target: (0, a.jt)((0, a.Ry)({ entity_id: (0, a.jt)((0, a.Z_)()) })),
          entity_id: (0, a.jt)((0, a.Z_)()),
          data: (0, a.Ry)({
            media_content_id: (0, a.Z_)(),
            media_content_type: (0, a.Z_)(),
          }),
          metadata: (0, a.Ry)(),
        })
      ),
      c = (0, a.f0)(
        n,
        (0, a.Ry)({
          service: (0, a.i0)("scene.turn_on"),
          target: (0, a.jt)((0, a.Ry)({ entity_id: (0, a.jt)((0, a.Z_)()) })),
          entity_id: (0, a.jt)((0, a.Z_)()),
          metadata: (0, a.Ry)(),
        })
      );
    const r = (e) => {
      if ("delay" in e) return "delay";
      if ("wait_template" in e) return "wait_template";
      if (["condition", "and", "or", "not"].some((t) => t in e))
        return "check_condition";
      if ("event" in e) return "fire_event";
      if ("device_id" in e) return "device_action";
      if ("scene" in e) return "activate_scene";
      if ("repeat" in e) return "repeat";
      if ("choose" in e) return "choose";
      if ("if" in e) return "if";
      if ("wait_for_trigger" in e) return "wait_for_trigger";
      if ("variables" in e) return "variables";
      if ("stop" in e) return "stop";
      if ("parallel" in e) return "parallel";
      if ("service" in e) {
        if ("metadata" in e) {
          if ((0, a.is)(e, c)) return "activate_scene";
          if ((0, a.is)(e, l)) return "play_media";
        }
        return "service";
      }
      return "unknown";
    };
  },
  35422: (e, t, i) => {
    i.a(e, async (e, a) => {
      try {
        i.d(t, { Q: () => g });
        var o = i(4771),
          n = i(57128),
          s = i(93312),
          d = i(2733),
          l = i(86603),
          c = i(13426),
          r = i(44553),
          h = i(25917),
          u = i(16061),
          v = i(15306),
          p = i(64346),
          m = i(11420),
          f = e([n, l, r]);
        [n, l, r] = f.then ? (await f)() : f;
        const y = "ui.panel.config.automation.editor.actions.type",
          g = (e, t, i, a, o = !1) => {
            try {
              return _(e, t, i, a, o);
            } catch (e) {
              console.error(e);
              let t = "Error in describing action";
              return e.message && (t += ": " + e.message), t;
            }
          },
          _ = (e, t, i, a, f = !1) => {
            if (i.alias && !f) return i.alias;
            if ((a || (a = (0, m.Pw)(i)), "service" === a)) {
              const a = i,
                o = [];
              if (a.target)
                for (const [i, n] of Object.entries({
                  area_id: "areas",
                  device_id: "devices",
                  entity_id: "entities",
                })) {
                  if (!(i in a.target)) continue;
                  const s = Array.isArray(a.target[i])
                    ? a.target[i]
                    : [a.target[i]];
                  for (const a of s) {
                    if ((0, c.J)(a)) {
                      o.push(
                        e.localize(`${y}.service.description.target_template`, {
                          name: n,
                        })
                      );
                      break;
                    }
                    if ("entity_id" === i)
                      if (a.includes(".")) {
                        const t = e.states[a];
                        t ? o.push((0, d.C)(t)) : o.push(a);
                      } else {
                        const i = (0, v.Mw)(t)[a];
                        i
                          ? o.push((0, v.vA)(e, i) || a)
                          : o.push(
                              e.localize(
                                `${y}.service.description.target_unknown_entity`
                              )
                            );
                      }
                    else if ("device_id" === i) {
                      const t = e.devices[a];
                      t
                        ? o.push((0, u.jL)(t, e))
                        : o.push(
                            e.localize(
                              `${y}.service.description.target_unknown_device`
                            )
                          );
                    } else if ("area_id" === i) {
                      const t = e.areas[a];
                      null != t && t.name
                        ? o.push(t.name)
                        : o.push(
                            e.localize(
                              `${y}.service.description.target_unknown_area`
                            )
                          );
                    } else o.push(a);
                  }
                }
              if (a.service_template || (a.service && (0, c.J)(a.service)))
                return e.localize(
                  `${y}.service.description.service_based_on_template`,
                  { targets: (0, l.z)(e.locale, o) }
                );
              if (a.service) {
                var g;
                const [t, i] = a.service.split(".", 2),
                  n =
                    e.localize(`component.${t}.services.${i}.name`) ||
                    (null === (g = e.services[t][i]) || void 0 === g
                      ? void 0
                      : g.name);
                return a.metadata
                  ? e.localize(`${y}.service.description.service_name`, {
                      domain: (0, p.Lh)(e.localize, t),
                      name: n || a.service,
                      targets: (0, l.z)(e.locale, o),
                    })
                  : e.localize(
                      `${y}.service.description.service_based_on_name`,
                      {
                        name: n
                          ? `${(0, p.Lh)(e.localize, t)}: ${n}`
                          : a.service,
                        targets: (0, l.z)(e.locale, o),
                      }
                    );
              }
              return e.localize(`${y}.service.description.service`);
            }
            if ("delay" === a) {
              const t = i;
              let a;
              return (
                (a =
                  "number" == typeof t.delay
                    ? e.localize(`${y}.delay.description.duration_string`, {
                        string: (0, s.Z)(t.delay),
                      })
                    : "string" == typeof t.delay
                    ? (0, c.J)(t.delay)
                      ? e.localize(`${y}.delay.description.duration_template`)
                      : e.localize(`${y}.delay.description.duration_string`, {
                          string:
                            t.delay ||
                            e.localize(
                              `${y}.delay.description.duration_unknown`
                            ),
                        })
                    : t.delay
                    ? e.localize(`${y}.delay.description.duration_string`, {
                        string: (0, n.L)(e.locale, t.delay),
                      })
                    : e.localize(`${y}.delay.description.duration_string`, {
                        string: e.localize(
                          `${y}.delay.description.duration_unknown`
                        ),
                      })),
                e.localize(`${y}.delay.description.full`, { duration: a })
              );
            }
            if ("activate_scene" === a) {
              const t = i;
              let a;
              var _;
              if ("scene" in t) a = t.scene;
              else
                a =
                  (null === (_ = t.target) || void 0 === _
                    ? void 0
                    : _.entity_id) || t.entity_id;
              if (!a)
                return e.localize(
                  `${y}.activate_scene.description.activate_scene`
                );
              const o = a ? e.states[a] : void 0;
              return e.localize(
                `${y}.activate_scene.description.activate_scene_with_name`,
                { name: o ? (0, d.C)(o) : a }
              );
            }
            if ("play_media" === a) {
              var k;
              const t = i,
                a =
                  (null === (k = t.target) || void 0 === k
                    ? void 0
                    : k.entity_id) || t.entity_id,
                o = a ? e.states[a] : void 0;
              return e.localize(`${y}.play_media.description.full`, {
                hasMedia:
                  t.metadata.title || t.data.media_content_id
                    ? "true"
                    : "false",
                media: t.metadata.title || t.data.media_content_id,
                hasMediaPlayer: o || void 0 !== a ? "true" : "false",
                mediaPlayer: o ? (0, d.C)(o) : a,
              });
            }
            if ("wait_for_trigger" === a) {
              const t = i,
                a = (0, o.r)(t.wait_for_trigger);
              return a && 0 !== a.length
                ? e.localize(
                    `${y}.wait_for_trigger.description.wait_for_triggers`,
                    { count: a.length }
                  )
                : e.localize(
                    `${y}.wait_for_trigger.description.wait_for_a_trigger`
                  );
            }
            if ("variables" === a) {
              const t = i;
              return e.localize(`${y}.variables.description.full`, {
                names: (0, l.z)(e.locale, Object.keys(t.variables)),
              });
            }
            if ("fire_event" === a) {
              const t = i;
              return (0, c.J)(t.event)
                ? e.localize(`${y}.event.description.full`, {
                    name: e.localize(`${y}.event.description.template`),
                  })
                : e.localize(`${y}.event.description.full`, { name: t.event });
            }
            if ("wait_template" === a)
              return e.localize(`${y}.wait_template.description.full`);
            if ("stop" === a) {
              const t = i;
              return e.localize(`${y}.stop.description.full`, {
                hasReason: void 0 !== t.stop ? "true" : "false",
                reason: t.stop,
              });
            }
            if ("if" === a) {
              return void 0 !== i.else
                ? e.localize(`${y}.if.description.if_else`)
                : e.localize(`${y}.if.description.if`);
            }
            if ("choose" === a) {
              const t = i;
              if (t.choose) {
                const i = (0, o.r)(t.choose).length + (t.default ? 1 : 0);
                return e.localize(`${y}.choose.description.full`, {
                  number: i,
                });
              }
              return e.localize(`${y}.choose.description.no_action`);
            }
            if ("repeat" === a) {
              const t = i;
              let a = "";
              if ("count" in t.repeat) {
                const i = t.repeat.count;
                a = e.localize(`${y}.repeat.description.count`, { count: i });
              } else if ("while" in t.repeat) {
                const i = (0, o.r)(t.repeat.while);
                a = e.localize(`${y}.repeat.description.while_count`, {
                  count: i.length,
                });
              } else if ("until" in t.repeat) {
                const i = (0, o.r)(t.repeat.until);
                a = e.localize(`${y}.repeat.description.until_count`, {
                  count: i.length,
                });
              } else if ("for_each" in t.repeat) {
                const i = (0, o.r)(t.repeat.for_each).map((e) =>
                  JSON.stringify(e)
                );
                a = e.localize(`${y}.repeat.description.for_each`, {
                  items: (0, l.z)(e.locale, i),
                });
              }
              return e.localize(`${y}.repeat.description.full`, {
                chosenAction: a,
              });
            }
            if ("check_condition" === a)
              return e.localize(`${y}.check_condition.description.full`, {
                condition: (0, r.m)(i, e, t),
              });
            if ("device_action" === a) {
              const a = i;
              if (!a.device_id)
                return e.localize(`${y}.device_id.description.no_device`);
              const o = (0, h._2)(e, t, a);
              if (o) return o;
              const n = e.states[a.entity_id];
              return `${a.type || "Perform action with"} ${
                n ? (0, d.C)(n) : a.entity_id
              }`;
            }
            if ("parallel" === a) {
              const t = i,
                a = (0, o.r)(t.parallel).length;
              return e.localize(`${y}.parallel.description.full`, {
                number: a,
              });
            }
            return a;
          };
        a();
      } catch (e) {
        a(e);
      }
    });
  },
  48238: (e, t, i) => {
    i.d(t, { n: () => a });
    const a = (e, t) => e.callWS({ type: "execute_script", sequence: t });
  },
  63602: (e, t, i) => {
    i.a(e, async (e, a) => {
      try {
        i.d(t, { a0: () => Q, oL: () => K });
        var o = i(309),
          n = i(22264),
          s = (i(44577), i(3239)),
          d = i(5095),
          l = i(95260),
          c = i(53180),
          r = i(3747),
          h = i(17267),
          u = i(18394),
          v = i(36655),
          p = i(81454),
          m = i(930),
          f = i(92482),
          y = (i(23860), i(85878), i(68336), i(31360), i(54371), i(22581)),
          g = i(59449),
          _ = i(38149),
          k = i(11420),
          b = i(35422),
          $ = i(48238),
          C = i(11285),
          x = i(29950),
          V = i(77251),
          M = i(33849),
          H = (i(55683), i(84702)),
          A = i(41992),
          w = (i(32501), i(69645), i(52668)),
          L = i(94824),
          z = i(15787),
          B = (i(49368), i(66873)),
          Z = (i(1794), i(98723), i(29800)),
          S = (i(93972), e([b, H, A, w, L, z, B, Z]));
        [b, H, A, w, L, z, B, Z] = S.then ? (await S)() : S;
        const P =
            "M18.75 22.16L16 19.16L17.16 18L18.75 19.59L22.34 16L23.5 17.41L18.75 22.16M13 13V7H11V13H13M13 17V15H11V17H13M12 2C17.5 2 22 6.5 22 12L21.91 13.31C21.31 13.11 20.67 13 20 13C16.69 13 14 15.69 14 19C14 19.95 14.22 20.85 14.62 21.65C13.78 21.88 12.91 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z",
          D = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
          F =
            "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",
          q =
            "M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",
          O =
            "M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z",
          j =
            "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
          R =
            "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
          T = "M8,5.14V19.14L19,12.14L8,5.14Z",
          E =
            "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z",
          I =
            "M18,17H10.5L12.5,15H18M6,17V14.5L13.88,6.65C14.07,6.45 14.39,6.45 14.59,6.65L16.35,8.41C16.55,8.61 16.55,8.92 16.35,9.12L8.47,17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z",
          N =
            "M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z",
          U =
            "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9",
          K = (e) => {
            if (e)
              return "service" in e || "scene" in e
                ? (0, k.Pw)(e)
                : ["and", "or", "not"].some((t) => t in e)
                ? "condition"
                : Object.keys(y.du).find((t) => t in e);
          },
          Q = (e, t) => {
            var i, a;
            t.stopPropagation();
            const o = null === (i = t.target) || void 0 === i ? void 0 : i.name;
            if (!o) return;
            const n =
              (null === (a = t.detail) || void 0 === a ? void 0 : a.value) ||
              t.target.value;
            if ((e.action[o] || "") === n) return;
            let s;
            n
              ? (s = { ...e.action, [o]: n })
              : ((s = { ...e.action }), delete s[o]),
              (0, u.B)(e, "value-changed", { value: s });
          },
          J = (e) => e.preventDefault();
        (0, o.Z)(
          [(0, l.Mo)("ha-automation-action-row")],
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
                  decorators: [(0, l.Cb)()],
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ type: Boolean })],
                  key: "narrow",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)({ type: Boolean })],
                  key: "hideMenu",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, l.Cb)()],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, r.t)({
                      key: "automationClipboard",
                      state: !1,
                      subscribe: !0,
                      storage: "sessionStorage",
                    }),
                  ],
                  key: "_clipboard",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, l.SB)(),
                    (0, n.F)({ context: _.we, subscribe: !0 }),
                  ],
                  key: "_entityReg",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, l.SB)(),
                    (0, n.F)({ context: V.T, subscribe: !0 }),
                  ],
                  key: "_reorderMode",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.SB)()],
                  key: "_warnings",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.SB)()],
                  key: "_uiModeAvailable",
                  value: () => !0,
                },
                {
                  kind: "field",
                  decorators: [(0, l.SB)()],
                  key: "_yamlMode",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, l.IO)("ha-yaml-editor")],
                  key: "_yamlEditor",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "willUpdate",
                  value: function (e) {
                    if (!e.has("action")) return;
                    const t = K(this.action);
                    (this._uiModeAvailable = void 0 !== t && !y.lL.has(t)),
                      this._uiModeAvailable ||
                        this._yamlMode ||
                        (this._yamlMode = !0);
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    if (e.has("action") && this._yamlMode) {
                      const e = this._yamlEditor;
                      e && e.value !== this.action && e.setValue(this.action);
                    }
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    if (!this.action) return d.Ld;
                    const e = K(this.action),
                      t = this._yamlMode,
                      i = void 0 === this._reorderMode;
                    return d.dy` <ha-card outlined> ${
                      !1 === this.action.enabled
                        ? d.dy`<div class="disabled-bar"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.disabled"
                          )} </div>`
                        : ""
                    } <ha-expansion-panel leftChevron> <h3 slot="header"> <ha-svg-icon class="action-icon" .path="${
                      ("service" === e &&
                        "service" in this.action &&
                        this.action.service &&
                        (0, p.G)((0, v.M)(this.action.service))) ||
                      y.du[e]
                    }"></ha-svg-icon> ${(0, m.f)(
                      (0, b.Q)(this.hass, this._entityReg, this.action)
                    )} </h3> <slot name="icons" slot="icons"></slot> ${
                      "condition" !== e && !0 === this.action.continue_on_error
                        ? d.dy`<div slot="icons"> <ha-svg-icon .path="${P}"></ha-svg-icon> <simple-tooltip animation-delay="0"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.continue_on_error"
                          )} </simple-tooltip> </div> `
                        : d.Ld
                    } ${
                      this.hideMenu
                        ? ""
                        : d.dy` <ha-button-menu slot="icons" @action="${
                            this._handleAction
                          }" @click="${J}" fixed> <ha-icon-button slot="trigger" .label="${this.hass.localize(
                            "ui.common.menu"
                          )}" .path="${R}"></ha-icon-button> <mwc-list-item graphic="icon"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.run"
                          )} <ha-svg-icon slot="graphic" .path="${T}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.rename"
                          )} <ha-svg-icon slot="graphic" .path="${I}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }" class="${(0, c.$)({
                            hidden: i,
                          })}"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.re_order"
                          )} <ha-svg-icon slot="graphic" .path="${N}"></ha-svg-icon> </mwc-list-item> <li divider role="separator"></li> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.duplicate"
                          )} <ha-svg-icon slot="graphic" .path="${O}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.triggers.copy"
                          )} <ha-svg-icon slot="graphic" .path="${F}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.triggers.cut"
                          )} <ha-svg-icon slot="graphic" .path="${q}"></ha-svg-icon> </mwc-list-item> <li divider role="separator"></li> <mwc-list-item .disabled="${!this
                            ._uiModeAvailable}" graphic="icon"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.edit_ui"
                          )} ${
                            t
                              ? ""
                              : d.dy`<ha-svg-icon class="selected_menu_item" slot="graphic" .path="${D}"></ha-svg-icon>`
                          } </mwc-list-item> <mwc-list-item .disabled="${!this
                            ._uiModeAvailable}" graphic="icon"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.edit_yaml"
                          )} ${
                            t
                              ? d.dy`<ha-svg-icon class="selected_menu_item" slot="graphic" .path="${D}"></ha-svg-icon>`
                              : ""
                          } </mwc-list-item> <li divider role="separator"></li> <mwc-list-item graphic="icon" .disabled="${
                            this.disabled
                          }"> ${
                            !1 === this.action.enabled
                              ? this.hass.localize(
                                  "ui.panel.config.automation.editor.actions.enable"
                                )
                              : this.hass.localize(
                                  "ui.panel.config.automation.editor.actions.disable"
                                )
                          } <ha-svg-icon slot="graphic" .path="${
                            !1 === this.action.enabled ? E : U
                          }"></ha-svg-icon> </mwc-list-item> <mwc-list-item class="warning" graphic="icon" .disabled="${
                            this.disabled
                          }"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.delete"
                          )} <ha-svg-icon class="warning" slot="graphic" .path="${j}"></ha-svg-icon> </mwc-list-item> </ha-button-menu> `
                    } <div class="${(0, c.$)({
                      "card-content": !0,
                      disabled: !1 === this.action.enabled,
                    })}"> ${
                      this._warnings
                        ? d.dy`<ha-alert alert-type="warning" .title="${this.hass.localize(
                            "ui.errors.config.editor_not_supported"
                          )}"> ${
                            this._warnings.length > 0 &&
                            void 0 !== this._warnings[0]
                              ? d.dy` <ul> ${this._warnings.map(
                                  (e) => d.dy`<li>${e}</li>`
                                )} </ul>`
                              : ""
                          } ${this.hass.localize(
                            "ui.errors.config.edit_in_yaml_supported"
                          )} </ha-alert>`
                        : ""
                    } ${
                      t
                        ? d.dy` ${
                            void 0 === e
                              ? d.dy` ${this.hass.localize(
                                  "ui.panel.config.automation.editor.actions.unsupported_action"
                                )} `
                              : ""
                          } <ha-yaml-editor .hass="${
                            this.hass
                          }" .defaultValue="${this.action}" .readOnly="${
                            this.disabled
                          }" @value-changed="${
                            this._onYamlChange
                          }"></ha-yaml-editor> `
                        : d.dy` <div @ui-mode-not-available="${
                            this._handleUiModeNotAvailable
                          }" @value-changed="${this._onUiChanged}"> ${(0, h.h)(
                            `ha-automation-action-${e}`,
                            {
                              hass: this.hass,
                              action: this.action,
                              narrow: this.narrow,
                              disabled: this.disabled,
                              path: this.path,
                            }
                          )} </div> `
                    } </div> </ha-expansion-panel> </ha-card> `;
                  },
                },
                {
                  kind: "method",
                  key: "_handleUiModeNotAvailable",
                  value: function (e) {
                    e.stopPropagation(),
                      (this._warnings = (0, f.p)(this.hass, e.detail).warnings),
                      this._yamlMode || (this._yamlMode = !0);
                  },
                },
                {
                  kind: "method",
                  key: "_handleAction",
                  value: async function (e) {
                    var t;
                    switch (e.detail.index) {
                      case 0:
                        this._runAction();
                        break;
                      case 1:
                        await this._renameAction();
                        break;
                      case 2:
                        null === (t = this._reorderMode) ||
                          void 0 === t ||
                          t.enter();
                        break;
                      case 3:
                        (0, u.B)(this, "duplicate");
                        break;
                      case 4:
                        this._setClipboard();
                        break;
                      case 5:
                        this._setClipboard(),
                          (0, u.B)(this, "value-changed", { value: null });
                        break;
                      case 6:
                        this._switchUiMode(), this.expand();
                        break;
                      case 7:
                        this._switchYamlMode(), this.expand();
                        break;
                      case 8:
                        this._onDisable();
                        break;
                      case 9:
                        this._onDelete();
                    }
                  },
                },
                {
                  kind: "method",
                  key: "_setClipboard",
                  value: function () {
                    this._clipboard = {
                      ...this._clipboard,
                      action: (0, s.Z)(this.action),
                    };
                  },
                },
                {
                  kind: "method",
                  key: "_onDisable",
                  value: function () {
                    var e;
                    const t = !(
                        null === (e = this.action.enabled) ||
                        void 0 === e ||
                        e
                      ),
                      i = { ...this.action, enabled: t };
                    var a;
                    ((0, u.B)(this, "value-changed", { value: i }),
                    this._yamlMode) &&
                      (null === (a = this._yamlEditor) ||
                        void 0 === a ||
                        a.setValue(i));
                  },
                },
                {
                  kind: "method",
                  key: "_runAction",
                  value: async function () {
                    const e = await (0, g.w)(this.hass, {
                      action: this.action,
                    });
                    if (e.action.valid) {
                      try {
                        await (0, $.n)(this.hass, this.action);
                      } catch (e) {
                        return void (0, C.Ys)(this, {
                          title: this.hass.localize(
                            "ui.panel.config.automation.editor.actions.run_action_error"
                          ),
                          text: e.message || e,
                        });
                      }
                      (0, M.C)(this, {
                        message: this.hass.localize(
                          "ui.panel.config.automation.editor.actions.run_action_success"
                        ),
                      });
                    } else
                      (0, C.Ys)(this, {
                        title: this.hass.localize(
                          "ui.panel.config.automation.editor.actions.invalid_action"
                        ),
                        text: e.action.error,
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_onDelete",
                  value: function () {
                    (0, C.g7)(this, {
                      title: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.delete_confirm_title"
                      ),
                      text: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.delete_confirm_text"
                      ),
                      dismissText: this.hass.localize("ui.common.cancel"),
                      confirmText: this.hass.localize("ui.common.delete"),
                      destructive: !0,
                      confirm: () => {
                        (0, u.B)(this, "value-changed", { value: null });
                      },
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_onYamlChange",
                  value: function (e) {
                    e.stopPropagation(),
                      e.detail.isValid &&
                        (0, u.B)(this, "value-changed", {
                          value: e.detail.value,
                        });
                  },
                },
                {
                  kind: "method",
                  key: "_onUiChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = {
                      ...(this.action.alias
                        ? { alias: this.action.alias }
                        : {}),
                      ...e.detail.value,
                    };
                    (0, u.B)(this, "value-changed", { value: t });
                  },
                },
                {
                  kind: "method",
                  key: "_switchUiMode",
                  value: function () {
                    (this._warnings = void 0), (this._yamlMode = !1);
                  },
                },
                {
                  kind: "method",
                  key: "_switchYamlMode",
                  value: function () {
                    (this._warnings = void 0), (this._yamlMode = !0);
                  },
                },
                {
                  kind: "method",
                  key: "_renameAction",
                  value: async function () {
                    const e = await (0, C.D9)(this, {
                      title: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.change_alias"
                      ),
                      inputLabel: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.alias"
                      ),
                      inputType: "string",
                      placeholder: (0, m.f)(
                        (0, b.Q)(
                          this.hass,
                          this._entityReg,
                          this.action,
                          void 0,
                          !0
                        )
                      ),
                      defaultValue: this.action.alias,
                      confirmText: this.hass.localize("ui.common.submit"),
                    });
                    if (null !== e) {
                      const i = { ...this.action };
                      var t;
                      if (
                        ("" === e ? delete i.alias : (i.alias = e),
                        (0, u.B)(this, "value-changed", { value: i }),
                        this._yamlMode)
                      )
                        null === (t = this._yamlEditor) ||
                          void 0 === t ||
                          t.setValue(i);
                    }
                  },
                },
                {
                  kind: "method",
                  key: "expand",
                  value: function () {
                    this.updateComplete.then(() => {
                      this.shadowRoot.querySelector(
                        "ha-expansion-panel"
                      ).expanded = !0;
                    });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      x.Qx,
                      d.iv`ha-button-menu,ha-icon-button{--mdc-theme-text-primary-on-background:var(--primary-text-color)}.disabled{opacity:.5;pointer-events:none}ha-expansion-panel{--expansion-panel-summary-padding:0 0 0 8px;--expansion-panel-content-padding:0}h3{margin:0;font-size:inherit;font-weight:inherit}.action-icon{display:none}@media (min-width:870px){.action-icon{display:inline-block;color:var(--secondary-text-color);opacity:.9;margin-right:8px}}.card-content{padding:16px}.disabled-bar{background:var(--divider-color,#e0e0e0);text-align:center;border-top-right-radius:var(--ha-card-border-radius);border-top-left-radius:var(--ha-card-border-radius)}mwc-list-item[disabled]{--mdc-theme-text-primary-on-background:var(--disabled-text-color)}mwc-list-item.hidden{display:none}.warning ul{margin:4px 0}.selected_menu_item{color:var(--primary-color)}li[role=separator]{border-bottom-color:var(--divider-color)}`,
                    ];
                  },
                },
              ],
            };
          },
          d.oi
        );
        a();
      } catch (e) {
        a(e);
      }
    });
  },
  48866: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(34541),
          n = i(47838),
          s = i(22264),
          d = i(3239),
          l = i(5095),
          c = i(95260),
          r = i(99266),
          h = i(3747),
          u = i(18394),
          v = i(32723),
          p = (i(92295), i(42308), i(37662), i(22581)),
          m = i(77251),
          f = i(64082),
          y = i(63602),
          g = e([y]);
        y = (g.then ? (await g)() : g)[0];
        const _ =
            "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
          k =
            "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
          b =
            "M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z",
          $ = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
        (0, a.Z)(
          [(0, c.Mo)("ha-automation-action")],
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
                  decorators: [(0, c.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)({ type: Boolean })],
                  key: "narrow",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)()],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)()],
                  key: "actions",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, c.SB)(),
                    (0, s.F)({ context: m.T, subscribe: !0 }),
                  ],
                  key: "_reorderMode",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, h.t)({
                      key: "automationClipboard",
                      state: !0,
                      subscribe: !0,
                      storage: "sessionStorage",
                    }),
                  ],
                  key: "_clipboard",
                  value: void 0,
                },
                {
                  kind: "field",
                  key: "_focusLastActionOnChange",
                  value: () => !1,
                },
                {
                  kind: "field",
                  key: "_actionKeys",
                  value: () => new WeakMap(),
                },
                {
                  kind: "get",
                  key: "nested",
                  value: function () {
                    return void 0 !== this.path;
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e;
                    return l.dy` <ha-sortable handle-selector=".handle" .disabled="${!(
                      null !== (e = this._reorderMode) &&
                      void 0 !== e &&
                      e.active
                    )}" @item-moved="${
                      this._actionMoved
                    }" group="actions" .path="${
                      this.path
                    }"> <div class="actions"> ${(0, r.r)(
                      this.actions,
                      (e) => this._getKey(e),
                      (e, t) => {
                        var i, a, o;
                        return l.dy` <ha-automation-action-row .path="${[
                          ...(null !== (i = this.path) && void 0 !== i
                            ? i
                            : []),
                          t,
                        ]}" .index="${t}" .action="${e}" .narrow="${
                          this.narrow
                        }" .disabled="${this.disabled}" .hideMenu="${Boolean(
                          null === (a = this._reorderMode) || void 0 === a
                            ? void 0
                            : a.active
                        )}" @duplicate="${
                          this._duplicateAction
                        }" @value-changed="${this._actionChanged}" .hass="${
                          this.hass
                        }"> ${
                          null !== (o = this._reorderMode) &&
                          void 0 !== o &&
                          o.active
                            ? l.dy` <ha-icon-button .index="${t}" slot="icons" .label="${this.hass.localize(
                                "ui.panel.config.automation.editor.move_up"
                              )}" .path="${k}" @click="${
                                this._moveUp
                              }" .disabled="${
                                0 === t
                              }"></ha-icon-button> <ha-icon-button .index="${t}" slot="icons" .label="${this.hass.localize(
                                "ui.panel.config.automation.editor.move_down"
                              )}" .path="${_}" @click="${
                                this._moveDown
                              }" .disabled="${
                                t === this.actions.length - 1
                              }"></ha-icon-button> <div class="handle" slot="icons"> <ha-svg-icon .path="${b}"></ha-svg-icon> </div> `
                            : ""
                        } </ha-automation-action-row> `;
                      }
                    )} </div> </ha-sortable> <div class="buttons"> <ha-button outlined .disabled="${
                      this.disabled
                    }" .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.add"
                    )}" @click="${
                      this._addActionDialog
                    }"> <ha-svg-icon .path="${$}" slot="icon"></ha-svg-icon> </ha-button> <ha-button .disabled="${
                      this.disabled
                    }" .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.add_building_block"
                    )}" @click="${
                      this._addActionBuildingBlockDialog
                    }"> <ha-svg-icon .path="${$}" slot="icon"></ha-svg-icon> </ha-button> </div> `;
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    if (
                      ((0, o.Z)((0, n.Z)(i.prototype), "updated", this).call(
                        this,
                        e
                      ),
                      e.has("actions") && this._focusLastActionOnChange)
                    ) {
                      this._focusLastActionOnChange = !1;
                      const e = this.shadowRoot.querySelector(
                        "ha-automation-action-row:last-of-type"
                      );
                      e.updateComplete.then(() => {
                        e.expand(), e.scrollIntoView(), e.focus();
                      });
                    }
                  },
                },
                {
                  kind: "method",
                  key: "_addActionDialog",
                  value: function () {
                    var e;
                    (0, f._)(this, {
                      type: "action",
                      add: this._addAction,
                      clipboardItem: (0, y.oL)(
                        null === (e = this._clipboard) || void 0 === e
                          ? void 0
                          : e.action
                      ),
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_addActionBuildingBlockDialog",
                  value: function () {
                    var e;
                    (0, f._)(this, {
                      type: "action",
                      add: this._addAction,
                      clipboardItem: (0, y.oL)(
                        null === (e = this._clipboard) || void 0 === e
                          ? void 0
                          : e.action
                      ),
                      group: "building_blocks",
                    });
                  },
                },
                {
                  kind: "field",
                  key: "_addAction",
                  value() {
                    return (e) => {
                      let t;
                      if (e === f.I)
                        t = this.actions.concat(
                          (0, d.Z)(this._clipboard.action)
                        );
                      else if ((0, p.cs)(e))
                        t = this.actions.concat({
                          service: (0, p.ko)(e),
                          metadata: {},
                        });
                      else {
                        const i = customElements.get(
                          `ha-automation-action-${e}`
                        );
                        t = this.actions.concat(
                          i ? { ...i.defaultConfig } : { [e]: {} }
                        );
                      }
                      (this._focusLastActionOnChange = !0),
                        (0, u.B)(this, "value-changed", { value: t });
                    };
                  },
                },
                {
                  kind: "method",
                  key: "_getKey",
                  value: function (e) {
                    return (
                      this._actionKeys.has(e) ||
                        this._actionKeys.set(e, Math.random().toString()),
                      this._actionKeys.get(e)
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_moveUp",
                  value: function (e) {
                    const t = e.target.index,
                      i = t - 1;
                    this._move(t, i);
                  },
                },
                {
                  kind: "method",
                  key: "_moveDown",
                  value: function (e) {
                    const t = e.target.index,
                      i = t + 1;
                    this._move(t, i);
                  },
                },
                {
                  kind: "method",
                  key: "_move",
                  value: function (e, t, i, a) {
                    const o = (0, v.b)(this.actions, e, t, i, a);
                    (0, u.B)(this, "value-changed", { value: o });
                  },
                },
                {
                  kind: "method",
                  key: "_actionMoved",
                  value: function (e) {
                    if (this.nested) return;
                    e.stopPropagation();
                    const {
                      oldIndex: t,
                      newIndex: i,
                      oldPath: a,
                      newPath: o,
                    } = e.detail;
                    this._move(t, i, a, o);
                  },
                },
                {
                  kind: "method",
                  key: "_actionChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = [...this.actions],
                      i = e.detail.value,
                      a = e.target.index;
                    if (null === i) t.splice(a, 1);
                    else {
                      const e = this._getKey(t[a]);
                      this._actionKeys.set(i, e), (t[a] = i);
                    }
                    (0, u.B)(this, "value-changed", { value: t });
                  },
                },
                {
                  kind: "method",
                  key: "_duplicateAction",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.target.index;
                    (0, u.B)(this, "value-changed", {
                      value: this.actions.concat((0, d.Z)(this.actions[t])),
                    });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return l.iv`ha-automation-action-row{display:block;margin-bottom:16px;scroll-margin-top:48px}ha-svg-icon{height:20px}ha-alert{display:block;margin-bottom:16px;border-radius:var(--ha-card-border-radius,12px);overflow:hidden}.handle{padding:12px;cursor:move;cursor:grab}.handle ha-svg-icon{pointer-events:none;height:24px}.buttons{display:flex;flex-wrap:wrap;gap:8px}`;
                  },
                },
              ],
            };
          },
          l.oi
        );
        t();
      } catch (e) {
        t(e);
      }
    });
  },
  55683: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(18394);
    i(91998);
    const d = ["scene"];
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-activate_scene")],
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
              key: "action",
              value: void 0,
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return {
                  service: "scene.turn_on",
                  target: { entity_id: "" },
                  metadata: {},
                };
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                let e;
                var t;
                "scene" in this.action
                  ? (e = this.action.scene)
                  : (e =
                      null === (t = this.action.target) || void 0 === t
                        ? void 0
                        : t.entity_id);
                return o.dy` <ha-entity-picker .hass="${
                  this.hass
                }" .label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.activate_scene.scene"
                )}" .value="${e}" .disabled="${
                  this.disabled
                }" @value-changed="${
                  this._entityPicked
                }" .includeDomains="${d}" allow-custom-entity></ha-entity-picker> `;
              },
            },
            {
              kind: "method",
              key: "_entityPicked",
              value: function (e) {
                e.stopPropagation(),
                  (0, s.B)(this, "value-changed", {
                    value: {
                      ...this.action,
                      service: "scene.turn_on",
                      target: { entity_id: e.detail.value },
                      metadata: {},
                    },
                  });
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  84702: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(34541),
          n = i(47838),
          s = i(22264),
          d = i(3239),
          l = i(5095),
          c = i(95260),
          r = i(53180),
          h = i(99266),
          u = i(4771),
          v = i(18394),
          p = i(930),
          m = (i(92295), i(85878), i(54371), i(42308), i(44553)),
          f = i(38149),
          y = i(11285),
          g = i(29950),
          _ = i(77251),
          k = e([m]);
        m = (k.then ? (await k)() : k)[0];
        const b =
            "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
          $ =
            "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
          C =
            "M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z",
          x =
            "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
          V =
            "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
          M =
            "M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z",
          H = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
          A =
            "M18,17H10.5L12.5,15H18M6,17V14.5L13.88,6.65C14.07,6.45 14.39,6.45 14.59,6.65L16.35,8.41C16.55,8.61 16.55,8.92 16.35,9.12L8.47,17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z",
          w =
            "M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z",
          L = (e) => e.preventDefault();
        (0, a.Z)(
          [(0, c.Mo)("ha-automation-action-choose")],
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
                  decorators: [(0, c.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)({ attribute: !1 })],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, c.Cb)()],
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, c.SB)()],
                  key: "_showDefault",
                  value: () => !1,
                },
                {
                  kind: "field",
                  decorators: [(0, c.SB)()],
                  key: "_expandedStates",
                  value: () => [],
                },
                {
                  kind: "field",
                  decorators: [
                    (0, c.SB)(),
                    (0, s.F)({ context: f.we, subscribe: !0 }),
                  ],
                  key: "_entityReg",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [
                    (0, c.SB)(),
                    (0, s.F)({ context: _.T, subscribe: !0 }),
                  ],
                  key: "_reorderMode",
                  value: void 0,
                },
                { kind: "field", key: "_expandLast", value: () => !1 },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { choose: [{ conditions: [], sequence: [] }] };
                  },
                },
                {
                  kind: "method",
                  key: "_expandedChanged",
                  value: function (e) {
                    (this._expandedStates = this._expandedStates.concat()),
                      (this._expandedStates[e.target.index] =
                        e.detail.expanded);
                  },
                },
                {
                  kind: "method",
                  key: "_getDescription",
                  value: function (e) {
                    const t = (0, u.r)(e.conditions);
                    if (!t || 0 === t.length)
                      return this.hass.localize(
                        "ui.panel.config.automation.editor.actions.type.choose.no_conditions"
                      );
                    let i = "";
                    return (
                      "string" == typeof t[0]
                        ? (i += t[0])
                        : (i += (0, m.m)(t[0], this.hass, this._entityReg)),
                      t.length > 1 &&
                        (i += this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.option_description_additional",
                          { numberOfAdditionalConditions: t.length - 1 }
                        )),
                      i
                    );
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e, t, i;
                    const a = this.action,
                      o = void 0 === this._reorderMode;
                    return l.dy` <ha-sortable handle-selector=".handle" .disabled="${!(
                      null !== (e = this._reorderMode) &&
                      void 0 !== e &&
                      e.active
                    )}" group="choose-options" .path="${[
                      ...(null !== (t = this.path) && void 0 !== t ? t : []),
                      "choose",
                    ]}"> <div class="options"> ${(0, h.r)(
                      a.choose ? (0, u.r)(a.choose) : [],
                      (e) => e,
                      (e, t) => {
                        var i, a, n;
                        return l.dy` <div class="option"> <ha-card> <ha-expansion-panel .index="${t}" leftChevron @expanded-changed="${
                          this._expandedChanged
                        }"> <h3 slot="header"> ${this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.option",
                          { number: t + 1 }
                        )}: ${
                          e.alias ||
                          (this._expandedStates[t]
                            ? ""
                            : this._getDescription(e))
                        } </h3> ${
                          null !== (i = this._reorderMode) &&
                          void 0 !== i &&
                          i.active
                            ? l.dy` <ha-icon-button .index="${t}" slot="icons" .label="${this.hass.localize(
                                "ui.panel.config.automation.editor.move_up"
                              )}" .path="${$}" @click="${
                                this._moveUp
                              }" .disabled="${
                                0 === t
                              }"></ha-icon-button> <ha-icon-button .index="${t}" slot="icons" .label="${this.hass.localize(
                                "ui.panel.config.automation.editor.move_down"
                              )}" .path="${b}" @click="${
                                this._moveDown
                              }" .disabled="${
                                t === (0, u.r)(this.action.choose).length - 1
                              }"></ha-icon-button> <div class="handle" slot="icons"> <ha-svg-icon .path="${M}"></ha-svg-icon> </div> `
                            : l.dy` <ha-button-menu slot="icons" .idx="${t}" @action="${
                                this._handleAction
                              }" @click="${L}" fixed> <ha-icon-button slot="trigger" .label="${this.hass.localize(
                                "ui.common.menu"
                              )}" .path="${V}"></ha-icon-button> <mwc-list-item graphic="icon" .disabled="${
                                this.disabled
                              }"> ${this.hass.localize(
                                "ui.panel.config.automation.editor.actions.rename"
                              )} <ha-svg-icon slot="graphic" .path="${A}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                                this.disabled
                              }" class="${(0, r.$)({
                                hidden: o,
                              })}"> ${this.hass.localize(
                                "ui.panel.config.automation.editor.actions.re_order"
                              )} <ha-svg-icon slot="graphic" .path="${w}"></ha-svg-icon> </mwc-list-item> <mwc-list-item graphic="icon" .disabled="${
                                this.disabled
                              }"> ${this.hass.localize(
                                "ui.panel.config.automation.editor.actions.duplicate"
                              )} <ha-svg-icon slot="graphic" .path="${C}"></ha-svg-icon> </mwc-list-item> <mwc-list-item class="warning" graphic="icon" .disabled="${
                                this.disabled
                              }"> ${this.hass.localize(
                                "ui.panel.config.automation.editor.actions.type.choose.remove_option"
                              )} <ha-svg-icon class="warning" slot="graphic" .path="${x}"></ha-svg-icon> </mwc-list-item> </ha-button-menu> `
                        } <div class="card-content"> <h4> ${this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.conditions"
                        )}: </h4> <ha-automation-condition .path="${[
                          ...(null !== (a = this.path) && void 0 !== a
                            ? a
                            : []),
                          "choose",
                          t,
                          "conditions",
                        ]}" .conditions="${(0, u.r)(
                          e.conditions
                        )}" .disabled="${this.disabled}" .hass="${
                          this.hass
                        }" .idx="${t}" @value-changed="${
                          this._conditionChanged
                        }"></ha-automation-condition> <h4> ${this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.sequence"
                        )}: </h4> <ha-automation-action .path="${[
                          ...(null !== (n = this.path) && void 0 !== n
                            ? n
                            : []),
                          "choose",
                          t,
                          "sequence",
                        ]}" .actions="${
                          (0, u.r)(e.sequence) || []
                        }" .disabled="${this.disabled}" .hass="${
                          this.hass
                        }" .idx="${t}" @value-changed="${
                          this._actionChanged
                        }"></ha-automation-action> </div> </ha-expansion-panel> </ha-card> </div> `;
                      }
                    )} </div> </ha-sortable> <ha-button outlined .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.choose.add_option"
                    )}" .disabled="${this.disabled}" @click="${
                      this._addOption
                    }"> <ha-svg-icon .path="${H}" slot="icon"></ha-svg-icon> </ha-button> ${
                      this._showDefault || a.default
                        ? l.dy` <h2> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.choose.default"
                          )}: </h2> <ha-automation-action .path="${[
                            ...(null !== (i = this.path) && void 0 !== i
                              ? i
                              : []),
                            "choose",
                            "default",
                          ]}" .actions="${
                            (0, u.r)(a.default) || []
                          }" .disabled="${this.disabled}" @value-changed="${
                            this._defaultChanged
                          }" .hass="${this.hass}"></ha-automation-action> `
                        : l.dy`<div class="link-button-row"> <button class="link" @click="${
                            this._addDefault
                          }" .disabled="${this.disabled}"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.choose.add_default"
                          )} </button> </div>`
                    } `;
                  },
                },
                {
                  kind: "method",
                  key: "_handleAction",
                  value: async function (e) {
                    var t;
                    switch (e.detail.index) {
                      case 0:
                        await this._renameAction(e);
                        break;
                      case 1:
                        null === (t = this._reorderMode) ||
                          void 0 === t ||
                          t.enter();
                        break;
                      case 2:
                        this._duplicateOption(e);
                        break;
                      case 3:
                        this._removeOption(e);
                    }
                  },
                },
                {
                  kind: "method",
                  key: "_renameAction",
                  value: async function (e) {
                    const t = e.target.idx,
                      i = this.action.choose
                        ? [...(0, u.r)(this.action.choose)]
                        : [],
                      a = i[t],
                      o = await (0, y.D9)(this, {
                        title: this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.change_alias"
                        ),
                        inputLabel: this.hass.localize(
                          "ui.panel.config.automation.editor.actions.type.choose.alias"
                        ),
                        inputType: "string",
                        placeholder: (0, p.f)(this._getDescription(a)),
                        defaultValue: a.alias,
                        confirmText: this.hass.localize("ui.common.submit"),
                      });
                    null !== o &&
                      ("" === o ? delete i[t].alias : (i[t].alias = o),
                      (0, v.B)(this, "value-changed", {
                        value: { ...this.action, choose: i },
                      }));
                  },
                },
                {
                  kind: "method",
                  key: "_duplicateOption",
                  value: function (e) {
                    const t = e.target.idx;
                    this._createOption(
                      (0, d.Z)((0, u.r)(this.action.choose)[t])
                    );
                  },
                },
                {
                  kind: "method",
                  key: "firstUpdated",
                  value: function () {
                    (0, u.r)(this.action.choose).forEach(() =>
                      this._expandedStates.push(!1)
                    );
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    if (
                      ((0, o.Z)((0, n.Z)(i.prototype), "updated", this).call(
                        this,
                        e
                      ),
                      this._expandLast)
                    ) {
                      const e =
                        this.shadowRoot.querySelectorAll("ha-expansion-panel");
                      (e[e.length - 1].expanded = !0), (this._expandLast = !1);
                    }
                  },
                },
                {
                  kind: "method",
                  key: "_addDefault",
                  value: function () {
                    this._showDefault = !0;
                  },
                },
                {
                  kind: "method",
                  key: "_conditionChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value,
                      i = e.target.idx,
                      a = this.action.choose
                        ? [...(0, u.r)(this.action.choose)]
                        : [];
                    (a[i].conditions = t),
                      (0, v.B)(this, "value-changed", {
                        value: { ...this.action, choose: a },
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_actionChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value,
                      i = e.target.idx,
                      a = this.action.choose
                        ? [...(0, u.r)(this.action.choose)]
                        : [];
                    (a[i].sequence = t),
                      (0, v.B)(this, "value-changed", {
                        value: { ...this.action, choose: a },
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_addOption",
                  value: function () {
                    this._createOption({ conditions: [], sequence: [] });
                  },
                },
                {
                  kind: "method",
                  key: "_createOption",
                  value: function (e) {
                    const t = this.action.choose
                      ? [...(0, u.r)(this.action.choose)]
                      : [];
                    t.push(e),
                      (0, v.B)(this, "value-changed", {
                        value: { ...this.action, choose: t },
                      }),
                      (this._expandLast = !0),
                      (this._expandedStates[t.length - 1] = !0);
                  },
                },
                {
                  kind: "method",
                  key: "_moveUp",
                  value: function (e) {
                    const t = e.target.index,
                      i = t - 1;
                    this._move(t, i);
                  },
                },
                {
                  kind: "method",
                  key: "_moveDown",
                  value: function (e) {
                    const t = e.target.index,
                      i = t + 1;
                    this._move(t, i);
                  },
                },
                {
                  kind: "method",
                  key: "_move",
                  value: function (e, t) {
                    const i = (0, u.r)(this.action.choose).concat(),
                      a = i.splice(e, 1)[0];
                    i.splice(t, 0, a);
                    const o = this._expandedStates.splice(e, 1)[0];
                    this._expandedStates.splice(t, 0, o),
                      (0, v.B)(this, "value-changed", {
                        value: { ...this.action, choose: i },
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_removeOption",
                  value: function (e) {
                    const t = e.target.idx;
                    (0, y.g7)(this, {
                      title: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.type.choose.delete_confirm_title"
                      ),
                      text: this.hass.localize(
                        "ui.panel.config.automation.editor.actions.delete_confirm_text"
                      ),
                      dismissText: this.hass.localize("ui.common.cancel"),
                      confirmText: this.hass.localize("ui.common.delete"),
                      destructive: !0,
                      confirm: () => {
                        const e = this.action.choose
                          ? [...(0, u.r)(this.action.choose)]
                          : [];
                        e.splice(t, 1),
                          this._expandedStates.splice(t, 1),
                          (0, v.B)(this, "value-changed", {
                            value: { ...this.action, choose: e },
                          });
                      },
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_defaultChanged",
                  value: function (e) {
                    e.stopPropagation(), (this._showDefault = !0);
                    const t = e.detail.value,
                      i = { ...this.action, default: t };
                    0 === t.length && delete i.default,
                      (0, v.B)(this, "value-changed", { value: i });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [
                      g.Qx,
                      l.iv`.option{margin:0 0 16px 0}.add-card mwc-button{display:block;text-align:center}ha-expansion-panel{--expansion-panel-summary-padding:0 0 0 8px;--expansion-panel-content-padding:0}mwc-list-item[disabled]{--mdc-theme-text-primary-on-background:var(--disabled-text-color)}mwc-list-item.hidden{display:none}h3{margin:0;font-size:inherit;font-weight:inherit}ha-icon-button{inset-inline-start:initial;inset-inline-end:0;direction:var(--direction)}ha-svg-icon{height:20px}.link-button-row{padding:14px 14px 0 14px}.card-content{padding:0 16px 16px 16px}.handle{padding:12px;cursor:move;cursor:grab}.handle ha-svg-icon{pointer-events:none;height:24px}`,
                    ];
                  },
                },
              ],
            };
          },
          l.oi
        );
        t();
      } catch (e) {
        t(e);
      }
    });
  },
  41992: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(14516),
          d = i(18394),
          l = i(28858),
          c = (i(71133), i(41090)),
          r = i(38514),
          h = e([r]);
        r = (h.then ? (await h)() : h)[0];
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-condition")],
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
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { condition: "state" };
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return o.dy` <ha-select fixedMenuPosition .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.conditions.type_select"
                    )}" .disabled="${this.disabled}" .value="${
                      this.action.condition
                    }" naturalMenuWidth @selected="${
                      this._typeChanged
                    }"> ${this._processedTypes(this.hass.localize).map(
                      ([e, t, i]) =>
                        o.dy` <mwc-list-item .value="${e}" graphic="icon"> ${t}<ha-svg-icon slot="graphic" .path="${i}"></ha-svg-icon></mwc-list-item> `
                    )} </ha-select> <ha-automation-condition-editor .condition="${
                      this.action
                    }" .disabled="${this.disabled}" .hass="${
                      this.hass
                    }" @value-changed="${
                      this._conditionChanged
                    }"></ha-automation-condition-editor> `;
                  },
                },
                {
                  kind: "field",
                  key: "_processedTypes",
                  value() {
                    return (0, s.Z)((e) =>
                      Object.entries(c.L)
                        .map(([t, i]) => [
                          t,
                          e(
                            `ui.panel.config.automation.editor.conditions.type.${t}.label`
                          ),
                          i,
                        ])
                        .sort((e, t) =>
                          (0, l.$)(e[1], t[1], this.hass.locale.language)
                        )
                    );
                  },
                },
                {
                  kind: "method",
                  key: "_conditionChanged",
                  value: function (e) {
                    e.stopPropagation(),
                      (0, d.B)(this, "value-changed", {
                        value: e.detail.value,
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_typeChanged",
                  value: function (e) {
                    const t = e.target.value;
                    if (!t) return;
                    const i = customElements.get(
                      `ha-automation-condition-${t}`
                    );
                    t !== this.action.condition &&
                      (0, d.B)(this, "value-changed", {
                        value: { condition: t, ...i.defaultConfig },
                      });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return o.iv`ha-select{margin-bottom:24px}`;
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
  32501: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(18394),
      d = i(13426),
      l = (i(92353), i(27959));
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-delay")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_timeData",
              value: void 0,
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return { delay: "" };
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                e.has("action") &&
                  (this.action && (0, d._)(this.action)
                    ? (0, s.B)(
                        this,
                        "ui-mode-not-available",
                        Error(
                          this.hass.localize(
                            "ui.errors.config.no_template_editor_support"
                          )
                        )
                      )
                    : (this._timeData = (0, l.c)(this.action.delay)));
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy`<ha-duration-input .label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.delay.delay"
                )}" .disabled="${this.disabled}" .data="${
                  this._timeData
                }" enableMillisecond @value-changed="${
                  this._valueChanged
                }"></ha-duration-input>`;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                e.stopPropagation();
                const t = e.detail.value;
                t &&
                  (0, s.B)(this, "value-changed", {
                    value: { ...this.action, delay: t },
                  });
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  69645: (e, t, i) => {
    var a = i(309),
      o = i(22264),
      n = i(5095),
      s = i(95260),
      d = i(14516),
      l = i(18394),
      c = i(25917),
      r = i(7748);
    (0, a.Z)(
      [(0, s.Mo)("ha-device-action-picker")],
      function (e, t) {
        return {
          F: class extends t {
            constructor() {
              super(c._2, c.AG, (e) => ({
                device_id: e || "",
                domain: "",
                entity_id: "",
              })),
                e(this);
            }
          },
          d: [
            {
              kind: "get",
              key: "NO_AUTOMATION_TEXT",
              value: function () {
                return this.hass.localize(
                  "ui.panel.config.devices.automation.actions.no_actions"
                );
              },
            },
            {
              kind: "get",
              key: "UNKNOWN_AUTOMATION_TEXT",
              value: function () {
                return this.hass.localize(
                  "ui.panel.config.devices.automation.actions.unknown_action"
                );
              },
            },
          ],
        };
      },
      r.g
    );
    i(27056), i(39663);
    var h = i(38149);
    (0, a.Z)(
      [(0, s.Mo)("ha-automation-action-device_id")],
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
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Object })],
              key: "action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_deviceId",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_capabilities",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, s.SB)(),
                (0, o.F)({ context: h.we, subscribe: !0 }),
              ],
              key: "_entityReg",
              value: void 0,
            },
            { kind: "field", key: "_origAction", value: void 0 },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return { device_id: "", domain: "", entity_id: "" };
              },
            },
            {
              kind: "field",
              key: "_extraFieldsData",
              value: () =>
                (0, d.Z)((e, t) => {
                  const i = {};
                  return (
                    t.extra_fields.forEach((t) => {
                      void 0 !== e[t.name] && (i[t.name] = e[t.name]);
                    }),
                    i
                  );
                }),
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                const t = this._deviceId || this.action.device_id;
                return n.dy` <ha-device-picker .value="${t}" .disabled="${
                  this.disabled
                }" @value-changed="${this._devicePicked}" .hass="${
                  this.hass
                }" label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.device_id.label"
                )}"></ha-device-picker> <ha-device-action-picker .value="${
                  this.action
                }" .deviceId="${t}" .disabled="${
                  this.disabled
                }" @value-changed="${this._deviceActionPicked}" .hass="${
                  this.hass
                }" label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.device_id.action"
                )}"></ha-device-action-picker> ${
                  null !== (e = this._capabilities) &&
                  void 0 !== e &&
                  null !== (e = e.extra_fields) &&
                  void 0 !== e &&
                  e.length
                    ? n.dy` <ha-form .hass="${
                        this.hass
                      }" .data="${this._extraFieldsData(
                        this.action,
                        this._capabilities
                      )}" .schema="${
                        this._capabilities.extra_fields
                      }" .disabled="${
                        this.disabled
                      }" .computeLabel="${this._extraFieldsComputeLabelCallback(
                        this.hass.localize
                      )}" @value-changed="${
                        this._extraFieldsChanged
                      }"></ha-form> `
                    : ""
                } `;
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function () {
                this._capabilities || this._getCapabilities(),
                  this.action && (this._origAction = this.action);
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                const t = e.get("action");
                t &&
                  !(0, c.hH)(this._entityReg, t, this.action) &&
                  ((this._deviceId = void 0), this._getCapabilities());
              },
            },
            {
              kind: "method",
              key: "_getCapabilities",
              value: async function () {
                this._capabilities = this.action.domain
                  ? await (0, c._K)(this.hass, this.action)
                  : void 0;
              },
            },
            {
              kind: "method",
              key: "_devicePicked",
              value: function (e) {
                e.stopPropagation(),
                  (this._deviceId = e.target.value),
                  void 0 === this._deviceId &&
                    (0, l.B)(this, "value-changed", { value: i.defaultConfig });
              },
            },
            {
              kind: "method",
              key: "_deviceActionPicked",
              value: function (e) {
                e.stopPropagation();
                let t = e.detail.value;
                this._origAction &&
                  (0, c.hH)(this._entityReg, this._origAction, t) &&
                  (t = this._origAction),
                  (0, l.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "method",
              key: "_extraFieldsChanged",
              value: function (e) {
                e.stopPropagation(),
                  (0, l.B)(this, "value-changed", {
                    value: { ...this.action, ...e.detail.value },
                  });
              },
            },
            {
              kind: "method",
              key: "_extraFieldsComputeLabelCallback",
              value: function (e) {
                return (t) =>
                  e(
                    `ui.panel.config.automation.editor.actions.type.device_id.extra_fields.${t.name}`
                  ) || t.name;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                n.iv`ha-device-picker{display:block;margin-bottom:24px}ha-device-action-picker{display:block}ha-form{display:block;margin-top:24px}`,
            },
          ],
        };
      },
      n.oi
    );
  },
  52668: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(18394),
          d = (i(91998), i(52910), i(51520), i(80392), i(63602)),
          l = e([d]);
        d = (l.then ? (await l)() : l)[0];
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-event")],
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
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.IO)("ha-yaml-editor", !0)],
                  key: "_yamlEditor",
                  value: void 0,
                },
                { kind: "field", key: "_actionData", value: void 0 },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { event: "", event_data: {} };
                  },
                },
                {
                  kind: "method",
                  key: "updated",
                  value: function (e) {
                    e.has("action") &&
                      (this._actionData &&
                        this._actionData !== this.action.event_data &&
                        this._yamlEditor &&
                        this._yamlEditor.setValue(this.action.event_data),
                      (this._actionData = this.action.event_data));
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    const { event: e, event_data: t } = this.action;
                    return o.dy` <ha-textfield .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.event.event"
                    )}" .value="${e}" .disabled="${this.disabled}" @change="${
                      this._eventChanged
                    }"></ha-textfield> <ha-yaml-editor .hass="${
                      this.hass
                    }" .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.event.event_data"
                    )}" .name="${"event_data"}" .readOnly="${
                      this.disabled
                    }" .defaultValue="${t}" @value-changed="${
                      this._dataChanged
                    }"></ha-yaml-editor> `;
                  },
                },
                {
                  kind: "method",
                  key: "_dataChanged",
                  value: function (e) {
                    e.stopPropagation(),
                      e.detail.isValid &&
                        ((this._actionData = e.detail.value),
                        (0, d.a0)(this, e));
                  },
                },
                {
                  kind: "method",
                  key: "_eventChanged",
                  value: function (e) {
                    e.stopPropagation(),
                      (0, s.B)(this, "value-changed", {
                        value: { ...this.action, event: e.target.value },
                      });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return o.iv`ha-textfield{display:block}`;
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
  94824: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(18394),
          d = (i(51520), i(29950)),
          l = i(48866),
          c = e([l]);
        l = (c.then ? (await c)() : c)[0];
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-if")],
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
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.SB)()],
                  key: "_showElse",
                  value: () => !1,
                },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { if: [], then: [] };
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e, t, i;
                    const a = this.action;
                    return o.dy` <h3> ${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.if.if"
                    )}*: </h3> <ha-automation-condition .path="${[
                      ...(null !== (e = this.path) && void 0 !== e ? e : []),
                      "if",
                    ]}" .conditions="${a.if}" .disabled="${
                      this.disabled
                    }" @value-changed="${this._ifChanged}" .hass="${
                      this.hass
                    }"></ha-automation-condition> <h3> ${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.if.then"
                    )}*: </h3> <ha-automation-action .path="${[
                      ...(null !== (t = this.path) && void 0 !== t ? t : []),
                      "then",
                    ]}" .actions="${a.then}" .disabled="${
                      this.disabled
                    }" @value-changed="${this._thenChanged}" .hass="${
                      this.hass
                    }"></ha-automation-action> ${
                      this._showElse || a.else
                        ? o.dy` <h3> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.if.else"
                          )}: </h3> <ha-automation-action .path="${[
                            ...(null !== (i = this.path) && void 0 !== i
                              ? i
                              : []),
                            "else",
                          ]}" .actions="${a.else || []}" .disabled="${
                            this.disabled
                          }" @value-changed="${this._elseChanged}" .hass="${
                            this.hass
                          }"></ha-automation-action> `
                        : o.dy` <div class="link-button-row"> <button class="link" @click="${
                            this._addElse
                          }" .disabled="${this.disabled}"> ${this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.if.add_else"
                          )} </button> </div>`
                    } `;
                  },
                },
                {
                  kind: "method",
                  key: "_addElse",
                  value: function () {
                    this._showElse = !0;
                  },
                },
                {
                  kind: "method",
                  key: "_ifChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value;
                    (0, s.B)(this, "value-changed", {
                      value: { ...this.action, if: t },
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_thenChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value;
                    (0, s.B)(this, "value-changed", {
                      value: { ...this.action, then: t },
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_elseChanged",
                  value: function (e) {
                    e.stopPropagation(), (this._showElse = !0);
                    const t = e.detail.value,
                      i = { ...this.action, else: t };
                    0 === t.length && delete i.else,
                      (0, s.B)(this, "value-changed", { value: i });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [d.Qx, o.iv`.link-button-row{padding:14px}`];
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
  15787: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(18394),
          d = (i(51520), i(29950)),
          l = i(48866),
          c = e([l]);
        l = (c.then ? (await c)() : c)[0];
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-parallel")],
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
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { parallel: [] };
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e;
                    const t = this.action;
                    return o.dy` <ha-automation-action .path="${[
                      ...(null !== (e = this.path) && void 0 !== e ? e : []),
                      "parallel",
                    ]}" .actions="${t.parallel}" .disabled="${
                      this.disabled
                    }" @value-changed="${this._actionsChanged}" .hass="${
                      this.hass
                    }"></ha-automation-action> `;
                  },
                },
                {
                  kind: "method",
                  key: "_actionsChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value;
                    (0, s.B)(this, "value-changed", {
                      value: { ...this.action, parallel: t },
                    });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return d.Qx;
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
  49368: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(14516),
      d = i(18394);
    i(39624);
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-play_media")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return {
                  service: "media_player.play_media",
                  target: { entity_id: "" },
                  data: { media_content_id: "", media_content_type: "" },
                  metadata: {},
                };
              },
            },
            {
              kind: "field",
              key: "_getSelectorValue",
              value: () =>
                (0, s.Z)((e) => {
                  var t, i, a;
                  return {
                    entity_id:
                      (null === (t = e.target) || void 0 === t
                        ? void 0
                        : t.entity_id) || e.entity_id,
                    media_content_id:
                      null === (i = e.data) || void 0 === i
                        ? void 0
                        : i.media_content_id,
                    media_content_type:
                      null === (a = e.data) || void 0 === a
                        ? void 0
                        : a.media_content_type,
                    metadata: e.metadata,
                  };
                }),
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-selector-media .hass="${
                  this.hass
                }" .disabled="${
                  this.disabled
                }" .value="${this._getSelectorValue(
                  this.action
                )}" @value-changed="${
                  this._valueChanged
                }"></ha-selector-media> `;
              },
            },
            {
              kind: "method",
              key: "_valueChanged",
              value: function (e) {
                e.stopPropagation(),
                  (0, d.B)(this, "value-changed", {
                    value: {
                      ...this.action,
                      service: "media_player.play_media",
                      target: { entity_id: e.detail.value.entity_id },
                      data: {
                        media_content_id: e.detail.value.media_content_id,
                        media_content_type: e.detail.value.media_content_type,
                      },
                      metadata: e.detail.value.metadata || {},
                    },
                  });
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  66873: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(14516),
          d = i(18394),
          l = (i(51520), i(29950)),
          c = i(48866),
          r = i(13426),
          h = (i(39663), e([c]));
        c = (h.then ? (await h)() : h)[0];
        const u = ["count", "while", "until", "for_each"],
          v = (e) => u.find((t) => t in e);
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-repeat")],
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
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "action",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)()],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { repeat: { count: 2, sequence: [] } };
                  },
                },
                {
                  kind: "field",
                  key: "_schema",
                  value: () =>
                    (0, s.Z)((e, t, i, a) => [
                      {
                        name: "type",
                        selector: {
                          select: {
                            mode: "dropdown",
                            options: u.map((t) => ({
                              value: t,
                              label: e(
                                `ui.panel.config.automation.editor.actions.type.repeat.type.${t}.label`
                              ),
                            })),
                          },
                        },
                      },
                      ...("count" === t
                        ? [
                            {
                              name: "count",
                              required: !0,
                              selector: i
                                ? { template: {} }
                                : { number: { mode: "box", min: 1 } },
                            },
                          ]
                        : []),
                      ...("until" === t || "while" === t
                        ? [
                            {
                              name: t,
                              selector: {
                                condition: {
                                  path: [...(null != a ? a : []), "repeat", t],
                                },
                              },
                            },
                          ]
                        : []),
                      ...("for_each" === t
                        ? [
                            {
                              name: "for_each",
                              required: !0,
                              selector: { object: {} },
                            },
                          ]
                        : []),
                      {
                        name: "sequence",
                        selector: {
                          action: {
                            path: [
                              ...(null != a ? a : []),
                              "repeat",
                              "sequence",
                            ],
                          },
                        },
                      },
                    ]),
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    const e = this.action.repeat,
                      t = v(e),
                      i = this._schema(
                        this.hass.localize,
                        null != t ? t : "count",
                        "count" in e &&
                          "string" == typeof e.count &&
                          (0, r.J)(e.count),
                        this.path
                      ),
                      a = { ...e, type: t };
                    return o.dy`<ha-form .hass="${this.hass}" .data="${a}" .schema="${i}" .disabled="${this.disabled}" @value-changed="${this._valueChanged}" .computeLabel="${this._computeLabelCallback}"></ha-form>`;
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value,
                      i = t.type;
                    delete t.type;
                    if (i !== v(this.action.repeat)) {
                      var a, o;
                      if (
                        ("count" === i &&
                          ((t.count = 2),
                          delete t.while,
                          delete t.until,
                          delete t.for_each),
                        "while" === i)
                      )
                        (t.while =
                          null !== (a = t.until) && void 0 !== a ? a : []),
                          delete t.count,
                          delete t.until,
                          delete t.for_each;
                      if ("until" === i)
                        (t.until =
                          null !== (o = t.while) && void 0 !== o ? o : []),
                          delete t.count,
                          delete t.while,
                          delete t.for_each;
                      "for_each" === i &&
                        ((t.for_each = {}),
                        delete t.count,
                        delete t.while,
                        delete t.until);
                    }
                    (0, d.B)(this, "value-changed", {
                      value: { ...this.action, repeat: { ...t } },
                    });
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return [l.Qx, o.iv`ha-textfield{margin-top:16px}`];
                  },
                },
                {
                  kind: "field",
                  key: "_computeLabelCallback",
                  value() {
                    return (e) => {
                      switch (e.name) {
                        case "type":
                          return this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.repeat.type_select"
                          );
                        case "count":
                          return this.hass.localize(
                            "ui.panel.config.automation.editor.actions.type.repeat.type.count.label"
                          );
                        case "while":
                          return (
                            this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.repeat.type.while.conditions"
                            ) + ":"
                          );
                        case "until":
                          return (
                            this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.repeat.type.until.conditions"
                            ) + ":"
                          );
                        case "for_each":
                          return (
                            this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.repeat.type.for_each.items"
                            ) + ":"
                          );
                        case "sequence":
                          return (
                            this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.repeat.sequence"
                            ) + ":"
                          );
                      }
                      return "";
                    };
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
  1794: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(14516),
      d = i(38768),
      l = i(18394),
      c = i(36655),
      r = i(44672),
      h = i(13426),
      u = (i(84871), i(11420));
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-service")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "action",
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
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_responseChecked",
              value: () => !1,
            },
            {
              kind: "field",
              key: "_fields",
              value: () =>
                (0, s.Z)((e, t) => {
                  if (!t) return { fields: {} };
                  const i = (0, c.M)(t),
                    a = (0, r.p)(t);
                  return i in e && a in e[i]
                    ? { fields: e[i][a].fields }
                    : { fields: {} };
                }),
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return { service: "", data: {} };
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                var t;
                if (!e.has("action")) return;
                try {
                  (0, d.hu)(this.action, u.TL);
                } catch (e) {
                  return void (0, l.B)(this, "ui-mode-not-available", e);
                }
                const i = this._fields(
                  this.hass.services,
                  null === (t = this.action) || void 0 === t
                    ? void 0
                    : t.service
                ).fields;
                this.action &&
                (Object.entries(this.action).some(
                  ([e, t]) => "data" !== e && (0, h._)(t)
                ) ||
                  (this.action.data &&
                    Object.entries(this.action.data).some(([e, t]) => {
                      const a = i[e];
                      return (
                        (null == a ||
                          !a.selector ||
                          (!("template" in a.selector) &&
                            !("object" in a.selector))) &&
                        (0, h._)(t)
                      );
                    })))
                  ? (0, l.B)(
                      this,
                      "ui-mode-not-available",
                      Error(
                        this.hass.localize(
                          "ui.errors.config.no_template_editor_support"
                        )
                      )
                    )
                  : this.action.entity_id
                  ? ((this._action = {
                      ...this.action,
                      data: {
                        ...this.action.data,
                        entity_id: this.action.entity_id,
                      },
                    }),
                    delete this._action.entity_id)
                  : (this._action = this.action);
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, t;
                if (!this._action) return o.Ld;
                const [i, a] = this._action.service
                  ? this._action.service.split(".", 2)
                  : [void 0, void 0];
                return o.dy` <ha-service-control .narrow="${
                  this.narrow
                }" .hass="${this.hass}" .value="${this._action}" .disabled="${
                  this.disabled
                }" .showAdvanced="${
                  null === (e = this.hass.userData) || void 0 === e
                    ? void 0
                    : e.showAdvanced
                }" @value-changed="${
                  this._actionChanged
                }"></ha-service-control> ${
                  i &&
                  a &&
                  null !== (t = this.hass.services[i]) &&
                  void 0 !== t &&
                  null !== (t = t[a]) &&
                  void 0 !== t &&
                  t.response
                    ? o.dy`<ha-settings-row .narrow="${this.narrow}"> ${
                        this.hass.services[i][a].response.optional
                          ? o.dy`<ha-checkbox .checked="${
                              this._action.response_variable ||
                              this._responseChecked
                            }" .disabled="${this.disabled}" @change="${
                              this._responseCheckboxChanged
                            }" slot="prefix"></ha-checkbox>`
                          : o.dy`<div slot="prefix" class="checkbox-spacer"></div>`
                      } <span slot="heading">${this.hass.localize(
                        "ui.panel.config.automation.editor.actions.type.service.response_variable"
                      )}</span> <span slot="description"> ${
                        this.hass.services[i][a].response.optional
                          ? this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.service.has_optional_response"
                            )
                          : this.hass.localize(
                              "ui.panel.config.automation.editor.actions.type.service.has_response"
                            )
                      } </span> <ha-textfield .value="${
                        this._action.response_variable || ""
                      }" .required="${!this.hass.services[i][a].response
                        .optional}" .disabled="${
                        this.disabled ||
                        (this.hass.services[i][a].response.optional &&
                          !this._action.response_variable &&
                          !this._responseChecked)
                      }" @change="${
                        this._responseVariableChanged
                      }"></ha-textfield> </ha-settings-row>`
                    : o.Ld
                } `;
              },
            },
            {
              kind: "method",
              key: "_actionChanged",
              value: function (e) {
                e.detail.value === this._action && e.stopPropagation();
                const t = { ...this.action, ...e.detail.value };
                if ("response_variable" in this.action) {
                  var i;
                  const [e, a] = this._action.service
                    ? this._action.service.split(".", 2)
                    : [void 0, void 0];
                  e &&
                    a &&
                    null !== (i = this.hass.services[e]) &&
                    void 0 !== i &&
                    i[a] &&
                    !("response" in this.hass.services[e][a]) &&
                    (delete t.response_variable, (this._responseChecked = !1));
                }
                (0, l.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "method",
              key: "_responseVariableChanged",
              value: function (e) {
                const t = { ...this.action, response_variable: e.target.value };
                e.target.value || delete t.response_variable,
                  (0, l.B)(this, "value-changed", { value: t });
              },
            },
            {
              kind: "method",
              key: "_responseCheckboxChanged",
              value: function (e) {
                if (
                  ((this._responseChecked = e.target.checked),
                  !this._responseChecked)
                ) {
                  const e = { ...this.action };
                  delete e.response_variable,
                    (0, l.B)(this, "value-changed", { value: e });
                }
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`ha-service-control{display:block;margin:0 -16px}ha-settings-row{margin:0 -16px;padding:var(--service-control-padding,0 16px)}ha-settings-row{--paper-time-input-justify-content:flex-end;--settings-row-content-width:100%;--settings-row-prefix-display:contents;border-top:var(--service-control-items-border-top,1px solid var(--divider-color))}ha-checkbox{margin-left:-16px}.checkbox-spacer{width:32px}`;
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  98723: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260),
      s = i(18394);
    i(51520);
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-stop")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return { stop: "" };
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                const { error: e, stop: t, response_variable: i } = this.action;
                return o.dy` <ha-textfield .label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.stop.stop"
                )}" .value="${t}" .disabled="${this.disabled}" @change="${
                  this._stopChanged
                }"></ha-textfield> <ha-textfield .label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.stop.response_variable"
                )}" .value="${i || ""}" .disabled="${this.disabled}" @change="${
                  this._responseChanged
                }"></ha-textfield> <ha-formfield .disabled="${
                  this.disabled
                }" .label="${this.hass.localize(
                  "ui.panel.config.automation.editor.actions.type.stop.error"
                )}"> <ha-switch .disabled="${this.disabled}" .checked="${
                  null != e && e
                }" @change="${
                  this._errorChanged
                }"></ha-switch> </ha-formfield> `;
              },
            },
            {
              kind: "method",
              key: "_stopChanged",
              value: function (e) {
                e.stopPropagation(),
                  (0, s.B)(this, "value-changed", {
                    value: { ...this.action, stop: e.target.value },
                  });
              },
            },
            {
              kind: "method",
              key: "_responseChanged",
              value: function (e) {
                e.stopPropagation(),
                  (0, s.B)(this, "value-changed", {
                    value: {
                      ...this.action,
                      response_variable: e.target.value,
                    },
                  });
              },
            },
            {
              kind: "method",
              key: "_errorChanged",
              value: function (e) {
                e.stopPropagation(),
                  (0, s.B)(this, "value-changed", {
                    value: { ...this.action, error: e.target.checked },
                  });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`ha-textfield{display:block;margin-bottom:24px}`;
              },
            },
          ],
        };
      },
      o.oi
    );
  },
  29800: (e, t, i) => {
    i.a(e, async (e, t) => {
      try {
        var a = i(309),
          o = i(5095),
          n = i(95260),
          s = i(4771),
          d = i(27959),
          l = i(18394),
          c = (i(92353), i(48950), i(51520), i(41848)),
          r = i(63602),
          h = e([c, r]);
        [c, r] = h.then ? (await h)() : h;
        (0, a.Z)(
          [(0, n.Mo)("ha-automation-action-wait_for_trigger")],
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
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "hass",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "action",
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
                  decorators: [(0, n.Cb)({ attribute: !1 })],
                  key: "path",
                  value: void 0,
                },
                {
                  kind: "get",
                  static: !0,
                  key: "defaultConfig",
                  value: function () {
                    return { wait_for_trigger: [] };
                  },
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    var e, t;
                    const i = (0, d.c)(this.action.timeout);
                    return o.dy` <ha-duration-input .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.wait_for_trigger.timeout"
                    )}" .data="${i}" .disabled="${
                      this.disabled
                    }" enableMillisecond @value-changed="${
                      this._timeoutChanged
                    }"></ha-duration-input> <ha-formfield .disabled="${
                      this.disabled
                    }" .label="${this.hass.localize(
                      "ui.panel.config.automation.editor.actions.type.wait_for_trigger.continue_timeout"
                    )}"> <ha-switch .checked="${
                      null === (e = this.action.continue_on_timeout) ||
                      void 0 === e ||
                      e
                    }" .disabled="${this.disabled}" @change="${
                      this._continueChanged
                    }"></ha-switch> </ha-formfield> <ha-automation-trigger .path="${[
                      ...(null !== (t = this.path) && void 0 !== t ? t : []),
                      "wait_for_trigger",
                    ]}" .triggers="${(0, s.r)(
                      this.action.wait_for_trigger
                    )}" .hass="${this.hass}" .disabled="${
                      this.disabled
                    }" .name="${"wait_for_trigger"}" @value-changed="${
                      this._valueChanged
                    }"></ha-automation-trigger> `;
                  },
                },
                {
                  kind: "method",
                  key: "_timeoutChanged",
                  value: function (e) {
                    e.stopPropagation();
                    const t = e.detail.value;
                    t &&
                      (0, l.B)(this, "value-changed", {
                        value: { ...this.action, timeout: t },
                      });
                  },
                },
                {
                  kind: "method",
                  key: "_continueChanged",
                  value: function (e) {
                    (0, l.B)(this, "value-changed", {
                      value: {
                        ...this.action,
                        continue_on_timeout: e.target.checked,
                      },
                    });
                  },
                },
                {
                  kind: "method",
                  key: "_valueChanged",
                  value: function (e) {
                    (0, r.a0)(this, e);
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return o.iv`ha-duration-input{display:block;margin-bottom:24px}ha-automation-trigger{display:block;margin-top:24px}`;
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
  93972: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      n = i(95260);
    i(39663);
    const s = [
      { name: "wait_template", selector: { template: {} } },
      { name: "timeout", required: !1, selector: { text: {} } },
      { name: "continue_on_timeout", selector: { boolean: {} } },
    ];
    (0, a.Z)(
      [(0, n.Mo)("ha-automation-action-wait_template")],
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
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "action",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "get",
              static: !0,
              key: "defaultConfig",
              value: function () {
                return { wait_template: "", continue_on_timeout: !0 };
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <ha-form .hass="${this.hass}" .data="${this.action}" .schema="${s}" .disabled="${this.disabled}" .computeLabel="${this._computeLabelCallback}"></ha-form> `;
              },
            },
            {
              kind: "field",
              key: "_computeLabelCallback",
              value() {
                return (e) =>
                  this.hass.localize(
                    `ui.panel.config.automation.editor.actions.type.wait_template.${
                      "continue_on_timeout" === e.name
                        ? "continue_timeout"
                        : e.name
                    }`
                  );
              },
            },
          ],
        };
      },
      o.oi
    );
  },
};
//# sourceMappingURL=4993.javO8Sf4lOI.js.map
