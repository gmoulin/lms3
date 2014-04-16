'use strict';

var Item = require('../models/item.js')
	, Saga = require('../models/saga.js')
	, Storage = require('../models/storage.js')
	, Person = require('../models/person.js')
;

exports.find = function( req, res ){
	var type = req.params.itemType
		id = req.params.id
	;

	switch( type ){
		case 'book':
			Item.find({ category: type, _id: id })
				.populate({ path: 'saga', model: 'Saga' })
				.populate({ path: 'storage', model: 'Storage' })
				.populate({ path: 'book.author', model: 'Person' })
				.exec(function( err, item ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send( item );
					}
				})
			;
			break;
		case 'saga':
			Saga.find({ _id: id })
				.exec(function( err, saga ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send( saga );
					}
				})
			;
			break;
		default:
			res.status( 418 ).send({error: true, msg: 'Unknown type', desc: null});
			break;
	}
};

