export const id = 9516;
export const ids = [9516];
export const modules = {
  39516: (e, o, t) => {
    t.r(o), t.d(o, { HaSelectorConstant: () => d });
    var l = t(309),
      i = t(5095),
      n = t(95260);
    let d = (0, l.Z)(
      [(0, n.Mo)("ha-selector-constant")],
      function (e, o) {
        return {
          F: class extends o {
            constructor(...o) {
              super(...o), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "selector",
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
              key: "localizeValue",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, o, t, l, n;
                if (this.disabled) return i.Ld;
                const d =
                    null === (e = this.selector.constant) || void 0 === e
                      ? void 0
                      : e.translation_key,
                  s =
                    d && this.localizeValue
                      ? this.localizeValue(`${d}.value`)
                      : void 0;
                return null !==
                  (o =
                    null !==
                      (t =
                        null != s
                          ? s
                          : null === (l = this.selector.constant) ||
                            void 0 === l
                          ? void 0
                          : l.label) && void 0 !== t
                      ? t
                      : null === (n = this.selector.constant) || void 0 === n
                      ? void 0
                      : n.value) && void 0 !== o
                  ? o
                  : i.Ld;
              },
            },
          ],
        };
      },
      i.oi
    );
  },
};
//# sourceMappingURL=9516.0-O9EE0G5CU.js.map
