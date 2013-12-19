angular
	.module('LMS3', [])
	.config(function( $routeProvider, $locationProvider ){
		'use strict';

		$routeProvider
			.when('/', {
				templateUrl: 'partials/main',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode( true );
	});
