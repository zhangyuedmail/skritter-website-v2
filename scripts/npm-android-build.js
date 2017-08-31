#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const project = require('../package.json');
const shell = require('shelljs');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova-android/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.japanese.test', './cordova-android/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova-android/config.xml');
} else {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.chinese.test', './cordova-android/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Test', './cordova-android/config.xml');
}

shell.sed('-i', '{!application-version!}', project.version, './cordova-android/config.xml');

shell.rm('-rf', './cordova-android/www/*');
shell.cp('-r', './public/*', './cordova-android/www');
shell.cp('-f', './res/gradle.properties', './cordova-android/platforms/android/gradle.properties');
shell.cp('-f', './res/xwalk-command-line', './cordova-android/platforms/android/assets/xwalk-command-line');

shell.sed('-i', '{!application-versionCode!}', project.versionCode, './cordova-android/platforms/android/gradle.properties');

shell.cd('./cordova-android');

if (lang === 'ja') {
  shell.cp('../skritter-japanese.build.json', './build.json');
} else {
  shell.cp('../skritter-chinese.build.json', './build.json');
}

shell.exec('cordova build android --buildConfig');
