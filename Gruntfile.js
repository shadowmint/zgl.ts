var ext = require('./.gruntExt')
module.exports = function (grunt) {

    // Config
    ext.configure({
       path: {
           src: 'src',
           build: 'demo/build'
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
                src: ['<%= path.src %>/**/*.ts'],
                dest: '<%= path.build %>',
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    basePath: '<%= path.src %>',
                    sourceMap: false,
                    declaration: false,
                    comments: false
                }
            },
            zgl_amd: {
                src: ['<%= path.src %>/**/*.ts'],
                dest: '<%= path.build %>',
                options: {
                    module: 'amd',
                    target: 'es3',
                    basePath: '<%= path.src %>',
                    sourceMap: true,
                    declaration: true,
                    comments: true
                }
            }
        },
        nodeunit: {
            zgl: [ '<%= path.build %>/**/*_tests.js' ]
        },
        watch: {
            zgl: {
                files: ['<%= path.src %>/**/*'],
                tasks: ['zgl'],
                options: {
                    spawn: true
                }
            }
        }
    });
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl', 'typescript:zgl_amd']);

    // Server
    ext.configure({
        connect: {
            lib: {
                options: {
                    port: 3009,
                    base: 'demo'
                }
            }
        }
    });

    // External tasks
    ext.initConfig(grunt);
    grunt.registerTask('default', ['clean', 'zgl']);
    grunt.registerTask('dev', ['default', 'connect', 'watch']);
}
