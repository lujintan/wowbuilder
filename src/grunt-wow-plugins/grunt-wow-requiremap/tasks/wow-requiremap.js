var path = require('path');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

module.exports = function(grunt){
    grunt.registerMultiTask('wow-requiremap', 'generate url map', function() {
        var options = this.options();
        var basePath = grunt.config('wowCdnBase') || '/static';
        var urlMap = grunt.config('wowUrlMap');
        var requireMap = {};
        for (var mapPath in urlMap){
            if (urlMap.hasOwnProperty(mapPath)) {
                var realPath = urlMap[mapPath];
                var extName = path.extname(realPath);

                var relative2base = path.relative(basePath, realPath).replace(sepReg, '/');

                var key = mapPath.replace(/\.css$/, '').replace(/\.js$/, '');
                if (typeof requireMap[key] == 'undefined'){
                    switch(extName){
                        case '.css':
                            requireMap[key] = relative2base.replace(/\.css/, '');
                        break;
                        case '.js':
                            requireMap[key] = relative2base.replace(/\.js/, '');
                        break;
                    }
                }
            }
        }

        grunt.config('wowUrlMap', urlMap);

        grunt.file.write(options.target, JSON.stringify(requireMap));
    });
};