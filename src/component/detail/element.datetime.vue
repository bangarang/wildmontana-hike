<template>
  <div class="element-datetime">
    <div v-if="values.length == 1" class="data">{{ values[0] }}</div>
    <ul v-else class="data"><li v-for="v of values">{{ v }}</li></ul>
  </div>
</template>

<script>
  import format from '../../data/format';

  export default {
    name: 'element-datetime',
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        values: []
      };
    },
    mounted() {
      const type = this.element.preferences.data_type || 'date/time';
      this.values = this.element.data.map(values => format.dates(values, type));
    }
  };
</script>

<style scoped>
  ul {
    margin-bottom: 0;
  }
</style>
