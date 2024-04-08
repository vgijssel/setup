/*! For license information please see 8597.xDuErO-I45I.js.LICENSE.txt */
export const id = 8597;
export const ids = [8597];
export const modules = {
  87762: (t, e, i) => {
    i.d(e, { M: () => y });
    var o,
      n = i(43204),
      a =
        (i(16638),
        i(92187),
        {
          CLOSING: "mdc-dialog--closing",
          OPEN: "mdc-dialog--open",
          OPENING: "mdc-dialog--opening",
          SCROLLABLE: "mdc-dialog--scrollable",
          SCROLL_LOCK: "mdc-dialog-scroll-lock",
          STACKED: "mdc-dialog--stacked",
          FULLSCREEN: "mdc-dialog--fullscreen",
          SCROLL_DIVIDER_HEADER: "mdc-dialog-scroll-divider-header",
          SCROLL_DIVIDER_FOOTER: "mdc-dialog-scroll-divider-footer",
          SURFACE_SCRIM_SHOWN: "mdc-dialog__surface-scrim--shown",
          SURFACE_SCRIM_SHOWING: "mdc-dialog__surface-scrim--showing",
          SURFACE_SCRIM_HIDING: "mdc-dialog__surface-scrim--hiding",
          SCRIM_HIDDEN: "mdc-dialog__scrim--hidden",
        }),
      d = {
        ACTION_ATTRIBUTE: "data-mdc-dialog-action",
        BUTTON_DEFAULT_ATTRIBUTE: "data-mdc-dialog-button-default",
        BUTTON_SELECTOR: ".mdc-dialog__button",
        CLOSED_EVENT: "MDCDialog:closed",
        CLOSE_ACTION: "close",
        CLOSING_EVENT: "MDCDialog:closing",
        CONTAINER_SELECTOR: ".mdc-dialog__container",
        CONTENT_SELECTOR: ".mdc-dialog__content",
        DESTROY_ACTION: "destroy",
        INITIAL_FOCUS_ATTRIBUTE: "data-mdc-dialog-initial-focus",
        OPENED_EVENT: "MDCDialog:opened",
        OPENING_EVENT: "MDCDialog:opening",
        SCRIM_SELECTOR: ".mdc-dialog__scrim",
        SUPPRESS_DEFAULT_PRESS_SELECTOR: [
          "textarea",
          ".mdc-menu .mdc-list-item",
          ".mdc-menu .mdc-deprecated-list-item",
        ].join(", "),
        SURFACE_SELECTOR: ".mdc-dialog__surface",
      },
      r = {
        DIALOG_ANIMATION_CLOSE_TIME_MS: 75,
        DIALOG_ANIMATION_OPEN_TIME_MS: 150,
      },
      s = (function () {
        function t() {
          this.rafIDs = new Map();
        }
        return (
          (t.prototype.request = function (t, e) {
            var i = this;
            this.cancel(t);
            var o = requestAnimationFrame(function (o) {
              i.rafIDs.delete(t), e(o);
            });
            this.rafIDs.set(t, o);
          }),
          (t.prototype.cancel = function (t) {
            var e = this.rafIDs.get(t);
            e && (cancelAnimationFrame(e), this.rafIDs.delete(t));
          }),
          (t.prototype.cancelAll = function () {
            var t = this;
            this.rafIDs.forEach(function (e, i) {
              t.cancel(i);
            });
          }),
          (t.prototype.getQueue = function () {
            var t = [];
            return (
              this.rafIDs.forEach(function (e, i) {
                t.push(i);
              }),
              t
            );
          }),
          t
        );
      })(),
      c = i(72774);
    !(function (t) {
      (t.POLL_SCROLL_POS = "poll_scroll_position"),
        (t.POLL_LAYOUT_CHANGE = "poll_layout_change");
    })(o || (o = {}));
    const l = (function (t) {
      function e(i) {
        var o =
          t.call(
            this,
            (0, n.__assign)((0, n.__assign)({}, e.defaultAdapter), i)
          ) || this;
        return (
          (o.dialogOpen = !1),
          (o.isFullscreen = !1),
          (o.animationFrame = 0),
          (o.animationTimer = 0),
          (o.escapeKeyAction = d.CLOSE_ACTION),
          (o.scrimClickAction = d.CLOSE_ACTION),
          (o.autoStackButtons = !0),
          (o.areButtonsStacked = !1),
          (o.suppressDefaultPressSelector = d.SUPPRESS_DEFAULT_PRESS_SELECTOR),
          (o.animFrame = new s()),
          (o.contentScrollHandler = function () {
            o.handleScrollEvent();
          }),
          (o.windowResizeHandler = function () {
            o.layout();
          }),
          (o.windowOrientationChangeHandler = function () {
            o.layout();
          }),
          o
        );
      }
      return (
        (0, n.__extends)(e, t),
        Object.defineProperty(e, "cssClasses", {
          get: function () {
            return a;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "strings", {
          get: function () {
            return d;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "numbers", {
          get: function () {
            return r;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "defaultAdapter", {
          get: function () {
            return {
              addBodyClass: function () {},
              addClass: function () {},
              areButtonsStacked: function () {
                return !1;
              },
              clickDefaultButton: function () {},
              eventTargetMatches: function () {
                return !1;
              },
              getActionFromEvent: function () {
                return "";
              },
              getInitialFocusEl: function () {
                return null;
              },
              hasClass: function () {
                return !1;
              },
              isContentScrollable: function () {
                return !1;
              },
              notifyClosed: function () {},
              notifyClosing: function () {},
              notifyOpened: function () {},
              notifyOpening: function () {},
              releaseFocus: function () {},
              removeBodyClass: function () {},
              removeClass: function () {},
              reverseButtons: function () {},
              trapFocus: function () {},
              registerContentEventHandler: function () {},
              deregisterContentEventHandler: function () {},
              isScrollableContentAtTop: function () {
                return !1;
              },
              isScrollableContentAtBottom: function () {
                return !1;
              },
              registerWindowEventHandler: function () {},
              deregisterWindowEventHandler: function () {},
            };
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.prototype.init = function () {
          this.adapter.hasClass(a.STACKED) && this.setAutoStackButtons(!1),
            (this.isFullscreen = this.adapter.hasClass(a.FULLSCREEN));
        }),
        (e.prototype.destroy = function () {
          this.animationTimer &&
            (clearTimeout(this.animationTimer), this.handleAnimationTimerEnd()),
            this.isFullscreen &&
              this.adapter.deregisterContentEventHandler(
                "scroll",
                this.contentScrollHandler
              ),
            this.animFrame.cancelAll(),
            this.adapter.deregisterWindowEventHandler(
              "resize",
              this.windowResizeHandler
            ),
            this.adapter.deregisterWindowEventHandler(
              "orientationchange",
              this.windowOrientationChangeHandler
            );
        }),
        (e.prototype.open = function (t) {
          var e = this;
          (this.dialogOpen = !0),
            this.adapter.notifyOpening(),
            this.adapter.addClass(a.OPENING),
            this.isFullscreen &&
              this.adapter.registerContentEventHandler(
                "scroll",
                this.contentScrollHandler
              ),
            t &&
              t.isAboveFullscreenDialog &&
              this.adapter.addClass(a.SCRIM_HIDDEN),
            this.adapter.registerWindowEventHandler(
              "resize",
              this.windowResizeHandler
            ),
            this.adapter.registerWindowEventHandler(
              "orientationchange",
              this.windowOrientationChangeHandler
            ),
            this.runNextAnimationFrame(function () {
              e.adapter.addClass(a.OPEN),
                e.adapter.addBodyClass(a.SCROLL_LOCK),
                e.layout(),
                (e.animationTimer = setTimeout(function () {
                  e.handleAnimationTimerEnd(),
                    e.adapter.trapFocus(e.adapter.getInitialFocusEl()),
                    e.adapter.notifyOpened();
                }, r.DIALOG_ANIMATION_OPEN_TIME_MS));
            });
        }),
        (e.prototype.close = function (t) {
          var e = this;
          void 0 === t && (t = ""),
            this.dialogOpen &&
              ((this.dialogOpen = !1),
              this.adapter.notifyClosing(t),
              this.adapter.addClass(a.CLOSING),
              this.adapter.removeClass(a.OPEN),
              this.adapter.removeBodyClass(a.SCROLL_LOCK),
              this.isFullscreen &&
                this.adapter.deregisterContentEventHandler(
                  "scroll",
                  this.contentScrollHandler
                ),
              this.adapter.deregisterWindowEventHandler(
                "resize",
                this.windowResizeHandler
              ),
              this.adapter.deregisterWindowEventHandler(
                "orientationchange",
                this.windowOrientationChangeHandler
              ),
              cancelAnimationFrame(this.animationFrame),
              (this.animationFrame = 0),
              clearTimeout(this.animationTimer),
              (this.animationTimer = setTimeout(function () {
                e.adapter.releaseFocus(),
                  e.handleAnimationTimerEnd(),
                  e.adapter.notifyClosed(t);
              }, r.DIALOG_ANIMATION_CLOSE_TIME_MS)));
        }),
        (e.prototype.showSurfaceScrim = function () {
          var t = this;
          this.adapter.addClass(a.SURFACE_SCRIM_SHOWING),
            this.runNextAnimationFrame(function () {
              t.adapter.addClass(a.SURFACE_SCRIM_SHOWN);
            });
        }),
        (e.prototype.hideSurfaceScrim = function () {
          this.adapter.removeClass(a.SURFACE_SCRIM_SHOWN),
            this.adapter.addClass(a.SURFACE_SCRIM_HIDING);
        }),
        (e.prototype.handleSurfaceScrimTransitionEnd = function () {
          this.adapter.removeClass(a.SURFACE_SCRIM_HIDING),
            this.adapter.removeClass(a.SURFACE_SCRIM_SHOWING);
        }),
        (e.prototype.isOpen = function () {
          return this.dialogOpen;
        }),
        (e.prototype.getEscapeKeyAction = function () {
          return this.escapeKeyAction;
        }),
        (e.prototype.setEscapeKeyAction = function (t) {
          this.escapeKeyAction = t;
        }),
        (e.prototype.getScrimClickAction = function () {
          return this.scrimClickAction;
        }),
        (e.prototype.setScrimClickAction = function (t) {
          this.scrimClickAction = t;
        }),
        (e.prototype.getAutoStackButtons = function () {
          return this.autoStackButtons;
        }),
        (e.prototype.setAutoStackButtons = function (t) {
          this.autoStackButtons = t;
        }),
        (e.prototype.getSuppressDefaultPressSelector = function () {
          return this.suppressDefaultPressSelector;
        }),
        (e.prototype.setSuppressDefaultPressSelector = function (t) {
          this.suppressDefaultPressSelector = t;
        }),
        (e.prototype.layout = function () {
          var t = this;
          this.animFrame.request(o.POLL_LAYOUT_CHANGE, function () {
            t.layoutInternal();
          });
        }),
        (e.prototype.handleClick = function (t) {
          if (
            this.adapter.eventTargetMatches(t.target, d.SCRIM_SELECTOR) &&
            "" !== this.scrimClickAction
          )
            this.close(this.scrimClickAction);
          else {
            var e = this.adapter.getActionFromEvent(t);
            e && this.close(e);
          }
        }),
        (e.prototype.handleKeydown = function (t) {
          var e = "Enter" === t.key || 13 === t.keyCode;
          if (e && !this.adapter.getActionFromEvent(t)) {
            var i = t.composedPath ? t.composedPath()[0] : t.target,
              o =
                !this.suppressDefaultPressSelector ||
                !this.adapter.eventTargetMatches(
                  i,
                  this.suppressDefaultPressSelector
                );
            e && o && this.adapter.clickDefaultButton();
          }
        }),
        (e.prototype.handleDocumentKeydown = function (t) {
          ("Escape" === t.key || 27 === t.keyCode) &&
            "" !== this.escapeKeyAction &&
            this.close(this.escapeKeyAction);
        }),
        (e.prototype.handleScrollEvent = function () {
          var t = this;
          this.animFrame.request(o.POLL_SCROLL_POS, function () {
            t.toggleScrollDividerHeader(), t.toggleScrollDividerFooter();
          });
        }),
        (e.prototype.layoutInternal = function () {
          this.autoStackButtons && this.detectStackedButtons(),
            this.toggleScrollableClasses();
        }),
        (e.prototype.handleAnimationTimerEnd = function () {
          (this.animationTimer = 0),
            this.adapter.removeClass(a.OPENING),
            this.adapter.removeClass(a.CLOSING);
        }),
        (e.prototype.runNextAnimationFrame = function (t) {
          var e = this;
          cancelAnimationFrame(this.animationFrame),
            (this.animationFrame = requestAnimationFrame(function () {
              (e.animationFrame = 0),
                clearTimeout(e.animationTimer),
                (e.animationTimer = setTimeout(t, 0));
            }));
        }),
        (e.prototype.detectStackedButtons = function () {
          this.adapter.removeClass(a.STACKED);
          var t = this.adapter.areButtonsStacked();
          t && this.adapter.addClass(a.STACKED),
            t !== this.areButtonsStacked &&
              (this.adapter.reverseButtons(), (this.areButtonsStacked = t));
        }),
        (e.prototype.toggleScrollableClasses = function () {
          this.adapter.removeClass(a.SCROLLABLE),
            this.adapter.isContentScrollable() &&
              (this.adapter.addClass(a.SCROLLABLE),
              this.isFullscreen &&
                (this.toggleScrollDividerHeader(),
                this.toggleScrollDividerFooter()));
        }),
        (e.prototype.toggleScrollDividerHeader = function () {
          this.adapter.isScrollableContentAtTop()
            ? this.adapter.hasClass(a.SCROLL_DIVIDER_HEADER) &&
              this.adapter.removeClass(a.SCROLL_DIVIDER_HEADER)
            : this.adapter.addClass(a.SCROLL_DIVIDER_HEADER);
        }),
        (e.prototype.toggleScrollDividerFooter = function () {
          this.adapter.isScrollableContentAtBottom()
            ? this.adapter.hasClass(a.SCROLL_DIVIDER_FOOTER) &&
              this.adapter.removeClass(a.SCROLL_DIVIDER_FOOTER)
            : this.adapter.addClass(a.SCROLL_DIVIDER_FOOTER);
        }),
        e
      );
    })(c.K);
    function m(t) {
      return (
        void 0 === t && (t = window),
        !!(function (t) {
          void 0 === t && (t = window);
          var e = !1;
          try {
            var i = {
                get passive() {
                  return (e = !0), !1;
                },
              },
              o = function () {};
            t.document.addEventListener("test", o, i),
              t.document.removeEventListener("test", o, i);
          } catch (t) {
            e = !1;
          }
          return e;
        })(t) && { passive: !0 }
      );
    }
    var u = i(58014),
      h = i(78220),
      g = i(14114),
      p = i(5095),
      _ = i(95260),
      f = i(53180);
    const b = document.$blockingElements;
    class y extends h.H {
      constructor() {
        super(...arguments),
          (this.hideActions = !1),
          (this.stacked = !1),
          (this.heading = ""),
          (this.scrimClickAction = "close"),
          (this.escapeKeyAction = "close"),
          (this.open = !1),
          (this.defaultAction = "close"),
          (this.actionAttribute = "dialogAction"),
          (this.initialFocusAttribute = "dialogInitialFocus"),
          (this.initialSupressDefaultPressSelector = ""),
          (this.mdcFoundationClass = l),
          (this.boundHandleClick = null),
          (this.boundHandleKeydown = null),
          (this.boundHandleDocumentKeydown = null);
      }
      set suppressDefaultPressSelector(t) {
        this.mdcFoundation
          ? this.mdcFoundation.setSuppressDefaultPressSelector(t)
          : (this.initialSupressDefaultPressSelector = t);
      }
      get suppressDefaultPressSelector() {
        return this.mdcFoundation
          ? this.mdcFoundation.getSuppressDefaultPressSelector()
          : this.initialSupressDefaultPressSelector;
      }
      get primaryButton() {
        let t = this.primarySlot.assignedNodes();
        t = t.filter((t) => t instanceof HTMLElement);
        const e = t[0];
        return e || null;
      }
      emitNotification(t, e) {
        const i = new CustomEvent(t, { detail: e ? { action: e } : {} });
        this.dispatchEvent(i);
      }
      getInitialFocusEl() {
        const t = `[${this.initialFocusAttribute}]`,
          e = this.querySelector(t);
        if (e) return e;
        const i = this.primarySlot.assignedNodes({ flatten: !0 }),
          o = this.searchNodeTreesForAttribute(i, this.initialFocusAttribute);
        if (o) return o;
        const n = this.secondarySlot.assignedNodes({ flatten: !0 }),
          a = this.searchNodeTreesForAttribute(n, this.initialFocusAttribute);
        if (a) return a;
        const d = this.contentSlot.assignedNodes({ flatten: !0 });
        return this.searchNodeTreesForAttribute(d, this.initialFocusAttribute);
      }
      searchNodeTreesForAttribute(t, e) {
        for (const i of t)
          if (i instanceof HTMLElement) {
            if (i.hasAttribute(e)) return i;
            {
              const t = i.querySelector(`[${e}]`);
              if (t) return t;
            }
          }
        return null;
      }
      createAdapter() {
        return Object.assign(Object.assign({}, (0, h.q)(this.mdcRoot)), {
          addBodyClass: () => (document.body.style.overflow = "hidden"),
          removeBodyClass: () => (document.body.style.overflow = ""),
          areButtonsStacked: () => this.stacked,
          clickDefaultButton: () => {
            const t = this.primaryButton;
            t && t.click();
          },
          eventTargetMatches: (t, e) => !!t && (0, u.wB)(t, e),
          getActionFromEvent: (t) => {
            if (!t.target) return "";
            const e = (0, u.oq)(t.target, `[${this.actionAttribute}]`);
            return e && e.getAttribute(this.actionAttribute);
          },
          getInitialFocusEl: () => this.getInitialFocusEl(),
          isContentScrollable: () => {
            const t = this.contentElement;
            return !!t && t.scrollHeight > t.offsetHeight;
          },
          notifyClosed: (t) => this.emitNotification("closed", t),
          notifyClosing: (t) => {
            this.closingDueToDisconnect || (this.open = !1),
              this.emitNotification("closing", t);
          },
          notifyOpened: () => this.emitNotification("opened"),
          notifyOpening: () => {
            (this.open = !0), this.emitNotification("opening");
          },
          reverseButtons: () => {},
          releaseFocus: () => {
            b.remove(this);
          },
          trapFocus: (t) => {
            this.isConnected && (b.push(this), t && t.focus());
          },
          registerContentEventHandler: (t, e) => {
            this.contentElement.addEventListener(t, e);
          },
          deregisterContentEventHandler: (t, e) => {
            this.contentElement.removeEventListener(t, e);
          },
          isScrollableContentAtTop: () => {
            const t = this.contentElement;
            return !!t && 0 === t.scrollTop;
          },
          isScrollableContentAtBottom: () => {
            const t = this.contentElement;
            return (
              !!t && Math.ceil(t.scrollHeight - t.scrollTop) === t.clientHeight
            );
          },
          registerWindowEventHandler: (t, e) => {
            window.addEventListener(t, e, m());
          },
          deregisterWindowEventHandler: (t, e) => {
            window.removeEventListener(t, e, m());
          },
        });
      }
      render() {
        const t = { [a.STACKED]: this.stacked };
        let e = p.dy``;
        this.heading && (e = this.renderHeading());
        const i = { "mdc-dialog__actions": !this.hideActions };
        return p.dy` <div class="mdc-dialog ${(0, f.$)(
          t
        )}" role="alertdialog" aria-modal="true" aria-labelledby="title" aria-describedby="content"> <div class="mdc-dialog__container"> <div class="mdc-dialog__surface"> ${e} <div id="content" class="mdc-dialog__content"> <slot id="contentSlot"></slot> </div> <footer id="actions" class="${(0,
        f.$)(
          i
        )}"> <span> <slot name="secondaryAction"></slot> </span> <span> <slot name="primaryAction"></slot> </span> </footer> </div> </div> <div class="mdc-dialog__scrim"></div> </div>`;
      }
      renderHeading() {
        return p.dy` <h2 id="title" class="mdc-dialog__title">${this.heading}</h2>`;
      }
      firstUpdated() {
        super.firstUpdated(),
          this.mdcFoundation.setAutoStackButtons(!0),
          this.initialSupressDefaultPressSelector
            ? (this.suppressDefaultPressSelector =
                this.initialSupressDefaultPressSelector)
            : (this.suppressDefaultPressSelector = [
                this.suppressDefaultPressSelector,
                "mwc-textarea",
                "mwc-menu mwc-list-item",
                "mwc-select mwc-list-item",
              ].join(", ")),
          (this.boundHandleClick = this.mdcFoundation.handleClick.bind(
            this.mdcFoundation
          )),
          (this.boundHandleKeydown = this.mdcFoundation.handleKeydown.bind(
            this.mdcFoundation
          )),
          (this.boundHandleDocumentKeydown =
            this.mdcFoundation.handleDocumentKeydown.bind(this.mdcFoundation));
      }
      connectedCallback() {
        super.connectedCallback(),
          this.open &&
            this.mdcFoundation &&
            !this.mdcFoundation.isOpen() &&
            (this.setEventListeners(), this.mdcFoundation.open());
      }
      disconnectedCallback() {
        super.disconnectedCallback(),
          this.open &&
            this.mdcFoundation &&
            (this.removeEventListeners(),
            (this.closingDueToDisconnect = !0),
            this.mdcFoundation.close(this.currentAction || this.defaultAction),
            (this.closingDueToDisconnect = !1),
            (this.currentAction = void 0),
            b.remove(this));
      }
      forceLayout() {
        this.mdcFoundation.layout();
      }
      focus() {
        const t = this.getInitialFocusEl();
        t && t.focus();
      }
      blur() {
        if (!this.shadowRoot) return;
        const t = this.shadowRoot.activeElement;
        if (t) t instanceof HTMLElement && t.blur();
        else {
          const t = this.getRootNode(),
            e = t instanceof Document ? t.activeElement : null;
          e instanceof HTMLElement && e.blur();
        }
      }
      setEventListeners() {
        this.boundHandleClick &&
          this.mdcRoot.addEventListener("click", this.boundHandleClick),
          this.boundHandleKeydown &&
            this.mdcRoot.addEventListener(
              "keydown",
              this.boundHandleKeydown,
              m()
            ),
          this.boundHandleDocumentKeydown &&
            document.addEventListener(
              "keydown",
              this.boundHandleDocumentKeydown,
              m()
            );
      }
      removeEventListeners() {
        this.boundHandleClick &&
          this.mdcRoot.removeEventListener("click", this.boundHandleClick),
          this.boundHandleKeydown &&
            this.mdcRoot.removeEventListener(
              "keydown",
              this.boundHandleKeydown
            ),
          this.boundHandleDocumentKeydown &&
            document.removeEventListener(
              "keydown",
              this.boundHandleDocumentKeydown
            );
      }
      close() {
        this.open = !1;
      }
      show() {
        this.open = !0;
      }
    }
    (0, n.__decorate)(
      [(0, _.IO)(".mdc-dialog")],
      y.prototype,
      "mdcRoot",
      void 0
    ),
      (0, n.__decorate)(
        [(0, _.IO)('slot[name="primaryAction"]')],
        y.prototype,
        "primarySlot",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.IO)('slot[name="secondaryAction"]')],
        y.prototype,
        "secondarySlot",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.IO)("#contentSlot")],
        y.prototype,
        "contentSlot",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.IO)(".mdc-dialog__content")],
        y.prototype,
        "contentElement",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.IO)(".mdc-container")],
        y.prototype,
        "conatinerElement",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.Cb)({ type: Boolean })],
        y.prototype,
        "hideActions",
        void 0
      ),
      (0, n.__decorate)(
        [
          (0, _.Cb)({ type: Boolean }),
          (0, g.P)(function () {
            this.forceLayout();
          }),
        ],
        y.prototype,
        "stacked",
        void 0
      ),
      (0, n.__decorate)(
        [(0, _.Cb)({ type: String })],
        y.prototype,
        "heading",
        void 0
      ),
      (0, n.__decorate)(
        [
          (0, _.Cb)({ type: String }),
          (0, g.P)(function (t) {
            this.mdcFoundation.setScrimClickAction(t);
          }),
        ],
        y.prototype,
        "scrimClickAction",
        void 0
      ),
      (0, n.__decorate)(
        [
          (0, _.Cb)({ type: String }),
          (0, g.P)(function (t) {
            this.mdcFoundation.setEscapeKeyAction(t);
          }),
        ],
        y.prototype,
        "escapeKeyAction",
        void 0
      ),
      (0, n.__decorate)(
        [
          (0, _.Cb)({ type: Boolean, reflect: !0 }),
          (0, g.P)(function (t) {
            this.mdcFoundation &&
              this.isConnected &&
              (t
                ? (this.setEventListeners(), this.mdcFoundation.open())
                : (this.removeEventListeners(),
                  this.mdcFoundation.close(
                    this.currentAction || this.defaultAction
                  ),
                  (this.currentAction = void 0)));
          }),
        ],
        y.prototype,
        "open",
        void 0
      ),
      (0, n.__decorate)([(0, _.Cb)()], y.prototype, "defaultAction", void 0),
      (0, n.__decorate)([(0, _.Cb)()], y.prototype, "actionAttribute", void 0),
      (0, n.__decorate)(
        [(0, _.Cb)()],
        y.prototype,
        "initialFocusAttribute",
        void 0
      );
  },
  91632: (t, e, i) => {
    i.d(e, { W: () => o });
    const o = i(5095)
      .iv`.mdc-dialog .mdc-dialog__surface{background-color:#fff;background-color:var(--mdc-theme-surface,#fff)}.mdc-dialog .mdc-dialog__scrim{background-color:rgba(0,0,0,.32)}.mdc-dialog .mdc-dialog__surface-scrim{background-color:rgba(0,0,0,.32)}.mdc-dialog .mdc-dialog__title{color:rgba(0,0,0,.87)}.mdc-dialog .mdc-dialog__content{color:rgba(0,0,0,.6)}.mdc-dialog .mdc-dialog__close{color:#000;color:var(--mdc-theme-on-surface,#000)}.mdc-dialog .mdc-dialog__close .mdc-icon-button__ripple::after,.mdc-dialog .mdc-dialog__close .mdc-icon-button__ripple::before{background-color:#000;background-color:var(--mdc-ripple-color,var(--mdc-theme-on-surface,#000))}.mdc-dialog .mdc-dialog__close.mdc-ripple-surface--hover .mdc-icon-button__ripple::before,.mdc-dialog .mdc-dialog__close:hover .mdc-icon-button__ripple::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity, .04)}.mdc-dialog .mdc-dialog__close.mdc-ripple-upgraded--background-focused .mdc-icon-button__ripple::before,.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded):focus .mdc-icon-button__ripple::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity, .12)}.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded) .mdc-icon-button__ripple::after{transition:opacity 150ms linear}.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded):active .mdc-icon-button__ripple::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity, .12)}.mdc-dialog .mdc-dialog__close.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions,.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title,.mdc-dialog.mdc-dialog--scrollable.mdc-dialog-scroll-divider-footer .mdc-dialog__actions{border-color:rgba(0,0,0,.12)}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:1px solid rgba(0,0,0,.12);margin-bottom:0}.mdc-dialog.mdc-dialog-scroll-divider-header.mdc-dialog--fullscreen .mdc-dialog__header{box-shadow:0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12)}.mdc-dialog .mdc-dialog__surface{border-radius:4px;border-radius:var(--mdc-shape-medium,4px)}.mdc-dialog__surface{box-shadow:0px 11px 15px -7px rgba(0,0,0,.2),0px 24px 38px 3px rgba(0,0,0,.14),0px 9px 46px 8px rgba(0,0,0,.12)}.mdc-dialog__title{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-headline6-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1.25rem;font-size:var(--mdc-typography-headline6-font-size, 1.25rem);line-height:2rem;line-height:var(--mdc-typography-headline6-line-height, 2rem);font-weight:500;font-weight:var(--mdc-typography-headline6-font-weight,500);letter-spacing:.0125em;letter-spacing:var(--mdc-typography-headline6-letter-spacing, .0125em);text-decoration:inherit;text-decoration:var(--mdc-typography-headline6-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-headline6-text-transform,inherit)}.mdc-dialog__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-body1-font-size, 1rem);line-height:1.5rem;line-height:var(--mdc-typography-body1-line-height, 1.5rem);font-weight:400;font-weight:var(--mdc-typography-body1-font-weight,400);letter-spacing:.03125em;letter-spacing:var(--mdc-typography-body1-letter-spacing, .03125em);text-decoration:inherit;text-decoration:var(--mdc-typography-body1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body1-text-transform,inherit)}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(.4, 0, .2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color,#fff)}.mdc-dialog,.mdc-dialog__scrim{position:fixed;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%}.mdc-dialog{display:none;z-index:7;z-index:var(--mdc-dialog-z-index,7)}.mdc-dialog .mdc-dialog__content{padding:20px 24px 20px 24px}.mdc-dialog .mdc-dialog__surface{min-width:280px}@media(max-width:592px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}@media(min-width:592px){.mdc-dialog .mdc-dialog__surface{max-width:560px}}.mdc-dialog .mdc-dialog__surface{max-height:calc(100% - 32px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-width:none}@media(max-width:960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px;width:560px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width:720px)and (max-width:672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 112px)}}@media(max-width:720px)and (min-width:672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:560px}}@media(max-width:720px)and (max-height:720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:calc(100vh - 160px)}}@media(max-width:720px)and (min-height:720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px}}@media(max-width:720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media(max-width:720px)and (max-height:400px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media(max-width:600px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media(min-width:960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 400px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}.mdc-dialog.mdc-dialog__scrim--hidden .mdc-dialog__scrim{opacity:0}.mdc-dialog__scrim{opacity:0;z-index:-1}.mdc-dialog__container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;transform:scale(.8);opacity:0;pointer-events:none}.mdc-dialog__surface{position:relative;display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto}.mdc-dialog__surface .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-dialog__surface[dir=rtl],[dir=rtl] .mdc-dialog__surface{text-align:right}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-dialog__surface{outline:2px solid windowText}}.mdc-dialog__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid transparent;border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors:active){.mdc-dialog__surface::before{border-color:CanvasText}}@media screen and (-ms-high-contrast:active),screen and (-ms-high-contrast:none){.mdc-dialog__surface::before{content:none}}.mdc-dialog__title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:0 24px 9px}.mdc-dialog__title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-dialog__title[dir=rtl],[dir=rtl] .mdc-dialog__title{text-align:right}.mdc-dialog--scrollable .mdc-dialog__title{margin-bottom:1px;padding-bottom:15px}.mdc-dialog--fullscreen .mdc-dialog__header{align-items:baseline;border-bottom:1px solid transparent;display:inline-flex;justify-content:space-between;padding:0 24px 9px;z-index:1}@media screen and (forced-colors:active){.mdc-dialog--fullscreen .mdc-dialog__header{border-bottom-color:CanvasText}}.mdc-dialog--fullscreen .mdc-dialog__header .mdc-dialog__close{right:-12px}.mdc-dialog--fullscreen .mdc-dialog__title{margin-bottom:0;padding:0;border-bottom:0}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:0;margin-bottom:0}.mdc-dialog--fullscreen .mdc-dialog__close{top:5px}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top:1px solid transparent}@media screen and (forced-colors:active){.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog__content{flex-grow:1;box-sizing:border-box;margin:0;overflow:auto}.mdc-dialog__content>:first-child{margin-top:0}.mdc-dialog__content>:last-child{margin-bottom:0}.mdc-dialog__header+.mdc-dialog__content,.mdc-dialog__title+.mdc-dialog__content{padding-top:0}.mdc-dialog--scrollable .mdc-dialog__title+.mdc-dialog__content{padding-top:8px;padding-bottom:8px}.mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable .mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:0}.mdc-dialog__actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid transparent}@media screen and (forced-colors:active){.mdc-dialog__actions{border-top-color:CanvasText}}.mdc-dialog--stacked .mdc-dialog__actions{flex-direction:column;align-items:flex-end}.mdc-dialog__button{margin-left:8px;margin-right:0;max-width:100%;text-align:right}.mdc-dialog__button[dir=rtl],[dir=rtl] .mdc-dialog__button{margin-left:0;margin-right:8px}.mdc-dialog__button:first-child{margin-left:0;margin-right:0}.mdc-dialog__button:first-child[dir=rtl],[dir=rtl] .mdc-dialog__button:first-child{margin-left:0;margin-right:0}.mdc-dialog__button[dir=rtl],[dir=rtl] .mdc-dialog__button{text-align:left}.mdc-dialog--stacked .mdc-dialog__button:not(:first-child){margin-top:12px}.mdc-dialog--closing,.mdc-dialog--open,.mdc-dialog--opening{display:flex}.mdc-dialog--opening .mdc-dialog__scrim{transition:opacity 150ms linear}.mdc-dialog--opening .mdc-dialog__container{transition:opacity 75ms linear,transform 150ms 0s cubic-bezier(0, 0, .2, 1)}.mdc-dialog--closing .mdc-dialog__container,.mdc-dialog--closing .mdc-dialog__scrim{transition:opacity 75ms linear}.mdc-dialog--closing .mdc-dialog__container{transform:none}.mdc-dialog--open .mdc-dialog__scrim{opacity:1}.mdc-dialog--open .mdc-dialog__container{transform:none;opacity:1}.mdc-dialog--open.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim{opacity:1;z-index:1}.mdc-dialog--open.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{transition:opacity 75ms linear}.mdc-dialog--open.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim{transition:opacity 150ms linear}.mdc-dialog__surface-scrim{display:none;opacity:0;position:absolute;width:100%;height:100%}.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim{display:block}.mdc-dialog-scroll-lock{overflow:hidden}.mdc-dialog--no-content-padding .mdc-dialog__content{padding:0}.mdc-dialog--sheet .mdc-dialog__close{right:12px;top:9px;position:absolute;z-index:1}#actions:not(.mdc-dialog__actions){display:none}.mdc-dialog__surface{box-shadow:var(--mdc-dialog-box-shadow,0px 11px 15px -7px rgba(0,0,0,.2),0px 24px 38px 3px rgba(0,0,0,.14),0px 9px 46px 8px rgba(0,0,0,.12))}@media(min-width:560px){.mdc-dialog .mdc-dialog__surface{max-width:560px;max-width:var(--mdc-dialog-max-width,560px)}}.mdc-dialog .mdc-dialog__scrim{background-color:rgba(0,0,0,.32);background-color:var(--mdc-dialog-scrim-color,rgba(0,0,0,.32))}.mdc-dialog .mdc-dialog__title{color:rgba(0,0,0,.87);color:var(--mdc-dialog-heading-ink-color,rgba(0,0,0,.87))}.mdc-dialog .mdc-dialog__content{color:rgba(0,0,0,.6);color:var(--mdc-dialog-content-ink-color,rgba(0,0,0,.6))}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions,.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title{border-color:rgba(0,0,0,.12);border-color:var(--mdc-dialog-scroll-divider-color,rgba(0,0,0,.12))}.mdc-dialog .mdc-dialog__surface{min-width:280px;min-width:var(--mdc-dialog-min-width,280px)}.mdc-dialog .mdc-dialog__surface{max-height:var(--mdc-dialog-max-height,calc(100% - 32px))}#actions ::slotted(*){margin-left:8px;margin-right:0;max-width:100%;text-align:right}#actions ::slotted([dir=rtl]),[dir=rtl] #actions ::slotted(*){margin-left:0;margin-right:8px}#actions ::slotted([dir=rtl]),[dir=rtl] #actions ::slotted(*){text-align:left}.mdc-dialog--stacked #actions{flex-direction:column-reverse}.mdc-dialog--stacked #actions :not(:last-child) ::slotted(*){flex-basis:.000000001px;margin-top:12px}`;
  },
  16638: () => {
    (() => {
      var t, e, i;
      const o = Symbol(),
        n = Symbol(),
        a = Symbol(),
        d = Symbol(),
        r = Symbol(),
        s = Symbol(),
        c = Symbol(),
        l = Symbol(),
        m = Symbol(),
        u = Symbol(),
        h = Symbol(),
        g = Symbol(),
        p = Symbol();
      class _ {
        constructor() {
          (this[t] = []), (this[e] = []), (this[i] = new Set());
        }
        destructor() {
          this[m](this[a]);
          const t = this;
          (t[o] = null), (t[a] = null), (t[n] = null);
        }
        get top() {
          const t = this[o];
          return t[t.length - 1] || null;
        }
        push(t) {
          t && t !== this.top && (this.remove(t), this[s](t), this[o].push(t));
        }
        remove(t) {
          const e = this[o].indexOf(t);
          return (
            -1 !== e &&
            (this[o].splice(e, 1),
            e === this[o].length && this[s](this.top),
            !0)
          );
        }
        pop() {
          const t = this.top;
          return t && this.remove(t), t;
        }
        has(t) {
          return -1 !== this[o].indexOf(t);
        }
        [((t = o), (e = a), (i = n), s)](t) {
          const e = this[n],
            i = this[a];
          if (!t) return this[m](i), e.clear(), void (this[a] = []);
          const o = this[u](t);
          if (o[o.length - 1].parentNode !== document.body)
            throw Error("Non-connected element cannot be a blocking element");
          this[a] = o;
          const d = this[h](t);
          if (!i.length) return void this[l](o, d, e);
          let r = i.length - 1,
            s = o.length - 1;
          for (; r > 0 && s > 0 && i[r] === o[s]; ) r--, s--;
          i[r] !== o[s] && this[c](i[r], o[s]),
            r > 0 && this[m](i.slice(0, r)),
            s > 0 && this[l](o.slice(0, s), d, null);
        }
        [c](t, e) {
          const i = t[d];
          this[g](t) && !t.inert && ((t.inert = !0), i.add(t)),
            i.has(e) && ((e.inert = !1), i.delete(e)),
            (e[r] = t[r]),
            (e[d] = i),
            (t[r] = void 0),
            (t[d] = void 0);
        }
        [m](t) {
          for (const e of t) {
            e[r].disconnect(), (e[r] = void 0);
            const t = e[d];
            for (const e of t) e.inert = !1;
            e[d] = void 0;
          }
        }
        [l](t, e, i) {
          for (const o of t) {
            const t = o.parentNode,
              n = t.children,
              a = new Set();
            for (let t = 0; t < n.length; t++) {
              const d = n[t];
              d === o ||
                !this[g](d) ||
                (e && e.has(d)) ||
                (i && d.inert ? i.add(d) : ((d.inert = !0), a.add(d)));
            }
            o[d] = a;
            const s = new MutationObserver(this[p].bind(this));
            o[r] = s;
            let c = t;
            const l = c;
            l.__shady && l.host && (c = l.host),
              s.observe(c, { childList: !0 });
          }
        }
        [p](t) {
          const e = this[a],
            i = this[n];
          for (const o of t) {
            const t = o.target.host || o.target,
              n = t === document.body ? e.length : e.indexOf(t),
              a = e[n - 1],
              r = a[d];
            for (let t = 0; t < o.removedNodes.length; t++) {
              const e = o.removedNodes[t];
              if (e === a)
                return (
                  console.info("Detected removal of the top Blocking Element."),
                  void this.pop()
                );
              r.has(e) && ((e.inert = !1), r.delete(e));
            }
            for (let t = 0; t < o.addedNodes.length; t++) {
              const e = o.addedNodes[t];
              this[g](e) &&
                (i && e.inert ? i.add(e) : ((e.inert = !0), r.add(e)));
            }
          }
        }
        [g](t) {
          return !1 === /^(style|template|script)$/.test(t.localName);
        }
        [u](t) {
          const e = [];
          let i = t;
          for (; i && i !== document.body; )
            if (
              (i.nodeType === Node.ELEMENT_NODE && e.push(i), i.assignedSlot)
            ) {
              for (; (i = i.assignedSlot); ) e.push(i);
              i = e.pop();
            } else i = i.parentNode || i.host;
          return e;
        }
        [h](t) {
          const e = t.shadowRoot;
          if (!e) return null;
          const i = new Set();
          let o, n, a;
          const d = e.querySelectorAll("slot");
          if (d.length && d[0].assignedNodes)
            for (o = 0; o < d.length; o++)
              for (
                a = d[o].assignedNodes({ flatten: !0 }), n = 0;
                n < a.length;
                n++
              )
                a[n].nodeType === Node.ELEMENT_NODE && i.add(a[n]);
          return i;
        }
      }
      document.$blockingElements = new _();
    })();
  },
  92187: () => {
    var t = (function () {
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var o = e[i];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            "value" in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      return function (e, i, o) {
        return i && t(e.prototype, i), o && t(e, o), e;
      };
    })();
    function e(t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    }
    !(function () {
      if ("undefined" != typeof window) {
        var i = Array.prototype.slice,
          o = Element.prototype.matches || Element.prototype.msMatchesSelector,
          n = [
            "a[href]",
            "area[href]",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "button:not([disabled])",
            "details",
            "summary",
            "iframe",
            "object",
            "embed",
            "[contenteditable]",
          ].join(","),
          a = (function () {
            function a(t, i) {
              e(this, a),
                (this._inertManager = i),
                (this._rootElement = t),
                (this._managedNodes = new Set()),
                this._rootElement.hasAttribute("aria-hidden")
                  ? (this._savedAriaHidden =
                      this._rootElement.getAttribute("aria-hidden"))
                  : (this._savedAriaHidden = null),
                this._rootElement.setAttribute("aria-hidden", "true"),
                this._makeSubtreeUnfocusable(this._rootElement),
                (this._observer = new MutationObserver(
                  this._onMutation.bind(this)
                )),
                this._observer.observe(this._rootElement, {
                  attributes: !0,
                  childList: !0,
                  subtree: !0,
                });
            }
            return (
              t(a, [
                {
                  key: "destructor",
                  value: function () {
                    this._observer.disconnect(),
                      this._rootElement &&
                        (null !== this._savedAriaHidden
                          ? this._rootElement.setAttribute(
                              "aria-hidden",
                              this._savedAriaHidden
                            )
                          : this._rootElement.removeAttribute("aria-hidden")),
                      this._managedNodes.forEach(function (t) {
                        this._unmanageNode(t.node);
                      }, this),
                      (this._observer = null),
                      (this._rootElement = null),
                      (this._managedNodes = null),
                      (this._inertManager = null);
                  },
                },
                {
                  key: "_makeSubtreeUnfocusable",
                  value: function (t) {
                    var e = this;
                    c(t, function (t) {
                      return e._visitNode(t);
                    });
                    var i = document.activeElement;
                    if (!document.body.contains(t)) {
                      for (var o = t, n = void 0; o; ) {
                        if (o.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                          n = o;
                          break;
                        }
                        o = o.parentNode;
                      }
                      n && (i = n.activeElement);
                    }
                    t.contains(i) &&
                      (i.blur(),
                      i === document.activeElement && document.body.focus());
                  },
                },
                {
                  key: "_visitNode",
                  value: function (t) {
                    if (t.nodeType === Node.ELEMENT_NODE) {
                      var e = t;
                      e !== this._rootElement &&
                        e.hasAttribute("inert") &&
                        this._adoptInertRoot(e),
                        (o.call(e, n) || e.hasAttribute("tabindex")) &&
                          this._manageNode(e);
                    }
                  },
                },
                {
                  key: "_manageNode",
                  value: function (t) {
                    var e = this._inertManager.register(t, this);
                    this._managedNodes.add(e);
                  },
                },
                {
                  key: "_unmanageNode",
                  value: function (t) {
                    var e = this._inertManager.deregister(t, this);
                    e && this._managedNodes.delete(e);
                  },
                },
                {
                  key: "_unmanageSubtree",
                  value: function (t) {
                    var e = this;
                    c(t, function (t) {
                      return e._unmanageNode(t);
                    });
                  },
                },
                {
                  key: "_adoptInertRoot",
                  value: function (t) {
                    var e = this._inertManager.getInertRoot(t);
                    e ||
                      (this._inertManager.setInert(t, !0),
                      (e = this._inertManager.getInertRoot(t))),
                      e.managedNodes.forEach(function (t) {
                        this._manageNode(t.node);
                      }, this);
                  },
                },
                {
                  key: "_onMutation",
                  value: function (t, e) {
                    t.forEach(function (t) {
                      var e = t.target;
                      if ("childList" === t.type)
                        i.call(t.addedNodes).forEach(function (t) {
                          this._makeSubtreeUnfocusable(t);
                        }, this),
                          i.call(t.removedNodes).forEach(function (t) {
                            this._unmanageSubtree(t);
                          }, this);
                      else if ("attributes" === t.type)
                        if ("tabindex" === t.attributeName) this._manageNode(e);
                        else if (
                          e !== this._rootElement &&
                          "inert" === t.attributeName &&
                          e.hasAttribute("inert")
                        ) {
                          this._adoptInertRoot(e);
                          var o = this._inertManager.getInertRoot(e);
                          this._managedNodes.forEach(function (t) {
                            e.contains(t.node) && o._manageNode(t.node);
                          });
                        }
                    }, this);
                  },
                },
                {
                  key: "managedNodes",
                  get: function () {
                    return new Set(this._managedNodes);
                  },
                },
                {
                  key: "hasSavedAriaHidden",
                  get: function () {
                    return null !== this._savedAriaHidden;
                  },
                },
                {
                  key: "savedAriaHidden",
                  set: function (t) {
                    this._savedAriaHidden = t;
                  },
                  get: function () {
                    return this._savedAriaHidden;
                  },
                },
              ]),
              a
            );
          })(),
          d = (function () {
            function i(t, o) {
              e(this, i),
                (this._node = t),
                (this._overrodeFocusMethod = !1),
                (this._inertRoots = new Set([o])),
                (this._savedTabIndex = null),
                (this._destroyed = !1),
                this.ensureUntabbable();
            }
            return (
              t(i, [
                {
                  key: "destructor",
                  value: function () {
                    if (
                      (this._throwIfDestroyed(),
                      this._node && this._node.nodeType === Node.ELEMENT_NODE)
                    ) {
                      var t = this._node;
                      null !== this._savedTabIndex
                        ? t.setAttribute("tabindex", this._savedTabIndex)
                        : t.removeAttribute("tabindex"),
                        this._overrodeFocusMethod && delete t.focus;
                    }
                    (this._node = null),
                      (this._inertRoots = null),
                      (this._destroyed = !0);
                  },
                },
                {
                  key: "_throwIfDestroyed",
                  value: function () {
                    if (this.destroyed)
                      throw new Error("Trying to access destroyed InertNode");
                  },
                },
                {
                  key: "ensureUntabbable",
                  value: function () {
                    if (this.node.nodeType === Node.ELEMENT_NODE) {
                      var t = this.node;
                      if (o.call(t, n)) {
                        if (-1 === t.tabIndex && this.hasSavedTabIndex) return;
                        t.hasAttribute("tabindex") &&
                          (this._savedTabIndex = t.tabIndex),
                          t.setAttribute("tabindex", "-1"),
                          t.nodeType === Node.ELEMENT_NODE &&
                            ((t.focus = function () {}),
                            (this._overrodeFocusMethod = !0));
                      } else
                        t.hasAttribute("tabindex") &&
                          ((this._savedTabIndex = t.tabIndex),
                          t.removeAttribute("tabindex"));
                    }
                  },
                },
                {
                  key: "addInertRoot",
                  value: function (t) {
                    this._throwIfDestroyed(), this._inertRoots.add(t);
                  },
                },
                {
                  key: "removeInertRoot",
                  value: function (t) {
                    this._throwIfDestroyed(),
                      this._inertRoots.delete(t),
                      0 === this._inertRoots.size && this.destructor();
                  },
                },
                {
                  key: "destroyed",
                  get: function () {
                    return this._destroyed;
                  },
                },
                {
                  key: "hasSavedTabIndex",
                  get: function () {
                    return null !== this._savedTabIndex;
                  },
                },
                {
                  key: "node",
                  get: function () {
                    return this._throwIfDestroyed(), this._node;
                  },
                },
                {
                  key: "savedTabIndex",
                  set: function (t) {
                    this._throwIfDestroyed(), (this._savedTabIndex = t);
                  },
                  get: function () {
                    return this._throwIfDestroyed(), this._savedTabIndex;
                  },
                },
              ]),
              i
            );
          })(),
          r = (function () {
            function n(t) {
              if ((e(this, n), !t))
                throw new Error(
                  "Missing required argument; InertManager needs to wrap a document."
                );
              (this._document = t),
                (this._managedNodes = new Map()),
                (this._inertRoots = new Map()),
                (this._observer = new MutationObserver(
                  this._watchForInert.bind(this)
                )),
                l(t.head || t.body || t.documentElement),
                "loading" === t.readyState
                  ? t.addEventListener(
                      "DOMContentLoaded",
                      this._onDocumentLoaded.bind(this)
                    )
                  : this._onDocumentLoaded();
            }
            return (
              t(n, [
                {
                  key: "setInert",
                  value: function (t, e) {
                    if (e) {
                      if (this._inertRoots.has(t)) return;
                      var i = new a(t, this);
                      if (
                        (t.setAttribute("inert", ""),
                        this._inertRoots.set(t, i),
                        !this._document.body.contains(t))
                      )
                        for (var o = t.parentNode; o; )
                          11 === o.nodeType && l(o), (o = o.parentNode);
                    } else {
                      if (!this._inertRoots.has(t)) return;
                      this._inertRoots.get(t).destructor(),
                        this._inertRoots.delete(t),
                        t.removeAttribute("inert");
                    }
                  },
                },
                {
                  key: "getInertRoot",
                  value: function (t) {
                    return this._inertRoots.get(t);
                  },
                },
                {
                  key: "register",
                  value: function (t, e) {
                    var i = this._managedNodes.get(t);
                    return (
                      void 0 !== i ? i.addInertRoot(e) : (i = new d(t, e)),
                      this._managedNodes.set(t, i),
                      i
                    );
                  },
                },
                {
                  key: "deregister",
                  value: function (t, e) {
                    var i = this._managedNodes.get(t);
                    return i
                      ? (i.removeInertRoot(e),
                        i.destroyed && this._managedNodes.delete(t),
                        i)
                      : null;
                  },
                },
                {
                  key: "_onDocumentLoaded",
                  value: function () {
                    i
                      .call(this._document.querySelectorAll("[inert]"))
                      .forEach(function (t) {
                        this.setInert(t, !0);
                      }, this),
                      this._observer.observe(
                        this._document.body || this._document.documentElement,
                        { attributes: !0, subtree: !0, childList: !0 }
                      );
                  },
                },
                {
                  key: "_watchForInert",
                  value: function (t, e) {
                    var n = this;
                    t.forEach(function (t) {
                      switch (t.type) {
                        case "childList":
                          i.call(t.addedNodes).forEach(function (t) {
                            if (t.nodeType === Node.ELEMENT_NODE) {
                              var e = i.call(t.querySelectorAll("[inert]"));
                              o.call(t, "[inert]") && e.unshift(t),
                                e.forEach(function (t) {
                                  this.setInert(t, !0);
                                }, n);
                            }
                          }, n);
                          break;
                        case "attributes":
                          if ("inert" !== t.attributeName) return;
                          var e = t.target,
                            a = e.hasAttribute("inert");
                          n.setInert(e, a);
                      }
                    }, this);
                  },
                },
              ]),
              n
            );
          })();
        if (!HTMLElement.prototype.hasOwnProperty("inert")) {
          var s = new r(document);
          Object.defineProperty(HTMLElement.prototype, "inert", {
            enumerable: !0,
            get: function () {
              return this.hasAttribute("inert");
            },
            set: function (t) {
              s.setInert(this, t);
            },
          });
        }
      }
      function c(t, e, i) {
        if (t.nodeType == Node.ELEMENT_NODE) {
          var o = t;
          e && e(o);
          var n = o.shadowRoot;
          if (n) return void c(n, e, n);
          if ("content" == o.localName) {
            for (
              var a = o,
                d = a.getDistributedNodes ? a.getDistributedNodes() : [],
                r = 0;
              r < d.length;
              r++
            )
              c(d[r], e, i);
            return;
          }
          if ("slot" == o.localName) {
            for (
              var s = o,
                l = s.assignedNodes ? s.assignedNodes({ flatten: !0 }) : [],
                m = 0;
              m < l.length;
              m++
            )
              c(l[m], e, i);
            return;
          }
        }
        for (var u = t.firstChild; null != u; ) c(u, e, i), (u = u.nextSibling);
      }
      function l(t) {
        if (!t.querySelector("style#inert-style, link#inert-style")) {
          var e = document.createElement("style");
          e.setAttribute("id", "inert-style"),
            (e.textContent =
              "\n[inert] {\n  pointer-events: none;\n  cursor: default;\n}\n\n[inert], [inert] * {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n"),
            t.appendChild(e);
        }
      }
    })();
  },
};
//# sourceMappingURL=8597.xDuErO-I45I.js.map
