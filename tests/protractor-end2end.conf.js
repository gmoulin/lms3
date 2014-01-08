exports.config = {
	chromeOnly: false,
	specs: [ //relative to this file location
		'integration/**/*.js'
	],
	capabilities: {
		'browserName': 'chrome'
	},
	baseUrl: 'http://www.lms3.dev',
	framework: 'mocha'
};
