#!/usr/bin/env node

var shell = require('shelljs');

shell.exec('node ./node_modules/brunch/bin/brunch build --production');
shell.exit(0);
