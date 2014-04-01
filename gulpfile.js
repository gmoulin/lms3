var gulp = require('gulp')
	, es = require('event-stream')
	, p = require("gulp-load-tasks")()
	, runSequence = require('run-sequence')
	, spawn = require('child_process').spawn
	, node
	, path = {
		html2js: ['client/views/**/!(index).tpl.html'],
		clientjs: 'client/js/**/*.js',
		serverjs: 'server/**/*.js',
		basejs: ['server.js', 'Gruntfile.js', 'gulpfile.js'],
		todo: ['Gruntfile.js', 'gulpfile.js', 'client/js/**/*.js', 'server.js', 'server/**/*.js', 'tests/**/**/*.js']
	}
	, minify_html_options = {
		empty: true, //needed, else remove things like ng-view ...
		cdata: true,
		comments: false,
		conditionals: true,
		spare: false,
		quotes: true
	}
	, csslint_rules = {
		'important': true,
		'adjoining-classes': false,
		'known-properties': true,
		'box-sizing': true,
		'box-model': true,
		'overqualified-elements': true,
		'display-property-grouping': true,
		'bulletproof-font-face': true,
		'compatible-vendor-prefixes': true,
		'regex-selectors': true,
		'errors': true,
		'duplicate-background-images': true,
		'duplicate-properties': true,
		'empty-rules': true,
		'selector-max-approaching': true,
		'gradients': true,
		'fallback-colors': true,
		'font-sizes': true,
		'font-faces': true,
		'floats': true,
		'star-property-hack': true,
		'outline-none': true,
		'import': true,
		'ids': true,
		'underscore-property-hack': true,
		'rules-count': true,
		'qualified-headings': true,
		'selector-max': true,
		'shorthand': true,
		'text-indent': true,
		'unique-headings': true,
		'universal-selector': true,
		'unqualified-attributes': true,
		'vendor-prefix': true,
		'zero-units': true
	}
;
//require('gulp-grunt')( gulp ); // add all the gruntfile tasks to gulp

gulp.task('clean-dev', function(){
	return gulp
		.src([
			'client/sass/libs/*',
			'public/{js,css,fonts}/*',
			'public/**/*.html'
		], { read: false })
		.pipe( p.clean() )
	;
});

gulp.task('copy-angular', function(){
	return gulp
		.src([
			'bower_components/angular/angular.js',
			'bower_components/angular/angular.min.js',
			'bower_components/angular/angular.min.js.map',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-route/angular-route.min.js',
			'bower_components/angular-route/angular-route.min.js.map',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/angular-sanitize/angular-sanitize.min.js',
			'bower_components/angular-sanitize/angular-sanitize.min.js.map',
			'bower_components/angular-resource/angular-resource.js',
			'bower_components/angular-resource/angular-resource.min.js',
			'bower_components/angular-resource/angular-resource.min.js.map'
		])
		.pipe( gulp.dest('public/js/libs/') )
	;
});

gulp.task('copy-inuit', function(){
	return gulp
		.src(['bower_components/inuit.css/**/*.scss'])
		.pipe( gulp.dest('client/sass/libs/inuit/') )
	;
});

gulp.task('copy-angular-csp', function(){
	return gulp
		.src('bower_components/angular/angular-csp.css')
		.pipe( p.rename('_angular-csp.scss') )
		.pipe( gulp.dest('client/sass/libs/') )
	;
});

gulp.task('copy-font-awesome-css', function(){
	return gulp
		.src('bower_components/font-awesome/css/font-awesome.css')
		.pipe( p.rename('_font-awesome.scss') )
		.pipe( gulp.dest('client/sass/libs/') )
	;
});

gulp.task('copy-font-awesome-fonts', function(){
	return gulp
		.src('bower_components/font-awesome/fonts/*')
		.pipe( gulp.dest('public/fonts/') )
	;
});

gulp.task('copy-components', ['copy-angular', 'copy-angular-csp', 'copy-inuit', 'copy-font-awesome-css', 'copy-font-awesome-fonts']);

gulp.task('sass', function(){
	return gulp
		.src(['client/sass/libs.scss', 'client/sass/styles.scss'])
		.pipe( p['ruby-sass']({style: 'expanded', sourcemap: true}) )
		.pipe( gulp.dest('public/css/') )
	;
});

gulp.task('csslint', function(){
	return gulp
		.src('public/css/styles.css')
		.pipe( p.csslint( csslint_rules ) )
		.pipe( p.csslint.reporter() )
	;
});

gulp.task('html2js', function(){
	return gulp
		.src( path.html2js )
		.pipe( p.beml() )
		.pipe( p.htmlhint({'doctype-first': false}) )
		.pipe( p.htmlhint.reporter() )
		.pipe( p['minify-html']( minify_html_options ) )
		.pipe( p['angular-templatecache']({
			module: 'lms.templates',
			standalone: true
		}) )
		.pipe( p.concat('lms-templates.js') )
		.pipe( gulp.dest('public/js/') )
	;
});

