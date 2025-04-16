<template>
  <div class="search">
    <input :id="id" type="search" v-model="input" :placeholder="$t('search') + '...'">
    <div v-if="resultsFound" class="results">
      <div class="section entries">
        <div class="heading">{{ $t('entries') }}</div>
        <div
          v-for="en of results.entries"
          :class="{ result: true, entry: true, selected: selected == en.id }"
          @click="selectEntry(en.id)"
        >{{ en.title }}</div>
      </div>
      <div v-if="placeSearchEnabled" class="section places">
        <div class="heading">{{ $t('other_places') }}</div>
        <div
          v-for="p of results.places"
          :class="{ result: true, place: true, selected: selected == p.id }"
          @click="selectPlace(p)"
        >{{ p.place_name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import bbox from '@turf/bbox';
  import config from '../../../config';
  import http from 'axios';

  let Fuse;

  export default {
    name: 'index-search',
    props: {
      entries: {
        type: Array,
        default: () => []
      },
      id: {
        type: String,
        default: 'search'
      }
    },
    data() {
      return {
        input: '',
        results: {
          entries: [],
          places: []
        },
        selected: ''
      };
    },
    computed: {
      placeSearchEnabled() {
        return config.geo.search === true;
      },
      resultsFound() {
        if (this.results.entries && this.results.entries.length) return true;
        if (this.results.places && this.results.places.length) return true;
        return false;
      }
    },
    watch: {
      input(q) {
        q = q.trim();

        if (q === '') {
          this.results.entries = [];
          this.results.places = [];
          return;
        }

        this.searchEntries(q).then(entries => this.results.entries = entries);

        if (this.placeSearchEnabled) {
          this.searchPlaces(q).then(places => this.results.places = places);
        }
      }
    },
    methods: {
      init() {
        Fuse = require('fuse.js');

        this.fuse = new Fuse(this.entries, {
          keys: [
            { name: 'title', weight: 0.6 },
            { name: 'summary', weight: 0.2 }
          ]
        });

        if (this.placeSearchEnabled) {
          const params = { access_token: config.geo.token, language: 'en' };

          if (config.geo.bbox && config.geo.bbox.length === 4) {
            params.bbox = config.geo.bbox.join();
          }

          if (this.$route.params.locale) {
            params.language = this.$route.params.locale;
          }

          this.mapbox = { params };
        }
      },
      async searchEntries(q) {
        return await this.fuse.search(q).slice(0, 5);
      },
      async searchPlaces(q) {
        if (q.length < 3) return;

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json`;
        const options = { params: this.mapbox.params };

        try {
          const res = await http.get(url, options);
          if (res.data && Array.isArray(res.data.features)) {
            return res.data.features;
          }
        } catch (err) {
          console.error(err);
        }

        return [];
      },
      selectEntry(id) {
        if (this.selected === id) return;
        this.selected = id;
        this.$emit('selected', this.selected, 'search');
      },
      selectPlace(p) {
        let bounds = [];

        if (p.bbox && p.bbox.length) {
          bounds = p.bbox;
        } else if (p.geometry) {
          const feature = { geometry: p.geometry, properties: null };
          bounds = bbox({ type: 'FeatureCollection', features: [feature] });
        }

        if (bounds && bounds.length === 4) {
          this.$emit('focused', bounds);
        }
      }
    },
    mounted() {
      this.init();
    },
    updated() {
      this.init();
    }
  };
</script>

<style scoped>
  input {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-text-grey);
    width: 100%!important;
    background: #fff;
    border-radius: 4px;
    border: none;
  }
  @media (max-width: 720px) {
    .search {
      left: -200px;
    }
  }

  .section:first-child {
    margin-top: 3rem;
  }

  .section:not(:last-child) {
    margin-bottom: 3rem;
  }

  .section .heading {
    margin-bottom: 1rem;
    font-size: 1.7rem;
    line-height: 1;
    font-weight: var(--font-weight-heavy);
    color: white;
  }

  .result {
    margin-top: 9px;
    padding-top: 9px;
    font-size: 1.4rem;
    line-height: 1.2;
    color: #c7c7c7;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all var(--duration-short);
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  .section .result:nth-child(0n + 2) {
    margin-top: 0;
    border-top: none;
  }

  .result.selected, .result:hover {
    color: #e7e7e7;
  }
</style>
