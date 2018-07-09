/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import webpack from 'webpack';
import WebpackConfig from 'webpack-config';
import path from 'path';
const HOST = process.env.BROWSER_HOST || 'localhost';
const PORT = process.env.BROWSER_PORT || 8080;
const LOCAL = `http://${HOST}:${PORT}/`;

export default new WebpackConfig().extend({}, 'kit/webpack/webpack.browser.base.babel.js').merge({
  mode: 'development',
  entry: {
    app: path.join(process.cwd(), 'kit/entry/browser.js')
  },
  // Extra output options, specific to the dev server -- source maps and
  // our public path
  // No hashes in development (for speed)
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  target: 'web',
  // Add source maps
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { 
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial"
        }
      }
    }
  },
  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  }
});
