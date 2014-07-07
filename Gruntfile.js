var ext = require('./.gruntExt')
module.exports = function (grunt) {

    // Config
    ext.configure({
       path: {
           src: 'src',
           build: 'build'
       }
    });

    // Clean
    ext.configure({
        clean: {
            src: ['<%= path.build %>']
        }
    });

    // zgl
    ext.configure({
        typescript: {
            zgl: {
                src: ['<%= path.src %>/zgl/**/*.ts'],
                dest: '<%= path.build %>/zgl',
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    basePath: '<%= path.src %>/zgl',
                    sourceMap: true,
                    declaration: true,
                    comments: true
                }
            }
        },
        nodeunit: {
            zgl: [ '<%= path.build %>/zgl/**/*_tests.js' ]
        }
        // TODO: Browserify
    });
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl']);

    // z3d
    /*configure({
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
    });*/

    // Load combined config
    //grunt.registerTask('_z3d', ['ts:z3d']);

    // External tasks
    ext.initConfig(grunt);
    //grunt.registerTask('default', ['clean', '_zgl', '_z3d']);
}
