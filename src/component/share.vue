<template>
  <div :class="{ share: true, open: share.open }">
    <!--    <ui-button-->
    <!--      class="share-button button-clear"-->
    <!--      icon="action"-->
    <!--      :color="color"-->
    <!--      :label="$t('share')"-->
    <!--      :iconPosition="`right`"-->
    <!--      icon-size="2.2rem"-->
    <!--      @click.native="toggle"-->
    <!--    >-->
    <!--    </ui-button>-->
    <div class="share-menu">
      <social-sharing :title="share.title" :url="share.url" inline-template>
        <div class="networks">
          <span>
            <svg class="icon icon-share" style="margin-right: 10px">
              <use xlink:href="/static/icons.svg#icon-share"></use></svg
            >Share:
          </span>
          <network network="facebook">
            <svg class="icon icon-facebook">
              <use xlink:href="/static/icons.svg#icon-facebook"></use>
            </svg>
            {{ $t("network.facebook") }}
          </network>
          <network network="pinterest">
            <svg class="icon icon-pinterest">
              <use xlink:href="/static/icons.svg#icon-pinterest"></use>
            </svg>
            {{ $t("network.pinterest") }}
          </network>
          <network network="twitter">
            <svg class="icon icon-twitter">
              <use xlink:href="/static/icons.svg#icon-twitter"></use>
            </svg>
            {{ $t("network.twitter") }}
          </network>
        </div>
      </social-sharing>
    </div>
  </div>
</template>

<script>
import Button from "./button.vue";
import config from "../../config";

export default {
  name: "ui-share",
  components: {
    "ui-button": Button,
  },
  props: {
    color: {
      type: String,
      default: "#999",
    },
  },
  data() {
    return {
      share: {
        open: false,
        title: "",
        url: "",
      },
    };
  },
  methods: {
    click(e) {
      console.log("CLICK SHARE");
      const el = document.querySelector(".share");
      if (el && !el.contains(e.target)) {
        this.share.open = false;
        console.log("SHARE CLICKED", { share: this.share });
      }
    },
    isDetailPage() {
      const url = new URLSearchParams(window.location.search);
      return !url.get("trail");
    },
    toggle() {
      this.share.open = !this.share.open;
      this.$store.commit("share", this.share.open);
      const el = document.getElementById("entry-title");
      console.log("SHARE TOGGLE");
      if (this.share.open) {
        this.share.url = window.location.href;
        if (!this.isDetailPage()) {
          this.share.url = `${window.location.origin}/entries/${this.$store.state.selected}`;
        }
        if (el && el.innerHTML) {
          this.share.title = `${el.innerHTML.trim()} – ${this.$t("site_name")}`;
        } else {
          this.share.title = config.app.name;
        }
        document.body.addEventListener("click", this.click);
      } else {
        document.body.removeEventListener("click", this.click);
      }
    },
  },
  mounted() {
    this.share.title = config.app.name;
    this.share.url = window.location.href;

    this.$store.watch(this.$store.getters.share, (state) => {
      if (this.share.open !== state) {
        this.share.open = state;
      }
    });
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.click);
  },
};
</script>

<style scoped>
.share-button {
  margin: 0;
  padding: 0;
  line-height: 28px;
  text-transform: capitalize;
}

.share-button:hover,
.share.open .share-button {
  opacity: 0.7;
}

.share-menu {
  position: relative;
  top: 0;
  left: 0;
  transition: 0s;
  background: transparent;
  color: white;
  border: none;
  box-shadow: none;
}

.share.open .share-menu {
  display: block;
  z-index: var(--z-panel);
  opacity: 1;
  transform: translate3d(0, 0%, 0);
}

.networks {
  display: flex;
}
</style>
<style>
.app .networks .icon {
  width: 30px;
  height: 30px;
  vertical-align: bottom;
  margin-bottom: -4px;
  margin-right: 0;
}
.networks span {
  margin-right: 10px;
}
</style>
