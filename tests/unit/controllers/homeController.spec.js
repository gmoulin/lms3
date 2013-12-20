'use strict';

describe('Unit: homeController', function(){
	var $scope
		, hCtrl
	;

	beforeEach(function(){
		module('lms.controllers');
	});

	beforeEach( inject(function( $rootScope, $controller ){
		$scope = $rootScope.new();

		hCtrl = $controller('homeController', {
			$scope: $scope
		});
	}) );

	it('should have parts populated', function(){
		expect( $scope ).to.have.property('parts');
		expect( $scope.parts ).to.be.an('array');
		expect( $scope.parts ).not.to.be.empty();
	});
});
