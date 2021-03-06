'use strict';

angular
	.module('lms.services')
	.factory('crud', [
		'$resource',
		function( $resource ){
			return $resource(
				'/rest/:itemType/:listController:id/:docController',
				{
					itemType: '@itemType',
					id: '@id',
					listController: '@listController',
					docController: '@docController'
				},
				{
					'items': { method: 'GET', params: {itemType: 'items'}, isArray: true },
					'books': { method: 'GET', params: {itemType: 'books'}, isArray: true },
					'movies': { method: 'GET', params: {itemType: 'movies'}, isArray: true },
				}
			);
		}
	])
;
