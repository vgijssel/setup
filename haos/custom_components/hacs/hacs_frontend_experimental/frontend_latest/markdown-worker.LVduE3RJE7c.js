/*! For license information please see markdown-worker.LVduE3RJE7c.js.LICENSE.txt */
var e = {
    91100: (e, t, n) => {
      var r = n(79668),
        u = n(48544);
      n(27301);
      function i(e) {
        return null == e;
      }
      function s(e) {
        ((e = (function (e) {
          var t = {};
          for (var n in e) t[n] = e[n];
          return t;
        })(e || {})).whiteList = e.whiteList || r.whiteList),
          (e.onAttr = e.onAttr || r.onAttr),
          (e.onIgnoreAttr = e.onIgnoreAttr || r.onIgnoreAttr),
          (e.safeAttrValue = e.safeAttrValue || r.safeAttrValue),
          (this.options = e);
      }
      (s.prototype.process = function (e) {
        if (!(e = (e = e || "").toString())) return "";
        var t = this.options,
          n = t.whiteList,
          r = t.onAttr,
          s = t.onIgnoreAttr,
          o = t.safeAttrValue;
        return u(e, function (e, t, u, a, l) {
          var c = n[u],
            p = !1;
          if (
            (!0 === c
              ? (p = c)
              : "function" == typeof c
              ? (p = c(a))
              : c instanceof RegExp && (p = c.test(a)),
            !0 !== p && (p = !1),
            (a = o(u, a)))
          ) {
            var h,
              g = { position: t, sourcePosition: e, source: l, isWhite: p };
            return p
              ? i((h = r(u, a, g)))
                ? u + ":" + a
                : h
              : i((h = s(u, a, g)))
              ? void 0
              : h;
          }
        });
      }),
        (e.exports = s);
    },
    79668: (e, t) => {
      function n() {
        var e = {
          "align-content": !1,
          "align-items": !1,
          "align-self": !1,
          "alignment-adjust": !1,
          "alignment-baseline": !1,
          all: !1,
          "anchor-point": !1,
          animation: !1,
          "animation-delay": !1,
          "animation-direction": !1,
          "animation-duration": !1,
          "animation-fill-mode": !1,
          "animation-iteration-count": !1,
          "animation-name": !1,
          "animation-play-state": !1,
          "animation-timing-function": !1,
          azimuth: !1,
          "backface-visibility": !1,
          background: !0,
          "background-attachment": !0,
          "background-clip": !0,
          "background-color": !0,
          "background-image": !0,
          "background-origin": !0,
          "background-position": !0,
          "background-repeat": !0,
          "background-size": !0,
          "baseline-shift": !1,
          binding: !1,
          bleed: !1,
          "bookmark-label": !1,
          "bookmark-level": !1,
          "bookmark-state": !1,
          border: !0,
          "border-bottom": !0,
          "border-bottom-color": !0,
          "border-bottom-left-radius": !0,
          "border-bottom-right-radius": !0,
          "border-bottom-style": !0,
          "border-bottom-width": !0,
          "border-collapse": !0,
          "border-color": !0,
          "border-image": !0,
          "border-image-outset": !0,
          "border-image-repeat": !0,
          "border-image-slice": !0,
          "border-image-source": !0,
          "border-image-width": !0,
          "border-left": !0,
          "border-left-color": !0,
          "border-left-style": !0,
          "border-left-width": !0,
          "border-radius": !0,
          "border-right": !0,
          "border-right-color": !0,
          "border-right-style": !0,
          "border-right-width": !0,
          "border-spacing": !0,
          "border-style": !0,
          "border-top": !0,
          "border-top-color": !0,
          "border-top-left-radius": !0,
          "border-top-right-radius": !0,
          "border-top-style": !0,
          "border-top-width": !0,
          "border-width": !0,
          bottom: !1,
          "box-decoration-break": !0,
          "box-shadow": !0,
          "box-sizing": !0,
          "box-snap": !0,
          "box-suppress": !0,
          "break-after": !0,
          "break-before": !0,
          "break-inside": !0,
          "caption-side": !1,
          chains: !1,
          clear: !0,
          clip: !1,
          "clip-path": !1,
          "clip-rule": !1,
          color: !0,
          "color-interpolation-filters": !0,
          "column-count": !1,
          "column-fill": !1,
          "column-gap": !1,
          "column-rule": !1,
          "column-rule-color": !1,
          "column-rule-style": !1,
          "column-rule-width": !1,
          "column-span": !1,
          "column-width": !1,
          columns: !1,
          contain: !1,
          content: !1,
          "counter-increment": !1,
          "counter-reset": !1,
          "counter-set": !1,
          crop: !1,
          cue: !1,
          "cue-after": !1,
          "cue-before": !1,
          cursor: !1,
          direction: !1,
          display: !0,
          "display-inside": !0,
          "display-list": !0,
          "display-outside": !0,
          "dominant-baseline": !1,
          elevation: !1,
          "empty-cells": !1,
          filter: !1,
          flex: !1,
          "flex-basis": !1,
          "flex-direction": !1,
          "flex-flow": !1,
          "flex-grow": !1,
          "flex-shrink": !1,
          "flex-wrap": !1,
          float: !1,
          "float-offset": !1,
          "flood-color": !1,
          "flood-opacity": !1,
          "flow-from": !1,
          "flow-into": !1,
          font: !0,
          "font-family": !0,
          "font-feature-settings": !0,
          "font-kerning": !0,
          "font-language-override": !0,
          "font-size": !0,
          "font-size-adjust": !0,
          "font-stretch": !0,
          "font-style": !0,
          "font-synthesis": !0,
          "font-variant": !0,
          "font-variant-alternates": !0,
          "font-variant-caps": !0,
          "font-variant-east-asian": !0,
          "font-variant-ligatures": !0,
          "font-variant-numeric": !0,
          "font-variant-position": !0,
          "font-weight": !0,
          grid: !1,
          "grid-area": !1,
          "grid-auto-columns": !1,
          "grid-auto-flow": !1,
          "grid-auto-rows": !1,
          "grid-column": !1,
          "grid-column-end": !1,
          "grid-column-start": !1,
          "grid-row": !1,
          "grid-row-end": !1,
          "grid-row-start": !1,
          "grid-template": !1,
          "grid-template-areas": !1,
          "grid-template-columns": !1,
          "grid-template-rows": !1,
          "hanging-punctuation": !1,
          height: !0,
          hyphens: !1,
          icon: !1,
          "image-orientation": !1,
          "image-resolution": !1,
          "ime-mode": !1,
          "initial-letters": !1,
          "inline-box-align": !1,
          "justify-content": !1,
          "justify-items": !1,
          "justify-self": !1,
          left: !1,
          "letter-spacing": !0,
          "lighting-color": !0,
          "line-box-contain": !1,
          "line-break": !1,
          "line-grid": !1,
          "line-height": !1,
          "line-snap": !1,
          "line-stacking": !1,
          "line-stacking-ruby": !1,
          "line-stacking-shift": !1,
          "line-stacking-strategy": !1,
          "list-style": !0,
          "list-style-image": !0,
          "list-style-position": !0,
          "list-style-type": !0,
          margin: !0,
          "margin-bottom": !0,
          "margin-left": !0,
          "margin-right": !0,
          "margin-top": !0,
          "marker-offset": !1,
          "marker-side": !1,
          marks: !1,
          mask: !1,
          "mask-box": !1,
          "mask-box-outset": !1,
          "mask-box-repeat": !1,
          "mask-box-slice": !1,
          "mask-box-source": !1,
          "mask-box-width": !1,
          "mask-clip": !1,
          "mask-image": !1,
          "mask-origin": !1,
          "mask-position": !1,
          "mask-repeat": !1,
          "mask-size": !1,
          "mask-source-type": !1,
          "mask-type": !1,
          "max-height": !0,
          "max-lines": !1,
          "max-width": !0,
          "min-height": !0,
          "min-width": !0,
          "move-to": !1,
          "nav-down": !1,
          "nav-index": !1,
          "nav-left": !1,
          "nav-right": !1,
          "nav-up": !1,
          "object-fit": !1,
          "object-position": !1,
          opacity: !1,
          order: !1,
          orphans: !1,
          outline: !1,
          "outline-color": !1,
          "outline-offset": !1,
          "outline-style": !1,
          "outline-width": !1,
          overflow: !1,
          "overflow-wrap": !1,
          "overflow-x": !1,
          "overflow-y": !1,
          padding: !0,
          "padding-bottom": !0,
          "padding-left": !0,
          "padding-right": !0,
          "padding-top": !0,
          page: !1,
          "page-break-after": !1,
          "page-break-before": !1,
          "page-break-inside": !1,
          "page-policy": !1,
          pause: !1,
          "pause-after": !1,
          "pause-before": !1,
          perspective: !1,
          "perspective-origin": !1,
          pitch: !1,
          "pitch-range": !1,
          "play-during": !1,
          position: !1,
          "presentation-level": !1,
          quotes: !1,
          "region-fragment": !1,
          resize: !1,
          rest: !1,
          "rest-after": !1,
          "rest-before": !1,
          richness: !1,
          right: !1,
          rotation: !1,
          "rotation-point": !1,
          "ruby-align": !1,
          "ruby-merge": !1,
          "ruby-position": !1,
          "shape-image-threshold": !1,
          "shape-outside": !1,
          "shape-margin": !1,
          size: !1,
          speak: !1,
          "speak-as": !1,
          "speak-header": !1,
          "speak-numeral": !1,
          "speak-punctuation": !1,
          "speech-rate": !1,
          stress: !1,
          "string-set": !1,
          "tab-size": !1,
          "table-layout": !1,
          "text-align": !0,
          "text-align-last": !0,
          "text-combine-upright": !0,
          "text-decoration": !0,
          "text-decoration-color": !0,
          "text-decoration-line": !0,
          "text-decoration-skip": !0,
          "text-decoration-style": !0,
          "text-emphasis": !0,
          "text-emphasis-color": !0,
          "text-emphasis-position": !0,
          "text-emphasis-style": !0,
          "text-height": !0,
          "text-indent": !0,
          "text-justify": !0,
          "text-orientation": !0,
          "text-overflow": !0,
          "text-shadow": !0,
          "text-space-collapse": !0,
          "text-transform": !0,
          "text-underline-position": !0,
          "text-wrap": !0,
          top: !1,
          transform: !1,
          "transform-origin": !1,
          "transform-style": !1,
          transition: !1,
          "transition-delay": !1,
          "transition-duration": !1,
          "transition-property": !1,
          "transition-timing-function": !1,
          "unicode-bidi": !1,
          "vertical-align": !1,
          visibility: !1,
          "voice-balance": !1,
          "voice-duration": !1,
          "voice-family": !1,
          "voice-pitch": !1,
          "voice-range": !1,
          "voice-rate": !1,
          "voice-stress": !1,
          "voice-volume": !1,
          volume: !1,
          "white-space": !1,
          widows: !1,
          width: !0,
          "will-change": !1,
          "word-break": !0,
          "word-spacing": !0,
          "word-wrap": !0,
          "wrap-flow": !1,
          "wrap-through": !1,
          "writing-mode": !1,
          "z-index": !1,
        };
        return e;
      }
      var r = /javascript\s*\:/gim;
      (t.whiteList = n()),
        (t.getDefaultWhiteList = n),
        (t.onAttr = function (e, t, n) {}),
        (t.onIgnoreAttr = function (e, t, n) {}),
        (t.safeAttrValue = function (e, t) {
          return r.test(t) ? "" : t;
        });
    },
    8300: (e, t, n) => {
      var r = n(79668),
        u = n(91100);
      for (var i in (((t = e.exports =
        function (e, t) {
          return new u(t).process(e);
        }).FilterCSS = u),
      r))
        t[i] = r[i];
      "undefined" != typeof window && (window.filterCSS = e.exports);
    },
    48544: (e, t, n) => {
      var r = n(27301);
      e.exports = function (e, t) {
        ";" !== (e = r.trimRight(e))[e.length - 1] && (e += ";");
        var n = e.length,
          u = !1,
          i = 0,
          s = 0,
          o = "";
        function a() {
          if (!u) {
            var n = r.trim(e.slice(i, s)),
              a = n.indexOf(":");
            if (-1 !== a) {
              var l = r.trim(n.slice(0, a)),
                c = r.trim(n.slice(a + 1));
              if (l) {
                var p = t(i, o.length, l, c, n);
                p && (o += p + "; ");
              }
            }
          }
          i = s + 1;
        }
        for (; s < n; s++) {
          var l = e[s];
          if ("/" === l && "*" === e[s + 1]) {
            var c = e.indexOf("*/", s + 2);
            if (-1 === c) break;
            (i = (s = c + 1) + 1), (u = !1);
          } else
            "(" === l
              ? (u = !0)
              : ")" === l
              ? (u = !1)
              : ";" === l
              ? u || a()
              : "\n" === l && a();
        }
        return r.trim(o);
      };
    },
    27301: (e) => {
      e.exports = {
        indexOf: function (e, t) {
          var n, r;
          if (Array.prototype.indexOf) return e.indexOf(t);
          for (n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
          return -1;
        },
        forEach: function (e, t, n) {
          var r, u;
          if (Array.prototype.forEach) return e.forEach(t, n);
          for (r = 0, u = e.length; r < u; r++) t.call(n, e[r], r, e);
        },
        trim: function (e) {
          return String.prototype.trim
            ? e.trim()
            : e.replace(/(^\s*)|(\s*$)/g, "");
        },
        trimRight: function (e) {
          return String.prototype.trimRight
            ? e.trimRight()
            : e.replace(/(\s*$)/g, "");
        },
      };
    },
    60841: (e, t, n) => {
      var r = n(8300).FilterCSS,
        u = n(8300).getDefaultWhiteList,
        i = n(58511);
      function s() {
        return {
          a: ["target", "href", "title"],
          abbr: ["title"],
          address: [],
          area: ["shape", "coords", "href", "alt"],
          article: [],
          aside: [],
          audio: [
            "autoplay",
            "controls",
            "crossorigin",
            "loop",
            "muted",
            "preload",
            "src",
          ],
          b: [],
          bdi: ["dir"],
          bdo: ["dir"],
          big: [],
          blockquote: ["cite"],
          br: [],
          caption: [],
          center: [],
          cite: [],
          code: [],
          col: ["align", "valign", "span", "width"],
          colgroup: ["align", "valign", "span", "width"],
          dd: [],
          del: ["datetime"],
          details: ["open"],
          div: [],
          dl: [],
          dt: [],
          em: [],
          figcaption: [],
          figure: [],
          font: ["color", "size", "face"],
          footer: [],
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: [],
          header: [],
          hr: [],
          i: [],
          img: ["src", "alt", "title", "width", "height"],
          ins: ["datetime"],
          li: [],
          mark: [],
          nav: [],
          ol: [],
          p: [],
          pre: [],
          s: [],
          section: [],
          small: [],
          span: [],
          sub: [],
          summary: [],
          sup: [],
          strong: [],
          strike: [],
          table: ["width", "border", "align", "valign"],
          tbody: ["align", "valign"],
          td: ["width", "rowspan", "colspan", "align", "valign"],
          tfoot: ["align", "valign"],
          th: ["width", "rowspan", "colspan", "align", "valign"],
          thead: ["align", "valign"],
          tr: ["rowspan", "align", "valign"],
          tt: [],
          u: [],
          ul: [],
          video: [
            "autoplay",
            "controls",
            "crossorigin",
            "loop",
            "muted",
            "playsinline",
            "poster",
            "preload",
            "src",
            "height",
            "width",
          ],
        };
      }
      var o = new r();
      function a(e) {
        return e.replace(l, "&lt;").replace(c, "&gt;");
      }
      var l = /</g,
        c = />/g,
        p = /"/g,
        h = /&quot;/g,
        g = /&#([a-zA-Z0-9]*);?/gim,
        f = /&colon;?/gim,
        d = /&newline;?/gim,
        A =
          /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,
        k = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,
        m = /u\s*r\s*l\s*\(.*/gi;
      function b(e) {
        return e.replace(p, "&quot;");
      }
      function E(e) {
        return e.replace(h, '"');
      }
      function x(e) {
        return e.replace(g, function (e, t) {
          return "x" === t[0] || "X" === t[0]
            ? String.fromCharCode(parseInt(t.substr(1), 16))
            : String.fromCharCode(parseInt(t, 10));
        });
      }
      function F(e) {
        return e.replace(f, ":").replace(d, " ");
      }
      function D(e) {
        for (var t = "", n = 0, r = e.length; n < r; n++)
          t += e.charCodeAt(n) < 32 ? " " : e.charAt(n);
        return i.trim(t);
      }
      function w(e) {
        return (e = D((e = F((e = x((e = E(e))))))));
      }
      function B(e) {
        return (e = a((e = b(e))));
      }
      (t.whiteList = {
        a: ["target", "href", "title"],
        abbr: ["title"],
        address: [],
        area: ["shape", "coords", "href", "alt"],
        article: [],
        aside: [],
        audio: [
          "autoplay",
          "controls",
          "crossorigin",
          "loop",
          "muted",
          "preload",
          "src",
        ],
        b: [],
        bdi: ["dir"],
        bdo: ["dir"],
        big: [],
        blockquote: ["cite"],
        br: [],
        caption: [],
        center: [],
        cite: [],
        code: [],
        col: ["align", "valign", "span", "width"],
        colgroup: ["align", "valign", "span", "width"],
        dd: [],
        del: ["datetime"],
        details: ["open"],
        div: [],
        dl: [],
        dt: [],
        em: [],
        figcaption: [],
        figure: [],
        font: ["color", "size", "face"],
        footer: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        header: [],
        hr: [],
        i: [],
        img: ["src", "alt", "title", "width", "height"],
        ins: ["datetime"],
        li: [],
        mark: [],
        nav: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        section: [],
        small: [],
        span: [],
        sub: [],
        summary: [],
        sup: [],
        strong: [],
        strike: [],
        table: ["width", "border", "align", "valign"],
        tbody: ["align", "valign"],
        td: ["width", "rowspan", "colspan", "align", "valign"],
        tfoot: ["align", "valign"],
        th: ["width", "rowspan", "colspan", "align", "valign"],
        thead: ["align", "valign"],
        tr: ["rowspan", "align", "valign"],
        tt: [],
        u: [],
        ul: [],
        video: [
          "autoplay",
          "controls",
          "crossorigin",
          "loop",
          "muted",
          "playsinline",
          "poster",
          "preload",
          "src",
          "height",
          "width",
        ],
      }),
        (t.getDefaultWhiteList = s),
        (t.onTag = function (e, t, n) {}),
        (t.onIgnoreTag = function (e, t, n) {}),
        (t.onTagAttr = function (e, t, n) {}),
        (t.onIgnoreTagAttr = function (e, t, n) {}),
        (t.safeAttrValue = function (e, t, n, r) {
          if (((n = w(n)), "href" === t || "src" === t)) {
            if ("#" === (n = i.trim(n))) return "#";
            if (
              "http://" !== n.substr(0, 7) &&
              "https://" !== n.substr(0, 8) &&
              "mailto:" !== n.substr(0, 7) &&
              "tel:" !== n.substr(0, 4) &&
              "data:image/" !== n.substr(0, 11) &&
              "ftp://" !== n.substr(0, 6) &&
              "./" !== n.substr(0, 2) &&
              "../" !== n.substr(0, 3) &&
              "#" !== n[0] &&
              "/" !== n[0]
            )
              return "";
          } else if ("background" === t) {
            if (((A.lastIndex = 0), A.test(n))) return "";
          } else if ("style" === t) {
            if (((k.lastIndex = 0), k.test(n))) return "";
            if (
              ((m.lastIndex = 0), m.test(n) && ((A.lastIndex = 0), A.test(n)))
            )
              return "";
            !1 !== r && (n = (r = r || o).process(n));
          }
          return (n = B(n));
        }),
        (t.escapeHtml = a),
        (t.escapeQuote = b),
        (t.unescapeQuote = E),
        (t.escapeHtmlEntities = x),
        (t.escapeDangerHtml5Entities = F),
        (t.clearNonPrintableCharacter = D),
        (t.friendlyAttrValue = w),
        (t.escapeAttrValue = B),
        (t.onIgnoreTagStripAll = function () {
          return "";
        }),
        (t.StripTagBody = function (e, t) {
          "function" != typeof t && (t = function () {});
          var n = !Array.isArray(e),
            r = [],
            u = !1;
          return {
            onIgnoreTag: function (s, o, a) {
              if (
                (function (t) {
                  return !!n || -1 !== i.indexOf(e, t);
                })(s)
              ) {
                if (a.isClosing) {
                  var l = "[/removed]",
                    c = a.position + 10;
                  return r.push([!1 !== u ? u : a.position, c]), (u = !1), l;
                }
                return u || (u = a.position), "[removed]";
              }
              return t(s, o, a);
            },
            remove: function (e) {
              var t = "",
                n = 0;
              return (
                i.forEach(r, function (r) {
                  (t += e.slice(n, r[0])), (n = r[1]);
                }),
                (t += e.slice(n))
              );
            },
          };
        }),
        (t.stripCommentTag = function (e) {
          for (var t = "", n = 0; n < e.length; ) {
            var r = e.indexOf("\x3c!--", n);
            if (-1 === r) {
              t += e.slice(n);
              break;
            }
            t += e.slice(n, r);
            var u = e.indexOf("--\x3e", r);
            if (-1 === u) break;
            n = u + 3;
          }
          return t;
        }),
        (t.stripBlankChar = function (e) {
          var t = e.split("");
          return (t = t.filter(function (e) {
            var t = e.charCodeAt(0);
            return 127 !== t && (!(t <= 31) || 10 === t || 13 === t);
          })).join("");
        }),
        (t.cssFilter = o),
        (t.getDefaultCSSWhiteList = u);
    },
    62173: (e, t, n) => {
      var r = n(60841),
        u = n(79542),
        i = n(61585);
      function s(e, t) {
        return new i(t).process(e);
      }
      ((t = e.exports = s).filterXSS = s),
        (t.FilterXSS = i),
        (function () {
          for (var e in r) t[e] = r[e];
          for (var n in u) t[n] = u[n];
        })(),
        "undefined" != typeof window && (window.filterXSS = e.exports),
        "undefined" != typeof self &&
          "undefined" != typeof DedicatedWorkerGlobalScope &&
          self instanceof DedicatedWorkerGlobalScope &&
          (self.filterXSS = e.exports);
    },
    79542: (e, t, n) => {
      var r = n(58511);
      function u(e) {
        var t,
          n = r.spaceIndex(e);
        return (
          (t = -1 === n ? e.slice(1, -1) : e.slice(1, n + 1)),
          "/" === (t = r.trim(t).toLowerCase()).slice(0, 1) && (t = t.slice(1)),
          "/" === t.slice(-1) && (t = t.slice(0, -1)),
          t
        );
      }
      function i(e) {
        return "</" === e.slice(0, 2);
      }
      var s = /[^a-zA-Z0-9\\_:.-]/gim;
      function o(e, t) {
        for (; t < e.length; t++) {
          var n = e[t];
          if (" " !== n) return "=" === n ? t : -1;
        }
      }
      function a(e, t) {
        for (; t < e.length; t++) {
          var n = e[t];
          if (" " !== n) return "'" === n || '"' === n ? t : -1;
        }
      }
      function l(e, t) {
        for (; t > 0; t--) {
          var n = e[t];
          if (" " !== n) return "=" === n ? t : -1;
        }
      }
      function c(e) {
        return (function (e) {
          return (
            ('"' === e[0] && '"' === e[e.length - 1]) ||
            ("'" === e[0] && "'" === e[e.length - 1])
          );
        })(e)
          ? e.substr(1, e.length - 2)
          : e;
      }
      (t.parseTag = function (e, t, n) {
        var r = "",
          s = 0,
          o = !1,
          a = !1,
          l = 0,
          c = e.length,
          p = "",
          h = "";
        e: for (l = 0; l < c; l++) {
          var g = e.charAt(l);
          if (!1 === o) {
            if ("<" === g) {
              o = l;
              continue;
            }
          } else if (!1 === a) {
            if ("<" === g) {
              (r += n(e.slice(s, l))), (o = l), (s = l);
              continue;
            }
            if (">" === g || l === c - 1) {
              (r += n(e.slice(s, o))),
                (p = u((h = e.slice(o, l + 1)))),
                (r += t(o, r.length, p, h, i(h))),
                (s = l + 1),
                (o = !1);
              continue;
            }
            if ('"' === g || "'" === g)
              for (
                var f = 1, d = e.charAt(l - f);
                "" === d.trim() || "=" === d;

              ) {
                if ("=" === d) {
                  a = g;
                  continue e;
                }
                d = e.charAt(l - ++f);
              }
          } else if (g === a) {
            a = !1;
            continue;
          }
        }
        return s < c && (r += n(e.substr(s))), r;
      }),
        (t.parseAttr = function (e, t) {
          var n = 0,
            u = 0,
            i = [],
            p = !1,
            h = e.length;
          function g(e, n) {
            if (
              !((e = (e = r.trim(e)).replace(s, "").toLowerCase()).length < 1)
            ) {
              var u = t(e, n || "");
              u && i.push(u);
            }
          }
          for (var f = 0; f < h; f++) {
            var d,
              A = e.charAt(f);
            if (!1 !== p || "=" !== A)
              if (!1 === p || f !== u)
                if (/\s|\n|\t/.test(A)) {
                  if (((e = e.replace(/\s|\n|\t/g, " ")), !1 === p)) {
                    if (-1 === (d = o(e, f))) {
                      g(r.trim(e.slice(n, f))), (p = !1), (n = f + 1);
                      continue;
                    }
                    f = d - 1;
                    continue;
                  }
                  if (-1 === (d = l(e, f - 1))) {
                    g(p, c(r.trim(e.slice(n, f)))), (p = !1), (n = f + 1);
                    continue;
                  }
                } else;
              else {
                if (-1 === (d = e.indexOf(A, f + 1))) break;
                g(p, r.trim(e.slice(u + 1, d))), (p = !1), (n = (f = d) + 1);
              }
            else
              (p = e.slice(n, f)),
                (n = f + 1),
                (u =
                  '"' === e.charAt(n) || "'" === e.charAt(n) ? n : a(e, f + 1));
          }
          return (
            n < e.length &&
              (!1 === p ? g(e.slice(n)) : g(p, c(r.trim(e.slice(n))))),
            r.trim(i.join(" "))
          );
        });
    },
    58511: (e) => {
      e.exports = {
        indexOf: function (e, t) {
          var n, r;
          if (Array.prototype.indexOf) return e.indexOf(t);
          for (n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
          return -1;
        },
        forEach: function (e, t, n) {
          var r, u;
          if (Array.prototype.forEach) return e.forEach(t, n);
          for (r = 0, u = e.length; r < u; r++) t.call(n, e[r], r, e);
        },
        trim: function (e) {
          return String.prototype.trim
            ? e.trim()
            : e.replace(/(^\s*)|(\s*$)/g, "");
        },
        spaceIndex: function (e) {
          var t = /\s|\n|\t/.exec(e);
          return t ? t.index : -1;
        },
      };
    },
    61585: (e, t, n) => {
      var r = n(8300).FilterCSS,
        u = n(60841),
        i = n(79542),
        s = i.parseTag,
        o = i.parseAttr,
        a = n(58511);
      function l(e) {
        return null == e;
      }
      function c(e) {
        (e = (function (e) {
          var t = {};
          for (var n in e) t[n] = e[n];
          return t;
        })(e || {})).stripIgnoreTag &&
          (e.onIgnoreTag &&
            console.error(
              'Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time'
            ),
          (e.onIgnoreTag = u.onIgnoreTagStripAll)),
          e.whiteList || e.allowList
            ? (e.whiteList = (function (e) {
                var t = {};
                for (var n in e)
                  Array.isArray(e[n])
                    ? (t[n.toLowerCase()] = e[n].map(function (e) {
                        return e.toLowerCase();
                      }))
                    : (t[n.toLowerCase()] = e[n]);
                return t;
              })(e.whiteList || e.allowList))
            : (e.whiteList = u.whiteList),
          (e.onTag = e.onTag || u.onTag),
          (e.onTagAttr = e.onTagAttr || u.onTagAttr),
          (e.onIgnoreTag = e.onIgnoreTag || u.onIgnoreTag),
          (e.onIgnoreTagAttr = e.onIgnoreTagAttr || u.onIgnoreTagAttr),
          (e.safeAttrValue = e.safeAttrValue || u.safeAttrValue),
          (e.escapeHtml = e.escapeHtml || u.escapeHtml),
          (this.options = e),
          !1 === e.css
            ? (this.cssFilter = !1)
            : ((e.css = e.css || {}), (this.cssFilter = new r(e.css)));
      }
      (c.prototype.process = function (e) {
        if (!(e = (e = e || "").toString())) return "";
        var t = this.options,
          n = t.whiteList,
          r = t.onTag,
          i = t.onIgnoreTag,
          c = t.onTagAttr,
          p = t.onIgnoreTagAttr,
          h = t.safeAttrValue,
          g = t.escapeHtml,
          f = this.cssFilter;
        t.stripBlankChar && (e = u.stripBlankChar(e)),
          t.allowCommentTag || (e = u.stripCommentTag(e));
        var d = !1;
        t.stripIgnoreTagBody &&
          ((d = u.StripTagBody(t.stripIgnoreTagBody, i)), (i = d.onIgnoreTag));
        var A = s(
          e,
          function (e, t, u, s, d) {
            var A = {
                sourcePosition: e,
                position: t,
                isClosing: d,
                isWhite: Object.prototype.hasOwnProperty.call(n, u),
              },
              k = r(u, s, A);
            if (!l(k)) return k;
            if (A.isWhite) {
              if (A.isClosing) return "</" + u + ">";
              var m = (function (e) {
                  var t = a.spaceIndex(e);
                  if (-1 === t)
                    return { html: "", closing: "/" === e[e.length - 2] };
                  var n =
                    "/" === (e = a.trim(e.slice(t + 1, -1)))[e.length - 1];
                  return (
                    n && (e = a.trim(e.slice(0, -1))), { html: e, closing: n }
                  );
                })(s),
                b = n[u],
                E = o(m.html, function (e, t) {
                  var n = -1 !== a.indexOf(b, e),
                    r = c(u, e, t, n);
                  return l(r)
                    ? n
                      ? (t = h(u, e, t, f))
                        ? e + '="' + t + '"'
                        : e
                      : l((r = p(u, e, t, n)))
                      ? void 0
                      : r
                    : r;
                });
              return (
                (s = "<" + u),
                E && (s += " " + E),
                m.closing && (s += " /"),
                (s += ">")
              );
            }
            return l((k = i(u, s, A))) ? g(s) : k;
          },
          g
        );
        return d && (A = d.remove(A)), A;
      }),
        (e.exports = c);
    },
  },
  t = {};
function n(r) {
  var u = t[r];
  if (void 0 !== u) return u.exports;
  var i = (t[r] = { exports: {} });
  return e[r](i, i.exports, n), i.exports;
}
(() => {
  const e = Symbol("Comlink.proxy"),
    t = Symbol("Comlink.endpoint"),
    r = Symbol("Comlink.releaseProxy"),
    u = Symbol("Comlink.finalizer"),
    i = Symbol("Comlink.thrown"),
    s = (e) => ("object" == typeof e && null !== e) || "function" == typeof e,
    o = new Map([
      [
        "proxy",
        {
          canHandle: (t) => s(t) && t[e],
          serialize(e) {
            const { port1: t, port2: n } = new MessageChannel();
            return a(e, t), [n, [n]];
          },
          deserialize(e) {
            return e.start(), f(e, [], t);
            var t;
          },
        },
      ],
      [
        "throw",
        {
          canHandle: (e) => s(e) && i in e,
          serialize({ value: e }) {
            let t;
            return (
              (t =
                e instanceof Error
                  ? {
                      isError: !0,
                      value: {
                        message: e.message,
                        name: e.name,
                        stack: e.stack,
                      },
                    }
                  : { isError: !1, value: e }),
              [t, []]
            );
          },
          deserialize(e) {
            if (e.isError)
              throw Object.assign(new Error(e.value.message), e.value);
            throw e.value;
          },
        },
      ],
    ]);
  function a(t, n = globalThis, r = ["*"]) {
    n.addEventListener("message", function s(o) {
      if (!o || !o.data) return;
      if (
        !(function (e, t) {
          for (const n of e) {
            if (t === n || "*" === n) return !0;
            if (n instanceof RegExp && n.test(t)) return !0;
          }
          return !1;
        })(r, o.origin)
      )
        return void console.warn(
          `Invalid origin '${o.origin}' for comlink proxy`
        );
      const { id: c, type: p, path: h } = Object.assign({ path: [] }, o.data),
        g = (o.data.argumentList || []).map(m);
      let f;
      try {
        const n = h.slice(0, -1).reduce((e, t) => e[t], t),
          r = h.reduce((e, t) => e[t], t);
        switch (p) {
          case "GET":
            f = r;
            break;
          case "SET":
            (n[h.slice(-1)[0]] = m(o.data.value)), (f = !0);
            break;
          case "APPLY":
            f = r.apply(n, g);
            break;
          case "CONSTRUCT":
            f = (function (t) {
              return Object.assign(t, { [e]: !0 });
            })(new r(...g));
            break;
          case "ENDPOINT":
            {
              const { port1: e, port2: n } = new MessageChannel();
              a(t, n),
                (f = (function (e, t) {
                  return A.set(e, t), e;
                })(e, [e]));
            }
            break;
          case "RELEASE":
            f = void 0;
            break;
          default:
            return;
        }
      } catch (e) {
        f = { value: e, [i]: 0 };
      }
      Promise.resolve(f)
        .catch((e) => ({ value: e, [i]: 0 }))
        .then((e) => {
          const [r, i] = k(e);
          n.postMessage(Object.assign(Object.assign({}, r), { id: c }), i),
            "RELEASE" === p &&
              (n.removeEventListener("message", s),
              l(n),
              u in t && "function" == typeof t[u] && t[u]());
        })
        .catch((e) => {
          const [t, r] = k({
            value: new TypeError("Unserializable return value"),
            [i]: 0,
          });
          n.postMessage(Object.assign(Object.assign({}, t), { id: c }), r);
        });
    }),
      n.start && n.start();
  }
  function l(e) {
    (function (e) {
      return "MessagePort" === e.constructor.name;
    })(e) && e.close();
  }
  function c(e) {
    if (e) throw new Error("Proxy has been released and is not useable");
  }
  function p(e) {
    return b(e, { type: "RELEASE" }).then(() => {
      l(e);
    });
  }
  const h = new WeakMap(),
    g =
      "FinalizationRegistry" in globalThis &&
      new FinalizationRegistry((e) => {
        const t = (h.get(e) || 0) - 1;
        h.set(e, t), 0 === t && p(e);
      });
  function f(e, n = [], u = function () {}) {
    let i = !1;
    const s = new Proxy(u, {
      get(t, u) {
        if ((c(i), u === r))
          return () => {
            !(function (e) {
              g && g.unregister(e);
            })(s),
              p(e),
              (i = !0);
          };
        if ("then" === u) {
          if (0 === n.length) return { then: () => s };
          const t = b(e, {
            type: "GET",
            path: n.map((e) => e.toString()),
          }).then(m);
          return t.then.bind(t);
        }
        return f(e, [...n, u]);
      },
      set(t, r, u) {
        c(i);
        const [s, o] = k(u);
        return b(
          e,
          { type: "SET", path: [...n, r].map((e) => e.toString()), value: s },
          o
        ).then(m);
      },
      apply(r, u, s) {
        c(i);
        const o = n[n.length - 1];
        if (o === t) return b(e, { type: "ENDPOINT" }).then(m);
        if ("bind" === o) return f(e, n.slice(0, -1));
        const [a, l] = d(s);
        return b(
          e,
          { type: "APPLY", path: n.map((e) => e.toString()), argumentList: a },
          l
        ).then(m);
      },
      construct(t, r) {
        c(i);
        const [u, s] = d(r);
        return b(
          e,
          {
            type: "CONSTRUCT",
            path: n.map((e) => e.toString()),
            argumentList: u,
          },
          s
        ).then(m);
      },
    });
    return (
      (function (e, t) {
        const n = (h.get(t) || 0) + 1;
        h.set(t, n), g && g.register(e, t, e);
      })(s, e),
      s
    );
  }
  function d(e) {
    const t = e.map(k);
    return [
      t.map((e) => e[0]),
      ((n = t.map((e) => e[1])), Array.prototype.concat.apply([], n)),
    ];
    var n;
  }
  const A = new WeakMap();
  function k(e) {
    for (const [t, n] of o)
      if (n.canHandle(e)) {
        const [r, u] = n.serialize(e);
        return [{ type: "HANDLER", name: t, value: r }, u];
      }
    return [{ type: "RAW", value: e }, A.get(e) || []];
  }
  function m(e) {
    switch (e.type) {
      case "HANDLER":
        return o.get(e.name).deserialize(e.value);
      case "RAW":
        return e.value;
    }
  }
  function b(e, t, n) {
    return new Promise((r) => {
      const u = new Array(4)
        .fill(0)
        .map(() =>
          Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
        )
        .join("-");
      e.addEventListener("message", function t(n) {
        n.data &&
          n.data.id &&
          n.data.id === u &&
          (e.removeEventListener("message", t), r(n.data));
      }),
        e.start && e.start(),
        e.postMessage(Object.assign({ id: u }, t), n);
    });
  }
  function E(e, t) {
    if (!Object.prototype.hasOwnProperty.call(e, t))
      throw new TypeError("attempted to use private field on non-instance");
    return e;
  }
  var x = 0;
  function F(e) {
    return "__private_" + x++ + "_" + e;
  }
  function D() {
    return {
      async: !1,
      breaks: !1,
      extensions: null,
      gfm: !0,
      hooks: null,
      pedantic: !1,
      renderer: null,
      silent: !1,
      tokenizer: null,
      walkTokens: null,
    };
  }
  let w = {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null,
  };
  function B(e) {
    w = e;
  }
  const C = /[&<>"']/,
    y = new RegExp(C.source, "g"),
    v = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    T = new RegExp(v.source, "g"),
    $ = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
    z = (e) => $[e];
  function S(e, t) {
    if (t) {
      if (C.test(e)) return e.replace(y, z);
    } else if (v.test(e)) return e.replace(T, z);
    return e;
  }
  const R = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
  function I(e) {
    return e.replace(R, (e, t) =>
      "colon" === (t = t.toLowerCase())
        ? ":"
        : "#" === t.charAt(0)
        ? "x" === t.charAt(1)
          ? String.fromCharCode(parseInt(t.substring(2), 16))
          : String.fromCharCode(+t.substring(1))
        : ""
    );
  }
  const _ = /(^|[^\[])\^/g;
  function L(e, t) {
    let n = "string" == typeof e ? e : e.source;
    t = t || "";
    const r = {
      replace: (e, t) => {
        let u = "string" == typeof t ? t : t.source;
        return (u = u.replace(_, "$1")), (n = n.replace(e, u)), r;
      },
      getRegex: () => new RegExp(n, t),
    };
    return r;
  }
  function O(e) {
    try {
      e = encodeURI(e).replace(/%25/g, "%");
    } catch (e) {
      return null;
    }
    return e;
  }
  const P = { exec: () => null };
  function j(e, t) {
    const n = e
      .replace(/\|/g, (e, t, n) => {
        let r = !1,
          u = t;
        for (; --u >= 0 && "\\" === n[u]; ) r = !r;
        return r ? "|" : " |";
      })
      .split(/ \|/);
    let r = 0;
    if (
      (n[0].trim() || n.shift(),
      n.length > 0 && !n[n.length - 1].trim() && n.pop(),
      t)
    )
      if (n.length > t) n.splice(t);
      else for (; n.length < t; ) n.push("");
    for (; r < n.length; r++) n[r] = n[r].trim().replace(/\\\|/g, "|");
    return n;
  }
  function q(e, t, n) {
    const r = e.length;
    if (0 === r) return "";
    let u = 0;
    for (; u < r; ) {
      const i = e.charAt(r - u - 1);
      if (i !== t || n) {
        if (i === t || !n) break;
        u++;
      } else u++;
    }
    return e.slice(0, r - u);
  }
  function Z(e, t, n, r) {
    const u = t.href,
      i = t.title ? S(t.title) : null,
      s = e[1].replace(/\\([\[\]])/g, "$1");
    if ("!" !== e[0].charAt(0)) {
      r.state.inLink = !0;
      const e = {
        type: "link",
        raw: n,
        href: u,
        title: i,
        text: s,
        tokens: r.inlineTokens(s),
      };
      return (r.state.inLink = !1), e;
    }
    return { type: "image", raw: n, href: u, title: i, text: S(s) };
  }
  class M {
    constructor(e) {
      (this.options = void 0),
        (this.rules = void 0),
        (this.lexer = void 0),
        (this.options = e || w);
    }
    space(e) {
      const t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      const t = this.rules.block.code.exec(e);
      if (t) {
        const e = t[0].replace(/^ {1,4}/gm, "");
        return {
          type: "code",
          raw: t[0],
          codeBlockStyle: "indented",
          text: this.options.pedantic ? e : q(e, "\n"),
        };
      }
    }
    fences(e) {
      const t = this.rules.block.fences.exec(e);
      if (t) {
        const e = t[0],
          n = (function (e, t) {
            const n = e.match(/^(\s+)(?:```)/);
            if (null === n) return t;
            const r = n[1];
            return t
              .split("\n")
              .map((e) => {
                const t = e.match(/^\s+/);
                if (null === t) return e;
                const [n] = t;
                return n.length >= r.length ? e.slice(r.length) : e;
              })
              .join("\n");
          })(e, t[3] || "");
        return {
          type: "code",
          raw: e,
          lang: t[2]
            ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1")
            : t[2],
          text: n,
        };
      }
    }
    heading(e) {
      const t = this.rules.block.heading.exec(e);
      if (t) {
        let e = t[2].trim();
        if (/#$/.test(e)) {
          const t = q(e, "#");
          this.options.pedantic
            ? (e = t.trim())
            : (t && !/ $/.test(t)) || (e = t.trim());
        }
        return {
          type: "heading",
          raw: t[0],
          depth: t[1].length,
          text: e,
          tokens: this.lexer.inline(e),
        };
      }
    }
    hr(e) {
      const t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: t[0] };
    }
    blockquote(e) {
      const t = this.rules.block.blockquote.exec(e);
      if (t) {
        const e = q(t[0].replace(/^ *>[ \t]?/gm, ""), "\n"),
          n = this.lexer.state.top;
        this.lexer.state.top = !0;
        const r = this.lexer.blockTokens(e);
        return (
          (this.lexer.state.top = n),
          { type: "blockquote", raw: t[0], tokens: r, text: e }
        );
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim();
        const r = n.length > 1,
          u = {
            type: "list",
            raw: "",
            ordered: r,
            start: r ? +n.slice(0, -1) : "",
            loose: !1,
            items: [],
          };
        (n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`),
          this.options.pedantic && (n = r ? n : "[*+-]");
        const i = new RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`);
        let s = "",
          o = "",
          a = !1;
        for (; e; ) {
          let n = !1;
          if (!(t = i.exec(e))) break;
          if (this.rules.block.hr.test(e)) break;
          (s = t[0]), (e = e.substring(s.length));
          let r = t[2]
              .split("\n", 1)[0]
              .replace(/^\t+/, (e) => " ".repeat(3 * e.length)),
            l = e.split("\n", 1)[0],
            c = 0;
          this.options.pedantic
            ? ((c = 2), (o = r.trimStart()))
            : ((c = t[2].search(/[^ ]/)),
              (c = c > 4 ? 1 : c),
              (o = r.slice(c)),
              (c += t[1].length));
          let p = !1;
          if (
            (!r &&
              /^ *$/.test(l) &&
              ((s += l + "\n"), (e = e.substring(l.length + 1)), (n = !0)),
            !n)
          ) {
            const t = new RegExp(
                `^ {0,${Math.min(
                  3,
                  c - 1
                )}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`
              ),
              n = new RegExp(
                `^ {0,${Math.min(
                  3,
                  c - 1
                )}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`
              ),
              u = new RegExp(`^ {0,${Math.min(3, c - 1)}}(?:\`\`\`|~~~)`),
              i = new RegExp(`^ {0,${Math.min(3, c - 1)}}#`);
            for (; e; ) {
              const a = e.split("\n", 1)[0];
              if (
                ((l = a),
                this.options.pedantic &&
                  (l = l.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")),
                u.test(l))
              )
                break;
              if (i.test(l)) break;
              if (t.test(l)) break;
              if (n.test(e)) break;
              if (l.search(/[^ ]/) >= c || !l.trim()) o += "\n" + l.slice(c);
              else {
                if (p) break;
                if (r.search(/[^ ]/) >= 4) break;
                if (u.test(r)) break;
                if (i.test(r)) break;
                if (n.test(r)) break;
                o += "\n" + l;
              }
              p || l.trim() || (p = !0),
                (s += a + "\n"),
                (e = e.substring(a.length + 1)),
                (r = l.slice(c));
            }
          }
          u.loose || (a ? (u.loose = !0) : /\n *\n *$/.test(s) && (a = !0));
          let h,
            g = null;
          this.options.gfm &&
            ((g = /^\[[ xX]\] /.exec(o)),
            g && ((h = "[ ] " !== g[0]), (o = o.replace(/^\[[ xX]\] +/, "")))),
            u.items.push({
              type: "list_item",
              raw: s,
              task: !!g,
              checked: h,
              loose: !1,
              text: o,
              tokens: [],
            }),
            (u.raw += s);
        }
        (u.items[u.items.length - 1].raw = s.trimEnd()),
          (u.items[u.items.length - 1].text = o.trimEnd()),
          (u.raw = u.raw.trimEnd());
        for (let e = 0; e < u.items.length; e++)
          if (
            ((this.lexer.state.top = !1),
            (u.items[e].tokens = this.lexer.blockTokens(u.items[e].text, [])),
            !u.loose)
          ) {
            const t = u.items[e].tokens.filter((e) => "space" === e.type),
              n = t.length > 0 && t.some((e) => /\n.*\n/.test(e.raw));
            u.loose = n;
          }
        if (u.loose)
          for (let e = 0; e < u.items.length; e++) u.items[e].loose = !0;
        return u;
      }
    }
    html(e) {
      const t = this.rules.block.html.exec(e);
      if (t) {
        return {
          type: "html",
          block: !0,
          raw: t[0],
          pre: "pre" === t[1] || "script" === t[1] || "style" === t[1],
          text: t[0],
        };
      }
    }
    def(e) {
      const t = this.rules.block.def.exec(e);
      if (t) {
        const e = t[1].toLowerCase().replace(/\s+/g, " "),
          n = t[2]
            ? t[2]
                .replace(/^<(.*)>$/, "$1")
                .replace(this.rules.inline.anyPunctuation, "$1")
            : "",
          r = t[3]
            ? t[3]
                .substring(1, t[3].length - 1)
                .replace(this.rules.inline.anyPunctuation, "$1")
            : t[3];
        return { type: "def", tag: e, raw: t[0], href: n, title: r };
      }
    }
    table(e) {
      const t = this.rules.block.table.exec(e);
      if (!t) return;
      if (!/[:|]/.test(t[2])) return;
      const n = j(t[1]),
        r = t[2].replace(/^\||\| *$/g, "").split("|"),
        u =
          t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split("\n") : [],
        i = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r.length) {
        for (const e of r)
          /^ *-+: *$/.test(e)
            ? i.align.push("right")
            : /^ *:-+: *$/.test(e)
            ? i.align.push("center")
            : /^ *:-+ *$/.test(e)
            ? i.align.push("left")
            : i.align.push(null);
        for (const e of n)
          i.header.push({ text: e, tokens: this.lexer.inline(e) });
        for (const e of u)
          i.rows.push(
            j(e, i.header.length).map((e) => ({
              text: e,
              tokens: this.lexer.inline(e),
            }))
          );
        return i;
      }
    }
    lheading(e) {
      const t = this.rules.block.lheading.exec(e);
      if (t)
        return {
          type: "heading",
          raw: t[0],
          depth: "=" === t[2].charAt(0) ? 1 : 2,
          text: t[1],
          tokens: this.lexer.inline(t[1]),
        };
    }
    paragraph(e) {
      const t = this.rules.block.paragraph.exec(e);
      if (t) {
        const e =
          "\n" === t[1].charAt(t[1].length - 1) ? t[1].slice(0, -1) : t[1];
        return {
          type: "paragraph",
          raw: t[0],
          text: e,
          tokens: this.lexer.inline(e),
        };
      }
    }
    text(e) {
      const t = this.rules.block.text.exec(e);
      if (t)
        return {
          type: "text",
          raw: t[0],
          text: t[0],
          tokens: this.lexer.inline(t[0]),
        };
    }
    escape(e) {
      const t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: S(t[1]) };
    }
    tag(e) {
      const t = this.rules.inline.tag.exec(e);
      if (t)
        return (
          !this.lexer.state.inLink && /^<a /i.test(t[0])
            ? (this.lexer.state.inLink = !0)
            : this.lexer.state.inLink &&
              /^<\/a>/i.test(t[0]) &&
              (this.lexer.state.inLink = !1),
          !this.lexer.state.inRawBlock &&
          /^<(pre|code|kbd|script)(\s|>)/i.test(t[0])
            ? (this.lexer.state.inRawBlock = !0)
            : this.lexer.state.inRawBlock &&
              /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) &&
              (this.lexer.state.inRawBlock = !1),
          {
            type: "html",
            raw: t[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            block: !1,
            text: t[0],
          }
        );
    }
    link(e) {
      const t = this.rules.inline.link.exec(e);
      if (t) {
        const e = t[2].trim();
        if (!this.options.pedantic && /^</.test(e)) {
          if (!/>$/.test(e)) return;
          const t = q(e.slice(0, -1), "\\");
          if ((e.length - t.length) % 2 == 0) return;
        } else {
          const e = (function (e, t) {
            if (-1 === e.indexOf(t[1])) return -1;
            let n = 0;
            for (let r = 0; r < e.length; r++)
              if ("\\" === e[r]) r++;
              else if (e[r] === t[0]) n++;
              else if (e[r] === t[1] && (n--, n < 0)) return r;
            return -1;
          })(t[2], "()");
          if (e > -1) {
            const n = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e;
            (t[2] = t[2].substring(0, e)),
              (t[0] = t[0].substring(0, n).trim()),
              (t[3] = "");
          }
        }
        let n = t[2],
          r = "";
        if (this.options.pedantic) {
          const e = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);
          e && ((n = e[1]), (r = e[3]));
        } else r = t[3] ? t[3].slice(1, -1) : "";
        return (
          (n = n.trim()),
          /^</.test(n) &&
            (n =
              this.options.pedantic && !/>$/.test(e)
                ? n.slice(1)
                : n.slice(1, -1)),
          Z(
            t,
            {
              href: n ? n.replace(this.rules.inline.anyPunctuation, "$1") : n,
              title: r ? r.replace(this.rules.inline.anyPunctuation, "$1") : r,
            },
            t[0],
            this.lexer
          )
        );
      }
    }
    reflink(e, t) {
      let n;
      if (
        (n = this.rules.inline.reflink.exec(e)) ||
        (n = this.rules.inline.nolink.exec(e))
      ) {
        const e = t[(n[2] || n[1]).replace(/\s+/g, " ").toLowerCase()];
        if (!e) {
          const e = n[0].charAt(0);
          return { type: "text", raw: e, text: e };
        }
        return Z(n, e, n[0], this.lexer);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (!r) return;
      if (
        r[3] &&
        n.match(
          /[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10107}-\u{10133}\u{10140}-\u{10178}\u{1018A}\u{1018B}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E1}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{103A0}-\u{103C3}\u{103C8}-\u{103CF}\u{103D1}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{10570}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10858}-\u{10876}\u{10879}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A60}-\u{10A7E}\u{10A80}-\u{10A9F}\u{10AC0}-\u{10AC7}\u{10AC9}-\u{10AE4}\u{10AEB}-\u{10AEF}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F54}\u{10F70}-\u{10F81}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{11003}-\u{11037}\u{11052}-\u{1106F}\u{11071}\u{11072}\u{11075}\u{11083}-\u{110AF}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{11136}-\u{1113F}\u{11144}\u{11147}\u{11150}-\u{11172}\u{11176}\u{11183}-\u{111B2}\u{111C1}-\u{111C4}\u{111D0}-\u{111DA}\u{111DC}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122B}\u{1123F}\u{11240}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A8}\u{112B0}-\u{112DE}\u{112F0}-\u{112F9}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}\u{11350}\u{1135D}-\u{11361}\u{11400}-\u{11434}\u{11447}-\u{1144A}\u{11450}-\u{11459}\u{1145F}-\u{11461}\u{11480}-\u{114AF}\u{114C4}\u{114C5}\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115AE}\u{115D8}-\u{115DB}\u{11600}-\u{1162F}\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116B8}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{11730}-\u{1173B}\u{11740}-\u{11746}\u{11800}-\u{1182B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{1192F}\u{1193F}\u{11941}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D0}\u{119E1}\u{119E3}\u{11A00}\u{11A0B}-\u{11A32}\u{11A3A}\u{11A50}\u{11A5C}-\u{11A89}\u{11A9D}\u{11AB0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2E}\u{11C40}\u{11C50}-\u{11C6C}\u{11C72}-\u{11C8F}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D89}\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF2}\u{11F02}\u{11F04}-\u{11F10}\u{11F12}-\u{11F33}\u{11F50}-\u{11F59}\u{11FB0}\u{11FC0}-\u{11FD4}\u{12000}-\u{12399}\u{12400}-\u{1246E}\u{12480}-\u{12543}\u{12F90}-\u{12FF0}\u{13000}-\u{1342F}\u{13441}-\u{13446}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A70}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16B00}-\u{16B2F}\u{16B40}-\u{16B43}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E96}\u{16F00}-\u{16F4A}\u{16F50}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B132}\u{1B150}-\u{1B152}\u{1B155}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1D2C0}-\u{1D2D3}\u{1D2E0}-\u{1D2F3}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6C0}\u{1D6C2}-\u{1D6DA}\u{1D6DC}-\u{1D6FA}\u{1D6FC}-\u{1D714}\u{1D716}-\u{1D734}\u{1D736}-\u{1D74E}\u{1D750}-\u{1D76E}\u{1D770}-\u{1D788}\u{1D78A}-\u{1D7A8}\u{1D7AA}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D7CE}-\u{1D7FF}\u{1DF00}-\u{1DF1E}\u{1DF25}-\u{1DF2A}\u{1E030}-\u{1E06D}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E2F0}-\u{1E2F9}\u{1E4D0}-\u{1E4EB}\u{1E4F0}-\u{1E4F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1EC71}-\u{1ECAB}\u{1ECAD}-\u{1ECAF}\u{1ECB1}-\u{1ECB4}\u{1ED01}-\u{1ED2D}\u{1ED2F}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1F100}-\u{1F10C}\u{1FBF0}-\u{1FBF9}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B739}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{31350}-\u{323AF}]/u
        )
      )
        return;
      if (
        !(r[1] || r[2] || "") ||
        !n ||
        this.rules.inline.punctuation.exec(n)
      ) {
        const n = [...r[0]].length - 1;
        let u,
          i,
          s = n,
          o = 0;
        const a =
          "*" === r[0][0]
            ? this.rules.inline.emStrongRDelimAst
            : this.rules.inline.emStrongRDelimUnd;
        for (
          a.lastIndex = 0, t = t.slice(-1 * e.length + n);
          null != (r = a.exec(t));

        ) {
          if (((u = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !u))
            continue;
          if (((i = [...u].length), r[3] || r[4])) {
            s += i;
            continue;
          }
          if ((r[5] || r[6]) && n % 3 && !((n + i) % 3)) {
            o += i;
            continue;
          }
          if (((s -= i), s > 0)) continue;
          i = Math.min(i, i + s + o);
          const t = [...r[0]][0].length,
            a = e.slice(0, n + r.index + t + i);
          if (Math.min(n, i) % 2) {
            const e = a.slice(1, -1);
            return {
              type: "em",
              raw: a,
              text: e,
              tokens: this.lexer.inlineTokens(e),
            };
          }
          const l = a.slice(2, -2);
          return {
            type: "strong",
            raw: a,
            text: l,
            tokens: this.lexer.inlineTokens(l),
          };
        }
      }
    }
    codespan(e) {
      const t = this.rules.inline.code.exec(e);
      if (t) {
        let e = t[2].replace(/\n/g, " ");
        const n = /[^ ]/.test(e),
          r = /^ /.test(e) && / $/.test(e);
        return (
          n && r && (e = e.substring(1, e.length - 1)),
          (e = S(e, !0)),
          { type: "codespan", raw: t[0], text: e }
        );
      }
    }
    br(e) {
      const t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e) {
      const t = this.rules.inline.del.exec(e);
      if (t)
        return {
          type: "del",
          raw: t[0],
          text: t[2],
          tokens: this.lexer.inlineTokens(t[2]),
        };
    }
    autolink(e) {
      const t = this.rules.inline.autolink.exec(e);
      if (t) {
        let e, n;
        return (
          "@" === t[2]
            ? ((e = S(t[1])), (n = "mailto:" + e))
            : ((e = S(t[1])), (n = e)),
          {
            type: "link",
            raw: t[0],
            text: e,
            href: n,
            tokens: [{ type: "text", raw: e, text: e }],
          }
        );
      }
    }
    url(e) {
      let t;
      if ((t = this.rules.inline.url.exec(e))) {
        let e, u;
        if ("@" === t[2]) (e = S(t[0])), (u = "mailto:" + e);
        else {
          let i;
          do {
            var n, r;
            (i = t[0]),
              (t[0] =
                null !==
                  (n =
                    null === (r = this.rules.inline._backpedal.exec(t[0])) ||
                    void 0 === r
                      ? void 0
                      : r[0]) && void 0 !== n
                  ? n
                  : "");
          } while (i !== t[0]);
          (e = S(t[0])), (u = "www." === t[1] ? "http://" + t[0] : t[0]);
        }
        return {
          type: "link",
          raw: t[0],
          text: e,
          href: u,
          tokens: [{ type: "text", raw: e, text: e }],
        };
      }
    }
    inlineText(e) {
      const t = this.rules.inline.text.exec(e);
      if (t) {
        let e;
        return (
          (e = this.lexer.state.inRawBlock ? t[0] : S(t[0])),
          { type: "text", raw: t[0], text: e }
        );
      }
    }
  }
  const Q =
      /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
    H = /(?:[*+-]|\d{1,9}[.)])/,
    W = L(/^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/)
      .replace(/bull/g, H)
      .getRegex(),
    N =
      /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
    V = /(?!\s*\])(?:\\.|[^\[\]\\])+/,
    X = L(
      /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/
    )
      .replace("label", V)
      .replace(
        "title",
        /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
      )
      .getRegex(),
    U = L(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
      .replace(/bull/g, H)
      .getRegex(),
    G =
      "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
    Y = /<!--(?!-?>)[\s\S]*?(?:-->|$)/,
    J = L(
      "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
      "i"
    )
      .replace("comment", Y)
      .replace("tag", G)
      .replace(
        "attribute",
        / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
      )
      .getRegex(),
    K = L(N)
      .replace("hr", Q)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("|lheading", "")
      .replace("|table", "")
      .replace("blockquote", " {0,3}>")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
      .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
      .replace(
        "html",
        "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
      )
      .replace("tag", G)
      .getRegex(),
    ee = {
      blockquote: L(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
        .replace("paragraph", K)
        .getRegex(),
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      def: X,
      fences:
        /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      hr: Q,
      html: J,
      lheading: W,
      list: U,
      newline: /^(?: *(?:\n|$))+/,
      paragraph: K,
      table: P,
      text: /^[^\n]+/,
    },
    te = L(
      "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
    )
      .replace("hr", Q)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("blockquote", " {0,3}>")
      .replace("code", " {4}[^\\n]")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
      .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
      .replace(
        "html",
        "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
      )
      .replace("tag", G)
      .getRegex(),
    ne = {
      ...ee,
      table: te,
      paragraph: L(N)
        .replace("hr", Q)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("|lheading", "")
        .replace("table", te)
        .replace("blockquote", " {0,3}>")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", G)
        .getRegex(),
    },
    re = {
      ...ee,
      html: L(
        "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
      )
        .replace("comment", Y)
        .replace(
          /tag/g,
          "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
        )
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: P,
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: L(N)
        .replace("hr", Q)
        .replace("heading", " *#{1,6} *[^\n]")
        .replace("lheading", W)
        .replace("|table", "")
        .replace("blockquote", " {0,3}>")
        .replace("|fences", "")
        .replace("|list", "")
        .replace("|html", "")
        .replace("|tag", "")
        .getRegex(),
    },
    ue = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    ie = /^( {2,}|\\)\n(?!\s*$)/,
    se = "\\p{P}$+<=>`^|~",
    oe = L(/^((?![*_])[\spunctuation])/, "u")
      .replace(/punctuation/g, se)
      .getRegex(),
    ae = L(
      /^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,
      "u"
    )
      .replace(/punct/g, se)
      .getRegex(),
    le = L(
      "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])",
      "gu"
    )
      .replace(/punct/g, se)
      .getRegex(),
    ce = L(
      "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])",
      "gu"
    )
      .replace(/punct/g, se)
      .getRegex(),
    pe = L(/\\([punct])/, "gu")
      .replace(/punct/g, se)
      .getRegex(),
    he = L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
      .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
      .replace(
        "email",
        /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
      )
      .getRegex(),
    ge = L(Y).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
    fe = L(
      "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
    )
      .replace("comment", ge)
      .replace(
        "attribute",
        /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
      )
      .getRegex(),
    de = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,
    Ae = L(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/)
      .replace("label", de)
      .replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/)
      .replace(
        "title",
        /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
      )
      .getRegex(),
    ke = L(/^!?\[(label)\]\[(ref)\]/)
      .replace("label", de)
      .replace("ref", V)
      .getRegex(),
    me = L(/^!?\[(ref)\](?:\[\])?/)
      .replace("ref", V)
      .getRegex(),
    be = {
      _backpedal: P,
      anyPunctuation: pe,
      autolink: he,
      blockSkip: /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,
      br: ie,
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      del: P,
      emStrongLDelim: ae,
      emStrongRDelimAst: le,
      emStrongRDelimUnd: ce,
      escape: ue,
      link: Ae,
      nolink: me,
      punctuation: oe,
      reflink: ke,
      reflinkSearch: L("reflink|nolink(?!\\()", "g")
        .replace("reflink", ke)
        .replace("nolink", me)
        .getRegex(),
      tag: fe,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      url: P,
    },
    Ee = {
      ...be,
      link: L(/^!?\[(label)\]\((.*?)\)/)
        .replace("label", de)
        .getRegex(),
      reflink: L(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace("label", de)
        .getRegex(),
    },
    xe = {
      ...be,
      escape: L(ue).replace("])", "~|])").getRegex(),
      url: L(
        /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        "i"
      )
        .replace(
          "email",
          /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
        )
        .getRegex(),
      _backpedal:
        /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
    },
    Fe = {
      ...xe,
      br: L(ie).replace("{2,}", "*").getRegex(),
      text: L(xe.text)
        .replace("\\b_", "\\b_| {2,}\\n")
        .replace(/\{2,\}/g, "*")
        .getRegex(),
    },
    De = { normal: ee, gfm: ne, pedantic: re },
    we = { normal: be, gfm: xe, breaks: Fe, pedantic: Ee };
  class Be {
    constructor(e) {
      (this.tokens = void 0),
        (this.options = void 0),
        (this.state = void 0),
        (this.tokenizer = void 0),
        (this.inlineQueue = void 0),
        (this.tokens = []),
        (this.tokens.links = Object.create(null)),
        (this.options = e || w),
        (this.options.tokenizer = this.options.tokenizer || new M()),
        (this.tokenizer = this.options.tokenizer),
        (this.tokenizer.options = this.options),
        (this.tokenizer.lexer = this),
        (this.inlineQueue = []),
        (this.state = { inLink: !1, inRawBlock: !1, top: !0 });
      const t = { block: De.normal, inline: we.normal };
      this.options.pedantic
        ? ((t.block = De.pedantic), (t.inline = we.pedantic))
        : this.options.gfm &&
          ((t.block = De.gfm),
          this.options.breaks ? (t.inline = we.breaks) : (t.inline = we.gfm)),
        (this.tokenizer.rules = t);
    }
    static get rules() {
      return { block: De, inline: we };
    }
    static lex(e, t) {
      return new Be(t).lex(e);
    }
    static lexInline(e, t) {
      return new Be(t).inlineTokens(e);
    }
    lex(e) {
      (e = e.replace(/\r\n|\r/g, "\n")), this.blockTokens(e, this.tokens);
      for (let e = 0; e < this.inlineQueue.length; e++) {
        const t = this.inlineQueue[e];
        this.inlineTokens(t.src, t.tokens);
      }
      return (this.inlineQueue = []), this.tokens;
    }
    blockTokens(e, t = []) {
      let n, r, u, i;
      for (
        e = this.options.pedantic
          ? e.replace(/\t/g, "    ").replace(/^ +$/gm, "")
          : e.replace(/^( *)(\t+)/gm, (e, t, n) => t + "    ".repeat(n.length));
        e;

      )
        if (
          !(
            this.options.extensions &&
            this.options.extensions.block &&
            this.options.extensions.block.some(
              (r) =>
                !!(n = r.call({ lexer: this }, e, t)) &&
                ((e = e.substring(n.raw.length)), t.push(n), !0)
            )
          )
        )
          if ((n = this.tokenizer.space(e)))
            (e = e.substring(n.raw.length)),
              1 === n.raw.length && t.length > 0
                ? (t[t.length - 1].raw += "\n")
                : t.push(n);
          else if ((n = this.tokenizer.code(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              !r || ("paragraph" !== r.type && "text" !== r.type)
                ? t.push(n)
                : ((r.raw += "\n" + n.raw),
                  (r.text += "\n" + n.text),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = r.text));
          else if ((n = this.tokenizer.fences(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.heading(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.hr(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.blockquote(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.list(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.html(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.def(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              !r || ("paragraph" !== r.type && "text" !== r.type)
                ? this.tokens.links[n.tag] ||
                  (this.tokens.links[n.tag] = { href: n.href, title: n.title })
                : ((r.raw += "\n" + n.raw),
                  (r.text += "\n" + n.raw),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = r.text));
          else if ((n = this.tokenizer.table(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.lheading(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else {
            if (
              ((u = e),
              this.options.extensions && this.options.extensions.startBlock)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let r;
              this.options.extensions.startBlock.forEach((e) => {
                (r = e.call({ lexer: this }, n)),
                  "number" == typeof r && r >= 0 && (t = Math.min(t, r));
              }),
                t < 1 / 0 && t >= 0 && (u = e.substring(0, t + 1));
            }
            if (this.state.top && (n = this.tokenizer.paragraph(u)))
              (r = t[t.length - 1]),
                i && "paragraph" === r.type
                  ? ((r.raw += "\n" + n.raw),
                    (r.text += "\n" + n.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      r.text))
                  : t.push(n),
                (i = u.length !== e.length),
                (e = e.substring(n.raw.length));
            else if ((n = this.tokenizer.text(e)))
              (e = e.substring(n.raw.length)),
                (r = t[t.length - 1]),
                r && "text" === r.type
                  ? ((r.raw += "\n" + n.raw),
                    (r.text += "\n" + n.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      r.text))
                  : t.push(n);
            else if (e) {
              const t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          }
      return (this.state.top = !0), t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      let n,
        r,
        u,
        i,
        s,
        o,
        a = e;
      if (this.tokens.links) {
        const e = Object.keys(this.tokens.links);
        if (e.length > 0)
          for (
            ;
            null != (i = this.tokenizer.rules.inline.reflinkSearch.exec(a));

          )
            e.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) &&
              (a =
                a.slice(0, i.index) +
                "[" +
                "a".repeat(i[0].length - 2) +
                "]" +
                a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; null != (i = this.tokenizer.rules.inline.blockSkip.exec(a)); )
        a =
          a.slice(0, i.index) +
          "[" +
          "a".repeat(i[0].length - 2) +
          "]" +
          a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      for (; null != (i = this.tokenizer.rules.inline.anyPunctuation.exec(a)); )
        a =
          a.slice(0, i.index) +
          "++" +
          a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      for (; e; )
        if (
          (s || (o = ""),
          (s = !1),
          !(
            this.options.extensions &&
            this.options.extensions.inline &&
            this.options.extensions.inline.some(
              (r) =>
                !!(n = r.call({ lexer: this }, e, t)) &&
                ((e = e.substring(n.raw.length)), t.push(n), !0)
            )
          ))
        )
          if ((n = this.tokenizer.escape(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.tag(e)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              r && "text" === n.type && "text" === r.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.link(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.reflink(e, this.tokens.links)))
            (e = e.substring(n.raw.length)),
              (r = t[t.length - 1]),
              r && "text" === n.type && "text" === r.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.emStrong(e, a, o)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.codespan(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.br(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.del(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.autolink(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if (this.state.inLink || !(n = this.tokenizer.url(e))) {
            if (
              ((u = e),
              this.options.extensions && this.options.extensions.startInline)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let r;
              this.options.extensions.startInline.forEach((e) => {
                (r = e.call({ lexer: this }, n)),
                  "number" == typeof r && r >= 0 && (t = Math.min(t, r));
              }),
                t < 1 / 0 && t >= 0 && (u = e.substring(0, t + 1));
            }
            if ((n = this.tokenizer.inlineText(u)))
              (e = e.substring(n.raw.length)),
                "_" !== n.raw.slice(-1) && (o = n.raw.slice(-1)),
                (s = !0),
                (r = t[t.length - 1]),
                r && "text" === r.type
                  ? ((r.raw += n.raw), (r.text += n.text))
                  : t.push(n);
            else if (e) {
              const t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          } else (e = e.substring(n.raw.length)), t.push(n);
      return t;
    }
  }
  class Ce {
    constructor(e) {
      (this.options = void 0), (this.options = e || w);
    }
    code(e, t, n) {
      var r;
      const u =
        null === (r = (t || "").match(/^\S*/)) || void 0 === r ? void 0 : r[0];
      return (
        (e = e.replace(/\n$/, "") + "\n"),
        u
          ? '<pre><code class="language-' +
            S(u) +
            '">' +
            (n ? e : S(e, !0)) +
            "</code></pre>\n"
          : "<pre><code>" + (n ? e : S(e, !0)) + "</code></pre>\n"
      );
    }
    blockquote(e) {
      return `<blockquote>\n${e}</blockquote>\n`;
    }
    html(e, t) {
      return e;
    }
    heading(e, t, n) {
      return `<h${t}>${e}</h${t}>\n`;
    }
    hr() {
      return "<hr>\n";
    }
    list(e, t, n) {
      const r = t ? "ol" : "ul";
      return (
        "<" +
        r +
        (t && 1 !== n ? ' start="' + n + '"' : "") +
        ">\n" +
        e +
        "</" +
        r +
        ">\n"
      );
    }
    listitem(e, t, n) {
      return `<li>${e}</li>\n`;
    }
    checkbox(e) {
      return (
        "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
      );
    }
    paragraph(e) {
      return `<p>${e}</p>\n`;
    }
    table(e, t) {
      return (
        t && (t = `<tbody>${t}</tbody>`),
        "<table>\n<thead>\n" + e + "</thead>\n" + t + "</table>\n"
      );
    }
    tablerow(e) {
      return `<tr>\n${e}</tr>\n`;
    }
    tablecell(e, t) {
      const n = t.header ? "th" : "td";
      return (
        (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>\n`
      );
    }
    strong(e) {
      return `<strong>${e}</strong>`;
    }
    em(e) {
      return `<em>${e}</em>`;
    }
    codespan(e) {
      return `<code>${e}</code>`;
    }
    br() {
      return "<br>";
    }
    del(e) {
      return `<del>${e}</del>`;
    }
    link(e, t, n) {
      const r = O(e);
      if (null === r) return n;
      let u = '<a href="' + (e = r) + '"';
      return t && (u += ' title="' + t + '"'), (u += ">" + n + "</a>"), u;
    }
    image(e, t, n) {
      const r = O(e);
      if (null === r) return n;
      let u = `<img src="${(e = r)}" alt="${n}"`;
      return t && (u += ` title="${t}"`), (u += ">"), u;
    }
    text(e) {
      return e;
    }
  }
  class ye {
    strong(e) {
      return e;
    }
    em(e) {
      return e;
    }
    codespan(e) {
      return e;
    }
    del(e) {
      return e;
    }
    html(e) {
      return e;
    }
    text(e) {
      return e;
    }
    link(e, t, n) {
      return "" + n;
    }
    image(e, t, n) {
      return "" + n;
    }
    br() {
      return "";
    }
  }
  class ve {
    constructor(e) {
      (this.options = void 0),
        (this.renderer = void 0),
        (this.textRenderer = void 0),
        (this.options = e || w),
        (this.options.renderer = this.options.renderer || new Ce()),
        (this.renderer = this.options.renderer),
        (this.renderer.options = this.options),
        (this.textRenderer = new ye());
    }
    static parse(e, t) {
      return new ve(t).parse(e);
    }
    static parseInline(e, t) {
      return new ve(t).parseInline(e);
    }
    parse(e, t = !0) {
      let n = "";
      for (let r = 0; r < e.length; r++) {
        const u = e[r];
        if (
          this.options.extensions &&
          this.options.extensions.renderers &&
          this.options.extensions.renderers[u.type]
        ) {
          const e = u,
            t = this.options.extensions.renderers[e.type].call(
              { parser: this },
              e
            );
          if (
            !1 !== t ||
            ![
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
            ].includes(e.type)
          ) {
            n += t || "";
            continue;
          }
        }
        switch (u.type) {
          case "space":
            continue;
          case "hr":
            n += this.renderer.hr();
            continue;
          case "heading": {
            const e = u;
            n += this.renderer.heading(
              this.parseInline(e.tokens),
              e.depth,
              I(this.parseInline(e.tokens, this.textRenderer))
            );
            continue;
          }
          case "code": {
            const e = u;
            n += this.renderer.code(e.text, e.lang, !!e.escaped);
            continue;
          }
          case "table": {
            const e = u;
            let t = "",
              r = "";
            for (let t = 0; t < e.header.length; t++)
              r += this.renderer.tablecell(
                this.parseInline(e.header[t].tokens),
                { header: !0, align: e.align[t] }
              );
            t += this.renderer.tablerow(r);
            let i = "";
            for (let t = 0; t < e.rows.length; t++) {
              const n = e.rows[t];
              r = "";
              for (let t = 0; t < n.length; t++)
                r += this.renderer.tablecell(this.parseInline(n[t].tokens), {
                  header: !1,
                  align: e.align[t],
                });
              i += this.renderer.tablerow(r);
            }
            n += this.renderer.table(t, i);
            continue;
          }
          case "blockquote": {
            const e = u,
              t = this.parse(e.tokens);
            n += this.renderer.blockquote(t);
            continue;
          }
          case "list": {
            const e = u,
              t = e.ordered,
              r = e.start,
              i = e.loose;
            let s = "";
            for (let t = 0; t < e.items.length; t++) {
              const n = e.items[t],
                r = n.checked,
                u = n.task;
              let o = "";
              if (n.task) {
                const e = this.renderer.checkbox(!!r);
                i
                  ? n.tokens.length > 0 && "paragraph" === n.tokens[0].type
                    ? ((n.tokens[0].text = e + " " + n.tokens[0].text),
                      n.tokens[0].tokens &&
                        n.tokens[0].tokens.length > 0 &&
                        "text" === n.tokens[0].tokens[0].type &&
                        (n.tokens[0].tokens[0].text =
                          e + " " + n.tokens[0].tokens[0].text))
                    : n.tokens.unshift({ type: "text", text: e + " " })
                  : (o += e + " ");
              }
              (o += this.parse(n.tokens, i)),
                (s += this.renderer.listitem(o, u, !!r));
            }
            n += this.renderer.list(s, t, r);
            continue;
          }
          case "html": {
            const e = u;
            n += this.renderer.html(e.text, e.block);
            continue;
          }
          case "paragraph": {
            const e = u;
            n += this.renderer.paragraph(this.parseInline(e.tokens));
            continue;
          }
          case "text": {
            let i = u,
              s = i.tokens ? this.parseInline(i.tokens) : i.text;
            for (; r + 1 < e.length && "text" === e[r + 1].type; )
              (i = e[++r]),
                (s += "\n" + (i.tokens ? this.parseInline(i.tokens) : i.text));
            n += t ? this.renderer.paragraph(s) : s;
            continue;
          }
          default: {
            const e = 'Token with "' + u.type + '" type was not found.';
            if (this.options.silent) return console.error(e), "";
            throw new Error(e);
          }
        }
      }
      return n;
    }
    parseInline(e, t) {
      t = t || this.renderer;
      let n = "";
      for (let r = 0; r < e.length; r++) {
        const u = e[r];
        if (
          this.options.extensions &&
          this.options.extensions.renderers &&
          this.options.extensions.renderers[u.type]
        ) {
          const e = this.options.extensions.renderers[u.type].call(
            { parser: this },
            u
          );
          if (
            !1 !== e ||
            ![
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
            ].includes(u.type)
          ) {
            n += e || "";
            continue;
          }
        }
        switch (u.type) {
          case "escape": {
            const e = u;
            n += t.text(e.text);
            break;
          }
          case "html": {
            const e = u;
            n += t.html(e.text);
            break;
          }
          case "link": {
            const e = u;
            n += t.link(e.href, e.title, this.parseInline(e.tokens, t));
            break;
          }
          case "image": {
            const e = u;
            n += t.image(e.href, e.title, e.text);
            break;
          }
          case "strong": {
            const e = u;
            n += t.strong(this.parseInline(e.tokens, t));
            break;
          }
          case "em": {
            const e = u;
            n += t.em(this.parseInline(e.tokens, t));
            break;
          }
          case "codespan": {
            const e = u;
            n += t.codespan(e.text);
            break;
          }
          case "br":
            n += t.br();
            break;
          case "del": {
            const e = u;
            n += t.del(this.parseInline(e.tokens, t));
            break;
          }
          case "text": {
            const e = u;
            n += t.text(e.text);
            break;
          }
          default: {
            const e = 'Token with "' + u.type + '" type was not found.';
            if (this.options.silent) return console.error(e), "";
            throw new Error(e);
          }
        }
      }
      return n;
    }
  }
  class Te {
    constructor(e) {
      (this.options = void 0), (this.options = e || w);
    }
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
  }
  Te.passThroughHooks = new Set([
    "preprocess",
    "postprocess",
    "processAllTokens",
  ]);
  var $e = F("parseMarkdown"),
    ze = F("onError");
  function Se(e, t) {
    return (n, r) => {
      const u = { ...r },
        i = { ...this.defaults, ...u };
      !0 === this.defaults.async &&
        !1 === u.async &&
        (i.silent ||
          console.warn(
            "marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."
          ),
        (i.async = !0));
      const s = E(this, ze)[ze](!!i.silent, !!i.async);
      if (null == n)
        return s(new Error("marked(): input parameter is undefined or null"));
      if ("string" != typeof n)
        return s(
          new Error(
            "marked(): input parameter is of type " +
              Object.prototype.toString.call(n) +
              ", string expected"
          )
        );
      if ((i.hooks && (i.hooks.options = i), i.async))
        return Promise.resolve(i.hooks ? i.hooks.preprocess(n) : n)
          .then((t) => e(t, i))
          .then((e) => (i.hooks ? i.hooks.processAllTokens(e) : e))
          .then((e) =>
            i.walkTokens
              ? Promise.all(this.walkTokens(e, i.walkTokens)).then(() => e)
              : e
          )
          .then((e) => t(e, i))
          .then((e) => (i.hooks ? i.hooks.postprocess(e) : e))
          .catch(s);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let r = e(n, i);
        i.hooks && (r = i.hooks.processAllTokens(r)),
          i.walkTokens && this.walkTokens(r, i.walkTokens);
        let u = t(r, i);
        return i.hooks && (u = i.hooks.postprocess(u)), u;
      } catch (e) {
        return s(e);
      }
    };
  }
  function Re(e, t) {
    return (n) => {
      if (
        ((n.message +=
          "\nPlease report this to https://github.com/markedjs/marked."),
        e)
      ) {
        const e =
          "<p>An error occurred:</p><pre>" + S(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(e) : e;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
  const Ie = new (class {
    constructor(...e) {
      Object.defineProperty(this, ze, { value: Re }),
        Object.defineProperty(this, $e, { value: Se }),
        (this.defaults = {
          async: !1,
          breaks: !1,
          extensions: null,
          gfm: !0,
          hooks: null,
          pedantic: !1,
          renderer: null,
          silent: !1,
          tokenizer: null,
          walkTokens: null,
        }),
        (this.options = this.setOptions),
        (this.parse = E(this, $e)[$e](Be.lex, ve.parse)),
        (this.parseInline = E(this, $e)[$e](Be.lexInline, ve.parseInline)),
        (this.Parser = ve),
        (this.Renderer = Ce),
        (this.TextRenderer = ye),
        (this.Lexer = Be),
        (this.Tokenizer = M),
        (this.Hooks = Te),
        this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (const u of e)
        switch (((n = n.concat(t.call(this, u))), u.type)) {
          case "table": {
            const e = u;
            for (const r of e.header)
              n = n.concat(this.walkTokens(r.tokens, t));
            for (const r of e.rows)
              for (const e of r) n = n.concat(this.walkTokens(e.tokens, t));
            break;
          }
          case "list": {
            const e = u;
            n = n.concat(this.walkTokens(e.items, t));
            break;
          }
          default: {
            var r;
            const e = u;
            null !== (r = this.defaults.extensions) &&
            void 0 !== r &&
            null !== (r = r.childTokens) &&
            void 0 !== r &&
            r[e.type]
              ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
                  n = n.concat(this.walkTokens(e[r], t));
                })
              : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
          }
        }
      return n;
    }
    use(...e) {
      const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return (
        e.forEach((e) => {
          const n = { ...e };
          if (
            ((n.async = this.defaults.async || n.async || !1),
            e.extensions &&
              (e.extensions.forEach((e) => {
                if (!e.name) throw new Error("extension name required");
                if ("renderer" in e) {
                  const n = t.renderers[e.name];
                  t.renderers[e.name] = n
                    ? function (...t) {
                        let r = e.renderer.apply(this, t);
                        return !1 === r && (r = n.apply(this, t)), r;
                      }
                    : e.renderer;
                }
                if ("tokenizer" in e) {
                  if (!e.level || ("block" !== e.level && "inline" !== e.level))
                    throw new Error(
                      "extension level must be 'block' or 'inline'"
                    );
                  const n = t[e.level];
                  n ? n.unshift(e.tokenizer) : (t[e.level] = [e.tokenizer]),
                    e.start &&
                      ("block" === e.level
                        ? t.startBlock
                          ? t.startBlock.push(e.start)
                          : (t.startBlock = [e.start])
                        : "inline" === e.level &&
                          (t.startInline
                            ? t.startInline.push(e.start)
                            : (t.startInline = [e.start])));
                }
                "childTokens" in e &&
                  e.childTokens &&
                  (t.childTokens[e.name] = e.childTokens);
              }),
              (n.extensions = t)),
            e.renderer)
          ) {
            const t = this.defaults.renderer || new Ce(this.defaults);
            for (const n in e.renderer) {
              if (!(n in t)) throw new Error(`renderer '${n}' does not exist`);
              if ("options" === n) continue;
              const r = n,
                u = e.renderer[r],
                i = t[r];
              t[r] = (...e) => {
                let n = u.apply(t, e);
                return !1 === n && (n = i.apply(t, e)), n || "";
              };
            }
            n.renderer = t;
          }
          if (e.tokenizer) {
            const t = this.defaults.tokenizer || new M(this.defaults);
            for (const n in e.tokenizer) {
              if (!(n in t)) throw new Error(`tokenizer '${n}' does not exist`);
              if (["options", "rules", "lexer"].includes(n)) continue;
              const r = n,
                u = e.tokenizer[r],
                i = t[r];
              t[r] = (...e) => {
                let n = u.apply(t, e);
                return !1 === n && (n = i.apply(t, e)), n;
              };
            }
            n.tokenizer = t;
          }
          if (e.hooks) {
            const t = this.defaults.hooks || new Te();
            for (const n in e.hooks) {
              if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
              if ("options" === n) continue;
              const r = n,
                u = e.hooks[r],
                i = t[r];
              Te.passThroughHooks.has(n)
                ? (t[r] = (e) => {
                    if (this.defaults.async)
                      return Promise.resolve(u.call(t, e)).then((e) =>
                        i.call(t, e)
                      );
                    const n = u.call(t, e);
                    return i.call(t, n);
                  })
                : (t[r] = (...e) => {
                    let n = u.apply(t, e);
                    return !1 === n && (n = i.apply(t, e)), n;
                  });
            }
            n.hooks = t;
          }
          if (e.walkTokens) {
            const t = this.defaults.walkTokens,
              r = e.walkTokens;
            n.walkTokens = function (e) {
              let n = [];
              return (
                n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n
              );
            };
          }
          this.defaults = { ...this.defaults, ...n };
        }),
        this
      );
    }
    setOptions(e) {
      return (this.defaults = { ...this.defaults, ...e }), this;
    }
    lexer(e, t) {
      return Be.lex(e, null != t ? t : this.defaults);
    }
    parser(e, t) {
      return ve.parse(e, null != t ? t : this.defaults);
    }
  })();
  function _e(e, t) {
    return Ie.parse(e, t);
  }
  (_e.options = _e.setOptions =
    function (e) {
      return Ie.setOptions(e), (_e.defaults = Ie.defaults), B(_e.defaults), _e;
    }),
    (_e.getDefaults = D),
    (_e.defaults = w),
    (_e.use = function (...e) {
      return Ie.use(...e), (_e.defaults = Ie.defaults), B(_e.defaults), _e;
    }),
    (_e.walkTokens = function (e, t) {
      return Ie.walkTokens(e, t);
    }),
    (_e.parseInline = Ie.parseInline),
    (_e.Parser = ve),
    (_e.parser = ve.parse),
    (_e.Renderer = Ce),
    (_e.TextRenderer = ye),
    (_e.Lexer = Be),
    (_e.lexer = Be.lex),
    (_e.Tokenizer = M),
    (_e.Hooks = Te),
    (_e.parse = _e);
  _e.options,
    _e.setOptions,
    _e.use,
    _e.walkTokens,
    _e.parseInline,
    ve.parse,
    Be.lex;
  var Le = n(62173);
  let Oe, Pe;
  const je = (e, t, n) => {
    if ("input" === e) {
      if (
        ("type" === t && "checkbox" === n) ||
        "checked" === t ||
        "disabled" === t
      )
        return;
      return "";
    }
  };
  a({
    renderMarkdown: async (e, t, n = {}) => {
      let r;
      return (
        Oe ||
          (Oe = {
            ...(0, Le.getDefaultWhiteList)(),
            input: ["type", "disabled", "checked"],
            "ha-icon": ["icon"],
            "ha-svg-icon": ["path"],
            "ha-alert": ["alert-type", "title"],
            "ha-qr-code": [
              "data",
              "scale",
              "width",
              "margin",
              "error-correction-level",
              "center-image",
            ],
          }),
        n.allowSvg
          ? (Pe ||
              (Pe = {
                ...Oe,
                svg: ["xmlns", "height", "width"],
                path: ["transform", "stroke", "d"],
                img: ["src"],
              }),
            (r = Pe))
          : (r = Oe),
        (0, Le.filterXSS)(await _e(e, t), { whiteList: r, onTagAttr: je })
      );
    },
  });
})();
//# sourceMappingURL=markdown-worker.LVduE3RJE7c.js.map
