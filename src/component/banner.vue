<template>
  <div v-if="banner" class="banner">
    <div class="banner-text">
      <markdown>{{bannerText}}</markdown>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import config from '../../config'

export default {
  name: "ui-banner",
  components: {
    'markdown': VueMarkdown
  },
  data() {
    return {
      banner: undefined,
      bannerEntryId: config.id.group.entry.banner
    };
  },
  computed: {
    bannerText() {
      const optionElement = this.banner.elements.find(el => el.id === config.id.option.bannerText)
      return  optionElement.data || "";
    }
  },
  methods: {
    getBanner() {
      const params = {
        page: 1,
        limit: 25,
        order: "title",
        first: true,
        id: this.bannerEntryId
      };
      const options = {
        params,
        previewing: this.$route.query.preview === "true"
      };

      this.$store
        .dispatch("entries", options)
        .then(entry => {
          if (entry && entry.index.length > 0) {
            this.banner = entry.index[0];
            this.$emit('setHasBanner');
          }
        })
        .catch(err => console.error(err.message));
    }
  },
  mounted() {
    if (this.bannerEntryId) {
      this.getBanner();
    }
  }
};
</script>

<style scoped>
.banner {
  position: absolute;
  z-index: var(--z-navbar);
  top: 64px;
  left: 0;
  right: 0;
}
.banner-text {
  padding: 15px;
  background-color: var(--color-bg-highlight);
  color: #FFFFFF;
  text-align: center;
  font-size: 14px;
}
@media (max-width: 466px) {
    .banner {
      top: 55px;
    }
  }

@media (max-width: 414px) {
    .banner-text {
      line-height: 18px;
    }
  }
</style>