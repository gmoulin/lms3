'use strict';

describe("Unit: lms module", function(){
	var mod;

	before(function(){
		mod = angular.module('lms');
	});

	it('should exists', function(){
		expect( mod ).to.not.equal( null );
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

		it('should have ngRoute as a dependency', function(){
			expect( hasModule('ngRoute') ).to.be.true;
		});

		it('should have templates-main as a dependency', function(){
			expect( hasModule('templates-main') ).to.be.true;
		});

		it('should have lms.routes as a dependency', function(){
			expect( hasModule('lms.routes') ).to.be.true;
		});

		it('should have lms.controllers as a dependency', function(){
			expect( hasModule('lms.controllers') ).to.be.true;
		});

		it('should have lms.filters as a dependency', function(){
			expect( hasModule('lms.filters') ).to.be.true;
		});

		it('should have 5 dependencies', function(){
			expect( deps ).to.have.length( 5 );
		});
	});
});
