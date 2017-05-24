#!/usr/bin/env node

const shell = require('shelljs');

shell.rm('-rf', './cordova');
shell.exec('cordova create cordova com.inkren.skritter "Skritter"');
shell.cd('./cordova');

// platforms
shell.exec('cordova platform add android@6.2.3');
shell.exec('cordova platform add ios@4.4.0');

// plugins
shell.exec('cordova plugin add cordova-plugin-crosswalk-webview');
shell.exec('cordova plugin add cordova-plugin-device');
shell.exec('cordova plugin add cordova-plugin-file');
shell.exec('cordova plugin add cordova-plugin-file-transfer');
shell.exec('cordova plugin add cordova-plugin-media');
shell.exec('cordova plugin add cordova-plugin-splashscreen');
shell.exec('cordova plugin add cordova-plugin-statusbar');
shell.exec('cordova plugin add https://github.com/mcfarljw/cordova-plugin-billing.git');
shell.exec('cordova plugin add ../plugins/core');
