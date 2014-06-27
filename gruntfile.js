module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Backbone.Radio v<%= meta.version %>\n'
    },

    preprocess: {
      radio: {
        src: 'src/wrapper.js',
        dest: 'build/backbone.radio.js'
      },
      test: {
        src: 'src/wrapper.js',
        dest: '.tmp/backbone.radio.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= meta.version %>'
        }
      },
      radio: {
        src: '<%= preprocess.radio.dest %>',
        dest: '<%= preprocess.radio.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      radio: {
        src: '<%= preprocess.radio.dest %>',
        dest: '<%= preprocess.radio.dest %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      radio: {
        src: '<%= preprocess.radio.dest %>',
        dest: 'build/backbone.radio.min.js',
        options: {
          sourceMap: true
        }
      }
    },

    jshint: {
      radio: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/*.js', '!src/wrapper.js']
      },
      tests: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/*.js']
      }
    },

    mochaTest: {
      spec: {
        options: {
          require: 'test/setup/node.js',
          reporter: 'dot',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'test/setup/helpers.js',
          'test/spec/*.js'
        ]
      }
    }
  });

  grunt.registerTask('test', 'Test the library', ['preprocess:test', 'jshint', 'mochaTest']);

  grunt.registerTask('build', 'Build the library', ['test', 'preprocess:radio', 'template', 'concat', 'uglify']);

  grunt.registerTask('default', 'An alias of test', ['test']);
};
