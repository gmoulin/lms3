'use strict';

var mongoose = require('mongoose')
	, validator = require('validator')
	, Schema = mongoose.Schema
	, ObjectIdSchema = Schema.ObjectId
	, ObjectId = mongoose.Types.ObjectId
;

var refs = { //category: types
	'book': ['CD', 'mp3', 'poche', 'relié'],
	'movie': ['blu-ray', 'DVD', 'file'],
	'TV show': ['blu-ray', 'DVD', 'file'],
	'album': ['mp3'],
	'alcohol': ['bottle']
};
var flattened_refs = Object.keys( refs ).reduce(function( previous, key ){
	return previous.concat( refs[ key ] );
}, []);

var itemSchema = new Schema({
	_id: {type: ObjectIdSchema, default: function(){ return new ObjectId(); }},
	added_date: {type: Date, default: Date.now},
	update_date: {type: Date, default: Date.now},
	title: {type: String, required: true},
	category: {type: String, enum: ['book', 'movie', 'album', 'alcohol', 'TV show'], required: true},
	type: {type: String, enum: flattened_refs, required: true}, //custom validation, book size, movie mediaType
	genre: [{type: String, required: true}],
	saga: {type: ObjectId, ref: 'Saga'},
	loan: {
		date: Date,
		name: String
	},
	rating: {type: Number, min: 0, max: 5, default: 0},
	offeredBy: {
		name: String,
		date: {type: Date, default: Date.now}
	},
	storage: {type: ObjectId, ref: 'Storage'},
	book: {
		author: [{type: ObjectId, ref: 'Person'}]
	},
	movie: {
		artist: [{type: ObjectId, ref: 'Person'}],
		director: [{type: ObjectId, ref: 'Person'}],
		duration: Number //movie length
	},
	alcohol: {
		year: Date, //custom check for alcohols
		maker: [{type: ObjectId, ref: 'Person'}]
	},
	album: {
		year: Number,
		band: [{type: ObjectId, ref: 'Person'}]
	},
	tvshow: {
		artist: [{type: ObjectId, ref: 'Person'}],
		season: [{
			year: Number,
			length: Number,
			complete: Boolean
		}],
		search: String
	}
});

itemSchema.path('type').validate(function( type ){
	var valid = false
		, refs = refs[ this.category ]
		, i, l
	;

	if( type === '' && refs.length === 1 ){
		type = refs[ 0 ];
		return true;
	}

	for( i = 0, l = refs.length; i < l; i++ ){
		if( refs[ i ] === type ){
			valid = true;
			break;
		}
	}

	return valid;
}, 'Type non valide');

itemSchema.path('alcohol.year').validate(function( year ){
	if( this.category === 'alcohols' ){
		if( year !== '' && year > 0 && year <= (new Date()).getFullYear() ){
			return true;
		} else {
			return false;
		}
	}
	return true;
}, 'Année non valide');

itemSchema.index({title: 1, category: 1}, {unique: true});

module.exports = mongoose.model('Item', itemSchema);