//need to split js linting by folder for gulp-changed
gulp.task('client-js-lint', function(){
	return gulp
		.src( path.clientjs )
		.pipe( p.changed('client/js/') )
		.pipe( p.jshint('/home/gmoulin/gm-vim2/vim/.jshintrc') )
		.pipe( p.jshint.reporter('default') )
	;
});

gulp.task('base-js-lint', function(){
	return gulp
		.src( path.basejs )
		.pipe( p.changed('./') )
		.pipe( p.jshint('/home/gmoulin/gm-vim2/vim/.jshintrc') )
		.pipe( p.jshint.reporter('default') )
	;
});

gulp.task('server-js-lint', function(){
	return gulp
		.src( path.serverjs )
		.pipe( p.changed('server/') )
		.pipe( p.jshint('/home/gmoulin/gm-vim2/vim/.jshintrc') )
		.pipe( p.jshint.reporter('default') )
	;
});

gulp.task('jshint', ['client-js-lint', 'server-js-lint', 'base-js-lint']);

gulp.task('copy-scripts', function(){
	return gulp
		.src('client/js/**/*.js')
		.pipe( gulp.dest('public/js/') )
	;
});

gulp.task('todo', function(){
	return gulp
		.src( path.todo )
		.pipe( p.todo() )
		.pipe( gulp.dest('./') )
	;
});

gulp.task('build-dev', function(){
	return gulp
		.src('client/views/index.tpl.html')
		.pipe( p.preprocess({
			context: { //variables for template parsing
				LIVERELOAD: true,
				SERVER: 'developement'
			}
		}) )
		.pipe( p.inject(
			gulp.src([
				'public/css/libs.css',
				'public/css/styles.css',
				'public/js/libs/angular.js',
				'public/js/libs/angular-sanitize.js',
				'public/js/libs/angular-route.js',
				'public/js/libs/angular-resource.js',
				'public/js/lms-templates.js',
				'public/js/lms-modules.js',
				'public/js/lms-routes.js',
				'public/js/!(libs)/*.js',
				'public/js/lms.js'
			], {read: false})
			, { ignorePath: 'public/' }
		) )
		.pipe( p.beml() )
		.pipe( p.htmlhint({'doctype-first': false}) )
		.pipe( p.htmlhint.reporter() )
		.pipe( p['minify-html']( minify_html_options ) )
		.pipe( p.rename('index.html') )
		.pipe( gulp.dest('public/') )
	;
});

/*gulp.task('nodemon-dev'[>, ['prepare']<], function( cb ){
	p.nodemon({
		script: 'server.js',
		nodeArgs: ['--debug=9999'], //same debug port as node-inspector
		ignore: [
			'./!(server)/**',
			'./Gruntfile.js',
			'./gulpfile.js'
		],
		ext: 'js',
		delayTime: 1,
		env: {
			ENV: 'development',
			PORT: 3001
		}
	});

	cb( null );
});*/

gulp.task('server', function() {
	if( node ){
		node.kill();
	}

	node = spawn('node', ['server.js', '--debug=9999'], {stdio: 'inherit', env: { ENV: 'development', PORT: 3001 }});
	node.on('close', function( code ){
		if( code === 8 ){
			gulp.log('Node error detected...');
		}
	});
});

// clean up if an error goes unhandled.
process.on('exit', function(){
	if( node ){
		node.kill();
	}
});

/*gulp.task('grunt-legacy', ['build-dev'], function(){
	gulp.run('grunt-dev');
});*/

gulp.task('watch', function( cb ){
	gulp.watch(path.html2js, ['html2js']);
	gulp.watch(path.todo, ['todo']);

	gulp.watch(path.clientjs, ['client-js-lint']);
	gulp.watch(path.serverjs, ['server-js-lint']);
	gulp.watch(path.basejs, ['base-js-lint']);

	gulp.watch('client/sass/**/*.scss', ['sass']);
	gulp.watch('public/css/styles.css', ['csslint']);

	gulp.watch('client/js/**/*.js', ['copy-scripts']);

	gulp.watch(['client/views/index.tpl.html', 'public/js/**/*.js', 'public/css/{styles,libs}.css'], ['build-dev']);

	var server = p.livereload( 5555 );
	gulp.watch('public/**')
		.on('change', function( file ){
			server.changed( file.path );
		});

	gulp.watch(['server.js', 'server/**/**/*.js'], ['server']);

	cb( null );
});

gulp.task('dev', function( cb ){
	runSequence('clean-dev', 'copy-components', ['html2js', 'copy-scripts', 'jshint', 'todo', 'sass'], ['csslint', 'build-dev'], cb);
});

