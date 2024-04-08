export const id = 2684;
export const ids = [2684];
export const modules = {
  3021: (e, a, t) => {
    Object.defineProperty(a, "__esModule", { value: !0 }),
      (a.CanonicalCodeForDisplayNames = void 0);
    var r = t(77021),
      i = t(81784),
      l = /^([a-z]{2}|[0-9]{3})$/i,
      o = /^[a-z]{4}$/i,
      n = /^[a-z0-9]{3,8}([-_][a-z0-9]{3,8})*$/i;
    a.CanonicalCodeForDisplayNames = function (e, a) {
      if ("language" === e) return (0, r.CanonicalizeLocaleList)([a])[0];
      if ("region" === e) {
        if (((t = a), !l.test(t))) throw RangeError("invalid region");
        return a.toUpperCase();
      }
      var t, c;
      if ("script" === e) {
        if (((c = a), !o.test(c))) throw RangeError("invalid script");
        return "".concat(a[0].toUpperCase()).concat(a.slice(1).toLowerCase());
      }
      if ("calendar" === e) {
        if (
          !(function (e) {
            return n.test(e);
          })(a)
        )
          throw RangeError("invalid calendar");
        return a.toLowerCase();
      }
      if ("dateTimeField" === e) {
        if (!(0, i.IsValidDateTimeFieldCode)(a))
          throw RangeError("invalid dateTimeField");
        return a;
      }
      if (
        ((0, r.invariant)("currency" === e, "invalid type"),
        !(0, r.IsWellFormedCurrencyCode)(a))
      )
        throw RangeError("invalid currency");
      return a.toUpperCase();
    };
  },
  81784: (e, a) => {
    Object.defineProperty(a, "__esModule", { value: !0 }),
      (a.IsValidDateTimeFieldCode = void 0);
    var t = [
      "era",
      "year",
      "quarter",
      "month",
      "weekOfYear",
      "weekday",
      "day",
      "dayPeriod",
      "hour",
      "minute",
      "second",
      "timeZoneName",
    ];
    a.IsValidDateTimeFieldCode = function (e) {
      return t.indexOf(e) >= 0;
    };
  },
  68033: (e, a, t) => {
    Object.defineProperty(a, "__esModule", { value: !0 }),
      (a.DisplayNames = void 0);
    var r = t(43204),
      i = t(77021),
      l = t(3021),
      o = t(81784),
      n = t(46042),
      c = (function () {
        function e(a, t) {
          if (void 0 === this.constructor)
            throw TypeError("Constructor Intl.DisplayNames requires 'new'");
          var r = (0, i.CanonicalizeLocaleList)(a);
          t = (0, i.GetOptionsObject)(t);
          var l = Object.create(null),
            o = e.localeData,
            c = (0, i.GetOption)(
              t,
              "localeMatcher",
              "string",
              ["lookup", "best fit"],
              "best fit"
            );
          l.localeMatcher = c;
          var s = (0, n.ResolveLocale)(
              Array.from(e.availableLocales),
              r,
              l,
              [],
              e.localeData,
              e.getDefaultLocale
            ),
            d = (0, i.GetOption)(
              t,
              "style",
              "string",
              ["narrow", "short", "long"],
              "long"
            );
          u(this, "style", d);
          var p = (0, i.GetOption)(
            t,
            "type",
            "string",
            [
              "language",
              "region",
              "script",
              "currency",
              "calendar",
              "dateTimeField",
            ],
            void 0
          );
          if (void 0 === p)
            throw TypeError(
              'Intl.DisplayNames constructor requires "type" option'
            );
          u(this, "type", p),
            u(
              this,
              "fallback",
              (0, i.GetOption)(
                t,
                "fallback",
                "string",
                ["code", "none"],
                "code"
              )
            ),
            u(this, "locale", s.locale);
          var f = s.dataLocale,
            v = o[f];
          (0, i.invariant)(!!v, "Missing locale data for ".concat(f)),
            u(this, "localeData", v),
            (0, i.invariant)(
              void 0 !== v,
              "locale data for ".concat(s.locale, " does not exist.")
            );
          var y = v.types;
          (0, i.invariant)(
            "object" == typeof y && null != y,
            "invalid types data"
          );
          var g = y[p];
          (0, i.invariant)(
            "object" == typeof g && null != g,
            "invalid typeFields data"
          );
          var b = (0, i.GetOption)(
            t,
            "languageDisplay",
            "string",
            ["dialect", "standard"],
            "dialect"
          );
          if ("language" === p) {
            u(this, "languageDisplay", b);
            var m = y[p][b];
            (0, i.invariant)(
              "object" == typeof m && null != m,
              "invalid language typeFields data"
            );
          }
          var h = "language" === p ? y[p][b][d] : y[p][d];
          (0, i.invariant)(
            "object" == typeof h && null != h,
            "invalid styleFields data"
          ),
            u(this, "fields", h);
        }
        return (
          (e.supportedLocalesOf = function (a, t) {
            return (0, i.SupportedLocales)(
              e.availableLocales,
              (0, i.CanonicalizeLocaleList)(a),
              t
            );
          }),
          (e.__addLocaleData = function () {
            for (var a = [], t = 0; t < arguments.length; t++)
              a[t] = arguments[t];
            for (var r = 0, i = a; r < i.length; r++) {
              var l = i[r],
                o = l.data,
                n = l.locale,
                c = new Intl.Locale(n).minimize().toString();
              (e.localeData[n] = e.localeData[c] = o),
                e.availableLocales.add(c),
                e.availableLocales.add(n),
                e.__defaultLocale || (e.__defaultLocale = c);
            }
          }),
          (e.prototype.of = function (e) {
            p(this, "of");
            var a = d(this, "type"),
              t = (0, i.ToString)(e);
            if (
              !(function (e, a) {
                switch (e) {
                  case "language":
                    return /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?(-([a-z\d]{5,8}|\d[a-z\d]{3}))*$/i.test(
                      a
                    );
                  case "region":
                    return /^([a-z]{2}|\d{3})$/i.test(a);
                  case "script":
                    return /^[a-z]{4}$/i.test(a);
                  case "currency":
                    return (0, i.IsWellFormedCurrencyCode)(a);
                  case "calendar":
                    return /^[a-z0-9]{3,8}([-_][a-z0-9]{3,8})*$/i.test(a);
                  case "dateTimeField":
                    return (0, o.IsValidDateTimeFieldCode)(a);
                }
              })(a, t)
            )
              throw RangeError(
                "invalid code for Intl.DisplayNames.prototype.of"
              );
            var r,
              n = (0, i.getMultiInternalSlots)(
                s,
                this,
                "localeData",
                "style",
                "fallback"
              ),
              c = n.localeData,
              u = n.style,
              f = n.fallback,
              v = (0, l.CanonicalCodeForDisplayNames)(a, t);
            if ("language" === a) {
              r = (function (e, a, t, r, i) {
                var l = a.types.language[e],
                  o = l[t][r] || l.long[r];
                if (void 0 !== o) return o;
                var n = /-([a-z]{2}|\d{3})\b/i.exec(r);
                if (n) {
                  var c =
                      r.substring(0, n.index) +
                      r.substring(n.index + n[0].length),
                    s = n[1],
                    d = l[t][c] || l.long[c];
                  if (void 0 === d || !s) return d;
                  var u = a.types.region,
                    p = u[t][s] || u.long[s];
                  if (p || "code" === i)
                    return a.patterns.locale
                      .replace("{0}", d)
                      .replace("{1}", p || s);
                }
              })(d(this, "languageDisplay"), c, u, v, f);
            } else {
              var y = c.types[a];
              r = y[u][v] || y.long[v];
            }
            return void 0 !== r ? r : "code" === f ? t : void 0;
          }),
          (e.prototype.resolvedOptions = function () {
            return (
              p(this, "resolvedOptions"),
              r.__assign(
                {},
                (0, i.getMultiInternalSlots)(
                  s,
                  this,
                  "locale",
                  "style",
                  "type",
                  "fallback",
                  "languageDisplay"
                )
              )
            );
          }),
          (e.getDefaultLocale = function () {
            return e.__defaultLocale;
          }),
          (e.localeData = {}),
          (e.availableLocales = new Set()),
          (e.__defaultLocale = ""),
          (e.polyfilled = !0),
          e
        );
      })();
    a.DisplayNames = c;
    try {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(c.prototype, Symbol.toStringTag, {
          value: "Intl.DisplayNames",
          configurable: !0,
          enumerable: !1,
          writable: !1,
        }),
        Object.defineProperty(c, "length", {
          value: 2,
          writable: !1,
          enumerable: !1,
          configurable: !0,
        });
    } catch (e) {}
    var s = new WeakMap();
    function d(e, a) {
      return (0, i.getInternalSlot)(s, e, a);
    }
    function u(e, a, t) {
      (0, i.setInternalSlot)(s, e, a, t);
    }
    function p(e, a) {
      if (!(e instanceof c))
        throw TypeError(
          "Method Intl.DisplayNames.prototype.".concat(
            a,
            " called on incompatible receiver"
          )
        );
    }
  },
  72684: (e, a, t) => {
    Object.defineProperty(a, "__esModule", { value: !0 });
    var r = t(68033);
    Object.defineProperty(Intl, "DisplayNames", {
      value: r.DisplayNames,
      enumerable: !1,
      writable: !0,
      configurable: !0,
    });
  },
};
//# sourceMappingURL=2684.ECVq4qtLjQ0.js.map
