#!/usr/bin/env node

var shell = require('shelljs');
var path = process.cwd().toString();

shell.cd(path + '/cordova/chinese');
shell.mkdir('-p', ['./platforms', './plugins', './www']);
shell.exec('cordova platform remove android');
shell.exec('cordova platform add android');
shell.exec('cordova plugin update');

shell.cd(path + '/cordova/japanese');
shell.mkdir('-p', ['./platforms', './plugins', './www']);
shell.exec('cordova platform remove android');
shell.exec('cordova platform add android');
shell.exec('cordova plugin update');

process.exit(0);
