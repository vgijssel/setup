!(function () {
  function n(n) {
    var e = document.createElement("script");
    (e.src = n), document.body.appendChild(e);
  }
  if (/.*Version\/(?:11|12)(?:\.\d+)*.*Safari\//.test(navigator.userAgent))
    n("/hacsfiles/frontend/frontend_es5/entrypoint.yqQWLcDGcBc.js");
  else
    try {
      new Function(
        "import('/hacsfiles/frontend/frontend_latest/entrypoint.4szXpxNxoP4.js')"
      )();
    } catch (e) {
      n("/hacsfiles/frontend/frontend_es5/entrypoint.yqQWLcDGcBc.js");
    }
})();
