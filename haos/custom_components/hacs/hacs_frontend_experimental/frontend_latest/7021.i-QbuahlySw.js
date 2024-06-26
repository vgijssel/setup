export const id = 7021;
export const ids = [7021];
export const modules = {
  77021: (e, n, r) => {
    function t(e) {
      return Intl.getCanonicalLocales(e);
    }
    function u(e, n) {
      var r = n.zoneNames,
        t = n.uppercaseLinks,
        u = e.toUpperCase(),
        i = r.reduce(function (e, n) {
          return (e[n.toUpperCase()] = n), e;
        }, {}),
        a = t[u] || i[u];
      return "Etc/UTC" === a || "Etc/GMT" === a ? "UTC" : a;
    }
    function i(e) {
      if ("symbol" == typeof e)
        throw TypeError("Cannot convert a Symbol value to a string");
      return String(e);
    }
    function a(e) {
      if (void 0 === e) return NaN;
      if (null === e) return 0;
      if ("boolean" == typeof e) return e ? 1 : 0;
      if ("number" == typeof e) return e;
      if ("symbol" == typeof e || "bigint" == typeof e)
        throw new TypeError("Cannot convert symbol/bigint to number");
      return Number(e);
    }
    function o(e) {
      return isFinite(e)
        ? Math.abs(e) > 8640000000000001
          ? NaN
          : (function (e) {
              var n = a(e);
              if (isNaN(n) || l(n, -0)) return 0;
              if (isFinite(n)) return n;
              var r = Math.floor(Math.abs(n));
              return n < 0 && (r = -r), l(r, -0) ? 0 : r;
            })(e)
        : NaN;
    }
    function c(e) {
      if (null == e)
        throw new TypeError("undefined/null cannot be converted to object");
      return Object(e);
    }
    function l(e, n) {
      return Object.is
        ? Object.is(e, n)
        : e === n
        ? 0 !== e || 1 / e == 1 / n
        : e != e && n != n;
    }
    function s(e) {
      return new Array(e);
    }
    function f(e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }
    function m(e) {
      return null === e
        ? "Null"
        : void 0 === e
        ? "Undefined"
        : "function" == typeof e || "object" == typeof e
        ? "Object"
        : "number" == typeof e
        ? "Number"
        : "boolean" == typeof e
        ? "Boolean"
        : "string" == typeof e
        ? "String"
        : "symbol" == typeof e
        ? "Symbol"
        : "bigint" == typeof e
        ? "BigInt"
        : void 0;
    }
    r.r(n),
      r.d(n, {
        ApplyUnsignedRoundingMode: () => J,
        ArrayCreate: () => s,
        CanonicalizeLocaleList: () => t,
        CanonicalizeTimeZoneName: () => u,
        CoerceOptionsToObject: () => L,
        CollapseNumberRange: () => K,
        ComputeExponent: () => fe,
        ComputeExponentForMagnitude: () => oe,
        CurrencyDigits: () => me,
        DateFromTime: () => S,
        Day: () => p,
        DayFromYear: () => y,
        DayWithinYear: () => b,
        DaysInYear: () => v,
        FormatApproximately: () => ge,
        FormatNumericRange: () => we,
        FormatNumericRangeToParts: () => Ie,
        FormatNumericToParts: () => Ae,
        FormatNumericToString: () => se,
        GetNumberOption: () => P,
        GetOption: () => U,
        GetOptionsObject: () => z,
        GetStringOrBooleanOption: () => G,
        GetUnsignedRoundingMode: () => Be,
        HasOwnProperty: () => f,
        HourFromTime: () => T,
        InLeapYear: () => E,
        InitializeNumberFormat: () => je,
        IsSanctionedSimpleUnitIdentifier: () => V,
        IsValidTimeZoneName: () => W,
        IsWellFormedCurrencyCode: () => H,
        IsWellFormedUnitIdentifier: () => q,
        MinFromTime: () => M,
        MonthFromTime: () => C,
        OrdinaryHasInstance: () => k,
        PartitionNumberPattern: () => Ce,
        PartitionNumberRangePattern: () => Se,
        PartitionPattern: () => Le,
        RangePatternType: () => Pe,
        SANCTIONED_UNITS: () => _,
        SIMPLE_UNITS: () => Z,
        SameValue: () => l,
        SecFromTime: () => O,
        SetNumberFormatDigitOptions: () => Me,
        SetNumberFormatUnitOptions: () => Oe,
        SupportedLocales: () => Re,
        TimeClip: () => o,
        TimeFromYear: () => h,
        ToNumber: () => a,
        ToObject: () => c,
        ToRawFixed: () => le,
        ToRawPrecision: () => ce,
        ToString: () => i,
        Type: () => m,
        WeekDay: () => d,
        YearFromTime: () => F,
        _formatToParts: () => Fe,
        defineProperty: () => ie,
        getInternalSlot: () => re,
        getMagnitude: () => Q,
        getMultiInternalSlots: () => te,
        invariant: () => ae,
        isLiteralPart: () => ue,
        isMissingLocaleDataError: () => ze,
        msFromTime: () => j,
        removeUnitNamespace: () => Y,
        setInternalSlot: () => ee,
        setMultiInternalSlots: () => ne,
      });
    var g = 864e5;
    function D(e, n) {
      return e - Math.floor(e / n) * n;
    }
    function p(e) {
      return Math.floor(e / g);
    }
    function d(e) {
      return D(p(e) + 4, 7);
    }
    function y(e) {
      return Date.UTC(e, 0) / g;
    }
    function h(e) {
      return Date.UTC(e, 0);
    }
    function F(e) {
      return new Date(e).getUTCFullYear();
    }
    function v(e) {
      return e % 4 != 0 ? 365 : e % 100 != 0 ? 366 : e % 400 != 0 ? 365 : 366;
    }
    function b(e) {
      return p(e) - y(F(e));
    }
    function E(e) {
      return 365 === v(F(e)) ? 0 : 1;
    }
    function C(e) {
      var n = b(e),
        r = E(e);
      if (n >= 0 && n < 31) return 0;
      if (n < 59 + r) return 1;
      if (n < 90 + r) return 2;
      if (n < 120 + r) return 3;
      if (n < 151 + r) return 4;
      if (n < 181 + r) return 5;
      if (n < 212 + r) return 6;
      if (n < 243 + r) return 7;
      if (n < 273 + r) return 8;
      if (n < 304 + r) return 9;
      if (n < 334 + r) return 10;
      if (n < 365 + r) return 11;
      throw new Error("Invalid time");
    }
    function S(e) {
      var n = b(e),
        r = C(e),
        t = E(e);
      if (0 === r) return n + 1;
      if (1 === r) return n - 30;
      if (2 === r) return n - 58 - t;
      if (3 === r) return n - 89 - t;
      if (4 === r) return n - 119 - t;
      if (5 === r) return n - 150 - t;
      if (6 === r) return n - 180 - t;
      if (7 === r) return n - 211 - t;
      if (8 === r) return n - 242 - t;
      if (9 === r) return n - 272 - t;
      if (10 === r) return n - 303 - t;
      if (11 === r) return n - 333 - t;
      throw new Error("Invalid time");
    }
    var w = 24,
      I = 60,
      A = 60,
      N = 1e3,
      x = N * A,
      B = x * I;
    function T(e) {
      return D(Math.floor(e / B), w);
    }
    function M(e) {
      return D(Math.floor(e / x), I);
    }
    function O(e) {
      return D(Math.floor(e / N), A);
    }
    function k(e, n, r) {
      if ("function" != typeof e) return !1;
      if (null == r ? void 0 : r.boundTargetFunction)
        return n instanceof (null == r ? void 0 : r.boundTargetFunction);
      if ("object" != typeof n) return !1;
      var t = e.prototype;
      if ("object" != typeof t)
        throw new TypeError(
          "OrdinaryHasInstance called on an object with an invalid prototype property."
        );
      return Object.prototype.isPrototypeOf.call(t, n);
    }
    function j(e) {
      return D(e, N);
    }
    function L(e) {
      return void 0 === e ? Object.create(null) : c(e);
    }
    function R(e, n, r, t) {
      if (void 0 === e) return t;
      var u = Number(e);
      if (isNaN(u) || u < n || u > r)
        throw new RangeError(
          "".concat(u, " is outside of range [").concat(n, ", ").concat(r, "]")
        );
      return Math.floor(u);
    }
    function P(e, n, r, t, u) {
      return R(e[n], r, t, u);
    }
    function U(e, n, r, t, u) {
      if ("object" != typeof e)
        throw new TypeError("Options must be an object");
      var a = e[n];
      if (void 0 !== a) {
        if ("boolean" !== r && "string" !== r)
          throw new TypeError("invalid type");
        if (
          ("boolean" === r && (a = Boolean(a)),
          "string" === r && (a = i(a)),
          void 0 !== t &&
            !t.filter(function (e) {
              return e == a;
            }).length)
        )
          throw new RangeError(
            "".concat(a, " is not within ").concat(t.join(", "))
          );
        return a;
      }
      return u;
    }
    function z(e) {
      if (void 0 === e) return Object.create(null);
      if ("object" == typeof e) return e;
      throw new TypeError("Options must be an object");
    }
    function G(e, n, r, t, u, a) {
      var o = e[n];
      if (void 0 === o) return a;
      if (!0 === o) return t;
      if (!1 === Boolean(o)) return u;
      if ("true" === (o = i(o)) || "false" === o) return a;
      if (-1 === (r || []).indexOf(o))
        throw new RangeError("Invalid value ".concat(o));
      return o;
    }
    var _ = [
      "angle-degree",
      "area-acre",
      "area-hectare",
      "concentr-percent",
      "digital-bit",
      "digital-byte",
      "digital-gigabit",
      "digital-gigabyte",
      "digital-kilobit",
      "digital-kilobyte",
      "digital-megabit",
      "digital-megabyte",
      "digital-petabyte",
      "digital-terabit",
      "digital-terabyte",
      "duration-day",
      "duration-hour",
      "duration-millisecond",
      "duration-minute",
      "duration-month",
      "duration-second",
      "duration-week",
      "duration-year",
      "length-centimeter",
      "length-foot",
      "length-inch",
      "length-kilometer",
      "length-meter",
      "length-mile-scandinavian",
      "length-mile",
      "length-millimeter",
      "length-yard",
      "mass-gram",
      "mass-kilogram",
      "mass-ounce",
      "mass-pound",
      "mass-stone",
      "temperature-celsius",
      "temperature-fahrenheit",
      "volume-fluid-ounce",
      "volume-gallon",
      "volume-liter",
      "volume-milliliter",
    ];
    function Y(e) {
      return e.slice(e.indexOf("-") + 1);
    }
    var Z = _.map(Y);
    function V(e) {
      return Z.indexOf(e) > -1;
    }
    function W(e, n) {
      var r = n.zoneNamesFromData,
        t = n.uppercaseLinks,
        u = e.toUpperCase(),
        i = new Set(),
        a = new Set();
      return (
        r
          .map(function (e) {
            return e.toUpperCase();
          })
          .forEach(function (e) {
            return i.add(e);
          }),
        Object.keys(t).forEach(function (e) {
          a.add(e.toUpperCase()), i.add(t[e].toUpperCase());
        }),
        i.has(u) || a.has(u)
      );
    }
    var $ = /[^A-Z]/;
    function H(e) {
      return (
        3 ===
          (e = e.replace(/([a-z])/g, function (e, n) {
            return n.toUpperCase();
          })).length && !$.test(e)
      );
    }
    function q(e) {
      if (
        V(
          (e = e.replace(/([A-Z])/g, function (e, n) {
            return n.toLowerCase();
          }))
        )
      )
        return !0;
      var n = e.split("-per-");
      if (2 !== n.length) return !1;
      var r = n[0],
        t = n[1];
      return !(!V(r) || !V(t));
    }
    function J(e, n, r, t) {
      if (e === n) return n;
      if (void 0 === t) throw new Error("unsignedRoundingMode is mandatory");
      if ("zero" === t) return n;
      if ("infinity" === t) return r;
      var u = e - n,
        i = r - e;
      if (u < i) return n;
      if (i < u) return r;
      if (u !== i) throw new Error("Unexpected error");
      if ("half-zero" === t) return n;
      if ("half-infinity" === t) return r;
      if ("half-even" !== t)
        throw new Error(
          "Unexpected value for unsignedRoundingMode: ".concat(t)
        );
      return 0 === (n / (r - n)) % 2 ? n : r;
    }
    function K(e) {
      return e;
    }
    function Q(e) {
      return Math.floor(Math.log(e) * Math.LOG10E);
    }
    function X(e, n) {
      if ("function" == typeof e.repeat) return e.repeat(n);
      for (var r = new Array(n), t = 0; t < r.length; t++) r[t] = e;
      return r.join("");
    }
    function ee(e, n, r, t) {
      e.get(n) || e.set(n, Object.create(null)), (e.get(n)[r] = t);
    }
    function ne(e, n, r) {
      for (var t = 0, u = Object.keys(r); t < u.length; t++) {
        var i = u[t];
        ee(e, n, i, r[i]);
      }
    }
    function re(e, n, r) {
      return te(e, n, r)[r];
    }
    function te(e, n) {
      for (var r = [], t = 2; t < arguments.length; t++)
        r[t - 2] = arguments[t];
      var u = e.get(n);
      if (!u)
        throw new TypeError(
          "".concat(n, " InternalSlot has not been initialized")
        );
      return r.reduce(function (e, n) {
        return (e[n] = u[n]), e;
      }, Object.create(null));
    }
    function ue(e) {
      return "literal" === e.type;
    }
    function ie(e, n, r) {
      var t = r.value;
      Object.defineProperty(e, n, {
        configurable: !0,
        enumerable: !1,
        writable: !0,
        value: t,
      });
    }
    function ae(e, n, r) {
      if ((void 0 === r && (r = Error), !e)) throw new r(n);
    }
    function oe(e, n, r) {
      var t = (0, r.getInternalSlots)(e),
        u = t.notation,
        i = t.dataLocaleData,
        a = t.numberingSystem;
      switch (u) {
        case "standard":
          return 0;
        case "scientific":
          return n;
        case "engineering":
          return 3 * Math.floor(n / 3);
        default:
          var o = t.compactDisplay,
            c = t.style,
            l = t.currencyDisplay,
            s = void 0;
          if ("currency" === c && "name" !== l) {
            s = (i.numbers.currency[a] || i.numbers.currency[i.numbers.nu[0]])
              .short;
          } else {
            var f = i.numbers.decimal[a] || i.numbers.decimal[i.numbers.nu[0]];
            s = "long" === o ? f.long : f.short;
          }
          if (!s) return 0;
          var m = String(Math.pow(10, n)),
            g = Object.keys(s);
          if (m < g[0]) return 0;
          if (m > g[g.length - 1]) return g[g.length - 1].length - 1;
          var D = g.indexOf(m);
          if (-1 === D) return 0;
          var p = g[D];
          return "0" === s[p].other
            ? 0
            : p.length - s[p].other.match(/0+/)[0].length;
      }
    }
    function ce(e, n, r) {
      var t,
        u,
        i,
        a,
        o = r;
      if (0 === e) (t = X("0", o)), (u = 0), (i = 0);
      else {
        var c = e.toString(),
          l = c.indexOf("e"),
          s = c.split("e"),
          f = s[0],
          m = s[1],
          g = f.replace(".", "");
        if (l >= 0 && g.length <= o)
          (u = +m), (t = g + X("0", o - g.length)), (i = e);
        else {
          var D = (u = Q(e)) - o + 1,
            p = Math.round(y(e, D));
          y(p, o - 1) >= 10 && ((u += 1), (p = Math.floor(p / 10))),
            (t = p.toString()),
            (i = y(p, o - 1 - u));
        }
      }
      if (
        (u >= o - 1
          ? ((t += X("0", u - o + 1)), (a = u + 1))
          : u >= 0
          ? ((t = "".concat(t.slice(0, u + 1), ".").concat(t.slice(u + 1))),
            (a = u + 1))
          : ((t = "0.".concat(X("0", -u - 1)).concat(t)), (a = 1)),
        t.indexOf(".") >= 0 && r > n)
      ) {
        for (var d = r - n; d > 0 && "0" === t[t.length - 1]; )
          (t = t.slice(0, -1)), d--;
        "." === t[t.length - 1] && (t = t.slice(0, -1));
      }
      return { formattedString: t, roundedNumber: i, integerDigitsCount: a };
      function y(e, n) {
        return n < 0 ? e * Math.pow(10, -n) : e / Math.pow(10, n);
      }
    }
    function le(e, n, r) {
      var t,
        u,
        i = r,
        a = Math.round(e * Math.pow(10, i)),
        o = a / Math.pow(10, i);
      if (a < 1e21) t = a.toString();
      else {
        var c = (t = a.toString()).split("e"),
          l = c[0],
          s = c[1];
        (t = l.replace(".", "")), (t += X("0", Math.max(+s - t.length + 1, 0)));
      }
      if (0 !== i) {
        var f = t.length;
        if (f <= i) (t = X("0", i + 1 - f) + t), (f = i + 1);
        var m = t.slice(0, f - i),
          g = t.slice(f - i);
        (t = "".concat(m, ".").concat(g)), (u = m.length);
      } else u = t.length;
      for (var D = r - n; D > 0 && "0" === t[t.length - 1]; )
        (t = t.slice(0, -1)), D--;
      return (
        "." === t[t.length - 1] && (t = t.slice(0, -1)),
        { formattedString: t, roundedNumber: o, integerDigitsCount: u }
      );
    }
    function se(e, n) {
      var r,
        t = n < 0 || l(n, -0);
      switch ((t && (n = -n), e.roundingType)) {
        case "significantDigits":
          r = ce(n, e.minimumSignificantDigits, e.maximumSignificantDigits);
          break;
        case "fractionDigits":
          r = le(n, e.minimumFractionDigits, e.maximumFractionDigits);
          break;
        default:
          (r = ce(n, 1, 2)).integerDigitsCount > 1 && (r = le(n, 0, 0));
      }
      n = r.roundedNumber;
      var u = r.formattedString,
        i = r.integerDigitsCount,
        a = e.minimumIntegerDigits;
      i < a && (u = X("0", a - i) + u);
      return t && (n = -n), { roundedNumber: n, formattedString: u };
    }
    function fe(e, n, r) {
      var t = r.getInternalSlots;
      if (0 === n) return [0, 0];
      n < 0 && (n = -n);
      var u = Q(n),
        i = oe(e, u, { getInternalSlots: t });
      n = i < 0 ? n * Math.pow(10, -i) : n / Math.pow(10, i);
      var a = se(t(e), n);
      return 0 === a.roundedNumber || Q(a.roundedNumber) === u - i
        ? [i, u]
        : [oe(e, u + 1, { getInternalSlots: t }), u + 1];
    }
    function me(e, n) {
      var r = n.currencyDigitsData;
      return f(r, e) ? r[e] : 2;
    }
    function ge(e, n, r) {
      var t = (0, r.getInternalSlots)(e),
        u =
          t.dataLocaleData.numbers.symbols[t.numberingSystem].approximatelySign;
      return n.push({ type: "approximatelySign", value: u }), n;
    }
    var De = {
        adlm: ["𞥐", "𞥑", "𞥒", "𞥓", "𞥔", "𞥕", "𞥖", "𞥗", "𞥘", "𞥙"],
        ahom: ["𑜰", "𑜱", "𑜲", "𑜳", "𑜴", "𑜵", "𑜶", "𑜷", "𑜸", "𑜹"],
        arab: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
        arabext: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        bali: ["᭐", "᭑", "᭒", "᭓", "᭔", "᭕", "᭖", "᭗", "᭘", "᭙"],
        beng: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
        bhks: ["𑱐", "𑱑", "𑱒", "𑱓", "𑱔", "𑱕", "𑱖", "𑱗", "𑱘", "𑱙"],
        brah: ["𑁦", "𑁧", "𑁨", "𑁩", "𑁪", "𑁫", "𑁬", "𑁭", "𑁮", "𑁯"],
        cakm: ["𑄶", "𑄷", "𑄸", "𑄹", "𑄺", "𑄻", "𑄼", "𑄽", "𑄾", "𑄿"],
        cham: ["꩐", "꩑", "꩒", "꩓", "꩔", "꩕", "꩖", "꩗", "꩘", "꩙"],
        deva: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
        diak: ["𑥐", "𑥑", "𑥒", "𑥓", "𑥔", "𑥕", "𑥖", "𑥗", "𑥘", "𑥙"],
        fullwide: ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"],
        gong: ["𑶠", "𑶡", "𑶢", "𑶣", "𑶤", "𑶥", "𑶦", "𑶧", "𑶨", "𑶩"],
        gonm: ["𑵐", "𑵑", "𑵒", "𑵓", "𑵔", "𑵕", "𑵖", "𑵗", "𑵘", "𑵙"],
        gujr: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"],
        guru: ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"],
        hanidec: ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
        hmng: ["𖭐", "𖭑", "𖭒", "𖭓", "𖭔", "𖭕", "𖭖", "𖭗", "𖭘", "𖭙"],
        hmnp: ["𞅀", "𞅁", "𞅂", "𞅃", "𞅄", "𞅅", "𞅆", "𞅇", "𞅈", "𞅉"],
        java: ["꧐", "꧑", "꧒", "꧓", "꧔", "꧕", "꧖", "꧗", "꧘", "꧙"],
        kali: ["꤀", "꤁", "꤂", "꤃", "꤄", "꤅", "꤆", "꤇", "꤈", "꤉"],
        khmr: ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"],
        knda: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
        lana: ["᪀", "᪁", "᪂", "᪃", "᪄", "᪅", "᪆", "᪇", "᪈", "᪉"],
        lanatham: ["᪐", "᪑", "᪒", "᪓", "᪔", "᪕", "᪖", "᪗", "᪘", "᪙"],
        laoo: ["໐", "໑", "໒", "໓", "໔", "໕", "໖", "໗", "໘", "໙"],
        lepc: ["᪐", "᪑", "᪒", "᪓", "᪔", "᪕", "᪖", "᪗", "᪘", "᪙"],
        limb: ["᥆", "᥇", "᥈", "᥉", "᥊", "᥋", "᥌", "᥍", "᥎", "᥏"],
        mathbold: ["𝟎", "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", "𝟔", "𝟕", "𝟖", "𝟗"],
        mathdbl: ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"],
        mathmono: ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"],
        mathsanb: ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"],
        mathsans: ["𝟢", "𝟣", "𝟤", "𝟥", "𝟦", "𝟧", "𝟨", "𝟩", "𝟪", "𝟫"],
        mlym: ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"],
        modi: ["𑙐", "𑙑", "𑙒", "𑙓", "𑙔", "𑙕", "𑙖", "𑙗", "𑙘", "𑙙"],
        mong: ["᠐", "᠑", "᠒", "᠓", "᠔", "᠕", "᠖", "᠗", "᠘", "᠙"],
        mroo: ["𖩠", "𖩡", "𖩢", "𖩣", "𖩤", "𖩥", "𖩦", "𖩧", "𖩨", "𖩩"],
        mtei: ["꯰", "꯱", "꯲", "꯳", "꯴", "꯵", "꯶", "꯷", "꯸", "꯹"],
        mymr: ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"],
        mymrshan: ["႐", "႑", "႒", "႓", "႔", "႕", "႖", "႗", "႘", "႙"],
        mymrtlng: ["꧰", "꧱", "꧲", "꧳", "꧴", "꧵", "꧶", "꧷", "꧸", "꧹"],
        newa: ["𑑐", "𑑑", "𑑒", "𑑓", "𑑔", "𑑕", "𑑖", "𑑗", "𑑘", "𑑙"],
        nkoo: ["߀", "߁", "߂", "߃", "߄", "߅", "߆", "߇", "߈", "߉"],
        olck: ["᱐", "᱑", "᱒", "᱓", "᱔", "᱕", "᱖", "᱗", "᱘", "᱙"],
        orya: ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
        osma: ["𐒠", "𐒡", "𐒢", "𐒣", "𐒤", "𐒥", "𐒦", "𐒧", "𐒨", "𐒩"],
        rohg: ["𐴰", "𐴱", "𐴲", "𐴳", "𐴴", "𐴵", "𐴶", "𐴷", "𐴸", "𐴹"],
        saur: ["꣐", "꣑", "꣒", "꣓", "꣔", "꣕", "꣖", "꣗", "꣘", "꣙"],
        segment: ["🯰", "🯱", "🯲", "🯳", "🯴", "🯵", "🯶", "🯷", "🯸", "🯹"],
        shrd: ["𑇐", "𑇑", "𑇒", "𑇓", "𑇔", "𑇕", "𑇖", "𑇗", "𑇘", "𑇙"],
        sind: ["𑋰", "𑋱", "𑋲", "𑋳", "𑋴", "𑋵", "𑋶", "𑋷", "𑋸", "𑋹"],
        sinh: ["෦", "෧", "෨", "෩", "෪", "෫", "෬", "෭", "෮", "෯"],
        sora: ["𑃰", "𑃱", "𑃲", "𑃳", "𑃴", "𑃵", "𑃶", "𑃷", "𑃸", "𑃹"],
        sund: ["᮰", "᮱", "᮲", "᮳", "᮴", "᮵", "᮶", "᮷", "᮸", "᮹"],
        takr: ["𑛀", "𑛁", "𑛂", "𑛃", "𑛄", "𑛅", "𑛆", "𑛇", "𑛈", "𑛉"],
        talu: ["᧐", "᧑", "᧒", "᧓", "᧔", "᧕", "᧖", "᧗", "᧘", "᧙"],
        tamldec: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
        telu: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
        thai: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"],
        tibt: ["༠", "༡", "༢", "༣", "༤", "༥", "༦", "༧", "༨", "༩"],
        tirh: ["𑓐", "𑓑", "𑓒", "𑓓", "𑓔", "𑓕", "𑓖", "𑓗", "𑓘", "𑓙"],
        vaii: ["ᘠ", "ᘡ", "ᘢ", "ᘣ", "ᘤ", "ᘥ", "ᘦ", "ᘧ", "ᘨ", "ᘩ"],
        wara: ["𑣠", "𑣡", "𑣢", "𑣣", "𑣤", "𑣥", "𑣦", "𑣧", "𑣨", "𑣩"],
        wcho: ["𞋰", "𞋱", "𞋲", "𞋳", "𞋴", "𞋵", "𞋶", "𞋷", "𞋸", "𞋹"],
      },
      pe =
        /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/,
      de = new RegExp("^".concat(pe.source)),
      ye = new RegExp("".concat(pe.source, "$")),
      he = /[#0](?:[\.,][#0]+)*/g;
    function Fe(e, n, r, t) {
      var u,
        i,
        a = e.sign,
        o = e.exponent,
        c = e.magnitude,
        l = t.notation,
        s = t.style,
        f = t.numberingSystem,
        m = n.numbers.nu[0],
        g = null;
      if (
        ("compact" === l &&
          c &&
          (g = (function (e, n, r, t, u, i, a) {
            var o,
              c,
              l = e.roundedNumber,
              s = e.sign,
              f = e.magnitude,
              m = String(Math.pow(10, f)),
              g = r.numbers.nu[0];
            if ("currency" === t && "name" !== i) {
              var D =
                null === (o = ((p = r.numbers.currency)[a] || p[g]).short) ||
                void 0 === o
                  ? void 0
                  : o[m];
              if (!D) return null;
              c = Ee(n, l, D);
            } else {
              var p,
                d = ((p = r.numbers.decimal)[a] || p[g])[u][m];
              if (!d) return null;
              c = Ee(n, l, d);
            }
            if ("0" === c) return null;
            return (
              (c = be(c, s)
                .replace(/([^\s;\-\+\d¤]+)/g, "{c:$1}")
                .replace(/0+/, "0")),
              c
            );
          })(e, r, n, s, t.compactDisplay, t.currencyDisplay, f)),
        "currency" === s && "name" !== t.currencyDisplay)
      ) {
        var D = n.currencies[t.currency];
        if (D)
          switch (t.currencyDisplay) {
            case "code":
              u = t.currency;
              break;
            case "symbol":
              u = D.symbol;
              break;
            default:
              u = D.narrow;
          }
        else u = t.currency;
      }
      if (g) i = g;
      else if (
        "decimal" === s ||
        "unit" === s ||
        ("currency" === s && "name" === t.currencyDisplay)
      )
        i = be((n.numbers.decimal[f] || n.numbers.decimal[m]).standard, a);
      else if ("currency" === s) {
        i = be(
          (d = n.numbers.currency[f] || n.numbers.currency[m])[t.currencySign],
          a
        );
      } else {
        i = be(n.numbers.percent[f] || n.numbers.percent[m], a);
      }
      var p = he.exec(i)[0];
      if (
        ((i = i.replace(he, "{0}").replace(/'(.)'/g, "$1")),
        "currency" === s && "name" !== t.currencyDisplay)
      ) {
        var d,
          y = (d = n.numbers.currency[f] || n.numbers.currency[m])
            .currencySpacing.afterInsertBetween;
        y && !ye.test(u) && (i = i.replace("¤{0}", "¤".concat(y, "{0}")));
        var h = d.currencySpacing.beforeInsertBetween;
        h && !de.test(u) && (i = i.replace("{0}¤", "{0}".concat(h, "¤")));
      }
      for (
        var F = i.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g),
          v = [],
          b = n.numbers.symbols[f] || n.numbers.symbols[m],
          E = 0,
          C = F;
        E < C.length;
        E++
      ) {
        if ((_ = C[E]))
          switch (_) {
            case "{0}":
              v.push.apply(
                v,
                ve(b, e, l, o, f, !g && Boolean(t.useGrouping), p)
              );
              break;
            case "-":
              v.push({ type: "minusSign", value: b.minusSign });
              break;
            case "+":
              v.push({ type: "plusSign", value: b.plusSign });
              break;
            case "%":
              v.push({ type: "percentSign", value: b.percentSign });
              break;
            case "¤":
              v.push({ type: "currency", value: u });
              break;
            default:
              /^\{c:/.test(_)
                ? v.push({
                    type: "compact",
                    value: _.substring(3, _.length - 1),
                  })
                : v.push({ type: "literal", value: _ });
          }
      }
      switch (s) {
        case "currency":
          if ("name" === t.currencyDisplay) {
            var S = (n.numbers.currency[f] || n.numbers.currency[m])
                .unitPattern,
              w = void 0,
              I = n.currencies[t.currency];
            w = I
              ? Ee(r, e.roundedNumber * Math.pow(10, o), I.displayName)
              : t.currency;
            for (
              var A = [], N = 0, x = S.split(/(\{[01]\})/g);
              N < x.length;
              N++
            ) {
              switch ((_ = x[N])) {
                case "{0}":
                  A.push.apply(A, v);
                  break;
                case "{1}":
                  A.push({ type: "currency", value: w });
                  break;
                default:
                  _ && A.push({ type: "literal", value: _ });
              }
            }
            return A;
          }
          return v;
        case "unit":
          var B = t.unit,
            T = t.unitDisplay,
            M = n.units.simple[B];
          S = void 0;
          if (M)
            S = Ee(r, e.roundedNumber * Math.pow(10, o), n.units.simple[B][T]);
          else {
            var O = B.split("-per-"),
              k = O[0],
              j = O[1];
            M = n.units.simple[k];
            var L = Ee(
                r,
                e.roundedNumber * Math.pow(10, o),
                n.units.simple[k][T]
              ),
              R = n.units.simple[j].perUnit[T];
            if (R) S = R.replace("{0}", L);
            else {
              var P = n.units.compound.per[T],
                U = Ee(r, 1, n.units.simple[j][T]);
              S = S = P.replace("{0}", L).replace("{1}", U.replace("{0}", ""));
            }
          }
          A = [];
          for (var z = 0, G = S.split(/(\s*\{0\}\s*)/); z < G.length; z++) {
            var _ = G[z],
              Y = /^(\s*)\{0\}(\s*)$/.exec(_);
            Y
              ? (Y[1] && A.push({ type: "literal", value: Y[1] }),
                A.push.apply(A, v),
                Y[2] && A.push({ type: "literal", value: Y[2] }))
              : _ && A.push({ type: "unit", value: _ });
          }
          return A;
        default:
          return v;
      }
    }
    function ve(e, n, r, t, u, i, a) {
      var o = [],
        c = n.formattedString,
        l = n.roundedNumber;
      if (isNaN(l)) return [{ type: "nan", value: c }];
      if (!isFinite(l)) return [{ type: "infinity", value: c }];
      var s = De[u];
      s &&
        (c = c.replace(/\d/g, function (e) {
          return s[+e] || e;
        }));
      var f,
        m,
        g = c.indexOf(".");
      if (
        (g > 0 ? ((f = c.slice(0, g)), (m = c.slice(g + 1))) : (f = c),
        i && ("compact" !== r || l >= 1e4))
      ) {
        var D = e.group,
          p = [],
          d = a.split(".")[0].split(","),
          y = 3,
          h = 3;
        d.length > 1 && (y = d[d.length - 1].length),
          d.length > 2 && (h = d[d.length - 2].length);
        var F = f.length - y;
        if (F > 0) {
          for (p.push(f.slice(F, F + y)), F -= h; F > 0; F -= h)
            p.push(f.slice(F, F + h));
          p.push(f.slice(0, F + h));
        } else p.push(f);
        for (; p.length > 0; ) {
          var v = p.pop();
          o.push({ type: "integer", value: v }),
            p.length > 0 && o.push({ type: "group", value: D });
        }
      } else o.push({ type: "integer", value: f });
      if (
        (void 0 !== m &&
          o.push(
            { type: "decimal", value: e.decimal },
            { type: "fraction", value: m }
          ),
        ("scientific" === r || "engineering" === r) && isFinite(l))
      ) {
        o.push({ type: "exponentSeparator", value: e.exponential }),
          t < 0 &&
            (o.push({ type: "exponentMinusSign", value: e.minusSign }),
            (t = -t));
        var b = le(t, 0, 0);
        o.push({ type: "exponentInteger", value: b.formattedString });
      }
      return o;
    }
    function be(e, n) {
      e.indexOf(";") < 0 && (e = "".concat(e, ";-").concat(e));
      var r = e.split(";"),
        t = r[0],
        u = r[1];
      switch (n) {
        case 0:
          return t;
        case -1:
          return u;
        default:
          return u.indexOf("-") >= 0 ? u.replace(/-/g, "+") : "+".concat(t);
      }
    }
    function Ee(e, n, r) {
      return r[e.select(n)] || r.other;
    }
    function Ce(e, n, r) {
      var t,
        u,
        i,
        a = r.getInternalSlots,
        o = a(e),
        c = o.pl,
        s = o.dataLocaleData,
        f = o.numberingSystem,
        m = s.numbers.symbols[f] || s.numbers.symbols[s.numbers.nu[0]],
        g = 0,
        D = 0;
      if (isNaN(n)) u = m.nan;
      else if (n == Number.POSITIVE_INFINITY || n == Number.NEGATIVE_INFINITY)
        u = m.infinity;
      else {
        if (!l(n, -0)) {
          if (!isFinite(n))
            throw new Error("Input must be a mathematical value");
          "percent" == o.style && (n *= 100),
            (D = (t = fe(e, n, { getInternalSlots: a }))[0]),
            (g = t[1]),
            (n = D < 0 ? n * Math.pow(10, -D) : n / Math.pow(10, D));
        }
        var p = se(o, n);
        (u = p.formattedString), (n = p.roundedNumber);
      }
      switch (o.signDisplay) {
        case "never":
          i = 0;
          break;
        case "auto":
          i = l(n, 0) || n > 0 || isNaN(n) ? 0 : -1;
          break;
        case "always":
          i = l(n, 0) || n > 0 || isNaN(n) ? 1 : -1;
          break;
        default:
          i = 0 === n || isNaN(n) ? 0 : n > 0 ? 1 : -1;
      }
      return Fe(
        {
          roundedNumber: n,
          formattedString: u,
          exponent: D,
          magnitude: g,
          sign: i,
        },
        o.dataLocaleData,
        c,
        o
      );
    }
    function Se(e, n, r, t) {
      var u = t.getInternalSlots;
      if (isNaN(n) || isNaN(r)) throw new RangeError("Input must be a number");
      var i = [],
        a = Ce(e, n, { getInternalSlots: u }),
        o = Ce(e, r, { getInternalSlots: u });
      if (a === o) return ge(e, a, { getInternalSlots: u });
      for (var c = 0, l = a; c < l.length; c++) {
        l[c].source = "startRange";
      }
      i = i.concat(a);
      var s = u(e),
        f = s.dataLocaleData.numbers.symbols[s.numberingSystem];
      i.push({ type: "literal", value: f.rangeSign, source: "shared" });
      for (var m = 0, g = o; m < g.length; m++) {
        g[m].source = "endRange";
      }
      return (i = i.concat(o));
    }
    function we(e, n, r, t) {
      return Se(e, n, r, { getInternalSlots: t.getInternalSlots })
        .map(function (e) {
          return e.value;
        })
        .join("");
    }
    function Ie(e, n, r, t) {
      return Se(e, n, r, { getInternalSlots: t.getInternalSlots }).map(
        function (e, n) {
          return {
            type: e.type,
            value: e.value,
            source: e.source,
            result: n.toString(),
          };
        }
      );
    }
    function Ae(e, n, r) {
      for (var t = Ce(e, n, r), u = s(0), i = 0, a = t; i < a.length; i++) {
        var o = a[i];
        u.push({ type: o.type, value: o.value });
      }
      return u;
    }
    var Ne = {
        ceil: "zero",
        floor: "infinity",
        expand: "infinity",
        trunc: "zero",
        halfCeil: "half-zero",
        halfFloor: "half-infinity",
        halfExpand: "half-infinity",
        halfTrunc: "half-zero",
        halfEven: "half-even",
      },
      xe = {
        ceil: "infinity",
        floor: "zero",
        expand: "infinity",
        trunc: "zero",
        halfCeil: "half-infinity",
        halfFloor: "half-zero",
        halfExpand: "half-infinity",
        halfTrunc: "half-zero",
        halfEven: "half-even",
      };
    function Be(e, n) {
      return n ? Ne[e] : xe[e];
    }
    var Te = r(46042);
    function Me(e, n, r, t, u) {
      var i = P(n, "minimumIntegerDigits", 1, 21, 1),
        a = n.minimumFractionDigits,
        o = n.maximumFractionDigits,
        c = n.minimumSignificantDigits,
        l = n.maximumSignificantDigits;
      e.minimumIntegerDigits = i;
      var s = U(
          n,
          "roundingPriority",
          "string",
          ["auto", "morePrecision", "lessPrecision"],
          "auto"
        ),
        f = void 0 !== c || void 0 !== l,
        m = void 0 !== a || void 0 !== o,
        g = !0,
        D = !0;
      if (
        ("auto" === s && ((g = f), (f || (!m && "compact" === u)) && (D = !1)),
        g &&
          (f
            ? ((c = R(c, 1, 21, 1)),
              (l = R(l, c, 21, 21)),
              (e.minimumSignificantDigits = c),
              (e.maximumSignificantDigits = l))
            : ((e.minimumSignificantDigits = 1),
              (e.maximumSignificantDigits = 21))),
        D)
      )
        if (m) {
          if (
            ((a = R(a, 0, 20, void 0)), (o = R(o, 0, 20, void 0)), void 0 === a)
          )
            a = Math.min(r, o);
          else if (void 0 === o) o = Math.max(t, a);
          else if (a > o)
            throw new RangeError("Invalid range, ".concat(a, " > ").concat(o));
          (e.minimumFractionDigits = a), (e.maximumFractionDigits = o);
        } else (e.minimumFractionDigits = r), (e.maximumFractionDigits = t);
      g || D
        ? (e.roundingType =
            "morePrecision" === s
              ? "morePrecision"
              : "lessPrecision" === s
              ? "lessPrecision"
              : f
              ? "significantDigits"
              : "fractionDigits")
        : ((e.roundingType = "morePrecision"),
          (e.minimumFractionDigits = 0),
          (e.maximumFractionDigits = 0),
          (e.minimumSignificantDigits = 1),
          (e.maximumSignificantDigits = 2));
    }
    function Oe(e, n, r) {
      void 0 === n && (n = Object.create(null));
      var t = (0, r.getInternalSlots)(e),
        u = U(
          n,
          "style",
          "string",
          ["decimal", "percent", "currency", "unit"],
          "decimal"
        );
      t.style = u;
      var i = U(n, "currency", "string", void 0, void 0);
      if (void 0 !== i && !H(i)) throw RangeError("Malformed currency code");
      if ("currency" === u && void 0 === i)
        throw TypeError("currency cannot be undefined");
      var a = U(
          n,
          "currencyDisplay",
          "string",
          ["code", "symbol", "narrowSymbol", "name"],
          "symbol"
        ),
        o = U(
          n,
          "currencySign",
          "string",
          ["standard", "accounting"],
          "standard"
        ),
        c = U(n, "unit", "string", void 0, void 0);
      if (void 0 !== c && !q(c))
        throw RangeError("Invalid unit argument for Intl.NumberFormat()");
      if ("unit" === u && void 0 === c)
        throw TypeError("unit cannot be undefined");
      var l = U(
        n,
        "unitDisplay",
        "string",
        ["short", "narrow", "long"],
        "short"
      );
      "currency" === u &&
        ((t.currency = i.toUpperCase()),
        (t.currencyDisplay = a),
        (t.currencySign = o)),
        "unit" === u && ((t.unit = c), (t.unitDisplay = l));
    }
    var ke = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1e3, 2e3];
    function je(e, n, r, u) {
      var i = u.getInternalSlots,
        a = u.localeData,
        o = u.availableLocales,
        c = u.numberingSystemNames,
        l = u.getDefaultLocale,
        s = u.currencyDigitsData,
        f = t(n),
        m = L(r),
        g = Object.create(null),
        D = U(m, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
      g.localeMatcher = D;
      var p = U(m, "numberingSystem", "string", void 0, void 0);
      if (void 0 !== p && c.indexOf(p) < 0)
        throw RangeError("Invalid numberingSystems: ".concat(p));
      g.nu = p;
      var d = (0, Te.ResolveLocale)(Array.from(o), f, g, ["nu"], a, l),
        y = a[d.dataLocale];
      ae(!!y, "Missing locale data for ".concat(d.dataLocale));
      var h = i(e);
      (h.locale = d.locale),
        (h.dataLocale = d.dataLocale),
        (h.numberingSystem = d.nu),
        (h.dataLocaleData = y),
        Oe(e, m, { getInternalSlots: i });
      var F,
        v,
        b = h.style;
      if ("currency" === b) {
        var E = me(h.currency, { currencyDigitsData: s });
        (F = E), (v = E);
      } else (F = 0), (v = "percent" === b ? 0 : 3);
      var C = U(
        m,
        "notation",
        "string",
        ["standard", "scientific", "engineering", "compact"],
        "standard"
      );
      (h.notation = C), Me(h, m, F, v, C);
      var S = P(m, "roundingIncrement", 1, 5e3, 1);
      if (-1 === ke.indexOf(S))
        throw new RangeError(
          "Invalid rounding increment value: "
            .concat(S, ".\nValid values are ")
            .concat(ke, ".")
        );
      if (1 !== S && "fractionDigits" !== h.roundingType)
        throw new TypeError(
          "For roundingIncrement > 1 only fractionDigits is a valid roundingType"
        );
      if (1 !== S && h.maximumFractionDigits !== h.minimumFractionDigits)
        throw new RangeError(
          "With roundingIncrement > 1, maximumFractionDigits and minimumFractionDigits must be equal."
        );
      h.roundingIncrement = S;
      var w = U(
        m,
        "trailingZeroDisplay",
        "string",
        ["auto", "stripIfInteger"],
        "auto"
      );
      h.trailingZeroDisplay = w;
      var I = U(m, "compactDisplay", "string", ["short", "long"], "short"),
        A = "auto";
      return (
        "compact" === C && ((h.compactDisplay = I), (A = "min2")),
        (h.useGrouping = G(
          m,
          "useGrouping",
          ["min2", "auto", "always"],
          "always",
          !1,
          A
        )),
        (h.signDisplay = U(
          m,
          "signDisplay",
          "string",
          ["auto", "never", "always", "exceptZero", "negative"],
          "auto"
        )),
        (h.roundingMode = U(
          m,
          "roundingMode",
          "string",
          [
            "ceil",
            "floor",
            "expand",
            "trunc",
            "halfCeil",
            "halfFloor",
            "halfExpand",
            "halfTrunc",
            "halfEven",
          ],
          "halfExpand"
        )),
        e
      );
    }
    function Le(e) {
      for (
        var n = [], r = e.indexOf("{"), t = 0, u = 0, i = e.length;
        r < e.length && r > -1;

      )
        ae((t = e.indexOf("}", r)) > r, "Invalid pattern ".concat(e)),
          r > u && n.push({ type: "literal", value: e.substring(u, r) }),
          n.push({ type: e.substring(r + 1, t), value: void 0 }),
          (u = t + 1),
          (r = e.indexOf("{", u));
      return u < i && n.push({ type: "literal", value: e.substring(u, i) }), n;
    }
    function Re(e, n, r) {
      return (
        void 0 !== r &&
          U(
            (r = c(r)),
            "localeMatcher",
            "string",
            ["lookup", "best fit"],
            "best fit"
          ),
        (0, Te.LookupSupportedLocales)(Array.from(e), n)
      );
    }
    var Pe,
      Ue = r(43204);
    !(function (e) {
      function n() {
        var n = (null !== e && e.apply(this, arguments)) || this;
        return (n.type = "MISSING_LOCALE_DATA"), n;
      }
      (0, Ue.__extends)(n, e);
    })(Error);
    function ze(e) {
      return "MISSING_LOCALE_DATA" === e.type;
    }
    !(function (e) {
      (e.startRange = "startRange"),
        (e.shared = "shared"),
        (e.endRange = "endRange");
    })(Pe || (Pe = {}));
  },
};
//# sourceMappingURL=7021.i-QbuahlySw.js.map
