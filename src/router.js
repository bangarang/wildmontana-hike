const config = require('../config');

const DetailView = () => import('./view/detail.vue');
const IndexView = () => import('./view/index.vue');

const router = Router => {
  const settings = {
    mode: 'history',
    routes: [],
    scrollBehavior(to, from, xy) {
      // console.log('scrollBehavior', {to, from, xy})
      document.getElementById('app').scrollIntoView({
        behavior: 'smooth'
      });
      if (xy) {
        if (to.path === from.path) return xy;
        return new Promise(resolve => setTimeout(() => resolve(xy), 1000));
      }

      if (to.hash) {
        const selector = to.hash;
        const offset = { y: 0 };
        if (document.querySelector(to.hash)) return { selector, offset };
      }

      return new Promise(resolve => setTimeout(() => resolve({ x: 0, y: 0 }), 500));
    }
  };

  const routes = {
    entry: {
      component: DetailView,
      name: 'entry',
      path: '/hike/entries/:id',
      props: route => ({ id: route.params.id })
    },
    index: {
      component: IndexView,
      name: 'index',
      path: '/hike/',
      meta: { params: { type: [config.id.type.trail] } },
      props: route => ({ title: route.query.trail || '' })
    },
    signup: {
      name: 'signup',
      path: '/hike/signup',
      component: DetailView,
      // meta: { id: config.id.entry.signup },
      props: route => ({ id: config.id.entry.signup })
    }
  };

  Object.values(routes).forEach(r => {
    settings.routes.push({
      name: r.name,
      path: r.path || '',
      component: r.component,
      meta: r.meta || {},
      props: r.props
    });
  });

  settings.routes.sort((a, b) => {
    if (a.path === b.path) return 0;
    return a.path > b.path ? -1 : 1;
  });

  return new Router(settings);
};

module.exports = router;
