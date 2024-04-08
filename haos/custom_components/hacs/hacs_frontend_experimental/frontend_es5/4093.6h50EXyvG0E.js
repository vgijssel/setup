/*! For license information please see 4093.6h50EXyvG0E.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [4093],
  {
    64093: function (i, t, e) {
      e.r(t),
        e.d(t, {
          FlowLayout: function () {
            return z;
          },
          flow: function () {
            return f;
          },
        });
      var s = e(93359),
        h = e(68308),
        n = e(34541),
        a = e(47838),
        r = e(69205),
        o = e(40039),
        l = e(71650),
        _ = e(33368),
        c = e(46097),
        u =
          (e(85717),
          e(37313),
          e(51358),
          e(96043),
          e(46798),
          e(5239),
          e(98490),
          e(78399),
          e(56086),
          e(47884),
          e(81912),
          e(64584),
          e(41483),
          e(12367),
          e(9454),
          e(9849),
          e(50289),
          e(94167),
          e(65974),
          e(76843),
          (function () {
            function i(t) {
              (0, l.Z)(this, i),
                (this._map = new Map()),
                (this._roundAverageSize = !1),
                (this.totalSize = 0),
                !0 === (null == t ? void 0 : t.roundAverageSize) &&
                  (this._roundAverageSize = !0);
            }
            return (
              (0, _.Z)(i, [
                {
                  key: "set",
                  value: function (i, t) {
                    var e = this._map.get(i) || 0;
                    this._map.set(i, t), (this.totalSize += t - e);
                  },
                },
                {
                  key: "averageSize",
                  get: function () {
                    if (this._map.size > 0) {
                      var i = this.totalSize / this._map.size;
                      return this._roundAverageSize ? Math.round(i) : i;
                    }
                    return 0;
                  },
                },
                {
                  key: "getSize",
                  value: function (i) {
                    return this._map.get(i);
                  },
                },
                {
                  key: "clear",
                  value: function () {
                    this._map.clear(), (this.totalSize = 0);
                  },
                },
              ]),
              i
            );
          })()),
        g = e(15723),
        f = function (i) {
          return Object.assign({ type: z }, i);
        };
      function v(i) {
        return "horizontal" === i ? "marginLeft" : "marginTop";
      }
      function m(i) {
        return "horizontal" === i ? "marginRight" : "marginBottom";
      }
      function d(i, t) {
        var e = [i, t].sort();
        return e[1] <= 0
          ? Math.min.apply(Math, (0, c.Z)(e))
          : e[0] >= 0
          ? Math.max.apply(Math, (0, c.Z)(e))
          : e[0] + e[1];
      }
      var y = (function () {
          function i() {
            (0, l.Z)(this, i),
              (this._childSizeCache = new u()),
              (this._marginSizeCache = new u()),
              (this._metricsCache = new Map());
          }
          return (
            (0, _.Z)(i, [
              {
                key: "update",
                value: function (i, t) {
                  var e = this,
                    s = new Set();
                  Object.keys(i).forEach(function (h) {
                    var n = Number(h);
                    e._metricsCache.set(n, i[n]),
                      e._childSizeCache.set(n, i[n][(0, g.qF)(t)]),
                      s.add(n),
                      s.add(n + 1);
                  });
                  var h,
                    n = (0, o.Z)(s);
                  try {
                    for (n.s(); !(h = n.n()).done; ) {
                      var a,
                        r,
                        l = h.value,
                        _ =
                          (null === (a = this._metricsCache.get(l)) ||
                          void 0 === a
                            ? void 0
                            : a[v(t)]) || 0,
                        c =
                          (null === (r = this._metricsCache.get(l - 1)) ||
                          void 0 === r
                            ? void 0
                            : r[m(t)]) || 0;
                      this._marginSizeCache.set(l, d(_, c));
                    }
                  } catch (u) {
                    n.e(u);
                  } finally {
                    n.f();
                  }
                },
              },
              {
                key: "averageChildSize",
                get: function () {
                  return this._childSizeCache.averageSize;
                },
              },
              {
                key: "totalChildSize",
                get: function () {
                  return this._childSizeCache.totalSize;
                },
              },
              {
                key: "averageMarginSize",
                get: function () {
                  return this._marginSizeCache.averageSize;
                },
              },
              {
                key: "totalMarginSize",
                get: function () {
                  return this._marginSizeCache.totalSize;
                },
              },
              {
                key: "getLeadingMarginValue",
                value: function (i, t) {
                  var e;
                  return (
                    (null === (e = this._metricsCache.get(i)) || void 0 === e
                      ? void 0
                      : e[v(t)]) || 0
                  );
                },
              },
              {
                key: "getChildSize",
                value: function (i) {
                  return this._childSizeCache.getSize(i);
                },
              },
              {
                key: "getMarginSize",
                value: function (i) {
                  return this._marginSizeCache.getSize(i);
                },
              },
              {
                key: "clear",
                value: function () {
                  this._childSizeCache.clear(),
                    this._marginSizeCache.clear(),
                    this._metricsCache.clear();
                },
              },
            ]),
            i
          );
        })(),
        z = (function (i) {
          function t() {
            var i;
            return (
              (0, l.Z)(this, t),
              ((i = (0, h.Z)(this, t, arguments))._itemSize = {
                width: 100,
                height: 100,
              }),
              (i._physicalItems = new Map()),
              (i._newPhysicalItems = new Map()),
              (i._metricsCache = new y()),
              (i._anchorIdx = null),
              (i._anchorPos = null),
              (i._stable = !0),
              (i._measureChildren = !0),
              (i._estimate = !0),
              i
            );
          }
          return (
            (0, r.Z)(t, i),
            (0, _.Z)(t, [
              {
                key: "measureChildren",
                get: function () {
                  return this._measureChildren;
                },
              },
              {
                key: "updateItemSizes",
                value: function (i) {
                  this._metricsCache.update(i, this.direction),
                    this._scheduleReflow();
                },
              },
              {
                key: "_getPhysicalItem",
                value: function (i) {
                  var t;
                  return null !== (t = this._newPhysicalItems.get(i)) &&
                    void 0 !== t
                    ? t
                    : this._physicalItems.get(i);
                },
              },
              {
                key: "_getSize",
                value: function (i) {
                  return (
                    this._getPhysicalItem(i) &&
                    this._metricsCache.getChildSize(i)
                  );
                },
              },
              {
                key: "_getAverageSize",
                value: function () {
                  return (
                    this._metricsCache.averageChildSize ||
                    this._itemSize[this._sizeDim]
                  );
                },
              },
              {
                key: "_estimatePosition",
                value: function (i) {
                  var t = this._metricsCache;
                  if (-1 === this._first || -1 === this._last)
                    return (
                      t.averageMarginSize +
                      i * (t.averageMarginSize + this._getAverageSize())
                    );
                  if (i < this._first) {
                    var e = this._first - i;
                    return (
                      this._getPhysicalItem(this._first).pos -
                      (t.getMarginSize(this._first - 1) ||
                        t.averageMarginSize) -
                      (e * t.averageChildSize + (e - 1) * t.averageMarginSize)
                    );
                  }
                  var s = i - this._last;
                  return (
                    this._getPhysicalItem(this._last).pos +
                    (t.getChildSize(this._last) || t.averageChildSize) +
                    (t.getMarginSize(this._last) || t.averageMarginSize) +
                    s * (t.averageChildSize + t.averageMarginSize)
                  );
                },
              },
              {
                key: "_getPosition",
                value: function (i) {
                  var t,
                    e = this._getPhysicalItem(i),
                    s = this._metricsCache.averageMarginSize;
                  return 0 === i
                    ? null !== (t = this._metricsCache.getMarginSize(0)) &&
                      void 0 !== t
                      ? t
                      : s
                    : e
                    ? e.pos
                    : this._estimatePosition(i);
                },
              },
              {
                key: "_calculateAnchor",
                value: function (i, t) {
                  return i <= 0
                    ? 0
                    : t > this._scrollSize - this._viewDim1
                    ? this.items.length - 1
                    : Math.max(
                        0,
                        Math.min(
                          this.items.length - 1,
                          Math.floor((i + t) / 2 / this._delta)
                        )
                      );
                },
              },
              {
                key: "_getAnchor",
                value: function (i, t) {
                  if (0 === this._physicalItems.size)
                    return this._calculateAnchor(i, t);
                  if (this._first < 0) return this._calculateAnchor(i, t);
                  if (this._last < 0) return this._calculateAnchor(i, t);
                  var e = this._getPhysicalItem(this._first),
                    s = this._getPhysicalItem(this._last),
                    h = e.pos;
                  if (s.pos + this._metricsCache.getChildSize(this._last) < i)
                    return this._calculateAnchor(i, t);
                  if (h > t) return this._calculateAnchor(i, t);
                  for (var n = this._firstVisible - 1, a = -1 / 0; a < i; ) {
                    a =
                      this._getPhysicalItem(++n).pos +
                      this._metricsCache.getChildSize(n);
                  }
                  return n;
                },
              },
              {
                key: "_getActiveItems",
                value: function () {
                  0 === this._viewDim1 || 0 === this.items.length
                    ? this._clearItems()
                    : this._getItems();
                },
              },
              {
                key: "_clearItems",
                value: function () {
                  (this._first = -1),
                    (this._last = -1),
                    (this._physicalMin = 0),
                    (this._physicalMax = 0);
                  var i = this._newPhysicalItems;
                  (this._newPhysicalItems = this._physicalItems),
                    this._newPhysicalItems.clear(),
                    (this._physicalItems = i),
                    (this._stable = !0);
                },
              },
              {
                key: "_getItems",
                value: function () {
                  var i,
                    t,
                    e,
                    s,
                    h = this._newPhysicalItems;
                  if (((this._stable = !0), null !== this.pin)) {
                    var n = this.pin.index;
                    (this._anchorIdx = n),
                      (this._anchorPos = this._getPosition(n));
                  }
                  if (
                    ((e = this._scrollPosition - this._overhang),
                    (s =
                      this._scrollPosition + this._viewDim1 + this._overhang) <
                      0 || e > this._scrollSize)
                  )
                    this._clearItems();
                  else {
                    (null !== this._anchorIdx && null !== this._anchorPos) ||
                      ((this._anchorIdx = this._getAnchor(e, s)),
                      (this._anchorPos = this._getPosition(this._anchorIdx)));
                    var a = this._getSize(this._anchorIdx);
                    void 0 === a &&
                      ((this._stable = !1), (a = this._getAverageSize()));
                    var r =
                        null !==
                          (i = this._metricsCache.getMarginSize(
                            this._anchorIdx
                          )) && void 0 !== i
                          ? i
                          : this._metricsCache.averageMarginSize,
                      o =
                        null !==
                          (t = this._metricsCache.getMarginSize(
                            this._anchorIdx + 1
                          )) && void 0 !== t
                          ? t
                          : this._metricsCache.averageMarginSize;
                    0 === this._anchorIdx && (this._anchorPos = r),
                      this._anchorIdx === this.items.length - 1 &&
                        (this._anchorPos = this._scrollSize - o - a);
                    var l = 0;
                    for (
                      this._anchorPos + a + o < e &&
                        (l = e - (this._anchorPos + a + o)),
                        this._anchorPos - r > s &&
                          (l = s - (this._anchorPos - r)),
                        l &&
                          ((this._scrollPosition -= l),
                          (e -= l),
                          (s -= l),
                          (this._scrollError += l)),
                        h.set(this._anchorIdx, {
                          pos: this._anchorPos,
                          size: a,
                        }),
                        this._first = this._last = this._anchorIdx,
                        this._physicalMin = this._anchorPos - r,
                        this._physicalMax = this._anchorPos + a + o;
                      this._physicalMin > e && this._first > 0;

                    ) {
                      var _ = this._getSize(--this._first);
                      void 0 === _ &&
                        ((this._stable = !1), (_ = this._getAverageSize()));
                      var c = this._metricsCache.getMarginSize(this._first);
                      void 0 === c &&
                        ((this._stable = !1),
                        (c = this._metricsCache.averageMarginSize)),
                        (this._physicalMin -= _);
                      var u = this._physicalMin;
                      if (
                        (h.set(this._first, { pos: u, size: _ }),
                        (this._physicalMin -= c),
                        !1 === this._stable && !1 === this._estimate)
                      )
                        break;
                    }
                    for (
                      ;
                      this._physicalMax < s &&
                      this._last < this.items.length - 1;

                    ) {
                      var g = this._getSize(++this._last);
                      void 0 === g &&
                        ((this._stable = !1), (g = this._getAverageSize()));
                      var f = this._metricsCache.getMarginSize(this._last);
                      void 0 === f &&
                        ((this._stable = !1),
                        (f = this._metricsCache.averageMarginSize));
                      var v = this._physicalMax;
                      if (
                        (h.set(this._last, { pos: v, size: g }),
                        (this._physicalMax += g + f),
                        !this._stable && !this._estimate)
                      )
                        break;
                    }
                    var m = this._calculateError();
                    m &&
                      ((this._physicalMin -= m),
                      (this._physicalMax -= m),
                      (this._anchorPos -= m),
                      (this._scrollPosition -= m),
                      h.forEach(function (i) {
                        return (i.pos -= m);
                      }),
                      (this._scrollError += m)),
                      this._stable &&
                        ((this._newPhysicalItems = this._physicalItems),
                        this._newPhysicalItems.clear(),
                        (this._physicalItems = h));
                  }
                },
              },
              {
                key: "_calculateError",
                value: function () {
                  return 0 === this._first
                    ? this._physicalMin
                    : this._physicalMin <= 0
                    ? this._physicalMin - this._first * this._delta
                    : this._last === this.items.length - 1
                    ? this._physicalMax - this._scrollSize
                    : this._physicalMax >= this._scrollSize
                    ? this._physicalMax -
                      this._scrollSize +
                      (this.items.length - 1 - this._last) * this._delta
                    : 0;
                },
              },
              {
                key: "_reflow",
                value: function () {
                  var i = this._first,
                    e = this._last;
                  (0, n.Z)((0, a.Z)(t.prototype), "_reflow", this).call(this),
                    ((-1 === this._first && -1 == this._last) ||
                      (this._first === i && this._last === e)) &&
                      this._resetReflowState();
                },
              },
              {
                key: "_resetReflowState",
                value: function () {
                  (this._anchorIdx = null),
                    (this._anchorPos = null),
                    (this._stable = !0);
                },
              },
              {
                key: "_updateScrollSize",
                value: function () {
                  var i = this._metricsCache.averageMarginSize;
                  this._scrollSize = Math.max(
                    1,
                    this.items.length * (i + this._getAverageSize()) + i
                  );
                },
              },
              {
                key: "_delta",
                get: function () {
                  var i = this._metricsCache.averageMarginSize;
                  return this._getAverageSize() + i;
                },
              },
              {
                key: "_getItemPosition",
                value: function (i) {
                  var t;
                  return (0, s.Z)(
                    (0, s.Z)(
                      (0, s.Z)({}, this._positionDim, this._getPosition(i)),
                      this._secondaryPositionDim,
                      0
                    ),
                    "horizontal" === this.direction ? "xOffset" : "yOffset",
                    -(null !==
                      (t = this._metricsCache.getLeadingMarginValue(
                        i,
                        this.direction
                      )) && void 0 !== t
                      ? t
                      : this._metricsCache.averageMarginSize)
                  );
                },
              },
              {
                key: "_getItemSize",
                value: function (i) {
                  return (0, s.Z)(
                    (0, s.Z)(
                      {},
                      this._sizeDim,
                      this._getSize(i) || this._getAverageSize()
                    ),
                    this._secondarySizeDim,
                    this._itemSize[this._secondarySizeDim]
                  );
                },
              },
              {
                key: "_viewDim2Changed",
                value: function () {
                  this._metricsCache.clear(), this._scheduleReflow();
                },
              },
            ]),
            t
          );
        })(g.IE);
    },
    15723: function (i, t, e) {
      e.d(t, {
        IE: function () {
          return o;
        },
        gu: function () {
          return r;
        },
        qF: function () {
          return a;
        },
      });
      var s = e(93359),
        h = e(71650),
        n = e(33368);
      e(46798), e(47084), e(85717), e(51358), e(96043), e(5239), e(98490);
      function a(i) {
        return "horizontal" === i ? "width" : "height";
      }
      function r(i) {
        return "horizontal" === i ? "height" : "width";
      }
      var o = (function () {
        function i(t, e) {
          var s = this;
          (0, h.Z)(this, i),
            (this._latestCoords = { left: 0, top: 0 }),
            (this._direction = null),
            (this._viewportSize = { width: 0, height: 0 }),
            (this.totalScrollSize = { width: 0, height: 0 }),
            (this.offsetWithinScroller = { left: 0, top: 0 }),
            (this._pendingReflow = !1),
            (this._pendingLayoutUpdate = !1),
            (this._pin = null),
            (this._firstVisible = 0),
            (this._lastVisible = 0),
            (this._physicalMin = 0),
            (this._physicalMax = 0),
            (this._first = -1),
            (this._last = -1),
            (this._sizeDim = "height"),
            (this._secondarySizeDim = "width"),
            (this._positionDim = "top"),
            (this._secondaryPositionDim = "left"),
            (this._scrollPosition = 0),
            (this._scrollError = 0),
            (this._items = []),
            (this._scrollSize = 1),
            (this._overhang = 1e3),
            (this._hostSink = t),
            Promise.resolve().then(function () {
              return (s.config = e || s._getDefaultConfig());
            });
        }
        return (
          (0, n.Z)(i, [
            {
              key: "_getDefaultConfig",
              value: function () {
                return { direction: "vertical" };
              },
            },
            {
              key: "config",
              get: function () {
                return { direction: this.direction };
              },
              set: function (i) {
                Object.assign(
                  this,
                  Object.assign({}, this._getDefaultConfig(), i)
                );
              },
            },
            {
              key: "items",
              get: function () {
                return this._items;
              },
              set: function (i) {
                this._setItems(i);
              },
            },
            {
              key: "_setItems",
              value: function (i) {
                i !== this._items &&
                  ((this._items = i), this._scheduleReflow());
              },
            },
            {
              key: "direction",
              get: function () {
                return this._direction;
              },
              set: function (i) {
                (i = "horizontal" === i ? i : "vertical") !== this._direction &&
                  ((this._direction = i),
                  (this._sizeDim = "horizontal" === i ? "width" : "height"),
                  (this._secondarySizeDim =
                    "horizontal" === i ? "height" : "width"),
                  (this._positionDim = "horizontal" === i ? "left" : "top"),
                  (this._secondaryPositionDim =
                    "horizontal" === i ? "top" : "left"),
                  this._triggerReflow());
              },
            },
            {
              key: "viewportSize",
              get: function () {
                return this._viewportSize;
              },
              set: function (i) {
                var t = this._viewDim1,
                  e = this._viewDim2;
                Object.assign(this._viewportSize, i),
                  e !== this._viewDim2
                    ? this._scheduleLayoutUpdate()
                    : t !== this._viewDim1 && this._checkThresholds();
              },
            },
            {
              key: "viewportScroll",
              get: function () {
                return this._latestCoords;
              },
              set: function (i) {
                Object.assign(this._latestCoords, i);
                var t = this._scrollPosition;
                (this._scrollPosition = this._latestCoords[this._positionDim]),
                  Math.abs(t - this._scrollPosition) >= 1 &&
                    this._checkThresholds();
              },
            },
            {
              key: "reflowIfNeeded",
              value: function () {
                ((arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0]) ||
                  this._pendingReflow) &&
                  ((this._pendingReflow = !1), this._reflow());
              },
            },
            {
              key: "pin",
              get: function () {
                if (null !== this._pin) {
                  var i = this._pin,
                    t = i.index,
                    e = i.block;
                  return {
                    index: Math.max(0, Math.min(t, this.items.length - 1)),
                    block: e,
                  };
                }
                return null;
              },
              set: function (i) {
                (this._pin = i), this._triggerReflow();
              },
            },
            {
              key: "_clampScrollPosition",
              value: function (i) {
                return Math.max(
                  -this.offsetWithinScroller[this._positionDim],
                  Math.min(
                    i,
                    this.totalScrollSize[a(this.direction)] - this._viewDim1
                  )
                );
              },
            },
            {
              key: "unpin",
              value: function () {
                null !== this._pin &&
                  (this._sendUnpinnedMessage(), (this._pin = null));
              },
            },
            { key: "_updateLayout", value: function () {} },
            {
              key: "_viewDim1",
              get: function () {
                return this._viewportSize[this._sizeDim];
              },
            },
            {
              key: "_viewDim2",
              get: function () {
                return this._viewportSize[this._secondarySizeDim];
              },
            },
            {
              key: "_scheduleReflow",
              value: function () {
                this._pendingReflow = !0;
              },
            },
            {
              key: "_scheduleLayoutUpdate",
              value: function () {
                (this._pendingLayoutUpdate = !0), this._scheduleReflow();
              },
            },
            {
              key: "_triggerReflow",
              value: function () {
                var i = this;
                this._scheduleLayoutUpdate(),
                  Promise.resolve().then(function () {
                    return i.reflowIfNeeded();
                  });
              },
            },
            {
              key: "_reflow",
              value: function () {
                this._pendingLayoutUpdate &&
                  (this._updateLayout(), (this._pendingLayoutUpdate = !1)),
                  this._updateScrollSize(),
                  this._setPositionFromPin(),
                  this._getActiveItems(),
                  this._updateVisibleIndices(),
                  this._sendStateChangedMessage();
              },
            },
            {
              key: "_setPositionFromPin",
              value: function () {
                if (null !== this.pin) {
                  var i = this._scrollPosition,
                    t = this.pin,
                    e = t.index,
                    s = t.block;
                  (this._scrollPosition =
                    this._calculateScrollIntoViewPosition({
                      index: e,
                      block: s || "start",
                    }) - this.offsetWithinScroller[this._positionDim]),
                    (this._scrollError = i - this._scrollPosition);
                }
              },
            },
            {
              key: "_calculateScrollIntoViewPosition",
              value: function (i) {
                var t = i.block,
                  e = Math.min(this.items.length, Math.max(0, i.index)),
                  s = this._getItemPosition(e)[this._positionDim],
                  h = s;
                if ("start" !== t) {
                  var n = this._getItemSize(e)[this._sizeDim];
                  if ("center" === t) h = s - 0.5 * this._viewDim1 + 0.5 * n;
                  else {
                    var a = s - this._viewDim1 + n;
                    if ("end" === t) h = a;
                    else {
                      var r = this._scrollPosition;
                      h = Math.abs(r - s) < Math.abs(r - a) ? s : a;
                    }
                  }
                }
                return (
                  (h += this.offsetWithinScroller[this._positionDim]),
                  this._clampScrollPosition(h)
                );
              },
            },
            {
              key: "getScrollIntoViewCoordinates",
              value: function (i) {
                return (0, s.Z)(
                  {},
                  this._positionDim,
                  this._calculateScrollIntoViewPosition(i)
                );
              },
            },
            {
              key: "_sendUnpinnedMessage",
              value: function () {
                this._hostSink({ type: "unpinned" });
              },
            },
            {
              key: "_sendVisibilityChangedMessage",
              value: function () {
                this._hostSink({
                  type: "visibilityChanged",
                  firstVisible: this._firstVisible,
                  lastVisible: this._lastVisible,
                });
              },
            },
            {
              key: "_sendStateChangedMessage",
              value: function () {
                var i = new Map();
                if (-1 !== this._first && -1 !== this._last)
                  for (var t = this._first; t <= this._last; t++)
                    i.set(t, this._getItemPosition(t));
                var e = {
                  type: "stateChanged",
                  scrollSize: (0, s.Z)(
                    (0, s.Z)({}, this._sizeDim, this._scrollSize),
                    this._secondarySizeDim,
                    null
                  ),
                  range: {
                    first: this._first,
                    last: this._last,
                    firstVisible: this._firstVisible,
                    lastVisible: this._lastVisible,
                  },
                  childPositions: i,
                };
                this._scrollError &&
                  ((e.scrollError = (0, s.Z)(
                    (0, s.Z)({}, this._positionDim, this._scrollError),
                    this._secondaryPositionDim,
                    0
                  )),
                  (this._scrollError = 0)),
                  this._hostSink(e);
              },
            },
            {
              key: "_num",
              get: function () {
                return -1 === this._first || -1 === this._last
                  ? 0
                  : this._last - this._first + 1;
              },
            },
            {
              key: "_checkThresholds",
              value: function () {
                if (
                  (0 === this._viewDim1 && this._num > 0) ||
                  null !== this._pin
                )
                  this._scheduleReflow();
                else {
                  var i = Math.max(0, this._scrollPosition - this._overhang),
                    t = Math.min(
                      this._scrollSize,
                      this._scrollPosition + this._viewDim1 + this._overhang
                    );
                  this._physicalMin > i || this._physicalMax < t
                    ? this._scheduleReflow()
                    : this._updateVisibleIndices({ emit: !0 });
                }
              },
            },
            {
              key: "_updateVisibleIndices",
              value: function (i) {
                if (-1 !== this._first && -1 !== this._last) {
                  for (
                    var t = this._first;
                    t < this._last &&
                    Math.round(
                      this._getItemPosition(t)[this._positionDim] +
                        this._getItemSize(t)[this._sizeDim]
                    ) <= Math.round(this._scrollPosition);

                  )
                    t++;
                  for (
                    var e = this._last;
                    e > this._first &&
                    Math.round(this._getItemPosition(e)[this._positionDim]) >=
                      Math.round(this._scrollPosition + this._viewDim1);

                  )
                    e--;
                  (t === this._firstVisible && e === this._lastVisible) ||
                    ((this._firstVisible = t),
                    (this._lastVisible = e),
                    i && i.emit && this._sendVisibilityChangedMessage());
                }
              },
            },
          ]),
          i
        );
      })();
    },
  },
]);
//# sourceMappingURL=4093.6h50EXyvG0E.js.map
