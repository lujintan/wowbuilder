var path = require('path');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

module.exports = function(grunt){
    'use strict';

    var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    
    grunt.registerMultiTask('wow-pack', 'generate rewrite config file', function() {
        var moduleName = grunt.config('name');
        var moduleDist = grunt.config('dist');
        var modulePath = grunt.config('path');
        var urlMap = grunt.config('wowUrlMap');
        var basePath = grunt.config('wowCdnBase') || '/static';

        this.files.forEach(function(filePair){
            var concatRes = [];
            filePair.src.forEach(function(fileSrc){
                var mapPath = path.join(modulePath, fileSrc).replace(sepReg, '/');
                concatRes.push(grunt.file.read(path.join(filePair.cwd, fileSrc)));
                if (urlMap[mapPath]){
                    urlMap[mapPath] = basePath + '/' + 
                        path.relative(path.join(moduleDist, 'build', 'static'), filePair.dest).replace(sepReg, '/');
                }
            });

            var packContent = concatRes.join('\n');
            grunt.file.write(filePair.dest, packContent);
        });

        grunt.config('wowUrlMap', urlMap);
    });
};