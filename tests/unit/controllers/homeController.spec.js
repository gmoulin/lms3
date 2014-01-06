'use strict';

describe('Unit: homeController', function(){
	beforeEach( module('lms.controllers') );

	describe('homeController', function(){

		it('should have parts populated', inject(function( $rootScope, $controller ){
			var scope = $rootScope.$new()
				, ctrl = $controller('homeController', {$scope: scope})
			;

			expect( scope ).to.have.property('parts');
			expect( scope.parts ).to.be.an('array');
			expect( scope.parts ).not.to.be.empty();
		}) );
	});
});
