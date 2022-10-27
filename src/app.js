import VueGtm from 'vue-gtm';
import I18n from 'vue-i18n';
import Router from 'vue-router';
import Share from 'vue-social-sharing';
import Scroll from 'vue-scrollto';
import Vue from 'vue';

import router from './router';
import { store } from './data/store';
import { sync } from 'vuex-router-sync';

import meta from './utility/meta';
import * as filters from './utility/filters';

import app from './app.vue';
import config from '../config';

import '../static/base.css';

// Vue mixins
Vue.mixin(meta);


// Vue filters
Object.keys(filters).forEach(f => {
  Vue.filter(f, filters[f]);
});

// Vue plugins
Vue.use(I18n);
Vue.use(Router);
Vue.use(Scroll, { easing: 'ease-in-out', offset: -90 });
Vue.use(Share);

export function init(api) {
  // console.log('init:', { api });
  const loc = 'en';

  const r = router(Router);
  const s = store(api, loc);
  sync(s, r);

  const i = new I18n({
    locale: loc,
    messages: { [loc]: require(`./language/${loc}`) }
  });

  const trackingEnabled = (
    typeof window != 'undefined' &&
    window.location.host === config.host.production &&
    config.tracking.google.enabled === true &&
    !!config.tracking.google.id
  );


  Vue.use(VueGtm, {
    id: config.tracking.google.containerId,
    enabled: trackingEnabled,
    debug: true,
    router: r
  });

  const a = new Vue({
    i18n: i,
    router: r,
    store: s,
    render: h => h(app)
  });

  return { app: a, router: r, store: s };
}
