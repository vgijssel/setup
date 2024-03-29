import {
  _ as r,
  j as e,
  e as t,
  t as s,
  y as i,
  af as o,
  n as a,
} from "./main-85e087f9.js";
import { e as n, c } from "./c.50bfd408.js";
const d = {
  hacs_repository: {
    redirect: "/hacs/repository",
    params: { owner: "string", repository: "string", category: "string?" },
  },
};
r(
  [a("hacs-my-redirect")],
  function (r, e) {
    return {
      F: class extends e {
        constructor(...e) {
          super(...e), r(this);
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
          value: function (r) {
            const e = this.route.path.indexOf("/", 1),
              t = this.route.path.substr(e + 1),
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
            } catch (r) {
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
          value: function (r) {
            const e = this._createRedirectParams(r);
            return `${r.redirect}${e}`;
          },
        },
        {
          kind: "method",
          key: "_createRedirectParams",
          value: function (r) {
            const e = n();
            if (!r.params && !Object.keys(e).length) return "";
            const t = {};
            for (const [s, i] of Object.entries(r.params || {}))
              if (e[s] || !i.endsWith("?")) {
                if (!e[s] || !this._checkParamType(i, e[s])) throw Error();
                t[s] = e[s];
              }
            return `?${c(t)}`;
          },
        },
        {
          kind: "method",
          key: "_checkParamType",
          value: function (r, e) {
            return "string" === r || "string?" === r;
          },
        },
      ],
    };
  },
  e
);
export { d as REDIRECTS };
