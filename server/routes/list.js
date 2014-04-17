'use strict';

var Item = require('../models/item.js');

exports.findAll = function( req, res ){
	var type = req.params.itemType.replace(/s$/, '')
		, query
	;
	if( type == 'item' ){ //no category, all items
		query = Item.find();
	} else {
		query = Item.find({ category: type });
	}

	query
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
