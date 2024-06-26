/*! For license information please see 8565.wJ9COULmd4M.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [8565],
  {
    48769: function (t, e, i) {
      i(88820)(
        "WeakSet",
        function (t) {
          return function () {
            return t(this, arguments.length ? arguments[0] : void 0);
          };
        },
        i(6946)
      );
    },
    48567: function (t, e, i) {
      i(48769);
    },
    98565: function (t, e, i) {
      i.r(e),
        i.d(e, {
          LitVirtualizer: function () {
            return N;
          },
          RangeChangedEvent: function () {
            return g;
          },
          VisibilityChangedEvent: function () {
            return k;
          },
        });
      var n = i(88962),
        r = i(71650),
        s = i(33368),
        l = i(68308),
        o = i(69205),
        a = i(43204),
        h = i(5095),
        u = i(5701),
        c = i(99312),
        _ = i(81043),
        d = i(62746),
        v = (i(88770), i(51467), i(36513), i(57835)),
        f = i(76187),
        m = i(99266),
        y = i(40039),
        p =
          (i(94738),
          i(98214),
          i(46798),
          i(51358),
          i(96043),
          i(5239),
          i(98490),
          i(48567),
          i(9849),
          i(50289),
          i(94167),
          i(85717),
          i(47084),
          i(34997),
          i(12148),
          i(87438),
          i(22890),
          i(40271),
          i(60163),
          i(46349),
          i(70320),
          i(80628),
          i(97393),
          i(67712),
          i(32550),
          i(76843),
          i(56889)),
        g = (function (t) {
          function e(t) {
            var i;
            return (
              (0, r.Z)(this, e),
              ((i = (0, l.Z)(this, e, [e.eventName, { bubbles: !1 }])).first =
                t.first),
              (i.last = t.last),
              i
            );
          }
          return (0, o.Z)(e, t), (0, s.Z)(e);
        })((0, p.Z)(Event));
      g.eventName = "rangeChanged";
      var k = (function (t) {
        function e(t) {
          var i;
          return (
            (0, r.Z)(this, e),
            ((i = (0, l.Z)(this, e, [e.eventName, { bubbles: !1 }])).first =
              t.first),
            (i.last = t.last),
            i
          );
        }
        return (0, o.Z)(e, t), (0, s.Z)(e);
      })((0, p.Z)(Event));
      k.eventName = "visibilityChanged";
      var b = (function (t) {
        function e() {
          return (
            (0, r.Z)(this, e), (0, l.Z)(this, e, [e.eventName, { bubbles: !1 }])
          );
        }
        return (0, o.Z)(e, t), (0, s.Z)(e);
      })((0, p.Z)(Event));
      b.eventName = "unpinned";
      var w,
        C = i(82390),
        E =
          (i(78399),
          i(56086),
          i(47884),
          i(81912),
          i(64584),
          i(41483),
          i(12367),
          i(9454),
          (function (t) {
            function e(t, i) {
              var n;
              (0, r.Z)(this, e),
                ((n = (0, l.Z)(this, e, [i]))._clients = new Set()),
                (n._retarget = null),
                (n._end = null),
                (n.__destination = null),
                (n.correctingScrollError = !1),
                (n._checkForArrival = n._checkForArrival.bind((0, C.Z)(n))),
                (n._updateManagedScrollTo = n._updateManagedScrollTo.bind(
                  (0, C.Z)(n)
                )),
                (n.scrollTo = n.scrollTo.bind((0, C.Z)(n))),
                (n.scrollBy = n.scrollBy.bind((0, C.Z)(n)));
              var s = n._node;
              return (
                (n._originalScrollTo = s.scrollTo),
                (n._originalScrollBy = s.scrollBy),
                (n._originalScroll = s.scroll),
                n._attach(t),
                n
              );
            }
            return (
              (0, o.Z)(e, t),
              (0, s.Z)(e, [
                {
                  key: "_destination",
                  get: function () {
                    return this.__destination;
                  },
                },
                {
                  key: "scrolling",
                  get: function () {
                    return null !== this._destination;
                  },
                },
                {
                  key: "scrollTo",
                  value: function (t, e) {
                    var i =
                      "number" == typeof t && "number" == typeof e
                        ? { left: t, top: e }
                        : t;
                    this._scrollTo(i);
                  },
                },
                {
                  key: "scrollBy",
                  value: function (t, e) {
                    var i =
                      "number" == typeof t && "number" == typeof e
                        ? { left: t, top: e }
                        : t;
                    void 0 !== i.top && (i.top += this.scrollTop),
                      void 0 !== i.left && (i.left += this.scrollLeft),
                      this._scrollTo(i);
                  },
                },
                {
                  key: "_nativeScrollTo",
                  value: function (t) {
                    this._originalScrollTo.bind(this._element || window)(t);
                  },
                },
                {
                  key: "_scrollTo",
                  value: function (t) {
                    var e =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : null,
                      i =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : null;
                    null !== this._end && this._end(),
                      "smooth" === t.behavior
                        ? (this._setDestination(t),
                          (this._retarget = e),
                          (this._end = i))
                        : this._resetScrollState(),
                      this._nativeScrollTo(t);
                  },
                },
                {
                  key: "_setDestination",
                  value: function (t) {
                    var e = t.top,
                      i = t.left;
                    return (
                      (e =
                        void 0 === e
                          ? void 0
                          : Math.max(0, Math.min(e, this.maxScrollTop))),
                      (i =
                        void 0 === i
                          ? void 0
                          : Math.max(0, Math.min(i, this.maxScrollLeft))),
                      (null === this._destination ||
                        i !== this._destination.left ||
                        e !== this._destination.top) &&
                        ((this.__destination = {
                          top: e,
                          left: i,
                          behavior: "smooth",
                        }),
                        !0)
                    );
                  },
                },
                {
                  key: "_resetScrollState",
                  value: function () {
                    (this.__destination = null),
                      (this._retarget = null),
                      (this._end = null);
                  },
                },
                {
                  key: "_updateManagedScrollTo",
                  value: function (t) {
                    this._destination &&
                      this._setDestination(t) &&
                      this._nativeScrollTo(this._destination);
                  },
                },
                {
                  key: "managedScrollTo",
                  value: function (t, e, i) {
                    return this._scrollTo(t, e, i), this._updateManagedScrollTo;
                  },
                },
                {
                  key: "correctScrollError",
                  value: function (t) {
                    var e = this;
                    (this.correctingScrollError = !0),
                      requestAnimationFrame(function () {
                        return requestAnimationFrame(function () {
                          return (e.correctingScrollError = !1);
                        });
                      }),
                      this._nativeScrollTo(t),
                      this._retarget && this._setDestination(this._retarget()),
                      this._destination &&
                        this._nativeScrollTo(this._destination);
                  },
                },
                {
                  key: "_checkForArrival",
                  value: function () {
                    if (null !== this._destination) {
                      var t = this.scrollTop,
                        e = this.scrollLeft,
                        i = this._destination,
                        n = i.top,
                        r = i.left;
                      (n = Math.min(n || 0, this.maxScrollTop)),
                        (r = Math.min(r || 0, this.maxScrollLeft));
                      var s = Math.abs(n - t),
                        l = Math.abs(r - e);
                      s < 1 &&
                        l < 1 &&
                        (this._end && this._end(), this._resetScrollState());
                    }
                  },
                },
                {
                  key: "detach",
                  value: function (t) {
                    return (
                      this._clients.delete(t),
                      0 === this._clients.size &&
                        ((this._node.scrollTo = this._originalScrollTo),
                        (this._node.scrollBy = this._originalScrollBy),
                        (this._node.scroll = this._originalScroll),
                        this._node.removeEventListener(
                          "scroll",
                          this._checkForArrival
                        )),
                      null
                    );
                  },
                },
                {
                  key: "_attach",
                  value: function (t) {
                    this._clients.add(t),
                      1 === this._clients.size &&
                        ((this._node.scrollTo = this.scrollTo),
                        (this._node.scrollBy = this.scrollBy),
                        (this._node.scroll = this.scrollTo),
                        this._node.addEventListener(
                          "scroll",
                          this._checkForArrival
                        ));
                  },
                },
              ]),
              e
            );
          })(
            (function () {
              function t(e) {
                (0, r.Z)(this, t), (this._element = null);
                var i = null != e ? e : window;
                (this._node = i), e && (this._element = e);
              }
              return (
                (0, s.Z)(t, [
                  {
                    key: "element",
                    get: function () {
                      return (
                        this._element ||
                        document.scrollingElement ||
                        document.documentElement
                      );
                    },
                  },
                  {
                    key: "scrollTop",
                    get: function () {
                      return this.element.scrollTop || window.scrollY;
                    },
                  },
                  {
                    key: "scrollLeft",
                    get: function () {
                      return this.element.scrollLeft || window.scrollX;
                    },
                  },
                  {
                    key: "scrollHeight",
                    get: function () {
                      return this.element.scrollHeight;
                    },
                  },
                  {
                    key: "scrollWidth",
                    get: function () {
                      return this.element.scrollWidth;
                    },
                  },
                  {
                    key: "viewportHeight",
                    get: function () {
                      return this._element
                        ? this._element.getBoundingClientRect().height
                        : window.innerHeight;
                    },
                  },
                  {
                    key: "viewportWidth",
                    get: function () {
                      return this._element
                        ? this._element.getBoundingClientRect().width
                        : window.innerWidth;
                    },
                  },
                  {
                    key: "maxScrollTop",
                    get: function () {
                      return this.scrollHeight - this.viewportHeight;
                    },
                  },
                  {
                    key: "maxScrollLeft",
                    get: function () {
                      return this.scrollWidth - this.viewportWidth;
                    },
                  },
                ]),
                t
              );
            })()
          )),
        S = null === (w = window) || void 0 === w ? void 0 : w.ResizeObserver;
      var Z,
        L,
        z = Symbol("virtualizerRef"),
        T = "virtualizer-sizer",
        x = (function () {
          function t(e) {
            if (
              ((0, r.Z)(this, t),
              (this._benchmarkStart = null),
              (this._layout = null),
              (this._clippingAncestors = []),
              (this._scrollSize = null),
              (this._scrollError = null),
              (this._childrenPos = null),
              (this._childMeasurements = null),
              (this._toBeMeasured = new Map()),
              (this._rangeChanged = !0),
              (this._itemsChanged = !0),
              (this._visibilityChanged = !0),
              (this._scrollerController = null),
              (this._isScroller = !1),
              (this._sizer = null),
              (this._hostElementRO = null),
              (this._childrenRO = null),
              (this._mutationObserver = null),
              (this._scrollEventListeners = []),
              (this._scrollEventListenerOptions = { passive: !0 }),
              (this._loadListener = this._childLoaded.bind(this)),
              (this._scrollIntoViewTarget = null),
              (this._updateScrollIntoViewCoordinates = null),
              (this._items = []),
              (this._first = -1),
              (this._last = -1),
              (this._firstVisible = -1),
              (this._lastVisible = -1),
              (this._scheduled = new WeakSet()),
              (this._measureCallback = null),
              (this._measureChildOverride = null),
              (this._layoutCompletePromise = null),
              (this._layoutCompleteResolver = null),
              (this._layoutCompleteRejecter = null),
              (this._pendingLayoutComplete = null),
              (this._layoutInitialized = null),
              !e)
            )
              throw new Error(
                "Virtualizer constructor requires a configuration object"
              );
            if (!e.hostElement)
              throw new Error(
                'Virtualizer configuration requires the "hostElement" property'
              );
            this._init(e);
          }
          var e, n, l, o, a;
          return (
            (0, s.Z)(t, [
              {
                key: "items",
                set: function (t) {
                  Array.isArray(t) &&
                    t !== this._items &&
                    ((this._itemsChanged = !0),
                    (this._items = t),
                    this._schedule(this._updateLayout));
                },
              },
              {
                key: "_init",
                value: function (t) {
                  (this._isScroller = !!t.scroller), this._initHostElement(t);
                  var e = t.layout || {};
                  this._layoutInitialized = this._initLayout(e);
                },
              },
              {
                key: "_initObservers",
                value: function () {
                  var t = this;
                  (this._mutationObserver = new MutationObserver(
                    this._finishDOMUpdate.bind(this)
                  )),
                    (this._hostElementRO = new S(function () {
                      return t._hostElementSizeChanged();
                    })),
                    (this._childrenRO = new S(
                      this._childrenSizeChanged.bind(this)
                    ));
                },
              },
              {
                key: "_initHostElement",
                value: function (t) {
                  var e = (this._hostElement = t.hostElement);
                  this._applyVirtualizerStyles(), (e[z] = this);
                },
              },
              {
                key: "connected",
                value: function () {
                  this._initObservers();
                  var t = this._isScroller;
                  (this._clippingAncestors = (function (t) {
                    var e =
                        arguments.length > 1 &&
                        void 0 !== arguments[1] &&
                        arguments[1],
                      i = !1;
                    return (function (t) {
                      var e =
                          arguments.length > 1 &&
                          void 0 !== arguments[1] &&
                          arguments[1],
                        i = [],
                        n = e ? t : V(t);
                      for (; null !== n; ) i.push(n), (n = V(n));
                      return i;
                    })(t, e).filter(function (t) {
                      if (i) return !1;
                      var e = getComputedStyle(t);
                      return (
                        (i = "fixed" === e.position), "visible" !== e.overflow
                      );
                    });
                  })(this._hostElement, t)),
                    (this._scrollerController = new E(
                      this,
                      this._clippingAncestors[0]
                    )),
                    this._schedule(this._updateLayout),
                    this._observeAndListen();
                },
              },
              {
                key: "_observeAndListen",
                value: function () {
                  var t = this;
                  this._mutationObserver.observe(this._hostElement, {
                    childList: !0,
                  }),
                    this._hostElementRO.observe(this._hostElement),
                    this._scrollEventListeners.push(window),
                    window.addEventListener(
                      "scroll",
                      this,
                      this._scrollEventListenerOptions
                    ),
                    this._clippingAncestors.forEach(function (e) {
                      e.addEventListener(
                        "scroll",
                        t,
                        t._scrollEventListenerOptions
                      ),
                        t._scrollEventListeners.push(e),
                        t._hostElementRO.observe(e);
                    }),
                    this._hostElementRO.observe(
                      this._scrollerController.element
                    ),
                    this._children.forEach(function (e) {
                      return t._childrenRO.observe(e);
                    }),
                    this._scrollEventListeners.forEach(function (e) {
                      return e.addEventListener(
                        "scroll",
                        t,
                        t._scrollEventListenerOptions
                      );
                    });
                },
              },
              {
                key: "disconnected",
                value: function () {
                  var t,
                    e,
                    i,
                    n,
                    r = this;
                  this._scrollEventListeners.forEach(function (t) {
                    return t.removeEventListener(
                      "scroll",
                      r,
                      r._scrollEventListenerOptions
                    );
                  }),
                    (this._scrollEventListeners = []),
                    (this._clippingAncestors = []),
                    null === (t = this._scrollerController) ||
                      void 0 === t ||
                      t.detach(this),
                    (this._scrollerController = null),
                    null === (e = this._mutationObserver) ||
                      void 0 === e ||
                      e.disconnect(),
                    (this._mutationObserver = null),
                    null === (i = this._hostElementRO) ||
                      void 0 === i ||
                      i.disconnect(),
                    (this._hostElementRO = null),
                    null === (n = this._childrenRO) ||
                      void 0 === n ||
                      n.disconnect(),
                    (this._childrenRO = null),
                    this._rejectLayoutCompletePromise("disconnected");
                },
              },
              {
                key: "_applyVirtualizerStyles",
                value: function () {
                  var t = this._hostElement.style;
                  (t.display = t.display || "block"),
                    (t.position = t.position || "relative"),
                    (t.contain = t.contain || "size layout"),
                    this._isScroller &&
                      ((t.overflow = t.overflow || "auto"),
                      (t.minHeight = t.minHeight || "150px"));
                },
              },
              {
                key: "_getSizer",
                value: function () {
                  var t = this._hostElement;
                  if (!this._sizer) {
                    var e = t.querySelector("[".concat(T, "]"));
                    e ||
                      ((e = document.createElement("div")).setAttribute(T, ""),
                      t.appendChild(e)),
                      Object.assign(e.style, {
                        position: "absolute",
                        margin: "-2px 0 0 0",
                        padding: 0,
                        visibility: "hidden",
                        fontSize: "2px",
                      }),
                      (e.textContent = "&nbsp;"),
                      e.setAttribute(T, ""),
                      (this._sizer = e);
                  }
                  return this._sizer;
                },
              },
              {
                key: "updateLayoutConfig",
                value:
                  ((a = (0, _.Z)(
                    (0, c.Z)().mark(function t(e) {
                      var i, n;
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (t.next = 2), this._layoutInitialized;
                              case 2:
                                if (
                                  !(
                                    "function" == typeof (i = e.type || Z) &&
                                    this._layout instanceof i
                                  )
                                ) {
                                  t.next = 8;
                                  break;
                                }
                                return (
                                  delete (n = Object.assign({}, e)).type,
                                  (this._layout.config = n),
                                  t.abrupt("return", !0)
                                );
                              case 8:
                                return t.abrupt("return", !1);
                              case 9:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t) {
                    return a.apply(this, arguments);
                  }),
              },
              {
                key: "_initLayout",
                value:
                  ((o = (0, _.Z)(
                    (0, c.Z)().mark(function t(e) {
                      var n,
                        r,
                        s,
                        l = this;
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                if (
                                  ("function" == typeof e.type
                                    ? ((r = e.type),
                                      delete (s = Object.assign({}, e)).type,
                                      (n = s))
                                    : (n = e),
                                  void 0 !== r)
                                ) {
                                  t.next = 5;
                                  break;
                                }
                                return (
                                  (t.next = 4), i.e(4093).then(i.bind(i, 64093))
                                );
                              case 4:
                                Z = r = t.sent.FlowLayout;
                              case 5:
                                (this._layout = new r(function (t) {
                                  return l._handleLayoutMessage(t);
                                }, n)),
                                  this._layout.measureChildren &&
                                    "function" ==
                                      typeof this._layout.updateItemSizes &&
                                    ("function" ==
                                      typeof this._layout.measureChildren &&
                                      (this._measureChildOverride =
                                        this._layout.measureChildren),
                                    (this._measureCallback =
                                      this._layout.updateItemSizes.bind(
                                        this._layout
                                      ))),
                                  this._layout.listenForChildLoadEvents &&
                                    this._hostElement.addEventListener(
                                      "load",
                                      this._loadListener,
                                      !0
                                    ),
                                  this._schedule(this._updateLayout);
                              case 9:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t) {
                    return o.apply(this, arguments);
                  }),
              },
              {
                key: "startBenchmarking",
                value: function () {
                  null === this._benchmarkStart &&
                    (this._benchmarkStart = window.performance.now());
                },
              },
              {
                key: "stopBenchmarking",
                value: function () {
                  var t = this;
                  if (null !== this._benchmarkStart) {
                    var e = window.performance.now(),
                      i = e - this._benchmarkStart,
                      n = performance
                        .getEntriesByName("uv-virtualizing", "measure")
                        .filter(function (i) {
                          return (
                            i.startTime >= t._benchmarkStart && i.startTime < e
                          );
                        })
                        .reduce(function (t, e) {
                          return t + e.duration;
                        }, 0);
                    return (
                      (this._benchmarkStart = null),
                      { timeElapsed: i, virtualizationTime: n }
                    );
                  }
                  return null;
                },
              },
              {
                key: "_measureChildren",
                value: function () {
                  for (
                    var t = {},
                      e = this._children,
                      i = this._measureChildOverride || this._measureChild,
                      n = 0;
                    n < e.length;
                    n++
                  ) {
                    var r = e[n],
                      s = this._first + n;
                    (this._itemsChanged || this._toBeMeasured.has(r)) &&
                      (t[s] = i.call(this, r, this._items[s]));
                  }
                  (this._childMeasurements = t),
                    this._schedule(this._updateLayout),
                    this._toBeMeasured.clear();
                },
              },
              {
                key: "_measureChild",
                value: function (t) {
                  var e,
                    i,
                    n = t.getBoundingClientRect(),
                    r = n.width,
                    s = n.height;
                  return Object.assign(
                    { width: r, height: s },
                    ((e = t),
                    {
                      marginTop: A((i = window.getComputedStyle(e)).marginTop),
                      marginRight: A(i.marginRight),
                      marginBottom: A(i.marginBottom),
                      marginLeft: A(i.marginLeft),
                    })
                  );
                },
              },
              {
                key: "_schedule",
                value:
                  ((l = (0, _.Z)(
                    (0, c.Z)().mark(function t(e) {
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                if (this._scheduled.has(e)) {
                                  t.next = 6;
                                  break;
                                }
                                return (
                                  this._scheduled.add(e),
                                  (t.next = 4),
                                  Promise.resolve()
                                );
                              case 4:
                                this._scheduled.delete(e), e.call(this);
                              case 6:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t) {
                    return l.apply(this, arguments);
                  }),
              },
              {
                key: "_updateDOM",
                value:
                  ((n = (0, _.Z)(
                    (0, c.Z)().mark(function t(e) {
                      var i, n;
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                (this._scrollSize = e.scrollSize),
                                  this._adjustRange(e.range),
                                  (this._childrenPos = e.childPositions),
                                  (this._scrollError = e.scrollError || null),
                                  (i = this._rangeChanged),
                                  (n = this._itemsChanged),
                                  this._visibilityChanged &&
                                    (this._notifyVisibility(),
                                    (this._visibilityChanged = !1)),
                                  (i || n) &&
                                    (this._notifyRange(),
                                    (this._rangeChanged = !1)),
                                  this._finishDOMUpdate();
                              case 8:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t) {
                    return n.apply(this, arguments);
                  }),
              },
              {
                key: "_finishDOMUpdate",
                value: function () {
                  var t = this;
                  this._children.forEach(function (e) {
                    return t._childrenRO.observe(e);
                  }),
                    this._checkScrollIntoViewTarget(this._childrenPos),
                    this._positionChildren(this._childrenPos),
                    this._sizeHostElement(this._scrollSize),
                    this._correctScrollError(),
                    this._benchmarkStart &&
                      "mark" in window.performance &&
                      window.performance.mark("uv-end");
                },
              },
              {
                key: "_updateLayout",
                value: function () {
                  this._layout &&
                    this._scrollerController &&
                    ((this._layout.items = this._items),
                    this._updateView(),
                    null !== this._childMeasurements &&
                      (this._measureCallback &&
                        this._measureCallback(this._childMeasurements),
                      (this._childMeasurements = null)),
                    this._layout.reflowIfNeeded(),
                    this._benchmarkStart &&
                      "mark" in window.performance &&
                      window.performance.mark("uv-end"));
                },
              },
              {
                key: "_handleScrollEvent",
                value: function () {
                  if (this._benchmarkStart && "mark" in window.performance) {
                    try {
                      window.performance.measure(
                        "uv-virtualizing",
                        "uv-start",
                        "uv-end"
                      );
                    } catch (e) {
                      console.warn("Error measuring performance data: ", e);
                    }
                    window.performance.mark("uv-start");
                  }
                  var t;
                  !1 === this._scrollerController.correctingScrollError &&
                    (null === (t = this._layout) || void 0 === t || t.unpin());
                  this._schedule(this._updateLayout);
                },
              },
              {
                key: "handleEvent",
                value: function (t) {
                  if ("scroll" === t.type)
                    (t.currentTarget === window ||
                      this._clippingAncestors.includes(t.currentTarget)) &&
                      this._handleScrollEvent();
                  else console.warn("event not handled", t);
                },
              },
              {
                key: "_handleLayoutMessage",
                value: function (t) {
                  "stateChanged" === t.type
                    ? this._updateDOM(t)
                    : "visibilityChanged" === t.type
                    ? ((this._firstVisible = t.firstVisible),
                      (this._lastVisible = t.lastVisible),
                      this._notifyVisibility())
                    : "unpinned" === t.type &&
                      this._hostElement.dispatchEvent(new b());
                },
              },
              {
                key: "_children",
                get: function () {
                  for (var t = [], e = this._hostElement.firstElementChild; e; )
                    e.hasAttribute(T) || t.push(e), (e = e.nextElementSibling);
                  return t;
                },
              },
              {
                key: "_updateView",
                value: function () {
                  var t,
                    e = this._hostElement,
                    i =
                      null === (t = this._scrollerController) || void 0 === t
                        ? void 0
                        : t.element,
                    n = this._layout;
                  if (e && i && n) {
                    var r,
                      s,
                      l,
                      o,
                      a = e.getBoundingClientRect();
                    (r = 0),
                      (s = 0),
                      (l = window.innerHeight),
                      (o = window.innerWidth);
                    var h = this._clippingAncestors.map(function (t) {
                      return t.getBoundingClientRect();
                    });
                    h.unshift(a);
                    var u,
                      c = (0, y.Z)(h);
                    try {
                      for (c.s(); !(u = c.n()).done; ) {
                        var _ = u.value;
                        (r = Math.max(r, _.top)),
                          (s = Math.max(s, _.left)),
                          (l = Math.min(l, _.bottom)),
                          (o = Math.min(o, _.right));
                      }
                    } catch (b) {
                      c.e(b);
                    } finally {
                      c.f();
                    }
                    var d = i.getBoundingClientRect(),
                      v = { left: a.left - d.left, top: a.top - d.top },
                      f = { width: i.scrollWidth, height: i.scrollHeight },
                      m = r - a.top + e.scrollTop,
                      p = s - a.left + e.scrollLeft,
                      g = l - r,
                      k = o - s;
                    (n.viewportSize = { width: k, height: g }),
                      (n.viewportScroll = { top: m, left: p }),
                      (n.totalScrollSize = f),
                      (n.offsetWithinScroller = v);
                  }
                },
              },
              {
                key: "_sizeHostElement",
                value: function (t) {
                  var e = 82e5,
                    i = t && null !== t.width ? Math.min(e, t.width) : 0,
                    n = t && null !== t.height ? Math.min(e, t.height) : 0;
                  if (this._isScroller)
                    this._getSizer().style.transform = "translate("
                      .concat(i, "px, ")
                      .concat(n, "px)");
                  else {
                    var r = this._hostElement.style;
                    (r.minWidth = i ? "".concat(i, "px") : "100%"),
                      (r.minHeight = n ? "".concat(n, "px") : "100%");
                  }
                },
              },
              {
                key: "_positionChildren",
                value: function (t) {
                  var e = this;
                  t &&
                    t.forEach(function (t, i) {
                      var n = t.top,
                        r = t.left,
                        s = t.width,
                        l = t.height,
                        o = t.xOffset,
                        a = t.yOffset,
                        h = e._children[i - e._first];
                      h &&
                        ((h.style.position = "absolute"),
                        (h.style.boxSizing = "border-box"),
                        (h.style.transform = "translate("
                          .concat(r, "px, ")
                          .concat(n, "px)")),
                        void 0 !== s && (h.style.width = s + "px"),
                        void 0 !== l && (h.style.height = l + "px"),
                        (h.style.left = void 0 === o ? null : o + "px"),
                        (h.style.top = void 0 === a ? null : a + "px"));
                    });
                },
              },
              {
                key: "_adjustRange",
                value:
                  ((e = (0, _.Z)(
                    (0, c.Z)().mark(function t(e) {
                      var i, n, r, s;
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                (i = this._first),
                                  (n = this._last),
                                  (r = this._firstVisible),
                                  (s = this._lastVisible),
                                  (this._first = e.first),
                                  (this._last = e.last),
                                  (this._firstVisible = e.firstVisible),
                                  (this._lastVisible = e.lastVisible),
                                  (this._rangeChanged =
                                    this._rangeChanged ||
                                    this._first !== i ||
                                    this._last !== n),
                                  (this._visibilityChanged =
                                    this._visibilityChanged ||
                                    this._firstVisible !== r ||
                                    this._lastVisible !== s);
                              case 7:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t) {
                    return e.apply(this, arguments);
                  }),
              },
              {
                key: "_correctScrollError",
                value: function () {
                  if (this._scrollError) {
                    var t = this._scrollerController,
                      e = t.scrollTop,
                      i = t.scrollLeft,
                      n = this._scrollError,
                      r = n.top,
                      s = n.left;
                    (this._scrollError = null),
                      this._scrollerController.correctScrollError({
                        top: e - r,
                        left: i - s,
                      });
                  }
                },
              },
              {
                key: "element",
                value: function (t) {
                  var e,
                    i = this;
                  return (
                    t === 1 / 0 && (t = this._items.length - 1),
                    void 0 ===
                    (null === (e = this._items) || void 0 === e ? void 0 : e[t])
                      ? void 0
                      : {
                          scrollIntoView: function () {
                            var e =
                              arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : {};
                            return i._scrollElementIntoView(
                              Object.assign(
                                Object.assign({}, e),
                                {},
                                { index: t }
                              )
                            );
                          },
                        }
                  );
                },
              },
              {
                key: "_scrollElementIntoView",
                value: function (t) {
                  var e = this;
                  if (t.index >= this._first && t.index <= this._last)
                    this._children[t.index - this._first].scrollIntoView(t);
                  else if (
                    ((t.index = Math.min(t.index, this._items.length - 1)),
                    "smooth" === t.behavior)
                  ) {
                    var i = this._layout.getScrollIntoViewCoordinates(t),
                      n = t.behavior;
                    (this._updateScrollIntoViewCoordinates =
                      this._scrollerController.managedScrollTo(
                        Object.assign(i, { behavior: n }),
                        function () {
                          return e._layout.getScrollIntoViewCoordinates(t);
                        },
                        function () {
                          return (e._scrollIntoViewTarget = null);
                        }
                      )),
                      (this._scrollIntoViewTarget = t);
                  } else this._layout.pin = t;
                },
              },
              {
                key: "_checkScrollIntoViewTarget",
                value: function (t) {
                  var e = (this._scrollIntoViewTarget || {}).index;
                  e &&
                    null != t &&
                    t.has(e) &&
                    this._updateScrollIntoViewCoordinates(
                      this._layout.getScrollIntoViewCoordinates(
                        this._scrollIntoViewTarget
                      )
                    );
                },
              },
              {
                key: "_notifyRange",
                value: function () {
                  this._hostElement.dispatchEvent(
                    new g({ first: this._first, last: this._last })
                  );
                },
              },
              {
                key: "_notifyVisibility",
                value: function () {
                  this._hostElement.dispatchEvent(
                    new k({
                      first: this._firstVisible,
                      last: this._lastVisible,
                    })
                  );
                },
              },
              {
                key: "layoutComplete",
                get: function () {
                  var t = this;
                  return (
                    this._layoutCompletePromise ||
                      (this._layoutCompletePromise = new Promise(function (
                        e,
                        i
                      ) {
                        (t._layoutCompleteResolver = e),
                          (t._layoutCompleteRejecter = i);
                      })),
                    this._layoutCompletePromise
                  );
                },
              },
              {
                key: "_rejectLayoutCompletePromise",
                value: function (t) {
                  null !== this._layoutCompleteRejecter &&
                    this._layoutCompleteRejecter(t),
                    this._resetLayoutCompleteState();
                },
              },
              {
                key: "_scheduleLayoutComplete",
                value: function () {
                  var t = this;
                  this._layoutCompletePromise &&
                    null === this._pendingLayoutComplete &&
                    (this._pendingLayoutComplete = requestAnimationFrame(
                      function () {
                        return requestAnimationFrame(function () {
                          return t._resolveLayoutCompletePromise();
                        });
                      }
                    ));
                },
              },
              {
                key: "_resolveLayoutCompletePromise",
                value: function () {
                  null !== this._layoutCompleteResolver &&
                    this._layoutCompleteResolver(),
                    this._resetLayoutCompleteState();
                },
              },
              {
                key: "_resetLayoutCompleteState",
                value: function () {
                  (this._layoutCompletePromise = null),
                    (this._layoutCompleteResolver = null),
                    (this._layoutCompleteRejecter = null),
                    (this._pendingLayoutComplete = null);
                },
              },
              {
                key: "_hostElementSizeChanged",
                value: function () {
                  this._schedule(this._updateLayout);
                },
              },
              { key: "_childLoaded", value: function () {} },
              {
                key: "_childrenSizeChanged",
                value: function (t) {
                  var e;
                  if (
                    null !== (e = this._layout) &&
                    void 0 !== e &&
                    e.measureChildren
                  ) {
                    var i,
                      n = (0, y.Z)(t);
                    try {
                      for (n.s(); !(i = n.n()).done; ) {
                        var r = i.value;
                        this._toBeMeasured.set(r.target, r.contentRect);
                      }
                    } catch (s) {
                      n.e(s);
                    } finally {
                      n.f();
                    }
                    this._measureChildren();
                  }
                  this._scheduleLayoutComplete(),
                    (this._itemsChanged = !1),
                    (this._rangeChanged = !1);
                },
              },
            ]),
            t
          );
        })();
      function A(t) {
        var e = t ? parseFloat(t) : NaN;
        return Number.isNaN(e) ? 0 : e;
      }
      function V(t) {
        if (null !== t.assignedSlot) return t.assignedSlot;
        if (null !== t.parentElement) return t.parentElement;
        var e = t.parentNode;
        return (
          (e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host) || null
        );
      }
      var O,
        R = function (t) {
          return t;
        },
        M = function (t, e) {
          return (0, h.dy)(
            L || (L = (0, n.Z)(["", ": ", ""])),
            e,
            JSON.stringify(t, null, 2)
          );
        },
        I = (function (t) {
          function e(t) {
            var i;
            if (
              ((0, r.Z)(this, e),
              ((i = (0, l.Z)(this, e, [t]))._virtualizer = null),
              (i._first = 0),
              (i._last = -1),
              (i._renderItem = function (t, e) {
                return M(t, e + i._first);
              }),
              (i._keyFunction = function (t, e) {
                return R(t, i._first);
              }),
              (i._items = []),
              t.type !== v.pX.CHILD)
            )
              throw new Error(
                "The virtualize directive can only be used in child expressions"
              );
            return i;
          }
          var i;
          return (
            (0, o.Z)(e, t),
            (0, s.Z)(e, [
              {
                key: "render",
                value: function (t) {
                  t && this._setFunctions(t);
                  var e = [];
                  if (this._first >= 0 && this._last >= this._first)
                    for (var i = this._first; i <= this._last; i++)
                      e.push(this._items[i]);
                  return (0, m.r)(e, this._keyFunction, this._renderItem);
                },
              },
              {
                key: "update",
                value: function (t, e) {
                  var i = (0, d.Z)(e, 1)[0];
                  this._setFunctions(i);
                  var n = this._items !== i.items;
                  return (
                    (this._items = i.items || []),
                    this._virtualizer
                      ? this._updateVirtualizerConfig(t, i)
                      : this._initialize(t, i),
                    n ? h.Jb : this.render()
                  );
                },
              },
              {
                key: "_updateVirtualizerConfig",
                value:
                  ((i = (0, _.Z)(
                    (0, c.Z)().mark(function t(e, i) {
                      var n;
                      return (0, c.Z)().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (t.next = 2),
                                  this._virtualizer.updateLayoutConfig(
                                    i.layout || {}
                                  )
                                );
                              case 2:
                                t.sent ||
                                  ((n = e.parentNode),
                                  this._makeVirtualizer(n, i)),
                                  (this._virtualizer.items = this._items);
                              case 5:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this
                      );
                    })
                  )),
                  function (t, e) {
                    return i.apply(this, arguments);
                  }),
              },
              {
                key: "_setFunctions",
                value: function (t) {
                  var e = this,
                    i = t.renderItem,
                    n = t.keyFunction;
                  i &&
                    (this._renderItem = function (t, n) {
                      return i(t, n + e._first);
                    }),
                    n &&
                      (this._keyFunction = function (t, i) {
                        return n(t, i + e._first);
                      });
                },
              },
              {
                key: "_makeVirtualizer",
                value: function (t, e) {
                  this._virtualizer && this._virtualizer.disconnected();
                  var i = e.layout,
                    n = e.scroller,
                    r = e.items;
                  (this._virtualizer = new x({
                    hostElement: t,
                    layout: i,
                    scroller: n,
                  })),
                    (this._virtualizer.items = r),
                    this._virtualizer.connected();
                },
              },
              {
                key: "_initialize",
                value: function (t, e) {
                  var i = this,
                    n = t.parentNode;
                  n &&
                    1 === n.nodeType &&
                    (n.addEventListener("rangeChanged", function (t) {
                      (i._first = t.first),
                        (i._last = t.last),
                        i.setValue(i.render());
                    }),
                    this._makeVirtualizer(n, e));
                },
              },
              {
                key: "disconnected",
                value: function () {
                  var t;
                  null === (t = this._virtualizer) ||
                    void 0 === t ||
                    t.disconnected();
                },
              },
              {
                key: "reconnected",
                value: function () {
                  var t;
                  null === (t = this._virtualizer) ||
                    void 0 === t ||
                    t.connected();
                },
              },
            ]),
            e
          );
        })(f.sR),
        $ = (0, v.XM)(I),
        N = (function (t) {
          function e() {
            var t;
            return (
              (0, r.Z)(this, e),
              ((t = (0, l.Z)(this, e, arguments)).items = []),
              (t.renderItem = M),
              (t.keyFunction = R),
              (t.layout = {}),
              (t.scroller = !1),
              t
            );
          }
          return (
            (0, o.Z)(e, t),
            (0, s.Z)(e, [
              {
                key: "createRenderRoot",
                value: function () {
                  return this;
                },
              },
              {
                key: "render",
                value: function () {
                  var t = this.items,
                    e = this.renderItem,
                    i = this.keyFunction,
                    r = this.layout,
                    s = this.scroller;
                  return (0, h.dy)(
                    O || (O = (0, n.Z)(["", ""])),
                    $({
                      items: t,
                      renderItem: e,
                      keyFunction: i,
                      layout: r,
                      scroller: s,
                    })
                  );
                },
              },
              {
                key: "element",
                value: function (t) {
                  var e;
                  return null === (e = this[z]) || void 0 === e
                    ? void 0
                    : e.element(t);
                },
              },
              {
                key: "layoutComplete",
                get: function () {
                  var t;
                  return null === (t = this[z]) || void 0 === t
                    ? void 0
                    : t.layoutComplete;
                },
              },
              {
                key: "scrollToIndex",
                value: function (t) {
                  var e,
                    i =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : "start";
                  null === (e = this.element(t)) ||
                    void 0 === e ||
                    e.scrollIntoView({ block: i });
                },
              },
            ]),
            e
          );
        })(h.oi);
      (0, a.__decorate)(
        [(0, u.C)({ attribute: !1 })],
        N.prototype,
        "items",
        void 0
      ),
        (0, a.__decorate)([(0, u.C)()], N.prototype, "renderItem", void 0),
        (0, a.__decorate)([(0, u.C)()], N.prototype, "keyFunction", void 0),
        (0, a.__decorate)(
          [(0, u.C)({ attribute: !1 })],
          N.prototype,
          "layout",
          void 0
        ),
        (0, a.__decorate)(
          [(0, u.C)({ reflect: !0, type: Boolean })],
          N.prototype,
          "scroller",
          void 0
        ),
        customElements.define("lit-virtualizer", N);
    },
    76187: function (t, e, i) {
      i.d(e, {
        sR: function () {
          return n.sR;
        },
      });
      var n = i(36585);
    },
    99266: function (t, e, i) {
      i.d(e, {
        r: function () {
          return v;
        },
      });
      var n = i(62746),
        r = i(40039),
        s = i(71650),
        l = i(33368),
        o = i(95281),
        a = i(68308),
        h = i(69205),
        u =
          (i(51358), i(96043), i(46798), i(5239), i(98490), i(51467), i(32982)),
        c = i(16616),
        _ = i(41005),
        d = function (t, e, i) {
          for (var n = new Map(), r = e; r <= i; r++) n.set(t[r], r);
          return n;
        },
        v = (0, c.XM)(
          (function (t) {
            function e(t) {
              var i;
              if (
                ((0, s.Z)(this, e),
                (i = (0, a.Z)(this, e, [t])),
                t.type !== c.pX.CHILD)
              )
                throw Error("repeat() can only be used in text expressions");
              return (0, o.Z)(i);
            }
            return (
              (0, h.Z)(e, t),
              (0, l.Z)(e, [
                {
                  key: "ct",
                  value: function (t, e, i) {
                    var n;
                    void 0 === i ? (i = e) : void 0 !== e && (n = e);
                    var s,
                      l = [],
                      o = [],
                      a = 0,
                      h = (0, r.Z)(t);
                    try {
                      for (h.s(); !(s = h.n()).done; ) {
                        var u = s.value;
                        (l[a] = n ? n(u, a) : a), (o[a] = i(u, a)), a++;
                      }
                    } catch (c) {
                      h.e(c);
                    } finally {
                      h.f();
                    }
                    return { values: o, keys: l };
                  },
                },
                {
                  key: "render",
                  value: function (t, e, i) {
                    return this.ct(t, e, i).values;
                  },
                },
                {
                  key: "update",
                  value: function (t, e) {
                    var i,
                      r = (0, n.Z)(e, 3),
                      s = r[0],
                      l = r[1],
                      o = r[2],
                      a = (0, _.i9)(t),
                      h = this.ct(s, l, o),
                      c = h.values,
                      v = h.keys;
                    if (!Array.isArray(a)) return (this.ut = v), c;
                    for (
                      var f,
                        m,
                        y =
                          null !== (i = this.ut) && void 0 !== i
                            ? i
                            : (this.ut = []),
                        p = [],
                        g = 0,
                        k = a.length - 1,
                        b = 0,
                        w = c.length - 1;
                      g <= k && b <= w;

                    )
                      if (null === a[g]) g++;
                      else if (null === a[k]) k--;
                      else if (y[g] === v[b])
                        (p[b] = (0, _.fk)(a[g], c[b])), g++, b++;
                      else if (y[k] === v[w])
                        (p[w] = (0, _.fk)(a[k], c[w])), k--, w--;
                      else if (y[g] === v[w])
                        (p[w] = (0, _.fk)(a[g], c[w])),
                          (0, _._Y)(t, p[w + 1], a[g]),
                          g++,
                          w--;
                      else if (y[k] === v[b])
                        (p[b] = (0, _.fk)(a[k], c[b])),
                          (0, _._Y)(t, a[g], a[k]),
                          k--,
                          b++;
                      else if (
                        (void 0 === f && ((f = d(v, b, w)), (m = d(y, g, k))),
                        f.has(y[g]))
                      )
                        if (f.has(y[k])) {
                          var C = m.get(v[b]),
                            E = void 0 !== C ? a[C] : null;
                          if (null === E) {
                            var S = (0, _._Y)(t, a[g]);
                            (0, _.fk)(S, c[b]), (p[b] = S);
                          } else
                            (p[b] = (0, _.fk)(E, c[b])),
                              (0, _._Y)(t, a[g], E),
                              (a[C] = null);
                          b++;
                        } else (0, _.ws)(a[k]), k--;
                      else (0, _.ws)(a[g]), g++;
                    for (; b <= w; ) {
                      var Z = (0, _._Y)(t, p[w + 1]);
                      (0, _.fk)(Z, c[b]), (p[b++] = Z);
                    }
                    for (; g <= k; ) {
                      var L = a[g++];
                      null !== L && (0, _.ws)(L);
                    }
                    return (this.ut = v), (0, _.hl)(t, p), u.Jb;
                  },
                },
              ]),
              e
            );
          })(c.Xe)
        );
    },
    36585: function (t, e, i) {
      i.d(e, {
        sR: function () {
          return g;
        },
      });
      var n = i(46097),
        r = i(71650),
        s = i(33368),
        l = i(68308),
        o = i(34541),
        a = i(47838),
        h = i(69205),
        u = i(40039),
        c =
          (i(51358),
          i(46798),
          i(78399),
          i(5239),
          i(56086),
          i(47884),
          i(81912),
          i(64584),
          i(41483),
          i(12367),
          i(9454),
          i(98490),
          i(41005)),
        _ = i(16616),
        d = function t(e, i) {
          var n,
            r,
            s = e._$AN;
          if (void 0 === s) return !1;
          var l,
            o = (0, u.Z)(s);
          try {
            for (o.s(); !(l = o.n()).done; ) {
              var a = l.value;
              null === (r = (n = a)._$AO) || void 0 === r || r.call(n, i, !1),
                t(a, i);
            }
          } catch (h) {
            o.e(h);
          } finally {
            o.f();
          }
          return !0;
        },
        v = function (t) {
          var e, i;
          do {
            if (void 0 === (e = t._$AM)) break;
            (i = e._$AN).delete(t), (t = e);
          } while (0 === (null == i ? void 0 : i.size));
        },
        f = function (t) {
          for (var e; (e = t._$AM); t = e) {
            var i = e._$AN;
            if (void 0 === i) e._$AN = i = new Set();
            else if (i.has(t)) break;
            i.add(t), p(e);
          }
        };
      function m(t) {
        void 0 !== this._$AN
          ? (v(this), (this._$AM = t), f(this))
          : (this._$AM = t);
      }
      function y(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
          n = this._$AH,
          r = this._$AN;
        if (void 0 !== r && 0 !== r.size)
          if (e)
            if (Array.isArray(n))
              for (var s = i; s < n.length; s++) d(n[s], !1), v(n[s]);
            else null != n && (d(n, !1), v(n));
          else d(this, t);
      }
      var p = function (t) {
          var e, i, n, r;
          t.type == _.pX.CHILD &&
            ((null !== (e = (n = t)._$AP) && void 0 !== e) || (n._$AP = y),
            (null !== (i = (r = t)._$AQ) && void 0 !== i) || (r._$AQ = m));
        },
        g = (function (t) {
          function e() {
            var t;
            return (
              (0, r.Z)(this, e),
              ((t = (0, l.Z)(this, e, arguments))._$AN = void 0),
              t
            );
          }
          return (
            (0, h.Z)(e, t),
            (0, s.Z)(e, [
              {
                key: "_$AT",
                value: function (t, i, n) {
                  (0, o.Z)((0, a.Z)(e.prototype), "_$AT", this).call(
                    this,
                    t,
                    i,
                    n
                  ),
                    f(this),
                    (this.isConnected = t._$AU);
                },
              },
              {
                key: "_$AO",
                value: function (t) {
                  var e,
                    i,
                    n =
                      !(arguments.length > 1 && void 0 !== arguments[1]) ||
                      arguments[1];
                  t !== this.isConnected &&
                    ((this.isConnected = t),
                    t
                      ? null === (e = this.reconnected) ||
                        void 0 === e ||
                        e.call(this)
                      : null === (i = this.disconnected) ||
                        void 0 === i ||
                        i.call(this)),
                    n && (d(this, t), v(this));
                },
              },
              {
                key: "setValue",
                value: function (t) {
                  if ((0, c.OR)(this._$Ct)) this._$Ct._$AI(t, this);
                  else {
                    var e = (0, n.Z)(this._$Ct._$AH);
                    (e[this._$Ci] = t), this._$Ct._$AI(e, this, 0);
                  }
                },
              },
              { key: "disconnected", value: function () {} },
              { key: "reconnected", value: function () {} },
            ]),
            e
          );
        })(_.Xe);
    },
  },
]);
//# sourceMappingURL=8565.wJ9COULmd4M.js.map
