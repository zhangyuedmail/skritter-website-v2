#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const project = require('../package.json');
const shell = require('shelljs');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.skritter.skritterja.test', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova/config.xml');
} else {
  shell.sed('-i', '{!application-id!}', 'com.skritter.skritter.test', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova/config.xml');
}

shell.sed('-i', '{!application-version!}', project.iosVersion, './cordova/config.xml');
shell.sed('-i', '{!application-bundleVersion!}', project.iosVersionBundle, './cordova/config.xml');

shell.rm('-rf', './cordova/www/*');
shell.cp('-r', './public/*', './cordova/www');

shell.cd('./cordova');

if (lang === 'ja') {
  shell.cp('../skritter-japanese.build.json', './build.json');
} else {
  shell.cp('../skritter-chinese.build.json', './build.json');
}

shell.exec('cordova platform rm ios');
shell.exec('cordova platform add ios');
shell.exec('cordova run ios --device --buildConfig');
