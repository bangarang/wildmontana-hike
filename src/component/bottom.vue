<template>
  <div class="bottom">
    <div class="container">
      <div class="copyright">{{ $t('copyright', { org, year }) }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ui-bottom',
    data() {
      return {
        org: this.$t('org_name'),
        year: new Date().getFullYear()
      };
    }
  };
</script>

<style scoped>
  .bottom {
    bottom: 0;
    z-index: 2;
    width: 100%;
    padding: 3rem;
    text-align: center;
    background-color: var(--color-bg-section);
  }

  .copyright {
    color: var(--color-text-grey-light);
    opacity: 0.7;
  }
</style>
