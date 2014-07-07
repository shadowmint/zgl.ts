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
                    basePath: '<%= path.src %>',
                    sourceMap: false,
                    declaration: true,
                    comments: true
                }
            }
        },
        nodeunit: {
            zgl: [ '<%= path.build %>/zgl/**/*_tests.js' ]
        },
        browserify: {
            zgl: {
                files: {
                    'dist/zgl.js': [ '<%= path.build %>/zgl/**/*.js' ]
                }
            }

        }
    });
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl']);
    ext.registerTask('zgl_build', ['zgl', 'browserify:zgl']);

    // z3d
    ext.configure({
        typescript: {
            z3d: {
                src: ['<%= path.src %>/z3d/**/*.ts'],
                dest: '<%= path.build %>/z3d',
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    basePath: '<%= path.src %>',
                    sourceMap: false,
                    declaration: true,
                    comments: true
                }
            }
        },
        nodeunit: {
            z3d: [ '<%= path.build %>/z3d/**/*_tests.js' ]
        },
        browserify: {
            z3d: {
                files: {
                    'dist/z3d.js': [ '<%= path.build %>/**/*.js' ]
                }
            }

        }
    });
    ext.registerTask('z3d', ['typescript:z3d', 'nodeunit:z3d']);
    ext.registerTask('z3d_build', ['z3d', 'browserify:z3d']);

    // Common build tasks
    ext.registerTask('build', ['zgl_build', 'z3d_build'])

    // External tasks
    ext.initConfig(grunt);
    grunt.registerTask('default', ['clean', 'build']);
}
