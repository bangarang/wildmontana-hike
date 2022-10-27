<template>
  <div :id="'list-item-' + item.id" :class="{ 'list-item': true, selected }" @click="$emit('selected')">
    <div v-if="item.featured" class="featured" :title="$t('featured')">
      <ui-icon name="star" color="#d9d9d9" size="1.6rem"></ui-icon>
    </div>
    <div class="text">
      <div class="title" :title="title">{{ title }}</div>
    </div>
    <div class="footer">
      <div class="trail-length">
        <span class="label">{{ $t('distance') }}:</span>
        <span>{{trailLength}} mi.</span>
      </div>
      <div class="elevation">
        <span class="label">{{ $t('elevation') }}:</span>
        <span>{{elevation}} ft.</span>
      </div>
    </div>
    <div class="highlight"></div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  import Icon from '../icon.vue';
  import config from '../../../config';
  import excerpt from '../../utility/excerpt';

  export default {
    name: 'index-list-item',
    serverCacheKey: props => `${props.item.id}::${props.locale}`,
    components: {
      'ui-icon': Icon
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      locale: {
        type: String,
        default: 'en'
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      color() {
        return config.app.color.highlight || '#111';
      },
      image() {
        if (!this.item.image || !this.item.image.url) {
          return { borderColor: '#dedede' };
        }

        const dpr = typeof window !== undefined ? window.devicePixelRatio : 1;
        const bg = `url(${this.item.image.url}?w=75&h=75&fit=crop&dpr=${dpr}&q=75)`;

        return { backgroundImage: bg };
      },
      summary() {
        return excerpt(this.item.summary, 200);
      },
      title() {
        return excerpt(this.item.title, 90);
      },
      walk() {
        return this.item.walk.url && this.item.walk.dates.length > 0;
      },
      trailLength() {
        const element = this.item.elements.find(element => element.id === config.id.element.trailLength)
        return element ? element.data.toLocaleString() : ''
      },
      elevation() {
         const element = this.item.elements.find(element => element.id === config.id.element.elevationGain)
        return element ? element.data.toLocaleString() : ''
      }
    }
  };
</script>

<style>
  .list-item:nth-child(odd) {
    background: #FFF6E1;
  }
  .list-item:nth-child(even) {
    background: #FFF;
  }
</style>

<style scoped>
  .list-item {
    position: relative;
    z-index: var(--z-default);
    min-height: 111px;
    padding: 20px 20px 17px 20px;
    clear: both;
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .list-item-move {
    transition: all var(--duration-short) var(--ease-in-out-cubic) 50ms;
  }

  .list-item-enter-active {
    transition: all var(--duration-short) var(--ease-out-cubic);
  }

  .list-item-leave-active {
    position: absolute;
    z-index: 0;
    transition: all var(--duration-short) var(--ease-out-cubic);
  }

  .list-item-enter,
  .list-item-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }

  .list-item.selected {
    padding-left: 20px;
    background-color: #163C47;
    color: #fff;
  }

  .list-item.selected .title {
    //font-weight: var(--font-weight-heavy);
    color: #fff;
  }

  .list-item .highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: transparent;
  }

  .list-item.selected .highlight {
    background-color: var(--color-bg-highlight);
  }

  .list-item .featured {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    text-align: center;
  }

  .list-item .featured > .icon {
    margin-top: 4px;
  }

  .list-item:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }

  .list-item .image {
    position: relative;
    float: left;
    width: 75px;
    height: 75px;
    margin: 0 10px 10px 0;
    background: 50% no-repeat var(--color-bg-placeholder);
    background-size: cover;
    border: 1px solid #f1f1f1;
    border-radius: var(--border-radius);
  }

  .list-item .image > .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -1.5rem 0 0 -1.5rem;
  }

  .list-item .badge {
    position: absolute;
    bottom: 5px;
    left: 5px;
    width: 2.2rem;
    height: 2.2rem;
    text-align: center;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  .list-item .title {
    font-family: Lato, sans-serif;
    color: #163C47;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 14px;
  }

  .list-item .summary {
    margin-top: 0.7rem;
    overflow: hidden;
    font-size: 80%;
    line-height: 140%;
    color: var(--color-text-grey);
  }

  .list-item .more {
    z-index: 2;
    margin-top: 1rem;
    margin-left: 135px;
    text-align: left;
    line-height: 1;
  }
  .list-item .footer {
    font-family: Lato, sans-serif;
    width: 100%;
    justify-content: space-between;
  }
  .list-item .footer .label {
    font-weight: var(--font-weight-heavy);
  }
  .list-item .footer {
    font-size: 13px;
  }
</style>
