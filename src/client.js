import "babel-polyfill";

import Vue from "vue";
import Progress from "./component/progress.vue";

import { init } from "./app";
import ele from "@elebase/sdk";
import config from "../config";

const progress = (Vue.prototype.$progress = new Vue(Progress).$mount());
document.body.appendChild(progress.$el);

Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { prefetch } = this.$options;
    if (prefetch) {
      const params = { store: this.$store, route: to, router: this.$router };
      return prefetch(params).then(next).catch(next);
    }
    next();
  },
});

const api = ele.api({
  http: { logging: window.location.host === config.host.development },
  key: config.elebase.key,
  phases: config.elebase.phases,
  project: config.id.project,
});

console.log({ api });

const { app, router, store } = init(api);

// Prime the data store with server-initialized state.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// Pre-fetch data required by components matched by the current route.
router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    progress.start();

    const matches = {
      from: router.getMatchedComponents(from),
      to: router.getMatchedComponents(to),
    };

    const hooks = matches.to
      .map((c) => {
        console.log({ c });
        return c.prefetch;
      })
      .filter((fn) => fn);

    if (!hooks.length) {
      setTimeout(() => {
        progress.finish();
        next();
      }, 500);
      return;
    }

    Promise.all(hooks.map((fn) => fn({ store, route: to, router })))
      .then(() => {
        progress.finish();
        next();
      })
      .catch((err) => {
        progress.finish();
        next(err && err.url ? err.url : false);
      });
  });

  app.$mount("#app");
});

// Update document overflow before transitioning to a new route.
router.beforeEach((to, from, next) => {
  if (typeof window != "undefined") {
    const overflow = to.name === "index" ? "hidden" : "auto";
    document.documentElement.style.overflow = overflow;
  }
  next();
});

// Register service worker, if supported.
if (window.location.protocol === "https:" && navigator.serviceWorker) {
  navigator.serviceWorker.register("/worker.js").then(
    () => {
      console.log("Service worker registration succeeded.");
    },
    (err) => {
      console.error("Service worker registration failed.", err);
    }
  );
}

// Monkey patching window.history
(function (history) {
  var pushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({
        state: state,
      });
    }
    return pushState.apply(history, arguments);
  };
})(window.history);
window.onpopstate = history.onpushstate = function (e) {
  let params = new URL(e.state.path).searchParams;
  if (params.get("trail")) {
    console.log({ trail: params.get("trail") });
    // router.replace({path: `hike/trail/${params.get('trail')}` , query: { trail: params.get('trail') }})
    // router.replace({ path: `/hike/trail/${params.get("trail")}` });
  }
};
