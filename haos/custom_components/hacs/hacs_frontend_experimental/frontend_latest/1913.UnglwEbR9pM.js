export const id = 1913;
export const ids = [1913];
export const modules = {
  1913: (e, t, r) => {
    r.d(t, { q: () => C });
    let n = (function (e) {
      return (
        (e[(e.Null = 0)] = "Null"),
        (e[(e.Backspace = 8)] = "Backspace"),
        (e[(e.Tab = 9)] = "Tab"),
        (e[(e.LineFeed = 10)] = "LineFeed"),
        (e[(e.CarriageReturn = 13)] = "CarriageReturn"),
        (e[(e.Space = 32)] = "Space"),
        (e[(e.ExclamationMark = 33)] = "ExclamationMark"),
        (e[(e.DoubleQuote = 34)] = "DoubleQuote"),
        (e[(e.Hash = 35)] = "Hash"),
        (e[(e.DollarSign = 36)] = "DollarSign"),
        (e[(e.PercentSign = 37)] = "PercentSign"),
        (e[(e.Ampersand = 38)] = "Ampersand"),
        (e[(e.SingleQuote = 39)] = "SingleQuote"),
        (e[(e.OpenParen = 40)] = "OpenParen"),
        (e[(e.CloseParen = 41)] = "CloseParen"),
        (e[(e.Asterisk = 42)] = "Asterisk"),
        (e[(e.Plus = 43)] = "Plus"),
        (e[(e.Comma = 44)] = "Comma"),
        (e[(e.Dash = 45)] = "Dash"),
        (e[(e.Period = 46)] = "Period"),
        (e[(e.Slash = 47)] = "Slash"),
        (e[(e.Digit0 = 48)] = "Digit0"),
        (e[(e.Digit1 = 49)] = "Digit1"),
        (e[(e.Digit2 = 50)] = "Digit2"),
        (e[(e.Digit3 = 51)] = "Digit3"),
        (e[(e.Digit4 = 52)] = "Digit4"),
        (e[(e.Digit5 = 53)] = "Digit5"),
        (e[(e.Digit6 = 54)] = "Digit6"),
        (e[(e.Digit7 = 55)] = "Digit7"),
        (e[(e.Digit8 = 56)] = "Digit8"),
        (e[(e.Digit9 = 57)] = "Digit9"),
        (e[(e.Colon = 58)] = "Colon"),
        (e[(e.Semicolon = 59)] = "Semicolon"),
        (e[(e.LessThan = 60)] = "LessThan"),
        (e[(e.Equals = 61)] = "Equals"),
        (e[(e.GreaterThan = 62)] = "GreaterThan"),
        (e[(e.QuestionMark = 63)] = "QuestionMark"),
        (e[(e.AtSign = 64)] = "AtSign"),
        (e[(e.A = 65)] = "A"),
        (e[(e.B = 66)] = "B"),
        (e[(e.C = 67)] = "C"),
        (e[(e.D = 68)] = "D"),
        (e[(e.E = 69)] = "E"),
        (e[(e.F = 70)] = "F"),
        (e[(e.G = 71)] = "G"),
        (e[(e.H = 72)] = "H"),
        (e[(e.I = 73)] = "I"),
        (e[(e.J = 74)] = "J"),
        (e[(e.K = 75)] = "K"),
        (e[(e.L = 76)] = "L"),
        (e[(e.M = 77)] = "M"),
        (e[(e.N = 78)] = "N"),
        (e[(e.O = 79)] = "O"),
        (e[(e.P = 80)] = "P"),
        (e[(e.Q = 81)] = "Q"),
        (e[(e.R = 82)] = "R"),
        (e[(e.S = 83)] = "S"),
        (e[(e.T = 84)] = "T"),
        (e[(e.U = 85)] = "U"),
        (e[(e.V = 86)] = "V"),
        (e[(e.W = 87)] = "W"),
        (e[(e.X = 88)] = "X"),
        (e[(e.Y = 89)] = "Y"),
        (e[(e.Z = 90)] = "Z"),
        (e[(e.OpenSquareBracket = 91)] = "OpenSquareBracket"),
        (e[(e.Backslash = 92)] = "Backslash"),
        (e[(e.CloseSquareBracket = 93)] = "CloseSquareBracket"),
        (e[(e.Caret = 94)] = "Caret"),
        (e[(e.Underline = 95)] = "Underline"),
        (e[(e.BackTick = 96)] = "BackTick"),
        (e[(e.a = 97)] = "a"),
        (e[(e.b = 98)] = "b"),
        (e[(e.c = 99)] = "c"),
        (e[(e.d = 100)] = "d"),
        (e[(e.e = 101)] = "e"),
        (e[(e.f = 102)] = "f"),
        (e[(e.g = 103)] = "g"),
        (e[(e.h = 104)] = "h"),
        (e[(e.i = 105)] = "i"),
        (e[(e.j = 106)] = "j"),
        (e[(e.k = 107)] = "k"),
        (e[(e.l = 108)] = "l"),
        (e[(e.m = 109)] = "m"),
        (e[(e.n = 110)] = "n"),
        (e[(e.o = 111)] = "o"),
        (e[(e.p = 112)] = "p"),
        (e[(e.q = 113)] = "q"),
        (e[(e.r = 114)] = "r"),
        (e[(e.s = 115)] = "s"),
        (e[(e.t = 116)] = "t"),
        (e[(e.u = 117)] = "u"),
        (e[(e.v = 118)] = "v"),
        (e[(e.w = 119)] = "w"),
        (e[(e.x = 120)] = "x"),
        (e[(e.y = 121)] = "y"),
        (e[(e.z = 122)] = "z"),
        (e[(e.OpenCurlyBrace = 123)] = "OpenCurlyBrace"),
        (e[(e.Pipe = 124)] = "Pipe"),
        (e[(e.CloseCurlyBrace = 125)] = "CloseCurlyBrace"),
        (e[(e.Tilde = 126)] = "Tilde"),
        e
      );
    })({});
    const i = 128;
    function a() {
      const e = [],
        t = [];
      for (let e = 0; e <= i; e++) t[e] = 0;
      for (let r = 0; r <= i; r++) e.push(t.slice(0));
      return e;
    }
    function o(e, t) {
      if (t < 0 || t >= e.length) return !1;
      const r = e.codePointAt(t);
      switch (r) {
        case n.Underline:
        case n.Dash:
        case n.Period:
        case n.Space:
        case n.Slash:
        case n.Backslash:
        case n.SingleQuote:
        case n.DoubleQuote:
        case n.Colon:
        case n.DollarSign:
        case n.LessThan:
        case n.OpenParen:
        case n.OpenSquareBracket:
          return !0;
        case void 0:
          return !1;
        default:
          return ((i = r) >= 127462 && i <= 127487) ||
            8986 === i ||
            8987 === i ||
            9200 === i ||
            9203 === i ||
            (i >= 9728 && i <= 10175) ||
            11088 === i ||
            11093 === i ||
            (i >= 127744 && i <= 128591) ||
            (i >= 128640 && i <= 128764) ||
            (i >= 128992 && i <= 129003) ||
            (i >= 129280 && i <= 129535) ||
            (i >= 129648 && i <= 129750)
            ? !0
            : !1;
      }
      var i;
    }
    function s(e, t) {
      if (t < 0 || t >= e.length) return !1;
      switch (e.charCodeAt(t)) {
        case n.Space:
        case n.Tab:
          return !0;
        default:
          return !1;
      }
    }
    function c(e, t, r) {
      return t[e] !== r[e];
    }
    var l = (function (e) {
      return (
        (e[(e.Diag = 1)] = "Diag"),
        (e[(e.Left = 2)] = "Left"),
        (e[(e.LeftLeft = 3)] = "LeftLeft"),
        e
      );
    })(l || {});
    function u(e, t, r, n, a, o, s) {
      const u = e.length > i ? i : e.length,
        d = n.length > i ? i : n.length;
      if (r >= u || o >= d || u - r > d - o) return;
      if (
        !(function (e, t, r, n, i, a, o = !1) {
          for (; t < r && i < a; )
            e[t] === n[i] && (o && (g[t] = i), (t += 1)), (i += 1);
          return t === r;
        })(t, r, u, a, o, d, !0)
      )
        return;
      let C;
      !(function (e, t, r, n, i, a) {
        let o = e - 1,
          s = t - 1;
        for (; o >= r && s >= n; ) i[o] === a[s] && ((D[o] = s), o--), s--;
      })(u, d, r, o, t, a);
      let k,
        L,
        T = 1;
      const E = [!1];
      for (C = 1, k = r; k < u; C++, k++) {
        const i = g[k],
          s = D[k],
          c = k + 1 < u ? D[k + 1] : d;
        for (T = i - o + 1, L = i; L < c; T++, L++) {
          let c = Number.MIN_SAFE_INTEGER,
            u = !1;
          L <= s &&
            (c = f(e, t, k, r, n, a, L, d, o, 0 === h[C - 1][T - 1], E));
          let g = 0;
          c !== Number.MAX_SAFE_INTEGER &&
            ((u = !0), (g = c + S[C - 1][T - 1]));
          const D = L > i,
            N = D ? S[C][T - 1] + (h[C][T - 1] > 0 ? -5 : 0) : 0,
            m = L > i + 1 && h[C][T - 1] > 0,
            B = m ? S[C][T - 2] + (h[C][T - 2] > 0 ? -5 : 0) : 0;
          if (m && (!D || B >= N) && (!u || B >= g))
            (S[C][T] = B), (p[C][T] = l.LeftLeft), (h[C][T] = 0);
          else if (D && (!u || N >= g))
            (S[C][T] = N), (p[C][T] = l.Left), (h[C][T] = 0);
          else {
            if (!u) throw new Error("not possible");
            (S[C][T] = g), (p[C][T] = l.Diag), (h[C][T] = h[C - 1][T - 1] + 1);
          }
        }
      }
      if (!E[0] && !s) return;
      C--, T--;
      const N = [S[C][T], o];
      let m = 0,
        B = 0;
      for (; C >= 1; ) {
        let e = T;
        do {
          const t = p[C][e];
          if (t === l.LeftLeft) e -= 2;
          else {
            if (t !== l.Left) break;
            e -= 1;
          }
        } while (e >= 1);
        m > 1 &&
          t[r + C - 1] === a[o + T - 1] &&
          !c(e + o - 1, n, a) &&
          m + 1 > h[C][e] &&
          (e = T),
          e === T ? m++ : (m = 1),
          B || (B = e),
          C--,
          (T = e - 1),
          N.push(T);
      }
      d === u && (N[0] += 2);
      const P = B - u;
      return (N[0] -= P), N;
    }
    function f(e, t, r, n, i, a, l, u, f, g, D) {
      if (t[r] !== a[l]) return Number.MIN_SAFE_INTEGER;
      let h = 1,
        S = !1;
      return (
        l === r - n
          ? (h = e[r] === i[l] ? 7 : 5)
          : !c(l, i, a) || (0 !== l && c(l - 1, i, a))
          ? !o(a, l) || (0 !== l && o(a, l - 1))
            ? (o(a, l - 1) || s(a, l - 1)) && ((h = 5), (S = !0))
            : (h = 5)
          : ((h = e[r] === i[l] ? 7 : 5), (S = !0)),
        h > 1 && r === n && (D[0] = !0),
        S || (S = c(l, i, a) || o(a, l - 1) || s(a, l - 1)),
        r === n
          ? l > f && (h -= S ? 3 : 5)
          : (h += g ? (S ? 2 : 0) : S ? 0 : 1),
        l + 1 === u && (h -= S ? 3 : 5),
        h
      );
    }
    const g = d(256),
      D = d(256),
      h = a(),
      S = a(),
      p = a();
    function d(e) {
      const t = [];
      for (let r = 0; r <= e; r++) t[r] = 0;
      return t;
    }
    const C = (e, t) =>
      t
        .map(
          (t) => (
            (t.score = ((e, t) => {
              let r = Number.NEGATIVE_INFINITY;
              for (const n of t.strings) {
                const t = u(e, e.toLowerCase(), 0, n, n.toLowerCase(), 0, !0);
                if (!t) continue;
                const i = 0 === t[0] ? 1 : t[0];
                i > r && (r = i);
              }
              if (r !== Number.NEGATIVE_INFINITY) return r;
            })(e, t)),
            t
          )
        )
        .filter((e) => void 0 !== e.score)
        .sort(({ score: e = 0 }, { score: t = 0 }) =>
          e > t ? -1 : e < t ? 1 : 0
        );
  },
};
//# sourceMappingURL=1913.UnglwEbR9pM.js.map
