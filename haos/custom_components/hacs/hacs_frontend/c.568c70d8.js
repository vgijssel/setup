import { c as e, u as t } from "./c.743a15a1.js";
import { eO as a } from "./main-ad130be7.js";
import { l } from "./c.c79c22f9.js";
import { l as r } from "./c.d2e52e5a.js";
import "./c.d262aab0.js";
import "./c.f1291e50.js";
import "./c.9b92f489.js";
import "./c.82eccc94.js";
import "./c.8e28b461.js";
import "./c.3f859915.js";
import "./c.0ca5587f.js";
import "./c.42d6aebd.js";
import "./c.2d5ed670.js";
import "./c.2ee83bd0.js";
import "./c.4266acdb.js";
import "./c.0a1cf8d0.js";
import "./c.21c042d4.js";
import "./c.8d4c35ad.js";
import "./c.f2bb3724.js";
import "./c.4feb0cb8.js";
import "./c.3da15c48.js";
var i = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.InitializePluralRules = void 0),
    (t.InitializePluralRules = function (e, t, a, i) {
      var o = i.availableLocales,
        n = i.relevantExtensionKeys,
        s = i.localeData,
        u = i.getDefaultLocale,
        c = i.getInternalSlots,
        d = (0, l.CanonicalizeLocaleList)(t),
        f = Object.create(null),
        p = (0, l.CoerceOptionsToObject)(a),
        m = c(e);
      m.initializedPluralRules = !0;
      var b = (0, l.GetOption)(
        p,
        "localeMatcher",
        "string",
        ["best fit", "lookup"],
        "best fit"
      );
      (f.localeMatcher = b),
        (m.type = (0, l.GetOption)(
          p,
          "type",
          "string",
          ["cardinal", "ordinal"],
          "cardinal"
        )),
        (0, l.SetNumberFormatDigitOptions)(m, p, 0, 3, "standard");
      var v = (0, r.ResolveLocale)(o, d, f, n, s, u);
      return (m.locale = v.locale), e;
    });
});
t(i), i.InitializePluralRules;
var o = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.GetOperands = void 0),
    (t.GetOperands = function (e) {
      (0, l.invariant)(
        "string" == typeof e,
        "GetOperands should have been called with a string"
      );
      var t = (0, l.ToNumber)(e);
      (0, l.invariant)(isFinite(t), "n should be finite");
      var a,
        r,
        i,
        o = e.indexOf("."),
        n = "";
      -1 === o
        ? ((a = t), (r = 0), (i = 0))
        : ((a = e.slice(0, o)),
          (n = e.slice(o, e.length)),
          (r = (0, l.ToNumber)(n)),
          (i = n.length));
      var s,
        u,
        c = Math.abs((0, l.ToNumber)(a));
      if (0 !== r) {
        var d = n.replace(/0+$/, "");
        (s = d.length), (u = (0, l.ToNumber)(d));
      } else (s = 0), (u = 0);
      return {
        Number: t,
        IntegerDigits: c,
        NumberOfFractionDigits: i,
        NumberOfFractionDigitsWithoutTrailing: s,
        FractionDigits: r,
        FractionDigitsWithoutTrailing: u,
      };
    });
});
t(o), o.GetOperands;
var n = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.ResolvePlural = void 0),
    (t.ResolvePlural = function (e, t, a) {
      var r = a.getInternalSlots,
        i = a.PluralRuleSelect,
        n = r(e);
      if (
        ((0, l.invariant)(
          "Object" === (0, l.Type)(n),
          "pl has to be an object"
        ),
        (0, l.invariant)(
          "initializedPluralRules" in n,
          "pluralrules must be initialized"
        ),
        (0, l.invariant)("Number" === (0, l.Type)(t), "n must be a number"),
        !isFinite(t))
      )
        return "other";
      var s = n.locale,
        u = n.type,
        c = (0, l.FormatNumericToString)(n, t).formattedString;
      return i(s, u, t, (0, o.GetOperands)(c));
    });
});
t(n), n.ResolvePlural;
var s = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = new WeakMap();
  t.default = function (e) {
    var t = a.get(e);
    return t || ((t = Object.create(null)), a.set(e, t)), t;
  };
});
t(s);
var u = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.PluralRules = void 0);
  var r = (0, a.__importDefault)(s);
  function o(e, t) {
    if (!(e instanceof c))
      throw new TypeError(
        "Method Intl.PluralRules.prototype."
          .concat(t, " called on incompatible receiver ")
          .concat(String(e))
      );
  }
  function u(e, t, a, l) {
    var r = l.IntegerDigits,
      i = l.NumberOfFractionDigits,
      o = l.FractionDigits;
    return c.localeData[e].fn(
      i ? "".concat(r, ".").concat(o) : r,
      "ordinal" === t
    );
  }
  var c = (function () {
    function e(t, a) {
      if (!(this && this instanceof e ? this.constructor : void 0))
        throw new TypeError("Intl.PluralRules must be called with 'new'");
      return (0, i.InitializePluralRules)(this, t, a, {
        availableLocales: e.availableLocales,
        relevantExtensionKeys: e.relevantExtensionKeys,
        localeData: e.localeData,
        getDefaultLocale: e.getDefaultLocale,
        getInternalSlots: r.default,
      });
    }
    return (
      (e.prototype.resolvedOptions = function () {
        o(this, "resolvedOptions");
        var t = Object.create(null),
          l = (0, r.default)(this);
        return (
          (t.locale = l.locale),
          (t.type = l.type),
          [
            "minimumIntegerDigits",
            "minimumFractionDigits",
            "maximumFractionDigits",
            "minimumSignificantDigits",
            "maximumSignificantDigits",
          ].forEach(function (e) {
            var a = l[e];
            void 0 !== a && (t[e] = a);
          }),
          (t.pluralCategories = (0, a.__spreadArray)(
            [],
            e.localeData[t.locale].categories[t.type],
            !0
          )),
          t
        );
      }),
      (e.prototype.select = function (e) {
        o(this, "select");
        var t = (0, l.ToNumber)(e);
        return (0, n.ResolvePlural)(this, t, {
          getInternalSlots: r.default,
          PluralRuleSelect: u,
        });
      }),
      (e.prototype.toString = function () {
        return "[object Intl.PluralRules]";
      }),
      (e.supportedLocalesOf = function (t, a) {
        return (0, l.SupportedLocales)(
          e.availableLocales,
          (0, l.CanonicalizeLocaleList)(t),
          a
        );
      }),
      (e.__addLocaleData = function () {
        for (var t = [], a = 0; a < arguments.length; a++) t[a] = arguments[a];
        for (var l = 0, r = t; l < r.length; l++) {
          var i = r[l],
            o = i.data,
            n = i.locale;
          (e.localeData[n] = o),
            e.availableLocales.add(n),
            e.__defaultLocale || (e.__defaultLocale = n);
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
  t.PluralRules = c;
  try {
    "undefined" != typeof Symbol &&
      Object.defineProperty(c.prototype, Symbol.toStringTag, {
        value: "Intl.PluralRules",
        writable: !1,
        enumerable: !1,
        configurable: !0,
      });
    try {
      Object.defineProperty(c, "length", {
        value: 0,
        writable: !1,
        enumerable: !1,
        configurable: !0,
      });
    } catch (e) {}
    Object.defineProperty(c.prototype.constructor, "length", {
      value: 0,
      writable: !1,
      enumerable: !1,
      configurable: !0,
    }),
      Object.defineProperty(c.supportedLocalesOf, "length", {
        value: 1,
        writable: !1,
        enumerable: !1,
        configurable: !0,
      });
  } catch (e) {}
});
t(u), u.PluralRules;
var c = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.supportedLocales = void 0),
    (t.supportedLocales = [
      "af",
      "ak",
      "am",
      "an",
      "ar",
      "ars",
      "as",
      "asa",
      "ast",
      "az",
      "bal",
      "be",
      "bem",
      "bez",
      "bg",
      "bho",
      "bm",
      "bn",
      "bo",
      "br",
      "brx",
      "bs",
      "ca",
      "ce",
      "ceb",
      "cgg",
      "chr",
      "ckb",
      "cs",
      "cy",
      "da",
      "de",
      "doi",
      "dsb",
      "dv",
      "dz",
      "ee",
      "el",
      "en",
      "eo",
      "es",
      "et",
      "eu",
      "fa",
      "ff",
      "fi",
      "fil",
      "fo",
      "fr",
      "fur",
      "fy",
      "ga",
      "gd",
      "gl",
      "gsw",
      "gu",
      "guw",
      "gv",
      "ha",
      "haw",
      "he",
      "hi",
      "hnj",
      "hr",
      "hsb",
      "hu",
      "hy",
      "ia",
      "id",
      "ig",
      "ii",
      "io",
      "is",
      "it",
      "iu",
      "ja",
      "jbo",
      "jgo",
      "jmc",
      "jv",
      "jw",
      "ka",
      "kab",
      "kaj",
      "kcg",
      "kde",
      "kea",
      "kk",
      "kkj",
      "kl",
      "km",
      "kn",
      "ko",
      "ks",
      "ksb",
      "ksh",
      "ku",
      "kw",
      "ky",
      "lag",
      "lb",
      "lg",
      "lij",
      "lkt",
      "ln",
      "lo",
      "lt",
      "lv",
      "mas",
      "mg",
      "mgo",
      "mk",
      "ml",
      "mn",
      "mo",
      "mr",
      "ms",
      "mt",
      "my",
      "nah",
      "naq",
      "nb",
      "nd",
      "ne",
      "nl",
      "nn",
      "nnh",
      "no",
      "nqo",
      "nr",
      "nso",
      "ny",
      "nyn",
      "om",
      "or",
      "os",
      "osa",
      "pa",
      "pap",
      "pcm",
      "pl",
      "prg",
      "ps",
      "pt-PT",
      "pt",
      "rm",
      "ro",
      "rof",
      "ru",
      "rwk",
      "sah",
      "saq",
      "sat",
      "sc",
      "scn",
      "sd",
      "sdh",
      "se",
      "seh",
      "ses",
      "sg",
      "sh",
      "shi",
      "si",
      "sk",
      "sl",
      "sma",
      "smi",
      "smj",
      "smn",
      "sms",
      "sn",
      "so",
      "sq",
      "sr",
      "ss",
      "ssy",
      "st",
      "su",
      "sv",
      "sw",
      "syr",
      "ta",
      "te",
      "teo",
      "th",
      "ti",
      "tig",
      "tk",
      "tl",
      "tn",
      "to",
      "tpi",
      "tr",
      "ts",
      "tzm",
      "ug",
      "uk",
      "und",
      "ur",
      "uz",
      "ve",
      "vi",
      "vo",
      "vun",
      "wa",
      "wae",
      "wo",
      "xh",
      "xog",
      "yi",
      "yo",
      "yue",
      "zh",
      "zu",
    ]);
});
t(c), c.supportedLocales;
var d = e(function (e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }),
    (t.shouldPolyfill = void 0),
    (t.shouldPolyfill = function (e) {
      if (
        (void 0 === e && (e = "en"),
        !("PluralRules" in Intl) ||
          "one" ===
            new Intl.PluralRules("en", { minimumFractionDigits: 2 }).select(
              1
            ) ||
          !(function (e) {
            if (!e) return !0;
            var t = Array.isArray(e) ? e : [e];
            return Intl.PluralRules.supportedLocalesOf(t).length === t.length;
          })(e))
      )
        return e ? (0, r.match)([e], c.supportedLocales, "en") : void 0;
    });
});
t(d), d.shouldPolyfill;
var f = e(function (e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (0, d.shouldPolyfill)() &&
        Object.defineProperty(Intl, "PluralRules", {
          value: u.PluralRules,
          writable: !0,
          enumerable: !1,
          configurable: !0,
        });
  }),
  p = t(f);
export { f as __moduleExports, p as default };
