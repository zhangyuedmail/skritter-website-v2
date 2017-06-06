#!/usr/bin/env node

const shell = require('shelljs');

// for whether to use local backend
process.env.THINK_LOCALLY = process.argv.length > 2  && process.argv[2] === 'thinkLocally';

// use this for better brunch logs
// process.env.LOGGY_STACKS = true;

process.env.NODE_ENV = 'development';
shell.rm('-rf', './public');
shell.exec('brunch watch', {async: true});
shell.exec('nodemon ./server.js --config ./nodemon.json', {async: true});
