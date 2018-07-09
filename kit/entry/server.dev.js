"use strict";
/* eslint-disable no-console */

// Development server entry point.  Spawns the server on default HOST:PORT

// ----------------------
// IMPORTS

// Chalk terminal library
import chalk from 'chalk';
// Import console messages
import { logServerStarted } from 'kit/lib/console';
// Extend the server base
import server, { createReactHandler, staticMiddleware } from './server';
import webpack from 'webpack';
const config = require('../webpack/webpack.server.dev.babel.js');
//const compiler = webpack(config);
//const koaWebpack = require('koa-webpack');

// ----------------------

// Get manifest values
const css = 'assets/css/style.css';
const scripts = ['vendor.js', 'browser.js'];

// Spawn the development server.
// Runs inside an immediate `async` block, to await listening on ports
(async () => {
  const { app, router, listen } = server;
//  const compile = webpack(devConfig)

  // Create proxy to tunnel requests to the browser `webpack-dev-server`
  router.get('/*', createReactHandler([] /* css */, scripts));
//  koaWebpack({ compiler }).then((middleware) => {
//    app.use(middleware);
//  });

  console.log("starting");

  // Connect the development routes to the server
  app
    .use(staticMiddleware())
    .use(router.routes())
    .use(router.allowedMethods());

  // Spawn the server
  listen();

  // Log to the terminal that we're ready for action
  logServerStarted({
    type: 'server-side rendering',
    chalk: chalk.bgYellow.black,
  });
})();
