#!/usr/bin/env node

var shell = require('shelljs');

shell.rm('-rf', './public');
shell.exec('brunch build --production');
//TODO: run mocha test cases
