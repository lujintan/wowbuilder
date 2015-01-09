var path = require('path');
var crypto = require('crypto');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

module.exports = function(grunt){
    grunt.registerMultiTask('wow-md5', 'generate url map', function() {
        var options = this.options();
        var basePath = grunt.config('wowCdnBase') || '/static';
        var dist = grunt.config('dist');
        var urlMap = grunt.config('wowUrlMap');
        var requireMap = {};
        
        this.files.forEach(function(filePair){
            filePair.src.forEach(function(fileSrc){
                var fileExtName = path.extname(fileSrc);
                var fileBaseName = path.basename(fileSrc, fileExtName);
                var original = grunt.file.read(fileSrc);
                var md5 = crypto.createHash('md5');
                md5.update(original);
                var d = md5.digest('hex').substring(0, 8);
                var genFileName = fileBaseName + '_' + d + fileExtName;

                var mapPath = '/' + path.relative(path.join(dist, 'build', 'static'), fileSrc).replace(sepReg, '/');
               
                for (var urlKey in urlMap){
                    var urlPath = urlMap[urlKey].replace(basePath, '');
                    if (urlPath === mapPath){
                        urlMap[urlKey] = basePath + path.join(path.dirname(mapPath), genFileName).replace(sepReg, '/');
                    }
                }
                grunt.file.copy(fileSrc, path.join(path.dirname(filePair.dest), genFileName));
            });
        });

        grunt.config('wowUrlMap', urlMap);
    });
};