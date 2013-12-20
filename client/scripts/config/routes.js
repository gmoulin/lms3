'use strict';

angular
	.module('lms.routes', ['ngRoute'])
	.config([
		'$routeProvider',
		'$locationProvider',
		function( $routeProvider, $locationProvider ){
			$routeProvider
				.when('/', {
					templateUrl: '../client/views/partials/home.tpl.html',
					controller: 'homeController'
				})
				.otherwise({
					redirectTo: '/'
				});

			$locationProvider.html5Mode( true );
		}
	])
;
