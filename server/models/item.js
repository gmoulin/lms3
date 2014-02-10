'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var refs = { //category: types
	'book': ['CD', 'mp3', 'poche', 'relié'],
	'movie': ['blu-ray', 'DVD', 'file']
};
var flattened_refs = Object.keys( refs ).reduce(function( previous, key ){
	return previous.concat( refs[ key ] );
}, []);

var itemSchema = new Schema({
	_id: ObjectId,
	added_date: {type: Date, default: Date.now},
	update_date: {type: Date, default: Date.now},
	title: {type: String, required: true},
	category: {type: String, enum: ['book'], required: true),
	type: {type: String, enum: flattened_refs, required: true}, //book size, movie mediaType
	genre: [{type: String, required: true}],
	saga: [{
		title: String,
		url: String,
		lastCheckData: Date,
		rating: Number
	}],
	loan: [{
		date: Date,
		name: String
	}],
	duration: Number, //movie length
	year: {type: Date} //custom check for alcohols
});

itemSchema.path('type').validate(function( type ){
	var valid = false
		, refs = refs[ this.category ]
		, i, l
	;

	for( i = 0, l = refs.length; i < l; i++ ){
		if( refs[ i ] == type ){
			valid = true;
			break;
	}

	return valid;
}, 'Type non valide');

module.exports = mongoose.model('Item', itemSchema);

