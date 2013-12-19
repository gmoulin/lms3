angular
	.module('LMS3')
	.controller('MainCtrl', function( $scope, $http ){
		'use strict';

		$http.get('/api/awesomeThings').success(function( awesomeThings ){
			$scope.awesomeThings = awesomeThings;
		});
	});
