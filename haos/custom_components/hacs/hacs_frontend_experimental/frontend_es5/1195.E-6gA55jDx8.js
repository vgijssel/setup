"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1195],
  {
    31195: function (e, r, t) {
      t.r(r),
        t.d(r, {
          HaQrCode: function () {
            return g;
          },
        });
      var a,
        i,
        n,
        o = t(88962),
        d = t(33368),
        s = t(71650),
        c = t(68308),
        h = t(82390),
        l = t(69205),
        u = t(91808),
        v = t(34541),
        k = t(47838),
        f = (t(97393), t(76843), t(5095)),
        m = t(95260),
        y = t(51970),
        g =
          (t(23860),
          (0, u.Z)(
            [(0, m.Mo)("ha-qr-code")],
            function (e, r) {
              var t = (function (r) {
                function t() {
                  var r;
                  (0, s.Z)(this, t);
                  for (
                    var a = arguments.length, i = new Array(a), n = 0;
                    n < a;
                    n++
                  )
                    i[n] = arguments[n];
                  return (
                    (r = (0, c.Z)(this, t, [].concat(i))), e((0, h.Z)(r)), r
                  );
                }
                return (0, l.Z)(t, r), (0, d.Z)(t);
              })(r);
              return {
                F: t,
                d: [
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)()],
                    key: "data",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [
                      (0, m.Cb)({ attribute: "error-correction-level" }),
                    ],
                    key: "errorCorrectionLevel",
                    value: function () {
                      return "medium";
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Number })],
                    key: "width",
                    value: function () {
                      return 4;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Number })],
                    key: "scale",
                    value: function () {
                      return 4;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Number })],
                    key: "margin",
                    value: function () {
                      return 4;
                    },
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ type: Number })],
                    key: "maskPattern",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.Cb)({ attribute: "center-image" })],
                    key: "centerImage",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.SB)()],
                    key: "_error",
                    value: void 0,
                  },
                  {
                    kind: "field",
                    decorators: [(0, m.IO)("canvas")],
                    key: "_canvas",
                    value: void 0,
                  },
                  {
                    kind: "method",
                    key: "willUpdate",
                    value: function (e) {
                      (0, v.Z)((0, k.Z)(t.prototype), "willUpdate", this).call(
                        this,
                        e
                      ),
                        (e.has("data") ||
                          e.has("scale") ||
                          e.has("width") ||
                          e.has("margin") ||
                          e.has("maskPattern") ||
                          e.has("errorCorrectionLevel")) &&
                          this._error &&
                          (this._error = void 0);
                    },
                  },
                  {
                    kind: "method",
                    key: "updated",
                    value: function (e) {
                      var r = this,
                        t = this._canvas;
                      if (
                        t &&
                        this.data &&
                        (e.has("data") ||
                          e.has("scale") ||
                          e.has("width") ||
                          e.has("margin") ||
                          e.has("maskPattern") ||
                          e.has("errorCorrectionLevel") ||
                          e.has("centerImage"))
                      ) {
                        var a = getComputedStyle(this);
                        if (
                          (y
                            .toCanvas(t, this.data, {
                              errorCorrectionLevel: this.errorCorrectionLevel,
                              width: this.width,
                              scale: this.scale,
                              margin: this.margin,
                              maskPattern: this.maskPattern,
                              color: {
                                light: a.getPropertyValue(
                                  "--card-background-color"
                                ),
                                dark: a.getPropertyValue(
                                  "--primary-text-color"
                                ),
                              },
                            })
                            .catch(function (e) {
                              r._error = e.message;
                            }),
                          this.centerImage)
                        ) {
                          var i = this._canvas.getContext("2d"),
                            n = new Image();
                          (n.src = this.centerImage),
                            (n.onload = function () {
                              null == i ||
                                i.drawImage(
                                  n,
                                  0.375 * t.width,
                                  0.375 * t.height,
                                  t.width / 4,
                                  t.height / 4
                                );
                            });
                        }
                      }
                    },
                  },
                  {
                    kind: "method",
                    key: "render",
                    value: function () {
                      return this.data
                        ? this._error
                          ? (0, f.dy)(
                              a ||
                                (a = (0, o.Z)([
                                  '<ha-alert alert-type="error">',
                                  "</ha-alert>",
                                ])),
                              this._error
                            )
                          : (0, f.dy)(
                              i || (i = (0, o.Z)(["<canvas></canvas>"]))
                            )
                        : f.Ld;
                    },
                  },
                  {
                    kind: "field",
                    static: !0,
                    key: "styles",
                    value: function () {
                      return (0, f.iv)(
                        n || (n = (0, o.Z)([":host{display:block}"]))
                      );
                    },
                  },
                ],
              };
            },
            f.oi
          ));
    },
  },
]);
//# sourceMappingURL=1195.E-6gA55jDx8.js.map
