function t(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e &&
      (o = o.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })),
      n.push.apply(n, o);
  }
  return n;
}
function e(e) {
  for (var n = 1; n < arguments.length; n++) {
    var i = null != arguments[n] ? arguments[n] : {};
    n % 2
      ? t(Object(i), !0).forEach(function (t) {
          o(e, t, i[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i))
      : t(Object(i)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t));
        });
  }
  return e;
}
function n(t) {
  return (
    (n =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    n(t)
  );
}
function o(t, e, n) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  );
}
function i() {
  return (
    (i =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var o in n)
            Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
        }
        return t;
      }),
    i.apply(this, arguments)
  );
}
function r(t, e) {
  if (null == t) return {};
  var n,
    o,
    i = (function (t, e) {
      if (null == t) return {};
      var n,
        o,
        i = {},
        r = Object.keys(t);
      for (o = 0; o < r.length; o++)
        (n = r[o]), e.indexOf(n) >= 0 || (i[n] = t[n]);
      return i;
    })(t, e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    for (o = 0; o < r.length; o++)
      (n = r[o]),
        e.indexOf(n) >= 0 ||
          (Object.prototype.propertyIsEnumerable.call(t, n) && (i[n] = t[n]));
  }
  return i;
}
function a(t) {
  if ("undefined" != typeof window && window.navigator)
    return !!navigator.userAgent.match(t);
}
var l = a(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),
  s = a(/Edge/i),
  c = a(/firefox/i),
  u = a(/safari/i) && !a(/chrome/i) && !a(/android/i),
  d = a(/iP(ad|od|hone)/i),
  h = a(/chrome/i) && a(/android/i),
  f = { capture: !1, passive: !1 };
function p(t, e, n) {
  t.addEventListener(e, n, !l && f);
}
function g(t, e, n) {
  t.removeEventListener(e, n, !l && f);
}
function v(t, e) {
  if (e) {
    if ((">" === e[0] && (e = e.substring(1)), t))
      try {
        if (t.matches) return t.matches(e);
        if (t.msMatchesSelector) return t.msMatchesSelector(e);
        if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
      } catch (t) {
        return !1;
      }
    return !1;
  }
}
function m(t) {
  return t.host && t !== document && t.host.nodeType ? t.host : t.parentNode;
}
function b(t, e, n, o) {
  if (t) {
    n = n || document;
    do {
      if (
        (null != e &&
          (">" === e[0] ? t.parentNode === n && v(t, e) : v(t, e))) ||
        (o && t === n)
      )
        return t;
      if (t === n) break;
    } while ((t = m(t)));
  }
  return null;
}
var y,
  w = /\s+/g;
