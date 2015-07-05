project = require('./package.json')

exports.config =
  conventions:
    ignored: [
      'app/styles/variables.scss',
      'bower_components/raygun4js/dist/raygun.js'
    ]
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components|vendor)/
      order:
        before: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/lodash/lodash.js',
          'bower_components/backbone/backbone.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/moment/moment.js',
          'bower_components/moment-timezone/moment-timezone.js',
          'bower_components/d3/d3.js',
          'vendor/backbone/backbone.routefilter-0.2.0.js',
          'vendor/createjs/createjs.easel-NEXT.min.js',
          'vendor/createjs/createjs.tween-NEXT.min.js',
          'vendor/heatmap/heatmap-3.5.2.js',
          'vendor/highcharts/highcharts-4.1.7.js',
          'vendor/jquery/jquery.mobile.events-1.4.5.js',
          'vendor/jquery/jquery.ui.events-1.11.4.js'
        ]
    stylesheets:
      joinTo:
        'styles/app.css': /^(app)/
        'styles/vendor.css': /^(bower_components|vendor)/
    templates:
      joinTo:
        'js/app.js': /^app/
  keyword:
    filePattern: /\.(js|css|html)$/
    map:
      "application-language": project.language
      "application-name": project.name
      "application-version": project.version
