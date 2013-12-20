var LIVERELOAD_PORT = 5555;

module.exports = function( grunt ){
	'use strict';

	/* temporary until usemin plugin take into account already minified files */
	var uglifyNew = require('grunt-usemin-uglifynew');

	// load all grunt tasks using the package.json dependencies list
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	require('time-grunt')( grunt );

	grunt.initConfig({
		/**
		 * dev concurrent process
		 */
		concurrent: {
			dev: {
				tasks: ['nodemon:dev', 'node-inspector', 'watch'],
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
					nodeArgs: ['--debug'], //same debug port as node-inspector
					ignoredFiles: [
						'./.git/*',
						'./.tmp/*',
						'./.sass-cache/*',
						'./node_modules/**',
						'./*.json',
						'Gruntfile.js',
						'./client/**',
						'./public/**'
					],
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
					'web-port': 2999,
					'web-host': 'localhost',
					'save-live-edit': true,
					'debug-port': 3001
				}
			}
		},

		/**
		 * modifications watch, using livereload
		 * called by concurrent task
		 */
		watch: {
			options: {
				livereload: false
			},
			index: {
				files: [
					'client/views/index.tpl.html',
					'client/scripts/**/*.js',
					'client/styles/**/*.css'
				],
				tasks: ['includeSource', 'preprocess:dev']
			},
			templates: {
				files: ['client/partials/**/*.tpl.html'],
				tasks: ['html2js']
			},
			sass: {
				files: ['client/sass/**/*.sass'],
				tasks: ['sass']
			},
			jslinting: {
				files: [
					'client/scripts/**/*.js',
					'server.js',
					'server/**/*.js'
				],
				tasks: ['jshint']
			},
			copy_scripts: {
				files: ['client/scripts/**/*.js'],
				tasks: ['copy:scripts']
			},
			csslinting: {
				files: ['client/styles/**/*.css'],
				tasks: ['csslint']
			},
			// any file modified in public folder invoke a livereload
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: ['public/**/*']
			},
			frontendTests: {
				files: [
					'client/scripts/**/*.js',
					'tests/!(server)/*.js'
				],
				tasks: [
					'blanket_mocha_server:frontend',
					'blanket_mocha:frontend',
					'karma:unit:run',
					'karma:midway:run',
					'karma:end2end:run'
				]
			},
			backendTests: {
				files: [
					'server.js',
					'server/**/*.js',
					'tests/server/**/*.js'
				],
				tasks: ['mochaTest']
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
				src: ['client/views/partials/**/*.tpl.html'],
				dest: 'public/scripts/angular-templates.js'
			}
		},

		/**
		 * sass compilation
		 */
		sass: {
			all: {
				options: {
					sourcemap: true,
					style: 'expanded'
				},
				files: {
					'public/styles/0_layer_foundation.css': 'client/sass/foundation/0_layer_foundation.scss',
					'public/styles/1_layout_base.css': 'client/sass/base/1_layout_base.scss',
					'public/styles/2_layout_project.css': 'client/sass/project/2_layout_project.scss',
					'public/styles/3_layout_cosmetic.css': 'client/sass/cosmetic/3_layout_cosmetic.scss'
				}
			}
		},

		/**
		 * folders cleaning
		 */
		clean: {
			dev: [
				'.tmp/*',
				'client/sass/foundation/libs/*',
				'public/{scripts,styles,fonts}/*',
				'public/**/*.html'
			],
			quality: ['build/quality/*'],
			production: ['build/prod/*']
		},

		/**
		 * javascript linting
		 */
		jshint: {
			/* see http://www.jshint.com/docs/options/ */
			options: {
				'bitwise': true,
				'camelcase': false,
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
				'strict': false,
				'trailing': true,
				'maxparams': 3,
				'maxdepth': 3,
				'maxstatements': 20,
				'maxcomplexity': 10,
				'maxlen': 120,
				'asi': false,
				'boss': false,
				'debug': false,
				'eqnull': false,
				'esnext': false,
				'evil': false,
				'expr': true,
				'funcscope': false,
				'globalstrict': true,
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
				'globals': { /* list known variables to avoid "is not defined" error */
					'browser': true,
					'devel': true,
					'jquery': true,
					'node': true,
					'phantom': true,
					'angular': true,
					'__dirname': true,
					'require': true,
					'process': true,
					'console': true,
					'module': true,
					'describe': true,
					'done': true,
					'it': true
				},
				'nomen': false,
				'onevar': true,
				'passfail': false,
				'white': false
			},
			all: ['client/scripts/**/*.js', 'server.js', 'Gruntfile.js', 'server/**/*.js']
		},

		/**
		 * stylesheet linting
		 */
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
			compiled: {
				src: ['public/styles/{1,2,3}_*.css'] /* do not lint foundation layer */
			},
			minified: {
				src: ['public/styles/styles.min.css']
			}
		},

		/**
		 * fill index.tpl.html
		 * with all stylesheets and scripts
		 */
		includeSource: {
			index: {
				options: {
					basePath: 'public/'
				},
				files: {
					'.tmp/client/index.html': 'client/views/index.tpl.html'
				}
			}
		},

		/**
		 * modify page title depending on SERVER value
		 * also remove livereload script on quality and production environment
		 */
		preprocess: {
			dev: {
				options: {
					context: {
						LIVERELOAD: true,
						SERVER: 'developement'
					}
				},
				src: '.tmp/client/index.html',
				dest: 'public/index.html',
			},
			quality: {
				options: {
					context: {
						LIVERELOAD: false,
						SERVER: 'quality'
					}
				},
				src: '.tmp/client/index.html',
				dest: 'public/index.html',
			},
			production: {
				options: {
					context: {
						LIVERELOAD: false,
						SERVER: 'production'
					}
				},
				src: '.tmp/client/index.html',
				dest: 'public/index.html',
			}
		},

		/**
		 * parse the layout for concatenation and minification of stylesheets
		 */
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

		/**
		 * copy specific files for easier use
		 * - bower_components javascript, stylesheets and fonts
		 * - quality or production builds
		 */
		copy: {
			components: {
				files: [
					/* rename js files with version */
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/jquery/jquery.min.js'],
						rename: function( dest ){
							var pkg = grunt.file.readJSON('client/bower_components/jquery/bower.json');
							return dest +'jquery-'+ pkg.version +'.min.js';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/angular/angular.min.js'],
						rename: function( dest ){
							var pkg = grunt.file.readJSON('client/bower_components/angular/bower.json');
							return dest +'angular-'+ pkg.version +'.min.js';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/angular/angular.min.js.map']
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/angular-route/angular-route.min.js'],
						rename: function( dest ){
							var pkg = grunt.file.readJSON('client/bower_components/angular-route/bower.json');
							return dest +'angular-route-'+ pkg.version +'.min.js';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/angular-route/angular-route.min.js.map']
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/bootstrap/js/collapse.js'],
						rename: function( dest ){
							var pkg = grunt.file.readJSON('client/bower_components/bootstrap/bower.json');
							return dest +'bootstrap-'+ pkg.version +'-collapse.js';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'public/scripts/libs/',
						src: ['client/bower_components/bootstrap/js/dropdown.js'],
						rename: function( dest ){
							var pkg = grunt.file.readJSON('client/bower_components/bootstrap/bower.json');
							return dest +'bootstrap-'+ pkg.version +'-dropdown.js';
						}
					},
					/* css files rename them to _xxx.scss format for inclusion */
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'client/sass/foundation/libs/',
						src: ['client/bower_components/normalize-css/normalize.css'],
						rename: function( dest ){
							return dest +'_normalize.scss';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'client/sass/foundation/libs/',
						src: ['client/bower_components/angular/angular-csp.css'],
						rename: function( dest ){
							return dest +'_angular-csp.scss';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'client/sass/foundation/libs/',
						src: ['client/bower_components/bootstrap/dist/css/bootstrap.css'],
						rename: function( dest ){
							return dest +'_bootstrap.scss';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'client/sass/foundation/libs/',
						src: ['client/bower_components/bootstrap/dist/css/bootstrap-theme.css'],
						rename: function( dest ){
							return dest +'_bootstrap-theme.scss';
						}
					},
					{
						expand: true,
						flatten: true,
						filter: 'isFile',
						dest: 'client/sass/foundation/libs/',
						src: ['client/bower_components/font-awesome/css/font-awesome.css'],
						rename: function( dest ){
							return dest +'_font-awesome.scss';
						}
					}
				]
			},
			fonts: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				dest: 'public/fonts/',
				src: ['client/bower_components/font-awesome/fonts/*']
			},
			scripts: {
				expand: true,
				cwd: 'client/scripts/',
				src: ['*.js', '**/*.js'],
				dest: 'public/scripts/'
			},
			quality: {
				expand: true,
				src: ['public/**', 'server/!(tests)', 'server.js'],
				dest: 'build/quality/'
			},
			production: {
				expand: true,
				src: ['public/**', 'server/!(tests)', 'server.js'],
				dest: 'build/production/'
			}
		},

		/**
		 * remove unused css rules after parsing html
		 */
		uncss: {
			options: {
				compress: true
			},
			all: {
				files: {
					'public/styles/styles.min.css': ['client/views/**/*.tpl.html']
				}
			}
		},

		/**
		 * for before and after uncss size comparison
		 */
		compare_size: {
			files: [
				'public/styles/styles.css',
				'public/styles/styles.min.css'
			]
		},

		/**
		 * frontend tests in PhantomJS with coverage and threshold
		 */
		blanket_mocha_server: {
			frontend: {
				options: {
					port: 5001,
					htmlFile: 'test-runner.html',
					sutFiles: [
						'public/scripts/libs/jquery-*.min.js',
						'public/scripts/libs/!(jquery).js',
						'client/bower_components/angular-mocks/angular-mocks.js',
						'client/scripts/**/*.js'
					],
					testFiles: ['tests/**/**/*.js'],
					blanketOptions: {
						'data-cover-only': '//client\/scripts\//*.js'
					},
					assertionLibs: [
						'node_modules/expect.js/expect.js',
						'node_modules/superagent/superagent.js'
					],
					assertionsSetupScript: ''
				}
			}
		},

		/**
		 * frontend tests in PhantomJS with coverage and threshold
		 */
		blanket_mocha: {
			frontend: {
				options: {
					urls: ['http://localhost:5001/test-runner.html'],
					reporter: 'Spec', // with a capital leading S
					threshold: 80,
					growl: true
				}
			}
		},

		/**
		 * backend tests in PhantomJS with coverage
		 */
		mochaTest: {
			backend: {
				options: {
					reporter: 'spec',
					growl: true,
					require: 'coverage/blanket',
					clearRequireCache: true
				},
				src: ['tests/server/**/*.js']
			},
			'html-cov': {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage/coverage-server.html'
				},
				src: ['tests/server/**/*.js']
			},
			// The travis-cov reporter will fail the tests if the
			// coverage falls below the threshold configured in package.json
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: ['tests/server/**/*.js']
			}
		},

		/**
		 * frontend tests in real browser
		 */
		karma: {
			unit: {
				configFile: 'tests/karma-unit.conf.js'
			},
			midway: {
				configFile: 'tests/karma-midway.conf.js'
			},
			'end2end': {
				configFile: 'tests/karma-end2end.conf.js'
			}
		}
	});

	grunt.registerTask('dev', [
		'clean:dev'
		, 'copy:components'
		, 'copy:fonts'
		, 'sass'
		, 'csslint:compiled'
		, 'html2js'
		, 'jshint'
		, 'copy:scripts'
		, 'includeSource'
		, 'preprocess:dev'
		, 'concurrent'
	]);

	grunt.registerTask('default', ['dev']);

	grunt.registerTask('quality', [
		'clean:dev'
		, 'clean:quality'
		, 'copy:components'
		, 'copy:fonts'
		, 'sass'
		, 'csslint:compiled'
		, 'uncss'
		, 'csslint:minified'
		, 'compare_size'
		, 'html2js'
		, 'jshint'
		, 'copy:scripts'
		, 'includeSource'
		, 'preprocess:dev'
		, 'useminPrepare'
		, 'usemin'
		, 'copy:quality'
	]);

	grunt.registerTask('production', [
		'clean:dev'
		, 'clean:production'
		, 'copy:components'
		, 'copy:fonts'
		, 'sass'
		, 'csslint:compiled'
		, 'uncss'
		, 'csslint:minified'
		, 'compare_size'
		, 'html2js'
		, 'jshint'
		, 'copy:scripts'
		, 'includeSource'
		, 'preprocess:dev'
		, 'useminPrepare'
		, 'usemin'
		, 'copy:production'
	]);
};
