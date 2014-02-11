'use strict';

var mongoose = require('mongoose')
	, validator = require('validator')
	, Schema = mongoose.Schema
	, ObjectIdSchema = Schema.ObjectId
	, ObjectId = mongoose.Types.ObjectId
;

var storageSchema = new Schema({
	_id: {type: ObjectIdSchema, default: function(){ return new ObjectId(); }},
	room: {type: String, required: true},
	type: String,
	column: {type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']},
	line: {type: Number, min: 0, max: 10}
});

storageSchema.index({room: 1, type: 1, column: 1, line: 1}, {unique: true});

module.exports = mongoose.model('Storage', storageSchema);

