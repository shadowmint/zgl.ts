module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-ts');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            lib: {
                src: ['bin/*.js.map', 'bin/*.js']
            }
        },
        ts: {
            xz: {
                src: ['src/zgl/**/*.ts'],
                out: 'bin/zgl.js',
                options: {
                    target: 'es3',
                    sourceMaps: false,
                    declaration: true,
                    removeComments: false
                }
            }
        }
    });

    // Main build
    grunt.registerTask('default', ['clean', 'ts:zgl']);
}
