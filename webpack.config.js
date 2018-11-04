const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");

let pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());

let plugins = [
  new MinifyPlugin(),
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version),
  }),
  new webpack.LoaderOptionsPlugin({ options: {} })
];

const config = {
  entry: __dirname + '/src/index.js',
  devtool:'none',
  mode: "production",
  output: {
    path: __dirname + '/build',
    filename: 'erronetic.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true

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