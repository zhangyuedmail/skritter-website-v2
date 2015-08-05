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
          'vendor/gelato/js/gelato.js',
          'bower_components/moment/moment.js',
          'bower_components/moment-timezone/moment-timezone.js',
          'bower_components/d3/d3.js',
          'vendor/createjs/createjs.easel-NEXT.min.js',
          'vendor/createjs/createjs.tween-NEXT.min.js',
          'vendor/heatmap/heatmap-3.5.6.js',
          'vendor/highcharts/highcharts-4.1.7.js',
          'vendor/keypress/keypress-2.1.1.js'
        ]
    stylesheets:
      joinTo:
        'styles/application.css': /^(app)/
        'styles/libraries.css': /^(bower_components|vendor)/
      order:
        before: [
          'vendor/gelato/styles/gelato.css',
        ]
    templates:
      joinTo:
        'js/application.js': /^(app)/
  keyword:
    filePattern: /\.(js|css|html)$/
    map:
      "application-description": project.description
      "application-language": project.language
      "application-name": project.name
      "application-version": project.version
