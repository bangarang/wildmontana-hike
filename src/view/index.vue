<template>
  <div class="index-view">
    <ui-top
      :distance-open="filter.distance"
      :elevationGain="filter.elevationGain"
      :filter-open="filter.open"
      :filters="filters"
      :items="items"
      :roundtripDistance="filter.roundtripDistance"
      :search="search"
      :select="select"
      :toggle-distance-panel="toggleDistancePanel"
      :toggle-filter-panel="toggleFilterPanel"
      :toggle-search-panel="toggleSearchPanel"
      :update-filters="updateFilters"
      :updateElevationGain="updateElevationGain"
      :updateRoundtripDistance="updateRoundtripDistance"
    ></ui-top>
    <ui-banner @setHasBanner="hasBanner = true"></ui-banner>
    <!-- List pane -->
    <div
      :class="{
        pane: true,
        'pane-list': true,
        'has-banner': hasBanner,
        'pane-active': pane.active == 'list',
        scrollable: !filter.open,
      }"
      @click="touch('list', $event)"
    >
      <div class="top">
        <!--        <div class="top-filters">-->
        <!--          &lt;!&ndash; Filters &ndash;&gt;-->
        <!--          <ui-button-->
        <!--            v-if="filters"-->
        <!--            :class="{ 'filter-button': true, 'button-clear': true, active: filter.open }"-->
        <!--            icon="chevron"-->
        <!--            icon-position="right"-->
        <!--            icon-size="1.7rem"-->
        <!--            :icon-transform="filter.open ? 'none' : 'rotate(-180deg)'"-->
        <!--            :color="filter.open ? '#c7c7c7' : '#a7a7a7'"-->
        <!--            :label="$t('filter')"-->
        <!--            @click.native="toggleFilterPanel"-->
        <!--          ></ui-button>-->
        <!--          <ui-filters-->
        <!--            v-if="filters"-->
        <!--            :filters="filters"-->
        <!--            :class="{ panel: true, open: filter.open }"-->
        <!--            @changed="updateFilters"-->
        <!--          ></ui-filters>-->
        <!--          &lt;!&ndash; Search &ndash;&gt;-->
        <!--          &lt;!&ndash; List/map pane toggle &ndash;&gt;-->
        <!--          <ui-button-->
        <!--            class="toggle-button button-clear"-->
        <!--            icon="map"-->
        <!--            icon-size="2.2rem"-->
        <!--            color="#d3d3d3"-->
        <!--            :title="$t('show_map')"-->
        <!--            @click.native="toggleActivePane"-->
        <!--          ></ui-button>-->
        <!--        </div>-->
        <!-- Item count + reset control -->
        <div class="top-info">
          <div
            v-if="entries.length && entries.length === items.length"
            class="count"
          >
            {{ $t("count", { n: items.length }) }}
          </div>
          <div
            v-if="entries.length && entries.length !== items.length"
            class="count"
          >
            {{ $t("count_fraction", { n: items.length, t: entries.length }) }}
          </div>
          <div :class="{ reset: true, active: resettable }">
            <ui-button
              :class="{ 'reset-button': true, 'button-clear': true }"
              color="#444"
              :label="$t('reset')"
              @click.native="reset"
            ></ui-button>
          </div>
        </div>
      </div>
      <!-- List items -->
      <div class="list-items">
        <ui-list-item
          v-for="item of items"
          :item="item"
          :key="item.id"
          :selected="item.id == selected"
          @selected="select(item.title, 'list')"
        ></ui-list-item>
      </div>
    </div>
    <!-- Map pane -->
    <div
      :class="{
        pane: true,
        'pane-map': true,
        'has-banner': hasBanner,
        'pane-active': pane.active == 'map',
      }"
    >
      <ui-geo
        v-if="loading !== null"
        :bounds="bounds"
        :features="features"
        :location-control="geo.locate"
        :options="geo.options"
        :selection-monitoring="true"
        @deselected="deselect"
        @touched="touch"
      >
        <template v-slot:buttons>
          <div class="buttons">
            <ui-button
              class="toggle-button menu-button button-clear"
              icon="menu"
              icon-size="2.8rem"
              color="#111"
              :title="$t('show_list')"
              @click.native="toggleActivePane"
            ></ui-button>
            <div v-if="geo.styles" class="styles">
              <div
                v-for="(v, k) in geo.styles"
                :class="
                  'style style-' + k + (geo.options.style == v ? ' active' : '')
                "
                :style="{ backgroundImage: 'url(/static/' + k + '.png)' }"
                :title="k[0].toUpperCase() + k.slice(1)"
                @click="changeMapStyle(k)"
              >
                <div class="state"></div>
              </div>
            </div>
          </div>
        </template>
      </ui-geo>
      <div v-else class="loading">{{ $t("loading") }}...</div>
      <!-- Info panel -->
      <ui-info-panel
        v-if="loading !== null"
        :open="panel.info.open"
        :tall="panel.info.tall"
        :id="selected"
        @closed="deselect"
        @touched="touch"
      >
        <detail-view
          v-if="selected"
          :id="selected"
          context="panel"
        ></detail-view>
      </ui-info-panel>
    </div>
    <modal v-if="false">
      <template v-slot:body
        ><protect-wilderness
          v-on:cancel="closeModal"
          :popup="true"
        ></protect-wilderness
      ></template>
    </modal>
  </div>
