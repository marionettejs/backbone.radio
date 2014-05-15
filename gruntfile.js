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
      options: {
        jshintrc: '.jshintrc'
      },
      radio: [ 'src/*.js' ]
    },

    mocha: {
      options: {
        run: true
      },
      main: {
        src: [ 'test/index.html' ]
      }
    }
  });

  grunt.registerTask('test', 'Test the library', ['build', 'jshint', 'mocha']);

  grunt.registerTask('build', 'Build the library', ['preprocess', 'template', 'concat', 'uglify']);

  grunt.registerTask('default', 'An alias of test', ['test']);
};
