!(function () {
  "use strict";
  var t = {
      9160: function (t, n, r) {
        var e = r(30553),
          o = r(71414),
          i = TypeError;
        t.exports = function (t) {
          if (e(t)) return t;
          throw new i(o(t) + " is not a function");
        };
      },
      22933: function (t, n, r) {
        var e = r(38475),
          o = String,
          i = TypeError;
        t.exports = function (t) {
          if (e(t)) return t;
          throw new i(o(t) + " is not an object");
        };
      },
      52838: function (t, n, r) {
        var e = r(58849),
          o = r(54991),
          i = r(51012);
        t.exports = e
          ? function (t, n, r) {
              return o.f(t, n, i(1, r));
            }
          : function (t, n, r) {
              return (t[n] = r), t;
            };
      },
      51012: function (t) {
        t.exports = function (t, n) {
          return {
            enumerable: !(1 & t),
            configurable: !(2 & t),
            writable: !(4 & t),
            value: n,
          };
        };
      },
      40030: function (t, n, r) {
        var e = r(23141),
          o = r(54991);
        t.exports = function (t, n, r) {
          return (
            r.get && e(r.get, n, { getter: !0 }),
            r.set && e(r.set, n, { setter: !0 }),
            o.f(t, n, r)
          );
        };
      },
      64040: function (t, n, r) {
        var e = r(5813),
          o = Object.defineProperty;
        t.exports = function (t, n) {
          try {
            o(e, t, { value: n, configurable: !0, writable: !0 });
          } catch (r) {
            e[t] = n;
          }
          return n;
        };
      },
      58849: function (t, n, r) {
        var e = r(18431);
        t.exports = !e(function () {
          return (
            7 !==
            Object.defineProperty({}, 1, {
              get: function () {
                return 7;
              },
            })[1]
          );
        });
      },
      55836: function (t, n, r) {
        var e = r(5813),
          o = r(38475),
          i = e.document,
          u = o(i) && o(i.createElement);
        t.exports = function (t) {
          return u ? i.createElement(t) : {};
        };
      },
      68360: function (t) {
        t.exports =
          ("undefined" != typeof navigator && String(navigator.userAgent)) ||
          "";
      },
      91625: function (t, n, r) {
        var e,
          o,
          i = r(5813),
          u = r(68360),
          c = i.process,
          a = i.Deno,
          f = (c && c.versions) || (a && a.version),
          s = f && f.v8;
        s && (o = (e = s.split("."))[0] > 0 && e[0] < 4 ? 1 : +(e[0] + e[1])),
          !o &&
            u &&
            (!(e = u.match(/Edge\/(\d+)/)) || e[1] >= 74) &&
            (e = u.match(/Chrome\/(\d+)/)) &&
            (o = +e[1]),
          (t.exports = o);
      },
      18431: function (t) {
        t.exports = function (t) {
          try {
            return !!t();
          } catch (n) {
            return !0;
          }
        };
      },
      39760: function (t, n, r) {
        var e = r(18431);
        t.exports = !e(function () {
          var t = function () {}.bind();
          return "function" != typeof t || t.hasOwnProperty("prototype");
        });
      },
      43173: function (t, n, r) {
        var e = r(39760),
          o = Function.prototype.call;
        t.exports = e
          ? o.bind(o)
          : function () {
              return o.apply(o, arguments);
            };
      },
      83875: function (t, n, r) {
        var e = r(58849),
          o = r(55229),
          i = Function.prototype,
          u = e && Object.getOwnPropertyDescriptor,
          c = o(i, "name"),
          a = c && "something" === function () {}.name,
          f = c && (!e || (e && u(i, "name").configurable));
        t.exports = { EXISTS: c, PROPER: a, CONFIGURABLE: f };
      },
      55418: function (t, n, r) {
        var e = r(39760),
          o = Function.prototype,
          i = o.call,
          u = e && o.bind.bind(i, i);
        t.exports = e
          ? u
          : function (t) {
              return function () {
                return i.apply(t, arguments);
              };
            };
      },
      29694: function (t, n, r) {
        var e = r(5813),
          o = r(30553);
        t.exports = function (t, n) {
          return arguments.length < 2
            ? ((r = e[t]), o(r) ? r : void 0)
            : e[t] && e[t][n];
          var r;
        };
      },
      54339: function (t, n, r) {
        var e = r(9160),
          o = r(59317);
        t.exports = function (t, n) {
          var r = t[n];
          return o(r) ? void 0 : e(r);
        };
      },
      5813: function (t) {
        var n = function (t) {
          return t && t.Math === Math && t;
        };
        t.exports =
          n("object" == typeof globalThis && globalThis) ||
          n("object" == typeof window && window) ||
          n("object" == typeof self && self) ||
          n("object" == typeof global && global) ||
          n("object" == typeof this && this) ||
          (function () {
            return this;
          })() ||
          Function("return this")();
      },
      55229: function (t, n, r) {
        var e = r(55418),
          o = r(19480),
          i = e({}.hasOwnProperty);
        t.exports =
          Object.hasOwn ||
          function (t, n) {
            return i(o(t), n);
          };
      },
      46170: function (t) {
        t.exports = {};
      },
      33642: function (t, n, r) {
        var e = r(58849),
          o = r(18431),
          i = r(55836);
        t.exports =
          !e &&
          !o(function () {
            return (
              7 !==
              Object.defineProperty(i("div"), "a", {
                get: function () {
                  return 7;
                },
              }).a
            );
          });
      },
      47397: function (t, n, r) {
        var e = r(55418),
          o = r(30553),
          i = r(13036),
          u = e(Function.toString);
        o(i.inspectSource) ||
          (i.inspectSource = function (t) {
            return u(t);
          }),
          (t.exports = i.inspectSource);
      },
      12648: function (t, n, r) {
        var e,
          o,
          i,
          u = r(83777),
          c = r(5813),
          a = r(38475),
          f = r(52838),
          s = r(55229),
          p = r(13036),
          l = r(95292),
          v = r(46170),
          b = "Object already initialized",
          y = c.TypeError,
          d = c.WeakMap;
        if (u || p.state) {
          var h = p.state || (p.state = new d());
          (h.get = h.get),
            (h.has = h.has),
            (h.set = h.set),
            (e = function (t, n) {
              if (h.has(t)) throw new y(b);
              return (n.facade = t), h.set(t, n), n;
            }),
            (o = function (t) {
              return h.get(t) || {};
            }),
            (i = function (t) {
              return h.has(t);
            });
        } else {
          var g = l("state");
          (v[g] = !0),
            (e = function (t, n) {
              if (s(t, g)) throw new y(b);
              return (n.facade = t), f(t, g, n), n;
            }),
            (o = function (t) {
              return s(t, g) ? t[g] : {};
            }),
            (i = function (t) {
              return s(t, g);
            });
        }
        t.exports = {
          set: e,
          get: o,
          has: i,
          enforce: function (t) {
            return i(t) ? o(t) : e(t, {});
          },
          getterFor: function (t) {
            return function (n) {
              var r;
              if (!a(n) || (r = o(n)).type !== t)
                throw new y("Incompatible receiver, " + t + " required");
              return r;
            };
          },
        };
      },
      30553: function (t) {
        var n = "object" == typeof document && document.all;
        t.exports =
          void 0 === n && void 0 !== n
            ? function (t) {
                return "function" == typeof t || t === n;
              }
            : function (t) {
                return "function" == typeof t;
              };
      },
      59317: function (t) {
        t.exports = function (t) {
          return null == t;
        };
      },
      38475: function (t, n, r) {
        var e = r(30553);
        t.exports = function (t) {
          return "object" == typeof t ? null !== t : e(t);
        };
      },
      95448: function (t) {
        t.exports = !1;
      },
      12052: function (t, n, r) {
        var e = r(29694),
          o = r(30553),
          i = r(95882),
          u = r(58150),
          c = Object;
        t.exports = u
          ? function (t) {
              return "symbol" == typeof t;
            }
          : function (t) {
              var n = e("Symbol");
              return o(n) && i(n.prototype, c(t));
            };
      },
      23141: function (t, n, r) {
        var e = r(55418),
          o = r(18431),
          i = r(30553),
          u = r(55229),
          c = r(58849),
          a = r(83875).CONFIGURABLE,
          f = r(47397),
          s = r(12648),
          p = s.enforce,
          l = s.get,
          v = String,
          b = Object.defineProperty,
          y = e("".slice),
          d = e("".replace),
          h = e([].join),
          g =
            c &&
            !o(function () {
              return 8 !== b(function () {}, "length", { value: 8 }).length;
            }),
          m = String(String).split("String"),
          x = (t.exports = function (t, n, r) {
            "Symbol(" === y(v(n), 0, 7) &&
              (n = "[" + d(v(n), /^Symbol\(([^)]*)\)/, "$1") + "]"),
              r && r.getter && (n = "get " + n),
              r && r.setter && (n = "set " + n),
              (!u(t, "name") || (a && t.name !== n)) &&
                (c
                  ? b(t, "name", { value: n, configurable: !0 })
                  : (t.name = n)),
              g &&
                r &&
                u(r, "arity") &&
                t.length !== r.arity &&
                b(t, "length", { value: r.arity });
            try {
              r && u(r, "constructor") && r.constructor
                ? c && b(t, "prototype", { writable: !1 })
                : t.prototype && (t.prototype = void 0);
            } catch (o) {}
            var e = p(t);
            return (
              u(e, "source") ||
                (e.source = h(m, "string" == typeof n ? n : "")),
              t
            );
          });
        Function.prototype.toString = x(function () {
          return (i(this) && l(this).source) || f(this);
        }, "toString");
      },
      54991: function (t, n, r) {
        var e = r(58849),
          o = r(33642),
          i = r(52649),
          u = r(22933),
          c = r(84297),
          a = TypeError,
          f = Object.defineProperty,
          s = Object.getOwnPropertyDescriptor,
          p = "enumerable",
          l = "configurable",
          v = "writable";
        n.f = e
          ? i
            ? function (t, n, r) {
                if (
                  (u(t),
                  (n = c(n)),
                  u(r),
                  "function" == typeof t &&
                    "prototype" === n &&
                    "value" in r &&
                    v in r &&
                    !r[v])
                ) {
                  var e = s(t, n);
                  e &&
                    e[v] &&
                    ((t[n] = r.value),
                    (r = {
                      configurable: l in r ? r[l] : e[l],
                      enumerable: p in r ? r[p] : e[p],
                      writable: !1,
                    }));
                }
                return f(t, n, r);
              }
            : f
          : function (t, n, r) {
              if ((u(t), (n = c(n)), u(r), o))
                try {
                  return f(t, n, r);
                } catch (e) {}
              if ("get" in r || "set" in r)
                throw new a("Accessors not supported");
              return "value" in r && (t[n] = r.value), t;
            };
      },
      95882: function (t, n, r) {
        var e = r(55418);
        t.exports = e({}.isPrototypeOf);
      },
      9265: function (t, n, r) {
        var e = r(43173),
          o = r(30553),
          i = r(38475),
          u = TypeError;
        t.exports = function (t, n) {
          var r, c;
          if ("string" === n && o((r = t.toString)) && !i((c = e(r, t))))
            return c;
          if (o((r = t.valueOf)) && !i((c = e(r, t)))) return c;
          if ("string" !== n && o((r = t.toString)) && !i((c = e(r, t))))
            return c;
          throw new u("Can't convert object to primitive value");
        };
      },
      43313: function (t, n, r) {
        var e = r(59317),
          o = TypeError;
        t.exports = function (t) {
          if (e(t)) throw new o("Can't call method on " + t);
          return t;
        };
      },
      95292: function (t, n, r) {
        var e = r(82765),
          o = r(92311),
          i = e("keys");
        t.exports = function (t) {
          return i[t] || (i[t] = o(t));
        };
      },
      13036: function (t, n, r) {
        var e = r(5813),
          o = r(64040),
          i = "__core-js_shared__",
          u = e[i] || o(i, {});
        t.exports = u;
      },
      82765: function (t, n, r) {
        var e = r(95448),
          o = r(13036);
        (t.exports = function (t, n) {
          return o[t] || (o[t] = void 0 !== n ? n : {});
        })("versions", []).push({
          version: "3.35.0",
          mode: e ? "pure" : "global",
          copyright: "© 2014-2023 Denis Pushkarev (zloirock.ru)",
          license: "https://github.com/zloirock/core-js/blob/v3.35.0/LICENSE",
          source: "https://github.com/zloirock/core-js",
        });
      },
      63710: function (t, n, r) {
        var e = r(91625),
          o = r(18431),
          i = r(5813).String;
        t.exports =
          !!Object.getOwnPropertySymbols &&
          !o(function () {
            var t = Symbol("symbol detection");
            return (
              !i(t) ||
              !(Object(t) instanceof Symbol) ||
              (!Symbol.sham && e && e < 41)
            );
          });
      },
      19480: function (t, n, r) {
        var e = r(43313),
          o = Object;
        t.exports = function (t) {
          return o(e(t));
        };
      },
      80581: function (t, n, r) {
        var e = r(43173),
          o = r(38475),
          i = r(12052),
          u = r(54339),
          c = r(9265),
          a = r(10282),
          f = TypeError,
          s = a("toPrimitive");
        t.exports = function (t, n) {
          if (!o(t) || i(t)) return t;
          var r,
            a = u(t, s);
          if (a) {
            if (
              (void 0 === n && (n = "default"), (r = e(a, t, n)), !o(r) || i(r))
            )
              return r;
            throw new f("Can't convert object to primitive value");
          }
          return void 0 === n && (n = "number"), c(t, n);
        };
      },
      84297: function (t, n, r) {
        var e = r(80581),
          o = r(12052);
        t.exports = function (t) {
          var n = e(t, "string");
          return o(n) ? n : n + "";
        };
      },
      71414: function (t) {
        var n = String;
        t.exports = function (t) {
          try {
            return n(t);
          } catch (r) {
            return "Object";
          }
        };
      },
      92311: function (t, n, r) {
        var e = r(55418),
          o = 0,
          i = Math.random(),
          u = e((1).toString);
        t.exports = function (t) {
          return "Symbol(" + (void 0 === t ? "" : t) + ")_" + u(++o + i, 36);
        };
      },
      58150: function (t, n, r) {
        var e = r(63710);
        t.exports = e && !Symbol.sham && "symbol" == typeof Symbol.iterator;
      },
      52649: function (t, n, r) {
        var e = r(58849),
          o = r(18431);
        t.exports =
          e &&
          o(function () {
            return (
              42 !==
              Object.defineProperty(function () {}, "prototype", {
                value: 42,
                writable: !1,
              }).prototype
            );
          });
      },
      83777: function (t, n, r) {
        var e = r(5813),
          o = r(30553),
          i = e.WeakMap;
        t.exports = o(i) && /native code/.test(String(i));
      },
      10282: function (t, n, r) {
        var e = r(5813),
          o = r(82765),
          i = r(55229),
          u = r(92311),
          c = r(63710),
          a = r(58150),
          f = e.Symbol,
          s = o("wks"),
          p = a ? f.for || f : (f && f.withoutSetter) || u;
        t.exports = function (t) {
          return (
            i(s, t) || (s[t] = c && i(f, t) ? f[t] : p("Symbol." + t)), s[t]
          );
        };
      },
      22859: function (t, n, r) {
        var e = r(58849),
          o = r(83875).EXISTS,
          i = r(55418),
          u = r(40030),
          c = Function.prototype,
          a = i(c.toString),
          f =
            /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,
          s = i(f.exec);
        e &&
          !o &&
          u(c, "name", {
            configurable: !0,
            get: function () {
              try {
                return s(f, a(this))[1];
              } catch (t) {
                return "";
              }
            },
          });
      },
    },
    n = {};
  function r(e) {
    var o = n[e];
    if (void 0 !== o) return o.exports;
    var i = (n[e] = { exports: {} });
    return t[e].call(i.exports, i, i.exports, r), i.exports;
  }
  !(function () {
    r(22859);
    var t,
      n,
      e,
      o = "ha-main-window",
      i = window.name === o ? window : parent.name === o ? parent : top,
      u = function (t, n) {
        return (function (t, n, r, e) {
          (e = e || {}), (r = null == r ? {} : r);
          var o = new Event(n, {
            bubbles: void 0 === e.bubbles || e.bubbles,
            cancelable: Boolean(e.cancelable),
            composed: void 0 === e.composed || e.composed,
          });
          return (o.detail = r), t.dispatchEvent(o), o;
        })(t, "hass-notification", n);
      };
    (n =
      null == i || null === (t = i.document) || void 0 === t
        ? void 0
        : t.querySelector("home-assistant")),
      (e = null == n ? void 0 : n.hass),
      n.___hacs_reload_handler_active ||
        (e
          ? ((n.___hacs_reload_handler_active = !0),
            e.connection.subscribeEvents(function () {
              u(n, {
                duration: 3e5,
                dismissable: !1,
                message: "[HACS] You need to reload your browser",
                action: {
                  action: function () {
                    i.location.href = i.location.href;
                  },
                  text: "reload",
                },
              });
            }, "hacs_resources_updated"))
          : console.error("[HACS/extra/reload_handler] hass not found"));
  })();
})();
//# sourceMappingURL=extra.Gq4ioglXLxE.js.map
