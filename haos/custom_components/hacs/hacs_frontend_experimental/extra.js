!(function () {
  function e(e) {
    var n = document.createElement("script");
    (n.src = e), document.body.appendChild(n);
  }
  if (/.*Version\/(?:11|12)(?:\.\d+)*.*Safari\//.test(navigator.userAgent))
    e("/hacsfiles/frontend/frontend_es5/extra.Gq4ioglXLxE.js");
  else
    try {
      new Function(
        "import('/hacsfiles/frontend/frontend_latest/extra.1KC8NSjONmE.js')"
      )();
    } catch (n) {
      e("/hacsfiles/frontend/frontend_es5/extra.Gq4ioglXLxE.js");
    }
})();
