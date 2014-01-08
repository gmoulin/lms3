'use strict';

angular
	.module('lms', [
		'ngRoute' //angular-route script
		, 'templates-main'
		, 'lms.routes'
		, 'lms.filters'
		, 'lms.controllers'
	])
;
