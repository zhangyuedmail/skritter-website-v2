#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const shell = require('shelljs');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Japanese', './cordova/config.xml');
  shell.cp('./skritter-japanese.build.json', './cordova/build.json');
} else {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Chinese', './cordova/config.xml');
  shell.cp('./skritter-chinese.build.json', './cordova/build.json');
}

shell.sed('-i', '{!application-version!}', '2.0.0', './cordova/config.xml');

shell.rm('-rf', './cordova/www/*');
shell.cp('-r', './public/*', './cordova/www');

shell.cd('./cordova');
shell.exec('cordova build android --release --buildConfig');

if (lang === 'ja') {
  shell.cp('./platforms/android/build/outputs/apk/android-armv7-release.apk', '../skritter-japanese-armv7.apk');
  shell.cp('./platforms/android/build/outputs/apk/android-x86-release.apk', '../skritter-japanese-x86.apk');
} else {
  shell.cp('./platforms/android/build/outputs/apk/android-armv7-release.apk', '../skritter-chinese-armv7.apk');
  shell.cp('./platforms/android/build/outputs/apk/android-x86-release.apk', '../skritter-chinese-x86.apk');
}
