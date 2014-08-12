require('../framework/config.js');
require('../www/config.js');

var configs = app.configs.getCombined();
var crosswalkVersion = '8.37.189.1';
var exclude = new RegExp(
        "(csslintrc.json|Gruntfile.js|karma.conf.js|LICENSE|README.md)|" +
        "(.git$|.gitignore$|.idea$|build$|crosswalk$|node_modules$|plugin$)"
);

module.exports = function(grunt) {

    grunt.initConfig({
        /**
         * APPLICATION
         */
        application: function() {
            if (grunt.file.isFile('../package.json')) {
                return grunt.file.readJSON('../package.json');
            }
            return grunt.file.readJSON('package.json');
        }(),
        framework: grunt.file.readJSON('package.json'),
        /**
         * CLEAN
         */
        clean: {
            'app-android-cordovalib': {
                src: ['../build/app/platforms/android/CordovaLib/**/*'],
                options: {force: true}
            },
            'app-www': {
                src: ['../build/app/www/**/*'],
                options: {force: true}
            },
            'build': {
                src: ['../build'],
                options: {force: true}
            },
            'crosswalk': {
                src: ['crosswalk/arm', 'crosswalk/x86'],
                options: {force: true}
            },
            'docs': {
                src: ['../docs'],
                options: {force: true}
            },
            'web': {
                src: ['../build/web/**/*'],
                options: {force: true}
            }
        },
        /**
         * COPY
         */
        copy: {
            'crosswalk-arm': {
                files: [
                    {expand: true, cwd: 'crosswalk/arm/framework', src: ['**'], dest: '../build/app/platforms/android/CordovaLib'},
                    {expand: true, cwd: 'crosswalk/arm', src: ['VERSION'], dest: '../build/app/platforms/android'}
                ]
            },
            'crosswalk-x86': {
                files: [
                    {expand: true, cwd: 'crosswalk/x86/framework', src: ['**'], dest: '../build/app/platforms/android/CordovaLib'},
                    {expand: true, cwd: 'crosswalk/x86', src: ['VERSION'], dest: '../build/app/platforms/android'}
                ]
            }
        },
        /**
         * CSSLINT
         */
        csslint: {
            'all': {
                options: {
                    csslintrc: 'csslintrc.json',
                    import: 2
                },
                src: ['css/gelato.css', '../www/css/main.css']
            }
        },
        /**
         * JSHINT
         */
        jshint: {
            'all': ['Gruntfile.js', 'js/core/**/*.js', '../www/js/app/**/*.js']
        },
        /**
         * MKDIR
         */
        mkdir: {
            'build': {
                options: {
                    create: ['../build/web']
                }
            }
        },
        /**
         * REQUIREJS
         */
        requirejs: {
            'app': {
                options: {
                    baseUrl: '../',
                    dir: '../build/app/www',
                    fileExclusionRegExp: exclude,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: configs.modules,
                    optimize: 'uglify',
                    optimizeCss: 'standard',
                    paths: configs.paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: configs.shim
                }
            },
            'web': {
                options: {
                    baseUrl: '../',
                    dir: '../build/web',
                    fileExclusionRegExp: exclude,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: configs.modules,
                    optimize: 'uglify',
                    optimizeCss: 'standard',
                    paths: configs.paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: configs.shim
                }
            }
        },
        /**
         * SHELL
         */
        shell: {
            'app-build': {
                command: [
                    'cd ../build/app',
                    'cordova build'
                ].join('&&')
            },
            'app-run-android': {
                command: [
                    'cd ../build/app',
                    'cordova run android'
                ].join('&&')
            },
            'install-cordova': {
                command: [
                    'cordova create ../build/app <%= application.package %> <%= application.name %>',
                    'cd ../build/app',
                    'cordova platform add android',
                    'cordova plugin add ../../framework/plugins/gelatojs-core'
                ].join('&&'),
                execOptions: {
                    cwd: '../build'
                }
            },
            'install-crosswalk': {
                command: [
                    'cd ../build/app/platforms/android/CordovaLib',
                    'android update project --subprojects --path . --target android-19',
                    'ant debug'
                ].join('&&')
            },
            'kill-adb': {
                command: 'taskkill /F /IM adb.exe',
                options: {
                    failOnError: false
                }
            }
        },
        /**
         * YUIDOC
         */
        yuidoc: {
            'default': {
                name: '<%= application.name %>',
                description: '<%= application.description %>',
                version: '<%= application.version %>',
                options: {
                    paths: ['js/core', '../www/js'],
                    themedir: '../yuidoc',
                    outdir: '../docs'
                }
            }
        },
        /**
         * UNZIP
         */
        unzip: {
            'crosswalk-arm': {
                router: function (path) {
                    return path.replace('crosswalk-cordova-' + crosswalkVersion + '-arm/', 'arm/');
                },
                src: 'crosswalk/crosswalk-cordova-' + crosswalkVersion + '-arm.zip',
                dest: 'crosswalk'
            },
            'crosswalk-x86': {
                router: function (path) {
                    return path.replace('crosswalk-cordova-' + crosswalkVersion + '-x86/', 'x86/');
                },
                src: 'crosswalk/crosswalk-cordova-' + crosswalkVersion + '-x86.zip',
                dest: 'crosswalk'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('build', [
        'clean:app-www',
        'shell:app-build'
    ]);

    grunt.registerTask('docs', [
        'clean:docs',
        'yuidoc:default'
    ]);

    grunt.registerTask('install', [
        'shell:kill-adb',
        'clean:build',
        'mkdir:build',
        'shell:install-cordova',
        'clean:app-www',
        'clean:crosswalk',
        'unzip:crosswalk-arm',
        'unzip:crosswalk-x86'
    ]);

    grunt.registerTask('migrate-crosswalk-arm', [
        'clean:app-android-cordovalib',
        'copy:crosswalk-arm',
        'shell:install-crosswalk'
    ]);

    grunt.registerTask('migrate-crosswalk-x86', [
        'clean:app-android-cordovalib',
        'copy:crosswalk-x86',
        'shell:install-crosswalk'
    ]);

    grunt.registerTask('run-android', [
        'clean:app-www',
        'requirejs:app',
        'shell:app-run-android'
    ]);

    grunt.registerTask('validate', [
        'csslint:all',
        'jshint:all'
    ]);

    grunt.registerTask('web', [
        'clean:web',
        'requirejs:web'
    ]);

};