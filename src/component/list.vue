<template>
  <div class="list clearfix">
    <router-link replace :key="en.id" v-for="en of entries" :to="getRoute(en)" class="list-item">
      <div v-if="en.image" class="list-item-left">
        <img class="list-item-image" :src="en.image.url + '?w=150&h=150&fit=crop&q=90'" :alt="en.title">
      </div>
      <div class="list-item-right">
        <div v-if="en.subtitle" class="list-item-subtitle ellipsis">{{ en.subtitle }}</div>
        <p class="list-item-title ellipsis">{{ en.title }}</p>
        <div class="learn-more-button">
          <p class="sans white">Learn More</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="30.895" height="10.723" viewBox="0 0 30.895 10.723">
            <g id="Componente_3_51" data-name="Componente 3 – 51" transform="translate(1.5)">
              <path id="Trazado_115" data-name="Trazado 115" d="M943,5328.771h19.892" transform="translate(-943 -5323.409)" fill="none" stroke="#fffefa" stroke-linecap="round" stroke-width="3"/>
              <path id="Trazado_125" data-name="Trazado 125" d="M4.765.345a.689.689,0,0,1,1.194,0L10.63,8.47a.689.689,0,0,1-.6,1.032H.69a.689.689,0,0,1-.6-1.032Z" transform="translate(29.395 0) rotate(90)" fill="#fffefa"/>
            </g>
          </svg>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'ui-list',
    props: {
      entries: {
        type: Array,
        required: true
      },
      slug: {
        type: String | undefined
      }
    },
    methods: {
      getRoute(en) {
        const route = this.$router.options.routes.find(r => r.meta && r.meta.id === en.id);
        if (this.slug){
          return route ? { name: route.name } : { name: 'entry', params: { id: en.id, slug: this.slug } };
        } else {
          return route ? { name: route.name } : { name: 'entry', params: { id: en.id } };
        }
      }
    }
  };
</script>

<style scoped>
  .list-item {
    margin-bottom: 1rem;
    background: #163C47!important;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    text-decoration: none!important;
    color: #fff!important;
  }

  @media (min-width: 720px) {
    .list-item {
      margin-bottom: 10px;
    }
    .list-item-left {
      margin-right: 15px;
      width: 150px;
      flex: 1 0 150px;
    }
  }

  .list-item-image {
    display: block;
    height: 100%;
    margin-right: 20px;
    width: 150px;
  }

  .list-item-image,
  .list-item-image > img {
    border-radius: 8px;
  }

  .list-item-right {
    display: inline-block;
    vertical-align: top;
    padding: 30px 0px;
    flex: 1 0 395px;
  }

  .learn-more-button {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .learn-more-button p {
    color: #fff;
    margin-bottom: 0;
    margin-right: 15px;
    text-transform: uppercase;
  }

  .list-item-title {
    color: #fff!important;
    display: block;
    font-size: 30px;
    font-weight: var(--font-weight-heavy);
    line-height: 1.7;
    margin-bottom: 0;
    width: 390px;
  }

  .list-item-subtitle {
    display: block;
    margin-top: 0.7rem;
    text-align: left;
    font-size: 15px;
    line-height: 1.3;
    color: #fff;
  }
</style>

