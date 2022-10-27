<template>
  <div class="element-embed">
    <div class="data">
      <div v-for="em of embeds" class="embed">
        <div class="media" v-html="em.oembed.html"></div>
        <div v-if="em.caption" class="caption">
          <figcaption>{{ em.caption }}</figcaption>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../config';

  export default {
    name: 'element-embed',
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        embeds: []
      };
    },
    methods: {
      async getEmbeds() {
        const embeds = this.element.data;
        const ordinals = Object.fromEntries(embeds.map((em, i) => [em.id, i]));

        try {
          await Promise.all(embeds.map(async em => {
            let params = [];
            let url = em.url.split('?')[0];
            if (em.url.includes('vimeo')) {
              params = Object.keys(config.embed.params.vimeo).map(k => {
                return `${k}=${config.embed.params.vimeo[k]}`;
              });
            } else if (em.url.includes('youtu')) {
              params = Object.keys(config.embed.params.youtube).map(k => {
                return `${k}=${config.embed.params.youtube[k]}`;
              });
            }
            url += `?${params.join('&')}`;
            const embed = await this.$store.dispatch('embedData', { ...em, url });
            if (!embed || !embed.oembed || !embed.oembed.html) return;
            if (embed.url.includes('youtu') && params.length) {
              embed.oembed.html = embed.oembed.html.replace('feature=oembed', params.join('&'));
            }
            embed.ordinal = ordinals[em.id];
            this.embeds.push(embed);
          }));
        } catch (err) {
          console.error(err);
        }

        this.embeds.sort((a, b) => a.ordinal - b.ordinal);
      }
    },
    mounted() {
      this.getEmbeds();
    }
  };
</script>

<style scoped>
  .embed {
    margin: 0 auto;
    text-align: center;
  }

  .embed:not(:last-child) {
    margin-bottom: 3rem;
  }

  .caption {
    margin: -1rem auto 0 auto;
    padding: 0;
    text-align: left;
  }

  figure {
    max-width: 100%;
    margin: 0 auto;
  }
</style>
