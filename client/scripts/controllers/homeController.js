'use strict';

angular
	.module('lms.controllers', [])
	.controller('homeController', ['$scope', function( $scope ){
		$scope.parts = [
			'Books',
			'Movies',
			'Music',
			'Alcohols'
		];
	}])
;
