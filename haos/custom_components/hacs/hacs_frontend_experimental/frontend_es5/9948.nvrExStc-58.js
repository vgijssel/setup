"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [9948],
  {
    9948: function (e, n, t) {
      t.r(n),
        t.d(n, {
          HaFormConstant: function () {
            return k;
          },
        });
      var a,
        r,
        o = t(88962),
        s = t(33368),
        i = t(71650),
        c = t(68308),
        u = t(82390),
        l = t(69205),
        d = t(91808),
        h = (t(97393), t(5095)),
        f = t(95260),
        k = (0, d.Z)(
          [(0, f.Mo)("ha-form-constant")],
          function (e, n) {
            var t = (function (n) {
              function t() {
                var n;
                (0, i.Z)(this, t);
                for (
                  var a = arguments.length, r = new Array(a), o = 0;
                  o < a;
                  o++
                )
                  r[o] = arguments[o];
                return (n = (0, c.Z)(this, t, [].concat(r))), e((0, u.Z)(n)), n;
              }
              return (0, l.Z)(t, n), (0, s.Z)(t);
            })(n);
            return {
              F: t,
              d: [
                {
                  kind: "field",
                  decorators: [(0, f.Cb)({ attribute: !1 })],
                  key: "schema",
                  value: void 0,
                },
                {
                  kind: "field",
                  decorators: [(0, f.Cb)()],
                  key: "label",
                  value: void 0,
                },
                {
                  kind: "method",
                  key: "render",
                  value: function () {
                    return (0, h.dy)(
                      a ||
                        (a = (0, o.Z)(['<span class="label">', "</span>", ""])),
                      this.label,
                      this.schema.value ? ": ".concat(this.schema.value) : ""
                    );
                  },
                },
                {
                  kind: "get",
                  static: !0,
                  key: "styles",
                  value: function () {
                    return (0, h.iv)(
                      r ||
                        (r = (0, o.Z)([
                          ":host{display:block}.label{font-weight:500}",
                        ]))
                    );
                  },
                },
              ],
            };
          },
          h.oi
        );
    },
  },
]);
//# sourceMappingURL=9948.nvrExStc-58.js.map
