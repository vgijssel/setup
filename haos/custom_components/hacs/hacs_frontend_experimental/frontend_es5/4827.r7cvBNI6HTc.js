(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [4827],
  {
    64827: function (e, n, a) {
      a(76843),
        a(17692),
        Intl.PluralRules &&
          "function" == typeof Intl.PluralRules.__addLocaleData &&
          Intl.PluralRules.__addLocaleData({
            data: {
              categories: {
                cardinal: ["one", "other"],
                ordinal: ["one", "two", "few", "other"],
              },
              fn: function (e, n) {
                var a = String(e).split("."),
                  l = !a[1],
                  t = Number(a[0]) == e,
                  o = t && a[0].slice(-1),
                  r = t && a[0].slice(-2);
                return n
                  ? 1 == o && 11 != r
                    ? "one"
                    : 2 == o && 12 != r
                    ? "two"
                    : 3 == o && 13 != r
                    ? "few"
                    : "other"
                  : 1 == e && l
                  ? "one"
                  : "other";
              },
            },
            locale: "en",
          });
    },
  },
]);
//# sourceMappingURL=4827.r7cvBNI6HTc.js.map
