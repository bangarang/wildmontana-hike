<template>
  <div :id="id" class="geo" @click="$emit('touched', 'geo', $event)">
    <div class="map-container">
      <div :id="id + '-map'" class="map"></div>
      <slot name="filters"></slot>
      <slot name="buttons"></slot>
    </div>
    <div class="list-container">
      <div :id="id + '-list'">
        <slot name="list"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import bbox from "@turf/bbox";
import config from "../../config";
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
// import geo_style from "../style.json";
let GL;
const ctx = typeof window != "undefined" ? "client" : "server";
if (ctx === "client") GL = require("mapbox-gl");

export default {
  name: "ui-geo",
  props: {
    id: {
      type: String,
      default: "geo",
    },
    attributionControl: {
      type: Object,
      default: () => {
        return {
          enabled: true,
          compact: true,
        };
      },
    },
    bounds: {
      type: Array,
      default: () => [],
    },
    features: {
      type: Array,
      default: () => [],
    },
    fullScreenControl: {
      type: Object,
      default: () => {
        return {
          enabled: true,
          position: "top-right",
        };
      },
    },
    locationControl: {
      type: Object,
      default: () => {
        return {
          enabled: false,
          options: {},
          position: "top-right",
        };
      },
    },
    navigationControl: {
      type: Object,
      default: () => {
        return {
          enabled: true,
          position: "top-right",
        };
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    selectionMonitoring: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      center: this.options.center || config.geo.center,
      defaults: {
        attributionControl: false,
        center: config.geo.center,
        cluster: false,
        container: `${this.id}-map`,
        maxZoom: config.geo.zoom.max,
        minZoom: config.geo.zoom.min,
        scrollZoom: false,
        style: config.geo.styles[config.geo.style],
        zoom: config.geo.zoom.initial,
      },
      loaded: false,
      speed: 1.2,
      zoom: this.options.zoom || config.geo.zoom.initial,
    };
  },
  computed: {
    sourceID() {
      return `${this.id}-data`;
    },
  },
  watch: {
    bounds: "fit",
    features: "data",
    "options.fit": "fit",
    "options.style": "style",
  },
  methods: {
    controls() {
      this.map.scrollZoom.disable();
      if (this.attributionControl.enabled) {
        const { compact, position } = this.attributionControl;
        this.map.addControl(new GL.AttributionControl({ compact }), position);
      }

      if (this.fullScreenControl.enabled) {
        const { position } = this.fullScreenControl;
        this.map.addControl(new GL.FullscreenControl(), position);
      }

      if (this.locationControl.enabled) {
        const { options, position } = this.locationControl;
        this.map.addControl(new GL.GeolocateControl(options), position);
      }

      if (this.navigationControl.enabled) {
        const { position } = this.navigationControl;
        this.map.addControl(new GL.NavigationControl(), position);
      }

      if (config.geo.popups) {
        this.popup = new GL.Popup({ anchor: "top" });
      }
    },
    data(features = []) {
      if (!this.loaded) return;
      // console.log({features: this.features})
      if (!this.source) {
        this.source = {
          type: "geojson",
          cluster: this.options.cluster === true,
          data: { features, type: "FeatureCollection" },
        };
        this.map.addSource(this.sourceID, this.source);
        this.layers();
      } else {
        const count = this.source.data.features.length;
        this.source.data.features = features;
        this.map.getSource(this.sourceID).setData(this.source.data);
        if (features.length === count) return;
      }

      if (this.options.fit !== false && features.length) {
        this.fit();
      }
    },
    events() {
      const layers = ["polygons", "paths", "points", "circle"];

      layers.forEach((layer) => {
        // Hover:on event
        this.map.on("mousemove", layer, (e) => {
          if (this.features.length) {
            this.map.getCanvas().style.cursor = "pointer";
          }
        });

        // Hover:off event
        this.map.on("mouseleave", layer, (e) => {
          if (this.features.length) {
            this.map.getCanvas().style.cursor = "";
          }
        });

        // Click event
        this.map.on("click", layer, (e) => {
          if (this._handlingClickEvent) return;

          if (this.features.length && e.features && e.features.length) {
            this._handlingClickEvent = true;
            setTimeout(() => (this._handlingClickEvent = false), 250);

            const id = e.features[0].properties.entry;
            if (!id) return;

            if (id === this.$store.state.selected) {
              if (config.geo.popups) {
                this.$nextTick(() => this.$emit("deselected", id));
                if (this.popup) this.popup.remove();
                this.hidePopup();
              } else {
                this.$nextTick(() => this.$emit("dbl-selected", id));
              }
              return;
            }
            // const entry = this.entry(id);
            // console.log("MARKER SELECTED", { id, entry });
            // if (window.dataLayer) {
            //   window.dataLayer.push({
            //     event: "virtualPageview",
            //     pageUrl: window.location.href, //URL shown in URL bar
            //     pageTitle: `Hike Wild Montana - ${entry.title}`, //site name - {trail name},
            //     trailName: entry.title,
            //     action: "Click - Map Link",
            //   });
            // }
            this.$store.commit("selected", id);

            if (config.geo.popups) {
              this.hidePopup();
              this.showPopup(e.features);
            }
          }
        });
      });

      // Style:load event
      this.map.on("style.load", (e) => {
        this.source = null;

        this.data(this.features);

        if (this.center) this.map.setCenter(this.center);
        if (this.zoom) this.map.setZoom(this.zoom);
      });

      // Global selection event
      if (this.selectionMonitoring) {
        this.$store.watch(this.$store.getters.selected, (id) => {
          this.select(id);
        });
      }
    },
    fit(bounds = []) {
      if (!this.features.length && !bounds.length) return;

      if (!bounds.length) {
        bounds = bbox({ type: "FeatureCollection", features: this.features });
      }

      if (bounds && bounds.length === 4) {
        this.map.fitBounds(bounds, { padding: 70 });
      }
    },
    focus(point, zoom) {
      return new Promise((resolve, reject) => {
        if (
          !Array.isArray(point) ||
          point.length !== 2 ||
          (!zoom && zoom !== 0)
        ) {
          if (this.options.fit === false) {
            this.focus(this.options.center, this.options.zoom).then(() => {
              return resolve();
            });
          }
          this.fit();
          return resolve();
        }

        zoom = zoom >= 0 && zoom <= 20 ? zoom : 7.7;
        const options = { center: point, speed: this.speed, zoom: zoom - 0.7 };

        this.map.flyTo(Object.assign(this.$store.state.geo, options));
        this.map.once("moveend", (e) => resolve());
      });
    },
    hidePopup() {
      if (!this.popup) return;
      this.popup.remove();
    },
    layers() {
      if (!this.source) return;

      const { path, polygon } = config.geo;
      const not = {
        polygons: ["!in", "$type", "Polygon"],
        points: ["!in", "$type", "Point"],
      };

      // Polygons
      this.map.addLayer({
        id: "polygons",
        type: "fill",
        source: this.sourceID,
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-antialias": true,
          "fill-color": {
            type: "identity",
            property: "color-fill",
            default: `rgba(81, 81, 81, ${polygon.opacity[0]})`,
          },
          "fill-outline-color": {
            type: "identity",
            property: "color-path",
            default: `rgba(81, 81, 81, ${path.opacity[0]})`,
          },
        },
      });

      // Paths
      this.map.addLayer({
        id: "paths",
        type: "line",
        source: this.sourceID,
        filter: this.options.dashes
          ? ["all", not.polygons, not.points]
          : not.points,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-width": {
            type: "identity",
            property: "width",
            default: path.width[0],
          },
          "line-dasharray": this.options.dashes ? [2, 2] : [2],
          "line-color": {
            type: "identity",
            property: "color",
            default: "#404040",
          },
        },
      });

      // Points
      this.map.addLayer({
        id: "points",
        type: "symbol",
        source: this.sourceID,
        filter: ["==", "$type", "Point"],
        layout: {
          "icon-image": "{symbol}",
          "icon-size": {
            property: "scale",
            stops: [
              [{ zoom: 0, value: 1 }, 0.4],
              [{ zoom: 0, value: 1.5 }, 0.8],
              [{ zoom: 8, value: 1 }, 0.7],
              [{ zoom: 8, value: 1.5 }, 1],
            ],
          },
        },
        paint: {
          "icon-opacity": {
            type: "identity",
            property: "opacity",
            default: 1,
          },
        },
      });
      // Circle
      this.map.addLayer({
        id: "circle",
        type: "circle",
        source: this.sourceID,
        filter: ["==", "symbol", "circle-15"],
        paint: {
          "circle-radius": 10,
          "circle-color": config.app.color.highlight,
        },
      });
    },
    resize() {
      if (!this.loaded) return;
      this.map.resize();
    },
    // entry(id) {
    //   return this.$store.state.entries[id];
    // },
    select(id, zoomOffset = 0) {
      this.hidePopup();

      if (id && typeof id == "string") {
        const feature = this.features.find((f) => f.properties.entry === id);
        if (feature) {
          const { point, zoom } = feature.properties;
          this.focus(point, (zoom || this.options.zoom || 7) - zoomOffset).then(
            () => {
              if (config.geo.popups && this.map) {
                const params = { filter: ["==", "entry", id] };
                const features = this.map.querySourceFeatures(
                  this.sourceID,
                  params
                );
                this.showPopup(features);
              }
            }
          );
          return;
        }
      }

      this.focus();
    },
    showPopup(features = []) {
      const feature = features.length ? features[0] : null;
      if (!feature) return;

      let point = null;

      if (feature.geometry.type === "LineString") {
        point = feature.geometry.coordinates[0];
      } else if (
        feature.geometry.type === "Polygon" ||
        feature.geometry.type === "MultiLineString"
      ) {
        point = feature.geometry.coordinates[0][0];
      } else {
        point = feature.geometry.coordinates;
      }

      if (!point) return;

      const html = feature.properties.html;
      this.popup = new GL.Popup()
        .setLngLat(point)
        .setHTML(html)
        .addTo(this.map);
    },
    style() {
      if (!this.options.style) return;

      const center = this.map.getCenter();
      this.center = [center.lng, center.lat];
      this.zoom = this.map.getZoom();
      this.map.setStyle(this.options.style);
    },
  },
  mounted() {
    GL.accessToken = config.geo.token;
    GL.workerCount = Math.min(window.navigator.hardwareConcurrency || 2, 6);

    this.map = new GL.Map(Object.assign({}, this.defaults, this.options));
    this.map.on("load", () => {
      this.loaded = true;
      this.controls();
      this.data(this.features);
      this.events();

      const selected = this.$store.state.selected;
      if (selected) this.select(selected);
    });
  },
  beforeDestroy() {
    if (!this.map) return;
    this.map.remove();
  },
};
</script>

