"use strict";
/**
 * COMMON WEBPACK CONFIGURATION
 */
// Webpack 4 is our bundler of choice.
const webpack = require('webpack').default;
// We'll use `webpack-config` to create a 'base' config that can be
// merged/extended from for further configs
const WebpackConfig = require('webpack-config').default;
// We need to extract text.
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
// Our local path configuration, so webpack knows where everything is/goes.
// Since we haven't yet established our module resolution paths, we have to
// use the full relative path
const PATHS = require('../../config/paths').default;
// Plugin to allow us to exclude `node_modules` packages from the final
// bundle.  Since we'll be running `server.js` from Node, we'll have access
// to those modules locally and they don't need to wind up in the bundle file
const nodeModules = require('webpack-node-externals');
/* Local */
const { regex, css } = require('./common');
// Disable deprecation warnings.
process.noDeprecation = true;

// Helper function to recursively filter through loaders, and apply the
// supplied function
function recursiveLoader(root = {}, func) {
  if (root.rules) {
    root.use.forEach(l => recursiveLoader(l, func));
  }
  if (root.loader) return func(root);
  return false;
}

module.exports = new WebpackConfig().merge({
  output: Object.assign({ // Compile into 'dist'
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
  }), // Merge with env dependent settings
  resolve: {
    modules: ['src', 'node_modules', '.'],
    extensions: [
      '.js',
      '.jsx',
      '.scss',
      '.react.js'
    ],
    mainFields: [
      'server',
    ]
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        // Preprocess our own .scss files
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['css-loader', 'style-loader'],
      },
      // .js(x) files can extend the `.babelrc` file at the root of the project
      // (which was used to spawn Webpack in the first place), because that's
      // exactly the same polyfill config we'll want to use for this bundle
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
          ],
          plugins: [
            "transform-class-properties",
            "transform-decorators-legacy",
            "dynamic-import-node",
            "graphql-tag",
            "import-graphql",
            "transform-react-remove-prop-types",
            "transform-react-constant-elements",
            "transform-react-inline-elements"
          ],
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ],
  target: 'node',
  // No need to transpile `node_modules` files, since they'll obviously
  // still be available to Node.js when we run the resulting `server.js` file
  externals: nodeModules({
    whitelist: [
      regex.fonts,
      regex.images,
    ],
  }),
  node: {
    __dirname: false,
  }
});
