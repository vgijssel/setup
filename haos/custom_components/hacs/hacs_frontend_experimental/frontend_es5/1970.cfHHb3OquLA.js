(self.webpackChunkhacs_frontend = self.webpackChunkhacs_frontend || []).push([
  [1970],
  {
    68405: function (t, r, e) {
      "use strict";
      e(36513), e(91989), e(51467), e(64777), e(37313);
      var n = {
        single_source_shortest_paths: function (t, r, e) {
          var o = {},
            i = {};
          i[r] = 0;
          var a,
            u,
            s,
            f,
            c,
            h,
            g,
            d = n.PriorityQueue.make();
          for (d.push(r, 0); !d.empty(); )
            for (s in ((u = (a = d.pop()).value),
            (f = a.cost),
            (c = t[u] || {})))
              c.hasOwnProperty(s) &&
                ((h = f + c[s]),
                (g = i[s]),
                (void 0 === i[s] || g > h) &&
                  ((i[s] = h), d.push(s, h), (o[s] = u)));
          if (void 0 !== e && void 0 === i[e]) {
            var l = ["Could not find a path from ", r, " to ", e, "."].join("");
            throw new Error(l);
          }
          return o;
        },
        extract_shortest_path_from_predecessor_list: function (t, r) {
          for (var e = [], n = r; n; ) e.push(n), t[n], (n = t[n]);
          return e.reverse(), e;
        },
        find_path: function (t, r, e) {
          var o = n.single_source_shortest_paths(t, r, e);
          return n.extract_shortest_path_from_predecessor_list(o, e);
        },
        PriorityQueue: {
          make: function (t) {
            var r,
              e = n.PriorityQueue,
              o = {};
            for (r in ((t = t || {}), e)) e.hasOwnProperty(r) && (o[r] = e[r]);
            return (o.queue = []), (o.sorter = t.sorter || e.default_sorter), o;
          },
          default_sorter: function (t, r) {
            return t.cost - r.cost;
          },
          push: function (t, r) {
            var e = { value: t, cost: r };
            this.queue.push(e), this.queue.sort(this.sorter);
          },
          pop: function () {
            return this.queue.shift();
          },
          empty: function () {
            return 0 === this.queue.length;
          },
        },
      };
      t.exports = n;
    },
    84220: function (t, r, e) {
      "use strict";
      e(36513),
        e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330),
        (t.exports = function (t) {
          for (var r = [], e = t.length, n = 0; n < e; n++) {
            var o = t.charCodeAt(n);
            if (o >= 55296 && o <= 56319 && e > n + 1) {
              var i = t.charCodeAt(n + 1);
              i >= 56320 &&
                i <= 57343 &&
                ((o = 1024 * (o - 55296) + i - 56320 + 65536), (n += 1));
            }
            o < 128
              ? r.push(o)
              : o < 2048
              ? (r.push((o >> 6) | 192), r.push((63 & o) | 128))
              : o < 55296 || (o >= 57344 && o < 65536)
              ? (r.push((o >> 12) | 224),
                r.push(((o >> 6) & 63) | 128),
                r.push((63 & o) | 128))
              : o >= 65536 && o <= 1114111
              ? (r.push((o >> 18) | 240),
                r.push(((o >> 12) & 63) | 128),
                r.push(((o >> 6) & 63) | 128),
                r.push((63 & o) | 128))
              : r.push(239, 191, 189);
          }
          return new Uint8Array(r).buffer;
        });
    },
    51970: function (t, r, e) {
      e(17692), e(51467), e(46798), e(47084), e(94570);
      var n = e(30840),
        o = e(13667),
        i = e(73437),
        a = e(24205);
      function u(t, r, e, i, a) {
        var u = [].slice.call(arguments, 1),
          s = u.length,
          f = "function" == typeof u[s - 1];
        if (!f && !n()) throw new Error("Callback required as last argument");
        if (!f) {
          if (s < 1) throw new Error("Too few arguments provided");
          return (
            1 === s
              ? ((e = r), (r = i = void 0))
              : 2 !== s || r.getContext || ((i = e), (e = r), (r = void 0)),
            new Promise(function (n, a) {
              try {
                var u = o.create(e, i);
                n(t(u, r, i));
              } catch (s) {
                a(s);
              }
            })
          );
        }
        if (s < 2) throw new Error("Too few arguments provided");
        2 === s
          ? ((a = e), (e = r), (r = i = void 0))
          : 3 === s &&
            (r.getContext && void 0 === a
              ? ((a = i), (i = void 0))
              : ((a = i), (i = e), (e = r), (r = void 0)));
        try {
          var c = o.create(e, i);
          a(null, t(c, r, i));
        } catch (h) {
          a(h);
        }
      }
      (r.create = o.create),
        (r.toCanvas = u.bind(null, i.render)),
        (r.toDataURL = u.bind(null, i.renderToDataURL)),
        (r.toString = u.bind(null, function (t, r, e) {
          return a.render(t, e);
        }));
    },
    30840: function (t, r, e) {
      e(46798),
        e(47084),
        (t.exports = function () {
          return (
            "function" == typeof Promise &&
            Promise.prototype &&
            Promise.prototype.then
          );
        });
    },
    11829: function (t, r, e) {
      e(36513), e(64777);
      var n = e(96445).getSymbolSize;
      (r.getRowColCoords = function (t) {
        if (1 === t) return [];
        for (
          var r = Math.floor(t / 7) + 2,
            e = n(t),
            o = 145 === e ? 26 : 2 * Math.ceil((e - 13) / (2 * r - 2)),
            i = [e - 7],
            a = 1;
          a < r - 1;
          a++
        )
          i[a] = i[a - 1] - o;
        return i.push(6), i.reverse();
      }),
        (r.getPositions = function (t) {
          for (
            var e = [], n = r.getRowColCoords(t), o = n.length, i = 0;
            i < o;
            i++
          )
            for (var a = 0; a < o; a++)
              (0 === i && 0 === a) ||
                (0 === i && a === o - 1) ||
                (i === o - 1 && 0 === a) ||
                e.push([n[i], n[a]]);
          return e;
        });
    },
    80121: function (t, r, e) {
      e(56308);
      var n = e(62851),
        o = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
          " ",
          "$",
          "%",
          "*",
          "+",
          "-",
          ".",
          "/",
          ":",
        ];
      function i(t) {
        (this.mode = n.ALPHANUMERIC), (this.data = t);
      }
      (i.getBitsLength = function (t) {
        return 11 * Math.floor(t / 2) + (t % 2) * 6;
      }),
        (i.prototype.getLength = function () {
          return this.data.length;
        }),
        (i.prototype.getBitsLength = function () {
          return i.getBitsLength(this.data.length);
        }),
        (i.prototype.write = function (t) {
          var r;
          for (r = 0; r + 2 <= this.data.length; r += 2) {
            var e = 45 * o.indexOf(this.data[r]);
            (e += o.indexOf(this.data[r + 1])), t.put(e, 11);
          }
          this.data.length % 2 && t.put(o.indexOf(this.data[r]), 6);
        }),
        (t.exports = i);
    },
    52163: function (t, r, e) {
      function n() {
        (this.buffer = []), (this.length = 0);
      }
      e(36513),
        (n.prototype = {
          get: function (t) {
            var r = Math.floor(t / 8);
            return 1 == ((this.buffer[r] >>> (7 - (t % 8))) & 1);
          },
          put: function (t, r) {
            for (var e = 0; e < r; e++)
              this.putBit(1 == ((t >>> (r - e - 1)) & 1));
          },
          getLengthInBits: function () {
            return this.length;
          },
          putBit: function (t) {
            var r = Math.floor(this.length / 8);
            this.buffer.length <= r && this.buffer.push(0),
              t && (this.buffer[r] |= 128 >>> this.length % 8),
              this.length++;
          },
        }),
        (t.exports = n);
    },
    73303: function (t, r, e) {
      function n(t) {
        if (!t || t < 1)
          throw new Error("BitMatrix size must be defined and greater than 0");
        (this.size = t),
          (this.data = new Uint8Array(t * t)),
          (this.reservedBit = new Uint8Array(t * t));
      }
      e(51467),
        e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330),
        (n.prototype.set = function (t, r, e, n) {
          var o = t * this.size + r;
          (this.data[o] = e), n && (this.reservedBit[o] = !0);
        }),
        (n.prototype.get = function (t, r) {
          return this.data[t * this.size + r];
        }),
        (n.prototype.xor = function (t, r, e) {
          this.data[t * this.size + r] ^= e;
        }),
        (n.prototype.isReserved = function (t, r) {
          return this.reservedBit[t * this.size + r];
        }),
        (t.exports = n);
    },
    44506: function (t, r, e) {
      e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330);
      var n = e(84220),
        o = e(62851);
      function i(t) {
        (this.mode = o.BYTE),
          "string" == typeof t && (t = n(t)),
          (this.data = new Uint8Array(t));
      }
      (i.getBitsLength = function (t) {
        return 8 * t;
      }),
        (i.prototype.getLength = function () {
          return this.data.length;
        }),
        (i.prototype.getBitsLength = function () {
          return i.getBitsLength(this.data.length);
        }),
        (i.prototype.write = function (t) {
          for (var r = 0, e = this.data.length; r < e; r++)
            t.put(this.data[r], 8);
        }),
        (t.exports = i);
    },
    32842: function (t, r, e) {
      var n = e(7356),
        o = [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4,
          4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8,
          10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6,
          11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23,
          25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12,
          23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29,
          40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51,
          60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74,
          24, 47, 65, 77, 25, 49, 68, 81,
        ],
        i = [
          7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48,
          72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110,
          160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308,
          104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280,
          408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650,
          224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504,
          750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952,
          1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140,
          1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350,
          1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590,
          1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860,
          2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430,
        ];
      (r.getBlocksCount = function (t, r) {
        switch (r) {
          case n.L:
            return o[4 * (t - 1) + 0];
          case n.M:
            return o[4 * (t - 1) + 1];
          case n.Q:
            return o[4 * (t - 1) + 2];
          case n.H:
            return o[4 * (t - 1) + 3];
          default:
            return;
        }
      }),
        (r.getTotalCodewordsCount = function (t, r) {
          switch (r) {
            case n.L:
              return i[4 * (t - 1) + 0];
            case n.M:
              return i[4 * (t - 1) + 1];
            case n.Q:
              return i[4 * (t - 1) + 2];
            case n.H:
              return i[4 * (t - 1) + 3];
            default:
              return;
          }
        });
    },
    7356: function (t, r, e) {
      e(51467),
        (r.L = { bit: 1 }),
        (r.M = { bit: 0 }),
        (r.Q = { bit: 3 }),
        (r.H = { bit: 2 }),
        (r.isValid = function (t) {
          return t && void 0 !== t.bit && t.bit >= 0 && t.bit < 4;
        }),
        (r.from = function (t, e) {
          if (r.isValid(t)) return t;
          try {
            return (function (t) {
              if ("string" != typeof t)
                throw new Error("Param is not a string");
              switch (t.toLowerCase()) {
                case "l":
                case "low":
                  return r.L;
                case "m":
                case "medium":
                  return r.M;
                case "q":
                case "quartile":
                  return r.Q;
                case "h":
                case "high":
                  return r.H;
                default:
                  throw new Error("Unknown EC Level: " + t);
              }
            })(t);
          } catch (n) {
            return e;
          }
        });
    },
    64280: function (t, r, e) {
      var n = e(96445).getSymbolSize;
      r.getPositions = function (t) {
        var r = n(t);
        return [
          [0, 0],
          [r - 7, 0],
          [0, r - 7],
        ];
      };
    },
    63468: function (t, r, e) {
      var n = e(96445),
        o = n.getBCHDigit(1335);
      r.getEncodedBits = function (t, r) {
        for (var e = (t.bit << 3) | r, i = e << 10; n.getBCHDigit(i) - o >= 0; )
          i ^= 1335 << (n.getBCHDigit(i) - o);
        return 21522 ^ ((e << 10) | i);
      };
    },
    11254: function (t, r, e) {
      e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330),
        e(51467);
      var n = new Uint8Array(512),
        o = new Uint8Array(256);
      !(function () {
        for (var t = 1, r = 0; r < 255; r++)
          (n[r] = t), (o[t] = r), 256 & (t <<= 1) && (t ^= 285);
        for (var e = 255; e < 512; e++) n[e] = n[e - 255];
      })(),
        (r.log = function (t) {
          if (t < 1) throw new Error("log(" + t + ")");
          return o[t];
        }),
        (r.exp = function (t) {
          return n[t];
        }),
        (r.mul = function (t, r) {
          return 0 === t || 0 === r ? 0 : n[o[t] + o[r]];
        });
    },
    23466: function (t, r, e) {
      e(51467);
      var n = e(62851),
        o = e(96445);
      function i(t) {
        (this.mode = n.KANJI), (this.data = t);
      }
      (i.getBitsLength = function (t) {
        return 13 * t;
      }),
        (i.prototype.getLength = function () {
          return this.data.length;
        }),
        (i.prototype.getBitsLength = function () {
          return i.getBitsLength(this.data.length);
        }),
        (i.prototype.write = function (t) {
          var r;
          for (r = 0; r < this.data.length; r++) {
            var e = o.toSJIS(this.data[r]);
            if (e >= 33088 && e <= 40956) e -= 33088;
            else {
              if (!(e >= 57408 && e <= 60351))
                throw new Error(
                  "Invalid SJIS character: " +
                    this.data[r] +
                    "\nMake sure your charset is UTF-8"
                );
              e -= 49472;
            }
            (e = 192 * ((e >>> 8) & 255) + (255 & e)), t.put(e, 13);
          }
        }),
        (t.exports = i);
    },
    71819: function (t, r, e) {
      e(27392),
        e(51467),
        e(65974),
        (r.Patterns = {
          PATTERN000: 0,
          PATTERN001: 1,
          PATTERN010: 2,
          PATTERN011: 3,
          PATTERN100: 4,
          PATTERN101: 5,
          PATTERN110: 6,
          PATTERN111: 7,
        });
      var n = 3,
        o = 3,
        i = 40,
        a = 10;
      function u(t, e, n) {
        switch (t) {
          case r.Patterns.PATTERN000:
            return (e + n) % 2 == 0;
          case r.Patterns.PATTERN001:
            return e % 2 == 0;
          case r.Patterns.PATTERN010:
            return n % 3 == 0;
          case r.Patterns.PATTERN011:
            return (e + n) % 3 == 0;
          case r.Patterns.PATTERN100:
            return (Math.floor(e / 2) + Math.floor(n / 3)) % 2 == 0;
          case r.Patterns.PATTERN101:
            return ((e * n) % 2) + ((e * n) % 3) == 0;
          case r.Patterns.PATTERN110:
            return (((e * n) % 2) + ((e * n) % 3)) % 2 == 0;
          case r.Patterns.PATTERN111:
            return (((e * n) % 3) + ((e + n) % 2)) % 2 == 0;
          default:
            throw new Error("bad maskPattern:" + t);
        }
      }
      (r.isValid = function (t) {
        return null != t && "" !== t && !isNaN(t) && t >= 0 && t <= 7;
      }),
        (r.from = function (t) {
          return r.isValid(t) ? parseInt(t, 10) : void 0;
        }),
        (r.getPenaltyN1 = function (t) {
          for (
            var r = t.size, e = 0, o = 0, i = 0, a = null, u = null, s = 0;
            s < r;
            s++
          ) {
            (o = i = 0), (a = u = null);
            for (var f = 0; f < r; f++) {
              var c = t.get(s, f);
              c === a ? o++ : (o >= 5 && (e += n + (o - 5)), (a = c), (o = 1)),
                (c = t.get(f, s)) === u
                  ? i++
                  : (i >= 5 && (e += n + (i - 5)), (u = c), (i = 1));
            }
            o >= 5 && (e += n + (o - 5)), i >= 5 && (e += n + (i - 5));
          }
          return e;
        }),
        (r.getPenaltyN2 = function (t) {
          for (var r = t.size, e = 0, n = 0; n < r - 1; n++)
            for (var i = 0; i < r - 1; i++) {
              var a =
                t.get(n, i) +
                t.get(n, i + 1) +
                t.get(n + 1, i) +
                t.get(n + 1, i + 1);
              (4 !== a && 0 !== a) || e++;
            }
          return e * o;
        }),
        (r.getPenaltyN3 = function (t) {
          for (var r = t.size, e = 0, n = 0, o = 0, a = 0; a < r; a++) {
            n = o = 0;
            for (var u = 0; u < r; u++)
              (n = ((n << 1) & 2047) | t.get(a, u)),
                u >= 10 && (1488 === n || 93 === n) && e++,
                (o = ((o << 1) & 2047) | t.get(u, a)),
                u >= 10 && (1488 === o || 93 === o) && e++;
          }
          return e * i;
        }),
        (r.getPenaltyN4 = function (t) {
          for (var r = 0, e = t.data.length, n = 0; n < e; n++) r += t.data[n];
          return Math.abs(Math.ceil((100 * r) / e / 5) - 10) * a;
        }),
        (r.applyMask = function (t, r) {
          for (var e = r.size, n = 0; n < e; n++)
            for (var o = 0; o < e; o++)
              r.isReserved(o, n) || r.xor(o, n, u(t, o, n));
        }),
        (r.getBestMask = function (t, e) {
          for (
            var n = Object.keys(r.Patterns).length, o = 0, i = 1 / 0, a = 0;
            a < n;
            a++
          ) {
            e(a), r.applyMask(a, t);
            var u =
              r.getPenaltyN1(t) +
              r.getPenaltyN2(t) +
              r.getPenaltyN3(t) +
              r.getPenaltyN4(t);
            r.applyMask(a, t), u < i && ((i = u), (o = a));
          }
          return o;
        });
    },
    62851: function (t, r, e) {
      e(51467), e(46798), e(94570);
      var n = e(42906),
        o = e(58836);
      (r.NUMERIC = { id: "Numeric", bit: 1, ccBits: [10, 12, 14] }),
        (r.ALPHANUMERIC = { id: "Alphanumeric", bit: 2, ccBits: [9, 11, 13] }),
        (r.BYTE = { id: "Byte", bit: 4, ccBits: [8, 16, 16] }),
        (r.KANJI = { id: "Kanji", bit: 8, ccBits: [8, 10, 12] }),
        (r.MIXED = { bit: -1 }),
        (r.getCharCountIndicator = function (t, r) {
          if (!t.ccBits) throw new Error("Invalid mode: " + t);
          if (!n.isValid(r)) throw new Error("Invalid version: " + r);
          return r >= 1 && r < 10
            ? t.ccBits[0]
            : r < 27
            ? t.ccBits[1]
            : t.ccBits[2];
        }),
        (r.getBestModeForData = function (t) {
          return o.testNumeric(t)
            ? r.NUMERIC
            : o.testAlphanumeric(t)
            ? r.ALPHANUMERIC
            : o.testKanji(t)
            ? r.KANJI
            : r.BYTE;
        }),
        (r.toString = function (t) {
          if (t && t.id) return t.id;
          throw new Error("Invalid mode");
        }),
        (r.isValid = function (t) {
          return t && t.bit && t.ccBits;
        }),
        (r.from = function (t, e) {
          if (r.isValid(t)) return t;
          try {
            return (function (t) {
              if ("string" != typeof t)
                throw new Error("Param is not a string");
              switch (t.toLowerCase()) {
                case "numeric":
                  return r.NUMERIC;
                case "alphanumeric":
                  return r.ALPHANUMERIC;
                case "kanji":
                  return r.KANJI;
                case "byte":
                  return r.BYTE;
                default:
                  throw new Error("Unknown mode: " + t);
              }
            })(t);
          } catch (n) {
            return e;
          }
        });
    },
    64807: function (t, r, e) {
      e(46798), e(94570), e(27392);
      var n = e(62851);
      function o(t) {
        (this.mode = n.NUMERIC), (this.data = t.toString());
      }
      (o.getBitsLength = function (t) {
        return 10 * Math.floor(t / 3) + (t % 3 ? (t % 3) * 3 + 1 : 0);
      }),
        (o.prototype.getLength = function () {
          return this.data.length;
        }),
        (o.prototype.getBitsLength = function () {
          return o.getBitsLength(this.data.length);
        }),
        (o.prototype.write = function (t) {
          var r, e, n;
          for (r = 0; r + 3 <= this.data.length; r += 3)
            (e = this.data.substr(r, 3)), (n = parseInt(e, 10)), t.put(n, 10);
          var o = this.data.length - r;
          o > 0 &&
            ((e = this.data.substr(r)),
            (n = parseInt(e, 10)),
            t.put(n, 3 * o + 1));
        }),
        (t.exports = o);
    },
    25876: function (t, r, e) {
      e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330),
        e(17692);
      var n = e(11254);
      (r.mul = function (t, r) {
        for (
          var e = new Uint8Array(t.length + r.length - 1), o = 0;
          o < t.length;
          o++
        )
          for (var i = 0; i < r.length; i++) e[o + i] ^= n.mul(t[o], r[i]);
        return e;
      }),
        (r.mod = function (t, r) {
          for (var e = new Uint8Array(t); e.length - r.length >= 0; ) {
            for (var o = e[0], i = 0; i < r.length; i++) e[i] ^= n.mul(r[i], o);
            for (var a = 0; a < e.length && 0 === e[a]; ) a++;
            e = e.slice(a);
          }
          return e;
        }),
        (r.generateECPolynomial = function (t) {
          for (var e = new Uint8Array([1]), o = 0; o < t; o++)
            e = r.mul(e, new Uint8Array([1, n.exp(o)]));
          return e;
        });
    },
    13667: function (t, r, e) {
      e(46798),
        e(9849),
        e(50289),
        e(94167),
        e(51358),
        e(24829),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330),
        e(17692),
        e(51467);
      var n = e(96445),
        o = e(7356),
        i = e(52163),
        a = e(73303),
        u = e(11829),
        s = e(64280),
        f = e(71819),
        c = e(32842),
        h = e(14179),
        g = e(95928),
        d = e(63468),
        l = e(62851),
        v = e(63250);
      function p(t, r, e) {
        var n,
          o,
          i = t.size,
          a = d.getEncodedBits(r, e);
        for (n = 0; n < 15; n++)
          (o = 1 == ((a >> n) & 1)),
            n < 6
              ? t.set(n, 8, o, !0)
              : n < 8
              ? t.set(n + 1, 8, o, !0)
              : t.set(i - 15 + n, 8, o, !0),
            n < 8
              ? t.set(8, i - n - 1, o, !0)
              : n < 9
              ? t.set(8, 15 - n - 1 + 1, o, !0)
              : t.set(8, 15 - n - 1, o, !0);
        t.set(i - 8, 8, 1, !0);
      }
      function w(t, r, e) {
        var o = new i();
        e.forEach(function (r) {
          o.put(r.mode.bit, 4),
            o.put(r.getLength(), l.getCharCountIndicator(r.mode, t)),
            r.write(o);
        });
        var a =
          8 * (n.getSymbolTotalCodewords(t) - c.getTotalCodewordsCount(t, r));
        for (
          o.getLengthInBits() + 4 <= a && o.put(0, 4);
          o.getLengthInBits() % 8 != 0;

        )
          o.putBit(0);
        for (var u = (a - o.getLengthInBits()) / 8, s = 0; s < u; s++)
          o.put(s % 2 ? 17 : 236, 8);
        return (function (t, r, e) {
          for (
            var o = n.getSymbolTotalCodewords(r),
              i = c.getTotalCodewordsCount(r, e),
              a = o - i,
              u = c.getBlocksCount(r, e),
              s = u - (o % u),
              f = Math.floor(o / u),
              g = Math.floor(a / u),
              d = g + 1,
              l = f - g,
              v = new h(l),
              p = 0,
              w = new Array(u),
              m = new Array(u),
              E = 0,
              y = new Uint8Array(t.buffer),
              A = 0;
            A < u;
            A++
          ) {
            var C = A < s ? g : d;
            (w[A] = y.slice(p, p + C)),
              (m[A] = v.encode(w[A])),
              (p += C),
              (E = Math.max(E, C));
          }
          var B,
            I,
            M = new Uint8Array(o),
            N = 0;
          for (B = 0; B < E; B++)
            for (I = 0; I < u; I++) B < w[I].length && (M[N++] = w[I][B]);
          for (B = 0; B < l; B++) for (I = 0; I < u; I++) M[N++] = m[I][B];
          return M;
        })(o, t, r);
      }
      function m(t, r, e, o) {
        var i;
        if (Array.isArray(t)) i = v.fromArray(t);
        else {
          if ("string" != typeof t) throw new Error("Invalid data");
          var c = r;
          if (!c) {
            var h = v.rawSplit(t);
            c = g.getBestVersionForData(h, e);
          }
          i = v.fromString(t, c || 40);
        }
        var d = g.getBestVersionForData(i, e);
        if (!d)
          throw new Error(
            "The amount of data is too big to be stored in a QR Code"
          );
        if (r) {
          if (r < d)
            throw new Error(
              "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " +
                d +
                ".\n"
            );
        } else r = d;
        var l = w(r, e, i),
          m = n.getSymbolSize(r),
          E = new a(m);
        return (
          (function (t, r) {
            for (
              var e = t.size, n = s.getPositions(r), o = 0;
              o < n.length;
              o++
            )
              for (var i = n[o][0], a = n[o][1], u = -1; u <= 7; u++)
                if (!(i + u <= -1 || e <= i + u))
                  for (var f = -1; f <= 7; f++)
                    a + f <= -1 ||
                      e <= a + f ||
                      ((u >= 0 && u <= 6 && (0 === f || 6 === f)) ||
                      (f >= 0 && f <= 6 && (0 === u || 6 === u)) ||
                      (u >= 2 && u <= 4 && f >= 2 && f <= 4)
                        ? t.set(i + u, a + f, !0, !0)
                        : t.set(i + u, a + f, !1, !0));
          })(E, r),
          (function (t) {
            for (var r = t.size, e = 8; e < r - 8; e++) {
              var n = e % 2 == 0;
              t.set(e, 6, n, !0), t.set(6, e, n, !0);
            }
          })(E),
          (function (t, r) {
            for (var e = u.getPositions(r), n = 0; n < e.length; n++)
              for (var o = e[n][0], i = e[n][1], a = -2; a <= 2; a++)
                for (var s = -2; s <= 2; s++)
                  -2 === a ||
                  2 === a ||
                  -2 === s ||
                  2 === s ||
                  (0 === a && 0 === s)
                    ? t.set(o + a, i + s, !0, !0)
                    : t.set(o + a, i + s, !1, !0);
          })(E, r),
          p(E, e, 0),
          r >= 7 &&
            (function (t, r) {
              for (
                var e, n, o, i = t.size, a = g.getEncodedBits(r), u = 0;
                u < 18;
                u++
              )
                (e = Math.floor(u / 3)),
                  (n = (u % 3) + i - 8 - 3),
                  (o = 1 == ((a >> u) & 1)),
                  t.set(e, n, o, !0),
                  t.set(n, e, o, !0);
            })(E, r),
          (function (t, r) {
            for (
              var e = t.size, n = -1, o = e - 1, i = 7, a = 0, u = e - 1;
              u > 0;
              u -= 2
            )
              for (6 === u && u--; ; ) {
                for (var s = 0; s < 2; s++)
                  if (!t.isReserved(o, u - s)) {
                    var f = !1;
                    a < r.length && (f = 1 == ((r[a] >>> i) & 1)),
                      t.set(o, u - s, f),
                      -1 == --i && (a++, (i = 7));
                  }
                if ((o += n) < 0 || e <= o) {
                  (o -= n), (n = -n);
                  break;
                }
              }
          })(E, l),
          isNaN(o) && (o = f.getBestMask(E, p.bind(null, E, e))),
          f.applyMask(o, E),
          p(E, e, o),
          {
            modules: E,
            version: r,
            errorCorrectionLevel: e,
            maskPattern: o,
            segments: i,
          }
        );
      }
      r.create = function (t, r) {
        if (void 0 === t || "" === t) throw new Error("No input text");
        var e,
          i,
          a = o.M;
        return (
          void 0 !== r &&
            ((a = o.from(r.errorCorrectionLevel, o.M)),
            (e = g.from(r.version)),
            (i = f.from(r.maskPattern)),
            r.toSJISFunc && n.setToSJISFunction(r.toSJISFunc)),
          m(t, e, a, i)
        );
      };
    },
    14179: function (t, r, e) {
      e(51467),
        e(51358),
        e(24829),
        e(46798),
        e(45165),
        e(83868),
        e(75544),
        e(33435),
        e(66657),
        e(53608),
        e(42313),
        e(48112),
        e(87323),
        e(39588),
        e(31871),
        e(87753),
        e(91843),
        e(9979),
        e(34497),
        e(39912),
        e(76751),
        e(44988),
        e(32369),
        e(39832),
        e(83327),
        e(47475),
        e(94010),
        e(64085),
        e(56399),
        e(16149),
        e(39891),
        e(20459),
        e(89664),
        e(92478),
        e(60731),
        e(51964),
        e(93330);
      var n = e(25876);
      function o(t) {
        (this.genPoly = void 0),
          (this.degree = t),
          this.degree && this.initialize(this.degree);
      }
      (o.prototype.initialize = function (t) {
        (this.degree = t), (this.genPoly = n.generateECPolynomial(this.degree));
      }),
        (o.prototype.encode = function (t) {
          if (!this.genPoly) throw new Error("Encoder not initialized");
          var r = new Uint8Array(t.length + this.degree);
          r.set(t);
          var e = n.mod(r, this.genPoly),
            o = this.degree - e.length;
          if (o > 0) {
            var i = new Uint8Array(this.degree);
            return i.set(e, o), i;
          }
          return e;
        }),
        (t.exports = o);
    },
    58836: function (t, r, e) {
      e(63789), e(24074), e(10999), e(52117), e(82479), e(94570), e(99397);
      var n = "[0-9]+",
        o =
          "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",
        i =
          "(?:(?![A-Z0-9 $%*+\\-./:]|" +
          (o = o.replace(/u/g, "\\u")) +
          ")(?:.|[\r\n]))+";
      (r.KANJI = new RegExp(o, "g")),
        (r.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g")),
        (r.BYTE = new RegExp(i, "g")),
        (r.NUMERIC = new RegExp(n, "g")),
        (r.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g"));
      var a = new RegExp("^" + o + "$"),
        u = new RegExp("^" + n + "$"),
        s = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      (r.testKanji = function (t) {
        return a.test(t);
      }),
        (r.testNumeric = function (t) {
          return u.test(t);
        }),
        (r.testAlphanumeric = function (t) {
          return s.test(t);
        });
    },
    63250: function (t, r, e) {
      e(63789),
        e(36513),
        e(97393),
        e(46349),
        e(70320),
        e(37313),
        e(34997),
        e(46798),
        e(9849),
        e(12148),
        e(51467),
        e(94570);
      var n = e(62851),
        o = e(64807),
        i = e(80121),
        a = e(44506),
        u = e(23466),
        s = e(58836),
        f = e(96445),
        c = e(68405);
      function h(t) {
        return unescape(encodeURIComponent(t)).length;
      }
      function g(t, r, e) {
        for (var n, o = []; null !== (n = t.exec(e)); )
          o.push({ data: n[0], index: n.index, mode: r, length: n[0].length });
        return o;
      }
      function d(t) {
        var r,
          e,
          o = g(s.NUMERIC, n.NUMERIC, t),
          i = g(s.ALPHANUMERIC, n.ALPHANUMERIC, t);
        return (
          f.isKanjiModeEnabled()
            ? ((r = g(s.BYTE, n.BYTE, t)), (e = g(s.KANJI, n.KANJI, t)))
            : ((r = g(s.BYTE_KANJI, n.BYTE, t)), (e = [])),
          o
            .concat(i, r, e)
            .sort(function (t, r) {
              return t.index - r.index;
            })
            .map(function (t) {
              return { data: t.data, mode: t.mode, length: t.length };
            })
        );
      }
      function l(t, r) {
        switch (r) {
          case n.NUMERIC:
            return o.getBitsLength(t);
          case n.ALPHANUMERIC:
            return i.getBitsLength(t);
          case n.KANJI:
            return u.getBitsLength(t);
          case n.BYTE:
            return a.getBitsLength(t);
        }
      }
      function v(t, r) {
        var e,
          s = n.getBestModeForData(t);
        if ((e = n.from(r, s)) !== n.BYTE && e.bit < s.bit)
          throw new Error(
            '"' +
              t +
              '" cannot be encoded with mode ' +
              n.toString(e) +
              ".\n Suggested mode is: " +
              n.toString(s)
          );
        switch ((e !== n.KANJI || f.isKanjiModeEnabled() || (e = n.BYTE), e)) {
          case n.NUMERIC:
            return new o(t);
          case n.ALPHANUMERIC:
            return new i(t);
          case n.KANJI:
            return new u(t);
          case n.BYTE:
            return new a(t);
        }
      }
      (r.fromArray = function (t) {
        return t.reduce(function (t, r) {
          return (
            "string" == typeof r
              ? t.push(v(r, null))
              : r.data && t.push(v(r.data, r.mode)),
            t
          );
        }, []);
      }),
        (r.fromString = function (t, e) {
          for (
            var o = (function (t) {
                for (var r = [], e = 0; e < t.length; e++) {
                  var o = t[e];
                  switch (o.mode) {
                    case n.NUMERIC:
                      r.push([
                        o,
                        {
                          data: o.data,
                          mode: n.ALPHANUMERIC,
                          length: o.length,
                        },
                        { data: o.data, mode: n.BYTE, length: o.length },
                      ]);
                      break;
                    case n.ALPHANUMERIC:
                      r.push([
                        o,
                        { data: o.data, mode: n.BYTE, length: o.length },
                      ]);
                      break;
                    case n.KANJI:
                      r.push([
                        o,
                        { data: o.data, mode: n.BYTE, length: h(o.data) },
                      ]);
                      break;
                    case n.BYTE:
                      r.push([
                        { data: o.data, mode: n.BYTE, length: h(o.data) },
                      ]);
                  }
                }
                return r;
              })(d(t, f.isKanjiModeEnabled())),
              i = (function (t, r) {
                for (
                  var e = {}, o = { start: {} }, i = ["start"], a = 0;
                  a < t.length;
                  a++
                ) {
                  for (var u = t[a], s = [], f = 0; f < u.length; f++) {
                    var c = u[f],
                      h = "" + a + f;
                    s.push(h), (e[h] = { node: c, lastCount: 0 }), (o[h] = {});
                    for (var g = 0; g < i.length; g++) {
                      var d = i[g];
                      e[d] && e[d].node.mode === c.mode
                        ? ((o[d][h] =
                            l(e[d].lastCount + c.length, c.mode) -
                            l(e[d].lastCount, c.mode)),
                          (e[d].lastCount += c.length))
                        : (e[d] && (e[d].lastCount = c.length),
                          (o[d][h] =
                            l(c.length, c.mode) +
                            4 +
                            n.getCharCountIndicator(c.mode, r)));
                    }
                  }
                  i = s;
                }
                for (var v = 0; v < i.length; v++) o[i[v]].end = 0;
                return { map: o, table: e };
              })(o, e),
              a = c.find_path(i.map, "start", "end"),
              u = [],
              s = 1;
            s < a.length - 1;
            s++
          )
            u.push(i.table[a[s]].node);
          return r.fromArray(
            (function (t) {
              return t.reduce(function (t, r) {
                var e = t.length - 1 >= 0 ? t[t.length - 1] : null;
                return e && e.mode === r.mode
                  ? ((t[t.length - 1].data += r.data), t)
                  : (t.push(r), t);
              }, []);
            })(u)
          );
        }),
        (r.rawSplit = function (t) {
          return r.fromArray(d(t, f.isKanjiModeEnabled()));
        });
    },
    96445: function (t, r, e) {
      var n;
      e(51467);
      var o = [
        0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581,
        655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828,
        1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532,
        3706,
      ];
      (r.getSymbolSize = function (t) {
        if (!t) throw new Error('"version" cannot be null or undefined');
        if (t < 1 || t > 40)
          throw new Error('"version" should be in range from 1 to 40');
        return 4 * t + 17;
      }),
        (r.getSymbolTotalCodewords = function (t) {
          return o[t];
        }),
        (r.getBCHDigit = function (t) {
          for (var r = 0; 0 !== t; ) r++, (t >>>= 1);
          return r;
        }),
        (r.setToSJISFunction = function (t) {
          if ("function" != typeof t)
            throw new Error('"toSJISFunc" is not a valid function.');
          n = t;
        }),
        (r.isKanjiModeEnabled = function () {
          return void 0 !== n;
        }),
        (r.toSJIS = function (t) {
          return n(t);
        });
    },
    42906: function (t, r) {
      r.isValid = function (t) {
        return !isNaN(t) && t >= 1 && t <= 40;
      };
    },
    95928: function (t, r, e) {
      e(46798), e(9849), e(50289), e(94167), e(27392), e(51467);
      var n = e(96445),
        o = e(32842),
        i = e(7356),
        a = e(62851),
        u = e(42906),
        s = n.getBCHDigit(7973);
      function f(t, r) {
        return a.getCharCountIndicator(t, r) + 4;
      }
      function c(t, r) {
        var e = 0;
        return (
          t.forEach(function (t) {
            var n = f(t.mode, r);
            e += n + t.getBitsLength();
          }),
          e
        );
      }
      (r.from = function (t, r) {
        return u.isValid(t) ? parseInt(t, 10) : r;
      }),
        (r.getCapacity = function (t, r, e) {
          if (!u.isValid(t)) throw new Error("Invalid QR Code version");
          void 0 === e && (e = a.BYTE);
          var i =
            8 * (n.getSymbolTotalCodewords(t) - o.getTotalCodewordsCount(t, r));
          if (e === a.MIXED) return i;
          var s = i - f(e, t);
          switch (e) {
            case a.NUMERIC:
              return Math.floor((s / 10) * 3);
            case a.ALPHANUMERIC:
              return Math.floor((s / 11) * 2);
            case a.KANJI:
              return Math.floor(s / 13);
            case a.BYTE:
            default:
              return Math.floor(s / 8);
          }
        }),
        (r.getBestVersionForData = function (t, e) {
          var n,
            o = i.from(e, i.M);
          if (Array.isArray(t)) {
            if (t.length > 1)
              return (function (t, e) {
                for (var n = 1; n <= 40; n++)
                  if (c(t, n) <= r.getCapacity(n, e, a.MIXED)) return n;
              })(t, o);
            if (0 === t.length) return 1;
            n = t[0];
          } else n = t;
          return (function (t, e, n) {
            for (var o = 1; o <= 40; o++)
              if (e <= r.getCapacity(o, n, t)) return o;
          })(n.mode, n.getLength(), o);
        }),
        (r.getEncodedBits = function (t) {
          if (!u.isValid(t) || t < 7)
            throw new Error("Invalid QR Code version");
          for (var r = t << 12; n.getBCHDigit(r) - s >= 0; )
            r ^= 7973 << (n.getBCHDigit(r) - s);
          return (t << 12) | r;
        });
    },
    73437: function (t, r, e) {
      e(51467);
      var n = e(25409);
      (r.render = function (t, r, e) {
        var o = e,
          i = r;
        void 0 !== o || (r && r.getContext) || ((o = r), (r = void 0)),
          r ||
            (i = (function () {
              try {
                return document.createElement("canvas");
              } catch (t) {
                throw new Error("You need to specify a canvas element");
              }
            })()),
          (o = n.getOptions(o));
        var a = n.getImageWidth(t.modules.size, o),
          u = i.getContext("2d"),
          s = u.createImageData(a, a);
        return (
          n.qrToImageData(s.data, t, o),
          (function (t, r, e) {
            t.clearRect(0, 0, r.width, r.height),
              r.style || (r.style = {}),
              (r.height = e),
              (r.width = e),
              (r.style.height = e + "px"),
              (r.style.width = e + "px");
          })(u, i, a),
          u.putImageData(s, 0, 0),
          i
        );
      }),
        (r.renderToDataURL = function (t, e, n) {
          var o = n;
          void 0 !== o || (e && e.getContext) || ((o = e), (e = void 0)),
            o || (o = {});
          var i = r.render(t, e, o),
            a = o.type || "image/png",
            u = o.rendererOpts || {};
          return i.toDataURL(a, u.quality);
        });
    },
    24205: function (t, r, e) {
      e(17692), e(5110);
      var n = e(25409);
      function o(t, r) {
        var e = t.a / 255,
          n = r + '="' + t.hex + '"';
        return e < 1
          ? n + " " + r + '-opacity="' + e.toFixed(2).slice(1) + '"'
          : n;
      }
      function i(t, r, e) {
        var n = t + r;
        return void 0 !== e && (n += " " + e), n;
      }
      r.render = function (t, r, e) {
        var a = n.getOptions(r),
          u = t.modules.size,
          s = t.modules.data,
          f = u + 2 * a.margin,
          c = a.color.light.a
            ? "<path " +
              o(a.color.light, "fill") +
              ' d="M0 0h' +
              f +
              "v" +
              f +
              'H0z"/>'
            : "",
          h =
            "<path " +
            o(a.color.dark, "stroke") +
            ' d="' +
            (function (t, r, e) {
              for (var n = "", o = 0, a = !1, u = 0, s = 0; s < t.length; s++) {
                var f = Math.floor(s % r),
                  c = Math.floor(s / r);
                f || a || (a = !0),
                  t[s]
                    ? (u++,
                      (s > 0 && f > 0 && t[s - 1]) ||
                        ((n += a ? i("M", f + e, 0.5 + c + e) : i("m", o, 0)),
                        (o = 0),
                        (a = !1)),
                      (f + 1 < r && t[s + 1]) || ((n += i("h", u)), (u = 0)))
                    : o++;
              }
              return n;
            })(s, u, a.margin) +
            '"/>',
          g = 'viewBox="0 0 ' + f + " " + f + '"',
          d =
            '<svg xmlns="http://www.w3.org/2000/svg" ' +
            (a.width
              ? 'width="' + a.width + '" height="' + a.width + '" '
              : "") +
            g +
            ' shape-rendering="crispEdges">' +
            c +
            h +
            "</svg>\n";
        return "function" == typeof e && e(null, d), d;
      };
    },
    25409: function (t, r, e) {
      function n(t) {
        if (("number" == typeof t && (t = t.toString()), "string" != typeof t))
          throw new Error("Color should be defined as hex string");
        var r = t.slice().replace("#", "").split("");
        if (r.length < 3 || 5 === r.length || r.length > 8)
          throw new Error("Invalid hex color: " + t);
        (3 !== r.length && 4 !== r.length) ||
          (r = Array.prototype.concat.apply(
            [],
            r.map(function (t) {
              return [t, t];
            })
          )),
          6 === r.length && r.push("F", "F");
        var e = parseInt(r.join(""), 16);
        return {
          r: (e >> 24) & 255,
          g: (e >> 16) & 255,
          b: (e >> 8) & 255,
          a: 255 & e,
          hex: "#" + r.slice(0, 6).join(""),
        };
      }
      e(46798),
        e(94570),
        e(51467),
        e(63789),
        e(24074),
        e(17692),
        e(97393),
        e(46349),
        e(70320),
        e(36513),
        e(27392),
        e(91989),
        (r.getOptions = function (t) {
          t || (t = {}), t.color || (t.color = {});
          var r =
              void 0 === t.margin || null === t.margin || t.margin < 0
                ? 4
                : t.margin,
            e = t.width && t.width >= 21 ? t.width : void 0,
            o = t.scale || 4;
          return {
            width: e,
            scale: e ? 4 : o,
            margin: r,
            color: {
              dark: n(t.color.dark || "#000000ff"),
              light: n(t.color.light || "#ffffffff"),
            },
            type: t.type,
            rendererOpts: t.rendererOpts || {},
          };
        }),
        (r.getScale = function (t, r) {
          return r.width && r.width >= t + 2 * r.margin
            ? r.width / (t + 2 * r.margin)
            : r.scale;
        }),
        (r.getImageWidth = function (t, e) {
          var n = r.getScale(t, e);
          return Math.floor((t + 2 * e.margin) * n);
        }),
        (r.qrToImageData = function (t, e, n) {
          for (
            var o = e.modules.size,
              i = e.modules.data,
              a = r.getScale(o, n),
              u = Math.floor((o + 2 * n.margin) * a),
              s = n.margin * a,
              f = [n.color.light, n.color.dark],
              c = 0;
            c < u;
            c++
          )
            for (var h = 0; h < u; h++) {
              var g = 4 * (c * u + h),
                d = n.color.light;
              if (c >= s && h >= s && c < u - s && h < u - s)
                d =
                  f[
                    i[Math.floor((c - s) / a) * o + Math.floor((h - s) / a)]
                      ? 1
                      : 0
                  ];
              (t[g++] = d.r), (t[g++] = d.g), (t[g++] = d.b), (t[g] = d.a);
            }
        });
    },
    93892: function (t, r, e) {
      "use strict";
      var n = e(97673),
        o = e(11336),
        i = e(43313),
        a = RangeError;
      t.exports = function (t) {
        var r = o(i(this)),
          e = "",
          u = n(t);
        if (u < 0 || u === 1 / 0) throw new a("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (r += r)) 1 & u && (e += r);
        return e;
      };
    },
    5110: function (t, r, e) {
      "use strict";
      var n = e(68077),
        o = e(55418),
        i = e(97673),
        a = e(29191),
        u = e(93892),
        s = e(18431),
        f = RangeError,
        c = String,
        h = Math.floor,
        g = o(u),
        d = o("".slice),
        l = o((1).toFixed),
        v = function (t, r, e) {
          return 0 === r
            ? e
            : r % 2 == 1
            ? v(t, r - 1, e * t)
            : v(t * t, r / 2, e);
        },
        p = function (t, r, e) {
          for (var n = -1, o = e; ++n < 6; )
            (o += r * t[n]), (t[n] = o % 1e7), (o = h(o / 1e7));
        },
        w = function (t, r) {
          for (var e = 6, n = 0; --e >= 0; )
            (n += t[e]), (t[e] = h(n / r)), (n = (n % r) * 1e7);
        },
        m = function (t) {
          for (var r = 6, e = ""; --r >= 0; )
            if ("" !== e || 0 === r || 0 !== t[r]) {
              var n = c(t[r]);
              e = "" === e ? n : e + g("0", 7 - n.length) + n;
            }
          return e;
        };
      n(
        {
          target: "Number",
          proto: !0,
          forced:
            s(function () {
              return (
                "0.000" !== l(8e-5, 3) ||
                "1" !== l(0.9, 0) ||
                "1.25" !== l(1.255, 2) ||
                "1000000000000000128" !== l(0xde0b6b3a7640080, 0)
              );
            }) ||
            !s(function () {
              l({});
            }),
        },
        {
          toFixed: function (t) {
            var r,
              e,
              n,
              o,
              u = a(this),
              s = i(t),
              h = [0, 0, 0, 0, 0, 0],
              l = "",
              E = "0";
            if (s < 0 || s > 20) throw new f("Incorrect fraction digits");
            if (u != u) return "NaN";
            if (u <= -1e21 || u >= 1e21) return c(u);
            if ((u < 0 && ((l = "-"), (u = -u)), u > 1e-21))
              if (
                ((e =
                  (r =
                    (function (t) {
                      for (var r = 0, e = t; e >= 4096; )
                        (r += 12), (e /= 4096);
                      for (; e >= 2; ) (r += 1), (e /= 2);
                      return r;
                    })(u * v(2, 69, 1)) - 69) < 0
                    ? u * v(2, -r, 1)
                    : u / v(2, r, 1)),
                (e *= 4503599627370496),
                (r = 52 - r) > 0)
              ) {
                for (p(h, 0, e), n = s; n >= 7; ) p(h, 1e7, 0), (n -= 7);
                for (p(h, v(10, n, 1), 0), n = r - 1; n >= 23; )
                  w(h, 1 << 23), (n -= 23);
                w(h, 1 << n), p(h, 1, 1), w(h, 2), (E = m(h));
              } else p(h, 0, e), p(h, 1 << -r, 0), (E = m(h) + g("0", s));
            return (E =
              s > 0
                ? l +
                  ((o = E.length) <= s
                    ? "0." + g("0", s - o) + E
                    : d(E, 0, o - s) + "." + d(E, o - s))
                : l + E);
          },
        }
      );
    },
    45165: function (t, r, e) {
      "use strict";
      e(78950)("Uint8", function (t) {
        return function (r, e, n) {
          return t(this, r, e, n);
        };
      });
    },
  },
]);
//# sourceMappingURL=1970.cfHHb3OquLA.js.map
