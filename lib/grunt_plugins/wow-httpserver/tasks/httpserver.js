var express = require('express'),
    http = require('http'),
    path = require('path'),
    partials = require('express-partials'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    morgan = require('morgan'),
    options = {},
    staticExt = [
        'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'swf', 'ico', 'cur', 'html'
    ];

var _init = function(){
    var app = express(),
        basePath = path.resolve(options.base),
        entrance = options.entrance || 'index.html';

    app.use(partials());
    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(methodOverride());
    app.use(cookieParser('wow~'));
    app.use(serveStatic(basePath, {'index': ['index.html', 'index.htm']}));
    var router = express.Router();

    router.all(new RegExp('^[^(\\' + staticExt.join(')(\\') + ')]$'), function(req, res){
        res.send('wasai!!!');
    });

    app.all(new RegExp('^(?!.*?\\.(' + staticExt.join('|') + ')).*$'), function(req, res){
        res.status(200).sendFile(basePath + '/' + entrance);
    });

    http.createServer(app).listen(options.port || 8888, function(){
      console.log('server started');
    });
};

module.exports = function(grunt){
    'use strict';
    
    grunt.registerMultiTask('httpserver', 'start a http server for local test', function() {
        options = this.options();
        var done = this.async();

       _init();

       return done;
    });
};