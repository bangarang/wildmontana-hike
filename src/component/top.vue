<template>
  <div class="top">
    <div class="inner clearfix">
      <div class="inner-left">
        <div class="top-filters">
          <!-- Filters -->
          <div class="button--wrapper">
            <ui-button
              v-if="filters"
              :class="{
                'filter-button': true,
                'button-clear': true,
                active: filterOpen,
              }"
              icon="chevron"
              icon-position="right"
              icon-size="1.7rem"
              :icon-transform="filterOpen ? 'none' : 'rotate(-180deg)'"
              :color="filterOpen ? '#fff' : '#fff'"
              label="Trail Features"
              @click.native="toggleFilterPanel"
            ></ui-button>
            <ui-filters
              v-if="filters"
              :filters="filters"
              :class="{ panel: true, open: filterOpen }"
              @changed="updateFilters"
              :roundtripDistance="roundtripDistance"
              @roundtrip="updateRoundtripDistance"
              :elevationGain="elevationGain"
              @elevation="updateElevationGain"
            ></ui-filters>
          </div>
          <div class="button--wrapper elevation--button--wrapper">
            <ui-button
              v-if="filters"
              :class="{
                'filter-button': true,
                'button-clear': true,
                active: filterOpen,
              }"
              icon="chevron"
              icon-position="right"
              icon-size="1.7rem"
              :icon-transform="distanceOpen ? 'none' : 'rotate(-180deg)'"
              :color="distanceOpen ? '#fff' : '#fff'"
              label="Mileage & Elevation"
              @click.native="toggleDistancePanel"
            ></ui-button>
            <ui-distance-elevation
              :class="{ panel: true, open: distanceOpen }"
              @changed="updateFilters"
              :roundtripDistance="roundtripDistance"
              @roundtrip="updateRoundtripDistance"
              :elevationGain="elevationGain"
              @elevation="updateElevationGain"
            ></ui-distance-elevation>
          </div>
          <div class="button--wrapper">
            <ui-button
              :class="{
                'button-clear': true,
                active: search.open,
              }"
              :search="true"
              icon="chevron"
              :icon-transform="search.open ? 'none' : 'rotate(-180deg)'"
              icon-position="right"
              icon-size="1.7rem"
              :color="'#FFFFFF'"
              :title="$t('search')"
              @click.native="toggleSearchPanel"
            ></ui-button>
            <ui-search
              :entries="items"
              :class="{ panel: true, open: search.open }"
              @focused="focus"
              @selected="select"
            ></ui-search>
          </div>
        </div>
      </div>
      <div class="inner-right">
        <router-link
          replace
          v-if="$route.name != 'signup'"
          @click.native="sendAnalytics"
          to="/hike/signup"
          class="button signup-button button-clear"
        >
          <ui-icon name="trail-dude" size="1.5rem"></ui-icon>
          <span class="signup-button-label">{{ $t("add_trail") }}</span>
          <span class="signup-button-short-label">{{
            $t("short_add_trail")
          }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "./icon.vue";

import Filters from "./index/filters.vue";
import DistanceElevation from "./index/distanceElevation.vue";
import Button from "./button.vue";
import Search from "./index/search.vue";

export default {
  name: "ui-top",
  components: {
    "ui-icon": Icon,
    "ui-button": Button,
    "ui-filters": Filters,
    "ui-distance-elevation": DistanceElevation,
    "ui-search": Search,
  },
  props: {
    filterOpen: {
      type: Boolean,
      default: false,
    },
    distanceOpen: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Object,
    },
    search: {
      type: Object,
    },
    items: {
      type: Array,
    },
    toggleFilterPanel: {
      type: Function,
    },
    toggleDistancePanel: {
      type: Function,
    },
    toggleSearchPanel: {
      type: Function,
    },
    updateFilters: {
      type: Function,
    },
    roundtripDistance: {
      type: Array,
    },
    updateRoundtripDistance: {
      type: Function,
    },
    elevationGain: {
      type: Array,
    },
    updateElevationGain: {
      type: Function,
    },
    select: {
      type: Function,
    },
  },
  methods: {
    sendAnalytics() {
      console.log("Add a Trail Clicked");
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "Add a Trail",
          pageUrl: window.location.href, //URL shown in URL bar
          // pageTitle: "Hike Wild Montana - Allen Peak Trail 466", //site name - {trail name},
          // trailName: "Allen Peak Trail 466",
          action: "Click - Add Trail",
        });
      }
    },
  },
};
</script>

<style scoped>
.top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-navbar);
  background-color: #333;
  box-shadow: var(--box-shadow-medium);
}

.inner {
  position: relative;
}

.inner-left {
  line-height: 1;
}

.inner-right {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
}

.inner-right .button {
  margin: 0;
  padding: 20px 19px;
  font-size: 16px;
  font-weight: var(--font-weight-light);
  color: white;
  background: none;
  border: none;
}

.inner-right .button,
.inner-right .button:hover,
.inner-right .button:active,
.inner-right .button:focus {
  border-color: transparent;
}

.inner-right .button > .icon {
  margin-top: -1px;
  margin-right: 5px;
  transition: transform 0.2s cubic-bezier(0.35, 0, 0.25, 1);
}

.button:hover {
  opacity: 0.7;
}

.logo {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  padding: 3px 0px 2px 0px;
  font-size: 2.6rem;
  line-height: 1;
  color: white;
}

.logo:hover,
.logo:active {
  color: rgba(255, 255, 255, 0.8);
}
.logo-img {
  width: 350px;
}
.signup-button-short-label {
  display: none;
}

.top .top-filters {
  z-index: 3;
}

.top .top-filters .button {
  display: inline-block;
  position: relative;
  padding: 15px 18px;
  font-weight: var(--font-weight-light);
  transition: transform var(--duration-short), opacity var(--duration-short);
  text-transform: none;
  background: none;
  border: none;
}

.top .top-filters .button:not(.active):hover {
  opacity: 0.8;
}

.top .top-filters .filter-button {
  width: auto;
  margin: 0;
}

.top .top-filters .search-button {
  top: 2px;
  right: 60px;
}

.top .top-filters .toggle-button {
  right: 0px;
}

.top .top-filters .panel {
  position: absolute;
  z-index: -2;
  max-height: calc(100vh - 115px);
  padding: 2rem;
  overflow-y: scroll;
  width: 450px;
  background-color: #0f282f;
  box-shadow: var(--box-shadow-small);
  transform: translateY(-15px);
  opacity: 0;
  transition: transform var(--duration-shortest);
  transition-timing-function: var(--ease-out-cubic);
  pointer-events: none;
}

.button--wrapper {
  position: relative;
  display: inline-block;
}

[type="checkbox"] {
  opacity: 1;
  pointer-events: all;
  position: relative;
  width: unset;
}

.top .top-filters .panel.open {
  transform: none;
  opacity: 1;
  pointer-events: all;
}

.elevation--button--wrapper {
  display: inline-block;
}

@media (max-width: 720px) {
  .elevation--button--wrapper {
    display: none;
  }
}

@media (max-width: 475px) {
  .logo-img {
    width: 280px;
  }
  .signup-button-label {
    display: none;
  }
  .top .top-filters .panel {
    max-width: 100vw;
    padding: 1rem;
  }
}
</style>