</template>

<script>
import Button from "../component/button.vue";
import DetailView from "./detail.vue";
import Filters from "../component/index/filters.vue";
import Geo from "../component/geo.vue";
import InfoPanel from "../component/index/info.vue";
import ListItem from "../component/index/item.vue";
// import Search from "../component/index/search.vue";
import Top from "../component/top.vue";
import Banner from "../component/banner.vue";
import Modal from "../component/modal.vue";
import ProtectWilderness from "../component/protect-wilderness.vue";
import geo_style from "../style.json";
import config from "../../config";
import features from "../utility/features";

export default {
  name: "index-view",
  metadata() {
    return {
      title: this.$t("site_name"),
      description: this.$t("site_description"),
      path: this.$route.fullPath,
      image: "",
    };
  },
  async prefetch({ store, route }) {
    let params = route.meta && route.meta.params ? route.meta.params : {};
    if (typeof params == "function") params = params();
    if (typeof params != "object" || params === null) params = {};
    // console.log("prefetch:", { params });
    for (const p in params) {
      const v = params[p];
      if (Array.isArray(v)) params[p] = v.join();
      else if (typeof v == "string") params[p] = v;
    }

    try {
      await Promise.all([
        store.dispatch("groups", {
          first: true,
          params: { id: config.id.group.entry.featured },
          previewing: route.query.preview === "true",
        }),
        store
          .dispatch("entries", {
            ephemeral: true,
            params: { ...params, data: "id", limit: 1, page: 1 },
            previewing: route.query.preview === "true",
          })
          .then(({ total }) => {
            // console.log({ total });
            store.commit("total", total);
          }),
      ]);
    } catch (err) {
      if (err && err.code !== 404) console.error(err);
      throw { code: 404 };
    }
  },
  components: {
    "detail-view": DetailView,
    "ui-button": Button,
    "ui-filters": Filters,
    "ui-geo": Geo,
    "ui-info-panel": InfoPanel,
    "ui-list-item": ListItem,
    // "ui-search": Search,
    "ui-top": Top,
    "ui-banner": Banner,
    modal: Modal,
    "protect-wilderness": ProtectWilderness,
  },
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      bounds: [],
      entries: [],
      filter: {
        active: [],
        roundtripDistance: [0, 25],
        elevationGain: [0, 5000],
        open: false,
        distance: false,
      },
      geo: {
        locate: {
          enabled: true,
          options: {
            fitBoundsOptions: {
              maxZoom: config.geo.zoom.locate,
            },
            positionOptions: {
              enableHighAccuracy: true,
            },
            showUserLocation: true,
            trackUserLocation: false,
          },
          position: "top-right",
        },
        options: {
          fit: false,
          scrollZoom: false,
          style: geo_style,
        },
        styles: geo_style,
      },
      loading: null,
      pane: { active: "map" },
      panel: {
        info: {
          open: false,
          tall: false,
        },
      },
      search: {
        input: "",
        open: false,
        results: [],
      },
      selected: "",
      selectedTitle: "",
      scrolling: false,
      showPopup: false,
      hasBanner: false,
    };
  },
  computed: {
    id() {
      if (this.title) {
        const item = this.items.find(
          (item) => this.slug(item.title) === this.title
        );
        if (item) {
          return item.id;
        }
      }
      return "";
    },
    featured() {
      if (!config.id.group.entry.featured) return [];

      const g = this.$store.state.groups[config.id.group.entry.featured];
      return g && Array.isArray(g.entities) ? g.entities : [];
    },
    features() {
      const index = [];

      for (const en of this.items) {
        const el = en.elements.find(
          (el) => el.id === config.id.element.geo.location
        );
        if (!el || !el.data) continue;
        const props = {
          entry: en.id,
          point: el.data.point ? el.data.point.split(",") : [],
          selected: en.id === this.selected,
          zoom: el.data.zoom ? el.data.zoom : null,
        };
        if (en.geo && en.geo.html) {
          props.html = en.geo.html;
        }
        if (!props.html) {
          props.html = en.title;
        }
        if (this.geo.options.style === config.geo.styles.hybrid) {
          props["color-path"] = "rgba(255, 255, 255, 0.7)";
          props["color-polygon"] = "rgba(255, 255, 255, 0.3)";
        }
        index.push(...features(el.data, props));
      }

      return index;
    },
    filters() {
      const gid = config.id.group.element.filters;
      const oids = [];
      const filters = {};
      for (const en of this.entries) {
        for (const el of en.elements) {
          if (el.type !== "option" || !Array.isArray(el.data)) continue;
          if (!el.groups.length || !el.groups.includes(gid)) continue;
          for (const o of el.data) {
            // console.log({ o });
            if (oids.includes(o.id)) continue;
            if (!filters[el.id])
              filters[el.id] = { name: el.name, options: [] };
            const active = this.filter.active.includes(o.id);
            filters[el.id].options.push({ active, id: o.id, label: o.text });
            oids.push(o.id);
          }
        }
      }

      if (!Object.keys(filters).length) {
        return null;
      }

      for (const group in filters) {
        this.sort(filters[group].options, "label");
      }
      // console.log({ gid, filters });
      return filters;
    },
    items() {
      let index = this.entries;

      const roundtripDistance = this.filter.roundtripDistance;
      const elevationGain = this.filter.elevationGain;

      if (this.filter.active.length) {
        index = index.filter((en) => {
          const options = [];
          for (const el of en.elements) {
            if (el.type !== "option" || !Array.isArray(el.data)) continue;
            for (const o of el.data) {
              if (!options.includes(o.id)) options.push(o.id);
            }
          }
          if (this.filter.active.every((id) => options.includes(id)))
            return true;
          return false;
        });
      }
      if (roundtripDistance[0] !== 0 || roundtripDistance[1] !== 25) {
        index = index.filter((en) => {
          for (const el of en.elements) {
            if (el.id === "980ad63f-cb20-45a9-a268-4ee925b62dec") {
              if (
                el.data >= roundtripDistance[0] &&
                el.data <= roundtripDistance[1]
              ) {
                return true;
              } else {
                return false;
              }
            }
          }
        });
      }
      if (elevationGain[0] !== 0 || elevationGain[1] !== 5000) {
        index = index.filter((en) => {
          for (const el of en.elements) {
            if (el.id === "18473b3c-7323-448d-8983-575a03af7ae0") {
              if (el.data >= elevationGain[0] && el.data <= elevationGain[1]) {
                return true;
              } else {
                return false;
              }
            }
          }
        });
      }

      const featured = this.featured
        .map((id) => index.find((en) => en.id === id))
        .filter((en) => en && en.featured);

      const normal = this.sort(
        index.filter((en) => !en.featured),
        "title"
      );

      return [...featured, ...normal];
    },
    resettable() {
      return (
        this.search.input.length > 0 ||
        this.filter.active.length > 0 ||
        this.filter.roundtripDistance[0] !== 0 ||
        this.filter.roundtripDistance[1] !== 25 ||
        this.filter.elevationGain[0] !== 0 ||
        this.filter.elevationGain[1] !== 5000
      );
    },
    entry() {
      return this.$store.state.entries[this.selected];
    },
  },
  watch: {
    title(val) {
      if (val !== this.selectedTitle) {
        if (!val && this.selectedTitle) this.deselect();
        else this.select(val);
      }
    },
  },
  methods: {
    closeModal(provided) {
      if (!provided) {
        sessionStorage.setItem("no-email", true);
      }
      this.showPopup = false;
    },
    getEntries() {
      const promises = [];

      let params =
        this.$route.meta && this.$route.meta.params
          ? this.$route.meta.params
          : {};
      if (typeof params == "function") params = params();
      if (typeof params != "object" || params === null) params = {};

      for (const p in params) {
        const v = params[p];
        if (Array.isArray(v)) params[p] = v.join();
        else if (typeof v == "string") params[p] = v;
      }

      let page = 1;
      const limit = 25;
      // const total = this.$store.state.total || 0;
      const total = 1000;
      const last = total > 0 ? Math.ceil(total / limit) : 1;

      while (true) {
        if (page > last) break;
        const options = {
          params: { order: "title", limit, page, ...params },
          previewing: this.$route.query.preview === "true",
        };
        const p = this.$store
          .dispatch("entries", options)
          .then(({ index = [] }) => this.push(index))
          .catch((err) => console.error(err.message));
        promises.push(p);
        page += 1;
        // console.log({ page, last, total, params });
      }

      return Promise.all(promises);
    },
    getSponsors() {
      const params = {
        page: 1,
        limit: 25,
        order: "title",
        type: config.id.type.sponsors,
      };

      const options = {
        params,
        previewing: this.$route.query.preview === "true",
      };

      this.$store
        .dispatch("sponsors", options)
        .catch((err) => console.error(err.message));
    },
    getMessages() {
      const params = {
        page: 1,
        limit: 25,
        order: "title",
        type: config.id.type.messages,
      };
      const options = {
        params,
        previewing: this.$route.query.preview === "true",
      };

      this.$store
        .dispatch("entries", options)
        .catch((err) => console.error(err.message));
    },
    changeMapStyle(style) {
      this.geo.options.style = config.geo.styles[style];
    },
    deselect() {
      if (this.$route.query.trail) {
        this.$router.replace({ query: {} });
      }
      // this.selected = "";
      // this.$store.commit("selected", "");
      this.panel.info.open = false;
      this.panel.info.tall = false;

      // console.log({ panel: this.panel.info });
      window.dataLayer.push({
        event: "Hide Trail Details",
        pageUrl: window.location.href, //URL shown in URL bar
        pageTitle: `Hike Wild Montana - ${this.entry.title}`, //site name - {trail name},
        trailName: this.entry.title,
        action: "Trail Detail Deselected",
      });

      this.$nextTick(() => {
        this.selected = "";
        this.$store.commit("selected", "");
        this.panel.info.open = false;
        this.panel.info.tall = false;
      });
    },
    slug(word) {
      return word
        .replace(/[^\w\s-]/gi, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
    },
    showWildernessProtection() {
      //check if user closed form
      const hasShown = sessionStorage.getItem("no-email");
      const hasSubmitted = localStorage.getItem("wilder_protect");
      if (hasShown || hasSubmitted) {
        return;
      }
      if (this.$store.state.viewedTrailCount >= config.app.trailViewLimit) {
        this.showPopup = true;
        return;
      }
      // set increase trail view count
      this.$store.dispatch("increaseViewTrailCount");
    },
    focus(bounds) {
      if (Array.isArray(bounds) && bounds.length) {
        this.bounds = bounds;
      }

      this.search.open = false;
    },
    navigate(id) {
      const item = this.items.find((obj) => obj.id === id);
      this.$router.push(this.route(item));
    },
    push(entries, key = "primary") {
      this.$store.commit("ids", { key, val: entries.map((en) => en.id) });
      this.entries.push(...entries);
    },
    reset() {
      if (!this.resettable) return;

      this.deselect();

      this.search.input = "";
      this.search.open = false;
      this.filter.active = [];
      this.filter.roundtripDistance = [0, 50];
      this.filter.elevationGain = [0, 10000];
      this.filter.open = false;
      this.geo.options.style = geo_style;
    },
    restorePreviousState() {
      const state = this.$store.state.history[this.$route.name];

      if (state.pane && ["list", "map"].includes(state.pane)) {
        this.pane.active = state.pane;
      }

      if (Array.isArray(state.filters)) {
        this.filter.active = state.filters;
      }

      if (state.selected && this.$store.state.entries[state.selected]) {
        this.$store.commit("selected", state.selected);
        this.selected = state.selected;
        this.panel.info.open = true;
        this.panel.info.tall = true;
      }

      if (state.basemap) {
        this.geo.options.style = state.basemap;
      }

      this.$store.commit("history.remove", this.$route.name);
    },
    route(en) {
      return { name: "entry", params: { id: en.id } };
    },
    scrollTo(id) {
      if (!id) return;

      this.$nextTick(() => {
        this.$scrollTo("#list-item-" + id, {
          container: ".pane-list",
          easing: "ease-out",
          offset: -90,
          onDone: () => {
            this.scrolling = false;
          },
        });
      });
    },
    select(title, ctx = "list") {
      if (!title) return;
      let item;
      if (ctx === "map" || ctx === "search") {
        item = this.items.find((item) => this.slug(item.id) === title);
        title = this.slug(item.title);

        if (window.dataLayer) {
          if (ctx === "map") {
            console.log("Map Link", { ctx, title, item });
            window.dataLayer.push({
              event: "virtualPageview",
              pageUrl: window.location.href, //URL shown in URL bar
              pageTitle: `Hike Wild Montana - ${item.title}`, //site name - {trail name},
              trailName: item.title,
              action: "Click - Map Link",
            });
          } else if (ctx === "search") {
            console.log("Search Link", { ctx, title, item });
            window.dataLayer.push({
              event: "virtualPageview",
              pageUrl: window.location.href, //URL shown in URL bar
              pageTitle: `Hike Wild Montana - ${item.title}`, //site name - {trail name},
              trailName: item.title,
              action: "Click - Search Link",
            });
          }
        }
      } else {
        title = this.slug(title);
        item = this.items.find((item) => this.slug(item.title) === title);
        console.log("Navigation Link", { ctx, title, item });
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "virtualPageview",
            pageUrl: window.location.href, //URL shown in URL bar
            pageTitle: `Hike Wild Montana - ${item.title}`, //site name - {trail name},
            trailName: item.title,
            action: "Click - Navigation Link",
          });
        }
      }
      if (!item) return;

      const id = item.id;
      this.selected = this.selected === id ? "" : id;
      this.selectedTitle = this.selected ? title : "";
      this.$store.commit("selected", this.selected);
      this.pane.active = "map";
      this.search.open = false;
      this.panel.info.open = !!this.selected;
      this.$router.replace(
        this.selected ? { query: { trail: title } } : { query: {} }
      );

      this.showWildernessProtection();

      if (this.panel.info.open) {
        const panel = document.querySelector(".info .panel");
        if (panel) panel.scrollTop = 0;
      }

      if (this.selected && ctx !== "list" && !this.scrolling) {
        this.scrollTo(this.selected);
      }
    },
    sort(items, key) {
      return items.sort((a, b) => a[key].localeCompare(b[key]));
    },
    touch(el, e) {
      const filters = document.querySelector(".top-filters");
      const panel = document.querySelector(".info > .panel");
      const share = document.querySelector(".share");

      if (
        el === "info:background" &&
        this.panel.info.open &&
        !this.panel.info.tall
      ) {
        this.panel.info.tall = true;
      }

      if (el === "info:handle" && this.panel.info.open) {
        if (this.panel.info.tall) panel.scrollTop = 0;
        this.panel.info.tall = !this.panel.info.tall;
        console.log("TOGGLE info:handle", {
          selected: this.selected,
          tall: this.panel.info.tall,
        });

        if (window.dataLayer) {
          window.dataLayer.push({
            event: this.panel.info.tall
              ? "Show Trail Details"
              : "Hide Trail Details",
            pageUrl: window.location.href, //URL shown in URL bar
            pageTitle: `Hike Wild Montana - ${this.entry.title}`, //site name - {trail name},
            trailName: this.entry.title,
            action: "Click - Trail Details",
          });
        }
      }

      if (el.startsWith("geo") && this.panel.info.tall) {
        panel.scrollTop = 0;
        this.panel.info.tall = false;
      }

      if (e && e.target && !filters.contains(e.target)) {
        this.filter.open = false;
        this.search.open = false;
      }

      if (
        e &&
        e.target &&
        this.$store.state.share &&
        !share.contains(e.target)
      ) {
        this.$store.state.share = false;
      }
    },
    toggleActivePane() {
      this.pane.active = this.pane.active !== "list" ? "list" : "map";
    },
    toggleFilterPanel() {
      this.filter.open = !this.filter.open;
      if (this.filter.open) {
        this.search.open = false;
        this.filter.distance = false;
      }
    },
    toggleDistancePanel() {
      this.filter.distance = !this.filter.distance;
      if (this.filter.distance) {
        this.search.open = false;
        this.filter.open = false;
      }
    },
    toggleSearchPanel() {
      this.search.open = !this.search.open;
      if (this.search.open) {
        this.filter.open = false;
        this.filter.distance = false;
      }
    },
    updateFilters(filters) {
      this.geo.options.fit = true;
      this.deselect();
      this.filter.active = Object.keys(filters)
        .map((k) => filters[k].options.filter((o) => o.active).map((o) => o.id))
        .reduce((all, one) => all.concat(one), []);
    },
    updateRoundtripDistance(roundtripDistance) {
      this.geo.options.fit = true;
      this.deselect();
      this.filter.roundtripDistance = roundtripDistance;
    },
    updateElevationGain(elevationGain) {
      this.geo.options.fit = true;
      this.deselect();
      this.filter.elevationGain = elevationGain;
    },
  },
  mounted() {
    // console.log("INDEX MOUNTED", { dataLayer: window.dataLayer });
    if (this.$store.state.iframed !== true) {
      this.geo.options.scrollZoom = true;
    }

    if (this.$route.name in this.$store.state.history) {
      this.restorePreviousState();
    } else {
      this.$store.commit("selected", "");
    }

    this.loading = true;

    this.getEntries().then(() => {
      this.loading = false;
      this.geo.options.fit = true;

      if (
        this.id &&
        !this.selected &&
        this.entries.find((en) => en.id === this.id)
      ) {
        this.$store.commit("selected", this.id);
        this.selected = this.id;
        this.panel.info.open = true;
      }
    });

    this.$store.watch(this.$store.getters.selected, (id) => {
      if (id !== this.selected) {
        this.select(id, "map");
      }
    });

    if (this.selected && this.id) {
      this.scrollTo(this.id);
    }

    const search = {
      button: document.querySelector(".search-button"),
      input: document.getElementById("search"),
    };

    if (search.button && search.input) {
      search.button.addEventListener("click", (e) => {
        if (this.search.open) search.input.focus();
        else search.input.blur();
      });
    }

    this.getSponsors();
    this.getMessages();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("history.add", {
      key: this.$route.name,
      val: {
        basemap: this.geo.options.style,
        filters: this.filter.active,
        pane: this.pane.active,
        selected: this.$store.state.selected,
      },
    });
    next();
  },
};
</script>

