import {
  S as t,
  f as e,
  e as i,
  t as s,
  j as r,
  y as n,
} from "./main-ec7846c8.js";
import { c as l } from "./c.55291b50.js";
class o {
  constructor(e = !0) {
    t(this, "_storage", {}),
      t(this, "_listeners", {}),
      e &&
        window.addEventListener("storage", (t) => {
          t.key &&
            this.hasKey(t.key) &&
            ((this._storage[t.key] = t.newValue
              ? JSON.parse(t.newValue)
              : t.newValue),
            this._listeners[t.key] &&
              this._listeners[t.key].forEach((e) =>
                e(
                  t.oldValue ? JSON.parse(t.oldValue) : t.oldValue,
                  this._storage[t.key]
                )
              ));
        });
  }
  addFromStorage(t) {
    if (!this._storage[t]) {
      const e = window.localStorage.getItem(t);
      e && (this._storage[t] = JSON.parse(e));
    }
  }
  subscribeChanges(t, e) {
    return (
      this._listeners[t]
        ? this._listeners[t].push(e)
        : (this._listeners[t] = [e]),
      () => {
        this.unsubscribeChanges(t, e);
      }
    );
  }
  unsubscribeChanges(t, e) {
    if (!(t in this._listeners)) return;
    const i = this._listeners[t].indexOf(e);
    -1 !== i && this._listeners[t].splice(i, 1);
  }
  hasKey(t) {
    return t in this._storage;
  }
  getValue(t) {
    return this._storage[t];
  }
  setValue(t, e) {
    this._storage[t] = e;
    try {
      void 0 === e
        ? window.localStorage.removeItem(t)
        : window.localStorage.setItem(t, JSON.stringify(e));
    } catch (t) {}
  }
}
const h = new o(),
  a =
    (t, e, i = !0, s) =>
    (r) => {
      const n = i ? h : new o(!1),
        l = String(r.key);
      t = t || String(r.key);
      const a = r.initializer ? r.initializer() : void 0;
      n.addFromStorage(t);
      const c = () => (n.hasKey(t) ? n.getValue(t) : a);
      return {
        kind: "method",
        placement: "prototype",
        key: r.key,
        descriptor: {
          set(i) {
            ((i, s) => {
              let l;
              e && (l = c()), n.setValue(t, s), e && i.requestUpdate(r.key, l);
            })(this, i);
          },
          get: () => c(),
          enumerable: !0,
          configurable: !0,
        },
        finisher(o) {
          if (e && i) {
            const e = o.prototype.connectedCallback,
              i = o.prototype.disconnectedCallback;
            (o.prototype.connectedCallback = function () {
              var i;
              e.call(this),
                (this[`__unbsubLocalStorage${l}`] =
                  ((i = this),
                  n.subscribeChanges(t, (t) => {
                    i.requestUpdate(r.key, t);
                  })));
            }),
              (o.prototype.disconnectedCallback = function () {
                i.call(this), this[`__unbsubLocalStorage${l}`]();
              });
          }
          e && o.createProperty(r.key, { noAccessor: !0, ...s });
        },
      };
    };
