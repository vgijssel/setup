function t(e) {
  if (!e || "object" != typeof e) return e;
  if ("[object Date]" == Object.prototype.toString.call(e))
    return new Date(e.getTime());
  if (Array.isArray(e)) return e.map(t);
  var r = {};
  return (
    Object.keys(e).forEach(function (n) {
      r[n] = t(e[n]);
    }),
    r
  );
}
export { t as d };
