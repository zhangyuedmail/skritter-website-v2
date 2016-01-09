#!/usr/bin/env node

var lodash = require('lodash');
var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();

shell.exec('./node_modules/.bin/bower update');
shell.exec('./node_modules/.bin/brunch watch --server');
process.exit(0);
