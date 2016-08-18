#!/usr/bin/env node

const shell = require('shelljs');

process.env.DEVELOPMENT = false;
shell.rm('-rf', './public');
shell.exec('./node_modules/.bin/brunch watch', {async: true});
shell.exec('./node_modules/.bin/nodemon ./server.js --ignore app', {async: true});
