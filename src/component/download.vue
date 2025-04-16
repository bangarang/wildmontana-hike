<template>
  <div class="download">
    <a :href="url" :title="label" class="ellipsis">
      <ui-icon :name="icon"></ui-icon>
      <span class="label">{{ label }}</span>
    </a>
  </div>
</template>

<script>
  import Icon from './icon.vue';

  export default {
    name: 'ui-download',
    components: {
      'ui-icon': Icon
    },
    props: {
      file: {
        type: Object,
        required: true
      }
    },
    computed: {
      icon() {
        let name = 'file';
        if (this.file.type === 'application/pdf') name += '-document';
        if (this.file.type.startsWith('image')) name += '-image';
        if (this.file.type.startsWith('video')) name += '-video';
        if (this.file.type === 'application/zip') name += '-archive';
        return name;
      },
      label() {
        return this.file.title || this.file.name;
      },
      url() {
        return this.file.url + '?dl=true';
      }
    }
  };
</script>

<style scoped>
  .download {
    margin-bottom: 0.5rem;
  }

  .download a {
    border: none;
  }

  .download .icon {
    height: 28px;
  }

  .label {
    margin-left: 0.7rem;
  }
</style>
