/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
// Important modules this config uses
import path from 'path';
import PATHS from '../../config/paths';
// const webpack = require('webpack');
import WebpackConfig from 'webpack-config';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default new WebpackConfig().extend({}, PATHS.root + '/kit/webpack/webpack.server.base.babel.js').merge({
  mode: 'production',
  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'kit/entry/browser.js')
  ],

  output: {
    filename: 'server.js',
  },

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
    hints: false
  },
});
