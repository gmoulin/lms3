'use strict';

describe('Unit: list controller', function(){
	var $httpBackend
		, scope
		, items
	;

	beforeEach(function(){
		module('lms.services');
		module('lms.filters');
		module('lms.controllers');
	});

	beforeEach( inject(function( $injector ){
		$httpBackend = $injector.get('$httpBackend');
	}) );

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('books', function(){
		it('should get all books', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$httpBackend.whenGET('/rest/books').respond([ {id: 1}, {id: 2} ]);

			$httpBackend.expectGET('/rest/books');

			$routeParams.category = 'books';

			scope = $rootScope.$new();
			var ctrl = $controller('list', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();

			expect( scope.category ).to.equal('books');
			expect( scope.list ).to.be.an('array');
			expect( scope.list ).not.to.be.empty;
			expect( scope.list ).to.have.length( 2 );
			expect( scope.list[0] ).to.have.ownProperty('id');
			expect( scope.list[0].id ).to.equal( 1 );
		}) );

		it('should have no category and init with filter from share', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$httpBackend.whenGET('/rest/items').respond([ {id: 1}, {id: 2} ]);

			$httpBackend.expectGET('/rest/items');

			share.filter = {type: 'saga', value: {_id: '1'}};

			scope = $rootScope.$new();
			var ctrl = $controller('list', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();

			expect( $routeParams.category ).to.equal('items');
			expect( scope.category ).to.equal( undefined );
			expect( scope.noCategory ).to.equal( true );
			expect( scope.list_types ).to.be.an('array');
			expect( scope.list_types ).not.to.be.empty;
			expect( scope.list_types ).to.have.length( 1 );
			expect( scope.list_types[0] ).to.equal('book');

			expect( scope.search.saga._id ).to.equal('1');
			expect( share.filter ).to.equal( null );
		}) );

		it('should init correctly for filtering', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			items = [
				{
					'title': 'La vengeance de Chanur',
					'category': 'book',
					'type': 'paper',
					'search': 'http://google.com/#q=La%20vengeance%20de%20Chanur',
					'saga': {
						'title': 'Le cycle de Chanur',
						'url': 'http://fr.wikipedia.org/wiki/Chanur',
						'_id': '53454672f19193b269ce4b8b',
						'__v': 0,
						'lastCheckDate': '2014-04-09T13:09:05.874Z'
					},
					'storage': {
						'room': 'salle à manger',
						'type': 'bibliothèque',
						'column': 'C',
						'_id': '53454672f19193b269ce4b87',
						'__v': 0,
						'line': 6
					},
					'_id': '53454673f19193b269ce4de2',
					'__v': 0,
					'tvshow': {
						'season': [],
						'artist': []
					},
					'album': {
						'band': []
					},
					'alcohol': {
						'maker': []
					},
					'movie': {
						'director': [],
						'artist': []
					},
					'book': {
						'author': [{
							'site': 'http://www.cherryh.com/',
							'search': 'http://fr.wikipedia.org/wiki/C._J._Cherryh',
							'_id': '53454672f19193b269ce4c9c',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Carolyn Janice',
								'last': 'Cherry'
							}
						}]
					},
					'rating': 0,
					'sagaPosition': 3,
					'genre': [ 'ko' ],
					'update_date': '2014-04-09T13:09:07.079Z',
					'added_date': '2014-04-09T13:09:07.079Z'
				},
				{
					'title': 'Fulgrim',
					'category': 'book',
					'type': 'paper',
					'search': 'http://google.com/#q=Fulgrim',
					'saga': {
						'title': 'Horus Heresy',
						'url': 'http://wh40k.lexicanum.com/wiki/Horus_Heresy_Series',
						'_id': '53454672f19193b269ce4b8c',
						'__v': 0,
						'lastCheckDate': '2014-04-09T13:09:05.874Z'
					},
					'storage': {
						'room': 'salle à manger',
						'type': 'bibliothèque',
						'column': 'B',
						'_id': '53454672f19193b269ce4b85',
						'__v': 0,
						'line': 2
					},
					'_id': '53454673f19193b269ce4de6',
					'__v': 0,
					'tvshow': {
						'season': [],
						'artist': []
					},
					'album': {
						'band': []
					},
					'alcohol': {
						'maker': []
					},
					'movie': {
						'director': [],
						'artist': []
					},
					'book': {
						'author': [{
							'site': 'http://www.graham-mcneill.com/',
							'search': 'http://www.graham-mcneill.com/novels.php',
							'_id': '53454672f19193b269ce4c65',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Graham',
								'last': 'McNeill'
							}
						}]
					},
					'rating': 0,
					'sagaPosition': 5,
					'genre': [ 'ko' ],
					'update_date': '2014-04-09T13:09:07.083Z',
					'added_date': '2014-04-09T13:09:07.083Z'
				},
				{
					'title': 'Light My Fire',
					'category': 'book',
					'type': 'paper',
					'search': 'http://google.com/#q=Light%20My%20Fire',
					'saga': {
						'title': 'Aisling Grey',
						'url': 'http://katiemacalister.com/books/',
						'_id': '53454672f19193b269ce4be9',
						'__v': 0,
						'lastCheckDate': '2014-04-09T13:09:05.874Z'
					},
					'storage': {
						'room': 'chambre sous-sol',
						'type': 'billy angle',
						'column': 'A',
						'_id': '53454672f19193b269ce4ba0',
						'__v': 0,
						'line': 2
					},
					'_id': '53454673f19193b269ce4de4',
					'__v': 0,
					'tvshow': {
						'season': [],
						'artist': []
					},
					'album': {
						'band': []
					},
					'alcohol': {
						'maker': []
					},
					'movie': {
						'director': [],
						'artist': []
					},
					'book': {
						'author': [{
							'site': 'http://katiemacalister.com/',
							'search': 'http://katiemacalister.com/books/',
							'_id': '53454672f19193b269ce4c2b',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Katie',
								'last': 'MacAlister'
							}
						}]
					},
					'rating': 0,
					'sagaPosition': 3,
					'genre': [ 'ko' ],
					'update_date': '2014-04-09T13:09:07.081Z',
					'added_date': '2014-04-09T13:09:07.081Z'
				},
				{
					'title': 'Fire Me Up',
					'category': 'book',
					'type': 'paper',
					'search': 'http://google.com/#q=Fire%20Me%20Up',
					'saga': {
						'title': 'Aisling Grey',
						'url': 'http://katiemacalister.com/books/',
						'_id': '53454672f19193b269ce4be9',
						'__v': 0,
						'lastCheckDate': '2014-04-09T13:09:05.874Z'
					},
					'storage': {
						'room': 'chambre sous-sol',
						'type': 'billy angle',
						'column': 'A',
						'_id': '53454672f19193b269ce4ba0',
						'__v': 0,
						'line': 2
					},
					'_id': '53454673f19193b269ce4df4',
					'__v': 0,
					'tvshow': {
						'season': [],
						'artist': []
					},
					'album': {
						'band': []
					},
					'alcohol': {
						'maker': []
					},
					'movie': {
						'director': [],
						'artist': []
					},
					'book': {
						'author': [{
							'site': 'http://katiemacalister.com/',
							'search': 'http://katiemacalister.com/books/',
							'_id': '53454672f19193b269ce4c2b',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Katie',
								'last': 'MacAlister'
							}
						}]
					},
					'rating': 0,
					'sagaPosition': 2,
					'genre': [ 'ko' ],
					'update_date': '2014-04-09T13:09:07.097Z',
					'added_date': '2014-04-09T13:09:07.097Z'
				},
				{
					'title': 'La mer de feu',
					'category': 'book',
					'type': 'paper',
					'search': 'http://google.com/#q=La%20mer%20de%20feu',
					'saga': {
						'title': 'Les portes de la mort',
						'url': 'http://google.com/#q=Les%20portes%20de%20la%20mort',
						'_id': '53454672f19193b269ce4b94',
						'__v': 0,
						'lastCheckDate': '2014-04-09T13:09:05.874Z'
					},
					'storage': {
						'room': 'salle à manger',
						'type': 'bibliothèque',
						'column': 'B',
						'_id': '53454672f19193b269ce4c03',
						'__v': 0,
						'line': 6
					},
					'_id': '53454673f19193b269ce4e03',
					'__v': 0,
					'tvshow': {
						'season': [],
						'artist': []
					},
					'album': {
						'band': []
					},
					'alcohol': {
						'maker': []
					},
					'movie': {
						'director': [],
						'artist': []
					},
					'book': {
						'author': [{
							'site': 'http://google.com/#q=Margaret%20Weis',
							'search': 'http://google.com/#q=Margaret%20Weis',
							'_id': '53454672f19193b269ce4c34',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Margaret',
								'last': 'Weis'
							}
						},
						{
							'site': 'http://google.com/#q=Tracy%20Hickman',
							'search': 'http://google.com/#q=Tracy%20Hickman',
							'_id': '53454672f19193b269ce4c6d',
							'__v': 0,
							'lastCheckDate': '2014-04-09T13:09:05.879Z',
							'name': {
								'first': 'Tracy',
								'last': 'Hickman'
							}
						}]
					},
					'rating': 0,
					'sagaPosition': 2,
					'genre': [ 'ko' ],
					'update_date': '2014-04-09T13:09:07.134Z',
					'added_date': '2014-04-09T13:09:07.134Z'
				}
			];

			$httpBackend.whenGET('/rest/books').respond( items );

			$httpBackend.expectGET('/rest/books');

			$routeParams.category = 'books';

			scope = $rootScope.$new();
			var ctrl = $controller('list', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();
			scope.rawList = items;

			expect( scope.list ).to.be.an('array');
			expect( scope.list ).not.to.be.empty;
			expect( scope.list ).to.have.length( 5 );
			expect( scope.list[0] ).to.have.ownProperty('_id');
			expect( scope.list[0]._id ).to.equal('53454673f19193b269ce4de2');

			expect( scope.rawList ).to.be.an('array');
			expect( scope.rawList ).not.to.be.empty;
			expect( scope.rawList ).to.have.length( 5 );
			expect( scope.rawList[0] ).to.have.ownProperty('_id');
			expect( scope.rawList[0]._id ).to.equal('53454673f19193b269ce4de2');
		}) );

		it('should filter on title', function(){
			scope.search.title = 'toto';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 0 );
			expect( Object.keys(scope.linked) ).to.have.length( 0 );

			scope.search.title = 'Chanur';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal('53454672f19193b269ce4b8b');
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal('53454672f19193b269ce4c9c');
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should filter on saga title', function(){
			scope.resetFilter();
			scope.$apply();

			scope.search.saga.title = 'toto';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 0 );
			expect( Object.keys(scope.linked) ).to.have.length( 0 );

			scope.search.saga.title = 'cycle';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 0 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 0 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.search.saga.title = 'Horus';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 1 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 1 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.search.saga.title = 'Aisling';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 2 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 3 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 3 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should filter on saga id', function(){
			scope.resetFilter();
			scope.$apply();

			scope.setFilter('saga', {_id: '1'});
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 0 );
			expect( Object.keys(scope.linked) ).to.have.length( 0 );

			scope.setFilter('saga', items[ 0 ].saga);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 0 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 0 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.setFilter('saga', items[ 1 ].saga);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 1 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 1 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.setFilter('saga', items[ 3 ].saga);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 2 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 3 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 3 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should filter on author name', function(){
			scope.resetFilter();
			scope.$apply();

			scope.search.author.name = 'toto';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 0 );
			expect( Object.keys(scope.linked) ).to.have.length( 0 );

			scope.search.author.name = 'Caroly';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 0 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 0 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.search.author.name = 'cNeill';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 1 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 1 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.search.author.name = 'Margaret';
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( true );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 4 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 2 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 4 ].book.author[ 0 ]._id );
			expect( scope.linked.authors[ 1 ]._id ).to.equal( items[ 4 ].book.author[ 1 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should filter on author id', function(){
			scope.resetFilter();
			scope.$apply();

			scope.setFilter('author', {_id: '1'});
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 0 );
			expect( Object.keys(scope.linked) ).to.have.length( 0 );

			scope.setFilter('author', items[ 0 ].book.author[ 0 ]);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 0 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 0 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.setFilter('author', items[ 1 ].book.author[ 0 ]);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 1 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 1 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );

			scope.setFilter('author', items[ 4 ].book.author[ 0 ]);
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( true );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 4 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 2 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 4 ].book.author[ 0 ]._id );
			expect( scope.linked.authors[ 1 ]._id ).to.equal( items[ 4 ].book.author[ 1 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should filter on saga title and title', function(){
			scope.resetFilter();
			scope.$apply();

			scope.search.title = items[ 3 ].title;
			scope.search.saga.title = items[ 3 ].saga.title;
			scope.$apply();
			expect( scope.searchFilter( items[ 0 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 1 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 2 ] ) ).to.equal( false );
			expect( scope.searchFilter( items[ 3 ] ) ).to.equal( true );
			expect( scope.searchFilter( items[ 4 ] ) ).to.equal( false );
			expect( scope.list ).to.have.length( 1 );
			expect( Object.keys(scope.linked) ).to.have.length( 3 );
			expect( scope.linked ).to.have.ownProperty('sagas');
			expect( scope.linked.sagas ).to.have.length( 1 );
			expect( scope.linked.sagas[ 0 ]._id ).to.equal( items[ 3 ].saga._id );
			expect( scope.linked ).to.have.ownProperty('authors');
			expect( scope.linked.authors ).to.have.length( 1 );
			expect( scope.linked.authors[ 0 ]._id ).to.equal( items[ 3 ].book.author[ 0 ]._id );
			expect( scope.linked ).to.have.ownProperty('artists');
			expect( scope.linked.artists ).to.have.length( 0 );
		});

		it('should fill share using detail', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$httpBackend.whenGET('/rest/book/1').respond({id: 1});

			$httpBackend.expectGET('/rest/book/1');

			$routeParams.category = 'book';
			$routeParams.id = '1';

			scope = $rootScope.$new();
			var ctrl = $controller('detail', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();

			scope.detail('saga', {_id: '1', title: 'toto'});
			expect( share.entry ).to.be.an('object');
			expect( share.entry._id ).to.equal('1');
			expect( share.entry.title ).to.equal('toto');
			expect( $location.path() ).to.equal('/detail/1/saga/toto');
		}) );
	});
});
