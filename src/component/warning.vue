<template>
  <div :class="{ warning: true, active }">
    <div class="container">
      <ui-icon name="warning" size="5rem" color="#fff"></ui-icon>
      <div class="text">
        <div class="title">{{ $t('warning.browser.title') }}</div>
        <div class="info">
          <span>{{ $t('warning.browser.info') }} </span>
          <a :href="url" target="_blank" rel="noopener">
            {{ $t('warning.browser.link') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Icon from './icon.vue';

  export default {
    name: 'ui-warning',
    components: {
      'ui-icon': Icon
    },
    data() {
      return {
        active: false
      };
    },
    computed: {
      url() {
        return 'http://outdatedbrowser.com/en';
      }
    },
    methods: {
      dismiss() {
        this.active = false;
      },
      supported() {
        const clr = 'rgb(0, 0, 0)';
        const el = document.createElement('span');
        el.style.setProperty('--test', clr);
        el.style.setProperty('background-color', 'var(--test)');
        document.body.appendChild(el);
        const css = getComputedStyle(el);
        const res = css.backgroundColor === clr;
        document.body.removeChild(el);
        return res;
      },
      warn() {
        this.active = true;
      }
    },
    mounted() {
      if (!this.supported()) {
        this.warn();
      }
    }
  };
</script>

<style scoped>
  .warning {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9000;
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    background-color: #111;
    color: #fff;
    opacity: 0;
    transition: opacity 600ms;
  }

  .warning.active {
    display: block;
    opacity: 1;
  }

  .icon {
    display: none;
    margin-right: 15px;
  }

  @media (min-width: 640px) {
    .icon {
      display: inline-block;
    }
  }

  .text {
    display: inline-block;
    line-height: 1;
  }

  .text .title {
    margin-top: 2px;
    font-weight: 500;
  }

  .text .info {
    margin-top: 7px;
  }
</style>
