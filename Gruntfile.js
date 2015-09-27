module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		  
		jshint: {
      all: ['js/account.js', 'js/view.js', 'js/targets.js', 'js/global.js'],
        
 		},

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {'../IDLEPROD/js/app.min.js': ['js/jQuery.js', 'js/bootstrap.modal.js', 'js/account.js', 'js/view.js','js/targets.js', 'js/general.js']}
      }
    },

    cssmin: {
        combine: {
          files: {'../IDLEPROD/css/app.min.css': ['css/general.css', 'css/bootstrap.modal.css', 'css/inscription.css', 'css/connexion.css', 'css/addtarget.css', 'css/dashboard.css', 'css/messages.css']}
        }
    },

    replace: {
      prodcss: {
        src: ['index.html'],
        dest: '../IDLEPROD/index.html', 
        replacements: [{
          from: '<link href="css/general.css" rel="stylesheet">',
          to: '<link href="css/app.min.css" rel="stylesheet">'
        }, {
          from: '<link href="css/bootstrap.modal.css" rel="stylesheet">',
          to: ''
        }, {
          from: '<link href="css/inscription.css" rel="stylesheet">',
          to: ''
        }, {
          from: '<link href="css/connexion.css" rel="stylesheet">',
          to: ''
        }, {
          from: '<link href="css/dashboard.css" rel="stylesheet">',
          to: ''
        }, {
          from: '<link href="css/messages.css" rel="stylesheet">',
          to: ''
        }, {
          from: '<link href="css/addtarget.css" rel="stylesheet">>',
          to: ''
        }, {
          from: '<script src="js/jQuery.js"></script>',
          to: ''
        }, {
          from: '<script src="js/bootstrap.modal.js"></script>',
          to: ''
        }, {
          from: '<script src="js/account.js"></script>',
          to: ''
        }, {
          from: '<script src="js/view.js"></script>',
          to: ''
        }, {
          from: '<script src="js/targets.js"></script>',
          to: ''
        }, {
          from: '<script src="js/general.js"></script>',
          to: '<script src="js/app.min.js"></script>'
        }]
      }
    },

    copy: {
      main: {
        files: [
          /* 404 */
          {expand: true, src: ['404.html'], dest: '../IDLEPROD/'},
          /* Pages */
          {expand: true, src: ['pages/*'], dest: '../IDLEPROD/'},
          /* Js */
          {expand: true, src: ['fonts/**'], dest: '../IDLEPROD/'},
          /* Css */
          {expand: true, src: ['img/**'], dest: '../IDLEPROD/'},
        ],
      }
    },

  
  });
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'replace', 'copy']);

	grunt.registerTask('git', ['jshint', 'uglify', 'cssmin', 'replace', 'copy']);
}