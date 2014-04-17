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

	describe('timeDistanceFilter', function(){
		it('elapsed time', inject(function( timeDistanceFilter ){
			var t1 = timeDistanceFilter('2014-01-01T00:00:10Z', '2014-01-01T00:00:01Z')
				, t2 = timeDistanceFilter('2014-01-01T00:01:10Z', '2014-01-01T00:00:01Z')
				, t3 = timeDistanceFilter('2014-01-01T01:01:10Z', '2014-01-01T00:00:01Z')
				, t4 = timeDistanceFilter('2014-01-02T01:01:10Z', '2014-01-01T00:00:01Z')
				, t5 = timeDistanceFilter('2014-02-02T01:01:10Z', '2014-01-01T00:00:01Z')
				, t6 = timeDistanceFilter('2014-12-02T01:01:10Z', '2014-01-01T00:00:01Z')
				, t7 = timeDistanceFilter('2015-12-02T01:01:10Z', '2014-01-01T00:00:01Z')
				, t8 = timeDistanceFilter('2020-12-02T01:01:10Z', '2014-01-01T00:00:01Z')
				, t9 = timeDistanceFilter('2014-01-01T00:02:10Z', '2014-01-01T00:00:01Z')
				, t10 = timeDistanceFilter('2015-02-01T00:00:01Z', '2014-01-01T00:00:01Z')
				, t11 = timeDistanceFilter('2015-07-01T00:00:01Z', '2014-01-01T00:00:01Z')
				, t12 = timeDistanceFilter('2016-01-01T00:00:01Z', '2014-01-01T00:00:01Z')
				, t13 = timeDistanceFilter('2018-01-01T00:00:01Z', '2014-01-01T00:00:01Z')
				, t14 = timeDistanceFilter('2014-01-01T00:00:01Z', '2020-03-01T00:00:01Z')
				, t15 = timeDistanceFilter('2014-01-01T00:00:01Z')
			;

			expect( t1 ).to.equal('less than a minute');
			expect( t2 ).to.equal('1 minute');
			expect( t3 ).to.equal('about 1 hour');
			expect( t4 ).to.equal('1 day');
			expect( t5 ).to.equal('about 1 month');
			expect( t6 ).to.equal('11 months');
			expect( t7 ).to.equal('almost 1 year');
			expect( t8 ).to.equal('almost 6 years');
			expect( t9 ).to.equal('2 minutes');
			expect( t10 ).to.equal('about 1 year');
			expect( t11 ).to.equal('over 1 year');
			expect( t12 ).to.equal('about 2 years');
			expect( t13 ).to.equal('about 4 years');
			expect( t14 ).to.equal('about 6 years');
			expect( t15 ).not.to.equal('2014-01-01T00:00:01Z');
		}) );
	});
});
