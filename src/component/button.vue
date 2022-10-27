<template>
  <button type="button" :class="'button button-icon-' + iconPosition" :title="title" :style="{ color }" :disabled="disabled">
    <svg v-if="search" data-v-2677ca5d="" class="icon" style="color: rgb(255, 255, 255); font-size: 1.5rem;"><use xlink:href="/static/icons.svg#icon-search"></use></svg>
    <span v-if="label && icon && iconPosition == 'right'" class="label label-left">{{ label }}</span>
    <ui-icon v-if="icon" :name="icon" :size="iconSize" :color="iconColor || color" :transform="iconTransform"></ui-icon>
    <span v-if="label && icon && iconPosition == 'left'" class="label label-right">{{ label }}</span>
    <span v-if="label && !icon" class="label">{{ label }}</span>
  </button>
</template>

<script>
  import Icon from './icon.vue';

  export default {
    name: 'ui-button',
    components: {
      'ui-icon': Icon
    },
    props: {
      color: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      icon: {
        type: String,
        default: ''
      },
      iconColor: {
        type: String,
        default: ''
      },
      iconPosition: {
        type: String,
        default: 'left'
      },
      iconSize: {
        type: String,
        default: '1.8rem'
      },
      iconTransform: {
        type: String,
        default: ''
      },
      label: {
        type: [Number, String],
        default: ''
      },
      title: {
        type: String,
        default: null
      }
    }
  };
</script>

<style scoped>
  .button[disabled],
  .button[disabled]:hover,
  .button[disabled]:focus {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .label {
    display: inline-block;
    vertical-align: middle;
  }

  .label-left {
    margin-right: 0.5rem;
    font-size: 14px;
    color: #fff;
    line-height: 24px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .label-right {
    margin-left: 0.5rem;
  }

  .icon {
    transition: transform var(--duration-shortest) var(--ease-in-out-cubic);
    vertical-align: middle;
  }
</style>
