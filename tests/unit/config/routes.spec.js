'use strict';

describe('Unit: routes', function(){
	var mod;

	before(function(){
		mod = angular.module('lms.routes');
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
			deps = mod.value('lms.routes').requires;
		});

		it('should have ngRoute as a dependency', function(){
			expect( hasModule('ngRoute') ).to.be.true;
		});

		it('should have 1 dependency', function(){
			expect( deps ).to.have.length( 1 );
		});
	});

	describe('mapping', function(){
		it('should map routes to controllers and templates', function(){
			module('lms.routes');

			inject(function( $route ){
				expect( $route.routes['/'].controller ).to.equal('homeController');
				expect( $route.routes['/'].templateUrl ).to.equal('../client/views/partials/home.tpl.html');

			});
		});
	});
});
