<template>
  <li class="accordion__item">
    <div
      class="accordion__trigger"
      :class="{ accordion__trigger_active: visible }"
      @click="open"
    >
      <!-- This slot will handle the title/header of the accordion and is the part you click on -->
      <slot name="accordion-trigger"></slot>
    </div>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div class="accordion__content" v-show="visible">
        <div>
          <!-- This slot will handle all the content that is passed to the accordion -->
          <slot name="accordion-content"></slot>
        </div>
      </div>
    </transition>
  </li>
</template>

<script>
export default {
  props: {},
  inject: ["Accordion"],
  data() {
    return {
      index: null,
    };
  },
  computed: {
    visible() {
      return this.index == this.Accordion.active;
    },
  },
  methods: {
    open() {
      if (this.visible) {
        this.Accordion.active = null;
      } else {
        this.Accordion.active = this.index;
      }
    },
    start(el) {
      el.style.height = el.scrollHeight + "px";
    },
    end(el) {
      el.style.height = "";
    },
  },
  created() {
    this.index = this.Accordion.count++;
  },
};
</script>

<style scoped>
.accordion__content > div {
  padding: 12px 0;
}

.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}
</style>

<style scoped>
.accordion__item {
  padding: 12px 0;
  margin: 0;
  border-bottom: 1px solid #707070;
  position: relative;
  list-style: none;
}
#app .accordion__item p {
  margin-bottom: 0;
}

.accordion__trigger {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.accordion__trigger:after {
  color: #143c48;
  content: "";
  border-right: 2px solid #454545;
  border-bottom: 2px solid #454545;
  height: 8px;
  width: 8px;
  transform: rotate(45deg);
  transition: 0.25s ease-out;
  top: 20px;
  position: absolute;
  right: 15px;
}
.accordion__trigger_active:after {
  transform: rotate(225deg);
}
</style>
