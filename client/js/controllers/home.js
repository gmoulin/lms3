'use strict';

angular
	.module('lms.controllers')
	.controller('home', [
		'$scope',
		'groupFilter',
		function( $scope, groupFilter ){
			$scope.parts = [
				'Books'
				, 'Movies'
				, 'Musics'
				, 'Wines and Spirits'
			];

			$scope.groups = groupFilter($scope.parts, 2);
		}
	])
;
