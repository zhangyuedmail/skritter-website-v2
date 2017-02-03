#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './cordova');
shell.exec('cordova create cordova com.inkren.skritter "Skritter"');
shell.cp('./cordova.xml', './cordova/config.xml');
shell.sed('-i', '{!application-id!}', 'com.inkren.skritter', './cordova/config.xml');
shell.sed('-i', '{!application-name!}', 'Skritter', './cordova/config.xml');
shell.cd('./cordova');

//platforms
shell.exec('cordova platform add android');
shell.exec('cordova platform add ios');

//plugins
shell.exec('cordova plugin add cordova-plugin-crosswalk-webview');
shell.exec('cordova plugin add cordova-plugin-device');
shell.exec('cordova plugin add cordova-plugin-splashscreen');
shell.exec('cordova plugin add cordova-plugin-statusbar');
shell.exec('cordova plugin add ../plugins/core');
