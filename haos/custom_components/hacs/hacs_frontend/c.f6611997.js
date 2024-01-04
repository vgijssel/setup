import { c as e, a as n, u as t, g as r } from "./c.743a15a1.js";
import { $ as o } from "./main-ad130be7.js";
import "./c.5d3ce9d6.js";
var a = e(function (e, n) {
    e.exports = (function () {
      function e(n) {
        return (
          (e =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          e(n)
        );
      }
      function n(e, t) {
        return (
          (n =
            Object.setPrototypeOf ||
            function (e, n) {
              return (e.__proto__ = n), e;
            }),
          n(e, t)
        );
      }
      function t() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return (
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {})
            ),
            !0
          );
        } catch (e) {
          return !1;
        }
      }
      function r(e, o, a) {
        return (
          (r = t()
            ? Reflect.construct
            : function (e, t, r) {
                var o = [null];
                o.push.apply(o, t);
                var a = new (Function.bind.apply(e, o))();
                return r && n(a, r.prototype), a;
              }),
          r.apply(null, arguments)
        );
      }
      function o(e) {
        return a(e) || i(e) || s(e) || u();
      }
      function a(e) {
        if (Array.isArray(e)) return l(e);
      }
      function i(e) {
        if (
          ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
          null != e["@@iterator"]
        )
          return Array.from(e);
      }
      function s(e, n) {
        if (e) {
          if ("string" == typeof e) return l(e, n);
          var t = Object.prototype.toString.call(e).slice(8, -1);
          return (
            "Object" === t && e.constructor && (t = e.constructor.name),
            "Map" === t || "Set" === t
              ? Array.from(e)
              : "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              ? l(e, n)
              : void 0
          );
        }
      }
      function l(e, n) {
        (null == n || n > e.length) && (n = e.length);
        for (var t = 0, r = new Array(n); t < n; t++) r[t] = e[t];
        return r;
      }
      function u() {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      }
      var c = Object.hasOwnProperty,
        d = Object.setPrototypeOf,
        h = Object.isFrozen,
        p = Object.getPrototypeOf,
        m = Object.getOwnPropertyDescriptor,
        g = Object.freeze,
        _ = Object.seal,
        f = Object.create,
        b = "undefined" != typeof Reflect && Reflect,
        w = b.apply,
        k = b.construct;
      w ||
        (w = function (e, n, t) {
          return e.apply(n, t);
        }),
        g ||
          (g = function (e) {
            return e;
          }),
        _ ||
          (_ = function (e) {
            return e;
          }),
        k ||
          (k = function (e, n) {
            return r(e, o(n));
          });
      var y = S(Array.prototype.forEach),
        D = S(Array.prototype.pop),
        A = S(Array.prototype.push),
        x = S(String.prototype.toLowerCase),
        v = S(String.prototype.match),
        E = S(String.prototype.replace),
        C = S(String.prototype.indexOf),
        F = S(String.prototype.trim),
        B = S(RegExp.prototype.test),
        z = T(TypeError);
      function S(e) {
        return function (n) {
          for (
            var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), o = 1;
            o < t;
            o++
          )
            r[o - 1] = arguments[o];
          return w(e, n, r);
        };
      }
      function T(e) {
        return function () {
          for (var n = arguments.length, t = new Array(n), r = 0; r < n; r++)
            t[r] = arguments[r];
          return k(e, t);
        };
      }
      function N(e, n, t) {
        (t = t || x), d && d(e, null);
        for (var r = n.length; r--; ) {
          var o = n[r];
          if ("string" == typeof o) {
            var a = t(o);
            a !== o && (h(n) || (n[r] = a), (o = a));
          }
          e[o] = !0;
        }
        return e;
      }
      function O(e) {
        var n,
          t = f(null);
        for (n in e) w(c, e, [n]) && (t[n] = e[n]);
        return t;
      }
      function j(e, n) {
        for (; null !== e; ) {
          var t = m(e, n);
          if (t) {
            if (t.get) return S(t.get);
            if ("function" == typeof t.value) return S(t.value);
          }
          e = p(e);
        }
        function r(e) {
          return console.warn("fallback value for", e), null;
        }
        return r;
      }
      var R = g([
          "a",
          "abbr",
          "acronym",
          "address",
          "area",
          "article",
          "aside",
          "audio",
          "b",
          "bdi",
          "bdo",
          "big",
          "blink",
          "blockquote",
          "body",
          "br",
          "button",
          "canvas",
          "caption",
          "center",
          "cite",
          "code",
          "col",
          "colgroup",
          "content",
          "data",
          "datalist",
          "dd",
          "decorator",
          "del",
          "details",
          "dfn",
          "dialog",
          "dir",
          "div",
          "dl",
          "dt",
          "element",
          "em",
          "fieldset",
          "figcaption",
          "figure",
          "font",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "head",
          "header",
          "hgroup",
          "hr",
          "html",
          "i",
          "img",
          "input",
          "ins",
          "kbd",
          "label",
          "legend",
          "li",
          "main",
          "map",
          "mark",
          "marquee",
          "menu",
          "menuitem",
          "meter",
          "nav",
          "nobr",
          "ol",
          "optgroup",
          "option",
          "output",
          "p",
          "picture",
          "pre",
          "progress",
          "q",
          "rp",
          "rt",
          "ruby",
          "s",
          "samp",
          "section",
          "select",
          "shadow",
          "small",
          "source",
          "spacer",
          "span",
          "strike",
          "strong",
          "style",
          "sub",
          "summary",
          "sup",
          "table",
          "tbody",
          "td",
          "template",
          "textarea",
          "tfoot",
          "th",
          "thead",
          "time",
          "tr",
          "track",
          "tt",
          "u",
          "ul",
          "var",
          "video",
          "wbr",
        ]),
        M = g([
          "svg",
          "a",
          "altglyph",
          "altglyphdef",
          "altglyphitem",
          "animatecolor",
          "animatemotion",
          "animatetransform",
          "circle",
          "clippath",
          "defs",
          "desc",
          "ellipse",
          "filter",
          "font",
          "g",
          "glyph",
          "glyphref",
          "hkern",
          "image",
          "line",
          "lineargradient",
          "marker",
          "mask",
          "metadata",
          "mpath",
          "path",
          "pattern",
          "polygon",
          "polyline",
          "radialgradient",
          "rect",
          "stop",
          "style",
          "switch",
          "symbol",
          "text",
          "textpath",
          "title",
          "tref",
          "tspan",
          "view",
          "vkern",
        ]),
        I = g([
          "feBlend",
          "feColorMatrix",
          "feComponentTransfer",
          "feComposite",
          "feConvolveMatrix",
          "feDiffuseLighting",
          "feDisplacementMap",
          "feDistantLight",
          "feFlood",
          "feFuncA",
          "feFuncB",
          "feFuncG",
          "feFuncR",
          "feGaussianBlur",
          "feImage",
          "feMerge",
          "feMergeNode",
          "feMorphology",
          "feOffset",
          "fePointLight",
          "feSpecularLighting",
          "feSpotLight",
          "feTile",
          "feTurbulence",
        ]),
        L = g([
          "animate",
          "color-profile",
          "cursor",
          "discard",
          "fedropshadow",
          "font-face",
          "font-face-format",
          "font-face-name",
          "font-face-src",
          "font-face-uri",
          "foreignobject",
          "hatch",
          "hatchpath",
          "mesh",
          "meshgradient",
          "meshpatch",
          "meshrow",
          "missing-glyph",
          "script",
          "set",
          "solidcolor",
          "unknown",
          "use",
        ]),
        $ = g([
          "math",
          "menclose",
          "merror",
          "mfenced",
          "mfrac",
          "mglyph",
          "mi",
          "mlabeledtr",
          "mmultiscripts",
          "mn",
          "mo",
          "mover",
          "mpadded",
          "mphantom",
          "mroot",
          "mrow",
          "ms",
          "mspace",
          "msqrt",
          "mstyle",
          "msub",
          "msup",
          "msubsup",
          "mtable",
          "mtd",
          "mtext",
          "mtr",
          "munder",
          "munderover",
        ]),
        U = g([
          "maction",
          "maligngroup",
          "malignmark",
          "mlongdiv",
          "mscarries",
          "mscarry",
          "msgroup",
          "mstack",
          "msline",
          "msrow",
          "semantics",
          "annotation",
          "annotation-xml",
          "mprescripts",
          "none",
        ]),
        P = g(["#text"]),
        q = g([
          "accept",
          "action",
          "align",
          "alt",
          "autocapitalize",
          "autocomplete",
          "autopictureinpicture",
          "autoplay",
          "background",
          "bgcolor",
          "border",
          "capture",
          "cellpadding",
          "cellspacing",
          "checked",
          "cite",
          "class",
          "clear",
          "color",
          "cols",
          "colspan",
          "controls",
          "controlslist",
          "coords",
          "crossorigin",
          "datetime",
          "decoding",
          "default",
          "dir",
          "disabled",
          "disablepictureinpicture",
          "disableremoteplayback",
          "download",
          "draggable",
          "enctype",
          "enterkeyhint",
          "face",
          "for",
          "headers",
          "height",
          "hidden",
          "high",
          "href",
          "hreflang",
          "id",
          "inputmode",
          "integrity",
          "ismap",
          "kind",
          "label",
          "lang",
          "list",
          "loading",
          "loop",
          "low",
          "max",
          "maxlength",
          "media",
          "method",
          "min",
          "minlength",
          "multiple",
          "muted",
          "name",
          "nonce",
          "noshade",
          "novalidate",
          "nowrap",
          "open",
          "optimum",
          "pattern",
          "placeholder",
          "playsinline",
          "poster",
          "preload",
          "pubdate",
          "radiogroup",
          "readonly",
          "rel",
          "required",
          "rev",
          "reversed",
          "role",
          "rows",
          "rowspan",
          "spellcheck",
          "scope",
          "selected",
          "shape",
          "size",
          "sizes",
          "span",
          "srclang",
          "start",
          "src",
          "srcset",
          "step",
          "style",
          "summary",
          "tabindex",
          "title",
          "translate",
          "type",
          "usemap",
          "valign",
          "value",
          "width",
          "xmlns",
          "slot",
        ]),
        H = g([
          "accent-height",
          "accumulate",
          "additive",
          "alignment-baseline",
          "ascent",
          "attributename",
          "attributetype",
          "azimuth",
          "basefrequency",
          "baseline-shift",
          "begin",
          "bias",
          "by",
          "class",
          "clip",
          "clippathunits",
          "clip-path",
          "clip-rule",
          "color",
          "color-interpolation",
          "color-interpolation-filters",
          "color-profile",
          "color-rendering",
          "cx",
          "cy",
          "d",
          "dx",
          "dy",
          "diffuseconstant",
          "direction",
          "display",
          "divisor",
          "dur",
          "edgemode",
          "elevation",
          "end",
          "fill",
          "fill-opacity",
          "fill-rule",
          "filter",
          "filterunits",
          "flood-color",
          "flood-opacity",
          "font-family",
          "font-size",
          "font-size-adjust",
          "font-stretch",
          "font-style",
          "font-variant",
          "font-weight",
          "fx",
          "fy",
          "g1",
          "g2",
          "glyph-name",
          "glyphref",
          "gradientunits",
          "gradienttransform",
          "height",
          "href",
          "id",
          "image-rendering",
          "in",
          "in2",
          "k",
          "k1",
          "k2",
          "k3",
          "k4",
          "kerning",
          "keypoints",
          "keysplines",
          "keytimes",
          "lang",
          "lengthadjust",
          "letter-spacing",
          "kernelmatrix",
          "kernelunitlength",
          "lighting-color",
          "local",
          "marker-end",
          "marker-mid",
          "marker-start",
          "markerheight",
          "markerunits",
          "markerwidth",
          "maskcontentunits",
          "maskunits",
          "max",
          "mask",
          "media",
          "method",
          "mode",
          "min",
          "name",
          "numoctaves",
          "offset",
          "operator",
          "opacity",
          "order",
          "orient",
          "orientation",
          "origin",
          "overflow",
          "paint-order",
          "path",
          "pathlength",
          "patterncontentunits",
          "patterntransform",
          "patternunits",
          "points",
          "preservealpha",
          "preserveaspectratio",
          "primitiveunits",
          "r",
          "rx",
          "ry",
          "radius",
          "refx",
          "refy",
          "repeatcount",
          "repeatdur",
          "restart",
          "result",
          "rotate",
          "scale",
          "seed",
          "shape-rendering",
          "specularconstant",
          "specularexponent",
          "spreadmethod",
          "startoffset",
          "stddeviation",
          "stitchtiles",
          "stop-color",
          "stop-opacity",
          "stroke-dasharray",
          "stroke-dashoffset",
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-miterlimit",
          "stroke-opacity",
          "stroke",
          "stroke-width",
          "style",
          "surfacescale",
          "systemlanguage",
          "tabindex",
          "targetx",
          "targety",
          "transform",
          "transform-origin",
          "text-anchor",
          "text-decoration",
          "text-rendering",
          "textlength",
          "type",
          "u1",
          "u2",
          "unicode",
          "values",
          "viewbox",
          "visibility",
          "version",
          "vert-adv-y",
          "vert-origin-x",
          "vert-origin-y",
          "width",
          "word-spacing",
          "wrap",
          "writing-mode",
          "xchannelselector",
          "ychannelselector",
          "x",
          "x1",
          "x2",
          "xmlns",
          "y",
          "y1",
          "y2",
          "z",
          "zoomandpan",
        ]),
        Z = g([
          "accent",
          "accentunder",
          "align",
          "bevelled",
          "close",
          "columnsalign",
          "columnlines",
          "columnspan",
          "denomalign",
          "depth",
          "dir",
          "display",
          "displaystyle",
          "encoding",
          "fence",
          "frame",
          "height",
          "href",
          "id",
          "largeop",
          "length",
          "linethickness",
          "lspace",
          "lquote",
          "mathbackground",
          "mathcolor",
          "mathsize",
          "mathvariant",
          "maxsize",
          "minsize",
          "movablelimits",
          "notation",
          "numalign",
          "open",
          "rowalign",
          "rowlines",
          "rowspacing",
          "rowspan",
          "rspace",
          "rquote",
          "scriptlevel",
          "scriptminsize",
          "scriptsizemultiplier",
          "selection",
          "separator",
          "separators",
          "stretchy",
          "subscriptshift",
          "supscriptshift",
          "symmetric",
          "voffset",
          "width",
          "xmlns",
        ]),
        G = g([
          "xlink:href",
          "xml:id",
          "xlink:title",
          "xml:space",
          "xmlns:xlink",
        ]),
        W = _(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
        Q = _(/<%[\w\W]*|[\w\W]*%>/gm),
        Y = _(/^data-[\-\w.\u00B7-\uFFFF]/),
        K = _(/^aria-[\-\w]+$/),
        X = _(
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        ),
        J = _(/^(?:\w+script|data):/i),
        V = _(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
        ee = _(/^html$/i),
        ne = function () {
          return "undefined" == typeof window ? null : window;
        },
        te = function (n, t) {
          if ("object" !== e(n) || "function" != typeof n.createPolicy)
            return null;
          var r = null,
            o = "data-tt-policy-suffix";
          t.currentScript &&
            t.currentScript.hasAttribute(o) &&
            (r = t.currentScript.getAttribute(o));
          var a = "dompurify" + (r ? "#" + r : "");
          try {
            return n.createPolicy(a, {
              createHTML: function (e) {
                return e;
              },
              createScriptURL: function (e) {
                return e;
              },
            });
          } catch (e) {
            return (
              console.warn(
                "TrustedTypes policy " + a + " could not be created."
              ),
              null
            );
          }
        };
      function re() {
        var n =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : ne(),
          t = function (e) {
            return re(e);
          };
        if (
          ((t.version = "2.4.0"),
          (t.removed = []),
          !n || !n.document || 9 !== n.document.nodeType)
        )
          return (t.isSupported = !1), t;
        var r = n.document,
          a = n.document,
          i = n.DocumentFragment,
          s = n.HTMLTemplateElement,
          l = n.Node,
          u = n.Element,
          c = n.NodeFilter,
          d = n.NamedNodeMap,
          h = void 0 === d ? n.NamedNodeMap || n.MozNamedAttrMap : d,
          p = n.HTMLFormElement,
          m = n.DOMParser,
          _ = n.trustedTypes,
          f = u.prototype,
          b = j(f, "cloneNode"),
          w = j(f, "nextSibling"),
          k = j(f, "childNodes"),
          S = j(f, "parentNode");
        if ("function" == typeof s) {
          var T = a.createElement("template");
          T.content && T.content.ownerDocument && (a = T.content.ownerDocument);
        }
        var oe = te(_, r),
          ae = oe ? oe.createHTML("") : "",
          ie = a,
          se = ie.implementation,
          le = ie.createNodeIterator,
          ue = ie.createDocumentFragment,
          ce = ie.getElementsByTagName,
          de = r.importNode,
          he = {};
        try {
          he = O(a).documentMode ? a.documentMode : {};
        } catch (e) {}
        var pe = {};
        t.isSupported =
          "function" == typeof S &&
          se &&
          void 0 !== se.createHTMLDocument &&
          9 !== he;
        var me,
          ge,
          _e = W,
          fe = Q,
          be = Y,
          we = K,
          ke = J,
          ye = V,
          De = X,
          Ae = null,
          xe = N({}, [].concat(o(R), o(M), o(I), o($), o(P))),
          ve = null,
          Ee = N({}, [].concat(o(q), o(H), o(Z), o(G))),
          Ce = Object.seal(
            Object.create(null, {
              tagNameCheck: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: null,
              },
              attributeNameCheck: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: null,
              },
              allowCustomizedBuiltInElements: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: !1,
              },
            })
          ),
          Fe = null,
          Be = null,
          ze = !0,
          Se = !0,
          Te = !1,
          Ne = !1,
          Oe = !1,
          je = !1,
          Re = !1,
          Me = !1,
          Ie = !1,
          Le = !1,
          $e = !0,
          Ue = !1,
          Pe = "user-content-",
          qe = !0,
          He = !1,
          Ze = {},
          Ge = null,
          We = N({}, [
            "annotation-xml",
            "audio",
            "colgroup",
            "desc",
            "foreignobject",
            "head",
            "iframe",
            "math",
            "mi",
            "mn",
            "mo",
            "ms",
            "mtext",
            "noembed",
            "noframes",
            "noscript",
            "plaintext",
            "script",
            "style",
            "svg",
            "template",
            "thead",
            "title",
            "video",
            "xmp",
          ]),
          Qe = null,
          Ye = N({}, ["audio", "video", "img", "source", "image", "track"]),
          Ke = null,
          Xe = N({}, [
            "alt",
            "class",
            "for",
            "id",
            "label",
            "name",
            "pattern",
            "placeholder",
            "role",
            "summary",
            "title",
            "value",
            "style",
            "xmlns",
          ]),
          Je = "http://www.w3.org/1998/Math/MathML",
          Ve = "http://www.w3.org/2000/svg",
          en = "http://www.w3.org/1999/xhtml",
          nn = en,
          tn = !1,
          rn = ["application/xhtml+xml", "text/html"],
          on = "text/html",
          an = null,
          sn = a.createElement("form"),
          ln = function (e) {
            return e instanceof RegExp || e instanceof Function;
          },
          un = function (n) {
            (an && an === n) ||
              ((n && "object" === e(n)) || (n = {}),
              (n = O(n)),
              (me = me =
                -1 === rn.indexOf(n.PARSER_MEDIA_TYPE)
                  ? on
                  : n.PARSER_MEDIA_TYPE),
              (ge =
                "application/xhtml+xml" === me
                  ? function (e) {
                      return e;
                    }
                  : x),
              (Ae = "ALLOWED_TAGS" in n ? N({}, n.ALLOWED_TAGS, ge) : xe),
              (ve = "ALLOWED_ATTR" in n ? N({}, n.ALLOWED_ATTR, ge) : Ee),
              (Ke =
                "ADD_URI_SAFE_ATTR" in n
                  ? N(O(Xe), n.ADD_URI_SAFE_ATTR, ge)
                  : Xe),
              (Qe =
                "ADD_DATA_URI_TAGS" in n
                  ? N(O(Ye), n.ADD_DATA_URI_TAGS, ge)
                  : Ye),
              (Ge = "FORBID_CONTENTS" in n ? N({}, n.FORBID_CONTENTS, ge) : We),
              (Fe = "FORBID_TAGS" in n ? N({}, n.FORBID_TAGS, ge) : {}),
              (Be = "FORBID_ATTR" in n ? N({}, n.FORBID_ATTR, ge) : {}),
              (Ze = "USE_PROFILES" in n && n.USE_PROFILES),
              (ze = !1 !== n.ALLOW_ARIA_ATTR),
              (Se = !1 !== n.ALLOW_DATA_ATTR),
              (Te = n.ALLOW_UNKNOWN_PROTOCOLS || !1),
              (Ne = n.SAFE_FOR_TEMPLATES || !1),
              (Oe = n.WHOLE_DOCUMENT || !1),
              (Me = n.RETURN_DOM || !1),
              (Ie = n.RETURN_DOM_FRAGMENT || !1),
              (Le = n.RETURN_TRUSTED_TYPE || !1),
              (Re = n.FORCE_BODY || !1),
              ($e = !1 !== n.SANITIZE_DOM),
              (Ue = n.SANITIZE_NAMED_PROPS || !1),
              (qe = !1 !== n.KEEP_CONTENT),
              (He = n.IN_PLACE || !1),
              (De = n.ALLOWED_URI_REGEXP || De),
              (nn = n.NAMESPACE || en),
              n.CUSTOM_ELEMENT_HANDLING &&
                ln(n.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
                (Ce.tagNameCheck = n.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
              n.CUSTOM_ELEMENT_HANDLING &&
                ln(n.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
                (Ce.attributeNameCheck =
                  n.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
              n.CUSTOM_ELEMENT_HANDLING &&
                "boolean" ==
                  typeof n.CUSTOM_ELEMENT_HANDLING
                    .allowCustomizedBuiltInElements &&
                (Ce.allowCustomizedBuiltInElements =
                  n.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
              Ne && (Se = !1),
              Ie && (Me = !0),
              Ze &&
                ((Ae = N({}, o(P))),
                (ve = []),
                !0 === Ze.html && (N(Ae, R), N(ve, q)),
                !0 === Ze.svg && (N(Ae, M), N(ve, H), N(ve, G)),
                !0 === Ze.svgFilters && (N(Ae, I), N(ve, H), N(ve, G)),
                !0 === Ze.mathMl && (N(Ae, $), N(ve, Z), N(ve, G))),
              n.ADD_TAGS && (Ae === xe && (Ae = O(Ae)), N(Ae, n.ADD_TAGS, ge)),
              n.ADD_ATTR && (ve === Ee && (ve = O(ve)), N(ve, n.ADD_ATTR, ge)),
              n.ADD_URI_SAFE_ATTR && N(Ke, n.ADD_URI_SAFE_ATTR, ge),
              n.FORBID_CONTENTS &&
                (Ge === We && (Ge = O(Ge)), N(Ge, n.FORBID_CONTENTS, ge)),
              qe && (Ae["#text"] = !0),
              Oe && N(Ae, ["html", "head", "body"]),
              Ae.table && (N(Ae, ["tbody"]), delete Fe.tbody),
              g && g(n),
              (an = n));
          },
          cn = N({}, ["mi", "mo", "mn", "ms", "mtext"]),
          dn = N({}, ["foreignobject", "desc", "title", "annotation-xml"]),
          hn = N({}, ["title", "style", "font", "a", "script"]),
          pn = N({}, M);
        N(pn, I), N(pn, L);
        var mn = N({}, $);
        N(mn, U);
        var gn = function (e) {
            var n = S(e);
            (n && n.tagName) || (n = { namespaceURI: en, tagName: "template" });
            var t = x(e.tagName),
              r = x(n.tagName);
            return e.namespaceURI === Ve
              ? n.namespaceURI === en
                ? "svg" === t
                : n.namespaceURI === Je
                ? "svg" === t && ("annotation-xml" === r || cn[r])
                : Boolean(pn[t])
              : e.namespaceURI === Je
              ? n.namespaceURI === en
                ? "math" === t
                : n.namespaceURI === Ve
                ? "math" === t && dn[r]
                : Boolean(mn[t])
              : e.namespaceURI === en &&
                !(n.namespaceURI === Ve && !dn[r]) &&
                !(n.namespaceURI === Je && !cn[r]) &&
                !mn[t] &&
                (hn[t] || !pn[t]);
          },
          _n = function (e) {
            A(t.removed, { element: e });
            try {
              e.parentNode.removeChild(e);
            } catch (n) {
              try {
                e.outerHTML = ae;
              } catch (n) {
                e.remove();
              }
            }
          },
          fn = function (e, n) {
            try {
              A(t.removed, { attribute: n.getAttributeNode(e), from: n });
            } catch (e) {
              A(t.removed, { attribute: null, from: n });
            }
            if ((n.removeAttribute(e), "is" === e && !ve[e]))
              if (Me || Ie)
                try {
                  _n(n);
                } catch (e) {}
              else
                try {
                  n.setAttribute(e, "");
                } catch (e) {}
          },
          bn = function (e) {
            var n, t;
            if (Re) e = "<remove></remove>" + e;
            else {
              var r = v(e, /^[\r\n\t ]+/);
              t = r && r[0];
            }
            "application/xhtml+xml" === me &&
              (e =
                '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
                e +
                "</body></html>");
            var o = oe ? oe.createHTML(e) : e;
            if (nn === en)
              try {
                n = new m().parseFromString(o, me);
              } catch (e) {}
            if (!n || !n.documentElement) {
              n = se.createDocument(nn, "template", null);
              try {
                n.documentElement.innerHTML = tn ? "" : o;
              } catch (e) {}
            }
            var i = n.body || n.documentElement;
            return (
              e &&
                t &&
                i.insertBefore(a.createTextNode(t), i.childNodes[0] || null),
              nn === en
                ? ce.call(n, Oe ? "html" : "body")[0]
                : Oe
                ? n.documentElement
                : i
            );
          },
          wn = function (e) {
            return le.call(
              e.ownerDocument || e,
              e,
              c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT,
              null,
              !1
            );
          },
          kn = function (e) {
            return (
              e instanceof p &&
              ("string" != typeof e.nodeName ||
                "string" != typeof e.textContent ||
                "function" != typeof e.removeChild ||
                !(e.attributes instanceof h) ||
                "function" != typeof e.removeAttribute ||
                "function" != typeof e.setAttribute ||
                "string" != typeof e.namespaceURI ||
                "function" != typeof e.insertBefore)
            );
          },
          yn = function (n) {
            return "object" === e(l)
              ? n instanceof l
              : n &&
                  "object" === e(n) &&
                  "number" == typeof n.nodeType &&
                  "string" == typeof n.nodeName;
          },
          Dn = function (e, n, r) {
            pe[e] &&
              y(pe[e], function (e) {
                e.call(t, n, r, an);
              });
          },
          An = function (e) {
            var n;
            if ((Dn("beforeSanitizeElements", e, null), kn(e)))
              return _n(e), !0;
            if (B(/[\u0080-\uFFFF]/, e.nodeName)) return _n(e), !0;
            var r = ge(e.nodeName);
            if (
              (Dn("uponSanitizeElement", e, { tagName: r, allowedTags: Ae }),
              e.hasChildNodes() &&
                !yn(e.firstElementChild) &&
                (!yn(e.content) || !yn(e.content.firstElementChild)) &&
                B(/<[/\w]/g, e.innerHTML) &&
                B(/<[/\w]/g, e.textContent))
            )
              return _n(e), !0;
            if ("select" === r && B(/<template/i, e.innerHTML))
              return _n(e), !0;
            if (!Ae[r] || Fe[r]) {
              if (!Fe[r] && vn(r)) {
                if (Ce.tagNameCheck instanceof RegExp && B(Ce.tagNameCheck, r))
                  return !1;
                if (Ce.tagNameCheck instanceof Function && Ce.tagNameCheck(r))
                  return !1;
              }
              if (qe && !Ge[r]) {
                var o = S(e) || e.parentNode,
                  a = k(e) || e.childNodes;
                if (a && o)
                  for (var i = a.length - 1; i >= 0; --i)
                    o.insertBefore(b(a[i], !0), w(e));
              }
              return _n(e), !0;
            }
            return e instanceof u && !gn(e)
              ? (_n(e), !0)
              : ("noscript" !== r && "noembed" !== r) ||
                !B(/<\/no(script|embed)/i, e.innerHTML)
              ? (Ne &&
                  3 === e.nodeType &&
                  ((n = e.textContent),
                  (n = E(n, _e, " ")),
                  (n = E(n, fe, " ")),
                  e.textContent !== n &&
                    (A(t.removed, { element: e.cloneNode() }),
                    (e.textContent = n))),
                Dn("afterSanitizeElements", e, null),
                !1)
              : (_n(e), !0);
          },
          xn = function (e, n, t) {
            if ($e && ("id" === n || "name" === n) && (t in a || t in sn))
              return !1;
            if (Se && !Be[n] && B(be, n));
            else if (ze && B(we, n));
            else if (!ve[n] || Be[n]) {
              if (
                !(
                  (vn(e) &&
                    ((Ce.tagNameCheck instanceof RegExp &&
                      B(Ce.tagNameCheck, e)) ||
                      (Ce.tagNameCheck instanceof Function &&
                        Ce.tagNameCheck(e))) &&
                    ((Ce.attributeNameCheck instanceof RegExp &&
                      B(Ce.attributeNameCheck, n)) ||
                      (Ce.attributeNameCheck instanceof Function &&
                        Ce.attributeNameCheck(n)))) ||
                  ("is" === n &&
                    Ce.allowCustomizedBuiltInElements &&
                    ((Ce.tagNameCheck instanceof RegExp &&
                      B(Ce.tagNameCheck, t)) ||
                      (Ce.tagNameCheck instanceof Function &&
                        Ce.tagNameCheck(t))))
                )
              )
                return !1;
            } else if (Ke[n]);
            else if (B(De, E(t, ye, "")));
            else if (
              ("src" !== n && "xlink:href" !== n && "href" !== n) ||
              "script" === e ||
              0 !== C(t, "data:") ||
              !Qe[e]
            )
              if (Te && !B(ke, E(t, ye, "")));
              else if (t) return !1;
            return !0;
          },
          vn = function (e) {
            return e.indexOf("-") > 0;
          },
          En = function (n) {
            var r, o, a, i;
            Dn("beforeSanitizeAttributes", n, null);
            var s = n.attributes;
            if (s) {
              var l = {
                attrName: "",
                attrValue: "",
                keepAttr: !0,
                allowedAttributes: ve,
              };
              for (i = s.length; i--; ) {
                var u = (r = s[i]),
                  c = u.name,
                  d = u.namespaceURI;
                if (
                  ((o = "value" === c ? r.value : F(r.value)),
                  (a = ge(c)),
                  (l.attrName = a),
                  (l.attrValue = o),
                  (l.keepAttr = !0),
                  (l.forceKeepAttr = void 0),
                  Dn("uponSanitizeAttribute", n, l),
                  (o = l.attrValue),
                  !l.forceKeepAttr && (fn(c, n), l.keepAttr))
                )
                  if (B(/\/>/i, o)) fn(c, n);
                  else {
                    Ne && ((o = E(o, _e, " ")), (o = E(o, fe, " ")));
                    var h = ge(n.nodeName);
                    if (xn(h, a, o)) {
                      if (
                        (!Ue ||
                          ("id" !== a && "name" !== a) ||
                          (fn(c, n), (o = Pe + o)),
                        oe &&
                          "object" === e(_) &&
                          "function" == typeof _.getAttributeType)
                      )
                        if (d);
                        else
                          switch (_.getAttributeType(h, a)) {
                            case "TrustedHTML":
                              o = oe.createHTML(o);
                              break;
                            case "TrustedScriptURL":
                              o = oe.createScriptURL(o);
                          }
                      try {
                        d ? n.setAttributeNS(d, c, o) : n.setAttribute(c, o),
                          D(t.removed);
                      } catch (e) {}
                    }
                  }
              }
              Dn("afterSanitizeAttributes", n, null);
            }
          },
          Cn = function e(n) {
            var t,
              r = wn(n);
            for (Dn("beforeSanitizeShadowDOM", n, null); (t = r.nextNode()); )
              Dn("uponSanitizeShadowNode", t, null),
                An(t) || (t.content instanceof i && e(t.content), En(t));
            Dn("afterSanitizeShadowDOM", n, null);
          };
        return (
          (t.sanitize = function (o) {
            var a,
              s,
              u,
              c,
              d,
              h =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
            if (
              ((tn = !o) && (o = "\x3c!--\x3e"), "string" != typeof o && !yn(o))
            ) {
              if ("function" != typeof o.toString)
                throw z("toString is not a function");
              if ("string" != typeof (o = o.toString()))
                throw z("dirty is not a string, aborting");
            }
            if (!t.isSupported) {
              if (
                "object" === e(n.toStaticHTML) ||
                "function" == typeof n.toStaticHTML
              ) {
                if ("string" == typeof o) return n.toStaticHTML(o);
                if (yn(o)) return n.toStaticHTML(o.outerHTML);
              }
              return o;
            }
            if (
              (je || un(h),
              (t.removed = []),
              "string" == typeof o && (He = !1),
              He)
            ) {
              if (o.nodeName) {
                var p = ge(o.nodeName);
                if (!Ae[p] || Fe[p])
                  throw z(
                    "root node is forbidden and cannot be sanitized in-place"
                  );
              }
            } else if (o instanceof l)
              (1 ===
                (s = (a = bn("\x3c!----\x3e")).ownerDocument.importNode(o, !0))
                  .nodeType &&
                "BODY" === s.nodeName) ||
              "HTML" === s.nodeName
                ? (a = s)
                : a.appendChild(s);
            else {
              if (!Me && !Ne && !Oe && -1 === o.indexOf("<"))
                return oe && Le ? oe.createHTML(o) : o;
              if (!(a = bn(o))) return Me ? null : Le ? ae : "";
            }
            a && Re && _n(a.firstChild);
            for (var m = wn(He ? o : a); (u = m.nextNode()); )
              (3 === u.nodeType && u === c) ||
                An(u) ||
                (u.content instanceof i && Cn(u.content), En(u), (c = u));
            if (((c = null), He)) return o;
            if (Me) {
              if (Ie)
                for (d = ue.call(a.ownerDocument); a.firstChild; )
                  d.appendChild(a.firstChild);
              else d = a;
              return ve.shadowroot && (d = de.call(r, d, !0)), d;
            }
            var g = Oe ? a.outerHTML : a.innerHTML;
            return (
              Oe &&
                Ae["!doctype"] &&
                a.ownerDocument &&
                a.ownerDocument.doctype &&
                a.ownerDocument.doctype.name &&
                B(ee, a.ownerDocument.doctype.name) &&
                (g = "<!DOCTYPE " + a.ownerDocument.doctype.name + ">\n" + g),
              Ne && ((g = E(g, _e, " ")), (g = E(g, fe, " "))),
              oe && Le ? oe.createHTML(g) : g
            );
          }),
          (t.setConfig = function (e) {
            un(e), (je = !0);
          }),
          (t.clearConfig = function () {
            (an = null), (je = !1);
          }),
          (t.isValidAttribute = function (e, n, t) {
            an || un({});
            var r = ge(e),
              o = ge(n);
            return xn(r, o, t);
          }),
          (t.addHook = function (e, n) {
            "function" == typeof n && ((pe[e] = pe[e] || []), A(pe[e], n));
          }),
          (t.removeHook = function (e) {
            if (pe[e]) return D(pe[e]);
          }),
          (t.removeHooks = function (e) {
            pe[e] && (pe[e] = []);
          }),
          (t.removeAllHooks = function () {
            pe = {};
          }),
          t
        );
      }
      return re();
    })();
  }),
  i = { exports: {} };
