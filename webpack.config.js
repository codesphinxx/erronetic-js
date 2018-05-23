/* global __dirname, require, module*/

const webpack = require('webpack');

const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

let fileName = 'erronetic';

let plugins = [], outputFile;

if (env === 'build') 
{
  plugins.push(new MinifyPlugin());
  outputFile = fileName.toLowerCase() + '.min.js';
} 
else 
{
  outputFile = fileName.toLowerCase() + '.js';
}

const config = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/public',
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