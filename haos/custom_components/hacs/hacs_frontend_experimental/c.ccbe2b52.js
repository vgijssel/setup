import { O as o } from "./main-85e087f9.js";
const a = () => import("./c.a35673d5.js"),
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
