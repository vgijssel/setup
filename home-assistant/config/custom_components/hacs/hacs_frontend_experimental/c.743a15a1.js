var e =
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : {};
function o(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
function t(e, o) {
  return e((o = { exports: {} }), o.exports), o.exports;
}
function n(e) {
  return (e && e.default) || e;
}
export { e as a, t as c, n as g, o as u };
