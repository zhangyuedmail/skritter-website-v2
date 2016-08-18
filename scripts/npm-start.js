#!/usr/bin/env node

const shell = require('shelljs');

process.env.DEVELOPMENT = false;
shell.rm('-rf', './public');
shell.exec('brunch build --production');
shell.exec('node ./server.js');
