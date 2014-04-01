module.exports = function( grunt ){
	'use strict';

	// load all grunt tasks using the package.json dependencies list
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	//require('time-grunt')( grunt );

	grunt.initConfig({
		/**
		 * dev concurrent process
		 */
		concurrent: {
			dev: {
				tasks: ['blanket_mocha_server:continuous', 'watch', 'open'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		/**
		 * called by concurrent task
		 */
		watch: {
			frontendTests: {
				files: [
					'client/js/**/*.js'
					, 'tests/unit/**/*.js'
					, 'tests/integration/**/*.js'
				],
				tasks: [
					'blanket_mocha_server:runner'
					, 'blanket_mocha'
					, 'karma:unit:run'
					//, 'protractor:end2end'
				]
			},
			backendTests: {
				files: [
					'server.js'
					, 'server/**/*.js'
					, 'tests/server/**/*.js'
				],
				tasks: ['mochaTest']
			}
		},

		open: {
			tests: {
				path: 'http://localhost:5001/test-runner.html'
			}
		},

		/**
		 * frontend tests in PhantomJS with coverage and threshold
		 */
		blanket_mocha_server: {
			options: {
				htmlFile: 'test-runner.html',
				sutFiles: [
					'public/js/libs/angular.js'
					, 'bower_components/angular-mocks/angular-mocks.js'
					, 'public/js/libs/angular-route.js'
					, 'public/js/libs/angular-sanitize.js'
					, 'public/js/libs/angular-resource.js'
					, 'client/js/lms-modules.js'
					, 'client/js/lms-routes.js'
					, 'public/js/lms-templates.js'
					, 'client/js/!(libs)/*.js'
					, 'client/js/lms.js'
				],
				testFiles: ['tests/unit/**/*.js'],
				blanketOptions: {
					'data-cover-only': '//client\\/js\\//'
				}
			},
			runner: {
				options: {
					server: false
				}
			},
			continuous: {
				options: {
					server: true,
					port: 5001,
					keepalive: true //for easier debugging
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
			}
		},

		protractor: {
			options: {
				keepAlive: true,
				noColor: false
			},
			end2end: {
				options: {
					configFile: 'tests/protractor-end2end.conf.js'
				}
			}
		}
	});

	grunt.registerTask('default', ['concurrent']);

	grunt.registerTask('end2end', ['protractor:end2end']);
};
