"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [254],
  {
    45577: function (e, n, t) {
      Object.defineProperty(n, "__esModule", { value: !0 });
      var l = t(39460);
      "undefined" == typeof Intl &&
        ("undefined" != typeof window
          ? Object.defineProperty(window, "Intl", { value: {} })
          : "undefined" != typeof global &&
            Object.defineProperty(global, "Intl", { value: {} })),
        Object.defineProperty(Intl, "getCanonicalLocales", {
          value: l.getCanonicalLocales,
          writable: !0,
          enumerable: !1,
          configurable: !0,
        });
    },
  },
]);
//# sourceMappingURL=254.YN5-uIa1JAw.js.map