let c, u;
async function _() {
  return (
    u ||
    (async function () {
      if (c) return (await c).default;
      c = window.ResizeObserver;
      try {
        new c(function () {});
      } catch (t) {
        (c = import("./c.033798e3.js")), (c = (await c).default);
      }
      return (u = c);
    })()
  );
}
const d = Symbol("virtualizerRef");
class m extends Event {
  constructor(t) {
    super(m.eventName, { bubbles: !0 }),
      (this.first = t.first),
      (this.last = t.last);
  }
}
m.eventName = "rangeChanged";
class p extends Event {
  constructor(t) {
    super(p.eventName, { bubbles: !0 }),
      (this.first = t.first),
      (this.last = t.last);
  }
}
p.eventName = "visibilityChanged";
class y {
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
      (this._isScroller = !1),
      (this._sizer = null),
      (this._hostElementRO = null),
      (this._childrenRO = null),
      (this._mutationObserver = null),
      (this._mutationPromise = null),
      (this._mutationPromiseResolver = null),
      (this._mutationsObserved = !1),
      (this._scrollEventListeners = []),
      (this._scrollEventListenerOptions = { passive: !0 }),
      (this._loadListener = this._childLoaded.bind(this)),
      (this._scrollToIndex = null),
      (this._items = []),
      (this._first = -1),
      (this._last = -1),
      (this._firstVisible = -1),
      (this._lastVisible = -1),
      (this._scheduled = new WeakSet()),
      (this._measureCallback = null),
      (this._measureChildOverride = null),
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
    (this._isScroller = !!t.scroller),
      this._initHostElement(t),
      this._initLayout(t);
  }
  async _initObservers() {
    this._mutationObserver = new MutationObserver(
      this._observeMutations.bind(this)
    );
    const t = await _();
    (this._hostElementRO = new t(() => this._hostElementSizeChanged())),
      (this._childrenRO = new t(this._childrenSizeChanged.bind(this)));
  }
  async _initLayout(t) {
    t.layout
      ? (this.layout = t.layout)
      : (this.layout = (await import("./c.f3491693.js")).FlowLayout);
  }
  _initHostElement(t) {
    const e = (this._hostElement = t.hostElement);
    this._applyVirtualizerStyles(), (e[d] = this);
  }
  async connected() {
    await this._initObservers();
    const t = this._isScroller;
    (this._clippingAncestors = (function (t, e = !1) {
      return (function (t, e = !1) {
        const i = [];
        let s = e ? t : f(t);
        for (; null !== s; ) i.push(s), (s = f(s));
        return i;
      })(t, e).filter((t) => "visible" !== getComputedStyle(t).overflow);
    })(this._hostElement, t)),
      this._schedule(this._updateLayout),
      this._observeAndListen();
  }
  _observeAndListen() {
    this._mutationObserver.observe(this._hostElement, { childList: !0 }),
      (this._mutationPromise = new Promise(
        (t) => (this._mutationPromiseResolver = t)
      )),
      this._hostElementRO.observe(this._hostElement),
      this._scrollEventListeners.push(window),
      window.addEventListener("scroll", this, this._scrollEventListenerOptions),
      this._clippingAncestors.forEach((t) => {
        t.addEventListener("scroll", this, this._scrollEventListenerOptions),
          this._scrollEventListeners.push(t),
          this._hostElementRO.observe(t);
      }),
      this._children.forEach((t) => this._childrenRO.observe(t)),
      this._scrollEventListeners.forEach((t) =>
        t.addEventListener("scroll", this, this._scrollEventListenerOptions)
      );
  }
  disconnected() {
    this._scrollEventListeners.forEach((t) =>
      t.removeEventListener("scroll", this, this._scrollEventListenerOptions)
    ),
      (this._scrollEventListeners = []),
      (this._clippingAncestors = []),
      this._mutationObserver.disconnect(),
      this._hostElementRO.disconnect(),
      this._childrenRO.disconnect();
  }
  _applyVirtualizerStyles() {
    const t = this._hostElement.style;
    (t.display = t.display || "block"),
      (t.position = t.position || "relative"),
      (t.contain = t.contain || "strict"),
      this._isScroller &&
        ((t.overflow = t.overflow || "auto"),
        (t.minHeight = t.minHeight || "150px"));
  }
  _getSizer() {
    const t = this._hostElement;
    if (!this._sizer) {
      let e = t.querySelector("[virtualizer-sizer]");
      e ||
        ((e = document.createElement("div")),
        e.setAttribute("virtualizer-sizer", ""),
        t.appendChild(e)),
        Object.assign(e.style, {
          position: "absolute",
          margin: "-2px 0 0 0",
          padding: 0,
          visibility: "hidden",
          fontSize: "2px",
        }),
        (e.innerHTML = "&nbsp;"),
        e.setAttribute("virtualizer-sizer", ""),
        (this._sizer = e);
    }
    return this._sizer;
  }
  get layout() {
    return this._layout;
  }
  set layout(t) {
    if (this._layout === t) return;
    let e = null,
      i = {};
    if (
      ("object" == typeof t
        ? (void 0 !== t.type && (e = t.type), (i = t))
        : (e = t),
      "function" == typeof e)
    ) {
      if (this._layout instanceof e)
        return void (i && (this._layout.config = i));
      e = new e(i);
    }
    this._layout &&
      ((this._measureCallback = null),
      (this._measureChildOverride = null),
      this._layout.removeEventListener("scrollsizechange", this),
      this._layout.removeEventListener("scrollerrorchange", this),
      this._layout.removeEventListener("itempositionchange", this),
      this._layout.removeEventListener("rangechange", this),
      this._sizeHostElement(void 0),
      this._hostElement.removeEventListener("load", this._loadListener, !0)),
      (this._layout = e),
      this._layout &&
        (this._layout.measureChildren &&
          "function" == typeof this._layout.updateItemSizes &&
          ("function" == typeof this._layout.measureChildren &&
            (this._measureChildOverride = this._layout.measureChildren),
          (this._measureCallback = this._layout.updateItemSizes.bind(
            this._layout
          ))),
        this._layout.addEventListener("scrollsizechange", this),
        this._layout.addEventListener("scrollerrorchange", this),
        this._layout.addEventListener("itempositionchange", this),
        this._layout.addEventListener("rangechange", this),
        this._layout.listenForChildLoadEvents &&
          this._hostElement.addEventListener("load", this._loadListener, !0),
        this._schedule(this._updateLayout));
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
          .filter((e) => e.startTime >= this._benchmarkStart && e.startTime < t)
          .reduce((t, e) => t + e.duration, 0);
      return (
        (this._benchmarkStart = null), { timeElapsed: e, virtualizationTime: i }
      );
    }
    return null;
  }
  _measureChildren() {
    const t = {},
      e = this._children,
      i = this._measureChildOverride || this._measureChild;
    for (let s = 0; s < e.length; s++) {
      const r = e[s],
        n = this._first + s;
      (this._itemsChanged || this._toBeMeasured.has(r)) &&
        (t[n] = i.call(this, r, this._items[n]));
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
          marginTop: g(e.marginTop),
          marginRight: g(e.marginRight),
          marginBottom: g(e.marginBottom),
          marginLeft: g(e.marginLeft),
        };
      })(t)
    );
  }
  set scrollToIndex(t) {
    (this._scrollToIndex = t), this._schedule(this._updateLayout);
  }
  async _schedule(t) {
    this._scheduled.has(t) ||
      (this._scheduled.add(t),
      await Promise.resolve(),
      this._scheduled.delete(t),
      t.call(this));
  }
  async _updateDOM() {
    const { _rangeChanged: t, _itemsChanged: e } = this;
    this._visibilityChanged &&
      (this._notifyVisibility(), (this._visibilityChanged = !1)),
      (t || e) && (this._notifyRange(), await this._mutationPromise),
      this._children.forEach((t) => this._childrenRO.observe(t)),
      this._positionChildren(this._childrenPos),
      this._sizeHostElement(this._scrollSize),
      this._scrollError &&
        (this._correctScrollError(this._scrollError),
        (this._scrollError = null)),
      this._benchmarkStart &&
        "mark" in window.performance &&
        window.performance.mark("uv-end");
  }
  _updateLayout() {
    this._layout &&
      ((this._layout.totalItems = this._items.length),
      null !== this._scrollToIndex &&
        (this._layout.scrollToIndex(
          this._scrollToIndex.index,
          this._scrollToIndex.position
        ),
        (this._scrollToIndex = null)),
      this._updateView(),
      null !== this._childMeasurements &&
        (this._measureCallback &&
          this._measureCallback(this._childMeasurements),
        (this._childMeasurements = null)),
      this._layout.reflowIfNeeded(this._itemsChanged),
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
    this._schedule(this._updateLayout);
  }
  handleEvent(t) {
    switch (t.type) {
      case "scroll":
        (t.currentTarget === window ||
          this._clippingAncestors.includes(t.currentTarget)) &&
          this._handleScrollEvent();
        break;
      case "scrollsizechange":
        (this._scrollSize = t.detail), this._schedule(this._updateDOM);
        break;
      case "scrollerrorchange":
        (this._scrollError = t.detail), this._schedule(this._updateDOM);
        break;
      case "itempositionchange":
        (this._childrenPos = t.detail), this._schedule(this._updateDOM);
        break;
      case "rangechange":
        this._adjustRange(t.detail), this._schedule(this._updateDOM);
        break;
      default:
        console.warn("event not handled", t);
    }
  }
  get _children() {
    const t = [];
    let e = this._hostElement.firstElementChild;
    for (; e; )
      e.hasAttribute("virtualizer-sizer") || t.push(e),
        (e = e.nextElementSibling);
    return t;
  }
  _updateView() {
    const t = this._hostElement,
      e = this._layout;
    let i, s, r, n;
    const l = t.getBoundingClientRect();
    (i = 0), (s = 0), (r = window.innerHeight), (n = window.innerWidth);
    for (const t of this._clippingAncestors) {
      const e = t.getBoundingClientRect();
      (i = Math.max(i, e.top)),
        (s = Math.max(s, e.left)),
        (r = Math.min(r, e.bottom)),
        (n = Math.min(n, e.right));
    }
    const o = i - l.top + t.scrollTop,
      h = s - l.left + t.scrollLeft,
      a = Math.max(1, r - i),
      c = Math.max(1, n - s);
    (e.viewportSize = { width: c, height: a }),
      (e.viewportScroll = { top: o, left: h });
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
    if (t) {
      const e = this._children;
      Object.keys(t).forEach((i) => {
        const s = i - this._first,
          r = e[s];
        if (r) {
          const {
            top: e,
            left: s,
            width: n,
            height: l,
            xOffset: o,
            yOffset: h,
          } = t[i];
          (r.style.position = "absolute"),
            (r.style.boxSizing = "border-box"),
            (r.style.transform = `translate(${s}px, ${e}px)`),
            void 0 !== n && (r.style.width = n + "px"),
            void 0 !== l && (r.style.height = l + "px"),
            (r.style.left = void 0 === o ? null : o + "px"),
            (r.style.top = void 0 === h ? null : h + "px");
        }
      });
    }
  }
  async _adjustRange(t) {
    const { _first: e, _last: i, _firstVisible: s, _lastVisible: r } = this;
    (this._first = t.first),
      (this._last = t.last),
      (this._firstVisible = t.firstVisible),
      (this._lastVisible = t.lastVisible),
      (this._rangeChanged =
        this._rangeChanged || this._first !== e || this._last !== i),
      (this._visibilityChanged =
        this._visibilityChanged ||
        this._firstVisible !== s ||
        this._lastVisible !== r);
  }
  _correctScrollError(t) {
    const e = this._clippingAncestors[0];
    e
      ? ((e.scrollTop -= t.top), (e.scrollLeft -= t.left))
      : window.scroll(window.pageXOffset - t.left, window.pageYOffset - t.top);
  }
  _notifyRange() {
    this._hostElement.dispatchEvent(
      new m({ first: this._first, last: this._last })
    );
  }
  _notifyVisibility() {
    this._hostElement.dispatchEvent(
      new p({ first: this._firstVisible, last: this._lastVisible })
    );
  }
  _hostElementSizeChanged() {
    this._schedule(this._updateLayout);
  }
  async _observeMutations() {
    this._mutationsObserved ||
      ((this._mutationsObserved = !0),
      this._mutationPromiseResolver(),
      (this._mutationPromise = new Promise(
        (t) => (this._mutationPromiseResolver = t)
      )),
      (this._mutationsObserved = !1));
  }
  _childLoaded() {}
  _childrenSizeChanged(t) {
    if (this._layout.measureChildren) {
      for (const e of t) this._toBeMeasured.set(e.target, e.contentRect);
      this._measureChildren();
    }
    (this._itemsChanged = !1), (this._rangeChanged = !1);
  }
}
function g(t) {
  const e = t ? parseFloat(t) : NaN;
  return Number.isNaN(e) ? 0 : e;
}
function f(t) {
  if (null !== t.parentElement) return t.parentElement;
  const e = t.parentNode;
  return (e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host) || null;
}
const v = (t) => t,
  b = (t, e) => n`${e}: ${JSON.stringify(t, null, 2)}`;
