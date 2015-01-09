var wowspg = require('wowspg-builder');
var path = require('path');

module.exports = function(grunt){
    'use strict';
    var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    
    grunt.registerMultiTask('wow-spg', 'add amd wraper', function() {
        var done = this.async();
        var options = this.options();
        var moduleName = grunt.config('name');
        var modulePath = grunt.config('path');
        var isWidget = options.isWidget;

        wowspg.compile({
            base: options.base,
            dist: options.dist,
            target: options.target,
            router: options.router,
            entrance: options.entrance,
            layout: options.layout,
            isDeleteSource: options.isDeleteSource
        }, function(){
            done();
        });
    });
};