function E(t, e, n) {
  if (t && e)
    if (t.classList) t.classList[n ? "add" : "remove"](e);
    else {
      var o = (" " + t.className + " ")
        .replace(w, " ")
        .replace(" " + e + " ", " ");
      t.className = (o + (n ? " " + e : "")).replace(w, " ");
    }
}
function S(t, e, n) {
  var o = t && t.style;
  if (o) {
    if (void 0 === n)
      return (
        document.defaultView && document.defaultView.getComputedStyle
          ? (n = document.defaultView.getComputedStyle(t, ""))
          : t.currentStyle && (n = t.currentStyle),
        void 0 === e ? n : n[e]
      );
    e in o || -1 !== e.indexOf("webkit") || (e = "-webkit-" + e),
      (o[e] = n + ("string" == typeof n ? "" : "px"));
  }
}
function D(t, e) {
  var n = "";
  if ("string" == typeof t) n = t;
  else
    do {
      var o = S(t, "transform");
      o && "none" !== o && (n = o + " " + n);
    } while (!e && (t = t.parentNode));
  var i =
    window.DOMMatrix ||
    window.WebKitCSSMatrix ||
    window.CSSMatrix ||
    window.MSCSSMatrix;
  return i && new i(n);
}
function _(t, e, n) {
  if (t) {
    var o = t.getElementsByTagName(e),
      i = 0,
      r = o.length;
    if (n) for (; i < r; i++) n(o[i], i);
    return o;
  }
  return [];
}
function T() {
  var t = document.scrollingElement;
  return t || document.documentElement;
}
function C(t, e, n, o, i) {
  if (t.getBoundingClientRect || t === window) {
    var r, a, s, c, u, d, h;
    if (
      (t !== window && t.parentNode && t !== T()
        ? ((a = (r = t.getBoundingClientRect()).top),
          (s = r.left),
          (c = r.bottom),
          (u = r.right),
          (d = r.height),
          (h = r.width))
        : ((a = 0),
          (s = 0),
          (c = window.innerHeight),
          (u = window.innerWidth),
          (d = window.innerHeight),
          (h = window.innerWidth)),
      (e || n) && t !== window && ((i = i || t.parentNode), !l))
    )
      do {
        if (
          i &&
          i.getBoundingClientRect &&
          ("none" !== S(i, "transform") || (n && "static" !== S(i, "position")))
        ) {
          var f = i.getBoundingClientRect();
          (a -= f.top + parseInt(S(i, "border-top-width"))),
            (s -= f.left + parseInt(S(i, "border-left-width"))),
            (c = a + r.height),
            (u = s + r.width);
          break;
        }
      } while ((i = i.parentNode));
    if (o && t !== window) {
      var p = D(i || t),
        g = p && p.a,
        v = p && p.d;
      p && ((c = (a /= v) + (d /= v)), (u = (s /= g) + (h /= g)));
    }
    return { top: a, left: s, bottom: c, right: u, width: h, height: d };
  }
}
function O(t, e, n) {
  for (var o = I(t, !0), i = C(t)[e]; o; ) {
    var r = C(o)[n];
    if (!("top" === n || "left" === n ? i >= r : i <= r)) return o;
    if (o === T()) break;
    o = I(o, !1);
  }
  return !1;
}
function x(t, e, n, o) {
  for (var i = 0, r = 0, a = t.children; r < a.length; ) {
    if (
      "none" !== a[r].style.display &&
      a[r] !== Xt.ghost &&
      (o || a[r] !== Xt.dragged) &&
      b(a[r], n.draggable, t, !1)
    ) {
      if (i === e) return a[r];
      i++;
    }
    r++;
  }
  return null;
}
function N(t, e) {
  for (
    var n = t.lastElementChild;
    n && (n === Xt.ghost || "none" === S(n, "display") || (e && !v(n, e)));

  )
    n = n.previousElementSibling;
  return n || null;
}
function M(t, e) {
  var n = 0;
  if (!t || !t.parentNode) return -1;
  for (; (t = t.previousElementSibling); )
    "TEMPLATE" === t.nodeName.toUpperCase() ||
      t === Xt.clone ||
      (e && !v(t, e)) ||
      n++;
  return n;
}
function A(t) {
  var e = 0,
    n = 0,
    o = T();
  if (t)
    do {
      var i = D(t),
        r = i.a,
        a = i.d;
      (e += t.scrollLeft * r), (n += t.scrollTop * a);
    } while (t !== o && (t = t.parentNode));
  return [e, n];
}
function I(t, e) {
  if (!t || !t.getBoundingClientRect) return T();
  var n = t,
    o = !1;
  do {
    if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
      var i = S(n);
      if (
        (n.clientWidth < n.scrollWidth &&
          ("auto" == i.overflowX || "scroll" == i.overflowX)) ||
        (n.clientHeight < n.scrollHeight &&
          ("auto" == i.overflowY || "scroll" == i.overflowY))
      ) {
        if (!n.getBoundingClientRect || n === document.body) return T();
        if (o || e) return n;
        o = !0;
      }
    }
  } while ((n = n.parentNode));
  return T();
}
function P(t, e) {
  return (
    Math.round(t.top) === Math.round(e.top) &&
    Math.round(t.left) === Math.round(e.left) &&
    Math.round(t.height) === Math.round(e.height) &&
    Math.round(t.width) === Math.round(e.width)
  );
}
function k(t, e) {
  return function () {
    if (!y) {
      var n = arguments,
        o = this;
      1 === n.length ? t.call(o, n[0]) : t.apply(o, n),
        (y = setTimeout(function () {
          y = void 0;
        }, e));
    }
  };
}
function X(t, e, n) {
  (t.scrollLeft += e), (t.scrollTop += n);
}
function Y(t) {
  var e = window.Polymer,
    n = window.jQuery || window.Zepto;
  return e && e.dom
    ? e.dom(t).cloneNode(!0)
    : n
    ? n(t).clone(!0)[0]
    : t.cloneNode(!0);
}
var R = "Sortable" + new Date().getTime();
function B() {
  var t,
    n = [];
  return {
    captureAnimationState: function () {
      ((n = []), this.options.animation) &&
        [].slice.call(this.el.children).forEach(function (t) {
          if ("none" !== S(t, "display") && t !== Xt.ghost) {
            n.push({ target: t, rect: C(t) });
            var o = e({}, n[n.length - 1].rect);
            if (t.thisAnimationDuration) {
              var i = D(t, !0);
              i && ((o.top -= i.f), (o.left -= i.e));
            }
            t.fromRect = o;
          }
        });
    },
    addAnimationState: function (t) {
      n.push(t);
    },
    removeAnimationState: function (t) {
      n.splice(
        (function (t, e) {
          for (var n in t)
            if (t.hasOwnProperty(n))
              for (var o in e)
                if (e.hasOwnProperty(o) && e[o] === t[n][o]) return Number(n);
          return -1;
        })(n, { target: t }),
        1
      );
    },
    animateAll: function (e) {
      var o = this;
      if (!this.options.animation)
        return clearTimeout(t), void ("function" == typeof e && e());
      var i = !1,
        r = 0;
      n.forEach(function (t) {
        var e = 0,
          n = t.target,
          a = n.fromRect,
          l = C(n),
          s = n.prevFromRect,
          c = n.prevToRect,
          u = t.rect,
          d = D(n, !0);
        d && ((l.top -= d.f), (l.left -= d.e)),
          (n.toRect = l),
          n.thisAnimationDuration &&
            P(s, l) &&
            !P(a, l) &&
            (u.top - l.top) / (u.left - l.left) ==
              (a.top - l.top) / (a.left - l.left) &&
            (e = (function (t, e, n, o) {
              return (
                (Math.sqrt(
                  Math.pow(e.top - t.top, 2) + Math.pow(e.left - t.left, 2)
                ) /
                  Math.sqrt(
                    Math.pow(e.top - n.top, 2) + Math.pow(e.left - n.left, 2)
                  )) *
                o.animation
              );
            })(u, s, c, o.options)),
          P(l, a) ||
            ((n.prevFromRect = a),
            (n.prevToRect = l),
            e || (e = o.options.animation),
            o.animate(n, u, l, e)),
          e &&
            ((i = !0),
            (r = Math.max(r, e)),
            clearTimeout(n.animationResetTimer),
            (n.animationResetTimer = setTimeout(function () {
              (n.animationTime = 0),
                (n.prevFromRect = null),
                (n.fromRect = null),
                (n.prevToRect = null),
                (n.thisAnimationDuration = null);
            }, e)),
            (n.thisAnimationDuration = e));
      }),
        clearTimeout(t),
        i
          ? (t = setTimeout(function () {
              "function" == typeof e && e();
            }, r))
          : "function" == typeof e && e(),
        (n = []);
    },
    animate: function (t, e, n, o) {
      if (o) {
        S(t, "transition", ""), S(t, "transform", "");
        var i = D(this.el),
          r = i && i.a,
          a = i && i.d,
          l = (e.left - n.left) / (r || 1),
          s = (e.top - n.top) / (a || 1);
        (t.animatingX = !!l),
          (t.animatingY = !!s),
          S(t, "transform", "translate3d(" + l + "px," + s + "px,0)"),
          (this.forRepaintDummy = (function (t) {
            return t.offsetWidth;
          })(t)),
          S(
            t,
            "transition",
            "transform " +
              o +
              "ms" +
              (this.options.easing ? " " + this.options.easing : "")
          ),
          S(t, "transform", "translate3d(0,0,0)"),
          "number" == typeof t.animated && clearTimeout(t.animated),
          (t.animated = setTimeout(function () {
            S(t, "transition", ""),
              S(t, "transform", ""),
              (t.animated = !1),
              (t.animatingX = !1),
              (t.animatingY = !1);
          }, o));
      }
    },
  };
}
var F = [],
  j = { initializeByDefault: !0 },
  H = {
    mount: function (t) {
      for (var e in j) j.hasOwnProperty(e) && !(e in t) && (t[e] = j[e]);
      F.forEach(function (e) {
        if (e.pluginName === t.pluginName)
          throw "Sortable: Cannot mount plugin ".concat(
            t.pluginName,
            " more than once"
          );
      }),
        F.push(t);
    },
    pluginEvent: function (t, n, o) {
      var i = this;
      (this.eventCanceled = !1),
        (o.cancel = function () {
          i.eventCanceled = !0;
        });
      var r = t + "Global";
      F.forEach(function (i) {
        n[i.pluginName] &&
          (n[i.pluginName][r] && n[i.pluginName][r](e({ sortable: n }, o)),
          n.options[i.pluginName] &&
            n[i.pluginName][t] &&
            n[i.pluginName][t](e({ sortable: n }, o)));
      });
    },
    initializePlugins: function (t, e, n, o) {
      for (var r in (F.forEach(function (o) {
        var r = o.pluginName;
        if (t.options[r] || o.initializeByDefault) {
          var a = new o(t, e, t.options);
          (a.sortable = t),
            (a.options = t.options),
            (t[r] = a),
            i(n, a.defaults);
        }
      }),
      t.options))
        if (t.options.hasOwnProperty(r)) {
          var a = this.modifyOption(t, r, t.options[r]);
          void 0 !== a && (t.options[r] = a);
        }
    },
    getEventProperties: function (t, e) {
      var n = {};
      return (
        F.forEach(function (o) {
          "function" == typeof o.eventProperties &&
            i(n, o.eventProperties.call(e[o.pluginName], t));
        }),
        n
      );
    },
    modifyOption: function (t, e, n) {
      var o;
      return (
        F.forEach(function (i) {
          t[i.pluginName] &&
            i.optionListeners &&
            "function" == typeof i.optionListeners[e] &&
            (o = i.optionListeners[e].call(t[i.pluginName], n));
        }),
        o
      );
    },
  };
