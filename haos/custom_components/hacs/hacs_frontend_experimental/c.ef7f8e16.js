import { c as e, u as n } from "./c.743a15a1.js";
import "./c.2610e8cd.js";
import { t as a } from "./c.a0946910.js";
var r = /-u(?:-[0-9a-z]{2,8})+/gi;
function t(e, n, a) {
  if ((void 0 === a && (a = Error), !e)) throw new a(n);
}
function o(e, n) {
  for (var a = n; ; ) {
    if (e.has(a)) return a;
    var r = a.lastIndexOf("-");
    if (!~r) return;
    r >= 2 && "-" === a[r - 2] && (r -= 2), (a = a.slice(0, r));
  }
}
function s(e, n) {
  t(2 === n.length, "key must have 2 elements");
  var a = e.length,
    r = "-".concat(n, "-"),
    o = e.indexOf(r);
  if (-1 !== o) {
    for (var s = o + 4, l = s, i = s, f = !1; !f; ) {
      var c = e.indexOf("-", i);
      2 === (-1 === c ? a - i : c - i)
        ? (f = !0)
        : -1 === c
        ? ((l = a), (f = !0))
        : ((l = c), (i = c + 1));
    }
    return e.slice(s, l);
  }
  if (((r = "-".concat(n)), -1 !== (o = e.indexOf(r)) && o + 3 === a))
    return "";
}
function l(e, n, a, l, i, f) {
  var c;
  c =
    "lookup" === a.localeMatcher
      ? (function (e, n, a) {
          for (var t = { locale: "" }, s = 0, l = n; s < l.length; s++) {
            var i = l[s],
              f = i.replace(r, ""),
              c = o(e, f);
            if (c)
              return (
                (t.locale = c),
                i !== f && (t.extension = i.slice(f.length + 1, i.length)),
                t
              );
          }
          return (t.locale = a()), t;
        })(e, n, f)
      : (function (e, n, a) {
          var t,
            s = {},
            l = {},
            i = {},
            f = new Set();
          e.forEach(function (e) {
            var n = new Intl.Locale(e).minimize().toString(),
              a = Intl.getCanonicalLocales(e)[0] || e;
            (s[n] = e), (l[e] = e), (i[a] = e), f.add(n), f.add(e), f.add(a);
          });
          for (var c = 0, u = n; c < u.length; c++) {
            var d = u[c];
            if (t) break;
            var m = d.replace(r, "");
            if (e.has(m)) {
              t = m;
              break;
            }
            if (f.has(m)) {
              t = m;
              break;
            }
            var h = new Intl.Locale(m),
              v = h.maximize().toString(),
              L = h.minimize().toString();
            if (f.has(L)) {
              t = L;
              break;
            }
            t = o(f, v);
          }
          return t ? { locale: l[t] || i[t] || s[t] || t } : { locale: a() };
        })(e, n, f);
  for (
    var u = c.locale, d = { locale: "", dataLocale: u }, m = "-u", h = 0, v = l;
    h < v.length;
    h++
  ) {
    var L = v[h];
    t(u in i, "Missing locale data for ".concat(u));
    var g = i[u];
    t(
      "object" == typeof g && null !== g,
      "locale data ".concat(L, " must be an object")
    );
    var p = g[L];
    t(Array.isArray(p), "keyLocaleData for ".concat(L, " must be an array"));
    var b = p[0];
    t(
      "string" == typeof b || null === b,
      "value must be string or null but got "
        .concat(typeof b, " in key ")
        .concat(L)
    );
    var k = "";
    if (c.extension) {
      var E = s(c.extension, L);
      void 0 !== E &&
        ("" !== E
          ? ~p.indexOf(E) && ((b = E), (k = "-".concat(L, "-").concat(b)))
          : ~E.indexOf("true") && ((b = "true"), (k = "-".concat(L))));
    }
    if (L in a) {
      var M = a[L];
      t(
        "string" == typeof M || null == M,
        "optionsValue must be String, Undefined or Null"
      ),
        ~p.indexOf(M) && M !== b && ((b = M), (k = ""));
    }
    (d[L] = b), (m += k);
  }
  if (m.length > 2) {
    var S = u.indexOf("-x-");
    if (-1 === S) u += m;
    else {
      var C = u.slice(0, S),
        y = u.slice(S, u.length);
      u = C + m + y;
    }
    u = Intl.getCanonicalLocales(u)[0];
  }
  return (d.locale = u), d;
}
function i(e, n, a, r) {
  return l(
    n.reduce(function (e, n) {
      return e.add(n), e;
    }, new Set()),
    (function (e) {
      return Intl.getCanonicalLocales(e);
    })(e),
    { localeMatcher: (null == r ? void 0 : r.algorithm) || "best fit" },
    [],
    {},
    function () {
      return a;
    }
  ).locale;
}
var f = Object.freeze({
    __proto__: null,
    match: i,
    LookupSupportedLocales: function (e, n) {
      for (var a = [], t = 0, s = n; t < s.length; t++) {
        var l = o(e, s[t].replace(r, ""));
        l && a.push(l);
      }
      return a;
    },
    ResolveLocale: l,
  }),
  c = [
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
  ];
