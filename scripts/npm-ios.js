#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const project = require('../package.json');
const shell = require('shelljs');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova-ios/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.skritter.skritterja.test', './cordova-ios/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova-ios/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova-ios/config.xml');
} else {
  shell.sed('-i', '{!application-id!}', 'com.skritter.skritter.test', './cordova-ios/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova-ios/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova-ios/config.xml');
}

shell.sed('-i', '{!application-version!}', project.iosVersion, './cordova-ios/config.xml');
shell.sed('-i', '{!application-bundleVersion!}', project.iosVersionBundle, './cordova-ios/config.xml');

shell.rm('-rf', './cordova-ios/www/*');
shell.cp('-r', './public/*', './cordova-ios/www');

shell.cd('./cordova-ios');

if (lang === 'ja') {
  shell.cp('../skritter-japanese.build.json', './build.json');
} else {
  shell.cp('../skritter-chinese.build.json', './build.json');
}

shell.exec('cordova platform rm ios');
shell.exec('cordova platform add ios@4.5.0');
shell.exec('cordova run ios --device --buildConfig');
