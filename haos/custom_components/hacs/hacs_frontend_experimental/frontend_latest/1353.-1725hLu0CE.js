/*! For license information please see 1353.-1725hLu0CE.js.LICENSE.txt */
export const id = 1353;
export const ids = [1353];
export const modules = {
  85217: (e, t, a) => {
    const n = Intl && Intl.DateTimeFormat,
      r = [38, 33, 36],
      i = [40, 34, 35],
      o = new Set([37, ...r]),
      s = new Set([39, ...i]),
      l = new Set([39, ...r]),
      d = new Set([37, ...i]),
      u = new Set([37, 39, ...r, ...i]);
    var c = a(43204),
      h = a(5095),
      f = a(95260),
      m = a(32982),
      p = a(16616),
      y = a(41005);
    const b = (e) => ((0, y.dZ)(e) ? e._$litType$.h : e.strings),
      g = (0, p.XM)(
        class extends p.Xe {
          constructor(e) {
            super(e), (this.tt = new WeakMap());
          }
          render(e) {
            return [e];
          }
          update(e, [t]) {
            const a = (0, y.hN)(this.et) ? b(this.et) : null,
              n = (0, y.hN)(t) ? b(t) : null;
            if (null !== a && (null === n || a !== n)) {
              const t = (0, y.i9)(e).pop();
              let n = this.tt.get(a);
              if (void 0 === n) {
                const e = document.createDocumentFragment();
                (n = (0, m.sY)(m.Ld, e)), n.setConnected(!1), this.tt.set(a, n);
              }
              (0, y.hl)(n, [t]), (0, y._Y)(n, void 0, t);
            }
            if (null !== n) {
              if (null === a || a !== n) {
                const t = this.tt.get(n);
                if (void 0 !== t) {
                  const a = (0, y.i9)(t).pop();
                  (0, y.E_)(e), (0, y._Y)(e, void 0, a), (0, y.hl)(e, [a]);
                }
              }
              this.et = t;
            } else this.et = void 0;
            return this.render(t);
          }
        }
      );
    var v = a(53180),
      w = a(99266);
    function _(e, t, a) {
      return new Date(Date.UTC(e, t, a));
    }
    const k = h.dy`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>`,
      D = h.dy`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>`,
      T = h.iv`button{-webkit-appearance:none;-moz-appearance:none;appearance:none;position:relative;display:block;margin:0;padding:0;background:0 0;color:inherit;border:none;font:inherit;text-align:left;text-transform:inherit;-webkit-tap-highlight-color:transparent}`,
      C =
        (h.iv`a{-webkit-tap-highlight-color:transparent;position:relative;display:inline-block;background:initial;color:inherit;font:inherit;text-transform:inherit;text-decoration:none;outline:0}a:focus,a:focus.page-selected{text-decoration:underline}`,
        h.iv`svg{display:block;min-width:var(--svg-icon-min-width,24px);min-height:var(--svg-icon-min-height,24px);fill:var(--svg-icon-fill,currentColor);pointer-events:none}`,
        h.iv`[hidden]{display:none!important}`,
        h.iv`:host{display:block}*{box-sizing:border-box}`);
    function x(e, t) {
      return +t - +e;
    }
    function S({
      hasAltKey: e,
      keyCode: t,
      focusedDate: a,
      selectedDate: n,
      disabledDaysSet: r,
      disabledDatesSet: i,
      minTime: u,
      maxTime: c,
    }) {
      const h = a.getUTCFullYear(),
        f = a.getUTCMonth(),
        m = a.getUTCDate(),
        p = +a,
        y = n.getUTCFullYear(),
        b = n.getUTCMonth();
      let g = h,
        v = f,
        w = m,
        k = !0;
      switch (
        ((b !== f || y !== h) &&
          ((g = y), (v = b), (w = 1), (k = 34 === t || 33 === t || 35 === t)),
        k)
      ) {
        case p === u && o.has(t):
        case p === c && s.has(t):
          break;
        case 38 === t:
          w -= 7;
          break;
        case 40 === t:
          w += 7;
          break;
        case 37 === t:
          w -= 1;
          break;
        case 39 === t:
          w += 1;
          break;
        case 34 === t:
          e ? (g += 1) : (v += 1);
          break;
        case 33 === t:
          e ? (g -= 1) : (v -= 1);
          break;
        case 35 === t:
          (v += 1), (w = 0);
          break;
        default:
          w = 1;
      }
      if (34 === t || 33 === t) {
        const e = _(g, v + 1, 0).getUTCDate();
        w > e && (w = e);
      }
      const D = (function ({
        keyCode: e,
        disabledDaysSet: t,
        disabledDatesSet: a,
        focusedDate: n,
        maxTime: r,
        minTime: i,
      }) {
        const o = +n;
        let s = o < i,
          u = o > r;
        if (x(i, r) < 864e5) return n;
        let c = s || u || t.has(n.getUTCDay()) || a.has(o);
        if (!c) return n;
        let h = 0,
          f = s === u ? n : new Date(s ? i - 864e5 : 864e5 + r);
        const m = f.getUTCFullYear(),
          p = f.getUTCMonth();
        let y = f.getUTCDate();
        for (; c; )
          (s || (!u && l.has(e))) && (y += 1),
            (u || (!s && d.has(e))) && (y -= 1),
            (f = _(m, p, y)),
            (h = +f),
            s ||
              ((s = h < i),
              s && ((f = new Date(i)), (h = +f), (y = f.getUTCDate()))),
            u ||
              ((u = h > r),
              u && ((f = new Date(r)), (h = +f), (y = f.getUTCDate()))),
            (c = t.has(f.getUTCDay()) || a.has(h));
        return f;
      })({
        keyCode: t,
        maxTime: c,
        minTime: u,
        disabledDaysSet: r,
        disabledDatesSet: i,
        focusedDate: _(g, v, w),
      });
      return D;
    }
    function M(e, t, a) {
      return e.dispatchEvent(
        new CustomEvent(t, { detail: a, bubbles: !0, composed: !0 })
      );
    }
    function U(e, t) {
      return e.composedPath().find((e) => e instanceof HTMLElement && t(e));
    }
    function W(e) {
      return (t) => e.format(t).replace(/\u200e/gi, "");
    }
    function F(e) {
      const t = n(e, {
          timeZone: "UTC",
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        a = n(e, { timeZone: "UTC", day: "numeric" }),
        r = n(e, {
          timeZone: "UTC",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        i = n(e, { timeZone: "UTC", year: "numeric", month: "long" }),
        o = n(e, { timeZone: "UTC", weekday: "long" }),
        s = n(e, { timeZone: "UTC", weekday: "narrow" }),
        l = n(e, { timeZone: "UTC", year: "numeric" });
      return {
        locale: e,
        dateFormat: W(t),
        dayFormat: W(a),
        fullDateFormat: W(r),
        longMonthYearFormat: W(i),
        longWeekdayFormat: W(o),
        narrowWeekdayFormat: W(s),
        yearFormat: W(l),
      };
    }
    function Y(e, t) {
      const a = (function (e, t) {
          const a = t.getUTCFullYear(),
            n = t.getUTCMonth(),
            r = t.getUTCDate(),
            i = t.getUTCDay();
          let o = i;
          return (
            "first-4-day-week" === e && (o = 3),
            "first-day-of-year" === e && (o = 6),
            "first-full-week" === e && (o = 0),
            _(a, n, r - i + o)
          );
        })(e, t),
        n = _(a.getUTCFullYear(), 0, 1),
        r = 1 + (+a - +n) / 864e5;
      return Math.ceil(r / 7);
    }
    function N(e) {
      if (e >= 0 && e < 7) return Math.abs(e);
      return ((e < 0 ? 7 * Math.ceil(Math.abs(e)) : 0) + e) % 7;
    }
    function P(e, t, a) {
      const n = N(e - t);
      return a ? 1 + n : n;
    }
    function E(e) {
      const {
          dayFormat: t,
          fullDateFormat: a,
          locale: n,
          longWeekdayFormat: r,
          narrowWeekdayFormat: i,
          selectedDate: o,
          disabledDates: s,
          disabledDays: l,
          firstDayOfWeek: d,
          max: u,
          min: c,
          showWeekNumber: h,
          weekLabel: f,
          weekNumberType: m,
        } = e,
        p = null == c ? Number.MIN_SAFE_INTEGER : +c,
        y = null == u ? Number.MAX_SAFE_INTEGER : +u,
        b = (function (e) {
          const {
              firstDayOfWeek: t = 0,
              showWeekNumber: a = !1,
              weekLabel: n,
              longWeekdayFormat: r,
              narrowWeekdayFormat: i,
            } = e || {},
            o = 1 + ((t + (t < 0 ? 7 : 0)) % 7),
            s = n || "Wk",
            l = a ? [{ label: "Wk" === s ? "Week" : s, value: s }] : [],
            d = Array.from(Array(7)).reduce((e, t, a) => {
              const n = _(2017, 0, o + a);
              return e.push({ label: r(n), value: i(n) }), e;
            }, l);
          return d;
        })({
          longWeekdayFormat: r,
          narrowWeekdayFormat: i,
          firstDayOfWeek: d,
          showWeekNumber: h,
          weekLabel: f,
        }),
        g = (e) =>
          [
            n,
            e.toJSON(),
            null == s ? void 0 : s.join("_"),
            null == l ? void 0 : l.join("_"),
            d,
            null == u ? void 0 : u.toJSON(),
            null == c ? void 0 : c.toJSON(),
            h,
            f,
            m,
          ]
            .filter(Boolean)
            .join(":"),
        v = o.getUTCFullYear(),
        w = o.getUTCMonth(),
        k = [-1, 0, 1].map((e) => {
          const r = _(v, w + e, 1),
            i = +_(v, w + e + 1, 0),
            o = g(r);
          if (i < p || +r > y)
            return {
              key: o,
              calendar: [],
              disabledDatesSet: new Set(),
              disabledDaysSet: new Set(),
            };
          const b = (function (e) {
            const {
                date: t,
                dayFormat: a,
                disabledDates: n = [],
                disabledDays: r = [],
                firstDayOfWeek: i = 0,
                fullDateFormat: o,
                locale: s = "en-US",
                max: l,
                min: d,
                showWeekNumber: u = !1,
                weekLabel: c = "Week",
                weekNumberType: h = "first-4-day-week",
              } = e || {},
              f = N(i),
              m = t.getUTCFullYear(),
              p = t.getUTCMonth(),
              y = _(m, p, 1),
              b = new Set(r.map((e) => P(e, f, u))),
              g = new Set(n.map((e) => +e)),
              v = [
                y.toJSON(),
                f,
                s,
                null == l ? "" : l.toJSON(),
                null == d ? "" : d.toJSON(),
                Array.from(b).join(","),
                Array.from(g).join(","),
                h,
              ]
                .filter(Boolean)
                .join(":"),
              w = P(y.getUTCDay(), f, u),
              k = null == d ? +new Date("2000-01-01") : +d,
              D = null == l ? +new Date("2100-12-31") : +l,
              T = u ? 8 : 7,
              C = _(m, 1 + p, 0).getUTCDate(),
              x = [];
            let S = [],
              M = !1,
              U = 1;
            for (const e of [0, 1, 2, 3, 4, 5]) {
              for (const t of [0, 1, 2, 3, 4, 5, 6].concat(
                7 === T ? [] : [7]
              )) {
                const n = t + e * T;
                if (!M && u && 0 === t) {
                  const t = Y(h, _(m, p, U - (e < 1 ? f : 0))),
                    a = `${c} ${t}`;
                  S.push({
                    fullDate: null,
                    label: a,
                    value: `${t}`,
                    key: `${v}:${a}`,
                    disabled: !0,
                  });
                  continue;
                }
                if (M || n < w) {
                  S.push({
                    fullDate: null,
                    label: "",
                    value: "",
                    key: `${v}:${n}`,
                    disabled: !0,
                  });
                  continue;
                }
                const r = _(m, p, U),
                  i = +r,
                  s = b.has(t) || g.has(i) || i < k || i > D;
                s && g.add(i),
                  S.push({
                    fullDate: r,
                    label: o(r),
                    value: a(r),
                    key: `${v}:${r.toJSON()}`,
                    disabled: s,
                  }),
                  (U += 1),
                  U > C && (M = !0);
              }
              x.push(S), (S = []);
            }
            return {
              disabledDatesSet: g,
              calendar: x,
              disabledDaysSet: new Set(r.map((e) => N(e))),
              key: v,
            };
          })({
            dayFormat: t,
            fullDateFormat: a,
            locale: n,
            disabledDates: s,
            disabledDays: l,
            firstDayOfWeek: d,
            max: u,
            min: c,
            showWeekNumber: h,
            weekLabel: f,
            weekNumberType: m,
            date: r,
          });
          return { ...b, key: o };
        }),
        D = [],
        T = new Set(),
        C = new Set();
      for (const e of k) {
        const { disabledDatesSet: t, disabledDaysSet: a, ...n } = e;
        if (n.calendar.length > 0) {
          if (a.size > 0) for (const e of a) C.add(e);
          if (t.size > 0) for (const e of t) T.add(e);
        }
        D.push(n);
      }
      return {
        calendars: D,
        weekdays: b,
        disabledDatesSet: T,
        disabledDaysSet: C,
        key: g(o),
      };
    }
    function $(e) {
      const t = null == e ? new Date() : new Date(e),
        a =
          "string" == typeof e &&
          (/^\d{4}-\d{2}-\d{2}$/i.test(e) ||
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+00:00|-00:00)$/i.test(
              e
            )),
        n = "number" == typeof e && e > 0 && isFinite(e);
      let r = t.getFullYear(),
        i = t.getMonth(),
        o = t.getDate();
      return (
        (a || n) &&
          ((r = t.getUTCFullYear()),
          (i = t.getUTCMonth()),
          (o = t.getUTCDate())),
        _(r, i, o)
      );
    }
    function L(e, t) {
      return e.classList.contains(t);
    }
    function O(e, t) {
      return !(null == e || !(t instanceof Date) || isNaN(+t));
    }
    function Z(e) {
      return e - Math.floor(e) > 0 ? +e.toFixed(3) : e;
    }
    function q(e) {
      return { passive: !0, handleEvent: e };
    }
    function A(e, t) {
      const a = "string" == typeof e && e.length > 0 ? e.split(/,\s*/i) : [];
      return a.length ? ("function" == typeof t ? a.map(t) : a) : [];
    }
    function j(e) {
      if (e instanceof Date && !isNaN(+e)) {
        const t = e.toJSON();
        return null == t ? "" : t.replace(/^(.+)T.+/i, "$1");
      }
      return "";
    }
    function z(e, t) {
      if (x(e, t) < 864e5) return [];
      const a = e.getUTCFullYear();
      return Array.from(Array(t.getUTCFullYear() - a + 1), (e, t) => t + a);
    }
    function V(e, t, a) {
      const n = "number" == typeof e ? e : +e,
        r = +t,
        i = +a;
      return n < r ? r : n > i ? i : e;
    }
    var H,
      X,
      B = a(82612);
    function R(e) {
      const { clientX: t, clientY: a, pageX: n, pageY: r } = e,
        i = Math.max(n, t),
        o = Math.max(r, a),
        s = e.identifier || e.pointerId;
      return { x: i, y: o, id: null == s ? 0 : s };
    }
    function I(e, t) {
      const a = t.changedTouches;
      if (null == a) return { newPointer: R(t), oldPointer: e };
      const n = Array.from(a, (e) => R(e));
      return {
        newPointer: null == e ? n[0] : n.find((t) => t.id === e.id),
        oldPointer: e,
      };
    }
    function G(e, t, a) {
      e.addEventListener(t, a, !!B.Vq && { passive: !0 });
    }
    class J {
      constructor(e, t) {
        (this._element = e), (this._startPointer = null);
        const { down: a, move: n, up: r } = t;
        (this._down = this._onDown(a)),
          (this._move = this._onMove(n)),
          (this._up = this._onUp(r)),
          e &&
            e.addEventListener &&
            (e.addEventListener("mousedown", this._down),
            G(e, "touchstart", this._down),
            G(e, "touchmove", this._move),
            G(e, "touchend", this._up));
      }
      disconnect() {
        const e = this._element;
        e &&
          e.removeEventListener &&
          (e.removeEventListener("mousedown", this._down),
          e.removeEventListener("touchstart", this._down),
          e.removeEventListener("touchmove", this._move),
          e.removeEventListener("touchend", this._up));
      }
      _onDown(e) {
        return (t) => {
          t instanceof MouseEvent &&
            (this._element.addEventListener("mousemove", this._move),
            this._element.addEventListener("mouseup", this._up),
            this._element.addEventListener("mouseleave", this._up));
          const { newPointer: a } = I(this._startPointer, t);
          e(a, t), (this._startPointer = a);
        };
      }
      _onMove(e) {
        return (t) => {
          this._updatePointers(e, t);
        };
      }
      _onUp(e) {
        return (t) => {
          this._updatePointers(e, t, !0);
        };
      }
      _updatePointers(e, t, a) {
        a &&
          t instanceof MouseEvent &&
          (this._element.removeEventListener("mousemove", this._move),
          this._element.removeEventListener("mouseup", this._up),
          this._element.removeEventListener("mouseleave", this._up));
        const { newPointer: n, oldPointer: r } = I(this._startPointer, t);
        e(n, r, t), (this._startPointer = a ? null : n);
      }
    }
    class Q extends h.oi {
      constructor() {
        super(),
          (this.firstDayOfWeek = 0),
          (this.showWeekNumber = !1),
          (this.weekNumberType = "first-4-day-week"),
          (this.landscape = !1),
          (this.locale =
            (n && n().resolvedOptions && n().resolvedOptions().locale) ||
            "en-US"),
          (this.disabledDays = ""),
          (this.disabledDates = ""),
          (this.weekLabel = "Wk"),
          (this.inline = !1),
          (this.dragRatio = 0.15),
          (this._hasMin = !1),
          (this._hasMax = !1),
          (this._disabledDaysSet = new Set()),
          (this._disabledDatesSet = new Set()),
          (this._dx = -1 / 0),
          (this._hasNativeWebAnimation = "animate" in HTMLElement.prototype),
          (this._updatingDateWithKey = !1);
        const e = $(),
          t = F(this.locale),
          a = j(e),
          r = $("2100-12-31");
        (this.value = a),
          (this.startView = "calendar"),
          (this._min = new Date(e)),
          (this._max = new Date(r)),
          (this._todayDate = e),
          (this._maxDate = r),
          (this._yearList = z(e, r)),
          (this._selectedDate = new Date(e)),
          (this._focusedDate = new Date(e)),
          (this._formatters = t);
      }
      get startView() {
        return this._startView;
      }
      set startView(e) {
        const t = e || "calendar";
        if ("calendar" !== t && "yearList" !== t) return;
        const a = this._startView;
        (this._startView = t), this.requestUpdate("startView", a);
      }
      get min() {
        return this._hasMin ? j(this._min) : "";
      }
      set min(e) {
        const t = $(e),
          a = O(e, t);
        (this._min = a ? t : this._todayDate),
          (this._hasMin = a),
          this.requestUpdate("min");
      }
      get max() {
        return this._hasMax ? j(this._max) : "";
      }
      set max(e) {
        const t = $(e),
          a = O(e, t);
        (this._max = a ? t : this._maxDate),
          (this._hasMax = a),
          this.requestUpdate("max");
      }
      get value() {
        return j(this._focusedDate);
      }
      set value(e) {
        const t = $(e),
          a = O(e, t) ? t : this._todayDate;
        (this._focusedDate = new Date(a)),
          (this._selectedDate = this._lastSelectedDate = new Date(a));
      }
      disconnectedCallback() {
        super.disconnectedCallback(),
          this._tracker &&
            (this._tracker.disconnect(), (this._tracker = void 0));
      }
      render() {
        this._formatters.locale !== this.locale &&
          (this._formatters = F(this.locale));
        const e =
            "yearList" === this._startView
              ? this._renderDatepickerYearList()
              : this._renderDatepickerCalendar(),
          t = this.inline
            ? null
            : h.dy`<div class="datepicker-header" part="header">${this._renderHeaderSelectorButton()}</div>`;
        return h.dy` ${t} <div class="datepicker-body" part="body">${g(
          e
        )}</div> `;
      }
      firstUpdated() {
        let e;
        (e =
          "calendar" === this._startView
            ? this.inline
              ? this.shadowRoot.querySelector(".btn__month-selector")
              : this._buttonSelectorYear
            : this._yearViewListItem),
          M(this, "datepicker-first-updated", {
            firstFocusableElement: e,
            value: this.value,
          });
      }
      async updated(e) {
        const t = this._startView;
        if (e.has("min") || e.has("max")) {
          (this._yearList = z(this._min, this._max)),
            "yearList" === t && this.requestUpdate();
          const e = +this._min,
            a = +this._max;
          if (x(e, a) > 864e5) {
            const t = +this._focusedDate;
            let n = t;
            t < e && (n = e), t > a && (n = a), (this.value = j(new Date(n)));
          }
        }
        if (e.has("_startView") || e.has("startView")) {
          if ("yearList" === t) {
            const e =
              48 *
              (this._selectedDate.getUTCFullYear() -
                this._min.getUTCFullYear() -
                2);
            !(function (e, t) {
              if (null == e.scrollTo) {
                const { top: a, left: n } = t || {};
                (e.scrollTop = a || 0), (e.scrollLeft = n || 0);
              } else e.scrollTo(t);
            })(this._yearViewFullList, { top: e, left: 0 });
          }
          if ("calendar" === t && null == this._tracker) {
            const e = this.calendarsContainer;
            let t = !1,
              a = !1,
              n = !1;
            if (e) {
              const r = {
                down: () => {
                  n || ((t = !0), (this._dx = 0));
                },
                move: (r, i) => {
                  if (n || !t) return;
                  const o = this._dx,
                    s =
                      (o < 0 && L(e, "has-max-date")) ||
                      (o > 0 && L(e, "has-min-date"));
                  !s &&
                    Math.abs(o) > 0 &&
                    t &&
                    ((a = !0), (e.style.transform = `translateX(${Z(o)}px)`)),
                    (this._dx = s ? 0 : o + (r.x - i.x));
                },
                up: async (r, i, o) => {
                  if (t && a) {
                    const r = this._dx,
                      i = e.getBoundingClientRect().width / 3,
                      o = Math.abs(r) > Number(this.dragRatio) * i,
                      s = 350,
                      l = "cubic-bezier(0, 0, .4, 1)",
                      d = o ? Z(i * (r < 0 ? -1 : 1)) : 0;
                    (n = !0),
                      await (async function (e, t) {
                        const {
                          hasNativeWebAnimation: a = !1,
                          keyframes: n = [],
                          options: r = { duration: 100 },
                        } = t || {};
                        if (Array.isArray(n) && n.length)
                          return new Promise((t) => {
                            if (a) e.animate(n, r).onfinish = () => t();
                            else {
                              const [, a] = n || [],
                                i = () => {
                                  e.removeEventListener("transitionend", i),
                                    t();
                                };
                              e.addEventListener("transitionend", i),
                                (e.style.transitionDuration = `${r.duration}ms`),
                                r.easing &&
                                  (e.style.transitionTimingFunction = r.easing),
                                Object.keys(a).forEach((t) => {
                                  t && (e.style[t] = a[t]);
                                });
                            }
                          });
                      })(e, {
                        hasNativeWebAnimation: this._hasNativeWebAnimation,
                        keyframes: [
                          { transform: `translateX(${r}px)` },
                          { transform: `translateX(${d}px)` },
                        ],
                        options: { duration: s, easing: l },
                      }),
                      o &&
                        this._updateMonth(
                          r < 0 ? "next" : "previous"
                        ).handleEvent(),
                      (t = a = n = !1),
                      (this._dx = -1 / 0),
                      e.removeAttribute("style"),
                      M(this, "datepicker-animation-finished");
                  } else
                    t &&
                      (this._updateFocusedDate(o),
                      (t = a = !1),
                      (this._dx = -1 / 0));
                },
              };
              this._tracker = new J(e, r);
            }
          }
          e.get("_startView") &&
            "calendar" === t &&
            this._focusElement('[part="year-selector"]');
        }
        this._updatingDateWithKey &&
          (this._focusElement(
            '[part="calendars"]:nth-of-type(2) .day--focused'
          ),
          (this._updatingDateWithKey = !1));
      }
      _focusElement(e) {
        const t = this.shadowRoot.querySelector(e);
        t && t.focus();
      }
      _renderHeaderSelectorButton() {
        const { yearFormat: e, dateFormat: t } = this._formatters,
          a = "calendar" === this.startView,
          n = this._focusedDate,
          r = t(n),
          i = e(n);
        return h.dy` <button class="${(0, v.$)({
          "btn__year-selector": !0,
          selected: !a,
        })}" type="button" part="year-selector" data-view="${"yearList"}" @click="${this._updateView(
          "yearList"
        )}">${i}</button> <div class="datepicker-toolbar" part="toolbar"> <button class="${(0,
        v.$)({
          "btn__calendar-selector": !0,
          selected: a,
        })}" type="button" part="calendar-selector" data-view="${"calendar"}" @click="${this._updateView(
          "calendar"
        )}">${r}</button> </div> `;
      }
      _renderDatepickerYearList() {
        const { yearFormat: e } = this._formatters,
          t = this._focusedDate.getUTCFullYear();
        return h.dy` <div class="datepicker-body__year-list-view" part="year-list-view"> <div class="year-list-view__full-list" part="year-list" @click="${
          this._updateYear
        }"> ${this._yearList.map(
          (a) =>
            h.dy`<button class="${(0, v.$)({
              "year-list-view__list-item": !0,
              "year--selected": t === a,
            })}" type="button" part="year" .year="${a}">${e(
              _(a, 0, 1)
            )}</button>`
        )}</div> </div> `;
      }
      _renderDatepickerCalendar() {
        const {
            longMonthYearFormat: e,
            dayFormat: t,
            fullDateFormat: a,
            longWeekdayFormat: n,
            narrowWeekdayFormat: r,
          } = this._formatters,
          i = A(this.disabledDays, Number),
          o = A(this.disabledDates, $),
          s = this.showWeekNumber,
          l = this._focusedDate,
          d = this.firstDayOfWeek,
          u = $(),
          c = this._selectedDate,
          f = this._max,
          m = this._min,
          {
            calendars: p,
            disabledDaysSet: y,
            disabledDatesSet: b,
            weekdays: g,
          } = E({
            dayFormat: t,
            fullDateFormat: a,
            longWeekdayFormat: n,
            narrowWeekdayFormat: r,
            firstDayOfWeek: d,
            disabledDays: i,
            disabledDates: o,
            locale: this.locale,
            selectedDate: c,
            showWeekNumber: this.showWeekNumber,
            weekNumberType: this.weekNumberType,
            max: f,
            min: m,
            weekLabel: this.weekLabel,
          }),
          _ = !p[0].calendar.length,
          T = !p[2].calendar.length,
          C = g.map(
            (e) =>
              h.dy`<th class="calendar-weekday" part="calendar-weekday" role="columnheader" aria-label="${e.label}"> <div class="weekday" part="weekday">${e.value}</div> </th>`
          ),
          x = (0, w.r)(
            p,
            (e) => e.key,
            ({ calendar: t }, a) => {
              if (!t.length)
                return h.dy`<div class="calendar-container" part="calendar"></div>`;
              const n = `calendarcaption${a}`,
                r = t[1][1].fullDate,
                i = 1 === a,
                o =
                  i && !this._isInVisibleMonth(l, c)
                    ? S({
                        disabledDaysSet: y,
                        disabledDatesSet: b,
                        hasAltKey: !1,
                        keyCode: 36,
                        focusedDate: l,
                        selectedDate: c,
                        minTime: +m,
                        maxTime: +f,
                      })
                    : l;
              return h.dy` <div class="calendar-container" part="calendar"> <table class="calendar-table" part="table" role="grid" aria-labelledby="${n}"> <caption id="${n}"> <div class="calendar-label" part="label">${
                r ? e(r) : ""
              }</div> </caption> <thead role="rowgroup"> <tr class="calendar-weekdays" part="weekdays" role="row">${C}</tr> </thead> <tbody role="rowgroup">${t.map(
                (e) =>
                  h.dy`<tr role="row">${e.map((e, t) => {
                    const { disabled: a, fullDate: n, label: r, value: d } = e;
                    if (!n && d && s && t < 1)
                      return h.dy`<th class="full-calendar__day weekday-label" part="calendar-day" scope="row" role="rowheader" abbr="${r}" aria-label="${r}">${d}</th>`;
                    if (!d || !n)
                      return h.dy`<td class="full-calendar__day day--empty" part="calendar-day"></td>`;
                    const c = +new Date(n),
                      f = +l === c,
                      m = i && o.getUTCDate() === Number(d);
                    return h.dy` <td tabindex="${m ? "0" : "-1"}" class="${(0,
                    v.$)({
                      "full-calendar__day": !0,
                      "day--disabled": a,
                      "day--today": +u === c,
                      "day--focused": !a && f,
                    })}" part="calendar-day${
                      +u === c ? " calendar-today" : ""
                    }" role="gridcell" aria-disabled="${
                      a ? "true" : "false"
                    }" aria-label="${r}" aria-selected="${
                      f ? "true" : "false"
                    }" .fullDate="${n}" .day="${d}"> <div class="calendar-day" part="day${
                      +u === c ? " today" : ""
                    }">${d}</div> </td> `;
                  })}</tr>`
              )}</tbody> </table> </div> `;
            }
          );
        return (
          (this._disabledDatesSet = b),
          (this._disabledDaysSet = y),
          h.dy` <div class="datepicker-body__calendar-view" part="calendar-view"> <div class="calendar-view__month-selector" part="month-selectors"> <div class="month-selector-container">${
            _
              ? null
              : h.dy` <button class="btn__month-selector" type="button" part="month-selector" aria-label="Previous month" @click="${this._updateMonth(
                  "previous"
                )}">${k}</button> `
          }</div> <div class="month-selector-container">${
            T
              ? null
              : h.dy` <button class="btn__month-selector" type="button" part="month-selector" aria-label="Next month" @click="${this._updateMonth(
                  "next"
                )}">${D}</button> `
          }</div> </div> <div class="${(0, v.$)({
            "calendars-container": !0,
            "has-min-date": _,
            "has-max-date": T,
          })}" part="calendars" @keyup="${
            this._updateFocusedDateWithKeyboard
          }">${x}</div> </div> `
        );
      }
      _updateView(e) {
        return q(() => {
          "calendar" === e &&
            (this._selectedDate = this._lastSelectedDate =
              new Date(V(this._focusedDate, this._min, this._max))),
            (this._startView = e);
        });
      }
      _updateMonth(e) {
        return q(() => {
          if (null == this.calendarsContainer) return this.updateComplete;
          const t = this._lastSelectedDate || this._selectedDate,
            a = this._min,
            n = this._max,
            r = "previous" === e,
            i = _(t.getUTCFullYear(), t.getUTCMonth() + (r ? -1 : 1), 1),
            o = i.getUTCFullYear(),
            s = i.getUTCMonth(),
            l = a.getUTCFullYear(),
            d = a.getUTCMonth(),
            u = n.getUTCFullYear(),
            c = n.getUTCMonth();
          return (
            o < l ||
              (o <= l && s < d) ||
              o > u ||
              (o >= u && s > c) ||
              ((this._lastSelectedDate = i),
              (this._selectedDate = this._lastSelectedDate)),
            this.updateComplete
          );
        });
      }
      _updateYear(e) {
        const t = U(e, (e) => L(e, "year-list-view__list-item"));
        if (null == t) return;
        const a = V(
          new Date(this._focusedDate).setUTCFullYear(+t.year),
          this._min,
          this._max
        );
        (this._selectedDate = this._lastSelectedDate = new Date(a)),
          (this._focusedDate = new Date(a)),
          (this._startView = "calendar");
      }
      _updateFocusedDate(e) {
        const t = U(e, (e) => L(e, "full-calendar__day"));
        null == t ||
          ["day--empty", "day--disabled", "day--focused", "weekday-label"].some(
            (e) => L(t, e)
          ) ||
          ((this._focusedDate = new Date(t.fullDate)),
          M(this, "datepicker-value-updated", {
            isKeypress: !1,
            value: this.value,
          }));
      }
      _updateFocusedDateWithKeyboard(e) {
        const t = e.keyCode;
        if (13 === t || 32 === t)
          return (
            M(this, "datepicker-value-updated", {
              keyCode: t,
              isKeypress: !0,
              value: this.value,
            }),
            void (this._focusedDate = new Date(this._selectedDate))
          );
        if (9 === t || !u.has(t)) return;
        const a = this._selectedDate,
          n = S({
            keyCode: t,
            selectedDate: a,
            disabledDatesSet: this._disabledDatesSet,
            disabledDaysSet: this._disabledDaysSet,
            focusedDate: this._focusedDate,
            hasAltKey: e.altKey,
            maxTime: +this._max,
            minTime: +this._min,
          });
        this._isInVisibleMonth(n, a) ||
          (this._selectedDate = this._lastSelectedDate = n),
          (this._focusedDate = n),
          (this._updatingDateWithKey = !0),
          M(this, "datepicker-value-updated", {
            keyCode: t,
            isKeypress: !0,
            value: this.value,
          });
      }
      _isInVisibleMonth(e, t) {
        const a = e.getUTCFullYear(),
          n = e.getUTCMonth(),
          r = t.getUTCFullYear(),
          i = t.getUTCMonth();
        return a === r && n === i;
      }
      get calendarsContainer() {
        return this.shadowRoot.querySelector(".calendars-container");
      }
    }
    (Q.styles = [
      C,
      T,
      h.iv`:host{width:312px;background-color:var(--app-datepicker-bg-color,#fff);color:var(--app-datepicker-color,#000);border-radius:var(--app-datepicker-border-top-left-radius,0) var(--app-datepicker-border-top-right-radius,0) var(--app-datepicker-border-bottom-right-radius,0) var(--app-datepicker-border-bottom-left-radius,0);contain:content;overflow:hidden}:host([landscape]){display:flex;min-width:calc(568px - 16px * 2);width:calc(568px - 16px * 2)}.datepicker-header+.datepicker-body{border-top:1px solid var(--app-datepicker-separator-color,#ddd)}:host([landscape])>.datepicker-header+.datepicker-body{border-top:none;border-left:1px solid var(--app-datepicker-separator-color,#ddd)}.datepicker-header{display:flex;flex-direction:column;align-items:flex-start;position:relative;padding:16px 24px}:host([landscape])>.datepicker-header{min-width:calc(14ch + 24px * 2)}.btn__calendar-selector,.btn__year-selector{color:var(--app-datepicker-selector-color,rgba(0,0,0,.55));cursor:pointer}.btn__calendar-selector.selected,.btn__year-selector.selected{color:currentColor}.datepicker-toolbar{width:100%}.btn__year-selector{font-size:16px;font-weight:700}.btn__calendar-selector{font-size:36px;font-weight:700;line-height:1}.datepicker-body{position:relative;width:100%;overflow:hidden}.datepicker-body__calendar-view{min-height:56px}.calendar-view__month-selector{display:flex;align-items:center;position:absolute;top:0;left:0;width:100%;padding:0 8px;z-index:1}.month-selector-container{max-height:56px;height:100%}.month-selector-container+.month-selector-container{margin:0 0 0 auto}.btn__month-selector{padding:calc((56px - 24px)/ 2);line-height:0}.btn__month-selector>svg{fill:currentColor}.calendars-container{display:flex;justify-content:center;position:relative;top:0;left:calc(-100%);width:calc(100% * 3);transform:translateZ(0);will-change:transform;touch-action:pan-y}.year-list-view__full-list{max-height:calc(48px * 7);overflow-y:auto;scrollbar-color:var(--app-datepicker-scrollbar-thumb-bg-color,rgba(0,0,0,.35)) rgba(0,0,0,0);scrollbar-width:thin}.year-list-view__full-list::-webkit-scrollbar{width:8px;background-color:rgba(0,0,0,0)}.year-list-view__full-list::-webkit-scrollbar-thumb{background-color:var(--app-datepicker-scrollbar-thumb-bg-color,rgba(0,0,0,.35));border-radius:50px}.year-list-view__full-list::-webkit-scrollbar-thumb:hover{background-color:var(--app-datepicker-scrollbar-thumb-hover-bg-color,rgba(0,0,0,.5))}.calendar-weekdays>th,.weekday-label{color:var(--app-datepicker-weekday-color,rgba(0,0,0,.55));font-weight:400;transform:translateZ(0);will-change:transform}.calendar-container,.calendar-label,.calendar-table{width:100%}.calendar-container{position:relative;padding:0 16px 16px}.calendar-table{-moz-user-select:none;-webkit-user-select:none;user-select:none;border-collapse:collapse;border-spacing:0;text-align:center}.calendar-label{display:flex;align-items:center;justify-content:center;height:56px;font-weight:500;text-align:center}.calendar-weekday,.full-calendar__day{position:relative;width:calc(100% / 7);height:0;padding:calc(100% / 7 / 2) 0;outline:0;text-align:center}.full-calendar__day:not(.day--disabled):focus{outline:#000 dotted 1px;outline:-webkit-focus-ring-color auto 1px}:host([showweeknumber]) .calendar-weekday,:host([showweeknumber]) .full-calendar__day{width:calc(100% / 8);padding-top:calc(100% / 8);padding-bottom:0}:host([showweeknumber]) th.weekday-label{padding:0}.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label){transform:translateZ(0);will-change:transform}.full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after,.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label).day--focused::after{content:'';display:block;position:absolute;top:0;left:0;width:100%;height:100%;background-color:var(--app-datepicker-accent-color,#1a73e8);border-radius:50%;opacity:0;pointer-events:none}.full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label){cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent}.full-calendar__day.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after,.full-calendar__day.day--today.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after{opacity:1}.calendar-weekday>.weekday,.full-calendar__day>.calendar-day{display:flex;align-items:center;justify-content:center;position:absolute;top:5%;left:5%;width:90%;height:90%;color:currentColor;font-size:14px;pointer-events:none;z-index:1}.full-calendar__day.day--today{color:var(--app-datepicker-accent-color,#1a73e8)}.full-calendar__day.day--focused,.full-calendar__day.day--today.day--focused{color:var(--app-datepicker-focused-day-color,#fff)}.full-calendar__day.day--disabled>.calendar-day,.full-calendar__day.day--empty,.full-calendar__day.weekday-label{pointer-events:none}.full-calendar__day.day--disabled:not(.day--today){color:var(--app-datepicker-disabled-day-color,rgba(0,0,0,.55))}.year-list-view__list-item{position:relative;width:100%;padding:12px 16px;text-align:center}.year-list-view__list-item::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:var(--app-datepicker-focused-year-bg-color,#000);opacity:0;pointer-events:none}.year-list-view__list-item:focus::after{opacity:.05}.year-list-view__list-item.year--selected{color:var(--app-datepicker-accent-color,#1a73e8);font-size:24px;font-weight:500}@media (any-hover:hover){.btn__month-selector:hover,.year-list-view__list-item:hover{cursor:pointer}.full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after{opacity:.15}.year-list-view__list-item:hover::after{opacity:.05}}@supports (background:-webkit-canvas(squares)){.calendar-container{padding:56px 16px 16px}table>caption{position:absolute;top:0;left:50%;transform:translate3d(-50%,0,0);will-change:transform}}`,
    ]),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Number, reflect: !0 })],
        Q.prototype,
        "firstDayOfWeek",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Boolean, reflect: !0 })],
        Q.prototype,
        "showWeekNumber",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String, reflect: !0 })],
        Q.prototype,
        "weekNumberType",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Boolean, reflect: !0 })],
        Q.prototype,
        "landscape",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String, reflect: !0 })],
        Q.prototype,
        "startView",
        null
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String, reflect: !0 })],
        Q.prototype,
        "min",
        null
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String, reflect: !0 })],
        Q.prototype,
        "max",
        null
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String })],
        Q.prototype,
        "value",
        null
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String })],
        Q.prototype,
        "locale",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String })],
        Q.prototype,
        "disabledDays",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String })],
        Q.prototype,
        "disabledDates",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String })],
        Q.prototype,
        "weekLabel",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Boolean })],
        Q.prototype,
        "inline",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Number })],
        Q.prototype,
        "dragRatio",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Date, attribute: !1 })],
        Q.prototype,
        "_selectedDate",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: Date, attribute: !1 })],
        Q.prototype,
        "_focusedDate",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.Cb)({ type: String, attribute: !1 })],
        Q.prototype,
        "_startView",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.IO)(".year-list-view__full-list")],
        Q.prototype,
        "_yearViewFullList",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.IO)(".btn__year-selector")],
        Q.prototype,
        "_buttonSelectorYear",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.IO)(".year-list-view__list-item")],
        Q.prototype,
        "_yearViewListItem",
        void 0
      ),
      (0, c.__decorate)(
        [(0, f.hO)({ passive: !0 })],
        Q.prototype,
        "_updateYear",
        null
      ),
      (0, c.__decorate)(
        [(0, f.hO)({ passive: !0 })],
        Q.prototype,
        "_updateFocusedDateWithKeyboard",
        null
      ),
      (H = "app-datepicker"),
      (X = Q),
      window.customElements &&
        !window.customElements.get(H) &&
        window.customElements.define(H, X);
  },
  55020: (e, t, a) => {
    a.d(t, { j: () => r });
    var n = {};
    function r() {
      return n;
    }
  },
  5763: (e, t, a) => {
    function n(e) {
      var t = new Date(
        Date.UTC(
          e.getFullYear(),
          e.getMonth(),
          e.getDate(),
          e.getHours(),
          e.getMinutes(),
          e.getSeconds(),
          e.getMilliseconds()
        )
      );
      return t.setUTCFullYear(e.getFullYear()), e.getTime() - t.getTime();
    }
    a.d(t, { Z: () => n });
  },
  23682: (e, t, a) => {
    function n(e, t) {
      if (t.length < e)
        throw new TypeError(
          e +
            " argument" +
            (e > 1 ? "s" : "") +
            " required, but only " +
            t.length +
            " present"
        );
    }
    a.d(t, { Z: () => n });
  },
  90394: (e, t, a) => {
    function n(e) {
      if (null === e || !0 === e || !1 === e) return NaN;
      var t = Number(e);
      return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
    }
    a.d(t, { Z: () => n });
  },
  93432: (e, t, a) => {
    a.d(t, { Z: () => J });
    var n = a(56956),
      r = a(23682);
    var i = a(34327);
    function o(e) {
      if (
        ((0, r.Z)(1, arguments),
        !(function (e) {
          return (
            (0, r.Z)(1, arguments),
            e instanceof Date ||
              ("object" === (0, n.Z)(e) &&
                "[object Date]" === Object.prototype.toString.call(e))
          );
        })(e) && "number" != typeof e)
      )
        return !1;
      var t = (0, i.Z)(e);
      return !isNaN(Number(t));
    }
    var s = a(90394);
    function l(e, t) {
      return (
        (0, r.Z)(2, arguments),
        (function (e, t) {
          (0, r.Z)(2, arguments);
          var a = (0, i.Z)(e).getTime(),
            n = (0, s.Z)(t);
          return new Date(a + n);
        })(e, -(0, s.Z)(t))
      );
    }
    function d(e) {
      (0, r.Z)(1, arguments);
      var t = (0, i.Z)(e),
        a = t.getUTCDay(),
        n = (a < 1 ? 7 : 0) + a - 1;
      return t.setUTCDate(t.getUTCDate() - n), t.setUTCHours(0, 0, 0, 0), t;
    }
    function u(e) {
      (0, r.Z)(1, arguments);
      var t = (0, i.Z)(e),
        a = t.getUTCFullYear(),
        n = new Date(0);
      n.setUTCFullYear(a + 1, 0, 4), n.setUTCHours(0, 0, 0, 0);
      var o = d(n),
        s = new Date(0);
      s.setUTCFullYear(a, 0, 4), s.setUTCHours(0, 0, 0, 0);
      var l = d(s);
      return t.getTime() >= o.getTime()
        ? a + 1
        : t.getTime() >= l.getTime()
        ? a
        : a - 1;
    }
    function c(e) {
      (0, r.Z)(1, arguments);
      var t = (0, i.Z)(e),
        a =
          d(t).getTime() -
          (function (e) {
            (0, r.Z)(1, arguments);
            var t = u(e),
              a = new Date(0);
            return a.setUTCFullYear(t, 0, 4), a.setUTCHours(0, 0, 0, 0), d(a);
          })(t).getTime();
      return Math.round(a / 6048e5) + 1;
    }
    var h = a(55020);
    function f(e, t) {
      var a, n, o, l, d, u, c, f;
      (0, r.Z)(1, arguments);
      var m = (0, h.j)(),
        p = (0, s.Z)(
          null !==
            (a =
              null !==
                (n =
                  null !==
                    (o =
                      null !== (l = null == t ? void 0 : t.weekStartsOn) &&
                      void 0 !== l
                        ? l
                        : null == t ||
                          null === (d = t.locale) ||
                          void 0 === d ||
                          null === (u = d.options) ||
                          void 0 === u
                        ? void 0
                        : u.weekStartsOn) && void 0 !== o
                    ? o
                    : m.weekStartsOn) && void 0 !== n
                ? n
                : null === (c = m.locale) ||
                  void 0 === c ||
                  null === (f = c.options) ||
                  void 0 === f
                ? void 0
                : f.weekStartsOn) && void 0 !== a
            ? a
            : 0
        );
      if (!(p >= 0 && p <= 6))
        throw new RangeError(
          "weekStartsOn must be between 0 and 6 inclusively"
        );
      var y = (0, i.Z)(e),
        b = y.getUTCDay(),
        g = (b < p ? 7 : 0) + b - p;
      return y.setUTCDate(y.getUTCDate() - g), y.setUTCHours(0, 0, 0, 0), y;
    }
    function m(e, t) {
      var a, n, o, l, d, u, c, m;
      (0, r.Z)(1, arguments);
      var p = (0, i.Z)(e),
        y = p.getUTCFullYear(),
        b = (0, h.j)(),
        g = (0, s.Z)(
          null !==
            (a =
              null !==
                (n =
                  null !==
                    (o =
                      null !==
                        (l = null == t ? void 0 : t.firstWeekContainsDate) &&
                      void 0 !== l
                        ? l
                        : null == t ||
                          null === (d = t.locale) ||
                          void 0 === d ||
                          null === (u = d.options) ||
                          void 0 === u
                        ? void 0
                        : u.firstWeekContainsDate) && void 0 !== o
                    ? o
                    : b.firstWeekContainsDate) && void 0 !== n
                ? n
                : null === (c = b.locale) ||
                  void 0 === c ||
                  null === (m = c.options) ||
                  void 0 === m
                ? void 0
                : m.firstWeekContainsDate) && void 0 !== a
            ? a
            : 1
        );
      if (!(g >= 1 && g <= 7))
        throw new RangeError(
          "firstWeekContainsDate must be between 1 and 7 inclusively"
        );
      var v = new Date(0);
      v.setUTCFullYear(y + 1, 0, g), v.setUTCHours(0, 0, 0, 0);
      var w = f(v, t),
        _ = new Date(0);
      _.setUTCFullYear(y, 0, g), _.setUTCHours(0, 0, 0, 0);
      var k = f(_, t);
      return p.getTime() >= w.getTime()
        ? y + 1
        : p.getTime() >= k.getTime()
        ? y
        : y - 1;
    }
    function p(e, t) {
      (0, r.Z)(1, arguments);
      var a = (0, i.Z)(e),
        n =
          f(a, t).getTime() -
          (function (e, t) {
            var a, n, i, o, l, d, u, c;
            (0, r.Z)(1, arguments);
            var p = (0, h.j)(),
              y = (0, s.Z)(
                null !==
                  (a =
                    null !==
                      (n =
                        null !==
                          (i =
                            null !==
                              (o =
                                null == t ? void 0 : t.firstWeekContainsDate) &&
                            void 0 !== o
                              ? o
                              : null == t ||
                                null === (l = t.locale) ||
                                void 0 === l ||
                                null === (d = l.options) ||
                                void 0 === d
                              ? void 0
                              : d.firstWeekContainsDate) && void 0 !== i
                          ? i
                          : p.firstWeekContainsDate) && void 0 !== n
                      ? n
                      : null === (u = p.locale) ||
                        void 0 === u ||
                        null === (c = u.options) ||
                        void 0 === c
                      ? void 0
                      : c.firstWeekContainsDate) && void 0 !== a
                  ? a
                  : 1
              ),
              b = m(e, t),
              g = new Date(0);
            return (
              g.setUTCFullYear(b, 0, y), g.setUTCHours(0, 0, 0, 0), f(g, t)
            );
          })(a, t).getTime();
      return Math.round(n / 6048e5) + 1;
    }
    function y(e, t) {
      for (var a = e < 0 ? "-" : "", n = Math.abs(e).toString(); n.length < t; )
        n = "0" + n;
      return a + n;
    }
    const b = {
      y: function (e, t) {
        var a = e.getUTCFullYear(),
          n = a > 0 ? a : 1 - a;
        return y("yy" === t ? n % 100 : n, t.length);
      },
      M: function (e, t) {
        var a = e.getUTCMonth();
        return "M" === t ? String(a + 1) : y(a + 1, 2);
      },
      d: function (e, t) {
        return y(e.getUTCDate(), t.length);
      },
      a: function (e, t) {
        var a = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
        switch (t) {
          case "a":
          case "aa":
            return a.toUpperCase();
          case "aaa":
            return a;
          case "aaaaa":
            return a[0];
          default:
            return "am" === a ? "a.m." : "p.m.";
        }
      },
      h: function (e, t) {
        return y(e.getUTCHours() % 12 || 12, t.length);
      },
      H: function (e, t) {
        return y(e.getUTCHours(), t.length);
      },
      m: function (e, t) {
        return y(e.getUTCMinutes(), t.length);
      },
      s: function (e, t) {
        return y(e.getUTCSeconds(), t.length);
      },
      S: function (e, t) {
        var a = t.length,
          n = e.getUTCMilliseconds();
        return y(Math.floor(n * Math.pow(10, a - 3)), t.length);
      },
    };
    var g = "midnight",
      v = "noon",
      w = "morning",
      _ = "afternoon",
      k = "evening",
      D = "night",
      T = {
        G: function (e, t, a) {
          var n = e.getUTCFullYear() > 0 ? 1 : 0;
          switch (t) {
            case "G":
            case "GG":
            case "GGG":
              return a.era(n, { width: "abbreviated" });
            case "GGGGG":
              return a.era(n, { width: "narrow" });
            default:
              return a.era(n, { width: "wide" });
          }
        },
        y: function (e, t, a) {
          if ("yo" === t) {
            var n = e.getUTCFullYear(),
              r = n > 0 ? n : 1 - n;
            return a.ordinalNumber(r, { unit: "year" });
          }
          return b.y(e, t);
        },
        Y: function (e, t, a, n) {
          var r = m(e, n),
            i = r > 0 ? r : 1 - r;
          return "YY" === t
            ? y(i % 100, 2)
            : "Yo" === t
            ? a.ordinalNumber(i, { unit: "year" })
            : y(i, t.length);
        },
        R: function (e, t) {
          return y(u(e), t.length);
        },
        u: function (e, t) {
          return y(e.getUTCFullYear(), t.length);
        },
        Q: function (e, t, a) {
          var n = Math.ceil((e.getUTCMonth() + 1) / 3);
          switch (t) {
            case "Q":
              return String(n);
            case "QQ":
              return y(n, 2);
            case "Qo":
              return a.ordinalNumber(n, { unit: "quarter" });
            case "QQQ":
              return a.quarter(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "QQQQQ":
              return a.quarter(n, { width: "narrow", context: "formatting" });
            default:
              return a.quarter(n, { width: "wide", context: "formatting" });
          }
        },
        q: function (e, t, a) {
          var n = Math.ceil((e.getUTCMonth() + 1) / 3);
          switch (t) {
            case "q":
              return String(n);
            case "qq":
              return y(n, 2);
            case "qo":
              return a.ordinalNumber(n, { unit: "quarter" });
            case "qqq":
              return a.quarter(n, {
                width: "abbreviated",
                context: "standalone",
              });
            case "qqqqq":
              return a.quarter(n, { width: "narrow", context: "standalone" });
            default:
              return a.quarter(n, { width: "wide", context: "standalone" });
          }
        },
        M: function (e, t, a) {
          var n = e.getUTCMonth();
          switch (t) {
            case "M":
            case "MM":
              return b.M(e, t);
            case "Mo":
              return a.ordinalNumber(n + 1, { unit: "month" });
            case "MMM":
              return a.month(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "MMMMM":
              return a.month(n, { width: "narrow", context: "formatting" });
            default:
              return a.month(n, { width: "wide", context: "formatting" });
          }
        },
        L: function (e, t, a) {
          var n = e.getUTCMonth();
          switch (t) {
            case "L":
              return String(n + 1);
            case "LL":
              return y(n + 1, 2);
            case "Lo":
              return a.ordinalNumber(n + 1, { unit: "month" });
            case "LLL":
              return a.month(n, {
                width: "abbreviated",
                context: "standalone",
              });
            case "LLLLL":
              return a.month(n, { width: "narrow", context: "standalone" });
            default:
              return a.month(n, { width: "wide", context: "standalone" });
          }
        },
        w: function (e, t, a, n) {
          var r = p(e, n);
          return "wo" === t
            ? a.ordinalNumber(r, { unit: "week" })
            : y(r, t.length);
        },
        I: function (e, t, a) {
          var n = c(e);
          return "Io" === t
            ? a.ordinalNumber(n, { unit: "week" })
            : y(n, t.length);
        },
        d: function (e, t, a) {
          return "do" === t
            ? a.ordinalNumber(e.getUTCDate(), { unit: "date" })
            : b.d(e, t);
        },
        D: function (e, t, a) {
          var n = (function (e) {
            (0, r.Z)(1, arguments);
            var t = (0, i.Z)(e),
              a = t.getTime();
            t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
            var n = a - t.getTime();
            return Math.floor(n / 864e5) + 1;
          })(e);
          return "Do" === t
            ? a.ordinalNumber(n, { unit: "dayOfYear" })
            : y(n, t.length);
        },
        E: function (e, t, a) {
          var n = e.getUTCDay();
          switch (t) {
            case "E":
            case "EE":
            case "EEE":
              return a.day(n, { width: "abbreviated", context: "formatting" });
            case "EEEEE":
              return a.day(n, { width: "narrow", context: "formatting" });
            case "EEEEEE":
              return a.day(n, { width: "short", context: "formatting" });
            default:
              return a.day(n, { width: "wide", context: "formatting" });
          }
        },
        e: function (e, t, a, n) {
          var r = e.getUTCDay(),
            i = (r - n.weekStartsOn + 8) % 7 || 7;
          switch (t) {
            case "e":
              return String(i);
            case "ee":
              return y(i, 2);
            case "eo":
              return a.ordinalNumber(i, { unit: "day" });
            case "eee":
              return a.day(r, { width: "abbreviated", context: "formatting" });
            case "eeeee":
              return a.day(r, { width: "narrow", context: "formatting" });
            case "eeeeee":
              return a.day(r, { width: "short", context: "formatting" });
            default:
              return a.day(r, { width: "wide", context: "formatting" });
          }
        },
        c: function (e, t, a, n) {
          var r = e.getUTCDay(),
            i = (r - n.weekStartsOn + 8) % 7 || 7;
          switch (t) {
            case "c":
              return String(i);
            case "cc":
              return y(i, t.length);
            case "co":
              return a.ordinalNumber(i, { unit: "day" });
            case "ccc":
              return a.day(r, { width: "abbreviated", context: "standalone" });
            case "ccccc":
              return a.day(r, { width: "narrow", context: "standalone" });
            case "cccccc":
              return a.day(r, { width: "short", context: "standalone" });
            default:
              return a.day(r, { width: "wide", context: "standalone" });
          }
        },
        i: function (e, t, a) {
          var n = e.getUTCDay(),
            r = 0 === n ? 7 : n;
          switch (t) {
            case "i":
              return String(r);
            case "ii":
              return y(r, t.length);
            case "io":
              return a.ordinalNumber(r, { unit: "day" });
            case "iii":
              return a.day(n, { width: "abbreviated", context: "formatting" });
            case "iiiii":
              return a.day(n, { width: "narrow", context: "formatting" });
            case "iiiiii":
              return a.day(n, { width: "short", context: "formatting" });
            default:
              return a.day(n, { width: "wide", context: "formatting" });
          }
        },
        a: function (e, t, a) {
          var n = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
          switch (t) {
            case "a":
            case "aa":
              return a.dayPeriod(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "aaa":
              return a
                .dayPeriod(n, { width: "abbreviated", context: "formatting" })
                .toLowerCase();
            case "aaaaa":
              return a.dayPeriod(n, { width: "narrow", context: "formatting" });
            default:
              return a.dayPeriod(n, { width: "wide", context: "formatting" });
          }
        },
        b: function (e, t, a) {
          var n,
            r = e.getUTCHours();
          switch (
            ((n = 12 === r ? v : 0 === r ? g : r / 12 >= 1 ? "pm" : "am"), t)
          ) {
            case "b":
            case "bb":
              return a.dayPeriod(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "bbb":
              return a
                .dayPeriod(n, { width: "abbreviated", context: "formatting" })
                .toLowerCase();
            case "bbbbb":
              return a.dayPeriod(n, { width: "narrow", context: "formatting" });
            default:
              return a.dayPeriod(n, { width: "wide", context: "formatting" });
          }
        },
        B: function (e, t, a) {
          var n,
            r = e.getUTCHours();
          switch (((n = r >= 17 ? k : r >= 12 ? _ : r >= 4 ? w : D), t)) {
            case "B":
            case "BB":
            case "BBB":
              return a.dayPeriod(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "BBBBB":
              return a.dayPeriod(n, { width: "narrow", context: "formatting" });
            default:
              return a.dayPeriod(n, { width: "wide", context: "formatting" });
          }
        },
        h: function (e, t, a) {
          if ("ho" === t) {
            var n = e.getUTCHours() % 12;
            return 0 === n && (n = 12), a.ordinalNumber(n, { unit: "hour" });
          }
          return b.h(e, t);
        },
        H: function (e, t, a) {
          return "Ho" === t
            ? a.ordinalNumber(e.getUTCHours(), { unit: "hour" })
            : b.H(e, t);
        },
        K: function (e, t, a) {
          var n = e.getUTCHours() % 12;
          return "Ko" === t
            ? a.ordinalNumber(n, { unit: "hour" })
            : y(n, t.length);
        },
        k: function (e, t, a) {
          var n = e.getUTCHours();
          return (
            0 === n && (n = 24),
            "ko" === t ? a.ordinalNumber(n, { unit: "hour" }) : y(n, t.length)
          );
        },
        m: function (e, t, a) {
          return "mo" === t
            ? a.ordinalNumber(e.getUTCMinutes(), { unit: "minute" })
            : b.m(e, t);
        },
        s: function (e, t, a) {
          return "so" === t
            ? a.ordinalNumber(e.getUTCSeconds(), { unit: "second" })
            : b.s(e, t);
        },
        S: function (e, t) {
          return b.S(e, t);
        },
        X: function (e, t, a, n) {
          var r = (n._originalDate || e).getTimezoneOffset();
          if (0 === r) return "Z";
          switch (t) {
            case "X":
              return x(r);
            case "XXXX":
            case "XX":
              return S(r);
            default:
              return S(r, ":");
          }
        },
        x: function (e, t, a, n) {
          var r = (n._originalDate || e).getTimezoneOffset();
          switch (t) {
            case "x":
              return x(r);
            case "xxxx":
            case "xx":
              return S(r);
            default:
              return S(r, ":");
          }
        },
        O: function (e, t, a, n) {
          var r = (n._originalDate || e).getTimezoneOffset();
          switch (t) {
            case "O":
            case "OO":
            case "OOO":
              return "GMT" + C(r, ":");
            default:
              return "GMT" + S(r, ":");
          }
        },
        z: function (e, t, a, n) {
          var r = (n._originalDate || e).getTimezoneOffset();
          switch (t) {
            case "z":
            case "zz":
            case "zzz":
              return "GMT" + C(r, ":");
            default:
              return "GMT" + S(r, ":");
          }
        },
        t: function (e, t, a, n) {
          var r = n._originalDate || e;
          return y(Math.floor(r.getTime() / 1e3), t.length);
        },
        T: function (e, t, a, n) {
          return y((n._originalDate || e).getTime(), t.length);
        },
      };
    function C(e, t) {
      var a = e > 0 ? "-" : "+",
        n = Math.abs(e),
        r = Math.floor(n / 60),
        i = n % 60;
      if (0 === i) return a + String(r);
      var o = t || "";
      return a + String(r) + o + y(i, 2);
    }
    function x(e, t) {
      return e % 60 == 0
        ? (e > 0 ? "-" : "+") + y(Math.abs(e) / 60, 2)
        : S(e, t);
    }
    function S(e, t) {
      var a = t || "",
        n = e > 0 ? "-" : "+",
        r = Math.abs(e);
      return n + y(Math.floor(r / 60), 2) + a + y(r % 60, 2);
    }
    const M = T;
    var U = function (e, t) {
        switch (e) {
          case "P":
            return t.date({ width: "short" });
          case "PP":
            return t.date({ width: "medium" });
          case "PPP":
            return t.date({ width: "long" });
          default:
            return t.date({ width: "full" });
        }
      },
      W = function (e, t) {
        switch (e) {
          case "p":
            return t.time({ width: "short" });
          case "pp":
            return t.time({ width: "medium" });
          case "ppp":
            return t.time({ width: "long" });
          default:
            return t.time({ width: "full" });
        }
      },
      F = {
        p: W,
        P: function (e, t) {
          var a,
            n = e.match(/(P+)(p+)?/) || [],
            r = n[1],
            i = n[2];
          if (!i) return U(e, t);
          switch (r) {
            case "P":
              a = t.dateTime({ width: "short" });
              break;
            case "PP":
              a = t.dateTime({ width: "medium" });
              break;
            case "PPP":
              a = t.dateTime({ width: "long" });
              break;
            default:
              a = t.dateTime({ width: "full" });
          }
          return a.replace("{{date}}", U(r, t)).replace("{{time}}", W(i, t));
        },
      };
    const Y = F;
    var N = a(5763),
      P = ["D", "DD"],
      E = ["YY", "YYYY"];
    function $(e, t, a) {
      if ("YYYY" === e)
        throw new RangeError(
          "Use `yyyy` instead of `YYYY` (in `"
            .concat(t, "`) for formatting years to the input `")
            .concat(
              a,
              "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
            )
        );
      if ("YY" === e)
        throw new RangeError(
          "Use `yy` instead of `YY` (in `"
            .concat(t, "`) for formatting years to the input `")
            .concat(
              a,
              "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
            )
        );
      if ("D" === e)
        throw new RangeError(
          "Use `d` instead of `D` (in `"
            .concat(t, "`) for formatting days of the month to the input `")
            .concat(
              a,
              "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
            )
        );
      if ("DD" === e)
        throw new RangeError(
          "Use `dd` instead of `DD` (in `"
            .concat(t, "`) for formatting days of the month to the input `")
            .concat(
              a,
              "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
            )
        );
    }
    var L = {
      lessThanXSeconds: {
        one: "less than a second",
        other: "less than {{count}} seconds",
      },
      xSeconds: { one: "1 second", other: "{{count}} seconds" },
      halfAMinute: "half a minute",
      lessThanXMinutes: {
        one: "less than a minute",
        other: "less than {{count}} minutes",
      },
      xMinutes: { one: "1 minute", other: "{{count}} minutes" },
      aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
      xHours: { one: "1 hour", other: "{{count}} hours" },
      xDays: { one: "1 day", other: "{{count}} days" },
      aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
      xWeeks: { one: "1 week", other: "{{count}} weeks" },
      aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
      xMonths: { one: "1 month", other: "{{count}} months" },
      aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
      xYears: { one: "1 year", other: "{{count}} years" },
      overXYears: { one: "over 1 year", other: "over {{count}} years" },
      almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
    };
    const O = function (e, t, a) {
      var n,
        r = L[e];
      return (
        (n =
          "string" == typeof r
            ? r
            : 1 === t
            ? r.one
            : r.other.replace("{{count}}", t.toString())),
        null != a && a.addSuffix
          ? a.comparison && a.comparison > 0
            ? "in " + n
            : n + " ago"
          : n
      );
    };
    function Z(e) {
      return function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          a = t.width ? String(t.width) : e.defaultWidth;
        return e.formats[a] || e.formats[e.defaultWidth];
      };
    }
    var q = {
      date: Z({
        formats: {
          full: "EEEE, MMMM do, y",
          long: "MMMM do, y",
          medium: "MMM d, y",
          short: "MM/dd/yyyy",
        },
        defaultWidth: "full",
      }),
      time: Z({
        formats: {
          full: "h:mm:ss a zzzz",
          long: "h:mm:ss a z",
          medium: "h:mm:ss a",
          short: "h:mm a",
        },
        defaultWidth: "full",
      }),
      dateTime: Z({
        formats: {
          full: "{{date}} 'at' {{time}}",
          long: "{{date}} 'at' {{time}}",
          medium: "{{date}}, {{time}}",
          short: "{{date}}, {{time}}",
        },
        defaultWidth: "full",
      }),
    };
    var A = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: "P",
    };
    function j(e) {
      return function (t, a) {
        var n;
        if (
          "formatting" ===
            (null != a && a.context ? String(a.context) : "standalone") &&
          e.formattingValues
        ) {
          var r = e.defaultFormattingWidth || e.defaultWidth,
            i = null != a && a.width ? String(a.width) : r;
          n = e.formattingValues[i] || e.formattingValues[r];
        } else {
          var o = e.defaultWidth,
            s = null != a && a.width ? String(a.width) : e.defaultWidth;
          n = e.values[s] || e.values[o];
        }
        return n[e.argumentCallback ? e.argumentCallback(t) : t];
      };
    }
    function z(e) {
      return function (t) {
        var a =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = a.width,
          r = (n && e.matchPatterns[n]) || e.matchPatterns[e.defaultMatchWidth],
          i = t.match(r);
        if (!i) return null;
        var o,
          s = i[0],
          l = (n && e.parsePatterns[n]) || e.parsePatterns[e.defaultParseWidth],
          d = Array.isArray(l)
            ? (function (e, t) {
                for (var a = 0; a < e.length; a++) if (t(e[a])) return a;
                return;
              })(l, function (e) {
                return e.test(s);
              })
            : (function (e, t) {
                for (var a in e) if (e.hasOwnProperty(a) && t(e[a])) return a;
                return;
              })(l, function (e) {
                return e.test(s);
              });
        return (
          (o = e.valueCallback ? e.valueCallback(d) : d),
          {
            value: (o = a.valueCallback ? a.valueCallback(o) : o),
            rest: t.slice(s.length),
          }
        );
      };
    }
    var V;
    const H = {
      code: "en-US",
      formatDistance: O,
      formatLong: q,
      formatRelative: function (e, t, a, n) {
        return A[e];
      },
      localize: {
        ordinalNumber: function (e, t) {
          var a = Number(e),
            n = a % 100;
          if (n > 20 || n < 10)
            switch (n % 10) {
              case 1:
                return a + "st";
              case 2:
                return a + "nd";
              case 3:
                return a + "rd";
            }
          return a + "th";
        },
        era: j({
          values: {
            narrow: ["B", "A"],
            abbreviated: ["BC", "AD"],
            wide: ["Before Christ", "Anno Domini"],
          },
          defaultWidth: "wide",
        }),
        quarter: j({
          values: {
            narrow: ["1", "2", "3", "4"],
            abbreviated: ["Q1", "Q2", "Q3", "Q4"],
            wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
          },
          defaultWidth: "wide",
          argumentCallback: function (e) {
            return e - 1;
          },
        }),
        month: j({
          values: {
            narrow: [
              "J",
              "F",
              "M",
              "A",
              "M",
              "J",
              "J",
              "A",
              "S",
              "O",
              "N",
              "D",
            ],
            abbreviated: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            wide: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          },
          defaultWidth: "wide",
        }),
        day: j({
          values: {
            narrow: ["S", "M", "T", "W", "T", "F", "S"],
            short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            wide: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
          },
          defaultWidth: "wide",
        }),
        dayPeriod: j({
          values: {
            narrow: {
              am: "a",
              pm: "p",
              midnight: "mi",
              noon: "n",
              morning: "morning",
              afternoon: "afternoon",
              evening: "evening",
              night: "night",
            },
            abbreviated: {
              am: "AM",
              pm: "PM",
              midnight: "midnight",
              noon: "noon",
              morning: "morning",
              afternoon: "afternoon",
              evening: "evening",
              night: "night",
            },
            wide: {
              am: "a.m.",
              pm: "p.m.",
              midnight: "midnight",
              noon: "noon",
              morning: "morning",
              afternoon: "afternoon",
              evening: "evening",
              night: "night",
            },
          },
          defaultWidth: "wide",
          formattingValues: {
            narrow: {
              am: "a",
              pm: "p",
              midnight: "mi",
              noon: "n",
              morning: "in the morning",
              afternoon: "in the afternoon",
              evening: "in the evening",
              night: "at night",
            },
            abbreviated: {
              am: "AM",
              pm: "PM",
              midnight: "midnight",
              noon: "noon",
              morning: "in the morning",
              afternoon: "in the afternoon",
              evening: "in the evening",
              night: "at night",
            },
            wide: {
              am: "a.m.",
              pm: "p.m.",
              midnight: "midnight",
              noon: "noon",
              morning: "in the morning",
              afternoon: "in the afternoon",
              evening: "in the evening",
              night: "at night",
            },
          },
          defaultFormattingWidth: "wide",
        }),
      },
      match: {
        ordinalNumber:
          ((V = {
            matchPattern: /^(\d+)(th|st|nd|rd)?/i,
            parsePattern: /\d+/i,
            valueCallback: function (e) {
              return parseInt(e, 10);
            },
          }),
          function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              a = e.match(V.matchPattern);
            if (!a) return null;
            var n = a[0],
              r = e.match(V.parsePattern);
            if (!r) return null;
            var i = V.valueCallback ? V.valueCallback(r[0]) : r[0];
            return {
              value: (i = t.valueCallback ? t.valueCallback(i) : i),
              rest: e.slice(n.length),
            };
          }),
        era: z({
          matchPatterns: {
            narrow: /^(b|a)/i,
            abbreviated:
              /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
            wide: /^(before christ|before common era|anno domini|common era)/i,
          },
          defaultMatchWidth: "wide",
          parsePatterns: { any: [/^b/i, /^(a|c)/i] },
          defaultParseWidth: "any",
        }),
        quarter: z({
          matchPatterns: {
            narrow: /^[1234]/i,
            abbreviated: /^q[1234]/i,
            wide: /^[1234](th|st|nd|rd)? quarter/i,
          },
          defaultMatchWidth: "wide",
          parsePatterns: { any: [/1/i, /2/i, /3/i, /4/i] },
          defaultParseWidth: "any",
          valueCallback: function (e) {
            return e + 1;
          },
        }),
        month: z({
          matchPatterns: {
            narrow: /^[jfmasond]/i,
            abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
            wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
          },
          defaultMatchWidth: "wide",
          parsePatterns: {
            narrow: [
              /^j/i,
              /^f/i,
              /^m/i,
              /^a/i,
              /^m/i,
              /^j/i,
              /^j/i,
              /^a/i,
              /^s/i,
              /^o/i,
              /^n/i,
              /^d/i,
            ],
            any: [
              /^ja/i,
              /^f/i,
              /^mar/i,
              /^ap/i,
              /^may/i,
              /^jun/i,
              /^jul/i,
              /^au/i,
              /^s/i,
              /^o/i,
              /^n/i,
              /^d/i,
            ],
          },
          defaultParseWidth: "any",
        }),
        day: z({
          matchPatterns: {
            narrow: /^[smtwf]/i,
            short: /^(su|mo|tu|we|th|fr|sa)/i,
            abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
            wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
          },
          defaultMatchWidth: "wide",
          parsePatterns: {
            narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
            any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
          },
          defaultParseWidth: "any",
        }),
        dayPeriod: z({
          matchPatterns: {
            narrow:
              /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
            any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
          },
          defaultMatchWidth: "any",
          parsePatterns: {
            any: {
              am: /^a/i,
              pm: /^p/i,
              midnight: /^mi/i,
              noon: /^no/i,
              morning: /morning/i,
              afternoon: /afternoon/i,
              evening: /evening/i,
              night: /night/i,
            },
          },
          defaultParseWidth: "any",
        }),
      },
      options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
    };
    var X = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
      B = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
      R = /^'([^]*?)'?$/,
      I = /''/g,
      G = /[a-zA-Z]/;
    function J(e, t, a) {
      var n, d, u, c, f, m, p, y, b, g, v, w, _, k, D, T, C, x;
      (0, r.Z)(2, arguments);
      var S = String(t),
        U = (0, h.j)(),
        W =
          null !==
            (n =
              null !== (d = null == a ? void 0 : a.locale) && void 0 !== d
                ? d
                : U.locale) && void 0 !== n
            ? n
            : H,
        F = (0, s.Z)(
          null !==
            (u =
              null !==
                (c =
                  null !==
                    (f =
                      null !==
                        (m = null == a ? void 0 : a.firstWeekContainsDate) &&
                      void 0 !== m
                        ? m
                        : null == a ||
                          null === (p = a.locale) ||
                          void 0 === p ||
                          null === (y = p.options) ||
                          void 0 === y
                        ? void 0
                        : y.firstWeekContainsDate) && void 0 !== f
                    ? f
                    : U.firstWeekContainsDate) && void 0 !== c
                ? c
                : null === (b = U.locale) ||
                  void 0 === b ||
                  null === (g = b.options) ||
                  void 0 === g
                ? void 0
                : g.firstWeekContainsDate) && void 0 !== u
            ? u
            : 1
        );
      if (!(F >= 1 && F <= 7))
        throw new RangeError(
          "firstWeekContainsDate must be between 1 and 7 inclusively"
        );
      var L = (0, s.Z)(
        null !==
          (v =
            null !==
              (w =
                null !==
                  (_ =
                    null !== (k = null == a ? void 0 : a.weekStartsOn) &&
                    void 0 !== k
                      ? k
                      : null == a ||
                        null === (D = a.locale) ||
                        void 0 === D ||
                        null === (T = D.options) ||
                        void 0 === T
                      ? void 0
                      : T.weekStartsOn) && void 0 !== _
                  ? _
                  : U.weekStartsOn) && void 0 !== w
              ? w
              : null === (C = U.locale) ||
                void 0 === C ||
                null === (x = C.options) ||
                void 0 === x
              ? void 0
              : x.weekStartsOn) && void 0 !== v
          ? v
          : 0
      );
      if (!(L >= 0 && L <= 6))
        throw new RangeError(
          "weekStartsOn must be between 0 and 6 inclusively"
        );
      if (!W.localize)
        throw new RangeError("locale must contain localize property");
      if (!W.formatLong)
        throw new RangeError("locale must contain formatLong property");
      var O = (0, i.Z)(e);
      if (!o(O)) throw new RangeError("Invalid time value");
      var Z = l(O, (0, N.Z)(O)),
        q = {
          firstWeekContainsDate: F,
          weekStartsOn: L,
          locale: W,
          _originalDate: O,
        };
      return S.match(B)
        .map(function (e) {
          var t = e[0];
          return "p" === t || "P" === t ? (0, Y[t])(e, W.formatLong) : e;
        })
        .join("")
        .match(X)
        .map(function (n) {
          if ("''" === n) return "'";
          var r = n[0];
          if ("'" === r)
            return (function (e) {
              var t = e.match(R);
              if (!t) return e;
              return t[1].replace(I, "'");
            })(n);
          var i,
            o = M[r];
          if (o)
            return (
              (null != a && a.useAdditionalWeekYearTokens) ||
                ((i = n), -1 === E.indexOf(i)) ||
                $(n, t, String(e)),
              (null != a && a.useAdditionalDayOfYearTokens) ||
                !(function (e) {
                  return -1 !== P.indexOf(e);
                })(n) ||
                $(n, t, String(e)),
              o(Z, n, W.localize, q)
            );
          if (r.match(G))
            throw new RangeError(
              "Format string contains an unescaped latin alphabet character `" +
                r +
                "`"
            );
          return n;
        })
        .join("");
    }
  },
  34327: (e, t, a) => {
    a.d(t, { Z: () => i });
    var n = a(56956),
      r = a(23682);
    function i(e) {
      (0, r.Z)(1, arguments);
      var t = Object.prototype.toString.call(e);
      return e instanceof Date ||
        ("object" === (0, n.Z)(e) && "[object Date]" === t)
        ? new Date(e.getTime())
        : "number" == typeof e || "[object Number]" === t
        ? new Date(e)
        : (("string" != typeof e && "[object String]" !== t) ||
            "undefined" == typeof console ||
            (console.warn(
              "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"
            ),
            console.warn(new Error().stack)),
          new Date(NaN));
    }
  },
  56956: (e, t, a) => {
    function n(e) {
      return (
        (n =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  "function" == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? "symbol"
                  : typeof e;
              }),
        n(e)
      );
    }
    a.d(t, { Z: () => n });
  },
  99266: (e, t, a) => {
    a.d(t, { r: () => s });
    var n = a(32982),
      r = a(16616),
      i = a(41005);
    const o = (e, t, a) => {
        const n = new Map();
        for (let r = t; r <= a; r++) n.set(e[r], r);
        return n;
      },
      s = (0, r.XM)(
        class extends r.Xe {
          constructor(e) {
            if ((super(e), e.type !== r.pX.CHILD))
              throw Error("repeat() can only be used in text expressions");
          }
          ct(e, t, a) {
            let n;
            void 0 === a ? (a = t) : void 0 !== t && (n = t);
            const r = [],
              i = [];
            let o = 0;
            for (const t of e) (r[o] = n ? n(t, o) : o), (i[o] = a(t, o)), o++;
            return { values: i, keys: r };
          }
          render(e, t, a) {
            return this.ct(e, t, a).values;
          }
          update(e, [t, a, r]) {
            var s;
            const l = (0, i.i9)(e),
              { values: d, keys: u } = this.ct(t, a, r);
            if (!Array.isArray(l)) return (this.ut = u), d;
            const c =
                null !== (s = this.ut) && void 0 !== s ? s : (this.ut = []),
              h = [];
            let f,
              m,
              p = 0,
              y = l.length - 1,
              b = 0,
              g = d.length - 1;
            for (; p <= y && b <= g; )
              if (null === l[p]) p++;
              else if (null === l[y]) y--;
              else if (c[p] === u[b]) (h[b] = (0, i.fk)(l[p], d[b])), p++, b++;
              else if (c[y] === u[g]) (h[g] = (0, i.fk)(l[y], d[g])), y--, g--;
              else if (c[p] === u[g])
                (h[g] = (0, i.fk)(l[p], d[g])),
                  (0, i._Y)(e, h[g + 1], l[p]),
                  p++,
                  g--;
              else if (c[y] === u[b])
                (h[b] = (0, i.fk)(l[y], d[b])),
                  (0, i._Y)(e, l[p], l[y]),
                  y--,
                  b++;
              else if (
                (void 0 === f && ((f = o(u, b, g)), (m = o(c, p, y))),
                f.has(c[p]))
              )
                if (f.has(c[y])) {
                  const t = m.get(u[b]),
                    a = void 0 !== t ? l[t] : null;
                  if (null === a) {
                    const t = (0, i._Y)(e, l[p]);
                    (0, i.fk)(t, d[b]), (h[b] = t);
                  } else
                    (h[b] = (0, i.fk)(a, d[b])),
                      (0, i._Y)(e, l[p], a),
                      (l[t] = null);
                  b++;
                } else (0, i.ws)(l[y]), y--;
              else (0, i.ws)(l[p]), p++;
            for (; b <= g; ) {
              const t = (0, i._Y)(e, h[g + 1]);
              (0, i.fk)(t, d[b]), (h[b++] = t);
            }
            for (; p <= y; ) {
              const e = l[p++];
              null !== e && (0, i.ws)(e);
            }
            return (this.ut = u), (0, i.hl)(e, h), n.Jb;
          }
        }
      );
  },
};
//# sourceMappingURL=1353.-1725hLu0CE.js.map
