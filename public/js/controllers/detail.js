'use strict';

// define routes used by the controller
angular
	.module('lms.routes')
	.config([
		'$routeProvider',
		function( $routeProvider ){
			$routeProvider
				.when('/detail/:id/:category/:title?', {
					templateUrl: 'partials/detail.tpl.html',
					controller: 'detail'
				})
			;
		}
	])
;

angular
	.module('lms.controllers')
	.controller('detail', [
		'$scope',
		'$routeParams',
		'$filter',
		'$location',
		'crud',
		'share',
		function( $scope, $routeParams, $filter, $location, crud, share ){
			var id = $routeParams.id;

			$scope.category = $routeParams.category;

			if( share.entry && share.entry._id == id ){
				$scope.entry = share.entry;

			} else {
				crud.get(
					{itemType: $scope.category, id: id},
					function( data ){ //success
						$scope.entry = data;
					},
					function( err ){ //error
						$scope.errMsg = err;
					}
				);
			}

			$scope.detail = function( type, entry ){
				share.entry = entry;
				$location.path( '/detail/'+ entry._id +'/'+ $filter('urlify')( type ) +'/'+ encodeURIComponent( $filter('urlify')(entry.title) ) );
			};

			$scope.setFilter = function( type, value ){
				share.filter = {type: type, value: value};

				$location.path('/list');
			}
		}
	])
;

