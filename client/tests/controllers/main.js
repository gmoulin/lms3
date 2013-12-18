'use strict';
var request = require('superagent')
	, expect = require('expect.js')
;

describe('Controller: MainCtrl', function(){
	// load the controller's module
	beforeEach( module('LMS3') );

	var MainCtrl
		, scope
		, $httpBackend
	;

	// Initialize the controller and a mock scope
	beforeEach( inject(function( _$httpBackend_, $controller, $rootScope ){
		//mock response
		$httpBackend = _$httpBackend_;
		$httpBackend
			.expectGET('/api/awesomeThings')
			.respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express'])
		;

		scope = $rootScope.$new();
		MainCtrl = $controller('MainCtrl', {
			$scope: scope
		});
	}));

	it('should attach a list of awesomeThings to the scope', function(){
		expect( scope.awesomeThings ).to.be( undefined );
		$httpBackend.flush();
		expect( scope.awesomeThings.length ).to.be( 4 );
	});
});
