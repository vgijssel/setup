var t =
    "undefined" != typeof window &&
    "undefined" != typeof document &&
    window.document === document,
  e =
    "undefined" != typeof global && global.Math === Math
      ? global
      : "undefined" != typeof self && self.Math === Math
      ? self
      : "undefined" != typeof window && window.Math === Math
      ? window
      : Function("return this")(),
  n = (function () {
    if ("function" == typeof requestAnimationFrame)
      return requestAnimationFrame.bind(e);
    return function (t) {
      return setTimeout(function () {
        t(+Date.now());
      }, 1e3 / 60);
    };
  })();
var r = ["top", "right", "bottom", "left", "width", "height", "size", "weight"],
  i = "undefined" != typeof MutationObserver,
  o =
    t &&
    HTMLElement.prototype.attachShadow &&
    -1 !==
      HTMLElement.prototype.attachShadow.toString().indexOf("[native code]")
      ? HTMLElement.prototype.attachShadow
      : null,
  s = (function () {
    function e() {
      (this.connected_ = !1),
        (this.mutationEventsAdded_ = !1),
        (this.mutationsObserver_ = null),
        (this.observers_ = []),
        (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
        (this.refresh = (function (t, e) {
          var r = !1,
            i = !1,
            o = 0;
          function s() {
            r && ((r = !1), t()), i && c();
          }
          function a() {
            n(s);
          }
          function c() {
            var t = Date.now();
            if (r) {
              if (t - o < 2) return;
              i = !0;
            } else (r = !0), (i = !1), setTimeout(a, e);
            o = t;
          }
          return c;
        })(this.refresh.bind(this), 20));
    }
    return (
      (e.prototype.addObserver = function (t) {
        ~this.observers_.indexOf(t) || this.observers_.push(t),
          this.connected_ || this.connect_();
      }),
      (e.prototype.removeObserver = function (t) {
        var e = this.observers_,
          n = e.indexOf(t);
        ~n && e.splice(n, 1),
          !e.length && this.connected_ && this.disconnect_();
      }),
      (e.prototype.refresh = function () {
        this.updateObservers_() && this.refresh();
      }),
      (e.prototype.updateObservers_ = function () {
        var t = this.observers_.filter(function (t) {
          return t.gatherActive(), t.hasActive();
        });
        return (
          t.forEach(function (t) {
            return t.broadcastActive();
          }),
          t.length > 0
        );
      }),
      (e.prototype.connect_ = function () {
        if (t && !this.connected_) {
          if (
            (document.addEventListener("transitionend", this.onTransitionEnd_),
            window.addEventListener("resize", this.refresh),
            i)
          ) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            var e = {
              attributes: !0,
              childList: !0,
              characterData: !0,
              subtree: !0,
            };
            if ((this.mutationsObserver_.observe(document, e), o)) {
              var n = this;
              !(function t(r) {
                var i = r.shadowRoot;
                i && (n.mutationsObserver_.observe(i, e), t(i));
                for (var o = r.firstElementChild; o; )
                  t(o), (o = o.nextElementSibling);
              })(document),
                (HTMLElement.prototype.attachShadow = function () {
                  for (var t = [], r = 0; r < arguments.length; r++)
                    t[r] = arguments[r];
                  var i = o.apply(this, t);
                  return n.mutationsObserver_.observe(i, e), i;
                });
            }
          } else
            document.addEventListener("DOMSubtreeModified", this.refresh),
              (this.mutationEventsAdded_ = !0);
          this.connected_ = !0;
        }
      }),
      (e.prototype.disconnect_ = function () {
        t &&
          this.connected_ &&
          (document.removeEventListener("transitionend", this.onTransitionEnd_),
          window.removeEventListener("resize", this.refresh),
          this.mutationsObserver_ &&
            (this.mutationsObserver_.disconnect(),
            o && (HTMLElement.prototype.attachShadow = o)),
          this.mutationEventsAdded_ &&
            document.removeEventListener("DOMSubtreeModified", this.refresh),
          (this.mutationsObserver_ = null),
          (this.mutationEventsAdded_ = !1),
          (this.connected_ = !1));
      }),
      (e.prototype.onTransitionEnd_ = function (t) {
        var e = t.propertyName,
          n = void 0 === e ? "" : e;
        r.some(function (t) {
          return !!~n.indexOf(t);
        }) && this.refresh();
      }),
      (e.getInstance = function () {
        return e.instance_ || (e.instance_ = new e()), e.instance_;
      }),
      (e.instance_ = null),
      e
    );
  })();
