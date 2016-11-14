'use strict';

const application = require('./package.json');

exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/application.js': /^app/,
        'js/libraries.js': /^vendor/,
        'js/startup.js': /^startup/,
        'js/test.js': /^test/
      },
      order: {
        before: [
          'vendor/jquery-2.2.3.js',
          'vendor/lodash-4.12.0.js',
          'vendor/backbone-1.3.3.js',
          'vendor/async-1.5.2.js',
          'vendor/bootstrap-3.3.6.js',
          'vendor/bootstrap.datetimepicker-4.15.37.js',
          'vendor/bootstrap.notify-3.1.5.js',
          'vendor/bootstrap.switch-3.3.2.js',
          'vendor/chai-3.5.0.js',
          'vendor/createjs.easel-0.8.2.js',
          'vendor/createjs.tween-0.6.2.js',
          'vendor/d3-3.5.16.js',
          'vendor/dexie-1.3.6.js',
          'vendor/heatmap-3.5.4.js',
          'vendor/highcharts-4.2.4.js',
          'vendor/jquery.ui-1.11.4.js',
          'vendor/keypress-2.1.4.js',
          'vendor/mocha-2.4.5.js',
          'vendor/moment-2.12.0.js',
          'vendor/moment.timezone-0.5.3.js',
          'vendor/raygun-2.4.1.js',
          'vendor/sinon-1.17.3.js',
          'vendor/wanakana-1.3.7.js',
          'vendor/daterangepicker-2.1.19.js'
        ]
      }
    },
    stylesheets: {
      joinTo: {
        'styles/application.css': /^app/,
        'styles/libraries.css': /^vendor/,
        'styles/startup.css': /^startup/,
        'styles/test.css': /^test/
      }
    },
    templates: {
      joinTo: {
        'js/application.js': /^app/,
        'js/startup.js': /^startup/
      }
    }
  },
  npm: {
    enabled: false
  },
  paths: {
    'public': 'public',
    'watched': ['app', 'startup', 'test', 'vendor']
  },
  plugins: {
    autoReload: {
      delay: 200
    },
    babel: {
      ignore: [/^vendor/, 'app/data/*', 'app/utils/*'],
      presets: ['es2015']
    },
    replace: {
      mappings: {
        'application-description': application.description,
        'application-language': process.env.PROJECT_LANG || '',
        'application-title': application.title,
        'application-version': application.version
      },
      paths: [
        'public/js/application.js',
        'public/js/libraries.js',
        'public/js/startup.js',
        'public/styles/application.css',
        'public/styles/libraries.css',
        'public/styles/startup.css'
      ]
    }
  }
};