function s(e) {
  return (
    e instanceof Map
      ? (e.clear =
          e.delete =
          e.set =
            function () {
              throw new Error("map is read-only");
            })
      : e instanceof Set &&
        (e.add =
          e.clear =
          e.delete =
            function () {
              throw new Error("set is read-only");
            }),
    Object.freeze(e),
    Object.getOwnPropertyNames(e).forEach(function (n) {
      var t = e[n];
      "object" != typeof t || Object.isFrozen(t) || s(t);
    }),
    e
  );
}
(i.exports = s), (i.exports.default = s);
class l {
  constructor(e) {
    void 0 === e.data && (e.data = {}),
      (this.data = e.data),
      (this.isMatchIgnored = !1);
  }
  ignoreMatch() {
    this.isMatchIgnored = !0;
  }
}
function u(e) {
  return e
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
function c(e, ...n) {
  const t = Object.create(null);
  for (const n in e) t[n] = e[n];
  return (
    n.forEach(function (e) {
      for (const n in e) t[n] = e[n];
    }),
    t
  );
}
const d = (e) => !!e.scope || (e.sublanguage && e.language);
class h {
  constructor(e, n) {
    (this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this);
  }
  addText(e) {
    this.buffer += u(e);
  }
  openNode(e) {
    if (!d(e)) return;
    let n = "";
    (n = e.sublanguage
      ? `language-${e.language}`
      : ((e, { prefix: n }) => {
          if (e.includes(".")) {
            const t = e.split(".");
            return [
              `${n}${t.shift()}`,
              ...t.map((e, n) => `${e}${"_".repeat(n + 1)}`),
            ].join(" ");
          }
          return `${n}${e}`;
        })(e.scope, { prefix: this.classPrefix })),
      this.span(n);
  }
  closeNode(e) {
    d(e) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e) {
    this.buffer += `<span class="${e}">`;
  }
}
const p = (e = {}) => {
  const n = { children: [] };
  return Object.assign(n, e), n;
};
class m {
  constructor() {
    (this.rootNode = p()), (this.stack = [this.rootNode]);
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e) {
    this.top.children.push(e);
  }
  openNode(e) {
    const n = p({ scope: e });
    this.add(n), this.stack.push(n);
  }
  closeNode() {
    if (this.stack.length > 1) return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); );
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e) {
    return this.constructor._walk(e, this.rootNode);
  }
  static _walk(e, n) {
    return (
      "string" == typeof n
        ? e.addText(n)
        : n.children &&
          (e.openNode(n),
          n.children.forEach((n) => this._walk(e, n)),
          e.closeNode(n)),
      e
    );
  }
  static _collapse(e) {
    "string" != typeof e &&
      e.children &&
      (e.children.every((e) => "string" == typeof e)
        ? (e.children = [e.children.join("")])
        : e.children.forEach((e) => {
            m._collapse(e);
          }));
  }
}
class g extends m {
  constructor(e) {
    super(), (this.options = e);
  }
  addKeyword(e, n) {
    "" !== e && (this.openNode(n), this.addText(e), this.closeNode());
  }
  addText(e) {
    "" !== e && this.add(e);
  }
  addSublanguage(e, n) {
    const t = e.root;
    (t.sublanguage = !0), (t.language = n), this.add(t);
  }
  toHTML() {
    return new h(this, this.options).value();
  }
  finalize() {
    return !0;
  }
}
function _(e) {
  return e ? ("string" == typeof e ? e : e.source) : null;
}
function f(e) {
  return k("(?=", e, ")");
}
function b(e) {
  return k("(?:", e, ")*");
}
function w(e) {
  return k("(?:", e, ")?");
}
function k(...e) {
  const n = e.map((e) => _(e)).join("");
  return n;
}
function y(...e) {
  const n = (function (e) {
      const n = e[e.length - 1];
      return "object" == typeof n && n.constructor === Object
        ? (e.splice(e.length - 1, 1), n)
        : {};
    })(e),
    t = "(" + (n.capture ? "" : "?:") + e.map((e) => _(e)).join("|") + ")";
  return t;
}
function D(e) {
  return new RegExp(e.toString() + "|").exec("").length - 1;
}
const A = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function x(e, { joinWith: n }) {
  let t = 0;
  return e
    .map((e) => {
      t += 1;
      const n = t;
      let r = _(e),
        o = "";
      for (; r.length > 0; ) {
        const e = A.exec(r);
        if (!e) {
          o += r;
          break;
        }
        (o += r.substring(0, e.index)),
          (r = r.substring(e.index + e[0].length)),
          "\\" === e[0][0] && e[1]
            ? (o += "\\" + String(Number(e[1]) + n))
            : ((o += e[0]), "(" === e[0] && t++);
      }
      return o;
    })
    .map((e) => `(${e})`)
    .join(n);
}
const v =
    "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
  E = { begin: "\\\\[\\s\\S]", relevance: 0 },
  C = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [E] },
  F = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [E] },
  B = function (e, n, t = {}) {
    const r = c({ scope: "comment", begin: e, end: n, contains: [] }, t);
    r.contains.push({
      scope: "doctag",
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0,
    });
    const o = y(
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      /[A-Za-z]+[-][a-z]+/,
      /[A-Za-z][a-z]{2,}/
    );
    return (
      r.contains.push({
        begin: k(/[ ]+/, "(", o, /[.]?[:]?([.][ ]|[ ])/, "){3}"),
      }),
      r
    );
  },
  z = B("//", "$"),
  S = B("/\\*", "\\*/"),
  T = B("#", "$"),
  N = { scope: "number", begin: "\\b\\d+(\\.\\d+)?", relevance: 0 },
  O = { scope: "number", begin: v, relevance: 0 },
  j = { scope: "number", begin: "\\b(0b[01]+)", relevance: 0 },
  R = {
    begin: /(?=\/[^/\n]*\/)/,
    contains: [
      {
        scope: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [E, { begin: /\[/, end: /\]/, relevance: 0, contains: [E] }],
      },
    ],
  },
  M = { scope: "title", begin: "[a-zA-Z]\\w*", relevance: 0 },
  I = { scope: "title", begin: "[a-zA-Z_]\\w*", relevance: 0 },
  L = { begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0 };
var $ = Object.freeze({
  __proto__: null,
  MATCH_NOTHING_RE: /\b\B/,
  IDENT_RE: "[a-zA-Z]\\w*",
  UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
  NUMBER_RE: "\\b\\d+(\\.\\d+)?",
  C_NUMBER_RE: v,
  BINARY_NUMBER_RE: "\\b(0b[01]+)",
  RE_STARTERS_RE:
    "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
  SHEBANG: (e = {}) => {
    const n = /^#![ ]*\//;
    return (
      e.binary && (e.begin = k(n, /.*\b/, e.binary, /\b.*/)),
      c(
        {
          scope: "meta",
          begin: n,
          end: /$/,
          relevance: 0,
          "on:begin": (e, n) => {
            0 !== e.index && n.ignoreMatch();
          },
        },
        e
      )
    );
  },
  BACKSLASH_ESCAPE: E,
  APOS_STRING_MODE: C,
  QUOTE_STRING_MODE: F,
  PHRASAL_WORDS_MODE: {
    begin:
      /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
  },
  COMMENT: B,
  C_LINE_COMMENT_MODE: z,
  C_BLOCK_COMMENT_MODE: S,
  HASH_COMMENT_MODE: T,
  NUMBER_MODE: N,
  C_NUMBER_MODE: O,
  BINARY_NUMBER_MODE: j,
  REGEXP_MODE: R,
  TITLE_MODE: M,
  UNDERSCORE_TITLE_MODE: I,
  METHOD_GUARD: L,
  END_SAME_AS_BEGIN: function (e) {
    return Object.assign(e, {
      "on:begin": (e, n) => {
        n.data._beginMatch = e[1];
      },
      "on:end": (e, n) => {
        n.data._beginMatch !== e[1] && n.ignoreMatch();
      },
    });
  },
});
function U(e, n) {
  "." === e.input[e.index - 1] && n.ignoreMatch();
}
function P(e, n) {
  void 0 !== e.className && ((e.scope = e.className), delete e.className);
}
function q(e, n) {
  n &&
    e.beginKeywords &&
    ((e.begin =
      "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)"),
    (e.__beforeBegin = U),
    (e.keywords = e.keywords || e.beginKeywords),
    delete e.beginKeywords,
    void 0 === e.relevance && (e.relevance = 0));
}
function H(e, n) {
  Array.isArray(e.illegal) && (e.illegal = y(...e.illegal));
}
function Z(e, n) {
  if (e.match) {
    if (e.begin || e.end)
      throw new Error("begin & end are not supported with match");
    (e.begin = e.match), delete e.match;
  }
}
function G(e, n) {
  void 0 === e.relevance && (e.relevance = 1);
}
const W = (e, n) => {
    if (!e.beforeMatch) return;
    if (e.starts) throw new Error("beforeMatch cannot be used with starts");
    const t = Object.assign({}, e);
    Object.keys(e).forEach((n) => {
      delete e[n];
    }),
      (e.keywords = t.keywords),
      (e.begin = k(t.beforeMatch, f(t.begin))),
      (e.starts = {
        relevance: 0,
        contains: [Object.assign(t, { endsParent: !0 })],
      }),
      (e.relevance = 0),
      delete t.beforeMatch;
  },
  Q = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    "list",
    "value",
  ];
function Y(e, n, t = "keyword") {
  const r = Object.create(null);
  return (
    "string" == typeof e
      ? o(t, e.split(" "))
      : Array.isArray(e)
      ? o(t, e)
      : Object.keys(e).forEach(function (t) {
          Object.assign(r, Y(e[t], n, t));
        }),
    r
  );
  function o(e, t) {
    n && (t = t.map((e) => e.toLowerCase())),
      t.forEach(function (n) {
        const t = n.split("|");
        r[t[0]] = [e, K(t[0], t[1])];
      });
  }
}
function K(e, n) {
  return n
    ? Number(n)
    : (function (e) {
        return Q.includes(e.toLowerCase());
      })(e)
    ? 0
    : 1;
}
const X = {},
  J = (e) => {
    console.error(e);
  },
  V = (e, ...n) => {
    console.log(`WARN: ${e}`, ...n);
  },
  ee = (e, n) => {
    X[`${e}/${n}`] ||
      (console.log(`Deprecated as of ${e}. ${n}`), (X[`${e}/${n}`] = !0));
  },
  ne = new Error();
function te(e, n, { key: t }) {
  let r = 0;
  const o = e[t],
    a = {},
    i = {};
  for (let e = 1; e <= n.length; e++)
    (i[e + r] = o[e]), (a[e + r] = !0), (r += D(n[e - 1]));
  (e[t] = i), (e[t]._emit = a), (e[t]._multi = !0);
}
function re(e) {
  !(function (e) {
    e.scope &&
      "object" == typeof e.scope &&
      null !== e.scope &&
      ((e.beginScope = e.scope), delete e.scope);
  })(e),
    "string" == typeof e.beginScope && (e.beginScope = { _wrap: e.beginScope }),
    "string" == typeof e.endScope && (e.endScope = { _wrap: e.endScope }),
    (function (e) {
      if (Array.isArray(e.begin)) {
        if (e.skip || e.excludeBegin || e.returnBegin)
          throw (
            (J(
              "skip, excludeBegin, returnBegin not compatible with beginScope: {}"
            ),
            ne)
          );
        if ("object" != typeof e.beginScope || null === e.beginScope)
          throw (J("beginScope must be object"), ne);
        te(e, e.begin, { key: "beginScope" }),
          (e.begin = x(e.begin, { joinWith: "" }));
      }
    })(e),
    (function (e) {
      if (Array.isArray(e.end)) {
        if (e.skip || e.excludeEnd || e.returnEnd)
          throw (
            (J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
            ne)
          );
        if ("object" != typeof e.endScope || null === e.endScope)
          throw (J("endScope must be object"), ne);
        te(e, e.end, { key: "endScope" }), (e.end = x(e.end, { joinWith: "" }));
      }
    })(e);
}
function oe(e) {
  function n(n, t) {
    return new RegExp(
      _(n),
      "m" +
        (e.case_insensitive ? "i" : "") +
        (e.unicodeRegex ? "u" : "") +
        (t ? "g" : "")
    );
  }
  class t {
    constructor() {
      (this.matchIndexes = {}),
        (this.regexes = []),
        (this.matchAt = 1),
        (this.position = 0);
    }
    addRule(e, n) {
      (n.position = this.position++),
        (this.matchIndexes[this.matchAt] = n),
        this.regexes.push([n, e]),
        (this.matchAt += D(e) + 1);
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e = this.regexes.map((e) => e[1]);
      (this.matcherRe = n(x(e, { joinWith: "|" }), !0)), (this.lastIndex = 0);
    }
    exec(e) {
      this.matcherRe.lastIndex = this.lastIndex;
      const n = this.matcherRe.exec(e);
      if (!n) return null;
      const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
        r = this.matchIndexes[t];
      return n.splice(0, t), Object.assign(n, r);
    }
  }
  class r {
    constructor() {
      (this.rules = []),
        (this.multiRegexes = []),
        (this.count = 0),
        (this.lastIndex = 0),
        (this.regexIndex = 0);
    }
    getMatcher(e) {
      if (this.multiRegexes[e]) return this.multiRegexes[e];
      const n = new t();
      return (
        this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
        n.compile(),
        (this.multiRegexes[e] = n),
        n
      );
    }
    resumingScanAtSamePosition() {
      return 0 !== this.regexIndex;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(e, n) {
      this.rules.push([e, n]), "begin" === n.type && this.count++;
    }
    exec(e) {
      const n = this.getMatcher(this.regexIndex);
      n.lastIndex = this.lastIndex;
      let t = n.exec(e);
      if (this.resumingScanAtSamePosition())
        if (t && t.index === this.lastIndex);
        else {
          const n = this.getMatcher(0);
          (n.lastIndex = this.lastIndex + 1), (t = n.exec(e));
        }
      return (
        t &&
          ((this.regexIndex += t.position + 1),
          this.regexIndex === this.count && this.considerAll()),
        t
      );
    }
  }
  if (
    (e.compilerExtensions || (e.compilerExtensions = []),
    e.contains && e.contains.includes("self"))
  )
    throw new Error(
      "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
    );
  return (
    (e.classNameAliases = c(e.classNameAliases || {})),
    (function t(o, a) {
      const i = o;
      if (o.isCompiled) return i;
      [P, Z, re, W].forEach((e) => e(o, a)),
        e.compilerExtensions.forEach((e) => e(o, a)),
        (o.__beforeBegin = null),
        [q, H, G].forEach((e) => e(o, a)),
        (o.isCompiled = !0);
      let s = null;
      return (
        "object" == typeof o.keywords &&
          o.keywords.$pattern &&
          ((o.keywords = Object.assign({}, o.keywords)),
          (s = o.keywords.$pattern),
          delete o.keywords.$pattern),
        (s = s || /\w+/),
        o.keywords && (o.keywords = Y(o.keywords, e.case_insensitive)),
        (i.keywordPatternRe = n(s, !0)),
        a &&
          (o.begin || (o.begin = /\B|\b/),
          (i.beginRe = n(i.begin)),
          o.end || o.endsWithParent || (o.end = /\B|\b/),
          o.end && (i.endRe = n(i.end)),
          (i.terminatorEnd = _(i.end) || ""),
          o.endsWithParent &&
            a.terminatorEnd &&
            (i.terminatorEnd += (o.end ? "|" : "") + a.terminatorEnd)),
        o.illegal && (i.illegalRe = n(o.illegal)),
        o.contains || (o.contains = []),
        (o.contains = [].concat(
          ...o.contains.map(function (e) {
            return (function (e) {
              e.variants &&
                !e.cachedVariants &&
                (e.cachedVariants = e.variants.map(function (n) {
                  return c(e, { variants: null }, n);
                }));
              if (e.cachedVariants) return e.cachedVariants;
              if (ae(e)) return c(e, { starts: e.starts ? c(e.starts) : null });
              if (Object.isFrozen(e)) return c(e);
              return e;
            })("self" === e ? o : e);
          })
        )),
        o.contains.forEach(function (e) {
          t(e, i);
        }),
        o.starts && t(o.starts, a),
        (i.matcher = (function (e) {
          const n = new r();
          return (
            e.contains.forEach((e) =>
              n.addRule(e.begin, { rule: e, type: "begin" })
            ),
            e.terminatorEnd && n.addRule(e.terminatorEnd, { type: "end" }),
            e.illegal && n.addRule(e.illegal, { type: "illegal" }),
            n
          );
        })(i)),
        i
      );
    })(e)
  );
}
function ae(e) {
  return !!e && (e.endsWithParent || ae(e.starts));
}
class ie extends Error {
  constructor(e, n) {
    super(e), (this.name = "HTMLInjectionError"), (this.html = n);
  }
}
const se = u,
  le = c,
  ue = Symbol("nomatch");
var ce = (function (e) {
    const n = Object.create(null),
      t = Object.create(null),
      r = [];
    let o = !0;
    const a =
        "Could not find the language '{}', did you forget to load/include a language module?",
      s = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let u = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      __emitter: g,
    };
    function c(e) {
      return u.noHighlightRe.test(e);
    }
    function d(e, n, t) {
      let r = "",
        o = "";
      "object" == typeof n
        ? ((r = e), (t = n.ignoreIllegals), (o = n.language))
        : (ee("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
          ee(
            "10.7.0",
            "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"
          ),
          (o = e),
          (r = n)),
        void 0 === t && (t = !0);
      const a = { code: r, language: o };
      E("before:highlight", a);
      const i = a.result ? a.result : h(a.language, a.code, t);
      return (i.code = a.code), E("after:highlight", i), i;
    }
    function h(e, t, r, i) {
      const s = Object.create(null);
      function c() {
        if (!v.keywords) return void C.addText(F);
        let e = 0;
        v.keywordPatternRe.lastIndex = 0;
        let n = v.keywordPatternRe.exec(F),
          t = "";
        for (; n; ) {
          t += F.substring(e, n.index);
          const o = y.case_insensitive ? n[0].toLowerCase() : n[0],
            a = ((r = o), v.keywords[r]);
          if (a) {
            const [e, r] = a;
            if (
              (C.addText(t),
              (t = ""),
              (s[o] = (s[o] || 0) + 1),
              s[o] <= 7 && (B += r),
              e.startsWith("_"))
            )
              t += n[0];
            else {
              const t = y.classNameAliases[e] || e;
              C.addKeyword(n[0], t);
            }
          } else t += n[0];
          (e = v.keywordPatternRe.lastIndex), (n = v.keywordPatternRe.exec(F));
        }
        var r;
        (t += F.substring(e)), C.addText(t);
      }
      function d() {
        null != v.subLanguage
          ? (function () {
              if ("" === F) return;
              let e = null;
              if ("string" == typeof v.subLanguage) {
                if (!n[v.subLanguage]) return void C.addText(F);
                (e = h(v.subLanguage, F, !0, E[v.subLanguage])),
                  (E[v.subLanguage] = e._top);
              } else e = p(F, v.subLanguage.length ? v.subLanguage : null);
              v.relevance > 0 && (B += e.relevance),
                C.addSublanguage(e._emitter, e.language);
            })()
          : c(),
          (F = "");
      }
      function m(e, n) {
        let t = 1;
        const r = n.length - 1;
        for (; t <= r; ) {
          if (!e._emit[t]) {
            t++;
            continue;
          }
          const r = y.classNameAliases[e[t]] || e[t],
            o = n[t];
          r ? C.addKeyword(o, r) : ((F = o), c(), (F = "")), t++;
        }
      }
      function g(e, n) {
        return (
          e.scope &&
            "string" == typeof e.scope &&
            C.openNode(y.classNameAliases[e.scope] || e.scope),
          e.beginScope &&
            (e.beginScope._wrap
              ? (C.addKeyword(
                  F,
                  y.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap
                ),
                (F = ""))
              : e.beginScope._multi && (m(e.beginScope, n), (F = ""))),
          (v = Object.create(e, { parent: { value: v } })),
          v
        );
      }
      function _(e, n, t) {
        let r = (function (e, n) {
          const t = e && e.exec(n);
          return t && 0 === t.index;
        })(e.endRe, t);
        if (r) {
          if (e["on:end"]) {
            const t = new l(e);
            e["on:end"](n, t), t.isMatchIgnored && (r = !1);
          }
          if (r) {
            for (; e.endsParent && e.parent; ) e = e.parent;
            return e;
          }
        }
        if (e.endsWithParent) return _(e.parent, n, t);
      }
      function f(e) {
        return 0 === v.matcher.regexIndex ? ((F += e[0]), 1) : ((T = !0), 0);
      }
      function b(e) {
        const n = e[0],
          r = t.substring(e.index),
          o = _(v, e, r);
        if (!o) return ue;
        const a = v;
        v.endScope && v.endScope._wrap
          ? (d(), C.addKeyword(n, v.endScope._wrap))
          : v.endScope && v.endScope._multi
          ? (d(), m(v.endScope, e))
          : a.skip
          ? (F += n)
          : (a.returnEnd || a.excludeEnd || (F += n),
            d(),
            a.excludeEnd && (F = n));
        do {
          v.scope && C.closeNode(),
            v.skip || v.subLanguage || (B += v.relevance),
            (v = v.parent);
        } while (v !== o.parent);
        return o.starts && g(o.starts, e), a.returnEnd ? 0 : n.length;
      }
      let w = {};
      function k(n, a) {
        const i = a && a[0];
        if (((F += n), null == i)) return d(), 0;
        if (
          "begin" === w.type &&
          "end" === a.type &&
          w.index === a.index &&
          "" === i
        ) {
          if (((F += t.slice(a.index, a.index + 1)), !o)) {
            const n = new Error(`0 width match regex (${e})`);
            throw ((n.languageName = e), (n.badRule = w.rule), n);
          }
          return 1;
        }
        if (((w = a), "begin" === a.type))
          return (function (e) {
            const n = e[0],
              t = e.rule,
              r = new l(t),
              o = [t.__beforeBegin, t["on:begin"]];
            for (const t of o)
              if (t && (t(e, r), r.isMatchIgnored)) return f(n);
            return (
              t.skip
                ? (F += n)
                : (t.excludeBegin && (F += n),
                  d(),
                  t.returnBegin || t.excludeBegin || (F = n)),
              g(t, e),
              t.returnBegin ? 0 : n.length
            );
          })(a);
        if ("illegal" === a.type && !r) {
          const e = new Error(
            'Illegal lexeme "' +
              i +
              '" for mode "' +
              (v.scope || "<unnamed>") +
              '"'
          );
          throw ((e.mode = v), e);
        }
        if ("end" === a.type) {
          const e = b(a);
          if (e !== ue) return e;
        }
        if ("illegal" === a.type && "" === i) return 1;
        if (S > 1e5 && S > 3 * a.index) {
          throw new Error(
            "potential infinite loop, way more iterations than matches"
          );
        }
        return (F += i), i.length;
      }
      const y = A(e);
      if (!y)
        throw (
          (J(a.replace("{}", e)), new Error('Unknown language: "' + e + '"'))
        );
      const D = oe(y);
      let x = "",
        v = i || D;
      const E = {},
        C = new u.__emitter(u);
      !(function () {
        const e = [];
        for (let n = v; n !== y; n = n.parent) n.scope && e.unshift(n.scope);
        e.forEach((e) => C.openNode(e));
      })();
      let F = "",
        B = 0,
        z = 0,
        S = 0,
        T = !1;
      try {
        for (v.matcher.considerAll(); ; ) {
          S++,
            T ? (T = !1) : v.matcher.considerAll(),
            (v.matcher.lastIndex = z);
          const e = v.matcher.exec(t);
          if (!e) break;
          const n = k(t.substring(z, e.index), e);
          z = e.index + n;
        }
        return (
          k(t.substring(z)),
          C.closeAllNodes(),
          C.finalize(),
          (x = C.toHTML()),
          {
            language: e,
            value: x,
            relevance: B,
            illegal: !1,
            _emitter: C,
            _top: v,
          }
        );
      } catch (n) {
        if (n.message && n.message.includes("Illegal"))
          return {
            language: e,
            value: se(t),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: n.message,
              index: z,
              context: t.slice(z - 100, z + 100),
              mode: n.mode,
              resultSoFar: x,
            },
            _emitter: C,
          };
        if (o)
          return {
            language: e,
            value: se(t),
            illegal: !1,
            relevance: 0,
            errorRaised: n,
            _emitter: C,
            _top: v,
          };
        throw n;
      }
    }
    function p(e, t) {
      t = t || u.languages || Object.keys(n);
      const r = (function (e) {
          const n = {
            value: se(e),
            illegal: !1,
            relevance: 0,
            _top: s,
            _emitter: new u.__emitter(u),
          };
          return n._emitter.addText(e), n;
        })(e),
        o = t
          .filter(A)
          .filter(v)
          .map((n) => h(n, e, !1));
      o.unshift(r);
      const a = o.sort((e, n) => {
          if (e.relevance !== n.relevance) return n.relevance - e.relevance;
          if (e.language && n.language) {
            if (A(e.language).supersetOf === n.language) return 1;
            if (A(n.language).supersetOf === e.language) return -1;
          }
          return 0;
        }),
        [i, l] = a,
        c = i;
      return (c.secondBest = l), c;
    }
    function m(e) {
      let n = null;
      const r = (function (e) {
        let n = e.className + " ";
        n += e.parentNode ? e.parentNode.className : "";
        const t = u.languageDetectRe.exec(n);
        if (t) {
          const n = A(t[1]);
          return (
            n ||
              (V(a.replace("{}", t[1])),
              V("Falling back to no-highlight mode for this block.", e)),
            n ? t[1] : "no-highlight"
          );
        }
        return n.split(/\s+/).find((e) => c(e) || A(e));
      })(e);
      if (c(r)) return;
      if (
        (E("before:highlightElement", { el: e, language: r }),
        e.children.length > 0 &&
          (u.ignoreUnescapedHTML ||
            (console.warn(
              "One of your code blocks includes unescaped HTML. This is a potentially serious security risk."
            ),
            console.warn(
              "https://github.com/highlightjs/highlight.js/wiki/security"
            ),
            console.warn("The element with unescaped HTML:"),
            console.warn(e)),
          u.throwUnescapedHTML))
      ) {
        throw new ie(
          "One of your code blocks includes unescaped HTML.",
          e.innerHTML
        );
      }
      n = e;
      const o = n.textContent,
        i = r ? d(o, { language: r, ignoreIllegals: !0 }) : p(o);
      (e.innerHTML = i.value),
        (function (e, n, r) {
          const o = (n && t[n]) || r;
          e.classList.add("hljs"), e.classList.add(`language-${o}`);
        })(e, r, i.language),
        (e.result = {
          language: i.language,
          re: i.relevance,
          relevance: i.relevance,
        }),
        i.secondBest &&
          (e.secondBest = {
            language: i.secondBest.language,
            relevance: i.secondBest.relevance,
          }),
        E("after:highlightElement", { el: e, result: i, text: o });
    }
    let _ = !1;
    function D() {
      if ("loading" === document.readyState) return void (_ = !0);
      document.querySelectorAll(u.cssSelector).forEach(m);
    }
    function A(e) {
      return (e = (e || "").toLowerCase()), n[e] || n[t[e]];
    }
    function x(e, { languageName: n }) {
      "string" == typeof e && (e = [e]),
        e.forEach((e) => {
          t[e.toLowerCase()] = n;
        });
    }
    function v(e) {
      const n = A(e);
      return n && !n.disableAutodetect;
    }
    function E(e, n) {
      const t = e;
      r.forEach(function (e) {
        e[t] && e[t](n);
      });
    }
    "undefined" != typeof window &&
      window.addEventListener &&
      window.addEventListener(
        "DOMContentLoaded",
        function () {
          _ && D();
        },
        !1
      ),
      Object.assign(e, {
        highlight: d,
        highlightAuto: p,
        highlightAll: D,
        highlightElement: m,
        highlightBlock: function (e) {
          return (
            ee("10.7.0", "highlightBlock will be removed entirely in v12.0"),
            ee("10.7.0", "Please use highlightElement now."),
            m(e)
          );
        },
        configure: function (e) {
          u = le(u, e);
        },
        initHighlighting: () => {
          D(),
            ee(
              "10.6.0",
              "initHighlighting() deprecated.  Use highlightAll() now."
            );
        },
        initHighlightingOnLoad: function () {
          D(),
            ee(
              "10.6.0",
              "initHighlightingOnLoad() deprecated.  Use highlightAll() now."
            );
        },
        registerLanguage: function (t, r) {
          let a = null;
          try {
            a = r(e);
          } catch (e) {
            if (
              (J(
                "Language definition for '{}' could not be registered.".replace(
                  "{}",
                  t
                )
              ),
              !o)
            )
              throw e;
            J(e), (a = s);
          }
          a.name || (a.name = t),
            (n[t] = a),
            (a.rawDefinition = r.bind(null, e)),
            a.aliases && x(a.aliases, { languageName: t });
        },
        unregisterLanguage: function (e) {
          delete n[e];
          for (const n of Object.keys(t)) t[n] === e && delete t[n];
        },
        listLanguages: function () {
          return Object.keys(n);
        },
        getLanguage: A,
        registerAliases: x,
        autoDetection: v,
        inherit: le,
        addPlugin: function (e) {
          !(function (e) {
            e["before:highlightBlock"] &&
              !e["before:highlightElement"] &&
              (e["before:highlightElement"] = (n) => {
                e["before:highlightBlock"](Object.assign({ block: n.el }, n));
              }),
              e["after:highlightBlock"] &&
                !e["after:highlightElement"] &&
                (e["after:highlightElement"] = (n) => {
                  e["after:highlightBlock"](Object.assign({ block: n.el }, n));
                });
          })(e),
            r.push(e);
        },
      }),
      (e.debugMode = function () {
        o = !1;
      }),
      (e.safeMode = function () {
        o = !0;
      }),
      (e.versionString = "11.6.0"),
      (e.regex = {
        concat: k,
        lookahead: f,
        either: y,
        optional: w,
        anyNumberOfTimes: b,
      });
    for (const e in $) "object" == typeof $[e] && i.exports($[e]);
    return Object.assign(e, $), e;
  })({}),
  de = ce;
