'use strict';

describe('Unit: books controller', function(){
	var $httpBackend;

	beforeEach(function(){
		module('lms.services');
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
		it('should get all books', inject(function( $controller, $rootScope, $routeParams, crud ){
			$httpBackend.whenGET('/rest/books').respond([ {id: 1}, {id: 2} ]);

			$httpBackend.expectGET('/rest/books');

			$routeParams.category = 'books';

			var scope = $rootScope.$new()
				, ctrl = $controller('list', {$scope: scope, $routeParams: $routeParams, crud: crud})
			;

			$httpBackend.flush();

			expect( scope.category ).to.equal('books');
			expect( scope.list ).to.be.an('array');
			expect( scope.list ).not.to.be.empty;
			expect( scope.list ).to.have.length( 2 );
			expect( scope.list[0] ).to.have.ownProperty('id');
			expect( scope.list[0].id ).to.equal( 1 );
		}) );
	});

});