var u = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.CanonicalizeLocaleList = void 0),
    (n.CanonicalizeLocaleList = function (e) {
      return Intl.getCanonicalLocales(e);
    });
});
n(u), u.CanonicalizeLocaleList;
var d = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.invariant = n.UNICODE_EXTENSION_SEQUENCE_REGEX = void 0),
    (n.UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi),
    (n.invariant = function (e, n, a) {
      if ((void 0 === a && (a = Error), !e)) throw new a(n);
    });
});
n(d), d.invariant, d.UNICODE_EXTENSION_SEQUENCE_REGEX;
var m = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.BestAvailableLocale = void 0),
    (n.BestAvailableLocale = function (e, n) {
      for (var a = n; ; ) {
        if (e.has(a)) return a;
        var r = a.lastIndexOf("-");
        if (!~r) return;
        r >= 2 && "-" === a[r - 2] && (r -= 2), (a = a.slice(0, r));
      }
    });
});
n(m), m.BestAvailableLocale;
var h = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.LookupMatcher = void 0),
    (n.LookupMatcher = function (e, n, a) {
      for (var r = { locale: "" }, t = 0, o = n; t < o.length; t++) {
        var s = o[t],
          l = s.replace(d.UNICODE_EXTENSION_SEQUENCE_REGEX, ""),
          i = (0, m.BestAvailableLocale)(e, l);
        if (i)
          return (
            (r.locale = i),
            s !== l && (r.extension = s.slice(l.length + 1, s.length)),
            r
          );
      }
      return (r.locale = a()), r;
    });
});
n(h), h.LookupMatcher;
var v = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.BestFitMatcher = void 0),
    (n.BestFitMatcher = function (e, n, a) {
      var r,
        t = {},
        o = {},
        s = {},
        l = new Set();
      e.forEach(function (e) {
        var n = new Intl.Locale(e).minimize().toString(),
          a = Intl.getCanonicalLocales(e)[0] || e;
        (t[n] = e), (o[e] = e), (s[a] = e), l.add(n), l.add(e), l.add(a);
      });
      for (var i = 0, f = n; i < f.length; i++) {
        var c = f[i];
        if (r) break;
        var u = c.replace(d.UNICODE_EXTENSION_SEQUENCE_REGEX, "");
        if (e.has(u)) {
          r = u;
          break;
        }
        if (l.has(u)) {
          r = u;
          break;
        }
        var h = new Intl.Locale(u),
          v = h.maximize().toString(),
          L = h.minimize().toString();
        if (l.has(L)) {
          r = L;
          break;
        }
        r = (0, m.BestAvailableLocale)(l, v);
      }
      return r ? { locale: o[r] || s[r] || t[r] || r } : { locale: a() };
    });
});
n(v), v.BestFitMatcher;
var L = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.UnicodeExtensionValue = void 0),
    (n.UnicodeExtensionValue = function (e, n) {
      (0, d.invariant)(2 === n.length, "key must have 2 elements");
      var a = e.length,
        r = "-".concat(n, "-"),
        t = e.indexOf(r);
      if (-1 !== t) {
        for (var o = t + 4, s = o, l = o, i = !1; !i; ) {
          var f = e.indexOf("-", l);
          2 === (-1 === f ? a - l : f - l)
            ? (i = !0)
            : -1 === f
            ? ((s = a), (i = !0))
            : ((s = f), (l = f + 1));
        }
        return e.slice(o, s);
      }
      if (((r = "-".concat(n)), -1 !== (t = e.indexOf(r)) && t + 3 === a))
        return "";
    });
});
n(L), L.UnicodeExtensionValue;
var g = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.ResolveLocale = void 0),
    (n.ResolveLocale = function (e, n, a, r, t, o) {
      for (
        var s,
          l = (s =
            "lookup" === a.localeMatcher
              ? (0, h.LookupMatcher)(e, n, o)
              : (0, v.BestFitMatcher)(e, n, o)).locale,
          i = { locale: "", dataLocale: l },
          f = "-u",
          c = 0,
          u = r;
        c < u.length;
        c++
      ) {
        var m = u[c];
        (0, d.invariant)(l in t, "Missing locale data for ".concat(l));
        var g = t[l];
        (0, d.invariant)(
          "object" == typeof g && null !== g,
          "locale data ".concat(m, " must be an object")
        );
        var p = g[m];
        (0, d.invariant)(
          Array.isArray(p),
          "keyLocaleData for ".concat(m, " must be an array")
        );
        var b = p[0];
        (0, d.invariant)(
          "string" == typeof b || null === b,
          "value must be string or null but got "
            .concat(typeof b, " in key ")
            .concat(m)
        );
        var k = "";
        if (s.extension) {
          var E = (0, L.UnicodeExtensionValue)(s.extension, m);
          void 0 !== E &&
            ("" !== E
              ? ~p.indexOf(E) && ((b = E), (k = "-".concat(m, "-").concat(b)))
              : ~E.indexOf("true") && ((b = "true"), (k = "-".concat(m))));
        }
        if (m in a) {
          var M = a[m];
          (0, d.invariant)(
            "string" == typeof M || null == M,
            "optionsValue must be String, Undefined or Null"
          ),
            ~p.indexOf(M) && M !== b && ((b = M), (k = ""));
        }
        (i[m] = b), (f += k);
      }
      if (f.length > 2) {
        var S = l.indexOf("-x-");
        if (-1 === S) l += f;
        else {
          var C = l.slice(0, S),
            y = l.slice(S, l.length);
          l = C + f + y;
        }
        l = Intl.getCanonicalLocales(l)[0];
      }
      return (i.locale = l), i;
    });
});
n(g), g.ResolveLocale;
var p = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.LookupSupportedLocales = void 0),
    (n.LookupSupportedLocales = function (e, n) {
      for (var a = [], r = 0, t = n; r < t.length; r++) {
        var o = t[r].replace(d.UNICODE_EXTENSION_SEQUENCE_REGEX, ""),
          s = (0, m.BestAvailableLocale)(e, o);
        s && a.push(s);
      }
      return a;
    });
});
n(p), p.LookupSupportedLocales;
var b = e(function (e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }),
    (n.ResolveLocale = n.LookupSupportedLocales = n.match = void 0),
    (n.match = function (e, n, a, r) {
      var t = n.reduce(function (e, n) {
        return e.add(n), e;
      }, new Set());
      return (0, g.ResolveLocale)(
        t,
        (0, u.CanonicalizeLocaleList)(e),
        { localeMatcher: (null == r ? void 0 : r.algorithm) || "best fit" },
        [],
        {},
        function () {
          return a;
        }
      ).locale;
    }),
    Object.defineProperty(n, "LookupSupportedLocales", {
      enumerable: !0,
      get: function () {
        return p.LookupSupportedLocales;
      },
    });
  var a = g;
  Object.defineProperty(n, "ResolveLocale", {
    enumerable: !0,
    get: function () {
      return a.ResolveLocale;
    },
  });
});
n(b);
var k = b.ResolveLocale,
  E = b.LookupSupportedLocales,
  M = b.match,
  S = [
    "af-NA",
    "af",
    "agq",
    "ak",
    "am",
    "ar-AE",
    "ar-BH",
    "ar-DJ",
    "ar-DZ",
    "ar-EG",
    "ar-EH",
    "ar-ER",
    "ar-IL",
    "ar-IQ",
    "ar-JO",
    "ar-KM",
    "ar-KW",
    "ar-LB",
    "ar-LY",
    "ar-MA",
    "ar-MR",
    "ar-OM",
    "ar-PS",
    "ar-QA",
    "ar-SA",
    "ar-SD",
    "ar-SO",
    "ar-SS",
    "ar-SY",
    "ar-TD",
    "ar-TN",
    "ar-YE",
    "ar",
    "as",
    "asa",
    "ast",
    "az-Cyrl",
    "az-Latn",
    "az",
    "bas",
    "be-tarask",
    "be",
    "bem",
    "bez",
    "bg",
    "bm",
    "bn-IN",
    "bn",
    "bo-IN",
    "bo",
    "br",
    "brx",
    "bs-Cyrl",
    "bs-Latn",
    "bs",
    "ca-AD",
    "ca-ES-valencia",
    "ca-FR",
    "ca-IT",
    "ca",
    "ccp-IN",
    "ccp",
    "ce",
    "ceb",
    "cgg",
    "chr",
    "ckb-IR",
    "ckb",
    "cs",
    "cy",
    "da-GL",
    "da",
    "dav",
    "de-AT",
    "de-BE",
    "de-CH",
    "de-IT",
    "de-LI",
    "de-LU",
    "de",
    "dje",
    "doi",
    "dsb",
    "dua",
    "dyo",
    "dz",
    "ebu",
    "ee-TG",
    "ee",
    "el-CY",
    "el",
    "en-001",
    "en-150",
    "en-AE",
    "en-AG",
    "en-AI",
    "en-AS",
    "en-AT",
    "en-AU",
    "en-BB",
    "en-BE",
    "en-BI",
    "en-BM",
    "en-BS",
    "en-BW",
    "en-BZ",
    "en-CA",
    "en-CC",
    "en-CH",
    "en-CK",
    "en-CM",
    "en-CX",
    "en-CY",
    "en-DE",
    "en-DG",
    "en-DK",
    "en-DM",
    "en-ER",
    "en-FI",
    "en-FJ",
    "en-FK",
    "en-FM",
    "en-GB",
    "en-GD",
    "en-GG",
    "en-GH",
    "en-GI",
    "en-GM",
    "en-GU",
    "en-GY",
    "en-HK",
    "en-IE",
    "en-IL",
    "en-IM",
    "en-IN",
    "en-IO",
    "en-JE",
    "en-JM",
    "en-KE",
    "en-KI",
    "en-KN",
    "en-KY",
    "en-LC",
    "en-LR",
    "en-LS",
    "en-MG",
    "en-MH",
    "en-MO",
    "en-MP",
    "en-MS",
    "en-MT",
    "en-MU",
    "en-MW",
    "en-MY",
    "en-NA",
    "en-NF",
    "en-NG",
    "en-NL",
    "en-NR",
    "en-NU",
    "en-NZ",
    "en-PG",
    "en-PH",
    "en-PK",
    "en-PN",
    "en-PR",
    "en-PW",
    "en-RW",
    "en-SB",
    "en-SC",
    "en-SD",
    "en-SE",
    "en-SG",
    "en-SH",
    "en-SI",
    "en-SL",
    "en-SS",
    "en-SX",
    "en-SZ",
    "en-TC",
    "en-TK",
    "en-TO",
    "en-TT",
    "en-TV",
    "en-TZ",
    "en-UG",
    "en-UM",
    "en-VC",
    "en-VG",
    "en-VI",
    "en-VU",
    "en-WS",
    "en-ZA",
    "en-ZM",
    "en-ZW",
    "en",
    "eo",
    "es-419",
    "es-AR",
    "es-BO",
    "es-BR",
    "es-BZ",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-CU",
    "es-DO",
    "es-EA",
    "es-EC",
    "es-GQ",
    "es-GT",
    "es-HN",
    "es-IC",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PE",
    "es-PH",
    "es-PR",
    "es-PY",
    "es-SV",
    "es-US",
    "es-UY",
    "es-VE",
    "es",
    "et",
    "eu",
    "ewo",
    "fa-AF",
    "fa",
    "ff-Adlm-BF",
    "ff-Adlm-CM",
    "ff-Adlm-GH",
    "ff-Adlm-GM",
    "ff-Adlm-GW",
    "ff-Adlm-LR",
    "ff-Adlm-MR",
    "ff-Adlm-NE",
    "ff-Adlm-NG",
    "ff-Adlm-SL",
    "ff-Adlm-SN",
    "ff-Adlm",
    "ff-Latn-BF",
    "ff-Latn-CM",
    "ff-Latn-GH",
    "ff-Latn-GM",
    "ff-Latn-GN",
    "ff-Latn-GW",
    "ff-Latn-LR",
    "ff-Latn-MR",
    "ff-Latn-NE",
    "ff-Latn-NG",
    "ff-Latn-SL",
    "ff-Latn",
    "ff",
    "fi",
    "fil",
    "fo-DK",
    "fo",
    "fr-BE",
    "fr-BF",
    "fr-BI",
    "fr-BJ",
    "fr-BL",
    "fr-CA",
    "fr-CD",
    "fr-CF",
    "fr-CG",
    "fr-CH",
    "fr-CI",
    "fr-CM",
    "fr-DJ",
    "fr-DZ",
    "fr-GA",
    "fr-GF",
    "fr-GN",
    "fr-GP",
    "fr-GQ",
    "fr-HT",
    "fr-KM",
    "fr-LU",
    "fr-MA",
    "fr-MC",
    "fr-MF",
    "fr-MG",
    "fr-ML",
    "fr-MQ",
    "fr-MR",
    "fr-MU",
    "fr-NC",
    "fr-NE",
    "fr-PF",
    "fr-PM",
    "fr-RE",
    "fr-RW",
    "fr-SC",
    "fr-SN",
    "fr-SY",
    "fr-TD",
    "fr-TG",
    "fr-TN",
    "fr-VU",
    "fr-WF",
    "fr-YT",
    "fr",
    "fur",
    "fy",
    "ga-GB",
    "ga",
    "gd",
    "gl",
    "gsw-FR",
    "gsw-LI",
    "gsw",
    "gu",
    "guz",
    "gv",
    "ha-GH",
    "ha-NE",
    "ha",
    "haw",
    "he",
    "hi",
    "hr-BA",
    "hr",
    "hsb",
    "hu",
    "hy",
    "ia",
    "id",
    "ig",
    "ii",
    "is",
    "it-CH",
    "it-SM",
    "it-VA",
    "it",
    "ja",
    "jgo",
    "jmc",
    "jv",
    "ka",
    "kab",
    "kam",
    "kde",
    "kea",
    "kgp",
    "khq",
    "ki",
    "kk",
    "kkj",
    "kl",
    "kln",
    "km",
    "kn",
    "ko-KP",
    "ko",
    "kok",
    "ks-Arab",
    "ks",
    "ksb",
    "ksf",
    "ksh",
    "ku",
    "kw",
    "ky",
    "lag",
    "lb",
    "lg",
    "lkt",
    "ln-AO",
    "ln-CF",
    "ln-CG",
    "ln",
    "lo",
    "lrc-IQ",
    "lrc",
    "lt",
    "lu",
    "luo",
    "luy",
    "lv",
    "mai",
    "mas-TZ",
    "mas",
    "mer",
    "mfe",
    "mg",
    "mgh",
    "mgo",
    "mi",
    "mk",
    "ml",
    "mn",
    "mni-Beng",
    "mni",
    "mr",
    "ms-BN",
    "ms-ID",
    "ms-SG",
    "ms",
    "mt",
    "mua",
    "my",
    "mzn",
    "naq",
    "nb-SJ",
    "nb",
    "nd",
    "nds-NL",
    "nds",
    "ne-IN",
    "ne",
    "nl-AW",
    "nl-BE",
    "nl-BQ",
    "nl-CW",
    "nl-SR",
    "nl-SX",
    "nl",
    "nmg",
    "nn",
    "nnh",
    "no",
    "nus",
    "nyn",
    "om-KE",
    "om",
    "or",
    "os-RU",
    "os",
    "pa-Arab",
    "pa-Guru",
    "pa",
    "pcm",
    "pl",
    "ps-PK",
    "ps",
    "pt-AO",
    "pt-CH",
    "pt-CV",
    "pt-GQ",
    "pt-GW",
    "pt-LU",
    "pt-MO",
    "pt-MZ",
    "pt-PT",
    "pt-ST",
    "pt-TL",
    "pt",
    "qu-BO",
    "qu-EC",
    "qu",
    "rm",
    "rn",
    "ro-MD",
    "ro",
    "rof",
    "ru-BY",
    "ru-KG",
    "ru-KZ",
    "ru-MD",
    "ru-UA",
    "ru",
    "rw",
    "rwk",
    "sa",
    "sah",
    "saq",
    "sat-Olck",
    "sat",
    "sbp",
    "sc",
    "sd-Arab",
    "sd-Deva",
    "sd",
    "se-FI",
    "se-SE",
    "se",
    "seh",
    "ses",
    "sg",
    "shi-Latn",
    "shi-Tfng",
    "shi",
    "si",
    "sk",
    "sl",
    "smn",
    "sn",
    "so-DJ",
    "so-ET",
    "so-KE",
    "so",
    "sq-MK",
    "sq-XK",
    "sq",
    "sr-Cyrl-BA",
    "sr-Cyrl-ME",
    "sr-Cyrl-XK",
    "sr-Cyrl",
    "sr-Latn-BA",
    "sr-Latn-ME",
    "sr-Latn-XK",
    "sr-Latn",
    "sr",
    "su-Latn",
    "su",
    "sv-AX",
    "sv-FI",
    "sv",
    "sw-CD",
    "sw-KE",
    "sw-UG",
    "sw",
    "ta-LK",
    "ta-MY",
    "ta-SG",
    "ta",
    "te",
    "teo-KE",
    "teo",
    "tg",
    "th",
    "ti-ER",
    "ti",
    "tk",
    "to",
    "tr-CY",
    "tr",
    "tt",
    "twq",
    "tzm",
    "ug",
    "uk",
    "und",
    "ur-IN",
    "ur",
    "uz-Arab",
    "uz-Cyrl",
    "uz-Latn",
    "uz",
    "vai-Latn",
    "vai-Vaii",
    "vai",
    "vi",
    "vun",
    "wae",
    "wo",
    "xh",
    "xog",
    "yav",
    "yi",
    "yo-BJ",
    "yo",
    "yrl-CO",
    "yrl-VE",
    "yrl",
    "yue-Hans",
    "yue-Hant",
    "yue",
    "zgh",
    "zh-Hans-HK",
    "zh-Hans-MO",
    "zh-Hans-SG",
    "zh-Hans",
    "zh-Hant-HK",
    "zh-Hant-MO",
    "zh-Hant",
    "zh",
    "zu",
  ];
