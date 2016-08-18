#!/usr/bin/env node

const shell = require('shelljs');

shell.exec('git branch -a');
shell.exec('git remote update origin --prune');
