import { O as o } from "./main-e6d3fb5e.js";
const a = () => import("./c.248ff302.js"),
  i = (i, l, m) =>
    new Promise((n) => {
      const r = l.cancel,
        s = l.confirm;
      o(i, "show-dialog", {
        dialogTag: "dialog-box",
        dialogImport: a,
        dialogParams: {
          ...l,
          ...m,
          cancel: () => {
            n(!(null == m || !m.prompt) && null), r && r();
          },
          confirm: (o) => {
            n(null == m || !m.prompt || o), s && s(o);
          },
        },
      });
    }),
  l = (o, a) => i(o, a),
  m = (o, a) => i(o, a, { confirmation: !0 }),
  n = (o, a) => i(o, a, { prompt: !0 });
export { l as a, n as b, m as s };