#!/usr/bin/env node

const shell = require('shelljs');

process.env.NODE_ENV = 'development';
shell.exec('nightwatch', {async: true});
