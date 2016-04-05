#!/usr/bin/env node

var lodash = require('lodash');
var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();

switch(process.platform) {
    case 'win32':
        shell.exec('node node_modules/brunch/bin/brunch build');
		shell.exec('node node_modules/mocha-phantomjs/bin/mocha-phantomjs ./test/index.html');
        break;
    default:
        shell.exec('./node_modules/.bin/brunch build');
		shell.exec('./node_modules/.bin/mocha-phantomjs ./test/index.html');
}

process.exit(0);
