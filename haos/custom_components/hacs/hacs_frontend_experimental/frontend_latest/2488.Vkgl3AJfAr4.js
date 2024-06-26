/*! For license information please see 2488.Vkgl3AJfAr4.js.LICENSE.txt */
export const id = 2488;
export const ids = [2488];
export const modules = {
  86477: (t, e, r) => {
    var o = r(43204),
      i = r(95260),
      s = r(5095),
      n = r(25550);
    const a = ["focusin", "focusout", "pointerdown"];
    class d extends s.oi {
      constructor() {
        super(...arguments),
          (this.visible = !1),
          (this.inward = !1),
          (this.attachableController = new n.J(
            this,
            this.onControlChange.bind(this)
          ));
      }
      get htmlFor() {
        return this.attachableController.htmlFor;
      }
      set htmlFor(t) {
        this.attachableController.htmlFor = t;
      }
      get control() {
        return this.attachableController.control;
      }
      set control(t) {
        this.attachableController.control = t;
      }
      attach(t) {
        this.attachableController.attach(t);
      }
      detach() {
        this.attachableController.detach();
      }
      connectedCallback() {
        super.connectedCallback(), this.setAttribute("aria-hidden", "true");
      }
      handleEvent(t) {
        var e, r;
        if (!t[h]) {
          switch (t.type) {
            default:
              return;
            case "focusin":
              this.visible =
                null !==
                  (e =
                    null === (r = this.control) || void 0 === r
                      ? void 0
                      : r.matches(":focus-visible")) &&
                void 0 !== e &&
                e;
              break;
            case "focusout":
            case "pointerdown":
              this.visible = !1;
          }
          t[h] = !0;
        }
      }
      onControlChange(t, e) {
        if (!s.sk)
          for (const r of a)
            null == t || t.removeEventListener(r, this),
              null == e || e.addEventListener(r, this);
      }
      update(t) {
        t.has("visible") && this.dispatchEvent(new Event("visibility-changed")),
          super.update(t);
      }
    }
    (0, o.__decorate)(
      [(0, i.Cb)({ type: Boolean, reflect: !0 })],
      d.prototype,
      "visible",
      void 0
    ),
      (0, o.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        d.prototype,
        "inward",
        void 0
      );
    const h = Symbol("handledByFocusRing"),
      l = s.iv`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2,0,0,1);box-sizing:border-box;color:var(--md-focus-ring-color,var(--md-sys-color-secondary,#625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end,var(--md-focus-ring-shape,9999px)) + var(--md-focus-ring-outward-offset,2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start,var(--md-focus-ring-shape,9999px)) + var(--md-focus-ring-outward-offset,2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end,var(--md-focus-ring-shape,9999px)) + var(--md-focus-ring-outward-offset,2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start,var(--md-focus-ring-shape,9999px)) + var(--md-focus-ring-outward-offset,2px));inset:calc(-1*var(--md-focus-ring-outward-offset,2px));outline:var(--md-focus-ring-width,3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end,var(--md-focus-ring-shape,9999px)) - var(--md-focus-ring-inward-offset,0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start,var(--md-focus-ring-shape,9999px)) - var(--md-focus-ring-inward-offset,0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end,var(--md-focus-ring-shape,9999px)) - var(--md-focus-ring-inward-offset,0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start,var(--md-focus-ring-shape,9999px)) - var(--md-focus-ring-inward-offset,0px));border:var(--md-focus-ring-width,3px) solid currentColor;inset:var(--md-focus-ring-inward-offset,0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width,8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width,8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width,8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width,8px)}}@media(prefers-reduced-motion){:host{animation:none}}`;
    let c = class extends d {};
    (c.styles = [l]), (c = (0, o.__decorate)([(0, i.Mo)("md-focus-ring")], c));
  },
  25550: (t, e, r) => {
    r.d(e, { J: () => n });
    var o = r(5095);
    const i = Symbol("attachableController");
    let s;
    o.sk ||
      (s = new MutationObserver((t) => {
        for (const r of t) {
          var e;
          null === (e = r.target[i]) || void 0 === e || e.hostConnected();
        }
      }));
    class n {
      get htmlFor() {
        return this.host.getAttribute("for");
      }
      set htmlFor(t) {
        null === t
          ? this.host.removeAttribute("for")
          : this.host.setAttribute("for", t);
      }
      get control() {
        return this.host.hasAttribute("for")
          ? this.htmlFor && this.host.isConnected
            ? this.host.getRootNode().querySelector(`#${this.htmlFor}`)
            : null
          : this.currentControl || this.host.parentElement;
      }
      set control(t) {
        t ? this.attach(t) : this.detach();
      }
      constructor(t, e) {
        var r;
        (this.host = t),
          (this.onControlChange = e),
          (this.currentControl = null),
          t.addController(this),
          (t[i] = this),
          null === (r = s) ||
            void 0 === r ||
            r.observe(t, { attributeFilter: ["for"] });
      }
      attach(t) {
        t !== this.currentControl &&
          (this.setCurrentControl(t), this.host.removeAttribute("for"));
      }
      detach() {
        this.setCurrentControl(null), this.host.setAttribute("for", "");
      }
      hostConnected() {
        this.setCurrentControl(this.control);
      }
      hostDisconnected() {
        this.setCurrentControl(null);
      }
      setCurrentControl(t) {
        this.onControlChange(this.currentControl, t), (this.currentControl = t);
      }
    }
  },
  35981: (t, e, r) => {
    var o = r(43204),
      i = r(95260),
      s = r(5095),
      n = r(53180),
      a = r(25550);
    const d = "cubic-bezier(0.2, 0, 0, 1)";
    var h;
    !(function (t) {
      (t[(t.INACTIVE = 0)] = "INACTIVE"),
        (t[(t.TOUCH_DELAY = 1)] = "TOUCH_DELAY"),
        (t[(t.HOLDING = 2)] = "HOLDING"),
        (t[(t.WAITING_FOR_CLICK = 3)] = "WAITING_FOR_CLICK");
    })(h || (h = {}));
    const l = [
      "click",
      "contextmenu",
      "pointercancel",
      "pointerdown",
      "pointerenter",
      "pointerleave",
      "pointerup",
    ];
    class c extends s.oi {
      constructor() {
        super(...arguments),
          (this.disabled = !1),
          (this.hovered = !1),
          (this.pressed = !1),
          (this.rippleSize = ""),
          (this.rippleScale = ""),
          (this.initialSize = 0),
          (this.state = h.INACTIVE),
          (this.checkBoundsAfterContextMenu = !1),
          (this.attachableController = new a.J(
            this,
            this.onControlChange.bind(this)
          ));
      }
      get htmlFor() {
        return this.attachableController.htmlFor;
      }
      set htmlFor(t) {
        this.attachableController.htmlFor = t;
      }
      get control() {
        return this.attachableController.control;
      }
      set control(t) {
        this.attachableController.control = t;
      }
      attach(t) {
        this.attachableController.attach(t);
      }
      detach() {
        this.attachableController.detach();
      }
      connectedCallback() {
        super.connectedCallback(), this.setAttribute("aria-hidden", "true");
      }
      render() {
        const t = { hovered: this.hovered, pressed: this.pressed };
        return s.dy`<div class="surface ${(0, n.$)(t)}"></div>`;
      }
      update(t) {
        t.has("disabled") &&
          this.disabled &&
          ((this.hovered = !1), (this.pressed = !1)),
          super.update(t);
      }
      handlePointerenter(t) {
        this.shouldReactToEvent(t) && (this.hovered = !0);
      }
      handlePointerleave(t) {
        this.shouldReactToEvent(t) &&
          ((this.hovered = !1),
          this.state !== h.INACTIVE && this.endPressAnimation());
      }
      handlePointerup(t) {
        if (this.shouldReactToEvent(t)) {
          if (this.state !== h.HOLDING)
            return this.state === h.TOUCH_DELAY
              ? ((this.state = h.WAITING_FOR_CLICK),
                void this.startPressAnimation(this.rippleStartEvent))
              : void 0;
          this.state = h.WAITING_FOR_CLICK;
        }
      }
      async handlePointerdown(t) {
        if (this.shouldReactToEvent(t)) {
          if (((this.rippleStartEvent = t), !this.isTouch(t)))
            return (
              (this.state = h.WAITING_FOR_CLICK),
              void this.startPressAnimation(t)
            );
          (this.checkBoundsAfterContextMenu && !this.inBounds(t)) ||
            ((this.checkBoundsAfterContextMenu = !1),
            (this.state = h.TOUCH_DELAY),
            await new Promise((t) => {
              setTimeout(t, 150);
            }),
            this.state === h.TOUCH_DELAY &&
              ((this.state = h.HOLDING), this.startPressAnimation(t)));
        }
      }
      handleClick() {
        this.disabled ||
          (this.state !== h.WAITING_FOR_CLICK
            ? this.state === h.INACTIVE &&
              (this.startPressAnimation(), this.endPressAnimation())
            : this.endPressAnimation());
      }
      handlePointercancel(t) {
        this.shouldReactToEvent(t) && this.endPressAnimation();
      }
      handleContextmenu() {
        this.disabled ||
          ((this.checkBoundsAfterContextMenu = !0), this.endPressAnimation());
      }
      determineRippleSize() {
        const { height: t, width: e } = this.getBoundingClientRect(),
          r = Math.max(t, e),
          o = Math.max(0.35 * r, 75),
          i = Math.floor(0.2 * r),
          s = Math.sqrt(e ** 2 + t ** 2) + 10;
        (this.initialSize = i),
          (this.rippleScale = "" + (s + o) / i),
          (this.rippleSize = `${i}px`);
      }
      getNormalizedPointerEventCoords(t) {
        const { scrollX: e, scrollY: r } = window,
          { left: o, top: i } = this.getBoundingClientRect(),
          s = e + o,
          n = r + i,
          { pageX: a, pageY: d } = t;
        return { x: a - s, y: d - n };
      }
      getTranslationCoordinates(t) {
        const { height: e, width: r } = this.getBoundingClientRect(),
          o = { x: (r - this.initialSize) / 2, y: (e - this.initialSize) / 2 };
        let i;
        return (
          (i =
            t instanceof PointerEvent
              ? this.getNormalizedPointerEventCoords(t)
              : { x: r / 2, y: e / 2 }),
          (i = {
            x: i.x - this.initialSize / 2,
            y: i.y - this.initialSize / 2,
          }),
          { startPoint: i, endPoint: o }
        );
      }
      startPressAnimation(t) {
        var e;
        if (!this.mdRoot) return;
        (this.pressed = !0),
          null === (e = this.growAnimation) || void 0 === e || e.cancel(),
          this.determineRippleSize();
        const { startPoint: r, endPoint: o } =
            this.getTranslationCoordinates(t),
          i = `${r.x}px, ${r.y}px`,
          s = `${o.x}px, ${o.y}px`;
        this.growAnimation = this.mdRoot.animate(
          {
            top: [0, 0],
            left: [0, 0],
            height: [this.rippleSize, this.rippleSize],
            width: [this.rippleSize, this.rippleSize],
            transform: [
              `translate(${i}) scale(1)`,
              `translate(${s}) scale(${this.rippleScale})`,
            ],
          },
          {
            pseudoElement: "::after",
            duration: 450,
            easing: d,
            fill: "forwards",
          }
        );
      }
      async endPressAnimation() {
        this.state = h.INACTIVE;
        const t = this.growAnimation;
        let e = 1 / 0;
        "number" == typeof (null == t ? void 0 : t.currentTime)
          ? (e = t.currentTime)
          : null != t && t.currentTime && (e = t.currentTime.to("ms").value),
          e >= 225
            ? (this.pressed = !1)
            : (await new Promise((t) => {
                setTimeout(t, 225 - e);
              }),
              this.growAnimation === t && (this.pressed = !1));
      }
      shouldReactToEvent(t) {
        if (this.disabled || !t.isPrimary) return !1;
        if (
          this.rippleStartEvent &&
          this.rippleStartEvent.pointerId !== t.pointerId
        )
          return !1;
        if ("pointerenter" === t.type || "pointerleave" === t.type)
          return !this.isTouch(t);
        const e = 1 === t.buttons;
        return this.isTouch(t) || e;
      }
      inBounds({ x: t, y: e }) {
        const {
          top: r,
          left: o,
          bottom: i,
          right: s,
        } = this.getBoundingClientRect();
        return t >= o && t <= s && e >= r && e <= i;
      }
      isTouch({ pointerType: t }) {
        return "touch" === t;
      }
      async handleEvent(t) {
        switch (t.type) {
          case "click":
            this.handleClick();
            break;
          case "contextmenu":
            this.handleContextmenu();
            break;
          case "pointercancel":
            this.handlePointercancel(t);
            break;
          case "pointerdown":
            await this.handlePointerdown(t);
            break;
          case "pointerenter":
            this.handlePointerenter(t);
            break;
          case "pointerleave":
            this.handlePointerleave(t);
            break;
          case "pointerup":
            this.handlePointerup(t);
        }
      }
      onControlChange(t, e) {
        if (!s.sk)
          for (const r of l)
            null == t || t.removeEventListener(r, this),
              null == e || e.addEventListener(r, this);
      }
    }
    (0, o.__decorate)(
      [(0, i.Cb)({ type: Boolean, reflect: !0 })],
      c.prototype,
      "disabled",
      void 0
    ),
      (0, o.__decorate)([(0, i.SB)()], c.prototype, "hovered", void 0),
      (0, o.__decorate)([(0, i.SB)()], c.prototype, "pressed", void 0),
      (0, o.__decorate)([(0, i.IO)(".surface")], c.prototype, "mdRoot", void 0);
    const u = s.iv`:host{--_hover-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-opacity:var(--md-ripple-hover-opacity, 0.08);--_pressed-color:var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-opacity:var(--md-ripple-pressed-opacity, 0.12);display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors:active){:host{display:none}}.surface,:host{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:transparent}.surface::after,.surface::before{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--_hover-color);inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side,var(--_pressed-color) max(100% - 70px,65%),transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--_hover-color);opacity:var(--_hover-opacity)}.pressed::after{opacity:var(--_pressed-opacity);transition-duration:105ms}`;
    let p = class extends c {};
    (p.styles = [u]), (p = (0, o.__decorate)([(0, i.Mo)("md-ripple")], p));
  },
};
//# sourceMappingURL=2488.Vkgl3AJfAr4.js.map
