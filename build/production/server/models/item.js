'use strict';

var mongoose = require('mongoose')
	, validator = require('validator')
	, Schema = mongoose.Schema
	, ObjectIdSchema = Schema.ObjectId
	, ObjectId = mongoose.Types.ObjectId
	, Saga = require('./saga.js')
	, Storage = require('./storage.js')
	, Person = require('./person.js')
;

var itemSchema = new Schema({
	_id: {type: ObjectIdSchema, default: function(){ return new ObjectId(); }},
	added_date: {type: Date, default: Date.now},
	update_date: {type: Date, default: Date.now},
	title: {type: String, required: true},
	category: {type: String, enum: ['book', 'movie', 'album', 'alcohol', 'tvshow'], required: true},
	type: {type: String, required: true}, //custom validation, book size, movie mediaType
	genre: [{type: String, required: true}],
	saga: {type: ObjectIdSchema, ref: 'Saga'},
	loan: {
		date: Date,
		name: String
	},
	rating: {type: Number, min: 0, max: 5, default: 0},
	offeredBy: {
		name: String,
		date: {type: Date, default: Date.now}
	},
	storage: {type: ObjectIdSchema, ref: 'Storage', required: true},
	book: {
		author: [{type: ObjectIdSchema, ref: 'Person'}]
	},
	movie: {
		artist: [{type: ObjectIdSchema, ref: 'Person'}],
		director: [{type: ObjectIdSchema, ref: 'Person'}]
	},
	alcohol: {
		year: Date, //custom check for alcohols
		maker: [{type: ObjectIdSchema, ref: 'Person'}]
	},
	album: {
		year: Number,
		band: [{type: ObjectIdSchema, ref: 'Person'}]
	},
	tvshow: {
		artist: [{type: ObjectIdSchema, ref: 'Person'}],
		season: [{
			year: Number,
			length: Number,
			complete: Boolean
		}],
		search: String
	}
});

itemSchema.path('type').validate(function( type ){
	var refs = { //category: types
		'book': ['CD', 'mp3', 'livre'],
		'movie': ['blu-ray', 'DVD', 'file'],
		'TV show': ['blu-ray', 'DVD', 'file'],
		'album': ['mp3'],
		'alcohol': ['bottle']
	};

	if( !refs.hasOwnProperty( this.category ) ){
		return false;
	}

	var valid = false
		, cref = refs[ this.category ]
		, i, l
	;

	if( type === '' && cref.length === 1 ){
		type = cref[ 0 ];
		return true;
	}

	for( i = 0, l = cref.length; i < l; i++ ){
		if( cref[ i ] === type ){
			valid = true;
			break;
		}
	}

	return valid;
}, 'Type non valide.');

itemSchema.path('book.author').validate(function( author ){
	if( author.length === 0 && this.category == 'book' ){
		return false;
	}
	return true;
}, 'Au moins un auteur est requis pour un livre.');

itemSchema.path('movie.artist').validate(function( artist ){
	if( artist.length === 0 && this.category == 'movie' ){
		return false;
	}
	return true;
}, 'Au moins un artiste est requis pour un film.');

itemSchema.path('movie.director').validate(function( director ){
	if( director.length === 0 && this.category == 'movie' ){
		return false;
	}
	return true;
}, 'Au moins un réalisateur est requis pour un film.');

itemSchema.path('alcohol.maker').validate(function( maker ){
	if( maker.length === 0 && this.category == 'alcohol' ){
		return false;
	}
	return true;
}, 'Au moins un fabriquant est requis pour un vin ou spiritueux.');

itemSchema.path('album.band').validate(function( band ){
	if( band.length === 0 && this.category == 'album' ){
		return false;
	}
	return true;
}, 'Au moins un groupe est requis pour un album.');

itemSchema.path('tvshow.artist').validate(function( artist ){
	if( artist.length === 0 && this.category == 'tvshow' ){
		return false;
	}
	return true;
}, 'Au moins un artiste est requis pour une série.');

/*
itemSchema.path('alcohol.year').validate(function( year ){
	if( this.category === 'alcohols' ){
		if( year !== '' && year > 0 && year <= (new Date()).getFullYear() ){
			return true;
		} else {
			return false;
		}
	}
	return true;
}, 'Année non valide.');
*/

itemSchema.index({title: 1, category: 1}, {unique: true});

module.exports = mongoose.model('Item', itemSchema);

