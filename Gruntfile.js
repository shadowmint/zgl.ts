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
            },
            zgl_amd: {
                src: ['<%= path.src %>/zgl/**/*.ts'],
                dest: '<%= path.build %>/zgl',
                options: {
                    module: 'amd',
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
        }
    });
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl', 'typescript:zgl_amd']);

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
            },
            z3d_amd: {
                src: ['<%= path.src %>/z3d/**/*.ts'],
                dest: '<%= path.build %>/z3d',
                options: {
                    module: 'amd',
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
        }
    });
    ext.registerTask('z3d', ['typescript:z3d', 'nodeunit:z3d', 'typescript:z3d_amd']);

    // Common build tasks
    ext.registerTask('build', ['zgl', 'z3d'])

    // External tasks
    ext.initConfig(grunt);
    grunt.registerTask('default', ['clean', 'build']);
}
