'use strict';

var mongoose = require('mongoose')
	, validator = require('validator')
	, Schema = mongoose.Schema
	, ObjectIdSchema = Schema.ObjectId
	, ObjectId = mongoose.Types.ObjectId
;

var sagaSchema = new Schema({
	_id: {type: ObjectIdSchema, default: function(){ return new ObjectId(); }},
	title: {type: String, required: true, index: {unique: true, dropDups: true}},
	url: {type: String, required: true},
	lastCheckDate: {type: Date, default: Date.now()},
	rating: {type: Number, min: 0, max: 5}
});

sagaSchema.path('url').validate(function( url ){
	return validator.isURL( url );
}, 'Url invalide.');

module.exports = mongoose.model('Saga', sagaSchema);
