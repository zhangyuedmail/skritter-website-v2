#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const shell = require('shelljs');
const project = require('../package.json');
const billing = require('../skritter.billing.json');

process.env.PROJECT_LANG = lang;

shell.exec('npm run install-cordova');
shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova/config.xml');

if (lang === 'ja') {
  shell.exec('cordova plugin add cc.fovea.cordova.purchase --variable BILLING_KEY=' + billing.skritter_chinese);
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Japanese', './cordova/config.xml');
  shell.cp('./skritter-japanese.build.json', './cordova/build.json');
} else {
  shell.exec('cordova plugin add cc.fovea.cordova.purchase --variable BILLING_KEY=' + billing.skritter_japanese);
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Chinese', './cordova/config.xml');
  shell.cp('./skritter-chinese.build.json', './cordova/build.json');
}

shell.sed('-i', '{!application-version!}', project.version, './cordova/config.xml');

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
