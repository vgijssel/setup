import { c as e } from "./c.fa0ef026.js";
const t = async (e, n, r, i, s, ...a) => {
    const o = s,
      c = o[e],
      u = (c) =>
        i && i(s, c.result) !== c.cacheKey
          ? ((o[e] = void 0), t(e, n, r, i, s, ...a))
          : c.result;
    if (c) return c instanceof Promise ? c.then(u) : u(c);
    const l = r(s, ...a);
    return (
      (o[e] = l),
      l.then(
        (t) => {
          (o[e] = { result: t, cacheKey: null == i ? void 0 : i(s, t) }),
            setTimeout(() => {
              o[e] = void 0;
            }, n);
        },
        () => {
          o[e] = void 0;
        }
      ),
      l
    );
  },
  n = (e, t) => e.callWS({ type: "entity/source", entity_id: t }),
  r = (e, r) =>
    r
      ? n(e, r)
      : t("_entitySources", 3e4, n, (e) => Object.keys(e.states).length, e),
  i = (e, t, n) => {
    const { manufacturer: r, model: i, integration: s } = e;
    if (r && t.manufacturer !== r) return !1;
    if (i && t.model !== i) return !1;
    var a;
    if (
      s &&
      n &&
      (null == n || null === (a = n[t.id]) || void 0 === a || !a.includes(s))
    )
      return !1;
    return !0;
  },
  s = (t, n, r) => {
    var i;
    const { domain: s, device_class: a, integration: o } = t;
    if (s) {
      const t = e(n);
      if (Array.isArray(s) ? !s.includes(t) : t !== s) return !1;
    }
    return (
      (!a || n.attributes.device_class === a) &&
      (!o ||
        (null == r || null === (i = r[n.entity_id]) || void 0 === i
          ? void 0
          : i.domain) === o)
    );
  };
export { s as a, i as b, r as f };
