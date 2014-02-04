angular.module('templates-main', ['../client/views/partials/books.tpl.html', '../client/views/partials/home.tpl.html']);

angular.module("../client/views/partials/books.tpl.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("../client/views/partials/books.tpl.html",
		"{{books | json}}\n" +
		"\n" +
		"<br>\n" +
		"<a href=\"#/rest/books\">find all</a>\n" +
		"<br>\n" +
		"<a href=\"#/rest/books/1\">find by id 1</a>\n" +
		"<br>\n" +
		"<a href=\"#/rest/books/todo\">action all</a>\n" +
		"<br>\n" +
		"<a href=\"#/rest/books/1/todo\">action by id 1</a>\n" +
		"<br>\n" +
		"\n" +
		"");
}]);

angular.module("../client/views/partials/home.tpl.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("../client/views/partials/home.tpl.html",
		"<div class=\"container home\">\n" +
		"	<div class=\"row\" ng-repeat=\"group in groups\">\n" +
		"		<div class=\"col-lg-6 text-center part-link\" ng-repeat=\"part in group\">\n" +
		"			<h1>\n" +
		"				<a href=\"#/{{part|lowercase|urlify}}\"\n" +
		"					title=\"open {{part}} page\"\n" +
		"					class=\"btn btn-primary btn-lg\"\n" +
		"				>{{ part }}</a>\n" +
		"			</h1>\n" +
		"		</div>\n" +
		"	</div>\n" +
		"</div>\n" +
		"");
}]);
