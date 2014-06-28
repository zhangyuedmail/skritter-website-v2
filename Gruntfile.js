/**
 * @module Gruntfile
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {

    /*** REQUIREJS CONFIG ***/
    var requirejs = {
        paths: {
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
        },
        shim: {
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
        }
    };

    grunt.initConfig({
        /*** PACKAGE ***/
        pkg: grunt.file.readJSON('package.json'),
        /*** CLEAN ***/
        clean: {
            'cordova-chinese': {
                src: ['build/cordova/chinese'],
                options: {force: true}
            },
            'cordova-chinese-config': {
                src: [
                    'build/cordova/chinese/www/**/*',
                    'build/cordova/chinese/platforms/android/res/drawable-land-hdpi',
                    'build/cordova/chinese/platforms/android/res/drawable-land-ldpi',
                    'build/cordova/chinese/platforms/android/res/drawable-land-mdpi',
                    'build/cordova/chinese/platforms/android/res/drawable-land-xhdpi',
                    'build/cordova/chinese/platforms/android/res/drawable-port-hdpi',
                    'build/cordova/chinese/platforms/android/res/drawable-port-ldpi',
                    'build/cordova/chinese/platforms/android/res/drawable-port-mdpi',
                    'build/cordova/chinese/platforms/android/res/drawable-port-xhdpi'
                ],
                options: {force: true}
            },
            'cordova-chinese-cordovalib': {
                src: ['build/cordova/chinese/platforms/android/CordovaLib/**/*'],
                options: {force: true}
            },
            'cordova-japanese': {
                src: ['build/cordova/japanese'],
                options: {force: true}
            },
            'cordova-japanese-config': {
                src: [
                    'build/cordova/japanese/www/**/*',
                    'build/cordova/japanese/platforms/android/res/drawable-land-hdpi',
                    'build/cordova/japanese/platforms/android/res/drawable-land-ldpi',
                    'build/cordova/japanese/platforms/android/res/drawable-land-mdpi',
                    'build/cordova/japanese/platforms/android/res/drawable-land-xhdpi',
                    'build/cordova/japanese/platforms/android/res/drawable-port-hdpi',
                    'build/cordova/japanese/platforms/android/res/drawable-port-ldpi',
                    'build/cordova/japanese/platforms/android/res/drawable-port-mdpi',
                    'build/cordova/japanese/platforms/android/res/drawable-port-xhdpi'
                ],
                options: {force: true}
            },
            'cordova-japanese-cordovalib': {
                src: ['build/cordova/chinese/platforms/android/CordovaLib/**/*'],
                options: {force: true}
            }
        },
        /*** COPY ***/
        copy: {
            'cordova-chinese-config': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/chinese',
                        src: '**/*',
                        dest: 'build/cordova/chinese'
                    }
                ]
            },
            'cordova-chinese-crosswalk-arm': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/crosswalk/arm/framework',
                        src: '**/*',
                        dest: 'build/cordova/chinese/platforms/android/CordovaLib'
                    },
                    {
                        expand: true,
                        cwd: 'config/android/arm',
                        src: '**/*',
                        dest: 'build/cordova/chinese/platforms/android'
                    }
                ]
            },
            'cordova-chinese-crosswalk-x86': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/crosswalk/x86/framework',
                        src: '**/*',
                        dest: 'build/cordova/chinese/platforms/android/CordovaLib'
                    },
                    {
                        expand: true,
                        cwd: 'config/android/x86',
                        src: '**/*',
                        dest: 'build/cordova/chinese/platforms/android'
                    }
                ]
            },
            'cordova-chinese-www': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html',
                        src: ['**', '!font/japanese/**'],
                        dest: 'build/cordova/chinese/www'
                    }
                ]
            },
            'cordova-japanese-config': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/japanese',
                        src: '**/*',
                        dest: 'build/cordova/japanese'
                    }
                ]
            },
            'cordova-japanese-crosswalk-arm': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/crosswalk/arm/framework',
                        src: '**/*',
                        dest: 'build/cordova/japanese/platforms/android/CordovaLib'
                    },
                    {
                        expand: true,
                        cwd: 'config/android/arm',
                        src: '**/*',
                        dest: 'build/cordova/japanese/platforms/android'
                    }
                ]
            },
            'cordova-japanese-crosswalk-x86': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/crosswalk/x86/framework',
                        src: '**/*',
                        dest: 'build/cordova/japanese/platforms/android/CordovaLib'
                    },
                    {
                        expand: true,
                        cwd: 'config/android/x86',
                        src: '**/*',
                        dest: 'build/cordova/japanese/platforms/android'
                    }
                ]
            },
            'cordova-japanese-www': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html',
                        src: ['**', '!font/chinese/**'],
                        dest: 'build/cordova/japanese/www'
                    }
                ]
            }
        },
        /*** CSSLINT ***/
        csslint: {
            'public-html': {
                options: {
                    csslintrc: 'csslintrc.json',
                    import: 2
                },
                src: ['public_html/css/**/*.css']
            }
        },
        /*** JSHINT ***/
        jshint: {
            'public-html': ['Gruntfile.js', 'public_html/js/app/**/*.js']
        },
        /*** MANIFEST ***/
        manifest: {
            'public-html': {
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
        /*** MKDIR ***/
        mkdir: {
            'cordova': {
                options: {
                    create: ['build/cordova']
                }
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
                    paths: requirejs.paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: requirejs.shim
                }
            }
        },
        /*** SHELL ***/
        shell: {
            'build-cordova-chinese': {
                command: [
                    'cd build/cordova/chinese',
                    'cordova build android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'build-cordova-chinese-release': {
                command: [
                    'cd build/cordova/chinese',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'build-cordova-japanese': {
                command: [
                    'cd build/cordova/japanese',
                    'cordova build android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'build-cordova-japanese-release': {
                command: [
                    'cd build/cordova/japanese',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-chinese': {
                command: [
                    'cordova create build/cordova/chinese com.inkren.skritter.chinese Skritter',
                    'cd build/cordova/chinese',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-analytics.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-inappbilling.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-chinese-crosswalk': {
                command: [
                    'cd build/cordova/chinese/platforms/android/CordovaLib',
                    'android update project --subprojects --path . --target android-19',
                    'ant debug'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-japanese': {
                command: [
                    'cordova create build/cordova/japanese com.inkren.skritter.japanese Skritter',
                    'cd build/cordova/japanese',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-analytics.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-inappbilling.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-japanese-crosswalk': {
                command: [
                    'cd build/cordova/japanese/platforms/android/CordovaLib',
                    'android update project --subprojects --path . --target android-19',
                    'ant debug'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'kill-adb': {
                command: 'taskkill /F /IM adb.exe',
                options: {
                    failOnError: false,
                    stderr: true,
                    stdout: true
                }
            }
        }
    });

    /*** PLUGINS ***/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');

    /*** TASKS: BUILD ***/
    grunt.registerTask('build-cordova-chinese', [
        'copy:cordova-chinese-config',
        'copy:cordova-chinese-www',
        'shell:build-cordova-chinese'
    ]);
    grunt.registerTask('build-cordova-japanese', [
        'copy:cordova-japanese-config',
        'copy:cordova-japanese-www',
        'shell:build-cordova-japanese'
    ]);

    /*** TASKS: INSTALL ***/
    grunt.registerTask('install-cordova-arm', [
        'install-cordova-chinese-arm',
        'install-cordova-japanese-arm'
    ]);
    grunt.registerTask('install-cordova-x86', [
        'install-cordova-chinese-x86',
        'install-cordova-japanese-x86'
    ]);
    grunt.registerTask('install-cordova-chinese-arm', [
        'mkdir:cordova',
        'clean:cordova-chinese',
        'shell:install-cordova-chinese',
        'clean:cordova-chinese-config',
        'clean:cordova-chinese-cordovalib',
        'copy:cordova-chinese-config',
        'copy:cordova-chinese-crosswalk-arm',
        'shell:install-cordova-chinese-crosswalk'
    ]);
    grunt.registerTask('install-cordova-chinese-x86', [
        'mkdir:cordova',
        'clean:cordova-chinese',
        'shell:install-cordova-chinese',
        'clean:cordova-chinese-cordovalib',
        'clean:cordova-chinese-config',
        'copy:cordova-chinese-config',
        'copy:cordova-chinese-crosswalk-x86',
        'shell:install-cordova-chinese-crosswalk'
    ]);
    grunt.registerTask('install-cordova-japanese-arm', [
        'mkdir:cordova',
        'clean:cordova-japanese',
        'shell:install-cordova-japanese',
        'clean:cordova-japanese-config',
        'clean:cordova-japanese-cordovalib',
        'copy:cordova-japanese-config',
        'copy:cordova-japanese-crosswalk-arm',
        'shell:install-cordova-japanese-crosswalk'
    ]);
    grunt.registerTask('install-cordova-japanese-x86', [
        'mkdir:cordova',
        'clean:cordova-japanese',
        'shell:install-cordova-japanese',
        'clean:cordova-japanese-cordovalib',
        'clean:cordova-japanese-config',
        'copy:cordova-japanese-config',
        'copy:cordova-japanese-crosswalk-x86',
        'shell:install-cordova-japanese-crosswalk'
    ]);
};