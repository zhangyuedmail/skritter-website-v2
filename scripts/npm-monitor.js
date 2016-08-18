#!/usr/bin/env node

const shell = require('shelljs');

process.env.DEVELOPMENT = false;
shell.rm('-rf', './public');
shell.exec('brunch watch', {async: true});
shell.exec('nodemon ./server.js --ignore app', {async: true});
