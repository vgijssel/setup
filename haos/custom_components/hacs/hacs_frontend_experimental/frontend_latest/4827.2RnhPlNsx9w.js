export const id = 4827;
export const ids = [4827];
export const modules = {
  64827: () => {
    Intl.PluralRules &&
      "function" == typeof Intl.PluralRules.__addLocaleData &&
      Intl.PluralRules.__addLocaleData({
        data: {
          categories: {
            cardinal: ["one", "other"],
            ordinal: ["one", "two", "few", "other"],
          },
          fn: function (e, o) {
            var t = String(e).split("."),
              l = !t[1],
              n = Number(t[0]) == e,
              a = n && t[0].slice(-1),
              r = n && t[0].slice(-2);
            return o
              ? 1 == a && 11 != r
                ? "one"
                : 2 == a && 12 != r
                ? "two"
                : 3 == a && 13 != r
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
};
//# sourceMappingURL=4827.2RnhPlNsx9w.js.map
