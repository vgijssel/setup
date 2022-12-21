import {
  _ as e,
  j as r,
  e as t,
  t as s,
  y as i,
  ae as o,
  n as a,
} from "./main-ec7846c8.js";
import { e as n, c } from "./c.50bfd408.js";
const d = {
  hacs_repository: {
    redirect: "/hacs/repository",
    params: { owner: "string", repository: "string", category: "string?" },
  },
};
e(
  [a("hacs-my-redirect")],
  function (e, r) {
    return {
      F: class extends r {
        constructor(...r) {
          super(...r), e(this);
        }
      },
      d: [
        {
          kind: "field",
          decorators: [t({ attribute: !1 })],
          key: "hass",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ attribute: !1 })],
          key: "hacs",
          value: void 0,
        },
        {
          kind: "field",
          decorators: [t({ attribute: !1 })],
          key: "route",
          value: void 0,
        },
        { kind: "field", decorators: [s()], key: "_error", value: void 0 },
        {
          kind: "method",
          key: "firstUpdated",
          value: function (e) {
            const r = this.route.path.indexOf("/", 1),
              t = this.route.path.substr(r + 1),
              s = d[t];
            if (!s)
              return void (this._error = this.hacs.localize(
                "my.not_supported",
                {
                  link: i`<a
          target="_blank"
          rel="noreferrer noopener"
          href="https://my.home-assistant.io/faq.html#supported-pages"
        >
          ${this.hacs.localize("my.faq_link")}
        </a>`,
                }
              ));
            let a;
            try {
              a = this._createRedirectUrl(s);
            } catch (e) {
              return void (this._error = this.hacs.localize("my.error"));
            }
            o(a, { replace: !0 });
          },
        },
        {
          kind: "method",
          key: "render",
          value: function () {
            return this._error
              ? i`<hass-error-screen .error=${this._error}></hass-error-screen>`
              : i``;
          },
        },
        {
          kind: "method",
          key: "_createRedirectUrl",
          value: function (e) {
            const r = this._createRedirectParams(e);
            return `${e.redirect}${r}`;
          },
        },
        {
          kind: "method",
          key: "_createRedirectParams",
          value: function (e) {
            const r = n();
            if (!e.params && !Object.keys(r).length) return "";
            const t = {};
            for (const [s, i] of Object.entries(e.params || {}))
              if (r[s] || !i.endsWith("?")) {
                if (!r[s] || !this._checkParamType(i, r[s])) throw Error();
                t[s] = r[s];
              }
            return `?${c(t)}`;
          },
        },
        {
          kind: "method",
          key: "_checkParamType",
          value: function (e, r) {
            return "string" === e || "string?" === e;
          },
        },
      ],
    };
  },
  r
);
export { d as REDIRECTS };
