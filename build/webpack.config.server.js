const base = require('./webpack.config.base');

const externals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');

const ServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(base, {
  devtool: '#source-map',
  entry: './src/server.js',
  externals: externals({ whitelist: /\.css$/ }),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new ServerPlugin()
  ],
  target: 'node'
});