function a(t) {
  var e = "function" == typeof Symbol && t[Symbol.iterator],
    n = 0;
  return e
    ? e.call(t)
    : {
        next: function () {
          return (
            t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
          );
        },
      };
}
var c = function (t, e) {
    var n, r;
    try {
      for (var i = a(Object.keys(e)), o = i.next(); !o.done; o = i.next()) {
        var s = o.value;
        Object.defineProperty(t, s, {
          value: e[s],
          enumerable: !1,
          writable: !1,
          configurable: !0,
        });
      }
    } catch (t) {
      n = { error: t };
    } finally {
      try {
        o && !o.done && (r = i.return) && r.call(i);
      } finally {
        if (n) throw n.error;
      }
    }
    return t;
  },
  h = function (t) {
    var n;
    return (
      (null === (n = null == t ? void 0 : t.ownerDocument) || void 0 === n
        ? void 0
        : n.defaultView) || e
    );
  },
  u = _(0, 0, 0, 0);
function f(t) {
  return "number" == typeof t ? t : parseFloat(t) || 0;
}
function d(t) {
  for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
  return e.reduce(function (e, n) {
    return e + f(t["border-" + n + "-width"]);
  }, 0);
}
function l(t) {
  var e = t.clientWidth,
    n = t.clientHeight;
  if (!e && !n) return u;
  var r = h(t).getComputedStyle(t),
    i = (function (t) {
      var e = t;
      return {
        top: f(e["padding-top"]),
        right: f(e["padding-right"]),
        bottom: f(e["padding-bottom"]),
        left: f(e["padding-left"]),
      };
    })(r),
    o = i.left + i.right,
    s = i.top + i.bottom,
    a = f(r.width),
    c = f(r.height);
  if (
    ("border-box" === r.boxSizing &&
      (Math.round(a + o) !== e && (a -= d(r, "left", "right") + o),
      Math.round(c + s) !== n && (c -= d(r, "top", "bottom") + s)),
    !(function (t) {
      return t === h(t).document.documentElement;
    })(t))
  ) {
    var l = Math.round(a + o) - e,
      v = Math.round(c + s) - n;
    1 !== Math.abs(l) && (a -= l), 1 !== Math.abs(v) && (c -= v);
  }
  return _(i.left, i.top, a, c);
}
var v =
  "undefined" != typeof SVGGraphicsElement
    ? function (t) {
        return t instanceof h(t).SVGGraphicsElement;
      }
    : function (t) {
        return t instanceof h(t).SVGElement && "function" == typeof t.getBBox;
      };
