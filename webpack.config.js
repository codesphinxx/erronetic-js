const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

let pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());
let banner = fs.readFileSync(__dirname + '/banner.info').toString();
banner = banner.replace('{version}', pkg.version).replace('{date}', (new Date()).toDateString());

let plugins = [
  new webpack.BannerPlugin({
    banner: banner
  }),
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version),
  }),
  new webpack.LoaderOptionsPlugin({ options: {} })
];

const config = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode: "production",
  output: {
    path: path.resolve(__dirname, './build'),
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
  optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            mangle: true, 
          },
        }),
      ],
  },
  resolve: {
    modules: ['./node_modules', path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
};

module.exports = config;