#!/usr/bin/env node

var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();
var cmd;

switch(process.platform) {
    case 'win32':
        cmd = 'node node_modules/brunch/bin/brunch watch --server';
        break;
    default:
        cmd = './node_modules/.bin/brunch watch --server';
}

shell.exec(cmd);
process.exit(0);
