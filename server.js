'use strict';

/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	, favicon = require('static-favicon')
	, bodyParser = require('body-parser')
	, compress = require('compression')
	, cookieParser = require('cookie-parser')
	, session = require('express-session')
	, methodOverride = require('method-override')
	, csrf = require('csurf')
	, logger = require('morgan')
	, errorHandler = require('errorhandler')
	//, media = require('./server/media')
;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lms');

var app = express();

// all environments
app
	.set( 'port', process.env.PORT || 3001 )
	.set( 'views', path.join(__dirname, 'public') )
	.set( 'view options', {layout: false} )
	.use( favicon() )
	.use( logger('dev') )
	.use( bodyParser() )
	.use( methodOverride() )
	.use( express.static( path.join(__dirname, 'public') ) )
	.use( cookieParser() )
	.use( session({ secret: '1m5e', key: 'sessionId', cookie: { secure: true } }) )
	.disable( 'x-powered-by' ) //no app framework display in responses header
;

var env = process.env.ENV || 'development';
if( env == 'development' ){
	app.use( errorHandler() );
}

// angular routes
var ngIndex = function(req, res){
	res.sendfile( path.join(__dirname, 'public', 'index.html') );
};

//mirrors angular routes
app.route('/').get( ngIndex );
app.route('/home').get( ngIndex );
app.route('/list/:category?').get( ngIndex );
app.route('/detail/:id/:category/:title?').get( ngIndex );

// rest
var lists = require('./server/routes/list.js')
	, details = require('./server/routes/detail.js')
	, forms = require('./server/routes/form.js')
	, list_types = ['books', 'items']
	, types = ['book', 'saga']
;

app.route('/rest/:itemType('+ list_types.join('|') +')')
	.get( lists.findAll )
	.post( forms.create )
;

app.route('/rest/:itemType('+ types.join('|') +')/:id')
	.get( details.find )
	.put( forms.update )
	.delete( forms.delete )
;

http.createServer( app ).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
