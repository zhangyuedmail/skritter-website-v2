#!/usr/bin/env node

var lodash = require('lodash');
var minimist = require('minimist');
var shell = require('shelljs');

var argv = minimist(process.argv.slice(2));
var path = process.cwd().toString();

switch (argv.lang) {
    case 'ja':
        shell.cd(path + '/cordova/japanese');
        break;
    case 'zh':
        shell.cd(path + '/cordova/chinese');
        break;
    default:
        console.error('Unable to build specified language.');
        process.exit(1);
}

shell.rm('-rf', './www');
shell.cp('-rf', '../../public/*', './www');
shell.exec('cordova run ios');

process.exit(0);
