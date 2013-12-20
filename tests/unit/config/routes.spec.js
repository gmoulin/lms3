'use strict';

describe('Unit: routes', function(){
	var mod;

	before(function(){
		mod = module('lms.routes');
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
			deps = mod.value('lms.routes').requires;
		});

		it('should have ngRoutes as a dependency', function(){
			expect( hasModule('ngRoutes') ).to.equal( true );
		});

		it('should have 1 dependency', function(){
			expect( deps ).to.have.length( 1 );
		});
	});

	describe('mapping', function(){
		it('should map routes to controllers and templates', function(){
			module('lms.routes');

			inject(function( $route ){
				expect( $route.routes['/'].controller ).to.be.equal('homeController');
				expect( $route.routes['/'].templateUrl ).to.be.equal('../client/views/partials/home.tpl.html');

			});
		});
	});
});
