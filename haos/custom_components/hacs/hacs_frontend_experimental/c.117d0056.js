import { I as e, J as s, L as t, N as r } from "./main-85e087f9.js";
import { m as l, u as n, r as o, p as i, b as u } from "./c.388f6c87.js";
const f = (e, s, t) => {
    const r = new Map();
    for (let l = s; l <= t; l++) r.set(e[l], l);
    return r;
  },
  a = e(
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
      update(e, [s, t, a]) {
        var c;
        const h = l(e),
          { values: d, keys: p } = this.ht(s, t, a);
        if (!Array.isArray(h)) return (this.ut = p), d;
        const v = null !== (c = this.ut) && void 0 !== c ? c : (this.ut = []),
          y = [];
        let m,
          x,
          g = 0,
          b = h.length - 1,
          j = 0,
          k = d.length - 1;
        for (; g <= b && j <= k; )
          if (null === h[g]) g++;
          else if (null === h[b]) b--;
          else if (v[g] === p[j]) (y[j] = n(h[g], d[j])), g++, j++;
          else if (v[b] === p[k]) (y[k] = n(h[b], d[k])), b--, k--;
          else if (v[g] === p[k])
            (y[k] = n(h[g], d[k])), o(e, y[k + 1], h[g]), g++, k--;
          else if (v[b] === p[j])
            (y[j] = n(h[b], d[j])), o(e, h[g], h[b]), b--, j++;
          else if (
            (void 0 === m && ((m = f(p, j, k)), (x = f(v, g, b))), m.has(v[g]))
          )
            if (m.has(v[b])) {
              const s = x.get(p[j]),
                t = void 0 !== s ? h[s] : null;
              if (null === t) {
                const s = o(e, h[g]);
                n(s, d[j]), (y[j] = s);
              } else (y[j] = n(t, d[j])), o(e, h[g], t), (h[s] = null);
              j++;
            } else i(h[b]), b--;
          else i(h[g]), g++;
        for (; j <= k; ) {
          const s = o(e, y[k + 1]);
          n(s, d[j]), (y[j++] = s);
        }
        for (; g <= b; ) {
          const e = h[g++];
          null !== e && i(e);
        }
        return (this.ut = p), u(e, y), r;
      }
    }
  );
export { a as c };
