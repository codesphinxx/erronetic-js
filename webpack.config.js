/* global __dirname, require, module*/

const webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');

let plugins = [], outputFile;
plugins.push(new MinifyPlugin());
plugins.push(new webpack.LoaderOptionsPlugin({ options: {} }));

outputFile = 'erronetic.min.js';
let sourceMapFile = outputFile + '.map';

const config = {
  entry: __dirname + '/src/index.js',
  devtool:'none',
  mode: "production",
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    sourceMapFilename:sourceMapFile

  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
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