<style>
.map-container {
  position: relative;
}

.element-geo .geo .map-container {
  height: 350px;
}

@media (min-width: 640px) {
  .element-geo .geo .map-container {
    height: 600px;
  }
}

.index-view .map-container {
  height: 100%;
}

.geo,
.geo .map {
  width: 100%;
  height: 100%;
}

.geo .map button {
  margin: 0;
  padding: 0;
  border-radius: 0;
  border-color: #f1f3f4;
  transition: opacity var(--duration-short);
}

.geo .map button:hover {
  background-color: transparent !important;
  opacity: 0.6;
}

.geo .map a {
  border: none;
}

.geo .map .mapboxgl-control-container {
  z-index: var(--z-default);
}

.geo .map .mapboxgl-ctrl-icon {
  background-size: 30px 30px;
  background-position: 0px 0px;
  background-repeat: no-repeat;
}

.geo .map .mapboxgl-ctrl-group {
  padding: 7px;
  box-shadow: var(--box-shadow-small);
}

.geo .map .mapboxgl-ctrl-group button:focus {
  box-shadow: none;
}

.geo .map .mapboxgl-ctrl-fullscreen .mapboxgl-ctrl-icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiAgPHRpdGxlPmV4cGFuZDwvdGl0bGU+ICA8cGF0aCBkPSJNMTUuODkyIDQuMDYzaC0yLjg0MnYwLjU2N2gyLjM3OWwtNC42NTQgNC42NTggMC40MDQgMC40IDQuNzEzLTQuNzEzdjIuNDk2aDAuNTY3di0zLjQwOGgtMC41Njd6Ij48L3BhdGg+ICA8cGF0aCBkPSJNOS4yMzcgMTAuOTM4bC00LjcxMiA0LjcxMnYtMi40OTZoLTAuNTY3djMuNDA4aDMuNDA4di0wLjU2N2gtMi4zODNsNC42NTgtNC42NTgtMC40MDQtMC40eiI+PC9wYXRoPjwvc3ZnPg==);
}