var L = ["evt"],
  W = function (t, n) {
    var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      i = o.evt,
      a = r(o, L);
    H.pluginEvent.bind(Xt)(
      t,
      n,
      e(
        {
          dragEl: G,
          parentEl: U,
          ghostEl: V,
          rootEl: q,
          nextEl: Z,
          lastDownEl: K,
          cloneEl: Q,
          cloneHidden: $,
          dragStarted: dt,
          putSortable: it,
          activeSortable: Xt.active,
          originalEvent: i,
          oldIndex: J,
          oldDraggableIndex: et,
          newIndex: tt,
          newDraggableIndex: nt,
          hideGhostForTarget: At,
          unhideGhostForTarget: It,
          cloneNowHidden: function () {
            $ = !0;
          },
          cloneNowShown: function () {
            $ = !1;
          },
          dispatchSortableEvent: function (t) {
            z({ sortable: n, name: t, originalEvent: i });
          },
        },
        a
      )
    );
  };
function z(t) {
  !(function (t) {
    var n = t.sortable,
      o = t.rootEl,
      i = t.name,
      r = t.targetEl,
      a = t.cloneEl,
      c = t.toEl,
      u = t.fromEl,
      d = t.oldIndex,
      h = t.newIndex,
      f = t.oldDraggableIndex,
      p = t.newDraggableIndex,
      g = t.originalEvent,
      v = t.putSortable,
      m = t.extraEventProperties;
    if ((n = n || (o && o[R]))) {
      var b,
        y = n.options,
        w = "on" + i.charAt(0).toUpperCase() + i.substr(1);
      !window.CustomEvent || l || s
        ? (b = document.createEvent("Event")).initEvent(i, !0, !0)
        : (b = new CustomEvent(i, { bubbles: !0, cancelable: !0 })),
        (b.to = c || o),
        (b.from = u || o),
        (b.item = r || o),
        (b.clone = a),
        (b.oldIndex = d),
        (b.newIndex = h),
        (b.oldDraggableIndex = f),
        (b.newDraggableIndex = p),
        (b.originalEvent = g),
        (b.pullMode = v ? v.lastPutMode : void 0);
      var E = e(e({}, m), H.getEventProperties(i, n));
      for (var S in E) b[S] = E[S];
      o && o.dispatchEvent(b), y[w] && y[w].call(n, b);
    }
  })(
    e(
      {
        putSortable: it,
        cloneEl: Q,
        targetEl: G,
        rootEl: q,
        oldIndex: J,
        oldDraggableIndex: et,
        newIndex: tt,
        newDraggableIndex: nt,
      },
      t
    )
  );
}
var G,
  U,
  V,
  q,
  Z,
  K,
  Q,
  $,
  J,
  tt,
  et,
  nt,
  ot,
  it,
  rt,
  at,
  lt,
  st,
  ct,
  ut,
  dt,
  ht,
  ft,
  pt,
  gt,
  vt = !1,
  mt = !1,
  bt = [],
  yt = !1,
  wt = !1,
  Et = [],
  St = !1,
  Dt = [],
  _t = "undefined" != typeof document,
  Tt = d,
  Ct = s || l ? "cssFloat" : "float",
  Ot = _t && !h && !d && "draggable" in document.createElement("div"),
  xt = (function () {
    if (_t) {
      if (l) return !1;
      var t = document.createElement("x");
      return (
        (t.style.cssText = "pointer-events:auto"),
        "auto" === t.style.pointerEvents
      );
    }
  })(),
  Nt = function (t, e) {
    var n = S(t),
      o =
        parseInt(n.width) -
        parseInt(n.paddingLeft) -
        parseInt(n.paddingRight) -
        parseInt(n.borderLeftWidth) -
        parseInt(n.borderRightWidth),
      i = x(t, 0, e),
      r = x(t, 1, e),
      a = i && S(i),
      l = r && S(r),
      s = a && parseInt(a.marginLeft) + parseInt(a.marginRight) + C(i).width,
      c = l && parseInt(l.marginLeft) + parseInt(l.marginRight) + C(r).width;
    if ("flex" === n.display)
      return "column" === n.flexDirection ||
        "column-reverse" === n.flexDirection
        ? "vertical"
        : "horizontal";
    if ("grid" === n.display)
      return n.gridTemplateColumns.split(" ").length <= 1
        ? "vertical"
        : "horizontal";
    if (i && a.float && "none" !== a.float) {
      var u = "left" === a.float ? "left" : "right";
      return !r || ("both" !== l.clear && l.clear !== u)
        ? "horizontal"
        : "vertical";
    }
    return i &&
      ("block" === a.display ||
        "flex" === a.display ||
        "table" === a.display ||
        "grid" === a.display ||
        (s >= o && "none" === n[Ct]) ||
        (r && "none" === n[Ct] && s + c > o))
      ? "vertical"
      : "horizontal";
  },
  Mt = function (t) {
    function e(t, n) {
      return function (o, i, r, a) {
        var l =
          o.options.group.name &&
          i.options.group.name &&
          o.options.group.name === i.options.group.name;
        if (null == t && (n || l)) return !0;
        if (null == t || !1 === t) return !1;
        if (n && "clone" === t) return t;
        if ("function" == typeof t) return e(t(o, i, r, a), n)(o, i, r, a);
        var s = (n ? o : i).options.group.name;
        return (
          !0 === t ||
          ("string" == typeof t && t === s) ||
          (t.join && t.indexOf(s) > -1)
        );
      };
    }
    var o = {},
      i = t.group;
    (i && "object" == n(i)) || (i = { name: i }),
      (o.name = i.name),
      (o.checkPull = e(i.pull, !0)),
      (o.checkPut = e(i.put)),
      (o.revertClone = i.revertClone),
      (t.group = o);
  },
  At = function () {
    !xt && V && S(V, "display", "none");
  },
  It = function () {
    !xt && V && S(V, "display", "");
  };
_t &&
  !h &&
  document.addEventListener(
    "click",
    function (t) {
      if (mt)
        return (
          t.preventDefault(),
          t.stopPropagation && t.stopPropagation(),
          t.stopImmediatePropagation && t.stopImmediatePropagation(),
          (mt = !1),
          !1
        );
    },
    !0
  );
var Pt = function (t) {
    if (G) {
      t = t.touches ? t.touches[0] : t;
      var e =
        ((i = t.clientX),
        (r = t.clientY),
        bt.some(function (t) {
          var e = t[R].options.emptyInsertThreshold;
          if (e && !N(t)) {
            var n = C(t),
              o = i >= n.left - e && i <= n.right + e,
              l = r >= n.top - e && r <= n.bottom + e;
            return o && l ? (a = t) : void 0;
          }
        }),
        a);
      if (e) {
        var n = {};
        for (var o in t) t.hasOwnProperty(o) && (n[o] = t[o]);
        (n.target = n.rootEl = e),
          (n.preventDefault = void 0),
          (n.stopPropagation = void 0),
          e[R]._onDragOver(n);
      }
    }
    var i, r, a;
  },
  kt = function (t) {
    G && G.parentNode[R]._isOutsideThisEl(t.target);
  };
