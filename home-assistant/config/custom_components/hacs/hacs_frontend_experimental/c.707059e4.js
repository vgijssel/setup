import { a7 as a } from "./main-e6d3fb5e.js";
import { p as e } from "./c.62bcca49.js";
e && (await e),
  a(
    (a) =>
      new Intl.DateTimeFormat(a.language, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
  );
const n = (a, e) => m(e).format(a),
  m = a(
    (a) =>
      new Intl.DateTimeFormat(a.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  ),
  t = (a, e) => o(e).format(a),
  o = a(
    (a) =>
      new Intl.DateTimeFormat(a.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
  );
a(
  (a) => new Intl.DateTimeFormat(a.language, { day: "numeric", month: "short" })
),
  a(
    (a) =>
      new Intl.DateTimeFormat(a.language, { month: "long", year: "numeric" })
  ),
  a((a) => new Intl.DateTimeFormat(a.language, { month: "long" })),
  a((a) => new Intl.DateTimeFormat(a.language, { year: "numeric" })),
  a((a) => new Intl.DateTimeFormat(a.language, { weekday: "long" }));
export { t as a, n as f };