.geo .map .mapboxgl-ctrl-shrink .mapboxgl-ctrl-icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiAgPHRpdGxlPmNvbGxhcHNlPC90aXRsZT4gIDxwYXRoIGQ9Ik0xMS4zNDIgOS42ODhoMi44NDJ2LTAuNTY3aC0yLjM3OWw0LjY1NC00LjY1OC0wLjQwNC0wLjQtNC43MTIgNC43MTJ2LTIuNDk2aC0wLjU2N3YzLjQwOGgwLjU2N3oiPjwvcGF0aD4gIDxwYXRoIGQ9Ik00LjM2MyAxNi41NjNsNC43MTItNC43MTJ2Mi40OTZoMC41Njd2LTMuNDA4aC0zLjQwOHYwLjU2N2gyLjM4M2wtNC42NTggNC42NTggMC40MDQgMC40eiI+PC9wYXRoPjwvc3ZnPg==);
}

.geo .map .mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiAgPHRpdGxlPnBsdXM8L3RpdGxlPiAgPHBhdGggZD0iTTE0LjE2NyA5LjUzN2gtMy43MDR2LTMuNzA0aC0wLjkyNXYzLjcwNGgtMy43MDR2MC45MjVoMy43MDR2My43MDRoMC45MjV2LTMuNzA0aDMuNzA0di0wLjkyNXoiPjwvcGF0aD48L3N2Zz4=);
}

