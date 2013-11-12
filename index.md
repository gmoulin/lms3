---
layout: hack
title: Welcome
---

LMS stands for Library Management System

For the third version I wanted to test a full javascript environment using **Node**, **Angular** and **Sass**. As the same time I wanted this project to be part of a **public portfolio**.

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
* automated checking, minifying, building - grunt (usemin, jslint, templates precompiling, ...)
* easier debugging - grunt node inspector
* unused css removing - grunt-uncss

##Editor:
* vim with completion, snippets, ... - [gm-vim2](https://github.com/gmoulin/gm-vim2)
