<template>
  <div class="element-text">
    <div :class="{ text: true, 'text-summary': type == 'summary' }">
      <div v-if="format == 'json'" class="data"><pre><code>{{ text | json }}</code></pre></div>
      <div v-else-if="format == 'html'" class="data" v-html="text"></div>
      <div v-else-if="format == 'markdown'" class="data" v-html="$options.filters.markdown(text)"></div>
      <div v-else class="data">{{ text }}</div>
    </div>
  </div>
</template>

<script>
  import config from '../../../config';

  export default {
    name: 'element-text',
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {
      format() {
        const f = this.element.preferences.iana_type || 'text/plain';
        if (['application/json', 'application/geo+json'].includes(f)) return 'json';
        if (f === 'text/markdown') return 'markdown';
        if (f === 'text/html') return 'html';
        return 'plain';
      },
      text() {
        return this.element.data;
      },
      type() {
        return this.element.id === config.id.element.text.summary ? 'summary' : 'text';
      }
    }
  };
</script>

<style scoped>
  .text-summary {
    color: var(--color-text-default) !important;
    margin-bottom: 16px;
  }
</style>
