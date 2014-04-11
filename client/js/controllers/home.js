'use strict';

angular
	.module('lms.controllers')
	.controller('home', [
		'$scope',
		function( $scope ){
			$scope.parts = [
				'Books'
				, 'Movies'
				, 'Musics'
				, 'Wines and Spirits'
			];
		}
	])
;
