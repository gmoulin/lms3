'use strict';

var LIVERELOAD_PORT = 35729; //port of chrome livereload extension

module.exports = function( grunt ){
	// load all grunt tasks using the package.json dependencies list
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({
		concurrent: {
			target: {
				tasks: ['watch', 'shell:jekyllServe'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		watch: {
			jekyll: {
				files: [
					'_includes/*.html',
					'_layouts/*.html',
					'index.html',
					'grunt-workflow.html',
					'problems-and-solutions.html'
				],
				tasks: ['shell:jekyllBuild'],
				options: {
					livereload: LIVERELOAD_PORT,
					atBegin: true //will run jekyllBuild when watch start
				}
			}
		},

		shell: {
			options: {
				stdout: true
			},
			jekyllBuild: {
				command: "jekyll build"
			},
			jekyllServe: {
				command: "jekyll serve --baseurl ''" //_config.yml has already a baseurl for github.io, replace it for local preview
			}
		}
	});

	grunt.registerTask('default', ['concurrent']);
};
