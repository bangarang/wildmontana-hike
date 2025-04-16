<template>
  <div class="images">
    <!-- Preview gallery -->
    <div v-show="initialized" :id="id" class="swiper-container" ref="swiper">
      <div class="swiper-wrapper">
        <div v-for="(item, idx) of items" class="swiper-slide">
          <figure>
            <div :id="id + '-cover'" class="cover" @click="expand">
              <img :src="item.preview" :alt="item.title" :title="item.title" />
            </div>
          </figure>
        </div>
      </div>
      <div v-if="items.length > 1" class="nav previous">
        <ui-icon name="arrow-left" size="2.2rem"></ui-icon>
      </div>
      <div v-if="items.length > 1" class="nav next">
        <ui-icon name="arrow-right" size="2.2rem"></ui-icon>
      </div>
      <div class="expand" @click="expand">
        <ui-icon name="expand" size="24px" color="#fff"></ui-icon>
      </div>
    </div>
    <div class="caption">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16.758"
        height="14.364"
        viewBox="0 0 16.758 14.364"
      >
        <path
          id="Path_15460"
          data-name="Path 15460"
          d="M27.386,26l-.9,2.394H24.394A2.389,2.389,0,0,0,22,30.788V37.97a2.389,2.389,0,0,0,2.394,2.394h11.97a2.389,2.389,0,0,0,2.394-2.394V30.788a2.389,2.389,0,0,0-2.394-2.394H34.269L33.371,26Zm2.992,4.189a4.189,4.189,0,1,1-4.189,4.189A4.2,4.2,0,0,1,30.379,30.189Zm0,1.8a2.394,2.394,0,1,0,2.394,2.394A2.38,2.38,0,0,0,30.379,31.985Z"
          transform="translate(-22 -26)"
          fill="#fff"
        ></path>
      </svg>
      <figcaption
        v-if="items[active].title"
        v-html="items[active].title"
      ></figcaption>
    </div>
    <!-- Fullscreen gallery -->
    <ui-gallery
      :id="id"
      :images="items"
      :index="active"
      :open="expanded"
      @changed="change"
      @closed="expanded = false"
    ></ui-gallery>
  </div>
</template>

<script>
import Gallery from "./gallery.vue";
import Icon from "./icon.vue";

const browser = typeof window != "undefined";
if (browser)
  window.Swiper = require("../../node_modules/swiper/dist/js/swiper.js");

import "../../node_modules/swiper/dist/css/swiper.css";

export default {
  name: "ui-images",
  components: {
    "ui-gallery": Gallery,
    "ui-icon": Icon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      active: 0,
      expanded: false,
      initialized: false,
    };
  },
  computed: {
    items() {
      const params = { full: "?q=75", preview: "?w=1000&h=500&fit=crop&q=75" };
      return this.images.map((f) => ({
        preview: `${f.url}${
          f.url.startsWith("https://cdn.ele") ? params.preview : ""
        }`,
        src: `${f.url}${
          f.url.startsWith("https://cdn.ele") ? params.full : ""
        }`,
        title: f.caption,
        w: 0,
        h: 0,
      }));
    },
  },
  methods: {
    change(idx) {
      if (!this.swiper) return;
      this.swiper.slideTo(idx + 1, 0, false);
    },
    expand() {
      this.expanded = true;
    },
  },
  mounted() {
    if (this.initialized) return;

    if (this.swiper || this.items.length < 2) {
      this.initialized = true;
      this.active = 0;
      return;
    }

    const self = this;
    self.swiper = new Swiper(self.$refs.swiper, {
      initialSlide: 0,
      loop: true,
      navigation: {
        nextEl: ".next",
        prevEl: ".previous",
      },
      on: {
        init() {
          self.initialized = true;
          self.active = 0;
        },
        slideChange() {
          self.active = this.realIndex;
        },
      },
      preloadImages: false,
      runCallbacksOnInit: false,
      slideToClickedSlide: false,
    });
  },
  updated() {
    if (!this.swiper) return;
    this.swiper.update();
  },
  beforeDestroy() {
    if (!this.swiper) return;
    this.swiper.destroy();
    delete this.swiper;
  },
};
</script>

<style scoped>
.swiper-container {
  min-height: 50px;
}

.images {
  position: relative;
  overflow: hidden;
}

.caption {
  margin: 0 auto;
  padding: 0;
  display: flex;
  position: absolute;
  bottom: 12px;
  z-index: 1;
  left: 0;
  right: 0;
}
.caption > * {
  z-index: 1;
}

.caption:after {
  content: "";
  display: block;
  position: absolute;
  bottom: -12px;
  top: -10px;
  left: 0;
  right: 0;
  background: rgba(22, 60, 71, 0.8);
  z-index: 0;
  transition: 0.25s ease;
  transform: translateY(100%);
}
.caption:hover:after {
  transform: translateY(0%);
}

.app .caption svg {
  flex: 0 0 30px;
  margin-left: 15px;
  align-self: flex-end;
}
.app .caption figcaption {
  margin: 0 0 0 10px;
  padding: 0 15px 0 0;
  font-size: 80%;
  line-height: 1.2;
  border: none;
  transition: 0.25s ease;
  transform: translateX(5px);
  opacity: 0;
  flex: 1;
}
.app .caption:hover figcaption {
  transition: 0.25s 0.1s ease;
  transform: translateX(0);
  opacity: 1;
}

figure {
  max-width: 100%;
  margin: 0 auto;
}

.cover {
  position: relative;
  z-index: var(--z-default);
  line-height: 0;
  cursor: pointer;
}

.expand {
  position: absolute;
  top: 10px;
  right: 8px;
  z-index: var(--z-navbar);
  cursor: pointer;
  transition: opacity var(--duration-long) ease-out;
}

.expand:hover {
  opacity: 0.7;
}

.expand .icon {
  padding: 1px;
}

.nav {
  position: absolute;
  top: 50%;
  z-index: var(--z-above);
  width: 40px;
  height: 40px;
  margin-top: -20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: var(--box-shadow-small);
  cursor: pointer;
  display: block;
  padding: 8px;
}

.nav .icon {
  transition: all var(--duration-short);
  width: 100%;
  height: 100%;
}

.nav:hover .icon {
  opacity: 0.7;
}

.nav.next {
  right: 10px;
  left: auto;
}

.nav.previous {
  left: 10px;
  right: auto;
}
</style>
