function e(e, t, o) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: o,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = o),
    e
  );
}
function t(e) {
  return (
    (t = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        }),
    t(e)
  );
}
function o(e, o) {
  for (; !Object.prototype.hasOwnProperty.call(e, o) && null !== (e = t(e)); );
  return e;
}
function r() {
  return (
    (r =
      "undefined" != typeof Reflect && Reflect.get
        ? Reflect.get.bind()
        : function (e, t, r) {
            var i = o(e, t);
            if (i) {
              var a = Object.getOwnPropertyDescriptor(i, t);
              return a.get ? a.get.call(arguments.length < 3 ? e : r) : a.value;
            }
          }),
    r.apply(this, arguments)
  );
}
function i(e) {
  return (
    (function (e) {
      if (Array.isArray(e)) return e;
    })(e) ||
    (function (e) {
      if (
        ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
        null != e["@@iterator"]
      )
        return Array.from(e);
    })(e) ||
    (function (e, t) {
      if (!e) return;
      if ("string" == typeof e) return a(e, t);
      var o = Object.prototype.toString.call(e).slice(8, -1);
      "Object" === o && e.constructor && (o = e.constructor.name);
      if ("Map" === o || "Set" === o) return Array.from(e);
      if (
        "Arguments" === o ||
        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)
      )
        return a(e, t);
    })(e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function a(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var o = 0, r = new Array(t); o < t; o++) r[o] = e[o];
  return r;
}
function n(e) {
  var t = (function (e, t) {
    if ("object" != typeof e || null === e) return e;
    var o = e[Symbol.toPrimitive];
    if (void 0 !== o) {
      var r = o.call(e, t || "default");
      if ("object" != typeof r) return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === t ? String : Number)(e);
  })(e, "string");
  return "symbol" == typeof t ? t : String(t);
}
function s(e, t, o, r) {
  var i = l();
  if (r) for (var a = 0; a < r.length; a++) i = r[a](i);
  var n = t(function (e) {
      i.initializeInstanceElements(e, s.elements);
    }, o),
    s = i.decorateClass(
      (function (e) {
        for (
          var t = [],
            o = function (e) {
              return (
                "method" === e.kind &&
                e.key === a.key &&
                e.placement === a.placement
              );
            },
            r = 0;
          r < e.length;
          r++
        ) {
          var i,
            a = e[r];
          if ("method" === a.kind && (i = t.find(o)))
            if (u(a.descriptor) || u(i.descriptor)) {
              if (p(a) || p(i))
                throw new ReferenceError(
                  "Duplicated methods (" + a.key + ") can't be decorated."
                );
              i.descriptor = a.descriptor;
            } else {
              if (p(a)) {
                if (p(i))
                  throw new ReferenceError(
                    "Decorators can't be placed on different accessors with for the same property (" +
                      a.key +
                      ")."
                  );
                i.decorators = a.decorators;
              }
              c(a, i);
            }
          else t.push(a);
        }
        return t;
      })(n.d.map(d)),
      e
    );
  return (
    i.initializeClassElements(n.F, s.elements),
    i.runClassFinishers(n.F, s.finishers)
  );
}
function l() {
  l = function () {
    return e;
  };
  var e = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (e, t) {
      ["method", "field"].forEach(function (o) {
        t.forEach(function (t) {
          t.kind === o &&
            "own" === t.placement &&
            this.defineClassElement(e, t);
        }, this);
      }, this);
    },
    initializeClassElements: function (e, t) {
      var o = e.prototype;
      ["method", "field"].forEach(function (r) {
        t.forEach(function (t) {
          var i = t.placement;
          if (t.kind === r && ("static" === i || "prototype" === i)) {
            var a = "static" === i ? e : o;
            this.defineClassElement(a, t);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (e, t) {
      var o = t.descriptor;
      if ("field" === t.kind) {
        var r = t.initializer;
        o = {
          enumerable: o.enumerable,
          writable: o.writable,
          configurable: o.configurable,
          value: void 0 === r ? void 0 : r.call(e),
        };
      }
      Object.defineProperty(e, t.key, o);
    },
    decorateClass: function (e, t) {
      var o = [],
        r = [],
        i = { static: [], prototype: [], own: [] };
      if (
        (e.forEach(function (e) {
          this.addElementPlacement(e, i);
        }, this),
        e.forEach(function (e) {
          if (!p(e)) return o.push(e);
          var t = this.decorateElement(e, i);
          o.push(t.element),
            o.push.apply(o, t.extras),
            r.push.apply(r, t.finishers);
        }, this),
        !t)
      )
        return { elements: o, finishers: r };
      var a = this.decorateConstructor(o, t);
      return r.push.apply(r, a.finishers), (a.finishers = r), a;
    },
    addElementPlacement: function (e, t, o) {
      var r = t[e.placement];
      if (!o && -1 !== r.indexOf(e.key))
        throw new TypeError("Duplicated element (" + e.key + ")");
      r.push(e.key);
    },
    decorateElement: function (e, t) {
      for (
        var o = [], r = [], i = e.decorators, a = i.length - 1;
        a >= 0;
        a--
      ) {
        var n = t[e.placement];
        n.splice(n.indexOf(e.key), 1);
        var s = this.fromElementDescriptor(e),
          l = this.toElementFinisherExtras((0, i[a])(s) || s);
        (e = l.element),
          this.addElementPlacement(e, t),
          l.finisher && r.push(l.finisher);
        var d = l.extras;
        if (d) {
          for (var c = 0; c < d.length; c++) this.addElementPlacement(d[c], t);
          o.push.apply(o, d);
        }
      }
      return { element: e, finishers: r, extras: o };
    },
    decorateConstructor: function (e, t) {
      for (var o = [], r = t.length - 1; r >= 0; r--) {
        var i = this.fromClassDescriptor(e),
          a = this.toClassDescriptor((0, t[r])(i) || i);
        if (
          (void 0 !== a.finisher && o.push(a.finisher), void 0 !== a.elements)
        ) {
          e = a.elements;
          for (var n = 0; n < e.length - 1; n++)
            for (var s = n + 1; s < e.length; s++)
              if (e[n].key === e[s].key && e[n].placement === e[s].placement)
                throw new TypeError("Duplicated element (" + e[n].key + ")");
        }
      }
      return { elements: e, finishers: o };
    },
    fromElementDescriptor: function (e) {
      var t = {
        kind: e.kind,
        key: e.key,
        placement: e.placement,
        descriptor: e.descriptor,
      };
      return (
        Object.defineProperty(t, Symbol.toStringTag, {
          value: "Descriptor",
          configurable: !0,
        }),
        "field" === e.kind && (t.initializer = e.initializer),
        t
      );
    },
    toElementDescriptors: function (e) {
      if (void 0 !== e)
        return i(e).map(function (e) {
          var t = this.toElementDescriptor(e);
          return (
            this.disallowProperty(e, "finisher", "An element descriptor"),
            this.disallowProperty(e, "extras", "An element descriptor"),
            t
          );
        }, this);
    },
    toElementDescriptor: function (e) {
      var t = String(e.kind);
      if ("method" !== t && "field" !== t)
        throw new TypeError(
          'An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "' +
            t +
            '"'
        );
      var o = n(e.key),
        r = String(e.placement);
      if ("static" !== r && "prototype" !== r && "own" !== r)
        throw new TypeError(
          'An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "' +
            r +
            '"'
        );
      var i = e.descriptor;
      this.disallowProperty(e, "elements", "An element descriptor");
      var a = {
        kind: t,
        key: o,
        placement: r,
        descriptor: Object.assign({}, i),
      };
      return (
        "field" !== t
          ? this.disallowProperty(e, "initializer", "A method descriptor")
          : (this.disallowProperty(
              i,
              "get",
              "The property descriptor of a field descriptor"
            ),
            this.disallowProperty(
              i,
              "set",
              "The property descriptor of a field descriptor"
            ),
            this.disallowProperty(
              i,
              "value",
              "The property descriptor of a field descriptor"
            ),
            (a.initializer = e.initializer)),
        a
      );
    },
    toElementFinisherExtras: function (e) {
      return {
        element: this.toElementDescriptor(e),
        finisher: h(e, "finisher"),
        extras: this.toElementDescriptors(e.extras),
      };
    },
    fromClassDescriptor: function (e) {
      var t = {
        kind: "class",
        elements: e.map(this.fromElementDescriptor, this),
      };
      return (
        Object.defineProperty(t, Symbol.toStringTag, {
          value: "Descriptor",
          configurable: !0,
        }),
        t
      );
    },
    toClassDescriptor: function (e) {
      var t = String(e.kind);
      if ("class" !== t)
        throw new TypeError(
          'A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "' +
            t +
            '"'
        );
      this.disallowProperty(e, "key", "A class descriptor"),
        this.disallowProperty(e, "placement", "A class descriptor"),
        this.disallowProperty(e, "descriptor", "A class descriptor"),
        this.disallowProperty(e, "initializer", "A class descriptor"),
        this.disallowProperty(e, "extras", "A class descriptor");
      var o = h(e, "finisher");
      return { elements: this.toElementDescriptors(e.elements), finisher: o };
    },
    runClassFinishers: function (e, t) {
      for (var o = 0; o < t.length; o++) {
        var r = (0, t[o])(e);
        if (void 0 !== r) {
          if ("function" != typeof r)
            throw new TypeError("Finishers must return a constructor.");
          e = r;
        }
      }
      return e;
    },
    disallowProperty: function (e, t, o) {
      if (void 0 !== e[t])
        throw new TypeError(o + " can't have a ." + t + " property.");
    },
  };
  return e;
}
function d(e) {
  var t,
    o = n(e.key);
  "method" === e.kind
    ? (t = { value: e.value, writable: !0, configurable: !0, enumerable: !1 })
    : "get" === e.kind
    ? (t = { get: e.value, configurable: !0, enumerable: !1 })
    : "set" === e.kind
    ? (t = { set: e.value, configurable: !0, enumerable: !1 })
    : "field" === e.kind &&
      (t = { configurable: !0, writable: !0, enumerable: !0 });
  var r = {
    kind: "field" === e.kind ? "field" : "method",
    key: o,
    placement: e.static ? "static" : "field" === e.kind ? "own" : "prototype",
    descriptor: t,
  };
  return (
    e.decorators && (r.decorators = e.decorators),
    "field" === e.kind && (r.initializer = e.value),
    r
  );
}
function c(e, t) {
  void 0 !== e.descriptor.get
    ? (t.descriptor.get = e.descriptor.get)
    : (t.descriptor.set = e.descriptor.set);
}
function p(e) {
  return e.decorators && e.decorators.length;
}
function u(e) {
  return void 0 !== e && !(void 0 === e.value && void 0 === e.writable);
}
function h(e, t) {
  var o = e[t];
  if (void 0 !== o && "function" != typeof o)
    throw new TypeError("Expected '" + t + "' to be a function");
  return o;
}
const m =
    window.ShadowRoot &&
    (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  _ = Symbol(),
  f = new Map();
class g {
  constructor(e, t) {
    if (((this._$cssResult$ = !0), t !== _))
      throw Error(
        "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
      );
    this.cssText = e;
  }
  get styleSheet() {
    let e = f.get(this.cssText);
    return (
      m &&
        void 0 === e &&
        (f.set(this.cssText, (e = new CSSStyleSheet())),
        e.replaceSync(this.cssText)),
      e
    );
  }
  toString() {
    return this.cssText;
  }
}
const y = (e) => new g("string" == typeof e ? e : e + "", _),
  b = (e, ...t) => {
    const o =
      1 === e.length
        ? e[0]
        : t.reduce(
            (t, o, r) =>
              t +
              ((e) => {
                if (!0 === e._$cssResult$) return e.cssText;
                if ("number" == typeof e) return e;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    e +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(o) +
              e[r + 1],
            e[0]
          );
    return new g(o, _);
  },
  v = m
    ? (e) => e
    : (e) =>
        e instanceof CSSStyleSheet
          ? ((e) => {
              let t = "";
              for (const o of e.cssRules) t += o.cssText;
              return y(t);
            })(e)
          : e;
var C;
const A = window.trustedTypes,
  H = A ? A.emptyScript : "",
  w = window.reactiveElementPolyfillSupport,
  L = {
    toAttribute(e, t) {
      switch (t) {
        case Boolean:
          e = e ? H : null;
          break;
        case Object:
        case Array:
          e = null == e ? e : JSON.stringify(e);
      }
      return e;
    },
    fromAttribute(e, t) {
      let o = e;
      switch (t) {
        case Boolean:
          o = null !== e;
          break;
        case Number:
          o = null === e ? null : Number(e);
          break;
        case Object:
        case Array:
          try {
            o = JSON.parse(e);
          } catch (e) {
            o = null;
          }
      }
      return o;
    },
  },
  V = (e, t) => t !== e && (t == t || e == e),
  k = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: V };
class M extends HTMLElement {
  constructor() {
    super(),
      (this._$Et = new Map()),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this._$Ei = null),
      this.o();
  }
  static addInitializer(e) {
    var t;
    (null !== (t = this.l) && void 0 !== t) || (this.l = []), this.l.push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return (
      this.elementProperties.forEach((t, o) => {
        const r = this._$Eh(o, t);
        void 0 !== r && (this._$Eu.set(r, o), e.push(r));
      }),
      e
    );
  }
  static createProperty(e, t = k) {
    if (
      (t.state && (t.attribute = !1),
      this.finalize(),
      this.elementProperties.set(e, t),
      !t.noAccessor && !this.prototype.hasOwnProperty(e))
    ) {
      const o = "symbol" == typeof e ? Symbol() : "__" + e,
        r = this.getPropertyDescriptor(e, o, t);
      void 0 !== r && Object.defineProperty(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, o) {
    return {
      get() {
        return this[t];
      },
      set(r) {
        const i = this[e];
        (this[t] = r), this.requestUpdate(e, i, o);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || k;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized")) return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (
      (e.finalize(),
      (this.elementProperties = new Map(e.elementProperties)),
      (this._$Eu = new Map()),
      this.hasOwnProperty("properties"))
    ) {
      const e = this.properties,
        t = [
          ...Object.getOwnPropertyNames(e),
          ...Object.getOwnPropertySymbols(e),
        ];
      for (const o of t) this.createProperty(o, e[o]);
    }
    return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const o = new Set(e.flat(1 / 0).reverse());
      for (const e of o) t.unshift(v(e));
    } else void 0 !== e && t.push(v(e));
    return t;
  }
  static _$Eh(e, t) {
    const o = t.attribute;
    return !1 === o
      ? void 0
      : "string" == typeof o
      ? o
      : "string" == typeof e
      ? e.toLowerCase()
      : void 0;
  }
  o() {
    var e;
    (this._$Ep = new Promise((e) => (this.enableUpdating = e))),
      (this._$AL = new Map()),
      this._$Em(),
      this.requestUpdate(),
      null === (e = this.constructor.l) ||
        void 0 === e ||
        e.forEach((e) => e(this));
  }
  addController(e) {
    var t, o;
    (null !== (t = this._$Eg) && void 0 !== t ? t : (this._$Eg = [])).push(e),
      void 0 !== this.renderRoot &&
        this.isConnected &&
        (null === (o = e.hostConnected) || void 0 === o || o.call(e));
  }
  removeController(e) {
    var t;
    null === (t = this._$Eg) ||
      void 0 === t ||
      t.splice(this._$Eg.indexOf(e) >>> 0, 1);
  }
  _$Em() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this._$Et.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t =
      null !== (e = this.shadowRoot) && void 0 !== e
        ? e
        : this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((e, t) => {
        m
          ? (e.adoptedStyleSheets = t.map((e) =>
              e instanceof CSSStyleSheet ? e : e.styleSheet
            ))
          : t.forEach((t) => {
              const o = document.createElement("style"),
                r = window.litNonce;
              void 0 !== r && o.setAttribute("nonce", r),
                (o.textContent = t.cssText),
                e.appendChild(o);
            });
      })(t, this.constructor.elementStyles),
      t
    );
  }
  connectedCallback() {
    var e;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null === (e = this._$Eg) ||
        void 0 === e ||
        e.forEach((e) => {
          var t;
          return null === (t = e.hostConnected) || void 0 === t
            ? void 0
            : t.call(e);
        });
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    var e;
    null === (e = this._$Eg) ||
      void 0 === e ||
      e.forEach((e) => {
        var t;
        return null === (t = e.hostDisconnected) || void 0 === t
          ? void 0
          : t.call(e);
      });
  }
  attributeChangedCallback(e, t, o) {
    this._$AK(e, o);
  }
  _$ES(e, t, o = k) {
    var r, i;
    const a = this.constructor._$Eh(e, o);
    if (void 0 !== a && !0 === o.reflect) {
      const n = (
        null !==
          (i =
            null === (r = o.converter) || void 0 === r
              ? void 0
              : r.toAttribute) && void 0 !== i
          ? i
          : L.toAttribute
      )(t, o.type);
      (this._$Ei = e),
        null == n ? this.removeAttribute(a) : this.setAttribute(a, n),
        (this._$Ei = null);
    }
  }
  _$AK(e, t) {
    var o, r, i;
    const a = this.constructor,
      n = a._$Eu.get(e);
    if (void 0 !== n && this._$Ei !== n) {
      const e = a.getPropertyOptions(n),
        s = e.converter,
        l =
          null !==
            (i =
              null !==
                (r =
                  null === (o = s) || void 0 === o
                    ? void 0
                    : o.fromAttribute) && void 0 !== r
                ? r
                : "function" == typeof s
                ? s
                : null) && void 0 !== i
            ? i
            : L.fromAttribute;
      (this._$Ei = n), (this[n] = l(t, e.type)), (this._$Ei = null);
    }
  }
  requestUpdate(e, t, o) {
    let r = !0;
    void 0 !== e &&
      (((o = o || this.constructor.getPropertyOptions(e)).hasChanged || V)(
        this[e],
        t
      )
        ? (this._$AL.has(e) || this._$AL.set(e, t),
          !0 === o.reflect &&
            this._$Ei !== e &&
            (void 0 === this._$E_ && (this._$E_ = new Map()),
            this._$E_.set(e, o)))
        : (r = !1)),
      !this.isUpdatePending && r && (this._$Ep = this._$EC());
  }
  async _$EC() {
    this.isUpdatePending = !0;
    try {
      await this._$Ep;
    } catch (e) {
      Promise.reject(e);
    }
    const e = this.scheduleUpdate();
    return null != e && (await e), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending) return;
    this.hasUpdated,
      this._$Et &&
        (this._$Et.forEach((e, t) => (this[t] = e)), (this._$Et = void 0));
    let t = !1;
    const o = this._$AL;
    try {
      (t = this.shouldUpdate(o)),
        t
          ? (this.willUpdate(o),
            null === (e = this._$Eg) ||
              void 0 === e ||
              e.forEach((e) => {
                var t;
                return null === (t = e.hostUpdate) || void 0 === t
                  ? void 0
                  : t.call(e);
              }),
            this.update(o))
          : this._$EU();
    } catch (e) {
      throw ((t = !1), this._$EU(), e);
    }
    t && this._$AE(o);
  }
  willUpdate(e) {}
  _$AE(e) {
    var t;
    null === (t = this._$Eg) ||
      void 0 === t ||
      t.forEach((e) => {
        var t;
        return null === (t = e.hostUpdated) || void 0 === t
          ? void 0
          : t.call(e);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e);
  }
  _$EU() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Ep;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    void 0 !== this._$E_ &&
      (this._$E_.forEach((e, t) => this._$ES(t, this[t], e)),
      (this._$E_ = void 0)),
      this._$EU();
  }
  updated(e) {}
  firstUpdated(e) {}
}
var x;
(M.finalized = !0),
  (M.elementProperties = new Map()),
  (M.elementStyles = []),
  (M.shadowRootOptions = { mode: "open" }),
  null == w || w({ ReactiveElement: M }),
  (null !== (C = globalThis.reactiveElementVersions) && void 0 !== C
    ? C
    : (globalThis.reactiveElementVersions = [])
  ).push("1.2.1");
const S = window,
  E = S.trustedTypes,
  P = E ? E.createPolicy("lit-html", { createHTML: (e) => e }) : void 0,
  T = `lit$${(Math.random() + "").slice(9)}$`,
  O = "?" + T,
  N = `<${O}>`,
  R = document,
  z = (e = "") => R.createComment(e),
  I = (e) => null === e || ("object" != typeof e && "function" != typeof e),
  D = Array.isArray,
  j = (e) =>
    D(e) || "function" == typeof (null == e ? void 0 : e[Symbol.iterator]),
  B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  $ = /-->/g,
  F = />/g,
  U = RegExp(
    ">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)",
    "g"
  ),
  Z = /'/g,
  G = /"/g,
  q = /^(?:script|style|textarea|title)$/i,
  K =
    (e) =>
    (t, ...o) => ({ _$litType$: e, strings: t, values: o }),
  Y = K(1),
  X = K(2),
  J = Symbol.for("lit-noChange"),
  W = Symbol.for("lit-nothing"),
  Q = new WeakMap(),
  ee = R.createTreeWalker(R, 129, null, !1),
  te = (e, t) => {
    const o = e.length - 1,
      r = [];
    let i,
      a = 2 === t ? "<svg>" : "",
      n = B;
    for (let t = 0; t < o; t++) {
      const o = e[t];
      let s,
        l,
        d = -1,
        c = 0;
      for (; c < o.length && ((n.lastIndex = c), (l = n.exec(o)), null !== l); )
        (c = n.lastIndex),
          n === B
            ? "!--" === l[1]
              ? (n = $)
              : void 0 !== l[1]
              ? (n = F)
              : void 0 !== l[2]
              ? (q.test(l[2]) && (i = RegExp("</" + l[2], "g")), (n = U))
              : void 0 !== l[3] && (n = U)
            : n === U
            ? ">" === l[0]
              ? ((n = null != i ? i : B), (d = -1))
              : void 0 === l[1]
              ? (d = -2)
              : ((d = n.lastIndex - l[2].length),
                (s = l[1]),
                (n = void 0 === l[3] ? U : '"' === l[3] ? G : Z))
            : n === G || n === Z
            ? (n = U)
            : n === $ || n === F
            ? (n = B)
            : ((n = U), (i = void 0));
      const p = n === U && e[t + 1].startsWith("/>") ? " " : "";
      a +=
        n === B
          ? o + N
          : d >= 0
          ? (r.push(s), o.slice(0, d) + "$lit$" + o.slice(d) + T + p)
          : o + T + (-2 === d ? (r.push(void 0), t) : p);
    }
    const s = a + (e[o] || "<?>") + (2 === t ? "</svg>" : "");
    if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return [void 0 !== P ? P.createHTML(s) : s, r];
  };
class oe {
  constructor({ strings: e, _$litType$: t }, o) {
    let r;
    this.parts = [];
    let i = 0,
      a = 0;
    const n = e.length - 1,
      s = this.parts,
      [l, d] = te(e, t);
    if (
      ((this.el = oe.createElement(l, o)),
      (ee.currentNode = this.el.content),
      2 === t)
    ) {
      const e = this.el.content,
        t = e.firstChild;
      t.remove(), e.append(...t.childNodes);
    }
    for (; null !== (r = ee.nextNode()) && s.length < n; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes()) {
          const e = [];
          for (const t of r.getAttributeNames())
            if (t.endsWith("$lit$") || t.startsWith(T)) {
              const o = d[a++];
              if ((e.push(t), void 0 !== o)) {
                const e = r.getAttribute(o.toLowerCase() + "$lit$").split(T),
                  t = /([.?@])?(.*)/.exec(o);
                s.push({
                  type: 1,
                  index: i,
                  name: t[2],
                  strings: e,
                  ctor:
                    "." === t[1]
                      ? se
                      : "?" === t[1]
                      ? de
                      : "@" === t[1]
                      ? ce
                      : ne,
                });
              } else s.push({ type: 6, index: i });
            }
          for (const t of e) r.removeAttribute(t);
        }
        if (q.test(r.tagName)) {
          const e = r.textContent.split(T),
            t = e.length - 1;
          if (t > 0) {
            r.textContent = E ? E.emptyScript : "";
            for (let o = 0; o < t; o++)
              r.append(e[o], z()),
                ee.nextNode(),
                s.push({ type: 2, index: ++i });
            r.append(e[t], z());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === O) s.push({ type: 2, index: i });
        else {
          let e = -1;
          for (; -1 !== (e = r.data.indexOf(T, e + 1)); )
            s.push({ type: 7, index: i }), (e += T.length - 1);
        }
      i++;
    }
  }
  static createElement(e, t) {
    const o = R.createElement("template");
    return (o.innerHTML = e), o;
  }
}
function re(e, t, o = e, r) {
  var i, a, n, s;
  if (t === J) return t;
  let l =
    void 0 !== r
      ? null === (i = o._$Co) || void 0 === i
        ? void 0
        : i[r]
      : o._$Cl;
  const d = I(t) ? void 0 : t._$litDirective$;
  return (
    (null == l ? void 0 : l.constructor) !== d &&
      (null === (a = null == l ? void 0 : l._$AO) ||
        void 0 === a ||
        a.call(l, !1),
      void 0 === d ? (l = void 0) : ((l = new d(e)), l._$AT(e, o, r)),
      void 0 !== r
        ? ((null !== (n = (s = o)._$Co) && void 0 !== n ? n : (s._$Co = []))[
            r
          ] = l)
        : (o._$Cl = l)),
    void 0 !== l && (t = re(e, l._$AS(e, t.values), l, r)),
    t
  );
}
class ie {
  constructor(e, t) {
    (this.u = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(e) {
    var t;
    const {
        el: { content: o },
        parts: r,
      } = this._$AD,
      i = (
        null !== (t = null == e ? void 0 : e.creationScope) && void 0 !== t
          ? t
          : R
      ).importNode(o, !0);
    ee.currentNode = i;
    let a = ee.nextNode(),
      n = 0,
      s = 0,
      l = r[0];
    for (; void 0 !== l; ) {
      if (n === l.index) {
        let t;
        2 === l.type
          ? (t = new ae(a, a.nextSibling, this, e))
          : 1 === l.type
          ? (t = new l.ctor(a, l.name, l.strings, this, e))
          : 6 === l.type && (t = new pe(a, this, e)),
          this.u.push(t),
          (l = r[++s]);
      }
      n !== (null == l ? void 0 : l.index) && ((a = ee.nextNode()), n++);
    }
    return i;
  }
  p(e) {
    let t = 0;
    for (const o of this.u)
      void 0 !== o &&
        (void 0 !== o.strings
          ? (o._$AI(e, o, t), (t += o.strings.length - 2))
          : o._$AI(e[t])),
        t++;
  }
}
class ae {
  constructor(e, t, o, r) {
    var i;
    (this.type = 2),
      (this._$AH = W),
      (this._$AN = void 0),
      (this._$AA = e),
      (this._$AB = t),
      (this._$AM = o),
      (this.options = r),
      (this._$Cm =
        null === (i = null == r ? void 0 : r.isConnected) || void 0 === i || i);
  }
  get _$AU() {
    var e, t;
    return null !==
      (t = null === (e = this._$AM) || void 0 === e ? void 0 : e._$AU) &&
      void 0 !== t
      ? t
      : this._$Cm;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return void 0 !== t && 11 === e.nodeType && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    (e = re(this, e, t)),
      I(e)
        ? e === W || null == e || "" === e
          ? (this._$AH !== W && this._$AR(), (this._$AH = W))
          : e !== this._$AH && e !== J && this.g(e)
        : void 0 !== e._$litType$
        ? this.$(e)
        : void 0 !== e.nodeType
        ? this.T(e)
        : j(e)
        ? this.k(e)
        : this.g(e);
  }
  O(e, t = this._$AB) {
    return this._$AA.parentNode.insertBefore(e, t);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
  }
  g(e) {
    this._$AH !== W && I(this._$AH)
      ? (this._$AA.nextSibling.data = e)
      : this.T(R.createTextNode(e)),
      (this._$AH = e);
  }
  $(e) {
    var t;
    const { values: o, _$litType$: r } = e,
      i =
        "number" == typeof r
          ? this._$AC(e)
          : (void 0 === r.el && (r.el = oe.createElement(r.h, this.options)),
            r);
    if ((null === (t = this._$AH) || void 0 === t ? void 0 : t._$AD) === i)
      this._$AH.p(o);
    else {
      const e = new ie(i, this),
        t = e.v(this.options);
      e.p(o), this.T(t), (this._$AH = e);
    }
  }
  _$AC(e) {
    let t = Q.get(e.strings);
    return void 0 === t && Q.set(e.strings, (t = new oe(e))), t;
  }
  k(e) {
    D(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let o,
      r = 0;
    for (const i of e)
      r === t.length
        ? t.push((o = new ae(this.O(z()), this.O(z()), this, this.options)))
        : (o = t[r]),
        o._$AI(i),
        r++;
    r < t.length && (this._$AR(o && o._$AB.nextSibling, r), (t.length = r));
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var o;
    for (
      null === (o = this._$AP) || void 0 === o || o.call(this, !1, !0, t);
      e && e !== this._$AB;

    ) {
      const t = e.nextSibling;
      e.remove(), (e = t);
    }
  }
  setConnected(e) {
    var t;
    void 0 === this._$AM &&
      ((this._$Cm = e),
      null === (t = this._$AP) || void 0 === t || t.call(this, e));
  }
}
class ne {
  constructor(e, t, o, r, i) {
    (this.type = 1),
      (this._$AH = W),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = r),
      (this.options = i),
      o.length > 2 || "" !== o[0] || "" !== o[1]
        ? ((this._$AH = Array(o.length - 1).fill(new String())),
          (this.strings = o))
        : (this._$AH = W);
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, o, r) {
    const i = this.strings;
    let a = !1;
    if (void 0 === i)
      (e = re(this, e, t, 0)),
        (a = !I(e) || (e !== this._$AH && e !== J)),
        a && (this._$AH = e);
    else {
      const r = e;
      let n, s;
      for (e = i[0], n = 0; n < i.length - 1; n++)
        (s = re(this, r[o + n], t, n)),
          s === J && (s = this._$AH[n]),
          a || (a = !I(s) || s !== this._$AH[n]),
          s === W ? (e = W) : e !== W && (e += (null != s ? s : "") + i[n + 1]),
          (this._$AH[n] = s);
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === W
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, null != e ? e : "");
  }
}
class se extends ne {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(e) {
    this.element[this.name] = e === W ? void 0 : e;
  }
}
const le = E ? E.emptyScript : "";
class de extends ne {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(e) {
    e && e !== W
      ? this.element.setAttribute(this.name, le)
      : this.element.removeAttribute(this.name);
  }
}
class ce extends ne {
  constructor(e, t, o, r, i) {
    super(e, t, o, r, i), (this.type = 5);
  }
  _$AI(e, t = this) {
    var o;
    if ((e = null !== (o = re(this, e, t, 0)) && void 0 !== o ? o : W) === J)
      return;
    const r = this._$AH,
      i =
        (e === W && r !== W) ||
        e.capture !== r.capture ||
        e.once !== r.once ||
        e.passive !== r.passive,
      a = e !== W && (r === W || i);
    i && this.element.removeEventListener(this.name, this, r),
      a && this.element.addEventListener(this.name, this, e),
      (this._$AH = e);
  }
  handleEvent(e) {
    var t, o;
    "function" == typeof this._$AH
      ? this._$AH.call(
          null !==
            (o =
              null === (t = this.options) || void 0 === t ? void 0 : t.host) &&
            void 0 !== o
            ? o
            : this.element,
          e
        )
      : this._$AH.handleEvent(e);
  }
}
class pe {
  constructor(e, t, o) {
    (this.element = e),
      (this.type = 6),
      (this._$AN = void 0),
      (this._$AM = t),
      (this.options = o);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    re(this, e);
  }
}
const ue = {
    P: "$lit$",
    A: T,
    M: O,
    C: 1,
    L: te,
    R: ie,
    D: j,
    V: re,
    I: ae,
    H: ne,
    N: de,
    U: ce,
    B: se,
    F: pe,
  },
  he = S.litHtmlPolyfillSupport;
null == he || he(oe, ae),
  (null !== (x = S.litHtmlVersions) && void 0 !== x
    ? x
    : (S.litHtmlVersions = [])
  ).push("2.4.0");
const me = (e, t, o) => {
  var r, i;
  const a =
    null !== (r = null == o ? void 0 : o.renderBefore) && void 0 !== r ? r : t;
  let n = a._$litPart$;
  if (void 0 === n) {
    const e =
      null !== (i = null == o ? void 0 : o.renderBefore) && void 0 !== i
        ? i
        : null;
    a._$litPart$ = n = new ae(
      t.insertBefore(z(), e),
      e,
      void 0,
      null != o ? o : {}
    );
  }
  return n._$AI(e), n;
};
var _e, fe;
class ge extends M {
  constructor() {
    super(...arguments),
      (this.renderOptions = { host: this }),
      (this._$Dt = void 0);
  }
  createRenderRoot() {
    var e, t;
    const o = super.createRenderRoot();
    return (
      (null !== (e = (t = this.renderOptions).renderBefore) && void 0 !== e) ||
        (t.renderBefore = o.firstChild),
      o
    );
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(e),
      (this._$Dt = me(t, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var e;
    super.connectedCallback(),
      null === (e = this._$Dt) || void 0 === e || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(),
      null === (e = this._$Dt) || void 0 === e || e.setConnected(!1);
  }
  render() {
    return J;
  }
}
(ge.finalized = !0),
  (ge._$litElement$ = !0),
  null === (_e = globalThis.litElementHydrateSupport) ||
    void 0 === _e ||
    _e.call(globalThis, { LitElement: ge });
const ye = globalThis.litElementPolyfillSupport;
null == ye || ye({ LitElement: ge }),
  (null !== (fe = globalThis.litElementVersions) && void 0 !== fe
    ? fe
    : (globalThis.litElementVersions = [])
  ).push("3.1.2");
const be = (e) => (t) =>
    "function" == typeof t
      ? ((e, t) => (window.customElements.define(e, t), t))(e, t)
      : ((e, t) => {
          const { kind: o, elements: r } = t;
          return {
            kind: o,
            elements: r,
            finisher(t) {
              window.customElements.define(e, t);
            },
          };
        })(e, t),
  ve = (e, t) =>
    "method" === t.kind && t.descriptor && !("value" in t.descriptor)
      ? {
          ...t,
          finisher(o) {
            o.createProperty(t.key, e);
          },
        }
      : {
          kind: "field",
          key: Symbol(),
          placement: "own",
          descriptor: {},
          originalKey: t.key,
          initializer() {
            "function" == typeof t.initializer &&
              (this[t.key] = t.initializer.call(this));
          },
          finisher(o) {
            o.createProperty(t.key, e);
          },
        };
function Ce(e) {
  return (t, o) =>
    void 0 !== o
      ? ((e, t, o) => {
          t.constructor.createProperty(o, e);
        })(e, t, o)
      : ve(e, t);
}
function Ae(e) {
  return Ce({ ...e, state: !0 });
}
const He =
  ({ finisher: e, descriptor: t }) =>
  (o, r) => {
    var i;
    if (void 0 === r) {
      const r = null !== (i = o.originalKey) && void 0 !== i ? i : o.key,
        a =
          null != t
            ? {
                kind: "method",
                placement: "prototype",
                key: r,
                descriptor: t(o.key),
              }
            : { ...o, key: r };
      return (
        null != e &&
          (a.finisher = function (t) {
            e(t, r);
          }),
        a
      );
    }
    {
      const i = o.constructor;
      void 0 !== t && Object.defineProperty(o, r, t(r)), null == e || e(i, r);
    }
  };
function we(e) {
  return He({
    finisher: (t, o) => {
      Object.assign(t.prototype[o], e);
    },
  });
}
function Le(e, t) {
  return He({
    descriptor: (o) => {
      const r = {
        get() {
          var t, o;
          return null !==
            (o =
              null === (t = this.renderRoot) || void 0 === t
                ? void 0
                : t.querySelector(e)) && void 0 !== o
            ? o
            : null;
        },
        enumerable: !0,
        configurable: !0,
      };
      if (t) {
        const t = "symbol" == typeof o ? Symbol() : "__" + o;
        r.get = function () {
          var o, r;
          return (
            void 0 === this[t] &&
              (this[t] =
                null !==
                  (r =
                    null === (o = this.renderRoot) || void 0 === o
                      ? void 0
                      : o.querySelector(e)) && void 0 !== r
                  ? r
                  : null),
            this[t]
          );
        };
      }
      return r;
    },
  });
}
function Ve(e) {
  return He({
    descriptor: (t) => ({
      async get() {
        var t;
        return (
          await this.updateComplete,
          null === (t = this.renderRoot) || void 0 === t
            ? void 0
            : t.querySelector(e)
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
  });
}
var ke;
const Me =
  null !=
  (null === (ke = window.HTMLSlotElement) || void 0 === ke
    ? void 0
    : ke.prototype.assignedElements)
    ? (e, t) => e.assignedElements(t)
    : (e, t) =>
        e.assignedNodes(t).filter((e) => e.nodeType === Node.ELEMENT_NODE);
function xe(e) {
  const { slot: t, selector: o } = null != e ? e : {};
  return He({
    descriptor: (r) => ({
      get() {
        var r;
        const i = "slot" + (t ? `[name=${t}]` : ":not([name])"),
          a =
            null === (r = this.renderRoot) || void 0 === r
              ? void 0
              : r.querySelector(i),
          n = null != a ? Me(a, e) : [];
        return o ? n.filter((e) => e.matches(o)) : n;
      },
      enumerable: !0,
      configurable: !0,
    }),
  });
}
const Se = {
    "primary-background-color": "#111111",
    "card-background-color": "#1c1c1c",
    "secondary-background-color": "#202020",
    "primary-text-color": "#e1e1e1",
    "secondary-text-color": "#9b9b9b",
    "disabled-text-color": "#6f6f6f",
    "app-header-text-color": "#e1e1e1",
    "app-header-background-color": "#101e24",
    "switch-unchecked-button-color": "#999999",
    "switch-unchecked-track-color": "#9b9b9b",
    "divider-color": "rgba(225, 225, 225, .12)",
    "mdc-ripple-color": "#AAAAAA",
    "input-idle-line-color": "rgba(255, 255, 255, 0.42)",
    "input-hover-line-color": "rgba(255, 255, 255, 0.87)",
    "input-disabled-line-color": "rgba(255, 255, 255, 0.06)",
    "input-outlined-idle-border-color": "rgba(255, 255, 255, 0.38)",
    "input-outlined-hover-border-color": "rgba(255, 255, 255, 0.87)",
    "input-outlined-disabled-border-color": "rgba(255, 255, 255, 0.06)",
    "input-fill-color": "rgba(255, 255, 255, 0.05)",
    "input-disabled-fill-color": "rgba(255, 255, 255, 0.02)",
    "input-ink-color": "rgba(255, 255, 255, 0.87)",
    "input-label-ink-color": "rgba(255, 255, 255, 0.6)",
    "input-disabled-ink-color": "rgba(255, 255, 255, 0.37)",
    "input-dropdown-icon-color": "rgba(255, 255, 255, 0.54)",
    "codemirror-keyword": "#C792EA",
    "codemirror-operator": "#89DDFF",
    "codemirror-variable": "#f07178",
    "codemirror-variable-2": "#EEFFFF",
    "codemirror-variable-3": "#DECB6B",
    "codemirror-builtin": "#FFCB6B",
    "codemirror-atom": "#F78C6C",
    "codemirror-number": "#FF5370",
    "codemirror-def": "#82AAFF",
    "codemirror-string": "#C3E88D",
    "codemirror-string-2": "#f07178",
    "codemirror-comment": "#545454",
    "codemirror-tag": "#FF5370",
    "codemirror-meta": "#FFCB6B",
    "codemirror-attribute": "#C792EA",
    "codemirror-property": "#C792EA",
    "codemirror-qualifier": "#DECB6B",
    "codemirror-type": "#DECB6B",
    "energy-grid-return-color": "#a280db",
    "map-filter":
      "invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3)",
    "rgb-disabled-color": "111, 111, 111",
  },
  Ee = {
    "state-icon-error-color": "var(--error-state-color, var(--error-color))",
    "state-unavailable-color":
      "var(--state-icon-unavailable-color, var(--disabled-text-color))",
    "sidebar-text-color": "var(--primary-text-color)",
    "sidebar-background-color": "var(--card-background-color)",
    "sidebar-selected-text-color": "var(--primary-color)",
    "sidebar-selected-icon-color": "var(--primary-color)",
    "sidebar-icon-color": "rgba(var(--rgb-primary-text-color), 0.6)",
    "switch-checked-color": "var(--primary-color)",
    "switch-checked-button-color":
      "var(--switch-checked-color, var(--primary-background-color))",
    "switch-checked-track-color": "var(--switch-checked-color, #000000)",
    "switch-unchecked-button-color":
      "var(--switch-unchecked-color, var(--primary-background-color))",
    "switch-unchecked-track-color": "var(--switch-unchecked-color, #000000)",
    "slider-color": "var(--primary-color)",
    "slider-secondary-color": "var(--light-primary-color)",
    "slider-track-color": "var(--scrollbar-thumb-color)",
    "label-badge-background-color": "var(--card-background-color)",
    "label-badge-text-color": "rgba(var(--rgb-primary-text-color), 0.8)",
    "paper-listbox-background-color": "var(--card-background-color)",
    "paper-item-icon-color": "var(--state-icon-color)",
    "paper-item-icon-active-color": "var(--state-icon-active-color)",
    "table-row-background-color": "var(--primary-background-color)",
    "table-row-alternative-background-color":
      "var(--secondary-background-color)",
    "paper-slider-knob-color": "var(--slider-color)",
    "paper-slider-knob-start-color": "var(--slider-color)",
    "paper-slider-pin-color": "var(--slider-color)",
    "paper-slider-pin-start-color": "var(--slider-color)",
    "paper-slider-active-color": "var(--slider-color)",
    "paper-slider-secondary-color": "var(--slider-secondary-color)",
    "paper-slider-container-color": "var(--slider-track-color)",
    "data-table-background-color": "var(--card-background-color)",
    "markdown-code-background-color": "var(--primary-background-color)",
    "mdc-theme-primary": "var(--primary-color)",
    "mdc-theme-secondary": "var(--accent-color)",
    "mdc-theme-background": "var(--primary-background-color)",
    "mdc-theme-surface": "var(--card-background-color)",
    "mdc-theme-on-primary": "var(--text-primary-color)",
    "mdc-theme-on-secondary": "var(--text-primary-color)",
    "mdc-theme-on-surface": "var(--primary-text-color)",
    "mdc-theme-text-disabled-on-light": "var(--disabled-text-color)",
    "mdc-theme-text-primary-on-background": "var(--primary-text-color)",
    "mdc-theme-text-secondary-on-background": "var(--secondary-text-color)",
    "mdc-theme-text-hint-on-background": "var(--secondary-text-color)",
    "mdc-theme-text-icon-on-background": "var(--secondary-text-color)",
    "mdc-theme-error": "var(--error-color)",
    "app-header-text-color": "var(--text-primary-color)",
    "app-header-background-color": "var(--primary-color)",
    "mdc-checkbox-unchecked-color": "rgba(var(--rgb-primary-text-color), 0.54)",
    "mdc-checkbox-disabled-color": "var(--disabled-text-color)",
    "mdc-radio-unchecked-color": "rgba(var(--rgb-primary-text-color), 0.54)",
    "mdc-radio-disabled-color": "var(--disabled-text-color)",
    "mdc-tab-text-label-color-default": "var(--primary-text-color)",
    "mdc-button-disabled-ink-color": "var(--disabled-text-color)",
    "mdc-button-outline-color": "var(--divider-color)",
    "mdc-dialog-scroll-divider-color": "var(--divider-color)",
    "mdc-text-field-idle-line-color": "var(--input-idle-line-color)",
    "mdc-text-field-hover-line-color": "var(--input-hover-line-color)",
    "mdc-text-field-disabled-line-color": "var(--input-disabled-line-color)",
    "mdc-text-field-outlined-idle-border-color":
      "var(--input-outlined-idle-border-color)",
    "mdc-text-field-outlined-hover-border-color":
      "var(--input-outlined-hover-border-color)",
    "mdc-text-field-outlined-disabled-border-color":
      "var(--input-outlined-disabled-border-color)",
    "mdc-text-field-fill-color": "var(--input-fill-color)",
    "mdc-text-field-disabled-fill-color": "var(--input-disabled-fill-color)",
    "mdc-text-field-ink-color": "var(--input-ink-color)",
    "mdc-text-field-label-ink-color": "var(--input-label-ink-color)",
    "mdc-text-field-disabled-ink-color": "var(--input-disabled-ink-color)",
    "mdc-select-idle-line-color": "var(--input-idle-line-color)",
    "mdc-select-hover-line-color": "var(--input-hover-line-color)",
    "mdc-select-outlined-idle-border-color":
      "var(--input-outlined-idle-border-color)",
    "mdc-select-outlined-hover-border-color":
      "var(--input-outlined-hover-border-color)",
    "mdc-select-outlined-disabled-border-color":
      "var(--input-outlined-disabled-border-color)",
    "mdc-select-fill-color": "var(--input-fill-color)",
    "mdc-select-disabled-fill-color": "var(--input-disabled-fill-color)",
    "mdc-select-ink-color": "var(--input-ink-color)",
    "mdc-select-label-ink-color": "var(--input-label-ink-color)",
    "mdc-select-disabled-ink-color": "var(--input-disabled-ink-color)",
    "mdc-select-dropdown-icon-color": "var(--input-dropdown-icon-color)",
    "mdc-select-disabled-dropdown-icon-color":
      "var(--input-disabled-ink-color)",
    "chip-background-color": "rgba(var(--rgb-primary-text-color), 0.15)",
    "material-body-text-color": "var(--primary-text-color)",
    "material-background-color": "var(--card-background-color)",
    "material-secondary-background-color": "var(--secondary-background-color)",
    "material-secondary-text-color": "var(--secondary-text-color)",
  },
  Pe = b`
  button.link {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    outline: none;
  }
`,
  Te = b`
  :host {
    font-family: var(--paper-font-body1_-_font-family);
    -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
    font-size: var(--paper-font-body1_-_font-size);
    font-weight: var(--paper-font-body1_-_font-weight);
    line-height: var(--paper-font-body1_-_line-height);
  }

  app-header-layout,
  ha-app-layout {
    background-color: var(--primary-background-color);
  }

  app-header,
  app-toolbar {
    background-color: var(--app-header-background-color);
    font-weight: 400;
    color: var(--app-header-text-color, white);
  }

  app-toolbar {
    height: var(--header-height);
    border-bottom: var(--app-header-border-bottom);
    box-sizing: border-box;
  }

  app-header div[sticky] {
    height: 48px;
  }

  app-toolbar [main-title] {
    margin-left: 20px;
  }

  h1 {
    font-family: var(--paper-font-headline_-_font-family);
    -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing);
    white-space: var(--paper-font-headline_-_white-space);
    overflow: var(--paper-font-headline_-_overflow);
    text-overflow: var(--paper-font-headline_-_text-overflow);
    font-size: var(--paper-font-headline_-_font-size);
    font-weight: var(--paper-font-headline_-_font-weight);
    line-height: var(--paper-font-headline_-_line-height);
  }

  h2 {
    font-family: var(--paper-font-title_-_font-family);
    -webkit-font-smoothing: var(--paper-font-title_-_-webkit-font-smoothing);
    white-space: var(--paper-font-title_-_white-space);
    overflow: var(--paper-font-title_-_overflow);
    text-overflow: var(--paper-font-title_-_text-overflow);
    font-size: var(--paper-font-title_-_font-size);
    font-weight: var(--paper-font-title_-_font-weight);
    line-height: var(--paper-font-title_-_line-height);
  }

  h3 {
    font-family: var(--paper-font-subhead_-_font-family);
    -webkit-font-smoothing: var(--paper-font-subhead_-_-webkit-font-smoothing);
    white-space: var(--paper-font-subhead_-_white-space);
    overflow: var(--paper-font-subhead_-_overflow);
    text-overflow: var(--paper-font-subhead_-_text-overflow);
    font-size: var(--paper-font-subhead_-_font-size);
    font-weight: var(--paper-font-subhead_-_font-weight);
    line-height: var(--paper-font-subhead_-_line-height);
  }

  a {
    color: var(--primary-color);
  }

  .secondary {
    color: var(--secondary-text-color);
  }

  .error {
    color: var(--error-color);
  }

  .warning {
    color: var(--error-color);
  }

  mwc-button.warning {
    --mdc-theme-primary: var(--error-color);
  }

  ${Pe}

  .card-actions a {
    text-decoration: none;
  }

  .card-actions .warning {
    --mdc-theme-primary: var(--error-color);
  }

  .layout.horizontal,
  .layout.vertical {
    display: flex;
  }
  .layout.inline {
    display: inline-flex;
  }
  .layout.horizontal {
    flex-direction: row;
  }
  .layout.vertical {
    flex-direction: column;
  }
  .layout.wrap {
    flex-wrap: wrap;
  }
  .layout.no-wrap {
    flex-wrap: nowrap;
  }
  .layout.center,
  .layout.center-center {
    align-items: center;
  }
  .layout.bottom {
    align-items: flex-end;
  }
  .layout.center-justified,
  .layout.center-center {
    justify-content: center;
  }
  .flex {
    flex: 1;
    flex-basis: 0.000000001px;
  }
  .flex-auto {
    flex: 1 1 auto;
  }
  .flex-none {
    flex: none;
  }
  .layout.justified {
    justify-content: space-between;
  }
`,
  Oe = b`
  /* mwc-dialog (ha-dialog) styles */
  ha-dialog {
    --mdc-dialog-min-width: 400px;
    --mdc-dialog-max-width: 600px;
    --mdc-dialog-heading-ink-color: var(--primary-text-color);
    --mdc-dialog-content-ink-color: var(--primary-text-color);
    --justify-action-buttons: space-between;
  }

  ha-dialog .form {
    color: var(--primary-text-color);
  }

  a {
    color: var(--primary-color);
  }

  /* make dialog fullscreen on small screens */
  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-dialog {
      --mdc-dialog-min-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-max-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-min-height: 100%;
      --mdc-dialog-max-height: 100%;
      --vertical-align-dialog: flex-end;
      --ha-dialog-border-radius: 0px;
    }
  }
  mwc-button.warning {
    --mdc-theme-primary: var(--error-color);
  }
  .error {
    color: var(--error-color);
  }
`,
  Ne = b`
  .ha-scrollbar::-webkit-scrollbar {
    width: 0.4rem;
    height: 0.4rem;
  }

  .ha-scrollbar::-webkit-scrollbar-thumb {
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background: var(--scrollbar-thumb-color);
  }

  .ha-scrollbar {
    overflow-y: auto;
    scrollbar-color: var(--scrollbar-thumb-color) transparent;
    scrollbar-width: thin;
  }
`;
b`
  body {
    background-color: var(--primary-background-color);
    color: var(--primary-text-color);
    height: calc(100vh - 32px);
    width: 100vw;
  }
`;
const Re = (e) => {
    if (6 === (e = e.replace("#", "")).length) return e;
    let t = "";
    for (const o of e) t += o + o;
    return t;
  },
  ze = (e) => {
    const t = Math.round(Math.min(Math.max(e, 0), 255)).toString(16);
    return 1 === t.length ? `0${t}` : t;
  },
  Ie = (e) => (
    (e = Re(e)),
    [
      parseInt(e.substring(0, 2), 16),
      parseInt(e.substring(2, 4), 16),
      parseInt(e.substring(4, 6), 16),
    ]
  ),
  De = (e) => `#${ze(e[0])}${ze(e[1])}${ze(e[2])}`,
  je = 0.137931034,
  Be = 0.12841855,
  $e = (e) =>
    (e /= 255) <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4,
  Fe = (e) => (e > 0.008856452 ? e ** (1 / 3) : e / Be + je),
  Ue = (e) => 255 * (e <= 0.00304 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055),
  Ze = (e) => (e > 0.206896552 ? e * e * e : Be * (e - je)),
  Ge = (e) => {
    const [t, o, r] = ((e) => {
        let [t, o, r] = e;
        return (
          (t = $e(t)),
          (o = $e(o)),
          (r = $e(r)),
          [
            Fe((0.4124564 * t + 0.3575761 * o + 0.1804375 * r) / 0.95047),
            Fe((0.2126729 * t + 0.7151522 * o + 0.072175 * r) / 1),
            Fe((0.0193339 * t + 0.119192 * o + 0.9503041 * r) / 1.08883),
          ]
        );
      })(e),
      i = 116 * o - 16;
    return [i < 0 ? 0 : i, 500 * (t - o), 200 * (o - r)];
  },
  qe = (e) => {
    const [t, o, r] = e;
    let i = (t + 16) / 116,
      a = isNaN(o) ? i : i + o / 500,
      n = isNaN(r) ? i : i - r / 200;
    (i = 1 * Ze(i)), (a = 0.95047 * Ze(a)), (n = 1.08883 * Ze(n));
    return [
      Ue(3.2404542 * a - 1.5371385 * i - 0.4985314 * n),
      Ue(-0.969266 * a + 1.8760108 * i + 0.041556 * n),
      Ue(0.0556434 * a - 0.2040259 * i + 1.0572252 * n),
    ];
  },
  Ke = (e, t = 1) => [e[0] - 18 * t, e[1], e[2]],
  Ye = (e) => {
    const t = [0, 0, 0];
    for (let o = 0; o < e.length; o++) {
      const r = e[o] / 255;
      t[o] = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2];
  },
  Xe = (e, t) => {
    const o = Ye(e),
      r = Ye(t);
    return o > r ? (o + 0.05) / (r + 0.05) : (r + 0.05) / (o + 0.05);
  };
let Je = {};
const We = (e, t, o, r, i) => {
    var a, n;
    const s = o || (i ? t.theme : void 0),
      l =
        r && void 0 !== (null == r ? void 0 : r.dark)
          ? null == r
            ? void 0
            : r.dark
          : t.darkMode;
    let d = s,
      c = {};
    if ((s && l && ((d = `${d}__dark`), (c = { ...Se })), "default" === s)) {
      var p;
      const t = null == r ? void 0 : r.primaryColor,
        o = null == r ? void 0 : r.accentColor;
      if (
        (l &&
          t &&
          (c["app-header-background-color"] = ((e, t, o = 50) => {
            let r = "";
            (e = Re(e)), (t = Re(t));
            for (let i = 0; i <= 5; i += 2) {
              const a = parseInt(e.substr(i, 2), 16),
                n = parseInt(t.substr(i, 2), 16);
              let s = Math.floor(n + (o / 100) * (a - n)).toString(16);
              for (; s.length < 2; ) s = "0" + s;
              r += s;
            }
            return `#${r}`;
          })(t, "#121212", 8)),
        t)
      ) {
        d = `${d}__primary_${t}`;
        const e = Ie(t),
          o = Ge(e);
        c["primary-color"] = t;
        const r = qe(((e, t = 1) => Ke(e, -t))(o));
        (c["light-primary-color"] = De(r)),
          (c["dark-primary-color"] = ((e) => {
            const t = qe(e);
            return De(t);
          })(Ke(o))),
          (c["text-primary-color"] =
            Xe(e, [33, 33, 33]) < 6 ? "#fff" : "#212121"),
          (c["text-light-primary-color"] =
            Xe(r, [33, 33, 33]) < 6 ? "#fff" : "#212121"),
          (c["state-icon-color"] = c["dark-primary-color"]);
      }
      if (o) {
        (d = `${d}__accent_${o}`), (c["accent-color"] = o);
        const e = Ie(o);
        c["text-accent-color"] = Xe(e, [33, 33, 33]) < 6 ? "#fff" : "#212121";
      }
      if (
        (null === (p = e._themes) || void 0 === p ? void 0 : p.cacheKey) === d
      )
        return;
    }
    if (s && "default" !== s && t.themes[s]) {
      const { modes: e, ...o } = t.themes[s];
      (c = { ...c, ...o }),
        e && (c = l ? { ...c, ...e.dark } : { ...c, ...e.light });
    }
    if (
      !(
        (null !== (a = e._themes) && void 0 !== a && a.keys) ||
        Object.keys(c).length
      )
    )
      return;
    const u = Object.keys(c).length && d ? Je[d] || Qe(d, c) : void 0,
      h = {
        ...(null === (n = e._themes) || void 0 === n ? void 0 : n.keys),
        ...(null == u ? void 0 : u.styles),
      };
    (e._themes = { cacheKey: d, keys: null == u ? void 0 : u.keys }),
      e.updateStyles
        ? e.updateStyles(h)
        : window.ShadyCSS && window.ShadyCSS.styleSubtree(e, h);
  },
  Qe = (e, t) => {
    if (!t || !Object.keys(t).length) return;
    const o = { ...Ee, ...t },
      r = {},
      i = {};
    for (const e of Object.keys(o)) {
      const t = `--${e}`,
        a = String(o[e]);
      if (((r[t] = a), (i[t] = ""), !a.startsWith("#"))) continue;
      const n = `rgb-${e}`;
      if (void 0 === o[n])
        try {
          const e = Ie(a).join(","),
            t = `--${n}`;
          (r[t] = e), (i[t] = "");
        } catch (e) {
          continue;
        }
    }
    return (Je[e] = { styles: r, keys: i }), { styles: r, keys: i };
  },
  et =
    "ha-main-window" === window.name
      ? window
      : "ha-main-window" === parent.name
      ? parent
      : top,
  tt = (e, t, o, r) => {
    (r = r || {}), (o = null == o ? {} : o);
    const i = new Event(t, {
      bubbles: void 0 === r.bubbles || r.bubbles,
      cancelable: Boolean(r.cancelable),
      composed: void 0 === r.composed || r.composed,
    });
    return (i.detail = o), e.dispatchEvent(i), i;
  },
  ot = !(window.ShadyDOM && window.ShadyDOM.inUse);
let rt, it;
function at(e) {
  rt =
    (!e || !e.shimcssproperties) &&
    (ot ||
      Boolean(
        !navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) &&
          window.CSS &&
          CSS.supports &&
          CSS.supports("box-shadow", "0 0 0 var(--foo)")
      ));
}
window.ShadyCSS &&
  void 0 !== window.ShadyCSS.cssBuild &&
  (it = window.ShadyCSS.cssBuild);
const nt = Boolean(window.ShadyCSS && window.ShadyCSS.disableRuntime);
window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss
  ? (rt = window.ShadyCSS.nativeCss)
  : window.ShadyCSS
  ? (at(window.ShadyCSS), (window.ShadyCSS = void 0))
  : at(window.WebComponents && window.WebComponents.flags);
const st = rt;
class lt {
  constructor() {
    (this.start = 0),
      (this.end = 0),
      (this.previous = null),
      (this.parent = null),
      (this.rules = null),
      (this.parsedCssText = ""),
      (this.cssText = ""),
      (this.atRule = !1),
      (this.type = 0),
      (this.keyframesName = ""),
      (this.selector = ""),
      (this.parsedSelector = "");
  }
}
function dt(e) {
  return ct(
    (function (e) {
      let t = new lt();
      (t.start = 0), (t.end = e.length);
      let o = t;
      for (let r = 0, i = e.length; r < i; r++)
        if (e[r] === ht) {
          o.rules || (o.rules = []);
          let e = o,
            t = e.rules[e.rules.length - 1] || null;
          (o = new lt()),
            (o.start = r + 1),
            (o.parent = e),
            (o.previous = t),
            e.rules.push(o);
        } else e[r] === mt && ((o.end = r + 1), (o = o.parent || t));
      return t;
    })((e = e.replace(_t.comments, "").replace(_t.port, ""))),
    e
  );
}
function ct(e, t) {
  let o = t.substring(e.start, e.end - 1);
  if (((e.parsedCssText = e.cssText = o.trim()), e.parent)) {
    let r = e.previous ? e.previous.end : e.parent.start;
    (o = t.substring(r, e.start - 1)),
      (o = (function (e) {
        return e.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
          let e = arguments[1],
            t = 6 - e.length;
          for (; t--; ) e = "0" + e;
          return "\\" + e;
        });
      })(o)),
      (o = o.replace(_t.multipleSpaces, " ")),
      (o = o.substring(o.lastIndexOf(";") + 1));
    let i = (e.parsedSelector = e.selector = o.trim());
    (e.atRule = 0 === i.indexOf(yt)),
      e.atRule
        ? 0 === i.indexOf(gt)
          ? (e.type = ut.MEDIA_RULE)
          : i.match(_t.keyframesRule) &&
            ((e.type = ut.KEYFRAMES_RULE),
            (e.keyframesName = e.selector.split(_t.multipleSpaces).pop()))
        : 0 === i.indexOf(ft)
        ? (e.type = ut.MIXIN_RULE)
        : (e.type = ut.STYLE_RULE);
  }
  let r = e.rules;
  if (r) for (let e, o = 0, i = r.length; o < i && (e = r[o]); o++) ct(e, t);
  return e;
}
function pt(e, t, o = "") {
  let r = "";
  if (e.cssText || e.rules) {
    let o = e.rules;
    if (
      o &&
      !(function (e) {
        let t = e[0];
        return (
          Boolean(t) && Boolean(t.selector) && 0 === t.selector.indexOf(ft)
        );
      })(o)
    )
      for (let e, i = 0, a = o.length; i < a && (e = o[i]); i++)
        r = pt(e, t, r);
    else
      (r = t
        ? e.cssText
        : (function (e) {
            return (function (e) {
              return e.replace(_t.mixinApply, "").replace(_t.varApply, "");
            })(
              (e = (function (e) {
                return e.replace(_t.customProp, "").replace(_t.mixinProp, "");
              })(e))
            );
          })(e.cssText)),
        (r = r.trim()),
        r && (r = "  " + r + "\n");
  }
  return (
    r &&
      (e.selector && (o += e.selector + " " + ht + "\n"),
      (o += r),
      e.selector && (o += mt + "\n\n")),
    o
  );
}
const ut = { STYLE_RULE: 1, KEYFRAMES_RULE: 7, MEDIA_RULE: 4, MIXIN_RULE: 1e3 },
  ht = "{",
  mt = "}",
  _t = {
    comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
    port: /@import[^;]*;/gim,
    customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
    mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
    mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
    varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
    keyframesRule: /^@[^\s]*keyframes/,
    multipleSpaces: /\s+/g,
  },
  ft = "--",
  gt = "@media",
  yt = "@",
  bt =
    /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
  vt = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
  Ct = /@media\s(.*)/,
  At = new Set();
function Ht(e) {
  const t = e.textContent;
  if (!At.has(t)) {
    At.add(t);
    const e = document.createElement("style");
    e.setAttribute("shady-unscoped", ""),
      (e.textContent = t),
      document.head.appendChild(e);
  }
}
function wt(e) {
  return e.hasAttribute("shady-unscoped");
}
function Lt(e, t) {
  return e
    ? ("string" == typeof e && (e = dt(e)), t && kt(e, t), pt(e, st))
    : "";
}
function Vt(e) {
  return (
    !e.__cssRules && e.textContent && (e.__cssRules = dt(e.textContent)),
    e.__cssRules || null
  );
}
function kt(e, t, o, r) {
  if (!e) return;
  let i = !1,
    a = e.type;
  if (r && a === ut.MEDIA_RULE) {
    let t = e.selector.match(Ct);
    t && (window.matchMedia(t[1]).matches || (i = !0));
  }
  a === ut.STYLE_RULE
    ? t(e)
    : o && a === ut.KEYFRAMES_RULE
    ? o(e)
    : a === ut.MIXIN_RULE && (i = !0);
  let n = e.rules;
  if (n && !i)
    for (let e, i = 0, a = n.length; i < a && (e = n[i]); i++) kt(e, t, o, r);
}
function Mt(e, t) {
  let o = e.indexOf("var(");
  if (-1 === o) return t(e, "", "", "");
  let r = (function (e, t) {
      let o = 0;
      for (let r = t, i = e.length; r < i; r++)
        if ("(" === e[r]) o++;
        else if (")" === e[r] && 0 == --o) return r;
      return -1;
    })(e, o + 3),
    i = e.substring(o + 4, r),
    a = e.substring(0, o),
    n = Mt(e.substring(r + 1), t),
    s = i.indexOf(",");
  return -1 === s
    ? t(a, i.trim(), "", n)
    : t(a, i.substring(0, s).trim(), i.substring(s + 1).trim(), n);
}
window.ShadyDOM && window.ShadyDOM.wrap;
function xt(e) {
  if (void 0 !== it) return it;
  if (void 0 === e.__cssBuild) {
    const t = e.getAttribute("css-build");
    if (t) e.__cssBuild = t;
    else {
      const t = (function (e) {
        const t =
          "template" === e.localName ? e.content.firstChild : e.firstChild;
        if (t instanceof Comment) {
          const e = t.textContent.trim().split(":");
          if ("css-build" === e[0]) return e[1];
        }
        return "";
      })(e);
      "" !== t &&
        (function (e) {
          const t =
            "template" === e.localName ? e.content.firstChild : e.firstChild;
          t.parentNode.removeChild(t);
        })(e),
        (e.__cssBuild = t);
    }
  }
  return e.__cssBuild || "";
}
function St(e) {
  return "" !== xt(e);
}
function Et(e, t) {
  for (let o in t)
    null === o ? e.style.removeProperty(o) : e.style.setProperty(o, t[o]);
}
function Pt(e, t) {
  const o = window.getComputedStyle(e).getPropertyValue(t);
  return o ? o.trim() : "";
}
const Tt = /;\s*/m,
  Ot = /^\s*(initial)|(inherit)\s*$/,
  Nt = /\s*!important/;
class Rt {
  constructor() {
    this._map = {};
  }
  set(e, t) {
    (e = e.trim()), (this._map[e] = { properties: t, dependants: {} });
  }
  get(e) {
    return (e = e.trim()), this._map[e] || null;
  }
}
let zt = null;
class It {
  constructor() {
    (this._currentElement = null),
      (this._measureElement = null),
      (this._map = new Rt());
  }
  detectMixin(e) {
    return (function (e) {
      const t = vt.test(e) || bt.test(e);
      return (vt.lastIndex = 0), (bt.lastIndex = 0), t;
    })(e);
  }
  gatherStyles(e) {
    const t = (function (e) {
      const t = [],
        o = e.querySelectorAll("style");
      for (let e = 0; e < o.length; e++) {
        const r = o[e];
        wt(r)
          ? ot || (Ht(r), r.parentNode.removeChild(r))
          : (t.push(r.textContent), r.parentNode.removeChild(r));
      }
      return t.join("").trim();
    })(e.content);
    if (t) {
      const o = document.createElement("style");
      return (
        (o.textContent = t), e.content.insertBefore(o, e.content.firstChild), o
      );
    }
    return null;
  }
  transformTemplate(e, t) {
    void 0 === e._gatheredStyle && (e._gatheredStyle = this.gatherStyles(e));
    const o = e._gatheredStyle;
    return o ? this.transformStyle(o, t) : null;
  }
  transformStyle(e, t = "") {
    let o = Vt(e);
    return this.transformRules(o, t), (e.textContent = Lt(o)), o;
  }
  transformCustomStyle(e) {
    let t = Vt(e);
    return (
      kt(t, (e) => {
        ":root" === e.selector && (e.selector = "html"), this.transformRule(e);
      }),
      (e.textContent = Lt(t)),
      t
    );
  }
  transformRules(e, t) {
    (this._currentElement = t),
      kt(e, (e) => {
        this.transformRule(e);
      }),
      (this._currentElement = null);
  }
  transformRule(e) {
    (e.cssText = this.transformCssText(e.parsedCssText, e)),
      ":root" === e.selector && (e.selector = ":host > *");
  }
  transformCssText(e, t) {
    return (
      (e = e.replace(bt, (e, o, r, i) =>
        this._produceCssProperties(e, o, r, i, t)
      )),
      this._consumeCssProperties(e, t)
    );
  }
  _getInitialValueForProperty(e) {
    return (
      this._measureElement ||
        ((this._measureElement = document.createElement("meta")),
        this._measureElement.setAttribute("apply-shim-measure", ""),
        (this._measureElement.style.all = "initial"),
        document.head.appendChild(this._measureElement)),
      window.getComputedStyle(this._measureElement).getPropertyValue(e)
    );
  }
  _fallbacksFromPreviousRules(e) {
    let t = e;
    for (; t.parent; ) t = t.parent;
    const o = {};
    let r = !1;
    return (
      kt(t, (t) => {
        (r = r || t === e),
          r ||
            (t.selector === e.selector &&
              Object.assign(o, this._cssTextToMap(t.parsedCssText)));
      }),
      o
    );
  }
  _consumeCssProperties(e, t) {
    let o = null;
    for (; (o = vt.exec(e)); ) {
      let r = o[0],
        i = o[1],
        a = o.index,
        n = a + r.indexOf("@apply"),
        s = a + r.length,
        l = e.slice(0, n),
        d = e.slice(s),
        c = t ? this._fallbacksFromPreviousRules(t) : {};
      Object.assign(c, this._cssTextToMap(l));
      let p = this._atApplyToCssProperties(i, c);
      (e = `${l}${p}${d}`), (vt.lastIndex = a + p.length);
    }
    return e;
  }
  _atApplyToCssProperties(e, t) {
    e = e.replace(Tt, "");
    let o = [],
      r = this._map.get(e);
    if ((r || (this._map.set(e, {}), (r = this._map.get(e))), r)) {
      let i, a, n;
      this._currentElement && (r.dependants[this._currentElement] = !0);
      const s = r.properties;
      for (i in s)
        (n = t && t[i]),
          (a = [i, ": var(", e, "_-_", i]),
          n && a.push(",", n.replace(Nt, "")),
          a.push(")"),
          Nt.test(s[i]) && a.push(" !important"),
          o.push(a.join(""));
    }
    return o.join("; ");
  }
  _replaceInitialOrInherit(e, t) {
    let o = Ot.exec(t);
    return (
      o &&
        (t = o[1] ? this._getInitialValueForProperty(e) : "apply-shim-inherit"),
      t
    );
  }
  _cssTextToMap(e, t = !1) {
    let o,
      r,
      i = e.split(";"),
      a = {};
    for (let e, n, s = 0; s < i.length; s++)
      (e = i[s]),
        e &&
          ((n = e.split(":")),
          n.length > 1 &&
            ((o = n[0].trim()),
            (r = n.slice(1).join(":")),
            t && (r = this._replaceInitialOrInherit(o, r)),
            (a[o] = r)));
    return a;
  }
  _invalidateMixinEntry(e) {
    if (zt) for (let t in e.dependants) t !== this._currentElement && zt(t);
  }
  _produceCssProperties(e, t, o, r, i) {
    if (
      (o &&
        Mt(o, (e, t) => {
          t && this._map.get(t) && (r = `@apply ${t};`);
        }),
      !r)
    )
      return e;
    let a = this._consumeCssProperties("" + r, i),
      n = e.slice(0, e.indexOf("--")),
      s = this._cssTextToMap(a, !0),
      l = s,
      d = this._map.get(t),
      c = d && d.properties;
    c ? (l = Object.assign(Object.create(c), s)) : this._map.set(t, l);
    let p,
      u,
      h = [],
      m = !1;
    for (p in l)
      (u = s[p]),
        void 0 === u && (u = "initial"),
        c && !(p in c) && (m = !0),
        h.push(`${t}_-_${p}: ${u}`);
    return (
      m && this._invalidateMixinEntry(d),
      d && (d.properties = l),
      o && (n = `${e};${n}`),
      `${n}${h.join("; ")};`
    );
  }
}
(It.prototype.detectMixin = It.prototype.detectMixin),
  (It.prototype.transformStyle = It.prototype.transformStyle),
  (It.prototype.transformCustomStyle = It.prototype.transformCustomStyle),
  (It.prototype.transformRules = It.prototype.transformRules),
  (It.prototype.transformRule = It.prototype.transformRule),
  (It.prototype.transformTemplate = It.prototype.transformTemplate),
  (It.prototype._separator = "_-_"),
  Object.defineProperty(It.prototype, "invalidCallback", {
    get: () => zt,
    set(e) {
      zt = e;
    },
  });
const Dt = {},
  jt = "_applyShimCurrentVersion",
  Bt = "_applyShimNextVersion",
  $t = "_applyShimValidatingVersion",
  Ft = Promise.resolve();
function Ut(e) {
  let t = Dt[e];
  t &&
    (function (e) {
      (e[jt] = e[jt] || 0), (e[$t] = e[$t] || 0), (e[Bt] = (e[Bt] || 0) + 1);
    })(t);
}
function Zt(e) {
  return e[jt] === e[Bt];
}
let Gt,
  qt = null,
  Kt = (window.HTMLImports && window.HTMLImports.whenReady) || null;
function Yt(e) {
  requestAnimationFrame(function () {
    Kt
      ? Kt(e)
      : (qt ||
          ((qt = new Promise((e) => {
            Gt = e;
          })),
          "complete" === document.readyState
            ? Gt()
            : document.addEventListener("readystatechange", () => {
                "complete" === document.readyState && Gt();
              })),
        qt.then(function () {
          e && e();
        }));
  });
}
const Xt = "__shadyCSSCachedStyle";
let Jt = null,
  Wt = null;
class Qt {
  constructor() {
    (this.customStyles = []),
      (this.enqueued = !1),
      Yt(() => {
        window.ShadyCSS.flushCustomStyles &&
          window.ShadyCSS.flushCustomStyles();
      });
  }
  enqueueDocumentValidation() {
    !this.enqueued && Wt && ((this.enqueued = !0), Yt(Wt));
  }
  addCustomStyle(e) {
    e.__seenByShadyCSS ||
      ((e.__seenByShadyCSS = !0),
      this.customStyles.push(e),
      this.enqueueDocumentValidation());
  }
  getStyleForCustomStyle(e) {
    if (e[Xt]) return e[Xt];
    let t;
    return (t = e.getStyle ? e.getStyle() : e), t;
  }
  processStyles() {
    const e = this.customStyles;
    for (let t = 0; t < e.length; t++) {
      const o = e[t];
      if (o[Xt]) continue;
      const r = this.getStyleForCustomStyle(o);
      if (r) {
        const e = r.__appliedElement || r;
        Jt && Jt(e), (o[Xt] = e);
      }
    }
    return e;
  }
}
(Qt.prototype.addCustomStyle = Qt.prototype.addCustomStyle),
  (Qt.prototype.getStyleForCustomStyle = Qt.prototype.getStyleForCustomStyle),
  (Qt.prototype.processStyles = Qt.prototype.processStyles),
  Object.defineProperties(Qt.prototype, {
    transformCallback: {
      get: () => Jt,
      set(e) {
        Jt = e;
      },
    },
    validateCallback: {
      get: () => Wt,
      set(e) {
        let t = !1;
        Wt || (t = !0), (Wt = e), t && this.enqueueDocumentValidation();
      },
    },
  });
const eo = new It();
class to {
  constructor() {
    (this.customStyleInterface = null), (eo.invalidCallback = Ut);
  }
  ensure() {
    this.customStyleInterface ||
      (window.ShadyCSS.CustomStyleInterface &&
        ((this.customStyleInterface = window.ShadyCSS.CustomStyleInterface),
        (this.customStyleInterface.transformCallback = (e) => {
          eo.transformCustomStyle(e);
        }),
        (this.customStyleInterface.validateCallback = () => {
          requestAnimationFrame(() => {
            this.customStyleInterface.enqueued && this.flushCustomStyles();
          });
        })));
  }
  prepareTemplate(e, t) {
    if ((this.ensure(), St(e))) return;
    Dt[t] = e;
    let o = eo.transformTemplate(e, t);
    e._styleAst = o;
  }
  flushCustomStyles() {
    if ((this.ensure(), !this.customStyleInterface)) return;
    let e = this.customStyleInterface.processStyles();
    if (this.customStyleInterface.enqueued) {
      for (let t = 0; t < e.length; t++) {
        let o = e[t],
          r = this.customStyleInterface.getStyleForCustomStyle(o);
        r && eo.transformCustomStyle(r);
      }
      this.customStyleInterface.enqueued = !1;
    }
  }
  styleSubtree(e, t) {
    if ((this.ensure(), t && Et(e, t), e.shadowRoot)) {
      this.styleElement(e);
      let t = e.shadowRoot.children || e.shadowRoot.childNodes;
      for (let e = 0; e < t.length; e++) this.styleSubtree(t[e]);
    } else {
      let t = e.children || e.childNodes;
      for (let e = 0; e < t.length; e++) this.styleSubtree(t[e]);
    }
  }
  styleElement(e) {
    this.ensure();
    let { is: t } = (function (e) {
        let t = e.localName,
          o = "",
          r = "";
        return (
          t
            ? t.indexOf("-") > -1
              ? (o = t)
              : ((r = t), (o = (e.getAttribute && e.getAttribute("is")) || ""))
            : ((o = e.is), (r = e.extends)),
          { is: o, typeExtension: r }
        );
      })(e),
      o = Dt[t];
    if ((!o || !St(o)) && o && !Zt(o)) {
      (function (e) {
        return !Zt(e) && e[$t] === e[Bt];
      })(o) ||
        (this.prepareTemplate(o, t),
        (function (e) {
          (e[$t] = e[Bt]),
            e._validating ||
              ((e._validating = !0),
              Ft.then(function () {
                (e[jt] = e[Bt]), (e._validating = !1);
              }));
        })(o));
      let r = e.shadowRoot;
      if (r) {
        let e = r.querySelector("style");
        e && ((e.__cssRules = o._styleAst), (e.textContent = Lt(o._styleAst)));
      }
    }
  }
  styleDocument(e) {
    this.ensure(), this.styleSubtree(document.body, e);
  }
}
if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
  const e = new to();
  let t = window.ShadyCSS && window.ShadyCSS.CustomStyleInterface;
  (window.ShadyCSS = {
    prepareTemplate(t, o, r) {
      e.flushCustomStyles(), e.prepareTemplate(t, o);
    },
    prepareTemplateStyles(e, t, o) {
      window.ShadyCSS.prepareTemplate(e, t, o);
    },
    prepareTemplateDom(e, t) {},
    styleSubtree(t, o) {
      e.flushCustomStyles(), e.styleSubtree(t, o);
    },
    styleElement(t) {
      e.flushCustomStyles(), e.styleElement(t);
    },
    styleDocument(t) {
      e.flushCustomStyles(), e.styleDocument(t);
    },
    getComputedStyleValue: (e, t) => Pt(e, t),
    flushCustomStyles() {
      e.flushCustomStyles();
    },
    nativeCss: st,
    nativeShadow: ot,
    cssBuild: it,
    disableRuntime: nt,
  }),
    t && (window.ShadyCSS.CustomStyleInterface = t);
}
(window.ShadyCSS.ApplyShim = eo),
  (window.JSCompiler_renameProperty = function (e, t) {
    return e;
  });
let oo,
  ro,
  io = /(url\()([^)]*)(\))/g,
  ao = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/;
function no(e, t) {
  if (e && ao.test(e)) return e;
  if ("//" === e) return e;
  if (void 0 === oo) {
    oo = !1;
    try {
      const e = new URL("b", "http://a");
      (e.pathname = "c%20d"), (oo = "http://a/c%20d" === e.href);
    } catch (e) {}
  }
  if ((t || (t = document.baseURI || window.location.href), oo))
    try {
      return new URL(e, t).href;
    } catch (t) {
      return e;
    }
  return (
    ro ||
      ((ro = document.implementation.createHTMLDocument("temp")),
      (ro.base = ro.createElement("base")),
      ro.head.appendChild(ro.base),
      (ro.anchor = ro.createElement("a")),
      ro.body.appendChild(ro.anchor)),
    (ro.base.href = t),
    (ro.anchor.href = e),
    ro.anchor.href || e
  );
}
function so(e, t) {
  return e.replace(io, function (e, o, r, i) {
    return o + "'" + no(r.replace(/["']/g, ""), t) + "'" + i;
  });
}
function lo(e) {
  return e.substring(0, e.lastIndexOf("/") + 1);
}
const co = !window.ShadyDOM || !window.ShadyDOM.inUse;
Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
const po =
  co &&
  "adoptedStyleSheets" in Document.prototype &&
  "replaceSync" in CSSStyleSheet.prototype &&
  (() => {
    try {
      const e = new CSSStyleSheet();
      e.replaceSync("");
      const t = document.createElement("div");
      return (
        t.attachShadow({ mode: "open" }),
        (t.shadowRoot.adoptedStyleSheets = [e]),
        t.shadowRoot.adoptedStyleSheets[0] === e
      );
    } catch (e) {
      return !1;
    }
  })();
let uo =
    (window.Polymer && window.Polymer.rootPath) ||
    lo(document.baseURI || window.location.href),
  ho = (window.Polymer && window.Polymer.sanitizeDOMValue) || void 0,
  mo = (window.Polymer && window.Polymer.setPassiveTouchGestures) || !1,
  _o = (window.Polymer && window.Polymer.strictTemplatePolicy) || !1,
  fo = (window.Polymer && window.Polymer.allowTemplateFromDomModule) || !1,
  go = (window.Polymer && window.Polymer.legacyOptimizations) || !1,
  yo = (window.Polymer && window.Polymer.legacyWarnings) || !1,
  bo = (window.Polymer && window.Polymer.syncInitialRender) || !1,
  vo = (window.Polymer && window.Polymer.legacyUndefined) || !1,
  Co = (window.Polymer && window.Polymer.orderedComputed) || !1,
  Ao = (window.Polymer && window.Polymer.removeNestedTemplates) || !1,
  Ho = (window.Polymer && window.Polymer.fastDomIf) || !1,
  wo = (window.Polymer && window.Polymer.suppressTemplateNotifications) || !1,
  Lo = (window.Polymer && window.Polymer.legacyNoObservedAttributes) || !1,
  Vo =
    (window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS) || !1,
  ko = 0;
const Mo = function (e) {
  let t = e.__mixinApplications;
  t || ((t = new WeakMap()), (e.__mixinApplications = t));
  let o = ko++;
  return function (r) {
    let i = r.__mixinSet;
    if (i && i[o]) return r;
    let a = t,
      n = a.get(r);
    if (!n) {
      (n = e(r)), a.set(r, n);
      let t = Object.create(n.__mixinSet || i || null);
      (t[o] = !0), (n.__mixinSet = t);
    }
    return n;
  };
};
let xo = {},
  So = {};
function Eo(e, t) {
  xo[e] = So[e.toLowerCase()] = t;
}
function Po(e) {
  return xo[e] || So[e.toLowerCase()];
}
class To extends HTMLElement {
  static get observedAttributes() {
    return ["id"];
  }
  static import(e, t) {
    if (e) {
      let o = Po(e);
      return o && t ? o.querySelector(t) : o;
    }
    return null;
  }
  attributeChangedCallback(e, t, o, r) {
    t !== o && this.register();
  }
  get assetpath() {
    if (!this.__assetpath) {
      const e =
          window.HTMLImports && HTMLImports.importForElement
            ? HTMLImports.importForElement(this) || document
            : this.ownerDocument,
        t = no(this.getAttribute("assetpath") || "", e.baseURI);
      this.__assetpath = lo(t);
    }
    return this.__assetpath;
  }
  register(e) {
    if ((e = e || this.id)) {
      if (_o && void 0 !== Po(e))
        throw (
          (Eo(e, null),
          new Error(`strictTemplatePolicy: dom-module ${e} re-registered`))
        );
      (this.id = e),
        Eo(e, this),
        (t = this).querySelector("style") &&
          console.warn("dom-module %s has style outside template", t.id);
    }
    var t;
  }
}
(To.prototype.modules = xo), customElements.define("dom-module", To);
function Oo(e) {
  return To.import(e);
}
function No(e) {
  const t = so((e.body ? e.body : e).textContent, e.baseURI),
    o = document.createElement("style");
  return (o.textContent = t), o;
}
function Ro(e) {
  const t = e.trim().split(/\s+/),
    o = [];
  for (let e = 0; e < t.length; e++) o.push(...zo(t[e]));
  return o;
}
function zo(e) {
  const t = Oo(e);
  if (!t)
    return console.warn("Could not find style data in module named", e), [];
  if (void 0 === t._styles) {
    const e = [];
    e.push(...Do(t));
    const o = t.querySelector("template");
    o && e.push(...Io(o, t.assetpath)), (t._styles = e);
  }
  return t._styles;
}
function Io(e, t) {
  if (!e._styles) {
    const o = [],
      r = e.content.querySelectorAll("style");
    for (let e = 0; e < r.length; e++) {
      let i = r[e],
        a = i.getAttribute("include");
      a &&
        o.push(
          ...Ro(a).filter(function (e, t, o) {
            return o.indexOf(e) === t;
          })
        ),
        t && (i.textContent = so(i.textContent, t)),
        o.push(i);
    }
    e._styles = o;
  }
  return e._styles;
}
function Do(e) {
  const t = [],
    o = e.querySelectorAll("link[rel=import][type~=css]");
  for (let e = 0; e < o.length; e++) {
    let r = o[e];
    if (r.import) {
      const e = r.import,
        o = r.hasAttribute("shady-unscoped");
      if (o && !e._unscopedStyle) {
        const t = No(e);
        t.setAttribute("shady-unscoped", ""), (e._unscopedStyle = t);
      } else e._style || (e._style = No(e));
      t.push(o ? e._unscopedStyle : e._style);
    }
  }
  return t;
}
function jo(e) {
  let t = Oo(e);
  if (t && void 0 === t._cssText) {
    let e = (function (e) {
        let t = "",
          o = Do(e);
        for (let e = 0; e < o.length; e++) t += o[e].textContent;
        return t;
      })(t),
      o = t.querySelector("template");
    o &&
      (e += (function (e, t) {
        let o = "";
        const r = Io(e, t);
        for (let e = 0; e < r.length; e++) {
          let t = r[e];
          t.parentNode && t.parentNode.removeChild(t), (o += t.textContent);
        }
        return o;
      })(o, t.assetpath)),
      (t._cssText = e || null);
  }
  return (
    t || console.warn("Could not find style data in module named", e),
    (t && t._cssText) || ""
  );
}
const Bo =
  window.ShadyDOM && window.ShadyDOM.noPatch && window.ShadyDOM.wrap
    ? window.ShadyDOM.wrap
    : window.ShadyDOM
    ? (e) => ShadyDOM.patch(e)
    : (e) => e;
function $o(e) {
  return e.indexOf(".") >= 0;
}
function Fo(e) {
  let t = e.indexOf(".");
  return -1 === t ? e : e.slice(0, t);
}
function Uo(e, t) {
  return 0 === e.indexOf(t + ".");
}
function Zo(e, t) {
  return 0 === t.indexOf(e + ".");
}
function Go(e, t, o) {
  return t + o.slice(e.length);
}
function qo(e) {
  if (Array.isArray(e)) {
    let t = [];
    for (let o = 0; o < e.length; o++) {
      let r = e[o].toString().split(".");
      for (let e = 0; e < r.length; e++) t.push(r[e]);
    }
    return t.join(".");
  }
  return e;
}
function Ko(e) {
  return Array.isArray(e) ? qo(e).split(".") : e.toString().split(".");
}
function Yo(e, t, o) {
  let r = e,
    i = Ko(t);
  for (let e = 0; e < i.length; e++) {
    if (!r) return;
    r = r[i[e]];
  }
  return o && (o.path = i.join(".")), r;
}
function Xo(e, t, o) {
  let r = e,
    i = Ko(t),
    a = i[i.length - 1];
  if (i.length > 1) {
    for (let e = 0; e < i.length - 1; e++) {
      if (((r = r[i[e]]), !r)) return;
    }
    r[a] = o;
  } else r[t] = o;
  return i.join(".");
}
const Jo = {},
  Wo = /-[a-z]/g,
  Qo = /([A-Z])/g;
function er(e) {
  return (
    Jo[e] ||
    (Jo[e] = e.indexOf("-") < 0 ? e : e.replace(Wo, (e) => e[1].toUpperCase()))
  );
}
function tr(e) {
  return Jo[e] || (Jo[e] = e.replace(Qo, "-$1").toLowerCase());
}
let or = 0,
  rr = 0,
  ir = [],
  ar = 0,
  nr = !1,
  sr = document.createTextNode("");
new window.MutationObserver(function () {
  nr = !1;
  const e = ir.length;
  for (let t = 0; t < e; t++) {
    let e = ir[t];
    if (e)
      try {
        e();
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
  }
  ir.splice(0, e), (rr += e);
}).observe(sr, { characterData: !0 });
const lr = {
    after: (e) => ({
      run: (t) => window.setTimeout(t, e),
      cancel(e) {
        window.clearTimeout(e);
      },
    }),
    run: (e, t) => window.setTimeout(e, t),
    cancel(e) {
      window.clearTimeout(e);
    },
  },
  dr = {
    run: (e) => window.requestAnimationFrame(e),
    cancel(e) {
      window.cancelAnimationFrame(e);
    },
  },
  cr = {
    run: (e) => (nr || ((nr = !0), (sr.textContent = ar++)), ir.push(e), or++),
    cancel(e) {
      const t = e - rr;
      if (t >= 0) {
        if (!ir[t]) throw new Error("invalid async handle: " + e);
        ir[t] = null;
      }
    },
  },
  pr = cr,
  ur = Mo(
    (e) =>
      class extends e {
        static createProperties(e) {
          const t = this.prototype;
          for (let o in e) o in t || t._createPropertyAccessor(o);
        }
        static attributeNameForProperty(e) {
          return e.toLowerCase();
        }
        static typeForProperty(e) {}
        _createPropertyAccessor(e, t) {
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
        }
        _addPropertyToAttributeMap(e) {
          this.hasOwnProperty(
            JSCompiler_renameProperty("__dataAttributes", this)
          ) ||
            (this.__dataAttributes = Object.assign({}, this.__dataAttributes));
          let t = this.__dataAttributes[e];
          return (
            t ||
              ((t = this.constructor.attributeNameForProperty(e)),
              (this.__dataAttributes[t] = e)),
            t
          );
        }
        _definePropertyAccessor(e, t) {
          Object.defineProperty(this, e, {
            get() {
              return this.__data[e];
            },
            set: t
              ? function () {}
              : function (t) {
                  this._setPendingProperty(e, t, !0) &&
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
          for (let e in this.__dataHasAccessor)
            this.hasOwnProperty(e) &&
              ((this.__dataInstanceProps = this.__dataInstanceProps || {}),
              (this.__dataInstanceProps[e] = this[e]),
              delete this[e]);
        }
        _initializeInstanceProperties(e) {
          Object.assign(this, e);
        }
        _setProperty(e, t) {
          this._setPendingProperty(e, t) && this._invalidateProperties();
        }
        _getProperty(e) {
          return this.__data[e];
        }
        _setPendingProperty(e, t, o) {
          let r = this.__data[e],
            i = this._shouldPropertyChange(e, t, r);
          return (
            i &&
              (this.__dataPending ||
                ((this.__dataPending = {}), (this.__dataOld = {})),
              this.__dataOld &&
                !(e in this.__dataOld) &&
                (this.__dataOld[e] = r),
              (this.__data[e] = t),
              (this.__dataPending[e] = t)),
            i
          );
        }
        _isPropertyPending(e) {
          return !(
            !this.__dataPending || !this.__dataPending.hasOwnProperty(e)
          );
        }
        _invalidateProperties() {
          !this.__dataInvalid &&
            this.__dataReady &&
            ((this.__dataInvalid = !0),
            pr.run(() => {
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
          const e = this.__data,
            t = this.__dataPending,
            o = this.__dataOld;
          this._shouldPropertiesChange(e, t, o) &&
            ((this.__dataPending = null),
            (this.__dataOld = null),
            this._propertiesChanged(e, t, o)),
            this.__dataCounter--;
        }
        _shouldPropertiesChange(e, t, o) {
          return Boolean(t);
        }
        _propertiesChanged(e, t, o) {}
        _shouldPropertyChange(e, t, o) {
          return o !== t && (o == o || t == t);
        }
        attributeChangedCallback(e, t, o, r) {
          t !== o && this._attributeToProperty(e, o),
            super.attributeChangedCallback &&
              super.attributeChangedCallback(e, t, o, r);
        }
        _attributeToProperty(e, t, o) {
          if (!this.__serializing) {
            const r = this.__dataAttributes,
              i = (r && r[e]) || e;
            this[i] = this._deserializeValue(
              t,
              o || this.constructor.typeForProperty(i)
            );
          }
        }
        _propertyToAttribute(e, t, o) {
          (this.__serializing = !0),
            (o = arguments.length < 3 ? this[e] : o),
            this._valueToNodeAttribute(
              this,
              o,
              t || this.constructor.attributeNameForProperty(e)
            ),
            (this.__serializing = !1);
        }
        _valueToNodeAttribute(e, t, o) {
          const r = this._serializeValue(t);
          ("class" !== o && "name" !== o && "slot" !== o) || (e = Bo(e)),
            void 0 === r ? e.removeAttribute(o) : e.setAttribute(o, r);
        }
        _serializeValue(e) {
          return "boolean" == typeof e
            ? e
              ? ""
              : void 0
            : null != e
            ? e.toString()
            : void 0;
        }
        _deserializeValue(e, t) {
          switch (t) {
            case Boolean:
              return null !== e;
            case Number:
              return Number(e);
            default:
              return e;
          }
        }
      }
  ),
  hr = {};
let mr = HTMLElement.prototype;
for (; mr; ) {
  let e = Object.getOwnPropertyNames(mr);
  for (let t = 0; t < e.length; t++) hr[e[t]] = !0;
  mr = Object.getPrototypeOf(mr);
}
const _r = Mo((e) => {
    const t = ur(e);
    return class extends t {
      static createPropertiesForAttributes() {
        let e = this.observedAttributes;
        for (let t = 0; t < e.length; t++)
          this.prototype._createPropertyAccessor(er(e[t]));
      }
      static attributeNameForProperty(e) {
        return tr(e);
      }
      _initializeProperties() {
        this.__dataProto &&
          (this._initializeProtoProperties(this.__dataProto),
          (this.__dataProto = null)),
          super._initializeProperties();
      }
      _initializeProtoProperties(e) {
        for (let t in e) this._setProperty(t, e[t]);
      }
      _ensureAttribute(e, t) {
        const o = this;
        o.hasAttribute(e) || this._valueToNodeAttribute(o, t, e);
      }
      _serializeValue(e) {
        if ("object" == typeof e) {
          if (e instanceof Date) return e.toString();
          if (e)
            try {
              return JSON.stringify(e);
            } catch (e) {
              return "";
            }
        }
        return super._serializeValue(e);
      }
      _deserializeValue(e, t) {
        let o;
        switch (t) {
          case Object:
            try {
              o = JSON.parse(e);
            } catch (t) {
              o = e;
            }
            break;
          case Array:
            try {
              o = JSON.parse(e);
            } catch (t) {
              (o = null),
                console.warn(
                  `Polymer::Attributes: couldn't decode Array as JSON: ${e}`
                );
            }
            break;
          case Date:
            (o = isNaN(e) ? String(e) : Number(e)), (o = new Date(o));
            break;
          default:
            o = super._deserializeValue(e, t);
        }
        return o;
      }
      _definePropertyAccessor(e, t) {
        !(function (e, t) {
          if (!hr[t]) {
            let o = e[t];
            void 0 !== o &&
              (e.__data
                ? e._setPendingProperty(t, o)
                : (e.__dataProto
                    ? e.hasOwnProperty(
                        JSCompiler_renameProperty("__dataProto", e)
                      ) || (e.__dataProto = Object.create(e.__dataProto))
                    : (e.__dataProto = {}),
                  (e.__dataProto[t] = o)));
          }
        })(this, e),
          super._definePropertyAccessor(e, t);
      }
      _hasAccessor(e) {
        return this.__dataHasAccessor && this.__dataHasAccessor[e];
      }
      _isPropertyPending(e) {
        return Boolean(this.__dataPending && e in this.__dataPending);
      }
    };
  }),
  fr = { "dom-if": !0, "dom-repeat": !0 };
let gr = !1,
  yr = !1;
function br(e) {
  (function () {
    if (!gr) {
      gr = !0;
      const e = document.createElement("textarea");
      (e.placeholder = "a"), (yr = e.placeholder === e.textContent);
    }
    return yr;
  })() &&
    "textarea" === e.localName &&
    e.placeholder &&
    e.placeholder === e.textContent &&
    (e.textContent = null);
}
function vr(e) {
  let t = e.getAttribute("is");
  if (t && fr[t]) {
    let o = e;
    for (
      o.removeAttribute("is"),
        e = o.ownerDocument.createElement(t),
        o.parentNode.replaceChild(e, o),
        e.appendChild(o);
      o.attributes.length;

    )
      e.setAttribute(o.attributes[0].name, o.attributes[0].value),
        o.removeAttribute(o.attributes[0].name);
  }
  return e;
}
function Cr(e, t) {
  let o = t.parentInfo && Cr(e, t.parentInfo);
  if (!o) return e;
  for (let e = o.firstChild, r = 0; e; e = e.nextSibling)
    if (t.parentIndex === r++) return e;
}
function Ar(e, t, o, r) {
  r.id && (t[r.id] = o);
}
function Hr(e, t, o) {
  if (o.events && o.events.length)
    for (let r, i = 0, a = o.events; i < a.length && (r = a[i]); i++)
      e._addMethodEventListenerToNode(t, r.name, r.value, e);
}
function wr(e, t, o, r) {
  o.templateInfo &&
    ((t._templateInfo = o.templateInfo), (t._parentTemplateInfo = r));
}
const Lr = Mo(
  (e) =>
    class extends e {
      static _parseTemplate(e, t) {
        if (!e._templateInfo) {
          let o = (e._templateInfo = {});
          (o.nodeInfoList = []),
            (o.nestedTemplate = Boolean(t)),
            (o.stripWhiteSpace =
              (t && t.stripWhiteSpace) || e.hasAttribute("strip-whitespace")),
            this._parseTemplateContent(e, o, { parent: null });
        }
        return e._templateInfo;
      }
      static _parseTemplateContent(e, t, o) {
        return this._parseTemplateNode(e.content, t, o);
      }
      static _parseTemplateNode(e, t, o) {
        let r = !1,
          i = e;
        return (
          "template" != i.localName || i.hasAttribute("preserve-content")
            ? "slot" === i.localName && (t.hasInsertionPoint = !0)
            : (r = this._parseTemplateNestedTemplate(i, t, o) || r),
          br(i),
          i.firstChild && this._parseTemplateChildNodes(i, t, o),
          i.hasAttributes &&
            i.hasAttributes() &&
            (r = this._parseTemplateNodeAttributes(i, t, o) || r),
          r || o.noted
        );
      }
      static _parseTemplateChildNodes(e, t, o) {
        if ("script" !== e.localName && "style" !== e.localName)
          for (let r, i = e.firstChild, a = 0; i; i = r) {
            if (
              ("template" == i.localName && (i = vr(i)),
              (r = i.nextSibling),
              i.nodeType === Node.TEXT_NODE)
            ) {
              let o = r;
              for (; o && o.nodeType === Node.TEXT_NODE; )
                (i.textContent += o.textContent),
                  (r = o.nextSibling),
                  e.removeChild(o),
                  (o = r);
              if (t.stripWhiteSpace && !i.textContent.trim()) {
                e.removeChild(i);
                continue;
              }
            }
            let n = { parentIndex: a, parentInfo: o };
            this._parseTemplateNode(i, t, n) &&
              (n.infoIndex = t.nodeInfoList.push(n) - 1),
              i.parentNode && a++;
          }
      }
      static _parseTemplateNestedTemplate(e, t, o) {
        let r = e,
          i = this._parseTemplate(r, t);
        return (
          (i.content =
            r.content.ownerDocument.createDocumentFragment()).appendChild(
            r.content
          ),
          (o.templateInfo = i),
          !0
        );
      }
      static _parseTemplateNodeAttributes(e, t, o) {
        let r = !1,
          i = Array.from(e.attributes);
        for (let a, n = i.length - 1; (a = i[n]); n--)
          r = this._parseTemplateNodeAttribute(e, t, o, a.name, a.value) || r;
        return r;
      }
      static _parseTemplateNodeAttribute(e, t, o, r, i) {
        return "on-" === r.slice(0, 3)
          ? (e.removeAttribute(r),
            (o.events = o.events || []),
            o.events.push({ name: r.slice(3), value: i }),
            !0)
          : "id" === r && ((o.id = i), !0);
      }
      static _contentForTemplate(e) {
        let t = e._templateInfo;
        return (t && t.content) || e.content;
      }
      _stampTemplate(e, t) {
        e &&
          !e.content &&
          window.HTMLTemplateElement &&
          HTMLTemplateElement.decorate &&
          HTMLTemplateElement.decorate(e);
        let o = (t = t || this.constructor._parseTemplate(e)).nodeInfoList,
          r = t.content || e.content,
          i = document.importNode(r, !0);
        i.__noInsertionPoint = !t.hasInsertionPoint;
        let a = (i.nodeList = new Array(o.length));
        i.$ = {};
        for (let e, r = 0, n = o.length; r < n && (e = o[r]); r++) {
          let o = (a[r] = Cr(i, e));
          Ar(0, i.$, o, e), wr(0, o, e, t), Hr(this, o, e);
        }
        return i;
      }
      _addMethodEventListenerToNode(e, t, o, r) {
        let i = (function (e, t, o) {
          return (
            (e = e._methodHost || e),
            function (t) {
              e[o]
                ? e[o](t, t.detail)
                : console.warn("listener method `" + o + "` not defined");
            }
          );
        })((r = r || e), 0, o);
        return this._addEventListenerToNode(e, t, i), i;
      }
      _addEventListenerToNode(e, t, o) {
        e.addEventListener(t, o);
      }
      _removeEventListenerFromNode(e, t, o) {
        e.removeEventListener(t, o);
      }
    }
);
let Vr = 0;
const kr = [],
  Mr = {
    COMPUTE: "__computeEffects",
    REFLECT: "__reflectEffects",
    NOTIFY: "__notifyEffects",
    PROPAGATE: "__propagateEffects",
    OBSERVE: "__observeEffects",
    READ_ONLY: "__readOnly",
  },
  xr = /[A-Z]/;
function Sr(e, t, o) {
  let r = e[t];
  if (r) {
    if (!e.hasOwnProperty(t) && ((r = e[t] = Object.create(e[t])), o))
      for (let e in r) {
        let t = r[e],
          o = (r[e] = Array(t.length));
        for (let e = 0; e < t.length; e++) o[e] = t[e];
      }
  } else r = e[t] = {};
  return r;
}
function Er(e, t, o, r, i, a) {
  if (t) {
    let n = !1;
    const s = Vr++;
    for (let l in o) {
      let d = t[i ? Fo(l) : l];
      if (d)
        for (let t, c = 0, p = d.length; c < p && (t = d[c]); c++)
          (t.info && t.info.lastRun === s) ||
            (i && !Tr(l, t.trigger)) ||
            (t.info && (t.info.lastRun = s),
            t.fn(e, l, o, r, t.info, i, a),
            (n = !0));
    }
    return n;
  }
  return !1;
}
function Pr(e, t, o, r, i, a, n, s) {
  let l = !1,
    d = t[n ? Fo(r) : r];
  if (d)
    for (let t, c = 0, p = d.length; c < p && (t = d[c]); c++)
      (t.info && t.info.lastRun === o) ||
        (n && !Tr(r, t.trigger)) ||
        (t.info && (t.info.lastRun = o),
        t.fn(e, r, i, a, t.info, n, s),
        (l = !0));
  return l;
}
function Tr(e, t) {
  if (t) {
    let o = t.name;
    return (
      o == e || !(!t.structured || !Uo(o, e)) || !(!t.wildcard || !Zo(o, e))
    );
  }
  return !0;
}
function Or(e, t, o, r, i) {
  let a = "string" == typeof i.method ? e[i.method] : i.method,
    n = i.property;
  a
    ? a.call(e, e.__data[n], r[n])
    : i.dynamicFn ||
      console.warn("observer method `" + i.method + "` not defined");
}
function Nr(e, t, o) {
  let r = Fo(t);
  if (r !== t) {
    return Rr(e, tr(r) + "-changed", o[t], t), !0;
  }
  return !1;
}
function Rr(e, t, o, r) {
  let i = { value: o, queueProperty: !0 };
  r && (i.path = r), Bo(e).dispatchEvent(new CustomEvent(t, { detail: i }));
}
function zr(e, t, o, r, i, a) {
  let n = (a ? Fo(t) : t) != t ? t : null,
    s = n ? Yo(e, n) : e.__data[t];
  n && void 0 === s && (s = o[t]), Rr(e, i.eventName, s, n);
}
function Ir(e, t, o, r, i) {
  let a = e.__data[t];
  ho && (a = ho(a, i.attrName, "attribute", e)),
    e._propertyToAttribute(t, i.attrName, a);
}
function Dr(e, t, o, r) {
  let i = e[Mr.COMPUTE];
  if (i)
    if (Co) {
      Vr++;
      const a = (function (e) {
          let t = e.constructor.__orderedComputedDeps;
          if (!t) {
            t = new Map();
            const o = e[Mr.COMPUTE];
            let r,
              {
                counts: i,
                ready: a,
                total: n,
              } = (function (e) {
                const t = e.__computeInfo,
                  o = {},
                  r = e[Mr.COMPUTE],
                  i = [];
                let a = 0;
                for (let e in t) {
                  const r = t[e];
                  a += o[e] =
                    r.args.filter((e) => !e.literal).length +
                    (r.dynamicFn ? 1 : 0);
                }
                for (let e in r) t[e] || i.push(e);
                return { counts: o, ready: i, total: a };
              })(e);
            for (; (r = a.shift()); ) {
              t.set(r, t.size);
              const e = o[r];
              e &&
                e.forEach((e) => {
                  const t = e.info.methodInfo;
                  --n, 0 == --i[t] && a.push(t);
                });
            }
            if (0 !== n) {
              const t = e;
              console.warn(
                `Computed graph for ${t.localName} incomplete; circular?`
              );
            }
            e.constructor.__orderedComputedDeps = t;
          }
          return t;
        })(e),
        n = [];
      for (let e in t) Br(e, i, n, a, r);
      let s;
      for (; (s = n.shift()); )
        $r(e, "", t, o, s) && Br(s.methodInfo, i, n, a, r);
      Object.assign(o, e.__dataOld),
        Object.assign(t, e.__dataPending),
        (e.__dataPending = null);
    } else {
      let a = t;
      for (; Er(e, i, a, o, r); )
        Object.assign(o, e.__dataOld),
          Object.assign(t, e.__dataPending),
          (a = e.__dataPending),
          (e.__dataPending = null);
    }
}
const jr = (e, t, o) => {
    let r = 0,
      i = t.length - 1,
      a = -1;
    for (; r <= i; ) {
      const n = (r + i) >> 1,
        s = o.get(t[n].methodInfo) - o.get(e.methodInfo);
      if (s < 0) r = n + 1;
      else {
        if (!(s > 0)) {
          a = n;
          break;
        }
        i = n - 1;
      }
    }
    a < 0 && (a = i + 1), t.splice(a, 0, e);
  },
  Br = (e, t, o, r, i) => {
    const a = t[i ? Fo(e) : e];
    if (a)
      for (let t = 0; t < a.length; t++) {
        const n = a[t];
        n.info.lastRun === Vr ||
          (i && !Tr(e, n.trigger)) ||
          ((n.info.lastRun = Vr), jr(n.info, o, r));
      }
  };
function $r(e, t, o, r, i) {
  let a = Yr(e, t, o, r, i);
  if (a === kr) return !1;
  let n = i.methodInfo;
  return e.__dataHasAccessor && e.__dataHasAccessor[n]
    ? e._setPendingProperty(n, a, !0)
    : ((e[n] = a), !1);
}
function Fr(e, t, o, r, i, a, n) {
  o.bindings = o.bindings || [];
  let s = {
    kind: r,
    target: i,
    parts: a,
    literal: n,
    isCompound: 1 !== a.length,
  };
  if (
    (o.bindings.push(s),
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
    let { event: e, negate: t } = s.parts[0];
    (s.listenerEvent = e || tr(i) + "-changed"), (s.listenerNegate = t);
  }
  let l = t.nodeInfoList.length;
  for (let o = 0; o < s.parts.length; o++) {
    let r = s.parts[o];
    (r.compoundIndex = o), Ur(e, t, s, r, l);
  }
}
function Ur(e, t, o, r, i) {
  if (!r.literal)
    if ("attribute" === o.kind && "-" === o.target[0])
      console.warn(
        "Cannot set attribute " +
          o.target +
          ' because "-" is not a valid attribute starting character'
      );
    else {
      let a = r.dependencies,
        n = { index: i, binding: o, part: r, evaluator: e };
      for (let o = 0; o < a.length; o++) {
        let r = a[o];
        "string" == typeof r && ((r = ei(r)), (r.wildcard = !0)),
          e._addTemplatePropertyEffect(t, r.rootProperty, {
            fn: Zr,
            info: n,
            trigger: r,
          });
      }
    }
}
function Zr(e, t, o, r, i, a, n) {
  let s = n[i.index],
    l = i.binding,
    d = i.part;
  if (
    a &&
    d.source &&
    t.length > d.source.length &&
    "property" == l.kind &&
    !l.isCompound &&
    s.__isPropertyEffectsClient &&
    s.__dataHasAccessor &&
    s.__dataHasAccessor[l.target]
  ) {
    let r = o[t];
    (t = Go(d.source, l.target, t)),
      s._setPendingPropertyOrPath(t, r, !1, !0) && e._enqueueClient(s);
  } else {
    let n = i.evaluator._evaluateBinding(e, d, t, o, r, a);
    n !== kr &&
      (function (e, t, o, r, i) {
        (i = (function (e, t, o, r) {
          if (o.isCompound) {
            let i = e.__dataCompoundStorage[o.target];
            (i[r.compoundIndex] = t), (t = i.join(""));
          }
          "attribute" !== o.kind &&
            (("textContent" !== o.target &&
              ("value" !== o.target ||
                ("input" !== e.localName && "textarea" !== e.localName))) ||
              (t = null == t ? "" : t));
          return t;
        })(t, i, o, r)),
          ho && (i = ho(i, o.target, o.kind, t));
        if ("attribute" == o.kind) e._valueToNodeAttribute(t, i, o.target);
        else {
          let r = o.target;
          t.__isPropertyEffectsClient &&
          t.__dataHasAccessor &&
          t.__dataHasAccessor[r]
            ? (t[Mr.READ_ONLY] && t[Mr.READ_ONLY][r]) ||
              (t._setPendingProperty(r, i) && e._enqueueClient(t))
            : e._setUnmanagedPropertyToNode(t, r, i);
        }
      })(e, s, l, d, n);
  }
}
function Gr(e, t) {
  if (t.isCompound) {
    let o = e.__dataCompoundStorage || (e.__dataCompoundStorage = {}),
      r = t.parts,
      i = new Array(r.length);
    for (let e = 0; e < r.length; e++) i[e] = r[e].literal;
    let a = t.target;
    (o[a] = i),
      t.literal &&
        "property" == t.kind &&
        ("className" === a && (e = Bo(e)), (e[a] = t.literal));
  }
}
function qr(e, t, o) {
  if (o.listenerEvent) {
    let r = o.parts[0];
    e.addEventListener(o.listenerEvent, function (e) {
      !(function (e, t, o, r, i) {
        let a,
          n = e.detail,
          s = n && n.path;
        s ? ((r = Go(o, r, s)), (a = n && n.value)) : (a = e.currentTarget[o]),
          (a = i ? !a : a),
          (t[Mr.READ_ONLY] && t[Mr.READ_ONLY][r]) ||
            !t._setPendingPropertyOrPath(r, a, !0, Boolean(s)) ||
            (n && n.queueProperty) ||
            t._invalidateProperties();
      })(e, t, o.target, r.source, r.negate);
    });
  }
}
function Kr(e, t, o, r, i, a) {
  a = t.static || (a && ("object" != typeof a || a[t.methodName]));
  let n = {
    methodName: t.methodName,
    args: t.args,
    methodInfo: i,
    dynamicFn: a,
  };
  for (let i, a = 0; a < t.args.length && (i = t.args[a]); a++)
    i.literal ||
      e._addPropertyEffect(i.rootProperty, o, { fn: r, info: n, trigger: i });
  return a && e._addPropertyEffect(t.methodName, o, { fn: r, info: n }), n;
}
function Yr(e, t, o, r, i) {
  let a = e._methodHost || e,
    n = a[i.methodName];
  if (n) {
    let r = e._marshalArgs(i.args, t, o);
    return r === kr ? kr : n.apply(a, r);
  }
  i.dynamicFn || console.warn("method `" + i.methodName + "` not defined");
}
const Xr = [],
  Jr = new RegExp(
    "(\\[\\[|{{)\\s*(?:(!)\\s*)?((?:[a-zA-Z_$][\\w.:$\\-*]*)\\s*(?:\\(\\s*(?:(?:(?:((?:[a-zA-Z_$][\\w.:$\\-*]*)|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)(?:,\\s*(?:((?:[a-zA-Z_$][\\w.:$\\-*]*)|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*))*)?)\\)\\s*)?)(?:]]|}})",
    "g"
  );
function Wr(e) {
  let t = "";
  for (let o = 0; o < e.length; o++) {
    t += e[o].literal || "";
  }
  return t;
}
function Qr(e) {
  let t = e.match(/([^\s]+?)\(([\s\S]*)\)/);
  if (t) {
    let e = { methodName: t[1], static: !0, args: Xr };
    if (t[2].trim()) {
      return (function (e, t) {
        return (
          (t.args = e.map(function (e) {
            let o = ei(e);
            return o.literal || (t.static = !1), o;
          }, this)),
          t
        );
      })(t[2].replace(/\\,/g, "&comma;").split(","), e);
    }
    return e;
  }
  return null;
}
function ei(e) {
  let t = e
      .trim()
      .replace(/&comma;/g, ",")
      .replace(/\\(.)/g, "$1"),
    o = { name: t, value: "", literal: !1 },
    r = t[0];
  switch (("-" === r && (r = t[1]), r >= "0" && r <= "9" && (r = "#"), r)) {
    case "'":
    case '"':
      (o.value = t.slice(1, -1)), (o.literal = !0);
      break;
    case "#":
      (o.value = Number(t)), (o.literal = !0);
  }
  return (
    o.literal ||
      ((o.rootProperty = Fo(t)),
      (o.structured = $o(t)),
      o.structured &&
        ((o.wildcard = ".*" == t.slice(-2)),
        o.wildcard && (o.name = t.slice(0, -2)))),
    o
  );
}
function ti(e, t, o) {
  let r = Yo(e, o);
  return void 0 === r && (r = t[o]), r;
}
function oi(e, t, o, r) {
  const i = { indexSplices: r };
  vo && !e._overrideLegacyUndefined && (t.splices = i),
    e.notifyPath(o + ".splices", i),
    e.notifyPath(o + ".length", t.length),
    vo && !e._overrideLegacyUndefined && (i.indexSplices = []);
}
function ri(e, t, o, r, i, a) {
  oi(e, t, o, [
    { index: r, addedCount: i, removed: a, object: t, type: "splice" },
  ]);
}
const ii = Mo((e) => {
    const t = Lr(_r(e));
    return class extends t {
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
        return Mr;
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
        if (ai.length) {
          let e = ai[ai.length - 1];
          e._enqueueClient(this), (this.__dataHost = e);
        }
      }
      _initializeProtoProperties(e) {
        (this.__data = Object.create(e)),
          (this.__dataPending = Object.create(e)),
          (this.__dataOld = {});
      }
      _initializeInstanceProperties(e) {
        let t = this[Mr.READ_ONLY];
        for (let o in e)
          (t && t[o]) ||
            ((this.__dataPending = this.__dataPending || {}),
            (this.__dataOld = this.__dataOld || {}),
            (this.__data[o] = this.__dataPending[o] = e[o]));
      }
      _addPropertyEffect(e, t, o) {
        this._createPropertyAccessor(e, t == Mr.READ_ONLY);
        let r = Sr(this, t, !0)[e];
        r || (r = this[t][e] = []), r.push(o);
      }
      _removePropertyEffect(e, t, o) {
        let r = Sr(this, t, !0)[e],
          i = r.indexOf(o);
        i >= 0 && r.splice(i, 1);
      }
      _hasPropertyEffect(e, t) {
        let o = this[t];
        return Boolean(o && o[e]);
      }
      _hasReadOnlyEffect(e) {
        return this._hasPropertyEffect(e, Mr.READ_ONLY);
      }
      _hasNotifyEffect(e) {
        return this._hasPropertyEffect(e, Mr.NOTIFY);
      }
      _hasReflectEffect(e) {
        return this._hasPropertyEffect(e, Mr.REFLECT);
      }
      _hasComputedEffect(e) {
        return this._hasPropertyEffect(e, Mr.COMPUTE);
      }
      _setPendingPropertyOrPath(e, t, o, r) {
        if (r || Fo(Array.isArray(e) ? e[0] : e) !== e) {
          if (!r) {
            let o = Yo(this, e);
            if (!(e = Xo(this, e, t)) || !super._shouldPropertyChange(e, t, o))
              return !1;
          }
          if (((this.__dataHasPaths = !0), this._setPendingProperty(e, t, o)))
            return (
              (function (e, t, o) {
                let r = e.__dataLinkedPaths;
                if (r) {
                  let i;
                  for (let a in r) {
                    let n = r[a];
                    Zo(a, t)
                      ? ((i = Go(a, n, t)),
                        e._setPendingPropertyOrPath(i, o, !0, !0))
                      : Zo(n, t) &&
                        ((i = Go(n, a, t)),
                        e._setPendingPropertyOrPath(i, o, !0, !0));
                  }
                }
              })(this, e, t),
              !0
            );
        } else {
          if (this.__dataHasAccessor && this.__dataHasAccessor[e])
            return this._setPendingProperty(e, t, o);
          this[e] = t;
        }
        return !1;
      }
      _setUnmanagedPropertyToNode(e, t, o) {
        (o === e[t] && "object" != typeof o) ||
          ("className" === t && (e = Bo(e)), (e[t] = o));
      }
      _setPendingProperty(e, t, o) {
        let r = this.__dataHasPaths && $o(e),
          i = r ? this.__dataTemp : this.__data;
        return (
          !!this._shouldPropertyChange(e, t, i[e]) &&
          (this.__dataPending ||
            ((this.__dataPending = {}), (this.__dataOld = {})),
          e in this.__dataOld || (this.__dataOld[e] = this.__data[e]),
          r ? (this.__dataTemp[e] = t) : (this.__data[e] = t),
          (this.__dataPending[e] = t),
          (r || (this[Mr.NOTIFY] && this[Mr.NOTIFY][e])) &&
            ((this.__dataToNotify = this.__dataToNotify || {}),
            (this.__dataToNotify[e] = o)),
          !0)
        );
      }
      _setProperty(e, t) {
        this._setPendingProperty(e, t, !0) && this._invalidateProperties();
      }
      _invalidateProperties() {
        this.__dataReady && this._flushProperties();
      }
      _enqueueClient(e) {
        (this.__dataPendingClients = this.__dataPendingClients || []),
          e !== this && this.__dataPendingClients.push(e);
      }
      _flushClients() {
        this.__dataClientsReady
          ? this.__enableOrFlushClients()
          : ((this.__dataClientsReady = !0),
            this._readyClients(),
            (this.__dataReady = !0));
      }
      __enableOrFlushClients() {
        let e = this.__dataPendingClients;
        if (e) {
          this.__dataPendingClients = null;
          for (let t = 0; t < e.length; t++) {
            let o = e[t];
            o.__dataEnabled
              ? o.__dataPending && o._flushProperties()
              : o._enableProperties();
          }
        }
      }
      _readyClients() {
        this.__enableOrFlushClients();
      }
      setProperties(e, t) {
        for (let o in e)
          (!t && this[Mr.READ_ONLY] && this[Mr.READ_ONLY][o]) ||
            this._setPendingPropertyOrPath(o, e[o], !0);
        this._invalidateProperties();
      }
      ready() {
        this._flushProperties(),
          this.__dataClientsReady || this._flushClients(),
          this.__dataPending && this._flushProperties();
      }
      _propertiesChanged(e, t, o) {
        let r,
          i = this.__dataHasPaths;
        (this.__dataHasPaths = !1),
          Dr(this, t, o, i),
          (r = this.__dataToNotify),
          (this.__dataToNotify = null),
          this._propagatePropertyChanges(t, o, i),
          this._flushClients(),
          Er(this, this[Mr.REFLECT], t, o, i),
          Er(this, this[Mr.OBSERVE], t, o, i),
          r &&
            (function (e, t, o, r, i) {
              let a,
                n,
                s = e[Mr.NOTIFY],
                l = Vr++;
              for (let n in t)
                t[n] &&
                  ((s && Pr(e, s, l, n, o, r, i)) || (i && Nr(e, n, o))) &&
                  (a = !0);
              a &&
                (n = e.__dataHost) &&
                n._invalidateProperties &&
                n._invalidateProperties();
            })(this, r, t, o, i),
          1 == this.__dataCounter && (this.__dataTemp = {});
      }
      _propagatePropertyChanges(e, t, o) {
        this[Mr.PROPAGATE] && Er(this, this[Mr.PROPAGATE], e, t, o),
          this.__templateInfo &&
            this._runEffectsForTemplate(this.__templateInfo, e, t, o);
      }
      _runEffectsForTemplate(e, t, o, r) {
        const i = (t, r) => {
          Er(this, e.propertyEffects, t, o, r, e.nodeList);
          for (let i = e.firstChild; i; i = i.nextSibling)
            this._runEffectsForTemplate(i, t, o, r);
        };
        e.runEffects ? e.runEffects(i, t, r) : i(t, r);
      }
      linkPaths(e, t) {
        (e = qo(e)),
          (t = qo(t)),
          (this.__dataLinkedPaths = this.__dataLinkedPaths || {}),
          (this.__dataLinkedPaths[e] = t);
      }
      unlinkPaths(e) {
        (e = qo(e)), this.__dataLinkedPaths && delete this.__dataLinkedPaths[e];
      }
      notifySplices(e, t) {
        let o = { path: "" };
        oi(this, Yo(this, e, o), o.path, t);
      }
      get(e, t) {
        return Yo(t || this, e);
      }
      set(e, t, o) {
        o
          ? Xo(o, e, t)
          : (this[Mr.READ_ONLY] && this[Mr.READ_ONLY][e]) ||
            (this._setPendingPropertyOrPath(e, t, !0) &&
              this._invalidateProperties());
      }
      push(e, ...t) {
        let o = { path: "" },
          r = Yo(this, e, o),
          i = r.length,
          a = r.push(...t);
        return t.length && ri(this, r, o.path, i, t.length, []), a;
      }
      pop(e) {
        let t = { path: "" },
          o = Yo(this, e, t),
          r = Boolean(o.length),
          i = o.pop();
        return r && ri(this, o, t.path, o.length, 0, [i]), i;
      }
      splice(e, t, o, ...r) {
        let i,
          a = { path: "" },
          n = Yo(this, e, a);
        return (
          t < 0 ? (t = n.length - Math.floor(-t)) : t && (t = Math.floor(t)),
          (i = 2 === arguments.length ? n.splice(t) : n.splice(t, o, ...r)),
          (r.length || i.length) && ri(this, n, a.path, t, r.length, i),
          i
        );
      }
      shift(e) {
        let t = { path: "" },
          o = Yo(this, e, t),
          r = Boolean(o.length),
          i = o.shift();
        return r && ri(this, o, t.path, 0, 0, [i]), i;
      }
      unshift(e, ...t) {
        let o = { path: "" },
          r = Yo(this, e, o),
          i = r.unshift(...t);
        return t.length && ri(this, r, o.path, 0, t.length, []), i;
      }
      notifyPath(e, t) {
        let o;
        if (1 == arguments.length) {
          let r = { path: "" };
          (t = Yo(this, e, r)), (o = r.path);
        } else o = Array.isArray(e) ? qo(e) : e;
        this._setPendingPropertyOrPath(o, t, !0, !0) &&
          this._invalidateProperties();
      }
      _createReadOnlyProperty(e, t) {
        var o;
        this._addPropertyEffect(e, Mr.READ_ONLY),
          t &&
            (this["_set" + ((o = e), o[0].toUpperCase() + o.substring(1))] =
              function (t) {
                this._setProperty(e, t);
              });
      }
      _createPropertyObserver(e, t, o) {
        let r = { property: e, method: t, dynamicFn: Boolean(o) };
        this._addPropertyEffect(e, Mr.OBSERVE, {
          fn: Or,
          info: r,
          trigger: { name: e },
        }),
          o &&
            this._addPropertyEffect(t, Mr.OBSERVE, {
              fn: Or,
              info: r,
              trigger: { name: t },
            });
      }
      _createMethodObserver(e, t) {
        let o = Qr(e);
        if (!o) throw new Error("Malformed observer expression '" + e + "'");
        Kr(this, o, Mr.OBSERVE, Yr, null, t);
      }
      _createNotifyingProperty(e) {
        this._addPropertyEffect(e, Mr.NOTIFY, {
          fn: zr,
          info: { eventName: tr(e) + "-changed", property: e },
        });
      }
      _createReflectedProperty(e) {
        let t = this.constructor.attributeNameForProperty(e);
        "-" === t[0]
          ? console.warn(
              "Property " +
                e +
                " cannot be reflected to attribute " +
                t +
                ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'
            )
          : this._addPropertyEffect(e, Mr.REFLECT, {
              fn: Ir,
              info: { attrName: t },
            });
      }
      _createComputedProperty(e, t, o) {
        let r = Qr(t);
        if (!r) throw new Error("Malformed computed expression '" + t + "'");
        const i = Kr(this, r, Mr.COMPUTE, $r, e, o);
        Sr(this, "__computeInfo")[e] = i;
      }
      _marshalArgs(e, t, o) {
        const r = this.__data,
          i = [];
        for (let a = 0, n = e.length; a < n; a++) {
          let {
            name: n,
            structured: s,
            wildcard: l,
            value: d,
            literal: c,
          } = e[a];
          if (!c)
            if (l) {
              const e = Zo(n, t),
                i = ti(r, o, e ? t : n);
              d = { path: e ? t : n, value: i, base: e ? Yo(r, n) : i };
            } else d = s ? ti(r, o, n) : r[n];
          if (
            vo &&
            !this._overrideLegacyUndefined &&
            void 0 === d &&
            e.length > 1
          )
            return kr;
          i[a] = d;
        }
        return i;
      }
      static addPropertyEffect(e, t, o) {
        this.prototype._addPropertyEffect(e, t, o);
      }
      static createPropertyObserver(e, t, o) {
        this.prototype._createPropertyObserver(e, t, o);
      }
      static createMethodObserver(e, t) {
        this.prototype._createMethodObserver(e, t);
      }
      static createNotifyingProperty(e) {
        this.prototype._createNotifyingProperty(e);
      }
      static createReadOnlyProperty(e, t) {
        this.prototype._createReadOnlyProperty(e, t);
      }
      static createReflectedProperty(e) {
        this.prototype._createReflectedProperty(e);
      }
      static createComputedProperty(e, t, o) {
        this.prototype._createComputedProperty(e, t, o);
      }
      static bindTemplate(e) {
        return this.prototype._bindTemplate(e);
      }
      _bindTemplate(e, t) {
        let o = this.constructor._parseTemplate(e),
          r = this.__preBoundTemplateInfo == o;
        if (!r)
          for (let e in o.propertyEffects) this._createPropertyAccessor(e);
        if (t)
          if (
            ((o = Object.create(o)), (o.wasPreBound = r), this.__templateInfo)
          ) {
            const t = e._parentTemplateInfo || this.__templateInfo,
              r = t.lastChild;
            (o.parent = t),
              (t.lastChild = o),
              (o.previousSibling = r),
              r ? (r.nextSibling = o) : (t.firstChild = o);
          } else this.__templateInfo = o;
        else this.__preBoundTemplateInfo = o;
        return o;
      }
      static _addTemplatePropertyEffect(e, t, o) {
        (e.hostProps = e.hostProps || {})[t] = !0;
        let r = (e.propertyEffects = e.propertyEffects || {});
        (r[t] = r[t] || []).push(o);
      }
      _stampTemplate(e, t) {
        (t = t || this._bindTemplate(e, !0)), ai.push(this);
        let o = super._stampTemplate(e, t);
        if ((ai.pop(), (t.nodeList = o.nodeList), !t.wasPreBound)) {
          let e = (t.childNodes = []);
          for (let t = o.firstChild; t; t = t.nextSibling) e.push(t);
        }
        return (
          (o.templateInfo = t),
          (function (e, t) {
            let { nodeList: o, nodeInfoList: r } = t;
            if (r.length)
              for (let t = 0; t < r.length; t++) {
                let i = r[t],
                  a = o[t],
                  n = i.bindings;
                if (n)
                  for (let t = 0; t < n.length; t++) {
                    let o = n[t];
                    Gr(a, o), qr(a, e, o);
                  }
                a.__dataHost = e;
              }
          })(this, t),
          this.__dataClientsReady &&
            (this._runEffectsForTemplate(t, this.__data, null, !1),
            this._flushClients()),
          o
        );
      }
      _removeBoundDom(e) {
        const t = e.templateInfo,
          { previousSibling: o, nextSibling: r, parent: i } = t;
        o ? (o.nextSibling = r) : i && (i.firstChild = r),
          r ? (r.previousSibling = o) : i && (i.lastChild = o),
          (t.nextSibling = t.previousSibling = null);
        let a = t.childNodes;
        for (let e = 0; e < a.length; e++) {
          let t = a[e];
          Bo(Bo(t).parentNode).removeChild(t);
        }
      }
      static _parseTemplateNode(e, o, r) {
        let i = t._parseTemplateNode.call(this, e, o, r);
        if (e.nodeType === Node.TEXT_NODE) {
          let t = this._parseBindings(e.textContent, o);
          t &&
            ((e.textContent = Wr(t) || " "),
            Fr(this, o, r, "text", "textContent", t),
            (i = !0));
        }
        return i;
      }
      static _parseTemplateNodeAttribute(e, o, r, i, a) {
        let n = this._parseBindings(a, o);
        if (n) {
          let t = i,
            a = "property";
          xr.test(i)
            ? (a = "attribute")
            : "$" == i[i.length - 1] &&
              ((i = i.slice(0, -1)), (a = "attribute"));
          let s = Wr(n);
          return (
            s &&
              "attribute" == a &&
              ("class" == i &&
                e.hasAttribute("class") &&
                (s += " " + e.getAttribute(i)),
              e.setAttribute(i, s)),
            "attribute" == a &&
              "disable-upgrade$" == t &&
              e.setAttribute(i, ""),
            "input" === e.localName && "value" === t && e.setAttribute(t, ""),
            e.removeAttribute(t),
            "property" === a && (i = er(i)),
            Fr(this, o, r, a, i, n, s),
            !0
          );
        }
        return t._parseTemplateNodeAttribute.call(this, e, o, r, i, a);
      }
      static _parseTemplateNestedTemplate(e, o, r) {
        let i = t._parseTemplateNestedTemplate.call(this, e, o, r);
        const a = e.parentNode,
          n = r.templateInfo,
          s = "dom-if" === a.localName,
          l = "dom-repeat" === a.localName;
        Ao &&
          (s || l) &&
          (a.removeChild(e),
          ((r = r.parentInfo).templateInfo = n),
          (r.noted = !0),
          (i = !1));
        let d = n.hostProps;
        if (Ho && s)
          d &&
            ((o.hostProps = Object.assign(o.hostProps || {}, d)),
            Ao || (r.parentInfo.noted = !0));
        else {
          let e = "{";
          for (let t in d) {
            Fr(this, o, r, "property", "_host_" + t, [
              { mode: e, source: t, dependencies: [t], hostProp: !0 },
            ]);
          }
        }
        return i;
      }
      static _parseBindings(e, t) {
        let o,
          r = [],
          i = 0;
        for (; null !== (o = Jr.exec(e)); ) {
          o.index > i && r.push({ literal: e.slice(i, o.index) });
          let a = o[1][0],
            n = Boolean(o[2]),
            s = o[3].trim(),
            l = !1,
            d = "",
            c = -1;
          "{" == a &&
            (c = s.indexOf("::")) > 0 &&
            ((d = s.substring(c + 2)), (s = s.substring(0, c)), (l = !0));
          let p = Qr(s),
            u = [];
          if (p) {
            let { args: e, methodName: o } = p;
            for (let t = 0; t < e.length; t++) {
              let o = e[t];
              o.literal || u.push(o);
            }
            let r = t.dynamicFns;
            ((r && r[o]) || p.static) && (u.push(o), (p.dynamicFn = !0));
          } else u.push(s);
          r.push({
            source: s,
            mode: a,
            negate: n,
            customEvent: l,
            signature: p,
            dependencies: u,
            event: d,
          }),
            (i = Jr.lastIndex);
        }
        if (i && i < e.length) {
          let t = e.substring(i);
          t && r.push({ literal: t });
        }
        return r.length ? r : null;
      }
      static _evaluateBinding(e, t, o, r, i, a) {
        let n;
        return (
          (n = t.signature
            ? Yr(e, o, r, 0, t.signature)
            : o != t.source
            ? Yo(e, t.source)
            : a && $o(o)
            ? Yo(e, o)
            : e.__data[o]),
          t.negate && (n = !n),
          n
        );
      }
    };
  }),
  ai = [];
const ni = Mo((e) => {
    const t = ur(e);
    function o(e) {
      const t = Object.getPrototypeOf(e);
      return t.prototype instanceof i ? t : null;
    }
    function r(e) {
      if (!e.hasOwnProperty(JSCompiler_renameProperty("__ownProperties", e))) {
        let t = null;
        if (e.hasOwnProperty(JSCompiler_renameProperty("properties", e))) {
          const o = e.properties;
          o &&
            (t = (function (e) {
              const t = {};
              for (let o in e) {
                const r = e[o];
                t[o] = "function" == typeof r ? { type: r } : r;
              }
              return t;
            })(o));
        }
        e.__ownProperties = t;
      }
      return e.__ownProperties;
    }
    class i extends t {
      static get observedAttributes() {
        if (
          !this.hasOwnProperty(
            JSCompiler_renameProperty("__observedAttributes", this)
          )
        ) {
          this.prototype;
          const e = this._properties;
          this.__observedAttributes = e
            ? Object.keys(e).map((e) =>
                this.prototype._addPropertyToAttributeMap(e)
              )
            : [];
        }
        return this.__observedAttributes;
      }
      static finalize() {
        if (
          !this.hasOwnProperty(JSCompiler_renameProperty("__finalized", this))
        ) {
          const e = o(this);
          e && e.finalize(), (this.__finalized = !0), this._finalizeClass();
        }
      }
      static _finalizeClass() {
        const e = r(this);
        e && this.createProperties(e);
      }
      static get _properties() {
        if (
          !this.hasOwnProperty(JSCompiler_renameProperty("__properties", this))
        ) {
          const e = o(this);
          this.__properties = Object.assign({}, e && e._properties, r(this));
        }
        return this.__properties;
      }
      static typeForProperty(e) {
        const t = this._properties[e];
        return t && t.type;
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
    return i;
  }),
  si = window.ShadyCSS && window.ShadyCSS.cssBuild,
  li = Mo((e) => {
    const t = ni(ii(e));
    function o(e, t, o, r) {
      o.computed && (o.readOnly = !0),
        o.computed &&
          (e._hasReadOnlyEffect(t)
            ? console.warn(`Cannot redefine computed property '${t}'.`)
            : e._createComputedProperty(t, o.computed, r)),
        o.readOnly && !e._hasReadOnlyEffect(t)
          ? e._createReadOnlyProperty(t, !o.computed)
          : !1 === o.readOnly &&
            e._hasReadOnlyEffect(t) &&
            console.warn(`Cannot make readOnly property '${t}' non-readOnly.`),
        o.reflectToAttribute && !e._hasReflectEffect(t)
          ? e._createReflectedProperty(t)
          : !1 === o.reflectToAttribute &&
            e._hasReflectEffect(t) &&
            console.warn(
              `Cannot make reflected property '${t}' non-reflected.`
            ),
        o.notify && !e._hasNotifyEffect(t)
          ? e._createNotifyingProperty(t)
          : !1 === o.notify &&
            e._hasNotifyEffect(t) &&
            console.warn(`Cannot make notify property '${t}' non-notify.`),
        o.observer && e._createPropertyObserver(t, o.observer, r[o.observer]),
        e._addPropertyToAttributeMap(t);
    }
    function r(e, t, o, r) {
      if (!si) {
        const i = t.content.querySelectorAll("style"),
          a = Io(t),
          n = (function (e) {
            let t = Oo(e);
            return t ? Do(t) : [];
          })(o),
          s = t.content.firstElementChild;
        for (let o = 0; o < n.length; o++) {
          let i = n[o];
          (i.textContent = e._processStyleText(i.textContent, r)),
            t.content.insertBefore(i, s);
        }
        let l = 0;
        for (let t = 0; t < a.length; t++) {
          let o = a[t],
            n = i[l];
          n !== o
            ? ((o = o.cloneNode(!0)), n.parentNode.insertBefore(o, n))
            : l++,
            (o.textContent = e._processStyleText(o.textContent, r));
        }
      }
      if (
        (window.ShadyCSS && window.ShadyCSS.prepareTemplate(t, o),
        Vo && si && po)
      ) {
        const o = t.content.querySelectorAll("style");
        if (o) {
          let t = "";
          Array.from(o).forEach((e) => {
            (t += e.textContent), e.parentNode.removeChild(e);
          }),
            (e._styleSheet = new CSSStyleSheet()),
            e._styleSheet.replaceSync(t);
        }
      }
    }
    return class extends t {
      static get polymerElementVersion() {
        return "3.4.1";
      }
      static _finalizeClass() {
        t._finalizeClass.call(this);
        const e =
          ((o = this).hasOwnProperty(
            JSCompiler_renameProperty("__ownObservers", o)
          ) ||
            (o.__ownObservers = o.hasOwnProperty(
              JSCompiler_renameProperty("observers", o)
            )
              ? o.observers
              : null),
          o.__ownObservers);
        var o;
        e && this.createObservers(e, this._properties), this._prepareTemplate();
      }
      static _prepareTemplate() {
        let e = this.template;
        e &&
          ("string" == typeof e
            ? (console.error("template getter must return HTMLTemplateElement"),
              (e = null))
            : go || (e = e.cloneNode(!0))),
          (this.prototype._template = e);
      }
      static createProperties(e) {
        for (let t in e) o(this.prototype, t, e[t], e);
      }
      static createObservers(e, t) {
        const o = this.prototype;
        for (let r = 0; r < e.length; r++) o._createMethodObserver(e[r], t);
      }
      static get template() {
        if (
          !this.hasOwnProperty(JSCompiler_renameProperty("_template", this))
        ) {
          const e = this.prototype.hasOwnProperty(
            JSCompiler_renameProperty("_template", this.prototype)
          )
            ? this.prototype._template
            : void 0;
          this._template =
            void 0 !== e
              ? e
              : (this.hasOwnProperty(JSCompiler_renameProperty("is", this)) &&
                  (function (e) {
                    let t = null;
                    if (
                      e &&
                      (!_o || fo) &&
                      ((t = To.import(e, "template")), _o && !t)
                    )
                      throw new Error(
                        `strictTemplatePolicy: expecting dom-module or null template for ${e}`
                      );
                    return t;
                  })(this.is)) ||
                Object.getPrototypeOf(this.prototype).constructor.template;
        }
        return this._template;
      }
      static set template(e) {
        this._template = e;
      }
      static get importPath() {
        if (
          !this.hasOwnProperty(JSCompiler_renameProperty("_importPath", this))
        ) {
          const e = this.importMeta;
          if (e) this._importPath = lo(e.url);
          else {
            const e = To.import(this.is);
            this._importPath =
              (e && e.assetpath) ||
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
          (this.rootPath = uo),
          (this.importPath = this.constructor.importPath);
        let e = (function (e) {
          if (
            !e.hasOwnProperty(
              JSCompiler_renameProperty("__propertyDefaults", e)
            )
          ) {
            e.__propertyDefaults = null;
            let t = e._properties;
            for (let o in t) {
              let r = t[o];
              "value" in r &&
                ((e.__propertyDefaults = e.__propertyDefaults || {}),
                (e.__propertyDefaults[o] = r));
            }
          }
          return e.__propertyDefaults;
        })(this.constructor);
        if (e)
          for (let t in e) {
            let o = e[t];
            if (this._canApplyPropertyDefault(t)) {
              let e =
                "function" == typeof o.value ? o.value.call(this) : o.value;
              this._hasAccessor(t)
                ? this._setPendingProperty(t, e, !0)
                : (this[t] = e);
            }
          }
      }
      _canApplyPropertyDefault(e) {
        return !this.hasOwnProperty(e);
      }
      static _processStyleText(e, t) {
        return so(e, t);
      }
      static _finalizeTemplate(e) {
        const t = this.prototype._template;
        if (t && !t.__polymerFinalized) {
          t.__polymerFinalized = !0;
          const o = this.importPath;
          r(this, t, e, o ? no(o) : ""), this.prototype._bindTemplate(t);
        }
      }
      connectedCallback() {
        window.ShadyCSS && this._template && window.ShadyCSS.styleElement(this),
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
      _attachDom(e) {
        const t = Bo(this);
        if (t.attachShadow)
          return e
            ? (t.shadowRoot ||
                (t.attachShadow({ mode: "open", shadyUpgradeFragment: e }),
                t.shadowRoot.appendChild(e),
                this.constructor._styleSheet &&
                  (t.shadowRoot.adoptedStyleSheets = [
                    this.constructor._styleSheet,
                  ])),
              bo &&
                window.ShadyDOM &&
                window.ShadyDOM.flushInitial(t.shadowRoot),
              t.shadowRoot)
            : null;
        throw new Error(
          "ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`."
        );
      }
      updateStyles(e) {
        window.ShadyCSS && window.ShadyCSS.styleSubtree(this, e);
      }
      resolveUrl(e, t) {
        return !t && this.importPath && (t = no(this.importPath)), no(e, t);
      }
      static _parseTemplateContent(e, o, r) {
        return (
          (o.dynamicFns = o.dynamicFns || this._properties),
          t._parseTemplateContent.call(this, e, o, r)
        );
      }
      static _addTemplatePropertyEffect(e, o, r) {
        return (
          !yo ||
            o in this._properties ||
            (r.info.part.signature && r.info.part.signature.static) ||
            r.info.part.hostProp ||
            e.nestedTemplate ||
            console.warn(
              `Property '${o}' used in template but not declared in 'properties'; attribute will not be observed.`
            ),
          t._addTemplatePropertyEffect.call(this, e, o, r)
        );
      }
    };
  });
class di {
  constructor() {
    (this._asyncModule = null), (this._callback = null), (this._timer = null);
  }
  setConfig(e, t) {
    (this._asyncModule = e),
      (this._callback = t),
      (this._timer = this._asyncModule.run(() => {
        (this._timer = null), ci.delete(this), this._callback();
      }));
  }
  cancel() {
    this.isActive() && (this._cancelAsync(), ci.delete(this));
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
  static debounce(e, t, o) {
    return (
      e instanceof di ? e._cancelAsync() : (e = new di()), e.setConfig(t, o), e
    );
  }
}
let ci = new Set();
const pi = function (e) {
    ci.add(e);
  },
  ui = function () {
    const e = Boolean(ci.size);
    return (
      ci.forEach((e) => {
        try {
          e.flush();
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      }),
      e
    );
  };
let hi = "string" == typeof document.head.style.touchAction,
  mi = "__polymerGestures",
  _i = "__polymerGesturesHandled",
  fi = "__polymerGesturesTouchAction",
  gi = ["mousedown", "mousemove", "mouseup", "click"],
  yi = [0, 1, 4, 2],
  bi = (function () {
    try {
      return 1 === new MouseEvent("test", { buttons: 1 }).buttons;
    } catch (e) {
      return !1;
    }
  })();
function vi(e) {
  return gi.indexOf(e) > -1;
}
let Ci = !1;
function Ai(e) {
  if (!vi(e) && "touchend" !== e)
    return hi && Ci && mo ? { passive: !0 } : void 0;
}
!(function () {
  try {
    let e = Object.defineProperty({}, "passive", {
      get() {
        Ci = !0;
      },
    });
    window.addEventListener("test", null, e),
      window.removeEventListener("test", null, e);
  } catch (e) {}
})();
let Hi = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);
const wi = [],
  Li = {
    button: !0,
    input: !0,
    keygen: !0,
    meter: !0,
    output: !0,
    textarea: !0,
    progress: !0,
    select: !0,
  },
  Vi = {
    button: !0,
    command: !0,
    fieldset: !0,
    input: !0,
    keygen: !0,
    optgroup: !0,
    option: !0,
    select: !0,
    textarea: !0,
  };
function ki(e) {
  let t = Array.prototype.slice.call(e.labels || []);
  if (!t.length) {
    t = [];
    let o = e.getRootNode();
    if (e.id) {
      let r = o.querySelectorAll(`label[for = ${e.id}]`);
      for (let e = 0; e < r.length; e++) t.push(r[e]);
    }
  }
  return t;
}
let Mi = function (e) {
  let t = e.sourceCapabilities;
  var o;
  if (
    (!t || t.firesTouchEvents) &&
    ((e[_i] = { skip: !0 }), "click" === e.type)
  ) {
    let t = !1,
      r = Oi(e);
    for (let e = 0; e < r.length; e++) {
      if (r[e].nodeType === Node.ELEMENT_NODE)
        if ("label" === r[e].localName) wi.push(r[e]);
        else if (((o = r[e]), Li[o.localName])) {
          let o = ki(r[e]);
          for (let e = 0; e < o.length; e++) t = t || wi.indexOf(o[e]) > -1;
        }
      if (r[e] === Ei.mouse.target) return;
    }
    if (t) return;
    e.preventDefault(), e.stopPropagation();
  }
};
function xi(e) {
  let t = Hi ? ["click"] : gi;
  for (let o, r = 0; r < t.length; r++)
    (o = t[r]),
      e
        ? ((wi.length = 0), document.addEventListener(o, Mi, !0))
        : document.removeEventListener(o, Mi, !0);
}
function Si(e) {
  let t = e.type;
  if (!vi(t)) return !1;
  if ("mousemove" === t) {
    let t = void 0 === e.buttons ? 1 : e.buttons;
    return (
      e instanceof window.MouseEvent && !bi && (t = yi[e.which] || 0),
      Boolean(1 & t)
    );
  }
  return 0 === (void 0 === e.button ? 0 : e.button);
}
let Ei = {
  mouse: { target: null, mouseIgnoreJob: null },
  touch: { x: 0, y: 0, id: -1, scrollDecided: !1 },
};
function Pi(e, t, o) {
  (e.movefn = t),
    (e.upfn = o),
    document.addEventListener("mousemove", t),
    document.addEventListener("mouseup", o);
}
function Ti(e) {
  document.removeEventListener("mousemove", e.movefn),
    document.removeEventListener("mouseup", e.upfn),
    (e.movefn = null),
    (e.upfn = null);
}
document.addEventListener(
  "touchend",
  function (e) {
    Ei.mouse.mouseIgnoreJob || xi(!0),
      (Ei.mouse.target = Oi(e)[0]),
      (Ei.mouse.mouseIgnoreJob = di.debounce(
        Ei.mouse.mouseIgnoreJob,
        lr.after(2500),
        function () {
          xi(), (Ei.mouse.target = null), (Ei.mouse.mouseIgnoreJob = null);
        }
      ));
  },
  !!Ci && { passive: !0 }
);
const Oi =
    window.ShadyDOM && window.ShadyDOM.noPatch
      ? window.ShadyDOM.composedPath
      : (e) => (e.composedPath && e.composedPath()) || [],
  Ni = {},
  Ri = [];
function zi(e) {
  const t = Oi(e);
  return t.length > 0 ? t[0] : e.target;
}
function Ii(e) {
  let t,
    o = e.type,
    r = e.currentTarget.__polymerGestures;
  if (!r) return;
  let i = r[o];
  if (i) {
    if (!e[_i] && ((e[_i] = {}), "touch" === o.slice(0, 5))) {
      let t = e.changedTouches[0];
      if (
        ("touchstart" === o &&
          1 === e.touches.length &&
          (Ei.touch.id = t.identifier),
        Ei.touch.id !== t.identifier)
      )
        return;
      hi ||
        ("touchstart" !== o && "touchmove" !== o) ||
        (function (e) {
          let t = e.changedTouches[0],
            o = e.type;
          if ("touchstart" === o)
            (Ei.touch.x = t.clientX),
              (Ei.touch.y = t.clientY),
              (Ei.touch.scrollDecided = !1);
          else if ("touchmove" === o) {
            if (Ei.touch.scrollDecided) return;
            Ei.touch.scrollDecided = !0;
            let o = (function (e) {
                let t = "auto",
                  o = Oi(e);
                for (let e, r = 0; r < o.length; r++)
                  if (((e = o[r]), e[fi])) {
                    t = e[fi];
                    break;
                  }
                return t;
              })(e),
              r = !1,
              i = Math.abs(Ei.touch.x - t.clientX),
              a = Math.abs(Ei.touch.y - t.clientY);
            e.cancelable &&
              ("none" === o
                ? (r = !0)
                : "pan-x" === o
                ? (r = a > i)
                : "pan-y" === o && (r = i > a)),
              r ? e.preventDefault() : Ui("track");
          }
        })(e);
    }
    if (((t = e[_i]), !t.skip)) {
      for (let o, r = 0; r < Ri.length; r++)
        (o = Ri[r]),
          i[o.name] &&
            !t[o.name] &&
            o.flow &&
            o.flow.start.indexOf(e.type) > -1 &&
            o.reset &&
            o.reset();
      for (let r, a = 0; a < Ri.length; a++)
        (r = Ri[a]), i[r.name] && !t[r.name] && ((t[r.name] = !0), r[o](e));
    }
  }
}
function Di(e, t, o) {
  return (
    !!Ni[t] &&
    ((function (e, t, o) {
      let r = Ni[t],
        i = r.deps,
        a = r.name,
        n = e[mi];
      n || (e[mi] = n = {});
      for (let t, o, r = 0; r < i.length; r++)
        (t = i[r]),
          (Hi && vi(t) && "click" !== t) ||
            ((o = n[t]),
            o || (n[t] = o = { _count: 0 }),
            0 === o._count && e.addEventListener(t, Ii, Ai(t)),
            (o[a] = (o[a] || 0) + 1),
            (o._count = (o._count || 0) + 1));
      e.addEventListener(t, o), r.touchAction && $i(e, r.touchAction);
    })(e, t, o),
    !0)
  );
}
function ji(e, t, o) {
  return (
    !!Ni[t] &&
    ((function (e, t, o) {
      let r = Ni[t],
        i = r.deps,
        a = r.name,
        n = e[mi];
      if (n)
        for (let t, o, r = 0; r < i.length; r++)
          (t = i[r]),
            (o = n[t]),
            o &&
              o[a] &&
              ((o[a] = (o[a] || 1) - 1),
              (o._count = (o._count || 1) - 1),
              0 === o._count && e.removeEventListener(t, Ii, Ai(t)));
      e.removeEventListener(t, o);
    })(e, t, o),
    !0)
  );
}
function Bi(e) {
  Ri.push(e);
  for (let t = 0; t < e.emits.length; t++) Ni[e.emits[t]] = e;
}
function $i(e, t) {
  hi &&
    e instanceof HTMLElement &&
    cr.run(() => {
      e.style.touchAction = t;
    }),
    (e[fi] = t);
}
function Fi(e, t, o) {
  let r = new Event(t, { bubbles: !0, cancelable: !0, composed: !0 });
  if (((r.detail = o), Bo(e).dispatchEvent(r), r.defaultPrevented)) {
    let e = o.preventer || o.sourceEvent;
    e && e.preventDefault && e.preventDefault();
  }
}
function Ui(e) {
  let t = (function (e) {
    for (let t, o = 0; o < Ri.length; o++) {
      t = Ri[o];
      for (let o, r = 0; r < t.emits.length; r++)
        if (((o = t.emits[r]), o === e)) return t;
    }
    return null;
  })(e);
  t.info && (t.info.prevent = !0);
}
function Zi(e, t, o, r) {
  t &&
    Fi(t, e, {
      x: o.clientX,
      y: o.clientY,
      sourceEvent: o,
      preventer: r,
      prevent: function (e) {
        return Ui(e);
      },
    });
}
function Gi(e, t, o) {
  if (e.prevent) return !1;
  if (e.started) return !0;
  let r = Math.abs(e.x - t),
    i = Math.abs(e.y - o);
  return r >= 5 || i >= 5;
}
function qi(e, t, o) {
  if (!t) return;
  let r,
    i = e.moves[e.moves.length - 2],
    a = e.moves[e.moves.length - 1],
    n = a.x - e.x,
    s = a.y - e.y,
    l = 0;
  i && ((r = a.x - i.x), (l = a.y - i.y)),
    Fi(t, "track", {
      state: e.state,
      x: o.clientX,
      y: o.clientY,
      dx: n,
      dy: s,
      ddx: r,
      ddy: l,
      sourceEvent: o,
      hover: function () {
        return (function (e, t) {
          let o = document.elementFromPoint(e, t),
            r = o;
          for (; r && r.shadowRoot && !window.ShadyDOM; ) {
            let i = r;
            if (((r = r.shadowRoot.elementFromPoint(e, t)), i === r)) break;
            r && (o = r);
          }
          return o;
        })(o.clientX, o.clientY);
      },
    });
}
function Ki(e, t, o) {
  let r = Math.abs(t.clientX - e.x),
    i = Math.abs(t.clientY - e.y),
    a = zi(o || t);
  !a ||
    (Vi[a.localName] && a.hasAttribute("disabled")) ||
    ((isNaN(r) ||
      isNaN(i) ||
      (r <= 25 && i <= 25) ||
      (function (e) {
        if ("click" === e.type) {
          if (0 === e.detail) return !0;
          let t = zi(e);
          if (!t.nodeType || t.nodeType !== Node.ELEMENT_NODE) return !0;
          let o = t.getBoundingClientRect(),
            r = e.pageX,
            i = e.pageY;
          return !(r >= o.left && r <= o.right && i >= o.top && i <= o.bottom);
        }
        return !1;
      })(t)) &&
      (e.prevent ||
        Fi(a, "tap", {
          x: t.clientX,
          y: t.clientY,
          sourceEvent: t,
          preventer: o,
        })));
}
Bi({
  name: "downup",
  deps: ["mousedown", "touchstart", "touchend"],
  flow: { start: ["mousedown", "touchstart"], end: ["mouseup", "touchend"] },
  emits: ["down", "up"],
  info: { movefn: null, upfn: null },
  reset: function () {
    Ti(this.info);
  },
  mousedown: function (e) {
    if (!Si(e)) return;
    let t = zi(e),
      o = this;
    Pi(
      this.info,
      function (e) {
        Si(e) || (Zi("up", t, e), Ti(o.info));
      },
      function (e) {
        Si(e) && Zi("up", t, e), Ti(o.info);
      }
    ),
      Zi("down", t, e);
  },
  touchstart: function (e) {
    Zi("down", zi(e), e.changedTouches[0], e);
  },
  touchend: function (e) {
    Zi("up", zi(e), e.changedTouches[0], e);
  },
}),
  Bi({
    name: "track",
    touchAction: "none",
    deps: ["mousedown", "touchstart", "touchmove", "touchend"],
    flow: { start: ["mousedown", "touchstart"], end: ["mouseup", "touchend"] },
    emits: ["track"],
    info: {
      x: 0,
      y: 0,
      state: "start",
      started: !1,
      moves: [],
      addMove: function (e) {
        this.moves.length > 2 && this.moves.shift(), this.moves.push(e);
      },
      movefn: null,
      upfn: null,
      prevent: !1,
    },
    reset: function () {
      (this.info.state = "start"),
        (this.info.started = !1),
        (this.info.moves = []),
        (this.info.x = 0),
        (this.info.y = 0),
        (this.info.prevent = !1),
        Ti(this.info);
    },
    mousedown: function (e) {
      if (!Si(e)) return;
      let t = zi(e),
        o = this,
        r = function (e) {
          let r = e.clientX,
            i = e.clientY;
          Gi(o.info, r, i) &&
            ((o.info.state = o.info.started
              ? "mouseup" === e.type
                ? "end"
                : "track"
              : "start"),
            "start" === o.info.state && Ui("tap"),
            o.info.addMove({ x: r, y: i }),
            Si(e) || ((o.info.state = "end"), Ti(o.info)),
            t && qi(o.info, t, e),
            (o.info.started = !0));
        };
      Pi(this.info, r, function (e) {
        o.info.started && r(e), Ti(o.info);
      }),
        (this.info.x = e.clientX),
        (this.info.y = e.clientY);
    },
    touchstart: function (e) {
      let t = e.changedTouches[0];
      (this.info.x = t.clientX), (this.info.y = t.clientY);
    },
    touchmove: function (e) {
      let t = zi(e),
        o = e.changedTouches[0],
        r = o.clientX,
        i = o.clientY;
      Gi(this.info, r, i) &&
        ("start" === this.info.state && Ui("tap"),
        this.info.addMove({ x: r, y: i }),
        qi(this.info, t, o),
        (this.info.state = "track"),
        (this.info.started = !0));
    },
    touchend: function (e) {
      let t = zi(e),
        o = e.changedTouches[0];
      this.info.started &&
        ((this.info.state = "end"),
        this.info.addMove({ x: o.clientX, y: o.clientY }),
        qi(this.info, t, o));
    },
  }),
  Bi({
    name: "tap",
    deps: ["mousedown", "click", "touchstart", "touchend"],
    flow: { start: ["mousedown", "touchstart"], end: ["click", "touchend"] },
    emits: ["tap"],
    info: { x: NaN, y: NaN, prevent: !1 },
    reset: function () {
      (this.info.x = NaN), (this.info.y = NaN), (this.info.prevent = !1);
    },
    mousedown: function (e) {
      Si(e) && ((this.info.x = e.clientX), (this.info.y = e.clientY));
    },
    click: function (e) {
      Si(e) && Ki(this.info, e);
    },
    touchstart: function (e) {
      const t = e.changedTouches[0];
      (this.info.x = t.clientX), (this.info.y = t.clientY);
    },
    touchend: function (e) {
      Ki(this.info, e.changedTouches[0], e);
    },
  });
const Yi = Mo(
    (e) =>
      class extends e {
        _addEventListenerToNode(e, t, o) {
          Di(e, t, o) || super._addEventListenerToNode(e, t, o);
        }
        _removeEventListenerFromNode(e, t, o) {
          ji(e, t, o) || super._removeEventListenerFromNode(e, t, o);
        }
      }
  ),
  Xi = /:host\(:dir\((ltr|rtl)\)\)/g,
  Ji = /([\s\w-#\.\[\]\*]*):dir\((ltr|rtl)\)/g,
  Wi = /:dir\((?:ltr|rtl)\)/,
  Qi = Boolean(window.ShadyDOM && window.ShadyDOM.inUse),
  ea = [];
let ta = null,
  oa = "";
function ra() {
  oa = document.documentElement.getAttribute("dir");
}
function ia(e) {
  if (!e.__autoDirOptOut) {
    e.setAttribute("dir", oa);
  }
}
function aa() {
  ra(), (oa = document.documentElement.getAttribute("dir"));
  for (let e = 0; e < ea.length; e++) ia(ea[e]);
}
const na = Mo((e) => {
  Qi ||
    ta ||
    (ra(),
    (ta = new MutationObserver(aa)),
    ta.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["dir"],
    }));
  const t = _r(e);
  class o extends t {
    static _processStyleText(e, o) {
      return (
        (e = t._processStyleText.call(this, e, o)),
        !Qi &&
          Wi.test(e) &&
          ((e = this._replaceDirInCssText(e)), (this.__activateDir = !0)),
        e
      );
    }
    static _replaceDirInCssText(e) {
      let t = e;
      return (
        (t = t.replace(Xi, ':host([dir="$1"])')),
        (t = t.replace(Ji, ':host([dir="$2"]) $1')),
        t
      );
    }
    constructor() {
      super(), (this.__autoDirOptOut = !1);
    }
    ready() {
      super.ready(), (this.__autoDirOptOut = this.hasAttribute("dir"));
    }
    connectedCallback() {
      t.prototype.connectedCallback && super.connectedCallback(),
        this.constructor.__activateDir &&
          (ta && ta.takeRecords().length && aa(), ea.push(this), ia(this));
    }
    disconnectedCallback() {
      if (
        (t.prototype.disconnectedCallback && super.disconnectedCallback(),
        this.constructor.__activateDir)
      ) {
        const e = ea.indexOf(this);
        e > -1 && ea.splice(e, 1);
      }
    }
  }
  return (o.__activateDir = !1), o;
});
function sa() {
  document.body.removeAttribute("unresolved");
}
function la(e, t, o) {
  return { index: e, removed: t, addedCount: o };
}
"interactive" === document.readyState || "complete" === document.readyState
  ? sa()
  : window.addEventListener("DOMContentLoaded", sa);
function da(e, t, o, r, i, a) {
  let n,
    s = 0,
    l = 0,
    d = Math.min(o - t, a - i);
  if (
    (0 == t &&
      0 == i &&
      (s = (function (e, t, o) {
        for (let r = 0; r < o; r++) if (!pa(e[r], t[r])) return r;
        return o;
      })(e, r, d)),
    o == e.length &&
      a == r.length &&
      (l = (function (e, t, o) {
        let r = e.length,
          i = t.length,
          a = 0;
        for (; a < o && pa(e[--r], t[--i]); ) a++;
        return a;
      })(e, r, d - s)),
    (i += s),
    (a -= l),
    (o -= l) - (t += s) == 0 && a - i == 0)
  )
    return [];
  if (t == o) {
    for (n = la(t, [], 0); i < a; ) n.removed.push(r[i++]);
    return [n];
  }
  if (i == a) return [la(t, [], o - t)];
  let c = (function (e) {
    let t = e.length - 1,
      o = e[0].length - 1,
      r = e[t][o],
      i = [];
    for (; t > 0 || o > 0; ) {
      if (0 == t) {
        i.push(2), o--;
        continue;
      }
      if (0 == o) {
        i.push(3), t--;
        continue;
      }
      let a,
        n = e[t - 1][o - 1],
        s = e[t - 1][o],
        l = e[t][o - 1];
      (a = s < l ? (s < n ? s : n) : l < n ? l : n),
        a == n
          ? (n == r ? i.push(0) : (i.push(1), (r = n)), t--, o--)
          : a == s
          ? (i.push(3), t--, (r = s))
          : (i.push(2), o--, (r = l));
    }
    return i.reverse(), i;
  })(
    (function (e, t, o, r, i, a) {
      let n = a - i + 1,
        s = o - t + 1,
        l = new Array(n);
      for (let e = 0; e < n; e++) (l[e] = new Array(s)), (l[e][0] = e);
      for (let e = 0; e < s; e++) l[0][e] = e;
      for (let o = 1; o < n; o++)
        for (let a = 1; a < s; a++)
          if (pa(e[t + a - 1], r[i + o - 1])) l[o][a] = l[o - 1][a - 1];
          else {
            let e = l[o - 1][a] + 1,
              t = l[o][a - 1] + 1;
            l[o][a] = e < t ? e : t;
          }
      return l;
    })(e, t, o, r, i, a)
  );
  n = void 0;
  let p = [],
    u = t,
    h = i;
  for (let e = 0; e < c.length; e++)
    switch (c[e]) {
      case 0:
        n && (p.push(n), (n = void 0)), u++, h++;
        break;
      case 1:
        n || (n = la(u, [], 0)), n.addedCount++, u++, n.removed.push(r[h]), h++;
        break;
      case 2:
        n || (n = la(u, [], 0)), n.addedCount++, u++;
        break;
      case 3:
        n || (n = la(u, [], 0)), n.removed.push(r[h]), h++;
    }
  return n && p.push(n), p;
}
function ca(e, t) {
  return da(e, 0, e.length, t, 0, t.length);
}
function pa(e, t) {
  return e === t;
}
function ua(e) {
  return "slot" === e.localName;
}
let ha = class {
  static getFlattenedNodes(e) {
    const t = Bo(e);
    return ua(e)
      ? t.assignedNodes({ flatten: !0 })
      : Array.from(t.childNodes)
          .map((e) => (ua(e) ? Bo(e).assignedNodes({ flatten: !0 }) : [e]))
          .reduce((e, t) => e.concat(t), []);
  }
  constructor(e, t) {
    (this._shadyChildrenObserver = null),
      (this._nativeChildrenObserver = null),
      (this._connected = !1),
      (this._target = e),
      (this.callback = t),
      (this._effectiveNodes = []),
      (this._observer = null),
      (this._scheduled = !1),
      (this._boundSchedule = () => {
        this._schedule();
      }),
      this.connect(),
      this._schedule();
  }
  connect() {
    ua(this._target)
      ? this._listenSlots([this._target])
      : Bo(this._target).children &&
        (this._listenSlots(Bo(this._target).children),
        window.ShadyDOM
          ? (this._shadyChildrenObserver = window.ShadyDOM.observeChildren(
              this._target,
              (e) => {
                this._processMutations(e);
              }
            ))
          : ((this._nativeChildrenObserver = new MutationObserver((e) => {
              this._processMutations(e);
            })),
            this._nativeChildrenObserver.observe(this._target, {
              childList: !0,
            }))),
      (this._connected = !0);
  }
  disconnect() {
    ua(this._target)
      ? this._unlistenSlots([this._target])
      : Bo(this._target).children &&
        (this._unlistenSlots(Bo(this._target).children),
        window.ShadyDOM && this._shadyChildrenObserver
          ? (window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver),
            (this._shadyChildrenObserver = null))
          : this._nativeChildrenObserver &&
            (this._nativeChildrenObserver.disconnect(),
            (this._nativeChildrenObserver = null))),
      (this._connected = !1);
  }
  _schedule() {
    this._scheduled || ((this._scheduled = !0), cr.run(() => this.flush()));
  }
  _processMutations(e) {
    this._processSlotMutations(e), this.flush();
  }
  _processSlotMutations(e) {
    if (e)
      for (let t = 0; t < e.length; t++) {
        let o = e[t];
        o.addedNodes && this._listenSlots(o.addedNodes),
          o.removedNodes && this._unlistenSlots(o.removedNodes);
      }
  }
  flush() {
    if (!this._connected) return !1;
    window.ShadyDOM && ShadyDOM.flush(),
      this._nativeChildrenObserver
        ? this._processSlotMutations(this._nativeChildrenObserver.takeRecords())
        : this._shadyChildrenObserver &&
          this._processSlotMutations(this._shadyChildrenObserver.takeRecords()),
      (this._scheduled = !1);
    let e = { target: this._target, addedNodes: [], removedNodes: [] },
      t = this.constructor.getFlattenedNodes(this._target),
      o = ca(t, this._effectiveNodes);
    for (let t, r = 0; r < o.length && (t = o[r]); r++)
      for (let o, r = 0; r < t.removed.length && (o = t.removed[r]); r++)
        e.removedNodes.push(o);
    for (let r, i = 0; i < o.length && (r = o[i]); i++)
      for (let o = r.index; o < r.index + r.addedCount; o++)
        e.addedNodes.push(t[o]);
    this._effectiveNodes = t;
    let r = !1;
    return (
      (e.addedNodes.length || e.removedNodes.length) &&
        ((r = !0), this.callback.call(this._target, e)),
      r
    );
  }
  _listenSlots(e) {
    for (let t = 0; t < e.length; t++) {
      let o = e[t];
      ua(o) && o.addEventListener("slotchange", this._boundSchedule);
    }
  }
  _unlistenSlots(e) {
    for (let t = 0; t < e.length; t++) {
      let o = e[t];
      ua(o) && o.removeEventListener("slotchange", this._boundSchedule);
    }
  }
};
const ma = function () {
    let e, t;
    do {
      (e = window.ShadyDOM && ShadyDOM.flush()),
        window.ShadyCSS &&
          window.ShadyCSS.ScopingShim &&
          window.ShadyCSS.ScopingShim.flush(),
        (t = ui());
    } while (e || t);
  },
  _a = Element.prototype,
  fa =
    _a.matches ||
    _a.matchesSelector ||
    _a.mozMatchesSelector ||
    _a.msMatchesSelector ||
    _a.oMatchesSelector ||
    _a.webkitMatchesSelector,
  ga = function (e, t) {
    return fa.call(e, t);
  };
class ya {
  constructor(e) {
    window.ShadyDOM && window.ShadyDOM.inUse && window.ShadyDOM.patch(e),
      (this.node = e);
  }
  observeNodes(e) {
    return new ha(this.node, e);
  }
  unobserveNodes(e) {
    e.disconnect();
  }
  notifyObserver() {}
  deepContains(e) {
    if (Bo(this.node).contains(e)) return !0;
    let t = e,
      o = e.ownerDocument;
    for (; t && t !== o && t !== this.node; )
      t = Bo(t).parentNode || Bo(t).host;
    return t === this.node;
  }
  getOwnerRoot() {
    return Bo(this.node).getRootNode();
  }
  getDistributedNodes() {
    return "slot" === this.node.localName
      ? Bo(this.node).assignedNodes({ flatten: !0 })
      : [];
  }
  getDestinationInsertionPoints() {
    let e = [],
      t = Bo(this.node).assignedSlot;
    for (; t; ) e.push(t), (t = Bo(t).assignedSlot);
    return e;
  }
  importNode(e, t) {
    let o = this.node instanceof Document ? this.node : this.node.ownerDocument;
    return Bo(o).importNode(e, t);
  }
  getEffectiveChildNodes() {
    return ha.getFlattenedNodes(this.node);
  }
  queryDistributedElements(e) {
    let t = this.getEffectiveChildNodes(),
      o = [];
    for (let r, i = 0, a = t.length; i < a && (r = t[i]); i++)
      r.nodeType === Node.ELEMENT_NODE && ga(r, e) && o.push(r);
    return o;
  }
  get activeElement() {
    let e = this.node;
    return void 0 !== e._activeElement ? e._activeElement : e.activeElement;
  }
}
function ba(e, t) {
  for (let o = 0; o < t.length; o++) {
    let r = t[o];
    Object.defineProperty(e, r, {
      get: function () {
        return this.node[r];
      },
      configurable: !0,
    });
  }
}
class va {
  constructor(e) {
    this.event = e;
  }
  get rootTarget() {
    return this.path[0];
  }
  get localTarget() {
    return this.event.target;
  }
  get path() {
    return this.event.composedPath();
  }
}
ya.prototype.cloneNode,
  ya.prototype.appendChild,
  ya.prototype.insertBefore,
  ya.prototype.removeChild,
  ya.prototype.replaceChild,
  ya.prototype.setAttribute,
  ya.prototype.removeAttribute,
  ya.prototype.querySelector,
  ya.prototype.querySelectorAll,
  ya.prototype.parentNode,
  ya.prototype.firstChild,
  ya.prototype.lastChild,
  ya.prototype.nextSibling,
  ya.prototype.previousSibling,
  ya.prototype.firstElementChild,
  ya.prototype.lastElementChild,
  ya.prototype.nextElementSibling,
  ya.prototype.previousElementSibling,
  ya.prototype.childNodes,
  ya.prototype.children,
  ya.prototype.classList,
  ya.prototype.textContent,
  ya.prototype.innerHTML;
let Ca = ya;
if (
  window.ShadyDOM &&
  window.ShadyDOM.inUse &&
  window.ShadyDOM.noPatch &&
  window.ShadyDOM.Wrapper
) {
  class e extends window.ShadyDOM.Wrapper {}
  Object.getOwnPropertyNames(ya.prototype).forEach((t) => {
    "activeElement" != t && (e.prototype[t] = ya.prototype[t]);
  }),
    ba(e.prototype, ["classList"]),
    (Ca = e),
    Object.defineProperties(va.prototype, {
      localTarget: {
        get() {
          const e = this.event.currentTarget,
            t = e && Aa(e).getOwnerRoot(),
            o = this.path;
          for (let e = 0; e < o.length; e++) {
            const r = o[e];
            if (Aa(r).getOwnerRoot() === t) return r;
          }
        },
        configurable: !0,
      },
      path: {
        get() {
          return window.ShadyDOM.composedPath(this.event);
        },
        configurable: !0,
      },
    });
} else
  !(function (e, t) {
    for (let o = 0; o < t.length; o++) {
      let r = t[o];
      e[r] = function () {
        return this.node[r].apply(this.node, arguments);
      };
    }
  })(ya.prototype, [
    "cloneNode",
    "appendChild",
    "insertBefore",
    "removeChild",
    "replaceChild",
    "setAttribute",
    "removeAttribute",
    "querySelector",
    "querySelectorAll",
  ]),
    ba(ya.prototype, [
      "parentNode",
      "firstChild",
      "lastChild",
      "nextSibling",
      "previousSibling",
      "firstElementChild",
      "lastElementChild",
      "nextElementSibling",
      "previousElementSibling",
      "childNodes",
      "children",
      "classList",
    ]),
    (function (e, t) {
      for (let o = 0; o < t.length; o++) {
        let r = t[o];
        Object.defineProperty(e, r, {
          get: function () {
            return this.node[r];
          },
          set: function (e) {
            this.node[r] = e;
          },
          configurable: !0,
        });
      }
    })(ya.prototype, ["textContent", "innerHTML", "className"]);
const Aa = function (e) {
    if ((e = e || document) instanceof Ca) return e;
    if (e instanceof va) return e;
    let t = e.__domApi;
    return (
      t || ((t = e instanceof Event ? new va(e) : new Ca(e)), (e.__domApi = t)),
      t
    );
  },
  Ha = window.ShadyDOM,
  wa = window.ShadyCSS;
function La(e, t) {
  return Bo(e).getRootNode() === t;
}
const Va = (e) => {
  for (; e; ) {
    const t = Object.getOwnPropertyDescriptor(e, "observedAttributes");
    if (t) return t.get;
    e = Object.getPrototypeOf(e.prototype).constructor;
  }
  return () => [];
};
Mo((e) => {
  const t = li(e);
  let o = Va(t);
  return class extends t {
    constructor() {
      super(), this.__isUpgradeDisabled;
    }
    static get observedAttributes() {
      return o.call(this).concat("disable-upgrade");
    }
    _initializeProperties() {
      this.hasAttribute("disable-upgrade")
        ? (this.__isUpgradeDisabled = !0)
        : super._initializeProperties();
    }
    _enableProperties() {
      this.__isUpgradeDisabled || super._enableProperties();
    }
    _canApplyPropertyDefault(e) {
      return (
        super._canApplyPropertyDefault(e) &&
        !(this.__isUpgradeDisabled && this._isPropertyPending(e))
      );
    }
    attributeChangedCallback(e, t, o, r) {
      "disable-upgrade" == e
        ? this.__isUpgradeDisabled &&
          null == o &&
          (super._initializeProperties(),
          (this.__isUpgradeDisabled = !1),
          Bo(this).isConnected && super.connectedCallback())
        : super.attributeChangedCallback(e, t, o, r);
    }
    connectedCallback() {
      this.__isUpgradeDisabled || super.connectedCallback();
    }
    disconnectedCallback() {
      this.__isUpgradeDisabled || super.disconnectedCallback();
    }
  };
});
let ka = window.ShadyCSS;
const Ma = Mo((e) => {
    const t = Yi(li(e)),
      o = si ? t : na(t),
      r = Va(o),
      i = { x: "pan-x", y: "pan-y", none: "none", all: "auto" };
    class a extends o {
      constructor() {
        super(),
          this.isAttached,
          this.__boundListeners,
          this._debouncers,
          this.__isUpgradeDisabled,
          this.__needsAttributesAtConnected,
          this._legacyForceObservedAttributes;
      }
      static get importMeta() {
        return this.prototype.importMeta;
      }
      created() {}
      __attributeReaction(e, t, o) {
        ((this.__dataAttributes && this.__dataAttributes[e]) ||
          "disable-upgrade" === e) &&
          this.attributeChangedCallback(e, t, o, null);
      }
      setAttribute(e, t) {
        if (Lo && !this._legacyForceObservedAttributes) {
          const o = this.getAttribute(e);
          super.setAttribute(e, t), this.__attributeReaction(e, o, String(t));
        } else super.setAttribute(e, t);
      }
      removeAttribute(e) {
        if (Lo && !this._legacyForceObservedAttributes) {
          const t = this.getAttribute(e);
          super.removeAttribute(e), this.__attributeReaction(e, t, null);
        } else super.removeAttribute(e);
      }
      static get observedAttributes() {
        return Lo && !this.prototype._legacyForceObservedAttributes
          ? (this.hasOwnProperty(
              JSCompiler_renameProperty("__observedAttributes", this)
            ) || ((this.__observedAttributes = []), this.prototype),
            this.__observedAttributes)
          : r.call(this).concat("disable-upgrade");
      }
      _enableProperties() {
        this.__isUpgradeDisabled || super._enableProperties();
      }
      _canApplyPropertyDefault(e) {
        return (
          super._canApplyPropertyDefault(e) &&
          !(this.__isUpgradeDisabled && this._isPropertyPending(e))
        );
      }
      connectedCallback() {
        this.__needsAttributesAtConnected && this._takeAttributes(),
          this.__isUpgradeDisabled ||
            (super.connectedCallback(),
            (this.isAttached = !0),
            this.attached());
      }
      attached() {}
      disconnectedCallback() {
        this.__isUpgradeDisabled ||
          (super.disconnectedCallback(),
          (this.isAttached = !1),
          this.detached());
      }
      detached() {}
      attributeChangedCallback(e, t, o, r) {
        t !== o &&
          ("disable-upgrade" == e
            ? this.__isUpgradeDisabled &&
              null == o &&
              (this._initializeProperties(),
              (this.__isUpgradeDisabled = !1),
              Bo(this).isConnected && this.connectedCallback())
            : (super.attributeChangedCallback(e, t, o, r),
              this.attributeChanged(e, t, o)));
      }
      attributeChanged(e, t, o) {}
      _initializeProperties() {
        if (go && this.hasAttribute("disable-upgrade"))
          this.__isUpgradeDisabled = !0;
        else {
          let e = Object.getPrototypeOf(this);
          e.hasOwnProperty(
            JSCompiler_renameProperty("__hasRegisterFinished", e)
          ) || (this._registered(), (e.__hasRegisterFinished = !0)),
            super._initializeProperties(),
            (this.root = this),
            this.created(),
            Lo &&
              !this._legacyForceObservedAttributes &&
              (this.hasAttributes()
                ? this._takeAttributes()
                : this.parentNode || (this.__needsAttributesAtConnected = !0)),
            this._applyListeners();
        }
      }
      _takeAttributes() {
        const e = this.attributes;
        for (let t = 0, o = e.length; t < o; t++) {
          const o = e[t];
          this.__attributeReaction(o.name, null, o.value);
        }
      }
      _registered() {}
      ready() {
        this._ensureAttributes(), super.ready();
      }
      _ensureAttributes() {}
      _applyListeners() {}
      serialize(e) {
        return this._serializeValue(e);
      }
      deserialize(e, t) {
        return this._deserializeValue(e, t);
      }
      reflectPropertyToAttribute(e, t, o) {
        this._propertyToAttribute(e, t, o);
      }
      serializeValueToAttribute(e, t, o) {
        this._valueToNodeAttribute(o || this, e, t);
      }
      extend(e, t) {
        if (!e || !t) return e || t;
        let o = Object.getOwnPropertyNames(t);
        for (let r, i = 0; i < o.length && (r = o[i]); i++) {
          let o = Object.getOwnPropertyDescriptor(t, r);
          o && Object.defineProperty(e, r, o);
        }
        return e;
      }
      mixin(e, t) {
        for (let o in t) e[o] = t[o];
        return e;
      }
      chainObject(e, t) {
        return e && t && e !== t && (e.__proto__ = t), e;
      }
      instanceTemplate(e) {
        let t = this.constructor._contentForTemplate(e);
        return document.importNode(t, !0);
      }
      fire(e, t, o) {
        (o = o || {}), (t = null == t ? {} : t);
        let r = new Event(e, {
          bubbles: void 0 === o.bubbles || o.bubbles,
          cancelable: Boolean(o.cancelable),
          composed: void 0 === o.composed || o.composed,
        });
        r.detail = t;
        let i = o.node || this;
        return Bo(i).dispatchEvent(r), r;
      }
      listen(e, t, o) {
        e = e || this;
        let r =
            this.__boundListeners || (this.__boundListeners = new WeakMap()),
          i = r.get(e);
        i || ((i = {}), r.set(e, i));
        let a = t + o;
        i[a] || (i[a] = this._addMethodEventListenerToNode(e, t, o, this));
      }
      unlisten(e, t, o) {
        e = e || this;
        let r = this.__boundListeners && this.__boundListeners.get(e),
          i = t + o,
          a = r && r[i];
        a && (this._removeEventListenerFromNode(e, t, a), (r[i] = null));
      }
      setScrollDirection(e, t) {
        $i(t || this, i[e] || "auto");
      }
      $$(e) {
        return this.root.querySelector(e);
      }
      get domHost() {
        let e = Bo(this).getRootNode();
        return e instanceof DocumentFragment ? e.host : e;
      }
      distributeContent() {
        const e = Aa(this);
        window.ShadyDOM && e.shadowRoot && ShadyDOM.flush();
      }
      getEffectiveChildNodes() {
        return Aa(this).getEffectiveChildNodes();
      }
      queryDistributedElements(e) {
        return Aa(this).queryDistributedElements(e);
      }
      getEffectiveChildren() {
        return this.getEffectiveChildNodes().filter(function (e) {
          return e.nodeType === Node.ELEMENT_NODE;
        });
      }
      getEffectiveTextContent() {
        let e = this.getEffectiveChildNodes(),
          t = [];
        for (let o, r = 0; (o = e[r]); r++)
          o.nodeType !== Node.COMMENT_NODE && t.push(o.textContent);
        return t.join("");
      }
      queryEffectiveChildren(e) {
        let t = this.queryDistributedElements(e);
        return t && t[0];
      }
      queryAllEffectiveChildren(e) {
        return this.queryDistributedElements(e);
      }
      getContentChildNodes(e) {
        let t = this.root.querySelector(e || "slot");
        return t ? Aa(t).getDistributedNodes() : [];
      }
      getContentChildren(e) {
        let t = this.getContentChildNodes(e).filter(function (e) {
          return e.nodeType === Node.ELEMENT_NODE;
        });
        return t;
      }
      isLightDescendant(e) {
        const t = this;
        return (
          t !== e &&
          Bo(t).contains(e) &&
          Bo(t).getRootNode() === Bo(e).getRootNode()
        );
      }
      isLocalDescendant(e) {
        return this.root === Bo(e).getRootNode();
      }
      scopeSubtree(e, t = !1) {
        return (function (e, t = !1) {
          if (!Ha || !wa) return null;
          if (!Ha.handlesDynamicScoping) return null;
          const o = wa.ScopingShim;
          if (!o) return null;
          const r = o.scopeForNode(e),
            i = Bo(e).getRootNode(),
            a = (e) => {
              if (!La(e, i)) return;
              const t = Array.from(
                Ha.nativeMethods.querySelectorAll.call(e, "*")
              );
              t.push(e);
              for (let e = 0; e < t.length; e++) {
                const a = t[e];
                if (!La(a, i)) continue;
                const n = o.currentScopeForNode(a);
                n !== r && ("" !== n && o.unscopeNode(a, n), o.scopeNode(a, r));
              }
            };
          if ((a(e), t)) {
            const t = new MutationObserver((e) => {
              for (let t = 0; t < e.length; t++) {
                const o = e[t];
                for (let e = 0; e < o.addedNodes.length; e++) {
                  const t = o.addedNodes[e];
                  t.nodeType === Node.ELEMENT_NODE && a(t);
                }
              }
            });
            return t.observe(e, { childList: !0, subtree: !0 }), t;
          }
          return null;
        })(e, t);
      }
      getComputedStyleValue(e) {
        return ka.getComputedStyleValue(this, e);
      }
      debounce(e, t, o) {
        return (
          (this._debouncers = this._debouncers || {}),
          (this._debouncers[e] = di.debounce(
            this._debouncers[e],
            o > 0 ? lr.after(o) : cr,
            t.bind(this)
          ))
        );
      }
      isDebouncerActive(e) {
        this._debouncers = this._debouncers || {};
        let t = this._debouncers[e];
        return !(!t || !t.isActive());
      }
      flushDebouncer(e) {
        this._debouncers = this._debouncers || {};
        let t = this._debouncers[e];
        t && t.flush();
      }
      cancelDebouncer(e) {
        this._debouncers = this._debouncers || {};
        let t = this._debouncers[e];
        t && t.cancel();
      }
      async(e, t) {
        return t > 0 ? lr.run(e.bind(this), t) : ~cr.run(e.bind(this));
      }
      cancelAsync(e) {
        e < 0 ? cr.cancel(~e) : lr.cancel(e);
      }
      create(e, t) {
        let o = document.createElement(e);
        if (t)
          if (o.setProperties) o.setProperties(t);
          else for (let e in t) o[e] = t[e];
        return o;
      }
      elementMatches(e, t) {
        return ga(t || this, e);
      }
      toggleAttribute(e, t) {
        let o = this;
        return (
          3 === arguments.length && (o = arguments[2]),
          1 == arguments.length && (t = !o.hasAttribute(e)),
          t ? (Bo(o).setAttribute(e, ""), !0) : (Bo(o).removeAttribute(e), !1)
        );
      }
      toggleClass(e, t, o) {
        (o = o || this),
          1 == arguments.length && (t = !o.classList.contains(e)),
          t ? o.classList.add(e) : o.classList.remove(e);
      }
      transform(e, t) {
        ((t = t || this).style.webkitTransform = e), (t.style.transform = e);
      }
      translate3d(e, t, o, r) {
        (r = r || this),
          this.transform("translate3d(" + e + "," + t + "," + o + ")", r);
      }
      arrayDelete(e, t) {
        let o;
        if (Array.isArray(e)) {
          if (((o = e.indexOf(t)), o >= 0)) return e.splice(o, 1);
        } else {
          if (((o = Yo(this, e).indexOf(t)), o >= 0))
            return this.splice(e, o, 1);
        }
        return null;
      }
      _logger(e, t) {
        switch (
          (Array.isArray(t) &&
            1 === t.length &&
            Array.isArray(t[0]) &&
            (t = t[0]),
          e)
        ) {
          case "log":
          case "warn":
          case "error":
            console[e](...t);
        }
      }
      _log(...e) {
        this._logger("log", e);
      }
      _warn(...e) {
        this._logger("warn", e);
      }
      _error(...e) {
        this._logger("error", e);
      }
      _logf(e, ...t) {
        return ["[%s::%s]", this.is, e, ...t];
      }
    }
    return (a.prototype.is = ""), a;
  }),
  xa = {
    attached: !0,
    detached: !0,
    ready: !0,
    created: !0,
    beforeRegister: !0,
    registered: !0,
    attributeChanged: !0,
    listeners: !0,
    hostAttributes: !0,
  },
  Sa = {
    attached: !0,
    detached: !0,
    ready: !0,
    created: !0,
    beforeRegister: !0,
    registered: !0,
    attributeChanged: !0,
    behaviors: !0,
    _noAccessors: !0,
  },
  Ea = Object.assign(
    { listeners: !0, hostAttributes: !0, properties: !0, observers: !0 },
    Sa
  );
function Pa(e, t, o, r) {
  !(function (e, t, o) {
    const r = e._noAccessors,
      i = Object.getOwnPropertyNames(e);
    for (let a = 0; a < i.length; a++) {
      let n = i[a];
      if (!(n in o))
        if (r) t[n] = e[n];
        else {
          let o = Object.getOwnPropertyDescriptor(e, n);
          o && ((o.configurable = !0), Object.defineProperty(t, n, o));
        }
    }
  })(t, e, r);
  for (let e in xa) t[e] && ((o[e] = o[e] || []), o[e].push(t[e]));
}
function Ta(e, t, o) {
  t = t || [];
  for (let r = e.length - 1; r >= 0; r--) {
    let i = e[r];
    i
      ? Array.isArray(i)
        ? Ta(i, t)
        : t.indexOf(i) < 0 && (!o || o.indexOf(i) < 0) && t.unshift(i)
      : console.warn("behavior is null, check for missing or 404 import");
  }
  return t;
}
function Oa(e, t) {
  for (const o in t) {
    const r = e[o],
      i = t[o];
    e[o] =
      !("value" in i) && r && "value" in r
        ? Object.assign({ value: r.value }, i)
        : i;
  }
}
const Na = Ma(HTMLElement);
function Ra(e, t, o) {
  let r;
  const i = {};
  class a extends t {
    static _finalizeClass() {
      if (
        this.hasOwnProperty(JSCompiler_renameProperty("generatedFrom", this))
      ) {
        if (r)
          for (let e, t = 0; t < r.length; t++)
            (e = r[t]),
              e.properties && this.createProperties(e.properties),
              e.observers && this.createObservers(e.observers, e.properties);
        e.properties && this.createProperties(e.properties),
          e.observers && this.createObservers(e.observers, e.properties),
          this._prepareTemplate();
      } else t._finalizeClass.call(this);
    }
    static get properties() {
      const t = {};
      if (r) for (let e = 0; e < r.length; e++) Oa(t, r[e].properties);
      return Oa(t, e.properties), t;
    }
    static get observers() {
      let t = [];
      if (r)
        for (let e, o = 0; o < r.length; o++)
          (e = r[o]), e.observers && (t = t.concat(e.observers));
      return e.observers && (t = t.concat(e.observers)), t;
    }
    created() {
      super.created();
      const e = i.created;
      if (e) for (let t = 0; t < e.length; t++) e[t].call(this);
    }
    _registered() {
      const e = a.prototype;
      if (
        !e.hasOwnProperty(JSCompiler_renameProperty("__hasRegisterFinished", e))
      ) {
        (e.__hasRegisterFinished = !0), super._registered(), go && n(e);
        const t = Object.getPrototypeOf(this);
        let o = i.beforeRegister;
        if (o) for (let e = 0; e < o.length; e++) o[e].call(t);
        if (((o = i.registered), o))
          for (let e = 0; e < o.length; e++) o[e].call(t);
      }
    }
    _applyListeners() {
      super._applyListeners();
      const e = i.listeners;
      if (e)
        for (let t = 0; t < e.length; t++) {
          const o = e[t];
          if (o)
            for (let e in o) this._addMethodEventListenerToNode(this, e, o[e]);
        }
    }
    _ensureAttributes() {
      const e = i.hostAttributes;
      if (e)
        for (let t = e.length - 1; t >= 0; t--) {
          const o = e[t];
          for (let e in o) this._ensureAttribute(e, o[e]);
        }
      super._ensureAttributes();
    }
    ready() {
      super.ready();
      let e = i.ready;
      if (e) for (let t = 0; t < e.length; t++) e[t].call(this);
    }
    attached() {
      super.attached();
      let e = i.attached;
      if (e) for (let t = 0; t < e.length; t++) e[t].call(this);
    }
    detached() {
      super.detached();
      let e = i.detached;
      if (e) for (let t = 0; t < e.length; t++) e[t].call(this);
    }
    attributeChanged(e, t, o) {
      super.attributeChanged();
      let r = i.attributeChanged;
      if (r) for (let i = 0; i < r.length; i++) r[i].call(this, e, t, o);
    }
  }
  if (o) {
    Array.isArray(o) || (o = [o]);
    let e = t.prototype.behaviors;
    (r = Ta(o, null, e)), (a.prototype.behaviors = e ? e.concat(o) : r);
  }
  const n = (t) => {
    r &&
      (function (e, t, o) {
        for (let r = 0; r < t.length; r++) Pa(e, t[r], o, Ea);
      })(t, r, i),
      Pa(t, e, i, Sa);
  };
  return go || n(a.prototype), (a.generatedFrom = e), a;
}
const za = function (e) {
  let t;
  return (
    (t = "function" == typeof e ? e : za.Class(e)),
    e._legacyForceObservedAttributes &&
      (t.prototype._legacyForceObservedAttributes =
        e._legacyForceObservedAttributes),
    customElements.define(t.is, t),
    t
  );
};
function Ia(e, t, o, r, i) {
  let a;
  i && ((a = "object" == typeof o && null !== o), a && (r = e.__dataTemp[t]));
  let n = r !== o && (r == r || o == o);
  return a && n && (e.__dataTemp[t] = o), n;
}
za.Class = function (e, t) {
  e || console.warn("Polymer.Class requires `info` argument");
  let o = t ? t(Na) : Na;
  return (o = Ra(e, o, e.behaviors)), (o.is = o.prototype.is = e.is), o;
};
const Da = Mo(
    (e) =>
      class extends e {
        _shouldPropertyChange(e, t, o) {
          return Ia(this, e, t, o, !0);
        }
      }
  ),
  ja = Mo(
    (e) =>
      class extends e {
        static get properties() {
          return { mutableData: Boolean };
        }
        _shouldPropertyChange(e, t, o) {
          return Ia(this, e, t, o, this.mutableData);
        }
      }
  );
Da._mutablePropertyChange = Ia;
let Ba = null;
function $a() {
  return Ba;
}
$a.prototype = Object.create(HTMLTemplateElement.prototype, {
  constructor: { value: $a, writable: !0 },
});
const Fa = ii($a),
  Ua = Da(Fa);
const Za = ii(class {});
function Ga(e, t) {
  for (let o = 0; o < t.length; o++) {
    let r = t[o];
    if (Boolean(e) != Boolean(r.__hideTemplateChildren__))
      if (r.nodeType === Node.TEXT_NODE)
        e
          ? ((r.__polymerTextContent__ = r.textContent), (r.textContent = ""))
          : (r.textContent = r.__polymerTextContent__);
      else if ("slot" === r.localName)
        if (e)
          (r.__polymerReplaced__ = document.createComment("hidden-slot")),
            Bo(Bo(r).parentNode).replaceChild(r.__polymerReplaced__, r);
        else {
          const e = r.__polymerReplaced__;
          e && Bo(Bo(e).parentNode).replaceChild(r, e);
        }
      else
        r.style &&
          (e
            ? ((r.__polymerDisplay__ = r.style.display),
              (r.style.display = "none"))
            : (r.style.display = r.__polymerDisplay__));
    (r.__hideTemplateChildren__ = e),
      r._showHideChildren && r._showHideChildren(e);
  }
}
class qa extends Za {
  constructor(e) {
    super(),
      this._configureProperties(e),
      (this.root = this._stampTemplate(this.__dataHost));
    let t = [];
    this.children = t;
    for (let e = this.root.firstChild; e; e = e.nextSibling)
      t.push(e), (e.__templatizeInstance = this);
    this.__templatizeOwner &&
      this.__templatizeOwner.__hideTemplateChildren__ &&
      this._showHideChildren(!0);
    let o = this.__templatizeOptions;
    ((e && o.instanceProps) || !o.instanceProps) && this._enableProperties();
  }
  _configureProperties(e) {
    if (this.__templatizeOptions.forwardHostProp)
      for (let e in this.__hostProps)
        this._setPendingProperty(e, this.__dataHost["_host_" + e]);
    for (let t in e) this._setPendingProperty(t, e[t]);
  }
  forwardHostProp(e, t) {
    this._setPendingPropertyOrPath(e, t, !1, !0) &&
      this.__dataHost._enqueueClient(this);
  }
  _addEventListenerToNode(e, t, o) {
    if (this._methodHost && this.__templatizeOptions.parentModel)
      this._methodHost._addEventListenerToNode(e, t, (e) => {
        (e.model = this), o(e);
      });
    else {
      let r = this.__dataHost.__dataHost;
      r && r._addEventListenerToNode(e, t, o);
    }
  }
  _showHideChildren(e) {
    Ga(e, this.children);
  }
  _setUnmanagedPropertyToNode(e, t, o) {
    e.__hideTemplateChildren__ &&
    e.nodeType == Node.TEXT_NODE &&
    "textContent" == t
      ? (e.__polymerTextContent__ = o)
      : super._setUnmanagedPropertyToNode(e, t, o);
  }
  get parentModel() {
    let e = this.__parentModel;
    if (!e) {
      let t;
      e = this;
      do {
        e = e.__dataHost.__dataHost;
      } while ((t = e.__templatizeOptions) && !t.parentModel);
      this.__parentModel = e;
    }
    return e;
  }
  dispatchEvent(e) {
    return !0;
  }
}
qa.prototype.__dataHost,
  qa.prototype.__templatizeOptions,
  qa.prototype._methodHost,
  qa.prototype.__templatizeOwner,
  qa.prototype.__hostProps;
const Ka = Da(qa);
function Ya(e) {
  let t = e.__dataHost;
  return (t && t._methodHost) || t;
}
function Xa(e, t, o) {
  let r = o.mutableData ? Ka : qa;
  en.mixin && (r = en.mixin(r));
  let i = class extends r {};
  return (
    (i.prototype.__templatizeOptions = o),
    i.prototype._bindTemplate(e),
    (function (e, t, o, r) {
      let i = o.hostProps || {};
      for (let t in r.instanceProps) {
        delete i[t];
        let o = r.notifyInstanceProp;
        o &&
          e.prototype._addPropertyEffect(
            t,
            e.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
            { fn: Qa(t, o) }
          );
      }
      if (r.forwardHostProp && t.__dataHost)
        for (let t in i)
          o.hasHostProps || (o.hasHostProps = !0),
            e.prototype._addPropertyEffect(
              t,
              e.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
              {
                fn: function (e, t, o) {
                  e.__dataHost._setPendingPropertyOrPath(
                    "_host_" + t,
                    o[t],
                    !0,
                    !0
                  );
                },
              }
            );
    })(i, e, t, o),
    i
  );
}
function Ja(e, t, o, r) {
  let i = o.forwardHostProp;
  if (i && t.hasHostProps) {
    const a = "template" == e.localName;
    let n = t.templatizeTemplateClass;
    if (!n) {
      if (a) {
        let e = o.mutableData ? Ua : Fa;
        class r extends e {}
        n = t.templatizeTemplateClass = r;
      } else {
        const o = e.constructor;
        class r extends o {}
        n = t.templatizeTemplateClass = r;
      }
      let s = t.hostProps;
      for (let e in s)
        n.prototype._addPropertyEffect(
          "_host_" + e,
          n.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,
          { fn: Wa(e, i) }
        ),
          n.prototype._createNotifyingProperty("_host_" + e);
      yo &&
        r &&
        (function (e, t, o) {
          const r = o.constructor._properties,
            { propertyEffects: i } = e,
            { instanceProps: a } = t;
          for (let e in i)
            if (!(r[e] || (a && a[e]))) {
              const t = i[e];
              for (let o = 0; o < t.length; o++) {
                const { part: r } = t[o].info;
                if (!r.signature || !r.signature.static) {
                  console.warn(
                    `Property '${e}' used in template but not declared in 'properties'; attribute will not be observed.`
                  );
                  break;
                }
              }
            }
        })(t, o, r);
    }
    if ((e.__dataProto && Object.assign(e.__data, e.__dataProto), a))
      !(function (e, t) {
        (Ba = e), Object.setPrototypeOf(e, t.prototype), new t(), (Ba = null);
      })(e, n),
        (e.__dataTemp = {}),
        (e.__dataPending = null),
        (e.__dataOld = null),
        e._enableProperties();
    else {
      Object.setPrototypeOf(e, n.prototype);
      const o = t.hostProps;
      for (let t in o)
        if (((t = "_host_" + t), t in e)) {
          const o = e[t];
          delete e[t], (e.__data[t] = o);
        }
    }
  }
}
function Wa(e, t) {
  return function (e, o, r) {
    t.call(e.__templatizeOwner, o.substring("_host_".length), r[o]);
  };
}
function Qa(e, t) {
  return function (e, o, r) {
    t.call(e.__templatizeOwner, e, o, r[o]);
  };
}
function en(e, t, o) {
  if (_o && !Ya(e))
    throw new Error("strictTemplatePolicy: template owner not trusted");
  if (((o = o || {}), e.__templatizeOwner))
    throw new Error("A <template> can only be templatized once");
  e.__templatizeOwner = t;
  let r = (t ? t.constructor : qa)._parseTemplate(e),
    i = r.templatizeInstanceClass;
  i || ((i = Xa(e, r, o)), (r.templatizeInstanceClass = i));
  const a = Ya(e);
  Ja(e, r, o, a);
  let n = class extends i {};
  return (
    (n.prototype._methodHost = a),
    (n.prototype.__dataHost = e),
    (n.prototype.__templatizeOwner = t),
    (n.prototype.__hostProps = r.hostProps),
    n
  );
}
let tn = !1;
function on() {
  if (go && !co) {
    if (!tn) {
      tn = !0;
      const e = document.createElement("style");
      (e.textContent = "dom-bind,dom-if,dom-repeat{display:none;}"),
        document.head.appendChild(e);
    }
    return !0;
  }
  return !1;
}
const rn = Yi(ja(ii(HTMLElement)));
customElements.define(
  "dom-bind",
  class extends rn {
    static get observedAttributes() {
      return ["mutable-data"];
    }
    constructor() {
      if ((super(), _o))
        throw new Error("strictTemplatePolicy: dom-bind not allowed");
      (this.root = null), (this.$ = null), (this.__children = null);
    }
    attributeChangedCallback(e, t, o, r) {
      this.mutableData = !0;
    }
    connectedCallback() {
      on() || (this.style.display = "none"), this.render();
    }
    disconnectedCallback() {
      this.__removeChildren();
    }
    __insertChildren() {
      Bo(Bo(this).parentNode).insertBefore(this.root, this);
    }
    __removeChildren() {
      if (this.__children)
        for (let e = 0; e < this.__children.length; e++)
          this.root.appendChild(this.__children[e]);
    }
    render() {
      let e;
      if (!this.__children) {
        if (((e = e || this.querySelector("template")), !e)) {
          let t = new MutationObserver(() => {
            if (((e = this.querySelector("template")), !e))
              throw new Error("dom-bind requires a <template> child");
            t.disconnect(), this.render();
          });
          return void t.observe(this, { childList: !0 });
        }
        (this.root = this._stampTemplate(e)),
          (this.$ = this.root.$),
          (this.__children = []);
        for (let e = this.root.firstChild; e; e = e.nextSibling)
          this.__children[this.__children.length] = e;
        this._enableProperties();
      }
      this.__insertChildren(),
        this.dispatchEvent(
          new CustomEvent("dom-change", { bubbles: !0, composed: !0 })
        );
    }
  }
);
class an {
  constructor(e) {
    this.value = e.toString();
  }
  toString() {
    return this.value;
  }
}
function nn(e) {
  if (e instanceof HTMLTemplateElement) return e.innerHTML;
  if (e instanceof an)
    return (function (e) {
      if (e instanceof an) return e.value;
      throw new Error(
        `non-literal value passed to Polymer's htmlLiteral function: ${e}`
      );
    })(e);
  throw new Error(`non-template value passed to Polymer's html function: ${e}`);
}
const sn = function (e, ...t) {
    const o = document.createElement("template");
    return (o.innerHTML = t.reduce((t, o, r) => t + nn(o) + e[r + 1], e[0])), o;
  },
  ln = li(HTMLElement),
  dn = ja(ln);
class cn extends dn {
  static get is() {
    return "dom-repeat";
  }
  static get template() {
    return null;
  }
  static get properties() {
    return {
      items: { type: Array },
      as: { type: String, value: "item" },
      indexAs: { type: String, value: "index" },
      itemsIndexAs: { type: String, value: "itemsIndex" },
      sort: { type: Function, observer: "__sortChanged" },
      filter: { type: Function, observer: "__filterChanged" },
      observe: { type: String, observer: "__observeChanged" },
      delay: Number,
      renderedItemCount: { type: Number, notify: !wo, readOnly: !0 },
      initialCount: { type: Number },
      targetFramerate: { type: Number, value: 20 },
      _targetFrameTime: {
        type: Number,
        computed: "__computeFrameTime(targetFramerate)",
      },
      notifyDomChange: { type: Boolean },
      reuseChunkedInstances: { type: Boolean },
    };
  }
  static get observers() {
    return ["__itemsChanged(items.*)"];
  }
  constructor() {
    super(),
      (this.__instances = []),
      (this.__renderDebouncer = null),
      (this.__itemsIdxToInstIdx = {}),
      (this.__chunkCount = null),
      (this.__renderStartTime = null),
      (this.__itemsArrayChanged = !1),
      (this.__shouldMeasureChunk = !1),
      (this.__shouldContinueChunking = !1),
      (this.__chunkingId = 0),
      (this.__sortFn = null),
      (this.__filterFn = null),
      (this.__observePaths = null),
      (this.__ctor = null),
      (this.__isDetached = !0),
      (this.template = null),
      this._templateInfo;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), (this.__isDetached = !0);
    for (let e = 0; e < this.__instances.length; e++) this.__detachInstance(e);
  }
  connectedCallback() {
    if (
      (super.connectedCallback(),
      on() || (this.style.display = "none"),
      this.__isDetached)
    ) {
      this.__isDetached = !1;
      let e = Bo(Bo(this).parentNode);
      for (let t = 0; t < this.__instances.length; t++)
        this.__attachInstance(t, e);
    }
  }
  __ensureTemplatized() {
    if (!this.__ctor) {
      const e = this;
      let t = (this.template = e._templateInfo
        ? e
        : this.querySelector("template"));
      if (!t) {
        let e = new MutationObserver(() => {
          if (!this.querySelector("template"))
            throw new Error("dom-repeat requires a <template> child");
          e.disconnect(), this.__render();
        });
        return e.observe(this, { childList: !0 }), !1;
      }
      let o = {};
      (o[this.as] = !0),
        (o[this.indexAs] = !0),
        (o[this.itemsIndexAs] = !0),
        (this.__ctor = en(t, this, {
          mutableData: this.mutableData,
          parentModel: !0,
          instanceProps: o,
          forwardHostProp: function (e, t) {
            let o = this.__instances;
            for (let r, i = 0; i < o.length && (r = o[i]); i++)
              r.forwardHostProp(e, t);
          },
          notifyInstanceProp: function (e, t, o) {
            if ((r = this.as) === (i = t) || Uo(r, i) || Zo(r, i)) {
              let r = e[this.itemsIndexAs];
              t == this.as && (this.items[r] = o);
              let i = Go(
                this.as,
                `${JSCompiler_renameProperty("items", this)}.${r}`,
                t
              );
              this.notifyPath(i, o);
            }
            var r, i;
          },
        }));
    }
    return !0;
  }
  __getMethodHost() {
    return this.__dataHost._methodHost || this.__dataHost;
  }
  __functionFromPropertyValue(e) {
    if ("string" == typeof e) {
      let t = e,
        o = this.__getMethodHost();
      return function () {
        return o[t].apply(o, arguments);
      };
    }
    return e;
  }
  __sortChanged(e) {
    (this.__sortFn = this.__functionFromPropertyValue(e)),
      this.items && this.__debounceRender(this.__render);
  }
  __filterChanged(e) {
    (this.__filterFn = this.__functionFromPropertyValue(e)),
      this.items && this.__debounceRender(this.__render);
  }
  __computeFrameTime(e) {
    return Math.ceil(1e3 / e);
  }
  __observeChanged() {
    this.__observePaths =
      this.observe && this.observe.replace(".*", ".").split(" ");
  }
  __handleObservedPaths(e) {
    if (this.__sortFn || this.__filterFn)
      if (e) {
        if (this.__observePaths) {
          let t = this.__observePaths;
          for (let o = 0; o < t.length; o++)
            0 === e.indexOf(t[o]) &&
              this.__debounceRender(this.__render, this.delay);
        }
      } else this.__debounceRender(this.__render, this.delay);
  }
  __itemsChanged(e) {
    this.items &&
      !Array.isArray(this.items) &&
      console.warn("dom-repeat expected array for `items`, found", this.items),
      this.__handleItemPath(e.path, e.value) ||
        ("items" === e.path && (this.__itemsArrayChanged = !0),
        this.__debounceRender(this.__render));
  }
  __debounceRender(e, t = 0) {
    (this.__renderDebouncer = di.debounce(
      this.__renderDebouncer,
      t > 0 ? lr.after(t) : cr,
      e.bind(this)
    )),
      pi(this.__renderDebouncer);
  }
  render() {
    this.__debounceRender(this.__render), ma();
  }
  __render() {
    if (!this.__ensureTemplatized()) return;
    let e = this.items || [];
    const t = this.__sortAndFilterItems(e),
      o = this.__calculateLimit(t.length);
    this.__updateInstances(e, o, t),
      this.initialCount &&
        (this.__shouldMeasureChunk || this.__shouldContinueChunking) &&
        (cancelAnimationFrame(this.__chunkingId),
        (this.__chunkingId = requestAnimationFrame(() =>
          this.__continueChunking()
        ))),
      this._setRenderedItemCount(this.__instances.length),
      (wo && !this.notifyDomChange) ||
        this.dispatchEvent(
          new CustomEvent("dom-change", { bubbles: !0, composed: !0 })
        );
  }
  __sortAndFilterItems(e) {
    let t = new Array(e.length);
    for (let o = 0; o < e.length; o++) t[o] = o;
    return (
      this.__filterFn &&
        (t = t.filter((t, o, r) => this.__filterFn(e[t], o, r))),
      this.__sortFn && t.sort((t, o) => this.__sortFn(e[t], e[o])),
      t
    );
  }
  __calculateLimit(e) {
    let t = e;
    const o = this.__instances.length;
    if (this.initialCount) {
      let r;
      !this.__chunkCount ||
      (this.__itemsArrayChanged && !this.reuseChunkedInstances)
        ? ((t = Math.min(e, this.initialCount)),
          (r = Math.max(t - o, 0)),
          (this.__chunkCount = r || 1))
        : ((r = Math.min(Math.max(e - o, 0), this.__chunkCount)),
          (t = Math.min(o + r, e))),
        (this.__shouldMeasureChunk = r === this.__chunkCount),
        (this.__shouldContinueChunking = t < e),
        (this.__renderStartTime = performance.now());
    }
    return (this.__itemsArrayChanged = !1), t;
  }
  __continueChunking() {
    if (this.__shouldMeasureChunk) {
      const e = performance.now() - this.__renderStartTime,
        t = this._targetFrameTime / e;
      this.__chunkCount = Math.round(this.__chunkCount * t) || 1;
    }
    this.__shouldContinueChunking && this.__debounceRender(this.__render);
  }
  __updateInstances(e, t, o) {
    const r = (this.__itemsIdxToInstIdx = {});
    let i;
    for (i = 0; i < t; i++) {
      let t = this.__instances[i],
        a = o[i],
        n = e[a];
      (r[a] = i),
        t
          ? (t._setPendingProperty(this.as, n),
            t._setPendingProperty(this.indexAs, i),
            t._setPendingProperty(this.itemsIndexAs, a),
            t._flushProperties())
          : this.__insertInstance(n, i, a);
    }
    for (let e = this.__instances.length - 1; e >= i; e--)
      this.__detachAndRemoveInstance(e);
  }
  __detachInstance(e) {
    let t = this.__instances[e];
    const o = Bo(t.root);
    for (let e = 0; e < t.children.length; e++) {
      let r = t.children[e];
      o.appendChild(r);
    }
    return t;
  }
  __attachInstance(e, t) {
    let o = this.__instances[e];
    t.insertBefore(o.root, this);
  }
  __detachAndRemoveInstance(e) {
    this.__detachInstance(e), this.__instances.splice(e, 1);
  }
  __stampInstance(e, t, o) {
    let r = {};
    return (
      (r[this.as] = e),
      (r[this.indexAs] = t),
      (r[this.itemsIndexAs] = o),
      new this.__ctor(r)
    );
  }
  __insertInstance(e, t, o) {
    const r = this.__stampInstance(e, t, o);
    let i = this.__instances[t + 1],
      a = i ? i.children[0] : this;
    return (
      Bo(Bo(this).parentNode).insertBefore(r.root, a),
      (this.__instances[t] = r),
      r
    );
  }
  _showHideChildren(e) {
    for (let t = 0; t < this.__instances.length; t++)
      this.__instances[t]._showHideChildren(e);
  }
  __handleItemPath(e, t) {
    let o = e.slice(6),
      r = o.indexOf("."),
      i = r < 0 ? o : o.substring(0, r);
    if (i == parseInt(i, 10)) {
      let e = r < 0 ? "" : o.substring(r + 1);
      this.__handleObservedPaths(e);
      let a = this.__itemsIdxToInstIdx[i],
        n = this.__instances[a];
      if (n) {
        let o = this.as + (e ? "." + e : "");
        n._setPendingPropertyOrPath(o, t, !1, !0), n._flushProperties();
      }
      return !0;
    }
  }
  itemForElement(e) {
    let t = this.modelForElement(e);
    return t && t[this.as];
  }
  indexForElement(e) {
    let t = this.modelForElement(e);
    return t && t[this.indexAs];
  }
  modelForElement(e) {
    return (function (e, t) {
      let o;
      for (; t; )
        if ((o = t.__dataHost ? t : t.__templatizeInstance)) {
          if (o.__dataHost == e) return o;
          t = o.__dataHost;
        } else t = Bo(t).parentNode;
      return null;
    })(this.template, e);
  }
}
customElements.define(cn.is, cn);
class pn extends ln {
  static get is() {
    return "dom-if";
  }
  static get template() {
    return null;
  }
  static get properties() {
    return {
      if: { type: Boolean, observer: "__debounceRender" },
      restamp: { type: Boolean, observer: "__debounceRender" },
      notifyDomChange: { type: Boolean },
    };
  }
  constructor() {
    super(),
      (this.__renderDebouncer = null),
      (this._lastIf = !1),
      (this.__hideTemplateChildren__ = !1),
      this.__template,
      this._templateInfo;
  }
  __debounceRender() {
    (this.__renderDebouncer = di.debounce(this.__renderDebouncer, cr, () =>
      this.__render()
    )),
      pi(this.__renderDebouncer);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const e = Bo(this).parentNode;
    (e && (e.nodeType != Node.DOCUMENT_FRAGMENT_NODE || Bo(e).host)) ||
      this.__teardownInstance();
  }
  connectedCallback() {
    super.connectedCallback(),
      on() || (this.style.display = "none"),
      this.if && this.__debounceRender();
  }
  __ensureTemplate() {
    if (!this.__template) {
      const e = this;
      let t = e._templateInfo ? e : Bo(e).querySelector("template");
      if (!t) {
        let e = new MutationObserver(() => {
          if (!Bo(this).querySelector("template"))
            throw new Error("dom-if requires a <template> child");
          e.disconnect(), this.__render();
        });
        return e.observe(this, { childList: !0 }), !1;
      }
      this.__template = t;
    }
    return !0;
  }
  __ensureInstance() {
    let e = Bo(this).parentNode;
    if (this.__hasInstance()) {
      let t = this.__getInstanceNodes();
      if (t && t.length) {
        if (Bo(this).previousSibling !== t[t.length - 1])
          for (let o, r = 0; r < t.length && (o = t[r]); r++)
            Bo(e).insertBefore(o, this);
      }
    } else {
      if (!e) return !1;
      if (!this.__ensureTemplate()) return !1;
      this.__createAndInsertInstance(e);
    }
    return !0;
  }
  render() {
    ma();
  }
  __render() {
    if (this.if) {
      if (!this.__ensureInstance()) return;
    } else this.restamp && this.__teardownInstance();
    this._showHideChildren(),
      (wo && !this.notifyDomChange) ||
        this.if == this._lastIf ||
        (this.dispatchEvent(
          new CustomEvent("dom-change", { bubbles: !0, composed: !0 })
        ),
        (this._lastIf = this.if));
  }
  __hasInstance() {}
  __getInstanceNodes() {}
  __createAndInsertInstance(e) {}
  __teardownInstance() {}
  _showHideChildren() {}
}
const un = Ho
  ? class extends pn {
      constructor() {
        super(), (this.__instance = null), (this.__syncInfo = null);
      }
      __hasInstance() {
        return Boolean(this.__instance);
      }
      __getInstanceNodes() {
        return this.__instance.templateInfo.childNodes;
      }
      __createAndInsertInstance(e) {
        const t = this.__dataHost || this;
        if (_o && !this.__dataHost)
          throw new Error("strictTemplatePolicy: template owner not trusted");
        const o = t._bindTemplate(this.__template, !0);
        (o.runEffects = (e, t, o) => {
          let r = this.__syncInfo;
          if (this.if)
            r &&
              ((this.__syncInfo = null),
              this._showHideChildren(),
              (t = Object.assign(r.changedProps, t))),
              e(t, o);
          else if (this.__instance)
            if (
              (r || (r = this.__syncInfo = { runEffects: e, changedProps: {} }),
              o)
            )
              for (const e in t) {
                const t = Fo(e);
                r.changedProps[t] = this.__dataHost[t];
              }
            else Object.assign(r.changedProps, t);
        }),
          (this.__instance = t._stampTemplate(this.__template, o)),
          Bo(e).insertBefore(this.__instance, this);
      }
      __syncHostProperties() {
        const e = this.__syncInfo;
        e && ((this.__syncInfo = null), e.runEffects(e.changedProps, !1));
      }
      __teardownInstance() {
        const e = this.__dataHost || this;
        this.__instance &&
          (e._removeBoundDom(this.__instance),
          (this.__instance = null),
          (this.__syncInfo = null));
      }
      _showHideChildren() {
        const e = this.__hideTemplateChildren__ || !this.if;
        this.__instance &&
          Boolean(this.__instance.__hidden) !== e &&
          ((this.__instance.__hidden = e),
          Ga(e, this.__instance.templateInfo.childNodes)),
          e || this.__syncHostProperties();
      }
    }
  : class extends pn {
      constructor() {
        super(),
          (this.__ctor = null),
          (this.__instance = null),
          (this.__invalidProps = null);
      }
      __hasInstance() {
        return Boolean(this.__instance);
      }
      __getInstanceNodes() {
        return this.__instance.children;
      }
      __createAndInsertInstance(e) {
        this.__ctor ||
          (this.__ctor = en(this.__template, this, {
            mutableData: !0,
            forwardHostProp: function (e, t) {
              this.__instance &&
                (this.if
                  ? this.__instance.forwardHostProp(e, t)
                  : ((this.__invalidProps =
                      this.__invalidProps || Object.create(null)),
                    (this.__invalidProps[Fo(e)] = !0)));
            },
          })),
          (this.__instance = new this.__ctor()),
          Bo(e).insertBefore(this.__instance.root, this);
      }
      __teardownInstance() {
        if (this.__instance) {
          let e = this.__instance.children;
          if (e && e.length) {
            let t = Bo(e[0]).parentNode;
            if (t) {
              t = Bo(t);
              for (let o, r = 0; r < e.length && (o = e[r]); r++)
                t.removeChild(o);
            }
          }
          (this.__invalidProps = null), (this.__instance = null);
        }
      }
      __syncHostProperties() {
        let e = this.__invalidProps;
        if (e) {
          this.__invalidProps = null;
          for (let t in e)
            this.__instance._setPendingProperty(t, this.__dataHost[t]);
          this.__instance._flushProperties();
        }
      }
      _showHideChildren() {
        const e = this.__hideTemplateChildren__ || !this.if;
        this.__instance &&
          Boolean(this.__instance.__hidden) !== e &&
          ((this.__instance.__hidden = e),
          this.__instance._showHideChildren(e)),
          e || this.__syncHostProperties();
      }
    };
customElements.define(un.is, un);
let hn = Mo((e) => {
    let t = li(e);
    return class extends t {
      static get properties() {
        return {
          items: { type: Array },
          multi: { type: Boolean, value: !1 },
          selected: { type: Object, notify: !0 },
          selectedItem: { type: Object, notify: !0 },
          toggle: { type: Boolean, value: !1 },
        };
      }
      static get observers() {
        return ["__updateSelection(multi, items.*)"];
      }
      constructor() {
        super(),
          (this.__lastItems = null),
          (this.__lastMulti = null),
          (this.__selectedMap = null);
      }
      __updateSelection(e, t) {
        let o = t.path;
        if (o == JSCompiler_renameProperty("items", this)) {
          let o = t.base || [],
            r = this.__lastItems;
          if ((e !== this.__lastMulti && this.clearSelection(), r)) {
            let e = ca(o, r);
            this.__applySplices(e);
          }
          (this.__lastItems = o), (this.__lastMulti = e);
        } else if (
          t.path == `${JSCompiler_renameProperty("items", this)}.splices`
        )
          this.__applySplices(t.value.indexSplices);
        else {
          let e = o.slice(
              `${JSCompiler_renameProperty("items", this)}.`.length
            ),
            t = parseInt(e, 10);
          e.indexOf(".") < 0 && e == t && this.__deselectChangedIdx(t);
        }
      }
      __applySplices(e) {
        let t = this.__selectedMap;
        for (let o = 0; o < e.length; o++) {
          let r = e[o];
          t.forEach((e, o) => {
            e < r.index ||
              (e >= r.index + r.removed.length
                ? t.set(o, e + r.addedCount - r.removed.length)
                : t.set(o, -1));
          });
          for (let e = 0; e < r.addedCount; e++) {
            let o = r.index + e;
            t.has(this.items[o]) && t.set(this.items[o], o);
          }
        }
        this.__updateLinks();
        let o = 0;
        t.forEach((e, r) => {
          e < 0
            ? (this.multi
                ? this.splice(JSCompiler_renameProperty("selected", this), o, 1)
                : (this.selected = this.selectedItem = null),
              t.delete(r))
            : o++;
        });
      }
      __updateLinks() {
        if (((this.__dataLinkedPaths = {}), this.multi)) {
          let e = 0;
          this.__selectedMap.forEach((t) => {
            t >= 0 &&
              this.linkPaths(
                `${JSCompiler_renameProperty("items", this)}.${t}`,
                `${JSCompiler_renameProperty("selected", this)}.${e++}`
              );
          });
        } else
          this.__selectedMap.forEach((e) => {
            this.linkPaths(
              JSCompiler_renameProperty("selected", this),
              `${JSCompiler_renameProperty("items", this)}.${e}`
            ),
              this.linkPaths(
                JSCompiler_renameProperty("selectedItem", this),
                `${JSCompiler_renameProperty("items", this)}.${e}`
              );
          });
      }
      clearSelection() {
        (this.__dataLinkedPaths = {}),
          (this.__selectedMap = new Map()),
          (this.selected = this.multi ? [] : null),
          (this.selectedItem = null);
      }
      isSelected(e) {
        return this.__selectedMap.has(e);
      }
      isIndexSelected(e) {
        return this.isSelected(this.items[e]);
      }
      __deselectChangedIdx(e) {
        let t = this.__selectedIndexForItemIndex(e);
        if (t >= 0) {
          let e = 0;
          this.__selectedMap.forEach((o, r) => {
            t == e++ && this.deselect(r);
          });
        }
      }
      __selectedIndexForItemIndex(e) {
        let t =
          this.__dataLinkedPaths[
            `${JSCompiler_renameProperty("items", this)}.${e}`
          ];
        if (t)
          return parseInt(
            t.slice(`${JSCompiler_renameProperty("selected", this)}.`.length),
            10
          );
      }
      deselect(e) {
        let t = this.__selectedMap.get(e);
        if (t >= 0) {
          let o;
          this.__selectedMap.delete(e),
            this.multi && (o = this.__selectedIndexForItemIndex(t)),
            this.__updateLinks(),
            this.multi
              ? this.splice(JSCompiler_renameProperty("selected", this), o, 1)
              : (this.selected = this.selectedItem = null);
        }
      }
      deselectIndex(e) {
        this.deselect(this.items[e]);
      }
      select(e) {
        this.selectIndex(this.items.indexOf(e));
      }
      selectIndex(e) {
        let t = this.items[e];
        this.isSelected(t)
          ? this.toggle && this.deselectIndex(e)
          : (this.multi || this.__selectedMap.clear(),
            this.__selectedMap.set(t, e),
            this.__updateLinks(),
            this.multi
              ? this.push(JSCompiler_renameProperty("selected", this), t)
              : (this.selected = this.selectedItem = t));
      }
    };
  }),
  mn = hn(ln);
class _n extends mn {
  static get is() {
    return "array-selector";
  }
  static get template() {
    return null;
  }
}
customElements.define(_n.is, _n);
const fn = new Qt();
window.ShadyCSS ||
  (window.ShadyCSS = {
    prepareTemplate(e, t, o) {},
    prepareTemplateDom(e, t) {},
    prepareTemplateStyles(e, t, o) {},
    styleSubtree(e, t) {
      fn.processStyles(), Et(e, t);
    },
    styleElement(e) {
      fn.processStyles();
    },
    styleDocument(e) {
      fn.processStyles(), Et(document.body, e);
    },
    getComputedStyleValue: (e, t) => Pt(e, t),
    flushCustomStyles() {},
    nativeCss: st,
    nativeShadow: ot,
    cssBuild: it,
    disableRuntime: nt,
  }),
  (window.ShadyCSS.CustomStyleInterface = fn);
const gn = window.ShadyCSS.CustomStyleInterface;
class yn extends HTMLElement {
  constructor() {
    super(), (this._style = null), gn.addCustomStyle(this);
  }
  getStyle() {
    if (this._style) return this._style;
    const e = this.querySelector("style");
    if (!e) return null;
    this._style = e;
    const t = e.getAttribute("include");
    return (
      t &&
        (e.removeAttribute("include"),
        (e.textContent =
          (function (e) {
            let t = e.trim().split(/\s+/),
              o = "";
            for (let e = 0; e < t.length; e++) o += jo(t[e]);
            return o;
          })(t) + e.textContent)),
      this.ownerDocument !== window.document &&
        window.document.head.appendChild(this),
      this._style
    );
  }
}
window.customElements.define("custom-style", yn), Ma(HTMLElement).prototype;
const bn = sn`
<custom-style>
  <style is="custom-style">
    [hidden] {
      display: none !important;
    }
  </style>
</custom-style>
<custom-style>
  <style is="custom-style">
    html {

      --layout: {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
      };

      --layout-inline: {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
      };

      --layout-horizontal: {
        @apply --layout;

        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      };

      --layout-horizontal-reverse: {
        @apply --layout;

        -ms-flex-direction: row-reverse;
        -webkit-flex-direction: row-reverse;
        flex-direction: row-reverse;
      };

      --layout-vertical: {
        @apply --layout;

        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      };

      --layout-vertical-reverse: {
        @apply --layout;

        -ms-flex-direction: column-reverse;
        -webkit-flex-direction: column-reverse;
        flex-direction: column-reverse;
      };

      --layout-wrap: {
        -ms-flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
      };

      --layout-wrap-reverse: {
        -ms-flex-wrap: wrap-reverse;
        -webkit-flex-wrap: wrap-reverse;
        flex-wrap: wrap-reverse;
      };

      --layout-flex-auto: {
        -ms-flex: 1 1 auto;
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
      };

      --layout-flex-none: {
        -ms-flex: none;
        -webkit-flex: none;
        flex: none;
      };

      --layout-flex: {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      };

      --layout-flex-2: {
        -ms-flex: 2;
        -webkit-flex: 2;
        flex: 2;
      };

      --layout-flex-3: {
        -ms-flex: 3;
        -webkit-flex: 3;
        flex: 3;
      };

      --layout-flex-4: {
        -ms-flex: 4;
        -webkit-flex: 4;
        flex: 4;
      };

      --layout-flex-5: {
        -ms-flex: 5;
        -webkit-flex: 5;
        flex: 5;
      };

      --layout-flex-6: {
        -ms-flex: 6;
        -webkit-flex: 6;
        flex: 6;
      };

      --layout-flex-7: {
        -ms-flex: 7;
        -webkit-flex: 7;
        flex: 7;
      };

      --layout-flex-8: {
        -ms-flex: 8;
        -webkit-flex: 8;
        flex: 8;
      };

      --layout-flex-9: {
        -ms-flex: 9;
        -webkit-flex: 9;
        flex: 9;
      };

      --layout-flex-10: {
        -ms-flex: 10;
        -webkit-flex: 10;
        flex: 10;
      };

      --layout-flex-11: {
        -ms-flex: 11;
        -webkit-flex: 11;
        flex: 11;
      };

      --layout-flex-12: {
        -ms-flex: 12;
        -webkit-flex: 12;
        flex: 12;
      };

      /* alignment in cross axis */

      --layout-start: {
        -ms-flex-align: start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
      };

      --layout-center: {
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
      };

      --layout-end: {
        -ms-flex-align: end;
        -webkit-align-items: flex-end;
        align-items: flex-end;
      };

      --layout-baseline: {
        -ms-flex-align: baseline;
        -webkit-align-items: baseline;
        align-items: baseline;
      };

      /* alignment in main axis */

      --layout-start-justified: {
        -ms-flex-pack: start;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
      };

      --layout-center-justified: {
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
      };

      --layout-end-justified: {
        -ms-flex-pack: end;
        -webkit-justify-content: flex-end;
        justify-content: flex-end;
      };

      --layout-around-justified: {
        -ms-flex-pack: distribute;
        -webkit-justify-content: space-around;
        justify-content: space-around;
      };

      --layout-justified: {
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
      };

      --layout-center-center: {
        @apply --layout-center;
        @apply --layout-center-justified;
      };

      /* self alignment */

      --layout-self-start: {
        -ms-align-self: flex-start;
        -webkit-align-self: flex-start;
        align-self: flex-start;
      };

      --layout-self-center: {
        -ms-align-self: center;
        -webkit-align-self: center;
        align-self: center;
      };

      --layout-self-end: {
        -ms-align-self: flex-end;
        -webkit-align-self: flex-end;
        align-self: flex-end;
      };

      --layout-self-stretch: {
        -ms-align-self: stretch;
        -webkit-align-self: stretch;
        align-self: stretch;
      };

      --layout-self-baseline: {
        -ms-align-self: baseline;
        -webkit-align-self: baseline;
        align-self: baseline;
      };

      /* multi-line alignment in main axis */

      --layout-start-aligned: {
        -ms-flex-line-pack: start;  /* IE10 */
        -ms-align-content: flex-start;
        -webkit-align-content: flex-start;
        align-content: flex-start;
      };

      --layout-end-aligned: {
        -ms-flex-line-pack: end;  /* IE10 */
        -ms-align-content: flex-end;
        -webkit-align-content: flex-end;
        align-content: flex-end;
      };

      --layout-center-aligned: {
        -ms-flex-line-pack: center;  /* IE10 */
        -ms-align-content: center;
        -webkit-align-content: center;
        align-content: center;
      };

      --layout-between-aligned: {
        -ms-flex-line-pack: justify;  /* IE10 */
        -ms-align-content: space-between;
        -webkit-align-content: space-between;
        align-content: space-between;
      };

      --layout-around-aligned: {
        -ms-flex-line-pack: distribute;  /* IE10 */
        -ms-align-content: space-around;
        -webkit-align-content: space-around;
        align-content: space-around;
      };

      /*******************************
                Other Layout
      *******************************/

      --layout-block: {
        display: block;
      };

      --layout-invisible: {
        visibility: hidden !important;
      };

      --layout-relative: {
        position: relative;
      };

      --layout-fit: {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      };

      --layout-scroll: {
        -webkit-overflow-scrolling: touch;
        overflow: auto;
      };

      --layout-fullbleed: {
        margin: 0;
        height: 100vh;
      };

      /* fixed position */

      --layout-fixed-top: {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      };

      --layout-fixed-right: {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
      };

      --layout-fixed-bottom: {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
      };

      --layout-fixed-left: {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
      };

    }
  </style>
</custom-style>`;
bn.setAttribute("style", "display: none;"),
  document.head.appendChild(bn.content);
var vn = document.createElement("style");
(vn.textContent = "[hidden] { display: none !important; }"),
  document.head.appendChild(vn),
  za({
    _template: sn`
    <style>

      :host {
        @apply --layout-horizontal;
        @apply --layout-center;
        position: relative;
        height: 64px;
        padding: 0 16px;
        pointer-events: none;
        font-size: var(--app-toolbar-font-size, 20px);
      }

      :host ::slotted(*) {
        pointer-events: auto;
      }

      :host ::slotted(paper-icon-button) {
        /* paper-icon-button/issues/33 */
        font-size: 0;
      }

      :host ::slotted([main-title]),
      :host ::slotted([condensed-title]) {
        pointer-events: none;
        @apply --layout-flex;
      }

      :host ::slotted([bottom-item]) {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
      }

      :host ::slotted([top-item]) {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
      }

      :host ::slotted([spacer]) {
        margin-left: 64px;
      }
    </style>

    <slot></slot>
`,
    is: "app-toolbar",
  });
var Cn = function (e, t) {
  return (
    (Cn =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (e, t) {
          e.__proto__ = t;
        }) ||
      function (e, t) {
        for (var o in t)
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      }),
    Cn(e, t)
  );
};
function An(e, t) {
  if ("function" != typeof t && null !== t)
    throw new TypeError(
      "Class extends value " + String(t) + " is not a constructor or null"
    );
  function o() {
    this.constructor = e;
  }
  Cn(e, t),
    (e.prototype =
      null === t ? Object.create(t) : ((o.prototype = t.prototype), new o()));
}
var Hn = function () {
  return (
    (Hn =
      Object.assign ||
      function (e) {
        for (var t, o = 1, r = arguments.length; o < r; o++)
          for (var i in (t = arguments[o]))
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }),
    Hn.apply(this, arguments)
  );
};
function wn(e, t, o, r) {
  var i,
    a = arguments.length,
    n =
      a < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, o)) : r;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
    n = Reflect.decorate(e, t, o, r);
  else
    for (var s = e.length - 1; s >= 0; s--)
      (i = e[s]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, o, n) : i(t, o)) || n);
  return a > 3 && n && Object.defineProperty(t, o, n), n;
}
var Ln = Object.create
  ? function (e, t, o, r) {
      void 0 === r && (r = o);
      var i = Object.getOwnPropertyDescriptor(t, o);
      (i && !("get" in i ? !t.__esModule : i.writable || i.configurable)) ||
        (i = {
          enumerable: !0,
          get: function () {
            return t[o];
          },
        }),
        Object.defineProperty(e, r, i);
    }
  : function (e, t, o, r) {
      void 0 === r && (r = o), (e[r] = t[o]);
    };
function Vn(e) {
  var t = "function" == typeof Symbol && Symbol.iterator,
    o = t && e[t],
    r = 0;
  if (o) return o.call(e);
  if (e && "number" == typeof e.length)
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function kn(e, t) {
  var o = "function" == typeof Symbol && e[Symbol.iterator];
  if (!o) return e;
  var r,
    i,
    a = o.call(e),
    n = [];
  try {
    for (; (void 0 === t || t-- > 0) && !(r = a.next()).done; ) n.push(r.value);
  } catch (e) {
    i = { error: e };
  } finally {
    try {
      r && !r.done && (o = a.return) && o.call(a);
    } finally {
      if (i) throw i.error;
    }
  }
  return n;
}
function Mn(e, t, o) {
  if (o || 2 === arguments.length)
    for (var r, i = 0, a = t.length; i < a; i++)
      (!r && i in t) ||
        (r || (r = Array.prototype.slice.call(t, 0, i)), (r[i] = t[i]));
  return e.concat(r || Array.prototype.slice.call(t));
}
function xn(e) {
  return this instanceof xn ? ((this.v = e), this) : new xn(e);
}
var Sn = Object.create
  ? function (e, t) {
      Object.defineProperty(e, "default", { enumerable: !0, value: t });
    }
  : function (e, t) {
      e.default = t;
    };
var En = Object.freeze({
  __proto__: null,
  __extends: An,
  get __assign() {
    return Hn;
  },
  __rest: function (e, t) {
    var o = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (o[r] = e[r]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var i = 0;
      for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
        t.indexOf(r[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
          (o[r[i]] = e[r[i]]);
    }
    return o;
  },
  __decorate: wn,
  __param: function (e, t) {
    return function (o, r) {
      t(o, r, e);
    };
  },
  __metadata: function (e, t) {
    if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
      return Reflect.metadata(e, t);
  },
  __awaiter: function (e, t, o, r) {
    return new (o || (o = Promise))(function (i, a) {
      function n(e) {
        try {
          l(r.next(e));
        } catch (e) {
          a(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          a(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof o
              ? t
              : new o(function (e) {
                  e(t);
                })).then(n, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  },
  __generator: function (e, t) {
    var o,
      r,
      i,
      a,
      n = {
        label: 0,
        sent: function () {
          if (1 & i[0]) throw i[1];
          return i[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (a = { next: s(0), throw: s(1), return: s(2) }),
      "function" == typeof Symbol &&
        (a[Symbol.iterator] = function () {
          return this;
        }),
      a
    );
    function s(a) {
      return function (s) {
        return (function (a) {
          if (o) throw new TypeError("Generator is already executing.");
          for (; n; )
            try {
              if (
                ((o = 1),
                r &&
                  (i =
                    2 & a[0]
                      ? r.return
                      : a[0]
                      ? r.throw || ((i = r.return) && i.call(r), 0)
                      : r.next) &&
                  !(i = i.call(r, a[1])).done)
              )
                return i;
              switch (((r = 0), i && (a = [2 & a[0], i.value]), a[0])) {
                case 0:
                case 1:
                  i = a;
                  break;
                case 4:
                  return n.label++, { value: a[1], done: !1 };
                case 5:
                  n.label++, (r = a[1]), (a = [0]);
                  continue;
                case 7:
                  (a = n.ops.pop()), n.trys.pop();
                  continue;
                default:
                  if (
                    !((i = n.trys),
                    (i = i.length > 0 && i[i.length - 1]) ||
                      (6 !== a[0] && 2 !== a[0]))
                  ) {
                    n = 0;
                    continue;
                  }
                  if (3 === a[0] && (!i || (a[1] > i[0] && a[1] < i[3]))) {
                    n.label = a[1];
                    break;
                  }
                  if (6 === a[0] && n.label < i[1]) {
                    (n.label = i[1]), (i = a);
                    break;
                  }
                  if (i && n.label < i[2]) {
                    (n.label = i[2]), n.ops.push(a);
                    break;
                  }
                  i[2] && n.ops.pop(), n.trys.pop();
                  continue;
              }
              a = t.call(e, n);
            } catch (e) {
              (a = [6, e]), (r = 0);
            } finally {
              o = i = 0;
            }
          if (5 & a[0]) throw a[1];
          return { value: a[0] ? a[1] : void 0, done: !0 };
        })([a, s]);
      };
    }
  },
  __createBinding: Ln,
  __exportStar: function (e, t) {
    for (var o in e)
      "default" === o ||
        Object.prototype.hasOwnProperty.call(t, o) ||
        Ln(t, e, o);
  },
  __values: Vn,
  __read: kn,
  __spread: function () {
    for (var e = [], t = 0; t < arguments.length; t++)
      e = e.concat(kn(arguments[t]));
    return e;
  },
  __spreadArrays: function () {
    for (var e = 0, t = 0, o = arguments.length; t < o; t++)
      e += arguments[t].length;
    var r = Array(e),
      i = 0;
    for (t = 0; t < o; t++)
      for (var a = arguments[t], n = 0, s = a.length; n < s; n++, i++)
        r[i] = a[n];
    return r;
  },
  __spreadArray: Mn,
  __await: xn,
  __asyncGenerator: function (e, t, o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r,
      i = o.apply(e, t || []),
      a = [];
    return (
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r
    );
    function n(e) {
      i[e] &&
        (r[e] = function (t) {
          return new Promise(function (o, r) {
            a.push([e, t, o, r]) > 1 || s(e, t);
          });
        });
    }
    function s(e, t) {
      try {
        !(function (e) {
          e.value instanceof xn
            ? Promise.resolve(e.value.v).then(l, d)
            : c(a[0][2], e);
        })(i[e](t));
      } catch (e) {
        c(a[0][3], e);
      }
    }
    function l(e) {
      s("next", e);
    }
    function d(e) {
      s("throw", e);
    }
    function c(e, t) {
      e(t), a.shift(), a.length && s(a[0][0], a[0][1]);
    }
  },
  __asyncDelegator: function (e) {
    var t, o;
    return (
      (t = {}),
      r("next"),
      r("throw", function (e) {
        throw e;
      }),
      r("return"),
      (t[Symbol.iterator] = function () {
        return this;
      }),
      t
    );
    function r(r, i) {
      t[r] = e[r]
        ? function (t) {
            return (o = !o)
              ? { value: xn(e[r](t)), done: "return" === r }
              : i
              ? i(t)
              : t;
          }
        : i;
    }
  },
  __asyncValues: function (e) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var t,
      o = e[Symbol.asyncIterator];
    return o
      ? o.call(e)
      : ((e = Vn(e)),
        (t = {}),
        r("next"),
        r("throw"),
        r("return"),
        (t[Symbol.asyncIterator] = function () {
          return this;
        }),
        t);
    function r(o) {
      t[o] =
        e[o] &&
        function (t) {
          return new Promise(function (r, i) {
            (function (e, t, o, r) {
              Promise.resolve(r).then(function (t) {
                e({ value: t, done: o });
              }, t);
            })(r, i, (t = e[o](t)).done, t.value);
          });
        };
    }
  },
  __makeTemplateObject: function (e, t) {
    return (
      Object.defineProperty
        ? Object.defineProperty(e, "raw", { value: t })
        : (e.raw = t),
      e
    );
  },
  __importStar: function (e) {
    if (e && e.__esModule) return e;
    var t = {};
    if (null != e)
      for (var o in e)
        "default" !== o &&
          Object.prototype.hasOwnProperty.call(e, o) &&
          Ln(t, e, o);
    return Sn(t, e), t;
  },
  __importDefault: function (e) {
    return e && e.__esModule ? e : { default: e };
  },
  __classPrivateFieldGet: function (e, t, o, r) {
    if ("a" === o && !r)
      throw new TypeError("Private accessor was defined without a getter");
    if ("function" == typeof t ? e !== t || !r : !t.has(e))
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return "m" === o ? r : "a" === o ? r.call(e) : r ? r.value : t.get(e);
  },
  __classPrivateFieldSet: function (e, t, o, r, i) {
    if ("m" === r) throw new TypeError("Private method is not writable");
    if ("a" === r && !i)
      throw new TypeError("Private accessor was defined without a setter");
    if ("function" == typeof t ? e !== t || !i : !t.has(e))
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return "a" === r ? i.call(e, o) : i ? (i.value = o) : t.set(e, o), o;
  },
  __classPrivateFieldIn: function (e, t) {
    if (null === t || ("object" != typeof t && "function" != typeof t))
      throw new TypeError("Cannot use 'in' operator on non-object");
    return "function" == typeof e ? t === e : e.has(t);
  },
});
function Pn(e, t, o) {
  if (void 0 !== t)
    return (function (e, t, o) {
      const r = e.constructor;
      if (!o) {
        const e = `__${t}`;
        if (!(o = r.getPropertyDescriptor(t, e)))
          throw new Error(
            "@ariaProperty must be used after a @property decorator"
          );
      }
      const i = o;
      let a = "";
      if (!i.set) throw new Error(`@ariaProperty requires a setter for ${t}`);
      if (e.dispatchWizEvent) return o;
      const n = {
        configurable: !0,
        enumerable: !0,
        set(e) {
          if ("" === a) {
            const e = r.getPropertyOptions(t);
            a = "string" == typeof e.attribute ? e.attribute : t;
          }
          this.hasAttribute(a) && this.removeAttribute(a), i.set.call(this, e);
        },
      };
      return (
        i.get &&
          (n.get = function () {
            return i.get.call(this);
          }),
        n
      );
    })(e, t, o);
  throw new Error("@ariaProperty only supports TypeScript Decorators");
}
const Tn = {
    ATTRIBUTE: 1,
    CHILD: 2,
    PROPERTY: 3,
    BOOLEAN_ATTRIBUTE: 4,
    EVENT: 5,
    ELEMENT: 6,
  },
  On =
    (e) =>
    (...t) => ({ _$litDirective$: e, values: t });
class Nn {
  constructor(e) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, o) {
    (this._$Ct = e), (this._$AM = t), (this._$Ci = o);
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
const Rn = On(
    class extends Nn {
      constructor(e) {
        var t;
        if (
          (super(e),
          e.type !== Tn.ATTRIBUTE ||
            "class" !== e.name ||
            (null === (t = e.strings) || void 0 === t ? void 0 : t.length) > 2)
        )
          throw Error(
            "`classMap()` can only be used in the `class` attribute and must be the only part in the attribute."
          );
      }
      render(e) {
        return (
          " " +
          Object.keys(e)
            .filter((t) => e[t])
            .join(" ") +
          " "
        );
      }
      update(e, [t]) {
        var o, r;
        if (void 0 === this.nt) {
          (this.nt = new Set()),
            void 0 !== e.strings &&
              (this.st = new Set(
                e.strings
                  .join(" ")
                  .split(/\s/)
                  .filter((e) => "" !== e)
              ));
          for (const e in t)
            t[e] &&
              !(null === (o = this.st) || void 0 === o ? void 0 : o.has(e)) &&
              this.nt.add(e);
          return this.render(t);
        }
        const i = e.element.classList;
        this.nt.forEach((e) => {
          e in t || (i.remove(e), this.nt.delete(e));
        });
        for (const e in t) {
          const o = !!t[e];
          o === this.nt.has(e) ||
            (null === (r = this.st) || void 0 === r ? void 0 : r.has(e)) ||
            (o ? (i.add(e), this.nt.add(e)) : (i.remove(e), this.nt.delete(e)));
        }
        return J;
      }
    }
  ),
  zn = (e) => (null != e ? e : W),
  In = On(
    class extends Nn {
      constructor(e) {
        var t;
        if (
          (super(e),
          e.type !== Tn.ATTRIBUTE ||
            "style" !== e.name ||
            (null === (t = e.strings) || void 0 === t ? void 0 : t.length) > 2)
        )
          throw Error(
            "The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute."
          );
      }
      render(e) {
        return Object.keys(e).reduce((t, o) => {
          const r = e[o];
          return null == r
            ? t
            : t +
                `${(o = o
                  .replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&")
                  .toLowerCase())}:${r};`;
        }, "");
      }
      update(e, [t]) {
        const { style: o } = e.element;
        if (void 0 === this.vt) {
          this.vt = new Set();
          for (const e in t) this.vt.add(e);
          return this.render(t);
        }
        this.vt.forEach((e) => {
          null == t[e] &&
            (this.vt.delete(e),
            e.includes("-") ? o.removeProperty(e) : (o[e] = ""));
        });
        for (const e in t) {
          const r = t[e];
          null != r &&
            (this.vt.add(e),
            e.includes("-") ? o.setProperty(e, r) : (o[e] = r));
        }
        return J;
      }
    }
  );
class Dn extends ge {
  constructor() {
    super(...arguments),
      (this.indeterminate = !1),
      (this.progress = 0),
      (this.density = 0),
      (this.closed = !1);
  }
  open() {
    this.closed = !1;
  }
  close() {
    this.closed = !0;
  }
  render() {
    const e = {
        "mdc-circular-progress--closed": this.closed,
        "mdc-circular-progress--indeterminate": this.indeterminate,
      },
      t = 48 + 4 * this.density,
      o = { width: `${t}px`, height: `${t}px` };
    return Y`
      <div
        class="mdc-circular-progress ${Rn(e)}"
        style="${In(o)}"
        role="progressbar"
        aria-label="${zn(this.ariaLabel)}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="${zn(this.indeterminate ? void 0 : this.progress)}">
        ${this.renderDeterminateContainer()}
        ${this.renderIndeterminateContainer()}
      </div>`;
  }
  renderDeterminateContainer() {
    const e = 48 + 4 * this.density,
      t = e / 2,
      o =
        this.density >= -3
          ? 18 + (11 * this.density) / 6
          : 12.5 + (5 * (this.density + 3)) / 4,
      r = 6.2831852 * o,
      i = (1 - this.progress) * r,
      a =
        this.density >= -3
          ? 4 + this.density * (1 / 3)
          : 3 + (this.density + 3) * (1 / 6);
    return Y`
      <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic"
             viewBox="0 0 ${e} ${e}">
          <circle class="mdc-circular-progress__determinate-track"
                  cx="${t}" cy="${t}" r="${o}"
                  stroke-width="${a}"></circle>
          <circle class="mdc-circular-progress__determinate-circle"
                  cx="${t}" cy="${t}" r="${o}"
                  stroke-dasharray="${6.2831852 * o}"
                  stroke-dashoffset="${i}"
                  stroke-width="${a}"></circle>
        </svg>
      </div>`;
  }
  renderIndeterminateContainer() {
    return Y`
      <div class="mdc-circular-progress__indeterminate-container">
        <div class="mdc-circular-progress__spinner-layer">
          ${this.renderIndeterminateSpinnerLayer()}
        </div>
      </div>`;
  }
  renderIndeterminateSpinnerLayer() {
    const e = 48 + 4 * this.density,
      t = e / 2,
      o =
        this.density >= -3
          ? 18 + (11 * this.density) / 6
          : 12.5 + (5 * (this.density + 3)) / 4,
      r = 6.2831852 * o,
      i = 0.5 * r,
      a =
        this.density >= -3
          ? 4 + this.density * (1 / 3)
          : 3 + (this.density + 3) * (1 / 6);
    return Y`
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${e} ${e}">
            <circle cx="${t}" cy="${t}" r="${o}"
                    stroke-dasharray="${r}"
                    stroke-dashoffset="${i}"
                    stroke-width="${a}"></circle>
          </svg>
        </div>
        <div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${e} ${e}">
            <circle cx="${t}" cy="${t}" r="${o}"
                    stroke-dasharray="${r}"
                    stroke-dashoffset="${i}"
                    stroke-width="${0.8 * a}"></circle>
          </svg>
        </div>
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${e} ${e}">
            <circle cx="${t}" cy="${t}" r="${o}"
                    stroke-dasharray="${r}"
                    stroke-dashoffset="${i}"
                    stroke-width="${a}"></circle>
          </svg>
        </div>`;
  }
  update(e) {
    super.update(e),
      e.has("progress") &&
        (this.progress > 1 && (this.progress = 1),
        this.progress < 0 && (this.progress = 0));
  }
}
wn([Ce({ type: Boolean, reflect: !0 })], Dn.prototype, "indeterminate", void 0),
  wn([Ce({ type: Number, reflect: !0 })], Dn.prototype, "progress", void 0),
  wn([Ce({ type: Number, reflect: !0 })], Dn.prototype, "density", void 0),
  wn([Ce({ type: Boolean, reflect: !0 })], Dn.prototype, "closed", void 0),
  wn(
    [Pn, Ce({ type: String, attribute: "aria-label" })],
    Dn.prototype,
    "ariaLabel",
    void 0
  );
const jn = b`.mdc-circular-progress__determinate-circle,.mdc-circular-progress__indeterminate-circle-graphic{stroke:#6200ee;stroke:var(--mdc-theme-primary, #6200ee)}.mdc-circular-progress__determinate-track{stroke:transparent}@keyframes mdc-circular-progress-container-rotate{to{transform:rotate(360deg)}}@keyframes mdc-circular-progress-spinner-layer-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes mdc-circular-progress-color-1-fade-in-out{from{opacity:.99}25%{opacity:.99}26%{opacity:0}89%{opacity:0}90%{opacity:.99}to{opacity:.99}}@keyframes mdc-circular-progress-color-2-fade-in-out{from{opacity:0}15%{opacity:0}25%{opacity:.99}50%{opacity:.99}51%{opacity:0}to{opacity:0}}@keyframes mdc-circular-progress-color-3-fade-in-out{from{opacity:0}40%{opacity:0}50%{opacity:.99}75%{opacity:.99}76%{opacity:0}to{opacity:0}}@keyframes mdc-circular-progress-color-4-fade-in-out{from{opacity:0}65%{opacity:0}75%{opacity:.99}90%{opacity:.99}to{opacity:0}}@keyframes mdc-circular-progress-left-spin{from{transform:rotate(265deg)}50%{transform:rotate(130deg)}to{transform:rotate(265deg)}}@keyframes mdc-circular-progress-right-spin{from{transform:rotate(-265deg)}50%{transform:rotate(-130deg)}to{transform:rotate(-265deg)}}.mdc-circular-progress{display:inline-flex;position:relative;direction:ltr;line-height:0;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-circular-progress__determinate-container,.mdc-circular-progress__indeterminate-circle-graphic,.mdc-circular-progress__indeterminate-container,.mdc-circular-progress__spinner-layer{position:absolute;width:100%;height:100%}.mdc-circular-progress__determinate-container{transform:rotate(-90deg)}.mdc-circular-progress__indeterminate-container{font-size:0;letter-spacing:0;white-space:nowrap;opacity:0}.mdc-circular-progress__determinate-circle-graphic,.mdc-circular-progress__indeterminate-circle-graphic{fill:transparent}.mdc-circular-progress__determinate-circle{transition:stroke-dashoffset 500ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-circular-progress__gap-patch{position:absolute;top:0;left:47.5%;box-sizing:border-box;width:5%;height:100%;overflow:hidden}.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic{left:-900%;width:2000%;transform:rotate(180deg)}.mdc-circular-progress__circle-clipper{display:inline-flex;position:relative;width:50%;height:100%;overflow:hidden}.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic{width:200%}.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{left:-100%}.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container{opacity:0}.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container{opacity:1}.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container{animation:mdc-circular-progress-container-rotate 1568.2352941176ms linear infinite}.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__color-1{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,mdc-circular-progress-color-1-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__color-2{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,mdc-circular-progress-color-2-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__color-3{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,mdc-circular-progress-color-3-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__color-4{animation:mdc-circular-progress-spinner-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,mdc-circular-progress-color-4-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic{animation:mdc-circular-progress-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both}.mdc-circular-progress--closed{opacity:0}:host{display:inline-flex}.mdc-circular-progress__determinate-track{stroke:transparent;stroke:var(--mdc-circular-progress-track-color, transparent)}`;
let Bn = class extends Dn {};
(Bn.styles = [jn]),
  (Bn = wn([be("mwc-circular-progress")], Bn)),
  s(
    [be("ha-circular-progress")],
    function (e, o) {
      class i extends o {
        constructor(...t) {
          super(...t), e(this);
        }
      }
      return {
        F: i,
        d: [
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "active",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Ce()],
            key: "alt",
            value: () => "Loading",
          },
          {
            kind: "field",
            decorators: [Ce()],
            key: "size",
            value: () => "medium",
          },
          { kind: "set", key: "density", value: function (e) {} },
          {
            kind: "get",
            key: "density",
            value: function () {
              switch (this.size) {
                case "tiny":
                  return -8;
                case "small":
                  return -5;
                case "medium":
                default:
                  return 0;
                case "large":
                  return 5;
              }
            },
          },
          { kind: "set", key: "indeterminate", value: function (e) {} },
          {
            kind: "get",
            key: "indeterminate",
            value: function () {
              return this.active;
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return [
                r(t(i), "styles", this),
                b`
        :host {
          overflow: hidden;
        }
      `,
              ];
            },
          },
        ],
      };
    },
    Bn
  );
var $n =
    "M4 2A2 2 0 0 0 2 4V12H4V8H6V12H8V4A2 2 0 0 0 6 2H4M4 4H6V6H4M22 15.5V14A2 2 0 0 0 20 12H16V22H20A2 2 0 0 0 22 20V18.5A1.54 1.54 0 0 0 20.5 17A1.54 1.54 0 0 0 22 15.5M20 20H18V18H20V20M20 16H18V14H20M5.79 21.61L4.21 20.39L18.21 2.39L19.79 3.61Z",
  Fn =
    "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
  Un =
    "M18 16H14V18H18V20L21 17L18 14V16M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14",
  Zn =
    "M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z",
  Gn =
    "M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4M11,6A2,2 0 0,0 9,8A2,2 0 0,0 11,10A2,2 0 0,0 13,8A2,2 0 0,0 11,6M11,13C12.1,13 13.66,13.23 15.11,13.69C14.5,14.07 14,14.6 13.61,15.23C12.79,15.03 11.89,14.9 11,14.9C8.03,14.9 4.9,16.36 4.9,17V18.1H13.04C13.13,18.8 13.38,19.44 13.76,20H3V17C3,14.34 8.33,13 11,13M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z",
  qn =
    "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",
  Kn =
    "M11 9C8.79 9 7 10.79 7 13S8.79 17 11 17 15 15.21 15 13 13.21 9 11 9M11 15C9.9 15 9 14.11 9 13S9.9 11 11 11 13 11.9 13 13 12.11 15 11 15M7 4H14C16.21 4 18 5.79 18 8V9H16V8C16 6.9 15.11 6 14 6H7C5.9 6 5 6.9 5 8V20H16V18H18V22H3V8C3 5.79 4.79 4 7 4M19 10.5C19 10.5 21 12.67 21 14C21 15.1 20.1 16 19 16S17 15.1 17 14C17 12.67 19 10.5 19 10.5",
  Yn =
    "M22.1 21.5L2.4 1.7L1.1 3L3.8 5.7C3.3 6.3 3 7.1 3 8V22H18V19.9L20.8 22.7L22.1 21.5M9.6 11.5L12.4 14.3C12.1 14.7 11.6 15 11 15C9.9 15 9 14.1 9 13C9 12.4 9.3 11.9 9.6 11.5M16 17.9V20H5V8C5 7.7 5.1 7.4 5.2 7.1L8.2 10.1C7.5 10.8 7 11.9 7 13C7 15.2 8.8 17 11 17C12.1 17 13.2 16.5 13.9 15.8L16 17.9M17 13.8C17.1 12.5 19 10.5 19 10.5S21 12.7 21 14C21 15 20.2 15.9 19.2 16L17 13.8M9.2 6L7.2 4H14C16.2 4 18 5.8 18 8V9H16V8C16 6.9 15.1 6 14 6H9.2Z",
  Xn =
    "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  Jn = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z",
  Wn =
    "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  Qn =
    "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  es = "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16",
  ts =
    "M4.4,16.5C4.4,15.6 4.7,14.7 5.2,13.9C5.7,13.1 6.7,12.2 8.2,11.2C7.3,10.1 6.8,9.3 6.5,8.7C6.1,8 6,7.4 6,6.7C6,5.2 6.4,4.1 7.3,3.2C8.2,2.3 9.4,2 10.9,2C12.2,2 13.3,2.4 14.2,3.2C15.1,4 15.5,5 15.5,6.1C15.5,6.9 15.3,7.6 14.9,8.3C14.5,9 13.8,9.7 12.8,10.4L11.4,11.5L15.7,16.7C16.3,15.5 16.6,14.3 16.6,12.8H18.8C18.8,15.1 18.3,17 17.2,18.5L20,21.8H17L15.7,20.3C15,20.9 14.3,21.3 13.4,21.6C12.5,21.9 11.6,22.1 10.7,22.1C8.8,22.1 7.3,21.6 6.1,20.6C5,19.5 4.4,18.2 4.4,16.5M10.7,20C12,20 13.2,19.5 14.3,18.5L9.6,12.8L9.2,13.1C7.7,14.2 7,15.3 7,16.5C7,17.6 7.3,18.4 8,19C8.7,19.6 9.5,20 10.7,20M8.5,6.7C8.5,7.6 9,8.6 10.1,9.9L11.7,8.8C12.3,8.4 12.7,8 12.9,7.6C13.1,7.2 13.2,6.7 13.2,6.2C13.2,5.6 13,5.1 12.5,4.7C12.1,4.3 11.5,4.1 10.8,4.1C10.1,4.1 9.5,4.3 9.1,4.8C8.7,5.3 8.5,5.9 8.5,6.7Z",
  os =
    "M20,19H4.09L14.18,4.43L15.82,5.57L11.28,12.13C12.89,12.96 14,14.62 14,16.54C14,16.7 14,16.85 13.97,17H20V19M7.91,17H11.96C12,16.85 12,16.7 12,16.54C12,15.28 11.24,14.22 10.14,13.78L7.91,17Z",
  rs =
    "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L9.88,9.88L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L14.12,14.12L6.59,17.89C8,19.2 9.91,20 12,20M12,12L11.23,11.23L9.7,14.3L12.77,12.77L12,12M12,17.5H13V19H12V17.5M15.88,15.89L16.59,15.18L17.65,16.24L16.94,16.95L15.88,15.89M17.5,12V11H19V12H17.5M12,6.5H11V5H12V6.5M8.12,8.11L7.41,8.82L6.35,7.76L7.06,7.05L8.12,8.11M6.5,12V13H5V12H6.5Z",
  is =
    "M21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V4C23 2.9 22.1 2 21 2M21 7H3V4H21V7Z",
  as =
    "M13,20V4H15.03V20H13M10,20V4H12.03V20H10M5,8L9.03,12L5,16V13H2V11H5V8M20,16L16,12L20,8V11H23V13H20V16Z",
  ns =
    "M11,5H8L12,1L16,5H13V9.43C12.25,9.89 11.58,10.46 11,11.12V5M22,11L18,7V10C14.39,9.85 11.31,12.57 11,16.17C9.44,16.72 8.62,18.44 9.17,20C9.72,21.56 11.44,22.38 13,21.83C14.56,21.27 15.38,19.56 14.83,18C14.53,17.14 13.85,16.47 13,16.17C13.47,12.17 17.47,11.97 17.95,11.97V14.97L22,11M10.63,11.59C9.3,10.57 7.67,10 6,10V7L2,11L6,15V12C7.34,12.03 8.63,12.5 9.64,13.4C9.89,12.76 10.22,12.15 10.63,11.59Z",
  ss =
    "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
  ls = "M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z",
  ds =
    "M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M11,6V14.5L7.5,11L6.08,12.42L12,18.34L17.92,12.42L16.5,11L13,14.5V6H11Z",
  cs =
    "M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z",
  ps = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",
  us =
    "M6.45,17.45L1,12L6.45,6.55L7.86,7.96L4.83,11H19.17L16.14,7.96L17.55,6.55L23,12L17.55,17.45L16.14,16.04L19.17,13H4.83L7.86,16.04L6.45,17.45Z",
  hs =
    "M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z",
  ms = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
  _s =
    "M21,19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19C20.11,3 21,3.9 21,5V19M13,18V9.5L16.5,13L17.92,11.58L12,5.66L6.08,11.58L7.5,13L11,9.5V18H13Z",
  fs =
    "M21.5 9.5L20.09 10.92L17 7.83V13.5C17 17.09 14.09 20 10.5 20H4V18H10.5C13 18 15 16 15 13.5V7.83L11.91 10.91L10.5 9.5L16 4L21.5 9.5Z",
  gs =
    "M11,17A1,1 0 0,0 12,18A1,1 0 0,0 13,17A1,1 0 0,0 12,16A1,1 0 0,0 11,17M11,3V7H13V5.08C16.39,5.57 19,8.47 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,10.32 5.59,8.78 6.58,7.58L12,13L13.41,11.59L6.61,4.79V4.81C4.42,6.45 3,9.05 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M18,12A1,1 0 0,0 17,11A1,1 0 0,0 16,12A1,1 0 0,0 17,13A1,1 0 0,0 18,12M6,12A1,1 0 0,0 7,13A1,1 0 0,0 8,12A1,1 0 0,0 7,11A1,1 0 0,0 6,12Z",
  ys =
    "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  bs =
    "M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  vs =
    "M16,17H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  Cs =
    "M16,15H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  As =
    "M16,14H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  Hs =
    "M16,13H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  ws =
    "M16,12H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  Ls =
    "M16,10H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  Vs =
    "M16,9H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  ks =
    "M16,8H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  Ms =
    "M13 14H11V8H13M13 18H11V16H13M16.7 4H15V2H9V4H7.3C6.6 4 6 4.6 6 5.3V20.6C6 21.4 6.6 22 7.3 22H16.6C17.3 22 17.9 21.4 17.9 20.7V5.3C18 4.6 17.4 4 16.7 4Z",
  xs =
    "M14 20H6V6H14M14.67 4H13V2H7V4H5.33C4.6 4 4 4.6 4 5.33V20.67C4 21.4 4.6 22 5.33 22H14.67C15.4 22 16 21.4 16 20.67V5.33C16 4.6 15.4 4 14.67 4M21 7H19V13H21V8M21 15H19V17H21V15Z",
  Ss =
    "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15",
  Es =
    "M23.05,11H20.05V4L15.05,14H18.05V22M12,18H4L4.05,6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z",
  Ps =
    "M23.05,11H20.05V4L15.05,14H18.05V22M12.05,17H4.05V6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z",
  Ts =
    "M12,15H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  Os =
    "M13 4H11V2H5V4H3C2.4 4 2 4.4 2 5V21C2 21.6 2.4 22 3 22H13C13.6 22 14 21.6 14 21V5C14 4.4 13.6 4 13 4M12 14.5H4V6H12V14.5M23 11H20V4L15 14H18V22",
  Ns =
    "M23,11H20V4L15,14H18V22M12,13H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  Rs =
    "M12,11H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  zs =
    "M12,10H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  Is =
    "M23,11H20V4L15,14H18V22M12,9H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  Ds =
    "M23,11H20V4L15,14H18V22M12,8H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  js =
    "M23.05,11H20.05V4L15.05,14H18.05V22M12,20H4L4.05,6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z",
  Bs =
    "M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  $s =
    "M15.07,12.25L14.17,13.17C13.63,13.71 13.25,14.18 13.09,15H11.05C11.16,14.1 11.56,13.28 12.17,12.67L13.41,11.41C13.78,11.05 14,10.55 14,10C14,8.89 13.1,8 12,8A2,2 0 0,0 10,10H8A4,4 0 0,1 12,6A4,4 0 0,1 16,10C16,10.88 15.64,11.68 15.07,12.25M13,19H11V17H13M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.67C17.4,22 18,21.4 18,20.66V5.33C18,4.59 17.4,4 16.67,4Z",
  Fs =
    "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21",
  Us =
    "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z",
  Zs =
    "M3,2H21A1,1 0 0,1 22,3V5A1,1 0 0,1 21,6H20V13A1,1 0 0,1 19,14H13V16.17C14.17,16.58 15,17.69 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19C9,17.69 9.83,16.58 11,16.17V14H5A1,1 0 0,1 4,13V6H3A1,1 0 0,1 2,5V3A1,1 0 0,1 3,2M12,18A1,1 0 0,0 11,19A1,1 0 0,0 12,20A1,1 0 0,0 13,19A1,1 0 0,0 12,18Z",
  Gs =
    "M3 2H21C21.55 2 22 2.45 22 3V5C22 5.55 21.55 6 21 6H20V7C20 7.55 19.55 8 19 8H13V10.17C14.17 10.58 15 11.7 15 13C15 14.66 13.66 16 12 16C10.34 16 9 14.66 9 13C9 11.69 9.84 10.58 11 10.17V8H5C4.45 8 4 7.55 4 7V6H3C2.45 6 2 5.55 2 5V3C2 2.45 2.45 2 3 2M12 12C11.45 12 11 12.45 11 13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13C13 12.45 12.55 12 12 12Z",
  qs =
    "M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12L17.71,7.71Z",
  Ks =
    "M19,10L17,12L19,14L21,12M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12M7,12L5,10L3,12L5,14L7,12Z",
  Ys = "M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z",
  Xs =
    "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z",
  Js =
    "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z",
  Ws =
    "M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z",
  Qs =
    "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z",
  el =
    "M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z",
  tl =
    "M14,4L16.29,6.29L13.41,9.17L14.83,10.59L17.71,7.71L20,10V4M10,4H4V10L6.29,7.71L11,12.41V20H13V11.59L7.71,6.29",
  ol =
    "M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z",
  rl =
    "M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3Z",
  il =
    "M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M19,7H5V8.63C8.96,9.91 12.09,13.04 13.37,17H19M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z",
  al =
    "M1.6,1.27L0.25,2.75L1.41,3.8C1.16,4.13 1,4.55 1,5V8H3V5.23L18.2,19H14V21H20.41L22.31,22.72L23.65,21.24M6.5,3L8.7,5H21V16.14L23,17.95V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.08,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z",
  nl =
    "M22 5H4V2H2V22H22V20H4V9C8.09 9 10.13 11 12.29 13.21S17.09 18 22 18V16C17.91 16 15.87 14 13.71 11.79S8.91 7 4 7H22Z",
  sl = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
  ll =
    "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
  dl =
    "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z",
  cl =
    "M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M8,10.37L9.24,9.13L10.93,10.83L14.76,7L16,8.5L10.93,13.57L8,10.37Z",
  pl =
    "M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  ul =
    "M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z",
  hl = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  ml =
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  _l =
    "M12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z",
  fl =
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z",
  gl =
    "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  yl =
    "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  bl =
    "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z",
  vl =
    "M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M15.54,12.12L13.41,10L15.53,7.87L14.12,6.46L12,8.59L9.88,6.46L8.47,7.87L10.59,10L8.47,12.13L9.88,13.54L12,11.41L14.12,13.54L15.54,12.12Z",
  Cl =
    "M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z",
  Al =
    "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z",
  Hl =
    "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
  wl =
    "M9 22C8.4 22 8 21.6 8 21V18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2H20C21.1 2 22 2.9 22 4V16C22 17.1 21.1 18 20 18H13.9L10.2 21.7C10 21.9 9.8 22 9.5 22H9M13 11V5H11V11M13 15V13H11V15H13Z",
  Ll =
    "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",
  Vl =
    "M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z",
  kl =
    "M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z",
  Ml =
    "M17,19H7V5H17M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5C19,3.89 18.1,3 17,3Z",
  xl =
    "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z",
  Sl =
    "M12.43 11C12.28 10.84 10 7 7 7S2.32 10.18 2 11V13H11.57C11.72 13.16 14 17 17 17S21.68 13.82 22 13V11H12.43M7 9C8.17 9 9.18 9.85 10 11H4.31C4.78 10.17 5.54 9 7 9M17 15C15.83 15 14.82 14.15 14 13H19.69C19.22 13.83 18.46 15 17 15Z",
  El =
    "M23 3H1V1H23V3M2 22H6C6 19 4 17 4 17C10 13 11 4 11 4H2V22M22 4H13C13 4 14 13 20 17C20 17 18 19 18 22H22V4Z",
  Pl = "M23 3H1V1H23V3M2 22H11V4H2V22M22 4H13V22H22V4Z",
  Tl =
    "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
  Ol =
    "M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z",
  Nl =
    "M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",
  Rl =
    "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",
  zl =
    "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  Il = "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",
  Dl =
    "M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z",
  jl =
    "M8.11,19.45C5.94,18.65 4.22,16.78 3.71,14.35L2.05,6.54C1.81,5.46 2.5,4.4 3.58,4.17L13.35,2.1L13.38,2.09C14.45,1.88 15.5,2.57 15.72,3.63L16.07,5.3L20.42,6.23H20.45C21.5,6.47 22.18,7.53 21.96,8.59L20.3,16.41C19.5,20.18 15.78,22.6 12,21.79C10.42,21.46 9.08,20.61 8.11,19.45V19.45M20,8.18L10.23,6.1L8.57,13.92V13.95C8,16.63 9.73,19.27 12.42,19.84C15.11,20.41 17.77,18.69 18.34,16L20,8.18M16,16.5C15.37,17.57 14.11,18.16 12.83,17.89C11.56,17.62 10.65,16.57 10.5,15.34L16,16.5M8.47,5.17L4,6.13L5.66,13.94L5.67,13.97C5.82,14.68 6.12,15.32 6.53,15.87C6.43,15.1 6.45,14.3 6.62,13.5L7.05,11.5C6.6,11.42 6.21,11.17 6,10.81C6.06,10.2 6.56,9.66 7.25,9.5C7.33,9.5 7.4,9.5 7.5,9.5L8.28,5.69C8.32,5.5 8.38,5.33 8.47,5.17M15.03,12.23C15.35,11.7 16.03,11.42 16.72,11.57C17.41,11.71 17.91,12.24 18,12.86C17.67,13.38 17,13.66 16.3,13.5C15.61,13.37 15.11,12.84 15.03,12.23M10.15,11.19C10.47,10.66 11.14,10.38 11.83,10.53C12.5,10.67 13.03,11.21 13.11,11.82C12.78,12.34 12.11,12.63 11.42,12.5C10.73,12.33 10.23,11.8 10.15,11.19M11.97,4.43L13.93,4.85L13.77,4.05L11.97,4.43Z",
  Bl = "M10 3H14V14H10V3M10 21V17H14V21H10Z",
  $l =
    "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",
  Fl =
    "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z",
  Ul =
    "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  Zl =
    "M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z",
  Gl =
    "M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z",
  ql =
    "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,13H11V18A2,2 0 0,1 9,20A2,2 0 0,1 7,18A2,2 0 0,1 9,16C9.4,16 9.7,16.1 10,16.3V11H13V13M13,9V3.5L18.5,9H13Z",
  Kl = "M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z",
  Yl =
    "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",
  Xl = "M7,2V13H10V22L17,10H13L17,2H7Z",
  Jl =
    "M6,22A3,3 0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 21,19A3,3 0 0,1 18,22H6M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59 18.82,18.43L16.53,14.47L14,17L8.93,11.93L5.18,18.43C5.07,18.59 5,18.79 5,19M13,10A1,1 0 0,0 12,11A1,1 0 0,0 13,12A1,1 0 0,0 14,11A1,1 0 0,0 13,10Z",
  Wl =
    "M3,13A9,9 0 0,0 12,22C12,17 7.97,13 3,13M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5.6,10.25A2.5,2.5 0 0,0 8.1,12.75C8.63,12.75 9.12,12.58 9.5,12.31C9.5,12.37 9.5,12.43 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5C14.5,12.43 14.5,12.37 14.5,12.31C14.88,12.58 15.37,12.75 15.9,12.75C17.28,12.75 18.4,11.63 18.4,10.25C18.4,9.25 17.81,8.4 16.97,8C17.81,7.6 18.4,6.74 18.4,5.75C18.4,4.37 17.28,3.25 15.9,3.25C15.37,3.25 14.88,3.41 14.5,3.69C14.5,3.63 14.5,3.56 14.5,3.5A2.5,2.5 0 0,0 12,1A2.5,2.5 0 0,0 9.5,3.5C9.5,3.56 9.5,3.63 9.5,3.69C9.12,3.41 8.63,3.25 8.1,3.25A2.5,2.5 0 0,0 5.6,5.75C5.6,6.74 6.19,7.6 7.03,8C6.19,8.4 5.6,9.25 5.6,10.25M12,22A9,9 0 0,0 21,13C16,13 12,17 12,22Z",
  Ql =
    "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z",
  ed =
    "M19.39 10.74L11 19.13V20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.1 6 22 6.89 22 8V10.15C21.74 10.06 21.46 10 21.17 10C20.5 10 19.87 10.26 19.39 10.74M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47Z",
  td =
    "M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z",
  od =
    "M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z",
  rd =
    "M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z",
  id =
    "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z",
  ad = "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z",
  nd =
    "M9 6V11H7V7H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V7H17V11H15V6H13V11H11V6H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z",
  sd =
    "M15 6V11H13V7H11V11H9V9H7V21H9V19H11V21H12.09C12.03 20.67 12 20.34 12 20C12 18.82 12.35 17.67 13 16.69V13H15V14.81C15.62 14.45 16.3 14.21 17 14.09V13H19V14.09C19.7 14.21 20.38 14.45 21 14.81V13H22V11H21V6H19V11H17V6H15M9 13H11V17H9V13M19 17V19H15V21H19V23L22 20L19 17Z",
  ld =
    "M7 21V7H5V11H3V9H1V21H3V19H5V21H7M3 17V13H5V17H3M21 9V11H19V7H17V21H19V19H21V21H23V9H21M21 17H19V13H21V17Z",
  dd =
    "M2,4C5,10 5,14 2,20H8C13,20 19,16 22,12C19,8 13,4 8,4H2M5,6H8C11.5,6 16.3,9 19.3,12C16.3,15 11.5,18 8,18H5C6.4,13.9 6.4,10.1 5,6Z",
  cd =
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z",
  pd =
    "M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5M11,3A6,6 0 0,1 17,9C17,10.7 16.29,12.23 15.16,13.33L14.16,12.88C15.28,11.96 16,10.56 16,9A5,5 0 0,0 11,4A5,5 0 0,0 6,9C6,11.05 7.23,12.81 9,13.58V14.66C6.67,13.83 5,11.61 5,9A6,6 0 0,1 11,3Z",
  ud =
    "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z",
  hd =
    "M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z",
  md =
    "M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z",
  _d =
    "M7,2A6,6 0 0,0 1,8A6,6 0 0,0 7,14A6,6 0 0,0 13,8A6,6 0 0,0 7,2M21.5,6A1.5,1.5 0 0,0 20,7.5A1.5,1.5 0 0,0 21.5,9A1.5,1.5 0 0,0 23,7.5A1.5,1.5 0 0,0 21.5,6M17,8A3,3 0 0,0 14,11A3,3 0 0,0 17,14A3,3 0 0,0 20,11A3,3 0 0,0 17,8M17,15A3.5,3.5 0 0,0 13.5,18.5A3.5,3.5 0 0,0 17,22A3.5,3.5 0 0,0 20.5,18.5A3.5,3.5 0 0,0 17,15Z",
  fd =
    "M15,12C13.89,12 13,12.89 13,14A2,2 0 0,0 15,16A2,2 0 0,0 17,14C17,12.89 16.1,12 15,12M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M14,9C14,7.89 13.1,7 12,7C10.89,7 10,7.89 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9M9,12A2,2 0 0,0 7,14A2,2 0 0,0 9,16A2,2 0 0,0 11,14C11,12.89 10.1,12 9,12Z",
  gd =
    "M13 24C9.74 24 6.81 22 5.6 19L2.57 11.37C2.26 10.58 3 9.79 3.81 10.05L4.6 10.31C5.16 10.5 5.62 10.92 5.84 11.47L7.25 15H8V3.25C8 2.56 8.56 2 9.25 2S10.5 2.56 10.5 3.25V12H11.5V1.25C11.5 .56 12.06 0 12.75 0S14 .56 14 1.25V12H15V2.75C15 2.06 15.56 1.5 16.25 1.5C16.94 1.5 17.5 2.06 17.5 2.75V12H18.5V5.75C18.5 5.06 19.06 4.5 19.75 4.5S21 5.06 21 5.75V16C21 20.42 17.42 24 13 24Z",
  yd =
    "M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",
  bd = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  vd =
    "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z",
  Cd =
    "M12,3L2,12H5V20H19V12H22L12,3M12,8.5C14.34,8.5 16.46,9.43 18,10.94L16.8,12.12C15.58,10.91 13.88,10.17 12,10.17C10.12,10.17 8.42,10.91 7.2,12.12L6,10.94C7.54,9.43 9.66,8.5 12,8.5M12,11.83C13.4,11.83 14.67,12.39 15.6,13.3L14.4,14.47C13.79,13.87 12.94,13.5 12,13.5C11.06,13.5 10.21,13.87 9.6,14.47L8.4,13.3C9.33,12.39 10.6,11.83 12,11.83M12,15.17C12.94,15.17 13.7,15.91 13.7,16.83C13.7,17.75 12.94,18.5 12,18.5C11.06,18.5 10.3,17.75 10.3,16.83C10.3,15.91 11.06,15.17 12,15.17Z",
  Ad =
    "M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",
  Hd =
    "M10 7V9H9V15H10V17H6V15H7V9H6V7H10M16 7C17.11 7 18 7.9 18 9V15C18 16.11 17.11 17 16 17H12V7M16 9H14V15H16V9Z",
  wd =
    "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z",
  Ld =
    "M18,8H6V18H18M20,20H4V6H8.5L12.04,2.5L15.5,6H20M20,4H16L12,0L8,4H4A2,2 0 0,0 2,6V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V6A2,2 0 0,0 20,4Z",
  Vd =
    "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  kd =
    "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",
  Md =
    "M4,1C2.89,1 2,1.89 2,3V7C2,8.11 2.89,9 4,9H1V11H13V9H10C11.11,9 12,8.11 12,7V3C12,1.89 11.11,1 10,1H4M4,3H10V7H4V3M3,13V18L3,20H10V18H5V13H3M14,13C12.89,13 12,13.89 12,15V19C12,20.11 12.89,21 14,21H11V23H23V21H20C21.11,21 22,20.11 22,19V15C22,13.89 21.11,13 20,13H14M14,15H20V19H14V15Z",
  xd =
    "M4,1C2.89,1 2,1.89 2,3V7C2,8.11 2.89,9 4,9H1V11H13V9H10C11.11,9 12,8.11 12,7V3C12,1.89 11.11,1 10,1H4M4,3H10V7H4V3M14,13C12.89,13 12,13.89 12,15V19C12,20.11 12.89,21 14,21H11V23H23V21H20C21.11,21 22,20.11 22,19V15C22,13.89 21.11,13 20,13H14M3.88,13.46L2.46,14.88L4.59,17L2.46,19.12L3.88,20.54L6,18.41L8.12,20.54L9.54,19.12L7.41,17L9.54,14.88L8.12,13.46L6,15.59L3.88,13.46M14,15H20V19H14V15Z",
  Sd =
    "M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z",
  Ed =
    "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",
  Pd = "M11 15H6L13 1V9H18L11 23V15Z",
  Td =
    "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  Od =
    "M10 17C11.1 17 12 16.1 12 15C12 13.9 11.1 13 10 13C8.9 13 8 13.9 8 15S8.9 17 10 17M16 8C17.1 8 18 8.9 18 10V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H5V6C5 3.2 7.2 1 10 1S15 3.2 15 6V8H16M10 3C8.3 3 7 4.3 7 6V8H13V6C13 4.3 11.7 3 10 3M22 13H20V7H22V13M22 17H20V15H22V17Z",
  Nd =
    "M8.5,2C6,2 4,4 4,6.5V7C2.89,7 2,7.89 2,9V18C2,19.11 2.89,20 4,20H8.72C10.18,21.29 12.06,22 14,22A8,8 0 0,0 22,14A8,8 0 0,0 14,6C13.66,6 13.32,6.03 13,6.08C12.76,3.77 10.82,2 8.5,2M8.5,4A2.5,2.5 0 0,1 11,6.5V7H6V6.5A2.5,2.5 0 0,1 8.5,4M14,8A6,6 0 0,1 20,14A6,6 0 0,1 14,20A6,6 0 0,1 8,14A6,6 0 0,1 14,8M13,10V15L16.64,17.19L17.42,15.9L14.5,14.15V10H13Z",
  Rd =
    "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",
  zd =
    "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
  Id =
    "M17,4H7A5,5 0 0,0 2,9V20H20A2,2 0 0,0 22,18V9A5,5 0 0,0 17,4M10,18H4V9A3,3 0 0,1 7,6A3,3 0 0,1 10,9V18M19,15H17V13H13V11H19V15M9,11H5V9H9V11Z",
  Dd =
    "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  jd =
    "M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z",
  Bd = "M7,10L12,15L17,10H7Z",
  $d = "M7,15L12,10L17,15H7Z",
  Fd =
    "M16 4H15V2H13V4H11V2H9V4H8C5.79 4 4 5.79 4 8V18C4 20.21 5.79 22 8 22H16C18.21 22 20 20.21 20 18V8C20 5.79 18.21 4 16 4M12 18C10.62 18 9.5 16.9 9.5 15.54C9.5 14.45 9.93 14.15 12 11.75C14.05 14.13 14.5 14.45 14.5 15.54C14.5 16.9 13.38 18 12 18M16 10H8V8H16V10Z",
  Ud =
    "M8,7A2,2 0 0,1 10,9V14A2,2 0 0,1 8,16A2,2 0 0,1 6,14V9A2,2 0 0,1 8,7M14,14C14,16.97 11.84,19.44 9,19.92V22H7V19.92C4.16,19.44 2,16.97 2,14H4A4,4 0 0,0 8,18A4,4 0 0,0 12,14H14M21.41,9.41L17.17,13.66L18.18,10H14A2,2 0 0,1 12,8V4A2,2 0 0,1 14,2H20A2,2 0 0,1 22,4V8C22,8.55 21.78,9.05 21.41,9.41Z",
  Zd =
    "M7.27,10L9,7H14.42L15.58,5L15.5,4.5A1.5,1.5 0 0,1 17,3A1.5,1.5 0 0,1 18.5,4.5C18.5,5.21 18,5.81 17.33,5.96L16.37,7.63L17.73,10L18.59,8.5L18.5,8A1.5,1.5 0 0,1 20,6.5A1.5,1.5 0 0,1 21.5,8C21.5,8.71 21,9.3 20.35,9.46L18.89,12L20.62,15C21.39,15.07 22,15.71 22,16.5A1.5,1.5 0 0,1 20.5,18A1.5,1.5 0 0,1 19,16.5V16.24L17.73,14L16.37,16.37L17.33,18.04C18,18.19 18.5,18.79 18.5,19.5A1.5,1.5 0 0,1 17,21A1.5,1.5 0 0,1 15.5,19.5L15.58,19L14.42,17H10.58L9.42,19L9.5,19.5A1.5,1.5 0 0,1 8,21A1.5,1.5 0 0,1 6.5,19.5C6.5,18.79 7,18.19 7.67,18.04L8.63,16.37L4.38,9C3.61,8.93 3,8.29 3,7.5A1.5,1.5 0 0,1 4.5,6A1.5,1.5 0 0,1 6,7.5C6,7.59 6,7.68 6,7.76L7.27,10M10.15,9L8.42,12L10.15,15H14.85L16.58,12L14.85,9H10.15Z",
  Gd =
    "M8 7C6.9 7 6 7.9 6 9V15C6 16.11 6.9 17 8 17H11V15H8V9H11V7H8M14 7C12.9 7 12 7.9 12 9V15C12 16.11 12.9 17 14 17H16C17.11 17 18 16.11 18 15V9C18 7.9 17.11 7 16 7H14M14 9H16V15H14V9",
  qd =
    "M5,7A2,2 0 0,0 3,9V15A2,2 0 0,0 5,17H8V15H5V9H8V7H5M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9M16,10.5V12H19V13.5H17.5A1.5,1.5 0 0,0 16,15V18H20.5V16.5H17.5V15H19A1.5,1.5 0 0,0 20.5,13.5V12A1.5,1.5 0 0,0 19,10.5H16Z",
  Kd =
    "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",
  Yd =
    "M11.4 8.2H15V10H13.2L11.4 8.2M19.67 1H18.33C18.33 3.58 20.42 5.67 23 5.67V4.33C21.16 4.33 19.67 2.84 19.67 1M21 1C21 2.11 21.9 3 23 3V1H21M17 1H15.67C15.67 5.05 18.95 8.33 23 8.33V7C19.69 7 17 4.31 17 1M10 3.8C11 3.8 11.8 3 11.8 2S11 .2 10 .2 8.2 1 8.2 2 9 3.8 10 3.8M2.39 1.73L1.11 3L3.46 5.35L2 5.8V11H3.8V7.33L5.05 6.94L5.68 7.57L2 22H3.8L6.67 13.89L9 17V22H10.8V15.59L8.31 11.05L8.5 10.37L20.84 22.73L22.11 21.46L2.39 1.73M9.38 4.87C9.08 4.37 8.54 4.03 7.92 4.03C7.75 4.03 7.58 4.06 7.42 4.11L7.34 4.14L11.35 8.15L9.38 4.87Z",
  Xd =
    "M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18Z",
  Jd =
    "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z",
  Wd =
    "M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z",
  Qd =
    "M4.27 3L3 4.27L12 13.27V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V15.27L19.73 21L21 19.73L4.27 3M14 7H18V3H12V8.18L14 10.18Z",
  ec =
    "M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z",
  tc =
    "M18,6H13A2,2 0 0,0 11,8V10.28C10.41,10.62 10,11.26 10,12A2,2 0 0,0 12,14C13.11,14 14,13.1 14,12C14,11.26 13.6,10.62 13,10.28V8H16V16H8V8H10V6H8L6,6V18H18M20,20H4V4H20M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20C21.11,22 22,21.1 22,20V4C22,2.89 21.11,2 20,2Z",
  oc =
    "M14.08,4.61L15.92,5.4L14.8,8H19V10H13.95L12.23,14H19V16H11.38L9.92,19.4L8.08,18.61L9.2,16H5V14H10.06L11.77,10H5V8H12.63L14.08,4.61Z",
  rc =
    "M4,17V9H2V7H6V17H4M22,15C22,16.11 21.1,17 20,17H16V15H20V13H18V11H20V9H16V7H20A2,2 0 0,1 22,9V10.5A1.5,1.5 0 0,1 20.5,12A1.5,1.5 0 0,1 22,13.5V15M14,15V17H8V13C8,11.89 8.9,11 10,11H12V9H8V7H12A2,2 0 0,1 14,9V11C14,12.11 13.1,13 12,13H10V15H14Z",
  ic =
    "M5.12,5H18.87L17.93,4H5.93L5.12,5M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M6,18H12V15H6V18Z",
  ac =
    "M5.12,5L5.93,4H17.93L18.87,5M12,17.5L6.5,12H10V10H14V12H17.5L12,17.5M20.54,5.23L19.15,3.55C18.88,3.21 18.47,3 18,3H6C5.53,3 5.12,3.21 4.84,3.55L3.46,5.23C3.17,5.57 3,6 3,6.5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V6.5C21,6 20.83,5.57 20.54,5.23Z",
  nc =
    "M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M5.12,5H18.87L17.93,4H5.93L5.12,5M12,9.5L6.5,15H10V17H14V15H17.5L12,9.5Z",
  sc =
    "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
  lc = "M8,5.14V19.14L19,12.14L8,5.14Z",
  dc =
    "M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M10 16V8L15 12",
  cc =
    "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z",
  pc =
    "M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z",
  uc = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  hc =
    "M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z",
  mc =
    "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",
  _c =
    "M20.84 22.73L15.31 17.2L14.5 18V21H9.5V18L6 14.5V9C6 8.7 6.1 8.41 6.25 8.14L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14.5V9C18 8 17 7 16 7V3H14V7H10.2L17.85 14.65L18 14.5M10 3H8V4.8L10 6.8V3Z",
  fc =
    "M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  gc =
    "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  yc =
    "M2,11H9.17C9.58,9.83 10.69,9 12,9C13.31,9 14.42,9.83 14.83,11H22V13H14.83C14.42,14.17 13.31,15 12,15C10.69,15 9.58,14.17 9.17,13H2V11Z",
  bc =
    "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
  vc =
    "M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z",
  Cc =
    "M12,0C8.96,0 6.21,1.23 4.22,3.22L5.63,4.63C7.26,3 9.5,2 12,2C14.5,2 16.74,3 18.36,4.64L19.77,3.23C17.79,1.23 15.04,0 12,0M7.05,6.05L8.46,7.46C9.37,6.56 10.62,6 12,6C13.38,6 14.63,6.56 15.54,7.46L16.95,6.05C15.68,4.78 13.93,4 12,4C10.07,4 8.32,4.78 7.05,6.05M12,15A2,2 0 0,1 10,13A2,2 0 0,1 12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15M15,9H9A1,1 0 0,0 8,10V22A1,1 0 0,0 9,23H15A1,1 0 0,0 16,22V10A1,1 0 0,0 15,9Z",
  Ac =
    "M18,17H10.5L12.5,15H18M6,17V14.5L13.88,6.65C14.07,6.45 14.39,6.45 14.59,6.65L16.35,8.41C16.55,8.61 16.55,8.92 16.35,9.12L8.47,17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z",
  Hc =
    "M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z",
  wc =
    "M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z",
  Lc =
    "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",
  Vc =
    "M12,5A2,2 0 0,1 14,7C14,7.24 13.96,7.47 13.88,7.69C17.95,8.5 21,11.91 21,16H3C3,11.91 6.05,8.5 10.12,7.69C10.04,7.47 10,7.24 10,7A2,2 0 0,1 12,5M22,19H2V17H22V19Z",
  kc =
    "M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z",
  Mc =
    "M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z",
  xc =
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z",
  Sc =
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5.68C12.5,5.68 12.95,6.11 12.95,6.63V10.11L18,13.26V14.53L12.95,12.95V16.42L14.21,17.37V18.32L12,17.68L9.79,18.32V17.37L11.05,16.42V12.95L6,14.53V13.26L11.05,10.11V6.63C11.05,6.11 11.5,5.68 12,5.68Z",
  Ec =
    "M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",
  Pc =
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z",
  Tc =
    "M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M15.97 14.41C14.13 16.58 10.76 16.5 9 14.34C6.82 11.62 8.36 7.62 11.7 7C12.04 6.95 12.33 7.28 12.21 7.61C11.75 8.84 11.82 10.25 12.53 11.47C13.24 12.69 14.42 13.46 15.71 13.67C16.05 13.72 16.2 14.14 15.97 14.41Z",
  Oc =
    "M1,4.27L2.28,3L20.5,21.22L19.23,22.5L17,20.25C15.57,21.57 13.87,22.54 12,23C6.84,21.74 3,16.55 3,11V6.27L1,4.27M12,1L21,5V11C21,13.28 20.35,15.5 19.23,17.41L5.65,3.82L12,1Z",
  Nc =
    "M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21Z",
  Rc = "M16,4.5V7H5V9H16V11.5L19.5,8M16,12.5V15H5V17H16V19.5L19.5,16",
  zc =
    "M16.5,21C13.5,21 12.31,16.76 11.05,12.28C10.14,9.04 9,5 7.5,5C4.11,5 4,11.93 4,12H2C2,11.63 2.06,3 7.5,3C10.5,3 11.71,7.25 12.97,11.74C13.83,14.8 15,19 16.5,19C19.94,19 20.03,12.07 20.03,12H22.03C22.03,12.37 21.97,21 16.5,21Z",
  Ic =
    "M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z",
  Dc =
    "M10 18C13.3 18 16 15.3 16 12C16 8.7 13.3 6 10 6C6.7 6 4 8.7 4 12C4 15.3 6.7 18 10 18M17 3C18.1 3 19 3.9 19 5V19C19 20.1 18.1 21 17 21H3C1.9 21 1 20.1 1 19V5C1 3.9 1.9 3 3 3H17M6 12C6 9.8 7.8 8 10 8S14 9.8 14 12 12.2 16 10 16 6 14.2 6 12M23 7H21V13H23V8M23 15H21V17H23V15Z",
  jc =
    "M12 4C16.41 4 20 7.59 20 12S16.41 20 12 20 4 16.41 4 12 7.59 4 12 4M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 11C11.45 11 11 11.45 11 12S11.45 13 12 13 13 12.55 13 12 12.55 11 12 11M10.72 9.3C11.11 9.11 11.54 9 12 9S12.89 9.11 13.29 9.3L14 8.57C13.43 8.22 12.74 8 12 8S10.58 8.22 10 8.57L10.72 9.3M15 12C15 12.46 14.89 12.89 14.7 13.29L15.43 14C15.79 13.43 16 12.74 16 12S15.79 10.58 15.43 10L14.7 10.72C14.89 11.11 15 11.54 15 12M9 12C9 11.54 9.11 11.11 9.3 10.72L8.57 10C8.22 10.58 8 11.26 8 12S8.22 13.43 8.57 14L9.3 13.29C9.11 12.89 9 12.46 9 12M13.29 14.7C12.89 14.89 12.46 15 12 15S11.11 14.89 10.72 14.7L10 15.43C10.58 15.79 11.26 16 12 16S13.43 15.79 14 15.43L13.29 14.7M16.89 8.53L16.17 9.25C16.69 10.04 17 11 17 12S16.69 13.96 16.17 14.75L16.89 15.47C17.59 14.5 18 13.3 18 12S17.59 9.5 16.89 8.53M9.25 7.83C10.04 7.31 11 7 12 7S13.96 7.31 14.75 7.83L15.47 7.11C14.5 6.42 13.3 6 12 6S9.5 6.42 8.53 7.11L9.25 7.83M14.75 16.17C13.96 16.69 13 17 12 17S10.04 16.69 9.25 16.17L8.53 16.89C9.5 17.59 10.7 18 12 18S14.5 17.59 15.47 16.89L14.75 16.17M7.83 14.75C7.31 13.96 7 13 7 12S7.31 10.04 7.83 9.25L7.11 8.53C6.42 9.5 6 10.7 6 12S6.42 14.5 7.11 15.47L7.83 14.75Z",
  Bc =
    "M10 4C14.4 4 18 7.6 18 12S14.4 20 10 20 2 16.4 2 12 5.6 4 10 4M10 2C4.5 2 0 6.5 0 12S4.5 22 10 22 20 17.5 20 12 15.5 2 10 2M10 11C9.4 11 9 11.4 9 12S9.4 13 10 13 11 12.6 11 12 10.6 11 10 11M8.7 9.3C9.1 9.1 9.5 9 10 9S10.9 9.1 11.3 9.3L12 8.6C11.4 8.2 10.7 8 10 8S8.6 8.2 8 8.6L8.7 9.3M13 12C13 12.5 12.9 12.9 12.7 13.3L13.4 14C13.8 13.4 14 12.7 14 12S13.8 10.6 13.4 10L12.7 10.7C12.9 11.1 13 11.5 13 12M7 12C7 11.5 7.1 11.1 7.3 10.7L6.6 10C6.2 10.6 6 11.3 6 12S6.2 13.4 6.6 14L7.3 13.3C7.1 12.9 7 12.5 7 12M11.3 14.7C10.9 14.9 10.5 15 10 15S9.1 14.9 8.7 14.7L8 15.4C8.6 15.8 9.3 16 10 16S11.4 15.8 12 15.4L11.3 14.7M14.9 8.5L14.2 9.2C14.7 10 15 11 15 12S14.7 14 14.2 14.8L14.9 15.5C15.6 14.5 16 13.3 16 12S15.6 9.5 14.9 8.5M7.2 7.8C8 7.3 9 7 10 7S12 7.3 12.8 7.8L13.5 7.1C12.5 6.4 11.3 6 10 6S7.5 6.4 6.5 7.1L7.2 7.8M12.8 16.2C12 16.7 11 17 10 17S8 16.7 7.2 16.2L6.5 16.9C7.5 17.6 8.7 18 10 18S12.5 17.6 13.5 16.9L12.8 16.2M5.8 14.8C5.3 14 5 13 5 12S5.3 10 5.8 9.2L5.1 8.5C4.4 9.5 4 10.7 4 12S4.4 14.5 5.1 15.5L5.8 14.8M24 7H22V13H24V8M24 15H22V17H24V15Z",
  $c =
    "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z",
  Fc =
    "M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z",
  Uc =
    "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",
  Zc =
    "M2,5.27L3.28,4L21,21.72L19.73,23L18.27,21.54C17.93,21.83 17.5,22 17,22H7C5.89,22 5,21.1 5,20V8.27L2,5.27M12,18A3,3 0 0,1 9,15C9,14.24 9.28,13.54 9.75,13L8.33,11.6C7.5,12.5 7,13.69 7,15A5,5 0 0,0 12,20C13.31,20 14.5,19.5 15.4,18.67L14,17.25C13.45,17.72 12.76,18 12,18M17,15A5,5 0 0,0 12,10H11.82L5.12,3.3C5.41,2.54 6.14,2 7,2H17A2,2 0 0,1 19,4V17.18L17,15.17V15M12,4C10.89,4 10,4.89 10,6A2,2 0 0,0 12,8A2,2 0 0,0 14,6C14,4.89 13.1,4 12,4Z",
  Gc =
    "M12.28 19.81C11.87 19.92 11.45 20 11 20C8.24 20 6 17.76 6 15S8.24 10 11 10C12.89 10 14.5 11.06 15.37 12.61C16.16 12.23 17.06 12 18 12V4C18 2.89 17.1 2 16 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.54C13 21.37 12.54 20.63 12.28 19.81M11 4C12.11 4 13 4.89 13 6S12.11 8 11 8C9.89 8 9 7.1 9 6C9 4.89 9.89 4 11 4M13.74 13.78C12.7 14.82 12.06 16.24 12 17.81C11.69 17.93 11.36 18 11 18C9.34 18 8 16.66 8 15S9.34 12 11 12C12.22 12 13.27 12.73 13.74 13.78M19 15H21V21H19M15 15H17V21H15V15Z",
  qc =
    "M16 15V21L21 18L16 15M12.28 19.81C11.87 19.92 11.45 20 11 20C8.24 20 6 17.76 6 15S8.24 10 11 10C12.89 10 14.5 11.06 15.37 12.61C16.16 12.23 17.06 12 18 12V4C18 2.89 17.1 2 16 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.54C13 21.37 12.54 20.63 12.28 19.81M11 4C12.11 4 13 4.89 13 6S12.11 8 11 8C9.89 8 9 7.1 9 6C9 4.89 9.89 4 11 4M13.74 13.78C12.7 14.82 12.06 16.24 12 17.81C11.69 17.93 11.36 18 11 18C9.34 18 8 16.66 8 15S9.34 12 11 12C12.22 12 13.27 12.73 13.74 13.78Z",
  Kc =
    "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z",
  Yc = "M3,3V21H21V3",
  Xc = "M3,3H21V21H3V3M5,5V19H19V5H5Z",
  Jc =
    "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",
  Wc =
    "M6.27 17.05C6.72 17.58 7 18.25 7 19C7 20.66 5.66 22 4 22S1 20.66 1 19 2.34 16 4 16C4.18 16 4.36 16 4.53 16.05L7.6 10.69L5.86 9.7L9.95 8.58L11.07 12.67L9.33 11.68L6.27 17.05M20 16C18.7 16 17.6 16.84 17.18 18H11V16L8 19L11 22V20H17.18C17.6 21.16 18.7 22 20 22C21.66 22 23 20.66 23 19S21.66 16 20 16M12 8C12.18 8 12.36 8 12.53 7.95L15.6 13.31L13.86 14.3L17.95 15.42L19.07 11.33L17.33 12.32L14.27 6.95C14.72 6.42 15 5.75 15 5C15 3.34 13.66 2 12 2S9 3.34 9 5 10.34 8 12 8Z",
  Qc = "M18,18H6V6H18V18Z",
  ep =
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9",
  tp = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z",
  op =
    "M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z",
  rp =
    "M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3M4,9H17V19H4V9M19.5,9A1,1 0 0,1 20.5,10A1,1 0 0,1 19.5,11A1,1 0 0,1 18.5,10A1,1 0 0,1 19.5,9M19.5,12A1,1 0 0,1 20.5,13A1,1 0 0,1 19.5,14A1,1 0 0,1 18.5,13A1,1 0 0,1 19.5,12Z",
  ip =
    "M0.5,2.77L1.78,1.5L21,20.72L19.73,22L16.73,19H16V21H8V19H3A2,2 0 0,1 1,17V5C1,4.5 1.17,4.07 1.46,3.73L0.5,2.77M21,17V5H7.82L5.82,3H21A2,2 0 0,1 23,5V17C23,17.85 22.45,18.59 21.7,18.87L19.82,17H21M3,17H14.73L3,5.27V17Z",
  ap =
    "M3 3C1.89 3 1 3.89 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.89 22.1 3 21 3M3 5H21V17H3M9 8V14H11V8M13 8V14H15V8",
  np =
    "M21,3H3C1.89,3 1,3.89 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5C23,3.89 22.1,3 21,3M21,17H3V5H21M16,11L9,15V7",
  sp =
    "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  lp =
    "M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",
  dp =
    "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z",
  cp =
    "M18.4 1.6C18 1.2 17.5 1 17 1H7C6.5 1 6 1.2 5.6 1.6C5.2 2 5 2.5 5 3V21C5 21.5 5.2 22 5.6 22.4C6 22.8 6.5 23 7 23H17C17.5 23 18 22.8 18.4 22.4C18.8 22 19 21.5 19 21V3C19 2.5 18.8 2 18.4 1.6M16 7C16 7.6 15.6 8 15 8H9C8.4 8 8 7.6 8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7Z",
  pp =
    "M5.6 1.6C6 1.2 6.5 1 7 1H17C17.5 1 18 1.2 18.4 1.6C18.8 2 19 2.5 19 3V21C19 21.5 18.8 22 18.4 22.4C18 22.8 17.5 23 17 23H7C6.5 23 6 22.8 5.6 22.4C5.2 22 5 21.5 5 21V3C5 2.5 5.2 2 5.6 1.6M8 3C7.4 3 7 3.4 7 4V20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20V4C17 3.4 16.6 3 16 3H8M8 17C8 16.4 8.4 16 9 16H15C15.6 16 16 16.4 16 17V19C16 19.6 15.6 20 15 20H9C8.4 20 8 19.6 8 19V17Z",
  up =
    "M12,9A2,2 0 0,1 10,7C10,5.89 10.9,5 12,5C13.11,5 14,5.89 14,7A2,2 0 0,1 12,9M12,14A2,2 0 0,1 10,12C10,10.89 10.9,10 12,10C13.11,10 14,10.89 14,12A2,2 0 0,1 12,14M12,19A2,2 0 0,1 10,17C10,15.89 10.9,15 12,15C13.11,15 14,15.89 14,17A2,2 0 0,1 12,19M20,10H17V8.86C18.72,8.41 20,6.86 20,5H17V4A1,1 0 0,0 16,3H8A1,1 0 0,0 7,4V5H4C4,6.86 5.28,8.41 7,8.86V10H4C4,11.86 5.28,13.41 7,13.86V15H4C4,16.86 5.28,18.41 7,18.86V20A1,1 0 0,0 8,21H16A1,1 0 0,0 17,20V18.86C18.72,18.41 20,16.86 20,15H17V13.86C18.72,13.41 20,11.86 20,10Z",
  hp =
    "M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z",
  mp = "M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z",
  _p =
    "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",
  fp =
    "M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z",
  gp =
    "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",
  yp =
    "M20.84 22.73L16.29 18.18C15.2 19.3 13.69 20 12 20C8.69 20 6 17.31 6 14C6 12.67 6.67 11.03 7.55 9.44L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14C18 10 12 3.25 12 3.25S10.84 4.55 9.55 6.35L17.95 14.75C18 14.5 18 14.25 18 14Z",
  bp =
    "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  vp =
    "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
  Cp =
    "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",
  Ap =
    "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",
  Hp =
    "M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",
  wp =
    "M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",
  Lp =
    "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
  Vp =
    "M22,10.28C21.74,10.3 21.5,10.31 21.26,10.31C19.32,10.31 17.39,9.57 15.91,8.09C14.25,6.44 13.5,4.19 13.72,2C13.77,1.53 13.22,1 12.71,1C12.57,1 12.44,1.04 12.32,1.12C12,1.36 11.66,1.64 11.36,1.94C9.05,4.24 8.55,7.66 9.84,10.46C8.31,11.11 7.13,12.43 6.69,14.06L6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22H19A3,3 0 0,0 22,19A3,3 0 0,0 19,16C18.42,16 17.88,16.16 17.42,16.45L17.5,15.5C17.5,15.28 17.5,15.05 17.46,14.83C19.14,14.67 20.77,13.94 22.06,12.64C22.38,12.34 22.64,12 22.88,11.68C23.27,11.13 22.65,10.28 22.04,10.28M19,18A1,1 0 0,1 20,19A1,1 0 0,1 19,20H6A2,2 0 0,1 4,18A2,2 0 0,1 6,16H8.5V15.5C8.5,13.94 9.53,12.64 10.94,12.18C11.1,12.13 11.26,12.09 11.43,12.06C11.61,12.03 11.8,12 12,12C12.23,12 12.45,12.03 12.66,12.07C12.73,12.08 12.8,12.1 12.87,12.13C13,12.16 13.15,12.2 13.28,12.25C13.36,12.28 13.44,12.32 13.5,12.36C13.63,12.41 13.74,12.47 13.84,12.54C13.92,12.59 14,12.64 14.07,12.7C14.17,12.77 14.25,12.84 14.34,12.92C14.41,13 14.5,13.05 14.55,13.12C14.63,13.2 14.69,13.29 14.76,13.37C14.82,13.45 14.89,13.53 14.94,13.62C15,13.71 15.04,13.8 15.09,13.9C15.14,14 15.2,14.08 15.24,14.18C15.41,14.59 15.5,15.03 15.5,15.5V18M16.83,12.86C15.9,11.16 14.08,10 12,10H11.87C11.41,9.19 11.14,8.26 11.14,7.29C11.14,6.31 11.39,5.37 11.86,4.55C12.21,6.41 13.12,8.14 14.5,9.5C15.86,10.88 17.58,11.79 19.45,12.14C18.66,12.6 17.76,12.84 16.83,12.86Z",
  kp =
    "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",
  Mp =
    "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",
  xp =
    "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",
  Sp =
    "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",
  Ep =
    "M18.5,18.67C18.5,19.96 17.5,21 16.25,21C15,21 14,19.96 14,18.67C14,17.12 16.25,14.5 16.25,14.5C16.25,14.5 18.5,17.12 18.5,18.67M4,17.36C3.86,16.82 4.18,16.25 4.73,16.11L7,15.5L5.33,13.86C4.93,13.46 4.93,12.81 5.33,12.4C5.73,12 6.4,12 6.79,12.4L8.45,14.05L9.04,11.8C9.18,11.24 9.75,10.92 10.29,11.07C10.85,11.21 11.17,11.78 11,12.33L10.42,14.58L12.67,14C13.22,13.83 13.79,14.15 13.93,14.71C14.08,15.25 13.76,15.82 13.2,15.96L10.95,16.55L12.6,18.21C13,18.6 13,19.27 12.6,19.67C12.2,20.07 11.54,20.07 11.15,19.67L9.5,18L8.89,20.27C8.75,20.83 8.18,21.14 7.64,21C7.08,20.86 6.77,20.29 6.91,19.74L7.5,17.5L5.26,18.09C4.71,18.23 4.14,17.92 4,17.36M1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,11.85 3.35,12.61 3.91,13.16C4.27,13.55 4.26,14.16 3.88,14.54C3.5,14.93 2.85,14.93 2.47,14.54C1.56,13.63 1,12.38 1,11Z",
  Pp =
    "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
  Tp =
    "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  Op =
    "M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  Np =
    "M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  Rp =
    "M10.46,19C9,21.07 6.15,21.59 4.09,20.15C2.04,18.71 1.56,15.84 3,13.75C3.87,12.5 5.21,11.83 6.58,11.77L6.63,13.2C5.72,13.27 4.84,13.74 4.27,14.56C3.27,16 3.58,17.94 4.95,18.91C6.33,19.87 8.26,19.5 9.26,18.07C9.57,17.62 9.75,17.13 9.82,16.63V15.62L15.4,15.58L15.47,15.47C16,14.55 17.15,14.23 18.05,14.75C18.95,15.27 19.26,16.43 18.73,17.35C18.2,18.26 17.04,18.58 16.14,18.06C15.73,17.83 15.44,17.46 15.31,17.04L11.24,17.06C11.13,17.73 10.87,18.38 10.46,19M17.74,11.86C20.27,12.17 22.07,14.44 21.76,16.93C21.45,19.43 19.15,21.2 16.62,20.89C15.13,20.71 13.9,19.86 13.19,18.68L14.43,17.96C14.92,18.73 15.75,19.28 16.75,19.41C18.5,19.62 20.05,18.43 20.26,16.76C20.47,15.09 19.23,13.56 17.5,13.35C16.96,13.29 16.44,13.36 15.97,13.53L15.12,13.97L12.54,9.2H12.32C11.26,9.16 10.44,8.29 10.47,7.25C10.5,6.21 11.4,5.4 12.45,5.44C13.5,5.5 14.33,6.35 14.3,7.39C14.28,7.83 14.11,8.23 13.84,8.54L15.74,12.05C16.36,11.85 17.04,11.78 17.74,11.86M8.25,9.14C7.25,6.79 8.31,4.1 10.62,3.12C12.94,2.14 15.62,3.25 16.62,5.6C17.21,6.97 17.09,8.47 16.42,9.67L15.18,8.95C15.6,8.14 15.67,7.15 15.27,6.22C14.59,4.62 12.78,3.85 11.23,4.5C9.67,5.16 8.97,7 9.65,8.6C9.93,9.26 10.4,9.77 10.97,10.11L11.36,10.32L8.29,15.31C8.32,15.36 8.36,15.42 8.39,15.5C8.88,16.41 8.54,17.56 7.62,18.05C6.71,18.54 5.56,18.18 5.06,17.24C4.57,16.31 4.91,15.16 5.83,14.67C6.22,14.46 6.65,14.41 7.06,14.5L9.37,10.73C8.9,10.3 8.5,9.76 8.25,9.14Z",
  zp =
    "M12,3A4,4 0 0,1 16,7C16,7.73 15.81,8.41 15.46,9H18C18.95,9 19.75,9.67 19.95,10.56C21.96,18.57 22,18.78 22,19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19C2,18.78 2.04,18.57 4.05,10.56C4.25,9.67 5.05,9 6,9H8.54C8.19,8.41 8,7.73 8,7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7A2,2 0 0,0 12,9A2,2 0 0,0 14,7A2,2 0 0,0 12,5Z",
  Ip =
    "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13",
  Dp =
    "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  jp =
    "M6,11H10V9H14V11H18V4H6V11M18,13H6V20H18V13M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z",
  Bp =
    "M6,8H10V6H14V8H18V4H6V8M18,10H6V15H18V10M6,20H18V17H6V20M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z",
  $p =
    "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z",
  Fp = "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z";
function Up(e, t) {
  if (e.closest) return e.closest(t);
  for (var o = e; o; ) {
    if (Zp(o, t)) return o;
    o = o.parentElement;
  }
  return null;
}
function Zp(e, t) {
  return (e.matches || e.webkitMatchesSelector || e.msMatchesSelector).call(
    e,
    t
  );
}
const Gp = (e) => e.nodeType === Node.ELEMENT_NODE;
function qp(e) {
  return {
    addClass: (t) => {
      e.classList.add(t);
    },
    removeClass: (t) => {
      e.classList.remove(t);
    },
    hasClass: (t) => e.classList.contains(t),
  };
}
let Kp = !1;
const Yp = () => {},
  Xp = {
    get passive() {
      return (Kp = !0), !1;
    },
  };
document.addEventListener("x", Yp, Xp), document.removeEventListener("x", Yp);
const Jp = Kp,
  Wp = (e = window.document) => {
    let t = e.activeElement;
    const o = [];
    if (!t) return o;
    for (; t && (o.push(t), t.shadowRoot); ) t = t.shadowRoot.activeElement;
    return o;
  },
  Qp = (e) => {
    const t = Wp();
    if (!t.length) return !1;
    const o = t[t.length - 1],
      r = new Event("check-if-focused", { bubbles: !0, composed: !0 });
    let i = [];
    const a = (e) => {
      i = e.composedPath();
    };
    return (
      document.body.addEventListener("check-if-focused", a),
      o.dispatchEvent(r),
      document.body.removeEventListener("check-if-focused", a),
      -1 !== i.indexOf(e)
    );
  };
class eu extends ge {
  click() {
    if (this.mdcRoot) return this.mdcRoot.focus(), void this.mdcRoot.click();
    super.click();
  }
  createFoundation() {
    void 0 !== this.mdcFoundation && this.mdcFoundation.destroy(),
      this.mdcFoundationClass &&
        ((this.mdcFoundation = new this.mdcFoundationClass(
          this.createAdapter()
        )),
        this.mdcFoundation.init());
  }
  firstUpdated() {
    this.createFoundation();
  }
}
var tu = (function () {
    function e(e) {
      void 0 === e && (e = {}), (this.adapter = e);
    }
    return (
      Object.defineProperty(e, "cssClasses", {
        get: function () {
          return {};
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "strings", {
        get: function () {
          return {};
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "numbers", {
        get: function () {
          return {};
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, "defaultAdapter", {
        get: function () {
          return {};
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.init = function () {}),
      (e.prototype.destroy = function () {}),
      e
    );
  })(),
  ou = {
    BG_FOCUSED: "mdc-ripple-upgraded--background-focused",
    FG_ACTIVATION: "mdc-ripple-upgraded--foreground-activation",
    FG_DEACTIVATION: "mdc-ripple-upgraded--foreground-deactivation",
    ROOT: "mdc-ripple-upgraded",
    UNBOUNDED: "mdc-ripple-upgraded--unbounded",
  },
  ru = {
    VAR_FG_SCALE: "--mdc-ripple-fg-scale",
    VAR_FG_SIZE: "--mdc-ripple-fg-size",
    VAR_FG_TRANSLATE_END: "--mdc-ripple-fg-translate-end",
    VAR_FG_TRANSLATE_START: "--mdc-ripple-fg-translate-start",
    VAR_LEFT: "--mdc-ripple-left",
    VAR_TOP: "--mdc-ripple-top",
  },
  iu = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300,
  };
var au = ["touchstart", "pointerdown", "mousedown", "keydown"],
  nu = ["touchend", "pointerup", "mouseup", "contextmenu"],
  su = [],
  lu = (function (e) {
    function t(o) {
      var r = e.call(this, Hn(Hn({}, t.defaultAdapter), o)) || this;
      return (
        (r.activationAnimationHasEnded = !1),
        (r.activationTimer = 0),
        (r.fgDeactivationRemovalTimer = 0),
        (r.fgScale = "0"),
        (r.frame = { width: 0, height: 0 }),
        (r.initialSize = 0),
        (r.layoutFrame = 0),
        (r.maxRadius = 0),
        (r.unboundedCoords = { left: 0, top: 0 }),
        (r.activationState = r.defaultActivationState()),
        (r.activationTimerCallback = function () {
          (r.activationAnimationHasEnded = !0),
            r.runDeactivationUXLogicIfReady();
        }),
        (r.activateHandler = function (e) {
          r.activateImpl(e);
        }),
        (r.deactivateHandler = function () {
          r.deactivateImpl();
        }),
        (r.focusHandler = function () {
          r.handleFocus();
        }),
        (r.blurHandler = function () {
          r.handleBlur();
        }),
        (r.resizeHandler = function () {
          r.layout();
        }),
        r
      );
    }
    return (
      An(t, e),
      Object.defineProperty(t, "cssClasses", {
        get: function () {
          return ou;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "strings", {
        get: function () {
          return ru;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "numbers", {
        get: function () {
          return iu;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "defaultAdapter", {
        get: function () {
          return {
            addClass: function () {},
            browserSupportsCssVars: function () {
              return !0;
            },
            computeBoundingRect: function () {
              return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: 0,
                height: 0,
              };
            },
            containsEventTarget: function () {
              return !0;
            },
            deregisterDocumentInteractionHandler: function () {},
            deregisterInteractionHandler: function () {},
            deregisterResizeHandler: function () {},
            getWindowPageOffset: function () {
              return { x: 0, y: 0 };
            },
            isSurfaceActive: function () {
              return !0;
            },
            isSurfaceDisabled: function () {
              return !0;
            },
            isUnbounded: function () {
              return !0;
            },
            registerDocumentInteractionHandler: function () {},
            registerInteractionHandler: function () {},
            registerResizeHandler: function () {},
            removeClass: function () {},
            updateCssVariable: function () {},
          };
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.init = function () {
        var e = this,
          o = this.supportsPressRipple();
        if ((this.registerRootHandlers(o), o)) {
          var r = t.cssClasses,
            i = r.ROOT,
            a = r.UNBOUNDED;
          requestAnimationFrame(function () {
            e.adapter.addClass(i),
              e.adapter.isUnbounded() &&
                (e.adapter.addClass(a), e.layoutInternal());
          });
        }
      }),
      (t.prototype.destroy = function () {
        var e = this;
        if (this.supportsPressRipple()) {
          this.activationTimer &&
            (clearTimeout(this.activationTimer),
            (this.activationTimer = 0),
            this.adapter.removeClass(t.cssClasses.FG_ACTIVATION)),
            this.fgDeactivationRemovalTimer &&
              (clearTimeout(this.fgDeactivationRemovalTimer),
              (this.fgDeactivationRemovalTimer = 0),
              this.adapter.removeClass(t.cssClasses.FG_DEACTIVATION));
          var o = t.cssClasses,
            r = o.ROOT,
            i = o.UNBOUNDED;
          requestAnimationFrame(function () {
            e.adapter.removeClass(r),
              e.adapter.removeClass(i),
              e.removeCssVars();
          });
        }
        this.deregisterRootHandlers(), this.deregisterDeactivationHandlers();
      }),
      (t.prototype.activate = function (e) {
        this.activateImpl(e);
      }),
      (t.prototype.deactivate = function () {
        this.deactivateImpl();
      }),
      (t.prototype.layout = function () {
        var e = this;
        this.layoutFrame && cancelAnimationFrame(this.layoutFrame),
          (this.layoutFrame = requestAnimationFrame(function () {
            e.layoutInternal(), (e.layoutFrame = 0);
          }));
      }),
      (t.prototype.setUnbounded = function (e) {
        var o = t.cssClasses.UNBOUNDED;
        e ? this.adapter.addClass(o) : this.adapter.removeClass(o);
      }),
      (t.prototype.handleFocus = function () {
        var e = this;
        requestAnimationFrame(function () {
          return e.adapter.addClass(t.cssClasses.BG_FOCUSED);
        });
      }),
      (t.prototype.handleBlur = function () {
        var e = this;
        requestAnimationFrame(function () {
          return e.adapter.removeClass(t.cssClasses.BG_FOCUSED);
        });
      }),
      (t.prototype.supportsPressRipple = function () {
        return this.adapter.browserSupportsCssVars();
      }),
      (t.prototype.defaultActivationState = function () {
        return {
          activationEvent: void 0,
          hasDeactivationUXRun: !1,
          isActivated: !1,
          isProgrammatic: !1,
          wasActivatedByPointer: !1,
          wasElementMadeActive: !1,
        };
      }),
      (t.prototype.registerRootHandlers = function (e) {
        var t, o;
        if (e) {
          try {
            for (var r = Vn(au), i = r.next(); !i.done; i = r.next()) {
              var a = i.value;
              this.adapter.registerInteractionHandler(a, this.activateHandler);
            }
          } catch (e) {
            t = { error: e };
          } finally {
            try {
              i && !i.done && (o = r.return) && o.call(r);
            } finally {
              if (t) throw t.error;
            }
          }
          this.adapter.isUnbounded() &&
            this.adapter.registerResizeHandler(this.resizeHandler);
        }
        this.adapter.registerInteractionHandler("focus", this.focusHandler),
          this.adapter.registerInteractionHandler("blur", this.blurHandler);
      }),
      (t.prototype.registerDeactivationHandlers = function (e) {
        var t, o;
        if ("keydown" === e.type)
          this.adapter.registerInteractionHandler(
            "keyup",
            this.deactivateHandler
          );
        else
          try {
            for (var r = Vn(nu), i = r.next(); !i.done; i = r.next()) {
              var a = i.value;
              this.adapter.registerDocumentInteractionHandler(
                a,
                this.deactivateHandler
              );
            }
          } catch (e) {
            t = { error: e };
          } finally {
            try {
              i && !i.done && (o = r.return) && o.call(r);
            } finally {
              if (t) throw t.error;
            }
          }
      }),
      (t.prototype.deregisterRootHandlers = function () {
        var e, t;
        try {
          for (var o = Vn(au), r = o.next(); !r.done; r = o.next()) {
            var i = r.value;
            this.adapter.deregisterInteractionHandler(i, this.activateHandler);
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            r && !r.done && (t = o.return) && t.call(o);
          } finally {
            if (e) throw e.error;
          }
        }
        this.adapter.deregisterInteractionHandler("focus", this.focusHandler),
          this.adapter.deregisterInteractionHandler("blur", this.blurHandler),
          this.adapter.isUnbounded() &&
            this.adapter.deregisterResizeHandler(this.resizeHandler);
      }),
      (t.prototype.deregisterDeactivationHandlers = function () {
        var e, t;
        this.adapter.deregisterInteractionHandler(
          "keyup",
          this.deactivateHandler
        );
        try {
          for (var o = Vn(nu), r = o.next(); !r.done; r = o.next()) {
            var i = r.value;
            this.adapter.deregisterDocumentInteractionHandler(
              i,
              this.deactivateHandler
            );
          }
        } catch (t) {
          e = { error: t };
        } finally {
          try {
            r && !r.done && (t = o.return) && t.call(o);
          } finally {
            if (e) throw e.error;
          }
        }
      }),
      (t.prototype.removeCssVars = function () {
        var e = this,
          o = t.strings;
        Object.keys(o).forEach(function (t) {
          0 === t.indexOf("VAR_") && e.adapter.updateCssVariable(o[t], null);
        });
      }),
      (t.prototype.activateImpl = function (e) {
        var t = this;
        if (!this.adapter.isSurfaceDisabled()) {
          var o = this.activationState;
          if (!o.isActivated) {
            var r = this.previousActivationEvent;
            if (!(r && void 0 !== e && r.type !== e.type))
              (o.isActivated = !0),
                (o.isProgrammatic = void 0 === e),
                (o.activationEvent = e),
                (o.wasActivatedByPointer =
                  !o.isProgrammatic &&
                  void 0 !== e &&
                  ("mousedown" === e.type ||
                    "touchstart" === e.type ||
                    "pointerdown" === e.type)),
                void 0 !== e &&
                su.length > 0 &&
                su.some(function (e) {
                  return t.adapter.containsEventTarget(e);
                })
                  ? this.resetActivationState()
                  : (void 0 !== e &&
                      (su.push(e.target), this.registerDeactivationHandlers(e)),
                    (o.wasElementMadeActive = this.checkElementMadeActive(e)),
                    o.wasElementMadeActive && this.animateActivation(),
                    requestAnimationFrame(function () {
                      (su = []),
                        o.wasElementMadeActive ||
                          void 0 === e ||
                          (" " !== e.key && 32 !== e.keyCode) ||
                          ((o.wasElementMadeActive =
                            t.checkElementMadeActive(e)),
                          o.wasElementMadeActive && t.animateActivation()),
                        o.wasElementMadeActive ||
                          (t.activationState = t.defaultActivationState());
                    }));
          }
        }
      }),
      (t.prototype.checkElementMadeActive = function (e) {
        return (
          void 0 === e || "keydown" !== e.type || this.adapter.isSurfaceActive()
        );
      }),
      (t.prototype.animateActivation = function () {
        var e = this,
          o = t.strings,
          r = o.VAR_FG_TRANSLATE_START,
          i = o.VAR_FG_TRANSLATE_END,
          a = t.cssClasses,
          n = a.FG_DEACTIVATION,
          s = a.FG_ACTIVATION,
          l = t.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var d = "",
          c = "";
        if (!this.adapter.isUnbounded()) {
          var p = this.getFgTranslationCoordinates(),
            u = p.startPoint,
            h = p.endPoint;
          (d = u.x + "px, " + u.y + "px"), (c = h.x + "px, " + h.y + "px");
        }
        this.adapter.updateCssVariable(r, d),
          this.adapter.updateCssVariable(i, c),
          clearTimeout(this.activationTimer),
          clearTimeout(this.fgDeactivationRemovalTimer),
          this.rmBoundedActivationClasses(),
          this.adapter.removeClass(n),
          this.adapter.computeBoundingRect(),
          this.adapter.addClass(s),
          (this.activationTimer = setTimeout(function () {
            e.activationTimerCallback();
          }, l));
      }),
      (t.prototype.getFgTranslationCoordinates = function () {
        var e,
          t = this.activationState,
          o = t.activationEvent;
        return (
          (e = t.wasActivatedByPointer
            ? (function (e, t, o) {
                if (!e) return { x: 0, y: 0 };
                var r,
                  i,
                  a = t.x,
                  n = t.y,
                  s = a + o.left,
                  l = n + o.top;
                if ("touchstart" === e.type) {
                  var d = e;
                  (r = d.changedTouches[0].pageX - s),
                    (i = d.changedTouches[0].pageY - l);
                } else {
                  var c = e;
                  (r = c.pageX - s), (i = c.pageY - l);
                }
                return { x: r, y: i };
              })(
                o,
                this.adapter.getWindowPageOffset(),
                this.adapter.computeBoundingRect()
              )
            : { x: this.frame.width / 2, y: this.frame.height / 2 }),
          {
            startPoint: (e = {
              x: e.x - this.initialSize / 2,
              y: e.y - this.initialSize / 2,
            }),
            endPoint: {
              x: this.frame.width / 2 - this.initialSize / 2,
              y: this.frame.height / 2 - this.initialSize / 2,
            },
          }
        );
      }),
      (t.prototype.runDeactivationUXLogicIfReady = function () {
        var e = this,
          o = t.cssClasses.FG_DEACTIVATION,
          r = this.activationState,
          i = r.hasDeactivationUXRun,
          a = r.isActivated;
        (i || !a) &&
          this.activationAnimationHasEnded &&
          (this.rmBoundedActivationClasses(),
          this.adapter.addClass(o),
          (this.fgDeactivationRemovalTimer = setTimeout(function () {
            e.adapter.removeClass(o);
          }, iu.FG_DEACTIVATION_MS)));
      }),
      (t.prototype.rmBoundedActivationClasses = function () {
        var e = t.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(e),
          (this.activationAnimationHasEnded = !1),
          this.adapter.computeBoundingRect();
      }),
      (t.prototype.resetActivationState = function () {
        var e = this;
        (this.previousActivationEvent = this.activationState.activationEvent),
          (this.activationState = this.defaultActivationState()),
          setTimeout(function () {
            return (e.previousActivationEvent = void 0);
          }, t.numbers.TAP_DELAY_MS);
      }),
      (t.prototype.deactivateImpl = function () {
        var e = this,
          t = this.activationState;
        if (t.isActivated) {
          var o = Hn({}, t);
          t.isProgrammatic
            ? (requestAnimationFrame(function () {
                e.animateDeactivation(o);
              }),
              this.resetActivationState())
            : (this.deregisterDeactivationHandlers(),
              requestAnimationFrame(function () {
                (e.activationState.hasDeactivationUXRun = !0),
                  e.animateDeactivation(o),
                  e.resetActivationState();
              }));
        }
      }),
      (t.prototype.animateDeactivation = function (e) {
        var t = e.wasActivatedByPointer,
          o = e.wasElementMadeActive;
        (t || o) && this.runDeactivationUXLogicIfReady();
      }),
      (t.prototype.layoutInternal = function () {
        var e = this;
        this.frame = this.adapter.computeBoundingRect();
        var o = Math.max(this.frame.height, this.frame.width);
        this.maxRadius = this.adapter.isUnbounded()
          ? o
          : Math.sqrt(
              Math.pow(e.frame.width, 2) + Math.pow(e.frame.height, 2)
            ) + t.numbers.PADDING;
        var r = Math.floor(o * t.numbers.INITIAL_ORIGIN_SCALE);
        this.adapter.isUnbounded() && r % 2 != 0
          ? (this.initialSize = r - 1)
          : (this.initialSize = r),
          (this.fgScale = "" + this.maxRadius / this.initialSize),
          this.updateLayoutCssVars();
      }),
      (t.prototype.updateLayoutCssVars = function () {
        var e = t.strings,
          o = e.VAR_FG_SIZE,
          r = e.VAR_LEFT,
          i = e.VAR_TOP,
          a = e.VAR_FG_SCALE;
        this.adapter.updateCssVariable(o, this.initialSize + "px"),
          this.adapter.updateCssVariable(a, this.fgScale),
          this.adapter.isUnbounded() &&
            ((this.unboundedCoords = {
              left: Math.round(this.frame.width / 2 - this.initialSize / 2),
              top: Math.round(this.frame.height / 2 - this.initialSize / 2),
            }),
            this.adapter.updateCssVariable(r, this.unboundedCoords.left + "px"),
            this.adapter.updateCssVariable(i, this.unboundedCoords.top + "px"));
      }),
      t
    );
  })(tu),
  du = lu;
class cu extends eu {
  constructor() {
    super(...arguments),
      (this.primary = !1),
      (this.accent = !1),
      (this.unbounded = !1),
      (this.disabled = !1),
      (this.activated = !1),
      (this.selected = !1),
      (this.internalUseStateLayerCustomProperties = !1),
      (this.hovering = !1),
      (this.bgFocused = !1),
      (this.fgActivation = !1),
      (this.fgDeactivation = !1),
      (this.fgScale = ""),
      (this.fgSize = ""),
      (this.translateStart = ""),
      (this.translateEnd = ""),
      (this.leftPos = ""),
      (this.topPos = ""),
      (this.mdcFoundationClass = du);
  }
  get isActive() {
    return Zp(this.parentElement || this, ":active");
  }
  createAdapter() {
    return {
      browserSupportsCssVars: () => !0,
      isUnbounded: () => this.unbounded,
      isSurfaceActive: () => this.isActive,
      isSurfaceDisabled: () => this.disabled,
      addClass: (e) => {
        switch (e) {
          case "mdc-ripple-upgraded--background-focused":
            this.bgFocused = !0;
            break;
          case "mdc-ripple-upgraded--foreground-activation":
            this.fgActivation = !0;
            break;
          case "mdc-ripple-upgraded--foreground-deactivation":
            this.fgDeactivation = !0;
        }
      },
      removeClass: (e) => {
        switch (e) {
          case "mdc-ripple-upgraded--background-focused":
            this.bgFocused = !1;
            break;
          case "mdc-ripple-upgraded--foreground-activation":
            this.fgActivation = !1;
            break;
          case "mdc-ripple-upgraded--foreground-deactivation":
            this.fgDeactivation = !1;
        }
      },
      containsEventTarget: () => !0,
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      registerDocumentInteractionHandler: () => {},
      deregisterDocumentInteractionHandler: () => {},
      registerResizeHandler: () => {},
      deregisterResizeHandler: () => {},
      updateCssVariable: (e, t) => {
        switch (e) {
          case "--mdc-ripple-fg-scale":
            this.fgScale = t;
            break;
          case "--mdc-ripple-fg-size":
            this.fgSize = t;
            break;
          case "--mdc-ripple-fg-translate-end":
            this.translateEnd = t;
            break;
          case "--mdc-ripple-fg-translate-start":
            this.translateStart = t;
            break;
          case "--mdc-ripple-left":
            this.leftPos = t;
            break;
          case "--mdc-ripple-top":
            this.topPos = t;
        }
      },
      computeBoundingRect: () =>
        (this.parentElement || this).getBoundingClientRect(),
      getWindowPageOffset: () => ({
        x: window.pageXOffset,
        y: window.pageYOffset,
      }),
    };
  }
  startPress(e) {
    this.waitForFoundation(() => {
      this.mdcFoundation.activate(e);
    });
  }
  endPress() {
    this.waitForFoundation(() => {
      this.mdcFoundation.deactivate();
    });
  }
  startFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleFocus();
    });
  }
  endFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleBlur();
    });
  }
  startHover() {
    this.hovering = !0;
  }
  endHover() {
    this.hovering = !1;
  }
  waitForFoundation(e) {
    this.mdcFoundation ? e() : this.updateComplete.then(e);
  }
  update(e) {
    e.has("disabled") && this.disabled && this.endHover(), super.update(e);
  }
  render() {
    const e = this.activated && (this.primary || !this.accent),
      t = this.selected && (this.primary || !this.accent),
      o = {
        "mdc-ripple-surface--accent": this.accent,
        "mdc-ripple-surface--primary--activated": e,
        "mdc-ripple-surface--accent--activated": this.accent && this.activated,
        "mdc-ripple-surface--primary--selected": t,
        "mdc-ripple-surface--accent--selected": this.accent && this.selected,
        "mdc-ripple-surface--disabled": this.disabled,
        "mdc-ripple-surface--hover": this.hovering,
        "mdc-ripple-surface--primary": this.primary,
        "mdc-ripple-surface--selected": this.selected,
        "mdc-ripple-upgraded--background-focused": this.bgFocused,
        "mdc-ripple-upgraded--foreground-activation": this.fgActivation,
        "mdc-ripple-upgraded--foreground-deactivation": this.fgDeactivation,
        "mdc-ripple-upgraded--unbounded": this.unbounded,
        "mdc-ripple-surface--internal-use-state-layer-custom-properties":
          this.internalUseStateLayerCustomProperties,
      };
    return Y`
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${Rn(o)}"
          style="${In({
            "--mdc-ripple-fg-scale": this.fgScale,
            "--mdc-ripple-fg-size": this.fgSize,
            "--mdc-ripple-fg-translate-end": this.translateEnd,
            "--mdc-ripple-fg-translate-start": this.translateStart,
            "--mdc-ripple-left": this.leftPos,
            "--mdc-ripple-top": this.topPos,
          })}"></div>`;
  }
}
wn([Le(".mdc-ripple-surface")], cu.prototype, "mdcRoot", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "primary", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "accent", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "unbounded", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "disabled", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "activated", void 0),
  wn([Ce({ type: Boolean })], cu.prototype, "selected", void 0),
  wn(
    [Ce({ type: Boolean })],
    cu.prototype,
    "internalUseStateLayerCustomProperties",
    void 0
  ),
  wn([Ae()], cu.prototype, "hovering", void 0),
  wn([Ae()], cu.prototype, "bgFocused", void 0),
  wn([Ae()], cu.prototype, "fgActivation", void 0),
  wn([Ae()], cu.prototype, "fgDeactivation", void 0),
  wn([Ae()], cu.prototype, "fgScale", void 0),
  wn([Ae()], cu.prototype, "fgSize", void 0),
  wn([Ae()], cu.prototype, "translateStart", void 0),
  wn([Ae()], cu.prototype, "translateEnd", void 0),
  wn([Ae()], cu.prototype, "leftPos", void 0),
  wn([Ae()], cu.prototype, "topPos", void 0);
const pu = b`.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-upgraded--unbounded::before,.mdc-ripple-upgraded--unbounded::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-ripple-surface:hover::before,.mdc-ripple-surface.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary:hover::before,.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before,.mdc-ripple-surface--primary--activated::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--activated:hover::before,.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--primary--selected::before,.mdc-ripple-surface--primary--selected::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--selected:hover::before,.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent:hover::before,.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before,.mdc-ripple-surface--accent--activated::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--activated:hover::before,.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--accent--selected::before,.mdc-ripple-surface--accent--selected::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--selected:hover::before,.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties::after{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color, #000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-state-layer-opacity, 0.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`;
let uu = class extends cu {};
(uu.styles = [pu]), (uu = wn([be("mwc-ripple")], uu));
class hu {
  constructor(e) {
    (this.startPress = (t) => {
      e().then((e) => {
        e && e.startPress(t);
      });
    }),
      (this.endPress = () => {
        e().then((e) => {
          e && e.endPress();
        });
      }),
      (this.startFocus = () => {
        e().then((e) => {
          e && e.startFocus();
        });
      }),
      (this.endFocus = () => {
        e().then((e) => {
          e && e.endFocus();
        });
      }),
      (this.startHover = () => {
        e().then((e) => {
          e && e.startHover();
        });
      }),
      (this.endHover = () => {
        e().then((e) => {
          e && e.endHover();
        });
      });
  }
}
class mu extends ge {
  constructor() {
    super(...arguments),
      (this.disabled = !1),
      (this.icon = ""),
      (this.shouldRenderRipple = !1),
      (this.rippleHandlers = new hu(
        () => ((this.shouldRenderRipple = !0), this.ripple)
      ));
  }
  renderRipple() {
    return this.shouldRenderRipple
      ? Y`
            <mwc-ripple
                .disabled="${this.disabled}"
                unbounded>
            </mwc-ripple>`
      : "";
  }
  focus() {
    const e = this.buttonElement;
    e && (this.rippleHandlers.startFocus(), e.focus());
  }
  blur() {
    const e = this.buttonElement;
    e && (this.rippleHandlers.endFocus(), e.blur());
  }
  render() {
    return Y`<button
        class="mdc-icon-button mdc-icon-button--display-flex"
        aria-label="${this.ariaLabel || this.icon}"
        aria-haspopup="${zn(this.ariaHasPopup)}"
        ?disabled="${this.disabled}"
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}"
    >${this.renderRipple()}
    <i class="material-icons">${this.icon}</i>
    <span
      ><slot></slot
    ></span>
  </button>`;
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
}
wn([Ce({ type: Boolean, reflect: !0 })], mu.prototype, "disabled", void 0),
  wn([Ce({ type: String })], mu.prototype, "icon", void 0),
  wn(
    [Pn, Ce({ type: String, attribute: "aria-label" })],
    mu.prototype,
    "ariaLabel",
    void 0
  ),
  wn(
    [Pn, Ce({ type: String, attribute: "aria-haspopup" })],
    mu.prototype,
    "ariaHasPopup",
    void 0
  ),
  wn([Le("button")], mu.prototype, "buttonElement", void 0),
  wn([Ve("mwc-ripple")], mu.prototype, "ripple", void 0),
  wn([Ae()], mu.prototype, "shouldRenderRipple", void 0),
  wn([we({ passive: !0 })], mu.prototype, "handleRippleMouseDown", null),
  wn([we({ passive: !0 })], mu.prototype, "handleRippleTouchStart", null);
const _u = b`.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{font-size:24px;width:48px;height:48px;padding:12px}.mdc-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:40px;height:40px;margin-top:4px;margin-bottom:4px;margin-right:4px;margin-left:4px}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38))}.mdc-icon-button svg,.mdc-icon-button img{width:24px;height:24px}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}:host{display:inline-block;outline:none}:host([disabled]){pointer-events:none}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block}:host{--mdc-ripple-color: currentcolor;-webkit-tap-highlight-color:transparent}:host,.mdc-icon-button{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size, 48px);height:var(--mdc-icon-button-size, 48px);padding:calc( (var(--mdc-icon-button-size, 48px) - var(--mdc-icon-size, 24px)) / 2 )}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block;width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px)}`;
let fu = class extends mu {};
(fu.styles = [_u]),
  (fu = wn([be("mwc-icon-button")], fu)),
  s(
    [be("ha-svg-icon")],
    function (e, t) {
      return {
        F: class extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        },
        d: [
          { kind: "field", decorators: [Ce()], key: "path", value: void 0 },
          { kind: "field", decorators: [Ce()], key: "viewBox", value: void 0 },
          {
            kind: "method",
            key: "render",
            value: function () {
              return X`
    <svg
      viewBox=${this.viewBox || "0 0 24 24"}
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      role="img" 
      aria-hidden="true"
    >
      <g>
      ${this.path ? X`<path d=${this.path}></path>` : ""}
      </g>
    </svg>`;
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return b`
      :host {
        display: var(--ha-icon-display, inline-flex);
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentcolor;
        width: var(--mdc-icon-size, 24px);
        height: var(--mdc-icon-size, 24px);
      }
      svg {
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: block;
      }
    `;
            },
          },
        ],
      };
    },
    ge
  ),
  s(
    [be("ha-icon-button")],
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
            decorators: [Ce({ type: Boolean, reflect: !0 })],
            key: "disabled",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Ce({ type: String })],
            key: "path",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: String })],
            key: "label",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: String, attribute: "aria-haspopup" })],
            key: "ariaHasPopup",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "hideTitle",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Le("mwc-icon-button", !0)],
            key: "_button",
            value: void 0,
          },
          {
            kind: "method",
            key: "focus",
            value: function () {
              var e;
              null === (e = this._button) || void 0 === e || e.focus();
            },
          },
          {
            kind: "field",
            static: !0,
            key: "shadowRootOptions",
            value: () => ({ mode: "open", delegatesFocus: !0 }),
          },
          {
            kind: "method",
            key: "render",
            value: function () {
              return Y`
      <mwc-icon-button
        aria-label=${zn(this.label)}
        title=${zn(this.hideTitle ? void 0 : this.label)}
        aria-haspopup=${zn(this.ariaHasPopup)}
        .disabled=${this.disabled}
      >
        ${
          this.path
            ? Y`<ha-svg-icon .path=${this.path}></ha-svg-icon>`
            : Y`<slot></slot>`
        }
      </mwc-icon-button>
    `;
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return b`
      :host {
        display: inline-block;
        outline: none;
      }
      :host([disabled]) {
        pointer-events: none;
      }
      mwc-icon-button {
        --mdc-theme-on-primary: currentColor;
        --mdc-theme-text-disabled-on-light: var(--disabled-text-color);
      }
    `;
            },
          },
        ],
      };
    },
    ge
  ),
  s(
    [be("ha-icon-button-arrow-prev")],
    function (e, o) {
      class i extends o {
        constructor(...t) {
          super(...t), e(this);
        }
      }
      return {
        F: i,
        d: [
          {
            kind: "field",
            decorators: [Ce({ attribute: !1 })],
            key: "hass",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "disabled",
            value: () => !1,
          },
          { kind: "field", decorators: [Ce()], key: "label", value: void 0 },
          { kind: "field", decorators: [Ae()], key: "_icon", value: () => ps },
          {
            kind: "method",
            key: "connectedCallback",
            value: function () {
              r(t(i.prototype), "connectedCallback", this).call(this),
                setTimeout(() => {
                  this._icon =
                    "ltr" === window.getComputedStyle(this).direction
                      ? ps
                      : "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";
                }, 100);
            },
          },
          {
            kind: "method",
            key: "render",
            value: function () {
              var e;
              return Y`
      <ha-icon-button
        .disabled=${this.disabled}
        .label=${
          this.label ||
          (null === (e = this.hass) || void 0 === e
            ? void 0
            : e.localize("ui.common.back")) ||
          "Back"
        }
        .path=${this._icon}
      ></ha-icon-button>
    `;
            },
          },
        ],
      };
    },
    ge
  );
const gu = (e) => {
    let t = [];
    function o(o, r) {
      e = r ? o : Object.assign(Object.assign({}, e), o);
      let i = t;
      for (let t = 0; t < i.length; t++) i[t](e);
    }
    return {
      get state() {
        return e;
      },
      action(t) {
        function r(e) {
          o(e, !1);
        }
        return function () {
          let o = [e];
          for (let e = 0; e < arguments.length; e++) o.push(arguments[e]);
          let i = t.apply(this, o);
          if (null != i) return i instanceof Promise ? i.then(r) : r(i);
        };
      },
      setState: o,
      subscribe: (e) => (
        t.push(e),
        () => {
          !(function (e) {
            let o = [];
            for (let r = 0; r < t.length; r++)
              t[r] === e ? (e = null) : o.push(t[r]);
            t = o;
          })(e);
        }
      ),
    };
  },
  yu = (e, t, o, r) => {
    if (e[t]) return e[t];
    let i,
      a,
      n = 0,
      s = gu();
    const l = () => {
        if (!o) throw new Error("Collection does not support refresh");
        return o(e).then((e) => s.setState(e, !0));
      },
      d = () =>
        l().catch((t) => {
          if (e.connected) throw t;
        }),
      c = () => {
        (a = void 0),
          i &&
            i.then((e) => {
              e();
            }),
          e.removeEventListener("ready", l),
          e.removeEventListener("disconnected", p);
      },
      p = () => {
        a && (clearTimeout(a), c());
      };
    return (
      (e[t] = {
        get state() {
          return s.state;
        },
        refresh: l,
        subscribe(t) {
          n++,
            1 === n &&
              (() => {
                if (void 0 !== a) return clearTimeout(a), void (a = void 0);
                r && (i = r(e, s)),
                  o && (e.addEventListener("ready", d), d()),
                  e.addEventListener("disconnected", p);
              })();
          const l = s.subscribe(t);
          return (
            void 0 !== s.state && setTimeout(() => t(s.state), 0),
            () => {
              l(), n--, n || (a = setTimeout(c, 5e3));
            }
          );
        },
      }),
      e[t]
    );
  },
  bu = (e, t, o, r, i) => yu(r, e, t, o).subscribe(i),
  vu = (e) => e.sendMessagePromise({ type: "persistent_notification/get" }),
  Cu = (e, t) =>
    e.subscribeEvents(
      () => vu(e).then((e) => t.setState(e, !0)),
      "persistent_notifications_updated"
    );
s(
  [be("ha-menu-button")],
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "hassio",
          value: () => !1,
        },
        { kind: "field", decorators: [Ce()], key: "narrow", value: void 0 },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ae()],
          key: "_hasNotifications",
          value: () => !1,
        },
        { kind: "field", key: "_alwaysVisible", value: () => !1 },
        { kind: "field", key: "_attachNotifOnConnect", value: () => !1 },
        { kind: "field", key: "_unsubNotifications", value: void 0 },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            r(t(i.prototype), "connectedCallback", this).call(this),
              this._attachNotifOnConnect &&
                ((this._attachNotifOnConnect = !1),
                this._subscribeNotifications());
          },
        },
        {
          kind: "method",
          key: "disconnectedCallback",
          value: function () {
            r(t(i.prototype), "disconnectedCallback", this).call(this),
              this._unsubNotifications &&
                ((this._attachNotifOnConnect = !0),
                this._unsubNotifications(),
                (this._unsubNotifications = void 0));
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            const e =
              this._hasNotifications &&
              (this.narrow || "always_hidden" === this.hass.dockedSidebar);
            return Y`
      <ha-icon-button
        .label=${this.hass.localize("ui.sidebar.sidebar_toggle")}
        .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
        @click=${this._toggleMenu}
      ></ha-icon-button>
      ${e ? Y`<div class="dot"></div>` : ""}
    `;
          },
        },
        {
          kind: "method",
          key: "firstUpdated",
          value: function (e) {
            r(t(i.prototype), "firstUpdated", this).call(this, e),
              this.hassio &&
                (this._alwaysVisible =
                  (Number(window.parent.frontendVersion) || 0) < 20190710);
          },
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            if (
              (r(t(i.prototype), "updated", this).call(this, e),
              !e.has("narrow") && !e.has("hass"))
            )
              return;
            const o = e.get("hass"),
              a = e.get("narrow") || (o && "always_hidden" === o.dockedSidebar),
              n = this.narrow || "always_hidden" === this.hass.dockedSidebar;
            a !== n &&
              ((this.style.display =
                n || this._alwaysVisible ? "initial" : "none"),
              n
                ? this._subscribeNotifications()
                : this._unsubNotifications &&
                  (this._unsubNotifications(),
                  (this._unsubNotifications = void 0)));
          },
        },
        {
          kind: "method",
          key: "_subscribeNotifications",
          value: function () {
            var e;
            this._unsubNotifications =
              ((e = this.hass.connection),
              bu("_ntf", vu, Cu, e, (e) => {
                this._hasNotifications = e.length > 0;
              }));
          },
        },
        {
          kind: "method",
          key: "_toggleMenu",
          value: function () {
            tt(this, "hass-toggle-menu");
          },
        },
        {
          kind: "get",
          static: !0,
          key: "styles",
          value: function () {
            return b`
      :host {
        position: relative;
      }
      .dot {
        pointer-events: none;
        position: absolute;
        background-color: var(--accent-color);
        width: 12px;
        height: 12px;
        top: 9px;
        right: 7px;
        border-radius: 50%;
        border: 2px solid var(--app-header-background-color);
      }
    `;
          },
        },
      ],
    };
  },
  ge
),
  s(
    [be("hass-loading-screen")],
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
            decorators: [Ce({ attribute: !1 })],
            key: "hass",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean, attribute: "no-toolbar" })],
            key: "noToolbar",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "rootnav",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "narrow",
            value: () => !1,
          },
          {
            kind: "method",
            key: "render",
            value: function () {
              var e;
              return Y`
      ${
        this.noToolbar
          ? ""
          : Y`<div class="toolbar">
            ${
              this.rootnav ||
              (null !== (e = history.state) && void 0 !== e && e.root)
                ? Y`
                  <ha-menu-button
                    .hass=${this.hass}
                    .narrow=${this.narrow}
                  ></ha-menu-button>
                `
                : Y`
                  <ha-icon-button-arrow-prev
                    .hass=${this.hass}
                    @click=${this._handleBack}
                  ></ha-icon-button-arrow-prev>
                `
            }
          </div>`
      }
      <div class="content">
        <ha-circular-progress active></ha-circular-progress>
      </div>
    `;
            },
          },
          {
            kind: "method",
            key: "_handleBack",
            value: function () {
              history.back();
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return [
                Te,
                b`
        :host {
          display: block;
          height: 100%;
          background-color: var(--primary-background-color);
        }
        .toolbar {
          display: flex;
          align-items: center;
          font-size: 20px;
          height: var(--header-height);
          padding: 0 16px;
          pointer-events: none;
          background-color: var(--app-header-background-color);
          font-weight: 400;
          color: var(--app-header-text-color, white);
          border-bottom: var(--app-header-border-bottom, none);
          box-sizing: border-box;
        }
        ha-menu-button,
        ha-icon-button-arrow-prev {
          pointer-events: auto;
        }
        .content {
          height: calc(100% - var(--header-height));
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,
              ];
            },
          },
        ],
      };
    },
    ge
  );
const Au = (e, t, o = true) => {
    var r;
    if (!e || e === document.body) return null;
    if (
      (e = null !== (r = e.assignedSlot) && void 0 !== r ? r : e).parentElement
    )
      e = e.parentElement;
    else {
      const t = e.getRootNode();
      e = t instanceof ShadowRoot ? t.host : null;
    }
    return (o ? Object.prototype.hasOwnProperty.call(e, t) : e && t in e)
      ? e
      : Au(e, t, o);
  },
  Hu = (e = document) => {
    var t, o;
    return null !== (t = e.activeElement) &&
      void 0 !== t &&
      null !== (o = t.shadowRoot) &&
      void 0 !== o &&
      o.activeElement
      ? Hu(e.activeElement.shadowRoot)
      : e.activeElement;
  },
  wu = () =>
    new Promise((e) => {
      var t;
      (t = e), requestAnimationFrame(() => setTimeout(t, 0));
    }),
  Lu = {},
  Vu = Symbol.for("HA focus target"),
  ku = async (e, t, o, r, i, a = !0) => {
    var n;
    if (!(o in Lu)) {
      if (!i)
        return void (
          __DEV__ &&
          console.warn(
            "Asked to show dialog that's not loaded and can't be imported"
          )
        );
      Lu[o] = {
        element: i().then(() => {
          const t = document.createElement(o);
          return e.provideHass(t), t;
        }),
      };
    }
    if (
      (null !== (n = et.history.state) && void 0 !== n && n.replaced
        ? ((Lu[o].closedFocusTargets =
            Lu[et.history.state.dialog].closedFocusTargets),
          delete Lu[et.history.state.dialog].closedFocusTargets)
        : (Lu[o].closedFocusTargets = ((e, t, o = !0) => {
            const r = new Set();
            for (; e; ) r.add(e), (e = Au(e, t, o));
            return r;
          })(Hu(), Vu)),
      a)
    ) {
      var s, l;
      et.history.replaceState(
        {
          dialog: o,
          open: !1,
          oldState:
            null !== (s = et.history.state) &&
            void 0 !== s &&
            s.open &&
            (null === (l = et.history.state) || void 0 === l
              ? void 0
              : l.dialog) !== o
              ? et.history.state
              : null,
        },
        ""
      );
      try {
        et.history.pushState({ dialog: o, dialogParams: r, open: !0 }, "");
      } catch (e) {
        et.history.pushState({ dialog: o, dialogParams: null, open: !0 }, "");
      }
    }
    const d = await Lu[o].element;
    d.addEventListener("dialog-closed", Mu), t.appendChild(d), d.showDialog(r);
  },
  Mu = async (e) => {
    const t = Lu[e.detail.dialog].closedFocusTargets;
    if ((delete Lu[e.detail.dialog].closedFocusTargets, !t)) return;
    let o = Hu();
    o instanceof HTMLElement && o.blur(), await wu();
    for (const e of t)
      if (
        e instanceof HTMLElement &&
        (e.focus(), (o = Hu()), o && o !== document.body)
      )
        return;
    __DEV__ &&
      console.warn("Failed to focus any targets after closing dialog: %o", t);
  },
  xu = (e, t) => {
    const o = (null == t ? void 0 : t.replace) || !1;
    var r;
    o
      ? et.history.replaceState(
          null !== (r = et.history.state) && void 0 !== r && r.root
            ? { root: !0 }
            : null,
          "",
          e
        )
      : et.history.pushState(null, "", e),
      tt(et, "location-changed", { replace: o });
  },
  Su = sn`
<custom-style>
  <style is="custom-style">
    html {

      /* Material Design color palette for Google products */

      --google-red-100: #f4c7c3;
      --google-red-300: #e67c73;
      --google-red-500: #db4437;
      --google-red-700: #c53929;

      --google-blue-100: #c6dafc;
      --google-blue-300: #7baaf7;
      --google-blue-500: #4285f4;
      --google-blue-700: #3367d6;

      --google-green-100: #b7e1cd;
      --google-green-300: #57bb8a;
      --google-green-500: #0f9d58;
      --google-green-700: #0b8043;

      --google-yellow-100: #fce8b2;
      --google-yellow-300: #f7cb4d;
      --google-yellow-500: #f4b400;
      --google-yellow-700: #f09300;

      --google-grey-100: #f5f5f5;
      --google-grey-300: #e0e0e0;
      --google-grey-500: #9e9e9e;
      --google-grey-700: #616161;

      /* Material Design color palette from online spec document */

      --paper-red-50: #ffebee;
      --paper-red-100: #ffcdd2;
      --paper-red-200: #ef9a9a;
      --paper-red-300: #e57373;
      --paper-red-400: #ef5350;
      --paper-red-500: #f44336;
      --paper-red-600: #e53935;
      --paper-red-700: #d32f2f;
      --paper-red-800: #c62828;
      --paper-red-900: #b71c1c;
      --paper-red-a100: #ff8a80;
      --paper-red-a200: #ff5252;
      --paper-red-a400: #ff1744;
      --paper-red-a700: #d50000;

      --paper-pink-50: #fce4ec;
      --paper-pink-100: #f8bbd0;
      --paper-pink-200: #f48fb1;
      --paper-pink-300: #f06292;
      --paper-pink-400: #ec407a;
      --paper-pink-500: #e91e63;
      --paper-pink-600: #d81b60;
      --paper-pink-700: #c2185b;
      --paper-pink-800: #ad1457;
      --paper-pink-900: #880e4f;
      --paper-pink-a100: #ff80ab;
      --paper-pink-a200: #ff4081;
      --paper-pink-a400: #f50057;
      --paper-pink-a700: #c51162;

      --paper-purple-50: #f3e5f5;
      --paper-purple-100: #e1bee7;
      --paper-purple-200: #ce93d8;
      --paper-purple-300: #ba68c8;
      --paper-purple-400: #ab47bc;
      --paper-purple-500: #9c27b0;
      --paper-purple-600: #8e24aa;
      --paper-purple-700: #7b1fa2;
      --paper-purple-800: #6a1b9a;
      --paper-purple-900: #4a148c;
      --paper-purple-a100: #ea80fc;
      --paper-purple-a200: #e040fb;
      --paper-purple-a400: #d500f9;
      --paper-purple-a700: #aa00ff;

      --paper-deep-purple-50: #ede7f6;
      --paper-deep-purple-100: #d1c4e9;
      --paper-deep-purple-200: #b39ddb;
      --paper-deep-purple-300: #9575cd;
      --paper-deep-purple-400: #7e57c2;
      --paper-deep-purple-500: #673ab7;
      --paper-deep-purple-600: #5e35b1;
      --paper-deep-purple-700: #512da8;
      --paper-deep-purple-800: #4527a0;
      --paper-deep-purple-900: #311b92;
      --paper-deep-purple-a100: #b388ff;
      --paper-deep-purple-a200: #7c4dff;
      --paper-deep-purple-a400: #651fff;
      --paper-deep-purple-a700: #6200ea;

      --paper-indigo-50: #e8eaf6;
      --paper-indigo-100: #c5cae9;
      --paper-indigo-200: #9fa8da;
      --paper-indigo-300: #7986cb;
      --paper-indigo-400: #5c6bc0;
      --paper-indigo-500: #3f51b5;
      --paper-indigo-600: #3949ab;
      --paper-indigo-700: #303f9f;
      --paper-indigo-800: #283593;
      --paper-indigo-900: #1a237e;
      --paper-indigo-a100: #8c9eff;
      --paper-indigo-a200: #536dfe;
      --paper-indigo-a400: #3d5afe;
      --paper-indigo-a700: #304ffe;

      --paper-blue-50: #e3f2fd;
      --paper-blue-100: #bbdefb;
      --paper-blue-200: #90caf9;
      --paper-blue-300: #64b5f6;
      --paper-blue-400: #42a5f5;
      --paper-blue-500: #2196f3;
      --paper-blue-600: #1e88e5;
      --paper-blue-700: #1976d2;
      --paper-blue-800: #1565c0;
      --paper-blue-900: #0d47a1;
      --paper-blue-a100: #82b1ff;
      --paper-blue-a200: #448aff;
      --paper-blue-a400: #2979ff;
      --paper-blue-a700: #2962ff;

      --paper-light-blue-50: #e1f5fe;
      --paper-light-blue-100: #b3e5fc;
      --paper-light-blue-200: #81d4fa;
      --paper-light-blue-300: #4fc3f7;
      --paper-light-blue-400: #29b6f6;
      --paper-light-blue-500: #03a9f4;
      --paper-light-blue-600: #039be5;
      --paper-light-blue-700: #0288d1;
      --paper-light-blue-800: #0277bd;
      --paper-light-blue-900: #01579b;
      --paper-light-blue-a100: #80d8ff;
      --paper-light-blue-a200: #40c4ff;
      --paper-light-blue-a400: #00b0ff;
      --paper-light-blue-a700: #0091ea;

      --paper-cyan-50: #e0f7fa;
      --paper-cyan-100: #b2ebf2;
      --paper-cyan-200: #80deea;
      --paper-cyan-300: #4dd0e1;
      --paper-cyan-400: #26c6da;
      --paper-cyan-500: #00bcd4;
      --paper-cyan-600: #00acc1;
      --paper-cyan-700: #0097a7;
      --paper-cyan-800: #00838f;
      --paper-cyan-900: #006064;
      --paper-cyan-a100: #84ffff;
      --paper-cyan-a200: #18ffff;
      --paper-cyan-a400: #00e5ff;
      --paper-cyan-a700: #00b8d4;

      --paper-teal-50: #e0f2f1;
      --paper-teal-100: #b2dfdb;
      --paper-teal-200: #80cbc4;
      --paper-teal-300: #4db6ac;
      --paper-teal-400: #26a69a;
      --paper-teal-500: #009688;
      --paper-teal-600: #00897b;
      --paper-teal-700: #00796b;
      --paper-teal-800: #00695c;
      --paper-teal-900: #004d40;
      --paper-teal-a100: #a7ffeb;
      --paper-teal-a200: #64ffda;
      --paper-teal-a400: #1de9b6;
      --paper-teal-a700: #00bfa5;

      --paper-green-50: #e8f5e9;
      --paper-green-100: #c8e6c9;
      --paper-green-200: #a5d6a7;
      --paper-green-300: #81c784;
      --paper-green-400: #66bb6a;
      --paper-green-500: #4caf50;
      --paper-green-600: #43a047;
      --paper-green-700: #388e3c;
      --paper-green-800: #2e7d32;
      --paper-green-900: #1b5e20;
      --paper-green-a100: #b9f6ca;
      --paper-green-a200: #69f0ae;
      --paper-green-a400: #00e676;
      --paper-green-a700: #00c853;

      --paper-light-green-50: #f1f8e9;
      --paper-light-green-100: #dcedc8;
      --paper-light-green-200: #c5e1a5;
      --paper-light-green-300: #aed581;
      --paper-light-green-400: #9ccc65;
      --paper-light-green-500: #8bc34a;
      --paper-light-green-600: #7cb342;
      --paper-light-green-700: #689f38;
      --paper-light-green-800: #558b2f;
      --paper-light-green-900: #33691e;
      --paper-light-green-a100: #ccff90;
      --paper-light-green-a200: #b2ff59;
      --paper-light-green-a400: #76ff03;
      --paper-light-green-a700: #64dd17;

      --paper-lime-50: #f9fbe7;
      --paper-lime-100: #f0f4c3;
      --paper-lime-200: #e6ee9c;
      --paper-lime-300: #dce775;
      --paper-lime-400: #d4e157;
      --paper-lime-500: #cddc39;
      --paper-lime-600: #c0ca33;
      --paper-lime-700: #afb42b;
      --paper-lime-800: #9e9d24;
      --paper-lime-900: #827717;
      --paper-lime-a100: #f4ff81;
      --paper-lime-a200: #eeff41;
      --paper-lime-a400: #c6ff00;
      --paper-lime-a700: #aeea00;

      --paper-yellow-50: #fffde7;
      --paper-yellow-100: #fff9c4;
      --paper-yellow-200: #fff59d;
      --paper-yellow-300: #fff176;
      --paper-yellow-400: #ffee58;
      --paper-yellow-500: #ffeb3b;
      --paper-yellow-600: #fdd835;
      --paper-yellow-700: #fbc02d;
      --paper-yellow-800: #f9a825;
      --paper-yellow-900: #f57f17;
      --paper-yellow-a100: #ffff8d;
      --paper-yellow-a200: #ffff00;
      --paper-yellow-a400: #ffea00;
      --paper-yellow-a700: #ffd600;

      --paper-amber-50: #fff8e1;
      --paper-amber-100: #ffecb3;
      --paper-amber-200: #ffe082;
      --paper-amber-300: #ffd54f;
      --paper-amber-400: #ffca28;
      --paper-amber-500: #ffc107;
      --paper-amber-600: #ffb300;
      --paper-amber-700: #ffa000;
      --paper-amber-800: #ff8f00;
      --paper-amber-900: #ff6f00;
      --paper-amber-a100: #ffe57f;
      --paper-amber-a200: #ffd740;
      --paper-amber-a400: #ffc400;
      --paper-amber-a700: #ffab00;

      --paper-orange-50: #fff3e0;
      --paper-orange-100: #ffe0b2;
      --paper-orange-200: #ffcc80;
      --paper-orange-300: #ffb74d;
      --paper-orange-400: #ffa726;
      --paper-orange-500: #ff9800;
      --paper-orange-600: #fb8c00;
      --paper-orange-700: #f57c00;
      --paper-orange-800: #ef6c00;
      --paper-orange-900: #e65100;
      --paper-orange-a100: #ffd180;
      --paper-orange-a200: #ffab40;
      --paper-orange-a400: #ff9100;
      --paper-orange-a700: #ff6500;

      --paper-deep-orange-50: #fbe9e7;
      --paper-deep-orange-100: #ffccbc;
      --paper-deep-orange-200: #ffab91;
      --paper-deep-orange-300: #ff8a65;
      --paper-deep-orange-400: #ff7043;
      --paper-deep-orange-500: #ff5722;
      --paper-deep-orange-600: #f4511e;
      --paper-deep-orange-700: #e64a19;
      --paper-deep-orange-800: #d84315;
      --paper-deep-orange-900: #bf360c;
      --paper-deep-orange-a100: #ff9e80;
      --paper-deep-orange-a200: #ff6e40;
      --paper-deep-orange-a400: #ff3d00;
      --paper-deep-orange-a700: #dd2c00;

      --paper-brown-50: #efebe9;
      --paper-brown-100: #d7ccc8;
      --paper-brown-200: #bcaaa4;
      --paper-brown-300: #a1887f;
      --paper-brown-400: #8d6e63;
      --paper-brown-500: #795548;
      --paper-brown-600: #6d4c41;
      --paper-brown-700: #5d4037;
      --paper-brown-800: #4e342e;
      --paper-brown-900: #3e2723;

      --paper-grey-50: #fafafa;
      --paper-grey-100: #f5f5f5;
      --paper-grey-200: #eeeeee;
      --paper-grey-300: #e0e0e0;
      --paper-grey-400: #bdbdbd;
      --paper-grey-500: #9e9e9e;
      --paper-grey-600: #757575;
      --paper-grey-700: #616161;
      --paper-grey-800: #424242;
      --paper-grey-900: #212121;

      --paper-blue-grey-50: #eceff1;
      --paper-blue-grey-100: #cfd8dc;
      --paper-blue-grey-200: #b0bec5;
      --paper-blue-grey-300: #90a4ae;
      --paper-blue-grey-400: #78909c;
      --paper-blue-grey-500: #607d8b;
      --paper-blue-grey-600: #546e7a;
      --paper-blue-grey-700: #455a64;
      --paper-blue-grey-800: #37474f;
      --paper-blue-grey-900: #263238;

      /* opacity for dark text on a light background */
      --dark-divider-opacity: 0.12;
      --dark-disabled-opacity: 0.38; /* or hint text or icon */
      --dark-secondary-opacity: 0.54;
      --dark-primary-opacity: 0.87;

      /* opacity for light text on a dark background */
      --light-divider-opacity: 0.12;
      --light-disabled-opacity: 0.3; /* or hint text or icon */
      --light-secondary-opacity: 0.7;
      --light-primary-opacity: 1.0;

    }

  </style>
</custom-style>
`;
Su.setAttribute("style", "display: none;"),
  document.head.appendChild(Su.content);
const Eu = sn`
<custom-style>
  <style is="custom-style">
    html {
      /*
       * You can use these generic variables in your elements for easy theming.
       * For example, if all your elements use \`--primary-text-color\` as its main
       * color, then switching from a light to a dark theme is just a matter of
       * changing the value of \`--primary-text-color\` in your application.
       */
      --primary-text-color: var(--light-theme-text-color);
      --primary-background-color: var(--light-theme-background-color);
      --secondary-text-color: var(--light-theme-secondary-color);
      --disabled-text-color: var(--light-theme-disabled-color);
      --divider-color: var(--light-theme-divider-color);
      --error-color: var(--paper-deep-orange-a700);

      /*
       * Primary and accent colors. Also see color.js for more colors.
       */
      --primary-color: var(--paper-indigo-500);
      --light-primary-color: var(--paper-indigo-100);
      --dark-primary-color: var(--paper-indigo-700);

      --accent-color: var(--paper-pink-a200);
      --light-accent-color: var(--paper-pink-a100);
      --dark-accent-color: var(--paper-pink-a400);


      /*
       * Material Design Light background theme
       */
      --light-theme-background-color: #ffffff;
      --light-theme-base-color: #000000;
      --light-theme-text-color: var(--paper-grey-900);
      --light-theme-secondary-color: #737373;  /* for secondary text and icons */
      --light-theme-disabled-color: #9b9b9b;  /* disabled/hint text */
      --light-theme-divider-color: #dbdbdb;

      /*
       * Material Design Dark background theme
       */
      --dark-theme-background-color: var(--paper-grey-900);
      --dark-theme-base-color: #ffffff;
      --dark-theme-text-color: #ffffff;
      --dark-theme-secondary-color: #bcbcbc;  /* for secondary text and icons */
      --dark-theme-disabled-color: #646464;  /* disabled/hint text */
      --dark-theme-divider-color: #3c3c3c;

      /*
       * Deprecated values because of their confusing names.
       */
      --text-primary-color: var(--dark-theme-text-color);
      --default-primary-color: var(--primary-color);
    }
  </style>
</custom-style>`;
Eu.setAttribute("style", "display: none;"),
  document.head.appendChild(Eu.content);
const Pu = sn`
<custom-style>
  <style is="custom-style">
    html {

      --shadow-transition: {
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      };

      --shadow-none: {
        box-shadow: none;
      };

      /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */

      --shadow-elevation-2dp: {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
      };

      --shadow-elevation-3dp: {
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                    0 1px 8px 0 rgba(0, 0, 0, 0.12),
                    0 3px 3px -2px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-4dp: {
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                    0 1px 10px 0 rgba(0, 0, 0, 0.12),
                    0 2px 4px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-6dp: {
        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12),
                    0 3px 5px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-8dp: {
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                    0 3px 14px 2px rgba(0, 0, 0, 0.12),
                    0 5px 5px -3px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-12dp: {
        box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
                    0 4px 22px 3px rgba(0, 0, 0, 0.12),
                    0 6px 7px -4px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-16dp: {
        box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                    0  6px 30px 5px rgba(0, 0, 0, 0.12),
                    0  8px 10px -5px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-24dp: {
        box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                    0 9px 46px 8px rgba(0, 0, 0, 0.12),
                    0 11px 15px -7px rgba(0, 0, 0, 0.4);
      };
    }
  </style>
</custom-style>`;
Pu.setAttribute("style", "display: none;"),
  document.head.appendChild(Pu.content);
const Tu = sn`<custom-style>
  <style is="custom-style">
    html {

      /* Shared Styles */
      --paper-font-common-base: {
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
      };

      --paper-font-common-code: {
        font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
        -webkit-font-smoothing: antialiased;
      };

      --paper-font-common-expensive-kerning: {
        text-rendering: optimizeLegibility;
      };

      --paper-font-common-nowrap: {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      };

      /* Material Font Styles */

      --paper-font-display4: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 112px;
        font-weight: 300;
        letter-spacing: -.044em;
        line-height: 120px;
      };

      --paper-font-display3: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 56px;
        font-weight: 400;
        letter-spacing: -.026em;
        line-height: 60px;
      };

      --paper-font-display2: {
        @apply --paper-font-common-base;

        font-size: 45px;
        font-weight: 400;
        letter-spacing: -.018em;
        line-height: 48px;
      };

      --paper-font-display1: {
        @apply --paper-font-common-base;

        font-size: 34px;
        font-weight: 400;
        letter-spacing: -.01em;
        line-height: 40px;
      };

      --paper-font-headline: {
        @apply --paper-font-common-base;

        font-size: 24px;
        font-weight: 400;
        letter-spacing: -.012em;
        line-height: 32px;
      };

      --paper-font-title: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
      };

      --paper-font-subhead: {
        @apply --paper-font-common-base;

        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      };

      --paper-font-body2: {
        @apply --paper-font-common-base;

        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
      };

      --paper-font-body1: {
        @apply --paper-font-common-base;

        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      };

      --paper-font-caption: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.011em;
        line-height: 20px;
      };

      --paper-font-menu: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 13px;
        font-weight: 500;
        line-height: 24px;
      };

      --paper-font-button: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.018em;
        line-height: 24px;
        text-transform: uppercase;
      };

      --paper-font-code2: {
        @apply --paper-font-common-code;

        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
      };

      --paper-font-code1: {
        @apply --paper-font-common-code;

        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      };

    }

  </style>
</custom-style>`;
Tu.setAttribute("style", "display: none;"),
  document.head.appendChild(Tu.content);
const Ou = document.createElement("template");
Ou.setAttribute("style", "display: none;"),
  (Ou.innerHTML = `<custom-style>\n  <style>\n    /*\n      Home Assistant default styles.\n\n      In Polymer 2.0, default styles should to be set on the html selector.\n      (Setting all default styles only on body breaks shadyCSS polyfill.)\n      See: https://github.com/home-assistant/home-assistant-polymer/pull/901\n    */\n    html {\n      font-size: 14px;\n      height: 100vh;\n\n      /* text */\n      --primary-text-color: #212121;\n      --secondary-text-color: #727272;\n      --text-primary-color: #ffffff;\n      --text-light-primary-color: #212121;\n      --disabled-text-color: #bdbdbd;\n\n      /* main interface colors */\n      --primary-color: #03a9f4;\n      --dark-primary-color: #0288d1;\n      --light-primary-color: #b3e5fC;\n      --accent-color: #ff9800;\n      --divider-color: rgba(0, 0, 0, .12);\n\n      --scrollbar-thumb-color: rgb(194, 194, 194);\n\n      --error-color: #db4437;\n      --warning-color: #ffa600;\n      --success-color: #43a047;\n      --info-color: #039be5;\n\n      /* backgrounds */\n      --card-background-color: #ffffff;\n      --primary-background-color: #fafafa;\n      --secondary-background-color: #e5e5e5; /* behind the cards on state */\n\n      /* for header */\n      --header-height: 56px;\n\n      /* for label-badge */\n      --label-badge-red: #DF4C1E;\n      --label-badge-blue: #039be5;\n      --label-badge-green: #0DA035;\n      --label-badge-yellow: #f4b400;\n      --label-badge-grey: #9e9e9e;\n\n      /* states */\n      --state-icon-color: #44739e;\n      /* an active state is anything that would require attention */\n      --state-icon-active-color: #FDD835;\n      /* an error state is anything that would be considered an error */\n      /* --state-icon-error-color: #db4437; derived from error-color */\n\n      --state-on-color: #66a61e;\n      --state-off-color: #ff0029;\n      --state-home-color: #66a61e;\n      --state-not_home-color: #ff0029;\n      /* --state-unavailable-color: #a0a0a0; derived from disabled-text-color */\n      --state-unknown-color: #606060;\n      --state-idle-color: #7990a3;\n\n      /* climate state colors */\n      --state-climate-auto-color: #008000;\n      --state-climate-eco-color: #00ff7f;\n      --state-climate-cool-color: #2b9af9;\n      --state-climate-heat-color: #ff8100;\n      --state-climate-manual-color: #44739e;\n      --state-climate-off-color: #8a8a8a;\n      --state-climate-fan_only-color: #8a8a8a;\n      --state-climate-dry-color: #efbd07;\n      --state-climate-idle-color: #8a8a8a;\n\n      /* energy */\n      --energy-grid-consumption-color: #488fc2;\n      --energy-grid-return-color: #8353d1;\n      --energy-solar-color: #ff9800;\n      --energy-non-fossil-color: #0f9d58;\n      --energy-battery-out-color: #4db6ac;\n      --energy-battery-in-color: #f06292;\n      --energy-gas-color: #8E021B;\n\n      /* opacity for dark text on a light background */\n      --dark-divider-opacity: 0.12;\n      --dark-disabled-opacity: 0.38; /* or hint text or icon */\n      --dark-secondary-opacity: 0.54;\n      --dark-primary-opacity: 0.87;\n\n      /* opacity for light text on a dark background */\n      --light-divider-opacity: 0.12;\n      --light-disabled-opacity: 0.3; /* or hint text or icon */\n      --light-secondary-opacity: 0.7;\n      --light-primary-opacity: 1.0;\n\n      /* rgb */\n      --rgb-primary-color: 3, 169, 244;\n      --rgb-accent-color: 255, 152, 0;\n      --rgb-primary-text-color: 33, 33, 33;\n      --rgb-secondary-text-color: 114, 114, 114;\n      --rgb-text-primary-color: 255, 255, 255;\n      --rgb-card-background-color: 255, 255, 255;\n      --rgb-disabled-color: 189, 189, 189;\n\n      /* input components */\n      --input-idle-line-color: rgba(0, 0, 0, 0.42);\n      --input-hover-line-color: rgba(0, 0, 0, 0.87);\n      --input-disabled-line-color: rgba(0, 0, 0, 0.06);\n      --input-outlined-idle-border-color: rgba(0, 0, 0, 0.38);\n      --input-outlined-hover-border-color: rgba(0, 0, 0, 0.87);\n      --input-outlined-disabled-border-color: rgba(0, 0, 0, 0.06);\n      --input-fill-color: rgb(245, 245, 245);\n      --input-disabled-fill-color: rgb(250, 250, 250);\n      --input-ink-color: rgba(0, 0, 0, 0.87);\n      --input-label-ink-color: rgba(0, 0, 0, 0.6);\n      --input-disabled-ink-color: rgba(0, 0, 0, 0.37);\n      --input-dropdown-icon-color: rgba(0, 0, 0, 0.54);\n\n      /* Vaadin typography */\n      --material-h6-font-size: 1.25rem;\n      --material-small-font-size: 0.875rem;\n      --material-caption-font-size: 0.75rem;\n      --material-button-font-size: 0.875rem;\n\n      ${Object.entries(
    Ee
  )
    .map(([e, t]) => `--${e}: ${t};`)
    .join("")}\n    }\n  </style>\n</custom-style>`),
  document.head.appendChild(Ou.content);
let Nu = s(
  null,
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hacs",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "route",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "active",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "secondary",
          value: () => !1,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "loading",
          value: () => !0,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "narrow",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "sidebarDocked",
          value: void 0,
        },
        {
          kind: "method",
          key: "shouldUpdate",
          value: function (e) {
            return (
              e.forEach((e, t) => {
                "hass" === t &&
                  (this.sidebarDocked =
                    '"docked"' ===
                    window.localStorage.getItem("dockedSidebar"));
              }),
              e.has("sidebarDocked") ||
                e.has("narrow") ||
                e.has("active") ||
                e.has("params") ||
                e.has("_error") ||
                e.has("_progress") ||
                e.has("_repository") ||
                e.has("_releaseNotes") ||
                e.has("_updating")
            );
          },
        },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            r(t(i.prototype), "connectedCallback", this).call(this),
              (this.sidebarDocked =
                '"docked"' === window.localStorage.getItem("dockedSidebar"));
          },
        },
      ],
    };
  },
  ge
);
const Ru = {
  "custom-repositories": () => import("./c.72adecca.js"),
  generic: () => import("./c.c472ba5e.js"),
  download: () => import("./c.95821fdc.js"),
  progress: () => import("./c.14eed04b.js"),
};
let zu;
s(
  [be("hacs-event-dialog")],
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
          decorators: [Ce({ attribute: !1 })],
          key: "params",
          value: void 0,
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            if (!this.active) return Y``;
            const e = this.params.type || "generic";
            Ru[e]();
            const t = document.createElement(`hacs-${e}-dialog`);
            if (
              ((t.active = !0),
              (t.hass = this.hass),
              (t.hacs = this.hacs),
              (t.narrow = this.narrow),
              (t.secondary = this.secondary),
              (t.route = this.route),
              this.params)
            )
              for (const [e, o] of Object.entries(this.params)) t[e] = o;
            return Y`${t}`;
          },
        },
      ],
    };
  },
  Nu
),
  (function (e) {
    (e.CONFIG = "hacs_dispatch_config"),
      (e.ERROR = "hacs_dispatch_error"),
      (e.RELOAD = "hacs_dispatch_reload"),
      (e.REPOSITORY = "hacs_dispatch_repository"),
      (e.STAGE = "hacs_dispatch_stage"),
      (e.STARTUP = "hacs_dispatch_startup"),
      (e.STATUS = "hacs_dispatch_status");
  })(zu || (zu = {}));
const Iu = async (e) => e.connection.sendMessagePromise({ type: "hacs/info" }),
  Du = async (e) =>
    e.connection.sendMessagePromise({ type: "hacs/repositories/list" }),
  ju = async (e, t) =>
    e.connection.sendMessagePromise({
      type: "hacs/repository/remove",
      repository: t,
    }),
  Bu = async (e, t, o) =>
    e.connection.sendMessagePromise({
      type: "hacs/repositories/add",
      repository: t,
      category: o,
    }),
  $u = async (e, t, o) =>
    e.connection.sendMessagePromise({
      type: "hacs/repository/beta",
      repository: t,
      show_beta: o,
    }),
  Fu = async (e, t) =>
    e.connection.sendMessagePromise({
      type: "hacs/repository/refresh",
      repository: t,
    }),
  Uu = async (e, t) =>
    e.connection.sendMessagePromise({
      type: "hacs/repositories/remove",
      repository: t,
    }),
  Zu = async (e, t) =>
    e.connection.sendMessagePromise({
      type: "hacs/repositories/clear_new",
      categories: t.info.categories,
    }),
  Gu = (e) => e.connection.sendMessagePromise({ type: "lovelace/resources" }),
  qu = (e, t) => e.callWS({ type: "lovelace/resources/create", ...t }),
  Ku = (e, t) => e.callWS({ type: "lovelace/resources/update", ...t }),
  Yu = (e, t) =>
    e.callWS({ type: "lovelace/resources/delete", resource_id: t }),
  Xu = (e, t, o) =>
    e.connection.subscribeMessage(t, { type: "hacs/subscribe", signal: o }),
  Ju = (e) =>
    `/hacsfiles/${e.repository.full_name.split("/")[1]}/${
      e.repository.file_name
    }${
      e.skipTag
        ? ""
        : `?hacstag=${((e, t) =>
            String(
              `${e.id}${(
                t ||
                e.installed_version ||
                e.selected_tag ||
                e.available_version
              ).replace(/\D+/g, "")}`
            ))(e.repository, e.version)}`
    }`,
  Wu = (e, t) => {
    var o, r;
    if (!t.installed) return !0;
    if ("plugin" !== t.category) return !0;
    if (
      "storage" !==
      (null === (o = e.info) || void 0 === o ? void 0 : o.lovelace_mode)
    )
      return !0;
    const i = Ju({ repository: t, skipTag: !0 });
    return (
      (null === (r = e.resources) || void 0 === r
        ? void 0
        : r.some((e) => e.url.includes(i))) || !1
    );
  };
class Qu {
  constructor(t) {
    e(this, "prefix", void 0), (this.prefix = t ? `[HACS.${t}]` : "[HACS]");
  }
  info(e) {
    this.log(e);
  }
  log(e) {
    console.log(this.prefix, e);
  }
  debug(e) {
    console.debug(this.prefix, e);
  }
  warn(e) {
    console.warn(this.prefix, e);
  }
  error(e) {
    console.error(this.prefix, e);
  }
}
var eh, th, oh;
function rh(e) {
  return e.type === th.literal;
}
function ih(e) {
  return e.type === th.argument;
}
function ah(e) {
  return e.type === th.number;
}
function nh(e) {
  return e.type === th.date;
}
function sh(e) {
  return e.type === th.time;
}
function lh(e) {
  return e.type === th.select;
}
function dh(e) {
  return e.type === th.plural;
}
function ch(e) {
  return e.type === th.pound;
}
function ph(e) {
  return e.type === th.tag;
}
function uh(e) {
  return !(!e || "object" != typeof e || e.type !== oh.number);
}
function hh(e) {
  return !(!e || "object" != typeof e || e.type !== oh.dateTime);
}
!(function (e) {
  (e[(e.EXPECT_ARGUMENT_CLOSING_BRACE = 1)] = "EXPECT_ARGUMENT_CLOSING_BRACE"),
    (e[(e.EMPTY_ARGUMENT = 2)] = "EMPTY_ARGUMENT"),
    (e[(e.MALFORMED_ARGUMENT = 3)] = "MALFORMED_ARGUMENT"),
    (e[(e.EXPECT_ARGUMENT_TYPE = 4)] = "EXPECT_ARGUMENT_TYPE"),
    (e[(e.INVALID_ARGUMENT_TYPE = 5)] = "INVALID_ARGUMENT_TYPE"),
    (e[(e.EXPECT_ARGUMENT_STYLE = 6)] = "EXPECT_ARGUMENT_STYLE"),
    (e[(e.INVALID_NUMBER_SKELETON = 7)] = "INVALID_NUMBER_SKELETON"),
    (e[(e.INVALID_DATE_TIME_SKELETON = 8)] = "INVALID_DATE_TIME_SKELETON"),
    (e[(e.EXPECT_NUMBER_SKELETON = 9)] = "EXPECT_NUMBER_SKELETON"),
    (e[(e.EXPECT_DATE_TIME_SKELETON = 10)] = "EXPECT_DATE_TIME_SKELETON"),
    (e[(e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11)] =
      "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"),
    (e[(e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12)] =
      "EXPECT_SELECT_ARGUMENT_OPTIONS"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13)] =
      "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"),
    (e[(e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14)] =
      "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"),
    (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15)] =
      "EXPECT_SELECT_ARGUMENT_SELECTOR"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16)] =
      "EXPECT_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17)] =
      "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18)] =
      "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"),
    (e[(e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19)] =
      "INVALID_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20)] =
      "DUPLICATE_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21)] =
      "DUPLICATE_SELECT_ARGUMENT_SELECTOR"),
    (e[(e.MISSING_OTHER_CLAUSE = 22)] = "MISSING_OTHER_CLAUSE"),
    (e[(e.INVALID_TAG = 23)] = "INVALID_TAG"),
    (e[(e.INVALID_TAG_NAME = 25)] = "INVALID_TAG_NAME"),
    (e[(e.UNMATCHED_CLOSING_TAG = 26)] = "UNMATCHED_CLOSING_TAG"),
    (e[(e.UNCLOSED_TAG = 27)] = "UNCLOSED_TAG");
})(eh || (eh = {})),
  (function (e) {
    (e[(e.literal = 0)] = "literal"),
      (e[(e.argument = 1)] = "argument"),
      (e[(e.number = 2)] = "number"),
      (e[(e.date = 3)] = "date"),
      (e[(e.time = 4)] = "time"),
      (e[(e.select = 5)] = "select"),
      (e[(e.plural = 6)] = "plural"),
      (e[(e.pound = 7)] = "pound"),
      (e[(e.tag = 8)] = "tag");
  })(th || (th = {})),
  (function (e) {
    (e[(e.number = 0)] = "number"), (e[(e.dateTime = 1)] = "dateTime");
  })(oh || (oh = {}));
var mh = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
  _h =
    /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function fh(e) {
  var t = {};
  return (
    e.replace(_h, function (e) {
      var o = e.length;
      switch (e[0]) {
        case "G":
          t.era = 4 === o ? "long" : 5 === o ? "narrow" : "short";
          break;
        case "y":
          t.year = 2 === o ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError(
            "`Y/u/U/r` (year) patterns are not supported, use `y` instead"
          );
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          t.month = ["numeric", "2-digit", "short", "long", "narrow"][o - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          t.day = ["numeric", "2-digit"][o - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError(
            "`D/F/g` (day) patterns are not supported, use `d` instead"
          );
        case "E":
          t.weekday = 4 === o ? "short" : 5 === o ? "narrow" : "short";
          break;
        case "e":
          if (o < 4)
            throw new RangeError(
              "`e..eee` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][o - 4];
          break;
        case "c":
          if (o < 4)
            throw new RangeError(
              "`c..ccc` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][o - 4];
          break;
        case "a":
          t.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError(
            "`b/B` (period) patterns are not supported, use `a` instead"
          );
        case "h":
          (t.hourCycle = "h12"), (t.hour = ["numeric", "2-digit"][o - 1]);
          break;
        case "H":
          (t.hourCycle = "h23"), (t.hour = ["numeric", "2-digit"][o - 1]);
          break;
        case "K":
          (t.hourCycle = "h11"), (t.hour = ["numeric", "2-digit"][o - 1]);
          break;
        case "k":
          (t.hourCycle = "h24"), (t.hour = ["numeric", "2-digit"][o - 1]);
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError(
            "`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead"
          );
        case "m":
          t.minute = ["numeric", "2-digit"][o - 1];
          break;
        case "s":
          t.second = ["numeric", "2-digit"][o - 1];
          break;
        case "S":
        case "A":
          throw new RangeError(
            "`S/A` (second) patterns are not supported, use `s` instead"
          );
        case "z":
          t.timeZoneName = o < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError(
            "`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead"
          );
      }
      return "";
    }),
    t
  );
}
var gh = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
var yh = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
  bh = /^(@+)?(\+|#+)?[rs]?$/g,
  vh = /(\*)(0+)|(#+)(0+)|(0+)/g,
  Ch = /^(0+)$/;
function Ah(e) {
  var t = {};
  return (
    "r" === e[e.length - 1]
      ? (t.roundingPriority = "morePrecision")
      : "s" === e[e.length - 1] && (t.roundingPriority = "lessPrecision"),
    e.replace(bh, function (e, o, r) {
      return (
        "string" != typeof r
          ? ((t.minimumSignificantDigits = o.length),
            (t.maximumSignificantDigits = o.length))
          : "+" === r
          ? (t.minimumSignificantDigits = o.length)
          : "#" === o[0]
          ? (t.maximumSignificantDigits = o.length)
          : ((t.minimumSignificantDigits = o.length),
            (t.maximumSignificantDigits =
              o.length + ("string" == typeof r ? r.length : 0))),
        ""
      );
    }),
    t
  );
}
function Hh(e) {
  switch (e) {
    case "sign-auto":
      return { signDisplay: "auto" };
    case "sign-accounting":
    case "()":
      return { currencySign: "accounting" };
    case "sign-always":
    case "+!":
      return { signDisplay: "always" };
    case "sign-accounting-always":
    case "()!":
      return { signDisplay: "always", currencySign: "accounting" };
    case "sign-except-zero":
    case "+?":
      return { signDisplay: "exceptZero" };
    case "sign-accounting-except-zero":
    case "()?":
      return { signDisplay: "exceptZero", currencySign: "accounting" };
    case "sign-never":
    case "+_":
      return { signDisplay: "never" };
  }
}
function wh(e) {
  var t;
  if (
    ("E" === e[0] && "E" === e[1]
      ? ((t = { notation: "engineering" }), (e = e.slice(2)))
      : "E" === e[0] && ((t = { notation: "scientific" }), (e = e.slice(1))),
    t)
  ) {
    var o = e.slice(0, 2);
    if (
      ("+!" === o
        ? ((t.signDisplay = "always"), (e = e.slice(2)))
        : "+?" === o && ((t.signDisplay = "exceptZero"), (e = e.slice(2))),
      !Ch.test(e))
    )
      throw new Error("Malformed concise eng/scientific notation");
    t.minimumIntegerDigits = e.length;
  }
  return t;
}
function Lh(e) {
  var t = Hh(e);
  return t || {};
}
function Vh(e) {
  for (var t = {}, o = 0, r = e; o < r.length; o++) {
    var i = r[o];
    switch (i.stem) {
      case "percent":
      case "%":
        t.style = "percent";
        continue;
      case "%x100":
        (t.style = "percent"), (t.scale = 100);
        continue;
      case "currency":
        (t.style = "currency"), (t.currency = i.options[0]);
        continue;
      case "group-off":
      case ",_":
        t.useGrouping = !1;
        continue;
      case "precision-integer":
      case ".":
        t.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        (t.style = "unit"), (t.unit = i.options[0].replace(/^(.*?)-/, ""));
        continue;
      case "compact-short":
      case "K":
        (t.notation = "compact"), (t.compactDisplay = "short");
        continue;
      case "compact-long":
      case "KK":
        (t.notation = "compact"), (t.compactDisplay = "long");
        continue;
      case "scientific":
        t = Hn(
          Hn(Hn({}, t), { notation: "scientific" }),
          i.options.reduce(function (e, t) {
            return Hn(Hn({}, e), Lh(t));
          }, {})
        );
        continue;
      case "engineering":
        t = Hn(
          Hn(Hn({}, t), { notation: "engineering" }),
          i.options.reduce(function (e, t) {
            return Hn(Hn({}, e), Lh(t));
          }, {})
        );
        continue;
      case "notation-simple":
        t.notation = "standard";
        continue;
      case "unit-width-narrow":
        (t.currencyDisplay = "narrowSymbol"), (t.unitDisplay = "narrow");
        continue;
      case "unit-width-short":
        (t.currencyDisplay = "code"), (t.unitDisplay = "short");
        continue;
      case "unit-width-full-name":
        (t.currencyDisplay = "name"), (t.unitDisplay = "long");
        continue;
      case "unit-width-iso-code":
        t.currencyDisplay = "symbol";
        continue;
      case "scale":
        t.scale = parseFloat(i.options[0]);
        continue;
      case "integer-width":
        if (i.options.length > 1)
          throw new RangeError(
            "integer-width stems only accept a single optional option"
          );
        i.options[0].replace(vh, function (e, o, r, i, a, n) {
          if (o) t.minimumIntegerDigits = r.length;
          else {
            if (i && a)
              throw new Error(
                "We currently do not support maximum integer digits"
              );
            if (n)
              throw new Error(
                "We currently do not support exact integer digits"
              );
          }
          return "";
        });
        continue;
    }
    if (Ch.test(i.stem)) t.minimumIntegerDigits = i.stem.length;
    else if (yh.test(i.stem)) {
      if (i.options.length > 1)
        throw new RangeError(
          "Fraction-precision stems only accept a single optional option"
        );
      i.stem.replace(yh, function (e, o, r, i, a, n) {
        return (
          "*" === r
            ? (t.minimumFractionDigits = o.length)
            : i && "#" === i[0]
            ? (t.maximumFractionDigits = i.length)
            : a && n
            ? ((t.minimumFractionDigits = a.length),
              (t.maximumFractionDigits = a.length + n.length))
            : ((t.minimumFractionDigits = o.length),
              (t.maximumFractionDigits = o.length)),
          ""
        );
      });
      var a = i.options[0];
      "w" === a
        ? (t = Hn(Hn({}, t), { trailingZeroDisplay: "stripIfInteger" }))
        : a && (t = Hn(Hn({}, t), Ah(a)));
    } else if (bh.test(i.stem)) t = Hn(Hn({}, t), Ah(i.stem));
    else {
      var n = Hh(i.stem);
      n && (t = Hn(Hn({}, t), n));
      var s = wh(i.stem);
      s && (t = Hn(Hn({}, t), s));
    }
  }
  return t;
}
var kh,
  Mh = {
    AX: ["H"],
    BQ: ["H"],
    CP: ["H"],
    CZ: ["H"],
    DK: ["H"],
    FI: ["H"],
    ID: ["H"],
    IS: ["H"],
    ML: ["H"],
    NE: ["H"],
    RU: ["H"],
    SE: ["H"],
    SJ: ["H"],
    SK: ["H"],
    AS: ["h", "H"],
    BT: ["h", "H"],
    DJ: ["h", "H"],
    ER: ["h", "H"],
    GH: ["h", "H"],
    IN: ["h", "H"],
    LS: ["h", "H"],
    PG: ["h", "H"],
    PW: ["h", "H"],
    SO: ["h", "H"],
    TO: ["h", "H"],
    VU: ["h", "H"],
    WS: ["h", "H"],
    "001": ["H", "h"],
    AL: ["h", "H", "hB"],
    TD: ["h", "H", "hB"],
    "ca-ES": ["H", "h", "hB"],
    CF: ["H", "h", "hB"],
    CM: ["H", "h", "hB"],
    "fr-CA": ["H", "h", "hB"],
    "gl-ES": ["H", "h", "hB"],
    "it-CH": ["H", "h", "hB"],
    "it-IT": ["H", "h", "hB"],
    LU: ["H", "h", "hB"],
    NP: ["H", "h", "hB"],
    PF: ["H", "h", "hB"],
    SC: ["H", "h", "hB"],
    SM: ["H", "h", "hB"],
    SN: ["H", "h", "hB"],
    TF: ["H", "h", "hB"],
    VA: ["H", "h", "hB"],
    CY: ["h", "H", "hb", "hB"],
    GR: ["h", "H", "hb", "hB"],
    CO: ["h", "H", "hB", "hb"],
    DO: ["h", "H", "hB", "hb"],
    KP: ["h", "H", "hB", "hb"],
    KR: ["h", "H", "hB", "hb"],
    NA: ["h", "H", "hB", "hb"],
    PA: ["h", "H", "hB", "hb"],
    PR: ["h", "H", "hB", "hb"],
    VE: ["h", "H", "hB", "hb"],
    AC: ["H", "h", "hb", "hB"],
    AI: ["H", "h", "hb", "hB"],
    BW: ["H", "h", "hb", "hB"],
    BZ: ["H", "h", "hb", "hB"],
    CC: ["H", "h", "hb", "hB"],
    CK: ["H", "h", "hb", "hB"],
    CX: ["H", "h", "hb", "hB"],
    DG: ["H", "h", "hb", "hB"],
    FK: ["H", "h", "hb", "hB"],
    GB: ["H", "h", "hb", "hB"],
    GG: ["H", "h", "hb", "hB"],
    GI: ["H", "h", "hb", "hB"],
    IE: ["H", "h", "hb", "hB"],
    IM: ["H", "h", "hb", "hB"],
    IO: ["H", "h", "hb", "hB"],
    JE: ["H", "h", "hb", "hB"],
    LT: ["H", "h", "hb", "hB"],
    MK: ["H", "h", "hb", "hB"],
    MN: ["H", "h", "hb", "hB"],
    MS: ["H", "h", "hb", "hB"],
    NF: ["H", "h", "hb", "hB"],
    NG: ["H", "h", "hb", "hB"],
    NR: ["H", "h", "hb", "hB"],
    NU: ["H", "h", "hb", "hB"],
    PN: ["H", "h", "hb", "hB"],
    SH: ["H", "h", "hb", "hB"],
    SX: ["H", "h", "hb", "hB"],
    TA: ["H", "h", "hb", "hB"],
    ZA: ["H", "h", "hb", "hB"],
    "af-ZA": ["H", "h", "hB", "hb"],
    AR: ["H", "h", "hB", "hb"],
    CL: ["H", "h", "hB", "hb"],
    CR: ["H", "h", "hB", "hb"],
    CU: ["H", "h", "hB", "hb"],
    EA: ["H", "h", "hB", "hb"],
    "es-BO": ["H", "h", "hB", "hb"],
    "es-BR": ["H", "h", "hB", "hb"],
    "es-EC": ["H", "h", "hB", "hb"],
    "es-ES": ["H", "h", "hB", "hb"],
    "es-GQ": ["H", "h", "hB", "hb"],
    "es-PE": ["H", "h", "hB", "hb"],
    GT: ["H", "h", "hB", "hb"],
    HN: ["H", "h", "hB", "hb"],
    IC: ["H", "h", "hB", "hb"],
    KG: ["H", "h", "hB", "hb"],
    KM: ["H", "h", "hB", "hb"],
    LK: ["H", "h", "hB", "hb"],
    MA: ["H", "h", "hB", "hb"],
    MX: ["H", "h", "hB", "hb"],
    NI: ["H", "h", "hB", "hb"],
    PY: ["H", "h", "hB", "hb"],
    SV: ["H", "h", "hB", "hb"],
    UY: ["H", "h", "hB", "hb"],
    JP: ["H", "h", "K"],
    AD: ["H", "hB"],
    AM: ["H", "hB"],
    AO: ["H", "hB"],
    AT: ["H", "hB"],
    AW: ["H", "hB"],
    BE: ["H", "hB"],
    BF: ["H", "hB"],
    BJ: ["H", "hB"],
    BL: ["H", "hB"],
    BR: ["H", "hB"],
    CG: ["H", "hB"],
    CI: ["H", "hB"],
    CV: ["H", "hB"],
    DE: ["H", "hB"],
    EE: ["H", "hB"],
    FR: ["H", "hB"],
    GA: ["H", "hB"],
    GF: ["H", "hB"],
    GN: ["H", "hB"],
    GP: ["H", "hB"],
    GW: ["H", "hB"],
    HR: ["H", "hB"],
    IL: ["H", "hB"],
    IT: ["H", "hB"],
    KZ: ["H", "hB"],
    MC: ["H", "hB"],
    MD: ["H", "hB"],
    MF: ["H", "hB"],
    MQ: ["H", "hB"],
    MZ: ["H", "hB"],
    NC: ["H", "hB"],
    NL: ["H", "hB"],
    PM: ["H", "hB"],
    PT: ["H", "hB"],
    RE: ["H", "hB"],
    RO: ["H", "hB"],
    SI: ["H", "hB"],
    SR: ["H", "hB"],
    ST: ["H", "hB"],
    TG: ["H", "hB"],
    TR: ["H", "hB"],
    WF: ["H", "hB"],
    YT: ["H", "hB"],
    BD: ["h", "hB", "H"],
    PK: ["h", "hB", "H"],
    AZ: ["H", "hB", "h"],
    BA: ["H", "hB", "h"],
    BG: ["H", "hB", "h"],
    CH: ["H", "hB", "h"],
    GE: ["H", "hB", "h"],
    LI: ["H", "hB", "h"],
    ME: ["H", "hB", "h"],
    RS: ["H", "hB", "h"],
    UA: ["H", "hB", "h"],
    UZ: ["H", "hB", "h"],
    XK: ["H", "hB", "h"],
    AG: ["h", "hb", "H", "hB"],
    AU: ["h", "hb", "H", "hB"],
    BB: ["h", "hb", "H", "hB"],
    BM: ["h", "hb", "H", "hB"],
    BS: ["h", "hb", "H", "hB"],
    CA: ["h", "hb", "H", "hB"],
    DM: ["h", "hb", "H", "hB"],
    "en-001": ["h", "hb", "H", "hB"],
    FJ: ["h", "hb", "H", "hB"],
    FM: ["h", "hb", "H", "hB"],
    GD: ["h", "hb", "H", "hB"],
    GM: ["h", "hb", "H", "hB"],
    GU: ["h", "hb", "H", "hB"],
    GY: ["h", "hb", "H", "hB"],
    JM: ["h", "hb", "H", "hB"],
    KI: ["h", "hb", "H", "hB"],
    KN: ["h", "hb", "H", "hB"],
    KY: ["h", "hb", "H", "hB"],
    LC: ["h", "hb", "H", "hB"],
    LR: ["h", "hb", "H", "hB"],
    MH: ["h", "hb", "H", "hB"],
    MP: ["h", "hb", "H", "hB"],
    MW: ["h", "hb", "H", "hB"],
    NZ: ["h", "hb", "H", "hB"],
    SB: ["h", "hb", "H", "hB"],
    SG: ["h", "hb", "H", "hB"],
    SL: ["h", "hb", "H", "hB"],
    SS: ["h", "hb", "H", "hB"],
    SZ: ["h", "hb", "H", "hB"],
    TC: ["h", "hb", "H", "hB"],
    TT: ["h", "hb", "H", "hB"],
    UM: ["h", "hb", "H", "hB"],
    US: ["h", "hb", "H", "hB"],
    VC: ["h", "hb", "H", "hB"],
    VG: ["h", "hb", "H", "hB"],
    VI: ["h", "hb", "H", "hB"],
    ZM: ["h", "hb", "H", "hB"],
    BO: ["H", "hB", "h", "hb"],
    EC: ["H", "hB", "h", "hb"],
    ES: ["H", "hB", "h", "hb"],
    GQ: ["H", "hB", "h", "hb"],
    PE: ["H", "hB", "h", "hb"],
    AE: ["h", "hB", "hb", "H"],
    "ar-001": ["h", "hB", "hb", "H"],
    BH: ["h", "hB", "hb", "H"],
    DZ: ["h", "hB", "hb", "H"],
    EG: ["h", "hB", "hb", "H"],
    EH: ["h", "hB", "hb", "H"],
    HK: ["h", "hB", "hb", "H"],
    IQ: ["h", "hB", "hb", "H"],
    JO: ["h", "hB", "hb", "H"],
    KW: ["h", "hB", "hb", "H"],
    LB: ["h", "hB", "hb", "H"],
    LY: ["h", "hB", "hb", "H"],
    MO: ["h", "hB", "hb", "H"],
    MR: ["h", "hB", "hb", "H"],
    OM: ["h", "hB", "hb", "H"],
    PH: ["h", "hB", "hb", "H"],
    PS: ["h", "hB", "hb", "H"],
    QA: ["h", "hB", "hb", "H"],
    SA: ["h", "hB", "hb", "H"],
    SD: ["h", "hB", "hb", "H"],
    SY: ["h", "hB", "hb", "H"],
    TN: ["h", "hB", "hb", "H"],
    YE: ["h", "hB", "hb", "H"],
    AF: ["H", "hb", "hB", "h"],
    LA: ["H", "hb", "hB", "h"],
    CN: ["H", "hB", "hb", "h"],
    LV: ["H", "hB", "hb", "h"],
    TL: ["H", "hB", "hb", "h"],
    "zu-ZA": ["H", "hB", "hb", "h"],
    CD: ["hB", "H"],
    IR: ["hB", "H"],
    "hi-IN": ["hB", "h", "H"],
    "kn-IN": ["hB", "h", "H"],
    "ml-IN": ["hB", "h", "H"],
    "te-IN": ["hB", "h", "H"],
    KH: ["hB", "h", "H", "hb"],
    "ta-IN": ["hB", "h", "hb", "H"],
    BN: ["hb", "hB", "h", "H"],
    MY: ["hb", "hB", "h", "H"],
    ET: ["hB", "hb", "h", "H"],
    "gu-IN": ["hB", "hb", "h", "H"],
    "mr-IN": ["hB", "hb", "h", "H"],
    "pa-IN": ["hB", "hb", "h", "H"],
    TW: ["hB", "hb", "h", "H"],
    KE: ["hB", "hb", "H", "h"],
    MM: ["hB", "hb", "H", "h"],
    TZ: ["hB", "hb", "H", "h"],
    UG: ["hB", "hb", "H", "h"],
  };
function xh(e) {
  var t = e.hourCycle;
  if (
    (void 0 === t &&
      e.hourCycles &&
      e.hourCycles.length &&
      (t = e.hourCycles[0]),
    t)
  )
    switch (t) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
  var o,
    r = e.language;
  return (
    "root" !== r && (o = e.maximize().region),
    (Mh[o || ""] || Mh[r || ""] || Mh["".concat(r, "-001")] || Mh["001"])[0]
  );
}
var Sh = new RegExp("^".concat(mh.source, "*")),
  Eh = new RegExp("".concat(mh.source, "*$"));
function Ph(e, t) {
  return { start: e, end: t };
}
var Th = !!String.prototype.startsWith,
  Oh = !!String.fromCodePoint,
  Nh = !!Object.fromEntries,
  Rh = !!String.prototype.codePointAt,
  zh = !!String.prototype.trimStart,
  Ih = !!String.prototype.trimEnd,
  Dh = !!Number.isSafeInteger
    ? Number.isSafeInteger
    : function (e) {
        return (
          "number" == typeof e &&
          isFinite(e) &&
          Math.floor(e) === e &&
          Math.abs(e) <= 9007199254740991
        );
      },
  jh = !0;
try {
  jh =
    "a" ===
    (null ===
      (kh = Kh("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) ||
    void 0 === kh
      ? void 0
      : kh[0]);
} catch (U) {
  jh = !1;
}
var Bh,
  $h = Th
    ? function (e, t, o) {
        return e.startsWith(t, o);
      }
    : function (e, t, o) {
        return e.slice(o, o + t.length) === t;
      },
  Fh = Oh
    ? String.fromCodePoint
    : function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        for (var o, r = "", i = e.length, a = 0; i > a; ) {
          if ((o = e[a++]) > 1114111)
            throw RangeError(o + " is not a valid code point");
          r +=
            o < 65536
              ? String.fromCharCode(o)
              : String.fromCharCode(
                  55296 + ((o -= 65536) >> 10),
                  (o % 1024) + 56320
                );
        }
        return r;
      },
  Uh = Nh
    ? Object.fromEntries
    : function (e) {
        for (var t = {}, o = 0, r = e; o < r.length; o++) {
          var i = r[o],
            a = i[0],
            n = i[1];
          t[a] = n;
        }
        return t;
      },
  Zh = Rh
    ? function (e, t) {
        return e.codePointAt(t);
      }
    : function (e, t) {
        var o = e.length;
        if (!(t < 0 || t >= o)) {
          var r,
            i = e.charCodeAt(t);
          return i < 55296 ||
            i > 56319 ||
            t + 1 === o ||
            (r = e.charCodeAt(t + 1)) < 56320 ||
            r > 57343
            ? i
            : r - 56320 + ((i - 55296) << 10) + 65536;
        }
      },
  Gh = zh
    ? function (e) {
        return e.trimStart();
      }
    : function (e) {
        return e.replace(Sh, "");
      },
  qh = Ih
    ? function (e) {
        return e.trimEnd();
      }
    : function (e) {
        return e.replace(Eh, "");
      };
function Kh(e, t) {
  return new RegExp(e, t);
}
if (jh) {
  var Yh = Kh("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Bh = function (e, t) {
    var o;
    return (
      (Yh.lastIndex = t), null !== (o = Yh.exec(e)[1]) && void 0 !== o ? o : ""
    );
  };
} else
  Bh = function (e, t) {
    for (var o = []; ; ) {
      var r = Zh(e, t);
      if (void 0 === r || Qh(r) || em(r)) break;
      o.push(r), (t += r >= 65536 ? 2 : 1);
    }
    return Fh.apply(void 0, o);
  };
var Xh = (function () {
  function e(e, t) {
    void 0 === t && (t = {}),
      (this.message = e),
      (this.position = { offset: 0, line: 1, column: 1 }),
      (this.ignoreTag = !!t.ignoreTag),
      (this.locale = t.locale),
      (this.requiresOtherClause = !!t.requiresOtherClause),
      (this.shouldParseSkeletons = !!t.shouldParseSkeletons);
  }
  return (
    (e.prototype.parse = function () {
      if (0 !== this.offset()) throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }),
    (e.prototype.parseMessage = function (e, t, o) {
      for (var r = []; !this.isEOF(); ) {
        var i = this.char();
        if (123 === i) {
          if ((a = this.parseArgument(e, o)).err) return a;
          r.push(a.val);
        } else {
          if (125 === i && e > 0) break;
          if (35 !== i || ("plural" !== t && "selectordinal" !== t)) {
            if (60 === i && !this.ignoreTag && 47 === this.peek()) {
              if (o) break;
              return this.error(
                eh.UNMATCHED_CLOSING_TAG,
                Ph(this.clonePosition(), this.clonePosition())
              );
            }
            if (60 === i && !this.ignoreTag && Jh(this.peek() || 0)) {
              if ((a = this.parseTag(e, t)).err) return a;
              r.push(a.val);
            } else {
              var a;
              if ((a = this.parseLiteral(e, t)).err) return a;
              r.push(a.val);
            }
          } else {
            var n = this.clonePosition();
            this.bump(),
              r.push({ type: th.pound, location: Ph(n, this.clonePosition()) });
          }
        }
      }
      return { val: r, err: null };
    }),
    (e.prototype.parseTag = function (e, t) {
      var o = this.clonePosition();
      this.bump();
      var r = this.parseTagName();
      if ((this.bumpSpace(), this.bumpIf("/>")))
        return {
          val: {
            type: th.literal,
            value: "<".concat(r, "/>"),
            location: Ph(o, this.clonePosition()),
          },
          err: null,
        };
      if (this.bumpIf(">")) {
        var i = this.parseMessage(e + 1, t, !0);
        if (i.err) return i;
        var a = i.val,
          n = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Jh(this.char()))
            return this.error(eh.INVALID_TAG, Ph(n, this.clonePosition()));
          var s = this.clonePosition();
          return r !== this.parseTagName()
            ? this.error(eh.UNMATCHED_CLOSING_TAG, Ph(s, this.clonePosition()))
            : (this.bumpSpace(),
              this.bumpIf(">")
                ? {
                    val: {
                      type: th.tag,
                      value: r,
                      children: a,
                      location: Ph(o, this.clonePosition()),
                    },
                    err: null,
                  }
                : this.error(eh.INVALID_TAG, Ph(n, this.clonePosition())));
        }
        return this.error(eh.UNCLOSED_TAG, Ph(o, this.clonePosition()));
      }
      return this.error(eh.INVALID_TAG, Ph(o, this.clonePosition()));
    }),
    (e.prototype.parseTagName = function () {
      var e = this.offset();
      for (this.bump(); !this.isEOF() && Wh(this.char()); ) this.bump();
      return this.message.slice(e, this.offset());
    }),
    (e.prototype.parseLiteral = function (e, t) {
      for (var o = this.clonePosition(), r = ""; ; ) {
        var i = this.tryParseQuote(t);
        if (i) r += i;
        else {
          var a = this.tryParseUnquoted(e, t);
          if (a) r += a;
          else {
            var n = this.tryParseLeftAngleBracket();
            if (!n) break;
            r += n;
          }
        }
      }
      var s = Ph(o, this.clonePosition());
      return { val: { type: th.literal, value: r, location: s }, err: null };
    }),
    (e.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() ||
        60 !== this.char() ||
        (!this.ignoreTag && (Jh((e = this.peek() || 0)) || 47 === e))
        ? null
        : (this.bump(), "<");
      var e;
    }),
    (e.prototype.tryParseQuote = function (e) {
      if (this.isEOF() || 39 !== this.char()) return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if ("plural" === e || "selectordinal" === e) break;
          return null;
        default:
          return null;
      }
      this.bump();
      var t = [this.char()];
      for (this.bump(); !this.isEOF(); ) {
        var o = this.char();
        if (39 === o) {
          if (39 !== this.peek()) {
            this.bump();
            break;
          }
          t.push(39), this.bump();
        } else t.push(o);
        this.bump();
      }
      return Fh.apply(void 0, t);
    }),
    (e.prototype.tryParseUnquoted = function (e, t) {
      if (this.isEOF()) return null;
      var o = this.char();
      return 60 === o ||
        123 === o ||
        (35 === o && ("plural" === t || "selectordinal" === t)) ||
        (125 === o && e > 0)
        ? null
        : (this.bump(), Fh(o));
    }),
    (e.prototype.parseArgument = function (e, t) {
      var o = this.clonePosition();
      if ((this.bump(), this.bumpSpace(), this.isEOF()))
        return this.error(
          eh.EXPECT_ARGUMENT_CLOSING_BRACE,
          Ph(o, this.clonePosition())
        );
      if (125 === this.char())
        return (
          this.bump(),
          this.error(eh.EMPTY_ARGUMENT, Ph(o, this.clonePosition()))
        );
      var r = this.parseIdentifierIfPossible().value;
      if (!r)
        return this.error(eh.MALFORMED_ARGUMENT, Ph(o, this.clonePosition()));
      if ((this.bumpSpace(), this.isEOF()))
        return this.error(
          eh.EXPECT_ARGUMENT_CLOSING_BRACE,
          Ph(o, this.clonePosition())
        );
      switch (this.char()) {
        case 125:
          return (
            this.bump(),
            {
              val: {
                type: th.argument,
                value: r,
                location: Ph(o, this.clonePosition()),
              },
              err: null,
            }
          );
        case 44:
          return (
            this.bump(),
            this.bumpSpace(),
            this.isEOF()
              ? this.error(
                  eh.EXPECT_ARGUMENT_CLOSING_BRACE,
                  Ph(o, this.clonePosition())
                )
              : this.parseArgumentOptions(e, t, r, o)
          );
        default:
          return this.error(eh.MALFORMED_ARGUMENT, Ph(o, this.clonePosition()));
      }
    }),
    (e.prototype.parseIdentifierIfPossible = function () {
      var e = this.clonePosition(),
        t = this.offset(),
        o = Bh(this.message, t),
        r = t + o.length;
      return (
        this.bumpTo(r), { value: o, location: Ph(e, this.clonePosition()) }
      );
    }),
    (e.prototype.parseArgumentOptions = function (e, t, o, r) {
      var i,
        a = this.clonePosition(),
        n = this.parseIdentifierIfPossible().value,
        s = this.clonePosition();
      switch (n) {
        case "":
          return this.error(eh.EXPECT_ARGUMENT_TYPE, Ph(a, s));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var l = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var d = this.clonePosition();
            if ((g = this.parseSimpleArgStyleIfPossible()).err) return g;
            if (0 === (h = qh(g.val)).length)
              return this.error(
                eh.EXPECT_ARGUMENT_STYLE,
                Ph(this.clonePosition(), this.clonePosition())
              );
            l = { style: h, styleLocation: Ph(d, this.clonePosition()) };
          }
          if ((y = this.tryParseArgumentClose(r)).err) return y;
          var c = Ph(r, this.clonePosition());
          if (l && $h(null == l ? void 0 : l.style, "::", 0)) {
            var p = Gh(l.style.slice(2));
            if ("number" === n)
              return (g = this.parseNumberSkeletonFromString(
                p,
                l.styleLocation
              )).err
                ? g
                : {
                    val: {
                      type: th.number,
                      value: o,
                      location: c,
                      style: g.val,
                    },
                    err: null,
                  };
            if (0 === p.length)
              return this.error(eh.EXPECT_DATE_TIME_SKELETON, c);
            var u = p;
            this.locale &&
              (u = (function (e, t) {
                for (var o = "", r = 0; r < e.length; r++) {
                  var i = e.charAt(r);
                  if ("j" === i) {
                    for (var a = 0; r + 1 < e.length && e.charAt(r + 1) === i; )
                      a++, r++;
                    var n = 1 + (1 & a),
                      s = a < 2 ? 1 : 3 + (a >> 1),
                      l = xh(t);
                    for (("H" != l && "k" != l) || (s = 0); s-- > 0; ) o += "a";
                    for (; n-- > 0; ) o = l + o;
                  } else o += "J" === i ? "H" : i;
                }
                return o;
              })(p, this.locale));
            var h = {
              type: oh.dateTime,
              pattern: u,
              location: l.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? fh(u) : {},
            };
            return {
              val: {
                type: "date" === n ? th.date : th.time,
                value: o,
                location: c,
                style: h,
              },
              err: null,
            };
          }
          return {
            val: {
              type:
                "number" === n ? th.number : "date" === n ? th.date : th.time,
              value: o,
              location: c,
              style:
                null !== (i = null == l ? void 0 : l.style) && void 0 !== i
                  ? i
                  : null,
            },
            err: null,
          };
        case "plural":
        case "selectordinal":
        case "select":
          var m = this.clonePosition();
          if ((this.bumpSpace(), !this.bumpIf(",")))
            return this.error(
              eh.EXPECT_SELECT_ARGUMENT_OPTIONS,
              Ph(m, Hn({}, m))
            );
          this.bumpSpace();
          var _ = this.parseIdentifierIfPossible(),
            f = 0;
          if ("select" !== n && "offset" === _.value) {
            if (!this.bumpIf(":"))
              return this.error(
                eh.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                Ph(this.clonePosition(), this.clonePosition())
              );
            var g;
            if (
              (this.bumpSpace(),
              (g = this.tryParseDecimalInteger(
                eh.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                eh.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE
              )).err)
            )
              return g;
            this.bumpSpace(),
              (_ = this.parseIdentifierIfPossible()),
              (f = g.val);
          }
          var y,
            b = this.tryParsePluralOrSelectOptions(e, n, t, _);
          if (b.err) return b;
          if ((y = this.tryParseArgumentClose(r)).err) return y;
          var v = Ph(r, this.clonePosition());
          return "select" === n
            ? {
                val: {
                  type: th.select,
                  value: o,
                  options: Uh(b.val),
                  location: v,
                },
                err: null,
              }
            : {
                val: {
                  type: th.plural,
                  value: o,
                  options: Uh(b.val),
                  offset: f,
                  pluralType: "plural" === n ? "cardinal" : "ordinal",
                  location: v,
                },
                err: null,
              };
        default:
          return this.error(eh.INVALID_ARGUMENT_TYPE, Ph(a, s));
      }
    }),
    (e.prototype.tryParseArgumentClose = function (e) {
      return this.isEOF() || 125 !== this.char()
        ? this.error(
            eh.EXPECT_ARGUMENT_CLOSING_BRACE,
            Ph(e, this.clonePosition())
          )
        : (this.bump(), { val: !0, err: null });
    }),
    (e.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var e = 0, t = this.clonePosition(); !this.isEOF(); ) {
        switch (this.char()) {
          case 39:
            this.bump();
            var o = this.clonePosition();
            if (!this.bumpUntil("'"))
              return this.error(
                eh.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,
                Ph(o, this.clonePosition())
              );
            this.bump();
            break;
          case 123:
            (e += 1), this.bump();
            break;
          case 125:
            if (!(e > 0))
              return {
                val: this.message.slice(t.offset, this.offset()),
                err: null,
              };
            e -= 1;
            break;
          default:
            this.bump();
        }
      }
      return { val: this.message.slice(t.offset, this.offset()), err: null };
    }),
    (e.prototype.parseNumberSkeletonFromString = function (e, t) {
      var o = [];
      try {
        o = (function (e) {
          if (0 === e.length)
            throw new Error("Number skeleton cannot be empty");
          for (
            var t = e.split(gh).filter(function (e) {
                return e.length > 0;
              }),
              o = [],
              r = 0,
              i = t;
            r < i.length;
            r++
          ) {
            var a = i[r].split("/");
            if (0 === a.length) throw new Error("Invalid number skeleton");
            for (var n = a[0], s = a.slice(1), l = 0, d = s; l < d.length; l++)
              if (0 === d[l].length) throw new Error("Invalid number skeleton");
            o.push({ stem: n, options: s });
          }
          return o;
        })(e);
      } catch (e) {
        return this.error(eh.INVALID_NUMBER_SKELETON, t);
      }
      return {
        val: {
          type: oh.number,
          tokens: o,
          location: t,
          parsedOptions: this.shouldParseSkeletons ? Vh(o) : {},
        },
        err: null,
      };
    }),
    (e.prototype.tryParsePluralOrSelectOptions = function (e, t, o, r) {
      for (
        var i, a = !1, n = [], s = new Set(), l = r.value, d = r.location;
        ;

      ) {
        if (0 === l.length) {
          var c = this.clonePosition();
          if ("select" === t || !this.bumpIf("=")) break;
          var p = this.tryParseDecimalInteger(
            eh.EXPECT_PLURAL_ARGUMENT_SELECTOR,
            eh.INVALID_PLURAL_ARGUMENT_SELECTOR
          );
          if (p.err) return p;
          (d = Ph(c, this.clonePosition())),
            (l = this.message.slice(c.offset, this.offset()));
        }
        if (s.has(l))
          return this.error(
            "select" === t
              ? eh.DUPLICATE_SELECT_ARGUMENT_SELECTOR
              : eh.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,
            d
          );
        "other" === l && (a = !0), this.bumpSpace();
        var u = this.clonePosition();
        if (!this.bumpIf("{"))
          return this.error(
            "select" === t
              ? eh.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
              : eh.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,
            Ph(this.clonePosition(), this.clonePosition())
          );
        var h = this.parseMessage(e + 1, t, o);
        if (h.err) return h;
        var m = this.tryParseArgumentClose(u);
        if (m.err) return m;
        n.push([l, { value: h.val, location: Ph(u, this.clonePosition()) }]),
          s.add(l),
          this.bumpSpace(),
          (l = (i = this.parseIdentifierIfPossible()).value),
          (d = i.location);
      }
      return 0 === n.length
        ? this.error(
            "select" === t
              ? eh.EXPECT_SELECT_ARGUMENT_SELECTOR
              : eh.EXPECT_PLURAL_ARGUMENT_SELECTOR,
            Ph(this.clonePosition(), this.clonePosition())
          )
        : this.requiresOtherClause && !a
        ? this.error(
            eh.MISSING_OTHER_CLAUSE,
            Ph(this.clonePosition(), this.clonePosition())
          )
        : { val: n, err: null };
    }),
    (e.prototype.tryParseDecimalInteger = function (e, t) {
      var o = 1,
        r = this.clonePosition();
      this.bumpIf("+") || (this.bumpIf("-") && (o = -1));
      for (var i = !1, a = 0; !this.isEOF(); ) {
        var n = this.char();
        if (!(n >= 48 && n <= 57)) break;
        (i = !0), (a = 10 * a + (n - 48)), this.bump();
      }
      var s = Ph(r, this.clonePosition());
      return i
        ? Dh((a *= o))
          ? { val: a, err: null }
          : this.error(t, s)
        : this.error(e, s);
    }),
    (e.prototype.offset = function () {
      return this.position.offset;
    }),
    (e.prototype.isEOF = function () {
      return this.offset() === this.message.length;
    }),
    (e.prototype.clonePosition = function () {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column,
      };
    }),
    (e.prototype.char = function () {
      var e = this.position.offset;
      if (e >= this.message.length) throw Error("out of bound");
      var t = Zh(this.message, e);
      if (void 0 === t)
        throw Error(
          "Offset ".concat(e, " is at invalid UTF-16 code unit boundary")
        );
      return t;
    }),
    (e.prototype.error = function (e, t) {
      return {
        val: null,
        err: { kind: e, message: this.message, location: t },
      };
    }),
    (e.prototype.bump = function () {
      if (!this.isEOF()) {
        var e = this.char();
        10 === e
          ? ((this.position.line += 1),
            (this.position.column = 1),
            (this.position.offset += 1))
          : ((this.position.column += 1),
            (this.position.offset += e < 65536 ? 1 : 2));
      }
    }),
    (e.prototype.bumpIf = function (e) {
      if ($h(this.message, e, this.offset())) {
        for (var t = 0; t < e.length; t++) this.bump();
        return !0;
      }
      return !1;
    }),
    (e.prototype.bumpUntil = function (e) {
      var t = this.offset(),
        o = this.message.indexOf(e, t);
      return o >= 0
        ? (this.bumpTo(o), !0)
        : (this.bumpTo(this.message.length), !1);
    }),
    (e.prototype.bumpTo = function (e) {
      if (this.offset() > e)
        throw Error(
          "targetOffset "
            .concat(e, " must be greater than or equal to the current offset ")
            .concat(this.offset())
        );
      for (e = Math.min(e, this.message.length); ; ) {
        var t = this.offset();
        if (t === e) break;
        if (t > e)
          throw Error(
            "targetOffset ".concat(
              e,
              " is at invalid UTF-16 code unit boundary"
            )
          );
        if ((this.bump(), this.isEOF())) break;
      }
    }),
    (e.prototype.bumpSpace = function () {
      for (; !this.isEOF() && Qh(this.char()); ) this.bump();
    }),
    (e.prototype.peek = function () {
      if (this.isEOF()) return null;
      var e = this.char(),
        t = this.offset(),
        o = this.message.charCodeAt(t + (e >= 65536 ? 2 : 1));
      return null != o ? o : null;
    }),
    e
  );
})();
function Jh(e) {
  return (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
}
function Wh(e) {
  return (
    45 === e ||
    46 === e ||
    (e >= 48 && e <= 57) ||
    95 === e ||
    (e >= 97 && e <= 122) ||
    (e >= 65 && e <= 90) ||
    183 == e ||
    (e >= 192 && e <= 214) ||
    (e >= 216 && e <= 246) ||
    (e >= 248 && e <= 893) ||
    (e >= 895 && e <= 8191) ||
    (e >= 8204 && e <= 8205) ||
    (e >= 8255 && e <= 8256) ||
    (e >= 8304 && e <= 8591) ||
    (e >= 11264 && e <= 12271) ||
    (e >= 12289 && e <= 55295) ||
    (e >= 63744 && e <= 64975) ||
    (e >= 65008 && e <= 65533) ||
    (e >= 65536 && e <= 983039)
  );
}
function Qh(e) {
  return (
    (e >= 9 && e <= 13) ||
    32 === e ||
    133 === e ||
    (e >= 8206 && e <= 8207) ||
    8232 === e ||
    8233 === e
  );
}
function em(e) {
  return (
    (e >= 33 && e <= 35) ||
    36 === e ||
    (e >= 37 && e <= 39) ||
    40 === e ||
    41 === e ||
    42 === e ||
    43 === e ||
    44 === e ||
    45 === e ||
    (e >= 46 && e <= 47) ||
    (e >= 58 && e <= 59) ||
    (e >= 60 && e <= 62) ||
    (e >= 63 && e <= 64) ||
    91 === e ||
    92 === e ||
    93 === e ||
    94 === e ||
    96 === e ||
    123 === e ||
    124 === e ||
    125 === e ||
    126 === e ||
    161 === e ||
    (e >= 162 && e <= 165) ||
    166 === e ||
    167 === e ||
    169 === e ||
    171 === e ||
    172 === e ||
    174 === e ||
    176 === e ||
    177 === e ||
    182 === e ||
    187 === e ||
    191 === e ||
    215 === e ||
    247 === e ||
    (e >= 8208 && e <= 8213) ||
    (e >= 8214 && e <= 8215) ||
    8216 === e ||
    8217 === e ||
    8218 === e ||
    (e >= 8219 && e <= 8220) ||
    8221 === e ||
    8222 === e ||
    8223 === e ||
    (e >= 8224 && e <= 8231) ||
    (e >= 8240 && e <= 8248) ||
    8249 === e ||
    8250 === e ||
    (e >= 8251 && e <= 8254) ||
    (e >= 8257 && e <= 8259) ||
    8260 === e ||
    8261 === e ||
    8262 === e ||
    (e >= 8263 && e <= 8273) ||
    8274 === e ||
    8275 === e ||
    (e >= 8277 && e <= 8286) ||
    (e >= 8592 && e <= 8596) ||
    (e >= 8597 && e <= 8601) ||
    (e >= 8602 && e <= 8603) ||
    (e >= 8604 && e <= 8607) ||
    8608 === e ||
    (e >= 8609 && e <= 8610) ||
    8611 === e ||
    (e >= 8612 && e <= 8613) ||
    8614 === e ||
    (e >= 8615 && e <= 8621) ||
    8622 === e ||
    (e >= 8623 && e <= 8653) ||
    (e >= 8654 && e <= 8655) ||
    (e >= 8656 && e <= 8657) ||
    8658 === e ||
    8659 === e ||
    8660 === e ||
    (e >= 8661 && e <= 8691) ||
    (e >= 8692 && e <= 8959) ||
    (e >= 8960 && e <= 8967) ||
    8968 === e ||
    8969 === e ||
    8970 === e ||
    8971 === e ||
    (e >= 8972 && e <= 8991) ||
    (e >= 8992 && e <= 8993) ||
    (e >= 8994 && e <= 9e3) ||
    9001 === e ||
    9002 === e ||
    (e >= 9003 && e <= 9083) ||
    9084 === e ||
    (e >= 9085 && e <= 9114) ||
    (e >= 9115 && e <= 9139) ||
    (e >= 9140 && e <= 9179) ||
    (e >= 9180 && e <= 9185) ||
    (e >= 9186 && e <= 9254) ||
    (e >= 9255 && e <= 9279) ||
    (e >= 9280 && e <= 9290) ||
    (e >= 9291 && e <= 9311) ||
    (e >= 9472 && e <= 9654) ||
    9655 === e ||
    (e >= 9656 && e <= 9664) ||
    9665 === e ||
    (e >= 9666 && e <= 9719) ||
    (e >= 9720 && e <= 9727) ||
    (e >= 9728 && e <= 9838) ||
    9839 === e ||
    (e >= 9840 && e <= 10087) ||
    10088 === e ||
    10089 === e ||
    10090 === e ||
    10091 === e ||
    10092 === e ||
    10093 === e ||
    10094 === e ||
    10095 === e ||
    10096 === e ||
    10097 === e ||
    10098 === e ||
    10099 === e ||
    10100 === e ||
    10101 === e ||
    (e >= 10132 && e <= 10175) ||
    (e >= 10176 && e <= 10180) ||
    10181 === e ||
    10182 === e ||
    (e >= 10183 && e <= 10213) ||
    10214 === e ||
    10215 === e ||
    10216 === e ||
    10217 === e ||
    10218 === e ||
    10219 === e ||
    10220 === e ||
    10221 === e ||
    10222 === e ||
    10223 === e ||
    (e >= 10224 && e <= 10239) ||
    (e >= 10240 && e <= 10495) ||
    (e >= 10496 && e <= 10626) ||
    10627 === e ||
    10628 === e ||
    10629 === e ||
    10630 === e ||
    10631 === e ||
    10632 === e ||
    10633 === e ||
    10634 === e ||
    10635 === e ||
    10636 === e ||
    10637 === e ||
    10638 === e ||
    10639 === e ||
    10640 === e ||
    10641 === e ||
    10642 === e ||
    10643 === e ||
    10644 === e ||
    10645 === e ||
    10646 === e ||
    10647 === e ||
    10648 === e ||
    (e >= 10649 && e <= 10711) ||
    10712 === e ||
    10713 === e ||
    10714 === e ||
    10715 === e ||
    (e >= 10716 && e <= 10747) ||
    10748 === e ||
    10749 === e ||
    (e >= 10750 && e <= 11007) ||
    (e >= 11008 && e <= 11055) ||
    (e >= 11056 && e <= 11076) ||
    (e >= 11077 && e <= 11078) ||
    (e >= 11079 && e <= 11084) ||
    (e >= 11085 && e <= 11123) ||
    (e >= 11124 && e <= 11125) ||
    (e >= 11126 && e <= 11157) ||
    11158 === e ||
    (e >= 11159 && e <= 11263) ||
    (e >= 11776 && e <= 11777) ||
    11778 === e ||
    11779 === e ||
    11780 === e ||
    11781 === e ||
    (e >= 11782 && e <= 11784) ||
    11785 === e ||
    11786 === e ||
    11787 === e ||
    11788 === e ||
    11789 === e ||
    (e >= 11790 && e <= 11798) ||
    11799 === e ||
    (e >= 11800 && e <= 11801) ||
    11802 === e ||
    11803 === e ||
    11804 === e ||
    11805 === e ||
    (e >= 11806 && e <= 11807) ||
    11808 === e ||
    11809 === e ||
    11810 === e ||
    11811 === e ||
    11812 === e ||
    11813 === e ||
    11814 === e ||
    11815 === e ||
    11816 === e ||
    11817 === e ||
    (e >= 11818 && e <= 11822) ||
    11823 === e ||
    (e >= 11824 && e <= 11833) ||
    (e >= 11834 && e <= 11835) ||
    (e >= 11836 && e <= 11839) ||
    11840 === e ||
    11841 === e ||
    11842 === e ||
    (e >= 11843 && e <= 11855) ||
    (e >= 11856 && e <= 11857) ||
    11858 === e ||
    (e >= 11859 && e <= 11903) ||
    (e >= 12289 && e <= 12291) ||
    12296 === e ||
    12297 === e ||
    12298 === e ||
    12299 === e ||
    12300 === e ||
    12301 === e ||
    12302 === e ||
    12303 === e ||
    12304 === e ||
    12305 === e ||
    (e >= 12306 && e <= 12307) ||
    12308 === e ||
    12309 === e ||
    12310 === e ||
    12311 === e ||
    12312 === e ||
    12313 === e ||
    12314 === e ||
    12315 === e ||
    12316 === e ||
    12317 === e ||
    (e >= 12318 && e <= 12319) ||
    12320 === e ||
    12336 === e ||
    64830 === e ||
    64831 === e ||
    (e >= 65093 && e <= 65094)
  );
}
function tm(e) {
  e.forEach(function (e) {
    if ((delete e.location, lh(e) || dh(e)))
      for (var t in e.options)
        delete e.options[t].location, tm(e.options[t].value);
    else
      (ah(e) && uh(e.style)) || ((nh(e) || sh(e)) && hh(e.style))
        ? delete e.style.location
        : ph(e) && tm(e.children);
  });
}
function om(e, t) {
  void 0 === t && (t = {}),
    (t = Hn({ shouldParseSkeletons: !0, requiresOtherClause: !0 }, t));
  var o = new Xh(e, t).parse();
  if (o.err) {
    var r = SyntaxError(eh[o.err.kind]);
    throw (
      ((r.location = o.err.location), (r.originalMessage = o.err.message), r)
    );
  }
  return (null == t ? void 0 : t.captureLocation) || tm(o.val), o.val;
}
function rm(e, t) {
  var o = t && t.cache ? t.cache : pm,
    r = t && t.serializer ? t.serializer : lm;
  return (t && t.strategy ? t.strategy : sm)(e, { cache: o, serializer: r });
}
function im(e, t, o, r) {
  var i,
    a =
      null == (i = r) || "number" == typeof i || "boolean" == typeof i
        ? r
        : o(r),
    n = t.get(a);
  return void 0 === n && ((n = e.call(this, r)), t.set(a, n)), n;
}
function am(e, t, o) {
  var r = Array.prototype.slice.call(arguments, 3),
    i = o(r),
    a = t.get(i);
  return void 0 === a && ((a = e.apply(this, r)), t.set(i, a)), a;
}
function nm(e, t, o, r, i) {
  return o.bind(t, e, r, i);
}
function sm(e, t) {
  return nm(e, this, 1 === e.length ? im : am, t.cache.create(), t.serializer);
}
var lm = function () {
  return JSON.stringify(arguments);
};
function dm() {
  this.cache = Object.create(null);
}
(dm.prototype.get = function (e) {
  return this.cache[e];
}),
  (dm.prototype.set = function (e, t) {
    this.cache[e] = t;
  });
var cm,
  pm = {
    create: function () {
      return new dm();
    },
  },
  um = {
    variadic: function (e, t) {
      return nm(e, this, am, t.cache.create(), t.serializer);
    },
    monadic: function (e, t) {
      return nm(e, this, im, t.cache.create(), t.serializer);
    },
  };
!(function (e) {
  (e.MISSING_VALUE = "MISSING_VALUE"),
    (e.INVALID_VALUE = "INVALID_VALUE"),
    (e.MISSING_INTL_API = "MISSING_INTL_API");
})(cm || (cm = {}));
var hm,
  mm = (function (e) {
    function t(t, o, r) {
      var i = e.call(this, t) || this;
      return (i.code = o), (i.originalMessage = r), i;
    }
    return (
      An(t, e),
      (t.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }),
      t
    );
  })(Error),
  _m = (function (e) {
    function t(t, o, r, i) {
      return (
        e.call(
          this,
          'Invalid values for "'
            .concat(t, '": "')
            .concat(o, '". Options are "')
            .concat(Object.keys(r).join('", "'), '"'),
          cm.INVALID_VALUE,
          i
        ) || this
      );
    }
    return An(t, e), t;
  })(mm),
  fm = (function (e) {
    function t(t, o, r) {
      return (
        e.call(
          this,
          'Value for "'.concat(t, '" must be of type ').concat(o),
          cm.INVALID_VALUE,
          r
        ) || this
      );
    }
    return An(t, e), t;
  })(mm),
  gm = (function (e) {
    function t(t, o) {
      return (
        e.call(
          this,
          'The intl string context variable "'
            .concat(t, '" was not provided to the string "')
            .concat(o, '"'),
          cm.MISSING_VALUE,
          o
        ) || this
      );
    }
    return An(t, e), t;
  })(mm);
function ym(e) {
  return "function" == typeof e;
}
function bm(e, t, o, r, i, a, n) {
  if (1 === e.length && rh(e[0]))
    return [{ type: hm.literal, value: e[0].value }];
  for (var s = [], l = 0, d = e; l < d.length; l++) {
    var c = d[l];
    if (rh(c)) s.push({ type: hm.literal, value: c.value });
    else if (ch(c))
      "number" == typeof a &&
        s.push({ type: hm.literal, value: o.getNumberFormat(t).format(a) });
    else {
      var p = c.value;
      if (!i || !(p in i)) throw new gm(p, n);
      var u = i[p];
      if (ih(c))
        (u && "string" != typeof u && "number" != typeof u) ||
          (u = "string" == typeof u || "number" == typeof u ? String(u) : ""),
          s.push({
            type: "string" == typeof u ? hm.literal : hm.object,
            value: u,
          });
      else if (nh(c)) {
        var h =
          "string" == typeof c.style
            ? r.date[c.style]
            : hh(c.style)
            ? c.style.parsedOptions
            : void 0;
        s.push({
          type: hm.literal,
          value: o.getDateTimeFormat(t, h).format(u),
        });
      } else if (sh(c)) {
        h =
          "string" == typeof c.style
            ? r.time[c.style]
            : hh(c.style)
            ? c.style.parsedOptions
            : r.time.medium;
        s.push({
          type: hm.literal,
          value: o.getDateTimeFormat(t, h).format(u),
        });
      } else if (ah(c)) {
        (h =
          "string" == typeof c.style
            ? r.number[c.style]
            : uh(c.style)
            ? c.style.parsedOptions
            : void 0) &&
          h.scale &&
          (u *= h.scale || 1),
          s.push({
            type: hm.literal,
            value: o.getNumberFormat(t, h).format(u),
          });
      } else {
        if (ph(c)) {
          var m = c.children,
            _ = c.value,
            f = i[_];
          if (!ym(f)) throw new fm(_, "function", n);
          var g = f(
            bm(m, t, o, r, i, a).map(function (e) {
              return e.value;
            })
          );
          Array.isArray(g) || (g = [g]),
            s.push.apply(
              s,
              g.map(function (e) {
                return {
                  type: "string" == typeof e ? hm.literal : hm.object,
                  value: e,
                };
              })
            );
        }
        if (lh(c)) {
          if (!(y = c.options[u] || c.options.other))
            throw new _m(c.value, u, Object.keys(c.options), n);
          s.push.apply(s, bm(y.value, t, o, r, i));
        } else if (dh(c)) {
          var y;
          if (!(y = c.options["=".concat(u)])) {
            if (!Intl.PluralRules)
              throw new mm(
                'Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',
                cm.MISSING_INTL_API,
                n
              );
            var b = o
              .getPluralRules(t, { type: c.pluralType })
              .select(u - (c.offset || 0));
            y = c.options[b] || c.options.other;
          }
          if (!y) throw new _m(c.value, u, Object.keys(c.options), n);
          s.push.apply(s, bm(y.value, t, o, r, i, u - (c.offset || 0)));
        } else;
      }
    }
  }
  return (function (e) {
    return e.length < 2
      ? e
      : e.reduce(function (e, t) {
          var o = e[e.length - 1];
          return (
            o && o.type === hm.literal && t.type === hm.literal
              ? (o.value += t.value)
              : e.push(t),
            e
          );
        }, []);
  })(s);
}
function vm(e, t) {
  return t
    ? Object.keys(e).reduce(function (o, r) {
        var i, a;
        return (
          (o[r] =
            ((i = e[r]),
            (a = t[r])
              ? Hn(
                  Hn(Hn({}, i || {}), a || {}),
                  Object.keys(i).reduce(function (e, t) {
                    return (e[t] = Hn(Hn({}, i[t]), a[t] || {})), e;
                  }, {})
                )
              : i)),
          o
        );
      }, Hn({}, e))
    : e;
}
function Cm(e) {
  return {
    create: function () {
      return {
        get: function (t) {
          return e[t];
        },
        set: function (t, o) {
          e[t] = o;
        },
      };
    },
  };
}
!(function (e) {
  (e[(e.literal = 0)] = "literal"), (e[(e.object = 1)] = "object");
})(hm || (hm = {}));
var Am = (function () {
    function e(t, o, r, i) {
      var a,
        n = this;
      if (
        (void 0 === o && (o = e.defaultLocale),
        (this.formatterCache = { number: {}, dateTime: {}, pluralRules: {} }),
        (this.format = function (e) {
          var t = n.formatToParts(e);
          if (1 === t.length) return t[0].value;
          var o = t.reduce(function (e, t) {
            return (
              e.length &&
              t.type === hm.literal &&
              "string" == typeof e[e.length - 1]
                ? (e[e.length - 1] += t.value)
                : e.push(t.value),
              e
            );
          }, []);
          return o.length <= 1 ? o[0] || "" : o;
        }),
        (this.formatToParts = function (e) {
          return bm(
            n.ast,
            n.locales,
            n.formatters,
            n.formats,
            e,
            void 0,
            n.message
          );
        }),
        (this.resolvedOptions = function () {
          return { locale: n.resolvedLocale.toString() };
        }),
        (this.getAst = function () {
          return n.ast;
        }),
        (this.locales = o),
        (this.resolvedLocale = e.resolveLocale(o)),
        "string" == typeof t)
      ) {
        if (((this.message = t), !e.__parse))
          throw new TypeError(
            "IntlMessageFormat.__parse must be set to process `message` of type `string`"
          );
        this.ast = e.__parse(t, {
          ignoreTag: null == i ? void 0 : i.ignoreTag,
          locale: this.resolvedLocale,
        });
      } else this.ast = t;
      if (!Array.isArray(this.ast))
        throw new TypeError("A message must be provided as a String or AST.");
      (this.formats = vm(e.formats, r)),
        (this.formatters =
          (i && i.formatters) ||
          (void 0 === (a = this.formatterCache) &&
            (a = { number: {}, dateTime: {}, pluralRules: {} }),
          {
            getNumberFormat: rm(
              function () {
                for (var e, t = [], o = 0; o < arguments.length; o++)
                  t[o] = arguments[o];
                return new ((e = Intl.NumberFormat).bind.apply(
                  e,
                  Mn([void 0], t, !1)
                ))();
              },
              { cache: Cm(a.number), strategy: um.variadic }
            ),
            getDateTimeFormat: rm(
              function () {
                for (var e, t = [], o = 0; o < arguments.length; o++)
                  t[o] = arguments[o];
                return new ((e = Intl.DateTimeFormat).bind.apply(
                  e,
                  Mn([void 0], t, !1)
                ))();
              },
              { cache: Cm(a.dateTime), strategy: um.variadic }
            ),
            getPluralRules: rm(
              function () {
                for (var e, t = [], o = 0; o < arguments.length; o++)
                  t[o] = arguments[o];
                return new ((e = Intl.PluralRules).bind.apply(
                  e,
                  Mn([void 0], t, !1)
                ))();
              },
              { cache: Cm(a.pluralRules), strategy: um.variadic }
            ),
          }));
    }
    return (
      Object.defineProperty(e, "defaultLocale", {
        get: function () {
          return (
            e.memoizedDefaultLocale ||
              (e.memoizedDefaultLocale =
                new Intl.NumberFormat().resolvedOptions().locale),
            e.memoizedDefaultLocale
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.memoizedDefaultLocale = null),
      (e.resolveLocale = function (e) {
        var t = Intl.NumberFormat.supportedLocalesOf(e);
        return t.length > 0
          ? new Intl.Locale(t[0])
          : new Intl.Locale("string" == typeof e ? e : e[0]);
      }),
      (e.__parse = om),
      (e.formats = {
        number: {
          integer: { maximumFractionDigits: 0 },
          currency: { style: "currency" },
          percent: { style: "percent" },
        },
        date: {
          short: { month: "numeric", day: "numeric", year: "2-digit" },
          medium: { month: "short", day: "numeric", year: "numeric" },
          long: { month: "long", day: "numeric", year: "numeric" },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        },
        time: {
          short: { hour: "numeric", minute: "numeric" },
          medium: { hour: "numeric", minute: "numeric", second: "numeric" },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
        },
      }),
      e
    );
  })(),
  Hm = Am;
const wm = {
    bg_BG: {
      "column.category": "Категория",
      "column.downloads": "Изтегляния",
      "column.last_updated": "Актуализиран",
      "column.name": "Име на хранилището",
      "column.stars": "Звезди",
      "common.add": "добавете",
      "common.cancel": "Отказ",
      "common.close": "Затвори",
      "common.download": "Свали",
      "common.explore": "Проучване & изтегляне на хранилища",
      "common.ignore": "Игнорирайте",
      "common.integration": "Интеграция",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python скрипт",
      "common.reload": "Презареждане",
      "common.remove": "Премахване",
      "common.repositories": "Хранилища",
      "common.repository": "Хранилище",
      "common.show": "Покажи",
      "common.theme": "Тема",
      "common.update": "Актуализация",
      "common.updates": "Актуализации",
      "common.yes": "Да",
      "confirm.home_assistant_version_not_correct":
        'Изпълнявате версия "{haversion}" на Home Assistant, но това хранилище изисква да бъде инсталирана минимална версия "{minversion}".',
      "dialog.configured.confirm": "Отидете на интеграции",
      "dialog.configured.message":
        "Интеграцията {name} е конфигурирана, трябва да изтриете конфигурацията за нея, преди да я премахнете от HACS",
      "dialog.configured.title": "Интеграцията е конфигурирана",
      "dialog.reload.confirm": "Искате ли да направите това сега?",
      "dialog.reload.description":
        "Трябва да изчистите кеша на браузъра си, когато променяте ресурсите на Lovelace.",
      "dialog.remove.message": "Наистина ли искате да премахнете {name} ?",
      "dialog.remove.title": "Премахване",
      "dialog_about.downloaded_repositories": "Изтеглени хранилища",
      "dialog_about.frontend_version": "Версия на интерфейса",
      "dialog_about.integration_version": "Версия на интеграцията",
      "dialog_about.useful_links": "Полезни връзки",
      "dialog_add_repo.no_match":
        "Не са намерени хранилища, съответстващи на вашия филтър",
      "dialog_add_repo.sort_by": "Сортиране по",
      "dialog_add_repo.sort_by_values.last_updated": "Последно обновен",
      "dialog_add_repo.sort_by_values.name": "Име",
      "dialog_add_repo.sort_by_values.stars": "Звезди",
      "dialog_add_repo.title": "Добавяне на хранилище",
      "dialog_custom_repositories.category": "Категория",
      "dialog_custom_repositories.no_category": "Липсваща категория",
      "dialog_custom_repositories.no_repository": "Липсващо хранилище",
      "dialog_custom_repositories.title": "Потребителски хранилища",
      "dialog_custom_repositories.url_placeholder":
        "Добавете URL адрес на потребителското хранилище",
      "dialog_download.lovelace_instruction":
        "След като изтеглянето завърши, тъй като не използвате Lovelace в режим на съхранение, трябва ръчно да добавите ресурса със следните настройки:",
      "dialog_download.note_downloaded":
        "Когато бъде изтеглено, това ще се намира в {location}",
      "dialog_download.restart":
        "Не забравяйте, че трябва да рестартирате Home Assistant, преди да бъдат приложени промените в интеграциите (custom_components).",
      "dialog_download.select_version": "Избери версия",
      "dialog_download.show_beta": "Показване на бета версии",
      "dialog_download.type": "Вид",
      "dialog_download.url": "Линк",
      "dialog_info.author": "Автор",
      "dialog_info.download": "Изтеглете това хранилище с HACS",
      "dialog_info.downloads": "Изтегляния",
      "dialog_info.loading": "Зарежда се информация ...",
      "dialog_info.no_info":
        "Разработчикът не е предоставил повече информация за това хранилище",
      "dialog_info.open_issues": "Отворени въпроси",
      "dialog_info.open_repo": "Отворете хранилището",
      "dialog_info.stars": "Звезди",
      "dialog_info.version_installed": "Изтеглена Версия",
      "dialog_update.available_version": "Налична версия",
      "dialog_update.changelog": "Дневник на промените",
      "dialog_update.downloaded_version": "Изтеглена версия",
      "dialog_update.message": "Налична е нова версия на {name}",
      "dialog_update.no_info":
        "Авторът не е предоставил никаква информация за това издание",
      "dialog_update.releasenotes": "Бележки по изданието за {release}",
      "dialog_update.title": "Чакаща актуализация",
      "menu.about": "Относно HACS",
      "menu.clear": "Изчистване на всичко ново",
      "menu.custom_repositories": "Потребителски хранилища",
      "menu.dismiss": "Отхвърляне на всички нови хранилища",
      "menu.documentation": "Документация",
      "menu.open_issue": "Задай въпрос",
      "menu.reload": "Презареждане на прозореца",
      "my.add_repository_title": "Добавяне на персонализирано хранилище",
      "my.documentation": "документация",
      "my.error": "Възникна неизвестна грешка",
      "my.repository_not_found": "Хранилището {repository} не е намерено",
      "repository_card.dismiss": "отхвърляне",
      "repository_card.information": "Информация",
      "repository_card.new_repository": "Ново хранилище",
      "repository_card.not_loaded": "Не е зареден",
      "repository_card.open_issue": "Задай въпрос",
      "repository_card.open_source": "Отворен код",
      "repository_card.pending_restart": "Изчакващ рестартиране",
      "repository_card.pending_update": "Чакаща актуализация",
      "repository_card.redownload": "Свали отново",
      "repository_card.report": "Докладвайте за премахване",
      "repository_card.update_information": "Информация за актуализиране",
    },
    cs: {
      "common.add": "přidat",
      "common.cancel": "Zrušit",
      "common.close": "Zavřít",
      "common.download": "Stáhnout",
      "common.ignore": "Ignorovat",
      "common.integration": "Integrace",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python skript",
      "common.reload": "Znovu načíst",
      "common.remove": "Odstranit",
      "common.repositories": "Repozitáře",
      "common.repository": "Repozitář",
      "common.theme": "Motiv",
      "common.update": "Aktualizovat",
      "common.yes": "Ano",
      "confirm.home_assistant_version_not_correct":
        'Používáte Home Assistant ve verzi "{haversion}", ale tento repozitář vyžaduje instalaci minimálně verzi "{minversion}".',
      "dialog.configured.confirm": "Přejít na integrace",
      "dialog.configured.title": "Integrace je nakonfigurována",
      "dialog.reload.confirm": "Chcete to udělat hned teď?",
      "dialog.reload.description":
        "Při změně zdrojů Lovelace musíte vymazat mezipaměť prohlížeče.",
      "dialog.remove.message": "Opravdu chcete odstranit {name} ?",
      "dialog_about.downloaded_repositories": "Stažená úložiště",
      "dialog_about.frontend_version": "Verze rozhraní",
      "dialog_about.integration_version": "Verze integrace",
      "dialog_about.useful_links": "Užitečné odkazy",
      "dialog_add_repo.no_match": "Vašemu filtru neodpovídají žádné repozitáře",
      "dialog_add_repo.sort_by": "Řadit dle",
      "dialog_add_repo.title": "Přidat repozitář",
      "dialog_custom_repositories.category": "Kategorie",
      "dialog_custom_repositories.no_category": "Chybí kategorie",
      "dialog_custom_repositories.no_repository": "Chybí repozitář",
      "dialog_custom_repositories.title": "Vlastní repozitáře",
      "dialog_custom_repositories.url_placeholder":
        "Přidat URL adresu vlastního repozitáře",
      "dialog_download.select_version": "Zvolte verzi",
      "dialog_download.show_beta": "Zobrazit beta verze",
      "dialog_info.author": "Autor",
      "dialog_info.downloads": "Staženo",
      "dialog_info.loading": "Načítání informací...",
      "dialog_info.no_info":
        "Vývojář neposkytl pro tento repozitář žádné další informace",
      "dialog_info.open_issues": "Nahlásit problémy",
      "dialog_info.open_repo": "Otevřít repozitář",
      "dialog_info.stars": "Hvězdičky",
      "dialog_info.version_installed": "Verze stažena",
      "dialog_update.available_version": "Dostupná verze",
      "dialog_update.changelog": "Seznam změn",
      "dialog_update.downloaded_version": "Stažená verze",
      "dialog_update.message": "Je k dispozici nová verze {name}",
      "dialog_update.no_info":
        "Autor neposkytl žádné informace pro toto vydání",
      "dialog_update.releasenotes": "Poznámky k vydáno pro {release}",
      "dialog_update.title": "Aktualizace čeká na vyřízení",
      "menu.about": "O HACS",
      "menu.clear": "Vymazat vše nové",
      "menu.custom_repositories": "Vlastní repozitáře",
      "menu.dismiss": "Odmítnout všechny nové repozitáře",
      "menu.documentation": "Dokumentace",
      "menu.open_issue": "Nahlásit problém",
      "menu.reload": "Znovu načíst okno",
      "repository_card.dismiss": "zamítnout",
      "repository_card.information": "Informace",
      "repository_card.new_repository": "Nový repozitář",
      "repository_card.not_loaded": "Nenačteno",
      "repository_card.open_issue": "Nahlásit problém",
      "repository_card.open_source": "Otevřít zdrojový kód",
      "repository_card.pending_restart": "Čeká se na restart",
      "repository_card.pending_update": "Čeká na aktualizaci",
      "repository_card.redownload": "Stáhnout znovu",
      "repository_card.report": "Zpráva o odstranění",
      "repository_card.update_information": "Informace o aktualizaci",
    },
    da: {
      "common.add": "tilføj",
      "common.cancel": "Annuller",
      "common.close": "Luk",
      "common.download": "Download",
      "common.integration": "Integration",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.reload": "Genindlæs",
      "common.remove": "Fjern",
      "common.repositories": "Repositories",
      "common.repository": "Repository",
      "common.theme": "Tema",
      "common.update": "Opdater",
      "confirm.home_assistant_version_not_correct":
        "Du kører Home Assistant version ''{haversion}'', men dette repository kræver som minimum version ''{minversion}''.",
      "dialog.configured.confirm": "Gå til integrationer",
      "dialog_about.frontend_version": "Frontend-version",
      "dialog_about.integration_version": "Integrationsversion",
      "dialog_about.useful_links": "Nyttige links",
      "dialog_add_repo.no_match":
        "Der blev ikke fundet nogen repositories, der matcher dit filter",
      "dialog_add_repo.sort_by": "Sorter efter",
      "dialog_add_repo.title": "Tilføj repository",
      "dialog_custom_repositories.category": "Kategori",
      "dialog_custom_repositories.no_category": "Manglende kategori",
      "dialog_custom_repositories.no_repository": "Manglende repository",
      "dialog_custom_repositories.title": "Brugerdefinerede repositories",
      "dialog_custom_repositories.url_placeholder":
        "Tilføj brugerdefineret repository-webadresse",
      "dialog_info.author": "Udvikler",
      "dialog_info.downloads": "Downloads",
      "dialog_info.loading": "Indlæser oplysninger...",
      "dialog_info.no_info":
        "Udvikleren har ikke givet flere oplysninger om dette repository",
      "dialog_info.open_issues": "Åbn issues",
      "dialog_info.open_repo": "Åbn repository",
      "dialog_info.stars": "Stjerner",
      "dialog_update.available_version": "Tilgængelig version",
      "dialog_update.changelog": "Udgivelsesnoter",
      "dialog_update.releasenotes": "Udgivelsesnoter for {release}",
      "dialog_update.title": "Ventende opdatering",
      "menu.about": "Om HACS",
      "menu.clear": "Ryd alle nye",
      "menu.custom_repositories": "Brugerdefinerede repositories",
      "menu.dismiss": "Afvis alle nye repositories",
      "menu.documentation": "Dokumentation",
      "menu.open_issue": "Opret issue",
      "menu.reload": "Genindlæs vindue",
      "repository_card.dismiss": "Afvis",
      "repository_card.information": "Oplysninger",
      "repository_card.new_repository": "Nyt repository",
      "repository_card.not_loaded": "Ikke indlæst",
      "repository_card.open_issue": "Opret issue",
      "repository_card.open_source": "Åbn kilde",
      "repository_card.pending_restart": "Afventer genstart",
      "repository_card.pending_update": "Ventende opdatering",
      "repository_card.report": "Rapporter til fjernelse",
      "repository_card.update_information": "Opdater oplysninger",
    },
    de: {
      "common.add": "hinzufügen",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Abbrechen",
      "common.close": "Schließen",
      "common.download": "Herunterladen",
      "common.ignore": "Ignorieren",
      "common.integration": "Integration",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python-Skript",
      "common.reload": "Neu laden",
      "common.remove": "Entfernen",
      "common.repositories": "Repositories",
      "common.repository": "Repository",
      "common.show": "Anzeigen",
      "common.theme": "Theme",
      "common.update": "Aktualisieren",
      "common.updates": "Aktualisierungen",
      "common.yes": "Ja",
      "confirm.home_assistant_version_not_correct":
        "Du benutzt die Home Assistant-Version ''{haversion}'', für dieses Repository muss jedoch die Mindestversion ''{minversion}'' installiert sein.",
      "dialog.configured.confirm": "Gehe zu Integrationen",
      "dialog.configured.message":
        "Die {name} Integration ist bereits konfiguriert oder ignoriert, du musst die Konfiguration dafür löschen, bevor du sie aus HACS entfernst",
      "dialog.configured.title": "Integration ist konfiguriert",
      "dialog.reload.confirm": "Willst du das jetzt machen?",
      "dialog.reload.description":
        "Du musst deinen Browser-Cache leeren, wenn du Lovelace-Ressourcen änderst.",
      "dialog.remove.message": "Möchtest du {name} wirklich entfernen?",
      "dialog.remove.title": "Entfernen",
      "dialog_about.downloaded_repositories": "Heruntergeladene Repositories",
      "dialog_about.frontend_version": "Frontend Version",
      "dialog_about.integration_version": "Integrations Version",
      "dialog_about.useful_links": "Nützliche Links",
      "dialog_add_repo.no_match":
        "Es wurden keine Repositories gefunden, die deinen Filter entsprechen",
      "dialog_add_repo.sort_by": "Sortiere nach",
      "dialog_add_repo.sort_by_values.last_updated": "Zuletzt aktualisiert",
      "dialog_add_repo.sort_by_values.name": "Name",
      "dialog_add_repo.sort_by_values.stars": "Sterne",
      "dialog_add_repo.title": "Repository hinzufügen",
      "dialog_custom_repositories.category": "Kategorie",
      "dialog_custom_repositories.no_category": "Fehlende Kategorie",
      "dialog_custom_repositories.no_repository": "Fehlendes Repository",
      "dialog_custom_repositories.title": "Benutzerdefinierte Repositories",
      "dialog_custom_repositories.url_placeholder":
        "Füge eine benutzerdefinierte Repository-URL hinzu",
      "dialog_download.lovelace_instruction":
        "Nachdem der Download abgeschlossen ist, musst Du die Ressource mit diesen Einstellungen manuell hinzufügen, da Du Lovelace nicht im Speichermodus verwendest:",
      "dialog_download.note_downloaded":
        "Nach dem Herunterladen befindet sich dies in {location}",
      "dialog_download.restart":
        "Denke daran, dass du Home Assistant neu starten musst, bevor Änderungen an Integrationen (custom_components) angewendet werden.",
      "dialog_download.select_version": "Version auswählen",
      "dialog_download.show_beta": "Beta-Versionen anzeigen",
      "dialog_download.type": "Typ",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Installiere dieses Repository mit HACS",
      "dialog_info.downloads": "Downloads",
      "dialog_info.loading": "Informationen laden...",
      "dialog_info.no_info":
        "Der Entwickler hat keine weiteren Informationen für dieses Repository bereitgestellt",
      "dialog_info.open_issues": "Probleme melden",
      "dialog_info.open_repo": "Repository öffnen",
      "dialog_info.stars": "Sterne",
      "dialog_info.version_installed": "Version heruntergeladen",
      "dialog_update.available_version": "Verfügbare Version",
      "dialog_update.changelog": "Änderungsprotokoll",
      "dialog_update.downloaded_version": "Heruntergeladene Version",
      "dialog_update.message": "Eine neue Version von {name} ist verfügbar",
      "dialog_update.no_info":
        "Der Autor hat keine Informationen für dieses Release bereitgestellt",
      "dialog_update.releasenotes": "Releasenotes für {release}",
      "dialog_update.title": "Update ausstehend",
      "menu.about": "Über HACS",
      "menu.clear": "Alles neue als gesehen markieren",
      "menu.custom_repositories": "Benutzerdefinierte Repositories",
      "menu.dismiss": "Alle neuen Repositories ausblenden",
      "menu.documentation": "Dokumentation",
      "menu.open_issue": "Problem melden",
      "menu.reload": "Fenster neu laden",
      "my.add_repository_description":
        "Dies fügt das benutzerdefinierte Repository ''{repository}'' hinzu, das von HACS verwaltet werden soll. Möchtest Du es hinzufügen?",
      "my.add_repository_title": "Benutzerdefiniertes Repository hinzufügen",
      "my.documentation": "Dokumentation",
      "my.error": "Unbekannter Fehler aufgetreten",
      "my.faq_link": "Mein Heimassistent FAQ",
      "my.not_supported":
        "Diese Weiterleitung wird nicht unterstützt. Überprüfen Sie den {link} auf die unterstützten Weiterleitungen und die Version, in der sie eingeführt wurden.",
      "my.repository_not_found": "Repository {repository} nicht gefunden",
      "repository_card.dismiss": "Ausblenden",
      "repository_card.information": "Information",
      "repository_card.new_repository": "Neues Repository",
      "repository_card.not_loaded": "Nicht geladen",
      "repository_card.open_issue": "Problem melden",
      "repository_card.open_source": "Quelldateien öffnen",
      "repository_card.pending_restart": "Ausstehender Neustart",
      "repository_card.pending_update": "Ausstehende Aktualisierung",
      "repository_card.redownload": "Erneut herunterladen",
      "repository_card.report": "Melden zur Entfernung des Repositorys",
      "repository_card.update_information": "Aktualisierungsinformationen",
    },
    el: {
      "common.appdaemon": "AppDaemon",
      "common.integration": "Ενσωμάτωση",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.repositories": "Αποθετήρια",
      "common.theme": "Θέμα",
    },
    en: {
      "column.category": "Category",
      "column.downloads": "Downloads",
      "column.last_updated": "Updated",
      "column.name": "Repository Name",
      "column.stars": "Stars",
      "common.add": "add",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Cancel",
      "common.close": "Close",
      "common.download": "Download",
      "common.explore": "Explore & download repositories",
      "common.ignore": "Ignore",
      "common.integration": "Integration",
      "common.integration_plural": "Integrations",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python Script",
      "common.reload": "Reload",
      "common.remove": "Remove",
      "common.repositories": "Repositories",
      "common.repository": "Repository",
      "common.show": "Show",
      "common.theme": "Theme",
      "common.update": "Update",
      "common.updates": "Updates",
      "common.yes": "Yes",
      "confirm.home_assistant_version_not_correct":
        "You are running Home Assistant version ''{haversion}'', but this repository requires minimum version ''{minversion}'' to be installed.",
      "dialog.configured.confirm": "Go to integrations",
      "dialog.configured.message":
        "The {name} integration is configured or ignored, you need to delete the configuration for it before removing it from HACS",
      "dialog.configured.title": "Integration is configured",
      "dialog.reload.confirm": "Do you want to do that now?",
      "dialog.reload.description":
        "You need to reload your browser for the updated resources to be used.",
      "dialog.remove.message": "Do you really want to remove {name}?",
      "dialog.remove.title": "Remove",
      "dialog_about.downloaded_repositories": "Downloaded repositories",
      "dialog_about.frontend_version": "Frontend version",
      "dialog_about.integration_version": "Integration version",
      "dialog_about.useful_links": "Useful links",
      "dialog_add_repo.no_match": "No repositories found matching your filter",
      "dialog_add_repo.sort_by": "Sort by",
      "dialog_add_repo.sort_by_values.last_updated": "Last updated",
      "dialog_add_repo.sort_by_values.name": "Name",
      "dialog_add_repo.sort_by_values.stars": "Stars",
      "dialog_add_repo.title": "Add repository",
      "dialog_custom_repositories.category": "Category",
      "dialog_custom_repositories.no_category": "Missing category",
      "dialog_custom_repositories.no_repository": "Missing repository",
      "dialog_custom_repositories.title": "Custom repositories",
      "dialog_custom_repositories.url_placeholder": "Add custom repository URL",
      "dialog_download.lovelace_instruction":
        "After the download completes, since you are not using Lovelace in storage mode you need to manually add the resource with these settings:",
      "dialog_download.note_downloaded":
        "When downloaded this will be located in {location}",
      "dialog_download.restart":
        "Remember that you need to restart Home Assistant before changes to integrations (custom_components) are applied.",
      "dialog_download.select_version": "Select version",
      "dialog_download.show_beta": "Show beta versions",
      "dialog_download.type": "Type",
      "dialog_download.url": "URL",
      "dialog_info.author": "Author",
      "dialog_info.download": "Download this repository with HACS",
      "dialog_info.downloads": "Downloads",
      "dialog_info.loading": "Loading information...",
      "dialog_info.no_info":
        "The developer has not provided any more information for this repository",
      "dialog_info.open_issues": "Open issues",
      "dialog_info.open_repo": "Open repository",
      "dialog_info.stars": "Stars",
      "dialog_info.version_installed": "Version downloaded",
      "dialog_update.available_version": "Available version",
      "dialog_update.changelog": "Changelog",
      "dialog_update.downloaded_version": "Downloaded version",
      "dialog_update.message": "A new version of the {name} is available",
      "dialog_update.no_info":
        "The author has not provided any information for this release",
      "dialog_update.releasenotes": "Release notes for {release}",
      "dialog_update.title": "Update pending",
      "menu.about": "About HACS",
      "menu.clear": "Clear all new",
      "menu.custom_repositories": "Custom repositories",
      "menu.dismiss": "Dismiss new repositories",
      "menu.documentation": "Documentation",
      "menu.open_issue": "Open issue",
      "menu.reload": "Reload window",
      "my.add_repository_description":
        "This will add the custom repository ''{repository}'' to be tracked by HACS, do you want to add it?",
      "my.add_repository_title": "Add custom repository",
      "my.documentation": "documentation",
      "my.error": "An unknown error occurred",
      "my.faq_link": "My Home Assistant FAQ",
      "my.not_supported":
        "This redirect is not supported. Check the {link} for the supported redirects and the version they where introduced.",
      "my.repository_not_found": "Repository {repository} not found",
      "repository_card.dismiss": "dismiss",
      "repository_card.information": "Information",
      "repository_card.new_repository": "New repository",
      "repository_card.not_loaded": "Not loaded",
      "repository_card.open_issue": "Open issue",
      "repository_card.open_source": "Open source",
      "repository_card.pending_restart": "Pending restart",
      "repository_card.pending_update": "Pending update",
      "repository_card.redownload": "Redownload",
      "repository_card.report": "Request for removal",
      "repository_card.update_information": "Update information",
    },
    es: {
      "column.category": "Categoría",
      "column.downloads": "Descargas",
      "column.last_updated": "Actualizado",
      "column.name": "Nombre del Repositorio",
      "column.stars": "Estrellas",
      "common.add": "añadir",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Cancelar",
      "common.close": "Cerrar",
      "common.download": "Descargar",
      "common.explore": "Explorar y descargar repositorios",
      "common.ignore": "Ignorar",
      "common.integration": "Integración",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Script de Python",
      "common.reload": "Recargar",
      "common.remove": "Eliminar",
      "common.repositories": "Repositorios",
      "common.repository": "Repositorio",
      "common.show": "Mostrar",
      "common.theme": "Tema",
      "common.update": "Actualizar",
      "common.updates": "Actualizaciones",
      "common.yes": "Sí",
      "confirm.home_assistant_version_not_correct":
        "Está ejecutando la versión ''{haversion}'' de Home Assistant, pero este repositorio requiere la instalación de la versión ''{minversion}'' mínima.",
      "dialog.configured.confirm": "Ir a integraciones",
      "dialog.configured.message":
        "La integración {name} está configurada o ignorada, es necesario eliminar la configuración para ella antes de eliminarla de HACS",
      "dialog.configured.title": "La integración está configurada",
      "dialog.reload.confirm": "¿Quieres hacer eso ahora?",
      "dialog.reload.description":
        "Necesitas limpiar el caché de tu navegador cuando cambies los recursos de Lovelace.",
      "dialog.remove.message": "¿Realmente quieres eliminar a {name}?",
      "dialog.remove.title": "Eliminar",
      "dialog_about.downloaded_repositories": "Repositorios descargados",
      "dialog_about.frontend_version": "Versión del frontend",
      "dialog_about.integration_version": "Versión de la integración",
      "dialog_about.useful_links": "Enlaces útiles",
      "dialog_add_repo.no_match":
        "No se han encontrado repositorios que coincidan con el filtro",
      "dialog_add_repo.sort_by": "Ordenar por",
      "dialog_add_repo.sort_by_values.last_updated": "Última actualización",
      "dialog_add_repo.sort_by_values.name": "Nombre",
      "dialog_add_repo.sort_by_values.stars": "Estrellas",
      "dialog_add_repo.title": "Añadir repositorio",
      "dialog_custom_repositories.category": "Categoría",
      "dialog_custom_repositories.no_category": "Categoría que falta",
      "dialog_custom_repositories.no_repository": "Falta el repositorio",
      "dialog_custom_repositories.title": "Repositorios personalizados",
      "dialog_custom_repositories.url_placeholder":
        "Agrega la URL del repositorio personalizado que deseas añadir",
      "dialog_download.lovelace_instruction":
        "Una vez completada la descarga, dado que no está utilizando Lovelace en modo de almacenamiento, debe agregar manualmente el recurso con estas configuraciones:",
      "dialog_download.note_downloaded":
        "Cuando se descargue, se guardará en {location}",
      "dialog_download.restart":
        "Recuerde que debe reiniciar Home Assistant antes de aplicar los cambios en las integraciones (custom_components).",
      "dialog_download.select_version": "Seleccionar versión",
      "dialog_download.show_beta": "Mostrar versiones beta",
      "dialog_download.type": "Tipo",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Descargar este repositorio con HACS",
      "dialog_info.downloads": "Descargas",
      "dialog_info.loading": "Cargando información ...",
      "dialog_info.no_info":
        "El desarrollador no ha proporcionado más información para este repositorio",
      "dialog_info.open_issues": "Abrir incidencias",
      "dialog_info.open_repo": "Abrir repositorio",
      "dialog_info.stars": "Estrellas",
      "dialog_info.version_installed": "Versión descargada",
      "dialog_update.available_version": "Versión disponible",
      "dialog_update.changelog": "Registro de cambios",
      "dialog_update.downloaded_version": "Versión descargada",
      "dialog_update.message": "Hay disponible una nueva versión de {name}",
      "dialog_update.no_info":
        "El desarrollador no ha proporcionado más información para este repositorio",
      "dialog_update.releasenotes": "Notas de lanzamiento para {release}",
      "dialog_update.title": "Actualización pendiente",
      "menu.about": "Acerca de HACS",
      "menu.clear": "Borrar todo lo nuevo",
      "menu.custom_repositories": "Repositorios personalizados",
      "menu.dismiss": "Descartar todos los repositorios nuevos",
      "menu.documentation": "Documentación",
      "menu.open_issue": "Abrir incidencias",
      "menu.reload": "Recargar la ventana",
      "my.add_repository_description":
        "Esto agregará el repositorio personalizado ''{repository}'' y HACS comprobará sus novedades, ¿quieres agregarlo?",
      "my.add_repository_title": "Añadir repositorio personalizado",
      "my.documentation": "documentación",
      "my.error": "Ha ocurrido un error desconocido",
      "my.faq_link": "Preguntas frecuentes de Home Assistant",
      "my.not_supported":
        "Esta redirección no es compatible. Consulta {link} para conocer los redireccionamientos admitidos y la versión en la que se introdujeron.",
      "my.repository_not_found": "No se encuentra el repositorio {repository}",
      "repository_card.dismiss": "descartar",
      "repository_card.information": "Información",
      "repository_card.new_repository": "Nuevo repositorio",
      "repository_card.not_loaded": "Sin cargar",
      "repository_card.open_issue": "Abrir incidencias",
      "repository_card.open_source": "Código abierto",
      "repository_card.pending_restart": "Pendiente de reinicio",
      "repository_card.pending_update": "Actualización pendiente",
      "repository_card.redownload": "Volver a descargar",
      "repository_card.report": "Informe para la eliminación",
      "repository_card.update_information": "Actualizar información",
    },
    et: {
      "column.category": "Kategooria",
      "column.downloads": "Allalaadimised",
      "column.name": "Hoidla nimi",
      "column.stars": "Hinnang",
      "common.add": "lisa",
      "common.cancel": "Loobu",
      "common.close": "Sulge",
      "common.download": "Lae alla",
      "common.ignore": "Eira",
      "common.integration": "Sidumine",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Kasutajaliides",
      "common.python_script": "Pythoni skript",
      "common.reload": "Taaslae",
      "common.remove": "Eemalda",
      "common.repositories": "Teegid",
      "common.repository": "Hoidla",
      "common.show": "Kuva",
      "common.theme": "Kuva teema",
      "common.update": "Uuenda",
      "common.updates": "Uuendused",
      "common.yes": "Jah",
      "confirm.home_assistant_version_not_correct":
        "Kasutad Home Assistanti versiooni ''{haversion}'' kuid see hoidla nõuab vähemalt versiooni ''{minversion}'' installimist.",
      "dialog.configured.confirm": "Mine sidumiste juurde",
      "dialog.configured.message":
        "Sidumine {name} on seadistatud, pead selle sidumise enne HACS-ist eemaldamist kustutama",
      "dialog.configured.title": "Sidumine on seadistatud",
      "dialog.reload.confirm": "Kas teen seda kohe?",
      "dialog.reload.description":
        "Uuendatud ressursside kasutamiseks pead tühjendama brauseri vahemälu.",
      "dialog.remove.message": "Kas soovid tõesti eemaldada üksuse {name}?",
      "dialog.remove.title": "Eemalda",
      "dialog_about.downloaded_repositories": "Allalaaditud hoidlad",
      "dialog_about.frontend_version": "Kasutajaliidese versioon",
      "dialog_about.integration_version": "Sidumise versioon",
      "dialog_about.useful_links": "Kasulikud veebiviited",
      "dialog_add_repo.no_match": "Filtrile vastavaid hoidlaid ei leitud",
      "dialog_add_repo.sort_by": "Sortimisalus",
      "dialog_add_repo.sort_by_values.last_updated": "Viimati uuendatud",
      "dialog_add_repo.sort_by_values.name": "Nimi",
      "dialog_add_repo.sort_by_values.stars": "Hinnang",
      "dialog_add_repo.title": "Lisa hoidla",
      "dialog_custom_repositories.category": "Kategooria",
      "dialog_custom_repositories.no_category": "Puuduv kategooria",
      "dialog_custom_repositories.no_repository": "Puuduv hoidla",
      "dialog_custom_repositories.title": "Kohandatud hoidlad",
      "dialog_custom_repositories.url_placeholder":
        "Lisa kohandatud hoidla URL",
      "dialog_download.lovelace_instruction":
        "Kuna ei kasutata Lovelace'i salvestusrežiimis siis pärast allalaadimise lõpetamist pead ressursi käsitsi lisama järgmiste sätetega:",
      "dialog_download.note_downloaded":
        "Allalaadimisel asub see asukohas {location}",
      "dialog_download.restart":
        "Pea meeles, et sidumiste (custom_components) muudatuste rakendamiseks pead Home Assistanti taaskäivitama.",
      "dialog_download.select_version": "Vali versioon",
      "dialog_download.show_beta": "Kuva beetaversioonid",
      "dialog_download.type": "Liik",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Laadi see hoidla alla HACS-iga",
      "dialog_info.downloads": "Allalaadimised",
      "dialog_info.loading": "Teabe laadimine ...",
      "dialog_info.no_info":
        "Arendaja ei ole selle hoidla kohta rohkem teavet avaldanud",
      "dialog_info.open_issues": "Teadaolevad tõrketeatised",
      "dialog_info.open_repo": "Ava hoidla",
      "dialog_info.stars": "Hinnang",
      "dialog_info.version_installed": "Allalaaditud versioon",
      "dialog_update.available_version": "Saadaolev versioon",
      "dialog_update.changelog": "Muudatused",
      "dialog_update.downloaded_version": "Allalaaditud versioon",
      "dialog_update.message": "{name} uus versioon on saadaval",
      "dialog_update.no_info":
        "Arendaja ei ole selle väljalaske kohta rohkem teavet avaldanud",
      "dialog_update.releasenotes": "Versiooni {release} teave",
      "dialog_update.title": "Uuendus on ootel",
      "menu.about": "HACS-i info",
      "menu.clear": "Tühjenda kõik uued",
      "menu.custom_repositories": "Kohandatud hoidlad",
      "menu.dismiss": "Peida kõik uued hoidlad",
      "menu.documentation": "Dokumentatsioon",
      "menu.open_issue": "Esita tõrketeade",
      "menu.reload": "Lae aken uuesti",
      "my.add_repository_description":
        "See lisab kohandatud hoidla ''{repository}'', mida HACS jälgib. Kas soovid selle lisada?",
      "my.add_repository_title": "Lisa kohandatud hoidla",
      "my.documentation": "dokumentatsioon",
      "my.error": "Ilmnes tundmatu tõrge",
      "my.faq_link": "Home Assistanti KKK",
      "my.not_supported":
        "See ümbersuunamine ei ole toetatud. Kontrolli {link} toetatud ümbersuunamisi ja versiooni, kus need kasutusele võeti.",
      "my.repository_not_found": "Hoidlat {repository} ei leitud",
      "repository_card.dismiss": "Peida",
      "repository_card.information": "Teave",
      "repository_card.new_repository": "Uus hoidla",
      "repository_card.not_loaded": "Pole laaditud",
      "repository_card.open_issue": "Esita tõrketeade",
      "repository_card.open_source": "Avatud lähtekoodiga",
      "repository_card.pending_restart": "Taaskäivitamise ootel",
      "repository_card.pending_update": "Värskendamise ootel",
      "repository_card.redownload": "Lae uuesti alla",
      "repository_card.report": "Eemaldamise taotlus",
      "repository_card.update_information": "Värskenda teavet",
    },
    fi: {
      "common.add": "Lisää",
      "common.ignore": "Ohita",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.repository": "Repo",
      "common.theme": "Teema",
      "common.update": "Päivitä",
      "dialog_about.frontend_version": "Frontend-versio",
      "dialog_about.useful_links": "Hyödyllisiä linkkejä",
      "dialog_add_repo.sort_by": "Järjestä",
      "dialog_add_repo.title": "Lisää repo",
      "dialog_custom_repositories.category": "Kategoria",
      "dialog_custom_repositories.no_category": "Puuttuva kategoria",
      "dialog_custom_repositories.no_repository": "Puuttuva repo",
      "dialog_info.author": "Luoja",
      "dialog_info.downloads": "Lataukset",
      "dialog_info.loading": "Tietoja ladataan...",
      "dialog_info.open_issues": "Avoimet ongelmat",
      "dialog_info.open_repo": "Avaa repo",
      "dialog_info.stars": "Tähdet",
      "dialog_update.available_version": "Saatavilla oleva versio",
      "dialog_update.changelog": "Muutosloki",
      "dialog_update.title": "Päivitys odottaa",
      "menu.about": "Tietoja HACS:stä",
      "menu.clear": "Tyhjennä kaikki uudet",
      "menu.custom_repositories": "Mukautetut repot",
      "menu.dismiss": "Hylkää kaikki uudet repot",
      "menu.documentation": "Dokumentointi",
      "menu.open_issue": "Avoin ongelma",
      "menu.reload": "Lataa ikkuna uudelleen",
      "repository_card.dismiss": "Hylkää",
      "repository_card.information": "Tiedot",
      "repository_card.new_repository": "Uusi repo",
      "repository_card.not_loaded": "Ei ladattu",
      "repository_card.open_issue": "Avoin ongelma",
      "repository_card.open_source": "Avoin lähdekoodi",
      "repository_card.pending_restart": "Odottaa uudelleenkäynnistystä",
      "repository_card.pending_update": "Odottaa päivittämistä",
      "repository_card.report": "Raportoi poistettavaksi",
      "repository_card.update_information": "Päivitä tiedot",
    },
    fr: {
      "common.add": "ajouter",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Annuler",
      "common.close": "Fermer",
      "common.download": "Télécharger",
      "common.ignore": "Ignorer",
      "common.integration": "Intégration",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Script Python",
      "common.reload": "Recharger",
      "common.remove": "Désinstaller",
      "common.repositories": "Dépôts",
      "common.repository": "Dépôt",
      "common.show": "Afficher",
      "common.theme": "Thème",
      "common.update": "Mettre à jour",
      "common.updates": "Mises à jour",
      "common.yes": "Oui",
      "confirm.home_assistant_version_not_correct":
        "Vous exécutez la version ''{haversion}'' de Home Assistant mais ce dépôt nécessite l'installation de la version ''{minversion}'' au minimum.",
      "dialog.configured.confirm": "Aller aux intégrations",
      "dialog.configured.message":
        "L'intégration {name} est actuellement configurée ou ignorée ; vous devez d'abord supprimer sa configuration avant de pouvoir la désinstaller depuis HACS",
      "dialog.configured.title": "L'intégration est configurée",
      "dialog.reload.confirm": "Voulez-vous faire cela maintenant ?",
      "dialog.reload.description":
        "Vous devez actualiser votre navigateur afin que les ressources mises à jour soient utilisées.",
      "dialog.remove.message": "Voulez-vous vraiment désinstaller {name} ?",
      "dialog.remove.title": "Désinstaller",
      "dialog_about.downloaded_repositories": "Dépôts téléchargés",
      "dialog_about.frontend_version": "Version de l'interface",
      "dialog_about.integration_version": "Version de l'intégration",
      "dialog_about.useful_links": "Liens utiles",
      "dialog_add_repo.no_match":
        "Aucun dépôt trouvé correspondant à votre filtre",
      "dialog_add_repo.sort_by": "Trier par",
      "dialog_add_repo.sort_by_values.last_updated": "Dernière mise à jour",
      "dialog_add_repo.sort_by_values.name": "Nom",
      "dialog_add_repo.sort_by_values.stars": "Étoiles",
      "dialog_add_repo.title": "Ajouter un dépôt",
      "dialog_custom_repositories.category": "Catégorie",
      "dialog_custom_repositories.no_category": "Catégorie manquante",
      "dialog_custom_repositories.no_repository": "Dépôt manquant",
      "dialog_custom_repositories.title": "Dépôts personnalisés",
      "dialog_custom_repositories.url_placeholder":
        "Ajouter une URL de dépôt personnalisée",
      "dialog_download.lovelace_instruction":
        "Étant donné que vous n'utilisez pas Lovelace en mode « storage », une fois le téléchargement terminé, vous devrez ajouter manuellement la ressource grâce aux paramètres suivants :",
      "dialog_download.note_downloaded":
        "Ce dépôt sera téléchargé dans {location}",
      "dialog_download.restart":
        "N'oubliez pas que vous devez redémarrer Home Assistant afin que les modifications apportées aux intégrations (custom_components) soient appliquées.",
      "dialog_download.select_version": "Sélectionner la version",
      "dialog_download.show_beta": "Afficher les versions bêta",
      "dialog_download.type": "Type",
      "dialog_download.url": "URL",
      "dialog_info.author": "Auteur",
      "dialog_info.download": "Télécharger ce dépôt avec HACS",
      "dialog_info.downloads": "Téléchargements",
      "dialog_info.loading": "Chargement des informations…",
      "dialog_info.no_info":
        "Le développeur n'a pas fourni plus d'informations pour ce dépôt",
      "dialog_info.open_issues": "Problèmes connus",
      "dialog_info.open_repo": "Accéder au dépôt",
      "dialog_info.stars": "Étoiles",
      "dialog_info.version_installed": "Version téléchargée",
      "dialog_update.available_version": "Version disponible",
      "dialog_update.changelog": "Journal des modifications",
      "dialog_update.downloaded_version": "Version téléchargée",
      "dialog_update.message": "Une nouvelle version de {name} est disponible",
      "dialog_update.no_info":
        "L'auteur n'a fourni aucune information pour cette version",
      "dialog_update.releasenotes": "Notes de version pour {release}",
      "dialog_update.title": "Mise à jour en attente",
      "menu.about": "À propos de HACS",
      "menu.clear": "Effacer tous les nouveaux",
      "menu.custom_repositories": "Dépôts personnalisés",
      "menu.dismiss": "Rejeter tous les nouveaux dépôts",
      "menu.documentation": "Documentation",
      "menu.open_issue": "Signaler un problème",
      "menu.reload": "Recharger la fenêtre",
      "repository_card.dismiss": "rejeter",
      "repository_card.information": "Informations",
      "repository_card.new_repository": "Nouveau dépôt",
      "repository_card.not_loaded": "Non chargé",
      "repository_card.open_issue": "Signaler un problème",
      "repository_card.open_source": "Afficher le code source",
      "repository_card.pending_restart": "En attente de redémarrage",
      "repository_card.pending_update": "Mise à jour en attente",
      "repository_card.redownload": "Retélécharger",
      "repository_card.report": "Faire une demande de suppression",
      "repository_card.update_information": "Actualiser les informations",
    },
    he: {
      "column.category": "קטגוריה",
      "column.downloads": "הורדות",
      "column.name": "שם המאגר",
      "column.stars": "כוכבים",
      "common.add": "הוספה",
      "common.cancel": "ביטול",
      "common.close": "סגור",
      "common.download": "הורדה",
      "common.ignore": "להתעלם",
      "common.integration": "שילוב",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "סקריפט פייתון",
      "common.reload": "טעינה מחדש",
      "common.remove": "הסרה",
      "common.repositories": "מאגרים",
      "common.repository": "מאגר",
      "common.show": "הצג",
      "common.theme": "ערכת נושא",
      "common.update": "עדכון",
      "common.updates": "עדכונים",
      "common.yes": "כן",
      "confirm.home_assistant_version_not_correct":
        "גירסת Home Assistant ''{haversion}'' רצה, אבל באסה מאגר זה דורש מינימום גירסת ''{minversion}''.",
      "dialog.configured.confirm": "מעבר לשילובים",
      "dialog.configured.message":
        "תצורת השילוב {name} מוגדרת או שהמערכת מתעלמת ממנו, יש למחוק את התצורה עבורו לפני הסרתו מ-HACS",
      "dialog.configured.title": "תצורת השילוב מוגדרת",
      "dialog.reload.confirm": "לעשות את זה עכשיו?",
      "dialog.reload.description":
        "יש לטעון מחדש את הדפדפן כדי להשתמש במשאבים המעודכנים.",
      "dialog.remove.message": "האם בוודאות ברצונך להסיר את {name}?",
      "dialog.remove.title": "הסרה",
      "dialog_about.downloaded_repositories": "מאגרים שהורדו",
      "dialog_about.frontend_version": "גרסת החזותי",
      "dialog_about.integration_version": "גרסת שילוב",
      "dialog_about.useful_links": "קישורים שימושיים",
      "dialog_add_repo.no_match": "לא נמצאו מאגרים התואמים את המסנן שלך",
      "dialog_add_repo.sort_by": "מיון לפי",
      "dialog_add_repo.sort_by_values.last_updated": "עודכן לאחרונה",
      "dialog_add_repo.sort_by_values.name": "שם",
      "dialog_add_repo.sort_by_values.stars": "כוכבים",
      "dialog_add_repo.title": "הוספת מאגר",
      "dialog_custom_repositories.category": "קטגוריה",
      "dialog_custom_repositories.no_category": "קטגוריה חסרה",
      "dialog_custom_repositories.no_repository": "מאגר חסר",
      "dialog_custom_repositories.title": "מאגרים מותאמים אישית",
      "dialog_custom_repositories.url_placeholder":
        "הוספת כתובת מאגר מותאמת אישית",
      "dialog_download.lovelace_instruction":
        "לאחר השלמת ההורדה, מכיוון שאינך משתמש ב-Lovelace במצב אחסון עליך להוסיף את המשאב באופן ידני עם הגדרות אלה:",
      "dialog_download.note_downloaded":
        "בעת ההורדה, פעולה זו תמוקם ב-{location}",
      "dialog_download.restart":
        "תזכורת, יש להפעיל מחדש את ה-Home Assistant לפני החלת שינויים בשילובים (custom_components).",
      "dialog_download.select_version": "בחירת גירסה",
      "dialog_download.show_beta": "הצגת גרסאות בטא",
      "dialog_download.type": "סוג",
      "dialog_download.url": "כתובת אתר",
      "dialog_info.author": "מחבר",
      "dialog_info.download": "הורדת מאגר זה באמצעות HACS",
      "dialog_info.downloads": "הורדות",
      "dialog_info.loading": "טוען מידע...",
      "dialog_info.no_info": "המפתח לא סיפק מידע נוסף עבור מאגר זה",
      "dialog_info.open_issues": "סוגיות פתוחים",
      "dialog_info.open_repo": "פתיחת מאגר",
      "dialog_info.stars": "כוכבים",
      "dialog_info.version_installed": "גירסה שהורדה",
      "dialog_update.available_version": "גירסה זמינה",
      "dialog_update.changelog": "יומן שינויים",
      "dialog_update.downloaded_version": "גרסה שהורדה",
      "dialog_update.message": "גירסה חדשה של {name} זמינה",
      "dialog_update.no_info": "המחבר לא סיפק כל מידע עבור שיחרור זו",
      "dialog_update.releasenotes": "הערות שחרור עבור {release}",
      "dialog_update.title": "עדכון ממתין",
      "menu.about": "אודות HACS",
      "menu.clear": "ניקוי כל החדשים",
      "menu.custom_repositories": "מאגרים מותאמים אישית",
      "menu.dismiss": "דחיית מאגרים חדשים",
      "menu.documentation": "תיעוד",
      "menu.open_issue": "פתיחת סוגיה",
      "menu.reload": "טעינת חלון מחדש",
      "my.add_repository_description":
        "זה יוסיף את המאגר המותאם אישית ''{repository}'' למעקב על ידי HACS, האם ברצונך רוצה להוסיף אותו?",
      "my.add_repository_title": "הוספת מאגר מותאם אישית",
      "my.documentation": "תיעוד",
      "my.error": "אירעה שגיאה לא ידועה",
      "my.faq_link": "שאלות נפוצות על Home Assistant שלי",
      "my.not_supported":
        "ההפניה מחדש אינה נתמכת. יש לבדוק ב-{link} את ההפניות מחדש הנתמכות ואת הגרסה שבה הן הוצגו.",
      "my.repository_not_found": "המאגר {repository} לא נמצא",
      "repository_card.dismiss": "דחייה",
      "repository_card.information": "מידע",
      "repository_card.new_repository": "מאגר חדש",
      "repository_card.not_loaded": "לא נטען",
      "repository_card.open_issue": "פתיחת נושא",
      "repository_card.open_source": "פתיחת מקור",
      "repository_card.pending_restart": "ממתין להפעלה מחדש",
      "repository_card.pending_update": "ממתין לעדכון",
      "repository_card.redownload": "הורדה מחדש",
      "repository_card.report": "בקשה להסרה",
      "repository_card.update_information": "עדכון מידע",
    },
    hu: {
      "column.category": "Kategória",
      "column.downloads": "Letöltések",
      "column.name": "Repó neve",
      "column.stars": "Csillag",
      "common.add": "hozzáadás",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Mégse",
      "common.close": "Bezárás",
      "common.download": "Letöltés",
      "common.ignore": "Mellőzés",
      "common.integration": "Integráció",
      "common.lovelace": "Felhasználói felület",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Felhasználói felület",
      "common.python_script": "Python szkript",
      "common.reload": "Újratöltés",
      "common.remove": "Eltávolítás",
      "common.repositories": "Repók",
      "common.repository": "Repó megnyitása",
      "common.show": "Megjelenítés",
      "common.theme": "Téma",
      "common.update": "Frissítés",
      "common.updates": "Frissítések",
      "common.yes": "Igen",
      "confirm.home_assistant_version_not_correct":
        "Home Assistant ''{haversion}'' verziója fut, de ehhez a repóhoz legalább ''{minversion}'' verzióra van szükség.",
      "dialog.configured.confirm": "Ugrás az integrációkhoz",
      "dialog.configured.message":
        "{name} integráció be van konfigurálva, ezért előbb törölnie kell annak konfigurációját, mielőtt eltávolítaná a HACS-ból",
      "dialog.configured.title": "Az integráció be van konfigurálva",
      "dialog.reload.confirm": "Meg szeretné most ezt tenni?",
      "dialog.reload.description":
        "Törölnie kell a böngésző gyorsítótárát a felhasználói felölet erőforrásainak módosításakor.",
      "dialog.remove.message":
        "Biztos benne, hogy el szeretné távolítani: {name}?",
      "dialog.remove.title": "Eltávolítás",
      "dialog_about.downloaded_repositories": "Letöltött repók",
      "dialog_about.frontend_version": "Frontend verzió",
      "dialog_about.integration_version": "Integráció verzió",
      "dialog_about.useful_links": "Hasznos linkek",
      "dialog_add_repo.no_match": "Nincs a szűrésnek megfelelő repó",
      "dialog_add_repo.sort_by": "Rendezés",
      "dialog_add_repo.sort_by_values.last_updated": "Utoljára frissítve",
      "dialog_add_repo.sort_by_values.name": "Név",
      "dialog_add_repo.sort_by_values.stars": "Csillag",
      "dialog_add_repo.title": "Repó hozzáadása",
      "dialog_custom_repositories.category": "Kategória",
      "dialog_custom_repositories.no_category": "Hiányzó kategória",
      "dialog_custom_repositories.no_repository": "Hiányzó repó",
      "dialog_custom_repositories.title": "Egyedi repók",
      "dialog_custom_repositories.url_placeholder":
        "Egyedi repó URL címének hozzáadása",
      "dialog_download.lovelace_instruction":
        "A letöltés befejezte után, mivel a felhasználói felületet nem tárolási módban használja, manuálisan kell hozzáadni az erőforrást ezekkel a beállításokkal:",
      "dialog_download.note_downloaded":
        "Letöltéskor ez a következő helyen lesz: {location}",
      "dialog_download.restart":
        "Ne feledje, hogy az egyedi integrációk (custom_components) módosításainak alkalmazásához újra kell indítani Home Assistantot.",
      "dialog_download.select_version": "Verzió kiválasztása",
      "dialog_download.show_beta": "Béta verziók megjelenítése",
      "dialog_download.type": "Típus",
      "dialog_download.url": "URL",
      "dialog_info.author": "Szerző",
      "dialog_info.download": "Repó letöltése HACS-al",
      "dialog_info.downloads": "Letöltések",
      "dialog_info.loading": "Információ betöltése...",
      "dialog_info.no_info":
        "A fejlesztő nem adott meg több információt ehhez a repóhoz",
      "dialog_info.open_issues": "Jelentett problémák",
      "dialog_info.open_repo": "Repó megnyitása",
      "dialog_info.stars": "Csillagok",
      "dialog_info.version_installed": "Letöltött verzió",
      "dialog_update.available_version": "Elérhető verzió",
      "dialog_update.changelog": "Változási napló",
      "dialog_update.downloaded_version": "Letöltött verzió",
      "dialog_update.message": "Új verzió elérhető: {name}",
      "dialog_update.no_info":
        "A szerző semmilyen információt nem adott meg ehhez a kiadáshoz",
      "dialog_update.releasenotes": "{release} kiadási megjegyzései",
      "dialog_update.title": "Frissítés érhető el",
      "menu.about": "HACS névjegye",
      "menu.clear": "Új jelölések törlése",
      "menu.custom_repositories": "Egyedi repók",
      "menu.dismiss": "Minden új repó elvetése",
      "menu.documentation": "Dokumentáció",
      "menu.open_issue": "Probléma jelentése",
      "menu.reload": "Ablak újratöltése",
      "my.add_repository_description":
        "Biztos benne, hogy hozzáadja ezt az egyedi repót HACS-hoz nyomonkövetés céljából: ''{repository}''?",
      "my.add_repository_title": "Egyedi repó hozzáadása",
      "my.documentation": "dokumentáció",
      "my.error": "Ismeretlen hiba történt",
      "my.faq_link": "My Home Assistant GYIK",
      "my.not_supported":
        "Ez az átirányítás nem támogatott. Ellenőrizze a {link} oldalon a támogatott átirányításokat és a bevezetett verziót.",
      "my.repository_not_found": "{repository} repó nem található",
      "repository_card.dismiss": "elvetés",
      "repository_card.information": "Információ",
      "repository_card.new_repository": "Új repó",
      "repository_card.not_loaded": "Nincs betöltve",
      "repository_card.open_issue": "Probléma jelentése",
      "repository_card.open_source": "Forrás megnyitása",
      "repository_card.pending_restart": "Várakozás újraindításra",
      "repository_card.pending_update": "Frissítés érhető el",
      "repository_card.redownload": "Újratelepítés",
      "repository_card.report": "Jelentés eltávolításra",
      "repository_card.update_information": "Információ frissítse",
    },
    it: {
      "column.category": "Categoria",
      "column.downloads": "Scaricamenti",
      "column.last_updated": "Aggiornato",
      "column.name": "Nome repository",
      "column.stars": "Stelle",
      "common.add": "aggiungi",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Annulla",
      "common.close": "Chiudi",
      "common.download": "Scarica",
      "common.explore": "Esplora e scarica i repository",
      "common.ignore": "Ignora",
      "common.integration": "Integrazione",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Script Python",
      "common.reload": "Ricarica",
      "common.remove": "Rimuovi",
      "common.repositories": "Repository",
      "common.repository": "Repository",
      "common.show": "Mostra",
      "common.theme": "Tema",
      "common.update": "Aggiorna",
      "common.updates": "Aggiornamenti",
      "common.yes": "Sì",
      "confirm.home_assistant_version_not_correct":
        "Stai eseguendo la versione ''{haversion}'' di Home Assistant, ma questo repository richiede la versione minima ''{minversion}'' per essere installato.",
      "dialog.configured.confirm": "Vai alle integrazioni",
      "dialog.configured.message":
        "L'integrazione {name} è configurata o ignorata, è necessario eliminare la sua configurazione prima di rimuoverla da HACS",
      "dialog.configured.title": "L'integrazione è configurata",
      "dialog.reload.confirm": "Vuoi farlo adesso?",
      "dialog.reload.description":
        "È necessario ricaricare il browser per utilizzare le risorse aggiornate.",
      "dialog.remove.message": "Vuoi davvero rimuovere {name}?",
      "dialog.remove.title": "Rimuovi",
      "dialog_about.downloaded_repositories": "Repository scaricati",
      "dialog_about.frontend_version": "Versione frontend",
      "dialog_about.integration_version": "Versione dell'integrazione",
      "dialog_about.useful_links": "Collegamenti utili",
      "dialog_add_repo.no_match":
        "Nessun repository trovato corrispondente al tuo filtro",
      "dialog_add_repo.sort_by": "Ordina per",
      "dialog_add_repo.sort_by_values.last_updated": "Ultimo aggiornamento",
      "dialog_add_repo.sort_by_values.name": "Nome",
      "dialog_add_repo.sort_by_values.stars": "Stelle",
      "dialog_add_repo.title": "Aggiungi repository",
      "dialog_custom_repositories.category": "Categoria",
      "dialog_custom_repositories.no_category": "Categoria mancante",
      "dialog_custom_repositories.no_repository": "Repository mancante",
      "dialog_custom_repositories.title": "Repository personalizzati",
      "dialog_custom_repositories.url_placeholder":
        "Aggiungi l'URL del repository personalizzato",
      "dialog_download.lovelace_instruction":
        "Al termine dello scaricamento, poiché non stai utilizzando Lovelace in modalità di archiviazione, devi aggiungere manualmente la risorsa con queste impostazioni:",
      "dialog_download.note_downloaded":
        "Una volta scaricato, si troverà in {location}",
      "dialog_download.restart":
        "Ricorda che devi riavviare Home Assistant prima che vengano applicate le modifiche alle integrazioni (custom_components).",
      "dialog_download.select_version": "Seleziona la versione",
      "dialog_download.show_beta": "Mostra versioni beta",
      "dialog_download.type": "Tipo",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autore",
      "dialog_info.download": "Scarica questo repository con HACS",
      "dialog_info.downloads": "Download",
      "dialog_info.loading": "Caricamento informazioni...",
      "dialog_info.no_info":
        "Lo sviluppatore non ha fornito ulteriori informazioni per questo repository",
      "dialog_info.open_issues": "Problemi irrisolti",
      "dialog_info.open_repo": "Apri il repository",
      "dialog_info.stars": "Stelle",
      "dialog_info.version_installed": "Versione scaricata",
      "dialog_update.available_version": "Versione disponibile",
      "dialog_update.changelog": "Registro delle modifiche",
      "dialog_update.downloaded_version": "Versione scaricata",
      "dialog_update.message": "È disponibile la nuova versione di {name}",
      "dialog_update.no_info":
        "L'autore non ha fornito alcuna informazione per questa versione",
      "dialog_update.releasenotes": "Note di rilascio per {release}",
      "dialog_update.title": "Aggiornamento in sospeso",
      "menu.about": "Informazioni su HACS",
      "menu.clear": "Nascondi novità",
      "menu.custom_repositories": "Repository personalizzati",
      "menu.dismiss": "Nascondi nuovi repository",
      "menu.documentation": "Documentazione",
      "menu.open_issue": "Problemi irrisolti",
      "menu.reload": "Ricarica la finestra",
      "my.add_repository_description":
        "Questo aggiungerà il repository personalizzato ''{repository}'' per essere tracciato da HACS, vuoi aggiungerlo?",
      "my.add_repository_title": "Aggiungi repository personalizzato",
      "my.documentation": "documentazione",
      "my.error": "Si è verificato un errore sconosciuto",
      "my.faq_link": "Domande frequenti su My Home Assistant",
      "my.not_supported":
        "Questo reindirizzamento non è supportato. Controlla il {link} per i reindirizzamenti supportati e la versione in cui sono stati introdotti.",
      "my.repository_not_found": "Repository {repository} non trovato",
      "repository_card.dismiss": "nascondi",
      "repository_card.information": "Informazioni",
      "repository_card.new_repository": "Nuovo repository",
      "repository_card.not_loaded": "Non caricato",
      "repository_card.open_issue": "Problemi irrisolti",
      "repository_card.open_source": "Open source",
      "repository_card.pending_restart": "In attesa di riavvio",
      "repository_card.pending_update": "Aggiornamento in sospeso",
      "repository_card.redownload": "Scarica di nuovo",
      "repository_card.report": "Richiesta di rimozione",
      "repository_card.update_information": "Aggiorna informazioni",
    },
    nb: {
      "column.category": "Kategori",
      "column.downloads": "Nedlastinger",
      "column.last_updated": "Oppdatert",
      "column.name": "Navn på repositorium",
      "column.stars": "Stjerner",
      "common.add": "legg til",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Avbryt",
      "common.close": "Lukk",
      "common.download": "Laste ned",
      "common.explore": "Utforsk og last ned",
      "common.ignore": "Ignorere",
      "common.integration": "Integrasjon",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python-skript",
      "common.reload": "Last inn på nytt",
      "common.remove": "Fjern",
      "common.repositories": "Pakkelagre",
      "common.repository": "Pakkelager",
      "common.show": "Vise",
      "common.theme": "Tema",
      "common.update": "Oppdater",
      "common.updates": "Oppdateringer",
      "common.yes": "Ja",
      "confirm.home_assistant_version_not_correct":
        "Du kjører Home Assistant ''{haversion}'', men dette pakkelageret krever minimum versjon ''{minversion}'' for å bli installert.",
      "dialog.configured.confirm": "Gå til integrasjoner",
      "dialog.configured.message":
        "{name} -integrasjonen er konfigurert eller ignorert, du må slette konfigurasjonen for den før du fjerner den fra HACS",
      "dialog.configured.title": "Integrasjon er konfigurert",
      "dialog.reload.confirm": "Vil du gjøre det nå?",
      "dialog.reload.description":
        "Du må laste inn nettleseren på nytt for at de oppdaterte ressursene skal kunne brukes.",
      "dialog.remove.message": "Vil du virkelig fjerne {name} ?",
      "dialog.remove.title": "Fjern",
      "dialog_about.downloaded_repositories": "Nedlastede pakkelagre",
      "dialog_about.frontend_version": "Frontend versjon",
      "dialog_about.integration_version": "Integrasjonsversjon",
      "dialog_about.useful_links": "Nyttige lenker",
      "dialog_add_repo.no_match":
        "Ingen pakkelagre funnet som samsvarer med filteret ditt",
      "dialog_add_repo.sort_by": "Sorter etter",
      "dialog_add_repo.sort_by_values.last_updated": "Sist oppdatert",
      "dialog_add_repo.sort_by_values.name": "Navn",
      "dialog_add_repo.sort_by_values.stars": "Stjerner",
      "dialog_add_repo.title": "Legg til pakkelager",
      "dialog_custom_repositories.category": "Kategori",
      "dialog_custom_repositories.no_category": "Mangler kategori",
      "dialog_custom_repositories.no_repository": "Mangler pakkelager",
      "dialog_custom_repositories.title": "Tilpassede pakkelagre",
      "dialog_custom_repositories.url_placeholder":
        "Legg til tilpasset pakkelager URL",
      "dialog_download.lovelace_instruction":
        "Etter at nedlastingen er fullført, siden du ikke bruker Lovelace i lagringsmodus, må du manuelt legge til ressursen med disse innstillingene:",
      "dialog_download.note_downloaded":
        "Når det er lastet ned, vil dette være plassert i {location}",
      "dialog_download.restart":
        "Husk at du må starte Home Assistant på nytt før endringer i integrasjoner (custom_components) brukes.",
      "dialog_download.select_version": "Velg versjon",
      "dialog_download.show_beta": "Vis betaversjoner",
      "dialog_download.type": "Type",
      "dialog_download.url": "URL",
      "dialog_info.author": "Utgiver",
      "dialog_info.download": "Last ned dette pakkelageret med HACS",
      "dialog_info.downloads": "Nedlastinger",
      "dialog_info.loading": "Laster inn informasjon ...",
      "dialog_info.no_info":
        "Utvikleren har ikke gitt mer informasjon for dette pakkelageret",
      "dialog_info.open_issues": "Åpne problemer",
      "dialog_info.open_repo": "Åpne pakkelager nettsted",
      "dialog_info.stars": "Stjerner",
      "dialog_info.version_installed": "Nedlasted versjon",
      "dialog_update.available_version": "Tilgjengelig versjon",
      "dialog_update.changelog": "Endringslogg",
      "dialog_update.downloaded_version": "Nedlastet versjon",
      "dialog_update.message": "En ny versjon av {name} er tilgjengelig",
      "dialog_update.no_info":
        "Forfatteren har ikke gitt noen informasjon for denne utgivelsen",
      "dialog_update.releasenotes": "Utgivelsesmerknader for {release}",
      "dialog_update.title": "Oppdatering venter",
      "menu.about": "Om HACS",
      "menu.clear": "Fjern alt nytt",
      "menu.custom_repositories": "Tilpassede pakkelagre",
      "menu.dismiss": "Lukk nye repositorier",
      "menu.documentation": "Dokumentasjon",
      "menu.open_issue": "Meld et problem",
      "menu.reload": "Last inn vinduet på nytt",
      "my.add_repository_description":
        "Dette vil legge til det tilpassede depotet ''{repository}'' som skal spores av HACS, vil du legge det til?",
      "my.add_repository_title": "Legg til tilpasset repositorium",
      "my.documentation": "dokumentasjon",
      "my.error": "En ukjent feil oppstod",
      "my.faq_link": "Vanlige spørsmål om min hjemmeassistent",
      "my.not_supported":
        "Denne viderekoblingen støttes ikke. Sjekk {link} for de støttede viderekoblingene og versjonen de ble introdusert.",
      "my.repository_not_found": "Repository {repository} ikke funnet",
      "repository_card.dismiss": "Avvis",
      "repository_card.information": "Informasjon",
      "repository_card.new_repository": "Nytt pakkelager",
      "repository_card.not_loaded": "Ikke lastet inn",
      "repository_card.open_issue": "Meld et problem",
      "repository_card.open_source": "Åpne kilde",
      "repository_card.pending_restart": "Venter på omstart",
      "repository_card.pending_update": "Oppdatering venter",
      "repository_card.redownload": "Last ned på nytt",
      "repository_card.report": "Forespørsel om fjerning",
      "repository_card.update_information": "Oppdater informasjon",
    },
    nl: {
      "common.add": "toevoegen",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Annuleren",
      "common.close": "Sluit",
      "common.download": "Download",
      "common.ignore": "Negeer",
      "common.integration": "Integratie",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python Script",
      "common.reload": "Herladen",
      "common.remove": "Verwijder",
      "common.repositories": "Repositories",
      "common.repository": "Repository",
      "common.show": "Toon",
      "common.theme": "Thema",
      "common.update": "Update",
      "common.updates": "Updates",
      "common.yes": "Ja",
      "confirm.home_assistant_version_not_correct":
        "U gebruikt Home Assistant versie ''{haversion}'', echter deze repository vereist dat minimaal versie ''{minversion}'' is geïnstalleerd.",
      "dialog.configured.confirm": "Ga naar integraties",
      "dialog.configured.message":
        "De {name} -integratie is geconfigureerd of genegeerd, u moet de configuratie er van verwijderen voordat u deze uit HACS verwijdert",
      "dialog.configured.title": "Integratie is geconfigureerd",
      "dialog.reload.confirm": "Wilt u dat nu doen?",
      "dialog.reload.description":
        "U moet de cache van uw browser leegmaken wanneer u Lovelace-bronnen wijzigt.",
      "dialog.remove.message": "Wilt u {name} echt verwijderen?",
      "dialog.remove.title": "Verwijder",
      "dialog_about.downloaded_repositories": "Gedownloade repositories",
      "dialog_about.frontend_version": "Frontend versie",
      "dialog_about.integration_version": "Integratieversie",
      "dialog_about.useful_links": "Nuttige links",
      "dialog_add_repo.no_match":
        "Er zijn geen repositories gevonden die overeenkomen met uw filter",
      "dialog_add_repo.sort_by": "Sorteren op",
      "dialog_add_repo.sort_by_values.last_updated": "Laatst bijgewerkt",
      "dialog_add_repo.sort_by_values.name": "Naam",
      "dialog_add_repo.sort_by_values.stars": "Sterren",
      "dialog_add_repo.title": "Repository toevoegen",
      "dialog_custom_repositories.category": "Categorie",
      "dialog_custom_repositories.no_category": "Ontbrekende categorie",
      "dialog_custom_repositories.no_repository": "Ontbrekende repository",
      "dialog_custom_repositories.title": "Aangepaste repositories",
      "dialog_custom_repositories.url_placeholder":
        "Voeg een aangepaste repository-URL toevoegen",
      "dialog_download.lovelace_instruction":
        "Nadat de download is voltooid, moet u, aangezien u Lovelace niet in de opslagmodus gebruikt, de bron handmatig toevoegen met deze instellingen:",
      "dialog_download.note_downloaded":
        "Wanneer gedownload zal deze zich bevinden in {location}",
      "dialog_download.restart":
        "Vergeet niet dat u Home Assistant opnieuw moet opstarten voordat wijzigingen in integraties (custom_components) worden toegepast.",
      "dialog_download.select_version": "Selecteer versie",
      "dialog_download.show_beta": "Bètaversies weergeven",
      "dialog_download.type": "Type",
      "dialog_download.url": "URL",
      "dialog_info.author": "Auteur",
      "dialog_info.download": "Download deze repository met HACS",
      "dialog_info.downloads": "Downloads",
      "dialog_info.loading": "Informatie laden ...",
      "dialog_info.no_info":
        "De ontwikkelaar heeft geen verdere informatie verstrekt voor deze repository",
      "dialog_info.open_issues": "Openstaande problemen",
      "dialog_info.open_repo": "Open repository",
      "dialog_info.stars": "Sterren",
      "dialog_info.version_installed": "Versie gedownload",
      "dialog_update.available_version": "Beschikbare versie",
      "dialog_update.changelog": "Changelog",
      "dialog_update.downloaded_version": "Gedownloade versie",
      "dialog_update.message": "Er is een nieuwe versie van {name} beschikbaar",
      "dialog_update.no_info":
        "De ontwikkelaar heeft geen verdere informatie verstrekt voor deze repository",
      "dialog_update.releasenotes": "Releasenotes voor {release}",
      "dialog_update.title": "Update in behandeling",
      "menu.about": "Over HACS",
      "menu.clear": "Wis alle nieuwe",
      "menu.custom_repositories": "Aangepaste repositories",
      "menu.dismiss": "Verberg nieuwe repositories",
      "menu.documentation": "Documentatie",
      "menu.open_issue": "Meld probleem",
      "menu.reload": "Herlaad venster",
      "repository_card.dismiss": "verberg",
      "repository_card.information": "Informatie",
      "repository_card.new_repository": "Nieuwe repository",
      "repository_card.not_loaded": "Niet geladen",
      "repository_card.open_issue": "Meld probleem",
      "repository_card.open_source": "Open source",
      "repository_card.pending_restart": "In afwachting van herstart",
      "repository_card.pending_update": "In afwachting van update",
      "repository_card.redownload": "Opnieuw downloaden",
      "repository_card.report": "Rapport voor verwijdering",
      "repository_card.update_information": "Update informatie",
    },
    nn: {
      "common.appdaemon": "AppDaemon",
      "common.integration": "Integrasjon",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.repositories": "Repositories",
      "common.theme": "Tema",
      "confirm.home_assistant_version_not_correct":
        "Du køyrer Home Assistant-versjonen ''{haversion}'', men dette kodedepoet krev minst versjon ''{minversion}'' for å bli installert.",
    },
    pl: {
      "common.add": "dodaj",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Anuluj",
      "common.close": "Zamknij",
      "common.download": "Pobierz",
      "common.ignore": "Ignoruj",
      "common.integration": "Integracja",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Skrypt Pythona",
      "common.reload": "Wczytaj ponownie",
      "common.remove": "Usuń",
      "common.repositories": "Repozytoria",
      "common.repository": "Repozytorium",
      "common.show": "Pokaż",
      "common.theme": "Motyw",
      "common.update": "Uaktualnij",
      "common.updates": "Aktualizacje",
      "common.yes": "Tak",
      "confirm.home_assistant_version_not_correct":
        "Używasz Home Assistant'a w wersji ''{haversion}'', a to repozytorium wymaga wersji minimum ''{minversion}''.",
      "dialog.configured.confirm": "Przejdź do integracji",
      "dialog.configured.message":
        "Integracja {name} jest skonfigurowana lub ignorowana. Należy usunąć jej konfigurację przed usunięciem jej z HACS.",
      "dialog.configured.title": "Integracja jest skonfigurowana",
      "dialog.reload.confirm": "Czy chcesz to zrobić teraz?",
      "dialog.reload.description":
        "Musisz wyczyścić pamięć podręczną przeglądarki po zmianie zasobów Lovelace.",
      "dialog.remove.message": "Czy na pewno chcesz usunąć {name}?",
      "dialog.remove.title": "Usuwanie",
      "dialog_about.downloaded_repositories": "Pobrane repozytoria",
      "dialog_about.frontend_version": "Wersja interfejsu użytkownika",
      "dialog_about.integration_version": "Wersja integracji",
      "dialog_about.useful_links": "Przydatne linki",
      "dialog_add_repo.no_match":
        "Nie znaleziono repozytoriów pasujących do filtra",
      "dialog_add_repo.sort_by": "Sortuj według",
      "dialog_add_repo.sort_by_values.last_updated": "Ostatnio zaktualizowane",
      "dialog_add_repo.sort_by_values.name": "Nazwa",
      "dialog_add_repo.sort_by_values.stars": "Gwiazdki",
      "dialog_add_repo.title": "Dodawanie repozytorium",
      "dialog_custom_repositories.category": "Kategoria",
      "dialog_custom_repositories.no_category": "Brak kategorii",
      "dialog_custom_repositories.no_repository": "Brak repozytorium",
      "dialog_custom_repositories.title": "Niestandardowe repozytoria",
      "dialog_custom_repositories.url_placeholder":
        "Adres URL niestandardowego repozytorium",
      "dialog_download.lovelace_instruction":
        "Po zakończeniu pobierania, ponieważ nie używasz Lovelace w trybie przechowywania, musisz ręcznie dodać zasób z tymi ustawieniami:",
      "dialog_download.note_downloaded":
        "Po pobraniu będzie on znajdował się w {location}",
      "dialog_download.restart":
        "Pamiętaj, że musisz ponownie uruchomić Home Assistanta by zastosować zmiany w integracjach (custom_components).",
      "dialog_download.select_version": "Wybierz wersję",
      "dialog_download.show_beta": "Pokaż wersje beta",
      "dialog_download.type": "Typ",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Pobierz to repozytorium z HACS",
      "dialog_info.downloads": "Ilość pobrań",
      "dialog_info.loading": "Pobieranie informacji...",
      "dialog_info.no_info":
        "Deweloper nie dostarczył więcej informacji na temat tego repozytorium",
      "dialog_info.open_issues": "Problemy",
      "dialog_info.open_repo": "Otwórz repozytorium",
      "dialog_info.stars": "Gwiazdki",
      "dialog_info.version_installed": "Pobrano wersję",
      "dialog_update.available_version": "Dostępna wersja",
      "dialog_update.changelog": "Lista zmian",
      "dialog_update.downloaded_version": "Pobrana wersja",
      "dialog_update.message": "Dostępna jest nowa wersja {name}",
      "dialog_update.no_info":
        "Autor nie podał żadnych informacji dotyczących tego wydania",
      "dialog_update.releasenotes": "Informacje o {release}",
      "dialog_update.title": "Dostępna aktualizacja",
      "menu.about": "O HACS",
      "menu.clear": "Wyczyść oznaczenia nowych",
      "menu.custom_repositories": "Niestandardowe repozytoria",
      "menu.dismiss": "Odrzuć nowe repozytoria",
      "menu.documentation": "Dokumentacja",
      "menu.open_issue": "Powiadom o problemie",
      "menu.reload": "Załaduj ponownie okno",
      "repository_card.dismiss": "odrzuć",
      "repository_card.information": "Informacje",
      "repository_card.new_repository": "Nowe repozytorium",
      "repository_card.not_loaded": "Nie załadowano",
      "repository_card.open_issue": "Powiadom o problemie",
      "repository_card.open_source": "Otwórz kod źródłowy",
      "repository_card.pending_restart": "Oczekiwanie na restart",
      "repository_card.pending_update": "Oczekująca aktualizacja",
      "repository_card.redownload": "Pobierz ponownie",
      "repository_card.report": "Zgłoś do usunięcia",
      "repository_card.update_information": "Uaktualnij dane",
    },
    pt_BR: {
      "column.category": "Categoria",
      "column.downloads": "Downloads",
      "column.last_updated": "Atualizado",
      "column.name": "Nome do repositório",
      "column.stars": "Estrelas",
      "common.add": "adicionar",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Cancelar",
      "common.close": "Fechar",
      "common.download": "Baixar",
      "common.explore": "Explorar & baixar repositórios",
      "common.ignore": "Ignorar",
      "common.integration": "Integração",
      "common.lovelace": "Dashboard",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Dashboard",
      "common.python_script": "Script Python",
      "common.reload": "Recarregar",
      "common.remove": "Remover",
      "common.repositories": "Repositórios",
      "common.repository": "Repositório",
      "common.show": "Mostrar",
      "common.theme": "Tema",
      "common.update": "Atualizar",
      "common.updates": "Atualizações",
      "common.yes": "Sim",
      "confirm.home_assistant_version_not_correct":
        "Você está executando a versão Home Assistant ''{haversion}'', mas este repositório requer que a versão mínima ''{minversion}'' esteja instalada.",
      "dialog.configured.confirm": "Vá para integrações",
      "dialog.configured.message":
        "A integração {name} está configurada ou ignorada, você precisa excluir a configuração dela antes de removê-la do HACS",
      "dialog.configured.title": "A integração está configurada",
      "dialog.reload.confirm": "Você quer fazer isso agora?",
      "dialog.reload.description":
        "Você precisa recarregar seu navegador para que os recursos atualizados sejam usados.",
      "dialog.remove.message": "Você realmente quer remover o {name}?",
      "dialog.remove.title": "Remover",
      "dialog_about.downloaded_repositories": "Repositórios baixados",
      "dialog_about.frontend_version": "Versão do frontend",
      "dialog_about.integration_version": "Versão da integração",
      "dialog_about.useful_links": "Links úteis",
      "dialog_add_repo.no_match":
        "Nenhum repositório encontrado correspondente ao seu filtro",
      "dialog_add_repo.sort_by": "Ordenar por",
      "dialog_add_repo.sort_by_values.last_updated": "Ultima atualização",
      "dialog_add_repo.sort_by_values.name": "Nome",
      "dialog_add_repo.sort_by_values.stars": "Estrelas",
      "dialog_add_repo.title": "Novo repositório",
      "dialog_custom_repositories.category": "Categoria",
      "dialog_custom_repositories.no_category": "Categoria ausente",
      "dialog_custom_repositories.no_repository": "Repositório ausente",
      "dialog_custom_repositories.title": "Repositórios personalizados",
      "dialog_custom_repositories.url_placeholder":
        "Adicionar URL de repositório personalizado",
      "dialog_download.lovelace_instruction":
        "Após o download ser concluído, já que você não está usando a Dashboard no modo de armazenamento, você precisa adicionar manualmente o recurso com essas configurações:",
      "dialog_download.note_downloaded":
        "Quando baixado, ele estará localizado em {location}",
      "dialog_download.restart":
        "Lembre-se de que você precisa reiniciar o Home Assistant antes que as alterações nas integrações (custom_components) sejam aplicadas.",
      "dialog_download.select_version": "Selecione a versão",
      "dialog_download.show_beta": "Mostrar versões beta",
      "dialog_download.type": "Tipo",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Baixe esse repositório no HACS",
      "dialog_info.downloads": "Downloads",
      "dialog_info.loading": "Carregando informações...",
      "dialog_info.no_info":
        "O desenvolvedor não forneceu mais informações para este repositório",
      "dialog_info.open_issues": "Problemas em aberto",
      "dialog_info.open_repo": "Abrir repositório",
      "dialog_info.stars": "Estrelas",
      "dialog_info.version_installed": "Versão baixada",
      "dialog_update.available_version": "Versão disponível",
      "dialog_update.changelog": "Registro de mudanças",
      "dialog_update.downloaded_version": "Versão para download",
      "dialog_update.message": "Uma nova versão do {name} está disponível",
      "dialog_update.no_info":
        "O autor não forneceu nenhuma informação para esta versão",
      "dialog_update.releasenotes": "Notas de lançamento para {release}",
      "dialog_update.title": "Atualização pendente",
      "menu.about": "Sobre o HACS",
      "menu.clear": "Limpar todos os novos",
      "menu.custom_repositories": "Repositórios personalizados",
      "menu.dismiss": "Limpar todos os novos repositórios",
      "menu.documentation": "Documentação",
      "menu.open_issue": "Relatar problema",
      "menu.reload": "Recarregar janela",
      "my.add_repository_description":
        "Isso adicionará o repositório personalizado ''{repository}'' a ser rastreado pelo HACS, você deseja adicioná-lo?",
      "my.add_repository_title": "Adicionar repositório personalizado",
      "my.documentation": "documentação",
      "my.error": "Ocorreu um erro desconhecido",
      "my.faq_link": "Meu Home Assistant FAQ",
      "my.not_supported":
        "Este redirecionamento não é suportado. Verifique o {link} para os redirecionamentos suportados e a versão em que foram introduzidos.",
      "my.repository_not_found": "Repositório {repository} não encontrado",
      "repository_card.dismiss": "Dispensar",
      "repository_card.information": "Informações",
      "repository_card.new_repository": "Novo repositório",
      "repository_card.not_loaded": "Não carregado",
      "repository_card.open_issue": "Relatar problema",
      "repository_card.open_source": "Código aberto",
      "repository_card.pending_restart": "Reinicialização pendente",
      "repository_card.pending_update": "Atualização pendente",
      "repository_card.redownload": "Baixar novamente",
      "repository_card.report": "Denunciar para remoção",
      "repository_card.update_information": "Atualizar informações",
    },
    pt: {
      "common.add": "adicionar",
      "common.cancel": "Cancelar",
      "common.close": "Fechar",
      "common.download": "Descarregar",
      "common.ignore": "Ignorar",
      "common.integration": "Integração",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Script Python",
      "common.reload": "Recarregar",
      "common.remove": "Remover",
      "common.repositories": "Repositórios",
      "common.repository": "Repositório",
      "common.theme": "Tema",
      "common.update": "Atualizar",
      "common.yes": "Sim",
      "confirm.home_assistant_version_not_correct":
        "Está a executar a versão ''{haversion}'' do Home Assistant, mas este repositório requer a versão mínima ''{minversion}'' para ser instalado.",
      "dialog.configured.confirm": "Ir para integrações",
      "dialog.configured.message":
        "A integração {name} é configurada ou ignorada, é necessário apagar a configuração para a mesma antes de a remover do HACS",
      "dialog.configured.title": "A integração está configurada",
      "dialog.reload.confirm": "Quer fazer isso agora?",
      "dialog.reload.description":
        "É necessário recarregar o seu navegador para que os recursos actualizados possam ser utilizados.",
      "dialog.remove.message": "Quer mesmo remover o {name}?",
      "dialog.remove.title": "Remover",
      "dialog_about.downloaded_repositories": "Repositórios descarregados",
      "dialog_about.frontend_version": "Versão Frontend",
      "dialog_about.integration_version": "Versão de integração",
      "dialog_about.useful_links": "Links úteis",
      "dialog_add_repo.no_match":
        "Não foram encontrados repositórios que correspondam ao filtro",
      "dialog_add_repo.sort_by": "Ordenar por",
      "dialog_add_repo.sort_by_values.last_updated": "Última actualização",
      "dialog_add_repo.sort_by_values.name": "Nome",
      "dialog_add_repo.sort_by_values.stars": "Estrelas",
      "dialog_add_repo.title": "Adicionar repositório",
      "dialog_custom_repositories.category": "Categoria",
      "dialog_custom_repositories.no_category": "Categoria em falta",
      "dialog_custom_repositories.no_repository": "Repositório em falta",
      "dialog_custom_repositories.title": "Repositórios personalizados",
      "dialog_custom_repositories.url_placeholder":
        "Adicionar URL do repositório personalizado",
      "dialog_download.restart":
        "Lembre-se de que precisa de reiniciar o Home Assistant antes de serem aplicadas alterações às integrações (custom_components).",
      "dialog_download.select_version": "Seleccione a versão",
      "dialog_download.show_beta": "Mostrar versões beta",
      "dialog_download.type": "Tipo",
      "dialog_download.url": "URL",
      "dialog_info.author": "Autor",
      "dialog_info.download": "Descarregar este repositório com HACS",
      "dialog_info.downloads": "Transferências",
      "dialog_info.loading": "A carregar informações...",
      "dialog_info.no_info":
        "O developer não forneceu mais informações sobre este repositório",
      "dialog_info.open_issues": "Questões em aberto",
      "dialog_info.open_repo": "Abrir Repositório",
      "dialog_info.stars": "Estrelas",
      "dialog_info.version_installed": "Versão descarregada",
      "dialog_update.available_version": "Versão disponível",
      "dialog_update.changelog": "Changelog",
      "dialog_update.downloaded_version": "Versão descarregada",
      "dialog_update.message": "Está disponível uma nova versão do {name}.",
      "dialog_update.no_info":
        "O autor não forneceu qualquer informação para este comunicado",
      "dialog_update.releasenotes": "Notas de lançamento para {release}",
      "dialog_update.title": "Atualização pendente",
      "menu.about": "Sobre o HACS",
      "menu.clear": "Limpar todos os recentes",
      "menu.custom_repositories": "Repositórios personalizados",
      "menu.dismiss": "Dispensar todos os novos repositórios.",
      "menu.documentation": "Documentação",
      "menu.open_issue": "Questão em aberto",
      "menu.reload": "Recarregar janela",
      "repository_card.dismiss": "dispensar",
      "repository_card.information": "Informações",
      "repository_card.new_repository": "Novo repositório",
      "repository_card.not_loaded": "Não carregado",
      "repository_card.open_issue": "Questão em aberto",
      "repository_card.open_source": "Código aberto",
      "repository_card.pending_restart": "Reinicialização pendente",
      "repository_card.pending_update": "Atualização pendente",
      "repository_card.redownload": "Redownload",
      "repository_card.report": "Motivo para remover",
      "repository_card.update_information": "Atualizar informações",
    },
    ro: {
      "common.appdaemon": "AppDaemon",
      "common.close": "Închide",
      "common.integration": "Integrare",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Plugin",
      "common.remove": "Șterge",
      "common.repositories": "Depozite",
      "common.theme": "Temă",
      "common.yes": "Da",
      "dialog.remove.title": "Șterge",
      "dialog_add_repo.sort_by_values.last_updated": "Ultima actualizare",
      "dialog_add_repo.sort_by_values.name": "Nume",
      "dialog_add_repo.sort_by_values.stars": "Stele",
      "dialog_download.select_version": "Selectați versiunea",
      "dialog_download.show_beta": "Afișează versiunile beta",
      "dialog_download.type": "Tip",
      "dialog_download.url": "URL",
      "dialog_update.downloaded_version": "Versiunea descărcată",
    },
    ru: {
      "common.add": "добавить",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Отмена",
      "common.close": "Закрыть",
      "common.download": "Скачать",
      "common.ignore": "Игнорировать",
      "common.integration": "Интеграция",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Скрипт Python",
      "common.reload": "Перезагрузить",
      "common.remove": "Удалить",
      "common.repositories": "Репозитории",
      "common.repository": "Репозиторий",
      "common.theme": "Тема",
      "common.update": "Обновить",
      "common.updates": "Обновления",
      "common.yes": "Да",
      "confirm.home_assistant_version_not_correct":
        "Вы используете Home Assistant версии ''{haversion}'', но данный репозиторий требует минимальную установленную версию ''{minversion}''.",
      "dialog.configured.confirm": "Перейти к интеграциям",
      "dialog.configured.message":
        "Интеграция {name} настроена или игнорируется, необходимо удалить конфигурацию для нее, прежде чем удалять ее из HACS",
      "dialog.configured.title": "Интеграция настроена",
      "dialog.reload.confirm": "Вы хотите сделать это сейчас?",
      "dialog.reload.description":
        "Вам необходимо перезагрузить браузер, чтобы использовать обновленные ресурсы.",
      "dialog.remove.message": "Вы уверены, что хотите удалить {name}?",
      "dialog.remove.title": "Удалить",
      "dialog_about.downloaded_repositories": "Загруженные репозитории",
      "dialog_about.frontend_version": "Версия интерфейса",
      "dialog_about.integration_version": "Версия интеграции",
      "dialog_about.useful_links": "Полезные ссылки",
      "dialog_add_repo.no_match":
        "Не найдено репозиторий, соответствующих фильтру",
      "dialog_add_repo.sort_by": "Сортировать по",
      "dialog_add_repo.sort_by_values.last_updated": "Последнее обновление",
      "dialog_add_repo.sort_by_values.name": "Название",
      "dialog_add_repo.sort_by_values.stars": "Звёзды",
      "dialog_add_repo.title": "Новый репозиторий",
      "dialog_custom_repositories.category": "Категория",
      "dialog_custom_repositories.no_category": "Категория не указана",
      "dialog_custom_repositories.no_repository": "Репозиторий не указан",
      "dialog_custom_repositories.title": "Пользовательские репозитории",
      "dialog_custom_repositories.url_placeholder":
        "Добавить пользовательский URL-адрес репозитория",
      "dialog_download.note_downloaded":
        "После скачивания файлы будут расположены в {location}",
      "dialog_download.restart":
        "Помните, что вам нужно перезапустить Home Assistant, прежде чем будут применены изменения в интеграциях (custom_components).",
      "dialog_download.select_version": "Выберите версию",
      "dialog_download.show_beta": "Показывать бета-версии",
      "dialog_download.type": "Тип",
      "dialog_download.url": "URL",
      "dialog_info.author": "Автор",
      "dialog_info.download": "Загрузите этот репозиторий с помощью HACS",
      "dialog_info.downloads": "Загрузки",
      "dialog_info.loading": "Загрузка информации...",
      "dialog_info.no_info":
        "Разработчик не предоставил никакой дополнительной информации для этого репозитория",
      "dialog_info.open_issues": "Открытые вопросы",
      "dialog_info.open_repo": "Открыть репозиторий",
      "dialog_info.stars": "Звёзды",
      "dialog_info.version_installed": "Версия загружена",
      "dialog_update.available_version": "Доступная версия",
      "dialog_update.changelog": "Изменения",
      "dialog_update.downloaded_version": "Загруженная версия",
      "dialog_update.message": "Доступна новая версия {name}",
      "dialog_update.no_info":
        "Автор не предоставил никакой информации для этого выпуска",
      "dialog_update.releasenotes": "Примечания к выпуску для {release}",
      "dialog_update.title": "Обновление в ожидании",
      "menu.about": "О HACS",
      "menu.clear": "Очистить все новые репозитории",
      "menu.custom_repositories": "Пользовательские репозитории",
      "menu.dismiss": "Убрать все новые",
      "menu.documentation": "Документация",
      "menu.open_issue": "Сообщить о проблеме",
      "menu.reload": "Перезагрузить окно",
      "repository_card.dismiss": "убрать",
      "repository_card.information": "Информация",
      "repository_card.new_repository": "Новый репозиторий",
      "repository_card.not_loaded": "Не загружено",
      "repository_card.open_issue": "Сообщить о проблеме",
      "repository_card.open_source": "Открыть источник",
      "repository_card.pending_restart": "В ожидании перезапуска",
      "repository_card.pending_update": "Ожидается обновление",
      "repository_card.redownload": "Скачать повторно",
      "repository_card.report": "Сообщить о нарушении",
      "repository_card.update_information": "Обновить информацию",
    },
    sl: {
      "common.add": "dodaj",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "Prekliči",
      "common.close": "Zapri",
      "common.download": "Prenesi",
      "common.ignore": "Ignoriraj",
      "common.integration": "Integracija",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python skript",
      "common.reload": "Ponovno naloži",
      "common.remove": "Odstrani",
      "common.repositories": "Repozitoriji",
      "common.repository": "Repozitorij",
      "common.show": "Pokaži",
      "common.theme": "Tema",
      "common.update": "Posodobitev",
      "common.updates": "Posodobitve",
      "common.yes": "Da",
      "confirm.home_assistant_version_not_correct":
        "Uporabljate Home Assistant verzije ''{haversion}'', vendar ta repozitorij zahteva nameščeno najmanj različico ''{minversion}''.",
      "dialog.configured.confirm": "Pojdi na integracije",
      "dialog.configured.message":
        "Integracija {name} je konfigurirana ali ignorirana, morate izbrisati konfiguracijo preden jo lahko odstranite iz HACS-a",
      "dialog.configured.title": "Integracija je konfigurirana",
      "dialog.reload.confirm": "Želite to storiti zdaj?",
      "dialog.reload.description":
        "Osvežiti morate brskalnik, da bodo posodobljeni viri na voljo.",
      "dialog.remove.message": "Res želite odstraniti {name}?",
      "dialog.remove.title": "Odstrani",
      "dialog_about.downloaded_repositories": "Prenešeni repozitoriji",
      "dialog_about.frontend_version": "Verzija frontenda",
      "dialog_about.integration_version": "Verzija integracije",
      "dialog_about.useful_links": "Uporabne povezave",
      "dialog_add_repo.no_match": "Temu filtru ne ustreza noben repozitorij",
      "dialog_add_repo.sort_by": "Sortiraj po",
      "dialog_add_repo.sort_by_values.last_updated": "Nazadnje posodobljeno",
      "dialog_add_repo.sort_by_values.name": "Naziv",
      "dialog_add_repo.sort_by_values.stars": "Zvezdic",
      "dialog_add_repo.title": "Dodaj repozitorij",
      "dialog_custom_repositories.category": "Kategorija",
      "dialog_custom_repositories.no_category": "Manjkajoča kategorija",
      "dialog_custom_repositories.no_repository": "Manjkajoč repozitorij",
      "dialog_custom_repositories.title": "Repozitoriji po meri",
      "dialog_custom_repositories.url_placeholder":
        "Dodaj URL repozitorija po meri",
      "dialog_download.lovelace_instruction":
        "Ker ne uporabljate Lovelace v načinu shranjevanja, morate po prenosu datotek ročno dodati vir z naslednjimi nastavitvami:",
      "dialog_download.note_downloaded":
        "Po končanem prenosu se bodo datoteke nahajale v {location}",
      "dialog_download.restart":
        "Home Assistant morate ponovno zagnati, da se bodo spremembe integracij (custom_components) uveljavile.",
      "dialog_download.select_version": "Izberi verzijo",
      "dialog_download.show_beta": "Pokaži beta verzije",
      "dialog_download.type": "Tip",
      "dialog_download.url": "URL",
      "dialog_info.author": "Avtor",
      "dialog_info.download": "Prenesi ta repozitorij s HACS-om",
      "dialog_info.downloads": "Prenosi",
      "dialog_info.loading": "Nalaganje informacij...",
      "dialog_info.no_info":
        "Razvijalec ni podal nobenih informacij o tem repozitoriju",
      "dialog_info.open_issues": "Prijavljene težave",
      "dialog_info.open_repo": "Odpri repozitorij",
      "dialog_info.stars": "Zvezdice",
      "dialog_info.version_installed": "Verzija prenešena",
      "dialog_update.available_version": "Verzija na voljo",
      "dialog_update.changelog": "Dnevnik sprememb",
      "dialog_update.downloaded_version": "Prenešena verzija",
      "dialog_update.message": "Nova verzija {name} je na voljo",
      "dialog_update.no_info": "Avtor ni podal nobenih informacij o tej izdaji",
      "dialog_update.releasenotes": "Opombe ob izdaji za {release}",
      "dialog_update.title": "Čakanje na posodobitev",
      "menu.about": "O HACS",
      "menu.clear": "Počisti nove",
      "menu.custom_repositories": "Repozitoriji po meri",
      "menu.dismiss": "Opusti nove repozitorije",
      "menu.documentation": "Dokumentacija",
      "menu.open_issue": "Prijavi težavo",
      "menu.reload": "Ponovno naloži okno",
      "repository_card.dismiss": "opusti",
      "repository_card.information": "Informacije",
      "repository_card.new_repository": "Nov repozitorij",
      "repository_card.not_loaded": "Ni naloženo",
      "repository_card.open_issue": "Prijavi težavo",
      "repository_card.open_source": "Odpri vir",
      "repository_card.pending_restart": "Čakam na restart",
      "repository_card.pending_update": "Čakanje na posodobitev",
      "repository_card.redownload": "Ponovno prenesi",
      "repository_card.report": "Zahteva po odstranitvi",
      "repository_card.update_information": "Posodobi informacije",
    },
    sv: {
      "common.appdaemon": "AppDaemon",
      "common.close": "Stäng",
      "common.download": "Ladda ner",
      "common.integration": "Integration",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Lovelace",
      "common.python_script": "Python skript",
      "common.repositories": "Repositories",
      "common.show": "Visa",
      "common.theme": "Tema",
      "common.updates": "Uppdateringar",
      "common.yes": "Ja",
      "confirm.home_assistant_version_not_correct":
        "Du kör Home Assistant-versionen ''{haversion}'', men detta repository kräver att lägsta versionen ''{minversion}'' måste installeras.",
      "dialog.configured.title": "Integrationen är konfigurerad",
      "dialog.remove.message": "Vill du verkligen ta bort {name}?",
      "dialog.remove.title": "Ta bort",
      "dialog_add_repo.sort_by_values.last_updated": "Senast uppdaterad",
      "dialog_add_repo.sort_by_values.name": "Namn",
      "dialog_add_repo.sort_by_values.stars": "Stjärnor",
      "dialog_download.note_downloaded":
        "När den har laddats ner kommer den att finnas i {location}",
      "dialog_download.select_version": "Välj version",
      "dialog_download.show_beta": "Visa betaversioner",
      "dialog_download.type": "Typ",
      "dialog_download.url": "URL",
      "dialog_info.version_installed": "Version nedladdad",
      "dialog_update.downloaded_version": "Nedladdad version",
      "dialog_update.message": "En ny version av {name} är tillgänglig",
      "repository_card.redownload": "Ladda ner igen",
    },
    vi: {
      "common.add": "thêm",
      "common.integration": "Tích Hợp",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon",
      "common.plugin": "Bổ Sung",
      "common.repositories": "Các kho ứng dụng",
      "common.repository": "Kho lưu trữ",
      "common.theme": "Chủ đề",
      "common.update": "Cập nhật",
      "confirm.home_assistant_version_not_correct":
        "Bạn đang chạy phiên bản Home Assistant ''{haversion}'' nhưng kho ứng dụng này yêu cầu phiên bản thấp nhất ''{minversion}'' để cài đặt.",
      "dialog_about.frontend_version": "Phiên bản Frontend",
      "dialog_about.integration_version": "Phiên bản tích hợp",
      "dialog_about.useful_links": "Liên kết hữu ích",
      "dialog_add_repo.no_match":
        "Không tìm thấy kho lưu trữ phù hợp với bộ lọc của bạn",
      "dialog_add_repo.sort_by": "Sắp xếp theo",
      "dialog_add_repo.title": "Thêm kho lưu trữ",
      "dialog_custom_repositories.category": "Danh mục",
      "dialog_custom_repositories.no_category": "Thiếu danh mục",
      "dialog_custom_repositories.no_repository": "Kho lưu trữ bị thiếu",
      "dialog_custom_repositories.title": "Các kho lưu trữ tuỳ chỉnh",
      "dialog_custom_repositories.url_placeholder":
        "Thêm URL của kho lưu trữ tùy chỉnh",
      "dialog_info.author": "Tác giả",
      "dialog_info.downloads": "Tải xuống",
      "dialog_info.loading": "Đang tải thông tin...",
      "dialog_info.no_info":
        "Nhà phát triển đã không cung cấp thêm thông tin nào cho kho lưu trữ này",
      "dialog_info.open_issues": "Báo cáo vấn đề",
      "dialog_info.open_repo": "Mở Kho ứng dụng",
      "dialog_info.stars": "Số sao",
      "dialog_update.available_version": "Phiên bản hiện có",
      "dialog_update.changelog": "Thay đổi",
      "dialog_update.releasenotes": "Thông tin phiên bản {Release}",
      "dialog_update.title": "Cập nhật đang chờ",
      "menu.about": "Giới thiệu HACS",
      "menu.clear": "Ẩn thông báo mục mới",
      "menu.custom_repositories": "Các kho ứng dụng tuỳ chỉnh",
      "menu.dismiss": "Bỏ qua tất cả kho chứa mới",
      "menu.documentation": "Tài liệu",
      "menu.open_issue": "Báo cáo vấn đề",
      "menu.reload": "Tải lại cửa sổ",
      "repository_card.dismiss": "bỏ qua",
      "repository_card.information": "Thông tin",
      "repository_card.new_repository": "Kho lưu trữ mới",
      "repository_card.not_loaded": "Không được tải",
      "repository_card.open_issue": "Báo cáo vấn đề",
      "repository_card.open_source": "Mã nguồn mở",
      "repository_card.pending_restart": "Đang chờ khởi động lại",
      "repository_card.pending_update": "Cập nhật đang chờ",
      "repository_card.report": "Báo cáo để loại bỏ",
      "repository_card.update_information": "Cập nhật thông tin",
    },
    zh_Hans: {
      "common.add": "添加",
      "common.appdaemon": "AppDaemon",
      "common.cancel": "取消",
      "common.close": "关闭",
      "common.download": "下载",
      "common.ignore": "忽略",
      "common.integration": "集成",
      "common.lovelace": "Lovelace",
      "common.netdaemon": "NetDaemon 应用",
      "common.plugin": "Lovelace",
      "common.python_script": "Python 脚本",
      "common.reload": "重新加载",
      "common.remove": "删除",
      "common.repositories": "储存库数量",
      "common.repository": "存储库",
      "common.theme": "主题",
      "common.update": "更新",
      "common.yes": "是",
      "confirm.home_assistant_version_not_correct":
        "您正在运行 Home Assistant 版本 ''{haversion}''，此存储库要求最低版本为 ''{minversion}''。",
      "dialog.configured.confirm": "转到集成",
      "dialog.configured.message":
        "集成 {name} 已完成配置或被忽略，如需将其从 HACS 中删除，需要先删除其配置。",
      "dialog.configured.title": "集成正在使用",
      "dialog.reload.confirm": "立即进行此操作吗？",
      "dialog.reload.description": "需要清除浏览器缓存才能使更新后的资源生效。",
      "dialog.remove.message": "您确定要删除 {name} 吗？",
      "dialog.remove.title": "删除",
      "dialog_about.downloaded_repositories": "已下载存储库",
      "dialog_about.frontend_version": "前端版本",
      "dialog_about.integration_version": "集成版本",
      "dialog_about.useful_links": "有用的链接",
      "dialog_add_repo.no_match": "未找到符合条件的存储库",
      "dialog_add_repo.sort_by": "排序方式",
      "dialog_add_repo.sort_by_values.last_updated": "上次更新",
      "dialog_add_repo.sort_by_values.name": "名称",
      "dialog_add_repo.sort_by_values.stars": "星标数",
      "dialog_add_repo.title": "添加存储库",
      "dialog_custom_repositories.category": "类别",
      "dialog_custom_repositories.no_category": "没有选择类别",
      "dialog_custom_repositories.no_repository": "存储库地址不能为空",
      "dialog_custom_repositories.title": "自定义存储库",
      "dialog_custom_repositories.url_placeholder": "添加自定义存储库 URL",
      "dialog_download.restart":
        "请注意，只有在重新启动 Home Assistant 后，对集成 (custom_components) 所做的更改才会生效。",
      "dialog_download.select_version": "选择版本",
      "dialog_download.show_beta": "显示测试版",
      "dialog_download.type": "类型",
      "dialog_download.url": "URL",
      "dialog_info.author": "作者",
      "dialog_info.download": "通过 HACS 下载此存储库",
      "dialog_info.downloads": "下载量",
      "dialog_info.loading": "正在加载详细信息...",
      "dialog_info.no_info": "开发者未就此存储库提供更多信息",
      "dialog_info.open_issues": "提交 Issue",
      "dialog_info.open_repo": "打开存储库",
      "dialog_info.stars": "星标数",
      "dialog_info.version_installed": "当前版本",
      "dialog_update.available_version": "可用版本",
      "dialog_update.changelog": "更新日志",
      "dialog_update.downloaded_version": "已安装版本",
      "dialog_update.message": "{name} 有新版本了",
      "dialog_update.no_info": "作者未对此版本提供任何说明",
      "dialog_update.releasenotes": "{release} 发行说明",
      "dialog_update.title": "等待更新",
      "menu.about": "关于 HACS",
      "menu.clear": "清除所有 NEW 标记",
      "menu.custom_repositories": "自定义存储库",
      "menu.dismiss": "忽略新的存储库",
      "menu.documentation": "文档",
      "menu.open_issue": "提交 Issue",
      "menu.reload": "重新加载窗口",
      "repository_card.dismiss": "忽略",
      "repository_card.information": "详情",
      "repository_card.new_repository": "新存储库",
      "repository_card.not_loaded": "未加载",
      "repository_card.open_issue": "提交 Issue",
      "repository_card.open_source": "打开源码",
      "repository_card.pending_restart": "等待重启",
      "repository_card.pending_update": "等待更新",
      "repository_card.redownload": "重新下载",
      "repository_card.report": "举报",
      "repository_card.update_information": "更新信息",
    },
  },
  Lm = new Set(["en_GB"]),
  Vm = new Qu("localize"),
  km = { language: [], sting: {} },
  Mm = {};
let xm = s(
  null,
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hacs",
          value: void 0,
        },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            r(t(i.prototype), "connectedCallback", this).call(this),
              void 0 === this.hacs &&
                (this.hacs = {
                  language: "en",
                  repositories: [],
                  info: {},
                  addedToLovelace: Wu,
                  localize: (e, t) => {
                    var o;
                    return (function (e, t, o) {
                      var r;
                      let i = (
                        e ||
                        localStorage.getItem("selectedLanguage") ||
                        "en"
                      )
                        .replace(/['"]+/g, "")
                        .replace("-", "_");
                      var a;
                      (!Lm.has(i) && wm[i]) ||
                        (Lm.has(i) ||
                          (null !== (a = km.language) &&
                            void 0 !== a &&
                            a.includes(i)) ||
                          (km.language.push(i),
                          Vm.warn(
                            `Language '${i.replace(
                              "_",
                              "-"
                            )}' is not added to HACS, using 'en' instead. https://hacs.xyz/docs/developer/translation`
                          )),
                        (i = "en"));
                      const n =
                        (null === (r = wm[i]) || void 0 === r
                          ? void 0
                          : r[t]) || wm.en[t];
                      if (!n)
                        return (
                          Vm.error(
                            `Translation problem with '${t}' for '${i}'`
                          ),
                          t
                        );
                      const s = t + n;
                      let l = Mm[s];
                      if (!l) {
                        try {
                          l = new Hm(n, e);
                        } catch (e) {
                          return (
                            Vm.error(
                              `Translation problem with '${t}' for '${i}'`
                            ),
                            t
                          );
                        }
                        Mm[s] = l;
                      }
                      try {
                        return l.format(o);
                      } catch (e) {
                        return (
                          Vm.error(
                            `Translation problem with '${t}' for '${i}'`
                          ),
                          t
                        );
                      }
                    })(
                      (null === (o = this.hacs) || void 0 === o
                        ? void 0
                        : o.language) || "en",
                      e,
                      t
                    );
                  },
                  log: new Qu(),
                }),
              this.addEventListener("update-hacs", (e) =>
                this._updateHacs(e.detail)
              );
          },
        },
        {
          kind: "method",
          key: "_updateHacs",
          value: function (e) {
            let t = !1;
            Object.keys(e).forEach((o) => {
              JSON.stringify(this.hacs[o]) !== JSON.stringify(e[o]) && (t = !0);
            }),
              t && (this.hacs = { ...this.hacs, ...e });
          },
        },
      ],
    };
  },
  ((Sm = ge),
  class extends Sm {
    constructor(...t) {
      super(...t), e(this, "hass", void 0), e(this, "__provideHass", []);
    }
    provideHass(e) {
      this.__provideHass.push(e), (e.hass = this.hass);
    }
    updated(e) {
      super.updated(e),
        e.has("hass") &&
          this.__provideHass.forEach((e) => {
            e.hass = this.hass;
          });
    }
  })
);
var Sm;
const Em = (e, t) => {
  const o = matchMedia(e),
    r = (e) => t(e.matches);
  return o.addListener(r), t(o.matches), () => o.removeListener(r);
};
var Pm =
  Number.isNaN ||
  function (e) {
    return "number" == typeof e && e != e;
  };
function Tm(e, t) {
  if (e.length !== t.length) return !1;
  for (var o = 0; o < e.length; o++)
    if (((r = e[o]), (i = t[o]), !(r === i || (Pm(r) && Pm(i))))) return !1;
  var r, i;
  return !0;
}
function Om(e, t) {
  var o;
  void 0 === t && (t = Tm);
  var r,
    i = [],
    a = !1;
  return function () {
    for (var n = [], s = 0; s < arguments.length; s++) n[s] = arguments[s];
    return (
      (a && o === this && t(n, i)) ||
        ((r = e.apply(this, n)), (a = !0), (o = this), (i = n)),
      r
    );
  };
}
const Nm = b`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}`;
let Rm = class extends ge {
  render() {
    return Y`<span><slot></slot></span>`;
  }
};
(Rm.styles = [Nm]), (Rm = wn([be("mwc-icon")], Rm));
class zm extends ge {
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
      (this.rippleHandlers = new hu(
        () => ((this.shouldRenderRipple = !0), this.ripple)
      ));
  }
  renderOverlay() {
    return Y``;
  }
  renderRipple() {
    const e = this.raised || this.unelevated;
    return this.shouldRenderRipple
      ? Y`<mwc-ripple class="ripple" .primary="${!e}" .disabled="${
          this.disabled
        }"></mwc-ripple>`
      : "";
  }
  focus() {
    const e = this.buttonElement;
    e && (this.rippleHandlers.startFocus(), e.focus());
  }
  blur() {
    const e = this.buttonElement;
    e && (this.rippleHandlers.endFocus(), e.blur());
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
    return Y`
      <button
          id="button"
          class="mdc-button ${Rn(this.getRenderClasses())}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}"
          aria-haspopup="${zn(this.ariaHasPopup)}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleActivate}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleActivate}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}">
        ${this.renderOverlay()}
        ${this.renderRipple()}
        <span class="leading-icon">
          <slot name="icon">
            ${this.icon && !this.trailingIcon ? this.renderIcon() : ""}
          </slot>
        </span>
        <span class="mdc-button__label">${this.label}</span>
        <span class="slot-container ${Rn({ flex: this.expandContent })}">
          <slot></slot>
        </span>
        <span class="trailing-icon">
          <slot name="trailingIcon">
            ${this.icon && this.trailingIcon ? this.renderIcon() : ""}
          </slot>
        </span>
      </button>`;
  }
  renderIcon() {
    return Y`
    <mwc-icon class="mdc-button__icon">
      ${this.icon}
    </mwc-icon>`;
  }
  handleRippleActivate(e) {
    const t = () => {
      window.removeEventListener("mouseup", t), this.handleRippleDeactivate();
    };
    window.addEventListener("mouseup", t), this.rippleHandlers.startPress(e);
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
(zm.shadowRootOptions = { mode: "open", delegatesFocus: !0 }),
  wn(
    [Pn, Ce({ type: String, attribute: "aria-haspopup" })],
    zm.prototype,
    "ariaHasPopup",
    void 0
  ),
  wn([Ce({ type: Boolean, reflect: !0 })], zm.prototype, "raised", void 0),
  wn([Ce({ type: Boolean, reflect: !0 })], zm.prototype, "unelevated", void 0),
  wn([Ce({ type: Boolean, reflect: !0 })], zm.prototype, "outlined", void 0),
  wn([Ce({ type: Boolean })], zm.prototype, "dense", void 0),
  wn([Ce({ type: Boolean, reflect: !0 })], zm.prototype, "disabled", void 0),
  wn(
    [Ce({ type: Boolean, attribute: "trailingicon" })],
    zm.prototype,
    "trailingIcon",
    void 0
  ),
  wn([Ce({ type: Boolean, reflect: !0 })], zm.prototype, "fullwidth", void 0),
  wn([Ce({ type: String })], zm.prototype, "icon", void 0),
  wn([Ce({ type: String })], zm.prototype, "label", void 0),
  wn([Ce({ type: Boolean })], zm.prototype, "expandContent", void 0),
  wn([Le("#button")], zm.prototype, "buttonElement", void 0),
  wn([Ve("mwc-ripple")], zm.prototype, "ripple", void 0),
  wn([Ae()], zm.prototype, "shouldRenderRipple", void 0),
  wn([we({ passive: !0 })], zm.prototype, "handleRippleActivate", null);
const Im = b`.mdc-button{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-button-font-size, 0.875rem);line-height:2.25rem;line-height:var(--mdc-typography-button-line-height, 2.25rem);font-weight:500;font-weight:var(--mdc-typography-button-font-weight, 500);letter-spacing:0.0892857143em;letter-spacing:var(--mdc-typography-button-letter-spacing, 0.0892857143em);text-decoration:none;text-decoration:var(--mdc-typography-button-text-decoration, none);text-transform:uppercase;text-transform:var(--mdc-typography-button-text-transform, uppercase)}.mdc-touch-target-wrapper{display:inline}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color, #fff)}.mdc-button{position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:none;line-height:inherit;user-select:none;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:transparent}.mdc-button .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:none}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top}[dir=rtl] .mdc-button .mdc-button__icon,.mdc-button .mdc-button__icon[dir=rtl]{margin-left:8px;margin-right:0}.mdc-button .mdc-button__label{position:relative}.mdc-button .mdc-button__touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-button__label+.mdc-button__icon{margin-left:8px;margin-right:0}[dir=rtl] .mdc-button__label+.mdc-button__icon,.mdc-button__label+.mdc-button__icon[dir=rtl]{margin-left:0;margin-right:8px}svg.mdc-button__icon{fill:currentColor}.mdc-button--touch{margin-top:6px;margin-bottom:6px}.mdc-button{padding:0 8px 0 8px}.mdc-button--unelevated{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);padding:0 16px 0 16px}.mdc-button--unelevated.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--unelevated.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--raised{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);padding:0 16px 0 16px}.mdc-button--raised.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--raised.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--outlined{border-style:solid;transition:border 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-button--outlined .mdc-button__ripple{border-style:solid;border-color:transparent}.mdc-button{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small, 4px)}.mdc-button:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-button:disabled{color:rgba(0, 0, 0, 0.38)}.mdc-button .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small, 4px)}.mdc-button--raised,.mdc-button--unelevated{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small, 4px)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:#6200ee;background-color:var(--mdc-theme-primary, #6200ee)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(0, 0, 0, 0.12)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){color:#fff;color:var(--mdc-theme-on-primary, #fff)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{color:rgba(0, 0, 0, 0.38)}.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--raised .mdc-button__ripple,.mdc-button--unelevated .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small, 4px)}.mdc-button--outlined{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small, 4px);padding:0 15px 0 15px;border-width:1px}.mdc-button--outlined:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}.mdc-button--outlined:disabled{color:rgba(0, 0, 0, 0.38)}.mdc-button--outlined .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--outlined .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small, 4px)}.mdc-button--outlined:not(:disabled){border-color:rgba(0, 0, 0, 0.12)}.mdc-button--outlined:disabled{border-color:rgba(0, 0, 0, 0.12)}.mdc-button--outlined.mdc-button--icon-trailing{padding:0 11px 0 15px}.mdc-button--outlined.mdc-button--icon-leading{padding:0 15px 0 11px}.mdc-button--outlined .mdc-button__ripple{top:calc(-1 * 1px);left:calc(-1 * 1px);border-width:1px}.mdc-button--outlined .mdc-button__touch{left:calc(-1 * 1px);width:calc(100% + 2 * 1px)}.mdc-button--raised{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 1px 5px 0px rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-button--raised:hover,.mdc-button--raised:focus{box-shadow:0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0,0,0,.12)}.mdc-button--raised:active{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0,0,0,.12)}.mdc-button--raised:disabled{box-shadow:0px 0px 0px 0px rgba(0, 0, 0, 0.2),0px 0px 0px 0px rgba(0, 0, 0, 0.14),0px 0px 0px 0px rgba(0,0,0,.12)}:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:transparent;vertical-align:top}:host([fullwidth]){width:100%}:host([raised]),:host([unelevated]){--mdc-ripple-color:#fff;--mdc-ripple-focus-opacity:0.24;--mdc-ripple-hover-opacity:0.08;--mdc-ripple-press-opacity:0.24}.trailing-icon ::slotted(*),.trailing-icon .mdc-button__icon,.leading-icon ::slotted(*),.leading-icon .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}[dir=rtl] .trailing-icon ::slotted(*),[dir=rtl] .trailing-icon .mdc-button__icon,[dir=rtl] .leading-icon ::slotted(*),[dir=rtl] .leading-icon .mdc-button__icon,.trailing-icon ::slotted(*[dir=rtl]),.trailing-icon .mdc-button__icon[dir=rtl],.leading-icon ::slotted(*[dir=rtl]),.leading-icon .mdc-button__icon[dir=rtl]{margin-left:8px;margin-right:0}.trailing-icon ::slotted(*),.trailing-icon .mdc-button__icon{margin-left:8px;margin-right:0}[dir=rtl] .trailing-icon ::slotted(*),[dir=rtl] .trailing-icon .mdc-button__icon,.trailing-icon ::slotted(*[dir=rtl]),.trailing-icon .mdc-button__icon[dir=rtl]{margin-left:0;margin-right:8px}.slot-container{display:inline-flex;align-items:center;justify-content:center}.slot-container.flex{flex:auto}.mdc-button{flex:auto;overflow:hidden;padding-left:8px;padding-left:var(--mdc-button-horizontal-padding, 8px);padding-right:8px;padding-right:var(--mdc-button-horizontal-padding, 8px)}.mdc-button--raised{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-button-raised-box-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12))}.mdc-button--raised:focus{box-shadow:0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-button-raised-box-shadow-focus, var(--mdc-button-raised-box-shadow-hover, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)))}.mdc-button--raised:hover{box-shadow:0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-button-raised-box-shadow-hover, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12))}.mdc-button--raised:active{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-button-raised-box-shadow-active, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12))}.mdc-button--raised:disabled{box-shadow:0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);box-shadow:var(--mdc-button-raised-box-shadow-disabled, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12))}.mdc-button--raised,.mdc-button--unelevated{padding-left:16px;padding-left:var(--mdc-button-horizontal-padding, 16px);padding-right:16px;padding-right:var(--mdc-button-horizontal-padding, 16px)}.mdc-button--outlined{border-width:1px;border-width:var(--mdc-button-outline-width, 1px);padding-left:calc(16px - 1px);padding-left:calc(var(--mdc-button-horizontal-padding, 16px) - var(--mdc-button-outline-width, 1px));padding-right:calc(16px - 1px);padding-right:calc(var(--mdc-button-horizontal-padding, 16px) - var(--mdc-button-outline-width, 1px))}.mdc-button--outlined:not(:disabled){border-color:rgba(0, 0, 0, 0.12);border-color:var(--mdc-button-outline-color, rgba(0, 0, 0, 0.12))}.mdc-button--outlined .ripple{top:calc(-1 * 1px);top:calc(-1 * var(--mdc-button-outline-width, 1px));left:calc(-1 * 1px);left:calc(-1 * var(--mdc-button-outline-width, 1px));right:initial;right:initial;border-width:1px;border-width:var(--mdc-button-outline-width, 1px);border-style:solid;border-color:transparent}[dir=rtl] .mdc-button--outlined .ripple,.mdc-button--outlined .ripple[dir=rtl]{left:initial;left:initial;right:calc(-1 * 1px);right:calc(-1 * var(--mdc-button-outline-width, 1px))}.mdc-button--dense{height:28px;margin-top:0;margin-bottom:0}.mdc-button--dense .mdc-button__touch{height:100%}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-button{color:rgba(0, 0, 0, 0.38);color:var(--mdc-button-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-button--raised,:host([disabled]) .mdc-button--unelevated{background-color:rgba(0, 0, 0, 0.12);background-color:var(--mdc-button-disabled-fill-color, rgba(0, 0, 0, 0.12))}:host([disabled]) .mdc-button--outlined{border-color:rgba(0, 0, 0, 0.12);border-color:var(--mdc-button-disabled-outline-color, rgba(0, 0, 0, 0.12))}`;
let Dm = class extends zm {};
(Dm.styles = [Im]),
  (Dm = wn([be("mwc-button")], Dm)),
  s(
    [be("hass-error-screen")],
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
            decorators: [Ce({ attribute: !1 })],
            key: "hass",
            value: void 0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "toolbar",
            value: () => !0,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "rootnav",
            value: () => !1,
          },
          {
            kind: "field",
            decorators: [Ce({ type: Boolean })],
            key: "narrow",
            value: () => !1,
          },
          { kind: "field", decorators: [Ce()], key: "error", value: void 0 },
          {
            kind: "method",
            key: "render",
            value: function () {
              var e, t;
              return Y`
      ${
        this.toolbar
          ? Y`<div class="toolbar">
            ${
              this.rootnav ||
              (null !== (e = history.state) && void 0 !== e && e.root)
                ? Y`
                  <ha-menu-button
                    .hass=${this.hass}
                    .narrow=${this.narrow}
                  ></ha-menu-button>
                `
                : Y`
                  <ha-icon-button-arrow-prev
                    .hass=${this.hass}
                    @click=${this._handleBack}
                  ></ha-icon-button-arrow-prev>
                `
            }
          </div>`
          : ""
      }
      <div class="content">
        <h3>${this.error}</h3>
        <slot>
          <mwc-button @click=${this._handleBack}>
            ${
              null === (t = this.hass) || void 0 === t
                ? void 0
                : t.localize("ui.common.back")
            }
          </mwc-button>
        </slot>
      </div>
    `;
            },
          },
          {
            kind: "method",
            key: "_handleBack",
            value: function () {
              history.back();
            },
          },
          {
            kind: "get",
            static: !0,
            key: "styles",
            value: function () {
              return [
                b`
        :host {
          display: block;
          height: 100%;
          background-color: var(--primary-background-color);
        }
        .toolbar {
          display: flex;
          align-items: center;
          font-size: 20px;
          height: var(--header-height);
          padding: 0 16px;
          pointer-events: none;
          background-color: var(--app-header-background-color);
          font-weight: 400;
          color: var(--app-header-text-color, white);
          border-bottom: var(--app-header-border-bottom, none);
          box-sizing: border-box;
        }
        ha-icon-button-arrow-prev {
          pointer-events: auto;
        }
        .content {
          color: var(--primary-text-color);
          height: calc(100% - var(--header-height));
          display: flex;
          padding: 16px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        a {
          color: var(--primary-color);
        }
      `,
              ];
            },
          },
        ],
      };
    },
    ge
  );
let jm = s(
  null,
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        { kind: "field", decorators: [Ce()], key: "route", value: void 0 },
        { kind: "field", key: "routerOptions", value: void 0 },
        { kind: "field", key: "_currentPage", value: () => "" },
        { kind: "field", key: "_currentLoadProm", value: void 0 },
        { kind: "field", key: "_cache", value: () => ({}) },
        { kind: "field", key: "_initialLoadDone", value: () => !1 },
        {
          kind: "field",
          key: "_computeTail",
          value: () =>
            Om((e) => {
              const t = e.path.indexOf("/", 1);
              return -1 === t
                ? { prefix: e.prefix + e.path, path: "" }
                : {
                    prefix: e.prefix + e.path.substr(0, t),
                    path: e.path.substr(t),
                  };
            }),
        },
        {
          kind: "method",
          key: "createRenderRoot",
          value: function () {
            return this;
          },
        },
        {
          kind: "method",
          key: "update",
          value: function (e) {
            r(t(i.prototype), "update", this).call(this, e);
            const o = this.routerOptions || { routes: {} };
            if (o && o.initialLoad && !this._initialLoadDone) return;
            if (!e.has("route"))
              return void (
                this.lastChild &&
                !this._currentLoadProm &&
                this.updatePageEl(this.lastChild, e)
              );
            const a = this.route,
              n = o.defaultPage;
            a &&
              "" === a.path &&
              void 0 !== n &&
              xu(`${a.prefix}/${n}`, { replace: !0 });
            let s = a
                ? ((e, t) => {
                    if ("" === e) return t;
                    const o = e.indexOf("/", 1);
                    return -1 === o ? e.substr(1) : e.substr(1, o - 1);
                  })(a.path, n || "")
                : "not_found",
              l = o.routes[s];
            for (; "string" == typeof l; ) (s = l), (l = o.routes[s]);
            if (o.beforeRender) {
              const e = o.beforeRender(s);
              if (void 0 !== e) {
                for (s = e, l = o.routes[s]; "string" == typeof l; )
                  (s = l), (l = o.routes[s]);
                a && xu(`${a.prefix}/${e}${location.search}`, { replace: !0 });
              }
            }
            if (this._currentPage === s)
              return void (
                this.lastChild && this.updatePageEl(this.lastChild, e)
              );
            if (!l)
              return (
                (this._currentPage = ""),
                void (this.lastChild && this.removeChild(this.lastChild))
              );
            this._currentPage = s;
            const d = l.load ? l.load() : Promise.resolve();
            let c;
            if (
              (d.catch((e) => {
                console.error("Error loading page", s, e),
                  this._currentPage === s &&
                    (this.lastChild && this.removeChild(this.lastChild),
                    c && clearTimeout(c),
                    this.appendChild(
                      this.createErrorScreen(`Error while loading page ${s}.`)
                    ));
              }),
              !o.showLoading)
            )
              return void this._createPanel(o, s, l);
            let p = !1;
            (c = window.setTimeout(() => {
              p ||
                this._currentPage !== s ||
                (this.lastChild && this.removeChild(this.lastChild),
                this.appendChild(this.createLoadingScreen()));
            }, 400)),
              (this._currentLoadProm = d.then(
                () => {
                  (this._currentLoadProm = void 0),
                    this._currentPage === s &&
                      ((p = !0), this._createPanel(o, s, l));
                },
                () => {
                  this._currentLoadProm = void 0;
                }
              ));
          },
        },
        {
          kind: "method",
          key: "firstUpdated",
          value: function (e) {
            r(t(i.prototype), "firstUpdated", this).call(this, e);
            const o = this.routerOptions;
            o &&
              (o.preloadAll &&
                Object.values(o.routes).forEach(
                  (e) => "object" == typeof e && e.load && e.load()
                ),
              o.initialLoad &&
                (setTimeout(() => {
                  this._initialLoadDone ||
                    this.appendChild(this.createLoadingScreen());
                }, 400),
                o.initialLoad().then(() => {
                  (this._initialLoadDone = !0), this.requestUpdate("route");
                })));
          },
        },
        {
          kind: "method",
          key: "createLoadingScreen",
          value: function () {
            return document.createElement("hass-loading-screen");
          },
        },
        {
          kind: "method",
          key: "createErrorScreen",
          value: function (e) {
            const t = document.createElement("hass-error-screen");
            return (t.error = e), t;
          },
        },
        {
          kind: "method",
          key: "rebuild",
          value: async function () {
            const e = this.route;
            void 0 !== e &&
              ((this.route = void 0),
              await this.updateComplete,
              void 0 === this.route && (this.route = e));
          },
        },
        {
          kind: "get",
          key: "pageRendered",
          value: function () {
            return this.updateComplete.then(() => this._currentLoadProm);
          },
        },
        {
          kind: "method",
          key: "createElement",
          value: function (e) {
            return document.createElement(e);
          },
        },
        { kind: "method", key: "updatePageEl", value: function (e, t) {} },
        {
          kind: "get",
          key: "routeTail",
          value: function () {
            return this._computeTail(this.route);
          },
        },
        {
          kind: "method",
          key: "_createPanel",
          value: function (e, t, o) {
            this.lastChild && this.removeChild(this.lastChild);
            const r = this._cache[t] || this.createElement(o.tag);
            this.updatePageEl(r),
              this.appendChild(r),
              (e.cacheAll || o.cache) && (this._cache[t] = r);
          },
        },
      ],
    };
  },
  M
);
s(
  [be("hacs-router")],
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hacs",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "route",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ type: Boolean })],
          key: "narrow",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ae()],
          key: "_wideSidebar",
          value: () => !1,
        },
        { kind: "field", decorators: [Ae()], key: "_wide", value: () => !1 },
        { kind: "field", key: "_listeners", value: () => [] },
        {
          kind: "method",
          key: "connectedCallback",
          value: function () {
            r(t(i.prototype), "connectedCallback", this).call(this),
              this._listeners.push(
                Em("(min-width: 1040px)", (e) => {
                  this._wide = e;
                })
              ),
              this._listeners.push(
                Em("(min-width: 1296px)", (e) => {
                  this._wideSidebar = e;
                })
              ),
              this.style.setProperty(
                "--app-header-background-color",
                "var(--sidebar-background-color)"
              ),
              this.style.setProperty(
                "--app-header-text-color",
                "var(--sidebar-text-color)"
              ),
              this.style.setProperty(
                "--app-header-border-bottom",
                "1px solid var(--divider-color)"
              ),
              this.style.setProperty(
                "--ha-card-border-radius",
                "var(--ha-config-card-border-radius, 8px)"
              );
          },
        },
        {
          kind: "method",
          key: "disconnectedCallback",
          value: function () {
            for (
              r(t(i.prototype), "disconnectedCallback", this).call(this);
              this._listeners.length;

            )
              this._listeners.pop()();
          },
        },
        {
          kind: "method",
          key: "updatePageEl",
          value: function (e) {
            const t = this.route.path.replace("/", ""),
              o =
                "docked" === this.hass.dockedSidebar
                  ? this._wideSidebar
                  : this._wide;
            (e.hass = this.hass),
              (e.hacs = this.hacs),
              (e.route = this.route),
              (e.narrow = this.narrow),
              (e.isWide = o),
              (e.section = t);
          },
        },
        {
          kind: "field",
          key: "routerOptions",
          value: () => ({
            defaultPage: "entry",
            showLoading: !0,
            beforeRender: (e) =>
              ["_my_redirect", "entry", "explore", "repository"].includes(e)
                ? void 0
                : "entry",
            routes: {
              _my_redirect: {
                tag: "hacs-my-redirect",
                load: () => import("./c.d4cd630d.js"),
              },
              entry: {
                tag: "hacs-experimental-panel",
                load: () => import("./c.9afde0cb.js"),
              },
              explore: {
                tag: "hacs-experimental-panel",
                load: () => import("./c.9afde0cb.js"),
              },
              repository: {
                tag: "hacs-repository-panel",
                load: () => import("./c.b2d11fca.js"),
              },
            },
          }),
        },
      ],
    };
  },
  jm
);
const Bm = b`
  a {
    text-decoration: var(--hcv-text-decoration-link);
    color: var(--hcv-text-color-link);
  }
`,
  $m = b`
  ha-svg-icon {
    color: var(--hcv-color-icon);
  }
`,
  Fm = b`
  mwc-button[raised] {
    border-radius: 4px;
  }
  mwc-button[raised] > ha-circular-progress {
    --mdc-theme-primary: var(--hcv-text-color-primary);
  }
`,
  Um = b`
  *::-webkit-scrollbar {
    width: 0.4rem;
    height: 0.4rem;
  }

  *::-webkit-scrollbar-track {
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background: var(--scrollbar-thumb-color);
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--accent-color);
    border-radius: 0.3em;
  }
  .scroll {
    overflow-y: auto;
    scrollbar-color: var(--scrollbar-thumb-color) transparent;
    scrollbar-width: thin;
  }
`,
  Zm = b`
  .warning {
    color: var(--hcv-color-warning);
  }
  .pending_update {
    color: var(--hcv-color-update);
  }
  .pending_restart,
  .error,
  .uninstall {
    color: var(--hcv-color-error);
    --mdc-theme-primary: var(--hcv-color-error);
  }
  .header {
    opacity: var(--dark-primary-opacity);
    padding: 8px 0 4px 16px;
  }
`,
  Gm = [Te, $m, Zm, Bm, Fm],
  qm = b`
  :host {
    --hcv-color-error: var(--hacs-error-color, var(--error-color));
    --hcv-color-warning: var(--hacs-warning-color, var(--warning-color));
    --hcv-color-update: var(--hacs-update-color, var(--info-color));
    --hcv-color-new: var(--hacs-new-color, var(--success-color));
    --hcv-color-icon: var(--hacs-default-icon-color, var(--primary-text-color));

    --hcv-color-markdown-background: var(--markdown-code-background-color, #f6f8fa);

    --hcv-text-color-primary: var(--primary-text-color);
    --hcv-text-color-on-background: var(--text-primary-color);
    --hcv-text-color-secondary: var(--secondary-text-color);
    --hcv-text-color-link: var(--link-text-color, var(--accent-color));

    --mdc-dialog-heading-ink-color: var(--hcv-text-color-primary);
    --mdc-dialog-content-ink-color: var(--hcv-text-color-primary);

    /*hacs-link*/
    --hcv-text-decoration-link: var(--hacs-link-text-decoration, none);
  }
`;
s(
  [be("hacs-frontend")],
  function (e, o) {
    class i extends o {
      constructor(...t) {
        super(...t), e(this);
      }
    }
    return {
      F: i,
      d: [
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "narrow",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Ce({ attribute: !1 })],
          key: "route",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Le("#hacs-dialog")],
          key: "_hacsDialog",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [Le("#hacs-dialog-secondary")],
          key: "_hacsDialogSecondary",
          value: void 0,
        },
        {
          kind: "method",
          key: "firstUpdated",
          value: function (e) {
            r(t(i.prototype), "firstUpdated", this).call(this, e),
              this._applyTheme(),
              (this.hacs.language = this.hass.language),
              this.addEventListener("hacs-location-changed", (e) =>
                this._setRoute(e)
              ),
              this.addEventListener("hacs-dialog", (e) => this._showDialog(e)),
              this.addEventListener("hacs-dialog-secondary", (e) =>
                this._showDialogSecondary(e)
              ),
              Xu(
                this.hass,
                () => this._updateProperties("configuration"),
                zu.CONFIG
              ),
              Xu(this.hass, () => this._updateProperties("status"), zu.STATUS),
              Xu(this.hass, () => this._updateProperties("status"), zu.STAGE),
              Xu(
                this.hass,
                () => this._updateProperties("repositories"),
                zu.REPOSITORY
              ),
              this.hass.connection.subscribeEvents(
                async () => this._updateProperties("lovelace"),
                "lovelace_updated"
              ),
              this._updateProperties(),
              "" === this.route.path && xu("/hacs/entry", { replace: !0 }),
              window.addEventListener("haptic", (e) => {
                tt(window.parent, e.type, e.detail, { bubbles: !1 });
              }),
              document.body.addEventListener("click", (e) => {
                const t = ((e) => {
                  if (
                    e.defaultPrevented ||
                    0 !== e.button ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey
                  )
                    return;
                  const t = e.composedPath().find((e) => "A" === e.tagName);
                  if (
                    !t ||
                    t.target ||
                    t.hasAttribute("download") ||
                    "external" === t.getAttribute("rel")
                  )
                    return;
                  let o = t.href;
                  if (!o || -1 !== o.indexOf("mailto:")) return;
                  const r = window.location,
                    i = r.origin || r.protocol + "//" + r.host;
                  return 0 === o.indexOf(i) &&
                    ((o = o.substr(i.length)), "#" !== o)
                    ? (e.preventDefault(), o)
                    : void 0;
                })(e);
                t && xu(t);
              }),
              et.addEventListener("location-changed", (e) =>
                tt(this, e.type, e.detail, { bubbles: !1 })
              ),
              document.body.addEventListener("keydown", (e) => {
                e.ctrlKey ||
                  e.shiftKey ||
                  e.metaKey ||
                  e.altKey ||
                  (["c", "e"].includes(e.key) &&
                    tt(et, "hass-quick-bar-trigger", e, { bubbles: !1 }));
              }),
              et
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", (e) => this._applyTheme()),
              ((e, t) => {
                e.addEventListener("show-dialog", (o) => {
                  const {
                    dialogTag: r,
                    dialogImport: i,
                    dialogParams: a,
                    addHistory: n,
                  } = o.detail;
                  ku(e, t, r, a, i, n);
                });
              })(this, this.shadowRoot);
          },
        },
        {
          kind: "method",
          key: "updated",
          value: function (e) {
            r(t(i.prototype), "updated", this).call(this, e);
            const o = e.get("hass");
            o && o.themes !== this.hass.themes && this._applyTheme();
          },
        },
        {
          kind: "method",
          key: "_updateProperties",
          value: async function (e = "all") {
            const t = {},
              o = {};
            "all" === e
              ? ([o.repositories, o.info] = await Promise.all([
                  Du(this.hass),
                  Iu(this.hass),
                ]))
              : "info" === e
              ? (o.info = await Iu(this.hass))
              : "repositories" === e && (o.repositories = await Du(this.hass)),
              Object.keys(o).forEach((e) => {
                void 0 !== o[e] && (t[e] = o[e]);
              }),
              t && (this._updateHacs(t), this.requestUpdate());
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            var e, t;
            return this.hass &&
              null !== (e = this.hacs) &&
              void 0 !== e &&
              null !== (t = e.info.categories) &&
              void 0 !== t &&
              t.length
              ? Y`
      <hacs-router
        .hass=${this.hass}
        .hacs=${this.hacs}
        .route=${this.route}
        .narrow=${this.narrow}
      ></hacs-router>
      <hacs-event-dialog
        .hass=${this.hass}
        .hacs=${this.hacs}
        .route=${this.route}
        .narrow=${this.narrow}
        id="hacs-dialog"
      ></hacs-event-dialog>
      <hacs-event-dialog
        .hass=${this.hass}
        .hacs=${this.hacs}
        .route=${this.route}
        .narrow=${this.narrow}
        id="hacs-dialog-secondary"
      ></hacs-event-dialog>
    `
              : Y`<hass-loading-screen no-toolbar></hass-loading-screen>`;
          },
        },
        {
          kind: "get",
          static: !0,
          key: "styles",
          value: function () {
            return [
              Gm,
              qm,
              b`
        hass-loading-screen {
          height: 100vh;
        }
      `,
            ];
          },
        },
        {
          kind: "method",
          key: "_showDialog",
          value: function (e) {
            const t = e.detail;
            (this._hacsDialog.active = !0),
              (this._hacsDialog.params = t),
              this.addEventListener(
                "hacs-dialog-closed",
                () => (this._hacsDialog.active = !1)
              );
          },
        },
        {
          kind: "method",
          key: "_showDialogSecondary",
          value: function (e) {
            const t = e.detail;
            (this._hacsDialogSecondary.active = !0),
              (this._hacsDialogSecondary.secondary = !0),
              (this._hacsDialogSecondary.params = t),
              this.addEventListener(
                "hacs-secondary-dialog-closed",
                () => (this._hacsDialogSecondary.active = !1)
              );
          },
        },
        {
          kind: "method",
          key: "_setRoute",
          value: function (e) {
            var t;
            null !== (t = e.detail) &&
              void 0 !== t &&
              t.route &&
              ((this.route = e.detail.route),
              xu(this.route.path, { replace: !0 }),
              this.requestUpdate());
          },
        },
        {
          kind: "method",
          key: "_applyTheme",
          value: function () {
            var e;
            We(
              this.parentElement,
              this.hass.themes,
              (null === (e = this.hass.selectedTheme) || void 0 === e
                ? void 0
                : e.theme) ||
                (this.hass.themes.darkMode &&
                this.hass.themes.default_dark_theme
                  ? this.hass.themes.default_dark_theme
                  : this.hass.themes.default_theme),
              { ...this.hass.selectedTheme, dark: this.hass.themes.darkMode }
            ),
              (this.parentElement.style.backgroundColor =
                "var(--primary-background-color)"),
              (this.parentElement.style.color = "var(--primary-text-color)");
          },
        },
      ],
    };
  },
  xm
);
export {
  $i as $,
  Vn as A,
  eu as B,
  In as C,
  qp as D,
  r as E,
  Vu as F,
  t as G,
  Nu as H,
  yl as I,
  tt as J,
  kd as K,
  es as L,
  tu as M,
  Qn as N,
  ul as O,
  On as P,
  Nn as Q,
  hu as R,
  e as S,
  Tn as T,
  J as U,
  za as V,
  sn as W,
  Aa as X,
  er as Y,
  ln as Z,
  s as _,
  zu as a,
  tl as a$,
  $d as a0,
  Bd as a1,
  y as a2,
  Pn as a3,
  we as a4,
  Om as a5,
  Fl as a6,
  $l as a7,
  Oe as a8,
  Zp as a9,
  Kl as aA,
  uc as aB,
  Te as aC,
  zl as aD,
  cs as aE,
  Fu as aF,
  vc as aG,
  Sd as aH,
  Jn as aI,
  Yu as aJ,
  ju as aK,
  xl as aL,
  Fn as aM,
  ls as aN,
  Jc as aO,
  Bl as aP,
  Il as aQ,
  $n as aR,
  dp as aS,
  pd as aT,
  lc as aU,
  sc as aV,
  Vc as aW,
  Al as aX,
  up as aY,
  bc as aZ,
  ns as a_,
  Up as aa,
  ue as ab,
  W as ac,
  wu as ad,
  xu as ae,
  et as af,
  Qu as ag,
  Gu as ah,
  Ju as ai,
  Ku as aj,
  qu as ak,
  $u as al,
  co as am,
  di as an,
  dr as ao,
  pi as ap,
  zd as aq,
  ss as ar,
  ms as as,
  Ne as at,
  Gl as au,
  md as av,
  hd as aw,
  ec as ax,
  Zu as ay,
  Vd as az,
  Uu as b,
  Sl as b$,
  Ol as b0,
  gd as b1,
  Rc as b2,
  hl as b3,
  ts as b4,
  dd as b5,
  oc as b6,
  Wc as b7,
  rc as b8,
  Pp as b9,
  Ul as bA,
  _d as bB,
  fd as bC,
  Cd as bD,
  Ld as bE,
  ud as bF,
  el as bG,
  yc as bH,
  od as bI,
  td as bJ,
  Ed as bK,
  Id as bL,
  wl as bM,
  Fs as bN,
  Wl as bO,
  rs as bP,
  Cc as bQ,
  kc as bR,
  Ws as bS,
  Ip as bT,
  Cl as bU,
  Lc as bV,
  sp as bW,
  vp as bX,
  Xl as bY,
  qd as bZ,
  Gd as b_,
  gl as ba,
  Hd as bb,
  jd as bc,
  Jl as bd,
  Ac as be,
  Vl as bf,
  sl as bg,
  cc as bh,
  ep as bi,
  Dl as bj,
  Qs as bk,
  Dd as bl,
  vd as bm,
  tp as bn,
  tc as bo,
  gs as bp,
  Rp as bq,
  Ll as br,
  Ys as bs,
  qn as bt,
  wc as bu,
  fp as bv,
  lp as bw,
  Hl as bx,
  Ud as by,
  kl as bz,
  Gm as c,
  Bc as c$,
  us as c0,
  fc as c1,
  Pd as c2,
  zc as c3,
  Fd as c4,
  bp as c5,
  Xs as c6,
  ol as c7,
  Zd as c8,
  os as c9,
  Pc as cA,
  gc as cB,
  pl as cC,
  jp as cD,
  Bp as cE,
  Ml as cF,
  _p as cG,
  ic as cH,
  nc as cI,
  Qd as cJ,
  Wd as cK,
  Qc as cL,
  Ad as cM,
  bd as cN,
  _c as cO,
  mc as cP,
  Yc as cQ,
  Xc as cR,
  Yd as cS,
  Kd as cT,
  yp as cU,
  gp as cV,
  Td as cW,
  Rd as cX,
  Js as cY,
  Yl as cZ,
  jc as c_,
  Mp as ca,
  cd as cb,
  Dp as cc,
  Kc as cd,
  fl as ce,
  zp as cf,
  Vp as cg,
  Lp as ch,
  Cp as ci,
  Ap as cj,
  Hp as ck,
  wp as cl,
  kp as cm,
  xp as cn,
  Sp as co,
  Ep as cp,
  Tp as cq,
  Op as cr,
  xc as cs,
  Oc as ct,
  Us as cu,
  Nc as cv,
  Mc as cw,
  Tc as cx,
  Ec as cy,
  Sc as cz,
  b as d,
  Uc as d$,
  ll as d0,
  Wn as d1,
  id as d2,
  ad as d3,
  Nl as d4,
  Rl as d5,
  vl as d6,
  cl as d7,
  $c as d8,
  Ic as d9,
  Cs as dA,
  As as dB,
  Hs as dC,
  ws as dD,
  Ls as dE,
  Vs as dF,
  ks as dG,
  Es as dH,
  Ps as dI,
  Ts as dJ,
  Os as dK,
  Ns as dL,
  Rs as dM,
  zs as dN,
  Is as dO,
  Ds as dP,
  ac as dQ,
  nl as dR,
  cp as dS,
  pp as dT,
  rl as dU,
  al as dV,
  il as dW,
  op as dX,
  ip as dY,
  ap as dZ,
  np as d_,
  Dc as da,
  ys as db,
  Ss as dc,
  Bs as dd,
  ds as de,
  _s as df,
  Gs as dg,
  Zs as dh,
  El as di,
  Pl as dj,
  as as dk,
  hs as dl,
  Fp as dm,
  $p as dn,
  ml as dp,
  _l as dq,
  ld as dr,
  nd as ds,
  sd as dt,
  Ms as du,
  $s as dv,
  js as dw,
  xs as dx,
  bs as dy,
  vs as dz,
  Ce as e,
  Zc as e0,
  Gc as e1,
  qc as e2,
  Nd as e3,
  Od as e4,
  dl as e5,
  bl as e6,
  Yn as e7,
  Kn as e8,
  Md as e9,
  ha as eA,
  en as eB,
  M as eC,
  De as eD,
  Ie as eE,
  Zl as eF,
  Fc as eG,
  hp as eH,
  En as eI,
  Pe as eJ,
  fs as eK,
  ed as eL,
  ps as eM,
  Jp as eN,
  mp as eO,
  xd as ea,
  Ks as eb,
  qs as ec,
  Un as ed,
  Hc as ee,
  yd as ef,
  Xn as eg,
  is as eh,
  Zn as ei,
  rp as ej,
  Gn as ek,
  Ql as el,
  rd as em,
  jl as en,
  wd as eo,
  Xd as ep,
  Jd as eq,
  pc as er,
  hc as es,
  ql as et,
  Np as eu,
  dc as ev,
  bu as ew,
  me as ex,
  g as ey,
  Mo as ez,
  wn as f,
  Du as g,
  Ve as h,
  Le as i,
  ge as j,
  Rn as k,
  xe as l,
  Tl as m,
  be as n,
  He as o,
  zn as p,
  Gp as q,
  Bu as r,
  Um as s,
  Ae as t,
  Qp as u,
  Wp as v,
  Xu as w,
  An as x,
  Y as y,
  Hn as z,
};
