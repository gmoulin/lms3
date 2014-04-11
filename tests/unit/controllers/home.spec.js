'use strict';

describe('Unit: home controller', function(){
	beforeEach(function(){
		module('lms.controllers');
	});

	it('should have parts populated', inject(function( $controller, $rootScope ){
		var scope = $rootScope.$new()
			, ctrl = $controller('home', {$scope: scope})
		;

		expect( scope ).to.have.ownProperty('parts');
		expect( scope.parts ).to.be.an('array');
		expect( scope.parts ).not.to.be.empty;
		expect( scope.parts ).to.have.length( 4 );
	}) );
});
