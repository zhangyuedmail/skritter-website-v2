// Karma configuration
// Generated on Fri Aug 01 2014 12:35:57 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            '../www/config.js',
            'framework/js/test.js',
            {pattern: 'framework/bootstrap/**/*.js', included: false},
            {pattern: 'framework/js/core/**/*.js', included: false},
            {pattern: 'framework/js/libs/**/*.js', included: false},
            {pattern: 'framework/specs/**/*.js', included: false},
            {pattern: 'www/js/app/**/*.js', included: false},
            {pattern: 'www/js/libs/**/*.js', included: false},
            {pattern: 'www/locale/**/*.js', included: false},
            {pattern: 'www/specs/**/*.js', included: false},
            {pattern: 'www/templates/**/*.html', included: false}
        ],


        // list of files to exclude
        exclude: [
            'framework/js/main.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
