const cfg = require('./config');
const ele = require('@elebase/sdk');
const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');
const helmet = require('helmet');
const lru = require('lru-cache');
const parser = { body: require('body-parser') };
const path = require('path');
const rc = require('route-cache');
const cors = require('cors');

parser.json = parser.body.json();

const resolve = file => path.resolve(__dirname, file);
const port = process.env.PORT || 9000;
const prod = process.env.NODE_ENV === 'production';

/***************************************************************************************************
* Server setup and configuration
****************************************************************************************************/

const config = {
  api: {
    http: { logging: !prod },
    key: {
      private: process.env.ELE_KEY_SERVER_PRIVATE,
      public: process.env.ELE_KEY_SERVER_PUBLIC
    },
    phases: cfg.elebase.phases,
    project: cfg.id.project
  },
  app: cfg,
  sec: {
    frameguard: true,
    dnsPrefetchControl: { allow: true }
  }
};

const app = express();
app.use(cors());
// Determine if the response to a given request is eligible for server-side, in-memory caching.
const cacheable = req => {
  return prod && req.method === 'GET' && req.query.preview !== 'true';
};

// Serve a static file from the local filesystem.
const serve = (file, ttl) => express.static(resolve(file), {
  maxAge: ttl && prod ? config.app.ttl.static : 0
});

const template = fs.readFileSync(resolve('./src/index.html'), 'utf-8');
const { createBundleRenderer } = require('vue-server-renderer');
const renderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve('./dist'),
    cache: new lru({ max: 100, maxAge: 1000 * 60 * 60 }),
    runInNewContext: false,
    template
  }));
};

let ren, ready;
if (prod) {
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const manifest = require('./dist/vue-ssr-client-manifest.json');
  ren = renderer(bundle, { clientManifest: manifest });

  // Force incoming requests to use HTTPS in any non-development environment.
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // Tell search engine crawlers not to index URLs on non-production hosts.
  app.use((req, res, next) => {
    if (req.hostname !== config.app.host.production) {
      res.set('X-Robots-Tag', 'noindex');
    }
    next();
  });
} else {
  ready = require('./build/env.dev')(app, (bundle, options) => {
    ren = renderer(bundle, options);
  });
}

// Install middleware.
app.use(helmet(config.sec));
app.use(favicon('./static/48.png'));
app.use('/dist', serve('./dist', true));
app.use('/static', serve('./static', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/worker.js', serve('./dist/worker.js', false));
app.use(rc.cacheSeconds(config.app.ttl.dynamic, req => prod && cacheable(req) && req.originalUrl));

/***************************************************************************************************
 * HTML rendering and output
****************************************************************************************************/

const render = (req, res) => {
  const start = Date.now();
  const locales = config.app.locales.map(loc => loc.id);

  const ctx = {
    api: ele.api(config.api),
    description: '',
    locale: '',
    title: '',
    url: req.url
  };

  if (!ctx.locale) {
    const locale = req.acceptsLanguages(locales.slice().reverse());
    if (locale) ctx.locale = locale;
  }

  if (!ctx.locale) {
    ctx.locale = locales.length ? locales[0] : 'en';
  }

  res.setHeader('Content-Type', 'text/html');
  res.setHeader("X-Frame-Options", "ALLOW-FROM http://localhost:1017");

  ren.renderToString(ctx, (err, html) => {
    if (err) return renderError(req, res, err);
    res.end(html);
    if (!prod) console.log(`${req.method} ${req.path} (${Date.now() - start}ms)`);
  });
};

const renderError = (req, res, err) => {
  const html = text => {
    return `<html><title>${text}</title><body>${text}</body></html>`;
  };

  if (err.url) {
    return res.redirect(err.url);
  }

  if ([403, 404].includes(err.code)) {
    const text = '404: Resource not found';
    return res.status(404).send(html(text));
  }

  const text = '500: Internal error';
  res.status(500).send(html(text));

  console.error(`Error (500): ${req.url}`);
  if (err && err.message) console.error(err.message);
  if (err && err.stack) console.error(err.stack);
};

/***************************************************************************************************
 * Supporting functions (to be used in subsequent route logic)
****************************************************************************************************/

const joinProject = async (input, res) => {
  const { name, pwd } = input;
  const email = typeof input.email == 'string' ? input.email.toLowerCase() : '';

  try {
    if (!email || !config.app.pattern.email.test(email)) {
      throw new Error('invalid_email');
    }
    if (!name || !name.first || !name.last) {
      throw new Error('invalid_name');
    }
    if (!pwd || pwd.length < 8 || pwd.length > 72) {
      throw new Error('invalid_password');
    }
  } catch (err) {
    return res.status(400).json({ error: { id: err.message } });
  }

  let user = null;

  try {
    const api = ele.api(config.api);
    const options = { data: { email, name, pwd, type: 1 } };
    const res = await api.create('/users', options);
    user = res.data;
    options.data = { id: user.id, groups: [config.app.id.group.user.contributors] };
    await api.update('/users', options);
  } catch (err) {
    return res.status(err.code || 500).json({ error: err });
  }

  res.status(201).json({ user });
};

/***************************************************************************************************
 * Routes and server initialization
****************************************************************************************************/

app.post('/forms/:id', parser.json, async (req, res) => {
  const id = req.params.id;
  const input = typeof req.body == 'object' && req.body !== null ? req.body : {};
  if (!prod) console.log(`POST /forms/${id}: ${JSON.stringify(input)}`);

  if (id === 'signup') {
    return joinProject(input, res);
  }

  res.status(400).end();
});

app.get('*', prod ? render : async (req, res) => {
  ready.then(() => render(req, res)).catch(err => renderError(req, res, err));
});

app.listen(port, () => {
  console.log(`Initialized server on port ${port}.`);
});
