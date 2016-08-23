#!/usr/bin/env node

const shell = require('shelljs');

//require npm forever to be install globally
if (!shell.exec('forever --version', {silent: true})) {
  console.log('Install forever using "npm -g install forever"');
  shell.exit();
}

process.env.DEVELOPMENT = false;
shell.rm('-rf', './public');
shell.exec('brunch build --production', {async: false});
shell.exec('forever ./server.js', {async: false});
