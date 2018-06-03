/* global __dirname, require, module*/

const webpack = require('webpack');

const UglifyPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

let fileName = 'erronetic';

let plugins = [], outputFile;
plugins.push(new UglifyPlugin());
outputFile = 'erronetic.min.js';

const config = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
      
    },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
};

module.exports = config;