var C = [
  "af-NA",
  "af",
  "agq",
  "ak",
  "am",
  "ar-AE",
  "ar-BH",
  "ar-DJ",
  "ar-DZ",
  "ar-EG",
  "ar-EH",
  "ar-ER",
  "ar-IL",
  "ar-IQ",
  "ar-JO",
  "ar-KM",
  "ar-KW",
  "ar-LB",
  "ar-LY",
  "ar-MA",
  "ar-MR",
  "ar-OM",
  "ar-PS",
  "ar-QA",
  "ar-SA",
  "ar-SD",
  "ar-SO",
  "ar-SS",
  "ar-SY",
  "ar-TD",
  "ar-TN",
  "ar-YE",
  "ar",
  "as",
  "asa",
  "ast",
  "az-Cyrl",
  "az-Latn",
  "az",
  "bas",
  "be-tarask",
  "be",
  "bem",
  "bez",
  "bg",
  "bm",
  "bn-IN",
  "bn",
  "bo-IN",
  "bo",
  "br",
  "brx",
  "bs-Cyrl",
  "bs-Latn",
  "bs",
  "ca-AD",
  "ca-ES-valencia",
  "ca-FR",
  "ca-IT",
  "ca",
  "ccp-IN",
  "ccp",
  "ce",
  "ceb",
  "cgg",
  "chr",
  "ckb-IR",
  "ckb",
  "cs",
  "cy",
  "da-GL",
  "da",
  "dav",
  "de-AT",
  "de-BE",
  "de-CH",
  "de-IT",
  "de-LI",
  "de-LU",
  "de",
  "dje",
  "doi",
  "dsb",
  "dua",
  "dyo",
  "dz",
  "ebu",
  "ee-TG",
  "ee",
  "el-CY",
  "el",
  "en-001",
  "en-150",
  "en-AE",
  "en-AG",
  "en-AI",
  "en-AS",
  "en-AT",
  "en-AU",
  "en-BB",
  "en-BE",
  "en-BI",
  "en-BM",
  "en-BS",
  "en-BW",
  "en-BZ",
  "en-CA",
  "en-CC",
  "en-CH",
  "en-CK",
  "en-CM",
  "en-CX",
  "en-CY",
  "en-DE",
  "en-DG",
  "en-DK",
  "en-DM",
  "en-ER",
  "en-FI",
  "en-FJ",
  "en-FK",
  "en-FM",
  "en-GB",
  "en-GD",
  "en-GG",
  "en-GH",
  "en-GI",
  "en-GM",
  "en-GU",
  "en-GY",
  "en-HK",
  "en-IE",
  "en-IL",
  "en-IM",
  "en-IN",
  "en-IO",
  "en-JE",
  "en-JM",
  "en-KE",
  "en-KI",
  "en-KN",
  "en-KY",
  "en-LC",
  "en-LR",
  "en-LS",
  "en-MG",
  "en-MH",
  "en-MO",
  "en-MP",
  "en-MS",
  "en-MT",
  "en-MU",
  "en-MW",
  "en-MY",
  "en-NA",
  "en-NF",
  "en-NG",
  "en-NL",
  "en-NR",
  "en-NU",
  "en-NZ",
  "en-PG",
  "en-PH",
  "en-PK",
  "en-PN",
  "en-PR",
  "en-PW",
  "en-RW",
  "en-SB",
  "en-SC",
  "en-SD",
  "en-SE",
  "en-SG",
  "en-SH",
  "en-SI",
  "en-SL",
  "en-SS",
  "en-SX",
  "en-SZ",
  "en-TC",
  "en-TK",
  "en-TO",
  "en-TT",
  "en-TV",
  "en-TZ",
  "en-UG",
  "en-UM",
  "en-VC",
  "en-VG",
  "en-VI",
  "en-VU",
  "en-WS",
  "en-ZA",
  "en-ZM",
  "en-ZW",
  "en",
  "eo",
  "es-419",
  "es-AR",
  "es-BO",
  "es-BR",
  "es-BZ",
  "es-CL",
  "es-CO",
  "es-CR",
  "es-CU",
  "es-DO",
  "es-EA",
  "es-EC",
  "es-GQ",
  "es-GT",
  "es-HN",
  "es-IC",
  "es-MX",
  "es-NI",
  "es-PA",
  "es-PE",
  "es-PH",
  "es-PR",
  "es-PY",
  "es-SV",
  "es-US",
  "es-UY",
  "es-VE",
  "es",
  "et",
  "eu",
  "ewo",
  "fa-AF",
  "fa",
  "ff-Adlm-BF",
  "ff-Adlm-CM",
  "ff-Adlm-GH",
  "ff-Adlm-GM",
  "ff-Adlm-GW",
  "ff-Adlm-LR",
  "ff-Adlm-MR",
  "ff-Adlm-NE",
  "ff-Adlm-NG",
  "ff-Adlm-SL",
  "ff-Adlm-SN",
  "ff-Adlm",
  "ff-Latn-BF",
  "ff-Latn-CM",
  "ff-Latn-GH",
  "ff-Latn-GM",
  "ff-Latn-GN",
  "ff-Latn-GW",
  "ff-Latn-LR",
  "ff-Latn-MR",
  "ff-Latn-NE",
  "ff-Latn-NG",
  "ff-Latn-SL",
  "ff-Latn",
  "ff",
  "fi",
  "fil",
  "fo-DK",
  "fo",
  "fr-BE",
  "fr-BF",
  "fr-BI",
  "fr-BJ",
  "fr-BL",
  "fr-CA",
  "fr-CD",
  "fr-CF",
  "fr-CG",
  "fr-CH",
  "fr-CI",
  "fr-CM",
  "fr-DJ",
  "fr-DZ",
  "fr-GA",
  "fr-GF",
  "fr-GN",
  "fr-GP",
  "fr-GQ",
  "fr-HT",
  "fr-KM",
  "fr-LU",
  "fr-MA",
  "fr-MC",
  "fr-MF",
  "fr-MG",
  "fr-ML",
  "fr-MQ",
  "fr-MR",
  "fr-MU",
  "fr-NC",
  "fr-NE",
  "fr-PF",
  "fr-PM",
  "fr-RE",
  "fr-RW",
  "fr-SC",
  "fr-SN",
  "fr-SY",
  "fr-TD",
  "fr-TG",
  "fr-TN",
  "fr-VU",
  "fr-WF",
  "fr-YT",
  "fr",
  "fur",
  "fy",
  "ga-GB",
  "ga",
  "gd",
  "gl",
  "gsw-FR",
  "gsw-LI",
  "gsw",
  "gu",
  "guz",
  "gv",
  "ha-GH",
  "ha-NE",
  "ha",
  "haw",
  "he",
  "hi",
  "hr-BA",
  "hr",
  "hsb",
  "hu",
  "hy",
  "ia",
  "id",
  "ig",
  "ii",
  "is",
  "it-CH",
  "it-SM",
  "it-VA",
  "it",
  "ja",
  "jgo",
  "jmc",
  "jv",
  "ka",
  "kab",
  "kam",
  "kde",
  "kea",
  "kgp",
  "khq",
  "ki",
  "kk",
  "kkj",
  "kl",
  "kln",
  "km",
  "kn",
  "ko-KP",
  "ko",
  "kok",
  "ks-Arab",
  "ks",
  "ksb",
  "ksf",
  "ksh",
  "ku",
  "kw",
  "ky",
  "lag",
  "lb",
  "lg",
  "lkt",
  "ln-AO",
  "ln-CF",
  "ln-CG",
  "ln",
  "lo",
  "lrc-IQ",
  "lrc",
  "lt",
  "lu",
  "luo",
  "luy",
  "lv",
  "mai",
  "mas-TZ",
  "mas",
  "mer",
  "mfe",
  "mg",
  "mgh",
  "mgo",
  "mi",
  "mk",
  "ml",
  "mn",
  "mni-Beng",
  "mni",
  "mr",
  "ms-BN",
  "ms-ID",
  "ms-SG",
  "ms",
  "mt",
  "mua",
  "my",
  "mzn",
  "naq",
  "nb-SJ",
  "nb",
  "nd",
  "nds-NL",
  "nds",
  "ne-IN",
  "ne",
  "nl-AW",
  "nl-BE",
  "nl-BQ",
  "nl-CW",
  "nl-SR",
  "nl-SX",
  "nl",
  "nmg",
  "nn",
  "nnh",
  "no",
  "nus",
  "nyn",
  "om-KE",
  "om",
  "or",
  "os-RU",
  "os",
  "pa-Arab",
  "pa-Guru",
  "pa",
  "pcm",
  "pl",
  "ps-PK",
  "ps",
  "pt-AO",
  "pt-CH",
  "pt-CV",
  "pt-GQ",
  "pt-GW",
  "pt-LU",
  "pt-MO",
  "pt-MZ",
  "pt-PT",
  "pt-ST",
  "pt-TL",
  "pt",
  "qu-BO",
  "qu-EC",
  "qu",
  "rm",
  "rn",
  "ro-MD",
  "ro",
  "rof",
  "ru-BY",
  "ru-KG",
  "ru-KZ",
  "ru-MD",
  "ru-UA",
  "ru",
  "rw",
  "rwk",
  "sa",
  "sah",
  "saq",
  "sat-Olck",
  "sat",
  "sbp",
  "sc",
  "sd-Arab",
  "sd-Deva",
  "sd",
  "se-FI",
  "se-SE",
  "se",
  "seh",
  "ses",
  "sg",
  "shi-Latn",
  "shi-Tfng",
  "shi",
  "si",
  "sk",
  "sl",
  "smn",
  "sn",
  "so-DJ",
  "so-ET",
  "so-KE",
  "so",
  "sq-MK",
  "sq-XK",
  "sq",
  "sr-Cyrl-BA",
  "sr-Cyrl-ME",
  "sr-Cyrl-XK",
  "sr-Cyrl",
  "sr-Latn-BA",
  "sr-Latn-ME",
  "sr-Latn-XK",
  "sr-Latn",
  "sr",
  "su-Latn",
  "su",
  "sv-AX",
  "sv-FI",
  "sv",
  "sw-CD",
  "sw-KE",
  "sw-UG",
  "sw",
  "ta-LK",
  "ta-MY",
  "ta-SG",
  "ta",
  "te",
  "teo-KE",
  "teo",
  "tg",
  "th",
  "ti-ER",
  "ti",
  "tk",
  "to",
  "tr-CY",
  "tr",
  "tt",
  "twq",
  "tzm",
  "ug",
  "uk",
  "und",
  "ur-IN",
  "ur",
  "uz-Arab",
  "uz-Cyrl",
  "uz-Latn",
  "uz",
  "vai-Latn",
  "vai-Vaii",
  "vai",
  "vi",
  "vun",
  "wae",
  "wo",
  "xh",
  "xog",
  "yav",
  "yi",
  "yo-BJ",
  "yo",
  "yrl-CO",
  "yrl-VE",
  "yrl",
  "yue-Hans",
  "yue-Hant",
  "yue",
  "zgh",
  "zh-Hans-HK",
  "zh-Hans-MO",
  "zh-Hans-SG",
  "zh-Hans",
  "zh-Hant-HK",
  "zh-Hant-MO",
  "zh-Hant",
  "zh",
  "zu",
];
const y = window.localStorage || {},
  A = {
    "zh-cn": "zh-Hans",
    "zh-sg": "zh-Hans",
    "zh-my": "zh-Hans",
    "zh-tw": "zh-Hant",
    "zh-hk": "zh-Hant",
    "zh-mo": "zh-Hant",
    zh: "zh-Hant",
  };
