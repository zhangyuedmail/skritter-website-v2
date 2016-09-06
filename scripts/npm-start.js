#!/usr/bin/env node

const shell = require('shelljs');

process.env.NODE_ENV = 'production';
shell.exec('node ./server.js', {async: false});
