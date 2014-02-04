'use strict';

describe('Unit: home controller', function(){
	beforeEach(function(){
		module('lms.controllers');
		module('lms.filters');
	});

	it('should have parts and groups populated', inject(function( $controller, $rootScope, groupFilter ){
		var scope = $rootScope.$new()
			, ctrl = $controller('home', {$scope: scope, groupFilter: groupFilter})
		;

		expect( scope ).to.have.ownProperty('parts');
		expect( scope.parts ).to.be.an('array');
		expect( scope.parts ).not.to.be.empty;
		expect( scope.parts ).to.have.length( 4 );

		expect( scope ).to.have.ownProperty('groups');
		expect( scope.groups ).to.be.an('array');
		expect( scope.groups ).not.to.be.empty;
		expect( scope.groups ).to.have.length( 2 );
	}) );
});