<style scoped>
.view {
  margin: 0;
}

.interaction {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.pane-list {
  position: absolute;
  top: 55px;
  left: 0;
  z-index: var(--z-above);
  width: 100%;
  height: calc(100% - 55px);
  overflow-y: hidden;
  background-color: white;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.05);
  transition: transform var(--duration-shortest) ease-out;
  -webkit-overflow-scrolling: touch;
  backface-visibility: hidden;
}

.pane-list.scrollable {
  overflow-y: auto;
}

.pane-list:not(.pane-active) {
  transform: translateX(-100%);
}

.pane-list .top {
  position: sticky;
  top: 0;
  z-index: var(--z-navbar);
  width: 100%;
}

@media (min-width: 1024px) {
  .pane-list {
    width: 400px !important;
  }

  .pane-list:not(.pane-active) {
    transform: none;
  }

  .pane-list .top {
    width: 400px;
  }
}

.pane-list .top-filters {
  z-index: 3;
  height: 60px;
  padding: 12px;
  background-color: var(--color-bg-filters);
}

.pane-list .top-filters .button {
  display: block;
  position: absolute;
  top: 0;
  margin: 0;
  padding: 1.8rem 1rem;
  width: 60px;
  height: 59px;
  font-weight: var(--font-weight-light);
  transition: transform var(--duration-short), opacity var(--duration-short);
}

