---
layout: default
title: LMS3 project needs
---

LMS stands for Library Management System

For the third version I wanted to test a full javascript environment using **Node**, **Angular** and **Sass**. As the same time I wanted this project to be part of a **public portfolio**.

[problems and solutions found along the way]({{site.baseurl}}/problems-and-solutions.html)

## Technologies needs:
* Javascript on server - Node and Express
* Database - MongoDB with mongoose
* Cache capable - Redis
* Front - Angular
* Front unit test - Mocha (to check)
* Front coverage - Istanbul (to check)
* Back unit test - Mocha (to check)
* Back coverage - Istanbul (to check)

## Environment needs:
* dependency management - npm and bower
* auto listing of scripts and stylesheets in html layout - grunt includeSource
* live reload - grunt-contrib-watch
* auto restart - grunt nodemon
* auto compiling for Sass - grunt
* full domain support for both apache and node - apache proxying for node (not optimal but working)
* automated checking, minifying, building - grunt (usemin, jslint, templates precompiling, recess, ...)
* easier debugging - grunt node inspector
* unused css removing - grunt-uncss

* [Grunt workflow]({{site.baseurl}}/grunt-workflow.html)

## Deployement needs:
* on development site (no minify, node debug, automated tests, automated restart, linting, ...)
* one self hosted quality site (minify, automated tests, automated deployment on new quality tag, ...)
* one self hosted production site (restart on change, automated deployment on new production tag, ...)
* environment aware configuration (node, grunt)

## User interface needs:
* mobile and tablets support (responsive)
* offline and mobile first approach
* synchronisation when online
* minimal and clean interface

## Functionalities needs:
* no more images (no real added value)
* last statistics (last read, last added, next to read/view by saga, ...)
* link to check if any new chapter (novel, film, episode, ...) is available for a given saga
* more media categories (TV series)
* annotation by saga
* cross category saga

## Data schema needs:
* factorize data
* specific data for each media category
* keep full text search capability

* [mongoDB schema]({{site.baseurl}}/mongodb-schema.html)

## Editor:
* customized vim with completion, snippets, ... - [gm-vim2](https://github.com/gmoulin/gm-vim2)

## Portfolio needs:
* simple static site using github jekyll support
* local preview
