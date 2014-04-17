'use strict';

/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, path = require('path')
	//, media = require('./server/media')
;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lms');

var app = express();

var csrfValue = function( req ){
	var token = (req.body && req.body._csrf)
		|| (req.query && req.query._csrf)
		|| req.headers['x-csrf-token']
		|| req.headers['x-xsrf-token']
	;
	return token;
};

// all environments
app
	.set( 'port', process.env.PORT || 3001 )
	.set( 'views', path.join(__dirname, 'public') )
	.set( 'view options', {layout: false} )
	.use( express.favicon() )
	.use( express.logger('dev') )
	.use( express.bodyParser() )
	.use( express.methodOverride() )
	.use( app.router )
	.use( express.static( path.join(__dirname, 'public') ) )
	.use( express.cookieParser('lms3_4_fun') )
	.use( express.cookieSession() )
	.use( express.csrf({value: csrfValue}) )
	.use(function( req, res, next ){
		res.cookie('XSRF-TOKEN', req.csrfToken());
		next();
	})
	.disable( 'x-powered-by' ) //no app framework display in responses header
	.use( express.session({
		secret: '1m5e',
		key: 'sessionId',
		cookie: {
			httpOnly: true,
			secure: true
		}
	}) )
;

app.configure(process.env.ENV || 'development', function(){
	app.use( express.errorHandler() );
});

// angular routes
var ngIndex = function(req, res){
	res.sendfile( path.join(__dirname, 'public', 'index.html') );
};

//mirrors angular routes
app.get('/', ngIndex);
app.get('/home', ngIndex);
app.get('/list/:category?', ngIndex);
app.get('/detail/:id/:category/:title?', ngIndex);

// rest
var lists = require('./server/routes/list.js')
	, details = require('./server/routes/detail.js')
	, forms = require('./server/routes/form.js')
	, list_types = ['books', 'items']
	, types = ['book', 'saga']
;

app.get('/rest/:itemType('+ list_types.join('|') +')', lists.findAll);
app.get('/rest/:itemType('+ types.join('|') +')/:id', details.find);
app.get('/rest/:itemType('+ types.join('|') +')/:id/:op', forms.actionById);

http.createServer( app ).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
