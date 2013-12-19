module.exports = function(){
	return {
		basePath: '../',
		frameworks: ['mocha'],
		reporters: ['progress'],
		browsers: ['Chrome'],
		autoWatch: false,

		// these are default values anyway
		singleRun: false,
		colors: true,

		files : [
			//test specific librairies
			'node_modules/superagent/superagent.js',
			'node_modules/expect.js/expect.js',

			//third party librairies
			'public/scripts/libs/angular-*.min.js',

			//app code
			'client/scripts/**/*.js'
		]
	};
};
