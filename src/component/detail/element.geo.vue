<template>
  <div :class="{ 'element-geo': true, empty: empty === true }">
    <ui-geo
      v-if="variant == 'features'"
      :features="features"
      :id="'geo-element-' + element.id"
      :location-control="locateUser"
      :selection-monitoring="false"
      :options="options"
      ref="geo"
    >
    </ui-geo>
    <div v-else-if="variant == 'businesses' && entries.length" class="businesses">
      <!--      <p v-if="label" class="subheading">{{ label }}</p>-->
      <ui-list :entries="entries" :config="{ type: 'swiper' }"></ui-list>
    </div>
  </div>
</template>

<script>
  import Geo from '../geo.vue';
  import List from '../list-swiper.vue';
  import features from '../../utility/features';
  import config from '../../../config';

  export default {
    name: 'element-geo',
    components: {
      'ui-geo': Geo,
      'ui-list': List
    },
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        empty: null,
        entries: [],
        locateUser: {
          enabled: true,
          options: {
            fitBoundsOptions: {
              maxZoom: config.geo.zoom.locate
            },
            positionOptions: {
              enableHighAccuracy: true
            },
            showUserLocation: true,
            trackUserLocation: false
          },
          position: 'top-right'
        },
        options: {
          center: this.element.data.point ? this.element.data.point.split(',') : config.geo.center,
          fit: true,
          style: config.geo.styles[config.geo.style],
          zoom: this.element.data.zoom || config.geo.zoom.initial
        },
        styles: config.geo.styles
      };
    },
    computed: {
      features() {
        const data = this.element.data;

        const props = {
          opacity: config.geo.point.opacity[0],
          point: data.point ? data.point.split(',') : [],
          radius: config.geo.point.radius[0],
          zoom: data.zoom ? data.zoom : null
        };

        if (this.options.style === config.geo.styles.hybrid) {
          props['color-path'] = 'rgba(255, 255, 255, 0.5)';
          props['color-polygon'] = 'rgba(255, 255, 255, 0.3)';
        }

        return features(data, props);
      },
      label() {
        return this.element.id === config.id.element.geo.nearby ? this.$t('nearby') : '';
      },
      variant() {
        return this.element.id === config.id.element.geo.nearby ? 'businesses' : 'features';
      }
    },
    methods: {
      async getBusinesses() {
        const features = this.element.data.features;
        if (!Array.isArray(features) || !features.length) return;

        const area = features.find(f => f.type.type === 'polygon' && f.json);
        const polygon = area ? area.json.slice(area.json.indexOf('['), -1) : '';
        if (!polygon.startsWith('[') || !polygon.endsWith(']')) return;

        const params = {
          polygon,
          type: config.id.type.business,
          order: 'title',
          page: 1,
          limit: 10
        };

        try {
          const { index } = await this.$store.dispatch('entries', { params });
          this.entries = index;
        } catch (err) {
          console.error(err);
        }

        if (!this.entries.length) {
          this.empty = true;
        }
      },
      changeStyle(style) {
        this.options.style = config.geo.styles[style];
      }
    },
    mounted() {
      if (this.variant === 'businesses') {
        this.getBusinesses();
      }
    }
  };
</script>

<style scoped>
  .element-geo.empty {
    margin-top: -2rem;
  }

  .geo {
    height: 100%;
  }

  .businesses .subheading {
    margin-bottom: 2rem;
  }
</style>
