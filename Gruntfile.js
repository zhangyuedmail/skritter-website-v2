module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.initConfig({
        /**
         * APPLICATION
         */
        application: grunt.file.readJSON('package.json'),
        /**
         * CLEAN
         */
        clean: {
            'build-docs': {
                src: ['build/docs'],
                options: {force: true}
            },
            'nodemodules': {
                src: ['node_modules'],
                options: {force: true}
            }
        },
        /**
         * CSSLINT
         */
        csslint: {
            'all': {
                options: {
                    csslintrc: '.csslintrc',
                    import: 2
                },
                src: ['www/styles/style.css']
            }
        },
        /**
         * JSHINT
         */
        jshint: {
            'all': {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js', 'www/application/**/*.js', 'www/framework/**/*.js']
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
                    paths: ['www/application', 'www/framework'],
                    themedir: 'yuidoc',
                    outdir: 'build/docs'
                }
            }
        }
    });

    grunt.registerTask('clean-all', [
        'clean-build',
        'clean-dev'
    ]);

    grunt.registerTask('clean-build', [
        'clean:build-docs'
    ]);

    grunt.registerTask('clean-dev', [
        'clean:nodemodules'
    ]);

    grunt.registerTask('build-docs', [
        'clean:build-docs',
        'yuidoc:default'
    ]);

    grunt.registerTask('validate', [
        'csslint:all',
        'jshint:all'
    ]);

};