function Xt(t, e) {
  if (!t || !t.nodeType || 1 !== t.nodeType)
    throw "Sortable: `el` must be an HTMLElement, not ".concat(
      {}.toString.call(t)
    );
  (this.el = t), (this.options = e = i({}, e)), (t[R] = this);
  var n = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(t.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    invertSwap: !1,
    invertedSwapThreshold: null,
    removeCloneOnHide: !0,
    direction: function () {
      return Nt(t, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function (t, e) {
      t.setData("Text", e.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold:
      (Number.parseInt ? Number : window).parseInt(
        window.devicePixelRatio,
        10
      ) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: { x: 0, y: 0 },
    supportPointer: !1 !== Xt.supportPointer && "PointerEvent" in window && !u,
    emptyInsertThreshold: 5,
  };
  for (var o in (H.initializePlugins(this, t, n), n))
    !(o in e) && (e[o] = n[o]);
  for (var r in (Mt(e), this))
    "_" === r.charAt(0) &&
      "function" == typeof this[r] &&
      (this[r] = this[r].bind(this));
  (this.nativeDraggable = !e.forceFallback && Ot),
    this.nativeDraggable && (this.options.touchStartThreshold = 1),
    e.supportPointer
      ? p(t, "pointerdown", this._onTapStart)
      : (p(t, "mousedown", this._onTapStart),
        p(t, "touchstart", this._onTapStart)),
    this.nativeDraggable && (p(t, "dragover", this), p(t, "dragenter", this)),
    bt.push(this.el),
    e.store && e.store.get && this.sort(e.store.get(this) || []),
    i(this, B());
}
function Yt(t, e, n, o, i, r, a, c) {
  var u,
    d,
    h = t[R],
    f = h.options.onMove;
  return (
    !window.CustomEvent || l || s
      ? (u = document.createEvent("Event")).initEvent("move", !0, !0)
      : (u = new CustomEvent("move", { bubbles: !0, cancelable: !0 })),
    (u.to = e),
    (u.from = t),
    (u.dragged = n),
    (u.draggedRect = o),
    (u.related = i || e),
    (u.relatedRect = r || C(e)),
    (u.willInsertAfter = c),
    (u.originalEvent = a),
    t.dispatchEvent(u),
    f && (d = f.call(h, u, a)),
    d
  );
}
function Rt(t) {
  t.draggable = !1;
}
function Bt() {
  St = !1;
}
function Ft(t) {
  for (
    var e = t.tagName + t.className + t.src + t.href + t.textContent,
      n = e.length,
      o = 0;
    n--;

  )
    o += e.charCodeAt(n);
  return o.toString(36);
}
function jt(t) {
  return setTimeout(t, 0);
}
function Ht(t) {
  return clearTimeout(t);
}
(Xt.prototype = {
  constructor: Xt,
  _isOutsideThisEl: function (t) {
    this.el.contains(t) || t === this.el || (ht = null);
  },
  _getDirection: function (t, e) {
    return "function" == typeof this.options.direction
      ? this.options.direction.call(this, t, e, G)
      : this.options.direction;
  },
  _onTapStart: function (t) {
    if (t.cancelable) {
      var e = this,
        n = this.el,
        o = this.options,
        i = o.preventOnFilter,
        r = t.type,
        a =
          (t.touches && t.touches[0]) ||
          (t.pointerType && "touch" === t.pointerType && t),
        l = (a || t).target,
        s =
          (t.target.shadowRoot &&
            ((t.path && t.path[0]) ||
              (t.composedPath && t.composedPath()[0]))) ||
          l,
        c = o.filter;
      if (
        ((function (t) {
          Dt.length = 0;
          var e = t.getElementsByTagName("input"),
            n = e.length;
          for (; n--; ) {
            var o = e[n];
            o.checked && Dt.push(o);
          }
        })(n),
        !G &&
          !(
            (/mousedown|pointerdown/.test(r) && 0 !== t.button) ||
            o.disabled
          ) &&
          !s.isContentEditable &&
          (this.nativeDraggable ||
            !u ||
            !l ||
            "SELECT" !== l.tagName.toUpperCase()) &&
          !(((l = b(l, o.draggable, n, !1)) && l.animated) || K === l))
      ) {
        if (((J = M(l)), (et = M(l, o.draggable)), "function" == typeof c)) {
          if (c.call(this, t, l, this))
            return (
              z({
                sortable: e,
                rootEl: s,
                name: "filter",
                targetEl: l,
                toEl: n,
                fromEl: n,
              }),
              W("filter", e, { evt: t }),
              void (i && t.cancelable && t.preventDefault())
            );
        } else if (
          c &&
          (c = c.split(",").some(function (o) {
            if ((o = b(s, o.trim(), n, !1)))
              return (
                z({
                  sortable: e,
                  rootEl: o,
                  name: "filter",
                  targetEl: l,
                  fromEl: n,
                  toEl: n,
                }),
                W("filter", e, { evt: t }),
                !0
              );
          }))
        )
          return void (i && t.cancelable && t.preventDefault());
        (o.handle && !b(s, o.handle, n, !1)) || this._prepareDragStart(t, a, l);
      }
    }
  },
  _prepareDragStart: function (t, e, n) {
    var o,
      i = this,
      r = i.el,
      a = i.options,
      u = r.ownerDocument;
    if (n && !G && n.parentNode === r) {
      var d = C(n);
      if (
        ((q = r),
        (U = (G = n).parentNode),
        (Z = G.nextSibling),
        (K = n),
        (ot = a.group),
        (Xt.dragged = G),
        (rt = {
          target: G,
          clientX: (e || t).clientX,
          clientY: (e || t).clientY,
        }),
        (ct = rt.clientX - d.left),
        (ut = rt.clientY - d.top),
        (this._lastX = (e || t).clientX),
        (this._lastY = (e || t).clientY),
        (G.style["will-change"] = "all"),
        (o = function () {
          W("delayEnded", i, { evt: t }),
            Xt.eventCanceled
              ? i._onDrop()
              : (i._disableDelayedDragEvents(),
                !c && i.nativeDraggable && (G.draggable = !0),
                i._triggerDragStart(t, e),
                z({ sortable: i, name: "choose", originalEvent: t }),
                E(G, a.chosenClass, !0));
        }),
        a.ignore.split(",").forEach(function (t) {
          _(G, t.trim(), Rt);
        }),
        p(u, "dragover", Pt),
        p(u, "mousemove", Pt),
        p(u, "touchmove", Pt),
        p(u, "mouseup", i._onDrop),
        p(u, "touchend", i._onDrop),
        p(u, "touchcancel", i._onDrop),
        c &&
          this.nativeDraggable &&
          ((this.options.touchStartThreshold = 4), (G.draggable = !0)),
        W("delayStart", this, { evt: t }),
        !a.delay ||
          (a.delayOnTouchOnly && !e) ||
          (this.nativeDraggable && (s || l)))
      )
        o();
      else {
        if (Xt.eventCanceled) return void this._onDrop();
        p(u, "mouseup", i._disableDelayedDrag),
          p(u, "touchend", i._disableDelayedDrag),
          p(u, "touchcancel", i._disableDelayedDrag),
          p(u, "mousemove", i._delayedDragTouchMoveHandler),
          p(u, "touchmove", i._delayedDragTouchMoveHandler),
          a.supportPointer &&
            p(u, "pointermove", i._delayedDragTouchMoveHandler),
          (i._dragStartTimer = setTimeout(o, a.delay));
      }
    }
  },
  _delayedDragTouchMoveHandler: function (t) {
    var e = t.touches ? t.touches[0] : t;
    Math.max(
      Math.abs(e.clientX - this._lastX),
      Math.abs(e.clientY - this._lastY)
    ) >=
      Math.floor(
        this.options.touchStartThreshold /
          ((this.nativeDraggable && window.devicePixelRatio) || 1)
      ) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function () {
    G && Rt(G),
      clearTimeout(this._dragStartTimer),
      this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function () {
    var t = this.el.ownerDocument;
    g(t, "mouseup", this._disableDelayedDrag),
      g(t, "touchend", this._disableDelayedDrag),
      g(t, "touchcancel", this._disableDelayedDrag),
      g(t, "mousemove", this._delayedDragTouchMoveHandler),
      g(t, "touchmove", this._delayedDragTouchMoveHandler),
      g(t, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function (t, e) {
    (e = e || ("touch" == t.pointerType && t)),
      !this.nativeDraggable || e
        ? this.options.supportPointer
          ? p(document, "pointermove", this._onTouchMove)
          : p(document, e ? "touchmove" : "mousemove", this._onTouchMove)
        : (p(G, "dragend", this), p(q, "dragstart", this._onDragStart));
    try {
      document.selection
        ? jt(function () {
            document.selection.empty();
          })
        : window.getSelection().removeAllRanges();
    } catch (t) {}
  },
  _dragStarted: function (t, e) {
    if (((vt = !1), q && G)) {
      W("dragStarted", this, { evt: e }),
        this.nativeDraggable && p(document, "dragover", kt);
      var n = this.options;
      !t && E(G, n.dragClass, !1),
        E(G, n.ghostClass, !0),
        (Xt.active = this),
        t && this._appendGhost(),
        z({ sortable: this, name: "start", originalEvent: e });
    } else this._nulling();
  },
  _emulateDragOver: function () {
    if (at) {
      (this._lastX = at.clientX), (this._lastY = at.clientY), At();
      for (
        var t = document.elementFromPoint(at.clientX, at.clientY), e = t;
        t &&
        t.shadowRoot &&
        (t = t.shadowRoot.elementFromPoint(at.clientX, at.clientY)) !== e;

      )
        e = t;
      if ((G.parentNode[R]._isOutsideThisEl(t), e))
        do {
          if (e[R]) {
            if (
              e[R]._onDragOver({
                clientX: at.clientX,
                clientY: at.clientY,
                target: t,
                rootEl: e,
              }) &&
              !this.options.dragoverBubble
            )
              break;
          }
          t = e;
        } while ((e = e.parentNode));
      It();
    }
  },
  _onTouchMove: function (t) {
    if (rt) {
      var e = this.options,
        n = e.fallbackTolerance,
        o = e.fallbackOffset,
        i = t.touches ? t.touches[0] : t,
        r = V && D(V, !0),
        a = V && r && r.a,
        l = V && r && r.d,
        s = Tt && gt && A(gt),
        c =
          (i.clientX - rt.clientX + o.x) / (a || 1) +
          (s ? s[0] - Et[0] : 0) / (a || 1),
        u =
          (i.clientY - rt.clientY + o.y) / (l || 1) +
          (s ? s[1] - Et[1] : 0) / (l || 1);
      if (!Xt.active && !vt) {
        if (
          n &&
          Math.max(
            Math.abs(i.clientX - this._lastX),
            Math.abs(i.clientY - this._lastY)
          ) < n
        )
          return;
        this._onDragStart(t, !0);
      }
      if (V) {
        r
          ? ((r.e += c - (lt || 0)), (r.f += u - (st || 0)))
          : (r = { a: 1, b: 0, c: 0, d: 1, e: c, f: u });
        var d = "matrix("
          .concat(r.a, ",")
          .concat(r.b, ",")
          .concat(r.c, ",")
          .concat(r.d, ",")
          .concat(r.e, ",")
          .concat(r.f, ")");
        S(V, "webkitTransform", d),
          S(V, "mozTransform", d),
          S(V, "msTransform", d),
          S(V, "transform", d),
          (lt = c),
          (st = u),
          (at = i);
      }
      t.cancelable && t.preventDefault();
    }
  },
  _appendGhost: function () {
    if (!V) {
      var t = this.options.fallbackOnBody ? document.body : q,
        e = C(G, !0, Tt, !0, t),
        n = this.options;
      if (Tt) {
        for (
          gt = t;
          "static" === S(gt, "position") &&
          "none" === S(gt, "transform") &&
          gt !== document;

        )
          gt = gt.parentNode;
        gt !== document.body && gt !== document.documentElement
          ? (gt === document && (gt = T()),
            (e.top += gt.scrollTop),
            (e.left += gt.scrollLeft))
          : (gt = T()),
          (Et = A(gt));
      }
      E((V = G.cloneNode(!0)), n.ghostClass, !1),
        E(V, n.fallbackClass, !0),
        E(V, n.dragClass, !0),
        S(V, "transition", ""),
        S(V, "transform", ""),
        S(V, "box-sizing", "border-box"),
        S(V, "margin", 0),
        S(V, "top", e.top),
        S(V, "left", e.left),
        S(V, "width", e.width),
        S(V, "height", e.height),
        S(V, "opacity", "0.8"),
        S(V, "position", Tt ? "absolute" : "fixed"),
        S(V, "zIndex", "100000"),
        S(V, "pointerEvents", "none"),
        (Xt.ghost = V),
        t.appendChild(V),
        S(
          V,
          "transform-origin",
          (ct / parseInt(V.style.width)) * 100 +
            "% " +
            (ut / parseInt(V.style.height)) * 100 +
            "%"
        );
    }
  },
  _onDragStart: function (t, e) {
    var n = this,
      o = t.dataTransfer,
      i = n.options;
    W("dragStart", this, { evt: t }),
      Xt.eventCanceled
        ? this._onDrop()
        : (W("setupClone", this),
          Xt.eventCanceled ||
            ((Q = Y(G)).removeAttribute("id"),
            (Q.draggable = !1),
            (Q.style["will-change"] = ""),
            this._hideClone(),
            E(Q, this.options.chosenClass, !1),
            (Xt.clone = Q)),
          (n.cloneId = jt(function () {
            W("clone", n),
              Xt.eventCanceled ||
                (n.options.removeCloneOnHide || q.insertBefore(Q, G),
                n._hideClone(),
                z({ sortable: n, name: "clone" }));
          })),
          !e && E(G, i.dragClass, !0),
          e
            ? ((mt = !0), (n._loopId = setInterval(n._emulateDragOver, 50)))
            : (g(document, "mouseup", n._onDrop),
              g(document, "touchend", n._onDrop),
              g(document, "touchcancel", n._onDrop),
              o &&
                ((o.effectAllowed = "move"),
                i.setData && i.setData.call(n, o, G)),
              p(document, "drop", n),
              S(G, "transform", "translateZ(0)")),
          (vt = !0),
          (n._dragStartId = jt(n._dragStarted.bind(n, e, t))),
          p(document, "selectstart", n),
          (dt = !0),
          u && S(document.body, "user-select", "none"));
  },
  _onDragOver: function (t) {
    var n,
      o,
      i,
      r,
      a = this.el,
      l = t.target,
      s = this.options,
      c = s.group,
      u = Xt.active,
      d = ot === c,
      h = s.sort,
      f = it || u,
      p = this,
      g = !1;
    if (!St) {
      if (
        (void 0 !== t.preventDefault && t.cancelable && t.preventDefault(),
        (l = b(l, s.draggable, a, !0)),
        j("dragOver"),
        Xt.eventCanceled)
      )
        return g;
      if (
        G.contains(t.target) ||
        (l.animated && l.animatingX && l.animatingY) ||
        p._ignoreWhileAnimating === l
      )
        return L(!1);
      if (
        ((mt = !1),
        u &&
          !s.disabled &&
          (d
            ? h || (i = U !== q)
            : it === this ||
              ((this.lastPutMode = ot.checkPull(this, u, G, t)) &&
                c.checkPut(this, u, G, t))))
      ) {
        if (
          ((r = "vertical" === this._getDirection(t, l)),
          (n = C(G)),
          j("dragOverValid"),
          Xt.eventCanceled)
        )
          return g;
        if (i)
          return (
            (U = q),
            H(),
            this._hideClone(),
            j("revert"),
            Xt.eventCanceled || (Z ? q.insertBefore(G, Z) : q.appendChild(G)),
            L(!0)
          );
        var v = N(a, s.draggable);
        if (
          !v ||
          ((function (t, e, n) {
            var o = C(N(n.el, n.options.draggable)),
              i = 10;
            return e
              ? t.clientX > o.right + i ||
                  (t.clientX <= o.right &&
                    t.clientY > o.bottom &&
                    t.clientX >= o.left)
              : (t.clientX > o.right && t.clientY > o.top) ||
                  (t.clientX <= o.right && t.clientY > o.bottom + i);
          })(t, r, this) &&
            !v.animated)
        ) {
          if (v === G) return L(!1);
          if (
            (v && a === t.target && (l = v),
            l && (o = C(l)),
            !1 !== Yt(q, a, G, n, l, o, t, !!l))
          )
            return (
              H(),
              v && v.nextSibling
                ? a.insertBefore(G, v.nextSibling)
                : a.appendChild(G),
              (U = a),
              K(),
              L(!0)
            );
        } else if (
          v &&
          (function (t, e, n) {
            var o = C(x(n.el, 0, n.options, !0)),
              i = 10;
            return e
              ? t.clientX < o.left - i ||
                  (t.clientY < o.top && t.clientX < o.right)
              : t.clientY < o.top - i ||
                  (t.clientY < o.bottom && t.clientX < o.left);
          })(t, r, this)
        ) {
          var m = x(a, 0, s, !0);
          if (m === G) return L(!1);
          if (((o = C((l = m))), !1 !== Yt(q, a, G, n, l, o, t, !1)))
            return H(), a.insertBefore(G, m), (U = a), K(), L(!0);
        } else if (l.parentNode === a) {
          o = C(l);
          var y,
            w,
            D,
            _ = G.parentNode !== a,
            T = !(function (t, e, n) {
              var o = n ? t.left : t.top,
                i = n ? t.right : t.bottom,
                r = n ? t.width : t.height,
                a = n ? e.left : e.top,
                l = n ? e.right : e.bottom,
                s = n ? e.width : e.height;
              return o === a || i === l || o + r / 2 === a + s / 2;
            })((G.animated && G.toRect) || n, (l.animated && l.toRect) || o, r),
            A = r ? "top" : "left",
            I = O(l, "top", "top") || O(G, "top", "top"),
            P = I ? I.scrollTop : void 0;
          if (
            (ht !== l &&
              ((w = o[A]), (yt = !1), (wt = (!T && s.invertSwap) || _)),
            (y = (function (t, e, n, o, i, r, a, l) {
              var s = o ? t.clientY : t.clientX,
                c = o ? n.height : n.width,
                u = o ? n.top : n.left,
                d = o ? n.bottom : n.right,
                h = !1;
              if (!a)
                if (l && pt < c * i) {
                  if (
                    (!yt &&
                      (1 === ft ? s > u + (c * r) / 2 : s < d - (c * r) / 2) &&
                      (yt = !0),
                    yt)
                  )
                    h = !0;
                  else if (1 === ft ? s < u + pt : s > d - pt) return -ft;
                } else if (
                  s > u + (c * (1 - i)) / 2 &&
                  s < d - (c * (1 - i)) / 2
                )
                  return (function (t) {
                    return M(G) < M(t) ? 1 : -1;
                  })(e);
              if ((h = h || a) && (s < u + (c * r) / 2 || s > d - (c * r) / 2))
                return s > u + c / 2 ? 1 : -1;
              return 0;
            })(
              t,
              l,
              o,
              r,
              T ? 1 : s.swapThreshold,
              null == s.invertedSwapThreshold
                ? s.swapThreshold
                : s.invertedSwapThreshold,
              wt,
              ht === l
            )),
            0 !== y)
          ) {
            var k = M(G);
            do {
              (k -= y), (D = U.children[k]);
            } while (D && ("none" === S(D, "display") || D === V));
          }
          if (0 === y || D === l) return L(!1);
          (ht = l), (ft = y);
          var Y = l.nextElementSibling,
            B = !1,
            F = Yt(q, a, G, n, l, o, t, (B = 1 === y));
          if (!1 !== F)
            return (
              (1 !== F && -1 !== F) || (B = 1 === F),
              (St = !0),
              setTimeout(Bt, 30),
              H(),
              B && !Y
                ? a.appendChild(G)
                : l.parentNode.insertBefore(G, B ? Y : l),
              I && X(I, 0, P - I.scrollTop),
              (U = G.parentNode),
              void 0 === w || wt || (pt = Math.abs(w - C(l)[A])),
              K(),
              L(!0)
            );
        }
        if (a.contains(G)) return L(!1);
      }
      return !1;
    }
    function j(s, c) {
      W(
        s,
        p,
        e(
          {
            evt: t,
            isOwner: d,
            axis: r ? "vertical" : "horizontal",
            revert: i,
            dragRect: n,
            targetRect: o,
            canSort: h,
            fromSortable: f,
            target: l,
            completed: L,
            onMove: function (e, o) {
              return Yt(q, a, G, n, e, C(e), t, o);
            },
            changed: K,
          },
          c
        )
      );
    }
    function H() {
      j("dragOverAnimationCapture"),
        p.captureAnimationState(),
        p !== f && f.captureAnimationState();
    }
    function L(e) {
      return (
        j("dragOverCompleted", { insertion: e }),
        e &&
          (d ? u._hideClone() : u._showClone(p),
          p !== f &&
            (E(G, it ? it.options.ghostClass : u.options.ghostClass, !1),
            E(G, s.ghostClass, !0)),
          it !== p && p !== Xt.active
            ? (it = p)
            : p === Xt.active && it && (it = null),
          f === p && (p._ignoreWhileAnimating = l),
          p.animateAll(function () {
            j("dragOverAnimationComplete"), (p._ignoreWhileAnimating = null);
          }),
          p !== f && (f.animateAll(), (f._ignoreWhileAnimating = null))),
        ((l === G && !G.animated) || (l === a && !l.animated)) && (ht = null),
        s.dragoverBubble ||
          t.rootEl ||
          l === document ||
          (G.parentNode[R]._isOutsideThisEl(t.target), !e && Pt(t)),
        !s.dragoverBubble && t.stopPropagation && t.stopPropagation(),
        (g = !0)
      );
    }
    function K() {
      (tt = M(G)),
        (nt = M(G, s.draggable)),
        z({
          sortable: p,
          name: "change",
          toEl: a,
          newIndex: tt,
          newDraggableIndex: nt,
          originalEvent: t,
        });
    }
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function () {
    g(document, "mousemove", this._onTouchMove),
      g(document, "touchmove", this._onTouchMove),
      g(document, "pointermove", this._onTouchMove),
      g(document, "dragover", Pt),
      g(document, "mousemove", Pt),
      g(document, "touchmove", Pt);
  },
  _offUpEvents: function () {
    var t = this.el.ownerDocument;
    g(t, "mouseup", this._onDrop),
      g(t, "touchend", this._onDrop),
      g(t, "pointerup", this._onDrop),
      g(t, "touchcancel", this._onDrop),
      g(document, "selectstart", this);
  },
  _onDrop: function (t) {
    var e = this.el,
      n = this.options;
    (tt = M(G)),
      (nt = M(G, n.draggable)),
      W("drop", this, { evt: t }),
      (U = G && G.parentNode),
      (tt = M(G)),
      (nt = M(G, n.draggable)),
      Xt.eventCanceled ||
        ((vt = !1),
        (wt = !1),
        (yt = !1),
        clearInterval(this._loopId),
        clearTimeout(this._dragStartTimer),
        Ht(this.cloneId),
        Ht(this._dragStartId),
        this.nativeDraggable &&
          (g(document, "drop", this), g(e, "dragstart", this._onDragStart)),
        this._offMoveEvents(),
        this._offUpEvents(),
        u && S(document.body, "user-select", ""),
        S(G, "transform", ""),
        t &&
          (dt &&
            (t.cancelable && t.preventDefault(),
            !n.dropBubble && t.stopPropagation()),
          V && V.parentNode && V.parentNode.removeChild(V),
          (q === U || (it && "clone" !== it.lastPutMode)) &&
            Q &&
            Q.parentNode &&
            Q.parentNode.removeChild(Q),
          G &&
            (this.nativeDraggable && g(G, "dragend", this),
            Rt(G),
            (G.style["will-change"] = ""),
            dt &&
              !vt &&
              E(G, it ? it.options.ghostClass : this.options.ghostClass, !1),
            E(G, this.options.chosenClass, !1),
            z({
              sortable: this,
              name: "unchoose",
              toEl: U,
              newIndex: null,
              newDraggableIndex: null,
              originalEvent: t,
            }),
            q !== U
              ? (tt >= 0 &&
                  (z({
                    rootEl: U,
                    name: "add",
                    toEl: U,
                    fromEl: q,
                    originalEvent: t,
                  }),
                  z({
                    sortable: this,
                    name: "remove",
                    toEl: U,
                    originalEvent: t,
                  }),
                  z({
                    rootEl: U,
                    name: "sort",
                    toEl: U,
                    fromEl: q,
                    originalEvent: t,
                  }),
                  z({
                    sortable: this,
                    name: "sort",
                    toEl: U,
                    originalEvent: t,
                  })),
                it && it.save())
              : tt !== J &&
                tt >= 0 &&
                (z({
                  sortable: this,
                  name: "update",
                  toEl: U,
                  originalEvent: t,
                }),
                z({ sortable: this, name: "sort", toEl: U, originalEvent: t })),
            Xt.active &&
              ((null != tt && -1 !== tt) || ((tt = J), (nt = et)),
              z({ sortable: this, name: "end", toEl: U, originalEvent: t }),
              this.save())))),
      this._nulling();
  },
  _nulling: function () {
    W("nulling", this),
      (q =
        G =
        U =
        V =
        Z =
        Q =
        K =
        $ =
        rt =
        at =
        dt =
        tt =
        nt =
        J =
        et =
        ht =
        ft =
        it =
        ot =
        Xt.dragged =
        Xt.ghost =
        Xt.clone =
        Xt.active =
          null),
      Dt.forEach(function (t) {
        t.checked = !0;
      }),
      (Dt.length = lt = st = 0);
  },
  handleEvent: function (t) {
    switch (t.type) {
      case "drop":
      case "dragend":
        this._onDrop(t);
        break;
      case "dragenter":
      case "dragover":
        G &&
          (this._onDragOver(t),
          (function (t) {
            t.dataTransfer && (t.dataTransfer.dropEffect = "move");
            t.cancelable && t.preventDefault();
          })(t));
        break;
      case "selectstart":
        t.preventDefault();
    }
  },
  toArray: function () {
    for (
      var t,
        e = [],
        n = this.el.children,
        o = 0,
        i = n.length,
        r = this.options;
      o < i;
      o++
    )
      b((t = n[o]), r.draggable, this.el, !1) &&
        e.push(t.getAttribute(r.dataIdAttr) || Ft(t));
    return e;
  },
  sort: function (t, e) {
    var n = {},
      o = this.el;
    this.toArray().forEach(function (t, e) {
      var i = o.children[e];
      b(i, this.options.draggable, o, !1) && (n[t] = i);
    }, this),
      e && this.captureAnimationState(),
      t.forEach(function (t) {
        n[t] && (o.removeChild(n[t]), o.appendChild(n[t]));
      }),
      e && this.animateAll();
  },
  save: function () {
    var t = this.options.store;
    t && t.set && t.set(this);
  },
  closest: function (t, e) {
    return b(t, e || this.options.draggable, this.el, !1);
  },
  option: function (t, e) {
    var n = this.options;
    if (void 0 === e) return n[t];
    var o = H.modifyOption(this, t, e);
    (n[t] = void 0 !== o ? o : e), "group" === t && Mt(n);
  },
  destroy: function () {
    W("destroy", this);
    var t = this.el;
    (t[R] = null),
      g(t, "mousedown", this._onTapStart),
      g(t, "touchstart", this._onTapStart),
      g(t, "pointerdown", this._onTapStart),
      this.nativeDraggable && (g(t, "dragover", this), g(t, "dragenter", this)),
      Array.prototype.forEach.call(
        t.querySelectorAll("[draggable]"),
        function (t) {
          t.removeAttribute("draggable");
        }
      ),
      this._onDrop(),
      this._disableDelayedDragEvents(),
      bt.splice(bt.indexOf(this.el), 1),
      (this.el = t = null);
  },
  _hideClone: function () {
    if (!$) {
      if ((W("hideClone", this), Xt.eventCanceled)) return;
      S(Q, "display", "none"),
        this.options.removeCloneOnHide &&
          Q.parentNode &&
          Q.parentNode.removeChild(Q),
        ($ = !0);
    }
  },
  _showClone: function (t) {
    if ("clone" === t.lastPutMode) {
      if ($) {
        if ((W("showClone", this), Xt.eventCanceled)) return;
        G.parentNode != q || this.options.group.revertClone
          ? Z
            ? q.insertBefore(Q, Z)
            : q.appendChild(Q)
          : q.insertBefore(Q, G),
          this.options.group.revertClone && this.animate(G, Q),
          S(Q, "display", ""),
          ($ = !1);
      }
    } else this._hideClone();
  },
}),
  _t &&
    p(document, "touchmove", function (t) {
      (Xt.active || vt) && t.cancelable && t.preventDefault();
    }),
  (Xt.utils = {
    on: p,
    off: g,
    css: S,
    find: _,
    is: function (t, e) {
      return !!b(t, e, t, !1);
    },
    extend: function (t, e) {
      if (t && e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
      return t;
    },
    throttle: k,
    closest: b,
    toggleClass: E,
    clone: Y,
    index: M,
    nextTick: jt,
    cancelNextTick: Ht,
    detectDirection: Nt,
    getChild: x,
  }),
  (Xt.get = function (t) {
    return t[R];
  }),
  (Xt.mount = function () {
    for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
      n[o] = arguments[o];
    n[0].constructor === Array && (n = n[0]),
      n.forEach(function (t) {
        if (!t.prototype || !t.prototype.constructor)
          throw "Sortable: Mounted plugin must be a constructor function, not ".concat(
            {}.toString.call(t)
          );
        t.utils && (Xt.utils = e(e({}, Xt.utils), t.utils)), H.mount(t);
      });
  }),
  (Xt.create = function (t, e) {
    return new Xt(t, e);
  }),
  (Xt.version = "1.15.0");
var Lt,
  Wt,
  zt,
  Gt,
  Ut,
  Vt,
  qt = [],
  Zt = !1;
function Kt() {
  qt.forEach(function (t) {
    clearInterval(t.pid);
  }),
    (qt = []);
}
function Qt() {
  clearInterval(Vt);
}
var $t = k(function (t, e, n, o) {
    if (e.scroll) {
      var i,
        r = (t.touches ? t.touches[0] : t).clientX,
        a = (t.touches ? t.touches[0] : t).clientY,
        l = e.scrollSensitivity,
        s = e.scrollSpeed,
        c = T(),
        u = !1;
      Wt !== n &&
        ((Wt = n),
        Kt(),
        (Lt = e.scroll),
        (i = e.scrollFn),
        !0 === Lt && (Lt = I(n, !0)));
      var d = 0,
        h = Lt;
      do {
        var f = h,
          p = C(f),
          g = p.top,
          v = p.bottom,
          m = p.left,
          b = p.right,
          y = p.width,
          w = p.height,
          E = void 0,
          D = void 0,
          _ = f.scrollWidth,
          O = f.scrollHeight,
          x = S(f),
          N = f.scrollLeft,
          M = f.scrollTop;
        f === c
          ? ((E =
              y < _ &&
              ("auto" === x.overflowX ||
                "scroll" === x.overflowX ||
                "visible" === x.overflowX)),
            (D =
              w < O &&
              ("auto" === x.overflowY ||
                "scroll" === x.overflowY ||
                "visible" === x.overflowY)))
          : ((E =
              y < _ && ("auto" === x.overflowX || "scroll" === x.overflowX)),
            (D =
              w < O && ("auto" === x.overflowY || "scroll" === x.overflowY)));
        var A =
            E &&
            (Math.abs(b - r) <= l && N + y < _) - (Math.abs(m - r) <= l && !!N),
          P =
            D &&
            (Math.abs(v - a) <= l && M + w < O) - (Math.abs(g - a) <= l && !!M);
        if (!qt[d]) for (var k = 0; k <= d; k++) qt[k] || (qt[k] = {});
        (qt[d].vx == A && qt[d].vy == P && qt[d].el === f) ||
          ((qt[d].el = f),
          (qt[d].vx = A),
          (qt[d].vy = P),
          clearInterval(qt[d].pid),
          (0 == A && 0 == P) ||
            ((u = !0),
            (qt[d].pid = setInterval(
              function () {
                o && 0 === this.layer && Xt.active._onTouchMove(Ut);
                var e = qt[this.layer].vy ? qt[this.layer].vy * s : 0,
                  n = qt[this.layer].vx ? qt[this.layer].vx * s : 0;
                ("function" == typeof i &&
                  "continue" !==
                    i.call(
                      Xt.dragged.parentNode[R],
                      n,
                      e,
                      t,
                      Ut,
                      qt[this.layer].el
                    )) ||
                  X(qt[this.layer].el, n, e);
              }.bind({ layer: d }),
              24
            )))),
          d++;
      } while (e.bubbleScroll && h !== c && (h = I(h, !1)));
      Zt = u;
    }
  }, 30),
  Jt = function (t) {
    var e = t.originalEvent,
      n = t.putSortable,
      o = t.dragEl,
      i = t.activeSortable,
      r = t.dispatchSortableEvent,
      a = t.hideGhostForTarget,
      l = t.unhideGhostForTarget;
    if (e) {
      var s = n || i;
      a();
      var c =
          e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e,
        u = document.elementFromPoint(c.clientX, c.clientY);
      l(),
        s &&
          !s.el.contains(u) &&
          (r("spill"), this.onSpill({ dragEl: o, putSortable: n }));
    }
  };
function te() {}
function ee() {}
(te.prototype = {
  startIndex: null,
  dragStart: function (t) {
    var e = t.oldDraggableIndex;
    this.startIndex = e;
  },
  onSpill: function (t) {
    var e = t.dragEl,
      n = t.putSortable;
    this.sortable.captureAnimationState(), n && n.captureAnimationState();
    var o = x(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(e, o) : this.sortable.el.appendChild(e),
      this.sortable.animateAll(),
      n && n.animateAll();
  },
  drop: Jt,
}),
  i(te, { pluginName: "revertOnSpill" }),
  (ee.prototype = {
    onSpill: function (t) {
      var e = t.dragEl,
        n = t.putSortable || this.sortable;
      n.captureAnimationState(),
        e.parentNode && e.parentNode.removeChild(e),
        n.animateAll();
    },
    drop: Jt,
  }),
  i(ee, { pluginName: "removeOnSpill" });
var ne = [ee, te];
Xt.mount(
  ne,
  new (function () {
    function t() {
      for (var t in ((this.defaults = {
        scroll: !0,
        forceAutoScrollFallback: !1,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        bubbleScroll: !0,
      }),
      this))
        "_" === t.charAt(0) &&
          "function" == typeof this[t] &&
          (this[t] = this[t].bind(this));
    }
    return (
      (t.prototype = {
        dragStarted: function (t) {
          var e = t.originalEvent;
          this.sortable.nativeDraggable
            ? p(document, "dragover", this._handleAutoScroll)
            : this.options.supportPointer
            ? p(document, "pointermove", this._handleFallbackAutoScroll)
            : e.touches
            ? p(document, "touchmove", this._handleFallbackAutoScroll)
            : p(document, "mousemove", this._handleFallbackAutoScroll);
        },
        dragOverCompleted: function (t) {
          var e = t.originalEvent;
          this.options.dragOverBubble || e.rootEl || this._handleAutoScroll(e);
        },
        drop: function () {
          this.sortable.nativeDraggable
            ? g(document, "dragover", this._handleAutoScroll)
            : (g(document, "pointermove", this._handleFallbackAutoScroll),
              g(document, "touchmove", this._handleFallbackAutoScroll),
              g(document, "mousemove", this._handleFallbackAutoScroll)),
            Qt(),
            Kt(),
            clearTimeout(y),
            (y = void 0);
        },
        nulling: function () {
          (Ut = Wt = Lt = Zt = Vt = zt = Gt = null), (qt.length = 0);
        },
        _handleFallbackAutoScroll: function (t) {
          this._handleAutoScroll(t, !0);
        },
        _handleAutoScroll: function (t, e) {
          var n = this,
            o = (t.touches ? t.touches[0] : t).clientX,
            i = (t.touches ? t.touches[0] : t).clientY,
            r = document.elementFromPoint(o, i);
          if (
            ((Ut = t), e || this.options.forceAutoScrollFallback || s || l || u)
          ) {
            $t(t, this.options, r, e);
            var a = I(r, !0);
            !Zt ||
              (Vt && o === zt && i === Gt) ||
              (Vt && Qt(),
              (Vt = setInterval(function () {
                var r = I(document.elementFromPoint(o, i), !0);
                r !== a && ((a = r), Kt()), $t(t, n.options, r, e);
              }, 10)),
              (zt = o),
              (Gt = i));
          } else {
            if (!this.options.bubbleScroll || I(r, !0) === T())
              return void Kt();
            $t(t, this.options, I(r, !1), !1);
          }
        },
      }),
      i(t, { pluginName: "scroll", initializeByDefault: !0 })
    );
  })()
);
export { Xt as default };