(ce.HighlightJS = ce), (ce.default = ce);
var he = de;
const pe = [
    "as",
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
  ],
  me = ["true", "false", "null", "undefined", "NaN", "Infinity"],
  ge = [
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    "Math",
    "Date",
    "Number",
    "BigInt",
    "String",
    "RegExp",
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    "Reflect",
    "Proxy",
    "Intl",
    "WebAssembly",
  ],
  _e = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
  ],
  fe = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape",
  ],
  be = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "module",
    "global",
  ],
  we = [].concat(fe, ge, _e);
var ke = function (e) {
    const n = e.regex,
      t = "[A-Za-z$_][0-9A-Za-z$_]*",
      r = "<>",
      o = "</>",
      a = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        isTrulyOpeningTag: (e, n) => {
          const t = e[0].length + e.index,
            r = e.input[t];
          if ("<" === r || "," === r) return void n.ignoreMatch();
          let o;
          ">" === r &&
            (((e, { after: n }) => {
              const t = "</" + e[0].slice(1);
              return -1 !== e.input.indexOf(t, n);
            })(e, { after: t }) ||
              n.ignoreMatch());
          (o = e.input.substring(t).match(/^\s+extends\s+/)) &&
            0 === o.index &&
            n.ignoreMatch();
        },
      },
      i = {
        $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
        keyword: pe,
        literal: me,
        built_in: we,
        "variable.language": be,
      },
      s = "\\.([0-9](_?[0-9])*)",
      l = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
      u = {
        className: "number",
        variants: [
          {
            begin: `(\\b(${l})((${s})|\\.)?|(${s}))[eE][+-]?([0-9](_?[0-9])*)\\b`,
          },
          { begin: `\\b(${l})\\b((${s})\\b|\\.)?|(${s})\\b` },
          { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
          { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
          { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
          { begin: "\\b0[0-7]+n?\\b" },
        ],
        relevance: 0,
      },
      c = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: i,
        contains: [],
      },
      d = {
        begin: "html`",
        end: "",
        starts: {
          end: "`",
          returnEnd: !1,
          contains: [e.BACKSLASH_ESCAPE, c],
          subLanguage: "xml",
        },
      },
      h = {
        begin: "css`",
        end: "",
        starts: {
          end: "`",
          returnEnd: !1,
          contains: [e.BACKSLASH_ESCAPE, c],
          subLanguage: "css",
        },
      },
      p = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [e.BACKSLASH_ESCAPE, c],
      },
      m = {
        className: "comment",
        variants: [
          e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
            relevance: 0,
            contains: [
              {
                begin: "(?=@[A-Za-z]+)",
                relevance: 0,
                contains: [
                  { className: "doctag", begin: "@[A-Za-z]+" },
                  {
                    className: "type",
                    begin: "\\{",
                    end: "\\}",
                    excludeEnd: !0,
                    excludeBegin: !0,
                    relevance: 0,
                  },
                  {
                    className: "variable",
                    begin: t + "(?=\\s*(-)|$)",
                    endsParent: !0,
                    relevance: 0,
                  },
                  { begin: /(?=[^\n])\s/, relevance: 0 },
                ],
              },
            ],
          }),
          e.C_BLOCK_COMMENT_MODE,
          e.C_LINE_COMMENT_MODE,
        ],
      },
      g = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, d, h, p, u];
    c.contains = g.concat({
      begin: /\{/,
      end: /\}/,
      keywords: i,
      contains: ["self"].concat(g),
    });
    const _ = [].concat(m, c.contains),
      f = _.concat([
        { begin: /\(/, end: /\)/, keywords: i, contains: ["self"].concat(_) },
      ]),
      b = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        keywords: i,
        contains: f,
      },
      w = {
        variants: [
          {
            match: [
              /class/,
              /\s+/,
              t,
              /\s+/,
              /extends/,
              /\s+/,
              n.concat(t, "(", n.concat(/\./, t), ")*"),
            ],
            scope: {
              1: "keyword",
              3: "title.class",
              5: "keyword",
              7: "title.class.inherited",
            },
          },
          {
            match: [/class/, /\s+/, t],
            scope: { 1: "keyword", 3: "title.class" },
          },
        ],
      },
      k = {
        relevance: 0,
        match: n.either(
          /\bJSON/,
          /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
          /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
          /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        ),
        className: "title.class",
        keywords: { _: [...ge, ..._e] },
      },
      y = {
        variants: [
          { match: [/function/, /\s+/, t, /(?=\s*\()/] },
          { match: [/function/, /\s*(?=\()/] },
        ],
        className: { 1: "keyword", 3: "title.function" },
        label: "func.def",
        contains: [b],
        illegal: /%/,
      },
      D = {
        match: n.concat(
          /\b/,
          ((A = [...fe, "super"]), n.concat("(?!", A.join("|"), ")")),
          t,
          n.lookahead(/\(/)
        ),
        className: "title.function",
        relevance: 0,
      };
    var A;
    const x = {
        begin: n.concat(/\./, n.lookahead(n.concat(t, /(?![0-9A-Za-z$_(])/))),
        end: t,
        excludeBegin: !0,
        keywords: "prototype",
        className: "property",
        relevance: 0,
      },
      v = {
        match: [/get|set/, /\s+/, t, /(?=\()/],
        className: { 1: "keyword", 3: "title.function" },
        contains: [{ begin: /\(\)/ }, b],
      },
      E =
        "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" +
        e.UNDERSCORE_IDENT_RE +
        ")\\s*=>",
      C = {
        match: [
          /const|var|let/,
          /\s+/,
          t,
          /\s*/,
          /=\s*/,
          /(async\s*)?/,
          n.lookahead(E),
        ],
        keywords: "async",
        className: { 1: "keyword", 3: "title.function" },
        contains: [b],
      };
    return {
      name: "Javascript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: i,
      exports: { PARAMS_CONTAINS: f, CLASS_REFERENCE: k },
      illegal: /#(?![$_A-z])/,
      contains: [
        e.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }),
        {
          label: "use_strict",
          className: "meta",
          relevance: 10,
          begin: /^\s*['"]use (strict|asm)['"]/,
        },
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
        d,
        h,
        p,
        m,
        u,
        k,
        { className: "attr", begin: t + n.lookahead(":"), relevance: 0 },
        C,
        {
          begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            m,
            e.REGEXP_MODE,
            {
              className: "function",
              begin: E,
              returnBegin: !0,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                    { className: null, begin: /\(\s*\)/, skip: !0 },
                    {
                      begin: /\(/,
                      end: /\)/,
                      excludeBegin: !0,
                      excludeEnd: !0,
                      keywords: i,
                      contains: f,
                    },
                  ],
                },
              ],
            },
            { begin: /,/, relevance: 0 },
            { match: /\s+/, relevance: 0 },
            {
              variants: [
                { begin: r, end: o },
                { match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
                { begin: a.begin, "on:begin": a.isTrulyOpeningTag, end: a.end },
              ],
              subLanguage: "xml",
              contains: [
                { begin: a.begin, end: a.end, skip: !0, contains: ["self"] },
              ],
            },
          ],
        },
        y,
        { beginKeywords: "while if switch catch for" },
        {
          begin:
            "\\b(?!function)" +
            e.UNDERSCORE_IDENT_RE +
            "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          returnBegin: !0,
          label: "func.def",
          contains: [
            b,
            e.inherit(e.TITLE_MODE, { begin: t, className: "title.function" }),
          ],
        },
        { match: /\.\.\./, relevance: 0 },
        x,
        { match: "\\$" + t, relevance: 0 },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [b],
        },
        D,
        {
          relevance: 0,
          match: /\b[A-Z][A-Z_0-9]+\b/,
          className: "variable.constant",
        },
        w,
        v,
        { match: /\$[(.]/ },
      ],
    };
  },
  ye = ke;
var De = function (e) {
    const n = ["true", "false", "null"],
      t = { scope: "literal", beginKeywords: n.join(" ") };
    return {
      name: "JSON",
      keywords: { literal: n },
      contains: [
        {
          className: "attr",
          begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
          relevance: 1.01,
        },
        { match: /[{}[\],:]/, className: "punctuation", relevance: 0 },
        e.QUOTE_STRING_MODE,
        t,
        e.C_NUMBER_MODE,
        e.C_LINE_COMMENT_MODE,
        e.C_BLOCK_COMMENT_MODE,
      ],
      illegal: "\\S",
    };
  },
  Ae = De;
