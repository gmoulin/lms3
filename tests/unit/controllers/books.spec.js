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
		it('should get all books', inject(function( $controller, $rootScope, crud ){
			$httpBackend.whenGET('/rest/books').respond([ {id: 1}, {id: 2} ]);

			$httpBackend.expectGET('/rest/books');

			var scope = $rootScope.$new()
				, ctrl = $controller('books', {$scope: scope, crud: crud})
			;

			$httpBackend.flush();

			expect( scope.books ).to.be.an('array');
			expect( scope.books ).not.to.be.empty;
			expect( scope.books ).to.have.length( 2 );
			expect( scope.books[0] ).to.have.ownProperty('id');
			expect( scope.books[0].id ).to.equal( 1 );
		}) );
	});

});
