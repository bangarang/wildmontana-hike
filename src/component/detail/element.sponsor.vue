<template>
    <div class="sponsor-wrapper">
        <div class="sponsor-logo">
            <img :src="sponsor.logo.url" :alt="sponsor.title"/>
        </div>
        <div class="sponsor-info">
            <a :href="sponsor.link" target="_blank">{{sponsor.title}}</a>
            <p>{{sponsor.description}}</p>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        name: 'element-sponsor',
        props: {
            sponsor: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>
    .sponsor-wrapper {
       border-bottom: 1px solid #CCC;
       margin: 20px;
       display: flex;
       padding-bottom: 2rem
    }
    .sponsor-logo {
        flex: 0 0 200px;
        margin-right: 50px;
    }
    .sponsor-info a {
        font-weight: 600;
    }
     @media (max-width: 475px) { 
         .sponsor-logo {
        flex: 0 0 100px;
        }
     }
</style>