var xe = function (e) {
    const n = "true false yes no null",
      t = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
      r = {
        className: "string",
        relevance: 0,
        variants: [
          { begin: /'/, end: /'/ },
          { begin: /"/, end: /"/ },
          { begin: /\S+/ },
        ],
        contains: [
          e.BACKSLASH_ESCAPE,
          {
            className: "template-variable",
            variants: [
              { begin: /\{\{/, end: /\}\}/ },
              { begin: /%\{/, end: /\}/ },
            ],
          },
        ],
      },
      o = e.inherit(r, {
        variants: [
          { begin: /'/, end: /'/ },
          { begin: /"/, end: /"/ },
          { begin: /[^\s,{}[\]]+/ },
        ],
      }),
      a = {
        className: "number",
        begin:
          "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b",
      },
      i = {
        end: ",",
        endsWithParent: !0,
        excludeEnd: !0,
        keywords: n,
        relevance: 0,
      },
      s = {
        begin: /\{/,
        end: /\}/,
        contains: [i],
        illegal: "\\n",
        relevance: 0,
      },
      l = {
        begin: "\\[",
        end: "\\]",
        contains: [i],
        illegal: "\\n",
        relevance: 0,
      },
      u = [
        {
          className: "attr",
          variants: [
            { begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)" },
            { begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' },
            { begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)" },
          ],
        },
        { className: "meta", begin: "^---\\s*$", relevance: 10 },
        {
          className: "string",
          begin:
            "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*",
        },
        {
          begin: "<%[%=-]?",
          end: "[%-]?%>",
          subLanguage: "ruby",
          excludeBegin: !0,
          excludeEnd: !0,
          relevance: 0,
        },
        { className: "type", begin: "!\\w+!" + t },
        { className: "type", begin: "!<" + t + ">" },
        { className: "type", begin: "!" + t },
        { className: "type", begin: "!!" + t },
        { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
        { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
        { className: "bullet", begin: "-(?=[ ]|$)", relevance: 0 },
        e.HASH_COMMENT_MODE,
        { beginKeywords: n, keywords: { literal: n } },
        a,
        { className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0 },
        s,
        l,
        r,
      ],
      c = [...u];
    return (
      c.pop(),
      c.push(o),
      (i.contains = c),
      { name: "YAML", case_insensitive: !0, aliases: ["yml"], contains: u }
    );
  },
  ve = xe,
  Ee = e(function (e, n) {
    !(function (e) {
      function n(e, n) {
        for (var t = 0; t < n.length; t++) {
          var r = n[t];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function t(e, t, r) {
        return (
          t && n(e.prototype, t),
          r && n(e, r),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
      }
      function r(e, n) {
        if (e) {
          if ("string" == typeof e) return o(e, n);
          var t = Object.prototype.toString.call(e).slice(8, -1);
          return (
            "Object" === t && e.constructor && (t = e.constructor.name),
            "Map" === t || "Set" === t
              ? Array.from(e)
              : "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              ? o(e, n)
              : void 0
          );
        }
      }
      function o(e, n) {
        (null == n || n > e.length) && (n = e.length);
        for (var t = 0, r = new Array(n); t < n; t++) r[t] = e[t];
        return r;
      }
      function a(e, n) {
        var t =
          ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (t) return (t = t.call(e)).next.bind(t);
        if (
          Array.isArray(e) ||
          (t = r(e)) ||
          (n && e && "number" == typeof e.length)
        ) {
          t && (e = t);
          var o = 0;
          return function () {
            return o >= e.length ? { done: !0 } : { done: !1, value: e[o++] };
          };
        }
        throw new TypeError(
          "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      }
      function i() {
        return {
          baseUrl: null,
          breaks: !1,
          extensions: null,
          gfm: !0,
          headerIds: !0,
          headerPrefix: "",
          highlight: null,
          langPrefix: "language-",
          mangle: !0,
          pedantic: !1,
          renderer: null,
          sanitize: !1,
          sanitizer: null,
          silent: !1,
          smartLists: !1,
          smartypants: !1,
          tokenizer: null,
          walkTokens: null,
          xhtml: !1,
        };
      }
      function s(n) {
        e.defaults = n;
      }
      e.defaults = i();
      var l = /[&<>"']/,
        u = /[&<>"']/g,
        c = /[<>"']|&(?!#?\w+;)/,
        d = /[<>"']|&(?!#?\w+;)/g,
        h = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        },
        p = function (e) {
          return h[e];
        };
      function m(e, n) {
        if (n) {
          if (l.test(e)) return e.replace(u, p);
        } else if (c.test(e)) return e.replace(d, p);
        return e;
      }
      var g = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
      function _(e) {
        return e.replace(g, function (e, n) {
          return "colon" === (n = n.toLowerCase())
            ? ":"
            : "#" === n.charAt(0)
            ? "x" === n.charAt(1)
              ? String.fromCharCode(parseInt(n.substring(2), 16))
              : String.fromCharCode(+n.substring(1))
            : "";
        });
      }
      var f = /(^|[^\[])\^/g;
      function b(e, n) {
        (e = "string" == typeof e ? e : e.source), (n = n || "");
        var t = {
          replace: function (n, r) {
            return (
              (r = (r = r.source || r).replace(f, "$1")),
              (e = e.replace(n, r)),
              t
            );
          },
          getRegex: function () {
            return new RegExp(e, n);
          },
        };
        return t;
      }
      var w = /[^\w:]/g,
        k = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
      function y(e, n, t) {
        if (e) {
          var r;
          try {
            r = decodeURIComponent(_(t)).replace(w, "").toLowerCase();
          } catch (e) {
            return null;
          }
          if (
            0 === r.indexOf("javascript:") ||
            0 === r.indexOf("vbscript:") ||
            0 === r.indexOf("data:")
          )
            return null;
        }
        n && !k.test(t) && (t = E(n, t));
        try {
          t = encodeURI(t).replace(/%25/g, "%");
        } catch (e) {
          return null;
        }
        return t;
      }
      var D = {},
        A = /^[^:]+:\/*[^/]*$/,
        x = /^([^:]+:)[\s\S]*$/,
        v = /^([^:]+:\/*[^/]*)[\s\S]*$/;
      function E(e, n) {
        D[" " + e] ||
          (A.test(e) ? (D[" " + e] = e + "/") : (D[" " + e] = z(e, "/", !0)));
        var t = -1 === (e = D[" " + e]).indexOf(":");
        return "//" === n.substring(0, 2)
          ? t
            ? n
            : e.replace(x, "$1") + n
          : "/" === n.charAt(0)
          ? t
            ? n
            : e.replace(v, "$1") + n
          : e + n;
      }
      var C = { exec: function () {} };
      function F(e) {
        for (var n, t, r = 1; r < arguments.length; r++)
          for (t in (n = arguments[r]))
            Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
        return e;
      }
      function B(e, n) {
        var t = e
            .replace(/\|/g, function (e, n, t) {
              for (var r = !1, o = n; --o >= 0 && "\\" === t[o]; ) r = !r;
              return r ? "|" : " |";
            })
            .split(/ \|/),
          r = 0;
        if (
          (t[0].trim() || t.shift(),
          t.length > 0 && !t[t.length - 1].trim() && t.pop(),
          t.length > n)
        )
          t.splice(n);
        else for (; t.length < n; ) t.push("");
        for (; r < t.length; r++) t[r] = t[r].trim().replace(/\\\|/g, "|");
        return t;
      }
      function z(e, n, t) {
        var r = e.length;
        if (0 === r) return "";
        for (var o = 0; o < r; ) {
          var a = e.charAt(r - o - 1);
          if (a !== n || t) {
            if (a === n || !t) break;
            o++;
          } else o++;
        }
        return e.slice(0, r - o);
      }
      function S(e, n) {
        if (-1 === e.indexOf(n[1])) return -1;
        for (var t = e.length, r = 0, o = 0; o < t; o++)
          if ("\\" === e[o]) o++;
          else if (e[o] === n[0]) r++;
          else if (e[o] === n[1] && --r < 0) return o;
        return -1;
      }
      function T(e) {
        e &&
          e.sanitize &&
          !e.silent &&
          console.warn(
            "marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options"
          );
      }
      function N(e, n) {
        if (n < 1) return "";
        for (var t = ""; n > 1; ) 1 & n && (t += e), (n >>= 1), (e += e);
        return t + e;
      }
      function O(e, n, t, r) {
        var o = n.href,
          a = n.title ? m(n.title) : null,
          i = e[1].replace(/\\([\[\]])/g, "$1");
        if ("!" !== e[0].charAt(0)) {
          r.state.inLink = !0;
          var s = {
            type: "link",
            raw: t,
            href: o,
            title: a,
            text: i,
            tokens: r.inlineTokens(i, []),
          };
          return (r.state.inLink = !1), s;
        }
        return { type: "image", raw: t, href: o, title: a, text: m(i) };
      }
      function j(e, n) {
        var t = e.match(/^(\s+)(?:```)/);
        if (null === t) return n;
        var r = t[1];
        return n
          .split("\n")
          .map(function (e) {
            var n = e.match(/^\s+/);
            return null === n
              ? e
              : n[0].length >= r.length
              ? e.slice(r.length)
              : e;
          })
          .join("\n");
      }
      var R = (function () {
          function n(n) {
            this.options = n || e.defaults;
          }
          var t = n.prototype;
          return (
            (t.space = function (e) {
              var n = this.rules.block.newline.exec(e);
              if (n && n[0].length > 0) return { type: "space", raw: n[0] };
            }),
            (t.code = function (e) {
              var n = this.rules.block.code.exec(e);
              if (n) {
                var t = n[0].replace(/^ {1,4}/gm, "");
                return {
                  type: "code",
                  raw: n[0],
                  codeBlockStyle: "indented",
                  text: this.options.pedantic ? t : z(t, "\n"),
                };
              }
            }),
            (t.fences = function (e) {
              var n = this.rules.block.fences.exec(e);
              if (n) {
                var t = n[0],
                  r = j(t, n[3] || "");
                return {
                  type: "code",
                  raw: t,
                  lang: n[2] ? n[2].trim() : n[2],
                  text: r,
                };
              }
            }),
            (t.heading = function (e) {
              var n = this.rules.block.heading.exec(e);
              if (n) {
                var t = n[2].trim();
                if (/#$/.test(t)) {
                  var r = z(t, "#");
                  this.options.pedantic
                    ? (t = r.trim())
                    : (r && !/ $/.test(r)) || (t = r.trim());
                }
                var o = {
                  type: "heading",
                  raw: n[0],
                  depth: n[1].length,
                  text: t,
                  tokens: [],
                };
                return this.lexer.inline(o.text, o.tokens), o;
              }
            }),
            (t.hr = function (e) {
              var n = this.rules.block.hr.exec(e);
              if (n) return { type: "hr", raw: n[0] };
            }),
            (t.blockquote = function (e) {
              var n = this.rules.block.blockquote.exec(e);
              if (n) {
                var t = n[0].replace(/^ *>[ \t]?/gm, "");
                return {
                  type: "blockquote",
                  raw: n[0],
                  tokens: this.lexer.blockTokens(t, []),
                  text: t,
                };
              }
            }),
            (t.list = function (e) {
              var n = this.rules.block.list.exec(e);
              if (n) {
                var t,
                  r,
                  o,
                  i,
                  s,
                  l,
                  u,
                  c,
                  d,
                  h,
                  p,
                  m,
                  g = n[1].trim(),
                  _ = g.length > 1,
                  f = {
                    type: "list",
                    raw: "",
                    ordered: _,
                    start: _ ? +g.slice(0, -1) : "",
                    loose: !1,
                    items: [],
                  };
                (g = _ ? "\\d{1,9}\\" + g.slice(-1) : "\\" + g),
                  this.options.pedantic && (g = _ ? g : "[*+-]");
                for (
                  var b = new RegExp(
                    "^( {0,3}" + g + ")((?:[\t ][^\\n]*)?(?:\\n|$))"
                  );
                  e &&
                  ((m = !1), (n = b.exec(e))) &&
                  !this.rules.block.hr.test(e);

                ) {
                  if (
                    ((t = n[0]),
                    (e = e.substring(t.length)),
                    (c = n[2].split("\n", 1)[0]),
                    (d = e.split("\n", 1)[0]),
                    this.options.pedantic
                      ? ((i = 2), (p = c.trimLeft()))
                      : ((i = (i = n[2].search(/[^ ]/)) > 4 ? 1 : i),
                        (p = c.slice(i)),
                        (i += n[1].length)),
                    (l = !1),
                    !c &&
                      /^ *$/.test(d) &&
                      ((t += d + "\n"),
                      (e = e.substring(d.length + 1)),
                      (m = !0)),
                    !m)
                  )
                    for (
                      var w = new RegExp(
                          "^ {0," +
                            Math.min(3, i - 1) +
                            "}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))"
                        ),
                        k = new RegExp(
                          "^ {0," +
                            Math.min(3, i - 1) +
                            "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)"
                        ),
                        y = new RegExp(
                          "^ {0," + Math.min(3, i - 1) + "}(?:```|~~~)"
                        ),
                        D = new RegExp("^ {0," + Math.min(3, i - 1) + "}#");
                      e &&
                      ((c = h = e.split("\n", 1)[0]),
                      this.options.pedantic &&
                        (c = c.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")),
                      !y.test(c)) &&
                      !D.test(c) &&
                      !w.test(c) &&
                      !k.test(e);

                    ) {
                      if (c.search(/[^ ]/) >= i || !c.trim())
                        p += "\n" + c.slice(i);
                      else {
                        if (l) break;
                        p += "\n" + c;
                      }
                      l || c.trim() || (l = !0),
                        (t += h + "\n"),
                        (e = e.substring(h.length + 1));
                    }
                  f.loose ||
                    (u ? (f.loose = !0) : /\n *\n *$/.test(t) && (u = !0)),
                    this.options.gfm &&
                      (r = /^\[[ xX]\] /.exec(p)) &&
                      ((o = "[ ] " !== r[0]),
                      (p = p.replace(/^\[[ xX]\] +/, ""))),
                    f.items.push({
                      type: "list_item",
                      raw: t,
                      task: !!r,
                      checked: o,
                      loose: !1,
                      text: p,
                    }),
                    (f.raw += t);
                }
                (f.items[f.items.length - 1].raw = t.trimRight()),
                  (f.items[f.items.length - 1].text = p.trimRight()),
                  (f.raw = f.raw.trimRight());
                var A = f.items.length;
                for (s = 0; s < A; s++) {
                  (this.lexer.state.top = !1),
                    (f.items[s].tokens = this.lexer.blockTokens(
                      f.items[s].text,
                      []
                    ));
                  var x = f.items[s].tokens.filter(function (e) {
                      return "space" === e.type;
                    }),
                    v = x.every(function (e) {
                      for (
                        var n, t = 0, r = a(e.raw.split(""));
                        !(n = r()).done;

                      )
                        if (("\n" === n.value && (t += 1), t > 1)) return !0;
                      return !1;
                    });
                  !f.loose &&
                    x.length &&
                    v &&
                    ((f.loose = !0), (f.items[s].loose = !0));
                }
                return f;
              }
            }),
            (t.html = function (e) {
              var n = this.rules.block.html.exec(e);
              if (n) {
                var t = {
                  type: "html",
                  raw: n[0],
                  pre:
                    !this.options.sanitizer &&
                    ("pre" === n[1] || "script" === n[1] || "style" === n[1]),
                  text: n[0],
                };
                return (
                  this.options.sanitize &&
                    ((t.type = "paragraph"),
                    (t.text = this.options.sanitizer
                      ? this.options.sanitizer(n[0])
                      : m(n[0])),
                    (t.tokens = []),
                    this.lexer.inline(t.text, t.tokens)),
                  t
                );
              }
            }),
            (t.def = function (e) {
              var n = this.rules.block.def.exec(e);
              if (n)
                return (
                  n[3] && (n[3] = n[3].substring(1, n[3].length - 1)),
                  {
                    type: "def",
                    tag: n[1].toLowerCase().replace(/\s+/g, " "),
                    raw: n[0],
                    href: n[2],
                    title: n[3],
                  }
                );
            }),
            (t.table = function (e) {
              var n = this.rules.block.table.exec(e);
              if (n) {
                var t = {
                  type: "table",
                  header: B(n[1]).map(function (e) {
                    return { text: e };
                  }),
                  align: n[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                  rows:
                    n[3] && n[3].trim()
                      ? n[3].replace(/\n[ \t]*$/, "").split("\n")
                      : [],
                };
                if (t.header.length === t.align.length) {
                  t.raw = n[0];
                  var r,
                    o,
                    a,
                    i,
                    s = t.align.length;
                  for (r = 0; r < s; r++)
                    /^ *-+: *$/.test(t.align[r])
                      ? (t.align[r] = "right")
                      : /^ *:-+: *$/.test(t.align[r])
                      ? (t.align[r] = "center")
                      : /^ *:-+ *$/.test(t.align[r])
                      ? (t.align[r] = "left")
                      : (t.align[r] = null);
                  for (s = t.rows.length, r = 0; r < s; r++)
                    t.rows[r] = B(t.rows[r], t.header.length).map(function (e) {
                      return { text: e };
                    });
                  for (s = t.header.length, o = 0; o < s; o++)
                    (t.header[o].tokens = []),
                      this.lexer.inline(t.header[o].text, t.header[o].tokens);
                  for (s = t.rows.length, o = 0; o < s; o++)
                    for (i = t.rows[o], a = 0; a < i.length; a++)
                      (i[a].tokens = []),
                        this.lexer.inline(i[a].text, i[a].tokens);
                  return t;
                }
              }
            }),
            (t.lheading = function (e) {
              var n = this.rules.block.lheading.exec(e);
              if (n) {
                var t = {
                  type: "heading",
                  raw: n[0],
                  depth: "=" === n[2].charAt(0) ? 1 : 2,
                  text: n[1],
                  tokens: [],
                };
                return this.lexer.inline(t.text, t.tokens), t;
              }
            }),
            (t.paragraph = function (e) {
              var n = this.rules.block.paragraph.exec(e);
              if (n) {
                var t = {
                  type: "paragraph",
                  raw: n[0],
                  text:
                    "\n" === n[1].charAt(n[1].length - 1)
                      ? n[1].slice(0, -1)
                      : n[1],
                  tokens: [],
                };
                return this.lexer.inline(t.text, t.tokens), t;
              }
            }),
            (t.text = function (e) {
              var n = this.rules.block.text.exec(e);
              if (n) {
                var t = { type: "text", raw: n[0], text: n[0], tokens: [] };
                return this.lexer.inline(t.text, t.tokens), t;
              }
            }),
            (t.escape = function (e) {
              var n = this.rules.inline.escape.exec(e);
              if (n) return { type: "escape", raw: n[0], text: m(n[1]) };
            }),
            (t.tag = function (e) {
              var n = this.rules.inline.tag.exec(e);
              if (n)
                return (
                  !this.lexer.state.inLink && /^<a /i.test(n[0])
                    ? (this.lexer.state.inLink = !0)
                    : this.lexer.state.inLink &&
                      /^<\/a>/i.test(n[0]) &&
                      (this.lexer.state.inLink = !1),
                  !this.lexer.state.inRawBlock &&
                  /^<(pre|code|kbd|script)(\s|>)/i.test(n[0])
                    ? (this.lexer.state.inRawBlock = !0)
                    : this.lexer.state.inRawBlock &&
                      /^<\/(pre|code|kbd|script)(\s|>)/i.test(n[0]) &&
                      (this.lexer.state.inRawBlock = !1),
                  {
                    type: this.options.sanitize ? "text" : "html",
                    raw: n[0],
                    inLink: this.lexer.state.inLink,
                    inRawBlock: this.lexer.state.inRawBlock,
                    text: this.options.sanitize
                      ? this.options.sanitizer
                        ? this.options.sanitizer(n[0])
                        : m(n[0])
                      : n[0],
                  }
                );
            }),
            (t.link = function (e) {
              var n = this.rules.inline.link.exec(e);
              if (n) {
                var t = n[2].trim();
                if (!this.options.pedantic && /^</.test(t)) {
                  if (!/>$/.test(t)) return;
                  var r = z(t.slice(0, -1), "\\");
                  if ((t.length - r.length) % 2 == 0) return;
                } else {
                  var o = S(n[2], "()");
                  if (o > -1) {
                    var a = (0 === n[0].indexOf("!") ? 5 : 4) + n[1].length + o;
                    (n[2] = n[2].substring(0, o)),
                      (n[0] = n[0].substring(0, a).trim()),
                      (n[3] = "");
                  }
                }
                var i = n[2],
                  s = "";
                if (this.options.pedantic) {
                  var l = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);
                  l && ((i = l[1]), (s = l[3]));
                } else s = n[3] ? n[3].slice(1, -1) : "";
                return (
                  (i = i.trim()),
                  /^</.test(i) &&
                    (i =
                      this.options.pedantic && !/>$/.test(t)
                        ? i.slice(1)
                        : i.slice(1, -1)),
                  O(
                    n,
                    {
                      href: i ? i.replace(this.rules.inline._escapes, "$1") : i,
                      title: s
                        ? s.replace(this.rules.inline._escapes, "$1")
                        : s,
                    },
                    n[0],
                    this.lexer
                  )
                );
              }
            }),
            (t.reflink = function (e, n) {
              var t;
              if (
                (t = this.rules.inline.reflink.exec(e)) ||
                (t = this.rules.inline.nolink.exec(e))
              ) {
                var r = (t[2] || t[1]).replace(/\s+/g, " ");
                if (!(r = n[r.toLowerCase()]) || !r.href) {
                  var o = t[0].charAt(0);
                  return { type: "text", raw: o, text: o };
                }
                return O(t, r, t[0], this.lexer);
              }
            }),
            (t.emStrong = function (e, n, t) {
              void 0 === t && (t = "");
              var r = this.rules.inline.emStrong.lDelim.exec(e);
              if (
                r &&
                (!r[3] ||
                  !t.match(
                    /(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/
                  ))
              ) {
                var o = r[1] || r[2] || "";
                if (
                  !o ||
                  (o && ("" === t || this.rules.inline.punctuation.exec(t)))
                ) {
                  var a,
                    i,
                    s = r[0].length - 1,
                    l = s,
                    u = 0,
                    c =
                      "*" === r[0][0]
                        ? this.rules.inline.emStrong.rDelimAst
                        : this.rules.inline.emStrong.rDelimUnd;
                  for (
                    c.lastIndex = 0, n = n.slice(-1 * e.length + s);
                    null != (r = c.exec(n));

                  )
                    if ((a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]))
                      if (((i = a.length), r[3] || r[4])) l += i;
                      else if (!((r[5] || r[6]) && s % 3) || (s + i) % 3) {
                        if (!((l -= i) > 0)) {
                          if (
                            ((i = Math.min(i, i + l + u)), Math.min(s, i) % 2)
                          ) {
                            var d = e.slice(1, s + r.index + i);
                            return {
                              type: "em",
                              raw: e.slice(0, s + r.index + i + 1),
                              text: d,
                              tokens: this.lexer.inlineTokens(d, []),
                            };
                          }
                          var h = e.slice(2, s + r.index + i - 1);
                          return {
                            type: "strong",
                            raw: e.slice(0, s + r.index + i + 1),
                            text: h,
                            tokens: this.lexer.inlineTokens(h, []),
                          };
                        }
                      } else u += i;
                }
              }
            }),
            (t.codespan = function (e) {
              var n = this.rules.inline.code.exec(e);
              if (n) {
                var t = n[2].replace(/\n/g, " "),
                  r = /[^ ]/.test(t),
                  o = /^ /.test(t) && / $/.test(t);
                return (
                  r && o && (t = t.substring(1, t.length - 1)),
                  (t = m(t, !0)),
                  { type: "codespan", raw: n[0], text: t }
                );
              }
            }),
            (t.br = function (e) {
              var n = this.rules.inline.br.exec(e);
              if (n) return { type: "br", raw: n[0] };
            }),
            (t.del = function (e) {
              var n = this.rules.inline.del.exec(e);
              if (n)
                return {
                  type: "del",
                  raw: n[0],
                  text: n[2],
                  tokens: this.lexer.inlineTokens(n[2], []),
                };
            }),
            (t.autolink = function (e, n) {
              var t,
                r,
                o = this.rules.inline.autolink.exec(e);
              if (o)
                return (
                  (r =
                    "@" === o[2]
                      ? "mailto:" +
                        (t = m(this.options.mangle ? n(o[1]) : o[1]))
                      : (t = m(o[1]))),
                  {
                    type: "link",
                    raw: o[0],
                    text: t,
                    href: r,
                    tokens: [{ type: "text", raw: t, text: t }],
                  }
                );
            }),
            (t.url = function (e, n) {
              var t;
              if ((t = this.rules.inline.url.exec(e))) {
                var r, o;
                if ("@" === t[2])
                  o = "mailto:" + (r = m(this.options.mangle ? n(t[0]) : t[0]));
                else {
                  var a;
                  do {
                    (a = t[0]),
                      (t[0] = this.rules.inline._backpedal.exec(t[0])[0]);
                  } while (a !== t[0]);
                  (r = m(t[0])), (o = "www." === t[1] ? "http://" + r : r);
                }
                return {
                  type: "link",
                  raw: t[0],
                  text: r,
                  href: o,
                  tokens: [{ type: "text", raw: r, text: r }],
                };
              }
            }),
            (t.inlineText = function (e, n) {
              var t,
                r = this.rules.inline.text.exec(e);
              if (r)
                return (
                  (t = this.lexer.state.inRawBlock
                    ? this.options.sanitize
                      ? this.options.sanitizer
                        ? this.options.sanitizer(r[0])
                        : m(r[0])
                      : r[0]
                    : m(this.options.smartypants ? n(r[0]) : r[0])),
                  { type: "text", raw: r[0], text: t }
                );
            }),
            n
          );
        })(),
        M = {
          newline: /^(?: *(?:\n|$))+/,
          code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
          fences:
            /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
          hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
          heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
          blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
          list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
          html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
          def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
          table: C,
          lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
          _paragraph:
            /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
          text: /^[^\n]+/,
          _label: /(?!\s*\])(?:\\.|[^\[\]\\])+/,
          _title:
            /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,
        };
      (M.def = b(M.def)
        .replace("label", M._label)
        .replace("title", M._title)
        .getRegex()),
        (M.bullet = /(?:[*+-]|\d{1,9}[.)])/),
        (M.listItemStart = b(/^( *)(bull) */)
          .replace("bull", M.bullet)
          .getRegex()),
        (M.list = b(M.list)
          .replace(/bull/g, M.bullet)
          .replace(
            "hr",
            "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))"
          )
          .replace("def", "\\n+(?=" + M.def.source + ")")
          .getRegex()),
        (M._tag =
          "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"),
        (M._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/),
        (M.html = b(M.html, "i")
          .replace("comment", M._comment)
          .replace("tag", M._tag)
          .replace(
            "attribute",
            / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
          )
          .getRegex()),
        (M.paragraph = b(M._paragraph)
          .replace("hr", M.hr)
          .replace("heading", " {0,3}#{1,6} ")
          .replace("|lheading", "")
          .replace("|table", "")
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", M._tag)
          .getRegex()),
        (M.blockquote = b(M.blockquote)
          .replace("paragraph", M.paragraph)
          .getRegex()),
        (M.normal = F({}, M)),
        (M.gfm = F({}, M.normal, {
          table:
            "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
        })),
        (M.gfm.table = b(M.gfm.table)
          .replace("hr", M.hr)
          .replace("heading", " {0,3}#{1,6} ")
          .replace("blockquote", " {0,3}>")
          .replace("code", " {4}[^\\n]")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", M._tag)
          .getRegex()),
        (M.gfm.paragraph = b(M._paragraph)
          .replace("hr", M.hr)
          .replace("heading", " {0,3}#{1,6} ")
          .replace("|lheading", "")
          .replace("table", M.gfm.table)
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", M._tag)
          .getRegex()),
        (M.pedantic = F({}, M.normal, {
          html: b(
            "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
          )
            .replace("comment", M._comment)
            .replace(
              /tag/g,
              "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
            )
            .getRegex(),
          def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
          heading: /^(#{1,6})(.*)(?:\n+|$)/,
          fences: C,
          paragraph: b(M.normal._paragraph)
            .replace("hr", M.hr)
            .replace("heading", " *#{1,6} *[^\n]")
            .replace("lheading", M.lheading)
            .replace("blockquote", " {0,3}>")
            .replace("|fences", "")
            .replace("|list", "")
            .replace("|html", "")
            .getRegex(),
        }));
      var I = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: C,
        tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(ref)\]/,
        nolink: /^!?\[(ref)\](?:\[\])?/,
        reflinkSearch: "reflink|nolink(?!\\()",
        emStrong: {
          lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
          rDelimAst:
            /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
          rDelimUnd:
            /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: C,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/,
      };
      function L(e) {
        return e
          .replace(/---/g, "—")
          .replace(/--/g, "–")
          .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘")
          .replace(/'/g, "’")
          .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“")
          .replace(/"/g, "”")
          .replace(/\.{3}/g, "…");
      }
      function $(e) {
        var n,
          t,
          r = "",
          o = e.length;
        for (n = 0; n < o; n++)
          (t = e.charCodeAt(n)),
            Math.random() > 0.5 && (t = "x" + t.toString(16)),
            (r += "&#" + t + ";");
        return r;
      }
      (I._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~"),
        (I.punctuation = b(I.punctuation)
          .replace(/punctuation/g, I._punctuation)
          .getRegex()),
        (I.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g),
        (I.escapedEmSt = /\\\*|\\_/g),
        (I._comment = b(M._comment)
          .replace("(?:--\x3e|$)", "--\x3e")
          .getRegex()),
        (I.emStrong.lDelim = b(I.emStrong.lDelim)
          .replace(/punct/g, I._punctuation)
          .getRegex()),
        (I.emStrong.rDelimAst = b(I.emStrong.rDelimAst, "g")
          .replace(/punct/g, I._punctuation)
          .getRegex()),
        (I.emStrong.rDelimUnd = b(I.emStrong.rDelimUnd, "g")
          .replace(/punct/g, I._punctuation)
          .getRegex()),
        (I._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g),
        (I._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/),
        (I._email =
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/),
        (I.autolink = b(I.autolink)
          .replace("scheme", I._scheme)
          .replace("email", I._email)
          .getRegex()),
        (I._attribute =
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/),
        (I.tag = b(I.tag)
          .replace("comment", I._comment)
          .replace("attribute", I._attribute)
          .getRegex()),
        (I._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/),
        (I._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/),
        (I._title =
          /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/),
        (I.link = b(I.link)
          .replace("label", I._label)
          .replace("href", I._href)
          .replace("title", I._title)
          .getRegex()),
        (I.reflink = b(I.reflink)
          .replace("label", I._label)
          .replace("ref", M._label)
          .getRegex()),
        (I.nolink = b(I.nolink).replace("ref", M._label).getRegex()),
        (I.reflinkSearch = b(I.reflinkSearch, "g")
          .replace("reflink", I.reflink)
          .replace("nolink", I.nolink)
          .getRegex()),
        (I.normal = F({}, I)),
        (I.pedantic = F({}, I.normal, {
          strong: {
            start: /^__|\*\*/,
            middle:
              /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            endAst: /\*\*(?!\*)/g,
            endUnd: /__(?!_)/g,
          },
          em: {
            start: /^_|\*/,
            middle:
              /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
            endAst: /\*(?!\*)/g,
            endUnd: /_(?!_)/g,
          },
          link: b(/^!?\[(label)\]\((.*?)\)/)
            .replace("label", I._label)
            .getRegex(),
          reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/)
            .replace("label", I._label)
            .getRegex(),
        })),
        (I.gfm = F({}, I.normal, {
          escape: b(I.escape).replace("])", "~|])").getRegex(),
          _extended_email:
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
          url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
          _backpedal:
            /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
          del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
          text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
        })),
        (I.gfm.url = b(I.gfm.url, "i")
          .replace("email", I.gfm._extended_email)
          .getRegex()),
        (I.breaks = F({}, I.gfm, {
          br: b(I.br).replace("{2,}", "*").getRegex(),
          text: b(I.gfm.text)
            .replace("\\b_", "\\b_| {2,}\\n")
            .replace(/\{2,\}/g, "*")
            .getRegex(),
        }));
      var U = (function () {
          function n(n) {
            (this.tokens = []),
              (this.tokens.links = Object.create(null)),
              (this.options = n || e.defaults),
              (this.options.tokenizer = this.options.tokenizer || new R()),
              (this.tokenizer = this.options.tokenizer),
              (this.tokenizer.options = this.options),
              (this.tokenizer.lexer = this),
              (this.inlineQueue = []),
              (this.state = { inLink: !1, inRawBlock: !1, top: !0 });
            var t = { block: M.normal, inline: I.normal };
            this.options.pedantic
              ? ((t.block = M.pedantic), (t.inline = I.pedantic))
              : this.options.gfm &&
                ((t.block = M.gfm),
                this.options.breaks
                  ? (t.inline = I.breaks)
                  : (t.inline = I.gfm)),
              (this.tokenizer.rules = t);
          }
          (n.lex = function (e, t) {
            return new n(t).lex(e);
          }),
            (n.lexInline = function (e, t) {
              return new n(t).inlineTokens(e);
            });
          var r = n.prototype;
          return (
            (r.lex = function (e) {
              var n;
              for (
                e = e.replace(/\r\n|\r/g, "\n"),
                  this.blockTokens(e, this.tokens);
                (n = this.inlineQueue.shift());

              )
                this.inlineTokens(n.src, n.tokens);
              return this.tokens;
            }),
            (r.blockTokens = function (e, n) {
              var t,
                r,
                o,
                a,
                i = this;
              for (
                void 0 === n && (n = []),
                  e = this.options.pedantic
                    ? e.replace(/\t/g, "    ").replace(/^ +$/gm, "")
                    : e.replace(/^( *)(\t+)/gm, function (e, n, t) {
                        return n + "    ".repeat(t.length);
                      });
                e;

              )
                if (
                  !(
                    this.options.extensions &&
                    this.options.extensions.block &&
                    this.options.extensions.block.some(function (r) {
                      return (
                        !!(t = r.call({ lexer: i }, e, n)) &&
                        ((e = e.substring(t.raw.length)), n.push(t), !0)
                      );
                    })
                  )
                )
                  if ((t = this.tokenizer.space(e)))
                    (e = e.substring(t.raw.length)),
                      1 === t.raw.length && n.length > 0
                        ? (n[n.length - 1].raw += "\n")
                        : n.push(t);
                  else if ((t = this.tokenizer.code(e)))
                    (e = e.substring(t.raw.length)),
                      !(r = n[n.length - 1]) ||
                      ("paragraph" !== r.type && "text" !== r.type)
                        ? n.push(t)
                        : ((r.raw += "\n" + t.raw),
                          (r.text += "\n" + t.text),
                          (this.inlineQueue[this.inlineQueue.length - 1].src =
                            r.text));
                  else if ((t = this.tokenizer.fences(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.heading(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.hr(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.blockquote(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.list(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.html(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.def(e)))
                    (e = e.substring(t.raw.length)),
                      !(r = n[n.length - 1]) ||
                      ("paragraph" !== r.type && "text" !== r.type)
                        ? this.tokens.links[t.tag] ||
                          (this.tokens.links[t.tag] = {
                            href: t.href,
                            title: t.title,
                          })
                        : ((r.raw += "\n" + t.raw),
                          (r.text += "\n" + t.raw),
                          (this.inlineQueue[this.inlineQueue.length - 1].src =
                            r.text));
                  else if ((t = this.tokenizer.table(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.lheading(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if (
                    ((o = e),
                    this.options.extensions &&
                      this.options.extensions.startBlock &&
                      (function () {
                        var n = 1 / 0,
                          t = e.slice(1),
                          r = void 0;
                        i.options.extensions.startBlock.forEach(function (e) {
                          "number" == typeof (r = e.call({ lexer: this }, t)) &&
                            r >= 0 &&
                            (n = Math.min(n, r));
                        }),
                          n < 1 / 0 && n >= 0 && (o = e.substring(0, n + 1));
                      })(),
                    this.state.top && (t = this.tokenizer.paragraph(o)))
                  )
                    (r = n[n.length - 1]),
                      a && "paragraph" === r.type
                        ? ((r.raw += "\n" + t.raw),
                          (r.text += "\n" + t.text),
                          this.inlineQueue.pop(),
                          (this.inlineQueue[this.inlineQueue.length - 1].src =
                            r.text))
                        : n.push(t),
                      (a = o.length !== e.length),
                      (e = e.substring(t.raw.length));
                  else if ((t = this.tokenizer.text(e)))
                    (e = e.substring(t.raw.length)),
                      (r = n[n.length - 1]) && "text" === r.type
                        ? ((r.raw += "\n" + t.raw),
                          (r.text += "\n" + t.text),
                          this.inlineQueue.pop(),
                          (this.inlineQueue[this.inlineQueue.length - 1].src =
                            r.text))
                        : n.push(t);
                  else if (e) {
                    var s = "Infinite loop on byte: " + e.charCodeAt(0);
                    if (this.options.silent) {
                      console.error(s);
                      break;
                    }
                    throw new Error(s);
                  }
              return (this.state.top = !0), n;
            }),
            (r.inline = function (e, n) {
              return (
                void 0 === n && (n = []),
                this.inlineQueue.push({ src: e, tokens: n }),
                n
              );
            }),
            (r.inlineTokens = function (e, n) {
              var t,
                r,
                o,
                a = this;
              void 0 === n && (n = []);
              var i,
                s,
                l,
                u = e;
              if (this.tokens.links) {
                var c = Object.keys(this.tokens.links);
                if (c.length > 0)
                  for (
                    ;
                    null !=
                    (i = this.tokenizer.rules.inline.reflinkSearch.exec(u));

                  )
                    c.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) &&
                      (u =
                        u.slice(0, i.index) +
                        "[" +
                        N("a", i[0].length - 2) +
                        "]" +
                        u.slice(
                          this.tokenizer.rules.inline.reflinkSearch.lastIndex
                        ));
              }
              for (
                ;
                null != (i = this.tokenizer.rules.inline.blockSkip.exec(u));

              )
                u =
                  u.slice(0, i.index) +
                  "[" +
                  N("a", i[0].length - 2) +
                  "]" +
                  u.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
              for (
                ;
                null != (i = this.tokenizer.rules.inline.escapedEmSt.exec(u));

              )
                u =
                  u.slice(0, i.index) +
                  "++" +
                  u.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
              for (; e; )
                if (
                  (s || (l = ""),
                  (s = !1),
                  !(
                    this.options.extensions &&
                    this.options.extensions.inline &&
                    this.options.extensions.inline.some(function (r) {
                      return (
                        !!(t = r.call({ lexer: a }, e, n)) &&
                        ((e = e.substring(t.raw.length)), n.push(t), !0)
                      );
                    })
                  ))
                )
                  if ((t = this.tokenizer.escape(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.tag(e)))
                    (e = e.substring(t.raw.length)),
                      (r = n[n.length - 1]) &&
                      "text" === t.type &&
                      "text" === r.type
                        ? ((r.raw += t.raw), (r.text += t.text))
                        : n.push(t);
                  else if ((t = this.tokenizer.link(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.reflink(e, this.tokens.links)))
                    (e = e.substring(t.raw.length)),
                      (r = n[n.length - 1]) &&
                      "text" === t.type &&
                      "text" === r.type
                        ? ((r.raw += t.raw), (r.text += t.text))
                        : n.push(t);
                  else if ((t = this.tokenizer.emStrong(e, u, l)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.codespan(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.br(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.del(e)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if ((t = this.tokenizer.autolink(e, $)))
                    (e = e.substring(t.raw.length)), n.push(t);
                  else if (
                    this.state.inLink ||
                    !(t = this.tokenizer.url(e, $))
                  ) {
                    if (
                      ((o = e),
                      this.options.extensions &&
                        this.options.extensions.startInline &&
                        (function () {
                          var n = 1 / 0,
                            t = e.slice(1),
                            r = void 0;
                          a.options.extensions.startInline.forEach(
                            function (e) {
                              "number" ==
                                typeof (r = e.call({ lexer: this }, t)) &&
                                r >= 0 &&
                                (n = Math.min(n, r));
                            }
                          ),
                            n < 1 / 0 && n >= 0 && (o = e.substring(0, n + 1));
                        })(),
                      (t = this.tokenizer.inlineText(o, L)))
                    )
                      (e = e.substring(t.raw.length)),
                        "_" !== t.raw.slice(-1) && (l = t.raw.slice(-1)),
                        (s = !0),
                        (r = n[n.length - 1]) && "text" === r.type
                          ? ((r.raw += t.raw), (r.text += t.text))
                          : n.push(t);
                    else if (e) {
                      var d = "Infinite loop on byte: " + e.charCodeAt(0);
                      if (this.options.silent) {
                        console.error(d);
                        break;
                      }
                      throw new Error(d);
                    }
                  } else (e = e.substring(t.raw.length)), n.push(t);
              return n;
            }),
            t(n, null, [
              {
                key: "rules",
                get: function () {
                  return { block: M, inline: I };
                },
              },
            ]),
            n
          );
        })(),
        P = (function () {
          function n(n) {
            this.options = n || e.defaults;
          }
          var t = n.prototype;
          return (
            (t.code = function (e, n, t) {
              var r = (n || "").match(/\S*/)[0];
              if (this.options.highlight) {
                var o = this.options.highlight(e, r);
                null != o && o !== e && ((t = !0), (e = o));
              }
              return (
                (e = e.replace(/\n$/, "") + "\n"),
                r
                  ? '<pre><code class="' +
                    this.options.langPrefix +
                    m(r, !0) +
                    '">' +
                    (t ? e : m(e, !0)) +
                    "</code></pre>\n"
                  : "<pre><code>" + (t ? e : m(e, !0)) + "</code></pre>\n"
              );
            }),
            (t.blockquote = function (e) {
              return "<blockquote>\n" + e + "</blockquote>\n";
            }),
            (t.html = function (e) {
              return e;
            }),
            (t.heading = function (e, n, t, r) {
              return this.options.headerIds
                ? "<h" +
                    n +
                    ' id="' +
                    (this.options.headerPrefix + r.slug(t)) +
                    '">' +
                    e +
                    "</h" +
                    n +
                    ">\n"
                : "<h" + n + ">" + e + "</h" + n + ">\n";
            }),
            (t.hr = function () {
              return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
            }),
            (t.list = function (e, n, t) {
              var r = n ? "ol" : "ul";
              return (
                "<" +
                r +
                (n && 1 !== t ? ' start="' + t + '"' : "") +
                ">\n" +
                e +
                "</" +
                r +
                ">\n"
              );
            }),
            (t.listitem = function (e) {
              return "<li>" + e + "</li>\n";
            }),
            (t.checkbox = function (e) {
              return (
                "<input " +
                (e ? 'checked="" ' : "") +
                'disabled="" type="checkbox"' +
                (this.options.xhtml ? " /" : "") +
                "> "
              );
            }),
            (t.paragraph = function (e) {
              return "<p>" + e + "</p>\n";
            }),
            (t.table = function (e, n) {
              return (
                n && (n = "<tbody>" + n + "</tbody>"),
                "<table>\n<thead>\n" + e + "</thead>\n" + n + "</table>\n"
              );
            }),
            (t.tablerow = function (e) {
              return "<tr>\n" + e + "</tr>\n";
            }),
            (t.tablecell = function (e, n) {
              var t = n.header ? "th" : "td";
              return (
                (n.align
                  ? "<" + t + ' align="' + n.align + '">'
                  : "<" + t + ">") +
                e +
                "</" +
                t +
                ">\n"
              );
            }),
            (t.strong = function (e) {
              return "<strong>" + e + "</strong>";
            }),
            (t.em = function (e) {
              return "<em>" + e + "</em>";
            }),
            (t.codespan = function (e) {
              return "<code>" + e + "</code>";
            }),
            (t.br = function () {
              return this.options.xhtml ? "<br/>" : "<br>";
            }),
            (t.del = function (e) {
              return "<del>" + e + "</del>";
            }),
            (t.link = function (e, n, t) {
              if (
                null === (e = y(this.options.sanitize, this.options.baseUrl, e))
              )
                return t;
              var r = '<a href="' + m(e) + '"';
              return n && (r += ' title="' + n + '"'), (r += ">" + t + "</a>");
            }),
            (t.image = function (e, n, t) {
              if (
                null === (e = y(this.options.sanitize, this.options.baseUrl, e))
              )
                return t;
              var r = '<img src="' + e + '" alt="' + t + '"';
              return (
                n && (r += ' title="' + n + '"'),
                (r += this.options.xhtml ? "/>" : ">")
              );
            }),
            (t.text = function (e) {
              return e;
            }),
            n
          );
        })(),
        q = (function () {
          function e() {}
          var n = e.prototype;
          return (
            (n.strong = function (e) {
              return e;
            }),
            (n.em = function (e) {
              return e;
            }),
            (n.codespan = function (e) {
              return e;
            }),
            (n.del = function (e) {
              return e;
            }),
            (n.html = function (e) {
              return e;
            }),
            (n.text = function (e) {
              return e;
            }),
            (n.link = function (e, n, t) {
              return "" + t;
            }),
            (n.image = function (e, n, t) {
              return "" + t;
            }),
            (n.br = function () {
              return "";
            }),
            e
          );
        })(),
        H = (function () {
          function e() {
            this.seen = {};
          }
          var n = e.prototype;
          return (
            (n.serialize = function (e) {
              return e
                .toLowerCase()
                .trim()
                .replace(/<[!\/a-z].*?>/gi, "")
                .replace(
                  /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
                  ""
                )
                .replace(/\s/g, "-");
            }),
            (n.getNextSafeSlug = function (e, n) {
              var t = e,
                r = 0;
              if (this.seen.hasOwnProperty(t)) {
                r = this.seen[e];
                do {
                  t = e + "-" + ++r;
                } while (this.seen.hasOwnProperty(t));
              }
              return n || ((this.seen[e] = r), (this.seen[t] = 0)), t;
            }),
            (n.slug = function (e, n) {
              void 0 === n && (n = {});
              var t = this.serialize(e);
              return this.getNextSafeSlug(t, n.dryrun);
            }),
            e
          );
        })(),
        Z = (function () {
          function n(n) {
            (this.options = n || e.defaults),
              (this.options.renderer = this.options.renderer || new P()),
              (this.renderer = this.options.renderer),
              (this.renderer.options = this.options),
              (this.textRenderer = new q()),
              (this.slugger = new H());
          }
          (n.parse = function (e, t) {
            return new n(t).parse(e);
          }),
            (n.parseInline = function (e, t) {
              return new n(t).parseInline(e);
            });
          var t = n.prototype;
          return (
            (t.parse = function (e, n) {
              void 0 === n && (n = !0);
              var t,
                r,
                o,
                a,
                i,
                s,
                l,
                u,
                c,
                d,
                h,
                p,
                m,
                g,
                f,
                b,
                w,
                k,
                y,
                D = "",
                A = e.length;
              for (t = 0; t < A; t++)
                if (
                  ((d = e[t]),
                  !(
                    this.options.extensions &&
                    this.options.extensions.renderers &&
                    this.options.extensions.renderers[d.type]
                  ) ||
                    (!1 ===
                      (y = this.options.extensions.renderers[d.type].call(
                        { parser: this },
                        d
                      )) &&
                      [
                        "space",
                        "hr",
                        "heading",
                        "code",
                        "table",
                        "blockquote",
                        "list",
                        "html",
                        "paragraph",
                        "text",
                      ].includes(d.type)))
                )
                  switch (d.type) {
                    case "space":
                      continue;
                    case "hr":
                      D += this.renderer.hr();
                      continue;
                    case "heading":
                      D += this.renderer.heading(
                        this.parseInline(d.tokens),
                        d.depth,
                        _(this.parseInline(d.tokens, this.textRenderer)),
                        this.slugger
                      );
                      continue;
                    case "code":
                      D += this.renderer.code(d.text, d.lang, d.escaped);
                      continue;
                    case "table":
                      for (
                        u = "", l = "", a = d.header.length, r = 0;
                        r < a;
                        r++
                      )
                        l += this.renderer.tablecell(
                          this.parseInline(d.header[r].tokens),
                          { header: !0, align: d.align[r] }
                        );
                      for (
                        u += this.renderer.tablerow(l),
                          c = "",
                          a = d.rows.length,
                          r = 0;
                        r < a;
                        r++
                      ) {
                        for (
                          l = "", i = (s = d.rows[r]).length, o = 0;
                          o < i;
                          o++
                        )
                          l += this.renderer.tablecell(
                            this.parseInline(s[o].tokens),
                            { header: !1, align: d.align[o] }
                          );
                        c += this.renderer.tablerow(l);
                      }
                      D += this.renderer.table(u, c);
                      continue;
                    case "blockquote":
                      (c = this.parse(d.tokens)),
                        (D += this.renderer.blockquote(c));
                      continue;
                    case "list":
                      for (
                        h = d.ordered,
                          p = d.start,
                          m = d.loose,
                          a = d.items.length,
                          c = "",
                          r = 0;
                        r < a;
                        r++
                      )
                        (b = (f = d.items[r]).checked),
                          (w = f.task),
                          (g = ""),
                          f.task &&
                            ((k = this.renderer.checkbox(b)),
                            m
                              ? f.tokens.length > 0 &&
                                "paragraph" === f.tokens[0].type
                                ? ((f.tokens[0].text =
                                    k + " " + f.tokens[0].text),
                                  f.tokens[0].tokens &&
                                    f.tokens[0].tokens.length > 0 &&
                                    "text" === f.tokens[0].tokens[0].type &&
                                    (f.tokens[0].tokens[0].text =
                                      k + " " + f.tokens[0].tokens[0].text))
                                : f.tokens.unshift({ type: "text", text: k })
                              : (g += k)),
                          (g += this.parse(f.tokens, m)),
                          (c += this.renderer.listitem(g, w, b));
                      D += this.renderer.list(c, h, p);
                      continue;
                    case "html":
                      D += this.renderer.html(d.text);
                      continue;
                    case "paragraph":
                      D += this.renderer.paragraph(this.parseInline(d.tokens));
                      continue;
                    case "text":
                      for (
                        c = d.tokens ? this.parseInline(d.tokens) : d.text;
                        t + 1 < A && "text" === e[t + 1].type;

                      )
                        c +=
                          "\n" +
                          ((d = e[++t]).tokens
                            ? this.parseInline(d.tokens)
                            : d.text);
                      D += n ? this.renderer.paragraph(c) : c;
                      continue;
                    default:
                      var x = 'Token with "' + d.type + '" type was not found.';
                      if (this.options.silent) return void console.error(x);
                      throw new Error(x);
                  }
                else D += y || "";
              return D;
            }),
            (t.parseInline = function (e, n) {
              n = n || this.renderer;
              var t,
                r,
                o,
                a = "",
                i = e.length;
              for (t = 0; t < i; t++)
                if (
                  ((r = e[t]),
                  !(
                    this.options.extensions &&
                    this.options.extensions.renderers &&
                    this.options.extensions.renderers[r.type]
                  ) ||
                    (!1 ===
                      (o = this.options.extensions.renderers[r.type].call(
                        { parser: this },
                        r
                      )) &&
                      [
                        "escape",
                        "html",
                        "link",
                        "image",
                        "strong",
                        "em",
                        "codespan",
                        "br",
                        "del",
                        "text",
                      ].includes(r.type)))
                )
                  switch (r.type) {
                    case "escape":
                    case "text":
                      a += n.text(r.text);
                      break;
                    case "html":
                      a += n.html(r.text);
                      break;
                    case "link":
                      a += n.link(
                        r.href,
                        r.title,
                        this.parseInline(r.tokens, n)
                      );
                      break;
                    case "image":
                      a += n.image(r.href, r.title, r.text);
                      break;
                    case "strong":
                      a += n.strong(this.parseInline(r.tokens, n));
                      break;
                    case "em":
                      a += n.em(this.parseInline(r.tokens, n));
                      break;
                    case "codespan":
                      a += n.codespan(r.text);
                      break;
                    case "br":
                      a += n.br();
                      break;
                    case "del":
                      a += n.del(this.parseInline(r.tokens, n));
                      break;
                    default:
                      var s = 'Token with "' + r.type + '" type was not found.';
                      if (this.options.silent) return void console.error(s);
                      throw new Error(s);
                  }
                else a += o || "";
              return a;
            }),
            n
          );
        })();
      function G(e, n, t) {
        if (null == e)
          throw new Error("marked(): input parameter is undefined or null");
        if ("string" != typeof e)
          throw new Error(
            "marked(): input parameter is of type " +
              Object.prototype.toString.call(e) +
              ", string expected"
          );
        if (
          ("function" == typeof n && ((t = n), (n = null)),
          T((n = F({}, G.defaults, n || {}))),
          t)
        ) {
          var r,
            o = n.highlight;
          try {
            r = U.lex(e, n);
          } catch (e) {
            return t(e);
          }
          var a = function (e) {
            var a;
            if (!e)
              try {
                n.walkTokens && G.walkTokens(r, n.walkTokens),
                  (a = Z.parse(r, n));
              } catch (n) {
                e = n;
              }
            return (n.highlight = o), e ? t(e) : t(null, a);
          };
          if (!o || o.length < 3) return a();
          if ((delete n.highlight, !r.length)) return a();
          var i = 0;
          return (
            G.walkTokens(r, function (e) {
              "code" === e.type &&
                (i++,
                setTimeout(function () {
                  o(e.text, e.lang, function (n, t) {
                    if (n) return a(n);
                    null != t &&
                      t !== e.text &&
                      ((e.text = t), (e.escaped = !0)),
                      0 == --i && a();
                  });
                }, 0));
            }),
            void (0 === i && a())
          );
        }
        try {
          var s = U.lex(e, n);
          return n.walkTokens && G.walkTokens(s, n.walkTokens), Z.parse(s, n);
        } catch (e) {
          if (
            ((e.message +=
              "\nPlease report this to https://github.com/markedjs/marked."),
            n.silent)
          )
            return (
              "<p>An error occurred:</p><pre>" +
              m(e.message + "", !0) +
              "</pre>"
            );
          throw e;
        }
      }
      (G.options = G.setOptions =
        function (e) {
          return F(G.defaults, e), s(G.defaults), G;
        }),
        (G.getDefaults = i),
        (G.defaults = e.defaults),
        (G.use = function () {
          for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++)
            n[t] = arguments[t];
          var r,
            o = F.apply(void 0, [{}].concat(n)),
            a = G.defaults.extensions || { renderers: {}, childTokens: {} };
          n.forEach(function (e) {
            if (
              (e.extensions &&
                ((r = !0),
                e.extensions.forEach(function (e) {
                  if (!e.name) throw new Error("extension name required");
                  if (e.renderer) {
                    var n = a.renderers ? a.renderers[e.name] : null;
                    a.renderers[e.name] = n
                      ? function () {
                          for (
                            var t = arguments.length, r = new Array(t), o = 0;
                            o < t;
                            o++
                          )
                            r[o] = arguments[o];
                          var a = e.renderer.apply(this, r);
                          return !1 === a && (a = n.apply(this, r)), a;
                        }
                      : e.renderer;
                  }
                  if (e.tokenizer) {
                    if (
                      !e.level ||
                      ("block" !== e.level && "inline" !== e.level)
                    )
                      throw new Error(
                        "extension level must be 'block' or 'inline'"
                      );
                    a[e.level]
                      ? a[e.level].unshift(e.tokenizer)
                      : (a[e.level] = [e.tokenizer]),
                      e.start &&
                        ("block" === e.level
                          ? a.startBlock
                            ? a.startBlock.push(e.start)
                            : (a.startBlock = [e.start])
                          : "inline" === e.level &&
                            (a.startInline
                              ? a.startInline.push(e.start)
                              : (a.startInline = [e.start])));
                  }
                  e.childTokens && (a.childTokens[e.name] = e.childTokens);
                })),
              e.renderer &&
                (function () {
                  var n = G.defaults.renderer || new P(),
                    t = function (t) {
                      var r = n[t];
                      n[t] = function () {
                        for (
                          var o = arguments.length, a = new Array(o), i = 0;
                          i < o;
                          i++
                        )
                          a[i] = arguments[i];
                        var s = e.renderer[t].apply(n, a);
                        return !1 === s && (s = r.apply(n, a)), s;
                      };
                    };
                  for (var r in e.renderer) t(r);
                  o.renderer = n;
                })(),
              e.tokenizer &&
                (function () {
                  var n = G.defaults.tokenizer || new R(),
                    t = function (t) {
                      var r = n[t];
                      n[t] = function () {
                        for (
                          var o = arguments.length, a = new Array(o), i = 0;
                          i < o;
                          i++
                        )
                          a[i] = arguments[i];
                        var s = e.tokenizer[t].apply(n, a);
                        return !1 === s && (s = r.apply(n, a)), s;
                      };
                    };
                  for (var r in e.tokenizer) t(r);
                  o.tokenizer = n;
                })(),
              e.walkTokens)
            ) {
              var n = G.defaults.walkTokens;
              o.walkTokens = function (t) {
                e.walkTokens.call(this, t), n && n.call(this, t);
              };
            }
            r && (o.extensions = a), G.setOptions(o);
          });
        }),
        (G.walkTokens = function (e, n) {
          for (
            var t,
              r = function () {
                var e = t.value;
                switch ((n.call(G, e), e.type)) {
                  case "table":
                    for (var r, o = a(e.header); !(r = o()).done; ) {
                      var i = r.value;
                      G.walkTokens(i.tokens, n);
                    }
                    for (var s, l = a(e.rows); !(s = l()).done; )
                      for (var u, c = a(s.value); !(u = c()).done; ) {
                        var d = u.value;
                        G.walkTokens(d.tokens, n);
                      }
                    break;
                  case "list":
                    G.walkTokens(e.items, n);
                    break;
                  default:
                    G.defaults.extensions &&
                    G.defaults.extensions.childTokens &&
                    G.defaults.extensions.childTokens[e.type]
                      ? G.defaults.extensions.childTokens[e.type].forEach(
                          function (t) {
                            G.walkTokens(e[t], n);
                          }
                        )
                      : e.tokens && G.walkTokens(e.tokens, n);
                }
              },
              o = a(e);
            !(t = o()).done;

          )
            r();
        }),
        (G.parseInline = function (e, n) {
          if (null == e)
            throw new Error(
              "marked.parseInline(): input parameter is undefined or null"
            );
          if ("string" != typeof e)
            throw new Error(
              "marked.parseInline(): input parameter is of type " +
                Object.prototype.toString.call(e) +
                ", string expected"
            );
          T((n = F({}, G.defaults, n || {})));
          try {
            var t = U.lexInline(e, n);
            return (
              n.walkTokens && G.walkTokens(t, n.walkTokens), Z.parseInline(t, n)
            );
          } catch (e) {
            if (
              ((e.message +=
                "\nPlease report this to https://github.com/markedjs/marked."),
              n.silent)
            )
              return (
                "<p>An error occurred:</p><pre>" +
                m(e.message + "", !0) +
                "</pre>"
              );
            throw e;
          }
        }),
        (G.Parser = Z),
        (G.parser = Z.parse),
        (G.Renderer = P),
        (G.TextRenderer = q),
        (G.Lexer = U),
        (G.lexer = U.lex),
        (G.Tokenizer = R),
        (G.Slugger = H),
        (G.parse = G);
      var W = G.options,
        Q = G.setOptions,
        Y = G.use,
        K = G.walkTokens,
        X = G.parseInline,
        J = G,
        V = Z.parse,
        ee = U.lex;
      (e.Lexer = U),
        (e.Parser = Z),
        (e.Renderer = P),
        (e.Slugger = H),
        (e.TextRenderer = q),
        (e.Tokenizer = R),
        (e.getDefaults = i),
        (e.lexer = ee),
        (e.marked = G),
        (e.options = W),
        (e.parse = J),
        (e.parseInline = X),
        (e.parser = V),
        (e.setOptions = Q),
        (e.use = Y),
        (e.walkTokens = K),
        Object.defineProperty(e, "__esModule", { value: !0 });
    })(n);
  }),
  Ce = t(Ee),
  Fe = "[object Map]",
  Be = "[object Set]",
  ze = /^\[object .+?Constructor\]$/,
  Se = /^(?:0|[1-9]\d*)$/,
  Te = "[\\ud800-\\udfff]",
  Ne = "[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",
  Oe = "\\ud83c[\\udffb-\\udfff]",
  je = "[^\\ud800-\\udfff]",
  Re = "(?:\\ud83c[\\udde6-\\uddff]){2}",
  Me = "[\\ud800-\\udbff][\\udc00-\\udfff]",
  Ie = "(?:" + Ne + "|" + Oe + ")" + "?",
  Le =
    "[\\ufe0e\\ufe0f]?" +
    Ie +
    ("(?:\\u200d(?:" +
      [je, Re, Me].join("|") +
      ")[\\ufe0e\\ufe0f]?" +
      Ie +
      ")*"),
  $e = "(?:" + [je + Ne + "?", Ne, Re, Me, Te].join("|") + ")",
  Ue = RegExp(Oe + "(?=" + Oe + ")|" + $e + Le, "g"),
  Pe = RegExp(
    "[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"
  ),
  qe = "object" == typeof n && n && n.Object === Object && n,
  He = "object" == typeof self && self && self.Object === Object && self,
  Ze = qe || He || Function("return this")();
function Ge(e, n) {
  return (function (e, n) {
    for (var t = -1, r = e ? e.length : 0, o = Array(r); ++t < r; )
      o[t] = n(e[t], t, e);
    return o;
  })(n, function (n) {
    return e[n];
  });
}
function We(e) {
  var n = -1,
    t = Array(e.size);
  return (
    e.forEach(function (e, r) {
      t[++n] = [r, e];
    }),
    t
  );
}
function Qe(e) {
  var n = -1,
    t = Array(e.size);
  return (
    e.forEach(function (e) {
      t[++n] = e;
    }),
    t
  );
}
function Ye(e) {
  return (function (e) {
    return Pe.test(e);
  })(e)
    ? (function (e) {
        return e.match(Ue) || [];
      })(e)
    : (function (e) {
        return e.split("");
      })(e);
}
var Ke,
  Xe,
  Je,
  Ve = Function.prototype,
  en = Object.prototype,
  nn = Ze["__core-js_shared__"],
  tn = (Ke = /[^.]+$/.exec((nn && nn.keys && nn.keys.IE_PROTO) || ""))
    ? "Symbol(src)_1." + Ke
    : "",
  rn = Ve.toString,
  on = en.hasOwnProperty,
  an = en.toString,
  sn = RegExp(
    "^" +
      rn
        .call(on)
        .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?"
        ) +
      "$"
  ),
  ln = Ze.Symbol,
  un = ln ? ln.iterator : void 0,
  cn = en.propertyIsEnumerable,
  dn =
    ((Xe = Object.keys),
    (Je = Object),
    function (e) {
      return Xe(Je(e));
    }),
  hn = vn(Ze, "DataView"),
  pn = vn(Ze, "Map"),
  mn = vn(Ze, "Promise"),
  gn = vn(Ze, "Set"),
  _n = vn(Ze, "WeakMap"),
  fn = Fn(hn),
  bn = Fn(pn),
  wn = Fn(mn),
  kn = Fn(gn),
  yn = Fn(_n);
function Dn(e, n) {
  var t =
      Bn(e) ||
      (function (e) {
        return (
          (function (e) {
            return Nn(e) && zn(e);
          })(e) &&
          on.call(e, "callee") &&
          (!cn.call(e, "callee") || "[object Arguments]" == an.call(e))
        );
      })(e)
        ? (function (e, n) {
            for (var t = -1, r = Array(e); ++t < e; ) r[t] = n(t);
            return r;
          })(e.length, String)
        : [],
    r = t.length,
    o = !!r;
  for (var a in e)
    (!n && !on.call(e, a)) || (o && ("length" == a || Cn(a, r))) || t.push(a);
  return t;
}
function An(e) {
  if (
    !Tn(e) ||
    (function (e) {
      return !!tn && tn in e;
    })(e)
  )
    return !1;
  var n =
    Sn(e) ||
    (function (e) {
      var n = !1;
      if (null != e && "function" != typeof e.toString)
        try {
          n = !!(e + "");
        } catch (e) {}
      return n;
    })(e)
      ? sn
      : ze;
  return n.test(Fn(e));
}
function xn(e) {
  if (
    ((t = (n = e) && n.constructor),
    (r = ("function" == typeof t && t.prototype) || en),
    n !== r)
  )
    return dn(e);
  var n,
    t,
    r,
    o = [];
  for (var a in Object(e)) on.call(e, a) && "constructor" != a && o.push(a);
  return o;
}
function vn(e, n) {
  var t = (function (e, n) {
    return null == e ? void 0 : e[n];
  })(e, n);
  return An(t) ? t : void 0;
}
var En = function (e) {
  return an.call(e);
};
function Cn(e, n) {
  return (
    !!(n = null == n ? 9007199254740991 : n) &&
    ("number" == typeof e || Se.test(e)) &&
    e > -1 &&
    e % 1 == 0 &&
    e < n
  );
}
function Fn(e) {
  if (null != e) {
    try {
      return rn.call(e);
    } catch (e) {}
    try {
      return e + "";
    } catch (e) {}
  }
  return "";
}
((hn && "[object DataView]" != En(new hn(new ArrayBuffer(1)))) ||
  (pn && En(new pn()) != Fe) ||
  (mn && "[object Promise]" != En(mn.resolve())) ||
  (gn && En(new gn()) != Be) ||
  (_n && "[object WeakMap]" != En(new _n()))) &&
  (En = function (e) {
    var n = an.call(e),
      t = "[object Object]" == n ? e.constructor : void 0,
      r = t ? Fn(t) : void 0;
    if (r)
      switch (r) {
        case fn:
          return "[object DataView]";
        case bn:
          return Fe;
        case wn:
          return "[object Promise]";
        case kn:
          return Be;
        case yn:
          return "[object WeakMap]";
      }
    return n;
  });
var Bn = Array.isArray;
function zn(e) {
  return (
    null != e &&
    (function (e) {
      return (
        "number" == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991
      );
    })(e.length) &&
    !Sn(e)
  );
}
function Sn(e) {
  var n = Tn(e) ? an.call(e) : "";
  return "[object Function]" == n || "[object GeneratorFunction]" == n;
}
function Tn(e) {
  var n = typeof e;
  return !!e && ("object" == n || "function" == n);
}
function Nn(e) {
  return !!e && "object" == typeof e;
}
function On(e) {
  return e
    ? Ge(
        e,
        (function (e) {
          return zn(e) ? Dn(e) : xn(e);
        })(e)
      )
    : [];
}
var jn = function (e) {
  if (!e) return [];
  if (zn(e))
    return (function (e) {
      return (
        "string" == typeof e ||
        (!Bn(e) && Nn(e) && "[object String]" == an.call(e))
      );
    })(e)
      ? Ye(e)
      : (function (e, n) {
          var t = -1,
            r = e.length;
          for (n || (n = Array(r)); ++t < r; ) n[t] = e[t];
          return n;
        })(e);
  if (un && e[un])
    return (function (e) {
      for (var n, t = []; !(n = e.next()).done; ) t.push(n.value);
      return t;
    })(e[un]());
  var n = En(e);
  return (n == Fe ? We : n == Be ? Qe : On)(e);
};
var Rn = {
    100: "💯",
    1234: "🔢",
    umbrella_with_rain_drops: "☔",
    coffee: "☕",
    aries: "♈",
    taurus: "♉",
    sagittarius: "♐",
    capricorn: "♑",
    aquarius: "♒",
    pisces: "♓",
    anchor: "⚓",
    white_check_mark: "✅",
    sparkles: "✨",
    question: "❓",
    grey_question: "❔",
    grey_exclamation: "❕",
    exclamation: "❗",
    heavy_exclamation_mark: "❗",
    heavy_plus_sign: "➕",
    heavy_minus_sign: "➖",
    heavy_division_sign: "➗",
    hash: "#️⃣",
    keycap_star: "*️⃣",
    zero: "0️⃣",
    one: "1️⃣",
    two: "2️⃣",
    three: "3️⃣",
    four: "4️⃣",
    five: "5️⃣",
    six: "6️⃣",
    seven: "7️⃣",
    eight: "8️⃣",
    nine: "9️⃣",
    copyright: "©️",
    registered: "®️",
    mahjong: "🀄",
    black_joker: "🃏",
    a: "🅰️",
    b: "🅱️",
    o2: "🅾️",
    parking: "🅿️",
    ab: "🆎",
    cl: "🆑",
    cool: "🆒",
    free: "🆓",
    id: "🆔",
    new: "🆕",
    ng: "🆖",
    ok: "🆗",
    sos: "🆘",
    up: "🆙",
    vs: "🆚",
    koko: "🈁",
    sa: "🈂️",
    u7121: "🈚",
    u6307: "🈯",
    u7981: "🈲",
    u7a7a: "🈳",
    u5408: "🈴",
    u6e80: "🈵",
    u6709: "🈶",
    u6708: "🈷️",
    u7533: "🈸",
    u5272: "🈹",
    u55b6: "🈺",
    ideograph_advantage: "🉐",
    accept: "🉑",
    cyclone: "🌀",
    foggy: "🌁",
    closed_umbrella: "🌂",
    night_with_stars: "🌃",
    sunrise_over_mountains: "🌄",
    sunrise: "🌅",
    city_sunset: "🌆",
    city_sunrise: "🌇",
    rainbow: "🌈",
    bridge_at_night: "🌉",
    ocean: "🌊",
    volcano: "🌋",
    milky_way: "🌌",
    earth_africa: "🌍",
    earth_americas: "🌎",
    earth_asia: "🌏",
    globe_with_meridians: "🌐",
    new_moon: "🌑",
    waxing_crescent_moon: "🌒",
    first_quarter_moon: "🌓",
    moon: "🌔",
    waxing_gibbous_moon: "🌔",
    full_moon: "🌕",
    waning_gibbous_moon: "🌖",
    last_quarter_moon: "🌗",
    waning_crescent_moon: "🌘",
    crescent_moon: "🌙",
    new_moon_with_face: "🌚",
    first_quarter_moon_with_face: "🌛",
    last_quarter_moon_with_face: "🌜",
    full_moon_with_face: "🌝",
    sun_with_face: "🌞",
    star2: "🌟",
    stars: "🌠",
    thermometer: "🌡️",
    mostly_sunny: "🌤️",
    sun_small_cloud: "🌤️",
    barely_sunny: "🌥️",
    sun_behind_cloud: "🌥️",
    partly_sunny_rain: "🌦️",
    sun_behind_rain_cloud: "🌦️",
    rain_cloud: "🌧️",
    snow_cloud: "🌨️",
    lightning: "🌩️",
    lightning_cloud: "🌩️",
    tornado: "🌪️",
    tornado_cloud: "🌪️",
    fog: "🌫️",
    wind_blowing_face: "🌬️",
    hotdog: "🌭",
    taco: "🌮",
    burrito: "🌯",
    chestnut: "🌰",
    seedling: "🌱",
    evergreen_tree: "🌲",
    deciduous_tree: "🌳",
    palm_tree: "🌴",
    cactus: "🌵",
    hot_pepper: "🌶️",
    tulip: "🌷",
    cherry_blossom: "🌸",
    rose: "🌹",
    hibiscus: "🌺",
    sunflower: "🌻",
    blossom: "🌼",
    corn: "🌽",
    ear_of_rice: "🌾",
    herb: "🌿",
    four_leaf_clover: "🍀",
    maple_leaf: "🍁",
    fallen_leaf: "🍂",
    leaves: "🍃",
    mushroom: "🍄",
    tomato: "🍅",
    eggplant: "🍆",
    grapes: "🍇",
    melon: "🍈",
    watermelon: "🍉",
    tangerine: "🍊",
    lemon: "🍋",
    banana: "🍌",
    pineapple: "🍍",
    apple: "🍎",
    green_apple: "🍏",
    pear: "🍐",
    peach: "🍑",
    cherries: "🍒",
    strawberry: "🍓",
    hamburger: "🍔",
    pizza: "🍕",
    meat_on_bone: "🍖",
    poultry_leg: "🍗",
    rice_cracker: "🍘",
    rice_ball: "🍙",
    rice: "🍚",
    curry: "🍛",
    ramen: "🍜",
    spaghetti: "🍝",
    bread: "🍞",
    fries: "🍟",
    sweet_potato: "🍠",
    dango: "🍡",
    oden: "🍢",
    sushi: "🍣",
    fried_shrimp: "🍤",
    fish_cake: "🍥",
    icecream: "🍦",
    shaved_ice: "🍧",
    ice_cream: "🍨",
    doughnut: "🍩",
    cookie: "🍪",
    chocolate_bar: "🍫",
    candy: "🍬",
    lollipop: "🍭",
    custard: "🍮",
    honey_pot: "🍯",
    cake: "🍰",
    bento: "🍱",
    stew: "🍲",
    fried_egg: "🍳",
    cooking: "🍳",
    fork_and_knife: "🍴",
    tea: "🍵",
    sake: "🍶",
    wine_glass: "🍷",
    cocktail: "🍸",
    tropical_drink: "🍹",
    beer: "🍺",
    beers: "🍻",
    baby_bottle: "🍼",
    knife_fork_plate: "🍽️",
    champagne: "🍾",
    popcorn: "🍿",
    ribbon: "🎀",
    gift: "🎁",
    birthday: "🎂",
    jack_o_lantern: "🎃",
    christmas_tree: "🎄",
    santa: "🎅",
    fireworks: "🎆",
    sparkler: "🎇",
    balloon: "🎈",
    tada: "🎉",
    confetti_ball: "🎊",
    tanabata_tree: "🎋",
    crossed_flags: "🎌",
    bamboo: "🎍",
    dolls: "🎎",
    flags: "🎏",
    wind_chime: "🎐",
    rice_scene: "🎑",
    school_satchel: "🎒",
    mortar_board: "🎓",
    medal: "🎖️",
    reminder_ribbon: "🎗️",
    studio_microphone: "🎙️",
    level_slider: "🎚️",
    control_knobs: "🎛️",
    film_frames: "🎞️",
    admission_tickets: "🎟️",
    carousel_horse: "🎠",
    ferris_wheel: "🎡",
    roller_coaster: "🎢",
    fishing_pole_and_fish: "🎣",
    microphone: "🎤",
    movie_camera: "🎥",
    cinema: "🎦",
    headphones: "🎧",
    art: "🎨",
    tophat: "🎩",
    circus_tent: "🎪",
    ticket: "🎫",
    clapper: "🎬",
    performing_arts: "🎭",
    video_game: "🎮",
    dart: "🎯",
    slot_machine: "🎰",
    "8ball": "🎱",
    game_die: "🎲",
    bowling: "🎳",
    flower_playing_cards: "🎴",
    musical_note: "🎵",
    notes: "🎶",
    saxophone: "🎷",
    guitar: "🎸",
    musical_keyboard: "🎹",
    trumpet: "🎺",
    violin: "🎻",
    musical_score: "🎼",
    running_shirt_with_sash: "🎽",
    tennis: "🎾",
    ski: "🎿",
    basketball: "🏀",
    checkered_flag: "🏁",
    snowboarder: "🏂",
    "woman-running": "🏃‍♀️",
    "man-running": "🏃‍♂️",
    runner: "🏃‍♂️",
    running: "🏃‍♂️",
    "woman-surfing": "🏄‍♀️",
    "man-surfing": "🏄‍♂️",
    surfer: "🏄‍♂️",
    sports_medal: "🏅",
    trophy: "🏆",
    horse_racing: "🏇",
    football: "🏈",
    rugby_football: "🏉",
    "woman-swimming": "🏊‍♀️",
    "man-swimming": "🏊‍♂️",
    swimmer: "🏊‍♂️",
    "woman-lifting-weights": "🏋️‍♀️",
    "man-lifting-weights": "🏋️‍♂️",
    weight_lifter: "🏋️‍♂️",
    "woman-golfing": "🏌️‍♀️",
    "man-golfing": "🏌️‍♂️",
    golfer: "🏌️‍♂️",
    racing_motorcycle: "🏍️",
    racing_car: "🏎️",
    cricket_bat_and_ball: "🏏",
    volleyball: "🏐",
    field_hockey_stick_and_ball: "🏑",
    ice_hockey_stick_and_puck: "🏒",
    table_tennis_paddle_and_ball: "🏓",
    snow_capped_mountain: "🏔️",
    camping: "🏕️",
    beach_with_umbrella: "🏖️",
    building_construction: "🏗️",
    house_buildings: "🏘️",
    cityscape: "🏙️",
    derelict_house_building: "🏚️",
    classical_building: "🏛️",
    desert: "🏜️",
    desert_island: "🏝️",
    national_park: "🏞️",
    stadium: "🏟️",
    house: "🏠",
    house_with_garden: "🏡",
    office: "🏢",
    post_office: "🏣",
    european_post_office: "🏤",
    hospital: "🏥",
    bank: "🏦",
    atm: "🏧",
    hotel: "🏨",
    love_hotel: "🏩",
    convenience_store: "🏪",
    school: "🏫",
    department_store: "🏬",
    factory: "🏭",
    izakaya_lantern: "🏮",
    lantern: "🏮",
    japanese_castle: "🏯",
    european_castle: "🏰",
    "rainbow-flag": "🏳️‍🌈",
    waving_white_flag: "🏳️",
    "flag-england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "flag-scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "flag-wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    waving_black_flag: "🏴",
    rosette: "🏵️",
    label: "🏷️",
    badminton_racquet_and_shuttlecock: "🏸",
    bow_and_arrow: "🏹",
    amphora: "🏺",
    rat: "🐀",
    mouse2: "🐁",
    ox: "🐂",
    water_buffalo: "🐃",
    cow2: "🐄",
    tiger2: "🐅",
    leopard: "🐆",
    rabbit2: "🐇",
    cat2: "🐈",
    dragon: "🐉",
    crocodile: "🐊",
    whale2: "🐋",
    snail: "🐌",
    snake: "🐍",
    racehorse: "🐎",
    ram: "🐏",
    goat: "🐐",
    sheep: "🐑",
    monkey: "🐒",
    rooster: "🐓",
    chicken: "🐔",
    dog2: "🐕",
    pig2: "🐖",
    boar: "🐗",
    elephant: "🐘",
    octopus: "🐙",
    shell: "🐚",
    bug: "🐛",
    ant: "🐜",
    bee: "🐝",
    honeybee: "🐝",
    beetle: "🐞",
    fish: "🐟",
    tropical_fish: "🐠",
    blowfish: "🐡",
    turtle: "🐢",
    hatching_chick: "🐣",
    baby_chick: "🐤",
    hatched_chick: "🐥",
    bird: "🐦",
    penguin: "🐧",
    koala: "🐨",
    poodle: "🐩",
    dromedary_camel: "🐪",
    camel: "🐫",
    dolphin: "🐬",
    flipper: "🐬",
    mouse: "🐭",
    cow: "🐮",
    tiger: "🐯",
    rabbit: "🐰",
    cat: "🐱",
    dragon_face: "🐲",
    whale: "🐳",
    horse: "🐴",
    monkey_face: "🐵",
    dog: "🐶",
    pig: "🐷",
    frog: "🐸",
    hamster: "🐹",
    wolf: "🐺",
    bear: "🐻",
    panda_face: "🐼",
    pig_nose: "🐽",
    feet: "🐾",
    paw_prints: "🐾",
    chipmunk: "🐿️",
    eyes: "👀",
    "eye-in-speech-bubble": "👁️‍🗨️",
    eye: "👁️",
    ear: "👂",
    nose: "👃",
    lips: "👄",
    tongue: "👅",
    point_up_2: "👆",
    point_down: "👇",
    point_left: "👈",
    point_right: "👉",
    facepunch: "👊",
    punch: "👊",
    wave: "👋",
    ok_hand: "👌",
    "+1": "👍",
    thumbsup: "👍",
    "-1": "👎",
    thumbsdown: "👎",
    clap: "👏",
    open_hands: "👐",
    crown: "👑",
    womans_hat: "👒",
    eyeglasses: "👓",
    necktie: "👔",
    shirt: "👕",
    tshirt: "👕",
    jeans: "👖",
    dress: "👗",
    kimono: "👘",
    bikini: "👙",
    womans_clothes: "👚",
    purse: "👛",
    handbag: "👜",
    pouch: "👝",
    mans_shoe: "👞",
    shoe: "👞",
    athletic_shoe: "👟",
    high_heel: "👠",
    sandal: "👡",
    boot: "👢",
    footprints: "👣",
    bust_in_silhouette: "👤",
    busts_in_silhouette: "👥",
    boy: "👦",
    girl: "👧",
    "male-farmer": "👨‍🌾",
    "male-cook": "👨‍🍳",
    "male-student": "👨‍🎓",
    "male-singer": "👨‍🎤",
    "male-artist": "👨‍🎨",
    "male-teacher": "👨‍🏫",
    "male-factory-worker": "👨‍🏭",
    "man-boy-boy": "👨‍👦‍👦",
    "man-boy": "👨‍👦",
    "man-girl-boy": "👨‍👧‍👦",
    "man-girl-girl": "👨‍👧‍👧",
    "man-girl": "👨‍👧",
    "man-man-boy": "👨‍👨‍👦",
    "man-man-boy-boy": "👨‍👨‍👦‍👦",
    "man-man-girl": "👨‍👨‍👧",
    "man-man-girl-boy": "👨‍👨‍👧‍👦",
    "man-man-girl-girl": "👨‍👨‍👧‍👧",
    "man-woman-boy": "👨‍👩‍👦",
    family: "👨‍👩‍👦",
    "man-woman-boy-boy": "👨‍👩‍👦‍👦",
    "man-woman-girl": "👨‍👩‍👧",
    "man-woman-girl-boy": "👨‍👩‍👧‍👦",
    "man-woman-girl-girl": "👨‍👩‍👧‍👧",
    "male-technologist": "👨‍💻",
    "male-office-worker": "👨‍💼",
    "male-mechanic": "👨‍🔧",
    "male-scientist": "👨‍🔬",
    "male-astronaut": "👨‍🚀",
    "male-firefighter": "👨‍🚒",
    "male-doctor": "👨‍⚕️",
    "male-judge": "👨‍⚖️",
    "male-pilot": "👨‍✈️",
    "man-heart-man": "👨‍❤️‍👨",
    "man-kiss-man": "👨‍❤️‍💋‍👨",
    man: "👨",
    "female-farmer": "👩‍🌾",
    "female-cook": "👩‍🍳",
    "female-student": "👩‍🎓",
    "female-singer": "👩‍🎤",
    "female-artist": "👩‍🎨",
    "female-teacher": "👩‍🏫",
    "female-factory-worker": "👩‍🏭",
    "woman-boy-boy": "👩‍👦‍👦",
    "woman-boy": "👩‍👦",
    "woman-girl-boy": "👩‍👧‍👦",
    "woman-girl-girl": "👩‍👧‍👧",
    "woman-girl": "👩‍👧",
    "woman-woman-boy": "👩‍👩‍👦",
    "woman-woman-boy-boy": "👩‍👩‍👦‍👦",
    "woman-woman-girl": "👩‍👩‍👧",
    "woman-woman-girl-boy": "👩‍👩‍👧‍👦",
    "woman-woman-girl-girl": "👩‍👩‍👧‍👧",
    "female-technologist": "👩‍💻",
    "female-office-worker": "👩‍💼",
    "female-mechanic": "👩‍🔧",
    "female-scientist": "👩‍🔬",
    "female-astronaut": "👩‍🚀",
    "female-firefighter": "👩‍🚒",
    "female-doctor": "👩‍⚕️",
    "female-judge": "👩‍⚖️",
    "female-pilot": "👩‍✈️",
    "woman-heart-man": "👩‍❤️‍👨",
    couple_with_heart: "👩‍❤️‍👨",
    "woman-heart-woman": "👩‍❤️‍👩",
    "woman-kiss-man": "👩‍❤️‍💋‍👨",
    couplekiss: "👩‍❤️‍💋‍👨",
    "woman-kiss-woman": "👩‍❤️‍💋‍👩",
    woman: "👩",
    couple: "👫",
    man_and_woman_holding_hands: "👫",
    two_men_holding_hands: "👬",
    two_women_holding_hands: "👭",
    "female-police-officer": "👮‍♀️",
    "male-police-officer": "👮‍♂️",
    cop: "👮‍♂️",
    "woman-with-bunny-ears-partying": "👯‍♀️",
    dancers: "👯‍♀️",
    "man-with-bunny-ears-partying": "👯‍♂️",
    bride_with_veil: "👰",
    "blond-haired-woman": "👱‍♀️",
    "blond-haired-man": "👱‍♂️",
    person_with_blond_hair: "👱‍♂️",
    man_with_gua_pi_mao: "👲",
    "woman-wearing-turban": "👳‍♀️",
    "man-wearing-turban": "👳‍♂️",
    man_with_turban: "👳‍♂️",
    older_man: "👴",
    older_woman: "👵",
    baby: "👶",
    "female-construction-worker": "👷‍♀️",
    "male-construction-worker": "👷‍♂️",
    construction_worker: "👷‍♂️",
    princess: "👸",
    japanese_ogre: "👹",
    japanese_goblin: "👺",
    ghost: "👻",
    angel: "👼",
    alien: "👽",
    space_invader: "👾",
    imp: "👿",
    skull: "💀",
    "woman-tipping-hand": "💁‍♀️",
    information_desk_person: "💁‍♀️",
    "man-tipping-hand": "💁‍♂️",
    "female-guard": "💂‍♀️",
    "male-guard": "💂‍♂️",
    guardsman: "💂‍♂️",
    dancer: "💃",
    lipstick: "💄",
    nail_care: "💅",
    "woman-getting-massage": "💆‍♀️",
    massage: "💆‍♀️",
    "man-getting-massage": "💆‍♂️",
    "woman-getting-haircut": "💇‍♀️",
    haircut: "💇‍♀️",
    "man-getting-haircut": "💇‍♂️",
    barber: "💈",
    syringe: "💉",
    pill: "💊",
    kiss: "💋",
    love_letter: "💌",
    ring: "💍",
    gem: "💎",
    bouquet: "💐",
    wedding: "💒",
    heartbeat: "💓",
    broken_heart: "💔",
    two_hearts: "💕",
    sparkling_heart: "💖",
    heartpulse: "💗",
    cupid: "💘",
    blue_heart: "💙",
    green_heart: "💚",
    yellow_heart: "💛",
    purple_heart: "💜",
    gift_heart: "💝",
    revolving_hearts: "💞",
    heart_decoration: "💟",
    diamond_shape_with_a_dot_inside: "💠",
    bulb: "💡",
    anger: "💢",
    bomb: "💣",
    zzz: "💤",
    boom: "💥",
    collision: "💥",
    sweat_drops: "💦",
    droplet: "💧",
    dash: "💨",
    poop: "💩",
    muscle: "💪",
    dizzy: "💫",
    speech_balloon: "💬",
    thought_balloon: "💭",
    white_flower: "💮",
    moneybag: "💰",
    currency_exchange: "💱",
    heavy_dollar_sign: "💲",
    credit_card: "💳",
    yen: "💴",
    dollar: "💵",
    euro: "💶",
    pound: "💷",
    money_with_wings: "💸",
    chart: "💹",
    seat: "💺",
    computer: "💻",
    briefcase: "💼",
    minidisc: "💽",
    floppy_disk: "💾",
    cd: "💿",
    dvd: "📀",
    file_folder: "📁",
    open_file_folder: "📂",
    page_with_curl: "📃",
    page_facing_up: "📄",
    date: "📅",
    calendar: "📆",
    card_index: "📇",
    chart_with_upwards_trend: "📈",
    chart_with_downwards_trend: "📉",
    bar_chart: "📊",
    clipboard: "📋",
    pushpin: "📌",
    round_pushpin: "📍",
    paperclip: "📎",
    straight_ruler: "📏",
    triangular_ruler: "📐",
    bookmark_tabs: "📑",
    ledger: "📒",
    notebook: "📓",
    notebook_with_decorative_cover: "📔",
    closed_book: "📕",
    book: "📖",
    open_book: "📖",
    green_book: "📗",
    blue_book: "📘",
    orange_book: "📙",
    books: "📚",
    name_badge: "📛",
    scroll: "📜",
    memo: "📝",
    pencil: "📝",
    telephone_receiver: "📞",
    pager: "📟",
    fax: "📠",
    satellite_antenna: "📡",
    loudspeaker: "📢",
    mega: "📣",
    outbox_tray: "📤",
    inbox_tray: "📥",
    package: "📦",
    "e-mail": "📧",
    incoming_envelope: "📨",
    envelope_with_arrow: "📩",
    mailbox_closed: "📪",
    mailbox: "📫",
    mailbox_with_mail: "📬",
    mailbox_with_no_mail: "📭",
    postbox: "📮",
    postal_horn: "📯",
    newspaper: "📰",
    iphone: "📱",
    calling: "📲",
    vibration_mode: "📳",
    mobile_phone_off: "📴",
    no_mobile_phones: "📵",
    signal_strength: "📶",
    camera: "📷",
    camera_with_flash: "📸",
    video_camera: "📹",
    tv: "📺",
    radio: "📻",
    vhs: "📼",
    film_projector: "📽️",
    prayer_beads: "📿",
    twisted_rightwards_arrows: "🔀",
    repeat: "🔁",
    repeat_one: "🔂",
    arrows_clockwise: "🔃",
    arrows_counterclockwise: "🔄",
    low_brightness: "🔅",
    high_brightness: "🔆",
    mute: "🔇",
    speaker: "🔈",
    sound: "🔉",
    loud_sound: "🔊",
    battery: "🔋",
    electric_plug: "🔌",
    mag: "🔍",
    mag_right: "🔎",
    lock_with_ink_pen: "🔏",
    closed_lock_with_key: "🔐",
    key: "🔑",
    lock: "🔒",
    unlock: "🔓",
    bell: "🔔",
    no_bell: "🔕",
    bookmark: "🔖",
    link: "🔗",
    radio_button: "🔘",
    back: "🔙",
    end: "🔚",
    on: "🔛",
    soon: "🔜",
    underage: "🔞",
    keycap_ten: "🔟",
    capital_abcd: "🔠",
    abcd: "🔡",
    symbols: "🔣",
    abc: "🔤",
    fire: "🔥",
    flashlight: "🔦",
    wrench: "🔧",
    hammer: "🔨",
    nut_and_bolt: "🔩",
    hocho: "🔪",
    knife: "🔪",
    gun: "🔫",
    microscope: "🔬",
    telescope: "🔭",
    crystal_ball: "🔮",
    six_pointed_star: "🔯",
    beginner: "🔰",
    trident: "🔱",
    black_square_button: "🔲",
    white_square_button: "🔳",
    red_circle: "🔴",
    large_blue_circle: "🔵",
    large_orange_diamond: "🔶",
    large_blue_diamond: "🔷",
    small_orange_diamond: "🔸",
    small_blue_diamond: "🔹",
    small_red_triangle: "🔺",
    small_red_triangle_down: "🔻",
    arrow_up_small: "🔼",
    arrow_down_small: "🔽",
    om_symbol: "🕉️",
    dove_of_peace: "🕊️",
    kaaba: "🕋",
    mosque: "🕌",
    synagogue: "🕍",
    menorah_with_nine_branches: "🕎",
    candle: "🕯️",
    mantelpiece_clock: "🕰️",
    hole: "🕳️",
    man_in_business_suit_levitating: "🕴️",
    "female-detective": "🕵️‍♀️",
    "male-detective": "🕵️‍♂️",
    sleuth_or_spy: "🕵️‍♂️",
    dark_sunglasses: "🕶️",
    spider: "🕷️",
    spider_web: "🕸️",
    joystick: "🕹️",
    man_dancing: "🕺",
    linked_paperclips: "🖇️",
    lower_left_ballpoint_pen: "🖊️",
    lower_left_fountain_pen: "🖋️",
    lower_left_paintbrush: "🖌️",
    lower_left_crayon: "🖍️",
    raised_hand_with_fingers_splayed: "🖐️",
    middle_finger: "🖕",
    reversed_hand_with_middle_finger_extended: "🖕",
    "spock-hand": "🖖",
    black_heart: "🖤",
    desktop_computer: "🖥️",
    printer: "🖨️",
    three_button_mouse: "🖱️",
    trackball: "🖲️",
    frame_with_picture: "🖼️",
    card_index_dividers: "🗂️",
    card_file_box: "🗃️",
    file_cabinet: "🗄️",
    wastebasket: "🗑️",
    spiral_note_pad: "🗒️",
    spiral_calendar_pad: "🗓️",
    compression: "🗜️",
    old_key: "🗝️",
    rolled_up_newspaper: "🗞️",
    dagger_knife: "🗡️",
    speaking_head_in_silhouette: "🗣️",
    left_speech_bubble: "🗨️",
    right_anger_bubble: "🗯️",
    ballot_box_with_ballot: "🗳️",
    world_map: "🗺️",
    mount_fuji: "🗻",
    tokyo_tower: "🗼",
    statue_of_liberty: "🗽",
    japan: "🗾",
    moyai: "🗿",
    grinning: "😀",
    grin: "😁",
    joy: "😂",
    smiley: "😃",
    smile: "😄",
    sweat_smile: "😅",
    laughing: "😆",
    satisfied: "😆",
    innocent: "😇",
    smiling_imp: "😈",
    wink: "😉",
    blush: "😊",
    yum: "😋",
    relieved: "😌",
    heart_eyes: "😍",
    sunglasses: "😎",
    smirk: "😏",
    neutral_face: "😐",
    expressionless: "😑",
    unamused: "😒",
    sweat: "😓",
    pensive: "😔",
    confused: "😕",
    confounded: "😖",
    kissing: "😗",
    kissing_heart: "😘",
    kissing_smiling_eyes: "😙",
    kissing_closed_eyes: "😚",
    stuck_out_tongue: "😛",
    stuck_out_tongue_winking_eye: "😜",
    stuck_out_tongue_closed_eyes: "😝",
    disappointed: "😞",
    worried: "😟",
    angry: "😠",
    rage: "😡",
    cry: "😢",
    persevere: "😣",
    triumph: "😤",
    disappointed_relieved: "😥",
    frowning: "😦",
    anguished: "😧",
    fearful: "😨",
    weary: "😩",
    sleepy: "😪",
    tired_face: "😫",
    grimacing: "😬",
    sob: "😭",
    open_mouth: "😮",
    hushed: "😯",
    cold_sweat: "😰",
    scream: "😱",
    astonished: "😲",
    flushed: "😳",
    sleeping: "😴",
    dizzy_face: "😵",
    no_mouth: "😶",
    mask: "😷",
    smile_cat: "😸",
    joy_cat: "😹",
    smiley_cat: "😺",
    heart_eyes_cat: "😻",
    smirk_cat: "😼",
    kissing_cat: "😽",
    pouting_cat: "😾",
    crying_cat_face: "😿",
    scream_cat: "🙀",
    slightly_frowning_face: "🙁",
    slightly_smiling_face: "🙂",
    upside_down_face: "🙃",
    face_with_rolling_eyes: "🙄",
    "woman-gesturing-no": "🙅‍♀️",
    no_good: "🙅‍♀️",
    "man-gesturing-no": "🙅‍♂️",
    "woman-gesturing-ok": "🙆‍♀️",
    ok_woman: "🙆‍♀️",
    "man-gesturing-ok": "🙆‍♂️",
    "woman-bowing": "🙇‍♀️",
    "man-bowing": "🙇‍♂️",
    bow: "🙇‍♂️",
    see_no_evil: "🙈",
    hear_no_evil: "🙉",
    speak_no_evil: "🙊",
    "woman-raising-hand": "🙋‍♀️",
    raising_hand: "🙋‍♀️",
    "man-raising-hand": "🙋‍♂️",
    raised_hands: "🙌",
    "woman-frowning": "🙍‍♀️",
    person_frowning: "🙍‍♀️",
    "man-frowning": "🙍‍♂️",
    "woman-pouting": "🙎‍♀️",
    person_with_pouting_face: "🙎‍♀️",
    "man-pouting": "🙎‍♂️",
    pray: "🙏",
    rocket: "🚀",
    helicopter: "🚁",
    steam_locomotive: "🚂",
    railway_car: "🚃",
    bullettrain_side: "🚄",
    bullettrain_front: "🚅",
    train2: "🚆",
    metro: "🚇",
    light_rail: "🚈",
    station: "🚉",
    tram: "🚊",
    train: "🚋",
    bus: "🚌",
    oncoming_bus: "🚍",
    trolleybus: "🚎",
    busstop: "🚏",
    minibus: "🚐",
    ambulance: "🚑",
    fire_engine: "🚒",
    police_car: "🚓",
    oncoming_police_car: "🚔",
    taxi: "🚕",
    oncoming_taxi: "🚖",
    car: "🚗",
    red_car: "🚗",
    oncoming_automobile: "🚘",
    blue_car: "🚙",
    truck: "🚚",
    articulated_lorry: "🚛",
    tractor: "🚜",
    monorail: "🚝",
    mountain_railway: "🚞",
    suspension_railway: "🚟",
    mountain_cableway: "🚠",
    aerial_tramway: "🚡",
    ship: "🚢",
    "woman-rowing-boat": "🚣‍♀️",
    "man-rowing-boat": "🚣‍♂️",
    rowboat: "🚣‍♂️",
    speedboat: "🚤",
    traffic_light: "🚥",
    vertical_traffic_light: "🚦",
    construction: "🚧",
    rotating_light: "🚨",
    triangular_flag_on_post: "🚩",
    door: "🚪",
    no_entry_sign: "🚫",
    smoking: "🚬",
    no_smoking: "🚭",
    put_litter_in_its_place: "🚮",
    do_not_litter: "🚯",
    potable_water: "🚰",
    "non-potable_water": "🚱",
    bike: "🚲",
    no_bicycles: "🚳",
    "woman-biking": "🚴‍♀️",
    "man-biking": "🚴‍♂️",
    bicyclist: "🚴‍♂️",
    "woman-mountain-biking": "🚵‍♀️",
    "man-mountain-biking": "🚵‍♂️",
    mountain_bicyclist: "🚵‍♂️",
    "woman-walking": "🚶‍♀️",
    "man-walking": "🚶‍♂️",
    walking: "🚶‍♂️",
    no_pedestrians: "🚷",
    children_crossing: "🚸",
    mens: "🚹",
    womens: "🚺",
    restroom: "🚻",
    baby_symbol: "🚼",
    toilet: "🚽",
    wc: "🚾",
    shower: "🚿",
    bath: "🛀",
    bathtub: "🛁",
    passport_control: "🛂",
    customs: "🛃",
    baggage_claim: "🛄",
    left_luggage: "🛅",
    couch_and_lamp: "🛋️",
    sleeping_accommodation: "🛌",
    shopping_bags: "🛍️",
    bellhop_bell: "🛎️",
    bed: "🛏️",
    place_of_worship: "🛐",
    octagonal_sign: "🛑",
    shopping_trolley: "🛒",
    hammer_and_wrench: "🛠️",
    shield: "🛡️",
    oil_drum: "🛢️",
    motorway: "🛣️",
    railway_track: "🛤️",
    motor_boat: "🛥️",
    small_airplane: "🛩️",
    airplane_departure: "🛫",
    airplane_arriving: "🛬",
    satellite: "🛰️",
    passenger_ship: "🛳️",
    scooter: "🛴",
    motor_scooter: "🛵",
    canoe: "🛶",
    sled: "🛷",
    flying_saucer: "🛸",
    zipper_mouth_face: "🤐",
    money_mouth_face: "🤑",
    face_with_thermometer: "🤒",
    nerd_face: "🤓",
    thinking_face: "🤔",
    face_with_head_bandage: "🤕",
    robot_face: "🤖",
    hugging_face: "🤗",
    the_horns: "🤘",
    sign_of_the_horns: "🤘",
    call_me_hand: "🤙",
    raised_back_of_hand: "🤚",
    "left-facing_fist": "🤛",
    "right-facing_fist": "🤜",
    handshake: "🤝",
    crossed_fingers: "🤞",
    hand_with_index_and_middle_fingers_crossed: "🤞",
    i_love_you_hand_sign: "🤟",
    face_with_cowboy_hat: "🤠",
    clown_face: "🤡",
    nauseated_face: "🤢",
    rolling_on_the_floor_laughing: "🤣",
    drooling_face: "🤤",
    lying_face: "🤥",
    "woman-facepalming": "🤦‍♀️",
    "man-facepalming": "🤦‍♂️",
    face_palm: "🤦",
    sneezing_face: "🤧",
    face_with_raised_eyebrow: "🤨",
    face_with_one_eyebrow_raised: "🤨",
    "star-struck": "🤩",
    grinning_face_with_star_eyes: "🤩",
    zany_face: "🤪",
    grinning_face_with_one_large_and_one_small_eye: "🤪",
    shushing_face: "🤫",
    face_with_finger_covering_closed_lips: "🤫",
    face_with_symbols_on_mouth: "🤬",
    serious_face_with_symbols_covering_mouth: "🤬",
    face_with_hand_over_mouth: "🤭",
    smiling_face_with_smiling_eyes_and_hand_covering_mouth: "🤭",
    face_vomiting: "🤮",
    face_with_open_mouth_vomiting: "🤮",
    exploding_head: "🤯",
    shocked_face_with_exploding_head: "🤯",
    pregnant_woman: "🤰",
    "breast-feeding": "🤱",
    palms_up_together: "🤲",
    selfie: "🤳",
    prince: "🤴",
    man_in_tuxedo: "🤵",
    mrs_claus: "🤶",
    mother_christmas: "🤶",
    "woman-shrugging": "🤷‍♀️",
    "man-shrugging": "🤷‍♂️",
    shrug: "🤷",
    "woman-cartwheeling": "🤸‍♀️",
    "man-cartwheeling": "🤸‍♂️",
    person_doing_cartwheel: "🤸",
    "woman-juggling": "🤹‍♀️",
    "man-juggling": "🤹‍♂️",
    juggling: "🤹",
    fencer: "🤺",
    "woman-wrestling": "🤼‍♀️",
    "man-wrestling": "🤼‍♂️",
    wrestlers: "🤼",
    "woman-playing-water-polo": "🤽‍♀️",
    "man-playing-water-polo": "🤽‍♂️",
    water_polo: "🤽",
    "woman-playing-handball": "🤾‍♀️",
    "man-playing-handball": "🤾‍♂️",
    handball: "🤾",
    wilted_flower: "🥀",
    drum_with_drumsticks: "🥁",
    clinking_glasses: "🥂",
    tumbler_glass: "🥃",
    spoon: "🥄",
    goal_net: "🥅",
    first_place_medal: "🥇",
    second_place_medal: "🥈",
    third_place_medal: "🥉",
    boxing_glove: "🥊",
    martial_arts_uniform: "🥋",
    curling_stone: "🥌",
    croissant: "🥐",
    avocado: "🥑",
    cucumber: "🥒",
    bacon: "🥓",
    potato: "🥔",
    carrot: "🥕",
    baguette_bread: "🥖",
    green_salad: "🥗",
    shallow_pan_of_food: "🥘",
    stuffed_flatbread: "🥙",
    egg: "🥚",
    glass_of_milk: "🥛",
    peanuts: "🥜",
    kiwifruit: "🥝",
    pancakes: "🥞",
    dumpling: "🥟",
    fortune_cookie: "🥠",
    takeout_box: "🥡",
    chopsticks: "🥢",
    bowl_with_spoon: "🥣",
    cup_with_straw: "🥤",
    coconut: "🥥",
    broccoli: "🥦",
    pie: "🥧",
    pretzel: "🥨",
    cut_of_meat: "🥩",
    sandwich: "🥪",
    canned_food: "🥫",
    crab: "🦀",
    lion_face: "🦁",
    scorpion: "🦂",
    turkey: "🦃",
    unicorn_face: "🦄",
    eagle: "🦅",
    duck: "🦆",
    bat: "🦇",
    shark: "🦈",
    owl: "🦉",
    fox_face: "🦊",
    butterfly: "🦋",
    deer: "🦌",
    gorilla: "🦍",
    lizard: "🦎",
    rhinoceros: "🦏",
    shrimp: "🦐",
    squid: "🦑",
    giraffe_face: "🦒",
    zebra_face: "🦓",
    hedgehog: "🦔",
    sauropod: "🦕",
    "t-rex": "🦖",
    cricket: "🦗",
    cheese_wedge: "🧀",
    face_with_monocle: "🧐",
    adult: "🧑",
    child: "🧒",
    older_adult: "🧓",
    bearded_person: "🧔",
    person_with_headscarf: "🧕",
    woman_in_steamy_room: "🧖‍♀️",
    man_in_steamy_room: "🧖‍♂️",
    person_in_steamy_room: "🧖‍♂️",
    woman_climbing: "🧗‍♀️",
    person_climbing: "🧗‍♀️",
    man_climbing: "🧗‍♂️",
    woman_in_lotus_position: "🧘‍♀️",
    person_in_lotus_position: "🧘‍♀️",
    man_in_lotus_position: "🧘‍♂️",
    female_mage: "🧙‍♀️",
    mage: "🧙‍♀️",
    male_mage: "🧙‍♂️",
    female_fairy: "🧚‍♀️",
    fairy: "🧚‍♀️",
    male_fairy: "🧚‍♂️",
    female_vampire: "🧛‍♀️",
    vampire: "🧛‍♀️",
    male_vampire: "🧛‍♂️",
    mermaid: "🧜‍♀️",
    merman: "🧜‍♂️",
    merperson: "🧜‍♂️",
    female_elf: "🧝‍♀️",
    male_elf: "🧝‍♂️",
    elf: "🧝‍♂️",
    female_genie: "🧞‍♀️",
    male_genie: "🧞‍♂️",
    genie: "🧞‍♂️",
    female_zombie: "🧟‍♀️",
    male_zombie: "🧟‍♂️",
    zombie: "🧟‍♂️",
    brain: "🧠",
    orange_heart: "🧡",
    billed_cap: "🧢",
    scarf: "🧣",
    gloves: "🧤",
    coat: "🧥",
    socks: "🧦",
    bangbang: "‼️",
    interrobang: "⁉️",
    tm: "™️",
    information_source: "ℹ️",
    left_right_arrow: "↔️",
    arrow_up_down: "↕️",
    arrow_upper_left: "↖️",
    arrow_upper_right: "↗️",
    arrow_lower_right: "↘️",
    arrow_lower_left: "↙️",
    leftwards_arrow_with_hook: "↩️",
    arrow_right_hook: "↪️",
    watch: "⌚",
    hourglass: "⌛",
    keyboard: "⌨️",
    eject: "⏏️",
    fast_forward: "⏩",
    rewind: "⏪",
    arrow_double_up: "⏫",
    arrow_double_down: "⏬",
    black_right_pointing_double_triangle_with_vertical_bar: "⏭️",
    black_left_pointing_double_triangle_with_vertical_bar: "⏮️",
    black_right_pointing_triangle_with_double_vertical_bar: "⏯️",
    alarm_clock: "⏰",
    stopwatch: "⏱️",
    timer_clock: "⏲️",
    hourglass_flowing_sand: "⏳",
    double_vertical_bar: "⏸️",
    black_square_for_stop: "⏹️",
    black_circle_for_record: "⏺️",
    m: "Ⓜ️",
    black_small_square: "▪️",
    white_small_square: "▫️",
    arrow_forward: "▶️",
    arrow_backward: "◀️",
    white_medium_square: "◻️",
    black_medium_square: "◼️",
    white_medium_small_square: "◽",
    black_medium_small_square: "◾",
    sunny: "☀️",
    cloud: "☁️",
    umbrella: "☂️",
    snowman: "☃️",
    comet: "☄️",
    phone: "☎️",
    telephone: "☎️",
    ballot_box_with_check: "☑️",
    shamrock: "☘️",
    point_up: "☝️",
    skull_and_crossbones: "☠️",
    radioactive_sign: "☢️",
    biohazard_sign: "☣️",
    orthodox_cross: "☦️",
    star_and_crescent: "☪️",
    peace_symbol: "☮️",
    yin_yang: "☯️",
    wheel_of_dharma: "☸️",
    white_frowning_face: "☹️",
    relaxed: "☺️",
    female_sign: "♀️",
    male_sign: "♂️",
    gemini: "♊",
    cancer: "♋",
    leo: "♌",
    virgo: "♍",
    libra: "♎",
    scorpius: "♏",
    spades: "♠️",
    clubs: "♣️",
    hearts: "♥️",
    diamonds: "♦️",
    hotsprings: "♨️",
    recycle: "♻️",
    wheelchair: "♿",
    hammer_and_pick: "⚒️",
    crossed_swords: "⚔️",
    medical_symbol: "⚕️",
    staff_of_aesculapius: "⚕️",
    scales: "⚖️",
    alembic: "⚗️",
    gear: "⚙️",
    atom_symbol: "⚛️",
    fleur_de_lis: "⚜️",
    warning: "⚠️",
    zap: "⚡",
    white_circle: "⚪",
    black_circle: "⚫",
    coffin: "⚰️",
    funeral_urn: "⚱️",
    soccer: "⚽",
    baseball: "⚾",
    snowman_without_snow: "⛄",
    partly_sunny: "⛅",
    thunder_cloud_and_rain: "⛈️",
    ophiuchus: "⛎",
    pick: "⛏️",
    helmet_with_white_cross: "⛑️",
    chains: "⛓️",
    no_entry: "⛔",
    shinto_shrine: "⛩️",
    church: "⛪",
    mountain: "⛰️",
    umbrella_on_ground: "⛱️",
    fountain: "⛲",
    golf: "⛳",
    ferry: "⛴️",
    boat: "⛵",
    sailboat: "⛵",
    skier: "⛷️",
    ice_skate: "⛸️",
    "woman-bouncing-ball": "⛹️‍♀️",
    "man-bouncing-ball": "⛹️‍♂️",
    person_with_ball: "⛹️‍♂️",
    tent: "⛺",
    fuelpump: "⛽",
    scissors: "✂️",
    airplane: "✈️",
    email: "✉️",
    envelope: "✉️",
    fist: "✊",
    hand: "✋",
    raised_hand: "✋",
    v: "✌️",
    writing_hand: "✍️",
    pencil2: "✏️",
    black_nib: "✒️",
    heavy_check_mark: "✔️",
    heavy_multiplication_x: "✖️",
    latin_cross: "✝️",
    star_of_david: "✡️",
    eight_spoked_asterisk: "✳️",
    eight_pointed_black_star: "✴️",
    snowflake: "❄️",
    sparkle: "❇️",
    x: "❌",
    negative_squared_cross_mark: "❎",
    heavy_heart_exclamation_mark_ornament: "❣️",
    heart: "❤️",
    arrow_right: "➡️",
    curly_loop: "➰",
    loop: "➿",
    arrow_heading_up: "⤴️",
    arrow_heading_down: "⤵️",
    arrow_left: "⬅️",
    arrow_up: "⬆️",
    arrow_down: "⬇️",
    black_large_square: "⬛",
    white_large_square: "⬜",
    star: "⭐",
    o: "⭕",
    wavy_dash: "〰️",
    part_alternation_mark: "〽️",
    congratulations: "㊗️",
    secret: "㊙️",
  },
  Mn = r(
    Object.freeze({
      __proto__: null,
      umbrella_with_rain_drops: "☔",
      coffee: "☕",
      aries: "♈",
      taurus: "♉",
      sagittarius: "♐",
      capricorn: "♑",
      aquarius: "♒",
      pisces: "♓",
      anchor: "⚓",
      white_check_mark: "✅",
      sparkles: "✨",
      question: "❓",
      grey_question: "❔",
      grey_exclamation: "❕",
      exclamation: "❗",
      heavy_exclamation_mark: "❗",
      heavy_plus_sign: "➕",
      heavy_minus_sign: "➖",
      heavy_division_sign: "➗",
      hash: "#️⃣",
      keycap_star: "*️⃣",
      zero: "0️⃣",
      one: "1️⃣",
      two: "2️⃣",
      three: "3️⃣",
      four: "4️⃣",
      five: "5️⃣",
      six: "6️⃣",
      seven: "7️⃣",
      eight: "8️⃣",
      nine: "9️⃣",
      copyright: "©️",
      registered: "®️",
      mahjong: "🀄",
      black_joker: "🃏",
      a: "🅰️",
      b: "🅱️",
      o2: "🅾️",
      parking: "🅿️",
      ab: "🆎",
      cl: "🆑",
      cool: "🆒",
      free: "🆓",
      id: "🆔",
      ng: "🆖",
      ok: "🆗",
      sos: "🆘",
      up: "🆙",
      vs: "🆚",
      koko: "🈁",
      sa: "🈂️",
      u7121: "🈚",
      u6307: "🈯",
      u7981: "🈲",
      u7a7a: "🈳",
      u5408: "🈴",
      u6e80: "🈵",
      u6709: "🈶",
      u6708: "🈷️",
      u7533: "🈸",
      u5272: "🈹",
      u55b6: "🈺",
      ideograph_advantage: "🉐",
      accept: "🉑",
      cyclone: "🌀",
      foggy: "🌁",
      closed_umbrella: "🌂",
      night_with_stars: "🌃",
      sunrise_over_mountains: "🌄",
      sunrise: "🌅",
      city_sunset: "🌆",
      city_sunrise: "🌇",
      rainbow: "🌈",
      bridge_at_night: "🌉",
      ocean: "🌊",
      volcano: "🌋",
      milky_way: "🌌",
      earth_africa: "🌍",
      earth_americas: "🌎",
      earth_asia: "🌏",
      globe_with_meridians: "🌐",
      new_moon: "🌑",
      waxing_crescent_moon: "🌒",
      first_quarter_moon: "🌓",
      moon: "🌔",
      waxing_gibbous_moon: "🌔",
      full_moon: "🌕",
      waning_gibbous_moon: "🌖",
      last_quarter_moon: "🌗",
      waning_crescent_moon: "🌘",
      crescent_moon: "🌙",
      new_moon_with_face: "🌚",
      first_quarter_moon_with_face: "🌛",
      last_quarter_moon_with_face: "🌜",
      full_moon_with_face: "🌝",
      sun_with_face: "🌞",
      star2: "🌟",
      stars: "🌠",
      thermometer: "🌡️",
      mostly_sunny: "🌤️",
      sun_small_cloud: "🌤️",
      barely_sunny: "🌥️",
      sun_behind_cloud: "🌥️",
      partly_sunny_rain: "🌦️",
      sun_behind_rain_cloud: "🌦️",
      rain_cloud: "🌧️",
      snow_cloud: "🌨️",
      lightning: "🌩️",
      lightning_cloud: "🌩️",
      tornado: "🌪️",
      tornado_cloud: "🌪️",
      fog: "🌫️",
      wind_blowing_face: "🌬️",
      hotdog: "🌭",
      taco: "🌮",
      burrito: "🌯",
      chestnut: "🌰",
      seedling: "🌱",
      evergreen_tree: "🌲",
      deciduous_tree: "🌳",
      palm_tree: "🌴",
      cactus: "🌵",
      hot_pepper: "🌶️",
      tulip: "🌷",
      cherry_blossom: "🌸",
      rose: "🌹",
      hibiscus: "🌺",
      sunflower: "🌻",
      blossom: "🌼",
      corn: "🌽",
      ear_of_rice: "🌾",
      herb: "🌿",
      four_leaf_clover: "🍀",
      maple_leaf: "🍁",
      fallen_leaf: "🍂",
      leaves: "🍃",
      mushroom: "🍄",
      tomato: "🍅",
      eggplant: "🍆",
      grapes: "🍇",
      melon: "🍈",
      watermelon: "🍉",
      tangerine: "🍊",
      lemon: "🍋",
      banana: "🍌",
      pineapple: "🍍",
      apple: "🍎",
      green_apple: "🍏",
      pear: "🍐",
      peach: "🍑",
      cherries: "🍒",
      strawberry: "🍓",
      hamburger: "🍔",
      pizza: "🍕",
      meat_on_bone: "🍖",
      poultry_leg: "🍗",
      rice_cracker: "🍘",
      rice_ball: "🍙",
      rice: "🍚",
      curry: "🍛",
      ramen: "🍜",
      spaghetti: "🍝",
      bread: "🍞",
      fries: "🍟",
      sweet_potato: "🍠",
      dango: "🍡",
      oden: "🍢",
      sushi: "🍣",
      fried_shrimp: "🍤",
      fish_cake: "🍥",
      icecream: "🍦",
      shaved_ice: "🍧",
      ice_cream: "🍨",
      doughnut: "🍩",
      cookie: "🍪",
      chocolate_bar: "🍫",
      candy: "🍬",
      lollipop: "🍭",
      custard: "🍮",
      honey_pot: "🍯",
      cake: "🍰",
      bento: "🍱",
      stew: "🍲",
      fried_egg: "🍳",
      cooking: "🍳",
      fork_and_knife: "🍴",
      tea: "🍵",
      sake: "🍶",
      wine_glass: "🍷",
      cocktail: "🍸",
      tropical_drink: "🍹",
      beer: "🍺",
      beers: "🍻",
      baby_bottle: "🍼",
      knife_fork_plate: "🍽️",
      champagne: "🍾",
      popcorn: "🍿",
      ribbon: "🎀",
      gift: "🎁",
      birthday: "🎂",
      jack_o_lantern: "🎃",
      christmas_tree: "🎄",
      santa: "🎅",
      fireworks: "🎆",
      sparkler: "🎇",
      balloon: "🎈",
      tada: "🎉",
      confetti_ball: "🎊",
      tanabata_tree: "🎋",
      crossed_flags: "🎌",
      bamboo: "🎍",
      dolls: "🎎",
      flags: "🎏",
      wind_chime: "🎐",
      rice_scene: "🎑",
      school_satchel: "🎒",
      mortar_board: "🎓",
      medal: "🎖️",
      reminder_ribbon: "🎗️",
      studio_microphone: "🎙️",
      level_slider: "🎚️",
      control_knobs: "🎛️",
      film_frames: "🎞️",
      admission_tickets: "🎟️",
      carousel_horse: "🎠",
      ferris_wheel: "🎡",
      roller_coaster: "🎢",
      fishing_pole_and_fish: "🎣",
      microphone: "🎤",
      movie_camera: "🎥",
      cinema: "🎦",
      headphones: "🎧",
      art: "🎨",
      tophat: "🎩",
      circus_tent: "🎪",
      ticket: "🎫",
      clapper: "🎬",
      performing_arts: "🎭",
      video_game: "🎮",
      dart: "🎯",
      slot_machine: "🎰",
      game_die: "🎲",
      bowling: "🎳",
      flower_playing_cards: "🎴",
      musical_note: "🎵",
      notes: "🎶",
      saxophone: "🎷",
      guitar: "🎸",
      musical_keyboard: "🎹",
      trumpet: "🎺",
      violin: "🎻",
      musical_score: "🎼",
      running_shirt_with_sash: "🎽",
      tennis: "🎾",
      ski: "🎿",
      basketball: "🏀",
      checkered_flag: "🏁",
      snowboarder: "🏂",
      runner: "🏃‍♂️",
      running: "🏃‍♂️",
      surfer: "🏄‍♂️",
      sports_medal: "🏅",
      trophy: "🏆",
      horse_racing: "🏇",
      football: "🏈",
      rugby_football: "🏉",
      swimmer: "🏊‍♂️",
      weight_lifter: "🏋️‍♂️",
      golfer: "🏌️‍♂️",
      racing_motorcycle: "🏍️",
      racing_car: "🏎️",
      cricket_bat_and_ball: "🏏",
      volleyball: "🏐",
      field_hockey_stick_and_ball: "🏑",
      ice_hockey_stick_and_puck: "🏒",
      table_tennis_paddle_and_ball: "🏓",
      snow_capped_mountain: "🏔️",
      camping: "🏕️",
      beach_with_umbrella: "🏖️",
      building_construction: "🏗️",
      house_buildings: "🏘️",
      cityscape: "🏙️",
      derelict_house_building: "🏚️",
      classical_building: "🏛️",
      desert: "🏜️",
      desert_island: "🏝️",
      national_park: "🏞️",
      stadium: "🏟️",
      house: "🏠",
      house_with_garden: "🏡",
      office: "🏢",
      post_office: "🏣",
      european_post_office: "🏤",
      hospital: "🏥",
      bank: "🏦",
      atm: "🏧",
      hotel: "🏨",
      love_hotel: "🏩",
      convenience_store: "🏪",
      school: "🏫",
      department_store: "🏬",
      factory: "🏭",
      izakaya_lantern: "🏮",
      lantern: "🏮",
      japanese_castle: "🏯",
      european_castle: "🏰",
      waving_white_flag: "🏳️",
      waving_black_flag: "🏴",
      rosette: "🏵️",
      label: "🏷️",
      badminton_racquet_and_shuttlecock: "🏸",
      bow_and_arrow: "🏹",
      amphora: "🏺",
      rat: "🐀",
      mouse2: "🐁",
      ox: "🐂",
      water_buffalo: "🐃",
      cow2: "🐄",
      tiger2: "🐅",
      leopard: "🐆",
      rabbit2: "🐇",
      cat2: "🐈",
      dragon: "🐉",
      crocodile: "🐊",
      whale2: "🐋",
      snail: "🐌",
      snake: "🐍",
      racehorse: "🐎",
      ram: "🐏",
      goat: "🐐",
      sheep: "🐑",
      monkey: "🐒",
      rooster: "🐓",
      chicken: "🐔",
      dog2: "🐕",
      pig2: "🐖",
      boar: "🐗",
      elephant: "🐘",
      octopus: "🐙",
      shell: "🐚",
      bug: "🐛",
      ant: "🐜",
      bee: "🐝",
      honeybee: "🐝",
      beetle: "🐞",
      fish: "🐟",
      tropical_fish: "🐠",
      blowfish: "🐡",
      turtle: "🐢",
      hatching_chick: "🐣",
      baby_chick: "🐤",
      hatched_chick: "🐥",
      bird: "🐦",
      penguin: "🐧",
      koala: "🐨",
      poodle: "🐩",
      dromedary_camel: "🐪",
      camel: "🐫",
      dolphin: "🐬",
      flipper: "🐬",
      mouse: "🐭",
      cow: "🐮",
      tiger: "🐯",
      rabbit: "🐰",
      cat: "🐱",
      dragon_face: "🐲",
      whale: "🐳",
      horse: "🐴",
      monkey_face: "🐵",
      dog: "🐶",
      pig: "🐷",
      frog: "🐸",
      hamster: "🐹",
      wolf: "🐺",
      bear: "🐻",
      panda_face: "🐼",
      pig_nose: "🐽",
      feet: "🐾",
      paw_prints: "🐾",
      chipmunk: "🐿️",
      eyes: "👀",
      eye: "👁️",
      ear: "👂",
      nose: "👃",
      lips: "👄",
      tongue: "👅",
      point_up_2: "👆",
      point_down: "👇",
      point_left: "👈",
      point_right: "👉",
      facepunch: "👊",
      punch: "👊",
      wave: "👋",
      ok_hand: "👌",
      thumbsup: "👍",
      thumbsdown: "👎",
      clap: "👏",
      open_hands: "👐",
      crown: "👑",
      womans_hat: "👒",
      eyeglasses: "👓",
      necktie: "👔",
      shirt: "👕",
      tshirt: "👕",
      jeans: "👖",
      dress: "👗",
      kimono: "👘",
      bikini: "👙",
      womans_clothes: "👚",
      purse: "👛",
      handbag: "👜",
      pouch: "👝",
      mans_shoe: "👞",
      shoe: "👞",
      athletic_shoe: "👟",
      high_heel: "👠",
      sandal: "👡",
      boot: "👢",
      footprints: "👣",
      bust_in_silhouette: "👤",
      busts_in_silhouette: "👥",
      boy: "👦",
      girl: "👧",
      family: "👨‍👩‍👦",
      man: "👨",
      couple_with_heart: "👩‍❤️‍👨",
      couplekiss: "👩‍❤️‍💋‍👨",
      woman: "👩",
      couple: "👫",
      man_and_woman_holding_hands: "👫",
      two_men_holding_hands: "👬",
      two_women_holding_hands: "👭",
      cop: "👮‍♂️",
      dancers: "👯‍♀️",
      bride_with_veil: "👰",
      person_with_blond_hair: "👱‍♂️",
      man_with_gua_pi_mao: "👲",
      man_with_turban: "👳‍♂️",
      older_man: "👴",
      older_woman: "👵",
      baby: "👶",
      construction_worker: "👷‍♂️",
      princess: "👸",
      japanese_ogre: "👹",
      japanese_goblin: "👺",
      ghost: "👻",
      angel: "👼",
      alien: "👽",
      space_invader: "👾",
      imp: "👿",
      skull: "💀",
      information_desk_person: "💁‍♀️",
      guardsman: "💂‍♂️",
      dancer: "💃",
      lipstick: "💄",
      nail_care: "💅",
      massage: "💆‍♀️",
      haircut: "💇‍♀️",
      barber: "💈",
      syringe: "💉",
      pill: "💊",
      kiss: "💋",
      love_letter: "💌",
      ring: "💍",
      gem: "💎",
      bouquet: "💐",
      wedding: "💒",
      heartbeat: "💓",
      broken_heart: "💔",
      two_hearts: "💕",
      sparkling_heart: "💖",
      heartpulse: "💗",
      cupid: "💘",
      blue_heart: "💙",
      green_heart: "💚",
      yellow_heart: "💛",
      purple_heart: "💜",
      gift_heart: "💝",
      revolving_hearts: "💞",
      heart_decoration: "💟",
      diamond_shape_with_a_dot_inside: "💠",
      bulb: "💡",
      anger: "💢",
      bomb: "💣",
      zzz: "💤",
      boom: "💥",
      collision: "💥",
      sweat_drops: "💦",
      droplet: "💧",
      dash: "💨",
      poop: "💩",
      muscle: "💪",
      dizzy: "💫",
      speech_balloon: "💬",
      thought_balloon: "💭",
      white_flower: "💮",
      moneybag: "💰",
      currency_exchange: "💱",
      heavy_dollar_sign: "💲",
      credit_card: "💳",
      yen: "💴",
      dollar: "💵",
      euro: "💶",
      pound: "💷",
      money_with_wings: "💸",
      chart: "💹",
      seat: "💺",
      computer: "💻",
      briefcase: "💼",
      minidisc: "💽",
      floppy_disk: "💾",
      cd: "💿",
      dvd: "📀",
      file_folder: "📁",
      open_file_folder: "📂",
      page_with_curl: "📃",
      page_facing_up: "📄",
      date: "📅",
      calendar: "📆",
      card_index: "📇",
      chart_with_upwards_trend: "📈",
      chart_with_downwards_trend: "📉",
      bar_chart: "📊",
      clipboard: "📋",
      pushpin: "📌",
      round_pushpin: "📍",
      paperclip: "📎",
      straight_ruler: "📏",
      triangular_ruler: "📐",
      bookmark_tabs: "📑",
      ledger: "📒",
      notebook: "📓",
      notebook_with_decorative_cover: "📔",
      closed_book: "📕",
      book: "📖",
      open_book: "📖",
      green_book: "📗",
      blue_book: "📘",
      orange_book: "📙",
      books: "📚",
      name_badge: "📛",
      scroll: "📜",
      memo: "📝",
      pencil: "📝",
      telephone_receiver: "📞",
      pager: "📟",
      fax: "📠",
      satellite_antenna: "📡",
      loudspeaker: "📢",
      mega: "📣",
      outbox_tray: "📤",
      inbox_tray: "📥",
      incoming_envelope: "📨",
      envelope_with_arrow: "📩",
      mailbox_closed: "📪",
      mailbox: "📫",
      mailbox_with_mail: "📬",
      mailbox_with_no_mail: "📭",
      postbox: "📮",
      postal_horn: "📯",
      newspaper: "📰",
      iphone: "📱",
      calling: "📲",
      vibration_mode: "📳",
      mobile_phone_off: "📴",
      no_mobile_phones: "📵",
      signal_strength: "📶",
      camera: "📷",
      camera_with_flash: "📸",
      video_camera: "📹",
      tv: "📺",
      radio: "📻",
      vhs: "📼",
      film_projector: "📽️",
      prayer_beads: "📿",
      twisted_rightwards_arrows: "🔀",
      repeat: "🔁",
      repeat_one: "🔂",
      arrows_clockwise: "🔃",
      arrows_counterclockwise: "🔄",
      low_brightness: "🔅",
      high_brightness: "🔆",
      mute: "🔇",
      speaker: "🔈",
      sound: "🔉",
      loud_sound: "🔊",
      battery: "🔋",
      electric_plug: "🔌",
      mag: "🔍",
      mag_right: "🔎",
      lock_with_ink_pen: "🔏",
      closed_lock_with_key: "🔐",
      key: "🔑",
      lock: "🔒",
      unlock: "🔓",
      bell: "🔔",
      no_bell: "🔕",
      bookmark: "🔖",
      link: "🔗",
      radio_button: "🔘",
      back: "🔙",
      end: "🔚",
      on: "🔛",
      soon: "🔜",
      underage: "🔞",
      keycap_ten: "🔟",
      capital_abcd: "🔠",
      abcd: "🔡",
      symbols: "🔣",
      abc: "🔤",
      fire: "🔥",
      flashlight: "🔦",
      wrench: "🔧",
      hammer: "🔨",
      nut_and_bolt: "🔩",
      hocho: "🔪",
      knife: "🔪",
      gun: "🔫",
      microscope: "🔬",
      telescope: "🔭",
      crystal_ball: "🔮",
      six_pointed_star: "🔯",
      beginner: "🔰",
      trident: "🔱",
      black_square_button: "🔲",
      white_square_button: "🔳",
      red_circle: "🔴",
      large_blue_circle: "🔵",
      large_orange_diamond: "🔶",
      large_blue_diamond: "🔷",
      small_orange_diamond: "🔸",
      small_blue_diamond: "🔹",
      small_red_triangle: "🔺",
      small_red_triangle_down: "🔻",
      arrow_up_small: "🔼",
      arrow_down_small: "🔽",
      om_symbol: "🕉️",
      dove_of_peace: "🕊️",
      kaaba: "🕋",
      mosque: "🕌",
      synagogue: "🕍",
      menorah_with_nine_branches: "🕎",
      candle: "🕯️",
      mantelpiece_clock: "🕰️",
      hole: "🕳️",
      man_in_business_suit_levitating: "🕴️",
      sleuth_or_spy: "🕵️‍♂️",
      dark_sunglasses: "🕶️",
      spider: "🕷️",
      spider_web: "🕸️",
      joystick: "🕹️",
      man_dancing: "🕺",
      linked_paperclips: "🖇️",
      lower_left_ballpoint_pen: "🖊️",
      lower_left_fountain_pen: "🖋️",
      lower_left_paintbrush: "🖌️",
      lower_left_crayon: "🖍️",
      raised_hand_with_fingers_splayed: "🖐️",
      middle_finger: "🖕",
      reversed_hand_with_middle_finger_extended: "🖕",
      black_heart: "🖤",
      desktop_computer: "🖥️",
      printer: "🖨️",
      three_button_mouse: "🖱️",
      trackball: "🖲️",
      frame_with_picture: "🖼️",
      card_index_dividers: "🗂️",
      card_file_box: "🗃️",
      file_cabinet: "🗄️",
      wastebasket: "🗑️",
      spiral_note_pad: "🗒️",
      spiral_calendar_pad: "🗓️",
      compression: "🗜️",
      old_key: "🗝️",
      rolled_up_newspaper: "🗞️",
      dagger_knife: "🗡️",
      speaking_head_in_silhouette: "🗣️",
      left_speech_bubble: "🗨️",
      right_anger_bubble: "🗯️",
      ballot_box_with_ballot: "🗳️",
      world_map: "🗺️",
      mount_fuji: "🗻",
      tokyo_tower: "🗼",
      statue_of_liberty: "🗽",
      japan: "🗾",
      moyai: "🗿",
      grinning: "😀",
      grin: "😁",
      joy: "😂",
      smiley: "😃",
      smile: "😄",
      sweat_smile: "😅",
      laughing: "😆",
      satisfied: "😆",
      innocent: "😇",
      smiling_imp: "😈",
      wink: "😉",
      blush: "😊",
      yum: "😋",
      relieved: "😌",
      heart_eyes: "😍",
      sunglasses: "😎",
      smirk: "😏",
      neutral_face: "😐",
      expressionless: "😑",
      unamused: "😒",
      sweat: "😓",
      pensive: "😔",
      confused: "😕",
      confounded: "😖",
      kissing: "😗",
      kissing_heart: "😘",
      kissing_smiling_eyes: "😙",
      kissing_closed_eyes: "😚",
      stuck_out_tongue: "😛",
      stuck_out_tongue_winking_eye: "😜",
      stuck_out_tongue_closed_eyes: "😝",
      disappointed: "😞",
      worried: "😟",
      angry: "😠",
      rage: "😡",
      cry: "😢",
      persevere: "😣",
      triumph: "😤",
      disappointed_relieved: "😥",
      frowning: "😦",
      anguished: "😧",
      fearful: "😨",
      weary: "😩",
      sleepy: "😪",
      tired_face: "😫",
      grimacing: "😬",
      sob: "😭",
      open_mouth: "😮",
      hushed: "😯",
      cold_sweat: "😰",
      scream: "😱",
      astonished: "😲",
      flushed: "😳",
      sleeping: "😴",
      dizzy_face: "😵",
      no_mouth: "😶",
      mask: "😷",
      smile_cat: "😸",
      joy_cat: "😹",
      smiley_cat: "😺",
      heart_eyes_cat: "😻",
      smirk_cat: "😼",
      kissing_cat: "😽",
      pouting_cat: "😾",
      crying_cat_face: "😿",
      scream_cat: "🙀",
      slightly_frowning_face: "🙁",
      slightly_smiling_face: "🙂",
      upside_down_face: "🙃",
      face_with_rolling_eyes: "🙄",
      no_good: "🙅‍♀️",
      ok_woman: "🙆‍♀️",
      bow: "🙇‍♂️",
      see_no_evil: "🙈",
      hear_no_evil: "🙉",
      speak_no_evil: "🙊",
      raising_hand: "🙋‍♀️",
      raised_hands: "🙌",
      person_frowning: "🙍‍♀️",
      person_with_pouting_face: "🙎‍♀️",
      pray: "🙏",
      rocket: "🚀",
      helicopter: "🚁",
      steam_locomotive: "🚂",
      railway_car: "🚃",
      bullettrain_side: "🚄",
      bullettrain_front: "🚅",
      train2: "🚆",
      metro: "🚇",
      light_rail: "🚈",
      station: "🚉",
      tram: "🚊",
      train: "🚋",
      bus: "🚌",
      oncoming_bus: "🚍",
      trolleybus: "🚎",
      busstop: "🚏",
      minibus: "🚐",
      ambulance: "🚑",
      fire_engine: "🚒",
      police_car: "🚓",
      oncoming_police_car: "🚔",
      taxi: "🚕",
      oncoming_taxi: "🚖",
      car: "🚗",
      red_car: "🚗",
      oncoming_automobile: "🚘",
      blue_car: "🚙",
      truck: "🚚",
      articulated_lorry: "🚛",
      tractor: "🚜",
      monorail: "🚝",
      mountain_railway: "🚞",
      suspension_railway: "🚟",
      mountain_cableway: "🚠",
      aerial_tramway: "🚡",
      ship: "🚢",
      rowboat: "🚣‍♂️",
      speedboat: "🚤",
      traffic_light: "🚥",
      vertical_traffic_light: "🚦",
      construction: "🚧",
      rotating_light: "🚨",
      triangular_flag_on_post: "🚩",
      door: "🚪",
      no_entry_sign: "🚫",
      smoking: "🚬",
      no_smoking: "🚭",
      put_litter_in_its_place: "🚮",
      do_not_litter: "🚯",
      potable_water: "🚰",
      bike: "🚲",
      no_bicycles: "🚳",
      bicyclist: "🚴‍♂️",
      mountain_bicyclist: "🚵‍♂️",
      walking: "🚶‍♂️",
      no_pedestrians: "🚷",
      children_crossing: "🚸",
      mens: "🚹",
      womens: "🚺",
      restroom: "🚻",
      baby_symbol: "🚼",
      toilet: "🚽",
      wc: "🚾",
      shower: "🚿",
      bath: "🛀",
      bathtub: "🛁",
      passport_control: "🛂",
      customs: "🛃",
      baggage_claim: "🛄",
      left_luggage: "🛅",
      couch_and_lamp: "🛋️",
      sleeping_accommodation: "🛌",
      shopping_bags: "🛍️",
      bellhop_bell: "🛎️",
      bed: "🛏️",
      place_of_worship: "🛐",
      octagonal_sign: "🛑",
      shopping_trolley: "🛒",
      hammer_and_wrench: "🛠️",
      shield: "🛡️",
      oil_drum: "🛢️",
      motorway: "🛣️",
      railway_track: "🛤️",
      motor_boat: "🛥️",
      small_airplane: "🛩️",
      airplane_departure: "🛫",
      airplane_arriving: "🛬",
      satellite: "🛰️",
      passenger_ship: "🛳️",
      scooter: "🛴",
      motor_scooter: "🛵",
      canoe: "🛶",
      sled: "🛷",
      flying_saucer: "🛸",
      zipper_mouth_face: "🤐",
      money_mouth_face: "🤑",
      face_with_thermometer: "🤒",
      nerd_face: "🤓",
      thinking_face: "🤔",
      face_with_head_bandage: "🤕",
      robot_face: "🤖",
      hugging_face: "🤗",
      the_horns: "🤘",
      sign_of_the_horns: "🤘",
      call_me_hand: "🤙",
      raised_back_of_hand: "🤚",
      handshake: "🤝",
      crossed_fingers: "🤞",
      hand_with_index_and_middle_fingers_crossed: "🤞",
      i_love_you_hand_sign: "🤟",
      face_with_cowboy_hat: "🤠",
      clown_face: "🤡",
      nauseated_face: "🤢",
      rolling_on_the_floor_laughing: "🤣",
      drooling_face: "🤤",
      lying_face: "🤥",
      face_palm: "🤦",
      sneezing_face: "🤧",
      face_with_raised_eyebrow: "🤨",
      face_with_one_eyebrow_raised: "🤨",
      grinning_face_with_star_eyes: "🤩",
      zany_face: "🤪",
      grinning_face_with_one_large_and_one_small_eye: "🤪",
      shushing_face: "🤫",
      face_with_finger_covering_closed_lips: "🤫",
      face_with_symbols_on_mouth: "🤬",
      serious_face_with_symbols_covering_mouth: "🤬",
      face_with_hand_over_mouth: "🤭",
      smiling_face_with_smiling_eyes_and_hand_covering_mouth: "🤭",
      face_vomiting: "🤮",
      face_with_open_mouth_vomiting: "🤮",
      exploding_head: "🤯",
      shocked_face_with_exploding_head: "🤯",
      pregnant_woman: "🤰",
      palms_up_together: "🤲",
      selfie: "🤳",
      prince: "🤴",
      man_in_tuxedo: "🤵",
      mrs_claus: "🤶",
      mother_christmas: "🤶",
      shrug: "🤷",
      person_doing_cartwheel: "🤸",
      juggling: "🤹",
      fencer: "🤺",
      wrestlers: "🤼",
      water_polo: "🤽",
      handball: "🤾",
      wilted_flower: "🥀",
      drum_with_drumsticks: "🥁",
      clinking_glasses: "🥂",
      tumbler_glass: "🥃",
      spoon: "🥄",
      goal_net: "🥅",
      first_place_medal: "🥇",
      second_place_medal: "🥈",
      third_place_medal: "🥉",
      boxing_glove: "🥊",
      martial_arts_uniform: "🥋",
      curling_stone: "🥌",
      croissant: "🥐",
      avocado: "🥑",
      cucumber: "🥒",
      bacon: "🥓",
      potato: "🥔",
      carrot: "🥕",
      baguette_bread: "🥖",
      green_salad: "🥗",
      shallow_pan_of_food: "🥘",
      stuffed_flatbread: "🥙",
      egg: "🥚",
      glass_of_milk: "🥛",
      peanuts: "🥜",
      kiwifruit: "🥝",
      pancakes: "🥞",
      dumpling: "🥟",
      fortune_cookie: "🥠",
      takeout_box: "🥡",
      chopsticks: "🥢",
      bowl_with_spoon: "🥣",
      cup_with_straw: "🥤",
      coconut: "🥥",
      broccoli: "🥦",
      pie: "🥧",
      pretzel: "🥨",
      cut_of_meat: "🥩",
      sandwich: "🥪",
      canned_food: "🥫",
      crab: "🦀",
      lion_face: "🦁",
      scorpion: "🦂",
      turkey: "🦃",
      unicorn_face: "🦄",
      eagle: "🦅",
      duck: "🦆",
      bat: "🦇",
      shark: "🦈",
      owl: "🦉",
      fox_face: "🦊",
      butterfly: "🦋",
      deer: "🦌",
      gorilla: "🦍",
      lizard: "🦎",
      rhinoceros: "🦏",
      shrimp: "🦐",
      squid: "🦑",
      giraffe_face: "🦒",
      zebra_face: "🦓",
      hedgehog: "🦔",
      sauropod: "🦕",
      cricket: "🦗",
      cheese_wedge: "🧀",
      face_with_monocle: "🧐",
      adult: "🧑",
      child: "🧒",
      older_adult: "🧓",
      bearded_person: "🧔",
      person_with_headscarf: "🧕",
      woman_in_steamy_room: "🧖‍♀️",
      man_in_steamy_room: "🧖‍♂️",
      person_in_steamy_room: "🧖‍♂️",
      woman_climbing: "🧗‍♀️",
      person_climbing: "🧗‍♀️",
      man_climbing: "🧗‍♂️",
      woman_in_lotus_position: "🧘‍♀️",
      person_in_lotus_position: "🧘‍♀️",
      man_in_lotus_position: "🧘‍♂️",
      female_mage: "🧙‍♀️",
      mage: "🧙‍♀️",
      male_mage: "🧙‍♂️",
      female_fairy: "🧚‍♀️",
      fairy: "🧚‍♀️",
      male_fairy: "🧚‍♂️",
      female_vampire: "🧛‍♀️",
      vampire: "🧛‍♀️",
      male_vampire: "🧛‍♂️",
      mermaid: "🧜‍♀️",
      merman: "🧜‍♂️",
      merperson: "🧜‍♂️",
      female_elf: "🧝‍♀️",
      male_elf: "🧝‍♂️",
      elf: "🧝‍♂️",
      female_genie: "🧞‍♀️",
      male_genie: "🧞‍♂️",
      genie: "🧞‍♂️",
      female_zombie: "🧟‍♀️",
      male_zombie: "🧟‍♂️",
      zombie: "🧟‍♂️",
      brain: "🧠",
      orange_heart: "🧡",
      billed_cap: "🧢",
      scarf: "🧣",
      gloves: "🧤",
      coat: "🧥",
      socks: "🧦",
      bangbang: "‼️",
      interrobang: "⁉️",
      tm: "™️",
      information_source: "ℹ️",
      left_right_arrow: "↔️",
      arrow_up_down: "↕️",
      arrow_upper_left: "↖️",
      arrow_upper_right: "↗️",
      arrow_lower_right: "↘️",
      arrow_lower_left: "↙️",
      leftwards_arrow_with_hook: "↩️",
      arrow_right_hook: "↪️",
      watch: "⌚",
      hourglass: "⌛",
      keyboard: "⌨️",
      eject: "⏏️",
      fast_forward: "⏩",
      rewind: "⏪",
      arrow_double_up: "⏫",
      arrow_double_down: "⏬",
      black_right_pointing_double_triangle_with_vertical_bar: "⏭️",
      black_left_pointing_double_triangle_with_vertical_bar: "⏮️",
      black_right_pointing_triangle_with_double_vertical_bar: "⏯️",
      alarm_clock: "⏰",
      stopwatch: "⏱️",
      timer_clock: "⏲️",
      hourglass_flowing_sand: "⏳",
      double_vertical_bar: "⏸️",
      black_square_for_stop: "⏹️",
      black_circle_for_record: "⏺️",
      m: "Ⓜ️",
      black_small_square: "▪️",
      white_small_square: "▫️",
      arrow_forward: "▶️",
      arrow_backward: "◀️",
      white_medium_square: "◻️",
      black_medium_square: "◼️",
      white_medium_small_square: "◽",
      black_medium_small_square: "◾",
      sunny: "☀️",
      cloud: "☁️",
      umbrella: "☂️",
      snowman: "☃️",
      comet: "☄️",
      phone: "☎️",
      telephone: "☎️",
      ballot_box_with_check: "☑️",
      shamrock: "☘️",
      point_up: "☝️",
      skull_and_crossbones: "☠️",
      radioactive_sign: "☢️",
      biohazard_sign: "☣️",
      orthodox_cross: "☦️",
      star_and_crescent: "☪️",
      peace_symbol: "☮️",
      yin_yang: "☯️",
      wheel_of_dharma: "☸️",
      white_frowning_face: "☹️",
      relaxed: "☺️",
      female_sign: "♀️",
      male_sign: "♂️",
      gemini: "♊",
      cancer: "♋",
      leo: "♌",
      virgo: "♍",
      libra: "♎",
      scorpius: "♏",
      spades: "♠️",
      clubs: "♣️",
      hearts: "♥️",
      diamonds: "♦️",
      hotsprings: "♨️",
      recycle: "♻️",
      wheelchair: "♿",
      hammer_and_pick: "⚒️",
      crossed_swords: "⚔️",
      medical_symbol: "⚕️",
      staff_of_aesculapius: "⚕️",
      scales: "⚖️",
      alembic: "⚗️",
      gear: "⚙️",
      atom_symbol: "⚛️",
      fleur_de_lis: "⚜️",
      warning: "⚠️",
      zap: "⚡",
      white_circle: "⚪",
      black_circle: "⚫",
      coffin: "⚰️",
      funeral_urn: "⚱️",
      soccer: "⚽",
      baseball: "⚾",
      snowman_without_snow: "⛄",
      partly_sunny: "⛅",
      thunder_cloud_and_rain: "⛈️",
      ophiuchus: "⛎",
      pick: "⛏️",
      helmet_with_white_cross: "⛑️",
      chains: "⛓️",
      no_entry: "⛔",
      shinto_shrine: "⛩️",
      church: "⛪",
      mountain: "⛰️",
      umbrella_on_ground: "⛱️",
      fountain: "⛲",
      golf: "⛳",
      ferry: "⛴️",
      boat: "⛵",
      sailboat: "⛵",
      skier: "⛷️",
      ice_skate: "⛸️",
      person_with_ball: "⛹️‍♂️",
      tent: "⛺",
      fuelpump: "⛽",
      scissors: "✂️",
      airplane: "✈️",
      email: "✉️",
      envelope: "✉️",
      fist: "✊",
      hand: "✋",
      raised_hand: "✋",
      v: "✌️",
      writing_hand: "✍️",
      pencil2: "✏️",
      black_nib: "✒️",
      heavy_check_mark: "✔️",
      heavy_multiplication_x: "✖️",
      latin_cross: "✝️",
      star_of_david: "✡️",
      eight_spoked_asterisk: "✳️",
      eight_pointed_black_star: "✴️",
      snowflake: "❄️",
      sparkle: "❇️",
      x: "❌",
      negative_squared_cross_mark: "❎",
      heavy_heart_exclamation_mark_ornament: "❣️",
      heart: "❤️",
      arrow_right: "➡️",
      curly_loop: "➰",
      loop: "➿",
      arrow_heading_up: "⤴️",
      arrow_heading_down: "⤵️",
      arrow_left: "⬅️",
      arrow_up: "⬆️",
      arrow_down: "⬇️",
      black_large_square: "⬛",
      white_large_square: "⬜",
      star: "⭐",
      o: "⭕",
      wavy_dash: "〰️",
      part_alternation_mark: "〽️",
      congratulations: "㊗️",
      secret: "㊙️",
      default: Rn,
    })
  ),
  In = /:([a-zA-Z0-9_\-\+]+):/g,
  Ln = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
function $n(e) {
  var n = e.indexOf(":");
  return n > -1
    ? n === e.length - 1
      ? $n((e = e.substring(0, n)))
      : $n((e = e.substr(n + 1)))
    : e;
}
function Un(e) {
  return "string" == typeof e && e.length > 0 ? ":" + e + ":" : e;
}
var Pn = Object.keys(Mn).reduce(function (e, n) {
    return (e[Mn[n]] = n), e;
  }, {}),
  qn = { emoji: Mn };
(qn._get = function (e) {
  return Mn.hasOwnProperty(e)
    ? Mn[e]
    : "string" == typeof (n = e) && ":" !== n[0]
    ? Un(n)
    : n;
  var n;
}),
  (qn.get = function (e) {
    return (e = $n(e)), qn._get(e);
  }),
  (qn.find = function (e) {
    return qn.findByName(e) || qn.findByCode(e);
  }),
  (qn.findByName = function (e) {
    var n = $n(e),
      t = Mn[n];
    return t ? { emoji: t, key: n } : void 0;
  }),
  (qn.findByCode = function (e) {
    var n = Pn[e];
    return n ? { emoji: Mn[n], key: n } : void 0;
  }),
  (qn.hasEmoji = function (e) {
    return qn.hasEmojiByName(e) || qn.hasEmojiByCode(e);
  }),
  (qn.hasEmojiByName = function (e) {
    var n = qn.findByName(e);
    return !!n && n.key === $n(e);
  }),
  (qn.hasEmojiByCode = function (e) {
    var n = qn.findByCode(e);
    return !!n && n.emoji === e;
  }),
  (qn.which = function (e, n) {
    var t = Pn[e];
    return n ? Un(t) : t;
  }),
  (qn.emojify = function (e, n, t) {
    return e
      ? e
          .split(In)
          .map(function (e, r) {
            if (r % 2 == 0) return e;
            var o = qn._get(e),
              a = o.indexOf(":") > -1;
            return a && "function" == typeof n
              ? n(e)
              : a || "function" != typeof t
              ? o
              : t(o, e);
          })
          .join("")
      : "";
  }),
  (qn.random = function () {
    var e = Object.keys(Mn),
      n = e[Math.floor(Math.random() * e.length)];
    return { key: n, emoji: qn._get(n) };
  }),
  (qn.search = function (e) {
    var n = Object.keys(Mn),
      t = $n(e),
      r = n.filter(function (e) {
        return 0 === e.toString().indexOf(t);
      });
    return r.map(function (e) {
      return { key: e, emoji: qn._get(e) };
    });
  }),
  (qn.unemojify = function (e) {
    return e
      ? jn(e)
          .map(function (e) {
            return qn.which(e, !0) || e;
          })
          .join("")
      : "";
  }),
  (qn.replace = function (e, n, t) {
    if (!e) return "";
    var r =
        "function" == typeof n
          ? n
          : function () {
              return n;
            },
      o = jn(e),
      a = o
        .map(function (e, n) {
          var a = qn.findByCode(e);
          return a && t && " " === o[n + 1] && (o[n + 1] = ""), a ? r(a) : e;
        })
        .join("");
    return t ? a.replace(Ln, "") : a;
  }),
  (qn.strip = function (e) {
    return qn.replace(e, "", !0);
  });
var Hn = qn;
he.registerLanguage("yaml", ve),
  he.registerLanguage("javascript", ye),
  he.registerLanguage("json", Ae);
const Zn = Ce;
Zn.setOptions({
  highlight: function (e, n) {
    return n && he.getLanguage(n)
      ? he.highlight(e, { language: n, ignoreIllegals: !0 }).value
      : he.highlightAuto(e).value;
  },
  breaks: !0,
  gfm: !0,
  tables: !0,
  langPrefix: "",
});
class Gn {
  static convert(e) {
    return Zn.parse(e);
  }
  static html(e, n) {
    (e = (e = Hn.emojify(e)).replace(
      /(https:\/\/github\.com\/.*.\/blob*.[^\s]+)/g,
      function (e) {
        return e.includes(".md")
          ? e
          : e
              .replace(
                "https://github.com/",
                "https://raw.githubusercontent.com/"
              )
              .replace("/blob/", "/");
      }
    )),
      n &&
        (e = e.replace(/!\[*.*\]\((?!.*:\/\/).*\/*.*\.\w*\)/g, function (e) {
          return e
            .replace("(/", "(")
            .replace(
              "(",
              `(https://raw.githubusercontent.com/${n.full_name}/${
                n.available_version || n.default_branch
              }/`
            )
            .replace("/blob/", "/");
        })),
      (e = e.replace(
        /[^(]https:\/\/github\.com\/\S*\/commit\/([0-9a-f]{40})/g,
        (e, n) => `[\`${n.substr(0, 7)}\`](${e})`
      )),
      n &&
        (e = e.replace(/(?:\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/g, (e) => {
          const t = e.replace(/^#/, `${n.full_name}#`),
            [r, o] = t.split("#");
          return `[${e}](https://github.com/${r}/issues/${o})`;
        }));
    const t = document.createElement("div");
    (t.className = "markdown-body"),
      (t.innerHTML = a
        .sanitize(Zn.parse(e), { css: !1 })
        .replace(/\<a href="http\w:\/\/.*.\">.*.\<\/a>\W/g, function (e) {
          return e
            .replace(/<a href=/gm, "<hacs-link url=")
            .replace(/<\/a>/gm, "</hacs-link>");
        }));
    const r = document.createElement("style");
    return (
      (r.innerText =
        '\n  /*\n\ngithub.com style (c) Vasily Polovnyov <vast@whiteants.net>\n\n*/\n\n  .hljs {\n    display: block;\n    overflow-x: auto;\n    padding: 0.5em;\n    color: #333;\n    background: #f8f8f8;\n  }\n\n  .hljs-comment,\n  .hljs-quote {\n    color: #998;\n    font-style: italic;\n  }\n\n  .hljs-keyword,\n  .hljs-selector-tag,\n  .hljs-subst {\n    color: #333;\n    font-weight: bold;\n  }\n\n  .hljs-number,\n  .hljs-literal,\n  .hljs-variable,\n  .hljs-template-variable,\n  .hljs-tag .hljs-attr {\n    color: #008080;\n  }\n\n  .hljs-string,\n  .hljs-doctag {\n    color: #d14;\n  }\n\n  .hljs-title,\n  .hljs-section,\n  .hljs-selector-id {\n    color: #900;\n    font-weight: bold;\n  }\n\n  .hljs-subst {\n    font-weight: normal;\n  }\n\n  .hljs-type,\n  .hljs-class .hljs-title {\n    color: #458;\n    font-weight: bold;\n  }\n\n  .hljs-tag,\n  .hljs-name,\n  .hljs-attribute {\n    color: #000080;\n    font-weight: normal;\n  }\n\n  .hljs-regexp,\n  .hljs-link {\n    color: #009926;\n  }\n\n  .hljs-symbol,\n  .hljs-bullet {\n    color: #990073;\n  }\n\n  .hljs-built_in,\n  .hljs-builtin-name {\n    color: #0086b3;\n  }\n\n  .hljs-meta {\n    color: #999;\n    font-weight: bold;\n  }\n\n  .hljs-deletion {\n    background: #fdd;\n  }\n\n  .hljs-addition {\n    background: #dfd;\n  }\n\n  .hljs-emphasis {\n    font-style: italic;\n  }\n\n  .hljs-strong {\n    font-weight: bold;\n  }\n\n  @font-face {\n    font-family: octicons-link;\n    src: url(data:font/woff;charset=utf-8;base64,d09GRgABAAAAAAZwABAAAAAACFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEU0lHAAAGaAAAAAgAAAAIAAAAAUdTVUIAAAZcAAAACgAAAAoAAQAAT1MvMgAAAyQAAABJAAAAYFYEU3RjbWFwAAADcAAAAEUAAACAAJThvmN2dCAAAATkAAAABAAAAAQAAAAAZnBnbQAAA7gAAACyAAABCUM+8IhnYXNwAAAGTAAAABAAAAAQABoAI2dseWYAAAFsAAABPAAAAZwcEq9taGVhZAAAAsgAAAA0AAAANgh4a91oaGVhAAADCAAAABoAAAAkCA8DRGhtdHgAAAL8AAAADAAAAAwGAACfbG9jYQAAAsAAAAAIAAAACABiATBtYXhwAAACqAAAABgAAAAgAA8ASm5hbWUAAAToAAABQgAAAlXu73sOcG9zdAAABiwAAAAeAAAAME3QpOBwcmVwAAAEbAAAAHYAAAB/aFGpk3jaTY6xa8JAGMW/O62BDi0tJLYQincXEypYIiGJjSgHniQ6umTsUEyLm5BV6NDBP8Tpts6F0v+k/0an2i+itHDw3v2+9+DBKTzsJNnWJNTgHEy4BgG3EMI9DCEDOGEXzDADU5hBKMIgNPZqoD3SilVaXZCER3/I7AtxEJLtzzuZfI+VVkprxTlXShWKb3TBecG11rwoNlmmn1P2WYcJczl32etSpKnziC7lQyWe1smVPy/Lt7Kc+0vWY/gAgIIEqAN9we0pwKXreiMasxvabDQMM4riO+qxM2ogwDGOZTXxwxDiycQIcoYFBLj5K3EIaSctAq2kTYiw+ymhce7vwM9jSqO8JyVd5RH9gyTt2+J/yUmYlIR0s04n6+7Vm1ozezUeLEaUjhaDSuXHwVRgvLJn1tQ7xiuVv/ocTRF42mNgZGBgYGbwZOBiAAFGJBIMAAizAFoAAABiAGIAznjaY2BkYGAA4in8zwXi+W2+MjCzMIDApSwvXzC97Z4Ig8N/BxYGZgcgl52BCSQKAA3jCV8CAABfAAAAAAQAAEB42mNgZGBg4f3vACQZQABIMjKgAmYAKEgBXgAAeNpjYGY6wTiBgZWBg2kmUxoDA4MPhGZMYzBi1AHygVLYQUCaawqDA4PChxhmh/8ODDEsvAwHgMKMIDnGL0x7gJQCAwMAJd4MFwAAAHjaY2BgYGaA4DAGRgYQkAHyGMF8NgYrIM3JIAGVYYDT+AEjAwuDFpBmA9KMDEwMCh9i/v8H8sH0/4dQc1iAmAkALaUKLgAAAHjaTY9LDsIgEIbtgqHUPpDi3gPoBVyRTmTddOmqTXThEXqrob2gQ1FjwpDvfwCBdmdXC5AVKFu3e5MfNFJ29KTQT48Ob9/lqYwOGZxeUelN2U2R6+cArgtCJpauW7UQBqnFkUsjAY/kOU1cP+DAgvxwn1chZDwUbd6CFimGXwzwF6tPbFIcjEl+vvmM/byA48e6tWrKArm4ZJlCbdsrxksL1AwWn/yBSJKpYbq8AXaaTb8AAHja28jAwOC00ZrBeQNDQOWO//sdBBgYGRiYWYAEELEwMTE4uzo5Zzo5b2BxdnFOcALxNjA6b2ByTswC8jYwg0VlNuoCTWAMqNzMzsoK1rEhNqByEyerg5PMJlYuVueETKcd/89uBpnpvIEVomeHLoMsAAe1Id4AAAAAAAB42oWQT07CQBTGv0JBhagk7HQzKxca2sJCE1hDt4QF+9JOS0nbaaYDCQfwCJ7Au3AHj+LO13FMmm6cl7785vven0kBjHCBhfpYuNa5Ph1c0e2Xu3jEvWG7UdPDLZ4N92nOm+EBXuAbHmIMSRMs+4aUEd4Nd3CHD8NdvOLTsA2GL8M9PODbcL+hD7C1xoaHeLJSEao0FEW14ckxC+TU8TxvsY6X0eLPmRhry2WVioLpkrbp84LLQPGI7c6sOiUzpWIWS5GzlSgUzzLBSikOPFTOXqly7rqx0Z1Q5BAIoZBSFihQYQOOBEdkCOgXTOHA07HAGjGWiIjaPZNW13/+lm6S9FT7rLHFJ6fQbkATOG1j2OFMucKJJsxIVfQORl+9Jyda6Sl1dUYhSCm1dyClfoeDve4qMYdLEbfqHf3O/AdDumsjAAB42mNgYoAAZQYjBmyAGYQZmdhL8zLdDEydARfoAqIAAAABAAMABwAKABMAB///AA8AAQAAAAAAAAAAAAAAAAABAAAAAA==)\n      format("woff");\n  }\n\n  .markdown-body .octicon {\n    display: inline-block;\n    fill: currentColor;\n    vertical-align: text-bottom;\n  }\n\n  .markdown-body .anchor {\n    float: left;\n    line-height: 1;\n    margin-left: -20px;\n    padding-right: 4px;\n  }\n\n  .markdown-body .anchor:focus {\n    outline: none;\n  }\n\n  .markdown-body h1 .octicon-link,\n  .markdown-body h2 .octicon-link,\n  .markdown-body h3 .octicon-link,\n  .markdown-body h4 .octicon-link,\n  .markdown-body h5 .octicon-link,\n  .markdown-body h6 .octicon-link {\n    color: #1b1f23;\n    vertical-align: middle;\n    visibility: hidden;\n  }\n\n  .markdown-body h1:hover .anchor,\n  .markdown-body h2:hover .anchor,\n  .markdown-body h3:hover .anchor,\n  .markdown-body h4:hover .anchor,\n  .markdown-body h5:hover .anchor,\n  .markdown-body h6:hover .anchor {\n    text-decoration: none;\n  }\n\n  .markdown-body h1:hover .anchor .octicon-link,\n  .markdown-body h2:hover .anchor .octicon-link,\n  .markdown-body h3:hover .anchor .octicon-link,\n  .markdown-body h4:hover .anchor .octicon-link,\n  .markdown-body h5:hover .anchor .octicon-link,\n  .markdown-body h6:hover .anchor .octicon-link {\n    visibility: visible;\n  }\n  .markdown-body {\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%;\n    line-height: 1.5;\n    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,\n      sans-serif, Apple Color Emoji, Segoe UI Emoji;\n    font-size: 16px;\n    line-height: 1.5;\n    word-wrap: break-word;\n  }\n\n  .markdown-body .pl-c {\n    color: #6a737d;\n  }\n\n  .markdown-body .pl-c1,\n  .markdown-body .pl-s .pl-v {\n    color: #005cc5;\n  }\n\n  .markdown-body .pl-e,\n  .markdown-body .pl-en {\n    color: #6f42c1;\n  }\n\n  .markdown-body .pl-s .pl-s1,\n  .markdown-body .pl-smi {\n    color: #24292e;\n  }\n\n  .markdown-body .pl-ent {\n    color: #22863a;\n  }\n\n  .markdown-body .pl-k {\n    color: #d73a49;\n  }\n\n  .markdown-body .pl-pds,\n  .markdown-body .pl-s,\n  .markdown-body .pl-s .pl-pse .pl-s1,\n  .markdown-body .pl-sr,\n  .markdown-body .pl-sr .pl-cce,\n  .markdown-body .pl-sr .pl-sra,\n  .markdown-body .pl-sr .pl-sre {\n    color: #032f62;\n  }\n\n  .markdown-body .pl-smw,\n  .markdown-body .pl-v {\n    color: #e36209;\n  }\n\n  .markdown-body .pl-bu {\n    color: #b31d28;\n  }\n\n  .markdown-body .pl-ii {\n    color: #fafbfc;\n    background-color: #b31d28;\n  }\n\n  .markdown-body .pl-c2 {\n    color: #fafbfc;\n    background-color: #d73a49;\n  }\n\n  .markdown-body .pl-c2:before {\n    content: "^M";\n  }\n\n  .markdown-body .pl-sr .pl-cce {\n    font-weight: 700;\n    color: #22863a;\n  }\n\n  .markdown-body .pl-ml {\n    color: #735c0f;\n  }\n\n  .markdown-body .pl-mh,\n  .markdown-body .pl-mh .pl-en,\n  .markdown-body .pl-ms {\n    font-weight: 700;\n    color: #005cc5;\n  }\n\n  .markdown-body .pl-mi {\n    font-style: italic;\n    color: #24292e;\n  }\n\n  .markdown-body .pl-mb {\n    font-weight: 700;\n    color: #24292e;\n  }\n\n  .markdown-body .pl-md {\n    color: #b31d28;\n    background-color: #ffeef0;\n  }\n\n  .markdown-body .pl-mi1 {\n    color: #22863a;\n    background-color: #f0fff4;\n  }\n\n  .markdown-body .pl-mc {\n    color: #e36209;\n    background-color: #ffebda;\n  }\n\n  .markdown-body .pl-mi2 {\n    color: #f6f8fa;\n    background-color: #005cc5;\n  }\n\n  .markdown-body .pl-mdr {\n    font-weight: 700;\n    color: #6f42c1;\n  }\n\n  .markdown-body .pl-ba {\n    color: #586069;\n  }\n\n  .markdown-body .pl-sg {\n    color: #959da5;\n  }\n\n  .markdown-body .pl-corl {\n    text-decoration: underline;\n    color: #032f62;\n  }\n\n  .markdown-body details {\n    display: block;\n  }\n\n  .markdown-body summary {\n    display: list-item;\n  }\n\n  .markdown-body a {\n    background-color: initial;\n  }\n\n  .markdown-body a:active,\n  .markdown-body a:hover {\n    outline-width: 0;\n  }\n\n  .markdown-body strong {\n    font-weight: inherit;\n    font-weight: bolder;\n  }\n\n  .markdown-body h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n\n  .markdown-body img {\n    border-style: none;\n  }\n\n  .markdown-body code,\n  .markdown-body kbd,\n  .markdown-body pre {\n    font-family: monospace, monospace;\n    font-size: 1em;\n    background-color: var(--hcv-color-markdown-background);\n  }\n\n  .markdown-body hr {\n    box-sizing: initial;\n    height: 0;\n    overflow: visible;\n  }\n\n  .markdown-body input {\n    font: inherit;\n    margin: 0;\n  }\n\n  .markdown-body input {\n    overflow: visible;\n  }\n\n  .markdown-body [type="checkbox"] {\n    box-sizing: border-box;\n    padding: 0;\n  }\n\n  .markdown-body * {\n    box-sizing: border-box;\n  }\n\n  .markdown-body input {\n    font-family: inherit;\n    font-size: inherit;\n    line-height: inherit;\n  }\n\n  .markdown-body a {\n    color: var(--link-text-color, var(--accent-color));\n    font-weight: 600;\n    text-decoration: none;\n  }\n\n  .markdown-body a:hover {\n    text-decoration: underline;\n  }\n\n  .markdown-body strong {\n    font-weight: 600;\n  }\n\n  .markdown-body hr {\n    height: 0;\n    margin: 15px 0;\n    overflow: hidden;\n    background: transparent;\n    border: 0;\n    border-bottom: 1px solid #dfe2e5;\n  }\n\n  .markdown-body hr:after,\n  .markdown-body hr:before {\n    display: table;\n    content: "";\n  }\n\n  .markdown-body hr:after {\n    clear: both;\n  }\n\n  .markdown-body table {\n    border-spacing: 0;\n    border-collapse: collapse;\n  }\n\n  .markdown-body td,\n  .markdown-body th {\n    padding: 0;\n  }\n\n  .markdown-body details summary {\n    cursor: pointer;\n  }\n\n  .markdown-body kbd {\n    display: inline-block;\n    padding: 3px 5px;\n    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    line-height: 10px;\n    color: #444d56;\n    vertical-align: middle;\n    background-color: var(--hcv-color-markdown-background);\n    border: 1px solid #d1d5da;\n    border-radius: 3px;\n    box-shadow: inset 0 -1px 0 #d1d5da;\n  }\n\n  .markdown-body h1,\n  .markdown-body h2,\n  .markdown-body h3,\n  .markdown-body h4,\n  .markdown-body h5,\n  .markdown-body h6 {\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .markdown-body h1 {\n    font-size: 32px;\n  }\n\n  .markdown-body h1,\n  .markdown-body h2 {\n    font-weight: 600;\n  }\n\n  .markdown-body h2 {\n    font-size: 24px;\n  }\n\n  .markdown-body h3 {\n    font-size: 20px;\n  }\n\n  .markdown-body h3,\n  .markdown-body h4 {\n    font-weight: 600;\n  }\n\n  .markdown-body h4 {\n    font-size: 16px;\n  }\n\n  .markdown-body h5 {\n    font-size: 14px;\n  }\n\n  .markdown-body h5,\n  .markdown-body h6 {\n    font-weight: 600;\n  }\n\n  .markdown-body h6 {\n    font-size: 12px;\n  }\n\n  .markdown-body p {\n    margin-top: 0;\n    margin-bottom: 10px;\n  }\n\n  .markdown-body blockquote {\n    margin: 0;\n  }\n\n  .markdown-body ol,\n  .markdown-body ul {\n    padding-left: 0;\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .markdown-body ol ol,\n  .markdown-body ul ol {\n    list-style-type: lower-roman;\n  }\n\n  .markdown-body ol ol ol,\n  .markdown-body ol ul ol,\n  .markdown-body ul ol ol,\n  .markdown-body ul ul ol {\n    list-style-type: lower-alpha;\n  }\n\n  .markdown-body dd {\n    margin-left: 0;\n  }\n\n  .markdown-body code,\n  .markdown-body pre {\n    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    font-size: 12px;\n  }\n\n  .markdown-body pre {\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .markdown-body input::-webkit-inner-spin-button,\n  .markdown-body input::-webkit-outer-spin-button {\n    margin: 0;\n    -webkit-appearance: none;\n    appearance: none;\n  }\n\n  .markdown-body .border {\n    border: 1px solid #e1e4e8 !important;\n  }\n\n  .markdown-body .border-0 {\n    border: 0 !important;\n  }\n\n  .markdown-body .border-bottom {\n    border-bottom: 1px solid #e1e4e8 !important;\n  }\n\n  .markdown-body .rounded-1 {\n    border-radius: 3px !important;\n  }\n\n  .markdown-body .bg-white {\n    background-color: #fff !important;\n  }\n\n  .markdown-body .bg-gray-light {\n    background-color: #fafbfc !important;\n  }\n\n  .markdown-body .text-gray-light {\n    color: #6a737d !important;\n  }\n\n  .markdown-body .mb-0 {\n    margin-bottom: 0 !important;\n  }\n\n  .markdown-body .my-2 {\n    margin-top: 8px !important;\n    margin-bottom: 8px !important;\n  }\n\n  .markdown-body .pl-0 {\n    padding-left: 0 !important;\n  }\n\n  .markdown-body .py-0 {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n\n  .markdown-body .pl-1 {\n    padding-left: 4px !important;\n  }\n\n  .markdown-body .pl-2 {\n    padding-left: 8px !important;\n  }\n\n  .markdown-body .py-2 {\n    padding-top: 8px !important;\n    padding-bottom: 8px !important;\n  }\n\n  .markdown-body .pl-3,\n  .markdown-body .px-3 {\n    padding-left: 16px !important;\n  }\n\n  .markdown-body .px-3 {\n    padding-right: 16px !important;\n  }\n\n  .markdown-body .pl-4 {\n    padding-left: 24px !important;\n  }\n\n  .markdown-body .pl-5 {\n    padding-left: 32px !important;\n  }\n\n  .markdown-body .pl-6 {\n    padding-left: 40px !important;\n  }\n\n  .markdown-body .f6 {\n    font-size: 12px !important;\n  }\n\n  .markdown-body .lh-condensed {\n    line-height: 1.25 !important;\n  }\n\n  .markdown-body .text-bold {\n    font-weight: 600 !important;\n  }\n\n  .markdown-body .pl-7 {\n    padding-left: 48px !important;\n  }\n\n  .markdown-body .pl-8 {\n    padding-left: 64px !important;\n  }\n\n  .markdown-body .pl-9 {\n    padding-left: 80px !important;\n  }\n\n  .markdown-body .pl-10 {\n    padding-left: 96px !important;\n  }\n\n  .markdown-body .pl-11 {\n    padding-left: 112px !important;\n  }\n\n  .markdown-body .pl-12 {\n    padding-left: 128px !important;\n  }\n\n  .markdown-body hr {\n    border-bottom-color: #eee;\n  }\n\n  .markdown-body kbd {\n    display: inline-block;\n    padding: 3px 5px;\n    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    line-height: 10px;\n    color: #444d56;\n    vertical-align: middle;\n    background-color: var(--hcv-color-markdown-background);\n    border: 1px solid #d1d5da;\n    border-radius: 3px;\n    box-shadow: inset 0 -1px 0 #d1d5da;\n  }\n\n  .markdown-body:after,\n  .markdown-body:before {\n    display: table;\n    content: "";\n  }\n\n  .markdown-body:after {\n    clear: both;\n  }\n\n  .markdown-body > :first-child {\n    margin-top: 0 !important;\n  }\n\n  .markdown-body > :last-child {\n    margin-bottom: 0 !important;\n  }\n\n  .markdown-body a:not([href]) {\n    color: inherit;\n    text-decoration: none;\n  }\n\n  .markdown-body blockquote,\n  .markdown-body details,\n  .markdown-body dl,\n  .markdown-body ol,\n  .markdown-body p,\n  .markdown-body pre,\n  .markdown-body table,\n  .markdown-body ul {\n    margin-top: 0;\n    margin-bottom: 16px;\n  }\n\n  .markdown-body hr {\n    height: 0.25em;\n    padding: 0;\n    margin: 24px 0;\n    background-color: #e1e4e8;\n    border: 0;\n  }\n\n  .markdown-body blockquote {\n    padding: 0 1em;\n    color: #6a737d;\n    border-left: 0.25em solid #dfe2e5;\n  }\n\n  .markdown-body blockquote > :first-child {\n    margin-top: 0;\n  }\n\n  .markdown-body blockquote > :last-child {\n    margin-bottom: 0;\n  }\n\n  .markdown-body h1,\n  .markdown-body h2,\n  .markdown-body h3,\n  .markdown-body h4,\n  .markdown-body h5,\n  .markdown-body h6 {\n    margin-top: 24px;\n    margin-bottom: 16px;\n    font-weight: 600;\n    line-height: 1.25;\n  }\n\n  .markdown-body h1 {\n    font-size: 2em;\n  }\n\n  .markdown-body h1,\n  .markdown-body h2 {\n    padding-bottom: 0.3em;\n    border-bottom: 1px solid #eaecef;\n  }\n\n  .markdown-body h2 {\n    font-size: 1.5em;\n  }\n\n  .markdown-body h3 {\n    font-size: 1.25em;\n  }\n\n  .markdown-body h4 {\n    font-size: 1em;\n  }\n\n  .markdown-body h5 {\n    font-size: 0.875em;\n  }\n\n  .markdown-body h6 {\n    font-size: 0.85em;\n    color: #6a737d;\n  }\n\n  .markdown-body ol,\n  .markdown-body ul {\n    padding-left: 2em;\n  }\n\n  .markdown-body ol ol,\n  .markdown-body ol ul,\n  .markdown-body ul ol,\n  .markdown-body ul ul {\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n\n  .markdown-body li {\n    word-wrap: break-all;\n  }\n\n  .markdown-body li > p {\n    margin-top: 16px;\n  }\n\n  .markdown-body li + li {\n    margin-top: 0.25em;\n  }\n\n  .markdown-body dl {\n    padding: 0;\n  }\n\n  .markdown-body dl dt {\n    padding: 0;\n    margin-top: 16px;\n    font-size: 1em;\n    font-style: italic;\n    font-weight: 600;\n  }\n\n  .markdown-body dl dd {\n    padding: 0 16px;\n    margin-bottom: 16px;\n  }\n\n  .markdown-body table {\n    display: block;\n    width: 100%;\n    overflow: auto;\n  }\n\n  .markdown-body table th {\n    font-weight: 600;\n  }\n\n  .markdown-body table td,\n  .markdown-body table th {\n    padding: 6px 13px;\n    border: 1px solid #dfe2e5;\n  }\n\n  .markdown-body table th {\n    background-color: var(--primary-background-color, #fff);\n  }\n\n  .markdown-body table tr {\n    background-color: hsla(var(--primary-background-color, #fff), 0.1);\n    border-top: 1px solid #c6cbd1;\n  }\n\n  .markdown-body table tr:nth-child(2n) {\n    background-color: var(--primary-background-color, #fff);\n  }\n\n  .markdown-body img {\n    max-width: 100%;\n    box-sizing: initial;\n    border-radius: var(--ha-card-border-radius);\n  }\n\n  .markdown-body img[align="right"] {\n    padding-left: 20px;\n  }\n\n  .markdown-body img[align="left"] {\n    padding-right: 20px;\n  }\n\n  .markdown-body code {\n    padding: 0.2em 0.4em;\n    margin: 0;\n    font-size: 85%;\n    background-color: var(--hcv-color-markdown-background);\n    border-radius: 3px;\n  }\n\n  .markdown-body pre {\n    word-wrap: normal;\n  }\n\n  .markdown-body pre > code {\n    padding: 0;\n    margin: 0;\n    font-size: 100%;\n    word-break: normal;\n    white-space: pre;\n    background: transparent;\n    border: 0;\n  }\n\n  .markdown-body .highlight {\n    margin-bottom: 16px;\n  }\n\n  .markdown-body .highlight pre {\n    margin-bottom: 0;\n    word-break: normal;\n  }\n\n  .markdown-body .highlight pre,\n  .markdown-body pre {\n    padding: 16px;\n    overflow: auto;\n    font-size: 85%;\n    line-height: 1.45;\n    background-color: var(--hcv-color-markdown-background);\n    border-radius: var(--ha-card-border-radius, 3px);\n  }\n\n  .markdown-body pre code {\n    display: inline;\n    max-width: auto;\n    padding: 0;\n    margin: 0;\n    overflow: visible;\n    line-height: inherit;\n    word-wrap: normal;\n    background-color: initial;\n    border: 0;\n  }\n\n  .markdown-body .commit-tease-sha {\n    display: inline-block;\n    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    font-size: 90%;\n    color: #444d56;\n  }\n\n  .markdown-body .full-commit .btn-outline:not(:disabled):hover {\n    color: #005cc5;\n    border-color: #005cc5;\n  }\n\n  .markdown-body .blob-wrapper {\n    overflow-x: auto;\n    overflow-y: hidden;\n  }\n\n  .markdown-body .blob-wrapper-embedded {\n    max-height: 240px;\n    overflow-y: auto;\n  }\n\n  .markdown-body .blob-num {\n    width: 1%;\n    min-width: 50px;\n    padding-right: 10px;\n    padding-left: 10px;\n    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    font-size: 12px;\n    line-height: 20px;\n    color: rgba(27, 31, 35, 0.3);\n    text-align: right;\n    white-space: nowrap;\n    vertical-align: top;\n    cursor: pointer;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n  }\n\n  .markdown-body .blob-num:hover {\n    color: rgba(27, 31, 35, 0.6);\n  }\n\n  .markdown-body .blob-num:before {\n    content: attr(data-line-number);\n  }\n\n  .markdown-body .blob-code {\n    position: relative;\n    padding-right: 10px;\n    padding-left: 10px;\n    line-height: 20px;\n    vertical-align: top;\n  }\n\n  .markdown-body .blob-code-inner {\n    overflow: visible;\n    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n    font-size: 12px;\n    color: #24292e;\n    word-wrap: normal;\n    white-space: pre;\n  }\n\n  .markdown-body .pl-token.active,\n  .markdown-body .pl-token:hover {\n    cursor: pointer;\n    background: #ffea7f;\n  }\n\n  .markdown-body :checked + .radio-label {\n    position: relative;\n    z-index: 1;\n    border-color: var(--link-text-color, var(--accent-color));\n  }\n\n  .markdown-body\n    .select-menu-item\n    input[type="radio"]:not(:checked)\n    + .octicon-check,\n  .markdown-body\n    .select-menu-item\n    input[type="radio"]:not(:checked)\n    + .octicon-circle-slash {\n    visibility: hidden;\n  }\n\n  .markdown-body .pl-7 {\n    padding-left: 48px !important;\n  }\n\n  .markdown-body .pl-8 {\n    padding-left: 64px !important;\n  }\n\n  .markdown-body .pl-9 {\n    padding-left: 80px !important;\n  }\n\n  .markdown-body .pl-10 {\n    padding-left: 96px !important;\n  }\n\n  .markdown-body .pl-11 {\n    padding-left: 112px !important;\n  }\n\n  .markdown-body .pl-12 {\n    padding-left: 128px !important;\n  }\n\n  .markdown-body .tab-size[data-tab-size="1"] {\n    -moz-tab-size: 1;\n    tab-size: 1;\n  }\n\n  .markdown-body .tab-size[data-tab-size="2"] {\n    -moz-tab-size: 2;\n    tab-size: 2;\n  }\n\n  .markdown-body .tab-size[data-tab-size="3"] {\n    -moz-tab-size: 3;\n    tab-size: 3;\n  }\n\n  .markdown-body .tab-size[data-tab-size="4"] {\n    -moz-tab-size: 4;\n    tab-size: 4;\n  }\n\n  .markdown-body .tab-size[data-tab-size="5"] {\n    -moz-tab-size: 5;\n    tab-size: 5;\n  }\n\n  .markdown-body .tab-size[data-tab-size="6"] {\n    -moz-tab-size: 6;\n    tab-size: 6;\n  }\n\n  .markdown-body .tab-size[data-tab-size="7"] {\n    -moz-tab-size: 7;\n    tab-size: 7;\n  }\n\n  .markdown-body .tab-size[data-tab-size="8"] {\n    -moz-tab-size: 8;\n    tab-size: 8;\n  }\n\n  .markdown-body .tab-size[data-tab-size="9"] {\n    -moz-tab-size: 9;\n    tab-size: 9;\n  }\n\n  .markdown-body .tab-size[data-tab-size="10"] {\n    -moz-tab-size: 10;\n    tab-size: 10;\n  }\n\n  .markdown-body .tab-size[data-tab-size="11"] {\n    -moz-tab-size: 11;\n    tab-size: 11;\n  }\n\n  .markdown-body .tab-size[data-tab-size="12"] {\n    -moz-tab-size: 12;\n    tab-size: 12;\n  }\n\n  .markdown-body .task-list-item {\n    list-style-type: none;\n  }\n\n  .markdown-body .task-list-item + .task-list-item {\n    margin-top: 3px;\n  }\n\n  .markdown-body .task-list-item input {\n    margin: 0 0.2em 0.25em -1.6em;\n    vertical-align: middle;\n  }\n'),
      o`${r}${t} `
    );
  }
}
export { Gn as m };