.pane-list .top-filters .button:not(.active):hover {
  transform: scale(1.05);
  opacity: 0.8;
}

.pane-list .top-filters .filter-button {
  width: auto;
  padding: 2.1rem 0.6rem;
}

.pane-list .top-filters .search-button {
  top: 2px;
  right: 60px;
}

.pane-list .top-filters .toggle-button {
  right: 0px;
}

@media (min-width: 1024px) {
  .pane-list .top-filters .search-button {
    right: 0px;
  }

  .pane-list .top-filters .toggle-button {
    display: none;
  }
}

.pane-list .top-filters .panel {
  position: absolute;
  z-index: -2;
  top: 60px;
  left: 0;
  width: 100%;
  max-height: calc(100vh - 115px);
  padding: 2rem;
  overflow-y: scroll;
  background-color: var(--color-bg-filters-panel);
  box-shadow: var(--box-shadow-small);
  transform: translateY(-170%);
  opacity: 0;
  transition: transform var(--duration-shortest);
  transition-timing-function: var(--ease-out-cubic);
}

.pane-list .top-filters .panel.open {
  transform: none;
  opacity: 0.9;
}

.pane-list .top-info {
  position: relative;
  z-index: -3;
  width: 100%;
  height: 30px;
  background-color: var(--color-border);
}

