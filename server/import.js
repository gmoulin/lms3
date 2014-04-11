'use strict';

/**
 * Module dependencies.
 */

var mysql = require('mysql')
	, mongoose = require('mongoose')
	, async = require('async')
	, Saga = require('./models/saga.js')
	, Storage = require('./models/storage.js')
	, Person = require('./models/person.js')
	, Item = require('./models/item.js')
	, mapping = {
		sagas: {},
		storages: {},
		artists: {},
		authors: {},
		bands: {},
		albums_bands: {},
		books_authors: {},
		movies_artists: {}
	}
;
mongoose.connect('mongodb://localhost/lms');

var connection =  mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password: 'toor',
	database: 'lms'
});

connection.connect(function( err ){
	if( err ){
		throw err;
	}
});

function truncateSaga( callback ){
	console.log('truncateSaga');
	Saga.collection.drop();
	Saga = require('./models/saga.js');
	callback();
}

function manageSagas( callback ){
	console.log('manageSagas');
	connection.query('SELECT * FROM saga', function( err, rows ){
		if( err ){
			console.log('manageSagas', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Saga.find({ title: row.sagaTitle }, function( err, docs ){
						if( err ){
							console.log('manageSagas', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//saga known
							mapping.sagas[ row.sagaID ] = docs[ 0 ]._id;

							return cb();

						} else {
							var tmp = {
								title: row.sagaTitle,
								url: row.sagaSearchURL || 'http://google.com/#q='+ row.sagaTitle.replace(/ /g, '%20')
							};

							if( row.sagaLastCheckDate ){
								tmp.lastCheckDate = row.sagaLastCheckDate;
							}

							var s = new Saga( tmp );

							s.save(function( err, s ){
								if( err ){
									console.log('manageSagas', err);
									return cb( err );
								}

								mapping.sagas[ row.sagaID ] = s._id;

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('saga async each done');
					if( err ){
						console.log('manageSagas', err);
						return callback( err );
					}

					Saga.find({}, function( err, docs ){
						if( err ){
							console.log('manageSagas', err);
							return callback( err );
						}
						console.log('saga', 'mysql', rows.length, 'mapping', Object.keys( mapping.sagas ).length, 'mongo', docs.length);

						//sagas import done
						return callback();
					});
				}
			);
		}
	});
};

function truncateStorage( callback ){
	console.log('truncateStorage');
	Storage.collection.drop();
	Storage = require('./models/storage.js');
	callback();
}

function manageStorages( callback ){
	console.log('manageStorages');
	connection.query('SELECT * FROM storage', function( err, rows ){
		if( err ){
			console.log('manageStorages', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Storage.find({ room: row.storageRoom, type: row.storageType, column: row.storageColumn, line: row.storageLine }, function( err, docs ){
						if( err ){
							console.log('manageStorages', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//storage known
							mapping.storages[ row.storageID ] = docs[ 0 ]._id;

							return cb();

						} else {
							var s = new Storage({
								room: row.storageRoom,
								type: row.storageType,
								column: row.storageColumn || '',
								line: row.storageLine || 0
							});

							s.save(function( err, s ){
								if( err ){
									console.log('manageStorages', err);
									return cb( err );
								}

								mapping.storages[ row.storageID ] = s._id;

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('storage async each done');
					if( err ){
						console.log('manageStorages', err);
						return callback( err );
					}

					Storage.find({}, function( err, docs ){
						if( err ){
							return callback( err );
						}
						console.log('storage', 'mysql', rows.length, 'mapping', Object.keys( mapping.storages ).length, 'mongo', docs.length);

						//storages import done
						return callback();
					});
				}
			);
		}
	});
};

function truncatePersons( callback ){
	console.log('truncatePersons');
	Person.collection.drop();
	Person = require('./models/person.js');

	//add a flagged person
	var s = new Person({
		'name.first': 'not',
		'name.last': 'ok',
		site: 'http://google.com/#q=',
		search: 'http://google.com/#q='
	});

	s.save(function( err, s ){
		if( err ){
			console.log('truncatePersons', err);
			return callback( err );
		}

		mapping.artists['-1'] = s._id;
		mapping.authors['-1'] = s._id;
		mapping.bands['-1'] = s._id;

		return callback();
	});
}

function manageArtists( callback ){
	console.log('manageArtists');
	connection.query('SELECT * FROM artist', function( err, rows ){
		if( err ){
			console.log('manageArtists', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Person.find({ 'name.first': row.artistFirstName, 'name.last': row.artistLastName }, function( err, docs ){
						if( err ){
							console.log('manageArtists', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//artist known
							mapping.artists[ row.artistID ] = docs[ 0 ]._id;

							return cb();

						} else {
							var s = new Person({
								'name.first': row.artistFirstName,
								'name.last': row.artistLastName,
								site: 'http://google.com/#q='+ row.artistFirstName.replace(/ /g, '%20') +'%20'+ row.artistLastName.replace(/ /g, '%20'),
								search: 'http://google.com/#q='+ row.artistFirstName.replace(/ /g, '%20') +'%20'+ row.artistLastName.replace(/ /g, '%20')
							});

							s.save(function( err, s ){
								if( err ){
									console.log('manageArtists', err);
									return cb( err );
								}

								mapping.artists[ row.artistID ] = s._id;

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('artist async each done');
					if( err ){
						console.log('manageArtists', err);
						return callback( err );
					}

					Person.find({}, function( err, docs ){
						if( err ){
							console.log('manageArtists', err);
							return callback( err );
						}
						console.log('artist', 'mysql', rows.length, 'mapping', Object.keys( mapping.artists ).length, 'mongo', docs.length);

						//artists import done
						return callback();
					});
				}
			);
		}
	});
};

function manageAuthors( callback ){
	console.log('manageAuthors');
	connection.query('SELECT * FROM author', function( err, rows ){
		if( err ){
			console.log('manageAuthors', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Person.find({ 'name.first': row.authorFirstName, 'name.last': row.authorLastName }, function( err, docs ){
						if( err ){
							console.log('manageAuthors', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//author known
							mapping.authors[ row.authorID ] = docs[ 0 ]._id;

							return cb();

						} else {
							var s = new Person({
								'name.first': row.authorFirstName,
								'name.last': row.authorLastName,
								site: row.authorWebSite || 'http://google.com/#q='+ row.authorFirstName.replace(/ /g, '%20') +'%20'+ row.authorLastName.replace(/ /g, '%20'),
								search: row.authorSearchURL || 'http://google.com/#q='+ row.authorFirstName.replace(/ /g, '%20') +'%20'+ row.authorLastName.replace(/ /g, '%20')
							});

							s.save(function( err, s ){
								if( err ){
									console.log('manageAuthors', err);
									return cb( err );
								}

								mapping.authors[ row.authorID ] = s._id;

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('author async each done');
					if( err ){
						console.log('manageAuthors', err);
						return callback( err );
					}

					Person.find({}, function( err, docs ){
						if( err ){
							console.log('manageAuthors', err);
							return callback( err );
						}
						console.log('author', 'mysql', rows.length, 'mapping', Object.keys( mapping.authors ).length, 'mongo', docs.length);

						//authors import done
						return callback();
					});
				}
			);
		}
	});
};

function manageBands( callback ){
	console.log('manageBands');
	connection.query('SELECT * FROM band', function( err, rows ){
		if( err ){
			console.log('manageBands', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Person.find({ 'name.first': row.bandFirstName, 'name.last': row.bandLastName }, function( err, docs ){
						if( err ){
							console.log('manageBands', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//band known
							mapping.bands[ row.bandID ] = docs[ 0 ]._id;

							return cb();

						} else {
							var tmp = {
								'name.last': row.bandName,
								site: row.bandWebSite || 'http://google.com/#q='+ row.bandName.replace(/ /g, '%20'),
								search: 'http://google.com/#q='+ row.bandName.replace(/ /g, '%20')
							};

							if( row.bandLastCheckDate ){
								tmp.lastCheckDate = row.bandLastCheckDate;
							}

							var s = new Person( tmp );

							s.save(function( err, s ){
								if( err ){
									console.log('manageBands', err);
									return cb( err );
								}

								mapping.bands[ row.bandID ] = s._id;

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('band async each done');
					if( err ){
						console.log('manageBands', err);
						return callback( err );
					}

					Person.find({}, function( err, docs ){
						if( err ){
							console.log('manageBands', err);
							return callback( err );
						}
						console.log('band', 'mysql', rows.length, 'mapping', Object.keys( mapping.bands ).length, 'mongo', docs.length);

						//bands import done
						return callback();
					});
				}
			);
		}
	});
}

function truncateItems( callback ){
	console.log('truncateItems');
	Item.collection.drop();
	Item = require('./models/item.js');
	callback();
}

function albumsBandsLinks( callback ){
	console.log('albumsBandsLinks');
	connection.query('SELECT * FROM album_bands_view', function( err, rows ){
		if( err ){
			console.log('albumsBandsLinks', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					if( !mapping.albums_bands.hasOwnProperty( row.albumFK ) ){
						mapping.albums_bands[ row.albumFK ] = [];
					}
					mapping.albums_bands[ row.albumFK ].push({ _id: mapping.bands[ row.bandID ] });

					return cb();
				},
				function( err ){
					console.log('album band links async each done');
					if( err ){
						console.log('albumsBandsLinks', err);
						return callback( err );
					}

					//album band links gathered
					return callback();
				}
			);
		}
	});
}

function moviesArtistsLinks( callback ){
	console.log('moviesArtistsLinks');
	connection.query('SELECT * FROM movie_artists_view', function( err, rows ){
		if( err ){
			console.log('moviesArtistsLinks', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					if( !mapping.movies_artists.hasOwnProperty( row.movieFK ) ){
						mapping.movies_artists[ row.movieFK ] = [];
					}
					mapping.movies_artists[ row.movieFK ].push({ _id: mapping.artists[ row.artistID ] });

					return cb();
				},
				function( err ){
					console.log('movie artist links async each done');
					if( err ){
						console.log('moviesArtistsLinks', err);
						return callback( err );
					}

					//movie artist links gathered
					return callback();
				}
			);
		}
	});
}

function booksAuthorsLinks( callback ){
	console.log('booksAuthorsLinks');
	connection.query('SELECT * FROM book_authors_view', function( err, rows ){
		if( err ){
			console.log('booksAuthorsLinks', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					if( !mapping.books_authors.hasOwnProperty( row.bookFK ) ){
						mapping.books_authors[ row.bookFK ] = [];
					}
					mapping.books_authors[ row.bookFK ].push({ _id: mapping.authors[ row.authorID ] });

					return cb();
				},
				function( err ){
					console.log('book author links async each done');
					if( err ){
						console.log('booksAuthorsLinks', err);
						return callback( err );
					}

					//book author links gathered
					return callback();
				}
			);
		}
	});
}

function manageAlbums( callback ){
	console.log('manageAlbums');
	connection.query('SELECT * FROM albums_view', function( err, rows ){
		if( err ){
			console.log('manageAlbums', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Item.find({ title: row.albumTitle, category: 'album', type: 'mp3' }, function( err, docs ){
						if( err ){
							console.log('manageAlbums', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//do nothing

							return cb();

						} else {
							var tmp = {
								title: row.albumTitle,
								category: 'album',
								type: 'mp3',
								genre: ['ko'],
								search: 'http://google.com/#q='+ row.albumTitle.replace(/ /g, '%20'),
								year: (new Date( row.albumDate )).getFullYear(),
								album: {
									band: mapping.albums_bands[ row.albumID ]
								}
							};

							if( row.loanID ){
								tmp.loan = {
									date: row.loanDate,
									name: row.loanHolder
								};
							}

							if( row.storageID ){
								tmp.storage = mapping.storages[ row.storageID ];
							}

							var s = new Item( tmp );

							s.save(function( err, s ){
								if( err ){
									console.log('manageAlbums', err);
									return cb( err );
								}

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('album async each done');
					if( err ){
						console.log('manageAlbums', err);
						return callback( err );
					}

					Item.find({category: 'album'}, function( err, docs ){
						if( err ){
							console.log('manageAlbums', err);
							return callback( err );
						}
						console.log('album', 'mysql', rows.length, 'mongo', docs.length);

						//albums import done
						return callback();
					});
				}
			);
		}
	});
}

function manageBooks( callback ){
	console.log('manageBooks');
	connection.query('SELECT * FROM books_view', function( err, rows ){
		if( err ){
			console.log('manageBooks', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					if( row.bookSize != 'mp3' ){
						row.bookSize = 'paper';
					}

					Item.find({ title: row.bookTitle, category: 'book', type: row.bookSize }, function( err, docs ){
						if( err ){
							console.log('manageBooks', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//do nothing

							return cb();

						} else {
							var tmp = {
								title: row.bookTitle,
								category: 'book',
								type: row.bookSize,
								genre: ['ko'],
								search: 'http://google.com/#q='+ row.bookTitle.replace(/ /g, '%20'),
								book: {
									author: mapping.books_authors[ row.bookID ]
								}
							};

							if( row.sagaID ){
								tmp.saga = mapping.sagas[ row.sagaID ];
								tmp.sagaPosition = row.bookSagaPosition;
							}

							if( row.loanID ){
								tmp.loan = {
									date: row.loanDate,
									name: row.loanHolder
								};
							}

							if( row.storageID ){
								tmp.storage = mapping.storages[ row.storageID ];
							}

							var s = new Item( tmp );

							s.save(function( err, s ){
								if( err ){
									console.log('manageBooks', err);
									return cb( err );
								}

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('book async each done');
					if( err ){
						console.log('manageBooks', err);
						return callback( err );
					}

					Item.find({category: 'book'}, function( err, docs ){
						if( err ){
							console.log('manageBooks', err);
							return callback( err );
						}
						console.log('book', 'mysql', rows.length, 'mongo', docs.length);

						//books import done
						return callback();
					});
				}
			);
		}
	});
}

function manageMovies( callback ){
	console.log('manageMovies');
	connection.query('SELECT * FROM movies_view', function( err, rows ){
		if( err ){
			console.log('manageMovies', err);
			return callback( err );

		} else {
			async.each(
				rows,
				function( row, cb ){
					Item.find({ title: row.movieTitle, category: 'movie', type: row.movieMediaType }, function( err, docs ){
						if( err ){
							console.log('manageMovies', err);
							return cb( err );
						}

						if( docs && docs.length === 1 ){
							//do nothing

							return cb();

						} else {
							var tmp = {
								title: row.movieTitle,
								category: 'movie',
								type: row.movieMediaType,
								genre: ['ko'],
								search: 'http://google.com/#q='+ row.movieTitle.replace(/ /g, '%20'),
								movie: {
									artist: mapping.movies_artists[ row.movieID ],
									director: mapping.artists['-1'] //flagged person, director is a new data
								}
							};

							if( row.sagaID ){
								tmp.saga = mapping.sagas[ row.sagaID ];
								tmp.sagaPosition = row.movieSagaPosition;
							}

							if( row.loanID ){
								tmp.loan = {
									date: row.loanDate,
									name: row.loanHolder
								};
							}

							if( row.storageID ){
								tmp.storage = mapping.storages[ row.storageID ];
							}

							var s = new Item( tmp );

							s.save(function( err, s ){
								if( err ){
									console.log('manageMovies', err);
									return cb( err );
								}

								return cb();
							});
						}
					});
				},
				function( err ){
					console.log('book async each done');
					if( err ){
						console.log('manageMovies', err);
						return callback( err );
					}

					Item.find({category: 'movie'}, function( err, docs ){
						if( err ){
							console.log('manageMovies', err);
							return callback( err );
						}
						console.log('movie', 'mysql', rows.length, 'mongo', docs.length);

						//books import done
						return callback();
					});
				}
			);
		}
	});
}

async.series({
	truncates: function( next ){
		console.log('truncates');
		async
			.parallel(
				[
					function( callback ){
						console.log('parallel truncateSaga');
						truncateSaga( callback );
					}
					, function( callback ){
						console.log('parallel truncateStorage');
						truncateStorage( callback );
					}
					, function( callback ){
						console.log('parallel truncatePersons');
						truncatePersons( callback );
					}
					, function( callback ){
						console.log('parallel truncateItems');
						truncateItems( callback );
					}
				]
				, function( err ){
					console.log('truncates parallel done');
					if( err ){
						return next( err );
					}

					return next();
				}
			)
		;
	},
	importSubs: function( next ){
		console.log('importSubs');
		async
			.parallel(
				[
					function( callback ){
						console.log('parallel manageSagas');
						manageSagas( callback );
					}
					, function( callback ){
						console.log('parallel manageStorages');
						manageStorages( callback );
					}
					, function( callback ){
						console.log('parallel manageArtists');
						manageArtists( callback );
					}
					, function( callback ){
						console.log('parallel manageAuthors');
						manageAuthors( callback );
					}
					, function( callback ){
						console.log('parallel manageBands');
						manageBands( callback );
					}
				]
				, function( err ){
					console.log('importSubs parallel done');
					if( err ){
						return next( err );
					}

					return next();
				}
			)
		;
	},
	gatherLinks: function( next ){
		console.log('gatherLinks');
		async
			.parallel(
				[
					function( callback ){
						console.log('parallel albumsBandsLinks');
						albumsBandsLinks( callback );
					}
					, function( callback ){
						console.log('parallel booksAuthorsLinks');
						booksAuthorsLinks( callback );
					}
					, function( callback ){
						console.log('parallel moviesArtistsLinks');
						moviesArtistsLinks( callback );
					}
				]
				, function( err ){
					console.log('gatherLinks parallel done');
					if( err ){
						return next( err );
					}

					return next();
				}
			)
		;
	},
	importItems: function( next ){
		console.log('importItems');
		async
			.parallel(
				[
					function( callback ){
						console.log('parallel manageAlbums');
						manageAlbums( callback );
					}
					, function( callback ){
						console.log('parallel manageBooks');
						manageBooks( callback );
					}
					, function( callback ){
						console.log('parallel manageMovies');
						manageMovies( callback );
					}
				]
				, function( err ){
					console.log('importItems parallel done');
					if( err ){
						return next( err );
					}

					return next();
				}
			)
		;
	}
}
, function( err ){
	if( err ){
		connection.destroy();
		throw err;
	}

	console.log('series done');
	connection.end(function( err ){
		if( err ){
			throw err;
		}
		//Do something after the connection is gracefully terminated.
	});
});
