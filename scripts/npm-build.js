#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './public');
shell.exec('brunch build --production');
