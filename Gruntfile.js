module.exports = function (grunt) {

    // Extension glue
    var config = {};
    var extend = function(destination, source) { for (var property in source) { if (destination.hasOwnProperty(property)) { extend(destination[property], source[property]); } else { destination[property] = source[property]; } } return destination; };
    var configure = function(source) { extend(config, source); };

    // Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');

    // Common
    configure({
        clean: {
            src: ['dist/**/*.js.map', 'dist/**/*.js', 'dist/**/*.d.ts']
        }
    });

    // zgl
    configure({
        ts: {
            zgl: {
                src: ['src/zgl/__init__.ts'],
                out: 'dist/zgl.js',
                options: {
                    module: 'amd',
                    target: 'es3',
                    sourceMaps: true,
                    declaration: true,
                    removeComments: false
                }
            }
        }
    });

    // z3d
    configure({
        ts: {
            z3d: {
                src: ['src/z3d/__init__.ts'],
                out: 'dist/z3d.js',
                options: {
                    module: 'amd',
                    target: 'es3',
                    sourceMaps: true,
                    declaration: true,
                    removeComments: false
                }
            }
        }
    });

    // Load combined config
    console.log(config);
    grunt.initConfig(config);

    // Builder tasks
    grunt.registerTask('_zgl', ['ts:zgl']);
    grunt.registerTask('_z3d', ['ts:z3d']);

    // External tasks
    grunt.registerTask('default', ['clean', '_zgl', '_z3d']);
}
