const config = require('../../config');
const hostname = config.host.production || config.host.staging;

function getMetadata(vm) {
  const { metadata: meta } = vm.$options;
  return typeof meta == 'function' ? meta.call(vm) : meta;
}

const meta = {
  client: {
    mounted() {
      const meta = getMetadata(this);
      if (!meta || typeof meta != 'object') return;

      if (meta.title) {
        document.title = meta.title;

        const og = document.querySelector('meta[property="og:title"]');
        og.setAttribute('content', meta.title);

        const tw = document.querySelector('meta[name="twitter:title"]');
        tw.setAttribute('content', meta.title);
      }

      if (meta.description) {
        const se = document.querySelector('meta[name="description"]');
        se.setAttribute('content', meta.description);

        const og = document.querySelector('meta[property="og:description"]');
        og.setAttribute('content', meta.description);

        const tw = document.querySelector('meta[name="twitter:description"]');
        tw.setAttribute('content', meta.description);
      }

      if (meta.path) {
        const url = `https://${hostname}${meta.path || ''}`;

        const can = document.querySelector('link[rel="canonical"]');
        can.setAttribute('href', url);

        const og = document.querySelector('meta[property="og:url"]');
        og.setAttribute('content', url);
      }

      if (meta.image) {
        const og = document.querySelector('meta[property="og:image"]');
        og.setAttribute('content', meta.image);

        const twi = document.querySelector('meta[name="twitter:image"]');
        twi.setAttribute('content', meta.image);

        const twt = document.querySelector('meta[name="twitter:card"]');
        twt.setAttribute('content', 'summary_large_image');
      }
    }
  },
  server: {
    created() {
      const meta = getMetadata(this);
      if (!meta || typeof meta != 'object') return;

      if (this.$ssrContext && this.$ssrContext.tweet) return;

      this.$ssrContext.title = meta.title;
      this.$ssrContext.description = meta.description || '';
      this.$ssrContext.url = `https://${hostname}${meta.path || ''}`;
      this.$ssrContext.image = config.url.image.share.large;
      this.$ssrContext.tweet = { type: 'summary', image: config.url.image.share.thumb };

      if (meta.image) {
        this.$ssrContext.image = meta.image;
        this.$ssrContext.tweet.type = 'summary_large_image';
        this.$ssrContext.tweet.image = meta.image;
      }
    }
  }
};

module.exports = meta[process.env.VUE_ENV === 'server' ? 'server' : 'client'];
