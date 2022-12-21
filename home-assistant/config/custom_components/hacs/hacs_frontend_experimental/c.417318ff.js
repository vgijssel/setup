import { P as t, U as s } from "./main-ec7846c8.js";
import { t as e } from "./c.0e3055bd.js";
import { c as i } from "./c.227858d9.js";
class n {
  constructor(t) {
    this.Y = t;
  }
  disconnect() {
    this.Y = void 0;
  }
  reconnect(t) {
    this.Y = t;
  }
  deref() {
    return this.Y;
  }
}
class o {
  constructor() {
    (this.Z = void 0), (this.q = void 0);
  }
  get() {
    return this.Z;
  }
  pause() {
    var t;
    (null !== (t = this.Z) && void 0 !== t) ||
      (this.Z = new Promise((t) => (this.q = t)));
  }
  resume() {
    var t;
    null === (t = this.q) || void 0 === t || t.call(this),
      (this.Z = this.q = void 0);
  }
}
const r = (t) => !e(t) && "function" == typeof t.then;
const c = t(
  class extends i {
    constructor() {
      super(...arguments),
        (this._$Cwt = 1073741823),
        (this._$Cyt = []),
        (this._$CK = new n(this)),
        (this._$CX = new o());
    }
    render(...t) {
      var e;
      return null !== (e = t.find((t) => !r(t))) && void 0 !== e ? e : s;
    }
    update(t, e) {
      const i = this._$Cyt;
      let n = i.length;
      this._$Cyt = e;
      const o = this._$CK,
        c = this._$CX;
      this.isConnected || this.disconnected();
      for (let t = 0; t < e.length && !(t > this._$Cwt); t++) {
        const s = e[t];
        if (!r(s)) return (this._$Cwt = t), s;
        (t < n && s === i[t]) ||
          ((this._$Cwt = 1073741823),
          (n = 0),
          Promise.resolve(s).then(async (t) => {
            for (; c.get(); ) await c.get();
            const e = o.deref();
            if (void 0 !== e) {
              const i = e._$Cyt.indexOf(s);
              i > -1 && i < e._$Cwt && ((e._$Cwt = i), e.setValue(t));
            }
          }));
      }
      return s;
    }
    disconnected() {
      this._$CK.disconnect(), this._$CX.pause();
    }
    reconnected() {
      this._$CK.reconnect(this), this._$CX.resume();
    }
  }
);
export { c };
