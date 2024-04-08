/*! For license information please see sort-filter-worker.jFjB-jtFwEc.js.LICENSE.txt */
const e = Symbol("Comlink.proxy"),
  t = Symbol("Comlink.endpoint"),
  n = Symbol("Comlink.releaseProxy"),
  r = Symbol("Comlink.finalizer"),
  a = Symbol("Comlink.thrown"),
  i = (e) => ("object" == typeof e && null !== e) || "function" == typeof e,
  s = new Map([
    [
      "proxy",
      {
        canHandle: (t) => i(t) && t[e],
        serialize(e) {
          const { port1: t, port2: n } = new MessageChannel();
          return o(e, t), [n, [n]];
        },
        deserialize(e) {
          return e.start(), g(e, [], t);
          var t;
        },
      },
    ],
    [
      "throw",
      {
        canHandle: (e) => i(e) && a in e,
        serialize({ value: e }) {
          let t;
          return (
            (t =
              e instanceof Error
                ? {
                    isError: !0,
                    value: { message: e.message, name: e.name, stack: e.stack },
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
function o(t, n = globalThis, i = ["*"]) {
  n.addEventListener("message", function s(u) {
    if (!u || !u.data) return;
    if (
      !(function (e, t) {
        for (const n of e) {
          if (t === n || "*" === n) return !0;
          if (n instanceof RegExp && n.test(t)) return !0;
        }
        return !1;
      })(i, u.origin)
    )
      return void console.warn(
        `Invalid origin '${u.origin}' for comlink proxy`
      );
    const { id: c, type: f, path: p } = Object.assign({ path: [] }, u.data),
      g = (u.data.argumentList || []).map(h);
    let m;
    try {
      const n = p.slice(0, -1).reduce((e, t) => e[t], t),
        r = p.reduce((e, t) => e[t], t);
      switch (f) {
        case "GET":
          m = r;
          break;
        case "SET":
          (n[p.slice(-1)[0]] = h(u.data.value)), (m = !0);
          break;
        case "APPLY":
          m = r.apply(n, g);
          break;
        case "CONSTRUCT":
          m = (function (t) {
            return Object.assign(t, { [e]: !0 });
          })(new r(...g));
          break;
        case "ENDPOINT":
          {
            const { port1: e, port2: n } = new MessageChannel();
            o(t, n),
              (m = (function (e, t) {
                return v.set(e, t), e;
              })(e, [e]));
          }
          break;
        case "RELEASE":
          m = void 0;
          break;
        default:
          return;
      }
    } catch (e) {
      m = { value: e, [a]: 0 };
    }
    Promise.resolve(m)
      .catch((e) => ({ value: e, [a]: 0 }))
      .then((e) => {
        const [a, i] = y(e);
        n.postMessage(Object.assign(Object.assign({}, a), { id: c }), i),
          "RELEASE" === f &&
            (n.removeEventListener("message", s),
            l(n),
            r in t && "function" == typeof t[r] && t[r]());
      })
      .catch((e) => {
        const [t, r] = y({
          value: new TypeError("Unserializable return value"),
          [a]: 0,
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
function u(e) {
  if (e) throw new Error("Proxy has been released and is not useable");
}
function c(e) {
  return d(e, { type: "RELEASE" }).then(() => {
    l(e);
  });
}
const f = new WeakMap(),
  p =
    "FinalizationRegistry" in globalThis &&
    new FinalizationRegistry((e) => {
      const t = (f.get(e) || 0) - 1;
      f.set(e, t), 0 === t && c(e);
    });
function g(e, r = [], a = function () {}) {
  let i = !1;
  const s = new Proxy(a, {
    get(t, a) {
      if ((u(i), a === n))
        return () => {
          !(function (e) {
            p && p.unregister(e);
          })(s),
            c(e),
            (i = !0);
        };
      if ("then" === a) {
        if (0 === r.length) return { then: () => s };
        const t = d(e, { type: "GET", path: r.map((e) => e.toString()) }).then(
          h
        );
        return t.then.bind(t);
      }
      return g(e, [...r, a]);
    },
    set(t, n, a) {
      u(i);
      const [s, o] = y(a);
      return d(
        e,
        { type: "SET", path: [...r, n].map((e) => e.toString()), value: s },
        o
      ).then(h);
    },
    apply(n, a, s) {
      u(i);
      const o = r[r.length - 1];
      if (o === t) return d(e, { type: "ENDPOINT" }).then(h);
      if ("bind" === o) return g(e, r.slice(0, -1));
      const [l, c] = m(s);
      return d(
        e,
        { type: "APPLY", path: r.map((e) => e.toString()), argumentList: l },
        c
      ).then(h);
    },
    construct(t, n) {
      u(i);
      const [a, s] = m(n);
      return d(
        e,
        {
          type: "CONSTRUCT",
          path: r.map((e) => e.toString()),
          argumentList: a,
        },
        s
      ).then(h);
    },
  });
  return (
    (function (e, t) {
      const n = (f.get(t) || 0) + 1;
      f.set(t, n), p && p.register(e, t, e);
    })(s, e),
    s
  );
}
function m(e) {
  const t = e.map(y);
  return [
    t.map((e) => e[0]),
    ((n = t.map((e) => e[1])), Array.prototype.concat.apply([], n)),
  ];
  var n;
}
const v = new WeakMap();
function y(e) {
  for (const [t, n] of s)
    if (n.canHandle(e)) {
      const [r, a] = n.serialize(e);
      return [{ type: "HANDLER", name: t, value: r }, a];
    }
  return [{ type: "RAW", value: e }, v.get(e) || []];
}
function h(e) {
  switch (e.type) {
    case "HANDLER":
      return s.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function d(e, t, n) {
  return new Promise((r) => {
    const a = new Array(4)
      .fill(0)
      .map(() =>
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
      )
      .join("-");
    e.addEventListener("message", function t(n) {
      n.data &&
        n.data.id &&
        n.data.id === a &&
        (e.removeEventListener("message", t), r(n.data));
    }),
      e.start && e.start(),
      e.postMessage(Object.assign({ id: a }, t), n);
  });
}
var b =
  Number.isNaN ||
  function (e) {
    return "number" == typeof e && e != e;
  };
function E(e, t) {
  if (e.length !== t.length) return !1;
  for (var n = 0; n < e.length; n++)
    if (((r = e[n]), (a = t[n]), !(r === a || (b(r) && b(a))))) return !1;
  var r, a;
  return !0;
}
function w(e, t) {
  void 0 === t && (t = E);
  var n = null;
  function r() {
    for (var r = [], a = 0; a < arguments.length; a++) r[a] = arguments[a];
    if (n && n.lastThis === this && t(r, n.lastArgs)) return n.lastResult;
    var i = e.apply(this, r);
    return (n = { lastResult: i, lastArgs: r, lastThis: this }), i;
  }
  return (
    (r.clear = function () {
      n = null;
    }),
    r
  );
}
const C = w((e) => new Intl.Collator(e)),
  N =
    (w((e) => new Intl.Collator(e, { sensitivity: "accent" })),
    (e, t) => (e < t ? -1 : e > t ? 1 : 0));
o({
  filterData: (e, t, n) => (
    (n = n.toUpperCase()),
    e.filter((e) =>
      Object.entries(t).some((t) => {
        const [r, a] = t;
        return !(
          !a.filterable ||
          !String(
            a.filterKey
              ? e[a.valueColumn || r][a.filterKey]
              : e[a.valueColumn || r]
          )
            .toUpperCase()
            .includes(n)
        );
      })
    )
  ),
  sortData: (e, t, n, r, a) =>
    e.sort((e, i) => {
      let s = 1;
      "desc" === n && (s = -1);
      let o = t.filterKey
          ? e[t.valueColumn || r][t.filterKey]
          : e[t.valueColumn || r],
        l = t.filterKey
          ? i[t.valueColumn || r][t.filterKey]
          : i[t.valueColumn || r];
      if ("numeric" === t.type)
        (o = isNaN(o) ? void 0 : Number(o)),
          (l = isNaN(l) ? void 0 : Number(l));
      else if ("string" == typeof o && "string" == typeof l)
        return (
          s *
          ((e, t, n) => {
            var r;
            return null !== (r = Intl) && void 0 !== r && r.Collator
              ? C(n).compare(e, t)
              : N(e, t);
          })(o, l, a)
        );
      return null == o && null != l
        ? 1
        : null == l && null != o
        ? -1
        : o < l
        ? -1 * s
        : o > l
        ? 1 * s
        : 0;
    }),
});
//# sourceMappingURL=sort-filter-worker.jFjB-jtFwEc.js.map
