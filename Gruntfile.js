/**
 * @module Gruntfile
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {
    var paths = {
        //directories
        template: '../../template',
        spec: '../../test/spec',
        //libraries
        async: '../lib/async-0.7.0',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        moment: '../lib/moment-2.6.0.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.10'
    };
    var shim = {
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
        }
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*** CLEAN ***/
        clean: {
            'build-cordova': {
                src: ['build/cordova/'],
                options: {
                    force: true
                }
            },
            'build-cordova-www-ja': {
                src: ['build/cordova/japanese/www/'],
                options: {
                    force: true
                }
            },
            'build-cordova-www-zh': {
                src: ['build/cordova/chinese/www/'],
                options: {
                    force: true
                }
            },
            'build-web': {
                src: ['build/web/'],
                options: {
                    force: true
                }
            }
        },
        /*** CLEAN ***/
        copy: {
            'cordova-config-ja': {
                files: [
                    {
                        expand: true,
                        cwd: 'cordova/japanese',
                        src: '**',
                        dest: 'build/cordova/japanese/'
                    }
                ]
            },
            'cordova-config-zh': {
                files: [
                    {
                        expand: true,
                        cwd: 'cordova/chinese',
                        src: '**',
                        dest: 'build/cordova/chinese/'
                    }
                ]
            },
            'cordova-www-ja': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html/',
                        src: [
                            '**',
                            '!fonts/simkai.ttf'
                        ],
                        dest: 'build/cordova/japanese/www/'
                    }
                ]
            },
            'cordova-www-zh': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html/',
                        src: [
                            '**',
                            '!fonts/DFPKaiSho-Md.ttf'
                        ],
                        dest: 'build/cordova/chinese/www/'
                    }
                ]
            }
        },
        /*** JSHINT ***/
        jshint: {
            root: ['Gruntfile.js', 'public_html/js/app/**/*.js']
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
            'cordova-ja': {
                options: {
                    variables: {
                        'date': new Date().toUTCString().substr(0, 25),
                        'language': 'ja',
                        'version': '<%= pkg.version %>',
                        'versionCode': '<%= pkg.versionCode %>'
                    }
                },
                files: [
                    {src: 'config.xml', dest: 'build/cordova/japanese/', expand: true, cwd: 'build/cordova/japanese/'},
                    {src: 'Settings.js', dest: 'build/cordova/japanese/www/js/app/model/', expand: true, cwd: 'build/cordova/japanese/www/js/app/model/'}
                ]
            },
            'cordova-zh': {
                options: {
                    variables: {
                        'date': new Date().toUTCString().substr(0, 25),
                        'language': 'zh',
                        'version': '<%= pkg.version %>',
                        'versionCode': '<%= pkg.versionCode %>'
                    }
                },
                files: [
                    {src: 'config.xml', dest: 'build/cordova/chinese/', expand: true, cwd: 'build/cordova/chinese/'},
                    {src: 'Settings.js', dest: 'build/cordova/chinese/www/js/app/model/', expand: true, cwd: 'build/cordova/chinese/www/js/app/model/'}
                ]
            }
        },
        /*** SHELL ***/
        shell: {
            'cordova-build-android-ja': {
                command: [
                    'cd build/cordova/japanese/',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-build-android-zh': {
                command: [
                    'cd build/cordova/chinese/',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-build-run-android-ja': {
                command: [
                    'cd build/cordova/japanese/',
                    'cordova build android --release',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-build-run-android-zh': {
                command: [
                    'cd build/cordova/chinese/',
                    'cordova build android --release',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-create-ja': {
                command: [
                    'cd build/cordova/',
                    'cordova create japanese com.inkren.skritter.japanese Skritter',
                    'cd japanese/',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-create-zh': {
                command: [
                    'cd build/cordova/',
                    'cordova create chinese com.inkren.skritter.chinese Skritter',
                    'cd chinese/',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-prepare': {
                command: [
                    'cd build/',
                    'mkdir cordova'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'kill-adb': {
                command: 'taskkill /F /IM adb.exe',
                options: {
                    stdout: true
                }
            }
        }
    });
    /*** PACKAGES ***/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');
    /*** COMMANDS ***/
    grunt.registerTask('appcache', [
        'manifest:root'
    ]);
    grunt.registerTask('build-android', [
        'build-android-ja',
        'build-android-zh'
    ]);
    grunt.registerTask('build-android-ja', [
        'jshint:root',
        'clean:build-cordova-www-ja',
        'copy:cordova-www-ja',
        'copy:cordova-config-ja',
        'replace:cordova-ja',
        'shell:cordova-build-android-ja'
    ]);
    grunt.registerTask('build-android-zh', [
        'jshint:root',
        'clean:build-cordova-www-zh',
        'copy:cordova-www-zh',
        'copy:cordova-config-zh',
        'replace:cordova-zh',
        'shell:cordova-build-android-zh'
    ]);
    grunt.registerTask('build-run-android', [
        'build-run-android-ja',
        'build-run-android-zh'
    ]);
    grunt.registerTask('build-run-android-ja', [
        'jshint:root',
        'clean:build-cordova-www-ja',
        'copy:cordova-www-ja',
        'copy:cordova-config-ja',
        'replace:cordova-ja',
        'shell:cordova-build-run-android-ja'
    ]);
    grunt.registerTask('build-run-android-zh', [
        'jshint:root',
        'clean:build-cordova-www-zh',
        'copy:cordova-www-zh',
        'copy:cordova-config-zh',
        'replace:cordova-zh',
        'shell:cordova-build-run-android-zh'
    ]);
    grunt.registerTask('hint', [
        'jshint:root'
    ]);
    grunt.registerTask('install-cordova', [
        'shell:kill-adb',
        'clean:build-cordova',
        'shell:cordova-prepare',
        'shell:cordova-create-ja',
        'shell:cordova-create-zh'
    ]);
};