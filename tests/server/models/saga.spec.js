'use strict';

var mongoose = require('mongoose'),
	should = require('should');

var Saga = require('../../../server/models/saga.js');

describe('Sagas', function(){
	before(function( done ){
		mongoose.connect('mongodb://localhost/lms', function(){
			Saga.remove({title: /test/i}, function( err ){
				if( err ) console.log( err );
				done();
			});
		});
	});

	after(function( done ){
		Saga.remove({title: /test/i}, function( err ){
			if( err ) console.log( err );
		});
		mongoose.disconnect( done );
	});

	it('search by title - not found', function( done ){
		Saga.find({title: /test/i}, 'title', function( err, sagas ){
			if( err ) return done( err );
			sagas.should.be.instanceof( Array ).and.have.lengthOf( 0 );
			done();
		});
	});


	it('create one', function( done ){
		var one = new Saga({title: 'test', url: 'http://saga.test.com/', lastCheckDate: Date.now(), rating: 1});

		one.save(function( err, saga ){
			if( err ) return done( err );
			should.exists( saga );
			saga.should.be.instanceof( Object );
			saga.title.should.equal('test');
			saga.url.should.equal('http://saga.test.com/');
			saga.rating.should.eql( 1 );
			done();
		});
	});

	it('search by title', function( done ){
		Saga.findOne({title: /test/i}, 'title url lastCheckDate rating', function( err, saga ){
			if( err ) return done( err );
			should.exists( saga );
			saga.should.be.instanceof( Object );
			saga.title.should.equal('test');
			saga.url.should.equal('http://saga.test.com/');
			saga.rating.should.eql( 1 );
			done();
		});
	});

	it('validate', function( done ){
		var test = new Saga({title: '', url: 'http://saga.test.com /', lastCheckDate: Date.now(), rating: 6});
		test.save(function( err, saga ){
			should.exists( err );
			err.errors.should.have.property('title');
			err.errors.title.type.should.equal('required');
			err.errors.should.have.property('url');
			err.errors.url.message.should.equal('Url invalide.');
			err.errors.should.have.property('rating');
			err.errors.rating.type.should.equal('max');
			done();
		});
	});

	it('unicity', function( done ){
		var test = new Saga({title: 'test', url: 'http://saga.test.com/', lastCheckDate: Date.now(), rating: 5});
		test.save(function( err, saga ){
			should.exists( err );
			err.code.should.equal( 11000 );
			done();
		});
	});
});
