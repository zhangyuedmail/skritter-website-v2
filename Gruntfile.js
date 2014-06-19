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
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../lib/createjs.easel-NEXT.min',
        'createjs.tween': '../lib/createjs.tween-NEXT.min',
        moment: '../lib/moment-2.6.0.min',
        'moment.timezone': '../lib/moment.timezone-0.0.6.min',
        'moment.timezone.data': '../lib/moment.timezone.data',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        jquery: '../lib/jquery-1.11.1.min',
        'jquery.mobile': '../lib/jquery.mobile.custom.min',
        'jquery.ui': '../lib/jquery.ui.custom-1.10.4.min',
        raygun: '../lib/raygun-1.8.4.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.10',
        underscore: '../lib/lodash.compat-2.4.1.min'
    };
    
    var shim = {
        bootstrap: ['jquery'],
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
        'jquery.ui': ['jquery']
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        /*** CLEAN ***/
        clean: {
            'cordova-chinese': {
                src: ['build/cordova/chinese/www/**/*'],
                options: {
                    force: true
                }
            },
            'cordova-japanese': {
                src: ['build/cordova/japanese/www/**/*'],
                options: {
                    force: true
                }
            },
            'build': {
               src: ['build'],
                options: {
                    force: true
                } 
            },
            'utils-chinese': {
                src: [
                    'utils/apksigner/unsigned/SkritterChinese-release-unsigned.apk',
                    'utils/apksigner/signed/Skritter-chinese.apk',
                    'utils/apktool/SkritterChinese-release-unsigned/assets/www/**/*'
                ],
                options: {
                    force: true
                }
            },
            'utils-japanese': {
                src: [
                    'utils/apksigner/unsigned/SkritterJapanese-release-unsigned.apk',
                    'utils/apksigner/signed/Skritter-japanese.apk',
                    'utils/apktool/SkritterJapanese-release-unsigned/assets/www/**/*'
                ],
                options: {
                    force: true
                }
            },
            'web': {
                src: ['build/web'],
                options: {
                    force: true
                }
            }
        },
        
        /*** COPY ***/
        copy: {
            'apktool-apksigner-chinese': {
                files: [
                    {
                        expand: true,
                        cwd: 'utils/apktool/SkritterChinese-release-unsigned/dist',
                        src: '**/*',
                        dest: 'utils/apksigner/unsigned'
                    }
                ]
            },
            'apktool-apksigner-japanese': {
                files: [
                    {
                        expand: true,
                        cwd: 'utils/apktool/SkritterJapanese-release-unsigned/dist',
                        src: '**/*',
                        dest: 'utils/apksigner/unsigned'
                    }
                ]
            },
            'cordova-chinese': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html',
                        src: [
                            '**',
                            '!font/japanese/**'
                        ],
                        dest: 'build/cordova/chinese/www'
                    }
                ]
            },
            'cordova-japanese': {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html',
                        src: [
                            '**/*',
                            '!font/chinese/**'
                        ],
                        dest: 'build/cordova/japanese/www'
                    }
                ]
            },
            'cordova-config-chinese': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/chinese',
                        src: '**/*',
                        dest: 'build/cordova/chinese'
                    }
                ]
            },
            'cordova-config-japanese': {
                files: [
                    {
                        expand: true,
                        cwd: 'config/japanese',
                        src: '**/*',
                        dest: 'build/cordova/japanese'
                    }
                ]
            },
            'cordova-apktool-chinese': {
                files: [
                    {
                        expand: true,
                        cwd: 'build/cordova/chinese/platforms/android/assets/www',
                        src: '**/*',
                        dest: 'utils/apktool/SkritterChinese-release-unsigned/assets/www'
                    }
                ]
            },
            'cordova-apktool-japanese': {
                files: [
                    {
                        expand: true,
                        cwd: 'build/cordova/japanese/platforms/android/assets/www',
                        src: '**/*',
                        dest: 'utils/apktool/SkritterJapanese-release-unsigned/assets/www'
                    }
                ]
            }
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
            'cordova-chinese': {
                options: {
                    variables: {
                        'androidPublicKey': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwfbJgVyApOKSfeNtWqQPdikWCWYzNfh4ujKVxv5QZRTFxAKlfZnhT563Ttv1tUSS5OOBHiC+FJfTWKowcWTwRpT0+3WAD+5GiFpCE2khivssSrKxvL3A3dU+MhNp+CndVzMX/jIYTq5WPakV74oEATJT1MUCrWNklQTirt8H2cwtMZ7A7Nlhw8dn3gLyThEMyFSQN/J8au9H9NvPyQA8g9HjVJbC6EBQxotfnwWxTkmcD4nFStS5oelKCWrvmyzceYrsDTYGAL8wXNd+5RZ62B7w1jVnUS6JMBVCnpfTN/BeH80KcLmr3gBVDEbyjKoH6Ov47FgwLJWQc/+fKjNJvwIDAQAB',
                        'date': new Date().toUTCString().substr(0, 25),
                        'languageCode': 'zh',
                        'version': '<%= pkg.version %>',
                        'versionCode': '<%= pkg.versionCode %>'
                    }
                },
                files: [
                    {src: 'config.xml', dest: 'build/cordova/chinese/www', expand: true, cwd: 'build/cordova/chinese/www'},
                    {src: 'InAppBillingPlugin.java', dest: 'build/cordova/chinese/plugins/com.jernung.cordova.inappbilling/inappbilling', expand: true, cwd: 'build/cordova/chinese/plugins/com.jernung.cordova.inappbilling/inappbilling'},
                    {src: 'Application.js', dest: 'build/cordova/chinese/www/js/app', expand: true, cwd: 'build/cordova/chinese/www/js/app'},
                    {src: 'Settings.js', dest: 'build/cordova/chinese/www/js/app/model', expand: true, cwd: 'build/cordova/chinese/www/js/app/model'}
                ]
            },
            'cordova-japanese': {
                options: {
                    variables: {
                        'androidPublicKey': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqO6YEuVqO+E7OmrSU7HEp1mi4hAoIKcMB/WyS7XGbPEZ9t/E+XjIv7MqlhVe9ROsoT7YS3kSlp19XX6uaiibgwbi6TDifyFMVjtOLqSEVcd9XrL6kk22JB8Z/6g8L/lEsLGWdBWyeEpWLpJ+pgewDnA3JsulmGvzo6qoAF5nRUitlYBcFDpFs1asfYh0cLiLO77D+TtIrz3T9bgdO/Hcz7pykiPYW5yuoe6RGKpoI3RNvbfO5aItAcXa3dKeReHx9YgfyASSYZvcmKLXyNAlHgadU0jQ1KoA/fJV429Qx8ACBmecJolT/ydMXbu1X9PWlh02bdvYiMfVPK2GZ/1xawIDAQAB',
                        'date': new Date().toUTCString().substr(0, 25),
                        'languageCode': 'ja',
                        'version': '<%= pkg.version %>',
                        'versionCode': '<%= pkg.versionCode %>'
                    }
                },
                files: [
                    {src: 'config.xml', dest: 'build/cordova/japanese/www', expand: true, cwd: 'build/cordova/japanese/www'},
                    {src: 'InAppBillingPlugin.java', dest: 'build/cordova/japanese/plugins/com.jernung.cordova.inappbilling/inappbilling', expand: true, cwd: 'build/cordova/japanese/plugins/com.jernung.cordova.inappbilling/inappbilling'},
                    {src: 'Application.js', dest: 'build/cordova/japanese/www/js/app', expand: true, cwd: 'build/cordova/japanese/www/js/app'},
                    {src: 'Settings.js', dest: 'build/cordova/japanese/www/js/app/model', expand: true, cwd: 'build/cordova/japanese/www/js/app/model'}
                ]
            },
            'web': {
                options: {
                    variables: {
                        'date': new Date().toUTCString().substr(0, 25),
                        'version': '<%= pkg.version %>',
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/web/js/app', expand: true, cwd: 'build/web/js/app'}
                ]
            }
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
            'apktool-compile-chinese': {
                command: [
                    'cd utils/apktool',
                    'apktool b SkritterChinese-release-unsigned',
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'apktool-compile-japanese': {
                command: [
                    'cd utils/apktool',
                    'apktool b SkritterJapanese-release-unsigned',
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'apksigner-build-chinese': {
                command: [
                    'cd utils/apksigner',
                    'sign-skritter_chinese'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'apksigner-build-japanese': {
                command: [
                    'cd utils/apksigner',
                    'sign-skritter_japanese',
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-build-android-chinese': {
                command: [
                    'cd build/cordova/chinese',
                    'cordova build android',
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-build-android-japanese': {
                command: [
                    'cd build/cordova/japanese',
                    'cordova build android',
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-install-japanese': {
                command: [
                    'cd build/cordova',
                    'cordova create japanese com.inkren.skritter.japanese Skritter',
                    'cd japanese',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-inappbilling.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-install-chinese': {
                command: [
                    'cd build/cordova',
                    'cordova create chinese com.inkren.skritter.chinese Skritter',
                    'cd chinese',
                    'cordova platforms add android',
                    'cordova plugin add org.apache.cordova.splashscreen',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-inappbilling.git',
                    'cordova plugin add https://github.com/mcfarljw/cordova-plugin-expansion.git'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-prepare': {
                command: [
                    'mkdir build',
                    'cd build',
                    'mkdir cordova'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-run-android-chinese': {
                command: [
                    'cd build/cordova/chinese',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'cordova-run-android-japanese': {
                command: [
                    'cd build/cordova/japanese',
                    'cordova run android'
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
    grunt.registerTask('build-android', [
        'build-android-chinese',
        'build-android-japanese'
    ]);
    
    grunt.registerTask('build-android-chinese', [
        'validate',
        'clean:cordova-chinese',
        'copy:cordova-chinese',
        'copy:cordova-config-chinese',
        'replace:cordova-chinese',
        'shell:cordova-build-android-chinese'
    ]);
    
    grunt.registerTask('build-android-japanese', [
        'validate',
        'clean:cordova-japanese',
        'copy:cordova-japanese',
        'copy:cordova-config-japanese',
        'replace:cordova-japanese',
        'shell:cordova-build-android-japanese'
    ]);
    
    grunt.registerTask('build-run-android', [
        'build-run-android-chinese',
        'build-run-android-japanese'
    ]);
    
    grunt.registerTask('build-run-android-chinese', [
        'build-android-chinese',
        'run-android-chinese'
    ]);
    
    grunt.registerTask('build-run-android-japanese', [
        'build-android-japanese',
        'run-android-japanese'
    ]);
    
    grunt.registerTask('build-web', [
        'validate',
        'clean:web',
        'requirejs:web',
        'replace:web'
    ]);
    
    grunt.registerTask('install', [
        'clean:build',
        'shell:kill-adb',
        'shell:cordova-prepare',
        'shell:cordova-install-chinese',
        'shell:cordova-install-japanese'
    ]);
    
    grunt.registerTask('install-build', [
        'install',
        'build-android'
    ]);
    
    grunt.registerTask('package-android', [
        'package-android-chinese',
        'package-android-japanese'
    ]);
    
    grunt.registerTask('package-android-chinese', [
        'build-android-chinese',
        'clean:utils-chinese',
        'copy:cordova-apktool-chinese',
        'shell:apktool-compile-chinese',
        'copy:apktool-apksigner-chinese',
        'shell:apksigner-build-chinese'
    ]);
    
    grunt.registerTask('package-android-japanese', [
        'build-android-japanese',
        'clean:utils-japanese',
        'copy:cordova-apktool-japanese',
        'shell:apktool-compile-japanese',
        'copy:apktool-apksigner-japanese',
        'shell:apksigner-build-japanese'
    ]);
    
    grunt.registerTask('run-android-chinese', [
        'shell:cordova-run-android-chinese'
    ]);
    
    grunt.registerTask('run-android-japanese', [
        'shell:cordova-run-android-japanese'
    ]);
    
    grunt.registerTask('validate', [
        'csslint:root',
        'jshint:root'
    ]);
};