#!/usr/bin/env node

const shell = require('shelljs');

process.env.NODE_ENV = 'development';
shell.rm('-rf', './public');
shell.exec('brunch watch', {async: true});
shell.exec('nodemon ./server.js --config ./nodemon.json', {async: true});
