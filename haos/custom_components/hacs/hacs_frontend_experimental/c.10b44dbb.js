let t, i;
async function s() {
  return (
    i ||
    (async function () {
      t = window.EventTarget;
      try {
        new t();
      } catch {
        t = (await import("./c.86b125b8.js")).EventTarget;
      }
      return (i = t);
    })()
  );
}
function e(t) {
  return "horizontal" === t ? "width" : "height";
}
function o(t) {
  return "horizontal" === t ? "height" : "width";
}
class h {
  constructor(t) {
    (this._latestCoords = { left: 0, top: 0 }),
      (this._direction = null),
      (this._viewportSize = { width: 0, height: 0 }),
      (this._pendingReflow = !1),
      (this._pendingLayoutUpdate = !1),
      (this._scrollToIndex = -1),
      (this._scrollToAnchor = 0),
      (this._firstVisible = 0),
      (this._lastVisible = 0),
      (this._eventTargetPromise = s().then((t) => {
        this._eventTarget = new t();
      })),
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
      (this._totalItems = 0),
      (this._scrollSize = 1),
      (this._overhang = 1e3),
      (this._eventTarget = null),
      Promise.resolve().then(() => (this.config = t || this._defaultConfig));
  }
  get _defaultConfig() {
    return { direction: "vertical" };
  }
  set config(t) {
    Object.assign(this, Object.assign({}, this._defaultConfig, t));
  }
  get config() {
    return { direction: this.direction };
  }
  get totalItems() {
    return this._totalItems;
  }
  set totalItems(t) {
    const i = Number(t);
    i !== this._totalItems && ((this._totalItems = i), this._scheduleReflow());
  }
  get direction() {
    return this._direction;
  }
  set direction(t) {
    (t = "horizontal" === t ? t : "vertical") !== this._direction &&
      ((this._direction = t),
      (this._sizeDim = "horizontal" === t ? "width" : "height"),
      (this._secondarySizeDim = "horizontal" === t ? "height" : "width"),
      (this._positionDim = "horizontal" === t ? "left" : "top"),
      (this._secondaryPositionDim = "horizontal" === t ? "top" : "left"),
      this._triggerReflow());
  }
  get viewportSize() {
    return this._viewportSize;
  }
  set viewportSize(t) {
    const { _viewDim1: i, _viewDim2: s } = this;
    Object.assign(this._viewportSize, t),
      s !== this._viewDim2
        ? this._scheduleLayoutUpdate()
        : i !== this._viewDim1 && this._checkThresholds();
  }
  get viewportScroll() {
    return this._latestCoords;
  }
  set viewportScroll(t) {
    Object.assign(this._latestCoords, t);
    const i = this._scrollPosition;
    (this._scrollPosition = this._latestCoords[this._positionDim]),
      i !== this._scrollPosition &&
        (this._scrollPositionChanged(i, this._scrollPosition),
        this._updateVisibleIndices({ emit: !0 })),
      this._checkThresholds();
  }
  reflowIfNeeded(t = !1) {
    (t || this._pendingReflow) && ((this._pendingReflow = !1), this._reflow());
  }
  scrollToIndex(t, i = "start") {
    if (Number.isFinite(t)) {
      switch (
        ((t = Math.min(this.totalItems, Math.max(0, t))),
        (this._scrollToIndex = t),
        "nearest" === i &&
          (i = t > this._first + this._num / 2 ? "end" : "start"),
        i)
      ) {
        case "start":
          this._scrollToAnchor = 0;
          break;
        case "center":
          this._scrollToAnchor = 0.5;
          break;
        case "end":
          this._scrollToAnchor = 1;
          break;
        default:
          throw new TypeError(
            "position must be one of: start, center, end, nearest"
          );
      }
      this._scheduleReflow();
    }
  }
  async dispatchEvent(t) {
    await this._eventTargetPromise, this._eventTarget.dispatchEvent(t);
  }
  async addEventListener(t, i, s) {
    await this._eventTargetPromise, this._eventTarget.addEventListener(t, i, s);
  }
  async removeEventListener(t, i, s) {
    await this._eventTargetPromise,
      this._eventTarget.removeEventListener(t, i, s);
  }
  _updateLayout() {}
  get _viewDim1() {
    return this._viewportSize[this._sizeDim];
  }
  get _viewDim2() {
    return this._viewportSize[this._secondarySizeDim];
  }
  _scheduleReflow() {
    this._pendingReflow = !0;
  }
  _scheduleLayoutUpdate() {
    (this._pendingLayoutUpdate = !0), this._scheduleReflow();
  }
  _triggerReflow() {
    this._scheduleLayoutUpdate(),
      Promise.resolve().then(() => this.reflowIfNeeded());
  }
  _reflow() {
    this._pendingLayoutUpdate &&
      (this._updateLayout(), (this._pendingLayoutUpdate = !1)),
      this._updateScrollSize(),
      this._getActiveItems(),
      this._scrollIfNeeded(),
      this._updateVisibleIndices(),
      this._emitScrollSize(),
      this._emitRange(),
      this._emitChildPositions(),
      this._emitScrollError();
  }
  _scrollIfNeeded() {
    if (-1 === this._scrollToIndex) return;
    const t = this._scrollToIndex,
      i = this._scrollToAnchor,
      s = this._getItemPosition(t)[this._positionDim],
      e = this._getItemSize(t)[this._sizeDim],
      o = this._scrollPosition + this._viewDim1 * i,
      h = s + e * i,
      r = Math.floor(
        Math.min(
          this._scrollSize - this._viewDim1,
          Math.max(0, this._scrollPosition - o + h)
        )
      );
    (this._scrollError += this._scrollPosition - r), (this._scrollPosition = r);
  }
  _emitRange(t) {
    const i = Object.assign(
      {
        first: this._first,
        last: this._last,
        num: this._num,
        firstVisible: this._firstVisible,
        lastVisible: this._lastVisible,
      },
      t
    );
    this.dispatchEvent(new CustomEvent("rangechange", { detail: i }));
  }
  _emitScrollSize() {
    const t = {
      [this._sizeDim]: this._scrollSize,
      [this._secondarySizeDim]: null,
    };
    this.dispatchEvent(new CustomEvent("scrollsizechange", { detail: t }));
  }
  _emitScrollError() {
    if (this._scrollError) {
      const t = {
        [this._positionDim]: this._scrollError,
        [this._secondaryPositionDim]: 0,
      };
      this.dispatchEvent(new CustomEvent("scrollerrorchange", { detail: t })),
        (this._scrollError = 0);
    }
  }
  _emitChildPositions() {
    const t = {};
    for (let i = this._first; i <= this._last; i++)
      t[i] = this._getItemPosition(i);
    this.dispatchEvent(new CustomEvent("itempositionchange", { detail: t }));
  }
  get _num() {
    return -1 === this._first || -1 === this._last
      ? 0
      : this._last - this._first + 1;
  }
  _checkThresholds() {
    if (0 === this._viewDim1 && this._num > 0) this._scheduleReflow();
    else {
      const t = Math.max(0, this._scrollPosition - this._overhang),
        i = Math.min(
          this._scrollSize,
          this._scrollPosition + this._viewDim1 + this._overhang
        );
      (this._physicalMin > t || this._physicalMax < i) &&
        this._scheduleReflow();
    }
  }
  _updateVisibleIndices(t) {
    if (-1 === this._first || -1 === this._last) return;
    let i = this._first;
    for (
      ;
      i < this._last &&
      Math.round(
        this._getItemPosition(i)[this._positionDim] +
          this._getItemSize(i)[this._sizeDim]
      ) <= Math.round(this._scrollPosition);

    )
      i++;
    let s = this._last;
    for (
      ;
      s > this._first &&
      Math.round(this._getItemPosition(s)[this._positionDim]) >=
        Math.round(this._scrollPosition + this._viewDim1);

    )
      s--;
    (i === this._firstVisible && s === this._lastVisible) ||
      ((this._firstVisible = i),
      (this._lastVisible = s),
      t && t.emit && this._emitRange());
  }
  _scrollPositionChanged(t, i) {
    const s = this._scrollSize - this._viewDim1;
    (t < s || i < s) && (this._scrollToIndex = -1);
  }
}
export { h as B, o as a, e as d };
