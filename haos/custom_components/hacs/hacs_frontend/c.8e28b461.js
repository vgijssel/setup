const r = (r) => (s, o) => {
  if (s.constructor._observers) {
    if (!s.constructor.hasOwnProperty("_observers")) {
      const r = s.constructor._observers;
      (s.constructor._observers = new Map()),
        r.forEach((r, o) => s.constructor._observers.set(o, r));
    }
  } else {
    s.constructor._observers = new Map();
    const r = s.updated;
    s.updated = function (s) {
      r.call(this, s),
        s.forEach((r, s) => {
          const o = this.constructor._observers.get(s);
          void 0 !== o && o.call(this, this[s], r);
        });
    };
  }
  s.constructor._observers.set(o, r);
};
export { r as o };
