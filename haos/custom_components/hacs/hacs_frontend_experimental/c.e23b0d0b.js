Intl.PluralRules &&
  "function" == typeof Intl.PluralRules.__addLocaleData &&
  Intl.PluralRules.__addLocaleData({
    data: {
      categories: {
        cardinal: ["one", "other"],
        ordinal: ["one", "two", "few", "other"],
      },
      fn: function (e, l) {
        var a = String(e).split("."),
          t = !a[1],
          o = Number(a[0]) == e,
          n = o && a[0].slice(-1),
          r = o && a[0].slice(-2);
        return l
          ? 1 == n && 11 != r
            ? "one"
            : 2 == n && 12 != r
            ? "two"
            : 3 == n && 13 != r
            ? "few"
            : "other"
          : 1 == e && t
          ? "one"
          : "other";
      },
    },
    locale: "en",
  });
