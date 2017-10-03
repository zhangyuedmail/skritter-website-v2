#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './public');
shell.exec('npm run lint');
shell.exec('brunch build --production');
shell.rm('-rf', './build');
shell.mkdir('-p', './build');
shell.cp('-r', './public/*', './build');
shell.rm('-rf', './public');
