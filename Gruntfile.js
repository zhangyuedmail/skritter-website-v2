/**
 * @module Gruntfile
 * @param grunt
 * @author Joshua McFarland
 */

module.exports = function(grunt) {
    var paths = {
        //directories
        templates: '../../templates',
        specs: '../../tests/specs/',
        //libraries
        async: '../libs/async',
        jasmine: '../../tests/libs/jasmine',
        'jasmine-html': '../../tests/libs/jasmine-html',
        'jasmine-boot': '../../tests/libs/boot',
        moment: '../libs/moment-2.5.1.min',
        'require.text': '../libs/require.text-2.0.10'
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
        /*
         * CLEAN 
         */
        clean: {
            cordova: {
                src: ['build/cordova/'],
                options: {
                    force: true
                }
            },
            'cordova-www-ja': {
                src: ['build/cordova/japanese/www/'],
                options: {
                    force: true
                }
            },
            'cordova-www-zh': {
                src: ['build/cordova/chinese/www/'],
                options: {
                    force: true
                }
            },
            web: {
                src: ['build/web/'],
                options: {
                    force: true
                }
            }
        },
        /*
         * COPY 
         */
        copy: {
            'android-unsigned-ja' : {
                files: [
                    {
                        expand: true,
                        cwd: 'build/cordova/japanese/platforms/android/ant-build/',
                        src: 'Skritter-release-unsigned.apk',
                        dest: 'cordova/android/keystore/unsigned/',
                        rename: function(dest, src) {
                            return dest + src.replace('release', 'japanese');
                        }
                    }
                ]
            },
            'android-unsigned-zh' : {
                files: [
                    {
                        expand: true,
                        cwd: 'build/cordova/chinese/platforms/android/ant-build/',
                        src: 'Skritter-release-unsigned.apk',
                        dest: 'cordova/android/keystore/unsigned/',
                        rename: function(dest, src) {
                            return dest + src.replace('release', 'chinese');
                        }
                    }
                ]
            },
            'cordova-install-ja': {
                files: [
                    {
                        expand: true,
                        cwd: 'cordova/japanese',
                        src: '**',
                        dest: 'build/cordova/japanese/'
                    }
                ]
            },
            'cordova-install-zh': {
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
            },
            web: {
                files: [
                    {
                        expand: true, 
                        cwd: 'public_html/', 
                        src: '**',
                        dest: 'build/web/'
                    }
                ]
            }
        },
        /*
         * JASMINE 
         */
        jasmine: {
            pivotal: {
                src: 'src/**/*.js',
                options: {
                    specs: 'public_html/tests/specs/*.js'
                }
            }
        },
        /*
         * JSHINT 
         */
        jshint: {
            root: {
                all: ['Gruntfile.js', 'public_html/js/app/**/*.js']
            }
        },
        /*
         * MANIFEST 
         */
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
            },
            'web-combined': {
                options: {
                    basePath: 'build/web/',
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
                dest: 'build/web/skritter.appcache'
            }
        },
        /*
         * REPLACE 
         */
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
                    {src: 'AndroidManifest.xml', dest: 'build/cordova/japanese/platforms/android', expand: true, cwd: 'build/cordova/japanese/platforms/android/'},
                    {src: 'Settings.js', dest: 'build/cordova/japanese/www/js/app/models/', expand: true, cwd: 'build/cordova/japanese/www/js/app/models/'}
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
                    {src: 'AndroidManifest.xml', dest: 'build/cordova/chinese/platforms/android', expand: true, cwd: 'build/cordova/chinese/platforms/android/'},
                    {src: 'Settings.js', dest: 'build/cordova/chinese/www/js/app/models/', expand: true, cwd: 'build/cordova/chinese/www/js/app/models/'}
                ]
            },
            'web-combined': {
                options: {
                    variables: {
                        'date': new Date().toUTCString().substr(0, 25),
                        'version': '<%= pkg.version %>'
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/web/js/app/', expand: true, cwd: 'build/web/js/app/'},
                    {src: 'version.json', dest: 'build/web/', expand: true, cwd: 'build/web/'}
                ]
            },
            'web-copied': {
                options: {
                    variables: {
                        'date': new Date().toUTCString().substr(0, 25),
                        'version': '<%= pkg.version %>'
                    }
                },
                files: [
                    {src: 'Settings.js', dest: 'build/web/js/app/model/', expand: true, cwd: 'build/web/js/app/model/'},
                    {src: 'version.json', dest: 'build/web/', expand: true, cwd: 'build/web/'}
                ]
            }
        },
        /*
         * REQUIREJS 
         */
        requirejs: {
            'web-combined': {
                options: {
                    appDir: 'public_html/',
                    baseUrl: 'js/app/',
                    dir: 'build/web/',
                    fileExclusionRegExp: /\.mp3$/,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: [
                        {
                            name: 'Application'
                        },
                        {
                            name: 'Libraries'
                        }
                    ],
                    optimize: 'none',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: shim
                }
            },
            'web-optimized': {
                options: {
                    appDir: 'public_html/',
                    baseUrl: 'js/app/',
                    dir: 'build/web/',
                    fileExclusionRegExp: /\.mp3$/,
                    generateSourceMaps: false,
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
        /*
         * SHELL 
         */
        shell: {
            'android-build-ja': {
                command: [
                    'cd build/cordova/japanese/',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'android-sign-ja': {
                command: [
                    'cd cordova/android/keystore/',
                    'sign-skritter_japanese.bat'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'android-build-zh': {
                command: [
                    'cd build/cordova/chinese/',
                    'cordova build android --release'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'android-sign-zh': {
                command: [
                    'cd cordova/android/keystore/',
                    'sign-skritter_chinese.bat'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'android-build-run-ja': {
                command: [
                    'cd build/cordova/japanese/',
                    'cordova build android',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'android-build-run-zh': {
                command: [
                    'cd build/cordova/chinese/',
                    'cordova build android',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-install-ja': {
                command: [
                    'cd build/cordova/',
                    'cordova create japanese com.inkren.skritter.japanese Skritter',
                    'cd japanese/',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.device',
                    'cordova plugin add org.apache.cordova.media',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion-file.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-install-prepare': {
                command: [
                    'cd build/',
                    'mkdir cordova'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-install-zh': {
                command: [
                    'cd build/cordova/',
                    'cordova create chinese com.inkren.skritter.chinese Skritter',
                    'cd chinese/',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.device',
                    'cordova plugin add org.apache.cordova.media',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion-file.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'kill-adb': {
                command: 'Taskkill /F /IM adb.exe',
                options: {
                    stdout: true
                }
            }
        },
        /*
         * YUIDOC 
         */
        yuidoc: {
            compile: {
                name: '<%= pkg.appName %>: Documentation',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/docs',
                    themedir: 'yuidoc'
                }
            },
            web: {
                name: '<%= pkg.appName %>: Documentation',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/web/docs',
                    themedir: 'yuidoc'
                }
            }
        }
    });
    /*
     * PACKAGES
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');
    /*
     * COMMANDS: GENERAL
     */
    grunt.registerTask('appcache', ['manifest:root']);
    grunt.registerTask('docs', ['yuidoc:compile']);
    grunt.registerTask('hint', ['jshint:root']);
    /*
     * COMMANDS: BUILDING
     */
    grunt.registerTask('build-android-zh', [
        'jshint',
        'clean:cordova-www-zh',
        'copy:cordova-www-zh',
        'copy:cordova-install-zh',
        'replace:cordova-zh',
        'shell:android-build-run-zh'
    ]);
    grunt.registerTask('build-android-ja', [
        'jshint',
        'clean:cordova-www-ja',
        'copy:cordova-www-ja',
        'copy:cordova-install-ja',
        'replace:cordova-ja',
        'shell:android-build-run-ja'
    ]);
    grunt.registerTask('build-android-signed-zh', [
        'jshint',
        'clean:cordova-www-zh',
        'copy:cordova-www-zh',
        'copy:cordova-install-zh',
        'replace:cordova-zh',
        'shell:android-build-zh',
        'copy:android-unsigned-zh',
        'shell:android-sign-zh'
    ]);
    grunt.registerTask('build-android-unsigned-zh', [
        'jshint',
        'clean:cordova-www-zh',
        'copy:cordova-www-zh',
        'copy:cordova-install-zh',
        'replace:cordova-zh',
        'shell:android-build-zh',
        'copy:android-unsigned-zh'
    ]);
    grunt.registerTask('build-android-signed-ja', [
        'jshint',
        'clean:cordova-www-ja',
        'copy:cordova-www-ja',
        'copy:cordova-install-ja',
        'replace:cordova-ja',
        'shell:android-build-ja',
        'copy:android-unsigned-ja',
        'shell:android-sign-ja'
    ]);
    grunt.registerTask('build-android-unsigned-ja', [
        'jshint',
        'clean:cordova-www-ja',
        'copy:cordova-www-ja',
        'copy:cordova-install-ja',
        'replace:cordova-ja',
        'shell:android-build-ja',
        'copy:android-unsigned-ja'
    ]);
    grunt.registerTask('build-web-combined', [
        'jshint',
        'clean:web',
        'requirejs:web-combined',
        'replace:web-combined',
        'manifest:web-combined',
        'yuidoc:web'
    ]);
    grunt.registerTask('build-web-copied', [
        'jshint',
        'clean:web',
        'appcache',
        'copy:web',
        'replace:web-copied',
        'yuidoc:web'
    ]);
    grunt.registerTask('build-web-optimized', [
        'jshint',
        'clean:web',
        'requirejs:web-optimized',
        'replace:web-combined',
        'manifest:web-combined',
        'yuidoc:web'
    ]);
    /*
     * COMMANDS: INSTALLING
     */
    grunt.registerTask('install-cordova', [
        'shell:kill-adb',
        'clean:cordova',
        'shell:cordova-install-prepare',
        'shell:cordova-install-ja',
        'shell:cordova-install-zh',
        'copy:cordova-install-ja',
        'copy:cordova-install-zh'
    ]);
};