import { a7 as e } from "./main-e6d3fb5e.js";
import { T as t } from "./c.2610e8cd.js";
const a = e((e) => {
  if (e.time_format === t.language || e.time_format === t.system) {
    const a = e.time_format === t.language ? e.language : void 0,
      m = new Date().toLocaleString(a);
    return m.includes("AM") || m.includes("PM");
  }
  return e.time_format === t.am_pm;
});
export { a as u };
