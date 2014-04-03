'use strict';

var mongoose = require('mongoose')
	, validator = require('validator')
	, Schema = mongoose.Schema
	, ObjectIdSchema = Schema.ObjectId
	, ObjectId = mongoose.Types.ObjectId
;

//TODO remove comments from import

var personSchema = new Schema({
	_id: {type: ObjectIdSchema, default: function(){ return new ObjectId(); }},
	name: {
		first: String,
		last: String
	},
	site: String,
	search: String,
	lastCheckDate: {type: Date, default: Date.now()}
});

personSchema.virtual('name.full').get(function(){
	return this.name.first + (this.name.first.length > 0 ? ' ' : '') + this.name.last;
});

personSchema.path('name.first').validate(function(){
	return (typeof this.name.first == 'string' && this.name.first.length > 0) || (typeof this.name.last == 'string' && this.name.last.length > 0);
}, 'Nom requis.');

personSchema.path('site').validate(function( site ){
	return validator.isURL( site );
}, 'Url invalide.');

personSchema.path('search').validate(function( search ){
	return validator.isURL( search );
}, 'Url invalide.');

module.exports = mongoose.model('Person', personSchema);
