<template>
  <div class="progress" :style="styles"></div>
</template>

<script>
  export default {
    name: 'ui-progress',
    data() {
      return {
        duration: 3000,
        failed: false,
        percent: 0,
        visible: false
      };
    },
    computed: {
      styles() {
        return {
          'background-color': this.failed ? '#800000' : '#0077d4',
          'height': '3px',
          'opacity': this.visible ? 1 : 0,
          'width': `${this.percent}%`
        };
      }
    },
    methods: {
      start() {
        this.visible = true;
        this.failed = false;

        if (this._timer) {
          clearInterval(this._timer);
          this.percent = 0;
        }

        this._chunk = 10000 / Math.floor(this.duration);
        this._timer = setInterval(() => {
          this.add(this._chunk * Math.random());
          if (this.percent > 95) {
            this.finish();
          }
        }, 100);

        return this;
      },
      stop() {
        clearInterval(this._timer);
        return this;
      },
      get() {
        return Math.floor(this.percent);
      },
      set(x) {
        this.visible = true;
        this.failed = false;
        this.percent = Math.floor(x);
        return this;
      },
      add(x) {
        this.percent = this.percent + Math.floor(x);
        return this;
      },
      subtract(x) {
        this.percent = this.percent - Math.floor(x);
        return this;
      },
      finish() {
        this.percent = 100;
        this.hide();
        return this;
      },
      fail() {
        this.failed = true;
        return this;
      },
      hide() {
        clearInterval(this._timer);
        this._timer = null;

        setTimeout(() => {
          this.visible = false;
          this.$nextTick(() => {
            setTimeout(() => this.percent = 0, 200);
          });
        }, 500);

        return this;
      }
    }
  };
</script>

<style scoped>
  .progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-progress);
    width: 0%;
    height: 3px;
    background-color: var(--color-bg-primary);
    opacity: 1;
    transition: width 0.2s, opacity 0.4s;
  }
</style>
