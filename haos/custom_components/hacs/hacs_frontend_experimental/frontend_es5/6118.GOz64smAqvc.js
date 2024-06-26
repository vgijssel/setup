"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [6118],
  {
    92353: function (e, i, t) {
      var n,
        a = t(88962),
        o = t(33368),
        d = t(71650),
        r = t(68308),
        s = t(82390),
        u = t(69205),
        l = t(91808),
        c = (t(97393), t(76843), t(85717), t(5095)),
        h = t(95260),
        f = t(18394);
      t(64106),
        (0, l.Z)(
          [(0, h.Mo)("ha-duration-input")],
          function (e, i) {
            var t = (function (i) {
              function t() {
                var i;
                (0, d.Z)(this, t);
                for (
                  var n = arguments.length, a = new Array(n), o = 0;
                  o < n;
                  o++
                )
                  a[o] = arguments[o];
                return (i = (0, r.Z)(this, t, [].concat(a))), e((0, s.Z)(i)), i;
              }
              return (0, u.Z)(t, i), (0, o.Z)(t);
            })(i);
            return {
              F: t,
              d: [
                {
                  kind: "field",
                  decorators: [(0, h.Cb)({ attribute: !1 })],
                  key: "data",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)()],
                  key: "helper",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)({ type: Boolean })],
                  key: "required",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)({ type: Boolean })],
                  key: "enableMillisecond",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)({ type: Boolean })],
                  key: "enableDay",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, h.Cb)({ type: Boolean })],
                  key: "disabled",
                  value: function () {
                    return !1;
                  },
                },
                {
                  kind: "field",
                  decorators: [(0, h.IO)("paper-time-input", !0)],
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
                    return (0, c.dy)(
                      n ||
                        (n = (0, a.Z)([
                          ' <ha-base-time-input .label="',
                          '" .helper="',
                          '" .required="',
                          '" .autoValidate="',
                          '" .disabled="',
                          '" errorMessage="Required" enableSecond .enableMillisecond="',
                          '" .enableDay="',
                          '" format="24" .days="',
                          '" .hours="',
                          '" .minutes="',
                          '" .seconds="',
                          '" .milliseconds="',
                          '" @value-changed="',
                          '" noHoursLimit dayLabel="dd" hourLabel="hh" minLabel="mm" secLabel="ss" millisecLabel="ms"></ha-base-time-input> ',
                        ])),
                      this.label,
                      this.helper,
                      this.required,
                      this.required,
                      this.disabled,
                      this.enableMillisecond,
                      this.enableDay,
                      this._days,
                      this._hours,
                      this._minutes,
                      this._seconds,
                      this._milliseconds,
                      this._durationChanged
                    );
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
                    var i,
                      t = Object.assign({}, e.detail.value);
                    (this.enableMillisecond || t.milliseconds
                      ? t.milliseconds > 999 &&
                        ((t.seconds += Math.floor(t.milliseconds / 1e3)),
                        (t.milliseconds %= 1e3))
                      : delete t.milliseconds,
                    t.seconds > 59 &&
                      ((t.minutes += Math.floor(t.seconds / 60)),
                      (t.seconds %= 60)),
                    t.minutes > 59 &&
                      ((t.hours += Math.floor(t.minutes / 60)),
                      (t.minutes %= 60)),
                    this.enableDay && t.hours > 24) &&
                      ((t.days =
                        (null !== (i = t.days) && void 0 !== i ? i : 0) +
                        Math.floor(t.hours / 24)),
                      (t.hours %= 24));
                    (0, f.B)(this, "value-changed", { value: t });
                  },
                },
              ],
            };
          },
          c.oi
        );
    },
    76255: function (e, i, t) {
      t.r(i),
        t.d(i, {
          HaFormTimePeriod: function () {
            return f;
          },
        });
      var n,
        a = t(88962),
        o = t(33368),
        d = t(71650),
        r = t(68308),
        s = t(82390),
        u = t(69205),
        l = t(91808),
        c = (t(97393), t(5095)),
        h = t(95260),
        f =
          (t(92353),
          (0, l.Z)(
            [(0, h.Mo)("ha-form-positive_time_period_dict")],
            function (e, i) {
              var t = (function (i) {
                function t() {
                  var i;
                  (0, d.Z)(this, t);
                  for (
                    var n = arguments.length, a = new Array(n), o = 0;
                    o < n;
                    o++
                  )
                    a[o] = arguments[o];
                  return (
                    (i = (0, r.Z)(this, t, [].concat(a))), e((0, s.Z)(i)), i
                  );
                }
                return (0, u.Z)(t, i), (0, o.Z)(t);
              })(i);
              return {
                F: t,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "schema",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "data",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)()],
                    key: "label",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ type: Boolean })],
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.IO)("ha-time-input", !0)],
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
                      return (0, c.dy)(
                        n ||
                          (n = (0, a.Z)([
                            ' <ha-duration-input .label="',
                            '" ?required="',
                            '" .data="',
                            '" .disabled="',
                            '"></ha-duration-input> ',
                          ])),
                        this.label,
                        this.schema.required,
                        this.data,
                        this.disabled
                      );
                    },
                  },
                ],
              };
            },
            c.oi
          ));
    },
    93892: function (e, i, t) {
      var n = t(97673),
        a = t(11336),
        o = t(43313),
        d = RangeError;
      e.exports = function (e) {
        var i = a(o(this)),
          t = "",
          r = n(e);
        if (r < 0 || r === 1 / 0) throw new d("Wrong number of repetitions");
        for (; r > 0; (r >>>= 1) && (i += i)) 1 & r && (t += i);
        return t;
      };
    },
  },
]);
//# sourceMappingURL=6118.GOz64smAqvc.js.map
