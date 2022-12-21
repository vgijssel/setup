let t =
  "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o"
    .split(",")
    .map((t) => (t ? parseInt(t, 36) : 1));
for (let e = 1; e < t.length; e++) t[e] += t[e - 1];
function e(e) {
  for (let i = 1; i < t.length; i += 2) if (t[i] > e) return t[i - 1] <= e;
  return !1;
}
function i(t) {
  return t >= 127462 && t <= 127487;
}
function n(t, e, i = !0, n = !0) {
  return (i ? s : r)(t, e, n);
}
function s(t, n, s) {
  if (n == t.length) return n;
  n && o(t.charCodeAt(n)) && l(t.charCodeAt(n - 1)) && n--;
  let r = h(t, n);
  for (n += c(r); n < t.length; ) {
    let o = h(t, n);
    if (8205 == r || 8205 == o || (s && e(o))) (n += c(o)), (r = o);
    else {
      if (!i(o)) break;
      {
        let e = 0,
          s = n - 2;
        for (; s >= 0 && i(h(t, s)); ) e++, (s -= 2);
        if (e % 2 == 0) break;
        n += 2;
      }
    }
  }
  return n;
}
function r(t, e, i) {
  for (; e > 0; ) {
    let n = s(t, e - 2, i);
    if (n < e) return n;
    e--;
  }
  return 0;
}
function o(t) {
  return t >= 56320 && t < 57344;
}
function l(t) {
  return t >= 55296 && t < 56320;
}
function h(t, e) {
  let i = t.charCodeAt(e);
  if (!l(i) || e + 1 == t.length) return i;
  let n = t.charCodeAt(e + 1);
  return o(n) ? n - 56320 + ((i - 55296) << 10) + 65536 : i;
}
function a(t) {
  return t <= 65535
    ? String.fromCharCode(t)
    : ((t -= 65536),
      String.fromCharCode(55296 + (t >> 10), 56320 + (1023 & t)));
}
function c(t) {
  return t < 65536 ? 1 : 2;
}
function u(t, e, i = t.length) {
  let s = 0;
  for (let r = 0; r < i; )
    9 == t.charCodeAt(r) ? ((s += e - (s % e)), r++) : (s++, (r = n(t, r)));
  return s;
}
function f(t, e, i, s) {
  for (let s = 0, r = 0; ; ) {
    if (r >= e) return s;
    if (s == t.length) break;
    (r += 9 == t.charCodeAt(s) ? i - (r % i) : 1), (s = n(t, s));
  }
  return !0 === s ? -1 : t.length;
}
class d {
  constructor() {}
  lineAt(t) {
    if (t < 0 || t > this.length)
      throw new RangeError(
        `Invalid position ${t} in document of length ${this.length}`
      );
    return this.lineInner(t, !1, 1, 0);
  }
  line(t) {
    if (t < 1 || t > this.lines)
      throw new RangeError(
        `Invalid line number ${t} in ${this.lines}-line document`
      );
    return this.lineInner(t, !0, 1, 0);
  }
  replace(t, e, i) {
    let n = [];
    return (
      this.decompose(0, t, n, 2),
      i.length && i.decompose(0, i.length, n, 3),
      this.decompose(e, this.length, n, 1),
      m.from(n, this.length - (e - t) + i.length)
    );
  }
  append(t) {
    return this.replace(this.length, this.length, t);
  }
  slice(t, e = this.length) {
    let i = [];
    return this.decompose(t, e, i, 0), m.from(i, e - t);
  }
  eq(t) {
    if (t == this) return !0;
    if (t.length != this.length || t.lines != this.lines) return !1;
    let e = this.scanIdentical(t, 1),
      i = this.length - this.scanIdentical(t, -1),
      n = new w(this),
      s = new w(t);
    for (let t = e, r = e; ; ) {
      if (
        (n.next(t),
        s.next(t),
        (t = 0),
        n.lineBreak != s.lineBreak || n.done != s.done || n.value != s.value)
      )
        return !1;
      if (((r += n.value.length), n.done || r >= i)) return !0;
    }
  }
  iter(t = 1) {
    return new w(this, t);
  }
  iterRange(t, e = this.length) {
    return new y(this, t, e);
  }
  iterLines(t, e) {
    let i;
    if (null == t) i = this.iter();
    else {
      null == e && (e = this.lines + 1);
      let n = this.line(t).from;
      i = this.iterRange(
        n,
        Math.max(
          n,
          e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to
        )
      );
    }
    return new b(i);
  }
  toString() {
    return this.sliceString(0);
  }
  toJSON() {
    let t = [];
    return this.flatten(t), t;
  }
  static of(t) {
    if (0 == t.length)
      throw new RangeError("A document must have at least one line");
    return 1 != t.length || t[0]
      ? t.length <= 32
        ? new p(t)
        : m.from(p.split(t, []))
      : d.empty;
  }
}
class p extends d {
  constructor(
    t,
    e = (function (t) {
      let e = -1;
      for (let i of t) e += i.length + 1;
      return e;
    })(t)
  ) {
    super(), (this.text = t), (this.length = e);
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(t, e, i, n) {
    for (let s = 0; ; s++) {
      let r = this.text[s],
        o = n + r.length;
      if ((e ? i : o) >= t) return new x(n, o, i, r);
      (n = o + 1), i++;
    }
  }
  decompose(t, e, i, n) {
    let s =
      t <= 0 && e >= this.length
        ? this
        : new p(v(this.text, t, e), Math.min(e, this.length) - Math.max(0, t));
    if (1 & n) {
      let t = i.pop(),
        e = g(s.text, t.text.slice(), 0, s.length);
      if (e.length <= 32) i.push(new p(e, t.length + s.length));
      else {
        let t = e.length >> 1;
        i.push(new p(e.slice(0, t)), new p(e.slice(t)));
      }
    } else i.push(s);
  }
  replace(t, e, i) {
    if (!(i instanceof p)) return super.replace(t, e, i);
    let n = g(this.text, g(i.text, v(this.text, 0, t)), e),
      s = this.length + i.length - (e - t);
    return n.length <= 32 ? new p(n, s) : m.from(p.split(n, []), s);
  }
  sliceString(t, e = this.length, i = "\n") {
    let n = "";
    for (let s = 0, r = 0; s <= e && r < this.text.length; r++) {
      let o = this.text[r],
        l = s + o.length;
      s > t && r && (n += i),
        t < l && e > s && (n += o.slice(Math.max(0, t - s), e - s)),
        (s = l + 1);
    }
    return n;
  }
  flatten(t) {
    for (let e of this.text) t.push(e);
  }
  scanIdentical() {
    return 0;
  }
  static split(t, e) {
    let i = [],
      n = -1;
    for (let s of t)
      i.push(s),
        (n += s.length + 1),
        32 == i.length && (e.push(new p(i, n)), (i = []), (n = -1));
    return n > -1 && e.push(new p(i, n)), e;
  }
}
class m extends d {
  constructor(t, e) {
    super(), (this.children = t), (this.length = e), (this.lines = 0);
    for (let e of t) this.lines += e.lines;
  }
  lineInner(t, e, i, n) {
    for (let s = 0; ; s++) {
      let r = this.children[s],
        o = n + r.length,
        l = i + r.lines - 1;
      if ((e ? l : o) >= t) return r.lineInner(t, e, i, n);
      (n = o + 1), (i = l + 1);
    }
  }
  decompose(t, e, i, n) {
    for (let s = 0, r = 0; r <= e && s < this.children.length; s++) {
      let o = this.children[s],
        l = r + o.length;
      if (t <= l && e >= r) {
        let s = n & ((r <= t ? 1 : 0) | (l >= e ? 2 : 0));
        r >= t && l <= e && !s ? i.push(o) : o.decompose(t - r, e - r, i, s);
      }
      r = l + 1;
    }
  }
  replace(t, e, i) {
    if (i.lines < this.lines)
      for (let n = 0, s = 0; n < this.children.length; n++) {
        let r = this.children[n],
          o = s + r.length;
        if (t >= s && e <= o) {
          let l = r.replace(t - s, e - s, i),
            h = this.lines - r.lines + l.lines;
          if (l.lines < h >> 4 && l.lines > h >> 6) {
            let s = this.children.slice();
            return (s[n] = l), new m(s, this.length - (e - t) + i.length);
          }
          return super.replace(s, o, l);
        }
        s = o + 1;
      }
    return super.replace(t, e, i);
  }
  sliceString(t, e = this.length, i = "\n") {
    let n = "";
    for (let s = 0, r = 0; s < this.children.length && r <= e; s++) {
      let o = this.children[s],
        l = r + o.length;
      r > t && s && (n += i),
        t < l && e > r && (n += o.sliceString(t - r, e - r, i)),
        (r = l + 1);
    }
    return n;
  }
  flatten(t) {
    for (let e of this.children) e.flatten(t);
  }
  scanIdentical(t, e) {
    if (!(t instanceof m)) return 0;
    let i = 0,
      [n, s, r, o] =
        e > 0
          ? [0, 0, this.children.length, t.children.length]
          : [this.children.length - 1, t.children.length - 1, -1, -1];
    for (; ; n += e, s += e) {
      if (n == r || s == o) return i;
      let l = this.children[n],
        h = t.children[s];
      if (l != h) return i + l.scanIdentical(h, e);
      i += l.length + 1;
    }
  }
  static from(t, e = t.reduce((t, e) => t + e.length + 1, -1)) {
    let i = 0;
    for (let e of t) i += e.lines;
    if (i < 32) {
      let i = [];
      for (let e of t) e.flatten(i);
      return new p(i, e);
    }
    let n = Math.max(32, i >> 5),
      s = n << 1,
      r = n >> 1,
      o = [],
      l = 0,
      h = -1,
      a = [];
    function c(t) {
      let e;
      if (t.lines > s && t instanceof m) for (let e of t.children) c(e);
      else
        t.lines > r && (l > r || !l)
          ? (u(), o.push(t))
          : t instanceof p &&
            l &&
            (e = a[a.length - 1]) instanceof p &&
            t.lines + e.lines <= 32
          ? ((l += t.lines),
            (h += t.length + 1),
            (a[a.length - 1] = new p(
              e.text.concat(t.text),
              e.length + 1 + t.length
            )))
          : (l + t.lines > n && u(),
            (l += t.lines),
            (h += t.length + 1),
            a.push(t));
    }
    function u() {
      0 != l &&
        (o.push(1 == a.length ? a[0] : m.from(a, h)),
        (h = -1),
        (l = a.length = 0));
    }
    for (let e of t) c(e);
    return u(), 1 == o.length ? o[0] : new m(o, e);
  }
}
function g(t, e, i = 0, n = 1e9) {
  for (let s = 0, r = 0, o = !0; r < t.length && s <= n; r++) {
    let l = t[r],
      h = s + l.length;
    h >= i &&
      (h > n && (l = l.slice(0, n - s)),
      s < i && (l = l.slice(i - s)),
      o ? ((e[e.length - 1] += l), (o = !1)) : e.push(l)),
      (s = h + 1);
  }
  return e;
}
function v(t, e, i) {
  return g(t, [""], e, i);
}
d.empty = new p([""], 0);
class w {
  constructor(t, e = 1) {
    (this.dir = e),
      (this.done = !1),
      (this.lineBreak = !1),
      (this.value = ""),
      (this.nodes = [t]),
      (this.offsets = [
        e > 0 ? 1 : (t instanceof p ? t.text.length : t.children.length) << 1,
      ]);
  }
  nextInner(t, e) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1,
        n = this.nodes[i],
        s = this.offsets[i],
        r = s >> 1,
        o = n instanceof p ? n.text.length : n.children.length;
      if (r == (e > 0 ? o : 0)) {
        if (0 == i) return (this.done = !0), (this.value = ""), this;
        e > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((1 & s) == (e > 0 ? 0 : 1)) {
        if (((this.offsets[i] += e), 0 == t))
          return (this.lineBreak = !0), (this.value = "\n"), this;
        t--;
      } else if (n instanceof p) {
        let s = n.text[r + (e < 0 ? -1 : 0)];
        if (((this.offsets[i] += e), s.length > Math.max(0, t)))
          return (
            (this.value =
              0 == t ? s : e > 0 ? s.slice(t) : s.slice(0, s.length - t)),
            this
          );
        t -= s.length;
      } else {
        let s = n.children[r + (e < 0 ? -1 : 0)];
        t > s.length
          ? ((t -= s.length), (this.offsets[i] += e))
          : (e < 0 && this.offsets[i]--,
            this.nodes.push(s),
            this.offsets.push(
              e > 0
                ? 1
                : (s instanceof p ? s.text.length : s.children.length) << 1
            ));
      }
    }
  }
  next(t = 0) {
    return (
      t < 0 && (this.nextInner(-t, -this.dir), (t = this.value.length)),
      this.nextInner(t, this.dir)
    );
  }
}
class y {
  constructor(t, e, i) {
    (this.value = ""),
      (this.done = !1),
      (this.cursor = new w(t, e > i ? -1 : 1)),
      (this.pos = e > i ? t.length : 0),
      (this.from = Math.min(e, i)),
      (this.to = Math.max(e, i));
  }
  nextInner(t, e) {
    if (e < 0 ? this.pos <= this.from : this.pos >= this.to)
      return (this.value = ""), (this.done = !0), this;
    t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
    let i = e < 0 ? this.pos - this.from : this.to - this.pos;
    t > i && (t = i), (i -= t);
    let { value: n } = this.cursor.next(t);
    return (
      (this.pos += (n.length + t) * e),
      (this.value =
        n.length <= i ? n : e < 0 ? n.slice(n.length - i) : n.slice(0, i)),
      (this.done = !this.value),
      this
    );
  }
  next(t = 0) {
    return (
      t < 0
        ? (t = Math.max(t, this.from - this.pos))
        : t > 0 && (t = Math.min(t, this.to - this.pos)),
      this.nextInner(t, this.cursor.dir)
    );
  }
  get lineBreak() {
    return this.cursor.lineBreak && "" != this.value;
  }
}
class b {
  constructor(t) {
    (this.inner = t),
      (this.afterBreak = !0),
      (this.value = ""),
      (this.done = !1);
  }
  next(t = 0) {
    let { done: e, lineBreak: i, value: n } = this.inner.next(t);
    return (
      e
        ? ((this.done = !0), (this.value = ""))
        : i
        ? this.afterBreak
          ? (this.value = "")
          : ((this.afterBreak = !0), this.next())
        : ((this.value = n), (this.afterBreak = !1)),
      this
    );
  }
  get lineBreak() {
    return !1;
  }
}
"undefined" != typeof Symbol &&
  ((d.prototype[Symbol.iterator] = function () {
    return this.iter();
  }),
  (w.prototype[Symbol.iterator] =
    y.prototype[Symbol.iterator] =
    b.prototype[Symbol.iterator] =
      function () {
        return this;
      }));
class x {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.number = i), (this.text = n);
  }
  get length() {
    return this.to - this.from;
  }
}
const k = /\r\n?|\n/;
var S = (function (t) {
  return (
    (t[(t.Simple = 0)] = "Simple"),
    (t[(t.TrackDel = 1)] = "TrackDel"),
    (t[(t.TrackBefore = 2)] = "TrackBefore"),
    (t[(t.TrackAfter = 3)] = "TrackAfter"),
    t
  );
})(S || (S = {}));
class A {
  constructor(t) {
    this.sections = t;
  }
  get length() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) t += this.sections[e];
    return t;
  }
  get newLength() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e + 1];
      t += i < 0 ? this.sections[e] : i;
    }
    return t;
  }
  get empty() {
    return (
      0 == this.sections.length ||
      (2 == this.sections.length && this.sections[1] < 0)
    );
  }
  iterGaps(t) {
    for (let e = 0, i = 0, n = 0; e < this.sections.length; ) {
      let s = this.sections[e++],
        r = this.sections[e++];
      r < 0 ? (t(i, n, s), (n += s)) : (n += r), (i += s);
    }
  }
  iterChangedRanges(t, e = !1) {
    O(this, t, e);
  }
  get invertedDesc() {
    let t = [];
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++],
        n = this.sections[e++];
      n < 0 ? t.push(i, n) : t.push(n, i);
    }
    return new A(t);
  }
  composeDesc(t) {
    return this.empty ? t : t.empty ? this : R(this, t);
  }
  mapDesc(t, e = !1) {
    return t.empty ? this : T(this, t, e);
  }
  mapPos(t, e = -1, i = S.Simple) {
    let n = 0,
      s = 0;
    for (let r = 0; r < this.sections.length; ) {
      let o = this.sections[r++],
        l = this.sections[r++],
        h = n + o;
      if (l < 0) {
        if (h > t) return s + (t - n);
        s += o;
      } else {
        if (
          i != S.Simple &&
          h >= t &&
          ((i == S.TrackDel && n < t && h > t) ||
            (i == S.TrackBefore && n < t) ||
            (i == S.TrackAfter && h > t))
        )
          return null;
        if (h > t || (h == t && e < 0 && !o))
          return t == n || e < 0 ? s : s + l;
        s += l;
      }
      n = h;
    }
    if (t > n)
      throw new RangeError(
        `Position ${t} is out of range for changeset of length ${n}`
      );
    return s;
  }
  touchesRange(t, e = t) {
    for (let i = 0, n = 0; i < this.sections.length && n <= e; ) {
      let s = n + this.sections[i++];
      if (this.sections[i++] >= 0 && n <= e && s >= t)
        return !(n < t && s > e) || "cover";
      n = s;
    }
    return !1;
  }
  toString() {
    let t = "";
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++],
        n = this.sections[e++];
      t += (t ? " " : "") + i + (n >= 0 ? ":" + n : "");
    }
    return t;
  }
  toJSON() {
    return this.sections;
  }
  static fromJSON(t) {
    if (
      !Array.isArray(t) ||
      t.length % 2 ||
      t.some((t) => "number" != typeof t)
    )
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new A(t);
  }
}
class C extends A {
  constructor(t, e) {
    super(t), (this.inserted = e);
  }
  apply(t) {
    if (this.length != t.length)
      throw new RangeError(
        "Applying change set to a document with the wrong length"
      );
    return (
      O(this, (e, i, n, s, r) => (t = t.replace(n, n + (i - e), r)), !1), t
    );
  }
  mapDesc(t, e = !1) {
    return T(this, t, e, !0);
  }
  invert(t) {
    let e = this.sections.slice(),
      i = [];
    for (let n = 0, s = 0; n < e.length; n += 2) {
      let r = e[n],
        o = e[n + 1];
      if (o >= 0) {
        (e[n] = o), (e[n + 1] = r);
        let l = n >> 1;
        for (; i.length < l; ) i.push(d.empty);
        i.push(r ? t.slice(s, s + r) : d.empty);
      }
      s += r;
    }
    return new C(e, i);
  }
  compose(t) {
    return this.empty ? t : t.empty ? this : R(this, t, !0);
  }
  map(t, e = !1) {
    return t.empty ? this : T(this, t, e, !0);
  }
  iterChanges(t, e = !1) {
    O(this, t, e);
  }
  get desc() {
    return new A(this.sections);
  }
  filter(t) {
    let e = [],
      i = [],
      n = [],
      s = new E(this);
    t: for (let r = 0, o = 0; ; ) {
      let l = r == t.length ? 1e9 : t[r++];
      for (; o < l || (o == l && 0 == s.len); ) {
        if (s.done) break t;
        let t = Math.min(s.len, l - o);
        M(n, t, -1);
        let r = -1 == s.ins ? -1 : 0 == s.off ? s.ins : 0;
        M(e, t, r), r > 0 && D(i, e, s.text), s.forward(t), (o += t);
      }
      let h = t[r++];
      for (; o < h; ) {
        if (s.done) break t;
        let t = Math.min(s.len, h - o);
        M(e, t, -1),
          M(n, t, -1 == s.ins ? -1 : 0 == s.off ? s.ins : 0),
          s.forward(t),
          (o += t);
      }
    }
    return { changes: new C(e, i), filtered: new A(n) };
  }
  toJSON() {
    let t = [];
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e],
        n = this.sections[e + 1];
      n < 0
        ? t.push(i)
        : 0 == n
        ? t.push([i])
        : t.push([i].concat(this.inserted[e >> 1].toJSON()));
    }
    return t;
  }
  static of(t, e, i) {
    let n = [],
      s = [],
      r = 0,
      o = null;
    function l(t = !1) {
      if (!t && !n.length) return;
      r < e && M(n, e - r, -1);
      let i = new C(n, s);
      (o = o ? o.compose(i.map(o)) : i), (n = []), (s = []), (r = 0);
    }
    return (
      (function t(h) {
        if (Array.isArray(h)) for (let e of h) t(e);
        else if (h instanceof C) {
          if (h.length != e)
            throw new RangeError(
              `Mismatched change set length (got ${h.length}, expected ${e})`
            );
          l(), (o = o ? o.compose(h.map(o)) : h);
        } else {
          let { from: t, to: o = t, insert: a } = h;
          if (t > o || t < 0 || o > e)
            throw new RangeError(
              `Invalid change range ${t} to ${o} (in doc of length ${e})`
            );
          let c = a
              ? "string" == typeof a
                ? d.of(a.split(i || k))
                : a
              : d.empty,
            u = c.length;
          if (t == o && 0 == u) return;
          t < r && l(),
            t > r && M(n, t - r, -1),
            M(n, o - t, u),
            D(s, n, c),
            (r = o);
        }
      })(t),
      l(!o),
      o
    );
  }
  static empty(t) {
    return new C(t ? [t, -1] : [], []);
  }
  static fromJSON(t) {
    if (!Array.isArray(t))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let e = [],
      i = [];
    for (let n = 0; n < t.length; n++) {
      let s = t[n];
      if ("number" == typeof s) e.push(s, -1);
      else {
        if (
          !Array.isArray(s) ||
          "number" != typeof s[0] ||
          s.some((t, e) => e && "string" != typeof t)
        )
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (1 == s.length) e.push(s[0], 0);
        else {
          for (; i.length < n; ) i.push(d.empty);
          (i[n] = d.of(s.slice(1))), e.push(s[0], i[n].length);
        }
      }
    }
    return new C(e, i);
  }
}
function M(t, e, i, n = !1) {
  if (0 == e && i <= 0) return;
  let s = t.length - 2;
  s >= 0 && i <= 0 && i == t[s + 1]
    ? (t[s] += e)
    : 0 == e && 0 == t[s]
    ? (t[s + 1] += i)
    : n
    ? ((t[s] += e), (t[s + 1] += i))
    : t.push(e, i);
}
function D(t, e, i) {
  if (0 == i.length) return;
  let n = (e.length - 2) >> 1;
  if (n < t.length) t[t.length - 1] = t[t.length - 1].append(i);
  else {
    for (; t.length < n; ) t.push(d.empty);
    t.push(i);
  }
}
function O(t, e, i) {
  let n = t.inserted;
  for (let s = 0, r = 0, o = 0; o < t.sections.length; ) {
    let l = t.sections[o++],
      h = t.sections[o++];
    if (h < 0) (s += l), (r += l);
    else {
      let a = s,
        c = r,
        u = d.empty;
      for (
        ;
        (a += l),
          (c += h),
          h && n && (u = u.append(n[(o - 2) >> 1])),
          !(i || o == t.sections.length || t.sections[o + 1] < 0);

      )
        (l = t.sections[o++]), (h = t.sections[o++]);
      e(s, a, r, c, u), (s = a), (r = c);
    }
  }
}
function T(t, e, i, n = !1) {
  let s = [],
    r = n ? [] : null,
    o = new E(t),
    l = new E(e);
  for (let t = 0, e = 0; ; )
    if (-1 == o.ins) (t += o.len), o.next();
    else if (-1 == l.ins && e < t) {
      let i = Math.min(l.len, t - e);
      l.forward(i), M(s, i, -1), (e += i);
    } else if (
      l.ins >= 0 &&
      (o.done || e < t || (e == t && (l.len < o.len || (l.len == o.len && !i))))
    ) {
      for (M(s, l.ins, -1); t > e && !o.done && t + o.len < e + l.len; )
        (t += o.len), o.next();
      (e += l.len), l.next();
    } else {
      if (!(o.ins >= 0)) {
        if (o.done && l.done) return r ? new C(s, r) : new A(s);
        throw new Error("Mismatched change set lengths");
      }
      {
        let i = 0,
          n = t + o.len;
        for (;;)
          if (l.ins >= 0 && e > t && e + l.len < n)
            (i += l.ins), (e += l.len), l.next();
          else {
            if (!(-1 == l.ins && e < n)) break;
            {
              let t = Math.min(l.len, n - e);
              (i += t), l.forward(t), (e += t);
            }
          }
        M(s, i, o.ins), r && D(r, s, o.text), (t = n), o.next();
      }
    }
}
function R(t, e, i = !1) {
  let n = [],
    s = i ? [] : null,
    r = new E(t),
    o = new E(e);
  for (let t = !1; ; ) {
    if (r.done && o.done) return s ? new C(n, s) : new A(n);
    if (0 == r.ins) M(n, r.len, 0, t), r.next();
    else if (0 != o.len || o.done) {
      if (r.done || o.done) throw new Error("Mismatched change set lengths");
      {
        let e = Math.min(r.len2, o.len),
          i = n.length;
        if (-1 == r.ins) {
          let i = -1 == o.ins ? -1 : o.off ? 0 : o.ins;
          M(n, e, i, t), s && i && D(s, n, o.text);
        } else
          -1 == o.ins
            ? (M(n, r.off ? 0 : r.len, e, t), s && D(s, n, r.textBit(e)))
            : (M(n, r.off ? 0 : r.len, o.off ? 0 : o.ins, t),
              s && !o.off && D(s, n, o.text));
        (t = (r.ins > e || (o.ins >= 0 && o.len > e)) && (t || n.length > i)),
          r.forward2(e),
          o.forward(e);
      }
    } else M(n, 0, o.ins, t), s && D(s, n, o.text), o.next();
  }
}
class E {
  constructor(t) {
    (this.set = t), (this.i = 0), this.next();
  }
  next() {
    let { sections: t } = this.set;
    this.i < t.length
      ? ((this.len = t[this.i++]), (this.ins = t[this.i++]))
      : ((this.len = 0), (this.ins = -2)),
      (this.off = 0);
  }
  get done() {
    return -2 == this.ins;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: t } = this.set,
      e = (this.i - 2) >> 1;
    return e >= t.length ? d.empty : t[e];
  }
  textBit(t) {
    let { inserted: e } = this.set,
      i = (this.i - 2) >> 1;
    return i >= e.length && !t
      ? d.empty
      : e[i].slice(this.off, null == t ? void 0 : this.off + t);
  }
  forward(t) {
    t == this.len ? this.next() : ((this.len -= t), (this.off += t));
  }
  forward2(t) {
    -1 == this.ins
      ? this.forward(t)
      : t == this.ins
      ? this.next()
      : ((this.ins -= t), (this.off += t));
  }
}
class L {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.flags = i);
  }
  get anchor() {
    return 16 & this.flags ? this.to : this.from;
  }
  get head() {
    return 16 & this.flags ? this.from : this.to;
  }
  get empty() {
    return this.from == this.to;
  }
  get assoc() {
    return 4 & this.flags ? -1 : 8 & this.flags ? 1 : 0;
  }
  get bidiLevel() {
    let t = 3 & this.flags;
    return 3 == t ? null : t;
  }
  get goalColumn() {
    let t = this.flags >> 5;
    return 33554431 == t ? void 0 : t;
  }
  map(t, e = -1) {
    let i, n;
    return (
      this.empty
        ? (i = n = t.mapPos(this.from, e))
        : ((i = t.mapPos(this.from, 1)), (n = t.mapPos(this.to, -1))),
      i == this.from && n == this.to ? this : new L(i, n, this.flags)
    );
  }
  extend(t, e = t) {
    if (t <= this.anchor && e >= this.anchor) return B.range(t, e);
    let i = Math.abs(t - this.anchor) > Math.abs(e - this.anchor) ? t : e;
    return B.range(this.anchor, i);
  }
  eq(t) {
    return this.anchor == t.anchor && this.head == t.head;
  }
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  static fromJSON(t) {
    if (!t || "number" != typeof t.anchor || "number" != typeof t.head)
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return B.range(t.anchor, t.head);
  }
}
class B {
  constructor(t, e = 0) {
    (this.ranges = t), (this.mainIndex = e);
  }
  map(t, e = -1) {
    return t.empty
      ? this
      : B.create(
          this.ranges.map((i) => i.map(t, e)),
          this.mainIndex
        );
  }
  eq(t) {
    if (this.ranges.length != t.ranges.length || this.mainIndex != t.mainIndex)
      return !1;
    for (let e = 0; e < this.ranges.length; e++)
      if (!this.ranges[e].eq(t.ranges[e])) return !1;
    return !0;
  }
  get main() {
    return this.ranges[this.mainIndex];
  }
  asSingle() {
    return 1 == this.ranges.length ? this : new B([this.main]);
  }
  addRange(t, e = !0) {
    return B.create([t].concat(this.ranges), e ? 0 : this.mainIndex + 1);
  }
  replaceRange(t, e = this.mainIndex) {
    let i = this.ranges.slice();
    return (i[e] = t), B.create(i, this.mainIndex);
  }
  toJSON() {
    return { ranges: this.ranges.map((t) => t.toJSON()), main: this.mainIndex };
  }
  static fromJSON(t) {
    if (
      !t ||
      !Array.isArray(t.ranges) ||
      "number" != typeof t.main ||
      t.main >= t.ranges.length
    )
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new B(
      t.ranges.map((t) => L.fromJSON(t)),
      t.main
    );
  }
  static single(t, e = t) {
    return new B([B.range(t, e)], 0);
  }
  static create(t, e = 0) {
    if (0 == t.length)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, n = 0; n < t.length; n++) {
      let s = t[n];
      if (s.empty ? s.from <= i : s.from < i) return P(t.slice(), e);
      i = s.to;
    }
    return new B(t, e);
  }
  static cursor(t, e = 0, i, n) {
    return new L(
      t,
      t,
      (0 == e ? 0 : e < 0 ? 4 : 8) |
        (null == i ? 3 : Math.min(2, i)) |
        ((null != n ? n : 33554431) << 5)
    );
  }
  static range(t, e, i) {
    let n = (null != i ? i : 33554431) << 5;
    return e < t ? new L(e, t, 24 | n) : new L(t, e, n | (e > t ? 4 : 0));
  }
}
function P(t, e = 0) {
  let i = t[e];
  t.sort((t, e) => t.from - e.from), (e = t.indexOf(i));
  for (let i = 1; i < t.length; i++) {
    let n = t[i],
      s = t[i - 1];
    if (n.empty ? n.from <= s.to : n.from < s.to) {
      let r = s.from,
        o = Math.max(n.to, s.to);
      i <= e && e--,
        t.splice(--i, 2, n.anchor > n.head ? B.range(o, r) : B.range(r, o));
    }
  }
  return new B(t, e);
}
function N(t, e) {
  for (let i of t.ranges)
    if (i.to > e) throw new RangeError("Selection points outside of document");
}
let I = 0;
class V {
  constructor(t, e, i, n, s) {
    (this.combine = t),
      (this.compareInput = e),
      (this.compare = i),
      (this.isStatic = n),
      (this.extensions = s),
      (this.id = I++),
      (this.default = t([]));
  }
  static define(t = {}) {
    return new V(
      t.combine || ((t) => t),
      t.compareInput || ((t, e) => t === e),
      t.compare || (t.combine ? (t, e) => t === e : H),
      !!t.static,
      t.enables
    );
  }
  of(t) {
    return new W([], this, 0, t);
  }
  compute(t, e) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new W(t, this, 1, e);
  }
  computeN(t, e) {
    if (this.isStatic) throw new Error("Can't compute a static facet");
    return new W(t, this, 2, e);
  }
  from(t, e) {
    return e || (e = (t) => t), this.compute([t], (i) => e(i.field(t)));
  }
}
function H(t, e) {
  return t == e || (t.length == e.length && t.every((t, i) => t === e[i]));
}
class W {
  constructor(t, e, i, n) {
    (this.dependencies = t),
      (this.facet = e),
      (this.type = i),
      (this.value = n),
      (this.id = I++);
  }
  dynamicSlot(t) {
    var e;
    let i = this.value,
      n = this.facet.compareInput,
      s = this.id,
      r = t[s] >> 1,
      o = 2 == this.type,
      l = !1,
      h = !1,
      a = [];
    for (let i of this.dependencies)
      "doc" == i
        ? (l = !0)
        : "selection" == i
        ? (h = !0)
        : 0 == (1 & (null !== (e = t[i.id]) && void 0 !== e ? e : 1)) &&
          a.push(t[i.id]);
    return {
      create: (t) => ((t.values[r] = i(t)), 1),
      update(t, e) {
        if (
          (l && e.docChanged) ||
          (h && (e.docChanged || e.selection)) ||
          a.some((e) => (1 & et(t, e)) > 0)
        ) {
          let e = i(t);
          if (o ? !z(e, t.values[r], n) : !n(e, t.values[r]))
            return (t.values[r] = e), 1;
        }
        return 0;
      },
      reconfigure(t, e) {
        let l = i(t),
          h = e.config.address[s];
        if (null != h) {
          let i = it(e, h);
          if (o ? z(l, i, n) : n(l, i)) return (t.values[r] = i), 0;
        }
        return (t.values[r] = l), 1;
      },
    };
  }
}
function z(t, e, i) {
  if (t.length != e.length) return !1;
  for (let n = 0; n < t.length; n++) if (!i(t[n], e[n])) return !1;
  return !0;
}
function F(t, e, i) {
  let n = i.map((e) => t[e.id]),
    s = i.map((t) => t.type),
    r = n.filter((t) => !(1 & t)),
    o = t[e.id] >> 1;
  function l(t) {
    let i = [];
    for (let e = 0; e < n.length; e++) {
      let r = it(t, n[e]);
      if (2 == s[e]) for (let t of r) i.push(t);
      else i.push(r);
    }
    return e.combine(i);
  }
  return {
    create(t) {
      for (let e of n) et(t, e);
      return (t.values[o] = l(t)), 1;
    },
    update(t, i) {
      if (!r.some((e) => 1 & et(t, e))) return 0;
      let n = l(t);
      return e.compare(n, t.values[o]) ? 0 : ((t.values[o] = n), 1);
    },
    reconfigure(t, s) {
      let r = n.some((e) => 1 & et(t, e)),
        h = s.config.facets[e.id],
        a = s.facet(e);
      if (h && !r && H(i, h)) return (t.values[o] = a), 0;
      let c = l(t);
      return e.compare(c, a) ? ((t.values[o] = a), 0) : ((t.values[o] = c), 1);
    },
  };
}
const q = V.define({ static: !0 });
class _ {
  constructor(t, e, i, n, s) {
    (this.id = t),
      (this.createF = e),
      (this.updateF = i),
      (this.compareF = n),
      (this.spec = s),
      (this.provides = void 0);
  }
  static define(t) {
    let e = new _(I++, t.create, t.update, t.compare || ((t, e) => t === e), t);
    return t.provide && (e.provides = t.provide(e)), e;
  }
  create(t) {
    let e = t.facet(q).find((t) => t.field == this);
    return ((null == e ? void 0 : e.create) || this.createF)(t);
  }
  slot(t) {
    let e = t[this.id] >> 1;
    return {
      create: (t) => ((t.values[e] = this.create(t)), 1),
      update: (t, i) => {
        let n = t.values[e],
          s = this.updateF(n, i);
        return this.compareF(n, s) ? 0 : ((t.values[e] = s), 1);
      },
      reconfigure: (t, i) =>
        null != i.config.address[this.id]
          ? ((t.values[e] = i.field(this)), 0)
          : ((t.values[e] = this.create(t)), 1),
    };
  }
  init(t) {
    return [this, q.of({ field: this, create: t })];
  }
  get extension() {
    return this;
  }
}
const j = 4,
  U = 3,
  $ = 2,
  K = 1,
  G = 0;
function J(t) {
  return (e) => new X(e, t);
}
const Y = {
  lowest: J(j),
  low: J(U),
  default: J($),
  high: J(K),
  highest: J(G),
  fallback: J(j),
  extend: J(K),
  override: J(G),
};
class X {
  constructor(t, e) {
    (this.inner = t), (this.prec = e);
  }
}
class Q {
  of(t) {
    return new Z(this, t);
  }
  reconfigure(t) {
    return Q.reconfigure.of({ compartment: this, extension: t });
  }
  get(t) {
    return t.config.compartments.get(this);
  }
}
class Z {
  constructor(t, e) {
    (this.compartment = t), (this.inner = e);
  }
}
class tt {
  constructor(t, e, i, n, s, r) {
    for (
      this.base = t,
        this.compartments = e,
        this.dynamicSlots = i,
        this.address = n,
        this.staticValues = s,
        this.facets = r,
        this.statusTemplate = [];
      this.statusTemplate.length < i.length;

    )
      this.statusTemplate.push(0);
  }
  staticFacet(t) {
    let e = this.address[t.id];
    return null == e ? t.default : this.staticValues[e >> 1];
  }
  static resolve(t, e, i) {
    let n = [],
      s = Object.create(null),
      r = new Map();
    for (let i of (function (t, e, i) {
      let n = [[], [], [], [], []],
        s = new Map();
      function r(t, o) {
        let l = s.get(t);
        if (null != l) {
          if (l >= o) return;
          let e = n[l].indexOf(t);
          e > -1 && n[l].splice(e, 1),
            t instanceof Z && i.delete(t.compartment);
        }
        if ((s.set(t, o), Array.isArray(t))) for (let e of t) r(e, o);
        else if (t instanceof Z) {
          if (i.has(t.compartment))
            throw new RangeError("Duplicate use of compartment in extensions");
          let n = e.get(t.compartment) || t.inner;
          i.set(t.compartment, n), r(n, o);
        } else if (t instanceof X) r(t.inner, t.prec);
        else if (t instanceof _) n[o].push(t), t.provides && r(t.provides, o);
        else if (t instanceof W)
          n[o].push(t), t.facet.extensions && r(t.facet.extensions, o);
        else {
          let e = t.extension;
          if (!e)
            throw new Error(
              `Unrecognized extension value in extension set (${t}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`
            );
          r(e, o);
        }
      }
      return r(t, $), n.reduce((t, e) => t.concat(e));
    })(t, e, r))
      i instanceof _
        ? n.push(i)
        : (s[i.facet.id] || (s[i.facet.id] = [])).push(i);
    let o = Object.create(null),
      l = [],
      h = [];
    for (let t of n) (o[t.id] = h.length << 1), h.push((e) => t.slot(e));
    let a = null == i ? void 0 : i.config.facets;
    for (let t in s) {
      let e = s[t],
        n = e[0].facet,
        r = (a && a[t]) || [];
      if (e.every((t) => 0 == t.type))
        if (((o[n.id] = (l.length << 1) | 1), H(r, e))) l.push(i.facet(n));
        else {
          let t = n.combine(e.map((t) => t.value));
          l.push(i && n.compare(t, i.facet(n)) ? i.facet(n) : t);
        }
      else {
        for (let t of e)
          0 == t.type
            ? ((o[t.id] = (l.length << 1) | 1), l.push(t.value))
            : ((o[t.id] = h.length << 1), h.push((e) => t.dynamicSlot(e)));
        (o[n.id] = h.length << 1), h.push((t) => F(t, n, e));
      }
    }
    let c = h.map((t) => t(o));
    return new tt(t, r, c, o, l, s);
  }
}
function et(t, e) {
  if (1 & e) return 2;
  let i = e >> 1,
    n = t.status[i];
  if (4 == n) throw new Error("Cyclic dependency between fields and/or facets");
  if (2 & n) return n;
  t.status[i] = 4;
  let s = t.computeSlot(t, t.config.dynamicSlots[i]);
  return (t.status[i] = 2 | s);
}
function it(t, e) {
  return 1 & e ? t.config.staticValues[e >> 1] : t.values[e >> 1];
}
const nt = V.define(),
  st = V.define({ combine: (t) => t.some((t) => t), static: !0 }),
  rt = V.define({ combine: (t) => (t.length ? t[0] : void 0), static: !0 }),
  ot = V.define(),
  lt = V.define(),
  ht = V.define(),
  at = V.define({ combine: (t) => !!t.length && t[0] });
class ct {
  constructor(t, e) {
    (this.type = t), (this.value = e);
  }
  static define() {
    return new ut();
  }
}
class ut {
  of(t) {
    return new ct(this, t);
  }
}
class ft {
  constructor(t) {
    this.map = t;
  }
  of(t) {
    return new dt(this, t);
  }
}
class dt {
  constructor(t, e) {
    (this.type = t), (this.value = e);
  }
  map(t) {
    let e = this.type.map(this.value, t);
    return void 0 === e
      ? void 0
      : e == this.value
      ? this
      : new dt(this.type, e);
  }
  is(t) {
    return this.type == t;
  }
  static define(t = {}) {
    return new ft(t.map || ((t) => t));
  }
  static mapEffects(t, e) {
    if (!t.length) return t;
    let i = [];
    for (let n of t) {
      let t = n.map(e);
      t && i.push(t);
    }
    return i;
  }
}
(dt.reconfigure = dt.define()), (dt.appendConfig = dt.define());
class pt {
  constructor(t, e, i, n, s, r) {
    (this.startState = t),
      (this.changes = e),
      (this.selection = i),
      (this.effects = n),
      (this.annotations = s),
      (this.scrollIntoView = r),
      (this._doc = null),
      (this._state = null),
      i && N(i, e.newLength),
      s.some((t) => t.type == pt.time) ||
        (this.annotations = s.concat(pt.time.of(Date.now())));
  }
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  annotation(t) {
    for (let e of this.annotations) if (e.type == t) return e.value;
  }
  get docChanged() {
    return !this.changes.empty;
  }
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  isUserEvent(t) {
    let e = this.annotation(pt.userEvent);
    return !(
      !e ||
      !(
        e == t ||
        (e.length > t.length && e.slice(0, t.length) == t && "." == e[t.length])
      )
    );
  }
}
function mt(t, e) {
  let i = [];
  for (let n = 0, s = 0; ; ) {
    let r, o;
    if (n < t.length && (s == e.length || e[s] >= t[n]))
      (r = t[n++]), (o = t[n++]);
    else {
      if (!(s < e.length)) return i;
      (r = e[s++]), (o = e[s++]);
    }
    !i.length || i[i.length - 1] < r
      ? i.push(r, o)
      : i[i.length - 1] < o && (i[i.length - 1] = o);
  }
}
function gt(t, e, i) {
  var n;
  let s, r, o;
  return (
    i
      ? ((s = e.changes),
        (r = C.empty(e.changes.length)),
        (o = t.changes.compose(e.changes)))
      : ((s = e.changes.map(t.changes)),
        (r = t.changes.mapDesc(e.changes, !0)),
        (o = t.changes.compose(s))),
    {
      changes: o,
      selection: e.selection
        ? e.selection.map(r)
        : null === (n = t.selection) || void 0 === n
        ? void 0
        : n.map(s),
      effects: dt.mapEffects(t.effects, s).concat(dt.mapEffects(e.effects, r)),
      annotations: t.annotations.length
        ? t.annotations.concat(e.annotations)
        : e.annotations,
      scrollIntoView: t.scrollIntoView || e.scrollIntoView,
    }
  );
}
function vt(t, e, i) {
  let n = e.selection,
    s = bt(e.annotations);
  return (
    e.userEvent && (s = s.concat(pt.userEvent.of(e.userEvent))),
    {
      changes:
        e.changes instanceof C
          ? e.changes
          : C.of(e.changes || [], i, t.facet(rt)),
      selection: n && (n instanceof B ? n : B.single(n.anchor, n.head)),
      effects: bt(e.effects),
      annotations: s,
      scrollIntoView: !!e.scrollIntoView,
    }
  );
}
function wt(t, e, i) {
  let n = vt(t, e.length ? e[0] : {}, t.doc.length);
  e.length && !1 === e[0].filter && (i = !1);
  for (let s = 1; s < e.length; s++) {
    !1 === e[s].filter && (i = !1);
    let r = !!e[s].sequential;
    n = gt(n, vt(t, e[s], r ? n.changes.newLength : t.doc.length), r);
  }
  let s = new pt(
    t,
    n.changes,
    n.selection,
    n.effects,
    n.annotations,
    n.scrollIntoView
  );
  return (function (t) {
    let e = t.startState,
      i = e.facet(ht),
      n = t;
    for (let s = i.length - 1; s >= 0; s--) {
      let r = i[s](t);
      r &&
        Object.keys(r).length &&
        (n = gt(t, vt(e, r, t.changes.newLength), !0));
    }
    return n == t
      ? t
      : new pt(
          e,
          t.changes,
          t.selection,
          n.effects,
          n.annotations,
          n.scrollIntoView
        );
  })(
    i
      ? (function (t) {
          let e = t.startState,
            i = !0;
          for (let n of e.facet(ot)) {
            let e = n(t);
            if (!1 === e) {
              i = !1;
              break;
            }
            Array.isArray(e) && (i = !0 === i ? e : mt(i, e));
          }
          if (!0 !== i) {
            let n, s;
            if (!1 === i)
              (s = t.changes.invertedDesc), (n = C.empty(e.doc.length));
            else {
              let e = t.changes.filter(i);
              (n = e.changes), (s = e.filtered.invertedDesc);
            }
            t = new pt(
              e,
              n,
              t.selection && t.selection.map(s),
              dt.mapEffects(t.effects, s),
              t.annotations,
              t.scrollIntoView
            );
          }
          let n = e.facet(lt);
          for (let i = n.length - 1; i >= 0; i--) {
            let s = n[i](t);
            t =
              s instanceof pt
                ? s
                : Array.isArray(s) && 1 == s.length && s[0] instanceof pt
                ? s[0]
                : wt(e, bt(s), !1);
          }
          return t;
        })(s)
      : s
  );
}
(pt.time = ct.define()),
  (pt.userEvent = ct.define()),
  (pt.addToHistory = ct.define()),
  (pt.remote = ct.define());
const yt = [];
function bt(t) {
  return null == t ? yt : Array.isArray(t) ? t : [t];
}
var xt = (function (t) {
  return (
    (t[(t.Word = 0)] = "Word"),
    (t[(t.Space = 1)] = "Space"),
    (t[(t.Other = 2)] = "Other"),
    t
  );
})(xt || (xt = {}));
const kt =
  /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let St;
try {
  St = new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch (t) {}
function At(t) {
  return (e) => {
    if (!/\S/.test(e)) return xt.Space;
    if (
      (function (t) {
        if (St) return St.test(t);
        for (let e = 0; e < t.length; e++) {
          let i = t[e];
          if (
            /\w/.test(i) ||
            (i > "" && (i.toUpperCase() != i.toLowerCase() || kt.test(i)))
          )
            return !0;
        }
        return !1;
      })(e)
    )
      return xt.Word;
    for (let i = 0; i < t.length; i++) if (e.indexOf(t[i]) > -1) return xt.Word;
    return xt.Other;
  };
}
class Ct {
  constructor(t, e, i, n, s, r) {
    (this.config = t),
      (this.doc = e),
      (this.selection = i),
      (this.values = n),
      (this.status = t.statusTemplate.slice()),
      (this.computeSlot = s),
      r && (r._state = this);
    for (let t = 0; t < this.config.dynamicSlots.length; t++) et(this, t << 1);
    this.computeSlot = null;
  }
  field(t, e = !0) {
    let i = this.config.address[t.id];
    if (null != i) return et(this, i), it(this, i);
    if (e) throw new RangeError("Field is not present in this state");
  }
  update(...t) {
    return wt(this, t, !0);
  }
  applyTransaction(t) {
    let e,
      i = this.config,
      { base: n, compartments: s } = i;
    for (let e of t.effects)
      e.is(Q.reconfigure)
        ? (i &&
            ((s = new Map()),
            i.compartments.forEach((t, e) => s.set(e, t)),
            (i = null)),
          s.set(e.value.compartment, e.value.extension))
        : e.is(dt.reconfigure)
        ? ((i = null), (n = e.value))
        : e.is(dt.appendConfig) && ((i = null), (n = bt(n).concat(e.value)));
    if (i) e = t.startState.values.slice();
    else {
      (i = tt.resolve(n, s, this)),
        (e = new Ct(
          i,
          this.doc,
          this.selection,
          i.dynamicSlots.map(() => null),
          (t, e) => e.reconfigure(t, this),
          null
        ).values);
    }
    new Ct(i, t.newDoc, t.newSelection, e, (e, i) => i.update(e, t), t);
  }
  replaceSelection(t) {
    return (
      "string" == typeof t && (t = this.toText(t)),
      this.changeByRange((e) => ({
        changes: { from: e.from, to: e.to, insert: t },
        range: B.cursor(e.from + t.length),
      }))
    );
  }
  changeByRange(t) {
    let e = this.selection,
      i = t(e.ranges[0]),
      n = this.changes(i.changes),
      s = [i.range],
      r = bt(i.effects);
    for (let i = 1; i < e.ranges.length; i++) {
      let o = t(e.ranges[i]),
        l = this.changes(o.changes),
        h = l.map(n);
      for (let t = 0; t < i; t++) s[t] = s[t].map(h);
      let a = n.mapDesc(l, !0);
      s.push(o.range.map(a)),
        (n = n.compose(h)),
        (r = dt.mapEffects(r, h).concat(dt.mapEffects(bt(o.effects), a)));
    }
    return { changes: n, selection: B.create(s, e.mainIndex), effects: r };
  }
  changes(t = []) {
    return t instanceof C
      ? t
      : C.of(t, this.doc.length, this.facet(Ct.lineSeparator));
  }
  toText(t) {
    return d.of(t.split(this.facet(Ct.lineSeparator) || k));
  }
  sliceDoc(t = 0, e = this.doc.length) {
    return this.doc.sliceString(t, e, this.lineBreak);
  }
  facet(t) {
    let e = this.config.address[t.id];
    return null == e ? t.default : (et(this, e), it(this, e));
  }
  toJSON(t) {
    let e = { doc: this.sliceDoc(), selection: this.selection.toJSON() };
    if (t)
      for (let i in t) {
        let n = t[i];
        n instanceof _ && (e[i] = n.spec.toJSON(this.field(t[i]), this));
      }
    return e;
  }
  static fromJSON(t, e = {}, i) {
    if (!t || "string" != typeof t.doc)
      throw new RangeError("Invalid JSON representation for EditorState");
    let n = [];
    if (i)
      for (let e in i) {
        let s = i[e],
          r = t[e];
        n.push(s.init((t) => s.spec.fromJSON(r, t)));
      }
    return Ct.create({
      doc: t.doc,
      selection: B.fromJSON(t.selection),
      extensions: e.extensions ? n.concat([e.extensions]) : n,
    });
  }
  static create(t = {}) {
    let e = tt.resolve(t.extensions || [], new Map()),
      i =
        t.doc instanceof d
          ? t.doc
          : d.of((t.doc || "").split(e.staticFacet(Ct.lineSeparator) || k)),
      n = t.selection
        ? t.selection instanceof B
          ? t.selection
          : B.single(t.selection.anchor, t.selection.head)
        : B.single(0);
    return (
      N(n, i.length),
      e.staticFacet(st) || (n = n.asSingle()),
      new Ct(
        e,
        i,
        n,
        e.dynamicSlots.map(() => null),
        (t, e) => e.create(t),
        null
      )
    );
  }
  get tabSize() {
    return this.facet(Ct.tabSize);
  }
  get lineBreak() {
    return this.facet(Ct.lineSeparator) || "\n";
  }
  get readOnly() {
    return this.facet(at);
  }
  phrase(t) {
    for (let e of this.facet(Ct.phrases))
      if (Object.prototype.hasOwnProperty.call(e, t)) return e[t];
    return t;
  }
  languageDataAt(t, e, i = -1) {
    let n = [];
    for (let s of this.facet(nt))
      for (let r of s(this, e, i))
        Object.prototype.hasOwnProperty.call(r, t) && n.push(r[t]);
    return n;
  }
  charCategorizer(t) {
    return At(this.languageDataAt("wordChars", t).join(""));
  }
  wordAt(t) {
    let { text: e, from: i, length: s } = this.doc.lineAt(t),
      r = this.charCategorizer(t),
      o = t - i,
      l = t - i;
    for (; o > 0; ) {
      let t = n(e, o, !1);
      if (r(e.slice(t, o)) != xt.Word) break;
      o = t;
    }
    for (; l < s; ) {
      let t = n(e, l);
      if (r(e.slice(l, t)) != xt.Word) break;
      l = t;
    }
    return o == l ? null : B.range(o + i, l + i);
  }
}
function Mt(t, e, i = {}) {
  let n = {};
  for (let e of t)
    for (let t of Object.keys(e)) {
      let s = e[t],
        r = n[t];
      if (void 0 === r) n[t] = s;
      else if (r === s || void 0 === s);
      else {
        if (!Object.hasOwnProperty.call(i, t))
          throw new Error("Config merge conflict for field " + t);
        n[t] = i[t](r, s);
      }
    }
  for (let t in e) void 0 === n[t] && (n[t] = e[t]);
  return n;
}
(Ct.allowMultipleSelections = st),
  (Ct.tabSize = V.define({ combine: (t) => (t.length ? t[0] : 4) })),
  (Ct.lineSeparator = rt),
  (Ct.readOnly = at),
  (Ct.phrases = V.define()),
  (Ct.languageData = nt),
  (Ct.changeFilter = ot),
  (Ct.transactionFilter = lt),
  (Ct.transactionExtender = ht),
  (Q.reconfigure = dt.define());
const Dt = "undefined" == typeof Symbol ? "__ͼ" : Symbol.for("ͼ"),
  Ot =
    "undefined" == typeof Symbol
      ? "__styleSet" + Math.floor(1e8 * Math.random())
      : Symbol("styleSet"),
  Tt =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
      ? window
      : {};
class Rt {
  constructor(t, e) {
    this.rules = [];
    let { finish: i } = e || {};
    function n(t) {
      return /^@/.test(t) ? [t] : t.split(/,\s*/);
    }
    function s(t, e, r, o) {
      let l = [],
        h = /^@(\w+)\b/.exec(t[0]),
        a = h && "keyframes" == h[1];
      if (h && null == e) return r.push(t[0] + ";");
      for (let i in e) {
        let o = e[i];
        if (/&/.test(i))
          s(
            i
              .split(/,\s*/)
              .map((e) => t.map((t) => e.replace(/&/, t)))
              .reduce((t, e) => t.concat(e)),
            o,
            r
          );
        else if (o && "object" == typeof o) {
          if (!h)
            throw new RangeError(
              "The value of a property (" + i + ") should be a primitive value."
            );
          s(n(i), o, l, a);
        } else
          null != o &&
            l.push(
              i
                .replace(/_.*/, "")
                .replace(/[A-Z]/g, (t) => "-" + t.toLowerCase()) +
                ": " +
                o +
                ";"
            );
      }
      (l.length || a) &&
        r.push(
          (!i || h || o ? t : t.map(i)).join(", ") + " {" + l.join(" ") + "}"
        );
    }
    for (let e in t) s(n(e), t[e], this.rules);
  }
  getRules() {
    return this.rules.join("\n");
  }
  static newName() {
    let t = Tt[Dt] || 1;
    return (Tt[Dt] = t + 1), "ͼ" + t.toString(36);
  }
  static mount(t, e) {
    (t[Ot] || new Lt(t)).mount(Array.isArray(e) ? e : [e]);
  }
}
let Et = null;
class Lt {
  constructor(t) {
    if (
      !t.head &&
      t.adoptedStyleSheets &&
      "undefined" != typeof CSSStyleSheet
    ) {
      if (Et)
        return (
          (t.adoptedStyleSheets = [Et.sheet].concat(t.adoptedStyleSheets)),
          (t[Ot] = Et)
        );
      (this.sheet = new CSSStyleSheet()),
        (t.adoptedStyleSheets = [this.sheet].concat(t.adoptedStyleSheets)),
        (Et = this);
    } else {
      this.styleTag = (t.ownerDocument || t).createElement("style");
      let e = t.head || t;
      e.insertBefore(this.styleTag, e.firstChild);
    }
    (this.modules = []), (t[Ot] = this);
  }
  mount(t) {
    let e = this.sheet,
      i = 0,
      n = 0;
    for (let s = 0; s < t.length; s++) {
      let r = t[s],
        o = this.modules.indexOf(r);
      if (
        (o < n && o > -1 && (this.modules.splice(o, 1), n--, (o = -1)), -1 == o)
      ) {
        if ((this.modules.splice(n++, 0, r), e))
          for (let t = 0; t < r.rules.length; t++)
            e.insertRule(r.rules[t], i++);
      } else {
        for (; n < o; ) i += this.modules[n++].rules.length;
        (i += r.rules.length), n++;
      }
    }
    if (!e) {
      let t = "";
      for (let e = 0; e < this.modules.length; e++)
        t += this.modules[e].getRules() + "\n";
      this.styleTag.textContent = t;
    }
  }
}
class Bt {
  eq(t) {
    return this == t;
  }
  range(t, e = t) {
    return new Pt(t, e, this);
  }
}
(Bt.prototype.startSide = Bt.prototype.endSide = 0),
  (Bt.prototype.point = !1),
  (Bt.prototype.mapMode = S.TrackDel);
class Pt {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.value = i);
  }
}
function Nt(t, e) {
  return t.from - e.from || t.value.startSide - e.value.startSide;
}
class It {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.value = i), (this.maxPoint = n);
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  findIndex(t, e, i, n = 0) {
    let s = i ? this.to : this.from;
    for (let r = n, o = s.length; ; ) {
      if (r == o) return r;
      let n = (r + o) >> 1,
        l =
          s[n] - t || (i ? this.value[n].endSide : this.value[n].startSide) - e;
      if (n == r) return l >= 0 ? r : o;
      l >= 0 ? (o = n) : (r = n + 1);
    }
  }
  between(t, e, i, n) {
    for (
      let s = this.findIndex(e, -1e9, !0), r = this.findIndex(i, 1e9, !1, s);
      s < r;
      s++
    )
      if (!1 === n(this.from[s] + t, this.to[s] + t, this.value[s])) return !1;
  }
  map(t, e) {
    let i = [],
      n = [],
      s = [],
      r = -1,
      o = -1;
    for (let l = 0; l < this.value.length; l++) {
      let h,
        a,
        c = this.value[l],
        u = this.from[l] + t,
        f = this.to[l] + t;
      if (u == f) {
        let t = e.mapPos(u, c.startSide, c.mapMode);
        if (null == t) continue;
        if (
          ((h = a = t),
          c.startSide != c.endSide && ((a = e.mapPos(u, c.endSide)), a < h))
        )
          continue;
      } else if (
        ((h = e.mapPos(u, c.startSide)),
        (a = e.mapPos(f, c.endSide)),
        h > a || (h == a && c.startSide > 0 && c.endSide <= 0))
      )
        continue;
      (a - h || c.endSide - c.startSide) < 0 ||
        (r < 0 && (r = h),
        c.point && (o = Math.max(o, a - h)),
        i.push(c),
        n.push(h - r),
        s.push(a - r));
    }
    return { mapped: i.length ? new It(n, s, i, o) : null, pos: r };
  }
}
class Vt {
  constructor(t, e, i = Vt.empty, n) {
    (this.chunkPos = t),
      (this.chunk = e),
      (this.nextLayer = i),
      (this.maxPoint = n);
  }
  get length() {
    let t = this.chunk.length - 1;
    return t < 0 ? 0 : Math.max(this.chunkEnd(t), this.nextLayer.length);
  }
  get size() {
    if (this.isEmpty) return 0;
    let t = this.nextLayer.size;
    for (let e of this.chunk) t += e.value.length;
    return t;
  }
  chunkEnd(t) {
    return this.chunkPos[t] + this.chunk[t].length;
  }
  update(t) {
    let {
        add: e = [],
        sort: i = !1,
        filterFrom: n = 0,
        filterTo: s = this.length,
      } = t,
      r = t.filter;
    if (0 == e.length && !r) return this;
    if ((i && (e = e.slice().sort(Nt)), this.isEmpty))
      return e.length ? Vt.of(e) : this;
    let o = new zt(this, null, -1).goto(0),
      l = 0,
      h = [],
      a = new Ht();
    for (; o.value || l < e.length; )
      if (
        l < e.length &&
        (o.from - e[l].from || o.startSide - e[l].value.startSide) >= 0
      ) {
        let t = e[l++];
        a.addInner(t.from, t.to, t.value) || h.push(t);
      } else
        1 == o.rangeIndex &&
        o.chunkIndex < this.chunk.length &&
        (l == e.length || this.chunkEnd(o.chunkIndex) < e[l].from) &&
        (!r ||
          n > this.chunkEnd(o.chunkIndex) ||
          s < this.chunkPos[o.chunkIndex]) &&
        a.addChunk(this.chunkPos[o.chunkIndex], this.chunk[o.chunkIndex])
          ? o.nextChunk()
          : ((!r || n > o.to || s < o.from || r(o.from, o.to, o.value)) &&
              (a.addInner(o.from, o.to, o.value) ||
                h.push(new Pt(o.from, o.to, o.value))),
            o.next());
    return a.finishInner(
      this.nextLayer.isEmpty && !h.length
        ? Vt.empty
        : this.nextLayer.update({
            add: h,
            filter: r,
            filterFrom: n,
            filterTo: s,
          })
    );
  }
  map(t) {
    if (t.empty || this.isEmpty) return this;
    let e = [],
      i = [],
      n = -1;
    for (let s = 0; s < this.chunk.length; s++) {
      let r = this.chunkPos[s],
        o = this.chunk[s],
        l = t.touchesRange(r, r + o.length);
      if (!1 === l)
        (n = Math.max(n, o.maxPoint)), e.push(o), i.push(t.mapPos(r));
      else if (!0 === l) {
        let { mapped: s, pos: l } = o.map(r, t);
        s && ((n = Math.max(n, s.maxPoint)), e.push(s), i.push(l));
      }
    }
    let s = this.nextLayer.map(t);
    return 0 == e.length ? s : new Vt(i, e, s, n);
  }
  between(t, e, i) {
    if (!this.isEmpty) {
      for (let n = 0; n < this.chunk.length; n++) {
        let s = this.chunkPos[n],
          r = this.chunk[n];
        if (e >= s && t <= s + r.length && !1 === r.between(s, t - s, e - s, i))
          return;
      }
      this.nextLayer.between(t, e, i);
    }
  }
  iter(t = 0) {
    return Ft.from([this]).goto(t);
  }
  get isEmpty() {
    return this.nextLayer == this;
  }
  static iter(t, e = 0) {
    return Ft.from(t).goto(e);
  }
  static compare(t, e, i, n, s = -1) {
    let r = t.filter((t) => t.maxPoint > 0 || (!t.isEmpty && t.maxPoint >= s)),
      o = e.filter((t) => t.maxPoint > 0 || (!t.isEmpty && t.maxPoint >= s)),
      l = Wt(r, o, i),
      h = new _t(r, l, s),
      a = new _t(o, l, s);
    i.iterGaps((t, e, i) => jt(h, t, a, e, i, n)),
      i.empty && 0 == i.length && jt(h, 0, a, 0, 0, n);
  }
  static eq(t, e, i = 0, n) {
    null == n && (n = 1e9);
    let s = t.filter((t) => !t.isEmpty && e.indexOf(t) < 0),
      r = e.filter((e) => !e.isEmpty && t.indexOf(e) < 0);
    if (s.length != r.length) return !1;
    if (!s.length) return !0;
    let o = Wt(s, r),
      l = new _t(s, o, 0).goto(i),
      h = new _t(r, o, 0).goto(i);
    for (;;) {
      if (
        l.to != h.to ||
        !Ut(l.active, h.active) ||
        (l.point && (!h.point || !l.point.eq(h.point)))
      )
        return !1;
      if (l.to > n) return !0;
      l.next(), h.next();
    }
  }
  static spans(t, e, i, n, s = -1) {
    var r;
    let o = new _t(
        t,
        null,
        s,
        null === (r = n.filterPoint) || void 0 === r ? void 0 : r.bind(n)
      ).goto(e),
      l = e,
      h = o.openStart;
    for (;;) {
      let t = Math.min(o.to, i);
      if (
        (o.point
          ? (n.point(l, t, o.point, o.activeForPoint(o.to), h),
            (h = o.openEnd(t) + (o.to > t ? 1 : 0)))
          : t > l && (n.span(l, t, o.active, h), (h = o.openEnd(t))),
        o.to > i)
      )
        break;
      (l = o.to), o.next();
    }
    return h;
  }
  static of(t, e = !1) {
    let i = new Ht();
    for (let n of t instanceof Pt
      ? [t]
      : e
      ? (function (t) {
          if (t.length > 1)
            for (let e = t[0], i = 1; i < t.length; i++) {
              let n = t[i];
              if (Nt(e, n) > 0) return t.slice().sort(Nt);
              e = n;
            }
          return t;
        })(t)
      : t)
      i.add(n.from, n.to, n.value);
    return i.finish();
  }
}
(Vt.empty = new Vt([], [], null, -1)), (Vt.empty.nextLayer = Vt.empty);
class Ht {
  constructor() {
    (this.chunks = []),
      (this.chunkPos = []),
      (this.chunkStart = -1),
      (this.last = null),
      (this.lastFrom = -1e9),
      (this.lastTo = -1e9),
      (this.from = []),
      (this.to = []),
      (this.value = []),
      (this.maxPoint = -1),
      (this.setMaxPoint = -1),
      (this.nextLayer = null);
  }
  finishChunk(t) {
    this.chunks.push(new It(this.from, this.to, this.value, this.maxPoint)),
      this.chunkPos.push(this.chunkStart),
      (this.chunkStart = -1),
      (this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint)),
      (this.maxPoint = -1),
      t && ((this.from = []), (this.to = []), (this.value = []));
  }
  add(t, e, i) {
    this.addInner(t, e, i) ||
      (this.nextLayer || (this.nextLayer = new Ht())).add(t, e, i);
  }
  addInner(t, e, i) {
    let n = t - this.lastTo || i.startSide - this.last.endSide;
    if (n <= 0 && (t - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error(
        "Ranges must be added sorted by `from` position and `startSide`"
      );
    return (
      !(n < 0) &&
      (250 == this.from.length && this.finishChunk(!0),
      this.chunkStart < 0 && (this.chunkStart = t),
      this.from.push(t - this.chunkStart),
      this.to.push(e - this.chunkStart),
      (this.last = i),
      (this.lastFrom = t),
      (this.lastTo = e),
      this.value.push(i),
      i.point && (this.maxPoint = Math.max(this.maxPoint, e - t)),
      !0)
    );
  }
  addChunk(t, e) {
    if ((t - this.lastTo || e.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0),
      (this.setMaxPoint = Math.max(this.setMaxPoint, e.maxPoint)),
      this.chunks.push(e),
      this.chunkPos.push(t);
    let i = e.value.length - 1;
    return (
      (this.last = e.value[i]),
      (this.lastFrom = e.from[i] + t),
      (this.lastTo = e.to[i] + t),
      !0
    );
  }
  finish() {
    return this.finishInner(Vt.empty);
  }
  finishInner(t) {
    if ((this.from.length && this.finishChunk(!1), 0 == this.chunks.length))
      return t;
    let e = new Vt(
      this.chunkPos,
      this.chunks,
      this.nextLayer ? this.nextLayer.finishInner(t) : t,
      this.setMaxPoint
    );
    return (this.from = null), e;
  }
}
function Wt(t, e, i) {
  let n = new Map();
  for (let e of t)
    for (let t = 0; t < e.chunk.length; t++)
      e.chunk[t].maxPoint <= 0 && n.set(e.chunk[t], e.chunkPos[t]);
  let s = new Set();
  for (let t of e)
    for (let e = 0; e < t.chunk.length; e++) {
      let r = n.get(t.chunk[e]);
      null == r ||
        (i ? i.mapPos(r) : r) != t.chunkPos[e] ||
        (null == i ? void 0 : i.touchesRange(r, r + t.chunk[e].length)) ||
        s.add(t.chunk[e]);
    }
  return s;
}
class zt {
  constructor(t, e, i, n = 0) {
    (this.layer = t), (this.skip = e), (this.minPoint = i), (this.rank = n);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(t, e = -1e9) {
    return (
      (this.chunkIndex = this.rangeIndex = 0), this.gotoInner(t, e, !1), this
    );
  }
  gotoInner(t, e, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let e = this.layer.chunk[this.chunkIndex];
      if (
        !(
          (this.skip && this.skip.has(e)) ||
          this.layer.chunkEnd(this.chunkIndex) < t ||
          e.maxPoint < this.minPoint
        )
      )
        break;
      this.chunkIndex++, (i = !1);
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let n = this.layer.chunk[this.chunkIndex].findIndex(
        t - this.layer.chunkPos[this.chunkIndex],
        e,
        !0
      );
      (!i || this.rangeIndex < n) && this.setRangeIndex(n);
    }
    this.next();
  }
  forward(t, e) {
    (this.to - t || this.endSide - e) < 0 && this.gotoInner(t, e, !0);
  }
  next() {
    for (;;) {
      if (this.chunkIndex == this.layer.chunk.length) {
        (this.from = this.to = 1e9), (this.value = null);
        break;
      }
      {
        let t = this.layer.chunkPos[this.chunkIndex],
          e = this.layer.chunk[this.chunkIndex],
          i = t + e.from[this.rangeIndex];
        if (
          ((this.from = i),
          (this.to = t + e.to[this.rangeIndex]),
          (this.value = e.value[this.rangeIndex]),
          this.setRangeIndex(this.rangeIndex + 1),
          this.minPoint < 0 ||
            (this.value.point && this.to - this.from >= this.minPoint))
        )
          break;
      }
    }
  }
  setRangeIndex(t) {
    if (t == this.layer.chunk[this.chunkIndex].value.length) {
      if ((this.chunkIndex++, this.skip))
        for (
          ;
          this.chunkIndex < this.layer.chunk.length &&
          this.skip.has(this.layer.chunk[this.chunkIndex]);

        )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else this.rangeIndex = t;
  }
  nextChunk() {
    this.chunkIndex++, (this.rangeIndex = 0), this.next();
  }
  compare(t) {
    return (
      this.from - t.from ||
      this.startSide - t.startSide ||
      this.rank - t.rank ||
      this.to - t.to ||
      this.endSide - t.endSide
    );
  }
}
class Ft {
  constructor(t) {
    this.heap = t;
  }
  static from(t, e = null, i = -1) {
    let n = [];
    for (let s = 0; s < t.length; s++)
      for (let r = t[s]; !r.isEmpty; r = r.nextLayer)
        r.maxPoint >= i && n.push(new zt(r, e, i, s));
    return 1 == n.length ? n[0] : new Ft(n);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(t, e = -1e9) {
    for (let i of this.heap) i.goto(t, e);
    for (let t = this.heap.length >> 1; t >= 0; t--) qt(this.heap, t);
    return this.next(), this;
  }
  forward(t, e) {
    for (let i of this.heap) i.forward(t, e);
    for (let t = this.heap.length >> 1; t >= 0; t--) qt(this.heap, t);
    (this.to - t || this.value.endSide - e) < 0 && this.next();
  }
  next() {
    if (0 == this.heap.length)
      (this.from = this.to = 1e9), (this.value = null), (this.rank = -1);
    else {
      let t = this.heap[0];
      (this.from = t.from),
        (this.to = t.to),
        (this.value = t.value),
        (this.rank = t.rank),
        t.value && t.next(),
        qt(this.heap, 0);
    }
  }
}
function qt(t, e) {
  for (let i = t[e]; ; ) {
    let n = 1 + (e << 1);
    if (n >= t.length) break;
    let s = t[n];
    if (
      (n + 1 < t.length && s.compare(t[n + 1]) >= 0 && ((s = t[n + 1]), n++),
      i.compare(s) < 0)
    )
      break;
    (t[n] = i), (t[e] = s), (e = n);
  }
}
class _t {
  constructor(t, e, i, n = () => !0) {
    (this.minPoint = i),
      (this.filterPoint = n),
      (this.active = []),
      (this.activeTo = []),
      (this.activeRank = []),
      (this.minActive = -1),
      (this.point = null),
      (this.pointFrom = 0),
      (this.pointRank = 0),
      (this.to = -1e9),
      (this.endSide = 0),
      (this.openStart = -1),
      (this.cursor = Ft.from(t, e, i));
  }
  goto(t, e = -1e9) {
    return (
      this.cursor.goto(t, e),
      (this.active.length = this.activeTo.length = this.activeRank.length = 0),
      (this.minActive = -1),
      (this.to = t),
      (this.endSide = e),
      (this.openStart = -1),
      this.next(),
      this
    );
  }
  forward(t, e) {
    for (
      ;
      this.minActive > -1 &&
      (this.activeTo[this.minActive] - t ||
        this.active[this.minActive].endSide - e) < 0;

    )
      this.removeActive(this.minActive);
    this.cursor.forward(t, e);
  }
  removeActive(t) {
    $t(this.active, t),
      $t(this.activeTo, t),
      $t(this.activeRank, t),
      (this.minActive = Gt(this.active, this.activeTo));
  }
  addActive(t) {
    let e = 0,
      { value: i, to: n, rank: s } = this.cursor;
    for (; e < this.activeRank.length && this.activeRank[e] <= s; ) e++;
    Kt(this.active, e, i),
      Kt(this.activeTo, e, n),
      Kt(this.activeRank, e, s),
      t && Kt(t, e, this.cursor.from),
      (this.minActive = Gt(this.active, this.activeTo));
  }
  next() {
    let t = this.to,
      e = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null,
      n = 0;
    for (;;) {
      let s = this.minActive;
      if (
        s > -1 &&
        (this.activeTo[s] - this.cursor.from ||
          this.active[s].endSide - this.cursor.startSide) < 0
      ) {
        if (this.activeTo[s] > t) {
          (this.to = this.activeTo[s]), (this.endSide = this.active[s].endSide);
          break;
        }
        this.removeActive(s), i && $t(i, s);
      } else {
        if (!this.cursor.value) {
          this.to = this.endSide = 1e9;
          break;
        }
        if (this.cursor.from > t) {
          (this.to = this.cursor.from), (this.endSide = this.cursor.startSide);
          break;
        }
        {
          let s = this.cursor.value;
          if (s.point)
            if (
              e &&
              this.cursor.to == this.to &&
              this.cursor.from < this.cursor.to
            )
              this.cursor.next();
            else {
              if (
                this.filterPoint(
                  this.cursor.from,
                  this.cursor.to,
                  this.cursor.value,
                  this.cursor.rank
                )
              ) {
                (this.point = s),
                  (this.pointFrom = this.cursor.from),
                  (this.pointRank = this.cursor.rank),
                  (this.to = this.cursor.to),
                  (this.endSide = s.endSide),
                  this.cursor.from < t && (n = 1),
                  this.cursor.next(),
                  this.forward(this.to, this.endSide);
                break;
              }
              this.cursor.next();
            }
          else this.addActive(i), this.cursor.next();
        }
      }
    }
    if (i) {
      let e = 0;
      for (; e < i.length && i[e] < t; ) e++;
      this.openStart = e + n;
    }
  }
  activeForPoint(t) {
    if (!this.active.length) return this.active;
    let e = [];
    for (
      let i = this.active.length - 1;
      i >= 0 && !(this.activeRank[i] < this.pointRank);
      i--
    )
      (this.activeTo[i] > t ||
        (this.activeTo[i] == t &&
          this.active[i].endSide >= this.point.endSide)) &&
        e.push(this.active[i]);
    return e.reverse();
  }
  openEnd(t) {
    let e = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > t; i--)
      e++;
    return e;
  }
}
function jt(t, e, i, n, s, r) {
  t.goto(e), i.goto(n);
  let o = n + s,
    l = n,
    h = n - e;
  for (;;) {
    let e = t.to + h - i.to || t.endSide - i.endSide,
      n = e < 0 ? t.to + h : i.to,
      s = Math.min(n, o);
    if (
      (t.point || i.point
        ? (t.point &&
            i.point &&
            (t.point == i.point || t.point.eq(i.point)) &&
            Ut(t.activeForPoint(t.to + h), i.activeForPoint(i.to))) ||
          r.comparePoint(l, s, t.point, i.point)
        : s > l &&
          !Ut(t.active, i.active) &&
          r.compareRange(l, s, t.active, i.active),
      n > o)
    )
      break;
    (l = n), e <= 0 && t.next(), e >= 0 && i.next();
  }
}
function Ut(t, e) {
  if (t.length != e.length) return !1;
  for (let i = 0; i < t.length; i++)
    if (t[i] != e[i] && !t[i].eq(e[i])) return !1;
  return !0;
}
function $t(t, e) {
  for (let i = e, n = t.length - 1; i < n; i++) t[i] = t[i + 1];
  t.pop();
}
function Kt(t, e, i) {
  for (let i = t.length - 1; i >= e; i--) t[i + 1] = t[i];
  t[e] = i;
}
function Gt(t, e) {
  let i = -1,
    n = 1e9;
  for (let s = 0; s < e.length; s++)
    (e[s] - n || t[s].endSide - t[i].endSide) < 0 && ((i = s), (n = e[s]));
  return i;
}
var Jt = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  },
  Yt = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
  },
  Xt =
    "undefined" != typeof navigator &&
    /Chrome\/(\d+)/.exec(navigator.userAgent);
"undefined" != typeof navigator && /Gecko\/\d+/.test(navigator.userAgent);
for (
  var Qt = "undefined" != typeof navigator && /Mac/.test(navigator.platform),
    Zt =
      "undefined" != typeof navigator &&
      /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),
    te = Qt || (Xt && +Xt[1] < 57),
    ee = 0;
  ee < 10;
  ee++
)
  Jt[48 + ee] = Jt[96 + ee] = String(ee);
for (ee = 1; ee <= 24; ee++) Jt[ee + 111] = "F" + ee;
for (ee = 65; ee <= 90; ee++)
  (Jt[ee] = String.fromCharCode(ee + 32)), (Yt[ee] = String.fromCharCode(ee));
for (var ie in Jt) Yt.hasOwnProperty(ie) || (Yt[ie] = Jt[ie]);
function ne(t) {
  let e;
  return (
    (e = 11 == t.nodeType ? (t.getSelection ? t : t.ownerDocument) : t),
    e.getSelection()
  );
}
function se(t, e) {
  return !!e && (t == e || t.contains(1 != e.nodeType ? e.parentNode : e));
}
function re(t, e) {
  if (!e.anchorNode) return !1;
  try {
    return se(t, e.anchorNode);
  } catch (t) {
    return !1;
  }
}
function oe(t) {
  return 3 == t.nodeType
    ? we(t, 0, t.nodeValue.length).getClientRects()
    : 1 == t.nodeType
    ? t.getClientRects()
    : [];
}
function le(t, e, i, n) {
  return !!i && (ae(t, e, i, n, -1) || ae(t, e, i, n, 1));
}
function he(t) {
  for (var e = 0; ; e++) if (!(t = t.previousSibling)) return e;
}
function ae(t, e, i, n, s) {
  for (;;) {
    if (t == i && e == n) return !0;
    if (e == (s < 0 ? 0 : ce(t))) {
      if ("DIV" == t.nodeName) return !1;
      let i = t.parentNode;
      if (!i || 1 != i.nodeType) return !1;
      (e = he(t) + (s < 0 ? 0 : 1)), (t = i);
    } else {
      if (1 != t.nodeType) return !1;
      if (
        1 == (t = t.childNodes[e + (s < 0 ? -1 : 0)]).nodeType &&
        "false" == t.contentEditable
      )
        return !1;
      e = s < 0 ? ce(t) : 0;
    }
  }
}
function ce(t) {
  return 3 == t.nodeType ? t.nodeValue.length : t.childNodes.length;
}
const ue = { left: 0, right: 0, top: 0, bottom: 0 };
function fe(t, e) {
  let i = e ? t.left : t.right;
  return { left: i, right: i, top: t.top, bottom: t.bottom };
}
function de(t) {
  return { left: 0, right: t.innerWidth, top: 0, bottom: t.innerHeight };
}
class pe {
  constructor() {
    (this.anchorNode = null),
      (this.anchorOffset = 0),
      (this.focusNode = null),
      (this.focusOffset = 0);
  }
  eq(t) {
    return (
      this.anchorNode == t.anchorNode &&
      this.anchorOffset == t.anchorOffset &&
      this.focusNode == t.focusNode &&
      this.focusOffset == t.focusOffset
    );
  }
  setRange(t) {
    this.set(t.anchorNode, t.anchorOffset, t.focusNode, t.focusOffset);
  }
  set(t, e, i, n) {
    (this.anchorNode = t),
      (this.anchorOffset = e),
      (this.focusNode = i),
      (this.focusOffset = n);
  }
}
let me,
  ge = null;
function ve(t) {
  if (t.setActive) return t.setActive();
  if (ge) return t.focus(ge);
  let e = [];
  for (
    let i = t;
    i && (e.push(i, i.scrollTop, i.scrollLeft), i != i.ownerDocument);
    i = i.parentNode
  );
  if (
    (t.focus(
      null == ge
        ? {
            get preventScroll() {
              return (ge = { preventScroll: !0 }), !0;
            },
          }
        : void 0
    ),
    !ge)
  ) {
    ge = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++],
        n = e[t++],
        s = e[t++];
      i.scrollTop != n && (i.scrollTop = n),
        i.scrollLeft != s && (i.scrollLeft = s);
    }
  }
}
function we(t, e, i = e) {
  let n = me || (me = document.createRange());
  return n.setEnd(t, i), n.setStart(t, e), n;
}
function ye(t, e, i) {
  let n = { key: e, code: e, keyCode: i, which: i, cancelable: !0 },
    s = new KeyboardEvent("keydown", n);
  (s.synthetic = !0), t.dispatchEvent(s);
  let r = new KeyboardEvent("keyup", n);
  return (
    (r.synthetic = !0),
    t.dispatchEvent(r),
    s.defaultPrevented || r.defaultPrevented
  );
}
function be(t) {
  for (; t.attributes.length; ) t.removeAttributeNode(t.attributes[0]);
}
class xe {
  constructor(t, e, i = !0) {
    (this.node = t), (this.offset = e), (this.precise = i);
  }
  static before(t, e) {
    return new xe(t.parentNode, he(t), e);
  }
  static after(t, e) {
    return new xe(t.parentNode, he(t) + 1, e);
  }
}
const ke = [];
class Se {
  constructor() {
    (this.parent = null), (this.dom = null), (this.dirty = 2);
  }
  get editorView() {
    if (!this.parent) throw new Error("Accessing view in orphan content view");
    return this.parent.editorView;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(t) {
    let e = this.posAtStart;
    for (let i of this.children) {
      if (i == t) return e;
      e += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(t) {
    return this.posBefore(t) + t.length;
  }
  coordsAt(t, e) {
    return null;
  }
  sync(t) {
    if (2 & this.dirty) {
      let e,
        i = this.dom,
        n = null;
      for (let s of this.children) {
        if (s.dirty) {
          if (!s.dom && (e = n ? n.nextSibling : i.firstChild)) {
            let t = Se.get(e);
            (t && (t.parent || t.constructor != s.constructor)) ||
              s.reuseDOM(e);
          }
          s.sync(t), (s.dirty = 0);
        }
        if (
          ((e = n ? n.nextSibling : i.firstChild),
          t && !t.written && t.node == i && e != s.dom && (t.written = !0),
          s.dom.parentNode == i)
        )
          for (; e && e != s.dom; ) e = Ae(e);
        else i.insertBefore(s.dom, e);
        n = s.dom;
      }
      for (
        e = n ? n.nextSibling : i.firstChild,
          e && t && t.node == i && (t.written = !0);
        e;

      )
        e = Ae(e);
    } else if (1 & this.dirty)
      for (let e of this.children) e.dirty && (e.sync(t), (e.dirty = 0));
  }
  reuseDOM(t) {}
  localPosFromDOM(t, e) {
    let i;
    if (t == this.dom) i = this.dom.childNodes[e];
    else {
      let n = 0 == ce(t) ? 0 : 0 == e ? -1 : 1;
      for (;;) {
        let e = t.parentNode;
        if (e == this.dom) break;
        0 == n &&
          e.firstChild != e.lastChild &&
          (n = t == e.firstChild ? -1 : 1),
          (t = e);
      }
      i = n < 0 ? t : t.nextSibling;
    }
    if (i == this.dom.firstChild) return 0;
    for (; i && !Se.get(i); ) i = i.nextSibling;
    if (!i) return this.length;
    for (let t = 0, e = 0; ; t++) {
      let n = this.children[t];
      if (n.dom == i) return e;
      e += n.length + n.breakAfter;
    }
  }
  domBoundsAround(t, e, i = 0) {
    let n = -1,
      s = -1,
      r = -1,
      o = -1;
    for (let l = 0, h = i, a = i; l < this.children.length; l++) {
      let i = this.children[l],
        c = h + i.length;
      if (h < t && c > e) return i.domBoundsAround(t, e, h);
      if (
        (c >= t && -1 == n && ((n = l), (s = h)),
        h > e && i.dom.parentNode == this.dom)
      ) {
        (r = l), (o = a);
        break;
      }
      (a = c), (h = c + i.breakAfter);
    }
    return {
      from: s,
      to: o < 0 ? i + this.length : o,
      startDOM:
        (n ? this.children[n - 1].dom.nextSibling : null) ||
        this.dom.firstChild,
      endDOM: r < this.children.length && r >= 0 ? this.children[r].dom : null,
    };
  }
  markDirty(t = !1) {
    (this.dirty |= 2), this.markParentsDirty(t);
  }
  markParentsDirty(t) {
    for (let e = this.parent; e; e = e.parent) {
      if ((t && (e.dirty |= 2), 1 & e.dirty)) return;
      (e.dirty |= 1), (t = !1);
    }
  }
  setParent(t) {
    this.parent != t &&
      ((this.parent = t), this.dirty && this.markParentsDirty(!0));
  }
  setDOM(t) {
    this.dom && (this.dom.cmView = null), (this.dom = t), (t.cmView = this);
  }
  get rootView() {
    for (let t = this; ; ) {
      let e = t.parent;
      if (!e) return t;
      t = e;
    }
  }
  replaceChildren(t, e, i = ke) {
    this.markDirty();
    for (let i = t; i < e; i++) {
      let t = this.children[i];
      t.parent == this && t.destroy();
    }
    this.children.splice(t, e - t, ...i);
    for (let t = 0; t < i.length; t++) i[t].setParent(this);
  }
  ignoreMutation(t) {
    return !1;
  }
  ignoreEvent(t) {
    return !1;
  }
  childCursor(t = this.length) {
    return new Ce(this.children, t, this.children.length);
  }
  childPos(t, e = 1) {
    return this.childCursor().findPos(t, e);
  }
  toString() {
    let t = this.constructor.name.replace("View", "");
    return (
      t +
      (this.children.length
        ? "(" + this.children.join() + ")"
        : this.length
        ? "[" + ("Text" == t ? this.text : this.length) + "]"
        : "") +
      (this.breakAfter ? "#" : "")
    );
  }
  static get(t) {
    return t.cmView;
  }
  get isEditable() {
    return !0;
  }
  merge(t, e, i, n, s, r) {
    return !1;
  }
  become(t) {
    return !1;
  }
  getSide() {
    return 0;
  }
  destroy() {
    this.parent = null;
  }
}
function Ae(t) {
  let e = t.nextSibling;
  return t.parentNode.removeChild(t), e;
}
Se.prototype.breakAfter = 0;
class Ce {
  constructor(t, e, i) {
    (this.children = t), (this.pos = e), (this.i = i), (this.off = 0);
  }
  findPos(t, e = 1) {
    for (;;) {
      if (
        t > this.pos ||
        (t == this.pos &&
          (e > 0 || 0 == this.i || this.children[this.i - 1].breakAfter))
      )
        return (this.off = t - this.pos), this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function Me(t, e, i, n, s, r, o, l, h) {
  let { children: a } = t,
    c = a.length ? a[e] : null,
    u = r.length ? r[r.length - 1] : null,
    f = u ? u.breakAfter : o;
  if (
    !(
      e == n &&
      c &&
      !o &&
      !f &&
      r.length < 2 &&
      c.merge(i, s, r.length ? u : null, 0 == i, l, h)
    )
  ) {
    if (n < a.length) {
      let t = a[n];
      t && s < t.length
        ? (e == n && ((t = t.split(s)), (s = 0)),
          !f && u && t.merge(0, s, u, !0, 0, h)
            ? (r[r.length - 1] = t)
            : (s && t.merge(0, s, null, !1, 0, h), r.push(t)))
        : (null == t ? void 0 : t.breakAfter) &&
          (u ? (u.breakAfter = 1) : (o = 1)),
        n++;
    }
    for (
      c &&
      ((c.breakAfter = o),
      i > 0 &&
        (!o && r.length && c.merge(i, c.length, r[0], !1, l, 0)
          ? (c.breakAfter = r.shift().breakAfter)
          : (i < c.length ||
              (c.children.length &&
                0 == c.children[c.children.length - 1].length)) &&
            c.merge(i, c.length, null, !1, l, 0),
        e++));
      e < n && r.length;

    )
      if (a[n - 1].become(r[r.length - 1]))
        n--, r.pop(), (h = r.length ? 0 : l);
      else {
        if (!a[e].become(r[0])) break;
        e++, r.shift(), (l = r.length ? 0 : h);
      }
    !r.length &&
      e &&
      n < a.length &&
      !a[e - 1].breakAfter &&
      a[n].merge(0, 0, a[e - 1], !1, l, h) &&
      e--,
      (e < n || r.length) && t.replaceChildren(e, n, r);
  }
}
function De(t, e, i, n, s, r) {
  let o = t.childCursor(),
    { i: l, off: h } = o.findPos(i, 1),
    { i: a, off: c } = o.findPos(e, -1),
    u = e - i;
  for (let t of n) u += t.length;
  (t.length += u), Me(t, a, c, l, h, n, 0, s, r);
}
let Oe =
    "undefined" != typeof navigator
      ? navigator
      : { userAgent: "", vendor: "", platform: "" },
  Te =
    "undefined" != typeof document
      ? document
      : { documentElement: { style: {} } };
const Re = /Edge\/(\d+)/.exec(Oe.userAgent),
  Ee = /MSIE \d/.test(Oe.userAgent),
  Le = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Oe.userAgent),
  Be = !!(Ee || Le || Re),
  Pe = !Be && /gecko\/(\d+)/i.test(Oe.userAgent),
  Ne = !Be && /Chrome\/(\d+)/.exec(Oe.userAgent),
  Ie = "webkitFontSmoothing" in Te.documentElement.style,
  Ve = !Be && /Apple Computer/.test(Oe.vendor),
  He = Ve && (/Mobile\/\w+/.test(Oe.userAgent) || Oe.maxTouchPoints > 2);
var We = {
  mac: He || /Mac/.test(Oe.platform),
  windows: /Win/.test(Oe.platform),
  linux: /Linux|X11/.test(Oe.platform),
  ie: Be,
  ie_version: Ee ? Te.documentMode || 6 : Le ? +Le[1] : Re ? +Re[1] : 0,
  gecko: Pe,
  gecko_version: Pe ? +(/Firefox\/(\d+)/.exec(Oe.userAgent) || [0, 0])[1] : 0,
  chrome: !!Ne,
  chrome_version: Ne ? +Ne[1] : 0,
  ios: He,
  android: /Android\b/.test(Oe.userAgent),
  webkit: Ie,
  safari: Ve,
  webkit_version: Ie
    ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1]
    : 0,
  tabSize:
    null != Te.documentElement.style.tabSize ? "tab-size" : "-moz-tab-size",
};
class ze extends Se {
  constructor(t) {
    super(), (this.text = t);
  }
  get length() {
    return this.text.length;
  }
  createDOM(t) {
    this.setDOM(t || document.createTextNode(this.text));
  }
  sync(t) {
    this.dom || this.createDOM(),
      this.dom.nodeValue != this.text &&
        (t && t.node == this.dom && (t.written = !0),
        (this.dom.nodeValue = this.text));
  }
  reuseDOM(t) {
    3 == t.nodeType && this.createDOM(t);
  }
  merge(t, e, i) {
    return (
      (!i || (i instanceof ze && !(this.length - (e - t) + i.length > 256))) &&
      ((this.text =
        this.text.slice(0, t) + (i ? i.text : "") + this.text.slice(e)),
      this.markDirty(),
      !0)
    );
  }
  split(t) {
    let e = new ze(this.text.slice(t));
    return (this.text = this.text.slice(0, t)), this.markDirty(), e;
  }
  localPosFromDOM(t, e) {
    return t == this.dom ? e : e ? this.text.length : 0;
  }
  domAtPos(t) {
    return new xe(this.dom, t);
  }
  domBoundsAround(t, e, i) {
    return {
      from: i,
      to: i + this.length,
      startDOM: this.dom,
      endDOM: this.dom.nextSibling,
    };
  }
  coordsAt(t, e) {
    return qe(this.dom, t, e);
  }
}
class Fe extends Se {
  constructor(t, e = [], i = 0) {
    super(), (this.mark = t), (this.children = e), (this.length = i);
    for (let t of e) t.setParent(this);
  }
  setAttrs(t) {
    if (
      (be(t),
      this.mark.class && (t.className = this.mark.class),
      this.mark.attrs)
    )
      for (let e in this.mark.attrs) t.setAttribute(e, this.mark.attrs[e]);
    return t;
  }
  reuseDOM(t) {
    t.nodeName == this.mark.tagName.toUpperCase() &&
      (this.setDOM(t), (this.dirty |= 6));
  }
  sync(t) {
    this.dom
      ? 4 & this.dirty && this.setAttrs(this.dom)
      : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))),
      super.sync(t);
  }
  merge(t, e, i, n, s, r) {
    return (
      (!i ||
        !(
          !(i instanceof Fe && i.mark.eq(this.mark)) ||
          (t && s <= 0) ||
          (e < this.length && r <= 0)
        )) &&
      (De(this, t, e, i ? i.children : [], s - 1, r - 1), this.markDirty(), !0)
    );
  }
  split(t) {
    let e = [],
      i = 0,
      n = -1,
      s = 0;
    for (let r of this.children) {
      let o = i + r.length;
      o > t && e.push(i < t ? r.split(t - i) : r),
        n < 0 && i >= t && (n = s),
        (i = o),
        s++;
    }
    let r = this.length - t;
    return (
      (this.length = t),
      n > -1 && ((this.children.length = n), this.markDirty()),
      new Fe(this.mark, e, r)
    );
  }
  domAtPos(t) {
    return Ge(this.dom, this.children, t);
  }
  coordsAt(t, e) {
    return Ye(this, t, e);
  }
}
function qe(t, e, i) {
  let n = t.nodeValue.length;
  e > n && (e = n);
  let s = e,
    r = e,
    o = 0;
  (0 == e && i < 0) || (e == n && i >= 0)
    ? We.chrome || We.gecko || (e ? (s--, (o = 1)) : (r++, (o = -1)))
    : i < 0
    ? s--
    : r++;
  let l = we(t, s, r).getClientRects();
  if (!l.length) return ue;
  let h = l[(o ? o < 0 : i >= 0) ? 0 : l.length - 1];
  return (
    We.safari &&
      !o &&
      0 == h.width &&
      (h = Array.prototype.find.call(l, (t) => t.width) || h),
    o ? fe(h, o < 0) : h || null
  );
}
class _e extends Se {
  constructor(t, e, i) {
    super(),
      (this.widget = t),
      (this.length = e),
      (this.side = i),
      (this.prevWidget = null);
  }
  static create(t, e, i) {
    return new (t.customView || _e)(t, e, i);
  }
  split(t) {
    let e = _e.create(this.widget, this.length - t, this.side);
    return (this.length -= t), e;
  }
  sync() {
    (this.dom && this.widget.updateDOM(this.dom)) ||
      (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
      (this.prevWidget = null),
      this.setDOM(this.widget.toDOM(this.editorView)),
      (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(t, e, i, n, s, r) {
    return (
      !(
        i &&
        (!(i instanceof _e && this.widget.compare(i.widget)) ||
          (t > 0 && s <= 0) ||
          (e < this.length && r <= 0))
      ) && ((this.length = t + (i ? i.length : 0) + (this.length - e)), !0)
    );
  }
  become(t) {
    return (
      t.length == this.length &&
      t instanceof _e &&
      t.side == this.side &&
      this.widget.constructor == t.widget.constructor &&
      (this.widget.eq(t.widget) || this.markDirty(!0),
      this.dom && !this.prevWidget && (this.prevWidget = this.widget),
      (this.widget = t.widget),
      !0)
    );
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  get overrideDOMText() {
    if (0 == this.length) return d.empty;
    let t = this;
    for (; t.parent; ) t = t.parent;
    let e = t.editorView,
      i = e && e.state.doc,
      n = this.posAtStart;
    return i ? i.slice(n, n + this.length) : d.empty;
  }
  domAtPos(t) {
    return 0 == t ? xe.before(this.dom) : xe.after(this.dom, t == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t, e) {
    let i = this.dom.getClientRects(),
      n = null;
    if (!i.length) return ue;
    for (
      let e = t > 0 ? i.length - 1 : 0;
      (n = i[e]), !(t > 0 ? 0 == e : e == i.length - 1 || n.top < n.bottom);
      e += t > 0 ? -1 : 1
    );
    return (0 == t && e > 0) || (t == this.length && e <= 0)
      ? n
      : fe(n, 0 == t);
  }
  get isEditable() {
    return !1;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class je extends _e {
  domAtPos(t) {
    let { topView: e, text: i } = this.widget;
    return e
      ? Ue(
          t,
          0,
          e,
          i,
          (t, e) => t.domAtPos(e),
          (t) => new xe(i, Math.min(t, i.nodeValue.length))
        )
      : new xe(i, Math.min(t, i.nodeValue.length));
  }
  sync() {
    this.setDOM(this.widget.toDOM());
  }
  localPosFromDOM(t, e) {
    let { topView: i, text: n } = this.widget;
    return i ? $e(t, e, i, n) : Math.min(e, this.length);
  }
  ignoreMutation() {
    return !1;
  }
  get overrideDOMText() {
    return null;
  }
  coordsAt(t, e) {
    let { topView: i, text: n } = this.widget;
    return i
      ? Ue(
          t,
          e,
          i,
          n,
          (t, e, i) => t.coordsAt(e, i),
          (t, e) => qe(n, t, e)
        )
      : qe(n, t, e);
  }
  destroy() {
    var t;
    super.destroy(),
      null === (t = this.widget.topView) || void 0 === t || t.destroy();
  }
  get isEditable() {
    return !0;
  }
}
function Ue(t, e, i, n, s, r) {
  if (i instanceof Fe) {
    for (let o of i.children) {
      let i = se(o.dom, n),
        l = i ? n.nodeValue.length : o.length;
      if (t < l || (t == l && o.getSide() <= 0))
        return i ? Ue(t, e, o, n, s, r) : s(o, t, e);
      t -= l;
    }
    return s(i, i.length, -1);
  }
  return i.dom == n ? r(t, e) : s(i, t, e);
}
function $e(t, e, i, n) {
  if (i instanceof Fe)
    for (let s of i.children) {
      let i = 0,
        r = se(s.dom, n);
      if (se(s.dom, t))
        return i + (r ? $e(t, e, s, n) : s.localPosFromDOM(t, e));
      i += r ? n.nodeValue.length : s.length;
    }
  else if (i.dom == n) return Math.min(e, n.nodeValue.length);
  return i.localPosFromDOM(t, e);
}
class Ke extends Se {
  constructor(t) {
    super(), (this.side = t);
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(t) {
    return t instanceof Ke && t.side == this.side;
  }
  split() {
    return new Ke(this.side);
  }
  sync() {
    if (!this.dom) {
      let t = document.createElement("img");
      (t.className = "cm-widgetBuffer"),
        t.setAttribute("aria-hidden", "true"),
        this.setDOM(t);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(t) {
    return xe.before(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t) {
    let e = this.dom.getBoundingClientRect(),
      i = (function (t, e) {
        let i = t.parent,
          n = i ? i.children.indexOf(t) : -1;
        for (; i && n >= 0; )
          if (e < 0 ? n > 0 : n < i.children.length) {
            let t = i.children[n + e];
            if (t instanceof ze) {
              let i = t.coordsAt(e < 0 ? t.length : 0, e);
              if (i) return i;
            }
            n += e;
          } else {
            if (!(i instanceof Fe && i.parent)) {
              let t = i.dom.lastChild;
              if (t && "BR" == t.nodeName) return t.getClientRects()[0];
              break;
            }
            (n = i.parent.children.indexOf(i) + (e < 0 ? 0 : 1)),
              (i = i.parent);
          }
        return;
      })(this, this.side > 0 ? -1 : 1);
    return i && i.top < e.bottom && i.bottom > e.top
      ? { left: e.left, right: e.right, top: i.top, bottom: i.bottom }
      : e;
  }
  get overrideDOMText() {
    return d.empty;
  }
}
function Ge(t, e, i) {
  let n = 0;
  for (let s = 0; n < e.length; n++) {
    let r = e[n],
      o = s + r.length;
    if (!(o == s && r.getSide() <= 0)) {
      if (i > s && i < o && r.dom.parentNode == t) return r.domAtPos(i - s);
      if (i <= s) break;
      s = o;
    }
  }
  for (; n > 0; n--) {
    let i = e[n - 1].dom;
    if (i.parentNode == t) return xe.after(i);
  }
  return new xe(t, 0);
}
function Je(t, e, i) {
  let n,
    { children: s } = t;
  i > 0 &&
  e instanceof Fe &&
  s.length &&
  (n = s[s.length - 1]) instanceof Fe &&
  n.mark.eq(e.mark)
    ? Je(n, e.children[0], i - 1)
    : (s.push(e), e.setParent(t)),
    (t.length += e.length);
}
function Ye(t, e, i) {
  for (let n = 0, s = 0; s < t.children.length; s++) {
    let r,
      o = t.children[s],
      l = n + o.length;
    if (
      (i <= 0 || l == t.length || o.getSide() > 0 ? l >= e : l > e) &&
      (e < l ||
        s + 1 == t.children.length ||
        (r = t.children[s + 1]).length ||
        r.getSide() > 0)
    ) {
      let t = 0;
      if (l == n) {
        if (o.getSide() <= 0) continue;
        t = i = -o.getSide();
      }
      let s = o.coordsAt(Math.max(0, e - n), i);
      return t && s ? fe(s, i < 0) : s;
    }
    n = l;
  }
  let n = t.dom.lastChild;
  if (!n) return t.dom.getBoundingClientRect();
  let s = oe(n);
  return s[s.length - 1] || null;
}
function Xe(t, e) {
  for (let i in t)
    "class" == i && e.class
      ? (e.class += " " + t.class)
      : "style" == i && e.style
      ? (e.style += ";" + t.style)
      : (e[i] = t[i]);
  return e;
}
function Qe(t, e) {
  if (t == e) return !0;
  if (!t || !e) return !1;
  let i = Object.keys(t),
    n = Object.keys(e);
  if (i.length != n.length) return !1;
  for (let s of i) if (-1 == n.indexOf(s) || t[s] !== e[s]) return !1;
  return !0;
}
function Ze(t, e, i) {
  if (e) for (let n in e) (i && n in i) || t.removeAttribute(n);
  if (i) for (let n in i) (e && e[n] == i[n]) || t.setAttribute(n, i[n]);
}
ze.prototype.children = _e.prototype.children = Ke.prototype.children = ke;
class ti {
  eq(t) {
    return !1;
  }
  updateDOM(t) {
    return !1;
  }
  compare(t) {
    return this == t || (this.constructor == t.constructor && this.eq(t));
  }
  get estimatedHeight() {
    return -1;
  }
  ignoreEvent(t) {
    return !0;
  }
  get customView() {
    return null;
  }
  destroy(t) {}
}
var ei = (function (t) {
  return (
    (t[(t.Text = 0)] = "Text"),
    (t[(t.WidgetBefore = 1)] = "WidgetBefore"),
    (t[(t.WidgetAfter = 2)] = "WidgetAfter"),
    (t[(t.WidgetRange = 3)] = "WidgetRange"),
    t
  );
})(ei || (ei = {}));
class ii extends Bt {
  constructor(t, e, i, n) {
    super(),
      (this.startSide = t),
      (this.endSide = e),
      (this.widget = i),
      (this.spec = n);
  }
  get heightRelevant() {
    return !1;
  }
  static mark(t) {
    return new ni(t);
  }
  static widget(t) {
    let e = t.side || 0,
      i = !!t.block;
    return (
      (e += i ? (e > 0 ? 3e8 : -4e8) : e > 0 ? 1e8 : -1e8),
      new ri(t, e, e, i, t.widget || null, !1)
    );
  }
  static replace(t) {
    let e,
      i,
      n = !!t.block;
    if (t.isBlockGap) (e = -5e8), (i = 4e8);
    else {
      let { start: s, end: r } = oi(t, n);
      (e = (s ? (n ? -3e8 : -1) : 5e8) - 1),
        (i = 1 + (r ? (n ? 2e8 : 1) : -6e8));
    }
    return new ri(t, e, i, n, t.widget || null, !0);
  }
  static line(t) {
    return new si(t);
  }
  static set(t, e = !1) {
    return Vt.of(t, e);
  }
  hasHeight() {
    return !!this.widget && this.widget.estimatedHeight > -1;
  }
}
ii.none = Vt.empty;
class ni extends ii {
  constructor(t) {
    let { start: e, end: i } = oi(t);
    super(e ? -1 : 5e8, i ? 1 : -6e8, null, t),
      (this.tagName = t.tagName || "span"),
      (this.class = t.class || ""),
      (this.attrs = t.attributes || null);
  }
  eq(t) {
    return (
      this == t ||
      (t instanceof ni &&
        this.tagName == t.tagName &&
        this.class == t.class &&
        Qe(this.attrs, t.attrs))
    );
  }
  range(t, e = t) {
    if (t >= e) throw new RangeError("Mark decorations may not be empty");
    return super.range(t, e);
  }
}
ni.prototype.point = !1;
class si extends ii {
  constructor(t) {
    super(-2e8, -2e8, null, t);
  }
  eq(t) {
    return t instanceof si && Qe(this.spec.attributes, t.spec.attributes);
  }
  range(t, e = t) {
    if (e != t)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(t, e);
  }
}
(si.prototype.mapMode = S.TrackBefore), (si.prototype.point = !0);
class ri extends ii {
  constructor(t, e, i, n, s, r) {
    super(e, i, s, t),
      (this.block = n),
      (this.isReplace = r),
      (this.mapMode = n ? (e <= 0 ? S.TrackBefore : S.TrackAfter) : S.TrackDel);
  }
  get type() {
    return this.startSide < this.endSide
      ? ei.WidgetRange
      : this.startSide <= 0
      ? ei.WidgetBefore
      : ei.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || (!!this.widget && this.widget.estimatedHeight >= 5);
  }
  eq(t) {
    return (
      t instanceof ri &&
      ((e = this.widget),
      (i = t.widget),
      e == i || !!(e && i && e.compare(i))) &&
      this.block == t.block &&
      this.startSide == t.startSide &&
      this.endSide == t.endSide
    );
    var e, i;
  }
  range(t, e = t) {
    if (
      this.isReplace &&
      (t > e || (t == e && this.startSide > 0 && this.endSide <= 0))
    )
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && e != t)
      throw new RangeError(
        "Widget decorations can only have zero-length ranges"
      );
    return super.range(t, e);
  }
}
function oi(t, e = !1) {
  let { inclusiveStart: i, inclusiveEnd: n } = t;
  return (
    null == i && (i = t.inclusive),
    null == n && (n = t.inclusive),
    { start: null != i ? i : e, end: null != n ? n : e }
  );
}
function li(t, e, i, n = 0) {
  let s = i.length - 1;
  s >= 0 && i[s] + n >= t ? (i[s] = Math.max(i[s], e)) : i.push(t, e);
}
ri.prototype.point = !0;
class hi extends Se {
  constructor() {
    super(...arguments),
      (this.children = []),
      (this.length = 0),
      (this.prevAttrs = void 0),
      (this.attrs = null),
      (this.breakAfter = 0);
  }
  merge(t, e, i, n, s, r) {
    if (i) {
      if (!(i instanceof hi)) return !1;
      this.dom || i.transferDOM(this);
    }
    return (
      n && this.setDeco(i ? i.attrs : null),
      De(this, t, e, i ? i.children : [], s, r),
      !0
    );
  }
  split(t) {
    let e = new hi();
    if (((e.breakAfter = this.breakAfter), 0 == this.length)) return e;
    let { i: i, off: n } = this.childPos(t);
    n &&
      (e.append(this.children[i].split(n), 0),
      this.children[i].merge(n, this.children[i].length, null, !1, 0, 0),
      i++);
    for (let t = i; t < this.children.length; t++)
      e.append(this.children[t], 0);
    for (; i > 0 && 0 == this.children[i - 1].length; )
      this.children[--i].destroy();
    return (this.children.length = i), this.markDirty(), (this.length = t), e;
  }
  transferDOM(t) {
    this.dom &&
      (t.setDOM(this.dom),
      (t.prevAttrs = void 0 === this.prevAttrs ? this.attrs : this.prevAttrs),
      (this.prevAttrs = void 0),
      (this.dom = null));
  }
  setDeco(t) {
    Qe(this.attrs, t) ||
      (this.dom && ((this.prevAttrs = this.attrs), this.markDirty()),
      (this.attrs = t));
  }
  append(t, e) {
    Je(this, t, e);
  }
  addLineDeco(t) {
    let e = t.spec.attributes,
      i = t.spec.class;
    e && (this.attrs = Xe(e, this.attrs || {})),
      i && (this.attrs = Xe({ class: i }, this.attrs || {}));
  }
  domAtPos(t) {
    return Ge(this.dom, this.children, t);
  }
  reuseDOM(t) {
    "DIV" == t.nodeName && (this.setDOM(t), (this.dirty |= 6));
  }
  sync(t) {
    var e;
    this.dom
      ? 4 & this.dirty &&
        (be(this.dom),
        (this.dom.className = "cm-line"),
        (this.prevAttrs = this.attrs ? null : void 0))
      : (this.setDOM(document.createElement("div")),
        (this.dom.className = "cm-line"),
        (this.prevAttrs = this.attrs ? null : void 0)),
      void 0 !== this.prevAttrs &&
        (Ze(this.dom, this.prevAttrs, this.attrs),
        this.dom.classList.add("cm-line"),
        (this.prevAttrs = void 0)),
      super.sync(t);
    let i = this.dom.lastChild;
    for (; i && Se.get(i) instanceof Fe; ) i = i.lastChild;
    if (
      !(
        i &&
        this.length &&
        ("BR" == i.nodeName ||
          0 !=
            (null === (e = Se.get(i)) || void 0 === e
              ? void 0
              : e.isEditable) ||
          (We.ios && this.children.some((t) => t instanceof ze)))
      )
    ) {
      let t = document.createElement("BR");
      (t.cmIgnore = !0), this.dom.appendChild(t);
    }
  }
  measureTextSize() {
    if (0 == this.children.length || this.length > 20) return null;
    let t = 0;
    for (let e of this.children) {
      if (!(e instanceof ze)) return null;
      let i = oe(e.dom);
      if (1 != i.length) return null;
      t += i[0].width;
    }
    return {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: t / this.length,
    };
  }
  coordsAt(t, e) {
    return Ye(this, t, e);
  }
  become(t) {
    return !1;
  }
  get type() {
    return ei.Text;
  }
  static find(t, e) {
    for (let i = 0, n = 0; i < t.children.length; i++) {
      let s = t.children[i],
        r = n + s.length;
      if (r >= e) {
        if (s instanceof hi) return s;
        if (r > e) break;
      }
      n = r + s.breakAfter;
    }
    return null;
  }
}
class ai extends Se {
  constructor(t, e, i) {
    super(),
      (this.widget = t),
      (this.length = e),
      (this.type = i),
      (this.breakAfter = 0),
      (this.prevWidget = null);
  }
  merge(t, e, i, n, s, r) {
    return (
      !(
        i &&
        (!(i instanceof ai && this.widget.compare(i.widget)) ||
          (t > 0 && s <= 0) ||
          (e < this.length && r <= 0))
      ) && ((this.length = t + (i ? i.length : 0) + (this.length - e)), !0)
    );
  }
  domAtPos(t) {
    return 0 == t ? xe.before(this.dom) : xe.after(this.dom, t == this.length);
  }
  split(t) {
    let e = this.length - t;
    this.length = t;
    let i = new ai(this.widget, e, this.type);
    return (i.breakAfter = this.breakAfter), i;
  }
  get children() {
    return ke;
  }
  sync() {
    (this.dom && this.widget.updateDOM(this.dom)) ||
      (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
      (this.prevWidget = null),
      this.setDOM(this.widget.toDOM(this.editorView)),
      (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent
      ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd)
      : d.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(t) {
    return (
      t instanceof ai &&
      t.type == this.type &&
      t.widget.constructor == this.widget.constructor &&
      (t.widget.eq(this.widget) || this.markDirty(!0),
      this.dom && !this.prevWidget && (this.prevWidget = this.widget),
      (this.widget = t.widget),
      (this.length = t.length),
      (this.breakAfter = t.breakAfter),
      !0)
    );
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class ci {
  constructor(t, e, i, n) {
    (this.doc = t),
      (this.pos = e),
      (this.end = i),
      (this.disallowBlockEffectsBelow = n),
      (this.content = []),
      (this.curLine = null),
      (this.breakAtStart = 0),
      (this.pendingBuffer = 0),
      (this.atCursorPos = !0),
      (this.openStart = -1),
      (this.openEnd = -1),
      (this.text = ""),
      (this.textOff = 0),
      (this.cursor = t.iter()),
      (this.skip = e);
  }
  posCovered() {
    if (0 == this.content.length)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let t = this.content[this.content.length - 1];
    return !(t.breakAfter || (t instanceof ai && t.type == ei.WidgetBefore));
  }
  getLine() {
    return (
      this.curLine ||
        (this.content.push((this.curLine = new hi())), (this.atCursorPos = !0)),
      this.curLine
    );
  }
  flushBuffer(t) {
    this.pendingBuffer &&
      (this.curLine.append(ui(new Ke(-1), t), t.length),
      (this.pendingBuffer = 0));
  }
  addBlockWidget(t) {
    this.flushBuffer([]), (this.curLine = null), this.content.push(t);
  }
  finish(t) {
    t ? (this.pendingBuffer = 0) : this.flushBuffer([]),
      this.posCovered() || this.getLine();
  }
  buildText(t, e, i) {
    for (; t > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: e, lineBreak: i, done: n } = this.cursor.next(this.skip);
        if (((this.skip = 0), n))
          throw new Error("Ran out of text content when drawing inline views");
        if (i) {
          this.posCovered() || this.getLine(),
            this.content.length
              ? (this.content[this.content.length - 1].breakAfter = 1)
              : (this.breakAtStart = 1),
            this.flushBuffer([]),
            (this.curLine = null),
            t--;
          continue;
        }
        (this.text = e), (this.textOff = 0);
      }
      let n = Math.min(this.text.length - this.textOff, t, 512);
      this.flushBuffer(e.slice(0, i)),
        this.getLine().append(
          ui(new ze(this.text.slice(this.textOff, this.textOff + n)), e),
          i
        ),
        (this.atCursorPos = !0),
        (this.textOff += n),
        (t -= n),
        (i = 0);
    }
  }
  span(t, e, i, n) {
    this.buildText(e - t, i, n),
      (this.pos = e),
      this.openStart < 0 && (this.openStart = n);
  }
  point(t, e, i, n, s) {
    let r = e - t;
    if (i instanceof ri)
      if (i.block) {
        let { type: t } = i;
        t != ei.WidgetAfter || this.posCovered() || this.getLine(),
          this.addBlockWidget(new ai(i.widget || new fi("div"), r, t));
      } else {
        let o = _e.create(i.widget || new fi("span"), r, i.startSide),
          l =
            this.atCursorPos &&
            !o.isEditable &&
            s <= n.length &&
            (t < e || i.startSide > 0),
          h = !o.isEditable && (t < e || i.startSide <= 0),
          a = this.getLine();
        2 != this.pendingBuffer || l || (this.pendingBuffer = 0),
          this.flushBuffer(n),
          l &&
            (a.append(ui(new Ke(1), n), s),
            (s = n.length + Math.max(0, s - n.length))),
          a.append(ui(o, n), s),
          (this.atCursorPos = h),
          (this.pendingBuffer = h ? (t < e ? 1 : 2) : 0);
      }
    else
      this.doc.lineAt(this.pos).from == this.pos &&
        this.getLine().addLineDeco(i);
    r &&
      (this.textOff + r <= this.text.length
        ? (this.textOff += r)
        : ((this.skip += r - (this.text.length - this.textOff)),
          (this.text = ""),
          (this.textOff = 0)),
      (this.pos = e)),
      this.openStart < 0 && (this.openStart = s);
  }
  filterPoint(t, e, i, n) {
    if (n < this.disallowBlockEffectsBelow && i instanceof ri) {
      if (i.block)
        throw new RangeError(
          "Block decorations may not be specified via plugins"
        );
      if (e > this.doc.lineAt(this.pos).to)
        throw new RangeError(
          "Decorations that replace line breaks may not be specified via plugins"
        );
    }
    return !0;
  }
  static build(t, e, i, n, s) {
    let r = new ci(t, e, i, s);
    return (
      (r.openEnd = Vt.spans(n, e, i, r)),
      r.openStart < 0 && (r.openStart = r.openEnd),
      r.finish(r.openEnd),
      r
    );
  }
}
function ui(t, e) {
  for (let i of e) t = new Fe(i, [t], t.length);
  return t;
}
class fi extends ti {
  constructor(t) {
    super(), (this.tag = t);
  }
  eq(t) {
    return t.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(t) {
    return t.nodeName.toLowerCase() == this.tag;
  }
}
const di = [],
  pi = V.define(),
  mi = V.define(),
  gi = V.define(),
  vi = V.define(),
  wi = V.define(),
  yi = V.define(),
  bi = dt.define({ map: (t, e) => t.map(e) }),
  xi = dt.define({ map: (t, e) => t.map(e) });
class ki {
  constructor(t, e = "nearest", i = "nearest", n = 5, s = 5) {
    (this.range = t),
      (this.y = e),
      (this.x = i),
      (this.yMargin = n),
      (this.xMargin = s);
  }
  map(t) {
    return t.empty
      ? this
      : new ki(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin);
  }
}
const Si = dt.define({ map: (t, e) => t.map(e) });
function Ai(t, e, i) {
  let n = t.facet(vi);
  n.length
    ? n[0](e)
    : window.onerror
    ? window.onerror(String(e), i, void 0, void 0, e)
    : i
    ? console.error(i + ":", e)
    : console.error(e);
}
const Ci = V.define({ combine: (t) => !t.length || t[0] });
class Mi {
  constructor(t, e) {
    (this.field = t), (this.get = e);
  }
}
class Di {
  from(t) {
    return new Mi(this, t);
  }
  static define() {
    return new Di();
  }
}
(Di.decorations = Di.define()),
  (Di.atomicRanges = Di.define()),
  (Di.scrollMargins = Di.define());
let Oi = 0;
const Ti = V.define();
class Ri {
  constructor(t, e, i) {
    (this.id = t),
      (this.create = e),
      (this.fields = i),
      (this.extension = Ti.of(this));
  }
  static define(t, e) {
    let { eventHandlers: i, provide: n, decorations: s } = e || {},
      r = [];
    if (n) for (let t of Array.isArray(n) ? n : [n]) r.push(t);
    return (
      i && r.push(Ei.from((t) => ({ plugin: t, handlers: i }))),
      s && r.push(Di.decorations.from(s)),
      new Ri(Oi++, t, r)
    );
  }
  static fromClass(t, e) {
    return Ri.define((e) => new t(e), e);
  }
}
const Ei = Di.define();
class Li {
  constructor(t) {
    (this.spec = t), (this.mustUpdate = null), (this.value = null);
  }
  takeField(t, e) {
    if (this.spec)
      for (let { field: i, get: n } of this.spec.fields)
        i == t && e.push(n(this.value));
  }
  update(t) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (((this.mustUpdate = null), this.value.update))
          try {
            this.value.update(t);
          } catch (e) {
            if (
              (Ai(t.state, e, "CodeMirror plugin crashed"), this.value.destroy)
            )
              try {
                this.value.destroy();
              } catch (t) {}
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(t);
      } catch (e) {
        Ai(t.state, e, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(t) {
    var e;
    if (null === (e = this.value) || void 0 === e ? void 0 : e.destroy)
      try {
        this.value.destroy();
      } catch (e) {
        Ai(t.state, e, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Bi = V.define(),
  Pi = V.define(),
  Ni = V.define(),
  Ii = V.define();
class Vi {
  constructor(t, e, i, n) {
    (this.fromA = t), (this.toA = e), (this.fromB = i), (this.toB = n);
  }
  join(t) {
    return new Vi(
      Math.min(this.fromA, t.fromA),
      Math.max(this.toA, t.toA),
      Math.min(this.fromB, t.fromB),
      Math.max(this.toB, t.toB)
    );
  }
  addToSet(t) {
    let e = t.length,
      i = this;
    for (; e > 0; e--) {
      let n = t[e - 1];
      if (!(n.fromA > i.toA)) {
        if (n.toA < i.fromA) break;
        (i = i.join(n)), t.splice(e - 1, 1);
      }
    }
    return t.splice(e, 0, i), t;
  }
  static extendWithRanges(t, e) {
    if (0 == e.length) return t;
    let i = [];
    for (let n = 0, s = 0, r = 0, o = 0; ; n++) {
      let l = n == t.length ? null : t[n],
        h = r - o,
        a = l ? l.fromB : 1e9;
      for (; s < e.length && e[s] < a; ) {
        let t = e[s],
          n = e[s + 1],
          r = Math.max(o, t),
          l = Math.min(a, n);
        if ((r <= l && new Vi(r + h, l + h, r, l).addToSet(i), n > a)) break;
        s += 2;
      }
      if (!l) return i;
      new Vi(l.fromA, l.toA, l.fromB, l.toB).addToSet(i),
        (r = l.toA),
        (o = l.toB);
    }
  }
}
class Hi {
  constructor(t, e, i = di) {
    (this.view = t),
      (this.state = e),
      (this.transactions = i),
      (this.flags = 0),
      (this.startState = t.state),
      (this.changes = C.empty(this.startState.doc.length));
    for (let t of i) this.changes = this.changes.compose(t.changes);
    let n = [];
    this.changes.iterChangedRanges((t, e, i, s) => n.push(new Vi(t, e, i, s))),
      (this.changedRanges = n);
    let s = t.hasFocus;
    s != t.inputState.notifiedFocused &&
      ((t.inputState.notifiedFocused = s), (this.flags |= 1));
  }
  get viewportChanged() {
    return (4 & this.flags) > 0;
  }
  get heightChanged() {
    return (2 & this.flags) > 0;
  }
  get geometryChanged() {
    return this.docChanged || (10 & this.flags) > 0;
  }
  get focusChanged() {
    return (1 & this.flags) > 0;
  }
  get docChanged() {
    return !this.changes.empty;
  }
  get selectionSet() {
    return this.transactions.some((t) => t.selection);
  }
  get empty() {
    return 0 == this.flags && 0 == this.transactions.length;
  }
}
var Wi = (function (t) {
  return (t[(t.LTR = 0)] = "LTR"), (t[(t.RTL = 1)] = "RTL"), t;
})(Wi || (Wi = {}));
const zi = Wi.LTR,
  Fi = Wi.RTL;
function qi(t) {
  let e = [];
  for (let i = 0; i < t.length; i++) e.push(1 << +t[i]);
  return e;
}
const _i = qi(
    "88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"
  ),
  ji = qi(
    "4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"
  ),
  Ui = Object.create(null),
  $i = [];
for (let t of ["()", "[]", "{}"]) {
  let e = t.charCodeAt(0),
    i = t.charCodeAt(1);
  (Ui[e] = i), (Ui[i] = -e);
}
const Ki = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
class Gi {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.level = i);
  }
  get dir() {
    return this.level % 2 ? Fi : zi;
  }
  side(t, e) {
    return (this.dir == e) == t ? this.to : this.from;
  }
  static find(t, e, i, n) {
    let s = -1;
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      if (o.from <= e && o.to >= e) {
        if (o.level == i) return r;
        (s < 0 ||
          (0 != n ? (n < 0 ? o.from < e : o.to > e) : t[s].level > o.level)) &&
          (s = r);
      }
    }
    if (s < 0) throw new RangeError("Index out of range");
    return s;
  }
}
const Ji = [];
function Yi(t) {
  return [new Gi(0, t, 0)];
}
let Xi = "";
function Qi(t, e, i, s, r) {
  var o;
  let l = s.head - t.from,
    h = -1;
  if (0 == l) {
    if (!r || !t.length) return null;
    e[0].level != i && ((l = e[0].side(!1, i)), (h = 0));
  } else if (l == t.length) {
    if (r) return null;
    let t = e[e.length - 1];
    t.level != i && ((l = t.side(!0, i)), (h = e.length - 1));
  }
  h < 0 &&
    (h = Gi.find(
      e,
      l,
      null !== (o = s.bidiLevel) && void 0 !== o ? o : -1,
      s.assoc
    ));
  let a = e[h];
  l == a.side(r, i) && ((a = e[(h += r ? 1 : -1)]), (l = a.side(!r, i)));
  let c = r == (a.dir == i),
    u = n(t.text, l, c);
  if (((Xi = t.text.slice(Math.min(l, u), Math.max(l, u))), u != a.side(r, i)))
    return B.cursor(u + t.from, c ? -1 : 1, a.level);
  let f = h == (r ? e.length - 1 : 0) ? null : e[h + (r ? 1 : -1)];
  return f || a.level == i
    ? f && f.level < a.level
      ? B.cursor(f.side(!r, i) + t.from, r ? 1 : -1, f.level)
      : B.cursor(u + t.from, r ? -1 : 1, a.level)
    : B.cursor(r ? t.to : t.from, r ? -1 : 1, i);
}
class Zi {
  constructor(t, e) {
    (this.points = t),
      (this.text = ""),
      (this.lineSeparator = e.facet(Ct.lineSeparator));
  }
  append(t) {
    this.text += t;
  }
  lineBreak() {
    this.text += "￿";
  }
  readRange(t, e) {
    if (!t) return this;
    let i = t.parentNode;
    for (let n = t; ; ) {
      this.findPointBefore(i, n), this.readNode(n);
      let t = n.nextSibling;
      if (t == e) break;
      let s = Se.get(n),
        r = Se.get(t);
      (s && r
        ? s.breakAfter
        : (s ? s.breakAfter : tn(n)) ||
          (tn(t) && ("BR" != n.nodeName || n.cmIgnore))) && this.lineBreak(),
        (n = t);
    }
    return this.findPointBefore(i, e), this;
  }
  readTextNode(t) {
    let e = t.nodeValue;
    for (let i of this.points)
      i.node == t && (i.pos = this.text.length + Math.min(i.offset, e.length));
    for (let i = 0, n = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s,
        r = -1,
        o = 1;
      if (
        (this.lineSeparator
          ? ((r = e.indexOf(this.lineSeparator, i)),
            (o = this.lineSeparator.length))
          : (s = n.exec(e)) && ((r = s.index), (o = s[0].length)),
        this.append(e.slice(i, r < 0 ? e.length : r)),
        r < 0)
      )
        break;
      if ((this.lineBreak(), o > 1))
        for (let e of this.points)
          e.node == t && e.pos > this.text.length && (e.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(t) {
    if (t.cmIgnore) return;
    let e = Se.get(t),
      i = e && e.overrideDOMText;
    if (null != i) {
      this.findPointInside(t, i.length);
      for (let t = i.iter(); !t.next().done; )
        t.lineBreak ? this.lineBreak() : this.append(t.value);
    } else
      3 == t.nodeType
        ? this.readTextNode(t)
        : "BR" == t.nodeName
        ? t.nextSibling && this.lineBreak()
        : 1 == t.nodeType && this.readRange(t.firstChild, null);
  }
  findPointBefore(t, e) {
    for (let i of this.points)
      i.node == t && t.childNodes[i.offset] == e && (i.pos = this.text.length);
  }
  findPointInside(t, e) {
    for (let i of this.points)
      (3 == t.nodeType ? i.node == t : t.contains(i.node)) &&
        (i.pos = this.text.length + Math.min(e, i.offset));
  }
}
function tn(t) {
  return (
    1 == t.nodeType &&
    /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)
  );
}
class en {
  constructor(t, e) {
    (this.node = t), (this.offset = e), (this.pos = -1);
  }
}
class nn extends Se {
  constructor(t) {
    super(),
      (this.view = t),
      (this.compositionDeco = ii.none),
      (this.decorations = []),
      (this.pluginDecorationLength = 0),
      (this.minWidth = 0),
      (this.minWidthFrom = 0),
      (this.minWidthTo = 0),
      (this.impreciseAnchor = null),
      (this.impreciseHead = null),
      (this.forceSelection = !1),
      (this.lastUpdate = Date.now()),
      this.setDOM(t.contentDOM),
      (this.children = [new hi()]),
      this.children[0].setParent(this),
      this.updateDeco(),
      this.updateInner([new Vi(0, 0, 0, t.state.doc.length)], 0);
  }
  get root() {
    return this.view.root;
  }
  get editorView() {
    return this.view;
  }
  get length() {
    return this.view.state.doc.length;
  }
  update(t) {
    let e = t.changedRanges;
    this.minWidth > 0 &&
      e.length &&
      (e.every(
        ({ fromA: t, toA: e }) => e < this.minWidthFrom || t > this.minWidthTo
      )
        ? ((this.minWidthFrom = t.changes.mapPos(this.minWidthFrom, 1)),
          (this.minWidthTo = t.changes.mapPos(this.minWidthTo, 1)))
        : (this.minWidth = this.minWidthFrom = this.minWidthTo = 0)),
      this.view.inputState.composing < 0
        ? (this.compositionDeco = ii.none)
        : (t.transactions.length || this.dirty) &&
          (this.compositionDeco = (function (t, e) {
            let i = rn(t);
            if (!i) return ii.none;
            let { from: n, to: s, node: r, text: o } = i,
              l = e.mapPos(n, 1),
              h = Math.max(l, e.mapPos(s, -1)),
              { state: a } = t,
              c =
                3 == r.nodeType
                  ? r.nodeValue
                  : new Zi([], a).readRange(r.firstChild, null).text;
            if (h - l < c.length)
              if (
                a.doc.sliceString(
                  l,
                  Math.min(a.doc.length, l + c.length),
                  "￿"
                ) == c
              )
                h = l + c.length;
              else {
                if (a.doc.sliceString(Math.max(0, h - c.length), h, "￿") != c)
                  return ii.none;
                l = h - c.length;
              }
            else if (a.doc.sliceString(l, h, "￿") != c) return ii.none;
            let u = Se.get(r);
            u instanceof je ? (u = u.widget.topView) : u && (u.parent = null);
            return ii.set(ii.replace({ widget: new on(r, o, u) }).range(l, h));
          })(this.view, t.changes)),
      (We.ie || We.chrome) &&
        !this.compositionDeco.size &&
        t &&
        t.state.doc.lines != t.startState.doc.lines &&
        (this.forceSelection = !0);
    let i = (function (t, e, i) {
      let n = new hn();
      return Vt.compare(t, e, i, n), n.changes;
    })(this.decorations, this.updateDeco(), t.changes);
    return (
      (e = Vi.extendWithRanges(e, i)),
      (0 != this.dirty || 0 != e.length) &&
        (this.updateInner(e, t.startState.doc.length),
        t.transactions.length && (this.lastUpdate = Date.now()),
        !0)
    );
  }
  updateInner(t, e) {
    (this.view.viewState.mustMeasureContent = !0), this.updateChildren(t, e);
    let { observer: i } = this.view;
    i.ignore(() => {
      (this.dom.style.height = this.view.viewState.contentHeight + "px"),
        (this.dom.style.minWidth = this.minWidth ? this.minWidth + "px" : "");
      let t =
        We.chrome || We.ios
          ? { node: i.selectionRange.focusNode, written: !1 }
          : void 0;
      this.sync(t),
        (this.dirty = 0),
        t &&
          (t.written || i.selectionRange.focusNode != t.node) &&
          (this.forceSelection = !0),
        (this.dom.style.height = "");
    });
    let n = [];
    if (
      this.view.viewport.from ||
      this.view.viewport.to < this.view.state.doc.length
    )
      for (let t of this.children)
        t instanceof ai && t.widget instanceof sn && n.push(t.dom);
    i.updateGaps(n);
  }
  updateChildren(t, e) {
    let i = this.childCursor(e);
    for (let e = t.length - 1; ; e--) {
      let n = e >= 0 ? t[e] : null;
      if (!n) break;
      let { fromA: s, toA: r, fromB: o, toB: l } = n,
        {
          content: h,
          breakAtStart: a,
          openStart: c,
          openEnd: u,
        } = ci.build(
          this.view.state.doc,
          o,
          l,
          this.decorations,
          this.pluginDecorationLength
        ),
        { i: f, off: d } = i.findPos(r, 1),
        { i: p, off: m } = i.findPos(s, -1);
      Me(this, p, m, f, d, h, a, c, u);
    }
  }
  updateSelection(t = !1, e = !1) {
    if (
      (t && this.view.observer.readSelectionRange(),
      (!e && !this.mayControlSelection()) ||
        (We.ios && this.view.inputState.rapidCompositionStart))
    )
      return;
    let i = this.forceSelection;
    this.forceSelection = !1;
    let n = this.view.state.selection.main,
      s = this.domAtPos(n.anchor),
      r = n.empty ? s : this.domAtPos(n.head);
    if (
      We.gecko &&
      n.empty &&
      1 == (o = s).node.nodeType &&
      o.node.firstChild &&
      (0 == o.offset ||
        "false" == o.node.childNodes[o.offset - 1].contentEditable) &&
      (o.offset == o.node.childNodes.length ||
        "false" == o.node.childNodes[o.offset].contentEditable)
    ) {
      let t = document.createTextNode("");
      this.view.observer.ignore(() =>
        s.node.insertBefore(t, s.node.childNodes[s.offset] || null)
      ),
        (s = r = new xe(t, 0)),
        (i = !0);
    }
    var o;
    let l = this.view.observer.selectionRange;
    (!i &&
      l.focusNode &&
      le(s.node, s.offset, l.anchorNode, l.anchorOffset) &&
      le(r.node, r.offset, l.focusNode, l.focusOffset)) ||
      (this.view.observer.ignore(() => {
        We.android &&
          We.chrome &&
          this.dom.contains(l.focusNode) &&
          (function (t, e) {
            for (let i = t; i && i != e; i = i.assignedSlot || i.parentNode)
              if (1 == i.nodeType && "false" == i.contentEditable) return !0;
            return !1;
          })(l.focusNode, this.dom) &&
          (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
        let t = ne(this.root);
        if (n.empty) {
          if (We.gecko) {
            let t =
              ((e = s.node),
              (i = s.offset),
              1 != e.nodeType
                ? 0
                : (i && "false" == e.childNodes[i - 1].contentEditable
                    ? 1
                    : 0) |
                  (i < e.childNodes.length &&
                  "false" == e.childNodes[i].contentEditable
                    ? 2
                    : 0));
            if (t && 3 != t) {
              let e = ln(s.node, s.offset, 1 == t ? 1 : -1);
              e && (s = new xe(e, 1 == t ? 0 : e.nodeValue.length));
            }
          }
          t.collapse(s.node, s.offset),
            null != n.bidiLevel &&
              null != l.cursorBidiLevel &&
              (l.cursorBidiLevel = n.bidiLevel);
        } else if (t.extend)
          t.collapse(s.node, s.offset), t.extend(r.node, r.offset);
        else {
          let e = document.createRange();
          n.anchor > n.head && ([s, r] = [r, s]),
            e.setEnd(r.node, r.offset),
            e.setStart(s.node, s.offset),
            t.removeAllRanges(),
            t.addRange(e);
        }
        var e, i;
      }),
      this.view.observer.setSelectionRange(s, r)),
      (this.impreciseAnchor = s.precise
        ? null
        : new xe(l.anchorNode, l.anchorOffset)),
      (this.impreciseHead = r.precise
        ? null
        : new xe(l.focusNode, l.focusOffset));
  }
  enforceCursorAssoc() {
    if (this.compositionDeco.size) return;
    let t = this.view.state.selection.main,
      e = ne(this.root);
    if (!t.empty || !t.assoc || !e.modify) return;
    let i = hi.find(this, t.head);
    if (!i) return;
    let n = i.posAtStart;
    if (t.head == n || t.head == n + i.length) return;
    let s = this.coordsAt(t.head, -1),
      r = this.coordsAt(t.head, 1);
    if (!s || !r || s.bottom > r.top) return;
    let o = this.domAtPos(t.head + t.assoc);
    e.collapse(o.node, o.offset),
      e.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary");
  }
  mayControlSelection() {
    return this.view.state.facet(Ci)
      ? this.root.activeElement == this.dom
      : re(this.dom, this.view.observer.selectionRange);
  }
  nearest(t) {
    for (let e = t; e; ) {
      let t = Se.get(e);
      if (t && t.rootView == this) return t;
      e = e.parentNode;
    }
    return null;
  }
  posFromDOM(t, e) {
    let i = this.nearest(t);
    if (!i)
      throw new RangeError(
        "Trying to find position for a DOM position outside of the document"
      );
    return i.localPosFromDOM(t, e) + i.posAtStart;
  }
  domAtPos(t) {
    let { i: e, off: i } = this.childCursor().findPos(t, -1);
    for (; e < this.children.length - 1; ) {
      let t = this.children[e];
      if (i < t.length || t instanceof hi) break;
      e++, (i = 0);
    }
    return this.children[e].domAtPos(i);
  }
  coordsAt(t, e) {
    for (let i = this.length, n = this.children.length - 1; ; n--) {
      let s = this.children[n],
        r = i - s.breakAfter - s.length;
      if (
        t > r ||
        (t == r &&
          s.type != ei.WidgetBefore &&
          s.type != ei.WidgetAfter &&
          (!n ||
            2 == e ||
            this.children[n - 1].breakAfter ||
            (this.children[n - 1].type == ei.WidgetBefore && e > -2)))
      )
        return s.coordsAt(t - r, e);
      i = r;
    }
  }
  measureVisibleLineHeights() {
    let t = [],
      { from: e, to: i } = this.view.viewState.viewport,
      n = this.view.contentDOM.clientWidth,
      s = n > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1,
      r = -1;
    for (let o = 0, l = 0; l < this.children.length; l++) {
      let h = this.children[l],
        a = o + h.length;
      if (a > i) break;
      if (o >= e) {
        let e = h.dom.getBoundingClientRect();
        if ((t.push(e.height), s)) {
          let t = h.dom.lastChild,
            i = t ? oe(t) : [];
          if (i.length) {
            let t = i[i.length - 1],
              s =
                this.view.textDirection == Wi.LTR
                  ? t.right - e.left
                  : e.right - t.left;
            s > r &&
              ((r = s),
              (this.minWidth = n),
              (this.minWidthFrom = o),
              (this.minWidthTo = a));
          }
        }
      }
      o = a + h.breakAfter;
    }
    return t;
  }
  measureTextSize() {
    for (let t of this.children)
      if (t instanceof hi) {
        let e = t.measureTextSize();
        if (e) return e;
      }
    let t,
      e,
      i = document.createElement("div");
    return (
      (i.className = "cm-line"),
      (i.textContent = "abc def ghi jkl mno pqr stu"),
      this.view.observer.ignore(() => {
        this.dom.appendChild(i);
        let n = oe(i.firstChild)[0];
        (t = i.getBoundingClientRect().height),
          (e = n ? n.width / 27 : 7),
          i.remove();
      }),
      { lineHeight: t, charWidth: e }
    );
  }
  childCursor(t = this.length) {
    let e = this.children.length;
    return e && (t -= this.children[--e].length), new Ce(this.children, t, e);
  }
  computeBlockGapDeco() {
    let t = [],
      e = this.view.viewState;
    for (let i = 0, n = 0; ; n++) {
      let s = n == e.viewports.length ? null : e.viewports[n],
        r = s ? s.from - 1 : this.length;
      if (r > i) {
        let n = e.lineBlockAt(r).bottom - e.lineBlockAt(i).top;
        t.push(
          ii
            .replace({
              widget: new sn(n),
              block: !0,
              inclusive: !0,
              isBlockGap: !0,
            })
            .range(i, r)
        );
      }
      if (!s) break;
      i = s.to + 1;
    }
    return ii.set(t);
  }
  updateDeco() {
    let t = this.view.pluginField(Di.decorations);
    return (
      (this.pluginDecorationLength = t.length),
      (this.decorations = [
        ...t,
        ...this.view.state.facet(Ni),
        this.compositionDeco,
        this.computeBlockGapDeco(),
        this.view.viewState.lineGapDeco,
      ])
    );
  }
  scrollIntoView(t) {
    let e,
      { range: i } = t,
      n = this.coordsAt(i.head, i.empty ? i.assoc : i.head > i.anchor ? -1 : 1);
    if (!n) return;
    !i.empty &&
      (e = this.coordsAt(i.anchor, i.anchor > i.head ? -1 : 1)) &&
      (n = {
        left: Math.min(n.left, e.left),
        top: Math.min(n.top, e.top),
        right: Math.max(n.right, e.right),
        bottom: Math.max(n.bottom, e.bottom),
      });
    let s = 0,
      r = 0,
      o = 0,
      l = 0;
    for (let t of this.view.pluginField(Di.scrollMargins))
      if (t) {
        let { left: e, right: i, top: n, bottom: h } = t;
        null != e && (s = Math.max(s, e)),
          null != i && (r = Math.max(r, i)),
          null != n && (o = Math.max(o, n)),
          null != h && (l = Math.max(l, h));
      }
    let h = {
      left: n.left - s,
      top: n.top - o,
      right: n.right + r,
      bottom: n.bottom + l,
    };
    !(function (t, e, i, n, s, r, o, l) {
      let h = t.ownerDocument,
        a = h.defaultView;
      for (let c = t; c; )
        if (1 == c.nodeType) {
          let t,
            u = c == h.body;
          if (u) t = de(a);
          else {
            if (
              c.scrollHeight <= c.clientHeight &&
              c.scrollWidth <= c.clientWidth
            ) {
              c = c.parentNode;
              continue;
            }
            let e = c.getBoundingClientRect();
            t = {
              left: e.left,
              right: e.left + c.clientWidth,
              top: e.top,
              bottom: e.top + c.clientHeight,
            };
          }
          let f = 0,
            d = 0;
          if ("nearest" == s)
            e.top < t.top
              ? ((d = -(t.top - e.top + o)),
                i > 0 &&
                  e.bottom > t.bottom + d &&
                  (d = e.bottom - t.bottom + d + o))
              : e.bottom > t.bottom &&
                ((d = e.bottom - t.bottom + o),
                i < 0 && e.top - d < t.top && (d = -(t.top + d - e.top + o)));
          else {
            let n = e.bottom - e.top,
              r = t.bottom - t.top;
            d =
              ("center" == s && n <= r
                ? e.top + n / 2 - r / 2
                : "start" == s || ("center" == s && i < 0)
                ? e.top - o
                : e.bottom - r + o) - t.top;
          }
          if (
            ("nearest" == n
              ? e.left < t.left
                ? ((f = -(t.left - e.left + r)),
                  i > 0 &&
                    e.right > t.right + f &&
                    (f = e.right - t.right + f + r))
                : e.right > t.right &&
                  ((f = e.right - t.right + r),
                  i < 0 &&
                    e.left < t.left + f &&
                    (f = -(t.left + f - e.left + r)))
              : (f =
                  ("center" == n
                    ? e.left + (e.right - e.left) / 2 - (t.right - t.left) / 2
                    : ("start" == n) == l
                    ? e.left - r
                    : e.right - (t.right - t.left) + r) - t.left),
            f || d)
          )
            if (u) a.scrollBy(f, d);
            else {
              if (d) {
                let t = c.scrollTop;
                (c.scrollTop += d), (d = c.scrollTop - t);
              }
              if (f) {
                let t = c.scrollLeft;
                (c.scrollLeft += f), (f = c.scrollLeft - t);
              }
              e = {
                left: e.left - f,
                top: e.top - d,
                right: e.right - f,
                bottom: e.bottom - d,
              };
            }
          if (u) break;
          (c = c.assignedSlot || c.parentNode), (n = s = "nearest");
        } else {
          if (11 != c.nodeType) break;
          c = c.host;
        }
    })(
      this.view.scrollDOM,
      h,
      i.head < i.anchor ? -1 : 1,
      t.x,
      t.y,
      t.xMargin,
      t.yMargin,
      this.view.textDirection == Wi.LTR
    );
  }
}
class sn extends ti {
  constructor(t) {
    super(), (this.height = t);
  }
  toDOM() {
    let t = document.createElement("div");
    return this.updateDOM(t), t;
  }
  eq(t) {
    return t.height == this.height;
  }
  updateDOM(t) {
    return (t.style.height = this.height + "px"), !0;
  }
  get estimatedHeight() {
    return this.height;
  }
}
function rn(t) {
  let e = t.observer.selectionRange,
    i = e.focusNode && ln(e.focusNode, e.focusOffset, 0);
  if (!i) return null;
  let n = t.docView.nearest(i);
  if (!n) return null;
  if (n instanceof hi) {
    let t = i;
    for (; t.parentNode != n.dom; ) t = t.parentNode;
    let e = t.previousSibling;
    for (; e && !Se.get(e); ) e = e.previousSibling;
    let s = e ? Se.get(e).posAtEnd : n.posAtStart;
    return { from: s, to: s, node: t, text: i };
  }
  {
    for (;;) {
      let { parent: t } = n;
      if (!t) return null;
      if (t instanceof hi) break;
      n = t;
    }
    let t = n.posAtStart;
    return { from: t, to: t + n.length, node: n.dom, text: i };
  }
}
class on extends ti {
  constructor(t, e, i) {
    super(), (this.top = t), (this.text = e), (this.topView = i);
  }
  eq(t) {
    return this.top == t.top && this.text == t.text;
  }
  toDOM() {
    return this.top;
  }
  ignoreEvent() {
    return !1;
  }
  get customView() {
    return je;
  }
}
function ln(t, e, i) {
  for (;;) {
    if (3 == t.nodeType) return t;
    if (1 == t.nodeType && e > 0 && i <= 0) e = ce((t = t.childNodes[e - 1]));
    else {
      if (!(1 == t.nodeType && e < t.childNodes.length && i >= 0)) return null;
      (t = t.childNodes[e]), (e = 0);
    }
  }
}
class hn {
  constructor() {
    this.changes = [];
  }
  compareRange(t, e) {
    li(t, e, this.changes);
  }
  comparePoint(t, e) {
    li(t, e, this.changes);
  }
}
function an(t, e) {
  return e.left > t ? e.left - t : Math.max(0, t - e.right);
}
function cn(t, e) {
  return e.top > t ? e.top - t : Math.max(0, t - e.bottom);
}
function un(t, e) {
  return t.top < e.bottom - 1 && t.bottom > e.top + 1;
}
function fn(t, e) {
  return e < t.top
    ? { top: e, left: t.left, right: t.right, bottom: t.bottom }
    : t;
}
function dn(t, e) {
  return e > t.bottom
    ? { top: t.top, left: t.left, right: t.right, bottom: e }
    : t;
}
function pn(t, e, i) {
  let n, s, r, o, l, h, a, c;
  for (let u = t.firstChild; u; u = u.nextSibling) {
    let t = oe(u);
    for (let f = 0; f < t.length; f++) {
      let d = t[f];
      s && un(s, d) && (d = fn(dn(d, s.bottom), s.top));
      let p = an(e, d),
        m = cn(i, d);
      if (0 == p && 0 == m) return 3 == u.nodeType ? mn(u, e, i) : pn(u, e, i);
      (!n || o > m || (o == m && r > p)) &&
        ((n = u), (s = d), (r = p), (o = m)),
        0 == p
          ? i > d.bottom && (!a || a.bottom < d.bottom)
            ? ((l = u), (a = d))
            : i < d.top && (!c || c.top > d.top) && ((h = u), (c = d))
          : a && un(a, d)
          ? (a = dn(a, d.bottom))
          : c && un(c, d) && (c = fn(c, d.top));
    }
  }
  if (
    (a && a.bottom >= i
      ? ((n = l), (s = a))
      : c && c.top <= i && ((n = h), (s = c)),
    !n)
  )
    return { node: t, offset: 0 };
  let u = Math.max(s.left, Math.min(s.right, e));
  return 3 == n.nodeType
    ? mn(n, u, i)
    : r || "true" != n.contentEditable
    ? {
        node: t,
        offset:
          Array.prototype.indexOf.call(t.childNodes, n) +
          (e >= (s.left + s.right) / 2 ? 1 : 0),
      }
    : pn(n, u, i);
}
function mn(t, e, i) {
  let n = t.nodeValue.length,
    s = -1,
    r = 1e9,
    o = 0;
  for (let l = 0; l < n; l++) {
    let n = we(t, l, l + 1).getClientRects();
    for (let h = 0; h < n.length; h++) {
      let a = n[h];
      if (a.top == a.bottom) continue;
      o || (o = e - a.left);
      let c = (a.top > i ? a.top - i : i - a.bottom) - 1;
      if (a.left - 1 <= e && a.right + 1 >= e && c < r) {
        let i = e >= (a.left + a.right) / 2,
          n = i;
        if (We.chrome || We.gecko) {
          we(t, l).getBoundingClientRect().left == a.right && (n = !i);
        }
        if (c <= 0) return { node: t, offset: l + (n ? 1 : 0) };
        (s = l + (n ? 1 : 0)), (r = c);
      }
    }
  }
  return { node: t, offset: s > -1 ? s : o > 0 ? t.nodeValue.length : 0 };
}
function gn(t, { x: e, y: i }, n, s = -1) {
  var r;
  let o,
    l = t.contentDOM.getBoundingClientRect(),
    h = l.top + t.viewState.paddingTop,
    { docHeight: a } = t.viewState,
    c = i - h;
  if (c < 0) return 0;
  if (c > a) return t.state.doc.length;
  for (
    let e = t.defaultLineHeight / 2, i = !1;
    (o = t.elementAtHeight(c)), o.type != ei.Text;

  )
    for (; (c = s > 0 ? o.bottom + e : o.top - e), !(c >= 0 && c <= a); ) {
      if (i) return n ? null : 0;
      (i = !0), (s = -s);
    }
  i = h + c;
  let u = o.from;
  if (u < t.viewport.from)
    return 0 == t.viewport.from ? 0 : n ? null : vn(t, l, o, e, i);
  if (u > t.viewport.to)
    return t.viewport.to == t.state.doc.length
      ? t.state.doc.length
      : n
      ? null
      : vn(t, l, o, e, i);
  let f = t.dom.ownerDocument,
    d = t.root.elementFromPoint ? t.root : f,
    p = d.elementFromPoint(e, i);
  p && !t.contentDOM.contains(p) && (p = null),
    p ||
      ((e = Math.max(l.left + 1, Math.min(l.right - 1, e))),
      (p = d.elementFromPoint(e, i)),
      p && !t.contentDOM.contains(p) && (p = null));
  let m,
    g = -1;
  if (
    p &&
    0 !=
      (null === (r = t.docView.nearest(p)) || void 0 === r
        ? void 0
        : r.isEditable)
  )
    if (f.caretPositionFromPoint) {
      let t = f.caretPositionFromPoint(e, i);
      t && ({ offsetNode: m, offset: g } = t);
    } else if (f.caretRangeFromPoint) {
      let t = f.caretRangeFromPoint(e, i);
      t &&
        (({ startContainer: m, startOffset: g } = t),
        We.safari &&
          (function (t, e, i) {
            let n;
            if (3 != t.nodeType || e != (n = t.nodeValue.length)) return !1;
            for (let e = t.nextSibling; e; e = e.nextSibling)
              if (1 != e.nodeType || "BR" != e.nodeName) return !1;
            return we(t, n - 1, n).getBoundingClientRect().left > i;
          })(m, g, e) &&
          (m = void 0));
    }
  if (!m || !t.docView.dom.contains(m)) {
    let n = hi.find(t.docView, u);
    if (!n) return c > o.top + o.height / 2 ? o.to : o.from;
    ({ node: m, offset: g } = pn(n.dom, e, i));
  }
  return t.docView.posFromDOM(m, g);
}
function vn(t, e, i, n, s) {
  let r = Math.round((n - e.left) * t.defaultCharacterWidth);
  if (t.lineWrapping && i.height > 1.5 * t.defaultLineHeight) {
    r +=
      Math.floor((s - i.top) / t.defaultLineHeight) *
      t.viewState.heightOracle.lineLength;
  }
  let o = t.state.sliceDoc(i.from, i.to);
  return i.from + f(o, r, t.state.tabSize);
}
function wn(t, e, i, n) {
  let s = t.state.doc.lineAt(e.head),
    r = t.bidiSpans(s);
  for (let o = e, l = null; ; ) {
    let e = Qi(s, r, t.textDirection, o, i),
      h = Xi;
    if (!e) {
      if (s.number == (i ? t.state.doc.lines : 1)) return o;
      (h = "\n"),
        (s = t.state.doc.line(s.number + (i ? 1 : -1))),
        (r = t.bidiSpans(s)),
        (e = B.cursor(i ? s.from : s.to));
    }
    if (l) {
      if (!l(h)) return o;
    } else {
      if (!n) return e;
      l = n(h);
    }
    o = e;
  }
}
function yn(t, e, i) {
  let n = t.pluginField(Di.atomicRanges);
  for (;;) {
    let t = !1;
    for (let s of n)
      s.between(i.from - 1, i.from + 1, (n, s, r) => {
        i.from > n &&
          i.from < s &&
          ((i = e.from > i.from ? B.cursor(n, 1) : B.cursor(s, -1)), (t = !0));
      });
    if (!t) return i;
  }
}
class bn {
  constructor(t) {
    (this.lastKeyCode = 0),
      (this.lastKeyTime = 0),
      (this.pendingIOSKey = void 0),
      (this.lastSelectionOrigin = null),
      (this.lastSelectionTime = 0),
      (this.lastEscPress = 0),
      (this.lastContextMenu = 0),
      (this.scrollHandlers = []),
      (this.registeredEvents = []),
      (this.customHandlers = []),
      (this.composing = -1),
      (this.compositionFirstChange = null),
      (this.compositionEndedAt = 0),
      (this.rapidCompositionStart = !1),
      (this.mouseSelection = null);
    for (let e in Cn) {
      let i = Cn[e];
      t.contentDOM.addEventListener(e, (n) => {
        An(t, n) &&
          !this.ignoreDuringComposition(n) &&
          (("keydown" == e && this.keydown(t, n)) ||
            (this.mustFlushObserver(n) && t.observer.forceFlush(),
            this.runCustomHandlers(e, t, n) ? n.preventDefault() : i(t, n)));
      }),
        this.registeredEvents.push(e);
    }
    (this.notifiedFocused = t.hasFocus),
      this.ensureHandlers(t),
      We.safari && t.contentDOM.addEventListener("input", () => null);
  }
  setSelectionOrigin(t) {
    (this.lastSelectionOrigin = t), (this.lastSelectionTime = Date.now());
  }
  ensureHandlers(t) {
    let e = (this.customHandlers = t.pluginField(Ei));
    for (let i of e)
      for (let e in i.handlers)
        this.registeredEvents.indexOf(e) < 0 &&
          "scroll" != e &&
          (this.registeredEvents.push(e),
          t.contentDOM.addEventListener(e, (i) => {
            An(t, i) && this.runCustomHandlers(e, t, i) && i.preventDefault();
          }));
  }
  runCustomHandlers(t, e, i) {
    for (let n of this.customHandlers) {
      let s = n.handlers[t];
      if (s)
        try {
          if (s.call(n.plugin, i, e) || i.defaultPrevented) return !0;
        } catch (t) {
          Ai(e.state, t);
        }
    }
    return !1;
  }
  runScrollHandlers(t, e) {
    for (let i of this.customHandlers) {
      let n = i.handlers.scroll;
      if (n)
        try {
          n.call(i.plugin, e, t);
        } catch (e) {
          Ai(t.state, e);
        }
    }
  }
  keydown(t, e) {
    if (
      ((this.lastKeyCode = e.keyCode),
      (this.lastKeyTime = Date.now()),
      9 == e.keyCode && Date.now() < this.lastEscPress + 2e3)
    )
      return !0;
    if (
      We.android &&
      We.chrome &&
      !e.synthetic &&
      (13 == e.keyCode || 8 == e.keyCode)
    )
      return t.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let i;
    return (
      !(
        !We.ios ||
        !(i = xn.find((t) => t.keyCode == e.keyCode)) ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.synthetic
      ) &&
      ((this.pendingIOSKey = i), setTimeout(() => this.flushIOSKey(t), 250), !0)
    );
  }
  flushIOSKey(t) {
    let e = this.pendingIOSKey;
    return (
      !!e && ((this.pendingIOSKey = void 0), ye(t.contentDOM, e.key, e.keyCode))
    );
  }
  ignoreDuringComposition(t) {
    return (
      !!/^key/.test(t.type) &&
      (this.composing > 0 ||
        (!!(We.safari && Date.now() - this.compositionEndedAt < 500) &&
          ((this.compositionEndedAt = 0), !0)))
    );
  }
  mustFlushObserver(t) {
    return (
      ("keydown" == t.type && 229 != t.keyCode) ||
      ("compositionend" == t.type && !We.ios)
    );
  }
  startMouseSelection(t) {
    this.mouseSelection && this.mouseSelection.destroy(),
      (this.mouseSelection = t);
  }
  update(t) {
    this.mouseSelection && this.mouseSelection.update(t),
      t.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
const xn = [
    { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
    { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
    { key: "Delete", keyCode: 46, inputType: "deleteContentForward" },
  ],
  kn = [16, 17, 18, 20, 91, 92, 224, 225];
class Sn {
  constructor(t, e, i, n) {
    (this.view = t),
      (this.style = i),
      (this.mustSelect = n),
      (this.lastEvent = e);
    let s = t.contentDOM.ownerDocument;
    s.addEventListener("mousemove", (this.move = this.move.bind(this))),
      s.addEventListener("mouseup", (this.up = this.up.bind(this))),
      (this.extend = e.shiftKey),
      (this.multiple =
        t.state.facet(Ct.allowMultipleSelections) &&
        (function (t, e) {
          let i = t.state.facet(pi);
          return i.length ? i[0](e) : We.mac ? e.metaKey : e.ctrlKey;
        })(t, e)),
      (this.dragMove = (function (t, e) {
        let i = t.state.facet(mi);
        return i.length ? i[0](e) : We.mac ? !e.altKey : !e.ctrlKey;
      })(t, e)),
      (this.dragging =
        !(
          !(function (t, e) {
            let { main: i } = t.state.selection;
            if (i.empty) return !1;
            let n = ne(t.root);
            if (0 == n.rangeCount) return !0;
            let s = n.getRangeAt(0).getClientRects();
            for (let t = 0; t < s.length; t++) {
              let i = s[t];
              if (
                i.left <= e.clientX &&
                i.right >= e.clientX &&
                i.top <= e.clientY &&
                i.bottom >= e.clientY
              )
                return !0;
            }
            return !1;
          })(t, e) || 1 != Hn(e)
        ) && null),
      !1 === this.dragging && (e.preventDefault(), this.select(e));
  }
  move(t) {
    if (0 == t.buttons) return this.destroy();
    !1 === this.dragging && this.select((this.lastEvent = t));
  }
  up(t) {
    null == this.dragging && this.select(this.lastEvent),
      this.dragging || t.preventDefault(),
      this.destroy();
  }
  destroy() {
    let t = this.view.contentDOM.ownerDocument;
    t.removeEventListener("mousemove", this.move),
      t.removeEventListener("mouseup", this.up),
      (this.view.inputState.mouseSelection = null);
  }
  select(t) {
    let e = this.style.get(t, this.extend, this.multiple);
    (!this.mustSelect &&
      e.eq(this.view.state.selection) &&
      e.main.assoc == this.view.state.selection.main.assoc) ||
      this.view.dispatch({
        selection: e,
        userEvent: "select.pointer",
        scrollIntoView: !0,
      }),
      (this.mustSelect = !1);
  }
  update(t) {
    t.docChanged &&
      this.dragging &&
      (this.dragging = this.dragging.map(t.changes)),
      this.style.update(t) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function An(t, e) {
  if (!e.bubbles) return !0;
  if (e.defaultPrevented) return !1;
  for (let i, n = e.target; n != t.contentDOM; n = n.parentNode)
    if (!n || 11 == n.nodeType || ((i = Se.get(n)) && i.ignoreEvent(e)))
      return !1;
  return !0;
}
const Cn = Object.create(null),
  Mn = (We.ie && We.ie_version < 15) || (We.ios && We.webkit_version < 604);
function Dn(t, e) {
  let i,
    { state: n } = t,
    s = 1,
    r = n.toText(e),
    o = r.lines == n.selection.ranges.length;
  if (
    null != zn &&
    n.selection.ranges.every((t) => t.empty) &&
    zn == r.toString()
  ) {
    let t = -1;
    i = n.changeByRange((i) => {
      let l = n.doc.lineAt(i.from);
      if (l.from == t) return { range: i };
      t = l.from;
      let h = n.toText((o ? r.line(s++).text : e) + n.lineBreak);
      return {
        changes: { from: l.from, insert: h },
        range: B.cursor(i.from + h.length),
      };
    });
  } else
    i = o
      ? n.changeByRange((t) => {
          let e = r.line(s++);
          return {
            changes: { from: t.from, to: t.to, insert: e.text },
            range: B.cursor(t.from + e.length),
          };
        })
      : n.replaceSelection(r);
  t.dispatch(i, { userEvent: "input.paste", scrollIntoView: !0 });
}
Cn.keydown = (t, e) => {
  t.inputState.setSelectionOrigin("select"),
    27 == e.keyCode
      ? (t.inputState.lastEscPress = Date.now())
      : kn.indexOf(e.keyCode) < 0 && (t.inputState.lastEscPress = 0);
};
let On = 0;
function Tn(t, e, i, s) {
  if (1 == s) return B.cursor(e, i);
  if (2 == s)
    return (function (t, e, i = 1) {
      let s = t.charCategorizer(e),
        r = t.doc.lineAt(e),
        o = e - r.from;
      if (0 == r.length) return B.cursor(e);
      0 == o ? (i = 1) : o == r.length && (i = -1);
      let l = o,
        h = o;
      i < 0 ? (l = n(r.text, o, !1)) : (h = n(r.text, o));
      let a = s(r.text.slice(l, h));
      for (; l > 0; ) {
        let t = n(r.text, l, !1);
        if (s(r.text.slice(t, l)) != a) break;
        l = t;
      }
      for (; h < r.length; ) {
        let t = n(r.text, h);
        if (s(r.text.slice(h, t)) != a) break;
        h = t;
      }
      return B.range(l + r.from, h + r.from);
    })(t.state, e, i);
  {
    let i = hi.find(t.docView, e),
      n = t.state.doc.lineAt(i ? i.posAtEnd : e),
      s = i ? i.posAtStart : n.from,
      r = i ? i.posAtEnd : n.to;
    return r < t.state.doc.length && r == n.to && r++, B.range(s, r);
  }
}
(Cn.touchstart = (t, e) => {
  (On = Date.now()), t.inputState.setSelectionOrigin("select.pointer");
}),
  (Cn.touchmove = (t) => {
    t.inputState.setSelectionOrigin("select.pointer");
  }),
  (Cn.mousedown = (t, e) => {
    if ((t.observer.flush(), On > Date.now() - 2e3 && 1 == Hn(e))) return;
    let i = null;
    for (let n of t.state.facet(gi)) if (((i = n(t, e)), i)) break;
    if (
      (i ||
        0 != e.button ||
        (i = (function (t, e) {
          let i = Bn(t, e),
            n = Hn(e),
            s = t.state.selection,
            r = i,
            o = e;
          return {
            update(t) {
              t.docChanged &&
                (i && (i.pos = t.changes.mapPos(i.pos)),
                (s = s.map(t.changes)),
                (o = null));
            },
            get(e, l, h) {
              let a;
              if (
                (o && e.clientX == o.clientX && e.clientY == o.clientY
                  ? (a = r)
                  : ((a = r = Bn(t, e)), (o = e)),
                !a || !i)
              )
                return s;
              let c = Tn(t, a.pos, a.bias, n);
              if (i.pos != a.pos && !l) {
                let e = Tn(t, i.pos, i.bias, n),
                  s = Math.min(e.from, c.from),
                  r = Math.max(e.to, c.to);
                c = s < c.from ? B.range(s, r) : B.range(r, s);
              }
              return l
                ? s.replaceRange(s.main.extend(c.from, c.to))
                : h
                ? s.addRange(c)
                : B.create([c]);
            },
          };
        })(t, e)),
      i)
    ) {
      let n = t.root.activeElement != t.contentDOM;
      n && t.observer.ignore(() => ve(t.contentDOM)),
        t.inputState.startMouseSelection(new Sn(t, e, i, n));
    }
  });
let Rn = (t, e) => t >= e.top && t <= e.bottom,
  En = (t, e, i) => Rn(e, i) && t >= i.left && t <= i.right;
function Ln(t, e, i, n) {
  let s = hi.find(t.docView, e);
  if (!s) return 1;
  let r = e - s.posAtStart;
  if (0 == r) return 1;
  if (r == s.length) return -1;
  let o = s.coordsAt(r, -1);
  if (o && En(i, n, o)) return -1;
  let l = s.coordsAt(r, 1);
  return l && En(i, n, l) ? 1 : o && Rn(n, o) ? -1 : 1;
}
function Bn(t, e) {
  let i = t.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: i, bias: Ln(t, i, e.clientX, e.clientY) };
}
const Pn = We.ie && We.ie_version <= 11;
let Nn = null,
  In = 0,
  Vn = 0;
function Hn(t) {
  if (!Pn) return t.detail;
  let e = Nn,
    i = Vn;
  return (
    (Nn = t),
    (Vn = Date.now()),
    (In =
      !e ||
      (i > Date.now() - 400 &&
        Math.abs(e.clientX - t.clientX) < 2 &&
        Math.abs(e.clientY - t.clientY) < 2)
        ? (In + 1) % 3
        : 1)
  );
}
function Wn(t, e, i, n) {
  if (!i) return;
  let s = t.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  e.preventDefault();
  let { mouseSelection: r } = t.inputState,
    o =
      n && r && r.dragging && r.dragMove
        ? { from: r.dragging.from, to: r.dragging.to }
        : null,
    l = { from: s, insert: i },
    h = t.state.changes(o ? [o, l] : l);
  t.focus(),
    t.dispatch({
      changes: h,
      selection: { anchor: h.mapPos(s, -1), head: h.mapPos(s, 1) },
      userEvent: o ? "move.drop" : "input.drop",
    });
}
(Cn.dragstart = (t, e) => {
  let {
      selection: { main: i },
    } = t.state,
    { mouseSelection: n } = t.inputState;
  n && (n.dragging = i),
    e.dataTransfer &&
      (e.dataTransfer.setData("Text", t.state.sliceDoc(i.from, i.to)),
      (e.dataTransfer.effectAllowed = "copyMove"));
}),
  (Cn.drop = (t, e) => {
    if (!e.dataTransfer) return;
    if (t.state.readOnly) return e.preventDefault();
    let i = e.dataTransfer.files;
    if (i && i.length) {
      e.preventDefault();
      let n = Array(i.length),
        s = 0,
        r = () => {
          ++s == i.length &&
            Wn(t, e, n.filter((t) => null != t).join(t.state.lineBreak), !1);
        };
      for (let t = 0; t < i.length; t++) {
        let e = new FileReader();
        (e.onerror = r),
          (e.onload = () => {
            /[\x00-\x08\x0e-\x1f]{2}/.test(e.result) || (n[t] = e.result), r();
          }),
          e.readAsText(i[t]);
      }
    } else Wn(t, e, e.dataTransfer.getData("Text"), !0);
  }),
  (Cn.paste = (t, e) => {
    if (t.state.readOnly) return e.preventDefault();
    t.observer.flush();
    let i = Mn ? null : e.clipboardData;
    i
      ? (Dn(t, i.getData("text/plain")), e.preventDefault())
      : (function (t) {
          let e = t.dom.parentNode;
          if (!e) return;
          let i = e.appendChild(document.createElement("textarea"));
          (i.style.cssText = "position: fixed; left: -10000px; top: 10px"),
            i.focus(),
            setTimeout(() => {
              t.focus(), i.remove(), Dn(t, i.value);
            }, 50);
        })(t);
  });
let zn = null;
function Fn(t, e) {
  if (t.docView.compositionDeco.size) {
    t.inputState.rapidCompositionStart = e;
    try {
      t.update([]);
    } finally {
      t.inputState.rapidCompositionStart = !1;
    }
  }
}
(Cn.copy = Cn.cut =
  (t, e) => {
    let {
      text: i,
      ranges: n,
      linewise: s,
    } = (function (t) {
      let e = [],
        i = [],
        n = !1;
      for (let n of t.selection.ranges)
        n.empty || (e.push(t.sliceDoc(n.from, n.to)), i.push(n));
      if (!e.length) {
        let s = -1;
        for (let { from: n } of t.selection.ranges) {
          let r = t.doc.lineAt(n);
          r.number > s &&
            (e.push(r.text),
            i.push({ from: r.from, to: Math.min(t.doc.length, r.to + 1) })),
            (s = r.number);
        }
        n = !0;
      }
      return { text: e.join(t.lineBreak), ranges: i, linewise: n };
    })(t.state);
    if (!i && !s) return;
    zn = s ? i : null;
    let r = Mn ? null : e.clipboardData;
    r
      ? (e.preventDefault(), r.clearData(), r.setData("text/plain", i))
      : (function (t, e) {
          let i = t.dom.parentNode;
          if (!i) return;
          let n = i.appendChild(document.createElement("textarea"));
          (n.style.cssText = "position: fixed; left: -10000px; top: 10px"),
            (n.value = e),
            n.focus(),
            (n.selectionEnd = e.length),
            (n.selectionStart = 0),
            setTimeout(() => {
              n.remove(), t.focus();
            }, 50);
        })(t, i),
      "cut" != e.type ||
        t.state.readOnly ||
        t.dispatch({ changes: n, scrollIntoView: !0, userEvent: "delete.cut" });
  }),
  (Cn.focus = Cn.blur =
    (t) => {
      setTimeout(() => {
        t.hasFocus != t.inputState.notifiedFocused && t.update([]);
      }, 10);
    }),
  (Cn.compositionstart = Cn.compositionupdate =
    (t) => {
      null == t.inputState.compositionFirstChange &&
        (t.inputState.compositionFirstChange = !0),
        t.inputState.composing < 0 &&
          ((t.inputState.composing = 0),
          t.docView.compositionDeco.size && (t.observer.flush(), Fn(t, !0)));
    }),
  (Cn.compositionend = (t) => {
    (t.inputState.composing = -1),
      (t.inputState.compositionEndedAt = Date.now()),
      (t.inputState.compositionFirstChange = null),
      setTimeout(() => {
        t.inputState.composing < 0 && Fn(t, !1);
      }, 50);
  }),
  (Cn.contextmenu = (t) => {
    t.inputState.lastContextMenu = Date.now();
  }),
  (Cn.beforeinput = (t, e) => {
    var i;
    let n;
    if (
      We.chrome &&
      We.android &&
      (n = xn.find((t) => t.inputType == e.inputType)) &&
      (t.observer.delayAndroidKey(n.key, n.keyCode),
      "Backspace" == n.key || "Delete" == n.key)
    ) {
      let e =
        (null === (i = window.visualViewport) || void 0 === i
          ? void 0
          : i.height) || 0;
      setTimeout(() => {
        var i;
        ((null === (i = window.visualViewport) || void 0 === i
          ? void 0
          : i.height) || 0) >
          e + 10 &&
          t.hasFocus &&
          (t.contentDOM.blur(), t.focus());
      }, 100);
    }
  });
const qn = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class _n {
  constructor() {
    (this.doc = d.empty),
      (this.lineWrapping = !1),
      (this.direction = Wi.LTR),
      (this.heightSamples = {}),
      (this.lineHeight = 14),
      (this.charWidth = 7),
      (this.lineLength = 30),
      (this.heightChanged = !1);
  }
  heightForGap(t, e) {
    let i = this.doc.lineAt(e).number - this.doc.lineAt(t).number + 1;
    return (
      this.lineWrapping &&
        (i += Math.ceil((e - t - i * this.lineLength * 0.5) / this.lineLength)),
      this.lineHeight * i
    );
  }
  heightForLine(t) {
    if (!this.lineWrapping) return this.lineHeight;
    return (
      (1 +
        Math.max(0, Math.ceil((t - this.lineLength) / (this.lineLength - 5)))) *
      this.lineHeight
    );
  }
  setDoc(t) {
    return (this.doc = t), this;
  }
  mustRefreshForStyle(t, e) {
    return qn.indexOf(t) > -1 != this.lineWrapping || this.direction != e;
  }
  mustRefreshForHeights(t) {
    let e = !1;
    for (let i = 0; i < t.length; i++) {
      let n = t[i];
      n < 0
        ? i++
        : this.heightSamples[Math.floor(10 * n)] ||
          ((e = !0), (this.heightSamples[Math.floor(10 * n)] = !0));
    }
    return e;
  }
  refresh(t, e, i, n, s, r) {
    let o = qn.indexOf(t) > -1,
      l =
        Math.round(i) != Math.round(this.lineHeight) ||
        this.lineWrapping != o ||
        this.direction != e;
    if (
      ((this.lineWrapping = o),
      (this.direction = e),
      (this.lineHeight = i),
      (this.charWidth = n),
      (this.lineLength = s),
      l)
    ) {
      this.heightSamples = {};
      for (let t = 0; t < r.length; t++) {
        let e = r[t];
        e < 0 ? t++ : (this.heightSamples[Math.floor(10 * e)] = !0);
      }
    }
    return l;
  }
}
class jn {
  constructor(t, e) {
    (this.from = t), (this.heights = e), (this.index = 0);
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Un {
  constructor(t, e, i, n, s) {
    (this.from = t),
      (this.length = e),
      (this.top = i),
      (this.height = n),
      (this.type = s);
  }
  get to() {
    return this.from + this.length;
  }
  get bottom() {
    return this.top + this.height;
  }
  join(t) {
    let e = (Array.isArray(this.type) ? this.type : [this]).concat(
      Array.isArray(t.type) ? t.type : [t]
    );
    return new Un(
      this.from,
      this.length + t.length,
      this.top,
      this.height + t.height,
      e
    );
  }
  moveY(t) {
    return t
      ? new Un(
          this.from,
          this.length,
          this.top + t,
          this.height,
          Array.isArray(this.type)
            ? this.type.map((e) => e.moveY(t))
            : this.type
        )
      : this;
  }
}
var $n = (function (t) {
  return (
    (t[(t.ByPos = 0)] = "ByPos"),
    (t[(t.ByHeight = 1)] = "ByHeight"),
    (t[(t.ByPosNoHeight = 2)] = "ByPosNoHeight"),
    t
  );
})($n || ($n = {}));
class Kn {
  constructor(t, e, i = 2) {
    (this.length = t), (this.height = e), (this.flags = i);
  }
  get outdated() {
    return (2 & this.flags) > 0;
  }
  set outdated(t) {
    this.flags = (t ? 2 : 0) | (-3 & this.flags);
  }
  setHeight(t, e) {
    this.height != e &&
      (Math.abs(this.height - e) > 0.001 && (t.heightChanged = !0),
      (this.height = e));
  }
  replace(t, e, i) {
    return Kn.of(i);
  }
  decomposeLeft(t, e) {
    e.push(this);
  }
  decomposeRight(t, e) {
    e.push(this);
  }
  applyChanges(t, e, i, n) {
    let s = this;
    for (let r = n.length - 1; r >= 0; r--) {
      let { fromA: o, toA: l, fromB: h, toB: a } = n[r],
        c = s.lineAt(o, $n.ByPosNoHeight, e, 0, 0),
        u = c.to >= l ? c : s.lineAt(l, $n.ByPosNoHeight, e, 0, 0);
      for (a += u.to - l, l = u.to; r > 0 && c.from <= n[r - 1].toA; )
        (o = n[r - 1].fromA),
          (h = n[r - 1].fromB),
          r--,
          o < c.from && (c = s.lineAt(o, $n.ByPosNoHeight, e, 0, 0));
      (h += c.from - o), (o = c.from);
      let f = Zn.build(i, t, h, a);
      s = s.replace(o, l, f);
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new Jn(0, 0);
  }
  static of(t) {
    if (1 == t.length) return t[0];
    let e = 0,
      i = t.length,
      n = 0,
      s = 0;
    for (;;)
      if (e == i)
        if (n > 2 * s) {
          let s = t[e - 1];
          s.break
            ? t.splice(--e, 1, s.left, null, s.right)
            : t.splice(--e, 1, s.left, s.right),
            (i += 1 + s.break),
            (n -= s.size);
        } else {
          if (!(s > 2 * n)) break;
          {
            let e = t[i];
            e.break
              ? t.splice(i, 1, e.left, null, e.right)
              : t.splice(i, 1, e.left, e.right),
              (i += 2 + e.break),
              (s -= e.size);
          }
        }
      else if (n < s) {
        let i = t[e++];
        i && (n += i.size);
      } else {
        let e = t[--i];
        e && (s += e.size);
      }
    let r = 0;
    return (
      null == t[e - 1] ? ((r = 1), e--) : null == t[e] && ((r = 1), i++),
      new Xn(Kn.of(t.slice(0, e)), r, Kn.of(t.slice(i)))
    );
  }
}
Kn.prototype.size = 1;
class Gn extends Kn {
  constructor(t, e, i) {
    super(t, e), (this.type = i);
  }
  blockAt(t, e, i, n) {
    return new Un(n, this.length, i, this.height, this.type);
  }
  lineAt(t, e, i, n, s) {
    return this.blockAt(0, i, n, s);
  }
  forEachLine(t, e, i, n, s, r) {
    r(this.blockAt(0, i, n, s));
  }
  updateHeight(t, e = 0, i = !1, n) {
    return (
      n && n.from <= e && n.more && this.setHeight(t, n.heights[n.index++]),
      (this.outdated = !1),
      this
    );
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Jn extends Gn {
  constructor(t, e) {
    super(t, e, ei.Text), (this.collapsed = 0), (this.widgetHeight = 0);
  }
  replace(t, e, i) {
    let n = i[0];
    return 1 == i.length &&
      (n instanceof Jn || (n instanceof Yn && 4 & n.flags)) &&
      Math.abs(this.length - n.length) < 10
      ? (n instanceof Yn
          ? (n = new Jn(n.length, this.height))
          : (n.height = this.height),
        this.outdated || (n.outdated = !1),
        n)
      : Kn.of(i);
  }
  updateHeight(t, e = 0, i = !1, n) {
    return (
      n && n.from <= e && n.more
        ? this.setHeight(t, n.heights[n.index++])
        : (i || this.outdated) &&
          this.setHeight(
            t,
            Math.max(
              this.widgetHeight,
              t.heightForLine(this.length - this.collapsed)
            )
          ),
      (this.outdated = !1),
      this
    );
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${
      this.widgetHeight ? ":" + this.widgetHeight : ""
    })`;
  }
}
class Yn extends Kn {
  constructor(t) {
    super(t, 0);
  }
  lines(t, e) {
    let i = t.lineAt(e).number,
      n = t.lineAt(e + this.length).number;
    return { firstLine: i, lastLine: n, lineHeight: this.height / (n - i + 1) };
  }
  blockAt(t, e, i, n) {
    let { firstLine: s, lastLine: r, lineHeight: o } = this.lines(e, n),
      l = Math.max(0, Math.min(r - s, Math.floor((t - i) / o))),
      { from: h, length: a } = e.line(s + l);
    return new Un(h, a, i + o * l, o, ei.Text);
  }
  lineAt(t, e, i, n, s) {
    if (e == $n.ByHeight) return this.blockAt(t, i, n, s);
    if (e == $n.ByPosNoHeight) {
      let { from: e, to: n } = i.lineAt(t);
      return new Un(e, n - e, 0, 0, ei.Text);
    }
    let { firstLine: r, lineHeight: o } = this.lines(i, s),
      { from: l, length: h, number: a } = i.lineAt(t);
    return new Un(l, h, n + o * (a - r), o, ei.Text);
  }
  forEachLine(t, e, i, n, s, r) {
    let { firstLine: o, lineHeight: l } = this.lines(i, s);
    for (let h = Math.max(t, s), a = Math.min(s + this.length, e); h <= a; ) {
      let e = i.lineAt(h);
      h == t && (n += l * (e.number - o)),
        r(new Un(e.from, e.length, n, l, ei.Text)),
        (n += l),
        (h = e.to + 1);
    }
  }
  replace(t, e, i) {
    let n = this.length - e;
    if (n > 0) {
      let t = i[i.length - 1];
      t instanceof Yn
        ? (i[i.length - 1] = new Yn(t.length + n))
        : i.push(null, new Yn(n - 1));
    }
    if (t > 0) {
      let e = i[0];
      e instanceof Yn
        ? (i[0] = new Yn(t + e.length))
        : i.unshift(new Yn(t - 1), null);
    }
    return Kn.of(i);
  }
  decomposeLeft(t, e) {
    e.push(new Yn(t - 1), null);
  }
  decomposeRight(t, e) {
    e.push(null, new Yn(this.length - t - 1));
  }
  updateHeight(t, e = 0, i = !1, n) {
    let s = e + this.length;
    if (n && n.from <= e + this.length && n.more) {
      let i = [],
        r = Math.max(e, n.from),
        o = -1,
        l = t.heightChanged;
      for (
        n.from > e && i.push(new Yn(n.from - e - 1).updateHeight(t, e));
        r <= s && n.more;

      ) {
        let e = t.doc.lineAt(r).length;
        i.length && i.push(null);
        let s = n.heights[n.index++];
        -1 == o ? (o = s) : Math.abs(s - o) >= 0.001 && (o = -2);
        let l = new Jn(e, s);
        (l.outdated = !1), i.push(l), (r += e + 1);
      }
      r <= s && i.push(null, new Yn(s - r).updateHeight(t, r));
      let h = Kn.of(i);
      return (
        (t.heightChanged =
          l ||
          o < 0 ||
          Math.abs(h.height - this.height) >= 0.001 ||
          Math.abs(o - this.lines(t.doc, e).lineHeight) >= 0.001),
        h
      );
    }
    return (
      (i || this.outdated) &&
        (this.setHeight(t, t.heightForGap(e, e + this.length)),
        (this.outdated = !1)),
      this
    );
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Xn extends Kn {
  constructor(t, e, i) {
    super(
      t.length + e + i.length,
      t.height + i.height,
      e | (t.outdated || i.outdated ? 2 : 0)
    ),
      (this.left = t),
      (this.right = i),
      (this.size = t.size + i.size);
  }
  get break() {
    return 1 & this.flags;
  }
  blockAt(t, e, i, n) {
    let s = i + this.left.height;
    return t < s
      ? this.left.blockAt(t, e, i, n)
      : this.right.blockAt(t, e, s, n + this.left.length + this.break);
  }
  lineAt(t, e, i, n, s) {
    let r = n + this.left.height,
      o = s + this.left.length + this.break,
      l = e == $n.ByHeight ? t < r : t < o,
      h = l
        ? this.left.lineAt(t, e, i, n, s)
        : this.right.lineAt(t, e, i, r, o);
    if (this.break || (l ? h.to < o : h.from > o)) return h;
    let a = e == $n.ByPosNoHeight ? $n.ByPosNoHeight : $n.ByPos;
    return l
      ? h.join(this.right.lineAt(o, a, i, r, o))
      : this.left.lineAt(o, a, i, n, s).join(h);
  }
  forEachLine(t, e, i, n, s, r) {
    let o = n + this.left.height,
      l = s + this.left.length + this.break;
    if (this.break)
      t < l && this.left.forEachLine(t, e, i, n, s, r),
        e >= l && this.right.forEachLine(t, e, i, o, l, r);
    else {
      let h = this.lineAt(l, $n.ByPos, i, n, s);
      t < h.from && this.left.forEachLine(t, h.from - 1, i, n, s, r),
        h.to >= t && h.from <= e && r(h),
        e > h.to && this.right.forEachLine(h.to + 1, e, i, o, l, r);
    }
  }
  replace(t, e, i) {
    let n = this.left.length + this.break;
    if (e < n) return this.balanced(this.left.replace(t, e, i), this.right);
    if (t > this.left.length)
      return this.balanced(this.left, this.right.replace(t - n, e - n, i));
    let s = [];
    t > 0 && this.decomposeLeft(t, s);
    let r = s.length;
    for (let t of i) s.push(t);
    if ((t > 0 && Qn(s, r - 1), e < this.length)) {
      let t = s.length;
      this.decomposeRight(e, s), Qn(s, t);
    }
    return Kn.of(s);
  }
  decomposeLeft(t, e) {
    let i = this.left.length;
    if (t <= i) return this.left.decomposeLeft(t, e);
    e.push(this.left),
      this.break && (i++, t >= i && e.push(null)),
      t > i && this.right.decomposeLeft(t - i, e);
  }
  decomposeRight(t, e) {
    let i = this.left.length,
      n = i + this.break;
    if (t >= n) return this.right.decomposeRight(t - n, e);
    t < i && this.left.decomposeRight(t, e),
      this.break && t < n && e.push(null),
      e.push(this.right);
  }
  balanced(t, e) {
    return t.size > 2 * e.size || e.size > 2 * t.size
      ? Kn.of(this.break ? [t, null, e] : [t, e])
      : ((this.left = t),
        (this.right = e),
        (this.height = t.height + e.height),
        (this.outdated = t.outdated || e.outdated),
        (this.size = t.size + e.size),
        (this.length = t.length + this.break + e.length),
        this);
  }
  updateHeight(t, e = 0, i = !1, n) {
    let { left: s, right: r } = this,
      o = e + s.length + this.break,
      l = null;
    return (
      n && n.from <= e + s.length && n.more
        ? (l = s = s.updateHeight(t, e, i, n))
        : s.updateHeight(t, e, i),
      n && n.from <= o + r.length && n.more
        ? (l = r = r.updateHeight(t, o, i, n))
        : r.updateHeight(t, o, i),
      l
        ? this.balanced(s, r)
        : ((this.height = this.left.height + this.right.height),
          (this.outdated = !1),
          this)
    );
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function Qn(t, e) {
  let i, n;
  null == t[e] &&
    (i = t[e - 1]) instanceof Yn &&
    (n = t[e + 1]) instanceof Yn &&
    t.splice(e - 1, 3, new Yn(i.length + 1 + n.length));
}
class Zn {
  constructor(t, e) {
    (this.pos = t),
      (this.oracle = e),
      (this.nodes = []),
      (this.lineStart = -1),
      (this.lineEnd = -1),
      (this.covering = null),
      (this.writtenTo = t);
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(t, e) {
    if (this.lineStart > -1) {
      let t = Math.min(e, this.lineEnd),
        i = this.nodes[this.nodes.length - 1];
      i instanceof Jn
        ? (i.length += t - this.pos)
        : (t > this.pos || !this.isCovered) &&
          this.nodes.push(new Jn(t - this.pos, -1)),
        (this.writtenTo = t),
        e > t &&
          (this.nodes.push(null), this.writtenTo++, (this.lineStart = -1));
    }
    this.pos = e;
  }
  point(t, e, i) {
    if (t < e || i.heightRelevant) {
      let n = i.widget ? i.widget.estimatedHeight : 0;
      n < 0 && (n = this.oracle.lineHeight);
      let s = e - t;
      i.block
        ? this.addBlock(new Gn(s, n, i.type))
        : (s || n >= 5) && this.addLineDeco(n, s);
    } else e > t && this.span(t, e);
    this.lineEnd > -1 &&
      this.lineEnd < this.pos &&
      (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1) return;
    let { from: t, to: e } = this.oracle.doc.lineAt(this.pos);
    (this.lineStart = t),
      (this.lineEnd = e),
      this.writtenTo < t &&
        ((this.writtenTo < t - 1 ||
          null == this.nodes[this.nodes.length - 1]) &&
          this.nodes.push(this.blankContent(this.writtenTo, t - 1)),
        this.nodes.push(null)),
      this.pos > t && this.nodes.push(new Jn(this.pos - t, -1)),
      (this.writtenTo = this.pos);
  }
  blankContent(t, e) {
    let i = new Yn(e - t);
    return this.oracle.doc.lineAt(t).to == e && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let t = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (t instanceof Jn) return t;
    let e = new Jn(0, -1);
    return this.nodes.push(e), e;
  }
  addBlock(t) {
    this.enterLine(),
      t.type != ei.WidgetAfter || this.isCovered || this.ensureLine(),
      this.nodes.push(t),
      (this.writtenTo = this.pos = this.pos + t.length),
      t.type != ei.WidgetBefore && (this.covering = t);
  }
  addLineDeco(t, e) {
    let i = this.ensureLine();
    (i.length += e),
      (i.collapsed += e),
      (i.widgetHeight = Math.max(i.widgetHeight, t)),
      (this.writtenTo = this.pos = this.pos + e);
  }
  finish(t) {
    let e = 0 == this.nodes.length ? null : this.nodes[this.nodes.length - 1];
    !(this.lineStart > -1) || e instanceof Jn || this.isCovered
      ? (this.writtenTo < this.pos || null == e) &&
        this.nodes.push(this.blankContent(this.writtenTo, this.pos))
      : this.nodes.push(new Jn(0, -1));
    let i = t;
    for (let t of this.nodes)
      t instanceof Jn && t.updateHeight(this.oracle, i),
        (i += t ? t.length : 1);
    return this.nodes;
  }
  static build(t, e, i, n) {
    let s = new Zn(i, t);
    return Vt.spans(e, i, n, s, 0), s.finish(i);
  }
}
class ts {
  constructor() {
    this.changes = [];
  }
  compareRange() {}
  comparePoint(t, e, i, n) {
    (t < e || (i && i.heightRelevant) || (n && n.heightRelevant)) &&
      li(t, e, this.changes, 5);
  }
}
function es(t, e) {
  let i = t.getBoundingClientRect(),
    n = Math.max(0, i.left),
    s = Math.min(innerWidth, i.right),
    r = Math.max(0, i.top),
    o = Math.min(innerHeight, i.bottom),
    l = t.ownerDocument.body;
  for (let e = t.parentNode; e && e != l; )
    if (1 == e.nodeType) {
      let t = e,
        i = window.getComputedStyle(t);
      if (
        (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth) &&
        "visible" != i.overflow
      ) {
        let e = t.getBoundingClientRect();
        (n = Math.max(n, e.left)),
          (s = Math.min(s, e.right)),
          (r = Math.max(r, e.top)),
          (o = Math.min(o, e.bottom));
      }
      e =
        "absolute" == i.position || "fixed" == i.position
          ? t.offsetParent
          : t.parentNode;
    } else {
      if (11 != e.nodeType) break;
      e = e.host;
    }
  return {
    left: n - i.left,
    right: Math.max(n, s) - i.left,
    top: r - (i.top + e),
    bottom: Math.max(r, o) - (i.top + e),
  };
}
function is(t, e) {
  let i = t.getBoundingClientRect();
  return {
    left: 0,
    right: i.right - i.left,
    top: e,
    bottom: i.bottom - (i.top + e),
  };
}
class ns {
  constructor(t, e, i) {
    (this.from = t), (this.to = e), (this.size = i);
  }
  static same(t, e) {
    if (t.length != e.length) return !1;
    for (let i = 0; i < t.length; i++) {
      let n = t[i],
        s = e[i];
      if (n.from != s.from || n.to != s.to || n.size != s.size) return !1;
    }
    return !0;
  }
  draw(t) {
    return ii
      .replace({ widget: new ss(this.size, t) })
      .range(this.from, this.to);
  }
}
class ss extends ti {
  constructor(t, e) {
    super(), (this.size = t), (this.vertical = e);
  }
  eq(t) {
    return t.size == this.size && t.vertical == this.vertical;
  }
  toDOM() {
    let t = document.createElement("div");
    return (
      this.vertical
        ? (t.style.height = this.size + "px")
        : ((t.style.width = this.size + "px"),
          (t.style.height = "2px"),
          (t.style.display = "inline-block")),
      t
    );
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class rs {
  constructor(t) {
    (this.state = t),
      (this.pixelViewport = {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: 0,
      }),
      (this.inView = !0),
      (this.paddingTop = 0),
      (this.paddingBottom = 0),
      (this.contentDOMWidth = 0),
      (this.contentDOMHeight = 0),
      (this.editorHeight = 0),
      (this.editorWidth = 0),
      (this.heightOracle = new _n()),
      (this.scaler = fs),
      (this.scrollTarget = null),
      (this.printing = !1),
      (this.mustMeasureContent = !0),
      (this.visibleRanges = []),
      (this.mustEnforceCursorAssoc = !1),
      (this.heightMap = Kn.empty().applyChanges(
        t.facet(Ni),
        d.empty,
        this.heightOracle.setDoc(t.doc),
        [new Vi(0, 0, 0, t.doc.length)]
      )),
      (this.viewport = this.getViewport(0, null)),
      this.updateViewportLines(),
      this.updateForViewport(),
      (this.lineGaps = this.ensureLineGaps([])),
      (this.lineGapDeco = ii.set(this.lineGaps.map((t) => t.draw(!1)))),
      this.computeVisibleRanges();
  }
  updateForViewport() {
    let t = [this.viewport],
      { main: e } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let n = i ? e.head : e.anchor;
      if (!t.some(({ from: t, to: e }) => n >= t && n <= e)) {
        let { from: e, to: i } = this.lineBlockAt(n);
        t.push(new os(e, i));
      }
    }
    (this.viewports = t.sort((t, e) => t.from - e.from)),
      (this.scaler =
        this.heightMap.height <= 7e6
          ? fs
          : new ds(this.heightOracle.doc, this.heightMap, this.viewports));
  }
  updateViewportLines() {
    (this.viewportLines = []),
      this.heightMap.forEachLine(
        this.viewport.from,
        this.viewport.to,
        this.state.doc,
        0,
        0,
        (t) => {
          this.viewportLines.push(
            1 == this.scaler.scale ? t : ps(t, this.scaler)
          );
        }
      );
  }
  update(t, e = null) {
    let i = this.state;
    this.state = t.state;
    let n = this.state.facet(Ni),
      s = t.changedRanges,
      r = Vi.extendWithRanges(
        s,
        (function (t, e, i) {
          let n = new ts();
          return Vt.compare(t, e, i, n, 0), n.changes;
        })(
          t.startState.facet(Ni),
          n,
          t ? t.changes : C.empty(this.state.doc.length)
        )
      ),
      o = this.heightMap.height;
    (this.heightMap = this.heightMap.applyChanges(
      n,
      i.doc,
      this.heightOracle.setDoc(this.state.doc),
      r
    )),
      this.heightMap.height != o && (t.flags |= 2);
    let l = r.length
      ? this.mapViewport(this.viewport, t.changes)
      : this.viewport;
    ((e && (e.range.head < l.from || e.range.head > l.to)) ||
      !this.viewportIsAppropriate(l)) &&
      (l = this.getViewport(0, e));
    let h =
      !t.changes.empty ||
      2 & t.flags ||
      l.from != this.viewport.from ||
      l.to != this.viewport.to;
    (this.viewport = l),
      this.updateForViewport(),
      h && this.updateViewportLines(),
      (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) &&
        this.updateLineGaps(
          this.ensureLineGaps(this.mapLineGaps(this.lineGaps, t.changes))
        ),
      (t.flags |= this.computeVisibleRanges()),
      e && (this.scrollTarget = e),
      !this.mustEnforceCursorAssoc &&
        t.selectionSet &&
        t.view.lineWrapping &&
        t.state.selection.main.empty &&
        t.state.selection.main.assoc &&
        (this.mustEnforceCursorAssoc = !0);
  }
  measure(t) {
    let e = t.contentDOM,
      i = window.getComputedStyle(e),
      n = this.heightOracle,
      s = i.whiteSpace,
      r = "rtl" == i.direction ? Wi.RTL : Wi.LTR,
      o = this.heightOracle.mustRefreshForStyle(s, r),
      l =
        o || this.mustMeasureContent || this.contentDOMHeight != e.clientHeight,
      h = 0,
      a = 0;
    if (
      (this.editorWidth != t.scrollDOM.clientWidth &&
        (n.lineWrapping && (l = !0),
        (this.editorWidth = t.scrollDOM.clientWidth),
        (h |= 8)),
      l)
    ) {
      (this.mustMeasureContent = !1), (this.contentDOMHeight = e.clientHeight);
      let t = parseInt(i.paddingTop) || 0,
        n = parseInt(i.paddingBottom) || 0;
      (this.paddingTop == t && this.paddingBottom == n) ||
        ((h |= 8), (this.paddingTop = t), (this.paddingBottom = n));
    }
    let c = (this.printing ? is : es)(e, this.paddingTop),
      u = c.top - this.pixelViewport.top,
      f = c.bottom - this.pixelViewport.bottom;
    this.pixelViewport = c;
    let d =
      this.pixelViewport.bottom > this.pixelViewport.top &&
      this.pixelViewport.right > this.pixelViewport.left;
    if ((d != this.inView && ((this.inView = d), d && (l = !0)), !this.inView))
      return 0;
    let p = e.clientWidth;
    if (
      ((this.contentDOMWidth == p &&
        this.editorHeight == t.scrollDOM.clientHeight) ||
        ((this.contentDOMWidth = p),
        (this.editorHeight = t.scrollDOM.clientHeight),
        (h |= 8)),
      l)
    ) {
      let e = t.docView.measureVisibleLineHeights();
      if (
        (n.mustRefreshForHeights(e) && (o = !0),
        o ||
          (n.lineWrapping && Math.abs(p - this.contentDOMWidth) > n.charWidth))
      ) {
        let { lineHeight: i, charWidth: l } = t.docView.measureTextSize();
        (o = n.refresh(s, r, i, l, p / l, e)),
          o && ((t.docView.minWidth = 0), (h |= 8));
      }
      u > 0 && f > 0
        ? (a = Math.max(u, f))
        : u < 0 && f < 0 && (a = Math.min(u, f)),
        (n.heightChanged = !1),
        (this.heightMap = this.heightMap.updateHeight(
          n,
          0,
          o,
          new jn(this.viewport.from, e)
        )),
        n.heightChanged && (h |= 2);
    }
    let m =
      !this.viewportIsAppropriate(this.viewport, a) ||
      (this.scrollTarget &&
        (this.scrollTarget.range.head < this.viewport.from ||
          this.scrollTarget.range.head > this.viewport.to));
    return (
      m && (this.viewport = this.getViewport(a, this.scrollTarget)),
      this.updateForViewport(),
      (2 & h || m) && this.updateViewportLines(),
      (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) &&
        this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps)),
      (h |= this.computeVisibleRanges()),
      this.mustEnforceCursorAssoc &&
        ((this.mustEnforceCursorAssoc = !1), t.docView.enforceCursorAssoc()),
      h
    );
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(t, e) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, t / 1e3 / 2)),
      n = this.heightMap,
      s = this.state.doc,
      { visibleTop: r, visibleBottom: o } = this,
      l = new os(
        n.lineAt(r - 1e3 * i, $n.ByHeight, s, 0, 0).from,
        n.lineAt(o + 1e3 * (1 - i), $n.ByHeight, s, 0, 0).to
      );
    if (e) {
      let { head: t } = e.range;
      if (t < l.from || t > l.to) {
        let i,
          r = Math.min(
            this.editorHeight,
            this.pixelViewport.bottom - this.pixelViewport.top
          ),
          o = n.lineAt(t, $n.ByPos, s, 0, 0);
        (i =
          "center" == e.y
            ? (o.top + o.bottom) / 2 - r / 2
            : "start" == e.y || ("nearest" == e.y && t < l.from)
            ? o.top
            : o.bottom - r),
          (l = new os(
            n.lineAt(i - 500, $n.ByHeight, s, 0, 0).from,
            n.lineAt(i + r + 500, $n.ByHeight, s, 0, 0).to
          ));
      }
    }
    return l;
  }
  mapViewport(t, e) {
    let i = e.mapPos(t.from, -1),
      n = e.mapPos(t.to, 1);
    return new os(
      this.heightMap.lineAt(i, $n.ByPos, this.state.doc, 0, 0).from,
      this.heightMap.lineAt(n, $n.ByPos, this.state.doc, 0, 0).to
    );
  }
  viewportIsAppropriate({ from: t, to: e }, i = 0) {
    if (!this.inView) return !0;
    let { top: n } = this.heightMap.lineAt(t, $n.ByPos, this.state.doc, 0, 0),
      { bottom: s } = this.heightMap.lineAt(e, $n.ByPos, this.state.doc, 0, 0),
      { visibleTop: r, visibleBottom: o } = this;
    return (
      (0 == t || n <= r - Math.max(10, Math.min(-i, 250))) &&
      (e == this.state.doc.length || s >= o + Math.max(10, Math.min(i, 250))) &&
      n > r - 2e3 &&
      s < o + 2e3
    );
  }
  mapLineGaps(t, e) {
    if (!t.length || e.empty) return t;
    let i = [];
    for (let n of t)
      e.touchesRange(n.from, n.to) ||
        i.push(new ns(e.mapPos(n.from), e.mapPos(n.to), n.size));
    return i;
  }
  ensureLineGaps(t) {
    let e = [];
    if (this.heightOracle.direction != Wi.LTR) return e;
    for (let i of this.viewportLines) {
      if (i.length < 4e3) continue;
      let n,
        s,
        r = ls(i.from, i.to, this.state);
      if (r.total < 4e3) continue;
      if (this.heightOracle.lineWrapping) {
        let t =
          (2e3 / this.heightOracle.lineLength) * this.heightOracle.lineHeight;
        (n = hs(r, (this.visibleTop - i.top - t) / i.height)),
          (s = hs(r, (this.visibleBottom - i.top + t) / i.height));
      } else {
        let t = r.total * this.heightOracle.charWidth,
          e = 2e3 * this.heightOracle.charWidth;
        (n = hs(r, (this.pixelViewport.left - e) / t)),
          (s = hs(r, (this.pixelViewport.right + e) / t));
      }
      let o = [];
      n > i.from && o.push({ from: i.from, to: n }),
        s < i.to && o.push({ from: s, to: i.to });
      let l = this.state.selection.main;
      l.from >= i.from && l.from <= i.to && cs(o, l.from - 10, l.from + 10),
        !l.empty &&
          l.to >= i.from &&
          l.to <= i.to &&
          cs(o, l.to - 10, l.to + 10);
      for (let { from: n, to: s } of o)
        s - n > 1e3 &&
          e.push(
            us(
              t,
              (t) =>
                t.from >= i.from &&
                t.to <= i.to &&
                Math.abs(t.from - n) < 1e3 &&
                Math.abs(t.to - s) < 1e3
            ) || new ns(n, s, this.gapSize(i, n, s, r))
          );
    }
    return e;
  }
  gapSize(t, e, i, n) {
    let s = as(n, i) - as(n, e);
    return this.heightOracle.lineWrapping
      ? t.height * s
      : n.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(t) {
    ns.same(t, this.lineGaps) ||
      ((this.lineGaps = t),
      (this.lineGapDeco = ii.set(
        t.map((t) => t.draw(this.heightOracle.lineWrapping))
      )));
  }
  computeVisibleRanges() {
    let t = this.state.facet(Ni);
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let e = [];
    Vt.spans(
      t,
      this.viewport.from,
      this.viewport.to,
      {
        span(t, i) {
          e.push({ from: t, to: i });
        },
        point() {},
      },
      20
    );
    let i =
      e.length != this.visibleRanges.length ||
      this.visibleRanges.some((t, i) => t.from != e[i].from || t.to != e[i].to);
    return (this.visibleRanges = e), i ? 4 : 0;
  }
  lineBlockAt(t) {
    return (
      (t >= this.viewport.from &&
        t <= this.viewport.to &&
        this.viewportLines.find((e) => e.from <= t && e.to >= t)) ||
      ps(this.heightMap.lineAt(t, $n.ByPos, this.state.doc, 0, 0), this.scaler)
    );
  }
  lineBlockAtHeight(t) {
    return ps(
      this.heightMap.lineAt(
        this.scaler.fromDOM(t),
        $n.ByHeight,
        this.state.doc,
        0,
        0
      ),
      this.scaler
    );
  }
  elementAtHeight(t) {
    return ps(
      this.heightMap.blockAt(this.scaler.fromDOM(t), this.state.doc, 0, 0),
      this.scaler
    );
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class os {
  constructor(t, e) {
    (this.from = t), (this.to = e);
  }
}
function ls(t, e, i) {
  let n = [],
    s = t,
    r = 0;
  return (
    Vt.spans(
      i.facet(Ni),
      t,
      e,
      {
        span() {},
        point(t, e) {
          t > s && (n.push({ from: s, to: t }), (r += t - s)), (s = e);
        },
      },
      20
    ),
    s < e && (n.push({ from: s, to: e }), (r += e - s)),
    { total: r, ranges: n }
  );
}
function hs({ total: t, ranges: e }, i) {
  if (i <= 0) return e[0].from;
  if (i >= 1) return e[e.length - 1].to;
  let n = Math.floor(t * i);
  for (let t = 0; ; t++) {
    let { from: i, to: s } = e[t],
      r = s - i;
    if (n <= r) return i + n;
    n -= r;
  }
}
function as(t, e) {
  let i = 0;
  for (let { from: n, to: s } of t.ranges) {
    if (e <= s) {
      i += e - n;
      break;
    }
    i += s - n;
  }
  return i / t.total;
}
function cs(t, e, i) {
  for (let n = 0; n < t.length; n++) {
    let s = t[n];
    if (s.from < i && s.to > e) {
      let r = [];
      s.from < e && r.push({ from: s.from, to: e }),
        s.to > i && r.push({ from: i, to: s.to }),
        t.splice(n, 1, ...r),
        (n += r.length - 1);
    }
  }
}
function us(t, e) {
  for (let i of t) if (e(i)) return i;
}
const fs = { toDOM: (t) => t, fromDOM: (t) => t, scale: 1 };
class ds {
  constructor(t, e, i) {
    let n = 0,
      s = 0,
      r = 0;
    (this.viewports = i.map(({ from: i, to: s }) => {
      let r = e.lineAt(i, $n.ByPos, t, 0, 0).top,
        o = e.lineAt(s, $n.ByPos, t, 0, 0).bottom;
      return (
        (n += o - r),
        { from: i, to: s, top: r, bottom: o, domTop: 0, domBottom: 0 }
      );
    })),
      (this.scale = (7e6 - n) / (e.height - n));
    for (let t of this.viewports)
      (t.domTop = r + (t.top - s) * this.scale),
        (r = t.domBottom = t.domTop + (t.bottom - t.top)),
        (s = t.bottom);
  }
  toDOM(t) {
    for (let e = 0, i = 0, n = 0; ; e++) {
      let s = e < this.viewports.length ? this.viewports[e] : null;
      if (!s || t < s.top) return n + (t - i) * this.scale;
      if (t <= s.bottom) return s.domTop + (t - s.top);
      (i = s.bottom), (n = s.domBottom);
    }
  }
  fromDOM(t) {
    for (let e = 0, i = 0, n = 0; ; e++) {
      let s = e < this.viewports.length ? this.viewports[e] : null;
      if (!s || t < s.domTop) return i + (t - n) / this.scale;
      if (t <= s.domBottom) return s.top + (t - s.domTop);
      (i = s.bottom), (n = s.domBottom);
    }
  }
}
function ps(t, e) {
  if (1 == e.scale) return t;
  let i = e.toDOM(t.top),
    n = e.toDOM(t.bottom);
  return new Un(
    t.from,
    t.length,
    i,
    n - i,
    Array.isArray(t.type) ? t.type.map((t) => ps(t, e)) : t.type
  );
}
const ms = V.define({ combine: (t) => t.join(" ") }),
  gs = V.define({ combine: (t) => t.indexOf(!0) > -1 }),
  vs = Rt.newName(),
  ws = Rt.newName(),
  ys = Rt.newName(),
  bs = { "&light": "." + ws, "&dark": "." + ys };
function xs(t, e, i) {
  return new Rt(e, {
    finish: (e) =>
      /&/.test(e)
        ? e.replace(/&\w*/, (e) => {
            if ("&" == e) return t;
            if (!i || !i[e]) throw new RangeError(`Unsupported selector: ${e}`);
            return i[e];
          })
        : t + " " + e,
  });
}
const ks = xs(
    "." + vs,
    {
      "&.cm-editor": {
        position: "relative !important",
        boxSizing: "border-box",
        "&.cm-focused": { outline: "1px dotted #212121" },
        display: "flex !important",
        flexDirection: "column",
      },
      ".cm-scroller": {
        display: "flex !important",
        alignItems: "flex-start !important",
        fontFamily: "monospace",
        lineHeight: 1.4,
        height: "100%",
        overflowX: "auto",
        position: "relative",
        zIndex: 0,
      },
      ".cm-content": {
        margin: 0,
        flexGrow: 2,
        minHeight: "100%",
        display: "block",
        whiteSpace: "pre",
        wordWrap: "normal",
        boxSizing: "border-box",
        padding: "4px 0",
        outline: "none",
        "&[contenteditable=true]": {
          WebkitUserModify: "read-write-plaintext-only",
        },
      },
      ".cm-lineWrapping": {
        whiteSpace_fallback: "pre-wrap",
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      },
      "&light .cm-content": { caretColor: "black" },
      "&dark .cm-content": { caretColor: "white" },
      ".cm-line": { display: "block", padding: "0 2px 0 4px" },
      ".cm-selectionLayer": { zIndex: -1, contain: "size style" },
      ".cm-selectionBackground": { position: "absolute" },
      "&light .cm-selectionBackground": { background: "#d9d9d9" },
      "&dark .cm-selectionBackground": { background: "#222" },
      "&light.cm-focused .cm-selectionBackground": { background: "#d7d4f0" },
      "&dark.cm-focused .cm-selectionBackground": { background: "#233" },
      ".cm-cursorLayer": {
        zIndex: 100,
        contain: "size style",
        pointerEvents: "none",
      },
      "&.cm-focused .cm-cursorLayer": {
        animation: "steps(1) cm-blink 1.2s infinite",
      },
      "@keyframes cm-blink": {
        "0%": {},
        "50%": { visibility: "hidden" },
        "100%": {},
      },
      "@keyframes cm-blink2": {
        "0%": {},
        "50%": { visibility: "hidden" },
        "100%": {},
      },
      ".cm-cursor, .cm-dropCursor": {
        position: "absolute",
        borderLeft: "1.2px solid black",
        marginLeft: "-0.6px",
        pointerEvents: "none",
      },
      ".cm-cursor": { display: "none" },
      "&dark .cm-cursor": { borderLeftColor: "#444" },
      "&.cm-focused .cm-cursor": { display: "block" },
      "&light .cm-activeLine": { backgroundColor: "#f3f9ff" },
      "&dark .cm-activeLine": { backgroundColor: "#223039" },
      "&light .cm-specialChar": { color: "red" },
      "&dark .cm-specialChar": { color: "#f78" },
      ".cm-tab": {
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
      },
      ".cm-widgetBuffer": {
        verticalAlign: "text-top",
        height: "1em",
        display: "inline",
      },
      ".cm-placeholder": {
        color: "#888",
        display: "inline-block",
        verticalAlign: "top",
      },
      ".cm-button": {
        verticalAlign: "middle",
        color: "inherit",
        fontSize: "70%",
        padding: ".2em 1em",
        borderRadius: "1px",
      },
      "&light .cm-button": {
        backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
        border: "1px solid #888",
        "&:active": { backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)" },
      },
      "&dark .cm-button": {
        backgroundImage: "linear-gradient(#393939, #111)",
        border: "1px solid #888",
        "&:active": { backgroundImage: "linear-gradient(#111, #333)" },
      },
      ".cm-textfield": {
        verticalAlign: "middle",
        color: "inherit",
        fontSize: "70%",
        border: "1px solid silver",
        padding: ".2em .5em",
      },
      "&light .cm-textfield": { backgroundColor: "white" },
      "&dark .cm-textfield": {
        border: "1px solid #555",
        backgroundColor: "inherit",
      },
    },
    bs
  ),
  Ss = {
    childList: !0,
    characterData: !0,
    subtree: !0,
    attributes: !0,
    characterDataOldValue: !0,
  },
  As = We.ie && We.ie_version <= 11;
class Cs {
  constructor(t, e, i) {
    (this.view = t),
      (this.onChange = e),
      (this.onScrollChanged = i),
      (this.active = !1),
      (this.selectionRange = new pe()),
      (this.selectionChanged = !1),
      (this.delayedFlush = -1),
      (this.resizeTimeout = -1),
      (this.queue = []),
      (this.delayedAndroidKey = null),
      (this.scrollTargets = []),
      (this.intersection = null),
      (this.resize = null),
      (this.intersecting = !1),
      (this.gapIntersection = null),
      (this.gaps = []),
      (this.parentCheck = -1),
      (this.dom = t.contentDOM),
      (this.observer = new MutationObserver((e) => {
        for (let t of e) this.queue.push(t);
        ((We.ie && We.ie_version <= 11) || (We.ios && t.composing)) &&
        e.some(
          (t) =>
            ("childList" == t.type && t.removedNodes.length) ||
            ("characterData" == t.type &&
              t.oldValue.length > t.target.nodeValue.length)
        )
          ? this.flushSoon()
          : this.flush();
      })),
      As &&
        (this.onCharData = (t) => {
          this.queue.push({
            target: t.target,
            type: "characterData",
            oldValue: t.prevValue,
          }),
            this.flushSoon();
        }),
      (this.onSelectionChange = this.onSelectionChange.bind(this)),
      window.addEventListener(
        "resize",
        (this.onResize = this.onResize.bind(this))
      ),
      "function" == typeof ResizeObserver &&
        ((this.resize = new ResizeObserver(() => {
          this.view.docView.lastUpdate < Date.now() - 75 && this.onResize();
        })),
        this.resize.observe(t.scrollDOM)),
      window.addEventListener(
        "beforeprint",
        (this.onPrint = this.onPrint.bind(this))
      ),
      this.start(),
      window.addEventListener(
        "scroll",
        (this.onScroll = this.onScroll.bind(this))
      ),
      "function" == typeof IntersectionObserver &&
        ((this.intersection = new IntersectionObserver((t) => {
          this.parentCheck < 0 &&
            (this.parentCheck = setTimeout(
              this.listenForScroll.bind(this),
              1e3
            )),
            t.length > 0 &&
              t[t.length - 1].intersectionRatio > 0 != this.intersecting &&
              ((this.intersecting = !this.intersecting),
              this.intersecting != this.view.inView &&
                this.onScrollChanged(document.createEvent("Event")));
        }, {})),
        this.intersection.observe(this.dom),
        (this.gapIntersection = new IntersectionObserver((t) => {
          t.length > 0 &&
            t[t.length - 1].intersectionRatio > 0 &&
            this.onScrollChanged(document.createEvent("Event"));
        }, {}))),
      this.listenForScroll(),
      this.readSelectionRange(),
      this.dom.ownerDocument.addEventListener(
        "selectionchange",
        this.onSelectionChange
      );
  }
  onScroll(t) {
    this.intersecting && this.flush(!1), this.onScrollChanged(t);
  }
  onResize() {
    this.resizeTimeout < 0 &&
      (this.resizeTimeout = setTimeout(() => {
        (this.resizeTimeout = -1), this.view.requestMeasure();
      }, 50));
  }
  onPrint() {
    (this.view.viewState.printing = !0),
      this.view.measure(),
      setTimeout(() => {
        (this.view.viewState.printing = !1), this.view.requestMeasure();
      }, 500);
  }
  updateGaps(t) {
    if (
      this.gapIntersection &&
      (t.length != this.gaps.length || this.gaps.some((e, i) => e != t[i]))
    ) {
      this.gapIntersection.disconnect();
      for (let e of t) this.gapIntersection.observe(e);
      this.gaps = t;
    }
  }
  onSelectionChange(t) {
    if (!this.readSelectionRange() || this.delayedAndroidKey) return;
    let { view: e } = this,
      i = this.selectionRange;
    if (e.state.facet(Ci) ? e.root.activeElement != this.dom : !re(e.dom, i))
      return;
    let n = i.anchorNode && e.docView.nearest(i.anchorNode);
    (n && n.ignoreEvent(t)) ||
      (((We.ie && We.ie_version <= 11) || (We.android && We.chrome)) &&
      !e.state.selection.main.empty &&
      i.focusNode &&
      le(i.focusNode, i.focusOffset, i.anchorNode, i.anchorOffset)
        ? this.flushSoon()
        : this.flush(!1));
  }
  readSelectionRange() {
    let { root: t } = this.view,
      e = ne(t),
      i =
        (We.safari &&
          11 == t.nodeType &&
          (function () {
            let t = document.activeElement;
            for (; t && t.shadowRoot; ) t = t.shadowRoot.activeElement;
            return t;
          })() == this.view.contentDOM &&
          (function (t) {
            let e = null;
            function i(t) {
              t.preventDefault(),
                t.stopImmediatePropagation(),
                (e = t.getTargetRanges()[0]);
            }
            if (
              (t.contentDOM.addEventListener("beforeinput", i, !0),
              document.execCommand("indent"),
              t.contentDOM.removeEventListener("beforeinput", i, !0),
              !e)
            )
              return null;
            let n = e.startContainer,
              s = e.startOffset,
              r = e.endContainer,
              o = e.endOffset,
              l = t.docView.domAtPos(t.state.selection.main.anchor);
            le(l.node, l.offset, r, o) && ([n, s, r, o] = [r, o, n, s]);
            return {
              anchorNode: n,
              anchorOffset: s,
              focusNode: r,
              focusOffset: o,
            };
          })(this.view)) ||
        e;
    return (
      !this.selectionRange.eq(i) &&
      (this.selectionRange.setRange(i), (this.selectionChanged = !0))
    );
  }
  setSelectionRange(t, e) {
    this.selectionRange.set(t.node, t.offset, e.node, e.offset),
      (this.selectionChanged = !1);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let t = 0,
      e = null;
    for (let i = this.dom; i; )
      if (1 == i.nodeType)
        !e && t < this.scrollTargets.length && this.scrollTargets[t] == i
          ? t++
          : e || (e = this.scrollTargets.slice(0, t)),
          e && e.push(i),
          (i = i.assignedSlot || i.parentNode);
      else {
        if (11 != i.nodeType) break;
        i = i.host;
      }
    if (
      (t < this.scrollTargets.length &&
        !e &&
        (e = this.scrollTargets.slice(0, t)),
      e)
    ) {
      for (let t of this.scrollTargets)
        t.removeEventListener("scroll", this.onScroll);
      for (let t of (this.scrollTargets = e))
        t.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(t) {
    if (!this.active) return t();
    try {
      return this.stop(), t();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active ||
      (this.observer.observe(this.dom, Ss),
      As &&
        this.dom.addEventListener("DOMCharacterDataModified", this.onCharData),
      (this.active = !0));
  }
  stop() {
    this.active &&
      ((this.active = !1),
      this.observer.disconnect(),
      As &&
        this.dom.removeEventListener(
          "DOMCharacterDataModified",
          this.onCharData
        ));
  }
  clear() {
    this.processRecords(),
      (this.queue.length = 0),
      (this.selectionChanged = !1);
  }
  delayAndroidKey(t, e) {
    this.delayedAndroidKey ||
      requestAnimationFrame(() => {
        let t = this.delayedAndroidKey;
        this.delayedAndroidKey = null;
        let e = this.view.state;
        ye(this.view.contentDOM, t.key, t.keyCode)
          ? this.processRecords()
          : this.flush(),
          this.view.state == e && this.view.update([]);
      }),
      (this.delayedAndroidKey && "Enter" != t) ||
        (this.delayedAndroidKey = { key: t, keyCode: e });
  }
  flushSoon() {
    this.delayedFlush < 0 &&
      (this.delayedFlush = window.setTimeout(() => {
        (this.delayedFlush = -1), this.flush();
      }, 20));
  }
  forceFlush() {
    this.delayedFlush >= 0 &&
      (window.clearTimeout(this.delayedFlush),
      (this.delayedFlush = -1),
      this.flush());
  }
  processRecords() {
    let t = this.queue;
    for (let e of this.observer.takeRecords()) t.push(e);
    t.length && (this.queue = []);
    let e = -1,
      i = -1,
      n = !1;
    for (let s of t) {
      let t = this.readMutation(s);
      t &&
        (t.typeOver && (n = !0),
        -1 == e
          ? ({ from: e, to: i } = t)
          : ((e = Math.min(t.from, e)), (i = Math.max(t.to, i))));
    }
    return { from: e, to: i, typeOver: n };
  }
  flush(t = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey) return;
    t && this.readSelectionRange();
    let { from: e, to: i, typeOver: n } = this.processRecords(),
      s = this.selectionChanged && re(this.dom, this.selectionRange);
    if (e < 0 && !s) return;
    this.selectionChanged = !1;
    let r = this.view.state;
    this.onChange(e, i, n), this.view.state == r && this.view.update([]);
  }
  readMutation(t) {
    let e = this.view.docView.nearest(t.target);
    if (!e || e.ignoreMutation(t)) return null;
    if (
      (e.markDirty("attributes" == t.type),
      "attributes" == t.type && (e.dirty |= 4),
      "childList" == t.type)
    ) {
      let i = Ms(e, t.previousSibling || t.target.previousSibling, -1),
        n = Ms(e, t.nextSibling || t.target.nextSibling, 1);
      return {
        from: i ? e.posAfter(i) : e.posAtStart,
        to: n ? e.posBefore(n) : e.posAtEnd,
        typeOver: !1,
      };
    }
    return "characterData" == t.type
      ? {
          from: e.posAtStart,
          to: e.posAtEnd,
          typeOver: t.target.nodeValue == t.oldValue,
        }
      : null;
  }
  destroy() {
    var t, e, i;
    this.stop(),
      null === (t = this.intersection) || void 0 === t || t.disconnect(),
      null === (e = this.gapIntersection) || void 0 === e || e.disconnect(),
      null === (i = this.resize) || void 0 === i || i.disconnect();
    for (let t of this.scrollTargets)
      t.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("scroll", this.onScroll),
      window.removeEventListener("resize", this.onResize),
      window.removeEventListener("beforeprint", this.onPrint),
      this.dom.ownerDocument.removeEventListener(
        "selectionchange",
        this.onSelectionChange
      ),
      clearTimeout(this.parentCheck),
      clearTimeout(this.resizeTimeout);
  }
}
function Ms(t, e, i) {
  for (; e; ) {
    let n = Se.get(e);
    if (n && n.parent == t) return n;
    let s = e.parentNode;
    e = s != t.dom ? s : i > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function Ds(t, e, i, n) {
  let s,
    r,
    o = t.state.selection.main;
  if (e > -1) {
    let n = t.docView.domBoundsAround(e, i, 0);
    if (!n || t.state.readOnly) return;
    let { from: l, to: h } = n,
      a =
        t.docView.impreciseHead || t.docView.impreciseAnchor
          ? []
          : (function (t) {
              let e = [];
              if (t.root.activeElement != t.contentDOM) return e;
              let {
                anchorNode: i,
                anchorOffset: n,
                focusNode: s,
                focusOffset: r,
              } = t.observer.selectionRange;
              i &&
                (e.push(new en(i, n)),
                (s == i && r == n) || e.push(new en(s, r)));
              return e;
            })(t),
      c = new Zi(a, t.state);
    c.readRange(n.startDOM, n.endDOM);
    let u = o.from,
      f = null;
    ((8 === t.inputState.lastKeyCode &&
      t.inputState.lastKeyTime > Date.now() - 100) ||
      (We.android && c.text.length < h - l)) &&
      ((u = o.to), (f = "end"));
    let p = (function (t, e, i, n) {
      let s = Math.min(t.length, e.length),
        r = 0;
      for (; r < s && t.charCodeAt(r) == e.charCodeAt(r); ) r++;
      if (r == s && t.length == e.length) return null;
      let o = t.length,
        l = e.length;
      for (; o > 0 && l > 0 && t.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
        o--, l--;
      if ("end" == n) {
        i -= o + Math.max(0, r - Math.min(o, l)) - r;
      }
      if (o < r && t.length < e.length) {
        (r -= i <= r && i >= o ? r - i : 0), (l = r + (l - o)), (o = r);
      } else if (l < r) {
        (r -= i <= r && i >= l ? r - i : 0), (o = r + (o - l)), (l = r);
      }
      return { from: r, toA: o, toB: l };
    })(t.state.doc.sliceString(l, h, "￿"), c.text, u - l, f);
    p &&
      (We.chrome &&
        13 == t.inputState.lastKeyCode &&
        p.toB == p.from + 2 &&
        "￿￿" == c.text.slice(p.from, p.toB) &&
        p.toB--,
      (s = {
        from: l + p.from,
        to: l + p.toA,
        insert: d.of(c.text.slice(p.from, p.toB).split("￿")),
      })),
      (r = (function (t, e) {
        if (0 == t.length) return null;
        let i = t[0].pos,
          n = 2 == t.length ? t[1].pos : i;
        return i > -1 && n > -1 ? B.single(i + e, n + e) : null;
      })(a, l));
  } else if (t.hasFocus || !t.state.facet(Ci)) {
    let e = t.observer.selectionRange,
      { impreciseHead: i, impreciseAnchor: n } = t.docView,
      s =
        (i && i.node == e.focusNode && i.offset == e.focusOffset) ||
        !se(t.contentDOM, e.focusNode)
          ? t.state.selection.main.head
          : t.docView.posFromDOM(e.focusNode, e.focusOffset),
      l =
        (n && n.node == e.anchorNode && n.offset == e.anchorOffset) ||
        !se(t.contentDOM, e.anchorNode)
          ? t.state.selection.main.anchor
          : t.docView.posFromDOM(e.anchorNode, e.anchorOffset);
    (s == o.head && l == o.anchor) || (r = B.single(l, s));
  }
  if (s || r)
    if (
      (!s && n && !o.empty && r && r.main.empty
        ? (s = {
            from: o.from,
            to: o.to,
            insert: t.state.doc.slice(o.from, o.to),
          })
        : s &&
          s.from >= o.from &&
          s.to <= o.to &&
          (s.from != o.from || s.to != o.to) &&
          o.to - o.from - (s.to - s.from) <= 4 &&
          (s = {
            from: o.from,
            to: o.to,
            insert: t.state.doc
              .slice(o.from, s.from)
              .append(s.insert)
              .append(t.state.doc.slice(s.to, o.to)),
          }),
      s)
    ) {
      let e = t.state;
      if (We.ios && t.inputState.flushIOSKey(t)) return;
      if (
        We.android &&
        ((s.from == o.from &&
          s.to == o.to &&
          1 == s.insert.length &&
          2 == s.insert.lines &&
          ye(t.contentDOM, "Enter", 13)) ||
          (s.from == o.from - 1 &&
            s.to == o.to &&
            0 == s.insert.length &&
            ye(t.contentDOM, "Backspace", 8)) ||
          (s.from == o.from &&
            s.to == o.to + 1 &&
            0 == s.insert.length &&
            ye(t.contentDOM, "Delete", 46)))
      )
        return;
      let i,
        n = s.insert.toString();
      if (t.state.facet(yi).some((e) => e(t, s.from, s.to, n))) return;
      if (
        (t.inputState.composing >= 0 && t.inputState.composing++,
        s.from >= o.from &&
          s.to <= o.to &&
          s.to - s.from >= (o.to - o.from) / 3 &&
          (!r || (r.main.empty && r.main.from == s.from + s.insert.length)) &&
          t.inputState.composing < 0)
      ) {
        let n = o.from < s.from ? e.sliceDoc(o.from, s.from) : "",
          r = o.to > s.to ? e.sliceDoc(s.to, o.to) : "";
        i = e.replaceSelection(
          t.state.toText(
            n + s.insert.sliceString(0, void 0, t.state.lineBreak) + r
          )
        );
      } else {
        let n = e.changes(s),
          l =
            r && !e.selection.main.eq(r.main) && r.main.to <= n.newLength
              ? r.main
              : void 0;
        if (
          e.selection.ranges.length > 1 &&
          t.inputState.composing >= 0 &&
          s.to <= o.to &&
          s.to >= o.to - 10
        ) {
          let r = t.state.sliceDoc(s.from, s.to),
            h = rn(t) || t.state.doc.lineAt(o.head),
            a = o.to - s.to,
            c = o.to - o.from;
          i = e.changeByRange((i) => {
            if (i.from == o.from && i.to == o.to)
              return { changes: n, range: l || i.map(n) };
            let u = i.to - a,
              f = u - r.length;
            if (
              i.to - i.from != c ||
              t.state.sliceDoc(f, u) != r ||
              (h && i.to >= h.from && i.from <= h.to)
            )
              return { range: i };
            let d = e.changes({ from: f, to: u, insert: s.insert }),
              p = i.to - o.to;
            return {
              changes: d,
              range: l
                ? B.range(Math.max(0, l.anchor + p), Math.max(0, l.head + p))
                : i.map(d),
            };
          });
        } else i = { changes: n, selection: l && e.selection.replaceRange(l) };
      }
      let l = "input.type";
      t.composing &&
        ((l += ".compose"),
        t.inputState.compositionFirstChange &&
          ((l += ".start"), (t.inputState.compositionFirstChange = !1))),
        t.dispatch(i, { scrollIntoView: !0, userEvent: l });
    } else if (r && !r.main.eq(o)) {
      let e = !1,
        i = "select";
      t.inputState.lastSelectionTime > Date.now() - 50 &&
        ("select" == t.inputState.lastSelectionOrigin && (e = !0),
        (i = t.inputState.lastSelectionOrigin)),
        t.dispatch({ selection: r, scrollIntoView: e, userEvent: i });
    }
}
class Os {
  constructor(t = {}) {
    (this.plugins = []),
      (this.pluginMap = new Map()),
      (this.editorAttrs = {}),
      (this.contentAttrs = {}),
      (this.bidiCache = []),
      (this.destroyed = !1),
      (this.updateState = 2),
      (this.measureScheduled = -1),
      (this.measureRequests = []),
      (this.contentDOM = document.createElement("div")),
      (this.scrollDOM = document.createElement("div")),
      (this.scrollDOM.tabIndex = -1),
      (this.scrollDOM.className = "cm-scroller"),
      this.scrollDOM.appendChild(this.contentDOM),
      (this.announceDOM = document.createElement("div")),
      (this.announceDOM.style.cssText = "position: absolute; top: -10000px"),
      this.announceDOM.setAttribute("aria-live", "polite"),
      (this.dom = document.createElement("div")),
      this.dom.appendChild(this.announceDOM),
      this.dom.appendChild(this.scrollDOM),
      (this._dispatch = t.dispatch || ((t) => this.update([t]))),
      (this.dispatch = this.dispatch.bind(this)),
      (this.root =
        t.root ||
        (function (t) {
          for (; t; ) {
            if (t && (9 == t.nodeType || (11 == t.nodeType && t.host)))
              return t;
            t = t.assignedSlot || t.parentNode;
          }
          return null;
        })(t.parent) ||
        document),
      (this.viewState = new rs(t.state || Ct.create())),
      (this.plugins = this.state.facet(Ti).map((t) => new Li(t)));
    for (let t of this.plugins) t.update(this);
    (this.observer = new Cs(
      this,
      (t, e, i) => {
        Ds(this, t, e, i);
      },
      (t) => {
        this.inputState.runScrollHandlers(this, t),
          this.observer.intersecting && this.measure();
      }
    )),
      (this.inputState = new bn(this)),
      (this.docView = new nn(this)),
      this.mountStyles(),
      this.updateAttrs(),
      (this.updateState = 0),
      this.requestMeasure(),
      t.parent && t.parent.appendChild(this.dom);
  }
  get state() {
    return this.viewState.state;
  }
  get viewport() {
    return this.viewState.viewport;
  }
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  get inView() {
    return this.viewState.inView;
  }
  get composing() {
    return this.inputState.composing > 0;
  }
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  dispatch(...t) {
    this._dispatch(
      1 == t.length && t[0] instanceof pt ? t[0] : this.state.update(...t)
    );
  }
  update(t) {
    if (0 != this.updateState)
      throw new Error(
        "Calls to EditorView.update are not allowed while an update is in progress"
      );
    let e,
      i = !1,
      n = this.state;
    for (let e of t) {
      if (e.startState != n)
        throw new RangeError(
          "Trying to update state with a transaction that doesn't start from the previous state."
        );
      n = e.state;
    }
    if (this.destroyed) return void (this.viewState.state = n);
    if (n.facet(Ct.phrases) != this.state.facet(Ct.phrases))
      return this.setState(n);
    e = new Hi(this, n, t);
    let s = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let e of t) {
        if ((s && (s = s.map(e.changes)), e.scrollIntoView)) {
          let { main: t } = e.state.selection;
          s = new ki(
            t.empty ? t : B.cursor(t.head, t.head > t.anchor ? -1 : 1)
          );
        }
        for (let t of e.effects)
          t.is(bi)
            ? (s = new ki(t.value))
            : t.is(xi)
            ? (s = new ki(t.value, "center"))
            : t.is(Si) && (s = t.value);
      }
      this.viewState.update(e, s),
        (this.bidiCache = Ls.update(this.bidiCache, e.changes)),
        e.empty || (this.updatePlugins(e), this.inputState.update(e)),
        (i = this.docView.update(e)),
        this.state.facet(Ii) != this.styleModules && this.mountStyles(),
        this.updateAttrs(),
        this.showAnnouncements(t),
        this.docView.updateSelection(
          i,
          t.some((t) => t.isUserEvent("select.pointer"))
        );
    } finally {
      this.updateState = 0;
    }
    if (
      (e.startState.facet(ms) != e.state.facet(ms) &&
        (this.viewState.mustMeasureContent = !0),
      (i ||
        s ||
        this.viewState.mustEnforceCursorAssoc ||
        this.viewState.mustMeasureContent) &&
        this.requestMeasure(),
      !e.empty)
    )
      for (let t of this.state.facet(wi)) t(e);
  }
  setState(t) {
    if (0 != this.updateState)
      throw new Error(
        "Calls to EditorView.setState are not allowed while an update is in progress"
      );
    if (this.destroyed) return void (this.viewState.state = t);
    this.updateState = 2;
    let e = this.hasFocus;
    try {
      for (let t of this.plugins) t.destroy(this);
      (this.viewState = new rs(t)),
        (this.plugins = t.facet(Ti).map((t) => new Li(t))),
        this.pluginMap.clear();
      for (let t of this.plugins) t.update(this);
      (this.docView = new nn(this)),
        this.inputState.ensureHandlers(this),
        this.mountStyles(),
        this.updateAttrs(),
        (this.bidiCache = []);
    } finally {
      this.updateState = 0;
    }
    e && this.focus(), this.requestMeasure();
  }
  updatePlugins(t) {
    let e = t.startState.facet(Ti),
      i = t.state.facet(Ti);
    if (e != i) {
      let n = [];
      for (let s of i) {
        let i = e.indexOf(s);
        if (i < 0) n.push(new Li(s));
        else {
          let e = this.plugins[i];
          (e.mustUpdate = t), n.push(e);
        }
      }
      for (let e of this.plugins) e.mustUpdate != t && e.destroy(this);
      (this.plugins = n),
        this.pluginMap.clear(),
        this.inputState.ensureHandlers(this);
    } else for (let e of this.plugins) e.mustUpdate = t;
    for (let t = 0; t < this.plugins.length; t++) this.plugins[t].update(this);
  }
  measure(t = !0) {
    if (this.destroyed) return;
    this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled),
      (this.measureScheduled = 0),
      t && this.observer.flush();
    let e = null;
    try {
      for (let t = 0; ; t++) {
        this.updateState = 1;
        let i = this.viewport,
          n = this.viewState.measure(this);
        if (
          !n &&
          !this.measureRequests.length &&
          null == this.viewState.scrollTarget
        )
          break;
        if (t > 5) {
          console.warn(
            this.measureRequests.length
              ? "Measure loop restarted more than 5 times"
              : "Viewport failed to stabilize"
          );
          break;
        }
        let s = [];
        4 & n || ([this.measureRequests, s] = [s, this.measureRequests]);
        let r = s.map((t) => {
            try {
              return t.read(this);
            } catch (t) {
              return Ai(this.state, t), Es;
            }
          }),
          o = new Hi(this, this.state),
          l = !1,
          h = !1;
        (o.flags |= n),
          e ? (e.flags |= n) : (e = o),
          (this.updateState = 2),
          o.empty ||
            (this.updatePlugins(o),
            this.inputState.update(o),
            this.updateAttrs(),
            (l = this.docView.update(o)));
        for (let t = 0; t < s.length; t++)
          if (r[t] != Es)
            try {
              let e = s[t];
              e.write && e.write(r[t], this);
            } catch (t) {
              Ai(this.state, t);
            }
        if (
          (this.viewState.scrollTarget &&
            (this.docView.scrollIntoView(this.viewState.scrollTarget),
            (this.viewState.scrollTarget = null),
            (h = !0)),
          l && this.docView.updateSelection(!0),
          this.viewport.from == i.from &&
            this.viewport.to == i.to &&
            !h &&
            0 == this.measureRequests.length)
        )
          break;
      }
    } finally {
      (this.updateState = 0), (this.measureScheduled = -1);
    }
    if (e && !e.empty) for (let t of this.state.facet(wi)) t(e);
  }
  get themeClasses() {
    return (
      vs + " " + (this.state.facet(gs) ? ys : ws) + " " + this.state.facet(ms)
    );
  }
  updateAttrs() {
    let t = Bs(this, Bi, {
        class:
          "cm-editor" +
          (this.hasFocus ? " cm-focused " : " ") +
          this.themeClasses,
      }),
      e = {
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        translate: "no",
        contenteditable: this.state.facet(Ci) ? "true" : "false",
        class: "cm-content",
        style: `${We.tabSize}: ${this.state.tabSize}`,
        role: "textbox",
        "aria-multiline": "true",
      };
    this.state.readOnly && (e["aria-readonly"] = "true"),
      Bs(this, Pi, e),
      this.observer.ignore(() => {
        Ze(this.contentDOM, this.contentAttrs, e),
          Ze(this.dom, this.editorAttrs, t);
      }),
      (this.editorAttrs = t),
      (this.contentAttrs = e);
  }
  showAnnouncements(t) {
    let e = !0;
    for (let i of t)
      for (let t of i.effects)
        if (t.is(Os.announce)) {
          e && (this.announceDOM.textContent = ""),
            (e = !1),
            (this.announceDOM.appendChild(
              document.createElement("div")
            ).textContent = t.value);
        }
  }
  mountStyles() {
    (this.styleModules = this.state.facet(Ii)),
      Rt.mount(this.root, this.styleModules.concat(ks).reverse());
  }
  readMeasured() {
    if (2 == this.updateState)
      throw new Error(
        "Reading the editor layout isn't allowed during an update"
      );
    0 == this.updateState && this.measureScheduled > -1 && this.measure(!1);
  }
  requestMeasure(t) {
    if (
      (this.measureScheduled < 0 &&
        (this.measureScheduled = requestAnimationFrame(() => this.measure())),
      t)
    ) {
      if (null != t.key)
        for (let e = 0; e < this.measureRequests.length; e++)
          if (this.measureRequests[e].key === t.key)
            return void (this.measureRequests[e] = t);
      this.measureRequests.push(t);
    }
  }
  pluginField(t) {
    let e = [];
    for (let i of this.plugins) i.update(this).takeField(t, e);
    return e;
  }
  plugin(t) {
    let e = this.pluginMap.get(t);
    return (
      (void 0 === e || (e && e.spec != t)) &&
        this.pluginMap.set(
          t,
          (e = this.plugins.find((e) => e.spec == t) || null)
        ),
      e && e.update(this).value
    );
  }
  get documentTop() {
    return (
      this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop
    );
  }
  get documentPadding() {
    return {
      top: this.viewState.paddingTop,
      bottom: this.viewState.paddingBottom,
    };
  }
  blockAtHeight(t, e) {
    let i = Rs(e, this);
    return this.elementAtHeight(t - i).moveY(i);
  }
  elementAtHeight(t) {
    return this.readMeasured(), this.viewState.elementAtHeight(t);
  }
  visualLineAtHeight(t, e) {
    let i = Rs(e, this);
    return this.lineBlockAtHeight(t - i).moveY(i);
  }
  lineBlockAtHeight(t) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(t);
  }
  viewportLines(t, e) {
    let i = Rs(e, this);
    for (let e of this.viewportLineBlocks) t(e.moveY(i));
  }
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  visualLineAt(t, e = 0) {
    return this.lineBlockAt(t).moveY(e + this.viewState.paddingTop);
  }
  lineBlockAt(t) {
    return this.viewState.lineBlockAt(t);
  }
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  moveByChar(t, e, i) {
    return yn(this, t, wn(this, t, e, i));
  }
  moveByGroup(t, e) {
    return yn(
      this,
      t,
      wn(this, t, e, (e) =>
        (function (t, e, i) {
          let n = t.state.charCategorizer(e),
            s = n(i);
          return (t) => {
            let e = n(t);
            return s == xt.Space && (s = e), s == e;
          };
        })(this, t.head, e)
      )
    );
  }
  moveToLineBoundary(t, e, i = !0) {
    return (function (t, e, i, n) {
      let s = t.state.doc.lineAt(e.head),
        r =
          n && t.lineWrapping
            ? t.coordsAtPos(
                e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head
              )
            : null;
      if (r) {
        let e = t.dom.getBoundingClientRect(),
          n = t.posAtCoords({
            x: i == (t.textDirection == Wi.LTR) ? e.right - 1 : e.left + 1,
            y: (r.top + r.bottom) / 2,
          });
        if (null != n) return B.cursor(n, i ? -1 : 1);
      }
      let o = hi.find(t.docView, e.head),
        l = o ? (i ? o.posAtEnd : o.posAtStart) : i ? s.to : s.from;
      return B.cursor(l, i ? -1 : 1);
    })(this, t, e, i);
  }
  moveVertically(t, e, i) {
    return yn(
      this,
      t,
      (function (t, e, i, n) {
        let s = e.head,
          r = i ? 1 : -1;
        if (s == (i ? t.state.doc.length : 0)) return B.cursor(s, e.assoc);
        let o,
          l = e.goalColumn,
          h = t.contentDOM.getBoundingClientRect(),
          a = t.coordsAtPos(s),
          c = t.documentTop;
        if (a)
          null == l && (l = a.left - h.left), (o = r < 0 ? a.top : a.bottom);
        else {
          let e = t.viewState.lineBlockAt(s - c);
          null == l &&
            (l = Math.min(
              h.right - h.left,
              t.defaultCharacterWidth * (s - e.from)
            )),
            (o = (r < 0 ? e.top : e.bottom) + c);
        }
        let u = h.left + l,
          f = null != n ? n : t.defaultLineHeight >> 1;
        for (let i = 0; ; i += 10) {
          let n = o + (f + i) * r,
            a = gn(t, { x: u, y: n }, !1, r);
          if (n < h.top || n > h.bottom || (r < 0 ? a < s : a > s))
            return B.cursor(a, e.assoc, void 0, l);
        }
      })(this, t, e, i)
    );
  }
  scrollPosIntoView(t) {
    this.dispatch({ effects: bi.of(B.cursor(t)) });
  }
  domAtPos(t) {
    return this.docView.domAtPos(t);
  }
  posAtDOM(t, e = 0) {
    return this.docView.posFromDOM(t, e);
  }
  posAtCoords(t, e = !0) {
    return this.readMeasured(), gn(this, t, e);
  }
  coordsAtPos(t, e = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(t, e);
    if (!i || i.left == i.right) return i;
    let n = this.state.doc.lineAt(t),
      s = this.bidiSpans(n);
    return fe(i, (s[Gi.find(s, t - n.from, -1, e)].dir == Wi.LTR) == e > 0);
  }
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  get textDirection() {
    return this.viewState.heightOracle.direction;
  }
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  bidiSpans(t) {
    if (t.length > Ts) return Yi(t.length);
    let e = this.textDirection;
    for (let i of this.bidiCache)
      if (i.from == t.from && i.dir == e) return i.order;
    let i = (function (t, e) {
      let i = t.length,
        n = e == zi ? 1 : 2,
        s = e == zi ? 2 : 1;
      if (!t || (1 == n && !Ki.test(t))) return Yi(i);
      for (let e = 0, s = n, o = n; e < i; e++) {
        let i =
          (r = t.charCodeAt(e)) <= 247
            ? _i[r]
            : 1424 <= r && r <= 1524
            ? 2
            : 1536 <= r && r <= 1785
            ? ji[r - 1536]
            : 1774 <= r && r <= 2220
            ? 4
            : (8192 <= r && r <= 8203) || 8204 == r
            ? 256
            : 1;
        512 == i ? (i = s) : 8 == i && 4 == o && (i = 16),
          (Ji[e] = 4 == i ? 2 : i),
          7 & i && (o = i),
          (s = i);
      }
      var r;
      for (let t = 0, e = n, s = n; t < i; t++) {
        let n = Ji[t];
        if (128 == n)
          t < i - 1 && e == Ji[t + 1] && 24 & e
            ? (n = Ji[t] = e)
            : (Ji[t] = 256);
        else if (64 == n) {
          let n = t + 1;
          for (; n < i && 64 == Ji[n]; ) n++;
          let r =
            (t && 8 == e) || (n < i && 8 == Ji[n]) ? (1 == s ? 1 : 8) : 256;
          for (let e = t; e < n; e++) Ji[e] = r;
          t = n - 1;
        } else 8 == n && 1 == s && (Ji[t] = 1);
        (e = n), 7 & n && (s = n);
      }
      for (let e, r, o, l = 0, h = 0, a = 0; l < i; l++)
        if ((r = Ui[(e = t.charCodeAt(l))]))
          if (r < 0) {
            for (let t = h - 3; t >= 0; t -= 3)
              if ($i[t + 1] == -r) {
                let e = $i[t + 2],
                  i = 2 & e ? n : 4 & e ? (1 & e ? s : n) : 0;
                i && (Ji[l] = Ji[$i[t]] = i), (h = t);
                break;
              }
          } else {
            if (189 == $i.length) break;
            ($i[h++] = l), ($i[h++] = e), ($i[h++] = a);
          }
        else if (2 == (o = Ji[l]) || 1 == o) {
          let t = o == n;
          a = t ? 0 : 1;
          for (let e = h - 3; e >= 0; e -= 3) {
            let i = $i[e + 2];
            if (2 & i) break;
            if (t) $i[e + 2] |= 2;
            else {
              if (4 & i) break;
              $i[e + 2] |= 4;
            }
          }
        }
      for (let t = 0; t < i; t++)
        if (256 == Ji[t]) {
          let e = t + 1;
          for (; e < i && 256 == Ji[e]; ) e++;
          let s = 1 == (t ? Ji[t - 1] : n),
            r = s == (1 == (e < i ? Ji[e] : n)) ? (s ? 1 : 2) : n;
          for (let i = t; i < e; i++) Ji[i] = r;
          t = e - 1;
        }
      let o = [];
      if (1 == n)
        for (let t = 0; t < i; ) {
          let e = t,
            n = 1 != Ji[t++];
          for (; t < i && n == (1 != Ji[t]); ) t++;
          if (n)
            for (let i = t; i > e; ) {
              let t = i,
                n = 2 != Ji[--i];
              for (; i > e && n == (2 != Ji[i - 1]); ) i--;
              o.push(new Gi(i, t, n ? 2 : 1));
            }
          else o.push(new Gi(e, t, 0));
        }
      else
        for (let t = 0; t < i; ) {
          let e = t,
            n = 2 == Ji[t++];
          for (; t < i && n == (2 == Ji[t]); ) t++;
          o.push(new Gi(e, t, n ? 1 : 2));
        }
      return o;
    })(t.text, this.textDirection);
    return this.bidiCache.push(new Ls(t.from, t.to, e, i)), i;
  }
  get hasFocus() {
    var t;
    return (
      (document.hasFocus() ||
        (We.safari &&
          (null === (t = this.inputState) || void 0 === t
            ? void 0
            : t.lastContextMenu) >
            Date.now() - 3e4)) &&
      this.root.activeElement == this.contentDOM
    );
  }
  focus() {
    this.observer.ignore(() => {
      ve(this.contentDOM), this.docView.updateSelection();
    });
  }
  destroy() {
    for (let t of this.plugins) t.destroy(this);
    (this.plugins = []),
      this.inputState.destroy(),
      this.dom.remove(),
      this.observer.destroy(),
      this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled),
      (this.destroyed = !0);
  }
  static scrollIntoView(t, e = {}) {
    return Si.of(
      new ki(
        "number" == typeof t ? B.cursor(t) : t,
        e.y,
        e.x,
        e.yMargin,
        e.xMargin
      )
    );
  }
  static domEventHandlers(t) {
    return Ri.define(() => ({}), { eventHandlers: t });
  }
  static theme(t, e) {
    let i = Rt.newName(),
      n = [ms.of(i), Ii.of(xs(`.${i}`, t))];
    return e && e.dark && n.push(gs.of(!0)), n;
  }
  static baseTheme(t) {
    return Y.lowest(Ii.of(xs("." + vs, t, bs)));
  }
}
(Os.scrollTo = bi),
  (Os.centerOn = xi),
  (Os.styleModule = Ii),
  (Os.inputHandler = yi),
  (Os.exceptionSink = vi),
  (Os.updateListener = wi),
  (Os.editable = Ci),
  (Os.mouseSelectionStyle = gi),
  (Os.dragMovesSelection = mi),
  (Os.clickAddsSelectionRange = pi),
  (Os.decorations = Ni),
  (Os.darkTheme = gs),
  (Os.contentAttributes = Pi),
  (Os.editorAttributes = Bi),
  (Os.lineWrapping = Os.contentAttributes.of({ class: "cm-lineWrapping" })),
  (Os.announce = dt.define());
const Ts = 4096;
function Rs(t, e) {
  return (
    (null == t ? e.contentDOM.getBoundingClientRect().top : t) +
    e.viewState.paddingTop
  );
}
const Es = {};
class Ls {
  constructor(t, e, i, n) {
    (this.from = t), (this.to = e), (this.dir = i), (this.order = n);
  }
  static update(t, e) {
    if (e.empty) return t;
    let i = [],
      n = t.length ? t[t.length - 1].dir : Wi.LTR;
    for (let s = Math.max(0, t.length - 10); s < t.length; s++) {
      let r = t[s];
      r.dir != n ||
        e.touchesRange(r.from, r.to) ||
        i.push(new Ls(e.mapPos(r.from, 1), e.mapPos(r.to, -1), r.dir, r.order));
    }
    return i;
  }
}
function Bs(t, e, i) {
  for (let n = t.state.facet(e), s = n.length - 1; s >= 0; s--) {
    let e = n[s],
      r = "function" == typeof e ? e(t) : e;
    r && Xe(r, i);
  }
  return i;
}
const Ps = We.mac ? "mac" : We.windows ? "win" : We.linux ? "linux" : "key";
function Ns(t, e, i) {
  return (
    e.altKey && (t = "Alt-" + t),
    e.ctrlKey && (t = "Ctrl-" + t),
    e.metaKey && (t = "Meta-" + t),
    !1 !== i && e.shiftKey && (t = "Shift-" + t),
    t
  );
}
const Is = Os.domEventHandlers({
    keydown: (t, e) => Fs(Ws(e.state), t, e, "editor"),
  }),
  Vs = V.define({ enables: Is }),
  Hs = new WeakMap();
function Ws(t) {
  let e = t.facet(Vs),
    i = Hs.get(e);
  return (
    i ||
      Hs.set(
        e,
        (i = (function (t, e = Ps) {
          let i = Object.create(null),
            n = Object.create(null),
            s = (t, e) => {
              let i = n[t];
              if (null == i) n[t] = e;
              else if (i != e)
                throw new Error(
                  "Key binding " +
                    t +
                    " is used both as a regular binding and as a multi-stroke prefix"
                );
            },
            r = (t, n, r, o) => {
              let l = i[t] || (i[t] = Object.create(null)),
                h = n.split(/ (?!$)/).map((t) =>
                  (function (t, e) {
                    const i = t.split(/-(?!$)/);
                    let n,
                      s,
                      r,
                      o,
                      l = i[i.length - 1];
                    "Space" == l && (l = " ");
                    for (let t = 0; t < i.length - 1; ++t) {
                      const l = i[t];
                      if (/^(cmd|meta|m)$/i.test(l)) o = !0;
                      else if (/^a(lt)?$/i.test(l)) n = !0;
                      else if (/^(c|ctrl|control)$/i.test(l)) s = !0;
                      else if (/^s(hift)?$/i.test(l)) r = !0;
                      else {
                        if (!/^mod$/i.test(l))
                          throw new Error("Unrecognized modifier name: " + l);
                        "mac" == e ? (o = !0) : (s = !0);
                      }
                    }
                    return (
                      n && (l = "Alt-" + l),
                      s && (l = "Ctrl-" + l),
                      o && (l = "Meta-" + l),
                      r && (l = "Shift-" + l),
                      l
                    );
                  })(t, e)
                );
              for (let e = 1; e < h.length; e++) {
                let i = h.slice(0, e).join(" ");
                s(i, !0),
                  l[i] ||
                    (l[i] = {
                      preventDefault: !0,
                      commands: [
                        (e) => {
                          let n = (zs = { view: e, prefix: i, scope: t });
                          return (
                            setTimeout(() => {
                              zs == n && (zs = null);
                            }, 4e3),
                            !0
                          );
                        },
                      ],
                    });
              }
              let a = h.join(" ");
              s(a, !1);
              let c = l[a] || (l[a] = { preventDefault: !1, commands: [] });
              c.commands.push(r), o && (c.preventDefault = !0);
            };
          for (let i of t) {
            let t = i[e] || i.key;
            if (t)
              for (let e of i.scope ? i.scope.split(" ") : ["editor"])
                r(e, t, i.run, i.preventDefault),
                  i.shift && r(e, "Shift-" + t, i.shift, i.preventDefault);
          }
          return i;
        })(e.reduce((t, e) => t.concat(e), [])))
      ),
    i
  );
}
let zs = null;
function Fs(t, e, i, n) {
  let s = (function (t) {
      var e =
        (!(
          (te && (t.ctrlKey || t.altKey || t.metaKey)) ||
          (Zt && t.shiftKey && t.key && 1 == t.key.length) ||
          "Unidentified" == t.key
        ) &&
          t.key) ||
        (t.shiftKey ? Yt : Jt)[t.keyCode] ||
        t.key ||
        "Unidentified";
      return (
        "Esc" == e && (e = "Escape"),
        "Del" == e && (e = "Delete"),
        "Left" == e && (e = "ArrowLeft"),
        "Up" == e && (e = "ArrowUp"),
        "Right" == e && (e = "ArrowRight"),
        "Down" == e && (e = "ArrowDown"),
        e
      );
    })(e),
    r = 1 == s.length && " " != s,
    o = "",
    l = !1;
  zs &&
    zs.view == i &&
    zs.scope == n &&
    ((o = zs.prefix + " "), (l = kn.indexOf(e.keyCode) < 0) && (zs = null));
  let h,
    a = (t) => {
      if (t) {
        for (let e of t.commands) if (e(i)) return !0;
        t.preventDefault && (l = !0);
      }
      return !1;
    },
    c = t[n];
  if (c) {
    if (a(c[o + Ns(s, e, !r)])) return !0;
    if (
      r &&
      (e.shiftKey || e.altKey || e.metaKey) &&
      (h = Jt[e.keyCode]) &&
      h != s
    ) {
      if (a(c[o + Ns(h, e, !0)])) return !0;
    } else if (r && e.shiftKey && a(c[o + Ns(s, e, !0)])) return !0;
  }
  return l;
}
const qs = !We.ios,
  _s = V.define({
    combine: (t) =>
      Mt(
        t,
        { cursorBlinkRate: 1200, drawRangeCursor: !0 },
        {
          cursorBlinkRate: (t, e) => Math.min(t, e),
          drawRangeCursor: (t, e) => t || e,
        }
      ),
  });
function js(t = {}) {
  return [_s.of(t), $s, Gs];
}
class Us {
  constructor(t, e, i, n, s) {
    (this.left = t),
      (this.top = e),
      (this.width = i),
      (this.height = n),
      (this.className = s);
  }
  draw() {
    let t = document.createElement("div");
    return (t.className = this.className), this.adjust(t), t;
  }
  adjust(t) {
    (t.style.left = this.left + "px"),
      (t.style.top = this.top + "px"),
      this.width >= 0 && (t.style.width = this.width + "px"),
      (t.style.height = this.height + "px");
  }
  eq(t) {
    return (
      this.left == t.left &&
      this.top == t.top &&
      this.width == t.width &&
      this.height == t.height &&
      this.className == t.className
    );
  }
}
const $s = Ri.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.rangePieces = []),
          (this.cursors = []),
          (this.measureReq = {
            read: this.readPos.bind(this),
            write: this.drawSel.bind(this),
          }),
          (this.selectionLayer = t.scrollDOM.appendChild(
            document.createElement("div")
          )),
          (this.selectionLayer.className = "cm-selectionLayer"),
          this.selectionLayer.setAttribute("aria-hidden", "true"),
          (this.cursorLayer = t.scrollDOM.appendChild(
            document.createElement("div")
          )),
          (this.cursorLayer.className = "cm-cursorLayer"),
          this.cursorLayer.setAttribute("aria-hidden", "true"),
          t.requestMeasure(this.measureReq),
          this.setBlinkRate();
      }
      setBlinkRate() {
        this.cursorLayer.style.animationDuration =
          this.view.state.facet(_s).cursorBlinkRate + "ms";
      }
      update(t) {
        let e = t.startState.facet(_s) != t.state.facet(_s);
        (e || t.selectionSet || t.geometryChanged || t.viewportChanged) &&
          this.view.requestMeasure(this.measureReq),
          t.transactions.some((t) => t.scrollIntoView) &&
            (this.cursorLayer.style.animationName =
              "cm-blink" == this.cursorLayer.style.animationName
                ? "cm-blink2"
                : "cm-blink"),
          e && this.setBlinkRate();
      }
      readPos() {
        let { state: t } = this.view,
          e = t.facet(_s),
          i = t.selection.ranges
            .map((t) =>
              t.empty
                ? []
                : (function (t, e) {
                    if (e.to <= t.viewport.from || e.from >= t.viewport.to)
                      return [];
                    let i = Math.max(e.from, t.viewport.from),
                      n = Math.min(e.to, t.viewport.to),
                      s = t.textDirection == Wi.LTR,
                      r = t.contentDOM,
                      o = r.getBoundingClientRect(),
                      l = Js(t),
                      h = window.getComputedStyle(r.firstChild),
                      a =
                        o.left +
                        parseInt(h.paddingLeft) +
                        Math.min(0, parseInt(h.textIndent)),
                      c = o.right - parseInt(h.paddingRight),
                      u = Xs(t, i),
                      f = Xs(t, n),
                      d = u.type == ei.Text ? u : null,
                      p = f.type == ei.Text ? f : null;
                    t.lineWrapping &&
                      (d && (d = Ys(t, i, d)), p && (p = Ys(t, n, p)));
                    if (d && p && d.from == p.from)
                      return g(v(e.from, e.to, d));
                    {
                      let i = d ? v(e.from, null, d) : w(u, !1),
                        n = p ? v(null, e.to, p) : w(f, !0),
                        s = [];
                      return (
                        (d || u).to < (p || f).from - 1
                          ? s.push(m(a, i.bottom, c, n.top))
                          : i.bottom < n.top &&
                            t.elementAtHeight((i.bottom + n.top) / 2).type ==
                              ei.Text &&
                            (i.bottom = n.top = (i.bottom + n.top) / 2),
                        g(i).concat(s).concat(g(n))
                      );
                    }
                    function m(t, e, i, n) {
                      return new Us(
                        t - l.left,
                        e - l.top - 0.01,
                        i - t,
                        n - e + 0.01,
                        "cm-selectionBackground"
                      );
                    }
                    function g({ top: t, bottom: e, horizontal: i }) {
                      let n = [];
                      for (let s = 0; s < i.length; s += 2)
                        n.push(m(i[s], t, i[s + 1], e));
                      return n;
                    }
                    function v(e, i, n) {
                      let r = 1e9,
                        o = -1e9,
                        l = [];
                      function h(e, i, h, u, f) {
                        let d = t.coordsAtPos(e, e == n.to ? -2 : 2),
                          p = t.coordsAtPos(h, h == n.from ? 2 : -2);
                        (r = Math.min(d.top, p.top, r)),
                          (o = Math.max(d.bottom, p.bottom, o)),
                          f == Wi.LTR
                            ? l.push(s && i ? a : d.left, s && u ? c : p.right)
                            : l.push(
                                !s && u ? a : p.left,
                                !s && i ? c : d.right
                              );
                      }
                      let u = null != e ? e : n.from,
                        f = null != i ? i : n.to;
                      for (let n of t.visibleRanges)
                        if (n.to > u && n.from < f)
                          for (
                            let s = Math.max(n.from, u), r = Math.min(n.to, f);
                            ;

                          ) {
                            let n = t.state.doc.lineAt(s);
                            for (let o of t.bidiSpans(n)) {
                              let t = o.from + n.from,
                                l = o.to + n.from;
                              if (t >= r) break;
                              l > s &&
                                h(
                                  Math.max(t, s),
                                  null == e && t <= u,
                                  Math.min(l, r),
                                  null == i && l >= f,
                                  o.dir
                                );
                            }
                            if (((s = n.to + 1), s >= r)) break;
                          }
                      return (
                        0 == l.length &&
                          h(u, null == e, f, null == i, t.textDirection),
                        { top: r, bottom: o, horizontal: l }
                      );
                    }
                    function w(t, e) {
                      let i = o.top + (e ? t.top : t.bottom);
                      return { top: i, bottom: i, horizontal: [] };
                    }
                  })(this.view, t)
            )
            .reduce((t, e) => t.concat(e)),
          n = [];
        for (let i of t.selection.ranges) {
          let s = i == t.selection.main;
          if (i.empty ? !s || qs : e.drawRangeCursor) {
            let t = Qs(this.view, i, s);
            t && n.push(t);
          }
        }
        return { rangePieces: i, cursors: n };
      }
      drawSel({ rangePieces: t, cursors: e }) {
        if (
          t.length != this.rangePieces.length ||
          t.some((t, e) => !t.eq(this.rangePieces[e]))
        ) {
          this.selectionLayer.textContent = "";
          for (let e of t) this.selectionLayer.appendChild(e.draw());
          this.rangePieces = t;
        }
        if (
          e.length != this.cursors.length ||
          e.some((t, e) => !t.eq(this.cursors[e]))
        ) {
          let t = this.cursorLayer.children;
          if (t.length !== e.length) {
            this.cursorLayer.textContent = "";
            for (const t of e) this.cursorLayer.appendChild(t.draw());
          } else e.forEach((e, i) => e.adjust(t[i]));
          this.cursors = e;
        }
      }
      destroy() {
        this.selectionLayer.remove(), this.cursorLayer.remove();
      }
    }
  ),
  Ks = {
    ".cm-line": {
      "& ::selection": { backgroundColor: "transparent !important" },
      "&::selection": { backgroundColor: "transparent !important" },
    },
  };
qs && (Ks[".cm-line"].caretColor = "transparent !important");
const Gs = Y.highest(Os.theme(Ks));
function Js(t) {
  let e = t.scrollDOM.getBoundingClientRect();
  return {
    left:
      (t.textDirection == Wi.LTR ? e.left : e.right - t.scrollDOM.clientWidth) -
      t.scrollDOM.scrollLeft,
    top: e.top - t.scrollDOM.scrollTop,
  };
}
function Ys(t, e, i) {
  let n = B.cursor(e);
  return {
    from: Math.max(i.from, t.moveToLineBoundary(n, !1, !0).from),
    to: Math.min(i.to, t.moveToLineBoundary(n, !0, !0).from),
    type: ei.Text,
  };
}
function Xs(t, e) {
  let i = t.lineBlockAt(e);
  if (Array.isArray(i.type))
    for (let t of i.type)
      if (t.to > e || (t.to == e && (t.to == i.to || t.type == ei.Text)))
        return t;
  return i;
}
function Qs(t, e, i) {
  let n = t.coordsAtPos(e.head, e.assoc || 1);
  if (!n) return null;
  let s = Js(t);
  return new Us(
    n.left - s.left,
    n.top - s.top,
    -1,
    n.bottom - n.top,
    i ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary"
  );
}
function Zs() {
  return er;
}
const tr = ii.line({ class: "cm-activeLine" }),
  er = Ri.fromClass(
    class {
      constructor(t) {
        this.decorations = this.getDeco(t);
      }
      update(t) {
        (t.docChanged || t.selectionSet) &&
          (this.decorations = this.getDeco(t.view));
      }
      getDeco(t) {
        let e = -1,
          i = [];
        for (let n of t.state.selection.ranges) {
          if (!n.empty) return ii.none;
          let s = t.lineBlockAt(n.head);
          s.from > e && (i.push(tr.range(s.from)), (e = s.from));
        }
        return ii.set(i);
      }
    },
    { decorations: (t) => t.decorations }
  ),
  ir = 1024;
let nr = 0;
class sr {
  constructor(t, e) {
    (this.from = t), (this.to = e);
  }
}
class rr {
  constructor(t = {}) {
    (this.id = nr++),
      (this.perNode = !!t.perNode),
      (this.deserialize =
        t.deserialize ||
        (() => {
          throw new Error(
            "This node type doesn't define a deserialize function"
          );
        }));
  }
  add(t) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return (
      "function" != typeof t && (t = lr.match(t)),
      (e) => {
        let i = t(e);
        return void 0 === i ? null : [this, i];
      }
    );
  }
}
(rr.closedBy = new rr({ deserialize: (t) => t.split(" ") })),
  (rr.openedBy = new rr({ deserialize: (t) => t.split(" ") })),
  (rr.group = new rr({ deserialize: (t) => t.split(" ") })),
  (rr.contextHash = new rr({ perNode: !0 })),
  (rr.lookAhead = new rr({ perNode: !0 })),
  (rr.mounted = new rr({ perNode: !0 }));
const or = Object.create(null);
class lr {
  constructor(t, e, i, n = 0) {
    (this.name = t), (this.props = e), (this.id = i), (this.flags = n);
  }
  static define(t) {
    let e = t.props && t.props.length ? Object.create(null) : or,
      i =
        (t.top ? 1 : 0) |
        (t.skipped ? 2 : 0) |
        (t.error ? 4 : 0) |
        (null == t.name ? 8 : 0),
      n = new lr(t.name || "", e, t.id, i);
    if (t.props)
      for (let i of t.props)
        if ((Array.isArray(i) || (i = i(n)), i)) {
          if (i[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          e[i[0].id] = i[1];
        }
    return n;
  }
  prop(t) {
    return this.props[t.id];
  }
  get isTop() {
    return (1 & this.flags) > 0;
  }
  get isSkipped() {
    return (2 & this.flags) > 0;
  }
  get isError() {
    return (4 & this.flags) > 0;
  }
  get isAnonymous() {
    return (8 & this.flags) > 0;
  }
  is(t) {
    if ("string" == typeof t) {
      if (this.name == t) return !0;
      let e = this.prop(rr.group);
      return !!e && e.indexOf(t) > -1;
    }
    return this.id == t;
  }
  static match(t) {
    let e = Object.create(null);
    for (let i in t) for (let n of i.split(" ")) e[n] = t[i];
    return (t) => {
      for (let i = t.prop(rr.group), n = -1; n < (i ? i.length : 0); n++) {
        let s = e[n < 0 ? t.name : i[n]];
        if (s) return s;
      }
    };
  }
}
lr.none = new lr("", Object.create(null), 0, 8);
class hr {
  constructor(t) {
    this.types = t;
    for (let e = 0; e < t.length; e++)
      if (t[e].id != e)
        throw new RangeError(
          "Node type ids should correspond to array positions when creating a node set"
        );
  }
  extend(...t) {
    let e = [];
    for (let i of this.types) {
      let n = null;
      for (let e of t) {
        let t = e(i);
        t && (n || (n = Object.assign({}, i.props)), (n[t[0].id] = t[1]));
      }
      e.push(n ? new lr(i.name, n, i.id, i.flags) : i);
    }
    return new hr(e);
  }
}
const ar = new WeakMap(),
  cr = new WeakMap();
class ur {
  constructor(t, e, i, n, s) {
    if (
      ((this.type = t),
      (this.children = e),
      (this.positions = i),
      (this.length = n),
      (this.props = null),
      s && s.length)
    ) {
      this.props = Object.create(null);
      for (let [t, e] of s) this.props["number" == typeof t ? t : t.id] = e;
    }
  }
  toString() {
    let t = this.prop(rr.mounted);
    if (t && !t.overlay) return t.tree.toString();
    let e = "";
    for (let t of this.children) {
      let i = t.toString();
      i && (e && (e += ","), (e += i));
    }
    return this.type.name
      ? (/\W/.test(this.type.name) && !this.type.isError
          ? JSON.stringify(this.type.name)
          : this.type.name) + (e.length ? "(" + e + ")" : "")
      : e;
  }
  cursor(t, e = 0) {
    let i = (null != t && ar.get(this)) || this.topNode,
      n = new xr(i);
    return null != t && (n.moveTo(t, e), ar.set(this, n._tree)), n;
  }
  fullCursor() {
    return new xr(this.topNode, 1);
  }
  get topNode() {
    return new vr(this, 0, 0, null);
  }
  resolve(t, e = 0) {
    let i = gr(ar.get(this) || this.topNode, t, e, !1);
    return ar.set(this, i), i;
  }
  resolveInner(t, e = 0) {
    let i = gr(cr.get(this) || this.topNode, t, e, !0);
    return cr.set(this, i), i;
  }
  iterate(t) {
    let { enter: e, leave: i, from: n = 0, to: s = this.length } = t;
    for (let t = this.cursor(), r = () => t.node; ; ) {
      let o = !1;
      if (
        t.from <= s &&
        t.to >= n &&
        (t.type.isAnonymous || !1 !== e(t.type, t.from, t.to, r))
      ) {
        if (t.firstChild()) continue;
        t.type.isAnonymous || (o = !0);
      }
      for (
        ;
        o && i && i(t.type, t.from, t.to, r),
          (o = t.type.isAnonymous),
          !t.nextSibling();

      ) {
        if (!t.parent()) return;
        o = !0;
      }
    }
  }
  prop(t) {
    return t.perNode
      ? this.props
        ? this.props[t.id]
        : void 0
      : this.type.prop(t);
  }
  get propValues() {
    let t = [];
    if (this.props) for (let e in this.props) t.push([+e, this.props[e]]);
    return t;
  }
  balance(t = {}) {
    return this.children.length <= 8
      ? this
      : Cr(
          lr.none,
          this.children,
          this.positions,
          0,
          this.children.length,
          0,
          this.length,
          (t, e, i) => new ur(this.type, t, e, i, this.propValues),
          t.makeTree || ((t, e, i) => new ur(lr.none, t, e, i))
        );
  }
  static build(t) {
    return (function (t) {
      var e;
      let {
          buffer: i,
          nodeSet: n,
          maxBufferLength: s = ir,
          reused: r = [],
          minRepeatType: o = n.types.length,
        } = t,
        l = Array.isArray(i) ? new fr(i, i.length) : i,
        h = n.types,
        a = 0,
        c = 0;
      function u(t, e, i, v, w) {
        let { id: y, start: b, end: x, size: k } = l,
          S = c;
        for (; k < 0; ) {
          if ((l.next(), -1 == k)) {
            let e = r[y];
            return i.push(e), void v.push(b - t);
          }
          if (-3 == k) return void (a = y);
          if (-4 == k) return void (c = y);
          throw new RangeError(`Unrecognized record size: ${k}`);
        }
        let A,
          C,
          M = h[y],
          D = b - t;
        if (x - b <= s && (C = m(l.pos - e, w))) {
          let e = new Uint16Array(C.size - C.skip),
            i = l.pos - C.size,
            s = e.length;
          for (; l.pos > i; ) s = g(C.start, e, s);
          (A = new dr(e, x - C.start, n)), (D = C.start - t);
        } else {
          let t = l.pos - k;
          l.next();
          let e = [],
            i = [],
            n = y >= o ? y : -1,
            r = 0,
            h = x;
          for (; l.pos > t; )
            n >= 0 && l.id == n && l.size >= 0
              ? (l.end <= h - s &&
                  (d(e, i, b, r, l.end, h, n, S), (r = e.length), (h = l.end)),
                l.next())
              : u(b, t, e, i, n);
          if (
            (n >= 0 && r > 0 && r < e.length && d(e, i, b, r, b, h, n, S),
            e.reverse(),
            i.reverse(),
            n > -1 && r > 0)
          ) {
            let t = f(M);
            A = Cr(M, e, i, 0, e.length, 0, x - b, t, t);
          } else A = p(M, e, i, x - b, S - x);
        }
        i.push(A), v.push(D);
      }
      function f(t) {
        return (e, i, n) => {
          let s,
            r,
            o = 0,
            l = e.length - 1;
          if (l >= 0 && (s = e[l]) instanceof ur) {
            if (!l && s.type == t && s.length == n) return s;
            (r = s.prop(rr.lookAhead)) && (o = i[l] + s.length + r);
          }
          return p(t, e, i, n, o);
        };
      }
      function d(t, e, i, s, r, o, l, h) {
        let a = [],
          c = [];
        for (; t.length > s; ) a.push(t.pop()), c.push(e.pop() + i - r);
        t.push(p(n.types[l], a, c, o - r, h - o)), e.push(r - i);
      }
      function p(t, e, i, n, s = 0, r) {
        if (a) {
          let t = [rr.contextHash, a];
          r = r ? [t].concat(r) : [t];
        }
        if (s > 25) {
          let t = [rr.lookAhead, s];
          r = r ? [t].concat(r) : [t];
        }
        return new ur(t, e, i, n, r);
      }
      function m(t, e) {
        let i = l.fork(),
          n = 0,
          r = 0,
          h = 0,
          a = i.end - s,
          c = { size: 0, start: 0, skip: 0 };
        t: for (let s = i.pos - t; i.pos > s; ) {
          let t = i.size;
          if (i.id == e && t >= 0) {
            (c.size = n),
              (c.start = r),
              (c.skip = h),
              (h += 4),
              (n += 4),
              i.next();
            continue;
          }
          let l = i.pos - t;
          if (t < 0 || l < s || i.start < a) break;
          let u = i.id >= o ? 4 : 0,
            f = i.start;
          for (i.next(); i.pos > l; ) {
            if (i.size < 0) {
              if (-3 != i.size) break t;
              u += 4;
            } else i.id >= o && (u += 4);
            i.next();
          }
          (r = f), (n += t), (h += u);
        }
        return (
          (e < 0 || n == t) && ((c.size = n), (c.start = r), (c.skip = h)),
          c.size > 4 ? c : void 0
        );
      }
      function g(t, e, i) {
        let { id: n, start: s, end: r, size: h } = l;
        if ((l.next(), h >= 0 && n < o)) {
          let o = i;
          if (h > 4) {
            let n = l.pos - (h - 4);
            for (; l.pos > n; ) i = g(t, e, i);
          }
          (e[--i] = o), (e[--i] = r - t), (e[--i] = s - t), (e[--i] = n);
        } else -3 == h ? (a = n) : -4 == h && (c = n);
        return i;
      }
      let v = [],
        w = [];
      for (; l.pos > 0; ) u(t.start || 0, t.bufferStart || 0, v, w, -1);
      let y =
        null !== (e = t.length) && void 0 !== e
          ? e
          : v.length
          ? w[0] + v[0].length
          : 0;
      return new ur(h[t.topID], v.reverse(), w.reverse(), y);
    })(t);
  }
}
ur.empty = new ur(lr.none, [], [], 0);
class fr {
  constructor(t, e) {
    (this.buffer = t), (this.index = e);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new fr(this.buffer, this.index);
  }
}
class dr {
  constructor(t, e, i) {
    (this.buffer = t), (this.length = e), (this.set = i);
  }
  get type() {
    return lr.none;
  }
  toString() {
    let t = [];
    for (let e = 0; e < this.buffer.length; )
      t.push(this.childString(e)), (e = this.buffer[e + 3]);
    return t.join(",");
  }
  childString(t) {
    let e = this.buffer[t],
      i = this.buffer[t + 3],
      n = this.set.types[e],
      s = n.name;
    if ((/\W/.test(s) && !n.isError && (s = JSON.stringify(s)), i == (t += 4)))
      return s;
    let r = [];
    for (; t < i; ) r.push(this.childString(t)), (t = this.buffer[t + 3]);
    return s + "(" + r.join(",") + ")";
  }
  findChild(t, e, i, n, s) {
    let { buffer: r } = this,
      o = -1;
    for (
      let l = t;
      l != e && !(pr(s, n, r[l + 1], r[l + 2]) && ((o = l), i > 0));
      l = r[l + 3]
    );
    return o;
  }
  slice(t, e, i, n) {
    let s = this.buffer,
      r = new Uint16Array(e - t);
    for (let n = t, o = 0; n < e; )
      (r[o++] = s[n++]),
        (r[o++] = s[n++] - i),
        (r[o++] = s[n++] - i),
        (r[o++] = s[n++] - t);
    return new dr(r, n - i, this.set);
  }
}
function pr(t, e, i, n) {
  switch (t) {
    case -2:
      return i < e;
    case -1:
      return n >= e && i < e;
    case 0:
      return i < e && n > e;
    case 1:
      return i <= e && n > e;
    case 2:
      return n > e;
    case 4:
      return !0;
  }
}
function mr(t, e) {
  let i = t.childBefore(e);
  for (; i; ) {
    let e = i.lastChild;
    if (!e || e.to != i.to) break;
    e.type.isError && e.from == e.to ? ((t = i), (i = e.prevSibling)) : (i = e);
  }
  return t;
}
function gr(t, e, i, n) {
  for (
    var s;
    t.from == t.to ||
    (i < 1 ? t.from >= e : t.from > e) ||
    (i > -1 ? t.to <= e : t.to < e);

  ) {
    let e = !n && t instanceof vr && t.index < 0 ? null : t.parent;
    if (!e) return t;
    t = e;
  }
  if (n)
    for (let n = t, r = n.parent; r; n = r, r = n.parent)
      n instanceof vr &&
        n.index < 0 &&
        (null === (s = r.enter(e, i, !0)) || void 0 === s ? void 0 : s.from) !=
          n.from &&
        (t = r);
  for (;;) {
    let s = t.enter(e, i, n);
    if (!s) return t;
    t = s;
  }
}
class vr {
  constructor(t, e, i, n) {
    (this.node = t), (this._from = e), (this.index = i), (this._parent = n);
  }
  get type() {
    return this.node.type;
  }
  get name() {
    return this.node.type.name;
  }
  get from() {
    return this._from;
  }
  get to() {
    return this._from + this.node.length;
  }
  nextChild(t, e, i, n, s = 0) {
    for (let r = this; ; ) {
      for (
        let { children: o, positions: l } = r.node, h = e > 0 ? o.length : -1;
        t != h;
        t += e
      ) {
        let h = o[t],
          a = l[t] + r._from;
        if (pr(n, i, a, a + h.length))
          if (h instanceof dr) {
            if (2 & s) continue;
            let o = h.findChild(0, h.buffer.length, e, i - a, n);
            if (o > -1) return new br(new yr(r, h, t, a), null, o);
          } else if (1 & s || !h.type.isAnonymous || kr(h)) {
            let o;
            if (!(1 & s) && h.props && (o = h.prop(rr.mounted)) && !o.overlay)
              return new vr(o.tree, a, t, r);
            let l = new vr(h, a, t, r);
            return 1 & s || !l.type.isAnonymous
              ? l
              : l.nextChild(e < 0 ? h.children.length - 1 : 0, e, i, n);
          }
      }
      if (1 & s || !r.type.isAnonymous) return null;
      if (
        ((t =
          r.index >= 0
            ? r.index + e
            : e < 0
            ? -1
            : r._parent.node.children.length),
        (r = r._parent),
        !r)
      )
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(0, 1, 0, 4);
  }
  get lastChild() {
    return this.nextChild(this.node.children.length - 1, -1, 0, 4);
  }
  childAfter(t) {
    return this.nextChild(0, 1, t, 2);
  }
  childBefore(t) {
    return this.nextChild(this.node.children.length - 1, -1, t, -2);
  }
  enter(t, e, i = !0, n = !0) {
    let s;
    if (i && (s = this.node.prop(rr.mounted)) && s.overlay) {
      let i = t - this.from;
      for (let { from: t, to: n } of s.overlay)
        if ((e > 0 ? t <= i : t < i) && (e < 0 ? n >= i : n > i))
          return new vr(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, t, e, n ? 0 : 2);
  }
  nextSignificantParent() {
    let t = this;
    for (; t.type.isAnonymous && t._parent; ) t = t._parent;
    return t;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0
      ? this._parent.nextChild(this.index + 1, 1, 0, 4)
      : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0
      ? this._parent.nextChild(this.index - 1, -1, 0, 4)
      : null;
  }
  get cursor() {
    return new xr(this);
  }
  get tree() {
    return this.node;
  }
  toTree() {
    return this.node;
  }
  resolve(t, e = 0) {
    return gr(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return gr(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return mr(this, t);
  }
  getChild(t, e = null, i = null) {
    let n = wr(this, t, e, i);
    return n.length ? n[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return wr(this, t, e, i);
  }
  toString() {
    return this.node.toString();
  }
}
function wr(t, e, i, n) {
  let s = t.cursor,
    r = [];
  if (!s.firstChild()) return r;
  if (null != i) for (; !s.type.is(i); ) if (!s.nextSibling()) return r;
  for (;;) {
    if (null != n && s.type.is(n)) return r;
    if ((s.type.is(e) && r.push(s.node), !s.nextSibling()))
      return null == n ? r : [];
  }
}
class yr {
  constructor(t, e, i, n) {
    (this.parent = t), (this.buffer = e), (this.index = i), (this.start = n);
  }
}
class br {
  constructor(t, e, i) {
    (this.context = t),
      (this._parent = e),
      (this.index = i),
      (this.type = t.buffer.set.types[t.buffer.buffer[i]]);
  }
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  child(t, e, i) {
    let { buffer: n } = this.context,
      s = n.findChild(
        this.index + 4,
        n.buffer[this.index + 3],
        t,
        e - this.context.start,
        i
      );
    return s < 0 ? null : new br(this.context, this, s);
  }
  get firstChild() {
    return this.child(1, 0, 4);
  }
  get lastChild() {
    return this.child(-1, 0, 4);
  }
  childAfter(t) {
    return this.child(1, t, 2);
  }
  childBefore(t) {
    return this.child(-1, t, -2);
  }
  enter(t, e, i, n = !0) {
    if (!n) return null;
    let { buffer: s } = this.context,
      r = s.findChild(
        this.index + 4,
        s.buffer[this.index + 3],
        e > 0 ? 1 : -1,
        t - this.context.start,
        e
      );
    return r < 0 ? null : new br(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(t) {
    return this._parent
      ? null
      : this.context.parent.nextChild(this.context.index + t, t, 0, 4);
  }
  get nextSibling() {
    let { buffer: t } = this.context,
      e = t.buffer[this.index + 3];
    return e <
      (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length)
      ? new br(this.context, this._parent, e)
      : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: t } = this.context,
      e = this._parent ? this._parent.index + 4 : 0;
    return this.index == e
      ? this.externalSibling(-1)
      : new br(
          this.context,
          this._parent,
          t.findChild(e, this.index, -1, 0, 4)
        );
  }
  get cursor() {
    return new xr(this);
  }
  get tree() {
    return null;
  }
  toTree() {
    let t = [],
      e = [],
      { buffer: i } = this.context,
      n = this.index + 4,
      s = i.buffer[this.index + 3];
    if (s > n) {
      let r = i.buffer[this.index + 1],
        o = i.buffer[this.index + 2];
      t.push(i.slice(n, s, r, o)), e.push(0);
    }
    return new ur(this.type, t, e, this.to - this.from);
  }
  resolve(t, e = 0) {
    return gr(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return gr(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return mr(this, t);
  }
  toString() {
    return this.context.buffer.childString(this.index);
  }
  getChild(t, e = null, i = null) {
    let n = wr(this, t, e, i);
    return n.length ? n[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return wr(this, t, e, i);
  }
}
class xr {
  constructor(t, e = 0) {
    if (
      ((this.mode = e),
      (this.buffer = null),
      (this.stack = []),
      (this.index = 0),
      (this.bufferNode = null),
      t instanceof vr)
    )
      this.yieldNode(t);
    else {
      (this._tree = t.context.parent), (this.buffer = t.context);
      for (let e = t._parent; e; e = e._parent) this.stack.unshift(e.index);
      (this.bufferNode = t), this.yieldBuf(t.index);
    }
  }
  get name() {
    return this.type.name;
  }
  yieldNode(t) {
    return (
      !!t &&
      ((this._tree = t),
      (this.type = t.type),
      (this.from = t.from),
      (this.to = t.to),
      !0)
    );
  }
  yieldBuf(t, e) {
    this.index = t;
    let { start: i, buffer: n } = this.buffer;
    return (
      (this.type = e || n.set.types[n.buffer[t]]),
      (this.from = i + n.buffer[t + 1]),
      (this.to = i + n.buffer[t + 2]),
      !0
    );
  }
  yield(t) {
    return (
      !!t &&
      (t instanceof vr
        ? ((this.buffer = null), this.yieldNode(t))
        : ((this.buffer = t.context), this.yieldBuf(t.index, t.type)))
    );
  }
  toString() {
    return this.buffer
      ? this.buffer.buffer.childString(this.index)
      : this._tree.toString();
  }
  enterChild(t, e, i) {
    if (!this.buffer)
      return this.yield(
        this._tree.nextChild(
          t < 0 ? this._tree.node.children.length - 1 : 0,
          t,
          e,
          i,
          this.mode
        )
      );
    let { buffer: n } = this.buffer,
      s = n.findChild(
        this.index + 4,
        n.buffer[this.index + 3],
        t,
        e - this.buffer.start,
        i
      );
    return !(s < 0) && (this.stack.push(this.index), this.yieldBuf(s));
  }
  firstChild() {
    return this.enterChild(1, 0, 4);
  }
  lastChild() {
    return this.enterChild(-1, 0, 4);
  }
  childAfter(t) {
    return this.enterChild(1, t, 2);
  }
  childBefore(t) {
    return this.enterChild(-1, t, -2);
  }
  enter(t, e, i = !0, n = !0) {
    return this.buffer
      ? !!n && this.enterChild(1, t, e)
      : this.yield(this._tree.enter(t, e, i && !(1 & this.mode), n));
  }
  parent() {
    if (!this.buffer)
      return this.yieldNode(
        1 & this.mode ? this._tree._parent : this._tree.parent
      );
    if (this.stack.length) return this.yieldBuf(this.stack.pop());
    let t =
      1 & this.mode
        ? this.buffer.parent
        : this.buffer.parent.nextSignificantParent();
    return (this.buffer = null), this.yieldNode(t);
  }
  sibling(t) {
    if (!this.buffer)
      return (
        !!this._tree._parent &&
        this.yield(
          this._tree.index < 0
            ? null
            : this._tree._parent.nextChild(
                this._tree.index + t,
                t,
                0,
                4,
                this.mode
              )
        )
      );
    let { buffer: e } = this.buffer,
      i = this.stack.length - 1;
    if (t < 0) {
      let t = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != t)
        return this.yieldBuf(e.findChild(t, this.index, -1, 0, 4));
    } else {
      let t = e.buffer[this.index + 3];
      if (t < (i < 0 ? e.buffer.length : e.buffer[this.stack[i] + 3]))
        return this.yieldBuf(t);
    }
    return (
      i < 0 &&
      this.yield(
        this.buffer.parent.nextChild(this.buffer.index + t, t, 0, 4, this.mode)
      )
    );
  }
  nextSibling() {
    return this.sibling(1);
  }
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(t) {
    let e,
      i,
      { buffer: n } = this;
    if (n) {
      if (t > 0) {
        if (this.index < n.buffer.buffer.length) return !1;
      } else
        for (let t = 0; t < this.index; t++)
          if (n.buffer.buffer[t + 3] < this.index) return !1;
      ({ index: e, parent: i } = n);
    } else ({ index: e, _parent: i } = this._tree);
    for (; i; { index: e, _parent: i } = i)
      if (e > -1)
        for (
          let n = e + t, s = t < 0 ? -1 : i.node.children.length;
          n != s;
          n += t
        ) {
          let t = i.node.children[n];
          if (1 & this.mode || t instanceof dr || !t.type.isAnonymous || kr(t))
            return !1;
        }
    return !0;
  }
  move(t, e) {
    if (e && this.enterChild(t, 0, 4)) return !0;
    for (;;) {
      if (this.sibling(t)) return !0;
      if (this.atLastNode(t) || !this.parent()) return !1;
    }
  }
  next(t = !0) {
    return this.move(1, t);
  }
  prev(t = !0) {
    return this.move(-1, t);
  }
  moveTo(t, e = 0) {
    for (
      ;
      (this.from == this.to ||
        (e < 1 ? this.from >= t : this.from > t) ||
        (e > -1 ? this.to <= t : this.to < t)) &&
      this.parent();

    );
    for (; this.enterChild(1, t, e); );
    return this;
  }
  get node() {
    if (!this.buffer) return this._tree;
    let t = this.bufferNode,
      e = null,
      i = 0;
    if (t && t.context == this.buffer)
      t: for (let n = this.index, s = this.stack.length; s >= 0; ) {
        for (let r = t; r; r = r._parent)
          if (r.index == n) {
            if (n == this.index) return r;
            (e = r), (i = s + 1);
            break t;
          }
        n = this.stack[--s];
      }
    for (let t = i; t < this.stack.length; t++)
      e = new br(this.buffer, e, this.stack[t]);
    return (this.bufferNode = new br(this.buffer, e, this.index));
  }
  get tree() {
    return this.buffer ? null : this._tree.node;
  }
}
function kr(t) {
  return t.children.some(
    (t) => t instanceof dr || !t.type.isAnonymous || kr(t)
  );
}
const Sr = new WeakMap();
function Ar(t, e) {
  if (!t.isAnonymous || e instanceof dr || e.type != t) return 1;
  let i = Sr.get(e);
  if (null == i) {
    i = 1;
    for (let n of e.children) {
      if (n.type != t || !(n instanceof ur)) {
        i = 1;
        break;
      }
      i += Ar(t, n);
    }
    Sr.set(e, i);
  }
  return i;
}
function Cr(t, e, i, n, s, r, o, l, h) {
  let a = 0;
  for (let i = n; i < s; i++) a += Ar(t, e[i]);
  let c = Math.ceil((1.5 * a) / 8),
    u = [],
    f = [];
  return (
    (function e(i, n, s, o, l) {
      for (let a = s; a < o; ) {
        let s = a,
          d = n[a],
          p = Ar(t, i[a]);
        for (a++; a < o; a++) {
          let e = Ar(t, i[a]);
          if (p + e >= c) break;
          p += e;
        }
        if (a == s + 1) {
          if (p > c) {
            let t = i[s];
            e(t.children, t.positions, 0, t.children.length, n[s] + l);
            continue;
          }
          u.push(i[s]);
        } else {
          let e = n[a - 1] + i[a - 1].length - d;
          u.push(Cr(t, i, n, s, a, d, e, null, h));
        }
        f.push(d + l - r);
      }
    })(e, i, n, s, 0),
    (l || h)(u, f, o)
  );
}
class Mr {
  constructor(t, e, i, n, s = !1, r = !1) {
    (this.from = t),
      (this.to = e),
      (this.tree = i),
      (this.offset = n),
      (this.open = (s ? 1 : 0) | (r ? 2 : 0));
  }
  get openStart() {
    return (1 & this.open) > 0;
  }
  get openEnd() {
    return (2 & this.open) > 0;
  }
  static addTree(t, e = [], i = !1) {
    let n = [new Mr(0, t.length, t, 0, !1, i)];
    for (let i of e) i.to > t.length && n.push(i);
    return n;
  }
  static applyChanges(t, e, i = 128) {
    if (!e.length) return t;
    let n = [],
      s = 1,
      r = t.length ? t[0] : null;
    for (let o = 0, l = 0, h = 0; ; o++) {
      let a = o < e.length ? e[o] : null,
        c = a ? a.fromA : 1e9;
      if (c - l >= i)
        for (; r && r.from < c; ) {
          let e = r;
          if (l >= e.from || c <= e.to || h) {
            let t = Math.max(e.from, l) - h,
              i = Math.min(e.to, c) - h;
            e = t >= i ? null : new Mr(t, i, e.tree, e.offset + h, o > 0, !!a);
          }
          if ((e && n.push(e), r.to > c)) break;
          r = s < t.length ? t[s++] : null;
        }
      if (!a) break;
      (l = a.toA), (h = a.toA - a.toB);
    }
    return n;
  }
}
class Dr {
  startParse(t, e, i) {
    return (
      "string" == typeof t && (t = new Or(t)),
      (i = i
        ? i.length
          ? i.map((t) => new sr(t.from, t.to))
          : [new sr(0, 0)]
        : [new sr(0, t.length)]),
      this.createParse(t, e || [], i)
    );
  }
  parse(t, e, i) {
    let n = this.startParse(t, e, i);
    for (;;) {
      let t = n.advance();
      if (t) return t;
    }
  }
}
class Or {
  constructor(t) {
    this.string = t;
  }
  get length() {
    return this.string.length;
  }
  chunk(t) {
    return this.string.slice(t);
  }
  get lineChunks() {
    return !1;
  }
  read(t, e) {
    return this.string.slice(t, e);
  }
}
var Tr;
new rr({ perNode: !0 });
const Rr = new rr();
class Er {
  constructor(t, e, i, n = []) {
    (this.data = t),
      (this.topNode = i),
      Ct.prototype.hasOwnProperty("tree") ||
        Object.defineProperty(Ct.prototype, "tree", {
          get() {
            return Br(this);
          },
        }),
      (this.parser = e),
      (this.extension = [
        qr.of(this),
        Ct.languageData.of((t, e, i) => t.facet(Lr(t, e, i))),
      ].concat(n));
  }
  isActiveAt(t, e, i = -1) {
    return Lr(t, e, i) == this.data;
  }
  findRegions(t) {
    let e = t.facet(qr);
    if ((null == e ? void 0 : e.data) == this.data)
      return [{ from: 0, to: t.doc.length }];
    if (!e || !e.allowsNesting) return [];
    let i = [],
      n = (t, e) => {
        if (t.prop(Rr) == this.data)
          return void i.push({ from: e, to: e + t.length });
        let s = t.prop(rr.mounted);
        if (s) {
          if (s.tree.prop(Rr) == this.data) {
            if (s.overlay)
              for (let t of s.overlay)
                i.push({ from: t.from + e, to: t.to + e });
            else i.push({ from: e, to: e + t.length });
            return;
          }
          if (s.overlay) {
            let t = i.length;
            if ((n(s.tree, s.overlay[0].from + e), i.length > t)) return;
          }
        }
        for (let i = 0; i < t.children.length; i++) {
          let s = t.children[i];
          s instanceof ur && n(s, t.positions[i] + e);
        }
      };
    return n(Br(t), 0), i;
  }
  get allowsNesting() {
    return !0;
  }
}
function Lr(t, e, i) {
  let n = t.facet(qr);
  if (!n) return null;
  let s = n.data;
  if (n.allowsNesting)
    for (let n = Br(t).topNode; n; n = n.enter(e, i, !0, !1))
      s = n.type.prop(Rr) || s;
  return s;
}
function Br(t) {
  let e = t.field(Er.state, !1);
  return e ? e.tree : ur.empty;
}
Er.setState = dt.define();
class Pr {
  constructor(t, e = t.length) {
    (this.doc = t),
      (this.length = e),
      (this.cursorPos = 0),
      (this.string = ""),
      (this.cursor = t.iter());
  }
  syncTo(t) {
    return (
      (this.string = this.cursor.next(t - this.cursorPos).value),
      (this.cursorPos = t + this.string.length),
      this.cursorPos - this.string.length
    );
  }
  chunk(t) {
    return this.syncTo(t), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(t, e) {
    let i = this.cursorPos - this.string.length;
    return t < i || e >= this.cursorPos
      ? this.doc.sliceString(t, e)
      : this.string.slice(t - i, e - i);
  }
}
let Nr = null;
class Ir {
  constructor(t, e, i = [], n, s, r, o, l) {
    (this.parser = t),
      (this.state = e),
      (this.fragments = i),
      (this.tree = n),
      (this.treeLen = s),
      (this.viewport = r),
      (this.skipped = o),
      (this.scheduleOn = l),
      (this.parse = null),
      (this.tempSkipped = []);
  }
  startParse() {
    return this.parser.startParse(new Pr(this.state.doc), this.fragments);
  }
  work(t, e) {
    return (
      null != e && e >= this.state.doc.length && (e = void 0),
      this.tree != ur.empty &&
      this.isDone(null != e ? e : this.state.doc.length)
        ? (this.takeTree(), !0)
        : this.withContext(() => {
            var i;
            if ("number" == typeof t) {
              let e = Date.now() + t;
              t = () => Date.now() > e;
            }
            for (
              this.parse || (this.parse = this.startParse()),
                null != e &&
                  (null == this.parse.stoppedAt || this.parse.stoppedAt > e) &&
                  e < this.state.doc.length &&
                  this.parse.stopAt(e);
              ;

            ) {
              let n = this.parse.advance();
              if (n) {
                if (
                  ((this.fragments = this.withoutTempSkipped(
                    Mr.addTree(n, this.fragments, null != this.parse.stoppedAt)
                  )),
                  (this.treeLen =
                    null !== (i = this.parse.stoppedAt) && void 0 !== i
                      ? i
                      : this.state.doc.length),
                  (this.tree = n),
                  (this.parse = null),
                  !(this.treeLen < (null != e ? e : this.state.doc.length)))
                )
                  return !0;
                this.parse = this.startParse();
              }
              if (t()) return !1;
            }
          })
    );
  }
  takeTree() {
    let t, e;
    this.parse &&
      (t = this.parse.parsedPos) >= this.treeLen &&
      ((null == this.parse.stoppedAt || this.parse.stoppedAt > t) &&
        this.parse.stopAt(t),
      this.withContext(() => {
        for (; !(e = this.parse.advance()); );
      }),
      (this.treeLen = t),
      (this.tree = e),
      (this.fragments = this.withoutTempSkipped(
        Mr.addTree(this.tree, this.fragments, !0)
      )),
      (this.parse = null));
  }
  withContext(t) {
    let e = Nr;
    Nr = this;
    try {
      return t();
    } finally {
      Nr = e;
    }
  }
  withoutTempSkipped(t) {
    for (let e; (e = this.tempSkipped.pop()); ) t = Vr(t, e.from, e.to);
    return t;
  }
  changes(t, e) {
    let { fragments: i, tree: n, treeLen: s, viewport: r, skipped: o } = this;
    if ((this.takeTree(), !t.empty)) {
      let e = [];
      if (
        (t.iterChangedRanges((t, i, n, s) =>
          e.push({ fromA: t, toA: i, fromB: n, toB: s })
        ),
        (i = Mr.applyChanges(i, e)),
        (n = ur.empty),
        (s = 0),
        (r = { from: t.mapPos(r.from, -1), to: t.mapPos(r.to, 1) }),
        this.skipped.length)
      ) {
        o = [];
        for (let e of this.skipped) {
          let i = t.mapPos(e.from, 1),
            n = t.mapPos(e.to, -1);
          i < n && o.push({ from: i, to: n });
        }
      }
    }
    return new Ir(this.parser, e, i, n, s, r, o, this.scheduleOn);
  }
  updateViewport(t) {
    if (this.viewport.from == t.from && this.viewport.to == t.to) return !1;
    this.viewport = t;
    let e = this.skipped.length;
    for (let e = 0; e < this.skipped.length; e++) {
      let { from: i, to: n } = this.skipped[e];
      i < t.to &&
        n > t.from &&
        ((this.fragments = Vr(this.fragments, i, n)),
        this.skipped.splice(e--, 1));
    }
    return !(this.skipped.length >= e) && (this.reset(), !0);
  }
  reset() {
    this.parse && (this.takeTree(), (this.parse = null));
  }
  skipUntilInView(t, e) {
    this.skipped.push({ from: t, to: e });
  }
  static getSkippingParser(t) {
    return new (class extends Dr {
      createParse(e, i, n) {
        let s = n[0].from,
          r = n[n.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let e = Nr;
            if (e) {
              for (let t of n) e.tempSkipped.push(t);
              t &&
                (e.scheduleOn = e.scheduleOn
                  ? Promise.all([e.scheduleOn, t])
                  : t);
            }
            return (this.parsedPos = r), new ur(lr.none, [], [], r - s);
          },
          stoppedAt: null,
          stopAt() {},
        };
      }
    })();
  }
  isDone(t) {
    t = Math.min(t, this.state.doc.length);
    let e = this.fragments;
    return this.treeLen >= t && e.length && 0 == e[0].from && e[0].to >= t;
  }
  static get() {
    return Nr;
  }
}
function Vr(t, e, i) {
  return Mr.applyChanges(t, [{ fromA: e, toA: i, fromB: e, toB: i }]);
}
class Hr {
  constructor(t) {
    (this.context = t), (this.tree = t.tree);
  }
  apply(t) {
    if (!t.docChanged && this.tree == this.context.tree) return this;
    let e = this.context.changes(t.changes, t.state),
      i =
        this.context.treeLen == t.startState.doc.length
          ? void 0
          : Math.max(t.changes.mapPos(this.context.treeLen), e.viewport.to);
    return e.work(20, i) || e.takeTree(), new Hr(e);
  }
  static init(t) {
    let e = Math.min(3e3, t.doc.length),
      i = new Ir(
        t.facet(qr).parser,
        t,
        [],
        ur.empty,
        0,
        { from: 0, to: e },
        [],
        null
      );
    return i.work(20, e) || i.takeTree(), new Hr(i);
  }
}
Er.state = _.define({
  create: Hr.init,
  update(t, e) {
    for (let t of e.effects) if (t.is(Er.setState)) return t.value;
    return e.startState.facet(qr) != e.state.facet(qr)
      ? Hr.init(e.state)
      : t.apply(e);
  },
});
let Wr = (t) => {
  let e = setTimeout(() => t(), 500);
  return () => clearTimeout(e);
};
"undefined" != typeof requestIdleCallback &&
  (Wr = (t) => {
    let e = -1,
      i = setTimeout(() => {
        e = requestIdleCallback(t, { timeout: 400 });
      }, 100);
    return () => (e < 0 ? clearTimeout(i) : cancelIdleCallback(e));
  });
const zr =
    "undefined" != typeof navigator &&
    (null === (Tr = navigator.scheduling) || void 0 === Tr
      ? void 0
      : Tr.isInputPending)
      ? () => navigator.scheduling.isInputPending()
      : null,
  Fr = Ri.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.working = null),
          (this.workScheduled = 0),
          (this.chunkEnd = -1),
          (this.chunkBudget = -1),
          (this.work = this.work.bind(this)),
          this.scheduleWork();
      }
      update(t) {
        let e = this.view.state.field(Er.state).context;
        (e.updateViewport(t.view.viewport) ||
          this.view.viewport.to > e.treeLen) &&
          this.scheduleWork(),
          t.docChanged &&
            (this.view.hasFocus && (this.chunkBudget += 50),
            this.scheduleWork()),
          this.checkAsyncSchedule(e);
      }
      scheduleWork() {
        if (this.working) return;
        let { state: t } = this.view,
          e = t.field(Er.state);
        (e.tree == e.context.tree && e.context.isDone(t.doc.length)) ||
          (this.working = Wr(this.work));
      }
      work(t) {
        this.working = null;
        let e = Date.now();
        if (
          (this.chunkEnd < e &&
            (this.chunkEnd < 0 || this.view.hasFocus) &&
            ((this.chunkEnd = e + 3e4), (this.chunkBudget = 3e3)),
          this.chunkBudget <= 0)
        )
          return;
        let {
            state: i,
            viewport: { to: n },
          } = this.view,
          s = i.field(Er.state);
        if (s.tree == s.context.tree && s.context.isDone(n + 1e5)) return;
        let r =
            Date.now() +
            Math.min(
              this.chunkBudget,
              100,
              t && !zr ? Math.max(25, t.timeRemaining() - 5) : 1e9
            ),
          o = s.context.treeLen < n && i.doc.length > n + 1e3,
          l = s.context.work(
            () => (zr && zr()) || Date.now() > r,
            n + (o ? 0 : 1e5)
          );
        (this.chunkBudget -= Date.now() - e),
          (l || this.chunkBudget <= 0) &&
            (s.context.takeTree(),
            this.view.dispatch({ effects: Er.setState.of(new Hr(s.context)) })),
          this.chunkBudget > 0 && (!l || o) && this.scheduleWork(),
          this.checkAsyncSchedule(s.context);
      }
      checkAsyncSchedule(t) {
        t.scheduleOn &&
          (this.workScheduled++,
          t.scheduleOn
            .then(() => this.scheduleWork())
            .catch((t) => Ai(this.view.state, t))
            .then(() => this.workScheduled--),
          (t.scheduleOn = null));
      }
      destroy() {
        this.working && this.working();
      }
      isWorking() {
        return !!(this.working || this.workScheduled > 0);
      }
    },
    {
      eventHandlers: {
        focus() {
          this.scheduleWork();
        },
      },
    }
  ),
  qr = V.define({
    combine: (t) => (t.length ? t[0] : null),
    enables: [Er.state, Fr],
  }),
  _r = V.define(),
  jr = V.define({
    combine: (t) => {
      if (!t.length) return "  ";
      if (!/^(?: +|\t+)$/.test(t[0]))
        throw new Error("Invalid indent unit: " + JSON.stringify(t[0]));
      return t[0];
    },
  });
function Ur(t) {
  let e = t.facet(jr);
  return 9 == e.charCodeAt(0) ? t.tabSize * e.length : e.length;
}
function $r(t, e) {
  let i = "",
    n = t.tabSize;
  if (9 == t.facet(jr).charCodeAt(0)) for (; e >= n; ) (i += "\t"), (e -= n);
  for (let t = 0; t < e; t++) i += " ";
  return i;
}
function Kr(t, e) {
  t instanceof Ct && (t = new Gr(t));
  for (let i of t.state.facet(_r)) {
    let n = i(t, e);
    if (null != n) return n;
  }
  let i = Br(t.state);
  return i
    ? (function (t, e, i) {
        return Xr(e.resolveInner(i).enterUnfinishedNodesBefore(i), i, t);
      })(t, i, e)
    : null;
}
class Gr {
  constructor(t, e = {}) {
    (this.state = t), (this.options = e), (this.unit = Ur(t));
  }
  lineAt(t, e = 1) {
    let i = this.state.doc.lineAt(t),
      { simulateBreak: n, simulateDoubleBreak: s } = this.options;
    return null != n && n >= i.from && n <= i.to
      ? s && n == t
        ? { text: "", from: t }
        : (e < 0 ? n < t : n <= t)
        ? { text: i.text.slice(n - i.from), from: n }
        : { text: i.text.slice(0, n - i.from), from: i.from }
      : i;
  }
  textAfterPos(t, e = 1) {
    if (this.options.simulateDoubleBreak && t == this.options.simulateBreak)
      return "";
    let { text: i, from: n } = this.lineAt(t, e);
    return i.slice(t - n, Math.min(i.length, t + 100 - n));
  }
  column(t, e = 1) {
    let { text: i, from: n } = this.lineAt(t, e),
      s = this.countColumn(i, t - n),
      r = this.options.overrideIndentation
        ? this.options.overrideIndentation(n)
        : -1;
    return r > -1 && (s += r - this.countColumn(i, i.search(/\S|$/))), s;
  }
  countColumn(t, e = t.length) {
    return u(t, this.state.tabSize, e);
  }
  lineIndent(t, e = 1) {
    let { text: i, from: n } = this.lineAt(t, e),
      s = this.options.overrideIndentation;
    if (s) {
      let t = s(n);
      if (t > -1) return t;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Jr = new rr();
function Yr(t) {
  let e = t.type.prop(Jr);
  if (e) return e;
  let i,
    n = t.firstChild;
  if (n && (i = n.type.prop(rr.closedBy))) {
    let e = t.lastChild,
      n = e && i.indexOf(e.name) > -1;
    return (t) =>
      (function (t, e, i, n, s) {
        let r = t.textAfter,
          o = r.match(/^\s*/)[0].length,
          l = (n && r.slice(o, o + n.length) == n) || s == t.pos + o,
          h = e
            ? (function (t) {
                let e = t.node,
                  i = e.childAfter(e.from),
                  n = e.lastChild;
                if (!i) return null;
                let s = t.options.simulateBreak,
                  r = t.state.doc.lineAt(i.from),
                  o = null == s || s <= r.from ? r.to : Math.min(r.to, s);
                for (let t = i.to; ; ) {
                  let s = e.childAfter(t);
                  if (!s || s == n) return null;
                  if (!s.type.isSkipped) return s.from < o ? i : null;
                  t = s.to;
                }
              })(t)
            : null;
        return h
          ? l
            ? t.column(h.from)
            : t.column(h.to)
          : t.baseIndent + (l ? 0 : t.unit * i);
      })(
        t,
        !0,
        1,
        void 0,
        n &&
          !(function (t) {
            return (
              t.pos == t.options.simulateBreak && t.options.simulateDoubleBreak
            );
          })(t)
          ? e.from
          : void 0
      );
  }
  return null == t.parent ? Qr : null;
}
function Xr(t, e, i) {
  for (; t; t = t.parent) {
    let n = Yr(t);
    if (n) return n(new Zr(i, e, t));
  }
  return null;
}
function Qr() {
  return 0;
}
class Zr extends Gr {
  constructor(t, e, i) {
    super(t.state, t.options), (this.base = t), (this.pos = e), (this.node = i);
  }
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  get baseIndent() {
    let t = this.state.doc.lineAt(this.node.from);
    for (;;) {
      let e = this.node.resolve(t.from);
      for (; e.parent && e.parent.from == e.from; ) e = e.parent;
      if (to(e, this.node)) break;
      t = this.state.doc.lineAt(e.from);
    }
    return this.lineIndent(t.from);
  }
  continue() {
    let t = this.node.parent;
    return t ? Xr(t, this.pos, this.base) : 0;
  }
}
function to(t, e) {
  for (let i = e; i; i = i.parent) if (t == i) return !0;
  return !1;
}
function eo(t, e, i) {
  let n = t.prop(e < 0 ? rr.openedBy : rr.closedBy);
  if (n) return n;
  if (1 == t.name.length) {
    let n = i.indexOf(t.name);
    if (n > -1 && n % 2 == (e < 0 ? 1 : 0)) return [i[n + e]];
  }
  return null;
}
function io(t, e, i, n = {}) {
  let s = n.maxScanDistance || 1e4,
    r = n.brackets || "()[]{}",
    o = Br(t),
    l = o.resolveInner(e, i);
  for (let n = l; n; n = n.parent) {
    let s = eo(n.type, i, r);
    if (s && n.from < n.to) return no(t, e, i, n, s, r);
  }
  return (function (t, e, i, n, s, r, o) {
    let l = i < 0 ? t.sliceDoc(e - 1, e) : t.sliceDoc(e, e + 1),
      h = o.indexOf(l);
    if (h < 0 || (h % 2 == 0) != i > 0) return null;
    let a = { from: i < 0 ? e - 1 : e, to: i > 0 ? e + 1 : e },
      c = t.doc.iterRange(e, i > 0 ? t.doc.length : 0),
      u = 0;
    for (let t = 0; !c.next().done && t <= r; ) {
      let r = c.value;
      i < 0 && (t += r.length);
      let l = e + t * i;
      for (
        let t = i > 0 ? 0 : r.length - 1, e = i > 0 ? r.length : -1;
        t != e;
        t += i
      ) {
        let e = o.indexOf(r[t]);
        if (!(e < 0 || n.resolve(l + t, 1).type != s))
          if ((e % 2 == 0) == i > 0) u++;
          else {
            if (1 == u)
              return {
                start: a,
                end: { from: l + t, to: l + t + 1 },
                matched: e >> 1 == h >> 1,
              };
            u--;
          }
      }
      i > 0 && (t += r.length);
    }
    return c.done ? { start: a, matched: !1 } : null;
  })(t, e, i, o, l.type, s, r);
}
function no(t, e, i, n, s, r) {
  let o = n.parent,
    l = { from: n.from, to: n.to },
    h = 0,
    a = null == o ? void 0 : o.cursor;
  if (a && (i < 0 ? a.childBefore(n.from) : a.childAfter(n.to)))
    do {
      if (i < 0 ? a.to <= n.from : a.from >= n.to) {
        if (0 == h && s.indexOf(a.type.name) > -1 && a.from < a.to)
          return { start: l, end: { from: a.from, to: a.to }, matched: !0 };
        if (eo(a.type, i, r)) h++;
        else if (eo(a.type, -i, r) && (h--, 0 == h))
          return {
            start: l,
            end: a.from == a.to ? void 0 : { from: a.from, to: a.to },
            matched: !1,
          };
      }
    } while (i < 0 ? a.prevSibling() : a.nextSibling());
  return { start: l, matched: !1 };
}
function so(t, e) {
  return B.create(t.ranges.map(e), t.mainIndex);
}
function ro(t, e) {
  return t.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function oo({ state: t, dispatch: e }, i) {
  let n = so(t.selection, i);
  return !n.eq(t.selection) && (e(ro(t, n)), !0);
}
function lo(t, e) {
  return B.cursor(e ? t.to : t.from);
}
function ho(t, e) {
  return oo(t, (i) => (i.empty ? t.moveByChar(i, e) : lo(i, e)));
}
const ao = (t) => ho(t, t.textDirection != Wi.LTR),
  co = (t) => ho(t, t.textDirection == Wi.LTR);
function uo(t, e) {
  return oo(t, (i) => (i.empty ? t.moveByGroup(i, e) : lo(i, e)));
}
function fo(t, e, i) {
  if (e.type.prop(i)) return !0;
  let n = e.to - e.from;
  return (
    (n && (n > 2 || /[^\s,.;:]/.test(t.sliceDoc(e.from, e.to)))) || e.firstChild
  );
}
function po(t, e, i) {
  let n,
    s,
    r = Br(t).resolveInner(e.head),
    o = i ? rr.closedBy : rr.openedBy;
  for (let n = e.head; ; ) {
    let e = i ? r.childAfter(n) : r.childBefore(n);
    if (!e) break;
    fo(t, e, o) ? (r = e) : (n = i ? e.to : e.from);
  }
  return (
    (s =
      r.type.prop(o) &&
      (n = i ? io(t, r.from, 1) : io(t, r.to, -1)) &&
      n.matched
        ? i
          ? n.end.to
          : n.end.from
        : i
        ? r.to
        : r.from),
    B.cursor(s, i ? -1 : 1)
  );
}
function mo(t, e) {
  return oo(t, (i) => {
    if (!i.empty) return lo(i, e);
    let n = t.moveVertically(i, e);
    return n.head != i.head ? n : t.moveToLineBoundary(i, e);
  });
}
const go = (t) => mo(t, !1),
  vo = (t) => mo(t, !0);
function wo(t, e) {
  let { state: i } = t,
    n = so(i.selection, (i) =>
      i.empty ? t.moveVertically(i, e, t.dom.clientHeight) : lo(i, e)
    );
  if (n.eq(i.selection)) return !1;
  let s = t.coordsAtPos(i.selection.main.head),
    r = t.scrollDOM.getBoundingClientRect();
  return (
    t.dispatch(ro(i, n), {
      effects:
        s && s.top > r.top && s.bottom < r.bottom
          ? Os.scrollIntoView(n.main.head, {
              y: "start",
              yMargin: s.top - r.top,
            })
          : void 0,
    }),
    !0
  );
}
const yo = (t) => wo(t, !1),
  bo = (t) => wo(t, !0);
function xo(t, e, i) {
  let n = t.lineBlockAt(e.head),
    s = t.moveToLineBoundary(e, i);
  if (
    (s.head == e.head &&
      s.head != (i ? n.to : n.from) &&
      (s = t.moveToLineBoundary(e, i, !1)),
    !i && s.head == n.from && n.length)
  ) {
    let i = /^\s*/.exec(
      t.state.sliceDoc(n.from, Math.min(n.from + 100, n.to))
    )[0].length;
    i && e.head != n.from + i && (s = B.cursor(n.from + i));
  }
  return s;
}
const ko = (t) => oo(t, (e) => xo(t, e, !0)),
  So = (t) => oo(t, (e) => xo(t, e, !1));
function Ao(t, e) {
  let i = so(t.state.selection, (t) => {
    let i = e(t);
    return B.range(t.anchor, i.head, i.goalColumn);
  });
  return !i.eq(t.state.selection) && (t.dispatch(ro(t.state, i)), !0);
}
function Co(t, e) {
  return Ao(t, (i) => t.moveByChar(i, e));
}
const Mo = (t) => Co(t, t.textDirection != Wi.LTR),
  Do = (t) => Co(t, t.textDirection == Wi.LTR);
function Oo(t, e) {
  return Ao(t, (i) => t.moveByGroup(i, e));
}
function To(t, e) {
  return Ao(t, (i) => t.moveVertically(i, e));
}
const Ro = (t) => To(t, !1),
  Eo = (t) => To(t, !0);
function Lo(t, e) {
  return Ao(t, (i) => t.moveVertically(i, e, t.dom.clientHeight));
}
const Bo = (t) => Lo(t, !1),
  Po = (t) => Lo(t, !0),
  No = (t) => Ao(t, (e) => xo(t, e, !0)),
  Io = (t) => Ao(t, (e) => xo(t, e, !1)),
  Vo = ({ state: t, dispatch: e }) => (e(ro(t, { anchor: 0 })), !0),
  Ho = ({ state: t, dispatch: e }) => (e(ro(t, { anchor: t.doc.length })), !0),
  Wo = ({ state: t, dispatch: e }) => (
    e(ro(t, { anchor: t.selection.main.anchor, head: 0 })), !0
  ),
  zo = ({ state: t, dispatch: e }) => (
    e(ro(t, { anchor: t.selection.main.anchor, head: t.doc.length })), !0
  );
function Fo({ state: t, dispatch: e }, i) {
  if (t.readOnly) return !1;
  let n = "delete.selection",
    s = t.changeByRange((t) => {
      let { from: e, to: s } = t;
      if (e == s) {
        let t = i(e);
        t < e ? (n = "delete.backward") : t > e && (n = "delete.forward"),
          (e = Math.min(e, t)),
          (s = Math.max(s, t));
      }
      return e == s
        ? { range: t }
        : { changes: { from: e, to: s }, range: B.cursor(e) };
    });
  return (
    !s.changes.empty &&
    (e(t.update(s, { scrollIntoView: !0, userEvent: n })), !0)
  );
}
function qo(t, e, i) {
  if (t instanceof Os)
    for (let n of t.pluginField(Di.atomicRanges))
      n.between(e, e, (t, n) => {
        t < e && n > e && (e = i ? n : t);
      });
  return e;
}
const _o = (t, e) =>
    Fo(t, (i) => {
      let s,
        r,
        { state: o } = t,
        l = o.doc.lineAt(i);
      if (
        !e &&
        i > l.from &&
        i < l.from + 200 &&
        !/[^ \t]/.test((s = l.text.slice(0, i - l.from)))
      ) {
        if ("\t" == s[s.length - 1]) return i - 1;
        let t = u(s, o.tabSize) % Ur(o) || Ur(o);
        for (let e = 0; e < t && " " == s[s.length - 1 - e]; e++) i--;
        r = i;
      } else
        (r = n(l.text, i - l.from, e, e) + l.from),
          r == i && l.number != (e ? o.doc.lines : 1) && (r += e ? 1 : -1);
      return qo(t, r, e);
    }),
  jo = (t) => _o(t, !1),
  Uo = (t) => _o(t, !0),
  $o = (t, e) =>
    Fo(t, (i) => {
      let s = i,
        { state: r } = t,
        o = r.doc.lineAt(s),
        l = r.charCategorizer(s);
      for (let t = null; ; ) {
        if (s == (e ? o.to : o.from)) {
          s == i && o.number != (e ? r.doc.lines : 1) && (s += e ? 1 : -1);
          break;
        }
        let h = n(o.text, s - o.from, e) + o.from,
          a = o.text.slice(Math.min(s, h) - o.from, Math.max(s, h) - o.from),
          c = l(a);
        if (null != t && c != t) break;
        (" " == a && s == i) || (t = c), (s = h);
      }
      return qo(t, s, e);
    }),
  Ko = (t) => $o(t, !1),
  Go = (t) =>
    Fo(t, (e) => {
      let i = t.lineBlockAt(e).to;
      return qo(t, e < i ? i : Math.min(t.state.doc.length, e + 1), !0);
    });
function Jo(t) {
  let e = [],
    i = -1;
  for (let n of t.selection.ranges) {
    let s = t.doc.lineAt(n.from),
      r = t.doc.lineAt(n.to);
    if (
      (n.empty || n.to != r.from || (r = t.doc.lineAt(n.to - 1)), i >= s.number)
    ) {
      let t = e[e.length - 1];
      (t.to = r.to), t.ranges.push(n);
    } else e.push({ from: s.from, to: r.to, ranges: [n] });
    i = r.number + 1;
  }
  return e;
}
function Yo(t, e, i) {
  if (t.readOnly) return !1;
  let n = [],
    s = [];
  for (let e of Jo(t)) {
    if (i ? e.to == t.doc.length : 0 == e.from) continue;
    let r = t.doc.lineAt(i ? e.to + 1 : e.from - 1),
      o = r.length + 1;
    if (i) {
      n.push(
        { from: e.to, to: r.to },
        { from: e.from, insert: r.text + t.lineBreak }
      );
      for (let i of e.ranges)
        s.push(
          B.range(
            Math.min(t.doc.length, i.anchor + o),
            Math.min(t.doc.length, i.head + o)
          )
        );
    } else {
      n.push(
        { from: r.from, to: e.from },
        { from: e.to, insert: t.lineBreak + r.text }
      );
      for (let t of e.ranges) s.push(B.range(t.anchor - o, t.head - o));
    }
  }
  return (
    !!n.length &&
    (e(
      t.update({
        changes: n,
        scrollIntoView: !0,
        selection: B.create(s, t.selection.mainIndex),
        userEvent: "move.line",
      })
    ),
    !0)
  );
}
function Xo(t, e, i) {
  if (t.readOnly) return !1;
  let n = [];
  for (let e of Jo(t))
    i
      ? n.push({
          from: e.from,
          insert: t.doc.slice(e.from, e.to) + t.lineBreak,
        })
      : n.push({ from: e.to, insert: t.lineBreak + t.doc.slice(e.from, e.to) });
  return (
    e(
      t.update({ changes: n, scrollIntoView: !0, userEvent: "input.copyline" })
    ),
    !0
  );
}
const Qo = Zo(!1);
function Zo(t) {
  return ({ state: e, dispatch: i }) => {
    if (e.readOnly) return !1;
    let n = e.changeByRange((i) => {
      let { from: n, to: s } = i,
        r = e.doc.lineAt(n),
        o =
          !t &&
          n == s &&
          (function (t, e) {
            if (/\(\)|\[\]|\{\}/.test(t.sliceDoc(e - 1, e + 1)))
              return { from: e, to: e };
            let i,
              n = Br(t).resolveInner(e),
              s = n.childBefore(e),
              r = n.childAfter(e);
            return s &&
              r &&
              s.to <= e &&
              r.from >= e &&
              (i = s.type.prop(rr.closedBy)) &&
              i.indexOf(r.name) > -1 &&
              t.doc.lineAt(s.to).from == t.doc.lineAt(r.from).from
              ? { from: s.to, to: r.from }
              : null;
          })(e, n);
      t && (n = s = (s <= r.to ? r : e.doc.lineAt(s)).to);
      let l = new Gr(e, { simulateBreak: n, simulateDoubleBreak: !!o }),
        h = Kr(l, n);
      for (
        null == h && (h = /^\s*/.exec(e.doc.lineAt(n).text)[0].length);
        s < r.to && /\s/.test(r.text[s - r.from]);

      )
        s++;
      o
        ? ({ from: n, to: s } = o)
        : n > r.from &&
          n < r.from + 100 &&
          !/\S/.test(r.text.slice(0, n)) &&
          (n = r.from);
      let a = ["", $r(e, h)];
      return (
        o && a.push($r(e, l.lineIndent(r.from, -1))),
        {
          changes: { from: n, to: s, insert: d.of(a) },
          range: B.cursor(n + 1 + a[1].length),
        }
      );
    });
    return i(e.update(n, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function tl(t, e) {
  let i = -1;
  return t.changeByRange((n) => {
    let s = [];
    for (let r = n.from; r <= n.to; ) {
      let o = t.doc.lineAt(r);
      o.number > i &&
        (n.empty || n.to > o.from) &&
        (e(o, s, n), (i = o.number)),
        (r = o.to + 1);
    }
    let r = t.changes(s);
    return {
      changes: s,
      range: B.range(r.mapPos(n.anchor, 1), r.mapPos(n.head, 1)),
    };
  });
}
const el = ({ state: t, dispatch: e }) =>
    !t.readOnly &&
    (e(
      t.update(
        tl(t, (e, i) => {
          i.push({ from: e.from, insert: t.facet(jr) });
        }),
        { userEvent: "input.indent" }
      )
    ),
    !0),
  il = ({ state: t, dispatch: e }) =>
    !t.readOnly &&
    (e(
      t.update(
        tl(t, (e, i) => {
          let n = /^\s*/.exec(e.text)[0];
          if (!n) return;
          let s = u(n, t.tabSize),
            r = 0,
            o = $r(t, Math.max(0, s - Ur(t)));
          for (
            ;
            r < n.length && r < o.length && n.charCodeAt(r) == o.charCodeAt(r);

          )
            r++;
          i.push({
            from: e.from + r,
            to: e.from + n.length,
            insert: o.slice(r),
          });
        }),
        { userEvent: "delete.dedent" }
      )
    ),
    !0),
  nl = [
    {
      key: "Alt-ArrowLeft",
      mac: "Ctrl-ArrowLeft",
      run: (t) => oo(t, (e) => po(t.state, e, t.textDirection != Wi.LTR)),
      shift: (t) => Ao(t, (e) => po(t.state, e, t.textDirection != Wi.LTR)),
    },
    {
      key: "Alt-ArrowRight",
      mac: "Ctrl-ArrowRight",
      run: (t) => oo(t, (e) => po(t.state, e, t.textDirection == Wi.LTR)),
      shift: (t) => Ao(t, (e) => po(t.state, e, t.textDirection == Wi.LTR)),
    },
    { key: "Alt-ArrowUp", run: ({ state: t, dispatch: e }) => Yo(t, e, !1) },
    {
      key: "Shift-Alt-ArrowUp",
      run: ({ state: t, dispatch: e }) => Xo(t, e, !1),
    },
    { key: "Alt-ArrowDown", run: ({ state: t, dispatch: e }) => Yo(t, e, !0) },
    {
      key: "Shift-Alt-ArrowDown",
      run: ({ state: t, dispatch: e }) => Xo(t, e, !0),
    },
    {
      key: "Escape",
      run: ({ state: t, dispatch: e }) => {
        let i = t.selection,
          n = null;
        return (
          i.ranges.length > 1
            ? (n = B.create([i.main]))
            : i.main.empty || (n = B.create([B.cursor(i.main.head)])),
          !!n && (e(ro(t, n)), !0)
        );
      },
    },
    { key: "Mod-Enter", run: Zo(!0) },
    {
      key: "Alt-l",
      mac: "Ctrl-l",
      run: ({ state: t, dispatch: e }) => {
        let i = Jo(t).map(({ from: e, to: i }) =>
          B.range(e, Math.min(i + 1, t.doc.length))
        );
        return e(t.update({ selection: B.create(i), userEvent: "select" })), !0;
      },
    },
    {
      key: "Mod-i",
      run: ({ state: t, dispatch: e }) => {
        let i = so(t.selection, (e) => {
          var i;
          let n = Br(t).resolveInner(e.head, 1);
          for (
            ;
            !(
              (n.from < e.from && n.to >= e.to) ||
              (n.to > e.to && n.from <= e.from)
            ) && (null === (i = n.parent) || void 0 === i ? void 0 : i.parent);

          )
            n = n.parent;
          return B.range(n.to, n.from);
        });
        return e(ro(t, i)), !0;
      },
      preventDefault: !0,
    },
    { key: "Mod-[", run: il },
    { key: "Mod-]", run: el },
    {
      key: "Mod-Alt-\\",
      run: ({ state: t, dispatch: e }) => {
        if (t.readOnly) return !1;
        let i = Object.create(null),
          n = new Gr(t, {
            overrideIndentation: (t) => {
              let e = i[t];
              return null == e ? -1 : e;
            },
          }),
          s = tl(t, (e, s, r) => {
            let o = Kr(n, e.from);
            if (null == o) return;
            /\S/.test(e.text) || (o = 0);
            let l = /^\s*/.exec(e.text)[0],
              h = $r(t, o);
            (l != h || r.from < e.from + l.length) &&
              ((i[e.from] = o),
              s.push({ from: e.from, to: e.from + l.length, insert: h }));
          });
        return s.changes.empty || e(t.update(s, { userEvent: "indent" })), !0;
      },
    },
    {
      key: "Shift-Mod-k",
      run: (t) => {
        if (t.state.readOnly) return !1;
        let { state: e } = t,
          i = e.changes(
            Jo(e).map(
              ({ from: t, to: i }) => (
                t > 0 ? t-- : i < e.doc.length && i++, { from: t, to: i }
              )
            )
          ),
          n = so(e.selection, (e) => t.moveVertically(e, !0)).map(i);
        return (
          t.dispatch({
            changes: i,
            selection: n,
            scrollIntoView: !0,
            userEvent: "delete.line",
          }),
          !0
        );
      },
    },
    {
      key: "Shift-Mod-\\",
      run: ({ state: t, dispatch: e }) =>
        (function (t, e, i) {
          let n = !1,
            s = so(t.selection, (e) => {
              let s =
                io(t, e.head, -1) ||
                io(t, e.head, 1) ||
                (e.head > 0 && io(t, e.head - 1, 1)) ||
                (e.head < t.doc.length && io(t, e.head + 1, -1));
              if (!s || !s.end) return e;
              n = !0;
              let r = s.start.from == e.head ? s.end.to : s.end.from;
              return i ? B.range(e.anchor, r) : B.cursor(r);
            });
          return !!n && (e(ro(t, s)), !0);
        })(t, e, !1),
    },
  ].concat(
    [
      { key: "ArrowLeft", run: ao, shift: Mo, preventDefault: !0 },
      {
        key: "Mod-ArrowLeft",
        mac: "Alt-ArrowLeft",
        run: (t) => uo(t, t.textDirection != Wi.LTR),
        shift: (t) => Oo(t, t.textDirection != Wi.LTR),
      },
      { mac: "Cmd-ArrowLeft", run: So, shift: Io },
      { key: "ArrowRight", run: co, shift: Do, preventDefault: !0 },
      {
        key: "Mod-ArrowRight",
        mac: "Alt-ArrowRight",
        run: (t) => uo(t, t.textDirection == Wi.LTR),
        shift: (t) => Oo(t, t.textDirection == Wi.LTR),
      },
      { mac: "Cmd-ArrowRight", run: ko, shift: No },
      { key: "ArrowUp", run: go, shift: Ro, preventDefault: !0 },
      { mac: "Cmd-ArrowUp", run: Vo, shift: Wo },
      { mac: "Ctrl-ArrowUp", run: yo, shift: Bo },
      { key: "ArrowDown", run: vo, shift: Eo, preventDefault: !0 },
      { mac: "Cmd-ArrowDown", run: Ho, shift: zo },
      { mac: "Ctrl-ArrowDown", run: bo, shift: Po },
      { key: "PageUp", run: yo, shift: Bo },
      { key: "PageDown", run: bo, shift: Po },
      { key: "Home", run: So, shift: Io },
      { key: "Mod-Home", run: Vo, shift: Wo },
      { key: "End", run: ko, shift: No },
      { key: "Mod-End", run: Ho, shift: zo },
      { key: "Enter", run: Qo },
      {
        key: "Mod-a",
        run: ({ state: t, dispatch: e }) => (
          e(
            t.update({
              selection: { anchor: 0, head: t.doc.length },
              userEvent: "select",
            })
          ),
          !0
        ),
      },
      { key: "Backspace", run: jo, shift: jo },
      { key: "Delete", run: Uo },
      { key: "Mod-Backspace", mac: "Alt-Backspace", run: Ko },
      { key: "Mod-Delete", mac: "Alt-Delete", run: (t) => $o(t, !0) },
      {
        mac: "Mod-Backspace",
        run: (t) =>
          Fo(t, (e) => {
            let i = t.lineBlockAt(e).from;
            return qo(t, e > i ? i : Math.max(0, e - 1), !1);
          }),
      },
      { mac: "Mod-Delete", run: Go },
    ].concat(
      [
        { key: "Ctrl-b", run: ao, shift: Mo, preventDefault: !0 },
        { key: "Ctrl-f", run: co, shift: Do },
        { key: "Ctrl-p", run: go, shift: Ro },
        { key: "Ctrl-n", run: vo, shift: Eo },
        {
          key: "Ctrl-a",
          run: (t) => oo(t, (e) => B.cursor(t.lineBlockAt(e.head).from, 1)),
          shift: (t) => Ao(t, (e) => B.cursor(t.lineBlockAt(e.head).from)),
        },
        {
          key: "Ctrl-e",
          run: (t) => oo(t, (e) => B.cursor(t.lineBlockAt(e.head).to, -1)),
          shift: (t) => Ao(t, (e) => B.cursor(t.lineBlockAt(e.head).to)),
        },
        { key: "Ctrl-d", run: Uo },
        { key: "Ctrl-h", run: jo },
        { key: "Ctrl-k", run: Go },
        { key: "Ctrl-Alt-h", run: Ko },
        {
          key: "Ctrl-o",
          run: ({ state: t, dispatch: e }) => {
            if (t.readOnly) return !1;
            let i = t.changeByRange((t) => ({
              changes: { from: t.from, to: t.to, insert: d.of(["", ""]) },
              range: B.cursor(t.from),
            }));
            return (
              e(t.update(i, { scrollIntoView: !0, userEvent: "input" })), !0
            );
          },
        },
        {
          key: "Ctrl-t",
          run: ({ state: t, dispatch: e }) => {
            if (t.readOnly) return !1;
            let i = t.changeByRange((e) => {
              if (!e.empty || 0 == e.from || e.from == t.doc.length)
                return { range: e };
              let i = e.from,
                s = t.doc.lineAt(i),
                r = i == s.from ? i - 1 : n(s.text, i - s.from, !1) + s.from,
                o = i == s.to ? i + 1 : n(s.text, i - s.from, !0) + s.from;
              return {
                changes: {
                  from: r,
                  to: o,
                  insert: t.doc.slice(i, o).append(t.doc.slice(r, i)),
                },
                range: B.cursor(o),
              };
            });
            return (
              !i.changes.empty &&
              (e(
                t.update(i, { scrollIntoView: !0, userEvent: "move.character" })
              ),
              !0)
            );
          },
        },
        { key: "Ctrl-v", run: bo },
      ].map((t) => ({ mac: t.key, run: t.run, shift: t.shift }))
    )
  );
let sl = 0;
class rl {
  constructor(t, e, i) {
    (this.set = t), (this.base = e), (this.modified = i), (this.id = sl++);
  }
  static define(t) {
    if (null == t ? void 0 : t.base)
      throw new Error("Can not derive from a modified tag");
    let e = new rl([], null, []);
    if ((e.set.push(e), t)) for (let i of t.set) e.set.push(i);
    return e;
  }
  static defineModifier() {
    let t = new ll();
    return (e) =>
      e.modified.indexOf(t) > -1
        ? e
        : ll.get(
            e.base || e,
            e.modified.concat(t).sort((t, e) => t.id - e.id)
          );
  }
}
let ol = 0;
class ll {
  constructor() {
    (this.instances = []), (this.id = ol++);
  }
  static get(t, e) {
    if (!e.length) return t;
    let i = e[0].instances.find((i) => {
      return (
        i.base == t &&
        ((n = e),
        (s = i.modified),
        n.length == s.length && n.every((t, e) => t == s[e]))
      );
      var n, s;
    });
    if (i) return i;
    let n = [],
      s = new rl(n, t, e);
    for (let t of e) t.instances.push(s);
    let r = hl(e);
    for (let e of t.set) for (let t of r) n.push(ll.get(e, t));
    return s;
  }
}
function hl(t) {
  let e = [t];
  for (let i = 0; i < t.length; i++)
    for (let n of hl(t.slice(0, i).concat(t.slice(i + 1)))) e.push(n);
  return e;
}
function al(t) {
  let e = Object.create(null);
  for (let i in t) {
    let n = t[i];
    Array.isArray(n) || (n = [n]);
    for (let t of i.split(" "))
      if (t) {
        let i = [],
          s = 2,
          r = t;
        for (let e = 0; ; ) {
          if ("..." == r && e > 0 && e + 3 == t.length) {
            s = 1;
            break;
          }
          let n = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(r);
          if (!n) throw new RangeError("Invalid path: " + t);
          if (
            (i.push(
              "*" == n[0] ? null : '"' == n[0][0] ? JSON.parse(n[0]) : n[0]
            ),
            (e += n[0].length),
            e == t.length)
          )
            break;
          let o = t[e++];
          if (e == t.length && "!" == o) {
            s = 0;
            break;
          }
          if ("/" != o) throw new RangeError("Invalid path: " + t);
          r = t.slice(e);
        }
        let o = i.length - 1,
          l = i[o];
        if (!l) throw new RangeError("Invalid path: " + t);
        let h = new pl(n, s, o > 0 ? i.slice(0, o) : null);
        e[l] = h.sort(e[l]);
      }
  }
  return cl.add(e);
}
const cl = new rr(),
  ul = V.define({ combine: (t) => (t.length ? ml.combinedMatch(t) : null) }),
  fl = V.define({ combine: (t) => (t.length ? t[0].match : null) });
function dl(t) {
  return t.facet(ul) || t.facet(fl);
}
class pl {
  constructor(t, e, i, n) {
    (this.tags = t), (this.mode = e), (this.context = i), (this.next = n);
  }
  sort(t) {
    return !t || t.depth < this.depth
      ? ((this.next = t), this)
      : ((t.next = this.sort(t.next)), t);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
class ml {
  constructor(t, e) {
    let i;
    function n(t) {
      let e = Rt.newName();
      return ((i || (i = Object.create(null)))["." + e] = t), e;
    }
    (this.map = Object.create(null)),
      (this.all = "string" == typeof e.all ? e.all : e.all ? n(e.all) : null);
    for (let e of t) {
      let t =
          (e.class || n(Object.assign({}, e, { tag: null }))) +
          (this.all ? " " + this.all : ""),
        i = e.tag;
      if (Array.isArray(i)) for (let e of i) this.map[e.id] = t;
      else this.map[i.id] = t;
    }
    (this.module = i ? new Rt(i) : null),
      (this.scope = e.scope || null),
      (this.match = this.match.bind(this));
    let s = [vl];
    this.module && s.push(Os.styleModule.of(this.module)),
      (this.extension = s.concat(
        null == e.themeType
          ? ul.of(this)
          : ul.computeN([Os.darkTheme], (t) =>
              t.facet(Os.darkTheme) == ("dark" == e.themeType) ? [this] : []
            )
      )),
      (this.fallback = s.concat(fl.of(this)));
  }
  match(t, e) {
    if (this.scope && e != this.scope) return null;
    for (let e of t.set) {
      let i = this.map[e.id];
      if (void 0 !== i) return e != t && (this.map[t.id] = i), i;
    }
    return (this.map[t.id] = this.all);
  }
  static combinedMatch(t) {
    if (1 == t.length) return t[0].match;
    let e = t.some((t) => t.scope) ? void 0 : Object.create(null);
    return (i, n) => {
      let s = e && e[i.id];
      if (void 0 !== s) return s;
      let r = null;
      for (let e of t) {
        let t = e.match(i, n);
        t && (r = r ? r + " " + t : t);
      }
      return e && (e[i.id] = r), r;
    };
  }
  static define(t, e) {
    return new ml(t, e || {});
  }
  static get(t, e, i) {
    let n = dl(t);
    return n && n(e, i || lr.none);
  }
}
class gl {
  constructor(t) {
    (this.markCache = Object.create(null)),
      (this.tree = Br(t.state)),
      (this.decorations = this.buildDeco(t, dl(t.state)));
  }
  update(t) {
    let e = Br(t.state),
      i = dl(t.state),
      n = i != t.startState.facet(ul);
    e.length < t.view.viewport.to && !n && e.type == this.tree.type
      ? (this.decorations = this.decorations.map(t.changes))
      : (e != this.tree || t.viewportChanged || n) &&
        ((this.tree = e), (this.decorations = this.buildDeco(t.view, i)));
  }
  buildDeco(t, e) {
    if (!e || !this.tree.length) return ii.none;
    let i = new Ht();
    for (let { from: n, to: s } of t.visibleRanges)
      bl(this.tree, n, s, e, (t, e, n) => {
        i.add(
          t,
          e,
          this.markCache[n] || (this.markCache[n] = ii.mark({ class: n }))
        );
      });
    return i.finish();
  }
}
const vl = Y.high(Ri.fromClass(gl, { decorations: (t) => t.decorations })),
  wl = [""];
class yl {
  constructor(t, e, i) {
    (this.at = t), (this.style = e), (this.span = i), (this.class = "");
  }
  startSpan(t, e) {
    e != this.class &&
      (this.flush(t), t > this.at && (this.at = t), (this.class = e));
  }
  flush(t) {
    t > this.at && this.class && this.span(this.at, t, this.class);
  }
  highlightRange(t, e, i, n, s, r) {
    let { type: o, from: l, to: h } = t;
    if (l >= i || h <= e) return;
    (wl[s] = o.name), o.isTop && (r = o);
    let a = n,
      c = o.prop(cl),
      u = !1;
    for (; c; ) {
      if (!c.context || xl(c.context, wl, s)) {
        for (let t of c.tags) {
          let e = this.style(t, r);
          e &&
            (a && (a += " "),
            (a += e),
            1 == c.mode ? (n += (n ? " " : "") + e) : 0 == c.mode && (u = !0));
        }
        break;
      }
      c = c.next;
    }
    if ((this.startSpan(t.from, a), u)) return;
    let f = t.tree && t.tree.prop(rr.mounted);
    if (f && f.overlay) {
      let o = t.node.enter(f.overlay[0].from + l, 1),
        c = t.firstChild();
      for (let u = 0, d = l; ; u++) {
        let p = u < f.overlay.length ? f.overlay[u] : null,
          m = p ? p.from + l : h,
          g = Math.max(e, d),
          v = Math.min(i, m);
        if (g < v && c)
          for (
            ;
            t.from < v &&
            (this.highlightRange(t, g, v, n, s + 1, r),
            this.startSpan(Math.min(i, t.to), a),
            !(t.to >= m) && t.nextSibling());

          );
        if (!p || m > i) break;
        (d = p.to + l),
          d > e &&
            (this.highlightRange(
              o.cursor,
              Math.max(e, p.from + l),
              Math.min(i, d),
              n,
              s,
              f.tree.type
            ),
            this.startSpan(d, a));
      }
      c && t.parent();
    } else if (t.firstChild()) {
      do {
        if (!(t.to <= e)) {
          if (t.from >= i) break;
          this.highlightRange(t, e, i, n, s + 1, r),
            this.startSpan(Math.min(i, t.to), a);
        }
      } while (t.nextSibling());
      t.parent();
    }
  }
}
function bl(t, e, i, n, s) {
  let r = new yl(e, n, s);
  r.highlightRange(t.cursor(), e, i, "", 0, t.type), r.flush(i);
}
function xl(t, e, i) {
  if (t.length > i - 1) return !1;
  for (let n = i - 1, s = t.length - 1; s >= 0; s--, n--) {
    let i = t[s];
    if (i && i != e[n]) return !1;
  }
  return !0;
}
const kl = rl.define,
  Sl = kl(),
  Al = kl(),
  Cl = kl(Al),
  Ml = kl(Al),
  Dl = kl(),
  Ol = kl(Dl),
  Tl = kl(Dl),
  Rl = kl(),
  El = kl(Rl),
  Ll = kl(),
  Bl = kl(),
  Pl = kl(),
  Nl = kl(Pl),
  Il = kl(),
  Vl = {
    comment: Sl,
    lineComment: kl(Sl),
    blockComment: kl(Sl),
    docComment: kl(Sl),
    name: Al,
    variableName: kl(Al),
    typeName: Cl,
    tagName: kl(Cl),
    propertyName: Ml,
    attributeName: kl(Ml),
    className: kl(Al),
    labelName: kl(Al),
    namespace: kl(Al),
    macroName: kl(Al),
    literal: Dl,
    string: Ol,
    docString: kl(Ol),
    character: kl(Ol),
    attributeValue: kl(Ol),
    number: Tl,
    integer: kl(Tl),
    float: kl(Tl),
    bool: kl(Dl),
    regexp: kl(Dl),
    escape: kl(Dl),
    color: kl(Dl),
    url: kl(Dl),
    keyword: Ll,
    self: kl(Ll),
    null: kl(Ll),
    atom: kl(Ll),
    unit: kl(Ll),
    modifier: kl(Ll),
    operatorKeyword: kl(Ll),
    controlKeyword: kl(Ll),
    definitionKeyword: kl(Ll),
    moduleKeyword: kl(Ll),
    operator: Bl,
    derefOperator: kl(Bl),
    arithmeticOperator: kl(Bl),
    logicOperator: kl(Bl),
    bitwiseOperator: kl(Bl),
    compareOperator: kl(Bl),
    updateOperator: kl(Bl),
    definitionOperator: kl(Bl),
    typeOperator: kl(Bl),
    controlOperator: kl(Bl),
    punctuation: Pl,
    separator: kl(Pl),
    bracket: Nl,
    angleBracket: kl(Nl),
    squareBracket: kl(Nl),
    paren: kl(Nl),
    brace: kl(Nl),
    content: Rl,
    heading: El,
    heading1: kl(El),
    heading2: kl(El),
    heading3: kl(El),
    heading4: kl(El),
    heading5: kl(El),
    heading6: kl(El),
    contentSeparator: kl(Rl),
    list: kl(Rl),
    quote: kl(Rl),
    emphasis: kl(Rl),
    strong: kl(Rl),
    link: kl(Rl),
    monospace: kl(Rl),
    strikethrough: kl(Rl),
    inserted: kl(),
    deleted: kl(),
    changed: kl(),
    invalid: kl(),
    meta: Il,
    documentMeta: kl(Il),
    annotation: kl(Il),
    processingInstruction: kl(Il),
    definition: rl.defineModifier(),
    constant: rl.defineModifier(),
    function: rl.defineModifier(),
    standard: rl.defineModifier(),
    local: rl.defineModifier(),
    special: rl.defineModifier(),
  };
Vl.link,
  Vl.heading,
  Vl.emphasis,
  Vl.strong,
  Vl.strikethrough,
  Vl.keyword,
  Vl.atom,
  Vl.bool,
  Vl.url,
  Vl.contentSeparator,
  Vl.labelName,
  Vl.literal,
  Vl.inserted,
  Vl.string,
  Vl.deleted,
  Vl.regexp,
  Vl.escape,
  Vl.string,
  Vl.variableName,
  Vl.variableName,
  Vl.typeName,
  Vl.namespace,
  Vl.className,
  Vl.variableName,
  Vl.macroName,
  Vl.propertyName,
  Vl.comment,
  Vl.meta,
  Vl.invalid,
  Vl.link,
  Vl.heading,
  Vl.emphasis,
  Vl.strong,
  Vl.keyword,
  Vl.atom,
  Vl.bool,
  Vl.url,
  Vl.labelName,
  Vl.inserted,
  Vl.deleted,
  Vl.literal,
  Vl.string,
  Vl.number,
  Vl.regexp,
  Vl.escape,
  Vl.string,
  Vl.variableName,
  Vl.variableName,
  Vl.variableName,
  Vl.variableName,
  Vl.propertyName,
  Vl.typeName,
  Vl.namespace,
  Vl.className,
  Vl.macroName,
  Vl.propertyName,
  Vl.operator,
  Vl.comment,
  Vl.meta,
  Vl.invalid,
  Vl.punctuation;
var Hl = [
    "and",
    "as",
    "block",
    "endblock",
    "by",
    "cycle",
    "debug",
    "else",
    "elif",
    "extends",
    "filter",
    "endfilter",
    "firstof",
    "for",
    "endfor",
    "if",
    "endif",
    "ifchanged",
    "endifchanged",
    "ifequal",
    "endifequal",
    "ifnotequal",
    "endifnotequal",
    "in",
    "include",
    "load",
    "not",
    "now",
    "or",
    "parsed",
    "regroup",
    "reversed",
    "spaceless",
    "endspaceless",
    "ssi",
    "templatetag",
    "openblock",
    "closeblock",
    "openvariable",
    "closevariable",
    "openbrace",
    "closebrace",
    "opencomment",
    "closecomment",
    "widthratio",
    "url",
    "with",
    "endwith",
    "get_current_language",
    "trans",
    "endtrans",
    "noop",
    "blocktrans",
    "endblocktrans",
    "get_available_languages",
    "get_current_language_bidi",
    "plural",
  ],
  Wl = /^[+\-*&%=<>!?|~^]/,
  zl = /^[:\[\(\{]/,
  Fl = ["true", "false"],
  ql = /^(\d[+\-\*\/])?\d+(\.\d+)?/;
function _l(t, e) {
  var i = t.peek();
  if (e.incomment)
    return (
      t.skipTo("#}") ? (t.eatWhile(/\#|}/), (e.incomment = !1)) : t.skipToEnd(),
      "comment"
    );
  if (e.intag) {
    if (e.operator) {
      if (((e.operator = !1), t.match(Fl))) return "atom";
      if (t.match(ql)) return "number";
    }
    if (e.sign) {
      if (((e.sign = !1), t.match(Fl))) return "atom";
      if (t.match(ql)) return "number";
    }
    if (e.instring)
      return i == e.instring && (e.instring = !1), t.next(), "string";
    if ("'" == i || '"' == i) return (e.instring = i), t.next(), "string";
    if (t.match(e.intag + "}") || (t.eat("-") && t.match(e.intag + "}")))
      return (e.intag = !1), "tag";
    if (t.match(Wl)) return (e.operator = !0), "operator";
    if (t.match(zl)) e.sign = !0;
    else if (t.eat(" ") || t.sol()) {
      if (t.match(Hl)) return "keyword";
      if (t.match(Fl)) return "atom";
      if (t.match(ql)) return "number";
      t.sol() && t.next();
    } else t.next();
    return "variable";
  }
  if (t.eat("{")) {
    if (t.eat("#"))
      return (
        (e.incomment = !0),
        t.skipTo("#}")
          ? (t.eatWhile(/\#|}/), (e.incomment = !1))
          : t.skipToEnd(),
        "comment"
      );
    if ((i = t.eat(/\{|%/)))
      return (e.intag = i), "{" == i && (e.intag = "}"), t.eat("-"), "tag";
  }
  t.next();
}
(Hl = new RegExp("((" + Hl.join(")|(") + "))\\b")),
  (Fl = new RegExp("((" + Fl.join(")|(") + "))\\b"));
const jl = {
  startState: function () {
    return { tokenize: _l };
  },
  token: function (t, e) {
    return e.tokenize(t, e);
  },
  languageData: { commentTokens: { block: { open: "{#", close: "#}" } } },
};
var Ul = new RegExp(
  "\\b((" + ["true", "false", "on", "off", "yes", "no"].join(")|(") + "))$",
  "i"
);
const $l = {
  token: function (t, e) {
    var i = t.peek(),
      n = e.escaped;
    if (
      ((e.escaped = !1),
      "#" == i && (0 == t.pos || /\s/.test(t.string.charAt(t.pos - 1))))
    )
      return t.skipToEnd(), "comment";
    if (t.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/)) return "string";
    if (e.literal && t.indentation() > e.keyCol) return t.skipToEnd(), "string";
    if ((e.literal && (e.literal = !1), t.sol())) {
      if (((e.keyCol = 0), (e.pair = !1), (e.pairStart = !1), t.match("---")))
        return "def";
      if (t.match("...")) return "def";
      if (t.match(/^\s*-\s+/)) return "meta";
    }
    if (t.match(/^(\{|\}|\[|\])/))
      return (
        "{" == i
          ? e.inlinePairs++
          : "}" == i
          ? e.inlinePairs--
          : "[" == i
          ? e.inlineList++
          : e.inlineList--,
        "meta"
      );
    if (e.inlineList > 0 && !n && "," == i) return t.next(), "meta";
    if (e.inlinePairs > 0 && !n && "," == i)
      return (
        (e.keyCol = 0), (e.pair = !1), (e.pairStart = !1), t.next(), "meta"
      );
    if (e.pairStart) {
      if (t.match(/^\s*(\||\>)\s*/)) return (e.literal = !0), "meta";
      if (t.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) return "variable";
      if (0 == e.inlinePairs && t.match(/^\s*-?[0-9\.\,]+\s?$/))
        return "number";
      if (e.inlinePairs > 0 && t.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/))
        return "number";
      if (t.match(Ul)) return "keyword";
    }
    return !e.pair &&
      t.match(
        /^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/
      )
      ? ((e.pair = !0), (e.keyCol = t.indentation()), "atom")
      : e.pair && t.match(/^:\s*/)
      ? ((e.pairStart = !0), "meta")
      : ((e.pairStart = !1), (e.escaped = "\\" == i), t.next(), null);
  },
  startState: function () {
    return {
      pair: !1,
      pairStart: !1,
      keyCol: 0,
      inlinePairs: 0,
      inlineList: 0,
      literal: !1,
      escaped: !1,
    };
  },
  languageData: { commentTokens: { line: "#" } },
};
function Kl(t, e, i, n = 0, s = 0) {
  null == e && -1 == (e = t.search(/[^\s\u00a0]/)) && (e = t.length);
  let r = s;
  for (let s = n; s < e; s++) 9 == t.charCodeAt(s) ? (r += i - (r % i)) : r++;
  return r;
}
class Gl {
  constructor(t, e, i) {
    (this.string = t),
      (this.tabSize = e),
      (this.indentUnit = i),
      (this.pos = 0),
      (this.start = 0),
      (this.lastColumnPos = 0),
      (this.lastColumnValue = 0);
  }
  eol() {
    return this.pos >= this.string.length;
  }
  sol() {
    return 0 == this.pos;
  }
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  next() {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  }
  eat(t) {
    let e,
      i = this.string.charAt(this.pos);
    if (
      ((e =
        "string" == typeof t
          ? i == t
          : i && (t instanceof RegExp ? t.test(i) : t(i))),
      e)
    )
      return ++this.pos, i;
  }
  eatWhile(t) {
    let e = this.pos;
    for (; this.eat(t); );
    return this.pos > e;
  }
  eatSpace() {
    let t = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
    return this.pos > t;
  }
  skipToEnd() {
    this.pos = this.string.length;
  }
  skipTo(t) {
    let e = this.string.indexOf(t, this.pos);
    if (e > -1) return (this.pos = e), !0;
  }
  backUp(t) {
    this.pos -= t;
  }
  column() {
    return (
      this.lastColumnPos < this.start &&
        ((this.lastColumnValue = Kl(
          this.string,
          this.start,
          this.tabSize,
          this.lastColumnPos,
          this.lastColumnValue
        )),
        (this.lastColumnPos = this.start)),
      this.lastColumnValue
    );
  }
  indentation() {
    return Kl(this.string, null, this.tabSize);
  }
  match(t, e, i) {
    if ("string" == typeof t) {
      let n = (t) => (i ? t.toLowerCase() : t);
      return n(this.string.substr(this.pos, t.length)) == n(t)
        ? (!1 !== e && (this.pos += t.length), !0)
        : null;
    }
    {
      let i = this.string.slice(this.pos).match(t);
      return i && i.index > 0
        ? null
        : (i && !1 !== e && (this.pos += i[0].length), i);
    }
  }
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function Jl(t) {
  if ("object" != typeof t) return t;
  let e = {};
  for (let i in t) {
    let n = t[i];
    e[i] = n instanceof Array ? n.slice() : n;
  }
  return e;
}
class Yl extends Er {
  constructor(t) {
    let e =
      ((i = t.languageData),
      V.define({ combine: i ? (t) => t.concat(i) : void 0 }));
    var i;
    let n,
      s = {
        token: (r = t).token,
        blankLine: r.blankLine || (() => {}),
        startState: r.startState || (() => !0),
        copyState: r.copyState || Jl,
        indent: r.indent || (() => null),
        languageData: r.languageData || {},
        tokenTable: r.tokenTable || eh,
      };
    var r;
    super(
      e,
      new (class extends Dr {
        createParse(t, e, i) {
          return new Zl(n, t, e, i);
        }
      })(),
      (function (t) {
        let e = lr.define({
          id: ih.length,
          name: "Document",
          props: [Rr.add(() => t)],
        });
        return ih.push(e), e;
      })(e),
      [_r.of((t, e) => this.getIndent(t, e))]
    ),
      (n = this),
      (this.streamParser = s),
      (this.stateAfter = new rr({ perNode: !0 })),
      (this.tokenTable = t.tokenTable ? new oh(s.tokenTable) : lh);
  }
  static define(t) {
    return new Yl(t);
  }
  getIndent(t, e) {
    let i = Br(t.state),
      n = i.resolve(e);
    for (; n && n.type != this.topNode; ) n = n.parent;
    if (!n) return null;
    let s,
      r,
      o = Xl(this, i, 0, n.from, e);
    if (
      (o
        ? ((r = o.state), (s = o.pos + 1))
        : ((r = this.streamParser.startState(t.unit)), (s = 0)),
      e - s > 1e4)
    )
      return null;
    for (; s < e; ) {
      let i = t.state.doc.lineAt(s),
        n = Math.min(e, i.to);
      if (i.length) {
        let e = new Gl(i.text, t.state.tabSize, t.unit);
        for (; e.pos < n - i.from; ) th(this.streamParser.token, e, r);
      } else this.streamParser.blankLine(r, t.unit);
      if (n == e) break;
      s = i.to + 1;
    }
    let { text: l } = t.lineAt(e);
    return this.streamParser.indent(r, /^\s*(.*)/.exec(l)[1], t);
  }
  get allowsNesting() {
    return !1;
  }
}
function Xl(t, e, i, n, s) {
  let r = i >= n && i + e.length <= s && e.prop(t.stateAfter);
  if (r) return { state: t.streamParser.copyState(r), pos: i + e.length };
  for (let r = e.children.length - 1; r >= 0; r--) {
    let o = e.children[r],
      l = i + e.positions[r],
      h = o instanceof ur && l < s && Xl(t, o, l, n, s);
    if (h) return h;
  }
  return null;
}
function Ql(t, e, i, n, s) {
  if (s && i <= 0 && n >= e.length) return e;
  s || e.type != t.topNode || (s = !0);
  for (let r = e.children.length - 1; r >= 0; r--) {
    let o,
      l = e.positions[r],
      h = e.children[r];
    if (l < n && h instanceof ur) {
      if (!(o = Ql(t, h, i - l, n - l, s))) break;
      return s
        ? new ur(
            e.type,
            e.children.slice(0, r).concat(o),
            e.positions.slice(0, r + 1),
            l + o.length
          )
        : o;
    }
  }
  return null;
}
class Zl {
  constructor(t, e, i, n) {
    (this.lang = t),
      (this.input = e),
      (this.fragments = i),
      (this.ranges = n),
      (this.stoppedAt = null),
      (this.chunks = []),
      (this.chunkPos = []),
      (this.chunk = []),
      (this.chunkReused = void 0),
      (this.rangeIndex = 0),
      (this.to = n[n.length - 1].to);
    let s = Ir.get(),
      r = n[0].from,
      { state: o, tree: l } = (function (t, e, i, n) {
        for (let n of e) {
          let e,
            s = n.from + (n.openStart ? 25 : 0),
            r = n.to - (n.openEnd ? 25 : 0),
            o = s <= i && r > i && Xl(t, n.tree, 0 - n.offset, i, r);
          if (o && (e = Ql(t, n.tree, i + n.offset, o.pos + n.offset, !1)))
            return { state: o.state, tree: e };
        }
        return {
          state: t.streamParser.startState(n ? Ur(n) : 4),
          tree: ur.empty,
        };
      })(t, i, r, null == s ? void 0 : s.state);
    (this.state = o), (this.parsedPos = this.chunkStart = r + l.length);
    for (let t = 0; t < l.children.length; t++)
      this.chunks.push(l.children[t]), this.chunkPos.push(l.positions[t]);
    s &&
      this.parsedPos < s.viewport.from - 1e5 &&
      ((this.state = this.lang.streamParser.startState(Ur(s.state))),
      s.skipUntilInView(this.parsedPos, s.viewport.from),
      (this.parsedPos = s.viewport.from)),
      this.moveRangeIndex();
  }
  advance() {
    let t = Ir.get(),
      e = null == this.stoppedAt ? this.to : Math.min(this.to, this.stoppedAt),
      i = Math.min(e, this.chunkStart + 2048);
    for (t && (i = Math.min(i, t.viewport.to)); this.parsedPos < i; )
      this.parseLine(t);
    return (
      this.chunkStart < this.parsedPos && this.finishChunk(),
      this.parsedPos >= e
        ? this.finish()
        : t && this.parsedPos >= t.viewport.to
        ? (t.skipUntilInView(this.parsedPos, e), this.finish())
        : null
    );
  }
  stopAt(t) {
    this.stoppedAt = t;
  }
  lineAfter(t) {
    let e = this.input.chunk(t);
    if (this.input.lineChunks) "\n" == e && (e = "");
    else {
      let t = e.indexOf("\n");
      t > -1 && (e = e.slice(0, t));
    }
    return t + e.length <= this.to ? e : e.slice(0, this.to - t);
  }
  nextLine() {
    let t = this.parsedPos,
      e = this.lineAfter(t),
      i = t + e.length;
    for (let t = this.rangeIndex; ; ) {
      let n = this.ranges[t].to;
      if (n >= i) break;
      if (((e = e.slice(0, n - (i - e.length))), t++, t == this.ranges.length))
        break;
      let s = this.ranges[t].from,
        r = this.lineAfter(s);
      (e += r), (i = s + r.length);
    }
    return { line: e, end: i };
  }
  skipGapsTo(t, e, i) {
    for (;;) {
      let n = this.ranges[this.rangeIndex].to,
        s = t + e;
      if (i > 0 ? n > s : n >= s) break;
      e += this.ranges[++this.rangeIndex].from - n;
    }
    return e;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; )
      this.rangeIndex++;
  }
  emitToken(t, e, i, n, s) {
    if (this.ranges.length > 1) {
      e += s = this.skipGapsTo(e, s, 1);
      let t = this.chunk.length;
      (i += s = this.skipGapsTo(i, s, -1)), (n += this.chunk.length - t);
    }
    return this.chunk.push(t, e, i, n), s;
  }
  parseLine(t) {
    let { line: e, end: i } = this.nextLine(),
      n = 0,
      { streamParser: s } = this.lang,
      r = new Gl(e, t ? t.state.tabSize : 4, t ? Ur(t.state) : 2);
    if (r.eol()) s.blankLine(this.state, r.indentUnit);
    else
      for (; !r.eol(); ) {
        let t = th(s.token, r, this.state);
        if (
          (t &&
            (n = this.emitToken(
              this.lang.tokenTable.resolve(t),
              this.parsedPos + r.start,
              this.parsedPos + r.pos,
              4,
              n
            )),
          r.start > 1e4)
        )
          break;
      }
    (this.parsedPos = i),
      this.moveRangeIndex(),
      this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let t = ur.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: nh,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused,
    });
    (t = new ur(t.type, t.children, t.positions, t.length, [
      [this.lang.stateAfter, this.lang.streamParser.copyState(this.state)],
    ])),
      this.chunks.push(t),
      this.chunkPos.push(this.chunkStart - this.ranges[0].from),
      (this.chunk = []),
      (this.chunkReused = void 0),
      (this.chunkStart = this.parsedPos);
  }
  finish() {
    return new ur(
      this.lang.topNode,
      this.chunks,
      this.chunkPos,
      this.parsedPos - this.ranges[0].from
    ).balance();
  }
}
function th(t, e, i) {
  e.start = e.pos;
  for (let n = 0; n < 10; n++) {
    let n = t(e, i);
    if (e.pos > e.start) return n;
  }
  throw new Error("Stream parser failed to advance stream.");
}
const eh = Object.create(null),
  ih = [lr.none],
  nh = new hr(ih),
  sh = [],
  rh = Object.create(null);
for (let [t, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "typeName"],
  ["attribute", "propertyName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"],
])
  rh[t] = ah(eh, e);
class oh {
  constructor(t) {
    (this.extra = t), (this.table = Object.assign(Object.create(null), rh));
  }
  resolve(t) {
    return t ? this.table[t] || (this.table[t] = ah(this.extra, t)) : 0;
  }
}
const lh = new oh(eh);
function hh(t, e) {
  sh.indexOf(t) > -1 || (sh.push(t), console.warn(e));
}
function ah(t, e) {
  let i = null;
  for (let n of e.split(".")) {
    let e = t[n] || Vl[n];
    e
      ? "function" == typeof e
        ? i
          ? (i = e(i))
          : hh(n, `Modifier ${n} used at start of tag`)
        : i
        ? hh(n, `Tag ${n} used as modifier`)
        : (i = e)
      : hh(n, `Unknown highlighting tag ${n}`);
  }
  if (!i) return 0;
  let n = e.replace(/ /g, "_"),
    s = lr.define({ id: ih.length, name: n, props: [al({ [n]: i })] });
  return ih.push(s), s.id;
}
class ch extends Bt {
  compare(t) {
    return this == t || (this.constructor == t.constructor && this.eq(t));
  }
  eq(t) {
    return !1;
  }
  destroy(t) {}
}
(ch.prototype.elementClass = ""),
  (ch.prototype.toDOM = void 0),
  (ch.prototype.mapMode = S.TrackBefore),
  (ch.prototype.startSide = ch.prototype.endSide = -1),
  (ch.prototype.point = !0);
const uh = V.define(),
  fh = V.define(),
  dh = Os.baseTheme({
    ".cm-gutters": {
      display: "flex",
      height: "100%",
      boxSizing: "border-box",
      left: 0,
      zIndex: 200,
    },
    "&light .cm-gutters": {
      backgroundColor: "#f5f5f5",
      color: "#999",
      borderRight: "1px solid #ddd",
    },
    "&dark .cm-gutters": { backgroundColor: "#333338", color: "#ccc" },
    ".cm-gutter": {
      display: "flex !important",
      flexDirection: "column",
      flexShrink: 0,
      boxSizing: "border-box",
      minHeight: "100%",
      overflow: "hidden",
    },
    ".cm-gutterElement": { boxSizing: "border-box" },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 3px 0 5px",
      minWidth: "20px",
      textAlign: "right",
      whiteSpace: "nowrap",
    },
    "&light .cm-activeLineGutter": { backgroundColor: "#e2f2ff" },
    "&dark .cm-activeLineGutter": { backgroundColor: "#222227" },
  }),
  ph = V.define({ combine: (t) => t.some((t) => t) });
function mh(t) {
  let e = [gh, dh];
  return t && !1 === t.fixed && e.push(ph.of(!0)), e;
}
const gh = Ri.fromClass(
  class {
    constructor(t) {
      (this.view = t),
        (this.prevViewport = t.viewport),
        (this.dom = document.createElement("div")),
        (this.dom.className = "cm-gutters"),
        this.dom.setAttribute("aria-hidden", "true"),
        (this.dom.style.minHeight = this.view.contentHeight + "px"),
        (this.gutters = t.state.facet(fh).map((e) => new bh(t, e)));
      for (let t of this.gutters) this.dom.appendChild(t.dom);
      (this.fixed = !t.state.facet(ph)),
        this.fixed && (this.dom.style.position = "sticky"),
        this.syncGutters(!1),
        t.scrollDOM.insertBefore(this.dom, t.contentDOM);
    }
    update(t) {
      if (this.updateGutters(t)) {
        let e = this.prevViewport,
          i = t.view.viewport,
          n = Math.min(e.to, i.to) - Math.max(e.from, i.from);
        this.syncGutters(n < 0.8 * (i.to - i.from));
      }
      t.geometryChanged &&
        (this.dom.style.minHeight = this.view.contentHeight + "px"),
        this.view.state.facet(ph) != !this.fixed &&
          ((this.fixed = !this.fixed),
          (this.dom.style.position = this.fixed ? "sticky" : "")),
        (this.prevViewport = t.view.viewport);
    }
    syncGutters(t) {
      let e = this.dom.nextSibling;
      t && this.dom.remove();
      let i = Vt.iter(this.view.state.facet(uh), this.view.viewport.from),
        n = [],
        s = this.gutters.map(
          (t) => new yh(t, this.view.viewport, -this.view.documentPadding.top)
        );
      for (let t of this.view.viewportLineBlocks) {
        let e;
        if (Array.isArray(t.type)) {
          for (let i of t.type)
            if (i.type == ei.Text) {
              e = i;
              break;
            }
        } else e = t.type == ei.Text ? t : void 0;
        if (e) {
          n.length && (n = []), wh(i, n, t.from);
          for (let t of s) t.line(this.view, e, n);
        }
      }
      for (let t of s) t.finish();
      t && this.view.scrollDOM.insertBefore(this.dom, e);
    }
    updateGutters(t) {
      let e = t.startState.facet(fh),
        i = t.state.facet(fh),
        n =
          t.docChanged ||
          t.heightChanged ||
          t.viewportChanged ||
          !Vt.eq(
            t.startState.facet(uh),
            t.state.facet(uh),
            t.view.viewport.from,
            t.view.viewport.to
          );
      if (e == i) for (let e of this.gutters) e.update(t) && (n = !0);
      else {
        n = !0;
        let s = [];
        for (let n of i) {
          let i = e.indexOf(n);
          i < 0
            ? s.push(new bh(this.view, n))
            : (this.gutters[i].update(t), s.push(this.gutters[i]));
        }
        for (let t of this.gutters)
          t.dom.remove(), s.indexOf(t) < 0 && t.destroy();
        for (let t of s) this.dom.appendChild(t.dom);
        this.gutters = s;
      }
      return n;
    }
    destroy() {
      for (let t of this.gutters) t.destroy();
      this.dom.remove();
    }
  },
  {
    provide: Di.scrollMargins.from((t) =>
      0 != t.gutters.length && t.fixed
        ? t.view.textDirection == Wi.LTR
          ? { left: t.dom.offsetWidth }
          : { right: t.dom.offsetWidth }
        : null
    ),
  }
);
function vh(t) {
  return Array.isArray(t) ? t : [t];
}
function wh(t, e, i) {
  for (; t.value && t.from <= i; ) t.from == i && e.push(t.value), t.next();
}
class yh {
  constructor(t, e, i) {
    (this.gutter = t),
      (this.height = i),
      (this.localMarkers = []),
      (this.i = 0),
      (this.cursor = Vt.iter(t.markers, e.from));
  }
  line(t, e, i) {
    this.localMarkers.length && (this.localMarkers = []),
      wh(this.cursor, this.localMarkers, e.from);
    let n = i.length ? this.localMarkers.concat(i) : this.localMarkers,
      s = this.gutter.config.lineMarker(t, e, n);
    s && n.unshift(s);
    let r = this.gutter;
    if (0 == n.length && !r.config.renderEmptyElements) return;
    let o = e.top - this.height;
    if (this.i == r.elements.length) {
      let i = new xh(t, e.height, o, n);
      r.elements.push(i), r.dom.appendChild(i.dom);
    } else r.elements[this.i].update(t, e.height, o, n);
    (this.height = e.bottom), this.i++;
  }
  finish() {
    let t = this.gutter;
    for (; t.elements.length > this.i; ) {
      let e = t.elements.pop();
      t.dom.removeChild(e.dom), e.destroy();
    }
  }
}
class bh {
  constructor(t, e) {
    (this.view = t),
      (this.config = e),
      (this.elements = []),
      (this.spacer = null),
      (this.dom = document.createElement("div")),
      (this.dom.className =
        "cm-gutter" + (this.config.class ? " " + this.config.class : ""));
    for (let i in e.domEventHandlers)
      this.dom.addEventListener(i, (n) => {
        let s = t.lineBlockAtHeight(n.clientY - t.documentTop);
        e.domEventHandlers[i](t, s, n) && n.preventDefault();
      });
    (this.markers = vh(e.markers(t))),
      e.initialSpacer &&
        ((this.spacer = new xh(t, 0, 0, [e.initialSpacer(t)])),
        this.dom.appendChild(this.spacer.dom),
        (this.spacer.dom.style.cssText +=
          "visibility: hidden; pointer-events: none"));
  }
  update(t) {
    let e = this.markers;
    if (
      ((this.markers = vh(this.config.markers(t.view))),
      this.spacer && this.config.updateSpacer)
    ) {
      let e = this.config.updateSpacer(this.spacer.markers[0], t);
      e != this.spacer.markers[0] && this.spacer.update(t.view, 0, 0, [e]);
    }
    let i = t.view.viewport;
    return (
      !Vt.eq(this.markers, e, i.from, i.to) ||
      (!!this.config.lineMarkerChange && this.config.lineMarkerChange(t))
    );
  }
  destroy() {
    for (let t of this.elements) t.destroy();
  }
}
class xh {
  constructor(t, e, i, n) {
    (this.height = -1),
      (this.above = 0),
      (this.markers = []),
      (this.dom = document.createElement("div")),
      this.update(t, e, i, n);
  }
  update(t, e, i, n) {
    this.height != e && (this.dom.style.height = (this.height = e) + "px"),
      this.above != i &&
        (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""),
      (function (t, e) {
        if (t.length != e.length) return !1;
        for (let i = 0; i < t.length; i++) if (!t[i].compare(e[i])) return !1;
        return !0;
      })(this.markers, n) || this.setMarkers(t, n);
  }
  setMarkers(t, e) {
    let i = "cm-gutterElement",
      n = this.dom.firstChild;
    for (let s = 0, r = 0; ; ) {
      let o = r,
        l = s < e.length ? e[s++] : null,
        h = !1;
      if (l) {
        let t = l.elementClass;
        t && (i += " " + t);
        for (let t = r; t < this.markers.length; t++)
          if (this.markers[t].compare(l)) {
            (o = t), (h = !0);
            break;
          }
      } else o = this.markers.length;
      for (; r < o; ) {
        let t = this.markers[r++];
        if (t.toDOM) {
          t.destroy(n);
          let e = n.nextSibling;
          n.remove(), (n = e);
        }
      }
      if (!l) break;
      l.toDOM &&
        (h ? (n = n.nextSibling) : this.dom.insertBefore(l.toDOM(t), n)),
        h && r++;
    }
    (this.dom.className = i), (this.markers = e);
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
const kh = V.define(),
  Sh = V.define({
    combine: (t) =>
      Mt(
        t,
        { formatNumber: String, domEventHandlers: {} },
        {
          domEventHandlers(t, e) {
            let i = Object.assign({}, t);
            for (let t in e) {
              let n = i[t],
                s = e[t];
              i[t] = n ? (t, e, i) => n(t, e, i) || s(t, e, i) : s;
            }
            return i;
          },
        }
      ),
  });
class Ah extends ch {
  constructor(t) {
    super(), (this.number = t);
  }
  eq(t) {
    return this.number == t.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function Ch(t, e) {
  return t.state.facet(Sh).formatNumber(e, t.state);
}
const Mh = fh.compute([Sh], (t) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers: (t) => t.state.facet(kh),
  lineMarker: (t, e, i) =>
    i.some((t) => t.toDOM)
      ? null
      : new Ah(Ch(t, t.state.doc.lineAt(e.from).number)),
  lineMarkerChange: (t) => t.startState.facet(Sh) != t.state.facet(Sh),
  initialSpacer: (t) => new Ah(Ch(t, Oh(t.state.doc.lines))),
  updateSpacer(t, e) {
    let i = Ch(e.view, Oh(e.view.state.doc.lines));
    return i == t.number ? t : new Ah(i);
  },
  domEventHandlers: t.facet(Sh).domEventHandlers,
}));
function Dh(t = {}) {
  return [Sh.of(t), mh(), Mh];
}
function Oh(t) {
  let e = 9;
  for (; e < t; ) e = 10 * e + 9;
  return e;
}
const Th = ct.define(),
  Rh = ct.define(),
  Eh = V.define(),
  Lh = V.define({
    combine: (t) =>
      Mt(
        t,
        { minDepth: 100, newGroupDelay: 500 },
        { minDepth: Math.max, newGroupDelay: Math.min }
      ),
  });
const Bh = _.define({
  create: () => Jh.empty,
  update(t, e) {
    let i = e.state.facet(Lh),
      n = e.annotation(Th);
    if (n) {
      let s = e.docChanged
          ? B.single(
              (function (t) {
                let e = 0;
                return t.iterChangedRanges((t, i) => (e = i)), e;
              })(e.changes)
            )
          : void 0,
        r = zh.fromTransaction(e, s),
        o = n.side,
        l = 0 == o ? t.undone : t.done;
      return (
        (l = r
          ? Fh(l, l.length, i.minDepth, r)
          : jh(l, e.startState.selection)),
        new Jh(0 == o ? n.rest : l, 0 == o ? l : n.rest)
      );
    }
    let s = e.annotation(Rh);
    if (
      (("full" != s && "before" != s) || (t = t.isolate()),
      !1 === e.annotation(pt.addToHistory))
    )
      return e.changes.empty ? t : t.addMapping(e.changes.desc);
    let r = zh.fromTransaction(e),
      o = e.annotation(pt.time),
      l = e.annotation(pt.userEvent);
    return (
      r
        ? (t = t.addChanges(r, o, l, i.newGroupDelay, i.minDepth))
        : e.selection &&
          (t = t.addSelection(e.startState.selection, o, l, i.newGroupDelay)),
      ("full" != s && "after" != s) || (t = t.isolate()),
      t
    );
  },
  toJSON: (t) => ({
    done: t.done.map((t) => t.toJSON()),
    undone: t.undone.map((t) => t.toJSON()),
  }),
  fromJSON: (t) => new Jh(t.done.map(zh.fromJSON), t.undone.map(zh.fromJSON)),
});
function Ph(t = {}) {
  return [
    Bh,
    Lh.of(t),
    Os.domEventHandlers({
      beforeinput(t, e) {
        let i =
          "historyUndo" == t.inputType
            ? Ih
            : "historyRedo" == t.inputType
            ? Vh
            : null;
        return !!i && (t.preventDefault(), i(e));
      },
    }),
  ];
}
function Nh(t, e) {
  return function ({ state: i, dispatch: n }) {
    if (!e && i.readOnly) return !1;
    let s = i.field(Bh, !1);
    if (!s) return !1;
    let r = s.pop(t, i, e);
    return !!r && (n(r), !0);
  };
}
const Ih = Nh(0, !1),
  Vh = Nh(1, !1),
  Hh = Nh(0, !0),
  Wh = Nh(1, !0);
class zh {
  constructor(t, e, i, n, s) {
    (this.changes = t),
      (this.effects = e),
      (this.mapped = i),
      (this.startSelection = n),
      (this.selectionsAfter = s);
  }
  setSelAfter(t) {
    return new zh(
      this.changes,
      this.effects,
      this.mapped,
      this.startSelection,
      t
    );
  }
  toJSON() {
    var t, e, i;
    return {
      changes:
        null === (t = this.changes) || void 0 === t ? void 0 : t.toJSON(),
      mapped: null === (e = this.mapped) || void 0 === e ? void 0 : e.toJSON(),
      startSelection:
        null === (i = this.startSelection) || void 0 === i
          ? void 0
          : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((t) => t.toJSON()),
    };
  }
  static fromJSON(t) {
    return new zh(
      t.changes && C.fromJSON(t.changes),
      [],
      t.mapped && A.fromJSON(t.mapped),
      t.startSelection && B.fromJSON(t.startSelection),
      t.selectionsAfter.map(B.fromJSON)
    );
  }
  static fromTransaction(t, e) {
    let i = _h;
    for (let e of t.startState.facet(Eh)) {
      let n = e(t);
      n.length && (i = i.concat(n));
    }
    return !i.length && t.changes.empty
      ? null
      : new zh(
          t.changes.invert(t.startState.doc),
          i,
          void 0,
          e || t.startState.selection,
          _h
        );
  }
  static selection(t) {
    return new zh(void 0, _h, void 0, void 0, t);
  }
}
function Fh(t, e, i, n) {
  let s = e + 1 > i + 20 ? e - i - 1 : 0,
    r = t.slice(s, e);
  return r.push(n), r;
}
function qh(t, e) {
  return t.length ? (e.length ? t.concat(e) : t) : e;
}
const _h = [];
function jh(t, e) {
  if (t.length) {
    let i = t[t.length - 1],
      n = i.selectionsAfter.slice(Math.max(0, i.selectionsAfter.length - 200));
    return n.length && n[n.length - 1].eq(e)
      ? t
      : (n.push(e), Fh(t, t.length - 1, 1e9, i.setSelAfter(n)));
  }
  return [zh.selection([e])];
}
function Uh(t) {
  let e = t[t.length - 1],
    i = t.slice();
  return (
    (i[t.length - 1] = e.setSelAfter(
      e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)
    )),
    i
  );
}
function $h(t, e) {
  if (!t.length) return t;
  let i = t.length,
    n = _h;
  for (; i; ) {
    let s = Kh(t[i - 1], e, n);
    if ((s.changes && !s.changes.empty) || s.effects.length) {
      let e = t.slice(0, i);
      return (e[i - 1] = s), e;
    }
    (e = s.mapped), i--, (n = s.selectionsAfter);
  }
  return n.length ? [zh.selection(n)] : _h;
}
function Kh(t, e, i) {
  let n = qh(
    t.selectionsAfter.length ? t.selectionsAfter.map((t) => t.map(e)) : _h,
    i
  );
  if (!t.changes) return zh.selection(n);
  let s = t.changes.map(e),
    r = e.mapDesc(t.changes, !0),
    o = t.mapped ? t.mapped.composeDesc(r) : r;
  return new zh(s, dt.mapEffects(t.effects, e), o, t.startSelection.map(r), n);
}
const Gh = /^(input\.type|delete)($|\.)/;
class Jh {
  constructor(t, e, i = 0, n) {
    (this.done = t),
      (this.undone = e),
      (this.prevTime = i),
      (this.prevUserEvent = n);
  }
  isolate() {
    return this.prevTime ? new Jh(this.done, this.undone) : this;
  }
  addChanges(t, e, i, n, s) {
    let r = this.done,
      o = r[r.length - 1];
    return (
      (r =
        o &&
        o.changes &&
        !o.changes.empty &&
        t.changes &&
        (!i || Gh.test(i)) &&
        ((!o.selectionsAfter.length &&
          e - this.prevTime < n &&
          (function (t, e) {
            let i = [],
              n = !1;
            return (
              t.iterChangedRanges((t, e) => i.push(t, e)),
              e.iterChangedRanges((t, e, s, r) => {
                for (let t = 0; t < i.length; ) {
                  let e = i[t++],
                    o = i[t++];
                  r >= e && s <= o && (n = !0);
                }
              }),
              n
            );
          })(o.changes, t.changes)) ||
          "input.type.compose" == i)
          ? Fh(
              r,
              r.length - 1,
              s,
              new zh(
                t.changes.compose(o.changes),
                qh(t.effects, o.effects),
                o.mapped,
                o.startSelection,
                _h
              )
            )
          : Fh(r, r.length, s, t)),
      new Jh(r, _h, e, i)
    );
  }
  addSelection(t, e, i, n) {
    let s = this.done.length
      ? this.done[this.done.length - 1].selectionsAfter
      : _h;
    return s.length > 0 &&
      e - this.prevTime < n &&
      i == this.prevUserEvent &&
      i &&
      /^select($|\.)/.test(i) &&
      ((r = s[s.length - 1]),
      (o = t),
      r.ranges.length == o.ranges.length &&
        0 === r.ranges.filter((t, e) => t.empty != o.ranges[e].empty).length)
      ? this
      : new Jh(jh(this.done, t), this.undone, e, i);
    var r, o;
  }
  addMapping(t) {
    return new Jh(
      $h(this.done, t),
      $h(this.undone, t),
      this.prevTime,
      this.prevUserEvent
    );
  }
  pop(t, e, i) {
    let n = 0 == t ? this.done : this.undone;
    if (0 == n.length) return null;
    let s = n[n.length - 1];
    if (i && s.selectionsAfter.length)
      return e.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: Th.of({ side: t, rest: Uh(n) }),
        userEvent: 0 == t ? "select.undo" : "select.redo",
        scrollIntoView: !0,
      });
    if (s.changes) {
      let i = 1 == n.length ? _h : n.slice(0, n.length - 1);
      return (
        s.mapped && (i = $h(i, s.mapped)),
        e.update({
          changes: s.changes,
          selection: s.startSelection,
          effects: s.effects,
          annotations: Th.of({ side: t, rest: i }),
          filter: !1,
          userEvent: 0 == t ? "undo" : "redo",
          scrollIntoView: !0,
        })
      );
    }
    return null;
  }
}
Jh.empty = new Jh(_h, _h);
const Yh = [
  { key: "Mod-z", run: Ih, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Vh, preventDefault: !0 },
  { key: "Mod-u", run: Hh, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Wh, preventDefault: !0 },
];
function Xh(t, e) {
  let i = t.posAtCoords({ x: e.clientX, y: e.clientY }, !1),
    n = t.state.doc.lineAt(i),
    s = i - n.from,
    r =
      s > 2e3
        ? -1
        : s == n.length
        ? (function (t, e) {
            let i = t.coordsAtPos(t.viewport.from);
            return i
              ? Math.round(Math.abs((i.left - e) / t.defaultCharacterWidth))
              : -1;
          })(t, e.clientX)
        : u(n.text, t.state.tabSize, i - n.from);
  return { line: n.number, col: r, off: s };
}
function Qh(t, e) {
  let i = Xh(t, e),
    n = t.state.selection;
  return i
    ? {
        update(t) {
          if (t.docChanged) {
            let e = t.changes.mapPos(t.startState.doc.line(i.line).from),
              s = t.state.doc.lineAt(e);
            (i = {
              line: s.number,
              col: i.col,
              off: Math.min(i.off, s.length),
            }),
              (n = n.map(t.changes));
          }
        },
        get(e, s, r) {
          let o = Xh(t, e);
          if (!o) return n;
          let l = (function (t, e, i) {
            let n = Math.min(e.line, i.line),
              s = Math.max(e.line, i.line),
              r = [];
            if (e.off > 2e3 || i.off > 2e3 || e.col < 0 || i.col < 0) {
              let o = Math.min(e.off, i.off),
                l = Math.max(e.off, i.off);
              for (let e = n; e <= s; e++) {
                let i = t.doc.line(e);
                i.length <= l && r.push(B.range(i.from + o, i.to + l));
              }
            } else {
              let o = Math.min(e.col, i.col),
                l = Math.max(e.col, i.col);
              for (let e = n; e <= s; e++) {
                let i = t.doc.line(e),
                  n = f(i.text, o, t.tabSize, !0);
                if (n > -1) {
                  let e = f(i.text, l, t.tabSize);
                  r.push(B.range(i.from + n, i.from + e));
                }
              }
            }
            return r;
          })(t.state, i, o);
          return l.length
            ? r
              ? B.create(l.concat(n.ranges))
              : B.create(l)
            : n;
        },
      }
    : null;
}
function Zh(t) {
  let e =
    (null == t ? void 0 : t.eventFilter) || ((t) => t.altKey && 0 == t.button);
  return Os.mouseSelectionStyle.of((t, i) => (e(i) ? Qh(t, i) : null));
}
const ta = V.define({
  combine(t) {
    let e, i;
    for (let n of t) (e = e || n.topContainer), (i = i || n.bottomContainer);
    return { topContainer: e, bottomContainer: i };
  },
});
function ea(t, e) {
  let i = t.plugin(ia),
    n = i ? i.specs.indexOf(e) : -1;
  return n > -1 ? i.panels[n] : null;
}
const ia = Ri.fromClass(
  class {
    constructor(t) {
      (this.input = t.state.facet(oa)),
        (this.specs = this.input.filter((t) => t)),
        (this.panels = this.specs.map((e) => e(t)));
      let e = t.state.facet(ta);
      (this.top = new na(t, !0, e.topContainer)),
        (this.bottom = new na(t, !1, e.bottomContainer)),
        this.top.sync(this.panels.filter((t) => t.top)),
        this.bottom.sync(this.panels.filter((t) => !t.top));
      for (let t of this.panels)
        t.dom.classList.add("cm-panel"), t.mount && t.mount();
    }
    update(t) {
      let e = t.state.facet(ta);
      this.top.container != e.topContainer &&
        (this.top.sync([]), (this.top = new na(t.view, !0, e.topContainer))),
        this.bottom.container != e.bottomContainer &&
          (this.bottom.sync([]),
          (this.bottom = new na(t.view, !1, e.bottomContainer))),
        this.top.syncClasses(),
        this.bottom.syncClasses();
      let i = t.state.facet(oa);
      if (i != this.input) {
        let e = i.filter((t) => t),
          n = [],
          s = [],
          r = [],
          o = [];
        for (let i of e) {
          let e,
            l = this.specs.indexOf(i);
          l < 0
            ? ((e = i(t.view)), o.push(e))
            : ((e = this.panels[l]), e.update && e.update(t)),
            n.push(e),
            (e.top ? s : r).push(e);
        }
        (this.specs = e),
          (this.panels = n),
          this.top.sync(s),
          this.bottom.sync(r);
        for (let t of o) t.dom.classList.add("cm-panel"), t.mount && t.mount();
      } else for (let e of this.panels) e.update && e.update(t);
    }
    destroy() {
      this.top.sync([]), this.bottom.sync([]);
    }
  },
  {
    provide: Di.scrollMargins.from((t) => ({
      top: t.top.scrollMargin(),
      bottom: t.bottom.scrollMargin(),
    })),
  }
);
class na {
  constructor(t, e, i) {
    (this.view = t),
      (this.top = e),
      (this.container = i),
      (this.dom = void 0),
      (this.classes = ""),
      (this.panels = []),
      this.syncClasses();
  }
  sync(t) {
    for (let e of this.panels) e.destroy && t.indexOf(e) < 0 && e.destroy();
    (this.panels = t), this.syncDOM();
  }
  syncDOM() {
    if (0 == this.panels.length)
      return void (this.dom && (this.dom.remove(), (this.dom = void 0)));
    if (!this.dom) {
      (this.dom = document.createElement("div")),
        (this.dom.className = this.top
          ? "cm-panels cm-panels-top"
          : "cm-panels cm-panels-bottom"),
        (this.dom.style[this.top ? "top" : "bottom"] = "0");
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let t = this.dom.firstChild;
    for (let e of this.panels)
      if (e.dom.parentNode == this.dom) {
        for (; t != e.dom; ) t = sa(t);
        t = t.nextSibling;
      } else this.dom.insertBefore(e.dom, t);
    for (; t; ) t = sa(t);
  }
  scrollMargin() {
    return !this.dom || this.container
      ? 0
      : Math.max(
          0,
          this.top
            ? this.dom.getBoundingClientRect().bottom -
                Math.max(0, this.view.scrollDOM.getBoundingClientRect().top)
            : Math.min(
                innerHeight,
                this.view.scrollDOM.getBoundingClientRect().bottom
              ) - this.dom.getBoundingClientRect().top
        );
  }
  syncClasses() {
    if (this.container && this.classes != this.view.themeClasses) {
      for (let t of this.classes.split(" "))
        t && this.container.classList.remove(t);
      for (let t of (this.classes = this.view.themeClasses).split(" "))
        t && this.container.classList.add(t);
    }
  }
}
function sa(t) {
  let e = t.nextSibling;
  return t.remove(), e;
}
const ra = Os.baseTheme({
    ".cm-panels": {
      boxSizing: "border-box",
      position: "sticky",
      left: 0,
      right: 0,
    },
    "&light .cm-panels": { backgroundColor: "#f5f5f5", color: "black" },
    "&light .cm-panels-top": { borderBottom: "1px solid #ddd" },
    "&light .cm-panels-bottom": { borderTop: "1px solid #ddd" },
    "&dark .cm-panels": { backgroundColor: "#333338", color: "white" },
  }),
  oa = V.define({ enables: [ia, ra] });
function la() {
  var t = arguments[0];
  "string" == typeof t && (t = document.createElement(t));
  var e = 1,
    i = arguments[1];
  if (i && "object" == typeof i && null == i.nodeType && !Array.isArray(i)) {
    for (var n in i)
      if (Object.prototype.hasOwnProperty.call(i, n)) {
        var s = i[n];
        "string" == typeof s ? t.setAttribute(n, s) : null != s && (t[n] = s);
      }
    e++;
  }
  for (; e < arguments.length; e++) ha(t, arguments[e]);
  return t;
}
function ha(t, e) {
  if ("string" == typeof e) t.appendChild(document.createTextNode(e));
  else if (null == e);
  else if (null != e.nodeType) t.appendChild(e);
  else {
    if (!Array.isArray(e)) throw new RangeError("Unsupported child node: " + e);
    for (var i = 0; i < e.length; i++) ha(t, e[i]);
  }
}
const aa =
  "function" == typeof String.prototype.normalize
    ? (t) => t.normalize("NFKD")
    : (t) => t;
class ca {
  constructor(t, e, i = 0, n = t.length, s) {
    (this.value = { from: 0, to: 0 }),
      (this.done = !1),
      (this.matches = []),
      (this.buffer = ""),
      (this.bufferPos = 0),
      (this.iter = t.iterRange(i, n)),
      (this.bufferStart = i),
      (this.normalize = s ? (t) => s(aa(t)) : aa),
      (this.query = this.normalize(e));
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (
        ((this.bufferStart += this.buffer.length),
        this.iter.next(),
        this.iter.done)
      )
        return -1;
      (this.bufferPos = 0), (this.buffer = this.iter.value);
    }
    return h(this.buffer, this.bufferPos);
  }
  next() {
    for (; this.matches.length; ) this.matches.pop();
    return this.nextOverlapping();
  }
  nextOverlapping() {
    for (;;) {
      let t = this.peek();
      if (t < 0) return (this.done = !0), this;
      let e = a(t),
        i = this.bufferStart + this.bufferPos;
      this.bufferPos += c(t);
      let n = this.normalize(e);
      for (let t = 0, s = i; ; t++) {
        let r = n.charCodeAt(t),
          o = this.match(r, s);
        if (o) return (this.value = o), this;
        if (t == n.length - 1) break;
        s == i && t < e.length && e.charCodeAt(t) == r && s++;
      }
    }
  }
  match(t, e) {
    let i = null;
    for (let n = 0; n < this.matches.length; n += 2) {
      let s = this.matches[n],
        r = !1;
      this.query.charCodeAt(s) == t &&
        (s == this.query.length - 1
          ? (i = { from: this.matches[n + 1], to: e + 1 })
          : (this.matches[n]++, (r = !0))),
        r || (this.matches.splice(n, 2), (n -= 2));
    }
    return (
      this.query.charCodeAt(0) == t &&
        (1 == this.query.length
          ? (i = { from: e, to: e + 1 })
          : this.matches.push(1, e)),
      i
    );
  }
}
"undefined" != typeof Symbol &&
  (ca.prototype[Symbol.iterator] = function () {
    return this;
  });
const ua = { from: -1, to: -1, match: /.*/.exec("") },
  fa = "gm" + (null == /x/.unicode ? "" : "u");
class da {
  constructor(t, e, i, n = 0, s = t.length) {
    if (
      ((this.to = s),
      (this.curLine = ""),
      (this.done = !1),
      (this.value = ua),
      /\\[sWDnr]|\n|\r|\[\^/.test(e))
    )
      return new ga(t, e, i, n, s);
    (this.re = new RegExp(
      e,
      fa + ((null == i ? void 0 : i.ignoreCase) ? "i" : "")
    )),
      (this.iter = t.iter());
    let r = t.lineAt(n);
    (this.curLineStart = r.from),
      (this.matchPos = n),
      this.getLine(this.curLineStart);
  }
  getLine(t) {
    this.iter.next(t),
      this.iter.lineBreak
        ? (this.curLine = "")
        : ((this.curLine = this.iter.value),
          this.curLineStart + this.curLine.length > this.to &&
            (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)),
          this.iter.next());
  }
  nextLine() {
    (this.curLineStart = this.curLineStart + this.curLine.length + 1),
      this.curLineStart > this.to ? (this.curLine = "") : this.getLine(0);
  }
  next() {
    for (let t = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = t;
      let e = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (e) {
        let i = this.curLineStart + e.index,
          n = i + e[0].length;
        if (
          ((this.matchPos = n + (i == n ? 1 : 0)),
          i == this.curLine.length && this.nextLine(),
          i < n || i > this.value.to)
        )
          return (this.value = { from: i, to: n, match: e }), this;
        t = this.matchPos - this.curLineStart;
      } else {
        if (!(this.curLineStart + this.curLine.length < this.to))
          return (this.done = !0), this;
        this.nextLine(), (t = 0);
      }
    }
  }
}
const pa = new WeakMap();
class ma {
  constructor(t, e) {
    (this.from = t), (this.text = e);
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(t, e, i) {
    let n = pa.get(t);
    if (!n || n.from >= i || n.to <= e) {
      let n = new ma(e, t.sliceString(e, i));
      return pa.set(t, n), n;
    }
    if (n.from == e && n.to == i) return n;
    let { text: s, from: r } = n;
    return (
      r > e && ((s = t.sliceString(e, r) + s), (r = e)),
      n.to < i && (s += t.sliceString(n.to, i)),
      pa.set(t, new ma(r, s)),
      new ma(e, s.slice(e - r, i - r))
    );
  }
}
class ga {
  constructor(t, e, i, n, s) {
    (this.text = t),
      (this.to = s),
      (this.done = !1),
      (this.value = ua),
      (this.matchPos = n),
      (this.re = new RegExp(
        e,
        fa + ((null == i ? void 0 : i.ignoreCase) ? "i" : "")
      )),
      (this.flat = ma.get(t, n, this.chunkEnd(n + 5e3)));
  }
  chunkEnd(t) {
    return t >= this.to ? this.to : this.text.lineAt(t).to;
  }
  next() {
    for (;;) {
      let t = (this.re.lastIndex = this.matchPos - this.flat.from),
        e = this.re.exec(this.flat.text);
      if (
        (e &&
          !e[0] &&
          e.index == t &&
          ((this.re.lastIndex = t + 1), (e = this.re.exec(this.flat.text))),
        e &&
          this.flat.to < this.to &&
          e.index + e[0].length > this.flat.text.length - 10 &&
          (e = null),
        e)
      ) {
        let t = this.flat.from + e.index,
          i = t + e[0].length;
        return (
          (this.value = { from: t, to: i, match: e }),
          (this.matchPos = i + (t == i ? 1 : 0)),
          this
        );
      }
      if (this.flat.to == this.to) return (this.done = !0), this;
      this.flat = ma.get(
        this.text,
        this.flat.from,
        this.chunkEnd(this.flat.from + 2 * this.flat.text.length)
      );
    }
  }
}
function va(t) {
  let e = la("input", { class: "cm-textfield", name: "line" });
  function i() {
    let i = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(e.value);
    if (!i) return;
    let { state: n } = t,
      s = n.doc.lineAt(n.selection.main.head),
      [, r, o, l, h] = i,
      a = l ? +l.slice(1) : 0,
      c = o ? +o : s.number;
    if (o && h) {
      let t = c / 100;
      r && (t = t * ("-" == r ? -1 : 1) + s.number / n.doc.lines),
        (c = Math.round(n.doc.lines * t));
    } else o && r && (c = c * ("-" == r ? -1 : 1) + s.number);
    let u = n.doc.line(Math.max(1, Math.min(n.doc.lines, c)));
    t.dispatch({
      effects: wa.of(!1),
      selection: B.cursor(u.from + Math.max(0, Math.min(a, u.length))),
      scrollIntoView: !0,
    }),
      t.focus();
  }
  return {
    dom: la(
      "form",
      {
        class: "cm-gotoLine",
        onkeydown: (e) => {
          27 == e.keyCode
            ? (e.preventDefault(),
              t.dispatch({ effects: wa.of(!1) }),
              t.focus())
            : 13 == e.keyCode && (e.preventDefault(), i());
        },
        onsubmit: (t) => {
          t.preventDefault(), i();
        },
      },
      la("label", t.state.phrase("Go to line"), ": ", e),
      " ",
      la("button", { class: "cm-button", type: "submit" }, t.state.phrase("go"))
    ),
    pos: -10,
  };
}
"undefined" != typeof Symbol &&
  (da.prototype[Symbol.iterator] = ga.prototype[Symbol.iterator] =
    function () {
      return this;
    });
const wa = dt.define(),
  ya = _.define({
    create: () => !0,
    update(t, e) {
      for (let i of e.effects) i.is(wa) && (t = i.value);
      return t;
    },
    provide: (t) => oa.from(t, (t) => (t ? va : null)),
  }),
  ba = Os.baseTheme({
    ".cm-panel.cm-gotoLine": {
      padding: "2px 6px 4px",
      "& label": { fontSize: "80%" },
    },
  }),
  xa = {
    highlightWordAroundCursor: !1,
    minSelectionLength: 1,
    maxMatches: 100,
    wholeWords: !0,
  },
  ka = V.define({
    combine: (t) =>
      Mt(t, xa, {
        highlightWordAroundCursor: (t, e) => t || e,
        minSelectionLength: Math.min,
        maxMatches: Math.min,
      }),
  });
function Sa(t) {
  let e = [Oa, Da];
  return t && e.push(ka.of(t)), e;
}
const Aa = ii.mark({ class: "cm-selectionMatch" }),
  Ca = ii.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function Ma(t, e, i, n) {
  return !(
    (0 != i && t(e.sliceDoc(i - 1, i)) == xt.Word) ||
    (n != e.doc.length && t(e.sliceDoc(n, n + 1)) == xt.Word)
  );
}
const Da = Ri.fromClass(
    class {
      constructor(t) {
        this.decorations = this.getDeco(t);
      }
      update(t) {
        (t.selectionSet || t.docChanged || t.viewportChanged) &&
          (this.decorations = this.getDeco(t.view));
      }
      getDeco(t) {
        let e = t.state.facet(ka),
          { state: i } = t,
          n = i.selection;
        if (n.ranges.length > 1) return ii.none;
        let s,
          r = n.main,
          o = null;
        if (r.empty) {
          if (!e.highlightWordAroundCursor) return ii.none;
          let t = i.wordAt(r.head);
          if (!t) return ii.none;
          (o = i.charCategorizer(r.head)), (s = i.sliceDoc(t.from, t.to));
        } else {
          let t = r.to - r.from;
          if (t < e.minSelectionLength || t > 200) return ii.none;
          if (e.wholeWords) {
            if (
              ((s = i.sliceDoc(r.from, r.to)),
              (o = i.charCategorizer(r.head)),
              !Ma(o, i, r.from, r.to) ||
                !(function (t, e, i, n) {
                  return (
                    t(e.sliceDoc(i, i + 1)) == xt.Word &&
                    t(e.sliceDoc(n - 1, n)) == xt.Word
                  );
                })(o, i, r.from, r.to))
            )
              return ii.none;
          } else if (((s = i.sliceDoc(r.from, r.to).trim()), !s))
            return ii.none;
        }
        let l = [];
        for (let n of t.visibleRanges) {
          let t = new ca(i.doc, s, n.from, n.to);
          for (; !t.next().done; ) {
            let { from: n, to: s } = t.value;
            if (
              (!o || Ma(o, i, n, s)) &&
              (r.empty && n <= r.from && s >= r.to
                ? l.push(Ca.range(n, s))
                : (n >= r.to || s <= r.from) && l.push(Aa.range(n, s)),
              l.length > e.maxMatches)
            )
              return ii.none;
          }
        }
        return ii.set(l);
      }
    },
    { decorations: (t) => t.decorations }
  ),
  Oa = Os.baseTheme({
    ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
    ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" },
  });
const Ta = V.define({
  combine(t) {
    var e;
    return {
      top: t.reduce((t, e) => (null != t ? t : e.top), void 0) || !1,
      caseSensitive:
        t.reduce(
          (t, e) => (null != t ? t : e.caseSensitive || e.matchCase),
          void 0
        ) || !1,
      createPanel:
        (null === (e = t.find((t) => t.createPanel)) || void 0 === e
          ? void 0
          : e.createPanel) || ((t) => new tc(t)),
    };
  },
});
class Ra {
  constructor(t) {
    (this.search = t.search),
      (this.caseSensitive = !!t.caseSensitive),
      (this.regexp = !!t.regexp),
      (this.replace = t.replace || ""),
      (this.valid =
        !!this.search &&
        (!this.regexp ||
          (function (t) {
            try {
              return new RegExp(t, fa), !0;
            } catch (t) {
              return !1;
            }
          })(this.search))),
      (this.unquoted = this.search.replace(/\\([nrt\\])/g, (t, e) =>
        "n" == e ? "\n" : "r" == e ? "\r" : "t" == e ? "\t" : "\\"
      ));
  }
  eq(t) {
    return (
      this.search == t.search &&
      this.replace == t.replace &&
      this.caseSensitive == t.caseSensitive &&
      this.regexp == t.regexp
    );
  }
  create() {
    return this.regexp ? new Na(this) : new Ba(this);
  }
  getCursor(t, e = 0, i = t.length) {
    return this.regexp ? Pa(this, t, e, i) : La(this, t, e, i);
  }
}
class Ea {
  constructor(t) {
    this.spec = t;
  }
}
function La(t, e, i, n) {
  return new ca(
    e,
    t.unquoted,
    i,
    n,
    t.caseSensitive ? void 0 : (t) => t.toLowerCase()
  );
}
class Ba extends Ea {
  constructor(t) {
    super(t);
  }
  nextMatch(t, e, i) {
    let n = La(this.spec, t, i, t.length).nextOverlapping();
    return (
      n.done && (n = La(this.spec, t, 0, e).nextOverlapping()),
      n.done ? null : n.value
    );
  }
  prevMatchInRange(t, e, i) {
    for (let n = i; ; ) {
      let i = Math.max(e, n - 1e4 - this.spec.unquoted.length),
        s = La(this.spec, t, i, n),
        r = null;
      for (; !s.nextOverlapping().done; ) r = s.value;
      if (r) return r;
      if (i == e) return null;
      n -= 1e4;
    }
  }
  prevMatch(t, e, i) {
    return (
      this.prevMatchInRange(t, 0, e) || this.prevMatchInRange(t, i, t.length)
    );
  }
  getReplacement(t) {
    return this.spec.replace;
  }
  matchAll(t, e) {
    let i = La(this.spec, t, 0, t.length),
      n = [];
    for (; !i.next().done; ) {
      if (n.length >= e) return null;
      n.push(i.value);
    }
    return n;
  }
  highlight(t, e, i, n) {
    let s = La(
      this.spec,
      t,
      Math.max(0, e - this.spec.unquoted.length),
      Math.min(i + this.spec.unquoted.length, t.length)
    );
    for (; !s.next().done; ) n(s.value.from, s.value.to);
  }
}
function Pa(t, e, i, n) {
  return new da(
    e,
    t.search,
    t.caseSensitive ? void 0 : { ignoreCase: !0 },
    i,
    n
  );
}
class Na extends Ea {
  nextMatch(t, e, i) {
    let n = Pa(this.spec, t, i, t.length).next();
    return (
      n.done && (n = Pa(this.spec, t, 0, e).next()), n.done ? null : n.value
    );
  }
  prevMatchInRange(t, e, i) {
    for (let n = 1; ; n++) {
      let s = Math.max(e, i - 1e4 * n),
        r = Pa(this.spec, t, s, i),
        o = null;
      for (; !r.next().done; ) o = r.value;
      if (o && (s == e || o.from > s + 10)) return o;
      if (s == e) return null;
    }
  }
  prevMatch(t, e, i) {
    return (
      this.prevMatchInRange(t, 0, e) || this.prevMatchInRange(t, i, t.length)
    );
  }
  getReplacement(t) {
    return this.spec.replace.replace(/\$([$&\d+])/g, (e, i) =>
      "$" == i
        ? "$"
        : "&" == i
        ? t.match[0]
        : "0" != i && +i < t.match.length
        ? t.match[i]
        : e
    );
  }
  matchAll(t, e) {
    let i = Pa(this.spec, t, 0, t.length),
      n = [];
    for (; !i.next().done; ) {
      if (n.length >= e) return null;
      n.push(i.value);
    }
    return n;
  }
  highlight(t, e, i, n) {
    let s = Pa(this.spec, t, Math.max(0, e - 250), Math.min(i + 250, t.length));
    for (; !s.next().done; ) n(s.value.from, s.value.to);
  }
}
const Ia = dt.define(),
  Va = dt.define(),
  Ha = _.define({
    create: (t) => new Wa(Ya(t).create(), null),
    update(t, e) {
      for (let i of e.effects)
        i.is(Ia)
          ? (t = new Wa(i.value.create(), t.panel))
          : i.is(Va) && (t = new Wa(t.query, i.value ? Ja : null));
      return t;
    },
    provide: (t) => oa.from(t, (t) => t.panel),
  });
class Wa {
  constructor(t, e) {
    (this.query = t), (this.panel = e);
  }
}
const za = ii.mark({ class: "cm-searchMatch" }),
  Fa = ii.mark({ class: "cm-searchMatch cm-searchMatch-selected" }),
  qa = Ri.fromClass(
    class {
      constructor(t) {
        (this.view = t), (this.decorations = this.highlight(t.state.field(Ha)));
      }
      update(t) {
        let e = t.state.field(Ha);
        (e != t.startState.field(Ha) ||
          t.docChanged ||
          t.selectionSet ||
          t.viewportChanged) &&
          (this.decorations = this.highlight(e));
      }
      highlight({ query: t, panel: e }) {
        if (!e || !t.spec.valid) return ii.none;
        let { view: i } = this,
          n = new Ht();
        for (let e = 0, s = i.visibleRanges, r = s.length; e < r; e++) {
          let { from: o, to: l } = s[e];
          for (; e < r - 1 && l > s[e + 1].from - 500; ) l = s[++e].to;
          t.highlight(i.state.doc, o, l, (t, e) => {
            let s = i.state.selection.ranges.some(
              (i) => i.from == t && i.to == e
            );
            n.add(t, e, s ? Fa : za);
          });
        }
        return n.finish();
      }
    },
    { decorations: (t) => t.decorations }
  );
function _a(t) {
  return (e) => {
    let i = e.state.field(Ha, !1);
    return i && i.query.spec.valid ? t(e, i) : Xa(e);
  };
}
const ja = _a((t, { query: e }) => {
    let { from: i, to: n } = t.state.selection.main,
      s = e.nextMatch(t.state.doc, i, n);
    return (
      !(!s || (s.from == i && s.to == n)) &&
      (t.dispatch({
        selection: { anchor: s.from, head: s.to },
        scrollIntoView: !0,
        effects: nc(t, s),
        userEvent: "select.search",
      }),
      !0)
    );
  }),
  Ua = _a((t, { query: e }) => {
    let { state: i } = t,
      { from: n, to: s } = i.selection.main,
      r = e.prevMatch(i.doc, n, s);
    return (
      !!r &&
      (t.dispatch({
        selection: { anchor: r.from, head: r.to },
        scrollIntoView: !0,
        effects: nc(t, r),
        userEvent: "select.search",
      }),
      !0)
    );
  }),
  $a = _a((t, { query: e }) => {
    let i = e.matchAll(t.state.doc, 1e3);
    return (
      !(!i || !i.length) &&
      (t.dispatch({
        selection: B.create(i.map((t) => B.range(t.from, t.to))),
        userEvent: "select.search.matches",
      }),
      !0)
    );
  }),
  Ka = _a((t, { query: e }) => {
    let { state: i } = t,
      { from: n, to: s } = i.selection.main;
    if (i.readOnly) return !1;
    let r = e.nextMatch(i.doc, n, n);
    if (!r) return !1;
    let o,
      l,
      h = [];
    if (
      (r.from == n &&
        r.to == s &&
        ((l = i.toText(e.getReplacement(r))),
        h.push({ from: r.from, to: r.to, insert: l }),
        (r = e.nextMatch(i.doc, r.from, r.to))),
      r)
    ) {
      let t = 0 == h.length || h[0].from >= r.to ? 0 : r.to - r.from - l.length;
      o = { anchor: r.from - t, head: r.to - t };
    }
    return (
      t.dispatch({
        changes: h,
        selection: o,
        scrollIntoView: !!o,
        effects: r ? nc(t, r) : void 0,
        userEvent: "input.replace",
      }),
      !0
    );
  }),
  Ga = _a((t, { query: e }) => {
    if (t.state.readOnly) return !1;
    let i = e.matchAll(t.state.doc, 1e9).map((t) => {
      let { from: i, to: n } = t;
      return { from: i, to: n, insert: e.getReplacement(t) };
    });
    return (
      !!i.length &&
      (t.dispatch({ changes: i, userEvent: "input.replace.all" }), !0)
    );
  });
function Ja(t) {
  return t.state.facet(Ta).createPanel(t);
}
function Ya(t, e) {
  var i;
  let n = t.selection.main,
    s = n.empty || n.to > n.from + 100 ? "" : t.sliceDoc(n.from, n.to),
    r =
      null !== (i = null == e ? void 0 : e.caseSensitive) && void 0 !== i
        ? i
        : t.facet(Ta).caseSensitive;
  return e && !s
    ? e
    : new Ra({ search: s.replace(/\n/g, "\\n"), caseSensitive: r });
}
const Xa = (t) => {
    let e = t.state.field(Ha, !1);
    if (e && e.panel) {
      let i = ea(t, Ja);
      if (!i) return !1;
      let n = i.dom.querySelector("[name=search]");
      if (n != t.root.activeElement) {
        let i = Ya(t.state, e.query.spec);
        i.valid && t.dispatch({ effects: Ia.of(i) }), n.focus(), n.select();
      }
    } else
      t.dispatch({
        effects: [
          Va.of(!0),
          e ? Ia.of(Ya(t.state, e.query.spec)) : dt.appendConfig.of(rc),
        ],
      });
    return !0;
  },
  Qa = (t) => {
    let e = t.state.field(Ha, !1);
    if (!e || !e.panel) return !1;
    let i = ea(t, Ja);
    return (
      i && i.dom.contains(t.root.activeElement) && t.focus(),
      t.dispatch({ effects: Va.of(!1) }),
      !0
    );
  },
  Za = [
    { key: "Mod-f", run: Xa, scope: "editor search-panel" },
    {
      key: "F3",
      run: ja,
      shift: Ua,
      scope: "editor search-panel",
      preventDefault: !0,
    },
    {
      key: "Mod-g",
      run: ja,
      shift: Ua,
      scope: "editor search-panel",
      preventDefault: !0,
    },
    { key: "Escape", run: Qa, scope: "editor search-panel" },
    {
      key: "Mod-Shift-l",
      run: ({ state: t, dispatch: e }) => {
        let i = t.selection;
        if (i.ranges.length > 1 || i.main.empty) return !1;
        let { from: n, to: s } = i.main,
          r = [],
          o = 0;
        for (let e = new ca(t.doc, t.sliceDoc(n, s)); !e.next().done; ) {
          if (r.length > 1e3) return !1;
          e.value.from == n && (o = r.length),
            r.push(B.range(e.value.from, e.value.to));
        }
        return (
          e(
            t.update({
              selection: B.create(r, o),
              userEvent: "select.search.matches",
            })
          ),
          !0
        );
      },
    },
    {
      key: "Alt-g",
      run: (t) => {
        let e = ea(t, va);
        if (!e) {
          let i = [wa.of(!0)];
          null == t.state.field(ya, !1) && i.push(dt.appendConfig.of([ya, ba])),
            t.dispatch({ effects: i }),
            (e = ea(t, va));
        }
        return e && e.dom.querySelector("input").focus(), !0;
      },
    },
    {
      key: "Mod-d",
      run: ({ state: t, dispatch: e }) => {
        let { ranges: i } = t.selection;
        if (i.some((t) => t.from === t.to))
          return (({ state: t, dispatch: e }) => {
            let { selection: i } = t,
              n = B.create(
                i.ranges.map((e) => t.wordAt(e.head) || B.cursor(e.head)),
                i.mainIndex
              );
            return !n.eq(i) && (e(t.update({ selection: n })), !0);
          })({ state: t, dispatch: e });
        let n = t.sliceDoc(i[0].from, i[0].to);
        if (t.selection.ranges.some((e) => t.sliceDoc(e.from, e.to) != n))
          return !1;
        let s = (function (t, e) {
          let { main: i, ranges: n } = t.selection,
            s = t.wordAt(i.head),
            r = s && s.from == i.from && s.to == i.to;
          for (let i = !1, s = new ca(t.doc, e, n[n.length - 1].to); ; ) {
            if ((s.next(), !s.done)) {
              if (i && n.some((t) => t.from == s.value.from)) continue;
              if (r) {
                let e = t.wordAt(s.value.from);
                if (!e || e.from != s.value.from || e.to != s.value.to)
                  continue;
              }
              return s.value;
            }
            if (i) return null;
            (s = new ca(t.doc, e, 0, Math.max(0, n[n.length - 1].from - 1))),
              (i = !0);
          }
        })(t, n);
        return (
          !!s &&
          (e(
            t.update({
              selection: t.selection.addRange(B.range(s.from, s.to), !1),
              effects: Os.scrollIntoView(s.to),
            })
          ),
          !0)
        );
      },
      preventDefault: !0,
    },
  ];
class tc {
  constructor(t) {
    this.view = t;
    let e = (this.query = t.state.field(Ha).query.spec);
    function i(t, e, i) {
      return la(
        "button",
        { class: "cm-button", name: t, onclick: e, type: "button" },
        i
      );
    }
    (this.commit = this.commit.bind(this)),
      (this.searchField = la("input", {
        value: e.search,
        placeholder: ec(t, "Find"),
        "aria-label": ec(t, "Find"),
        class: "cm-textfield",
        name: "search",
        onchange: this.commit,
        onkeyup: this.commit,
      })),
      (this.replaceField = la("input", {
        value: e.replace,
        placeholder: ec(t, "Replace"),
        "aria-label": ec(t, "Replace"),
        class: "cm-textfield",
        name: "replace",
        onchange: this.commit,
        onkeyup: this.commit,
      })),
      (this.caseField = la("input", {
        type: "checkbox",
        name: "case",
        checked: e.caseSensitive,
        onchange: this.commit,
      })),
      (this.reField = la("input", {
        type: "checkbox",
        name: "re",
        checked: e.regexp,
        onchange: this.commit,
      })),
      (this.dom = la(
        "div",
        { onkeydown: (t) => this.keydown(t), class: "cm-search" },
        [
          this.searchField,
          i("next", () => ja(t), [ec(t, "next")]),
          i("prev", () => Ua(t), [ec(t, "previous")]),
          i("select", () => $a(t), [ec(t, "all")]),
          la("label", null, [this.caseField, ec(t, "match case")]),
          la("label", null, [this.reField, ec(t, "regexp")]),
          ...(t.state.readOnly
            ? []
            : [
                la("br"),
                this.replaceField,
                i("replace", () => Ka(t), [ec(t, "replace")]),
                i("replaceAll", () => Ga(t), [ec(t, "replace all")]),
                la(
                  "button",
                  {
                    name: "close",
                    onclick: () => Qa(t),
                    "aria-label": ec(t, "close"),
                    type: "button",
                  },
                  ["×"]
                ),
              ]),
        ]
      ));
  }
  commit() {
    let t = new Ra({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      replace: this.replaceField.value,
    });
    t.eq(this.query) ||
      ((this.query = t), this.view.dispatch({ effects: Ia.of(t) }));
  }
  keydown(t) {
    var e, i, n;
    (e = this.view),
      (i = t),
      (n = "search-panel"),
      Fs(Ws(e.state), i, e, n)
        ? t.preventDefault()
        : 13 == t.keyCode && t.target == this.searchField
        ? (t.preventDefault(), (t.shiftKey ? Ua : ja)(this.view))
        : 13 == t.keyCode &&
          t.target == this.replaceField &&
          (t.preventDefault(), Ka(this.view));
  }
  update(t) {
    for (let e of t.transactions)
      for (let t of e.effects)
        t.is(Ia) && !t.value.eq(this.query) && this.setQuery(t.value);
  }
  setQuery(t) {
    (this.query = t),
      (this.searchField.value = t.search),
      (this.replaceField.value = t.replace),
      (this.caseField.checked = t.caseSensitive),
      (this.reField.checked = t.regexp);
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(Ta).top;
  }
}
function ec(t, e) {
  return t.state.phrase(e);
}
const ic = /[\s\.,:;?!]/;
function nc(t, { from: e, to: i }) {
  let n = t.state.doc.lineAt(e).from,
    s = t.state.doc.lineAt(i).to,
    r = Math.max(n, e - 30),
    o = Math.min(s, i + 30),
    l = t.state.sliceDoc(r, o);
  if (r != n)
    for (let t = 0; t < 30; t++)
      if (!ic.test(l[t + 1]) && ic.test(l[t])) {
        l = l.slice(t);
        break;
      }
  if (o != s)
    for (let t = l.length - 1; t > l.length - 30; t--)
      if (!ic.test(l[t - 1]) && ic.test(l[t])) {
        l = l.slice(0, t);
        break;
      }
  return Os.announce.of(
    `${t.state.phrase("current match")}. ${l} ${t.state.phrase("on line")} ${
      t.state.doc.lineAt(e).number
    }`
  );
}
const sc = Os.baseTheme({
    ".cm-panel.cm-search": {
      padding: "2px 6px 4px",
      position: "relative",
      "& [name=close]": {
        position: "absolute",
        top: "0",
        right: "4px",
        backgroundColor: "inherit",
        border: "none",
        font: "inherit",
        padding: 0,
        margin: 0,
      },
      "& input, & button, & label": { margin: ".2em .6em .2em 0" },
      "& input[type=checkbox]": { marginRight: ".2em" },
      "& label": { fontSize: "80%", whiteSpace: "pre" },
    },
    "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
    "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
    "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
    "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" },
  }),
  rc = [Ha, Y.lowest(qa), sc],
  oc =
    "undefined" != typeof navigator &&
    !/Edge\/(\d+)/.exec(navigator.userAgent) &&
    /Apple Computer/.test(navigator.vendor) &&
    (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
class lc {
  constructor(t, e, i) {
    (this.facet = e),
      (this.createTooltipView = i),
      (this.input = t.state.facet(e)),
      (this.tooltips = this.input.filter((t) => t)),
      (this.tooltipViews = this.tooltips.map(i));
  }
  update(t) {
    let e = t.state.facet(this.facet),
      i = e.filter((t) => t);
    if (e === this.input) {
      for (let e of this.tooltipViews) e.update && e.update(t);
      return !1;
    }
    let n = [];
    for (let e = 0; e < i.length; e++) {
      let s = i[e],
        r = -1;
      if (s) {
        for (let t = 0; t < this.tooltips.length; t++) {
          let e = this.tooltips[t];
          e && e.create == s.create && (r = t);
        }
        if (r < 0) n[e] = this.createTooltipView(s);
        else {
          let i = (n[e] = this.tooltipViews[r]);
          i.update && i.update(t);
        }
      }
    }
    for (let t of this.tooltipViews) n.indexOf(t) < 0 && t.dom.remove();
    return (this.input = e), (this.tooltips = i), (this.tooltipViews = n), !0;
  }
}
function hc() {
  return { top: 0, left: 0, bottom: innerHeight, right: innerWidth };
}
const ac = V.define({
    combine: (t) => {
      var e, i, n;
      return {
        position: oc
          ? "absolute"
          : (null === (e = t.find((t) => t.position)) || void 0 === e
              ? void 0
              : e.position) || "fixed",
        parent:
          (null === (i = t.find((t) => t.parent)) || void 0 === i
            ? void 0
            : i.parent) || null,
        tooltipSpace:
          (null === (n = t.find((t) => t.tooltipSpace)) || void 0 === n
            ? void 0
            : n.tooltipSpace) || hc,
      };
    },
  }),
  cc = Ri.fromClass(
    class {
      constructor(t) {
        var e;
        (this.view = t),
          (this.inView = !0),
          (this.lastTransaction = 0),
          (this.measureTimeout = -1);
        let i = t.state.facet(ac);
        (this.position = i.position),
          (this.parent = i.parent),
          (this.classes = t.themeClasses),
          this.createContainer(),
          (this.measureReq = {
            read: this.readMeasure.bind(this),
            write: this.writeMeasure.bind(this),
            key: this,
          }),
          (this.manager = new lc(t, dc, (t) => this.createTooltip(t))),
          (this.intersectionObserver =
            "function" == typeof IntersectionObserver
              ? new IntersectionObserver(
                  (t) => {
                    Date.now() > this.lastTransaction - 50 &&
                      t.length > 0 &&
                      t[t.length - 1].intersectionRatio < 1 &&
                      this.measureSoon();
                  },
                  { threshold: [1] }
                )
              : null),
          this.observeIntersection(),
          null === (e = t.dom.ownerDocument.defaultView) ||
            void 0 === e ||
            e.addEventListener(
              "resize",
              (this.measureSoon = this.measureSoon.bind(this))
            ),
          this.maybeMeasure();
      }
      createContainer() {
        this.parent
          ? ((this.container = document.createElement("div")),
            (this.container.style.position = "relative"),
            (this.container.className = this.view.themeClasses),
            this.parent.appendChild(this.container))
          : (this.container = this.view.dom);
      }
      observeIntersection() {
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
          for (let t of this.manager.tooltipViews)
            this.intersectionObserver.observe(t.dom);
        }
      }
      measureSoon() {
        this.measureTimeout < 0 &&
          (this.measureTimeout = setTimeout(() => {
            (this.measureTimeout = -1), this.maybeMeasure();
          }, 50));
      }
      update(t) {
        t.transactions.length && (this.lastTransaction = Date.now());
        let e = this.manager.update(t);
        e && this.observeIntersection();
        let i = e || t.geometryChanged,
          n = t.state.facet(ac);
        if (n.position != this.position) {
          this.position = n.position;
          for (let t of this.manager.tooltipViews)
            t.dom.style.position = this.position;
          i = !0;
        }
        if (n.parent != this.parent) {
          this.parent && this.container.remove(),
            (this.parent = n.parent),
            this.createContainer();
          for (let t of this.manager.tooltipViews)
            this.container.appendChild(t.dom);
          i = !0;
        } else
          this.parent &&
            this.view.themeClasses != this.classes &&
            (this.classes = this.container.className = this.view.themeClasses);
        i && this.maybeMeasure();
      }
      createTooltip(t) {
        let e = t.create(this.view);
        if (
          (e.dom.classList.add("cm-tooltip"),
          t.arrow && !e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow"))
        ) {
          let t = document.createElement("div");
          (t.className = "cm-tooltip-arrow"), e.dom.appendChild(t);
        }
        return (
          (e.dom.style.position = this.position),
          (e.dom.style.top = "-10000px"),
          this.container.appendChild(e.dom),
          e.mount && e.mount(this.view),
          e
        );
      }
      destroy() {
        var t, e;
        null === (t = this.view.dom.ownerDocument.defaultView) ||
          void 0 === t ||
          t.removeEventListener("resize", this.measureSoon);
        for (let { dom: t } of this.manager.tooltipViews) t.remove();
        null === (e = this.intersectionObserver) ||
          void 0 === e ||
          e.disconnect(),
          clearTimeout(this.measureTimeout);
      }
      readMeasure() {
        let t = this.view.dom.getBoundingClientRect();
        return {
          editor: t,
          parent: this.parent ? this.container.getBoundingClientRect() : t,
          pos: this.manager.tooltips.map((t, e) => {
            let i = this.manager.tooltipViews[e];
            return i.getCoords
              ? i.getCoords(t.pos)
              : this.view.coordsAtPos(t.pos);
          }),
          size: this.manager.tooltipViews.map(({ dom: t }) =>
            t.getBoundingClientRect()
          ),
          space: this.view.state.facet(ac).tooltipSpace(this.view),
        };
      }
      writeMeasure(t) {
        let { editor: e, space: i } = t,
          n = [];
        for (let s = 0; s < this.manager.tooltips.length; s++) {
          let r = this.manager.tooltips[s],
            o = this.manager.tooltipViews[s],
            { dom: l } = o,
            h = t.pos[s],
            a = t.size[s];
          if (
            !h ||
            h.bottom <= Math.max(e.top, i.top) ||
            h.top >= Math.min(e.bottom, i.bottom) ||
            h.right < Math.max(e.left, i.left) - 0.1 ||
            h.left > Math.min(e.right, i.right) + 0.1
          ) {
            l.style.top = "-10000px";
            continue;
          }
          let c = r.arrow ? o.dom.querySelector(".cm-tooltip-arrow") : null,
            u = c ? 7 : 0,
            f = a.right - a.left,
            d = a.bottom - a.top,
            p = o.offset || fc,
            m = this.view.textDirection == Wi.LTR,
            g =
              a.width > i.right - i.left
                ? m
                  ? i.left
                  : i.right - a.width
                : m
                ? Math.min(h.left - (c ? 14 : 0) + p.x, i.right - f)
                : Math.max(i.left, h.left - f + (c ? 14 : 0) - p.x),
            v = !!r.above;
          !r.strictSide &&
            (v
              ? h.top - (a.bottom - a.top) - p.y < i.top
              : h.bottom + (a.bottom - a.top) + p.y > i.bottom) &&
            v == i.bottom - h.bottom > h.top - i.top &&
            (v = !v);
          let w = v ? h.top - d - u - p.y : h.bottom + u + p.y,
            y = g + f;
          if (!0 !== o.overlap)
            for (let t of n)
              t.left < y &&
                t.right > g &&
                t.top < w + d &&
                t.bottom > w &&
                (w = v ? t.top - d - 2 - u : t.bottom + u + 2);
          "absolute" == this.position
            ? ((l.style.top = w - t.parent.top + "px"),
              (l.style.left = g - t.parent.left + "px"))
            : ((l.style.top = w + "px"), (l.style.left = g + "px")),
            c &&
              (c.style.left = h.left + (m ? p.x : -p.x) - (g + 14 - 7) + "px"),
            !0 !== o.overlap &&
              n.push({ left: g, top: w, right: y, bottom: w + d }),
            l.classList.toggle("cm-tooltip-above", v),
            l.classList.toggle("cm-tooltip-below", !v),
            o.positioned && o.positioned();
        }
      }
      maybeMeasure() {
        if (
          this.manager.tooltips.length &&
          (this.view.inView && this.view.requestMeasure(this.measureReq),
          this.inView != this.view.inView &&
            ((this.inView = this.view.inView), !this.inView))
        )
          for (let t of this.manager.tooltipViews) t.dom.style.top = "-10000px";
      }
    },
    {
      eventHandlers: {
        scroll() {
          this.maybeMeasure();
        },
      },
    }
  ),
  uc = Os.baseTheme({
    ".cm-tooltip": { zIndex: 100 },
    "&light .cm-tooltip": {
      border: "1px solid #bbb",
      backgroundColor: "#f5f5f5",
    },
    "&light .cm-tooltip-section:not(:first-child)": {
      borderTop: "1px solid #bbb",
    },
    "&dark .cm-tooltip": { backgroundColor: "#333338", color: "white" },
    ".cm-tooltip-arrow": {
      height: "7px",
      width: "14px",
      position: "absolute",
      zIndex: -1,
      overflow: "hidden",
      "&:before, &:after": {
        content: "''",
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: "7px solid transparent",
        borderRight: "7px solid transparent",
      },
      ".cm-tooltip-above &": {
        bottom: "-7px",
        "&:before": { borderTop: "7px solid #bbb" },
        "&:after": { borderTop: "7px solid #f5f5f5", bottom: "1px" },
      },
      ".cm-tooltip-below &": {
        top: "-7px",
        "&:before": { borderBottom: "7px solid #bbb" },
        "&:after": { borderBottom: "7px solid #f5f5f5", top: "1px" },
      },
    },
    "&dark .cm-tooltip .cm-tooltip-arrow": {
      "&:before": { borderTopColor: "#333338", borderBottomColor: "#333338" },
      "&:after": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      },
    },
  }),
  fc = { x: 0, y: 0 },
  dc = V.define({ enables: [cc, uc] });
class pc {
  constructor(t, e, i) {
    (this.state = t),
      (this.pos = e),
      (this.explicit = i),
      (this.abortListeners = []);
  }
  tokenBefore(t) {
    let e = Br(this.state).resolveInner(this.pos, -1);
    for (; e && t.indexOf(e.name) < 0; ) e = e.parent;
    return e
      ? {
          from: e.from,
          to: this.pos,
          text: this.state.sliceDoc(e.from, this.pos),
          type: e.type,
        }
      : null;
  }
  matchBefore(t) {
    let e = this.state.doc.lineAt(this.pos),
      i = Math.max(e.from, this.pos - 250),
      n = e.text.slice(i - e.from, this.pos - e.from),
      s = n.search(yc(t, !1));
    return s < 0 ? null : { from: i + s, to: this.pos, text: n.slice(s) };
  }
  get aborted() {
    return null == this.abortListeners;
  }
  addEventListener(t, e) {
    "abort" == t && this.abortListeners && this.abortListeners.push(e);
  }
}
function mc(t) {
  let e = Object.keys(t).join(""),
    i = /\w/.test(e);
  return (
    i && (e = e.replace(/\w/g, "")),
    `[${i ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`
  );
}
function gc(t) {
  let e = t.map((t) => ("string" == typeof t ? { label: t } : t)),
    [i, n] = e.every((t) => /^\w+$/.test(t.label))
      ? [/\w*$/, /\w+$/]
      : (function (t) {
          let e = Object.create(null),
            i = Object.create(null);
          for (let { label: n } of t) {
            e[n[0]] = !0;
            for (let t = 1; t < n.length; t++) i[n[t]] = !0;
          }
          let n = mc(e) + mc(i) + "*$";
          return [new RegExp("^" + n), new RegExp(n)];
        })(e);
  return (t) => {
    let s = t.matchBefore(n);
    return s || t.explicit
      ? { from: s ? s.from : t.pos, options: e, span: i }
      : null;
  };
}
class vc {
  constructor(t, e, i) {
    (this.completion = t), (this.source = e), (this.match = i);
  }
}
function wc(t) {
  return t.selection.main.head;
}
function yc(t, e) {
  var i;
  let { source: n } = t,
    s = e && "^" != n[0],
    r = "$" != n[n.length - 1];
  return s || r
    ? new RegExp(
        `${s ? "^" : ""}(?:${n})${r ? "$" : ""}`,
        null !== (i = t.flags) && void 0 !== i ? i : t.ignoreCase ? "i" : ""
      )
    : t;
}
const bc = ct.define();
function xc(t, e) {
  let i = e.completion.apply || e.completion.label,
    n = e.source;
  "string" == typeof i
    ? t.dispatch({
        changes: { from: n.from, to: n.to, insert: i },
        selection: { anchor: n.from + i.length },
        userEvent: "input.complete",
        annotations: bc.of(e.completion),
      })
    : i(t, e.completion, n.from, n.to);
}
const kc = new WeakMap();
function Sc(t) {
  if (!Array.isArray(t)) return t;
  let e = kc.get(t);
  return e || kc.set(t, (e = gc(t))), e;
}
class Ac {
  constructor(t) {
    (this.pattern = t),
      (this.chars = []),
      (this.folded = []),
      (this.any = []),
      (this.precise = []),
      (this.byWord = []);
    for (let e = 0; e < t.length; ) {
      let i = h(t, e),
        n = c(i);
      this.chars.push(i);
      let s = t.slice(e, e + n),
        r = s.toUpperCase();
      this.folded.push(h(r == s ? s.toLowerCase() : r, 0)), (e += n);
    }
    this.astral = t.length != this.chars.length;
  }
  match(t) {
    if (0 == this.pattern.length) return [0];
    if (t.length < this.pattern.length) return null;
    let { chars: e, folded: i, any: n, precise: s, byWord: r } = this;
    if (1 == e.length) {
      let n = h(t, 0);
      return n == e[0] ? [0, 0, c(n)] : n == i[0] ? [-200, 0, c(n)] : null;
    }
    let o = t.indexOf(this.pattern);
    if (0 == o) return [0, 0, this.pattern.length];
    let l = e.length,
      u = 0;
    if (o < 0) {
      for (let s = 0, r = Math.min(t.length, 200); s < r && u < l; ) {
        let r = h(t, s);
        (r != e[u] && r != i[u]) || (n[u++] = s), (s += c(r));
      }
      if (u < l) return null;
    }
    let f = 0,
      d = 0,
      p = !1,
      m = 0,
      g = -1,
      v = -1,
      w = /[a-z]/.test(t),
      y = !0;
    for (let n = 0, u = Math.min(t.length, 200), b = 0; n < u && d < l; ) {
      let u = h(t, n);
      o < 0 &&
        (f < l && u == e[f] && (s[f++] = n),
        m < l &&
          (u == e[m] || u == i[m]
            ? (0 == m && (g = n), (v = n + 1), m++)
            : (m = 0)));
      let x,
        k =
          u < 255
            ? (u >= 48 && u <= 57) || (u >= 97 && u <= 122)
              ? 2
              : u >= 65 && u <= 90
              ? 1
              : 0
            : (x = a(u)) != x.toLowerCase()
            ? 1
            : x != x.toUpperCase()
            ? 2
            : 0;
      (!n || (1 == k && w) || (0 == b && 0 != k)) &&
        (e[d] == u || (i[d] == u && (p = !0))
          ? (r[d++] = n)
          : r.length && (y = !1)),
        (b = k),
        (n += c(u));
    }
    return d == l && 0 == r[0] && y
      ? this.result((p ? -200 : 0) - 100, r, t)
      : m == l && 0 == g
      ? [-200 - t.length, 0, v]
      : o > -1
      ? [-700 - t.length, o, o + this.pattern.length]
      : m == l
      ? [-900 - t.length, g, v]
      : d == l
      ? this.result((p ? -200 : 0) - 100 - 700 + (y ? 0 : -1100), r, t)
      : 2 == e.length
      ? null
      : this.result((n[0] ? -700 : 0) - 200 - 1100, n, t);
  }
  result(t, e, i) {
    let n = [t - i.length],
      s = 1;
    for (let t of e) {
      let e = t + (this.astral ? c(h(i, t)) : 1);
      s > 1 && n[s - 1] == t ? (n[s - 1] = e) : ((n[s++] = t), (n[s++] = e));
    }
    return n;
  }
}
const Cc = V.define({
  combine: (t) =>
    Mt(
      t,
      {
        activateOnTyping: !0,
        override: null,
        maxRenderedOptions: 100,
        defaultKeymap: !0,
        optionClass: () => "",
        aboveCursor: !1,
        icons: !0,
        addToOptions: [],
      },
      {
        defaultKeymap: (t, e) => t && e,
        icons: (t, e) => t && e,
        optionClass: (t, e) => (i) =>
          (function (t, e) {
            return t ? (e ? t + " " + e : t) : e;
          })(t(i), e(i)),
        addToOptions: (t, e) => t.concat(e),
      }
    ),
});
function Mc(t, e, i) {
  if (t <= i) return { from: 0, to: t };
  if (e <= t >> 1) {
    let t = Math.floor(e / i);
    return { from: t * i, to: (t + 1) * i };
  }
  let n = Math.floor((t - e) / i);
  return { from: t - (n + 1) * i, to: t - n * i };
}
class Dc {
  constructor(t, e) {
    (this.view = t),
      (this.stateField = e),
      (this.info = null),
      (this.placeInfo = {
        read: () => this.measureInfo(),
        write: (t) => this.positionInfo(t),
        key: this,
      });
    let i = t.state.field(e),
      { options: n, selected: s } = i.open,
      r = t.state.facet(Cc);
    (this.optionContent = (function (t) {
      let e = t.addToOptions.slice();
      return (
        t.icons &&
          e.push({
            render(t) {
              let e = document.createElement("div");
              return (
                e.classList.add("cm-completionIcon"),
                t.type &&
                  e.classList.add(
                    ...t.type.split(/\s+/g).map((t) => "cm-completionIcon-" + t)
                  ),
                e.setAttribute("aria-hidden", "true"),
                e
              );
            },
            position: 20,
          }),
        e.push(
          {
            render(t, e, i) {
              let n = document.createElement("span");
              n.className = "cm-completionLabel";
              let { label: s } = t,
                r = 0;
              for (let t = 1; t < i.length; ) {
                let e = i[t++],
                  o = i[t++];
                e > r && n.appendChild(document.createTextNode(s.slice(r, e)));
                let l = n.appendChild(document.createElement("span"));
                l.appendChild(document.createTextNode(s.slice(e, o))),
                  (l.className = "cm-completionMatchedText"),
                  (r = o);
              }
              return (
                r < s.length &&
                  n.appendChild(document.createTextNode(s.slice(r))),
                n
              );
            },
            position: 50,
          },
          {
            render(t) {
              if (!t.detail) return null;
              let e = document.createElement("span");
              return (
                (e.className = "cm-completionDetail"),
                (e.textContent = t.detail),
                e
              );
            },
            position: 80,
          }
        ),
        e.sort((t, e) => t.position - e.position).map((t) => t.render)
      );
    })(r)),
      (this.optionClass = r.optionClass),
      (this.range = Mc(n.length, s, r.maxRenderedOptions)),
      (this.dom = document.createElement("div")),
      (this.dom.className = "cm-tooltip-autocomplete"),
      this.dom.addEventListener("mousedown", (e) => {
        for (let i, s = e.target; s && s != this.dom; s = s.parentNode)
          if (
            "LI" == s.nodeName &&
            (i = /-(\d+)$/.exec(s.id)) &&
            +i[1] < n.length
          )
            return xc(t, n[+i[1]]), void e.preventDefault();
      }),
      (this.list = this.dom.appendChild(
        this.createListBox(n, i.id, this.range)
      )),
      this.list.addEventListener("scroll", () => {
        this.info && this.view.requestMeasure(this.placeInfo);
      });
  }
  mount() {
    this.updateSel();
  }
  update(t) {
    t.state.field(this.stateField) != t.startState.field(this.stateField) &&
      this.updateSel();
  }
  positioned() {
    this.info && this.view.requestMeasure(this.placeInfo);
  }
  updateSel() {
    let t = this.view.state.field(this.stateField),
      e = t.open;
    if (
      ((e.selected < this.range.from || e.selected >= this.range.to) &&
        ((this.range = Mc(
          e.options.length,
          e.selected,
          this.view.state.facet(Cc).maxRenderedOptions
        )),
        this.list.remove(),
        (this.list = this.dom.appendChild(
          this.createListBox(e.options, t.id, this.range)
        )),
        this.list.addEventListener("scroll", () => {
          this.info && this.view.requestMeasure(this.placeInfo);
        })),
      this.updateSelectedOption(e.selected))
    ) {
      this.info && (this.info.remove(), (this.info = null));
      let { completion: i } = e.options[e.selected],
        { info: n } = i;
      if (!n) return;
      let s = "string" == typeof n ? document.createTextNode(n) : n(i);
      if (!s) return;
      "then" in s
        ? s
            .then((e) => {
              e &&
                this.view.state.field(this.stateField, !1) == t &&
                this.addInfoPane(e);
            })
            .catch((t) => Ai(this.view.state, t, "completion info"))
        : this.addInfoPane(s);
    }
  }
  addInfoPane(t) {
    let e = (this.info = document.createElement("div"));
    (e.className = "cm-tooltip cm-completionInfo"),
      e.appendChild(t),
      this.dom.appendChild(e),
      this.view.requestMeasure(this.placeInfo);
  }
  updateSelectedOption(t) {
    let e = null;
    for (
      let i = this.list.firstChild, n = this.range.from;
      i;
      i = i.nextSibling, n++
    )
      n == t
        ? i.hasAttribute("aria-selected") ||
          (i.setAttribute("aria-selected", "true"), (e = i))
        : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return (
      e &&
        (function (t, e) {
          let i = t.getBoundingClientRect(),
            n = e.getBoundingClientRect();
          n.top < i.top
            ? (t.scrollTop -= i.top - n.top)
            : n.bottom > i.bottom && (t.scrollTop += n.bottom - i.bottom);
        })(this.list, e),
      e
    );
  }
  measureInfo() {
    let t = this.dom.querySelector("[aria-selected]");
    if (!t || !this.info) return null;
    let e = this.dom.getBoundingClientRect(),
      i = this.info.getBoundingClientRect(),
      n = t.getBoundingClientRect();
    if (
      n.top > Math.min(innerHeight, e.bottom) - 10 ||
      n.bottom < Math.max(0, e.top) + 10
    )
      return null;
    let s = Math.max(0, Math.min(n.top, innerHeight - i.height)) - e.top,
      r = this.view.textDirection == Wi.RTL,
      o = e.left,
      l = innerWidth - e.right;
    return (
      r && o < Math.min(i.width, l)
        ? (r = !1)
        : !r && l < Math.min(i.width, o) && (r = !0),
      { top: s, left: r }
    );
  }
  positionInfo(t) {
    this.info &&
      ((this.info.style.top = (t ? t.top : -1e6) + "px"),
      t &&
        (this.info.classList.toggle("cm-completionInfo-left", t.left),
        this.info.classList.toggle("cm-completionInfo-right", !t.left)));
  }
  createListBox(t, e, i) {
    const n = document.createElement("ul");
    (n.id = e),
      n.setAttribute("role", "listbox"),
      n.setAttribute("aria-expanded", "true");
    for (let s = i.from; s < i.to; s++) {
      let { completion: i, match: r } = t[s];
      const o = n.appendChild(document.createElement("li"));
      (o.id = e + "-" + s), o.setAttribute("role", "option");
      let l = this.optionClass(i);
      l && (o.className = l);
      for (let t of this.optionContent) {
        let e = t(i, this.view.state, r);
        e && o.appendChild(e);
      }
    }
    return (
      i.from && n.classList.add("cm-completionListIncompleteTop"),
      i.to < t.length && n.classList.add("cm-completionListIncompleteBottom"),
      n
    );
  }
}
function Oc(t) {
  return (
    100 * (t.boost || 0) +
    (t.apply ? 10 : 0) +
    (t.info ? 5 : 0) +
    (t.type ? 1 : 0)
  );
}
class Tc {
  constructor(t, e, i, n, s) {
    (this.options = t),
      (this.attrs = e),
      (this.tooltip = i),
      (this.timestamp = n),
      (this.selected = s);
  }
  setSelected(t, e) {
    return t == this.selected || t >= this.options.length
      ? this
      : new Tc(this.options, Lc(e, t), this.tooltip, this.timestamp, t);
  }
  static build(t, e, i, n, s) {
    let r = (function (t, e) {
      let i = [],
        n = 0;
      for (let s of t)
        if (s.hasResult())
          if (!1 === s.result.filter)
            for (let t of s.result.options) i.push(new vc(t, s, [1e9 - n++]));
          else {
            let t,
              n = new Ac(e.sliceDoc(s.from, s.to));
            for (let e of s.result.options)
              (t = n.match(e.label)) &&
                (null != e.boost && (t[0] += e.boost), i.push(new vc(e, s, t)));
          }
      let s = [],
        r = null;
      for (let t of i.sort(Pc)) {
        if (300 == s.length) break;
        r &&
        r.label == t.completion.label &&
        r.detail == t.completion.detail &&
        r.type == t.completion.type &&
        r.apply == t.completion.apply
          ? Oc(t.completion) > Oc(r) && (s[s.length - 1] = t)
          : s.push(t),
          (r = t.completion);
      }
      return s;
    })(t, e);
    if (!r.length) return null;
    let o = 0;
    if (n && n.selected) {
      let t = n.options[n.selected].completion;
      for (let e = 0; e < r.length; e++)
        if (r[e].completion == t) {
          o = e;
          break;
        }
    }
    return new Tc(
      r,
      Lc(i, o),
      {
        pos: t.reduce((t, e) => (e.hasResult() ? Math.min(t, e.from) : t), 1e8),
        create: ((l = qc), (t) => new Dc(t, l)),
        above: s.aboveCursor,
      },
      n ? n.timestamp : Date.now(),
      o
    );
    var l;
  }
  map(t) {
    return new Tc(
      this.options,
      this.attrs,
      Object.assign(Object.assign({}, this.tooltip), {
        pos: t.mapPos(this.tooltip.pos),
      }),
      this.timestamp,
      this.selected
    );
  }
}
class Rc {
  constructor(t, e, i) {
    (this.active = t), (this.id = e), (this.open = i);
  }
  static start() {
    return new Rc(
      Bc,
      "cm-ac-" + Math.floor(2e6 * Math.random()).toString(36),
      null
    );
  }
  update(t) {
    let { state: e } = t,
      i = e.facet(Cc),
      n = (i.override || e.languageDataAt("autocomplete", wc(e)).map(Sc)).map(
        (e) =>
          (
            this.active.find((t) => t.source == e) ||
            new Ic(e, this.active.some((t) => 0 != t.state) ? 1 : 0)
          ).update(t, i)
      );
    n.length == this.active.length &&
      n.every((t, e) => t == this.active[e]) &&
      (n = this.active);
    let s =
      t.selection ||
      n.some((e) => e.hasResult() && t.changes.touchesRange(e.from, e.to)) ||
      !(function (t, e) {
        if (t == e) return !0;
        for (let i = 0, n = 0; ; ) {
          for (; i < t.length && !t[i].hasResult; ) i++;
          for (; n < e.length && !e[n].hasResult; ) n++;
          let s = i == t.length,
            r = n == e.length;
          if (s || r) return s == r;
          if (t[i++].result != e[n++].result) return !1;
        }
      })(n, this.active)
        ? Tc.build(n, e, this.id, this.open, i)
        : this.open && t.docChanged
        ? this.open.map(t.changes)
        : this.open;
    !s &&
      n.every((t) => 1 != t.state) &&
      n.some((t) => t.hasResult()) &&
      (n = n.map((t) => (t.hasResult() ? new Ic(t.source, 0) : t)));
    for (let e of t.effects)
      e.is(Fc) && (s = s && s.setSelected(e.value, this.id));
    return n == this.active && s == this.open ? this : new Rc(n, this.id, s);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : Ec;
  }
}
const Ec = { "aria-autocomplete": "list" };
function Lc(t, e) {
  return {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-activedescendant": t + "-" + e,
    "aria-controls": t,
  };
}
const Bc = [];
function Pc(t, e) {
  let i = e.match[0] - t.match[0];
  return i || t.completion.label.localeCompare(e.completion.label);
}
function Nc(t) {
  return t.isUserEvent("input.type")
    ? "input"
    : t.isUserEvent("delete.backward")
    ? "delete"
    : null;
}
class Ic {
  constructor(t, e, i = -1) {
    (this.source = t), (this.state = e), (this.explicitPos = i);
  }
  hasResult() {
    return !1;
  }
  update(t, e) {
    let i = Nc(t),
      n = this;
    i
      ? (n = n.handleUserEvent(t, i, e))
      : t.docChanged
      ? (n = n.handleChange(t))
      : t.selection && 0 != n.state && (n = new Ic(n.source, 0));
    for (let e of t.effects)
      if (e.is(Hc)) n = new Ic(n.source, 1, e.value ? wc(t.state) : -1);
      else if (e.is(Wc)) n = new Ic(n.source, 0);
      else if (e.is(zc)) for (let t of e.value) t.source == n.source && (n = t);
    return n;
  }
  handleUserEvent(t, e, i) {
    return "delete" != e && i.activateOnTyping
      ? new Ic(this.source, 1)
      : this.map(t.changes);
  }
  handleChange(t) {
    return t.changes.touchesRange(wc(t.startState))
      ? new Ic(this.source, 0)
      : this.map(t.changes);
  }
  map(t) {
    return t.empty || this.explicitPos < 0
      ? this
      : new Ic(this.source, this.state, t.mapPos(this.explicitPos));
  }
}
class Vc extends Ic {
  constructor(t, e, i, n, s, r) {
    super(t, 2, e),
      (this.result = i),
      (this.from = n),
      (this.to = s),
      (this.span = r);
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(t, e, i) {
    let n = t.changes.mapPos(this.from),
      s = t.changes.mapPos(this.to, 1),
      r = wc(t.state);
    if (
      (this.explicitPos < 0 ? r <= n : r < this.from) ||
      r > s ||
      ("delete" == e && wc(t.startState) == this.from)
    )
      return new Ic(this.source, "input" == e && i.activateOnTyping ? 1 : 0);
    let o = this.explicitPos < 0 ? -1 : t.changes.mapPos(this.explicitPos);
    return this.span && (n == s || this.span.test(t.state.sliceDoc(n, s)))
      ? new Vc(this.source, o, this.result, n, s, this.span)
      : new Ic(this.source, 1, o);
  }
  handleChange(t) {
    return t.changes.touchesRange(this.from, this.to)
      ? new Ic(this.source, 0)
      : this.map(t.changes);
  }
  map(t) {
    return t.empty
      ? this
      : new Vc(
          this.source,
          this.explicitPos < 0 ? -1 : t.mapPos(this.explicitPos),
          this.result,
          t.mapPos(this.from),
          t.mapPos(this.to, 1),
          this.span
        );
  }
}
const Hc = dt.define(),
  Wc = dt.define(),
  zc = dt.define({ map: (t, e) => t.map((t) => t.map(e)) }),
  Fc = dt.define(),
  qc = _.define({
    create: () => Rc.start(),
    update: (t, e) => t.update(e),
    provide: (t) => [
      dc.from(t, (t) => t.tooltip),
      Os.contentAttributes.from(t, (t) => t.attrs),
    ],
  });
function _c(t, e = "option") {
  return (i) => {
    let n = i.state.field(qc, !1);
    if (!n || !n.open || Date.now() - n.open.timestamp < 75) return !1;
    let s,
      r = 1;
    "page" == e &&
      (s = (function (t, e) {
        let i = t.plugin(cc);
        if (!i) return null;
        let n = i.manager.tooltips.indexOf(e);
        return n < 0 ? null : i.manager.tooltipViews[n];
      })(i, n.open.tooltip)) &&
      (r = Math.max(
        2,
        Math.floor(
          s.dom.offsetHeight / s.dom.querySelector("li").offsetHeight
        ) - 1
      ));
    let o = n.open.selected + r * (t ? 1 : -1),
      { length: l } = n.open.options;
    return (
      o < 0
        ? (o = "page" == e ? 0 : l - 1)
        : o >= l && (o = "page" == e ? l - 1 : 0),
      i.dispatch({ effects: Fc.of(o) }),
      !0
    );
  };
}
class jc {
  constructor(t, e) {
    (this.active = t),
      (this.context = e),
      (this.time = Date.now()),
      (this.updates = []),
      (this.done = void 0);
  }
}
const Uc = Ri.fromClass(
    class {
      constructor(t) {
        (this.view = t),
          (this.debounceUpdate = -1),
          (this.running = []),
          (this.debounceAccept = -1),
          (this.composing = 0);
        for (let e of t.state.field(qc).active)
          1 == e.state && this.startQuery(e);
      }
      update(t) {
        let e = t.state.field(qc);
        if (!t.selectionSet && !t.docChanged && t.startState.field(qc) == e)
          return;
        let i = t.transactions.some(
          (t) => (t.selection || t.docChanged) && !Nc(t)
        );
        for (let e = 0; e < this.running.length; e++) {
          let n = this.running[e];
          if (
            i ||
            (n.updates.length + t.transactions.length > 50 &&
              Date.now() - n.time > 1e3)
          ) {
            for (let t of n.context.abortListeners)
              try {
                t();
              } catch (t) {
                Ai(this.view.state, t);
              }
            (n.context.abortListeners = null), this.running.splice(e--, 1);
          } else n.updates.push(...t.transactions);
        }
        if (
          (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate),
          (this.debounceUpdate = e.active.some(
            (t) =>
              1 == t.state &&
              !this.running.some((e) => e.active.source == t.source)
          )
            ? setTimeout(() => this.startUpdate(), 50)
            : -1),
          0 != this.composing)
        )
          for (let e of t.transactions)
            "input" == Nc(e)
              ? (this.composing = 2)
              : 2 == this.composing && e.selection && (this.composing = 3);
      }
      startUpdate() {
        this.debounceUpdate = -1;
        let { state: t } = this.view,
          e = t.field(qc);
        for (let t of e.active)
          1 != t.state ||
            this.running.some((e) => e.active.source == t.source) ||
            this.startQuery(t);
      }
      startQuery(t) {
        let { state: e } = this.view,
          i = wc(e),
          n = new pc(e, i, t.explicitPos == i),
          s = new jc(t, n);
        this.running.push(s),
          Promise.resolve(t.source(n)).then(
            (t) => {
              s.context.aborted ||
                ((s.done = t || null), this.scheduleAccept());
            },
            (t) => {
              this.view.dispatch({ effects: Wc.of(null) }),
                Ai(this.view.state, t);
            }
          );
      }
      scheduleAccept() {
        this.running.every((t) => void 0 !== t.done)
          ? this.accept()
          : this.debounceAccept < 0 &&
            (this.debounceAccept = setTimeout(() => this.accept(), 50));
      }
      accept() {
        var t;
        this.debounceAccept > -1 && clearTimeout(this.debounceAccept),
          (this.debounceAccept = -1);
        let e = [],
          i = this.view.state.facet(Cc);
        for (let n = 0; n < this.running.length; n++) {
          let s = this.running[n];
          if (void 0 === s.done) continue;
          if ((this.running.splice(n--, 1), s.done)) {
            let n = new Vc(
              s.active.source,
              s.active.explicitPos,
              s.done,
              s.done.from,
              null !== (t = s.done.to) && void 0 !== t
                ? t
                : wc(
                    s.updates.length ? s.updates[0].startState : this.view.state
                  ),
              s.done.span && !1 !== s.done.filter ? yc(s.done.span, !0) : null
            );
            for (let t of s.updates) n = n.update(t, i);
            if (n.hasResult()) {
              e.push(n);
              continue;
            }
          }
          let r = this.view.state
            .field(qc)
            .active.find((t) => t.source == s.active.source);
          if (r && 1 == r.state)
            if (null == s.done) {
              let t = new Ic(s.active.source, 0);
              for (let e of s.updates) t = t.update(e, i);
              1 != t.state && e.push(t);
            } else this.startQuery(r);
        }
        e.length && this.view.dispatch({ effects: zc.of(e) });
      }
    },
    {
      eventHandlers: {
        compositionstart() {
          this.composing = 1;
        },
        compositionend() {
          3 == this.composing &&
            setTimeout(() => this.view.dispatch({ effects: Hc.of(!1) }), 20),
            (this.composing = 0);
        },
      },
    }
  ),
  $c = Os.baseTheme({
    ".cm-tooltip.cm-tooltip-autocomplete": {
      "& > ul": {
        fontFamily: "monospace",
        whiteSpace: "nowrap",
        overflow: "hidden auto",
        maxWidth_fallback: "700px",
        maxWidth: "min(700px, 95vw)",
        minWidth: "250px",
        maxHeight: "10em",
        listStyle: "none",
        margin: 0,
        padding: 0,
        "& > li": {
          overflowX: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
          padding: "1px 3px",
          lineHeight: 1.2,
        },
      },
    },
    "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
      background: "#17c",
      color: "white",
    },
    "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
      background: "#347",
      color: "white",
    },
    ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":
      { content: '"···"', opacity: 0.5, display: "block", textAlign: "center" },
    ".cm-tooltip.cm-completionInfo": {
      position: "absolute",
      padding: "3px 9px",
      width: "max-content",
      maxWidth: "300px",
    },
    ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
    ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
    "&light .cm-snippetField": { backgroundColor: "#00000022" },
    "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
    ".cm-snippetFieldPosition": {
      verticalAlign: "text-top",
      width: 0,
      height: "1.15em",
      margin: "0 -0.7px -.7em",
      borderLeft: "1.4px dotted #888",
    },
    ".cm-completionMatchedText": { textDecoration: "underline" },
    ".cm-completionDetail": { marginLeft: "0.5em", fontStyle: "italic" },
    ".cm-completionIcon": {
      fontSize: "90%",
      width: ".8em",
      display: "inline-block",
      textAlign: "center",
      paddingRight: ".6em",
      opacity: "0.6",
    },
    ".cm-completionIcon-function, .cm-completionIcon-method": {
      "&:after": { content: "'ƒ'" },
    },
    ".cm-completionIcon-class": { "&:after": { content: "'○'" } },
    ".cm-completionIcon-interface": { "&:after": { content: "'◌'" } },
    ".cm-completionIcon-variable": { "&:after": { content: "'𝑥'" } },
    ".cm-completionIcon-constant": { "&:after": { content: "'𝐶'" } },
    ".cm-completionIcon-type": { "&:after": { content: "'𝑡'" } },
    ".cm-completionIcon-enum": { "&:after": { content: "'∪'" } },
    ".cm-completionIcon-property": { "&:after": { content: "'□'" } },
    ".cm-completionIcon-keyword": { "&:after": { content: "'🔑︎'" } },
    ".cm-completionIcon-namespace": { "&:after": { content: "'▢'" } },
    ".cm-completionIcon-text": {
      "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" },
    },
  });
function Kc(t = {}) {
  return [qc, Cc.of(t), Uc, Jc, $c];
}
const Gc = [
    {
      key: "Ctrl-Space",
      run: (t) =>
        !!t.state.field(qc, !1) && (t.dispatch({ effects: Hc.of(!0) }), !0),
    },
    {
      key: "Escape",
      run: (t) => {
        let e = t.state.field(qc, !1);
        return (
          !(!e || !e.active.some((t) => 0 != t.state)) &&
          (t.dispatch({ effects: Wc.of(null) }), !0)
        );
      },
    },
    { key: "ArrowDown", run: _c(!0) },
    { key: "ArrowUp", run: _c(!1) },
    { key: "PageDown", run: _c(!0, "page") },
    { key: "PageUp", run: _c(!1, "page") },
    {
      key: "Enter",
      run: (t) => {
        let e = t.state.field(qc, !1);
        return (
          !(
            t.state.readOnly ||
            !e ||
            !e.open ||
            Date.now() - e.open.timestamp < 75
          ) && (xc(t, e.open.options[e.open.selected]), !0)
        );
      },
    },
  ],
  Jc = Y.highest(
    Vs.computeN([Cc], (t) => (t.facet(Cc).defaultKeymap ? [Gc] : []))
  ),
  Yc = { jinja2: Yl.define(jl), yaml: Yl.define($l) },
  Xc = new Q(),
  Qc = new Q(),
  Zc = [
    { key: "Tab", run: el },
    { key: "Shift-Tab", run: il },
  ],
  tu = Os.theme({
    "&": {
      color: "var(--primary-text-color)",
      backgroundColor:
        "var(--code-editor-background-color, var(--mdc-text-field-fill-color, whitesmoke))",
      "& ::selection": {
        backgroundColor: "rgba(var(--rgb-primary-color), 0.3)",
      },
      borderRadius:
        "var(--mdc-shape-small, 4px) var(--mdc-shape-small, 4px) 0px 0px",
      caretColor: "var(--secondary-text-color)",
      height: "var(--code-mirror-height, auto)",
      maxHeight: "var(--code-mirror-max-height, unset)",
    },
    "&.cm-editor.cm-focused": { outline: "none" },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "var(--secondary-text-color)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(var(--rgb-primary-color), 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(var(--rgb-secondary-text-color), 0.1)",
    },
    ".cm-scroller": { outline: "none" },
    ".cm-content": {
      caretColor: "var(--secondary-text-color)",
      paddingTop: "16px",
    },
    ".cm-panels": {
      backgroundColor: "var(--primary-background-color)",
      color: "var(--primary-text-color)",
    },
    ".cm-panels.top": { borderBottom: "1px solid var(--divider-color)" },
    ".cm-panels.bottom": { borderTop: "1px solid var(--divider-color)" },
    ".cm-button": {
      border: "1px solid var(--primary-color)",
      padding: "0px 16px",
      textTransform: "uppercase",
      margin: "4px",
      background: "none",
      color: "var(--primary-color)",
      fontFamily:
        "var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif))",
      fontSize: "var(--mdc-typography-button-font-size, 0.875rem)",
      height: "36px",
      fontWeight: "var(--mdc-typography-button-font-weight, 500)",
      borderRadius: "4px",
      letterSpacing: "var(--mdc-typography-button-letter-spacing, 0.0892857em)",
    },
    ".cm-textfield": {
      padding: "4px 0px 5px",
      borderRadius: "0",
      fontSize: "16px",
      color: "var(--primary-text-color)",
      border: "0",
      background: "none",
      fontFamily: "Roboto",
      borderBottom:
        "1px solid var(--paper-input-container-color, var(--secondary-text-color))",
      margin: "4px 4px 0",
      "& ::placeholder": {
        color:
          "var(--paper-input-container-color, var(--secondary-text-color))",
      },
      "&:focus": {
        outline: "none",
        borderBottom: "2px solid var(--primary-color)",
        paddingBottom: "4px",
      },
    },
    ".cm-tooltip": {
      color: "var(--primary-text-color)",
      backgroundColor:
        "var(--code-editor-background-color, var(--card-background-color))",
      border: "1px solid var(--divider-color)",
      borderRadius: "var(--mdc-shape-medium, 4px)",
      boxShadow:
        "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
    },
    "& .cm-tooltip.cm-tooltip-autocomplete > ul > li": { padding: "4px 8px" },
    "& .cm-tooltip-autocomplete ul li[aria-selected]": {
      background: "var(--primary-color)",
      color: "var(--text-primary-color)",
    },
    ".cm-completionIcon": { display: "none" },
    ".cm-completionDetail": {
      fontFamily: "Roboto",
      color: "var(--secondary-text-color)",
    },
    "li[aria-selected] .cm-completionDetail": {
      color: "var(--text-primary-color)",
    },
    "& .cm-completionInfo.cm-completionInfo-right": {
      left: "calc(100% + 4px)",
    },
    "& .cm-tooltip.cm-completionInfo": {
      padding: "4px 8px",
      marginTop: "-5px",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(var(--rgb-primary-color), 0.1)",
    },
    ".cm-searchMatch": {
      backgroundColor: "rgba(var(--rgb-accent-color), .2)",
      outline: "1px solid rgba(var(--rgb-accent-color), .4)",
    },
    ".cm-searchMatch.selected": {
      backgroundColor: "rgba(var(--rgb-accent-color), .4)",
      outline: "1px solid var(--accent-color)",
    },
    ".cm-gutters": {
      backgroundColor:
        "var(--code-editor-gutter-color, var(--mdc-text-field-fill-color, whitesmoke))",
      color: "var(--paper-dialog-color, var(--secondary-text-color))",
      border: "none",
      borderRight:
        "1px solid var(--paper-input-container-color, var(--secondary-text-color))",
      paddingRight: "1px",
    },
    "&.cm-focused .cm-gutters": {
      borderRight:
        "2px solid var(--paper-input-container-focus-color, var(--primary-color))",
      paddingRight: "0",
    },
    ".cm-gutterElement.lineNumber": { color: "inherit" },
  }),
  eu = ml.define([
    { tag: Vl.keyword, color: "var(--codemirror-keyword, #6262FF)" },
    {
      tag: [Vl.name, Vl.deleted, Vl.character, Vl.propertyName, Vl.macroName],
      color: "var(--codemirror-property, #905)",
    },
    {
      tag: [Vl.function(Vl.variableName), Vl.labelName],
      color: "var(--codemirror-variable, #07a)",
    },
    {
      tag: [Vl.color, Vl.constant(Vl.name), Vl.standard(Vl.name)],
      color: "var(--codemirror-qualifier, #690)",
    },
    {
      tag: [Vl.definition(Vl.name), Vl.separator],
      color: "var(--codemirror-def, #8DA6CE)",
    },
    {
      tag: [
        Vl.typeName,
        Vl.className,
        Vl.number,
        Vl.changed,
        Vl.annotation,
        Vl.modifier,
        Vl.self,
        Vl.namespace,
      ],
      color: "var(--codemirror-number, #ca7841)",
    },
    {
      tag: [
        Vl.operator,
        Vl.operatorKeyword,
        Vl.url,
        Vl.escape,
        Vl.regexp,
        Vl.link,
        Vl.special(Vl.string),
      ],
      color: "var(--codemirror-operator, #cda869)",
    },
    { tag: Vl.comment, color: "var(--codemirror-comment, #777)" },
    {
      tag: Vl.meta,
      color: "var(--codemirror-meta, var(--primary-text-color))",
    },
    { tag: Vl.strong, fontWeight: "bold" },
    { tag: Vl.emphasis, fontStyle: "italic" },
    {
      tag: Vl.link,
      color: "var(--primary-color)",
      textDecoration: "underline",
    },
    { tag: Vl.heading, fontWeight: "bold" },
    { tag: Vl.atom, color: "var(--codemirror-atom, #F90)" },
    { tag: Vl.bool, color: "var(--codemirror-atom, #F90)" },
    {
      tag: Vl.special(Vl.variableName),
      color: "var(--codemirror-variable-2, #690)",
    },
    { tag: Vl.processingInstruction, color: "var(--secondary-text-color)" },
    { tag: Vl.string, color: "var(--codemirror-string, #07a)" },
    { tag: Vl.inserted, color: "var(--codemirror-string2, #07a)" },
    { tag: Vl.invalid, color: "var(--error-color)" },
  ]);
export {
  Ct as EditorState,
  Os as EditorView,
  ml as HighlightStyle,
  Y as Prec,
  Kc as autocompletion,
  nl as defaultKeymap,
  js as drawSelection,
  Zs as highlightActiveLine,
  Sa as highlightSelectionMatches,
  eu as highlightStyle,
  Ph as history,
  Yh as historyKeymap,
  Vs as keymap,
  Xc as langCompartment,
  Yc as langs,
  Dh as lineNumbers,
  Qc as readonlyCompartment,
  Zh as rectangularSelection,
  Za as searchKeymap,
  Zc as tabKeyBindings,
  Vl as tags,
  tu as theme,
};
