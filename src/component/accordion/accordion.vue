<template>
  <div class="container">
    <ul class="accordion">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      Accordion: {
        count: 0,
        active: null,
      },
    };
  },
  provide() {
    return { Accordion: this.Accordion };
  },
};
</script>

<style scoped>
.accordion {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
