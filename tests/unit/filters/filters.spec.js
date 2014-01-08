'use strict';

describe('Unit: filter group', function(){
	beforeEach( module('lms.filters') );

	describe('GroupFilter', function(){
		it('should group list items by given number', inject(function( groupFilter ){
			var list = [1, 2, 3]
				, by2 = groupFilter(list, 2)
				, by1 = groupFilter(list, 1)
			;

			expect( by2 ).to.have.length( 2 );
			expect( by2[0] ).to.be.an('array');
			expect( by2[0] ).to.have.length( 2 );
			expect( by2[0][0] ).to.eql( 1 );
			expect( by2[0][1] ).to.eql( 2 );
			expect( by2[1] ).to.be.an('array');
			expect( by2[1] ).to.have.length( 1 );
			expect( by2[1][0] ).to.eql( 3 );

			expect( by1 ).to.have.length( 3 );
			expect( by1[0] ).to.be.an('array');
			expect( by1[1] ).to.be.an('array');
			expect( by1[2] ).to.be.an('array');
			expect( by1[0] ).to.have.length( 1 );
			expect( by1[1] ).to.have.length( 1 );
			expect( by1[2] ).to.have.length( 1 );
			expect( by1[0][0] ).to.eql( 1 );
			expect( by1[1][0] ).to.eql( 2 );
			expect( by1[2][0] ).to.eql( 3 );
		}) );

		it('should return null when no items are given', inject(function( groupFilter ){
			var noItems = groupFilter( null, 3 )
				, noParameters = groupFilter()
			;

			expect( noItems ).to.eql( null );
			expect( noParameters ).to.eql( null );
		}) );
	});

	describe('UrlifyFilter', function(){
		it('should replace spaces by underscores', inject(function( urlifyFilter ){
			var urlified1 = urlifyFilter('test test test')
				, urlified2 = urlifyFilter('')
			;

			expect( urlified1 ).to.equal('test_test_test');
			expect( urlified2 ).to.equal('');
		}) );

		it('should return null when no string is given', inject(function( urlifyFilter ){
			var nullified1 = urlifyFilter( null )
				, nullified2 = urlifyFilter([])
			;

			expect( nullified1 ).to.eql( null );
			expect( nullified2 ).to.eql( null );
		}) );
	});
});
