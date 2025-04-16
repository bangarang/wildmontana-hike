<template>
  <div class="element-number">
    <div class="data">{{ number }} {{measurementUnit ? measurementUnit : ""}}</div>
  </div>
</template>

<script>
  export default {
    name: 'element-number',
    props: {
      element: {
        type: Object,
        required: true
      },
      measurementUnit: {
        type: String | undefined
      }
    },
    computed: {
      number() {
        return this.element.data.toLocaleString();
      }
    }
  };
</script>