function I(e) {
  if (e in a.translations) return e;
  const n = e.toLowerCase();
  if (n in A) return A[n];
  const r = Object.keys(a.translations).find((e) => e.toLowerCase() === n);
  return r || (e.includes("-") ? I(e.split("-")[0]) : void 0);
}
const G = new Set(),
  N = [];
("Locale" in Intl &&
  !(function () {
    try {
      return "x-private" === new Intl.Locale("und-x-private").toString();
    } catch (e) {
      return !0;
    }
  })()) ||
  N.push(import("./c.146bd8ba.js")),
  (function (e) {
    if (
      (void 0 === e && (e = "en"),
      !("PluralRules" in Intl) ||
        "one" ===
          new Intl.PluralRules("en", { minimumFractionDigits: 2 }).select(1) ||
        !(function (e) {
          if (!e) return !0;
          var n = Array.isArray(e) ? e : [e];
          return Intl.PluralRules.supportedLocalesOf(n).length === n.length;
        })(e))
    )
      return e ? i([e], c, "en") : void 0;
  })() &&
    (N.push(import("./c.d3a1c985.js")), N.push(import("./c.e23b0d0b.js"))),
  (function (e) {
    if (
      (void 0 === e && (e = "en"),
      !("RelativeTimeFormat" in Intl) ||
        !(function (e) {
          if (!e) return !0;
          var n = Array.isArray(e) ? e : [e];
          return (
            Intl.RelativeTimeFormat.supportedLocalesOf(n).length === n.length
          );
        })(e) ||
        !(function (e) {
          try {
            return (
              "numberingSystem" in
              new Intl.RelativeTimeFormat(e || "en", {
                numeric: "auto",
              }).resolvedOptions()
            );
          } catch (e) {
            return !1;
          }
        })(e))
    )
      return M([e], S, "en");
  })() && N.push(import("./c.7606b61b.js")),
  (function (e) {
    if (
      (void 0 === e && (e = "en"),
      !("DateTimeFormat" in Intl) ||
        !("formatToParts" in Intl.DateTimeFormat.prototype) ||
        !("formatRange" in Intl.DateTimeFormat.prototype) ||
        (function () {
          try {
            return (
              "dayPeriod" !==
              new Intl.DateTimeFormat("en", {
                hourCycle: "h11",
                hour: "numeric",
              }).formatToParts(0)[2].type
            );
          } catch (e) {
            return !1;
          }
        })() ||
        (function () {
          try {
            return !!new Intl.DateTimeFormat("en", {
              dateStyle: "short",
              hour: "numeric",
            }).format(new Date(0));
          } catch (e) {
            return !1;
          }
        })() ||
        !(function () {
          try {
            return !!new Intl.DateTimeFormat(void 0, {
              dateStyle: "short",
            }).resolvedOptions().dateStyle;
          } catch (e) {
            return !1;
          }
        })() ||
        !(function (e) {
          if (!e) return !0;
          var n = Array.isArray(e) ? e : [e];
          return Intl.DateTimeFormat.supportedLocalesOf(n).length === n.length;
        })(e))
    )
      return e ? M([e], C, "en") : void 0;
  })() &&
    (N.push(import("./c.b02ad375.js")), N.push(import("./c.ad739743.js")));
