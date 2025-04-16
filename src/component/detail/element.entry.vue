<template>
  <div class="element-entry">
    <div class="data">
      <ui-list-swiper
        v-if="this.element.config.type === 'swiper'"
        :entries="entries"
        :slug="slug"
      ></ui-list-swiper>
      <ui-list v-else :entries="entries" :slug="slug"></ui-list>
    </div>
  </div>
</template>

<script>
import List from "../list.vue";
import ListSwiper from "../list-swiper.vue";
import Icon from "../../component/icon.vue";
import config from "../../../config";

export default {
  name: "element-entry",
  components: {
    "ui-list": List,
    "ui-list-swiper": ListSwiper,
    "ui-icon": Icon,
  },
  props: {
    element: {
      type: Object,
      required: true,
    },
    slug: {
      type: String | undefined,
    },
  },
  data() {
    return {
      entries: [],
      entriesSwiperInitialized: false,
      entriesSwiperActive: 0,
    };
  },
  methods: {
    async getEntries() {
      console.log("ELEMENT GET ENTRIES", this.element);
      const phases = config.elebase.phases;
      const entries = this.element.data.filter((en) =>
        phases.includes(en.phase)
      );
      console.log({ entries });
      const ordinals = Object.fromEntries(entries.map((en, i) => [en.id, i]));

      try {
        await Promise.all(
          entries.map(async (en) => {
            const entry = await this.$store.dispatch("entries", {
              first: true,
              params: { id: en.id },
              previewing: this.$route.query.preview === "true",
            });
            if (entry) {
              entry.ordinal = ordinals[en.id];
              this.entries.push(entry);
            }
          })
        );
      } catch (err) {
        console.error(err);
      }

      this.entries.sort((a, b) => a.ordinal - b.ordinal);
    },
  },
  nextEntry() {
    if (this.entrySwiperActive < this.newEntryEntries.length - 1) {
      this.entrySwiperActive += 1;
    }
  },

  previousEntry() {
    if (this.entrySwiperActive > 0) {
      this.EntrySwiperActive -= 1;
    }
  },
  mounted() {
    console.log("ELEMENT MOUNTED", this.element);
    this.getEntries();
  },
};
</script>

<style scoped>
.data {
  margin-top: 2rem;
  text-align: left;
}

.data .card {
  text-align: left;
}

.data .card.enabled {
  display: block;
}
.signup {
  margin-top: 30px;
}
.signup a {
  border: none;
  background-color: var(--color-bg-highlight);
}

.signup a > .icon {
  margin-top: -1px;
  margin-right: 5px;
}

@media (min-width: 640px) {
  .data .card.enabled {
    display: inline-block;
  }
}

@media (min-width: 768px) {
  .data {
    padding: 0;
    text-align: left;
  }

  .data .card {
    margin-left: 0;
    margin-right: 30px;
  }
}
</style>
