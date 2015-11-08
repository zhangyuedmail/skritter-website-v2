project = require('./package.json')

exports.config =
  conventions:
    ignored: ['app/styles/variables.scss']
  files:
    javascripts:
      joinTo:
        'js/application.js': /^(app)/
        'js/libraries.js': /^(bower_components|vendor)/
      order:
        before: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/lodash/lodash.js',
          'bower_components/backbone/backbone.js',
          'bower_components/async/dist/async.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/moment/moment.js',
          'bower_components/moment-timezone/moment-timezone.js',
          'bower_components/d3/d3.js',
          'vendor/jquery/jquery.mobile-1.4.5.js',
          'vendor/jquery/jquery.ui-1.11.4.js',
          'vendor/bootstrap/bootstrap.datetimepicker-4.15.35.js',
          'vendor/bootstrap/bootstrap.notify-3.1.5.js',
          'vendor/bootstrap/bootstrap.switch-3.3.2.js',
          'vendor/createjs/easeljs-NEXT.js',
          'vendor/createjs/tweenjs-NEXT.js',
          'vendor/heatmap/heatmap-3.5.6.js',
          'vendor/highcharts/highcharts-4.1.8.js',
          'vendor/keypress/keypress-2.1.3.js',
          'vendor/wanakana/wanakana-1.3.7.js'
        ]
    stylesheets:
      joinTo:
        'styles/application.css': /^(app)/
        'styles/libraries.css': /^(bower_components|vendor)/
    templates:
      joinTo:
        'js/application.js': /^(app)/
  keyword:
    filePattern: /\.(js|css|html)$/
    map:
      "application-description": project.description
      "application-name": project.name
      "application-version": project.version
