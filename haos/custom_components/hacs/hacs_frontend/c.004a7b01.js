var t = (function () {
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
          var n = t(this.__entries__, e),
            r = this.__entries__[n];
          return r && r[1];
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
          void 0 === e && (e = null);
          for (var n = 0, r = this.__entries__; n < r.length; n++) {
            var i = r[n];
            t.call(e, i[1], i[0]);
          }
        }),
        e
      );
    })();
  })(),
  e =
    "undefined" != typeof window &&
    "undefined" != typeof document &&
    window.document === document,
  n =
    "undefined" != typeof global && global.Math === Math
      ? global
      : "undefined" != typeof self && self.Math === Math
      ? self
      : "undefined" != typeof window && window.Math === Math
      ? window
      : Function("return this")(),
  r =
    "function" == typeof requestAnimationFrame
      ? requestAnimationFrame.bind(n)
      : function (t) {
          return setTimeout(function () {
            return t(Date.now());
          }, 1e3 / 60);
        };
var i = ["top", "right", "bottom", "left", "width", "height", "size", "weight"],
  o = "undefined" != typeof MutationObserver,
  s = (function () {
    function t() {
      (this.connected_ = !1),
        (this.mutationEventsAdded_ = !1),
        (this.mutationsObserver_ = null),
        (this.observers_ = []),
        (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
        (this.refresh = (function (t, e) {
          var n = !1,
            i = !1,
            o = 0;
          function s() {
            n && ((n = !1), t()), i && c();
          }
          function a() {
            r(s);
          }
          function c() {
            var t = Date.now();
            if (n) {
              if (t - o < 2) return;
              i = !0;
            } else (n = !0), (i = !1), setTimeout(a, e);
            o = t;
          }
          return c;
        })(this.refresh.bind(this), 20));
    }
    return (
      (t.prototype.addObserver = function (t) {
        ~this.observers_.indexOf(t) || this.observers_.push(t),
          this.connected_ || this.connect_();
      }),
      (t.prototype.removeObserver = function (t) {
        var e = this.observers_,
          n = e.indexOf(t);
        ~n && e.splice(n, 1),
          !e.length && this.connected_ && this.disconnect_();
      }),
      (t.prototype.refresh = function () {
        this.updateObservers_() && this.refresh();
      }),
      (t.prototype.updateObservers_ = function () {
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
      (t.prototype.connect_ = function () {
        e &&
          !this.connected_ &&
          (document.addEventListener("transitionend", this.onTransitionEnd_),
          window.addEventListener("resize", this.refresh),
          o
            ? ((this.mutationsObserver_ = new MutationObserver(this.refresh)),
              this.mutationsObserver_.observe(document, {
                attributes: !0,
                childList: !0,
                characterData: !0,
                subtree: !0,
              }))
            : (document.addEventListener("DOMSubtreeModified", this.refresh),
              (this.mutationEventsAdded_ = !0)),
          (this.connected_ = !0));
      }),
      (t.prototype.disconnect_ = function () {
        e &&
          this.connected_ &&
          (document.removeEventListener("transitionend", this.onTransitionEnd_),
          window.removeEventListener("resize", this.refresh),
          this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
          this.mutationEventsAdded_ &&
            document.removeEventListener("DOMSubtreeModified", this.refresh),
          (this.mutationsObserver_ = null),
          (this.mutationEventsAdded_ = !1),
          (this.connected_ = !1));
      }),
      (t.prototype.onTransitionEnd_ = function (t) {
        var e = t.propertyName,
          n = void 0 === e ? "" : e;
        i.some(function (t) {
          return !!~n.indexOf(t);
        }) && this.refresh();
      }),
      (t.getInstance = function () {
        return this.instance_ || (this.instance_ = new t()), this.instance_;
      }),
      (t.instance_ = null),
      t
    );
  })(),
  a = function (t, e) {
    for (var n = 0, r = Object.keys(e); n < r.length; n++) {
      var i = r[n];
      Object.defineProperty(t, i, {
        value: e[i],
        enumerable: !1,
        writable: !1,
        configurable: !0,
      });
    }
    return t;
  },
  c = function (t) {
    return (t && t.ownerDocument && t.ownerDocument.defaultView) || n;
  },
  h = l(0, 0, 0, 0);
function u(t) {
  return parseFloat(t) || 0;
}
function f(t) {
  for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
  return e.reduce(function (e, n) {
    return e + u(t["border-" + n + "-width"]);
  }, 0);
}
function d(t) {
  var e = t.clientWidth,
    n = t.clientHeight;
  if (!e && !n) return h;
  var r = c(t).getComputedStyle(t),
    i = (function (t) {
      for (
        var e = {}, n = 0, r = ["top", "right", "bottom", "left"];
        n < r.length;
        n++
      ) {
        var i = r[n],
          o = t["padding-" + i];
        e[i] = u(o);
      }
      return e;
    })(r),
    o = i.left + i.right,
    s = i.top + i.bottom,
    a = u(r.width),
    d = u(r.height);
  if (
    ("border-box" === r.boxSizing &&
      (Math.round(a + o) !== e && (a -= f(r, "left", "right") + o),
      Math.round(d + s) !== n && (d -= f(r, "top", "bottom") + s)),
    !(function (t) {
      return t === c(t).document.documentElement;
    })(t))
  ) {
    var p = Math.round(a + o) - e,
      v = Math.round(d + s) - n;
    1 !== Math.abs(p) && (a -= p), 1 !== Math.abs(v) && (d -= v);
  }
  return l(i.left, i.top, a, d);
}
var p =
  "undefined" != typeof SVGGraphicsElement
    ? function (t) {
        return t instanceof c(t).SVGGraphicsElement;
      }
    : function (t) {
        return t instanceof c(t).SVGElement && "function" == typeof t.getBBox;
      };
function v(t) {
  return e
    ? p(t)
      ? (function (t) {
          var e = t.getBBox();
          return l(0, 0, e.width, e.height);
        })(t)
      : d(t)
    : h;
}
function l(t, e, n, r) {
  return { x: t, y: e, width: n, height: r };
}
var _ = (function () {
    function t(t) {
      (this.broadcastWidth = 0),
        (this.broadcastHeight = 0),
        (this.contentRect_ = l(0, 0, 0, 0)),
        (this.target = t);
    }
    return (
      (t.prototype.isActive = function () {
        var t = v(this.target);
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
  b = function (t, e) {
    var n,
      r,
      i,
      o,
      s,
      c,
      h,
      u =
        ((r = (n = e).x),
        (i = n.y),
        (o = n.width),
        (s = n.height),
        (c = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object),
        (h = Object.create(c.prototype)),
        a(h, {
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
    a(this, { target: t, contentRect: u });
  },
  m = (function () {
    function e(e, n, r) {
      if (
        ((this.activeObservations_ = []),
        (this.observations_ = new t()),
        "function" != typeof e)
      )
        throw new TypeError(
          "The callback provided as parameter 1 is not a function."
        );
      (this.callback_ = e), (this.controller_ = n), (this.callbackCtx_ = r);
    }
    return (
      (e.prototype.observe = function (t) {
        if (!arguments.length)
          throw new TypeError("1 argument required, but only 0 present.");
        if ("undefined" != typeof Element && Element instanceof Object) {
          if (!(t instanceof c(t).Element))
            throw new TypeError('parameter 1 is not of type "Element".');
          var e = this.observations_;
          e.has(t) ||
            (e.set(t, new _(t)),
            this.controller_.addObserver(this),
            this.controller_.refresh());
        }
      }),
      (e.prototype.unobserve = function (t) {
        if (!arguments.length)
          throw new TypeError("1 argument required, but only 0 present.");
        if ("undefined" != typeof Element && Element instanceof Object) {
          if (!(t instanceof c(t).Element))
            throw new TypeError('parameter 1 is not of type "Element".');
          var e = this.observations_;
          e.has(t) &&
            (e.delete(t), e.size || this.controller_.removeObserver(this));
        }
      }),
      (e.prototype.disconnect = function () {
        this.clearActive(),
          this.observations_.clear(),
          this.controller_.removeObserver(this);
      }),
      (e.prototype.gatherActive = function () {
        var t = this;
        this.clearActive(),
          this.observations_.forEach(function (e) {
            e.isActive() && t.activeObservations_.push(e);
          });
      }),
      (e.prototype.broadcastActive = function () {
        if (this.hasActive()) {
          var t = this.callbackCtx_,
            e = this.activeObservations_.map(function (t) {
              return new b(t.target, t.broadcastRect());
            });
          this.callback_.call(t, e, t), this.clearActive();
        }
      }),
      (e.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
      }),
      (e.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
      }),
      e
    );
  })(),
  y = "undefined" != typeof WeakMap ? new WeakMap() : new t(),
  g = function t(e) {
    if (!(this instanceof t))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    var n = s.getInstance(),
      r = new m(e, n, this);
    y.set(this, r);
  };
["observe", "unobserve", "disconnect"].forEach(function (t) {
  g.prototype[t] = function () {
    var e;
    return (e = y.get(this))[t].apply(e, arguments);
  };
});
var w = void 0 !== n.ResizeObserver ? n.ResizeObserver : g;
export { w as default };
