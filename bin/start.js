#!/usr/bin/env node

var os = require('os');
var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();
var isWindows = /win/.test(os.platform());

var cmd = './node_modules/.bin/brunch watch --server';
if (isWindows) {
	cmd = 'node node_modules/brunch/bin/brunch watch --server';
}
shell.exec(cmd);
process.exit(0);
