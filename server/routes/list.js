'use strict';

var Item = require('../models/item.js')
	//, Saga = require('./saga.js')
	//, Storage = require('./storage.js')
	, Person = require('../models/person.js')
;

exports.findAll = function( req, res ){
	var type = req.params.itemType.replace(/s$/, '');
	Item.find({ category: type })
		.populate({ path: 'saga', model: 'Saga' })
		.populate({ path: 'storage', model: 'Storage' })
		.populate({ path: 'book.author', model: 'Person' })
		.exec(function( err, items ){
			if( err ){
				res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
			} else {
				res.send( items );
			}
		})
	;
};

exports.find = function( req, res ){
	Item.findOne({_id: req.params.id}, function( err, item ){
		if( err ){
			res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
		} else {
			res.send( item );
		}
	});
};

exports.actionAll = function( req, res ){
	res.send(['action '+ req.params.op +' on all '+ req.params.itemType]);
};

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
