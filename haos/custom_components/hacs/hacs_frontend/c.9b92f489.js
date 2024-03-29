import {
  u as e,
  v as t,
  G as i,
  M as c,
  _ as o,
  i as r,
  e as n,
  t as a,
  B as d,
  $ as s,
  o as p,
  I as l,
  y as m,
  p as h,
  q as u,
  r as f,
  n as b,
  a as g,
  h as k,
  J as x,
  K as _,
  g as y,
  w as v,
  R as T,
  j as w,
  A as E,
} from "./main-ad130be7.js";
import { c as O, o as I } from "./c.82eccc94.js";
import { o as C } from "./c.8e28b461.js";
var A,
  R,
  S = {
    ANCHOR: "mdc-menu-surface--anchor",
    ANIMATING_CLOSED: "mdc-menu-surface--animating-closed",
    ANIMATING_OPEN: "mdc-menu-surface--animating-open",
    FIXED: "mdc-menu-surface--fixed",
    IS_OPEN_BELOW: "mdc-menu-surface--is-open-below",
    OPEN: "mdc-menu-surface--open",
    ROOT: "mdc-menu-surface",
  },
  F = {
    CLOSED_EVENT: "MDCMenuSurface:closed",
    CLOSING_EVENT: "MDCMenuSurface:closing",
    OPENED_EVENT: "MDCMenuSurface:opened",
    FOCUSABLE_ELEMENTS: [
      "button:not(:disabled)",
      '[href]:not([aria-disabled="true"])',
      "input:not(:disabled)",
      "select:not(:disabled)",
      "textarea:not(:disabled)",
      '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
    ].join(", "),
  },
  B = {
    TRANSITION_OPEN_DURATION: 120,
    TRANSITION_CLOSE_DURATION: 75,
    MARGIN_TO_EDGE: 32,
    ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
    TOUCH_EVENT_WAIT_MS: 30,
  };
!(function (e) {
  (e[(e.BOTTOM = 1)] = "BOTTOM"),
    (e[(e.CENTER = 2)] = "CENTER"),
    (e[(e.RIGHT = 4)] = "RIGHT"),
    (e[(e.FLIP_RTL = 8)] = "FLIP_RTL");
})(A || (A = {})),
  (function (e) {
    (e[(e.TOP_LEFT = 0)] = "TOP_LEFT"),
      (e[(e.TOP_RIGHT = 4)] = "TOP_RIGHT"),
      (e[(e.BOTTOM_LEFT = 1)] = "BOTTOM_LEFT"),
      (e[(e.BOTTOM_RIGHT = 5)] = "BOTTOM_RIGHT"),
      (e[(e.TOP_START = 8)] = "TOP_START"),
      (e[(e.TOP_END = 12)] = "TOP_END"),
      (e[(e.BOTTOM_START = 9)] = "BOTTOM_START"),
      (e[(e.BOTTOM_END = 13)] = "BOTTOM_END");
  })(R || (R = {}));
