'use strict';

// define routes used by the controller
angular
	.module('lms.routes')
	.config([
		'$routeProvider',
		function( $routeProvider ){
			$routeProvider
				.when('/list/:category?', {
					templateUrl: 'partials/list.tpl.html',
					controller: 'list'
				})
			;
		}
	])
;

angular
	.module('lms.controllers')
	.controller('list', [
		'$scope',
		'$routeParams',
		'$filter',
		'$location',
		'crud',
		'share',
		function( $scope, $routeParams, $filter, $location, crud, share ){
			var searchSkeleton = {
				category: null,
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

			$scope.rawList = null;

			$scope.linked = {};

			$scope.search = _.clone( searchSkeleton, true );
			$scope.hasFilter = false;
			$scope.noCategory = false;

			if( $routeParams.category ){
				$scope.category = $routeParams.category.toLowerCase();

			} else {
				$scope.noCategory = true;
				$scope.list_types = ['book'];
				$routeParams.category = 'items';
			}

			//server request - display will update on $scope.list init
			crud[ $routeParams.category.toLowerCase() ](
				function( data ){
					$scope.list = data;
				},
				function( err ){
					console.log(err);
				}
			);

			$scope.$watch('search', function(newValue, oldValue){
				if( !_.isEqual(searchSkeleton, newValue) ){
					$scope.hasFilter = true;
					if( $scope.rawList && $scope.rawList.length > 0 ){
						$scope.list = $scope.rawList;
					}
					manageFilter();
				}
			}, true);

			$scope.resetFilter = function(){
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

			if( share.filter ){
				$scope.setFilter( share.filter.type, share.filter.value );
				share.filter = null;
			}

			var manageFilter = function(){
				if( $scope.rawList === null && Array.isArray( $scope.list ) && $scope.list.length > 0 ){
					$scope.rawList = _.clone($scope.list, true);
				}

				if( $scope.rawList && $scope.rawList.length > 0 ){
					$scope.list = $filter('filter')($scope.rawList, $scope.searchFilter);

					if( $scope.list.length > 0 ){
						getLinked();
					}
				}
			};

			//in $scope for unit testing
			$scope.searchFilter = function( item ){
				var i, l, author, found;

				if( !_.isEmpty( $scope.search.category )
					&& item.category != $scope.search.category
				){
					return false;
				}

				if( (!_.isEmpty( $scope.search.saga.title ) || !_.isEmpty( $scope.search.saga._id ))
					&& _.isEmpty( item.saga )
				){
					return false;
				}

				if( !_.isEmpty( $scope.search.saga.title )
					&& item.saga.title.indexOf( $scope.search.saga.title ) == -1
				){
					return false;
				}

				if( !_.isEmpty( $scope.search.saga._id )
					&& item.saga._id != $scope.search.saga._id
				){
					return false;
				}

				if( !_.isEmpty( $scope.search.title )
					&& item.title.indexOf( $scope.search.title ) == -1
				){
					return false;
				}

				if( (!_.isEmpty( $scope.search.author.name ) || !_.isEmpty( $scope.search.author._id ))
					&& item.book.author.length === 0
				){
					return false;
				}

				if( !_.isEmpty( $scope.search.author.name ) ){
					found = false;
					for( i = 0, l = item.book.author.length; i < l; i++ ){
						author = item.book.author[ i ];

						if( [author.name.first, author.name.last].join(' ').indexOf( $scope.search.author.name ) != -1 ){
							found = true;
							break;
						}
					}

					if( !found ){
						return false;
					}
				}

				if( !_.isEmpty( $scope.search.author._id ) ){
					found = false;
					for( i = 0, l = item.book.author.length; i < l; i++ ){
						author = item.book.author[ i ];

						if( item.book.author[ i ]._id == $scope.search.author._id ){
							found = true;
							break;
						}
					}

					if( !found ){
						return false;
					}
				}

				return true;
			};

			var getLinked = function(){
				if( $scope.list.length === 0 ){
					return;
				}

				if( $scope.list.length > 99 ){
					return;
				}

				$scope.linked.sagas = _.uniq( _.compact( _.pluck($scope.list, 'saga') ), '_id' );
				$scope.linked.authors = _.uniq( _.flatten(_.pluck(_.pluck($scope.list, 'book'), 'author')), '_id' );
				$scope.linked.artists = _.uniq( _.flatten(_.pluck(_.pluck($scope.list, 'movie'), 'artist')), '_id' );
			};

			$scope.detail = function( type, entry ){
				share.entry = entry;
				$location.path( '/detail/'+ entry._id +'/'+ $filter('urlify')( type ) +'/'+ encodeURIComponent( $filter('urlify')(entry.title) ) );
			};
		}
	])
;
