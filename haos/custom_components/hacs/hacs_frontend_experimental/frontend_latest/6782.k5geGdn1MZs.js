export const id = 6782;
export const ids = [6782];
export const modules = {
  7265: (e, t, i) => {
    var a = i(309),
      o = i(5095),
      s = i(95260);
    (0, a.Z)(
      [(0, s.Mo)("ha-input-helper-text")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy`<slot></slot>`;
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                o.iv`:host{display:block;color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6));font-size:.75rem;padding-left:16px;padding-right:16px}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  46782: (e, t, i) => {
    i.r(t), i.d(t, { HaLocationSelector: () => v });
    var a = i(309),
      o = i(5095),
      s = i(95260),
      n = i(14516),
      r = i(18394),
      d = i(34541),
      l = i(47838);
    i(7265);
    const c = (e) =>
      e.tileLayer(
        "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}" +
          (e.Browser.retina ? "@2x.png" : ".png"),
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          minZoom: 0,
          maxZoom: 20,
        }
      );
    var h = i(3850),
      u = i(2733),
      p = i(23636),
      f = (i(54371), i(86634));
    let m = (0, a.Z)(
      null,
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "entity-id" })],
              key: "entityId",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "entity-name" })],
              key: "entityName",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "entity-picture" })],
              key: "entityPicture",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: "entity-color" })],
              key: "entityColor",
              value: void 0,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <div class="marker ${
                  this.entityPicture ? "picture" : ""
                }" style="${(0, f.V)({
                  "border-color": this.entityColor,
                })}" @click="${this._badgeTap}"> ${
                  this.entityPicture
                    ? o.dy`<div class="entity-picture" style="${(0, f.V)({
                        "background-image": `url(${this.entityPicture})`,
                      })}"></div>`
                    : this.entityName
                } </div> `;
              },
            },
            {
              kind: "method",
              key: "_badgeTap",
              value: function (e) {
                e.stopPropagation(),
                  this.entityId &&
                    (0, r.B)(this, "hass-more-info", {
                      entityId: this.entityId,
                    });
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`.marker{display:flex;justify-content:center;align-items:center;box-sizing:border-box;width:48px;height:48px;font-size:var(--ha-marker-font-size, 1.5em);border-radius:50%;border:1px solid var(--ha-marker-color,var(--primary-color));color:var(--primary-text-color);background-color:var(--card-background-color)}.marker.picture{overflow:hidden}.entity-picture{background-size:cover;height:100%;width:100%}`;
              },
            },
          ],
        };
      },
      o.oi
    );
    customElements.define("ha-entity-marker", m);
    const k = (e) => ("string" == typeof e ? e : e.entity_id);
    (0, a.Z)(
      [(0, s.Mo)("ha-map")],
      function (e, t) {
        class a extends t {
          constructor(...t) {
            super(...t), e(this);
          }
        }
        return {
          F: a,
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "entities",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "paths",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "layers",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "autoFit",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "renderPassive",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "interactiveZones",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "fitZones",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean })],
              key: "darkMode",
              value: () => !1,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Number })],
              key: "zoom",
              value: () => 14,
            },
            {
              kind: "field",
              decorators: [(0, s.SB)()],
              key: "_loaded",
              value: () => !1,
            },
            { kind: "field", key: "leafletMap", value: void 0 },
            { kind: "field", key: "Leaflet", value: void 0 },
            { kind: "field", key: "_resizeObserver", value: void 0 },
            { kind: "field", key: "_mapItems", value: () => [] },
            { kind: "field", key: "_mapFocusItems", value: () => [] },
            { kind: "field", key: "_mapZones", value: () => [] },
            { kind: "field", key: "_mapPaths", value: () => [] },
            {
              kind: "method",
              key: "connectedCallback",
              value: function () {
                (0, d.Z)((0, l.Z)(a.prototype), "connectedCallback", this).call(
                  this
                ),
                  this._loadMap(),
                  this._attachObserver();
              },
            },
            {
              kind: "method",
              key: "disconnectedCallback",
              value: function () {
                (0, d.Z)(
                  (0, l.Z)(a.prototype),
                  "disconnectedCallback",
                  this
                ).call(this),
                  this.leafletMap &&
                    (this.leafletMap.remove(),
                    (this.leafletMap = void 0),
                    (this.Leaflet = void 0)),
                  (this._loaded = !1),
                  this._resizeObserver && this._resizeObserver.unobserve(this);
              },
            },
            {
              kind: "method",
              key: "update",
              value: function (e) {
                var t, i;
                if (
                  ((0, d.Z)((0, l.Z)(a.prototype), "update", this).call(
                    this,
                    e
                  ),
                  !this._loaded)
                )
                  return;
                let o = !1;
                const s = e.get("hass");
                if (e.has("_loaded") || e.has("entities"))
                  this._drawEntities(), (o = !0);
                else if (this._loaded && s && this.entities)
                  for (const e of this.entities)
                    if (s.states[k(e)] !== this.hass.states[k(e)]) {
                      this._drawEntities(), (o = !0);
                      break;
                    }
                (e.has("_loaded") || e.has("paths")) && this._drawPaths(),
                  (e.has("_loaded") || e.has("layers")) &&
                    (this._drawLayers(e.get("layers")), (o = !0)),
                  (e.has("_loaded") || (this.autoFit && o)) && this.fitMap(),
                  e.has("zoom") && this.leafletMap.setZoom(this.zoom),
                  (e.has("darkMode") ||
                    (e.has("hass") &&
                      (!s ||
                        (null === (t = s.themes) || void 0 === t
                          ? void 0
                          : t.darkMode) !==
                          (null === (i = this.hass.themes) || void 0 === i
                            ? void 0
                            : i.darkMode)))) &&
                    this._updateMapStyle();
              },
            },
            {
              kind: "method",
              key: "_updateMapStyle",
              value: function () {
                var e, t, i;
                const a =
                    null !==
                      (e =
                        null !== (t = this.darkMode) && void 0 !== t
                          ? t
                          : this.hass.themes.darkMode) &&
                    void 0 !== e &&
                    e,
                  o = null !== (i = this.darkMode) && void 0 !== i && i,
                  s = this.shadowRoot.getElementById("map");
                s.classList.toggle("dark", a),
                  s.classList.toggle("forced-dark", o);
              },
            },
            {
              kind: "method",
              key: "_loadMap",
              value: async function () {
                let e = this.shadowRoot.getElementById("map");
                e ||
                  ((e = document.createElement("div")),
                  (e.id = "map"),
                  this.shadowRoot.append(e)),
                  ([this.leafletMap, this.Leaflet] = await (async (e) => {
                    if (!e.parentNode)
                      throw new Error(
                        "Cannot setup Leaflet map on disconnected element"
                      );
                    const t = (await i.e(208).then(i.t.bind(i, 70208, 23)))
                      .default;
                    t.Icon.Default.imagePath = "/static/images/leaflet/images/";
                    const a = t.map(e),
                      o = document.createElement("link");
                    return (
                      o.setAttribute(
                        "href",
                        "/static/images/leaflet/leaflet.css"
                      ),
                      o.setAttribute("rel", "stylesheet"),
                      e.parentNode.appendChild(o),
                      a.setView([52.3731339, 4.8903147], 13),
                      [a, t, c(t).addTo(a)]
                    );
                  })(e)),
                  this._updateMapStyle(),
                  (this._loaded = !0);
              },
            },
            {
              kind: "method",
              key: "fitMap",
              value: function (e) {
                var t, i, a;
                if (!this.leafletMap || !this.Leaflet || !this.hass) return;
                if (
                  !(
                    this._mapFocusItems.length ||
                    (null !== (t = this.layers) && void 0 !== t && t.length)
                  )
                )
                  return void this.leafletMap.setView(
                    new this.Leaflet.LatLng(
                      this.hass.config.latitude,
                      this.hass.config.longitude
                    ),
                    (null == e ? void 0 : e.zoom) || this.zoom
                  );
                let o = this.Leaflet.latLngBounds(
                  this._mapFocusItems
                    ? this._mapFocusItems.map((e) => e.getLatLng())
                    : []
                );
                var s;
                this.fitZones &&
                  (null === (s = this._mapZones) ||
                    void 0 === s ||
                    s.forEach((e) => {
                      o.extend(
                        "getBounds" in e ? e.getBounds() : e.getLatLng()
                      );
                    }));
                null === (i = this.layers) ||
                  void 0 === i ||
                  i.forEach((e) => {
                    o.extend("getBounds" in e ? e.getBounds() : e.getLatLng());
                  }),
                  (o = o.pad(
                    null !== (a = null == e ? void 0 : e.pad) && void 0 !== a
                      ? a
                      : 0.5
                  )),
                  this.leafletMap.fitBounds(o, {
                    maxZoom: (null == e ? void 0 : e.zoom) || this.zoom,
                  });
              },
            },
            {
              kind: "method",
              key: "fitBounds",
              value: function (e, t) {
                var i;
                if (!this.leafletMap || !this.Leaflet || !this.hass) return;
                const a = this.Leaflet.latLngBounds(e).pad(
                  null !== (i = null == t ? void 0 : t.pad) && void 0 !== i
                    ? i
                    : 0.5
                );
                this.leafletMap.fitBounds(a, {
                  maxZoom: (null == t ? void 0 : t.zoom) || this.zoom,
                });
              },
            },
            {
              kind: "method",
              key: "_drawLayers",
              value: function (e) {
                if ((e && e.forEach((e) => e.remove()), !this.layers)) return;
                const t = this.leafletMap;
                this.layers.forEach((e) => {
                  t.addLayer(e);
                });
              },
            },
            {
              kind: "method",
              key: "_drawPaths",
              value: function () {
                const e = this.hass,
                  t = this.leafletMap,
                  i = this.Leaflet;
                if (!e || !t || !i) return;
                if (
                  (this._mapPaths.length &&
                    (this._mapPaths.forEach((e) => e.remove()),
                    (this._mapPaths = [])),
                  !this.paths)
                )
                  return;
                const a = getComputedStyle(this).getPropertyValue(
                  "--dark-primary-color"
                );
                this.paths.forEach((e) => {
                  let o, s;
                  e.gradualOpacity &&
                    ((o = e.gradualOpacity / (e.points.length - 2)),
                    (s = 1 - e.gradualOpacity));
                  for (let t = 0; t < e.points.length - 1; t++) {
                    const n = e.gradualOpacity ? s + t * o : void 0;
                    this._mapPaths.push(
                      i
                        .circleMarker(e.points[t].point, {
                          radius: 3,
                          color: e.color || a,
                          opacity: n,
                          fillOpacity: n,
                          interactive: !0,
                        })
                        .bindTooltip(e.points[t].tooltip, { direction: "top" })
                    ),
                      this._mapPaths.push(
                        i.polyline([e.points[t].point, e.points[t + 1].point], {
                          color: e.color || a,
                          opacity: n,
                          interactive: !1,
                        })
                      );
                  }
                  const n = e.points.length - 1;
                  if (n >= 0) {
                    const t = e.gradualOpacity ? s + n * o : void 0;
                    this._mapPaths.push(
                      i
                        .circleMarker(e.points[n].point, {
                          radius: 3,
                          color: e.color || a,
                          opacity: t,
                          fillOpacity: t,
                          interactive: !0,
                        })
                        .bindTooltip(e.points[n].tooltip, { direction: "top" })
                    );
                  }
                  this._mapPaths.forEach((e) => t.addLayer(e));
                });
              },
            },
            {
              kind: "method",
              key: "_drawEntities",
              value: function () {
                var e;
                const t = this.hass,
                  i = this.leafletMap,
                  a = this.Leaflet;
                if (!t || !i || !a) return;
                if (
                  (this._mapItems.length &&
                    (this._mapItems.forEach((e) => e.remove()),
                    (this._mapItems = []),
                    (this._mapFocusItems = [])),
                  this._mapZones.length &&
                    (this._mapZones.forEach((e) => e.remove()),
                    (this._mapZones = [])),
                  !this.entities)
                )
                  return;
                const o = getComputedStyle(this),
                  s = o.getPropertyValue("--accent-color"),
                  n = o.getPropertyValue("--secondary-text-color"),
                  r = o.getPropertyValue("--dark-primary-color"),
                  d = (
                    null !== (e = this.darkMode) && void 0 !== e
                      ? e
                      : this.hass.themes.darkMode
                  )
                    ? "dark"
                    : "light";
                for (const e of this.entities) {
                  const i = t.states[k(e)];
                  if (!i) continue;
                  const o = "string" != typeof e ? e.name : void 0,
                    l = null != o ? o : (0, u.C)(i),
                    {
                      latitude: c,
                      longitude: p,
                      passive: f,
                      icon: m,
                      radius: v,
                      entity_picture: y,
                      gps_accuracy: g,
                    } = i.attributes;
                  if (!c || !p) continue;
                  if ("zone" === (0, h.N)(i)) {
                    if (f && !this.renderPassive) continue;
                    let e = "";
                    if (m) {
                      const t = document.createElement("ha-icon");
                      t.setAttribute("icon", m), (e = t.outerHTML);
                    } else {
                      const t = document.createElement("span");
                      (t.innerHTML = l), (e = t.outerHTML);
                    }
                    this._mapZones.push(
                      a.marker([c, p], {
                        icon: a.divIcon({
                          html: e,
                          iconSize: [24, 24],
                          className: d,
                        }),
                        interactive: this.interactiveZones,
                        title: l,
                      })
                    ),
                      this._mapZones.push(
                        a.circle([c, p], {
                          interactive: !1,
                          color: f ? n : s,
                          radius: v,
                        })
                      );
                    continue;
                  }
                  const b =
                      "string" != typeof e && "state" === e.label_mode
                        ? this.hass.formatEntityState(i)
                        : null != o
                        ? o
                        : l
                            .split(" ")
                            .map((e) => e[0])
                            .join("")
                            .substr(0, 3),
                    _ = a.marker([c, p], {
                      icon: a.divIcon({
                        html: `\n              <ha-entity-marker\n                entity-id="${k(
                          e
                        )}"\n                entity-name="${b}"\n                entity-picture="${
                          y ? this.hass.hassUrl(y) : ""
                        }"\n                ${
                          "string" != typeof e
                            ? `entity-color="${e.color}"`
                            : ""
                        }\n              ></ha-entity-marker>\n            `,
                        iconSize: [48, 48],
                        className: "",
                      }),
                      title: l,
                    });
                  this._mapItems.push(_),
                    ("string" != typeof e && !1 === e.focus) ||
                      this._mapFocusItems.push(_),
                    g &&
                      this._mapItems.push(
                        a.circle([c, p], {
                          interactive: !1,
                          color: r,
                          radius: g,
                        })
                      );
                }
                this._mapItems.forEach((e) => i.addLayer(e)),
                  this._mapZones.forEach((e) => i.addLayer(e));
              },
            },
            {
              kind: "method",
              key: "_attachObserver",
              value: async function () {
                this._resizeObserver ||
                  (await (0, p.j)(),
                  (this._resizeObserver = new ResizeObserver(() => {
                    var e;
                    null === (e = this.leafletMap) ||
                      void 0 === e ||
                      e.invalidateSize({ debounceMoveend: !0 });
                  }))),
                  this._resizeObserver.observe(this);
              },
            },
            {
              kind: "get",
              static: !0,
              key: "styles",
              value: function () {
                return o.iv`:host{display:block;height:300px}#map{height:100%}#map.dark{background:#090909}#map.forced-dark{--map-filter:invert(0.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(0.3)}#map:active{cursor:grabbing;cursor:-moz-grabbing;cursor:-webkit-grabbing}.light{color:#000}.dark{color:#fff}.leaflet-tile-pane{filter:var(--map-filter)}.dark .leaflet-bar a{background-color:var(--card-background-color,#1c1c1c);color:#fff}.leaflet-marker-draggable{cursor:move!important}.leaflet-edit-resize{border-radius:50%;cursor:nesw-resize!important}.named-icon{display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;color:var(--primary-text-color)}.leaflet-pane{z-index:0!important}.leaflet-bottom,.leaflet-control,.leaflet-top{z-index:1!important}.leaflet-tooltip{padding:8px;font-size:90%;background:rgba(80,80,80,.9)!important;color:#fff!important;border-radius:4px;box-shadow:none!important}`;
              },
            },
          ],
        };
      },
      o.fl
    ),
      (0, a.Z)(
        [(0, s.Mo)("ha-locations-editor")],
        function (e, t) {
          class a extends t {
            constructor() {
              super(),
                e(this),
                (this._loadPromise = i
                  .e(208)
                  .then(i.t.bind(i, 70208, 23))
                  .then((e) =>
                    i
                      .e(7716)
                      .then(i.t.bind(i, 27716, 23))
                      .then(
                        () => (
                          (this.Leaflet = e.default),
                          this._updateMarkers(),
                          this.updateComplete.then(() => this.fitMap())
                        )
                      )
                  ));
            }
          }
          return {
            F: a,
            d: [
              {
                kind: "field",
                decorators: [(0, s.Cb)({ attribute: !1 })],
                key: "hass",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, s.Cb)({ attribute: !1 })],
                key: "locations",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, s.Cb)()],
                key: "helper",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, s.Cb)({ type: Boolean })],
                key: "autoFit",
                value: () => !1,
              },
              {
                kind: "field",
                decorators: [(0, s.Cb)({ type: Number })],
                key: "zoom",
                value: () => 16,
              },
              {
                kind: "field",
                decorators: [(0, s.Cb)({ type: Boolean })],
                key: "darkMode",
                value: () => !1,
              },
              {
                kind: "field",
                decorators: [(0, s.SB)()],
                key: "_locationMarkers",
                value: void 0,
              },
              {
                kind: "field",
                decorators: [(0, s.SB)()],
                key: "_circles",
                value: () => ({}),
              },
              {
                kind: "field",
                decorators: [(0, s.IO)("ha-map", !0)],
                key: "map",
                value: void 0,
              },
              { kind: "field", key: "Leaflet", value: void 0 },
              { kind: "field", key: "_loadPromise", value: void 0 },
              {
                kind: "method",
                key: "fitMap",
                value: function (e) {
                  this.map.fitMap(e);
                },
              },
              {
                kind: "method",
                key: "fitBounds",
                value: function (e, t) {
                  this.map.fitBounds(e, t);
                },
              },
              {
                kind: "method",
                key: "fitMarker",
                value: async function (e, t) {
                  if (
                    (this.Leaflet || (await this._loadPromise),
                    !this.map.leafletMap || !this._locationMarkers)
                  )
                    return;
                  const i = this._locationMarkers[e];
                  if (i)
                    if ("getBounds" in i)
                      this.map.leafletMap.fitBounds(i.getBounds()),
                        i.bringToFront();
                    else {
                      const a = this._circles[e];
                      a
                        ? this.map.leafletMap.fitBounds(a.getBounds())
                        : this.map.leafletMap.setView(
                            i.getLatLng(),
                            (null == t ? void 0 : t.zoom) || this.zoom
                          );
                    }
                },
              },
              {
                kind: "method",
                key: "render",
                value: function () {
                  return o.dy` <ha-map .hass="${
                    this.hass
                  }" .layers="${this._getLayers(
                    this._circles,
                    this._locationMarkers
                  )}" .zoom="${this.zoom}" .autoFit="${
                    this.autoFit
                  }" .darkMode="${this.darkMode}"></ha-map> ${
                    this.helper
                      ? o.dy`<ha-input-helper-text>${this.helper}</ha-input-helper-text>`
                      : ""
                  } `;
                },
              },
              {
                kind: "field",
                key: "_getLayers",
                value: () =>
                  (0, n.Z)((e, t) => {
                    const i = [];
                    return (
                      Array.prototype.push.apply(i, Object.values(e)),
                      t && Array.prototype.push.apply(i, Object.values(t)),
                      i
                    );
                  }),
              },
              {
                kind: "method",
                key: "willUpdate",
                value: function (e) {
                  (0, d.Z)((0, l.Z)(a.prototype), "willUpdate", this).call(
                    this,
                    e
                  ),
                    this.Leaflet && e.has("locations") && this._updateMarkers();
                },
              },
              {
                kind: "method",
                key: "_updateLocation",
                value: function (e) {
                  const t = e.target,
                    i = t.getLatLng();
                  let a = i.lng;
                  Math.abs(a) > 180 && (a = (((a % 360) + 540) % 360) - 180);
                  const o = [i.lat, a];
                  (0, r.B)(
                    this,
                    "location-updated",
                    { id: t.id, location: o },
                    { bubbles: !1 }
                  );
                },
              },
              {
                kind: "method",
                key: "_updateRadius",
                value: function (e) {
                  const t = e.target,
                    i = this._locationMarkers[t.id];
                  (0, r.B)(
                    this,
                    "radius-updated",
                    { id: t.id, radius: i.getRadius() },
                    { bubbles: !1 }
                  );
                },
              },
              {
                kind: "method",
                key: "_markerClicked",
                value: function (e) {
                  const t = e.target;
                  (0, r.B)(
                    this,
                    "marker-clicked",
                    { id: t.id },
                    { bubbles: !1 }
                  );
                },
              },
              {
                kind: "method",
                key: "_updateMarkers",
                value: function () {
                  if (!this.locations || !this.locations.length)
                    return (
                      (this._circles = {}),
                      void (this._locationMarkers = void 0)
                    );
                  const e = {},
                    t = {},
                    i =
                      getComputedStyle(this).getPropertyValue("--accent-color");
                  this.locations.forEach((a) => {
                    let o;
                    if (a.icon || a.iconPath) {
                      const e = document.createElement("div");
                      let t;
                      (e.className = "named-icon"),
                        void 0 !== a.name && (e.innerText = a.name),
                        a.icon
                          ? ((t = document.createElement("ha-icon")),
                            t.setAttribute("icon", a.icon))
                          : ((t = document.createElement("ha-svg-icon")),
                            t.setAttribute("path", a.iconPath)),
                        e.prepend(t),
                        (o = this.Leaflet.divIcon({
                          html: e.outerHTML,
                          iconSize: [24, 24],
                          className: "light",
                        }));
                    }
                    if (a.radius) {
                      const s = this.Leaflet.circle([a.latitude, a.longitude], {
                        color: a.radius_color || i,
                        radius: a.radius,
                      });
                      a.radius_editable || a.location_editable
                        ? (s.editing.enable(),
                          s.addEventListener("add", () => {
                            const e = s.editing._moveMarker,
                              t = s.editing._resizeMarkers[0];
                            o && e.setIcon(o),
                              (t.id = e.id = a.id),
                              e
                                .addEventListener("dragend", (e) =>
                                  this._updateLocation(e)
                                )
                                .addEventListener("click", (e) =>
                                  this._markerClicked(e)
                                ),
                              a.radius_editable
                                ? t.addEventListener("dragend", (e) =>
                                    this._updateRadius(e)
                                  )
                                : t.remove();
                          }),
                          (e[a.id] = s))
                        : (t[a.id] = s);
                    }
                    if (
                      !a.radius ||
                      (!a.radius_editable && !a.location_editable)
                    ) {
                      const t = {
                        title: a.name,
                        draggable: a.location_editable,
                      };
                      o && (t.icon = o);
                      const i = this.Leaflet.marker(
                        [a.latitude, a.longitude],
                        t
                      )
                        .addEventListener("dragend", (e) =>
                          this._updateLocation(e)
                        )
                        .addEventListener("click", (e) =>
                          this._markerClicked(e)
                        );
                      (i.id = a.id), (e[a.id] = i);
                    }
                  }),
                    (this._circles = t),
                    (this._locationMarkers = e),
                    (0, r.B)(this, "markers-updated");
                },
              },
              {
                kind: "get",
                static: !0,
                key: "styles",
                value: function () {
                  return o.iv`ha-map{display:block;height:100%}`;
                },
              },
            ],
          };
        },
        o.oi
      );
    let v = (0, a.Z)(
      [(0, s.Mo)("ha-selector-location")],
      function (e, t) {
        return {
          F: class extends t {
            constructor(...t) {
              super(...t), e(this);
            }
          },
          d: [
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "hass",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ attribute: !1 })],
              key: "selector",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "value",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "label",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)()],
              key: "helper",
              value: void 0,
            },
            {
              kind: "field",
              decorators: [(0, s.Cb)({ type: Boolean, reflect: !0 })],
              key: "disabled",
              value: () => !1,
            },
            {
              kind: "method",
              key: "render",
              value: function () {
                return o.dy` <p>${
                  this.label ? this.label : ""
                }</p> <ha-locations-editor class="flex" .hass="${
                  this.hass
                }" .helper="${this.helper}" .locations="${this._location(
                  this.selector,
                  this.value
                )}" @location-updated="${
                  this._locationChanged
                }" @radius-updated="${
                  this._radiusChanged
                }"></ha-locations-editor> `;
              },
            },
            {
              kind: "field",
              key: "_location",
              value() {
                return (0, n.Z)((e, t) => {
                  var i, a, o, s;
                  const n = getComputedStyle(this),
                    r =
                      null !== (i = e.location) && void 0 !== i && i.radius
                        ? n.getPropertyValue("--zone-radius-color") ||
                          n.getPropertyValue("--accent-color")
                        : void 0;
                  return [
                    {
                      id: "location",
                      latitude:
                        (null == t ? void 0 : t.latitude) ||
                        this.hass.config.latitude,
                      longitude:
                        (null == t ? void 0 : t.longitude) ||
                        this.hass.config.longitude,
                      radius:
                        null !== (a = e.location) && void 0 !== a && a.radius
                          ? (null == t ? void 0 : t.radius) || 1e3
                          : void 0,
                      radius_color: r,
                      icon:
                        (null !== (o = e.location) && void 0 !== o && o.icon) ||
                        (null !== (s = e.location) && void 0 !== s && s.radius)
                          ? "mdi:map-marker-radius"
                          : "mdi:map-marker",
                      location_editable: !0,
                      radius_editable: !0,
                    },
                  ];
                });
              },
            },
            {
              kind: "method",
              key: "_locationChanged",
              value: function (e) {
                const [t, i] = e.detail.location;
                (0, r.B)(this, "value-changed", {
                  value: { ...this.value, latitude: t, longitude: i },
                });
              },
            },
            {
              kind: "method",
              key: "_radiusChanged",
              value: function (e) {
                const t = e.detail.radius;
                (0, r.B)(this, "value-changed", {
                  value: { ...this.value, radius: t },
                });
              },
            },
            {
              kind: "field",
              static: !0,
              key: "styles",
              value: () =>
                o.iv`ha-locations-editor{display:block;height:400px}p{margin-top:0}`,
            },
          ],
        };
      },
      o.oi
    );
  },
  23636: (e, t, i) => {
    i.d(t, { j: () => a });
    const a = async () => {
      try {
        new ResizeObserver(() => {});
      } catch (e) {
        window.ResizeObserver = (await i.e(5442).then(i.bind(i, 5442))).default;
      }
    };
  },
};
//# sourceMappingURL=6782.k5geGdn1MZs.js.map
