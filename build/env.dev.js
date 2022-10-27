const path = require("path");
const webpack = require("webpack");
const MFS = require("memory-fs");

const config = {
  client: require("./webpack.config.client"),
  server: require("./webpack.config.server"),
};

const read = (fs, file) => {
  try {
    return fs.readFileSync(path.join(config.client.output.path, file), "utf-8");
  } catch (e) {
    console.error(e);
  }
};

const server = (app, cb) => {
  let bundle, manifest, resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  const ready = (...args) => {
    resolve();
    cb(...args);
  };

  // Modify client config to work with middleware.
  config.client.entry.app = [
    "webpack-hot-middleware/client",
    config.client.entry.app,
  ];
  config.client.output.filename = "[name].js";
  config.client.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  const compiler = {
    client: webpack(config.client),
    server: webpack(config.server),
  };

  // Set up middleware.
  const middleware = require("webpack-dev-middleware")(compiler.client, {
    publicPath: config.client.output.publicPath,
    noInfo: true,
  });
  app.use(middleware);
  compiler.client.plugin("done", (log) => {
    log = log.toJson();
    log.errors.forEach((info) => console.error(info));
    log.warnings.forEach((info) => console.warn(info));
    if (log.errors.length) return;
    manifest = JSON.parse(
      read(middleware.fileSystem, "vue-ssr-client-manifest.json")
    );
    if (bundle) {
      ready(bundle, { clientManifest: manifest });
    }
  });
  app.use(
    require("webpack-hot-middleware")(compiler.client, { hearbeat: 5000 })
  );

  // Watch and update server renderer.
  const mfs = new MFS();
  compiler.server.outputFileSystem = mfs;
  compiler.server.watch({}, (e, log) => {
    if (e) throw e;
    log = log.toJson();
    if (log.errors.length) return;
    bundle = JSON.parse(read(mfs, "vue-ssr-server-bundle.json"));
    if (manifest) {
      ready(bundle, { clientManifest: manifest });
    }
  });

  return promise;
};

module.exports = server;
