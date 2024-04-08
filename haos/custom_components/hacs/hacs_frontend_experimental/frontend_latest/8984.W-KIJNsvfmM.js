/*! For license information please see 8984.W-KIJNsvfmM.js.LICENSE.txt */
export const id = 8984;
export const ids = [8984];
export const modules = {
  68984: (t, e, i) => {
    i.r(e),
      i.d(e, {
        LitVirtualizer: () => z,
        RangeChangedEvent: () => c,
        VisibilityChangedEvent: () => _,
      });
    var s,
      l = i(43204),
      n = i(5095),
      r = i(5701),
      o = i(57835),
      h = i(76187),
      a = i(99266);
    class c extends Event {
      constructor(t) {
        super(c.eventName, { bubbles: !1 }),
          (this.first = t.first),
          (this.last = t.last);
      }
    }
    c.eventName = "rangeChanged";
    class _ extends Event {
      constructor(t) {
        super(_.eventName, { bubbles: !1 }),
          (this.first = t.first),
          (this.last = t.last);
      }
    }
    _.eventName = "visibilityChanged";
    class d extends Event {
      constructor() {
        super(d.eventName, { bubbles: !1 });
      }
    }
    d.eventName = "unpinned";
    class u {
      constructor(t) {
        this._element = null;
        const e = null != t ? t : window;
        (this._node = e), t && (this._element = t);
      }
      get element() {
        return (
          this._element || document.scrollingElement || document.documentElement
        );
      }
      get scrollTop() {
        return this.element.scrollTop || window.scrollY;
      }
      get scrollLeft() {
        return this.element.scrollLeft || window.scrollX;
      }
      get scrollHeight() {
        return this.element.scrollHeight;
      }
      get scrollWidth() {
        return this.element.scrollWidth;
      }
      get viewportHeight() {
        return this._element
          ? this._element.getBoundingClientRect().height
          : window.innerHeight;
      }
      get viewportWidth() {
        return this._element
          ? this._element.getBoundingClientRect().width
          : window.innerWidth;
      }
      get maxScrollTop() {
        return this.scrollHeight - this.viewportHeight;
      }
      get maxScrollLeft() {
        return this.scrollWidth - this.viewportWidth;
      }
    }
    class m extends u {
      constructor(t, e) {
        super(e),
          (this._clients = new Set()),
          (this._retarget = null),
          (this._end = null),
          (this.__destination = null),
          (this.correctingScrollError = !1),
          (this._checkForArrival = this._checkForArrival.bind(this)),
          (this._updateManagedScrollTo =
            this._updateManagedScrollTo.bind(this)),
          (this.scrollTo = this.scrollTo.bind(this)),
          (this.scrollBy = this.scrollBy.bind(this));
        const i = this._node;
        (this._originalScrollTo = i.scrollTo),
          (this._originalScrollBy = i.scrollBy),
          (this._originalScroll = i.scroll),
          this._attach(t);
      }
      get _destination() {
        return this.__destination;
      }
      get scrolling() {
        return null !== this._destination;
      }
      scrollTo(t, e) {
        const i =
          "number" == typeof t && "number" == typeof e
            ? { left: t, top: e }
            : t;
        this._scrollTo(i);
      }
      scrollBy(t, e) {
        const i =
          "number" == typeof t && "number" == typeof e
            ? { left: t, top: e }
            : t;
        void 0 !== i.top && (i.top += this.scrollTop),
          void 0 !== i.left && (i.left += this.scrollLeft),
          this._scrollTo(i);
      }
      _nativeScrollTo(t) {
        this._originalScrollTo.bind(this._element || window)(t);
      }
      _scrollTo(t, e = null, i = null) {
        null !== this._end && this._end(),
          "smooth" === t.behavior
            ? (this._setDestination(t), (this._retarget = e), (this._end = i))
            : this._resetScrollState(),
          this._nativeScrollTo(t);
      }
      _setDestination(t) {
        let { top: e, left: i } = t;
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
            ((this.__destination = { top: e, left: i, behavior: "smooth" }), !0)
        );
      }
      _resetScrollState() {
        (this.__destination = null),
          (this._retarget = null),
          (this._end = null);
      }
      _updateManagedScrollTo(t) {
        this._destination &&
          this._setDestination(t) &&
          this._nativeScrollTo(this._destination);
      }
      managedScrollTo(t, e, i) {
        return this._scrollTo(t, e, i), this._updateManagedScrollTo;
      }
      correctScrollError(t) {
        (this.correctingScrollError = !0),
          requestAnimationFrame(() =>
            requestAnimationFrame(() => (this.correctingScrollError = !1))
          ),
          this._nativeScrollTo(t),
          this._retarget && this._setDestination(this._retarget()),
          this._destination && this._nativeScrollTo(this._destination);
      }
      _checkForArrival() {
        if (null !== this._destination) {
          const { scrollTop: t, scrollLeft: e } = this;
          let { top: i, left: s } = this._destination;
          (i = Math.min(i || 0, this.maxScrollTop)),
            (s = Math.min(s || 0, this.maxScrollLeft));
          const l = Math.abs(i - t),
            n = Math.abs(s - e);
          l < 1 &&
            n < 1 &&
            (this._end && this._end(), this._resetScrollState());
        }
      }
      detach(t) {
        return (
          this._clients.delete(t),
          0 === this._clients.size &&
            ((this._node.scrollTo = this._originalScrollTo),
            (this._node.scrollBy = this._originalScrollBy),
            (this._node.scroll = this._originalScroll),
            this._node.removeEventListener("scroll", this._checkForArrival)),
          null
        );
      }
      _attach(t) {
        this._clients.add(t),
          1 === this._clients.size &&
            ((this._node.scrollTo = this.scrollTo),
            (this._node.scrollBy = this.scrollBy),
            (this._node.scroll = this.scrollTo),
            this._node.addEventListener("scroll", this._checkForArrival));
      }
    }
    let p = null === (s = window) || void 0 === s ? void 0 : s.ResizeObserver;
    const v = Symbol("virtualizerRef"),
      f = "virtualizer-sizer";
    let y;
    class g {
      constructor(t) {
        if (
          ((this._benchmarkStart = null),
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
          !t)
        )
          throw new Error(
            "Virtualizer constructor requires a configuration object"
          );
        if (!t.hostElement)
          throw new Error(
            'Virtualizer configuration requires the "hostElement" property'
          );
        this._init(t);
      }
      set items(t) {
        Array.isArray(t) &&
          t !== this._items &&
          ((this._itemsChanged = !0),
          (this._items = t),
          this._schedule(this._updateLayout));
      }
      _init(t) {
        (this._isScroller = !!t.scroller), this._initHostElement(t);
        const e = t.layout || {};
        this._layoutInitialized = this._initLayout(e);
      }
      _initObservers() {
        (this._mutationObserver = new MutationObserver(
          this._finishDOMUpdate.bind(this)
        )),
          (this._hostElementRO = new p(() => this._hostElementSizeChanged())),
          (this._childrenRO = new p(this._childrenSizeChanged.bind(this)));
      }
      _initHostElement(t) {
        const e = (this._hostElement = t.hostElement);
        this._applyVirtualizerStyles(), (e[v] = this);
      }
      connected() {
        this._initObservers();
        const t = this._isScroller;
        (this._clippingAncestors = (function (t, e = !1) {
          let i = !1;
          return (function (t, e = !1) {
            const i = [];
            let s = e ? t : w(t);
            for (; null !== s; ) i.push(s), (s = w(s));
            return i;
          })(t, e).filter((t) => {
            if (i) return !1;
            const e = getComputedStyle(t);
            return (i = "fixed" === e.position), "visible" !== e.overflow;
          });
        })(this._hostElement, t)),
          (this._scrollerController = new m(this, this._clippingAncestors[0])),
          this._schedule(this._updateLayout),
          this._observeAndListen();
      }
      _observeAndListen() {
        this._mutationObserver.observe(this._hostElement, { childList: !0 }),
          this._hostElementRO.observe(this._hostElement),
          this._scrollEventListeners.push(window),
          window.addEventListener(
            "scroll",
            this,
            this._scrollEventListenerOptions
          ),
          this._clippingAncestors.forEach((t) => {
            t.addEventListener(
              "scroll",
              this,
              this._scrollEventListenerOptions
            ),
              this._scrollEventListeners.push(t),
              this._hostElementRO.observe(t);
          }),
          this._hostElementRO.observe(this._scrollerController.element),
          this._children.forEach((t) => this._childrenRO.observe(t)),
          this._scrollEventListeners.forEach((t) =>
            t.addEventListener("scroll", this, this._scrollEventListenerOptions)
          );
      }
      disconnected() {
        var t, e, i, s;
        this._scrollEventListeners.forEach((t) =>
          t.removeEventListener(
            "scroll",
            this,
            this._scrollEventListenerOptions
          )
        ),
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
          null === (i = this._hostElementRO) || void 0 === i || i.disconnect(),
          (this._hostElementRO = null),
          null === (s = this._childrenRO) || void 0 === s || s.disconnect(),
          (this._childrenRO = null),
          this._rejectLayoutCompletePromise("disconnected");
      }
      _applyVirtualizerStyles() {
        const t = this._hostElement.style;
        (t.display = t.display || "block"),
          (t.position = t.position || "relative"),
          (t.contain = t.contain || "size layout"),
          this._isScroller &&
            ((t.overflow = t.overflow || "auto"),
            (t.minHeight = t.minHeight || "150px"));
      }
      _getSizer() {
        const t = this._hostElement;
        if (!this._sizer) {
          let e = t.querySelector(`[${f}]`);
          e ||
            ((e = document.createElement("div")),
            e.setAttribute(f, ""),
            t.appendChild(e)),
            Object.assign(e.style, {
              position: "absolute",
              margin: "-2px 0 0 0",
              padding: 0,
              visibility: "hidden",
              fontSize: "2px",
            }),
            (e.textContent = "&nbsp;"),
            e.setAttribute(f, ""),
            (this._sizer = e);
        }
        return this._sizer;
      }
      async updateLayoutConfig(t) {
        await this._layoutInitialized;
        const e = t.type || y;
        if ("function" == typeof e && this._layout instanceof e) {
          const e = { ...t };
          return delete e.type, (this._layout.config = e), !0;
        }
        return !1;
      }
      async _initLayout(t) {
        let e, s;
        if ("function" == typeof t.type) {
          s = t.type;
          const i = { ...t };
          delete i.type, (e = i);
        } else e = t;
        void 0 === s &&
          (y = s = (await i.e(4093).then(i.bind(i, 64093))).FlowLayout),
          (this._layout = new s((t) => this._handleLayoutMessage(t), e)),
          this._layout.measureChildren &&
            "function" == typeof this._layout.updateItemSizes &&
            ("function" == typeof this._layout.measureChildren &&
              (this._measureChildOverride = this._layout.measureChildren),
            (this._measureCallback = this._layout.updateItemSizes.bind(
              this._layout
            ))),
          this._layout.listenForChildLoadEvents &&
            this._hostElement.addEventListener("load", this._loadListener, !0),
          this._schedule(this._updateLayout);
      }
      startBenchmarking() {
        null === this._benchmarkStart &&
          (this._benchmarkStart = window.performance.now());
      }
      stopBenchmarking() {
        if (null !== this._benchmarkStart) {
          const t = window.performance.now(),
            e = t - this._benchmarkStart,
            i = performance
              .getEntriesByName("uv-virtualizing", "measure")
              .filter(
                (e) => e.startTime >= this._benchmarkStart && e.startTime < t
              )
              .reduce((t, e) => t + e.duration, 0);
          return (
            (this._benchmarkStart = null),
            { timeElapsed: e, virtualizationTime: i }
          );
        }
        return null;
      }
      _measureChildren() {
        const t = {},
          e = this._children,
          i = this._measureChildOverride || this._measureChild;
        for (let s = 0; s < e.length; s++) {
          const l = e[s],
            n = this._first + s;
          (this._itemsChanged || this._toBeMeasured.has(l)) &&
            (t[n] = i.call(this, l, this._items[n]));
        }
        (this._childMeasurements = t),
          this._schedule(this._updateLayout),
          this._toBeMeasured.clear();
      }
      _measureChild(t) {
        const { width: e, height: i } = t.getBoundingClientRect();
        return Object.assign(
          { width: e, height: i },
          (function (t) {
            const e = window.getComputedStyle(t);
            return {
              marginTop: C(e.marginTop),
              marginRight: C(e.marginRight),
              marginBottom: C(e.marginBottom),
              marginLeft: C(e.marginLeft),
            };
          })(t)
        );
      }
      async _schedule(t) {
        this._scheduled.has(t) ||
          (this._scheduled.add(t),
          await Promise.resolve(),
          this._scheduled.delete(t),
          t.call(this));
      }
      async _updateDOM(t) {
        (this._scrollSize = t.scrollSize),
          this._adjustRange(t.range),
          (this._childrenPos = t.childPositions),
          (this._scrollError = t.scrollError || null);
        const { _rangeChanged: e, _itemsChanged: i } = this;
        this._visibilityChanged &&
          (this._notifyVisibility(), (this._visibilityChanged = !1)),
          (e || i) && (this._notifyRange(), (this._rangeChanged = !1)),
          this._finishDOMUpdate();
      }
      _finishDOMUpdate() {
        this._children.forEach((t) => this._childrenRO.observe(t)),
          this._checkScrollIntoViewTarget(this._childrenPos),
          this._positionChildren(this._childrenPos),
          this._sizeHostElement(this._scrollSize),
          this._correctScrollError(),
          this._benchmarkStart &&
            "mark" in window.performance &&
            window.performance.mark("uv-end");
      }
      _updateLayout() {
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
      }
      _handleScrollEvent() {
        if (this._benchmarkStart && "mark" in window.performance) {
          try {
            window.performance.measure("uv-virtualizing", "uv-start", "uv-end");
          } catch (t) {
            console.warn("Error measuring performance data: ", t);
          }
          window.performance.mark("uv-start");
        }
        var t;
        !1 === this._scrollerController.correctingScrollError &&
          (null === (t = this._layout) || void 0 === t || t.unpin());
        this._schedule(this._updateLayout);
      }
      handleEvent(t) {
        if ("scroll" === t.type)
          (t.currentTarget === window ||
            this._clippingAncestors.includes(t.currentTarget)) &&
            this._handleScrollEvent();
        else console.warn("event not handled", t);
      }
      _handleLayoutMessage(t) {
        "stateChanged" === t.type
          ? this._updateDOM(t)
          : "visibilityChanged" === t.type
          ? ((this._firstVisible = t.firstVisible),
            (this._lastVisible = t.lastVisible),
            this._notifyVisibility())
          : "unpinned" === t.type && this._hostElement.dispatchEvent(new d());
      }
      get _children() {
        const t = [];
        let e = this._hostElement.firstElementChild;
        for (; e; ) e.hasAttribute(f) || t.push(e), (e = e.nextElementSibling);
        return t;
      }
      _updateView() {
        var t;
        const e = this._hostElement,
          i =
            null === (t = this._scrollerController) || void 0 === t
              ? void 0
              : t.element,
          s = this._layout;
        if (e && i && s) {
          let t, l, n, r;
          const o = e.getBoundingClientRect();
          (t = 0), (l = 0), (n = window.innerHeight), (r = window.innerWidth);
          const h = this._clippingAncestors.map((t) =>
            t.getBoundingClientRect()
          );
          h.unshift(o);
          for (const e of h)
            (t = Math.max(t, e.top)),
              (l = Math.max(l, e.left)),
              (n = Math.min(n, e.bottom)),
              (r = Math.min(r, e.right));
          const a = i.getBoundingClientRect(),
            c = { left: o.left - a.left, top: o.top - a.top },
            _ = { width: i.scrollWidth, height: i.scrollHeight },
            d = t - o.top + e.scrollTop,
            u = l - o.left + e.scrollLeft,
            m = n - t,
            p = r - l;
          (s.viewportSize = { width: p, height: m }),
            (s.viewportScroll = { top: d, left: u }),
            (s.totalScrollSize = _),
            (s.offsetWithinScroller = c);
        }
      }
      _sizeHostElement(t) {
        const e = 82e5,
          i = t && null !== t.width ? Math.min(e, t.width) : 0,
          s = t && null !== t.height ? Math.min(e, t.height) : 0;
        if (this._isScroller)
          this._getSizer().style.transform = `translate(${i}px, ${s}px)`;
        else {
          const t = this._hostElement.style;
          (t.minWidth = i ? `${i}px` : "100%"),
            (t.minHeight = s ? `${s}px` : "100%");
        }
      }
      _positionChildren(t) {
        t &&
          t.forEach(
            (
              { top: t, left: e, width: i, height: s, xOffset: l, yOffset: n },
              r
            ) => {
              const o = this._children[r - this._first];
              o &&
                ((o.style.position = "absolute"),
                (o.style.boxSizing = "border-box"),
                (o.style.transform = `translate(${e}px, ${t}px)`),
                void 0 !== i && (o.style.width = i + "px"),
                void 0 !== s && (o.style.height = s + "px"),
                (o.style.left = void 0 === l ? null : l + "px"),
                (o.style.top = void 0 === n ? null : n + "px"));
            }
          );
      }
      async _adjustRange(t) {
        const { _first: e, _last: i, _firstVisible: s, _lastVisible: l } = this;
        (this._first = t.first),
          (this._last = t.last),
          (this._firstVisible = t.firstVisible),
          (this._lastVisible = t.lastVisible),
          (this._rangeChanged =
            this._rangeChanged || this._first !== e || this._last !== i),
          (this._visibilityChanged =
            this._visibilityChanged ||
            this._firstVisible !== s ||
            this._lastVisible !== l);
      }
      _correctScrollError() {
        if (this._scrollError) {
          const { scrollTop: t, scrollLeft: e } = this._scrollerController,
            { top: i, left: s } = this._scrollError;
          (this._scrollError = null),
            this._scrollerController.correctScrollError({
              top: t - i,
              left: e - s,
            });
        }
      }
      element(t) {
        var e;
        return (
          t === 1 / 0 && (t = this._items.length - 1),
          void 0 ===
          (null === (e = this._items) || void 0 === e ? void 0 : e[t])
            ? void 0
            : {
                scrollIntoView: (e = {}) =>
                  this._scrollElementIntoView({ ...e, index: t }),
              }
        );
      }
      _scrollElementIntoView(t) {
        if (t.index >= this._first && t.index <= this._last)
          this._children[t.index - this._first].scrollIntoView(t);
        else if (
          ((t.index = Math.min(t.index, this._items.length - 1)),
          "smooth" === t.behavior)
        ) {
          const e = this._layout.getScrollIntoViewCoordinates(t),
            { behavior: i } = t;
          (this._updateScrollIntoViewCoordinates =
            this._scrollerController.managedScrollTo(
              Object.assign(e, { behavior: i }),
              () => this._layout.getScrollIntoViewCoordinates(t),
              () => (this._scrollIntoViewTarget = null)
            )),
            (this._scrollIntoViewTarget = t);
        } else this._layout.pin = t;
      }
      _checkScrollIntoViewTarget(t) {
        const { index: e } = this._scrollIntoViewTarget || {};
        e &&
          null != t &&
          t.has(e) &&
          this._updateScrollIntoViewCoordinates(
            this._layout.getScrollIntoViewCoordinates(
              this._scrollIntoViewTarget
            )
          );
      }
      _notifyRange() {
        this._hostElement.dispatchEvent(
          new c({ first: this._first, last: this._last })
        );
      }
      _notifyVisibility() {
        this._hostElement.dispatchEvent(
          new _({ first: this._firstVisible, last: this._lastVisible })
        );
      }
      get layoutComplete() {
        return (
          this._layoutCompletePromise ||
            (this._layoutCompletePromise = new Promise((t, e) => {
              (this._layoutCompleteResolver = t),
                (this._layoutCompleteRejecter = e);
            })),
          this._layoutCompletePromise
        );
      }
      _rejectLayoutCompletePromise(t) {
        null !== this._layoutCompleteRejecter &&
          this._layoutCompleteRejecter(t),
          this._resetLayoutCompleteState();
      }
      _scheduleLayoutComplete() {
        this._layoutCompletePromise &&
          null === this._pendingLayoutComplete &&
          (this._pendingLayoutComplete = requestAnimationFrame(() =>
            requestAnimationFrame(() => this._resolveLayoutCompletePromise())
          ));
      }
      _resolveLayoutCompletePromise() {
        null !== this._layoutCompleteResolver && this._layoutCompleteResolver(),
          this._resetLayoutCompleteState();
      }
      _resetLayoutCompleteState() {
        (this._layoutCompletePromise = null),
          (this._layoutCompleteResolver = null),
          (this._layoutCompleteRejecter = null),
          (this._pendingLayoutComplete = null);
      }
      _hostElementSizeChanged() {
        this._schedule(this._updateLayout);
      }
      _childLoaded() {}
      _childrenSizeChanged(t) {
        var e;
        if (null !== (e = this._layout) && void 0 !== e && e.measureChildren) {
          for (const e of t) this._toBeMeasured.set(e.target, e.contentRect);
          this._measureChildren();
        }
        this._scheduleLayoutComplete(),
          (this._itemsChanged = !1),
          (this._rangeChanged = !1);
      }
    }
    function C(t) {
      const e = t ? parseFloat(t) : NaN;
      return Number.isNaN(e) ? 0 : e;
    }
    function w(t) {
      if (null !== t.assignedSlot) return t.assignedSlot;
      if (null !== t.parentElement) return t.parentElement;
      const e = t.parentNode;
      return (
        (e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host) || null
      );
    }
    const b = (t) => t,
      E = (t, e) => n.dy`${e}: ${JSON.stringify(t, null, 2)}`;
    class S extends h.sR {
      constructor(t) {
        if (
          (super(t),
          (this._virtualizer = null),
          (this._first = 0),
          (this._last = -1),
          (this._renderItem = (t, e) => E(t, e + this._first)),
          (this._keyFunction = (t, e) => b(t, this._first)),
          (this._items = []),
          t.type !== o.pX.CHILD)
        )
          throw new Error(
            "The virtualize directive can only be used in child expressions"
          );
      }
      render(t) {
        t && this._setFunctions(t);
        const e = [];
        if (this._first >= 0 && this._last >= this._first)
          for (let t = this._first; t <= this._last; t++)
            e.push(this._items[t]);
        return (0, a.r)(e, this._keyFunction, this._renderItem);
      }
      update(t, [e]) {
        this._setFunctions(e);
        const i = this._items !== e.items;
        return (
          (this._items = e.items || []),
          this._virtualizer
            ? this._updateVirtualizerConfig(t, e)
            : this._initialize(t, e),
          i ? n.Jb : this.render()
        );
      }
      async _updateVirtualizerConfig(t, e) {
        if (!(await this._virtualizer.updateLayoutConfig(e.layout || {}))) {
          const i = t.parentNode;
          this._makeVirtualizer(i, e);
        }
        this._virtualizer.items = this._items;
      }
      _setFunctions(t) {
        const { renderItem: e, keyFunction: i } = t;
        e && (this._renderItem = (t, i) => e(t, i + this._first)),
          i && (this._keyFunction = (t, e) => i(t, e + this._first));
      }
      _makeVirtualizer(t, e) {
        this._virtualizer && this._virtualizer.disconnected();
        const { layout: i, scroller: s, items: l } = e;
        (this._virtualizer = new g({ hostElement: t, layout: i, scroller: s })),
          (this._virtualizer.items = l),
          this._virtualizer.connected();
      }
      _initialize(t, e) {
        const i = t.parentNode;
        i &&
          1 === i.nodeType &&
          (i.addEventListener("rangeChanged", (t) => {
            (this._first = t.first),
              (this._last = t.last),
              this.setValue(this.render());
          }),
          this._makeVirtualizer(i, e));
      }
      disconnected() {
        var t;
        null === (t = this._virtualizer) || void 0 === t || t.disconnected();
      }
      reconnected() {
        var t;
        null === (t = this._virtualizer) || void 0 === t || t.connected();
      }
    }
    const L = (0, o.XM)(S);
    class z extends n.oi {
      constructor() {
        super(...arguments),
          (this.items = []),
          (this.renderItem = E),
          (this.keyFunction = b),
          (this.layout = {}),
          (this.scroller = !1);
      }
      createRenderRoot() {
        return this;
      }
      render() {
        const {
          items: t,
          renderItem: e,
          keyFunction: i,
          layout: s,
          scroller: l,
        } = this;
        return n.dy`${L({
          items: t,
          renderItem: e,
          keyFunction: i,
          layout: s,
          scroller: l,
        })}`;
      }
      element(t) {
        var e;
        return null === (e = this[v]) || void 0 === e ? void 0 : e.element(t);
      }
      get layoutComplete() {
        var t;
        return null === (t = this[v]) || void 0 === t
          ? void 0
          : t.layoutComplete;
      }
      scrollToIndex(t, e = "start") {
        var i;
        null === (i = this.element(t)) ||
          void 0 === i ||
          i.scrollIntoView({ block: e });
      }
    }
    (0, l.__decorate)(
      [(0, r.C)({ attribute: !1 })],
      z.prototype,
      "items",
      void 0
    ),
      (0, l.__decorate)([(0, r.C)()], z.prototype, "renderItem", void 0),
      (0, l.__decorate)([(0, r.C)()], z.prototype, "keyFunction", void 0),
      (0, l.__decorate)(
        [(0, r.C)({ attribute: !1 })],
        z.prototype,
        "layout",
        void 0
      ),
      (0, l.__decorate)(
        [(0, r.C)({ reflect: !0, type: Boolean })],
        z.prototype,
        "scroller",
        void 0
      ),
      customElements.define("lit-virtualizer", z);
  },
  76187: (t, e, i) => {
    i.d(e, { sR: () => s.sR });
    var s = i(36585);
  },
  99266: (t, e, i) => {
    i.d(e, { r: () => o });
    var s = i(32982),
      l = i(16616),
      n = i(41005);
    const r = (t, e, i) => {
        const s = new Map();
        for (let l = e; l <= i; l++) s.set(t[l], l);
        return s;
      },
      o = (0, l.XM)(
        class extends l.Xe {
          constructor(t) {
            if ((super(t), t.type !== l.pX.CHILD))
              throw Error("repeat() can only be used in text expressions");
          }
          ct(t, e, i) {
            let s;
            void 0 === i ? (i = e) : void 0 !== e && (s = e);
            const l = [],
              n = [];
            let r = 0;
            for (const e of t) (l[r] = s ? s(e, r) : r), (n[r] = i(e, r)), r++;
            return { values: n, keys: l };
          }
          render(t, e, i) {
            return this.ct(t, e, i).values;
          }
          update(t, [e, i, l]) {
            var o;
            const h = (0, n.i9)(t),
              { values: a, keys: c } = this.ct(e, i, l);
            if (!Array.isArray(h)) return (this.ut = c), a;
            const _ =
                null !== (o = this.ut) && void 0 !== o ? o : (this.ut = []),
              d = [];
            let u,
              m,
              p = 0,
              v = h.length - 1,
              f = 0,
              y = a.length - 1;
            for (; p <= v && f <= y; )
              if (null === h[p]) p++;
              else if (null === h[v]) v--;
              else if (_[p] === c[f]) (d[f] = (0, n.fk)(h[p], a[f])), p++, f++;
              else if (_[v] === c[y]) (d[y] = (0, n.fk)(h[v], a[y])), v--, y--;
              else if (_[p] === c[y])
                (d[y] = (0, n.fk)(h[p], a[y])),
                  (0, n._Y)(t, d[y + 1], h[p]),
                  p++,
                  y--;
              else if (_[v] === c[f])
                (d[f] = (0, n.fk)(h[v], a[f])),
                  (0, n._Y)(t, h[p], h[v]),
                  v--,
                  f++;
              else if (
                (void 0 === u && ((u = r(c, f, y)), (m = r(_, p, v))),
                u.has(_[p]))
              )
                if (u.has(_[v])) {
                  const e = m.get(c[f]),
                    i = void 0 !== e ? h[e] : null;
                  if (null === i) {
                    const e = (0, n._Y)(t, h[p]);
                    (0, n.fk)(e, a[f]), (d[f] = e);
                  } else
                    (d[f] = (0, n.fk)(i, a[f])),
                      (0, n._Y)(t, h[p], i),
                      (h[e] = null);
                  f++;
                } else (0, n.ws)(h[v]), v--;
              else (0, n.ws)(h[p]), p++;
            for (; f <= y; ) {
              const e = (0, n._Y)(t, d[y + 1]);
              (0, n.fk)(e, a[f]), (d[f++] = e);
            }
            for (; p <= v; ) {
              const t = h[p++];
              null !== t && (0, n.ws)(t);
            }
            return (this.ut = c), (0, n.hl)(t, d), s.Jb;
          }
        }
      );
  },
  36585: (t, e, i) => {
    i.d(e, { sR: () => _ });
    var s = i(41005),
      l = i(16616);
    const n = (t, e) => {
        var i, s;
        const l = t._$AN;
        if (void 0 === l) return !1;
        for (const t of l)
          null === (s = (i = t)._$AO) || void 0 === s || s.call(i, e, !1),
            n(t, e);
        return !0;
      },
      r = (t) => {
        let e, i;
        do {
          if (void 0 === (e = t._$AM)) break;
          (i = e._$AN), i.delete(t), (t = e);
        } while (0 === (null == i ? void 0 : i.size));
      },
      o = (t) => {
        for (let e; (e = t._$AM); t = e) {
          let i = e._$AN;
          if (void 0 === i) e._$AN = i = new Set();
          else if (i.has(t)) break;
          i.add(t), c(e);
        }
      };
    function h(t) {
      void 0 !== this._$AN
        ? (r(this), (this._$AM = t), o(this))
        : (this._$AM = t);
    }
    function a(t, e = !1, i = 0) {
      const s = this._$AH,
        l = this._$AN;
      if (void 0 !== l && 0 !== l.size)
        if (e)
          if (Array.isArray(s))
            for (let t = i; t < s.length; t++) n(s[t], !1), r(s[t]);
          else null != s && (n(s, !1), r(s));
        else n(this, t);
    }
    const c = (t) => {
      var e, i, s, n;
      t.type == l.pX.CHILD &&
        ((null !== (e = (s = t)._$AP) && void 0 !== e) || (s._$AP = a),
        (null !== (i = (n = t)._$AQ) && void 0 !== i) || (n._$AQ = h));
    };
    class _ extends l.Xe {
      constructor() {
        super(...arguments), (this._$AN = void 0);
      }
      _$AT(t, e, i) {
        super._$AT(t, e, i), o(this), (this.isConnected = t._$AU);
      }
      _$AO(t, e = !0) {
        var i, s;
        t !== this.isConnected &&
          ((this.isConnected = t),
          t
            ? null === (i = this.reconnected) || void 0 === i || i.call(this)
            : null === (s = this.disconnected) || void 0 === s || s.call(this)),
          e && (n(this, t), r(this));
      }
      setValue(t) {
        if ((0, s.OR)(this._$Ct)) this._$Ct._$AI(t, this);
        else {
          const e = [...this._$Ct._$AH];
          (e[this._$Ci] = t), this._$Ct._$AI(e, this, 0);
        }
      }
      disconnected() {}
      reconnected() {}
    }
  },
};
//# sourceMappingURL=8984.W-KIJNsvfmM.js.map
