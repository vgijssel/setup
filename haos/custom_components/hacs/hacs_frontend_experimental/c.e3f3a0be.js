import { a5 as t } from "./main-85e087f9.js";
import { T as a } from "./c.2610e8cd.js";
const e = t((t) => {
  if (t.time_format === a.language || t.time_format === a.system) {
    const e = t.time_format === a.language ? t.language : void 0,
      m = new Date().toLocaleString(e);
    return m.includes("AM") || m.includes("PM");
  }
  return t.time_format === a.am_pm;
});
export { e as u };
