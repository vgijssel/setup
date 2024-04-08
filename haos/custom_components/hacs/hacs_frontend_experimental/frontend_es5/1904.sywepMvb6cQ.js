/*! For license information please see 1904.sywepMvb6cQ.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1904],
  {
    837: function (t, e, r) {
      r.d(e, {
        Z: function () {
          return n;
        },
      });
      r(85717);
      var n = function (t, e, r, n, i) {
        return t.connection.subscribeMessage(i, {
          type: "template/start_preview",
          flow_id: e,
          flow_type: r,
          user_input: n,
        });
      };
    },
    21904: function (t, e, r) {
      function n(t) {
        return (
          (n =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          n(t)
        );
      }
      function i() {
        i = function () {
          return e;
        };
        var t,
          e = {},
          r = Object.prototype,
          o = r.hasOwnProperty,
          a =
            Object.defineProperty ||
            function (t, e, r) {
              t[e] = r.value;
            },
          s = "function" == typeof Symbol ? Symbol : {},
          u = s.iterator || "@@iterator",
          c = s.asyncIterator || "@@asyncIterator",
          l = s.toStringTag || "@@toStringTag";
        function h(t, e, r) {
          return (
            Object.defineProperty(t, e, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          h({}, "");
        } catch (t) {
          h = function (t, e, r) {
            return (t[e] = r);
          };
        }
        function f(t, e, r, n) {
          var i = e && e.prototype instanceof _ ? e : _,
            o = Object.create(i.prototype),
            s = new T(n || []);
          return a(o, "_invoke", { value: O(t, r, s) }), o;
        }
        function d(t, e, r) {
          try {
            return { type: "normal", arg: t.call(e, r) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = f;
        var p = "suspendedStart",
          v = "suspendedYield",
          y = "executing",
          w = "completed",
          g = {};
        function _() {}
        function m() {}
        function b() {}
        var k = {};
        h(k, u, function () {
          return this;
        });
        var x = Object.getPrototypeOf,
          L = x && x(x(G([])));
        L && L !== r && o.call(L, u) && (k = L);
        var E = (b.prototype = _.prototype = Object.create(k));
        function Z(t) {
          ["next", "throw", "return"].forEach(function (e) {
            h(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function S(t, e) {
          function r(i, a, s, u) {
            var c = d(t[i], t, a);
            if ("throw" !== c.type) {
              var l = c.arg,
                h = l.value;
              return h && "object" == n(h) && o.call(h, "__await")
                ? e.resolve(h.__await).then(
                    function (t) {
                      r("next", t, s, u);
                    },
                    function (t) {
                      r("throw", t, s, u);
                    }
                  )
                : e.resolve(h).then(
                    function (t) {
                      (l.value = t), s(l);
                    },
                    function (t) {
                      return r("throw", t, s, u);
                    }
                  );
            }
            u(c.arg);
          }
          var i;
          a(this, "_invoke", {
            value: function (t, n) {
              function o() {
                return new e(function (e, i) {
                  r(t, n, e, i);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function O(e, r, n) {
          var i = p;
          return function (o, a) {
            if (i === y) throw new Error("Generator is already running");
            if (i === w) {
              if ("throw" === o) throw a;
              return { value: t, done: !0 };
            }
            for (n.method = o, n.arg = a; ; ) {
              var s = n.delegate;
              if (s) {
                var u = P(s, n);
                if (u) {
                  if (u === g) continue;
                  return u;
                }
              }
              if ("next" === n.method) n.sent = n._sent = n.arg;
              else if ("throw" === n.method) {
                if (i === p) throw ((i = w), n.arg);
                n.dispatchException(n.arg);
              } else "return" === n.method && n.abrupt("return", n.arg);
              i = y;
              var c = d(e, r, n);
              if ("normal" === c.type) {
                if (((i = n.done ? w : v), c.arg === g)) continue;
                return { value: c.arg, done: n.done };
              }
              "throw" === c.type &&
                ((i = w), (n.method = "throw"), (n.arg = c.arg));
            }
          };
        }
        function P(e, r) {
          var n = r.method,
            i = e.iterator[n];
          if (i === t)
            return (
              (r.delegate = null),
              ("throw" === n &&
                e.iterator.return &&
                ((r.method = "return"),
                (r.arg = t),
                P(e, r),
                "throw" === r.method)) ||
                ("return" !== n &&
                  ((r.method = "throw"),
                  (r.arg = new TypeError(
                    "The iterator does not provide a '" + n + "' method"
                  )))),
              g
            );
          var o = d(i, e.iterator, r.arg);
          if ("throw" === o.type)
            return (
              (r.method = "throw"), (r.arg = o.arg), (r.delegate = null), g
            );
          var a = o.arg;
          return a
            ? a.done
              ? ((r[e.resultName] = a.value),
                (r.next = e.nextLoc),
                "return" !== r.method && ((r.method = "next"), (r.arg = t)),
                (r.delegate = null),
                g)
              : a
            : ((r.method = "throw"),
              (r.arg = new TypeError("iterator result is not an object")),
              (r.delegate = null),
              g);
        }
        function j(t) {
          var e = { tryLoc: t[0] };
          1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e);
        }
        function C(t) {
          var e = t.completion || {};
          (e.type = "normal"), delete e.arg, (t.completion = e);
        }
        function T(t) {
          (this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(j, this),
            this.reset(!0);
        }
        function G(e) {
          if (e || "" === e) {
            var r = e[u];
            if (r) return r.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var i = -1,
                a = function r() {
                  for (; ++i < e.length; )
                    if (o.call(e, i)) return (r.value = e[i]), (r.done = !1), r;
                  return (r.value = t), (r.done = !0), r;
                };
              return (a.next = a);
            }
          }
          throw new TypeError(n(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          a(E, "constructor", { value: b, configurable: !0 }),
          a(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = h(b, l, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), h(t, l, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          Z(S.prototype),
          h(S.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = S),
          (e.async = function (t, r, n, i, o) {
            void 0 === o && (o = Promise);
            var a = new S(f(t, r, n, i), o);
            return e.isGeneratorFunction(r)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          Z(E),
          h(E, l, "Generator"),
          h(E, u, function () {
            return this;
          }),
          h(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              r = [];
            for (var n in e) r.push(n);
            return (
              r.reverse(),
              function t() {
                for (; r.length; ) {
                  var n = r.pop();
                  if (n in e) return (t.value = n), (t.done = !1), t;
                }
                return (t.done = !0), t;
              }
            );
          }),
          (e.values = G),
          (T.prototype = {
            constructor: T,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(C),
                !e)
              )
                for (var r in this)
                  "t" === r.charAt(0) &&
                    o.call(this, r) &&
                    !isNaN(+r.slice(1)) &&
                    (this[r] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var r = this;
              function n(n, i) {
                return (
                  (s.type = "throw"),
                  (s.arg = e),
                  (r.next = n),
                  i && ((r.method = "next"), (r.arg = t)),
                  !!i
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  s = a.completion;
                if ("root" === a.tryLoc) return n("end");
                if (a.tryLoc <= this.prev) {
                  var u = o.call(a, "catchLoc"),
                    c = o.call(a, "finallyLoc");
                  if (u && c) {
                    if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return n(a.finallyLoc);
                  } else if (u) {
                    if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                  } else {
                    if (!c)
                      throw new Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return n(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                var n = this.tryEntries[r];
                if (
                  n.tryLoc <= this.prev &&
                  o.call(n, "finallyLoc") &&
                  this.prev < n.finallyLoc
                ) {
                  var i = n;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), g)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                  ? ((this.rval = this.arg = t.arg),
                    (this.method = "return"),
                    (this.next = "end"))
                  : "normal" === t.type && e && (this.next = e),
                g
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var r = this.tryEntries[e];
                if (r.finallyLoc === t)
                  return this.complete(r.completion, r.afterLoc), C(r), g;
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var r = this.tryEntries[e];
                if (r.tryLoc === t) {
                  var n = r.completion;
                  if ("throw" === n.type) {
                    var i = n.arg;
                    C(r);
                  }
                  return i;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function (e, r, n) {
              return (
                (this.delegate = { iterator: G(e), resultName: r, nextLoc: n }),
                "next" === this.method && (this.arg = t),
                g
              );
            },
          }),
          e
        );
      }
      function o(t, e, r, n, i, o, a) {
        try {
          var s = t[o](a),
            u = s.value;
        } catch (c) {
          return void r(c);
        }
        s.done ? e(u) : Promise.resolve(u).then(n, i);
      }
      r.a(
        t,
        (function () {
          var t,
            n =
              ((t = i().mark(function t(n, o) {
                var a,
                  s,
                  u,
                  c,
                  l,
                  h,
                  f,
                  d,
                  p,
                  v,
                  y,
                  w,
                  g,
                  _,
                  m,
                  b,
                  k,
                  x,
                  L,
                  E,
                  Z,
                  S,
                  O,
                  P,
                  j,
                  C;
                return i().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            ((t.prev = 0),
                            r.r(e),
                            (a = r(99312)),
                            (s = r(81043)),
                            (u = r(88962)),
                            (c = r(33368)),
                            (l = r(71650)),
                            (h = r(68308)),
                            (f = r(82390)),
                            (d = r(69205)),
                            (p = r(91808)),
                            (v = r(34541)),
                            (y = r(47838)),
                            r(97393),
                            r(46349),
                            r(70320),
                            r(37313),
                            (w = r(5095)),
                            (g = r(95260)),
                            (_ = r(72218)),
                            (m = r(837)),
                            (b = r(93843)),
                            (k = r(18394)),
                            !(x = n([b])).then)
                          ) {
                            t.next = 35;
                            break;
                          }
                          return (t.next = 31), x;
                        case 31:
                          (t.t1 = t.sent), (t.t0 = (0, t.t1)()), (t.next = 36);
                          break;
                        case 35:
                          t.t0 = x;
                        case 36:
                          (b = t.t0[0]),
                            (0, p.Z)(
                              [(0, g.Mo)("flow-preview-template")],
                              function (t, e) {
                                var r,
                                  n = (function (e) {
                                    function r() {
                                      var e;
                                      (0, l.Z)(this, r);
                                      for (
                                        var n = arguments.length,
                                          i = new Array(n),
                                          o = 0;
                                        o < n;
                                        o++
                                      )
                                        i[o] = arguments[o];
                                      return (
                                        (e = (0, h.Z)(this, r, [].concat(i))),
                                        t((0, f.Z)(e)),
                                        e
                                      );
                                    }
                                    return (0, d.Z)(r, e), (0, c.Z)(r);
                                  })(e);
                                return {
                                  F: n,
                                  d: [
                                    {
                                      kind: "field",
                                      decorators: [
                                        (0, g.Cb)({ attribute: !1 }),
                                      ],
                                      key: "hass",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.Cb)()],
                                      key: "flowType",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      key: "handler",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.Cb)()],
                                      key: "stepId",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.Cb)()],
                                      key: "flowId",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.Cb)()],
                                      key: "stepData",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.SB)()],
                                      key: "_preview",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.SB)()],
                                      key: "_listeners",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      decorators: [(0, g.SB)()],
                                      key: "_error",
                                      value: void 0,
                                    },
                                    {
                                      kind: "field",
                                      key: "_unsub",
                                      value: void 0,
                                    },
                                    {
                                      kind: "method",
                                      key: "disconnectedCallback",
                                      value: function () {
                                        (0, v.Z)(
                                          (0, y.Z)(n.prototype),
                                          "disconnectedCallback",
                                          this
                                        ).call(this),
                                          this._unsub &&
                                            (this._unsub.then(function (t) {
                                              return t();
                                            }),
                                            (this._unsub = void 0));
                                      },
                                    },
                                    {
                                      kind: "method",
                                      key: "willUpdate",
                                      value: function (t) {
                                        t.has("stepData") &&
                                          this._debouncedSubscribePreview();
                                      },
                                    },
                                    {
                                      kind: "method",
                                      key: "render",
                                      value: function () {
                                        var t,
                                          e = this;
                                        return this._error
                                          ? (0, w.dy)(
                                              L ||
                                                (L = (0, u.Z)([
                                                  '<ha-alert alert-type="error">',
                                                  "</ha-alert>",
                                                ])),
                                              this._error
                                            )
                                          : (0, w.dy)(
                                              E ||
                                                (E = (0, u.Z)([
                                                  '<entity-preview-row .hass="',
                                                  '" .stateObj="',
                                                  '"></entity-preview-row> ',
                                                  " ",
                                                  " ",
                                                ])),
                                              this.hass,
                                              this._preview,
                                              null !== (t = this._listeners) &&
                                                void 0 !== t &&
                                                t.time
                                                ? (0, w.dy)(
                                                    Z ||
                                                      (Z = (0, u.Z)([
                                                        " <p> ",
                                                        " </p> ",
                                                      ])),
                                                    this.hass.localize(
                                                      "ui.dialogs.helper_settings.template.time"
                                                    )
                                                  )
                                                : w.Ld,
                                              this._listeners
                                                ? this._listeners.all
                                                  ? (0, w.dy)(
                                                      S ||
                                                        (S = (0, u.Z)([
                                                          ' <p class="all_listeners"> ',
                                                          " </p> ",
                                                        ])),
                                                      this.hass.localize(
                                                        "ui.dialogs.helper_settings.template.all_listeners"
                                                      )
                                                    )
                                                  : this._listeners.domains
                                                      .length ||
                                                    this._listeners.entities
                                                      .length
                                                  ? (0, w.dy)(
                                                      O ||
                                                        (O = (0, u.Z)([
                                                          " <p> ",
                                                          " </p> <ul> ",
                                                          " ",
                                                          " </ul> ",
                                                        ])),
                                                      this.hass.localize(
                                                        "ui.dialogs.helper_settings.template.listeners"
                                                      ),
                                                      this._listeners.domains
                                                        .sort()
                                                        .map(function (t) {
                                                          return (0, w.dy)(
                                                            P ||
                                                              (P = (0, u.Z)([
                                                                " <li> <b>",
                                                                "</b>: ",
                                                                " </li> ",
                                                              ])),
                                                            e.hass.localize(
                                                              "ui.dialogs.helper_settings.template.domain"
                                                            ),
                                                            t
                                                          );
                                                        }),
                                                      this._listeners.entities
                                                        .sort()
                                                        .map(function (t) {
                                                          return (0, w.dy)(
                                                            j ||
                                                              (j = (0, u.Z)([
                                                                " <li> <b>",
                                                                "</b>: ",
                                                                " </li> ",
                                                              ])),
                                                            e.hass.localize(
                                                              "ui.dialogs.helper_settings.template.entity"
                                                            ),
                                                            t
                                                          );
                                                        })
                                                    )
                                                  : this._listeners.time
                                                  ? w.Ld
                                                  : (0, w.dy)(
                                                      C ||
                                                        (C = (0, u.Z)([
                                                          '<p class="all_listeners"> ',
                                                          " </p>",
                                                        ])),
                                                      this.hass.localize(
                                                        "ui.dialogs.helper_settings.template.no_listeners"
                                                      )
                                                    )
                                                : w.Ld
                                            );
                                      },
                                    },
                                    {
                                      kind: "field",
                                      key: "_setPreview",
                                      value: function () {
                                        var t = this;
                                        return function (e) {
                                          if ("error" in e)
                                            return (
                                              (t._error = e.error),
                                              void (t._preview = void 0)
                                            );
                                          (t._error = void 0),
                                            (t._listeners = e.listeners);
                                          var r = new Date().toISOString();
                                          t._preview = {
                                            entity_id: "".concat(
                                              t.stepId,
                                              ".___flow_preview___"
                                            ),
                                            last_changed: r,
                                            last_updated: r,
                                            context: {
                                              id: "",
                                              parent_id: null,
                                              user_id: null,
                                            },
                                            attributes: e.attributes,
                                            state: e.state,
                                          };
                                        };
                                      },
                                    },
                                    {
                                      kind: "field",
                                      key: "_debouncedSubscribePreview",
                                      value: function () {
                                        var t = this;
                                        return (0, _.D)(function () {
                                          t._subscribePreview();
                                        }, 250);
                                      },
                                    },
                                    {
                                      kind: "method",
                                      key: "_subscribePreview",
                                      value:
                                        ((r = (0, s.Z)(
                                          (0, a.Z)().mark(function t() {
                                            return (0, a.Z)().wrap(
                                              function (t) {
                                                for (;;)
                                                  switch ((t.prev = t.next)) {
                                                    case 0:
                                                      if (!this._unsub) {
                                                        t.next = 6;
                                                        break;
                                                      }
                                                      return (
                                                        (t.next = 3),
                                                        this._unsub
                                                      );
                                                    case 3:
                                                      (t.t0 = t.sent),
                                                        (0, t.t0)(),
                                                        (this._unsub = void 0);
                                                    case 6:
                                                      if (
                                                        "repair_flow" !==
                                                        this.flowType
                                                      ) {
                                                        t.next = 8;
                                                        break;
                                                      }
                                                      return t.abrupt("return");
                                                    case 8:
                                                      return (
                                                        (t.prev = 8),
                                                        (this._unsub = (0, m.Z)(
                                                          this.hass,
                                                          this.flowId,
                                                          this.flowType,
                                                          this.stepData,
                                                          this._setPreview
                                                        )),
                                                        (t.next = 12),
                                                        this._unsub
                                                      );
                                                    case 12:
                                                      (0, k.B)(
                                                        this,
                                                        "set-flow-errors",
                                                        { errors: {} }
                                                      ),
                                                        (t.next = 20);
                                                      break;
                                                    case 15:
                                                      (t.prev = 15),
                                                        (t.t1 = t.catch(8)),
                                                        "string" ==
                                                        typeof t.t1.message
                                                          ? (this._error =
                                                              t.t1.message)
                                                          : ((this._error =
                                                              void 0),
                                                            (0, k.B)(
                                                              this,
                                                              "set-flow-errors",
                                                              t.t1.message
                                                            )),
                                                        (this._unsub = void 0),
                                                        (this._preview =
                                                          void 0);
                                                    case 20:
                                                    case "end":
                                                      return t.stop();
                                                  }
                                              },
                                              t,
                                              this,
                                              [[8, 15]]
                                            );
                                          })
                                        )),
                                        function () {
                                          return r.apply(this, arguments);
                                        }),
                                    },
                                  ],
                                };
                              },
                              w.oi
                            ),
                            o(),
                            (t.next = 44);
                          break;
                        case 41:
                          (t.prev = 41), (t.t2 = t.catch(0)), o(t.t2);
                        case 44:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 41]]
                );
              })),
              function () {
                var e = this,
                  r = arguments;
                return new Promise(function (n, i) {
                  var a = t.apply(e, r);
                  function s(t) {
                    o(a, n, i, s, u, "next", t);
                  }
                  function u(t) {
                    o(a, n, i, s, u, "throw", t);
                  }
                  s(void 0);
                });
              });
          return function (t, e) {
            return n.apply(this, arguments);
          };
        })()
      );
    },
  },
]);
//# sourceMappingURL=1904.sywepMvb6cQ.js.map
