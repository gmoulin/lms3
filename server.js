/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	//, media = require('./server/media')
;

var app = express();

// all environments
app
	.set( 'port', process.env.PORT || 3000 )
	.set( 'views', path.join(__dirname, 'public') )
	.set( 'view options', {layout: false} )
	.use( express.favicon() )
	.use( express.logger('dev') )
	.use( express.bodyParser() )
	.use( express.methodOverride() )
	.use( app.router )
	.use( express['static']( path.join(__dirname, 'public') ) )
;

app.configure(process.env.ENV || 'development', function(){
	'use strict';
	app.use( express.errorHandler() );
});

//routes
app.get('/', function(req, res){
	'use strict';
	res.sendfile( path.join(__dirname, 'public', 'index.html') );
});

http.createServer( app ).listen(app.get('port'), function(){
	'use strict';
	console.log('Express server listening on port ' + app.get('port'));
});
