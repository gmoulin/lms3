'use strict';

var mongoose = require('mongoose')
	, should = require('should')
;

var Storage = require('../../../server/models/storage.js');

describe('Storages', function(){
	before(function( done ){
		mongoose.connect('mongodb://localhost/lms', function(){
			Storage.remove({room: /test/i}, function( err ){
				if( err ) console.log( err );
				done();
			});
		});
	});

	after(function( done ){
		Storage.remove({room: /test/i}, function( err ){
			if( err ) console.log( err );
		});
		mongoose.disconnect( done );
	});

	it('search by room - not found', function( done ){
		Storage.find({room: /test/i}, 'room', function( err, storages ){
			if( err ) return done( err );
			storages.should.be.instanceof( Array ).and.have.lengthOf( 0 );
			done();
		});
	});


	it('create one', function( done ){
		var one = new Storage({room: 'test', type: 'bibliothèque', column: 'A', line: 1});

		one.save(function( err, storage ){
			if( err ) return done( err );
			should.exists( storage );
			storage.should.be.instanceof( Object );
			storage.room.should.equal('test');
			storage.type.should.equal('bibliothèque');
			storage.column.should.equal('A');
			storage.line.should.eql( 1 );
			done();
		});
	});

	it('search by room', function( done ){
		Storage.findOne({room: /test/i}, 'room type column line', function( err, storage ){
			if( err ) return done( err );
			should.exists( storage );
			storage.should.be.instanceof( Object );
			storage.room.should.equal('test');
			storage.type.should.equal('bibliothèque');
			storage.column.should.equal('A');
			storage.line.should.eql( 1 );
			done();
		});
	});

	it('validate', function( done ){
		var test = new Storage({room: '', type: 'bibliothèque', column: 'Z', line: 11});
		test.save(function( err, storage ){
			should.exists( err );
			err.errors.should.have.property('room');
			err.errors.room.type.should.equal('required');
			err.errors.should.have.property('column');
			err.errors.column.type.should.equal('enum');
			err.errors.should.have.property('line');
			err.errors.line.type.should.equal('max');
			done();
		});
	});

	it('unicity', function( done ){
		var test = new Storage({room: 'test', type: 'bibliothèque', column: 'A', line: 1});
		test.save(function( err, storage ){
			should.exists( err );
			err.code.should.equal( 11000 );
			done();
		});
	});
});