.pane-list .top-info .count,
.pane-list .top-info button {
  font-size: 85%;
  line-height: 1;
}

.pane-list .top-info .count {
  position: absolute;
  top: 10px;
  left: 20px;
  color: var(--color-text-grey-medium);
}

.pane-list .top-info button {
  position: absolute;
  top: 9px;
  right: 8px;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: default;
  transition: opacity var(--duration-short);
}

.pane-list .top-info .active button {
  opacity: 1;
  cursor: pointer;
}

.pane-list .top-info .active button:hover {
  opacity: 0.8;
}

.pane-list .list-items {
  padding-top: 0px;
}

.pane-map {
  position: absolute;
  top: 55px;
  right: 0;
  z-index: var(--z-default);
  width: 100%;
  height: calc(100% - 55px);
  overflow: hidden;
}
.pane-map.has-banner,
.pane-list.has-banner {
  top: 122px;
}

@media (min-width: 1024px) {
  .pane-map {
    width: calc(100vw - 400px) !important;
  }
}

@media (max-width: 600px) {
  .pane-map {
  }
}

@media (max-width: 466px) {
  .pane-map.has-banner,
  .pane-list.has-banner {
    top: 112px;
  }
}

@media (max-width: 414px) {
  .pane-map.has-banner,
  .pane-list.has-banner {
    top: 120px;
  }
}

.geo {
  height: 100%;
}

.pane-map .loading {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  line-height: 1;
  color: var(--color-text-grey-lightest);
}
</style>
