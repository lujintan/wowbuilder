var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var formidable = require('formidable');
var options = {};
var staticExt = [
    'css', 'png', 'jpg', 'jpeg', 'gif', 'swf', 'ico', 'cur', 'html'
];

var _init = function(grunt){
    var app = express(),
        basePath = path.resolve(options.base),
        entrance = options.entrance || 'index.html';

    app.use(partials());
    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(methodOverride());
    app.use(cookieParser('wow~'));
    app.use(serveStatic(basePath));
    var router = express.Router();

    app.all(new RegExp('^(?!.*?\\.(' + staticExt.join('|') + '))\\??[^?]*$'), function(req, res){
        var reqPath = req.path;
        var rewritePath = basePath + '/rewrite';
        var rewriteConf = {};
        var sendFile = basePath + '/' + entrance;

        if (grunt.file.isDir(rewritePath)){
            grunt.file.recurse(rewritePath, function callback(abspath, rootdir, subdir, filename) {
                var moReConf = grunt.file.readJSON(abspath);

                for (var pa in moReConf){
                    rewriteConf[pa] = moReConf[pa];
                }
            });
        }

        var flagRewrite = false;
        for (var pa in rewriteConf){
            var reg = new RegExp(pa, 'i');

            if (reg.test(reqPath)){
                sendFile = basePath + rewriteConf[pa];
                flagRewrite = true;
                
            }
        }

        if (flagRewrite){
            var fileExt = path.extname(sendFile);
            if (fileExt === '.js'){
                var data = require(sendFile);
                res.status(200).send(JSON.stringify(data));
            } else{
                res.status(200).sendFile(sendFile);
            }
        } else{
            
            res.status(200).send(fs.readFileSync(sendFile, {
                encoding: 'utf8'
            }));
        }
    });

    http.createServer(app).listen(options.port || 8888, function(){
      console.log('Server started');
    });
};

module.exports = function(grunt){
    'use strict';
    
    grunt.registerMultiTask('wow-httpserver', 'start a http server for local test', function() {
        options = this.options();
        var done = this.async();

       _init(grunt);

       return done;
    });
};