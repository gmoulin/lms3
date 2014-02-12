'use strict';

var mongoose = require('mongoose'),
	should = require('should');

var Item = require('../../../server/models/item.js')
	, Saga = require('../../../server/models/saga.js')
	, Storage = require('../../../server/models/storage.js')
	, Person = require('../../../server/models/person.js')
;

describe('Items', function(){
	var saga_id, storage_id, author_id;

	before(function( done ){
		mongoose.connect('mongodb://localhost/lms', function(){
			Saga.remove({title: /test/i}, function(){});
			Storage.remove({room: /test/i}, function(){});
			Person.remove({room: /test/i}, function(){});
			Item.remove({title: /test/i}, function( err ){
				if( err ) console.log( err );
				done();
			});
		});
	});

	after(function( done ){
		Saga.remove({title: /test/i}, function(){});
		Storage.remove({room: /test/i}, function(){});
		Person.remove({room: /test/i}, function(){});
		Item.remove({title: /test/i}, function(){});
		mongoose.disconnect( done );
	});

	it('search by title - not found', function( done ){
		Item.find({title: /test/i}, 'title', function( err, items ){
			if( err ) return done( err );
			items.should.be.instanceof( Array ).and.have.lengthOf( 0 );
			done();
		});
	});

	it('create one', function( done ){
		var saga = new Saga({title: 'Test - Honor Harrington', url: 'http://en.wikipedia.org/wiki/Honor_Harrington', rating: 5});
		saga.save(function( err, doc ){
			if( err ) return done( err );
			saga_id = doc._id;
			next();
		});

		var storage = new Storage({room: 'Test - Salon', type: 'Bibliothèque', column: 'E', line: 4});
		storage.save(function( err, doc ){
			if( err ) return done( err );
			storage_id = doc._id;
			next();
		});

		var author = new Person({'name.first': 'David', 'name.last': 'Weber', site: 'http://en.wikipedia.org/wiki/David_Weber', search: 'http://www.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=David%20Weber'});
		author.save(function( err, doc ){
			if( err ) return done( err );
			author_id = doc._id;
			next();
		});

		function next(){
			if( !saga_id || !storage_id || !author_id ){
				return;
			}

			var one = new Item({
				title: 'Test - Ashes of Victory',
				category: 'book',
				type: 'livre',
				genre: ['Military science fiction'],
				saga: saga_id,
				rating: 5,
				storage: storage_id
			});
			one.book.author.push({ _id: author_id });

			one.save(function( err, item ){
				if( err ) return done( err );
				should.exists( item );
				item.should.be.instanceof( Object );
				item.title.should.equal('Test - Ashes of Victory');
				item.category.should.equal('book');
				item.type.should.equal('livre');
				item.genre.should.be.instanceof( Array ).and.have.lengthOf( 1 );
				item.genre[ 0 ].should.equal('Military science fiction');
				item.rating.should.eql( 5 );
				item.saga.should.equal( saga_id );
				item.storage.should.equal( storage_id );
				item.book.author.should.be.instanceof( Array ).and.have.lengthOf( 1 );
				item.book.author[ 0 ].should.equal( author_id );
				done();
			});
		}
	});

	it('search by title', function( done ){
		Item.findOne({title: /test/i})
			.populate('saga storage book.author')
			.exec(function( err, item ){
				if( err ) return done( err );
				should.exists( item );
				item.should.be.instanceof( Object );
				item.title.should.equal('Test - Ashes of Victory');
				item.category.should.equal('book');
				item.type.should.equal('livre');
				item.book.author.should.be.instanceof( Array ).and.have.lengthOf( 1 );
				item.genre[ 0 ].should.equal('Military science fiction');
				item.rating.should.eql( 5 );

				item.saga.title.should.equal('Test - Honor Harrington');
				item.saga.url.should.equal('http://en.wikipedia.org/wiki/Honor_Harrington');
				item.saga.rating.should.eql( 5 );

				item.storage.room.should.equal('Test - Salon');
				item.storage.type.should.equal('Bibliothèque');
				item.storage.column.should.equal('E');
				item.storage.line.should.eql( 4 );

				item.book.author.should.be.instanceof( Array ).and.have.lengthOf( 1 );
				item.book.author[ 0 ].name.first.should.equal('David');
				item.book.author[ 0 ].name.full.should.equal('David Weber');
				item.book.author[ 0 ].site.should.equal('http://en.wikipedia.org/wiki/David_Weber');
				item.book.author[ 0 ].search.should.equal('http://www.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=David%20Weber');

				done();
			});
	});

	it('validate base', function( done ){
		var test = new Item({
			title: '',
			category: 'toto',
			type: 'livre',
			genre: ['Military science fiction'],
			saga: saga_id,
			rating: 5,
			storage: storage_id,
			book: {
				author: [ author_id ]
			}
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('title');
			err.errors.title.type.should.equal('required');
			err.errors.should.have.property('category');
			err.errors.category.type.should.equal('enum');
			done();
		});
	});

	it('validate type', function( done ){
		var test = new Item({
			title: 'Test 2',
			category: 'book',
			type: 'bottle',
			genre: ['Military science fiction'],
			saga: saga_id,
			rating: 5,
			storage: storage_id,
			book: {
				author: [ author_id ]
			}
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('type');
			err.errors.type.message.should.equal('Type non valide.');
			done();
		});
	});

	it('validate book', function( done ){
		var test = new Item({
			title: 'Test 3',
			category: 'book',
			type: 'livre',
			genre: ['Military science fiction'],
			saga: saga_id,
			rating: 5,
			storage: storage_id
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('book.author');
			done();
		});
	});

	it('validate movie', function( done ){
		var test = new Item({
			title: 'Test 4',
			category: 'movie',
			type: 'DVD',
			genre: ['Military science fiction'],
			saga: saga_id,
			rating: 5,
			storage: storage_id
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('movie.artist');
			err.errors.should.have.property('movie.director');
			done();
		});
	});

	it('validate alcohol', function( done ){
		var test = new Item({
			title: 'Test 4',
			category: 'alcohol',
			type: 'bottle',
			genre: ['Military science fiction'],
			rating: 5,
			storage: storage_id
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('alcohol.maker');
			done();
		});
	});

	it('validate album', function( done ){
		var test = new Item({
			title: 'Test 4',
			category: 'album',
			type: 'mp3',
			genre: ['Military science fiction'],
			rating: 5,
			storage: storage_id
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('album.band');
			done();
		});
	});

	it('validate tvshow', function( done ){
		var test = new Item({
			title: 'Test 4',
			category: 'tvshow',
			type: 'file',
			genre: ['Military science fiction'],
			rating: 5,
			storage: storage_id
		});
		test.save(function( err, item ){
			should.exists( err );
			err.errors.should.have.property('tvshow.artist');
			done();
		});
	});

	it('unicity', function( done ){
		var test = new Item({
			title: 'Test - Ashes of Victory',
			category: 'book',
			type: 'livre',
			genre: ['Military science fiction'],
			saga: saga_id,
			rating: 5,
			storage: storage_id
		});
		test.book.author.push({ _id: author_id });

		test.save(function( err, item ){
			should.exists( err );
			err.code.should.equal( 11000 );
			done();
		});
	});
});

