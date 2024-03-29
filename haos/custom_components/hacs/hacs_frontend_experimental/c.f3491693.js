import { B as t, d as i } from "./c.10b44dbb.js";
class s {
  constructor(t) {
    (this._map = new Map()),
      (this._roundAverageSize = !0),
      (this.totalSize = 0),
      !1 === (null == t ? void 0 : t.roundAverageSize) &&
        (this._roundAverageSize = !1);
  }
  set(t, i) {
    const s = this._map.get(t) || 0;
    this._map.set(t, i), (this.totalSize += i - s);
  }
  get averageSize() {
    if (this._map.size > 0) {
      const t = this.totalSize / this._map.size;
      return this._roundAverageSize ? Math.round(t) : t;
    }
    return 0;
  }
  getSize(t) {
    return this._map.get(t);
  }
  clear() {
    this._map.clear(), (this.totalSize = 0);
  }
}
const e = (t) => Object.assign({ type: c }, t);
function h(t) {
  return "horizontal" === t ? "marginLeft" : "marginTop";
}
function a(t) {
  return "horizontal" === t ? "marginRight" : "marginBottom";
}
function r(t, i) {
  const s = [t, i].sort();
  return s[1] <= 0 ? Math.min(...s) : s[0] >= 0 ? Math.max(...s) : s[0] + s[1];
}
class _ {
  constructor() {
    (this._childSizeCache = new s()),
      (this._marginSizeCache = new s()),
      (this._metricsCache = new Map());
  }
  update(t, s) {
    var e, _;
    const c = new Set();
    Object.keys(t).forEach((e) => {
      const h = Number(e);
      this._metricsCache.set(h, t[h]),
        this._childSizeCache.set(h, t[h][i(s)]),
        c.add(h),
        c.add(h + 1);
    });
    for (const t of c) {
      const i =
          (null === (e = this._metricsCache.get(t)) || void 0 === e
            ? void 0
            : e[h(s)]) || 0,
        c =
          (null === (_ = this._metricsCache.get(t - 1)) || void 0 === _
            ? void 0
            : _[a(s)]) || 0;
      this._marginSizeCache.set(t, r(i, c));
    }
  }
  get averageChildSize() {
    return this._childSizeCache.averageSize;
  }
  get totalChildSize() {
    return this._childSizeCache.totalSize;
  }
  get averageMarginSize() {
    return this._marginSizeCache.averageSize;
  }
  get totalMarginSize() {
    return this._marginSizeCache.totalSize;
  }
  getLeadingMarginValue(t, i) {
    var s;
    return (
      (null === (s = this._metricsCache.get(t)) || void 0 === s
        ? void 0
        : s[h(i)]) || 0
    );
  }
  getChildSize(t) {
    return this._childSizeCache.getSize(t);
  }
  getMarginSize(t) {
    return this._marginSizeCache.getSize(t);
  }
  clear() {
    this._childSizeCache.clear(),
      this._marginSizeCache.clear(),
      this._metricsCache.clear();
  }
}
class c extends t {
  constructor() {
    super(...arguments),
      (this._itemSize = { width: 100, height: 100 }),
      (this._physicalItems = new Map()),
      (this._newPhysicalItems = new Map()),
      (this._metricsCache = new _()),
      (this._anchorIdx = null),
      (this._anchorPos = null),
      (this._stable = !0),
      (this._measureChildren = !0),
      (this._estimate = !0);
  }
  get measureChildren() {
    return this._measureChildren;
  }
  updateItemSizes(t) {
    this._metricsCache.update(t, this.direction), this._scheduleReflow();
  }
  _getPhysicalItem(t) {
    var i;
    return null !== (i = this._newPhysicalItems.get(t)) && void 0 !== i
      ? i
      : this._physicalItems.get(t);
  }
  _getSize(t) {
    return this._getPhysicalItem(t) && this._metricsCache.getChildSize(t);
  }
  _getAverageSize() {
    return this._metricsCache.averageChildSize || this._itemSize[this._sizeDim];
  }
  _getPosition(t) {
    var i;
    const s = this._getPhysicalItem(t),
      { averageMarginSize: e } = this._metricsCache;
    return 0 === t
      ? null !== (i = this._metricsCache.getMarginSize(0)) && void 0 !== i
        ? i
        : e
      : s
      ? s.pos
      : e + t * (e + this._getAverageSize());
  }
  _calculateAnchor(t, i) {
    return t <= 0
      ? 0
      : i > this._scrollSize - this._viewDim1
      ? this._totalItems - 1
      : Math.max(
          0,
          Math.min(this._totalItems - 1, Math.floor((t + i) / 2 / this._delta))
        );
  }
  _getAnchor(t, i) {
    if (0 === this._physicalItems.size) return this._calculateAnchor(t, i);
    if (this._first < 0)
      return (
        console.error("_getAnchor: negative _first"),
        this._calculateAnchor(t, i)
      );
    if (this._last < 0)
      return (
        console.error("_getAnchor: negative _last"), this._calculateAnchor(t, i)
      );
    const s = this._getPhysicalItem(this._first),
      e = this._getPhysicalItem(this._last),
      h = s.pos;
    if (e.pos + this._metricsCache.getChildSize(this._last) < t)
      return this._calculateAnchor(t, i);
    if (h > i) return this._calculateAnchor(t, i);
    let a = this._firstVisible - 1,
      r = -1 / 0;
    for (; r < t; ) {
      r = this._getPhysicalItem(++a).pos + this._metricsCache.getChildSize(a);
    }
    return a;
  }
  _getActiveItems() {
    0 === this._viewDim1 || 0 === this._totalItems
      ? this._clearItems()
      : this._getItems();
  }
  _clearItems() {
    (this._first = -1),
      (this._last = -1),
      (this._physicalMin = 0),
      (this._physicalMax = 0);
    const t = this._newPhysicalItems;
    (this._newPhysicalItems = this._physicalItems),
      this._newPhysicalItems.clear(),
      (this._physicalItems = t),
      (this._stable = !0);
  }
  _getItems() {
    var t, i;
    const s = this._newPhysicalItems;
    let e, h;
    if (
      ((this._stable = !0),
      this._scrollToIndex >= 0 &&
        ((this._anchorIdx = Math.min(
          this._scrollToIndex,
          this._totalItems - 1
        )),
        (this._anchorPos = this._getPosition(this._anchorIdx)),
        this._scrollIfNeeded()),
      (e = this._scrollPosition - this._overhang),
      (h = this._scrollPosition + this._viewDim1 + this._overhang),
      h < 0 || e > this._scrollSize)
    )
      return void this._clearItems();
    (null !== this._anchorIdx && null !== this._anchorPos) ||
      ((this._anchorIdx = this._getAnchor(e, h)),
      (this._anchorPos = this._getPosition(this._anchorIdx)));
    let a = this._getSize(this._anchorIdx);
    void 0 === a && ((this._stable = !1), (a = this._getAverageSize()));
    const r =
        null !== (t = this._metricsCache.getMarginSize(this._anchorIdx)) &&
        void 0 !== t
          ? t
          : this._metricsCache.averageMarginSize,
      _ =
        null !== (i = this._metricsCache.getMarginSize(this._anchorIdx + 1)) &&
        void 0 !== i
          ? i
          : this._metricsCache.averageMarginSize;
    0 === this._anchorIdx && (this._anchorPos = r),
      this._anchorIdx === this._totalItems - 1 &&
        (this._anchorPos = this._scrollSize - _ - a);
    let c = 0;
    for (
      this._anchorPos + a + _ < e && (c = e - (this._anchorPos + a + _)),
        this._anchorPos - r > h && (c = h - (this._anchorPos - r)),
        c &&
          ((this._scrollPosition -= c),
          (e -= c),
          (h -= c),
          (this._scrollError += c)),
        s.set(this._anchorIdx, { pos: this._anchorPos, size: a }),
        this._first = this._last = this._anchorIdx,
        this._physicalMin = this._anchorPos - r,
        this._physicalMax = this._anchorPos + a + _;
      this._physicalMin > e && this._first > 0;

    ) {
      let t = this._getSize(--this._first);
      void 0 === t && ((this._stable = !1), (t = this._getAverageSize()));
      let i = this._metricsCache.getMarginSize(this._first);
      void 0 === i &&
        ((this._stable = !1), (i = this._metricsCache.averageMarginSize)),
        (this._physicalMin -= t);
      const e = this._physicalMin;
      if (
        (s.set(this._first, { pos: e, size: t }),
        (this._physicalMin -= i),
        !1 === this._stable && !1 === this._estimate)
      )
        break;
    }
    for (; this._physicalMax < h && this._last < this._totalItems - 1; ) {
      let t = this._getSize(++this._last);
      void 0 === t && ((this._stable = !1), (t = this._getAverageSize()));
      let i = this._metricsCache.getMarginSize(this._last);
      void 0 === i &&
        ((this._stable = !1), (i = this._metricsCache.averageMarginSize));
      const e = this._physicalMax;
      if (
        (s.set(this._last, { pos: e, size: t }),
        (this._physicalMax += t + i),
        !this._stable && !this._estimate)
      )
        break;
    }
    const l = this._calculateError();
    l &&
      ((this._physicalMin -= l),
      (this._physicalMax -= l),
      (this._anchorPos -= l),
      (this._scrollPosition -= l),
      s.forEach((t) => (t.pos -= l)),
      (this._scrollError += l)),
      this._stable &&
        ((this._newPhysicalItems = this._physicalItems),
        this._newPhysicalItems.clear(),
        (this._physicalItems = s));
  }
  _calculateError() {
    return 0 === this._first
      ? this._physicalMin
      : this._physicalMin <= 0
      ? this._physicalMin - this._first * this._delta
      : this._last === this._totalItems - 1
      ? this._physicalMax - this._scrollSize
      : this._physicalMax >= this._scrollSize
      ? this._physicalMax -
        this._scrollSize +
        (this._totalItems - 1 - this._last) * this._delta
      : 0;
  }
  _reflow() {
    const { _first: t, _last: i, _scrollSize: s } = this;
    this._updateScrollSize(),
      this._getActiveItems(),
      this._scrollSize !== s && this._emitScrollSize(),
      this._updateVisibleIndices(),
      this._emitRange(),
      -1 === this._first && -1 === this._last
        ? this._resetReflowState()
        : this._first !== t || this._last !== i
        ? (this._emitChildPositions(), this._emitScrollError())
        : (this._emitChildPositions(),
          this._emitScrollError(),
          this._resetReflowState());
  }
  _resetReflowState() {
    (this._anchorIdx = null), (this._anchorPos = null), (this._stable = !0);
  }
  _updateScrollSize() {
    const { averageMarginSize: t } = this._metricsCache;
    this._scrollSize = Math.max(
      1,
      this._totalItems * (t + this._getAverageSize()) + t
    );
  }
  get _delta() {
    const { averageMarginSize: t } = this._metricsCache;
    return this._getAverageSize() + t;
  }
  _getItemPosition(t) {
    var i, s;
    return {
      [this._positionDim]: this._getPosition(t),
      [this._secondaryPositionDim]: 0,
      [((s = this.direction), "horizontal" === s ? "xOffset" : "yOffset")]:
        -(null !==
          (i = this._metricsCache.getLeadingMarginValue(t, this.direction)) &&
        void 0 !== i
          ? i
          : this._metricsCache.averageMarginSize),
    };
  }
  _getItemSize(t) {
    var i;
    return {
      [this._sizeDim]:
        (this._getSize(t) || this._getAverageSize()) +
        (null !== (i = this._metricsCache.getMarginSize(t + 1)) && void 0 !== i
          ? i
          : this._metricsCache.averageMarginSize),
      [this._secondarySizeDim]: this._itemSize[this._secondarySizeDim],
    };
  }
  _viewDim2Changed() {
    this._scheduleReflow();
  }
}
export { c as FlowLayout, e as flow };
