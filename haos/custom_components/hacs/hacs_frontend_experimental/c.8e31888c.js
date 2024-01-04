import { a5 as e, y as r } from "./main-85e087f9.js";
import { c as t } from "./c.a42008f9.js";
import { f as n } from "./c.89ccd556.js";
import { p as i } from "./c.ef7f8e16.js";
import { u as a } from "./c.e3f3a0be.js";
import { N as o } from "./c.2610e8cd.js";
const m = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function u(e) {
  return !!e && e instanceof Date && !isNaN(e.valueOf());
}
i && (await i);
const c = (e, r) => s(r).format(e),
  s = e(
    (e) =>
      new Intl.DateTimeFormat(
        "en" !== e.language || a(e) ? e.language : "en-u-hc-h23",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: a(e) ? "numeric" : "2-digit",
          minute: "2-digit",
          hour12: a(e),
        }
      )
  );
e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || a(e) ? e.language : "en-u-hc-h23",
      {
        month: "short",
        day: "numeric",
        hour: a(e) ? "numeric" : "2-digit",
        minute: "2-digit",
        hour12: a(e),
      }
    )
);
const l = e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || a(e) ? e.language : "en-u-hc-h23",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: a(e) ? "numeric" : "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: a(e),
      }
    )
);
e(
  (e) =>
    new Intl.DateTimeFormat(
      "en" !== e.language || a(e) ? e.language : "en-u-hc-h23",
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: a(e),
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
        return new Intl.NumberFormat(n, p(e, t)).format(Number(e));
      } catch (r) {
        return (
          console.error(r),
          new Intl.NumberFormat(void 0, p(e, t)).format(Number(e))
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
  d = (e) => {
    var r;
    if (
      Number.isInteger(
        Number(null === (r = e.attributes) || void 0 === r ? void 0 : r.step)
      ) &&
      Number.isInteger(Number(e.state))
    )
      return { maximumFractionDigits: 0 };
  },
  p = (e, r) => {
    const t = { maximumFractionDigits: 2, ...r };
    if ("string" != typeof e) return t;
    if (
      !r ||
      (void 0 === r.minimumFractionDigits && void 0 === r.maximumFractionDigits)
    ) {
      const r = e.indexOf(".") > -1 ? e.split(".")[1].length : 0;
      (t.minimumFractionDigits = r), (t.maximumFractionDigits = r);
    }
    return t;
  },
  h = "^\\d{4}-(0[1-9]|1[0-2])-([12]\\d|0[1-9]|3[01])",
  b = new RegExp(h + "$"),
  y = new RegExp(h),
  N =
    /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])[T| ](((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)(\8[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)$/;
let D;
function v(e) {
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
function w(e, i) {
  if (null === i) return "—";
  if (
    (Array.isArray(i) && i.some((e) => e instanceof Object)) ||
    (!Array.isArray(i) && i instanceof Object)
  ) {
    D || (D = import("./c.ca7549f6.js"));
    const e = D.then((e) => e.dump(i));
    return r`<pre>${t(e, "")}</pre>`;
  }
  if ("number" == typeof i) return g(i, e.locale);
  if ("string" == typeof i) {
    if (i.startsWith("http"))
      try {
        const e = new URL(i);
        if ("http:" === e.protocol || "https:" === e.protocol)
          return r`<a target="_blank" rel="noreferrer" href=${i}
            >${i}</a
          >`;
      } catch (e) {}
    if (((e, r = !1) => (r ? y.test(e) : b.test(e)))(i, !0)) {
      if (((m = i), N.test(m))) {
        const r = new Date(i);
        if (u(r)) return (a = r), (o = e.locale), l(o).format(a);
      }
      const r = new Date(i);
      if (u(r)) return n(r, e.locale);
    }
  }
  var a, o, m;
  return Array.isArray(i) ? i.join(", ") : i;
}
export { g as a, c as b, m as c, w as d, v as f, d as g, f as i };
