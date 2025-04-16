<template>
  <svg :class="'icon icon-' + name" :style="styles">
    <use :xlink:href="'/static/icons.svg#icon-' + name"></use>
  </svg>
</template>

<script>
  export default {
    name: 'ui-icon',
    props: {
      color: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: ''
      },
      transform: {
        type: String,
        default: ''
      }
    },
    computed: {
      styles() {
        const props = {
          'color': this.color || 'inherit',
          'font-size': this.size || 'inherit'
        };

        if (this.transform) {
          props.transform = this.transform;
        }

        return props;
      }
    }
  };
</script>
