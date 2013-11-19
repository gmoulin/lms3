'use strict';

var LIVERELOAD_PORT = 35729;

module.exports = function( grunt ){
	// load all grunt tasks using the package.json dependencies list
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		/**
		 * We read in our `package.json` file so we can access the package name and
		 * version. It's already there, so we don't repeat ourselves here.
		 */
		pkg: grunt.file.readJSON("package.json"),

		/**
		 * The banner is the comment that is placed at the top of our compiled
		 * source files. It is first processed as a Grunt template, where the `<%=`
		 * pairs are evaluated based on this very configuration object.
		 */
		meta: {
			banner:
				'/**\n' +
				' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				' */\n'
		},

		clean: {
			server: ['.tmp']
		},

		concurrent: {
			server: {
				tasks: ['nodemon', 'node-inspector', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		/**
		 * node monitor, restart node server automaticaly
		 */
		nodemon: {
			server: {
				options: {
					file: 'server.js',
					args: ['development'],
					nodeArgs: ['--debug'],
					ignoredFiles: ['./.git/*', './node_modules/*', './bower_components/*', './*.json', './client/*', './public/*'],
					watchedExtensions: ['js'],
					delayTime: 1,
					env: {
						PORT: 3001
					}
				}
			}
		},

		/**
		 * node inspector
		 */
		'node-inspector': {
			custom: {
				options: {
					'web-host': 'localhost',
					'save-live-edit': true
				}
			}
		},


		/**
		 * html templates compilation
		 */
		html2js: {
			options: {
				indentString: '	'
			},
			main: {
				src: ['client/partials/**/*.tpl.html'],
				dest: 'public/scripts/templates.js'
			}
		},


		/**
		 * css compilation
		 */
		sass: {
			build: {
				//compile file, no concat
				files: [{
					expand: true,
					cwd: 'client/sass',
					src: ['**/*.sass'],
					dest: 'public/styles',
					ext: '.css'
				}]
			}
		},

		/**
		 * compile index.tpl.html
		 * with all stylesheets and scripts
		 */
		includeSource: {
			options: {
				basePath: 'client',
				includePath: 'public/'
			},
			myTarget: {
				files: {
					'public/index.html': 'client/index.tpl.html'
				}
			}
		},

		/**
		 * modifications watch, using livereload
		 */
		watch: {
			index: {
				files: 'client/index.tpl.html',
				tasks: ['includeSource']
			},
			ngtemplates: {
				files: 'client/partials/**/*.tpl.html',
				tasks: ['ngtemplates']
			},
			sass: {
				files: 'client/sass/**/*.sass',
				tasks: ['sass']
			},
			// any file modified in public folder invoke a livereload
			livereload: {
				options: { livereload: LIVERELOAD_PORT },
				files: ['public/**/*']
			}
		}
	});

	grunt.registerTask('server', [
		'clean:server',
		'sass',
		'html2js',
		'includeSource',
		'concurrent:server'
	]);
};
