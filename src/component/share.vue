<template>
  <div :class="{ share: true, open: share.open }">
    <div class="share-menu">
      <div class="networks">
        <span
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 43.2 43.2"
            class="icon icon-share"
            style="margin-right: 10px"
          >
            <g>
              <path
                d="M32.6,25.45c-2.38,0-4.49,1.17-5.79,2.97l-9.38-4.69c.21-.67.32-1.39.32-2.13s-.11-1.46-.32-2.13l9.39-4.69c1.3,1.8,3.41,2.97,5.79,2.97,3.94,0,7.15-3.21,7.15-7.15s-3.21-7.15-7.15-7.15-7.15,3.21-7.15,7.15c0,.74.11,1.46.32,2.13l-9.39,4.69c-1.3-1.8-3.41-2.97-5.79-2.97-3.94,0-7.15,3.21-7.15,7.15s3.21,7.15,7.15,7.15c2.38,0,4.49-1.17,5.79-2.97l9.38,4.69c-.21.67-.32,1.39-.32,2.13,0,3.94,3.21,7.15,7.15,7.15s7.15-3.21,7.15-7.15-3.21-7.15-7.15-7.15ZM32.6,5.75c2.67,0,4.85,2.18,4.85,4.85s-2.18,4.85-4.85,4.85-4.85-2.18-4.85-4.85,2.18-4.85,4.85-4.85ZM10.6,26.45c-2.67,0-4.85-2.18-4.85-4.85s2.18-4.85,4.85-4.85,4.85,2.18,4.85,4.85-2.18,4.85-4.85,4.85ZM32.6,37.45c-2.67,0-4.85-2.18-4.85-4.85s2.18-4.85,4.85-4.85,4.85,2.18,4.85,4.85-2.18,4.85-4.85,4.85Z"
              />
            </g></svg
          >Share:
        </span>
        <a
          class="share-menu-title"
          :href="share.url"
          @click="copyLinkToClipboard"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 43.2 43.2"
            class="icon icon-share"
            style="margin-right: 10px"
          >
            <g>
              <path
                d="M31.83,42.57H5.83c-2.84,0-5.15-2.31-5.15-5.15V11.42c0-2.84,2.31-5.15,5.15-5.15h26c2.84,0,5.15,2.31,5.15,5.15v26c0,2.84-2.31,5.15-5.15,5.15ZM5.83,8.57c-1.57,0-2.85,1.28-2.85,2.85v26c0,1.57,1.28,2.85,2.85,2.85h26c1.57,0,2.85-1.28,2.85-2.85V11.42c0-1.57-1.28-2.85-2.85-2.85H5.83ZM30.83,13.27H6.83v2.3h24v-2.3ZM30.83,20.27H6.83v2.3h24v-2.3ZM30.83,26.27H6.83v2.3h24v-2.3ZM30.83,33.26H6.83v2.3h24v-2.3ZM31.83,42.57H5.83c-2.84,0-5.15-2.31-5.15-5.15V11.42c0-2.84,2.31-5.15,5.15-5.15h26c2.84,0,5.15,2.31,5.15,5.15v26c0,2.84-2.31,5.15-5.15,5.15ZM5.83,8.57c-1.57,0-2.85,1.28-2.85,2.85v26c0,1.57,1.28,2.85,2.85,2.85h26c1.57,0,2.85-1.28,2.85-2.85V11.42c0-1.57-1.28-2.85-2.85-2.85H5.83ZM30.83,13.27H6.83v2.3h24v-2.3ZM30.83,20.27H6.83v2.3h24v-2.3ZM30.83,26.27H6.83v2.3h24v-2.3ZM30.83,33.26H6.83v2.3h24v-2.3ZM37.37.63H11.37c-2.31,0-4.29,1.54-4.93,3.71h2.46c.5-.85,1.42-1.41,2.46-1.41h26c1.57,0,2.85,1.28,2.85,2.85v26c0,1.01-.53,1.89-1.32,2.4v2.5c2.09-.66,3.62-2.59,3.62-4.89V5.78c0-2.84-2.31-5.15-5.15-5.15Z"
              />
            </g></svg
          >{{ copyButtonText }}</a
        >
        <a class="share-menu-title" :href="'mailto:?subject=' + encodeURIComponent('Check out this trail I found on Hike Wild Montana') + '&body=' + encodeURIComponent('I found this trail recommendation on Hike Wild Montana: ' + share.url + '\n\nExplore what makes Montana special at hikewildmontana.org')"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 43.2 43.2"
            class="icon icon-share"
            style="margin-right: 10px"
          >
            <g>
              <path
                d="M34.6,6.45H8.6c-2.84,0-5.15,2.31-5.15,5.15v20c0,2.84,2.31,5.15,5.15,5.15h26c2.84,0,5.15-2.31,5.15-5.15V11.6c0-2.84-2.31-5.15-5.15-5.15ZM8.6,8.75h26c1.36,0,2.5.96,2.78,2.23l-15.78,9.28L5.82,10.98c.28-1.28,1.42-2.23,2.78-2.23ZM34.6,34.45H8.6c-1.57,0-2.85-1.28-2.85-2.85V13.61l15.85,9.32,15.85-9.32v17.99c0,1.57-1.28,2.85-2.85,2.85Z"
              />
            </g></svg
          >Email link</a
        >
      </div>
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
      copySuccess: false,
      share: {
        open: false,
        title: "",
        url: "",
      },
    };
  },
  computed: {
    copyButtonText() {
      return this.copySuccess ? "Link copied!" : "Copy link";
    },
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
    copyLinkToClipboard(event) {
      event.preventDefault(); // Prevent the default link behavior

      const linkToCopy = this.share.url;
      
      navigator.clipboard
        .writeText(linkToCopy)
        .then(() => {
          this.copySuccess = true;
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000); // Reset after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
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
  font-size: 16px;
}
</style>
<style>
.app .networks .icon {
  height: 24px;
  width: unset;
}
.networks span {
  margin-right: 10px;
  display: flex;
  align-items: center;
  margin-right: 25px;
}
.networks a {
  padding: 1rem 0;
  line-height: 1;
  cursor: pointer;
  transition: opacity var(--duration-short), color var(--duration-short);
  margin-right: 10px;
  color: white !important;
  display: flex;
  align-items: center;
}
.networks a svg g {
  fill: white;
  transition: fill var(--duration-short);
}
.networks a:hover {
  color: #fcb514 !important;
  opacity: 1;
}
.networks a:hover svg g {
  fill: #fcb514 !important;
}
</style>
