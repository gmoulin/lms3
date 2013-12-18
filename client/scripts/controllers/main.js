'use strict';

angular
	.module('LMS3')
	.controller('MainCtrl', function( $scope, $http ){
		$http.get('/api/awesomeThings').success(function( awesomeThings ){
			$scope.awesomeThings = awesomeThings;
		});
	});