const O =
    0 === N.length
      ? void 0
      : Promise.all(N).then(() =>
          T(
            (function () {
              let e = null;
              if (y.selectedLanguage)
                try {
                  const n = JSON.parse(y.selectedLanguage);
                  if (n && ((e = I(n)), e)) return e;
                } catch (e) {}
              if (navigator.languages)
                for (const n of navigator.languages)
                  if (((e = I(n)), e)) return e;
              return (e = I(navigator.language)), e || "en";
            })()
          )
        ),
  T = async (e) => {
    if (!G.has(e)) {
      G.add(e);
      try {
        if (
          Intl.NumberFormat &&
          "function" == typeof Intl.NumberFormat.__addLocaleData
        ) {
          const n = await fetch(
            `/static/locale-data/intl-numberformat/${e}.json`
          );
          Intl.NumberFormat.__addLocaleData(await n.json());
        }
        if (
          Intl.RelativeTimeFormat &&
          "function" == typeof Intl.RelativeTimeFormat.__addLocaleData
        ) {
          const n = await fetch(
            `/static/locale-data/intl-relativetimeformat/${e}.json`
          );
          Intl.RelativeTimeFormat.__addLocaleData(await n.json());
        }
        if (
          Intl.DateTimeFormat &&
          "function" == typeof Intl.DateTimeFormat.__addLocaleData
        ) {
          const n = await fetch(
            `/static/locale-data/intl-datetimeformat/${e}.json`
          );
          Intl.DateTimeFormat.__addLocaleData(await n.json());
        }
      } catch (e) {}
    }
  };
export { E as a, b, k as i, f as l, O as p };
