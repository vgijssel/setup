/*! For license information please see 5887.vuEQsaOrMxA.js.LICENSE.txt */
"use strict";
(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [5887],
  {
    34633: function (e, t, n) {
      var i = n(43173),
        r = n(22933),
        o = n(73177),
        a = n(5218);
      e.exports = function (e, t) {
        (t && "string" == typeof e) || r(e);
        var n = a(e);
        return o(r(void 0 !== n ? i(n, e) : e));
      };
    },
    38212: function (e, t, n) {
      var i = n(68077),
        r = n(63505),
        o = n(9160),
        a = n(19480),
        s = n(10228),
        l = n(26183);
      i(
        { target: "Array", proto: !0 },
        {
          flatMap: function (e) {
            var t,
              n = a(this),
              i = s(n);
            return (
              o(e),
              ((t = l(n, 0)).length = r(
                t,
                n,
                n,
                i,
                0,
                1,
                e,
                arguments.length > 1 ? arguments[1] : void 0
              )),
              t
            );
          },
        }
      );
    },
    23376: function (e, t, n) {
      n(90476)("flatMap");
    },
    72: function (e, t, n) {
      var i = n(68077),
        r = n(43173),
        o = n(9160),
        a = n(22933),
        s = n(73177),
        l = n(34633),
        u = n(8900),
        h = n(56208),
        c = n(95448),
        d = u(function () {
          for (var e, t, n = this.iterator, i = this.mapper; ; ) {
            if ((t = this.inner))
              try {
                if (!(e = a(r(t.next, t.iterator))).done) return e.value;
                this.inner = null;
              } catch (o) {
                h(n, "throw", o);
              }
            if (((e = a(r(this.next, n))), (this.done = !!e.done))) return;
            try {
              this.inner = l(i(e.value, this.counter++), !1);
            } catch (o) {
              h(n, "throw", o);
            }
          }
        });
      i(
        { target: "Iterator", proto: !0, real: !0, forced: c },
        {
          flatMap: function (e) {
            return a(this), o(e), new d(s(this), { mapper: e, inner: null });
          },
        }
      );
    },
    21371: function (e, t, n) {
      var i = n(68077),
        r = n(33099),
        o = n(9160),
        a = n(33305);
      i(
        { global: !0, enumerable: !0, dontCallGetSet: !0 },
        {
          queueMicrotask: function (e) {
            a(arguments.length, 1), r(o(e));
          },
        }
      );
    },
    29530: function (e, t, n) {
      n.d(t, {
        t: function () {
          return f;
        },
      });
      var i = n(71650),
        r = n(33368),
        o = n(68308),
        a = n(69205),
        s = n(57835),
        l = n(46097),
        u = n(62746),
        h =
          (n(94738),
          n(98214),
          n(46798),
          n(51467),
          n(22859),
          n(97393),
          n(9849),
          n(13526),
          n(5095)),
        c = n(76187),
        d = Symbol("valueNotInitialized"),
        _ = (function (e) {
          function t(e) {
            var n;
            if (
              ((0, i.Z)(this, t),
              (n = (0, o.Z)(this, t, [e])),
              e.type !== s.pX.ELEMENT)
            )
              throw new Error(
                "`".concat(n.constructor.name, "` must be bound to an element.")
              );
            return (n.previousValue = d), n;
          }
          return (
            (0, a.Z)(t, e),
            (0, r.Z)(t, [
              {
                key: "render",
                value: function (e, t) {
                  return h.Ld;
                },
              },
              {
                key: "update",
                value: function (e, t) {
                  var n = (0, u.Z)(t, 2),
                    i = n[0],
                    r = n[1];
                  return this.hasChanged(r)
                    ? ((this.host = e.options && e.options.host),
                      (this.element = e.element),
                      (this.renderer = i),
                      this.previousValue === d
                        ? this.addRenderer()
                        : this.runRenderer(),
                      (this.previousValue = Array.isArray(r) ? (0, l.Z)(r) : r),
                      h.Ld)
                    : h.Ld;
                },
              },
              {
                key: "reconnected",
                value: function () {
                  this.addRenderer();
                },
              },
              {
                key: "disconnected",
                value: function () {
                  this.removeRenderer();
                },
              },
              {
                key: "addRenderer",
                value: function () {
                  throw new Error(
                    "The `addRenderer` method must be implemented."
                  );
                },
              },
              {
                key: "runRenderer",
                value: function () {
                  throw new Error(
                    "The `runRenderer` method must be implemented."
                  );
                },
              },
              {
                key: "removeRenderer",
                value: function () {
                  throw new Error(
                    "The `removeRenderer` method must be implemented."
                  );
                },
              },
              {
                key: "renderRenderer",
                value: function (e) {
                  for (
                    var t,
                      n = arguments.length,
                      i = new Array(n > 1 ? n - 1 : 0),
                      r = 1;
                    r < n;
                    r++
                  )
                    i[r - 1] = arguments[r];
                  var o = (t = this.renderer).call.apply(
                    t,
                    [this.host].concat(i)
                  );
                  (0, h.sY)(o, e, { host: this.host });
                },
              },
              {
                key: "hasChanged",
                value: function (e) {
                  var t = this;
                  return Array.isArray(e)
                    ? !Array.isArray(this.previousValue) ||
                        this.previousValue.length !== e.length ||
                        e.some(function (e, n) {
                          return e !== t.previousValue[n];
                        })
                    : this.previousValue !== e;
                },
              },
            ]),
            t
          );
        })(c.sR),
        p = (function (e) {
          function t() {
            return (0, i.Z)(this, t), (0, o.Z)(this, t, arguments);
          }
          return (
            (0, a.Z)(t, e),
            (0, r.Z)(t, [
              {
                key: "addRenderer",
                value: function () {
                  var e = this;
                  this.element.renderer = function (t, n, i) {
                    e.renderRenderer(t, i.item, i, n);
                  };
                },
              },
              {
                key: "runRenderer",
                value: function () {
                  this.element.requestContentUpdate();
                },
              },
              {
                key: "removeRenderer",
                value: function () {
                  this.element.renderer = null;
                },
              },
            ]),
            t
          );
        })(_),
        f = (0, s.XM)(p);
    },
    70529: function (e, t, n) {
      var i = n(88962),
        r = n(71650),
        o = n(33368),
        a = n(68308),
        s = n(69205),
        l = n(56889);
      n(97393);
      function u(e) {
        var t = customElements.get(e.is);
        if (t) {
          var n = t.version;
          n && e.version && n === e.version
            ? console.warn(
                "The component ".concat(e.is, " has been loaded twice")
              )
            : console.error(
                "Tried to define "
                  .concat(e.is, " version ")
                  .concat(e.version, " when version ")
                  .concat(
                    t.version,
                    " is already in use. Something will probably break."
                  )
              );
        } else
          Object.defineProperty(e, "version", {
            get: function () {
              return "24.3.4";
            },
          }),
            customElements.define(e.is, e);
      }
      var h = (function (e) {
        function t() {
          return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
        }
        return (
          (0, s.Z)(t, e),
          (0, o.Z)(t, null, [
            {
              key: "is",
              get: function () {
                return "vaadin-material-styles";
              },
            },
          ]),
          t
        );
      })((0, l.Z)(HTMLElement));
      u(h);
      var c = n(34541),
        d = n(47838),
        _ = n(46097),
        p =
          (n(87438),
          n(46798),
          n(9849),
          n(22890),
          n(71791),
          n(50617),
          n(36513),
          n(13526),
          n(63789),
          n(99397),
          n(10999),
          n(52117),
          n(82479),
          n(94570),
          n(91989),
          n(88640),
          n(50289),
          n(94167),
          n(85472),
          n(90126),
          n(46349),
          n(70320),
          n(37313),
          n(85717),
          n(30535),
          n(38212),
          n(23376),
          n(72),
          n(26349),
          n(5095)),
        f = [];
      function v(e) {
        return e && Object.prototype.hasOwnProperty.call(e, "__themes");
      }
      function y(e, t) {
        var n,
          i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e &&
          ((n = e),
          v(customElements.get(n)) &&
            console.warn(
              'The custom element definition for "'.concat(
                e,
                '"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.'
              )
            )),
          (t = (function () {
            return [
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            ]
              .flat(1 / 0)
              .filter(function (e) {
                return (
                  e instanceof p.c3 ||
                  (console.warn(
                    "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                  ),
                  !1)
                );
              });
          })(t)),
          window.Vaadin && window.Vaadin.styleModules
            ? window.Vaadin.styleModules.registerStyles(e, t, i)
            : f.push({
                themeFor: e,
                styles: t,
                include: i.include,
                moduleId: i.moduleId,
              });
      }
      n(24074);
      var m,
        g,
        b,
        k = function (e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
          )
            n[i - 1] = arguments[i];
          !(function (e) {
            var t = document.createElement("style");
            t.id = e;
            for (
              var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
              r < n;
              r++
            )
              i[r - 1] = arguments[r];
            (t.textContent = i
              .map(function (e) {
                return e.toString();
              })
              .join("\n")
              .replace(":host", "html")),
              document.head.insertAdjacentElement("afterbegin", t);
          })("material-".concat(e), n);
        };
      y(
        "",
        (0, p.iv)(
          m ||
            (m = (0, i.Z)([
              "\n  :host {\n    /* Text colors */\n    --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));\n    --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));\n    --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));\n\n    /* Primary colors */\n    --material-primary-color: var(--primary-color, #6200ee);\n    --material-primary-contrast-color: var(--dark-theme-base-color, #fff);\n    --material-primary-text-color: var(--material-primary-color);\n\n    /* Error colors */\n    --material-error-color: var(--error-color, #b00020);\n    --material-error-text-color: var(--material-error-color);\n\n    /* Background colors */\n    --material-background-color: var(--light-theme-background-color, #fff);\n    --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);\n    --material-disabled-color: rgba(0, 0, 0, 0.26);\n\n    /* Divider colors */\n    --material-divider-color: rgba(0, 0, 0, 0.12);\n\n    /* Undocumented internal properties (prefixed with three dashes) */\n\n    /* Text field tweaks */\n    --_material-text-field-input-line-background-color: initial;\n    --_material-text-field-input-line-opacity: initial;\n    --_material-text-field-input-line-hover-opacity: initial;\n    --_material-text-field-focused-label-opacity: initial;\n\n    /* Button tweaks */\n    --_material-button-raised-background-color: initial;\n    --_material-button-outline-color: initial;\n\n    /* Grid tweaks */\n    --_material-grid-row-hover-background-color: initial;\n\n    /* Split layout tweaks */\n    --_material-split-layout-splitter-background-color: initial;\n\n    background-color: var(--material-background-color);\n    color: var(--material-body-text-color);\n  }\n\n  [theme~='dark'] {\n    /* Text colors */\n    --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));\n    --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));\n    --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));\n\n    /* Primary colors */\n    --material-primary-color: var(--light-primary-color, #7e3ff2);\n    --material-primary-text-color: #b794f6;\n\n    /* Error colors */\n    --material-error-color: var(--error-color, #de2839);\n    --material-error-text-color: var(--material-error-color);\n\n    /* Background colors */\n    --material-background-color: var(--dark-theme-background-color, #303030);\n    --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);\n    --material-disabled-color: rgba(255, 255, 255, 0.3);\n\n    /* Divider colors */\n    --material-divider-color: rgba(255, 255, 255, 0.12);\n\n    /* Undocumented internal properties (prefixed with three dashes) */\n\n    /* Text field tweaks */\n    --_material-text-field-input-line-background-color: #fff;\n    --_material-text-field-input-line-opacity: 0.7;\n    --_material-text-field-input-line-hover-opacity: 1;\n    --_material-text-field-focused-label-opacity: 1;\n\n    /* Button tweaks */\n    --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);\n    --_material-button-outline-color: rgba(255, 255, 255, 0.2);\n\n    /* Grid tweaks */\n    --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);\n    --_material-grid-row-selected-overlay-opacity: 0.16;\n\n    /* Split layout tweaks */\n    --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);\n\n    background-color: var(--material-background-color);\n    color: var(--material-body-text-color);\n  }\n\n  a {\n    color: inherit;\n  }\n",
            ]))
        ),
        { moduleId: "material-color-light" }
      ),
        y(
          "",
          (0, p.iv)(
            g ||
              (g = (0, i.Z)([
                "\n  :host {\n    /* Text colors */\n    --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));\n    --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));\n    --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));\n\n    /* Primary colors */\n    --material-primary-color: var(--light-primary-color, #7e3ff2);\n    --material-primary-text-color: #b794f6;\n\n    /* Error colors */\n    --material-error-color: var(--error-color, #de2839);\n    --material-error-text-color: var(--material-error-color);\n\n    /* Background colors */\n    --material-background-color: var(--dark-theme-background-color, #303030);\n    --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);\n    --material-disabled-color: rgba(255, 255, 255, 0.3);\n\n    /* Divider colors */\n    --material-divider-color: rgba(255, 255, 255, 0.12);\n\n    /* Undocumented internal properties (prefixed with three dashes) */\n\n    /* Text field tweaks */\n    --_material-text-field-input-line-background-color: #fff;\n    --_material-text-field-input-line-opacity: 0.7;\n    --_material-text-field-input-line-hover-opacity: 1;\n    --_material-text-field-focused-label-opacity: 1;\n\n    /* Button tweaks */\n    --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);\n    --_material-button-outline-color: rgba(255, 255, 255, 0.2);\n\n    /* Grid tweaks */\n    --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);\n    --_material-grid-row-selected-overlay-opacity: 0.16;\n\n    /* Split layout tweaks */\n    --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);\n\n    background-color: var(--material-background-color);\n    color: var(--material-body-text-color);\n  }\n",
              ]))
          ),
          { moduleId: "material-color-dark" }
        ),
        k(
          "color-base",
          (0, p.iv)(
            b ||
              (b = (0, i.Z)([
                "\n  :host {\n    /* Text colors */\n    --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));\n    --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));\n    --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));\n\n    /* Primary colors */\n    --material-primary-color: var(--primary-color, #6200ee);\n    --material-primary-contrast-color: var(--dark-theme-base-color, #fff);\n    --material-primary-text-color: var(--material-primary-color);\n\n    /* Error colors */\n    --material-error-color: var(--error-color, #b00020);\n    --material-error-text-color: var(--material-error-color);\n\n    /* Background colors */\n    --material-background-color: var(--light-theme-background-color, #fff);\n    --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);\n    --material-disabled-color: rgba(0, 0, 0, 0.26);\n\n    /* Divider colors */\n    --material-divider-color: rgba(0, 0, 0, 0.12);\n  }\n",
              ]))
          )
        );
      var C = [];
      function P(e) {
        return e && Object.prototype.hasOwnProperty.call(e, "__themes");
      }
      var w,
        x = (0, p.iv)(
          w ||
            (w = (0, i.Z)([
              "\n  :host {\n    display: flex;\n    align-items: center;\n    box-sizing: border-box;\n    min-height: 36px;\n    padding: 8px 32px 8px 10px;\n    overflow: hidden;\n    font-family: var(--material-font-family);\n    font-size: var(--material-small-font-size);\n    line-height: 24px;\n  }\n\n  /* It's the list-box's responsibility to add the focus style */\n  :host([focused]) {\n    outline: none;\n  }\n\n  /* Checkmark */\n  [part='checkmark']::before {\n    display: var(--_material-item-selected-icon-display, none);\n    content: '';\n    font-family: material-icons;\n    font-size: 24px;\n    line-height: 1;\n    font-weight: 400;\n    width: 24px;\n    text-align: center;\n    margin-right: 10px;\n    color: var(--material-secondary-text-color);\n    flex: none;\n  }\n\n  :host([selected]) [part='checkmark']::before {\n    content: var(--material-icons-check);\n  }\n\n  @media (any-hover: hover) {\n    :host(:hover:not([disabled])) {\n      background-color: var(--material-secondary-background-color);\n    }\n\n    :host([focused]:not([disabled])) {\n      background-color: var(--material-divider-color);\n    }\n  }\n\n  /* Disabled */\n  :host([disabled]) {\n    color: var(--material-disabled-text-color);\n    cursor: default;\n    pointer-events: none;\n  }\n\n  /* RTL specific styles */\n  :host([dir='rtl']) {\n    padding: 8px 10px 8px 32px;\n  }\n\n  :host([dir='rtl']) [part='checkmark']::before {\n    margin-right: 0;\n    margin-left: 10px;\n  }\n",
            ]))
        );
      !(function (e, t) {
        var n,
          i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e &&
          ((n = e),
          P(customElements.get(n)) &&
            console.warn(
              'The custom element definition for "'.concat(
                e,
                '"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.'
              )
            )),
          (t = (function () {
            return [
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            ]
              .flat(1 / 0)
              .filter(function (e) {
                return (
                  e instanceof p.c3 ||
                  (console.warn(
                    "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                  ),
                  !1)
                );
              });
          })(t)),
          window.Vaadin && window.Vaadin.styleModules
            ? window.Vaadin.styleModules.registerStyles(e, t, i)
            : C.push({
                themeFor: e,
                styles: t,
                include: i.include,
                moduleId: i.moduleId,
              });
      })("vaadin-item", x, { moduleId: "material-item" });
      var I = [];
      function E(e) {
        return e && Object.prototype.hasOwnProperty.call(e, "__themes");
      }
      function S(e, t) {
        var n,
          i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e &&
          ((n = e),
          E(customElements.get(n)) &&
            console.warn(
              'The custom element definition for "'.concat(
                e,
                '"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.'
              )
            )),
          (t = (function () {
            return [
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            ]
              .flat(1 / 0)
              .filter(function (e) {
                return (
                  e instanceof p.c3 ||
                  (console.warn(
                    "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                  ),
                  !1)
                );
              });
          })(t)),
          window.Vaadin && window.Vaadin.styleModules
            ? window.Vaadin.styleModules.registerStyles(e, t, i)
            : I.push({
                themeFor: e,
                styles: t,
                include: i.include,
                moduleId: i.moduleId,
              });
      }
      function T() {
        return window.Vaadin && window.Vaadin.styleModules
          ? window.Vaadin.styleModules.getAllThemes()
          : I;
      }
      function A() {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          t = 0;
        return (
          e.startsWith("lumo-") || e.startsWith("material-")
            ? (t = 1)
            : e.startsWith("vaadin-") && (t = 2),
          t
        );
      }
      function O(e) {
        var t = [];
        return (
          e.include &&
            [].concat(e.include).forEach(function (e) {
              var n = T().find(function (t) {
                return t.moduleId === e;
              });
              n
                ? t.push.apply(t, (0, _.Z)(O(n)).concat((0, _.Z)(n.styles)))
                : console.warn(
                    "Included moduleId ".concat(
                      e,
                      " not found in style registry"
                    )
                  );
            }, e.styles),
          t
        );
      }
      function Z(e) {
        var t = "".concat(e, "-default-theme"),
          n = T()
            .filter(function (n) {
              return (
                n.moduleId !== t &&
                (function (e, t) {
                  return (e || "").split(" ").some(function (e) {
                    return new RegExp(
                      "^".concat(e.split("*").join(".*"), "$"),
                      "u"
                    ).test(t);
                  });
                })(n.themeFor, e)
              );
            })
            .map(function (e) {
              return Object.assign(
                Object.assign({}, e),
                {},
                {
                  styles: [].concat((0, _.Z)(O(e)), (0, _.Z)(e.styles)),
                  includePriority: A(e.moduleId),
                }
              );
            })
            .sort(function (e, t) {
              return t.includePriority - e.includePriority;
            });
        return n.length > 0
          ? n
          : T().filter(function (e) {
              return e.moduleId === t;
            });
      }
      var V,
        N,
        L = function (e) {
          return (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(t, null, [
                {
                  key: "finalize",
                  value: function () {
                    if (
                      ((0, c.Z)((0, d.Z)(t), "finalize", this).call(this),
                      !this.elementStyles)
                    ) {
                      var e = this.prototype._template;
                      e &&
                        !E(this) &&
                        (function (e, t) {
                          var n = document.createElement("style");
                          (n.innerHTML = e
                            .map(function (e) {
                              return e.cssText;
                            })
                            .join("\n")),
                            t.content.appendChild(n);
                        })(this.getStylesForThis(), e);
                    }
                  },
                },
                {
                  key: "finalizeStyles",
                  value: function (e) {
                    var n = this.getStylesForThis();
                    return e
                      ? [].concat(
                          (0, _.Z)(
                            (0, c.Z)((0, d.Z)(t), "finalizeStyles", this).call(
                              this,
                              e
                            )
                          ),
                          (0, _.Z)(n)
                        )
                      : n;
                  },
                },
                {
                  key: "getStylesForThis",
                  value: function () {
                    var e = Object.getPrototypeOf(this.prototype),
                      t = (e ? e.constructor.__themes : []) || [];
                    this.__themes = [].concat(
                      (0, _.Z)(t),
                      (0, _.Z)(Z(this.is))
                    );
                    var n = this.__themes.flatMap(function (e) {
                      return e.styles;
                    });
                    return n.filter(function (e, t) {
                      return t === n.lastIndexOf(e);
                    });
                  },
                },
              ]),
              t
            );
          })(
            (function (e) {
              return (function (e) {
                function t() {
                  return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
                }
                return (
                  (0, s.Z)(t, e),
                  (0, o.Z)(
                    t,
                    [
                      {
                        key: "attributeChangedCallback",
                        value: function (e, n, i) {
                          (0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "attributeChangedCallback",
                            this
                          ).call(this, e, n, i),
                            "theme" === e && this._set_theme(i);
                        },
                      },
                    ],
                    [
                      {
                        key: "properties",
                        get: function () {
                          return { _theme: { type: String, readOnly: !0 } };
                        },
                      },
                      {
                        key: "observedAttributes",
                        get: function () {
                          return [].concat(
                            (0, _.Z)(
                              (0, c.Z)((0, d.Z)(t), "observedAttributes", this)
                            ),
                            ["theme"]
                          );
                        },
                      },
                    ]
                  ),
                  t
                );
              })(e);
            })(e)
          );
        };
      S(
        "vaadin-combo-box-item",
        [
          x,
          (0, p.iv)(
            V ||
              (V = (0, i.Z)([
                "\n  :host {\n    cursor: pointer;\n    -webkit-tap-highlight-color: transparent;\n    padding: 4px 10px;\n    --_material-item-selected-icon-display: block;\n  }\n",
              ]))
          ),
        ],
        { moduleId: "material-combo-box-item" }
      );
      var z,
        R,
        M = (0, p.iv)(
          N ||
            (N = (0, i.Z)([
              "\n  [part~='loader'] {\n    height: 2px;\n    background: var(--material-background-color)\n      linear-gradient(\n        90deg,\n        transparent 0%,\n        transparent 20%,\n        var(--material-primary-color) 20%,\n        var(--material-primary-color) 40%,\n        transparent 40%,\n        transparent 60%,\n        var(--material-primary-color) 60%,\n        var(--material-primary-color) 80%,\n        transparent 80%,\n        transparent 100%\n      )\n      0 0 / 400% 100% repeat-x;\n    opacity: 0;\n  }\n\n  :host(:not([loading])) [part~='loader'] {\n    display: none;\n  }\n\n  :host([loading]) [part='loader'] {\n    animation: 3s linear infinite material-loader-progress, 0.3s 0.1s both material-loader-fade-in;\n  }\n\n  [part='loader']::before {\n    content: '';\n    display: block;\n    height: 100%;\n    opacity: 0.16;\n    background: var(--material-primary-color);\n  }\n\n  @keyframes material-loader-fade-in {\n    0% {\n      opacity: 0;\n    }\n\n    100% {\n      opacity: 1;\n    }\n  }\n\n  @keyframes material-loader-progress {\n    0% {\n      background-position: 0 0;\n      background-size: 300% 100%;\n    }\n\n    33% {\n      background-position: -100% 0;\n      background-size: 400% 100%;\n    }\n\n    67% {\n      background-position: -200% 0;\n      background-size: 250% 100%;\n    }\n\n    100% {\n      background-position: -300% 0;\n      background-size: 300% 100%;\n    }\n  }\n\n  /* RTL specific styles */\n\n  @keyframes material-loader-progress-rtl {\n    0% {\n      background-position: 100% 0;\n      background-size: 300% 100%;\n    }\n\n    33% {\n      background-position: 200% 0;\n      background-size: 400% 100%;\n    }\n\n    67% {\n      background-position: 300% 0;\n      background-size: 250% 100%;\n    }\n\n    100% {\n      background-position: 400% 0;\n      background-size: 300% 100%;\n    }\n  }\n\n  :host([loading][dir='rtl']) [part='loader'] {\n    animation: 3s linear infinite material-loader-progress-rtl, 0.3s 0.1s both material-loader-fade-in;\n  }\n",
            ]))
        );
      k(
        "shadow",
        (0, p.iv)(
          z ||
            (z = (0, i.Z)([
              "\n  /* prettier-ignore */\n  :host {\n    /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */\n    --material-shadow-elevation-2dp: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n    --material-shadow-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-4dp: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-6dp: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-8dp: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-12dp: 0 12px 16px 1px rgba(0, 0, 0, 0.14), 0 4px 22px 3px rgba(0, 0, 0, 0.12), 0 6px 7px -4px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-16dp: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);\n    --material-shadow-elevation-24dp: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.4);\n  }\n",
            ]))
        )
      );
      var F = (0, p.iv)(
        R ||
          (R = (0, i.Z)([
            "\n  :host {\n    top: 16px;\n    right: 16px;\n    /* TODO (@jouni): remove unnecessary multiplication after https://github.com/vaadin/vaadin-overlay/issues/90 is fixed */\n    bottom: calc(1px * var(--vaadin-overlay-viewport-bottom) + 16px);\n    left: 16px;\n  }\n\n  [part='overlay'] {\n    background-color: var(--material-background-color);\n    border-radius: 4px;\n    box-shadow: var(--material-shadow-elevation-4dp);\n    color: var(--material-body-text-color);\n    font-family: var(--material-font-family);\n    font-size: var(--material-body-font-size);\n    font-weight: 400;\n  }\n\n  [part='content'] {\n    padding: 8px 0;\n  }\n\n  [part='backdrop'] {\n    opacity: 0.2;\n    animation: 0.2s vaadin-overlay-backdrop-enter;\n    will-change: opacity;\n  }\n\n  @keyframes vaadin-overlay-backdrop-enter {\n    0% {\n      opacity: 0;\n    }\n  }\n",
          ]))
      );
      y("", F, { moduleId: "material-overlay" });
      var D,
        H,
        B,
        j = F;
      y("", j, { moduleId: "material-menu-overlay" }),
        S(
          "vaadin-combo-box-overlay",
          [
            j,
            (0, p.iv)(
              D ||
                (D = (0, i.Z)([
                  "\n  [part='overlay'] {\n    position: relative;\n    overflow: visible;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n\n  [part='content'] {\n    padding: 0;\n  }\n",
                ]))
            ),
            M,
            (0, p.iv)(
              H ||
                (H = (0, i.Z)([
                  "\n  [part~='loader'] {\n    position: absolute;\n    z-index: 1;\n    top: -2px;\n    left: 0;\n    right: 0;\n  }\n",
                ]))
            ),
            (0, p.iv)(
              B ||
                (B = (0, i.Z)([
                  "\n      :host {\n        --_vaadin-combo-box-items-container-border-width: 8px 0;\n        --_vaadin-combo-box-items-container-border-style: solid;\n      }\n    ",
                ]))
            ),
          ],
          { moduleId: "material-combo-box-overlay" }
        );
      n(32797), n(5239), n(51467), n(56646);
      var q = n(74460),
        U = (n(51358), n(39685), n(98490), 0);
      function $() {}
      $.prototype.__mixinApplications, $.prototype.__mixinSet;
      var W = function (e) {
          var t = e.__mixinApplications;
          t || ((t = new WeakMap()), (e.__mixinApplications = t));
          var n = U++;
          function i(i) {
            var r = i.__mixinSet;
            if (r && r[n]) return i;
            var o = t,
              a = o.get(i);
            if (!a) {
              (a = e(i)), o.set(i, a);
              var s = Object.create(a.__mixinSet || r || null);
              (s[n] = !0), (a.__mixinSet = s);
            }
            return a;
          }
          return i;
        },
        Y = (n(57778), n(11451), n(56308), n(42687)),
        K = {},
        G = {};
      function J(e, t) {
        K[e] = G[e.toLowerCase()] = t;
      }
      function X(e) {
        return K[e] || G[e.toLowerCase()];
      }
      var Q = (function (e) {
        function t() {
          return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
        }
        return (
          (0, s.Z)(t, e),
          (0, o.Z)(
            t,
            [
              {
                key: "attributeChangedCallback",
                value: function (e, t, n, i) {
                  t !== n && this.register();
                },
              },
              {
                key: "assetpath",
                get: function () {
                  if (!this.__assetpath) {
                    var e =
                        window.HTMLImports && HTMLImports.importForElement
                          ? HTMLImports.importForElement(this) || document
                          : this.ownerDocument,
                      t = (0, Y.Kk)(
                        this.getAttribute("assetpath") || "",
                        e.baseURI
                      );
                    this.__assetpath = (0, Y.iY)(t);
                  }
                  return this.__assetpath;
                },
              },
              {
                key: "register",
                value: function (e) {
                  if ((e = e || this.id)) {
                    if (q.XN && void 0 !== X(e))
                      throw (
                        (J(e, null),
                        new Error(
                          "strictTemplatePolicy: dom-module ".concat(
                            e,
                            " re-registered"
                          )
                        ))
                      );
                    (this.id = e),
                      J(e, this),
                      (t = this).querySelector("style") &&
                        console.warn(
                          "dom-module %s has style outside template",
                          t.id
                        );
                  }
                  var t;
                },
              },
            ],
            [
              {
                key: "observedAttributes",
                get: function () {
                  return ["id"];
                },
              },
              {
                key: "import",
                value: function (e, t) {
                  if (e) {
                    var n = X(e);
                    return n && t ? n.querySelector(t) : n;
                  }
                  return null;
                },
              },
            ]
          ),
          t
        );
      })((0, l.Z)(HTMLElement));
      (Q.prototype.modules = K), customElements.define("dom-module", Q);
      var ee = "link[rel=import][type~=css]",
        te = "include",
        ne = "shady-unscoped";
      function ie(e) {
        return Q.import(e);
      }
      function re(e) {
        var t = e.body ? e.body : e,
          n = (0, Y.Rq)(t.textContent, e.baseURI),
          i = document.createElement("style");
        return (i.textContent = n), i;
      }
      function oe(e) {
        for (var t = e.trim().split(/\s+/), n = [], i = 0; i < t.length; i++)
          n.push.apply(n, (0, _.Z)(ae(t[i])));
        return n;
      }
      function ae(e) {
        var t = ie(e);
        if (!t)
          return (
            console.warn("Could not find style data in module named", e), []
          );
        if (void 0 === t._styles) {
          var n = [];
          n.push.apply(n, (0, _.Z)(le(t)));
          var i = t.querySelector("template");
          i && n.push.apply(n, (0, _.Z)(se(i, t.assetpath))), (t._styles = n);
        }
        return t._styles;
      }
      function se(e, t) {
        if (!e._styles) {
          for (
            var n = [], i = e.content.querySelectorAll("style"), r = 0;
            r < i.length;
            r++
          ) {
            var o = i[r],
              a = o.getAttribute(te);
            a &&
              n.push.apply(
                n,
                (0, _.Z)(
                  oe(a).filter(function (e, t, n) {
                    return n.indexOf(e) === t;
                  })
                )
              ),
              t && (o.textContent = (0, Y.Rq)(o.textContent, t)),
              n.push(o);
          }
          e._styles = n;
        }
        return e._styles;
      }
      function le(e) {
        for (var t = [], n = e.querySelectorAll(ee), i = 0; i < n.length; i++) {
          var r = n[i];
          if (r.import) {
            var o = r.import,
              a = r.hasAttribute(ne);
            if (a && !o._unscopedStyle) {
              var s = re(o);
              s.setAttribute(ne, ""), (o._unscopedStyle = s);
            } else o._style || (o._style = re(o));
            t.push(a ? o._unscopedStyle : o._style);
          }
        }
        return t;
      }
      var ue = n(76775),
        he =
          (n(22859),
          n(41353),
          n(96043),
          n(18098),
          n(17692),
          n(76843),
          n(80628),
          window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap
            ? window.ShadyDOM.wrap
            : window.ShadyDOM
            ? function (e) {
                return ShadyDOM.patch(e);
              }
            : function (e) {
                return e;
              });
      function ce(e) {
        return e.indexOf(".") >= 0;
      }
      function de(e) {
        var t = e.indexOf(".");
        return -1 === t ? e : e.slice(0, t);
      }
      function _e(e, t) {
        return 0 === e.indexOf(t + ".");
      }
      function pe(e, t) {
        return 0 === t.indexOf(e + ".");
      }
      function fe(e, t, n) {
        return t + n.slice(e.length);
      }
      function ve(e) {
        if (Array.isArray(e)) {
          for (var t = [], n = 0; n < e.length; n++)
            for (var i = e[n].toString().split("."), r = 0; r < i.length; r++)
              t.push(i[r]);
          return t.join(".");
        }
        return e;
      }
      function ye(e) {
        return Array.isArray(e) ? ve(e).split(".") : e.toString().split(".");
      }
      function me(e, t, n) {
        for (var i = e, r = ye(t), o = 0; o < r.length; o++) {
          if (!i) return;
          i = i[r[o]];
        }
        return n && (n.path = r.join(".")), i;
      }
      function ge(e, t, n) {
        var i = e,
          r = ye(t),
          o = r[r.length - 1];
        if (r.length > 1) {
          for (var a = 0; a < r.length - 1; a++) {
            if (!(i = i[r[a]])) return;
          }
          i[o] = n;
        } else i[t] = n;
        return r.join(".");
      }
      var be = {},
        ke = /-[a-z]/g,
        Ce = /([A-Z])/g;
      function Pe(e) {
        return (
          be[e] ||
          (be[e] =
            e.indexOf("-") < 0
              ? e
              : e.replace(ke, function (e) {
                  return e[1].toUpperCase();
                }))
        );
      }
      function we(e) {
        return be[e] || (be[e] = e.replace(Ce, "-$1").toLowerCase());
      }
      n(30419), n(88770), n(65974), n(10185);
      var xe = 0,
        Ie = 0,
        Ee = [],
        Se = 0,
        Te = !1,
        Ae = document.createTextNode("");
      new window.MutationObserver(function () {
        Te = !1;
        for (
          var e = Ee.length,
            t = function () {
              var e = Ee[n];
              if (e)
                try {
                  e();
                } catch (t) {
                  setTimeout(function () {
                    throw t;
                  });
                }
            },
            n = 0;
          n < e;
          n++
        )
          t();
        Ee.splice(0, e), (Ie += e);
      }).observe(Ae, { characterData: !0 });
      for (
        var Oe = {
            run: function (e) {
              return (
                Te || ((Te = !0), (Ae.textContent = Se++)), Ee.push(e), xe++
              );
            },
            cancel: function (e) {
              var t = e - Ie;
              if (t >= 0) {
                if (!Ee[t]) throw new Error("invalid async handle: " + e);
                Ee[t] = null;
              }
            },
          },
          Ze = W(function (e) {
            var t = (function (e) {
              function t() {
                var e;
                return (
                  (0, r.Z)(this, t),
                  ((e = (0, a.Z)(this, t)).__dataEnabled = !1),
                  (e.__dataReady = !1),
                  (e.__dataInvalid = !1),
                  (e.__data = {}),
                  (e.__dataPending = null),
                  (e.__dataOld = null),
                  (e.__dataInstanceProps = null),
                  (e.__dataCounter = 0),
                  (e.__serializing = !1),
                  e._initializeProperties(),
                  e
                );
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "_createPropertyAccessor",
                      value: function (e, t) {
                        this._addPropertyToAttributeMap(e),
                          this.hasOwnProperty(
                            JSCompiler_renameProperty("__dataHasAccessor", this)
                          ) ||
                            (this.__dataHasAccessor = Object.assign(
                              {},
                              this.__dataHasAccessor
                            )),
                          this.__dataHasAccessor[e] ||
                            ((this.__dataHasAccessor[e] = !0),
                            this._definePropertyAccessor(e, t));
                      },
                    },
                    {
                      key: "_addPropertyToAttributeMap",
                      value: function (e) {
                        this.hasOwnProperty(
                          JSCompiler_renameProperty("__dataAttributes", this)
                        ) ||
                          (this.__dataAttributes = Object.assign(
                            {},
                            this.__dataAttributes
                          ));
                        var t = this.__dataAttributes[e];
                        return (
                          t ||
                            ((t = this.constructor.attributeNameForProperty(e)),
                            (this.__dataAttributes[t] = e)),
                          t
                        );
                      },
                    },
                    {
                      key: "_definePropertyAccessor",
                      value: function (e, t) {
                        Object.defineProperty(this, e, {
                          get: function () {
                            return this.__data[e];
                          },
                          set: t
                            ? function () {}
                            : function (t) {
                                this._setPendingProperty(e, t, !0) &&
                                  this._invalidateProperties();
                              },
                        });
                      },
                    },
                    {
                      key: "ready",
                      value: function () {
                        (this.__dataReady = !0), this._flushProperties();
                      },
                    },
                    {
                      key: "_initializeProperties",
                      value: function () {
                        for (var e in this.__dataHasAccessor)
                          this.hasOwnProperty(e) &&
                            ((this.__dataInstanceProps =
                              this.__dataInstanceProps || {}),
                            (this.__dataInstanceProps[e] = this[e]),
                            delete this[e]);
                      },
                    },
                    {
                      key: "_initializeInstanceProperties",
                      value: function (e) {
                        Object.assign(this, e);
                      },
                    },
                    {
                      key: "_setProperty",
                      value: function (e, t) {
                        this._setPendingProperty(e, t) &&
                          this._invalidateProperties();
                      },
                    },
                    {
                      key: "_getProperty",
                      value: function (e) {
                        return this.__data[e];
                      },
                    },
                    {
                      key: "_setPendingProperty",
                      value: function (e, t, n) {
                        var i = this.__data[e],
                          r = this._shouldPropertyChange(e, t, i);
                        return (
                          r &&
                            (this.__dataPending ||
                              ((this.__dataPending = {}),
                              (this.__dataOld = {})),
                            this.__dataOld &&
                              !(e in this.__dataOld) &&
                              (this.__dataOld[e] = i),
                            (this.__data[e] = t),
                            (this.__dataPending[e] = t)),
                          r
                        );
                      },
                    },
                    {
                      key: "_isPropertyPending",
                      value: function (e) {
                        return !(
                          !this.__dataPending ||
                          !this.__dataPending.hasOwnProperty(e)
                        );
                      },
                    },
                    {
                      key: "_invalidateProperties",
                      value: function () {
                        var e = this;
                        !this.__dataInvalid &&
                          this.__dataReady &&
                          ((this.__dataInvalid = !0),
                          Oe.run(function () {
                            e.__dataInvalid &&
                              ((e.__dataInvalid = !1), e._flushProperties());
                          }));
                      },
                    },
                    {
                      key: "_enableProperties",
                      value: function () {
                        this.__dataEnabled ||
                          ((this.__dataEnabled = !0),
                          this.__dataInstanceProps &&
                            (this._initializeInstanceProperties(
                              this.__dataInstanceProps
                            ),
                            (this.__dataInstanceProps = null)),
                          this.ready());
                      },
                    },
                    {
                      key: "_flushProperties",
                      value: function () {
                        this.__dataCounter++;
                        var e = this.__data,
                          t = this.__dataPending,
                          n = this.__dataOld;
                        this._shouldPropertiesChange(e, t, n) &&
                          ((this.__dataPending = null),
                          (this.__dataOld = null),
                          this._propertiesChanged(e, t, n)),
                          this.__dataCounter--;
                      },
                    },
                    {
                      key: "_shouldPropertiesChange",
                      value: function (e, t, n) {
                        return Boolean(t);
                      },
                    },
                    { key: "_propertiesChanged", value: function (e, t, n) {} },
                    {
                      key: "_shouldPropertyChange",
                      value: function (e, t, n) {
                        return n !== t && (n == n || t == t);
                      },
                    },
                    {
                      key: "attributeChangedCallback",
                      value: function (e, n, i, r) {
                        n !== i && this._attributeToProperty(e, i),
                          (0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "attributeChangedCallback",
                            this
                          ) &&
                            (0, c.Z)(
                              (0, d.Z)(t.prototype),
                              "attributeChangedCallback",
                              this
                            ).call(this, e, n, i, r);
                      },
                    },
                    {
                      key: "_attributeToProperty",
                      value: function (e, t, n) {
                        if (!this.__serializing) {
                          var i = this.__dataAttributes,
                            r = (i && i[e]) || e;
                          this[r] = this._deserializeValue(
                            t,
                            n || this.constructor.typeForProperty(r)
                          );
                        }
                      },
                    },
                    {
                      key: "_propertyToAttribute",
                      value: function (e, t, n) {
                        (this.__serializing = !0),
                          (n = arguments.length < 3 ? this[e] : n),
                          this._valueToNodeAttribute(
                            this,
                            n,
                            t || this.constructor.attributeNameForProperty(e)
                          ),
                          (this.__serializing = !1);
                      },
                    },
                    {
                      key: "_valueToNodeAttribute",
                      value: function (e, t, n) {
                        var i = this._serializeValue(t);
                        ("class" !== n && "name" !== n && "slot" !== n) ||
                          (e = he(e)),
                          void 0 === i
                            ? e.removeAttribute(n)
                            : e.setAttribute(
                                n,
                                "" === i && window.trustedTypes
                                  ? window.trustedTypes.emptyScript
                                  : i
                              );
                      },
                    },
                    {
                      key: "_serializeValue",
                      value: function (e) {
                        return "boolean" === (0, ue.Z)(e)
                          ? e
                            ? ""
                            : void 0
                          : null != e
                          ? e.toString()
                          : void 0;
                      },
                    },
                    {
                      key: "_deserializeValue",
                      value: function (e, t) {
                        switch (t) {
                          case Boolean:
                            return null !== e;
                          case Number:
                            return Number(e);
                          default:
                            return e;
                        }
                      },
                    },
                  ],
                  [
                    {
                      key: "createProperties",
                      value: function (e) {
                        var t = this.prototype;
                        for (var n in e)
                          (n in t) || t._createPropertyAccessor(n);
                      },
                    },
                    {
                      key: "attributeNameForProperty",
                      value: function (e) {
                        return e.toLowerCase();
                      },
                    },
                    { key: "typeForProperty", value: function (e) {} },
                  ]
                ),
                t
              );
            })(e);
            return t;
          }),
          Ve = {},
          Ne = HTMLElement.prototype;
        Ne;

      ) {
        for (
          var Le = Object.getOwnPropertyNames(Ne), ze = 0;
          ze < Le.length;
          ze++
        )
          Ve[Le[ze]] = !0;
        Ne = Object.getPrototypeOf(Ne);
      }
      var Re = window.trustedTypes
        ? function (e) {
            return (
              trustedTypes.isHTML(e) ||
              trustedTypes.isScript(e) ||
              trustedTypes.isScriptURL(e)
            );
          }
        : function () {
            return !1;
          };
      var Me = W(function (e) {
          var t = (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "_initializeProperties",
                    value: function () {
                      this.__dataProto &&
                        (this._initializeProtoProperties(this.__dataProto),
                        (this.__dataProto = null)),
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_initializeProperties",
                          this
                        ).call(this);
                    },
                  },
                  {
                    key: "_initializeProtoProperties",
                    value: function (e) {
                      for (var t in e) this._setProperty(t, e[t]);
                    },
                  },
                  {
                    key: "_ensureAttribute",
                    value: function (e, t) {
                      this.hasAttribute(e) ||
                        this._valueToNodeAttribute(this, t, e);
                    },
                  },
                  {
                    key: "_serializeValue",
                    value: function (e) {
                      if ("object" === (0, ue.Z)(e)) {
                        if (e instanceof Date) return e.toString();
                        if (e) {
                          if (Re(e)) return e;
                          try {
                            return JSON.stringify(e);
                          } catch (n) {
                            return "";
                          }
                        }
                      }
                      return (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "_serializeValue",
                        this
                      ).call(this, e);
                    },
                  },
                  {
                    key: "_deserializeValue",
                    value: function (e, n) {
                      var i;
                      switch (n) {
                        case Object:
                          try {
                            i = JSON.parse(e);
                          } catch (r) {
                            i = e;
                          }
                          break;
                        case Array:
                          try {
                            i = JSON.parse(e);
                          } catch (r) {
                            (i = null),
                              console.warn(
                                "Polymer::Attributes: couldn't decode Array as JSON: ".concat(
                                  e
                                )
                              );
                          }
                          break;
                        case Date:
                          (i = isNaN(e) ? String(e) : Number(e)),
                            (i = new Date(i));
                          break;
                        default:
                          i = (0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "_deserializeValue",
                            this
                          ).call(this, e, n);
                      }
                      return i;
                    },
                  },
                  {
                    key: "_definePropertyAccessor",
                    value: function (e, n) {
                      !(function (e, t) {
                        if (!Ve[t]) {
                          var n = e[t];
                          void 0 !== n &&
                            (e.__data
                              ? e._setPendingProperty(t, n)
                              : (e.__dataProto
                                  ? e.hasOwnProperty(
                                      JSCompiler_renameProperty(
                                        "__dataProto",
                                        e
                                      )
                                    ) ||
                                    (e.__dataProto = Object.create(
                                      e.__dataProto
                                    ))
                                  : (e.__dataProto = {}),
                                (e.__dataProto[t] = n)));
                        }
                      })(this, e),
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_definePropertyAccessor",
                          this
                        ).call(this, e, n);
                    },
                  },
                  {
                    key: "_hasAccessor",
                    value: function (e) {
                      return (
                        this.__dataHasAccessor && this.__dataHasAccessor[e]
                      );
                    },
                  },
                  {
                    key: "_isPropertyPending",
                    value: function (e) {
                      return Boolean(
                        this.__dataPending && e in this.__dataPending
                      );
                    },
                  },
                ],
                [
                  {
                    key: "createPropertiesForAttributes",
                    value: function () {
                      for (
                        var e = this.observedAttributes, t = 0;
                        t < e.length;
                        t++
                      )
                        this.prototype._createPropertyAccessor(Pe(e[t]));
                    },
                  },
                  {
                    key: "attributeNameForProperty",
                    value: function (e) {
                      return we(e);
                    },
                  },
                ]
              ),
              t
            );
          })(Ze(e));
          return t;
        }),
        Fe = { "dom-if": !0, "dom-repeat": !0 },
        De = !1,
        He = !1;
      function Be(e) {
        (function () {
          if (!De) {
            De = !0;
            var e = document.createElement("textarea");
            (e.placeholder = "a"), (He = e.placeholder === e.textContent);
          }
          return He;
        })() &&
          "textarea" === e.localName &&
          e.placeholder &&
          e.placeholder === e.textContent &&
          (e.textContent = null);
      }
      var je,
        qe =
          ((je =
            window.trustedTypes &&
            window.trustedTypes.createPolicy(
              "polymer-template-event-attribute-policy",
              {
                createScript: function (e) {
                  return e;
                },
              }
            )),
          function (e, t, n) {
            var i = t.getAttribute(n);
            je && n.startsWith("on-")
              ? e.setAttribute(n, je.createScript(i, n))
              : e.setAttribute(n, i);
          });
      function Ue(e) {
        var t = e.getAttribute("is");
        if (t && Fe[t]) {
          var n = e;
          for (
            n.removeAttribute("is"),
              e = n.ownerDocument.createElement(t),
              n.parentNode.replaceChild(e, n),
              e.appendChild(n);
            n.attributes.length;

          ) {
            var i = n.attributes[0].name;
            qe(e, n, i), n.removeAttribute(i);
          }
        }
        return e;
      }
      function $e(e, t) {
        var n = t.parentInfo && $e(e, t.parentInfo);
        if (!n) return e;
        for (var i = n.firstChild, r = 0; i; i = i.nextSibling)
          if (t.parentIndex === r++) return i;
      }
      function We(e, t, n, i) {
        i.id && (t[i.id] = n);
      }
      function Ye(e, t, n) {
        if (n.events && n.events.length)
          for (var i, r = 0, o = n.events; r < o.length && (i = o[r]); r++)
            e._addMethodEventListenerToNode(t, i.name, i.value, e);
      }
      function Ke(e, t, n, i) {
        n.templateInfo &&
          ((t._templateInfo = n.templateInfo), (t._parentTemplateInfo = i));
      }
      var Ge = W(function (e) {
          var t = (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "_stampTemplate",
                    value: function (e, t) {
                      e &&
                        !e.content &&
                        window.HTMLTemplateElement &&
                        HTMLTemplateElement.decorate &&
                        HTMLTemplateElement.decorate(e);
                      var n = (t = t || this.constructor._parseTemplate(e))
                          .nodeInfoList,
                        i = t.content || e.content,
                        r = document.importNode(i, !0);
                      r.__noInsertionPoint = !t.hasInsertionPoint;
                      var o = (r.nodeList = new Array(n.length));
                      r.$ = {};
                      for (
                        var a, s = 0, l = n.length;
                        s < l && (a = n[s]);
                        s++
                      ) {
                        var u = (o[s] = $e(r, a));
                        We(0, r.$, u, a), Ke(0, u, a, t), Ye(this, u, a);
                      }
                      return r;
                    },
                  },
                  {
                    key: "_addMethodEventListenerToNode",
                    value: function (e, t, n, i) {
                      var r = (function (e, t, n) {
                        return (
                          (e = e._methodHost || e),
                          function (t) {
                            e[n]
                              ? e[n](t, t.detail)
                              : console.warn(
                                  "listener method `" + n + "` not defined"
                                );
                          }
                        );
                      })((i = i || e), 0, n);
                      return this._addEventListenerToNode(e, t, r), r;
                    },
                  },
                  {
                    key: "_addEventListenerToNode",
                    value: function (e, t, n) {
                      e.addEventListener(t, n);
                    },
                  },
                  {
                    key: "_removeEventListenerFromNode",
                    value: function (e, t, n) {
                      e.removeEventListener(t, n);
                    },
                  },
                ],
                [
                  {
                    key: "_parseTemplate",
                    value: function (e, t) {
                      if (!e._templateInfo) {
                        var n = (e._templateInfo = {});
                        (n.nodeInfoList = []),
                          (n.nestedTemplate = Boolean(t)),
                          (n.stripWhiteSpace =
                            (t && t.stripWhiteSpace) ||
                            (e.hasAttribute &&
                              e.hasAttribute("strip-whitespace"))),
                          this._parseTemplateContent(e, n, { parent: null });
                      }
                      return e._templateInfo;
                    },
                  },
                  {
                    key: "_parseTemplateContent",
                    value: function (e, t, n) {
                      return this._parseTemplateNode(e.content, t, n);
                    },
                  },
                  {
                    key: "_parseTemplateNode",
                    value: function (e, t, n) {
                      var i = !1,
                        r = e;
                      return (
                        "template" != r.localName ||
                        r.hasAttribute("preserve-content")
                          ? "slot" === r.localName && (t.hasInsertionPoint = !0)
                          : (i =
                              this._parseTemplateNestedTemplate(r, t, n) || i),
                        Be(r),
                        r.firstChild && this._parseTemplateChildNodes(r, t, n),
                        r.hasAttributes &&
                          r.hasAttributes() &&
                          (i = this._parseTemplateNodeAttributes(r, t, n) || i),
                        i || n.noted
                      );
                    },
                  },
                  {
                    key: "_parseTemplateChildNodes",
                    value: function (e, t, n) {
                      if ("script" !== e.localName && "style" !== e.localName)
                        for (var i, r = e.firstChild, o = 0; r; r = i) {
                          if (
                            ("template" == r.localName && (r = Ue(r)),
                            (i = r.nextSibling),
                            r.nodeType === Node.TEXT_NODE)
                          ) {
                            for (
                              var a = i;
                              a && a.nodeType === Node.TEXT_NODE;

                            )
                              (r.textContent += a.textContent),
                                (i = a.nextSibling),
                                e.removeChild(a),
                                (a = i);
                            if (t.stripWhiteSpace && !r.textContent.trim()) {
                              e.removeChild(r);
                              continue;
                            }
                          }
                          var s = { parentIndex: o, parentInfo: n };
                          this._parseTemplateNode(r, t, s) &&
                            (s.infoIndex = t.nodeInfoList.push(s) - 1),
                            r.parentNode && o++;
                        }
                    },
                  },
                  {
                    key: "_parseTemplateNestedTemplate",
                    value: function (e, t, n) {
                      var i = e,
                        r = this._parseTemplate(i, t);
                      return (
                        (r.content =
                          i.content.ownerDocument.createDocumentFragment()).appendChild(
                          i.content
                        ),
                        (n.templateInfo = r),
                        !0
                      );
                    },
                  },
                  {
                    key: "_parseTemplateNodeAttributes",
                    value: function (e, t, n) {
                      for (
                        var i,
                          r = !1,
                          o = Array.from(e.attributes),
                          a = o.length - 1;
                        (i = o[a]);
                        a--
                      )
                        r =
                          this._parseTemplateNodeAttribute(
                            e,
                            t,
                            n,
                            i.name,
                            i.value
                          ) || r;
                      return r;
                    },
                  },
                  {
                    key: "_parseTemplateNodeAttribute",
                    value: function (e, t, n, i, r) {
                      return "on-" === i.slice(0, 3)
                        ? (e.removeAttribute(i),
                          (n.events = n.events || []),
                          n.events.push({ name: i.slice(3), value: r }),
                          !0)
                        : "id" === i && ((n.id = r), !0);
                    },
                  },
                  {
                    key: "_contentForTemplate",
                    value: function (e) {
                      var t = e._templateInfo;
                      return (t && t.content) || e.content;
                    },
                  },
                ]
              ),
              t
            );
          })(e);
          return t;
        }),
        Je = 0,
        Xe = [],
        Qe = {
          COMPUTE: "__computeEffects",
          REFLECT: "__reflectEffects",
          NOTIFY: "__notifyEffects",
          PROPAGATE: "__propagateEffects",
          OBSERVE: "__observeEffects",
          READ_ONLY: "__readOnly",
        },
        et = "__computeInfo",
        tt = /[A-Z]/;
      function nt(e, t, n) {
        var i = e[t];
        if (i) {
          if (!e.hasOwnProperty(t) && ((i = e[t] = Object.create(e[t])), n))
            for (var r in i)
              for (
                var o = i[r], a = (i[r] = Array(o.length)), s = 0;
                s < o.length;
                s++
              )
                a[s] = o[s];
        } else i = e[t] = {};
        return i;
      }
      function it(e, t, n, i, r, o) {
        if (t) {
          var a = !1,
            s = Je++;
          for (var l in n) {
            var u = t[r ? de(l) : l];
            if (u)
              for (var h, c = 0, d = u.length; c < d && (h = u[c]); c++)
                (h.info && h.info.lastRun === s) ||
                  (r && !ot(l, h.trigger)) ||
                  (h.info && (h.info.lastRun = s),
                  h.fn(e, l, n, i, h.info, r, o),
                  (a = !0));
          }
          return a;
        }
        return !1;
      }
      function rt(e, t, n, i, r, o, a, s) {
        var l = !1,
          u = t[a ? de(i) : i];
        if (u)
          for (var h, c = 0, d = u.length; c < d && (h = u[c]); c++)
            (h.info && h.info.lastRun === n) ||
              (a && !ot(i, h.trigger)) ||
              (h.info && (h.info.lastRun = n),
              h.fn(e, i, r, o, h.info, a, s),
              (l = !0));
        return l;
      }
      function ot(e, t) {
        if (t) {
          var n = t.name;
          return (
            n == e ||
            !(!t.structured || !_e(n, e)) ||
            !(!t.wildcard || !pe(n, e))
          );
        }
        return !0;
      }
      function at(e, t, n, i, r) {
        var o = "string" == typeof r.method ? e[r.method] : r.method,
          a = r.property;
        o
          ? o.call(e, e.__data[a], i[a])
          : r.dynamicFn ||
            console.warn("observer method `" + r.method + "` not defined");
      }
      function st(e, t, n) {
        var i = de(t);
        return i !== t && (lt(e, we(i) + "-changed", n[t], t), !0);
      }
      function lt(e, t, n, i) {
        var r = { value: n, queueProperty: !0 };
        i && (r.path = i),
          he(e).dispatchEvent(new CustomEvent(t, { detail: r }));
      }
      function ut(e, t, n, i, r, o) {
        var a = (o ? de(t) : t) != t ? t : null,
          s = a ? me(e, a) : e.__data[t];
        a && void 0 === s && (s = n[t]), lt(e, r.eventName, s, a);
      }
      function ht(e, t, n, i, r) {
        var o = e.__data[t];
        q.v1 && (o = (0, q.v1)(o, r.attrName, "attribute", e)),
          e._propertyToAttribute(t, r.attrName, o);
      }
      function ct(e, t, n, i) {
        var r = e[Qe.COMPUTE];
        if (r)
          if (q.ls) {
            Je++;
            var o,
              a = (function (e) {
                var t = e.constructor.__orderedComputedDeps;
                if (!t) {
                  t = new Map();
                  for (
                    var n,
                      i = e[Qe.COMPUTE],
                      r = (function (e) {
                        var t = e[et],
                          n = {},
                          i = e[Qe.COMPUTE],
                          r = [],
                          o = 0;
                        for (var a in t) {
                          var s = t[a];
                          o += n[a] =
                            s.args.filter(function (e) {
                              return !e.literal;
                            }).length + (s.dynamicFn ? 1 : 0);
                        }
                        for (var l in i) t[l] || r.push(l);
                        return { counts: n, ready: r, total: o };
                      })(e),
                      o = r.counts,
                      a = r.ready,
                      s = r.total;
                    (n = a.shift());

                  ) {
                    t.set(n, t.size);
                    var l = i[n];
                    l &&
                      l.forEach(function (e) {
                        var t = e.info.methodInfo;
                        --s, 0 == --o[t] && a.push(t);
                      });
                  }
                  if (0 !== s) {
                    var u = e;
                    console.warn(
                      "Computed graph for ".concat(
                        u.localName,
                        " incomplete; circular?"
                      )
                    );
                  }
                  e.constructor.__orderedComputedDeps = t;
                }
                return t;
              })(e),
              s = [];
            for (var l in t) _t(l, r, s, a, i);
            for (; (o = s.shift()); )
              pt(e, "", t, n, o) && _t(o.methodInfo, r, s, a, i);
            Object.assign(n, e.__dataOld),
              Object.assign(t, e.__dataPending),
              (e.__dataPending = null);
          } else
            for (var u = t; it(e, r, u, n, i); )
              Object.assign(n, e.__dataOld),
                Object.assign(t, e.__dataPending),
                (u = e.__dataPending),
                (e.__dataPending = null);
      }
      var dt = function (e, t, n) {
          for (var i = 0, r = t.length - 1, o = -1; i <= r; ) {
            var a = (i + r) >> 1,
              s = n.get(t[a].methodInfo) - n.get(e.methodInfo);
            if (s < 0) i = a + 1;
            else {
              if (!(s > 0)) {
                o = a;
                break;
              }
              r = a - 1;
            }
          }
          o < 0 && (o = r + 1), t.splice(o, 0, e);
        },
        _t = function (e, t, n, i, r) {
          var o = t[r ? de(e) : e];
          if (o)
            for (var a = 0; a < o.length; a++) {
              var s = o[a];
              s.info.lastRun === Je ||
                (r && !ot(e, s.trigger)) ||
                ((s.info.lastRun = Je), dt(s.info, n, i));
            }
        };
      function pt(e, t, n, i, r) {
        var o = kt(e, t, n, i, r);
        if (o === Xe) return !1;
        var a = r.methodInfo;
        return e.__dataHasAccessor && e.__dataHasAccessor[a]
          ? e._setPendingProperty(a, o, !0)
          : ((e[a] = o), !1);
      }
      function ft(e, t, n, i, r, o, a) {
        n.bindings = n.bindings || [];
        var s = {
          kind: i,
          target: r,
          parts: o,
          literal: a,
          isCompound: 1 !== o.length,
        };
        if (
          (n.bindings.push(s),
          (function (e) {
            return (
              Boolean(e.target) &&
              "attribute" != e.kind &&
              "text" != e.kind &&
              !e.isCompound &&
              "{" === e.parts[0].mode
            );
          })(s))
        ) {
          var l = s.parts[0],
            u = l.event,
            h = l.negate;
          (s.listenerEvent = u || we(r) + "-changed"), (s.listenerNegate = h);
        }
        for (var c = t.nodeInfoList.length, d = 0; d < s.parts.length; d++) {
          var _ = s.parts[d];
          (_.compoundIndex = d), vt(e, t, s, _, c);
        }
      }
      function vt(e, t, n, i, r) {
        if (!i.literal)
          if ("attribute" === n.kind && "-" === n.target[0])
            console.warn(
              "Cannot set attribute " +
                n.target +
                ' because "-" is not a valid attribute starting character'
            );
          else
            for (
              var o = i.dependencies,
                a = { index: r, binding: n, part: i, evaluator: e },
                s = 0;
              s < o.length;
              s++
            ) {
              var l = o[s];
              "string" == typeof l && ((l = St(l)).wildcard = !0),
                e._addTemplatePropertyEffect(t, l.rootProperty, {
                  fn: yt,
                  info: a,
                  trigger: l,
                });
            }
      }
      function yt(e, t, n, i, r, o, a) {
        var s = a[r.index],
          l = r.binding,
          u = r.part;
        if (
          o &&
          u.source &&
          t.length > u.source.length &&
          "property" == l.kind &&
          !l.isCompound &&
          s.__isPropertyEffectsClient &&
          s.__dataHasAccessor &&
          s.__dataHasAccessor[l.target]
        ) {
          var h = n[t];
          (t = fe(u.source, l.target, t)),
            s._setPendingPropertyOrPath(t, h, !1, !0) && e._enqueueClient(s);
        } else {
          var c = r.evaluator._evaluateBinding(e, u, t, n, i, o);
          c !== Xe &&
            (function (e, t, n, i, r) {
              (r = (function (e, t, n, i) {
                if (n.isCompound) {
                  var r = e.__dataCompoundStorage[n.target];
                  (r[i.compoundIndex] = t), (t = r.join(""));
                }
                "attribute" !== n.kind &&
                  (("textContent" !== n.target &&
                    ("value" !== n.target ||
                      ("input" !== e.localName &&
                        "textarea" !== e.localName))) ||
                    (t = null == t ? "" : t));
                return t;
              })(t, r, n, i)),
                q.v1 && (r = (0, q.v1)(r, n.target, n.kind, t));
              if ("attribute" == n.kind)
                e._valueToNodeAttribute(t, r, n.target);
              else {
                var o = n.target;
                t.__isPropertyEffectsClient &&
                t.__dataHasAccessor &&
                t.__dataHasAccessor[o]
                  ? (t[Qe.READ_ONLY] && t[Qe.READ_ONLY][o]) ||
                    (t._setPendingProperty(o, r) && e._enqueueClient(t))
                  : e._setUnmanagedPropertyToNode(t, o, r);
              }
            })(e, s, l, u, c);
        }
      }
      function mt(e, t) {
        if (t.isCompound) {
          for (
            var n = e.__dataCompoundStorage || (e.__dataCompoundStorage = {}),
              i = t.parts,
              r = new Array(i.length),
              o = 0;
            o < i.length;
            o++
          )
            r[o] = i[o].literal;
          var a = t.target;
          (n[a] = r),
            t.literal &&
              "property" == t.kind &&
              ("className" === a && (e = he(e)), (e[a] = t.literal));
        }
      }
      function gt(e, t, n) {
        if (n.listenerEvent) {
          var i = n.parts[0];
          e.addEventListener(n.listenerEvent, function (e) {
            !(function (e, t, n, i, r) {
              var o,
                a = e.detail,
                s = a && a.path;
              s
                ? ((i = fe(n, i, s)), (o = a && a.value))
                : (o = e.currentTarget[n]),
                (o = r ? !o : o),
                (t[Qe.READ_ONLY] && t[Qe.READ_ONLY][i]) ||
                  !t._setPendingPropertyOrPath(i, o, !0, Boolean(s)) ||
                  (a && a.queueProperty) ||
                  t._invalidateProperties();
            })(e, t, n.target, i.source, i.negate);
          });
        }
      }
      function bt(e, t, n, i, r, o) {
        o = t.static || (o && ("object" !== (0, ue.Z)(o) || o[t.methodName]));
        for (
          var a,
            s = {
              methodName: t.methodName,
              args: t.args,
              methodInfo: r,
              dynamicFn: o,
            },
            l = 0;
          l < t.args.length && (a = t.args[l]);
          l++
        )
          a.literal ||
            e._addPropertyEffect(a.rootProperty, n, {
              fn: i,
              info: s,
              trigger: a,
            });
        return (
          o && e._addPropertyEffect(t.methodName, n, { fn: i, info: s }), s
        );
      }
      function kt(e, t, n, i, r) {
        var o = e._methodHost || e,
          a = o[r.methodName];
        if (a) {
          var s = e._marshalArgs(r.args, t, n);
          return s === Xe ? Xe : a.apply(o, s);
        }
        r.dynamicFn ||
          console.warn("method `" + r.methodName + "` not defined");
      }
      var Ct = [],
        Pt = "(?:[a-zA-Z_$][\\w.:$\\-*]*)",
        wt =
          "(?:(" +
          Pt +
          "|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",
        xt = new RegExp(
          "(\\[\\[|{{)\\s*(?:(!)\\s*)?" +
            ("(" +
              Pt +
              "\\s*" +
              ("(?:\\(\\s*(?:" +
                ("(?:" + wt + "(?:,\\s*" + wt + ")*)") +
                "?)\\)\\s*)") +
              "?)") +
            "(?:]]|}})",
          "g"
        );
      function It(e) {
        for (var t = "", n = 0; n < e.length; n++) {
          t += e[n].literal || "";
        }
        return t;
      }
      function Et(e) {
        var t = e.match(/([^\s]+?)\(([\s\S]*)\)/);
        if (t) {
          var n = { methodName: t[1], static: !0, args: Ct };
          return t[2].trim()
            ? (function (e, t) {
                return (
                  (t.args = e.map(function (e) {
                    var n = St(e);
                    return n.literal || (t.static = !1), n;
                  }, this)),
                  t
                );
              })(t[2].replace(/\\,/g, "&comma;").split(","), n)
            : n;
        }
        return null;
      }
      function St(e) {
        var t = e
            .trim()
            .replace(/&comma;/g, ",")
            .replace(/\\(.)/g, "$1"),
          n = { name: t, value: "", literal: !1 },
          i = t[0];
        switch (
          ("-" === i && (i = t[1]), i >= "0" && i <= "9" && (i = "#"), i)
        ) {
          case "'":
          case '"':
            (n.value = t.slice(1, -1)), (n.literal = !0);
            break;
          case "#":
            (n.value = Number(t)), (n.literal = !0);
        }
        return (
          n.literal ||
            ((n.rootProperty = de(t)),
            (n.structured = ce(t)),
            n.structured &&
              ((n.wildcard = ".*" == t.slice(-2)),
              n.wildcard && (n.name = t.slice(0, -2)))),
          n
        );
      }
      function Tt(e, t, n) {
        var i = me(e, n);
        return void 0 === i && (i = t[n]), i;
      }
      function At(e, t, n, i) {
        var r = { indexSplices: i };
        q.HY && !e._overrideLegacyUndefined && (t.splices = r),
          e.notifyPath(n + ".splices", r),
          e.notifyPath(n + ".length", t.length),
          q.HY && !e._overrideLegacyUndefined && (r.indexSplices = []);
      }
      function Ot(e, t, n, i, r, o) {
        At(e, t, n, [
          { index: i, addedCount: r, removed: o, object: t, type: "splice" },
        ]);
      }
      var Zt = W(function (e) {
          var t = Ge(Me(e)),
            n = (function (e) {
              function n() {
                var e;
                return (
                  (0, r.Z)(this, n),
                  ((e = (0, a.Z)(this, n)).__isPropertyEffectsClient = !0),
                  e.__dataClientsReady,
                  e.__dataPendingClients,
                  e.__dataToNotify,
                  e.__dataLinkedPaths,
                  e.__dataHasPaths,
                  e.__dataCompoundStorage,
                  e.__dataHost,
                  e.__dataTemp,
                  e.__dataClientsInitialized,
                  e.__data,
                  e.__dataPending,
                  e.__dataOld,
                  e.__computeEffects,
                  e.__computeInfo,
                  e.__reflectEffects,
                  e.__notifyEffects,
                  e.__propagateEffects,
                  e.__observeEffects,
                  e.__readOnly,
                  e.__templateInfo,
                  e._overrideLegacyUndefined,
                  e
                );
              }
              return (
                (0, s.Z)(n, e),
                (0, o.Z)(
                  n,
                  [
                    {
                      key: "PROPERTY_EFFECT_TYPES",
                      get: function () {
                        return Qe;
                      },
                    },
                    {
                      key: "_initializeProperties",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(n.prototype),
                          "_initializeProperties",
                          this
                        ).call(this),
                          this._registerHost(),
                          (this.__dataClientsReady = !1),
                          (this.__dataPendingClients = null),
                          (this.__dataToNotify = null),
                          (this.__dataLinkedPaths = null),
                          (this.__dataHasPaths = !1),
                          (this.__dataCompoundStorage =
                            this.__dataCompoundStorage || null),
                          (this.__dataHost = this.__dataHost || null),
                          (this.__dataTemp = {}),
                          (this.__dataClientsInitialized = !1);
                      },
                    },
                    {
                      key: "_registerHost",
                      value: function () {
                        if (Vt.length) {
                          var e = Vt[Vt.length - 1];
                          e._enqueueClient(this), (this.__dataHost = e);
                        }
                      },
                    },
                    {
                      key: "_initializeProtoProperties",
                      value: function (e) {
                        (this.__data = Object.create(e)),
                          (this.__dataPending = Object.create(e)),
                          (this.__dataOld = {});
                      },
                    },
                    {
                      key: "_initializeInstanceProperties",
                      value: function (e) {
                        var t = this[Qe.READ_ONLY];
                        for (var n in e)
                          (t && t[n]) ||
                            ((this.__dataPending = this.__dataPending || {}),
                            (this.__dataOld = this.__dataOld || {}),
                            (this.__data[n] = this.__dataPending[n] = e[n]));
                      },
                    },
                    {
                      key: "_addPropertyEffect",
                      value: function (e, t, n) {
                        this._createPropertyAccessor(e, t == Qe.READ_ONLY);
                        var i = nt(this, t, !0)[e];
                        i || (i = this[t][e] = []), i.push(n);
                      },
                    },
                    {
                      key: "_removePropertyEffect",
                      value: function (e, t, n) {
                        var i = nt(this, t, !0)[e],
                          r = i.indexOf(n);
                        r >= 0 && i.splice(r, 1);
                      },
                    },
                    {
                      key: "_hasPropertyEffect",
                      value: function (e, t) {
                        var n = this[t];
                        return Boolean(n && n[e]);
                      },
                    },
                    {
                      key: "_hasReadOnlyEffect",
                      value: function (e) {
                        return this._hasPropertyEffect(e, Qe.READ_ONLY);
                      },
                    },
                    {
                      key: "_hasNotifyEffect",
                      value: function (e) {
                        return this._hasPropertyEffect(e, Qe.NOTIFY);
                      },
                    },
                    {
                      key: "_hasReflectEffect",
                      value: function (e) {
                        return this._hasPropertyEffect(e, Qe.REFLECT);
                      },
                    },
                    {
                      key: "_hasComputedEffect",
                      value: function (e) {
                        return this._hasPropertyEffect(e, Qe.COMPUTE);
                      },
                    },
                    {
                      key: "_setPendingPropertyOrPath",
                      value: function (e, t, i, r) {
                        if (r || de(Array.isArray(e) ? e[0] : e) !== e) {
                          if (!r) {
                            var o = me(this, e);
                            if (
                              !(e = ge(this, e, t)) ||
                              !(0, c.Z)(
                                (0, d.Z)(n.prototype),
                                "_shouldPropertyChange",
                                this
                              ).call(this, e, t, o)
                            )
                              return !1;
                          }
                          if (
                            ((this.__dataHasPaths = !0),
                            this._setPendingProperty(e, t, i))
                          )
                            return (
                              (function (e, t, n) {
                                var i,
                                  r = e.__dataLinkedPaths;
                                if (r)
                                  for (var o in r) {
                                    var a = r[o];
                                    pe(o, t)
                                      ? ((i = fe(o, a, t)),
                                        e._setPendingPropertyOrPath(
                                          i,
                                          n,
                                          !0,
                                          !0
                                        ))
                                      : pe(a, t) &&
                                        ((i = fe(a, o, t)),
                                        e._setPendingPropertyOrPath(
                                          i,
                                          n,
                                          !0,
                                          !0
                                        ));
                                  }
                              })(this, e, t),
                              !0
                            );
                        } else {
                          if (
                            this.__dataHasAccessor &&
                            this.__dataHasAccessor[e]
                          )
                            return this._setPendingProperty(e, t, i);
                          this[e] = t;
                        }
                        return !1;
                      },
                    },
                    {
                      key: "_setUnmanagedPropertyToNode",
                      value: function (e, t, n) {
                        (n === e[t] && "object" != (0, ue.Z)(n)) ||
                          ("className" === t && (e = he(e)), (e[t] = n));
                      },
                    },
                    {
                      key: "_setPendingProperty",
                      value: function (e, t, n) {
                        var i = this.__dataHasPaths && ce(e),
                          r = i ? this.__dataTemp : this.__data;
                        return (
                          !!this._shouldPropertyChange(e, t, r[e]) &&
                          (this.__dataPending ||
                            ((this.__dataPending = {}), (this.__dataOld = {})),
                          e in this.__dataOld ||
                            (this.__dataOld[e] = this.__data[e]),
                          i ? (this.__dataTemp[e] = t) : (this.__data[e] = t),
                          (this.__dataPending[e] = t),
                          (i || (this[Qe.NOTIFY] && this[Qe.NOTIFY][e])) &&
                            ((this.__dataToNotify = this.__dataToNotify || {}),
                            (this.__dataToNotify[e] = n)),
                          !0)
                        );
                      },
                    },
                    {
                      key: "_setProperty",
                      value: function (e, t) {
                        this._setPendingProperty(e, t, !0) &&
                          this._invalidateProperties();
                      },
                    },
                    {
                      key: "_invalidateProperties",
                      value: function () {
                        this.__dataReady && this._flushProperties();
                      },
                    },
                    {
                      key: "_enqueueClient",
                      value: function (e) {
                        (this.__dataPendingClients =
                          this.__dataPendingClients || []),
                          e !== this && this.__dataPendingClients.push(e);
                      },
                    },
                    {
                      key: "_flushClients",
                      value: function () {
                        this.__dataClientsReady
                          ? this.__enableOrFlushClients()
                          : ((this.__dataClientsReady = !0),
                            this._readyClients(),
                            (this.__dataReady = !0));
                      },
                    },
                    {
                      key: "__enableOrFlushClients",
                      value: function () {
                        var e = this.__dataPendingClients;
                        if (e) {
                          this.__dataPendingClients = null;
                          for (var t = 0; t < e.length; t++) {
                            var n = e[t];
                            n.__dataEnabled
                              ? n.__dataPending && n._flushProperties()
                              : n._enableProperties();
                          }
                        }
                      },
                    },
                    {
                      key: "_readyClients",
                      value: function () {
                        this.__enableOrFlushClients();
                      },
                    },
                    {
                      key: "setProperties",
                      value: function (e, t) {
                        for (var n in e)
                          (!t && this[Qe.READ_ONLY] && this[Qe.READ_ONLY][n]) ||
                            this._setPendingPropertyOrPath(n, e[n], !0);
                        this._invalidateProperties();
                      },
                    },
                    {
                      key: "ready",
                      value: function () {
                        this._flushProperties(),
                          this.__dataClientsReady || this._flushClients(),
                          this.__dataPending && this._flushProperties();
                      },
                    },
                    {
                      key: "_propertiesChanged",
                      value: function (e, t, n) {
                        var i,
                          r = this.__dataHasPaths;
                        (this.__dataHasPaths = !1),
                          ct(this, t, n, r),
                          (i = this.__dataToNotify),
                          (this.__dataToNotify = null),
                          this._propagatePropertyChanges(t, n, r),
                          this._flushClients(),
                          it(this, this[Qe.REFLECT], t, n, r),
                          it(this, this[Qe.OBSERVE], t, n, r),
                          i &&
                            (function (e, t, n, i, r) {
                              var o,
                                a,
                                s = e[Qe.NOTIFY],
                                l = Je++;
                              for (var u in t)
                                t[u] &&
                                  ((s && rt(e, s, l, u, n, i, r)) ||
                                    (r && st(e, u, n))) &&
                                  (o = !0);
                              o &&
                                (a = e.__dataHost) &&
                                a._invalidateProperties &&
                                a._invalidateProperties();
                            })(this, i, t, n, r),
                          1 == this.__dataCounter && (this.__dataTemp = {});
                      },
                    },
                    {
                      key: "_propagatePropertyChanges",
                      value: function (e, t, n) {
                        this[Qe.PROPAGATE] &&
                          it(this, this[Qe.PROPAGATE], e, t, n),
                          this.__templateInfo &&
                            this._runEffectsForTemplate(
                              this.__templateInfo,
                              e,
                              t,
                              n
                            );
                      },
                    },
                    {
                      key: "_runEffectsForTemplate",
                      value: function (e, t, n, i) {
                        var r = this,
                          o = function (t, i) {
                            it(r, e.propertyEffects, t, n, i, e.nodeList);
                            for (var o = e.firstChild; o; o = o.nextSibling)
                              r._runEffectsForTemplate(o, t, n, i);
                          };
                        e.runEffects ? e.runEffects(o, t, i) : o(t, i);
                      },
                    },
                    {
                      key: "linkPaths",
                      value: function (e, t) {
                        (e = ve(e)),
                          (t = ve(t)),
                          (this.__dataLinkedPaths =
                            this.__dataLinkedPaths || {}),
                          (this.__dataLinkedPaths[e] = t);
                      },
                    },
                    {
                      key: "unlinkPaths",
                      value: function (e) {
                        (e = ve(e)),
                          this.__dataLinkedPaths &&
                            delete this.__dataLinkedPaths[e];
                      },
                    },
                    {
                      key: "notifySplices",
                      value: function (e, t) {
                        var n = { path: "" };
                        At(this, me(this, e, n), n.path, t);
                      },
                    },
                    {
                      key: "get",
                      value: function (e, t) {
                        return me(t || this, e);
                      },
                    },
                    {
                      key: "set",
                      value: function (e, t, n) {
                        n
                          ? ge(n, e, t)
                          : (this[Qe.READ_ONLY] && this[Qe.READ_ONLY][e]) ||
                            (this._setPendingPropertyOrPath(e, t, !0) &&
                              this._invalidateProperties());
                      },
                    },
                    {
                      key: "push",
                      value: function (e) {
                        for (
                          var t = { path: "" },
                            n = me(this, e, t),
                            i = n.length,
                            r = arguments.length,
                            o = new Array(r > 1 ? r - 1 : 0),
                            a = 1;
                          a < r;
                          a++
                        )
                          o[a - 1] = arguments[a];
                        var s = n.push.apply(n, o);
                        return (
                          o.length && Ot(this, n, t.path, i, o.length, []), s
                        );
                      },
                    },
                    {
                      key: "pop",
                      value: function (e) {
                        var t = { path: "" },
                          n = me(this, e, t),
                          i = Boolean(n.length),
                          r = n.pop();
                        return i && Ot(this, n, t.path, n.length, 0, [r]), r;
                      },
                    },
                    {
                      key: "splice",
                      value: function (e, t, n) {
                        for (
                          var i = arguments.length,
                            r = new Array(i > 3 ? i - 3 : 0),
                            o = 3;
                          o < i;
                          o++
                        )
                          r[o - 3] = arguments[o];
                        var a,
                          s = { path: "" },
                          l = me(this, e, s);
                        return (
                          t < 0
                            ? (t = l.length - Math.floor(-t))
                            : t && (t = Math.floor(t)),
                          (a =
                            2 === arguments.length
                              ? l.splice(t)
                              : l.splice.apply(l, [t, n].concat(r))),
                          (r.length || a.length) &&
                            Ot(this, l, s.path, t, r.length, a),
                          a
                        );
                      },
                    },
                    {
                      key: "shift",
                      value: function (e) {
                        var t = { path: "" },
                          n = me(this, e, t),
                          i = Boolean(n.length),
                          r = n.shift();
                        return i && Ot(this, n, t.path, 0, 0, [r]), r;
                      },
                    },
                    {
                      key: "unshift",
                      value: function (e) {
                        for (
                          var t = { path: "" },
                            n = me(this, e, t),
                            i = arguments.length,
                            r = new Array(i > 1 ? i - 1 : 0),
                            o = 1;
                          o < i;
                          o++
                        )
                          r[o - 1] = arguments[o];
                        var a = n.unshift.apply(n, r);
                        return (
                          r.length && Ot(this, n, t.path, 0, r.length, []), a
                        );
                      },
                    },
                    {
                      key: "notifyPath",
                      value: function (e, t) {
                        var n;
                        if (1 == arguments.length) {
                          var i = { path: "" };
                          (t = me(this, e, i)), (n = i.path);
                        } else n = Array.isArray(e) ? ve(e) : e;
                        this._setPendingPropertyOrPath(n, t, !0, !0) &&
                          this._invalidateProperties();
                      },
                    },
                    {
                      key: "_createReadOnlyProperty",
                      value: function (e, t) {
                        var n;
                        this._addPropertyEffect(e, Qe.READ_ONLY),
                          t &&
                            (this[
                              "_set" +
                                ((n = e), n[0].toUpperCase() + n.substring(1))
                            ] = function (t) {
                              this._setProperty(e, t);
                            });
                      },
                    },
                    {
                      key: "_createPropertyObserver",
                      value: function (e, t, n) {
                        var i = {
                          property: e,
                          method: t,
                          dynamicFn: Boolean(n),
                        };
                        this._addPropertyEffect(e, Qe.OBSERVE, {
                          fn: at,
                          info: i,
                          trigger: { name: e },
                        }),
                          n &&
                            this._addPropertyEffect(t, Qe.OBSERVE, {
                              fn: at,
                              info: i,
                              trigger: { name: t },
                            });
                      },
                    },
                    {
                      key: "_createMethodObserver",
                      value: function (e, t) {
                        var n = Et(e);
                        if (!n)
                          throw new Error(
                            "Malformed observer expression '" + e + "'"
                          );
                        bt(this, n, Qe.OBSERVE, kt, null, t);
                      },
                    },
                    {
                      key: "_createNotifyingProperty",
                      value: function (e) {
                        this._addPropertyEffect(e, Qe.NOTIFY, {
                          fn: ut,
                          info: { eventName: we(e) + "-changed", property: e },
                        });
                      },
                    },
                    {
                      key: "_createReflectedProperty",
                      value: function (e) {
                        var t = this.constructor.attributeNameForProperty(e);
                        "-" === t[0]
                          ? console.warn(
                              "Property " +
                                e +
                                " cannot be reflected to attribute " +
                                t +
                                ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'
                            )
                          : this._addPropertyEffect(e, Qe.REFLECT, {
                              fn: ht,
                              info: { attrName: t },
                            });
                      },
                    },
                    {
                      key: "_createComputedProperty",
                      value: function (e, t, n) {
                        var i = Et(t);
                        if (!i)
                          throw new Error(
                            "Malformed computed expression '" + t + "'"
                          );
                        var r = bt(this, i, Qe.COMPUTE, pt, e, n);
                        nt(this, et)[e] = r;
                      },
                    },
                    {
                      key: "_marshalArgs",
                      value: function (e, t, n) {
                        for (
                          var i = this.__data, r = [], o = 0, a = e.length;
                          o < a;
                          o++
                        ) {
                          var s = e[o],
                            l = s.name,
                            u = s.structured,
                            h = s.wildcard,
                            c = s.value;
                          if (!s.literal)
                            if (h) {
                              var d = pe(l, t),
                                _ = Tt(i, n, d ? t : l);
                              c = {
                                path: d ? t : l,
                                value: _,
                                base: d ? me(i, l) : _,
                              };
                            } else c = u ? Tt(i, n, l) : i[l];
                          if (
                            q.HY &&
                            !this._overrideLegacyUndefined &&
                            void 0 === c &&
                            e.length > 1
                          )
                            return Xe;
                          r[o] = c;
                        }
                        return r;
                      },
                    },
                    {
                      key: "_bindTemplate",
                      value: function (e, t) {
                        var n = this.constructor._parseTemplate(e),
                          i = this.__preBoundTemplateInfo == n;
                        if (!i)
                          for (var r in n.propertyEffects)
                            this._createPropertyAccessor(r);
                        if (t)
                          if (
                            (((n = Object.create(n)).wasPreBound = i),
                            this.__templateInfo)
                          ) {
                            var o =
                                e._parentTemplateInfo || this.__templateInfo,
                              a = o.lastChild;
                            (n.parent = o),
                              (o.lastChild = n),
                              (n.previousSibling = a),
                              a ? (a.nextSibling = n) : (o.firstChild = n);
                          } else this.__templateInfo = n;
                        else this.__preBoundTemplateInfo = n;
                        return n;
                      },
                    },
                    {
                      key: "_stampTemplate",
                      value: function (e, t) {
                        (t = t || this._bindTemplate(e, !0)), Vt.push(this);
                        var i = (0, c.Z)(
                          (0, d.Z)(n.prototype),
                          "_stampTemplate",
                          this
                        ).call(this, e, t);
                        if (
                          (Vt.pop(), (t.nodeList = i.nodeList), !t.wasPreBound)
                        )
                          for (
                            var r = (t.childNodes = []), o = i.firstChild;
                            o;
                            o = o.nextSibling
                          )
                            r.push(o);
                        return (
                          (i.templateInfo = t),
                          (function (e, t) {
                            var n = t.nodeList,
                              i = t.nodeInfoList;
                            if (i.length)
                              for (var r = 0; r < i.length; r++) {
                                var o = i[r],
                                  a = n[r],
                                  s = o.bindings;
                                if (s)
                                  for (var l = 0; l < s.length; l++) {
                                    var u = s[l];
                                    mt(a, u), gt(a, e, u);
                                  }
                                a.__dataHost = e;
                              }
                          })(this, t),
                          this.__dataClientsReady &&
                            (this._runEffectsForTemplate(
                              t,
                              this.__data,
                              null,
                              !1
                            ),
                            this._flushClients()),
                          i
                        );
                      },
                    },
                    {
                      key: "_removeBoundDom",
                      value: function (e) {
                        var t = e.templateInfo,
                          n = t.previousSibling,
                          i = t.nextSibling,
                          r = t.parent;
                        n ? (n.nextSibling = i) : r && (r.firstChild = i),
                          i ? (i.previousSibling = n) : r && (r.lastChild = n),
                          (t.nextSibling = t.previousSibling = null);
                        for (var o = t.childNodes, a = 0; a < o.length; a++) {
                          var s = o[a];
                          he(he(s).parentNode).removeChild(s);
                        }
                      },
                    },
                  ],
                  [
                    {
                      key: "addPropertyEffect",
                      value: function (e, t, n) {
                        this.prototype._addPropertyEffect(e, t, n);
                      },
                    },
                    {
                      key: "createPropertyObserver",
                      value: function (e, t, n) {
                        this.prototype._createPropertyObserver(e, t, n);
                      },
                    },
                    {
                      key: "createMethodObserver",
                      value: function (e, t) {
                        this.prototype._createMethodObserver(e, t);
                      },
                    },
                    {
                      key: "createNotifyingProperty",
                      value: function (e) {
                        this.prototype._createNotifyingProperty(e);
                      },
                    },
                    {
                      key: "createReadOnlyProperty",
                      value: function (e, t) {
                        this.prototype._createReadOnlyProperty(e, t);
                      },
                    },
                    {
                      key: "createReflectedProperty",
                      value: function (e) {
                        this.prototype._createReflectedProperty(e);
                      },
                    },
                    {
                      key: "createComputedProperty",
                      value: function (e, t, n) {
                        this.prototype._createComputedProperty(e, t, n);
                      },
                    },
                    {
                      key: "bindTemplate",
                      value: function (e) {
                        return this.prototype._bindTemplate(e);
                      },
                    },
                    {
                      key: "_addTemplatePropertyEffect",
                      value: function (e, t, n) {
                        (e.hostProps = e.hostProps || {})[t] = !0;
                        var i = (e.propertyEffects = e.propertyEffects || {});
                        (i[t] = i[t] || []).push(n);
                      },
                    },
                    {
                      key: "_parseTemplateNode",
                      value: function (e, n, i) {
                        var r = t._parseTemplateNode.call(this, e, n, i);
                        if (e.nodeType === Node.TEXT_NODE) {
                          var o = this._parseBindings(e.textContent, n);
                          o &&
                            ((e.textContent = It(o) || " "),
                            ft(this, n, i, "text", "textContent", o),
                            (r = !0));
                        }
                        return r;
                      },
                    },
                    {
                      key: "_parseTemplateNodeAttribute",
                      value: function (e, n, i, r, o) {
                        var a = this._parseBindings(o, n);
                        if (a) {
                          var s = r,
                            l = "property";
                          tt.test(r)
                            ? (l = "attribute")
                            : "$" == r[r.length - 1] &&
                              ((r = r.slice(0, -1)), (l = "attribute"));
                          var u = It(a);
                          return (
                            u &&
                              "attribute" == l &&
                              ("class" == r &&
                                e.hasAttribute("class") &&
                                (u += " " + e.getAttribute(r)),
                              e.setAttribute(r, u)),
                            "attribute" == l &&
                              "disable-upgrade$" == s &&
                              e.setAttribute(r, ""),
                            "input" === e.localName &&
                              "value" === s &&
                              e.setAttribute(s, ""),
                            e.removeAttribute(s),
                            "property" === l && (r = Pe(r)),
                            ft(this, n, i, l, r, a, u),
                            !0
                          );
                        }
                        return t._parseTemplateNodeAttribute.call(
                          this,
                          e,
                          n,
                          i,
                          r,
                          o
                        );
                      },
                    },
                    {
                      key: "_parseTemplateNestedTemplate",
                      value: function (e, n, i) {
                        var r = t._parseTemplateNestedTemplate.call(
                            this,
                            e,
                            n,
                            i
                          ),
                          o = e.parentNode,
                          a = i.templateInfo,
                          s = "dom-if" === o.localName,
                          l = "dom-repeat" === o.localName;
                        q.gx &&
                          (s || l) &&
                          (o.removeChild(e),
                          ((i = i.parentInfo).templateInfo = a),
                          (i.noted = !0),
                          (r = !1));
                        var u = a.hostProps;
                        if (q.ew && s)
                          u &&
                            ((n.hostProps = Object.assign(
                              n.hostProps || {},
                              u
                            )),
                            q.gx || (i.parentInfo.noted = !0));
                        else {
                          for (var h in u) {
                            ft(this, n, i, "property", "_host_" + h, [
                              {
                                mode: "{",
                                source: h,
                                dependencies: [h],
                                hostProp: !0,
                              },
                            ]);
                          }
                        }
                        return r;
                      },
                    },
                    {
                      key: "_parseBindings",
                      value: function (e, t) {
                        for (
                          var n, i = [], r = 0;
                          null !== (n = xt.exec(e));

                        ) {
                          n.index > r &&
                            i.push({ literal: e.slice(r, n.index) });
                          var o = n[1][0],
                            a = Boolean(n[2]),
                            s = n[3].trim(),
                            l = !1,
                            u = "",
                            h = -1;
                          "{" == o &&
                            (h = s.indexOf("::")) > 0 &&
                            ((u = s.substring(h + 2)),
                            (s = s.substring(0, h)),
                            (l = !0));
                          var c = Et(s),
                            d = [];
                          if (c) {
                            for (
                              var _ = c.args, p = c.methodName, f = 0;
                              f < _.length;
                              f++
                            ) {
                              var v = _[f];
                              v.literal || d.push(v);
                            }
                            var y = t.dynamicFns;
                            ((y && y[p]) || c.static) &&
                              (d.push(p), (c.dynamicFn = !0));
                          } else d.push(s);
                          i.push({
                            source: s,
                            mode: o,
                            negate: a,
                            customEvent: l,
                            signature: c,
                            dependencies: d,
                            event: u,
                          }),
                            (r = xt.lastIndex);
                        }
                        if (r && r < e.length) {
                          var m = e.substring(r);
                          m && i.push({ literal: m });
                        }
                        return i.length ? i : null;
                      },
                    },
                    {
                      key: "_evaluateBinding",
                      value: function (e, t, n, i, r, o) {
                        var a;
                        return (
                          (a = t.signature
                            ? kt(e, n, i, 0, t.signature)
                            : n != t.source
                            ? me(e, t.source)
                            : o && ce(n)
                            ? me(e, n)
                            : e.__data[n]),
                          t.negate && (a = !a),
                          a
                        );
                      },
                    },
                  ]
                ),
                n
              );
            })(t);
          return n;
        }),
        Vt = [];
      var Nt = [];
      var Lt = W(function (e) {
          function t(e) {
            var t = Object.getPrototypeOf(e);
            return t.prototype instanceof i ? t : null;
          }
          function n(e) {
            if (
              !e.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", e))
            ) {
              var t = null;
              if (
                e.hasOwnProperty(JSCompiler_renameProperty("properties", e))
              ) {
                var n = e.properties;
                n &&
                  (t = (function (e) {
                    var t = {};
                    for (var n in e) {
                      var i = e[n];
                      t[n] = "function" == typeof i ? { type: i } : i;
                    }
                    return t;
                  })(n));
              }
              e.__ownProperties = t;
            }
            return e.__ownProperties;
          }
          var i = (function (e) {
            function i() {
              return (0, r.Z)(this, i), (0, a.Z)(this, i, arguments);
            }
            return (
              (0, s.Z)(i, e),
              (0, o.Z)(
                i,
                [
                  {
                    key: "_initializeProperties",
                    value: function () {
                      this.constructor.finalize(),
                        (0, c.Z)(
                          (0, d.Z)(i.prototype),
                          "_initializeProperties",
                          this
                        ).call(this);
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(i.prototype),
                        "connectedCallback",
                        this
                      ) &&
                        (0, c.Z)(
                          (0, d.Z)(i.prototype),
                          "connectedCallback",
                          this
                        ).call(this),
                        this._enableProperties();
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(i.prototype),
                        "disconnectedCallback",
                        this
                      ) &&
                        (0, c.Z)(
                          (0, d.Z)(i.prototype),
                          "disconnectedCallback",
                          this
                        ).call(this);
                    },
                  },
                ],
                [
                  {
                    key: "observedAttributes",
                    get: function () {
                      var e,
                        t = this;
                      if (
                        !this.hasOwnProperty(
                          JSCompiler_renameProperty(
                            "__observedAttributes",
                            this
                          )
                        )
                      ) {
                        (e = this.prototype), Nt.push(e);
                        var n = this._properties;
                        this.__observedAttributes = n
                          ? Object.keys(n).map(function (e) {
                              return t.prototype._addPropertyToAttributeMap(e);
                            })
                          : [];
                      }
                      return this.__observedAttributes;
                    },
                  },
                  {
                    key: "finalize",
                    value: function () {
                      if (
                        !this.hasOwnProperty(
                          JSCompiler_renameProperty("__finalized", this)
                        )
                      ) {
                        var e = t(this);
                        e && e.finalize(),
                          (this.__finalized = !0),
                          this._finalizeClass();
                      }
                    },
                  },
                  {
                    key: "_finalizeClass",
                    value: function () {
                      var e = n(this);
                      e && this.createProperties(e);
                    },
                  },
                  {
                    key: "_properties",
                    get: function () {
                      if (
                        !this.hasOwnProperty(
                          JSCompiler_renameProperty("__properties", this)
                        )
                      ) {
                        var e = t(this);
                        this.__properties = Object.assign(
                          {},
                          e && e._properties,
                          n(this)
                        );
                      }
                      return this.__properties;
                    },
                  },
                  {
                    key: "typeForProperty",
                    value: function (e) {
                      var t = this._properties[e];
                      return t && t.type;
                    },
                  },
                ]
              ),
              i
            );
          })(Ze(e));
          return i;
        }),
        zt = window.ShadyCSS && window.ShadyCSS.cssBuild,
        Rt = W(function (e) {
          var t = Lt(Zt(e));
          function n(e, t, n, i) {
            n.computed && (n.readOnly = !0),
              n.computed &&
                (e._hasReadOnlyEffect(t)
                  ? console.warn(
                      "Cannot redefine computed property '".concat(t, "'.")
                    )
                  : e._createComputedProperty(t, n.computed, i)),
              n.readOnly && !e._hasReadOnlyEffect(t)
                ? e._createReadOnlyProperty(t, !n.computed)
                : !1 === n.readOnly &&
                  e._hasReadOnlyEffect(t) &&
                  console.warn(
                    "Cannot make readOnly property '".concat(
                      t,
                      "' non-readOnly."
                    )
                  ),
              n.reflectToAttribute && !e._hasReflectEffect(t)
                ? e._createReflectedProperty(t)
                : !1 === n.reflectToAttribute &&
                  e._hasReflectEffect(t) &&
                  console.warn(
                    "Cannot make reflected property '".concat(
                      t,
                      "' non-reflected."
                    )
                  ),
              n.notify && !e._hasNotifyEffect(t)
                ? e._createNotifyingProperty(t)
                : !1 === n.notify &&
                  e._hasNotifyEffect(t) &&
                  console.warn(
                    "Cannot make notify property '".concat(t, "' non-notify.")
                  ),
              n.observer &&
                e._createPropertyObserver(t, n.observer, i[n.observer]),
              e._addPropertyToAttributeMap(t);
          }
          function i(e, t, n, i) {
            if (!zt) {
              for (
                var r = t.content.querySelectorAll("style"),
                  o = se(t),
                  a = (p = ie(n)) ? le(p) : [],
                  s = t.content.firstElementChild,
                  l = 0;
                l < a.length;
                l++
              ) {
                var u = a[l];
                (u.textContent = e._processStyleText(u.textContent, i)),
                  t.content.insertBefore(u, s);
              }
              for (var h = 0, c = 0; c < o.length; c++) {
                var d = o[c],
                  _ = r[h];
                _ !== d
                  ? ((d = d.cloneNode(!0)), _.parentNode.insertBefore(d, _))
                  : h++,
                  (d.textContent = e._processStyleText(d.textContent, i));
              }
            }
            var p;
            if (
              (window.ShadyCSS && window.ShadyCSS.prepareTemplate(t, n),
              q.md && zt && q.FV)
            ) {
              var f = t.content.querySelectorAll("style");
              if (f) {
                var v = "";
                Array.from(f).forEach(function (e) {
                  (v += e.textContent), e.parentNode.removeChild(e);
                }),
                  (e._styleSheet = new CSSStyleSheet()),
                  e._styleSheet.replaceSync(v);
              }
            }
          }
          var l = (function (e) {
            function l() {
              var e;
              return (
                (0, r.Z)(this, l),
                (e = (0, a.Z)(this, l))._template,
                e._importPath,
                e.rootPath,
                e.importPath,
                e.root,
                e.$,
                e
              );
            }
            return (
              (0, s.Z)(l, e),
              (0, o.Z)(
                l,
                [
                  {
                    key: "_initializeProperties",
                    value: function () {
                      this.constructor.finalize(),
                        this.constructor._finalizeTemplate(this.localName),
                        (0, c.Z)(
                          (0, d.Z)(l.prototype),
                          "_initializeProperties",
                          this
                        ).call(this),
                        (this.rootPath = q.sM),
                        (this.importPath = this.constructor.importPath);
                      var e = (function (e) {
                        if (
                          !e.hasOwnProperty(
                            JSCompiler_renameProperty("__propertyDefaults", e)
                          )
                        ) {
                          e.__propertyDefaults = null;
                          var t = e._properties;
                          for (var n in t) {
                            var i = t[n];
                            "value" in i &&
                              ((e.__propertyDefaults =
                                e.__propertyDefaults || {}),
                              (e.__propertyDefaults[n] = i));
                          }
                        }
                        return e.__propertyDefaults;
                      })(this.constructor);
                      if (e)
                        for (var t in e) {
                          var n = e[t];
                          if (this._canApplyPropertyDefault(t)) {
                            var i =
                              "function" == typeof n.value
                                ? n.value.call(this)
                                : n.value;
                            this._hasAccessor(t)
                              ? this._setPendingProperty(t, i, !0)
                              : (this[t] = i);
                          }
                        }
                    },
                  },
                  {
                    key: "_canApplyPropertyDefault",
                    value: function (e) {
                      return !this.hasOwnProperty(e);
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      window.ShadyCSS &&
                        this._template &&
                        window.ShadyCSS.styleElement(this),
                        (0, c.Z)(
                          (0, d.Z)(l.prototype),
                          "connectedCallback",
                          this
                        ).call(this);
                    },
                  },
                  {
                    key: "ready",
                    value: function () {
                      this._template &&
                        ((this.root = this._stampTemplate(this._template)),
                        (this.$ = this.root.$)),
                        (0, c.Z)((0, d.Z)(l.prototype), "ready", this).call(
                          this
                        );
                    },
                  },
                  {
                    key: "_readyClients",
                    value: function () {
                      this._template &&
                        (this.root = this._attachDom(this.root)),
                        (0, c.Z)(
                          (0, d.Z)(l.prototype),
                          "_readyClients",
                          this
                        ).call(this);
                    },
                  },
                  {
                    key: "_attachDom",
                    value: function (e) {
                      var t = he(this);
                      if (t.attachShadow)
                        return e
                          ? (t.shadowRoot ||
                              (t.attachShadow({
                                mode: "open",
                                shadyUpgradeFragment: e,
                              }),
                              t.shadowRoot.appendChild(e),
                              this.constructor._styleSheet &&
                                (t.shadowRoot.adoptedStyleSheets = [
                                  this.constructor._styleSheet,
                                ])),
                            q.Hr &&
                              window.ShadyDOM &&
                              window.ShadyDOM.flushInitial(t.shadowRoot),
                            t.shadowRoot)
                          : null;
                      throw new Error(
                        "ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`."
                      );
                    },
                  },
                  {
                    key: "updateStyles",
                    value: function (e) {
                      window.ShadyCSS && window.ShadyCSS.styleSubtree(this, e);
                    },
                  },
                  {
                    key: "resolveUrl",
                    value: function (e, t) {
                      return (
                        !t &&
                          this.importPath &&
                          (t = (0, Y.Kk)(this.importPath)),
                        (0, Y.Kk)(e, t)
                      );
                    },
                  },
                ],
                [
                  {
                    key: "polymerElementVersion",
                    get: function () {
                      return "3.5.1";
                    },
                  },
                  {
                    key: "_finalizeClass",
                    value: function () {
                      t._finalizeClass.call(this);
                      var e,
                        n =
                          ((e = this).hasOwnProperty(
                            JSCompiler_renameProperty("__ownObservers", e)
                          ) ||
                            (e.__ownObservers = e.hasOwnProperty(
                              JSCompiler_renameProperty("observers", e)
                            )
                              ? e.observers
                              : null),
                          e.__ownObservers);
                      n && this.createObservers(n, this._properties),
                        this._prepareTemplate();
                    },
                  },
                  {
                    key: "_prepareTemplate",
                    value: function () {
                      var e = this.template;
                      e &&
                        ("string" == typeof e
                          ? (console.error(
                              "template getter must return HTMLTemplateElement"
                            ),
                            (e = null))
                          : q.nL || (e = e.cloneNode(!0))),
                        (this.prototype._template = e);
                    },
                  },
                  {
                    key: "createProperties",
                    value: function (e) {
                      for (var t in e) n(this.prototype, t, e[t], e);
                    },
                  },
                  {
                    key: "createObservers",
                    value: function (e, t) {
                      for (var n = this.prototype, i = 0; i < e.length; i++)
                        n._createMethodObserver(e[i], t);
                    },
                  },
                  {
                    key: "template",
                    get: function () {
                      if (
                        !this.hasOwnProperty(
                          JSCompiler_renameProperty("_template", this)
                        )
                      ) {
                        var e = this.prototype.hasOwnProperty(
                          JSCompiler_renameProperty("_template", this.prototype)
                        )
                          ? this.prototype._template
                          : void 0;
                        "function" == typeof e && (e = e()),
                          (this._template =
                            void 0 !== e
                              ? e
                              : (this.hasOwnProperty(
                                  JSCompiler_renameProperty("is", this)
                                ) &&
                                  (function (e) {
                                    var t = null;
                                    if (
                                      e &&
                                      (!q.XN || q.ZN) &&
                                      ((t = Q.import(e, "template")),
                                      q.XN && !t)
                                    )
                                      throw new Error(
                                        "strictTemplatePolicy: expecting dom-module or null template for ".concat(
                                          e
                                        )
                                      );
                                    return t;
                                  })(this.is)) ||
                                Object.getPrototypeOf(this.prototype)
                                  .constructor.template);
                      }
                      return this._template;
                    },
                    set: function (e) {
                      this._template = e;
                    },
                  },
                  {
                    key: "importPath",
                    get: function () {
                      if (
                        !this.hasOwnProperty(
                          JSCompiler_renameProperty("_importPath", this)
                        )
                      ) {
                        var e = this.importMeta;
                        if (e) this._importPath = (0, Y.iY)(e.url);
                        else {
                          var t = Q.import(this.is);
                          this._importPath =
                            (t && t.assetpath) ||
                            Object.getPrototypeOf(this.prototype).constructor
                              .importPath;
                        }
                      }
                      return this._importPath;
                    },
                  },
                  {
                    key: "_processStyleText",
                    value: function (e, t) {
                      return (0, Y.Rq)(e, t);
                    },
                  },
                  {
                    key: "_finalizeTemplate",
                    value: function (e) {
                      var t = this.prototype._template;
                      if (t && !t.__polymerFinalized) {
                        t.__polymerFinalized = !0;
                        var n = this.importPath;
                        i(this, t, e, n ? (0, Y.Kk)(n) : ""),
                          this.prototype._bindTemplate(t);
                      }
                    },
                  },
                  {
                    key: "_parseTemplateContent",
                    value: function (e, n, i) {
                      return (
                        (n.dynamicFns = n.dynamicFns || this._properties),
                        t._parseTemplateContent.call(this, e, n, i)
                      );
                    },
                  },
                  {
                    key: "_addTemplatePropertyEffect",
                    value: function (e, n, i) {
                      return (
                        !q.a2 ||
                          n in this._properties ||
                          (i.info.part.signature &&
                            i.info.part.signature.static) ||
                          i.info.part.hostProp ||
                          e.nestedTemplate ||
                          console.warn(
                            "Property '".concat(
                              n,
                              "' used in template but not declared in 'properties'; "
                            ) + "attribute will not be observed."
                          ),
                        t._addTemplatePropertyEffect.call(this, e, n, i)
                      );
                    },
                  },
                ]
              ),
              l
            );
          })(t);
          return l;
        }),
        Mt =
          (n(34997),
          n(12148),
          window.trustedTypes &&
            trustedTypes.createPolicy("polymer-html-literal", {
              createHTML: function (e) {
                return e;
              },
            })),
        Ft = (function () {
          function e(t, n) {
            (0, r.Z)(this, e), Bt(t, n);
            var i = n.reduce(function (e, n, i) {
              return e + Dt(n) + t[i + 1];
            }, t[0]);
            this.value = i.toString();
          }
          return (
            (0, o.Z)(e, [
              {
                key: "toString",
                value: function () {
                  return this.value;
                },
              },
            ]),
            e
          );
        })();
      function Dt(e) {
        if (e instanceof Ft) return e.value;
        throw new Error(
          "non-literal value passed to Polymer's htmlLiteral function: ".concat(
            e
          )
        );
      }
      var Ht = function (e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
          )
            n[i - 1] = arguments[i];
          Bt(e, n);
          var r = document.createElement("template"),
            o = n.reduce(function (t, n, i) {
              return (
                t +
                (function (e) {
                  if (e instanceof HTMLTemplateElement) return e.innerHTML;
                  if (e instanceof Ft) return Dt(e);
                  throw new Error(
                    "non-template value passed to Polymer's html function: ".concat(
                      e
                    )
                  );
                })(n) +
                e[i + 1]
              );
            }, e[0]);
          return Mt && (o = Mt.createHTML(o)), (r.innerHTML = o), r;
        },
        Bt = function (e, t) {
          if (
            !Array.isArray(e) ||
            !Array.isArray(e.raw) ||
            t.length !== e.length - 1
          )
            throw new TypeError("Invalid call to the html template tag");
        },
        jt = Rt(HTMLElement),
        qt = (n(40271), []);
      function Ut(e, t) {
        var n =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : e.getAttribute("dir");
        t ? e.setAttribute("dir", t) : null != n && e.removeAttribute("dir");
      }
      function $t() {
        return document.documentElement.getAttribute("dir");
      }
      new MutationObserver(function () {
        var e = $t();
        qt.forEach(function (t) {
          Ut(t, e);
        });
      }).observe(document.documentElement, {
        attributes: !0,
        attributeFilter: ["dir"],
      });
      var Wt,
        Yt = function (e) {
          return (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "__isRTL",
                    get: function () {
                      return "rtl" === this.getAttribute("dir");
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "connectedCallback",
                        this
                      ).call(this),
                        (this.hasAttribute("dir") &&
                          !this.__restoreSubscription) ||
                          (this.__subscribe(), Ut(this, $t(), null));
                    },
                  },
                  {
                    key: "attributeChangedCallback",
                    value: function (e, n, i) {
                      if (
                        ((0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "attributeChangedCallback",
                          this
                        ).call(this, e, n, i),
                        "dir" === e)
                      ) {
                        var r = $t(),
                          o = i === r && -1 === qt.indexOf(this),
                          a = !i && n && -1 === qt.indexOf(this),
                          s = i !== r && n === r;
                        o || a
                          ? (this.__subscribe(), Ut(this, r, i))
                          : s && this.__unsubscribe();
                      }
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "disconnectedCallback",
                        this
                      ).call(this),
                        (this.__restoreSubscription = qt.includes(this)),
                        this.__unsubscribe();
                    },
                  },
                  {
                    key: "_valueToNodeAttribute",
                    value: function (e, n, i) {
                      ("dir" !== i || "" !== n || e.hasAttribute("dir")) &&
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_valueToNodeAttribute",
                          this
                        ).call(this, e, n, i);
                    },
                  },
                  {
                    key: "_attributeToProperty",
                    value: function (e, n, i) {
                      "dir" !== e || n
                        ? (0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "_attributeToProperty",
                            this
                          ).call(this, e, n, i)
                        : (this.dir = "");
                    },
                  },
                  {
                    key: "__subscribe",
                    value: function () {
                      qt.includes(this) || qt.push(this);
                    },
                  },
                  {
                    key: "__unsubscribe",
                    value: function () {
                      qt.includes(this) && qt.splice(qt.indexOf(this), 1);
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        dir: {
                          type: String,
                          value: "",
                          reflectToAttribute: !0,
                          converter: {
                            fromAttribute: function (e) {
                              return e || "";
                            },
                            toAttribute: function (e) {
                              return "" === e ? null : e;
                            },
                          },
                        },
                      };
                    },
                  },
                ]
              ),
              t
            );
          })(e);
        },
        Kt = (function (e) {
          function t() {
            return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
          }
          return (
            (0, s.Z)(t, e),
            (0, o.Z)(t, null, [
              {
                key: "template",
                get: function () {
                  return Ht(
                    Wt ||
                      (Wt = (0, i.Z)([
                        '\n      <style>\n        :host {\n          display: block;\n        }\n\n        :host([hidden]) {\n          display: none;\n        }\n      </style>\n      <span part="checkmark" aria-hidden="true"></span>\n      <div part="content">\n        <slot></slot>\n      </div>\n    ',
                      ]))
                  );
                },
              },
              {
                key: "is",
                get: function () {
                  return "vaadin-combo-box-item";
                },
              },
            ]),
            t
          );
        })(
          (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "attributeChangedCallback",
                    value: function (e, n, i) {
                      "hidden" === e && null !== i
                        ? (this.index = void 0)
                        : (0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "attributeChangedCallback",
                            this
                          ).call(this, e, n, i);
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "connectedCallback",
                        this
                      ).call(this),
                        (this._owner = this.parentNode.owner);
                      var e = this._owner.getAttribute("dir");
                      e && this.setAttribute("dir", e);
                    },
                  },
                  {
                    key: "requestContentUpdate",
                    value: function () {
                      if (this.renderer) {
                        var e = {
                          index: this.index,
                          item: this.item,
                          focused: this.focused,
                          selected: this.selected,
                        };
                        this.renderer(this, this._owner, e);
                      }
                    },
                  },
                  {
                    key: "__rendererOrItemChanged",
                    value: function (e, t, n) {
                      void 0 !== n &&
                        void 0 !== t &&
                        (this._oldRenderer !== e &&
                          ((this.innerHTML = ""), delete this._$litPart$),
                        e &&
                          ((this._oldRenderer = e),
                          this.requestContentUpdate()));
                    },
                  },
                  {
                    key: "__updateLabel",
                    value: function (e, t) {
                      t || (this.textContent = e);
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        index: { type: Number },
                        item: { type: Object },
                        label: { type: String },
                        selected: {
                          type: Boolean,
                          value: !1,
                          reflectToAttribute: !0,
                        },
                        focused: {
                          type: Boolean,
                          value: !1,
                          reflectToAttribute: !0,
                        },
                        renderer: { type: Function },
                      };
                    },
                  },
                  {
                    key: "observers",
                    get: function () {
                      return [
                        "__rendererOrItemChanged(renderer, index, item.*, selected, focused)",
                        "__updateLabel(label, renderer)",
                      ];
                    },
                  },
                  {
                    key: "observedAttributes",
                    get: function () {
                      return [].concat(
                        (0, _.Z)(
                          (0, c.Z)((0, d.Z)(t), "observedAttributes", this)
                        ),
                        ["hidden"]
                      );
                    },
                  },
                ]
              ),
              t
            );
          })(L(Yt(jt)))
        );
      u(Kt);
      var Gt = n(82390),
        Jt = (n(60163), !1),
        Xt = [],
        Qt = [];
      function en() {
        (Jt = !0),
          requestAnimationFrame(function () {
            (Jt = !1),
              tn(Xt),
              setTimeout(function () {
                !(function (e) {
                  for (var t = 0, n = e.length; t < n; t++) nn(e.shift());
                })(Qt);
              });
          });
      }
      function tn(e) {
        for (; e.length; ) nn(e.shift());
      }
      function nn(e) {
        var t = e[0],
          n = e[1],
          i = e[2];
        try {
          n.apply(t, i);
        } catch (r) {
          setTimeout(function () {
            throw r;
          });
        }
      }
      function rn(e, t, n) {
        Jt || en(), Qt.push([e, t, n]);
      }
      var on = function (e) {
          return e.test(navigator.userAgent);
        },
        an = function (e) {
          return e.test(navigator.platform);
        },
        sn =
          (on(/Android/),
          on(/Chrome/) && /Google Inc/.test(navigator.vendor),
          on(/Firefox/),
          an(/^iPad/) || (an(/^Mac/) && navigator.maxTouchPoints > 1)),
        ln = an(/^iPhone/) || sn,
        un = on(
          /^((?!chrome|android)(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))*[s\u017F]afari/i
        ),
        hn = (function () {
          try {
            return document.createEvent("TouchEvent"), !0;
          } catch (e) {
            return !1;
          }
        })(),
        cn =
          (n(78399),
          n(56086),
          n(47884),
          n(81912),
          n(64584),
          n(41483),
          n(12367),
          n(9454),
          new WeakMap()),
        dn = new WeakMap(),
        _n = {},
        pn = 0,
        fn = function (e) {
          return e && e.nodeType === Node.ELEMENT_NODE;
        },
        vn = function () {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
            t[n] = arguments[n];
          console.error(
            "Error: ".concat(t.join(" "), ". Skip setting aria-hidden.")
          );
        },
        yn = function (e, t, n, i) {
          var r = (function (e, t) {
            return fn(e)
              ? t
                  .map(function (t) {
                    if (!fn(t)) return vn(t, "is not a valid element"), null;
                    for (var n = t; n && n !== e; ) {
                      if (e.contains(n)) return t;
                      n = n.getRootNode().host;
                    }
                    return vn(t, "is not contained inside", e), null;
                  })
                  .filter(function (e) {
                    return Boolean(e);
                  })
              : (vn(e, "is not a valid element"), []);
          })(t, Array.isArray(e) ? e : [e]);
          _n[n] || (_n[n] = new WeakMap());
          var o = _n[n],
            a = [],
            s = new Set(),
            l = new Set(r);
          r.forEach(function e(t) {
            if (t && !s.has(t)) {
              s.add(t);
              var n = t.assignedSlot;
              n && e(n), e(t.parentNode || t.host);
            }
          });
          return (
            (function e(t) {
              if (t && !l.has(t)) {
                var r = t.shadowRoot;
                (r
                  ? [].concat((0, _.Z)(t.children), (0, _.Z)(r.children))
                  : (0, _.Z)(t.children)
                ).forEach(function (t) {
                  if (!["template", "script", "style"].includes(t.localName))
                    if (s.has(t)) e(t);
                    else {
                      var r = t.getAttribute(i),
                        l = null !== r && "false" !== r,
                        u = (cn.get(t) || 0) + 1,
                        h = (o.get(t) || 0) + 1;
                      cn.set(t, u),
                        o.set(t, h),
                        a.push(t),
                        1 === u && l && dn.set(t, !0),
                        1 === h && t.setAttribute(n, "true"),
                        l || t.setAttribute(i, "true");
                    }
                });
              }
            })(t),
            s.clear(),
            (pn += 1),
            function () {
              a.forEach(function (e) {
                var t = cn.get(e) - 1,
                  r = o.get(e) - 1;
                cn.set(e, t),
                  o.set(e, r),
                  t || (dn.has(e) ? dn.delete(e) : e.removeAttribute(i)),
                  r || e.removeAttribute(n);
              }),
                (pn -= 1) ||
                  ((cn = new WeakMap()),
                  (cn = new WeakMap()),
                  (dn = new WeakMap()),
                  (_n = {}));
            }
          );
        },
        mn = function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : document.body,
            n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : "data-aria-hidden",
            i = Array.from(Array.isArray(e) ? e : [e]);
          return (
            t &&
              i.push.apply(
                i,
                (0, _.Z)(Array.from(t.querySelectorAll("[aria-live]")))
              ),
            yn(i, t, n, "aria-hidden")
          );
        },
        gn =
          (HTMLElement.prototype,
          (function () {
            function e(t, n) {
              (0, r.Z)(this, e),
                (this.host = t),
                (this.callback =
                  "function" == typeof n
                    ? n
                    : function () {
                        return t;
                      });
            }
            return (
              (0, o.Z)(e, [
                {
                  key: "showModal",
                  value: function () {
                    var e = this.callback();
                    this.__showOthers = mn(e);
                  },
                },
                {
                  key: "close",
                  value: function () {
                    this.__showOthers &&
                      (this.__showOthers(), (this.__showOthers = null));
                  },
                },
              ]),
              e
            );
          })()),
        bn = !1;
      function kn() {
        for (
          var e = document.activeElement || document.body;
          e.shadowRoot && e.shadowRoot.activeElement;

        )
          e = e.shadowRoot.activeElement;
        return e;
      }
      function Cn(e) {
        var t = e.style;
        if ("hidden" === t.visibility || "none" === t.display) return !0;
        var n = window.getComputedStyle(e);
        return "hidden" === n.visibility || "none" === n.display;
      }
      function Pn(e) {
        var t = e.length;
        if (t < 2) return e;
        var n = Math.ceil(t / 2);
        return (function (e, t) {
          for (var n, i, r, o, a = []; e.length > 0 && t.length > 0; )
            (n = e[0]),
              (i = t[0]),
              (r = void 0),
              (o = void 0),
              (r = Math.max(n.tabIndex, 0)),
              (o = Math.max(i.tabIndex, 0)),
              (0 === r || 0 === o ? o > r : r > o)
                ? a.push(t.shift())
                : a.push(e.shift());
          return a.concat(e, t);
        })(Pn(e.slice(0, n)), Pn(e.slice(n)));
      }
      function wn(e) {
        return e.getRootNode().activeElement === e;
      }
      function xn(e, t) {
        if (e.nodeType !== Node.ELEMENT_NODE || Cn(e)) return !1;
        var n = e,
          i = (function (e) {
            if (
              !(function (e) {
                return (
                  !e.matches('[tabindex="-1"]') &&
                  (e.matches("input, select, textarea, button, object")
                    ? e.matches(":not([disabled])")
                    : e.matches(
                        "a[href], area[href], iframe, [tabindex], [contentEditable]"
                      ))
                );
              })(e)
            )
              return -1;
            var t = e.getAttribute("tabindex") || 0;
            return Number(t);
          })(n),
          r = i > 0;
        i >= 0 && t.push(n);
        var o = [];
        return (
          (o =
            "slot" === n.localName
              ? n.assignedNodes({ flatten: !0 })
              : (n.shadowRoot || n).children),
          (0, _.Z)(o).forEach(function (e) {
            r = xn(e, t) || r;
          }),
          r
        );
      }
      function In(e) {
        var t = [];
        return xn(e, t) ? Pn(t) : t;
      }
      window.addEventListener(
        "keydown",
        function () {
          bn = !0;
        },
        { capture: !0 }
      ),
        window.addEventListener(
          "mousedown",
          function () {
            bn = !1;
          },
          { capture: !0 }
        );
      var En,
        Sn = (function () {
          function e() {
            (0, r.Z)(this, e);
          }
          return (
            (0, o.Z)(e, [
              {
                key: "saveFocus",
                value: function (e) {
                  this.focusNode = e || kn();
                },
              },
              {
                key: "restoreFocus",
                value: function () {
                  var e = this.focusNode;
                  e &&
                    (kn() === document.body
                      ? setTimeout(function () {
                          return e.focus();
                        })
                      : e.focus(),
                    (this.focusNode = null));
                },
              },
            ]),
            e
          );
        })(),
        Tn = [],
        An = (function () {
          function e(t) {
            (0, r.Z)(this, e),
              (this.host = t),
              (this.__trapNode = null),
              (this.__onKeyDown = this.__onKeyDown.bind(this));
          }
          return (
            (0, o.Z)(e, [
              {
                key: "__focusableElements",
                get: function () {
                  return In(this.__trapNode);
                },
              },
              {
                key: "__focusedElementIndex",
                get: function () {
                  var e = this.__focusableElements;
                  return e.indexOf(e.filter(wn).pop());
                },
              },
              {
                key: "hostConnected",
                value: function () {
                  document.addEventListener("keydown", this.__onKeyDown);
                },
              },
              {
                key: "hostDisconnected",
                value: function () {
                  document.removeEventListener("keydown", this.__onKeyDown);
                },
              },
              {
                key: "trapFocus",
                value: function (e) {
                  if (
                    ((this.__trapNode = e),
                    0 === this.__focusableElements.length)
                  )
                    throw (
                      ((this.__trapNode = null),
                      new Error(
                        "The trap node should have at least one focusable descendant or be focusable itself."
                      ))
                    );
                  Tn.push(this),
                    -1 === this.__focusedElementIndex &&
                      this.__focusableElements[0].focus();
                },
              },
              {
                key: "releaseFocus",
                value: function () {
                  (this.__trapNode = null), Tn.pop();
                },
              },
              {
                key: "__onKeyDown",
                value: function (e) {
                  if (
                    this.__trapNode &&
                    this === Array.from(Tn).pop() &&
                    "Tab" === e.key
                  ) {
                    e.preventDefault();
                    var t = e.shiftKey;
                    this.__focusNextElement(t);
                  }
                },
              },
              {
                key: "__focusNextElement",
                value: function () {
                  var e =
                      arguments.length > 0 &&
                      void 0 !== arguments[0] &&
                      arguments[0],
                    t = this.__focusableElements,
                    n = e ? -1 : 1,
                    i = this.__focusedElementIndex,
                    r = t[(t.length + i + n) % t.length];
                  r.focus(), "input" === r.localName && r.select();
                },
              },
            ]),
            e
          );
        })(),
        On = W(function (e) {
          return "function" == typeof e.prototype.addController
            ? e
            : (function (e) {
                function t() {
                  var e;
                  return (
                    (0, r.Z)(this, t),
                    ((e = (0, a.Z)(this, t)).__controllers = new Set()),
                    e
                  );
                }
                return (
                  (0, s.Z)(t, e),
                  (0, o.Z)(t, [
                    {
                      key: "connectedCallback",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "connectedCallback",
                          this
                        ).call(this),
                          this.__controllers.forEach(function (e) {
                            e.hostConnected && e.hostConnected();
                          });
                      },
                    },
                    {
                      key: "disconnectedCallback",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "disconnectedCallback",
                          this
                        ).call(this),
                          this.__controllers.forEach(function (e) {
                            e.hostDisconnected && e.hostDisconnected();
                          });
                      },
                    },
                    {
                      key: "addController",
                      value: function (e) {
                        this.__controllers.add(e),
                          void 0 !== this.$ &&
                            this.isConnected &&
                            e.hostConnected &&
                            e.hostConnected();
                      },
                    },
                    {
                      key: "removeController",
                      value: function (e) {
                        this.__controllers.delete(e);
                      },
                    },
                  ]),
                  t
                );
              })(e);
        }),
        Zn =
          (n(67712),
          function () {
            return Array.from(document.body.children)
              .filter(function (e) {
                return (
                  e instanceof HTMLElement &&
                  e._hasOverlayStackMixin &&
                  !e.hasAttribute("closing")
                );
              })
              .sort(function (e, t) {
                return e.__zIndex - t.__zIndex || 0;
              });
          }),
        Vn = function (e) {
          return (function (e) {
            function t() {
              var e;
              return (
                (0, r.Z)(this, t),
                ((e = (0, a.Z)(this, t))._hasOverlayStackMixin = !0),
                e
              );
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(t, [
                {
                  key: "_last",
                  get: function () {
                    return (function (e) {
                      return e === Zn().pop();
                    })(this);
                  },
                },
                {
                  key: "bringToFront",
                  value: function () {
                    var e = this,
                      t = "",
                      n = Zn()
                        .filter(function (t) {
                          return t !== e;
                        })
                        .pop();
                    n && (t = n.__zIndex + 1);
                    (this.style.zIndex = t),
                      (this.__zIndex =
                        t || parseFloat(getComputedStyle(this).zIndex));
                  },
                },
                {
                  key: "_enterModalState",
                  value: function () {
                    var e = this;
                    "none" !== document.body.style.pointerEvents &&
                      ((this._previousDocumentPointerEvents =
                        document.body.style.pointerEvents),
                      (document.body.style.pointerEvents = "none")),
                      Zn().forEach(function (t) {
                        t !== e && (t.$.overlay.style.pointerEvents = "none");
                      });
                  },
                },
                {
                  key: "_exitModalState",
                  value: function () {
                    void 0 !== this._previousDocumentPointerEvents &&
                      ((document.body.style.pointerEvents =
                        this._previousDocumentPointerEvents),
                      delete this._previousDocumentPointerEvents);
                    for (
                      var e, t = Zn();
                      (e = t.pop()) &&
                      (e === this ||
                        (e.$.overlay.style.removeProperty("pointer-events"),
                        e.modeless));

                    );
                  },
                },
              ]),
              t
            );
          })(e);
        },
        Nn = (0, p.iv)(
          En ||
            (En = (0, i.Z)([
              ":host{z-index:200;position:fixed;inset:0;bottom:var(--vaadin-overlay-viewport-bottom);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:auto;pointer-events:none;-webkit-tap-highlight-color:transparent;--vaadin-overlay-viewport-bottom:0}:host(:not([opened]):not([closing])),:host([hidden]){display:none!important}[part=overlay]{-webkit-overflow-scrolling:touch;overflow:auto;pointer-events:auto;max-width:100%;box-sizing:border-box;-webkit-tap-highlight-color:initial}[part=backdrop]{z-index:-1;content:'';background:rgba(0,0,0,.5);position:fixed;inset:0;pointer-events:auto}",
            ]))
        ),
        Ln = n(93359);
      n(27392);
      var zn,
        Rn,
        Mn = { start: "top", end: "bottom" },
        Fn = { start: "left", end: "right" },
        Dn = new ResizeObserver(function (e) {
          setTimeout(function () {
            e.forEach(function (e) {
              e.target.__overlay && e.target.__overlay._updatePosition();
            });
          });
        }),
        Hn = function (e) {
          return (function (e) {
            function t() {
              var e;
              return (
                (0, r.Z)(this, t),
                ((e = (0, a.Z)(this, t)).__onScroll = e.__onScroll.bind(
                  (0, Gt.Z)(e)
                )),
                (e._updatePosition = e._updatePosition.bind((0, Gt.Z)(e))),
                e
              );
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "connectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "connectedCallback",
                        this
                      ).call(this),
                        this.opened && this.__addUpdatePositionEventListeners();
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "disconnectedCallback",
                        this
                      ).call(this),
                        this.__removeUpdatePositionEventListeners();
                    },
                  },
                  {
                    key: "__addUpdatePositionEventListeners",
                    value: function () {
                      var e = this;
                      window.addEventListener("resize", this._updatePosition),
                        (this.__positionTargetAncestorRootNodes = (function (
                          e
                        ) {
                          for (var t = []; e; ) {
                            if (e.nodeType === Node.DOCUMENT_NODE) {
                              t.push(e);
                              break;
                            }
                            e.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
                              ? (e = e.assignedSlot
                                  ? e.assignedSlot
                                  : e.parentNode)
                              : (t.push(e), (e = e.host));
                          }
                          return t;
                        })(this.positionTarget)),
                        this.__positionTargetAncestorRootNodes.forEach(
                          function (t) {
                            t.addEventListener("scroll", e.__onScroll, !0);
                          }
                        );
                    },
                  },
                  {
                    key: "__removeUpdatePositionEventListeners",
                    value: function () {
                      var e = this;
                      window.removeEventListener(
                        "resize",
                        this._updatePosition
                      ),
                        this.__positionTargetAncestorRootNodes &&
                          (this.__positionTargetAncestorRootNodes.forEach(
                            function (t) {
                              t.removeEventListener("scroll", e.__onScroll, !0);
                            }
                          ),
                          (this.__positionTargetAncestorRootNodes = null));
                    },
                  },
                  {
                    key: "__overlayOpenedChanged",
                    value: function (e, t) {
                      var n = this;
                      if (
                        (this.__removeUpdatePositionEventListeners(),
                        t &&
                          ((t.__overlay = null),
                          Dn.unobserve(t),
                          e &&
                            (this.__addUpdatePositionEventListeners(),
                            (t.__overlay = this),
                            Dn.observe(t))),
                        e)
                      ) {
                        var i = getComputedStyle(this);
                        this.__margins ||
                          ((this.__margins = {}),
                          ["top", "bottom", "left", "right"].forEach(
                            function (e) {
                              n.__margins[e] = parseInt(i[e], 10);
                            }
                          )),
                          this.setAttribute("dir", i.direction),
                          this._updatePosition(),
                          requestAnimationFrame(function () {
                            return n._updatePosition();
                          });
                      }
                    },
                  },
                  {
                    key: "__positionSettingsChanged",
                    value: function () {
                      this._updatePosition();
                    },
                  },
                  {
                    key: "__onScroll",
                    value: function (e) {
                      this.contains(e.target) || this._updatePosition();
                    },
                  },
                  {
                    key: "_updatePosition",
                    value: function () {
                      if (this.positionTarget && this.opened) {
                        var e = this.positionTarget.getBoundingClientRect(),
                          t = this.__shouldAlignStartVertically(e);
                        this.style.justifyContent = t
                          ? "flex-start"
                          : "flex-end";
                        var n = this.__isRTL,
                          i = this.__shouldAlignStartHorizontally(e, n),
                          r = (!n && i) || (n && !i);
                        this.style.alignItems = r ? "flex-start" : "flex-end";
                        var o = this.getBoundingClientRect(),
                          a = this.__calculatePositionInOneDimension(
                            e,
                            o,
                            this.noVerticalOverlap,
                            Mn,
                            this,
                            t
                          ),
                          s = this.__calculatePositionInOneDimension(
                            e,
                            o,
                            this.noHorizontalOverlap,
                            Fn,
                            this,
                            i
                          );
                        Object.assign(this.style, a, s),
                          this.toggleAttribute("bottom-aligned", !t),
                          this.toggleAttribute("top-aligned", t),
                          this.toggleAttribute("end-aligned", !r),
                          this.toggleAttribute("start-aligned", r);
                      }
                    },
                  },
                  {
                    key: "__shouldAlignStartHorizontally",
                    value: function (e, t) {
                      var n = Math.max(
                        this.__oldContentWidth || 0,
                        this.$.overlay.offsetWidth
                      );
                      this.__oldContentWidth = this.$.overlay.offsetWidth;
                      var i = Math.min(
                          window.innerWidth,
                          document.documentElement.clientWidth
                        ),
                        r =
                          (!t && "start" === this.horizontalAlign) ||
                          (t && "end" === this.horizontalAlign);
                      return this.__shouldAlignStart(
                        e,
                        n,
                        i,
                        this.__margins,
                        r,
                        this.noHorizontalOverlap,
                        Fn
                      );
                    },
                  },
                  {
                    key: "__shouldAlignStartVertically",
                    value: function (e) {
                      var t =
                        this.requiredVerticalSpace ||
                        Math.max(
                          this.__oldContentHeight || 0,
                          this.$.overlay.offsetHeight
                        );
                      this.__oldContentHeight = this.$.overlay.offsetHeight;
                      var n = Math.min(
                          window.innerHeight,
                          document.documentElement.clientHeight
                        ),
                        i = "top" === this.verticalAlign;
                      return this.__shouldAlignStart(
                        e,
                        t,
                        n,
                        this.__margins,
                        i,
                        this.noVerticalOverlap,
                        Mn
                      );
                    },
                  },
                  {
                    key: "__shouldAlignStart",
                    value: function (e, t, n, i, r, o, a) {
                      var s = n - e[o ? a.end : a.start] - i[a.end],
                        l = e[o ? a.start : a.end] - i[a.start],
                        u = r ? s : l;
                      return r === (u > (r ? l : s) || u > t);
                    },
                  },
                  {
                    key: "__adjustBottomProperty",
                    value: function (e, t, n) {
                      var i;
                      if (e === t.end) {
                        if (t.end === Mn.end) {
                          var r = Math.min(
                            window.innerHeight,
                            document.documentElement.clientHeight
                          );
                          if (n > r && this.__oldViewportHeight)
                            i = n - (this.__oldViewportHeight - r);
                          this.__oldViewportHeight = r;
                        }
                        if (t.end === Fn.end) {
                          var o = Math.min(
                            window.innerWidth,
                            document.documentElement.clientWidth
                          );
                          if (n > o && this.__oldViewportWidth)
                            i = n - (this.__oldViewportWidth - o);
                          this.__oldViewportWidth = o;
                        }
                      }
                      return i;
                    },
                  },
                  {
                    key: "__calculatePositionInOneDimension",
                    value: function (e, t, n, i, r, o) {
                      var a = o ? i.start : i.end,
                        s = o ? i.end : i.start,
                        l = parseFloat(r.style[a] || getComputedStyle(r)[a]),
                        u = this.__adjustBottomProperty(a, i, l),
                        h =
                          t[o ? i.start : i.end] - e[n === o ? i.end : i.start],
                        c = "".concat(u || l + h * (o ? -1 : 1), "px");
                      return (0, Ln.Z)((0, Ln.Z)({}, a, c), s, "");
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        positionTarget: { type: Object, value: null, sync: !0 },
                        horizontalAlign: {
                          type: String,
                          value: "start",
                          sync: !0,
                        },
                        verticalAlign: { type: String, value: "top", sync: !0 },
                        noHorizontalOverlap: {
                          type: Boolean,
                          value: !1,
                          sync: !0,
                        },
                        noVerticalOverlap: {
                          type: Boolean,
                          value: !1,
                          sync: !0,
                        },
                        requiredVerticalSpace: {
                          type: Number,
                          value: 0,
                          sync: !0,
                        },
                      };
                    },
                  },
                  {
                    key: "observers",
                    get: function () {
                      return [
                        "__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)",
                        "__overlayOpenedChanged(opened, positionTarget)",
                      ];
                    },
                  },
                ]
              ),
              t
            );
          })(e);
        };
      S(
        "vaadin-combo-box-overlay",
        [
          Nn,
          (0, p.iv)(
            zn ||
              (zn = (0, i.Z)([
                "\n  #overlay {\n    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));\n  }\n\n  [part='content'] {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n  }\n",
              ]))
          ),
        ],
        { moduleId: "vaadin-combo-box-overlay-styles" }
      );
      var Bn = (function (e) {
        function t() {
          return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
        }
        return (
          (0, s.Z)(t, e),
          (0, o.Z)(t, null, [
            {
              key: "is",
              get: function () {
                return "vaadin-combo-box-overlay";
              },
            },
            {
              key: "template",
              get: function () {
                return Ht(
                  Rn ||
                    (Rn = (0, i.Z)([
                      '\n      <div id="backdrop" part="backdrop" hidden></div>\n      <div part="overlay" id="overlay">\n        <div part="loader"></div>\n        <div part="content" id="content"><slot></slot></div>\n      </div>\n    ',
                    ]))
                );
              },
            },
          ]),
          t
        );
      })(
        (function (e) {
          return (function (e) {
            function t() {
              var e;
              return (
                (0, r.Z)(this, t),
                ((e = (0, a.Z)(this, t)).requiredVerticalSpace = 200),
                e
              );
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "connectedCallback",
                    value: function () {
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "connectedCallback",
                        this
                      ).call(this);
                      var e = this._comboBox,
                        n = e && e.getAttribute("dir");
                      n && this.setAttribute("dir", n);
                    },
                  },
                  {
                    key: "_shouldCloseOnOutsideClick",
                    value: function (e) {
                      var t = e.composedPath();
                      return (
                        !t.includes(this.positionTarget) && !t.includes(this)
                      );
                    },
                  },
                  {
                    key: "_updateOverlayWidth",
                    value: function () {
                      var e = this.localName;
                      this.style.setProperty(
                        "--_".concat(e, "-default-width"),
                        "".concat(this.positionTarget.clientWidth, "px")
                      );
                      var t = getComputedStyle(this._comboBox).getPropertyValue(
                        "--".concat(e, "-width")
                      );
                      "" === t
                        ? this.style.removeProperty("--".concat(e, "-width"))
                        : this.style.setProperty("--".concat(e, "-width"), t);
                    },
                  },
                  {
                    key: "_setOverlayWidth",
                    value: function (e, t) {
                      e &&
                        t &&
                        (this._updateOverlayWidth(), this._updatePosition());
                    },
                  },
                ],
                [
                  {
                    key: "observers",
                    get: function () {
                      return ["_setOverlayWidth(positionTarget, opened)"];
                    },
                  },
                ]
              ),
              t
            );
          })(Hn(e));
        })(
          (function (e) {
            return (function (e) {
              function t() {
                var e;
                return (
                  (0, r.Z)(this, t),
                  ((e = (0, a.Z)(this, t))._boundMouseDownListener =
                    e._mouseDownListener.bind((0, Gt.Z)(e))),
                  (e._boundMouseUpListener = e._mouseUpListener.bind(
                    (0, Gt.Z)(e)
                  )),
                  (e._boundOutsideClickListener = e._outsideClickListener.bind(
                    (0, Gt.Z)(e)
                  )),
                  (e._boundKeydownListener = e._keydownListener.bind(
                    (0, Gt.Z)(e)
                  )),
                  ln &&
                    (e._boundIosResizeListener = function () {
                      return e._detectIosNavbar();
                    }),
                  e
                );
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "ready",
                      value: function () {
                        var e = this;
                        (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(
                          this
                        ),
                          this.addEventListener("click", function () {}),
                          this.$.backdrop.addEventListener(
                            "click",
                            function () {}
                          ),
                          this.addEventListener("mouseup", function () {
                            document.activeElement === document.body &&
                              "0" === e.$.overlay.getAttribute("tabindex") &&
                              e.$.overlay.focus();
                          });
                      },
                    },
                    {
                      key: "connectedCallback",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "connectedCallback",
                          this
                        ).call(this),
                          this._boundIosResizeListener &&
                            (this._detectIosNavbar(),
                            window.addEventListener(
                              "resize",
                              this._boundIosResizeListener
                            ));
                      },
                    },
                    {
                      key: "disconnectedCallback",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "disconnectedCallback",
                          this
                        ).call(this),
                          this._boundIosResizeListener &&
                            window.removeEventListener(
                              "resize",
                              this._boundIosResizeListener
                            );
                      },
                    },
                    {
                      key: "requestContentUpdate",
                      value: function () {
                        this.renderer &&
                          this.renderer.call(
                            this.owner,
                            this,
                            this.owner,
                            this.model
                          );
                      },
                    },
                    {
                      key: "close",
                      value: function (e) {
                        var t = new CustomEvent("vaadin-overlay-close", {
                          bubbles: !0,
                          cancelable: !0,
                          detail: { sourceEvent: e },
                        });
                        this.dispatchEvent(t),
                          t.defaultPrevented || (this.opened = !1);
                      },
                    },
                    {
                      key: "_detectIosNavbar",
                      value: function () {
                        if (this.opened) {
                          var e = window.innerHeight,
                            t = window.innerWidth > e,
                            n = document.documentElement.clientHeight;
                          t && n > e
                            ? this.style.setProperty(
                                "--vaadin-overlay-viewport-bottom",
                                "".concat(n - e, "px")
                              )
                            : this.style.setProperty(
                                "--vaadin-overlay-viewport-bottom",
                                "0"
                              );
                        }
                      },
                    },
                    {
                      key: "_addGlobalListeners",
                      value: function () {
                        document.addEventListener(
                          "mousedown",
                          this._boundMouseDownListener
                        ),
                          document.addEventListener(
                            "mouseup",
                            this._boundMouseUpListener
                          ),
                          document.documentElement.addEventListener(
                            "click",
                            this._boundOutsideClickListener,
                            !0
                          );
                      },
                    },
                    {
                      key: "_removeGlobalListeners",
                      value: function () {
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
                      },
                    },
                    {
                      key: "_rendererOrDataChanged",
                      value: function (e, t, n, i) {
                        var r = this._oldOwner !== t || this._oldModel !== n;
                        (this._oldModel = n), (this._oldOwner = t);
                        var o = this._oldRenderer !== e;
                        this._oldRenderer = e;
                        var a = this._oldOpened !== i;
                        (this._oldOpened = i),
                          o && ((this.innerHTML = ""), delete this._$litPart$),
                          i &&
                            e &&
                            (o || a || r) &&
                            this.requestContentUpdate();
                      },
                    },
                    {
                      key: "_modelessChanged",
                      value: function (e) {
                        e
                          ? (this._removeGlobalListeners(),
                            this._exitModalState())
                          : this.opened &&
                            (this._addGlobalListeners(),
                            this._enterModalState());
                      },
                    },
                    {
                      key: "_openedChanged",
                      value: function (e, t) {
                        var n = this;
                        e
                          ? (this._saveFocus(),
                            this._animatedOpening(),
                            rn(this, function () {
                              n._trapFocus();
                              var e = new CustomEvent("vaadin-overlay-open", {
                                bubbles: !0,
                              });
                              n.dispatchEvent(e);
                            }),
                            document.addEventListener(
                              "keydown",
                              this._boundKeydownListener
                            ),
                            this.modeless || this._addGlobalListeners())
                          : t &&
                            (this._resetFocus(),
                            this._animatedClosing(),
                            document.removeEventListener(
                              "keydown",
                              this._boundKeydownListener
                            ),
                            this.modeless || this._removeGlobalListeners());
                      },
                    },
                    {
                      key: "_hiddenChanged",
                      value: function (e) {
                        e &&
                          this.hasAttribute("closing") &&
                          this._flushAnimation("closing");
                      },
                    },
                    {
                      key: "_shouldAnimate",
                      value: function () {
                        var e = getComputedStyle(this),
                          t = e.getPropertyValue("animation-name");
                        return (
                          !("none" === e.getPropertyValue("display")) &&
                          t &&
                          "none" !== t
                        );
                      },
                    },
                    {
                      key: "_enqueueAnimation",
                      value: function (e, t) {
                        var n = this,
                          i = "__".concat(e, "Handler"),
                          r = function e(r) {
                            (r && r.target !== n) ||
                              (t(),
                              n.removeEventListener("animationend", e),
                              delete n[i]);
                          };
                        (this[i] = r), this.addEventListener("animationend", r);
                      },
                    },
                    {
                      key: "_flushAnimation",
                      value: function (e) {
                        var t = "__".concat(e, "Handler");
                        "function" == typeof this[t] && this[t]();
                      },
                    },
                    {
                      key: "_animatedOpening",
                      value: function () {
                        var e = this;
                        this.parentNode === document.body &&
                          this.hasAttribute("closing") &&
                          this._flushAnimation("closing"),
                          this._attachOverlay(),
                          this.modeless || this._enterModalState(),
                          this.setAttribute("opening", ""),
                          this._shouldAnimate()
                            ? this._enqueueAnimation("opening", function () {
                                e._finishOpening();
                              })
                            : this._finishOpening();
                      },
                    },
                    {
                      key: "_attachOverlay",
                      value: function () {
                        (this._placeholder = document.createComment(
                          "vaadin-overlay-placeholder"
                        )),
                          this.parentNode.insertBefore(this._placeholder, this),
                          document.body.appendChild(this),
                          this.bringToFront();
                      },
                    },
                    {
                      key: "_finishOpening",
                      value: function () {
                        this.removeAttribute("opening");
                      },
                    },
                    {
                      key: "_finishClosing",
                      value: function () {
                        this._detachOverlay(),
                          this.$.overlay.style.removeProperty("pointer-events"),
                          this.removeAttribute("closing"),
                          this.dispatchEvent(
                            new CustomEvent("vaadin-overlay-closed")
                          );
                      },
                    },
                    {
                      key: "_animatedClosing",
                      value: function () {
                        var e = this;
                        this.hasAttribute("opening") &&
                          this._flushAnimation("opening"),
                          this._placeholder &&
                            (this._exitModalState(),
                            this.setAttribute("closing", ""),
                            this.dispatchEvent(
                              new CustomEvent("vaadin-overlay-closing")
                            ),
                            this._shouldAnimate()
                              ? this._enqueueAnimation("closing", function () {
                                  e._finishClosing();
                                })
                              : this._finishClosing());
                      },
                    },
                    {
                      key: "_detachOverlay",
                      value: function () {
                        this._placeholder.parentNode.insertBefore(
                          this,
                          this._placeholder
                        ),
                          this._placeholder.parentNode.removeChild(
                            this._placeholder
                          );
                      },
                    },
                    {
                      key: "_mouseDownListener",
                      value: function (e) {
                        this._mouseDownInside =
                          e.composedPath().indexOf(this.$.overlay) >= 0;
                      },
                    },
                    {
                      key: "_mouseUpListener",
                      value: function (e) {
                        this._mouseUpInside =
                          e.composedPath().indexOf(this.$.overlay) >= 0;
                      },
                    },
                    {
                      key: "_shouldCloseOnOutsideClick",
                      value: function (e) {
                        return this._last;
                      },
                    },
                    {
                      key: "_outsideClickListener",
                      value: function (e) {
                        if (
                          e.composedPath().includes(this.$.overlay) ||
                          this._mouseDownInside ||
                          this._mouseUpInside
                        )
                          return (
                            (this._mouseDownInside = !1),
                            void (this._mouseUpInside = !1)
                          );
                        if (this._shouldCloseOnOutsideClick(e)) {
                          var t = new CustomEvent(
                            "vaadin-overlay-outside-click",
                            {
                              bubbles: !0,
                              cancelable: !0,
                              detail: { sourceEvent: e },
                            }
                          );
                          this.dispatchEvent(t),
                            this.opened && !t.defaultPrevented && this.close(e);
                        }
                      },
                    },
                    {
                      key: "_keydownListener",
                      value: function (e) {
                        if (
                          this._last &&
                          (!this.modeless ||
                            e.composedPath().includes(this.$.overlay)) &&
                          "Escape" === e.key
                        ) {
                          var t = new CustomEvent(
                            "vaadin-overlay-escape-press",
                            {
                              bubbles: !0,
                              cancelable: !0,
                              detail: { sourceEvent: e },
                            }
                          );
                          this.dispatchEvent(t),
                            this.opened && !t.defaultPrevented && this.close(e);
                        }
                      },
                    },
                  ],
                  [
                    {
                      key: "properties",
                      get: function () {
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
                      },
                    },
                    {
                      key: "observers",
                      get: function () {
                        return [
                          "_rendererOrDataChanged(renderer, owner, model, opened)",
                        ];
                      },
                    },
                  ]
                ),
                t
              );
            })(
              (function (e) {
                return (function (e) {
                  function t() {
                    var e;
                    return (
                      (0, r.Z)(this, t),
                      ((e = (0, a.Z)(this, t)).__ariaModalController = new gn(
                        (0, Gt.Z)(e)
                      )),
                      (e.__focusTrapController = new An((0, Gt.Z)(e))),
                      (e.__focusRestorationController = new Sn()),
                      e
                    );
                  }
                  return (
                    (0, s.Z)(t, e),
                    (0, o.Z)(
                      t,
                      [
                        {
                          key: "ready",
                          value: function () {
                            (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(
                              this
                            ),
                              this.addController(this.__ariaModalController),
                              this.addController(this.__focusTrapController),
                              this.addController(
                                this.__focusRestorationController
                              );
                          },
                        },
                        {
                          key: "_resetFocus",
                          value: function () {
                            this.focusTrap &&
                              (this.__ariaModalController.close(),
                              this.__focusTrapController.releaseFocus()),
                              this.restoreFocusOnClose &&
                                this._shouldRestoreFocus() &&
                                this.__focusRestorationController.restoreFocus();
                          },
                        },
                        {
                          key: "_saveFocus",
                          value: function () {
                            this.restoreFocusOnClose &&
                              this.__focusRestorationController.saveFocus(
                                this.restoreFocusNode
                              );
                          },
                        },
                        {
                          key: "_trapFocus",
                          value: function () {
                            this.focusTrap &&
                              (this.__ariaModalController.showModal(),
                              this.__focusTrapController.trapFocus(
                                this.$.overlay
                              ));
                          },
                        },
                        {
                          key: "_shouldRestoreFocus",
                          value: function () {
                            var e = kn();
                            return e === document.body || this._deepContains(e);
                          },
                        },
                        {
                          key: "_deepContains",
                          value: function (e) {
                            if (this.contains(e)) return !0;
                            for (
                              var t = e, n = e.ownerDocument;
                              t && t !== n && t !== this;

                            )
                              t = t.parentNode || t.host;
                            return t === this;
                          },
                        },
                      ],
                      [
                        {
                          key: "properties",
                          get: function () {
                            return {
                              focusTrap: { type: Boolean, value: !1 },
                              restoreFocusOnClose: { type: Boolean, value: !1 },
                              restoreFocusNode: { type: HTMLElement },
                            };
                          },
                        },
                      ]
                    ),
                    t
                  );
                })(On(e));
              })(Vn(e))
            );
          })(Yt(L(jt)))
        )
      );
      function jn(e, t) {
        return e.split(".").reduce(function (e, t) {
          return e ? e[t] : void 0;
        }, t);
      }
      u(Bn);
      var qn = 0;
      n(21371);
      var Un = 0,
        $n = 0,
        Wn = [],
        Yn = !1;
      var Kn = function (e) {
          return {
            run: function (t) {
              return window.setTimeout(t, e);
            },
            cancel: function (e) {
              window.clearTimeout(e);
            },
          };
        },
        Gn = {
          run: function (e) {
            return window.requestAnimationFrame(e);
          },
          cancel: function (e) {
            window.cancelAnimationFrame(e);
          },
        },
        Jn = {
          run: function (e) {
            return window.requestIdleCallback
              ? window.requestIdleCallback(e)
              : window.setTimeout(e, 16);
          },
          cancel: function (e) {
            window.cancelIdleCallback
              ? window.cancelIdleCallback(e)
              : window.clearTimeout(e);
          },
        },
        Xn = {
          run: function (e) {
            Yn ||
              ((Yn = !0),
              queueMicrotask(function () {
                return (function () {
                  Yn = !1;
                  for (
                    var e = Wn.length,
                      t = function () {
                        var e = Wn[n];
                        if (e)
                          try {
                            e();
                          } catch (t) {
                            setTimeout(function () {
                              throw t;
                            });
                          }
                      },
                      n = 0;
                    n < e;
                    n++
                  )
                    t();
                  Wn.splice(0, e), ($n += e);
                })();
              })),
              Wn.push(e);
            var t = Un;
            return (Un += 1), t;
          },
          cancel: function (e) {
            var t = e - $n;
            if (t >= 0) {
              if (!Wn[t]) throw new Error("invalid async handle: ".concat(e));
              Wn[t] = null;
            }
          },
        },
        Qn = new Set(),
        ei = (function () {
          function e() {
            (0, r.Z)(this, e),
              (this._asyncModule = null),
              (this._callback = null),
              (this._timer = null);
          }
          return (
            (0, o.Z)(
              e,
              [
                {
                  key: "setConfig",
                  value: function (e, t) {
                    var n = this;
                    (this._asyncModule = e),
                      (this._callback = t),
                      (this._timer = this._asyncModule.run(function () {
                        (n._timer = null), Qn.delete(n), n._callback();
                      }));
                  },
                },
                {
                  key: "cancel",
                  value: function () {
                    this.isActive() && (this._cancelAsync(), Qn.delete(this));
                  },
                },
                {
                  key: "_cancelAsync",
                  value: function () {
                    this.isActive() &&
                      (this._asyncModule.cancel(this._timer),
                      (this._timer = null));
                  },
                },
                {
                  key: "flush",
                  value: function () {
                    this.isActive() && (this.cancel(), this._callback());
                  },
                },
                {
                  key: "isActive",
                  value: function () {
                    return null != this._timer;
                  },
                },
              ],
              [
                {
                  key: "debounce",
                  value: function (t, n, i) {
                    return (
                      t instanceof e ? t._cancelAsync() : (t = new e()),
                      t.setConfig(n, i),
                      t
                    );
                  },
                },
              ]
            ),
            e
          );
        })();
      var ti = function () {
          var e, t;
          do {
            (t = void 0),
              (t = Boolean(Qn.size)),
              Qn.forEach(function (e) {
                try {
                  e.flush();
                } catch (t) {
                  setTimeout(function () {
                    throw t;
                  });
                }
              }),
              (e = t);
          } while (e);
        },
        ni = navigator.userAgent.match(
          /iP(?:hone|ad;(?: U;)? CPU) OS ([0-9]+)/
        ),
        ii = ni && ni[1] >= 8,
        ri = {
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
            var e = this._virtualCount;
            return Math.max(0, e - this._physicalCount);
          },
          get _virtualStart() {
            return this._virtualStartVal || 0;
          },
          set _virtualStart(e) {
            (e = this._clamp(e, 0, this._maxVirtualStart)),
              (this._virtualStartVal = e);
          },
          get _physicalStart() {
            return this._physicalStartVal || 0;
          },
          set _physicalStart(e) {
            (e %= this._physicalCount) < 0 && (e = this._physicalCount + e),
              (this._physicalStartVal = e);
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
          set _physicalCount(e) {
            this._physicalCountVal = e;
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
            var e = this,
              t = this._firstVisibleIndexVal;
            if (null == t) {
              var n = this._physicalTop + this._scrollOffset;
              (t =
                this._iterateItems(function (t, i) {
                  if ((n += e._getPhysicalSizeIncrement(t)) > e._scrollPosition)
                    return i;
                }) || 0),
                (this._firstVisibleIndexVal = t);
            }
            return t;
          },
          get lastVisibleIndex() {
            var e = this,
              t = this._lastVisibleIndexVal;
            if (null == t) {
              var n = this._physicalTop + this._scrollOffset;
              this._iterateItems(function (i, r) {
                n < e._scrollBottom && (t = r),
                  (n += e._getPhysicalSizeIncrement(i));
              }),
                (this._lastVisibleIndexVal = t);
            }
            return t;
          },
          get _scrollOffset() {
            return this._scrollerPaddingTop + this.scrollOffset;
          },
          _scrollHandler: function () {
            var e = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop)),
              t = e - this._scrollPosition,
              n = t >= 0;
            if (
              ((this._scrollPosition = e),
              (this._firstVisibleIndexVal = null),
              (this._lastVisibleIndexVal = null),
              Math.abs(t) > this._physicalSize && this._physicalSize > 0)
            ) {
              t -= this._scrollOffset;
              var i = Math.round(t / this._physicalAverage);
              (this._virtualStart += i),
                (this._physicalStart += i),
                (this._physicalTop = Math.min(
                  Math.floor(this._virtualStart) * this._physicalAverage,
                  this._scrollPosition
                )),
                this._update();
            } else if (this._physicalCount > 0) {
              var r = this._getReusables(n);
              n
                ? ((this._physicalTop = r.physicalTop),
                  (this._virtualStart += r.indexes.length),
                  (this._physicalStart += r.indexes.length))
                : ((this._virtualStart -= r.indexes.length),
                  (this._physicalStart -= r.indexes.length)),
                this._update(r.indexes, n ? null : r.indexes),
                this._debounce(
                  "_increasePoolIfNeeded",
                  this._increasePoolIfNeeded.bind(this, 0),
                  Xn
                );
            }
          },
          _getReusables: function (e) {
            var t,
              n,
              i,
              r = [],
              o = this._hiddenContentSize * this._ratio,
              a = this._virtualStart,
              s = this._virtualEnd,
              l = this._physicalCount,
              u = this._physicalTop + this._scrollOffset,
              h = this._physicalBottom + this._scrollOffset,
              c = this._scrollPosition,
              d = this._scrollBottom;
            for (
              e
                ? ((t = this._physicalStart), (n = c - u))
                : ((t = this._physicalEnd), (n = h - d));
              (n -= i = this._getPhysicalSizeIncrement(t)),
                !(r.length >= l || n <= o);

            )
              if (e) {
                if (s + r.length + 1 >= this._virtualCount) break;
                if (u + i >= c - this._scrollOffset) break;
                r.push(t), (u += i), (t = (t + 1) % l);
              } else {
                if (a - r.length <= 0) break;
                if (u + this._physicalSize - i <= d) break;
                r.push(t), (u -= i), (t = 0 === t ? l - 1 : t - 1);
              }
            return { indexes: r, physicalTop: u - this._scrollOffset };
          },
          _update: function (e, t) {
            if (!((e && 0 === e.length) || 0 === this._physicalCount)) {
              if ((this._assignModels(e), this._updateMetrics(e), t))
                for (; t.length; ) {
                  var n = t.pop();
                  this._physicalTop -= this._getPhysicalSizeIncrement(n);
                }
              this._positionItems(), this._updateScrollerSize();
            }
          },
          _isClientFull: function () {
            return (
              0 !== this._scrollBottom &&
              this._physicalBottom - 1 >= this._scrollBottom &&
              this._physicalTop <= this._scrollPosition
            );
          },
          _increasePoolIfNeeded: function (e) {
            var t =
                this._clamp(
                  this._physicalCount + e,
                  3,
                  this._virtualCount - this._virtualStart
                ) - this._physicalCount,
              n = Math.round(0.5 * this._physicalCount);
            if (!(t < 0)) {
              if (t > 0) {
                var i = window.performance.now();
                [].push.apply(this._physicalItems, this._createPool(t));
                for (var r = 0; r < t; r++) this._physicalSizes.push(0);
                (this._physicalCount += t),
                  this._physicalStart > this._physicalEnd &&
                    this._isIndexRendered(this._focusedVirtualIndex) &&
                    this._getPhysicalIndex(this._focusedVirtualIndex) <
                      this._physicalEnd &&
                    (this._physicalStart += t),
                  this._update(),
                  (this._templateCost = (window.performance.now() - i) / t),
                  (n = Math.round(0.5 * this._physicalCount));
              }
              this._virtualEnd >= this._virtualCount - 1 ||
                0 === n ||
                (this._isClientFull()
                  ? this._physicalSize < this._optPhysicalSize &&
                    this._debounce(
                      "_increasePoolIfNeeded",
                      this._increasePoolIfNeeded.bind(
                        this,
                        this._clamp(Math.round(50 / this._templateCost), 1, n)
                      ),
                      Jn
                    )
                  : this._debounce(
                      "_increasePoolIfNeeded",
                      this._increasePoolIfNeeded.bind(this, n),
                      Xn
                    ));
            }
          },
          _render: function () {
            if (this.isAttached && this._isVisible)
              if (0 !== this._physicalCount) {
                var e = this._getReusables(!0);
                (this._physicalTop = e.physicalTop),
                  (this._virtualStart += e.indexes.length),
                  (this._physicalStart += e.indexes.length),
                  this._update(e.indexes),
                  this._update(),
                  this._increasePoolIfNeeded(0);
              } else
                this._virtualCount > 0 &&
                  (this.updateViewportBoundaries(),
                  this._increasePoolIfNeeded(3));
          },
          _itemsChanged: function (e) {
            "items" === e.path &&
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
              this._debounce("_render", this._render, Gn));
          },
          _iterateItems: function (e, t) {
            var n, i, r, o;
            if (2 === arguments.length && t) {
              for (o = 0; o < t.length; o++)
                if (
                  ((n = t[o]),
                  (i = this._computeVidx(n)),
                  null != (r = e.call(this, n, i)))
                )
                  return r;
            } else {
              for (
                n = this._physicalStart, i = this._virtualStart;
                n < this._physicalCount;
                n++, i++
              )
                if (null != (r = e.call(this, n, i))) return r;
              for (n = 0; n < this._physicalStart; n++, i++)
                if (null != (r = e.call(this, n, i))) return r;
            }
          },
          _computeVidx: function (e) {
            return e >= this._physicalStart
              ? this._virtualStart + (e - this._physicalStart)
              : this._virtualStart +
                  (this._physicalCount - this._physicalStart) +
                  e;
          },
          _positionItems: function () {
            var e = this;
            this._adjustScrollPosition();
            var t = this._physicalTop;
            this._iterateItems(function (n) {
              e.translate3d(0, "".concat(t, "px"), 0, e._physicalItems[n]),
                (t += e._physicalSizes[n]);
            });
          },
          _getPhysicalSizeIncrement: function (e) {
            return this._physicalSizes[e];
          },
          _adjustScrollPosition: function () {
            var e =
              0 === this._virtualStart
                ? this._physicalTop
                : Math.min(this._scrollPosition + this._physicalTop, 0);
            if (0 !== e) {
              this._physicalTop -= e;
              var t = this._scrollPosition;
              !ii && t > 0 && this._resetScrollPosition(t - e);
            }
          },
          _resetScrollPosition: function (e) {
            this.scrollTarget &&
              e >= 0 &&
              ((this._scrollTop = e), (this._scrollPosition = this._scrollTop));
          },
          _updateScrollerSize: function (e) {
            var t =
              this._physicalBottom +
              Math.max(
                this._virtualCount - this._physicalCount - this._virtualStart,
                0
              ) *
                this._physicalAverage;
            (this._estScrollHeight = t),
              (e ||
                0 === this._scrollHeight ||
                this._scrollPosition >= t - this._physicalSize ||
                Math.abs(t - this._scrollHeight) >= this._viewportHeight) &&
                ((this.$.items.style.height = "".concat(t, "px")),
                (this._scrollHeight = t));
          },
          scrollToIndex: function (e) {
            if (
              !("number" != typeof e || e < 0 || e > this.items.length - 1) &&
              (ti(), 0 !== this._physicalCount)
            ) {
              (e = this._clamp(e, 0, this._virtualCount - 1)),
                (!this._isIndexRendered(e) || e >= this._maxVirtualStart) &&
                  (this._virtualStart = e - 1),
                this._assignModels(),
                this._updateMetrics(),
                (this._physicalTop =
                  this._virtualStart * this._physicalAverage);
              for (
                var t = this._physicalStart,
                  n = this._virtualStart,
                  i = 0,
                  r = this._hiddenContentSize;
                n < e && i <= r;

              )
                (i += this._getPhysicalSizeIncrement(t)),
                  (t = (t + 1) % this._physicalCount),
                  (n += 1);
              this._updateScrollerSize(!0),
                this._positionItems(),
                this._resetScrollPosition(
                  this._physicalTop + this._scrollOffset + i
                ),
                this._increasePoolIfNeeded(0),
                (this._firstVisibleIndexVal = null),
                (this._lastVisibleIndexVal = null);
            }
          },
          _resetAverage: function () {
            (this._physicalAverage = 0), (this._physicalAverageCount = 0);
          },
          _resizeHandler: function () {
            var e = this;
            this._debounce(
              "_render",
              function () {
                (e._firstVisibleIndexVal = null),
                  (e._lastVisibleIndexVal = null),
                  e._isVisible
                    ? (e.updateViewportBoundaries(),
                      e.toggleScrollListener(!0),
                      e._resetAverage(),
                      e._render())
                    : e.toggleScrollListener(!1);
              },
              Gn
            );
          },
          _isIndexRendered: function (e) {
            return e >= this._virtualStart && e <= this._virtualEnd;
          },
          _getPhysicalIndex: function (e) {
            return (
              (this._physicalStart + (e - this._virtualStart)) %
              this._physicalCount
            );
          },
          _clamp: function (e, t, n) {
            return Math.min(n, Math.max(t, e));
          },
          _debounce: function (e, t, n) {
            var i;
            this._debouncers || (this._debouncers = {}),
              (this._debouncers[e] = ei.debounce(
                this._debouncers[e],
                n,
                t.bind(this)
              )),
              (i = this._debouncers[e]),
              Qn.add(i);
          },
        },
        oi = 1e3,
        ai = (function () {
          function e(t) {
            var n = this,
              i = t.createElements,
              o = t.updateElement,
              a = t.scrollTarget,
              s = t.scrollContainer,
              l = t.elementsContainer,
              u = t.reorderElements;
            (0, r.Z)(this, e),
              (this.isAttached = !0),
              (this._vidxOffset = 0),
              (this.createElements = i),
              (this.updateElement = o),
              (this.scrollTarget = a),
              (this.scrollContainer = s),
              (this.elementsContainer = l || s),
              (this.reorderElements = u),
              (this._maxPages = 1.3),
              (this.__placeholderHeight = 200),
              (this.__elementHeightQueue = Array(10)),
              (this.timeouts = {
                SCROLL_REORDER: 500,
                IGNORE_WHEEL: 500,
                FIX_INVALID_ITEM_POSITIONING: 100,
              }),
              (this.__resizeObserver = new ResizeObserver(function () {
                return n._resizeHandler();
              })),
              "visible" === getComputedStyle(this.scrollTarget).overflow &&
                (this.scrollTarget.style.overflow = "auto"),
              "static" === getComputedStyle(this.scrollContainer).position &&
                (this.scrollContainer.style.position = "relative"),
              this.__resizeObserver.observe(this.scrollTarget),
              this.scrollTarget.addEventListener("scroll", function () {
                return n._scrollHandler();
              }),
              (this._scrollLineHeight = this._getScrollLineHeight()),
              this.scrollTarget.addEventListener("wheel", function (e) {
                return n.__onWheel(e);
              }),
              this.reorderElements &&
                (this.scrollTarget.addEventListener("mousedown", function () {
                  n.__mouseDown = !0;
                }),
                this.scrollTarget.addEventListener("mouseup", function () {
                  (n.__mouseDown = !1),
                    n.__pendingReorder && n.__reorderElements();
                }));
          }
          return (
            (0, o.Z)(e, [
              {
                key: "scrollOffset",
                get: function () {
                  return 0;
                },
              },
              {
                key: "adjustedFirstVisibleIndex",
                get: function () {
                  return this.firstVisibleIndex + this._vidxOffset;
                },
              },
              {
                key: "adjustedLastVisibleIndex",
                get: function () {
                  return this.lastVisibleIndex + this._vidxOffset;
                },
              },
              {
                key: "__hasPlaceholders",
                value: function () {
                  return this.__getVisibleElements().some(function (e) {
                    return e.__virtualizerPlaceholder;
                  });
                },
              },
              {
                key: "scrollToIndex",
                value: function (t) {
                  if (
                    "number" == typeof t &&
                    !isNaN(t) &&
                    0 !== this.size &&
                    this.scrollTarget.offsetHeight
                  ) {
                    delete this.__pendingScrollToIndex,
                      this._physicalCount <= 3 && this.flush(),
                      (t = this._clamp(t, 0, this.size - 1));
                    var n = this.__getVisibleElements().length,
                      i = Math.floor((t / this.size) * this._virtualCount);
                    this._virtualCount - i < n
                      ? ((i = this._virtualCount - (this.size - t)),
                        (this._vidxOffset = this.size - this._virtualCount))
                      : i < n
                      ? t < oi
                        ? ((i = t), (this._vidxOffset = 0))
                        : ((i = oi), (this._vidxOffset = t - i))
                      : (this._vidxOffset = t - i),
                      (this.__skipNextVirtualIndexAdjust = !0),
                      (0, c.Z)(
                        (0, d.Z)(e.prototype),
                        "scrollToIndex",
                        this
                      ).call(this, i),
                      this.adjustedFirstVisibleIndex !== t &&
                        this._scrollTop < this._maxScrollTop &&
                        !this.grid &&
                        (this._scrollTop -=
                          this.__getIndexScrollOffset(t) || 0),
                      this._scrollHandler(),
                      this.__hasPlaceholders() &&
                        (this.__pendingScrollToIndex = t);
                  }
                },
              },
              {
                key: "flush",
                value: function () {
                  var e = this._physicalCount;
                  0 !== this.scrollTarget.offsetHeight &&
                    (this._resizeHandler(),
                    ti(),
                    this._scrollHandler(),
                    this.__fixInvalidItemPositioningDebouncer &&
                      this.__fixInvalidItemPositioningDebouncer.flush(),
                    this.__scrollReorderDebouncer &&
                      this.__scrollReorderDebouncer.flush(),
                    this.__debouncerWheelAnimationFrame &&
                      this.__debouncerWheelAnimationFrame.flush(),
                    this._physicalCount !== e && this.flush());
                },
              },
              {
                key: "update",
                value: function () {
                  var e = this,
                    t =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : 0,
                    n =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : this.size - 1,
                    i = [];
                  this.__getVisibleElements().forEach(function (r) {
                    r.__virtualIndex >= t &&
                      r.__virtualIndex <= n &&
                      (e.__updateElement(r, r.__virtualIndex, !0), i.push(r));
                  }),
                    this.__afterElementsUpdated(i);
                },
              },
              {
                key: "_updateMetrics",
                value: function (e) {
                  var t = this;
                  ti();
                  var n = 0,
                    i = 0,
                    r = this._physicalAverageCount,
                    o = this._physicalAverage;
                  this._iterateItems(function (e, r) {
                    (i += t._physicalSizes[e]),
                      (t._physicalSizes[e] = Math.ceil(
                        t.__getBorderBoxHeight(t._physicalItems[e])
                      )),
                      (n += t._physicalSizes[e]),
                      (t._physicalAverageCount += t._physicalSizes[e] ? 1 : 0);
                  }, e),
                    (this._physicalSize = this._physicalSize + n - i),
                    this._physicalAverageCount !== r &&
                      (this._physicalAverage = Math.round(
                        (o * r + n) / this._physicalAverageCount
                      ));
                },
              },
              {
                key: "__getBorderBoxHeight",
                value: function (e) {
                  var t = getComputedStyle(e),
                    n = parseFloat(t.height) || 0;
                  return "border-box" === t.boxSizing
                    ? n
                    : n +
                        (parseFloat(t.paddingBottom) || 0) +
                        (parseFloat(t.paddingTop) || 0) +
                        (parseFloat(t.borderBottomWidth) || 0) +
                        (parseFloat(t.borderTopWidth) || 0);
                },
              },
              {
                key: "__updateElement",
                value: function (e, t, n) {
                  e.__virtualizerPlaceholder &&
                    ((e.style.paddingTop = ""),
                    (e.__virtualizerPlaceholder = !1)),
                    this.__preventElementUpdates ||
                      (e.__lastUpdatedIndex === t && !n) ||
                      (this.updateElement(e, t), (e.__lastUpdatedIndex = t));
                },
              },
              {
                key: "__afterElementsUpdated",
                value: function (e) {
                  var t = this;
                  e.forEach(function (e) {
                    var n = e.offsetHeight;
                    if (0 === n)
                      (e.style.paddingTop = "".concat(
                        t.__placeholderHeight,
                        "px"
                      )),
                        (e.__virtualizerPlaceholder = !0),
                        (t.__placeholderClearDebouncer = ei.debounce(
                          t.__placeholderClearDebouncer,
                          Gn,
                          function () {
                            return t._resizeHandler();
                          }
                        ));
                    else {
                      t.__elementHeightQueue.push(n),
                        t.__elementHeightQueue.shift();
                      var i = t.__elementHeightQueue.filter(function (e) {
                        return void 0 !== e;
                      });
                      t.__placeholderHeight = Math.round(
                        i.reduce(function (e, t) {
                          return e + t;
                        }, 0) / i.length
                      );
                    }
                  }),
                    void 0 === this.__pendingScrollToIndex ||
                      this.__hasPlaceholders() ||
                      this.scrollToIndex(this.__pendingScrollToIndex);
                },
              },
              {
                key: "__getIndexScrollOffset",
                value: function (e) {
                  var t = this.__getVisibleElements().find(function (t) {
                    return t.__virtualIndex === e;
                  });
                  return t
                    ? this.scrollTarget.getBoundingClientRect().top -
                        t.getBoundingClientRect().top
                    : void 0;
                },
              },
              {
                key: "size",
                get: function () {
                  return this.__size;
                },
                set: function (e) {
                  var t = this;
                  e !== this.size &&
                    (this.__fixInvalidItemPositioningDebouncer &&
                      this.__fixInvalidItemPositioningDebouncer.cancel(),
                    this._debouncers &&
                      this._debouncers._increasePoolIfNeeded &&
                      this._debouncers._increasePoolIfNeeded.cancel(),
                    (this.__size = e),
                    this._physicalItems
                      ? (this._updateScrollerSize(),
                        (this._virtualCount = this.items.length),
                        this._render())
                      : (this._itemsChanged({ path: "items" }),
                        (this.__preventElementUpdates = !0),
                        ti(),
                        (this.__preventElementUpdates = !1)),
                    this._isVisible || this._assignModels(),
                    this.elementsContainer.children.length ||
                      requestAnimationFrame(function () {
                        return t._resizeHandler();
                      }),
                    this._resizeHandler(),
                    ti());
                },
              },
              {
                key: "_scrollTop",
                get: function () {
                  return this.scrollTarget.scrollTop;
                },
                set: function (e) {
                  this.scrollTarget.scrollTop = e;
                },
              },
              {
                key: "items",
                get: function () {
                  return { length: Math.min(this.size, 1e5) };
                },
              },
              {
                key: "offsetHeight",
                get: function () {
                  return this.scrollTarget.offsetHeight;
                },
              },
              {
                key: "$",
                get: function () {
                  return { items: this.scrollContainer };
                },
              },
              {
                key: "updateViewportBoundaries",
                value: function () {
                  var e = window.getComputedStyle(this.scrollTarget);
                  (this._scrollerPaddingTop =
                    this.scrollTarget === this
                      ? 0
                      : parseInt(e["padding-top"], 10)),
                    (this._isRTL = Boolean("rtl" === e.direction)),
                    (this._viewportWidth = this.elementsContainer.offsetWidth),
                    (this._viewportHeight = this.scrollTarget.offsetHeight),
                    (this._scrollPageHeight =
                      this._viewportHeight - this._scrollLineHeight),
                    this.grid && this._updateGridMetrics();
                },
              },
              { key: "setAttribute", value: function () {} },
              {
                key: "_createPool",
                value: function (e) {
                  var t = this,
                    n = this.createElements(e),
                    i = document.createDocumentFragment();
                  return (
                    n.forEach(function (e) {
                      (e.style.position = "absolute"),
                        i.appendChild(e),
                        t.__resizeObserver.observe(e);
                    }),
                    this.elementsContainer.appendChild(i),
                    n
                  );
                },
              },
              {
                key: "_assignModels",
                value: function (e) {
                  var t = this,
                    n = [];
                  this._iterateItems(function (e, i) {
                    var r = t._physicalItems[e];
                    (r.hidden = i >= t.size),
                      r.hidden
                        ? delete r.__lastUpdatedIndex
                        : ((r.__virtualIndex = i + (t._vidxOffset || 0)),
                          t.__updateElement(r, r.__virtualIndex),
                          n.push(r));
                  }, e),
                    this.__afterElementsUpdated(n);
                },
              },
              {
                key: "_isClientFull",
                value: function () {
                  var t = this;
                  return (
                    setTimeout(function () {
                      t.__clientFull = !0;
                    }),
                    this.__clientFull ||
                      (0, c.Z)(
                        (0, d.Z)(e.prototype),
                        "_isClientFull",
                        this
                      ).call(this)
                  );
                },
              },
              {
                key: "translate3d",
                value: function (e, t, n, i) {
                  i.style.transform = "translateY(".concat(t, ")");
                },
              },
              { key: "toggleScrollListener", value: function () {} },
              {
                key: "_scrollHandler",
                value: function () {
                  var t = this;
                  if (0 !== this.scrollTarget.offsetHeight) {
                    this._adjustVirtualIndexOffset(
                      this._scrollTop - (this.__previousScrollTop || 0)
                    );
                    var n = this.scrollTarget.scrollTop - this._scrollPosition;
                    if (
                      ((0, c.Z)(
                        (0, d.Z)(e.prototype),
                        "_scrollHandler",
                        this
                      ).call(this),
                      0 !== this._physicalCount)
                    ) {
                      var i = n >= 0,
                        r = this._getReusables(!i);
                      r.indexes.length &&
                        ((this._physicalTop = r.physicalTop),
                        i
                          ? ((this._virtualStart -= r.indexes.length),
                            (this._physicalStart -= r.indexes.length))
                          : ((this._virtualStart += r.indexes.length),
                            (this._physicalStart += r.indexes.length)),
                        this._resizeHandler());
                    }
                    n &&
                      (this.__fixInvalidItemPositioningDebouncer = ei.debounce(
                        this.__fixInvalidItemPositioningDebouncer,
                        Kn(this.timeouts.FIX_INVALID_ITEM_POSITIONING),
                        function () {
                          return t.__fixInvalidItemPositioning();
                        }
                      )),
                      this.reorderElements &&
                        (this.__scrollReorderDebouncer = ei.debounce(
                          this.__scrollReorderDebouncer,
                          Kn(this.timeouts.SCROLL_REORDER),
                          function () {
                            return t.__reorderElements();
                          }
                        )),
                      (this.__previousScrollTop = this._scrollTop),
                      0 === this._scrollTop &&
                        0 !== this.firstVisibleIndex &&
                        Math.abs(n) > 0 &&
                        this.scrollToIndex(0);
                  }
                },
              },
              {
                key: "__fixInvalidItemPositioning",
                value: function () {
                  if (this.scrollTarget.isConnected) {
                    var e = this._physicalTop > this._scrollTop,
                      t = this._physicalBottom < this._scrollBottom,
                      n = 0 === this.adjustedFirstVisibleIndex,
                      i = this.adjustedLastVisibleIndex === this.size - 1;
                    if ((e && !n) || (t && !i)) {
                      var r = t,
                        o = this._ratio;
                      (this._ratio = 0),
                        (this._scrollPosition = this._scrollTop + (r ? -1 : 1)),
                        this._scrollHandler(),
                        (this._ratio = o);
                    }
                  }
                },
              },
              {
                key: "__onWheel",
                value: function (e) {
                  var t = this;
                  if (
                    !e.ctrlKey &&
                    !this._hasScrolledAncestor(e.target, e.deltaX, e.deltaY)
                  ) {
                    var n = e.deltaY;
                    if (
                      (e.deltaMode === WheelEvent.DOM_DELTA_LINE
                        ? (n *= this._scrollLineHeight)
                        : e.deltaMode === WheelEvent.DOM_DELTA_PAGE &&
                          (n *= this._scrollPageHeight),
                      this._deltaYAcc || (this._deltaYAcc = 0),
                      this._wheelAnimationFrame)
                    )
                      return (this._deltaYAcc += n), void e.preventDefault();
                    (n += this._deltaYAcc),
                      (this._deltaYAcc = 0),
                      (this._wheelAnimationFrame = !0),
                      (this.__debouncerWheelAnimationFrame = ei.debounce(
                        this.__debouncerWheelAnimationFrame,
                        Gn,
                        function () {
                          t._wheelAnimationFrame = !1;
                        }
                      ));
                    var i = Math.abs(e.deltaX) + Math.abs(n);
                    this._canScroll(this.scrollTarget, e.deltaX, n)
                      ? (e.preventDefault(),
                        (this.scrollTarget.scrollTop += n),
                        (this.scrollTarget.scrollLeft += e.deltaX),
                        (this._hasResidualMomentum = !0),
                        (this._ignoreNewWheel = !0),
                        (this._debouncerIgnoreNewWheel = ei.debounce(
                          this._debouncerIgnoreNewWheel,
                          Kn(this.timeouts.IGNORE_WHEEL),
                          function () {
                            t._ignoreNewWheel = !1;
                          }
                        )))
                      : (this._hasResidualMomentum &&
                          i <= this._previousMomentum) ||
                        this._ignoreNewWheel
                      ? e.preventDefault()
                      : i > this._previousMomentum &&
                        (this._hasResidualMomentum = !1),
                      (this._previousMomentum = i);
                  }
                },
              },
              {
                key: "_hasScrolledAncestor",
                value: function (e, t, n) {
                  return (
                    e !== this.scrollTarget &&
                    e !== this.scrollTarget.getRootNode().host &&
                    (!(
                      !this._canScroll(e, t, n) ||
                      -1 ===
                        ["auto", "scroll"].indexOf(getComputedStyle(e).overflow)
                    ) ||
                      (e !== this && e.parentElement
                        ? this._hasScrolledAncestor(e.parentElement, t, n)
                        : void 0))
                  );
                },
              },
              {
                key: "_canScroll",
                value: function (e, t, n) {
                  return (
                    (n > 0 && e.scrollTop < e.scrollHeight - e.offsetHeight) ||
                    (n < 0 && e.scrollTop > 0) ||
                    (t > 0 && e.scrollLeft < e.scrollWidth - e.offsetWidth) ||
                    (t < 0 && e.scrollLeft > 0)
                  );
                },
              },
              {
                key: "_increasePoolIfNeeded",
                value: function (t) {
                  if (this._physicalCount > 2 && t) {
                    var n =
                      Math.ceil(this._optPhysicalSize / this._physicalAverage) -
                      this._physicalCount;
                    (0, c.Z)(
                      (0, d.Z)(e.prototype),
                      "_increasePoolIfNeeded",
                      this
                    ).call(this, Math.max(t, Math.min(100, n)));
                  } else
                    (0, c.Z)(
                      (0, d.Z)(e.prototype),
                      "_increasePoolIfNeeded",
                      this
                    ).call(this, t);
                },
              },
              {
                key: "_getScrollLineHeight",
                value: function () {
                  var e = document.createElement("div");
                  (e.style.fontSize = "initial"),
                    (e.style.display = "none"),
                    document.body.appendChild(e);
                  var t = window.getComputedStyle(e).fontSize;
                  return (
                    document.body.removeChild(e),
                    t ? window.parseInt(t) : void 0
                  );
                },
              },
              {
                key: "__getVisibleElements",
                value: function () {
                  return Array.from(this.elementsContainer.children).filter(
                    function (e) {
                      return !e.hidden;
                    }
                  );
                },
              },
              {
                key: "__reorderElements",
                value: function () {
                  var e = this;
                  if (this.__mouseDown) this.__pendingReorder = !0;
                  else {
                    this.__pendingReorder = !1;
                    var t = this._virtualStart + (this._vidxOffset || 0),
                      n = this.__getVisibleElements(),
                      i =
                        n.find(function (t) {
                          return (
                            t.contains(
                              e.elementsContainer.getRootNode().activeElement
                            ) ||
                            t.contains(
                              e.scrollTarget.getRootNode().activeElement
                            )
                          );
                        }) || n[0];
                    if (i) {
                      var r = i.__virtualIndex - t,
                        o = n.indexOf(i) - r;
                      if (o > 0)
                        for (var a = 0; a < o; a++)
                          this.elementsContainer.appendChild(n[a]);
                      else if (o < 0)
                        for (var s = n.length + o; s < n.length; s++)
                          this.elementsContainer.insertBefore(n[s], n[0]);
                      if (un) {
                        var l = this.scrollTarget.style.transform;
                        (this.scrollTarget.style.transform = "translateZ(0)"),
                          setTimeout(function () {
                            e.scrollTarget.style.transform = l;
                          });
                      }
                    }
                  }
                },
              },
              {
                key: "_adjustVirtualIndexOffset",
                value: function (t) {
                  if (this._virtualCount >= this.size) this._vidxOffset = 0;
                  else if (this.__skipNextVirtualIndexAdjust)
                    this.__skipNextVirtualIndexAdjust = !1;
                  else if (Math.abs(t) > 1e4) {
                    var n =
                        this._scrollTop /
                        (this.scrollTarget.scrollHeight -
                          this.scrollTarget.offsetHeight),
                      i = n * this.size;
                    this._vidxOffset = Math.round(i - n * this._virtualCount);
                  } else {
                    var r = this._vidxOffset;
                    0 === this._scrollTop
                      ? ((this._vidxOffset = 0),
                        r !== this._vidxOffset &&
                          (0, c.Z)(
                            (0, d.Z)(e.prototype),
                            "scrollToIndex",
                            this
                          ).call(this, 0))
                      : this.firstVisibleIndex < 1e3 &&
                        this._vidxOffset > 0 &&
                        ((this._vidxOffset -= Math.min(this._vidxOffset, 100)),
                        (0, c.Z)(
                          (0, d.Z)(e.prototype),
                          "scrollToIndex",
                          this
                        ).call(
                          this,
                          this.firstVisibleIndex + (r - this._vidxOffset)
                        ));
                    var o = this.size - this._virtualCount;
                    this._scrollTop >= this._maxScrollTop &&
                    this._maxScrollTop > 0
                      ? ((this._vidxOffset = o),
                        r !== this._vidxOffset &&
                          (0, c.Z)(
                            (0, d.Z)(e.prototype),
                            "scrollToIndex",
                            this
                          ).call(this, this._virtualCount - 1))
                      : this.firstVisibleIndex > this._virtualCount - 1e3 &&
                        this._vidxOffset < o &&
                        ((this._vidxOffset += Math.min(
                          o - this._vidxOffset,
                          100
                        )),
                        (0, c.Z)(
                          (0, d.Z)(e.prototype),
                          "scrollToIndex",
                          this
                        ).call(
                          this,
                          this.firstVisibleIndex - (this._vidxOffset - r)
                        ));
                  }
                },
              },
            ]),
            e
          );
        })();
      Object.setPrototypeOf(ai.prototype, ri);
      var si,
        li = (function () {
          function e(t) {
            (0, r.Z)(this, e), (this.__adapter = new ai(t));
          }
          return (
            (0, o.Z)(e, [
              {
                key: "firstVisibleIndex",
                get: function () {
                  return this.__adapter.adjustedFirstVisibleIndex;
                },
              },
              {
                key: "lastVisibleIndex",
                get: function () {
                  return this.__adapter.adjustedLastVisibleIndex;
                },
              },
              {
                key: "size",
                get: function () {
                  return this.__adapter.size;
                },
                set: function (e) {
                  this.__adapter.size = e;
                },
              },
              {
                key: "scrollToIndex",
                value: function (e) {
                  this.__adapter.scrollToIndex(e);
                },
              },
              {
                key: "update",
                value: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : 0,
                    t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : this.size - 1;
                  this.__adapter.update(e, t);
                },
              },
              {
                key: "flush",
                value: function () {
                  this.__adapter.flush();
                },
              },
            ]),
            e
          );
        })(),
        ui = (function () {
          function e() {
            (0, r.Z)(this, e);
          }
          return (
            (0, o.Z)(e, [
              {
                key: "toString",
                value: function () {
                  return "";
                },
              },
            ]),
            e
          );
        })(),
        hi = (function (e) {
          function t() {
            return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
          }
          return (
            (0, s.Z)(t, e),
            (0, o.Z)(t, null, [
              {
                key: "is",
                get: function () {
                  return "vaadin-combo-box-scroller";
                },
              },
              {
                key: "template",
                get: function () {
                  return Ht(
                    si ||
                      (si = (0, i.Z)([
                        "\n      <style>\n        :host {\n          display: block;\n          min-height: 1px;\n          overflow: auto;\n\n          /* Fixes item background from getting on top of scrollbars on Safari */\n          transform: translate3d(0, 0, 0);\n\n          /* Enable momentum scrolling on iOS */\n          -webkit-overflow-scrolling: touch;\n\n          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */\n          box-shadow: 0 0 0 white;\n        }\n\n        #selector {\n          border-width: var(--_vaadin-combo-box-items-container-border-width);\n          border-style: var(--_vaadin-combo-box-items-container-border-style);\n          border-color: var(--_vaadin-combo-box-items-container-border-color, transparent);\n          position: relative;\n        }\n      </style>\n      <div id=\"selector\">\n        <slot></slot>\n      </div>\n    ",
                      ]))
                  );
                },
              },
            ]),
            t
          );
        })(
          (function (e) {
            return (function (e) {
              function t() {
                var e;
                return (
                  (0, r.Z)(this, t),
                  ((e = (0, a.Z)(this, t)).__boundOnItemClick =
                    e.__onItemClick.bind((0, Gt.Z)(e))),
                  e
                );
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "_viewportTotalPaddingBottom",
                      get: function () {
                        if (void 0 === this._cachedViewportTotalPaddingBottom) {
                          var e = window.getComputedStyle(this.$.selector);
                          this._cachedViewportTotalPaddingBottom = [
                            e.paddingBottom,
                            e.borderBottomWidth,
                          ]
                            .map(function (e) {
                              return parseInt(e, 10);
                            })
                            .reduce(function (e, t) {
                              return e + t;
                            });
                        }
                        return this._cachedViewportTotalPaddingBottom;
                      },
                    },
                    {
                      key: "ready",
                      value: function () {
                        (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(
                          this
                        ),
                          this.setAttribute("role", "listbox"),
                          (this.id = ""
                            .concat(this.localName, "-")
                            .concat(qn++)),
                          (this.__hostTagName = this.constructor.is.replace(
                            "-scroller",
                            ""
                          )),
                          this.addEventListener("click", function (e) {
                            return e.stopPropagation();
                          }),
                          this.__patchWheelOverScrolling(),
                          (this.__virtualizer = new li({
                            createElements: this.__createElements.bind(this),
                            updateElement: this._updateElement.bind(this),
                            elementsContainer: this,
                            scrollTarget: this,
                            scrollContainer: this.$.selector,
                          }));
                      },
                    },
                    {
                      key: "requestContentUpdate",
                      value: function () {
                        this.__virtualizer && this.__virtualizer.update();
                      },
                    },
                    {
                      key: "scrollIntoView",
                      value: function (e) {
                        var t = this;
                        if (this.opened && e >= 0) {
                          var n = this._visibleItemsCount(),
                            i = e;
                          e > this.__virtualizer.lastVisibleIndex - 1
                            ? (this.__virtualizer.scrollToIndex(e),
                              (i = e - n + 1))
                            : e > this.__virtualizer.firstVisibleIndex &&
                              (i = this.__virtualizer.firstVisibleIndex),
                            this.__virtualizer.scrollToIndex(Math.max(0, i));
                          var r = (0, _.Z)(this.children).find(function (e) {
                            return (
                              !e.hidden &&
                              e.index === t.__virtualizer.lastVisibleIndex
                            );
                          });
                          if (r && e === r.index) {
                            var o = r.getBoundingClientRect(),
                              a = this.getBoundingClientRect(),
                              s =
                                o.bottom -
                                a.bottom +
                                this._viewportTotalPaddingBottom;
                            s > 0 && (this.scrollTop += s);
                          }
                        }
                      },
                    },
                    {
                      key: "_isItemSelected",
                      value: function (e, t, n) {
                        return (
                          !(e instanceof ui) &&
                          (n && void 0 !== e && void 0 !== t
                            ? jn(n, e) === jn(n, t)
                            : e === t)
                        );
                      },
                    },
                    {
                      key: "__itemsChanged",
                      value: function (e) {
                        this.__virtualizer &&
                          e &&
                          ((this.__virtualizer.size = e.length),
                          this.__virtualizer.flush(),
                          this.requestContentUpdate());
                      },
                    },
                    {
                      key: "__loadingChanged",
                      value: function () {
                        this.requestContentUpdate();
                      },
                    },
                    {
                      key: "__openedChanged",
                      value: function (e) {
                        e && this.requestContentUpdate();
                      },
                    },
                    {
                      key: "__selectedItemChanged",
                      value: function () {
                        this.requestContentUpdate();
                      },
                    },
                    {
                      key: "__focusedIndexChanged",
                      value: function (e, t) {
                        e !== t && this.requestContentUpdate(),
                          e >= 0 && !this.loading && this.scrollIntoView(e);
                      },
                    },
                    {
                      key: "__rendererChanged",
                      value: function (e, t) {
                        (e || t) && this.requestContentUpdate();
                      },
                    },
                    {
                      key: "__createElements",
                      value: function (e) {
                        var t = this;
                        return (0, _.Z)(Array(e)).map(function () {
                          var e = document.createElement(
                            "".concat(t.__hostTagName, "-item")
                          );
                          return (
                            e.addEventListener("click", t.__boundOnItemClick),
                            (e.tabIndex = "-1"),
                            (e.style.width = "100%"),
                            e
                          );
                        });
                      },
                    },
                    {
                      key: "_updateElement",
                      value: function (e, t) {
                        var n = this.items[t],
                          i = this.focusedIndex,
                          r = this._isItemSelected(
                            n,
                            this.selectedItem,
                            this.itemIdPath
                          );
                        e.setProperties({
                          item: n,
                          index: t,
                          label: this.getItemLabel(n),
                          selected: r,
                          renderer: this.renderer,
                          focused: !this.loading && i === t,
                        }),
                          (e.id = ""
                            .concat(this.__hostTagName, "-item-")
                            .concat(t)),
                          e.setAttribute("role", void 0 !== t && "option"),
                          e.setAttribute("aria-selected", r.toString()),
                          e.setAttribute("aria-posinset", t + 1),
                          e.setAttribute("aria-setsize", this.items.length),
                          this.theme
                            ? e.setAttribute("theme", this.theme)
                            : e.removeAttribute("theme"),
                          n instanceof ui && this.__requestItemByIndex(t);
                      },
                    },
                    {
                      key: "__onItemClick",
                      value: function (e) {
                        this.dispatchEvent(
                          new CustomEvent("selection-changed", {
                            detail: { item: e.currentTarget.item },
                          })
                        );
                      },
                    },
                    {
                      key: "__patchWheelOverScrolling",
                      value: function () {
                        var e = this;
                        this.$.selector.addEventListener("wheel", function (t) {
                          var n = 0 === e.scrollTop,
                            i =
                              e.scrollHeight - e.scrollTop - e.clientHeight <=
                              1;
                          ((n && t.deltaY < 0) || (i && t.deltaY > 0)) &&
                            t.preventDefault();
                        });
                      },
                    },
                    {
                      key: "__requestItemByIndex",
                      value: function (e) {
                        var t = this;
                        requestAnimationFrame(function () {
                          t.dispatchEvent(
                            new CustomEvent("index-requested", {
                              detail: {
                                index: e,
                                currentScrollerPos: t._oldScrollerPosition,
                              },
                            })
                          );
                        });
                      },
                    },
                    {
                      key: "_visibleItemsCount",
                      value: function () {
                        return (
                          this.__virtualizer.scrollToIndex(
                            this.__virtualizer.firstVisibleIndex
                          ),
                          this.__virtualizer.size > 0
                            ? this.__virtualizer.lastVisibleIndex -
                              this.__virtualizer.firstVisibleIndex +
                              1
                            : 0
                        );
                      },
                    },
                  ],
                  [
                    {
                      key: "properties",
                      get: function () {
                        return {
                          items: { type: Array, observer: "__itemsChanged" },
                          focusedIndex: {
                            type: Number,
                            observer: "__focusedIndexChanged",
                          },
                          loading: {
                            type: Boolean,
                            observer: "__loadingChanged",
                          },
                          opened: {
                            type: Boolean,
                            observer: "__openedChanged",
                          },
                          selectedItem: {
                            type: Object,
                            observer: "__selectedItemChanged",
                          },
                          itemIdPath: { type: String },
                          owner: { type: Object },
                          getItemLabel: { type: Object },
                          renderer: {
                            type: Object,
                            observer: "__rendererChanged",
                          },
                          theme: { type: String },
                        };
                      },
                    },
                  ]
                ),
                t
              );
            })(e);
          })(jt)
        );
      u(hi);
      var ci = W(function (e) {
          return (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "validate",
                    value: function () {
                      var e = this.checkValidity();
                      return (
                        this._setInvalid(!e),
                        this.dispatchEvent(
                          new CustomEvent("validated", { detail: { valid: e } })
                        ),
                        e
                      );
                    },
                  },
                  {
                    key: "checkValidity",
                    value: function () {
                      return !this.required || !!this.value;
                    },
                  },
                  {
                    key: "_setInvalid",
                    value: function (e) {
                      this._shouldSetInvalid(e) && (this.invalid = e);
                    },
                  },
                  {
                    key: "_shouldSetInvalid",
                    value: function (e) {
                      return !0;
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        invalid: {
                          type: Boolean,
                          reflectToAttribute: !0,
                          notify: !0,
                          value: !1,
                        },
                        required: { type: Boolean, reflectToAttribute: !0 },
                      };
                    },
                  },
                ]
              ),
              t
            );
          })(e);
        }),
        di = n(62746),
        _i =
          (n(82073),
          n(86439),
          W(function (e) {
            return (function (e) {
              function t() {
                return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "_disabledChanged",
                      value: function (e) {
                        this._setAriaDisabled(e);
                      },
                    },
                    {
                      key: "_setAriaDisabled",
                      value: function (e) {
                        e
                          ? this.setAttribute("aria-disabled", "true")
                          : this.removeAttribute("aria-disabled");
                      },
                    },
                    {
                      key: "click",
                      value: function () {
                        this.disabled ||
                          (0, c.Z)((0, d.Z)(t.prototype), "click", this).call(
                            this
                          );
                      },
                    },
                  ],
                  [
                    {
                      key: "properties",
                      get: function () {
                        return {
                          disabled: {
                            type: Boolean,
                            value: !1,
                            observer: "_disabledChanged",
                            reflectToAttribute: !0,
                          },
                        };
                      },
                    },
                  ]
                ),
                t
              );
            })(e);
          })),
        pi = W(function (e) {
          return (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(t, [
                {
                  key: "_keyboardActive",
                  get: function () {
                    return bn;
                  },
                },
                {
                  key: "ready",
                  value: function () {
                    var e = this;
                    this.addEventListener("focusin", function (t) {
                      e._shouldSetFocus(t) && e._setFocused(!0);
                    }),
                      this.addEventListener("focusout", function (t) {
                        e._shouldRemoveFocus(t) && e._setFocused(!1);
                      }),
                      (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(this);
                  },
                },
                {
                  key: "disconnectedCallback",
                  value: function () {
                    (0, c.Z)(
                      (0, d.Z)(t.prototype),
                      "disconnectedCallback",
                      this
                    ).call(this),
                      this.hasAttribute("focused") && this._setFocused(!1);
                  },
                },
                {
                  key: "_setFocused",
                  value: function (e) {
                    this.toggleAttribute("focused", e),
                      this.toggleAttribute(
                        "focus-ring",
                        e && this._keyboardActive
                      );
                  },
                },
                {
                  key: "_shouldSetFocus",
                  value: function (e) {
                    return !0;
                  },
                },
                {
                  key: "_shouldRemoveFocus",
                  value: function (e) {
                    return !0;
                  },
                },
              ]),
              t
            );
          })(e);
        }),
        fi = W(function (e) {
          return (function (e) {
            function t() {
              return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(t, [
                {
                  key: "ready",
                  value: function () {
                    var e = this;
                    (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(this),
                      this.addEventListener("keydown", function (t) {
                        e._onKeyDown(t);
                      }),
                      this.addEventListener("keyup", function (t) {
                        e._onKeyUp(t);
                      });
                  },
                },
                {
                  key: "_onKeyDown",
                  value: function (e) {
                    switch (e.key) {
                      case "Enter":
                        this._onEnter(e);
                        break;
                      case "Escape":
                        this._onEscape(e);
                    }
                  },
                },
                { key: "_onKeyUp", value: function (e) {} },
                { key: "_onEnter", value: function (e) {} },
                { key: "_onEscape", value: function (e) {} },
              ]),
              t
            );
          })(e);
        });
      var vi = W(function (e) {
          return (function (e) {
            function t() {
              var e;
              return (
                (0, r.Z)(this, t),
                ((e = (0, a.Z)(this, t))._boundOnInput = e.__onInput.bind(
                  (0, Gt.Z)(e)
                )),
                (e._boundOnChange = e._onChange.bind((0, Gt.Z)(e))),
                e
              );
            }
            return (
              (0, s.Z)(t, e),
              (0, o.Z)(
                t,
                [
                  {
                    key: "_hasValue",
                    get: function () {
                      return null != this.value && "" !== this.value;
                    },
                  },
                  {
                    key: "_inputElementValueProperty",
                    get: function () {
                      return "value";
                    },
                  },
                  {
                    key: "_inputElementValue",
                    get: function () {
                      return this.inputElement
                        ? this.inputElement[this._inputElementValueProperty]
                        : void 0;
                    },
                    set: function (e) {
                      this.inputElement &&
                        (this.inputElement[this._inputElementValueProperty] =
                          e);
                    },
                  },
                  {
                    key: "clear",
                    value: function () {
                      (this._hasInputValue = !1),
                        (this.value = ""),
                        (this._inputElementValue = "");
                    },
                  },
                  {
                    key: "_addInputListeners",
                    value: function (e) {
                      e.addEventListener("input", this._boundOnInput),
                        e.addEventListener("change", this._boundOnChange);
                    },
                  },
                  {
                    key: "_removeInputListeners",
                    value: function (e) {
                      e.removeEventListener("input", this._boundOnInput),
                        e.removeEventListener("change", this._boundOnChange);
                    },
                  },
                  {
                    key: "_forwardInputValue",
                    value: function (e) {
                      this.inputElement &&
                        (this._inputElementValue = null != e ? e : "");
                    },
                  },
                  {
                    key: "_inputElementChanged",
                    value: function (e, t) {
                      e
                        ? this._addInputListeners(e)
                        : t && this._removeInputListeners(t);
                    },
                  },
                  {
                    key: "_hasInputValueChanged",
                    value: function (e, t) {
                      (e || t) &&
                        this.dispatchEvent(
                          new CustomEvent("has-input-value-changed")
                        );
                    },
                  },
                  {
                    key: "__onInput",
                    value: function (e) {
                      this._setHasInputValue(e), this._onInput(e);
                    },
                  },
                  {
                    key: "_onInput",
                    value: function (e) {
                      var t = e.composedPath()[0];
                      (this.__userInput = e.isTrusted),
                        (this.value = t.value),
                        (this.__userInput = !1);
                    },
                  },
                  { key: "_onChange", value: function (e) {} },
                  {
                    key: "_toggleHasValue",
                    value: function (e) {
                      this.toggleAttribute("has-value", e);
                    },
                  },
                  {
                    key: "_valueChanged",
                    value: function (e, t) {
                      this._toggleHasValue(this._hasValue),
                        ("" === e && void 0 === t) ||
                          this.__userInput ||
                          this._forwardInputValue(e);
                    },
                  },
                  {
                    key: "_setHasInputValue",
                    value: function (e) {
                      var t = e.composedPath()[0];
                      this._hasInputValue = t.value.length > 0;
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
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
                    },
                  },
                ]
              ),
              t
            );
          })(e);
        }),
        yi = (function () {
          function e(t) {
            var n = this;
            (0, r.Z)(this, e),
              (this.host = t),
              t.addEventListener("opened-changed", function () {
                t.opened || n.__setVirtualKeyboardEnabled(!1);
              }),
              t.addEventListener("blur", function () {
                return n.__setVirtualKeyboardEnabled(!0);
              }),
              t.addEventListener("touchstart", function () {
                return n.__setVirtualKeyboardEnabled(!0);
              });
          }
          return (
            (0, o.Z)(e, [
              {
                key: "__setVirtualKeyboardEnabled",
                value: function (e) {
                  this.host.inputElement &&
                    (this.host.inputElement.inputMode = e ? "" : "none");
                },
              },
            ]),
            e
          );
        })();
      function mi(e) {
        return null != e;
      }
      function gi(e, t) {
        return e.findIndex(function (e) {
          return !(e instanceof ui) && t(e);
        });
      }
      var bi,
        ki,
        Ci = (function (e) {
          function t() {
            return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
          }
          return (
            (0, s.Z)(t, e),
            (0, o.Z)(
              t,
              [
                {
                  key: "clearElement",
                  get: function () {
                    return this.querySelector(".clear-button");
                  },
                },
                {
                  key: "_inputElementValueProperty",
                  get: function () {
                    return Pe(this.attrForValue);
                  },
                },
                {
                  key: "_nativeInput",
                  get: function () {
                    var e = this.inputElement;
                    if (e) {
                      if (e instanceof HTMLInputElement) return e;
                      var t = e.querySelector("input");
                      if (t) return t;
                      if (e.shadowRoot) {
                        var n = e.shadowRoot.querySelector("input");
                        if (n) return n;
                      }
                    }
                  },
                },
                {
                  key: "ready",
                  value: function () {
                    var e = this;
                    (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(this),
                      (this._toggleElement =
                        this.querySelector(".toggle-button")),
                      rn(this, function () {
                        e._setInputElement(
                          e.querySelector("vaadin-text-field,.input")
                        ),
                          e._revertInputValue();
                      });
                  },
                },
                {
                  key: "checkValidity",
                  value: function () {
                    return this.inputElement && this.inputElement.validate
                      ? this.inputElement.validate()
                      : (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "checkValidity",
                          this
                        ).call(this);
                  },
                },
                {
                  key: "_isClearButton",
                  value: function (e) {
                    return (
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "_isClearButton",
                        this
                      ).call(this, e) ||
                      ("input" === e.type && !e.isTrusted) ||
                      "clear-button" ===
                        e.composedPath()[0].getAttribute("part")
                    );
                  },
                },
                {
                  key: "_shouldRemoveFocus",
                  value: function (e) {
                    var n =
                        e.target === this._toggleElement ||
                        e.target === this.clearElement,
                      i =
                        e.relatedTarget &&
                        e.relatedTarget === this._nativeInput;
                    return (
                      (!n || !i) &&
                      (0, c.Z)(
                        (0, d.Z)(t.prototype),
                        "_shouldRemoveFocus",
                        this
                      ).call(this, e)
                    );
                  },
                },
              ],
              [
                {
                  key: "is",
                  get: function () {
                    return "vaadin-combo-box-light";
                  },
                },
                {
                  key: "template",
                  get: function () {
                    return Ht(
                      bi ||
                        (bi = (0, i.Z)([
                          '\n      <style>\n        :host([opened]) {\n          pointer-events: auto;\n        }\n      </style>\n\n      <slot></slot>\n\n      <vaadin-combo-box-overlay\n        id="overlay"\n        opened="[[_overlayOpened]]"\n        loading$="[[loading]]"\n        theme$="[[_theme]]"\n        position-target="[[inputElement]]"\n        no-vertical-overlap\n        restore-focus-node="[[inputElement]]"\n      ></vaadin-combo-box-overlay>\n    ',
                        ]))
                    );
                  },
                },
                {
                  key: "properties",
                  get: function () {
                    return { attrForValue: { type: String, value: "value" } };
                  },
                },
              ]
            ),
            t
          );
        })(
          (function (e) {
            return (function (e) {
              function t() {
                return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "ready",
                      value: function () {
                        var e = this;
                        (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(
                          this
                        ),
                          this._scroller.addEventListener(
                            "index-requested",
                            function (t) {
                              var n = t.detail.index,
                                i = t.detail.currentScrollerPos,
                                r = Math.floor(1.5 * e.pageSize);
                              if (
                                !e._shouldSkipIndex(n, r, i) &&
                                void 0 !== n
                              ) {
                                var o = e._getPageForIndex(n);
                                e._shouldLoadPage(o) && e._loadPage(o);
                              }
                            }
                          );
                      },
                    },
                    {
                      key: "_dataProviderFilterChanged",
                      value: function (e) {
                        void 0 !== this.__previousDataProviderFilter || "" !== e
                          ? this.__previousDataProviderFilter !== e &&
                            ((this.__previousDataProviderFilter = e),
                            (this._pendingRequests = {}),
                            (this.loading = this._shouldFetchData()),
                            (this.size = void 0),
                            this.clearCache())
                          : (this.__previousDataProviderFilter = e);
                      },
                    },
                    {
                      key: "_shouldFetchData",
                      value: function () {
                        return (
                          !!this.dataProvider &&
                          (this.opened || (this.filter && this.filter.length))
                        );
                      },
                    },
                    {
                      key: "_ensureFirstPage",
                      value: function (e) {
                        e && this._shouldLoadPage(0) && this._loadPage(0);
                      },
                    },
                    {
                      key: "_shouldSkipIndex",
                      value: function (e, t, n) {
                        return 0 !== n && e >= n - t && e <= n + t;
                      },
                    },
                    {
                      key: "_shouldLoadPage",
                      value: function (e) {
                        if (!this.filteredItems || this._forceNextRequest)
                          return (this._forceNextRequest = !1), !0;
                        var t = this.filteredItems[e * this.pageSize];
                        return void 0 !== t
                          ? t instanceof ui
                          : void 0 === this.size;
                      },
                    },
                    {
                      key: "_loadPage",
                      value: function (e) {
                        var t = this;
                        if (!this._pendingRequests[e] && this.dataProvider) {
                          var n = {
                              page: e,
                              pageSize: this.pageSize,
                              filter: this.filter,
                            },
                            i = function i(r, o) {
                              if (t._pendingRequests[e] === i) {
                                var a = t.filteredItems
                                  ? (0, _.Z)(t.filteredItems)
                                  : [];
                                a.splice.apply(
                                  a,
                                  [n.page * n.pageSize, r.length].concat(
                                    (0, _.Z)(r)
                                  )
                                ),
                                  (t.filteredItems = a),
                                  t.opened ||
                                    t._isInputFocused() ||
                                    t._commitValue(),
                                  void 0 !== o && (t.size = o),
                                  delete t._pendingRequests[e],
                                  0 ===
                                    Object.keys(t._pendingRequests).length &&
                                    (t.loading = !1);
                              }
                            };
                          (this._pendingRequests[e] = i),
                            (this.loading = !0),
                            this.dataProvider(n, i);
                        }
                      },
                    },
                    {
                      key: "_getPageForIndex",
                      value: function (e) {
                        return Math.floor(e / this.pageSize);
                      },
                    },
                    {
                      key: "clearCache",
                      value: function () {
                        if (this.dataProvider) {
                          this._pendingRequests = {};
                          for (var e = [], t = 0; t < (this.size || 0); t++)
                            e.push(this.__placeHolder);
                          (this.filteredItems = e),
                            this._shouldFetchData()
                              ? ((this._forceNextRequest = !1),
                                this._loadPage(0))
                              : (this._forceNextRequest = !0);
                        }
                      },
                    },
                    {
                      key: "_sizeChanged",
                      value: function () {
                        for (
                          var e =
                              arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : 0,
                            t = (this.filteredItems || []).slice(0, e),
                            n = 0;
                          n < e;
                          n++
                        )
                          t[n] = void 0 !== t[n] ? t[n] : this.__placeHolder;
                        (this.filteredItems = t), this._flushPendingRequests(e);
                      },
                    },
                    {
                      key: "_pageSizeChanged",
                      value: function (e, t) {
                        if (Math.floor(e) !== e || e < 1)
                          throw (
                            ((this.pageSize = t),
                            new Error(
                              "`pageSize` value must be an integer > 0"
                            ))
                          );
                        this.clearCache();
                      },
                    },
                    {
                      key: "_dataProviderChanged",
                      value: function (e, t) {
                        var n = this;
                        this._ensureItemsOrDataProvider(function () {
                          n.dataProvider = t;
                        }),
                          this.clearCache();
                      },
                    },
                    {
                      key: "_ensureItemsOrDataProvider",
                      value: function (e) {
                        if (
                          void 0 !== this.items &&
                          void 0 !== this.dataProvider
                        )
                          throw (
                            (e(),
                            new Error(
                              "Using `items` and `dataProvider` together is not supported"
                            ))
                          );
                        this.dataProvider &&
                          !this.filteredItems &&
                          (this.filteredItems = []);
                      },
                    },
                    {
                      key: "_warnDataProviderValue",
                      value: function (e, t) {
                        if (
                          e &&
                          "" !== t &&
                          (void 0 === this.selectedItem ||
                            null === this.selectedItem)
                        ) {
                          var n = this.__getItemIndexByValue(
                            this.filteredItems,
                            t
                          );
                          (n < 0 ||
                            !this._getItemLabel(this.filteredItems[n])) &&
                            console.warn(
                              "Warning: unable to determine the label for the provided `value`. Nothing to display in the text field. This usually happens when setting an initial `value` before any items are returned from the `dataProvider` callback. Consider setting `selectedItem` instead of `value`"
                            );
                        }
                      },
                    },
                    {
                      key: "_flushPendingRequests",
                      value: function (e) {
                        if (this._pendingRequests) {
                          var t = Math.ceil(e / this.pageSize);
                          Object.entries(this._pendingRequests).forEach(
                            function (n) {
                              var i = (0, di.Z)(n, 2),
                                r = i[0],
                                o = i[1];
                              parseInt(r) >= t && o([], e);
                            }
                          );
                        }
                      },
                    },
                  ],
                  [
                    {
                      key: "properties",
                      get: function () {
                        return {
                          pageSize: {
                            type: Number,
                            value: 50,
                            observer: "_pageSizeChanged",
                          },
                          size: { type: Number, observer: "_sizeChanged" },
                          dataProvider: {
                            type: Object,
                            observer: "_dataProviderChanged",
                          },
                          _pendingRequests: {
                            value: function () {
                              return {};
                            },
                          },
                          __placeHolder: { value: new ui() },
                          __previousDataProviderFilter: { type: String },
                        };
                      },
                    },
                    {
                      key: "observers",
                      get: function () {
                        return [
                          "_dataProviderFilterChanged(filter)",
                          "_warnDataProviderValue(dataProvider, value)",
                          "_ensureFirstPage(opened)",
                        ];
                      },
                    },
                  ]
                ),
                t
              );
            })(e);
          })(
            ((ki = ci(L(jt))),
            (function (e) {
              function t() {
                var e;
                return (
                  (0, r.Z)(this, t),
                  ((e = (0, a.Z)(this, t))._boundOverlaySelectedItemChanged =
                    e._overlaySelectedItemChanged.bind((0, Gt.Z)(e))),
                  (e._boundOnClearButtonMouseDown =
                    e.__onClearButtonMouseDown.bind((0, Gt.Z)(e))),
                  (e._boundOnClick = e._onClick.bind((0, Gt.Z)(e))),
                  (e._boundOnOverlayTouchAction = e._onOverlayTouchAction.bind(
                    (0, Gt.Z)(e)
                  )),
                  (e._boundOnTouchend = e._onTouchend.bind((0, Gt.Z)(e))),
                  e
                );
              }
              return (
                (0, s.Z)(t, e),
                (0, o.Z)(
                  t,
                  [
                    {
                      key: "_tagNamePrefix",
                      get: function () {
                        return "vaadin-combo-box";
                      },
                    },
                    {
                      key: "_nativeInput",
                      get: function () {
                        return this.inputElement;
                      },
                    },
                    {
                      key: "_inputElementChanged",
                      value: function (e) {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_inputElementChanged",
                          this
                        ).call(this, e);
                        var n = this._nativeInput;
                        n &&
                          ((n.autocomplete = "off"),
                          (n.autocapitalize = "off"),
                          n.setAttribute("role", "combobox"),
                          n.setAttribute("aria-autocomplete", "list"),
                          n.setAttribute("aria-expanded", !!this.opened),
                          n.setAttribute("spellcheck", "false"),
                          n.setAttribute("autocorrect", "off"),
                          this._revertInputValueToValue(),
                          this.clearElement &&
                            this.clearElement.addEventListener(
                              "mousedown",
                              this._boundOnClearButtonMouseDown
                            ));
                      },
                    },
                    {
                      key: "ready",
                      value: function () {
                        var e = this;
                        (0, c.Z)((0, d.Z)(t.prototype), "ready", this).call(
                          this
                        ),
                          this._initOverlay(),
                          this._initScroller(),
                          (this._lastCommittedValue = this.value),
                          this.addEventListener("click", this._boundOnClick),
                          this.addEventListener(
                            "touchend",
                            this._boundOnTouchend
                          );
                        var n,
                          i = function () {
                            requestAnimationFrame(function () {
                              e._overlayElement.bringToFront();
                            });
                          };
                        this.addEventListener("mousedown", i),
                          this.addEventListener("touchstart", i),
                          (n = this),
                          window.Vaadin &&
                          window.Vaadin.templateRendererCallback
                            ? window.Vaadin.templateRendererCallback(n)
                            : n.querySelector("template") &&
                              console.warn(
                                "WARNING: <template> inside <".concat(
                                  n.localName,
                                  "> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility."
                                )
                              ),
                          this.addController(new yi(this));
                      },
                    },
                    {
                      key: "disconnectedCallback",
                      value: function () {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "disconnectedCallback",
                          this
                        ).call(this),
                          this.close();
                      },
                    },
                    {
                      key: "requestContentUpdate",
                      value: function () {
                        this._scroller &&
                          (this._scroller.requestContentUpdate(),
                          this._getItemElements().forEach(function (e) {
                            e.requestContentUpdate();
                          }));
                      },
                    },
                    {
                      key: "open",
                      value: function () {
                        this.disabled || this.readonly || (this.opened = !0);
                      },
                    },
                    {
                      key: "close",
                      value: function () {
                        this.opened = !1;
                      },
                    },
                    {
                      key: "_propertiesChanged",
                      value: function (e, n, i) {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_propertiesChanged",
                          this
                        ).call(this, e, n, i),
                          void 0 !== n.filter && this._filterChanged(n.filter);
                      },
                    },
                    {
                      key: "_initOverlay",
                      value: function () {
                        var e = this,
                          t = this.$.overlay;
                        (t._comboBox = this),
                          t.addEventListener(
                            "touchend",
                            this._boundOnOverlayTouchAction
                          ),
                          t.addEventListener(
                            "touchmove",
                            this._boundOnOverlayTouchAction
                          ),
                          t.addEventListener("mousedown", function (e) {
                            return e.preventDefault();
                          }),
                          t.addEventListener("opened-changed", function (t) {
                            e._overlayOpened = t.detail.value;
                          }),
                          (this._overlayElement = t);
                      },
                    },
                    {
                      key: "_initScroller",
                      value: function (e) {
                        var t = "".concat(this._tagNamePrefix, "-scroller"),
                          n = this._overlayElement;
                        (n.renderer = function (e) {
                          e.firstChild ||
                            e.appendChild(document.createElement(t));
                        }),
                          n.requestContentUpdate();
                        var i = n.querySelector(t);
                        (i.owner = e || this),
                          (i.getItemLabel = this._getItemLabel.bind(this)),
                          i.addEventListener(
                            "selection-changed",
                            this._boundOverlaySelectedItemChanged
                          ),
                          (this._scroller = i);
                      },
                    },
                    {
                      key: "_updateScroller",
                      value: function (e, t, n, i, r, o, a, s, l) {
                        e &&
                          (n &&
                            (e.style.maxHeight =
                              getComputedStyle(this).getPropertyValue(
                                "--".concat(
                                  this._tagNamePrefix,
                                  "-overlay-max-height"
                                )
                              ) || "65vh"),
                          e.setProperties({
                            items: n ? t : [],
                            opened: n,
                            loading: i,
                            selectedItem: r,
                            itemIdPath: o,
                            focusedIndex: a,
                            renderer: s,
                            theme: l,
                          }));
                      },
                    },
                    {
                      key: "_openedOrItemsChanged",
                      value: function (e, t, n) {
                        this._overlayOpened = !(!e || !(n || (t && t.length)));
                      },
                    },
                    {
                      key: "_overlayOpenedChanged",
                      value: function (e, t) {
                        e
                          ? (this.dispatchEvent(
                              new CustomEvent(
                                "vaadin-combo-box-dropdown-opened",
                                { bubbles: !0, composed: !0 }
                              )
                            ),
                            this._onOpened())
                          : t &&
                            this._dropdownItems &&
                            this._dropdownItems.length &&
                            (this.close(),
                            this.dispatchEvent(
                              new CustomEvent(
                                "vaadin-combo-box-dropdown-closed",
                                { bubbles: !0, composed: !0 }
                              )
                            ));
                      },
                    },
                    {
                      key: "_focusedIndexChanged",
                      value: function (e, t) {
                        void 0 !== t && this._updateActiveDescendant(e);
                      },
                    },
                    {
                      key: "_isInputFocused",
                      value: function () {
                        return this.inputElement && wn(this.inputElement);
                      },
                    },
                    {
                      key: "_updateActiveDescendant",
                      value: function (e) {
                        var t = this._nativeInput;
                        if (t) {
                          var n = this._getItemElements().find(function (t) {
                            return t.index === e;
                          });
                          n
                            ? t.setAttribute("aria-activedescendant", n.id)
                            : t.removeAttribute("aria-activedescendant");
                        }
                      },
                    },
                    {
                      key: "_openedChanged",
                      value: function (e, t) {
                        if (void 0 !== t) {
                          e
                            ? ((this._openedWithFocusRing =
                                this.hasAttribute("focus-ring")),
                              this._isInputFocused() ||
                                hn ||
                                (this.inputElement &&
                                  this.inputElement.focus()),
                              (this._overlayElement.restoreFocusOnClose = !0))
                            : (this._onClosed(),
                              this._openedWithFocusRing &&
                                this._isInputFocused() &&
                                this.setAttribute("focus-ring", ""));
                          var n = this._nativeInput;
                          n &&
                            (n.setAttribute("aria-expanded", !!e),
                            e
                              ? n.setAttribute(
                                  "aria-controls",
                                  this._scroller.id
                                )
                              : n.removeAttribute("aria-controls"));
                        }
                      },
                    },
                    {
                      key: "_onOverlayTouchAction",
                      value: function () {
                        (this._closeOnBlurIsPrevented = !0),
                          this.inputElement.blur(),
                          (this._closeOnBlurIsPrevented = !1);
                      },
                    },
                    {
                      key: "_isClearButton",
                      value: function (e) {
                        return e.composedPath()[0] === this.clearElement;
                      },
                    },
                    {
                      key: "__onClearButtonMouseDown",
                      value: function (e) {
                        e.preventDefault(), this.inputElement.focus();
                      },
                    },
                    {
                      key: "_onClearButtonClick",
                      value: function (e) {
                        e.preventDefault(),
                          this._onClearAction(),
                          this.opened && this.requestContentUpdate();
                      },
                    },
                    {
                      key: "_onToggleButtonClick",
                      value: function (e) {
                        e.preventDefault(),
                          this.opened ? this.close() : this.open();
                      },
                    },
                    {
                      key: "_onHostClick",
                      value: function (e) {
                        this.autoOpenDisabled ||
                          (e.preventDefault(), this.open());
                      },
                    },
                    {
                      key: "_onClick",
                      value: function (e) {
                        this._isClearButton(e)
                          ? this._onClearButtonClick(e)
                          : e.composedPath().includes(this._toggleElement)
                          ? this._onToggleButtonClick(e)
                          : this._onHostClick(e);
                      },
                    },
                    {
                      key: "_onKeyDown",
                      value: function (e) {
                        (0, c.Z)(
                          (0, d.Z)(t.prototype),
                          "_onKeyDown",
                          this
                        ).call(this, e),
                          "Tab" === e.key
                            ? (this._overlayElement.restoreFocusOnClose = !1)
                            : "ArrowDown" === e.key
                            ? (this._onArrowDown(), e.preventDefault())
                            : "ArrowUp" === e.key &&
                              (this._onArrowUp(), e.preventDefault());
                      },
                    },
                    {
                      key: "_getItemLabel",
                      value: function (e) {
                        var t =
                          e && this.itemLabelPath
                            ? jn(this.itemLabelPath, e)
                            : void 0;
                        return null == t && (t = e ? e.toString() : ""), t;
                      },
                    },
                    {
                      key: "_getItemValue",
                      value: function (e) {
                        var t =
                          e && this.itemValuePath
                            ? jn(this.itemValuePath, e)
                            : void 0;
                        return void 0 === t && (t = e ? e.toString() : ""), t;
                      },
                    },
                    {
                      key: "_onArrowDown",
                      value: function () {
                        if (this.opened) {
                          var e = this._dropdownItems;
                          e &&
                            ((this._focusedIndex = Math.min(
                              e.length - 1,
                              this._focusedIndex + 1
                            )),
                            this._prefillFocusedItemLabel());
                        } else this.open();
                      },
                    },
                    {
                      key: "_onArrowUp",
                      value: function () {
                        if (this.opened) {
                          if (this._focusedIndex > -1)
                            this._focusedIndex = Math.max(
                              0,
                              this._focusedIndex - 1
                            );
                          else {
                            var e = this._dropdownItems;
                            e && (this._focusedIndex = e.length - 1);
                          }
                          this._prefillFocusedItemLabel();
                        } else this.open();
                      },
                    },
                    {
                      key: "_prefillFocusedItemLabel",
                      value: function () {
                        if (this._focusedIndex > -1) {
                          var e = this._dropdownItems[this._focusedIndex];
                          (this._inputElementValue = this._getItemLabel(e)),
                            this._markAllSelectionRange();
                        }
                      },
                    },
                    {
                      key: "_setSelectionRange",
                      value: function (e, t) {
                        this._isInputFocused() &&
                          this.inputElement.setSelectionRange &&
                          this.inputElement.setSelectionRange(e, t);
                      },
                    },
                    {
                      key: "_markAllSelectionRange",
                      value: function () {
                        void 0 !== this._inputElementValue &&
                          this._setSelectionRange(
                            0,
                            this._inputElementValue.length
                          );
                      },
                    },
                    {
                      key: "_clearSelectionRange",
                      value: function () {
                        if (void 0 !== this._inputElementValue) {
                          var e = this._inputElementValue
                            ? this._inputElementValue.length
                            : 0;
                          this._setSelectionRange(e, e);
                        }
                      },
                    },
                    {
                      key: "_closeOrCommit",
                      value: function () {
                        this.opened || this.loading
                          ? this.close()
                          : this._commitValue();
                      },
                    },
                    {
                      key: "_onEnter",
                      value: function (e) {
                        var t =
                          this._focusedIndex < 0 &&
                          "" !== this._inputElementValue &&
                          this._getItemLabel(this.selectedItem) !==
                            this._inputElementValue;
                        if (!this.allowCustomValue && t)
                          return e.preventDefault(), void e.stopPropagation();
                        this.opened &&
                          (e.preventDefault(), e.stopPropagation()),
                          this._closeOrCommit();
                      },
                    },
                    {
                      key: "_onEscape",
                      value: function (e) {
                        this.autoOpenDisabled
                          ? this.opened ||
                            (this.value !== this._inputElementValue &&
                              this._inputElementValue.length > 0)
                            ? (e.stopPropagation(),
                              (this._focusedIndex = -1),
                              this.cancel())
                            : this.clearButtonVisible &&
                              !this.opened &&
                              this.value &&
                              (e.stopPropagation(), this._onClearAction())
                          : this.opened
                          ? (e.stopPropagation(),
                            this._focusedIndex > -1
                              ? ((this._focusedIndex = -1),
                                this._revertInputValue())
                              : this.cancel())
                          : this.clearButtonVisible &&
                            this.value &&
                            (e.stopPropagation(), this._onClearAction());
                      },
                    },
                    {
                      key: "_toggleElementChanged",
                      value: function (e) {
                        var t = this;
                        e &&
                          (e.addEventListener("mousedown", function (e) {
                            return e.preventDefault();
                          }),
                          e.addEventListener("click", function () {
                            hn &&
                              !t._isInputFocused() &&
                              document.activeElement.blur();
                          }));
                      },
                    },
                    {
                      key: "_onClearAction",
                      value: function () {
                        (this.selectedItem = null),
                          this.allowCustomValue && (this.value = ""),
                          this._detectAndDispatchChange();
                      },
                    },
                    {
                      key: "cancel",
                      value: function () {
                        this._revertInputValueToValue(),
                          (this._lastCommittedValue = this.value),
                          this._closeOrCommit();
                      },
                    },
                    {
                      key: "_onOpened",
                      value: function () {
                        this._lastCommittedValue = this.value;
                      },
                    },
                    {
                      key: "_onClosed",
                      value: function () {
                        (this.loading && !this.allowCustomValue) ||
                          this._commitValue();
                      },
                    },
                    {
                      key: "_commitValue",
                      value: function () {
                        if (this._focusedIndex > -1) {
                          var e = this._dropdownItems[this._focusedIndex];
                          this.selectedItem !== e && (this.selectedItem = e),
                            (this._inputElementValue = this._getItemLabel(
                              this.selectedItem
                            )),
                            (this._focusedIndex = -1);
                        } else if (
                          "" === this._inputElementValue ||
                          void 0 === this._inputElementValue
                        )
                          (this.selectedItem = null),
                            this.allowCustomValue && (this.value = "");
                        else {
                          var t = [this.selectedItem].concat(
                              (0, _.Z)(this._dropdownItems || [])
                            ),
                            n =
                              t[
                                this.__getItemIndexByLabel(
                                  t,
                                  this._inputElementValue
                                )
                              ];
                          if (this.allowCustomValue && !n) {
                            var i = this._inputElementValue;
                            this._lastCustomValue = i;
                            var r = new CustomEvent("custom-value-set", {
                              detail: i,
                              composed: !0,
                              cancelable: !0,
                              bubbles: !0,
                            });
                            this.dispatchEvent(r),
                              r.defaultPrevented || (this.value = i);
                          } else
                            this.allowCustomValue || this.opened || !n
                              ? (this._inputElementValue = this.selectedItem
                                  ? this._getItemLabel(this.selectedItem)
                                  : this.value || "")
                              : (this.value = this._getItemValue(n));
                        }
                        this._detectAndDispatchChange(),
                          this._clearSelectionRange(),
                          (this.filter = "");
                      },
                    },
                    {
                      key: "_onInput",
                      value: function (e) {
                        var t = this._inputElementValue,
                          n = {};
                        this.filter === t
                          ? this._filterChanged(this.filter)
                          : (n.filter = t),
                          this.opened ||
                            this._isClearButton(e) ||
                            this.autoOpenDisabled ||
                            (n.opened = !0),
                          this.setProperties(n);
                      },
                    },
                    {
                      key: "_onChange",
                      value: function (e) {
                        e.stopPropagation();
                      },
                    },
                    {
                      key: "_itemLabelPathChanged",
                      value: function (e) {
                        "string" != typeof e &&
                          console.error(
                            "You should set itemLabelPath to a valid string"
                          );
                      },
                    },
                    {
                      key: "_filterChanged",
                      value: function (e) {
                        this._scrollIntoView(0),
                          (this._focusedIndex = -1),
                          this.items
                            ? (this.filteredItems = this._filterItems(
                                this.items,
                                e
                              ))
                            : this._filteredItemsChanged(this.filteredItems);
                      },
                    },
                    {
                      key: "_revertInputValue",
                      value: function () {
                        "" !== this.filter
                          ? (this._inputElementValue = this.filter)
                          : this._revertInputValueToValue(),
                          this._clearSelectionRange();
                      },
                    },
                    {
                      key: "_revertInputValueToValue",
                      value: function () {
                        this.allowCustomValue && !this.selectedItem
                          ? (this._inputElementValue = this.value)
                          : (this._inputElementValue = this._getItemLabel(
                              this.selectedItem
                            ));
                      },
                    },
                    {
                      key: "_selectedItemChanged",
                      value: function (e) {
                        if (null == e)
                          this.filteredItems &&
                            (this.allowCustomValue || (this.value = ""),
                            this._toggleHasValue(this._hasValue),
                            (this._inputElementValue = this.value));
                        else {
                          var t = this._getItemValue(e);
                          if (
                            this.value !== t &&
                            ((this.value = t), this.value !== t)
                          )
                            return;
                          this._toggleHasValue(!0),
                            (this._inputElementValue = this._getItemLabel(e));
                        }
                      },
                    },
                    {
                      key: "_valueChanged",
                      value: function (e, t) {
                        ("" === e && void 0 === t) ||
                          (mi(e)
                            ? (this._getItemValue(this.selectedItem) !== e &&
                                this._selectItemForValue(e),
                              !this.selectedItem &&
                                this.allowCustomValue &&
                                (this._inputElementValue = e),
                              this._toggleHasValue(this._hasValue))
                            : (this.selectedItem = null),
                          (this.filter = ""),
                          (this._lastCommittedValue = void 0));
                      },
                    },
                    {
                      key: "_detectAndDispatchChange",
                      value: function () {
                        document.hasFocus() && this.validate(),
                          this.value !== this._lastCommittedValue &&
                            (this.dispatchEvent(
                              new CustomEvent("change", { bubbles: !0 })
                            ),
                            (this._lastCommittedValue = this.value));
                      },
                    },
                    {
                      key: "_itemsChanged",
                      value: function (e, t) {
                        var n = this;
                        this._ensureItemsOrDataProvider(function () {
                          n.items = t;
                        }),
                          e
                            ? (this.filteredItems = e.slice(0))
                            : t && (this.filteredItems = null);
                      },
                    },
                    {
                      key: "_filteredItemsChanged",
                      value: function (e, t) {
                        this._setDropdownItems(e);
                        var n = t ? t[this._focusedIndex] : null,
                          i = this.__getItemIndexByValue(e, this.value);
                        (null === this.selectedItem ||
                          void 0 === this.selectedItem) &&
                          i >= 0 &&
                          (this.selectedItem = e[i]);
                        var r = this.__getItemIndexByValue(
                          e,
                          this._getItemValue(n)
                        );
                        this._focusedIndex =
                          r > -1
                            ? r
                            : this.__getItemIndexByLabel(
                                this.filteredItems,
                                this.filter
                              );
                      },
                    },
                    {
                      key: "_filterItems",
                      value: function (e, t) {
                        var n = this;
                        if (!e) return e;
                        var i = e.filter(function (e) {
                          return (
                            (t = t ? t.toString().toLowerCase() : ""),
                            n
                              ._getItemLabel(e)
                              .toString()
                              .toLowerCase()
                              .indexOf(t) > -1
                          );
                        });
                        return i;
                      },
                    },
                    {
                      key: "_selectItemForValue",
                      value: function (e) {
                        var t = this.__getItemIndexByValue(
                            this.filteredItems,
                            e
                          ),
                          n = this.selectedItem;
                        t >= 0
                          ? (this.selectedItem = this.filteredItems[t])
                          : this.dataProvider && void 0 === this.selectedItem
                          ? (this.selectedItem = void 0)
                          : (this.selectedItem = null),
                          null === this.selectedItem &&
                            null === n &&
                            this._selectedItemChanged(this.selectedItem);
                      },
                    },
                    {
                      key: "_setDropdownItems",
                      value: function (e) {
                        this._dropdownItems = e;
                      },
                    },
                    {
                      key: "_getItemElements",
                      value: function () {
                        return Array.from(
                          this._scroller.querySelectorAll(
                            "".concat(this._tagNamePrefix, "-item")
                          )
                        );
                      },
                    },
                    {
                      key: "_scrollIntoView",
                      value: function (e) {
                        this._scroller && this._scroller.scrollIntoView(e);
                      },
                    },
                    {
                      key: "__getItemIndexByValue",
                      value: function (e, t) {
                        var n = this;
                        return e && mi(t)
                          ? gi(e, function (e) {
                              return n._getItemValue(e) === t;
                            })
                          : -1;
                      },
                    },
                    {
                      key: "__getItemIndexByLabel",
                      value: function (e, t) {
                        var n = this;
                        return e && t
                          ? gi(e, function (e) {
                              return (
                                n._getItemLabel(e).toString().toLowerCase() ===
                                t.toString().toLowerCase()
                              );
                            })
                          : -1;
                      },
                    },
                    {
                      key: "_overlaySelectedItemChanged",
                      value: function (e) {
                        e.stopPropagation(),
                          e.detail.item instanceof ui ||
                            (this.opened &&
                              ((this._focusedIndex = this.filteredItems.indexOf(
                                e.detail.item
                              )),
                              this.close()));
                      },
                    },
                    {
                      key: "_setFocused",
                      value: function (e) {
                        if (
                          ((0, c.Z)(
                            (0, d.Z)(t.prototype),
                            "_setFocused",
                            this
                          ).call(this, e),
                          !e && !this.readonly && !this._closeOnBlurIsPrevented)
                        ) {
                          if (
                            !this.opened &&
                            this.allowCustomValue &&
                            this._inputElementValue === this._lastCustomValue
                          )
                            return void delete this._lastCustomValue;
                          this._closeOrCommit();
                        }
                      },
                    },
                    {
                      key: "_shouldRemoveFocus",
                      value: function (e) {
                        return !(
                          (e.relatedTarget &&
                            e.relatedTarget.localName ===
                              "".concat(this._tagNamePrefix, "-item")) ||
                          (e.relatedTarget === this._overlayElement &&
                            (e.composedPath()[0].focus(), 1))
                        );
                      },
                    },
                    {
                      key: "_onTouchend",
                      value: function (e) {
                        this.clearElement &&
                          e.composedPath()[0] === this.clearElement &&
                          (e.preventDefault(), this._onClearAction());
                      },
                    },
                  ],
                  [
                    {
                      key: "properties",
                      get: function () {
                        return {
                          opened: {
                            type: Boolean,
                            notify: !0,
                            value: !1,
                            reflectToAttribute: !0,
                            observer: "_openedChanged",
                          },
                          autoOpenDisabled: { type: Boolean },
                          readonly: {
                            type: Boolean,
                            value: !1,
                            reflectToAttribute: !0,
                          },
                          renderer: Function,
                          items: { type: Array, observer: "_itemsChanged" },
                          allowCustomValue: { type: Boolean, value: !1 },
                          filteredItems: {
                            type: Array,
                            observer: "_filteredItemsChanged",
                          },
                          _lastCommittedValue: String,
                          loading: {
                            type: Boolean,
                            value: !1,
                            reflectToAttribute: !0,
                          },
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
                          _toggleElement: {
                            type: Object,
                            observer: "_toggleElementChanged",
                          },
                          _dropdownItems: { type: Array },
                          _closeOnBlurIsPrevented: Boolean,
                          _scroller: Object,
                          _overlayOpened: {
                            type: Boolean,
                            observer: "_overlayOpenedChanged",
                          },
                        };
                      },
                    },
                    {
                      key: "observers",
                      get: function () {
                        return [
                          "_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)",
                          "_openedOrItemsChanged(opened, _dropdownItems, loading)",
                          "_updateScroller(_scroller, _dropdownItems, opened, loading, selectedItem, itemIdPath, _focusedIndex, renderer, theme)",
                        ];
                      },
                    },
                  ]
                ),
                t
              );
            })(
              (function (e) {
                function t() {
                  return (0, r.Z)(this, t), (0, a.Z)(this, t, arguments);
                }
                return (
                  (0, s.Z)(t, e),
                  (0, o.Z)(
                    t,
                    [
                      {
                        key: "__updateOverlayClassNames",
                        value: function (e, t) {
                          var n = this;
                          if (t && void 0 !== e) {
                            var i = t.classList;
                            if (
                              (this.__initialClasses ||
                                (this.__initialClasses = new Set(i)),
                              Array.isArray(this.__previousClasses))
                            ) {
                              var r = this.__previousClasses.filter(
                                function (e) {
                                  return !n.__initialClasses.has(e);
                                }
                              );
                              r.length > 0 && i.remove.apply(i, (0, _.Z)(r));
                            }
                            var o = "string" == typeof e ? e.split(" ") : [];
                            o.length > 0 && i.add.apply(i, (0, _.Z)(o)),
                              (this.__previousClasses = o);
                          }
                        },
                      },
                    ],
                    [
                      {
                        key: "properties",
                        get: function () {
                          return {
                            overlayClass: { type: String },
                            _overlayElement: { type: Object },
                          };
                        },
                      },
                      {
                        key: "observers",
                        get: function () {
                          return [
                            "__updateOverlayClassNames(overlayClass, _overlayElement)",
                          ];
                        },
                      },
                    ]
                  ),
                  t
                );
              })(On(ci(pi(fi(vi(_i(ki)))))))
            ))
          )
        );
      u(Ci);
    },
    45181: function (e, t, n) {
      n.d(t, {
        hC: function () {
          return a;
        },
      });
      n(63789),
        n(24074),
        n(91989),
        n(46349),
        n(70320),
        n(46798),
        n(94570),
        n(71650),
        n(33368),
        n(68308),
        n(34541),
        n(47838),
        n(69205),
        n(46097),
        n(87438),
        n(9849),
        n(22890),
        n(71791),
        n(50617),
        n(36513),
        n(13526),
        n(99397),
        n(10999),
        n(52117),
        n(82479),
        n(88640),
        n(50289),
        n(94167),
        n(97393),
        n(85472),
        n(90126),
        n(37313),
        n(85717),
        n(30535),
        n(38212),
        n(23376),
        n(72),
        n(26349);
      var i = n(5095),
        r = [];
      function o(e) {
        return e && Object.prototype.hasOwnProperty.call(e, "__themes");
      }
      function a(e, t) {
        var n,
          a =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e &&
          ((n = e),
          o(customElements.get(n)) &&
            console.warn(
              'The custom element definition for "'.concat(
                e,
                '"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.'
              )
            )),
          (t = (function () {
            return [
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            ]
              .flat(1 / 0)
              .filter(function (e) {
                return (
                  e instanceof i.c3 ||
                  (console.warn(
                    "An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."
                  ),
                  !1)
                );
              });
          })(t)),
          window.Vaadin && window.Vaadin.styleModules
            ? window.Vaadin.styleModules.registerStyles(e, t, a)
            : r.push({
                themeFor: e,
                styles: t,
                include: a.include,
                moduleId: a.moduleId,
              });
      }
    },
    76187: function (e, t, n) {
      n.d(t, {
        sR: function () {
          return i.sR;
        },
      });
      var i = n(36585);
    },
    36585: function (e, t, n) {
      n.d(t, {
        sR: function () {
          return g;
        },
      });
      var i = n(46097),
        r = n(71650),
        o = n(33368),
        a = n(68308),
        s = n(34541),
        l = n(47838),
        u = n(69205),
        h = n(40039),
        c =
          (n(51358),
          n(46798),
          n(78399),
          n(5239),
          n(56086),
          n(47884),
          n(81912),
          n(64584),
          n(41483),
          n(12367),
          n(9454),
          n(98490),
          n(41005)),
        d = n(16616),
        _ = function e(t, n) {
          var i,
            r,
            o = t._$AN;
          if (void 0 === o) return !1;
          var a,
            s = (0, h.Z)(o);
          try {
            for (s.s(); !(a = s.n()).done; ) {
              var l = a.value;
              null === (r = (i = l)._$AO) || void 0 === r || r.call(i, n, !1),
                e(l, n);
            }
          } catch (u) {
            s.e(u);
          } finally {
            s.f();
          }
          return !0;
        },
        p = function (e) {
          var t, n;
          do {
            if (void 0 === (t = e._$AM)) break;
            (n = t._$AN).delete(e), (e = t);
          } while (0 === (null == n ? void 0 : n.size));
        },
        f = function (e) {
          for (var t; (t = e._$AM); e = t) {
            var n = t._$AN;
            if (void 0 === n) t._$AN = n = new Set();
            else if (n.has(e)) break;
            n.add(e), m(t);
          }
        };
      function v(e) {
        void 0 !== this._$AN
          ? (p(this), (this._$AM = e), f(this))
          : (this._$AM = e);
      }
      function y(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
          i = this._$AH,
          r = this._$AN;
        if (void 0 !== r && 0 !== r.size)
          if (t)
            if (Array.isArray(i))
              for (var o = n; o < i.length; o++) _(i[o], !1), p(i[o]);
            else null != i && (_(i, !1), p(i));
          else _(this, e);
      }
      var m = function (e) {
          var t, n, i, r;
          e.type == d.pX.CHILD &&
            ((null !== (t = (i = e)._$AP) && void 0 !== t) || (i._$AP = y),
            (null !== (n = (r = e)._$AQ) && void 0 !== n) || (r._$AQ = v));
        },
        g = (function (e) {
          function t() {
            var e;
            return (
              (0, r.Z)(this, t),
              ((e = (0, a.Z)(this, t, arguments))._$AN = void 0),
              e
            );
          }
          return (
            (0, u.Z)(t, e),
            (0, o.Z)(t, [
              {
                key: "_$AT",
                value: function (e, n, i) {
                  (0, s.Z)((0, l.Z)(t.prototype), "_$AT", this).call(
                    this,
                    e,
                    n,
                    i
                  ),
                    f(this),
                    (this.isConnected = e._$AU);
                },
              },
              {
                key: "_$AO",
                value: function (e) {
                  var t,
                    n,
                    i =
                      !(arguments.length > 1 && void 0 !== arguments[1]) ||
                      arguments[1];
                  e !== this.isConnected &&
                    ((this.isConnected = e),
                    e
                      ? null === (t = this.reconnected) ||
                        void 0 === t ||
                        t.call(this)
                      : null === (n = this.disconnected) ||
                        void 0 === n ||
                        n.call(this)),
                    i && (_(this, e), p(this));
                },
              },
              {
                key: "setValue",
                value: function (e) {
                  if ((0, c.OR)(this._$Ct)) this._$Ct._$AI(e, this);
                  else {
                    var t = (0, i.Z)(this._$Ct._$AH);
                    (t[this._$Ci] = e), this._$Ct._$AI(t, this, 0);
                  }
                },
              },
              { key: "disconnected", value: function () {} },
              { key: "reconnected", value: function () {} },
            ]),
            t
          );
        })(d.Xe);
    },
  },
]);
//# sourceMappingURL=5887.vuEQsaOrMxA.js.map
