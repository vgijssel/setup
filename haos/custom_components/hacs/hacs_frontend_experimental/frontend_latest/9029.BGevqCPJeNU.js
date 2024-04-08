export const id = 9029;
export const ids = [9029];
export const modules = {
  25517: (t, e, a) => {
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r = a(43204),
      l = a(77021),
      n = a(46042);
    function o(t, e) {
      if (!(t instanceof c))
        throw new TypeError(
          "Method Intl.ListFormat.prototype."
            .concat(e, " called on incompatible receiver ")
            .concat(String(t))
        );
    }
    function i(t) {
      if (void 0 === t) return [];
      for (var e = [], a = 0, r = t; a < r.length; a++) {
        var l = r[a];
        if ("string" != typeof l)
          throw new TypeError(
            "array list[".concat(t.indexOf(l), "] is not type String")
          );
        e.push(l);
      }
      return e;
    }
    function _(t, e, a) {
      var r = a.length;
      if (0 === r) return [];
      if (2 === r)
        return s((0, l.getInternalSlot)(t, e, "templatePair"), {
          0: { type: "element", value: a[0] },
          1: { type: "element", value: a[1] },
        });
      for (var n = { type: "element", value: a[r - 1] }, o = r - 2; o >= 0; ) {
        (n = s(
          0 === o
            ? (0, l.getInternalSlot)(t, e, "templateStart")
            : o < r - 2
            ? (0, l.getInternalSlot)(t, e, "templateMiddle")
            : (0, l.getInternalSlot)(t, e, "templateEnd"),
          { 0: { type: "element", value: a[o] }, 1: n }
        )),
          o--;
      }
      return n;
    }
    function s(t, e) {
      for (
        var a = [], r = 0, n = (0, l.PartitionPattern)(t);
        r < n.length;
        r++
      ) {
        var o = n[r],
          i = o.type;
        if ((0, l.isLiteralPart)(o))
          a.push({ type: "literal", value: o.value });
        else {
          (0, l.invariant)(i in e, "".concat(i, " is missing from placables"));
          var _ = e[i];
          Array.isArray(_) ? a.push.apply(a, _) : a.push(_);
        }
      }
      return a;
    }
    var c = (function () {
      function t(e, a) {
        if (!(this && this instanceof t ? this.constructor : void 0))
          throw new TypeError("Intl.ListFormat must be called with 'new'");
        (0, l.setInternalSlot)(
          t.__INTERNAL_SLOT_MAP__,
          this,
          "initializedListFormat",
          !0
        );
        var r = (0, l.CanonicalizeLocaleList)(e),
          o = Object.create(null),
          i = (0, l.GetOptionsObject)(a),
          _ = (0, l.GetOption)(
            i,
            "localeMatcher",
            "string",
            ["best fit", "lookup"],
            "best fit"
          );
        o.localeMatcher = _;
        var s = t.localeData,
          c = (0, n.ResolveLocale)(
            t.availableLocales,
            r,
            o,
            t.relevantExtensionKeys,
            s,
            t.getDefaultLocale
          );
        (0, l.setInternalSlot)(
          t.__INTERNAL_SLOT_MAP__,
          this,
          "locale",
          c.locale
        );
        var u = (0, l.GetOption)(
          i,
          "type",
          "string",
          ["conjunction", "disjunction", "unit"],
          "conjunction"
        );
        (0, l.setInternalSlot)(t.__INTERNAL_SLOT_MAP__, this, "type", u);
        var p = (0, l.GetOption)(
          i,
          "style",
          "string",
          ["long", "short", "narrow"],
          "long"
        );
        (0, l.setInternalSlot)(t.__INTERNAL_SLOT_MAP__, this, "style", p);
        var f = c.dataLocale,
          L = s[f];
        (0, l.invariant)(!!L, "Missing locale data for ".concat(f));
        var v = L[u][p];
        (0, l.setInternalSlot)(
          t.__INTERNAL_SLOT_MAP__,
          this,
          "templatePair",
          v.pair
        ),
          (0, l.setInternalSlot)(
            t.__INTERNAL_SLOT_MAP__,
            this,
            "templateStart",
            v.start
          ),
          (0, l.setInternalSlot)(
            t.__INTERNAL_SLOT_MAP__,
            this,
            "templateMiddle",
            v.middle
          ),
          (0, l.setInternalSlot)(
            t.__INTERNAL_SLOT_MAP__,
            this,
            "templateEnd",
            v.end
          );
      }
      return (
        (t.prototype.format = function (e) {
          o(this, "format");
          var a = "",
            r = _(t.__INTERNAL_SLOT_MAP__, this, i(e));
          if (!Array.isArray(r)) return r.value;
          for (var l = 0, n = r; l < n.length; l++) {
            a += n[l].value;
          }
          return a;
        }),
        (t.prototype.formatToParts = function (e) {
          o(this, "format");
          var a = _(t.__INTERNAL_SLOT_MAP__, this, i(e));
          if (!Array.isArray(a)) return [a];
          for (var l = [], n = 0, s = a; n < s.length; n++) {
            var c = s[n];
            l.push(r.__assign({}, c));
          }
          return l;
        }),
        (t.prototype.resolvedOptions = function () {
          return (
            o(this, "resolvedOptions"),
            {
              locale: (0, l.getInternalSlot)(
                t.__INTERNAL_SLOT_MAP__,
                this,
                "locale"
              ),
              type: (0, l.getInternalSlot)(
                t.__INTERNAL_SLOT_MAP__,
                this,
                "type"
              ),
              style: (0, l.getInternalSlot)(
                t.__INTERNAL_SLOT_MAP__,
                this,
                "style"
              ),
            }
          );
        }),
        (t.supportedLocalesOf = function (e, a) {
          return (0, l.SupportedLocales)(
            t.availableLocales,
            (0, l.CanonicalizeLocaleList)(e),
            a
          );
        }),
        (t.__addLocaleData = function () {
          for (var e = [], a = 0; a < arguments.length; a++)
            e[a] = arguments[a];
          for (var r = 0, l = e; r < l.length; r++) {
            var n = l[r],
              o = n.data,
              i = n.locale,
              _ = new Intl.Locale(i).minimize().toString();
            (t.localeData[i] = t.localeData[_] = o),
              t.availableLocales.add(_),
              t.availableLocales.add(i),
              t.__defaultLocale || (t.__defaultLocale = _);
          }
        }),
        (t.getDefaultLocale = function () {
          return t.__defaultLocale;
        }),
        (t.localeData = {}),
        (t.availableLocales = new Set()),
        (t.__defaultLocale = ""),
        (t.relevantExtensionKeys = []),
        (t.polyfilled = !0),
        (t.__INTERNAL_SLOT_MAP__ = new WeakMap()),
        t
      );
    })();
    e.default = c;
    try {
      "undefined" != typeof Symbol &&
        Object.defineProperty(c.prototype, Symbol.toStringTag, {
          value: "Intl.ListFormat",
          writable: !1,
          enumerable: !1,
          configurable: !0,
        }),
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
    } catch (t) {}
  },
  69029: (t, e, a) => {
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r = a(43204).__importDefault(a(25517));
    Object.defineProperty(Intl, "ListFormat", {
      value: r.default,
      writable: !0,
      enumerable: !1,
      configurable: !0,
    });
  },
};
//# sourceMappingURL=9029.BGevqCPJeNU.js.map
