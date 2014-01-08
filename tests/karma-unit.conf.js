var sharedConfig = require('./karma-shared.conf');

module.exports = function( config ){
	var conf = sharedConfig();

	conf.files = conf.files.concat([
		//extra testing code
		'client/bower_components/angular-mocks/angular-mocks.js',

		//mocha stuff
		'tests/mocha.conf.js',

		//test files
		'tests/unit/**/*.js'
	]);

	conf.port = 5004;

	config.frameworks = ['mocha', 'chai'];

	config.set( conf );
};
