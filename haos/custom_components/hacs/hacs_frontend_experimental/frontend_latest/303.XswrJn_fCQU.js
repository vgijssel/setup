/*! For license information please see 303.XswrJn_fCQU.js.LICENSE.txt */
export const id = 303;
export const ids = [303];
export const modules = {
  29530: (t, e, i) => {
    i.d(e, { t: () => l });
    var s = i(57835),
      r = i(5095),
      o = i(76187);
    const n = Symbol("valueNotInitialized");
    class a extends o.sR {
      constructor(t) {
        if ((super(t), t.type !== s.pX.ELEMENT))
          throw new Error(
            `\`${this.constructor.name}\` must be bound to an element.`
          );
        this.previousValue = n;
      }
      render(t, e) {
        return r.Ld;
      }
      update(t, [e, i]) {
        if (!this.hasChanged(i)) return r.Ld;
        (this.host = t.options && t.options.host),
          (this.element = t.element),
          (this.renderer = e);
        return (
          this.previousValue === n ? this.addRenderer() : this.runRenderer(),
          (this.previousValue = Array.isArray(i) ? [...i] : i),
          r.Ld
        );
      }
      reconnected() {
        this.addRenderer();
      }
      disconnected() {
        this.removeRenderer();
      }
      addRenderer() {
        throw new Error("The `addRenderer` method must be implemented.");
      }
      runRenderer() {
        throw new Error("The `runRenderer` method must be implemented.");
      }
      removeRenderer() {
        throw new Error("The `removeRenderer` method must be implemented.");
      }
      renderRenderer(t, ...e) {
        const i = this.renderer.call(this.host, ...e);
        (0, r.sY)(i, t, { host: this.host });
      }
      hasChanged(t) {
        return Array.isArray(t)
          ? !Array.isArray(this.previousValue) ||
              this.previousValue.length !== t.length ||
              t.some((t, e) => t !== this.previousValue[e])
          : this.previousValue !== t;
      }
    }
    const l = (0, s.XM)(
      class extends a {
        addRenderer() {
          this.element.renderer = (t, e, i) => {
            this.renderRenderer(t, i.item, i, e);
          };
        }
        runRenderer() {
          this.element.requestContentUpdate();
        }
        removeRenderer() {
          this.element.renderer = null;
        }
      }
    );
  },
  61756: (t, e, i) => {
    function s(t) {
      const e = customElements.get(t.is);
      if (e) {
        const i = e.version;
        i && t.version && i === t.version
          ? console.warn(`The component ${t.is} has been loaded twice`)
          : console.error(
              `Tried to define ${t.is} version ${t.version} when version ${e.version} is already in use. Something will probably break.`
            );
      } else
        Object.defineProperty(t, "version", { get: () => "24.3.4" }),
          customElements.define(t.is, t);
    }
    class r extends HTMLElement {
      static get is() {
        return "vaadin-material-styles";
      }
    }
    s(r);
    var o = i(5095);
    const n = [];
    function a(t) {
      return t && Object.prototype.hasOwnProperty.call(t, "__themes");
    }
    function l(t, e, i = {}) {
      var s;
      t &&
        ((s = t),
        a(customElements.get(s)) &&
          console.warn(
            `The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`
          )),
        (e = (function (t = []) {
          return [t]
            .flat(1 / 0)
            .filter(
              (t) =>
                t instanceof o.c3 ||
                (console.warn(
                  "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                ),
                !1)
            );
        })(e)),
        window.Vaadin && window.Vaadin.styleModules
          ? window.Vaadin.styleModules.registerStyles(t, e, i)
          : n.push({
              themeFor: t,
              styles: e,
              include: i.include,
              moduleId: i.moduleId,
            });
    }
    const h = (t, ...e) => {
      ((t, ...e) => {
        const i = document.createElement("style");
        (i.id = t),
          (i.textContent = e
            .map((t) => t.toString())
            .join("\n")
            .replace(":host", "html")),
          document.head.insertAdjacentElement("afterbegin", i);
      })(`material-${t}`, e);
    };
    l(
      "",
      o.iv`
  :host {
    /* Text colors */
    --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));
    --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));
    --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));

    /* Primary colors */
    --material-primary-color: var(--primary-color, #6200ee);
    --material-primary-contrast-color: var(--dark-theme-base-color, #fff);
    --material-primary-text-color: var(--material-primary-color);

    /* Error colors */
    --material-error-color: var(--error-color, #b00020);
    --material-error-text-color: var(--material-error-color);

    /* Background colors */
    --material-background-color: var(--light-theme-background-color, #fff);
    --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);
    --material-disabled-color: rgba(0, 0, 0, 0.26);

    /* Divider colors */
    --material-divider-color: rgba(0, 0, 0, 0.12);

    /* Undocumented internal properties (prefixed with three dashes) */

    /* Text field tweaks */
    --_material-text-field-input-line-background-color: initial;
    --_material-text-field-input-line-opacity: initial;
    --_material-text-field-input-line-hover-opacity: initial;
    --_material-text-field-focused-label-opacity: initial;

    /* Button tweaks */
    --_material-button-raised-background-color: initial;
    --_material-button-outline-color: initial;

    /* Grid tweaks */
    --_material-grid-row-hover-background-color: initial;

    /* Split layout tweaks */
    --_material-split-layout-splitter-background-color: initial;

    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
  }

  [theme~='dark'] {
    /* Text colors */
    --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));
    --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));
    --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));

    /* Primary colors */
    --material-primary-color: var(--light-primary-color, #7e3ff2);
    --material-primary-text-color: #b794f6;

    /* Error colors */
    --material-error-color: var(--error-color, #de2839);
    --material-error-text-color: var(--material-error-color);

    /* Background colors */
    --material-background-color: var(--dark-theme-background-color, #303030);
    --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);
    --material-disabled-color: rgba(255, 255, 255, 0.3);

    /* Divider colors */
    --material-divider-color: rgba(255, 255, 255, 0.12);

    /* Undocumented internal properties (prefixed with three dashes) */

    /* Text field tweaks */
    --_material-text-field-input-line-background-color: #fff;
    --_material-text-field-input-line-opacity: 0.7;
    --_material-text-field-input-line-hover-opacity: 1;
    --_material-text-field-focused-label-opacity: 1;

    /* Button tweaks */
    --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);
    --_material-button-outline-color: rgba(255, 255, 255, 0.2);

    /* Grid tweaks */
    --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);
    --_material-grid-row-selected-overlay-opacity: 0.16;

    /* Split layout tweaks */
    --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);

    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
  }

  a {
    color: inherit;
  }
`,
      { moduleId: "material-color-light" }
    );
    l(
      "",
      o.iv`
  :host {
    /* Text colors */
    --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));
    --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));
    --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));

    /* Primary colors */
    --material-primary-color: var(--light-primary-color, #7e3ff2);
    --material-primary-text-color: #b794f6;

    /* Error colors */
    --material-error-color: var(--error-color, #de2839);
    --material-error-text-color: var(--material-error-color);

    /* Background colors */
    --material-background-color: var(--dark-theme-background-color, #303030);
    --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);
    --material-disabled-color: rgba(255, 255, 255, 0.3);

    /* Divider colors */
    --material-divider-color: rgba(255, 255, 255, 0.12);

    /* Undocumented internal properties (prefixed with three dashes) */

    /* Text field tweaks */
    --_material-text-field-input-line-background-color: #fff;
    --_material-text-field-input-line-opacity: 0.7;
    --_material-text-field-input-line-hover-opacity: 1;
    --_material-text-field-focused-label-opacity: 1;

    /* Button tweaks */
    --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);
    --_material-button-outline-color: rgba(255, 255, 255, 0.2);

    /* Grid tweaks */
    --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);
    --_material-grid-row-selected-overlay-opacity: 0.16;

    /* Split layout tweaks */
    --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);

    background-color: var(--material-background-color);
    color: var(--material-body-text-color);
  }
`,
      { moduleId: "material-color-dark" }
    );
    h(
      "color-base",
      o.iv`
  :host {
    /* Text colors */
    --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));
    --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));
    --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));

    /* Primary colors */
    --material-primary-color: var(--primary-color, #6200ee);
    --material-primary-contrast-color: var(--dark-theme-base-color, #fff);
    --material-primary-text-color: var(--material-primary-color);

    /* Error colors */
    --material-error-color: var(--error-color, #b00020);
    --material-error-text-color: var(--material-error-color);

    /* Background colors */
    --material-background-color: var(--light-theme-background-color, #fff);
    --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);
    --material-disabled-color: rgba(0, 0, 0, 0.26);

    /* Divider colors */
    --material-divider-color: rgba(0, 0, 0, 0.12);
  }
`
    );
    const d = [];
    function c(t) {
      return t && Object.prototype.hasOwnProperty.call(t, "__themes");
    }
    const u = o.iv`
  :host {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 36px;
    padding: 8px 32px 8px 10px;
    overflow: hidden;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    line-height: 24px;
  }

  /* It's the list-box's responsibility to add the focus style */
  :host([focused]) {
    outline: none;
  }

  /* Checkmark */
  [part='checkmark']::before {
    display: var(--_material-item-selected-icon-display, none);
    content: '';
    font-family: material-icons;
    font-size: 24px;
    line-height: 1;
    font-weight: 400;
    width: 24px;
    text-align: center;
    margin-right: 10px;
    color: var(--material-secondary-text-color);
    flex: none;
  }

  :host([selected]) [part='checkmark']::before {
    content: var(--material-icons-check);
  }

  @media (any-hover: hover) {
    :host(:hover:not([disabled])) {
      background-color: var(--material-secondary-background-color);
    }

    :host([focused]:not([disabled])) {
      background-color: var(--material-divider-color);
    }
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--material-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  /* RTL specific styles */
  :host([dir='rtl']) {
    padding: 8px 10px 8px 32px;
  }

  :host([dir='rtl']) [part='checkmark']::before {
    margin-right: 0;
    margin-left: 10px;
  }
`;
    !(function (t, e, i = {}) {
      var s;
      t &&
        ((s = t),
        c(customElements.get(s)) &&
          console.warn(
            `The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`
          )),
        (e = (function (t = []) {
          return [t]
            .flat(1 / 0)
            .filter(
              (t) =>
                t instanceof o.c3 ||
                (console.warn(
                  "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                ),
                !1)
            );
        })(e)),
        window.Vaadin && window.Vaadin.styleModules
          ? window.Vaadin.styleModules.registerStyles(t, e, i)
          : d.push({
              themeFor: t,
              styles: e,
              include: i.include,
              moduleId: i.moduleId,
            });
    })("vaadin-item", u, { moduleId: "material-item" });
    const _ = (t) =>
        class extends t {
          static get properties() {
            return { _theme: { type: String, readOnly: !0 } };
          }
          static get observedAttributes() {
            return [...super.observedAttributes, "theme"];
          }
          attributeChangedCallback(t, e, i) {
            super.attributeChangedCallback(t, e, i),
              "theme" === t && this._set_theme(i);
          }
        },
      p = [];
    function m(t) {
      return t && Object.prototype.hasOwnProperty.call(t, "__themes");
    }
    function f(t, e, i = {}) {
      var s;
      t &&
        ((s = t),
        m(customElements.get(s)) &&
          console.warn(
            `The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`
          )),
        (e = (function (t = []) {
          return [t]
            .flat(1 / 0)
            .filter(
              (t) =>
                t instanceof o.c3 ||
                (console.warn(
                  "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                ),
                !1)
            );
        })(e)),
        window.Vaadin && window.Vaadin.styleModules
          ? window.Vaadin.styleModules.registerStyles(t, e, i)
          : p.push({
              themeFor: t,
              styles: e,
              include: i.include,
              moduleId: i.moduleId,
            });
    }
    function g() {
      return window.Vaadin && window.Vaadin.styleModules
        ? window.Vaadin.styleModules.getAllThemes()
        : p;
    }
    function y(t = "") {
      let e = 0;
      return (
        t.startsWith("lumo-") || t.startsWith("material-")
          ? (e = 1)
          : t.startsWith("vaadin-") && (e = 2),
        e
      );
    }
    function v(t) {
      const e = [];
      return (
        t.include &&
          [].concat(t.include).forEach((t) => {
            const i = g().find((e) => e.moduleId === t);
            i
              ? e.push(...v(i), ...i.styles)
              : console.warn(
                  `Included moduleId ${t} not found in style registry`
                );
          }, t.styles),
        e
      );
    }
    function b(t) {
      const e = `${t}-default-theme`,
        i = g()
          .filter(
            (i) =>
              i.moduleId !== e &&
              (function (t, e) {
                return (t || "")
                  .split(" ")
                  .some((t) =>
                    new RegExp(`^${t.split("*").join(".*")}$`, "u").test(e)
                  );
              })(i.themeFor, t)
          )
          .map((t) => ({
            ...t,
            styles: [...v(t), ...t.styles],
            includePriority: y(t.moduleId),
          }))
          .sort((t, e) => e.includePriority - t.includePriority);
      return i.length > 0 ? i : g().filter((t) => t.moduleId === e);
    }
    const C = (t) =>
      class extends _(t) {
        static finalize() {
          if ((super.finalize(), this.elementStyles)) return;
          const t = this.prototype._template;
          t &&
            !m(this) &&
            (function (t, e) {
              const i = document.createElement("style");
              (i.innerHTML = t.map((t) => t.cssText).join("\n")),
                e.content.appendChild(i);
            })(this.getStylesForThis(), t);
        }
        static finalizeStyles(t) {
          const e = this.getStylesForThis();
          return t ? [...super.finalizeStyles(t), ...e] : e;
        }
        static getStylesForThis() {
          const t = Object.getPrototypeOf(this.prototype),
            e = (t ? t.constructor.__themes : []) || [];
          this.__themes = [...e, ...b(this.is)];
          const i = this.__themes.flatMap((t) => t.styles);
          return i.filter((t, e) => e === i.lastIndexOf(t));
        }
      };
    f(
      "vaadin-combo-box-item",
      [
        u,
        o.iv`
  :host {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    padding: 4px 10px;
    --_material-item-selected-icon-display: block;
  }
`,
      ],
      { moduleId: "material-combo-box-item" }
    );
    const x = o.iv`
  [part~='loader'] {
    height: 2px;
    background: var(--material-background-color)
      linear-gradient(
        90deg,
        transparent 0%,
        transparent 20%,
        var(--material-primary-color) 20%,
        var(--material-primary-color) 40%,
        transparent 40%,
        transparent 60%,
        var(--material-primary-color) 60%,
        var(--material-primary-color) 80%,
        transparent 80%,
        transparent 100%
      )
      0 0 / 400% 100% repeat-x;
    opacity: 0;
  }

  :host(:not([loading])) [part~='loader'] {
    display: none;
  }

  :host([loading]) [part='loader'] {
    animation: 3s linear infinite material-loader-progress, 0.3s 0.1s both material-loader-fade-in;
  }

  [part='loader']::before {
    content: '';
    display: block;
    height: 100%;
    opacity: 0.16;
    background: var(--material-primary-color);
  }

  @keyframes material-loader-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes material-loader-progress {
    0% {
      background-position: 0 0;
      background-size: 300% 100%;
    }

    33% {
      background-position: -100% 0;
      background-size: 400% 100%;
    }

    67% {
      background-position: -200% 0;
      background-size: 250% 100%;
    }

    100% {
      background-position: -300% 0;
      background-size: 300% 100%;
    }
  }

  /* RTL specific styles */

  @keyframes material-loader-progress-rtl {
    0% {
      background-position: 100% 0;
      background-size: 300% 100%;
    }

    33% {
      background-position: 200% 0;
      background-size: 400% 100%;
    }

    67% {
      background-position: 300% 0;
      background-size: 250% 100%;
    }

    100% {
      background-position: 400% 0;
      background-size: 300% 100%;
    }
  }

  :host([loading][dir='rtl']) [part='loader'] {
    animation: 3s linear infinite material-loader-progress-rtl, 0.3s 0.1s both material-loader-fade-in;
  }
`;
    h(
      "shadow",
      o.iv`
  /* prettier-ignore */
  :host {
    /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */
    --material-shadow-elevation-2dp: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    --material-shadow-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-4dp: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-6dp: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-8dp: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-12dp: 0 12px 16px 1px rgba(0, 0, 0, 0.14), 0 4px 22px 3px rgba(0, 0, 0, 0.12), 0 6px 7px -4px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-16dp: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
    --material-shadow-elevation-24dp: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.4);
  }
`
    );
    const P = o.iv`
  :host {
    top: 16px;
    right: 16px;
    /* TODO (@jouni): remove unnecessary multiplication after https://github.com/vaadin/vaadin-overlay/issues/90 is fixed */
    bottom: calc(1px * var(--vaadin-overlay-viewport-bottom) + 16px);
    left: 16px;
  }

  [part='overlay'] {
    background-color: var(--material-background-color);
    border-radius: 4px;
    box-shadow: var(--material-shadow-elevation-4dp);
    color: var(--material-body-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-body-font-size);
    font-weight: 400;
  }

  [part='content'] {
    padding: 8px 0;
  }

  [part='backdrop'] {
    opacity: 0.2;
    animation: 0.2s vaadin-overlay-backdrop-enter;
    will-change: opacity;
  }

  @keyframes vaadin-overlay-backdrop-enter {
    0% {
      opacity: 0;
    }
  }
`;
    l("", P, { moduleId: "material-overlay" });
    const w = P;
    l("", w, { moduleId: "material-menu-overlay" });
    f(
      "vaadin-combo-box-overlay",
      [
        w,
        o.iv`
  [part='overlay'] {
    position: relative;
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  [part='content'] {
    padding: 0;
  }
`,
        x,
        o.iv`
  [part~='loader'] {
    position: absolute;
    z-index: 1;
    top: -2px;
    left: 0;
    right: 0;
  }
`,
        o.iv`
      :host {
        --_vaadin-combo-box-items-container-border-width: 8px 0;
        --_vaadin-combo-box-items-container-border-style: solid;
      }
    `,
      ],
      { moduleId: "material-combo-box-overlay" }
    );
    i(56646);
    var I = i(74460);
    let E = 0;
    function S() {}
    S.prototype.__mixinApplications, S.prototype.__mixinSet;
    const T = function (t) {
      let e = t.__mixinApplications;
      e || ((e = new WeakMap()), (t.__mixinApplications = e));
      let i = E++;
      return function (s) {
        let r = s.__mixinSet;
        if (r && r[i]) return s;
        let o = e,
          n = o.get(s);
        if (!n) {
          (n = t(s)), o.set(s, n);
          let e = Object.create(n.__mixinSet || r || null);
          (e[i] = !0), (n.__mixinSet = e);
        }
        return n;
      };
    };
    var A = i(42687);
    let O = {},
      k = {};
    function V(t, e) {
      O[t] = k[t.toLowerCase()] = e;
    }
    function N(t) {
      return O[t] || k[t.toLowerCase()];
    }
    class L extends HTMLElement {
      static get observedAttributes() {
        return ["id"];
      }
      static import(t, e) {
        if (t) {
          let i = N(t);
          return i && e ? i.querySelector(e) : i;
        }
        return null;
      }
      attributeChangedCallback(t, e, i, s) {
        e !== i && this.register();
      }
      get assetpath() {
        if (!this.__assetpath) {
          const t =
              window.HTMLImports && HTMLImports.importForElement
                ? HTMLImports.importForElement(this) || document
                : this.ownerDocument,
            e = (0, A.Kk)(this.getAttribute("assetpath") || "", t.baseURI);
          this.__assetpath = (0, A.iY)(e);
        }
        return this.__assetpath;
      }
      register(t) {
        if ((t = t || this.id)) {
          if (I.XN && void 0 !== N(t))
            throw (
              (V(t, null),
              new Error(`strictTemplatePolicy: dom-module ${t} re-registered`))
            );
          (this.id = t),
            V(t, this),
            (e = this).querySelector("style") &&
              console.warn("dom-module %s has style outside template", e.id);
        }
        var e;
      }
    }
    (L.prototype.modules = O), customElements.define("dom-module", L);
    const z = "link[rel=import][type~=css]",
      R = "include",
      M = "shady-unscoped";
    function F(t) {
      return L.import(t);
    }
    function D(t) {
      let e = t.body ? t.body : t;
      const i = (0, A.Rq)(e.textContent, t.baseURI),
        s = document.createElement("style");
      return (s.textContent = i), s;
    }
    function H(t) {
      const e = t.trim().split(/\s+/),
        i = [];
      for (let t = 0; t < e.length; t++) i.push(...B(e[t]));
      return i;
    }
    function B(t) {
      const e = F(t);
      if (!e)
        return console.warn("Could not find style data in module named", t), [];
      if (void 0 === e._styles) {
        const t = [];
        t.push(...j(e));
        const i = e.querySelector("template");
        i && t.push(...$(i, e.assetpath)), (e._styles = t);
      }
      return e._styles;
    }
    function $(t, e) {
      if (!t._styles) {
        const i = [],
          s = t.content.querySelectorAll("style");
        for (let t = 0; t < s.length; t++) {
          let r = s[t],
            o = r.getAttribute(R);
          o &&
            i.push(
              ...H(o).filter(function (t, e, i) {
                return i.indexOf(t) === e;
              })
            ),
            e && (r.textContent = (0, A.Rq)(r.textContent, e)),
            i.push(r);
        }
        t._styles = i;
      }
      return t._styles;
    }
    function j(t) {
      const e = [],
        i = t.querySelectorAll(z);
      for (let t = 0; t < i.length; t++) {
        let s = i[t];
        if (s.import) {
          const t = s.import,
            i = s.hasAttribute(M);
          if (i && !t._unscopedStyle) {
            const e = D(t);
            e.setAttribute(M, ""), (t._unscopedStyle = e);
          } else t._style || (t._style = D(t));
          e.push(i ? t._unscopedStyle : t._style);
        }
      }
      return e;
    }
    const q =
      window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap
        ? window.ShadyDOM.wrap
        : window.ShadyDOM
        ? (t) => ShadyDOM.patch(t)
        : (t) => t;
    function U(t) {
      return t.indexOf(".") >= 0;
    }
    function W(t) {
      let e = t.indexOf(".");
      return -1 === e ? t : t.slice(0, e);
    }
    function Y(t, e) {
      return 0 === t.indexOf(e + ".");
    }
    function K(t, e) {
      return 0 === e.indexOf(t + ".");
    }
    function G(t, e, i) {
      return e + i.slice(t.length);
    }
    function J(t) {
      if (Array.isArray(t)) {
        let e = [];
        for (let i = 0; i < t.length; i++) {
          let s = t[i].toString().split(".");
          for (let t = 0; t < s.length; t++) e.push(s[t]);
        }
        return e.join(".");
      }
      return t;
    }
    function X(t) {
      return Array.isArray(t) ? J(t).split(".") : t.toString().split(".");
    }
    function Q(t, e, i) {
      let s = t,
        r = X(e);
      for (let t = 0; t < r.length; t++) {
        if (!s) return;
        s = s[r[t]];
      }
      return i && (i.path = r.join(".")), s;
    }
    function Z(t, e, i) {
      let s = t,
        r = X(e),
        o = r[r.length - 1];
      if (r.length > 1) {
        for (let t = 0; t < r.length - 1; t++) {
          if (((s = s[r[t]]), !s)) return;
        }
        s[o] = i;
      } else s[e] = i;
      return r.join(".");
    }
    const tt = {},
      et = /-[a-z]/g,
      it = /([A-Z])/g;
    function st(t) {
      return (
        tt[t] ||
        (tt[t] =
          t.indexOf("-") < 0 ? t : t.replace(et, (t) => t[1].toUpperCase()))
      );
    }
    function rt(t) {
      return tt[t] || (tt[t] = t.replace(it, "-$1").toLowerCase());
    }
    let ot = 0,
      nt = 0,
      at = [],
      lt = 0,
      ht = !1,
      dt = document.createTextNode("");
    new window.MutationObserver(function () {
      ht = !1;
      const t = at.length;
      for (let e = 0; e < t; e++) {
        let t = at[e];
        if (t)
          try {
            t();
          } catch (t) {
            setTimeout(() => {
              throw t;
            });
          }
      }
      at.splice(0, t), (nt += t);
    }).observe(dt, { characterData: !0 });
    const ct = {
        run: (t) => (
          ht || ((ht = !0), (dt.textContent = lt++)), at.push(t), ot++
        ),
        cancel(t) {
          const e = t - nt;
          if (e >= 0) {
            if (!at[e]) throw new Error("invalid async handle: " + t);
            at[e] = null;
          }
        },
      },
      ut = T(
        (t) =>
          class extends t {
            static createProperties(t) {
              const e = this.prototype;
              for (let i in t) i in e || e._createPropertyAccessor(i);
            }
            static attributeNameForProperty(t) {
              return t.toLowerCase();
            }
            static typeForProperty(t) {}
            _createPropertyAccessor(t, e) {
              this._addPropertyToAttributeMap(t),
                this.hasOwnProperty(
                  JSCompiler_renameProperty("__dataHasAccessor", this)
                ) ||
                  (this.__dataHasAccessor = Object.assign(
                    {},
                    this.__dataHasAccessor
                  )),
                this.__dataHasAccessor[t] ||
                  ((this.__dataHasAccessor[t] = !0),
                  this._definePropertyAccessor(t, e));
            }
            _addPropertyToAttributeMap(t) {
              this.hasOwnProperty(
                JSCompiler_renameProperty("__dataAttributes", this)
              ) ||
                (this.__dataAttributes = Object.assign(
                  {},
                  this.__dataAttributes
                ));
              let e = this.__dataAttributes[t];
              return (
                e ||
                  ((e = this.constructor.attributeNameForProperty(t)),
                  (this.__dataAttributes[e] = t)),
                e
              );
            }
            _definePropertyAccessor(t, e) {
              Object.defineProperty(this, t, {
                get() {
                  return this.__data[t];
                },
                set: e
                  ? function () {}
                  : function (e) {
                      this._setPendingProperty(t, e, !0) &&
                        this._invalidateProperties();
                    },
              });
            }
            constructor() {
              super(),
                (this.__dataEnabled = !1),
                (this.__dataReady = !1),
                (this.__dataInvalid = !1),
                (this.__data = {}),
                (this.__dataPending = null),
                (this.__dataOld = null),
                (this.__dataInstanceProps = null),
                (this.__dataCounter = 0),
                (this.__serializing = !1),
                this._initializeProperties();
            }
            ready() {
              (this.__dataReady = !0), this._flushProperties();
            }
            _initializeProperties() {
              for (let t in this.__dataHasAccessor)
                this.hasOwnProperty(t) &&
                  ((this.__dataInstanceProps = this.__dataInstanceProps || {}),
                  (this.__dataInstanceProps[t] = this[t]),
                  delete this[t]);
            }
            _initializeInstanceProperties(t) {
              Object.assign(this, t);
            }
            _setProperty(t, e) {
              this._setPendingProperty(t, e) && this._invalidateProperties();
            }
            _getProperty(t) {
              return this.__data[t];
            }
            _setPendingProperty(t, e, i) {
              let s = this.__data[t],
                r = this._shouldPropertyChange(t, e, s);
              return (
                r &&
                  (this.__dataPending ||
                    ((this.__dataPending = {}), (this.__dataOld = {})),
                  this.__dataOld &&
                    !(t in this.__dataOld) &&
                    (this.__dataOld[t] = s),
                  (this.__data[t] = e),
                  (this.__dataPending[t] = e)),
                r
              );
            }
            _isPropertyPending(t) {
              return !(
                !this.__dataPending || !this.__dataPending.hasOwnProperty(t)
              );
            }
            _invalidateProperties() {
              !this.__dataInvalid &&
                this.__dataReady &&
                ((this.__dataInvalid = !0),
                ct.run(() => {
                  this.__dataInvalid &&
                    ((this.__dataInvalid = !1), this._flushProperties());
                }));
            }
            _enableProperties() {
              this.__dataEnabled ||
                ((this.__dataEnabled = !0),
                this.__dataInstanceProps &&
                  (this._initializeInstanceProperties(this.__dataInstanceProps),
                  (this.__dataInstanceProps = null)),
                this.ready());
            }
            _flushProperties() {
              this.__dataCounter++;
              const t = this.__data,
                e = this.__dataPending,
                i = this.__dataOld;
              this._shouldPropertiesChange(t, e, i) &&
                ((this.__dataPending = null),
                (this.__dataOld = null),
                this._propertiesChanged(t, e, i)),
                this.__dataCounter--;
            }
            _shouldPropertiesChange(t, e, i) {
              return Boolean(e);
            }
            _propertiesChanged(t, e, i) {}
            _shouldPropertyChange(t, e, i) {
              return i !== e && (i == i || e == e);
            }
            attributeChangedCallback(t, e, i, s) {
              e !== i && this._attributeToProperty(t, i),
                super.attributeChangedCallback &&
                  super.attributeChangedCallback(t, e, i, s);
            }
            _attributeToProperty(t, e, i) {
              if (!this.__serializing) {
                const s = this.__dataAttributes,
                  r = (s && s[t]) || t;
                this[r] = this._deserializeValue(
                  e,
                  i || this.constructor.typeForProperty(r)
                );
              }
            }
            _propertyToAttribute(t, e, i) {
              (this.__serializing = !0),
                (i = arguments.length < 3 ? this[t] : i),
                this._valueToNodeAttribute(
                  this,
                  i,
                  e || this.constructor.attributeNameForProperty(t)
                ),
                (this.__serializing = !1);
            }
            _valueToNodeAttribute(t, e, i) {
              const s = this._serializeValue(e);
              ("class" !== i && "name" !== i && "slot" !== i) || (t = q(t)),
                void 0 === s
                  ? t.removeAttribute(i)
                  : t.setAttribute(
                      i,
                      "" === s && window.trustedTypes
                        ? window.trustedTypes.emptyScript
                        : s
                    );
            }
            _serializeValue(t) {
              return "boolean" == typeof t
                ? t
                  ? ""
                  : void 0
                : null != t
                ? t.toString()
                : void 0;
            }
            _deserializeValue(t, e) {
              switch (e) {
                case Boolean:
                  return null !== t;
                case Number:
                  return Number(t);
                default:
                  return t;
              }
            }
          }
      ),
      _t = {};
    let pt = HTMLElement.prototype;
    for (; pt; ) {
      let t = Object.getOwnPropertyNames(pt);
      for (let e = 0; e < t.length; e++) _t[t[e]] = !0;
      pt = Object.getPrototypeOf(pt);
    }
    const mt = window.trustedTypes
      ? (t) =>
          trustedTypes.isHTML(t) ||
          trustedTypes.isScript(t) ||
          trustedTypes.isScriptURL(t)
      : () => !1;
    const ft = T((t) => {
        const e = ut(t);
        return class extends e {
          static createPropertiesForAttributes() {
            let t = this.observedAttributes;
            for (let e = 0; e < t.length; e++)
              this.prototype._createPropertyAccessor(st(t[e]));
          }
          static attributeNameForProperty(t) {
            return rt(t);
          }
          _initializeProperties() {
            this.__dataProto &&
              (this._initializeProtoProperties(this.__dataProto),
              (this.__dataProto = null)),
              super._initializeProperties();
          }
          _initializeProtoProperties(t) {
            for (let e in t) this._setProperty(e, t[e]);
          }
          _ensureAttribute(t, e) {
            const i = this;
            i.hasAttribute(t) || this._valueToNodeAttribute(i, e, t);
          }
          _serializeValue(t) {
            if ("object" == typeof t) {
              if (t instanceof Date) return t.toString();
              if (t) {
                if (mt(t)) return t;
                try {
                  return JSON.stringify(t);
                } catch (t) {
                  return "";
                }
              }
            }
            return super._serializeValue(t);
          }
          _deserializeValue(t, e) {
            let i;
            switch (e) {
              case Object:
                try {
                  i = JSON.parse(t);
                } catch (e) {
                  i = t;
                }
                break;
              case Array:
                try {
                  i = JSON.parse(t);
                } catch (e) {
                  (i = null),
                    console.warn(
                      `Polymer::Attributes: couldn't decode Array as JSON: ${t}`
                    );
                }
                break;
              case Date:
                (i = isNaN(t) ? String(t) : Number(t)), (i = new Date(i));
                break;
              default:
                i = super._deserializeValue(t, e);
            }
            return i;
          }
          _definePropertyAccessor(t, e) {
            !(function (t, e) {
              if (!_t[e]) {
                let i = t[e];
                void 0 !== i &&
                  (t.__data
                    ? t._setPendingProperty(e, i)
                    : (t.__dataProto
                        ? t.hasOwnProperty(
                            JSCompiler_renameProperty("__dataProto", t)
                          ) || (t.__dataProto = Object.create(t.__dataProto))
                        : (t.__dataProto = {}),
                      (t.__dataProto[e] = i)));
              }
            })(this, t),
              super._definePropertyAccessor(t, e);
          }
          _hasAccessor(t) {
            return this.__dataHasAccessor && this.__dataHasAccessor[t];
          }
          _isPropertyPending(t) {
            return Boolean(this.__dataPending && t in this.__dataPending);
          }
        };
      }),
      gt = { "dom-if": !0, "dom-repeat": !0 };
    let yt = !1,
      vt = !1;
    function bt(t) {
      (function () {
        if (!yt) {
          yt = !0;
          const t = document.createElement("textarea");
          (t.placeholder = "a"), (vt = t.placeholder === t.textContent);
        }
        return vt;
      })() &&
        "textarea" === t.localName &&
        t.placeholder &&
        t.placeholder === t.textContent &&
        (t.textContent = null);
    }
    const Ct = (() => {
      const t =
        window.trustedTypes &&
        window.trustedTypes.createPolicy(
          "polymer-template-event-attribute-policy",
          { createScript: (t) => t }
        );
      return (e, i, s) => {
        const r = i.getAttribute(s);
        t && s.startsWith("on-")
          ? e.setAttribute(s, t.createScript(r, s))
          : e.setAttribute(s, r);
      };
    })();
    function xt(t) {
      let e = t.getAttribute("is");
      if (e && gt[e]) {
        let i = t;
        for (
          i.removeAttribute("is"),
            t = i.ownerDocument.createElement(e),
            i.parentNode.replaceChild(t, i),
            t.appendChild(i);
          i.attributes.length;

        ) {
          const { name: e } = i.attributes[0];
          Ct(t, i, e), i.removeAttribute(e);
        }
      }
      return t;
    }
    function Pt(t, e) {
      let i = e.parentInfo && Pt(t, e.parentInfo);
      if (!i) return t;
      for (let t = i.firstChild, s = 0; t; t = t.nextSibling)
        if (e.parentIndex === s++) return t;
    }
    function wt(t, e, i, s) {
      s.id && (e[s.id] = i);
    }
    function It(t, e, i) {
      if (i.events && i.events.length)
        for (let s, r = 0, o = i.events; r < o.length && (s = o[r]); r++)
          t._addMethodEventListenerToNode(e, s.name, s.value, t);
    }
    function Et(t, e, i, s) {
      i.templateInfo &&
        ((e._templateInfo = i.templateInfo), (e._parentTemplateInfo = s));
    }
    const St = T(
      (t) =>
        class extends t {
          static _parseTemplate(t, e) {
            if (!t._templateInfo) {
              let i = (t._templateInfo = {});
              (i.nodeInfoList = []),
                (i.nestedTemplate = Boolean(e)),
                (i.stripWhiteSpace =
                  (e && e.stripWhiteSpace) ||
                  (t.hasAttribute && t.hasAttribute("strip-whitespace"))),
                this._parseTemplateContent(t, i, { parent: null });
            }
            return t._templateInfo;
          }
          static _parseTemplateContent(t, e, i) {
            return this._parseTemplateNode(t.content, e, i);
          }
          static _parseTemplateNode(t, e, i) {
            let s = !1,
              r = t;
            return (
              "template" != r.localName || r.hasAttribute("preserve-content")
                ? "slot" === r.localName && (e.hasInsertionPoint = !0)
                : (s = this._parseTemplateNestedTemplate(r, e, i) || s),
              bt(r),
              r.firstChild && this._parseTemplateChildNodes(r, e, i),
              r.hasAttributes &&
                r.hasAttributes() &&
                (s = this._parseTemplateNodeAttributes(r, e, i) || s),
              s || i.noted
            );
          }
          static _parseTemplateChildNodes(t, e, i) {
            if ("script" !== t.localName && "style" !== t.localName)
              for (let s, r = t.firstChild, o = 0; r; r = s) {
                if (
                  ("template" == r.localName && (r = xt(r)),
                  (s = r.nextSibling),
                  r.nodeType === Node.TEXT_NODE)
                ) {
                  let i = s;
                  for (; i && i.nodeType === Node.TEXT_NODE; )
                    (r.textContent += i.textContent),
                      (s = i.nextSibling),
                      t.removeChild(i),
                      (i = s);
                  if (e.stripWhiteSpace && !r.textContent.trim()) {
                    t.removeChild(r);
                    continue;
                  }
                }
                let n = { parentIndex: o, parentInfo: i };
                this._parseTemplateNode(r, e, n) &&
                  (n.infoIndex = e.nodeInfoList.push(n) - 1),
                  r.parentNode && o++;
              }
          }
          static _parseTemplateNestedTemplate(t, e, i) {
            let s = t,
              r = this._parseTemplate(s, e);
            return (
              (r.content =
                s.content.ownerDocument.createDocumentFragment()).appendChild(
                s.content
              ),
              (i.templateInfo = r),
              !0
            );
          }
          static _parseTemplateNodeAttributes(t, e, i) {
            let s = !1,
              r = Array.from(t.attributes);
            for (let o, n = r.length - 1; (o = r[n]); n--)
              s =
                this._parseTemplateNodeAttribute(t, e, i, o.name, o.value) || s;
            return s;
          }
          static _parseTemplateNodeAttribute(t, e, i, s, r) {
            return "on-" === s.slice(0, 3)
              ? (t.removeAttribute(s),
                (i.events = i.events || []),
                i.events.push({ name: s.slice(3), value: r }),
                !0)
              : "id" === s && ((i.id = r), !0);
          }
          static _contentForTemplate(t) {
            let e = t._templateInfo;
            return (e && e.content) || t.content;
          }
          _stampTemplate(t, e) {
            t &&
              !t.content &&
              window.HTMLTemplateElement &&
              HTMLTemplateElement.decorate &&
              HTMLTemplateElement.decorate(t);
            let i = (e = e || this.constructor._parseTemplate(t)).nodeInfoList,
              s = e.content || t.content,
              r = document.importNode(s, !0);
            r.__noInsertionPoint = !e.hasInsertionPoint;
            let o = (r.nodeList = new Array(i.length));
            r.$ = {};
            for (let t, s = 0, n = i.length; s < n && (t = i[s]); s++) {
              let i = (o[s] = Pt(r, t));
              wt(0, r.$, i, t), Et(0, i, t, e), It(this, i, t);
            }
            return r;
          }
          _addMethodEventListenerToNode(t, e, i, s) {
            let r = (function (t, e, i) {
              return (
                (t = t._methodHost || t),
                function (e) {
                  t[i]
                    ? t[i](e, e.detail)
                    : console.warn("listener method `" + i + "` not defined");
                }
              );
            })((s = s || t), 0, i);
            return this._addEventListenerToNode(t, e, r), r;
          }
          _addEventListenerToNode(t, e, i) {
            t.addEventListener(e, i);
          }
          _removeEventListenerFromNode(t, e, i) {
            t.removeEventListener(e, i);
          }
        }
    );
    let Tt = 0;
    const At = [],
      Ot = {
        COMPUTE: "__computeEffects",
        REFLECT: "__reflectEffects",
        NOTIFY: "__notifyEffects",
        PROPAGATE: "__propagateEffects",
        OBSERVE: "__observeEffects",
        READ_ONLY: "__readOnly",
      },
      kt = "__computeInfo",
      Vt = /[A-Z]/;
    function Nt(t, e, i) {
      let s = t[e];
      if (s) {
        if (!t.hasOwnProperty(e) && ((s = t[e] = Object.create(t[e])), i))
          for (let t in s) {
            let e = s[t],
              i = (s[t] = Array(e.length));
            for (let t = 0; t < e.length; t++) i[t] = e[t];
          }
      } else s = t[e] = {};
      return s;
    }
    function Lt(t, e, i, s, r, o) {
      if (e) {
        let n = !1;
        const a = Tt++;
        for (let l in i) {
          let h = e[r ? W(l) : l];
          if (h)
            for (let e, d = 0, c = h.length; d < c && (e = h[d]); d++)
              (e.info && e.info.lastRun === a) ||
                (r && !Rt(l, e.trigger)) ||
                (e.info && (e.info.lastRun = a),
                e.fn(t, l, i, s, e.info, r, o),
                (n = !0));
        }
        return n;
      }
      return !1;
    }
    function zt(t, e, i, s, r, o, n, a) {
      let l = !1,
        h = e[n ? W(s) : s];
      if (h)
        for (let e, d = 0, c = h.length; d < c && (e = h[d]); d++)
          (e.info && e.info.lastRun === i) ||
            (n && !Rt(s, e.trigger)) ||
            (e.info && (e.info.lastRun = i),
            e.fn(t, s, r, o, e.info, n, a),
            (l = !0));
      return l;
    }
    function Rt(t, e) {
      if (e) {
        let i = e.name;
        return (
          i == t || !(!e.structured || !Y(i, t)) || !(!e.wildcard || !K(i, t))
        );
      }
      return !0;
    }
    function Mt(t, e, i, s, r) {
      let o = "string" == typeof r.method ? t[r.method] : r.method,
        n = r.property;
      o
        ? o.call(t, t.__data[n], s[n])
        : r.dynamicFn ||
          console.warn("observer method `" + r.method + "` not defined");
    }
    function Ft(t, e, i) {
      let s = W(e);
      if (s !== e) {
        return Dt(t, rt(s) + "-changed", i[e], e), !0;
      }
      return !1;
    }
    function Dt(t, e, i, s) {
      let r = { value: i, queueProperty: !0 };
      s && (r.path = s), q(t).dispatchEvent(new CustomEvent(e, { detail: r }));
    }
    function Ht(t, e, i, s, r, o) {
      let n = (o ? W(e) : e) != e ? e : null,
        a = n ? Q(t, n) : t.__data[e];
      n && void 0 === a && (a = i[e]), Dt(t, r.eventName, a, n);
    }
    function Bt(t, e, i, s, r) {
      let o = t.__data[e];
      I.v1 && (o = (0, I.v1)(o, r.attrName, "attribute", t)),
        t._propertyToAttribute(e, r.attrName, o);
    }
    function $t(t, e, i, s) {
      let r = t[Ot.COMPUTE];
      if (r)
        if (I.ls) {
          Tt++;
          const o = (function (t) {
              let e = t.constructor.__orderedComputedDeps;
              if (!e) {
                e = new Map();
                const i = t[Ot.COMPUTE];
                let s,
                  {
                    counts: r,
                    ready: o,
                    total: n,
                  } = (function (t) {
                    const e = t[kt],
                      i = {},
                      s = t[Ot.COMPUTE],
                      r = [];
                    let o = 0;
                    for (let t in e) {
                      const s = e[t];
                      o += i[t] =
                        s.args.filter((t) => !t.literal).length +
                        (s.dynamicFn ? 1 : 0);
                    }
                    for (let t in s) e[t] || r.push(t);
                    return { counts: i, ready: r, total: o };
                  })(t);
                for (; (s = o.shift()); ) {
                  e.set(s, e.size);
                  const t = i[s];
                  t &&
                    t.forEach((t) => {
                      const e = t.info.methodInfo;
                      --n, 0 == --r[e] && o.push(e);
                    });
                }
                if (0 !== n) {
                  const e = t;
                  console.warn(
                    `Computed graph for ${e.localName} incomplete; circular?`
                  );
                }
                t.constructor.__orderedComputedDeps = e;
              }
              return e;
            })(t),
            n = [];
          for (let t in e) qt(t, r, n, o, s);
          let a;
          for (; (a = n.shift()); )
            Ut(t, "", e, i, a) && qt(a.methodInfo, r, n, o, s);
          Object.assign(i, t.__dataOld),
            Object.assign(e, t.__dataPending),
            (t.__dataPending = null);
        } else {
          let o = e;
          for (; Lt(t, r, o, i, s); )
            Object.assign(i, t.__dataOld),
              Object.assign(e, t.__dataPending),
              (o = t.__dataPending),
              (t.__dataPending = null);
        }
    }
    const jt = (t, e, i) => {
        let s = 0,
          r = e.length - 1,
          o = -1;
        for (; s <= r; ) {
          const n = (s + r) >> 1,
            a = i.get(e[n].methodInfo) - i.get(t.methodInfo);
          if (a < 0) s = n + 1;
          else {
            if (!(a > 0)) {
              o = n;
              break;
            }
            r = n - 1;
          }
        }
        o < 0 && (o = r + 1), e.splice(o, 0, t);
      },
      qt = (t, e, i, s, r) => {
        const o = e[r ? W(t) : t];
        if (o)
          for (let e = 0; e < o.length; e++) {
            const n = o[e];
            n.info.lastRun === Tt ||
              (r && !Rt(t, n.trigger)) ||
              ((n.info.lastRun = Tt), jt(n.info, i, s));
          }
      };
    function Ut(t, e, i, s, r) {
      let o = Qt(t, e, i, s, r);
      if (o === At) return !1;
      let n = r.methodInfo;
      return t.__dataHasAccessor && t.__dataHasAccessor[n]
        ? t._setPendingProperty(n, o, !0)
        : ((t[n] = o), !1);
    }
    function Wt(t, e, i, s, r, o, n) {
      i.bindings = i.bindings || [];
      let a = {
        kind: s,
        target: r,
        parts: o,
        literal: n,
        isCompound: 1 !== o.length,
      };
      if (
        (i.bindings.push(a),
        (function (t) {
          return (
            Boolean(t.target) &&
            "attribute" != t.kind &&
            "text" != t.kind &&
            !t.isCompound &&
            "{" === t.parts[0].mode
          );
        })(a))
      ) {
        let { event: t, negate: e } = a.parts[0];
        (a.listenerEvent = t || rt(r) + "-changed"), (a.listenerNegate = e);
      }
      let l = e.nodeInfoList.length;
      for (let i = 0; i < a.parts.length; i++) {
        let s = a.parts[i];
        (s.compoundIndex = i), Yt(t, e, a, s, l);
      }
    }
    function Yt(t, e, i, s, r) {
      if (!s.literal)
        if ("attribute" === i.kind && "-" === i.target[0])
          console.warn(
            "Cannot set attribute " +
              i.target +
              ' because "-" is not a valid attribute starting character'
          );
        else {
          let o = s.dependencies,
            n = { index: r, binding: i, part: s, evaluator: t };
          for (let i = 0; i < o.length; i++) {
            let s = o[i];
            "string" == typeof s && ((s = oe(s)), (s.wildcard = !0)),
              t._addTemplatePropertyEffect(e, s.rootProperty, {
                fn: Kt,
                info: n,
                trigger: s,
              });
          }
        }
    }
    function Kt(t, e, i, s, r, o, n) {
      let a = n[r.index],
        l = r.binding,
        h = r.part;
      if (
        o &&
        h.source &&
        e.length > h.source.length &&
        "property" == l.kind &&
        !l.isCompound &&
        a.__isPropertyEffectsClient &&
        a.__dataHasAccessor &&
        a.__dataHasAccessor[l.target]
      ) {
        let s = i[e];
        (e = G(h.source, l.target, e)),
          a._setPendingPropertyOrPath(e, s, !1, !0) && t._enqueueClient(a);
      } else {
        let n = r.evaluator._evaluateBinding(t, h, e, i, s, o);
        n !== At &&
          (function (t, e, i, s, r) {
            (r = (function (t, e, i, s) {
              if (i.isCompound) {
                let r = t.__dataCompoundStorage[i.target];
                (r[s.compoundIndex] = e), (e = r.join(""));
              }
              "attribute" !== i.kind &&
                (("textContent" !== i.target &&
                  ("value" !== i.target ||
                    ("input" !== t.localName && "textarea" !== t.localName))) ||
                  (e = null == e ? "" : e));
              return e;
            })(e, r, i, s)),
              I.v1 && (r = (0, I.v1)(r, i.target, i.kind, e));
            if ("attribute" == i.kind) t._valueToNodeAttribute(e, r, i.target);
            else {
              let s = i.target;
              e.__isPropertyEffectsClient &&
              e.__dataHasAccessor &&
              e.__dataHasAccessor[s]
                ? (e[Ot.READ_ONLY] && e[Ot.READ_ONLY][s]) ||
                  (e._setPendingProperty(s, r) && t._enqueueClient(e))
                : t._setUnmanagedPropertyToNode(e, s, r);
            }
          })(t, a, l, h, n);
      }
    }
    function Gt(t, e) {
      if (e.isCompound) {
        let i = t.__dataCompoundStorage || (t.__dataCompoundStorage = {}),
          s = e.parts,
          r = new Array(s.length);
        for (let t = 0; t < s.length; t++) r[t] = s[t].literal;
        let o = e.target;
        (i[o] = r),
          e.literal &&
            "property" == e.kind &&
            ("className" === o && (t = q(t)), (t[o] = e.literal));
      }
    }
    function Jt(t, e, i) {
      if (i.listenerEvent) {
        let s = i.parts[0];
        t.addEventListener(i.listenerEvent, function (t) {
          !(function (t, e, i, s, r) {
            let o,
              n = t.detail,
              a = n && n.path;
            a
              ? ((s = G(i, s, a)), (o = n && n.value))
              : (o = t.currentTarget[i]),
              (o = r ? !o : o),
              (e[Ot.READ_ONLY] && e[Ot.READ_ONLY][s]) ||
                !e._setPendingPropertyOrPath(s, o, !0, Boolean(a)) ||
                (n && n.queueProperty) ||
                e._invalidateProperties();
          })(t, e, i.target, s.source, s.negate);
        });
      }
    }
    function Xt(t, e, i, s, r, o) {
      o = e.static || (o && ("object" != typeof o || o[e.methodName]));
      let n = {
        methodName: e.methodName,
        args: e.args,
        methodInfo: r,
        dynamicFn: o,
      };
      for (let r, o = 0; o < e.args.length && (r = e.args[o]); o++)
        r.literal ||
          t._addPropertyEffect(r.rootProperty, i, {
            fn: s,
            info: n,
            trigger: r,
          });
      return o && t._addPropertyEffect(e.methodName, i, { fn: s, info: n }), n;
    }
    function Qt(t, e, i, s, r) {
      let o = t._methodHost || t,
        n = o[r.methodName];
      if (n) {
        let s = t._marshalArgs(r.args, e, i);
        return s === At ? At : n.apply(o, s);
      }
      r.dynamicFn || console.warn("method `" + r.methodName + "` not defined");
    }
    const Zt = [],
      te = "(?:[a-zA-Z_$][\\w.:$\\-*]*)",
      ee =
        "(?:(" +
        te +
        "|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",
      ie = new RegExp(
        "(\\[\\[|{{)\\s*(?:(!)\\s*)?" +
          ("(" +
            te +
            "\\s*" +
            ("(?:\\(\\s*(?:" +
              ("(?:" + ee + "(?:,\\s*" + ee + ")*)") +
              "?)\\)\\s*)") +
            "?)") +
          "(?:]]|}})",
        "g"
      );
    function se(t) {
      let e = "";
      for (let i = 0; i < t.length; i++) {
        e += t[i].literal || "";
      }
      return e;
    }
    function re(t) {
      let e = t.match(/([^\s]+?)\(([\s\S]*)\)/);
      if (e) {
        let t = { methodName: e[1], static: !0, args: Zt };
        if (e[2].trim()) {
          return (function (t, e) {
            return (
              (e.args = t.map(function (t) {
                let i = oe(t);
                return i.literal || (e.static = !1), i;
              }, this)),
              e
            );
          })(e[2].replace(/\\,/g, "&comma;").split(","), t);
        }
        return t;
      }
      return null;
    }
    function oe(t) {
      let e = t
          .trim()
          .replace(/&comma;/g, ",")
          .replace(/\\(.)/g, "$1"),
        i = { name: e, value: "", literal: !1 },
        s = e[0];
      switch (("-" === s && (s = e[1]), s >= "0" && s <= "9" && (s = "#"), s)) {
        case "'":
        case '"':
          (i.value = e.slice(1, -1)), (i.literal = !0);
          break;
        case "#":
          (i.value = Number(e)), (i.literal = !0);
      }
      return (
        i.literal ||
          ((i.rootProperty = W(e)),
          (i.structured = U(e)),
          i.structured &&
            ((i.wildcard = ".*" == e.slice(-2)),
            i.wildcard && (i.name = e.slice(0, -2)))),
        i
      );
    }
    function ne(t, e, i) {
      let s = Q(t, i);
      return void 0 === s && (s = e[i]), s;
    }
    function ae(t, e, i, s) {
      const r = { indexSplices: s };
      I.HY && !t._overrideLegacyUndefined && (e.splices = r),
        t.notifyPath(i + ".splices", r),
        t.notifyPath(i + ".length", e.length),
        I.HY && !t._overrideLegacyUndefined && (r.indexSplices = []);
    }
    function le(t, e, i, s, r, o) {
      ae(t, e, i, [
        { index: s, addedCount: r, removed: o, object: e, type: "splice" },
      ]);
    }
    const he = T((t) => {
        const e = St(ft(t));
        return class extends e {
          constructor() {
            super(),
              (this.__isPropertyEffectsClient = !0),
              this.__dataClientsReady,
              this.__dataPendingClients,
              this.__dataToNotify,
              this.__dataLinkedPaths,
              this.__dataHasPaths,
              this.__dataCompoundStorage,
              this.__dataHost,
              this.__dataTemp,
              this.__dataClientsInitialized,
              this.__data,
              this.__dataPending,
              this.__dataOld,
              this.__computeEffects,
              this.__computeInfo,
              this.__reflectEffects,
              this.__notifyEffects,
              this.__propagateEffects,
              this.__observeEffects,
              this.__readOnly,
              this.__templateInfo,
              this._overrideLegacyUndefined;
          }
          get PROPERTY_EFFECT_TYPES() {
            return Ot;
          }
          _initializeProperties() {
            super._initializeProperties(),
              this._registerHost(),
              (this.__dataClientsReady = !1),
              (this.__dataPendingClients = null),
              (this.__dataToNotify = null),
              (this.__dataLinkedPaths = null),
              (this.__dataHasPaths = !1),
              (this.__dataCompoundStorage = this.__dataCompoundStorage || null),
              (this.__dataHost = this.__dataHost || null),
              (this.__dataTemp = {}),
              (this.__dataClientsInitialized = !1);
          }
          _registerHost() {
            if (de.length) {
              let t = de[de.length - 1];
              t._enqueueClient(this), (this.__dataHost = t);
            }
          }
          _initializeProtoProperties(t) {
            (this.__data = Object.create(t)),
              (this.__dataPending = Object.create(t)),
              (this.__dataOld = {});
          }
          _initializeInstanceProperties(t) {
            let e = this[Ot.READ_ONLY];
            for (let i in t)
              (e && e[i]) ||
                ((this.__dataPending = this.__dataPending || {}),
                (this.__dataOld = this.__dataOld || {}),
                (this.__data[i] = this.__dataPending[i] = t[i]));
          }
          _addPropertyEffect(t, e, i) {
            this._createPropertyAccessor(t, e == Ot.READ_ONLY);
            let s = Nt(this, e, !0)[t];
            s || (s = this[e][t] = []), s.push(i);
          }
          _removePropertyEffect(t, e, i) {
            let s = Nt(this, e, !0)[t],
              r = s.indexOf(i);
            r >= 0 && s.splice(r, 1);
          }
          _hasPropertyEffect(t, e) {
            let i = this[e];
            return Boolean(i && i[t]);
          }
          _hasReadOnlyEffect(t) {
            return this._hasPropertyEffect(t, Ot.READ_ONLY);
          }
          _hasNotifyEffect(t) {
            return this._hasPropertyEffect(t, Ot.NOTIFY);
          }
          _hasReflectEffect(t) {
            return this._hasPropertyEffect(t, Ot.REFLECT);
          }
          _hasComputedEffect(t) {
            return this._hasPropertyEffect(t, Ot.COMPUTE);
          }
          _setPendingPropertyOrPath(t, e, i, s) {
            if (s || W(Array.isArray(t) ? t[0] : t) !== t) {
              if (!s) {
                let i = Q(this, t);
                if (
                  !(t = Z(this, t, e)) ||
                  !super._shouldPropertyChange(t, e, i)
                )
                  return !1;
              }
              if (
                ((this.__dataHasPaths = !0), this._setPendingProperty(t, e, i))
              )
                return (
                  (function (t, e, i) {
                    let s = t.__dataLinkedPaths;
                    if (s) {
                      let r;
                      for (let o in s) {
                        let n = s[o];
                        K(o, e)
                          ? ((r = G(o, n, e)),
                            t._setPendingPropertyOrPath(r, i, !0, !0))
                          : K(n, e) &&
                            ((r = G(n, o, e)),
                            t._setPendingPropertyOrPath(r, i, !0, !0));
                      }
                    }
                  })(this, t, e),
                  !0
                );
            } else {
              if (this.__dataHasAccessor && this.__dataHasAccessor[t])
                return this._setPendingProperty(t, e, i);
              this[t] = e;
            }
            return !1;
          }
          _setUnmanagedPropertyToNode(t, e, i) {
            (i === t[e] && "object" != typeof i) ||
              ("className" === e && (t = q(t)), (t[e] = i));
          }
          _setPendingProperty(t, e, i) {
            let s = this.__dataHasPaths && U(t),
              r = s ? this.__dataTemp : this.__data;
            return (
              !!this._shouldPropertyChange(t, e, r[t]) &&
              (this.__dataPending ||
                ((this.__dataPending = {}), (this.__dataOld = {})),
              t in this.__dataOld || (this.__dataOld[t] = this.__data[t]),
              s ? (this.__dataTemp[t] = e) : (this.__data[t] = e),
              (this.__dataPending[t] = e),
              (s || (this[Ot.NOTIFY] && this[Ot.NOTIFY][t])) &&
                ((this.__dataToNotify = this.__dataToNotify || {}),
                (this.__dataToNotify[t] = i)),
              !0)
            );
          }
          _setProperty(t, e) {
            this._setPendingProperty(t, e, !0) && this._invalidateProperties();
          }
          _invalidateProperties() {
            this.__dataReady && this._flushProperties();
          }
          _enqueueClient(t) {
            (this.__dataPendingClients = this.__dataPendingClients || []),
              t !== this && this.__dataPendingClients.push(t);
          }
          _flushClients() {
            this.__dataClientsReady
              ? this.__enableOrFlushClients()
              : ((this.__dataClientsReady = !0),
                this._readyClients(),
                (this.__dataReady = !0));
          }
          __enableOrFlushClients() {
            let t = this.__dataPendingClients;
            if (t) {
              this.__dataPendingClients = null;
              for (let e = 0; e < t.length; e++) {
                let i = t[e];
                i.__dataEnabled
                  ? i.__dataPending && i._flushProperties()
                  : i._enableProperties();
              }
            }
          }
          _readyClients() {
            this.__enableOrFlushClients();
          }
          setProperties(t, e) {
            for (let i in t)
              (!e && this[Ot.READ_ONLY] && this[Ot.READ_ONLY][i]) ||
                this._setPendingPropertyOrPath(i, t[i], !0);
            this._invalidateProperties();
          }
          ready() {
            this._flushProperties(),
              this.__dataClientsReady || this._flushClients(),
              this.__dataPending && this._flushProperties();
          }
          _propertiesChanged(t, e, i) {
            let s,
              r = this.__dataHasPaths;
            (this.__dataHasPaths = !1),
              $t(this, e, i, r),
              (s = this.__dataToNotify),
              (this.__dataToNotify = null),
              this._propagatePropertyChanges(e, i, r),
              this._flushClients(),
              Lt(this, this[Ot.REFLECT], e, i, r),
              Lt(this, this[Ot.OBSERVE], e, i, r),
              s &&
                (function (t, e, i, s, r) {
                  let o,
                    n,
                    a = t[Ot.NOTIFY],
                    l = Tt++;
                  for (let n in e)
                    e[n] &&
                      ((a && zt(t, a, l, n, i, s, r)) || (r && Ft(t, n, i))) &&
                      (o = !0);
                  o &&
                    (n = t.__dataHost) &&
                    n._invalidateProperties &&
                    n._invalidateProperties();
                })(this, s, e, i, r),
              1 == this.__dataCounter && (this.__dataTemp = {});
          }
          _propagatePropertyChanges(t, e, i) {
            this[Ot.PROPAGATE] && Lt(this, this[Ot.PROPAGATE], t, e, i),
              this.__templateInfo &&
                this._runEffectsForTemplate(this.__templateInfo, t, e, i);
          }
          _runEffectsForTemplate(t, e, i, s) {
            const r = (e, s) => {
              Lt(this, t.propertyEffects, e, i, s, t.nodeList);
              for (let r = t.firstChild; r; r = r.nextSibling)
                this._runEffectsForTemplate(r, e, i, s);
            };
            t.runEffects ? t.runEffects(r, e, s) : r(e, s);
          }
          linkPaths(t, e) {
            (t = J(t)),
              (e = J(e)),
              (this.__dataLinkedPaths = this.__dataLinkedPaths || {}),
              (this.__dataLinkedPaths[t] = e);
          }
          unlinkPaths(t) {
            (t = J(t)),
              this.__dataLinkedPaths && delete this.__dataLinkedPaths[t];
          }
          notifySplices(t, e) {
            let i = { path: "" };
            ae(this, Q(this, t, i), i.path, e);
          }
          get(t, e) {
            return Q(e || this, t);
          }
          set(t, e, i) {
            i
              ? Z(i, t, e)
              : (this[Ot.READ_ONLY] && this[Ot.READ_ONLY][t]) ||
                (this._setPendingPropertyOrPath(t, e, !0) &&
                  this._invalidateProperties());
          }
          push(t, ...e) {
            let i = { path: "" },
              s = Q(this, t, i),
              r = s.length,
              o = s.push(...e);
            return e.length && le(this, s, i.path, r, e.length, []), o;
          }
          pop(t) {
            let e = { path: "" },
              i = Q(this, t, e),
              s = Boolean(i.length),
              r = i.pop();
            return s && le(this, i, e.path, i.length, 0, [r]), r;
          }
          splice(t, e, i, ...s) {
            let r,
              o = { path: "" },
              n = Q(this, t, o);
            return (
              e < 0
                ? (e = n.length - Math.floor(-e))
                : e && (e = Math.floor(e)),
              (r = 2 === arguments.length ? n.splice(e) : n.splice(e, i, ...s)),
              (s.length || r.length) && le(this, n, o.path, e, s.length, r),
              r
            );
          }
          shift(t) {
            let e = { path: "" },
              i = Q(this, t, e),
              s = Boolean(i.length),
              r = i.shift();
            return s && le(this, i, e.path, 0, 0, [r]), r;
          }
          unshift(t, ...e) {
            let i = { path: "" },
              s = Q(this, t, i),
              r = s.unshift(...e);
            return e.length && le(this, s, i.path, 0, e.length, []), r;
          }
          notifyPath(t, e) {
            let i;
            if (1 == arguments.length) {
              let s = { path: "" };
              (e = Q(this, t, s)), (i = s.path);
            } else i = Array.isArray(t) ? J(t) : t;
            this._setPendingPropertyOrPath(i, e, !0, !0) &&
              this._invalidateProperties();
          }
          _createReadOnlyProperty(t, e) {
            var i;
            this._addPropertyEffect(t, Ot.READ_ONLY),
              e &&
                (this["_set" + ((i = t), i[0].toUpperCase() + i.substring(1))] =
                  function (e) {
                    this._setProperty(t, e);
                  });
          }
          _createPropertyObserver(t, e, i) {
            let s = { property: t, method: e, dynamicFn: Boolean(i) };
            this._addPropertyEffect(t, Ot.OBSERVE, {
              fn: Mt,
              info: s,
              trigger: { name: t },
            }),
              i &&
                this._addPropertyEffect(e, Ot.OBSERVE, {
                  fn: Mt,
                  info: s,
                  trigger: { name: e },
                });
          }
          _createMethodObserver(t, e) {
            let i = re(t);
            if (!i)
              throw new Error("Malformed observer expression '" + t + "'");
            Xt(this, i, Ot.OBSERVE, Qt, null, e);
          }
          _createNotifyingProperty(t) {
            this._addPropertyEffect(t, Ot.NOTIFY, {
              fn: Ht,
              info: { eventName: rt(t) + "-changed", property: t },
            });
          }
          _createReflectedProperty(t) {
            let e = this.constructor.attributeNameForProperty(t);
            "-" === e[0]
              ? console.warn(
                  "Property " +
                    t +
                    " cannot be reflected to attribute " +
                    e +
                    ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'
                )
              : this._addPropertyEffect(t, Ot.REFLECT, {
                  fn: Bt,
                  info: { attrName: e },
                });
          }
          _createComputedProperty(t, e, i) {
            let s = re(e);
            if (!s)
              throw new Error("Malformed computed expression '" + e + "'");
            const r = Xt(this, s, Ot.COMPUTE, Ut, t, i);
            Nt(this, kt)[t] = r;
          }
          _marshalArgs(t, e, i) {
            const s = this.__data,
              r = [];
            for (let o = 0, n = t.length; o < n; o++) {
              let {
                name: n,
                structured: a,
                wildcard: l,
                value: h,
                literal: d,
              } = t[o];
              if (!d)
                if (l) {
                  const t = K(n, e),
                    r = ne(s, i, t ? e : n);
                  h = { path: t ? e : n, value: r, base: t ? Q(s, n) : r };
                } else h = a ? ne(s, i, n) : s[n];
              if (
                I.HY &&
                !this._overrideLegacyUndefined &&
                void 0 === h &&
                t.length > 1
              )
                return At;
              r[o] = h;
            }
            return r;
          }
          static addPropertyEffect(t, e, i) {
            this.prototype._addPropertyEffect(t, e, i);
          }
          static createPropertyObserver(t, e, i) {
            this.prototype._createPropertyObserver(t, e, i);
          }
          static createMethodObserver(t, e) {
            this.prototype._createMethodObserver(t, e);
          }
          static createNotifyingProperty(t) {
            this.prototype._createNotifyingProperty(t);
          }
          static createReadOnlyProperty(t, e) {
            this.prototype._createReadOnlyProperty(t, e);
          }
          static createReflectedProperty(t) {
            this.prototype._createReflectedProperty(t);
          }
          static createComputedProperty(t, e, i) {
            this.prototype._createComputedProperty(t, e, i);
          }
          static bindTemplate(t) {
            return this.prototype._bindTemplate(t);
          }
          _bindTemplate(t, e) {
            let i = this.constructor._parseTemplate(t),
              s = this.__preBoundTemplateInfo == i;
            if (!s)
              for (let t in i.propertyEffects) this._createPropertyAccessor(t);
            if (e)
              if (
                ((i = Object.create(i)),
                (i.wasPreBound = s),
                this.__templateInfo)
              ) {
                const e = t._parentTemplateInfo || this.__templateInfo,
                  s = e.lastChild;
                (i.parent = e),
                  (e.lastChild = i),
                  (i.previousSibling = s),
                  s ? (s.nextSibling = i) : (e.firstChild = i);
              } else this.__templateInfo = i;
            else this.__preBoundTemplateInfo = i;
            return i;
          }
          static _addTemplatePropertyEffect(t, e, i) {
            (t.hostProps = t.hostProps || {})[e] = !0;
            let s = (t.propertyEffects = t.propertyEffects || {});
            (s[e] = s[e] || []).push(i);
          }
          _stampTemplate(t, e) {
            (e = e || this._bindTemplate(t, !0)), de.push(this);
            let i = super._stampTemplate(t, e);
            if ((de.pop(), (e.nodeList = i.nodeList), !e.wasPreBound)) {
              let t = (e.childNodes = []);
              for (let e = i.firstChild; e; e = e.nextSibling) t.push(e);
            }
            return (
              (i.templateInfo = e),
              (function (t, e) {
                let { nodeList: i, nodeInfoList: s } = e;
                if (s.length)
                  for (let e = 0; e < s.length; e++) {
                    let r = s[e],
                      o = i[e],
                      n = r.bindings;
                    if (n)
                      for (let e = 0; e < n.length; e++) {
                        let i = n[e];
                        Gt(o, i), Jt(o, t, i);
                      }
                    o.__dataHost = t;
                  }
              })(this, e),
              this.__dataClientsReady &&
                (this._runEffectsForTemplate(e, this.__data, null, !1),
                this._flushClients()),
              i
            );
          }
          _removeBoundDom(t) {
            const e = t.templateInfo,
              { previousSibling: i, nextSibling: s, parent: r } = e;
            i ? (i.nextSibling = s) : r && (r.firstChild = s),
              s ? (s.previousSibling = i) : r && (r.lastChild = i),
              (e.nextSibling = e.previousSibling = null);
            let o = e.childNodes;
            for (let t = 0; t < o.length; t++) {
              let e = o[t];
              q(q(e).parentNode).removeChild(e);
            }
          }
          static _parseTemplateNode(t, i, s) {
            let r = e._parseTemplateNode.call(this, t, i, s);
            if (t.nodeType === Node.TEXT_NODE) {
              let e = this._parseBindings(t.textContent, i);
              e &&
                ((t.textContent = se(e) || " "),
                Wt(this, i, s, "text", "textContent", e),
                (r = !0));
            }
            return r;
          }
          static _parseTemplateNodeAttribute(t, i, s, r, o) {
            let n = this._parseBindings(o, i);
            if (n) {
              let e = r,
                o = "property";
              Vt.test(r)
                ? (o = "attribute")
                : "$" == r[r.length - 1] &&
                  ((r = r.slice(0, -1)), (o = "attribute"));
              let a = se(n);
              return (
                a &&
                  "attribute" == o &&
                  ("class" == r &&
                    t.hasAttribute("class") &&
                    (a += " " + t.getAttribute(r)),
                  t.setAttribute(r, a)),
                "attribute" == o &&
                  "disable-upgrade$" == e &&
                  t.setAttribute(r, ""),
                "input" === t.localName &&
                  "value" === e &&
                  t.setAttribute(e, ""),
                t.removeAttribute(e),
                "property" === o && (r = st(r)),
                Wt(this, i, s, o, r, n, a),
                !0
              );
            }
            return e._parseTemplateNodeAttribute.call(this, t, i, s, r, o);
          }
          static _parseTemplateNestedTemplate(t, i, s) {
            let r = e._parseTemplateNestedTemplate.call(this, t, i, s);
            const o = t.parentNode,
              n = s.templateInfo,
              a = "dom-if" === o.localName,
              l = "dom-repeat" === o.localName;
            I.gx &&
              (a || l) &&
              (o.removeChild(t),
              ((s = s.parentInfo).templateInfo = n),
              (s.noted = !0),
              (r = !1));
            let h = n.hostProps;
            if (I.ew && a)
              h &&
                ((i.hostProps = Object.assign(i.hostProps || {}, h)),
                I.gx || (s.parentInfo.noted = !0));
            else {
              let t = "{";
              for (let e in h) {
                Wt(this, i, s, "property", "_host_" + e, [
                  { mode: t, source: e, dependencies: [e], hostProp: !0 },
                ]);
              }
            }
            return r;
          }
          static _parseBindings(t, e) {
            let i,
              s = [],
              r = 0;
            for (; null !== (i = ie.exec(t)); ) {
              i.index > r && s.push({ literal: t.slice(r, i.index) });
              let o = i[1][0],
                n = Boolean(i[2]),
                a = i[3].trim(),
                l = !1,
                h = "",
                d = -1;
              "{" == o &&
                (d = a.indexOf("::")) > 0 &&
                ((h = a.substring(d + 2)), (a = a.substring(0, d)), (l = !0));
              let c = re(a),
                u = [];
              if (c) {
                let { args: t, methodName: i } = c;
                for (let e = 0; e < t.length; e++) {
                  let i = t[e];
                  i.literal || u.push(i);
                }
                let s = e.dynamicFns;
                ((s && s[i]) || c.static) && (u.push(i), (c.dynamicFn = !0));
              } else u.push(a);
              s.push({
                source: a,
                mode: o,
                negate: n,
                customEvent: l,
                signature: c,
                dependencies: u,
                event: h,
              }),
                (r = ie.lastIndex);
            }
            if (r && r < t.length) {
              let e = t.substring(r);
              e && s.push({ literal: e });
            }
            return s.length ? s : null;
          }
          static _evaluateBinding(t, e, i, s, r, o) {
            let n;
            return (
              (n = e.signature
                ? Qt(t, i, s, 0, e.signature)
                : i != e.source
                ? Q(t, e.source)
                : o && U(i)
                ? Q(t, i)
                : t.__data[i]),
              e.negate && (n = !n),
              n
            );
          }
        };
      }),
      de = [];
    const ce = [];
    const ue = T((t) => {
        const e = ut(t);
        function i(t) {
          const e = Object.getPrototypeOf(t);
          return e.prototype instanceof r ? e : null;
        }
        function s(t) {
          if (
            !t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", t))
          ) {
            let e = null;
            if (t.hasOwnProperty(JSCompiler_renameProperty("properties", t))) {
              const i = t.properties;
              i &&
                (e = (function (t) {
                  const e = {};
                  for (let i in t) {
                    const s = t[i];
                    e[i] = "function" == typeof s ? { type: s } : s;
                  }
                  return e;
                })(i));
            }
            t.__ownProperties = e;
          }
          return t.__ownProperties;
        }
        class r extends e {
          static get observedAttributes() {
            if (
              !this.hasOwnProperty(
                JSCompiler_renameProperty("__observedAttributes", this)
              )
            ) {
              (t = this.prototype), ce.push(t);
              const e = this._properties;
              this.__observedAttributes = e
                ? Object.keys(e).map((t) =>
                    this.prototype._addPropertyToAttributeMap(t)
                  )
                : [];
            }
            var t;
            return this.__observedAttributes;
          }
          static finalize() {
            if (
              !this.hasOwnProperty(
                JSCompiler_renameProperty("__finalized", this)
              )
            ) {
              const t = i(this);
              t && t.finalize(), (this.__finalized = !0), this._finalizeClass();
            }
          }
          static _finalizeClass() {
            const t = s(this);
            t && this.createProperties(t);
          }
          static get _properties() {
            if (
              !this.hasOwnProperty(
                JSCompiler_renameProperty("__properties", this)
              )
            ) {
              const t = i(this);
              this.__properties = Object.assign(
                {},
                t && t._properties,
                s(this)
              );
            }
            return this.__properties;
          }
          static typeForProperty(t) {
            const e = this._properties[t];
            return e && e.type;
          }
          _initializeProperties() {
            this.constructor.finalize(), super._initializeProperties();
          }
          connectedCallback() {
            super.connectedCallback && super.connectedCallback(),
              this._enableProperties();
          }
          disconnectedCallback() {
            super.disconnectedCallback && super.disconnectedCallback();
          }
        }
        return r;
      }),
      _e = window.ShadyCSS && window.ShadyCSS.cssBuild,
      pe = T((t) => {
        const e = ue(he(t));
        function i(t, e, i, s) {
          i.computed && (i.readOnly = !0),
            i.computed &&
              (t._hasReadOnlyEffect(e)
                ? console.warn(`Cannot redefine computed property '${e}'.`)
                : t._createComputedProperty(e, i.computed, s)),
            i.readOnly && !t._hasReadOnlyEffect(e)
              ? t._createReadOnlyProperty(e, !i.computed)
              : !1 === i.readOnly &&
                t._hasReadOnlyEffect(e) &&
                console.warn(
                  `Cannot make readOnly property '${e}' non-readOnly.`
                ),
            i.reflectToAttribute && !t._hasReflectEffect(e)
              ? t._createReflectedProperty(e)
              : !1 === i.reflectToAttribute &&
                t._hasReflectEffect(e) &&
                console.warn(
                  `Cannot make reflected property '${e}' non-reflected.`
                ),
            i.notify && !t._hasNotifyEffect(e)
              ? t._createNotifyingProperty(e)
              : !1 === i.notify &&
                t._hasNotifyEffect(e) &&
                console.warn(`Cannot make notify property '${e}' non-notify.`),
            i.observer &&
              t._createPropertyObserver(e, i.observer, s[i.observer]),
            t._addPropertyToAttributeMap(e);
        }
        function s(t, e, i, s) {
          if (!_e) {
            const r = e.content.querySelectorAll("style"),
              o = $(e),
              n = (function (t) {
                let e = F(t);
                return e ? j(e) : [];
              })(i),
              a = e.content.firstElementChild;
            for (let i = 0; i < n.length; i++) {
              let r = n[i];
              (r.textContent = t._processStyleText(r.textContent, s)),
                e.content.insertBefore(r, a);
            }
            let l = 0;
            for (let e = 0; e < o.length; e++) {
              let i = o[e],
                n = r[l];
              n !== i
                ? ((i = i.cloneNode(!0)), n.parentNode.insertBefore(i, n))
                : l++,
                (i.textContent = t._processStyleText(i.textContent, s));
            }
          }
          if (
            (window.ShadyCSS && window.ShadyCSS.prepareTemplate(e, i),
            I.md && _e && I.FV)
          ) {
            const i = e.content.querySelectorAll("style");
            if (i) {
              let e = "";
              Array.from(i).forEach((t) => {
                (e += t.textContent), t.parentNode.removeChild(t);
              }),
                (t._styleSheet = new CSSStyleSheet()),
                t._styleSheet.replaceSync(e);
            }
          }
        }
        return class extends e {
          static get polymerElementVersion() {
            return "3.5.1";
          }
          static _finalizeClass() {
            e._finalizeClass.call(this);
            const t =
              ((i = this).hasOwnProperty(
                JSCompiler_renameProperty("__ownObservers", i)
              ) ||
                (i.__ownObservers = i.hasOwnProperty(
                  JSCompiler_renameProperty("observers", i)
                )
                  ? i.observers
                  : null),
              i.__ownObservers);
            var i;
            t && this.createObservers(t, this._properties),
              this._prepareTemplate();
          }
          static _prepareTemplate() {
            let t = this.template;
            t &&
              ("string" == typeof t
                ? (console.error(
                    "template getter must return HTMLTemplateElement"
                  ),
                  (t = null))
                : I.nL || (t = t.cloneNode(!0))),
              (this.prototype._template = t);
          }
          static createProperties(t) {
            for (let e in t) i(this.prototype, e, t[e], t);
          }
          static createObservers(t, e) {
            const i = this.prototype;
            for (let s = 0; s < t.length; s++) i._createMethodObserver(t[s], e);
          }
          static get template() {
            if (
              !this.hasOwnProperty(JSCompiler_renameProperty("_template", this))
            ) {
              let t = this.prototype.hasOwnProperty(
                JSCompiler_renameProperty("_template", this.prototype)
              )
                ? this.prototype._template
                : void 0;
              "function" == typeof t && (t = t()),
                (this._template =
                  void 0 !== t
                    ? t
                    : (this.hasOwnProperty(
                        JSCompiler_renameProperty("is", this)
                      ) &&
                        (function (t) {
                          let e = null;
                          if (
                            t &&
                            (!I.XN || I.ZN) &&
                            ((e = L.import(t, "template")), I.XN && !e)
                          )
                            throw new Error(
                              `strictTemplatePolicy: expecting dom-module or null template for ${t}`
                            );
                          return e;
                        })(this.is)) ||
                      Object.getPrototypeOf(this.prototype).constructor
                        .template);
            }
            return this._template;
          }
          static set template(t) {
            this._template = t;
          }
          static get importPath() {
            if (
              !this.hasOwnProperty(
                JSCompiler_renameProperty("_importPath", this)
              )
            ) {
              const t = this.importMeta;
              if (t) this._importPath = (0, A.iY)(t.url);
              else {
                const t = L.import(this.is);
                this._importPath =
                  (t && t.assetpath) ||
                  Object.getPrototypeOf(this.prototype).constructor.importPath;
              }
            }
            return this._importPath;
          }
          constructor() {
            super(),
              this._template,
              this._importPath,
              this.rootPath,
              this.importPath,
              this.root,
              this.$;
          }
          _initializeProperties() {
            this.constructor.finalize(),
              this.constructor._finalizeTemplate(this.localName),
              super._initializeProperties(),
              (this.rootPath = I.sM),
              (this.importPath = this.constructor.importPath);
            let t = (function (t) {
              if (
                !t.hasOwnProperty(
                  JSCompiler_renameProperty("__propertyDefaults", t)
                )
              ) {
                t.__propertyDefaults = null;
                let e = t._properties;
                for (let i in e) {
                  let s = e[i];
                  "value" in s &&
                    ((t.__propertyDefaults = t.__propertyDefaults || {}),
                    (t.__propertyDefaults[i] = s));
                }
              }
              return t.__propertyDefaults;
            })(this.constructor);
            if (t)
              for (let e in t) {
                let i = t[e];
                if (this._canApplyPropertyDefault(e)) {
                  let t =
                    "function" == typeof i.value ? i.value.call(this) : i.value;
                  this._hasAccessor(e)
                    ? this._setPendingProperty(e, t, !0)
                    : (this[e] = t);
                }
              }
          }
          _canApplyPropertyDefault(t) {
            return !this.hasOwnProperty(t);
          }
          static _processStyleText(t, e) {
            return (0, A.Rq)(t, e);
          }
          static _finalizeTemplate(t) {
            const e = this.prototype._template;
            if (e && !e.__polymerFinalized) {
              e.__polymerFinalized = !0;
              const i = this.importPath;
              s(this, e, t, i ? (0, A.Kk)(i) : ""),
                this.prototype._bindTemplate(e);
            }
          }
          connectedCallback() {
            window.ShadyCSS &&
              this._template &&
              window.ShadyCSS.styleElement(this),
              super.connectedCallback();
          }
          ready() {
            this._template &&
              ((this.root = this._stampTemplate(this._template)),
              (this.$ = this.root.$)),
              super.ready();
          }
          _readyClients() {
            this._template && (this.root = this._attachDom(this.root)),
              super._readyClients();
          }
          _attachDom(t) {
            const e = q(this);
            if (e.attachShadow)
              return t
                ? (e.shadowRoot ||
                    (e.attachShadow({ mode: "open", shadyUpgradeFragment: t }),
                    e.shadowRoot.appendChild(t),
                    this.constructor._styleSheet &&
                      (e.shadowRoot.adoptedStyleSheets = [
                        this.constructor._styleSheet,
                      ])),
                  I.Hr &&
                    window.ShadyDOM &&
                    window.ShadyDOM.flushInitial(e.shadowRoot),
                  e.shadowRoot)
                : null;
            throw new Error(
              "ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`."
            );
          }
          updateStyles(t) {
            window.ShadyCSS && window.ShadyCSS.styleSubtree(this, t);
          }
          resolveUrl(t, e) {
            return (
              !e && this.importPath && (e = (0, A.Kk)(this.importPath)),
              (0, A.Kk)(t, e)
            );
          }
          static _parseTemplateContent(t, i, s) {
            return (
              (i.dynamicFns = i.dynamicFns || this._properties),
              e._parseTemplateContent.call(this, t, i, s)
            );
          }
          static _addTemplatePropertyEffect(t, i, s) {
            return (
              !I.a2 ||
                i in this._properties ||
                (s.info.part.signature && s.info.part.signature.static) ||
                s.info.part.hostProp ||
                t.nestedTemplate ||
                console.warn(
                  `Property '${i}' used in template but not declared in 'properties'; attribute will not be observed.`
                ),
              e._addTemplatePropertyEffect.call(this, t, i, s)
            );
          }
        };
      }),
      me =
        window.trustedTypes &&
        trustedTypes.createPolicy("polymer-html-literal", {
          createHTML: (t) => t,
        });
    class fe {
      constructor(t, e) {
        ve(t, e);
        const i = e.reduce((e, i, s) => e + ge(i) + t[s + 1], t[0]);
        this.value = i.toString();
      }
      toString() {
        return this.value;
      }
    }
    function ge(t) {
      if (t instanceof fe) return t.value;
      throw new Error(
        `non-literal value passed to Polymer's htmlLiteral function: ${t}`
      );
    }
    const ye = function (t, ...e) {
        ve(t, e);
        const i = document.createElement("template");
        let s = e.reduce(
          (e, i, s) =>
            e +
            (function (t) {
              if (t instanceof HTMLTemplateElement) return t.innerHTML;
              if (t instanceof fe) return ge(t);
              throw new Error(
                `non-template value passed to Polymer's html function: ${t}`
              );
            })(i) +
            t[s + 1],
          t[0]
        );
        return me && (s = me.createHTML(s)), (i.innerHTML = s), i;
      },
      ve = (t, e) => {
        if (
          !Array.isArray(t) ||
          !Array.isArray(t.raw) ||
          e.length !== t.length - 1
        )
          throw new TypeError("Invalid call to the html template tag");
      },
      be = pe(HTMLElement),
      Ce = [];
    function xe(t, e, i = t.getAttribute("dir")) {
      e ? t.setAttribute("dir", e) : null != i && t.removeAttribute("dir");
    }
    function Pe() {
      return document.documentElement.getAttribute("dir");
    }
    new MutationObserver(function () {
      const t = Pe();
      Ce.forEach((e) => {
        xe(e, t);
      });
    }).observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["dir"],
    });
    const we = (t) =>
        class extends t {
          static get properties() {
            return {
              dir: {
                type: String,
                value: "",
                reflectToAttribute: !0,
                converter: {
                  fromAttribute: (t) => t || "",
                  toAttribute: (t) => ("" === t ? null : t),
                },
              },
            };
          }
          get __isRTL() {
            return "rtl" === this.getAttribute("dir");
          }
          connectedCallback() {
            super.connectedCallback(),
              (this.hasAttribute("dir") && !this.__restoreSubscription) ||
                (this.__subscribe(), xe(this, Pe(), null));
          }
          attributeChangedCallback(t, e, i) {
            if ((super.attributeChangedCallback(t, e, i), "dir" !== t)) return;
            const s = Pe(),
              r = i === s && -1 === Ce.indexOf(this),
              o = !i && e && -1 === Ce.indexOf(this),
              n = i !== s && e === s;
            r || o
              ? (this.__subscribe(), xe(this, s, i))
              : n && this.__unsubscribe();
          }
          disconnectedCallback() {
            super.disconnectedCallback(),
              (this.__restoreSubscription = Ce.includes(this)),
              this.__unsubscribe();
          }
          _valueToNodeAttribute(t, e, i) {
            ("dir" !== i || "" !== e || t.hasAttribute("dir")) &&
              super._valueToNodeAttribute(t, e, i);
          }
          _attributeToProperty(t, e, i) {
            "dir" !== t || e
              ? super._attributeToProperty(t, e, i)
              : (this.dir = "");
          }
          __subscribe() {
            Ce.includes(this) || Ce.push(this);
          }
          __unsubscribe() {
            Ce.includes(this) && Ce.splice(Ce.indexOf(this), 1);
          }
        },
      Ie = (t) =>
        class extends t {
          static get properties() {
            return {
              index: { type: Number },
              item: { type: Object },
              label: { type: String },
              selected: { type: Boolean, value: !1, reflectToAttribute: !0 },
              focused: { type: Boolean, value: !1, reflectToAttribute: !0 },
              renderer: { type: Function },
            };
          }
          static get observers() {
            return [
              "__rendererOrItemChanged(renderer, index, item.*, selected, focused)",
              "__updateLabel(label, renderer)",
            ];
          }
          static get observedAttributes() {
            return [...super.observedAttributes, "hidden"];
          }
          attributeChangedCallback(t, e, i) {
            "hidden" === t && null !== i
              ? (this.index = void 0)
              : super.attributeChangedCallback(t, e, i);
          }
          connectedCallback() {
            super.connectedCallback(), (this._owner = this.parentNode.owner);
            const t = this._owner.getAttribute("dir");
            t && this.setAttribute("dir", t);
          }
          requestContentUpdate() {
            if (!this.renderer) return;
            const t = {
              index: this.index,
              item: this.item,
              focused: this.focused,
              selected: this.selected,
            };
            this.renderer(this, this._owner, t);
          }
          __rendererOrItemChanged(t, e, i) {
            void 0 !== i &&
              void 0 !== e &&
              (this._oldRenderer !== t &&
                ((this.innerHTML = ""), delete this._$litPart$),
              t && ((this._oldRenderer = t), this.requestContentUpdate()));
          }
          __updateLabel(t, e) {
            e || (this.textContent = t);
          }
        };
    class Ee extends Ie(C(we(be))) {
      static get template() {
        return ye`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
      }
      static get is() {
        return "vaadin-combo-box-item";
      }
    }
    s(Ee);
    let Se = !1,
      Te = [],
      Ae = [];
    function Oe() {
      (Se = !0),
        requestAnimationFrame(function () {
          (Se = !1),
            ke(Te),
            setTimeout(function () {
              !(function (t) {
                for (let e = 0, i = t.length; e < i; e++) Ve(t.shift());
              })(Ae);
            });
        });
    }
    function ke(t) {
      for (; t.length; ) Ve(t.shift());
    }
    function Ve(t) {
      const e = t[0],
        i = t[1],
        s = t[2];
      try {
        i.apply(e, s);
      } catch (t) {
        setTimeout(() => {
          throw t;
        });
      }
    }
    function Ne(t, e, i) {
      Se || Oe(), Ae.push([t, e, i]);
    }
    const Le = (t) => t.test(navigator.userAgent),
      ze = (t) => t.test(navigator.platform);
    Le(/Android/u), Le(/Chrome/u) && /Google Inc/u.test(navigator.vendor);
    Le(/Firefox/u);
    const Re = ze(/^iPad/u) || (ze(/^Mac/u) && navigator.maxTouchPoints > 1),
      Me = ze(/^iPhone/u) || Re,
      Fe = Le(/^((?!chrome|android).)*safari/iu),
      De = (() => {
        try {
          return document.createEvent("TouchEvent"), !0;
        } catch (t) {
          return !1;
        }
      })();
    let He = new WeakMap(),
      Be = new WeakMap(),
      $e = {},
      je = 0;
    const qe = (t) => t && t.nodeType === Node.ELEMENT_NODE,
      Ue = (...t) => {
        console.error(`Error: ${t.join(" ")}. Skip setting aria-hidden.`);
      },
      We = (t, e, i, s) => {
        const r = ((t, e) =>
          qe(t)
            ? e
                .map((e) => {
                  if (!qe(e)) return Ue(e, "is not a valid element"), null;
                  let i = e;
                  for (; i && i !== t; ) {
                    if (t.contains(i)) return e;
                    i = i.getRootNode().host;
                  }
                  return Ue(e, "is not contained inside", t), null;
                })
                .filter((t) => Boolean(t))
            : (Ue(t, "is not a valid element"), []))(
          e,
          Array.isArray(t) ? t : [t]
        );
        $e[i] || ($e[i] = new WeakMap());
        const o = $e[i],
          n = [],
          a = new Set(),
          l = new Set(r),
          h = (t) => {
            if (!t || a.has(t)) return;
            a.add(t);
            const e = t.assignedSlot;
            e && h(e), h(t.parentNode || t.host);
          };
        r.forEach(h);
        const d = (t) => {
          if (!t || l.has(t)) return;
          const e = t.shadowRoot;
          (e ? [...t.children, ...e.children] : [...t.children]).forEach(
            (t) => {
              if (!["template", "script", "style"].includes(t.localName))
                if (a.has(t)) d(t);
                else {
                  const e = t.getAttribute(s),
                    r = null !== e && "false" !== e,
                    a = (He.get(t) || 0) + 1,
                    l = (o.get(t) || 0) + 1;
                  He.set(t, a),
                    o.set(t, l),
                    n.push(t),
                    1 === a && r && Be.set(t, !0),
                    1 === l && t.setAttribute(i, "true"),
                    r || t.setAttribute(s, "true");
                }
            }
          );
        };
        return (
          d(e),
          a.clear(),
          (je += 1),
          () => {
            n.forEach((t) => {
              const e = He.get(t) - 1,
                r = o.get(t) - 1;
              He.set(t, e),
                o.set(t, r),
                e || (Be.has(t) ? Be.delete(t) : t.removeAttribute(s)),
                r || t.removeAttribute(i);
            }),
              (je -= 1),
              je ||
                ((He = new WeakMap()),
                (He = new WeakMap()),
                (Be = new WeakMap()),
                ($e = {}));
          }
        );
      },
      Ye = (t, e = document.body, i = "data-aria-hidden") => {
        const s = Array.from(Array.isArray(t) ? t : [t]);
        return (
          e && s.push(...Array.from(e.querySelectorAll("[aria-live]"))),
          We(s, e, i, "aria-hidden")
        );
      };
    HTMLElement.prototype;
    class Ke {
      constructor(t, e) {
        (this.host = t), (this.callback = "function" == typeof e ? e : () => t);
      }
      showModal() {
        const t = this.callback();
        this.__showOthers = Ye(t);
      }
      close() {
        this.__showOthers && (this.__showOthers(), (this.__showOthers = null));
      }
    }
    let Ge = !1;
    function Je() {
      let t = document.activeElement || document.body;
      for (; t.shadowRoot && t.shadowRoot.activeElement; )
        t = t.shadowRoot.activeElement;
      return t;
    }
    function Xe(t) {
      const e = t.style;
      if ("hidden" === e.visibility || "none" === e.display) return !0;
      const i = window.getComputedStyle(t);
      return "hidden" === i.visibility || "none" === i.display;
    }
    function Qe(t, e) {
      const i = Math.max(t.tabIndex, 0),
        s = Math.max(e.tabIndex, 0);
      return 0 === i || 0 === s ? s > i : i > s;
    }
    function Ze(t) {
      const e = t.length;
      if (e < 2) return t;
      const i = Math.ceil(e / 2);
      return (function (t, e) {
        const i = [];
        for (; t.length > 0 && e.length > 0; )
          Qe(t[0], e[0]) ? i.push(e.shift()) : i.push(t.shift());
        return i.concat(t, e);
      })(Ze(t.slice(0, i)), Ze(t.slice(i)));
    }
    function ti(t) {
      return t.getRootNode().activeElement === t;
    }
    function ei(t, e) {
      if (t.nodeType !== Node.ELEMENT_NODE || Xe(t)) return !1;
      const i = t,
        s = (function (t) {
          if (
            !(function (t) {
              return (
                !t.matches('[tabindex="-1"]') &&
                (t.matches("input, select, textarea, button, object")
                  ? t.matches(":not([disabled])")
                  : t.matches(
                      "a[href], area[href], iframe, [tabindex], [contentEditable]"
                    ))
              );
            })(t)
          )
            return -1;
          const e = t.getAttribute("tabindex") || 0;
          return Number(e);
        })(i);
      let r = s > 0;
      s >= 0 && e.push(i);
      let o = [];
      return (
        (o =
          "slot" === i.localName
            ? i.assignedNodes({ flatten: !0 })
            : (i.shadowRoot || i).children),
        [...o].forEach((t) => {
          r = ei(t, e) || r;
        }),
        r
      );
    }
    window.addEventListener(
      "keydown",
      () => {
        Ge = !0;
      },
      { capture: !0 }
    ),
      window.addEventListener(
        "mousedown",
        () => {
          Ge = !1;
        },
        { capture: !0 }
      );
    class ii {
      saveFocus(t) {
        this.focusNode = t || Je();
      }
      restoreFocus() {
        const t = this.focusNode;
        t &&
          (Je() === document.body ? setTimeout(() => t.focus()) : t.focus(),
          (this.focusNode = null));
      }
    }
    const si = [];
    class ri {
      constructor(t) {
        (this.host = t),
          (this.__trapNode = null),
          (this.__onKeyDown = this.__onKeyDown.bind(this));
      }
      get __focusableElements() {
        return (function (t) {
          const e = [];
          return ei(t, e) ? Ze(e) : e;
        })(this.__trapNode);
      }
      get __focusedElementIndex() {
        const t = this.__focusableElements;
        return t.indexOf(t.filter(ti).pop());
      }
      hostConnected() {
        document.addEventListener("keydown", this.__onKeyDown);
      }
      hostDisconnected() {
        document.removeEventListener("keydown", this.__onKeyDown);
      }
      trapFocus(t) {
        if (((this.__trapNode = t), 0 === this.__focusableElements.length))
          throw (
            ((this.__trapNode = null),
            new Error(
              "The trap node should have at least one focusable descendant or be focusable itself."
            ))
          );
        si.push(this),
          -1 === this.__focusedElementIndex &&
            this.__focusableElements[0].focus();
      }
      releaseFocus() {
        (this.__trapNode = null), si.pop();
      }
      __onKeyDown(t) {
        if (
          this.__trapNode &&
          this === Array.from(si).pop() &&
          "Tab" === t.key
        ) {
          t.preventDefault();
          const e = t.shiftKey;
          this.__focusNextElement(e);
        }
      }
      __focusNextElement(t = !1) {
        const e = this.__focusableElements,
          i = t ? -1 : 1,
          s = this.__focusedElementIndex,
          r = e[(e.length + s + i) % e.length];
        r.focus(), "input" === r.localName && r.select();
      }
    }
    const oi = T((t) =>
        "function" == typeof t.prototype.addController
          ? t
          : class extends t {
              constructor() {
                super(), (this.__controllers = new Set());
              }
              connectedCallback() {
                super.connectedCallback(),
                  this.__controllers.forEach((t) => {
                    t.hostConnected && t.hostConnected();
                  });
              }
              disconnectedCallback() {
                super.disconnectedCallback(),
                  this.__controllers.forEach((t) => {
                    t.hostDisconnected && t.hostDisconnected();
                  });
              }
              addController(t) {
                this.__controllers.add(t),
                  void 0 !== this.$ &&
                    this.isConnected &&
                    t.hostConnected &&
                    t.hostConnected();
              }
              removeController(t) {
                this.__controllers.delete(t);
              }
            }
      ),
      ni = (t) =>
        class extends oi(t) {
          static get properties() {
            return {
              focusTrap: { type: Boolean, value: !1 },
              restoreFocusOnClose: { type: Boolean, value: !1 },
              restoreFocusNode: { type: HTMLElement },
            };
          }
          constructor() {
            super(),
              (this.__ariaModalController = new Ke(this)),
              (this.__focusTrapController = new ri(this)),
              (this.__focusRestorationController = new ii());
          }
          ready() {
            super.ready(),
              this.addController(this.__ariaModalController),
              this.addController(this.__focusTrapController),
              this.addController(this.__focusRestorationController);
          }
          _resetFocus() {
            this.focusTrap &&
              (this.__ariaModalController.close(),
              this.__focusTrapController.releaseFocus()),
              this.restoreFocusOnClose &&
                this._shouldRestoreFocus() &&
                this.__focusRestorationController.restoreFocus();
          }
          _saveFocus() {
            this.restoreFocusOnClose &&
              this.__focusRestorationController.saveFocus(
                this.restoreFocusNode
              );
          }
          _trapFocus() {
            this.focusTrap &&
              (this.__ariaModalController.showModal(),
              this.__focusTrapController.trapFocus(this.$.overlay));
          }
          _shouldRestoreFocus() {
            const t = Je();
            return t === document.body || this._deepContains(t);
          }
          _deepContains(t) {
            if (this.contains(t)) return !0;
            let e = t;
            const i = t.ownerDocument;
            for (; e && e !== i && e !== this; ) e = e.parentNode || e.host;
            return e === this;
          }
        },
      ai = () =>
        Array.from(document.body.children)
          .filter(
            (t) =>
              t instanceof HTMLElement &&
              t._hasOverlayStackMixin &&
              !t.hasAttribute("closing")
          )
          .sort((t, e) => t.__zIndex - e.__zIndex || 0),
      li = (t) =>
        class extends t {
          constructor() {
            super(), (this._hasOverlayStackMixin = !0);
          }
          get _last() {
            return ((t) => t === ai().pop())(this);
          }
          bringToFront() {
            let t = "";
            const e = ai()
              .filter((t) => t !== this)
              .pop();
            if (e) {
              t = e.__zIndex + 1;
            }
            (this.style.zIndex = t),
              (this.__zIndex = t || parseFloat(getComputedStyle(this).zIndex));
          }
          _enterModalState() {
            "none" !== document.body.style.pointerEvents &&
              ((this._previousDocumentPointerEvents =
                document.body.style.pointerEvents),
              (document.body.style.pointerEvents = "none")),
              ai().forEach((t) => {
                t !== this && (t.$.overlay.style.pointerEvents = "none");
              });
          }
          _exitModalState() {
            void 0 !== this._previousDocumentPointerEvents &&
              ((document.body.style.pointerEvents =
                this._previousDocumentPointerEvents),
              delete this._previousDocumentPointerEvents);
            const t = ai();
            let e;
            for (
              ;
              (e = t.pop()) &&
              (e === this ||
                (e.$.overlay.style.removeProperty("pointer-events"),
                e.modeless));

            );
          }
        },
      hi = (t) =>
        class extends ni(li(t)) {
          static get properties() {
            return {
              opened: {
                type: Boolean,
                notify: !0,
                observer: "_openedChanged",
                reflectToAttribute: !0,
              },
              owner: { type: Object },
              model: { type: Object },
              renderer: { type: Object },
              modeless: {
                type: Boolean,
                value: !1,
                reflectToAttribute: !0,
                observer: "_modelessChanged",
              },
              hidden: {
                type: Boolean,
                reflectToAttribute: !0,
                observer: "_hiddenChanged",
              },
              withBackdrop: {
                type: Boolean,
                value: !1,
                reflectToAttribute: !0,
              },
            };
          }
          static get observers() {
            return ["_rendererOrDataChanged(renderer, owner, model, opened)"];
          }
          constructor() {
            super(),
              (this._boundMouseDownListener =
                this._mouseDownListener.bind(this)),
              (this._boundMouseUpListener = this._mouseUpListener.bind(this)),
              (this._boundOutsideClickListener =
                this._outsideClickListener.bind(this)),
              (this._boundKeydownListener = this._keydownListener.bind(this)),
              Me &&
                (this._boundIosResizeListener = () => this._detectIosNavbar());
          }
          ready() {
            super.ready(),
              this.addEventListener("click", () => {}),
              this.$.backdrop.addEventListener("click", () => {}),
              this.addEventListener("mouseup", () => {
                document.activeElement === document.body &&
                  "0" === this.$.overlay.getAttribute("tabindex") &&
                  this.$.overlay.focus();
              });
          }
          connectedCallback() {
            super.connectedCallback(),
              this._boundIosResizeListener &&
                (this._detectIosNavbar(),
                window.addEventListener(
                  "resize",
                  this._boundIosResizeListener
                ));
          }
          disconnectedCallback() {
            super.disconnectedCallback(),
              this._boundIosResizeListener &&
                window.removeEventListener(
                  "resize",
                  this._boundIosResizeListener
                );
          }
          requestContentUpdate() {
            this.renderer &&
              this.renderer.call(this.owner, this, this.owner, this.model);
          }
          close(t) {
            const e = new CustomEvent("vaadin-overlay-close", {
              bubbles: !0,
              cancelable: !0,
              detail: { sourceEvent: t },
            });
            this.dispatchEvent(e), e.defaultPrevented || (this.opened = !1);
          }
          _detectIosNavbar() {
            if (!this.opened) return;
            const t = window.innerHeight,
              e = window.innerWidth > t,
              i = document.documentElement.clientHeight;
            e && i > t
              ? this.style.setProperty(
                  "--vaadin-overlay-viewport-bottom",
                  i - t + "px"
                )
              : this.style.setProperty("--vaadin-overlay-viewport-bottom", "0");
          }
          _addGlobalListeners() {
            document.addEventListener(
              "mousedown",
              this._boundMouseDownListener
            ),
              document.addEventListener("mouseup", this._boundMouseUpListener),
              document.documentElement.addEventListener(
                "click",
                this._boundOutsideClickListener,
                !0
              );
          }
          _removeGlobalListeners() {
            document.removeEventListener(
              "mousedown",
              this._boundMouseDownListener
            ),
              document.removeEventListener(
                "mouseup",
                this._boundMouseUpListener
              ),
              document.documentElement.removeEventListener(
                "click",
                this._boundOutsideClickListener,
                !0
              );
          }
          _rendererOrDataChanged(t, e, i, s) {
            const r = this._oldOwner !== e || this._oldModel !== i;
            (this._oldModel = i), (this._oldOwner = e);
            const o = this._oldRenderer !== t;
            this._oldRenderer = t;
            const n = this._oldOpened !== s;
            (this._oldOpened = s),
              o && ((this.innerHTML = ""), delete this._$litPart$),
              s && t && (o || n || r) && this.requestContentUpdate();
          }
          _modelessChanged(t) {
            t
              ? (this._removeGlobalListeners(), this._exitModalState())
              : this.opened &&
                (this._addGlobalListeners(), this._enterModalState());
          }
          _openedChanged(t, e) {
            t
              ? (this._saveFocus(),
                this._animatedOpening(),
                Ne(this, () => {
                  this._trapFocus();
                  const t = new CustomEvent("vaadin-overlay-open", {
                    bubbles: !0,
                  });
                  this.dispatchEvent(t);
                }),
                document.addEventListener(
                  "keydown",
                  this._boundKeydownListener
                ),
                this.modeless || this._addGlobalListeners())
              : e &&
                (this._resetFocus(),
                this._animatedClosing(),
                document.removeEventListener(
                  "keydown",
                  this._boundKeydownListener
                ),
                this.modeless || this._removeGlobalListeners());
          }
          _hiddenChanged(t) {
            t &&
              this.hasAttribute("closing") &&
              this._flushAnimation("closing");
          }
          _shouldAnimate() {
            const t = getComputedStyle(this),
              e = t.getPropertyValue("animation-name");
            return (
              !("none" === t.getPropertyValue("display")) && e && "none" !== e
            );
          }
          _enqueueAnimation(t, e) {
            const i = `__${t}Handler`,
              s = (t) => {
                (t && t.target !== this) ||
                  (e(),
                  this.removeEventListener("animationend", s),
                  delete this[i]);
              };
            (this[i] = s), this.addEventListener("animationend", s);
          }
          _flushAnimation(t) {
            const e = `__${t}Handler`;
            "function" == typeof this[e] && this[e]();
          }
          _animatedOpening() {
            this.parentNode === document.body &&
              this.hasAttribute("closing") &&
              this._flushAnimation("closing"),
              this._attachOverlay(),
              this.modeless || this._enterModalState(),
              this.setAttribute("opening", ""),
              this._shouldAnimate()
                ? this._enqueueAnimation("opening", () => {
                    this._finishOpening();
                  })
                : this._finishOpening();
          }
          _attachOverlay() {
            (this._placeholder = document.createComment(
              "vaadin-overlay-placeholder"
            )),
              this.parentNode.insertBefore(this._placeholder, this),
              document.body.appendChild(this),
              this.bringToFront();
          }
          _finishOpening() {
            this.removeAttribute("opening");
          }
          _finishClosing() {
            this._detachOverlay(),
              this.$.overlay.style.removeProperty("pointer-events"),
              this.removeAttribute("closing"),
              this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"));
          }
          _animatedClosing() {
            this.hasAttribute("opening") && this._flushAnimation("opening"),
              this._placeholder &&
                (this._exitModalState(),
                this.setAttribute("closing", ""),
                this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")),
                this._shouldAnimate()
                  ? this._enqueueAnimation("closing", () => {
                      this._finishClosing();
                    })
                  : this._finishClosing());
          }
          _detachOverlay() {
            this._placeholder.parentNode.insertBefore(this, this._placeholder),
              this._placeholder.parentNode.removeChild(this._placeholder);
          }
          _mouseDownListener(t) {
            this._mouseDownInside =
              t.composedPath().indexOf(this.$.overlay) >= 0;
          }
          _mouseUpListener(t) {
            this._mouseUpInside = t.composedPath().indexOf(this.$.overlay) >= 0;
          }
          _shouldCloseOnOutsideClick(t) {
            return this._last;
          }
          _outsideClickListener(t) {
            if (
              t.composedPath().includes(this.$.overlay) ||
              this._mouseDownInside ||
              this._mouseUpInside
            )
              return (
                (this._mouseDownInside = !1), void (this._mouseUpInside = !1)
              );
            if (!this._shouldCloseOnOutsideClick(t)) return;
            const e = new CustomEvent("vaadin-overlay-outside-click", {
              bubbles: !0,
              cancelable: !0,
              detail: { sourceEvent: t },
            });
            this.dispatchEvent(e),
              this.opened && !e.defaultPrevented && this.close(t);
          }
          _keydownListener(t) {
            if (
              this._last &&
              (!this.modeless || t.composedPath().includes(this.$.overlay)) &&
              "Escape" === t.key
            ) {
              const e = new CustomEvent("vaadin-overlay-escape-press", {
                bubbles: !0,
                cancelable: !0,
                detail: { sourceEvent: t },
              });
              this.dispatchEvent(e),
                this.opened && !e.defaultPrevented && this.close(t);
            }
          }
        },
      di = o.iv`:host{z-index:200;position:fixed;inset:0;bottom:var(--vaadin-overlay-viewport-bottom);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:auto;pointer-events:none;-webkit-tap-highlight-color:transparent;--vaadin-overlay-viewport-bottom:0}:host(:not([opened]):not([closing])),:host([hidden]){display:none!important}[part=overlay]{-webkit-overflow-scrolling:touch;overflow:auto;pointer-events:auto;max-width:100%;box-sizing:border-box;-webkit-tap-highlight-color:initial}[part=backdrop]{z-index:-1;content:'';background:rgba(0,0,0,.5);position:fixed;inset:0;pointer-events:auto}`;
    const ci = { start: "top", end: "bottom" },
      ui = { start: "left", end: "right" },
      _i = new ResizeObserver((t) => {
        setTimeout(() => {
          t.forEach((t) => {
            t.target.__overlay && t.target.__overlay._updatePosition();
          });
        });
      }),
      pi = (t) =>
        class extends t {
          static get properties() {
            return {
              positionTarget: { type: Object, value: null, sync: !0 },
              horizontalAlign: { type: String, value: "start", sync: !0 },
              verticalAlign: { type: String, value: "top", sync: !0 },
              noHorizontalOverlap: { type: Boolean, value: !1, sync: !0 },
              noVerticalOverlap: { type: Boolean, value: !1, sync: !0 },
              requiredVerticalSpace: { type: Number, value: 0, sync: !0 },
            };
          }
          static get observers() {
            return [
              "__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)",
              "__overlayOpenedChanged(opened, positionTarget)",
            ];
          }
          constructor() {
            super(),
              (this.__onScroll = this.__onScroll.bind(this)),
              (this._updatePosition = this._updatePosition.bind(this));
          }
          connectedCallback() {
            super.connectedCallback(),
              this.opened && this.__addUpdatePositionEventListeners();
          }
          disconnectedCallback() {
            super.disconnectedCallback(),
              this.__removeUpdatePositionEventListeners();
          }
          __addUpdatePositionEventListeners() {
            window.addEventListener("resize", this._updatePosition),
              (this.__positionTargetAncestorRootNodes = (function (t) {
                const e = [];
                for (; t; ) {
                  if (t.nodeType === Node.DOCUMENT_NODE) {
                    e.push(t);
                    break;
                  }
                  t.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
                    ? (t = t.assignedSlot ? t.assignedSlot : t.parentNode)
                    : (e.push(t), (t = t.host));
                }
                return e;
              })(this.positionTarget)),
              this.__positionTargetAncestorRootNodes.forEach((t) => {
                t.addEventListener("scroll", this.__onScroll, !0);
              });
          }
          __removeUpdatePositionEventListeners() {
            window.removeEventListener("resize", this._updatePosition),
              this.__positionTargetAncestorRootNodes &&
                (this.__positionTargetAncestorRootNodes.forEach((t) => {
                  t.removeEventListener("scroll", this.__onScroll, !0);
                }),
                (this.__positionTargetAncestorRootNodes = null));
          }
          __overlayOpenedChanged(t, e) {
            if (
              (this.__removeUpdatePositionEventListeners(),
              e &&
                ((e.__overlay = null),
                _i.unobserve(e),
                t &&
                  (this.__addUpdatePositionEventListeners(),
                  (e.__overlay = this),
                  _i.observe(e))),
              t)
            ) {
              const t = getComputedStyle(this);
              this.__margins ||
                ((this.__margins = {}),
                ["top", "bottom", "left", "right"].forEach((e) => {
                  this.__margins[e] = parseInt(t[e], 10);
                })),
                this.setAttribute("dir", t.direction),
                this._updatePosition(),
                requestAnimationFrame(() => this._updatePosition());
            }
          }
          __positionSettingsChanged() {
            this._updatePosition();
          }
          __onScroll(t) {
            this.contains(t.target) || this._updatePosition();
          }
          _updatePosition() {
            if (!this.positionTarget || !this.opened) return;
            const t = this.positionTarget.getBoundingClientRect(),
              e = this.__shouldAlignStartVertically(t);
            this.style.justifyContent = e ? "flex-start" : "flex-end";
            const i = this.__isRTL,
              s = this.__shouldAlignStartHorizontally(t, i),
              r = (!i && s) || (i && !s);
            this.style.alignItems = r ? "flex-start" : "flex-end";
            const o = this.getBoundingClientRect(),
              n = this.__calculatePositionInOneDimension(
                t,
                o,
                this.noVerticalOverlap,
                ci,
                this,
                e
              ),
              a = this.__calculatePositionInOneDimension(
                t,
                o,
                this.noHorizontalOverlap,
                ui,
                this,
                s
              );
            Object.assign(this.style, n, a),
              this.toggleAttribute("bottom-aligned", !e),
              this.toggleAttribute("top-aligned", e),
              this.toggleAttribute("end-aligned", !r),
              this.toggleAttribute("start-aligned", r);
          }
          __shouldAlignStartHorizontally(t, e) {
            const i = Math.max(
              this.__oldContentWidth || 0,
              this.$.overlay.offsetWidth
            );
            this.__oldContentWidth = this.$.overlay.offsetWidth;
            const s = Math.min(
                window.innerWidth,
                document.documentElement.clientWidth
              ),
              r =
                (!e && "start" === this.horizontalAlign) ||
                (e && "end" === this.horizontalAlign);
            return this.__shouldAlignStart(
              t,
              i,
              s,
              this.__margins,
              r,
              this.noHorizontalOverlap,
              ui
            );
          }
          __shouldAlignStartVertically(t) {
            const e =
              this.requiredVerticalSpace ||
              Math.max(
                this.__oldContentHeight || 0,
                this.$.overlay.offsetHeight
              );
            this.__oldContentHeight = this.$.overlay.offsetHeight;
            const i = Math.min(
                window.innerHeight,
                document.documentElement.clientHeight
              ),
              s = "top" === this.verticalAlign;
            return this.__shouldAlignStart(
              t,
              e,
              i,
              this.__margins,
              s,
              this.noVerticalOverlap,
              ci
            );
          }
          __shouldAlignStart(t, e, i, s, r, o, n) {
            const a = i - t[o ? n.end : n.start] - s[n.end],
              l = t[o ? n.start : n.end] - s[n.start],
              h = r ? a : l;
            return r === (h > (r ? l : a) || h > e);
          }
          __adjustBottomProperty(t, e, i) {
            let s;
            if (t === e.end) {
              if (e.end === ci.end) {
                const t = Math.min(
                  window.innerHeight,
                  document.documentElement.clientHeight
                );
                if (i > t && this.__oldViewportHeight) {
                  s = i - (this.__oldViewportHeight - t);
                }
                this.__oldViewportHeight = t;
              }
              if (e.end === ui.end) {
                const t = Math.min(
                  window.innerWidth,
                  document.documentElement.clientWidth
                );
                if (i > t && this.__oldViewportWidth) {
                  s = i - (this.__oldViewportWidth - t);
                }
                this.__oldViewportWidth = t;
              }
            }
            return s;
          }
          __calculatePositionInOneDimension(t, e, i, s, r, o) {
            const n = o ? s.start : s.end,
              a = o ? s.end : s.start,
              l = parseFloat(r.style[n] || getComputedStyle(r)[n]),
              h = this.__adjustBottomProperty(n, s, l),
              d = e[o ? s.start : s.end] - t[i === o ? s.end : s.start];
            return { [n]: h ? `${h}px` : `${l + d * (o ? -1 : 1)}px`, [a]: "" };
          }
        },
      mi = (t) =>
        class extends pi(t) {
          static get observers() {
            return ["_setOverlayWidth(positionTarget, opened)"];
          }
          constructor() {
            super(), (this.requiredVerticalSpace = 200);
          }
          connectedCallback() {
            super.connectedCallback();
            const t = this._comboBox,
              e = t && t.getAttribute("dir");
            e && this.setAttribute("dir", e);
          }
          _shouldCloseOnOutsideClick(t) {
            const e = t.composedPath();
            return !e.includes(this.positionTarget) && !e.includes(this);
          }
          _updateOverlayWidth() {
            const t = this.localName;
            this.style.setProperty(
              `--_${t}-default-width`,
              `${this.positionTarget.clientWidth}px`
            );
            const e = getComputedStyle(this._comboBox).getPropertyValue(
              `--${t}-width`
            );
            "" === e
              ? this.style.removeProperty(`--${t}-width`)
              : this.style.setProperty(`--${t}-width`, e);
          }
          _setOverlayWidth(t, e) {
            t && e && (this._updateOverlayWidth(), this._updatePosition());
          }
        };
    f(
      "vaadin-combo-box-overlay",
      [
        di,
        o.iv`
  #overlay {
    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`,
      ],
      { moduleId: "vaadin-combo-box-overlay-styles" }
    );
    class fi extends mi(hi(we(C(be)))) {
      static get is() {
        return "vaadin-combo-box-overlay";
      }
      static get template() {
        return ye`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="loader"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
      }
    }
    function gi(t, e) {
      return t.split(".").reduce((t, e) => (t ? t[e] : void 0), e);
    }
    s(fi);
    let yi = 0;
    let vi = 0,
      bi = 0;
    const Ci = [];
    let xi = !1;
    const Pi = {
        after: (t) => ({
          run: (e) => window.setTimeout(e, t),
          cancel(t) {
            window.clearTimeout(t);
          },
        }),
        run: (t, e) => window.setTimeout(t, e),
        cancel(t) {
          window.clearTimeout(t);
        },
      },
      wi = {
        run: (t) => window.requestAnimationFrame(t),
        cancel(t) {
          window.cancelAnimationFrame(t);
        },
      },
      Ii = {
        run: (t) =>
          window.requestIdleCallback
            ? window.requestIdleCallback(t)
            : window.setTimeout(t, 16),
        cancel(t) {
          window.cancelIdleCallback
            ? window.cancelIdleCallback(t)
            : window.clearTimeout(t);
        },
      },
      Ei = {
        run(t) {
          xi ||
            ((xi = !0),
            queueMicrotask(() =>
              (function () {
                xi = !1;
                const t = Ci.length;
                for (let e = 0; e < t; e++) {
                  const t = Ci[e];
                  if (t)
                    try {
                      t();
                    } catch (t) {
                      setTimeout(() => {
                        throw t;
                      });
                    }
                }
                Ci.splice(0, t), (bi += t);
              })()
            )),
            Ci.push(t);
          const e = vi;
          return (vi += 1), e;
        },
        cancel(t) {
          const e = t - bi;
          if (e >= 0) {
            if (!Ci[e]) throw new Error(`invalid async handle: ${t}`);
            Ci[e] = null;
          }
        },
      },
      Si = new Set();
    class Ti {
      static debounce(t, e, i) {
        return (
          t instanceof Ti ? t._cancelAsync() : (t = new Ti()),
          t.setConfig(e, i),
          t
        );
      }
      constructor() {
        (this._asyncModule = null),
          (this._callback = null),
          (this._timer = null);
      }
      setConfig(t, e) {
        (this._asyncModule = t),
          (this._callback = e),
          (this._timer = this._asyncModule.run(() => {
            (this._timer = null), Si.delete(this), this._callback();
          }));
      }
      cancel() {
        this.isActive() && (this._cancelAsync(), Si.delete(this));
      }
      _cancelAsync() {
        this.isActive() &&
          (this._asyncModule.cancel(this._timer), (this._timer = null));
      }
      flush() {
        this.isActive() && (this.cancel(), this._callback());
      }
      isActive() {
        return null != this._timer;
      }
    }
    function Ai() {
      const t = Boolean(Si.size);
      return (
        Si.forEach((t) => {
          try {
            t.flush();
          } catch (t) {
            setTimeout(() => {
              throw t;
            });
          }
        }),
        t
      );
    }
    const Oi = () => {
        let t;
        do {
          t = Ai();
        } while (t);
      },
      ki = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/u),
      Vi = ki && ki[1] >= 8,
      Ni = {
        _ratio: 0.5,
        _scrollerPaddingTop: 0,
        _scrollPosition: 0,
        _physicalSize: 0,
        _physicalAverage: 0,
        _physicalAverageCount: 0,
        _physicalTop: 0,
        _virtualCount: 0,
        _estScrollHeight: 0,
        _scrollHeight: 0,
        _viewportHeight: 0,
        _viewportWidth: 0,
        _physicalItems: null,
        _physicalSizes: null,
        _firstVisibleIndexVal: null,
        _lastVisibleIndexVal: null,
        _maxPages: 2,
        _templateCost: 0,
        get _physicalBottom() {
          return this._physicalTop + this._physicalSize;
        },
        get _scrollBottom() {
          return this._scrollPosition + this._viewportHeight;
        },
        get _virtualEnd() {
          return this._virtualStart + this._physicalCount - 1;
        },
        get _hiddenContentSize() {
          return this._physicalSize - this._viewportHeight;
        },
        get _maxScrollTop() {
          return (
            this._estScrollHeight - this._viewportHeight + this._scrollOffset
          );
        },
        get _maxVirtualStart() {
          const t = this._virtualCount;
          return Math.max(0, t - this._physicalCount);
        },
        get _virtualStart() {
          return this._virtualStartVal || 0;
        },
        set _virtualStart(t) {
          (t = this._clamp(t, 0, this._maxVirtualStart)),
            (this._virtualStartVal = t);
        },
        get _physicalStart() {
          return this._physicalStartVal || 0;
        },
        set _physicalStart(t) {
          (t %= this._physicalCount) < 0 && (t = this._physicalCount + t),
            (this._physicalStartVal = t);
        },
        get _physicalEnd() {
          return (
            (this._physicalStart + this._physicalCount - 1) %
            this._physicalCount
          );
        },
        get _physicalCount() {
          return this._physicalCountVal || 0;
        },
        set _physicalCount(t) {
          this._physicalCountVal = t;
        },
        get _optPhysicalSize() {
          return 0 === this._viewportHeight
            ? 1 / 0
            : this._viewportHeight * this._maxPages;
        },
        get _isVisible() {
          return Boolean(this.offsetWidth || this.offsetHeight);
        },
        get firstVisibleIndex() {
          let t = this._firstVisibleIndexVal;
          if (null == t) {
            let e = this._physicalTop + this._scrollOffset;
            (t =
              this._iterateItems((t, i) => {
                if (
                  ((e += this._getPhysicalSizeIncrement(t)),
                  e > this._scrollPosition)
                )
                  return i;
              }) || 0),
              (this._firstVisibleIndexVal = t);
          }
          return t;
        },
        get lastVisibleIndex() {
          let t = this._lastVisibleIndexVal;
          if (null == t) {
            let e = this._physicalTop + this._scrollOffset;
            this._iterateItems((i, s) => {
              e < this._scrollBottom && (t = s),
                (e += this._getPhysicalSizeIncrement(i));
            }),
              (this._lastVisibleIndexVal = t);
          }
          return t;
        },
        get _scrollOffset() {
          return this._scrollerPaddingTop + this.scrollOffset;
        },
        _scrollHandler() {
          const t = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop));
          let e = t - this._scrollPosition;
          const i = e >= 0;
          if (
            ((this._scrollPosition = t),
            (this._firstVisibleIndexVal = null),
            (this._lastVisibleIndexVal = null),
            Math.abs(e) > this._physicalSize && this._physicalSize > 0)
          ) {
            e -= this._scrollOffset;
            const t = Math.round(e / this._physicalAverage);
            (this._virtualStart += t),
              (this._physicalStart += t),
              (this._physicalTop = Math.min(
                Math.floor(this._virtualStart) * this._physicalAverage,
                this._scrollPosition
              )),
              this._update();
          } else if (this._physicalCount > 0) {
            const t = this._getReusables(i);
            i
              ? ((this._physicalTop = t.physicalTop),
                (this._virtualStart += t.indexes.length),
                (this._physicalStart += t.indexes.length))
              : ((this._virtualStart -= t.indexes.length),
                (this._physicalStart -= t.indexes.length)),
              this._update(t.indexes, i ? null : t.indexes),
              this._debounce(
                "_increasePoolIfNeeded",
                this._increasePoolIfNeeded.bind(this, 0),
                Ei
              );
          }
        },
        _getReusables(t) {
          let e, i, s;
          const r = [],
            o = this._hiddenContentSize * this._ratio,
            n = this._virtualStart,
            a = this._virtualEnd,
            l = this._physicalCount;
          let h = this._physicalTop + this._scrollOffset;
          const d = this._physicalBottom + this._scrollOffset,
            c = this._scrollPosition,
            u = this._scrollBottom;
          for (
            t
              ? ((e = this._physicalStart), (i = c - h))
              : ((e = this._physicalEnd), (i = d - u));
            (s = this._getPhysicalSizeIncrement(e)),
              (i -= s),
              !(r.length >= l || i <= o);

          )
            if (t) {
              if (a + r.length + 1 >= this._virtualCount) break;
              if (h + s >= c - this._scrollOffset) break;
              r.push(e), (h += s), (e = (e + 1) % l);
            } else {
              if (n - r.length <= 0) break;
              if (h + this._physicalSize - s <= u) break;
              r.push(e), (h -= s), (e = 0 === e ? l - 1 : e - 1);
            }
          return { indexes: r, physicalTop: h - this._scrollOffset };
        },
        _update(t, e) {
          if (!((t && 0 === t.length) || 0 === this._physicalCount)) {
            if ((this._assignModels(t), this._updateMetrics(t), e))
              for (; e.length; ) {
                const t = e.pop();
                this._physicalTop -= this._getPhysicalSizeIncrement(t);
              }
            this._positionItems(), this._updateScrollerSize();
          }
        },
        _isClientFull() {
          return (
            0 !== this._scrollBottom &&
            this._physicalBottom - 1 >= this._scrollBottom &&
            this._physicalTop <= this._scrollPosition
          );
        },
        _increasePoolIfNeeded(t) {
          const e =
            this._clamp(
              this._physicalCount + t,
              3,
              this._virtualCount - this._virtualStart
            ) - this._physicalCount;
          let i = Math.round(0.5 * this._physicalCount);
          if (!(e < 0)) {
            if (e > 0) {
              const t = window.performance.now();
              [].push.apply(this._physicalItems, this._createPool(e));
              for (let t = 0; t < e; t++) this._physicalSizes.push(0);
              (this._physicalCount += e),
                this._physicalStart > this._physicalEnd &&
                  this._isIndexRendered(this._focusedVirtualIndex) &&
                  this._getPhysicalIndex(this._focusedVirtualIndex) <
                    this._physicalEnd &&
                  (this._physicalStart += e),
                this._update(),
                (this._templateCost = (window.performance.now() - t) / e),
                (i = Math.round(0.5 * this._physicalCount));
            }
            this._virtualEnd >= this._virtualCount - 1 ||
              0 === i ||
              (this._isClientFull()
                ? this._physicalSize < this._optPhysicalSize &&
                  this._debounce(
                    "_increasePoolIfNeeded",
                    this._increasePoolIfNeeded.bind(
                      this,
                      this._clamp(Math.round(50 / this._templateCost), 1, i)
                    ),
                    Ii
                  )
                : this._debounce(
                    "_increasePoolIfNeeded",
                    this._increasePoolIfNeeded.bind(this, i),
                    Ei
                  ));
          }
        },
        _render() {
          if (this.isAttached && this._isVisible)
            if (0 !== this._physicalCount) {
              const t = this._getReusables(!0);
              (this._physicalTop = t.physicalTop),
                (this._virtualStart += t.indexes.length),
                (this._physicalStart += t.indexes.length),
                this._update(t.indexes),
                this._update(),
                this._increasePoolIfNeeded(0);
            } else
              this._virtualCount > 0 &&
                (this.updateViewportBoundaries(),
                this._increasePoolIfNeeded(3));
        },
        _itemsChanged(t) {
          "items" === t.path &&
            ((this._virtualStart = 0),
            (this._physicalTop = 0),
            (this._virtualCount = this.items ? this.items.length : 0),
            (this._physicalIndexForKey = {}),
            (this._firstVisibleIndexVal = null),
            (this._lastVisibleIndexVal = null),
            this._physicalItems || (this._physicalItems = []),
            this._physicalSizes || (this._physicalSizes = []),
            (this._physicalStart = 0),
            this._scrollTop > this._scrollOffset &&
              this._resetScrollPosition(0),
            this._debounce("_render", this._render, wi));
        },
        _iterateItems(t, e) {
          let i, s, r, o;
          if (2 === arguments.length && e) {
            for (o = 0; o < e.length; o++)
              if (
                ((i = e[o]),
                (s = this._computeVidx(i)),
                null != (r = t.call(this, i, s)))
              )
                return r;
          } else {
            for (
              i = this._physicalStart, s = this._virtualStart;
              i < this._physicalCount;
              i++, s++
            )
              if (null != (r = t.call(this, i, s))) return r;
            for (i = 0; i < this._physicalStart; i++, s++)
              if (null != (r = t.call(this, i, s))) return r;
          }
        },
        _computeVidx(t) {
          return t >= this._physicalStart
            ? this._virtualStart + (t - this._physicalStart)
            : this._virtualStart +
                (this._physicalCount - this._physicalStart) +
                t;
        },
        _positionItems() {
          this._adjustScrollPosition();
          let t = this._physicalTop;
          this._iterateItems((e) => {
            this.translate3d(0, `${t}px`, 0, this._physicalItems[e]),
              (t += this._physicalSizes[e]);
          });
        },
        _getPhysicalSizeIncrement(t) {
          return this._physicalSizes[t];
        },
        _adjustScrollPosition() {
          const t =
            0 === this._virtualStart
              ? this._physicalTop
              : Math.min(this._scrollPosition + this._physicalTop, 0);
          if (0 !== t) {
            this._physicalTop -= t;
            const e = this._scrollPosition;
            !Vi && e > 0 && this._resetScrollPosition(e - t);
          }
        },
        _resetScrollPosition(t) {
          this.scrollTarget &&
            t >= 0 &&
            ((this._scrollTop = t), (this._scrollPosition = this._scrollTop));
        },
        _updateScrollerSize(t) {
          const e =
            this._physicalBottom +
            Math.max(
              this._virtualCount - this._physicalCount - this._virtualStart,
              0
            ) *
              this._physicalAverage;
          (this._estScrollHeight = e),
            (t ||
              0 === this._scrollHeight ||
              this._scrollPosition >= e - this._physicalSize ||
              Math.abs(e - this._scrollHeight) >= this._viewportHeight) &&
              ((this.$.items.style.height = `${e}px`),
              (this._scrollHeight = e));
        },
        scrollToIndex(t) {
          if ("number" != typeof t || t < 0 || t > this.items.length - 1)
            return;
          if ((Oi(), 0 === this._physicalCount)) return;
          (t = this._clamp(t, 0, this._virtualCount - 1)),
            (!this._isIndexRendered(t) || t >= this._maxVirtualStart) &&
              (this._virtualStart = t - 1),
            this._assignModels(),
            this._updateMetrics(),
            (this._physicalTop = this._virtualStart * this._physicalAverage);
          let e = this._physicalStart,
            i = this._virtualStart,
            s = 0;
          const r = this._hiddenContentSize;
          for (; i < t && s <= r; )
            (s += this._getPhysicalSizeIncrement(e)),
              (e = (e + 1) % this._physicalCount),
              (i += 1);
          this._updateScrollerSize(!0),
            this._positionItems(),
            this._resetScrollPosition(
              this._physicalTop + this._scrollOffset + s
            ),
            this._increasePoolIfNeeded(0),
            (this._firstVisibleIndexVal = null),
            (this._lastVisibleIndexVal = null);
        },
        _resetAverage() {
          (this._physicalAverage = 0), (this._physicalAverageCount = 0);
        },
        _resizeHandler() {
          this._debounce(
            "_render",
            () => {
              (this._firstVisibleIndexVal = null),
                (this._lastVisibleIndexVal = null),
                this._isVisible
                  ? (this.updateViewportBoundaries(),
                    this.toggleScrollListener(!0),
                    this._resetAverage(),
                    this._render())
                  : this.toggleScrollListener(!1);
            },
            wi
          );
        },
        _isIndexRendered(t) {
          return t >= this._virtualStart && t <= this._virtualEnd;
        },
        _getPhysicalIndex(t) {
          return (
            (this._physicalStart + (t - this._virtualStart)) %
            this._physicalCount
          );
        },
        _clamp: (t, e, i) => Math.min(i, Math.max(e, t)),
        _debounce(t, e, i) {
          var s;
          this._debouncers || (this._debouncers = {}),
            (this._debouncers[t] = Ti.debounce(
              this._debouncers[t],
              i,
              e.bind(this)
            )),
            (s = this._debouncers[t]),
            Si.add(s);
        },
      },
      Li = 1e3;
    class zi {
      constructor({
        createElements: t,
        updateElement: e,
        scrollTarget: i,
        scrollContainer: s,
        elementsContainer: r,
        reorderElements: o,
      }) {
        (this.isAttached = !0),
          (this._vidxOffset = 0),
          (this.createElements = t),
          (this.updateElement = e),
          (this.scrollTarget = i),
          (this.scrollContainer = s),
          (this.elementsContainer = r || s),
          (this.reorderElements = o),
          (this._maxPages = 1.3),
          (this.__placeholderHeight = 200),
          (this.__elementHeightQueue = Array(10)),
          (this.timeouts = {
            SCROLL_REORDER: 500,
            IGNORE_WHEEL: 500,
            FIX_INVALID_ITEM_POSITIONING: 100,
          }),
          (this.__resizeObserver = new ResizeObserver(() =>
            this._resizeHandler()
          )),
          "visible" === getComputedStyle(this.scrollTarget).overflow &&
            (this.scrollTarget.style.overflow = "auto"),
          "static" === getComputedStyle(this.scrollContainer).position &&
            (this.scrollContainer.style.position = "relative"),
          this.__resizeObserver.observe(this.scrollTarget),
          this.scrollTarget.addEventListener("scroll", () =>
            this._scrollHandler()
          ),
          (this._scrollLineHeight = this._getScrollLineHeight()),
          this.scrollTarget.addEventListener("wheel", (t) => this.__onWheel(t)),
          this.reorderElements &&
            (this.scrollTarget.addEventListener("mousedown", () => {
              this.__mouseDown = !0;
            }),
            this.scrollTarget.addEventListener("mouseup", () => {
              (this.__mouseDown = !1),
                this.__pendingReorder && this.__reorderElements();
            }));
      }
      get scrollOffset() {
        return 0;
      }
      get adjustedFirstVisibleIndex() {
        return this.firstVisibleIndex + this._vidxOffset;
      }
      get adjustedLastVisibleIndex() {
        return this.lastVisibleIndex + this._vidxOffset;
      }
      __hasPlaceholders() {
        return this.__getVisibleElements().some(
          (t) => t.__virtualizerPlaceholder
        );
      }
      scrollToIndex(t) {
        if (
          "number" != typeof t ||
          isNaN(t) ||
          0 === this.size ||
          !this.scrollTarget.offsetHeight
        )
          return;
        delete this.__pendingScrollToIndex,
          this._physicalCount <= 3 && this.flush(),
          (t = this._clamp(t, 0, this.size - 1));
        const e = this.__getVisibleElements().length;
        let i = Math.floor((t / this.size) * this._virtualCount);
        this._virtualCount - i < e
          ? ((i = this._virtualCount - (this.size - t)),
            (this._vidxOffset = this.size - this._virtualCount))
          : i < e
          ? t < Li
            ? ((i = t), (this._vidxOffset = 0))
            : ((i = Li), (this._vidxOffset = t - i))
          : (this._vidxOffset = t - i),
          (this.__skipNextVirtualIndexAdjust = !0),
          super.scrollToIndex(i),
          this.adjustedFirstVisibleIndex !== t &&
            this._scrollTop < this._maxScrollTop &&
            !this.grid &&
            (this._scrollTop -= this.__getIndexScrollOffset(t) || 0),
          this._scrollHandler(),
          this.__hasPlaceholders() && (this.__pendingScrollToIndex = t);
      }
      flush() {
        const t = this._physicalCount;
        0 !== this.scrollTarget.offsetHeight &&
          (this._resizeHandler(),
          Oi(),
          this._scrollHandler(),
          this.__fixInvalidItemPositioningDebouncer &&
            this.__fixInvalidItemPositioningDebouncer.flush(),
          this.__scrollReorderDebouncer &&
            this.__scrollReorderDebouncer.flush(),
          this.__debouncerWheelAnimationFrame &&
            this.__debouncerWheelAnimationFrame.flush(),
          this._physicalCount !== t && this.flush());
      }
      update(t = 0, e = this.size - 1) {
        const i = [];
        this.__getVisibleElements().forEach((s) => {
          s.__virtualIndex >= t &&
            s.__virtualIndex <= e &&
            (this.__updateElement(s, s.__virtualIndex, !0), i.push(s));
        }),
          this.__afterElementsUpdated(i);
      }
      _updateMetrics(t) {
        Oi();
        let e = 0,
          i = 0;
        const s = this._physicalAverageCount,
          r = this._physicalAverage;
        this._iterateItems((t, s) => {
          (i += this._physicalSizes[t]),
            (this._physicalSizes[t] = Math.ceil(
              this.__getBorderBoxHeight(this._physicalItems[t])
            )),
            (e += this._physicalSizes[t]),
            (this._physicalAverageCount += this._physicalSizes[t] ? 1 : 0);
        }, t),
          (this._physicalSize = this._physicalSize + e - i),
          this._physicalAverageCount !== s &&
            (this._physicalAverage = Math.round(
              (r * s + e) / this._physicalAverageCount
            ));
      }
      __getBorderBoxHeight(t) {
        const e = getComputedStyle(t),
          i = parseFloat(e.height) || 0;
        if ("border-box" === e.boxSizing) return i;
        return (
          i +
          (parseFloat(e.paddingBottom) || 0) +
          (parseFloat(e.paddingTop) || 0) +
          (parseFloat(e.borderBottomWidth) || 0) +
          (parseFloat(e.borderTopWidth) || 0)
        );
      }
      __updateElement(t, e, i) {
        t.__virtualizerPlaceholder &&
          ((t.style.paddingTop = ""), (t.__virtualizerPlaceholder = !1)),
          this.__preventElementUpdates ||
            (t.__lastUpdatedIndex === e && !i) ||
            (this.updateElement(t, e), (t.__lastUpdatedIndex = e));
      }
      __afterElementsUpdated(t) {
        t.forEach((t) => {
          const e = t.offsetHeight;
          if (0 === e)
            (t.style.paddingTop = `${this.__placeholderHeight}px`),
              (t.__virtualizerPlaceholder = !0),
              (this.__placeholderClearDebouncer = Ti.debounce(
                this.__placeholderClearDebouncer,
                wi,
                () => this._resizeHandler()
              ));
          else {
            this.__elementHeightQueue.push(e),
              this.__elementHeightQueue.shift();
            const t = this.__elementHeightQueue.filter((t) => void 0 !== t);
            this.__placeholderHeight = Math.round(
              t.reduce((t, e) => t + e, 0) / t.length
            );
          }
        }),
          void 0 === this.__pendingScrollToIndex ||
            this.__hasPlaceholders() ||
            this.scrollToIndex(this.__pendingScrollToIndex);
      }
      __getIndexScrollOffset(t) {
        const e = this.__getVisibleElements().find(
          (e) => e.__virtualIndex === t
        );
        return e
          ? this.scrollTarget.getBoundingClientRect().top -
              e.getBoundingClientRect().top
          : void 0;
      }
      get size() {
        return this.__size;
      }
      set size(t) {
        t !== this.size &&
          (this.__fixInvalidItemPositioningDebouncer &&
            this.__fixInvalidItemPositioningDebouncer.cancel(),
          this._debouncers &&
            this._debouncers._increasePoolIfNeeded &&
            this._debouncers._increasePoolIfNeeded.cancel(),
          (this.__size = t),
          this._physicalItems
            ? (this._updateScrollerSize(),
              (this._virtualCount = this.items.length),
              this._render())
            : (this._itemsChanged({ path: "items" }),
              (this.__preventElementUpdates = !0),
              Oi(),
              (this.__preventElementUpdates = !1)),
          this._isVisible || this._assignModels(),
          this.elementsContainer.children.length ||
            requestAnimationFrame(() => this._resizeHandler()),
          this._resizeHandler(),
          Oi());
      }
      get _scrollTop() {
        return this.scrollTarget.scrollTop;
      }
      set _scrollTop(t) {
        this.scrollTarget.scrollTop = t;
      }
      get items() {
        return { length: Math.min(this.size, 1e5) };
      }
      get offsetHeight() {
        return this.scrollTarget.offsetHeight;
      }
      get $() {
        return { items: this.scrollContainer };
      }
      updateViewportBoundaries() {
        const t = window.getComputedStyle(this.scrollTarget);
        (this._scrollerPaddingTop =
          this.scrollTarget === this ? 0 : parseInt(t["padding-top"], 10)),
          (this._isRTL = Boolean("rtl" === t.direction)),
          (this._viewportWidth = this.elementsContainer.offsetWidth),
          (this._viewportHeight = this.scrollTarget.offsetHeight),
          (this._scrollPageHeight =
            this._viewportHeight - this._scrollLineHeight),
          this.grid && this._updateGridMetrics();
      }
      setAttribute() {}
      _createPool(t) {
        const e = this.createElements(t),
          i = document.createDocumentFragment();
        return (
          e.forEach((t) => {
            (t.style.position = "absolute"),
              i.appendChild(t),
              this.__resizeObserver.observe(t);
          }),
          this.elementsContainer.appendChild(i),
          e
        );
      }
      _assignModels(t) {
        const e = [];
        this._iterateItems((t, i) => {
          const s = this._physicalItems[t];
          (s.hidden = i >= this.size),
            s.hidden
              ? delete s.__lastUpdatedIndex
              : ((s.__virtualIndex = i + (this._vidxOffset || 0)),
                this.__updateElement(s, s.__virtualIndex),
                e.push(s));
        }, t),
          this.__afterElementsUpdated(e);
      }
      _isClientFull() {
        return (
          setTimeout(() => {
            this.__clientFull = !0;
          }),
          this.__clientFull || super._isClientFull()
        );
      }
      translate3d(t, e, i, s) {
        s.style.transform = `translateY(${e})`;
      }
      toggleScrollListener() {}
      _scrollHandler() {
        if (0 === this.scrollTarget.offsetHeight) return;
        this._adjustVirtualIndexOffset(
          this._scrollTop - (this.__previousScrollTop || 0)
        );
        const t = this.scrollTarget.scrollTop - this._scrollPosition;
        if ((super._scrollHandler(), 0 !== this._physicalCount)) {
          const e = t >= 0,
            i = this._getReusables(!e);
          i.indexes.length &&
            ((this._physicalTop = i.physicalTop),
            e
              ? ((this._virtualStart -= i.indexes.length),
                (this._physicalStart -= i.indexes.length))
              : ((this._virtualStart += i.indexes.length),
                (this._physicalStart += i.indexes.length)),
            this._resizeHandler());
        }
        t &&
          (this.__fixInvalidItemPositioningDebouncer = Ti.debounce(
            this.__fixInvalidItemPositioningDebouncer,
            Pi.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),
            () => this.__fixInvalidItemPositioning()
          )),
          this.reorderElements &&
            (this.__scrollReorderDebouncer = Ti.debounce(
              this.__scrollReorderDebouncer,
              Pi.after(this.timeouts.SCROLL_REORDER),
              () => this.__reorderElements()
            )),
          (this.__previousScrollTop = this._scrollTop),
          0 === this._scrollTop &&
            0 !== this.firstVisibleIndex &&
            Math.abs(t) > 0 &&
            this.scrollToIndex(0);
      }
      __fixInvalidItemPositioning() {
        if (!this.scrollTarget.isConnected) return;
        const t = this._physicalTop > this._scrollTop,
          e = this._physicalBottom < this._scrollBottom,
          i = 0 === this.adjustedFirstVisibleIndex,
          s = this.adjustedLastVisibleIndex === this.size - 1;
        if ((t && !i) || (e && !s)) {
          const t = e,
            i = this._ratio;
          (this._ratio = 0),
            (this._scrollPosition = this._scrollTop + (t ? -1 : 1)),
            this._scrollHandler(),
            (this._ratio = i);
        }
      }
      __onWheel(t) {
        if (
          t.ctrlKey ||
          this._hasScrolledAncestor(t.target, t.deltaX, t.deltaY)
        )
          return;
        let e = t.deltaY;
        if (
          (t.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? (e *= this._scrollLineHeight)
            : t.deltaMode === WheelEvent.DOM_DELTA_PAGE &&
              (e *= this._scrollPageHeight),
          this._deltaYAcc || (this._deltaYAcc = 0),
          this._wheelAnimationFrame)
        )
          return (this._deltaYAcc += e), void t.preventDefault();
        (e += this._deltaYAcc),
          (this._deltaYAcc = 0),
          (this._wheelAnimationFrame = !0),
          (this.__debouncerWheelAnimationFrame = Ti.debounce(
            this.__debouncerWheelAnimationFrame,
            wi,
            () => {
              this._wheelAnimationFrame = !1;
            }
          ));
        const i = Math.abs(t.deltaX) + Math.abs(e);
        this._canScroll(this.scrollTarget, t.deltaX, e)
          ? (t.preventDefault(),
            (this.scrollTarget.scrollTop += e),
            (this.scrollTarget.scrollLeft += t.deltaX),
            (this._hasResidualMomentum = !0),
            (this._ignoreNewWheel = !0),
            (this._debouncerIgnoreNewWheel = Ti.debounce(
              this._debouncerIgnoreNewWheel,
              Pi.after(this.timeouts.IGNORE_WHEEL),
              () => {
                this._ignoreNewWheel = !1;
              }
            )))
          : (this._hasResidualMomentum && i <= this._previousMomentum) ||
            this._ignoreNewWheel
          ? t.preventDefault()
          : i > this._previousMomentum && (this._hasResidualMomentum = !1),
          (this._previousMomentum = i);
      }
      _hasScrolledAncestor(t, e, i) {
        return (
          t !== this.scrollTarget &&
          t !== this.scrollTarget.getRootNode().host &&
          (!(
            !this._canScroll(t, e, i) ||
            -1 === ["auto", "scroll"].indexOf(getComputedStyle(t).overflow)
          ) ||
            (t !== this && t.parentElement
              ? this._hasScrolledAncestor(t.parentElement, e, i)
              : void 0))
        );
      }
      _canScroll(t, e, i) {
        return (
          (i > 0 && t.scrollTop < t.scrollHeight - t.offsetHeight) ||
          (i < 0 && t.scrollTop > 0) ||
          (e > 0 && t.scrollLeft < t.scrollWidth - t.offsetWidth) ||
          (e < 0 && t.scrollLeft > 0)
        );
      }
      _increasePoolIfNeeded(t) {
        if (this._physicalCount > 2 && t) {
          const e =
            Math.ceil(this._optPhysicalSize / this._physicalAverage) -
            this._physicalCount;
          super._increasePoolIfNeeded(Math.max(t, Math.min(100, e)));
        } else super._increasePoolIfNeeded(t);
      }
      _getScrollLineHeight() {
        const t = document.createElement("div");
        (t.style.fontSize = "initial"),
          (t.style.display = "none"),
          document.body.appendChild(t);
        const e = window.getComputedStyle(t).fontSize;
        return document.body.removeChild(t), e ? window.parseInt(e) : void 0;
      }
      __getVisibleElements() {
        return Array.from(this.elementsContainer.children).filter(
          (t) => !t.hidden
        );
      }
      __reorderElements() {
        if (this.__mouseDown) return void (this.__pendingReorder = !0);
        this.__pendingReorder = !1;
        const t = this._virtualStart + (this._vidxOffset || 0),
          e = this.__getVisibleElements(),
          i =
            e.find(
              (t) =>
                t.contains(
                  this.elementsContainer.getRootNode().activeElement
                ) || t.contains(this.scrollTarget.getRootNode().activeElement)
            ) || e[0];
        if (!i) return;
        const s = i.__virtualIndex - t,
          r = e.indexOf(i) - s;
        if (r > 0)
          for (let t = 0; t < r; t++) this.elementsContainer.appendChild(e[t]);
        else if (r < 0)
          for (let t = e.length + r; t < e.length; t++)
            this.elementsContainer.insertBefore(e[t], e[0]);
        if (Fe) {
          const { transform: t } = this.scrollTarget.style;
          (this.scrollTarget.style.transform = "translateZ(0)"),
            setTimeout(() => {
              this.scrollTarget.style.transform = t;
            });
        }
      }
      _adjustVirtualIndexOffset(t) {
        if (this._virtualCount >= this.size) this._vidxOffset = 0;
        else if (this.__skipNextVirtualIndexAdjust)
          this.__skipNextVirtualIndexAdjust = !1;
        else if (Math.abs(t) > 1e4) {
          const t =
              this._scrollTop /
              (this.scrollTarget.scrollHeight - this.scrollTarget.offsetHeight),
            e = t * this.size;
          this._vidxOffset = Math.round(e - t * this._virtualCount);
        } else {
          const t = this._vidxOffset,
            e = Li,
            i = 100;
          0 === this._scrollTop
            ? ((this._vidxOffset = 0),
              t !== this._vidxOffset && super.scrollToIndex(0))
            : this.firstVisibleIndex < e &&
              this._vidxOffset > 0 &&
              ((this._vidxOffset -= Math.min(this._vidxOffset, i)),
              super.scrollToIndex(
                this.firstVisibleIndex + (t - this._vidxOffset)
              ));
          const s = this.size - this._virtualCount;
          this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0
            ? ((this._vidxOffset = s),
              t !== this._vidxOffset &&
                super.scrollToIndex(this._virtualCount - 1))
            : this.firstVisibleIndex > this._virtualCount - e &&
              this._vidxOffset < s &&
              ((this._vidxOffset += Math.min(s - this._vidxOffset, i)),
              super.scrollToIndex(
                this.firstVisibleIndex - (this._vidxOffset - t)
              ));
        }
      }
    }
    Object.setPrototypeOf(zi.prototype, Ni);
    class Ri {
      constructor(t) {
        this.__adapter = new zi(t);
      }
      get firstVisibleIndex() {
        return this.__adapter.adjustedFirstVisibleIndex;
      }
      get lastVisibleIndex() {
        return this.__adapter.adjustedLastVisibleIndex;
      }
      get size() {
        return this.__adapter.size;
      }
      set size(t) {
        this.__adapter.size = t;
      }
      scrollToIndex(t) {
        this.__adapter.scrollToIndex(t);
      }
      update(t = 0, e = this.size - 1) {
        this.__adapter.update(t, e);
      }
      flush() {
        this.__adapter.flush();
      }
    }
    const Mi = class {
        toString() {
          return "";
        }
      },
      Fi = (t) =>
        class extends t {
          static get properties() {
            return {
              items: { type: Array, observer: "__itemsChanged" },
              focusedIndex: { type: Number, observer: "__focusedIndexChanged" },
              loading: { type: Boolean, observer: "__loadingChanged" },
              opened: { type: Boolean, observer: "__openedChanged" },
              selectedItem: { type: Object, observer: "__selectedItemChanged" },
              itemIdPath: { type: String },
              owner: { type: Object },
              getItemLabel: { type: Object },
              renderer: { type: Object, observer: "__rendererChanged" },
              theme: { type: String },
            };
          }
          constructor() {
            super(), (this.__boundOnItemClick = this.__onItemClick.bind(this));
          }
          get _viewportTotalPaddingBottom() {
            if (void 0 === this._cachedViewportTotalPaddingBottom) {
              const t = window.getComputedStyle(this.$.selector);
              this._cachedViewportTotalPaddingBottom = [
                t.paddingBottom,
                t.borderBottomWidth,
              ]
                .map((t) => parseInt(t, 10))
                .reduce((t, e) => t + e);
            }
            return this._cachedViewportTotalPaddingBottom;
          }
          ready() {
            super.ready(),
              this.setAttribute("role", "listbox"),
              (this.id = `${this.localName}-${yi++}`),
              (this.__hostTagName = this.constructor.is.replace(
                "-scroller",
                ""
              )),
              this.addEventListener("click", (t) => t.stopPropagation()),
              this.__patchWheelOverScrolling(),
              (this.__virtualizer = new Ri({
                createElements: this.__createElements.bind(this),
                updateElement: this._updateElement.bind(this),
                elementsContainer: this,
                scrollTarget: this,
                scrollContainer: this.$.selector,
              }));
          }
          requestContentUpdate() {
            this.__virtualizer && this.__virtualizer.update();
          }
          scrollIntoView(t) {
            if (!(this.opened && t >= 0)) return;
            const e = this._visibleItemsCount();
            let i = t;
            t > this.__virtualizer.lastVisibleIndex - 1
              ? (this.__virtualizer.scrollToIndex(t), (i = t - e + 1))
              : t > this.__virtualizer.firstVisibleIndex &&
                (i = this.__virtualizer.firstVisibleIndex),
              this.__virtualizer.scrollToIndex(Math.max(0, i));
            const s = [...this.children].find(
              (t) =>
                !t.hidden && t.index === this.__virtualizer.lastVisibleIndex
            );
            if (!s || t !== s.index) return;
            const r = s.getBoundingClientRect(),
              o = this.getBoundingClientRect(),
              n = r.bottom - o.bottom + this._viewportTotalPaddingBottom;
            n > 0 && (this.scrollTop += n);
          }
          _isItemSelected(t, e, i) {
            return (
              !(t instanceof Mi) &&
              (i && void 0 !== t && void 0 !== e
                ? gi(i, t) === gi(i, e)
                : t === e)
            );
          }
          __itemsChanged(t) {
            this.__virtualizer &&
              t &&
              ((this.__virtualizer.size = t.length),
              this.__virtualizer.flush(),
              this.requestContentUpdate());
          }
          __loadingChanged() {
            this.requestContentUpdate();
          }
          __openedChanged(t) {
            t && this.requestContentUpdate();
          }
          __selectedItemChanged() {
            this.requestContentUpdate();
          }
          __focusedIndexChanged(t, e) {
            t !== e && this.requestContentUpdate(),
              t >= 0 && !this.loading && this.scrollIntoView(t);
          }
          __rendererChanged(t, e) {
            (t || e) && this.requestContentUpdate();
          }
          __createElements(t) {
            return [...Array(t)].map(() => {
              const t = document.createElement(`${this.__hostTagName}-item`);
              return (
                t.addEventListener("click", this.__boundOnItemClick),
                (t.tabIndex = "-1"),
                (t.style.width = "100%"),
                t
              );
            });
          }
          _updateElement(t, e) {
            const i = this.items[e],
              s = this.focusedIndex,
              r = this._isItemSelected(i, this.selectedItem, this.itemIdPath);
            t.setProperties({
              item: i,
              index: e,
              label: this.getItemLabel(i),
              selected: r,
              renderer: this.renderer,
              focused: !this.loading && s === e,
            }),
              (t.id = `${this.__hostTagName}-item-${e}`),
              t.setAttribute("role", void 0 !== e && "option"),
              t.setAttribute("aria-selected", r.toString()),
              t.setAttribute("aria-posinset", e + 1),
              t.setAttribute("aria-setsize", this.items.length),
              this.theme
                ? t.setAttribute("theme", this.theme)
                : t.removeAttribute("theme"),
              i instanceof Mi && this.__requestItemByIndex(e);
          }
          __onItemClick(t) {
            this.dispatchEvent(
              new CustomEvent("selection-changed", {
                detail: { item: t.currentTarget.item },
              })
            );
          }
          __patchWheelOverScrolling() {
            this.$.selector.addEventListener("wheel", (t) => {
              const e = 0 === this.scrollTop,
                i = this.scrollHeight - this.scrollTop - this.clientHeight <= 1;
              ((e && t.deltaY < 0) || (i && t.deltaY > 0)) &&
                t.preventDefault();
            });
          }
          __requestItemByIndex(t) {
            requestAnimationFrame(() => {
              this.dispatchEvent(
                new CustomEvent("index-requested", {
                  detail: {
                    index: t,
                    currentScrollerPos: this._oldScrollerPosition,
                  },
                })
              );
            });
          }
          _visibleItemsCount() {
            this.__virtualizer.scrollToIndex(
              this.__virtualizer.firstVisibleIndex
            );
            return this.__virtualizer.size > 0
              ? this.__virtualizer.lastVisibleIndex -
                  this.__virtualizer.firstVisibleIndex +
                  1
              : 0;
          }
        };
    class Di extends Fi(be) {
      static get is() {
        return "vaadin-combo-box-scroller";
      }
      static get template() {
        return ye`
      <style>
        :host {
          display: block;
          min-height: 1px;
          overflow: auto;

          /* Fixes item background from getting on top of scrollbars on Safari */
          transform: translate3d(0, 0, 0);

          /* Enable momentum scrolling on iOS */
          -webkit-overflow-scrolling: touch;

          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
          box-shadow: 0 0 0 white;
        }

        #selector {
          border-width: var(--_vaadin-combo-box-items-container-border-width);
          border-style: var(--_vaadin-combo-box-items-container-border-style);
          border-color: var(--_vaadin-combo-box-items-container-border-color, transparent);
          position: relative;
        }
      </style>
      <div id="selector">
        <slot></slot>
      </div>
    `;
      }
    }
    s(Di);
    const Hi = T(
        (t) =>
          class extends t {
            static get properties() {
              return {
                invalid: {
                  type: Boolean,
                  reflectToAttribute: !0,
                  notify: !0,
                  value: !1,
                },
                required: { type: Boolean, reflectToAttribute: !0 },
              };
            }
            validate() {
              const t = this.checkValidity();
              return (
                this._setInvalid(!t),
                this.dispatchEvent(
                  new CustomEvent("validated", { detail: { valid: t } })
                ),
                t
              );
            }
            checkValidity() {
              return !this.required || !!this.value;
            }
            _setInvalid(t) {
              this._shouldSetInvalid(t) && (this.invalid = t);
            }
            _shouldSetInvalid(t) {
              return !0;
            }
          }
      ),
      Bi = (t) =>
        class extends t {
          static get properties() {
            return {
              pageSize: {
                type: Number,
                value: 50,
                observer: "_pageSizeChanged",
              },
              size: { type: Number, observer: "_sizeChanged" },
              dataProvider: { type: Object, observer: "_dataProviderChanged" },
              _pendingRequests: { value: () => ({}) },
              __placeHolder: { value: new Mi() },
              __previousDataProviderFilter: { type: String },
            };
          }
          static get observers() {
            return [
              "_dataProviderFilterChanged(filter)",
              "_warnDataProviderValue(dataProvider, value)",
              "_ensureFirstPage(opened)",
            ];
          }
          ready() {
            super.ready(),
              this._scroller.addEventListener("index-requested", (t) => {
                const e = t.detail.index,
                  i = t.detail.currentScrollerPos,
                  s = Math.floor(1.5 * this.pageSize);
                if (!this._shouldSkipIndex(e, s, i) && void 0 !== e) {
                  const t = this._getPageForIndex(e);
                  this._shouldLoadPage(t) && this._loadPage(t);
                }
              });
          }
          _dataProviderFilterChanged(t) {
            void 0 !== this.__previousDataProviderFilter || "" !== t
              ? this.__previousDataProviderFilter !== t &&
                ((this.__previousDataProviderFilter = t),
                (this._pendingRequests = {}),
                (this.loading = this._shouldFetchData()),
                (this.size = void 0),
                this.clearCache())
              : (this.__previousDataProviderFilter = t);
          }
          _shouldFetchData() {
            return (
              !!this.dataProvider &&
              (this.opened || (this.filter && this.filter.length))
            );
          }
          _ensureFirstPage(t) {
            t && this._shouldLoadPage(0) && this._loadPage(0);
          }
          _shouldSkipIndex(t, e, i) {
            return 0 !== i && t >= i - e && t <= i + e;
          }
          _shouldLoadPage(t) {
            if (!this.filteredItems || this._forceNextRequest)
              return (this._forceNextRequest = !1), !0;
            const e = this.filteredItems[t * this.pageSize];
            return void 0 !== e ? e instanceof Mi : void 0 === this.size;
          }
          _loadPage(t) {
            if (this._pendingRequests[t] || !this.dataProvider) return;
            const e = { page: t, pageSize: this.pageSize, filter: this.filter },
              i = (s, r) => {
                if (this._pendingRequests[t] !== i) return;
                const o = this.filteredItems ? [...this.filteredItems] : [];
                o.splice(e.page * e.pageSize, s.length, ...s),
                  (this.filteredItems = o),
                  this.opened || this._isInputFocused() || this._commitValue(),
                  void 0 !== r && (this.size = r),
                  delete this._pendingRequests[t],
                  0 === Object.keys(this._pendingRequests).length &&
                    (this.loading = !1);
              };
            (this._pendingRequests[t] = i),
              (this.loading = !0),
              this.dataProvider(e, i);
          }
          _getPageForIndex(t) {
            return Math.floor(t / this.pageSize);
          }
          clearCache() {
            if (!this.dataProvider) return;
            this._pendingRequests = {};
            const t = [];
            for (let e = 0; e < (this.size || 0); e++)
              t.push(this.__placeHolder);
            (this.filteredItems = t),
              this._shouldFetchData()
                ? ((this._forceNextRequest = !1), this._loadPage(0))
                : (this._forceNextRequest = !0);
          }
          _sizeChanged(t = 0) {
            const e = (this.filteredItems || []).slice(0, t);
            for (let i = 0; i < t; i++)
              e[i] = void 0 !== e[i] ? e[i] : this.__placeHolder;
            (this.filteredItems = e), this._flushPendingRequests(t);
          }
          _pageSizeChanged(t, e) {
            if (Math.floor(t) !== t || t < 1)
              throw (
                ((this.pageSize = e),
                new Error("`pageSize` value must be an integer > 0"))
              );
            this.clearCache();
          }
          _dataProviderChanged(t, e) {
            this._ensureItemsOrDataProvider(() => {
              this.dataProvider = e;
            }),
              this.clearCache();
          }
          _ensureItemsOrDataProvider(t) {
            if (void 0 !== this.items && void 0 !== this.dataProvider)
              throw (
                (t(),
                new Error(
                  "Using `items` and `dataProvider` together is not supported"
                ))
              );
            this.dataProvider &&
              !this.filteredItems &&
              (this.filteredItems = []);
          }
          _warnDataProviderValue(t, e) {
            if (
              t &&
              "" !== e &&
              (void 0 === this.selectedItem || null === this.selectedItem)
            ) {
              const t = this.__getItemIndexByValue(this.filteredItems, e);
              (t < 0 || !this._getItemLabel(this.filteredItems[t])) &&
                console.warn(
                  "Warning: unable to determine the label for the provided `value`. Nothing to display in the text field. This usually happens when setting an initial `value` before any items are returned from the `dataProvider` callback. Consider setting `selectedItem` instead of `value`"
                );
            }
          }
          _flushPendingRequests(t) {
            if (this._pendingRequests) {
              const e = Math.ceil(t / this.pageSize);
              Object.entries(this._pendingRequests).forEach(([i, s]) => {
                parseInt(i) >= e && s([], t);
              });
            }
          }
        },
      $i = T(
        (t) =>
          class extends t {
            static get properties() {
              return {
                disabled: {
                  type: Boolean,
                  value: !1,
                  observer: "_disabledChanged",
                  reflectToAttribute: !0,
                },
              };
            }
            _disabledChanged(t) {
              this._setAriaDisabled(t);
            }
            _setAriaDisabled(t) {
              t
                ? this.setAttribute("aria-disabled", "true")
                : this.removeAttribute("aria-disabled");
            }
            click() {
              this.disabled || super.click();
            }
          }
      ),
      ji = T(
        (t) =>
          class extends t {
            get _keyboardActive() {
              return Ge;
            }
            ready() {
              this.addEventListener("focusin", (t) => {
                this._shouldSetFocus(t) && this._setFocused(!0);
              }),
                this.addEventListener("focusout", (t) => {
                  this._shouldRemoveFocus(t) && this._setFocused(!1);
                }),
                super.ready();
            }
            disconnectedCallback() {
              super.disconnectedCallback(),
                this.hasAttribute("focused") && this._setFocused(!1);
            }
            _setFocused(t) {
              this.toggleAttribute("focused", t),
                this.toggleAttribute("focus-ring", t && this._keyboardActive);
            }
            _shouldSetFocus(t) {
              return !0;
            }
            _shouldRemoveFocus(t) {
              return !0;
            }
          }
      ),
      qi = T(
        (t) =>
          class extends t {
            ready() {
              super.ready(),
                this.addEventListener("keydown", (t) => {
                  this._onKeyDown(t);
                }),
                this.addEventListener("keyup", (t) => {
                  this._onKeyUp(t);
                });
            }
            _onKeyDown(t) {
              switch (t.key) {
                case "Enter":
                  this._onEnter(t);
                  break;
                case "Escape":
                  this._onEscape(t);
              }
            }
            _onKeyUp(t) {}
            _onEnter(t) {}
            _onEscape(t) {}
          }
      ),
      Ui = (t) =>
        class extends t {
          static get properties() {
            return {
              overlayClass: { type: String },
              _overlayElement: { type: Object },
            };
          }
          static get observers() {
            return ["__updateOverlayClassNames(overlayClass, _overlayElement)"];
          }
          __updateOverlayClassNames(t, e) {
            if (!e) return;
            if (void 0 === t) return;
            const { classList: i } = e;
            if (
              (this.__initialClasses || (this.__initialClasses = new Set(i)),
              Array.isArray(this.__previousClasses))
            ) {
              const t = this.__previousClasses.filter(
                (t) => !this.__initialClasses.has(t)
              );
              t.length > 0 && i.remove(...t);
            }
            const s = "string" == typeof t ? t.split(" ") : [];
            s.length > 0 && i.add(...s), (this.__previousClasses = s);
          }
        };
    const Wi = T(
      (t) =>
        class extends t {
          static get properties() {
            return {
              inputElement: {
                type: Object,
                readOnly: !0,
                observer: "_inputElementChanged",
              },
              type: { type: String, readOnly: !0 },
              value: {
                type: String,
                value: "",
                observer: "_valueChanged",
                notify: !0,
                sync: !0,
              },
              _hasInputValue: {
                type: Boolean,
                value: !1,
                observer: "_hasInputValueChanged",
              },
            };
          }
          constructor() {
            super(),
              (this._boundOnInput = this.__onInput.bind(this)),
              (this._boundOnChange = this._onChange.bind(this));
          }
          get _hasValue() {
            return null != this.value && "" !== this.value;
          }
          get _inputElementValueProperty() {
            return "value";
          }
          get _inputElementValue() {
            return this.inputElement
              ? this.inputElement[this._inputElementValueProperty]
              : void 0;
          }
          set _inputElementValue(t) {
            this.inputElement &&
              (this.inputElement[this._inputElementValueProperty] = t);
          }
          clear() {
            (this._hasInputValue = !1),
              (this.value = ""),
              (this._inputElementValue = "");
          }
          _addInputListeners(t) {
            t.addEventListener("input", this._boundOnInput),
              t.addEventListener("change", this._boundOnChange);
          }
          _removeInputListeners(t) {
            t.removeEventListener("input", this._boundOnInput),
              t.removeEventListener("change", this._boundOnChange);
          }
          _forwardInputValue(t) {
            this.inputElement && (this._inputElementValue = null != t ? t : "");
          }
          _inputElementChanged(t, e) {
            t ? this._addInputListeners(t) : e && this._removeInputListeners(e);
          }
          _hasInputValueChanged(t, e) {
            (t || e) &&
              this.dispatchEvent(new CustomEvent("has-input-value-changed"));
          }
          __onInput(t) {
            this._setHasInputValue(t), this._onInput(t);
          }
          _onInput(t) {
            const e = t.composedPath()[0];
            (this.__userInput = t.isTrusted),
              (this.value = e.value),
              (this.__userInput = !1);
          }
          _onChange(t) {}
          _toggleHasValue(t) {
            this.toggleAttribute("has-value", t);
          }
          _valueChanged(t, e) {
            this._toggleHasValue(this._hasValue),
              ("" === t && void 0 === e) ||
                this.__userInput ||
                this._forwardInputValue(t);
          }
          _setHasInputValue(t) {
            const e = t.composedPath()[0];
            this._hasInputValue = e.value.length > 0;
          }
        }
    );
    class Yi {
      constructor(t) {
        (this.host = t),
          t.addEventListener("opened-changed", () => {
            t.opened || this.__setVirtualKeyboardEnabled(!1);
          }),
          t.addEventListener("blur", () =>
            this.__setVirtualKeyboardEnabled(!0)
          ),
          t.addEventListener("touchstart", () =>
            this.__setVirtualKeyboardEnabled(!0)
          );
      }
      __setVirtualKeyboardEnabled(t) {
        this.host.inputElement &&
          (this.host.inputElement.inputMode = t ? "" : "none");
      }
    }
    function Ki(t) {
      return null != t;
    }
    function Gi(t, e) {
      return t.findIndex((t) => !(t instanceof Mi) && e(t));
    }
    const Ji = (t) =>
      class extends Ui(oi(Hi(ji(qi(Wi($i(t))))))) {
        static get properties() {
          return {
            opened: {
              type: Boolean,
              notify: !0,
              value: !1,
              reflectToAttribute: !0,
              observer: "_openedChanged",
            },
            autoOpenDisabled: { type: Boolean },
            readonly: { type: Boolean, value: !1, reflectToAttribute: !0 },
            renderer: Function,
            items: { type: Array, observer: "_itemsChanged" },
            allowCustomValue: { type: Boolean, value: !1 },
            filteredItems: { type: Array, observer: "_filteredItemsChanged" },
            _lastCommittedValue: String,
            loading: { type: Boolean, value: !1, reflectToAttribute: !0 },
            _focusedIndex: {
              type: Number,
              observer: "_focusedIndexChanged",
              value: -1,
            },
            filter: { type: String, value: "", notify: !0 },
            selectedItem: { type: Object, notify: !0 },
            itemLabelPath: {
              type: String,
              value: "label",
              observer: "_itemLabelPathChanged",
            },
            itemValuePath: { type: String, value: "value" },
            itemIdPath: String,
            _toggleElement: { type: Object, observer: "_toggleElementChanged" },
            _dropdownItems: { type: Array },
            _closeOnBlurIsPrevented: Boolean,
            _scroller: Object,
            _overlayOpened: {
              type: Boolean,
              observer: "_overlayOpenedChanged",
            },
          };
        }
        static get observers() {
          return [
            "_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)",
            "_openedOrItemsChanged(opened, _dropdownItems, loading)",
            "_updateScroller(_scroller, _dropdownItems, opened, loading, selectedItem, itemIdPath, _focusedIndex, renderer, theme)",
          ];
        }
        constructor() {
          super(),
            (this._boundOverlaySelectedItemChanged =
              this._overlaySelectedItemChanged.bind(this)),
            (this._boundOnClearButtonMouseDown =
              this.__onClearButtonMouseDown.bind(this)),
            (this._boundOnClick = this._onClick.bind(this)),
            (this._boundOnOverlayTouchAction =
              this._onOverlayTouchAction.bind(this)),
            (this._boundOnTouchend = this._onTouchend.bind(this));
        }
        get _tagNamePrefix() {
          return "vaadin-combo-box";
        }
        get _nativeInput() {
          return this.inputElement;
        }
        _inputElementChanged(t) {
          super._inputElementChanged(t);
          const e = this._nativeInput;
          e &&
            ((e.autocomplete = "off"),
            (e.autocapitalize = "off"),
            e.setAttribute("role", "combobox"),
            e.setAttribute("aria-autocomplete", "list"),
            e.setAttribute("aria-expanded", !!this.opened),
            e.setAttribute("spellcheck", "false"),
            e.setAttribute("autocorrect", "off"),
            this._revertInputValueToValue(),
            this.clearElement &&
              this.clearElement.addEventListener(
                "mousedown",
                this._boundOnClearButtonMouseDown
              ));
        }
        ready() {
          super.ready(),
            this._initOverlay(),
            this._initScroller(),
            (this._lastCommittedValue = this.value),
            this.addEventListener("click", this._boundOnClick),
            this.addEventListener("touchend", this._boundOnTouchend);
          const t = () => {
            requestAnimationFrame(() => {
              this._overlayElement.bringToFront();
            });
          };
          var e;
          this.addEventListener("mousedown", t),
            this.addEventListener("touchstart", t),
            (e = this),
            window.Vaadin && window.Vaadin.templateRendererCallback
              ? window.Vaadin.templateRendererCallback(e)
              : e.querySelector("template") &&
                console.warn(
                  `WARNING: <template> inside <${e.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`
                ),
            this.addController(new Yi(this));
        }
        disconnectedCallback() {
          super.disconnectedCallback(), this.close();
        }
        requestContentUpdate() {
          this._scroller &&
            (this._scroller.requestContentUpdate(),
            this._getItemElements().forEach((t) => {
              t.requestContentUpdate();
            }));
        }
        open() {
          this.disabled || this.readonly || (this.opened = !0);
        }
        close() {
          this.opened = !1;
        }
        _propertiesChanged(t, e, i) {
          super._propertiesChanged(t, e, i),
            void 0 !== e.filter && this._filterChanged(e.filter);
        }
        _initOverlay() {
          const t = this.$.overlay;
          (t._comboBox = this),
            t.addEventListener("touchend", this._boundOnOverlayTouchAction),
            t.addEventListener("touchmove", this._boundOnOverlayTouchAction),
            t.addEventListener("mousedown", (t) => t.preventDefault()),
            t.addEventListener("opened-changed", (t) => {
              this._overlayOpened = t.detail.value;
            }),
            (this._overlayElement = t);
        }
        _initScroller(t) {
          const e = `${this._tagNamePrefix}-scroller`,
            i = this._overlayElement;
          (i.renderer = (t) => {
            t.firstChild || t.appendChild(document.createElement(e));
          }),
            i.requestContentUpdate();
          const s = i.querySelector(e);
          (s.owner = t || this),
            (s.getItemLabel = this._getItemLabel.bind(this)),
            s.addEventListener(
              "selection-changed",
              this._boundOverlaySelectedItemChanged
            ),
            (this._scroller = s);
        }
        _updateScroller(t, e, i, s, r, o, n, a, l) {
          t &&
            (i &&
              (t.style.maxHeight =
                getComputedStyle(this).getPropertyValue(
                  `--${this._tagNamePrefix}-overlay-max-height`
                ) || "65vh"),
            t.setProperties({
              items: i ? e : [],
              opened: i,
              loading: s,
              selectedItem: r,
              itemIdPath: o,
              focusedIndex: n,
              renderer: a,
              theme: l,
            }));
        }
        _openedOrItemsChanged(t, e, i) {
          this._overlayOpened = !(!t || !(i || (e && e.length)));
        }
        _overlayOpenedChanged(t, e) {
          t
            ? (this.dispatchEvent(
                new CustomEvent("vaadin-combo-box-dropdown-opened", {
                  bubbles: !0,
                  composed: !0,
                })
              ),
              this._onOpened())
            : e &&
              this._dropdownItems &&
              this._dropdownItems.length &&
              (this.close(),
              this.dispatchEvent(
                new CustomEvent("vaadin-combo-box-dropdown-closed", {
                  bubbles: !0,
                  composed: !0,
                })
              ));
        }
        _focusedIndexChanged(t, e) {
          void 0 !== e && this._updateActiveDescendant(t);
        }
        _isInputFocused() {
          return this.inputElement && ti(this.inputElement);
        }
        _updateActiveDescendant(t) {
          const e = this._nativeInput;
          if (!e) return;
          const i = this._getItemElements().find((e) => e.index === t);
          i
            ? e.setAttribute("aria-activedescendant", i.id)
            : e.removeAttribute("aria-activedescendant");
        }
        _openedChanged(t, e) {
          if (void 0 === e) return;
          t
            ? ((this._openedWithFocusRing = this.hasAttribute("focus-ring")),
              this._isInputFocused() ||
                De ||
                (this.inputElement && this.inputElement.focus()),
              (this._overlayElement.restoreFocusOnClose = !0))
            : (this._onClosed(),
              this._openedWithFocusRing &&
                this._isInputFocused() &&
                this.setAttribute("focus-ring", ""));
          const i = this._nativeInput;
          i &&
            (i.setAttribute("aria-expanded", !!t),
            t
              ? i.setAttribute("aria-controls", this._scroller.id)
              : i.removeAttribute("aria-controls"));
        }
        _onOverlayTouchAction() {
          (this._closeOnBlurIsPrevented = !0),
            this.inputElement.blur(),
            (this._closeOnBlurIsPrevented = !1);
        }
        _isClearButton(t) {
          return t.composedPath()[0] === this.clearElement;
        }
        __onClearButtonMouseDown(t) {
          t.preventDefault(), this.inputElement.focus();
        }
        _onClearButtonClick(t) {
          t.preventDefault(),
            this._onClearAction(),
            this.opened && this.requestContentUpdate();
        }
        _onToggleButtonClick(t) {
          t.preventDefault(), this.opened ? this.close() : this.open();
        }
        _onHostClick(t) {
          this.autoOpenDisabled || (t.preventDefault(), this.open());
        }
        _onClick(t) {
          this._isClearButton(t)
            ? this._onClearButtonClick(t)
            : t.composedPath().includes(this._toggleElement)
            ? this._onToggleButtonClick(t)
            : this._onHostClick(t);
        }
        _onKeyDown(t) {
          super._onKeyDown(t),
            "Tab" === t.key
              ? (this._overlayElement.restoreFocusOnClose = !1)
              : "ArrowDown" === t.key
              ? (this._onArrowDown(), t.preventDefault())
              : "ArrowUp" === t.key && (this._onArrowUp(), t.preventDefault());
        }
        _getItemLabel(t) {
          let e = t && this.itemLabelPath ? gi(this.itemLabelPath, t) : void 0;
          return null == e && (e = t ? t.toString() : ""), e;
        }
        _getItemValue(t) {
          let e = t && this.itemValuePath ? gi(this.itemValuePath, t) : void 0;
          return void 0 === e && (e = t ? t.toString() : ""), e;
        }
        _onArrowDown() {
          if (this.opened) {
            const t = this._dropdownItems;
            t &&
              ((this._focusedIndex = Math.min(
                t.length - 1,
                this._focusedIndex + 1
              )),
              this._prefillFocusedItemLabel());
          } else this.open();
        }
        _onArrowUp() {
          if (this.opened) {
            if (this._focusedIndex > -1)
              this._focusedIndex = Math.max(0, this._focusedIndex - 1);
            else {
              const t = this._dropdownItems;
              t && (this._focusedIndex = t.length - 1);
            }
            this._prefillFocusedItemLabel();
          } else this.open();
        }
        _prefillFocusedItemLabel() {
          if (this._focusedIndex > -1) {
            const t = this._dropdownItems[this._focusedIndex];
            (this._inputElementValue = this._getItemLabel(t)),
              this._markAllSelectionRange();
          }
        }
        _setSelectionRange(t, e) {
          this._isInputFocused() &&
            this.inputElement.setSelectionRange &&
            this.inputElement.setSelectionRange(t, e);
        }
        _markAllSelectionRange() {
          void 0 !== this._inputElementValue &&
            this._setSelectionRange(0, this._inputElementValue.length);
        }
        _clearSelectionRange() {
          if (void 0 !== this._inputElementValue) {
            const t = this._inputElementValue
              ? this._inputElementValue.length
              : 0;
            this._setSelectionRange(t, t);
          }
        }
        _closeOrCommit() {
          this.opened || this.loading ? this.close() : this._commitValue();
        }
        _onEnter(t) {
          const e =
            this._focusedIndex < 0 &&
            "" !== this._inputElementValue &&
            this._getItemLabel(this.selectedItem) !== this._inputElementValue;
          if (!this.allowCustomValue && e)
            return t.preventDefault(), void t.stopPropagation();
          this.opened && (t.preventDefault(), t.stopPropagation()),
            this._closeOrCommit();
        }
        _onEscape(t) {
          this.autoOpenDisabled
            ? this.opened ||
              (this.value !== this._inputElementValue &&
                this._inputElementValue.length > 0)
              ? (t.stopPropagation(), (this._focusedIndex = -1), this.cancel())
              : this.clearButtonVisible &&
                !this.opened &&
                this.value &&
                (t.stopPropagation(), this._onClearAction())
            : this.opened
            ? (t.stopPropagation(),
              this._focusedIndex > -1
                ? ((this._focusedIndex = -1), this._revertInputValue())
                : this.cancel())
            : this.clearButtonVisible &&
              this.value &&
              (t.stopPropagation(), this._onClearAction());
        }
        _toggleElementChanged(t) {
          t &&
            (t.addEventListener("mousedown", (t) => t.preventDefault()),
            t.addEventListener("click", () => {
              De && !this._isInputFocused() && document.activeElement.blur();
            }));
        }
        _onClearAction() {
          (this.selectedItem = null),
            this.allowCustomValue && (this.value = ""),
            this._detectAndDispatchChange();
        }
        cancel() {
          this._revertInputValueToValue(),
            (this._lastCommittedValue = this.value),
            this._closeOrCommit();
        }
        _onOpened() {
          this._lastCommittedValue = this.value;
        }
        _onClosed() {
          (this.loading && !this.allowCustomValue) || this._commitValue();
        }
        _commitValue() {
          if (this._focusedIndex > -1) {
            const t = this._dropdownItems[this._focusedIndex];
            this.selectedItem !== t && (this.selectedItem = t),
              (this._inputElementValue = this._getItemLabel(this.selectedItem)),
              (this._focusedIndex = -1);
          } else if (
            "" === this._inputElementValue ||
            void 0 === this._inputElementValue
          )
            (this.selectedItem = null),
              this.allowCustomValue && (this.value = "");
          else {
            const t = [this.selectedItem, ...(this._dropdownItems || [])],
              e = t[this.__getItemIndexByLabel(t, this._inputElementValue)];
            if (this.allowCustomValue && !e) {
              const t = this._inputElementValue;
              this._lastCustomValue = t;
              const e = new CustomEvent("custom-value-set", {
                detail: t,
                composed: !0,
                cancelable: !0,
                bubbles: !0,
              });
              this.dispatchEvent(e), e.defaultPrevented || (this.value = t);
            } else
              this.allowCustomValue || this.opened || !e
                ? (this._inputElementValue = this.selectedItem
                    ? this._getItemLabel(this.selectedItem)
                    : this.value || "")
                : (this.value = this._getItemValue(e));
          }
          this._detectAndDispatchChange(),
            this._clearSelectionRange(),
            (this.filter = "");
        }
        _onInput(t) {
          const e = this._inputElementValue,
            i = {};
          this.filter === e ? this._filterChanged(this.filter) : (i.filter = e),
            this.opened ||
              this._isClearButton(t) ||
              this.autoOpenDisabled ||
              (i.opened = !0),
            this.setProperties(i);
        }
        _onChange(t) {
          t.stopPropagation();
        }
        _itemLabelPathChanged(t) {
          "string" != typeof t &&
            console.error("You should set itemLabelPath to a valid string");
        }
        _filterChanged(t) {
          this._scrollIntoView(0),
            (this._focusedIndex = -1),
            this.items
              ? (this.filteredItems = this._filterItems(this.items, t))
              : this._filteredItemsChanged(this.filteredItems);
        }
        _revertInputValue() {
          "" !== this.filter
            ? (this._inputElementValue = this.filter)
            : this._revertInputValueToValue(),
            this._clearSelectionRange();
        }
        _revertInputValueToValue() {
          this.allowCustomValue && !this.selectedItem
            ? (this._inputElementValue = this.value)
            : (this._inputElementValue = this._getItemLabel(this.selectedItem));
        }
        _selectedItemChanged(t) {
          if (null == t)
            this.filteredItems &&
              (this.allowCustomValue || (this.value = ""),
              this._toggleHasValue(this._hasValue),
              (this._inputElementValue = this.value));
          else {
            const e = this._getItemValue(t);
            if (this.value !== e && ((this.value = e), this.value !== e))
              return;
            this._toggleHasValue(!0),
              (this._inputElementValue = this._getItemLabel(t));
          }
        }
        _valueChanged(t, e) {
          ("" === t && void 0 === e) ||
            (Ki(t)
              ? (this._getItemValue(this.selectedItem) !== t &&
                  this._selectItemForValue(t),
                !this.selectedItem &&
                  this.allowCustomValue &&
                  (this._inputElementValue = t),
                this._toggleHasValue(this._hasValue))
              : (this.selectedItem = null),
            (this.filter = ""),
            (this._lastCommittedValue = void 0));
        }
        _detectAndDispatchChange() {
          document.hasFocus() && this.validate(),
            this.value !== this._lastCommittedValue &&
              (this.dispatchEvent(new CustomEvent("change", { bubbles: !0 })),
              (this._lastCommittedValue = this.value));
        }
        _itemsChanged(t, e) {
          this._ensureItemsOrDataProvider(() => {
            this.items = e;
          }),
            t
              ? (this.filteredItems = t.slice(0))
              : e && (this.filteredItems = null);
        }
        _filteredItemsChanged(t, e) {
          this._setDropdownItems(t);
          const i = e ? e[this._focusedIndex] : null,
            s = this.__getItemIndexByValue(t, this.value);
          (null === this.selectedItem || void 0 === this.selectedItem) &&
            s >= 0 &&
            (this.selectedItem = t[s]);
          const r = this.__getItemIndexByValue(t, this._getItemValue(i));
          this._focusedIndex =
            r > -1
              ? r
              : this.__getItemIndexByLabel(this.filteredItems, this.filter);
        }
        _filterItems(t, e) {
          if (!t) return t;
          const i = t.filter(
            (t) => (
              (e = e ? e.toString().toLowerCase() : ""),
              this._getItemLabel(t).toString().toLowerCase().indexOf(e) > -1
            )
          );
          return i;
        }
        _selectItemForValue(t) {
          const e = this.__getItemIndexByValue(this.filteredItems, t),
            i = this.selectedItem;
          e >= 0
            ? (this.selectedItem = this.filteredItems[e])
            : this.dataProvider && void 0 === this.selectedItem
            ? (this.selectedItem = void 0)
            : (this.selectedItem = null),
            null === this.selectedItem &&
              null === i &&
              this._selectedItemChanged(this.selectedItem);
        }
        _setDropdownItems(t) {
          this._dropdownItems = t;
        }
        _getItemElements() {
          return Array.from(
            this._scroller.querySelectorAll(`${this._tagNamePrefix}-item`)
          );
        }
        _scrollIntoView(t) {
          this._scroller && this._scroller.scrollIntoView(t);
        }
        __getItemIndexByValue(t, e) {
          return t && Ki(e) ? Gi(t, (t) => this._getItemValue(t) === e) : -1;
        }
        __getItemIndexByLabel(t, e) {
          return t && e
            ? Gi(
                t,
                (t) =>
                  this._getItemLabel(t).toString().toLowerCase() ===
                  e.toString().toLowerCase()
              )
            : -1;
        }
        _overlaySelectedItemChanged(t) {
          t.stopPropagation(),
            t.detail.item instanceof Mi ||
              (this.opened &&
                ((this._focusedIndex = this.filteredItems.indexOf(
                  t.detail.item
                )),
                this.close()));
        }
        _setFocused(t) {
          if (
            (super._setFocused(t),
            !t && !this.readonly && !this._closeOnBlurIsPrevented)
          ) {
            if (
              !this.opened &&
              this.allowCustomValue &&
              this._inputElementValue === this._lastCustomValue
            )
              return void delete this._lastCustomValue;
            this._closeOrCommit();
          }
        }
        _shouldRemoveFocus(t) {
          return (
            (!t.relatedTarget ||
              t.relatedTarget.localName !== `${this._tagNamePrefix}-item`) &&
            (t.relatedTarget !== this._overlayElement ||
              (t.composedPath()[0].focus(), !1))
          );
        }
        _onTouchend(t) {
          this.clearElement &&
            t.composedPath()[0] === this.clearElement &&
            (t.preventDefault(), this._onClearAction());
        }
      };
    class Xi extends Bi(Ji(Hi(C(be)))) {
      static get is() {
        return "vaadin-combo-box-light";
      }
      static get template() {
        return ye`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-combo-box-overlay
        id="overlay"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[inputElement]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-combo-box-overlay>
    `;
      }
      static get properties() {
        return { attrForValue: { type: String, value: "value" } };
      }
      get clearElement() {
        return this.querySelector(".clear-button");
      }
      get _inputElementValueProperty() {
        return st(this.attrForValue);
      }
      get _nativeInput() {
        const t = this.inputElement;
        if (t) {
          if (t instanceof HTMLInputElement) return t;
          const e = t.querySelector("input");
          if (e) return e;
          if (t.shadowRoot) {
            const e = t.shadowRoot.querySelector("input");
            if (e) return e;
          }
        }
      }
      ready() {
        super.ready(),
          (this._toggleElement = this.querySelector(".toggle-button")),
          Ne(this, () => {
            this._setInputElement(
              this.querySelector("vaadin-text-field,.input")
            ),
              this._revertInputValue();
          });
      }
      checkValidity() {
        return this.inputElement && this.inputElement.validate
          ? this.inputElement.validate()
          : super.checkValidity();
      }
      _isClearButton(t) {
        return (
          super._isClearButton(t) ||
          ("input" === t.type && !t.isTrusted) ||
          "clear-button" === t.composedPath()[0].getAttribute("part")
        );
      }
      _shouldRemoveFocus(t) {
        const e =
            t.target === this._toggleElement || t.target === this.clearElement,
          i = t.relatedTarget && t.relatedTarget === this._nativeInput;
        return (!e || !i) && super._shouldRemoveFocus(t);
      }
    }
    s(Xi);
  },
  7888: (t, e, i) => {
    i.d(e, { hC: () => n });
    var s = i(5095);
    const r = [];
    function o(t) {
      return t && Object.prototype.hasOwnProperty.call(t, "__themes");
    }
    function n(t, e, i = {}) {
      var n;
      t &&
        ((n = t),
        o(customElements.get(n)) &&
          console.warn(
            `The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`
          )),
        (e = (function (t = []) {
          return [t]
            .flat(1 / 0)
            .filter(
              (t) =>
                t instanceof s.c3 ||
                (console.warn(
                  "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                ),
                !1)
            );
        })(e)),
        window.Vaadin && window.Vaadin.styleModules
          ? window.Vaadin.styleModules.registerStyles(t, e, i)
          : r.push({
              themeFor: t,
              styles: e,
              include: i.include,
              moduleId: i.moduleId,
            });
    }
  },
  76187: (t, e, i) => {
    i.d(e, { sR: () => s.sR });
    var s = i(36585);
  },
  36585: (t, e, i) => {
    i.d(e, { sR: () => c });
    var s = i(41005),
      r = i(16616);
    const o = (t, e) => {
        var i, s;
        const r = t._$AN;
        if (void 0 === r) return !1;
        for (const t of r)
          null === (s = (i = t)._$AO) || void 0 === s || s.call(i, e, !1),
            o(t, e);
        return !0;
      },
      n = (t) => {
        let e, i;
        do {
          if (void 0 === (e = t._$AM)) break;
          (i = e._$AN), i.delete(t), (t = e);
        } while (0 === (null == i ? void 0 : i.size));
      },
      a = (t) => {
        for (let e; (e = t._$AM); t = e) {
          let i = e._$AN;
          if (void 0 === i) e._$AN = i = new Set();
          else if (i.has(t)) break;
          i.add(t), d(e);
        }
      };
    function l(t) {
      void 0 !== this._$AN
        ? (n(this), (this._$AM = t), a(this))
        : (this._$AM = t);
    }
    function h(t, e = !1, i = 0) {
      const s = this._$AH,
        r = this._$AN;
      if (void 0 !== r && 0 !== r.size)
        if (e)
          if (Array.isArray(s))
            for (let t = i; t < s.length; t++) o(s[t], !1), n(s[t]);
          else null != s && (o(s, !1), n(s));
        else o(this, t);
    }
    const d = (t) => {
      var e, i, s, o;
      t.type == r.pX.CHILD &&
        ((null !== (e = (s = t)._$AP) && void 0 !== e) || (s._$AP = h),
        (null !== (i = (o = t)._$AQ) && void 0 !== i) || (o._$AQ = l));
    };
    class c extends r.Xe {
      constructor() {
        super(...arguments), (this._$AN = void 0);
      }
      _$AT(t, e, i) {
        super._$AT(t, e, i), a(this), (this.isConnected = t._$AU);
      }
      _$AO(t, e = !0) {
        var i, s;
        t !== this.isConnected &&
          ((this.isConnected = t),
          t
            ? null === (i = this.reconnected) || void 0 === i || i.call(this)
            : null === (s = this.disconnected) || void 0 === s || s.call(this)),
          e && (o(this, t), n(this));
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
//# sourceMappingURL=303.XswrJn_fCQU.js.map
