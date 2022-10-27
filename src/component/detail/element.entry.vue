<template>
  <div class="element-entry">

    <div class="data">
      <ui-list :entries="entries" :slug="slug"></ui-list>
    </div>
    <div class="signup">
      <router-link
        replace
        :to="{ name: 'signup' }"
        class="button signup-button"
      >
        <ui-icon name="report" size="1.5rem"></ui-icon>
        {{ $t("add_trail_report") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import List from "../list.vue";
import Icon from "../../component/icon.vue";
import config from "../../../config";

export default {
  name: "element-entry",
  components: {
    "ui-list": List,
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
    };
  },
  methods: {
    async getEntries() {
      const phases = config.elebase.phases;
      const entries = this.element.data.filter((en) =>
        phases.includes(en.phase)
      );
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
  mounted() {
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
