const e = "ha-main-window",
  o = window.name === e ? window : parent.name === e ? parent : top,
  n = (e, o) =>
    ((e, o, n, a) => {
      (a = a || {}), (n = null == n ? {} : n);
      const s = new Event(o, {
        bubbles: void 0 === a.bubbles || a.bubbles,
        cancelable: Boolean(a.cancelable),
        composed: void 0 === a.composed || a.composed,
      });
      return (s.detail = n), e.dispatchEvent(s), s;
    })(e, "hass-notification", o);
((e) => {
  const a =
      null == o || null === (e = o.document) || void 0 === e
        ? void 0
        : e.querySelector("home-assistant"),
    s = null == a ? void 0 : a.hass;
  a.___hacs_reload_handler_active ||
    (s
      ? ((a.___hacs_reload_handler_active = !0),
        s.connection.subscribeEvents(() => {
          n(a, {
            duration: 3e5,
            dismissable: !1,
            message: "[HACS] You need to reload your browser",
            action: {
              action: () => {
                o.location.href = o.location.href;
              },
              text: "reload",
            },
          });
        }, "hacs_resources_updated"))
      : console.error("[HACS/extra/reload_handler] hass not found"));
})();
//# sourceMappingURL=extra.1KC8NSjONmE.js.map
