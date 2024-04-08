export const id = 655;
export const ids = [655];
export const modules = {
  51621: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.GetOperands = void 0);
    var l = a(77021);
    t.GetOperands = function (e) {
      (0, l.invariant)(
        "string" == typeof e,
        "GetOperands should have been called with a string"
      );
      var t = (0, l.ToNumber)(e);
      (0, l.invariant)(isFinite(t), "n should be finite");
      var a,
        r,
        i,
        n = e.indexOf("."),
        o = "";
      -1 === n
        ? ((a = t), (r = 0), (i = 0))
        : ((a = e.slice(0, n)),
          (o = e.slice(n, e.length)),
          (r = (0, l.ToNumber)(o)),
          (i = o.length));
      var u,
        c,
        s = Math.abs((0, l.ToNumber)(a));
      if (0 !== r) {
        var f = o.replace(/0+$/, "");
        (u = f.length), (c = (0, l.ToNumber)(f));
      } else (u = 0), (c = 0);
      return {
        Number: t,
        IntegerDigits: s,
        NumberOfFractionDigits: i,
        NumberOfFractionDigitsWithoutTrailing: u,
        FractionDigits: r,
        FractionDigitsWithoutTrailing: c,
      };
    };
  },
  75533: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.InitializePluralRules = void 0);
    var l = a(77021),
      r = a(46042);
    t.InitializePluralRules = function (e, t, a, i) {
      var n = i.availableLocales,
        o = i.relevantExtensionKeys,
        u = i.localeData,
        c = i.getDefaultLocale,
        s = i.getInternalSlots,
        f = (0, l.CanonicalizeLocaleList)(t),
        d = Object.create(null),
        p = (0, l.CoerceOptionsToObject)(a),
        v = s(e);
      v.initializedPluralRules = !0;
      var b = (0, l.GetOption)(
        p,
        "localeMatcher",
        "string",
        ["best fit", "lookup"],
        "best fit"
      );
      (d.localeMatcher = b),
        (v.type = (0, l.GetOption)(
          p,
          "type",
          "string",
          ["cardinal", "ordinal"],
          "cardinal"
        )),
        (0, l.SetNumberFormatDigitOptions)(v, p, 0, 3, "standard");
      var g = (0, r.ResolveLocale)(n, f, d, o, u, c);
      return (v.locale = g.locale), e;
    };
  },
  79695: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.ResolvePlural = void 0);
    var l = a(77021),
      r = a(51621);
    t.ResolvePlural = function (e, t, a) {
      var i = a.getInternalSlots,
        n = a.PluralRuleSelect,
        o = i(e);
      if (
        ((0, l.invariant)(
          "Object" === (0, l.Type)(o),
          "pl has to be an object"
        ),
        (0, l.invariant)(
          "initializedPluralRules" in o,
          "pluralrules must be initialized"
        ),
        (0, l.invariant)("Number" === (0, l.Type)(t), "n must be a number"),
        !isFinite(t))
      )
        return "other";
      var u = o.locale,
        c = o.type,
        s = (0, l.FormatNumericToString)(o, t).formattedString;
      return n(u, c, t, (0, r.GetOperands)(s));
    };
  },
  68441: (e, t) => {
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = new WeakMap();
    t.default = function (e) {
      var t = a.get(e);
      return t || ((t = Object.create(null)), a.set(e, t)), t;
    };
  },
  78643: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.PluralRules = void 0);
    var l = a(43204),
      r = a(77021),
      i = a(75533),
      n = a(79695),
      o = l.__importDefault(a(68441));
    function u(e, t) {
      if (!(e instanceof s))
        throw new TypeError(
          "Method Intl.PluralRules.prototype."
            .concat(t, " called on incompatible receiver ")
            .concat(String(e))
        );
    }
    function c(e, t, a, l) {
      var r = l.IntegerDigits,
        i = l.NumberOfFractionDigits,
        n = l.FractionDigits;
      return s.localeData[e].fn(
        i ? "".concat(r, ".").concat(n) : r,
        "ordinal" === t
      );
    }
    var s = (function () {
      function e(t, a) {
        if (!(this && this instanceof e ? this.constructor : void 0))
          throw new TypeError("Intl.PluralRules must be called with 'new'");
        return (0, i.InitializePluralRules)(this, t, a, {
          availableLocales: e.availableLocales,
          relevantExtensionKeys: e.relevantExtensionKeys,
          localeData: e.localeData,
          getDefaultLocale: e.getDefaultLocale,
          getInternalSlots: o.default,
        });
      }
      return (
        (e.prototype.resolvedOptions = function () {
          u(this, "resolvedOptions");
          var t = Object.create(null),
            a = (0, o.default)(this);
          return (
            (t.locale = a.locale),
            (t.type = a.type),
            [
              "minimumIntegerDigits",
              "minimumFractionDigits",
              "maximumFractionDigits",
              "minimumSignificantDigits",
              "maximumSignificantDigits",
            ].forEach(function (e) {
              var l = a[e];
              void 0 !== l && (t[e] = l);
            }),
            (t.pluralCategories = l.__spreadArray(
              [],
              e.localeData[t.locale].categories[t.type],
              !0
            )),
            t
          );
        }),
        (e.prototype.select = function (e) {
          u(this, "select");
          var t = (0, r.ToNumber)(e);
          return (0, n.ResolvePlural)(this, t, {
            getInternalSlots: o.default,
            PluralRuleSelect: c,
          });
        }),
        (e.prototype.toString = function () {
          return "[object Intl.PluralRules]";
        }),
        (e.supportedLocalesOf = function (t, a) {
          return (0, r.SupportedLocales)(
            e.availableLocales,
            (0, r.CanonicalizeLocaleList)(t),
            a
          );
        }),
        (e.__addLocaleData = function () {
          for (var t = [], a = 0; a < arguments.length; a++)
            t[a] = arguments[a];
          for (var l = 0, r = t; l < r.length; l++) {
            var i = r[l],
              n = i.data,
              o = i.locale;
            (e.localeData[o] = n),
              e.availableLocales.add(o),
              e.__defaultLocale || (e.__defaultLocale = o);
          }
        }),
        (e.getDefaultLocale = function () {
          return e.__defaultLocale;
        }),
        (e.localeData = {}),
        (e.availableLocales = new Set()),
        (e.__defaultLocale = ""),
        (e.relevantExtensionKeys = []),
        (e.polyfilled = !0),
        e
      );
    })();
    t.PluralRules = s;
    try {
      "undefined" != typeof Symbol &&
        Object.defineProperty(s.prototype, Symbol.toStringTag, {
          value: "Intl.PluralRules",
          writable: !1,
          enumerable: !1,
          configurable: !0,
        });
      try {
        Object.defineProperty(s, "length", {
          value: 0,
          writable: !1,
          enumerable: !1,
          configurable: !0,
        });
      } catch (e) {}
      Object.defineProperty(s.prototype.constructor, "length", {
        value: 0,
        writable: !1,
        enumerable: !1,
        configurable: !0,
      }),
        Object.defineProperty(s.supportedLocalesOf, "length", {
          value: 1,
          writable: !1,
          enumerable: !1,
          configurable: !0,
        });
    } catch (e) {}
  },
  20655: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 });
    var l = a(78643);
    Object.defineProperty(Intl, "PluralRules", {
      value: l.PluralRules,
      writable: !0,
      enumerable: !1,
      configurable: !0,
    });
  },
};
//# sourceMappingURL=655.PtrZHdAe538.js.map
