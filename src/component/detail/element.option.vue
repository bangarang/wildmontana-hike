<template>
  <div class="element-option">
    <div v-if="form" class="element-option-form">
      <ui-form v-for="o of options" :id="o.id" :text="o.text" :key="o.id"></ui-form>
    </div>
    <div v-else-if="options.length == 1" class="data">
      {{ options[0].text }}
    </div>
    <ul v-else class="data">
      <li v-for="o of options">{{ o.text }}</li>
    </ul>
  </div>
</template>

<script>
  import Form from '../form.vue';
  import config from '../../../config';

  export default {
    name: 'element-option',
    components: {
      'ui-form': Form
    },
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {
      form() {
        return this.element.id === config.id.element.option.form;
      },
      options() {
        return this.element.data;
      }
    }
  };
</script>


<style scoped>
  div.data {
    list-style: disc;
    display: list-item;
    margin-left: 18px;
  }
  div.data::marker {
    color: #9e4749;
  }
</style>
