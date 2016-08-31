#!/usr/bin/env node

const shell = require('shelljs');

process.env.NODE_ENV = 'development';
shell.exec('mocha ./test/selenium/run.js --timeout 15000', {async: true});
