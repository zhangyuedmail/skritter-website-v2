var application = require('./package.json');

exports.config = {
    files: {
        javascripts: {
            joinTo: {
                'js/application.js': /^app[\\/]/,
                'js/libraries.js': /^(bower_components|vendor)[\\/]/,
                'js/test.js': /^test[\\/]/
            },
            order: {
                before: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/lodash/lodash.js',
                    'bower_components/backbone/backbone.js',
                    'bower_components/gelato/gelato.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/d3/d3.js',
                    'bower_components/async/dist/async.js',
                    'bower_components/chai/chai.js',
                    'bower_components/createjs-easel/easeljs-0.8.1.combined.js',
                    'bower_components/createjs-tween/tweenjs-0.6.1.combined.js',
                    'bower_components/mocha/mocha.js',
                    'bower_components/moment/moment.js',
                    'bower_components/moment-timezone/moment-timezone.js',
                    'vendor/jquery/jquery.mobile-1.4.5.js',
                    'vendor/jquery/jquery.ui-1.11.4.js',
                    'vendor/bootstrap/bootstrap.datetimepicker-4.15.37.js',
                    'vendor/bootstrap/bootstrap.notify-3.1.5.js',
                    'vendor/bootstrap/bootstrap.switch-3.3.2.js',
                    'vendor/heatmap/heatmap-3.5.4.js',
                    'vendor/highcharts/highcharts-4.1.9.js',
                    'vendor/keypress/keypress-2.1.3.js',
                    'vendor/wanakana/wanakana-1.3.7.js'
                ]
            }
        },
        stylesheets: {
            joinTo: {
                'styles/application.css': /^app[\\/]/,
                'styles/libraries.css': /^(bower_components|vendor)[\\/]/,
                'styles/test.css': /^test[\\/]/
            }
        },
        templates: {
            joinTo: {
                'js/application.js': /^app[\\/]/
            }
        }
    },
    paths: {
        'public': 'public',
        'watched': ['app', 'test', 'vendor']
    },
    plugins: {
        replace: {
            mappings: {
                'application-description': application.description,
                'application-title': application.title,
                'application-version': application.version
            },
            paths: [
                'public/js/application.js',
                'public/js/libraries.js',
                'public/styles/application.css',
                'public/styles/libraries.css'
            ]
        }
    }
};
