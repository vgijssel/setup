export const id = 9015;
export const ids = [9015];
export const modules = {
  85763: (e, t, o) => {
    o.d(t, { Q2: () => a, ou: () => i });
    var r = o(67684);
    const a = () => {
        const e = {},
          t = new URLSearchParams(r.E.location.search);
        for (const [o, r] of t.entries()) e[o] = r;
        return e;
      },
      i = (e) => {
        const t = new URLSearchParams();
        return (
          Object.entries(e).forEach(([e, o]) => {
            t.append(e, o);
          }),
          t.toString()
        );
      };
  },
  50057: (e, t, o) => {
    var r = o(309),
      a = (o(34131), o(18846)),
      i = o(95260);
    (0, r.Z)(
      [(0, i.Mo)("ha-chip-set")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [],
        };
      },
      a.l
    );
  },
  68336: (e, t, o) => {
    var r = o(309),
      a = o(5095),
      i = o(95260);
    (0, r.Z)(
      [(0, i.Mo)("ha-card")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, i.Cb)()],
              key: "header",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, i.Cb)({ type: Boolean, reflect: !0 })],
              key: "raised",
              value: () => !1,
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return a.iv`:host{background:var(--ha-card-background,var(--card-background-color,#fff));box-shadow:var(--ha-card-box-shadow,none);box-sizing:border-box;border-radius:var(--ha-card-border-radius,12px);border-width:var(--ha-card-border-width,1px);border-style:solid;border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0));color:var(--primary-text-color);display:block;transition:all .3s ease-out;position:relative}:host([raised]){border:none;box-shadow:var(--ha-card-box-shadow,0px 2px 1px -1px rgba(0,0,0,.2),0px 1px 1px 0px rgba(0,0,0,.14),0px 1px 3px 0px rgba(0,0,0,.12))}.card-header,:host ::slotted(.card-header){color:var(--ha-card-header-color,--primary-text-color);font-family:var(--ha-card-header-font-family, inherit);font-size:var(--ha-card-header-font-size, 24px);letter-spacing:-.012em;line-height:48px;padding:12px 16px 16px;display:block;margin-block-start:0px;margin-block-end:0px;font-weight:400}:host ::slotted(.card-content:not(:first-child)),slot:not(:first-child)::slotted(.card-content){padding-top:0px;margin-top:-8px}:host ::slotted(.card-content){padding:16px}:host ::slotted(.card-actions){border-top:1px solid var(--divider-color,#e8e8e8);padding:5px 16px}`;
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return a.dy` ${
                  this.header
                    ? a.dy`<h1 class="card-header">${this.header}</h1>`
                    : a.Ld
                } <slot></slot> `;
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  7006: (e, t, o) => {
    var r = o(309),
      a = o(34541),
      i = o(47838),
      s = (o(34131), o(22129)),
      n = o(5095),
      l = o(95260);
    (0, r.Z)(
      [(0, l.Mo)("ha-circular-progress")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [
                (0, l.Cb)({ attribute: "aria-label", type: String }),
              ],
              key: "ariaLabel",
              value: () => "Loading",
            },
            {
              kind: "field",
              decorators: [(0, l.Cb)()],
              key: "size",
              value: () => "medium",
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                if (
                  ((0, a.Z)((0, i.Z)(o.prototype), "updated", this).call(
                    this,
                    e
                  ),
                  e.has("size"))
                )
                  switch (this.size) {
                    case "tiny":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "16px"
                      );
                      break;
                    case "small":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "28px"
                      );
                      break;
                    case "medium":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "48px"
                      );
                      break;
                    case "large":
                      this.style.setProperty(
                        "--md-circular-progress-size",
                        "68px"
                      );
                  }
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  ...(0, a.Z)((0, i.Z)(o), "styles", this),
                  n.iv`:host{--md-sys-color-primary:var(--primary-color);--md-circular-progress-size:48px}`,
                ];
              },
            },
          ],
        };
      },
      s.B
    );
  },
  84776: (e, t, o) => {
    o.r(t);
    var r = o(309),
      a = o(5095),
      i = o(95260),
      s = (o(7006), o(33358), o(73957), o(29950));
    (0, r.Z)(
      [(0, i.Mo)("hass-loading-screen")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, i.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, i.Cb)({ type: Boolean, attribute: "no-toolbar" }),
              ],
              key: "noToolbar",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, i.Cb)({ type: Boolean })],
              key: "rootnav",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, i.Cb)({ type: Boolean })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, i.Cb)()],
              key: "message",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return a.dy` ${
                  this.noToolbar
                    ? ""
                    : a.dy`<div class="toolbar"> ${
                        this.rootnav ||
                        (null !== (e = history.state) && void 0 !== e && e.root)
                          ? a.dy` <ha-menu-button .hass="${this.hass}" .narrow="${this.narrow}"></ha-menu-button> `
                          : a.dy` <ha-icon-button-arrow-prev .hass="${this.hass}" @click="${this._handleBack}"></ha-icon-button-arrow-prev> `
                      } </div>`
                } <div class="content"> <ha-circular-progress indeterminate></ha-circular-progress> ${
                  this.message
                    ? a.dy`<div id="loading-text">${this.message}</div>`
                    : a.Ld
                } </div> `;
              },
            },
            {
              kind: "method",
              key: "_handleBack",
              value: function () {
                history.back();
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  s.Qx,
                  a.iv`:host{display:block;height:100%;background-color:var(--primary-background-color)}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;pointer-events:none;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}ha-icon-button-arrow-prev,ha-menu-button{pointer-events:auto}.content{height:calc(100% - var(--header-height));display:flex;flex-direction:column;align-items:center;justify-content:center}#loading-text{max-width:350px;margin-top:16px}`,
                ];
              },
            },
          ],
        };
      },
      a.oi
    );
  },
  49015: (e, t, o) => {
    o.r(t), o.d(t, { HacsRepositoryDashboard: () => w });
    var r = o(309),
      a = o(34541),
      i = o(47838),
      s = o(5095),
      n = o(95260),
      l = o(14516),
      c = o(67684),
      d = o(85763),
      h = (o(68336), o(50057), o(34131), o(10996));
    (0, r.Z)(
      [(0, n.Mo)("ha-assist-chip")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean, reflect: !0 })],
              key: "filled",
              value: () => !1,
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value() {
                return [
                  ...(0, a.Z)((0, i.Z)(o), "styles", this),
                  s.iv`:host{--md-sys-color-primary:var(--primary-text-color);--md-sys-color-on-surface:var(--primary-text-color);--md-assist-chip-container-shape:16px;--md-assist-chip-outline-color:var(--outline-color);--md-assist-chip-label-text-weight:400;--ha-assist-chip-filled-container-color:rgba(
          var(--rgb-primary-text-color),
          0.15
        )}.filled{display:flex;pointer-events:none;border-radius:inherit;inset:0;position:absolute;background-color:var(--ha-assist-chip-filled-container-color)}::slotted([slot=icon]){display:flex;--mdc-icon-size:var(--md-input-chip-icon-size, 18px)}`,
                ];
              },
            },
            {
              kind: "method",
              key: "renderOutline",
              value: function () {
                return this.filled
                  ? s.dy`<span class="filled"></span>`
                  : (0, a.Z)((0, i.Z)(o.prototype), "renderOutline", this).call(
                      this
                    );
              },
            },
          ],
        };
      },
      h.X
    );
    o(99040), o(62082), o(21162);
    var p = o(11285),
      u = (o(11908), o(84776), o(47715));
    var y = o(51750),
      b = (o(33358), o(73957), o(29950));
    (0, r.Z)(
      [(0, n.Mo)("hass-subpage")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "header",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [
                (0, n.Cb)({ type: Boolean, attribute: "main-page" }),
              ],
              key: "mainPage",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: String, attribute: "back-path" })],
              key: "backPath",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)()],
              key: "backCallback",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean, reflect: !0 })],
              key: "narrow",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ type: Boolean })],
              key: "supervisor",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, u.i)(".content")],
              key: "_savedScrollPos",
              value: void 0,
            },
            {
              kind: "method",
              key: "willUpdate",
              value: function (e) {
                if (
                  ((0, a.Z)((0, i.Z)(o.prototype), "willUpdate", this).call(
                    this,
                    e
                  ),
                  !e.has("hass"))
                )
                  return;
                const t = e.get("hass");
                var r, s, n;
                (t && t.locale === this.hass.locale) ||
                  ((r = this),
                  (s = "rtl"),
                  void 0 !== (n = (0, y.HE)(this.hass)) && (n = !!n),
                  r.hasAttribute(s)
                    ? n || r.removeAttribute(s)
                    : !1 !== n && r.setAttribute(s, ""));
              },
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                var e;
                return s.dy` <div class="toolbar"> ${
                  this.mainPage ||
                  (null !== (e = history.state) && void 0 !== e && e.root)
                    ? s.dy` <ha-menu-button .hassio="${this.supervisor}" .hass="${this.hass}" .narrow="${this.narrow}"></ha-menu-button> `
                    : this.backPath
                    ? s.dy` <a href="${this.backPath}"> <ha-icon-button-arrow-prev .hass="${this.hass}"></ha-icon-button-arrow-prev> </a> `
                    : s.dy` <ha-icon-button-arrow-prev .hass="${this.hass}" @click="${this._backTapped}"></ha-icon-button-arrow-prev> `
                } <div class="main-title"><slot name="header">${
                  this.header
                }</slot></div> <slot name="toolbar-icon"></slot> </div> <div class="content ha-scrollbar" @scroll="${
                  this._saveScrollPos
                }"> <slot></slot> </div> <div id="fab"> <slot name="fab"></slot> </div> `;
              },
            },
            {
              kind: "method",
              decorators: [(0, n.hO)({ passive: !0 })],
              key: "_saveScrollPos",
              value: function (e) {
                this._savedScrollPos = e.target.scrollTop;
              },
            },
            {
              kind: "method",
              key: "_backTapped",
              value: function () {
                this.backCallback ? this.backCallback() : history.back();
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  b.$c,
                  s.iv`:host{display:block;height:100%;background-color:var(--primary-background-color);overflow:hidden;position:relative}:host([narrow]){width:100%;position:fixed}.toolbar{display:flex;align-items:center;font-size:20px;height:var(--header-height);padding:8px 12px;background-color:var(--app-header-background-color);font-weight:400;color:var(--app-header-text-color,#fff);border-bottom:var(--app-header-border-bottom,none);box-sizing:border-box}@media (max-width:599px){.toolbar{padding:4px}}.toolbar a{color:var(--sidebar-text-color);text-decoration:none}::slotted([slot=toolbar-icon]),ha-icon-button-arrow-prev,ha-menu-button{pointer-events:auto;color:var(--sidebar-icon-color)}.main-title{margin:0 0 0 24px;line-height:20px;flex-grow:1}.content{position:relative;width:100%;height:calc(100% - 1px - var(--header-height));overflow-y:auto;overflow:auto;-webkit-overflow-scrolling:touch}#fab{position:absolute;right:calc(16px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:1}:host([narrow]) #fab.tabs{bottom:calc(84px + env(safe-area-inset-bottom))}#fab[is-wide]{bottom:24px;right:24px}:host([rtl]) #fab{right:auto;left:calc(16px + env(safe-area-inset-left))}:host([rtl][is-wide]) #fab{bottom:24px;left:24px;right:auto}`,
                ];
              },
            },
          ],
        };
      },
      s.oi
    );
    var v = o(33367),
      f = o(90012),
      g = o(8179),
      m = o(46797),
      k = o(61422);
    const x = (e) =>
      e.toLowerCase().includes(".md") || e.toLowerCase().includes(".markdown");
    let w = (0, r.Z)(
      [(0, n.Mo)("hacs-repository-dashboard")],
      function (e, t) {
        class o extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: o,
          d: [
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hacs",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "narrow",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "isWide",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.Cb)({ attribute: !1 })],
              key: "route",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_repository",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, n.SB)()],
              key: "_error",
              value: void 0,
            },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, a.Z)((0, i.Z)(o.prototype), "connectedCallback", this).call(
                  this
                ),
                  document.body.addEventListener(
                    "keydown",
                    this._generateMyLink
                  );
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, a.Z)(
                  (0, i.Z)(o.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  document.body.removeEventListener(
                    "keydown",
                    this._generateMyLink
                  );
              },
            },
            {
              kind: "field",
              key: "_generateMyLink",
              value() {
                return (e) => {
                  if (
                    !(e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) &&
                    "m" === e.key &&
                    c.E.location.pathname.startsWith("/hacs/repository/")
                  ) {
                    if (!this._repository) return;
                    const e = new URLSearchParams({
                      redirect: "hacs_repository",
                      owner: this._repository.full_name.split("/")[0],
                      repository: this._repository.full_name.split("/")[1],
                      category: this._repository.category,
                    });
                    window.open(
                      `https://my.home-assistant.io/create-link/?${e.toString()}`,
                      "_blank"
                    );
                  }
                };
              },
            },
            {
              kind: "method",
              key: "firstUpdated",
              value: async function (e) {
                (0, a.Z)((0, i.Z)(o.prototype), "firstUpdated", this).call(
                  this,
                  e
                );
                const t = (0, d.Q2)();
                if (Object.entries(t).length) {
                  let e;
                  const o = `${t.owner}/${t.repository}`;
                  if (
                    ((e = this.hacs.repositories.find(
                      (e) =>
                        e.full_name.toLocaleLowerCase() ===
                        o.toLocaleLowerCase()
                    )),
                    !e && t.category)
                  ) {
                    if (
                      !(await (0, p.g7)(this, {
                        title: this.hacs.localize("my.add_repository_title"),
                        text: this.hacs.localize(
                          "my.add_repository_description",
                          { repository: o }
                        ),
                        confirmText: this.hacs.localize("common.add"),
                        dismissText: this.hacs.localize("common.cancel"),
                      }))
                    )
                      return void (this._error = this.hacs.localize(
                        "my.repository_not_found",
                        { repository: o }
                      ));
                    try {
                      await (0, m.NA)(this.hass, o, t.category),
                        (this.hacs.repositories = await (0, m.ER)(this.hass)),
                        (e = this.hacs.repositories.find(
                          (e) =>
                            e.full_name.toLocaleLowerCase() ===
                            o.toLocaleLowerCase()
                        ));
                    } catch (e) {
                      return void (this._error = e);
                    }
                  }
                  e
                    ? this._fetchRepository(String(e.id))
                    : (this._error = this.hacs.localize(
                        "my.repository_not_found",
                        { repository: o }
                      ));
                } else {
                  const e = this.route.path.indexOf("/", 1),
                    t = this.route.path.substr(e + 1);
                  if (!t)
                    return void (this._error =
                      "Missing repositoryId from route");
                  this._fetchRepository(t);
                }
              },
            },
            {
              kind: "method",
              key: "updated",
              value: function (e) {
                (0, a.Z)((0, i.Z)(o.prototype), "updated", this).call(this, e),
                  e.has("repositories") &&
                    this._repository &&
                    this._fetchRepository();
              },
            },
            {
              kind: "method",
              key: "_fetchRepository",
              value: async function (e) {
                try {
                  this._repository = await (0, g.nj)(
                    this.hass,
                    e || String(this._repository.id)
                  );
                } catch (e) {
                  this._error = null == e ? void 0 : e.message;
                }
              },
            },
            {
              kind: "field",
              key: "_getAuthors",
              value: () =>
                (0, l.Z)((e) => {
                  const t = [];
                  if (!e.authors) return t;
                  if (
                    (e.authors.forEach((e) => t.push(e.replace("@", ""))),
                    0 === t.length)
                  ) {
                    const o = e.full_name.split("/")[0];
                    if (
                      [
                        "custom-cards",
                        "custom-components",
                        "home-assistant-community-themes",
                      ].includes(o)
                    )
                      return t;
                    t.push(o);
                  }
                  return t;
                }),
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                if (this._error)
                  return s.dy`<hass-error-screen .error="${this._error}"></hass-error-screen>`;
                if (!this._repository)
                  return s.dy`<hass-loading-screen></hass-loading-screen>`;
                const e = this._getAuthors(this._repository);
                return s.dy` <hass-subpage .hass="${this.hass}" .narrow="${
                  this.narrow
                }" .route="${this.route}" .header="${
                  this._repository.name
                }" hasFab> <ha-icon-overflow-menu .hass="${
                  this.hass
                }" slot="toolbar-icon" narrow .items="${(0, f.G)(
                  this,
                  this._repository
                )}"> </ha-icon-overflow-menu> <div class="content"> <ha-card> <ha-chip-set> ${
                  this._repository.installed
                    ? s.dy` <ha-assist-chip .label="${
                        this._repository.installed_version
                      }" title="${this.hacs.localize(
                        "dialog_info.version_installed"
                      )}"> <ha-svg-icon slot="icon" .path="${"M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"}"></ha-svg-icon> </ha-assist-chip> `
                    : ""
                } ${
                  e
                    ? e.map(
                        (e) =>
                          s.dy`<a href="https://github.com/${e}" target="_blank" rel="noreferrer noopener"> <ha-assist-chip .label="${e}" title="${this.hacs.localize(
                            "dialog_info.author"
                          )}"> <ha-svg-icon slot="icon" .path="${"M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"}"></ha-svg-icon> @${e} </ha-assist-chip> </a>`
                      )
                    : ""
                } ${
                  this._repository.downloads
                    ? s.dy` <ha-assist-chip title="${this.hacs.localize(
                        "dialog_info.downloads"
                      )}" .label="${String(
                        this._repository.downloads
                      )}"> <ha-svg-icon slot="icon" .path="${"M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z"}"></ha-svg-icon> </ha-assist-chip>`
                    : ""
                } <ha-assist-chip .label="${String(
                  this._repository.stars
                )}" title="${this.hacs.localize(
                  "dialog_info.stars"
                )}"> <ha-svg-icon slot="icon" .path="${"M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"}"></ha-svg-icon> ${
                  this._repository.stars
                } </ha-assist-chip> <a href="https://github.com/${
                  this._repository.full_name
                }/issues" target="_blank" rel="noreferrer noopener"> <ha-assist-chip .label="${String(
                  this._repository.issues
                )}" title="${this.hacs.localize(
                  "dialog_info.open_issues"
                )}"> <ha-svg-icon slot="icon" .path="${"M10 3H14V14H10V3M10 21V17H14V21H10Z"}"></ha-svg-icon> ${
                  this._repository.issues
                } </ha-assist-chip> </a> </ha-chip-set> <ha-markdown .content="${
                  ((e, t) => (
                    (e = e.replace(
                      /(https:\/\/github\.com\/.*.\/blob*.[^\s]+)/g,
                      function (e) {
                        return x(e)
                          ? e
                          : e
                              .replace(
                                "https://github.com/",
                                "https://raw.githubusercontent.com/"
                              )
                              .replace("/blob/", "/");
                      }
                    )),
                    t &&
                      (e = (e = (e = e.replace(
                        /(!)?\[*.*\]\((?!.*:\/\/).*\/*.*\.\w*\)/g,
                        function (e) {
                          return e
                            .replace("(/", "(")
                            .replace(
                              "(",
                              `(${
                                x(e)
                                  ? "https://github.com"
                                  : "https://raw.githubusercontent.com"
                              }/${t.full_name}${x(e) ? "/blob" : ""}/${
                                t.available_version || t.default_branch
                              }/`
                            );
                        }
                      )).replace(/\[*.*\]\(\#.*\)/g, function (e) {
                        return e.replace("(#", `(/hacs/repository/${t.id}#`);
                      })).replace(
                        /(?:\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/g,
                        (e) => {
                          const o = e.replace(/^#/, `${t.full_name}#`),
                            [r, a] = o.split("#");
                          return `[${e}](https://github.com/${r}/issues/${a})`;
                        }
                      )),
                    e.replace(
                      /[^(]https:\/\/github\.com\/\S*\/commit\/([0-9a-f]{40})/g,
                      (e, t) => `[\`${t.substr(0, 7)}\`](${e})`
                    )
                  ))(this._repository.additional_info, this._repository) ||
                  this.hacs.localize("dialog_info.no_info")
                }"></ha-markdown> </ha-card> </div> ${
                  this._repository.installed_version
                    ? ""
                    : s.dy`<ha-fab .label="${this.hacs.localize(
                        "common.download"
                      )}" .extended="${!this.narrow}" @click="${
                        this._downloadRepositoryDialog
                      }"> <ha-svg-icon slot="icon" .path="${"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"}"></ha-svg-icon> </ha-fab>`
                } </hass-subpage> `;
              },
            },
            {
              kind: "method",
              key: "_downloadRepositoryDialog",
              value: function () {
                (0, v.px)(this, {
                  hacs: this.hacs,
                  repositoryId: this._repository.id,
                  repository: this._repository,
                });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return [
                  k.w,
                  s.iv`hass-loading-screen{--app-header-background-color:var(--sidebar-background-color);--app-header-text-color:var(--sidebar-text-color);height:100vh}hass-subpage{position:absolute;width:100vw}ha-svg-icon{color:var(--hcv-text-color-on-background)}ha-fab{position:fixed;float:right;right:calc(18px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:1}ha-fab.rtl{float:left;right:auto;left:calc(18px + env(safe-area-inset-left))}ha-card{display:block;padding:16px}.content{margin:auto;padding:8px;max-width:1536px}ha-chip-set{padding-bottom:8px}@media all and (max-width:500px){.content{margin:8px 4px 64px;max-width:none}}`,
                ];
              },
            },
          ],
        };
      },
      s.oi
    );
  },
  8179: (e, t, o) => {
    o.d(t, { hZ: () => a, nj: () => r, zD: () => i });
    const r = async (e, t) =>
        e.connection.sendMessagePromise({
          type: "hacs/repository/info",
          repository_id: t,
        }),
      a = async (e, t, o) =>
        e.connection.sendMessagePromise({
          type: "hacs/repository/download",
          repository: t,
          version: o,
        }),
      i = async (e, t, o) =>
        e.connection.sendMessagePromise({
          type: "hacs/repository/version",
          repository: t,
          version: o,
        });
  },
};
//# sourceMappingURL=9015.9F46dbqUmvU.js.map
