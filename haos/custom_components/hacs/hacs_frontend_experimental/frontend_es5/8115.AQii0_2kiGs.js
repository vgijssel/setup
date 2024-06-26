/*! For license information please see 8115.AQii0_2kiGs.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [8115],
  {
    96549: function (t, e, n) {
      n.d(e, {
        Ce: function () {
          return zt;
        },
        Uw: function () {
          return xt;
        },
        dK: function () {
          return Ht;
        },
        oM: function () {
          return q;
        },
      });
      var i,
        r = n(76775);
      n(85717),
        n(51467),
        n(17692),
        n(46798),
        n(63789),
        n(99397),
        n(9849),
        n(50289),
        n(94167),
        n(56308),
        n(11451),
        n(97393),
        n(91989),
        n(57778),
        n(24074),
        n(36513),
        n(41353),
        n(37313),
        n(87438),
        n(22890),
        n(65974),
        n(47084),
        n(87463);
      function o() {
        return (
          (o =
            Object.assign ||
            function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e];
                for (var i in n)
                  Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
              }
              return t;
            }),
          o.apply(this, arguments)
        );
      }
      function s(t, e) {
        (t.prototype = Object.create(e.prototype)),
          (t.prototype.constructor = t),
          (t.__proto__ = e);
      }
      function a(t) {
        if (void 0 === t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return t;
      }
      i =
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
          : Object.assign;
      var u,
        c = i,
        h = ["", "webkit", "Moz", "MS", "ms", "o"],
        l =
          "undefined" == typeof document
            ? { style: {} }
            : document.createElement("div"),
        p = Math.round,
        f = Math.abs,
        v = Date.now;
      function d(t, e) {
        for (
          var n, i, r = e[0].toUpperCase() + e.slice(1), o = 0;
          o < h.length;

        ) {
          if ((i = (n = h[o]) ? n + r : e) in t) return i;
          o++;
        }
      }
      u = "undefined" == typeof window ? {} : window;
      var m = d(l.style, "touchAction"),
        g = void 0 !== m;
      var y = "compute",
        T = "auto",
        E = "manipulation",
        I = "none",
        w = "pan-x",
        A = "pan-y",
        b = (function () {
          if (!g) return !1;
          var t = {},
            e = u.CSS && u.CSS.supports;
          return (
            [
              "auto",
              "manipulation",
              "pan-y",
              "pan-x",
              "pan-x pan-y",
              "none",
            ].forEach(function (n) {
              return (t[n] = !e || u.CSS.supports("touch-action", n));
            }),
            t
          );
        })(),
        C = "ontouchstart" in u,
        _ = void 0 !== d(u, "PointerEvent"),
        P =
          C &&
          /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),
        S = "touch",
        D = "mouse",
        O = 25,
        R = 1,
        x = 4,
        M = 8,
        N = 1,
        z = 2,
        X = 4,
        Y = 8,
        F = 16,
        k = z | X,
        W = Y | F,
        q = k | W,
        L = ["x", "y"],
        H = ["clientX", "clientY"];
      function j(t, e, n) {
        var i;
        if (t)
          if (t.forEach) t.forEach(e, n);
          else if (void 0 !== t.length)
            for (i = 0; i < t.length; ) e.call(n, t[i], i, t), i++;
          else for (i in t) t.hasOwnProperty(i) && e.call(n, t[i], i, t);
      }
      function U(t, e) {
        return "function" === (0, r.Z)(t)
          ? t.apply((e && e[0]) || void 0, e)
          : t;
      }
      function V(t, e) {
        return t.indexOf(e) > -1;
      }
      var G = (function () {
        function t(t, e) {
          (this.manager = t), this.set(e);
        }
        var e = t.prototype;
        return (
          (e.set = function (t) {
            t === y && (t = this.compute()),
              g &&
                this.manager.element.style &&
                b[t] &&
                (this.manager.element.style[m] = t),
              (this.actions = t.toLowerCase().trim());
          }),
          (e.update = function () {
            this.set(this.manager.options.touchAction);
          }),
          (e.compute = function () {
            var t = [];
            return (
              j(this.manager.recognizers, function (e) {
                U(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()));
              }),
              (function (t) {
                if (V(t, I)) return I;
                var e = V(t, w),
                  n = V(t, A);
                return e && n ? I : e || n ? (e ? w : A) : V(t, E) ? E : T;
              })(t.join(" "))
            );
          }),
          (e.preventDefaults = function (t) {
            var e = t.srcEvent,
              n = t.offsetDirection;
            if (this.manager.session.prevented) e.preventDefault();
            else {
              var i = this.actions,
                r = V(i, I) && !b[I],
                o = V(i, A) && !b[A],
                s = V(i, w) && !b[w];
              if (r) {
                var a = 1 === t.pointers.length,
                  u = t.distance < 2,
                  c = t.deltaTime < 250;
                if (a && u && c) return;
              }
              if (!s || !o)
                return r || (o && n & k) || (s && n & W)
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
      function Z(t, e) {
        for (; t; ) {
          if (t === e) return !0;
          t = t.parentNode;
        }
        return !1;
      }
      function B(t) {
        var e = t.length;
        if (1 === e) return { x: p(t[0].clientX), y: p(t[0].clientY) };
        for (var n = 0, i = 0, r = 0; r < e; )
          (n += t[r].clientX), (i += t[r].clientY), r++;
        return { x: p(n / e), y: p(i / e) };
      }
      function K(t) {
        for (var e = [], n = 0; n < t.pointers.length; )
          (e[n] = {
            clientX: p(t.pointers[n].clientX),
            clientY: p(t.pointers[n].clientY),
          }),
            n++;
        return {
          timeStamp: v(),
          pointers: e,
          center: B(e),
          deltaX: t.deltaX,
          deltaY: t.deltaY,
        };
      }
      function $(t, e, n) {
        n || (n = L);
        var i = e[n[0]] - t[n[0]],
          r = e[n[1]] - t[n[1]];
        return Math.sqrt(i * i + r * r);
      }
      function J(t, e, n) {
        n || (n = L);
        var i = e[n[0]] - t[n[0]],
          r = e[n[1]] - t[n[1]];
        return (180 * Math.atan2(r, i)) / Math.PI;
      }
      function Q(t, e) {
        return t === e ? N : f(t) >= f(e) ? (t < 0 ? z : X) : e < 0 ? Y : F;
      }
      function tt(t, e, n) {
        return { x: e / t || 0, y: n / t || 0 };
      }
      function et(t, e) {
        var n = t.session,
          i = e.pointers,
          r = i.length;
        n.firstInput || (n.firstInput = K(e)),
          r > 1 && !n.firstMultiple
            ? (n.firstMultiple = K(e))
            : 1 === r && (n.firstMultiple = !1);
        var o = n.firstInput,
          s = n.firstMultiple,
          a = s ? s.center : o.center,
          u = (e.center = B(i));
        (e.timeStamp = v()),
          (e.deltaTime = e.timeStamp - o.timeStamp),
          (e.angle = J(a, u)),
          (e.distance = $(a, u)),
          (function (t, e) {
            var n = e.center,
              i = t.offsetDelta || {},
              r = t.prevDelta || {},
              o = t.prevInput || {};
            (e.eventType !== R && o.eventType !== x) ||
              ((r = t.prevDelta = { x: o.deltaX || 0, y: o.deltaY || 0 }),
              (i = t.offsetDelta = { x: n.x, y: n.y })),
              (e.deltaX = r.x + (n.x - i.x)),
              (e.deltaY = r.y + (n.y - i.y));
          })(n, e),
          (e.offsetDirection = Q(e.deltaX, e.deltaY));
        var c,
          h,
          l = tt(e.deltaTime, e.deltaX, e.deltaY);
        (e.overallVelocityX = l.x),
          (e.overallVelocityY = l.y),
          (e.overallVelocity = f(l.x) > f(l.y) ? l.x : l.y),
          (e.scale = s
            ? ((c = s.pointers), $((h = i)[0], h[1], H) / $(c[0], c[1], H))
            : 1),
          (e.rotation = s
            ? (function (t, e) {
                return J(e[1], e[0], H) + J(t[1], t[0], H);
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
            if (e.eventType !== M && (a > O || void 0 === s.velocity)) {
              var u = e.deltaX - s.deltaX,
                c = e.deltaY - s.deltaY,
                h = tt(a, u, c);
              (i = h.x),
                (r = h.y),
                (n = f(h.x) > f(h.y) ? h.x : h.y),
                (o = Q(u, c)),
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
        var p,
          d = t.element,
          m = e.srcEvent;
        Z(
          (p = m.composedPath
            ? m.composedPath()[0]
            : m.path
            ? m.path[0]
            : m.target),
          d
        ) && (d = p),
          (e.target = d);
      }
      function nt(t, e, n) {
        var i = n.pointers.length,
          r = n.changedPointers.length,
          o = e & R && i - r == 0,
          s = e & (x | M) && i - r == 0;
        (n.isFirst = !!o),
          (n.isFinal = !!s),
          o && (t.session = {}),
          (n.eventType = e),
          et(t, n),
          t.emit("hammer.input", n),
          t.recognize(n),
          (t.session.prevInput = n);
      }
      function it(t) {
        return t.trim().split(/\s+/g);
      }
      function rt(t, e, n) {
        j(it(e), function (e) {
          t.addEventListener(e, n, !1);
        });
      }
      function ot(t, e, n) {
        j(it(e), function (e) {
          t.removeEventListener(e, n, !1);
        });
      }
      function st(t) {
        var e = t.ownerDocument || t;
        return e.defaultView || e.parentWindow || window;
      }
      var at = (function () {
        function t(t, e) {
          var n = this;
          (this.manager = t),
            (this.callback = e),
            (this.element = t.element),
            (this.target = t.options.inputTarget),
            (this.domHandler = function (e) {
              U(t.options.enable, [t]) && n.handler(e);
            }),
            this.init();
        }
        var e = t.prototype;
        return (
          (e.handler = function () {}),
          (e.init = function () {
            this.evEl && rt(this.element, this.evEl, this.domHandler),
              this.evTarget && rt(this.target, this.evTarget, this.domHandler),
              this.evWin && rt(st(this.element), this.evWin, this.domHandler);
          }),
          (e.destroy = function () {
            this.evEl && ot(this.element, this.evEl, this.domHandler),
              this.evTarget && ot(this.target, this.evTarget, this.domHandler),
              this.evWin && ot(st(this.element), this.evWin, this.domHandler);
          }),
          t
        );
      })();
      function ut(t, e, n) {
        if (t.indexOf && !n) return t.indexOf(e);
        for (var i = 0; i < t.length; ) {
          if ((n && t[i][n] == e) || (!n && t[i] === e)) return i;
          i++;
        }
        return -1;
      }
      var ct = {
          pointerdown: R,
          pointermove: 2,
          pointerup: x,
          pointercancel: M,
          pointerout: M,
        },
        ht = { 2: S, 3: "pen", 4: D, 5: "kinect" },
        lt = "pointerdown",
        pt = "pointermove pointerup pointercancel";
      u.MSPointerEvent &&
        !u.PointerEvent &&
        ((lt = "MSPointerDown"),
        (pt = "MSPointerMove MSPointerUp MSPointerCancel"));
      var ft = (function (t) {
        function e() {
          var n,
            i = e.prototype;
          return (
            (i.evEl = lt),
            (i.evWin = pt),
            ((n = t.apply(this, arguments) || this).store =
              n.manager.session.pointerEvents =
                []),
            n
          );
        }
        return (
          s(e, t),
          (e.prototype.handler = function (t) {
            var e = this.store,
              n = !1,
              i = t.type.toLowerCase().replace("ms", ""),
              r = ct[i],
              o = ht[t.pointerType] || t.pointerType,
              s = o === S,
              a = ut(e, t.pointerId, "pointerId");
            r & R && (0 === t.button || s)
              ? a < 0 && (e.push(t), (a = e.length - 1))
              : r & (x | M) && (n = !0),
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
      })(at);
      function vt(t) {
        return Array.prototype.slice.call(t, 0);
      }
      function dt(t, e, n) {
        for (var i = [], r = [], o = 0; o < t.length; ) {
          var s = e ? t[o][e] : t[o];
          ut(r, s) < 0 && i.push(t[o]), (r[o] = s), o++;
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
      var mt = { touchstart: R, touchmove: 2, touchend: x, touchcancel: M },
        gt = (function (t) {
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
            s(e, t),
            (e.prototype.handler = function (t) {
              var e = mt[t.type],
                n = yt.call(this, t, e);
              n &&
                this.callback(this.manager, e, {
                  pointers: n[0],
                  changedPointers: n[1],
                  pointerType: S,
                  srcEvent: t,
                });
            }),
            e
          );
        })(at);
      function yt(t, e) {
        var n,
          i,
          r = vt(t.touches),
          o = this.targetIds;
        if (e & (2 | R) && 1 === r.length)
          return (o[r[0].identifier] = !0), [r, r];
        var s = vt(t.changedTouches),
          a = [],
          u = this.target;
        if (
          ((i = r.filter(function (t) {
            return Z(t.target, u);
          })),
          e === R)
        )
          for (n = 0; n < i.length; ) (o[i[n].identifier] = !0), n++;
        for (n = 0; n < s.length; )
          o[s[n].identifier] && a.push(s[n]),
            e & (x | M) && delete o[s[n].identifier],
            n++;
        return a.length ? [dt(i.concat(a), "identifier", !0), a] : void 0;
      }
      var Tt = { mousedown: R, mousemove: 2, mouseup: x },
        Et = (function (t) {
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
            s(e, t),
            (e.prototype.handler = function (t) {
              var e = Tt[t.type];
              e & R && 0 === t.button && (this.pressed = !0),
                2 & e && 1 !== t.which && (e = x),
                this.pressed &&
                  (e & x && (this.pressed = !1),
                  this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: D,
                    srcEvent: t,
                  }));
            }),
            e
          );
        })(at),
        It = 2500;
      function wt(t) {
        var e = t.changedPointers[0];
        if (e.identifier === this.primaryTouch) {
          var n = { x: e.clientX, y: e.clientY },
            i = this.lastTouches;
          this.lastTouches.push(n);
          setTimeout(function () {
            var t = i.indexOf(n);
            t > -1 && i.splice(t, 1);
          }, It);
        }
      }
      function At(t, e) {
        t & R
          ? ((this.primaryTouch = e.changedPointers[0].identifier),
            wt.call(this, e))
          : t & (x | M) && wt.call(this, e);
      }
      function bt(t) {
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
      var Ct = (function () {
        return (function (t) {
          function e(e, n) {
            var i;
            return (
              ((i = t.call(this, e, n) || this).handler = function (t, e, n) {
                var r = n.pointerType === S,
                  o = n.pointerType === D;
                if (
                  !(
                    o &&
                    n.sourceCapabilities &&
                    n.sourceCapabilities.firesTouchEvents
                  )
                ) {
                  if (r) At.call(a(a(i)), e, n);
                  else if (o && bt.call(a(a(i)), n)) return;
                  i.callback(t, e, n);
                }
              }),
              (i.touch = new gt(i.manager, i.handler)),
              (i.mouse = new Et(i.manager, i.handler)),
              (i.primaryTouch = null),
              (i.lastTouches = []),
              i
            );
          }
          return (
            s(e, t),
            (e.prototype.destroy = function () {
              this.touch.destroy(), this.mouse.destroy();
            }),
            e
          );
        })(at);
      })();
      function _t(t, e, n) {
        return !!Array.isArray(t) && (j(t, n[e], n), !0);
      }
      var Pt = 32,
        St = 1;
      function Dt(t, e) {
        var n = e.manager;
        return n ? n.get(t) : t;
      }
      function Ot(t) {
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
      var Rt = (function () {
          function t(t) {
            void 0 === t && (t = {}),
              (this.options = o({ enable: !0 }, t)),
              (this.id = St++),
              (this.manager = null),
              (this.state = 1),
              (this.simultaneous = {}),
              (this.requireFail = []);
          }
          var e = t.prototype;
          return (
            (e.set = function (t) {
              return (
                c(this.options, t),
                this.manager && this.manager.touchAction.update(),
                this
              );
            }),
            (e.recognizeWith = function (t) {
              if (_t(t, "recognizeWith", this)) return this;
              var e = this.simultaneous;
              return (
                e[(t = Dt(t, this)).id] ||
                  ((e[t.id] = t), t.recognizeWith(this)),
                this
              );
            }),
            (e.dropRecognizeWith = function (t) {
              return (
                _t(t, "dropRecognizeWith", this) ||
                  ((t = Dt(t, this)), delete this.simultaneous[t.id]),
                this
              );
            }),
            (e.requireFailure = function (t) {
              if (_t(t, "requireFailure", this)) return this;
              var e = this.requireFail;
              return (
                -1 === ut(e, (t = Dt(t, this))) &&
                  (e.push(t), t.requireFailure(this)),
                this
              );
            }),
            (e.dropRequireFailure = function (t) {
              if (_t(t, "dropRequireFailure", this)) return this;
              t = Dt(t, this);
              var e = ut(this.requireFail, t);
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
              n < 8 && i(e.options.event + Ot(n)),
                i(e.options.event),
                t.additionalEvent && i(t.additionalEvent),
                n >= 8 && i(e.options.event + Ot(n));
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
              var e = c({}, t);
              if (!U(this.options.enable, [this, e]))
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
        xt = (function (t) {
          function e(e) {
            var n;
            return (
              void 0 === e && (e = {}),
              ((n =
                t.call(
                  this,
                  o(
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
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              return [E];
            }),
            (n.process = function (t) {
              var e = this,
                n = this.options,
                i = t.pointers.length === n.pointers,
                r = t.distance < n.threshold,
                o = t.deltaTime < n.time;
              if ((this.reset(), t.eventType & R && 0 === this.count))
                return this.failTimeout();
              if (r && o && i) {
                if (t.eventType !== x) return this.failTimeout();
                var s = !this.pTime || t.timeStamp - this.pTime < n.interval,
                  a =
                    !this.pCenter || $(this.pCenter, t.center) < n.posThreshold;
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
        })(Rt),
        Mt = (function (t) {
          function e(e) {
            return (
              void 0 === e && (e = {}),
              t.call(this, o({ pointers: 1 }, e)) || this
            );
          }
          s(e, t);
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
              return i && (n & M || !r)
                ? 16 | e
                : i || r
                ? n & x
                  ? 8 | e
                  : 2 & e
                  ? 4 | e
                  : 2
                : Pt;
            }),
            e
          );
        })(Rt);
      function Nt(t) {
        return t === F
          ? "down"
          : t === Y
          ? "up"
          : t === z
          ? "left"
          : t === X
          ? "right"
          : "";
      }
      var zt = (function (t) {
          function e(e) {
            var n;
            return (
              void 0 === e && (e = {}),
              ((n =
                t.call(
                  this,
                  o(
                    { event: "pan", threshold: 10, pointers: 1, direction: q },
                    e
                  )
                ) || this).pX = null),
              (n.pY = null),
              n
            );
          }
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              var t = this.options.direction,
                e = [];
              return t & k && e.push(A), t & W && e.push(w), e;
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
                  (e.direction & k
                    ? ((r = 0 === o ? N : o < 0 ? z : X),
                      (n = o !== this.pX),
                      (i = Math.abs(t.deltaX)))
                    : ((r = 0 === s ? N : s < 0 ? Y : F),
                      (n = s !== this.pY),
                      (i = Math.abs(t.deltaY)))),
                (t.direction = r),
                n && i > e.threshold && r & e.direction
              );
            }),
            (n.attrTest = function (t) {
              return (
                Mt.prototype.attrTest.call(this, t) &&
                (2 & this.state || (!(2 & this.state) && this.directionTest(t)))
              );
            }),
            (n.emit = function (e) {
              (this.pX = e.deltaX), (this.pY = e.deltaY);
              var n = Nt(e.direction);
              n && (e.additionalEvent = this.options.event + n),
                t.prototype.emit.call(this, e);
            }),
            e
          );
        })(Mt),
        Xt = (function (t) {
          function e(e) {
            return (
              void 0 === e && (e = {}),
              t.call(
                this,
                o(
                  {
                    event: "swipe",
                    threshold: 10,
                    velocity: 0.3,
                    direction: k | W,
                    pointers: 1,
                  },
                  e
                )
              ) || this
            );
          }
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              return zt.prototype.getTouchAction.call(this);
            }),
            (n.attrTest = function (e) {
              var n,
                i = this.options.direction;
              return (
                i & (k | W)
                  ? (n = e.overallVelocity)
                  : i & k
                  ? (n = e.overallVelocityX)
                  : i & W && (n = e.overallVelocityY),
                t.prototype.attrTest.call(this, e) &&
                  i & e.offsetDirection &&
                  e.distance > this.options.threshold &&
                  e.maxPointers === this.options.pointers &&
                  f(n) > this.options.velocity &&
                  e.eventType & x
              );
            }),
            (n.emit = function (t) {
              var e = Nt(t.offsetDirection);
              e && this.manager.emit(this.options.event + e, t),
                this.manager.emit(this.options.event, t);
            }),
            e
          );
        })(Mt),
        Yt = (function (t) {
          function e(e) {
            return (
              void 0 === e && (e = {}),
              t.call(
                this,
                o({ event: "pinch", threshold: 0, pointers: 2 }, e)
              ) || this
            );
          }
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              return [I];
            }),
            (n.attrTest = function (e) {
              return (
                t.prototype.attrTest.call(this, e) &&
                (Math.abs(e.scale - 1) > this.options.threshold ||
                  2 & this.state)
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
        })(Mt),
        Ft = (function (t) {
          function e(e) {
            return (
              void 0 === e && (e = {}),
              t.call(
                this,
                o({ event: "rotate", threshold: 0, pointers: 2 }, e)
              ) || this
            );
          }
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              return [I];
            }),
            (n.attrTest = function (e) {
              return (
                t.prototype.attrTest.call(this, e) &&
                (Math.abs(e.rotation) > this.options.threshold ||
                  2 & this.state)
              );
            }),
            e
          );
        })(Mt),
        kt = (function (t) {
          function e(e) {
            var n;
            return (
              void 0 === e && (e = {}),
              ((n =
                t.call(
                  this,
                  o({ event: "press", pointers: 1, time: 251, threshold: 9 }, e)
                ) || this)._timer = null),
              (n._input = null),
              n
            );
          }
          s(e, t);
          var n = e.prototype;
          return (
            (n.getTouchAction = function () {
              return [T];
            }),
            (n.process = function (t) {
              var e = this,
                n = this.options,
                i = t.pointers.length === n.pointers,
                r = t.distance < n.threshold,
                o = t.deltaTime > n.time;
              if (
                ((this._input = t), !r || !i || (t.eventType & (x | M) && !o))
              )
                this.reset();
              else if (t.eventType & R)
                this.reset(),
                  (this._timer = setTimeout(function () {
                    (e.state = 8), e.tryEmit();
                  }, n.time));
              else if (t.eventType & x) return 8;
              return Pt;
            }),
            (n.reset = function () {
              clearTimeout(this._timer);
            }),
            (n.emit = function (t) {
              8 === this.state &&
                (t && t.eventType & x
                  ? this.manager.emit(this.options.event + "up", t)
                  : ((this._input.timeStamp = v()),
                    this.manager.emit(this.options.event, this._input)));
            }),
            e
          );
        })(Rt),
        Wt = {
          domEvents: !1,
          touchAction: y,
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
        qt = [
          [Ft, { enable: !1 }],
          [Yt, { enable: !1 }, ["rotate"]],
          [Xt, { direction: k }],
          [zt, { direction: k }, ["swipe"]],
          [xt],
          [xt, { event: "doubletap", taps: 2 }, ["tap"]],
          [kt],
        ];
      function Lt(t, e) {
        var n,
          i = t.element;
        i.style &&
          (j(t.options.cssProps, function (r, o) {
            (n = d(i.style, o)),
              e
                ? ((t.oldCssProps[n] = i.style[n]), (i.style[n] = r))
                : (i.style[n] = t.oldCssProps[n] || "");
          }),
          e || (t.oldCssProps = {}));
      }
      var Ht = (function () {
          function t(t, e) {
            var n,
              i = this;
            (this.options = c({}, Wt, e || {})),
              (this.options.inputTarget = this.options.inputTarget || t),
              (this.handlers = {}),
              (this.session = {}),
              (this.recognizers = []),
              (this.oldCssProps = {}),
              (this.element = t),
              (this.input = new ((n = this).options.inputClass ||
                (_ ? ft : P ? gt : C ? Ct : Et))(n, nt)),
              (this.touchAction = new G(this, this.options.touchAction)),
              Lt(this, !0),
              j(
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
                c(this.options, t),
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
              if (t instanceof Rt) return t;
              for (var e = this.recognizers, n = 0; n < e.length; n++)
                if (e[n].options.event === t) return e[n];
              return null;
            }),
            (e.add = function (t) {
              if (_t(t, "add", this)) return this;
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
              if (_t(t, "remove", this)) return this;
              var e = this.get(t);
              if (t) {
                var n = this.recognizers,
                  i = ut(n, e);
                -1 !== i && (n.splice(i, 1), this.touchAction.update());
              }
              return this;
            }),
            (e.on = function (t, e) {
              if (void 0 === t || void 0 === e) return this;
              var n = this.handlers;
              return (
                j(it(t), function (t) {
                  (n[t] = n[t] || []), n[t].push(e);
                }),
                this
              );
            }),
            (e.off = function (t, e) {
              if (void 0 === t) return this;
              var n = this.handlers;
              return (
                j(it(t), function (t) {
                  e ? n[t] && n[t].splice(ut(n[t], e), 1) : delete n[t];
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
              this.element && Lt(this, !1),
                (this.handlers = {}),
                (this.session = {}),
                this.input.destroy(),
                (this.element = null);
            }),
            t
          );
        })(),
        jt = { touchstart: R, touchmove: 2, touchend: x, touchcancel: M },
        Ut = (function (t) {
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
            s(e, t),
            (e.prototype.handler = function (t) {
              var e = jt[t.type];
              if ((e === R && (this.started = !0), this.started)) {
                var n = Vt.call(this, t, e);
                e & (x | M) &&
                  n[0].length - n[1].length == 0 &&
                  (this.started = !1),
                  this.callback(this.manager, e, {
                    pointers: n[0],
                    changedPointers: n[1],
                    pointerType: S,
                    srcEvent: t,
                  });
              }
            }),
            e
          );
        })(at);
      function Vt(t, e) {
        var n = vt(t.touches),
          i = vt(t.changedTouches);
        return e & (x | M) && (n = dt(n.concat(i), "identifier", !0)), [n, i];
      }
      function Gt(t, e, n) {
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
      var Zt = Gt(
          function (t, e, n) {
            for (var i = Object.keys(e), r = 0; r < i.length; )
              (!n || (n && void 0 === t[i[r]])) && (t[i[r]] = e[i[r]]), r++;
            return t;
          },
          "extend",
          "Use `assign`."
        ),
        Bt = Gt(
          function (t, e) {
            return Zt(t, e, !0);
          },
          "merge",
          "Use `assign`."
        );
      function Kt(t, e, n) {
        var i,
          r = e.prototype;
        ((i = t.prototype = Object.create(r)).constructor = t),
          (i._super = r),
          n && c(i, n);
      }
      function $t(t, e) {
        return function () {
          return t.apply(e, arguments);
        };
      }
      var Jt = (function () {
        var t = function (t, e) {
          return (
            void 0 === e && (e = {}),
            new Ht(t, o({ recognizers: qt.concat() }, e))
          );
        };
        return (
          (t.VERSION = "2.0.17-rc"),
          (t.DIRECTION_ALL = q),
          (t.DIRECTION_DOWN = F),
          (t.DIRECTION_LEFT = z),
          (t.DIRECTION_RIGHT = X),
          (t.DIRECTION_UP = Y),
          (t.DIRECTION_HORIZONTAL = k),
          (t.DIRECTION_VERTICAL = W),
          (t.DIRECTION_NONE = N),
          (t.DIRECTION_DOWN = F),
          (t.INPUT_START = R),
          (t.INPUT_MOVE = 2),
          (t.INPUT_END = x),
          (t.INPUT_CANCEL = M),
          (t.STATE_POSSIBLE = 1),
          (t.STATE_BEGAN = 2),
          (t.STATE_CHANGED = 4),
          (t.STATE_ENDED = 8),
          (t.STATE_RECOGNIZED = 8),
          (t.STATE_CANCELLED = 16),
          (t.STATE_FAILED = Pt),
          (t.Manager = Ht),
          (t.Input = at),
          (t.TouchAction = G),
          (t.TouchInput = gt),
          (t.MouseInput = Et),
          (t.PointerEventInput = ft),
          (t.TouchMouseInput = Ct),
          (t.SingleTouchInput = Ut),
          (t.Recognizer = Rt),
          (t.AttrRecognizer = Mt),
          (t.Tap = xt),
          (t.Pan = zt),
          (t.Swipe = Xt),
          (t.Pinch = Yt),
          (t.Rotate = Ft),
          (t.Press = kt),
          (t.on = rt),
          (t.off = ot),
          (t.each = j),
          (t.merge = Bt),
          (t.extend = Zt),
          (t.bindFn = $t),
          (t.assign = c),
          (t.inherit = Kt),
          (t.bindFn = $t),
          (t.prefixed = d),
          (t.toArray = vt),
          (t.inArray = ut),
          (t.uniqueArray = dt),
          (t.splitStr = it),
          (t.boolOrFn = U),
          (t.hasParent = Z),
          (t.addEventListeners = rt),
          (t.removeEventListeners = ot),
          (t.defaults = c({}, Wt, { preset: qt })),
          t
        );
      })();
      Jt.defaults;
    },
    13227: function (t, e, n) {
      n(68077)({ target: "Number", stat: !0 }, { isInteger: n(3873) });
    },
    87463: function (t, e, n) {
      var i = n(68077),
        r = n(22933),
        o = n(72208),
        s = n(73177),
        a = [].push;
      i(
        { target: "Iterator", proto: !0, real: !0 },
        {
          toArray: function () {
            var t = [];
            return o(s(r(this)), a, { that: t, IS_RECORD: !0 }), t;
          },
        }
      );
    },
  },
]);
//# sourceMappingURL=8115.AQii0_2kiGs.js.map
