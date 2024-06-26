/*! For license information please see entrypoint.4szXpxNxoP4.js.LICENSE.txt */
var e,
  t,
  r,
  o,
  n,
  i,
  a = {
    4096: (e, t, r) => {
      r.d(t, {
        CO: () => a,
        Rw: () => m,
        p3: () => v,
        uO: () => b,
        wK: () => i,
      });
      var o = r(58579);
      const n = (e) => {
          const t = Math.round(Math.min(Math.max(e, 0), 255)).toString(16);
          return 1 === t.length ? `0${t}` : t;
        },
        i = (e) => (
          (e = (0, o.R)(e)),
          [
            parseInt(e.substring(0, 2), 16),
            parseInt(e.substring(2, 4), 16),
            parseInt(e.substring(4, 6), 16),
          ]
        ),
        a = (e) => `#${n(e[0])}${n(e[1])}${n(e[2])}`,
        s = 0.95047,
        l = 1.08883,
        c = 0.137931034,
        h = 0.12841855,
        d = (e) =>
          (e /= 255) <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4,
        u = (e) => (e > 0.008856452 ? e ** (1 / 3) : e / h + c),
        p = (e) =>
          255 * (e <= 0.00304 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055),
        f = (e) => (e > 0.206896552 ? e * e * e : h * (e - c)),
        m = (e) => {
          const [t, r, o] = ((e) => {
              let [t, r, o] = e;
              return (
                (t = d(t)),
                (r = d(r)),
                (o = d(o)),
                [
                  u((0.4124564 * t + 0.3575761 * r + 0.1804375 * o) / s),
                  u((0.2126729 * t + 0.7151522 * r + 0.072175 * o) / 1),
                  u((0.0193339 * t + 0.119192 * r + 0.9503041 * o) / l),
                ]
              );
            })(e),
            n = 116 * r - 16;
          return [n < 0 ? 0 : n, 500 * (t - r), 200 * (r - o)];
        },
        v = (e) => {
          const [t, r, o] = e;
          let n = (t + 16) / 116,
            i = isNaN(r) ? n : n + r / 500,
            a = isNaN(o) ? n : n - o / 200;
          (n = 1 * f(n)), (i = s * f(i)), (a = l * f(a));
          return [
            p(3.2404542 * i - 1.5371385 * n - 0.4985314 * a),
            p(-0.969266 * i + 1.8760108 * n + 0.041556 * a),
            p(0.0556434 * i - 0.2040259 * n + 1.0572252 * a),
          ];
        },
        b = (e) => {
          const t = v(e);
          return a(t);
        };
    },
    58579: (e, t, r) => {
      r.d(t, { R: () => o, o: () => n });
      const o = (e) => {
          if (6 === (e = e.replace("#", "")).length) return e;
          let t = "";
          for (const r of e) t += r + r;
          return t;
        },
        n = (e, t, r = 50) => {
          let n = "";
          (e = o(e)), (t = o(t));
          for (let o = 0; o <= 5; o += 2) {
            const i = parseInt(e.substr(o, 2), 16),
              a = parseInt(t.substr(o, 2), 16);
            let s = Math.floor(a + (r / 100) * (i - a)).toString(16);
            for (; s.length < 2; ) s = "0" + s;
            n += s;
          }
          return `#${n}`;
        };
    },
    18394: (e, t, r) => {
      r.d(t, { B: () => o });
      const o = (e, t, r, o) => {
        (o = o || {}), (r = null == r ? {} : r);
        const n = new Event(t, {
          bubbles: void 0 === o.bubbles || o.bubbles,
          cancelable: Boolean(o.cancelable),
          composed: void 0 === o.composed || o.composed,
        });
        return (n.detail = r), e.dispatchEvent(n), n;
      };
    },
    67684: (e, t, r) => {
      r.d(t, { E: () => n });
      var o = r(14703);
      const n =
        window.name === o.y ? window : parent.name === o.y ? parent : top;
    },
    6429: (e, t, r) => {
      r.d(t, { J: () => o });
      const o = (e, t = !0) => {
        if (
          e.defaultPrevented ||
          0 !== e.button ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey
        )
          return;
        const r = e.composedPath().find((e) => "A" === e.tagName);
        if (
          !r ||
          r.target ||
          r.hasAttribute("download") ||
          "external" === r.getAttribute("rel")
        )
          return;
        let o = r.href;
        if (!o || -1 !== o.indexOf("mailto:")) return;
        const n = window.location,
          i = n.origin || n.protocol + "//" + n.host;
        return 0 === o.indexOf(i) && ((o = o.substr(i.length)), "#" !== o)
          ? (t && e.preventDefault(), o)
          : void 0;
      };
    },
    38480: (e, t, r) => {
      r.d(t, { c: () => a });
      var o = r(67684);
      r(60625);
      let n;
      var i = r(18394);
      const a = (e, t) => {
        const r = (null == t ? void 0 : t.replace) || !1;
        var s;
        n
          ? n.then(() => a(e, t))
          : (r
              ? o.E.history.replaceState(
                  null !== (s = o.E.history.state) && void 0 !== s && s.root
                    ? { root: !0 }
                    : null,
                  "",
                  e
                )
              : o.E.history.pushState(null, "", e),
            (0, i.B)(o.E, "location-changed", { replace: r }));
      };
    },
    2537: (e, t, r) => {
      r.d(t, { y: () => o });
      const o = () =>
        new Promise((e) => {
          var t;
          (t = e), requestAnimationFrame(() => setTimeout(t, 0));
        });
    },
    14703: (e, t, r) => {
      r.d(t, { y: () => o });
      const o = "ha-main-window";
    },
    50345: (e, t, r) => {
      r.d(t, {
        FS: () => s,
        c_: () => i,
        t6: () => a,
        y4: () => o,
        zt: () => n,
      });
      let o = (function (e) {
          return (
            (e.language = "language"),
            (e.system = "system"),
            (e.comma_decimal = "comma_decimal"),
            (e.decimal_comma = "decimal_comma"),
            (e.space_comma = "space_comma"),
            (e.none = "none"),
            e
          );
        })({}),
        n = (function (e) {
          return (
            (e.language = "language"),
            (e.system = "system"),
            (e.am_pm = "12"),
            (e.twenty_four = "24"),
            e
          );
        })({}),
        i = (function (e) {
          return (e.local = "local"), (e.server = "server"), e;
        })({}),
        a = (function (e) {
          return (
            (e.language = "language"),
            (e.system = "system"),
            (e.DMY = "DMY"),
            (e.MDY = "MDY"),
            (e.YMD = "YMD"),
            e
          );
        })({}),
        s = (function (e) {
          return (
            (e.language = "language"),
            (e.monday = "monday"),
            (e.tuesday = "tuesday"),
            (e.wednesday = "wednesday"),
            (e.thursday = "thursday"),
            (e.friday = "friday"),
            (e.saturday = "saturday"),
            (e.sunday = "sunday"),
            e
          );
        })({});
    },
    60625: (e, t, r) => {
      r.d(t, { gA: () => l, lD: () => h });
      var o = r(67684);
      const n = (e, t, r = true) => {
          var o;
          if (!e || e === document.body) return null;
          if (
            (e = null !== (o = e.assignedSlot) && void 0 !== o ? o : e)
              .parentElement
          )
            e = e.parentElement;
          else {
            const t = e.getRootNode();
            e = t instanceof ShadowRoot ? t.host : null;
          }
          return (r ? Object.prototype.hasOwnProperty.call(e, t) : e && t in e)
            ? e
            : n(e, t, r);
        },
        i = (e = document) => {
          var t;
          return null !== (t = e.activeElement) &&
            void 0 !== t &&
            null !== (t = t.shadowRoot) &&
            void 0 !== t &&
            t.activeElement
            ? i(e.activeElement.shadowRoot)
            : e.activeElement;
        };
      var a = r(2537);
      const s = {},
        l = Symbol.for("HA focus target"),
        c = async (e, t, r, a, c, h = !0) => {
          var u;
          if (!(r in s)) {
            if (!c) return !1;
            s[r] = {
              element: c().then(() => {
                const t = document.createElement(r);
                return e.provideHass(t), t;
              }),
            };
          }
          if (
            (null !== (u = o.E.history.state) && void 0 !== u && u.replaced
              ? ((s[r].closedFocusTargets =
                  s[o.E.history.state.dialog].closedFocusTargets),
                delete s[o.E.history.state.dialog].closedFocusTargets)
              : (s[r].closedFocusTargets = ((e, t, r = !0) => {
                  const o = new Set();
                  for (; e; ) o.add(e), (e = n(e, t, r));
                  return o;
                })(i(), l)),
            h)
          ) {
            var p, f;
            o.E.history.replaceState(
              {
                dialog: r,
                open: !1,
                oldState:
                  null !== (p = o.E.history.state) &&
                  void 0 !== p &&
                  p.open &&
                  (null === (f = o.E.history.state) || void 0 === f
                    ? void 0
                    : f.dialog) !== r
                    ? o.E.history.state
                    : null,
              },
              ""
            );
            try {
              o.E.history.pushState(
                { dialog: r, dialogParams: a, open: !0 },
                ""
              );
            } catch (e) {
              o.E.history.pushState(
                { dialog: r, dialogParams: null, open: !0 },
                ""
              );
            }
          }
          const m = await s[r].element;
          return (
            m.addEventListener("dialog-closed", d),
            t.appendChild(m),
            m.showDialog(a),
            !0
          );
        },
        h = (e, t) => {
          e.addEventListener("show-dialog", (r) => {
            const {
              dialogTag: o,
              dialogImport: n,
              dialogParams: i,
              addHistory: a,
            } = r.detail;
            c(e, t, o, i, n, a);
          });
        },
        d = async (e) => {
          const t = s[e.detail.dialog].closedFocusTargets;
          if ((delete s[e.detail.dialog].closedFocusTargets, !t)) return;
          let r = i();
          r instanceof HTMLElement && r.blur(), await (0, a.y)();
          for (const e of t)
            if (
              e instanceof HTMLElement &&
              (e.focus(), (r = i()), r && r !== document.body)
            )
              return;
        };
    },
    53285: (e, t, r) => {
      r.d(t, { H: () => s, n: () => a });
      const o = [
          "DateTimeFormat",
          "DisplayNames",
          "ListFormat",
          "NumberFormat",
          "RelativeTimeFormat",
        ],
        n = new Set(),
        i = async (e, t, r = "__addLocaleData") => {
          var o;
          if (
            "function" ==
            typeof (null === (o = Intl[e]) || void 0 === o ? void 0 : o[r])
          ) {
            const o = await fetch(
              `/hacsfiles/frontend/static/locale-data/intl-${e.toLowerCase()}/${t}.json`
            );
            o.ok && Intl[e][r](await o.json());
          }
        },
        a = async (e) => {
          n.has(e) || (n.add(e), await Promise.all(o.map((t) => i(t, e))));
        },
        s = () => i("DateTimeFormat", "add-all-tz", "__addTZData");
    },
    29950: (e, t, r) => {
      r.d(t, { $c: () => s, Qx: () => i, k1: () => n, yu: () => a });
      var o = r(5095);
      const n = o.iv`button.link{background:0 0;color:inherit;border:none;padding:0;font:inherit;text-align:left;text-decoration:underline;cursor:pointer;outline:0}`,
        i = o.iv`:host{font-family:var(--paper-font-body1_-_font-family);-webkit-font-smoothing:var(--paper-font-body1_-_-webkit-font-smoothing);font-size:var(--paper-font-body1_-_font-size);font-weight:var(--paper-font-body1_-_font-weight);line-height:var(--paper-font-body1_-_line-height)}app-header div[sticky]{height:48px}app-toolbar [main-title]{margin-left:20px}h1{font-family:var(--paper-font-headline_-_font-family);-webkit-font-smoothing:var(--paper-font-headline_-_-webkit-font-smoothing);white-space:var(--paper-font-headline_-_white-space);overflow:var(--paper-font-headline_-_overflow);text-overflow:var(--paper-font-headline_-_text-overflow);font-size:var(--paper-font-headline_-_font-size);font-weight:var(--paper-font-headline_-_font-weight);line-height:var(--paper-font-headline_-_line-height)}h2{font-family:var(--paper-font-title_-_font-family);-webkit-font-smoothing:var(--paper-font-title_-_-webkit-font-smoothing);white-space:var(--paper-font-title_-_white-space);overflow:var(--paper-font-title_-_overflow);text-overflow:var(--paper-font-title_-_text-overflow);font-size:var(--paper-font-title_-_font-size);font-weight:var(--paper-font-title_-_font-weight);line-height:var(--paper-font-title_-_line-height)}h3{font-family:var(--paper-font-subhead_-_font-family);-webkit-font-smoothing:var(--paper-font-subhead_-_-webkit-font-smoothing);white-space:var(--paper-font-subhead_-_white-space);overflow:var(--paper-font-subhead_-_overflow);text-overflow:var(--paper-font-subhead_-_text-overflow);font-size:var(--paper-font-subhead_-_font-size);font-weight:var(--paper-font-subhead_-_font-weight);line-height:var(--paper-font-subhead_-_line-height)}a{color:var(--primary-color)}.secondary{color:var(--secondary-text-color)}.error{color:var(--error-color)}.warning{color:var(--error-color)}mwc-button.warning{--mdc-theme-primary:var(--error-color)}${n} .card-actions a{text-decoration:none}.card-actions .warning{--mdc-theme-primary:var(--error-color)}.layout.horizontal,.layout.vertical{display:flex}.layout.inline{display:inline-flex}.layout.horizontal{flex-direction:row}.layout.vertical{flex-direction:column}.layout.wrap{flex-wrap:wrap}.layout.no-wrap{flex-wrap:nowrap}.layout.center,.layout.center-center{align-items:center}.layout.bottom{align-items:flex-end}.layout.center-center,.layout.center-justified{justify-content:center}.flex{flex:1;flex-basis:0.000000001px}.flex-auto{flex:1 1 auto}.flex-none{flex:none}.layout.justified{justify-content:space-between}`,
        a = o.iv`ha-dialog{--mdc-dialog-min-width:400px;--mdc-dialog-max-width:600px;--mdc-dialog-max-width:min(600px, 95vw);--justify-action-buttons:space-between}ha-dialog .form{color:var(--primary-text-color)}a{color:var(--primary-color)}@media all and (max-width:450px),all and (max-height:500px){ha-dialog{--mdc-dialog-min-width:calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );--mdc-dialog-max-width:calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );--mdc-dialog-min-height:100%;--mdc-dialog-max-height:100%;--vertical-align-dialog:flex-end;--ha-dialog-border-radius:0}}ha-button.warning,mwc-button.warning{--mdc-theme-primary:var(--error-color)}.error{color:var(--error-color)}`,
        s = o.iv`.ha-scrollbar::-webkit-scrollbar{width:.4rem;height:.4rem}.ha-scrollbar::-webkit-scrollbar-thumb{-webkit-border-radius:4px;border-radius:4px;background:var(--scrollbar-thumb-color)}.ha-scrollbar{overflow-y:auto;scrollbar-color:var(--scrollbar-thumb-color) transparent;scrollbar-width:thin}`;
      o.iv`body{background-color:var(--primary-background-color);color:var(--primary-text-color);height:calc(100vh - 32px);width:100vw}`;
    },
    80411: (e, t, r) => {
      r.d(t, { o: () => o });
      const o = JSON.parse(
        '{"translations":{"bg_BG":{"hash":"1e82b34ab9f0c55312a66ff37f4f18c0"},"cs":{"nativeName":"Čeština","hash":"31e4be3dd5593aa2b434e709e1924229"},"da":{"nativeName":"Dansk","hash":"16776c3d28b67bf99a0c73fdbc0cfae4"},"de":{"nativeName":"Deutsch","hash":"dac679b6d76656504db5a91ad9e996d8"},"el":{"nativeName":"Ελληνικά","hash":"636cdf49331449eea2267d12d169616a"},"en":{"nativeName":"English","hash":"d6bde56fa1fdd9560a9bac962dc3543c"},"es":{"nativeName":"Español","hash":"bcd255337b52b53ea7afcc2a78fae584"},"et":{"nativeName":"Eesti","hash":"ea2bb7b310ab97c3cec49056310af86c"},"fi":{"nativeName":"Suomi","hash":"d1d844622077edfc387e659e32a9e83d"},"fr":{"nativeName":"Français","hash":"dcb5044a8e6eebfe652f69faad4e44b0"},"he":{"nativeName":"עברית","isRTL":true,"hash":"0962bb286801f841fac425f5c7bad29c"},"hu":{"nativeName":"Magyar","hash":"a40c39ce75fa085bf90129f555351c22"},"id":{"nativeName":"Indonesia","hash":"759d98753602215aa6897061b5875a97"},"it":{"nativeName":"Italiano","hash":"a1659f16073143e8964ba0fc6fbc62bc"},"nb":{"nativeName":"Norsk Bokmål","hash":"803518a17950a96001d7e15c6a04fa17"},"nl":{"nativeName":"Nederlands","hash":"f2c983349dd1ca417e28b352c7aa3bb2"},"nn":{"nativeName":"Norsk Nynorsk","hash":"90030a3996f62d6bb24ed106f01fa99e"},"pl":{"nativeName":"Polski","hash":"26f9070d4cb5611ac866e78bbc1dbd9c"},"pt":{"nativeName":"Português","hash":"fe330cc04846a0b58c036d0b957ae2a6"},"pt_BR":{"hash":"c3b7972f9e2dc120fd3ce1eb4cd2b061"},"ro":{"nativeName":"Română","hash":"7af39cc2c487146a76ced383bf60f0e8"},"ru":{"nativeName":"Русский","hash":"7c2555c3e35f5b6595873486f1a0d3ce"},"sk":{"nativeName":"Slovenčina","hash":"b048ba5e09091bd590be3b6800cea189"},"sl":{"nativeName":"Slovenščina","hash":"03e1f0b3843d8e0e39acb0b5272d90e1"},"sv":{"nativeName":"Svenska","hash":"ade387c9b691dc186b0513eaa3bfff63"},"translationMetadata":{"hash":"95f1b3a12ca6cb0a0c0d83fe10bebb95"},"vi":{"nativeName":"Tiếng Việt","hash":"ceabf4069169cd826b9370133afbb433"},"zh_Hans":{"hash":"626d19b777e6c4133e2df9db2716c07e"}}}'
      );
    },
    11674: (e, t, r) => {
      r.d(t, { i0: () => h, sS: () => c });
      r(50345);
      var o = r(80411);
      const n = "/hacsfiles/frontend/static/translations",
        i = window.localStorage || {},
        a = {};
      const s = {
        "zh-cn": "zh-Hans",
        "zh-sg": "zh-Hans",
        "zh-my": "zh-Hans",
        "zh-tw": "zh-Hant",
        "zh-hk": "zh-Hant",
        "zh-mo": "zh-Hant",
        zh: "zh-Hant",
      };
      function l(e) {
        if (e in o.o.translations) return e;
        const t = e.toLowerCase();
        if (t in s) return s[t];
        const r = Object.keys(o.o.translations).find(
          (e) => e.toLowerCase() === t
        );
        return r || (e.includes("-") ? l(e.split("-")[0]) : void 0);
      }
      function c() {
        let e = null;
        if (i.selectedLanguage)
          try {
            const t = JSON.parse(i.selectedLanguage);
            if (t && ((e = l(t)), e)) return e;
          } catch (e) {}
        if (navigator.languages)
          for (const t of navigator.languages) if (((e = l(t)), e)) return e;
        return (e = l(navigator.language)), e || "en";
      }
      async function h(e, t) {
        const r = o.o.translations[t];
        if (null == r || !r.hash) {
          if ("en" !== t) return h(e, "en");
          throw new Error("Language en is not found in metadata");
        }
        const i = `${e ? e + "/" : ""}${t}-${r.hash}.json`;
        return (
          a[i] ||
            (a[i] = (async function (e) {
              const t = await fetch(`${n}/${e}`, {
                credentials: "same-origin",
              });
              if (!t.ok)
                throw new Error(
                  `Fail to fetch translation ${e}: HTTP response status is ${t.status}`
                );
              return t.json();
            })(i)
              .then((e) => ({ language: t, data: e }))
              .catch(
                (r) => (
                  delete a[i], "en" !== t ? h(e, "en") : Promise.reject(r)
                )
              )),
          a[i]
        );
      }
    },
    56646: () => {
      window.JSCompiler_renameProperty = function (e, t) {
        return e;
      };
    },
    42687: (e, t, r) => {
      r.d(t, { Kk: () => s, Rq: () => l, iY: () => c });
      r(56646);
      let o,
        n,
        i = /(url\()([^)]*)(\))/g,
        a = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/;
      function s(e, t) {
        if (e && a.test(e)) return e;
        if ("//" === e) return e;
        if (void 0 === o) {
          o = !1;
          try {
            const e = new URL("b", "http://a");
            (e.pathname = "c%20d"), (o = "http://a/c%20d" === e.href);
          } catch (e) {}
        }
        if ((t || (t = document.baseURI || window.location.href), o))
          try {
            return new URL(e, t).href;
          } catch (t) {
            return e;
          }
        return (
          n ||
            ((n = document.implementation.createHTMLDocument("temp")),
            (n.base = n.createElement("base")),
            n.head.appendChild(n.base),
            (n.anchor = n.createElement("a")),
            n.body.appendChild(n.anchor)),
          (n.base.href = t),
          (n.anchor.href = e),
          n.anchor.href || e
        );
      }
      function l(e, t) {
        return e.replace(i, function (e, r, o, n) {
          return r + "'" + s(o.replace(/["']/g, ""), t) + "'" + n;
        });
      }
      function c(e) {
        return e.substring(0, e.lastIndexOf("/") + 1);
      }
    },
    74460: (e, t, r) => {
      r.d(t, {
        FV: () => i,
        HY: () => p,
        Hr: () => u,
        XN: () => l,
        ZN: () => c,
        a2: () => d,
        ew: () => y,
        gx: () => b,
        ls: () => f,
        md: () => g,
        nL: () => h,
        sM: () => a,
        v1: () => s,
        xj: () => v,
      });
      r(56646);
      var o = r(42687);
      const n = !window.ShadyDOM || !window.ShadyDOM.inUse,
        i =
          (Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss),
          window.customElements.polyfillWrapFlushCallback,
          n &&
            "adoptedStyleSheets" in Document.prototype &&
            "replaceSync" in CSSStyleSheet.prototype &&
            (() => {
              try {
                const e = new CSSStyleSheet();
                e.replaceSync("");
                const t = document.createElement("div");
                return (
                  t.attachShadow({ mode: "open" }),
                  (t.shadowRoot.adoptedStyleSheets = [e]),
                  t.shadowRoot.adoptedStyleSheets[0] === e
                );
              } catch (e) {
                return !1;
              }
            })());
      let a =
        (window.Polymer && window.Polymer.rootPath) ||
        (0, o.iY)(document.baseURI || window.location.href);
      let s = (window.Polymer && window.Polymer.sanitizeDOMValue) || void 0;
      window.Polymer && window.Polymer.setPassiveTouchGestures;
      let l = (window.Polymer && window.Polymer.strictTemplatePolicy) || !1;
      let c =
        (window.Polymer && window.Polymer.allowTemplateFromDomModule) || !1;
      let h = (window.Polymer && window.Polymer.legacyOptimizations) || !1;
      let d = (window.Polymer && window.Polymer.legacyWarnings) || !1;
      let u = (window.Polymer && window.Polymer.syncInitialRender) || !1;
      let p = (window.Polymer && window.Polymer.legacyUndefined) || !1;
      let f = (window.Polymer && window.Polymer.orderedComputed) || !1;
      let m = !0;
      const v = function (e) {
        m = e;
      };
      let b = (window.Polymer && window.Polymer.removeNestedTemplates) || !1;
      let y = (window.Polymer && window.Polymer.fastDomIf) || !1;
      window.Polymer && window.Polymer.suppressTemplateNotifications;
      window.Polymer && window.Polymer.legacyNoObservedAttributes;
      let g =
        (window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS) ||
        !1;
    },
    14516: (e, t, r) => {
      r.d(t, { Z: () => i });
      var o =
        Number.isNaN ||
        function (e) {
          return "number" == typeof e && e != e;
        };
      function n(e, t) {
        if (e.length !== t.length) return !1;
        for (var r = 0; r < e.length; r++)
          if (((n = e[r]), (i = t[r]), !(n === i || (o(n) && o(i))))) return !1;
        var n, i;
        return !0;
      }
      function i(e, t) {
        void 0 === t && (t = n);
        var r = null;
        function o() {
          for (var o = [], n = 0; n < arguments.length; n++)
            o[n] = arguments[n];
          if (r && r.lastThis === this && t(o, r.lastArgs)) return r.lastResult;
          var i = e.apply(this, o);
          return (r = { lastResult: i, lastArgs: o, lastThis: this }), i;
        }
        return (
          (o.clear = function () {
            r = null;
          }),
          o
        );
      }
    },
    84643: (e, t, r) => {
      r.d(t, { p: () => o });
      let o = (function (e) {
        return (
          (e.CONFIG = "hacs_dispatch_config"),
          (e.ERROR = "hacs_dispatch_error"),
          (e.RELOAD = "hacs_dispatch_reload"),
          (e.REPOSITORY = "hacs_dispatch_repository"),
          (e.STAGE = "hacs_dispatch_stage"),
          (e.STARTUP = "hacs_dispatch_startup"),
          (e.STATUS = "hacs_dispatch_status"),
          e
        );
      })({});
    },
    46797: (e, t, r) => {
      r.d(t, {
        CE: () => d,
        EK: () => s,
        ER: () => n,
        NA: () => a,
        VP: () => h,
        W: () => o,
        jN: () => c,
        jW: () => i,
        yx: () => l,
      });
      const o = async (e) =>
          e.connection.sendMessagePromise({ type: "hacs/info" }),
        n = async (e) =>
          e.connection.sendMessagePromise({ type: "hacs/repositories/list" }),
        i = async (e, t) =>
          e.connection.sendMessagePromise({
            type: "hacs/repository/remove",
            repository: t,
          }),
        a = async (e, t, r) =>
          e.connection.sendMessagePromise({
            type: "hacs/repositories/add",
            repository: t,
            category: r,
          }),
        s = async (e, t, r) =>
          e.connection.sendMessagePromise({
            type: "hacs/repository/beta",
            repository: t,
            show_beta: r,
          }),
        l = async (e, t) =>
          e.connection.sendMessagePromise({
            type: "hacs/repository/refresh",
            repository: t,
          }),
        c = async (e, t) =>
          e.connection.sendMessagePromise({
            type: "hacs/repositories/remove",
            repository: t,
          }),
        h = async (e, t) =>
          e.connection.sendMessagePromise({
            type: "hacs/repositories/clear_new",
            categories: t.info.categories,
          }),
        d = (e, t, r) =>
          e.connection.subscribeMessage(t, {
            type: "hacs/subscribe",
            signal: r,
          });
    },
    61422: (e, t, r) => {
      r.d(t, { w: () => c });
      var o = r(5095);
      const n = o.iv`a{text-decoration:var(--hcv-text-decoration-link);color:var(--hcv-text-color-link)}`,
        i = o.iv`ha-svg-icon{color:var(--hcv-color-icon)}`,
        a = o.iv`mwc-button[raised]{border-radius:4px}mwc-button[raised]>ha-circular-progress{--mdc-theme-primary:var(--hcv-text-color-primary)}`;
      o.iv`::-webkit-scrollbar{width:.4rem;height:.4rem}::-webkit-scrollbar-track{-webkit-border-radius:4px;border-radius:4px;background:var(--scrollbar-thumb-color)}::-webkit-scrollbar-thumb{background-color:var(--accent-color);border-radius:.3em}.scroll{overflow-y:auto;scrollbar-color:var(--scrollbar-thumb-color) transparent;scrollbar-width:thin}`;
      var s = r(29950);
      const l = o.iv`.warning{color:var(--hcv-color-warning)}.pending_update{color:var(--hcv-color-update)}.error,.pending_restart,.uninstall{color:var(--hcv-color-error);--mdc-theme-primary:var(--hcv-color-error)}.header{opacity:var(--dark-primary-opacity);padding:8px 0 4px 16px}code,pre{background-color:var(--markdown-code-background-color,none);border-radius:3px}`,
        c = [s.Qx, i, l, n, a];
    },
    23792: (e, t, r) => {
      r.d(t, { J: () => o });
      class o {
        constructor(e) {
          (this.prefix = void 0), (this.prefix = e ? `[HACS.${e}]` : "[HACS]");
        }
        info(e) {
          this.log(e);
        }
        log(e) {
          console.log(this.prefix, e);
        }
        debug(e) {
          console.debug(this.prefix, e);
        }
        warn(e) {
          console.warn(this.prefix, e);
        }
        error(e) {
          console.error(this.prefix, e);
        }
      }
    },
    309: (e, t, r) => {
      function o(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, o = new Array(t); r < t; r++) o[r] = e[r];
        return o;
      }
      function n(e) {
        return (
          (function (e) {
            if (Array.isArray(e)) return e;
          })(e) ||
          (function (e) {
            if (
              ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
              null != e["@@iterator"]
            )
              return Array.from(e);
          })(e) ||
          (function (e, t) {
            if (e) {
              if ("string" == typeof e) return o(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return (
                "Object" === r && e.constructor && (r = e.constructor.name),
                "Map" === r || "Set" === r
                  ? Array.from(e)
                  : "Arguments" === r ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                  ? o(e, t)
                  : void 0
              );
            }
          })(e) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          })()
        );
      }
      function i(e) {
        return (
          (i =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          i(e)
        );
      }
      function a(e) {
        var t = (function (e, t) {
          if ("object" != i(e) || !e) return e;
          var r = e[Symbol.toPrimitive];
          if (void 0 !== r) {
            var o = r.call(e, t || "default");
            if ("object" != i(o)) return o;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t ? String : Number)(e);
        })(e, "string");
        return "symbol" == i(t) ? t : String(t);
      }
      function s(e, t, r, o) {
        var n = l();
        if (o) for (var i = 0; i < o.length; i++) n = o[i](n);
        var a = t(function (e) {
            n.initializeInstanceElements(e, s.elements);
          }, r),
          s = n.decorateClass(
            (function (e) {
              for (
                var t = [],
                  r = function (e) {
                    return (
                      "method" === e.kind &&
                      e.key === i.key &&
                      e.placement === i.placement
                    );
                  },
                  o = 0;
                o < e.length;
                o++
              ) {
                var n,
                  i = e[o];
                if ("method" === i.kind && (n = t.find(r)))
                  if (u(i.descriptor) || u(n.descriptor)) {
                    if (d(i) || d(n))
                      throw new ReferenceError(
                        "Duplicated methods (" + i.key + ") can't be decorated."
                      );
                    n.descriptor = i.descriptor;
                  } else {
                    if (d(i)) {
                      if (d(n))
                        throw new ReferenceError(
                          "Decorators can't be placed on different accessors with for the same property (" +
                            i.key +
                            ")."
                        );
                      n.decorators = i.decorators;
                    }
                    h(i, n);
                  }
                else t.push(i);
              }
              return t;
            })(a.d.map(c)),
            e
          );
        return (
          n.initializeClassElements(a.F, s.elements),
          n.runClassFinishers(a.F, s.finishers)
        );
      }
      function l() {
        l = function () {
          return e;
        };
        var e = {
          elementsDefinitionOrder: [["method"], ["field"]],
          initializeInstanceElements: function (e, t) {
            ["method", "field"].forEach(function (r) {
              t.forEach(function (t) {
                t.kind === r &&
                  "own" === t.placement &&
                  this.defineClassElement(e, t);
              }, this);
            }, this);
          },
          initializeClassElements: function (e, t) {
            var r = e.prototype;
            ["method", "field"].forEach(function (o) {
              t.forEach(function (t) {
                var n = t.placement;
                if (t.kind === o && ("static" === n || "prototype" === n)) {
                  var i = "static" === n ? e : r;
                  this.defineClassElement(i, t);
                }
              }, this);
            }, this);
          },
          defineClassElement: function (e, t) {
            var r = t.descriptor;
            if ("field" === t.kind) {
              var o = t.initializer;
              r = {
                enumerable: r.enumerable,
                writable: r.writable,
                configurable: r.configurable,
                value: void 0 === o ? void 0 : o.call(e),
              };
            }
            Object.defineProperty(e, t.key, r);
          },
          decorateClass: function (e, t) {
            var r = [],
              o = [],
              n = { static: [], prototype: [], own: [] };
            if (
              (e.forEach(function (e) {
                this.addElementPlacement(e, n);
              }, this),
              e.forEach(function (e) {
                if (!d(e)) return r.push(e);
                var t = this.decorateElement(e, n);
                r.push(t.element),
                  r.push.apply(r, t.extras),
                  o.push.apply(o, t.finishers);
              }, this),
              !t)
            )
              return { elements: r, finishers: o };
            var i = this.decorateConstructor(r, t);
            return o.push.apply(o, i.finishers), (i.finishers = o), i;
          },
          addElementPlacement: function (e, t, r) {
            var o = t[e.placement];
            if (!r && -1 !== o.indexOf(e.key))
              throw new TypeError("Duplicated element (" + e.key + ")");
            o.push(e.key);
          },
          decorateElement: function (e, t) {
            for (
              var r = [], o = [], n = e.decorators, i = n.length - 1;
              i >= 0;
              i--
            ) {
              var a = t[e.placement];
              a.splice(a.indexOf(e.key), 1);
              var s = this.fromElementDescriptor(e),
                l = this.toElementFinisherExtras((0, n[i])(s) || s);
              (e = l.element),
                this.addElementPlacement(e, t),
                l.finisher && o.push(l.finisher);
              var c = l.extras;
              if (c) {
                for (var h = 0; h < c.length; h++)
                  this.addElementPlacement(c[h], t);
                r.push.apply(r, c);
              }
            }
            return { element: e, finishers: o, extras: r };
          },
          decorateConstructor: function (e, t) {
            for (var r = [], o = t.length - 1; o >= 0; o--) {
              var n = this.fromClassDescriptor(e),
                i = this.toClassDescriptor((0, t[o])(n) || n);
              if (
                (void 0 !== i.finisher && r.push(i.finisher),
                void 0 !== i.elements)
              ) {
                e = i.elements;
                for (var a = 0; a < e.length - 1; a++)
                  for (var s = a + 1; s < e.length; s++)
                    if (
                      e[a].key === e[s].key &&
                      e[a].placement === e[s].placement
                    )
                      throw new TypeError(
                        "Duplicated element (" + e[a].key + ")"
                      );
              }
            }
            return { elements: e, finishers: r };
          },
          fromElementDescriptor: function (e) {
            var t = {
              kind: e.kind,
              key: e.key,
              placement: e.placement,
              descriptor: e.descriptor,
            };
            return (
              Object.defineProperty(t, Symbol.toStringTag, {
                value: "Descriptor",
                configurable: !0,
              }),
              "field" === e.kind && (t.initializer = e.initializer),
              t
            );
          },
          toElementDescriptors: function (e) {
            if (void 0 !== e)
              return n(e).map(function (e) {
                var t = this.toElementDescriptor(e);
                return (
                  this.disallowProperty(e, "finisher", "An element descriptor"),
                  this.disallowProperty(e, "extras", "An element descriptor"),
                  t
                );
              }, this);
          },
          toElementDescriptor: function (e) {
            var t = String(e.kind);
            if ("method" !== t && "field" !== t)
              throw new TypeError(
                'An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "' +
                  t +
                  '"'
              );
            var r = a(e.key),
              o = String(e.placement);
            if ("static" !== o && "prototype" !== o && "own" !== o)
              throw new TypeError(
                'An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "' +
                  o +
                  '"'
              );
            var n = e.descriptor;
            this.disallowProperty(e, "elements", "An element descriptor");
            var i = {
              kind: t,
              key: r,
              placement: o,
              descriptor: Object.assign({}, n),
            };
            return (
              "field" !== t
                ? this.disallowProperty(e, "initializer", "A method descriptor")
                : (this.disallowProperty(
                    n,
                    "get",
                    "The property descriptor of a field descriptor"
                  ),
                  this.disallowProperty(
                    n,
                    "set",
                    "The property descriptor of a field descriptor"
                  ),
                  this.disallowProperty(
                    n,
                    "value",
                    "The property descriptor of a field descriptor"
                  ),
                  (i.initializer = e.initializer)),
              i
            );
          },
          toElementFinisherExtras: function (e) {
            return {
              element: this.toElementDescriptor(e),
              finisher: p(e, "finisher"),
              extras: this.toElementDescriptors(e.extras),
            };
          },
          fromClassDescriptor: function (e) {
            var t = {
              kind: "class",
              elements: e.map(this.fromElementDescriptor, this),
            };
            return (
              Object.defineProperty(t, Symbol.toStringTag, {
                value: "Descriptor",
                configurable: !0,
              }),
              t
            );
          },
          toClassDescriptor: function (e) {
            var t = String(e.kind);
            if ("class" !== t)
              throw new TypeError(
                'A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "' +
                  t +
                  '"'
              );
            this.disallowProperty(e, "key", "A class descriptor"),
              this.disallowProperty(e, "placement", "A class descriptor"),
              this.disallowProperty(e, "descriptor", "A class descriptor"),
              this.disallowProperty(e, "initializer", "A class descriptor"),
              this.disallowProperty(e, "extras", "A class descriptor");
            var r = p(e, "finisher");
            return {
              elements: this.toElementDescriptors(e.elements),
              finisher: r,
            };
          },
          runClassFinishers: function (e, t) {
            for (var r = 0; r < t.length; r++) {
              var o = (0, t[r])(e);
              if (void 0 !== o) {
                if ("function" != typeof o)
                  throw new TypeError("Finishers must return a constructor.");
                e = o;
              }
            }
            return e;
          },
          disallowProperty: function (e, t, r) {
            if (void 0 !== e[t])
              throw new TypeError(r + " can't have a ." + t + " property.");
          },
        };
        return e;
      }
      function c(e) {
        var t,
          r = a(e.key);
        "method" === e.kind
          ? (t = {
              value: e.value,
              writable: !0,
              configurable: !0,
              enumerable: !1,
            })
          : "get" === e.kind
          ? (t = { get: e.value, configurable: !0, enumerable: !1 })
          : "set" === e.kind
          ? (t = { set: e.value, configurable: !0, enumerable: !1 })
          : "field" === e.kind &&
            (t = { configurable: !0, writable: !0, enumerable: !0 });
        var o = {
          kind: "field" === e.kind ? "field" : "method",
          key: r,
          placement: e.static
            ? "static"
            : "field" === e.kind
            ? "own"
            : "prototype",
          descriptor: t,
        };
        return (
          e.decorators && (o.decorators = e.decorators),
          "field" === e.kind && (o.initializer = e.value),
          o
        );
      }
      function h(e, t) {
        void 0 !== e.descriptor.get
          ? (t.descriptor.get = e.descriptor.get)
          : (t.descriptor.set = e.descriptor.set);
      }
      function d(e) {
        return e.decorators && e.decorators.length;
      }
      function u(e) {
        return void 0 !== e && !(void 0 === e.value && void 0 === e.writable);
      }
      function p(e, t) {
        var r = e[t];
        if (void 0 !== r && "function" != typeof r)
          throw new TypeError("Expected '" + t + "' to be a function");
        return r;
      }
      r.d(t, { Z: () => s });
    },
    34541: (e, t, r) => {
      r.d(t, { Z: () => n });
      var o = r(47838);
      function n() {
        return (
          (n =
            "undefined" != typeof Reflect && Reflect.get
              ? Reflect.get.bind()
              : function (e, t, r) {
                  var n = (function (e, t) {
                    for (
                      ;
                      !Object.prototype.hasOwnProperty.call(e, t) &&
                      null !== (e = (0, o.Z)(e));

                    );
                    return e;
                  })(e, t);
                  if (n) {
                    var i = Object.getOwnPropertyDescriptor(n, t);
                    return i.get
                      ? i.get.call(arguments.length < 3 ? e : r)
                      : i.value;
                  }
                }),
          n.apply(this, arguments)
        );
      }
    },
    47838: (e, t, r) => {
      function o(e) {
        return (
          (o = Object.setPrototypeOf
            ? Object.getPrototypeOf.bind()
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          o(e)
        );
      }
      r.d(t, { Z: () => o });
    },
    39030: (e, t, r) => {
      r.d(t, { eZ: () => o });
      const o =
        ({ finisher: e, descriptor: t }) =>
        (r, o) => {
          var n;
          if (void 0 === o) {
            const o = null !== (n = r.originalKey) && void 0 !== n ? n : r.key,
              i =
                null != t
                  ? {
                      kind: "method",
                      placement: "prototype",
                      key: o,
                      descriptor: t(r.key),
                    }
                  : { ...r, key: o };
            return (
              null != e &&
                (i.finisher = function (t) {
                  e(t, o);
                }),
              i
            );
          }
          {
            const n = r.constructor;
            void 0 !== t && Object.defineProperty(r, o, t(o)),
              null == e || e(n, o);
          }
        };
    },
    5701: (e, t, r) => {
      r.d(t, { C: () => i });
      const o = (e, t) =>
          "method" === t.kind && t.descriptor && !("value" in t.descriptor)
            ? {
                ...t,
                finisher(r) {
                  r.createProperty(t.key, e);
                },
              }
            : {
                kind: "field",
                key: Symbol(),
                placement: "own",
                descriptor: {},
                originalKey: t.key,
                initializer() {
                  "function" == typeof t.initializer &&
                    (this[t.key] = t.initializer.call(this));
                },
                finisher(r) {
                  r.createProperty(t.key, e);
                },
              },
        n = (e, t, r) => {
          t.constructor.createProperty(r, e);
        };
      function i(e) {
        return (t, r) => (void 0 !== r ? n(e, t, r) : o(e, t));
      }
    },
    95260: (e, t, r) => {
      r.d(t, {
        Mo: () => o,
        hO: () => l,
        Cb: () => n.C,
        IO: () => c,
        Kt: () => h,
        NH: () => p,
        vZ: () => f,
        GC: () => d,
        SB: () => i,
      });
      const o = (e) => (t) =>
        "function" == typeof t
          ? ((e, t) => (customElements.define(e, t), t))(e, t)
          : ((e, t) => {
              const { kind: r, elements: o } = t;
              return {
                kind: r,
                elements: o,
                finisher(t) {
                  customElements.define(e, t);
                },
              };
            })(e, t);
      var n = r(5701);
      function i(e) {
        return (0, n.C)({ ...e, state: !0 });
      }
      var a,
        s = r(39030);
      function l(e) {
        return (0, s.eZ)({
          finisher: (t, r) => {
            Object.assign(t.prototype[r], e);
          },
        });
      }
      function c(e, t) {
        return (0, s.eZ)({
          descriptor: (r) => {
            const o = {
              get() {
                var t, r;
                return null !==
                  (r =
                    null === (t = this.renderRoot) || void 0 === t
                      ? void 0
                      : t.querySelector(e)) && void 0 !== r
                  ? r
                  : null;
              },
              enumerable: !0,
              configurable: !0,
            };
            if (t) {
              const t = "symbol" == typeof r ? Symbol() : "__" + r;
              o.get = function () {
                var r, o;
                return (
                  void 0 === this[t] &&
                    (this[t] =
                      null !==
                        (o =
                          null === (r = this.renderRoot) || void 0 === r
                            ? void 0
                            : r.querySelector(e)) && void 0 !== o
                        ? o
                        : null),
                  this[t]
                );
              };
            }
            return o;
          },
        });
      }
      function h(e) {
        return (0, s.eZ)({
          descriptor: (t) => ({
            get() {
              var t, r;
              return null !==
                (r =
                  null === (t = this.renderRoot) || void 0 === t
                    ? void 0
                    : t.querySelectorAll(e)) && void 0 !== r
                ? r
                : [];
            },
            enumerable: !0,
            configurable: !0,
          }),
        });
      }
      function d(e) {
        return (0, s.eZ)({
          descriptor: (t) => ({
            async get() {
              var t;
              return (
                await this.updateComplete,
                null === (t = this.renderRoot) || void 0 === t
                  ? void 0
                  : t.querySelector(e)
              );
            },
            enumerable: !0,
            configurable: !0,
          }),
        });
      }
      const u =
        null !=
        (null === (a = window.HTMLSlotElement) || void 0 === a
          ? void 0
          : a.prototype.assignedElements)
          ? (e, t) => e.assignedElements(t)
          : (e, t) =>
              e
                .assignedNodes(t)
                .filter((e) => e.nodeType === Node.ELEMENT_NODE);
      function p(e) {
        const { slot: t, selector: r } = null != e ? e : {};
        return (0, s.eZ)({
          descriptor: (o) => ({
            get() {
              var o;
              const n = "slot" + (t ? `[name=${t}]` : ":not([name])"),
                i =
                  null === (o = this.renderRoot) || void 0 === o
                    ? void 0
                    : o.querySelector(n),
                a = null != i ? u(i, e) : [];
              return r ? a.filter((e) => e.matches(r)) : a;
            },
            enumerable: !0,
            configurable: !0,
          }),
        });
      }
      function f(e, t, r) {
        let o,
          n = e;
        return (
          "object" == typeof e ? ((n = e.slot), (o = e)) : (o = { flatten: t }),
          r
            ? p({ slot: n, flatten: t, selector: r })
            : (0, s.eZ)({
                descriptor: (e) => ({
                  get() {
                    var e, t;
                    const r = "slot" + (n ? `[name=${n}]` : ":not([name])"),
                      i =
                        null === (e = this.renderRoot) || void 0 === e
                          ? void 0
                          : e.querySelector(r);
                    return null !==
                      (t = null == i ? void 0 : i.assignedNodes(o)) &&
                      void 0 !== t
                      ? t
                      : [];
                  },
                  enumerable: !0,
                  configurable: !0,
                }),
              })
        );
      }
    },
    5095: (e, t, r) => {
      r.d(t, {
        c3: () => s,
        oi: () => he,
        fl: () => _,
        iv: () => c,
        dy: () => j,
        sk: () => ue,
        Jb: () => V,
        Ld: () => Y,
        sY: () => se,
        YP: () => z,
        $m: () => l,
      });
      const o = window,
        n =
          o.ShadowRoot &&
          (void 0 === o.ShadyCSS || o.ShadyCSS.nativeShadow) &&
          "adoptedStyleSheets" in Document.prototype &&
          "replace" in CSSStyleSheet.prototype,
        i = Symbol(),
        a = new WeakMap();
      class s {
        constructor(e, t, r) {
          if (((this._$cssResult$ = !0), r !== i))
            throw Error(
              "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
            );
          (this.cssText = e), (this.t = t);
        }
        get styleSheet() {
          let e = this.o;
          const t = this.t;
          if (n && void 0 === e) {
            const r = void 0 !== t && 1 === t.length;
            r && (e = a.get(t)),
              void 0 === e &&
                ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
                r && a.set(t, e));
          }
          return e;
        }
        toString() {
          return this.cssText;
        }
      }
      const l = (e) => new s("string" == typeof e ? e : e + "", void 0, i),
        c = (e, ...t) => {
          const r =
            1 === e.length
              ? e[0]
              : t.reduce(
                  (t, r, o) =>
                    t +
                    ((e) => {
                      if (!0 === e._$cssResult$) return e.cssText;
                      if ("number" == typeof e) return e;
                      throw Error(
                        "Value passed to 'css' function must be a 'css' function result: " +
                          e +
                          ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                      );
                    })(r) +
                    e[o + 1],
                  e[0]
                );
          return new s(r, e, i);
        },
        h = n
          ? (e) => e
          : (e) =>
              e instanceof CSSStyleSheet
                ? ((e) => {
                    let t = "";
                    for (const r of e.cssRules) t += r.cssText;
                    return l(t);
                  })(e)
                : e;
      var d;
      const u = window,
        p = u.trustedTypes,
        f = p ? p.emptyScript : "",
        m = u.reactiveElementPolyfillSupport,
        v = {
          toAttribute(e, t) {
            switch (t) {
              case Boolean:
                e = e ? f : null;
                break;
              case Object:
              case Array:
                e = null == e ? e : JSON.stringify(e);
            }
            return e;
          },
          fromAttribute(e, t) {
            let r = e;
            switch (t) {
              case Boolean:
                r = null !== e;
                break;
              case Number:
                r = null === e ? null : Number(e);
                break;
              case Object:
              case Array:
                try {
                  r = JSON.parse(e);
                } catch (e) {
                  r = null;
                }
            }
            return r;
          },
        },
        b = (e, t) => t !== e && (t == t || e == e),
        y = {
          attribute: !0,
          type: String,
          converter: v,
          reflect: !1,
          hasChanged: b,
        },
        g = "finalized";
      class _ extends HTMLElement {
        constructor() {
          super(),
            (this._$Ei = new Map()),
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this._$El = null),
            this._$Eu();
        }
        static addInitializer(e) {
          var t;
          this.finalize(),
            (null !== (t = this.h) && void 0 !== t ? t : (this.h = [])).push(e);
        }
        static get observedAttributes() {
          this.finalize();
          const e = [];
          return (
            this.elementProperties.forEach((t, r) => {
              const o = this._$Ep(r, t);
              void 0 !== o && (this._$Ev.set(o, r), e.push(o));
            }),
            e
          );
        }
        static createProperty(e, t = y) {
          if (
            (t.state && (t.attribute = !1),
            this.finalize(),
            this.elementProperties.set(e, t),
            !t.noAccessor && !this.prototype.hasOwnProperty(e))
          ) {
            const r = "symbol" == typeof e ? Symbol() : "__" + e,
              o = this.getPropertyDescriptor(e, r, t);
            void 0 !== o && Object.defineProperty(this.prototype, e, o);
          }
        }
        static getPropertyDescriptor(e, t, r) {
          return {
            get() {
              return this[t];
            },
            set(o) {
              const n = this[e];
              (this[t] = o), this.requestUpdate(e, n, r);
            },
            configurable: !0,
            enumerable: !0,
          };
        }
        static getPropertyOptions(e) {
          return this.elementProperties.get(e) || y;
        }
        static finalize() {
          if (this.hasOwnProperty(g)) return !1;
          this[g] = !0;
          const e = Object.getPrototypeOf(this);
          if (
            (e.finalize(),
            void 0 !== e.h && (this.h = [...e.h]),
            (this.elementProperties = new Map(e.elementProperties)),
            (this._$Ev = new Map()),
            this.hasOwnProperty("properties"))
          ) {
            const e = this.properties,
              t = [
                ...Object.getOwnPropertyNames(e),
                ...Object.getOwnPropertySymbols(e),
              ];
            for (const r of t) this.createProperty(r, e[r]);
          }
          return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
        }
        static finalizeStyles(e) {
          const t = [];
          if (Array.isArray(e)) {
            const r = new Set(e.flat(1 / 0).reverse());
            for (const e of r) t.unshift(h(e));
          } else void 0 !== e && t.push(h(e));
          return t;
        }
        static _$Ep(e, t) {
          const r = t.attribute;
          return !1 === r
            ? void 0
            : "string" == typeof r
            ? r
            : "string" == typeof e
            ? e.toLowerCase()
            : void 0;
        }
        _$Eu() {
          var e;
          (this._$E_ = new Promise((e) => (this.enableUpdating = e))),
            (this._$AL = new Map()),
            this._$Eg(),
            this.requestUpdate(),
            null === (e = this.constructor.h) ||
              void 0 === e ||
              e.forEach((e) => e(this));
        }
        addController(e) {
          var t, r;
          (null !== (t = this._$ES) && void 0 !== t
            ? t
            : (this._$ES = [])
          ).push(e),
            void 0 !== this.renderRoot &&
              this.isConnected &&
              (null === (r = e.hostConnected) || void 0 === r || r.call(e));
        }
        removeController(e) {
          var t;
          null === (t = this._$ES) ||
            void 0 === t ||
            t.splice(this._$ES.indexOf(e) >>> 0, 1);
        }
        _$Eg() {
          this.constructor.elementProperties.forEach((e, t) => {
            this.hasOwnProperty(t) &&
              (this._$Ei.set(t, this[t]), delete this[t]);
          });
        }
        createRenderRoot() {
          var e;
          const t =
            null !== (e = this.shadowRoot) && void 0 !== e
              ? e
              : this.attachShadow(this.constructor.shadowRootOptions);
          return (
            ((e, t) => {
              n
                ? (e.adoptedStyleSheets = t.map((e) =>
                    e instanceof CSSStyleSheet ? e : e.styleSheet
                  ))
                : t.forEach((t) => {
                    const r = document.createElement("style"),
                      n = o.litNonce;
                    void 0 !== n && r.setAttribute("nonce", n),
                      (r.textContent = t.cssText),
                      e.appendChild(r);
                  });
            })(t, this.constructor.elementStyles),
            t
          );
        }
        connectedCallback() {
          var e;
          void 0 === this.renderRoot &&
            (this.renderRoot = this.createRenderRoot()),
            this.enableUpdating(!0),
            null === (e = this._$ES) ||
              void 0 === e ||
              e.forEach((e) => {
                var t;
                return null === (t = e.hostConnected) || void 0 === t
                  ? void 0
                  : t.call(e);
              });
        }
        enableUpdating(e) {}
        disconnectedCallback() {
          var e;
          null === (e = this._$ES) ||
            void 0 === e ||
            e.forEach((e) => {
              var t;
              return null === (t = e.hostDisconnected) || void 0 === t
                ? void 0
                : t.call(e);
            });
        }
        attributeChangedCallback(e, t, r) {
          this._$AK(e, r);
        }
        _$EO(e, t, r = y) {
          var o;
          const n = this.constructor._$Ep(e, r);
          if (void 0 !== n && !0 === r.reflect) {
            const i = (
              void 0 !==
              (null === (o = r.converter) || void 0 === o
                ? void 0
                : o.toAttribute)
                ? r.converter
                : v
            ).toAttribute(t, r.type);
            (this._$El = e),
              null == i ? this.removeAttribute(n) : this.setAttribute(n, i),
              (this._$El = null);
          }
        }
        _$AK(e, t) {
          var r;
          const o = this.constructor,
            n = o._$Ev.get(e);
          if (void 0 !== n && this._$El !== n) {
            const e = o.getPropertyOptions(n),
              i =
                "function" == typeof e.converter
                  ? { fromAttribute: e.converter }
                  : void 0 !==
                    (null === (r = e.converter) || void 0 === r
                      ? void 0
                      : r.fromAttribute)
                  ? e.converter
                  : v;
            (this._$El = n),
              (this[n] = i.fromAttribute(t, e.type)),
              (this._$El = null);
          }
        }
        requestUpdate(e, t, r) {
          let o = !0;
          void 0 !== e &&
            ((
              (r = r || this.constructor.getPropertyOptions(e)).hasChanged || b
            )(this[e], t)
              ? (this._$AL.has(e) || this._$AL.set(e, t),
                !0 === r.reflect &&
                  this._$El !== e &&
                  (void 0 === this._$EC && (this._$EC = new Map()),
                  this._$EC.set(e, r)))
              : (o = !1)),
            !this.isUpdatePending && o && (this._$E_ = this._$Ej());
        }
        async _$Ej() {
          this.isUpdatePending = !0;
          try {
            await this._$E_;
          } catch (e) {
            Promise.reject(e);
          }
          const e = this.scheduleUpdate();
          return null != e && (await e), !this.isUpdatePending;
        }
        scheduleUpdate() {
          return this.performUpdate();
        }
        performUpdate() {
          var e;
          if (!this.isUpdatePending) return;
          this.hasUpdated,
            this._$Ei &&
              (this._$Ei.forEach((e, t) => (this[t] = e)),
              (this._$Ei = void 0));
          let t = !1;
          const r = this._$AL;
          try {
            (t = this.shouldUpdate(r)),
              t
                ? (this.willUpdate(r),
                  null === (e = this._$ES) ||
                    void 0 === e ||
                    e.forEach((e) => {
                      var t;
                      return null === (t = e.hostUpdate) || void 0 === t
                        ? void 0
                        : t.call(e);
                    }),
                  this.update(r))
                : this._$Ek();
          } catch (e) {
            throw ((t = !1), this._$Ek(), e);
          }
          t && this._$AE(r);
        }
        willUpdate(e) {}
        _$AE(e) {
          var t;
          null === (t = this._$ES) ||
            void 0 === t ||
            t.forEach((e) => {
              var t;
              return null === (t = e.hostUpdated) || void 0 === t
                ? void 0
                : t.call(e);
            }),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
            this.updated(e);
        }
        _$Ek() {
          (this._$AL = new Map()), (this.isUpdatePending = !1);
        }
        get updateComplete() {
          return this.getUpdateComplete();
        }
        getUpdateComplete() {
          return this._$E_;
        }
        shouldUpdate(e) {
          return !0;
        }
        update(e) {
          void 0 !== this._$EC &&
            (this._$EC.forEach((e, t) => this._$EO(t, this[t], e)),
            (this._$EC = void 0)),
            this._$Ek();
        }
        updated(e) {}
        firstUpdated(e) {}
      }
      (_[g] = !0),
        (_.elementProperties = new Map()),
        (_.elementStyles = []),
        (_.shadowRootOptions = { mode: "open" }),
        null == m || m({ ReactiveElement: _ }),
        (null !== (d = u.reactiveElementVersions) && void 0 !== d
          ? d
          : (u.reactiveElementVersions = [])
        ).push("1.6.3");
      var w;
      r(32982);
      const E = window,
        A = E.trustedTypes,
        k = A ? A.createPolicy("lit-html", { createHTML: (e) => e }) : void 0,
        S = "$lit$",
        x = `lit$${(Math.random() + "").slice(9)}$`,
        P = "?" + x,
        T = `<${P}>`,
        H = document,
        $ = () => H.createComment(""),
        C = (e) =>
          null === e || ("object" != typeof e && "function" != typeof e),
        B = Array.isArray,
        R = (e) =>
          B(e) ||
          "function" == typeof (null == e ? void 0 : e[Symbol.iterator]),
        N = "[ \t\n\f\r]",
        L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
        I = /-->/g,
        O = />/g,
        M = RegExp(
          `>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
          "g"
        ),
        U = /'/g,
        D = /"/g,
        F = /^(?:script|style|textarea|title)$/i,
        G =
          (e) =>
          (t, ...r) => ({ _$litType$: e, strings: t, values: r }),
        j = G(1),
        z = G(2),
        V = Symbol.for("lit-noChange"),
        Y = Symbol.for("lit-nothing"),
        K = new WeakMap(),
        Z = H.createTreeWalker(H, 129, null, !1),
        W = (e, t) => {
          const r = e.length - 1,
            o = [];
          let n,
            i = 2 === t ? "<svg>" : "",
            a = L;
          for (let t = 0; t < r; t++) {
            const r = e[t];
            let s,
              l,
              c = -1,
              h = 0;
            for (
              ;
              h < r.length && ((a.lastIndex = h), (l = a.exec(r)), null !== l);

            )
              (h = a.lastIndex),
                a === L
                  ? "!--" === l[1]
                    ? (a = I)
                    : void 0 !== l[1]
                    ? (a = O)
                    : void 0 !== l[2]
                    ? (F.test(l[2]) && (n = RegExp("</" + l[2], "g")), (a = M))
                    : void 0 !== l[3] && (a = M)
                  : a === M
                  ? ">" === l[0]
                    ? ((a = null != n ? n : L), (c = -1))
                    : void 0 === l[1]
                    ? (c = -2)
                    : ((c = a.lastIndex - l[2].length),
                      (s = l[1]),
                      (a = void 0 === l[3] ? M : '"' === l[3] ? D : U))
                  : a === D || a === U
                  ? (a = M)
                  : a === I || a === O
                  ? (a = L)
                  : ((a = M), (n = void 0));
            const d = a === M && e[t + 1].startsWith("/>") ? " " : "";
            i +=
              a === L
                ? r + T
                : c >= 0
                ? (o.push(s), r.slice(0, c) + S + r.slice(c) + x + d)
                : r + x + (-2 === c ? (o.push(void 0), t) : d);
          }
          const s = i + (e[r] || "<?>") + (2 === t ? "</svg>" : "");
          if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
            throw Error("invalid template strings array");
          return [void 0 !== k ? k.createHTML(s) : s, o];
        };
      class X {
        constructor({ strings: e, _$litType$: t }, r) {
          let o;
          this.parts = [];
          let n = 0,
            i = 0;
          const a = e.length - 1,
            s = this.parts,
            [l, c] = W(e, t);
          if (
            ((this.el = X.createElement(l, r)),
            (Z.currentNode = this.el.content),
            2 === t)
          ) {
            const e = this.el.content,
              t = e.firstChild;
            t.remove(), e.append(...t.childNodes);
          }
          for (; null !== (o = Z.nextNode()) && s.length < a; ) {
            if (1 === o.nodeType) {
              if (o.hasAttributes()) {
                const e = [];
                for (const t of o.getAttributeNames())
                  if (t.endsWith(S) || t.startsWith(x)) {
                    const r = c[i++];
                    if ((e.push(t), void 0 !== r)) {
                      const e = o.getAttribute(r.toLowerCase() + S).split(x),
                        t = /([.?@])?(.*)/.exec(r);
                      s.push({
                        type: 1,
                        index: n,
                        name: t[2],
                        strings: e,
                        ctor:
                          "." === t[1]
                            ? te
                            : "?" === t[1]
                            ? oe
                            : "@" === t[1]
                            ? ne
                            : ee,
                      });
                    } else s.push({ type: 6, index: n });
                  }
                for (const t of e) o.removeAttribute(t);
              }
              if (F.test(o.tagName)) {
                const e = o.textContent.split(x),
                  t = e.length - 1;
                if (t > 0) {
                  o.textContent = A ? A.emptyScript : "";
                  for (let r = 0; r < t; r++)
                    o.append(e[r], $()),
                      Z.nextNode(),
                      s.push({ type: 2, index: ++n });
                  o.append(e[t], $());
                }
              }
            } else if (8 === o.nodeType)
              if (o.data === P) s.push({ type: 2, index: n });
              else {
                let e = -1;
                for (; -1 !== (e = o.data.indexOf(x, e + 1)); )
                  s.push({ type: 7, index: n }), (e += x.length - 1);
              }
            n++;
          }
        }
        static createElement(e, t) {
          const r = H.createElement("template");
          return (r.innerHTML = e), r;
        }
      }
      function q(e, t, r = e, o) {
        var n, i, a, s;
        if (t === V) return t;
        let l =
          void 0 !== o
            ? null === (n = r._$Co) || void 0 === n
              ? void 0
              : n[o]
            : r._$Cl;
        const c = C(t) ? void 0 : t._$litDirective$;
        return (
          (null == l ? void 0 : l.constructor) !== c &&
            (null === (i = null == l ? void 0 : l._$AO) ||
              void 0 === i ||
              i.call(l, !1),
            void 0 === c ? (l = void 0) : ((l = new c(e)), l._$AT(e, r, o)),
            void 0 !== o
              ? ((null !== (a = (s = r)._$Co) && void 0 !== a
                  ? a
                  : (s._$Co = []))[o] = l)
              : (r._$Cl = l)),
          void 0 !== l && (t = q(e, l._$AS(e, t.values), l, o)),
          t
        );
      }
      class J {
        constructor(e, t) {
          (this._$AV = []),
            (this._$AN = void 0),
            (this._$AD = e),
            (this._$AM = t);
        }
        get parentNode() {
          return this._$AM.parentNode;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        u(e) {
          var t;
          const {
              el: { content: r },
              parts: o,
            } = this._$AD,
            n = (
              null !== (t = null == e ? void 0 : e.creationScope) &&
              void 0 !== t
                ? t
                : H
            ).importNode(r, !0);
          Z.currentNode = n;
          let i = Z.nextNode(),
            a = 0,
            s = 0,
            l = o[0];
          for (; void 0 !== l; ) {
            if (a === l.index) {
              let t;
              2 === l.type
                ? (t = new Q(i, i.nextSibling, this, e))
                : 1 === l.type
                ? (t = new l.ctor(i, l.name, l.strings, this, e))
                : 6 === l.type && (t = new ie(i, this, e)),
                this._$AV.push(t),
                (l = o[++s]);
            }
            a !== (null == l ? void 0 : l.index) && ((i = Z.nextNode()), a++);
          }
          return (Z.currentNode = H), n;
        }
        v(e) {
          let t = 0;
          for (const r of this._$AV)
            void 0 !== r &&
              (void 0 !== r.strings
                ? (r._$AI(e, r, t), (t += r.strings.length - 2))
                : r._$AI(e[t])),
              t++;
        }
      }
      class Q {
        constructor(e, t, r, o) {
          var n;
          (this.type = 2),
            (this._$AH = Y),
            (this._$AN = void 0),
            (this._$AA = e),
            (this._$AB = t),
            (this._$AM = r),
            (this.options = o),
            (this._$Cp =
              null === (n = null == o ? void 0 : o.isConnected) ||
              void 0 === n ||
              n);
        }
        get _$AU() {
          var e, t;
          return null !==
            (t = null === (e = this._$AM) || void 0 === e ? void 0 : e._$AU) &&
            void 0 !== t
            ? t
            : this._$Cp;
        }
        get parentNode() {
          let e = this._$AA.parentNode;
          const t = this._$AM;
          return (
            void 0 !== t &&
              11 === (null == e ? void 0 : e.nodeType) &&
              (e = t.parentNode),
            e
          );
        }
        get startNode() {
          return this._$AA;
        }
        get endNode() {
          return this._$AB;
        }
        _$AI(e, t = this) {
          (e = q(this, e, t)),
            C(e)
              ? e === Y || null == e || "" === e
                ? (this._$AH !== Y && this._$AR(), (this._$AH = Y))
                : e !== this._$AH && e !== V && this._(e)
              : void 0 !== e._$litType$
              ? this.g(e)
              : void 0 !== e.nodeType
              ? this.$(e)
              : R(e)
              ? this.T(e)
              : this._(e);
        }
        k(e) {
          return this._$AA.parentNode.insertBefore(e, this._$AB);
        }
        $(e) {
          this._$AH !== e && (this._$AR(), (this._$AH = this.k(e)));
        }
        _(e) {
          this._$AH !== Y && C(this._$AH)
            ? (this._$AA.nextSibling.data = e)
            : this.$(H.createTextNode(e)),
            (this._$AH = e);
        }
        g(e) {
          var t;
          const { values: r, _$litType$: o } = e,
            n =
              "number" == typeof o
                ? this._$AC(e)
                : (void 0 === o.el &&
                    (o.el = X.createElement(o.h, this.options)),
                  o);
          if (
            (null === (t = this._$AH) || void 0 === t ? void 0 : t._$AD) === n
          )
            this._$AH.v(r);
          else {
            const e = new J(n, this),
              t = e.u(this.options);
            e.v(r), this.$(t), (this._$AH = e);
          }
        }
        _$AC(e) {
          let t = K.get(e.strings);
          return void 0 === t && K.set(e.strings, (t = new X(e))), t;
        }
        T(e) {
          B(this._$AH) || ((this._$AH = []), this._$AR());
          const t = this._$AH;
          let r,
            o = 0;
          for (const n of e)
            o === t.length
              ? t.push(
                  (r = new Q(this.k($()), this.k($()), this, this.options))
                )
              : (r = t[o]),
              r._$AI(n),
              o++;
          o < t.length &&
            (this._$AR(r && r._$AB.nextSibling, o), (t.length = o));
        }
        _$AR(e = this._$AA.nextSibling, t) {
          var r;
          for (
            null === (r = this._$AP) || void 0 === r || r.call(this, !1, !0, t);
            e && e !== this._$AB;

          ) {
            const t = e.nextSibling;
            e.remove(), (e = t);
          }
        }
        setConnected(e) {
          var t;
          void 0 === this._$AM &&
            ((this._$Cp = e),
            null === (t = this._$AP) || void 0 === t || t.call(this, e));
        }
      }
      class ee {
        constructor(e, t, r, o, n) {
          (this.type = 1),
            (this._$AH = Y),
            (this._$AN = void 0),
            (this.element = e),
            (this.name = t),
            (this._$AM = o),
            (this.options = n),
            r.length > 2 || "" !== r[0] || "" !== r[1]
              ? ((this._$AH = Array(r.length - 1).fill(new String())),
                (this.strings = r))
              : (this._$AH = Y);
        }
        get tagName() {
          return this.element.tagName;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(e, t = this, r, o) {
          const n = this.strings;
          let i = !1;
          if (void 0 === n)
            (e = q(this, e, t, 0)),
              (i = !C(e) || (e !== this._$AH && e !== V)),
              i && (this._$AH = e);
          else {
            const o = e;
            let a, s;
            for (e = n[0], a = 0; a < n.length - 1; a++)
              (s = q(this, o[r + a], t, a)),
                s === V && (s = this._$AH[a]),
                i || (i = !C(s) || s !== this._$AH[a]),
                s === Y
                  ? (e = Y)
                  : e !== Y && (e += (null != s ? s : "") + n[a + 1]),
                (this._$AH[a] = s);
          }
          i && !o && this.j(e);
        }
        j(e) {
          e === Y
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, null != e ? e : "");
        }
      }
      class te extends ee {
        constructor() {
          super(...arguments), (this.type = 3);
        }
        j(e) {
          this.element[this.name] = e === Y ? void 0 : e;
        }
      }
      const re = A ? A.emptyScript : "";
      class oe extends ee {
        constructor() {
          super(...arguments), (this.type = 4);
        }
        j(e) {
          e && e !== Y
            ? this.element.setAttribute(this.name, re)
            : this.element.removeAttribute(this.name);
        }
      }
      class ne extends ee {
        constructor(e, t, r, o, n) {
          super(e, t, r, o, n), (this.type = 5);
        }
        _$AI(e, t = this) {
          var r;
          if (
            (e = null !== (r = q(this, e, t, 0)) && void 0 !== r ? r : Y) === V
          )
            return;
          const o = this._$AH,
            n =
              (e === Y && o !== Y) ||
              e.capture !== o.capture ||
              e.once !== o.once ||
              e.passive !== o.passive,
            i = e !== Y && (o === Y || n);
          n && this.element.removeEventListener(this.name, this, o),
            i && this.element.addEventListener(this.name, this, e),
            (this._$AH = e);
        }
        handleEvent(e) {
          var t, r;
          "function" == typeof this._$AH
            ? this._$AH.call(
                null !==
                  (r =
                    null === (t = this.options) || void 0 === t
                      ? void 0
                      : t.host) && void 0 !== r
                  ? r
                  : this.element,
                e
              )
            : this._$AH.handleEvent(e);
        }
      }
      class ie {
        constructor(e, t, r) {
          (this.element = e),
            (this.type = 6),
            (this._$AN = void 0),
            (this._$AM = t),
            (this.options = r);
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(e) {
          q(this, e);
        }
      }
      const ae = E.litHtmlPolyfillSupport;
      null == ae || ae(X, Q),
        (null !== (w = E.litHtmlVersions) && void 0 !== w
          ? w
          : (E.litHtmlVersions = [])
        ).push("2.7.4");
      const se = (e, t, r) => {
        var o, n;
        const i =
          null !== (o = null == r ? void 0 : r.renderBefore) && void 0 !== o
            ? o
            : t;
        let a = i._$litPart$;
        if (void 0 === a) {
          const e =
            null !== (n = null == r ? void 0 : r.renderBefore) && void 0 !== n
              ? n
              : null;
          i._$litPart$ = a = new Q(
            t.insertBefore($(), e),
            e,
            void 0,
            null != r ? r : {}
          );
        }
        return a._$AI(e), a;
      };
      var le, ce;
      class he extends _ {
        constructor() {
          super(...arguments),
            (this.renderOptions = { host: this }),
            (this._$Do = void 0);
        }
        createRenderRoot() {
          var e, t;
          const r = super.createRenderRoot();
          return (
            (null !== (e = (t = this.renderOptions).renderBefore) &&
              void 0 !== e) ||
              (t.renderBefore = r.firstChild),
            r
          );
        }
        update(e) {
          const t = this.render();
          this.hasUpdated ||
            (this.renderOptions.isConnected = this.isConnected),
            super.update(e),
            (this._$Do = se(t, this.renderRoot, this.renderOptions));
        }
        connectedCallback() {
          var e;
          super.connectedCallback(),
            null === (e = this._$Do) || void 0 === e || e.setConnected(!0);
        }
        disconnectedCallback() {
          var e;
          super.disconnectedCallback(),
            null === (e = this._$Do) || void 0 === e || e.setConnected(!1);
        }
        render() {
          return V;
        }
      }
      (he.finalized = !0),
        (he._$litElement$ = !0),
        null === (le = globalThis.litElementHydrateSupport) ||
          void 0 === le ||
          le.call(globalThis, { LitElement: he });
      const de = globalThis.litElementPolyfillSupport;
      null == de || de({ LitElement: he });
      (null !== (ce = globalThis.litElementVersions) && void 0 !== ce
        ? ce
        : (globalThis.litElementVersions = [])
      ).push("3.3.2");
      const ue = !1;
    },
    32982: (e, t, r) => {
      var o;
      r.d(t, {
        Jb: () => P,
        Ld: () => T,
        YP: () => x,
        _$LH: () => j,
        dy: () => S,
        sY: () => V,
      });
      const n = window,
        i = n.trustedTypes,
        a = i ? i.createPolicy("lit-html", { createHTML: (e) => e }) : void 0,
        s = "$lit$",
        l = `lit$${(Math.random() + "").slice(9)}$`,
        c = "?" + l,
        h = `<${c}>`,
        d = document,
        u = () => d.createComment(""),
        p = (e) =>
          null === e || ("object" != typeof e && "function" != typeof e),
        f = Array.isArray,
        m = (e) =>
          f(e) ||
          "function" == typeof (null == e ? void 0 : e[Symbol.iterator]),
        v = "[ \t\n\f\r]",
        b = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
        y = /-->/g,
        g = />/g,
        _ = RegExp(
          `>|${v}(?:([^\\s"'>=/]+)(${v}*=${v}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
          "g"
        ),
        w = /'/g,
        E = /"/g,
        A = /^(?:script|style|textarea|title)$/i,
        k =
          (e) =>
          (t, ...r) => ({ _$litType$: e, strings: t, values: r }),
        S = k(1),
        x = k(2),
        P = Symbol.for("lit-noChange"),
        T = Symbol.for("lit-nothing"),
        H = new WeakMap(),
        $ = d.createTreeWalker(d, 129, null, !1);
      function C(e, t) {
        if (!Array.isArray(e) || !e.hasOwnProperty("raw"))
          throw Error("invalid template strings array");
        return void 0 !== a ? a.createHTML(t) : t;
      }
      const B = (e, t) => {
        const r = e.length - 1,
          o = [];
        let n,
          i = 2 === t ? "<svg>" : "",
          a = b;
        for (let t = 0; t < r; t++) {
          const r = e[t];
          let c,
            d,
            u = -1,
            p = 0;
          for (
            ;
            p < r.length && ((a.lastIndex = p), (d = a.exec(r)), null !== d);

          )
            (p = a.lastIndex),
              a === b
                ? "!--" === d[1]
                  ? (a = y)
                  : void 0 !== d[1]
                  ? (a = g)
                  : void 0 !== d[2]
                  ? (A.test(d[2]) && (n = RegExp("</" + d[2], "g")), (a = _))
                  : void 0 !== d[3] && (a = _)
                : a === _
                ? ">" === d[0]
                  ? ((a = null != n ? n : b), (u = -1))
                  : void 0 === d[1]
                  ? (u = -2)
                  : ((u = a.lastIndex - d[2].length),
                    (c = d[1]),
                    (a = void 0 === d[3] ? _ : '"' === d[3] ? E : w))
                : a === E || a === w
                ? (a = _)
                : a === y || a === g
                ? (a = b)
                : ((a = _), (n = void 0));
          const f = a === _ && e[t + 1].startsWith("/>") ? " " : "";
          i +=
            a === b
              ? r + h
              : u >= 0
              ? (o.push(c), r.slice(0, u) + s + r.slice(u) + l + f)
              : r + l + (-2 === u ? (o.push(void 0), t) : f);
        }
        return [C(e, i + (e[r] || "<?>") + (2 === t ? "</svg>" : "")), o];
      };
      class R {
        constructor({ strings: e, _$litType$: t }, r) {
          let o;
          this.parts = [];
          let n = 0,
            a = 0;
          const h = e.length - 1,
            d = this.parts,
            [p, f] = B(e, t);
          if (
            ((this.el = R.createElement(p, r)),
            ($.currentNode = this.el.content),
            2 === t)
          ) {
            const e = this.el.content,
              t = e.firstChild;
            t.remove(), e.append(...t.childNodes);
          }
          for (; null !== (o = $.nextNode()) && d.length < h; ) {
            if (1 === o.nodeType) {
              if (o.hasAttributes()) {
                const e = [];
                for (const t of o.getAttributeNames())
                  if (t.endsWith(s) || t.startsWith(l)) {
                    const r = f[a++];
                    if ((e.push(t), void 0 !== r)) {
                      const e = o.getAttribute(r.toLowerCase() + s).split(l),
                        t = /([.?@])?(.*)/.exec(r);
                      d.push({
                        type: 1,
                        index: n,
                        name: t[2],
                        strings: e,
                        ctor:
                          "." === t[1]
                            ? M
                            : "?" === t[1]
                            ? D
                            : "@" === t[1]
                            ? F
                            : O,
                      });
                    } else d.push({ type: 6, index: n });
                  }
                for (const t of e) o.removeAttribute(t);
              }
              if (A.test(o.tagName)) {
                const e = o.textContent.split(l),
                  t = e.length - 1;
                if (t > 0) {
                  o.textContent = i ? i.emptyScript : "";
                  for (let r = 0; r < t; r++)
                    o.append(e[r], u()),
                      $.nextNode(),
                      d.push({ type: 2, index: ++n });
                  o.append(e[t], u());
                }
              }
            } else if (8 === o.nodeType)
              if (o.data === c) d.push({ type: 2, index: n });
              else {
                let e = -1;
                for (; -1 !== (e = o.data.indexOf(l, e + 1)); )
                  d.push({ type: 7, index: n }), (e += l.length - 1);
              }
            n++;
          }
        }
        static createElement(e, t) {
          const r = d.createElement("template");
          return (r.innerHTML = e), r;
        }
      }
      function N(e, t, r = e, o) {
        var n, i, a, s;
        if (t === P) return t;
        let l =
          void 0 !== o
            ? null === (n = r._$Co) || void 0 === n
              ? void 0
              : n[o]
            : r._$Cl;
        const c = p(t) ? void 0 : t._$litDirective$;
        return (
          (null == l ? void 0 : l.constructor) !== c &&
            (null === (i = null == l ? void 0 : l._$AO) ||
              void 0 === i ||
              i.call(l, !1),
            void 0 === c ? (l = void 0) : ((l = new c(e)), l._$AT(e, r, o)),
            void 0 !== o
              ? ((null !== (a = (s = r)._$Co) && void 0 !== a
                  ? a
                  : (s._$Co = []))[o] = l)
              : (r._$Cl = l)),
          void 0 !== l && (t = N(e, l._$AS(e, t.values), l, o)),
          t
        );
      }
      class L {
        constructor(e, t) {
          (this._$AV = []),
            (this._$AN = void 0),
            (this._$AD = e),
            (this._$AM = t);
        }
        get parentNode() {
          return this._$AM.parentNode;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        u(e) {
          var t;
          const {
              el: { content: r },
              parts: o,
            } = this._$AD,
            n = (
              null !== (t = null == e ? void 0 : e.creationScope) &&
              void 0 !== t
                ? t
                : d
            ).importNode(r, !0);
          $.currentNode = n;
          let i = $.nextNode(),
            a = 0,
            s = 0,
            l = o[0];
          for (; void 0 !== l; ) {
            if (a === l.index) {
              let t;
              2 === l.type
                ? (t = new I(i, i.nextSibling, this, e))
                : 1 === l.type
                ? (t = new l.ctor(i, l.name, l.strings, this, e))
                : 6 === l.type && (t = new G(i, this, e)),
                this._$AV.push(t),
                (l = o[++s]);
            }
            a !== (null == l ? void 0 : l.index) && ((i = $.nextNode()), a++);
          }
          return ($.currentNode = d), n;
        }
        v(e) {
          let t = 0;
          for (const r of this._$AV)
            void 0 !== r &&
              (void 0 !== r.strings
                ? (r._$AI(e, r, t), (t += r.strings.length - 2))
                : r._$AI(e[t])),
              t++;
        }
      }
      class I {
        constructor(e, t, r, o) {
          var n;
          (this.type = 2),
            (this._$AH = T),
            (this._$AN = void 0),
            (this._$AA = e),
            (this._$AB = t),
            (this._$AM = r),
            (this.options = o),
            (this._$Cp =
              null === (n = null == o ? void 0 : o.isConnected) ||
              void 0 === n ||
              n);
        }
        get _$AU() {
          var e, t;
          return null !==
            (t = null === (e = this._$AM) || void 0 === e ? void 0 : e._$AU) &&
            void 0 !== t
            ? t
            : this._$Cp;
        }
        get parentNode() {
          let e = this._$AA.parentNode;
          const t = this._$AM;
          return (
            void 0 !== t &&
              11 === (null == e ? void 0 : e.nodeType) &&
              (e = t.parentNode),
            e
          );
        }
        get startNode() {
          return this._$AA;
        }
        get endNode() {
          return this._$AB;
        }
        _$AI(e, t = this) {
          (e = N(this, e, t)),
            p(e)
              ? e === T || null == e || "" === e
                ? (this._$AH !== T && this._$AR(), (this._$AH = T))
                : e !== this._$AH && e !== P && this._(e)
              : void 0 !== e._$litType$
              ? this.g(e)
              : void 0 !== e.nodeType
              ? this.$(e)
              : m(e)
              ? this.T(e)
              : this._(e);
        }
        k(e) {
          return this._$AA.parentNode.insertBefore(e, this._$AB);
        }
        $(e) {
          this._$AH !== e && (this._$AR(), (this._$AH = this.k(e)));
        }
        _(e) {
          this._$AH !== T && p(this._$AH)
            ? (this._$AA.nextSibling.data = e)
            : this.$(d.createTextNode(e)),
            (this._$AH = e);
        }
        g(e) {
          var t;
          const { values: r, _$litType$: o } = e,
            n =
              "number" == typeof o
                ? this._$AC(e)
                : (void 0 === o.el &&
                    (o.el = R.createElement(C(o.h, o.h[0]), this.options)),
                  o);
          if (
            (null === (t = this._$AH) || void 0 === t ? void 0 : t._$AD) === n
          )
            this._$AH.v(r);
          else {
            const e = new L(n, this),
              t = e.u(this.options);
            e.v(r), this.$(t), (this._$AH = e);
          }
        }
        _$AC(e) {
          let t = H.get(e.strings);
          return void 0 === t && H.set(e.strings, (t = new R(e))), t;
        }
        T(e) {
          f(this._$AH) || ((this._$AH = []), this._$AR());
          const t = this._$AH;
          let r,
            o = 0;
          for (const n of e)
            o === t.length
              ? t.push(
                  (r = new I(this.k(u()), this.k(u()), this, this.options))
                )
              : (r = t[o]),
              r._$AI(n),
              o++;
          o < t.length &&
            (this._$AR(r && r._$AB.nextSibling, o), (t.length = o));
        }
        _$AR(e = this._$AA.nextSibling, t) {
          var r;
          for (
            null === (r = this._$AP) || void 0 === r || r.call(this, !1, !0, t);
            e && e !== this._$AB;

          ) {
            const t = e.nextSibling;
            e.remove(), (e = t);
          }
        }
        setConnected(e) {
          var t;
          void 0 === this._$AM &&
            ((this._$Cp = e),
            null === (t = this._$AP) || void 0 === t || t.call(this, e));
        }
      }
      class O {
        constructor(e, t, r, o, n) {
          (this.type = 1),
            (this._$AH = T),
            (this._$AN = void 0),
            (this.element = e),
            (this.name = t),
            (this._$AM = o),
            (this.options = n),
            r.length > 2 || "" !== r[0] || "" !== r[1]
              ? ((this._$AH = Array(r.length - 1).fill(new String())),
                (this.strings = r))
              : (this._$AH = T);
        }
        get tagName() {
          return this.element.tagName;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(e, t = this, r, o) {
          const n = this.strings;
          let i = !1;
          if (void 0 === n)
            (e = N(this, e, t, 0)),
              (i = !p(e) || (e !== this._$AH && e !== P)),
              i && (this._$AH = e);
          else {
            const o = e;
            let a, s;
            for (e = n[0], a = 0; a < n.length - 1; a++)
              (s = N(this, o[r + a], t, a)),
                s === P && (s = this._$AH[a]),
                i || (i = !p(s) || s !== this._$AH[a]),
                s === T
                  ? (e = T)
                  : e !== T && (e += (null != s ? s : "") + n[a + 1]),
                (this._$AH[a] = s);
          }
          i && !o && this.j(e);
        }
        j(e) {
          e === T
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, null != e ? e : "");
        }
      }
      class M extends O {
        constructor() {
          super(...arguments), (this.type = 3);
        }
        j(e) {
          this.element[this.name] = e === T ? void 0 : e;
        }
      }
      const U = i ? i.emptyScript : "";
      class D extends O {
        constructor() {
          super(...arguments), (this.type = 4);
        }
        j(e) {
          e && e !== T
            ? this.element.setAttribute(this.name, U)
            : this.element.removeAttribute(this.name);
        }
      }
      class F extends O {
        constructor(e, t, r, o, n) {
          super(e, t, r, o, n), (this.type = 5);
        }
        _$AI(e, t = this) {
          var r;
          if (
            (e = null !== (r = N(this, e, t, 0)) && void 0 !== r ? r : T) === P
          )
            return;
          const o = this._$AH,
            n =
              (e === T && o !== T) ||
              e.capture !== o.capture ||
              e.once !== o.once ||
              e.passive !== o.passive,
            i = e !== T && (o === T || n);
          n && this.element.removeEventListener(this.name, this, o),
            i && this.element.addEventListener(this.name, this, e),
            (this._$AH = e);
        }
        handleEvent(e) {
          var t, r;
          "function" == typeof this._$AH
            ? this._$AH.call(
                null !==
                  (r =
                    null === (t = this.options) || void 0 === t
                      ? void 0
                      : t.host) && void 0 !== r
                  ? r
                  : this.element,
                e
              )
            : this._$AH.handleEvent(e);
        }
      }
      class G {
        constructor(e, t, r) {
          (this.element = e),
            (this.type = 6),
            (this._$AN = void 0),
            (this._$AM = t),
            (this.options = r);
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(e) {
          N(this, e);
        }
      }
      const j = {
          O: s,
          P: l,
          A: c,
          C: 1,
          M: B,
          L,
          R: m,
          D: N,
          I,
          V: O,
          H: D,
          N: F,
          U: M,
          F: G,
        },
        z = n.litHtmlPolyfillSupport;
      null == z || z(R, I),
        (null !== (o = n.litHtmlVersions) && void 0 !== o
          ? o
          : (n.litHtmlVersions = [])
        ).push("2.8.0");
      const V = (e, t, r) => {
        var o, n;
        const i =
          null !== (o = null == r ? void 0 : r.renderBefore) && void 0 !== o
            ? o
            : t;
        let a = i._$litPart$;
        if (void 0 === a) {
          const e =
            null !== (n = null == r ? void 0 : r.renderBefore) && void 0 !== n
              ? n
              : null;
          i._$litPart$ = a = new I(
            t.insertBefore(u(), e),
            e,
            void 0,
            null != r ? r : {}
          );
        }
        return a._$AI(e), a;
      };
    },
    43204: (e, t, r) => {
      r.r(t),
        r.d(t, {
          __assign: () => i,
          __asyncDelegator: () => S,
          __asyncGenerator: () => k,
          __asyncValues: () => x,
          __await: () => A,
          __awaiter: () => f,
          __classPrivateFieldGet: () => C,
          __classPrivateFieldIn: () => R,
          __classPrivateFieldSet: () => B,
          __createBinding: () => v,
          __decorate: () => s,
          __esDecorate: () => c,
          __exportStar: () => b,
          __extends: () => n,
          __generator: () => m,
          __importDefault: () => $,
          __importStar: () => H,
          __makeTemplateObject: () => P,
          __metadata: () => p,
          __param: () => l,
          __propKey: () => d,
          __read: () => g,
          __rest: () => a,
          __runInitializers: () => h,
          __setFunctionName: () => u,
          __spread: () => _,
          __spreadArray: () => E,
          __spreadArrays: () => w,
          __values: () => y,
          default: () => N,
        });
      var o = function (e, t) {
        return (
          (o =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var r in t)
                Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            }),
          o(e, t)
        );
      };
      function n(e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Class extends value " + String(t) + " is not a constructor or null"
          );
        function r() {
          this.constructor = e;
        }
        o(e, t),
          (e.prototype =
            null === t
              ? Object.create(t)
              : ((r.prototype = t.prototype), new r()));
      }
      var i = function () {
        return (
          (i =
            Object.assign ||
            function (e) {
              for (var t, r = 1, o = arguments.length; r < o; r++)
                for (var n in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
              return e;
            }),
          i.apply(this, arguments)
        );
      };
      function a(e, t) {
        var r = {};
        for (var o in e)
          Object.prototype.hasOwnProperty.call(e, o) &&
            t.indexOf(o) < 0 &&
            (r[o] = e[o]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
          var n = 0;
          for (o = Object.getOwnPropertySymbols(e); n < o.length; n++)
            t.indexOf(o[n]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(e, o[n]) &&
              (r[o[n]] = e[o[n]]);
        }
        return r;
      }
      function s(e, t, r, o) {
        var n,
          i = arguments.length,
          a =
            i < 3
              ? t
              : null === o
              ? (o = Object.getOwnPropertyDescriptor(t, r))
              : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          a = Reflect.decorate(e, t, r, o);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (n = e[s]) &&
              (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
        return i > 3 && a && Object.defineProperty(t, r, a), a;
      }
      function l(e, t) {
        return function (r, o) {
          t(r, o, e);
        };
      }
      function c(e, t, r, o, n, i) {
        function a(e) {
          if (void 0 !== e && "function" != typeof e)
            throw new TypeError("Function expected");
          return e;
        }
        for (
          var s,
            l = o.kind,
            c = "getter" === l ? "get" : "setter" === l ? "set" : "value",
            h = !t && e ? (o.static ? e : e.prototype) : null,
            d = t || (h ? Object.getOwnPropertyDescriptor(h, o.name) : {}),
            u = !1,
            p = r.length - 1;
          p >= 0;
          p--
        ) {
          var f = {};
          for (var m in o) f[m] = "access" === m ? {} : o[m];
          for (var m in o.access) f.access[m] = o.access[m];
          f.addInitializer = function (e) {
            if (u)
              throw new TypeError(
                "Cannot add initializers after decoration has completed"
              );
            i.push(a(e || null));
          };
          var v = (0, r[p])(
            "accessor" === l ? { get: d.get, set: d.set } : d[c],
            f
          );
          if ("accessor" === l) {
            if (void 0 === v) continue;
            if (null === v || "object" != typeof v)
              throw new TypeError("Object expected");
            (s = a(v.get)) && (d.get = s),
              (s = a(v.set)) && (d.set = s),
              (s = a(v.init)) && n.unshift(s);
          } else (s = a(v)) && ("field" === l ? n.unshift(s) : (d[c] = s));
        }
        h && Object.defineProperty(h, o.name, d), (u = !0);
      }
      function h(e, t, r) {
        for (var o = arguments.length > 2, n = 0; n < t.length; n++)
          r = o ? t[n].call(e, r) : t[n].call(e);
        return o ? r : void 0;
      }
      function d(e) {
        return "symbol" == typeof e ? e : "".concat(e);
      }
      function u(e, t, r) {
        return (
          "symbol" == typeof t &&
            (t = t.description ? "[".concat(t.description, "]") : ""),
          Object.defineProperty(e, "name", {
            configurable: !0,
            value: r ? "".concat(r, " ", t) : t,
          })
        );
      }
      function p(e, t) {
        if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
          return Reflect.metadata(e, t);
      }
      function f(e, t, r, o) {
        return new (r || (r = Promise))(function (n, i) {
          function a(e) {
            try {
              l(o.next(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            try {
              l(o.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function l(e) {
            var t;
            e.done
              ? n(e.value)
              : ((t = e.value),
                t instanceof r
                  ? t
                  : new r(function (e) {
                      e(t);
                    })).then(a, s);
          }
          l((o = o.apply(e, t || [])).next());
        });
      }
      function m(e, t) {
        var r,
          o,
          n,
          i,
          a = {
            label: 0,
            sent: function () {
              if (1 & n[0]) throw n[1];
              return n[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (i = { next: s(0), throw: s(1), return: s(2) }),
          "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function s(s) {
          return function (l) {
            return (function (s) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; i && ((i = 0), s[0] && (a = 0)), a; )
                try {
                  if (
                    ((r = 1),
                    o &&
                      (n =
                        2 & s[0]
                          ? o.return
                          : s[0]
                          ? o.throw || ((n = o.return) && n.call(o), 0)
                          : o.next) &&
                      !(n = n.call(o, s[1])).done)
                  )
                    return n;
                  switch (((o = 0), n && (s = [2 & s[0], n.value]), s[0])) {
                    case 0:
                    case 1:
                      n = s;
                      break;
                    case 4:
                      return a.label++, { value: s[1], done: !1 };
                    case 5:
                      a.label++, (o = s[1]), (s = [0]);
                      continue;
                    case 7:
                      (s = a.ops.pop()), a.trys.pop();
                      continue;
                    default:
                      if (
                        !((n = a.trys),
                        (n = n.length > 0 && n[n.length - 1]) ||
                          (6 !== s[0] && 2 !== s[0]))
                      ) {
                        a = 0;
                        continue;
                      }
                      if (3 === s[0] && (!n || (s[1] > n[0] && s[1] < n[3]))) {
                        a.label = s[1];
                        break;
                      }
                      if (6 === s[0] && a.label < n[1]) {
                        (a.label = n[1]), (n = s);
                        break;
                      }
                      if (n && a.label < n[2]) {
                        (a.label = n[2]), a.ops.push(s);
                        break;
                      }
                      n[2] && a.ops.pop(), a.trys.pop();
                      continue;
                  }
                  s = t.call(e, a);
                } catch (e) {
                  (s = [6, e]), (o = 0);
                } finally {
                  r = n = 0;
                }
              if (5 & s[0]) throw s[1];
              return { value: s[0] ? s[1] : void 0, done: !0 };
            })([s, l]);
          };
        }
      }
      var v = Object.create
        ? function (e, t, r, o) {
            void 0 === o && (o = r);
            var n = Object.getOwnPropertyDescriptor(t, r);
            (n &&
              !("get" in n ? !t.__esModule : n.writable || n.configurable)) ||
              (n = {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              }),
              Object.defineProperty(e, o, n);
          }
        : function (e, t, r, o) {
            void 0 === o && (o = r), (e[o] = t[r]);
          };
      function b(e, t) {
        for (var r in e)
          "default" === r ||
            Object.prototype.hasOwnProperty.call(t, r) ||
            v(t, e, r);
      }
      function y(e) {
        var t = "function" == typeof Symbol && Symbol.iterator,
          r = t && e[t],
          o = 0;
        if (r) return r.call(e);
        if (e && "number" == typeof e.length)
          return {
            next: function () {
              return (
                e && o >= e.length && (e = void 0),
                { value: e && e[o++], done: !e }
              );
            },
          };
        throw new TypeError(
          t ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
      }
      function g(e, t) {
        var r = "function" == typeof Symbol && e[Symbol.iterator];
        if (!r) return e;
        var o,
          n,
          i = r.call(e),
          a = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(o = i.next()).done; )
            a.push(o.value);
        } catch (e) {
          n = { error: e };
        } finally {
          try {
            o && !o.done && (r = i.return) && r.call(i);
          } finally {
            if (n) throw n.error;
          }
        }
        return a;
      }
      function _() {
        for (var e = [], t = 0; t < arguments.length; t++)
          e = e.concat(g(arguments[t]));
        return e;
      }
      function w() {
        for (var e = 0, t = 0, r = arguments.length; t < r; t++)
          e += arguments[t].length;
        var o = Array(e),
          n = 0;
        for (t = 0; t < r; t++)
          for (var i = arguments[t], a = 0, s = i.length; a < s; a++, n++)
            o[n] = i[a];
        return o;
      }
      function E(e, t, r) {
        if (r || 2 === arguments.length)
          for (var o, n = 0, i = t.length; n < i; n++)
            (!o && n in t) ||
              (o || (o = Array.prototype.slice.call(t, 0, n)), (o[n] = t[n]));
        return e.concat(o || Array.prototype.slice.call(t));
      }
      function A(e) {
        return this instanceof A ? ((this.v = e), this) : new A(e);
      }
      function k(e, t, r) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          n = r.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          a("next"),
          a("throw"),
          a("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function a(e) {
          n[e] &&
            (o[e] = function (t) {
              return new Promise(function (r, o) {
                i.push([e, t, r, o]) > 1 || s(e, t);
              });
            });
        }
        function s(e, t) {
          try {
            (r = n[e](t)).value instanceof A
              ? Promise.resolve(r.value.v).then(l, c)
              : h(i[0][2], r);
          } catch (e) {
            h(i[0][3], e);
          }
          var r;
        }
        function l(e) {
          s("next", e);
        }
        function c(e) {
          s("throw", e);
        }
        function h(e, t) {
          e(t), i.shift(), i.length && s(i[0][0], i[0][1]);
        }
      }
      function S(e) {
        var t, r;
        return (
          (t = {}),
          o("next"),
          o("throw", function (e) {
            throw e;
          }),
          o("return"),
          (t[Symbol.iterator] = function () {
            return this;
          }),
          t
        );
        function o(o, n) {
          t[o] = e[o]
            ? function (t) {
                return (r = !r)
                  ? { value: A(e[o](t)), done: !1 }
                  : n
                  ? n(t)
                  : t;
              }
            : n;
        }
      }
      function x(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          r = e[Symbol.asyncIterator];
        return r
          ? r.call(e)
          : ((e = y(e)),
            (t = {}),
            o("next"),
            o("throw"),
            o("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function o(r) {
          t[r] =
            e[r] &&
            function (t) {
              return new Promise(function (o, n) {
                (function (e, t, r, o) {
                  Promise.resolve(o).then(function (t) {
                    e({ value: t, done: r });
                  }, t);
                })(o, n, (t = e[r](t)).done, t.value);
              });
            };
        }
      }
      function P(e, t) {
        return (
          Object.defineProperty
            ? Object.defineProperty(e, "raw", { value: t })
            : (e.raw = t),
          e
        );
      }
      var T = Object.create
        ? function (e, t) {
            Object.defineProperty(e, "default", { enumerable: !0, value: t });
          }
        : function (e, t) {
            e.default = t;
          };
      function H(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var r in e)
            "default" !== r &&
              Object.prototype.hasOwnProperty.call(e, r) &&
              v(t, e, r);
        return T(t, e), t;
      }
      function $(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function C(e, t, r, o) {
        if ("a" === r && !o)
          throw new TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t ? e !== t || !o : !t.has(e))
          throw new TypeError(
            "Cannot read private member from an object whose class did not declare it"
          );
        return "m" === r ? o : "a" === r ? o.call(e) : o ? o.value : t.get(e);
      }
      function B(e, t, r, o, n) {
        if ("m" === o) throw new TypeError("Private method is not writable");
        if ("a" === o && !n)
          throw new TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t ? e !== t || !n : !t.has(e))
          throw new TypeError(
            "Cannot write private member to an object whose class did not declare it"
          );
        return "a" === o ? n.call(e, r) : n ? (n.value = r) : t.set(e, r), r;
      }
      function R(e, t) {
        if (null === t || ("object" != typeof t && "function" != typeof t))
          throw new TypeError("Cannot use 'in' operator on non-object");
        return "function" == typeof e ? t === e : e.has(t);
      }
      const N = {
        __extends: n,
        __assign: i,
        __rest: a,
        __decorate: s,
        __param: l,
        __metadata: p,
        __awaiter: f,
        __generator: m,
        __createBinding: v,
        __exportStar: b,
        __values: y,
        __read: g,
        __spread: _,
        __spreadArrays: w,
        __spreadArray: E,
        __await: A,
        __asyncGenerator: k,
        __asyncDelegator: S,
        __asyncValues: x,
        __makeTemplateObject: P,
        __importStar: H,
        __importDefault: $,
        __classPrivateFieldGet: C,
        __classPrivateFieldSet: B,
        __classPrivateFieldIn: R,
      };
    },
  },
  s = {};
function l(e) {
  var t = s[e];
  if (void 0 !== t) return t.exports;
  var r = (s[e] = { exports: {} });
  return a[e].call(r.exports, r, r.exports, l), r.exports;
}
(l.m = a),
  (e =
    "function" == typeof Symbol
      ? Symbol("webpack queues")
      : "__webpack_queues__"),
  (t =
    "function" == typeof Symbol
      ? Symbol("webpack exports")
      : "__webpack_exports__"),
  (r =
    "function" == typeof Symbol
      ? Symbol("webpack error")
      : "__webpack_error__"),
  (o = (e) => {
    e &&
      e.d < 1 &&
      ((e.d = 1),
      e.forEach((e) => e.r--),
      e.forEach((e) => (e.r-- ? e.r++ : e())));
  }),
  (l.a = (n, i, a) => {
    var s;
    a && ((s = []).d = -1);
    var l,
      c,
      h,
      d = new Set(),
      u = n.exports,
      p = new Promise((e, t) => {
        (h = t), (c = e);
      });
    (p[t] = u),
      (p[e] = (e) => (s && e(s), d.forEach(e), p.catch((e) => {}))),
      (n.exports = p),
      i(
        (n) => {
          var i;
          l = ((n) =>
            n.map((n) => {
              if (null !== n && "object" == typeof n) {
                if (n[e]) return n;
                if (n.then) {
                  var i = [];
                  (i.d = 0),
                    n.then(
                      (e) => {
                        (a[t] = e), o(i);
                      },
                      (e) => {
                        (a[r] = e), o(i);
                      }
                    );
                  var a = {};
                  return (a[e] = (e) => e(i)), a;
                }
              }
              var s = {};
              return (s[e] = (e) => {}), (s[t] = n), s;
            }))(n);
          var a = () =>
              l.map((e) => {
                if (e[r]) throw e[r];
                return e[t];
              }),
            c = new Promise((t) => {
              (i = () => t(a)).r = 0;
              var r = (e) =>
                e !== s &&
                !d.has(e) &&
                (d.add(e), e && !e.d && (i.r++, e.push(i)));
              l.map((t) => t[e](r));
            });
          return i.r ? c : a();
        },
        (e) => (e ? h((p[r] = e)) : c(u), o(s))
      ),
      s && s.d < 0 && (s.d = 0);
  }),
  (i = Object.getPrototypeOf
    ? (e) => Object.getPrototypeOf(e)
    : (e) => e.__proto__),
  (l.t = function (e, t) {
    if ((1 & t && (e = this(e)), 8 & t)) return e;
    if ("object" == typeof e && e) {
      if (4 & t && e.__esModule) return e;
      if (16 & t && "function" == typeof e.then) return e;
    }
    var r = Object.create(null);
    l.r(r);
    var o = {};
    n = n || [null, i({}), i([]), i(i)];
    for (var a = 2 & t && e; "object" == typeof a && !~n.indexOf(a); a = i(a))
      Object.getOwnPropertyNames(a).forEach((t) => (o[t] = () => e[t]));
    return (o.default = () => e), l.d(r, o), r;
  }),
  (l.d = (e, t) => {
    for (var r in t)
      l.o(t, r) &&
        !l.o(e, r) &&
        Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
  }),
  (l.f = {}),
  (l.e = (e) =>
    Promise.all(Object.keys(l.f).reduce((t, r) => (l.f[r](e, t), t), []))),
  (l.u = (e) =>
    (({ 1402: "markdown-worker", 8456: "sort-filter-worker" })[e] || e) +
    "." +
    {
      98: "ARNIzCKpN2U",
      208: "KtFQQVe4j04",
      210: "JicmIVxj_Z8",
      254: "sgXbTzp50vY",
      303: "XswrJn_fCQU",
      339: "dbk8wpd18aA",
      512: "e_Yqry3MvEc",
      527: "Y_XkJmLMPYg",
      655: "PtrZHdAe538",
      657: "SP6aDAdMOK4",
      759: "Afm3fT9nDHQ",
      947: "ee78OLAUVLs",
      1009: "qgvIF6yIQ0E",
      1049: "ub548fxmuzk",
      1064: "FJ-y1ZRv9Uk",
      1117: "T5z4P0sllXc",
      1195: "__tv-48jMbU",
      1244: "POB-_iIAiNU",
      1318: "e9GsbUI8yzc",
      1353: "-1725hLu0CE",
      1402: "LVduE3RJE7c",
      1457: "UEE3ixgGl-k",
      1501: "7zQukyNp7kM",
      1666: "lvP3lKpui2I",
      1675: "eGE0-Ov3ks0",
      1706: "drD4eOMydFg",
      1848: "7Ao7gG4SlpU",
      1866: "sNUAXBg0X2k",
      1880: "7sPlGs0noos",
      1904: "odz9LTvmzLQ",
      1908: "ck9XYo_a0yM",
      1913: "UnglwEbR9pM",
      1970: "ro1QQwimzwE",
      1977: "J7KSVvmU1qM",
      1985: "72DZSwzGWo8",
      2166: "33cGneQzKH0",
      2488: "Vkgl3AJfAr4",
      2519: "8nyAHYPXDXY",
      2528: "MzwcEp72ahc",
      2552: "cF7vAGjp59o",
      2562: "5ziDUy8KqmY",
      2583: "VFYNrtVxoF0",
      2638: "TdcZV68pM10",
      2684: "ECVq4qtLjQ0",
      2706: "4OT4pJMmhJI",
      2722: "wFE90sKscgY",
      2802: "TmT57sHzBH4",
      2850: "DOogohiUj_0",
      3216: "VH9U6OUbxiI",
      3316: "oTMlLc7KSJg",
      3395: "JUkRe_aqO38",
      3526: "Bn5IHGAXw0s",
      3537: "q63IHHW3PSA",
      3687: "NPIkiyhsSf4",
      3762: "bISoMJ3aRZI",
      3869: "kbrv55zkbyc",
      3908: "IeASt6B26Zo",
      3983: "gCV-iB04LpQ",
      4052: "G4iRopercB8",
      4093: "EiHf5nQ3ivs",
      4271: "Wt-YpksnxQk",
      4338: "8RPAj9mNnqE",
      4340: "V8BUakn-MR4",
      4370: "J9MDWy8fJNw",
      4448: "nQc05ARyXt0",
      4527: "JSqIxrFQ1fA",
      4529: "-5d9Qi2d9XE",
      4755: "d1KRC8enP3Q",
      4776: "xSa3Y2XrXKc",
      4827: "2RnhPlNsx9w",
      4833: "oTjdg_Dap08",
      4871: "cf3WhCdvOYs",
      4993: "javO8Sf4lOI",
      5059: "yurizgOaYzQ",
      5107: "Hy1eYp472Ec",
      5442: "VPVps9Jt4zw",
      5563: "oU9QcJqDoTY",
      5649: "ZTJZyAtMD3k",
      5734: "8LqDfnEY8eM",
      5778: "HapUWTuTb9c",
      5803: "FepdpRvH4BA",
      5868: "lWeGGyvotf0",
      5891: "uzrqofeKuzc",
      5943: "qTsmzFDBk9s",
      6023: "qze1gbReg98",
      6086: "lIrHIwn946s",
      6087: "zhxVZyvwvQU",
      6196: "BmwxzREjMWc",
      6251: "lvvrL2NdD6A",
      6255: "O_q0VehTRK4",
      6315: "hHo8sJWScMc",
      6549: "GB2R-sL04dk",
      6554: "U8n0qbAq4RE",
      6561: "XC2MRJm79_s",
      6591: "TyV7iHi8Jmw",
      6765: "O7igE7-_qkw",
      6782: "k5geGdn1MZs",
      6924: "-X3TDMNJqjM",
      6985: "KuoujHE25ME",
      7021: "i-QbuahlySw",
      7048: "1i8odnlXQEw",
      7198: "dgpqhU33dNE",
      7371: "WgLVfICljd4",
      7386: "47fX7OBaT_s",
      7426: "BkeXPGx5t-k",
      7625: "NpcjtXbH1eI",
      7648: "L6A_K8L2HRY",
      7716: "L65qrSeGm-4",
      7765: "aMWklrSuv5w",
      8075: "g15Th_tveJ4",
      8196: "O5DmrTGnyM4",
      8224: "c91olTHxgS8",
      8245: "PFMlvyoCqgw",
      8353: "UTWpqlqu4vs",
      8456: "jFjB-jtFwEc",
      8597: "xDuErO-I45I",
      8614: "wL37zvcymaU",
      8663: "FdTscuomRRU",
      8664: "CPJwH-9ZW_4",
      8689: "5tAvagQt-Gk",
      8697: "1XtQ3tOdB_4",
      8779: "YCL8KYOZ0F4",
      8827: "7OD9G3bsqX8",
      8846: "cC5MtYNxqz4",
      8874: "3yNaUiZLzPg",
      8902: "1xfktoI8mMA",
      8984: "W-KIJNsvfmM",
      9015: "9F46dbqUmvU",
      9029: "BGevqCPJeNU",
      9030: "ZMlC_inwqcY",
      9146: "AOEaqod85C4",
      9233: "oQ9SCeH1uwE",
      9255: "eVSn4MkuJ3Y",
      9433: "l0i1U7T7n30",
      9460: "8oVb33xcFC8",
      9463: "Tzczmgs_Gic",
      9503: "L3ARChmngUM",
      9507: "_bxiTWI8qzI",
      9516: "0-O9EE0G5CU",
      9521: "qBZMygASVc0",
      9624: "QHHEZLYUulE",
      9663: "3G0DGuZroKM",
      9683: "0AaQNBSRZzk",
      9766: "IkbFYIQ_Aiw",
      9821: "Cip3Kf_JiZk",
      9877: "1XynvE3fe5o",
      9880: "N7f9dRfrn_c",
      9948: "saoA_MmSI3g",
    }[e] +
    ".js"),
  (l.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
  (l.r = (e) => {
    "undefined" != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
      Object.defineProperty(e, "__esModule", { value: !0 });
  }),
  (l.p = "/hacsfiles/frontend/frontend_latest/"),
  (() => {
    l.b = new URL("./", import.meta.url);
    var e = { 9976: 0 },
      t = (t) => {
        var r,
          o,
          { ids: n, modules: i, runtime: a } = t,
          s = 0;
        for (r in i) l.o(i, r) && (l.m[r] = i[r]);
        for (a && a(l); s < n.length; s++)
          (o = n[s]), l.o(e, o) && e[o] && e[o][0](), (e[n[s]] = 0);
      };
    l.f.j = (r, o) => {
      var n = l.o(e, r) ? e[r] : void 0;
      if (0 !== n)
        if (n) o.push(n[1]);
        else {
          var i = import("./" + l.u(r)).then(t, (t) => {
            throw (0 !== e[r] && (e[r] = void 0), t);
          });
          i = Promise.race([i, new Promise((t) => (n = e[r] = [t]))]);
          o.push((n[1] = i));
        }
    };
  })(),
  (() => {
    var e = l(74460),
      t = l(5095);
    const r =
        t.iv`@font-face{font-family:Roboto;src:local("Roboto Thin"),local("Roboto-Thin"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Thin.woff2) format("woff2");font-weight:100;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Thin Italic"),local("Roboto-ThinItalic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-ThinItalic.woff2) format("woff2");font-weight:100;font-style:italic}@font-face{font-family:Roboto;src:local("Roboto Light"),local("Roboto-Light"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Light.woff2) format("woff2");font-weight:300;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Light Italic"),local("Roboto-LightItalic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-LightItalic.woff2) format("woff2");font-weight:300;font-style:italic}@font-face{font-family:Roboto;src:local("Roboto Regular"),local("Roboto-Regular"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Regular.woff2) format("woff2");font-weight:400;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Italic"),local("Roboto-Italic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-RegularItalic.woff2) format("woff2");font-weight:400;font-style:italic}@font-face{font-family:Roboto;src:local("Roboto Medium"),local("Roboto-Medium"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Medium.woff2) format("woff2");font-weight:500;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Medium Italic"),local("Roboto-MediumItalic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-MediumItalic.woff2) format("woff2");font-weight:500;font-style:italic}@font-face{font-family:Roboto;src:local("Roboto Bold"),local("Roboto-Bold"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Bold.woff2) format("woff2");font-weight:700;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Bold Italic"),local("Roboto-BoldItalic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-BoldItalic.woff2) format("woff2");font-weight:700;font-style:italic}@font-face{font-family:Roboto;src:local("Roboto Black"),local("Roboto-Black"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-Black.woff2) format("woff2");font-weight:900;font-style:normal}@font-face{font-family:Roboto;src:local("Roboto Black Italic"),local("Roboto-BlackItalic"),url(${(0,
        t.$m)(
          "/hacsfiles/frontend/static/"
        )}fonts/roboto/Roboto-BlackItalic.woff2) format("woff2");font-weight:900;font-style:italic}`.toString(),
      o = {
        "primary-background-color": "#111111",
        "card-background-color": "#1c1c1c",
        "secondary-background-color": "#282828",
        "clear-background-color": "#111111",
        "primary-text-color": "#e1e1e1",
        "secondary-text-color": "#9b9b9b",
        "disabled-text-color": "#6f6f6f",
        "app-header-text-color": "#e1e1e1",
        "app-header-background-color": "#101e24",
        "switch-unchecked-button-color": "#999999",
        "switch-unchecked-track-color": "#9b9b9b",
        "divider-color": "rgba(225, 225, 225, .12)",
        "outline-color": "rgba(225, 225, 225, .12)",
        "mdc-ripple-color": "#AAAAAA",
        "mdc-linear-progress-buffer-color": "rgba(255, 255, 255, 0.1)",
        "input-idle-line-color": "rgba(255, 255, 255, 0.42)",
        "input-hover-line-color": "rgba(255, 255, 255, 0.87)",
        "input-disabled-line-color": "rgba(255, 255, 255, 0.06)",
        "input-outlined-idle-border-color": "rgba(255, 255, 255, 0.38)",
        "input-outlined-hover-border-color": "rgba(255, 255, 255, 0.87)",
        "input-outlined-disabled-border-color": "rgba(255, 255, 255, 0.06)",
        "input-fill-color": "rgba(255, 255, 255, 0.05)",
        "input-disabled-fill-color": "rgba(255, 255, 255, 0.02)",
        "input-ink-color": "rgba(255, 255, 255, 0.87)",
        "input-label-ink-color": "rgba(255, 255, 255, 0.6)",
        "input-disabled-ink-color": "rgba(255, 255, 255, 0.37)",
        "input-dropdown-icon-color": "rgba(255, 255, 255, 0.54)",
        "codemirror-keyword": "#C792EA",
        "codemirror-operator": "#89DDFF",
        "codemirror-variable": "#f07178",
        "codemirror-variable-2": "#EEFFFF",
        "codemirror-variable-3": "#DECB6B",
        "codemirror-builtin": "#FFCB6B",
        "codemirror-atom": "#F78C6C",
        "codemirror-number": "#FF5370",
        "codemirror-def": "#82AAFF",
        "codemirror-string": "#C3E88D",
        "codemirror-string-2": "#f07178",
        "codemirror-comment": "#545454",
        "codemirror-tag": "#FF5370",
        "codemirror-meta": "#FFCB6B",
        "codemirror-attribute": "#C792EA",
        "codemirror-property": "#C792EA",
        "codemirror-qualifier": "#DECB6B",
        "codemirror-type": "#DECB6B",
        "energy-grid-return-color": "#a280db",
        "map-filter":
          "invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3)",
        "disabled-color": "#464646",
      },
      n = {
        "state-icon-error-color":
          "var(--error-state-color, var(--error-color))",
        "state-unavailable-color":
          "var(--state-icon-unavailable-color, var(--disabled-text-color))",
        "sidebar-text-color": "var(--primary-text-color)",
        "sidebar-background-color": "var(--card-background-color)",
        "sidebar-selected-text-color": "var(--primary-color)",
        "sidebar-selected-icon-color": "var(--primary-color)",
        "sidebar-icon-color": "rgba(var(--rgb-primary-text-color), 0.6)",
        "switch-checked-color": "var(--primary-color)",
        "switch-checked-button-color":
          "var(--switch-checked-color, var(--primary-background-color))",
        "switch-checked-track-color": "var(--switch-checked-color, #000000)",
        "switch-unchecked-button-color":
          "var(--switch-unchecked-color, var(--primary-background-color))",
        "switch-unchecked-track-color":
          "var(--switch-unchecked-color, #000000)",
        "slider-color": "var(--primary-color)",
        "slider-secondary-color": "var(--light-primary-color)",
        "slider-track-color": "var(--scrollbar-thumb-color)",
        "label-badge-background-color": "var(--card-background-color)",
        "label-badge-text-color": "rgba(var(--rgb-primary-text-color), 0.8)",
        "paper-listbox-background-color": "var(--card-background-color)",
        "paper-item-icon-color": "var(--state-icon-color)",
        "paper-item-icon-active-color": "var(--state-icon-active-color)",
        "table-header-background-color": "var(--input-fill-color)",
        "table-row-background-color": "var(--primary-background-color)",
        "table-row-alternative-background-color":
          "var(--secondary-background-color)",
        "data-table-background-color": "var(--card-background-color)",
        "markdown-code-background-color": "var(--primary-background-color)",
        "mdc-theme-primary": "var(--primary-color)",
        "mdc-theme-secondary": "var(--accent-color)",
        "mdc-theme-background": "var(--primary-background-color)",
        "mdc-theme-surface": "var(--card-background-color)",
        "mdc-theme-on-primary": "var(--text-primary-color)",
        "mdc-theme-on-secondary": "var(--text-primary-color)",
        "mdc-theme-on-surface": "var(--primary-text-color)",
        "mdc-theme-text-disabled-on-light": "var(--disabled-text-color)",
        "mdc-theme-text-primary-on-background": "var(--primary-text-color)",
        "mdc-theme-text-secondary-on-background": "var(--secondary-text-color)",
        "mdc-theme-text-hint-on-background": "var(--secondary-text-color)",
        "mdc-theme-text-icon-on-background": "var(--secondary-text-color)",
        "mdc-theme-error": "var(--error-color)",
        "app-header-text-color": "var(--text-primary-color)",
        "app-header-background-color": "var(--primary-color)",
        "mdc-checkbox-unchecked-color":
          "rgba(var(--rgb-primary-text-color), 0.54)",
        "mdc-checkbox-disabled-color": "var(--disabled-text-color)",
        "mdc-radio-unchecked-color":
          "rgba(var(--rgb-primary-text-color), 0.54)",
        "mdc-radio-disabled-color": "var(--disabled-text-color)",
        "mdc-tab-text-label-color-default": "var(--primary-text-color)",
        "mdc-button-disabled-ink-color": "var(--disabled-text-color)",
        "mdc-button-outline-color": "var(--outline-color)",
        "mdc-dialog-scroll-divider-color": "var(--divider-color)",
        "mdc-dialog-heading-ink-color": "var(--primary-text-color)",
        "mdc-dialog-content-ink-color": "var(--primary-text-color)",
        "mdc-text-field-idle-line-color": "var(--input-idle-line-color)",
        "mdc-text-field-hover-line-color": "var(--input-hover-line-color)",
        "mdc-text-field-disabled-line-color":
          "var(--input-disabled-line-color)",
        "mdc-text-field-outlined-idle-border-color":
          "var(--input-outlined-idle-border-color)",
        "mdc-text-field-outlined-hover-border-color":
          "var(--input-outlined-hover-border-color)",
        "mdc-text-field-outlined-disabled-border-color":
          "var(--input-outlined-disabled-border-color)",
        "mdc-text-field-fill-color": "var(--input-fill-color)",
        "mdc-text-field-disabled-fill-color":
          "var(--input-disabled-fill-color)",
        "mdc-text-field-ink-color": "var(--input-ink-color)",
        "mdc-text-field-label-ink-color": "var(--input-label-ink-color)",
        "mdc-text-field-disabled-ink-color": "var(--input-disabled-ink-color)",
        "mdc-select-idle-line-color": "var(--input-idle-line-color)",
        "mdc-select-hover-line-color": "var(--input-hover-line-color)",
        "mdc-select-outlined-idle-border-color":
          "var(--input-outlined-idle-border-color)",
        "mdc-select-outlined-hover-border-color":
          "var(--input-outlined-hover-border-color)",
        "mdc-select-outlined-disabled-border-color":
          "var(--input-outlined-disabled-border-color)",
        "mdc-select-fill-color": "var(--input-fill-color)",
        "mdc-select-disabled-fill-color": "var(--input-disabled-fill-color)",
        "mdc-select-ink-color": "var(--input-ink-color)",
        "mdc-select-label-ink-color": "var(--input-label-ink-color)",
        "mdc-select-disabled-ink-color": "var(--input-disabled-ink-color)",
        "mdc-select-dropdown-icon-color": "var(--input-dropdown-icon-color)",
        "mdc-select-disabled-dropdown-icon-color":
          "var(--input-disabled-ink-color)",
        "chip-background-color": "rgba(var(--rgb-primary-text-color), 0.15)",
        "material-body-text-color": "var(--primary-text-color)",
        "material-background-color": "var(--card-background-color)",
        "material-secondary-background-color":
          "var(--secondary-background-color)",
        "material-secondary-text-color": "var(--secondary-text-color)",
      },
      i =
        t.iv`html{font-size:14px;height:100vh;--primary-text-color:#212121;--secondary-text-color:#727272;--text-primary-color:#ffffff;--text-light-primary-color:#212121;--disabled-text-color:#bdbdbd;--primary-color:${(0,
        t.$m)(
          "#03a9f4"
        )};--dark-primary-color:#0288d1;--light-primary-color:#b3e5fc;--accent-color:${(0,
        t.$m)(
          "#ff9800"
        )};--divider-color:rgba(0, 0, 0, 0.12);--outline-color:rgba(0, 0, 0, 0.12);--scrollbar-thumb-color:rgb(194, 194, 194);--error-color:#db4437;--warning-color:#ffa600;--success-color:#43a047;--info-color:#039be5;--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#e5e5e5;--clear-background-color:#ffffff;--header-height:56px;--label-badge-red:var(--error-color);--label-badge-blue:var(--info-color);--label-badge-green:var(--success-color);--label-badge-yellow:var(--warning-color);--label-badge-grey:#9e9e9e;--state-icon-color:#44739e;--energy-grid-consumption-color:#488fc2;--energy-grid-return-color:#8353d1;--energy-solar-color:#ff9800;--energy-non-fossil-color:#0f9d58;--energy-battery-out-color:#4db6ac;--energy-battery-in-color:#f06292;--energy-gas-color:#8e021b;--energy-water-color:#00bcd4;--dark-divider-opacity:0.12;--dark-disabled-opacity:0.38;--dark-secondary-opacity:0.54;--dark-primary-opacity:0.87;--light-divider-opacity:0.12;--light-disabled-opacity:0.3;--light-secondary-opacity:0.7;--light-primary-opacity:1;--rgb-primary-color:3,169,244;--rgb-accent-color:255,152,0;--rgb-primary-text-color:33,33,33;--rgb-secondary-text-color:114,114,114;--rgb-text-primary-color:255,255,255;--rgb-card-background-color:255,255,255;--disabled-color:#bdbdbd;--red-color:#f44336;--pink-color:#e91e63;--purple-color:#926bc7;--deep-purple-color:#6e41ab;--indigo-color:#3f51b5;--blue-color:#2196f3;--light-blue-color:#03a9f4;--cyan-color:#00bcd4;--teal-color:#009688;--green-color:#4caf50;--light-green-color:#8bc34a;--lime-color:#cddc39;--yellow-color:#ffeb3b;--amber-color:#ffc107;--orange-color:#ff9800;--deep-orange-color:#ff6f22;--brown-color:#795548;--light-grey-color:#bdbdbd;--grey-color:#9e9e9e;--dark-grey-color:#606060;--blue-grey-color:#607d8b;--black-color:#000000;--white-color:#ffffff;--state-active-color:var(--amber-color);--state-inactive-color:var(--grey-color);--state-unavailable-color:var(--disabled-color);--state-alarm_control_panel-armed_away-color:var(--green-color);--state-alarm_control_panel-armed_custom_bypass-color:var(--green-color);--state-alarm_control_panel-armed_home-color:var(--green-color);--state-alarm_control_panel-armed_night-color:var(--green-color);--state-alarm_control_panel-armed_vacation-color:var(--green-color);--state-alarm_control_panel-arming-color:var(--orange-color);--state-alarm_control_panel-disarming-color:var(--orange-color);--state-alarm_control_panel-pending-color:var(--orange-color);--state-alarm_control_panel-triggered-color:var(--red-color);--state-alert-off-color:var(--orange-color);--state-alert-on-color:var(--red-color);--state-binary_sensor-active-color:var(--amber-color);--state-binary_sensor-battery-on-color:var(--red-color);--state-binary_sensor-carbon_monoxide-on-color:var(--red-color);--state-binary_sensor-gas-on-color:var(--red-color);--state-binary_sensor-heat-on-color:var(--red-color);--state-binary_sensor-lock-on-color:var(--red-color);--state-binary_sensor-moisture-on-color:var(--red-color);--state-binary_sensor-problem-on-color:var(--red-color);--state-binary_sensor-safety-on-color:var(--red-color);--state-binary_sensor-smoke-on-color:var(--red-color);--state-binary_sensor-sound-on-color:var(--red-color);--state-binary_sensor-tamper-on-color:var(--red-color);--state-climate-auto-color:var(--green-color);--state-climate-cool-color:var(--blue-color);--state-climate-dry-color:var(--orange-color);--state-climate-fan_only-color:var(--cyan-color);--state-climate-heat-color:var(--deep-orange-color);--state-climate-heat-cool-color:var(--amber-color);--state-cover-active-color:var(--purple-color);--state-device_tracker-active-color:var(--blue-color);--state-device_tracker-home-color:var(--green-color);--state-fan-active-color:var(--cyan-color);--state-humidifier-on-color:var(--blue-color);--state-lawn_mower-error-color:var(--red-color);--state-lawn_mower-mowing-color:var(--teal-color);--state-light-active-color:var(--amber-color);--state-lock-jammed-color:var(--red-color);--state-lock-locked-color:var(--green-color);--state-lock-pending-color:var(--orange-color);--state-lock-unlocked-color:var(--red-color);--state-media_player-active-color:var(--light-blue-color);--state-person-active-color:var(--blue-color);--state-person-home-color:var(--green-color);--state-plant-active-color:var(--red-color);--state-siren-active-color:var(--red-color);--state-sun-above_horizon-color:var(--amber-color);--state-sun-below_horizon-color:var(--indigo-color);--state-switch-active-color:var(--amber-color);--state-update-active-color:var(--orange-color);--state-vacuum-active-color:var(--teal-color);--state-valve-active-color:var(--blue-color);--state-sensor-battery-high-color:var(--green-color);--state-sensor-battery-low-color:var(--red-color);--state-sensor-battery-medium-color:var(--orange-color);--state-water_heater-eco-color:var(--green-color);--state-water_heater-electric-color:var(--orange-color);--state-water_heater-gas-color:var(--orange-color);--state-water_heater-heat_pump-color:var(--orange-color);--state-water_heater-high_demand-color:var(--deep-orange-color);--state-water_heater-performance-color:var(--deep-orange-color);--history-unavailable-color:transparent;--history-unknown-color:var(--dark-grey-color);--input-idle-line-color:rgba(0, 0, 0, 0.42);--input-hover-line-color:rgba(0, 0, 0, 0.87);--input-disabled-line-color:rgba(0, 0, 0, 0.06);--input-outlined-idle-border-color:rgba(0, 0, 0, 0.38);--input-outlined-hover-border-color:rgba(0, 0, 0, 0.87);--input-outlined-disabled-border-color:rgba(0, 0, 0, 0.06);--input-fill-color:rgb(245, 245, 245);--input-disabled-fill-color:rgb(250, 250, 250);--input-ink-color:rgba(0, 0, 0, 0.87);--input-label-ink-color:rgba(0, 0, 0, 0.6);--input-disabled-ink-color:rgba(0, 0, 0, 0.37);--input-dropdown-icon-color:rgba(0, 0, 0, 0.54);--material-h6-font-size:1.25rem;--material-small-font-size:0.875rem;--material-caption-font-size:0.75rem;--material-button-font-size:0.875rem;--shadow-transition:{transition:box-shadow .28s cubic-bezier(.4, 0, .2, 1)};--shadow-none:{box-shadow:none};--shadow-elevation-2dp:{box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2)};--shadow-elevation-3dp:{box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12),0 3px 3px -2px rgba(0,0,0,.4)};--shadow-elevation-4dp:{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.4)};--shadow-elevation-6dp:{box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.4)};--shadow-elevation-8dp:{box-shadow:0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.4)};--shadow-elevation-12dp:{box-shadow:0 12px 16px 1px rgba(0,0,0,.14),0 4px 22px 3px rgba(0,0,0,.12),0 6px 7px -4px rgba(0,0,0,.4)};--shadow-elevation-16dp:{box-shadow:0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12),0 8px 10px -5px rgba(0,0,0,.4)};--shadow-elevation-24dp:{box-shadow:0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12),0 11px 15px -7px rgba(0,0,0,.4)};--paper-font-common-base:{font-family:Roboto,Noto,sans-serif;-webkit-font-smoothing:antialiased};--paper-font-common-code:{font-family:"Roboto Mono",Consolas,Menlo,monospace;-webkit-font-smoothing:antialiased};--paper-font-common-expensive-kerning:{text-rendering:optimizeLegibility};--paper-font-common-nowrap:{white-space:nowrap;overflow:hidden;text-overflow:ellipsis};--paper-font-display4:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:112px;font-weight:300;letter-spacing:-.044em;line-height:120px};--paper-font-display3:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:56px;font-weight:400;letter-spacing:-.026em;line-height:60px};--paper-font-display2:{@apply --paper-font-common-base;font-size:45px;font-weight:400;letter-spacing:-.018em;line-height:48px};--paper-font-display1:{@apply --paper-font-common-base;font-size:34px;font-weight:400;letter-spacing:-.01em;line-height:40px};--paper-font-headline:{@apply --paper-font-common-base;font-size:24px;font-weight:400;letter-spacing:-.012em;line-height:32px};--paper-font-title:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:20px;font-weight:500;line-height:28px};--paper-font-subhead:{@apply --paper-font-common-base;font-size:16px;font-weight:400;line-height:24px};--paper-font-body2:{@apply --paper-font-common-base;font-size:14px;font-weight:500;line-height:24px};--paper-font-body1:{@apply --paper-font-common-base;font-size:14px;font-weight:400;line-height:20px};--paper-font-caption:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:12px;font-weight:400;letter-spacing:.011em;line-height:20px};--paper-font-menu:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:13px;font-weight:500;line-height:24px};--paper-font-button:{@apply --paper-font-common-base;@apply --paper-font-common-nowrap;font-size:14px;font-weight:500;letter-spacing:.018em;line-height:24px;text-transform:uppercase};--paper-font-code2:{@apply --paper-font-common-code;font-size:14px;font-weight:700;line-height:20px};--paper-font-code1:{@apply --paper-font-common-code;font-size:14px;font-weight:500;line-height:20px};direction:ltr;--direction:ltr;--float-start:left;--float-end:right;${(0,
        t.$m)(
          Object.entries(n)
            .map(([e, t]) => `--${e}: ${t};`)
            .join("")
        )}}`.toString(),
      a = document.createElement("style");
    (a.textContent = [i, r].join("")), document.head.append(a);
    if (
      /^((?!chrome|android).)*version\/14\.0\s.*safari/i.test(
        navigator.userAgent
      )
    ) {
      const e = window.Element.prototype.attachShadow;
      window.Element.prototype.attachShadow = function (t) {
        return (
          t && t.delegatesFocus && delete t.delegatesFocus, e.apply(this, [t])
        );
      };
    }
    var s = l(309),
      c = l(34541),
      h = l(47838),
      d = l(95260),
      u = l(4096),
      p = l(58579);
    const f = (e, t = 1) => [e[0] - 18 * t, e[1], e[2]],
      m = (e) => {
        const t = [0, 0, 0];
        for (let r = 0; r < e.length; r++) {
          const o = e[r] / 255;
          t[r] = o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2];
      },
      v = (e, t) => {
        const r = m(e),
          o = m(t);
        return r > o ? (r + 0.05) / (o + 0.05) : (o + 0.05) / (r + 0.05);
      };
    let b = {};
    const y = (e, t, r, n, i) => {
        var a, s;
        const l = r || (i ? t.theme : void 0),
          c = void 0 !== (null == n ? void 0 : n.dark) ? n.dark : t.darkMode;
        let h = l,
          d = {};
        if ((l && c && ((h = `${h}__dark`), (d = { ...o })), "default" === l)) {
          var m;
          const t = null == n ? void 0 : n.primaryColor,
            r = null == n ? void 0 : n.accentColor;
          if (
            (c &&
              t &&
              (d["app-header-background-color"] = (0, p.o)(t, "#121212", 8)),
            t)
          ) {
            h = `${h}__primary_${t}`;
            const e = (0, u.wK)(t),
              r = (0, u.Rw)(e);
            d["primary-color"] = t;
            const o = (0, u.p3)(((e, t = 1) => f(e, -t))(r));
            (d["light-primary-color"] = (0, u.CO)(o)),
              (d["dark-primary-color"] = (0, u.uO)(f(r))),
              (d["text-primary-color"] =
                v(e, [33, 33, 33]) < 6 ? "#fff" : "#212121"),
              (d["text-light-primary-color"] =
                v(o, [33, 33, 33]) < 6 ? "#fff" : "#212121"),
              (d["state-icon-color"] = d["dark-primary-color"]);
          }
          if (r) {
            (h = `${h}__accent_${r}`), (d["accent-color"] = r);
            const e = (0, u.wK)(r);
            d["text-accent-color"] =
              v(e, [33, 33, 33]) < 6 ? "#fff" : "#212121";
          }
          if (
            (null === (m = e.__themes) || void 0 === m
              ? void 0
              : m.cacheKey) === h
          )
            return;
        }
        if (l && "default" !== l && t.themes[l]) {
          const { modes: e, ...r } = t.themes[l];
          (d = { ...d, ...r }),
            e && (d = c ? { ...d, ...e.dark } : { ...d, ...e.light });
        }
        if (
          !(
            (null !== (a = e.__themes) && void 0 !== a && a.keys) ||
            Object.keys(d).length
          )
        )
          return;
        const y = Object.keys(d).length && h ? b[h] || g(h, d) : void 0,
          _ = {
            ...(null === (s = e.__themes) || void 0 === s ? void 0 : s.keys),
            ...(null == y ? void 0 : y.styles),
          };
        if (
          ((e.__themes = { cacheKey: h, keys: null == y ? void 0 : y.keys }),
          e.updateStyles)
        )
          e.updateStyles(_);
        else if (window.ShadyCSS) window.ShadyCSS.styleSubtree(e, _);
        else
          for (const t in _)
            null === t
              ? e.style.removeProperty(t)
              : e.style.setProperty(t, _[t]);
      },
      g = (e, t) => {
        if (!t || !Object.keys(t).length) return;
        const r = { ...n, ...t },
          o = {},
          i = {};
        for (const e of Object.keys(r)) {
          const t = `--${e}`,
            n = String(r[e]);
          if (((o[t] = n), (i[t] = ""), !n.startsWith("#"))) continue;
          const a = `rgb-${e}`;
          if (void 0 === r[a])
            try {
              const e = (0, u.wK)(n).join(","),
                t = `--${a}`;
              (o[t] = e), (i[t] = "");
            } catch (e) {
              continue;
            }
        }
        return (b[e] = { styles: o, keys: i }), { styles: o, keys: i };
      };
    var _ = l(18394),
      w = l(67684),
      E = l(6429),
      A = l(38480),
      k = l(60625),
      S = l(23792);
    var x,
      P,
      T,
      H = l(43204);
    function $(e) {
      return e.type === P.literal;
    }
    function C(e) {
      return e.type === P.argument;
    }
    function B(e) {
      return e.type === P.number;
    }
    function R(e) {
      return e.type === P.date;
    }
    function N(e) {
      return e.type === P.time;
    }
    function L(e) {
      return e.type === P.select;
    }
    function I(e) {
      return e.type === P.plural;
    }
    function O(e) {
      return e.type === P.pound;
    }
    function M(e) {
      return e.type === P.tag;
    }
    function U(e) {
      return !(!e || "object" != typeof e || e.type !== T.number);
    }
    function D(e) {
      return !(!e || "object" != typeof e || e.type !== T.dateTime);
    }
    !(function (e) {
      (e[(e.EXPECT_ARGUMENT_CLOSING_BRACE = 1)] =
        "EXPECT_ARGUMENT_CLOSING_BRACE"),
        (e[(e.EMPTY_ARGUMENT = 2)] = "EMPTY_ARGUMENT"),
        (e[(e.MALFORMED_ARGUMENT = 3)] = "MALFORMED_ARGUMENT"),
        (e[(e.EXPECT_ARGUMENT_TYPE = 4)] = "EXPECT_ARGUMENT_TYPE"),
        (e[(e.INVALID_ARGUMENT_TYPE = 5)] = "INVALID_ARGUMENT_TYPE"),
        (e[(e.EXPECT_ARGUMENT_STYLE = 6)] = "EXPECT_ARGUMENT_STYLE"),
        (e[(e.INVALID_NUMBER_SKELETON = 7)] = "INVALID_NUMBER_SKELETON"),
        (e[(e.INVALID_DATE_TIME_SKELETON = 8)] = "INVALID_DATE_TIME_SKELETON"),
        (e[(e.EXPECT_NUMBER_SKELETON = 9)] = "EXPECT_NUMBER_SKELETON"),
        (e[(e.EXPECT_DATE_TIME_SKELETON = 10)] = "EXPECT_DATE_TIME_SKELETON"),
        (e[(e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11)] =
          "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"),
        (e[(e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12)] =
          "EXPECT_SELECT_ARGUMENT_OPTIONS"),
        (e[(e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13)] =
          "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"),
        (e[(e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14)] =
          "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"),
        (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15)] =
          "EXPECT_SELECT_ARGUMENT_SELECTOR"),
        (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16)] =
          "EXPECT_PLURAL_ARGUMENT_SELECTOR"),
        (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17)] =
          "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"),
        (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18)] =
          "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"),
        (e[(e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19)] =
          "INVALID_PLURAL_ARGUMENT_SELECTOR"),
        (e[(e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20)] =
          "DUPLICATE_PLURAL_ARGUMENT_SELECTOR"),
        (e[(e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21)] =
          "DUPLICATE_SELECT_ARGUMENT_SELECTOR"),
        (e[(e.MISSING_OTHER_CLAUSE = 22)] = "MISSING_OTHER_CLAUSE"),
        (e[(e.INVALID_TAG = 23)] = "INVALID_TAG"),
        (e[(e.INVALID_TAG_NAME = 25)] = "INVALID_TAG_NAME"),
        (e[(e.UNMATCHED_CLOSING_TAG = 26)] = "UNMATCHED_CLOSING_TAG"),
        (e[(e.UNCLOSED_TAG = 27)] = "UNCLOSED_TAG");
    })(x || (x = {})),
      (function (e) {
        (e[(e.literal = 0)] = "literal"),
          (e[(e.argument = 1)] = "argument"),
          (e[(e.number = 2)] = "number"),
          (e[(e.date = 3)] = "date"),
          (e[(e.time = 4)] = "time"),
          (e[(e.select = 5)] = "select"),
          (e[(e.plural = 6)] = "plural"),
          (e[(e.pound = 7)] = "pound"),
          (e[(e.tag = 8)] = "tag");
      })(P || (P = {})),
      (function (e) {
        (e[(e.number = 0)] = "number"), (e[(e.dateTime = 1)] = "dateTime");
      })(T || (T = {}));
    var F = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
      G =
        /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
    function j(e) {
      var t = {};
      return (
        e.replace(G, function (e) {
          var r = e.length;
          switch (e[0]) {
            case "G":
              t.era = 4 === r ? "long" : 5 === r ? "narrow" : "short";
              break;
            case "y":
              t.year = 2 === r ? "2-digit" : "numeric";
              break;
            case "Y":
            case "u":
            case "U":
            case "r":
              throw new RangeError(
                "`Y/u/U/r` (year) patterns are not supported, use `y` instead"
              );
            case "q":
            case "Q":
              throw new RangeError(
                "`q/Q` (quarter) patterns are not supported"
              );
            case "M":
            case "L":
              t.month = ["numeric", "2-digit", "short", "long", "narrow"][
                r - 1
              ];
              break;
            case "w":
            case "W":
              throw new RangeError("`w/W` (week) patterns are not supported");
            case "d":
              t.day = ["numeric", "2-digit"][r - 1];
              break;
            case "D":
            case "F":
            case "g":
              throw new RangeError(
                "`D/F/g` (day) patterns are not supported, use `d` instead"
              );
            case "E":
              t.weekday = 4 === r ? "long" : 5 === r ? "narrow" : "short";
              break;
            case "e":
              if (r < 4)
                throw new RangeError(
                  "`e..eee` (weekday) patterns are not supported"
                );
              t.weekday = ["short", "long", "narrow", "short"][r - 4];
              break;
            case "c":
              if (r < 4)
                throw new RangeError(
                  "`c..ccc` (weekday) patterns are not supported"
                );
              t.weekday = ["short", "long", "narrow", "short"][r - 4];
              break;
            case "a":
              t.hour12 = !0;
              break;
            case "b":
            case "B":
              throw new RangeError(
                "`b/B` (period) patterns are not supported, use `a` instead"
              );
            case "h":
              (t.hourCycle = "h12"), (t.hour = ["numeric", "2-digit"][r - 1]);
              break;
            case "H":
              (t.hourCycle = "h23"), (t.hour = ["numeric", "2-digit"][r - 1]);
              break;
            case "K":
              (t.hourCycle = "h11"), (t.hour = ["numeric", "2-digit"][r - 1]);
              break;
            case "k":
              (t.hourCycle = "h24"), (t.hour = ["numeric", "2-digit"][r - 1]);
              break;
            case "j":
            case "J":
            case "C":
              throw new RangeError(
                "`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead"
              );
            case "m":
              t.minute = ["numeric", "2-digit"][r - 1];
              break;
            case "s":
              t.second = ["numeric", "2-digit"][r - 1];
              break;
            case "S":
            case "A":
              throw new RangeError(
                "`S/A` (second) patterns are not supported, use `s` instead"
              );
            case "z":
              t.timeZoneName = r < 4 ? "short" : "long";
              break;
            case "Z":
            case "O":
            case "v":
            case "V":
            case "X":
            case "x":
              throw new RangeError(
                "`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead"
              );
          }
          return "";
        }),
        t
      );
    }
    var z = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
    var V = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
      Y = /^(@+)?(\+|#+)?[rs]?$/g,
      K = /(\*)(0+)|(#+)(0+)|(0+)/g,
      Z = /^(0+)$/;
    function W(e) {
      var t = {};
      return (
        "r" === e[e.length - 1]
          ? (t.roundingPriority = "morePrecision")
          : "s" === e[e.length - 1] && (t.roundingPriority = "lessPrecision"),
        e.replace(Y, function (e, r, o) {
          return (
            "string" != typeof o
              ? ((t.minimumSignificantDigits = r.length),
                (t.maximumSignificantDigits = r.length))
              : "+" === o
              ? (t.minimumSignificantDigits = r.length)
              : "#" === r[0]
              ? (t.maximumSignificantDigits = r.length)
              : ((t.minimumSignificantDigits = r.length),
                (t.maximumSignificantDigits =
                  r.length + ("string" == typeof o ? o.length : 0))),
            ""
          );
        }),
        t
      );
    }
    function X(e) {
      switch (e) {
        case "sign-auto":
          return { signDisplay: "auto" };
        case "sign-accounting":
        case "()":
          return { currencySign: "accounting" };
        case "sign-always":
        case "+!":
          return { signDisplay: "always" };
        case "sign-accounting-always":
        case "()!":
          return { signDisplay: "always", currencySign: "accounting" };
        case "sign-except-zero":
        case "+?":
          return { signDisplay: "exceptZero" };
        case "sign-accounting-except-zero":
        case "()?":
          return { signDisplay: "exceptZero", currencySign: "accounting" };
        case "sign-never":
        case "+_":
          return { signDisplay: "never" };
      }
    }
    function q(e) {
      var t;
      if (
        ("E" === e[0] && "E" === e[1]
          ? ((t = { notation: "engineering" }), (e = e.slice(2)))
          : "E" === e[0] &&
            ((t = { notation: "scientific" }), (e = e.slice(1))),
        t)
      ) {
        var r = e.slice(0, 2);
        if (
          ("+!" === r
            ? ((t.signDisplay = "always"), (e = e.slice(2)))
            : "+?" === r && ((t.signDisplay = "exceptZero"), (e = e.slice(2))),
          !Z.test(e))
        )
          throw new Error("Malformed concise eng/scientific notation");
        t.minimumIntegerDigits = e.length;
      }
      return t;
    }
    function J(e) {
      var t = X(e);
      return t || {};
    }
    function Q(e) {
      for (var t = {}, r = 0, o = e; r < o.length; r++) {
        var n = o[r];
        switch (n.stem) {
          case "percent":
          case "%":
            t.style = "percent";
            continue;
          case "%x100":
            (t.style = "percent"), (t.scale = 100);
            continue;
          case "currency":
            (t.style = "currency"), (t.currency = n.options[0]);
            continue;
          case "group-off":
          case ",_":
            t.useGrouping = !1;
            continue;
          case "precision-integer":
          case ".":
            t.maximumFractionDigits = 0;
            continue;
          case "measure-unit":
          case "unit":
            (t.style = "unit"), (t.unit = n.options[0].replace(/^(.*?)-/, ""));
            continue;
          case "compact-short":
          case "K":
            (t.notation = "compact"), (t.compactDisplay = "short");
            continue;
          case "compact-long":
          case "KK":
            (t.notation = "compact"), (t.compactDisplay = "long");
            continue;
          case "scientific":
            t = (0, H.__assign)(
              (0, H.__assign)((0, H.__assign)({}, t), {
                notation: "scientific",
              }),
              n.options.reduce(function (e, t) {
                return (0, H.__assign)((0, H.__assign)({}, e), J(t));
              }, {})
            );
            continue;
          case "engineering":
            t = (0, H.__assign)(
              (0, H.__assign)((0, H.__assign)({}, t), {
                notation: "engineering",
              }),
              n.options.reduce(function (e, t) {
                return (0, H.__assign)((0, H.__assign)({}, e), J(t));
              }, {})
            );
            continue;
          case "notation-simple":
            t.notation = "standard";
            continue;
          case "unit-width-narrow":
            (t.currencyDisplay = "narrowSymbol"), (t.unitDisplay = "narrow");
            continue;
          case "unit-width-short":
            (t.currencyDisplay = "code"), (t.unitDisplay = "short");
            continue;
          case "unit-width-full-name":
            (t.currencyDisplay = "name"), (t.unitDisplay = "long");
            continue;
          case "unit-width-iso-code":
            t.currencyDisplay = "symbol";
            continue;
          case "scale":
            t.scale = parseFloat(n.options[0]);
            continue;
          case "integer-width":
            if (n.options.length > 1)
              throw new RangeError(
                "integer-width stems only accept a single optional option"
              );
            n.options[0].replace(K, function (e, r, o, n, i, a) {
              if (r) t.minimumIntegerDigits = o.length;
              else {
                if (n && i)
                  throw new Error(
                    "We currently do not support maximum integer digits"
                  );
                if (a)
                  throw new Error(
                    "We currently do not support exact integer digits"
                  );
              }
              return "";
            });
            continue;
        }
        if (Z.test(n.stem)) t.minimumIntegerDigits = n.stem.length;
        else if (V.test(n.stem)) {
          if (n.options.length > 1)
            throw new RangeError(
              "Fraction-precision stems only accept a single optional option"
            );
          n.stem.replace(V, function (e, r, o, n, i, a) {
            return (
              "*" === o
                ? (t.minimumFractionDigits = r.length)
                : n && "#" === n[0]
                ? (t.maximumFractionDigits = n.length)
                : i && a
                ? ((t.minimumFractionDigits = i.length),
                  (t.maximumFractionDigits = i.length + a.length))
                : ((t.minimumFractionDigits = r.length),
                  (t.maximumFractionDigits = r.length)),
              ""
            );
          });
          var i = n.options[0];
          "w" === i
            ? (t = (0, H.__assign)((0, H.__assign)({}, t), {
                trailingZeroDisplay: "stripIfInteger",
              }))
            : i && (t = (0, H.__assign)((0, H.__assign)({}, t), W(i)));
        } else if (Y.test(n.stem))
          t = (0, H.__assign)((0, H.__assign)({}, t), W(n.stem));
        else {
          var a = X(n.stem);
          a && (t = (0, H.__assign)((0, H.__assign)({}, t), a));
          var s = q(n.stem);
          s && (t = (0, H.__assign)((0, H.__assign)({}, t), s));
        }
      }
      return t;
    }
    var ee,
      te = {
        "001": ["H", "h"],
        AC: ["H", "h", "hb", "hB"],
        AD: ["H", "hB"],
        AE: ["h", "hB", "hb", "H"],
        AF: ["H", "hb", "hB", "h"],
        AG: ["h", "hb", "H", "hB"],
        AI: ["H", "h", "hb", "hB"],
        AL: ["h", "H", "hB"],
        AM: ["H", "hB"],
        AO: ["H", "hB"],
        AR: ["H", "h", "hB", "hb"],
        AS: ["h", "H"],
        AT: ["H", "hB"],
        AU: ["h", "hb", "H", "hB"],
        AW: ["H", "hB"],
        AX: ["H"],
        AZ: ["H", "hB", "h"],
        BA: ["H", "hB", "h"],
        BB: ["h", "hb", "H", "hB"],
        BD: ["h", "hB", "H"],
        BE: ["H", "hB"],
        BF: ["H", "hB"],
        BG: ["H", "hB", "h"],
        BH: ["h", "hB", "hb", "H"],
        BI: ["H", "h"],
        BJ: ["H", "hB"],
        BL: ["H", "hB"],
        BM: ["h", "hb", "H", "hB"],
        BN: ["hb", "hB", "h", "H"],
        BO: ["H", "hB", "h", "hb"],
        BQ: ["H"],
        BR: ["H", "hB"],
        BS: ["h", "hb", "H", "hB"],
        BT: ["h", "H"],
        BW: ["H", "h", "hb", "hB"],
        BY: ["H", "h"],
        BZ: ["H", "h", "hb", "hB"],
        CA: ["h", "hb", "H", "hB"],
        CC: ["H", "h", "hb", "hB"],
        CD: ["hB", "H"],
        CF: ["H", "h", "hB"],
        CG: ["H", "hB"],
        CH: ["H", "hB", "h"],
        CI: ["H", "hB"],
        CK: ["H", "h", "hb", "hB"],
        CL: ["H", "h", "hB", "hb"],
        CM: ["H", "h", "hB"],
        CN: ["H", "hB", "hb", "h"],
        CO: ["h", "H", "hB", "hb"],
        CP: ["H"],
        CR: ["H", "h", "hB", "hb"],
        CU: ["H", "h", "hB", "hb"],
        CV: ["H", "hB"],
        CW: ["H", "hB"],
        CX: ["H", "h", "hb", "hB"],
        CY: ["h", "H", "hb", "hB"],
        CZ: ["H"],
        DE: ["H", "hB"],
        DG: ["H", "h", "hb", "hB"],
        DJ: ["h", "H"],
        DK: ["H"],
        DM: ["h", "hb", "H", "hB"],
        DO: ["h", "H", "hB", "hb"],
        DZ: ["h", "hB", "hb", "H"],
        EA: ["H", "h", "hB", "hb"],
        EC: ["H", "hB", "h", "hb"],
        EE: ["H", "hB"],
        EG: ["h", "hB", "hb", "H"],
        EH: ["h", "hB", "hb", "H"],
        ER: ["h", "H"],
        ES: ["H", "hB", "h", "hb"],
        ET: ["hB", "hb", "h", "H"],
        FI: ["H"],
        FJ: ["h", "hb", "H", "hB"],
        FK: ["H", "h", "hb", "hB"],
        FM: ["h", "hb", "H", "hB"],
        FO: ["H", "h"],
        FR: ["H", "hB"],
        GA: ["H", "hB"],
        GB: ["H", "h", "hb", "hB"],
        GD: ["h", "hb", "H", "hB"],
        GE: ["H", "hB", "h"],
        GF: ["H", "hB"],
        GG: ["H", "h", "hb", "hB"],
        GH: ["h", "H"],
        GI: ["H", "h", "hb", "hB"],
        GL: ["H", "h"],
        GM: ["h", "hb", "H", "hB"],
        GN: ["H", "hB"],
        GP: ["H", "hB"],
        GQ: ["H", "hB", "h", "hb"],
        GR: ["h", "H", "hb", "hB"],
        GT: ["H", "h", "hB", "hb"],
        GU: ["h", "hb", "H", "hB"],
        GW: ["H", "hB"],
        GY: ["h", "hb", "H", "hB"],
        HK: ["h", "hB", "hb", "H"],
        HN: ["H", "h", "hB", "hb"],
        HR: ["H", "hB"],
        HU: ["H", "h"],
        IC: ["H", "h", "hB", "hb"],
        ID: ["H"],
        IE: ["H", "h", "hb", "hB"],
        IL: ["H", "hB"],
        IM: ["H", "h", "hb", "hB"],
        IN: ["h", "H"],
        IO: ["H", "h", "hb", "hB"],
        IQ: ["h", "hB", "hb", "H"],
        IR: ["hB", "H"],
        IS: ["H"],
        IT: ["H", "hB"],
        JE: ["H", "h", "hb", "hB"],
        JM: ["h", "hb", "H", "hB"],
        JO: ["h", "hB", "hb", "H"],
        JP: ["H", "K", "h"],
        KE: ["hB", "hb", "H", "h"],
        KG: ["H", "h", "hB", "hb"],
        KH: ["hB", "h", "H", "hb"],
        KI: ["h", "hb", "H", "hB"],
        KM: ["H", "h", "hB", "hb"],
        KN: ["h", "hb", "H", "hB"],
        KP: ["h", "H", "hB", "hb"],
        KR: ["h", "H", "hB", "hb"],
        KW: ["h", "hB", "hb", "H"],
        KY: ["h", "hb", "H", "hB"],
        KZ: ["H", "hB"],
        LA: ["H", "hb", "hB", "h"],
        LB: ["h", "hB", "hb", "H"],
        LC: ["h", "hb", "H", "hB"],
        LI: ["H", "hB", "h"],
        LK: ["H", "h", "hB", "hb"],
        LR: ["h", "hb", "H", "hB"],
        LS: ["h", "H"],
        LT: ["H", "h", "hb", "hB"],
        LU: ["H", "h", "hB"],
        LV: ["H", "hB", "hb", "h"],
        LY: ["h", "hB", "hb", "H"],
        MA: ["H", "h", "hB", "hb"],
        MC: ["H", "hB"],
        MD: ["H", "hB"],
        ME: ["H", "hB", "h"],
        MF: ["H", "hB"],
        MG: ["H", "h"],
        MH: ["h", "hb", "H", "hB"],
        MK: ["H", "h", "hb", "hB"],
        ML: ["H"],
        MM: ["hB", "hb", "H", "h"],
        MN: ["H", "h", "hb", "hB"],
        MO: ["h", "hB", "hb", "H"],
        MP: ["h", "hb", "H", "hB"],
        MQ: ["H", "hB"],
        MR: ["h", "hB", "hb", "H"],
        MS: ["H", "h", "hb", "hB"],
        MT: ["H", "h"],
        MU: ["H", "h"],
        MV: ["H", "h"],
        MW: ["h", "hb", "H", "hB"],
        MX: ["H", "h", "hB", "hb"],
        MY: ["hb", "hB", "h", "H"],
        MZ: ["H", "hB"],
        NA: ["h", "H", "hB", "hb"],
        NC: ["H", "hB"],
        NE: ["H"],
        NF: ["H", "h", "hb", "hB"],
        NG: ["H", "h", "hb", "hB"],
        NI: ["H", "h", "hB", "hb"],
        NL: ["H", "hB"],
        NO: ["H", "h"],
        NP: ["H", "h", "hB"],
        NR: ["H", "h", "hb", "hB"],
        NU: ["H", "h", "hb", "hB"],
        NZ: ["h", "hb", "H", "hB"],
        OM: ["h", "hB", "hb", "H"],
        PA: ["h", "H", "hB", "hb"],
        PE: ["H", "hB", "h", "hb"],
        PF: ["H", "h", "hB"],
        PG: ["h", "H"],
        PH: ["h", "hB", "hb", "H"],
        PK: ["h", "hB", "H"],
        PL: ["H", "h"],
        PM: ["H", "hB"],
        PN: ["H", "h", "hb", "hB"],
        PR: ["h", "H", "hB", "hb"],
        PS: ["h", "hB", "hb", "H"],
        PT: ["H", "hB"],
        PW: ["h", "H"],
        PY: ["H", "h", "hB", "hb"],
        QA: ["h", "hB", "hb", "H"],
        RE: ["H", "hB"],
        RO: ["H", "hB"],
        RS: ["H", "hB", "h"],
        RU: ["H"],
        RW: ["H", "h"],
        SA: ["h", "hB", "hb", "H"],
        SB: ["h", "hb", "H", "hB"],
        SC: ["H", "h", "hB"],
        SD: ["h", "hB", "hb", "H"],
        SE: ["H"],
        SG: ["h", "hb", "H", "hB"],
        SH: ["H", "h", "hb", "hB"],
        SI: ["H", "hB"],
        SJ: ["H"],
        SK: ["H"],
        SL: ["h", "hb", "H", "hB"],
        SM: ["H", "h", "hB"],
        SN: ["H", "h", "hB"],
        SO: ["h", "H"],
        SR: ["H", "hB"],
        SS: ["h", "hb", "H", "hB"],
        ST: ["H", "hB"],
        SV: ["H", "h", "hB", "hb"],
        SX: ["H", "h", "hb", "hB"],
        SY: ["h", "hB", "hb", "H"],
        SZ: ["h", "hb", "H", "hB"],
        TA: ["H", "h", "hb", "hB"],
        TC: ["h", "hb", "H", "hB"],
        TD: ["h", "H", "hB"],
        TF: ["H", "h", "hB"],
        TG: ["H", "hB"],
        TH: ["H", "h"],
        TJ: ["H", "h"],
        TL: ["H", "hB", "hb", "h"],
        TM: ["H", "h"],
        TN: ["h", "hB", "hb", "H"],
        TO: ["h", "H"],
        TR: ["H", "hB"],
        TT: ["h", "hb", "H", "hB"],
        TW: ["hB", "hb", "h", "H"],
        TZ: ["hB", "hb", "H", "h"],
        UA: ["H", "hB", "h"],
        UG: ["hB", "hb", "H", "h"],
        UM: ["h", "hb", "H", "hB"],
        US: ["h", "hb", "H", "hB"],
        UY: ["H", "h", "hB", "hb"],
        UZ: ["H", "hB", "h"],
        VA: ["H", "h", "hB"],
        VC: ["h", "hb", "H", "hB"],
        VE: ["h", "H", "hB", "hb"],
        VG: ["h", "hb", "H", "hB"],
        VI: ["h", "hb", "H", "hB"],
        VN: ["H", "h"],
        VU: ["h", "H"],
        WF: ["H", "hB"],
        WS: ["h", "H"],
        XK: ["H", "hB", "h"],
        YE: ["h", "hB", "hb", "H"],
        YT: ["H", "hB"],
        ZA: ["H", "h", "hb", "hB"],
        ZM: ["h", "hb", "H", "hB"],
        ZW: ["H", "h"],
        "af-ZA": ["H", "h", "hB", "hb"],
        "ar-001": ["h", "hB", "hb", "H"],
        "ca-ES": ["H", "h", "hB"],
        "en-001": ["h", "hb", "H", "hB"],
        "es-BO": ["H", "h", "hB", "hb"],
        "es-BR": ["H", "h", "hB", "hb"],
        "es-EC": ["H", "h", "hB", "hb"],
        "es-ES": ["H", "h", "hB", "hb"],
        "es-GQ": ["H", "h", "hB", "hb"],
        "es-PE": ["H", "h", "hB", "hb"],
        "fr-CA": ["H", "h", "hB"],
        "gl-ES": ["H", "h", "hB"],
        "gu-IN": ["hB", "hb", "h", "H"],
        "hi-IN": ["hB", "h", "H"],
        "it-CH": ["H", "h", "hB"],
        "it-IT": ["H", "h", "hB"],
        "kn-IN": ["hB", "h", "H"],
        "ml-IN": ["hB", "h", "H"],
        "mr-IN": ["hB", "hb", "h", "H"],
        "pa-IN": ["hB", "hb", "h", "H"],
        "ta-IN": ["hB", "h", "hb", "H"],
        "te-IN": ["hB", "h", "H"],
        "zu-ZA": ["H", "hB", "hb", "h"],
      };
    function re(e) {
      var t = e.hourCycle;
      if (
        (void 0 === t &&
          e.hourCycles &&
          e.hourCycles.length &&
          (t = e.hourCycles[0]),
        t)
      )
        switch (t) {
          case "h24":
            return "k";
          case "h23":
            return "H";
          case "h12":
            return "h";
          case "h11":
            return "K";
          default:
            throw new Error("Invalid hourCycle");
        }
      var r,
        o = e.language;
      return (
        "root" !== o && (r = e.maximize().region),
        (te[r || ""] || te[o || ""] || te["".concat(o, "-001")] || te["001"])[0]
      );
    }
    var oe = new RegExp("^".concat(F.source, "*")),
      ne = new RegExp("".concat(F.source, "*$"));
    function ie(e, t) {
      return { start: e, end: t };
    }
    var ae = !!String.prototype.startsWith && "_a".startsWith("a", 1),
      se = !!String.fromCodePoint,
      le = !!Object.fromEntries,
      ce = !!String.prototype.codePointAt,
      he = !!String.prototype.trimStart,
      de = !!String.prototype.trimEnd,
      ue = !!Number.isSafeInteger
        ? Number.isSafeInteger
        : function (e) {
            return (
              "number" == typeof e &&
              isFinite(e) &&
              Math.floor(e) === e &&
              Math.abs(e) <= 9007199254740991
            );
          },
      pe = !0;
    try {
      pe =
        "a" ===
        (null ===
          (ee = we("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec(
            "a"
          )) || void 0 === ee
          ? void 0
          : ee[0]);
    } catch (e) {
      pe = !1;
    }
    var fe,
      me = ae
        ? function (e, t, r) {
            return e.startsWith(t, r);
          }
        : function (e, t, r) {
            return e.slice(r, r + t.length) === t;
          },
      ve = se
        ? String.fromCodePoint
        : function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            for (var r, o = "", n = e.length, i = 0; n > i; ) {
              if ((r = e[i++]) > 1114111)
                throw RangeError(r + " is not a valid code point");
              o +=
                r < 65536
                  ? String.fromCharCode(r)
                  : String.fromCharCode(
                      55296 + ((r -= 65536) >> 10),
                      (r % 1024) + 56320
                    );
            }
            return o;
          },
      be = le
        ? Object.fromEntries
        : function (e) {
            for (var t = {}, r = 0, o = e; r < o.length; r++) {
              var n = o[r],
                i = n[0],
                a = n[1];
              t[i] = a;
            }
            return t;
          },
      ye = ce
        ? function (e, t) {
            return e.codePointAt(t);
          }
        : function (e, t) {
            var r = e.length;
            if (!(t < 0 || t >= r)) {
              var o,
                n = e.charCodeAt(t);
              return n < 55296 ||
                n > 56319 ||
                t + 1 === r ||
                (o = e.charCodeAt(t + 1)) < 56320 ||
                o > 57343
                ? n
                : o - 56320 + ((n - 55296) << 10) + 65536;
            }
          },
      ge = he
        ? function (e) {
            return e.trimStart();
          }
        : function (e) {
            return e.replace(oe, "");
          },
      _e = de
        ? function (e) {
            return e.trimEnd();
          }
        : function (e) {
            return e.replace(ne, "");
          };
    function we(e, t) {
      return new RegExp(e, t);
    }
    if (pe) {
      var Ee = we("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
      fe = function (e, t) {
        var r;
        return (
          (Ee.lastIndex = t),
          null !== (r = Ee.exec(e)[1]) && void 0 !== r ? r : ""
        );
      };
    } else
      fe = function (e, t) {
        for (var r = []; ; ) {
          var o = ye(e, t);
          if (void 0 === o || Se(o) || xe(o)) break;
          r.push(o), (t += o >= 65536 ? 2 : 1);
        }
        return ve.apply(void 0, r);
      };
    var Ae = (function () {
      function e(e, t) {
        void 0 === t && (t = {}),
          (this.message = e),
          (this.position = { offset: 0, line: 1, column: 1 }),
          (this.ignoreTag = !!t.ignoreTag),
          (this.locale = t.locale),
          (this.requiresOtherClause = !!t.requiresOtherClause),
          (this.shouldParseSkeletons = !!t.shouldParseSkeletons);
      }
      return (
        (e.prototype.parse = function () {
          if (0 !== this.offset()) throw Error("parser can only be used once");
          return this.parseMessage(0, "", !1);
        }),
        (e.prototype.parseMessage = function (e, t, r) {
          for (var o = []; !this.isEOF(); ) {
            var n = this.char();
            if (123 === n) {
              if ((i = this.parseArgument(e, r)).err) return i;
              o.push(i.val);
            } else {
              if (125 === n && e > 0) break;
              if (35 !== n || ("plural" !== t && "selectordinal" !== t)) {
                if (60 === n && !this.ignoreTag && 47 === this.peek()) {
                  if (r) break;
                  return this.error(
                    x.UNMATCHED_CLOSING_TAG,
                    ie(this.clonePosition(), this.clonePosition())
                  );
                }
                if (60 === n && !this.ignoreTag && ke(this.peek() || 0)) {
                  if ((i = this.parseTag(e, t)).err) return i;
                  o.push(i.val);
                } else {
                  var i;
                  if ((i = this.parseLiteral(e, t)).err) return i;
                  o.push(i.val);
                }
              } else {
                var a = this.clonePosition();
                this.bump(),
                  o.push({
                    type: P.pound,
                    location: ie(a, this.clonePosition()),
                  });
              }
            }
          }
          return { val: o, err: null };
        }),
        (e.prototype.parseTag = function (e, t) {
          var r = this.clonePosition();
          this.bump();
          var o = this.parseTagName();
          if ((this.bumpSpace(), this.bumpIf("/>")))
            return {
              val: {
                type: P.literal,
                value: "<".concat(o, "/>"),
                location: ie(r, this.clonePosition()),
              },
              err: null,
            };
          if (this.bumpIf(">")) {
            var n = this.parseMessage(e + 1, t, !0);
            if (n.err) return n;
            var i = n.val,
              a = this.clonePosition();
            if (this.bumpIf("</")) {
              if (this.isEOF() || !ke(this.char()))
                return this.error(x.INVALID_TAG, ie(a, this.clonePosition()));
              var s = this.clonePosition();
              return o !== this.parseTagName()
                ? this.error(
                    x.UNMATCHED_CLOSING_TAG,
                    ie(s, this.clonePosition())
                  )
                : (this.bumpSpace(),
                  this.bumpIf(">")
                    ? {
                        val: {
                          type: P.tag,
                          value: o,
                          children: i,
                          location: ie(r, this.clonePosition()),
                        },
                        err: null,
                      }
                    : this.error(x.INVALID_TAG, ie(a, this.clonePosition())));
            }
            return this.error(x.UNCLOSED_TAG, ie(r, this.clonePosition()));
          }
          return this.error(x.INVALID_TAG, ie(r, this.clonePosition()));
        }),
        (e.prototype.parseTagName = function () {
          var e,
            t = this.offset();
          for (
            this.bump();
            !this.isEOF() &&
            (45 === (e = this.char()) ||
              46 === e ||
              (e >= 48 && e <= 57) ||
              95 === e ||
              (e >= 97 && e <= 122) ||
              (e >= 65 && e <= 90) ||
              183 == e ||
              (e >= 192 && e <= 214) ||
              (e >= 216 && e <= 246) ||
              (e >= 248 && e <= 893) ||
              (e >= 895 && e <= 8191) ||
              (e >= 8204 && e <= 8205) ||
              (e >= 8255 && e <= 8256) ||
              (e >= 8304 && e <= 8591) ||
              (e >= 11264 && e <= 12271) ||
              (e >= 12289 && e <= 55295) ||
              (e >= 63744 && e <= 64975) ||
              (e >= 65008 && e <= 65533) ||
              (e >= 65536 && e <= 983039));

          )
            this.bump();
          return this.message.slice(t, this.offset());
        }),
        (e.prototype.parseLiteral = function (e, t) {
          for (var r = this.clonePosition(), o = ""; ; ) {
            var n = this.tryParseQuote(t);
            if (n) o += n;
            else {
              var i = this.tryParseUnquoted(e, t);
              if (i) o += i;
              else {
                var a = this.tryParseLeftAngleBracket();
                if (!a) break;
                o += a;
              }
            }
          }
          var s = ie(r, this.clonePosition());
          return { val: { type: P.literal, value: o, location: s }, err: null };
        }),
        (e.prototype.tryParseLeftAngleBracket = function () {
          return this.isEOF() ||
            60 !== this.char() ||
            (!this.ignoreTag && (ke((e = this.peek() || 0)) || 47 === e))
            ? null
            : (this.bump(), "<");
          var e;
        }),
        (e.prototype.tryParseQuote = function (e) {
          if (this.isEOF() || 39 !== this.char()) return null;
          switch (this.peek()) {
            case 39:
              return this.bump(), this.bump(), "'";
            case 123:
            case 60:
            case 62:
            case 125:
              break;
            case 35:
              if ("plural" === e || "selectordinal" === e) break;
              return null;
            default:
              return null;
          }
          this.bump();
          var t = [this.char()];
          for (this.bump(); !this.isEOF(); ) {
            var r = this.char();
            if (39 === r) {
              if (39 !== this.peek()) {
                this.bump();
                break;
              }
              t.push(39), this.bump();
            } else t.push(r);
            this.bump();
          }
          return ve.apply(void 0, t);
        }),
        (e.prototype.tryParseUnquoted = function (e, t) {
          if (this.isEOF()) return null;
          var r = this.char();
          return 60 === r ||
            123 === r ||
            (35 === r && ("plural" === t || "selectordinal" === t)) ||
            (125 === r && e > 0)
            ? null
            : (this.bump(), ve(r));
        }),
        (e.prototype.parseArgument = function (e, t) {
          var r = this.clonePosition();
          if ((this.bump(), this.bumpSpace(), this.isEOF()))
            return this.error(
              x.EXPECT_ARGUMENT_CLOSING_BRACE,
              ie(r, this.clonePosition())
            );
          if (125 === this.char())
            return (
              this.bump(),
              this.error(x.EMPTY_ARGUMENT, ie(r, this.clonePosition()))
            );
          var o = this.parseIdentifierIfPossible().value;
          if (!o)
            return this.error(
              x.MALFORMED_ARGUMENT,
              ie(r, this.clonePosition())
            );
          if ((this.bumpSpace(), this.isEOF()))
            return this.error(
              x.EXPECT_ARGUMENT_CLOSING_BRACE,
              ie(r, this.clonePosition())
            );
          switch (this.char()) {
            case 125:
              return (
                this.bump(),
                {
                  val: {
                    type: P.argument,
                    value: o,
                    location: ie(r, this.clonePosition()),
                  },
                  err: null,
                }
              );
            case 44:
              return (
                this.bump(),
                this.bumpSpace(),
                this.isEOF()
                  ? this.error(
                      x.EXPECT_ARGUMENT_CLOSING_BRACE,
                      ie(r, this.clonePosition())
                    )
                  : this.parseArgumentOptions(e, t, o, r)
              );
            default:
              return this.error(
                x.MALFORMED_ARGUMENT,
                ie(r, this.clonePosition())
              );
          }
        }),
        (e.prototype.parseIdentifierIfPossible = function () {
          var e = this.clonePosition(),
            t = this.offset(),
            r = fe(this.message, t),
            o = t + r.length;
          return (
            this.bumpTo(o), { value: r, location: ie(e, this.clonePosition()) }
          );
        }),
        (e.prototype.parseArgumentOptions = function (e, t, r, o) {
          var n,
            i = this.clonePosition(),
            a = this.parseIdentifierIfPossible().value,
            s = this.clonePosition();
          switch (a) {
            case "":
              return this.error(x.EXPECT_ARGUMENT_TYPE, ie(i, s));
            case "number":
            case "date":
            case "time":
              this.bumpSpace();
              var l = null;
              if (this.bumpIf(",")) {
                this.bumpSpace();
                var c = this.clonePosition();
                if ((b = this.parseSimpleArgStyleIfPossible()).err) return b;
                if (0 === (p = _e(b.val)).length)
                  return this.error(
                    x.EXPECT_ARGUMENT_STYLE,
                    ie(this.clonePosition(), this.clonePosition())
                  );
                l = { style: p, styleLocation: ie(c, this.clonePosition()) };
              }
              if ((y = this.tryParseArgumentClose(o)).err) return y;
              var h = ie(o, this.clonePosition());
              if (l && me(null == l ? void 0 : l.style, "::", 0)) {
                var d = ge(l.style.slice(2));
                if ("number" === a)
                  return (b = this.parseNumberSkeletonFromString(
                    d,
                    l.styleLocation
                  )).err
                    ? b
                    : {
                        val: {
                          type: P.number,
                          value: r,
                          location: h,
                          style: b.val,
                        },
                        err: null,
                      };
                if (0 === d.length)
                  return this.error(x.EXPECT_DATE_TIME_SKELETON, h);
                var u = d;
                this.locale &&
                  (u = (function (e, t) {
                    for (var r = "", o = 0; o < e.length; o++) {
                      var n = e.charAt(o);
                      if ("j" === n) {
                        for (
                          var i = 0;
                          o + 1 < e.length && e.charAt(o + 1) === n;

                        )
                          i++, o++;
                        var a = 1 + (1 & i),
                          s = i < 2 ? 1 : 3 + (i >> 1),
                          l = re(t);
                        for (("H" != l && "k" != l) || (s = 0); s-- > 0; )
                          r += "a";
                        for (; a-- > 0; ) r = l + r;
                      } else r += "J" === n ? "H" : n;
                    }
                    return r;
                  })(d, this.locale));
                var p = {
                  type: T.dateTime,
                  pattern: u,
                  location: l.styleLocation,
                  parsedOptions: this.shouldParseSkeletons ? j(u) : {},
                };
                return {
                  val: {
                    type: "date" === a ? P.date : P.time,
                    value: r,
                    location: h,
                    style: p,
                  },
                  err: null,
                };
              }
              return {
                val: {
                  type:
                    "number" === a ? P.number : "date" === a ? P.date : P.time,
                  value: r,
                  location: h,
                  style:
                    null !== (n = null == l ? void 0 : l.style) && void 0 !== n
                      ? n
                      : null,
                },
                err: null,
              };
            case "plural":
            case "selectordinal":
            case "select":
              var f = this.clonePosition();
              if ((this.bumpSpace(), !this.bumpIf(",")))
                return this.error(
                  x.EXPECT_SELECT_ARGUMENT_OPTIONS,
                  ie(f, (0, H.__assign)({}, f))
                );
              this.bumpSpace();
              var m = this.parseIdentifierIfPossible(),
                v = 0;
              if ("select" !== a && "offset" === m.value) {
                if (!this.bumpIf(":"))
                  return this.error(
                    x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                    ie(this.clonePosition(), this.clonePosition())
                  );
                var b;
                if (
                  (this.bumpSpace(),
                  (b = this.tryParseDecimalInteger(
                    x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                    x.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE
                  )).err)
                )
                  return b;
                this.bumpSpace(),
                  (m = this.parseIdentifierIfPossible()),
                  (v = b.val);
              }
              var y,
                g = this.tryParsePluralOrSelectOptions(e, a, t, m);
              if (g.err) return g;
              if ((y = this.tryParseArgumentClose(o)).err) return y;
              var _ = ie(o, this.clonePosition());
              return "select" === a
                ? {
                    val: {
                      type: P.select,
                      value: r,
                      options: be(g.val),
                      location: _,
                    },
                    err: null,
                  }
                : {
                    val: {
                      type: P.plural,
                      value: r,
                      options: be(g.val),
                      offset: v,
                      pluralType: "plural" === a ? "cardinal" : "ordinal",
                      location: _,
                    },
                    err: null,
                  };
            default:
              return this.error(x.INVALID_ARGUMENT_TYPE, ie(i, s));
          }
        }),
        (e.prototype.tryParseArgumentClose = function (e) {
          return this.isEOF() || 125 !== this.char()
            ? this.error(
                x.EXPECT_ARGUMENT_CLOSING_BRACE,
                ie(e, this.clonePosition())
              )
            : (this.bump(), { val: !0, err: null });
        }),
        (e.prototype.parseSimpleArgStyleIfPossible = function () {
          for (var e = 0, t = this.clonePosition(); !this.isEOF(); ) {
            switch (this.char()) {
              case 39:
                this.bump();
                var r = this.clonePosition();
                if (!this.bumpUntil("'"))
                  return this.error(
                    x.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,
                    ie(r, this.clonePosition())
                  );
                this.bump();
                break;
              case 123:
                (e += 1), this.bump();
                break;
              case 125:
                if (!(e > 0))
                  return {
                    val: this.message.slice(t.offset, this.offset()),
                    err: null,
                  };
                e -= 1;
                break;
              default:
                this.bump();
            }
          }
          return {
            val: this.message.slice(t.offset, this.offset()),
            err: null,
          };
        }),
        (e.prototype.parseNumberSkeletonFromString = function (e, t) {
          var r = [];
          try {
            r = (function (e) {
              if (0 === e.length)
                throw new Error("Number skeleton cannot be empty");
              for (
                var t = [],
                  r = 0,
                  o = e.split(z).filter(function (e) {
                    return e.length > 0;
                  });
                r < o.length;
                r++
              ) {
                var n = o[r].split("/");
                if (0 === n.length) throw new Error("Invalid number skeleton");
                for (
                  var i = n[0], a = n.slice(1), s = 0, l = a;
                  s < l.length;
                  s++
                )
                  if (0 === l[s].length)
                    throw new Error("Invalid number skeleton");
                t.push({ stem: i, options: a });
              }
              return t;
            })(e);
          } catch (e) {
            return this.error(x.INVALID_NUMBER_SKELETON, t);
          }
          return {
            val: {
              type: T.number,
              tokens: r,
              location: t,
              parsedOptions: this.shouldParseSkeletons ? Q(r) : {},
            },
            err: null,
          };
        }),
        (e.prototype.tryParsePluralOrSelectOptions = function (e, t, r, o) {
          for (
            var n, i = !1, a = [], s = new Set(), l = o.value, c = o.location;
            ;

          ) {
            if (0 === l.length) {
              var h = this.clonePosition();
              if ("select" === t || !this.bumpIf("=")) break;
              var d = this.tryParseDecimalInteger(
                x.EXPECT_PLURAL_ARGUMENT_SELECTOR,
                x.INVALID_PLURAL_ARGUMENT_SELECTOR
              );
              if (d.err) return d;
              (c = ie(h, this.clonePosition())),
                (l = this.message.slice(h.offset, this.offset()));
            }
            if (s.has(l))
              return this.error(
                "select" === t
                  ? x.DUPLICATE_SELECT_ARGUMENT_SELECTOR
                  : x.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,
                c
              );
            "other" === l && (i = !0), this.bumpSpace();
            var u = this.clonePosition();
            if (!this.bumpIf("{"))
              return this.error(
                "select" === t
                  ? x.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
                  : x.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,
                ie(this.clonePosition(), this.clonePosition())
              );
            var p = this.parseMessage(e + 1, t, r);
            if (p.err) return p;
            var f = this.tryParseArgumentClose(u);
            if (f.err) return f;
            a.push([
              l,
              { value: p.val, location: ie(u, this.clonePosition()) },
            ]),
              s.add(l),
              this.bumpSpace(),
              (l = (n = this.parseIdentifierIfPossible()).value),
              (c = n.location);
          }
          return 0 === a.length
            ? this.error(
                "select" === t
                  ? x.EXPECT_SELECT_ARGUMENT_SELECTOR
                  : x.EXPECT_PLURAL_ARGUMENT_SELECTOR,
                ie(this.clonePosition(), this.clonePosition())
              )
            : this.requiresOtherClause && !i
            ? this.error(
                x.MISSING_OTHER_CLAUSE,
                ie(this.clonePosition(), this.clonePosition())
              )
            : { val: a, err: null };
        }),
        (e.prototype.tryParseDecimalInteger = function (e, t) {
          var r = 1,
            o = this.clonePosition();
          this.bumpIf("+") || (this.bumpIf("-") && (r = -1));
          for (var n = !1, i = 0; !this.isEOF(); ) {
            var a = this.char();
            if (!(a >= 48 && a <= 57)) break;
            (n = !0), (i = 10 * i + (a - 48)), this.bump();
          }
          var s = ie(o, this.clonePosition());
          return n
            ? ue((i *= r))
              ? { val: i, err: null }
              : this.error(t, s)
            : this.error(e, s);
        }),
        (e.prototype.offset = function () {
          return this.position.offset;
        }),
        (e.prototype.isEOF = function () {
          return this.offset() === this.message.length;
        }),
        (e.prototype.clonePosition = function () {
          return {
            offset: this.position.offset,
            line: this.position.line,
            column: this.position.column,
          };
        }),
        (e.prototype.char = function () {
          var e = this.position.offset;
          if (e >= this.message.length) throw Error("out of bound");
          var t = ye(this.message, e);
          if (void 0 === t)
            throw Error(
              "Offset ".concat(e, " is at invalid UTF-16 code unit boundary")
            );
          return t;
        }),
        (e.prototype.error = function (e, t) {
          return {
            val: null,
            err: { kind: e, message: this.message, location: t },
          };
        }),
        (e.prototype.bump = function () {
          if (!this.isEOF()) {
            var e = this.char();
            10 === e
              ? ((this.position.line += 1),
                (this.position.column = 1),
                (this.position.offset += 1))
              : ((this.position.column += 1),
                (this.position.offset += e < 65536 ? 1 : 2));
          }
        }),
        (e.prototype.bumpIf = function (e) {
          if (me(this.message, e, this.offset())) {
            for (var t = 0; t < e.length; t++) this.bump();
            return !0;
          }
          return !1;
        }),
        (e.prototype.bumpUntil = function (e) {
          var t = this.offset(),
            r = this.message.indexOf(e, t);
          return r >= 0
            ? (this.bumpTo(r), !0)
            : (this.bumpTo(this.message.length), !1);
        }),
        (e.prototype.bumpTo = function (e) {
          if (this.offset() > e)
            throw Error(
              "targetOffset "
                .concat(
                  e,
                  " must be greater than or equal to the current offset "
                )
                .concat(this.offset())
            );
          for (e = Math.min(e, this.message.length); ; ) {
            var t = this.offset();
            if (t === e) break;
            if (t > e)
              throw Error(
                "targetOffset ".concat(
                  e,
                  " is at invalid UTF-16 code unit boundary"
                )
              );
            if ((this.bump(), this.isEOF())) break;
          }
        }),
        (e.prototype.bumpSpace = function () {
          for (; !this.isEOF() && Se(this.char()); ) this.bump();
        }),
        (e.prototype.peek = function () {
          if (this.isEOF()) return null;
          var e = this.char(),
            t = this.offset(),
            r = this.message.charCodeAt(t + (e >= 65536 ? 2 : 1));
          return null != r ? r : null;
        }),
        e
      );
    })();
    function ke(e) {
      return (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
    }
    function Se(e) {
      return (
        (e >= 9 && e <= 13) ||
        32 === e ||
        133 === e ||
        (e >= 8206 && e <= 8207) ||
        8232 === e ||
        8233 === e
      );
    }
    function xe(e) {
      return (
        (e >= 33 && e <= 35) ||
        36 === e ||
        (e >= 37 && e <= 39) ||
        40 === e ||
        41 === e ||
        42 === e ||
        43 === e ||
        44 === e ||
        45 === e ||
        (e >= 46 && e <= 47) ||
        (e >= 58 && e <= 59) ||
        (e >= 60 && e <= 62) ||
        (e >= 63 && e <= 64) ||
        91 === e ||
        92 === e ||
        93 === e ||
        94 === e ||
        96 === e ||
        123 === e ||
        124 === e ||
        125 === e ||
        126 === e ||
        161 === e ||
        (e >= 162 && e <= 165) ||
        166 === e ||
        167 === e ||
        169 === e ||
        171 === e ||
        172 === e ||
        174 === e ||
        176 === e ||
        177 === e ||
        182 === e ||
        187 === e ||
        191 === e ||
        215 === e ||
        247 === e ||
        (e >= 8208 && e <= 8213) ||
        (e >= 8214 && e <= 8215) ||
        8216 === e ||
        8217 === e ||
        8218 === e ||
        (e >= 8219 && e <= 8220) ||
        8221 === e ||
        8222 === e ||
        8223 === e ||
        (e >= 8224 && e <= 8231) ||
        (e >= 8240 && e <= 8248) ||
        8249 === e ||
        8250 === e ||
        (e >= 8251 && e <= 8254) ||
        (e >= 8257 && e <= 8259) ||
        8260 === e ||
        8261 === e ||
        8262 === e ||
        (e >= 8263 && e <= 8273) ||
        8274 === e ||
        8275 === e ||
        (e >= 8277 && e <= 8286) ||
        (e >= 8592 && e <= 8596) ||
        (e >= 8597 && e <= 8601) ||
        (e >= 8602 && e <= 8603) ||
        (e >= 8604 && e <= 8607) ||
        8608 === e ||
        (e >= 8609 && e <= 8610) ||
        8611 === e ||
        (e >= 8612 && e <= 8613) ||
        8614 === e ||
        (e >= 8615 && e <= 8621) ||
        8622 === e ||
        (e >= 8623 && e <= 8653) ||
        (e >= 8654 && e <= 8655) ||
        (e >= 8656 && e <= 8657) ||
        8658 === e ||
        8659 === e ||
        8660 === e ||
        (e >= 8661 && e <= 8691) ||
        (e >= 8692 && e <= 8959) ||
        (e >= 8960 && e <= 8967) ||
        8968 === e ||
        8969 === e ||
        8970 === e ||
        8971 === e ||
        (e >= 8972 && e <= 8991) ||
        (e >= 8992 && e <= 8993) ||
        (e >= 8994 && e <= 9e3) ||
        9001 === e ||
        9002 === e ||
        (e >= 9003 && e <= 9083) ||
        9084 === e ||
        (e >= 9085 && e <= 9114) ||
        (e >= 9115 && e <= 9139) ||
        (e >= 9140 && e <= 9179) ||
        (e >= 9180 && e <= 9185) ||
        (e >= 9186 && e <= 9254) ||
        (e >= 9255 && e <= 9279) ||
        (e >= 9280 && e <= 9290) ||
        (e >= 9291 && e <= 9311) ||
        (e >= 9472 && e <= 9654) ||
        9655 === e ||
        (e >= 9656 && e <= 9664) ||
        9665 === e ||
        (e >= 9666 && e <= 9719) ||
        (e >= 9720 && e <= 9727) ||
        (e >= 9728 && e <= 9838) ||
        9839 === e ||
        (e >= 9840 && e <= 10087) ||
        10088 === e ||
        10089 === e ||
        10090 === e ||
        10091 === e ||
        10092 === e ||
        10093 === e ||
        10094 === e ||
        10095 === e ||
        10096 === e ||
        10097 === e ||
        10098 === e ||
        10099 === e ||
        10100 === e ||
        10101 === e ||
        (e >= 10132 && e <= 10175) ||
        (e >= 10176 && e <= 10180) ||
        10181 === e ||
        10182 === e ||
        (e >= 10183 && e <= 10213) ||
        10214 === e ||
        10215 === e ||
        10216 === e ||
        10217 === e ||
        10218 === e ||
        10219 === e ||
        10220 === e ||
        10221 === e ||
        10222 === e ||
        10223 === e ||
        (e >= 10224 && e <= 10239) ||
        (e >= 10240 && e <= 10495) ||
        (e >= 10496 && e <= 10626) ||
        10627 === e ||
        10628 === e ||
        10629 === e ||
        10630 === e ||
        10631 === e ||
        10632 === e ||
        10633 === e ||
        10634 === e ||
        10635 === e ||
        10636 === e ||
        10637 === e ||
        10638 === e ||
        10639 === e ||
        10640 === e ||
        10641 === e ||
        10642 === e ||
        10643 === e ||
        10644 === e ||
        10645 === e ||
        10646 === e ||
        10647 === e ||
        10648 === e ||
        (e >= 10649 && e <= 10711) ||
        10712 === e ||
        10713 === e ||
        10714 === e ||
        10715 === e ||
        (e >= 10716 && e <= 10747) ||
        10748 === e ||
        10749 === e ||
        (e >= 10750 && e <= 11007) ||
        (e >= 11008 && e <= 11055) ||
        (e >= 11056 && e <= 11076) ||
        (e >= 11077 && e <= 11078) ||
        (e >= 11079 && e <= 11084) ||
        (e >= 11085 && e <= 11123) ||
        (e >= 11124 && e <= 11125) ||
        (e >= 11126 && e <= 11157) ||
        11158 === e ||
        (e >= 11159 && e <= 11263) ||
        (e >= 11776 && e <= 11777) ||
        11778 === e ||
        11779 === e ||
        11780 === e ||
        11781 === e ||
        (e >= 11782 && e <= 11784) ||
        11785 === e ||
        11786 === e ||
        11787 === e ||
        11788 === e ||
        11789 === e ||
        (e >= 11790 && e <= 11798) ||
        11799 === e ||
        (e >= 11800 && e <= 11801) ||
        11802 === e ||
        11803 === e ||
        11804 === e ||
        11805 === e ||
        (e >= 11806 && e <= 11807) ||
        11808 === e ||
        11809 === e ||
        11810 === e ||
        11811 === e ||
        11812 === e ||
        11813 === e ||
        11814 === e ||
        11815 === e ||
        11816 === e ||
        11817 === e ||
        (e >= 11818 && e <= 11822) ||
        11823 === e ||
        (e >= 11824 && e <= 11833) ||
        (e >= 11834 && e <= 11835) ||
        (e >= 11836 && e <= 11839) ||
        11840 === e ||
        11841 === e ||
        11842 === e ||
        (e >= 11843 && e <= 11855) ||
        (e >= 11856 && e <= 11857) ||
        11858 === e ||
        (e >= 11859 && e <= 11903) ||
        (e >= 12289 && e <= 12291) ||
        12296 === e ||
        12297 === e ||
        12298 === e ||
        12299 === e ||
        12300 === e ||
        12301 === e ||
        12302 === e ||
        12303 === e ||
        12304 === e ||
        12305 === e ||
        (e >= 12306 && e <= 12307) ||
        12308 === e ||
        12309 === e ||
        12310 === e ||
        12311 === e ||
        12312 === e ||
        12313 === e ||
        12314 === e ||
        12315 === e ||
        12316 === e ||
        12317 === e ||
        (e >= 12318 && e <= 12319) ||
        12320 === e ||
        12336 === e ||
        64830 === e ||
        64831 === e ||
        (e >= 65093 && e <= 65094)
      );
    }
    function Pe(e) {
      e.forEach(function (e) {
        if ((delete e.location, L(e) || I(e)))
          for (var t in e.options)
            delete e.options[t].location, Pe(e.options[t].value);
        else
          (B(e) && U(e.style)) || ((R(e) || N(e)) && D(e.style))
            ? delete e.style.location
            : M(e) && Pe(e.children);
      });
    }
    function Te(e, t) {
      void 0 === t && (t = {}),
        (t = (0, H.__assign)(
          { shouldParseSkeletons: !0, requiresOtherClause: !0 },
          t
        ));
      var r = new Ae(e, t).parse();
      if (r.err) {
        var o = SyntaxError(x[r.err.kind]);
        throw (
          ((o.location = r.err.location),
          (o.originalMessage = r.err.message),
          o)
        );
      }
      return (null == t ? void 0 : t.captureLocation) || Pe(r.val), r.val;
    }
    function He(e, t) {
      var r = t && t.cache ? t.cache : Oe,
        o = t && t.serializer ? t.serializer : Ne;
      return (t && t.strategy ? t.strategy : Re)(e, {
        cache: r,
        serializer: o,
      });
    }
    function $e(e, t, r, o) {
      var n,
        i =
          null == (n = o) || "number" == typeof n || "boolean" == typeof n
            ? o
            : r(o),
        a = t.get(i);
      return void 0 === a && ((a = e.call(this, o)), t.set(i, a)), a;
    }
    function Ce(e, t, r) {
      var o = Array.prototype.slice.call(arguments, 3),
        n = r(o),
        i = t.get(n);
      return void 0 === i && ((i = e.apply(this, o)), t.set(n, i)), i;
    }
    function Be(e, t, r, o, n) {
      return r.bind(t, e, o, n);
    }
    function Re(e, t) {
      return Be(
        e,
        this,
        1 === e.length ? $e : Ce,
        t.cache.create(),
        t.serializer
      );
    }
    var Ne = function () {
      return JSON.stringify(arguments);
    };
    function Le() {
      this.cache = Object.create(null);
    }
    (Le.prototype.get = function (e) {
      return this.cache[e];
    }),
      (Le.prototype.set = function (e, t) {
        this.cache[e] = t;
      });
    var Ie,
      Oe = {
        create: function () {
          return new Le();
        },
      },
      Me = {
        variadic: function (e, t) {
          return Be(e, this, Ce, t.cache.create(), t.serializer);
        },
        monadic: function (e, t) {
          return Be(e, this, $e, t.cache.create(), t.serializer);
        },
      };
    !(function (e) {
      (e.MISSING_VALUE = "MISSING_VALUE"),
        (e.INVALID_VALUE = "INVALID_VALUE"),
        (e.MISSING_INTL_API = "MISSING_INTL_API");
    })(Ie || (Ie = {}));
    var Ue,
      De = (function (e) {
        function t(t, r, o) {
          var n = e.call(this, t) || this;
          return (n.code = r), (n.originalMessage = o), n;
        }
        return (
          (0, H.__extends)(t, e),
          (t.prototype.toString = function () {
            return "[formatjs Error: "
              .concat(this.code, "] ")
              .concat(this.message);
          }),
          t
        );
      })(Error),
      Fe = (function (e) {
        function t(t, r, o, n) {
          return (
            e.call(
              this,
              'Invalid values for "'
                .concat(t, '": "')
                .concat(r, '". Options are "')
                .concat(Object.keys(o).join('", "'), '"'),
              Ie.INVALID_VALUE,
              n
            ) || this
          );
        }
        return (0, H.__extends)(t, e), t;
      })(De),
      Ge = (function (e) {
        function t(t, r, o) {
          return (
            e.call(
              this,
              'Value for "'.concat(t, '" must be of type ').concat(r),
              Ie.INVALID_VALUE,
              o
            ) || this
          );
        }
        return (0, H.__extends)(t, e), t;
      })(De),
      je = (function (e) {
        function t(t, r) {
          return (
            e.call(
              this,
              'The intl string context variable "'
                .concat(t, '" was not provided to the string "')
                .concat(r, '"'),
              Ie.MISSING_VALUE,
              r
            ) || this
          );
        }
        return (0, H.__extends)(t, e), t;
      })(De);
    function ze(e) {
      return "function" == typeof e;
    }
    function Ve(e, t, r, o, n, i, a) {
      if (1 === e.length && $(e[0]))
        return [{ type: Ue.literal, value: e[0].value }];
      for (var s = [], l = 0, c = e; l < c.length; l++) {
        var h = c[l];
        if ($(h)) s.push({ type: Ue.literal, value: h.value });
        else if (O(h))
          "number" == typeof i &&
            s.push({ type: Ue.literal, value: r.getNumberFormat(t).format(i) });
        else {
          var d = h.value;
          if (!n || !(d in n)) throw new je(d, a);
          var u = n[d];
          if (C(h))
            (u && "string" != typeof u && "number" != typeof u) ||
              (u =
                "string" == typeof u || "number" == typeof u ? String(u) : ""),
              s.push({
                type: "string" == typeof u ? Ue.literal : Ue.object,
                value: u,
              });
          else if (R(h)) {
            var p =
              "string" == typeof h.style
                ? o.date[h.style]
                : D(h.style)
                ? h.style.parsedOptions
                : void 0;
            s.push({
              type: Ue.literal,
              value: r.getDateTimeFormat(t, p).format(u),
            });
          } else if (N(h)) {
            p =
              "string" == typeof h.style
                ? o.time[h.style]
                : D(h.style)
                ? h.style.parsedOptions
                : o.time.medium;
            s.push({
              type: Ue.literal,
              value: r.getDateTimeFormat(t, p).format(u),
            });
          } else if (B(h)) {
            (p =
              "string" == typeof h.style
                ? o.number[h.style]
                : U(h.style)
                ? h.style.parsedOptions
                : void 0) &&
              p.scale &&
              (u *= p.scale || 1),
              s.push({
                type: Ue.literal,
                value: r.getNumberFormat(t, p).format(u),
              });
          } else {
            if (M(h)) {
              var f = h.children,
                m = h.value,
                v = n[m];
              if (!ze(v)) throw new Ge(m, "function", a);
              var b = v(
                Ve(f, t, r, o, n, i).map(function (e) {
                  return e.value;
                })
              );
              Array.isArray(b) || (b = [b]),
                s.push.apply(
                  s,
                  b.map(function (e) {
                    return {
                      type: "string" == typeof e ? Ue.literal : Ue.object,
                      value: e,
                    };
                  })
                );
            }
            if (L(h)) {
              if (!(y = h.options[u] || h.options.other))
                throw new Fe(h.value, u, Object.keys(h.options), a);
              s.push.apply(s, Ve(y.value, t, r, o, n));
            } else if (I(h)) {
              var y;
              if (!(y = h.options["=".concat(u)])) {
                if (!Intl.PluralRules)
                  throw new De(
                    'Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',
                    Ie.MISSING_INTL_API,
                    a
                  );
                var g = r
                  .getPluralRules(t, { type: h.pluralType })
                  .select(u - (h.offset || 0));
                y = h.options[g] || h.options.other;
              }
              if (!y) throw new Fe(h.value, u, Object.keys(h.options), a);
              s.push.apply(s, Ve(y.value, t, r, o, n, u - (h.offset || 0)));
            } else;
          }
        }
      }
      return (function (e) {
        return e.length < 2
          ? e
          : e.reduce(function (e, t) {
              var r = e[e.length - 1];
              return (
                r && r.type === Ue.literal && t.type === Ue.literal
                  ? (r.value += t.value)
                  : e.push(t),
                e
              );
            }, []);
      })(s);
    }
    function Ye(e, t) {
      return t
        ? Object.keys(e).reduce(
            function (r, o) {
              var n, i;
              return (
                (r[o] =
                  ((n = e[o]),
                  (i = t[o])
                    ? (0, H.__assign)(
                        (0, H.__assign)((0, H.__assign)({}, n || {}), i || {}),
                        Object.keys(n).reduce(function (e, t) {
                          return (
                            (e[t] = (0, H.__assign)(
                              (0, H.__assign)({}, n[t]),
                              i[t] || {}
                            )),
                            e
                          );
                        }, {})
                      )
                    : n)),
                r
              );
            },
            (0, H.__assign)({}, e)
          )
        : e;
    }
    function Ke(e) {
      return {
        create: function () {
          return {
            get: function (t) {
              return e[t];
            },
            set: function (t, r) {
              e[t] = r;
            },
          };
        },
      };
    }
    !(function (e) {
      (e[(e.literal = 0)] = "literal"), (e[(e.object = 1)] = "object");
    })(Ue || (Ue = {}));
    var Ze = (function () {
      function e(t, r, o, n) {
        var i,
          a = this;
        if (
          (void 0 === r && (r = e.defaultLocale),
          (this.formatterCache = { number: {}, dateTime: {}, pluralRules: {} }),
          (this.format = function (e) {
            var t = a.formatToParts(e);
            if (1 === t.length) return t[0].value;
            var r = t.reduce(function (e, t) {
              return (
                e.length &&
                t.type === Ue.literal &&
                "string" == typeof e[e.length - 1]
                  ? (e[e.length - 1] += t.value)
                  : e.push(t.value),
                e
              );
            }, []);
            return r.length <= 1 ? r[0] || "" : r;
          }),
          (this.formatToParts = function (e) {
            return Ve(
              a.ast,
              a.locales,
              a.formatters,
              a.formats,
              e,
              void 0,
              a.message
            );
          }),
          (this.resolvedOptions = function () {
            var e;
            return {
              locale:
                (null === (e = a.resolvedLocale) || void 0 === e
                  ? void 0
                  : e.toString()) ||
                Intl.NumberFormat.supportedLocalesOf(a.locales)[0],
            };
          }),
          (this.getAst = function () {
            return a.ast;
          }),
          (this.locales = r),
          (this.resolvedLocale = e.resolveLocale(r)),
          "string" == typeof t)
        ) {
          if (((this.message = t), !e.__parse))
            throw new TypeError(
              "IntlMessageFormat.__parse must be set to process `message` of type `string`"
            );
          var s = n || {},
            l = (s.formatters, (0, H.__rest)(s, ["formatters"]));
          this.ast = e.__parse(
            t,
            (0, H.__assign)((0, H.__assign)({}, l), {
              locale: this.resolvedLocale,
            })
          );
        } else this.ast = t;
        if (!Array.isArray(this.ast))
          throw new TypeError("A message must be provided as a String or AST.");
        (this.formats = Ye(e.formats, o)),
          (this.formatters =
            (n && n.formatters) ||
            (void 0 === (i = this.formatterCache) &&
              (i = { number: {}, dateTime: {}, pluralRules: {} }),
            {
              getNumberFormat: He(
                function () {
                  for (var e, t = [], r = 0; r < arguments.length; r++)
                    t[r] = arguments[r];
                  return new ((e = Intl.NumberFormat).bind.apply(
                    e,
                    (0, H.__spreadArray)([void 0], t, !1)
                  ))();
                },
                { cache: Ke(i.number), strategy: Me.variadic }
              ),
              getDateTimeFormat: He(
                function () {
                  for (var e, t = [], r = 0; r < arguments.length; r++)
                    t[r] = arguments[r];
                  return new ((e = Intl.DateTimeFormat).bind.apply(
                    e,
                    (0, H.__spreadArray)([void 0], t, !1)
                  ))();
                },
                { cache: Ke(i.dateTime), strategy: Me.variadic }
              ),
              getPluralRules: He(
                function () {
                  for (var e, t = [], r = 0; r < arguments.length; r++)
                    t[r] = arguments[r];
                  return new ((e = Intl.PluralRules).bind.apply(
                    e,
                    (0, H.__spreadArray)([void 0], t, !1)
                  ))();
                },
                { cache: Ke(i.pluralRules), strategy: Me.variadic }
              ),
            }));
      }
      return (
        Object.defineProperty(e, "defaultLocale", {
          get: function () {
            return (
              e.memoizedDefaultLocale ||
                (e.memoizedDefaultLocale =
                  new Intl.NumberFormat().resolvedOptions().locale),
              e.memoizedDefaultLocale
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (e.memoizedDefaultLocale = null),
        (e.resolveLocale = function (e) {
          if (void 0 !== Intl.Locale) {
            var t = Intl.NumberFormat.supportedLocalesOf(e);
            return t.length > 0
              ? new Intl.Locale(t[0])
              : new Intl.Locale("string" == typeof e ? e : e[0]);
          }
        }),
        (e.__parse = Te),
        (e.formats = {
          number: {
            integer: { maximumFractionDigits: 0 },
            currency: { style: "currency" },
            percent: { style: "percent" },
          },
          date: {
            short: { month: "numeric", day: "numeric", year: "2-digit" },
            medium: { month: "short", day: "numeric", year: "numeric" },
            long: { month: "long", day: "numeric", year: "numeric" },
            full: {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          },
          time: {
            short: { hour: "numeric", minute: "numeric" },
            medium: { hour: "numeric", minute: "numeric", second: "numeric" },
            long: {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short",
            },
            full: {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short",
            },
          },
        }),
        e
      );
    })();
    const We = Ze;
    var Xe = l(53285);
    const qe = async (e, t, r, o) => (
      await Promise.all([l.e(1866), l.e(3216)])
        .then(l.bind(l, 23216))
        .then(() => (0, Xe.n)(t)),
      (e._localizationCache = {}),
      (n, ...i) => {
        if (!(n && r && t && r[t])) return "";
        const a = r[t][n];
        if (!a) return "";
        const s = n + a;
        let l = e._localizationCache[s];
        if (!l) {
          try {
            l = new We(a, t, o);
          } catch (e) {
            return "Translation error: " + e.message;
          }
          e._localizationCache[s] = l;
        }
        let c = {};
        if (1 === i.length && "object" == typeof i[0]) c = i[0];
        else for (let e = 0; e < i.length; e += 2) c[i[e]] = i[e + 1];
        try {
          return l.format(c);
        } catch (e) {
          return "Translation " + e;
        }
      }
    );
    var Je = l(11674),
      Qe = l(46797),
      et = l(84643);
    let tt = (0, s.Z)(
      null,
      function (e, t) {
        class r extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: r,
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hacs",
              value: () => ({ localize: () => "" }),
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_language",
              value: () => "en",
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, c.Z)((0, h.Z)(r.prototype), "connectedCallback", this).call(
                  this
                ),
                  this.hasUpdated && this._initHacs();
              },
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                if ((this.hasUpdated || this._initHacs(), e.has("hass"))) {
                  const t = e.get("hass");
                  (null == t ? void 0 : t.language) !== this.hass.language &&
                    (this._language = this.hass.language);
                }
                (!e.has("_language") && this.hasUpdated) ||
                  this._initializeLocalize();
              },
            },
            {
              kind: "method",
              key: "_initHacs",
              value: async function () {
                (0, Qe.CE)(
                  this.hass,
                  () => this._updateProperties("configuration"),
                  et.p.CONFIG
                ),
                  (0, Qe.CE)(
                    this.hass,
                    () => this._updateProperties("status"),
                    et.p.STATUS
                  ),
                  (0, Qe.CE)(
                    this.hass,
                    () => this._updateProperties("status"),
                    et.p.STAGE
                  ),
                  (0, Qe.CE)(
                    this.hass,
                    () => this._updateProperties("repositories"),
                    et.p.REPOSITORY
                  ),
                  this.hass.connection.subscribeEvents(
                    async () => this._updateProperties("lovelace"),
                    "lovelace_updated"
                  ),
                  this._updateHacs({ log: new S.J() }),
                  this._updateProperties(),
                  this.addEventListener("update-hacs", (e) =>
                    this._updateHacs(e.detail)
                  );
              },
            },
            {
              kind: "method",
              key: "_initializeLocalize",
              value: async function () {
                const { language: e, data: t } = await (0, Je.i0)(
                  null,
                  this._language
                );
                this._updateHacs({
                  localize: await qe(this.constructor.prototype, e, { [e]: t }),
                });
              },
            },
            {
              kind: "method",
              key: "_updateProperties",
              value: async function (e = "all") {
                const t = {},
                  r = {};
                "all" === e
                  ? ([r.repositories, r.info] = await Promise.all([
                      (0, Qe.ER)(this.hass),
                      (0, Qe.W)(this.hass),
                    ]))
                  : "info" === e
                  ? (r.info = await (0, Qe.W)(this.hass))
                  : "repositories" === e &&
                    (r.repositories = await (0, Qe.ER)(this.hass)),
                  Object.keys(r).forEach((e) => {
                    void 0 !== r[e] && (t[e] = r[e]);
                  }),
                  t && (this._updateHacs(t), this.requestUpdate());
              },
            },
            {
              kind: "method",
              key: "_updateHacs",
              value: function (e) {
                this.hacs = { ...this.hacs, ...e };
              },
            },
          ],
        };
      },
      ((rt = t.oi),
      class extends rt {
        constructor(...e) {
          super(...e), (this.hass = void 0), (this.__provideHass = []);
        }
        provideHass(e) {
          this.__provideHass.push(e), (e.hass = this.hass);
        }
        updated(e) {
          super.updated(e),
            e.has("hass") &&
              this.__provideHass.forEach((e) => {
                e.hass = this.hass;
              });
        }
      })
    );
    var rt;
    const ot = (e, t) => {
      const r = matchMedia(e),
        o = (e) => t(e.matches);
      return r.addListener(o), t(r.matches), () => r.removeListener(o);
    };
    var nt = l(14516);
    let it = (0, s.Z)(
      null,
      function (e, t) {
        class r extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: r,
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "route",
              value: void 0,
            },
            { kind: "field", key: "routerOptions", value: void 0 },
            { kind: "field", key: "_currentPage", value: () => "" },
            { kind: "field", key: "_currentLoadProm", value: void 0 },
            { kind: "field", key: "_cache", value: () => ({}) },
            { kind: "field", key: "_initialLoadDone", value: () => !1 },
            {
              kind: "field",
              key: "_computeTail",
              value: () =>
                (0, nt.Z)((e) => {
                  const t = e.path.indexOf("/", 1);
                  return -1 === t
                    ? { prefix: e.prefix + e.path, path: "" }
                    : {
                        prefix: e.prefix + e.path.substr(0, t),
                        path: e.path.substr(t),
                      };
                }),
            },
            {
              kind: "method",
              key: "createRenderRoot",
              value: function () {
                return this;
              },
            },
            {
              kind: "method",
              key: "update",
              value: function (e) {
                (0, c.Z)((0, h.Z)(r.prototype), "update", this).call(this, e);
                const t = this.routerOptions || { routes: {} };
                if (t && t.initialLoad && !this._initialLoadDone) return;
                if (!e.has("route"))
                  return void (
                    this.lastChild &&
                    !this._currentLoadProm &&
                    this.updatePageEl(this.lastChild, e)
                  );
                const o = this.route,
                  n = t.defaultPage;
                o &&
                  "" === o.path &&
                  void 0 !== n &&
                  (0, A.c)(`${o.prefix}/${n}`, { replace: !0 });
                let i = o
                    ? ((e, t) => {
                        if ("" === e) return t;
                        const r = e.indexOf("/", 1);
                        return -1 === r ? e.substr(1) : e.substr(1, r - 1);
                      })(o.path, n || "")
                    : "not_found",
                  a = t.routes[i];
                for (; "string" == typeof a; ) (i = a), (a = t.routes[i]);
                if (t.beforeRender) {
                  const e = t.beforeRender(i);
                  if (void 0 !== e) {
                    for (i = e, a = t.routes[i]; "string" == typeof a; )
                      (i = a), (a = t.routes[i]);
                    o &&
                      (0, A.c)(`${o.prefix}/${e}${location.search}`, {
                        replace: !0,
                      });
                  }
                }
                if (this._currentPage === i)
                  return void (
                    this.lastChild && this.updatePageEl(this.lastChild, e)
                  );
                if (!a)
                  return (
                    (this._currentPage = ""),
                    void (this.lastChild && this.removeChild(this.lastChild))
                  );
                this._currentPage = i;
                const s = a.load ? a.load() : Promise.resolve();
                let l;
                if (
                  (s.catch((e) => {
                    console.error("Error loading page", i, e),
                      this._currentPage === i &&
                        (this.lastChild && this.removeChild(this.lastChild),
                        l && clearTimeout(l),
                        this.appendChild(
                          this.createErrorScreen(
                            `Error while loading page ${i}.`
                          )
                        ));
                  }),
                  !t.showLoading)
                )
                  return void this._createPanel(t, i, a);
                let d = !1;
                (l = window.setTimeout(() => {
                  d ||
                    this._currentPage !== i ||
                    (this.lastChild && this.removeChild(this.lastChild),
                    this.appendChild(this.createLoadingScreen()));
                }, 400)),
                  (this._currentLoadProm = s.then(
                    () => {
                      (this._currentLoadProm = void 0),
                        this._currentPage === i &&
                          ((d = !0), this._createPanel(t, i, a));
                    },
                    () => {
                      this._currentLoadProm = void 0;
                    }
                  ));
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, c.Z)((0, h.Z)(r.prototype), "firstUpdated", this).call(
                  this,
                  e
                );
                const t = this.routerOptions;
                t &&
                  (t.preloadAll &&
                    Object.values(t.routes).forEach(
                      (e) => "object" == typeof e && e.load && e.load()
                    ),
                  t.initialLoad &&
                    (setTimeout(() => {
                      this._initialLoadDone ||
                        this.appendChild(this.createLoadingScreen());
                    }, 400),
                    t.initialLoad().then(() => {
                      (this._initialLoadDone = !0), this.requestUpdate("route");
                    })));
              },
            },
            {
              kind: "method",
              key: "createLoadingScreen",
              value: function () {
                return (
                  Promise.all([l.e(6023), l.e(210), l.e(4776)]).then(
                    l.bind(l, 84776)
                  ),
                  document.createElement("hass-loading-screen")
                );
              },
            },
            {
              kind: "method",
              key: "createErrorScreen",
              value: function (e) {
                Promise.all([l.e(210), l.e(1908), l.e(4271)]).then(
                  l.bind(l, 11908)
                );
                const t = document.createElement("hass-error-screen");
                return (t.error = e), t;
              },
            },
            {
              kind: "method",
              key: "rebuild",
              value: async function () {
                const e = this.route;
                void 0 !== e &&
                  ((this.route = void 0),
                  await this.updateComplete,
                  void 0 === this.route && (this.route = e));
              },
            },
            {
              kind: "get",
              key: "pageRendered",
              value: function () {
                return this.updateComplete.then(() => this._currentLoadProm);
              },
            },
            {
              kind: "method",
              key: "createElement",
              value: function (e) {
                return document.createElement(e);
              },
            },
            { kind: "method", key: "updatePageEl", value: function (e, t) {} },
            {
              kind: "get",
              key: "routeTail",
              value: function () {
                return this._computeTail(this.route);
              },
            },
            {
              kind: "method",
              key: "_createPanel",
              value: function (e, t, r) {
                this.lastChild && this.removeChild(this.lastChild);
                const o = this._cache[t] || this.createElement(r.tag);
                this.updatePageEl(o),
                  this.appendChild(o),
                  (e.cacheAll || r.cache) && (this._cache[t] = o);
              },
            },
          ],
        };
      },
      t.fl
    );
    (0, s.Z)(
      [(0, d.Mo)("hacs-router")],
      function (e, t) {
        class r extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: r,
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hacs",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "route",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ type: Boolean })],
              key: "narrow",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_wideSidebar",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, d.SB)()],
              key: "_wide",
              value: () => !1,
            },
            { kind: "field", key: "_listeners", value: () => [] },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, c.Z)((0, h.Z)(r.prototype), "connectedCallback", this).call(
                  this
                ),
                  this._listeners.push(
                    ot("(min-width: 1040px)", (e) => {
                      this._wide = e;
                    })
                  ),
                  this._listeners.push(
                    ot("(min-width: 1296px)", (e) => {
                      this._wideSidebar = e;
                    })
                  ),
                  this.style.setProperty(
                    "--app-header-background-color",
                    "var(--sidebar-background-color)"
                  ),
                  this.style.setProperty(
                    "--app-header-text-color",
                    "var(--sidebar-text-color)"
                  ),
                  this.style.setProperty(
                    "--app-header-border-bottom",
                    "1px solid var(--divider-color)"
                  ),
                  this.style.setProperty(
                    "--ha-card-border-radius",
                    "var(--ha-config-card-border-radius, 12px)"
                  );
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                for (
                  (0, c.Z)(
                    (0, h.Z)(r.prototype),
                    "disconnectedCallback",
                    this
                  ).call(this);
                  this._listeners.length;

                )
                  this._listeners.pop()();
              },
            },
            {
              kind: "method",
              key: "updatePageEl",
              value: function (e) {
                const t =
                  "docked" === this.hass.dockedSidebar
                    ? this._wideSidebar
                    : this._wide;
                (e.hass = this.hass),
                  (e.hacs = this.hacs),
                  (e.route = this.route),
                  (e.narrow = this.narrow),
                  (e.isWide = t);
              },
            },
            {
              kind: "field",
              key: "routerOptions",
              value: () => ({
                defaultPage: "dashboard",
                showLoading: !0,
                beforeRender: (e) =>
                  ["_my_redirect", "repository"].includes(e)
                    ? void 0
                    : "dashboard",
                routes: {
                  _my_redirect: {
                    tag: "hacs-my-redirect",
                    load: () =>
                      Promise.all([l.e(210), l.e(1908), l.e(4052)]).then(
                        l.bind(l, 44837)
                      ),
                  },
                  dashboard: {
                    tag: "hacs-dashboard",
                    load: () =>
                      Promise.all([
                        l.e(1706),
                        l.e(2850),
                        l.e(1866),
                        l.e(1985),
                        l.e(210),
                        l.e(2706),
                        l.e(4448),
                        l.e(9663),
                        l.e(2519),
                        l.e(7371),
                      ]).then(l.bind(l, 54779)),
                  },
                  repository: {
                    tag: "hacs-repository-dashboard",
                    load: () =>
                      Promise.all([
                        l.e(6023),
                        l.e(2488),
                        l.e(210),
                        l.e(2706),
                        l.e(98),
                        l.e(1908),
                        l.e(2519),
                        l.e(9015),
                      ]).then(l.bind(l, 49015)),
                  },
                },
              }),
            },
          ],
        };
      },
      it
    );
    var at = l(61422);
    const st = t.iv`:host{--hcv-color-error:var(--hacs-error-color, var(--error-color));--hcv-color-warning:var(--hacs-warning-color, var(--warning-color));--hcv-color-update:var(--hacs-update-color, var(--info-color));--hcv-color-new:var(--hacs-new-color, var(--success-color));--hcv-color-icon:var(--hacs-default-icon-color, var(--primary-text-color));--hcv-text-color-primary:var(--primary-text-color);--hcv-text-color-on-background:var(--text-primary-color);--hcv-text-color-secondary:var(--secondary-text-color);--hcv-text-color-link:var(--link-text-color, var(--accent-color));--mdc-dialog-heading-ink-color:var(--hcv-text-color-primary);--mdc-dialog-content-ink-color:var(--hcv-text-color-primary)}`;
    (0, s.Z)(
      [(0, d.Mo)("hacs-frontend")],
      function (e, r) {
        class o extends r {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "hacs",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "narrow",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, d.Cb)({ attribute: !1 })],
              key: "route",
              value: void 0,
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: function (e) {
                (0, c.Z)((0, h.Z)(o.prototype), "firstUpdated", this).call(
                  this,
                  e
                ),
                  this._applyTheme(),
                  this.addEventListener("hacs-location-changed", (e) =>
                    this._setRoute(e)
                  ),
                  "" === this.route.path &&
                    (0, A.c)("/hacs/entry", { replace: !0 }),
                  window.addEventListener("haptic", (e) => {
                    (0, _.B)(window.parent, e.type, e.detail, { bubbles: !1 });
                  }),
                  document.body.addEventListener("click", (e) => {
                    const t = (0, E.J)(e);
                    t && (0, A.c)(t);
                  }),
                  w.E.addEventListener("location-changed", (e) =>
                    (0, _.B)(this, e.type, e.detail, { bubbles: !1 })
                  ),
                  document.body.addEventListener("keydown", (e) => {
                    e.ctrlKey ||
                      e.shiftKey ||
                      e.metaKey ||
                      e.altKey ||
                      (["c", "e"].includes(e.key) &&
                        (0, _.B)(w.E, "hass-quick-bar-trigger", e, {
                          bubbles: !1,
                        }));
                  }),
                  w.E.matchMedia(
                    "(prefers-color-scheme: dark)"
                  ).addEventListener("change", (e) => this._applyTheme()),
                  (0, k.lD)(this, this.shadowRoot);
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, c.Z)((0, h.Z)(o.prototype), "updated", this).call(this, e);
                const t = e.get("hass");
                t && t.themes !== this.hass.themes && this._applyTheme();
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e, r;
                return this.hass &&
                  null !== (e = this.hacs) &&
                  void 0 !== e &&
                  null !== (e = e.info) &&
                  void 0 !== e &&
                  null !== (e = e.categories) &&
                  void 0 !== e &&
                  e.length &&
                  void 0 !==
                    (null === (r = this.hacs) || void 0 === r
                      ? void 0
                      : r.localize)
                  ? t.dy` <hacs-router .hass="${this.hass}" .hacs="${this.hacs}" .route="${this.route}" .narrow="${this.narrow}"></hacs-router> `
                  : t.Ld;
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [at.w, st, t.iv`hass-loading-screen{height:100vh}`];
              },
            },
            {
              kind: "method",
              key: "_setRoute",
              value: function (e) {
                var t;
                null !== (t = e.detail) &&
                  void 0 !== t &&
                  t.route &&
                  ((this.route = e.detail.route),
                  (0, A.c)(this.route.path, { replace: !0 }),
                  this.requestUpdate());
              },
            },
            {
              kind: "method",
              key: "_applyTheme",
              value: function () {
                var e;
                y(
                  this.parentElement,
                  this.hass.themes,
                  (null === (e = this.hass.selectedTheme) || void 0 === e
                    ? void 0
                    : e.theme) ||
                    (this.hass.themes.darkMode &&
                    this.hass.themes.default_dark_theme
                      ? this.hass.themes.default_dark_theme
                      : this.hass.themes.default_theme),
                  {
                    ...this.hass.selectedTheme,
                    dark: this.hass.themes.darkMode,
                  }
                ),
                  (this.parentElement.style.backgroundColor =
                    "var(--primary-background-color)"),
                  (this.parentElement.style.color =
                    "var(--primary-text-color)");
              },
            },
          ],
        };
      },
      tt
    );
    (0, e.xj)(!1);
    const lt = document.createElement("style");
    (lt.innerHTML =
      "\nbody {\n  font-family: Roboto, sans-serif;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 400;\n  margin: 0;\n  padding: 0;\n  height: 100vh;\n}\n@media (prefers-color-scheme: dark) {\n  body {\n    background-color: #111111;\n    color: #e1e1e1;\n  }\n}\n"),
      document.head.appendChild(lt);
  })();
//# sourceMappingURL=entrypoint.4szXpxNxoP4.js.map
