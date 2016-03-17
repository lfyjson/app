module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: 35729
            },
            html: {
                files: ['**.html'],
            },
            css: {
                files: ['css/**.css'],
            },
            js: {
                files: ['js/**.js'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);

}
