import { a } from "./c.04ecc0ad.js";
const s = "unavailable",
  n = "unknown",
  r = ["unavailable", "unknown"],
  e = 4,
  o = (s) => a(s, 4) && "number" == typeof s.in_progress,
  t = (a) => ((a) => o(a.attributes))(a) || !!a.attributes.in_progress,
  i = (a) => o(a) || !!a.in_progress;
export { r as U, n as a, s as b, i as c, e as d, t as u };
