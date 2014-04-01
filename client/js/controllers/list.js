'use strict';

// define routes used by the controller
angular
	.module('lms.routes')
	.config([
		'$routeProvider',
		function( $routeProvider ){
			$routeProvider
				.when('/:category', {
					templateUrl: 'partials/list.tpl.html',
					controller: 'list'
				});
		}
	])
;

angular
	.module('lms.controllers')
	.controller('list', [
		'$scope',
		'$routeParams',
		'crud',
		function( $scope, $routeParams, crud ){
			$scope.category = $routeParams.category.toLowerCase();
			$scope.list = crud[ $routeParams.category.toLowerCase() ]();
		}
	])
;
