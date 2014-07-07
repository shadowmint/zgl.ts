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
        },
        bowserify: {
            zgl: {
                files: {
                    'dist/zgl.js': [ '<%= path.build %>/zgl/__init__.ts' ]
                }
            }

        }
    });
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl']);
    ext.registerTask('zgl_build', ['zgl', 'bowserify:zgl']);

    // External tasks
    ext.initConfig(grunt);
    //grunt.registerTask('default', ['clean', '_zgl', '_z3d']);
}
