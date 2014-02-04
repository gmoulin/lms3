'use strict';

angular
	.module('lms.routes', [])
	.config([
		'$routeProvider',
		'$locationProvider',
		function( $routeProvider, $locationProvider ){
			$routeProvider
				.when('/home', {
					templateUrl: '../client/views/partials/home.tpl.html',
					controller: 'home'
				})
				.otherwise({
					redirectTo: '/home'
				})
			;

			// other routes are in respective controllers

			$locationProvider.html5Mode( true );
		}
	])
;
