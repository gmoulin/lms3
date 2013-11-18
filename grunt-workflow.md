---
layout: default
title: Grunt workflow
---

# Tasks

## Linters
* jshint ([grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint))
* recess ([grunt-recess](https://github.com/sindresorhus/grunt-recess))

## Node debug help
* [grunt-node-inspector](https://github.com/ChrisWren/grunt-node-inspector)

## Tests
* mocha

## Coverage
* istanbul

## Managing index.html scripts list
* [grunt-include-source](https://github.com/jwvdiermen/grunt-include-source)

## Managing generated files and folders
* [grunt-contrig-clean](https://github.com/gruntjs/grunt-contrib-clean)

## Cleaning bower dependencies
* [grunt-bower-clean](https://github.com/KidkArolis/grunt-bower-clean)

## Managing file change
* livereload ([grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch))
** watch css (not sass), front javascript, images, view templates and html files
* restarting node on backend changes ([grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon))
** watch backend javascript files

## Concurrent tasks
* nodemon, node-inspector, watch
* [grunt-concurrent](https://github.com/sindresorhus/grunt-concurrent)

## Precompile templates and partials
* [grunt-html2js](https://github.com/karlgoldstein/grunt-html2js)

## Compile Sass
* [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass)

## Dry CSS
* [grunt-uncss](https://github.com/addyosmani/grunt-uncss)

# Workflow

## Development
* clean
* sass
* linting
* dry css
* automated tests
* tests coverage
* html2js
* includeSource
* concurrent
