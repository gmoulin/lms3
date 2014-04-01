'use strict';

// define routes used by the controller
angular
	.module('lms.routes')
	.config([
		'$routeProvider',
		function( $routeProvider ){
			$routeProvider
				.when('/books', {
					templateUrl: '../client/views/partials/books.tpl.html',
					controller: 'books'
				});
		}
	])
;

angular
	.module('lms.controllers')
	.controller('books', [
		'$scope',
		'crud',
		function( $scope, crud ){
			$scope.books = crud.books();
		}
	])
;
