#!/usr/bin/env node

var shell = require('shelljs');

shell.exec('git branch -a');
shell.exec('git remote update origin --prune');
shell.exit(0);
