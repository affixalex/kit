"use strict";
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Server-side bundle for development.  Just like the production bundle, this
// runs on localhost:4000 by default, with one big difference;
//
// 1) The server is re-bundled / re-started on every code change.

import webpack from 'webpack';
import WebpackConfig from 'webpack-config';
import path from 'path';
import PATHS from '../../config/paths';
import childProcess from 'child_process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
// In the browser, we inlined stylesheets inside our JS bundles.  Now that we're
// building for the server, we'll extract them out into a separate .css file
// that can be called from our final HTML.  This plugin does the heavy lifting
import ExtractTextPlugin from 'extract-text-webpack-plugin';
/* Local */
import { regex } from './common';

// Simple Webpack plugin for (re)spawning the development server after
// every build
class ServerDevPlugin {
  apply(compiler) {
    compiler.plugin('done', () => {
      if (this.server) this.server.kill();
      this.server = childProcess.fork(path.resolve(PATHS.dist, 'server.js'), {
        cwd: PATHS.root,
        silent: false,
        execArgv: ['--inspect'],
      });
    });
  }
}

export default new WebpackConfig().extend({}, PATHS.root + '/kit/webpack/webpack.server.base.babel.js').merge({
  mode: 'development',
  entry: {
    javascript: path.resolve(PATHS.entry, 'server.dev.js')
  },
  // Don't use hashes in dev mode for better performance
  output: {
    path: PATHS.dist,
    filename: 'server.js',
    chunkFilename: 'server.[name].js'
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
    // Start the development server
    new ServerDevPlugin(),
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',
  target: 'node',
  performance: {
    hints: false
  }
});