.geo .map .mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiAgPHRpdGxlPm1pbnVzPC90aXRsZT4gIDxwYXRoIGQ9Ik01LjgzMyA5LjUzN2g4LjMzM3YwLjkyNWgtOC4zMzN2LTAuOTI1eiI+PC9wYXRoPjwvc3ZnPg==);
  border-bottom: none;
}

.geo .map .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
  background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%0D%0A%20%20%3Cpath%20style%3D%27fill%3A%23333%3B%27%20d%3D%27M10%204C9%204%209%205%209%205L9%205.1A5%205%200%200%200%205.1%209L5%209C5%209%204%209%204%2010%204%2011%205%2011%205%2011L5.1%2011A5%205%200%200%200%209%2014.9L9%2015C9%2015%209%2016%2010%2016%2011%2016%2011%2015%2011%2015L11%2014.9A5%205%200%200%200%2014.9%2011L15%2011C15%2011%2016%2011%2016%2010%2016%209%2015%209%2015%209L14.9%209A5%205%200%200%200%2011%205.1L11%205C11%205%2011%204%2010%204zM10%206.5A3.5%203.5%200%200%201%2013.5%2010%203.5%203.5%200%200%201%2010%2013.5%203.5%203.5%200%200%201%206.5%2010%203.5%203.5%200%200%201%2010%206.5zM10%208.3A1.8%201.8%200%200%200%208.3%2010%201.8%201.8%200%200%200%2010%2011.8%201.8%201.8%200%200%200%2011.8%2010%201.8%201.8%200%200%200%2010%208.3z%27%20%2F%3E%0D%0A%3C%2Fsvg%3E);
}

.geo .map .mapboxgl-ctrl-compass {
  margin-bottom: 3px;
}

.geo .map .mapboxgl-ctrl-compass .mapboxgl-ctrl-icon {
  margin-top: 3px;
}

.geo .map .mapboxgl-ctrl-logo {
  margin-bottom: 0;
  margin-left: 0;
}

