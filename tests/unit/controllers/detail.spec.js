'use strict';

describe('Unit: detail controller', function(){
	var $httpBackend
		, scope
		, item
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

	describe('book', function(){
		it('should obtain book from share', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$routeParams.category = 'book';
			$routeParams.id = '1';

			share.entry = {_id: 1};

			scope = $rootScope.$new();
			var ctrl = $controller('detail', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			expect( scope.entry ).to.be.an('object');
			expect( scope.entry ).not.to.be.empty;
			expect( scope.entry ).to.have.ownProperty('_id');
			expect( scope.entry._id ).to.equal( 1 );
		}) );

		it('should get book', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$httpBackend.whenGET('/rest/book/1').respond({id: 1});

			$httpBackend.expectGET('/rest/book/1');

			$routeParams.category = 'book';
			$routeParams.id = '1';

			scope = $rootScope.$new();
			var ctrl = $controller('detail', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();

			expect( scope.entry ).to.be.an('object');
			expect( scope.entry ).not.to.be.empty;
			expect( scope.entry ).to.have.ownProperty('id');
			expect( scope.entry.id ).to.equal( 1 );
		}) );

		it('should init share with detail', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
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

		it('should init share with filter', inject(function( $controller, $rootScope, $routeParams, $filter, $location, crud, share ){
			$httpBackend.whenGET('/rest/book/1').respond({id: 1});

			$httpBackend.expectGET('/rest/book/1');

			$routeParams.category = 'book';
			$routeParams.id = '1';

			scope = $rootScope.$new();
			var ctrl = $controller('detail', {$scope: scope, $routeParams: $routeParams, $filter: $filter, $location: $location, crud: crud, share: share});

			$httpBackend.flush();

			scope.setFilter('saga', {_id: '1'});
			expect( share.filter ).to.be.an('object');
			expect( share.filter.type ).to.equal('saga');
			expect( share.filter.value._id ).to.equal('1');
			expect( $location.path() ).to.equal('/list');
		}) );
	});
});
