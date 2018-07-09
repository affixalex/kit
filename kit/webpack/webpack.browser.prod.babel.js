/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import webpack from 'webpack';
import WebpackConfig from 'webpack-config';
import BrotliGzipPlugin from 'brotli-gzip-webpack-plugin';
import path from 'path';
// Plugin to allow us to exclude `node_modules` packages from the final
// bundle.  Since we'll be running `server.js` from Node, we'll have access
// to those modules locally and they don't need to wind up in the bundle file
import nodeModules from 'webpack-node-externals';
const HOST = process.env.BROWSER_HOST || 'localhost';
const PORT = process.env.BROWSER_PORT || 8080;
const LOCAL = `http://${HOST}:${PORT}/`;

export default new WebpackConfig().extend({}, 'kit/webpack/webpack.browser.base.babel.js').merge({
  mode: 'production',
  // In production, we skip all hot-reloading stuff
  entry: {
    app: path.join(process.cwd(), 'kit/entry/browser.js')
  },
  plugins: [
    new BrotliGzipPlugin({
        asset: '[path].br[query]',
        algorithm: 'brotli',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        quality: 11
    }),
    new BrotliGzipPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
    })
  ],
  // Utilize long-term caching by adding content hashes 
  // (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  target: 'web',
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
    hints: false
  },
});
