'use strict';

angular
	.module('LMS3', [])
	.config(function( $routeProvider, $locationProvider ){
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
