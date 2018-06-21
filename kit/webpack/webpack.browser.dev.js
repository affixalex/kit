// Important modules this config uses
const path = require('path');
const PATHS = require('../../config/paths');

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  entry: [
    path.join(process.cwd(), 'kit/entry/browser.js') // Start with js/app.js
  ],
  module: {
    rules: [
      {
         test: /\.(js|jsx)$/,
         include: PATHS.src,
         loader: require.resolve('babel-loader'),
         options: {
           // This is a feature of `babel-loader` for webpack (not Babel itself).
           // It enables caching results in ./node_modules/.cache/babel-loader/
           // directory for faster rebuilds.
           cacheDirectory: true,
           plugins: ['react-hot-loader/babel'],
         },
      }
    ]
  },
  // Dev server configuration
  devServer: {

    // bind our dev server to the correct host and port
    host: HOST,
    port: PORT,

    // link HTTP -> app/public, so static assets are being pulled from
    // our source directory and not the `dist/public` we'd normally use in
    // production.  Use `PATH.views` as a secondary source, for serving
    // the /webpack.html fallback
    contentBase: [
      PATHS.static,
      PATHS.views,
    ],

    // Enables compression to better represent build sizes
    compress: true,

    // Assume app/public is the root of our dev server
    publicPath: '',

    // Inline our code, so we wind up with one, giant bundle
    inline: true,

    // Hot reload FTW! Every change is pushed down to the browser
    // with no refreshes
    hot: true,

    // Disable build's information
    noInfo: false,

    // Show a full-screen overlay in the browser when there is a
    // compiler error
    overlay: true,

    // We're using React Router for all routes, so redirect 404s
    // back to the webpack-dev-server bootstrap HTML
    historyApiFallback: {
      index: '/webpack.html',
    },

    // Allow any origins, for use with Docker or alternate hosts, etc
    headers: {
      'Access-Control-Allow-Origin': '*',
    },

    // Format output stats
    stats,
  },

  // Extra output options, specific to the dev server -- source maps and
  // our public path
  // No hashes in development (for speed)
  output: {
    publicPath: `${LOCAL}`,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  }
});
