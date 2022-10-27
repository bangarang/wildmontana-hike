<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
              <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
              <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
                </div>
              </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import PhotoSwipe from 'photoswipe/dist/photoswipe';
  import UI from 'photoswipe/dist/photoswipe-ui-default';
  import 'photoswipe/dist/photoswipe.css';

  export default {
    name: 'ui-gallery',
    props: {
      id: {
        type: String,
        required: true
      },
      images: {
        type: Array,
        required: true
      },
      index: {
        type: Number,
        default: 0
      },
      open: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      open(val) {
        if (val === true) {
          this.init();
        }
      }
    },
    methods: {
      init() {
        const id = this.id;
        this.photoswipe = new PhotoSwipe(this.$el, UI, this.images, {
          getThumbBoundsFn: () => {
            const pageY = window.pageYOffset || document.documentElement.scrollTop;
            const preview = document.getElementById(id);
            const rect = preview.getBoundingClientRect();
            return { x: rect.left, y: rect.top + pageY, w: rect.width };
          },
          history: false,
          index: this.index,
          preload: [2, 2],
          showHideOpacity: true
        });

        this.photoswipe.listen('gettingData', (idx, obj) => {
          if (obj.w < 1 || obj.h < 1) {
            const img = new Image();
            const self = this;
            img.onload = function() {
              obj.w = this.width;
              obj.h = this.height;
              self.photoswipe.invalidateCurrItems();
              self.photoswipe.updateSize(true);
            };
            img.src = obj.src;
          }
        });

        this.photoswipe.listen('afterChange', () => {
          this.$emit('changed', this.photoswipe.getCurrentIndex());
        });

        const sections = document.querySelector('.sections');
        const section = document.querySelector('.section-gallery');

        if (sections) sections.style.zIndex = -1;
        if (section) section.style.zIndex = 9000;

        this.photoswipe.listen('close', () => {
          this.$emit('closed');
          setTimeout(() => {
            if (sections) sections.style.zIndex = null;
            if (section) section.style.zIndex = null;
          }, 600);
        });

        this.photoswipe.init();
      }
    },
    mounted() {
      document.body.appendChild(this.$el);
    }
  };
</script>