class w extends r {
  constructor() {
    super(...arguments),
      (this._renderItem = (t, e) => b(t, e + this._first)),
      (this._providedRenderItem = b),
      (this.items = []),
      (this.scroller = !1),
      (this.keyFunction = v),
      (this._first = 0),
      (this._last = -1);
  }
  set renderItem(t) {
    (this._providedRenderItem = t),
      (this._renderItem = (e, i) => t(e, i + this._first)),
      this.requestUpdate();
  }
  get renderItem() {
    return this._providedRenderItem;
  }
  set layout(t) {
    (this._layout = t),
      t && this._virtualizer && (this._virtualizer.layout = t);
  }
  get layout() {
    return this[d].layout;
  }
  scrollToIndex(t, e = "start") {
    this._virtualizer.scrollToIndex = { index: t, position: e };
  }
  updated() {
    this._virtualizer &&
      (void 0 !== this._layout && (this._virtualizer.layout = this._layout),
      (this._virtualizer.items = this.items));
  }
  firstUpdated() {
    const t = this._layout;
    (this._virtualizer = new y({
      hostElement: this,
      layout: t,
      scroller: this.scroller,
    })),
      this.addEventListener("rangeChanged", (t) => {
        t.stopPropagation(), (this._first = t.first), (this._last = t.last);
      }),
      this._virtualizer.connected();
  }
  connectedCallback() {
    super.connectedCallback(),
      this._virtualizer && this._virtualizer.connected();
  }
  disconnectedCallback() {
    this._virtualizer && this._virtualizer.disconnected(),
      super.disconnectedCallback();
  }
  createRenderRoot() {
    return this;
  }
  render() {
    const { items: t, _renderItem: e, keyFunction: i } = this,
      s = [],
      r = Math.min(t.length, this._last + 1);
    if (this._first >= 0 && this._last >= this._first)
      for (let e = this._first; e < r; e++) s.push(t[e]);
    return l(s, i || v, e);
  }
}
e([i()], w.prototype, "renderItem", null),
  e([i({ attribute: !1 })], w.prototype, "items", void 0),
  e([i({ reflect: !0, type: Boolean })], w.prototype, "scroller", void 0),
  e([i()], w.prototype, "keyFunction", void 0),
  e([s()], w.prototype, "_first", void 0),
  e([s()], w.prototype, "_last", void 0),
  e([i({ attribute: !1 })], w.prototype, "layout", null),
  customElements.define("lit-virtualizer", w);
export { a as L };
