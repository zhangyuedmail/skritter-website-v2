#!/usr/bin/env node

var shell = require('shelljs');

shell.exec('node ./node_modules/brunch/bin/brunch build');
shell.exec('node ./node_modules/mocha-phantomjs/bin/mocha-phantomjs ./test/index.html');
process.exit(0);
