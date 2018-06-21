/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Server-side bundle for development.  Just like the production bundle, this
// runs on localhost:4000 by default, with two differences;
//
// 1) No files are emitted. This bundle runs in memory.
// 2) The server is re-bundled / re-started on every code change.

const path = require('path');
const config = require('./webpack.server.dev.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  // Add hot reloading in development
  entry: [
    path.join(process.cwd(), 'kit/entry/server.dev.js') // Start with src/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: 'server.js',
    chunkFilename: 'server.[name].chunk.js'
  },

  // Add development plugins
  plugins: [
    new webpack.DefinePlugin({
      // We ARE running on the server
      SERVER: true,
      'process.env': {
        // Point the server host/port to the production server
        HOST: JSON.stringify(process.env.HOST || 'localhost'),
        PORT: JSON.stringify(process.env.PORT || '8081'),
        SSL_PORT: process.env.SSL_PORT ? JSON.stringify(process.env.SSL_PORT) : null,

        // Debug development
        NODE_ENV: JSON.stringify('development'),
        DEBUG: true,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'kit/views/browser.html'
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false // show a warning when there is a circular dependency
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',
  target: 'node',
  performance: {
    hints: false
  }
});
