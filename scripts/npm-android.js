#!/usr/bin/env node

const lang = process.argv[2] || 'zh';
const project = require('../package.json');
const shell = require('shelljs');

process.env.PROJECT_LANG = lang;

shell.exec('brunch build');

shell.cp('./cordova.xml', './cordova/config.xml');

if (lang === 'ja') {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'japanese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Japanese', './cordova/config.xml');
} else {
  shell.sed('-i', '{!application-id!}', 'com.inkren.skritter.chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-language!}', 'chinese', './cordova/config.xml');
  shell.sed('-i', '{!application-name!}', 'Skritter Chinese', './cordova/config.xml');
}

shell.sed('-i', '{!application-version!}', project.version, './cordova/config.xml');

shell.rm('-rf', './cordova/www/*');
shell.cp('-r', './public/*', './cordova/www');

shell.cd('./cordova');

if (lang === 'ja') {
  shell.cp('../skritter-japanese.build.json', './build.json');

} else {
  shell.cp('../skritter-chinese.build.json', './build.json');
}

shell.exec('cordova run android --debug --buildConfig');
