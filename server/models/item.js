'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
	_id: ObjectId,
	date: {type: Date, default: Date.now},
	author: {type: String, default: 'Anon'},
	post: String
});

module.exports = mongoose.model('Item', itemSchema);

