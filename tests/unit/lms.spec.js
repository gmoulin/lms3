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

		it('should have ngResource as a dependency', function(){
			expect( hasModule('ngResource') ).to.be.true;
		});

		it('should have ngSanitize as a dependency', function(){
			expect( hasModule('ngSanitize') ).to.be.true;
		});

		it('should have lms.templates as a dependency', function(){
			expect( hasModule('lms.templates') ).to.be.true;
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

		it('should have lms.directives as a dependency', function(){
			expect( hasModule('lms.directives') ).to.be.true;
		});

		it('should have lms.services as a dependency', function(){
			expect( hasModule('lms.services') ).to.be.true;
		});

		it('should have 6 dependencies', function(){
			expect( deps ).to.have.length( 9 );
		});
	});

	describe('mapping', function(){
		it('should map routes to controllers and templates', function(){
			module('lms');

			inject(function( $route ){
				expect( $route.routes['/home'].controller ).to.equal('home');
				expect( $route.routes['/home'].templateUrl ).to.equal('partials/home.tpl.html');

				expect( $route.routes['/list/:category?'].controller ).to.equal('list');
				expect( $route.routes['/list/:category?'].templateUrl ).to.equal('partials/list.tpl.html');

				expect( $route.routes['/detail/:id/:category/:title?'].controller ).to.equal('detail');
				expect( $route.routes['/detail/:id/:category/:title?'].templateUrl ).to.equal('partials/detail.tpl.html');
			});
		});
	});
});
