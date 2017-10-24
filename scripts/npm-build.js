#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './public');
shell.exec('brunch build');
shell.rm('-rf', './build');
shell.mkdir('-p', './build');
shell.cp('-r', './public/*', './build');
shell.rm('-rf', './public');