function p(e) {
  return t
    ? v(e)
      ? (function (t) {
          var e = t.getBBox();
          return _(0, 0, e.width, e.height);
        })(e)
      : l(e)
    : u;
}
function _(t, e, n, r) {
  return { x: t, y: e, width: n, height: r };
}
var b = (function () {
    function t(t) {
      (this.broadcastWidth = 0),
        (this.broadcastHeight = 0),
        (this.contentRect_ = _(0, 0, 0, 0)),
        (this.target = t);
    }
    return (
      (t.prototype.isActive = function () {
        var t = p(this.target);
        return (
          (this.contentRect_ = t),
          t.width !== this.broadcastWidth || t.height !== this.broadcastHeight
        );
      }),
      (t.prototype.broadcastRect = function () {
        var t = this.contentRect_;
        return (
          (this.broadcastWidth = t.width), (this.broadcastHeight = t.height), t
        );
      }),
      t
    );
  })(),
  y = function (t, e) {
    var n,
      r,
      i,
      o,
      s,
      a,
      h,
      u =
        ((r = (n = e).x),
        (i = n.y),
        (o = n.width),
        (s = n.height),
        (a = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object),
        (h = Object.create(a.prototype)),
        c(h, {
          x: r,
          y: i,
          width: o,
          height: s,
          top: i,
          right: r + o,
          bottom: s + i,
          left: r,
        }),
        h);
    c(this, { target: t, contentRect: u });
  },
  m = (function () {
    if ("undefined" != typeof Map) return Map;
    function t(t, e) {
      var n = -1;
      return (
        t.some(function (t, r) {
          return t[0] === e && ((n = r), !0);
        }),
        n
      );
    }
    return (function () {
      function e() {
        this.__entries__ = [];
      }
      return (
        Object.defineProperty(e.prototype, "size", {
          get: function () {
            return this.__entries__.length;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (e.prototype.get = function (e) {
          var n,
            r = t(this.__entries__, e);
          return null === (n = this.__entries__[r]) || void 0 === n
            ? void 0
            : n[1];
        }),
        (e.prototype.set = function (e, n) {
          var r = t(this.__entries__, e);
          ~r ? (this.__entries__[r][1] = n) : this.__entries__.push([e, n]);
        }),
        (e.prototype.delete = function (e) {
          var n = this.__entries__,
            r = t(n, e);
          ~r && n.splice(r, 1);
        }),
        (e.prototype.has = function (e) {
          return !!~t(this.__entries__, e);
        }),
        (e.prototype.clear = function () {
          this.__entries__.splice(0);
        }),
        (e.prototype.forEach = function (t, e) {
          var n, r;
          void 0 === e && (e = null);
          try {
            for (
              var i = a(this.__entries__), o = i.next();
              !o.done;
              o = i.next()
            ) {
              var s = o.value;
              t.call(e, s[1], s[0]);
            }
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              o && !o.done && (r = i.return) && r.call(i);
            } finally {
              if (n) throw n.error;
            }
          }
        }),
        e
      );
    })();
  })(),
  w = (function () {
    function t(t, e, n) {
      if (
        ((this.activeObservations_ = []),
        (this.observations_ = new m()),
        "function" != typeof t)
      )
        throw new TypeError(
          "The callback provided as parameter 1 is not a function."
        );
      (this.callback_ = t), (this.controller_ = e), (this.callbackCtx_ = n);
    }
    return (
      (t.prototype.observe = function (t) {
        if (void 0 === t)
          throw new TypeError("1 argument required, but only 0 present.");
        if ("undefined" != typeof Element && Element instanceof Object) {
          if (!(t instanceof h(t).Element))
            throw new TypeError('parameter 1 is not of type "Element".');
          var e = this.observations_;
          e.has(t) ||
            (e.set(t, new b(t)),
            this.controller_.addObserver(this),
            this.controller_.refresh());
        }
      }),
      (t.prototype.unobserve = function (t) {
        if (void 0 === t)
          throw new TypeError("1 argument required, but only 0 present.");
        if ("undefined" != typeof Element && Element instanceof Object) {
          if (!(t instanceof h(t).Element))
            throw new TypeError('parameter 1 is not of type "Element".');
          var e = this.observations_;
          e.has(t) &&
            (e.delete(t), e.size || this.controller_.removeObserver(this));
        }
      }),
      (t.prototype.disconnect = function () {
        this.clearActive(),
          this.observations_.clear(),
          this.controller_.removeObserver(this);
      }),
      (t.prototype.gatherActive = function () {
        var t = this;
        this.clearActive(),
          this.observations_.forEach(function (e) {
            e.isActive() && t.activeObservations_.push(e);
          });
      }),
      (t.prototype.broadcastActive = function () {
        if (this.hasActive()) {
          var t = this.callbackCtx_,
            e = this.activeObservations_.map(function (t) {
              return new y(t.target, t.broadcastRect());
            });
          this.callback_.call(t, e, t), this.clearActive();
        }
      }),
      (t.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
      }),
      (t.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
      }),
      t
    );
  })(),
  g = (function () {
    function t(e) {
      if (!(this instanceof t))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var n = s.getInstance();
      this.observer_ = new w(e, n, this);
    }
    return (
      (t.prototype.observe = function (t) {
        this.observer_.observe(t);
      }),
      (t.prototype.unobserve = function (t) {
        this.observer_.unobserve(t);
      }),
      (t.prototype.disconnect = function () {
        this.observer_.disconnect();
      }),
      t
    );
  })(),
  E = void 0 !== e.ResizeObserver ? e.ResizeObserver : g;
export { E as default };
