var sharedConfig = require('./karma-shared.conf');

module.exports = function( config ){
	var conf = sharedConfig();

	conf.files = conf.files.concat([
		//test files
		'test/end2end/**/*.js'
	]);

	conf.port = 5003;

	conf.proxies = {
		'/': 'http://localhost:'+ conf.port +'/'
	};

	conf.urlRoot = '/__karma__/';

	conf.frameworks = ['ng-scenario'];

	config.set( conf );
};