<style>
  .pswp {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: var(--z-modal);
    overflow: hidden;
    outline: none;
    touch-action: none;
    -ms-touch-action: none;
    -webkit-text-size-adjust: 100%;
    -webkit-backface-visibility: hidden;
  }

  .pswp img {
    max-width: none;
  }

  .pswp--animate_opacity {
    opacity: 0.001;
    will-change: opacity;
    transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
  }

  .pswp--open {
    display: block;
  }

  .pswp--zoom-allowed .pswp__img {
    cursor: -webkit-zoom-in;
    cursor: -moz-zoom-in;
    cursor: zoom-in;
  }

  .pswp--zoomed-in .pswp__img {
    cursor: -webkit-grab;
    cursor: -moz-grab;
    cursor: grab;
  }

  .pswp--dragging .pswp__img {
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
    cursor: grabbing;
  }

  .pswp__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff !important;
    opacity: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .pswp__scroll-wrap {
    overflow: hidden
  }

  .pswp__container, .pswp__zoom-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    touch-action: none;
    -ms-touch-action: none;
  }

  .pswp__container, .pswp__img {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  .pswp__zoom-wrap {
    position: absolute;
    width: 100%;
    transition: transform 333ms cubic-bezier(0.4, 0, 0.22, 1);
    transform-origin: left top;
    -ms-transform-origin: left top;
  }

  .pswp__bg {
    will-change: opacity;
    transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
  }

  .pswp--animated-in .pswp__bg,
  .pswp--animated-in .pswp__zoom-wrap {
    transition: none;
  }

  .pswp__container, .pswp__zoom-wrap {
    will-change: transform;
    -webkit-backface-visibility: hidden;
  }

  .pswp__item {
    bottom: 0;
    right: 0;
    overflow: hidden;
  }

  .pswp__img, .pswp__item {
    position: absolute;
    left: 0;
    top: 0;
  }

  .pswp__img {
    width: auto;
    height: auto;
  }

  .pswp__player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
  }

  .pswp__img--placeholder {
    -webkit-backface-visibility: hidden;
  }

  .pswp__img--placeholder--blank {
    background: #222;
  }

  .pswp--ie .pswp__img {
    top: 0;
    left: 0;
    width: 100% !important;
    height: auto !important;
  }

  .pswp__error-msg {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 16px;
    margin-top: -8px;
    color: #ccc;
  }

  .pswp__error-msg a {
    color: #ccc;
    text-decoration: underline;
  }

  .pswp__button {
    display: block;
    position: relative;
    width: 4.4rem;
    height: 4.4rem;
    margin: 0;
    padding: 0;
    overflow: visible;
    background: none;
    cursor: pointer;
    border: 0;
    box-shadow: none;
    transition: opacity 0.2s;
    -webkit-appearance: none;
  }

  .pswp__button:focus, .pswp__button:hover {
    opacity: 0.75;
  }

  .pswp__button:active {
    outline: none;
    opacity: 0.9;
  }

  .pswp__button::-moz-focus-inner {
    padding: 0;
    border: 0;
  }

  .pswp__ui--over-close .pswp__button--close {
    opacity: 1;
  }

  .pswp__button--close {
    width: 2rem;
    height: 2rem;
    padding: 4rem;
    float: right;
    background-image: url(/static/close.svg);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 2rem 2rem;
  }

  @media (min-width: 45em) {
    .pswp__button--close {
      width: 2.5rem;
      height: 2.5rem;
      padding: 4.4rem;
      background-size: 2.5rem 2.5rem;
    }
  }

  .pswp__button--fs,
  .pswp__button--share,
  .pswp__button--zoom {
    display: none;
  }

  .pswp--touch .pswp__button--arrow--left,
  .pswp--touch .pswp__button--arrow--right {
    visibility: hidden;
  }

  .pswp__button--arrow--left,
  .pswp__button--arrow--right {
    display: none;
    position: absolute;
    top: 0;
    width: 44px;
    height: 44px;
    background: none;
  }

  .pswp__button--arrow--left {
    left: 40%;
  }

  .pswp__button--arrow--right {
    right: 40%;
  }

  .pswp__button--arrow--left:before,
  .pswp__button--arrow--right:before {
    position: absolute;
    top: 0;
    width: 4rem;
    height: 4rem;
    padding: 4.4rem;
    content: "";
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 4rem 4rem;
  }

  .pswp__button--arrow--left:before {
    left: 0;
    background-image: url(/static/previous.svg);
  }

  .pswp__button--arrow--right:before {
    right: 0;
    background-image: url(/static/next.svg);
  }

  @media (min-width: 900px) {
    .pswp__button--arrow--left,
    .pswp__button--arrow--right {
      display: block;
    }
  }

  .pswp__counter {
    position: absolute;
    top: 0;
    left: 0;
    padding: 3rem;
    font-size: 1.7rem;
    color: #888;
  }

  .pswp__caption {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    min-height: 44px;
    background-color: white;
  }

  .pswp__caption__center {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    padding: 2rem;
    text-align: center;
    color: var(--color-text-grey-light);
  }

  .pswp__caption__center a {
    color: var(--color-text-grey);
    text-decoration: underline;
  }

  .pswp__caption__center a:hover,
  .pswp__caption__center a:active,
  .pswp__caption__center a:focus {
    color: var(--color-text-grey);
    text-decoration: underline;
    opacity: 0.7;
  }

  .pswp__caption--empty {
    display: none;
  }

  .pswp__caption--fake {
    visibility: hidden;
  }

  .pswp__preloader {
    position: absolute;
    top: 0;
    left: 50%;
    width: 44px;
    height: 44px;
    margin-left: -22px;
    opacity: 0;
    will-change: opacity;
    direction: ltr;
    transition: opacity .25s ease-out;
  }

  .pswp__preloader__icn {
    width: 20px;
    height: 20px;
    margin: 12px;
  }

  .pswp__preloader--active {
    opacity: 1;
  }

  .pswp--css_animation .pswp__preloader--active {
    opacity: 1;
  }

  .pswp--css_animation .pswp__preloader--active .pswp__preloader__icn {
    animation: clockwise 0.5s linear infinite;
  }

  .pswp--css_animation .pswp__preloader--active .pswp__preloader__donut {
    animation: donut 1s cubic-bezier(0.4, 0, 0.22, 1) infinite;
  }

  .pswp--css_animation .pswp__preloader__icn {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 14px;
    height: 14px;
    margin: 0;
    background: none;
    opacity: 0.75;
  }

  .pswp--css_animation .pswp__preloader__cut {
    position: relative;
    width: 7px;
    height: 14px;
    overflow: hidden;
  }

  .pswp--css_animation .pswp__preloader__donut {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
    margin: 0;
    background: none;
    border: 2px solid #fff;
    border-radius: 50%;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }

  @media screen and (max-width: 1024px) {
    .pswp__preloader {
      position: relative;
      left: auto;
      top: auto;
      float: right;
      margin: 0;
    }
  }

  .pswp__ui {
    visibility: visible;
    z-index: var(--z-progress);
    opacity: 1;
    -webkit-font-smoothing: auto;
  }

  .pswp__top-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: white;
  }

  .pswp--has_mouse .pswp__button--arrow--left,
  .pswp--has_mouse .pswp__button--arrow--right,
  .pswp__caption, .pswp__top-bar {
    will-change: opacity;
    transition: opacity 333ms cubic-bezier(.4, 0, .22, 1);
    -webkit-backface-visibility: hidden;
  }

  .pswp--has_mouse .pswp__button--arrow--left,
  .pswp--has_mouse .pswp__button--arrow--right {
    visibility: visible;
  }

  .pswp__ui--hidden .pswp__button--arrow--left,
  .pswp__ui--hidden .pswp__button--arrow--right,
  .pswp__ui--hidden .pswp__caption,
  .pswp__ui--hidden .pswp__top-bar {
    opacity: .001;
  }

  .pswp__ui--one-slide .pswp__button--arrow--left,
  .pswp__ui--one-slide .pswp__button--arrow--right,
  .pswp__ui--one-slide .pswp__counter {
    display: none;
  }

  .pswp__element--disabled {
    display: none !important;
  }

  .pswp--minimal--dark .pswp__top-bar {
    background: none;
  }

  .pswp button, .pswp:hover, .pswp:active, .pswp:focus {
    background-color: transparent;
    border-color: transparent;
  }
</style>
