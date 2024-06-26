"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1794],
  {
    92353: function (e, i, n) {
      var t,
        a = n(88962),
        r = n(33368),
        o = n(71650),
        d = n(68308),
        s = n(82390),
        l = n(69205),
        u = n(91808),
        c = (n(97393), n(76843), n(85717), n(5095)),
        h = n(95260),
        v = n(18394);
      n(64106),
        (0, u.Z)(
          [(0, h.Mo)("ha-duration-input")],
          function (e, i) {
            var n = (function (i) {
              function n() {
                var i;
                (0, o.Z)(this, n);
                for (
                  var t = arguments.length, a = new Array(t), r = 0;
                  r < t;
                  r++
                )
                  a[r] = arguments[r];
                return (i = (0, d.Z)(this, n, [].concat(a))), e((0, s.Z)(i)), i;
              }
              return (0, l.Z)(n, i), (0, r.Z)(n);
            })(i);
            return {
              F: n,
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
                      t ||
                        (t = (0, a.Z)([
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
                      n = Object.assign({}, e.detail.value);
                    (this.enableMillisecond || n.milliseconds
                      ? n.milliseconds > 999 &&
                        ((n.seconds += Math.floor(n.milliseconds / 1e3)),
                        (n.milliseconds %= 1e3))
                      : delete n.milliseconds,
                    n.seconds > 59 &&
                      ((n.minutes += Math.floor(n.seconds / 60)),
                      (n.seconds %= 60)),
                    n.minutes > 59 &&
                      ((n.hours += Math.floor(n.minutes / 60)),
                      (n.minutes %= 60)),
                    this.enableDay && n.hours > 24) &&
                      ((n.days =
                        (null !== (i = n.days) && void 0 !== i ? i : 0) +
                        Math.floor(n.hours / 24)),
                      (n.hours %= 24));
                    (0, v.B)(this, "value-changed", { value: n });
                  },
                },
              ],
            };
          },
          c.oi
        );
    },
    86086: function (e, i, n) {
      n.r(i),
        n.d(i, {
          HaTimeDuration: function () {
            return v;
          },
        });
      var t,
        a = n(88962),
        r = n(33368),
        o = n(71650),
        d = n(68308),
        s = n(82390),
        l = n(69205),
        u = n(91808),
        c = (n(97393), n(5095)),
        h = n(95260),
        v =
          (n(92353),
          (0, u.Z)(
            [(0, h.Mo)("ha-selector-duration")],
            function (e, i) {
              var n = (function (i) {
                function n() {
                  var i;
                  (0, o.Z)(this, n);
                  for (
                    var t = arguments.length, a = new Array(t), r = 0;
                    r < t;
                    r++
                  )
                    a[r] = arguments[r];
                  return (
                    (i = (0, d.Z)(this, n, [].concat(a))), e((0, s.Z)(i)), i
                  );
                }
                return (0, l.Z)(n, i), (0, r.Z)(n);
              })(i);
              return {
                F: n,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "hass",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "selector",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ attribute: !1 })],
                    key: "value",
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
                    key: "disabled",
                    value: function () {
                      return !1;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, h.Cb)({ type: Boolean })],
                    key: "required",
                    value: function () {
                      return !0;
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      var e;
                      return (0, c.dy)(
                        t ||
                          (t = (0, a.Z)([
                            ' <ha-duration-input .label="',
                            '" .helper="',
                            '" .data="',
                            '" .disabled="',
                            '" .required="',
                            '" ?enableDay="',
                            '"></ha-duration-input> ',
                          ])),
                        this.label,
                        this.helper,
                        this.value,
                        this.disabled,
                        this.required,
                        null === (e = this.selector.duration) || void 0 === e
                          ? void 0
                          : e.enable_day
                      );
                    },
                  },
                ],
              };
            },
            c.oi
          ));
    },
    93892: function (e, i, n) {
      var t = n(97673),
        a = n(11336),
        r = n(43313),
        o = RangeError;
      e.exports = function (e) {
        var i = a(r(this)),
          n = "",
          d = t(e);
        if (d < 0 || d === 1 / 0) throw new o("Wrong number of repetitions");
        for (; d > 0; (d >>>= 1) && (i += i)) 1 & d && (n += i);
        return n;
      };
    },
  },
]);
//# sourceMappingURL=1794.95eQFrlvJ2Y.js.map
