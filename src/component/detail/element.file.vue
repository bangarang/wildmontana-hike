<template>
  <div class="element-file">
    <div class="data">
      <ui-images v-if="variant == 'images'" :id="element.id" :images="element.data"></ui-images>
      <div v-else class="downloads">
        <ui-download v-for="file of element.data" :data="file" :key="file.id"></ui-download>
      </div>
    </div>
  </div>
</template>

<script>
  import Download from '../download.vue';
  import Images from '../images.vue';

  export default {
    name: 'element-file',
    components: {
      'ui-download': Download,
      'ui-images': Images
    },
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {
      variant() {
        if (this.element.data.every(file => file.type.startsWith('image/'))) {
          return 'images';
        }
        return 'downloads';
      }
    }
  };
</script>

<style scoped>
  .downloads {
    margin-top: 1rem;
  }
</style>
