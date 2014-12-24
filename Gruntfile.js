var ext = require('./.gruntExt')
module.exports = function (grunt) {

    // Config
    ext.configure({
       path: {
           src: 'src',
           tmp: 'dist/zgl',
           dist: 'dist/zgl.js',
           dist_min: 'dist/zgl.min.js',
       }
    });

    // Clean
    ext.configure({
        clean: {
          src: ['dist/*']
        }
    });

    // zgl
    ext.configure({
        typescript: {
            zgl: {
                src: ['<%= path.src %>/**/*.ts'],
                dest: '<%= path.tmp %>',
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    basePath: '<%= path.src %>',
                    sourceMap: false,
                    declaration: false,
                    comments: false
                }
            }
        },
        nodeunit: {
            zgl: [ '<%= path.tmp %>/**/*_tests.js' ]
        },
        browserify: {
          zgl: {
            files: {
              '<%= path.dist %>': ['<%= path.tmp %>/**/*.js', '!**/*_tests.js']
            }
          }
        },
        uglify: {
          zgl: {
            files: {
              '<%= path.dist_min %>': '<%= path.dist %>'
            }
          }
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
    ext.registerTask('zgl', ['typescript:zgl', 'nodeunit:zgl', 'browserify:zgl', 'uglify:zgl']);

    // Server
    ext.configure({
        connect: {
            lib: {
                options: {
                    port: 3009,
                    base: '.'
                }
            }
        }
    });

    // External tasks
    ext.initConfig(grunt);
    grunt.registerTask('default', ['clean', 'zgl']);
    grunt.registerTask('dev', ['default', 'connect', 'watch']);
}
