'use strict';

var mongoose = require('mongoose'),
	should = require('should');


var Person = require('../../../server/models/person.js');

describe('Persons', function(){
	before(function( done ){
		mongoose.connect('mongodb://localhost/lms', done);
	});

	after(function( done ){
		Person.remove({'name.last': 'White'}, function( err ){
			if( err ) console.log( err );
		});
		mongoose.disconnect( done );
	});

	it('search by full name - not found', function( done ){
		Person.find({'name.first': /John/i, 'name.last': /Doe/i}, 'name', function( err, persons ){
			if( err ) return done( err );
			persons.should.be.instanceof( Array ).and.have.lengthOf( 0 );
			done();
		});
	});


	it('create one', function( done ){
		var one = new Person({'name.first': 'Walter', 'name.last': 'White', site: 'http://walter.white.com/', search: 'http://search.com/walter/white/'});

		one.save(function( err, person ){
			if( err ) return done( err );
			should.exists( person );
			person.should.be.instanceof( Object );
			person.name.first.should.equal('Walter');
			person.name.last.should.equal('White');
			person.name.full.should.equal('Walter White');
			person.site.should.equal('http://walter.white.com/');
			person.search.should.equal('http://search.com/walter/white/');
			done();
		});
	});

	it('search by last name', function( done ){
		Person.findOne({'name.last': /White/i}, 'name site search', function( err, person ){
			if( err ) return done( err );
			should.exists( person );
			person.should.be.instanceof( Object );
			person.name.first.should.equal('Walter');
			person.name.last.should.equal('White');
			person.name.full.should.equal('Walter White');
			person.site.should.equal('http://walter.white.com/');
			person.search.should.equal('http://search.com/walter/white/');
			done();
		});
	});

	it('create another', function( done ){
		var another = new Person({'name.first': 'Skyler', 'name.last': 'White', site: 'http://skyler.white.com/', search: 'http://search.com/skyler/white/'});
		another.save(function( err, person ){
			if( err ) return done( err );
			should.exists( person );
			person.should.be.instanceof( Object );
			person.name.first.should.equal('Skyler');
			person.name.last.should.equal('White');
			person.name.full.should.equal('Skyler White');
			person.site.should.equal('http://skyler.white.com/');
			person.search.should.equal('http://search.com/skyler/white/');
			done();
		});
	});

	it('retrieves another', function( done ){
		Person.findOne({'name.first': /Skyler/i}, 'name site search', function( err, person ){
			if( err ) return done( err );
			should.exists( person );
			person.should.be.instanceof( Object );
			person.name.first.should.equal('Skyler');
			person.name.last.should.equal('White');
			person.name.full.should.equal('Skyler White');
			person.site.should.equal('http://skyler.white.com/');
			person.search.should.equal('http://search.com/skyler/white/');
			done();
		});
	});

	it('retrieves both', function( done ){
		Person.find({'name.last': /White/i}).sort('name.first').select('name site search').exec(function( err, persons ){
			if( err ) return done( err );
			should.exists( persons );
			persons.should.be.instanceof( Array ).and.have.lengthOf( 2 );
			persons[0].name.first.should.equal('Skyler');
			persons[0].name.last.should.equal('White');
			persons[0].name.full.should.equal('Skyler White');
			persons[0].site.should.equal('http://skyler.white.com/');
			persons[0].search.should.equal('http://search.com/skyler/white/');
			persons[1].name.first.should.equal('Walter');
			persons[1].name.last.should.equal('White');
			persons[1].name.full.should.equal('Walter White');
			persons[1].site.should.equal('http://walter.white.com/');
			persons[1].search.should.equal('http://search.com/walter/white/');
			done();
		});
	});

	it('validate urls', function( done ){
		var test = new Person({'name.first': 'Junior', 'name.last': 'White', site: '//junior.white.com/', search: 'httpf://search.com,/junior /white/'});
		test.save(function( err, person ){
			should.exists( err );
			err.errors.should.have.property('site');
			err.errors.site.message.should.equal('Url invalide.');
			err.errors.should.have.property('search');
			err.errors.search.message.should.equal('Url invalide.');
			done();
		});
	});
});
