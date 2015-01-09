var path = require('path');

module.exports = function(grunt){
    'use strict';

    var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    
    grunt.registerMultiTask('wow-rewrite', 'generate rewrite config file', function() {
        var options = this.options();
        var target = options.target;
        var moduleName = grunt.config('name');
        var moduleDist = grunt.config('dist');
        var modulePath = grunt.config('path');
        var isWidget = options.isWidget;

        if (!target){
            return;
        }
        var optRewriteConf = options.rewrite;
        var rewriteConfig = {};
        for (var reKey in optRewriteConf){
            rewriteConfig[reKey] = path.join('/static', optRewriteConf[reKey]);
        }
        grunt.file.write(target, JSON.stringify(rewriteConfig));
    });
};