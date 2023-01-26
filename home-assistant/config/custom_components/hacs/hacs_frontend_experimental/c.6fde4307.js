import { I as e, J as s, L as t, N as r } from "./main-e6d3fb5e.js";
import { m as l, u as n, r as o, p as i, a as u } from "./c.7a38bd55.js";
const a = (e, s, t) => {
    const r = new Map();
    for (let l = s; l <= t; l++) r.set(e[l], l);
    return r;
  },
  f = e(
    class extends s {
      constructor(e) {
        if ((super(e), e.type !== t.CHILD))
          throw Error("repeat() can only be used in text expressions");
      }
      ht(e, s, t) {
        let r;
        void 0 === t ? (t = s) : void 0 !== s && (r = s);
        const l = [],
          n = [];
        let o = 0;
        for (const s of e) (l[o] = r ? r(s, o) : o), (n[o] = t(s, o)), o++;
        return { values: n, keys: l };
      }
      render(e, s, t) {
        return this.ht(e, s, t).values;
      }
      update(e, [s, t, f]) {
        var c;
        const h = l(e),
          { values: d, keys: p } = this.ht(s, t, f);
        if (!Array.isArray(h)) return (this.ut = p), d;
        const v = null !== (c = this.ut) && void 0 !== c ? c : (this.ut = []),
          y = [];
        let m,
          x,
          b = 0,
          g = h.length - 1,
          j = 0,
          k = d.length - 1;
        for (; b <= g && j <= k; )
          if (null === h[b]) b++;
          else if (null === h[g]) g--;
          else if (v[b] === p[j]) (y[j] = n(h[b], d[j])), b++, j++;
          else if (v[g] === p[k]) (y[k] = n(h[g], d[k])), g--, k--;
          else if (v[b] === p[k])
            (y[k] = n(h[b], d[k])), o(e, y[k + 1], h[b]), b++, k--;
          else if (v[g] === p[j])
            (y[j] = n(h[g], d[j])), o(e, h[b], h[g]), g--, j++;
          else if (
            (void 0 === m && ((m = a(p, j, k)), (x = a(v, b, g))), m.has(v[b]))
          )
            if (m.has(v[g])) {
              const s = x.get(p[j]),
                t = void 0 !== s ? h[s] : null;
              if (null === t) {
                const s = o(e, h[b]);
                n(s, d[j]), (y[j] = s);
              } else (y[j] = n(t, d[j])), o(e, h[b], t), (h[s] = null);
              j++;
            } else i(h[g]), g--;
          else i(h[b]), b++;
        for (; j <= k; ) {
          const s = o(e, y[k + 1]);
          n(s, d[j]), (y[j++] = s);
        }
        for (; b <= g; ) {
          const e = h[b++];
          null !== e && i(e);
        }
        return (this.ut = p), u(e, y), r;
      }
    }
  );
export { f as c };