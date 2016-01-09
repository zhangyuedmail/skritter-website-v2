#!/usr/bin/env node

var lodash = require('lodash');
var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();

shell.exec('./node_modules/.bin/brunch build');
shell.exec('./node_modules/.bin/mocha-phantomjs ./test/index.html');
process.exit(0);
