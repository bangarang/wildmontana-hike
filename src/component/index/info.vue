<template>
  <div
    :class="{ info: true, open, tall }"
    @click="$emit('touched', 'geo', $event)"
  >
    <div
      class="panel"
      @click.stop="$emit('touched', 'info:background', $event)"
    >
      <div class="handlebar">
        <div
          class="handle"
          @click.stop="$emit('touched', 'info:handle', $event)"
        >
          <h3 v-if="entry.title" class="handle-title">
            {{ entry.title }}
            <ui-icon
              v-if="entry.featured"
              name="star"
              color="#d9d9d9"
              size="1.6rem"
            ></ui-icon>
          </h3>
          <!-- <ui-icon name="chevron-thin" size="4rem" color="#ccc" :transform="tall ? 'rotate(180deg)' : 'none'"></ui-icon> -->
          <!--          <button :class="{ 'button trail-button': true, open: tall }">{{tall ? $t('hide_trail_details') : $t('show_trail_details')}}</button>-->
        </div>
        <div class="buttons">
          <div class="button-wrapper">
            <div
              @click.stop="$emit('touched', 'info:handle', $event)"
              class="arrow-icon"
              v-bind:class="{ 'arrow-up': tall }"
            ></div>
          </div>
          <!--        <ui-share color="var(&#45;&#45;color-text-grey)"></ui-share>-->
          <div class="button-wrapper" @click.stop="$emit('closed')">
            <div class="close-icon"></div>
          </div>
        </div>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "../icon.vue";
import Share from "../share.vue";
import resize from "../../utility/resize";

export default {
  name: "index-info",
  components: {
    "ui-icon": Icon,
    "ui-share": Share,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    tall: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
  },
  watch: {
    open() {
      if (!this.open) {
        document.querySelector(".info .panel").removeAttribute("style");
      }
    },
  },
  methods: {
    layout() {
      const bar = document.querySelector(".info .handlebar");
      const panel = document.querySelector(".info .panel");

      if (bar && panel) {
        bar.style.width = panel.clientWidth + "px";
      }
    },
  },
  computed: {
    entry() {
      return this.$store.state.entries[this.id];
    },
  },
  mounted() {
    this.layout();
    resize.watch(this.layout);
  },
  beforeDestroy() {
    resize.unwatch(this.resized);
  },
};
</script>

<style scoped>
.info {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: var(--z-panel);
  width: 100%;
  max-width: 600px;
  height: calc(100% - 55px);
  padding: 10px 0 0;
  transform: translateY(100%) translateX(-100px);
  transition: transform var(--duration-shortest) var(--ease-out-cubic);
  backface-visibility: hidden;
}

#app .handle-title {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
  text-align: left;
  padding: 0 0 0 30px;
  max-width: 400px;
  transition: 0.25s ease;
  color: #fff;
  cursor: pointer;
}

#app .handle-title:hover {
  color: #fcb514;
}

@media (min-width: 900px) {
  .info {
    padding: 0;
  }
}

.info.open {
  transform: translateY(calc(100% - 90px)) translateX(-100px);
}

.info.open.tall {
  transform: translateX(-100px);
}

.panel {
  position: relative;
  height: 100%;
  overflow-y: hidden;
  background-color: #fffefa;
}

.info.open.tall .panel {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.trail-button {
  background-color: var(--color-bg-highlight);
  border: none;
}

.trail-button.open {
  background-color: var(--color-bg-primary);
}

.trail-button.open:hover {
  background-color: var(--color-bg-primary-active);
}
.panel > .container {
  padding: 0;
}
.panel > .container,
.handlebar {
  cursor: pointer;
}

.info.open.tall .panel > .container,
.info.open.tall .handlebar {
  cursor: default;
}

.handlebar {
  position: sticky;
  top: 0;
  z-index: var(--z-panel-nav);
  width: 100%;
  min-height: 90px;
  background-color: #163c47;
}

.handlebar:hover .handle-title {
  color: #fcb514;
}

.handlebar .handle {
  padding-top: 20px;
  text-align: center;
}

.handlebar .buttons {
  position: absolute;
  top: 30px;
  right: 0;
  flex-direction: row;
  width: 100px;
  justify-content: center;
  align-items: center;
  height: 40px;
}
.handlebar .buttons button {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  height: 40px;
  transition: 0.25s ease;
}

.handlebar .buttons .button-wrapper {
  width: 40px;
  height: 40px;
  display: inline-block;
  cursor: pointer;
  transition: 0.25s ease;
}

.handlebar .buttons .button-wrapper:hover {
  opacity: 0.7;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  border-top: #fcb514 4px solid;
  border-left: #fcb514 4px solid;
  transform: rotate(45deg);
  transition: 0.25s ease;
}

.arrow-icon.arrow-up {
  transform: rotate(225deg) translate(9px, 9px);
  transition: 0.3s ease;
}

.close-icon {
  width: 24px;
  height: 4px;
  background: #fcb514;
  transform: rotate(45deg);
}

.close-icon::after {
  content: "";
  position: absolute;
  display: block;
  width: 24px;
  height: 4px;
  background: #fcb514;
  transform: rotate(90deg);
}

.handlebar .handle .icon {
  transition: transform var(--duration-short);
}

.handlebar .share {
  position: absolute;
  top: 17px;
  right: 60px;
}

.handlebar .close {
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.handlebar .close:active,
.handlebar .close:focus,
.handlebar .close:hover {
  //opacity: 0.7;
}

@media (min-width: 768px) {
  .handlebar .handle {
    top: 13px;
  }

  .handlebar .share {
    top: 17px;
    right: 70px;
  }
}

@media (max-width: 767px) {
  .handlebar .share {
    right: 45px;
  }
  .info.open {
    transform: translateY(calc(100% - 90px)) translateX(0px);
  }

  .info.open.tall {
    transform: translateX(0px);
  }
  #app .handlebar {
    .handle {
      padding-top: 10px;
      .handle-title {
        font-size: 20px;
        padding: 0 40px 0 30px;
      }
    }
    .buttons {
      display: flex;
      flex-direction: column-reverse;
      height: 80px;
      top: 0;
      right: 10px;
      width: 40px;
      .button-wrapper {
        justify-content: center;
        align-items: center;
        display: flex;
      }
    }
  }
}

@media (max-width: 414px) {
  .handlebar .trail-button {
    padding: 1.5rem;
    float: left;
    margin-left: 4rem;
  }

  .handlebar .close {
    top: 19px;
  }
}
</style>
