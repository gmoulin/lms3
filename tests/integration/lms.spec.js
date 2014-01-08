'use strict';

// Use the external Chai As Promised to deal with resolving promises in expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use( chaiAsPromised );
var expect = chai.expect;
var fs = require('fs'); //for screenshots

// abstract writing screen shot to a file
var writeScreenShot = function( data, filename ){
	var stream = fs.createWriteStream( filename );
	stream.write( buf = new Buffer(data, 'base64') );
	stream.end();
};

describe("Integration: lms", function(){
	describe('home', function(){
		beforeEach(function(){
			browser.get('/');
		});

		it('should display the home when / is accessed', function(){
			expect( element.all( by.css('.container .part-link') ).count() ).to.eventually.eql( 4 );
			expect( element( by.css('.container .part-link:first-child h1') ).getText() ).to.eventually.eql('Books');
		});

		// within a test:
		browser.takeScreenshot().then(function( png ){
			writeScreenShot(png, 'exception.png');
		});
	});
});
