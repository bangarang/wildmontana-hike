const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MinifyPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const extract = () => {
  return ExtractTextPlugin.extract({
    use: 'css-loader',
    fallback: 'vue-style-loader'
  });
};

const plugins = {
  dev: [
    new FriendlyErrorsPlugin(),
    new VueLoaderPlugin()
  ],
  prod: [
    new VueLoaderPlugin(),
    new MinifyPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 7,
        compress: { warnings: false }
      }
    }),
    new ExtractTextPlugin({
      filename: 'common.[chunkhash].css'
    })
  ]
};

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: prod ? false : '#cheap-module-source-map',
  module: {
    noParse: /(es6-promise|mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: prod === true,
          preserveWhitespace: false
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: prod ? extract() : ['vue-style-loader', 'css-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: false
  },
  plugins: prod ? plugins.prod : plugins.dev,
  resolve: {
    alias: {
      'static': path.resolve(__dirname, '../static')
    }
  }
};
