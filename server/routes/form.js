'use strict';

var Item = require('../models/item.js')
	, Saga = require('../models/saga.js')
	, Storage = require('../models/storage.js')
	, Person = require('../models/person.js')
;


exports.actionById = function( req, res ){
	var action = req.params.op
		, itemType = req.params.itemType
		, id = req.params.id
		, item
	;

	switch( action ){
		case 'add':
			item = req.body;
			console.log('Adding '+ itemType +': '+ JSON.stringify( item ));
			new Item( item ).save(function( err, item, numberAffected ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				} else {
					res.send( item );
				}
			});

			break;

		case 'update':
			//TODO
			break;

		case 'delete':
			//TODO
			break;

		default:
			res.status( 418 ).send({error: true, msg: 'Unknown action'});
	}
};

