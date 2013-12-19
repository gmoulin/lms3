var request = require('superagent')
	, expect = require('expect.js')
;

describe('Node server', function(){
	'use strict';

	it('should reply to request', function(){
		request.post('lms.dev').end(function( res ){
			expect( res ).to.exists;
			expect( res.status ).to.equal( 200 );
			expect( res.body.length ).to.be.greaterThan( 200 );
			done(); //finish asynchronous tests
		});
	});
});
