module.exports = function(){
	return {
		basePath: '../',
		reporters: ['progress'],
		browsers: ['Chrome'],

		autoWatch: false,
		background: true,

		// these are default values anyway
		singleRun: false,
		colors: true,

		files : [
			//third party librairies
			'public/scripts/libs/angular-*.min.js',

			//app code
			'client/scripts/**/*.js'
		]
	};
};
