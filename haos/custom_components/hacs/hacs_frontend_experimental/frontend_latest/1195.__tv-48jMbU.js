export const id = 1195;
export const ids = [1195];
export const modules = {
  31195: (e, t, r) => {
    r.r(t), r.d(t, { HaQrCode: () => l });
    var a = r(309),
      i = r(34541),
      o = r(47838),
      s = r(5095),
      d = r(95260),
      n = r(51970);
    r(23860);
    let l = (0, a.Z)(
      [(0, d.Mo)("ha-qr-code")],
      function (e, t) {
        class r extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: r,
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)()],
              key: "data",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: "error-correction-level" })],
              key: "errorCorrectionLevel",
              value: () => "medium",
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Number })],
              key: "width",
              value: () => 4,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Number })],
              key: "scale",
              value: () => 4,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Number })],
              key: "margin",
              value: () => 4,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Number })],
              key: "maskPattern",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: "center-image" })],
              key: "centerImage",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_error",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.IO)("canvas")],
              key: "_canvas",
              value: void 0,
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                (0, i.Z)((0, o.Z)(r.prototype), "willUpdate", this).call(
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
                const t = this._canvas;
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
                  const e = getComputedStyle(this);
                  if (
                    (n
                      .toCanvas(t, this.data, {
                        errorCorrectionLevel: this.errorCorrectionLevel,
                        width: this.width,
                        scale: this.scale,
                        margin: this.margin,
                        maskPattern: this.maskPattern,
                        color: {
                          light: e.getPropertyValue("--card-background-color"),
                          dark: e.getPropertyValue("--primary-text-color"),
                        },
                      })
                      .catch((e) => {
                        this._error = e.message;
                      }),
                    this.centerImage)
                  ) {
                    const e = this._canvas.getContext("2d"),
                      r = new Image();
                    (r.src = this.centerImage),
                      (r.onload = () => {
                        null == e ||
                          e.drawImage(
                            r,
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
                    ? s.dy`<ha-alert alert-type="error">${this._error}</ha-alert>`
                    : s.dy`<canvas></canvas>`
                  : s.Ld;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () => s.iv`:host{display:block}`,
            },
          ],
        };
      },
      s.oi
    );
  },
};
//# sourceMappingURL=1195.__tv-48jMbU.js.map
