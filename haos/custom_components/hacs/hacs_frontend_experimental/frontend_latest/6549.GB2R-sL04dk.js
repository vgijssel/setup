/*! For license information please see 6549.GB2R-sL04dk.js.LICENSE.txt */
export const id = 6549;
export const ids = [6549];
export const modules = {
  96549: (t, e, n) => {
    function i() {
      return (
        (i =
          Object.assign ||
          function (t) {
            for (var e = 1; e < arguments.length; e++) {
              var n = arguments[e];
              for (var i in n)
                Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
            }
            return t;
          }),
        i.apply(this, arguments)
      );
    }
    function r(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        (t.__proto__ = e);
    }
    function o(t) {
      if (void 0 === t)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return t;
    }
    n.d(e, { Ce: () => Mt, Uw: () => Ot, dK: () => Lt, oM: () => W });
    var s,
      a =
        "function" != typeof Object.assign
          ? function (t) {
              if (null == t)
                throw new TypeError(
                  "Cannot convert undefined or null to object"
                );
              for (var e = Object(t), n = 1; n < arguments.length; n++) {
                var i = arguments[n];
                if (null != i)
                  for (var r in i) i.hasOwnProperty(r) && (e[r] = i[r]);
              }
              return e;
            }
          : Object.assign,
      u = ["", "webkit", "Moz", "MS", "ms", "o"],
      c =
        "undefined" == typeof document
          ? { style: {} }
          : document.createElement("div"),
      h = Math.round,
      l = Math.abs,
      p = Date.now;
    function f(t, e) {
      for (
        var n, i, r = e[0].toUpperCase() + e.slice(1), o = 0;
        o < u.length;

      ) {
        if ((i = (n = u[o]) ? n + r : e) in t) return i;
        o++;
      }
    }
    s = "undefined" == typeof window ? {} : window;
    var v = f(c.style, "touchAction"),
      d = void 0 !== v;
    var m = "compute",
      g = "auto",
      y = "manipulation",
      T = "none",
      E = "pan-x",
      I = "pan-y",
      w = (function () {
        if (!d) return !1;
        var t = {},
          e = s.CSS && s.CSS.supports;
        return (
          [
            "auto",
            "manipulation",
            "pan-y",
            "pan-x",
            "pan-x pan-y",
            "none",
          ].forEach(function (n) {
            return (t[n] = !e || s.CSS.supports("touch-action", n));
          }),
          t
        );
      })(),
      A = "ontouchstart" in s,
      b = void 0 !== f(s, "PointerEvent"),
      P =
        A && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),
      C = "touch",
      S = "mouse",
      _ = 25,
      D = 1,
      O = 4,
      x = 8,
      R = 1,
      M = 2,
      N = 4,
      z = 8,
      X = 16,
      Y = M | N,
      F = z | X,
      W = Y | F,
      q = ["x", "y"],
      L = ["clientX", "clientY"];
    function k(t, e, n) {
      var i;
      if (t)
        if (t.forEach) t.forEach(e, n);
        else if (void 0 !== t.length)
          for (i = 0; i < t.length; ) e.call(n, t[i], i, t), i++;
        else for (i in t) t.hasOwnProperty(i) && e.call(n, t[i], i, t);
    }
    function H(t, e) {
      return "function" == typeof t ? t.apply((e && e[0]) || void 0, e) : t;
    }
    function j(t, e) {
      return t.indexOf(e) > -1;
    }
    var U = (function () {
      function t(t, e) {
        (this.manager = t), this.set(e);
      }
      var e = t.prototype;
      return (
        (e.set = function (t) {
          t === m && (t = this.compute()),
            d &&
              this.manager.element.style &&
              w[t] &&
              (this.manager.element.style[v] = t),
            (this.actions = t.toLowerCase().trim());
        }),
        (e.update = function () {
          this.set(this.manager.options.touchAction);
        }),
        (e.compute = function () {
          var t = [];
          return (
            k(this.manager.recognizers, function (e) {
              H(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()));
            }),
            (function (t) {
              if (j(t, T)) return T;
              var e = j(t, E),
                n = j(t, I);
              return e && n ? T : e || n ? (e ? E : I) : j(t, y) ? y : g;
            })(t.join(" "))
          );
        }),
        (e.preventDefaults = function (t) {
          var e = t.srcEvent,
            n = t.offsetDirection;
          if (this.manager.session.prevented) e.preventDefault();
          else {
            var i = this.actions,
              r = j(i, T) && !w[T],
              o = j(i, I) && !w[I],
              s = j(i, E) && !w[E];
            if (r) {
              var a = 1 === t.pointers.length,
                u = t.distance < 2,
                c = t.deltaTime < 250;
              if (a && u && c) return;
            }
            if (!s || !o)
              return r || (o && n & Y) || (s && n & F)
                ? this.preventSrc(e)
                : void 0;
          }
        }),
        (e.preventSrc = function (t) {
          (this.manager.session.prevented = !0), t.preventDefault();
        }),
        t
      );
    })();
    function V(t, e) {
      for (; t; ) {
        if (t === e) return !0;
        t = t.parentNode;
      }
      return !1;
    }
    function G(t) {
      var e = t.length;
      if (1 === e) return { x: h(t[0].clientX), y: h(t[0].clientY) };
      for (var n = 0, i = 0, r = 0; r < e; )
        (n += t[r].clientX), (i += t[r].clientY), r++;
      return { x: h(n / e), y: h(i / e) };
    }
    function Z(t) {
      for (var e = [], n = 0; n < t.pointers.length; )
        (e[n] = {
          clientX: h(t.pointers[n].clientX),
          clientY: h(t.pointers[n].clientY),
        }),
          n++;
      return {
        timeStamp: p(),
        pointers: e,
        center: G(e),
        deltaX: t.deltaX,
        deltaY: t.deltaY,
      };
    }
    function B(t, e, n) {
      n || (n = q);
      var i = e[n[0]] - t[n[0]],
        r = e[n[1]] - t[n[1]];
      return Math.sqrt(i * i + r * r);
    }
    function K(t, e, n) {
      n || (n = q);
      var i = e[n[0]] - t[n[0]],
        r = e[n[1]] - t[n[1]];
      return (180 * Math.atan2(r, i)) / Math.PI;
    }
    function $(t, e) {
      return t === e ? R : l(t) >= l(e) ? (t < 0 ? M : N) : e < 0 ? z : X;
    }
    function J(t, e, n) {
      return { x: e / t || 0, y: n / t || 0 };
    }
    function Q(t, e) {
      var n = t.session,
        i = e.pointers,
        r = i.length;
      n.firstInput || (n.firstInput = Z(e)),
        r > 1 && !n.firstMultiple
          ? (n.firstMultiple = Z(e))
          : 1 === r && (n.firstMultiple = !1);
      var o = n.firstInput,
        s = n.firstMultiple,
        a = s ? s.center : o.center,
        u = (e.center = G(i));
      (e.timeStamp = p()),
        (e.deltaTime = e.timeStamp - o.timeStamp),
        (e.angle = K(a, u)),
        (e.distance = B(a, u)),
        (function (t, e) {
          var n = e.center,
            i = t.offsetDelta || {},
            r = t.prevDelta || {},
            o = t.prevInput || {};
          (e.eventType !== D && o.eventType !== O) ||
            ((r = t.prevDelta = { x: o.deltaX || 0, y: o.deltaY || 0 }),
            (i = t.offsetDelta = { x: n.x, y: n.y })),
            (e.deltaX = r.x + (n.x - i.x)),
            (e.deltaY = r.y + (n.y - i.y));
        })(n, e),
        (e.offsetDirection = $(e.deltaX, e.deltaY));
      var c,
        h,
        f = J(e.deltaTime, e.deltaX, e.deltaY);
      (e.overallVelocityX = f.x),
        (e.overallVelocityY = f.y),
        (e.overallVelocity = l(f.x) > l(f.y) ? f.x : f.y),
        (e.scale = s
          ? ((c = s.pointers), B((h = i)[0], h[1], L) / B(c[0], c[1], L))
          : 1),
        (e.rotation = s
          ? (function (t, e) {
              return K(e[1], e[0], L) + K(t[1], t[0], L);
            })(s.pointers, i)
          : 0),
        (e.maxPointers = n.prevInput
          ? e.pointers.length > n.prevInput.maxPointers
            ? e.pointers.length
            : n.prevInput.maxPointers
          : e.pointers.length),
        (function (t, e) {
          var n,
            i,
            r,
            o,
            s = t.lastInterval || e,
            a = e.timeStamp - s.timeStamp;
          if (e.eventType !== x && (a > _ || void 0 === s.velocity)) {
            var u = e.deltaX - s.deltaX,
              c = e.deltaY - s.deltaY,
              h = J(a, u, c);
            (i = h.x),
              (r = h.y),
              (n = l(h.x) > l(h.y) ? h.x : h.y),
              (o = $(u, c)),
              (t.lastInterval = e);
          } else
            (n = s.velocity),
              (i = s.velocityX),
              (r = s.velocityY),
              (o = s.direction);
          (e.velocity = n),
            (e.velocityX = i),
            (e.velocityY = r),
            (e.direction = o);
        })(n, e);
      var v,
        d = t.element,
        m = e.srcEvent;
      V(
        (v = m.composedPath
          ? m.composedPath()[0]
          : m.path
          ? m.path[0]
          : m.target),
        d
      ) && (d = v),
        (e.target = d);
    }
    function tt(t, e, n) {
      var i = n.pointers.length,
        r = n.changedPointers.length,
        o = e & D && i - r == 0,
        s = e & (O | x) && i - r == 0;
      (n.isFirst = !!o),
        (n.isFinal = !!s),
        o && (t.session = {}),
        (n.eventType = e),
        Q(t, n),
        t.emit("hammer.input", n),
        t.recognize(n),
        (t.session.prevInput = n);
    }
    function et(t) {
      return t.trim().split(/\s+/g);
    }
    function nt(t, e, n) {
      k(et(e), function (e) {
        t.addEventListener(e, n, !1);
      });
    }
    function it(t, e, n) {
      k(et(e), function (e) {
        t.removeEventListener(e, n, !1);
      });
    }
    function rt(t) {
      var e = t.ownerDocument || t;
      return e.defaultView || e.parentWindow || window;
    }
    var ot = (function () {
      function t(t, e) {
        var n = this;
        (this.manager = t),
          (this.callback = e),
          (this.element = t.element),
          (this.target = t.options.inputTarget),
          (this.domHandler = function (e) {
            H(t.options.enable, [t]) && n.handler(e);
          }),
          this.init();
      }
      var e = t.prototype;
      return (
        (e.handler = function () {}),
        (e.init = function () {
          this.evEl && nt(this.element, this.evEl, this.domHandler),
            this.evTarget && nt(this.target, this.evTarget, this.domHandler),
            this.evWin && nt(rt(this.element), this.evWin, this.domHandler);
        }),
        (e.destroy = function () {
          this.evEl && it(this.element, this.evEl, this.domHandler),
            this.evTarget && it(this.target, this.evTarget, this.domHandler),
            this.evWin && it(rt(this.element), this.evWin, this.domHandler);
        }),
        t
      );
    })();
    function st(t, e, n) {
      if (t.indexOf && !n) return t.indexOf(e);
      for (var i = 0; i < t.length; ) {
        if ((n && t[i][n] == e) || (!n && t[i] === e)) return i;
        i++;
      }
      return -1;
    }
    var at = {
        pointerdown: D,
        pointermove: 2,
        pointerup: O,
        pointercancel: x,
        pointerout: x,
      },
      ut = { 2: C, 3: "pen", 4: S, 5: "kinect" },
      ct = "pointerdown",
      ht = "pointermove pointerup pointercancel";
    s.MSPointerEvent &&
      !s.PointerEvent &&
      ((ct = "MSPointerDown"),
      (ht = "MSPointerMove MSPointerUp MSPointerCancel"));
    var lt = (function (t) {
      function e() {
        var n,
          i = e.prototype;
        return (
          (i.evEl = ct),
          (i.evWin = ht),
          ((n = t.apply(this, arguments) || this).store =
            n.manager.session.pointerEvents =
              []),
          n
        );
      }
      return (
        r(e, t),
        (e.prototype.handler = function (t) {
          var e = this.store,
            n = !1,
            i = t.type.toLowerCase().replace("ms", ""),
            r = at[i],
            o = ut[t.pointerType] || t.pointerType,
            s = o === C,
            a = st(e, t.pointerId, "pointerId");
          r & D && (0 === t.button || s)
            ? a < 0 && (e.push(t), (a = e.length - 1))
            : r & (O | x) && (n = !0),
            a < 0 ||
              ((e[a] = t),
              this.callback(this.manager, r, {
                pointers: e,
                changedPointers: [t],
                pointerType: o,
                srcEvent: t,
              }),
              n && e.splice(a, 1));
        }),
        e
      );
    })(ot);
    function pt(t) {
      return Array.prototype.slice.call(t, 0);
    }
    function ft(t, e, n) {
      for (var i = [], r = [], o = 0; o < t.length; ) {
        var s = e ? t[o][e] : t[o];
        st(r, s) < 0 && i.push(t[o]), (r[o] = s), o++;
      }
      return (
        n &&
          (i = e
            ? i.sort(function (t, n) {
                return t[e] > n[e];
              })
            : i.sort()),
        i
      );
    }
    var vt = { touchstart: D, touchmove: 2, touchend: O, touchcancel: x },
      dt = (function (t) {
        function e() {
          var n;
          return (
            (e.prototype.evTarget =
              "touchstart touchmove touchend touchcancel"),
            ((n = t.apply(this, arguments) || this).targetIds = {}),
            n
          );
        }
        return (
          r(e, t),
          (e.prototype.handler = function (t) {
            var e = vt[t.type],
              n = mt.call(this, t, e);
            n &&
              this.callback(this.manager, e, {
                pointers: n[0],
                changedPointers: n[1],
                pointerType: C,
                srcEvent: t,
              });
          }),
          e
        );
      })(ot);
    function mt(t, e) {
      var n,
        i,
        r = pt(t.touches),
        o = this.targetIds;
      if (e & (2 | D) && 1 === r.length)
        return (o[r[0].identifier] = !0), [r, r];
      var s = pt(t.changedTouches),
        a = [],
        u = this.target;
      if (
        ((i = r.filter(function (t) {
          return V(t.target, u);
        })),
        e === D)
      )
        for (n = 0; n < i.length; ) (o[i[n].identifier] = !0), n++;
      for (n = 0; n < s.length; )
        o[s[n].identifier] && a.push(s[n]),
          e & (O | x) && delete o[s[n].identifier],
          n++;
      return a.length ? [ft(i.concat(a), "identifier", !0), a] : void 0;
    }
    var gt = { mousedown: D, mousemove: 2, mouseup: O },
      yt = (function (t) {
        function e() {
          var n,
            i = e.prototype;
          return (
            (i.evEl = "mousedown"),
            (i.evWin = "mousemove mouseup"),
            ((n = t.apply(this, arguments) || this).pressed = !1),
            n
          );
        }
        return (
          r(e, t),
          (e.prototype.handler = function (t) {
            var e = gt[t.type];
            e & D && 0 === t.button && (this.pressed = !0),
              2 & e && 1 !== t.which && (e = O),
              this.pressed &&
                (e & O && (this.pressed = !1),
                this.callback(this.manager, e, {
                  pointers: [t],
                  changedPointers: [t],
                  pointerType: S,
                  srcEvent: t,
                }));
          }),
          e
        );
      })(ot),
      Tt = 2500;
    function Et(t) {
      var e = t.changedPointers[0];
      if (e.identifier === this.primaryTouch) {
        var n = { x: e.clientX, y: e.clientY },
          i = this.lastTouches;
        this.lastTouches.push(n);
        setTimeout(function () {
          var t = i.indexOf(n);
          t > -1 && i.splice(t, 1);
        }, Tt);
      }
    }
    function It(t, e) {
      t & D
        ? ((this.primaryTouch = e.changedPointers[0].identifier),
          Et.call(this, e))
        : t & (O | x) && Et.call(this, e);
    }
    function wt(t) {
      for (
        var e = t.srcEvent.clientX, n = t.srcEvent.clientY, i = 0;
        i < this.lastTouches.length;
        i++
      ) {
        var r = this.lastTouches[i],
          o = Math.abs(e - r.x),
          s = Math.abs(n - r.y);
        if (o <= 25 && s <= 25) return !0;
      }
      return !1;
    }
    var At = (function () {
      return (function (t) {
        function e(e, n) {
          var i;
          return (
            ((i = t.call(this, e, n) || this).handler = function (t, e, n) {
              var r = n.pointerType === C,
                s = n.pointerType === S;
              if (
                !(
                  s &&
                  n.sourceCapabilities &&
                  n.sourceCapabilities.firesTouchEvents
                )
              ) {
                if (r) It.call(o(o(i)), e, n);
                else if (s && wt.call(o(o(i)), n)) return;
                i.callback(t, e, n);
              }
            }),
            (i.touch = new dt(i.manager, i.handler)),
            (i.mouse = new yt(i.manager, i.handler)),
            (i.primaryTouch = null),
            (i.lastTouches = []),
            i
          );
        }
        return (
          r(e, t),
          (e.prototype.destroy = function () {
            this.touch.destroy(), this.mouse.destroy();
          }),
          e
        );
      })(ot);
    })();
    function bt(t, e, n) {
      return !!Array.isArray(t) && (k(t, n[e], n), !0);
    }
    var Pt = 32,
      Ct = 1;
    function St(t, e) {
      var n = e.manager;
      return n ? n.get(t) : t;
    }
    function _t(t) {
      return 16 & t
        ? "cancel"
        : 8 & t
        ? "end"
        : 4 & t
        ? "move"
        : 2 & t
        ? "start"
        : "";
    }
    var Dt = (function () {
        function t(t) {
          void 0 === t && (t = {}),
            (this.options = i({ enable: !0 }, t)),
            (this.id = Ct++),
            (this.manager = null),
            (this.state = 1),
            (this.simultaneous = {}),
            (this.requireFail = []);
        }
        var e = t.prototype;
        return (
          (e.set = function (t) {
            return (
              a(this.options, t),
              this.manager && this.manager.touchAction.update(),
              this
            );
          }),
          (e.recognizeWith = function (t) {
            if (bt(t, "recognizeWith", this)) return this;
            var e = this.simultaneous;
            return (
              e[(t = St(t, this)).id] || ((e[t.id] = t), t.recognizeWith(this)),
              this
            );
          }),
          (e.dropRecognizeWith = function (t) {
            return (
              bt(t, "dropRecognizeWith", this) ||
                ((t = St(t, this)), delete this.simultaneous[t.id]),
              this
            );
          }),
          (e.requireFailure = function (t) {
            if (bt(t, "requireFailure", this)) return this;
            var e = this.requireFail;
            return (
              -1 === st(e, (t = St(t, this))) &&
                (e.push(t), t.requireFailure(this)),
              this
            );
          }),
          (e.dropRequireFailure = function (t) {
            if (bt(t, "dropRequireFailure", this)) return this;
            t = St(t, this);
            var e = st(this.requireFail, t);
            return e > -1 && this.requireFail.splice(e, 1), this;
          }),
          (e.hasRequireFailures = function () {
            return this.requireFail.length > 0;
          }),
          (e.canRecognizeWith = function (t) {
            return !!this.simultaneous[t.id];
          }),
          (e.emit = function (t) {
            var e = this,
              n = this.state;
            function i(n) {
              e.manager.emit(n, t);
            }
            n < 8 && i(e.options.event + _t(n)),
              i(e.options.event),
              t.additionalEvent && i(t.additionalEvent),
              n >= 8 && i(e.options.event + _t(n));
          }),
          (e.tryEmit = function (t) {
            if (this.canEmit()) return this.emit(t);
            this.state = Pt;
          }),
          (e.canEmit = function () {
            for (var t = 0; t < this.requireFail.length; ) {
              if (!(33 & this.requireFail[t].state)) return !1;
              t++;
            }
            return !0;
          }),
          (e.recognize = function (t) {
            var e = a({}, t);
            if (!H(this.options.enable, [this, e]))
              return this.reset(), void (this.state = Pt);
            56 & this.state && (this.state = 1),
              (this.state = this.process(e)),
              30 & this.state && this.tryEmit(e);
          }),
          (e.process = function (t) {}),
          (e.getTouchAction = function () {}),
          (e.reset = function () {}),
          t
        );
      })(),
      Ot = (function (t) {
        function e(e) {
          var n;
          return (
            void 0 === e && (e = {}),
            ((n =
              t.call(
                this,
                i(
                  {
                    event: "tap",
                    pointers: 1,
                    taps: 1,
                    interval: 300,
                    time: 250,
                    threshold: 9,
                    posThreshold: 10,
                  },
                  e
                )
              ) || this).pTime = !1),
            (n.pCenter = !1),
            (n._timer = null),
            (n._input = null),
            (n.count = 0),
            n
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            return [y];
          }),
          (n.process = function (t) {
            var e = this,
              n = this.options,
              i = t.pointers.length === n.pointers,
              r = t.distance < n.threshold,
              o = t.deltaTime < n.time;
            if ((this.reset(), t.eventType & D && 0 === this.count))
              return this.failTimeout();
            if (r && o && i) {
              if (t.eventType !== O) return this.failTimeout();
              var s = !this.pTime || t.timeStamp - this.pTime < n.interval,
                a = !this.pCenter || B(this.pCenter, t.center) < n.posThreshold;
              if (
                ((this.pTime = t.timeStamp),
                (this.pCenter = t.center),
                a && s ? (this.count += 1) : (this.count = 1),
                (this._input = t),
                0 === this.count % n.taps)
              )
                return this.hasRequireFailures()
                  ? ((this._timer = setTimeout(function () {
                      (e.state = 8), e.tryEmit();
                    }, n.interval)),
                    2)
                  : 8;
            }
            return Pt;
          }),
          (n.failTimeout = function () {
            var t = this;
            return (
              (this._timer = setTimeout(function () {
                t.state = Pt;
              }, this.options.interval)),
              Pt
            );
          }),
          (n.reset = function () {
            clearTimeout(this._timer);
          }),
          (n.emit = function () {
            8 === this.state &&
              ((this._input.tapCount = this.count),
              this.manager.emit(this.options.event, this._input));
          }),
          e
        );
      })(Dt),
      xt = (function (t) {
        function e(e) {
          return (
            void 0 === e && (e = {}),
            t.call(this, i({ pointers: 1 }, e)) || this
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.attrTest = function (t) {
            var e = this.options.pointers;
            return 0 === e || t.pointers.length === e;
          }),
          (n.process = function (t) {
            var e = this.state,
              n = t.eventType,
              i = 6 & e,
              r = this.attrTest(t);
            return i && (n & x || !r)
              ? 16 | e
              : i || r
              ? n & O
                ? 8 | e
                : 2 & e
                ? 4 | e
                : 2
              : Pt;
          }),
          e
        );
      })(Dt);
    function Rt(t) {
      return t === X
        ? "down"
        : t === z
        ? "up"
        : t === M
        ? "left"
        : t === N
        ? "right"
        : "";
    }
    var Mt = (function (t) {
        function e(e) {
          var n;
          return (
            void 0 === e && (e = {}),
            ((n =
              t.call(
                this,
                i({ event: "pan", threshold: 10, pointers: 1, direction: W }, e)
              ) || this).pX = null),
            (n.pY = null),
            n
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            var t = this.options.direction,
              e = [];
            return t & Y && e.push(I), t & F && e.push(E), e;
          }),
          (n.directionTest = function (t) {
            var e = this.options,
              n = !0,
              i = t.distance,
              r = t.direction,
              o = t.deltaX,
              s = t.deltaY;
            return (
              r & e.direction ||
                (e.direction & Y
                  ? ((r = 0 === o ? R : o < 0 ? M : N),
                    (n = o !== this.pX),
                    (i = Math.abs(t.deltaX)))
                  : ((r = 0 === s ? R : s < 0 ? z : X),
                    (n = s !== this.pY),
                    (i = Math.abs(t.deltaY)))),
              (t.direction = r),
              n && i > e.threshold && r & e.direction
            );
          }),
          (n.attrTest = function (t) {
            return (
              xt.prototype.attrTest.call(this, t) &&
              (2 & this.state || (!(2 & this.state) && this.directionTest(t)))
            );
          }),
          (n.emit = function (e) {
            (this.pX = e.deltaX), (this.pY = e.deltaY);
            var n = Rt(e.direction);
            n && (e.additionalEvent = this.options.event + n),
              t.prototype.emit.call(this, e);
          }),
          e
        );
      })(xt),
      Nt = (function (t) {
        function e(e) {
          return (
            void 0 === e && (e = {}),
            t.call(
              this,
              i(
                {
                  event: "swipe",
                  threshold: 10,
                  velocity: 0.3,
                  direction: Y | F,
                  pointers: 1,
                },
                e
              )
            ) || this
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            return Mt.prototype.getTouchAction.call(this);
          }),
          (n.attrTest = function (e) {
            var n,
              i = this.options.direction;
            return (
              i & (Y | F)
                ? (n = e.overallVelocity)
                : i & Y
                ? (n = e.overallVelocityX)
                : i & F && (n = e.overallVelocityY),
              t.prototype.attrTest.call(this, e) &&
                i & e.offsetDirection &&
                e.distance > this.options.threshold &&
                e.maxPointers === this.options.pointers &&
                l(n) > this.options.velocity &&
                e.eventType & O
            );
          }),
          (n.emit = function (t) {
            var e = Rt(t.offsetDirection);
            e && this.manager.emit(this.options.event + e, t),
              this.manager.emit(this.options.event, t);
          }),
          e
        );
      })(xt),
      zt = (function (t) {
        function e(e) {
          return (
            void 0 === e && (e = {}),
            t.call(this, i({ event: "pinch", threshold: 0, pointers: 2 }, e)) ||
              this
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            return [T];
          }),
          (n.attrTest = function (e) {
            return (
              t.prototype.attrTest.call(this, e) &&
              (Math.abs(e.scale - 1) > this.options.threshold || 2 & this.state)
            );
          }),
          (n.emit = function (e) {
            if (1 !== e.scale) {
              var n = e.scale < 1 ? "in" : "out";
              e.additionalEvent = this.options.event + n;
            }
            t.prototype.emit.call(this, e);
          }),
          e
        );
      })(xt),
      Xt = (function (t) {
        function e(e) {
          return (
            void 0 === e && (e = {}),
            t.call(
              this,
              i({ event: "rotate", threshold: 0, pointers: 2 }, e)
            ) || this
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            return [T];
          }),
          (n.attrTest = function (e) {
            return (
              t.prototype.attrTest.call(this, e) &&
              (Math.abs(e.rotation) > this.options.threshold || 2 & this.state)
            );
          }),
          e
        );
      })(xt),
      Yt = (function (t) {
        function e(e) {
          var n;
          return (
            void 0 === e && (e = {}),
            ((n =
              t.call(
                this,
                i({ event: "press", pointers: 1, time: 251, threshold: 9 }, e)
              ) || this)._timer = null),
            (n._input = null),
            n
          );
        }
        r(e, t);
        var n = e.prototype;
        return (
          (n.getTouchAction = function () {
            return [g];
          }),
          (n.process = function (t) {
            var e = this,
              n = this.options,
              i = t.pointers.length === n.pointers,
              r = t.distance < n.threshold,
              o = t.deltaTime > n.time;
            if (((this._input = t), !r || !i || (t.eventType & (O | x) && !o)))
              this.reset();
            else if (t.eventType & D)
              this.reset(),
                (this._timer = setTimeout(function () {
                  (e.state = 8), e.tryEmit();
                }, n.time));
            else if (t.eventType & O) return 8;
            return Pt;
          }),
          (n.reset = function () {
            clearTimeout(this._timer);
          }),
          (n.emit = function (t) {
            8 === this.state &&
              (t && t.eventType & O
                ? this.manager.emit(this.options.event + "up", t)
                : ((this._input.timeStamp = p()),
                  this.manager.emit(this.options.event, this._input)));
          }),
          e
        );
      })(Dt),
      Ft = {
        domEvents: !1,
        touchAction: m,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        cssProps: {
          userSelect: "none",
          touchSelect: "none",
          touchCallout: "none",
          contentZooming: "none",
          userDrag: "none",
          tapHighlightColor: "rgba(0,0,0,0)",
        },
      },
      Wt = [
        [Xt, { enable: !1 }],
        [zt, { enable: !1 }, ["rotate"]],
        [Nt, { direction: Y }],
        [Mt, { direction: Y }, ["swipe"]],
        [Ot],
        [Ot, { event: "doubletap", taps: 2 }, ["tap"]],
        [Yt],
      ];
    function qt(t, e) {
      var n,
        i = t.element;
      i.style &&
        (k(t.options.cssProps, function (r, o) {
          (n = f(i.style, o)),
            e
              ? ((t.oldCssProps[n] = i.style[n]), (i.style[n] = r))
              : (i.style[n] = t.oldCssProps[n] || "");
        }),
        e || (t.oldCssProps = {}));
    }
    var Lt = (function () {
        function t(t, e) {
          var n,
            i = this;
          (this.options = a({}, Ft, e || {})),
            (this.options.inputTarget = this.options.inputTarget || t),
            (this.handlers = {}),
            (this.session = {}),
            (this.recognizers = []),
            (this.oldCssProps = {}),
            (this.element = t),
            (this.input = new ((n = this).options.inputClass ||
              (b ? lt : P ? dt : A ? At : yt))(n, tt)),
            (this.touchAction = new U(this, this.options.touchAction)),
            qt(this, !0),
            k(
              this.options.recognizers,
              function (t) {
                var e = i.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3]);
              },
              this
            );
        }
        var e = t.prototype;
        return (
          (e.set = function (t) {
            return (
              a(this.options, t),
              t.touchAction && this.touchAction.update(),
              t.inputTarget &&
                (this.input.destroy(),
                (this.input.target = t.inputTarget),
                this.input.init()),
              this
            );
          }),
          (e.stop = function (t) {
            this.session.stopped = t ? 2 : 1;
          }),
          (e.recognize = function (t) {
            var e = this.session;
            if (!e.stopped) {
              var n;
              this.touchAction.preventDefaults(t);
              var i = this.recognizers,
                r = e.curRecognizer;
              (!r || (r && 8 & r.state)) &&
                ((e.curRecognizer = null), (r = null));
              for (var o = 0; o < i.length; )
                (n = i[o]),
                  2 === e.stopped || (r && n !== r && !n.canRecognizeWith(r))
                    ? n.reset()
                    : n.recognize(t),
                  !r && 14 & n.state && ((e.curRecognizer = n), (r = n)),
                  o++;
            }
          }),
          (e.get = function (t) {
            if (t instanceof Dt) return t;
            for (var e = this.recognizers, n = 0; n < e.length; n++)
              if (e[n].options.event === t) return e[n];
            return null;
          }),
          (e.add = function (t) {
            if (bt(t, "add", this)) return this;
            var e = this.get(t.options.event);
            return (
              e && this.remove(e),
              this.recognizers.push(t),
              (t.manager = this),
              this.touchAction.update(),
              t
            );
          }),
          (e.remove = function (t) {
            if (bt(t, "remove", this)) return this;
            var e = this.get(t);
            if (t) {
              var n = this.recognizers,
                i = st(n, e);
              -1 !== i && (n.splice(i, 1), this.touchAction.update());
            }
            return this;
          }),
          (e.on = function (t, e) {
            if (void 0 === t || void 0 === e) return this;
            var n = this.handlers;
            return (
              k(et(t), function (t) {
                (n[t] = n[t] || []), n[t].push(e);
              }),
              this
            );
          }),
          (e.off = function (t, e) {
            if (void 0 === t) return this;
            var n = this.handlers;
            return (
              k(et(t), function (t) {
                e ? n[t] && n[t].splice(st(n[t], e), 1) : delete n[t];
              }),
              this
            );
          }),
          (e.emit = function (t, e) {
            this.options.domEvents &&
              (function (t, e) {
                var n = document.createEvent("Event");
                n.initEvent(t, !0, !0),
                  (n.gesture = e),
                  e.target.dispatchEvent(n);
              })(t, e);
            var n = this.handlers[t] && this.handlers[t].slice();
            if (n && n.length) {
              (e.type = t),
                (e.preventDefault = function () {
                  e.srcEvent.preventDefault();
                });
              for (var i = 0; i < n.length; ) n[i](e), i++;
            }
          }),
          (e.destroy = function () {
            this.element && qt(this, !1),
              (this.handlers = {}),
              (this.session = {}),
              this.input.destroy(),
              (this.element = null);
          }),
          t
        );
      })(),
      kt = { touchstart: D, touchmove: 2, touchend: O, touchcancel: x },
      Ht = (function (t) {
        function e() {
          var n,
            i = e.prototype;
          return (
            (i.evTarget = "touchstart"),
            (i.evWin = "touchstart touchmove touchend touchcancel"),
            ((n = t.apply(this, arguments) || this).started = !1),
            n
          );
        }
        return (
          r(e, t),
          (e.prototype.handler = function (t) {
            var e = kt[t.type];
            if ((e === D && (this.started = !0), this.started)) {
              var n = jt.call(this, t, e);
              e & (O | x) &&
                n[0].length - n[1].length == 0 &&
                (this.started = !1),
                this.callback(this.manager, e, {
                  pointers: n[0],
                  changedPointers: n[1],
                  pointerType: C,
                  srcEvent: t,
                });
            }
          }),
          e
        );
      })(ot);
    function jt(t, e) {
      var n = pt(t.touches),
        i = pt(t.changedTouches);
      return e & (O | x) && (n = ft(n.concat(i), "identifier", !0)), [n, i];
    }
    function Ut(t, e, n) {
      var i = "DEPRECATED METHOD: " + e + "\n" + n + " AT \n";
      return function () {
        var e = new Error("get-stack-trace"),
          n =
            e && e.stack
              ? e.stack
                  .replace(/^[^\(]+?[\n$]/gm, "")
                  .replace(/^\s+at\s+/gm, "")
                  .replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@")
              : "Unknown Stack Trace",
          r = window.console && (window.console.warn || window.console.log);
        return r && r.call(window.console, i, n), t.apply(this, arguments);
      };
    }
    var Vt = Ut(
        function (t, e, n) {
          for (var i = Object.keys(e), r = 0; r < i.length; )
            (!n || (n && void 0 === t[i[r]])) && (t[i[r]] = e[i[r]]), r++;
          return t;
        },
        "extend",
        "Use `assign`."
      ),
      Gt = Ut(
        function (t, e) {
          return Vt(t, e, !0);
        },
        "merge",
        "Use `assign`."
      );
    function Zt(t, e, n) {
      var i,
        r = e.prototype;
      ((i = t.prototype = Object.create(r)).constructor = t),
        (i._super = r),
        n && a(i, n);
    }
    function Bt(t, e) {
      return function () {
        return t.apply(e, arguments);
      };
    }
    var Kt = (function () {
      var t = function (t, e) {
        return (
          void 0 === e && (e = {}),
          new Lt(t, i({ recognizers: Wt.concat() }, e))
        );
      };
      return (
        (t.VERSION = "2.0.17-rc"),
        (t.DIRECTION_ALL = W),
        (t.DIRECTION_DOWN = X),
        (t.DIRECTION_LEFT = M),
        (t.DIRECTION_RIGHT = N),
        (t.DIRECTION_UP = z),
        (t.DIRECTION_HORIZONTAL = Y),
        (t.DIRECTION_VERTICAL = F),
        (t.DIRECTION_NONE = R),
        (t.DIRECTION_DOWN = X),
        (t.INPUT_START = D),
        (t.INPUT_MOVE = 2),
        (t.INPUT_END = O),
        (t.INPUT_CANCEL = x),
        (t.STATE_POSSIBLE = 1),
        (t.STATE_BEGAN = 2),
        (t.STATE_CHANGED = 4),
        (t.STATE_ENDED = 8),
        (t.STATE_RECOGNIZED = 8),
        (t.STATE_CANCELLED = 16),
        (t.STATE_FAILED = Pt),
        (t.Manager = Lt),
        (t.Input = ot),
        (t.TouchAction = U),
        (t.TouchInput = dt),
        (t.MouseInput = yt),
        (t.PointerEventInput = lt),
        (t.TouchMouseInput = At),
        (t.SingleTouchInput = Ht),
        (t.Recognizer = Dt),
        (t.AttrRecognizer = xt),
        (t.Tap = Ot),
        (t.Pan = Mt),
        (t.Swipe = Nt),
        (t.Pinch = zt),
        (t.Rotate = Xt),
        (t.Press = Yt),
        (t.on = nt),
        (t.off = it),
        (t.each = k),
        (t.merge = Gt),
        (t.extend = Vt),
        (t.bindFn = Bt),
        (t.assign = a),
        (t.inherit = Zt),
        (t.bindFn = Bt),
        (t.prefixed = f),
        (t.toArray = pt),
        (t.inArray = st),
        (t.uniqueArray = ft),
        (t.splitStr = et),
        (t.boolOrFn = H),
        (t.hasParent = V),
        (t.addEventListeners = nt),
        (t.removeEventListeners = it),
        (t.defaults = a({}, Ft, { preset: Wt })),
        t
      );
    })();
    Kt.defaults;
  },
};
//# sourceMappingURL=6549.GB2R-sL04dk.js.map
