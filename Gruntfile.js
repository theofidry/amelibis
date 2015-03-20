module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-loopback-sdk-angular');

  grunt.initConfig({

    loopback_sdk_angular: {
      options: {
        input: '../server/server.js',
        output: 'js/lb-services.js'
      }
    }
  });

  grunt.registerTask('default', ['loopback_sdk_angular']);
};
