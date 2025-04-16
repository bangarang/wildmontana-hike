<template>
  <div :class="{ card: true, active, enabled }">
    <router-link :to="route">
      <div class="image-container">
        <div class="image" :style="image">
          <ui-icon v-if="!entry.image" name="logo" size="8rem" color="c1c0c0"></ui-icon>
        </div>
      </div>
      <div class="text">
        <div class="title ellipsis">{{ title }}</div>
        <div v-if="entry.subtitle" class="subtitle">{{ entry.subtitle }}</div>
        <div class="details">
          {{ $t('view_details') }}
          <ui-icon name="arrow-right"></ui-icon>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  import Icon from './icon.vue';
  import excerpt from '../utility/excerpt';

  export default {
    name: 'ui-card',
    components: {
      'ui-icon': Icon
    },
    props: {
      active: {
        type: Boolean,
        default: false
      },
      enabled: {
        type: Boolean,
        default: true
      },
      entry: {
        type: Object,
        required: true
      }
    },
    computed: {
      image() {
        if (!this.entry.image || !this.entry.image.url) return null;
        const url = this.entry.image.url + '?' + ['w=800', 'h=400', 'fit=crop', 'q=75'].join('&');
        return { backgroundImage: `url(${url})` };
      },
      route() {
        const route = this.$router.options.routes.find(r => r.meta && r.meta.id === this.entry.id);
        return route ? { name: route.name } : { name: 'entry', params: { id: this.entry.id } };
      },
      title() {
        return excerpt(this.entry.title, 90);
      }
    }
  };
</script>

<style scoped>
  .card {
    display: none;
    position: relative;
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
    margin-right: 3rem;
    overflow: hidden;
    background-color: white;
    border-radius: 0.4rem;
    box-shadow: var(--box-shadow-large);
    cursor: pointer;
    transition: all var(--duration-medium) cubic-bezier(0.165, 0.84, 0.44, 1);
    --webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  @media (min-width: 640px) {
    .card {
      width: 250px;
    }
  }

  @media (min-width: 1300px) {
    .card {
      width: 300px;
    }
  }

  .card.enabled {
    display: inline-block;
  }

  .card.active {
    box-shadow: var(--box-shadow-xl);
    transform: translateY(-30px);
  }

  .card:not(.active):hover {
    box-shadow: var(--box-shadow-xl);
    transform: scale(1.02, 1.02);
  }

  .card > a {
    display: block;
    color: var(--color-text-default) !important;
    border: none;
  }

  .card > a:hover,
  .card > a:active {
    opacity: 1;
  }

  .image-container {
    overflow: hidden;
  }

  .image {
    position: relative;
    width: 100%;
    height: 200px;
    text-align: center;
    background: 50% no-repeat var(--color-bg-placeholder);
    background-size: cover;
    border-radius: 0.4rem 0.4rem 0 0;
  }

  .image > .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -4rem 0 0 -4rem;
  }

  .title {
    font-size: 95%;
    line-height: 140%;
    font-weight: var(--font-weight-heavy);
  }

  .text {
    padding: 2rem;
  }

  .subtitle {
    margin-top: 0.5rem;
    font-size: 85%;
    line-height: 150%;
    color: var(--color-text-grey-light);
  }

  .details {
    margin-top: 1.5rem;
    font-size: 90%;
    line-height: 1;
    color: var(--color-bg-highlight);
  }

  .details {
    border: none;
    transition: color var(--duration-short);
  }

  .details .icon {
    margin-top: -1px;
    transition: transform var(--duration-short) ease-out;
  }

  .card:hover .details .icon {
    transform: translateX(5px);
  }
</style>
