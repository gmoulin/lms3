'use strict';

var Item = require('../models/item.js')
	, Saga = require('../models/saga.js')
	, Storage = require('../models/storage.js')
	, Person = require('../models/person.js')
;


exports.create = function( req, res ){
	var type = req.params.itemType
		, item = req.body
	;

	console.log('Adding '+ itemType +': '+ JSON.stringify( item ));

	switch( type ){
		case 'book':
			new Item( item ).save(function( err, item ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				} else {
					res.send( item );
				}
			});
			break;
		case 'saga':
			new Saga( item ).save(function( err, saga ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				} else {
					res.send( saga );
				}
			});
			break;
		default:
			res.status( 418 ).send({error: true, msg: 'Unknown type', desc: null});
			break;
	}
};

exports.update = function( req, res ){
	var type = req.params.itemType
		, id = req.params.id
		, body = req.body
	;

	console.log('Updating '+ type +' - '+ id +': '+ JSON.stringify( body ));

	switch( type ){
		case 'book':
			Item.findById( id, function( err, item ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				}

				item = _.merge(item, body);

				item.save(function( err, item ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send( item );
					}
				});
			});
			break;
		case 'saga':
			Saga.findById( id, function( err, saga ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				}

				saga = _.merge(saga, body);

				saga.save(function( err, saga ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send( saga );
					}
				});
			});
			break;
		default:
			res.status( 418 ).send({error: true, msg: 'Unknown type', desc: null});
			break;
	}
};

exports.delete = function( req, res ){
	var type = req.params.itemType
		, id = req.params.id
	;

	console.log('Deleting '+ type +' - '+ id);

	switch( type ){
		case 'book':
			Item.findById( id, function( err, item ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				}

				item.delete(function( err ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send('ok');
					}
				});
			});
			break;
		case 'saga':
			Saga.findById( id, function( err, saga ){
				if( err ){
					res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
				}

				saga.delete(function( err ){
					if( err ){
						res.status( 418 ).send({error: true, msg: 'An error has occurred', desc: err});
					} else {
						res.send('ok');
					}
				});
			});
			break;
		default:
			res.status( 418 ).send({error: true, msg: 'Unknown type', desc: null});
			break;
	}
};

