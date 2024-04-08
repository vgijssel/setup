export const id = 7048;
export const ids = [7048];
export const modules = {
  87048: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 });
    var r = a(2624),
      o = a(95466),
      n = a(77021);
    (0, n.defineProperty)(Intl, "NumberFormat", { value: r.NumberFormat }),
      (0, n.defineProperty)(Number.prototype, "toLocaleString", {
        value: function (e, t) {
          return (0, o.toLocaleString)(this, e, t);
        },
      });
  },
  2624: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.NumberFormat = void 0);
    var r = a(43204),
      o = a(77021),
      n = a(54129),
      i = a(13649),
      m = r.__importDefault(a(75505)),
      l = [
        "locale",
        "numberingSystem",
        "style",
        "currency",
        "currencyDisplay",
        "currencySign",
        "unit",
        "unitDisplay",
        "minimumIntegerDigits",
        "minimumFractionDigits",
        "maximumFractionDigits",
        "minimumSignificantDigits",
        "maximumSignificantDigits",
        "useGrouping",
        "notation",
        "compactDisplay",
        "signDisplay",
      ];
    function u(e) {
      return (0, o.FormatNumericToParts)(this, s(e), {
        getInternalSlots: m.default,
      });
    }
    t.NumberFormat = function (e, a) {
      if (!this || !(0, o.OrdinaryHasInstance)(t.NumberFormat, this))
        return new t.NumberFormat(e, a);
      (0, o.InitializeNumberFormat)(this, e, a, {
        getInternalSlots: m.default,
        localeData: t.NumberFormat.localeData,
        availableLocales: t.NumberFormat.availableLocales,
        getDefaultLocale: t.NumberFormat.getDefaultLocale,
        currencyDigitsData: n.currencyDigitsData,
        numberingSystemNames: i.numberingSystemNames,
      });
      var r = (0, m.default)(this),
        l = r.dataLocale,
        u = t.NumberFormat.localeData[l];
      return (
        (0, o.invariant)(
          void 0 !== u,
          "Cannot load locale-dependent data for ".concat(l, ".")
        ),
        (r.pl = new Intl.PluralRules(l, {
          minimumFractionDigits: r.minimumFractionDigits,
          maximumFractionDigits: r.maximumFractionDigits,
          minimumIntegerDigits: r.minimumIntegerDigits,
          minimumSignificantDigits: r.minimumSignificantDigits,
          maximumSignificantDigits: r.maximumSignificantDigits,
        })),
        this
      );
    };
    try {
      Object.defineProperty(u, "name", {
        value: "formatToParts",
        enumerable: !1,
        writable: !1,
        configurable: !0,
      });
    } catch (e) {}
    (0, o.defineProperty)(t.NumberFormat.prototype, "formatToParts", {
      value: u,
    }),
      (0, o.defineProperty)(t.NumberFormat.prototype, "formatRange", {
        value: function (e, t) {
          return (0, o.FormatNumericRange)(this, e, t, {
            getInternalSlots: m.default,
          });
        },
      }),
      (0, o.defineProperty)(t.NumberFormat.prototype, "formatRangeToParts", {
        value: function (e, t) {
          return (0, o.FormatNumericRangeToParts)(this, e, t, {
            getInternalSlots: m.default,
          });
        },
      }),
      (0, o.defineProperty)(t.NumberFormat.prototype, "resolvedOptions", {
        value: function () {
          if (
            "object" != typeof this ||
            !(0, o.OrdinaryHasInstance)(t.NumberFormat, this)
          )
            throw TypeError(
              "Method Intl.NumberFormat.prototype.resolvedOptions called on incompatible receiver"
            );
          for (
            var e = (0, m.default)(this), a = {}, r = 0, n = l;
            r < n.length;
            r++
          ) {
            var i = n[r],
              u = e[i];
            void 0 !== u && (a[i] = u);
          }
          return (
            "morePrecision" === e.roundingType
              ? (a.roundingPriority = "morePrecision")
              : "lessPrecision" === e.roundingType
              ? (a.roundingPriority = "lessPrecision")
              : (a.roundingPriority = "auto"),
            a
          );
        },
      });
    var c = {
      enumerable: !1,
      configurable: !0,
      get: function () {
        if (
          "object" != typeof this ||
          !(0, o.OrdinaryHasInstance)(t.NumberFormat, this)
        )
          throw TypeError(
            "Intl.NumberFormat format property accessor called on incompatible receiver"
          );
        var e = (0, m.default)(this),
          a = this,
          r = e.boundFormat;
        if (void 0 === r) {
          r = function (e) {
            var t = s(e);
            return a
              .formatToParts(t)
              .map(function (e) {
                return e.value;
              })
              .join("");
          };
          try {
            Object.defineProperty(r, "name", {
              configurable: !0,
              enumerable: !1,
              writable: !1,
              value: "",
            });
          } catch (e) {}
          e.boundFormat = r;
        }
        return r;
      },
    };
    try {
      Object.defineProperty(c.get, "name", {
        configurable: !0,
        enumerable: !1,
        writable: !1,
        value: "get format",
      });
    } catch (e) {}
    function s(e) {
      return "bigint" == typeof e ? e : (0, o.ToNumber)(e);
    }
    Object.defineProperty(t.NumberFormat.prototype, "format", c),
      (0, o.defineProperty)(t.NumberFormat, "supportedLocalesOf", {
        value: function (e, a) {
          return (0, o.SupportedLocales)(
            t.NumberFormat.availableLocales,
            (0, o.CanonicalizeLocaleList)(e),
            a
          );
        },
      }),
      (t.NumberFormat.__addLocaleData = function () {
        for (var e = [], a = 0; a < arguments.length; a++) e[a] = arguments[a];
        for (var r = 0, o = e; r < o.length; r++) {
          var n = o[r],
            i = n.data,
            m = n.locale,
            l = new Intl.Locale(m).minimize().toString();
          (t.NumberFormat.localeData[m] = t.NumberFormat.localeData[l] = i),
            t.NumberFormat.availableLocales.add(l),
            t.NumberFormat.availableLocales.add(m),
            t.NumberFormat.__defaultLocale ||
              (t.NumberFormat.__defaultLocale = l);
        }
      }),
      (t.NumberFormat.__addUnitData = function (e, a) {
        var r = t.NumberFormat.localeData[e];
        if (!r)
          throw new Error(
            'Locale data for "'.concat(
              e,
              '" has not been loaded in NumberFormat. \nPlease __addLocaleData before adding additional unit data'
            )
          );
        for (var o in a.simple) r.units.simple[o] = a.simple[o];
        for (var o in a.compound) r.units.compound[o] = a.compound[o];
      }),
      (t.NumberFormat.__defaultLocale = ""),
      (t.NumberFormat.localeData = {}),
      (t.NumberFormat.availableLocales = new Set()),
      (t.NumberFormat.getDefaultLocale = function () {
        return t.NumberFormat.__defaultLocale;
      }),
      (t.NumberFormat.polyfilled = !0);
    try {
      "undefined" != typeof Symbol &&
        Object.defineProperty(t.NumberFormat.prototype, Symbol.toStringTag, {
          configurable: !0,
          enumerable: !1,
          writable: !1,
          value: "Intl.NumberFormat",
        }),
        Object.defineProperty(t.NumberFormat.prototype.constructor, "length", {
          configurable: !0,
          enumerable: !1,
          writable: !1,
          value: 0,
        }),
        Object.defineProperty(t.NumberFormat.supportedLocalesOf, "length", {
          configurable: !0,
          enumerable: !1,
          writable: !1,
          value: 1,
        }),
        Object.defineProperty(t.NumberFormat, "prototype", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: t.NumberFormat.prototype,
        });
    } catch (e) {}
  },
  54129: (e, t) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.currencyDigitsData = void 0),
      (t.currencyDigitsData = {
        ADP: 0,
        AFN: 0,
        ALL: 0,
        AMD: 2,
        BHD: 3,
        BIF: 0,
        BYN: 2,
        BYR: 0,
        CAD: 2,
        CHF: 2,
        CLF: 4,
        CLP: 0,
        COP: 2,
        CRC: 2,
        CZK: 2,
        DEFAULT: 2,
        DJF: 0,
        DKK: 2,
        ESP: 0,
        GNF: 0,
        GYD: 2,
        HUF: 2,
        IDR: 2,
        IQD: 0,
        IRR: 0,
        ISK: 0,
        ITL: 0,
        JOD: 3,
        JPY: 0,
        KMF: 0,
        KPW: 0,
        KRW: 0,
        KWD: 3,
        LAK: 0,
        LBP: 0,
        LUF: 0,
        LYD: 3,
        MGA: 0,
        MGF: 0,
        MMK: 0,
        MNT: 2,
        MRO: 0,
        MUR: 2,
        NOK: 2,
        OMR: 3,
        PKR: 2,
        PYG: 0,
        RSD: 0,
        RWF: 0,
        SEK: 2,
        SLE: 2,
        SLL: 0,
        SOS: 0,
        STD: 0,
        SYP: 0,
        TMM: 0,
        TND: 3,
        TRL: 0,
        TWD: 2,
        TZS: 2,
        UGX: 0,
        UYI: 0,
        UYW: 4,
        UZS: 2,
        VEF: 2,
        VND: 0,
        VUV: 0,
        XAF: 0,
        XOF: 0,
        XPF: 0,
        YER: 0,
        ZMK: 0,
        ZWD: 0,
      });
  },
  75505: (e, t) => {
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = new WeakMap();
    t.default = function (e) {
      var t = a.get(e);
      return t || ((t = Object.create(null)), a.set(e, t)), t;
    };
  },
  13649: (e, t) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.numberingSystemNames = void 0),
      (t.numberingSystemNames = [
        "adlm",
        "ahom",
        "arab",
        "arabext",
        "armn",
        "armnlow",
        "bali",
        "beng",
        "bhks",
        "brah",
        "cakm",
        "cham",
        "cyrl",
        "deva",
        "diak",
        "ethi",
        "fullwide",
        "geor",
        "gong",
        "gonm",
        "grek",
        "greklow",
        "gujr",
        "guru",
        "hanidays",
        "hanidec",
        "hans",
        "hansfin",
        "hant",
        "hantfin",
        "hebr",
        "hmng",
        "hmnp",
        "java",
        "jpan",
        "jpanfin",
        "jpanyear",
        "kali",
        "kawi",
        "khmr",
        "knda",
        "lana",
        "lanatham",
        "laoo",
        "latn",
        "lepc",
        "limb",
        "mathbold",
        "mathdbl",
        "mathmono",
        "mathsanb",
        "mathsans",
        "mlym",
        "modi",
        "mong",
        "mroo",
        "mtei",
        "mymr",
        "mymrshan",
        "mymrtlng",
        "nagm",
        "newa",
        "nkoo",
        "olck",
        "orya",
        "osma",
        "rohg",
        "roman",
        "romanlow",
        "saur",
        "segment",
        "shrd",
        "sind",
        "sinh",
        "sora",
        "sund",
        "takr",
        "talu",
        "taml",
        "tamldec",
        "telu",
        "thai",
        "tibt",
        "tirh",
        "tnsa",
        "vaii",
        "wara",
        "wcho",
      ]);
  },
  95466: (e, t, a) => {
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.toLocaleString = void 0);
    var r = a(2624);
    t.toLocaleString = function (e, t, a) {
      return new r.NumberFormat(t, a).format(e);
    };
  },
};
//# sourceMappingURL=7048.1i8odnlXQEw.js.map
