import 'babel-polyfill';

import { init } from './app';

const prod = process.env.NODE_ENV === 'production';

export default ctx => new Promise((resolve, reject) => {
  const start = Date.now();

  const { api, locale, url } = ctx;
  const { app, router, store } = init(api);

  const path = router.resolve(url).route.fullPath;
  if (path !== url) reject({ url: path });
  router.push(url);

  // Pre-fetch data required by components matched by the current route.
  router.onReady(() => {
    const components = router.getMatchedComponents();
    if (!components.length) reject({ code: 404 });
    const hooks = components.map((s) => { console.log({s}); return s.prefetch}).filter(fn => fn);
    Promise.all(hooks.map(fn => fn({ store, route: router.currentRoute, router }))).then(() => {
      if (!prod) console.log(`Data pre-fetched in: ${Date.now() - start}ms`);
      ctx.state = store.state;
      resolve(app);
    }).catch(reject);
  }, reject);
});
