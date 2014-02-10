'use strict';

describe('crud service', function(){
	var $httpBackend;

	beforeEach( module('lms.services') );

	beforeEach( inject(function( $injector ){
		$httpBackend = $injector.get('$httpBackend');
	}) );

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('books', function(){
		it('should get all books', inject(function(crud){
			$httpBackend.whenGET('/rest/books').respond([ {id: 1}, {id: 2} ]);

			$httpBackend.expectGET('/rest/books');

			var result = crud.books();

			$httpBackend.flush();

			expect( result ).to.be.an('array');
			expect( result ).not.to.be.empty;
			expect( result ).to.have.length( 2 );
			expect( result[0] ).to.have.ownProperty('id');
			expect( result[0].id ).to.equal( 1 );
		}) );
	});
});
