import { _ as s, e, E as i, G as t } from "./main-85e087f9.js";
const o = (o) =>
  s(
    null,
    function (s, o) {
      class n extends o {
        constructor(...e) {
          super(...e), s(this);
        }
      }
      return {
        F: n,
        d: [
          {
            kind: "field",
            decorators: [e({ attribute: !1 })],
            key: "hass",
            value: void 0,
          },
          {
            kind: "field",
            key: "hassSubscribeRequiredHostProps",
            value: void 0,
          },
          { kind: "field", key: "__unsubs", value: void 0 },
          {
            kind: "method",
            key: "connectedCallback",
            value: function () {
              i(t(n.prototype), "connectedCallback", this).call(this),
                this.__checkSubscribed();
            },
          },
          {
            kind: "method",
            key: "disconnectedCallback",
            value: function () {
              if (
                (i(t(n.prototype), "disconnectedCallback", this).call(this),
                this.__unsubs)
              ) {
                for (; this.__unsubs.length; ) {
                  const s = this.__unsubs.pop();
                  s instanceof Promise ? s.then((s) => s()) : s();
                }
                this.__unsubs = void 0;
              }
            },
          },
          {
            kind: "method",
            key: "updated",
            value: function (s) {
              if (
                (i(t(n.prototype), "updated", this).call(this, s),
                s.has("hass"))
              )
                this.__checkSubscribed();
              else if (this.hassSubscribeRequiredHostProps)
                for (const e of s.keys())
                  if (this.hassSubscribeRequiredHostProps.includes(e))
                    return void this.__checkSubscribed();
            },
          },
          {
            kind: "method",
            key: "hassSubscribe",
            value: function () {
              return [];
            },
          },
          {
            kind: "method",
            key: "__checkSubscribed",
            value: function () {
              var s;
              void 0 !== this.__unsubs ||
                !this.isConnected ||
                void 0 === this.hass ||
                (null !== (s = this.hassSubscribeRequiredHostProps) &&
                  void 0 !== s &&
                  s.some((s) => void 0 === this[s])) ||
                (this.__unsubs = this.hassSubscribe());
            },
          },
        ],
      };
    },
    o
  );
export { o as S };
