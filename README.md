# LMS3
work in progress - non useable at the moment

**portfolio project**

## Technologies:
* Node
* Express
* MongoDB
* Moongoose
* Redis
* Angular
* Sass
* [MCSS](http://operatino.github.io/MCSS/en/)

## Quality check:
* auto lint (in editor and while building / compiling code)
* unit tests (front and back)
* code coverage

## Environment:
* Ubuntu
* Vim [gm-vim2](https://github.com/gmoulin/gm-vim2)
* Grunt for live reload, template precompiling, liting, minifying, ...
* full domain support (no more port)
* do not disturb day to day work (apache, php, ...)

## Project updates:
* Jekyll and github pages

	git checkout gh-pages
	run local preview with
	jekyll serve --watch --detach --baseurl ''

## Installation:
* require node, npm, bundle, grunt and bower installed
* clone project
* run from project root

	npm install && bower install
* live reload functionnality need a browser plugin (LiveReload for chrome)
* start node localy

	grunt server
