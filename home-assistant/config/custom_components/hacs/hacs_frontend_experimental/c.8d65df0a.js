import { a5 as e, y as r } from "./main-ec7846c8.js";
import { c as t } from "./c.417318ff.js";
import { f as n } from "./c.128a6b66.js";
import { p as a } from "./c.aaeac12d.js";
import { u as i } from "./c.d8036e66.js";
import { N as o } from "./c.2610e8cd.js";
const m = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function u(e) {
  return !!e && e instanceof Date && !isNaN(e.valueOf());
}
a && (await a);
const c = (e, r) => s(r).format(e),
  s = e(
    (e) =>
      new Intl.DateTimeFormat(
        "en" !== e.language || i(e) ? e.language : "en-u-hc-h23",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: i(e) ? "numeric" : "2-digit",
          minute: "2-digit",
          hour12: i(e),
        }
      )
  );
e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || i(e) ? e.language : "en-u-hc-h23",
      {
        month: "short",
        day: "numeric",
        hour: i(e) ? "numeric" : "2-digit",
        minute: "2-digit",
        hour12: i(e),
      }
    )
);
const l = e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || i(e) ? e.language : "en-u-hc-h23",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: i(e) ? "numeric" : "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: i(e),
      }
    )
);
e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || i(e) ? e.language : "en-u-hc-h23",
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: i(e),
      }
    )
);
const f = (e) => !!e.unit_of_measurement || !!e.state_class,
  g = (e, r, t) => {
    const n = r
      ? ((e) => {
          switch (e.number_format) {
            case o.comma_decimal:
              return ["en-US", "en"];
            case o.decimal_comma:
              return ["de", "es", "it"];
            case o.space_comma:
              return ["fr", "sv", "cs"];
            case o.system:
              return;
            default:
              return e.language;
          }
        })(r)
      : void 0;
    if (
      ((Number.isNaN =
        Number.isNaN ||
        function e(r) {
          return "number" == typeof r && e(r);
        }),
      (null == r ? void 0 : r.number_format) !== o.none &&
        !Number.isNaN(Number(e)) &&
        Intl)
    )
      try {
        return new Intl.NumberFormat(n, d(e, t)).format(Number(e));
      } catch (r) {
        return (
          console.error(r),
          new Intl.NumberFormat(void 0, d(e, t)).format(Number(e))
        );
      }
    return "string" == typeof e
      ? e
      : `${((e, r = 2) => Math.round(e * 10 ** r) / 10 ** r)(
          e,
          null == t ? void 0 : t.maximumFractionDigits
        ).toString()}${
          "currency" === (null == t ? void 0 : t.style) ? ` ${t.currency}` : ""
        }`;
  },
  d = (e, r) => {
    const t = { maximumFractionDigits: 2, ...r };
    if ("string" != typeof e) return t;
    if (!r || (!r.minimumFractionDigits && !r.maximumFractionDigits)) {
      const r = e.indexOf(".") > -1 ? e.split(".")[1].length : 0;
      (t.minimumFractionDigits = r), (t.maximumFractionDigits = r);
    }
    return t;
  },
  p = "^\\d{4}-(0[1-9]|1[0-2])-([12]\\d|0[1-9]|3[01])",
  h = new RegExp(p + "$"),
  b = new RegExp(p),
  y =
    /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])[T| ](((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)(\8[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)$/;
let N;
function D(e) {
  return (
    (e = e
      .replace(/_/g, " ")
      .replace(/\bid\b/g, "ID")
      .replace(/\bip\b/g, "IP")
      .replace(/\bmac\b/g, "MAC")
      .replace(/\bgps\b/g, "GPS")),
    m(e)
  );
}
function w(e, a) {
  if (null === a) return "—";
  if (
    (Array.isArray(a) && a.some((e) => e instanceof Object)) ||
    (!Array.isArray(a) && a instanceof Object)
  ) {
    N || (N = import("./c.ca7549f6.js"));
    const e = N.then((e) => e.dump(a));
    return r`<pre>${t(e, "")}</pre>`;
  }
  if ("number" == typeof a) return g(a, e.locale);
  if ("string" == typeof a) {
    if (a.startsWith("http"))
      try {
        const e = new URL(a);
        if ("http:" === e.protocol || "https:" === e.protocol)
          return r`<a target="_blank" rel="noreferrer" href=${a}
            >${a}</a
          >`;
      } catch (e) {}
    if (((e, r = !1) => (r ? b.test(e) : h.test(e)))(a, !0)) {
      if (((m = a), y.test(m))) {
        const r = new Date(a);
        if (u(r)) return (i = r), (o = e.locale), l(o).format(i);
      }
      const r = new Date(a);
      if (u(r)) return n(r, e.locale);
    }
  }
  var i, o, m;
  return Array.isArray(a) ? a.join(", ") : a;
}
export { g as a, c as b, m as c, w as d, D as f, f as i };
