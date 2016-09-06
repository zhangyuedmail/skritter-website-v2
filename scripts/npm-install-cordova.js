#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './cordova');
shell.exec('cordova create cordova com.inkren.skritter Skritter');
shell.cd('./cordova');

//platforms
shell.exec('cordova platform add android');
shell.exec('cordova platform add ios');

//plugins
shell.exec('cordova plugin add cordova-plugin-crosswalk-webview');
