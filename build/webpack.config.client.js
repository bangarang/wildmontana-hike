const base = require("./webpack.config.base");

const merge = require("webpack-merge");
const webpack = require("webpack");

const ClientPlugin = require("vue-server-renderer/client-plugin");
const WorkerPlugin = require("sw-precache-webpack-plugin");

const config = require("../config");

const plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.VUE_ENV": '"client"',
  }),
  // Extract 3rd party libraries into a separate bundle to improve caching.
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    minChunks(mod) {
      if (/node_modules/.test(mod.context) && !/\.css$/.test(mod.request)) {
        return true;
      }
      return false;
    },
  }),
  // Extract webpack runtime + manifest to prevent the hash from changing each build.
  new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
  }),
  new ClientPlugin(),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new WorkerPlugin({
      cacheId: config.host.production || config.host.staging,
      filename: "worker.js",
      minify: true,
      runtimeCaching: [
        {
          method: "get",
          urlPattern: /^https:\/\/cdn\.elebase\.io/,
          handler: "networkFirst",
          options: {
            debug: process.env.NODE_ENV === "development",
            name: "cdn-cache",
            networkTimeoutSeconds: 5,
          },
        },
      ],
      staticFileGlobs: ["/static/**/*.{png,jpg,svg}", "/dist/*.{css,js}"],
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
    })
  );
}

module.exports = merge(base, {
  entry: { app: "./src/client.js" },
  plugins,
});
