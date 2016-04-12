#!/usr/bin/env node

var shell = require('shelljs');

shell.rm('-rf', './public');
shell.exec('node ./node_modules/brunch/bin/brunch watch --server');
shell.exit(0);
