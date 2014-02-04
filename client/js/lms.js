'use strict';

angular.module('lms', [
		'ngSanitize' //angular-sanitize
		, 'ngRoute' //angular-route
		, 'ngResource' //angular-resource
		, 'templates-main'
		, 'lms.routes'
		, 'lms.filters'
		, 'lms.controllers'
		, 'lms.services'
		, 'lms.directives'
	])
;
