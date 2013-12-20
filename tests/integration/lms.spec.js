'use strict';

describe("Integration: lms module", function(){
	var mod;

	before(function(){
		mod = module('lms');
	});

	it('should exists', function(){
		expect( mod ).not.to.equal( null );
	});

	describe('dependencies', function(){
		var deps
			, hasModule = function( m ){
				return deps.indexOf( m ) >= 0;
			}
		;

		before(function(){
			deps = mod.value('lms').requires;
		});

		it('should have ngRoutes as a dependency', function(){
			expect( hasModule('ngRoutes') ).to.equal( true );
		});

		it('should have templates-main as a dependency', function(){
			expect( hasModule('templates-main') ).to.equal( true );
		});

		it('should have lms.routes as a dependency', function(){
			expect( hasModule('lms.routes') ).to.equal( true );
		});

		it('should have lms.controllers as a dependency', function(){
			expect( hasModule('lms.controllers') ).to.equal( true );
		});

		it('should have 4 dependencies', function(){
			expect( deps ).to.have.length( 4 );
		});
	});
});
