let t;
!(function (t) {
  (t[(t.CRITICAL = 50)] = "CRITICAL"),
    (t[(t.FATAL = 50)] = "FATAL"),
    (t[(t.ERROR = 40)] = "ERROR"),
    (t[(t.WARNING = 30)] = "WARNING"),
    (t[(t.WARN = 30)] = "WARN"),
    (t[(t.INFO = 20)] = "INFO"),
    (t[(t.DEBUG = 10)] = "DEBUG"),
    (t[(t.NOTSET = 0)] = "NOTSET");
})(t || (t = {}));
const R = (t, R, n) =>
    t(`component.${R}.title`) || (null == n ? void 0 : n.name) || R,
  n = (t, R) => t.callWS({ type: "manifest/get", integration: R });
export { R as d, n as f };
