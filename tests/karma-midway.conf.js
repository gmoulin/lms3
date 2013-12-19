var sharedConfig = require('./karma-shared.conf');

module.exports = function( config ){
	var conf = sharedConfig();

	conf.files = conf.files.concat([
		//extra testing code
		'node_modules/ng-midway-tester/src/ngMidwayTester.js',

		//mocha stuff
		'test/mocha.conf.js',

		//test files
		'test/midway/**/*.js'
	]);

	conf.port = 5002;

	conf.proxies = {
		'/': 'http://localhost:'+ conf.port +'/'
	};

	config.set( conf );
};
