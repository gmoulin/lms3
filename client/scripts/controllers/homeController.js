'use strict';

angular
	.module('lms.controllers', ['lms.filters'])
	.controller('homeController', ['$scope', 'groupFilter', function( $scope, groupFilter ){
		$scope.parts = [
			'Books'
			, 'Movies'
			, 'Musics'
			, 'Wines and Spirits'
		];

		$scope.groups = groupFilter($scope.parts, 2);
	}])
;
