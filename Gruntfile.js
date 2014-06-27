/**
 * @module Gruntfile
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {

    var paths = {
        //directories
        spec: '../../test/spec',
        template: '../../template',
        //libraries
        async: '../lib/async-0.9.0',
        backbone: '../lib/backbone-1.1.2.min',
        bootstrap: '../../bootstrap/js/bootstrap.min',
        'bootstrap.notify': '../../bootstrap/components/notify/bootstrap-notify.min',
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../lib/createjs.easel-NEXT.min',
        'createjs.tween': '../lib/createjs.tween-NEXT.min',
        moment: '../lib/moment-2.7.0.min',
        'moment-timezone': '../lib/moment.timezone-0.1.0.min',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        jquery: '../lib/jquery-1.11.1.min',
        'jquery.mobile': '../lib/jquery.mobile.custom.min',
        'jquery.ui': '../lib/jquery.ui.custom-1.10.4.min',
        raygun: '../lib/raygun-1.8.4.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.12',
        underscore: '../lib/lodash.compat-2.4.1.min'
    };

    var shim = {
        bootstrap: ['jquery'],
        'bootstrap.notify': ['bootstrap'],
        'bootstrap.switch': ['bootstrap'],
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'jasmine'
        },
        'jquery.mobile': ['jquery'],
        'jquery.ui': ['jquery'],
        'moment-timezone': ['moment']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*** CLEAN ***/
        clean: {
        },

        /*** COPY ***/
        copy: {
        },

        /*** CSSLINT ***/
        csslint: {
            'root': {
                options: {
                    csslintrc: 'csslintrc.json',
                    import: 2
                },
                src: ['public_html/css/**/*.css']
            }
        },

        /*** JSHINT ***/
        jshint: {
            'root': ['Gruntfile.js', 'public_html/js/app/**/*.js']
        },

        /*** MANIFEST ***/
        manifest: {
            root: {
                options: {
                    basePath: 'public_html/',
                    cache: ['index.html'],
                    network: ['*'],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    exclude: ['skritter.appcache', 'version.json']
                },
                src: [
                    '*.*',
                    '**/*.css',
                    '**/*.eot',
                    '**/*.html',
                    '**/*.js',
                    '**/*.otf',
                    '**/*.png',
                    '**/*.svg',
                    '**/*.woff'
                ],
                dest: 'public_html/skritter.appcache'
            }
        },

        /*** REPLACE ***/
        replace: {
        },

        /*** REQUIREJS ***/
        requirejs: {
            'web': {
                options: {
                    appDir: 'public_html/',
                    baseUrl: 'js/app',
                    dir: 'build/web',
                    generateSourceMaps: true,
                    keepBuildDir: false,
                    modules: [
                        {
                            name: 'Application'
                        },
                        {
                            name: 'Libraries'
                        }
                    ],
                    optimize: 'uglify2',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: shim
                }
            }
        },

        /*** SHELL ***/
        shell: {
        }
    });

    /*** PACKAGES ***/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');

    /*** COMMANDS ***/


    //INSTALLATION
    grunt.registerTask('install-cordova-chinese', [
    ]);
    grunt.registerTask('install-cordova-japanese', [
    ]);
};