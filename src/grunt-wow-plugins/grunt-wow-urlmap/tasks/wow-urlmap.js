var path = require('path');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

module.exports = function(grunt){
    grunt.registerMultiTask('wow-urlmap', 'generate url map', function() {
        var options = this.options();
        var moduleName = grunt.config('name');
        var modulePath = grunt.config('path');
        var cdnBase = grunt.config('cdnbase');
        var serverBase = grunt.config('serverbase');
        var mapOption = options.mapOption;
        var basePath = options.basePath || '/static';
        grunt.config('wowCdnBase', basePath);
        var urlMap = {};

        this.files.forEach(function(filePair){
            var fileSrc = filePair.src[0];
            var filePath = path.relative(filePair.orig.cwd, fileSrc);

            var fileExtName = path.extname(filePath);
            var fileKeySrc = filePath.replace(sepReg, '/');
            var fileRealSrc = basePath + '/' + fileKeySrc;
            urlMap[fileKeySrc] = fileRealSrc;

            switch(fileExtName){
                case '.less': 
                    urlMap[fileKeySrc.replace(/\.less$/, '.css')] = urlMap[fileKeySrc].replace(/\.less$/, '.css');
                break;
                case '.dust': 
                    urlMap[fileKeySrc] = urlMap[fileKeySrc].replace(/\.dust$/, '.js');
                break;
                case '':
                    delete urlMap[fileKeySrc];
                break;
            }
        });

        grunt.config('wowUrlMap', urlMap);
    });
};