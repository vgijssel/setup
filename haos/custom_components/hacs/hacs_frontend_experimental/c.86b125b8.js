import { u as e, c as t, a as n } from "./c.743a15a1.js";
var r = t(function (e, t) {
    function r(e, t, ...n) {
      if (!e) throw new TypeError(a(t, n));
    }
    function a(e, t) {
      let n = 0;
      return e.replace(/%[os]/gu, () => o(t[n++]));
    }
    function o(e) {
      return "object" != typeof e || null === e
        ? String(e)
        : Object.prototype.toString.call(e);
    }
    let i;
    Object.defineProperty(t, "__esModule", { value: !0 });
    const s =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof self
        ? self
        : void 0 !== n
        ? n
        : "undefined" != typeof globalThis
        ? globalThis
        : void 0;
    let l;
    class c {
      constructor(e, t) {
        (this.code = e), (this.message = t);
      }
      warn(...e) {
        var t;
        try {
          if (l) return void l({ ...this, args: e });
          const n = (
            null !== (t = new Error().stack) && void 0 !== t ? t : ""
          ).replace(/^(?:.+?\n){2}/gu, "\n");
          console.warn(this.message, ...e, n);
        } catch (e) {}
      }
    }
    const u = new c("W01", "Unable to initialize event under dispatching."),
      p = new c(
        "W02",
        "Assigning any falsy value to 'cancelBubble' property has no effect."
      ),
      g = new c(
        "W03",
        "Assigning any truthy value to 'returnValue' property has no effect."
      ),
      f = new c("W04", "Unable to preventDefault on non-cancelable events."),
      b = new c(
        "W05",
        "Unable to preventDefault inside passive event listener invocation."
      ),
      d = new c(
        "W06",
        "An event listener wasn't added because it has been added already: %o, %o"
      ),
      E = new c(
        "W07",
        "The %o option value was abandoned because the event listener wasn't added as duplicated."
      ),
      v = new c(
        "W08",
        "The 'callback' argument must be a function or an object that has 'handleEvent' method: %o"
      ),
      h = new c("W09", "Event attribute handler must be a function: %o");
    class y {
      static get NONE() {
        return m;
      }
      static get CAPTURING_PHASE() {
        return R;
      }
      static get AT_TARGET() {
        return T;
      }
      static get BUBBLING_PHASE() {
        return P;
      }
      constructor(e, t) {
        Object.defineProperty(this, "isTrusted", { value: !1, enumerable: !0 });
        const n = null != t ? t : {};
        w.set(this, {
          type: String(e),
          bubbles: Boolean(n.bubbles),
          cancelable: Boolean(n.cancelable),
          composed: Boolean(n.composed),
          target: null,
          currentTarget: null,
          stopPropagationFlag: !1,
          stopImmediatePropagationFlag: !1,
          canceledFlag: !1,
          inPassiveListenerFlag: !1,
          dispatchFlag: !1,
          timeStamp: Date.now(),
        });
      }
      get type() {
        return _(this).type;
      }
      get target() {
        return _(this).target;
      }
      get srcElement() {
        return _(this).target;
      }
      get currentTarget() {
        return _(this).currentTarget;
      }
      composedPath() {
        const e = _(this).currentTarget;
        return e ? [e] : [];
      }
      get NONE() {
        return m;
      }
      get CAPTURING_PHASE() {
        return R;
      }
      get AT_TARGET() {
        return T;
      }
      get BUBBLING_PHASE() {
        return P;
      }
      get eventPhase() {
        return _(this).dispatchFlag ? 2 : 0;
      }
      stopPropagation() {
        _(this).stopPropagationFlag = !0;
      }
      get cancelBubble() {
        return _(this).stopPropagationFlag;
      }
      set cancelBubble(e) {
        e ? (_(this).stopPropagationFlag = !0) : p.warn();
      }
      stopImmediatePropagation() {
        const e = _(this);
        e.stopPropagationFlag = e.stopImmediatePropagationFlag = !0;
      }
      get bubbles() {
        return _(this).bubbles;
      }
      get cancelable() {
        return _(this).cancelable;
      }
      get returnValue() {
        return !_(this).canceledFlag;
      }
      set returnValue(e) {
        e ? g.warn() : O(_(this));
      }
      preventDefault() {
        O(_(this));
      }
      get defaultPrevented() {
        return _(this).canceledFlag;
      }
      get composed() {
        return _(this).composed;
      }
      get isTrusted() {
        return !1;
      }
      get timeStamp() {
        return _(this).timeStamp;
      }
      initEvent(e, t = !1, n = !1) {
        const r = _(this);
        r.dispatchFlag
          ? u.warn()
          : w.set(this, {
              ...r,
              type: String(e),
              bubbles: Boolean(t),
              cancelable: Boolean(n),
              target: null,
              currentTarget: null,
              stopPropagationFlag: !1,
              stopImmediatePropagationFlag: !1,
              canceledFlag: !1,
            });
      }
    }
    const m = 0,
      R = 1,
      T = 2,
      P = 3,
      w = new WeakMap();
    function _(e, t = "this") {
      const n = w.get(e);
      return (
        r(
          null != n,
          "'%s' must be an object that Event constructor created, but got another one: %o",
          t,
          e
        ),
        n
      );
    }
    function O(e) {
      e.inPassiveListenerFlag
        ? b.warn()
        : e.cancelable
        ? (e.canceledFlag = !0)
        : f.warn();
    }
    Object.defineProperty(y, "NONE", { enumerable: !0 }),
      Object.defineProperty(y, "CAPTURING_PHASE", { enumerable: !0 }),
      Object.defineProperty(y, "AT_TARGET", { enumerable: !0 }),
      Object.defineProperty(y, "BUBBLING_PHASE", { enumerable: !0 });
    const A = Object.getOwnPropertyNames(y.prototype);
    for (let e = 0; e < A.length; ++e)
      "constructor" !== A[e] &&
        Object.defineProperty(y.prototype, A[e], { enumerable: !0 });
    let I;
    void 0 !== s &&
      void 0 !== s.Event &&
      Object.setPrototypeOf(y.prototype, s.Event.prototype);
    const S = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25,
    };
    function N(e) {
      const t = Object.keys(S);
      for (let n = 0; n < t.length; ++n) {
        const r = t[n],
          a = S[r];
        Object.defineProperty(e, r, {
          get: () => a,
          configurable: !0,
          enumerable: !0,
        });
      }
    }
    class j extends y {
      static wrap(e) {
        return new (L(e))(e);
      }
      constructor(e) {
        super(e.type, {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          composed: e.composed,
        }),
          e.cancelBubble && super.stopPropagation(),
          e.defaultPrevented && super.preventDefault(),
          B.set(this, { original: e });
        const t = Object.keys(e);
        for (let n = 0; n < t.length; ++n) {
          const r = t[n];
          r in this || Object.defineProperty(this, r, k(e, r));
        }
      }
      stopPropagation() {
        super.stopPropagation();
        const { original: e } = D(this);
        "stopPropagation" in e && e.stopPropagation();
      }
      get cancelBubble() {
        return super.cancelBubble;
      }
      set cancelBubble(e) {
        super.cancelBubble = e;
        const { original: t } = D(this);
        "cancelBubble" in t && (t.cancelBubble = e);
      }
      stopImmediatePropagation() {
        super.stopImmediatePropagation();
        const { original: e } = D(this);
        "stopImmediatePropagation" in e && e.stopImmediatePropagation();
      }
      get returnValue() {
        return super.returnValue;
      }
      set returnValue(e) {
        super.returnValue = e;
        const { original: t } = D(this);
        "returnValue" in t && (t.returnValue = e);
      }
      preventDefault() {
        super.preventDefault();
        const { original: e } = D(this);
        "preventDefault" in e && e.preventDefault();
      }
      get timeStamp() {
        const { original: e } = D(this);
        return "timeStamp" in e ? e.timeStamp : super.timeStamp;
      }
    }
    const B = new WeakMap();
    function D(e) {
      const t = B.get(e);
      return r(null != t, "'this' is expected an Event object, but got", e), t;
    }
    const F = new WeakMap();
    function L(e) {
      const t = Object.getPrototypeOf(e);
      if (null == t) return j;
      let n = F.get(t);
      return (
        null == n &&
          ((n = (function (e, t) {
            class n extends e {}
            const r = Object.keys(t);
            for (let e = 0; e < r.length; ++e)
              Object.defineProperty(n.prototype, r[e], k(t, r[e]));
            return n;
          })(L(t), t)),
          F.set(t, n)),
        n
      );
    }
    function k(e, t) {
      const n = Object.getOwnPropertyDescriptor(e, t);
      return {
        get() {
          const e = D(this).original,
            n = e[t];
          return "function" == typeof n ? n.bind(e) : n;
        },
        set(e) {
          D(this).original[t] = e;
        },
        configurable: n.configurable,
        enumerable: n.enumerable,
      };
    }
    function C(e) {
      return 1 == (1 & e.flags);
    }
    function V(e) {
      return 2 == (2 & e.flags);
    }
    function W(e) {
      return 4 == (4 & e.flags);
    }
    function U(e) {
      return 8 == (8 & e.flags);
    }
    function H({ callback: e }, t, n) {
      try {
        "function" == typeof e
          ? e.call(t, n)
          : "function" == typeof e.handleEvent && e.handleEvent(n);
      } catch (e) {
        !(function (e) {
          try {
            const t = e instanceof Error ? e : new Error(o(e));
            if (i) return void i(t);
            if (
              "function" == typeof dispatchEvent &&
              "function" == typeof ErrorEvent
            )
              dispatchEvent(
                new ErrorEvent("error", { error: t, message: t.message })
              );
            else if (
              "undefined" != typeof process &&
              "function" == typeof process.emit
            )
              return void process.emit("uncaughtException", t);
            console.error(t);
          } catch (e) {}
        })(e);
      }
    }
    function M({ listeners: e }, t, n) {
      for (let r = 0; r < e.length; ++r)
        if (e[r].callback === t && C(e[r]) === n) return r;
      return -1;
    }
    function G(e, t, n, r, a, o) {
      let i;
      o && ((i = x.bind(null, e, t, n)), o.addEventListener("abort", i));
      const s = (function (e, t, n, r, a, o) {
        return {
          callback: e,
          flags: (t ? 1 : 0) | (n ? 2 : 0) | (r ? 4 : 0),
          signal: a,
          signalListener: o,
        };
      })(t, n, r, a, o, i);
      return (
        e.cow
          ? ((e.cow = !1), (e.listeners = [...e.listeners, s]))
          : e.listeners.push(s),
        s
      );
    }
    function x(e, t, n) {
      const r = M(e, t, n);
      return -1 !== r && Y(e, r);
    }
    function Y(e, t, n = !1) {
      const r = e.listeners[t];
      return (
        (function (e) {
          e.flags |= 8;
        })(r),
        r.signal && r.signal.removeEventListener("abort", r.signalListener),
        e.cow && !n
          ? ((e.cow = !1),
            (e.listeners = e.listeners.filter((e, n) => n !== t)),
            !1)
          : (e.listeners.splice(t, 1), !0)
      );
    }
    function X(e, t) {
      var n;
      return null !== (n = e[t]) && void 0 !== n
        ? n
        : (e[t] = {
            attrCallback: void 0,
            attrListener: void 0,
            cow: !1,
            listeners: [],
          });
    }
    F.set(Object.prototype, j),
      void 0 !== s && void 0 !== s.Event && F.set(s.Event.prototype, j);
    class Q {
      constructor() {
        Z.set(this, Object.create(null));
      }
      addEventListener(e, t, n) {
        const r = z(this),
          {
            callback: a,
            capture: o,
            once: i,
            passive: s,
            signal: l,
            type: c,
          } = (function (e, t, n) {
            var r;
            if ((K(t), "object" == typeof n && null !== n))
              return {
                type: String(e),
                callback: null != t ? t : void 0,
                capture: Boolean(n.capture),
                passive: Boolean(n.passive),
                once: Boolean(n.once),
                signal: null !== (r = n.signal) && void 0 !== r ? r : void 0,
              };
            return {
              type: String(e),
              callback: null != t ? t : void 0,
              capture: Boolean(n),
              passive: !1,
              once: !1,
              signal: void 0,
            };
          })(e, t, n);
        if (null == a || (null == l ? void 0 : l.aborted)) return;
        const u = X(r, c),
          p = M(u, a, o);
        -1 === p
          ? G(u, a, o, s, i, l)
          : (function (e, t, n, r) {
              d.warn(C(e) ? "capture" : "bubble", e.callback),
                V(e) !== t && E.warn("passive");
              W(e) !== n && E.warn("once");
              e.signal !== r && E.warn("signal");
            })(u.listeners[p], s, i, l);
      }
      removeEventListener(e, t, n) {
        const r = z(this),
          {
            callback: a,
            capture: o,
            type: i,
          } = (function (e, t, n) {
            if ((K(t), "object" == typeof n && null !== n))
              return {
                type: String(e),
                callback: null != t ? t : void 0,
                capture: Boolean(n.capture),
              };
            return {
              type: String(e),
              callback: null != t ? t : void 0,
              capture: Boolean(n),
            };
          })(e, t, n),
          s = r[i];
        null != a && s && x(s, a, o);
      }
      dispatchEvent(e) {
        const t = z(this)[String(e.type)];
        if (null == t) return !0;
        const n = e instanceof y ? e : j.wrap(e),
          r = _(n, "event");
        if (r.dispatchFlag)
          throw (
            ((a = "This event has been in dispatching."),
            s.DOMException
              ? new s.DOMException(a, "InvalidStateError")
              : (null == I &&
                  ((I = class e extends Error {
                    constructor(t) {
                      super(t),
                        Error.captureStackTrace &&
                          Error.captureStackTrace(this, e);
                    }
                    get code() {
                      return 11;
                    }
                    get name() {
                      return "InvalidStateError";
                    }
                  }),
                  Object.defineProperties(I.prototype, {
                    code: { enumerable: !0 },
                    name: { enumerable: !0 },
                  }),
                  N(I),
                  N(I.prototype)),
                new I(a)))
          );
        var a;
        if (
          ((r.dispatchFlag = !0),
          (r.target = r.currentTarget = this),
          !r.stopPropagationFlag)
        ) {
          const { cow: e, listeners: a } = t;
          t.cow = !0;
          for (let o = 0; o < a.length; ++o) {
            const i = a[o];
            if (
              !U(i) &&
              (W(i) && Y(t, o, !e) && (o -= 1),
              (r.inPassiveListenerFlag = V(i)),
              H(i, this, n),
              (r.inPassiveListenerFlag = !1),
              r.stopImmediatePropagationFlag)
            )
              break;
          }
          e || (t.cow = !1);
        }
        return (
          (r.target = null),
          (r.currentTarget = null),
          (r.stopImmediatePropagationFlag = !1),
          (r.stopPropagationFlag = !1),
          (r.dispatchFlag = !1),
          !r.canceledFlag
        );
      }
    }
    const Z = new WeakMap();
    function z(e, t = "this") {
      const n = Z.get(e);
      return (
        r(
          null != n,
          "'%s' must be an object that EventTarget constructor created, but got another one: %o",
          t,
          e
        ),
        n
      );
    }
    function K(e) {
      if (
        "function" != typeof e &&
        ("object" != typeof e ||
          null === e ||
          "function" != typeof e.handleEvent)
      ) {
        if (null != e && "object" != typeof e)
          throw new TypeError(a(v.message, [e]));
        v.warn(e);
      }
    }
    const $ = Object.getOwnPropertyNames(Q.prototype);
    for (let e = 0; e < $.length; ++e)
      "constructor" !== $[e] &&
        Object.defineProperty(Q.prototype, $[e], { enumerable: !0 });
    function q(e, t) {
      var n, r;
      return null !==
        (r =
          null === (n = z(e, "target")[t]) || void 0 === n
            ? void 0
            : n.attrCallback) && void 0 !== r
        ? r
        : null;
    }
    function J(e, t, n) {
      null != n && "function" != typeof n && h.warn(n),
        "function" == typeof n || ("object" == typeof n && null !== n)
          ? (function (e, t, n) {
              const r = X(z(e, "target"), String(t));
              (r.attrCallback = n),
                null == r.attrListener &&
                  (r.attrListener = G(
                    r,
                    (function (e) {
                      return function (t) {
                        const n = e.attrCallback;
                        "function" == typeof n && n.call(this, t);
                      };
                    })(r),
                    !1,
                    !1,
                    !1,
                    void 0
                  ));
            })(e, t, n)
          : (function (e, t) {
              const n = z(e, "target"),
                r = n[String(t)];
              r &&
                r.attrListener &&
                (x(r, r.attrListener.callback, !1),
                (r.attrCallback = r.attrListener = void 0));
            })(e, t);
    }
    function ee(e, t, n) {
      Object.defineProperty(e, `on${t}`, {
        get() {
          return q(this, t);
        },
        set(e) {
          J(this, t, e);
        },
        configurable: !0,
        enumerable: !0,
      });
    }
    void 0 !== s &&
      void 0 !== s.EventTarget &&
      Object.setPrototypeOf(Q.prototype, s.EventTarget.prototype),
      (t.Event = y),
      (t.EventTarget = Q),
      (t.default = Q),
      (t.defineCustomEventTarget = function (...e) {
        class t extends Q {}
        for (let n = 0; n < e.length; ++n) ee(t.prototype, e[n]);
        return t;
      }),
      (t.defineEventAttribute = ee),
      (t.getEventAttributeValue = q),
      (t.setErrorHandler = function (e) {
        r(
          "function" == typeof e || void 0 === e,
          "The error handler must be a function or undefined, but got %o.",
          e
        ),
          (i = e);
      }),
      (t.setEventAttributeValue = J),
      (t.setWarningHandler = function (e) {
        r(
          "function" == typeof e || void 0 === e,
          "The warning handler must be a function or undefined, but got %o.",
          e
        ),
          (l = e);
      });
  }),
  a = e(r),
  o = r.Event,
  i = r.EventTarget,
  s = r.defineCustomEventTarget,
  l = r.defineEventAttribute,
  c = r.getEventAttributeValue,
  u = r.setErrorHandler,
  p = r.setEventAttributeValue,
  g = r.setWarningHandler;
export {
  o as Event,
  i as EventTarget,
  r as __moduleExports,
  a as default,
  s as defineCustomEventTarget,
  l as defineEventAttribute,
  c as getEventAttributeValue,
  u as setErrorHandler,
  p as setEventAttributeValue,
  g as setWarningHandler,
};
