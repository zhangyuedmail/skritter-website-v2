module.exports = function(grunt) {

    grunt.initConfig({
        application: function() {
            if (grunt.file.isFile('../package.json')) {
                return grunt.file.readJSON('../package.json');
            }
            return grunt.file.readJSON('package.json');
        }(),
        framework: grunt.file.readJSON('package.json'),
        clean: {
            'docs': {
                src: ['../docs'],
                options: {force: true}
            }
        },
        csslint: {
            'all': {
                options: {
                    csslintrc: 'csslintrc.json',
                    import: 2
                },
                src: ['css/gelato.css', '../www/css/main.css']
            }
        },
        jshint: {
            'all': ['Gruntfile.js', 'js/core/**/*.js', '../www/js/app/**/*.js']
        },
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('docs', [
        'clean:docs',
        'yuidoc:default'
    ]);

    grunt.registerTask('validate', [
        'csslint:all',
        'jshint:all'
    ]);

};