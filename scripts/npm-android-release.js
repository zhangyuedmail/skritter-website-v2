#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const shell = require('shelljs');
const project = require('../package.json');
const billing = require('../skritter.billing.json');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova-android/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.japanese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter', './cordova-android/config.xml');
} else {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.chinese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova-android/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter', './cordova-android/config.xml');
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

shell.exec('cordova build android --release --buildConfig');

shell.mkdir('-p', '../output');

if (lang === 'ja') {
  shell.cp('./platforms/android/build/outputs/apk/android-armv7-release.apk', '../output/skritter-japanese-armv7.apk');
  shell.cp('./platforms/android/build/outputs/apk/android-x86-release.apk', '../output/skritter-japanese-x86.apk');
} else {
  shell.cp('./platforms/android/build/outputs/apk/android-armv7-release.apk', '../output/skritter-chinese-armv7.apk');
  shell.cp('./platforms/android/build/outputs/apk/android-x86-release.apk', '../output/skritter-chinese-x86.apk');
}
