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
		'$filter',
		'crud',
		function( $scope, $routeParams, $filter, crud ){
			var searchSkeleton = {
				title: '',
				saga: {
					_id: null,
					title: ''
				},
				author: {
					_id: null,
					name: ''
				}
			};

			var isReset = false;
			$scope.rawList = null;

			$scope.linked = {};

			$scope.search = _.clone( searchSkeleton, true );
			$scope.hasFilter = false;
			$scope.category = $routeParams.category.toLowerCase();
			$scope.list = crud[ $routeParams.category.toLowerCase() ]();

			$scope.$watch('search', function(newValue, oldValue){
				if( newValue && !isReset ){
					$scope.hasFilter = true;
					if( $scope.rawList && $scope.rawList.length > 0 ){
						$scope.list = $scope.rawList;
					}
					manageFilter();
				}
				isReset = false;
			}, true);

			$scope.resetFilter = function(){
				console.log('resetFilter');
				isReset = true;
				$scope.search = _.clone( searchSkeleton, true );
				$scope.linked = {};
				$scope.list = $scope.rawList;
				$scope.hasFilter = false;
			};

			$scope.setFilter = function( type, value ){
				switch( type ){
					case 'saga':
						$scope.search.saga._id = value._id;
						break;
					case 'author':
						$scope.search.author._id = value._id;
						break;
					default:
						break;
				}

				$scope.hasFilter = true;
			};

			var manageFilter = function(){
				console.log('manageFilter');
				if( $scope.rawList === null && Array.isArray( $scope.list ) && $scope.list.length > 0 ){
					console.log('rawList set');
					$scope.rawList = _.clone($scope.list, true);
				}

				if( $scope.rawList && $scope.rawList.length > 0 ){
					console.log('filtering');
					$scope.list = $filter('filter')($scope.rawList, $scope.searchFilter);
					getLinked();
				}
			};

			//in $scope for unit testing
			$scope.searchFilter = function( item ){
				var i, l, author;

				if( !_.isEmpty( $scope.search.saga.title )
					&& item.saga
					&& item.saga.title.indexOf( $scope.search.saga.title ) != -1
				){
					return true;
				}

				if( !_.isEmpty( $scope.search.saga._id )
					&& item.saga
					&& item.saga._id == $scope.search.saga._id
				){
					return true;
				}

				if( !_.isEmpty( $scope.search.title )
					&& item.title.indexOf( $scope.search.title ) != -1
				){
					return true;
				}

				if( !_.isEmpty( $scope.search.author.name )
					&& item.book.author.length > 0
				){
					for( i = 0, l = item.book.author.length; i < l; i++ ){
						author = item.book.author[ i ];

						if( [author.name.first, author.name.last].join(' ').indexOf( $scope.search.author.name ) != -1 ){
							return true;
						}
					}
				}

				if( !_.isEmpty( $scope.search.author._id )
					&& item.book.author.length > 0
				){
					for( i = 0, l = item.book.author.length; i < l; i++ ){
						author = item.book.author[ i ];

						if( item.book.author[ i ]._id == $scope.search.author._id ){
							return true;
						}
					}
				}

				return false;
			};

			var getLinked = function(){
				if( $scope.list.length === 0 ){
					return;
				}

				$scope.linked.sagas = _.uniq( _.pluck($scope.list, 'saga'), '_id' );
				$scope.linked.authors = _.uniq( _.flatten(_.pluck(_.pluck($scope.list, 'book'), 'author')), '_id' );
				$scope.linked.artists = _.uniq( _.flatten(_.pluck(_.pluck($scope.list, 'movie'), 'artist')), '_id' );
			};
		}
	])
;