gulp.task('default', function( cb ){
	runSequence('dev', 'server', 'watch', cb);
});

/* ------------------------------------ */

/*gulp.task('end2end', function(){
	gulp.run('grunt-end2end');
});*/

/* ------------------------------------ */

gulp.task('css-minify', function(){
	return gulp.src(['public/css/libs.css', 'public/css/styles.css'])
		.pipe( p.csso() )
		.pipe( p.rename('optimized.min.css') )
		.pipe( gulp.dest('public/css/') )
	;
});

gulp.task('js-libs-minify', function(){
	return gulp.src([
			'public/js/libs/angular.min.js',
			'public/js/libs/angular-sanitize.min.js',
			'public/js/libs/angular-route.min.js',
			'public/js/libs/angular-resource.min.js'
		])
		.pipe( p.concat('libs.min.js') )
		.pipe( gulp.dest('public/js/') )
	;
});

gulp.task('js-main-minify', function(){
	return gulp.src([
			'public/js/lms-templates.js',
			'public/js/lms-modules.js',
			'public/js/lms-routes.js',
			'public/js/!(libs)/*.js',
			'public/js/lms.js'
		])
		.pipe( p.uglify({
			mangle: true,
			compress: {
				drop_debugger: true,
				drop_console: true,
				warnings: true
			},
			beautify: true,
			sourceMap: true
		} ) )
		.pipe( p.concat('optimized.min.js') )
		.pipe( gulp.dest('public/js/') )
	;
});

gulp.task('uncss', function(){
	return gulp
		.src('public/css/optimized.min.css')
		.pipe( p.uncss({
			html: ['public/index.html', 'client/views/partials/**/*']
		}) )
	;
});

gulp.task('csslintmin', function(){
	return gulp
		.src('public/css/optimized.min.css')
		.pipe( p.csslint( csslint_rules ) )
		.pipe( p.csslint.reporter() )
	;
});

gulp.task('clean-quality', function(){
	return gulp
		.src(['build/quality/*'])
		.pipe( p.clean() )
	;
});

gulp.task('build-quality', function(){
	return gulp
		.src('client/views/index.tpl.html')
		.pipe( p.preprocess({
			context: { //variables for template parsing
				LIVERELOAD: false,
				SERVER: 'quality'
			}
		}) )
		.pipe( p.inject(
			gulp.src([
				'public/css/optimized.min.css',
				'public/js/libs.min.js',
				'public/js/optimized.min.js'
			], {read: false})
			, { ignorePath: 'public/' }
		) )
		//.pipe( p.beml() )
		//.pipe( p.htmlhint({'doctype-first': false}) )
		//.pipe( p.htmlhint.reporter() )
		//.pipe( p['minify-html']( minify_html_options ) )
		.pipe( p.rename('index.html') )
		.pipe( gulp.dest('public/') )
	;
});

gulp.task('copy-quality', function(){
	return gulp
		.src(['public/{js,css}/**/*', 'public/index.html'])
		.pipe( gulp.dest('build/quality/') )
	;
});

gulp.task('quality', function( cb ){
	runSequence(['clean-dev', 'clean-quality'], 'copy-components', ['html2js', 'copy-scripts', 'jshint', 'todo', 'sass'], ['css-minify', 'js-libs-minify', 'js-main-minify'], 'build-quality', /*'uncss', 'csslintmin',*/ 'copy-quality', cb);
});

gulp.task('clean-production', function(){
	return gulp
		.src('build/production/*')
		.pipe( p.clean() )
	;
});

gulp.task('build-production', function(){
	return gulp
		.src('client/views/index.tpl.html')
		.pipe( p.preprocess({
			context: { //variables for template parsing
				LIVERELOAD: false,
				SERVER: 'production'
			}
		}) )
		.pipe( p.inject(
			gulp.src([
				'public/css/optimized.min.css',
				'public/js/libs.min.js',
				'public/js/optimized.min.js'
			], {read: false})
			, { ignorePath: 'public/' }
		) )
		.pipe( p.beml() )
		.pipe( p.htmlhint({'doctype-first': false}) )
		.pipe( p.htmlhint.reporter() )
		.pipe( p['minify-html']( minify_html_options ) )
		.pipe( p.rename('index.html') )
		.pipe( gulp.dest('public/') )
	;
});

gulp.task('copy-production', function(){
	return gulp
		.src([
			'public/{js,css}/**/*',
			'public/index.html'
		])
		.pipe( gulp.dest('build/production/') )
	;
});

gulp.task('production', function( cb ){
	runSequence(['clean-dev', 'clean-production'], 'copy-components', ['html2js', 'copy-scripts', 'jshint', 'todo', 'sass'], 'build-production', /*'uncss', 'csslintmin',*/ 'copy-production', cb);
});
