'use strict';

var LIVERELOAD_PORT = 35729;

module.exports = function( grunt ){
	// load all grunt tasks using the package.json dependencies list
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	require('time-grunt')(grunt);

	grunt.initConfig({
		concurrent: {
			dev: {
				tasks: ['nodemon', 'node-inspector', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		/**
		 * node monitor, restart node server automaticaly
		 * called by concurrent task
		 */
		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					nodeArgs: ['--debug'],
					ignoredFiles: ['./.git/*', './node_modules/**', './*.json', 'Gruntfile.js', './client/**', './public/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['server'],
					delayTime: 1,
					env: {
						ENV: 'development',
						PORT: 3001
					}
				}
			},
			quality: {
				options: {
					file: 'server.js',
					ignoredFiles: ['./build/quality/public/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['./build/quality/server'],
					delayTime: 1,
					env: {
						ENV: 'quality',
						PORT: 3002
					},
					cwd: './build/quality/server'
				}
			},
			production: {
				options: {
					file: 'server.js',
					ignoredFiles: ['./build/production/public/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['./build/production/server'],
					delayTime: 1,
					env: {
						ENV: 'production',
						PORT: 3003
					},
					cwd: './build/production/server'
				}
			}
		},

		/**
		 * node inspector
		 * called by concurrent task
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
		 * modifications watch, using livereload
		 * called by concurrent task
		 */
		watch: {
			index: {
				files: ['client/views/index.tpl.html', 'client/scripts/**/*.js', 'client/styles/**/*.css'],
				tasks: ['includeSource']
			},
			templates: {
				files: 'client/partials/**/*.tpl.html',
				tasks: ['html2js']
			},
			sass: {
				files: 'client/sass/**/*.sass',
				tasks: ['sass']
			},
			jslinting: {
				files: ['client/scripts/**/*.js', 'server.js', 'server/**/*.js'],
				tasks: ['jshint']
			},
			csslinting: {
				files: ['client/styles/**/*.css'],
				tasks: ['csslint']
			},
			// any file modified in public folder invoke a livereload
			livereload: {
				options: { livereload: LIVERELOAD_PORT },
				files: ['public/**/*']
			},
			tests: {
				frontend:{
					files: ['client/scripts/**/*.js', 'client/tests/**/*.js'],
					tasks: ['blanket_mocha_server:frontend', 'blanket_mocha:frontend', 'karma:dev:frontend:run']
				},
				backend: {
					files: ['server.js', 'server/**/*.js'],
					tasks: ['mochaTest']
				}
			}
		},

		/**
		 * angular html templates compilation
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
		 * sass compilation
		 */
		sass: {
			options: {
				sourcemap: true,
				unixNewlines: true,
				style: 'compact'
			},
			files: {
				'public/styles/styles.css': 'client/sass/main.sass'
			}
		},

		clean: {
			dev: ['.tmp', 'public/scripts', 'public/styles'],
			quality: ['.tmp', 'public/scripts', 'public/styles', 'build/quality'],
			production: ['.tmp', 'public/scripts', 'public/styles', 'build/prod']
		},

		jshint: {
			/* see http://www.jshint.com/docs/options/ */
			options: {
				'bitwise': true,
				'camelcase': true,
				'curly': true,
				'eqeqeq': true,
				'es3': false,
				'forin': true,
				'freeze': true,
				'immed': true,
				'indent': 4,
				'latedef': true,
				'newcap': false,
				'noarg': true,
				'noempty': true,
				'nonew': false,
				'plusplus': false,
				'quotmark': true,
				'undef': true,
				'unused': true,
				'strict': true,
				'trailing': true,
				'maxparams': 3,
				'maxdepth': 3,
				'maxstatements': 4,
				'maxcomplexity': 10,
				'maxlen': 120,
				'asi': false,
				'boss': false,
				'debug': false,
				'eqnull': false,
				'esnext': false,
				'evil': false,
				'expr': false,
				'funscope': false,
				'globalstrict': false,
				'iterator': false,
				'lastsemic': false,
				'laxbreak': false,
				'laxcomma': true,
				'loopfunc': false,
				'moz': false,
				'multistr': false,
				'notypeof': false,
				'proto': false,
				'scripturl': false,
				'smarttabs': true,
				'shadow': false,
				'sub': false,
				'supernew': false,
				'validthis': false,
				'globals': {
					'browser': true,
					'devel': true,
					'jquery': true,
					'node': true,
					'phantom': true
				},
				'nomen': false,
				'onevar': true,
				'passfail': false,
				'white': false
			},
			all: ['client/scripts/**/*.js', 'server.js', 'Gruntfile.js', 'server/**/*.js']
		},

		csslint: {
			options: { /* false ignores the rule, 2 make it an error */
				'important': true,
				'adjoining-classes': true,
				'known-properties': true,
				'box-sizing': true,
				'box-model': true,
				'overqualified-elements': true,
				'display-property-grouping': true,
				'bulletproof-font-face': true,
				'compatible-vendor-prefixes': true,
				'regex-selectors': true,
				'errors': true,
				'duplicate-background-images': true,
				'duplicate-properties': true,
				'empty-rules': true,
				'selector-max-approaching': true,
				'gradients': true,
				'fallback-colors': true,
				'font-sizes': true,
				'font-faces': true,
				'floats': true,
				'star-property-hack': true,
				'outline-none': true,
				'import': true,
				'ids': true,
				'underscore-property-hack': true,
				'rules-count': true,
				'qualified-headings': true,
				'selector-max': true,
				'shorthand': true,
				'text-indent': true,
				'unique-headings': true,
				'universal-selector': true,
				'unqualified-attributes': true,
				'vendor-prefix': true,
				'zero-units': true
			},
			src: ['client/styles/**/*.css']
		},

		/**
		 * fill index.tpl.html
		 * with all stylesheets and scripts
		 */
		includeSource: {
			options: {
				basePath: 'client',
				includePath: 'public/'
			},
			index: {
				files: {
					'public/index.html': 'client/views/index.tpl.html'
				}
			}
		},

		useminPrepare: {
			html: 'public/index.html',
			options: {
				dest: 'public',
				flow: {
					steps: {
						js: [uglifyNew, 'concat'],
						css: ['concat', 'cssmin']
					},
					post: []
				}
			}
		},

		usemin: {
			html: 'public/index.html'
		},

		copy: {
			components: { /* only for js files */
				jquery: {
					dest: 'public/scripts',
					src: ['client/bower_components/jquery/*.min.js']
				},
				angular: {
					dest: 'public/scripts',
					src: ['client/bower_components/angular/*.min.js']
				},
				bootstrap: {
					dest: 'public/scripts',
					src: [
						'client/bower_components/bootstrap/js/collapse.js',
						'client/bower_components/bootstrap/js/dropdown.js'
					]
				}
			},
			fonts: {
				dest: 'public/fonts',
				src: ['client/bower_components/font-awesome/fonts/*']
			},
			quality: {
				expand: true,
				src: ['public/**', 'server/!(tests)', 'server.js'],
				dest: 'build/quality'
			},
			production: {
				expand: true,
				src: ['public/**', 'server/!(tests)', 'server.js'],
				dest: 'build/production'
			}
		},

		uncss: {
			all: {
				files: {
					'public/styles/styles.css': ['client/views/**/*.tpl.html']
				}
			}
		},

		//frontend tests in PhantomJS with coverage and threshold
		blanket_mocha_server: {
			frontend: {
				options: {
					port: 3001,
					htmlFile: 'test-runner.html',
					sutFiles: ['client/scripts/**/*.js'],
					testFiles: ['client/tests/**/*.spec.js'],
					blanketOptions: {
						'data-cover-only': '//client\/scripts\//'
					}
				}
			}
		},

		//frontend tests in PhantomJS with coverage and threshold
		blanket_mocha: {
			frontend: {
				options: {
					urls: ['http://localhost:3001/test-runner.html'],
					reporter: 'spec',
					threshold: 80,
					growl: true
				}
			}
		},

		//backend tests in PhantomJS with coverage
		mochaTest: {
			backend: {
				options: {
					reporter: 'spec',
					growl: true,
					require: 'coverage/blanket',
					clearRequireCache: true
				},
				src: ['server/tests/**/*.js']
			},
			'html-cov': {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage.html'
				},
				src: ['server/tests/**/*.js']
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: ['server/tests/**/*.js']
			}
		},

		//frontend tests in real browser
		karma: {
			options: {
				frameworks: ['mocha'],
				runnerPort: 9999,
				background: true,
				reporters: ['spec', 'growl']
			},
			dev: {
				files: ['client/test/**/*.js'],
				browsers: ['Chrome', 'Firefox']
			},
			continuous: {
				singleRun: true,
				files: ['client/test/**/*.js'],
				browsers: ['Chrome', 'Firefox']
			}
		}
	});

	grunt.registerTask('dev', [
		'clean:dev',
		'copy:components',
		'copy:fonts',
		'sass',
		'uncss',
		'csslint',
		'html2js',
		'jshint',
		'includeSource',
		'concurrent'
	]);

	grunt.registerTask('quality', [
		'clean:dev',
		'clean:quality',
		'copy:components',
		'copy:fonts',
		'sass',
		'uncss',
		'csslint',
		'html2js',
		'jshint',
		'includeSource',
		'useminPrepare',
		'usemin',
		'copy:quality'
	]);

	grunt.registerTask('production', [
		'clean:dev',
		'clean:production',
		'copy:components',
		'copy:fonts',
		'sass',
		'uncss',
		'csslint',
		'html2js',
		'jshint',
		'includeSource',
		'useminPrepare',
		'usemin',
		'copy:production'
	]);
};