var M = (function (c) {
    function o(e) {
      var i = c.call(this, t(t({}, o.defaultAdapter), e)) || this;
      return (
        (i.isSurfaceOpen = !1),
        (i.isQuickOpen = !1),
        (i.isHoistedElement = !1),
        (i.isFixedPosition = !1),
        (i.isHorizontallyCenteredOnViewport = !1),
        (i.maxHeight = 0),
        (i.openBottomBias = 0),
        (i.openAnimationEndTimerId = 0),
        (i.closeAnimationEndTimerId = 0),
        (i.animationRequestId = 0),
        (i.anchorCorner = R.TOP_START),
        (i.originCorner = R.TOP_START),
        (i.anchorMargin = { top: 0, right: 0, bottom: 0, left: 0 }),
        (i.position = { x: 0, y: 0 }),
        i
      );
    }
    return (
      e(o, c),
      Object.defineProperty(o, "cssClasses", {
        get: function () {
          return S;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(o, "strings", {
        get: function () {
          return F;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(o, "numbers", {
        get: function () {
          return B;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(o, "Corner", {
        get: function () {
          return R;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(o, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            removeClass: function () {},
            hasClass: function () {
              return !1;
            },
            hasAnchor: function () {
              return !1;
            },
            isElementInContainer: function () {
              return !1;
            },
            isFocused: function () {
              return !1;
            },
            isRtl: function () {
              return !1;
            },
            getInnerDimensions: function () {
              return { height: 0, width: 0 };
            },
            getAnchorDimensions: function () {
              return null;
            },
            getWindowDimensions: function () {
              return { height: 0, width: 0 };
            },
            getBodyDimensions: function () {
              return { height: 0, width: 0 };
            },
            getWindowScroll: function () {
              return { x: 0, y: 0 };
            },
            setPosition: function () {},
            setMaxHeight: function () {},
            setTransformOrigin: function () {},
            saveFocus: function () {},
            restoreFocus: function () {},
            notifyClose: function () {},
            notifyOpen: function () {},
            notifyClosing: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (o.prototype.init = function () {
        var e = o.cssClasses,
          t = e.ROOT,
          i = e.OPEN;
        if (!this.adapter.hasClass(t))
          throw new Error(t + " class required in root element.");
        this.adapter.hasClass(i) && (this.isSurfaceOpen = !0);
      }),
      (o.prototype.destroy = function () {
        clearTimeout(this.openAnimationEndTimerId),
          clearTimeout(this.closeAnimationEndTimerId),
          cancelAnimationFrame(this.animationRequestId);
      }),
      (o.prototype.setAnchorCorner = function (e) {
        this.anchorCorner = e;
      }),
      (o.prototype.flipCornerHorizontally = function () {
        this.originCorner = this.originCorner ^ A.RIGHT;
      }),
      (o.prototype.setAnchorMargin = function (e) {
        (this.anchorMargin.top = e.top || 0),
          (this.anchorMargin.right = e.right || 0),
          (this.anchorMargin.bottom = e.bottom || 0),
          (this.anchorMargin.left = e.left || 0);
      }),
      (o.prototype.setIsHoisted = function (e) {
        this.isHoistedElement = e;
      }),
      (o.prototype.setFixedPosition = function (e) {
        this.isFixedPosition = e;
      }),
      (o.prototype.isFixed = function () {
        return this.isFixedPosition;
      }),
      (o.prototype.setAbsolutePosition = function (e, t) {
        (this.position.x = this.isFinite(e) ? e : 0),
          (this.position.y = this.isFinite(t) ? t : 0);
      }),
      (o.prototype.setIsHorizontallyCenteredOnViewport = function (e) {
        this.isHorizontallyCenteredOnViewport = e;
      }),
      (o.prototype.setQuickOpen = function (e) {
        this.isQuickOpen = e;
      }),
      (o.prototype.setMaxHeight = function (e) {
        this.maxHeight = e;
      }),
      (o.prototype.setOpenBottomBias = function (e) {
        this.openBottomBias = e;
      }),
      (o.prototype.isOpen = function () {
        return this.isSurfaceOpen;
      }),
      (o.prototype.open = function () {
        var e = this;
        this.isSurfaceOpen ||
          (this.adapter.saveFocus(),
          this.isQuickOpen
            ? ((this.isSurfaceOpen = !0),
              this.adapter.addClass(o.cssClasses.OPEN),
              (this.dimensions = this.adapter.getInnerDimensions()),
              this.autoposition(),
              this.adapter.notifyOpen())
            : (this.adapter.addClass(o.cssClasses.ANIMATING_OPEN),
              (this.animationRequestId = requestAnimationFrame(function () {
                (e.dimensions = e.adapter.getInnerDimensions()),
                  e.autoposition(),
                  e.adapter.addClass(o.cssClasses.OPEN),
                  (e.openAnimationEndTimerId = setTimeout(function () {
                    (e.openAnimationEndTimerId = 0),
                      e.adapter.removeClass(o.cssClasses.ANIMATING_OPEN),
                      e.adapter.notifyOpen();
                  }, B.TRANSITION_OPEN_DURATION));
              })),
              (this.isSurfaceOpen = !0)));
      }),
      (o.prototype.close = function (e) {
        var t = this;
        if ((void 0 === e && (e = !1), this.isSurfaceOpen)) {
          if ((this.adapter.notifyClosing(), this.isQuickOpen))
            return (
              (this.isSurfaceOpen = !1),
              e || this.maybeRestoreFocus(),
              this.adapter.removeClass(o.cssClasses.OPEN),
              this.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),
              void this.adapter.notifyClose()
            );
          this.adapter.addClass(o.cssClasses.ANIMATING_CLOSED),
            requestAnimationFrame(function () {
              t.adapter.removeClass(o.cssClasses.OPEN),
                t.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),
                (t.closeAnimationEndTimerId = setTimeout(function () {
                  (t.closeAnimationEndTimerId = 0),
                    t.adapter.removeClass(o.cssClasses.ANIMATING_CLOSED),
                    t.adapter.notifyClose();
                }, B.TRANSITION_CLOSE_DURATION));
            }),
            (this.isSurfaceOpen = !1),
            e || this.maybeRestoreFocus();
        }
      }),
      (o.prototype.handleBodyClick = function (e) {
        var t = e.target;
        this.adapter.isElementInContainer(t) || this.close();
      }),
      (o.prototype.handleKeydown = function (e) {
        var t = e.keyCode;
        ("Escape" === e.key || 27 === t) && this.close();
      }),
      (o.prototype.autoposition = function () {
        var e;
        this.measurements = this.getAutoLayoutmeasurements();
        var t = this.getoriginCorner(),
          i = this.getMenuSurfaceMaxHeight(t),
          c = this.hasBit(t, A.BOTTOM) ? "bottom" : "top",
          r = this.hasBit(t, A.RIGHT) ? "right" : "left",
          n = this.getHorizontalOriginOffset(t),
          a = this.getVerticalOriginOffset(t),
          d = this.measurements,
          s = d.anchorSize,
          p = d.surfaceSize,
          l = (((e = {})[r] = n), (e[c] = a), e);
        s.width / p.width > B.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO &&
          (r = "center"),
          (this.isHoistedElement || this.isFixedPosition) &&
            this.adjustPositionForHoistedElement(l),
          this.adapter.setTransformOrigin(r + " " + c),
          this.adapter.setPosition(l),
          this.adapter.setMaxHeight(i ? i + "px" : ""),
          this.hasBit(t, A.BOTTOM) ||
            this.adapter.addClass(o.cssClasses.IS_OPEN_BELOW);
      }),
      (o.prototype.getAutoLayoutmeasurements = function () {
        var e = this.adapter.getAnchorDimensions(),
          t = this.adapter.getBodyDimensions(),
          i = this.adapter.getWindowDimensions(),
          c = this.adapter.getWindowScroll();
        return (
          e ||
            (e = {
              top: this.position.y,
              right: this.position.x,
              bottom: this.position.y,
              left: this.position.x,
              width: 0,
              height: 0,
            }),
          {
            anchorSize: e,
            bodySize: t,
            surfaceSize: this.dimensions,
            viewportDistance: {
              top: e.top,
              right: i.width - e.right,
              bottom: i.height - e.bottom,
              left: e.left,
            },
            viewportSize: i,
            windowScroll: c,
          }
        );
      }),
      (o.prototype.getoriginCorner = function () {
        var e,
          t,
          i = this.originCorner,
          c = this.measurements,
          r = c.viewportDistance,
          n = c.anchorSize,
          a = c.surfaceSize,
          d = o.numbers.MARGIN_TO_EDGE;
        this.hasBit(this.anchorCorner, A.BOTTOM)
          ? ((e = r.top - d + this.anchorMargin.bottom),
            (t = r.bottom - d - this.anchorMargin.bottom))
          : ((e = r.top - d + this.anchorMargin.top),
            (t = r.bottom - d + n.height - this.anchorMargin.top)),
          !(t - a.height > 0) &&
            e > t + this.openBottomBias &&
            (i = this.setBit(i, A.BOTTOM));
        var s,
          p,
          l = this.adapter.isRtl(),
          m = this.hasBit(this.anchorCorner, A.FLIP_RTL),
          h =
            this.hasBit(this.anchorCorner, A.RIGHT) || this.hasBit(i, A.RIGHT),
          u = !1;
        (u = l && m ? !h : h)
          ? ((s = r.left + n.width + this.anchorMargin.right),
            (p = r.right - this.anchorMargin.right))
          : ((s = r.left + this.anchorMargin.left),
            (p = r.right + n.width - this.anchorMargin.left));
        var f = s - a.width > 0,
          b = p - a.width > 0,
          g = this.hasBit(i, A.FLIP_RTL) && this.hasBit(i, A.RIGHT);
        return (
          (b && g && l) || (!f && g)
            ? (i = this.unsetBit(i, A.RIGHT))
            : ((f && u && l) || (f && !u && h) || (!b && s >= p)) &&
              (i = this.setBit(i, A.RIGHT)),
          i
        );
      }),
      (o.prototype.getMenuSurfaceMaxHeight = function (e) {
        if (this.maxHeight > 0) return this.maxHeight;
        var t = this.measurements.viewportDistance,
          i = 0,
          c = this.hasBit(e, A.BOTTOM),
          r = this.hasBit(this.anchorCorner, A.BOTTOM),
          n = o.numbers.MARGIN_TO_EDGE;
        return (
          c
            ? ((i = t.top + this.anchorMargin.top - n),
              r || (i += this.measurements.anchorSize.height))
            : ((i =
                t.bottom -
                this.anchorMargin.bottom +
                this.measurements.anchorSize.height -
                n),
              r && (i -= this.measurements.anchorSize.height)),
          i
        );
      }),
      (o.prototype.getHorizontalOriginOffset = function (e) {
        var t = this.measurements.anchorSize,
          i = this.hasBit(e, A.RIGHT),
          c = this.hasBit(this.anchorCorner, A.RIGHT);
        if (i) {
          var o = c
            ? t.width - this.anchorMargin.left
            : this.anchorMargin.right;
          return this.isHoistedElement || this.isFixedPosition
            ? o -
                (this.measurements.viewportSize.width -
                  this.measurements.bodySize.width)
            : o;
        }
        return c ? t.width - this.anchorMargin.right : this.anchorMargin.left;
      }),
      (o.prototype.getVerticalOriginOffset = function (e) {
        var t = this.measurements.anchorSize,
          i = this.hasBit(e, A.BOTTOM),
          c = this.hasBit(this.anchorCorner, A.BOTTOM);
        return i
          ? c
            ? t.height - this.anchorMargin.top
            : -this.anchorMargin.bottom
          : c
          ? t.height + this.anchorMargin.bottom
          : this.anchorMargin.top;
      }),
      (o.prototype.adjustPositionForHoistedElement = function (e) {
        var t,
          c,
          o = this.measurements,
          r = o.windowScroll,
          n = o.viewportDistance,
          a = o.surfaceSize,
          d = o.viewportSize,
          s = Object.keys(e);
        try {
          for (var p = i(s), l = p.next(); !l.done; l = p.next()) {
            var m = l.value,
              h = e[m] || 0;
            !this.isHorizontallyCenteredOnViewport ||
            ("left" !== m && "right" !== m)
              ? ((h += n[m]),
                this.isFixedPosition ||
                  ("top" === m
                    ? (h += r.y)
                    : "bottom" === m
                    ? (h -= r.y)
                    : "left" === m
                    ? (h += r.x)
                    : (h -= r.x)),
                (e[m] = h))
              : (e[m] = (d.width - a.width) / 2);
          }
        } catch (e) {
          t = { error: e };
        } finally {
          try {
            l && !l.done && (c = p.return) && c.call(p);
          } finally {
            if (t) throw t.error;
          }
        }
      }),
      (o.prototype.maybeRestoreFocus = function () {
        var e = this,
          t = this.adapter.isFocused(),
          i =
            document.activeElement &&
            this.adapter.isElementInContainer(document.activeElement);
        (t || i) &&
          setTimeout(function () {
            e.adapter.restoreFocus();
          }, B.TOUCH_EVENT_WAIT_MS);
      }),
      (o.prototype.hasBit = function (e, t) {
        return Boolean(e & t);
      }),
      (o.prototype.setBit = function (e, t) {
        return e | t;
      }),
      (o.prototype.unsetBit = function (e, t) {
        return e ^ t;
      }),
      (o.prototype.isFinite = function (e) {
        return "number" == typeof e && isFinite(e);
      }),
      o
    );
  })(c),
  z = M;
const L = {
  TOP_LEFT: R.TOP_LEFT,
  TOP_RIGHT: R.TOP_RIGHT,
  BOTTOM_LEFT: R.BOTTOM_LEFT,
  BOTTOM_RIGHT: R.BOTTOM_RIGHT,
  TOP_START: R.TOP_START,
  TOP_END: R.TOP_END,
  BOTTOM_START: R.BOTTOM_START,
  BOTTOM_END: R.BOTTOM_END,
};
class N extends d {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = z),
      (this.absolute = !1),
      (this.fullwidth = !1),
      (this.fixed = !1),
      (this.x = null),
      (this.y = null),
      (this.quick = !1),
      (this.open = !1),
      (this.stayOpenOnBodyClick = !1),
      (this.bitwiseCorner = R.TOP_START),
      (this.previousMenuCorner = null),
      (this.menuCorner = "START"),
      (this.corner = "TOP_START"),
      (this.styleTop = ""),
      (this.styleLeft = ""),
      (this.styleRight = ""),
      (this.styleBottom = ""),
      (this.styleMaxHeight = ""),
      (this.styleTransformOrigin = ""),
      (this.anchor = null),
      (this.previouslyFocused = null),
      (this.previousAnchor = null),
      (this.onBodyClickBound = () => {});
  }
  render() {
    const e = {
        "mdc-menu-surface--fixed": this.fixed,
        "mdc-menu-surface--fullwidth": this.fullwidth,
      },
      t = {
        top: this.styleTop,
        left: this.styleLeft,
        right: this.styleRight,
        bottom: this.styleBottom,
        "max-height": this.styleMaxHeight,
        "transform-origin": this.styleTransformOrigin,
      };
    return s`
      <div
          class="mdc-menu-surface ${p(e)}"
          style="${l(t)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        <slot></slot>
      </div>`;
  }
  createAdapter() {
    return Object.assign(Object.assign({}, m(this.mdcRoot)), {
      hasAnchor: () => !!this.anchor,
      notifyClose: () => {
        const e = new CustomEvent("closed", { bubbles: !0, composed: !0 });
        (this.open = !1), this.mdcRoot.dispatchEvent(e);
      },
      notifyClosing: () => {
        const e = new CustomEvent("closing", { bubbles: !0, composed: !0 });
        this.mdcRoot.dispatchEvent(e);
      },
      notifyOpen: () => {
        const e = new CustomEvent("opened", { bubbles: !0, composed: !0 });
        (this.open = !0), this.mdcRoot.dispatchEvent(e);
      },
      isElementInContainer: () => !1,
      isRtl: () =>
        !!this.mdcRoot && "rtl" === getComputedStyle(this.mdcRoot).direction,
      setTransformOrigin: (e) => {
        this.mdcRoot && (this.styleTransformOrigin = e);
      },
      isFocused: () => h(this),
      saveFocus: () => {
        const e = u(),
          t = e.length;
        t || (this.previouslyFocused = null),
          (this.previouslyFocused = e[t - 1]);
      },
      restoreFocus: () => {
        this.previouslyFocused &&
          "focus" in this.previouslyFocused &&
          this.previouslyFocused.focus();
      },
      getInnerDimensions: () => {
        const e = this.mdcRoot;
        return e
          ? { width: e.offsetWidth, height: e.offsetHeight }
          : { width: 0, height: 0 };
      },
      getAnchorDimensions: () => {
        const e = this.anchor;
        return e ? e.getBoundingClientRect() : null;
      },
      getBodyDimensions: () => ({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }),
      getWindowDimensions: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      getWindowScroll: () => ({ x: window.pageXOffset, y: window.pageYOffset }),
      setPosition: (e) => {
        this.mdcRoot &&
          ((this.styleLeft = "left" in e ? `${e.left}px` : ""),
          (this.styleRight = "right" in e ? `${e.right}px` : ""),
          (this.styleTop = "top" in e ? `${e.top}px` : ""),
          (this.styleBottom = "bottom" in e ? `${e.bottom}px` : ""));
      },
      setMaxHeight: async (e) => {
        this.mdcRoot &&
          ((this.styleMaxHeight = e),
          await this.updateComplete,
          (this.styleMaxHeight = `var(--mdc-menu-max-height, ${e})`));
      },
    });
  }
  onKeydown(e) {
    this.mdcFoundation && this.mdcFoundation.handleKeydown(e);
  }
  onBodyClick(e) {
    if (this.stayOpenOnBodyClick) return;
    -1 === e.composedPath().indexOf(this) && this.close();
  }
  registerBodyClick() {
    (this.onBodyClickBound = this.onBodyClick.bind(this)),
      document.body.addEventListener("click", this.onBodyClickBound, {
        passive: !0,
        capture: !0,
      });
  }
  deregisterBodyClick() {
    document.body.removeEventListener("click", this.onBodyClickBound, {
      capture: !0,
    });
  }
  close() {
    this.open = !1;
  }
  show() {
    this.open = !0;
  }
}
o([r(".mdc-menu-surface")], N.prototype, "mdcRoot", void 0),
  o([r("slot")], N.prototype, "slotElement", void 0),
  o(
    [
      n({ type: Boolean }),
      C(function (e) {
        this.mdcFoundation && !this.fixed && this.mdcFoundation.setIsHoisted(e);
      }),
    ],
    N.prototype,
    "absolute",
    void 0
  ),
  o([n({ type: Boolean })], N.prototype, "fullwidth", void 0),
  o(
    [
      n({ type: Boolean }),
      C(function (e) {
        this.mdcFoundation &&
          !this.absolute &&
          this.mdcFoundation.setFixedPosition(e);
      }),
    ],
    N.prototype,
    "fixed",
    void 0
  ),
  o(
    [
      n({ type: Number }),
      C(function (e) {
        this.mdcFoundation &&
          null !== this.y &&
          null !== e &&
          (this.mdcFoundation.setAbsolutePosition(e, this.y),
          this.mdcFoundation.setAnchorMargin({
            left: e,
            top: this.y,
            right: -e,
            bottom: this.y,
          }));
      }),
    ],
    N.prototype,
    "x",
    void 0
  ),
  o(
    [
      n({ type: Number }),
      C(function (e) {
        this.mdcFoundation &&
          null !== this.x &&
          null !== e &&
          (this.mdcFoundation.setAbsolutePosition(this.x, e),
          this.mdcFoundation.setAnchorMargin({
            left: this.x,
            top: e,
            right: -this.x,
            bottom: e,
          }));
      }),
    ],
    N.prototype,
    "y",
    void 0
  ),
  o(
    [
      n({ type: Boolean }),
      C(function (e) {
        this.mdcFoundation && this.mdcFoundation.setQuickOpen(e);
      }),
    ],
    N.prototype,
    "quick",
    void 0
  ),
  o(
    [
      n({ type: Boolean, reflect: !0 }),
      C(function (e, t) {
        this.mdcFoundation &&
          (e
            ? this.mdcFoundation.open()
            : void 0 !== t && this.mdcFoundation.close());
      }),
    ],
    N.prototype,
    "open",
    void 0
  ),
  o([n({ type: Boolean })], N.prototype, "stayOpenOnBodyClick", void 0),
  o(
    [
      a(),
      C(function (e) {
        this.mdcFoundation && this.mdcFoundation.setAnchorCorner(e);
      }),
    ],
    N.prototype,
    "bitwiseCorner",
    void 0
  ),
  o(
    [
      n({ type: String }),
      C(function (e) {
        if (this.mdcFoundation) {
          const t = "START" === e || "END" === e,
            i = null === this.previousMenuCorner,
            c = !i && e !== this.previousMenuCorner,
            o = i && "END" === e;
          t &&
            (c || o) &&
            ((this.bitwiseCorner = this.bitwiseCorner ^ A.RIGHT),
            this.mdcFoundation.flipCornerHorizontally(),
            (this.previousMenuCorner = e));
        }
      }),
    ],
    N.prototype,
    "menuCorner",
    void 0
  ),
  o(
    [
      n({ type: String }),
      C(function (e) {
        if (this.mdcFoundation && e) {
          let t = L[e];
          "END" === this.menuCorner && (t ^= A.RIGHT), (this.bitwiseCorner = t);
        }
      }),
    ],
    N.prototype,
    "corner",
    void 0
  ),
  o([a()], N.prototype, "styleTop", void 0),
  o([a()], N.prototype, "styleLeft", void 0),
  o([a()], N.prototype, "styleRight", void 0),
  o([a()], N.prototype, "styleBottom", void 0),
  o([a()], N.prototype, "styleMaxHeight", void 0),
  o([a()], N.prototype, "styleTransformOrigin", void 0);
const D = f`.mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;transition:opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1),height 250ms cubic-bezier(0, 0, 0.2, 1);box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0,0,0,.12);background-color:#fff;background-color:var(--mdc-theme-surface, #fff);color:#000;color:var(--mdc-theme-on-surface, #000);border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0;transition:opacity .075s linear}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}:host(:not([open])){display:none}.mdc-menu-surface{z-index:8;z-index:var(--mdc-menu-z-index, 8);min-width:112px;min-width:var(--mdc-menu-min-width, 112px)}`;
let H = class extends N {};
(H.styles = [D]), (H = o([b("mwc-menu-surface")], H));
var P,
  $ = {
    MENU_SELECTED_LIST_ITEM: "mdc-menu-item--selected",
    MENU_SELECTION_GROUP: "mdc-menu__selection-group",
    ROOT: "mdc-menu",
  },
  G = {
    ARIA_CHECKED_ATTR: "aria-checked",
    ARIA_DISABLED_ATTR: "aria-disabled",
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    LIST_SELECTOR: ".mdc-list,.mdc-deprecated-list",
    SELECTED_EVENT: "MDCMenu:selected",
    SKIP_RESTORE_FOCUS: "data-menu-item-skip-restore-focus",
  },
  U = { FOCUS_ROOT_INDEX: -1 };
!(function (e) {
  (e[(e.NONE = 0)] = "NONE"),
    (e[(e.LIST_ROOT = 1)] = "LIST_ROOT"),
    (e[(e.FIRST_ITEM = 2)] = "FIRST_ITEM"),
    (e[(e.LAST_ITEM = 3)] = "LAST_ITEM");
})(P || (P = {}));
var j = (function (i) {
  function c(e) {
    var o = i.call(this, t(t({}, c.defaultAdapter), e)) || this;
    return (
      (o.closeAnimationEndTimerId = 0),
      (o.defaultFocusState = P.LIST_ROOT),
      (o.selectedIndex = -1),
      o
    );
  }
  return (
    e(c, i),
    Object.defineProperty(c, "cssClasses", {
      get: function () {
        return $;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(c, "strings", {
      get: function () {
        return G;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(c, "numbers", {
      get: function () {
        return U;
      },
      enumerable: !1,
      configurable: !0,
    }),
    Object.defineProperty(c, "defaultAdapter", {
      get: function () {
        return {
          addClassToElementAtIndex: function () {},
          removeClassFromElementAtIndex: function () {},
          addAttributeToElementAtIndex: function () {},
          removeAttributeFromElementAtIndex: function () {},
          getAttributeFromElementAtIndex: function () {
            return null;
          },
          elementContainsClass: function () {
            return !1;
          },
          closeSurface: function () {},
          getElementIndex: function () {
            return -1;
          },
          notifySelected: function () {},
          getMenuItemCount: function () {
            return 0;
          },
          focusItemAtIndex: function () {},
          focusListRoot: function () {},
          getSelectedSiblingOfItemAtIndex: function () {
            return -1;
          },
          isSelectableItemAtIndex: function () {
            return !1;
          },
        };
      },
      enumerable: !1,
      configurable: !0,
    }),
    (c.prototype.destroy = function () {
      this.closeAnimationEndTimerId &&
        clearTimeout(this.closeAnimationEndTimerId),
        this.adapter.closeSurface();
    }),
    (c.prototype.handleKeydown = function (e) {
      var t = e.key,
        i = e.keyCode;
      ("Tab" === t || 9 === i) && this.adapter.closeSurface(!0);
    }),
    (c.prototype.handleItemAction = function (e) {
      var t = this,
        i = this.adapter.getElementIndex(e);
      if (!(i < 0)) {
        this.adapter.notifySelected({ index: i });
        var c =
          "true" ===
          this.adapter.getAttributeFromElementAtIndex(i, G.SKIP_RESTORE_FOCUS);
        this.adapter.closeSurface(c),
          (this.closeAnimationEndTimerId = setTimeout(function () {
            var i = t.adapter.getElementIndex(e);
            i >= 0 &&
              t.adapter.isSelectableItemAtIndex(i) &&
              t.setSelectedIndex(i);
          }, M.numbers.TRANSITION_CLOSE_DURATION));
      }
    }),
    (c.prototype.handleMenuSurfaceOpened = function () {
      switch (this.defaultFocusState) {
        case P.FIRST_ITEM:
          this.adapter.focusItemAtIndex(0);
          break;
        case P.LAST_ITEM:
          this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount() - 1);
          break;
        case P.NONE:
          break;
        default:
          this.adapter.focusListRoot();
      }
    }),
    (c.prototype.setDefaultFocusState = function (e) {
      this.defaultFocusState = e;
    }),
    (c.prototype.getSelectedIndex = function () {
      return this.selectedIndex;
    }),
    (c.prototype.setSelectedIndex = function (e) {
      if ((this.validatedIndex(e), !this.adapter.isSelectableItemAtIndex(e)))
        throw new Error(
          "MDCMenuFoundation: No selection group at specified index."
        );
      var t = this.adapter.getSelectedSiblingOfItemAtIndex(e);
      t >= 0 &&
        (this.adapter.removeAttributeFromElementAtIndex(t, G.ARIA_CHECKED_ATTR),
        this.adapter.removeClassFromElementAtIndex(
          t,
          $.MENU_SELECTED_LIST_ITEM
        )),
        this.adapter.addClassToElementAtIndex(e, $.MENU_SELECTED_LIST_ITEM),
        this.adapter.addAttributeToElementAtIndex(
          e,
          G.ARIA_CHECKED_ATTR,
          "true"
        ),
        (this.selectedIndex = e);
    }),
    (c.prototype.setEnabled = function (e, t) {
      this.validatedIndex(e),
        t
          ? (this.adapter.removeClassFromElementAtIndex(
              e,
              O.LIST_ITEM_DISABLED_CLASS
            ),
            this.adapter.addAttributeToElementAtIndex(
              e,
              G.ARIA_DISABLED_ATTR,
              "false"
            ))
          : (this.adapter.addClassToElementAtIndex(
              e,
              O.LIST_ITEM_DISABLED_CLASS
            ),
            this.adapter.addAttributeToElementAtIndex(
              e,
              G.ARIA_DISABLED_ATTR,
              "true"
            ));
    }),
    (c.prototype.validatedIndex = function (e) {
      var t = this.adapter.getMenuItemCount();
      if (!(e >= 0 && e < t))
        throw new Error("MDCMenuFoundation: No list item at specified index.");
    }),
    c
  );
})(c);
class W extends d {
  constructor() {
    super(...arguments),
      (this.mdcFoundationClass = j),
      (this.listElement_ = null),
      (this.anchor = null),
      (this.open = !1),
      (this.quick = !1),
      (this.wrapFocus = !1),
      (this.innerRole = "menu"),
      (this.innerAriaLabel = null),
      (this.corner = "TOP_START"),
      (this.x = null),
      (this.y = null),
      (this.absolute = !1),
      (this.multi = !1),
      (this.activatable = !1),
      (this.fixed = !1),
      (this.forceGroupSelection = !1),
      (this.fullwidth = !1),
      (this.menuCorner = "START"),
      (this.stayOpenOnBodyClick = !1),
      (this.defaultFocus = "LIST_ROOT"),
      (this._listUpdateComplete = null);
  }
  get listElement() {
    return (
      this.listElement_ ||
        (this.listElement_ = this.renderRoot.querySelector("mwc-list")),
      this.listElement_
    );
  }
  get items() {
    const e = this.listElement;
    return e ? e.items : [];
  }
  get index() {
    const e = this.listElement;
    return e ? e.index : -1;
  }
  get selected() {
    const e = this.listElement;
    return e ? e.selected : null;
  }
  render() {
    const e = "menu" === this.innerRole ? "menuitem" : "option";
    return s`
      <mwc-menu-surface
          ?hidden=${!this.open}
          .anchor=${this.anchor}
          .open=${this.open}
          .quick=${this.quick}
          .corner=${this.corner}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          .fullwidth=${this.fullwidth}
          .menuCorner=${this.menuCorner}
          ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
          class="mdc-menu mdc-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}>
        <mwc-list
          rootTabbable
          .innerAriaLabel=${this.innerAriaLabel}
          .innerRole=${this.innerRole}
          .multi=${this.multi}
          class="mdc-deprecated-list"
          .itemRoles=${e}
          .wrapFocus=${this.wrapFocus}
          .activatable=${this.activatable}
          @action=${this.onAction}>
        <slot></slot>
      </mwc-list>
    </mwc-menu-surface>`;
  }
  createAdapter() {
    return {
      addClassToElementAtIndex: (e, t) => {
        const i = this.listElement;
        if (!i) return;
        const c = i.items[e];
        c &&
          ("mdc-menu-item--selected" === t
            ? this.forceGroupSelection && !c.selected && i.toggle(e, !0)
            : c.classList.add(t));
      },
      removeClassFromElementAtIndex: (e, t) => {
        const i = this.listElement;
        if (!i) return;
        const c = i.items[e];
        c &&
          ("mdc-menu-item--selected" === t
            ? c.selected && i.toggle(e, !1)
            : c.classList.remove(t));
      },
      addAttributeToElementAtIndex: (e, t, i) => {
        const c = this.listElement;
        if (!c) return;
        const o = c.items[e];
        o && o.setAttribute(t, i);
      },
      removeAttributeFromElementAtIndex: (e, t) => {
        const i = this.listElement;
        if (!i) return;
        const c = i.items[e];
        c && c.removeAttribute(t);
      },
      getAttributeFromElementAtIndex: (e, t) => {
        const i = this.listElement;
        if (!i) return null;
        const c = i.items[e];
        return c ? c.getAttribute(t) : null;
      },
      elementContainsClass: (e, t) => e.classList.contains(t),
      closeSurface: () => {
        this.open = !1;
      },
      getElementIndex: (e) => {
        const t = this.listElement;
        return t ? t.items.indexOf(e) : -1;
      },
      notifySelected: () => {},
      getMenuItemCount: () => {
        const e = this.listElement;
        return e ? e.items.length : 0;
      },
      focusItemAtIndex: (e) => {
        const t = this.listElement;
        if (!t) return;
        const i = t.items[e];
        i && i.focus();
      },
      focusListRoot: () => {
        this.listElement && this.listElement.focus();
      },
      getSelectedSiblingOfItemAtIndex: (e) => {
        const t = this.listElement;
        if (!t) return -1;
        const i = t.items[e];
        if (!i || !i.group) return -1;
        for (let c = 0; c < t.items.length; c++) {
          if (c === e) continue;
          const o = t.items[c];
          if (o.selected && o.group === i.group) return c;
        }
        return -1;
      },
      isSelectableItemAtIndex: (e) => {
        const t = this.listElement;
        if (!t) return !1;
        const i = t.items[e];
        return !!i && i.hasAttribute("group");
      },
    };
  }
  onKeydown(e) {
    this.mdcFoundation && this.mdcFoundation.handleKeydown(e);
  }
  onAction(e) {
    const t = this.listElement;
    if (this.mdcFoundation && t) {
      const i = e.detail.index,
        c = t.items[i];
      c && this.mdcFoundation.handleItemAction(c);
    }
  }
  onOpened() {
    (this.open = !0),
      this.mdcFoundation && this.mdcFoundation.handleMenuSurfaceOpened();
  }
  onClosed() {
    this.open = !1;
  }
  async getUpdateComplete() {
    await this._listUpdateComplete;
    return await super.getUpdateComplete();
  }
  async firstUpdated() {
    super.firstUpdated();
    const e = this.listElement;
    e &&
      ((this._listUpdateComplete = e.updateComplete),
      await this._listUpdateComplete);
  }
  select(e) {
    const t = this.listElement;
    t && t.select(e);
  }
  close() {
    this.open = !1;
  }
  show() {
    this.open = !0;
  }
  getFocusedItemIndex() {
    const e = this.listElement;
    return e ? e.getFocusedItemIndex() : -1;
  }
  focusItemAtIndex(e) {
    const t = this.listElement;
    t && t.focusItemAtIndex(e);
  }
  layout(e = !0) {
    const t = this.listElement;
    t && t.layout(e);
  }
}
o([r(".mdc-menu")], W.prototype, "mdcRoot", void 0),
  o([r("slot")], W.prototype, "slotElement", void 0),
  o([n({ type: Object })], W.prototype, "anchor", void 0),
  o([n({ type: Boolean, reflect: !0 })], W.prototype, "open", void 0),
  o([n({ type: Boolean })], W.prototype, "quick", void 0),
  o([n({ type: Boolean })], W.prototype, "wrapFocus", void 0),
  o([n({ type: String })], W.prototype, "innerRole", void 0),
  o([n({ type: String })], W.prototype, "innerAriaLabel", void 0),
  o([n({ type: String })], W.prototype, "corner", void 0),
  o([n({ type: Number })], W.prototype, "x", void 0),
  o([n({ type: Number })], W.prototype, "y", void 0),
  o([n({ type: Boolean })], W.prototype, "absolute", void 0),
  o([n({ type: Boolean })], W.prototype, "multi", void 0),
  o([n({ type: Boolean })], W.prototype, "activatable", void 0),
  o([n({ type: Boolean })], W.prototype, "fixed", void 0),
  o([n({ type: Boolean })], W.prototype, "forceGroupSelection", void 0),
  o([n({ type: Boolean })], W.prototype, "fullwidth", void 0),
  o([n({ type: String })], W.prototype, "menuCorner", void 0),
  o([n({ type: Boolean })], W.prototype, "stayOpenOnBodyClick", void 0),
  o(
    [
      n({ type: String }),
      C(function (e) {
        this.mdcFoundation && this.mdcFoundation.setDefaultFocusState(P[e]);
      }),
    ],
    W.prototype,
    "defaultFocus",
    void 0
  );
const q = f`mwc-list ::slotted([mwc-list-item]:not([twoline])),mwc-list ::slotted([noninteractive]:not([twoline])){height:var(--mdc-menu-item-height, 48px)}`;
let K = class extends W {};
var V, X;
(K.styles = [q]), (K = o([b("mwc-menu")], K));
const Q =
  null !==
    (X = null === (V = window.ShadyDOM) || void 0 === V ? void 0 : V.inUse) &&
  void 0 !== X &&
  X;
class Y extends d {
  constructor() {
    super(...arguments),
      (this.disabled = !1),
      (this.containingForm = null),
      (this.formDataListener = (e) => {
        this.disabled || this.setFormData(e.formData);
      });
  }
  findFormElement() {
    if (!this.shadowRoot || Q) return null;
    const e = this.getRootNode().querySelectorAll("form");
    for (const t of Array.from(e)) if (t.contains(this)) return t;
    return null;
  }
  connectedCallback() {
    var e;
    super.connectedCallback(),
      (this.containingForm = this.findFormElement()),
      null === (e = this.containingForm) ||
        void 0 === e ||
        e.addEventListener("formdata", this.formDataListener);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(),
      null === (e = this.containingForm) ||
        void 0 === e ||
        e.removeEventListener("formdata", this.formDataListener),
      (this.containingForm = null);
  }
  click() {
    this.formElement &&
      !this.disabled &&
      (this.formElement.focus(), this.formElement.click());
  }
  firstUpdated() {
    super.firstUpdated(),
      this.shadowRoot &&
        this.mdcRoot.addEventListener("change", (e) => {
          this.dispatchEvent(new Event("change", e));
        });
  }
}
(Y.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
  o([n({ type: Boolean })], Y.prototype, "disabled", void 0);
var J =
  '/**\n * @license\n * Copyright Google LLC All Rights Reserved.\n *\n * Use of this source code is governed by an MIT-style license that can be\n * found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE\n */\n.mdc-touch-target-wrapper{display:inline}.mdc-deprecated-chip-trailing-action__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}.mdc-deprecated-chip-trailing-action{border:none;display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;padding:0;outline:none;cursor:pointer;-webkit-appearance:none;background:none}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__icon{height:18px;width:18px;font-size:18px}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__touch{width:26px}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__icon{fill:currentColor;color:inherit}@-webkit-keyframes mdc-ripple-fg-radius-in{from{-webkit-animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-radius-in{from{-webkit-animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@-webkit-keyframes mdc-ripple-fg-opacity-in{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-in{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@-webkit-keyframes mdc-ripple-fg-opacity-out{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}@keyframes mdc-ripple-fg-opacity-out{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-deprecated-chip-trailing-action{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded .mdc-deprecated-chip-trailing-action__ripple::before{-webkit-transform:scale(var(--mdc-ripple-fg-scale, 1));transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded .mdc-deprecated-chip-trailing-action__ripple::after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded--unbounded .mdc-deprecated-chip-trailing-action__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded--foreground-activation .mdc-deprecated-chip-trailing-action__ripple::after{-webkit-animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded--foreground-deactivation .mdc-deprecated-chip-trailing-action__ripple::after{-webkit-animation:mdc-ripple-fg-opacity-out 150ms;animation:mdc-ripple-fg-opacity-out 150ms;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded .mdc-deprecated-chip-trailing-action__ripple::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded .mdc-deprecated-chip-trailing-action__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-deprecated-chip-trailing-action:hover .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action.mdc-ripple-surface--hover .mdc-deprecated-chip-trailing-action__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded--background-focused .mdc-deprecated-chip-trailing-action__ripple::before,.mdc-deprecated-chip-trailing-action:not(.mdc-ripple-upgraded):focus .mdc-deprecated-chip-trailing-action__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-deprecated-chip-trailing-action:not(.mdc-ripple-upgraded) .mdc-deprecated-chip-trailing-action__ripple::after{transition:opacity 150ms linear}.mdc-deprecated-chip-trailing-action:not(.mdc-ripple-upgraded):active .mdc-deprecated-chip-trailing-action__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-deprecated-chip-trailing-action.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-deprecated-chip-trailing-action .mdc-deprecated-chip-trailing-action__ripple{position:absolute;box-sizing:content-box;width:100%;height:100%;overflow:hidden}.mdc-chip__icon--leading{color:rgba(0,0,0,.54)}.mdc-deprecated-chip-trailing-action{color:#000}.mdc-chip__icon--trailing{color:rgba(0,0,0,.54)}.mdc-chip__icon--trailing:hover{color:rgba(0,0,0,.62)}.mdc-chip__icon--trailing:focus{color:rgba(0,0,0,.87)}.mdc-chip__icon.mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden){width:20px;height:20px;font-size:20px}.mdc-deprecated-chip-trailing-action__icon{height:18px;width:18px;font-size:18px}.mdc-chip__icon.mdc-chip__icon--trailing{width:18px;height:18px;font-size:18px}.mdc-deprecated-chip-trailing-action{margin-left:4px;margin-right:-4px}[dir=rtl] .mdc-deprecated-chip-trailing-action,.mdc-deprecated-chip-trailing-action[dir=rtl]{margin-left:-4px;margin-right:4px}.mdc-chip__icon--trailing{margin-left:4px;margin-right:-4px}[dir=rtl] .mdc-chip__icon--trailing,.mdc-chip__icon--trailing[dir=rtl]{margin-left:-4px;margin-right:4px}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color, #fff)}.mdc-chip{border-radius:16px;background-color:#e0e0e0;color:rgba(0, 0, 0, 0.87);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;-webkit-text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);height:32px;position:relative;display:inline-flex;align-items:center;box-sizing:border-box;padding:0 12px;border-width:0;outline:none;cursor:pointer;-webkit-appearance:none}.mdc-chip .mdc-chip__ripple{border-radius:16px}.mdc-chip:hover{color:rgba(0, 0, 0, 0.87)}.mdc-chip.mdc-chip--selected .mdc-chip__checkmark,.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden){margin-left:-4px;margin-right:4px}[dir=rtl] .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,[dir=rtl] .mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden),.mdc-chip.mdc-chip--selected .mdc-chip__checkmark[dir=rtl],.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden)[dir=rtl]{margin-left:4px;margin-right:-4px}.mdc-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-chip::-moz-focus-inner{padding:0;border:0}.mdc-chip:hover{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-chip .mdc-chip__touch{position:absolute;top:50%;height:48px;left:0;right:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.mdc-chip--exit{transition:opacity 75ms cubic-bezier(0.4, 0, 0.2, 1),width 150ms cubic-bezier(0, 0, 0.2, 1),padding 100ms linear,margin 100ms linear;opacity:0}.mdc-chip__overflow{text-overflow:ellipsis;overflow:hidden}.mdc-chip__text{white-space:nowrap}.mdc-chip__icon{border-radius:50%;outline:none;vertical-align:middle}.mdc-chip__checkmark{height:20px}.mdc-chip__checkmark-path{transition:stroke-dashoffset 150ms 50ms cubic-bezier(0.4, 0, 0.6, 1);stroke-width:2px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-chip__primary-action:focus{outline:none}.mdc-chip--selected .mdc-chip__checkmark-path{stroke-dashoffset:0}.mdc-chip__icon--leading,.mdc-chip__icon--trailing{position:relative}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__icon--leading{color:rgba(98,0,238,.54)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-chip-set--choice .mdc-chip .mdc-chip__checkmark-path{stroke:#6200ee;stroke:var(--mdc-theme-primary, #6200ee)}.mdc-chip-set--choice .mdc-chip--selected{background-color:#fff;background-color:var(--mdc-theme-surface, #fff)}.mdc-chip__checkmark-svg{width:0;height:20px;transition:width 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-chip--selected .mdc-chip__checkmark-svg{width:20px}.mdc-chip-set--filter .mdc-chip__icon--leading{transition:opacity 75ms linear;transition-delay:-50ms;opacity:1}.mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark{transition:opacity 75ms linear;transition-delay:80ms;opacity:0}.mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark .mdc-chip__checkmark-svg{transition:width 0ms}.mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading{opacity:0}.mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading+.mdc-chip__checkmark{width:0;opacity:1}.mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading{width:0;opacity:0}.mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading+.mdc-chip__checkmark{width:20px}.mdc-chip{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-chip .mdc-chip__ripple::before,.mdc-chip .mdc-chip__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-chip .mdc-chip__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-chip .mdc-chip__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple::before{-webkit-transform:scale(var(--mdc-ripple-fg-scale, 1));transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple::after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-chip.mdc-ripple-upgraded--unbounded .mdc-chip__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-chip.mdc-ripple-upgraded--foreground-activation .mdc-chip__ripple::after{-webkit-animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-chip.mdc-ripple-upgraded--foreground-deactivation .mdc-chip__ripple::after{-webkit-animation:mdc-ripple-fg-opacity-out 150ms;animation:mdc-ripple-fg-opacity-out 150ms;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-chip .mdc-chip__ripple::before,.mdc-chip .mdc-chip__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-chip .mdc-chip__ripple::before,.mdc-chip .mdc-chip__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-chip:hover .mdc-chip__ripple::before,.mdc-chip.mdc-ripple-surface--hover .mdc-chip__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-chip.mdc-ripple-upgraded--background-focused .mdc-chip__ripple::before,.mdc-chip.mdc-ripple-upgraded:focus-within .mdc-chip__ripple::before,.mdc-chip:not(.mdc-ripple-upgraded):focus .mdc-chip__ripple::before,.mdc-chip:not(.mdc-ripple-upgraded):focus-within .mdc-chip__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-chip:not(.mdc-ripple-upgraded) .mdc-chip__ripple::after{transition:opacity 150ms linear}.mdc-chip:not(.mdc-ripple-upgraded):active .mdc-chip__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-chip.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-chip .mdc-chip__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple::before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover .mdc-chip__ripple::before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-surface--hover .mdc-chip__ripple::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded--background-focused .mdc-chip__ripple::before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded:focus-within .mdc-chip__ripple::before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus .mdc-chip__ripple::before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus-within .mdc-chip__ripple::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded) .mdc-chip__ripple::after{transition:opacity 150ms linear}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):active .mdc-chip__ripple::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}@-webkit-keyframes mdc-chip-entry{from{-webkit-transform:scale(0.8);transform:scale(0.8);opacity:.4}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes mdc-chip-entry{from{-webkit-transform:scale(0.8);transform:scale(0.8);opacity:.4}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.mdc-chip-set{padding:4px;display:flex;flex-wrap:wrap;box-sizing:border-box}.mdc-chip-set .mdc-chip{margin:4px}.mdc-chip-set .mdc-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-chip-set--input .mdc-chip{-webkit-animation:mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1);animation:mdc-chip-entry 100ms cubic-bezier(0, 0, 0.2, 1)}\n\n/*# sourceMappingURL=mdc.chips.min.css.map*/';
g(
  [b("ha-chip")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "hasIcon",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "hasTrailingIcon",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [n({ type: Boolean })],
          key: "noText",
          value: () => !1,
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            return s`
      <div class="mdc-chip ${this.noText ? "no-text" : ""}">
        ${
          this.hasIcon
            ? s`<div class="mdc-chip__icon mdc-chip__icon--leading">
              <slot name="icon"></slot>
            </div>`
            : null
        }
        <div class="mdc-chip__ripple"></div>
        <span role="gridcell">
          <span role="button" tabindex="0" class="mdc-chip__primary-action">
            <span class="mdc-chip__text"><slot></slot></span>
          </span>
        </span>
        ${
          this.hasTrailingIcon
            ? s`<div class="mdc-chip__icon mdc-chip__icon--trailing">
              <slot name="trailing-icon"></slot>
            </div>`
            : null
        }
      </div>
    `;
          },
        },
        {
          kind: "get",
          static: !0,
          key: "styles",
          value: function () {
            return f`
      ${x(J)}
      .mdc-chip {
        background-color: var(
          --ha-chip-background-color,
          rgba(var(--rgb-primary-text-color), 0.15)
        );
        color: var(--ha-chip-text-color, var(--primary-text-color));
      }

      .mdc-chip.no-text {
        padding: 0 10px;
      }

      .mdc-chip:hover {
        color: var(--ha-chip-text-color, var(--primary-text-color));
      }

      .mdc-chip__icon--leading,
      .mdc-chip__icon--trailing {
        --mdc-icon-size: 18px;
        line-height: 14px;
        color: var(--ha-chip-icon-color, var(--ha-chip-text-color));
      }
      .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,
      .mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
        margin-right: -4px;
        margin-inline-start: -4px;
        margin-inline-end: 4px;
        direction: var(--direction);
      }

      span[role="gridcell"] {
        line-height: 14px;
      }
    `;
          },
        },
      ],
    };
  },
  k
);
class Z extends Y {
  constructor() {
    super(...arguments),
      (this.checked = !1),
      (this.indeterminate = !1),
      (this.disabled = !1),
      (this.name = ""),
      (this.value = "on"),
      (this.reducedTouchTarget = !1),
      (this.animationClass = ""),
      (this.shouldRenderRipple = !1),
      (this.focused = !1),
      (this.mdcFoundationClass = void 0),
      (this.mdcFoundation = void 0),
      (this.rippleElement = null),
      (this.rippleHandlers = new T(
        () => (
          (this.shouldRenderRipple = !0),
          this.ripple.then((e) => (this.rippleElement = e)),
          this.ripple
        )
      ));
  }
  createAdapter() {
    return {};
  }
  update(e) {
    const t = e.get("indeterminate"),
      i = e.get("checked"),
      c = e.get("disabled");
    if (void 0 !== t || void 0 !== i || void 0 !== c) {
      const e = this.calculateAnimationStateName(!!i, !!t, !!c),
        o = this.calculateAnimationStateName(
          this.checked,
          this.indeterminate,
          this.disabled
        );
      this.animationClass = `${e}-${o}`;
    }
    super.update(e);
  }
  calculateAnimationStateName(e, t, i) {
    return i ? "disabled" : t ? "indeterminate" : e ? "checked" : "unchecked";
  }
  renderRipple() {
    return this.shouldRenderRipple ? this.renderRippleTemplate() : "";
  }
  renderRippleTemplate() {
    return s`<mwc-ripple
        .disabled="${this.disabled}"
        unbounded></mwc-ripple>`;
  }
  render() {
    const e = this.indeterminate || this.checked,
      t = {
        "mdc-checkbox--disabled": this.disabled,
        "mdc-checkbox--selected": e,
        "mdc-checkbox--touch": !this.reducedTouchTarget,
        "mdc-ripple-upgraded--background-focused": this.focused,
        "mdc-checkbox--anim-checked-indeterminate":
          "checked-indeterminate" == this.animationClass,
        "mdc-checkbox--anim-checked-unchecked":
          "checked-unchecked" == this.animationClass,
        "mdc-checkbox--anim-indeterminate-checked":
          "indeterminate-checked" == this.animationClass,
        "mdc-checkbox--anim-indeterminate-unchecked":
          "indeterminate-unchecked" == this.animationClass,
        "mdc-checkbox--anim-unchecked-checked":
          "unchecked-checked" == this.animationClass,
        "mdc-checkbox--anim-unchecked-indeterminate":
          "unchecked-indeterminate" == this.animationClass,
      },
      i = this.indeterminate ? "mixed" : void 0;
    return s`
      <div class="mdc-checkbox mdc-checkbox--upgraded ${p(t)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              name="${w(this.name)}"
              aria-checked="${w(i)}"
              aria-label="${w(this.ariaLabel)}"
              aria-labelledby="${w(this.ariaLabelledBy)}"
              aria-describedby="${w(this.ariaDescribedBy)}"
              data-indeterminate="${this.indeterminate ? "true" : "false"}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this.handleChange}"
              @focus="${this.handleFocus}"
              @blur="${this.handleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
        <div class="mdc-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
  }
  setFormData(e) {
    this.name && this.checked && e.append(this.name, this.value);
  }
  handleFocus() {
    (this.focused = !0), this.handleRippleFocus();
  }
  handleBlur() {
    (this.focused = !1), this.handleRippleBlur();
  }
  handleRippleMouseDown(e) {
    const t = () => {
      window.removeEventListener("mouseup", t), this.handleRippleDeactivate();
    };
    window.addEventListener("mouseup", t), this.rippleHandlers.startPress(e);
  }
  handleRippleTouchStart(e) {
    this.rippleHandlers.startPress(e);
  }
  handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }
  handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }
  handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }
  handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }
  handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
  handleChange() {
    (this.checked = this.formElement.checked),
      (this.indeterminate = this.formElement.indeterminate);
  }
  resetAnimationClass() {
    this.animationClass = "";
  }
  get isRippleActive() {
    var e;
    return (
      (null === (e = this.rippleElement) || void 0 === e
        ? void 0
        : e.isActive) || !1
    );
  }
}
o([r(".mdc-checkbox")], Z.prototype, "mdcRoot", void 0),
  o([r("input")], Z.prototype, "formElement", void 0),
  o([n({ type: Boolean, reflect: !0 })], Z.prototype, "checked", void 0),
  o([n({ type: Boolean })], Z.prototype, "indeterminate", void 0),
  o([n({ type: Boolean, reflect: !0 })], Z.prototype, "disabled", void 0),
  o([n({ type: String, reflect: !0 })], Z.prototype, "name", void 0),
  o([n({ type: String })], Z.prototype, "value", void 0),
  o(
    [_, n({ type: String, attribute: "aria-label" })],
    Z.prototype,
    "ariaLabel",
    void 0
  ),
  o(
    [_, n({ type: String, attribute: "aria-labelledby" })],
    Z.prototype,
    "ariaLabelledBy",
    void 0
  ),
  o(
    [_, n({ type: String, attribute: "aria-describedby" })],
    Z.prototype,
    "ariaDescribedBy",
    void 0
  ),
  o([n({ type: Boolean })], Z.prototype, "reducedTouchTarget", void 0),
  o([a()], Z.prototype, "animationClass", void 0),
  o([a()], Z.prototype, "shouldRenderRipple", void 0),
  o([a()], Z.prototype, "focused", void 0),
  o([y("mwc-ripple")], Z.prototype, "ripple", void 0),
  o([v({ passive: !0 })], Z.prototype, "handleRippleTouchStart", null);
const ee = f`.mdc-checkbox{padding:calc((40px - 18px) / 2);padding:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);margin:calc((40px - 40px) / 2);margin:calc((var(--mdc-checkbox-touch-target-size, 40px) - 40px) / 2)}.mdc-checkbox .mdc-checkbox__ripple::before,.mdc-checkbox .mdc-checkbox__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-checkbox:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px) / 2);top:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);left:calc((40px - 18px) / 2);left:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px) / 2);top:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);right:calc((40px - 40px) / 2);right:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);left:calc((40px - 40px) / 2);left:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);width:40px;width:var(--mdc-checkbox-touch-target-size, 40px);height:40px;height:var(--mdc-checkbox-touch-target-size, 40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}100%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.38);border-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0, 0, 0, 0.38);background-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:GrayText;border-color:var(--mdc-checkbox-disabled-color, GrayText);background-color:transparent}.mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:GrayText;background-color:transparent;background-color:var(--mdc-checkbox-disabled-color, transparent)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:GrayText;color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:GrayText;border-color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size, 48px) - var(--mdc-checkbox-state-layer-size, 40px)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px) / 2);top:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);right:calc((40px - 48px) / 2);right:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);left:calc((40px - 48px) / 2);left:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);width:48px;width:var(--mdc-checkbox-state-layer-size, 48px);height:48px;height:var(--mdc-checkbox-state-layer-size, 48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:none;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}`;
g(
  [b("ha-checkbox")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            ee,
            f`
      :host {
        --mdc-theme-secondary: var(--primary-color);
      }
    `,
          ],
        },
      ],
    };
  },
  Z
);
var te = { ROOT: "mdc-form-field" },
  ie = { LABEL_SELECTOR: ".mdc-form-field > label" },
  ce = (function (i) {
    function c(e) {
      var o = i.call(this, t(t({}, c.defaultAdapter), e)) || this;
      return (
        (o.click = function () {
          o.handleClick();
        }),
        o
      );
    }
    return (
      e(c, i),
      Object.defineProperty(c, "cssClasses", {
        get: function () {
          return te;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(c, "strings", {
        get: function () {
          return ie;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(c, "defaultAdapter", {
        get: function () {
          return {
            activateInputRipple: function () {},
            deactivateInputRipple: function () {},
            deregisterInteractionHandler: function () {},
            registerInteractionHandler: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (c.prototype.init = function () {
        this.adapter.registerInteractionHandler("click", this.click);
      }),
      (c.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler("click", this.click);
      }),
      (c.prototype.handleClick = function () {
        var e = this;
        this.adapter.activateInputRipple(),
          requestAnimationFrame(function () {
            e.adapter.deactivateInputRipple();
          });
      }),
      c
    );
  })(c);
class oe extends d {
  constructor() {
    super(...arguments),
      (this.alignEnd = !1),
      (this.spaceBetween = !1),
      (this.nowrap = !1),
      (this.label = ""),
      (this.mdcFoundationClass = ce);
  }
  createAdapter() {
    return {
      registerInteractionHandler: (e, t) => {
        this.labelEl.addEventListener(e, t);
      },
      deregisterInteractionHandler: (e, t) => {
        this.labelEl.removeEventListener(e, t);
      },
      activateInputRipple: async () => {
        const e = this.input;
        if (e instanceof Y) {
          const t = await e.ripple;
          t && t.startPress();
        }
      },
      deactivateInputRipple: async () => {
        const e = this.input;
        if (e instanceof Y) {
          const t = await e.ripple;
          t && t.endPress();
        }
      },
    };
  }
  get input() {
    var e, t;
    return null !==
      (t = null === (e = this.slottedInputs) || void 0 === e ? void 0 : e[0]) &&
      void 0 !== t
      ? t
      : null;
  }
  render() {
    const e = {
      "mdc-form-field--align-end": this.alignEnd,
      "mdc-form-field--space-between": this.spaceBetween,
      "mdc-form-field--nowrap": this.nowrap,
    };
    return s`
      <div class="mdc-form-field ${p(e)}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
      </div>`;
  }
  click() {
    this._labelClick();
  }
  _labelClick() {
    const e = this.input;
    e && (e.focus(), e.click());
  }
}
o([n({ type: Boolean })], oe.prototype, "alignEnd", void 0),
  o([n({ type: Boolean })], oe.prototype, "spaceBetween", void 0),
  o([n({ type: Boolean })], oe.prototype, "nowrap", void 0),
  o(
    [
      n({ type: String }),
      C(async function (e) {
        var t;
        null === (t = this.input) ||
          void 0 === t ||
          t.setAttribute("aria-label", e);
      }),
    ],
    oe.prototype,
    "label",
    void 0
  ),
  o([r(".mdc-form-field")], oe.prototype, "mdcRoot", void 0),
  o([I("", !0, "*")], oe.prototype, "slottedInputs", void 0),
  o([r("label")], oe.prototype, "labelEl", void 0);
const re = f`.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{margin-left:auto;margin-right:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}[dir=rtl] .mdc-form-field--space-between>label,.mdc-form-field--space-between>label[dir=rtl]{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}::slotted(mwc-switch){margin-right:10px}[dir=rtl] ::slotted(mwc-switch),::slotted(mwc-switch[dir=rtl]){margin-left:10px}`;
g(
  [b("ha-formfield")],
  function (e, t) {
    return {
      F: class extends t {
        constructor(...t) {
          super(...t), e(this);
        }
      },
      d: [
        {
          kind: "method",
          key: "_labelClick",
          value: function () {
            const e = this.input;
            if (e)
              switch ((e.focus(), e.tagName)) {
                case "HA-CHECKBOX":
                case "HA-RADIO":
                  (e.checked = !e.checked), E(e, "change");
                  break;
                default:
                  e.click();
              }
          },
        },
        {
          kind: "field",
          static: !0,
          key: "styles",
          value: () => [
            re,
            f`
      :host(:not([alignEnd])) ::slotted(ha-switch) {
        margin-right: 10px;
        margin-inline-end: 10px;
        margin-inline-start: inline;
      }
      .mdc-form-field > label {
        direction: var(--direction);
        margin-inline-start: 0;
        margin-inline-end: auto;
        padding-inline-start: 4px;
        padding-inline-end: 0;
      }
    `,
          ],
        },
      ],
    };
  },
  oe
);
export { R as C, Y as F, oe as a, ee as b, Z as c, J as d, re as s };