.geo .map .mapboxgl-ctrl-top-right .mapboxgl-ctrl-group:first-child {
  display: none;
}

.geo .map .mapboxgl-ctrl-top-right .mapboxgl-ctrl-group {
  margin-top: 10px;
  margin-right: 10px;
}

@media (min-width: 1024px) {
  .geo .map .mapboxgl-ctrl-top-right .mapboxgl-ctrl-group:first-child {
    display: block;
  }
  .index-view .geo .map .mapboxgl-ctrl-top-right {
    top: 0;
  }
}

@media (max-width: 1023px) {
  .index-view .geo .map .mapboxgl-ctrl-top-right {
    top: 50px;
  }
}

.geo .map .mapboxgl-ctrl-bottom-right {
  bottom: 0;
}

.geo .map .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-attrib:hover {
  margin-right: 10px;
  padding: 6px 24px 6px 6px;
  font-size: 1.2rem;
  line-height: 1;
}

.geo .map .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-attrib a:hover {
  text-decoration: none;
}

.geo .buttons {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 0;
  background-color: white;
  border-radius: 0.4rem;
  box-shadow: var(--box-shadow-small);
  transition: all var(--duration-medium) cubic-bezier(0.165, 0.84, 0.44, 1);
}

.geo .buttons .button {
  padding: 7px;
  margin: 1px 0 -1px 0;
}

.geo .buttons .button > .icon {
  margin-right: 0;
}

@media (min-width: 1024px) {
  .geo .buttons .menu-button {
    display: none;
  }
}

.geo .map .mapboxgl-popup-close-button,
.geo .map .mapboxgl-popup-close-button:focus,
.geo .map .mapboxgl-popup-close-button:active {
  display: none;
  padding: 5px;
  color: var(--color-text-grey-light);
  background-color: transparent;
}

.geo .map .mapboxgl-popup-content {
  padding: 5px;
  border-radius: 0;
  text-align: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-heavy);
  font-size: 14px;
}

.geo .map .mapboxgl-popup .info {
  width: 250px;
  overflow: hidden;
  font-family: var(--font-family-sans);
  background-color: white;
  cursor: pointer;
}

.geo .map .mapboxgl-popup .info .image-container {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.geo .map .mapboxgl-popup .info .image {
  position: relative;
  width: 100%;
  height: 160px;
  background: 50% no-repeat var(--color-bg-placeholder);
  background-size: cover;
  border-bottom: 1px solid #f8f8f8;
  transition: all var(--duration-medium) var(--ease-out-cubic);
}

.geo .map .mapboxgl-popup .info:hover .image {
  transform: scale(1.05);
}

.geo .map .mapboxgl-popup .info .image .icon {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -1.5rem;
  margin-left: -1.5rem;
}

.geo .map .mapboxgl-popup .info .text {
  padding: 2rem;
  text-align: left;
}

.geo .map .mapboxgl-popup .info .title {
  text-align: left;
  font-size: 1.5rem;
  font-weight: var(--font-weight-heavy);
  line-height: 1.9rem;
}

.geo .map .mapboxgl-popup .info .subtitle {
  margin-top: 0.7rem;
  text-align: left;
  font-family: var(--font-family-serif);
  font-size: 1.3rem;
  font-style: italic;
  line-height: 1.7rem;
  color: var(--color-text-grey-light);
}

.geo .buttons .styles {
  position: absolute;
  top: 220px;
  right: 0;
}

.geo .buttons .style {
  position: relative;
  width: 43px;
  height: 43px;
  margin-bottom: 5px;
  background: 50% no-repeat transparent;
  background-size: cover;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-small);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--duration-short), transform var(--duration-short);
}

.geo .buttons .style:last-child {
  margin-bottom: 0;
}

.geo .buttons .style:hover {
  transform: scale(1.05);
}

.geo .buttons .style.active {
  opacity: 1;
}

.geo .buttons .style .state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: 2px solid white;
  border-radius: var(--border-radius);
  opacity: 0;
  transition: opacity var(--duration-short) ease-out;
}

.geo .buttons .style.active .state {
  opacity: 1;
}
</style>
