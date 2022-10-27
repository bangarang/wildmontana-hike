<template>
  <div id="app" class="app">
    <!-- REMOVE BEFORE PROD PUSH   -->
    <link
      rel="stylesheet"
      href="https://8e4df766c4.nxcli.net/wp-content/themes/wild-montana-flynt/dist/assets/main.css"
    />
    <ui-warning></ui-warning>
    <transition name="fade" mode="out-in">
      <router-view class="view" :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
import Warning from "./component/warning.vue";

export default {
  name: "app",
  components: {
    "ui-warning": Warning,
  },
  computed: {
    key() {
      return this.$route.meta.key !== undefined
        ? this.$route.meta.key
        : this.$route.path;
    },
    iframed() {
      if (typeof window == "undefined") return null;
      try {
        return window.self !== window.top;
      } catch (err) {
        return true;
      }
    },
  },
  beforeCreate() {
    this.$i18n.locale = this.$store.state.locale || "en";
  },
  beforeMount() {
    this.$store.commit("iframed", this.iframed);
  },
};
</script>

<style>
#app,
.view {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.detail-view main a:not(.button) {
  color: #8d1d1a;
}

.content p,
.element .data {
  color: var(--color-text-grey);
}

.description .data {
  color: #fff;
}

.content blockquote p,
.content ul,
.content ol {
  color: var(--color-text-grey);
}

.content .text p > img {
  display: block;
  margin: 4rem auto;
}

.content .alert p {
  color: #fff;
}

section p:last-child {
  margin-bottom: 0;
}

.close > .icon,
.up > .icon {
  margin: 0;
}

.subheading {
  margin: 0 0 0.3rem 0;
  font-size: 17px;
  line-height: 2.4rem;
  font-weight: var(--font-weight-heavy);
  color: var(--color-text-grey-dark);
}

.anchor {
  float: left;
  margin-left: -3rem;
  padding-right: 0.4rem;
  line-height: 1.2;
}

.anchor > .icon {
  visibility: hidden;
  vertical-align: middle;
  font-size: 2rem;
}

h1:hover .anchor > .icon,
h2:hover .anchor > .icon,
h3:hover .anchor > .icon,
h4:hover .anchor > .icon,
h5:hover .anchor > .icon,
h6:hover .anchor > .icon {
  visibility: visible;
}

.networks span {
  display: block;
  padding: 1rem 0;
  line-height: 1;
  cursor: pointer;
  transition: opacity var(--duration-short);
}

.networks span:hover {
  opacity: 0.7;
}

.networks .icon {
  margin-right: 0.25rem;
  font-size: 1.6rem;
}

.info .share-menu {
  right: 0px !important;
}
</style>
