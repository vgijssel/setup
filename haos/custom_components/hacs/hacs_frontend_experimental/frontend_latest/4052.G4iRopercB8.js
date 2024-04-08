/*! For license information please see 4052.G4iRopercB8.js.LICENSE.txt */
export const id = 4052;
export const ids = [4052, 4271];
export const modules = {
  85763: (t, e, o) => {
    o.d(e, { Q2: () => i, ou: () => n });
    var r = o(67684);
    const i = () => {
        const t = {},
          e = new URLSearchParams(r.E.location.search);
        for (const [o, r] of e.entries()) t[o] = r;
        return t;
      },
      n = (t) => {
        const e = new URLSearchParams();
        return (
          Object.entries(t).forEach(([t, o]) => {
            e.append(t, o);
          }),
          e.toString()
        );
      };
  },
  14271: (t, e, o) => {
    o.d(e, { z: () => b });
    var r = o(43204),
      i = o(95260),
      n = (o(75642), o(27763), o(38103)),
      d = o(98734),
      a = o(5095),
      p = o(53180),
      c = o(10694);
    class l extends a.oi {
      constructor() {
        super(...arguments),
          (this.raised = !1),
          (this.unelevated = !1),
          (this.outlined = !1),
          (this.dense = !1),
          (this.disabled = !1),
          (this.trailingIcon = !1),
          (this.fullwidth = !1),
          (this.icon = ""),
          (this.label = ""),
          (this.expandContent = !1),
          (this.shouldRenderRipple = !1),
          (this.rippleHandlers = new d.A(
            () => ((this.shouldRenderRipple = !0), this.ripple)
          ));
      }
      renderOverlay() {
        return a.dy``;
      }
      renderRipple() {
        const t = this.raised || this.unelevated;
        return this.shouldRenderRipple
          ? a.dy`<mwc-ripple class="ripple" .primary="${!t}" .disabled="${
              this.disabled
            }"></mwc-ripple>`
          : "";
      }
      focus() {
        const t = this.buttonElement;
        t && (this.rippleHandlers.startFocus(), t.focus());
      }
      blur() {
        const t = this.buttonElement;
        t && (this.rippleHandlers.endFocus(), t.blur());
      }
      getRenderClasses() {
        return {
          "mdc-button--raised": this.raised,
          "mdc-button--unelevated": this.unelevated,
          "mdc-button--outlined": this.outlined,
          "mdc-button--dense": this.dense,
        };
      }
      render() {
        return a.dy` <button id="button" class="mdc-button ${(0, p.$)(
          this.getRenderClasses()
        )}" ?disabled="${this.disabled}" aria-label="${
          this.label || this.icon
        }" aria-haspopup="${(0, c.o)(this.ariaHasPopup)}" @focus="${
          this.handleRippleFocus
        }" @blur="${this.handleRippleBlur}" @mousedown="${
          this.handleRippleActivate
        }" @mouseenter="${this.handleRippleMouseEnter}" @mouseleave="${
          this.handleRippleMouseLeave
        }" @touchstart="${this.handleRippleActivate}" @touchend="${
          this.handleRippleDeactivate
        }" @touchcancel="${
          this.handleRippleDeactivate
        }"> ${this.renderOverlay()} ${this.renderRipple()} <span class="leading-icon"> <slot name="icon"> ${
          this.icon && !this.trailingIcon ? this.renderIcon() : ""
        } </slot> </span> <span class="mdc-button__label">${
          this.label
        }</span> <span class="slot-container ${(0, p.$)({
          flex: this.expandContent,
        })}"> <slot></slot> </span> <span class="trailing-icon"> <slot name="trailingIcon"> ${
          this.icon && this.trailingIcon ? this.renderIcon() : ""
        } </slot> </span> </button>`;
      }
      renderIcon() {
        return a.dy` <mwc-icon class="mdc-button__icon"> ${this.icon} </mwc-icon>`;
      }
      handleRippleActivate(t) {
        const e = () => {
          window.removeEventListener("mouseup", e),
            this.handleRippleDeactivate();
        };
        window.addEventListener("mouseup", e),
          this.rippleHandlers.startPress(t);
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
    }
    (l.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
      (0, r.__decorate)(
        [n.L, (0, i.Cb)({ type: String, attribute: "aria-haspopup" })],
        l.prototype,
        "ariaHasPopup",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        l.prototype,
        "raised",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        l.prototype,
        "unelevated",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        l.prototype,
        "outlined",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean })],
        l.prototype,
        "dense",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        l.prototype,
        "disabled",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, attribute: "trailingicon" })],
        l.prototype,
        "trailingIcon",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean, reflect: !0 })],
        l.prototype,
        "fullwidth",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: String })],
        l.prototype,
        "icon",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: String })],
        l.prototype,
        "label",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.Cb)({ type: Boolean })],
        l.prototype,
        "expandContent",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.IO)("#button")],
        l.prototype,
        "buttonElement",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.GC)("mwc-ripple")],
        l.prototype,
        "ripple",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.SB)()],
        l.prototype,
        "shouldRenderRipple",
        void 0
      ),
      (0, r.__decorate)(
        [(0, i.hO)({ passive: !0 })],
        l.prototype,
        "handleRippleActivate",
        null
      );
    var s = o(3712);
    let b = class extends l {};
    (b.styles = [s.W]), (b = (0, r.__decorate)([(0, i.Mo)("mwc-button")], b));
  },
  3712: (t, e, o) => {
    o.d(e, { W: () => r });
    const r = o(5095)
      .iv`.mdc-button{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:.875rem;font-size:var(--mdc-typography-button-font-size, .875rem);line-height:2.25rem;line-height:var(--mdc-typography-button-line-height, 2.25rem);font-weight:500;font-weight:var(--mdc-typography-button-font-weight,500);letter-spacing:.0892857143em;letter-spacing:var(--mdc-typography-button-letter-spacing, .0892857143em);text-decoration:none;text-decoration:var(--mdc-typography-button-text-decoration,none);text-transform:uppercase;text-transform:var(--mdc-typography-button-text-transform,uppercase)}.mdc-touch-target-wrapper{display:inline}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(.4, 0, .2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color,#fff)}.mdc-button{position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:0;line-height:inherit;user-select:none;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:0 0}.mdc-button .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:0}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top}.mdc-button .mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button .mdc-button__icon{margin-left:8px;margin-right:0}.mdc-button .mdc-button__label{position:relative}.mdc-button .mdc-button__focus-ring{display:none}@media screen and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px);display:block}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring{border-color:CanvasText}}@media screen and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring::after,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px)}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring::after,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring::after{border-color:CanvasText}}.mdc-button .mdc-button__touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-button__label+.mdc-button__icon{margin-left:8px;margin-right:0}.mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button__label+.mdc-button__icon{margin-left:0;margin-right:8px}svg.mdc-button__icon{fill:currentColor}.mdc-button--touch{margin-top:6px;margin-bottom:6px}.mdc-button{padding:0 8px 0 8px}.mdc-button--unelevated{transition:box-shadow 280ms cubic-bezier(.4, 0, .2, 1);padding:0 16px 0 16px}.mdc-button--unelevated.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--unelevated.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--raised{transition:box-shadow 280ms cubic-bezier(.4, 0, .2, 1);padding:0 16px 0 16px}.mdc-button--raised.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--raised.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--outlined{border-style:solid;transition:border 280ms cubic-bezier(.4, 0, .2, 1)}.mdc-button--outlined .mdc-button__ripple{border-style:solid;border-color:transparent}.mdc-button{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}.mdc-button:disabled{color:rgba(0,0,0,.38)}.mdc-button .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--raised,.mdc-button--unelevated{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(0,0,0,.12)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){color:#fff;color:var(--mdc-theme-on-primary,#fff)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{color:rgba(0,0,0,.38)}.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--raised .mdc-button__ripple,.mdc-button--unelevated .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--outlined{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px);padding:0 15px 0 15px;border-width:1px}.mdc-button--outlined:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}.mdc-button--outlined:disabled{color:rgba(0,0,0,.38)}.mdc-button--outlined .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--outlined .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--outlined:not(:disabled){border-color:rgba(0,0,0,.12)}.mdc-button--outlined:disabled{border-color:rgba(0,0,0,.12)}.mdc-button--outlined.mdc-button--icon-trailing{padding:0 11px 0 15px}.mdc-button--outlined.mdc-button--icon-leading{padding:0 15px 0 11px}.mdc-button--outlined .mdc-button__ripple{top:-1px;left:-1px;bottom:-1px;right:-1px;border-width:1px}.mdc-button--outlined .mdc-button__touch{left:calc(-1 * 1px);width:calc(100% + 2 * 1px)}.mdc-button--raised{box-shadow:0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4, 0, .2, 1)}.mdc-button--raised:focus,.mdc-button--raised:hover{box-shadow:0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12)}.mdc-button--raised:active{box-shadow:0px 5px 5px -3px rgba(0,0,0,.2),0px 8px 10px 1px rgba(0,0,0,.14),0px 3px 14px 2px rgba(0,0,0,.12)}.mdc-button--raised:disabled{box-shadow:0px 0px 0px 0px rgba(0,0,0,.2),0px 0px 0px 0px rgba(0,0,0,.14),0px 0px 0px 0px rgba(0,0,0,.12)}:host{display:inline-flex;outline:0;-webkit-tap-highlight-color:transparent;vertical-align:top}:host([fullwidth]){width:100%}:host([raised]),:host([unelevated]){--mdc-ripple-color:#fff;--mdc-ripple-focus-opacity:0.24;--mdc-ripple-hover-opacity:0.08;--mdc-ripple-press-opacity:0.24}.leading-icon .mdc-button__icon,.leading-icon ::slotted(*),.trailing-icon .mdc-button__icon,.trailing-icon ::slotted(*){margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}.leading-icon .mdc-button__icon[dir=rtl],.leading-icon ::slotted([dir=rtl]),.trailing-icon .mdc-button__icon[dir=rtl],.trailing-icon ::slotted([dir=rtl]),[dir=rtl] .leading-icon .mdc-button__icon,[dir=rtl] .leading-icon ::slotted(*),[dir=rtl] .trailing-icon .mdc-button__icon,[dir=rtl] .trailing-icon ::slotted(*){margin-left:8px;margin-right:0}.trailing-icon .mdc-button__icon,.trailing-icon ::slotted(*){margin-left:8px;margin-right:0}.trailing-icon .mdc-button__icon[dir=rtl],.trailing-icon ::slotted([dir=rtl]),[dir=rtl] .trailing-icon .mdc-button__icon,[dir=rtl] .trailing-icon ::slotted(*){margin-left:0;margin-right:8px}.slot-container{display:inline-flex;align-items:center;justify-content:center}.slot-container.flex{flex:auto}.mdc-button{flex:auto;overflow:hidden;padding-left:8px;padding-left:var(--mdc-button-horizontal-padding,8px);padding-right:8px;padding-right:var(--mdc-button-horizontal-padding,8px)}.mdc-button--raised{box-shadow:0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow,0px 3px 1px -2px rgba(0,0,0,.2),0px 2px 2px 0px rgba(0,0,0,.14),0px 1px 5px 0px rgba(0,0,0,.12))}.mdc-button--raised:focus{box-shadow:0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-focus,var(--mdc-button-raised-box-shadow-hover,0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12)))}.mdc-button--raised:hover{box-shadow:0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-hover,0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12))}.mdc-button--raised:active{box-shadow:0px 5px 5px -3px rgba(0,0,0,.2),0px 8px 10px 1px rgba(0,0,0,.14),0px 3px 14px 2px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-active,0px 5px 5px -3px rgba(0,0,0,.2),0px 8px 10px 1px rgba(0,0,0,.14),0px 3px 14px 2px rgba(0,0,0,.12))}.mdc-button--raised:disabled{box-shadow:0px 0px 0px 0px rgba(0,0,0,.2),0px 0px 0px 0px rgba(0,0,0,.14),0px 0px 0px 0px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-disabled,0px 0px 0px 0px rgba(0,0,0,.2),0px 0px 0px 0px rgba(0,0,0,.14),0px 0px 0px 0px rgba(0,0,0,.12))}.mdc-button--raised,.mdc-button--unelevated{padding-left:16px;padding-left:var(--mdc-button-horizontal-padding,16px);padding-right:16px;padding-right:var(--mdc-button-horizontal-padding,16px)}.mdc-button--outlined{border-width:1px;border-width:var(--mdc-button-outline-width,1px);padding-left:calc(16px - 1px);padding-left:calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px));padding-right:calc(16px - 1px);padding-right:calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px))}.mdc-button--outlined:not(:disabled){border-color:rgba(0,0,0,.12);border-color:var(--mdc-button-outline-color,rgba(0,0,0,.12))}.mdc-button--outlined .ripple{top:calc(-1 * 1px);top:calc(-1 * var(--mdc-button-outline-width,1px));left:calc(-1 * 1px);left:calc(-1 * var(--mdc-button-outline-width,1px));right:initial;right:initial;border-width:1px;border-width:var(--mdc-button-outline-width,1px);border-style:solid;border-color:transparent}.mdc-button--outlined .ripple[dir=rtl],[dir=rtl] .mdc-button--outlined .ripple{left:initial;left:initial;right:calc(-1 * 1px);right:calc(-1 * var(--mdc-button-outline-width,1px))}.mdc-button--dense{height:28px;margin-top:0;margin-bottom:0}.mdc-button--dense .mdc-button__touch{height:100%}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-button{color:rgba(0,0,0,.38);color:var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-button--raised,:host([disabled]) .mdc-button--unelevated{background-color:rgba(0,0,0,.12);background-color:var(--mdc-button-disabled-fill-color,rgba(0,0,0,.12))}:host([disabled]) .mdc-button--outlined{border-color:rgba(0,0,0,.12);border-color:var(--mdc-button-disabled-outline-color,rgba(0,0,0,.12))}`;
  },
  75642: (t, e, o) => {
    var r = o(43204),
      i = o(5095),
      n = o(95260);
    const d = i.iv`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:400;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}`;
    let a = class extends i.oi {
      render() {
        return i.dy`<span><slot></slot></span>`;
      }
    };
    (a.styles = [d]), (a = (0, r.__decorate)([(0, n.Mo)("mwc-icon")], a));
  },
  44837: (t, e, o) => {
    o.r(e), o.d(e, { REDIRECTS: () => p });
    var r = o(309),
      i = o(5095),
      n = o(95260),
      d = o(38480),
      a = o(85763);
    o(11908);
    const p = {
      hacs_repository: {
        redirect: "/hacs/repository",
        params: { owner: "string", repository: "string", category: "string?" },
      },
    };
    (0, r.Z)(
      [(0, n.Mo)("hacs-my-redirect")],
      function (t, e) {
        return {
          F: class extends e {
            constructor(...e) {
              super(...e), t(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hacs",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "route",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_error",
              value: void 0,
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (t) {
                const e = this.route.path.indexOf("/", 1),
                  o = this.route.path.substr(e + 1),
                  r = p[o];
                if (!r)
                  return void (this._error = this.hacs.localize(
                    "my.not_supported",
                    {
                      link: i.dy`<a target="_blank" rel="noreferrer noopener" href="https://my.home-assistant.io/faq.html#supported-pages"> ${this.hacs.localize(
                        "my.faq_link"
                      )} </a>`,
                    }
                  ));
                let n;
                try {
                  n = this._createRedirectUrl(r);
                } catch (t) {
                  return void (this._error = this.hacs.localize("my.error"));
                }
                (0, d.c)(n, { replace: !0 });
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return this._error
                  ? i.dy`<hass-error-screen .error="${this._error}"></hass-error-screen>`
                  : i.Ld;
              },
            },
            {
              kind: "method",
              key: "_createRedirectUrl",
              value: function (t) {
                const e = this._createRedirectParams(t);
                return `${t.redirect}${e}`;
              },
            },
            {
              kind: "method",
              key: "_createRedirectParams",
              value: function (t) {
                const e = (0, a.Q2)();
                if (!t.params && !Object.keys(e).length) return "";
                const o = {};
                for (const [r, i] of Object.entries(t.params || {}))
                  if (e[r] || !i.endsWith("?")) {
                    if (!e[r] || !this._checkParamType(i, e[r])) throw Error();
                    o[r] = e[r];
                  }
                return `?${(0, a.ou)(o)}`;
              },
            },
            {
              kind: "method",
              key: "_checkParamType",
              value: function (t, e) {
                return "string" === t || "string?" === t;
              },
            },
          ],
        };
      },
      i.oi
    );
  },
};
//# sourceMappingURL=4052.G4iRopercB8.js.map
