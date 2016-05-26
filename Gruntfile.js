module.exports = function(grunt) {
  var sourceFiles = [
       "www/js/libs/jquery-1.11.0.min.js",
       "www/js/libs/jquery.mobile-1.4.2.js",
       "www/js/libs/i18next.js"
  ]

  var templateFiles = [
      "www/js/app/template/collection_list.handlebars",
      "www/js/app/template/collection_name.handlebars",

      "www/js/app/template/field_add.handlebars",
      "www/js/app/template/field_location.handlebars",
      "www/js/app/template/field_no_field_pop_up.handlebars",
      "www/js/app/template/field_update_offline.handlebars",
      "www/js/app/template/field_update_online.handlebars",

      "www/js/app/template/language_menu.handlebars",

      "www/js/app/template/layer_menu.handlebars",

      "www/js/app/template/site_error_upload.handlebars",
      "www/js/app/template/site_list.handlebars",
      "www/js/app/template/site_update_offline.handlebars",
      "www/js/app/template/site_update_online.handlebars"
  ]

  function outputPrecompiles(sources) {
    var outputFiles = []
    for(var i=0; i<sources.length; i++) {
      var outputFile = sources[i].replace('template', 'template_precompile') + ".js"
      outputFiles.push(outputFile)
    }
    return outputFiles
  }

  grunt.initConfig({

    uglify: {
      app: {
        options: {
          sourceMap: true,
          sourceMapName: 'www/js/dist/app.map'
        },
        files: {
          'www/js/dist/app.min.js': sourceFiles
        }
      },
      template: {
        options: {
          sourceMap: true,
          sourceMapName: 'www/js/dist/template.map'
        },
        files: {
          'www/js/dist/template.min.js': outputPrecompiles(templateFiles)
        }
      }
    },

    exec: {
      precompile: {
        cmd: function() {
          var commands = []
          var outputFiles =  outputPrecompiles(templateFiles)
          for(var i=0; i<templateFiles.length; i++) {
            var inputFile = templateFiles[i]
            var outputFile = outputFiles[i]
            var command = "handlebars " +  inputFile + " -f " + outputFile + " -k each -k if -k unless"
            command += "\n echo '" + command + "'"
            commands.push(command)
          }
          return commands.join("\n")
        }
      }

    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');


  grunt.registerTask('default', ['uglify']);

};
