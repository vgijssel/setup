import { c as t, a as i } from "./c.743a15a1.js";
var e = t(function (t, i) {
  !(function (t) {
    var i = "1.8.0";
    function e(t) {
      var i, e, n, o;
      for (e = 1, n = arguments.length; e < n; e++)
        for (i in (o = arguments[e])) t[i] = o[i];
      return t;
    }
    var n =
      Object.create ||
      (function () {
        function t() {}
        return function (i) {
          return (t.prototype = i), new t();
        };
      })();
    function o(t, i) {
      var e = Array.prototype.slice;
      if (t.bind) return t.bind.apply(t, e.call(arguments, 1));
      var n = e.call(arguments, 2);
      return function () {
        return t.apply(i, n.length ? n.concat(e.call(arguments)) : arguments);
      };
    }
    var s = 0;
    function r(t) {
      return "_leaflet_id" in t || (t._leaflet_id = ++s), t._leaflet_id;
    }
    function a(t, i, e) {
      var n, o, s, r;
      return (
        (r = function () {
          (n = !1), o && (s.apply(e, o), (o = !1));
        }),
        (s = function () {
          n
            ? (o = arguments)
            : (t.apply(e, arguments), setTimeout(r, i), (n = !0));
        }),
        s
      );
    }
    function h(t, i, e) {
      var n = i[1],
        o = i[0],
        s = n - o;
      return t === n && e ? t : ((((t - o) % s) + s) % s) + o;
    }
    function u() {
      return !1;
    }
    function l(t, i) {
      if (!1 === i) return t;
      var e = Math.pow(10, void 0 === i ? 6 : i);
      return Math.round(t * e) / e;
    }
    function c(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function _(t) {
      return c(t).split(/\s+/);
    }
    function d(t, i) {
      for (var e in (Object.prototype.hasOwnProperty.call(t, "options") ||
        (t.options = t.options ? n(t.options) : {}),
      i))
        t.options[e] = i[e];
      return t.options;
    }
    function p(t, i, e) {
      var n = [];
      for (var o in t)
        n.push(
          encodeURIComponent(e ? o.toUpperCase() : o) +
            "=" +
            encodeURIComponent(t[o])
        );
      return (i && -1 !== i.indexOf("?") ? "&" : "?") + n.join("&");
    }
    var m = /\{ *([\w_ -]+) *\}/g;
    function f(t, i) {
      return t.replace(m, function (t, e) {
        var n = i[e];
        if (void 0 === n)
          throw new Error("No value provided for variable " + t);
        return "function" == typeof n && (n = n(i)), n;
      });
    }
    var g =
      Array.isArray ||
      function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      };
    function v(t, i) {
      for (var e = 0; e < t.length; e++) if (t[e] === i) return e;
      return -1;
    }
    var y = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function x(t) {
      return window["webkit" + t] || window["moz" + t] || window["ms" + t];
    }
    var w = 0;
    function P(t) {
      var i = +new Date(),
        e = Math.max(0, 16 - (i - w));
      return (w = i + e), window.setTimeout(t, e);
    }
    var b = window.requestAnimationFrame || x("RequestAnimationFrame") || P,
      T =
        window.cancelAnimationFrame ||
        x("CancelAnimationFrame") ||
        x("CancelRequestAnimationFrame") ||
        function (t) {
          window.clearTimeout(t);
        };
    function z(t, i, e) {
      if (!e || b !== P) return b.call(window, o(t, i));
      t.call(i);
    }
    function M(t) {
      t && T.call(window, t);
    }
    var C = {
      __proto__: null,
      extend: e,
      create: n,
      bind: o,
      get lastId() {
        return s;
      },
      stamp: r,
      throttle: a,
      wrapNum: h,
      falseFn: u,
      formatNum: l,
      trim: c,
      splitWords: _,
      setOptions: d,
      getParamString: p,
      template: f,
      isArray: g,
      indexOf: v,
      emptyImageUrl: y,
      requestFn: b,
      cancelFn: T,
      requestAnimFrame: z,
      cancelAnimFrame: M,
    };
    function Z() {}
    function S(t) {
      if ("undefined" != typeof L && L && L.Mixin) {
        t = g(t) ? t : [t];
        for (var i = 0; i < t.length; i++)
          t[i] === L.Mixin.Events &&
            console.warn(
              "Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",
              new Error().stack
            );
      }
    }
    (Z.extend = function (t) {
      var i = function () {
          d(this),
            this.initialize && this.initialize.apply(this, arguments),
            this.callInitHooks();
        },
        o = (i.__super__ = this.prototype),
        s = n(o);
      for (var r in ((s.constructor = i), (i.prototype = s), this))
        Object.prototype.hasOwnProperty.call(this, r) &&
          "prototype" !== r &&
          "__super__" !== r &&
          (i[r] = this[r]);
      return (
        t.statics && e(i, t.statics),
        t.includes && (S(t.includes), e.apply(null, [s].concat(t.includes))),
        e(s, t),
        delete s.statics,
        delete s.includes,
        s.options &&
          ((s.options = o.options ? n(o.options) : {}),
          e(s.options, t.options)),
        (s._initHooks = []),
        (s.callInitHooks = function () {
          if (!this._initHooksCalled) {
            o.callInitHooks && o.callInitHooks.call(this),
              (this._initHooksCalled = !0);
            for (var t = 0, i = s._initHooks.length; t < i; t++)
              s._initHooks[t].call(this);
          }
        }),
        i
      );
    }),
      (Z.include = function (t) {
        var i = this.prototype.options;
        return (
          e(this.prototype, t),
          t.options &&
            ((this.prototype.options = i), this.mergeOptions(t.options)),
          this
        );
      }),
      (Z.mergeOptions = function (t) {
        return e(this.prototype.options, t), this;
      }),
      (Z.addInitHook = function (t) {
        var i = Array.prototype.slice.call(arguments, 1),
          e =
            "function" == typeof t
              ? t
              : function () {
                  this[t].apply(this, i);
                };
        return (
          (this.prototype._initHooks = this.prototype._initHooks || []),
          this.prototype._initHooks.push(e),
          this
        );
      });
    var k = {
      on: function (t, i, e) {
        if ("object" == typeof t) for (var n in t) this._on(n, t[n], i);
        else
          for (var o = 0, s = (t = _(t)).length; o < s; o++)
            this._on(t[o], i, e);
        return this;
      },
      off: function (t, i, e) {
        if (arguments.length)
          if ("object" == typeof t) for (var n in t) this._off(n, t[n], i);
          else {
            t = _(t);
            for (
              var o = 1 === arguments.length, s = 0, r = t.length;
              s < r;
              s++
            )
              o ? this._off(t[s]) : this._off(t[s], i, e);
          }
        else delete this._events;
        return this;
      },
      _on: function (t, i, e) {
        if ("function" == typeof i) {
          this._events = this._events || {};
          var n = this._events[t];
          n || ((n = []), (this._events[t] = n)), e === this && (e = void 0);
          for (
            var o = { fn: i, ctx: e }, s = n, r = 0, a = s.length;
            r < a;
            r++
          )
            if (s[r].fn === i && s[r].ctx === e) return;
          s.push(o);
        } else console.warn("wrong listener type: " + typeof i);
      },
      _off: function (t, i, e) {
        var n, o, s;
        if (this._events && (n = this._events[t]))
          if (1 !== arguments.length)
            if ((e === this && (e = void 0), "function" == typeof i)) {
              for (o = 0, s = n.length; o < s; o++) {
                var r = n[o];
                if (r.ctx === e && r.fn === i)
                  return (
                    this._firingCount &&
                      ((r.fn = u), (this._events[t] = n = n.slice())),
                    void n.splice(o, 1)
                  );
              }
              console.warn("listener not found");
            } else console.warn("wrong listener type: " + typeof i);
          else {
            if (this._firingCount)
              for (o = 0, s = n.length; o < s; o++) n[o].fn = u;
            delete this._events[t];
          }
      },
      fire: function (t, i, n) {
        if (!this.listens(t, n)) return this;
        var o = e({}, i, {
          type: t,
          target: this,
          sourceTarget: (i && i.sourceTarget) || this,
        });
        if (this._events) {
          var s = this._events[t];
          if (s) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var r = 0, a = s.length; r < a; r++) {
              var h = s[r];
              h.fn.call(h.ctx || this, o);
            }
            this._firingCount--;
          }
        }
        return n && this._propagateEvent(o), this;
      },
      listens: function (t, i) {
        "string" != typeof t && console.warn('"string" type argument expected');
        var e = this._events && this._events[t];
        if (e && e.length) return !0;
        if (i)
          for (var n in this._eventParents)
            if (this._eventParents[n].listens(t, i)) return !0;
        return !1;
      },
      once: function (t, i, e) {
        if ("object" == typeof t) {
          for (var n in t) this.once(n, t[n], i);
          return this;
        }
        var s = o(function () {
          this.off(t, i, e).off(t, s, e);
        }, this);
        return this.on(t, i, e).on(t, s, e);
      },
      addEventParent: function (t) {
        return (
          (this._eventParents = this._eventParents || {}),
          (this._eventParents[r(t)] = t),
          this
        );
      },
      removeEventParent: function (t) {
        return this._eventParents && delete this._eventParents[r(t)], this;
      },
      _propagateEvent: function (t) {
        for (var i in this._eventParents)
          this._eventParents[i].fire(
            t.type,
            e({ layer: t.target, propagatedFrom: t.target }, t),
            !0
          );
      },
    };
    (k.addEventListener = k.on),
      (k.removeEventListener = k.clearAllEventListeners = k.off),
      (k.addOneTimeEventListener = k.once),
      (k.fireEvent = k.fire),
      (k.hasEventListeners = k.listens);
    var E = Z.extend(k);
    function B(t, i, e) {
      (this.x = e ? Math.round(t) : t), (this.y = e ? Math.round(i) : i);
    }
    var A =
      Math.trunc ||
      function (t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
    function I(t, i, e) {
      return t instanceof B
        ? t
        : g(t)
        ? new B(t[0], t[1])
        : null == t
        ? t
        : "object" == typeof t && "x" in t && "y" in t
        ? new B(t.x, t.y)
        : new B(t, i, e);
    }
    function O(t, i) {
      if (t)
        for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++)
          this.extend(e[n]);
    }
    function R(t, i) {
      return !t || t instanceof O ? t : new O(t, i);
    }
    function N(t, i) {
      if (t)
        for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++)
          this.extend(e[n]);
    }
    function D(t, i) {
      return t instanceof N ? t : new N(t, i);
    }
    function j(t, i, e) {
      if (isNaN(t) || isNaN(i))
        throw new Error("Invalid LatLng object: (" + t + ", " + i + ")");
      (this.lat = +t), (this.lng = +i), void 0 !== e && (this.alt = +e);
    }
    function H(t, i, e) {
      return t instanceof j
        ? t
        : g(t) && "object" != typeof t[0]
        ? 3 === t.length
          ? new j(t[0], t[1], t[2])
          : 2 === t.length
          ? new j(t[0], t[1])
          : null
        : null == t
        ? t
        : "object" == typeof t && "lat" in t
        ? new j(t.lat, "lng" in t ? t.lng : t.lon, t.alt)
        : void 0 === i
        ? null
        : new j(t, i, e);
    }
    (B.prototype = {
      clone: function () {
        return new B(this.x, this.y);
      },
      add: function (t) {
        return this.clone()._add(I(t));
      },
      _add: function (t) {
        return (this.x += t.x), (this.y += t.y), this;
      },
      subtract: function (t) {
        return this.clone()._subtract(I(t));
      },
      _subtract: function (t) {
        return (this.x -= t.x), (this.y -= t.y), this;
      },
      divideBy: function (t) {
        return this.clone()._divideBy(t);
      },
      _divideBy: function (t) {
        return (this.x /= t), (this.y /= t), this;
      },
      multiplyBy: function (t) {
        return this.clone()._multiplyBy(t);
      },
      _multiplyBy: function (t) {
        return (this.x *= t), (this.y *= t), this;
      },
      scaleBy: function (t) {
        return new B(this.x * t.x, this.y * t.y);
      },
      unscaleBy: function (t) {
        return new B(this.x / t.x, this.y / t.y);
      },
      round: function () {
        return this.clone()._round();
      },
      _round: function () {
        return (
          (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this
        );
      },
      floor: function () {
        return this.clone()._floor();
      },
      _floor: function () {
        return (
          (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this
        );
      },
      ceil: function () {
        return this.clone()._ceil();
      },
      _ceil: function () {
        return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this;
      },
      trunc: function () {
        return this.clone()._trunc();
      },
      _trunc: function () {
        return (this.x = A(this.x)), (this.y = A(this.y)), this;
      },
      distanceTo: function (t) {
        var i = (t = I(t)).x - this.x,
          e = t.y - this.y;
        return Math.sqrt(i * i + e * e);
      },
      equals: function (t) {
        return (t = I(t)).x === this.x && t.y === this.y;
      },
      contains: function (t) {
        return (
          (t = I(t)),
          Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y)
        );
      },
      toString: function () {
        return "Point(" + l(this.x) + ", " + l(this.y) + ")";
      },
    }),
      (O.prototype = {
        extend: function (t) {
          return (
            (t = I(t)),
            this.min || this.max
              ? ((this.min.x = Math.min(t.x, this.min.x)),
                (this.max.x = Math.max(t.x, this.max.x)),
                (this.min.y = Math.min(t.y, this.min.y)),
                (this.max.y = Math.max(t.y, this.max.y)))
              : ((this.min = t.clone()), (this.max = t.clone())),
            this
          );
        },
        getCenter: function (t) {
          return new B(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t
          );
        },
        getBottomLeft: function () {
          return new B(this.min.x, this.max.y);
        },
        getTopRight: function () {
          return new B(this.max.x, this.min.y);
        },
        getTopLeft: function () {
          return this.min;
        },
        getBottomRight: function () {
          return this.max;
        },
        getSize: function () {
          return this.max.subtract(this.min);
        },
        contains: function (t) {
          var i, e;
          return (
            (t =
              "number" == typeof t[0] || t instanceof B
                ? I(t)
                : R(t)) instanceof O
              ? ((i = t.min), (e = t.max))
              : (i = e = t),
            i.x >= this.min.x &&
              e.x <= this.max.x &&
              i.y >= this.min.y &&
              e.y <= this.max.y
          );
        },
        intersects: function (t) {
          t = R(t);
          var i = this.min,
            e = this.max,
            n = t.min,
            o = t.max,
            s = o.x >= i.x && n.x <= e.x,
            r = o.y >= i.y && n.y <= e.y;
          return s && r;
        },
        overlaps: function (t) {
          t = R(t);
          var i = this.min,
            e = this.max,
            n = t.min,
            o = t.max,
            s = o.x > i.x && n.x < e.x,
            r = o.y > i.y && n.y < e.y;
          return s && r;
        },
        isValid: function () {
          return !(!this.min || !this.max);
        },
      }),
      (N.prototype = {
        extend: function (t) {
          var i,
            e,
            n = this._southWest,
            o = this._northEast;
          if (t instanceof j) (i = t), (e = t);
          else {
            if (!(t instanceof N)) return t ? this.extend(H(t) || D(t)) : this;
            if (((i = t._southWest), (e = t._northEast), !i || !e)) return this;
          }
          return (
            n || o
              ? ((n.lat = Math.min(i.lat, n.lat)),
                (n.lng = Math.min(i.lng, n.lng)),
                (o.lat = Math.max(e.lat, o.lat)),
                (o.lng = Math.max(e.lng, o.lng)))
              : ((this._southWest = new j(i.lat, i.lng)),
                (this._northEast = new j(e.lat, e.lng))),
            this
          );
        },
        pad: function (t) {
          var i = this._southWest,
            e = this._northEast,
            n = Math.abs(i.lat - e.lat) * t,
            o = Math.abs(i.lng - e.lng) * t;
          return new N(
            new j(i.lat - n, i.lng - o),
            new j(e.lat + n, e.lng + o)
          );
        },
        getCenter: function () {
          return new j(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2
          );
        },
        getSouthWest: function () {
          return this._southWest;
        },
        getNorthEast: function () {
          return this._northEast;
        },
        getNorthWest: function () {
          return new j(this.getNorth(), this.getWest());
        },
        getSouthEast: function () {
          return new j(this.getSouth(), this.getEast());
        },
        getWest: function () {
          return this._southWest.lng;
        },
        getSouth: function () {
          return this._southWest.lat;
        },
        getEast: function () {
          return this._northEast.lng;
        },
        getNorth: function () {
          return this._northEast.lat;
        },
        contains: function (t) {
          t =
            "number" == typeof t[0] || t instanceof j || "lat" in t
              ? H(t)
              : D(t);
          var i,
            e,
            n = this._southWest,
            o = this._northEast;
          return (
            t instanceof N
              ? ((i = t.getSouthWest()), (e = t.getNorthEast()))
              : (i = e = t),
            i.lat >= n.lat && e.lat <= o.lat && i.lng >= n.lng && e.lng <= o.lng
          );
        },
        intersects: function (t) {
          t = D(t);
          var i = this._southWest,
            e = this._northEast,
            n = t.getSouthWest(),
            o = t.getNorthEast(),
            s = o.lat >= i.lat && n.lat <= e.lat,
            r = o.lng >= i.lng && n.lng <= e.lng;
          return s && r;
        },
        overlaps: function (t) {
          t = D(t);
          var i = this._southWest,
            e = this._northEast,
            n = t.getSouthWest(),
            o = t.getNorthEast(),
            s = o.lat > i.lat && n.lat < e.lat,
            r = o.lng > i.lng && n.lng < e.lng;
          return s && r;
        },
        toBBoxString: function () {
          return [
            this.getWest(),
            this.getSouth(),
            this.getEast(),
            this.getNorth(),
          ].join(",");
        },
        equals: function (t, i) {
          return (
            !!t &&
            ((t = D(t)),
            this._southWest.equals(t.getSouthWest(), i) &&
              this._northEast.equals(t.getNorthEast(), i))
          );
        },
        isValid: function () {
          return !(!this._southWest || !this._northEast);
        },
      }),
      (j.prototype = {
        equals: function (t, i) {
          return (
            !!t &&
            ((t = H(t)),
            Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)) <=
              (void 0 === i ? 1e-9 : i))
          );
        },
        toString: function (t) {
          return "LatLng(" + l(this.lat, t) + ", " + l(this.lng, t) + ")";
        },
        distanceTo: function (t) {
          return U.distance(this, H(t));
        },
        wrap: function () {
          return U.wrapLatLng(this);
        },
        toBounds: function (t) {
          var i = (180 * t) / 40075017,
            e = i / Math.cos((Math.PI / 180) * this.lat);
          return D([this.lat - i, this.lng - e], [this.lat + i, this.lng + e]);
        },
        clone: function () {
          return new j(this.lat, this.lng, this.alt);
        },
      });
    var W,
      F = {
        latLngToPoint: function (t, i) {
          var e = this.projection.project(t),
            n = this.scale(i);
          return this.transformation._transform(e, n);
        },
        pointToLatLng: function (t, i) {
          var e = this.scale(i),
            n = this.transformation.untransform(t, e);
          return this.projection.unproject(n);
        },
        project: function (t) {
          return this.projection.project(t);
        },
        unproject: function (t) {
          return this.projection.unproject(t);
        },
        scale: function (t) {
          return 256 * Math.pow(2, t);
        },
        zoom: function (t) {
          return Math.log(t / 256) / Math.LN2;
        },
        getProjectedBounds: function (t) {
          if (this.infinite) return null;
          var i = this.projection.bounds,
            e = this.scale(t);
          return new O(
            this.transformation.transform(i.min, e),
            this.transformation.transform(i.max, e)
          );
        },
        infinite: !1,
        wrapLatLng: function (t) {
          var i = this.wrapLng ? h(t.lng, this.wrapLng, !0) : t.lng;
          return new j(
            this.wrapLat ? h(t.lat, this.wrapLat, !0) : t.lat,
            i,
            t.alt
          );
        },
        wrapLatLngBounds: function (t) {
          var i = t.getCenter(),
            e = this.wrapLatLng(i),
            n = i.lat - e.lat,
            o = i.lng - e.lng;
          if (0 === n && 0 === o) return t;
          var s = t.getSouthWest(),
            r = t.getNorthEast();
          return new N(
            new j(s.lat - n, s.lng - o),
            new j(r.lat - n, r.lng - o)
          );
        },
      },
      U = e({}, F, {
        wrapLng: [-180, 180],
        R: 6371e3,
        distance: function (t, i) {
          var e = Math.PI / 180,
            n = t.lat * e,
            o = i.lat * e,
            s = Math.sin(((i.lat - t.lat) * e) / 2),
            r = Math.sin(((i.lng - t.lng) * e) / 2),
            a = s * s + Math.cos(n) * Math.cos(o) * r * r,
            h = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return this.R * h;
        },
      }),
      V = 6378137,
      q = {
        R: V,
        MAX_LATITUDE: 85.0511287798,
        project: function (t) {
          var i = Math.PI / 180,
            e = this.MAX_LATITUDE,
            n = Math.max(Math.min(e, t.lat), -e),
            o = Math.sin(n * i);
          return new B(
            this.R * t.lng * i,
            (this.R * Math.log((1 + o) / (1 - o))) / 2
          );
        },
        unproject: function (t) {
          var i = 180 / Math.PI;
          return new j(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * i,
            (t.x * i) / this.R
          );
        },
        bounds: ((W = V * Math.PI), new O([-W, -W], [W, W])),
      };
    function G(t, i, e, n) {
      if (g(t))
        return (
          (this._a = t[0]),
          (this._b = t[1]),
          (this._c = t[2]),
          void (this._d = t[3])
        );
      (this._a = t), (this._b = i), (this._c = e), (this._d = n);
    }
    function K(t, i, e, n) {
      return new G(t, i, e, n);
    }
    G.prototype = {
      transform: function (t, i) {
        return this._transform(t.clone(), i);
      },
      _transform: function (t, i) {
        return (
          (i = i || 1),
          (t.x = i * (this._a * t.x + this._b)),
          (t.y = i * (this._c * t.y + this._d)),
          t
        );
      },
      untransform: function (t, i) {
        return (
          (i = i || 1),
          new B((t.x / i - this._b) / this._a, (t.y / i - this._d) / this._c)
        );
      },
    };
    var Y = e({}, U, {
        code: "EPSG:3857",
        projection: q,
        transformation: (function () {
          var t = 0.5 / (Math.PI * q.R);
          return K(t, 0.5, -t, 0.5);
        })(),
      }),
      X = e({}, Y, { code: "EPSG:900913" });
    function J(t) {
      return document.createElementNS("http://www.w3.org/2000/svg", t);
    }
    function $(t, i) {
      var e,
        n,
        o,
        s,
        r,
        a,
        h = "";
      for (e = 0, o = t.length; e < o; e++) {
        for (n = 0, s = (r = t[e]).length; n < s; n++)
          h += (n ? "L" : "M") + (a = r[n]).x + " " + a.y;
        h += i ? (Ot.svg ? "z" : "x") : "";
      }
      return h || "M0 0";
    }
    var Q,
      tt = document.documentElement.style,
      it = "ActiveXObject" in window,
      et = it && !document.addEventListener,
      nt = "msLaunchUri" in navigator && !("documentMode" in document),
      ot = It("webkit"),
      st = It("android"),
      rt = It("android 2") || It("android 3"),
      at = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
      ht = st && It("Google") && at < 537 && !("AudioNode" in window),
      ut = !!window.opera,
      lt = !nt && It("chrome"),
      ct = It("gecko") && !ot && !ut && !it,
      _t = !lt && It("safari"),
      dt = It("phantom"),
      pt = "OTransition" in tt,
      mt = 0 === navigator.platform.indexOf("Win"),
      ft = it && "transition" in tt,
      gt =
        "WebKitCSSMatrix" in window &&
        "m11" in new window.WebKitCSSMatrix() &&
        !rt,
      vt = "MozPerspective" in tt,
      yt = !window.L_DISABLE_3D && (ft || gt || vt) && !pt && !dt,
      xt = "undefined" != typeof orientation || It("mobile"),
      wt = xt && ot,
      Pt = xt && gt,
      bt = !window.PointerEvent && window.MSPointerEvent,
      Lt = !(!window.PointerEvent && !bt),
      Tt = "ontouchstart" in window || !!window.TouchEvent,
      zt = !window.L_NO_TOUCH && (Tt || Lt),
      Mt = xt && ut,
      Ct = xt && ct,
      Zt =
        (window.devicePixelRatio ||
          window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,
      St = (function () {
        var t = !1;
        try {
          var i = Object.defineProperty({}, "passive", {
            get: function () {
              t = !0;
            },
          });
          window.addEventListener("testPassiveEventSupport", u, i),
            window.removeEventListener("testPassiveEventSupport", u, i);
        } catch (t) {}
        return t;
      })(),
      kt = !!document.createElement("canvas").getContext,
      Et = !(!document.createElementNS || !J("svg").createSVGRect),
      Bt =
        !!Et &&
        (((Q = document.createElement("div")).innerHTML = "<svg/>"),
        "http://www.w3.org/2000/svg" ===
          (Q.firstChild && Q.firstChild.namespaceURI)),
      At =
        !Et &&
        (function () {
          try {
            var t = document.createElement("div");
            t.innerHTML = '<v:shape adj="1"/>';
            var i = t.firstChild;
            return (
              (i.style.behavior = "url(#default#VML)"),
              i && "object" == typeof i.adj
            );
          } catch (t) {
            return !1;
          }
        })();
    function It(t) {
      return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
    }
    var Ot = {
        ie: it,
        ielt9: et,
        edge: nt,
        webkit: ot,
        android: st,
        android23: rt,
        androidStock: ht,
        opera: ut,
        chrome: lt,
        gecko: ct,
        safari: _t,
        phantom: dt,
        opera12: pt,
        win: mt,
        ie3d: ft,
        webkit3d: gt,
        gecko3d: vt,
        any3d: yt,
        mobile: xt,
        mobileWebkit: wt,
        mobileWebkit3d: Pt,
        msPointer: bt,
        pointer: Lt,
        touch: zt,
        touchNative: Tt,
        mobileOpera: Mt,
        mobileGecko: Ct,
        retina: Zt,
        passiveEvents: St,
        canvas: kt,
        svg: Et,
        vml: At,
        inlineSvg: Bt,
      },
      Rt = Ot.msPointer ? "MSPointerDown" : "pointerdown",
      Nt = Ot.msPointer ? "MSPointerMove" : "pointermove",
      Dt = Ot.msPointer ? "MSPointerUp" : "pointerup",
      jt = Ot.msPointer ? "MSPointerCancel" : "pointercancel",
      Ht = { touchstart: Rt, touchmove: Nt, touchend: Dt, touchcancel: jt },
      Wt = { touchstart: $t, touchmove: Jt, touchend: Jt, touchcancel: Jt },
      Ft = {},
      Ut = !1;
    function Vt(t, i, e) {
      return (
        "touchstart" === i && Xt(),
        Wt[i]
          ? ((e = Wt[i].bind(this, e)), t.addEventListener(Ht[i], e, !1), e)
          : (console.warn("wrong event specified:", i), L.Util.falseFn)
      );
    }
    function qt(t, i, e) {
      Ht[i]
        ? t.removeEventListener(Ht[i], e, !1)
        : console.warn("wrong event specified:", i);
    }
    function Gt(t) {
      Ft[t.pointerId] = t;
    }
    function Kt(t) {
      Ft[t.pointerId] && (Ft[t.pointerId] = t);
    }
    function Yt(t) {
      delete Ft[t.pointerId];
    }
    function Xt() {
      Ut ||
        (document.addEventListener(Rt, Gt, !0),
        document.addEventListener(Nt, Kt, !0),
        document.addEventListener(Dt, Yt, !0),
        document.addEventListener(jt, Yt, !0),
        (Ut = !0));
    }
    function Jt(t, i) {
      if (i.pointerType !== (i.MSPOINTER_TYPE_MOUSE || "mouse")) {
        for (var e in ((i.touches = []), Ft)) i.touches.push(Ft[e]);
        (i.changedTouches = [i]), t(i);
      }
    }
    function $t(t, i) {
      i.MSPOINTER_TYPE_TOUCH &&
        i.pointerType === i.MSPOINTER_TYPE_TOUCH &&
        Gi(i),
        Jt(t, i);
    }
    function Qt(t) {
      var i,
        e,
        n = {};
      for (e in t) (i = t[e]), (n[e] = i && i.bind ? i.bind(t) : i);
      return (
        (t = n),
        (n.type = "dblclick"),
        (n.detail = 2),
        (n.isTrusted = !1),
        (n._simulated = !0),
        n
      );
    }
    var ti = 200;
    function ii(t, i) {
      t.addEventListener("dblclick", i);
      var e,
        n = 0;
      function o(t) {
        if (1 === t.detail) {
          if (
            "mouse" !== t.pointerType &&
            (!t.sourceCapabilities || t.sourceCapabilities.firesTouchEvents)
          ) {
            var o = Date.now();
            o - n <= ti ? 2 == ++e && i(Qt(t)) : (e = 1), (n = o);
          }
        } else e = t.detail;
      }
      return t.addEventListener("click", o), { dblclick: i, simDblclick: o };
    }
    function ei(t, i) {
      t.removeEventListener("dblclick", i.dblclick),
        t.removeEventListener("click", i.simDblclick);
    }
    var ni,
      oi,
      si,
      ri,
      ai,
      hi = Ti([
        "transform",
        "webkitTransform",
        "OTransform",
        "MozTransform",
        "msTransform",
      ]),
      ui = Ti([
        "webkitTransition",
        "transition",
        "OTransition",
        "MozTransition",
        "msTransition",
      ]),
      li =
        "webkitTransition" === ui || "OTransition" === ui
          ? ui + "End"
          : "transitionend";
    function ci(t) {
      return "string" == typeof t ? document.getElementById(t) : t;
    }
    function _i(t, i) {
      var e = t.style[i] || (t.currentStyle && t.currentStyle[i]);
      if ((!e || "auto" === e) && document.defaultView) {
        var n = document.defaultView.getComputedStyle(t, null);
        e = n ? n[i] : null;
      }
      return "auto" === e ? null : e;
    }
    function di(t, i, e) {
      var n = document.createElement(t);
      return (n.className = i || ""), e && e.appendChild(n), n;
    }
    function pi(t) {
      var i = t.parentNode;
      i && i.removeChild(t);
    }
    function mi(t) {
      for (; t.firstChild; ) t.removeChild(t.firstChild);
    }
    function fi(t) {
      var i = t.parentNode;
      i && i.lastChild !== t && i.appendChild(t);
    }
    function gi(t) {
      var i = t.parentNode;
      i && i.firstChild !== t && i.insertBefore(t, i.firstChild);
    }
    function vi(t, i) {
      if (void 0 !== t.classList) return t.classList.contains(i);
      var e = Pi(t);
      return e.length > 0 && new RegExp("(^|\\s)" + i + "(\\s|$)").test(e);
    }
    function yi(t, i) {
      if (void 0 !== t.classList)
        for (var e = _(i), n = 0, o = e.length; n < o; n++)
          t.classList.add(e[n]);
      else if (!vi(t, i)) {
        var s = Pi(t);
        wi(t, (s ? s + " " : "") + i);
      }
    }
    function xi(t, i) {
      void 0 !== t.classList
        ? t.classList.remove(i)
        : wi(t, c((" " + Pi(t) + " ").replace(" " + i + " ", " ")));
    }
    function wi(t, i) {
      void 0 === t.className.baseVal
        ? (t.className = i)
        : (t.className.baseVal = i);
    }
    function Pi(t) {
      return (
        t.correspondingElement && (t = t.correspondingElement),
        void 0 === t.className.baseVal ? t.className : t.className.baseVal
      );
    }
    function bi(t, i) {
      "opacity" in t.style
        ? (t.style.opacity = i)
        : "filter" in t.style && Li(t, i);
    }
    function Li(t, i) {
      var e = !1,
        n = "DXImageTransform.Microsoft.Alpha";
      try {
        e = t.filters.item(n);
      } catch (t) {
        if (1 === i) return;
      }
      (i = Math.round(100 * i)),
        e
          ? ((e.Enabled = 100 !== i), (e.Opacity = i))
          : (t.style.filter += " progid:" + n + "(opacity=" + i + ")");
    }
    function Ti(t) {
      for (var i = document.documentElement.style, e = 0; e < t.length; e++)
        if (t[e] in i) return t[e];
      return !1;
    }
    function zi(t, i, e) {
      var n = i || new B(0, 0);
      t.style[hi] =
        (Ot.ie3d
          ? "translate(" + n.x + "px," + n.y + "px)"
          : "translate3d(" + n.x + "px," + n.y + "px,0)") +
        (e ? " scale(" + e + ")" : "");
    }
    function Mi(t, i) {
      (t._leaflet_pos = i),
        Ot.any3d
          ? zi(t, i)
          : ((t.style.left = i.x + "px"), (t.style.top = i.y + "px"));
    }
    function Ci(t) {
      return t._leaflet_pos || new B(0, 0);
    }
    if ("onselectstart" in document)
      (ni = function () {
        Ri(window, "selectstart", Gi);
      }),
        (oi = function () {
          Di(window, "selectstart", Gi);
        });
    else {
      var Zi = Ti([
        "userSelect",
        "WebkitUserSelect",
        "OUserSelect",
        "MozUserSelect",
        "msUserSelect",
      ]);
      (ni = function () {
        if (Zi) {
          var t = document.documentElement.style;
          (si = t[Zi]), (t[Zi] = "none");
        }
      }),
        (oi = function () {
          Zi && ((document.documentElement.style[Zi] = si), (si = void 0));
        });
    }
    function Si() {
      Ri(window, "dragstart", Gi);
    }
    function ki() {
      Di(window, "dragstart", Gi);
    }
    function Ei(t) {
      for (; -1 === t.tabIndex; ) t = t.parentNode;
      t.style &&
        (Bi(),
        (ri = t),
        (ai = t.style.outline),
        (t.style.outline = "none"),
        Ri(window, "keydown", Bi));
    }
    function Bi() {
      ri &&
        ((ri.style.outline = ai),
        (ri = void 0),
        (ai = void 0),
        Di(window, "keydown", Bi));
    }
    function Ai(t) {
      do {
        t = t.parentNode;
      } while (!((t.offsetWidth && t.offsetHeight) || t === document.body));
      return t;
    }
    function Ii(t) {
      var i = t.getBoundingClientRect();
      return {
        x: i.width / t.offsetWidth || 1,
        y: i.height / t.offsetHeight || 1,
        boundingClientRect: i,
      };
    }
    var Oi = {
      __proto__: null,
      TRANSFORM: hi,
      TRANSITION: ui,
      TRANSITION_END: li,
      get: ci,
      getStyle: _i,
      create: di,
      remove: pi,
      empty: mi,
      toFront: fi,
      toBack: gi,
      hasClass: vi,
      addClass: yi,
      removeClass: xi,
      setClass: wi,
      getClass: Pi,
      setOpacity: bi,
      testProp: Ti,
      setTransform: zi,
      setPosition: Mi,
      getPosition: Ci,
      get disableTextSelection() {
        return ni;
      },
      get enableTextSelection() {
        return oi;
      },
      disableImageDrag: Si,
      enableImageDrag: ki,
      preventOutline: Ei,
      restoreOutline: Bi,
      getSizedParentNode: Ai,
      getScale: Ii,
    };
    function Ri(t, i, e, n) {
      if (i && "object" == typeof i) for (var o in i) Wi(t, o, i[o], e);
      else for (var s = 0, r = (i = _(i)).length; s < r; s++) Wi(t, i[s], e, n);
      return this;
    }
    var Ni = "_leaflet_events";
    function Di(t, i, e, n) {
      if (1 === arguments.length) ji(t), delete t[Ni];
      else if (i && "object" == typeof i) for (var o in i) Fi(t, o, i[o], e);
      else if (((i = _(i)), 2 === arguments.length))
        ji(t, function (t) {
          return -1 !== v(i, t);
        });
      else for (var s = 0, r = i.length; s < r; s++) Fi(t, i[s], e, n);
      return this;
    }
    function ji(t, i) {
      for (var e in t[Ni]) {
        var n = e.split(/\d/)[0];
        (i && !i(n)) || Fi(t, n, null, null, e);
      }
    }
    var Hi = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel",
    };
    function Wi(t, i, e, n) {
      var o = i + r(e) + (n ? "_" + r(n) : "");
      if (t[Ni] && t[Ni][o]) return this;
      var s = function (i) {
          return e.call(n || t, i || window.event);
        },
        a = s;
      !Ot.touchNative && Ot.pointer && 0 === i.indexOf("touch")
        ? (s = Vt(t, i, s))
        : Ot.touch && "dblclick" === i
        ? (s = ii(t, s))
        : "addEventListener" in t
        ? "touchstart" === i ||
          "touchmove" === i ||
          "wheel" === i ||
          "mousewheel" === i
          ? t.addEventListener(
              Hi[i] || i,
              s,
              !!Ot.passiveEvents && { passive: !1 }
            )
          : "mouseenter" === i || "mouseleave" === i
          ? ((s = function (i) {
              (i = i || window.event), $i(t, i) && a(i);
            }),
            t.addEventListener(Hi[i], s, !1))
          : t.addEventListener(i, a, !1)
        : t.attachEvent("on" + i, s),
        (t[Ni] = t[Ni] || {}),
        (t[Ni][o] = s);
    }
    function Fi(t, i, e, n, o) {
      o = o || i + r(e) + (n ? "_" + r(n) : "");
      var s = t[Ni] && t[Ni][o];
      if (!s) return this;
      !Ot.touchNative && Ot.pointer && 0 === i.indexOf("touch")
        ? qt(t, i, s)
        : Ot.touch && "dblclick" === i
        ? ei(t, s)
        : "removeEventListener" in t
        ? t.removeEventListener(Hi[i] || i, s, !1)
        : t.detachEvent("on" + i, s),
        (t[Ni][o] = null);
    }
    function Ui(t) {
      return (
        t.stopPropagation
          ? t.stopPropagation()
          : t.originalEvent
          ? (t.originalEvent._stopped = !0)
          : (t.cancelBubble = !0),
        this
      );
    }
    function Vi(t) {
      return Wi(t, "wheel", Ui), this;
    }
    function qi(t) {
      return (
        Ri(t, "mousedown touchstart dblclick contextmenu", Ui),
        (t._leaflet_disable_click = !0),
        this
      );
    }
    function Gi(t) {
      return t.preventDefault ? t.preventDefault() : (t.returnValue = !1), this;
    }
    function Ki(t) {
      return Gi(t), Ui(t), this;
    }
    function Yi(t, i) {
      if (!i) return new B(t.clientX, t.clientY);
      var e = Ii(i),
        n = e.boundingClientRect;
      return new B(
        (t.clientX - n.left) / e.x - i.clientLeft,
        (t.clientY - n.top) / e.y - i.clientTop
      );
    }
    var Xi =
      Ot.win && Ot.chrome
        ? 2 * window.devicePixelRatio
        : Ot.gecko
        ? window.devicePixelRatio
        : 1;
    function Ji(t) {
      return Ot.edge
        ? t.wheelDeltaY / 2
        : t.deltaY && 0 === t.deltaMode
        ? -t.deltaY / Xi
        : t.deltaY && 1 === t.deltaMode
        ? 20 * -t.deltaY
        : t.deltaY && 2 === t.deltaMode
        ? 60 * -t.deltaY
        : t.deltaX || t.deltaZ
        ? 0
        : t.wheelDelta
        ? (t.wheelDeltaY || t.wheelDelta) / 2
        : t.detail && Math.abs(t.detail) < 32765
        ? 20 * -t.detail
        : t.detail
        ? (t.detail / -32765) * 60
        : 0;
    }
    function $i(t, i) {
      var e = i.relatedTarget;
      if (!e) return !0;
      try {
        for (; e && e !== t; ) e = e.parentNode;
      } catch (t) {
        return !1;
      }
      return e !== t;
    }
    var Qi = {
        __proto__: null,
        on: Ri,
        off: Di,
        stopPropagation: Ui,
        disableScrollPropagation: Vi,
        disableClickPropagation: qi,
        preventDefault: Gi,
        stop: Ki,
        getMousePosition: Yi,
        getWheelDelta: Ji,
        isExternalTarget: $i,
        addListener: Ri,
        removeListener: Di,
      },
      te = E.extend({
        run: function (t, i, e, n) {
          this.stop(),
            (this._el = t),
            (this._inProgress = !0),
            (this._duration = e || 0.25),
            (this._easeOutPower = 1 / Math.max(n || 0.5, 0.2)),
            (this._startPos = Ci(t)),
            (this._offset = i.subtract(this._startPos)),
            (this._startTime = +new Date()),
            this.fire("start"),
            this._animate();
        },
        stop: function () {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function () {
          (this._animId = z(this._animate, this)), this._step();
        },
        _step: function (t) {
          var i = +new Date() - this._startTime,
            e = 1e3 * this._duration;
          i < e
            ? this._runFrame(this._easeOut(i / e), t)
            : (this._runFrame(1), this._complete());
        },
        _runFrame: function (t, i) {
          var e = this._startPos.add(this._offset.multiplyBy(t));
          i && e._round(), Mi(this._el, e), this.fire("step");
        },
        _complete: function () {
          M(this._animId), (this._inProgress = !1), this.fire("end");
        },
        _easeOut: function (t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        },
      }),
      ie = E.extend({
        options: {
          crs: Y,
          center: void 0,
          zoom: void 0,
          minZoom: void 0,
          maxZoom: void 0,
          layers: [],
          maxBounds: void 0,
          renderer: void 0,
          zoomAnimation: !0,
          zoomAnimationThreshold: 4,
          fadeAnimation: !0,
          markerZoomAnimation: !0,
          transform3DLimit: 8388608,
          zoomSnap: 1,
          zoomDelta: 1,
          trackResize: !0,
        },
        initialize: function (t, i) {
          (i = d(this, i)),
            (this._handlers = []),
            (this._layers = {}),
            (this._zoomBoundLayers = {}),
            (this._sizeChanged = !0),
            this._initContainer(t),
            this._initLayout(),
            (this._onResize = o(this._onResize, this)),
            this._initEvents(),
            i.maxBounds && this.setMaxBounds(i.maxBounds),
            void 0 !== i.zoom && (this._zoom = this._limitZoom(i.zoom)),
            i.center &&
              void 0 !== i.zoom &&
              this.setView(H(i.center), i.zoom, { reset: !0 }),
            this.callInitHooks(),
            (this._zoomAnimated =
              ui && Ot.any3d && !Ot.mobileOpera && this.options.zoomAnimation),
            this._zoomAnimated &&
              (this._createAnimProxy(),
              Ri(this._proxy, li, this._catchTransitionEnd, this)),
            this._addLayers(this.options.layers);
        },
        setView: function (t, i, n) {
          return (
            (i = void 0 === i ? this._zoom : this._limitZoom(i)),
            (t = this._limitCenter(H(t), i, this.options.maxBounds)),
            (n = n || {}),
            this._stop(),
            this._loaded &&
            !n.reset &&
            !0 !== n &&
            (void 0 !== n.animate &&
              ((n.zoom = e({ animate: n.animate }, n.zoom)),
              (n.pan = e({ animate: n.animate, duration: n.duration }, n.pan))),
            this._zoom !== i
              ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, i, n.zoom)
              : this._tryAnimatedPan(t, n.pan))
              ? (clearTimeout(this._sizeTimer), this)
              : (this._resetView(t, i), this)
          );
        },
        setZoom: function (t, i) {
          return this._loaded
            ? this.setView(this.getCenter(), t, { zoom: i })
            : ((this._zoom = t), this);
        },
        zoomIn: function (t, i) {
          return (
            (t = t || (Ot.any3d ? this.options.zoomDelta : 1)),
            this.setZoom(this._zoom + t, i)
          );
        },
        zoomOut: function (t, i) {
          return (
            (t = t || (Ot.any3d ? this.options.zoomDelta : 1)),
            this.setZoom(this._zoom - t, i)
          );
        },
        setZoomAround: function (t, i, e) {
          var n = this.getZoomScale(i),
            o = this.getSize().divideBy(2),
            s = (t instanceof B ? t : this.latLngToContainerPoint(t))
              .subtract(o)
              .multiplyBy(1 - 1 / n),
            r = this.containerPointToLatLng(o.add(s));
          return this.setView(r, i, { zoom: e });
        },
        _getBoundsCenterZoom: function (t, i) {
          (i = i || {}), (t = t.getBounds ? t.getBounds() : D(t));
          var e = I(i.paddingTopLeft || i.padding || [0, 0]),
            n = I(i.paddingBottomRight || i.padding || [0, 0]),
            o = this.getBoundsZoom(t, !1, e.add(n));
          if (
            (o = "number" == typeof i.maxZoom ? Math.min(i.maxZoom, o) : o) ===
            1 / 0
          )
            return { center: t.getCenter(), zoom: o };
          var s = n.subtract(e).divideBy(2),
            r = this.project(t.getSouthWest(), o),
            a = this.project(t.getNorthEast(), o);
          return {
            center: this.unproject(r.add(a).divideBy(2).add(s), o),
            zoom: o,
          };
        },
        fitBounds: function (t, i) {
          if (!(t = D(t)).isValid()) throw new Error("Bounds are not valid.");
          var e = this._getBoundsCenterZoom(t, i);
          return this.setView(e.center, e.zoom, i);
        },
        fitWorld: function (t) {
          return this.fitBounds(
            [
              [-90, -180],
              [90, 180],
            ],
            t
          );
        },
        panTo: function (t, i) {
          return this.setView(t, this._zoom, { pan: i });
        },
        panBy: function (t, i) {
          if (((i = i || {}), !(t = I(t).round()).x && !t.y))
            return this.fire("moveend");
          if (!0 !== i.animate && !this.getSize().contains(t))
            return (
              this._resetView(
                this.unproject(this.project(this.getCenter()).add(t)),
                this.getZoom()
              ),
              this
            );
          if (
            (this._panAnim ||
              ((this._panAnim = new te()),
              this._panAnim.on(
                {
                  step: this._onPanTransitionStep,
                  end: this._onPanTransitionEnd,
                },
                this
              )),
            i.noMoveStart || this.fire("movestart"),
            !1 !== i.animate)
          ) {
            yi(this._mapPane, "leaflet-pan-anim");
            var e = this._getMapPanePos().subtract(t).round();
            this._panAnim.run(
              this._mapPane,
              e,
              i.duration || 0.25,
              i.easeLinearity
            );
          } else this._rawPanBy(t), this.fire("move").fire("moveend");
          return this;
        },
        flyTo: function (t, i, e) {
          if (!1 === (e = e || {}).animate || !Ot.any3d)
            return this.setView(t, i, e);
          this._stop();
          var n = this.project(this.getCenter()),
            o = this.project(t),
            s = this.getSize(),
            r = this._zoom;
          (t = H(t)), (i = void 0 === i ? r : i);
          var a = Math.max(s.x, s.y),
            h = a * this.getZoomScale(r, i),
            u = o.distanceTo(n) || 1,
            l = 1.42,
            c = l * l;
          function _(t) {
            var i =
                (h * h - a * a + (t ? -1 : 1) * c * c * u * u) /
                (2 * (t ? h : a) * c * u),
              e = Math.sqrt(i * i + 1) - i;
            return e < 1e-9 ? -18 : Math.log(e);
          }
          function d(t) {
            return (Math.exp(t) - Math.exp(-t)) / 2;
          }
          function p(t) {
            return (Math.exp(t) + Math.exp(-t)) / 2;
          }
          function m(t) {
            return d(t) / p(t);
          }
          var f = _(0);
          function g(t) {
            return a * (p(f) / p(f + l * t));
          }
          function v(t) {
            return (a * (p(f) * m(f + l * t) - d(f))) / c;
          }
          function y(t) {
            return 1 - Math.pow(1 - t, 1.5);
          }
          var x = Date.now(),
            w = (_(1) - f) / l,
            P = e.duration ? 1e3 * e.duration : 1e3 * w * 0.8;
          function b() {
            var e = (Date.now() - x) / P,
              s = y(e) * w;
            e <= 1
              ? ((this._flyToFrame = z(b, this)),
                this._move(
                  this.unproject(n.add(o.subtract(n).multiplyBy(v(s) / u)), r),
                  this.getScaleZoom(a / g(s), r),
                  { flyTo: !0 }
                ))
              : this._move(t, i)._moveEnd(!0);
          }
          return this._moveStart(!0, e.noMoveStart), b.call(this), this;
        },
        flyToBounds: function (t, i) {
          var e = this._getBoundsCenterZoom(t, i);
          return this.flyTo(e.center, e.zoom, i);
        },
        setMaxBounds: function (t) {
          return (t = D(t)).isValid()
            ? (this.options.maxBounds &&
                this.off("moveend", this._panInsideMaxBounds),
              (this.options.maxBounds = t),
              this._loaded && this._panInsideMaxBounds(),
              this.on("moveend", this._panInsideMaxBounds))
            : ((this.options.maxBounds = null),
              this.off("moveend", this._panInsideMaxBounds));
        },
        setMinZoom: function (t) {
          var i = this.options.minZoom;
          return (
            (this.options.minZoom = t),
            this._loaded &&
            i !== t &&
            (this.fire("zoomlevelschange"),
            this.getZoom() < this.options.minZoom)
              ? this.setZoom(t)
              : this
          );
        },
        setMaxZoom: function (t) {
          var i = this.options.maxZoom;
          return (
            (this.options.maxZoom = t),
            this._loaded &&
            i !== t &&
            (this.fire("zoomlevelschange"),
            this.getZoom() > this.options.maxZoom)
              ? this.setZoom(t)
              : this
          );
        },
        panInsideBounds: function (t, i) {
          this._enforcingBounds = !0;
          var e = this.getCenter(),
            n = this._limitCenter(e, this._zoom, D(t));
          return (
            e.equals(n) || this.panTo(n, i), (this._enforcingBounds = !1), this
          );
        },
        panInside: function (t, i) {
          var e = I((i = i || {}).paddingTopLeft || i.padding || [0, 0]),
            n = I(i.paddingBottomRight || i.padding || [0, 0]),
            o = this.project(this.getCenter()),
            s = this.project(t),
            r = this.getPixelBounds(),
            a = R([r.min.add(e), r.max.subtract(n)]),
            h = a.getSize();
          if (!a.contains(s)) {
            this._enforcingBounds = !0;
            var u = s.subtract(a.getCenter()),
              l = a.extend(s).getSize().subtract(h);
            (o.x += u.x < 0 ? -l.x : l.x),
              (o.y += u.y < 0 ? -l.y : l.y),
              this.panTo(this.unproject(o), i),
              (this._enforcingBounds = !1);
          }
          return this;
        },
        invalidateSize: function (t) {
          if (!this._loaded) return this;
          t = e({ animate: !1, pan: !0 }, !0 === t ? { animate: !0 } : t);
          var i = this.getSize();
          (this._sizeChanged = !0), (this._lastCenter = null);
          var n = this.getSize(),
            s = i.divideBy(2).round(),
            r = n.divideBy(2).round(),
            a = s.subtract(r);
          return a.x || a.y
            ? (t.animate && t.pan
                ? this.panBy(a)
                : (t.pan && this._rawPanBy(a),
                  this.fire("move"),
                  t.debounceMoveend
                    ? (clearTimeout(this._sizeTimer),
                      (this._sizeTimer = setTimeout(
                        o(this.fire, this, "moveend"),
                        200
                      )))
                    : this.fire("moveend")),
              this.fire("resize", { oldSize: i, newSize: n }))
            : this;
        },
        stop: function () {
          return (
            this.setZoom(this._limitZoom(this._zoom)),
            this.options.zoomSnap || this.fire("viewreset"),
            this._stop()
          );
        },
        locate: function (t) {
          if (
            ((t = this._locateOptions = e({ timeout: 1e4, watch: !1 }, t)),
            !("geolocation" in navigator))
          )
            return (
              this._handleGeolocationError({
                code: 0,
                message: "Geolocation not supported.",
              }),
              this
            );
          var i = o(this._handleGeolocationResponse, this),
            n = o(this._handleGeolocationError, this);
          return (
            t.watch
              ? (this._locationWatchId = navigator.geolocation.watchPosition(
                  i,
                  n,
                  t
                ))
              : navigator.geolocation.getCurrentPosition(i, n, t),
            this
          );
        },
        stopLocate: function () {
          return (
            navigator.geolocation &&
              navigator.geolocation.clearWatch &&
              navigator.geolocation.clearWatch(this._locationWatchId),
            this._locateOptions && (this._locateOptions.setView = !1),
            this
          );
        },
        _handleGeolocationError: function (t) {
          if (this._container._leaflet_id) {
            var i = t.code,
              e =
                t.message ||
                (1 === i
                  ? "permission denied"
                  : 2 === i
                  ? "position unavailable"
                  : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(),
              this.fire("locationerror", {
                code: i,
                message: "Geolocation error: " + e + ".",
              });
          }
        },
        _handleGeolocationResponse: function (t) {
          if (this._container._leaflet_id) {
            var i = new j(t.coords.latitude, t.coords.longitude),
              e = i.toBounds(2 * t.coords.accuracy),
              n = this._locateOptions;
            if (n.setView) {
              var o = this.getBoundsZoom(e);
              this.setView(i, n.maxZoom ? Math.min(o, n.maxZoom) : o);
            }
            var s = { latlng: i, bounds: e, timestamp: t.timestamp };
            for (var r in t.coords)
              "number" == typeof t.coords[r] && (s[r] = t.coords[r]);
            this.fire("locationfound", s);
          }
        },
        addHandler: function (t, i) {
          if (!i) return this;
          var e = (this[t] = new i(this));
          return this._handlers.push(e), this.options[t] && e.enable(), this;
        },
        remove: function () {
          if (
            (this._initEvents(!0),
            this.options.maxBounds &&
              this.off("moveend", this._panInsideMaxBounds),
            this._containerId !== this._container._leaflet_id)
          )
            throw new Error(
              "Map container is being reused by another instance"
            );
          try {
            delete this._container._leaflet_id, delete this._containerId;
          } catch (t) {
            (this._container._leaflet_id = void 0),
              (this._containerId = void 0);
          }
          var t;
          for (t in (void 0 !== this._locationWatchId && this.stopLocate(),
          this._stop(),
          pi(this._mapPane),
          this._clearControlPos && this._clearControlPos(),
          this._resizeRequest &&
            (M(this._resizeRequest), (this._resizeRequest = null)),
          this._clearHandlers(),
          this._loaded && this.fire("unload"),
          this._layers))
            this._layers[t].remove();
          for (t in this._panes) pi(this._panes[t]);
          return (
            (this._layers = []),
            (this._panes = []),
            delete this._mapPane,
            delete this._renderer,
            this
          );
        },
        createPane: function (t, i) {
          var e = di(
            "div",
            "leaflet-pane" +
              (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""),
            i || this._mapPane
          );
          return t && (this._panes[t] = e), e;
        },
        getCenter: function () {
          return (
            this._checkIfLoaded(),
            this._lastCenter && !this._moved()
              ? this._lastCenter
              : this.layerPointToLatLng(this._getCenterLayerPoint())
          );
        },
        getZoom: function () {
          return this._zoom;
        },
        getBounds: function () {
          var t = this.getPixelBounds();
          return new N(
            this.unproject(t.getBottomLeft()),
            this.unproject(t.getTopRight())
          );
        },
        getMinZoom: function () {
          return void 0 === this.options.minZoom
            ? this._layersMinZoom || 0
            : this.options.minZoom;
        },
        getMaxZoom: function () {
          return void 0 === this.options.maxZoom
            ? void 0 === this._layersMaxZoom
              ? 1 / 0
              : this._layersMaxZoom
            : this.options.maxZoom;
        },
        getBoundsZoom: function (t, i, e) {
          (t = D(t)), (e = I(e || [0, 0]));
          var n = this.getZoom() || 0,
            o = this.getMinZoom(),
            s = this.getMaxZoom(),
            r = t.getNorthWest(),
            a = t.getSouthEast(),
            h = this.getSize().subtract(e),
            u = R(this.project(a, n), this.project(r, n)).getSize(),
            l = Ot.any3d ? this.options.zoomSnap : 1,
            c = h.x / u.x,
            _ = h.y / u.y,
            d = i ? Math.max(c, _) : Math.min(c, _);
          return (
            (n = this.getScaleZoom(d, n)),
            l &&
              ((n = Math.round(n / (l / 100)) * (l / 100)),
              (n = i ? Math.ceil(n / l) * l : Math.floor(n / l) * l)),
            Math.max(o, Math.min(s, n))
          );
        },
        getSize: function () {
          return (
            (this._size && !this._sizeChanged) ||
              ((this._size = new B(
                this._container.clientWidth || 0,
                this._container.clientHeight || 0
              )),
              (this._sizeChanged = !1)),
            this._size.clone()
          );
        },
        getPixelBounds: function (t, i) {
          var e = this._getTopLeftPoint(t, i);
          return new O(e, e.add(this.getSize()));
        },
        getPixelOrigin: function () {
          return this._checkIfLoaded(), this._pixelOrigin;
        },
        getPixelWorldBounds: function (t) {
          return this.options.crs.getProjectedBounds(
            void 0 === t ? this.getZoom() : t
          );
        },
        getPane: function (t) {
          return "string" == typeof t ? this._panes[t] : t;
        },
        getPanes: function () {
          return this._panes;
        },
        getContainer: function () {
          return this._container;
        },
        getZoomScale: function (t, i) {
          var e = this.options.crs;
          return (i = void 0 === i ? this._zoom : i), e.scale(t) / e.scale(i);
        },
        getScaleZoom: function (t, i) {
          var e = this.options.crs;
          i = void 0 === i ? this._zoom : i;
          var n = e.zoom(t * e.scale(i));
          return isNaN(n) ? 1 / 0 : n;
        },
        project: function (t, i) {
          return (
            (i = void 0 === i ? this._zoom : i),
            this.options.crs.latLngToPoint(H(t), i)
          );
        },
        unproject: function (t, i) {
          return (
            (i = void 0 === i ? this._zoom : i),
            this.options.crs.pointToLatLng(I(t), i)
          );
        },
        layerPointToLatLng: function (t) {
          var i = I(t).add(this.getPixelOrigin());
          return this.unproject(i);
        },
        latLngToLayerPoint: function (t) {
          return this.project(H(t))._round()._subtract(this.getPixelOrigin());
        },
        wrapLatLng: function (t) {
          return this.options.crs.wrapLatLng(H(t));
        },
        wrapLatLngBounds: function (t) {
          return this.options.crs.wrapLatLngBounds(D(t));
        },
        distance: function (t, i) {
          return this.options.crs.distance(H(t), H(i));
        },
        containerPointToLayerPoint: function (t) {
          return I(t).subtract(this._getMapPanePos());
        },
        layerPointToContainerPoint: function (t) {
          return I(t).add(this._getMapPanePos());
        },
        containerPointToLatLng: function (t) {
          var i = this.containerPointToLayerPoint(I(t));
          return this.layerPointToLatLng(i);
        },
        latLngToContainerPoint: function (t) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(H(t)));
        },
        mouseEventToContainerPoint: function (t) {
          return Yi(t, this._container);
        },
        mouseEventToLayerPoint: function (t) {
          return this.containerPointToLayerPoint(
            this.mouseEventToContainerPoint(t)
          );
        },
        mouseEventToLatLng: function (t) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
        },
        _initContainer: function (t) {
          var i = (this._container = ci(t));
          if (!i) throw new Error("Map container not found.");
          if (i._leaflet_id)
            throw new Error("Map container is already initialized.");
          Ri(i, "scroll", this._onScroll, this), (this._containerId = r(i));
        },
        _initLayout: function () {
          var t = this._container;
          (this._fadeAnimated = this.options.fadeAnimation && Ot.any3d),
            yi(
              t,
              "leaflet-container" +
                (Ot.touch ? " leaflet-touch" : "") +
                (Ot.retina ? " leaflet-retina" : "") +
                (Ot.ielt9 ? " leaflet-oldie" : "") +
                (Ot.safari ? " leaflet-safari" : "") +
                (this._fadeAnimated ? " leaflet-fade-anim" : "")
            );
          var i = _i(t, "position");
          "absolute" !== i &&
            "relative" !== i &&
            "fixed" !== i &&
            (t.style.position = "relative"),
            this._initPanes(),
            this._initControlPos && this._initControlPos();
        },
        _initPanes: function () {
          var t = (this._panes = {});
          (this._paneRenderers = {}),
            (this._mapPane = this.createPane("mapPane", this._container)),
            Mi(this._mapPane, new B(0, 0)),
            this.createPane("tilePane"),
            this.createPane("overlayPane"),
            this.createPane("shadowPane"),
            this.createPane("markerPane"),
            this.createPane("tooltipPane"),
            this.createPane("popupPane"),
            this.options.markerZoomAnimation ||
              (yi(t.markerPane, "leaflet-zoom-hide"),
              yi(t.shadowPane, "leaflet-zoom-hide"));
        },
        _resetView: function (t, i) {
          Mi(this._mapPane, new B(0, 0));
          var e = !this._loaded;
          (this._loaded = !0),
            (i = this._limitZoom(i)),
            this.fire("viewprereset");
          var n = this._zoom !== i;
          this._moveStart(n, !1)._move(t, i)._moveEnd(n),
            this.fire("viewreset"),
            e && this.fire("load");
        },
        _moveStart: function (t, i) {
          return t && this.fire("zoomstart"), i || this.fire("movestart"), this;
        },
        _move: function (t, i, e, n) {
          void 0 === i && (i = this._zoom);
          var o = this._zoom !== i;
          return (
            (this._zoom = i),
            (this._lastCenter = t),
            (this._pixelOrigin = this._getNewPixelOrigin(t)),
            n
              ? e && e.pinch && this.fire("zoom", e)
              : ((o || (e && e.pinch)) && this.fire("zoom", e),
                this.fire("move", e)),
            this
          );
        },
        _moveEnd: function (t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function () {
          return (
            M(this._flyToFrame), this._panAnim && this._panAnim.stop(), this
          );
        },
        _rawPanBy: function (t) {
          Mi(this._mapPane, this._getMapPanePos().subtract(t));
        },
        _getZoomSpan: function () {
          return this.getMaxZoom() - this.getMinZoom();
        },
        _panInsideMaxBounds: function () {
          this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
        },
        _checkIfLoaded: function () {
          if (!this._loaded) throw new Error("Set map center and zoom first.");
        },
        _initEvents: function (t) {
          (this._targets = {}), (this._targets[r(this._container)] = this);
          var i = t ? Di : Ri;
          i(
            this._container,
            "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",
            this._handleDOMEvent,
            this
          ),
            this.options.trackResize &&
              i(window, "resize", this._onResize, this),
            Ot.any3d &&
              this.options.transform3DLimit &&
              (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function () {
          M(this._resizeRequest),
            (this._resizeRequest = z(function () {
              this.invalidateSize({ debounceMoveend: !0 });
            }, this));
        },
        _onScroll: function () {
          (this._container.scrollTop = 0), (this._container.scrollLeft = 0);
        },
        _onMoveEnd: function () {
          var t = this._getMapPanePos();
          Math.max(Math.abs(t.x), Math.abs(t.y)) >=
            this.options.transform3DLimit &&
            this._resetView(this.getCenter(), this.getZoom());
        },
        _findEventTargets: function (t, i) {
          for (
            var e,
              n = [],
              o = "mouseout" === i || "mouseover" === i,
              s = t.target || t.srcElement,
              a = !1;
            s;

          ) {
            if (
              (e = this._targets[r(s)]) &&
              ("click" === i || "preclick" === i) &&
              this._draggableMoved(e)
            ) {
              a = !0;
              break;
            }
            if (e && e.listens(i, !0)) {
              if (o && !$i(s, t)) break;
              if ((n.push(e), o)) break;
            }
            if (s === this._container) break;
            s = s.parentNode;
          }
          return n.length || a || o || !this.listens(i, !0) || (n = [this]), n;
        },
        _isClickDisabled: function (t) {
          for (; t !== this._container; ) {
            if (t._leaflet_disable_click) return !0;
            t = t.parentNode;
          }
        },
        _handleDOMEvent: function (t) {
          var i = t.target || t.srcElement;
          if (
            !(
              !this._loaded ||
              i._leaflet_disable_events ||
              ("click" === t.type && this._isClickDisabled(i))
            )
          ) {
            var e = t.type;
            "mousedown" === e && Ei(i), this._fireDOMEvent(t, e);
          }
        },
        _mouseEvents: [
          "click",
          "dblclick",
          "mouseover",
          "mouseout",
          "contextmenu",
        ],
        _fireDOMEvent: function (t, i, n) {
          if ("click" === t.type) {
            var o = e({}, t);
            (o.type = "preclick"), this._fireDOMEvent(o, o.type, n);
          }
          var s = this._findEventTargets(t, i);
          if (n) {
            for (var r = [], a = 0; a < n.length; a++)
              n[a].listens(i, !0) && r.push(n[a]);
            s = r.concat(s);
          }
          if (s.length) {
            "contextmenu" === i && Gi(t);
            var h = s[0],
              u = { originalEvent: t };
            if (
              "keypress" !== t.type &&
              "keydown" !== t.type &&
              "keyup" !== t.type
            ) {
              var l = h.getLatLng && (!h._radius || h._radius <= 10);
              (u.containerPoint = l
                ? this.latLngToContainerPoint(h.getLatLng())
                : this.mouseEventToContainerPoint(t)),
                (u.layerPoint = this.containerPointToLayerPoint(
                  u.containerPoint
                )),
                (u.latlng = l
                  ? h.getLatLng()
                  : this.layerPointToLatLng(u.layerPoint));
            }
            for (a = 0; a < s.length; a++)
              if (
                (s[a].fire(i, u, !0),
                u.originalEvent._stopped ||
                  (!1 === s[a].options.bubblingMouseEvents &&
                    -1 !== v(this._mouseEvents, i)))
              )
                return;
          }
        },
        _draggableMoved: function (t) {
          return (
            ((t = t.dragging && t.dragging.enabled() ? t : this).dragging &&
              t.dragging.moved()) ||
            (this.boxZoom && this.boxZoom.moved())
          );
        },
        _clearHandlers: function () {
          for (var t = 0, i = this._handlers.length; t < i; t++)
            this._handlers[t].disable();
        },
        whenReady: function (t, i) {
          return (
            this._loaded
              ? t.call(i || this, { target: this })
              : this.on("load", t, i),
            this
          );
        },
        _getMapPanePos: function () {
          return Ci(this._mapPane) || new B(0, 0);
        },
        _moved: function () {
          var t = this._getMapPanePos();
          return t && !t.equals([0, 0]);
        },
        _getTopLeftPoint: function (t, i) {
          return (
            t && void 0 !== i
              ? this._getNewPixelOrigin(t, i)
              : this.getPixelOrigin()
          ).subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function (t, i) {
          var e = this.getSize()._divideBy(2);
          return this.project(t, i)
            ._subtract(e)
            ._add(this._getMapPanePos())
            ._round();
        },
        _latLngToNewLayerPoint: function (t, i, e) {
          var n = this._getNewPixelOrigin(e, i);
          return this.project(t, i)._subtract(n);
        },
        _latLngBoundsToNewLayerBounds: function (t, i, e) {
          var n = this._getNewPixelOrigin(e, i);
          return R([
            this.project(t.getSouthWest(), i)._subtract(n),
            this.project(t.getNorthWest(), i)._subtract(n),
            this.project(t.getSouthEast(), i)._subtract(n),
            this.project(t.getNorthEast(), i)._subtract(n),
          ]);
        },
        _getCenterLayerPoint: function () {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        },
        _getCenterOffset: function (t) {
          return this.latLngToLayerPoint(t).subtract(
            this._getCenterLayerPoint()
          );
        },
        _limitCenter: function (t, i, e) {
          if (!e) return t;
          var n = this.project(t, i),
            o = this.getSize().divideBy(2),
            s = new O(n.subtract(o), n.add(o)),
            r = this._getBoundsOffset(s, e, i);
          return r.round().equals([0, 0]) ? t : this.unproject(n.add(r), i);
        },
        _limitOffset: function (t, i) {
          if (!i) return t;
          var e = this.getPixelBounds(),
            n = new O(e.min.add(t), e.max.add(t));
          return t.add(this._getBoundsOffset(n, i));
        },
        _getBoundsOffset: function (t, i, e) {
          var n = R(
              this.project(i.getNorthEast(), e),
              this.project(i.getSouthWest(), e)
            ),
            o = n.min.subtract(t.min),
            s = n.max.subtract(t.max);
          return new B(this._rebound(o.x, -s.x), this._rebound(o.y, -s.y));
        },
        _rebound: function (t, i) {
          return t + i > 0
            ? Math.round(t - i) / 2
            : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(i));
        },
        _limitZoom: function (t) {
          var i = this.getMinZoom(),
            e = this.getMaxZoom(),
            n = Ot.any3d ? this.options.zoomSnap : 1;
          return n && (t = Math.round(t / n) * n), Math.max(i, Math.min(e, t));
        },
        _onPanTransitionStep: function () {
          this.fire("move");
        },
        _onPanTransitionEnd: function () {
          xi(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function (t, i) {
          var e = this._getCenterOffset(t)._trunc();
          return !(
            (!0 !== (i && i.animate) && !this.getSize().contains(e)) ||
            (this.panBy(e, i), 0)
          );
        },
        _createAnimProxy: function () {
          var t = (this._proxy = di(
            "div",
            "leaflet-proxy leaflet-zoom-animated"
          ));
          this._panes.mapPane.appendChild(t),
            this.on(
              "zoomanim",
              function (t) {
                var i = hi,
                  e = this._proxy.style[i];
                zi(
                  this._proxy,
                  this.project(t.center, t.zoom),
                  this.getZoomScale(t.zoom, 1)
                ),
                  e === this._proxy.style[i] &&
                    this._animatingZoom &&
                    this._onZoomTransitionEnd();
              },
              this
            ),
            this.on("load moveend", this._animMoveEnd, this),
            this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function () {
          pi(this._proxy),
            this.off("load moveend", this._animMoveEnd, this),
            delete this._proxy;
        },
        _animMoveEnd: function () {
          var t = this.getCenter(),
            i = this.getZoom();
          zi(this._proxy, this.project(t, i), this.getZoomScale(i, 1));
        },
        _catchTransitionEnd: function (t) {
          this._animatingZoom &&
            t.propertyName.indexOf("transform") >= 0 &&
            this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function () {
          return !this._container.getElementsByClassName(
            "leaflet-zoom-animated"
          ).length;
        },
        _tryAnimatedZoom: function (t, i, e) {
          if (this._animatingZoom) return !0;
          if (
            ((e = e || {}),
            !this._zoomAnimated ||
              !1 === e.animate ||
              this._nothingToAnimate() ||
              Math.abs(i - this._zoom) > this.options.zoomAnimationThreshold)
          )
            return !1;
          var n = this.getZoomScale(i),
            o = this._getCenterOffset(t)._divideBy(1 - 1 / n);
          return !(
            (!0 !== e.animate && !this.getSize().contains(o)) ||
            (z(function () {
              this._moveStart(!0, !1)._animateZoom(t, i, !0);
            }, this),
            0)
          );
        },
        _animateZoom: function (t, i, e, n) {
          this._mapPane &&
            (e &&
              ((this._animatingZoom = !0),
              (this._animateToCenter = t),
              (this._animateToZoom = i),
              yi(this._mapPane, "leaflet-zoom-anim")),
            this.fire("zoomanim", { center: t, zoom: i, noUpdate: n }),
            this._tempFireZoomEvent ||
              (this._tempFireZoomEvent = this._zoom !== this._animateToZoom),
            this._move(this._animateToCenter, this._animateToZoom, void 0, !0),
            setTimeout(o(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function () {
          this._animatingZoom &&
            (this._mapPane && xi(this._mapPane, "leaflet-zoom-anim"),
            (this._animatingZoom = !1),
            this._move(this._animateToCenter, this._animateToZoom, void 0, !0),
            this._tempFireZoomEvent && this.fire("zoom"),
            delete this._tempFireZoomEvent,
            this.fire("move"),
            this._moveEnd(!0));
        },
      });
    function ee(t, i) {
      return new ie(t, i);
    }
    var ne = Z.extend({
        options: { position: "topright" },
        initialize: function (t) {
          d(this, t);
        },
        getPosition: function () {
          return this.options.position;
        },
        setPosition: function (t) {
          var i = this._map;
          return (
            i && i.removeControl(this),
            (this.options.position = t),
            i && i.addControl(this),
            this
          );
        },
        getContainer: function () {
          return this._container;
        },
        addTo: function (t) {
          this.remove(), (this._map = t);
          var i = (this._container = this.onAdd(t)),
            e = this.getPosition(),
            n = t._controlCorners[e];
          return (
            yi(i, "leaflet-control"),
            -1 !== e.indexOf("bottom")
              ? n.insertBefore(i, n.firstChild)
              : n.appendChild(i),
            this._map.on("unload", this.remove, this),
            this
          );
        },
        remove: function () {
          return this._map
            ? (pi(this._container),
              this.onRemove && this.onRemove(this._map),
              this._map.off("unload", this.remove, this),
              (this._map = null),
              this)
            : this;
        },
        _refocusOnMap: function (t) {
          this._map &&
            t &&
            t.screenX > 0 &&
            t.screenY > 0 &&
            this._map.getContainer().focus();
        },
      }),
      oe = function (t) {
        return new ne(t);
      };
    ie.include({
      addControl: function (t) {
        return t.addTo(this), this;
      },
      removeControl: function (t) {
        return t.remove(), this;
      },
      _initControlPos: function () {
        var t = (this._controlCorners = {}),
          i = "leaflet-",
          e = (this._controlContainer = di(
            "div",
            i + "control-container",
            this._container
          ));
        function n(n, o) {
          var s = i + n + " " + i + o;
          t[n + o] = di("div", s, e);
        }
        n("top", "left"),
          n("top", "right"),
          n("bottom", "left"),
          n("bottom", "right");
      },
      _clearControlPos: function () {
        for (var t in this._controlCorners) pi(this._controlCorners[t]);
        pi(this._controlContainer),
          delete this._controlCorners,
          delete this._controlContainer;
      },
    });
    var se = ne.extend({
        options: {
          collapsed: !0,
          position: "topright",
          autoZIndex: !0,
          hideSingleBase: !1,
          sortLayers: !1,
          sortFunction: function (t, i, e, n) {
            return e < n ? -1 : n < e ? 1 : 0;
          },
        },
        initialize: function (t, i, e) {
          for (var n in (d(this, e),
          (this._layerControlInputs = []),
          (this._layers = []),
          (this._lastZIndex = 0),
          (this._handlingClick = !1),
          t))
            this._addLayer(t[n], n);
          for (n in i) this._addLayer(i[n], n, !0);
        },
        onAdd: function (t) {
          this._initLayout(),
            this._update(),
            (this._map = t),
            t.on("zoomend", this._checkDisabledLayers, this);
          for (var i = 0; i < this._layers.length; i++)
            this._layers[i].layer.on("add remove", this._onLayerChange, this);
          return this._container;
        },
        addTo: function (t) {
          return ne.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
        },
        onRemove: function () {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var t = 0; t < this._layers.length; t++)
            this._layers[t].layer.off("add remove", this._onLayerChange, this);
        },
        addBaseLayer: function (t, i) {
          return this._addLayer(t, i), this._map ? this._update() : this;
        },
        addOverlay: function (t, i) {
          return this._addLayer(t, i, !0), this._map ? this._update() : this;
        },
        removeLayer: function (t) {
          t.off("add remove", this._onLayerChange, this);
          var i = this._getLayer(r(t));
          return (
            i && this._layers.splice(this._layers.indexOf(i), 1),
            this._map ? this._update() : this
          );
        },
        expand: function () {
          yi(this._container, "leaflet-control-layers-expanded"),
            (this._section.style.height = null);
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return (
            t < this._section.clientHeight
              ? (yi(this._section, "leaflet-control-layers-scrollbar"),
                (this._section.style.height = t + "px"))
              : xi(this._section, "leaflet-control-layers-scrollbar"),
            this._checkDisabledLayers(),
            this
          );
        },
        collapse: function () {
          return xi(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function () {
          var t = "leaflet-control-layers",
            i = (this._container = di("div", t)),
            e = this.options.collapsed;
          i.setAttribute("aria-haspopup", !0), qi(i), Vi(i);
          var n = (this._section = di("section", t + "-list"));
          e &&
            (this._map.on("click", this.collapse, this),
            Ri(
              i,
              {
                mouseenter: function () {
                  Ri(n, "click", Gi),
                    this.expand(),
                    setTimeout(function () {
                      Di(n, "click", Gi);
                    });
                },
                mouseleave: this.collapse,
              },
              this
            ));
          var o = (this._layersLink = di("a", t + "-toggle", i));
          (o.href = "#"),
            (o.title = "Layers"),
            o.setAttribute("role", "button"),
            Ri(o, "click", Gi),
            Ri(o, "focus", this.expand, this),
            e || this.expand(),
            (this._baseLayersList = di("div", t + "-base", n)),
            (this._separator = di("div", t + "-separator", n)),
            (this._overlaysList = di("div", t + "-overlays", n)),
            i.appendChild(n);
        },
        _getLayer: function (t) {
          for (var i = 0; i < this._layers.length; i++)
            if (this._layers[i] && r(this._layers[i].layer) === t)
              return this._layers[i];
        },
        _addLayer: function (t, i, e) {
          this._map && t.on("add remove", this._onLayerChange, this),
            this._layers.push({ layer: t, name: i, overlay: e }),
            this.options.sortLayers &&
              this._layers.sort(
                o(function (t, i) {
                  return this.options.sortFunction(
                    t.layer,
                    i.layer,
                    t.name,
                    i.name
                  );
                }, this)
              ),
            this.options.autoZIndex &&
              t.setZIndex &&
              (this._lastZIndex++, t.setZIndex(this._lastZIndex)),
            this._expandIfNotCollapsed();
        },
        _update: function () {
          if (!this._container) return this;
          mi(this._baseLayersList),
            mi(this._overlaysList),
            (this._layerControlInputs = []);
          var t,
            i,
            e,
            n,
            o = 0;
          for (e = 0; e < this._layers.length; e++)
            (n = this._layers[e]),
              this._addItem(n),
              (i = i || n.overlay),
              (t = t || !n.overlay),
              (o += n.overlay ? 0 : 1);
          return (
            this.options.hideSingleBase &&
              ((t = t && o > 1),
              (this._baseLayersList.style.display = t ? "" : "none")),
            (this._separator.style.display = i && t ? "" : "none"),
            this
          );
        },
        _onLayerChange: function (t) {
          this._handlingClick || this._update();
          var i = this._getLayer(r(t.target)),
            e = i.overlay
              ? "add" === t.type
                ? "overlayadd"
                : "overlayremove"
              : "add" === t.type
              ? "baselayerchange"
              : null;
          e && this._map.fire(e, i);
        },
        _createRadioElement: function (t, i) {
          var e =
              '<input type="radio" class="leaflet-control-layers-selector" name="' +
              t +
              '"' +
              (i ? ' checked="checked"' : "") +
              "/>",
            n = document.createElement("div");
          return (n.innerHTML = e), n.firstChild;
        },
        _addItem: function (t) {
          var i,
            e = document.createElement("label"),
            n = this._map.hasLayer(t.layer);
          t.overlay
            ? (((i = document.createElement("input")).type = "checkbox"),
              (i.className = "leaflet-control-layers-selector"),
              (i.defaultChecked = n))
            : (i = this._createRadioElement(
                "leaflet-base-layers_" + r(this),
                n
              )),
            this._layerControlInputs.push(i),
            (i.layerId = r(t.layer)),
            Ri(i, "click", this._onInputClick, this);
          var o = document.createElement("span");
          o.innerHTML = " " + t.name;
          var s = document.createElement("span");
          return (
            e.appendChild(s),
            s.appendChild(i),
            s.appendChild(o),
            (t.overlay ? this._overlaysList : this._baseLayersList).appendChild(
              e
            ),
            this._checkDisabledLayers(),
            e
          );
        },
        _onInputClick: function () {
          var t,
            i,
            e = this._layerControlInputs,
            n = [],
            o = [];
          this._handlingClick = !0;
          for (var s = e.length - 1; s >= 0; s--)
            (t = e[s]),
              (i = this._getLayer(t.layerId).layer),
              t.checked ? n.push(i) : t.checked || o.push(i);
          for (s = 0; s < o.length; s++)
            this._map.hasLayer(o[s]) && this._map.removeLayer(o[s]);
          for (s = 0; s < n.length; s++)
            this._map.hasLayer(n[s]) || this._map.addLayer(n[s]);
          (this._handlingClick = !1), this._refocusOnMap();
        },
        _checkDisabledLayers: function () {
          for (
            var t,
              i,
              e = this._layerControlInputs,
              n = this._map.getZoom(),
              o = e.length - 1;
            o >= 0;
            o--
          )
            (t = e[o]),
              (i = this._getLayer(t.layerId).layer),
              (t.disabled =
                (void 0 !== i.options.minZoom && n < i.options.minZoom) ||
                (void 0 !== i.options.maxZoom && n > i.options.maxZoom));
        },
        _expandIfNotCollapsed: function () {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
      }),
      re = function (t, i, e) {
        return new se(t, i, e);
      },
      ae = ne.extend({
        options: {
          position: "topleft",
          zoomInText: '<span aria-hidden="true">+</span>',
          zoomInTitle: "Zoom in",
          zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
          zoomOutTitle: "Zoom out",
        },
        onAdd: function (t) {
          var i = "leaflet-control-zoom",
            e = di("div", i + " leaflet-bar"),
            n = this.options;
          return (
            (this._zoomInButton = this._createButton(
              n.zoomInText,
              n.zoomInTitle,
              i + "-in",
              e,
              this._zoomIn
            )),
            (this._zoomOutButton = this._createButton(
              n.zoomOutText,
              n.zoomOutTitle,
              i + "-out",
              e,
              this._zoomOut
            )),
            this._updateDisabled(),
            t.on("zoomend zoomlevelschange", this._updateDisabled, this),
            e
          );
        },
        onRemove: function (t) {
          t.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
        disable: function () {
          return (this._disabled = !0), this._updateDisabled(), this;
        },
        enable: function () {
          return (this._disabled = !1), this._updateDisabled(), this;
        },
        _zoomIn: function (t) {
          !this._disabled &&
            this._map._zoom < this._map.getMaxZoom() &&
            this._map.zoomIn(
              this._map.options.zoomDelta * (t.shiftKey ? 3 : 1)
            );
        },
        _zoomOut: function (t) {
          !this._disabled &&
            this._map._zoom > this._map.getMinZoom() &&
            this._map.zoomOut(
              this._map.options.zoomDelta * (t.shiftKey ? 3 : 1)
            );
        },
        _createButton: function (t, i, e, n, o) {
          var s = di("a", e, n);
          return (
            (s.innerHTML = t),
            (s.href = "#"),
            (s.title = i),
            s.setAttribute("role", "button"),
            s.setAttribute("aria-label", i),
            qi(s),
            Ri(s, "click", Ki),
            Ri(s, "click", o, this),
            Ri(s, "click", this._refocusOnMap, this),
            s
          );
        },
        _updateDisabled: function () {
          var t = this._map,
            i = "leaflet-disabled";
          xi(this._zoomInButton, i),
            xi(this._zoomOutButton, i),
            this._zoomInButton.setAttribute("aria-disabled", "false"),
            this._zoomOutButton.setAttribute("aria-disabled", "false"),
            (this._disabled || t._zoom === t.getMinZoom()) &&
              (yi(this._zoomOutButton, i),
              this._zoomOutButton.setAttribute("aria-disabled", "true")),
            (this._disabled || t._zoom === t.getMaxZoom()) &&
              (yi(this._zoomInButton, i),
              this._zoomInButton.setAttribute("aria-disabled", "true"));
        },
      });
    ie.mergeOptions({ zoomControl: !0 }),
      ie.addInitHook(function () {
        this.options.zoomControl &&
          ((this.zoomControl = new ae()), this.addControl(this.zoomControl));
      });
    var he = function (t) {
        return new ae(t);
      },
      ue = ne.extend({
        options: {
          position: "bottomleft",
          maxWidth: 100,
          metric: !0,
          imperial: !0,
        },
        onAdd: function (t) {
          var i = "leaflet-control-scale",
            e = di("div", i),
            n = this.options;
          return (
            this._addScales(n, i + "-line", e),
            t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this),
            t.whenReady(this._update, this),
            e
          );
        },
        onRemove: function (t) {
          t.off(
            this.options.updateWhenIdle ? "moveend" : "move",
            this._update,
            this
          );
        },
        _addScales: function (t, i, e) {
          t.metric && (this._mScale = di("div", i, e)),
            t.imperial && (this._iScale = di("div", i, e));
        },
        _update: function () {
          var t = this._map,
            i = t.getSize().y / 2,
            e = t.distance(
              t.containerPointToLatLng([0, i]),
              t.containerPointToLatLng([this.options.maxWidth, i])
            );
          this._updateScales(e);
        },
        _updateScales: function (t) {
          this.options.metric && t && this._updateMetric(t),
            this.options.imperial && t && this._updateImperial(t);
        },
        _updateMetric: function (t) {
          var i = this._getRoundNum(t),
            e = i < 1e3 ? i + " m" : i / 1e3 + " km";
          this._updateScale(this._mScale, e, i / t);
        },
        _updateImperial: function (t) {
          var i,
            e,
            n,
            o = 3.2808399 * t;
          o > 5280
            ? ((i = o / 5280),
              (e = this._getRoundNum(i)),
              this._updateScale(this._iScale, e + " mi", e / i))
            : ((n = this._getRoundNum(o)),
              this._updateScale(this._iScale, n + " ft", n / o));
        },
        _updateScale: function (t, i, e) {
          (t.style.width = Math.round(this.options.maxWidth * e) + "px"),
            (t.innerHTML = i);
        },
        _getRoundNum: function (t) {
          var i = Math.pow(10, (Math.floor(t) + "").length - 1),
            e = t / i;
          return (
            i * (e = e >= 10 ? 10 : e >= 5 ? 5 : e >= 3 ? 3 : e >= 2 ? 2 : 1)
          );
        },
      }),
      le = function (t) {
        return new ue(t);
      },
      ce =
        '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',
      _e = ne.extend({
        options: {
          position: "bottomright",
          prefix:
            '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' +
            (Ot.inlineSvg ? ce + " " : "") +
            "Leaflet</a>",
        },
        initialize: function (t) {
          d(this, t), (this._attributions = {});
        },
        onAdd: function (t) {
          for (var i in ((t.attributionControl = this),
          (this._container = di("div", "leaflet-control-attribution")),
          qi(this._container),
          t._layers))
            t._layers[i].getAttribution &&
              this.addAttribution(t._layers[i].getAttribution());
          return (
            this._update(),
            t.on("layeradd", this._addAttribution, this),
            this._container
          );
        },
        onRemove: function (t) {
          t.off("layeradd", this._addAttribution, this);
        },
        _addAttribution: function (t) {
          t.layer.getAttribution &&
            (this.addAttribution(t.layer.getAttribution()),
            t.layer.once(
              "remove",
              function () {
                this.removeAttribution(t.layer.getAttribution());
              },
              this
            ));
        },
        setPrefix: function (t) {
          return (this.options.prefix = t), this._update(), this;
        },
        addAttribution: function (t) {
          return t
            ? (this._attributions[t] || (this._attributions[t] = 0),
              this._attributions[t]++,
              this._update(),
              this)
            : this;
        },
        removeAttribution: function (t) {
          return t
            ? (this._attributions[t] &&
                (this._attributions[t]--, this._update()),
              this)
            : this;
        },
        _update: function () {
          if (this._map) {
            var t = [];
            for (var i in this._attributions)
              this._attributions[i] && t.push(i);
            var e = [];
            this.options.prefix && e.push(this.options.prefix),
              t.length && e.push(t.join(", ")),
              (this._container.innerHTML = e.join(
                ' <span aria-hidden="true">|</span> '
              ));
          }
        },
      });
    ie.mergeOptions({ attributionControl: !0 }),
      ie.addInitHook(function () {
        this.options.attributionControl && new _e().addTo(this);
      });
    var de = function (t) {
      return new _e(t);
    };
    (ne.Layers = se),
      (ne.Zoom = ae),
      (ne.Scale = ue),
      (ne.Attribution = _e),
      (oe.layers = re),
      (oe.zoom = he),
      (oe.scale = le),
      (oe.attribution = de);
    var pe = Z.extend({
      initialize: function (t) {
        this._map = t;
      },
      enable: function () {
        return this._enabled || ((this._enabled = !0), this.addHooks()), this;
      },
      disable: function () {
        return this._enabled
          ? ((this._enabled = !1), this.removeHooks(), this)
          : this;
      },
      enabled: function () {
        return !!this._enabled;
      },
    });
    pe.addTo = function (t, i) {
      return t.addHandler(i, this), this;
    };
    var me,
      fe = { Events: k },
      ge = Ot.touch ? "touchstart mousedown" : "mousedown",
      ve = E.extend({
        options: { clickTolerance: 3 },
        initialize: function (t, i, e, n) {
          d(this, n),
            (this._element = t),
            (this._dragStartTarget = i || t),
            (this._preventOutline = e);
        },
        enable: function () {
          this._enabled ||
            (Ri(this._dragStartTarget, ge, this._onDown, this),
            (this._enabled = !0));
        },
        disable: function () {
          this._enabled &&
            (ve._dragging === this && this.finishDrag(!0),
            Di(this._dragStartTarget, ge, this._onDown, this),
            (this._enabled = !1),
            (this._moved = !1));
        },
        _onDown: function (t) {
          if (
            this._enabled &&
            ((this._moved = !1), !vi(this._element, "leaflet-zoom-anim"))
          )
            if (t.touches && 1 !== t.touches.length)
              ve._dragging === this && this.finishDrag();
            else if (
              !(
                ve._dragging ||
                t.shiftKey ||
                (1 !== t.which && 1 !== t.button && !t.touches) ||
                ((ve._dragging = this),
                this._preventOutline && Ei(this._element),
                Si(),
                ni(),
                this._moving)
              )
            ) {
              this.fire("down");
              var i = t.touches ? t.touches[0] : t,
                e = Ai(this._element);
              (this._startPoint = new B(i.clientX, i.clientY)),
                (this._startPos = Ci(this._element)),
                (this._parentScale = Ii(e));
              var n = "mousedown" === t.type;
              Ri(document, n ? "mousemove" : "touchmove", this._onMove, this),
                Ri(
                  document,
                  n ? "mouseup" : "touchend touchcancel",
                  this._onUp,
                  this
                );
            }
        },
        _onMove: function (t) {
          if (this._enabled)
            if (t.touches && t.touches.length > 1) this._moved = !0;
            else {
              var i = t.touches && 1 === t.touches.length ? t.touches[0] : t,
                e = new B(i.clientX, i.clientY)._subtract(this._startPoint);
              (e.x || e.y) &&
                (Math.abs(e.x) + Math.abs(e.y) < this.options.clickTolerance ||
                  ((e.x /= this._parentScale.x),
                  (e.y /= this._parentScale.y),
                  Gi(t),
                  this._moved ||
                    (this.fire("dragstart"),
                    (this._moved = !0),
                    yi(document.body, "leaflet-dragging"),
                    (this._lastTarget = t.target || t.srcElement),
                    window.SVGElementInstance &&
                      this._lastTarget instanceof window.SVGElementInstance &&
                      (this._lastTarget =
                        this._lastTarget.correspondingUseElement),
                    yi(this._lastTarget, "leaflet-drag-target")),
                  (this._newPos = this._startPos.add(e)),
                  (this._moving = !0),
                  (this._lastEvent = t),
                  this._updatePosition()));
            }
        },
        _updatePosition: function () {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t),
            Mi(this._element, this._newPos),
            this.fire("drag", t);
        },
        _onUp: function () {
          this._enabled && this.finishDrag();
        },
        finishDrag: function (t) {
          xi(document.body, "leaflet-dragging"),
            this._lastTarget &&
              (xi(this._lastTarget, "leaflet-drag-target"),
              (this._lastTarget = null)),
            Di(document, "mousemove touchmove", this._onMove, this),
            Di(document, "mouseup touchend touchcancel", this._onUp, this),
            ki(),
            oi(),
            this._moved &&
              this._moving &&
              this.fire("dragend", {
                noInertia: t,
                distance: this._newPos.distanceTo(this._startPos),
              }),
            (this._moving = !1),
            (ve._dragging = !1);
        },
      });
    function ye(t, i) {
      if (!i || !t.length) return t.slice();
      var e = i * i;
      return (t = Pe((t = Le(t, e)), e));
    }
    function xe(t, i, e) {
      return Math.sqrt(Ze(t, i, e, !0));
    }
    function we(t, i, e) {
      return Ze(t, i, e);
    }
    function Pe(t, i) {
      var e = t.length,
        n = new (typeof Uint8Array != void 0 + "" ? Uint8Array : Array)(e);
      (n[0] = n[e - 1] = 1), be(t, n, i, 0, e - 1);
      var o,
        s = [];
      for (o = 0; o < e; o++) n[o] && s.push(t[o]);
      return s;
    }
    function be(t, i, e, n, o) {
      var s,
        r,
        a,
        h = 0;
      for (r = n + 1; r <= o - 1; r++)
        (a = Ze(t[r], t[n], t[o], !0)) > h && ((s = r), (h = a));
      h > e && ((i[s] = 1), be(t, i, e, n, s), be(t, i, e, s, o));
    }
    function Le(t, i) {
      for (var e = [t[0]], n = 1, o = 0, s = t.length; n < s; n++)
        Ce(t[n], t[o]) > i && (e.push(t[n]), (o = n));
      return o < s - 1 && e.push(t[s - 1]), e;
    }
    function Te(t, i, e, n, o) {
      var s,
        r,
        a,
        h = n ? me : Me(t, e),
        u = Me(i, e);
      for (me = u; ; ) {
        if (!(h | u)) return [t, i];
        if (h & u) return !1;
        (a = Me((r = ze(t, i, (s = h || u), e, o)), e)),
          s === h ? ((t = r), (h = a)) : ((i = r), (u = a));
      }
    }
    function ze(t, i, e, n, o) {
      var s,
        r,
        a = i.x - t.x,
        h = i.y - t.y,
        u = n.min,
        l = n.max;
      return (
        8 & e
          ? ((s = t.x + (a * (l.y - t.y)) / h), (r = l.y))
          : 4 & e
          ? ((s = t.x + (a * (u.y - t.y)) / h), (r = u.y))
          : 2 & e
          ? ((s = l.x), (r = t.y + (h * (l.x - t.x)) / a))
          : 1 & e && ((s = u.x), (r = t.y + (h * (u.x - t.x)) / a)),
        new B(s, r, o)
      );
    }
    function Me(t, i) {
      var e = 0;
      return (
        t.x < i.min.x ? (e |= 1) : t.x > i.max.x && (e |= 2),
        t.y < i.min.y ? (e |= 4) : t.y > i.max.y && (e |= 8),
        e
      );
    }
    function Ce(t, i) {
      var e = i.x - t.x,
        n = i.y - t.y;
      return e * e + n * n;
    }
    function Ze(t, i, e, n) {
      var o,
        s = i.x,
        r = i.y,
        a = e.x - s,
        h = e.y - r,
        u = a * a + h * h;
      return (
        u > 0 &&
          ((o = ((t.x - s) * a + (t.y - r) * h) / u) > 1
            ? ((s = e.x), (r = e.y))
            : o > 0 && ((s += a * o), (r += h * o))),
        (a = t.x - s),
        (h = t.y - r),
        n ? a * a + h * h : new B(s, r)
      );
    }
    function Se(t) {
      return !g(t[0]) || ("object" != typeof t[0][0] && void 0 !== t[0][0]);
    }
    function ke(t) {
      return (
        console.warn(
          "Deprecated use of _flat, please use L.LineUtil.isFlat instead."
        ),
        Se(t)
      );
    }
    var Ee = {
      __proto__: null,
      simplify: ye,
      pointToSegmentDistance: xe,
      closestPointOnSegment: we,
      clipSegment: Te,
      _getEdgeIntersection: ze,
      _getBitCode: Me,
      _sqClosestPointOnSegment: Ze,
      isFlat: Se,
      _flat: ke,
    };
    function Be(t, i, e) {
      var n,
        o,
        s,
        r,
        a,
        h,
        u,
        l,
        c,
        _ = [1, 4, 2, 8];
      for (o = 0, u = t.length; o < u; o++) t[o]._code = Me(t[o], i);
      for (r = 0; r < 4; r++) {
        for (l = _[r], n = [], o = 0, s = (u = t.length) - 1; o < u; s = o++)
          (a = t[o]),
            (h = t[s]),
            a._code & l
              ? h._code & l ||
                (((c = ze(h, a, l, i, e))._code = Me(c, i)), n.push(c))
              : (h._code & l &&
                  (((c = ze(h, a, l, i, e))._code = Me(c, i)), n.push(c)),
                n.push(a));
        t = n;
      }
      return t;
    }
    var Ae = { __proto__: null, clipPolygon: Be },
      Ie = {
        project: function (t) {
          return new B(t.lng, t.lat);
        },
        unproject: function (t) {
          return new j(t.y, t.x);
        },
        bounds: new O([-180, -90], [180, 90]),
      },
      Oe = {
        R: 6378137,
        R_MINOR: 6356752.314245179,
        bounds: new O(
          [-20037508.34279, -15496570.73972],
          [20037508.34279, 18764656.23138]
        ),
        project: function (t) {
          var i = Math.PI / 180,
            e = this.R,
            n = t.lat * i,
            o = this.R_MINOR / e,
            s = Math.sqrt(1 - o * o),
            r = s * Math.sin(n),
            a =
              Math.tan(Math.PI / 4 - n / 2) /
              Math.pow((1 - r) / (1 + r), s / 2);
          return (
            (n = -e * Math.log(Math.max(a, 1e-10))), new B(t.lng * i * e, n)
          );
        },
        unproject: function (t) {
          for (
            var i,
              e = 180 / Math.PI,
              n = this.R,
              o = this.R_MINOR / n,
              s = Math.sqrt(1 - o * o),
              r = Math.exp(-t.y / n),
              a = Math.PI / 2 - 2 * Math.atan(r),
              h = 0,
              u = 0.1;
            h < 15 && Math.abs(u) > 1e-7;
            h++
          )
            (i = s * Math.sin(a)),
              (i = Math.pow((1 - i) / (1 + i), s / 2)),
              (a += u = Math.PI / 2 - 2 * Math.atan(r * i) - a);
          return new j(a * e, (t.x * e) / n);
        },
      },
      Re = { __proto__: null, LonLat: Ie, Mercator: Oe, SphericalMercator: q },
      Ne = e({}, U, {
        code: "EPSG:3395",
        projection: Oe,
        transformation: (function () {
          var t = 0.5 / (Math.PI * Oe.R);
          return K(t, 0.5, -t, 0.5);
        })(),
      }),
      De = e({}, U, {
        code: "EPSG:4326",
        projection: Ie,
        transformation: K(1 / 180, 1, -1 / 180, 0.5),
      }),
      je = e({}, F, {
        projection: Ie,
        transformation: K(1, 0, -1, 0),
        scale: function (t) {
          return Math.pow(2, t);
        },
        zoom: function (t) {
          return Math.log(t) / Math.LN2;
        },
        distance: function (t, i) {
          var e = i.lng - t.lng,
            n = i.lat - t.lat;
          return Math.sqrt(e * e + n * n);
        },
        infinite: !0,
      });
    (F.Earth = U),
      (F.EPSG3395 = Ne),
      (F.EPSG3857 = Y),
      (F.EPSG900913 = X),
      (F.EPSG4326 = De),
      (F.Simple = je);
    var He = E.extend({
      options: {
        pane: "overlayPane",
        attribution: null,
        bubblingMouseEvents: !0,
      },
      addTo: function (t) {
        return t.addLayer(this), this;
      },
      remove: function () {
        return this.removeFrom(this._map || this._mapToAdd);
      },
      removeFrom: function (t) {
        return t && t.removeLayer(this), this;
      },
      getPane: function (t) {
        return this._map.getPane(t ? this.options[t] || t : this.options.pane);
      },
      addInteractiveTarget: function (t) {
        return (this._map._targets[r(t)] = this), this;
      },
      removeInteractiveTarget: function (t) {
        return delete this._map._targets[r(t)], this;
      },
      getAttribution: function () {
        return this.options.attribution;
      },
      _layerAdd: function (t) {
        var i = t.target;
        if (i.hasLayer(this)) {
          if (
            ((this._map = i),
            (this._zoomAnimated = i._zoomAnimated),
            this.getEvents)
          ) {
            var e = this.getEvents();
            i.on(e, this),
              this.once(
                "remove",
                function () {
                  i.off(e, this);
                },
                this
              );
          }
          this.onAdd(i), this.fire("add"), i.fire("layeradd", { layer: this });
        }
      },
    });
    ie.include({
      addLayer: function (t) {
        if (!t._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var i = r(t);
        return (
          this._layers[i] ||
            ((this._layers[i] = t),
            (t._mapToAdd = this),
            t.beforeAdd && t.beforeAdd(this),
            this.whenReady(t._layerAdd, t)),
          this
        );
      },
      removeLayer: function (t) {
        var i = r(t);
        return this._layers[i]
          ? (this._loaded && t.onRemove(this),
            delete this._layers[i],
            this._loaded &&
              (this.fire("layerremove", { layer: t }), t.fire("remove")),
            (t._map = t._mapToAdd = null),
            this)
          : this;
      },
      hasLayer: function (t) {
        return r(t) in this._layers;
      },
      eachLayer: function (t, i) {
        for (var e in this._layers) t.call(i, this._layers[e]);
        return this;
      },
      _addLayers: function (t) {
        for (var i = 0, e = (t = t ? (g(t) ? t : [t]) : []).length; i < e; i++)
          this.addLayer(t[i]);
      },
      _addZoomLimit: function (t) {
        (isNaN(t.options.maxZoom) && isNaN(t.options.minZoom)) ||
          ((this._zoomBoundLayers[r(t)] = t), this._updateZoomLevels());
      },
      _removeZoomLimit: function (t) {
        var i = r(t);
        this._zoomBoundLayers[i] &&
          (delete this._zoomBoundLayers[i], this._updateZoomLevels());
      },
      _updateZoomLevels: function () {
        var t = 1 / 0,
          i = -1 / 0,
          e = this._getZoomSpan();
        for (var n in this._zoomBoundLayers) {
          var o = this._zoomBoundLayers[n].options;
          (t = void 0 === o.minZoom ? t : Math.min(t, o.minZoom)),
            (i = void 0 === o.maxZoom ? i : Math.max(i, o.maxZoom));
        }
        (this._layersMaxZoom = i === -1 / 0 ? void 0 : i),
          (this._layersMinZoom = t === 1 / 0 ? void 0 : t),
          e !== this._getZoomSpan() && this.fire("zoomlevelschange"),
          void 0 === this.options.maxZoom &&
            this._layersMaxZoom &&
            this.getZoom() > this._layersMaxZoom &&
            this.setZoom(this._layersMaxZoom),
          void 0 === this.options.minZoom &&
            this._layersMinZoom &&
            this.getZoom() < this._layersMinZoom &&
            this.setZoom(this._layersMinZoom);
      },
    });
    var We = He.extend({
        initialize: function (t, i) {
          var e, n;
          if ((d(this, i), (this._layers = {}), t))
            for (e = 0, n = t.length; e < n; e++) this.addLayer(t[e]);
        },
        addLayer: function (t) {
          var i = this.getLayerId(t);
          return (
            (this._layers[i] = t), this._map && this._map.addLayer(t), this
          );
        },
        removeLayer: function (t) {
          var i = t in this._layers ? t : this.getLayerId(t);
          return (
            this._map &&
              this._layers[i] &&
              this._map.removeLayer(this._layers[i]),
            delete this._layers[i],
            this
          );
        },
        hasLayer: function (t) {
          return (
            ("number" == typeof t ? t : this.getLayerId(t)) in this._layers
          );
        },
        clearLayers: function () {
          return this.eachLayer(this.removeLayer, this);
        },
        invoke: function (t) {
          var i,
            e,
            n = Array.prototype.slice.call(arguments, 1);
          for (i in this._layers) (e = this._layers[i])[t] && e[t].apply(e, n);
          return this;
        },
        onAdd: function (t) {
          this.eachLayer(t.addLayer, t);
        },
        onRemove: function (t) {
          this.eachLayer(t.removeLayer, t);
        },
        eachLayer: function (t, i) {
          for (var e in this._layers) t.call(i, this._layers[e]);
          return this;
        },
        getLayer: function (t) {
          return this._layers[t];
        },
        getLayers: function () {
          var t = [];
          return this.eachLayer(t.push, t), t;
        },
        setZIndex: function (t) {
          return this.invoke("setZIndex", t);
        },
        getLayerId: function (t) {
          return r(t);
        },
      }),
      Fe = function (t, i) {
        return new We(t, i);
      },
      Ue = We.extend({
        addLayer: function (t) {
          return this.hasLayer(t)
            ? this
            : (t.addEventParent(this),
              We.prototype.addLayer.call(this, t),
              this.fire("layeradd", { layer: t }));
        },
        removeLayer: function (t) {
          return this.hasLayer(t)
            ? (t in this._layers && (t = this._layers[t]),
              t.removeEventParent(this),
              We.prototype.removeLayer.call(this, t),
              this.fire("layerremove", { layer: t }))
            : this;
        },
        setStyle: function (t) {
          return this.invoke("setStyle", t);
        },
        bringToFront: function () {
          return this.invoke("bringToFront");
        },
        bringToBack: function () {
          return this.invoke("bringToBack");
        },
        getBounds: function () {
          var t = new N();
          for (var i in this._layers) {
            var e = this._layers[i];
            t.extend(e.getBounds ? e.getBounds() : e.getLatLng());
          }
          return t;
        },
      }),
      Ve = function (t, i) {
        return new Ue(t, i);
      },
      qe = Z.extend({
        options: {
          popupAnchor: [0, 0],
          tooltipAnchor: [0, 0],
          crossOrigin: !1,
        },
        initialize: function (t) {
          d(this, t);
        },
        createIcon: function (t) {
          return this._createIcon("icon", t);
        },
        createShadow: function (t) {
          return this._createIcon("shadow", t);
        },
        _createIcon: function (t, i) {
          var e = this._getIconUrl(t);
          if (!e) {
            if ("icon" === t)
              throw new Error(
                "iconUrl not set in Icon options (see the docs)."
              );
            return null;
          }
          var n = this._createImg(e, i && "IMG" === i.tagName ? i : null);
          return (
            this._setIconStyles(n, t),
            (this.options.crossOrigin || "" === this.options.crossOrigin) &&
              (n.crossOrigin =
                !0 === this.options.crossOrigin
                  ? ""
                  : this.options.crossOrigin),
            n
          );
        },
        _setIconStyles: function (t, i) {
          var e = this.options,
            n = e[i + "Size"];
          "number" == typeof n && (n = [n, n]);
          var o = I(n),
            s = I(
              ("shadow" === i && e.shadowAnchor) ||
                e.iconAnchor ||
                (o && o.divideBy(2, !0))
            );
          (t.className = "leaflet-marker-" + i + " " + (e.className || "")),
            s &&
              ((t.style.marginLeft = -s.x + "px"),
              (t.style.marginTop = -s.y + "px")),
            o && ((t.style.width = o.x + "px"), (t.style.height = o.y + "px"));
        },
        _createImg: function (t, i) {
          return ((i = i || document.createElement("img")).src = t), i;
        },
        _getIconUrl: function (t) {
          return (
            (Ot.retina && this.options[t + "RetinaUrl"]) ||
            this.options[t + "Url"]
          );
        },
      });
    function Ge(t) {
      return new qe(t);
    }
    var Ke = qe.extend({
        options: {
          iconUrl: "marker-icon.png",
          iconRetinaUrl: "marker-icon-2x.png",
          shadowUrl: "marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        },
        _getIconUrl: function (t) {
          return (
            "string" != typeof Ke.imagePath &&
              (Ke.imagePath = this._detectIconPath()),
            (this.options.imagePath || Ke.imagePath) +
              qe.prototype._getIconUrl.call(this, t)
          );
        },
        _stripUrl: function (t) {
          var i = function (t, i, e) {
            var n = i.exec(t);
            return n && n[e];
          };
          return (
            (t = i(t, /^url\((['"])?(.+)\1\)$/, 2)) &&
            i(t, /^(.*)marker-icon\.png$/, 1)
          );
        },
        _detectIconPath: function () {
          var t = di("div", "leaflet-default-icon-path", document.body),
            i = _i(t, "background-image") || _i(t, "backgroundImage");
          if ((document.body.removeChild(t), (i = this._stripUrl(i)))) return i;
          var e = document.querySelector('link[href$="leaflet.css"]');
          return e
            ? e.href.substring(0, e.href.length - "leaflet.css".length - 1)
            : "";
        },
      }),
      Ye = pe.extend({
        initialize: function (t) {
          this._marker = t;
        },
        addHooks: function () {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new ve(t, t, !0)),
            this._draggable
              .on(
                {
                  dragstart: this._onDragStart,
                  predrag: this._onPreDrag,
                  drag: this._onDrag,
                  dragend: this._onDragEnd,
                },
                this
              )
              .enable(),
            yi(t, "leaflet-marker-draggable");
        },
        removeHooks: function () {
          this._draggable
            .off(
              {
                dragstart: this._onDragStart,
                predrag: this._onPreDrag,
                drag: this._onDrag,
                dragend: this._onDragEnd,
              },
              this
            )
            .disable(),
            this._marker._icon &&
              xi(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function () {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function (t) {
          var i = this._marker,
            e = i._map,
            n = this._marker.options.autoPanSpeed,
            o = this._marker.options.autoPanPadding,
            s = Ci(i._icon),
            r = e.getPixelBounds(),
            a = e.getPixelOrigin(),
            h = R(r.min._subtract(a).add(o), r.max._subtract(a).subtract(o));
          if (!h.contains(s)) {
            var u = I(
              (Math.max(h.max.x, s.x) - h.max.x) / (r.max.x - h.max.x) -
                (Math.min(h.min.x, s.x) - h.min.x) / (r.min.x - h.min.x),
              (Math.max(h.max.y, s.y) - h.max.y) / (r.max.y - h.max.y) -
                (Math.min(h.min.y, s.y) - h.min.y) / (r.min.y - h.min.y)
            ).multiplyBy(n);
            e.panBy(u, { animate: !1 }),
              this._draggable._newPos._add(u),
              this._draggable._startPos._add(u),
              Mi(i._icon, this._draggable._newPos),
              this._onDrag(t),
              (this._panRequest = z(this._adjustPan.bind(this, t)));
          }
        },
        _onDragStart: function () {
          (this._oldLatLng = this._marker.getLatLng()),
            this._marker.closePopup && this._marker.closePopup(),
            this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function (t) {
          this._marker.options.autoPan &&
            (M(this._panRequest),
            (this._panRequest = z(this._adjustPan.bind(this, t))));
        },
        _onDrag: function (t) {
          var i = this._marker,
            e = i._shadow,
            n = Ci(i._icon),
            o = i._map.layerPointToLatLng(n);
          e && Mi(e, n),
            (i._latlng = o),
            (t.latlng = o),
            (t.oldLatLng = this._oldLatLng),
            i.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function (t) {
          M(this._panRequest),
            delete this._oldLatLng,
            this._marker.fire("moveend").fire("dragend", t);
        },
      }),
      Xe = He.extend({
        options: {
          icon: new Ke(),
          interactive: !0,
          keyboard: !0,
          title: "",
          alt: "Marker",
          zIndexOffset: 0,
          opacity: 1,
          riseOnHover: !1,
          riseOffset: 250,
          pane: "markerPane",
          shadowPane: "shadowPane",
          bubblingMouseEvents: !1,
          autoPanOnFocus: !0,
          draggable: !1,
          autoPan: !1,
          autoPanPadding: [50, 50],
          autoPanSpeed: 10,
        },
        initialize: function (t, i) {
          d(this, i), (this._latlng = H(t));
        },
        onAdd: function (t) {
          (this._zoomAnimated =
            this._zoomAnimated && t.options.markerZoomAnimation),
            this._zoomAnimated && t.on("zoomanim", this._animateZoom, this),
            this._initIcon(),
            this.update();
        },
        onRemove: function (t) {
          this.dragging &&
            this.dragging.enabled() &&
            ((this.options.draggable = !0), this.dragging.removeHooks()),
            delete this.dragging,
            this._zoomAnimated && t.off("zoomanim", this._animateZoom, this),
            this._removeIcon(),
            this._removeShadow();
        },
        getEvents: function () {
          return { zoom: this.update, viewreset: this.update };
        },
        getLatLng: function () {
          return this._latlng;
        },
        setLatLng: function (t) {
          var i = this._latlng;
          return (
            (this._latlng = H(t)),
            this.update(),
            this.fire("move", { oldLatLng: i, latlng: this._latlng })
          );
        },
        setZIndexOffset: function (t) {
          return (this.options.zIndexOffset = t), this.update();
        },
        getIcon: function () {
          return this.options.icon;
        },
        setIcon: function (t) {
          return (
            (this.options.icon = t),
            this._map && (this._initIcon(), this.update()),
            this._popup && this.bindPopup(this._popup, this._popup.options),
            this
          );
        },
        getElement: function () {
          return this._icon;
        },
        update: function () {
          if (this._icon && this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(t);
          }
          return this;
        },
        _initIcon: function () {
          var t = this.options,
            i = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
            e = t.icon.createIcon(this._icon),
            n = !1;
          e !== this._icon &&
            (this._icon && this._removeIcon(),
            (n = !0),
            t.title && (e.title = t.title),
            "IMG" === e.tagName && (e.alt = t.alt || "")),
            yi(e, i),
            t.keyboard &&
              ((e.tabIndex = "0"), e.setAttribute("role", "button")),
            (this._icon = e),
            t.riseOnHover &&
              this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex,
              }),
            this.options.autoPanOnFocus &&
              Ri(e, "focus", this._panOnFocus, this);
          var o = t.icon.createShadow(this._shadow),
            s = !1;
          o !== this._shadow && (this._removeShadow(), (s = !0)),
            o && (yi(o, i), (o.alt = "")),
            (this._shadow = o),
            t.opacity < 1 && this._updateOpacity(),
            n && this.getPane().appendChild(this._icon),
            this._initInteraction(),
            o && s && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function () {
          this.options.riseOnHover &&
            this.off({
              mouseover: this._bringToFront,
              mouseout: this._resetZIndex,
            }),
            this.options.autoPanOnFocus &&
              Di(this._icon, "focus", this._panOnFocus, this),
            pi(this._icon),
            this.removeInteractiveTarget(this._icon),
            (this._icon = null);
        },
        _removeShadow: function () {
          this._shadow && pi(this._shadow), (this._shadow = null);
        },
        _setPos: function (t) {
          this._icon && Mi(this._icon, t),
            this._shadow && Mi(this._shadow, t),
            (this._zIndex = t.y + this.options.zIndexOffset),
            this._resetZIndex();
        },
        _updateZIndex: function (t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function (t) {
          var i = this._map
            ._latLngToNewLayerPoint(this._latlng, t.zoom, t.center)
            .round();
          this._setPos(i);
        },
        _initInteraction: function () {
          if (
            this.options.interactive &&
            (yi(this._icon, "leaflet-interactive"),
            this.addInteractiveTarget(this._icon),
            Ye)
          ) {
            var t = this.options.draggable;
            this.dragging &&
              ((t = this.dragging.enabled()), this.dragging.disable()),
              (this.dragging = new Ye(this)),
              t && this.dragging.enable();
          }
        },
        setOpacity: function (t) {
          return (
            (this.options.opacity = t), this._map && this._updateOpacity(), this
          );
        },
        _updateOpacity: function () {
          var t = this.options.opacity;
          this._icon && bi(this._icon, t), this._shadow && bi(this._shadow, t);
        },
        _bringToFront: function () {
          this._updateZIndex(this.options.riseOffset);
        },
        _resetZIndex: function () {
          this._updateZIndex(0);
        },
        _panOnFocus: function () {
          var t = this._map;
          if (t) {
            var i = this.options.icon.options,
              e = i.iconSize ? I(i.iconSize) : I(0, 0),
              n = i.iconAnchor ? I(i.iconAnchor) : I(0, 0);
            t.panInside(this._latlng, {
              paddingTopLeft: n,
              paddingBottomRight: e.subtract(n),
            });
          }
        },
        _getPopupAnchor: function () {
          return this.options.icon.options.popupAnchor;
        },
        _getTooltipAnchor: function () {
          return this.options.icon.options.tooltipAnchor;
        },
      });
    function Je(t, i) {
      return new Xe(t, i);
    }
    var $e = He.extend({
        options: {
          stroke: !0,
          color: "#3388ff",
          weight: 3,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          dashArray: null,
          dashOffset: null,
          fill: !1,
          fillColor: null,
          fillOpacity: 0.2,
          fillRule: "evenodd",
          interactive: !0,
          bubblingMouseEvents: !0,
        },
        beforeAdd: function (t) {
          this._renderer = t.getRenderer(this);
        },
        onAdd: function () {
          this._renderer._initPath(this),
            this._reset(),
            this._renderer._addPath(this);
        },
        onRemove: function () {
          this._renderer._removePath(this);
        },
        redraw: function () {
          return this._map && this._renderer._updatePath(this), this;
        },
        setStyle: function (t) {
          return (
            d(this, t),
            this._renderer &&
              (this._renderer._updateStyle(this),
              this.options.stroke &&
                t &&
                Object.prototype.hasOwnProperty.call(t, "weight") &&
                this._updateBounds()),
            this
          );
        },
        bringToFront: function () {
          return this._renderer && this._renderer._bringToFront(this), this;
        },
        bringToBack: function () {
          return this._renderer && this._renderer._bringToBack(this), this;
        },
        getElement: function () {
          return this._path;
        },
        _reset: function () {
          this._project(), this._update();
        },
        _clickTolerance: function () {
          return (
            (this.options.stroke ? this.options.weight / 2 : 0) +
            (this._renderer.options.tolerance || 0)
          );
        },
      }),
      Qe = $e.extend({
        options: { fill: !0, radius: 10 },
        initialize: function (t, i) {
          d(this, i),
            (this._latlng = H(t)),
            (this._radius = this.options.radius);
        },
        setLatLng: function (t) {
          var i = this._latlng;
          return (
            (this._latlng = H(t)),
            this.redraw(),
            this.fire("move", { oldLatLng: i, latlng: this._latlng })
          );
        },
        getLatLng: function () {
          return this._latlng;
        },
        setRadius: function (t) {
          return (this.options.radius = this._radius = t), this.redraw();
        },
        getRadius: function () {
          return this._radius;
        },
        setStyle: function (t) {
          var i = (t && t.radius) || this._radius;
          return $e.prototype.setStyle.call(this, t), this.setRadius(i), this;
        },
        _project: function () {
          (this._point = this._map.latLngToLayerPoint(this._latlng)),
            this._updateBounds();
        },
        _updateBounds: function () {
          var t = this._radius,
            i = this._radiusY || t,
            e = this._clickTolerance(),
            n = [t + e, i + e];
          this._pxBounds = new O(this._point.subtract(n), this._point.add(n));
        },
        _update: function () {
          this._map && this._updatePath();
        },
        _updatePath: function () {
          this._renderer._updateCircle(this);
        },
        _empty: function () {
          return (
            this._radius && !this._renderer._bounds.intersects(this._pxBounds)
          );
        },
        _containsPoint: function (t) {
          return (
            t.distanceTo(this._point) <= this._radius + this._clickTolerance()
          );
        },
      });
    function tn(t, i) {
      return new Qe(t, i);
    }
    var en = Qe.extend({
      initialize: function (t, i, n) {
        if (
          ("number" == typeof i && (i = e({}, n, { radius: i })),
          d(this, i),
          (this._latlng = H(t)),
          isNaN(this.options.radius))
        )
          throw new Error("Circle radius cannot be NaN");
        this._mRadius = this.options.radius;
      },
      setRadius: function (t) {
        return (this._mRadius = t), this.redraw();
      },
      getRadius: function () {
        return this._mRadius;
      },
      getBounds: function () {
        var t = [this._radius, this._radiusY || this._radius];
        return new N(
          this._map.layerPointToLatLng(this._point.subtract(t)),
          this._map.layerPointToLatLng(this._point.add(t))
        );
      },
      setStyle: $e.prototype.setStyle,
      _project: function () {
        var t = this._latlng.lng,
          i = this._latlng.lat,
          e = this._map,
          n = e.options.crs;
        if (n.distance === U.distance) {
          var o = Math.PI / 180,
            s = this._mRadius / U.R / o,
            r = e.project([i + s, t]),
            a = e.project([i - s, t]),
            h = r.add(a).divideBy(2),
            u = e.unproject(h).lat,
            l =
              Math.acos(
                (Math.cos(s * o) - Math.sin(i * o) * Math.sin(u * o)) /
                  (Math.cos(i * o) * Math.cos(u * o))
              ) / o;
          (isNaN(l) || 0 === l) && (l = s / Math.cos((Math.PI / 180) * i)),
            (this._point = h.subtract(e.getPixelOrigin())),
            (this._radius = isNaN(l) ? 0 : h.x - e.project([u, t - l]).x),
            (this._radiusY = h.y - r.y);
        } else {
          var c = n.unproject(
            n.project(this._latlng).subtract([this._mRadius, 0])
          );
          (this._point = e.latLngToLayerPoint(this._latlng)),
            (this._radius = this._point.x - e.latLngToLayerPoint(c).x);
        }
        this._updateBounds();
      },
    });
    function nn(t, i, e) {
      return new en(t, i, e);
    }
    var on = $e.extend({
      options: { smoothFactor: 1, noClip: !1 },
      initialize: function (t, i) {
        d(this, i), this._setLatLngs(t);
      },
      getLatLngs: function () {
        return this._latlngs;
      },
      setLatLngs: function (t) {
        return this._setLatLngs(t), this.redraw();
      },
      isEmpty: function () {
        return !this._latlngs.length;
      },
      closestLayerPoint: function (t) {
        for (
          var i, e, n = 1 / 0, o = null, s = Ze, r = 0, a = this._parts.length;
          r < a;
          r++
        )
          for (var h = this._parts[r], u = 1, l = h.length; u < l; u++) {
            var c = s(t, (i = h[u - 1]), (e = h[u]), !0);
            c < n && ((n = c), (o = s(t, i, e)));
          }
        return o && (o.distance = Math.sqrt(n)), o;
      },
      getCenter: function () {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a = this._rings[0],
          h = a.length;
        if (!h) return null;
        for (t = 0, i = 0; t < h - 1; t++) i += a[t].distanceTo(a[t + 1]) / 2;
        if (0 === i) return this._map.layerPointToLatLng(a[0]);
        for (t = 0, n = 0; t < h - 1; t++)
          if (((o = a[t]), (s = a[t + 1]), (n += e = o.distanceTo(s)) > i))
            return (
              (r = (n - i) / e),
              this._map.layerPointToLatLng([
                s.x - r * (s.x - o.x),
                s.y - r * (s.y - o.y),
              ])
            );
      },
      getBounds: function () {
        return this._bounds;
      },
      addLatLng: function (t, i) {
        return (
          (i = i || this._defaultShape()),
          (t = H(t)),
          i.push(t),
          this._bounds.extend(t),
          this.redraw()
        );
      },
      _setLatLngs: function (t) {
        (this._bounds = new N()), (this._latlngs = this._convertLatLngs(t));
      },
      _defaultShape: function () {
        return Se(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      _convertLatLngs: function (t) {
        for (var i = [], e = Se(t), n = 0, o = t.length; n < o; n++)
          e
            ? ((i[n] = H(t[n])), this._bounds.extend(i[n]))
            : (i[n] = this._convertLatLngs(t[n]));
        return i;
      },
      _project: function () {
        var t = new O();
        (this._rings = []),
          this._projectLatlngs(this._latlngs, this._rings, t),
          this._bounds.isValid() &&
            t.isValid() &&
            ((this._rawPxBounds = t), this._updateBounds());
      },
      _updateBounds: function () {
        var t = this._clickTolerance(),
          i = new B(t, t);
        this._rawPxBounds &&
          (this._pxBounds = new O([
            this._rawPxBounds.min.subtract(i),
            this._rawPxBounds.max.add(i),
          ]));
      },
      _projectLatlngs: function (t, i, e) {
        var n,
          o,
          s = t[0] instanceof j,
          r = t.length;
        if (s) {
          for (o = [], n = 0; n < r; n++)
            (o[n] = this._map.latLngToLayerPoint(t[n])), e.extend(o[n]);
          i.push(o);
        } else for (n = 0; n < r; n++) this._projectLatlngs(t[n], i, e);
      },
      _clipPoints: function () {
        var t = this._renderer._bounds;
        if (
          ((this._parts = []), this._pxBounds && this._pxBounds.intersects(t))
        )
          if (this.options.noClip) this._parts = this._rings;
          else {
            var i,
              e,
              n,
              o,
              s,
              r,
              a,
              h = this._parts;
            for (i = 0, n = 0, o = this._rings.length; i < o; i++)
              for (e = 0, s = (a = this._rings[i]).length; e < s - 1; e++)
                (r = Te(a[e], a[e + 1], t, e, !0)) &&
                  ((h[n] = h[n] || []),
                  h[n].push(r[0]),
                  (r[1] === a[e + 1] && e !== s - 2) || (h[n].push(r[1]), n++));
          }
      },
      _simplifyPoints: function () {
        for (
          var t = this._parts,
            i = this.options.smoothFactor,
            e = 0,
            n = t.length;
          e < n;
          e++
        )
          t[e] = ye(t[e], i);
      },
      _update: function () {
        this._map &&
          (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function () {
        this._renderer._updatePoly(this);
      },
      _containsPoint: function (t, i) {
        var e,
          n,
          o,
          s,
          r,
          a,
          h = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;
        for (e = 0, s = this._parts.length; e < s; e++)
          for (n = 0, o = (r = (a = this._parts[e]).length) - 1; n < r; o = n++)
            if ((i || 0 !== n) && xe(t, a[o], a[n]) <= h) return !0;
        return !1;
      },
    });
    function sn(t, i) {
      return new on(t, i);
    }
    on._flat = ke;
    var rn = on.extend({
      options: { fill: !0 },
      isEmpty: function () {
        return !this._latlngs.length || !this._latlngs[0].length;
      },
      getCenter: function () {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = this._rings[0],
          l = u.length;
        if (!l) return null;
        for (s = r = a = 0, t = 0, i = l - 1; t < l; i = t++)
          (e = u[t]),
            (n = u[i]),
            (o = e.y * n.x - n.y * e.x),
            (r += (e.x + n.x) * o),
            (a += (e.y + n.y) * o),
            (s += 3 * o);
        return (
          (h = 0 === s ? u[0] : [r / s, a / s]), this._map.layerPointToLatLng(h)
        );
      },
      _convertLatLngs: function (t) {
        var i = on.prototype._convertLatLngs.call(this, t),
          e = i.length;
        return (
          e >= 2 && i[0] instanceof j && i[0].equals(i[e - 1]) && i.pop(), i
        );
      },
      _setLatLngs: function (t) {
        on.prototype._setLatLngs.call(this, t),
          Se(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function () {
        return Se(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function () {
        var t = this._renderer._bounds,
          i = this.options.weight,
          e = new B(i, i);
        if (
          ((t = new O(t.min.subtract(e), t.max.add(e))),
          (this._parts = []),
          this._pxBounds && this._pxBounds.intersects(t))
        )
          if (this.options.noClip) this._parts = this._rings;
          else
            for (var n, o = 0, s = this._rings.length; o < s; o++)
              (n = Be(this._rings[o], t, !0)).length && this._parts.push(n);
      },
      _updatePath: function () {
        this._renderer._updatePoly(this, !0);
      },
      _containsPoint: function (t) {
        var i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = !1;
        if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;
        for (o = 0, a = this._parts.length; o < a; o++)
          for (s = 0, r = (h = (i = this._parts[o]).length) - 1; s < h; r = s++)
            (e = i[s]),
              (n = i[r]),
              e.y > t.y != n.y > t.y &&
                t.x < ((n.x - e.x) * (t.y - e.y)) / (n.y - e.y) + e.x &&
                (u = !u);
        return u || on.prototype._containsPoint.call(this, t, !0);
      },
    });
    function an(t, i) {
      return new rn(t, i);
    }
    var hn = Ue.extend({
      initialize: function (t, i) {
        d(this, i), (this._layers = {}), t && this.addData(t);
      },
      addData: function (t) {
        var i,
          e,
          n,
          o = g(t) ? t : t.features;
        if (o) {
          for (i = 0, e = o.length; i < e; i++)
            ((n = o[i]).geometries ||
              n.geometry ||
              n.features ||
              n.coordinates) &&
              this.addData(n);
          return this;
        }
        var s = this.options;
        if (s.filter && !s.filter(t)) return this;
        var r = un(t, s);
        return r
          ? ((r.feature = fn(t)),
            (r.defaultOptions = r.options),
            this.resetStyle(r),
            s.onEachFeature && s.onEachFeature(t, r),
            this.addLayer(r))
          : this;
      },
      resetStyle: function (t) {
        return void 0 === t
          ? this.eachLayer(this.resetStyle, this)
          : ((t.options = e({}, t.defaultOptions)),
            this._setLayerStyle(t, this.options.style),
            this);
      },
      setStyle: function (t) {
        return this.eachLayer(function (i) {
          this._setLayerStyle(i, t);
        }, this);
      },
      _setLayerStyle: function (t, i) {
        t.setStyle &&
          ("function" == typeof i && (i = i(t.feature)), t.setStyle(i));
      },
    });
    function un(t, i) {
      var e,
        n,
        o,
        s,
        r = "Feature" === t.type ? t.geometry : t,
        a = r ? r.coordinates : null,
        h = [],
        u = i && i.pointToLayer,
        l = (i && i.coordsToLatLng) || cn;
      if (!a && !r) return null;
      switch (r.type) {
        case "Point":
          return ln(u, t, (e = l(a)), i);
        case "MultiPoint":
          for (o = 0, s = a.length; o < s; o++)
            (e = l(a[o])), h.push(ln(u, t, e, i));
          return new Ue(h);
        case "LineString":
        case "MultiLineString":
          return (n = _n(a, "LineString" === r.type ? 0 : 1, l)), new on(n, i);
        case "Polygon":
        case "MultiPolygon":
          return (n = _n(a, "Polygon" === r.type ? 1 : 2, l)), new rn(n, i);
        case "GeometryCollection":
          for (o = 0, s = r.geometries.length; o < s; o++) {
            var c = un(
              {
                geometry: r.geometries[o],
                type: "Feature",
                properties: t.properties,
              },
              i
            );
            c && h.push(c);
          }
          return new Ue(h);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function ln(t, i, e, n) {
      return t ? t(i, e) : new Xe(e, n && n.markersInheritOptions && n);
    }
    function cn(t) {
      return new j(t[1], t[0], t[2]);
    }
    function _n(t, i, e) {
      for (var n, o = [], s = 0, r = t.length; s < r; s++)
        (n = i ? _n(t[s], i - 1, e) : (e || cn)(t[s])), o.push(n);
      return o;
    }
    function dn(t, i) {
      return void 0 !== (t = H(t)).alt
        ? [l(t.lng, i), l(t.lat, i), l(t.alt, i)]
        : [l(t.lng, i), l(t.lat, i)];
    }
    function pn(t, i, e, n) {
      for (var o = [], s = 0, r = t.length; s < r; s++)
        o.push(i ? pn(t[s], i - 1, e, n) : dn(t[s], n));
      return !i && e && o.push(o[0]), o;
    }
    function mn(t, i) {
      return t.feature ? e({}, t.feature, { geometry: i }) : fn(i);
    }
    function fn(t) {
      return "Feature" === t.type || "FeatureCollection" === t.type
        ? t
        : { type: "Feature", properties: {}, geometry: t };
    }
    var gn = {
      toGeoJSON: function (t) {
        return mn(this, {
          type: "Point",
          coordinates: dn(this.getLatLng(), t),
        });
      },
    };
    function vn(t, i) {
      return new hn(t, i);
    }
    Xe.include(gn),
      en.include(gn),
      Qe.include(gn),
      on.include({
        toGeoJSON: function (t) {
          var i = !Se(this._latlngs);
          return mn(this, {
            type: (i ? "Multi" : "") + "LineString",
            coordinates: pn(this._latlngs, i ? 1 : 0, !1, t),
          });
        },
      }),
      rn.include({
        toGeoJSON: function (t) {
          var i = !Se(this._latlngs),
            e = i && !Se(this._latlngs[0]),
            n = pn(this._latlngs, e ? 2 : i ? 1 : 0, !0, t);
          return (
            i || (n = [n]),
            mn(this, { type: (e ? "Multi" : "") + "Polygon", coordinates: n })
          );
        },
      }),
      We.include({
        toMultiPoint: function (t) {
          var i = [];
          return (
            this.eachLayer(function (e) {
              i.push(e.toGeoJSON(t).geometry.coordinates);
            }),
            mn(this, { type: "MultiPoint", coordinates: i })
          );
        },
        toGeoJSON: function (t) {
          var i =
            this.feature && this.feature.geometry && this.feature.geometry.type;
          if ("MultiPoint" === i) return this.toMultiPoint(t);
          var e = "GeometryCollection" === i,
            n = [];
          return (
            this.eachLayer(function (i) {
              if (i.toGeoJSON) {
                var o = i.toGeoJSON(t);
                if (e) n.push(o.geometry);
                else {
                  var s = fn(o);
                  "FeatureCollection" === s.type
                    ? n.push.apply(n, s.features)
                    : n.push(s);
                }
              }
            }),
            e
              ? mn(this, { geometries: n, type: "GeometryCollection" })
              : { type: "FeatureCollection", features: n }
          );
        },
      });
    var yn = vn,
      xn = He.extend({
        options: {
          opacity: 1,
          alt: "",
          interactive: !1,
          crossOrigin: !1,
          errorOverlayUrl: "",
          zIndex: 1,
          className: "",
        },
        initialize: function (t, i, e) {
          (this._url = t), (this._bounds = D(i)), d(this, e);
        },
        onAdd: function () {
          this._image ||
            (this._initImage(),
            this.options.opacity < 1 && this._updateOpacity()),
            this.options.interactive &&
              (yi(this._image, "leaflet-interactive"),
              this.addInteractiveTarget(this._image)),
            this.getPane().appendChild(this._image),
            this._reset();
        },
        onRemove: function () {
          pi(this._image),
            this.options.interactive &&
              this.removeInteractiveTarget(this._image);
        },
        setOpacity: function (t) {
          return (
            (this.options.opacity = t),
            this._image && this._updateOpacity(),
            this
          );
        },
        setStyle: function (t) {
          return t.opacity && this.setOpacity(t.opacity), this;
        },
        bringToFront: function () {
          return this._map && fi(this._image), this;
        },
        bringToBack: function () {
          return this._map && gi(this._image), this;
        },
        setUrl: function (t) {
          return (this._url = t), this._image && (this._image.src = t), this;
        },
        setBounds: function (t) {
          return (this._bounds = D(t)), this._map && this._reset(), this;
        },
        getEvents: function () {
          var t = { zoom: this._reset, viewreset: this._reset };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        setZIndex: function (t) {
          return (this.options.zIndex = t), this._updateZIndex(), this;
        },
        getBounds: function () {
          return this._bounds;
        },
        getElement: function () {
          return this._image;
        },
        _initImage: function () {
          var t = "IMG" === this._url.tagName,
            i = (this._image = t ? this._url : di("img"));
          yi(i, "leaflet-image-layer"),
            this._zoomAnimated && yi(i, "leaflet-zoom-animated"),
            this.options.className && yi(i, this.options.className),
            (i.onselectstart = u),
            (i.onmousemove = u),
            (i.onload = o(this.fire, this, "load")),
            (i.onerror = o(this._overlayOnError, this, "error")),
            (this.options.crossOrigin || "" === this.options.crossOrigin) &&
              (i.crossOrigin =
                !0 === this.options.crossOrigin
                  ? ""
                  : this.options.crossOrigin),
            this.options.zIndex && this._updateZIndex(),
            t
              ? (this._url = i.src)
              : ((i.src = this._url), (i.alt = this.options.alt));
        },
        _animateZoom: function (t) {
          var i = this._map.getZoomScale(t.zoom),
            e = this._map._latLngBoundsToNewLayerBounds(
              this._bounds,
              t.zoom,
              t.center
            ).min;
          zi(this._image, e, i);
        },
        _reset: function () {
          var t = this._image,
            i = new O(
              this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
              this._map.latLngToLayerPoint(this._bounds.getSouthEast())
            ),
            e = i.getSize();
          Mi(t, i.min),
            (t.style.width = e.x + "px"),
            (t.style.height = e.y + "px");
        },
        _updateOpacity: function () {
          bi(this._image, this.options.opacity);
        },
        _updateZIndex: function () {
          this._image &&
            void 0 !== this.options.zIndex &&
            null !== this.options.zIndex &&
            (this._image.style.zIndex = this.options.zIndex);
        },
        _overlayOnError: function () {
          this.fire("error");
          var t = this.options.errorOverlayUrl;
          t && this._url !== t && ((this._url = t), (this._image.src = t));
        },
        getCenter: function () {
          return this._bounds.getCenter();
        },
      }),
      wn = function (t, i, e) {
        return new xn(t, i, e);
      },
      Pn = xn.extend({
        options: {
          autoplay: !0,
          loop: !0,
          keepAspectRatio: !0,
          muted: !1,
          playsInline: !0,
        },
        _initImage: function () {
          var t = "VIDEO" === this._url.tagName,
            i = (this._image = t ? this._url : di("video"));
          if (
            (yi(i, "leaflet-image-layer"),
            this._zoomAnimated && yi(i, "leaflet-zoom-animated"),
            this.options.className && yi(i, this.options.className),
            (i.onselectstart = u),
            (i.onmousemove = u),
            (i.onloadeddata = o(this.fire, this, "load")),
            t)
          ) {
            for (
              var e = i.getElementsByTagName("source"), n = [], s = 0;
              s < e.length;
              s++
            )
              n.push(e[s].src);
            this._url = e.length > 0 ? n : [i.src];
          } else {
            g(this._url) || (this._url = [this._url]),
              !this.options.keepAspectRatio &&
                Object.prototype.hasOwnProperty.call(i.style, "objectFit") &&
                (i.style.objectFit = "fill"),
              (i.autoplay = !!this.options.autoplay),
              (i.loop = !!this.options.loop),
              (i.muted = !!this.options.muted),
              (i.playsInline = !!this.options.playsInline);
            for (var r = 0; r < this._url.length; r++) {
              var a = di("source");
              (a.src = this._url[r]), i.appendChild(a);
            }
          }
        },
      });
    function bn(t, i, e) {
      return new Pn(t, i, e);
    }
    var Ln = xn.extend({
      _initImage: function () {
        var t = (this._image = this._url);
        yi(t, "leaflet-image-layer"),
          this._zoomAnimated && yi(t, "leaflet-zoom-animated"),
          this.options.className && yi(t, this.options.className),
          (t.onselectstart = u),
          (t.onmousemove = u);
      },
    });
    function Tn(t, i, e) {
      return new Ln(t, i, e);
    }
    var zn = He.extend({
      options: { interactive: !1, offset: [0, 0], className: "", pane: void 0 },
      initialize: function (t, i) {
        d(this, t), (this._source = i);
      },
      openOn: function (t) {
        return (
          (t = arguments.length ? t : this._source._map).hasLayer(this) ||
            t.addLayer(this),
          this
        );
      },
      close: function () {
        return this._map && this._map.removeLayer(this), this;
      },
      toggle: function (t) {
        return (
          this._map
            ? this.close()
            : (arguments.length ? (this._source = t) : (t = this._source),
              this._prepareOpen(),
              this.openOn(t._map)),
          this
        );
      },
      onAdd: function (t) {
        (this._zoomAnimated = t._zoomAnimated),
          this._container || this._initLayout(),
          t._fadeAnimated && bi(this._container, 0),
          clearTimeout(this._removeTimeout),
          this.getPane().appendChild(this._container),
          this.update(),
          t._fadeAnimated && bi(this._container, 1),
          this.bringToFront(),
          this.options.interactive &&
            (yi(this._container, "leaflet-interactive"),
            this.addInteractiveTarget(this._container));
      },
      onRemove: function (t) {
        t._fadeAnimated
          ? (bi(this._container, 0),
            (this._removeTimeout = setTimeout(
              o(pi, void 0, this._container),
              200
            )))
          : pi(this._container),
          this.options.interactive &&
            (xi(this._container, "leaflet-interactive"),
            this.removeInteractiveTarget(this._container));
      },
      getLatLng: function () {
        return this._latlng;
      },
      setLatLng: function (t) {
        return (
          (this._latlng = H(t)),
          this._map && (this._updatePosition(), this._adjustPan()),
          this
        );
      },
      getContent: function () {
        return this._content;
      },
      setContent: function (t) {
        return (this._content = t), this.update(), this;
      },
      getElement: function () {
        return this._container;
      },
      update: function () {
        this._map &&
          ((this._container.style.visibility = "hidden"),
          this._updateContent(),
          this._updateLayout(),
          this._updatePosition(),
          (this._container.style.visibility = ""),
          this._adjustPan());
      },
      getEvents: function () {
        var t = { zoom: this._updatePosition, viewreset: this._updatePosition };
        return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      isOpen: function () {
        return !!this._map && this._map.hasLayer(this);
      },
      bringToFront: function () {
        return this._map && fi(this._container), this;
      },
      bringToBack: function () {
        return this._map && gi(this._container), this;
      },
      _prepareOpen: function (t) {
        var i = this._source;
        if (!i._map) return !1;
        if (i instanceof Ue) {
          i = null;
          var e = this._source._layers;
          for (var n in e)
            if (e[n]._map) {
              i = e[n];
              break;
            }
          if (!i) return !1;
          this._source = i;
        }
        if (!t)
          if (i.getCenter) t = i.getCenter();
          else if (i.getLatLng) t = i.getLatLng();
          else {
            if (!i.getBounds)
              throw new Error("Unable to get source layer LatLng.");
            t = i.getBounds().getCenter();
          }
        return this.setLatLng(t), this._map && this.update(), !0;
      },
      _updateContent: function () {
        if (this._content) {
          var t = this._contentNode,
            i =
              "function" == typeof this._content
                ? this._content(this._source || this)
                : this._content;
          if ("string" == typeof i) t.innerHTML = i;
          else {
            for (; t.hasChildNodes(); ) t.removeChild(t.firstChild);
            t.appendChild(i);
          }
          this.fire("contentupdate");
        }
      },
      _updatePosition: function () {
        if (this._map) {
          var t = this._map.latLngToLayerPoint(this._latlng),
            i = I(this.options.offset),
            e = this._getAnchor();
          this._zoomAnimated
            ? Mi(this._container, t.add(e))
            : (i = i.add(t).add(e));
          var n = (this._containerBottom = -i.y),
            o = (this._containerLeft =
              -Math.round(this._containerWidth / 2) + i.x);
          (this._container.style.bottom = n + "px"),
            (this._container.style.left = o + "px");
        }
      },
      _getAnchor: function () {
        return [0, 0];
      },
    });
    ie.include({
      _initOverlay: function (t, i, e, n) {
        var o = i;
        return (
          o instanceof t || (o = new t(n).setContent(i)), e && o.setLatLng(e), o
        );
      },
    }),
      He.include({
        _initOverlay: function (t, i, e, n) {
          var o = e;
          return (
            o instanceof t
              ? (d(o, n), (o._source = this))
              : (o = i && !n ? i : new t(n, this)).setContent(e),
            o
          );
        },
      });
    var Mn = zn.extend({
        options: {
          pane: "popupPane",
          offset: [0, 7],
          maxWidth: 300,
          minWidth: 50,
          maxHeight: null,
          autoPan: !0,
          autoPanPaddingTopLeft: null,
          autoPanPaddingBottomRight: null,
          autoPanPadding: [5, 5],
          keepInView: !1,
          closeButton: !0,
          autoClose: !0,
          closeOnEscapeKey: !0,
          className: "",
        },
        openOn: function (t) {
          return (
            !(t = arguments.length ? t : this._source._map).hasLayer(this) &&
              t._popup &&
              t._popup.options.autoClose &&
              t.removeLayer(t._popup),
            (t._popup = this),
            zn.prototype.openOn.call(this, t)
          );
        },
        onAdd: function (t) {
          zn.prototype.onAdd.call(this, t),
            t.fire("popupopen", { popup: this }),
            this._source &&
              (this._source.fire("popupopen", { popup: this }, !0),
              this._source instanceof $e || this._source.on("preclick", Ui));
        },
        onRemove: function (t) {
          zn.prototype.onRemove.call(this, t),
            t.fire("popupclose", { popup: this }),
            this._source &&
              (this._source.fire("popupclose", { popup: this }, !0),
              this._source instanceof $e || this._source.off("preclick", Ui));
        },
        getEvents: function () {
          var t = zn.prototype.getEvents.call(this);
          return (
            (void 0 !== this.options.closeOnClick
              ? this.options.closeOnClick
              : this._map.options.closePopupOnClick) &&
              (t.preclick = this.close),
            this.options.keepInView && (t.moveend = this._adjustPan),
            t
          );
        },
        _initLayout: function () {
          var t = "leaflet-popup",
            i = (this._container = di(
              "div",
              t +
                " " +
                (this.options.className || "") +
                " leaflet-zoom-animated"
            )),
            e = (this._wrapper = di("div", t + "-content-wrapper", i));
          if (
            ((this._contentNode = di("div", t + "-content", e)),
            qi(i),
            Vi(this._contentNode),
            Ri(i, "contextmenu", Ui),
            (this._tipContainer = di("div", t + "-tip-container", i)),
            (this._tip = di("div", t + "-tip", this._tipContainer)),
            this.options.closeButton)
          ) {
            var n = (this._closeButton = di("a", t + "-close-button", i));
            n.setAttribute("role", "button"),
              n.setAttribute("aria-label", "Close popup"),
              (n.href = "#close"),
              (n.innerHTML = '<span aria-hidden="true">&#215;</span>'),
              Ri(n, "click", this.close, this);
          }
        },
        _updateLayout: function () {
          var t = this._contentNode,
            i = t.style;
          (i.width = ""), (i.whiteSpace = "nowrap");
          var e = t.offsetWidth;
          (e = Math.min(e, this.options.maxWidth)),
            (e = Math.max(e, this.options.minWidth)),
            (i.width = e + 1 + "px"),
            (i.whiteSpace = ""),
            (i.height = "");
          var n = t.offsetHeight,
            o = this.options.maxHeight,
            s = "leaflet-popup-scrolled";
          o && n > o ? ((i.height = o + "px"), yi(t, s)) : xi(t, s),
            (this._containerWidth = this._container.offsetWidth);
        },
        _animateZoom: function (t) {
          var i = this._map._latLngToNewLayerPoint(
              this._latlng,
              t.zoom,
              t.center
            ),
            e = this._getAnchor();
          Mi(this._container, i.add(e));
        },
        _adjustPan: function (t) {
          if (this.options.autoPan) {
            this._map._panAnim && this._map._panAnim.stop();
            var i = this._map,
              e = parseInt(_i(this._container, "marginBottom"), 10) || 0,
              n = this._container.offsetHeight + e,
              o = this._containerWidth,
              s = new B(this._containerLeft, -n - this._containerBottom);
            s._add(Ci(this._container));
            var r = i.layerPointToContainerPoint(s),
              a = I(this.options.autoPanPadding),
              h = I(this.options.autoPanPaddingTopLeft || a),
              u = I(this.options.autoPanPaddingBottomRight || a),
              l = i.getSize(),
              c = 0,
              _ = 0;
            r.x + o + u.x > l.x && (c = r.x + o - l.x + u.x),
              r.x - c - h.x < 0 && (c = r.x - h.x),
              r.y + n + u.y > l.y && (_ = r.y + n - l.y + u.y),
              r.y - _ - h.y < 0 && (_ = r.y - h.y),
              (c || _) &&
                i
                  .fire("autopanstart")
                  .panBy([c, _], { animate: t && "moveend" === t.type });
          }
        },
        _getAnchor: function () {
          return I(
            this._source && this._source._getPopupAnchor
              ? this._source._getPopupAnchor()
              : [0, 0]
          );
        },
      }),
      Cn = function (t, i) {
        return new Mn(t, i);
      };
    ie.mergeOptions({ closePopupOnClick: !0 }),
      ie.include({
        openPopup: function (t, i, e) {
          return this._initOverlay(Mn, t, i, e).openOn(this), this;
        },
        closePopup: function (t) {
          return (t = arguments.length ? t : this._popup) && t.close(), this;
        },
      }),
      He.include({
        bindPopup: function (t, i) {
          return (
            (this._popup = this._initOverlay(Mn, this._popup, t, i)),
            this._popupHandlersAdded ||
              (this.on({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup,
              }),
              (this._popupHandlersAdded = !0)),
            this
          );
        },
        unbindPopup: function () {
          return (
            this._popup &&
              (this.off({
                click: this._openPopup,
                keypress: this._onKeyPress,
                remove: this.closePopup,
                move: this._movePopup,
              }),
              (this._popupHandlersAdded = !1),
              (this._popup = null)),
            this
          );
        },
        openPopup: function (t) {
          return (
            this._popup &&
              this._popup._prepareOpen(t) &&
              this._popup.openOn(this._map),
            this
          );
        },
        closePopup: function () {
          return this._popup && this._popup.close(), this;
        },
        togglePopup: function () {
          return this._popup && this._popup.toggle(this), this;
        },
        isPopupOpen: function () {
          return !!this._popup && this._popup.isOpen();
        },
        setPopupContent: function (t) {
          return this._popup && this._popup.setContent(t), this;
        },
        getPopup: function () {
          return this._popup;
        },
        _openPopup: function (t) {
          if (this._popup && this._map) {
            Ki(t);
            var i = t.layer || t.target;
            this._popup._source !== i || i instanceof $e
              ? ((this._popup._source = i), this.openPopup(t.latlng))
              : this._map.hasLayer(this._popup)
              ? this.closePopup()
              : this.openPopup(t.latlng);
          }
        },
        _movePopup: function (t) {
          this._popup.setLatLng(t.latlng);
        },
        _onKeyPress: function (t) {
          13 === t.originalEvent.keyCode && this._openPopup(t);
        },
      });
    var Zn = zn.extend({
        options: {
          pane: "tooltipPane",
          offset: [0, 0],
          direction: "auto",
          permanent: !1,
          sticky: !1,
          opacity: 0.9,
        },
        onAdd: function (t) {
          zn.prototype.onAdd.call(this, t),
            this.setOpacity(this.options.opacity),
            t.fire("tooltipopen", { tooltip: this }),
            this._source &&
              (this.addEventParent(this._source),
              this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function (t) {
          zn.prototype.onRemove.call(this, t),
            t.fire("tooltipclose", { tooltip: this }),
            this._source &&
              (this.removeEventParent(this._source),
              this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function () {
          var t = zn.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function () {
          var t =
            "leaflet-tooltip " +
            (this.options.className || "") +
            " leaflet-zoom-" +
            (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = di("div", t);
        },
        _updateLayout: function () {},
        _adjustPan: function () {},
        _setPosition: function (t) {
          var i,
            e,
            n = this._map,
            o = this._container,
            s = n.latLngToContainerPoint(n.getCenter()),
            r = n.layerPointToContainerPoint(t),
            a = this.options.direction,
            h = o.offsetWidth,
            u = o.offsetHeight,
            l = I(this.options.offset),
            c = this._getAnchor();
          "top" === a
            ? ((i = h / 2), (e = u))
            : "bottom" === a
            ? ((i = h / 2), (e = 0))
            : "center" === a
            ? ((i = h / 2), (e = u / 2))
            : "right" === a
            ? ((i = 0), (e = u / 2))
            : "left" === a
            ? ((i = h), (e = u / 2))
            : r.x < s.x
            ? ((a = "right"), (i = 0), (e = u / 2))
            : ((a = "left"), (i = h + 2 * (l.x + c.x)), (e = u / 2)),
            (t = t
              .subtract(I(i, e, !0))
              .add(l)
              .add(c)),
            xi(o, "leaflet-tooltip-right"),
            xi(o, "leaflet-tooltip-left"),
            xi(o, "leaflet-tooltip-top"),
            xi(o, "leaflet-tooltip-bottom"),
            yi(o, "leaflet-tooltip-" + a),
            Mi(o, t);
        },
        _updatePosition: function () {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function (t) {
          (this.options.opacity = t), this._container && bi(this._container, t);
        },
        _animateZoom: function (t) {
          var i = this._map._latLngToNewLayerPoint(
            this._latlng,
            t.zoom,
            t.center
          );
          this._setPosition(i);
        },
        _getAnchor: function () {
          return I(
            this._source &&
              this._source._getTooltipAnchor &&
              !this.options.sticky
              ? this._source._getTooltipAnchor()
              : [0, 0]
          );
        },
      }),
      Sn = function (t, i) {
        return new Zn(t, i);
      };
    ie.include({
      openTooltip: function (t, i, e) {
        return this._initOverlay(Zn, t, i, e).openOn(this), this;
      },
      closeTooltip: function (t) {
        return t.close(), this;
      },
    }),
      He.include({
        bindTooltip: function (t, i) {
          return (
            this._tooltip && this.isTooltipOpen() && this.unbindTooltip(),
            (this._tooltip = this._initOverlay(Zn, this._tooltip, t, i)),
            this._initTooltipInteractions(),
            this._tooltip.options.permanent &&
              this._map &&
              this._map.hasLayer(this) &&
              this.openTooltip(),
            this
          );
        },
        unbindTooltip: function () {
          return (
            this._tooltip &&
              (this._initTooltipInteractions(!0),
              this.closeTooltip(),
              (this._tooltip = null)),
            this
          );
        },
        _initTooltipInteractions: function (t) {
          if (t || !this._tooltipHandlersAdded) {
            var i = t ? "off" : "on",
              e = { remove: this.closeTooltip, move: this._moveTooltip };
            this._tooltip.options.permanent
              ? (e.add = this._openTooltip)
              : ((e.mouseover = this._openTooltip),
                (e.mouseout = this.closeTooltip),
                (e.click = this._openTooltip)),
              this._tooltip.options.sticky && (e.mousemove = this._moveTooltip),
              this[i](e),
              (this._tooltipHandlersAdded = !t);
          }
        },
        openTooltip: function (t) {
          return (
            this._tooltip &&
              this._tooltip._prepareOpen(t) &&
              this._tooltip.openOn(this._map),
            this
          );
        },
        closeTooltip: function () {
          if (this._tooltip) return this._tooltip.close();
        },
        toggleTooltip: function () {
          return this._tooltip && this._tooltip.toggle(this), this;
        },
        isTooltipOpen: function () {
          return this._tooltip.isOpen();
        },
        setTooltipContent: function (t) {
          return this._tooltip && this._tooltip.setContent(t), this;
        },
        getTooltip: function () {
          return this._tooltip;
        },
        _openTooltip: function (t) {
          !this._tooltip ||
            !this._map ||
            (this._map.dragging && this._map.dragging.moving()) ||
            ((this._tooltip._source = t.layer || t.target),
            this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0));
        },
        _moveTooltip: function (t) {
          var i,
            e,
            n = t.latlng;
          this._tooltip.options.sticky &&
            t.originalEvent &&
            ((i = this._map.mouseEventToContainerPoint(t.originalEvent)),
            (e = this._map.containerPointToLayerPoint(i)),
            (n = this._map.layerPointToLatLng(e))),
            this._tooltip.setLatLng(n);
        },
      });
    var kn = qe.extend({
      options: {
        iconSize: [12, 12],
        html: !1,
        bgPos: null,
        className: "leaflet-div-icon",
      },
      createIcon: function (t) {
        var i = t && "DIV" === t.tagName ? t : document.createElement("div"),
          e = this.options;
        if (
          (e.html instanceof Element
            ? (mi(i), i.appendChild(e.html))
            : (i.innerHTML = !1 !== e.html ? e.html : ""),
          e.bgPos)
        ) {
          var n = I(e.bgPos);
          i.style.backgroundPosition = -n.x + "px " + -n.y + "px";
        }
        return this._setIconStyles(i, "icon"), i;
      },
      createShadow: function () {
        return null;
      },
    });
    function En(t) {
      return new kn(t);
    }
    qe.Default = Ke;
    var Bn = He.extend({
      options: {
        tileSize: 256,
        opacity: 1,
        updateWhenIdle: Ot.mobile,
        updateWhenZooming: !0,
        updateInterval: 200,
        zIndex: 1,
        bounds: null,
        minZoom: 0,
        maxZoom: void 0,
        maxNativeZoom: void 0,
        minNativeZoom: void 0,
        noWrap: !1,
        pane: "tilePane",
        className: "",
        keepBuffer: 2,
      },
      initialize: function (t) {
        d(this, t);
      },
      onAdd: function () {
        this._initContainer(),
          (this._levels = {}),
          (this._tiles = {}),
          this._resetView();
      },
      beforeAdd: function (t) {
        t._addZoomLimit(this);
      },
      onRemove: function (t) {
        this._removeAllTiles(),
          pi(this._container),
          t._removeZoomLimit(this),
          (this._container = null),
          (this._tileZoom = void 0);
      },
      bringToFront: function () {
        return (
          this._map && (fi(this._container), this._setAutoZIndex(Math.max)),
          this
        );
      },
      bringToBack: function () {
        return (
          this._map && (gi(this._container), this._setAutoZIndex(Math.min)),
          this
        );
      },
      getContainer: function () {
        return this._container;
      },
      setOpacity: function (t) {
        return (this.options.opacity = t), this._updateOpacity(), this;
      },
      setZIndex: function (t) {
        return (this.options.zIndex = t), this._updateZIndex(), this;
      },
      isLoading: function () {
        return this._loading;
      },
      redraw: function () {
        if (this._map) {
          this._removeAllTiles();
          var t = this._clampZoom(this._map.getZoom());
          t !== this._tileZoom && ((this._tileZoom = t), this._updateLevels()),
            this._update();
        }
        return this;
      },
      getEvents: function () {
        var t = {
          viewprereset: this._invalidateAll,
          viewreset: this._resetView,
          zoom: this._resetView,
          moveend: this._onMoveEnd,
        };
        return (
          this.options.updateWhenIdle ||
            (this._onMove ||
              (this._onMove = a(
                this._onMoveEnd,
                this.options.updateInterval,
                this
              )),
            (t.move = this._onMove)),
          this._zoomAnimated && (t.zoomanim = this._animateZoom),
          t
        );
      },
      createTile: function () {
        return document.createElement("div");
      },
      getTileSize: function () {
        var t = this.options.tileSize;
        return t instanceof B ? t : new B(t, t);
      },
      _updateZIndex: function () {
        this._container &&
          void 0 !== this.options.zIndex &&
          null !== this.options.zIndex &&
          (this._container.style.zIndex = this.options.zIndex);
      },
      _setAutoZIndex: function (t) {
        for (
          var i,
            e = this.getPane().children,
            n = -t(-1 / 0, 1 / 0),
            o = 0,
            s = e.length;
          o < s;
          o++
        )
          (i = e[o].style.zIndex),
            e[o] !== this._container && i && (n = t(n, +i));
        isFinite(n) &&
          ((this.options.zIndex = n + t(-1, 1)), this._updateZIndex());
      },
      _updateOpacity: function () {
        if (this._map && !Ot.ielt9) {
          bi(this._container, this.options.opacity);
          var t = +new Date(),
            i = !1,
            e = !1;
          for (var n in this._tiles) {
            var o = this._tiles[n];
            if (o.current && o.loaded) {
              var s = Math.min(1, (t - o.loaded) / 200);
              bi(o.el, s),
                s < 1
                  ? (i = !0)
                  : (o.active ? (e = !0) : this._onOpaqueTile(o),
                    (o.active = !0));
            }
          }
          e && !this._noPrune && this._pruneTiles(),
            i &&
              (M(this._fadeFrame),
              (this._fadeFrame = z(this._updateOpacity, this)));
        }
      },
      _onOpaqueTile: u,
      _initContainer: function () {
        this._container ||
          ((this._container = di(
            "div",
            "leaflet-layer " + (this.options.className || "")
          )),
          this._updateZIndex(),
          this.options.opacity < 1 && this._updateOpacity(),
          this.getPane().appendChild(this._container));
      },
      _updateLevels: function () {
        var t = this._tileZoom,
          i = this.options.maxZoom;
        if (void 0 !== t) {
          for (var e in this._levels)
            (e = Number(e)),
              this._levels[e].el.children.length || e === t
                ? ((this._levels[e].el.style.zIndex = i - Math.abs(t - e)),
                  this._onUpdateLevel(e))
                : (pi(this._levels[e].el),
                  this._removeTilesAtZoom(e),
                  this._onRemoveLevel(e),
                  delete this._levels[e]);
          var n = this._levels[t],
            o = this._map;
          return (
            n ||
              (((n = this._levels[t] = {}).el = di(
                "div",
                "leaflet-tile-container leaflet-zoom-animated",
                this._container
              )),
              (n.el.style.zIndex = i),
              (n.origin = o
                .project(o.unproject(o.getPixelOrigin()), t)
                .round()),
              (n.zoom = t),
              this._setZoomTransform(n, o.getCenter(), o.getZoom()),
              u(n.el.offsetWidth),
              this._onCreateLevel(n)),
            (this._level = n),
            n
          );
        }
      },
      _onUpdateLevel: u,
      _onRemoveLevel: u,
      _onCreateLevel: u,
      _pruneTiles: function () {
        if (this._map) {
          var t,
            i,
            e = this._map.getZoom();
          if (e > this.options.maxZoom || e < this.options.minZoom)
            this._removeAllTiles();
          else {
            for (t in this._tiles) (i = this._tiles[t]).retain = i.current;
            for (t in this._tiles)
              if ((i = this._tiles[t]).current && !i.active) {
                var n = i.coords;
                this._retainParent(n.x, n.y, n.z, n.z - 5) ||
                  this._retainChildren(n.x, n.y, n.z, n.z + 2);
              }
            for (t in this._tiles) this._tiles[t].retain || this._removeTile(t);
          }
        }
      },
      _removeTilesAtZoom: function (t) {
        for (var i in this._tiles)
          this._tiles[i].coords.z === t && this._removeTile(i);
      },
      _removeAllTiles: function () {
        for (var t in this._tiles) this._removeTile(t);
      },
      _invalidateAll: function () {
        for (var t in this._levels)
          pi(this._levels[t].el),
            this._onRemoveLevel(Number(t)),
            delete this._levels[t];
        this._removeAllTiles(), (this._tileZoom = void 0);
      },
      _retainParent: function (t, i, e, n) {
        var o = Math.floor(t / 2),
          s = Math.floor(i / 2),
          r = e - 1,
          a = new B(+o, +s);
        a.z = +r;
        var h = this._tileCoordsToKey(a),
          u = this._tiles[h];
        return u && u.active
          ? ((u.retain = !0), !0)
          : (u && u.loaded && (u.retain = !0),
            r > n && this._retainParent(o, s, r, n));
      },
      _retainChildren: function (t, i, e, n) {
        for (var o = 2 * t; o < 2 * t + 2; o++)
          for (var s = 2 * i; s < 2 * i + 2; s++) {
            var r = new B(o, s);
            r.z = e + 1;
            var a = this._tileCoordsToKey(r),
              h = this._tiles[a];
            h && h.active
              ? (h.retain = !0)
              : (h && h.loaded && (h.retain = !0),
                e + 1 < n && this._retainChildren(o, s, e + 1, n));
          }
      },
      _resetView: function (t) {
        var i = t && (t.pinch || t.flyTo);
        this._setView(this._map.getCenter(), this._map.getZoom(), i, i);
      },
      _animateZoom: function (t) {
        this._setView(t.center, t.zoom, !0, t.noUpdate);
      },
      _clampZoom: function (t) {
        var i = this.options;
        return void 0 !== i.minNativeZoom && t < i.minNativeZoom
          ? i.minNativeZoom
          : void 0 !== i.maxNativeZoom && i.maxNativeZoom < t
          ? i.maxNativeZoom
          : t;
      },
      _setView: function (t, i, e, n) {
        var o = Math.round(i);
        o =
          (void 0 !== this.options.maxZoom && o > this.options.maxZoom) ||
          (void 0 !== this.options.minZoom && o < this.options.minZoom)
            ? void 0
            : this._clampZoom(o);
        var s = this.options.updateWhenZooming && o !== this._tileZoom;
        (n && !s) ||
          ((this._tileZoom = o),
          this._abortLoading && this._abortLoading(),
          this._updateLevels(),
          this._resetGrid(),
          void 0 !== o && this._update(t),
          e || this._pruneTiles(),
          (this._noPrune = !!e)),
          this._setZoomTransforms(t, i);
      },
      _setZoomTransforms: function (t, i) {
        for (var e in this._levels)
          this._setZoomTransform(this._levels[e], t, i);
      },
      _setZoomTransform: function (t, i, e) {
        var n = this._map.getZoomScale(e, t.zoom),
          o = t.origin
            .multiplyBy(n)
            .subtract(this._map._getNewPixelOrigin(i, e))
            .round();
        Ot.any3d ? zi(t.el, o, n) : Mi(t.el, o);
      },
      _resetGrid: function () {
        var t = this._map,
          i = t.options.crs,
          e = (this._tileSize = this.getTileSize()),
          n = this._tileZoom,
          o = this._map.getPixelWorldBounds(this._tileZoom);
        o && (this._globalTileRange = this._pxBoundsToTileRange(o)),
          (this._wrapX = i.wrapLng &&
            !this.options.noWrap && [
              Math.floor(t.project([0, i.wrapLng[0]], n).x / e.x),
              Math.ceil(t.project([0, i.wrapLng[1]], n).x / e.y),
            ]),
          (this._wrapY = i.wrapLat &&
            !this.options.noWrap && [
              Math.floor(t.project([i.wrapLat[0], 0], n).y / e.x),
              Math.ceil(t.project([i.wrapLat[1], 0], n).y / e.y),
            ]);
      },
      _onMoveEnd: function () {
        this._map && !this._map._animatingZoom && this._update();
      },
      _getTiledPixelBounds: function (t) {
        var i = this._map,
          e = i._animatingZoom
            ? Math.max(i._animateToZoom, i.getZoom())
            : i.getZoom(),
          n = i.getZoomScale(e, this._tileZoom),
          o = i.project(t, this._tileZoom).floor(),
          s = i.getSize().divideBy(2 * n);
        return new O(o.subtract(s), o.add(s));
      },
      _update: function (t) {
        var i = this._map;
        if (i) {
          var e = this._clampZoom(i.getZoom());
          if (
            (void 0 === t && (t = i.getCenter()), void 0 !== this._tileZoom)
          ) {
            var n = this._getTiledPixelBounds(t),
              o = this._pxBoundsToTileRange(n),
              s = o.getCenter(),
              r = [],
              a = this.options.keepBuffer,
              h = new O(
                o.getBottomLeft().subtract([a, -a]),
                o.getTopRight().add([a, -a])
              );
            if (
              !(
                isFinite(o.min.x) &&
                isFinite(o.min.y) &&
                isFinite(o.max.x) &&
                isFinite(o.max.y)
              )
            )
              throw new Error("Attempted to load an infinite number of tiles");
            for (var u in this._tiles) {
              var l = this._tiles[u].coords;
              (l.z === this._tileZoom && h.contains(new B(l.x, l.y))) ||
                (this._tiles[u].current = !1);
            }
            if (Math.abs(e - this._tileZoom) > 1) this._setView(t, e);
            else {
              for (var c = o.min.y; c <= o.max.y; c++)
                for (var _ = o.min.x; _ <= o.max.x; _++) {
                  var d = new B(_, c);
                  if (((d.z = this._tileZoom), this._isValidTile(d))) {
                    var p = this._tiles[this._tileCoordsToKey(d)];
                    p ? (p.current = !0) : r.push(d);
                  }
                }
              if (
                (r.sort(function (t, i) {
                  return t.distanceTo(s) - i.distanceTo(s);
                }),
                0 !== r.length)
              ) {
                this._loading || ((this._loading = !0), this.fire("loading"));
                var m = document.createDocumentFragment();
                for (_ = 0; _ < r.length; _++) this._addTile(r[_], m);
                this._level.el.appendChild(m);
              }
            }
          }
        }
      },
      _isValidTile: function (t) {
        var i = this._map.options.crs;
        if (!i.infinite) {
          var e = this._globalTileRange;
          if (
            (!i.wrapLng && (t.x < e.min.x || t.x > e.max.x)) ||
            (!i.wrapLat && (t.y < e.min.y || t.y > e.max.y))
          )
            return !1;
        }
        if (!this.options.bounds) return !0;
        var n = this._tileCoordsToBounds(t);
        return D(this.options.bounds).overlaps(n);
      },
      _keyToBounds: function (t) {
        return this._tileCoordsToBounds(this._keyToTileCoords(t));
      },
      _tileCoordsToNwSe: function (t) {
        var i = this._map,
          e = this.getTileSize(),
          n = t.scaleBy(e),
          o = n.add(e);
        return [i.unproject(n, t.z), i.unproject(o, t.z)];
      },
      _tileCoordsToBounds: function (t) {
        var i = this._tileCoordsToNwSe(t),
          e = new N(i[0], i[1]);
        return this.options.noWrap || (e = this._map.wrapLatLngBounds(e)), e;
      },
      _tileCoordsToKey: function (t) {
        return t.x + ":" + t.y + ":" + t.z;
      },
      _keyToTileCoords: function (t) {
        var i = t.split(":"),
          e = new B(+i[0], +i[1]);
        return (e.z = +i[2]), e;
      },
      _removeTile: function (t) {
        var i = this._tiles[t];
        i &&
          (pi(i.el),
          delete this._tiles[t],
          this.fire("tileunload", {
            tile: i.el,
            coords: this._keyToTileCoords(t),
          }));
      },
      _initTile: function (t) {
        yi(t, "leaflet-tile");
        var i = this.getTileSize();
        (t.style.width = i.x + "px"),
          (t.style.height = i.y + "px"),
          (t.onselectstart = u),
          (t.onmousemove = u),
          Ot.ielt9 && this.options.opacity < 1 && bi(t, this.options.opacity);
      },
      _addTile: function (t, i) {
        var e = this._getTilePos(t),
          n = this._tileCoordsToKey(t),
          s = this.createTile(this._wrapCoords(t), o(this._tileReady, this, t));
        this._initTile(s),
          this.createTile.length < 2 && z(o(this._tileReady, this, t, null, s)),
          Mi(s, e),
          (this._tiles[n] = { el: s, coords: t, current: !0 }),
          i.appendChild(s),
          this.fire("tileloadstart", { tile: s, coords: t });
      },
      _tileReady: function (t, i, e) {
        i && this.fire("tileerror", { error: i, tile: e, coords: t });
        var n = this._tileCoordsToKey(t);
        (e = this._tiles[n]) &&
          ((e.loaded = +new Date()),
          this._map._fadeAnimated
            ? (bi(e.el, 0),
              M(this._fadeFrame),
              (this._fadeFrame = z(this._updateOpacity, this)))
            : ((e.active = !0), this._pruneTiles()),
          i ||
            (yi(e.el, "leaflet-tile-loaded"),
            this.fire("tileload", { tile: e.el, coords: t })),
          this._noTilesToLoad() &&
            ((this._loading = !1),
            this.fire("load"),
            Ot.ielt9 || !this._map._fadeAnimated
              ? z(this._pruneTiles, this)
              : setTimeout(o(this._pruneTiles, this), 250)));
      },
      _getTilePos: function (t) {
        return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function (t) {
        var i = new B(
          this._wrapX ? h(t.x, this._wrapX) : t.x,
          this._wrapY ? h(t.y, this._wrapY) : t.y
        );
        return (i.z = t.z), i;
      },
      _pxBoundsToTileRange: function (t) {
        var i = this.getTileSize();
        return new O(
          t.min.unscaleBy(i).floor(),
          t.max.unscaleBy(i).ceil().subtract([1, 1])
        );
      },
      _noTilesToLoad: function () {
        for (var t in this._tiles) if (!this._tiles[t].loaded) return !1;
        return !0;
      },
    });
    function An(t) {
      return new Bn(t);
    }
    var In = Bn.extend({
      options: {
        minZoom: 0,
        maxZoom: 18,
        subdomains: "abc",
        errorTileUrl: "",
        zoomOffset: 0,
        tms: !1,
        zoomReverse: !1,
        detectRetina: !1,
        crossOrigin: !1,
        referrerPolicy: !1,
      },
      initialize: function (t, i) {
        (this._url = t),
          (i = d(this, i)).detectRetina &&
            Ot.retina &&
            i.maxZoom > 0 &&
            ((i.tileSize = Math.floor(i.tileSize / 2)),
            i.zoomReverse
              ? (i.zoomOffset--, i.minZoom++)
              : (i.zoomOffset++, i.maxZoom--),
            (i.minZoom = Math.max(0, i.minZoom))),
          "string" == typeof i.subdomains &&
            (i.subdomains = i.subdomains.split("")),
          this.on("tileunload", this._onTileRemove);
      },
      setUrl: function (t, i) {
        return (
          this._url === t && void 0 === i && (i = !0),
          (this._url = t),
          i || this.redraw(),
          this
        );
      },
      createTile: function (t, i) {
        var e = document.createElement("img");
        return (
          Ri(e, "load", o(this._tileOnLoad, this, i, e)),
          Ri(e, "error", o(this._tileOnError, this, i, e)),
          (this.options.crossOrigin || "" === this.options.crossOrigin) &&
            (e.crossOrigin =
              !0 === this.options.crossOrigin ? "" : this.options.crossOrigin),
          "string" == typeof this.options.referrerPolicy &&
            (e.referrerPolicy = this.options.referrerPolicy),
          (e.alt = ""),
          e.setAttribute("role", "presentation"),
          (e.src = this.getTileUrl(t)),
          e
        );
      },
      getTileUrl: function (t) {
        var i = {
          r: Ot.retina ? "@2x" : "",
          s: this._getSubdomain(t),
          x: t.x,
          y: t.y,
          z: this._getZoomForUrl(),
        };
        if (this._map && !this._map.options.crs.infinite) {
          var n = this._globalTileRange.max.y - t.y;
          this.options.tms && (i.y = n), (i["-y"] = n);
        }
        return f(this._url, e(i, this.options));
      },
      _tileOnLoad: function (t, i) {
        Ot.ielt9 ? setTimeout(o(t, this, null, i), 0) : t(null, i);
      },
      _tileOnError: function (t, i, e) {
        var n = this.options.errorTileUrl;
        n && i.getAttribute("src") !== n && (i.src = n), t(e, i);
      },
      _onTileRemove: function (t) {
        t.tile.onload = null;
      },
      _getZoomForUrl: function () {
        var t = this._tileZoom,
          i = this.options.maxZoom;
        return (
          this.options.zoomReverse && (t = i - t), t + this.options.zoomOffset
        );
      },
      _getSubdomain: function (t) {
        var i = Math.abs(t.x + t.y) % this.options.subdomains.length;
        return this.options.subdomains[i];
      },
      _abortLoading: function () {
        var t, i;
        for (t in this._tiles)
          if (
            this._tiles[t].coords.z !== this._tileZoom &&
            (((i = this._tiles[t].el).onload = u), (i.onerror = u), !i.complete)
          ) {
            i.src = y;
            var e = this._tiles[t].coords;
            pi(i),
              delete this._tiles[t],
              this.fire("tileabort", { tile: i, coords: e });
          }
      },
      _removeTile: function (t) {
        var i = this._tiles[t];
        if (i)
          return (
            i.el.setAttribute("src", y), Bn.prototype._removeTile.call(this, t)
          );
      },
      _tileReady: function (t, i, e) {
        if (this._map && (!e || e.getAttribute("src") !== y))
          return Bn.prototype._tileReady.call(this, t, i, e);
      },
    });
    function On(t, i) {
      return new In(t, i);
    }
    var Rn = In.extend({
      defaultWmsParams: {
        service: "WMS",
        request: "GetMap",
        layers: "",
        styles: "",
        format: "image/jpeg",
        transparent: !1,
        version: "1.1.1",
      },
      options: { crs: null, uppercase: !1 },
      initialize: function (t, i) {
        this._url = t;
        var n = e({}, this.defaultWmsParams);
        for (var o in i) o in this.options || (n[o] = i[o]);
        var s = (i = d(this, i)).detectRetina && Ot.retina ? 2 : 1,
          r = this.getTileSize();
        (n.width = r.x * s), (n.height = r.y * s), (this.wmsParams = n);
      },
      onAdd: function (t) {
        (this._crs = this.options.crs || t.options.crs),
          (this._wmsVersion = parseFloat(this.wmsParams.version));
        var i = this._wmsVersion >= 1.3 ? "crs" : "srs";
        (this.wmsParams[i] = this._crs.code), In.prototype.onAdd.call(this, t);
      },
      getTileUrl: function (t) {
        var i = this._tileCoordsToNwSe(t),
          e = this._crs,
          n = R(e.project(i[0]), e.project(i[1])),
          o = n.min,
          s = n.max,
          r = (
            this._wmsVersion >= 1.3 && this._crs === De
              ? [o.y, o.x, s.y, s.x]
              : [o.x, o.y, s.x, s.y]
          ).join(","),
          a = In.prototype.getTileUrl.call(this, t);
        return (
          a +
          p(this.wmsParams, a, this.options.uppercase) +
          (this.options.uppercase ? "&BBOX=" : "&bbox=") +
          r
        );
      },
      setParams: function (t, i) {
        return e(this.wmsParams, t), i || this.redraw(), this;
      },
    });
    function Nn(t, i) {
      return new Rn(t, i);
    }
    (In.WMS = Rn), (On.wms = Nn);
    var Dn = He.extend({
        options: { padding: 0.1 },
        initialize: function (t) {
          d(this, t), r(this), (this._layers = this._layers || {});
        },
        onAdd: function () {
          this._container ||
            (this._initContainer(),
            this._zoomAnimated && yi(this._container, "leaflet-zoom-animated")),
            this.getPane().appendChild(this._container),
            this._update(),
            this.on("update", this._updatePaths, this);
        },
        onRemove: function () {
          this.off("update", this._updatePaths, this), this._destroyContainer();
        },
        getEvents: function () {
          var t = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd,
          };
          return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
        },
        _onAnimZoom: function (t) {
          this._updateTransform(t.center, t.zoom);
        },
        _onZoom: function () {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        },
        _updateTransform: function (t, i) {
          var e = this._map.getZoomScale(i, this._zoom),
            n = this._map.getSize().multiplyBy(0.5 + this.options.padding),
            o = this._map.project(this._center, i),
            s = n
              .multiplyBy(-e)
              .add(o)
              .subtract(this._map._getNewPixelOrigin(t, i));
          Ot.any3d ? zi(this._container, s, e) : Mi(this._container, s);
        },
        _reset: function () {
          for (var t in (this._update(),
          this._updateTransform(this._center, this._zoom),
          this._layers))
            this._layers[t]._reset();
        },
        _onZoomEnd: function () {
          for (var t in this._layers) this._layers[t]._project();
        },
        _updatePaths: function () {
          for (var t in this._layers) this._layers[t]._update();
        },
        _update: function () {
          var t = this.options.padding,
            i = this._map.getSize(),
            e = this._map.containerPointToLayerPoint(i.multiplyBy(-t)).round();
          (this._bounds = new O(e, e.add(i.multiplyBy(1 + 2 * t)).round())),
            (this._center = this._map.getCenter()),
            (this._zoom = this._map.getZoom());
        },
      }),
      jn = Dn.extend({
        options: { tolerance: 0 },
        getEvents: function () {
          var t = Dn.prototype.getEvents.call(this);
          return (t.viewprereset = this._onViewPreReset), t;
        },
        _onViewPreReset: function () {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function () {
          Dn.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function () {
          var t = (this._container = document.createElement("canvas"));
          Ri(t, "mousemove", this._onMouseMove, this),
            Ri(
              t,
              "click dblclick mousedown mouseup contextmenu",
              this._onClick,
              this
            ),
            Ri(t, "mouseout", this._handleMouseOut, this),
            (t._leaflet_disable_events = !0),
            (this._ctx = t.getContext("2d"));
        },
        _destroyContainer: function () {
          M(this._redrawRequest),
            delete this._ctx,
            pi(this._container),
            Di(this._container),
            delete this._container;
        },
        _updatePaths: function () {
          if (!this._postponeUpdatePaths) {
            for (var t in ((this._redrawBounds = null), this._layers))
              this._layers[t]._update();
            this._redraw();
          }
        },
        _update: function () {
          if (!this._map._animatingZoom || !this._bounds) {
            Dn.prototype._update.call(this);
            var t = this._bounds,
              i = this._container,
              e = t.getSize(),
              n = Ot.retina ? 2 : 1;
            Mi(i, t.min),
              (i.width = n * e.x),
              (i.height = n * e.y),
              (i.style.width = e.x + "px"),
              (i.style.height = e.y + "px"),
              Ot.retina && this._ctx.scale(2, 2),
              this._ctx.translate(-t.min.x, -t.min.y),
              this.fire("update");
          }
        },
        _reset: function () {
          Dn.prototype._reset.call(this),
            this._postponeUpdatePaths &&
              ((this._postponeUpdatePaths = !1), this._updatePaths());
        },
        _initPath: function (t) {
          this._updateDashArray(t), (this._layers[r(t)] = t);
          var i = (t._order = { layer: t, prev: this._drawLast, next: null });
          this._drawLast && (this._drawLast.next = i),
            (this._drawLast = i),
            (this._drawFirst = this._drawFirst || this._drawLast);
        },
        _addPath: function (t) {
          this._requestRedraw(t);
        },
        _removePath: function (t) {
          var i = t._order,
            e = i.next,
            n = i.prev;
          e ? (e.prev = n) : (this._drawLast = n),
            n ? (n.next = e) : (this._drawFirst = e),
            delete t._order,
            delete this._layers[r(t)],
            this._requestRedraw(t);
        },
        _updatePath: function (t) {
          this._extendRedrawBounds(t),
            t._project(),
            t._update(),
            this._requestRedraw(t);
        },
        _updateStyle: function (t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function (t) {
          if ("string" == typeof t.options.dashArray) {
            var i,
              e,
              n = t.options.dashArray.split(/[, ]+/),
              o = [];
            for (e = 0; e < n.length; e++) {
              if (((i = Number(n[e])), isNaN(i))) return;
              o.push(i);
            }
            t.options._dashArray = o;
          } else t.options._dashArray = t.options.dashArray;
        },
        _requestRedraw: function (t) {
          this._map &&
            (this._extendRedrawBounds(t),
            (this._redrawRequest =
              this._redrawRequest || z(this._redraw, this)));
        },
        _extendRedrawBounds: function (t) {
          if (t._pxBounds) {
            var i = (t.options.weight || 0) + 1;
            (this._redrawBounds = this._redrawBounds || new O()),
              this._redrawBounds.extend(t._pxBounds.min.subtract([i, i])),
              this._redrawBounds.extend(t._pxBounds.max.add([i, i]));
          }
        },
        _redraw: function () {
          (this._redrawRequest = null),
            this._redrawBounds &&
              (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()),
            this._clear(),
            this._draw(),
            (this._redrawBounds = null);
        },
        _clear: function () {
          var t = this._redrawBounds;
          if (t) {
            var i = t.getSize();
            this._ctx.clearRect(t.min.x, t.min.y, i.x, i.y);
          } else
            this._ctx.save(),
              this._ctx.setTransform(1, 0, 0, 1, 0, 0),
              this._ctx.clearRect(
                0,
                0,
                this._container.width,
                this._container.height
              ),
              this._ctx.restore();
        },
        _draw: function () {
          var t,
            i = this._redrawBounds;
          if ((this._ctx.save(), i)) {
            var e = i.getSize();
            this._ctx.beginPath(),
              this._ctx.rect(i.min.x, i.min.y, e.x, e.y),
              this._ctx.clip();
          }
          this._drawing = !0;
          for (var n = this._drawFirst; n; n = n.next)
            (t = n.layer),
              (!i || (t._pxBounds && t._pxBounds.intersects(i))) &&
                t._updatePath();
          (this._drawing = !1), this._ctx.restore();
        },
        _updatePoly: function (t, i) {
          if (this._drawing) {
            var e,
              n,
              o,
              s,
              r = t._parts,
              a = r.length,
              h = this._ctx;
            if (a) {
              for (h.beginPath(), e = 0; e < a; e++) {
                for (n = 0, o = r[e].length; n < o; n++)
                  (s = r[e][n]), h[n ? "lineTo" : "moveTo"](s.x, s.y);
                i && h.closePath();
              }
              this._fillStroke(h, t);
            }
          }
        },
        _updateCircle: function (t) {
          if (this._drawing && !t._empty()) {
            var i = t._point,
              e = this._ctx,
              n = Math.max(Math.round(t._radius), 1),
              o = (Math.max(Math.round(t._radiusY), 1) || n) / n;
            1 !== o && (e.save(), e.scale(1, o)),
              e.beginPath(),
              e.arc(i.x, i.y / o, n, 0, 2 * Math.PI, !1),
              1 !== o && e.restore(),
              this._fillStroke(e, t);
          }
        },
        _fillStroke: function (t, i) {
          var e = i.options;
          e.fill &&
            ((t.globalAlpha = e.fillOpacity),
            (t.fillStyle = e.fillColor || e.color),
            t.fill(e.fillRule || "evenodd")),
            e.stroke &&
              0 !== e.weight &&
              (t.setLineDash &&
                t.setLineDash((i.options && i.options._dashArray) || []),
              (t.globalAlpha = e.opacity),
              (t.lineWidth = e.weight),
              (t.strokeStyle = e.color),
              (t.lineCap = e.lineCap),
              (t.lineJoin = e.lineJoin),
              t.stroke());
        },
        _onClick: function (t) {
          for (
            var i,
              e,
              n = this._map.mouseEventToLayerPoint(t),
              o = this._drawFirst;
            o;
            o = o.next
          )
            (i = o.layer).options.interactive &&
              i._containsPoint(n) &&
              (("click" !== t.type && "preclick" !== t.type) ||
                !this._map._draggableMoved(i)) &&
              (e = i);
          this._fireEvent(!!e && [e], t);
        },
        _onMouseMove: function (t) {
          if (
            this._map &&
            !this._map.dragging.moving() &&
            !this._map._animatingZoom
          ) {
            var i = this._map.mouseEventToLayerPoint(t);
            this._handleMouseHover(t, i);
          }
        },
        _handleMouseOut: function (t) {
          var i = this._hoveredLayer;
          i &&
            (xi(this._container, "leaflet-interactive"),
            this._fireEvent([i], t, "mouseout"),
            (this._hoveredLayer = null),
            (this._mouseHoverThrottled = !1));
        },
        _handleMouseHover: function (t, i) {
          if (!this._mouseHoverThrottled) {
            for (var e, n, s = this._drawFirst; s; s = s.next)
              (e = s.layer).options.interactive &&
                e._containsPoint(i) &&
                (n = e);
            n !== this._hoveredLayer &&
              (this._handleMouseOut(t),
              n &&
                (yi(this._container, "leaflet-interactive"),
                this._fireEvent([n], t, "mouseover"),
                (this._hoveredLayer = n))),
              this._fireEvent(!!this._hoveredLayer && [this._hoveredLayer], t),
              (this._mouseHoverThrottled = !0),
              setTimeout(
                o(function () {
                  this._mouseHoverThrottled = !1;
                }, this),
                32
              );
          }
        },
        _fireEvent: function (t, i, e) {
          this._map._fireDOMEvent(i, e || i.type, t);
        },
        _bringToFront: function (t) {
          var i = t._order;
          if (i) {
            var e = i.next,
              n = i.prev;
            e &&
              ((e.prev = n),
              n ? (n.next = e) : e && (this._drawFirst = e),
              (i.prev = this._drawLast),
              (this._drawLast.next = i),
              (i.next = null),
              (this._drawLast = i),
              this._requestRedraw(t));
          }
        },
        _bringToBack: function (t) {
          var i = t._order;
          if (i) {
            var e = i.next,
              n = i.prev;
            n &&
              ((n.next = e),
              e ? (e.prev = n) : n && (this._drawLast = n),
              (i.prev = null),
              (i.next = this._drawFirst),
              (this._drawFirst.prev = i),
              (this._drawFirst = i),
              this._requestRedraw(t));
          }
        },
      });
    function Hn(t) {
      return Ot.canvas ? new jn(t) : null;
    }
    var Wn = (function () {
        try {
          return (
            document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
            function (t) {
              return document.createElement("<lvml:" + t + ' class="lvml">');
            }
          );
        } catch (t) {}
        return function (t) {
          return document.createElement(
            "<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">'
          );
        };
      })(),
      Fn = {
        _initContainer: function () {
          this._container = di("div", "leaflet-vml-container");
        },
        _update: function () {
          this._map._animatingZoom ||
            (Dn.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function (t) {
          var i = (t._container = Wn("shape"));
          yi(i, "leaflet-vml-shape " + (this.options.className || "")),
            (i.coordsize = "1 1"),
            (t._path = Wn("path")),
            i.appendChild(t._path),
            this._updateStyle(t),
            (this._layers[r(t)] = t);
        },
        _addPath: function (t) {
          var i = t._container;
          this._container.appendChild(i),
            t.options.interactive && t.addInteractiveTarget(i);
        },
        _removePath: function (t) {
          var i = t._container;
          pi(i), t.removeInteractiveTarget(i), delete this._layers[r(t)];
        },
        _updateStyle: function (t) {
          var i = t._stroke,
            e = t._fill,
            n = t.options,
            o = t._container;
          (o.stroked = !!n.stroke),
            (o.filled = !!n.fill),
            n.stroke
              ? (i || (i = t._stroke = Wn("stroke")),
                o.appendChild(i),
                (i.weight = n.weight + "px"),
                (i.color = n.color),
                (i.opacity = n.opacity),
                n.dashArray
                  ? (i.dashStyle = g(n.dashArray)
                      ? n.dashArray.join(" ")
                      : n.dashArray.replace(/( *, *)/g, " "))
                  : (i.dashStyle = ""),
                (i.endcap = n.lineCap.replace("butt", "flat")),
                (i.joinstyle = n.lineJoin))
              : i && (o.removeChild(i), (t._stroke = null)),
            n.fill
              ? (e || (e = t._fill = Wn("fill")),
                o.appendChild(e),
                (e.color = n.fillColor || n.color),
                (e.opacity = n.fillOpacity))
              : e && (o.removeChild(e), (t._fill = null));
        },
        _updateCircle: function (t) {
          var i = t._point.round(),
            e = Math.round(t._radius),
            n = Math.round(t._radiusY || e);
          this._setPath(
            t,
            t._empty()
              ? "M0 0"
              : "AL " + i.x + "," + i.y + " " + e + "," + n + " 0,23592600"
          );
        },
        _setPath: function (t, i) {
          t._path.v = i;
        },
        _bringToFront: function (t) {
          fi(t._container);
        },
        _bringToBack: function (t) {
          gi(t._container);
        },
      },
      Un = Ot.vml ? Wn : J,
      Vn = Dn.extend({
        _initContainer: function () {
          (this._container = Un("svg")),
            this._container.setAttribute("pointer-events", "none"),
            (this._rootGroup = Un("g")),
            this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function () {
          pi(this._container),
            Di(this._container),
            delete this._container,
            delete this._rootGroup,
            delete this._svgSize;
        },
        _update: function () {
          if (!this._map._animatingZoom || !this._bounds) {
            Dn.prototype._update.call(this);
            var t = this._bounds,
              i = t.getSize(),
              e = this._container;
            (this._svgSize && this._svgSize.equals(i)) ||
              ((this._svgSize = i),
              e.setAttribute("width", i.x),
              e.setAttribute("height", i.y)),
              Mi(e, t.min),
              e.setAttribute("viewBox", [t.min.x, t.min.y, i.x, i.y].join(" ")),
              this.fire("update");
          }
        },
        _initPath: function (t) {
          var i = (t._path = Un("path"));
          t.options.className && yi(i, t.options.className),
            t.options.interactive && yi(i, "leaflet-interactive"),
            this._updateStyle(t),
            (this._layers[r(t)] = t);
        },
        _addPath: function (t) {
          this._rootGroup || this._initContainer(),
            this._rootGroup.appendChild(t._path),
            t.addInteractiveTarget(t._path);
        },
        _removePath: function (t) {
          pi(t._path),
            t.removeInteractiveTarget(t._path),
            delete this._layers[r(t)];
        },
        _updatePath: function (t) {
          t._project(), t._update();
        },
        _updateStyle: function (t) {
          var i = t._path,
            e = t.options;
          i &&
            (e.stroke
              ? (i.setAttribute("stroke", e.color),
                i.setAttribute("stroke-opacity", e.opacity),
                i.setAttribute("stroke-width", e.weight),
                i.setAttribute("stroke-linecap", e.lineCap),
                i.setAttribute("stroke-linejoin", e.lineJoin),
                e.dashArray
                  ? i.setAttribute("stroke-dasharray", e.dashArray)
                  : i.removeAttribute("stroke-dasharray"),
                e.dashOffset
                  ? i.setAttribute("stroke-dashoffset", e.dashOffset)
                  : i.removeAttribute("stroke-dashoffset"))
              : i.setAttribute("stroke", "none"),
            e.fill
              ? (i.setAttribute("fill", e.fillColor || e.color),
                i.setAttribute("fill-opacity", e.fillOpacity),
                i.setAttribute("fill-rule", e.fillRule || "evenodd"))
              : i.setAttribute("fill", "none"));
        },
        _updatePoly: function (t, i) {
          this._setPath(t, $(t._parts, i));
        },
        _updateCircle: function (t) {
          var i = t._point,
            e = Math.max(Math.round(t._radius), 1),
            n =
              "a" +
              e +
              "," +
              (Math.max(Math.round(t._radiusY), 1) || e) +
              " 0 1,0 ",
            o = t._empty()
              ? "M0 0"
              : "M" +
                (i.x - e) +
                "," +
                i.y +
                n +
                2 * e +
                ",0 " +
                n +
                2 * -e +
                ",0 ";
          this._setPath(t, o);
        },
        _setPath: function (t, i) {
          t._path.setAttribute("d", i);
        },
        _bringToFront: function (t) {
          fi(t._path);
        },
        _bringToBack: function (t) {
          gi(t._path);
        },
      });
    function qn(t) {
      return Ot.svg || Ot.vml ? new Vn(t) : null;
    }
    Ot.vml && Vn.include(Fn),
      ie.include({
        getRenderer: function (t) {
          var i =
            t.options.renderer ||
            this._getPaneRenderer(t.options.pane) ||
            this.options.renderer ||
            this._renderer;
          return (
            i || (i = this._renderer = this._createRenderer()),
            this.hasLayer(i) || this.addLayer(i),
            i
          );
        },
        _getPaneRenderer: function (t) {
          if ("overlayPane" === t || void 0 === t) return !1;
          var i = this._paneRenderers[t];
          return (
            void 0 === i &&
              ((i = this._createRenderer({ pane: t })),
              (this._paneRenderers[t] = i)),
            i
          );
        },
        _createRenderer: function (t) {
          return (this.options.preferCanvas && Hn(t)) || qn(t);
        },
      });
    var Gn = rn.extend({
      initialize: function (t, i) {
        rn.prototype.initialize.call(this, this._boundsToLatLngs(t), i);
      },
      setBounds: function (t) {
        return this.setLatLngs(this._boundsToLatLngs(t));
      },
      _boundsToLatLngs: function (t) {
        return [
          (t = D(t)).getSouthWest(),
          t.getNorthWest(),
          t.getNorthEast(),
          t.getSouthEast(),
        ];
      },
    });
    function Kn(t, i) {
      return new Gn(t, i);
    }
    (Vn.create = Un),
      (Vn.pointsToPath = $),
      (hn.geometryToLayer = un),
      (hn.coordsToLatLng = cn),
      (hn.coordsToLatLngs = _n),
      (hn.latLngToCoords = dn),
      (hn.latLngsToCoords = pn),
      (hn.getFeature = mn),
      (hn.asFeature = fn),
      ie.mergeOptions({ boxZoom: !0 });
    var Yn = pe.extend({
      initialize: function (t) {
        (this._map = t),
          (this._container = t._container),
          (this._pane = t._panes.overlayPane),
          (this._resetStateTimeout = 0),
          t.on("unload", this._destroy, this);
      },
      addHooks: function () {
        Ri(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function () {
        Di(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function () {
        return this._moved;
      },
      _destroy: function () {
        pi(this._pane), delete this._pane;
      },
      _resetState: function () {
        (this._resetStateTimeout = 0), (this._moved = !1);
      },
      _clearDeferredResetState: function () {
        0 !== this._resetStateTimeout &&
          (clearTimeout(this._resetStateTimeout),
          (this._resetStateTimeout = 0));
      },
      _onMouseDown: function (t) {
        if (!t.shiftKey || (1 !== t.which && 1 !== t.button)) return !1;
        this._clearDeferredResetState(),
          this._resetState(),
          ni(),
          Si(),
          (this._startPoint = this._map.mouseEventToContainerPoint(t)),
          Ri(
            document,
            {
              contextmenu: Ki,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown,
            },
            this
          );
      },
      _onMouseMove: function (t) {
        this._moved ||
          ((this._moved = !0),
          (this._box = di("div", "leaflet-zoom-box", this._container)),
          yi(this._container, "leaflet-crosshair"),
          this._map.fire("boxzoomstart")),
          (this._point = this._map.mouseEventToContainerPoint(t));
        var i = new O(this._point, this._startPoint),
          e = i.getSize();
        Mi(this._box, i.min),
          (this._box.style.width = e.x + "px"),
          (this._box.style.height = e.y + "px");
      },
      _finish: function () {
        this._moved &&
          (pi(this._box), xi(this._container, "leaflet-crosshair")),
          oi(),
          ki(),
          Di(
            document,
            {
              contextmenu: Ki,
              mousemove: this._onMouseMove,
              mouseup: this._onMouseUp,
              keydown: this._onKeyDown,
            },
            this
          );
      },
      _onMouseUp: function (t) {
        if (
          (1 === t.which || 1 === t.button) &&
          (this._finish(), this._moved)
        ) {
          this._clearDeferredResetState(),
            (this._resetStateTimeout = setTimeout(
              o(this._resetState, this),
              0
            ));
          var i = new N(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
          );
          this._map.fitBounds(i).fire("boxzoomend", { boxZoomBounds: i });
        }
      },
      _onKeyDown: function (t) {
        27 === t.keyCode &&
          (this._finish(), this._clearDeferredResetState(), this._resetState());
      },
    });
    ie.addInitHook("addHandler", "boxZoom", Yn),
      ie.mergeOptions({ doubleClickZoom: !0 });
    var Xn = pe.extend({
      addHooks: function () {
        this._map.on("dblclick", this._onDoubleClick, this);
      },
      removeHooks: function () {
        this._map.off("dblclick", this._onDoubleClick, this);
      },
      _onDoubleClick: function (t) {
        var i = this._map,
          e = i.getZoom(),
          n = i.options.zoomDelta,
          o = t.originalEvent.shiftKey ? e - n : e + n;
        "center" === i.options.doubleClickZoom
          ? i.setZoom(o)
          : i.setZoomAround(t.containerPoint, o);
      },
    });
    ie.addInitHook("addHandler", "doubleClickZoom", Xn),
      ie.mergeOptions({
        dragging: !0,
        inertia: !0,
        inertiaDeceleration: 3400,
        inertiaMaxSpeed: 1 / 0,
        easeLinearity: 0.2,
        worldCopyJump: !1,
        maxBoundsViscosity: 0,
      });
    var Jn = pe.extend({
      addHooks: function () {
        if (!this._draggable) {
          var t = this._map;
          (this._draggable = new ve(t._mapPane, t._container)),
            this._draggable.on(
              {
                dragstart: this._onDragStart,
                drag: this._onDrag,
                dragend: this._onDragEnd,
              },
              this
            ),
            this._draggable.on("predrag", this._onPreDragLimit, this),
            t.options.worldCopyJump &&
              (this._draggable.on("predrag", this._onPreDragWrap, this),
              t.on("zoomend", this._onZoomEnd, this),
              t.whenReady(this._onZoomEnd, this));
        }
        yi(this._map._container, "leaflet-grab leaflet-touch-drag"),
          this._draggable.enable(),
          (this._positions = []),
          (this._times = []);
      },
      removeHooks: function () {
        xi(this._map._container, "leaflet-grab"),
          xi(this._map._container, "leaflet-touch-drag"),
          this._draggable.disable();
      },
      moved: function () {
        return this._draggable && this._draggable._moved;
      },
      moving: function () {
        return this._draggable && this._draggable._moving;
      },
      _onDragStart: function () {
        var t = this._map;
        if (
          (t._stop(),
          this._map.options.maxBounds && this._map.options.maxBoundsViscosity)
        ) {
          var i = D(this._map.options.maxBounds);
          (this._offsetLimit = R(
            this._map.latLngToContainerPoint(i.getNorthWest()).multiplyBy(-1),
            this._map
              .latLngToContainerPoint(i.getSouthEast())
              .multiplyBy(-1)
              .add(this._map.getSize())
          )),
            (this._viscosity = Math.min(
              1,
              Math.max(0, this._map.options.maxBoundsViscosity)
            ));
        } else this._offsetLimit = null;
        t.fire("movestart").fire("dragstart"),
          t.options.inertia && ((this._positions = []), (this._times = []));
      },
      _onDrag: function (t) {
        if (this._map.options.inertia) {
          var i = (this._lastTime = +new Date()),
            e = (this._lastPos =
              this._draggable._absPos || this._draggable._newPos);
          this._positions.push(e), this._times.push(i), this._prunePositions(i);
        }
        this._map.fire("move", t).fire("drag", t);
      },
      _prunePositions: function (t) {
        for (; this._positions.length > 1 && t - this._times[0] > 50; )
          this._positions.shift(), this._times.shift();
      },
      _onZoomEnd: function () {
        var t = this._map.getSize().divideBy(2),
          i = this._map.latLngToLayerPoint([0, 0]);
        (this._initialWorldOffset = i.subtract(t).x),
          (this._worldWidth = this._map.getPixelWorldBounds().getSize().x);
      },
      _viscousLimit: function (t, i) {
        return t - (t - i) * this._viscosity;
      },
      _onPreDragLimit: function () {
        if (this._viscosity && this._offsetLimit) {
          var t = this._draggable._newPos.subtract(this._draggable._startPos),
            i = this._offsetLimit;
          t.x < i.min.x && (t.x = this._viscousLimit(t.x, i.min.x)),
            t.y < i.min.y && (t.y = this._viscousLimit(t.y, i.min.y)),
            t.x > i.max.x && (t.x = this._viscousLimit(t.x, i.max.x)),
            t.y > i.max.y && (t.y = this._viscousLimit(t.y, i.max.y)),
            (this._draggable._newPos = this._draggable._startPos.add(t));
        }
      },
      _onPreDragWrap: function () {
        var t = this._worldWidth,
          i = Math.round(t / 2),
          e = this._initialWorldOffset,
          n = this._draggable._newPos.x,
          o = ((n - i + e) % t) + i - e,
          s = ((n + i + e) % t) - i - e,
          r = Math.abs(o + e) < Math.abs(s + e) ? o : s;
        (this._draggable._absPos = this._draggable._newPos.clone()),
          (this._draggable._newPos.x = r);
      },
      _onDragEnd: function (t) {
        var i = this._map,
          e = i.options,
          n = !e.inertia || t.noInertia || this._times.length < 2;
        if ((i.fire("dragend", t), n)) i.fire("moveend");
        else {
          this._prunePositions(+new Date());
          var o = this._lastPos.subtract(this._positions[0]),
            s = (this._lastTime - this._times[0]) / 1e3,
            r = e.easeLinearity,
            a = o.multiplyBy(r / s),
            h = a.distanceTo([0, 0]),
            u = Math.min(e.inertiaMaxSpeed, h),
            l = a.multiplyBy(u / h),
            c = u / (e.inertiaDeceleration * r),
            _ = l.multiplyBy(-c / 2).round();
          _.x || _.y
            ? ((_ = i._limitOffset(_, i.options.maxBounds)),
              z(function () {
                i.panBy(_, {
                  duration: c,
                  easeLinearity: r,
                  noMoveStart: !0,
                  animate: !0,
                });
              }))
            : i.fire("moveend");
        }
      },
    });
    ie.addInitHook("addHandler", "dragging", Jn),
      ie.mergeOptions({ keyboard: !0, keyboardPanDelta: 80 });
    var $n = pe.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173],
      },
      initialize: function (t) {
        (this._map = t),
          this._setPanDelta(t.options.keyboardPanDelta),
          this._setZoomDelta(t.options.zoomDelta);
      },
      addHooks: function () {
        var t = this._map._container;
        t.tabIndex <= 0 && (t.tabIndex = "0"),
          Ri(
            t,
            {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown,
            },
            this
          ),
          this._map.on(
            { focus: this._addHooks, blur: this._removeHooks },
            this
          );
      },
      removeHooks: function () {
        this._removeHooks(),
          Di(
            this._map._container,
            {
              focus: this._onFocus,
              blur: this._onBlur,
              mousedown: this._onMouseDown,
            },
            this
          ),
          this._map.off(
            { focus: this._addHooks, blur: this._removeHooks },
            this
          );
      },
      _onMouseDown: function () {
        if (!this._focused) {
          var t = document.body,
            i = document.documentElement,
            e = t.scrollTop || i.scrollTop,
            n = t.scrollLeft || i.scrollLeft;
          this._map._container.focus(), window.scrollTo(n, e);
        }
      },
      _onFocus: function () {
        (this._focused = !0), this._map.fire("focus");
      },
      _onBlur: function () {
        (this._focused = !1), this._map.fire("blur");
      },
      _setPanDelta: function (t) {
        var i,
          e,
          n = (this._panKeys = {}),
          o = this.keyCodes;
        for (i = 0, e = o.left.length; i < e; i++) n[o.left[i]] = [-1 * t, 0];
        for (i = 0, e = o.right.length; i < e; i++) n[o.right[i]] = [t, 0];
        for (i = 0, e = o.down.length; i < e; i++) n[o.down[i]] = [0, t];
        for (i = 0, e = o.up.length; i < e; i++) n[o.up[i]] = [0, -1 * t];
      },
      _setZoomDelta: function (t) {
        var i,
          e,
          n = (this._zoomKeys = {}),
          o = this.keyCodes;
        for (i = 0, e = o.zoomIn.length; i < e; i++) n[o.zoomIn[i]] = t;
        for (i = 0, e = o.zoomOut.length; i < e; i++) n[o.zoomOut[i]] = -t;
      },
      _addHooks: function () {
        Ri(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function () {
        Di(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function (t) {
        if (!(t.altKey || t.ctrlKey || t.metaKey)) {
          var i,
            e = t.keyCode,
            n = this._map;
          if (e in this._panKeys)
            (n._panAnim && n._panAnim._inProgress) ||
              ((i = this._panKeys[e]),
              t.shiftKey && (i = I(i).multiplyBy(3)),
              n.panBy(i),
              n.options.maxBounds && n.panInsideBounds(n.options.maxBounds));
          else if (e in this._zoomKeys)
            n.setZoom(n.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
          else {
            if (27 !== e || !n._popup || !n._popup.options.closeOnEscapeKey)
              return;
            n.closePopup();
          }
          Ki(t);
        }
      },
    });
    ie.addInitHook("addHandler", "keyboard", $n),
      ie.mergeOptions({
        scrollWheelZoom: !0,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
      });
    var Qn = pe.extend({
      addHooks: function () {
        Ri(this._map._container, "wheel", this._onWheelScroll, this),
          (this._delta = 0);
      },
      removeHooks: function () {
        Di(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function (t) {
        var i = Ji(t),
          e = this._map.options.wheelDebounceTime;
        (this._delta += i),
          (this._lastMousePos = this._map.mouseEventToContainerPoint(t)),
          this._startTime || (this._startTime = +new Date());
        var n = Math.max(e - (+new Date() - this._startTime), 0);
        clearTimeout(this._timer),
          (this._timer = setTimeout(o(this._performZoom, this), n)),
          Ki(t);
      },
      _performZoom: function () {
        var t = this._map,
          i = t.getZoom(),
          e = this._map.options.zoomSnap || 0;
        t._stop();
        var n = this._delta / (4 * this._map.options.wheelPxPerZoomLevel),
          o = (4 * Math.log(2 / (1 + Math.exp(-Math.abs(n))))) / Math.LN2,
          s = e ? Math.ceil(o / e) * e : o,
          r = t._limitZoom(i + (this._delta > 0 ? s : -s)) - i;
        (this._delta = 0),
          (this._startTime = null),
          r &&
            ("center" === t.options.scrollWheelZoom
              ? t.setZoom(i + r)
              : t.setZoomAround(this._lastMousePos, i + r));
      },
    });
    ie.addInitHook("addHandler", "scrollWheelZoom", Qn);
    var to = 600;
    ie.mergeOptions({
      tapHold: Ot.touchNative && Ot.safari && Ot.mobile,
      tapTolerance: 15,
    });
    var io = pe.extend({
      addHooks: function () {
        Ri(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function () {
        Di(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function (t) {
        if ((clearTimeout(this._holdTimeout), 1 === t.touches.length)) {
          var i = t.touches[0];
          (this._startPos = this._newPos = new B(i.clientX, i.clientY)),
            (this._holdTimeout = setTimeout(
              o(function () {
                this._cancel(),
                  this._isTapValid() &&
                    (Ri(document, "touchend", Gi),
                    Ri(
                      document,
                      "touchend touchcancel",
                      this._cancelClickPrevent
                    ),
                    this._simulateEvent("contextmenu", i));
              }, this),
              to
            )),
            Ri(
              document,
              "touchend touchcancel contextmenu",
              this._cancel,
              this
            ),
            Ri(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function t() {
        Di(document, "touchend", Gi), Di(document, "touchend touchcancel", t);
      },
      _cancel: function () {
        clearTimeout(this._holdTimeout),
          Di(document, "touchend touchcancel contextmenu", this._cancel, this),
          Di(document, "touchmove", this._onMove, this);
      },
      _onMove: function (t) {
        var i = t.touches[0];
        this._newPos = new B(i.clientX, i.clientY);
      },
      _isTapValid: function () {
        return (
          this._newPos.distanceTo(this._startPos) <=
          this._map.options.tapTolerance
        );
      },
      _simulateEvent: function (t, i) {
        var e = new MouseEvent(t, {
          bubbles: !0,
          cancelable: !0,
          view: window,
          screenX: i.screenX,
          screenY: i.screenY,
          clientX: i.clientX,
          clientY: i.clientY,
        });
        (e._simulated = !0), i.target.dispatchEvent(e);
      },
    });
    ie.addInitHook("addHandler", "tapHold", io),
      ie.mergeOptions({ touchZoom: Ot.touch, bounceAtZoomLimits: !0 });
    var eo = pe.extend({
      addHooks: function () {
        yi(this._map._container, "leaflet-touch-zoom"),
          Ri(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function () {
        xi(this._map._container, "leaflet-touch-zoom"),
          Di(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function (t) {
        var i = this._map;
        if (
          t.touches &&
          2 === t.touches.length &&
          !i._animatingZoom &&
          !this._zooming
        ) {
          var e = i.mouseEventToContainerPoint(t.touches[0]),
            n = i.mouseEventToContainerPoint(t.touches[1]);
          (this._centerPoint = i.getSize()._divideBy(2)),
            (this._startLatLng = i.containerPointToLatLng(this._centerPoint)),
            "center" !== i.options.touchZoom &&
              (this._pinchStartLatLng = i.containerPointToLatLng(
                e.add(n)._divideBy(2)
              )),
            (this._startDist = e.distanceTo(n)),
            (this._startZoom = i.getZoom()),
            (this._moved = !1),
            (this._zooming = !0),
            i._stop(),
            Ri(document, "touchmove", this._onTouchMove, this),
            Ri(document, "touchend touchcancel", this._onTouchEnd, this),
            Gi(t);
        }
      },
      _onTouchMove: function (t) {
        if (t.touches && 2 === t.touches.length && this._zooming) {
          var i = this._map,
            e = i.mouseEventToContainerPoint(t.touches[0]),
            n = i.mouseEventToContainerPoint(t.touches[1]),
            s = e.distanceTo(n) / this._startDist;
          if (
            ((this._zoom = i.getScaleZoom(s, this._startZoom)),
            !i.options.bounceAtZoomLimits &&
              ((this._zoom < i.getMinZoom() && s < 1) ||
                (this._zoom > i.getMaxZoom() && s > 1)) &&
              (this._zoom = i._limitZoom(this._zoom)),
            "center" === i.options.touchZoom)
          ) {
            if (((this._center = this._startLatLng), 1 === s)) return;
          } else {
            var r = e._add(n)._divideBy(2)._subtract(this._centerPoint);
            if (1 === s && 0 === r.x && 0 === r.y) return;
            this._center = i.unproject(
              i.project(this._pinchStartLatLng, this._zoom).subtract(r),
              this._zoom
            );
          }
          this._moved || (i._moveStart(!0, !1), (this._moved = !0)),
            M(this._animRequest);
          var a = o(i._move, i, this._center, this._zoom, {
            pinch: !0,
            round: !1,
          });
          (this._animRequest = z(a, this, !0)), Gi(t);
        }
      },
      _onTouchEnd: function () {
        this._moved && this._zooming
          ? ((this._zooming = !1),
            M(this._animRequest),
            Di(document, "touchmove", this._onTouchMove, this),
            Di(document, "touchend touchcancel", this._onTouchEnd, this),
            this._map.options.zoomAnimation
              ? this._map._animateZoom(
                  this._center,
                  this._map._limitZoom(this._zoom),
                  !0,
                  this._map.options.zoomSnap
                )
              : this._map._resetView(
                  this._center,
                  this._map._limitZoom(this._zoom)
                ))
          : (this._zooming = !1);
      },
    });
    ie.addInitHook("addHandler", "touchZoom", eo),
      (ie.BoxZoom = Yn),
      (ie.DoubleClickZoom = Xn),
      (ie.Drag = Jn),
      (ie.Keyboard = $n),
      (ie.ScrollWheelZoom = Qn),
      (ie.TapHold = io),
      (ie.TouchZoom = eo),
      (t.Bounds = O),
      (t.Browser = Ot),
      (t.CRS = F),
      (t.Canvas = jn),
      (t.Circle = en),
      (t.CircleMarker = Qe),
      (t.Class = Z),
      (t.Control = ne),
      (t.DivIcon = kn),
      (t.DivOverlay = zn),
      (t.DomEvent = Qi),
      (t.DomUtil = Oi),
      (t.Draggable = ve),
      (t.Evented = E),
      (t.FeatureGroup = Ue),
      (t.GeoJSON = hn),
      (t.GridLayer = Bn),
      (t.Handler = pe),
      (t.Icon = qe),
      (t.ImageOverlay = xn),
      (t.LatLng = j),
      (t.LatLngBounds = N),
      (t.Layer = He),
      (t.LayerGroup = We),
      (t.LineUtil = Ee),
      (t.Map = ie),
      (t.Marker = Xe),
      (t.Mixin = fe),
      (t.Path = $e),
      (t.Point = B),
      (t.PolyUtil = Ae),
      (t.Polygon = rn),
      (t.Polyline = on),
      (t.Popup = Mn),
      (t.PosAnimation = te),
      (t.Projection = Re),
      (t.Rectangle = Gn),
      (t.Renderer = Dn),
      (t.SVG = Vn),
      (t.SVGOverlay = Ln),
      (t.TileLayer = In),
      (t.Tooltip = Zn),
      (t.Transformation = G),
      (t.Util = C),
      (t.VideoOverlay = Pn),
      (t.bind = o),
      (t.bounds = R),
      (t.canvas = Hn),
      (t.circle = nn),
      (t.circleMarker = tn),
      (t.control = oe),
      (t.divIcon = En),
      (t.extend = e),
      (t.featureGroup = Ve),
      (t.geoJSON = vn),
      (t.geoJson = yn),
      (t.gridLayer = An),
      (t.icon = Ge),
      (t.imageOverlay = wn),
      (t.latLng = H),
      (t.latLngBounds = D),
      (t.layerGroup = Fe),
      (t.map = ee),
      (t.marker = Je),
      (t.point = I),
      (t.polygon = an),
      (t.polyline = sn),
      (t.popup = Cn),
      (t.rectangle = Kn),
      (t.setOptions = d),
      (t.stamp = r),
      (t.svg = qn),
      (t.svgOverlay = Tn),
      (t.tileLayer = On),
      (t.tooltip = Sn),
      (t.transformation = K),
      (t.version = i),
      (t.videoOverlay = bn);
    var no = window.L;
    (t.noConflict = function () {
      return (window.L = no), this;
    }),
      (window.L = t);
  })(i);
});
export { e as __moduleExports, e as default };
