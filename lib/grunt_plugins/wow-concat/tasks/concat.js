module.exports = function(grunt){
    'use strict';

    var path = require('path'),
        sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    
    grunt.registerMultiTask('concat', 'concat files', function(o) {
        var options = this.options(),
            output = grunt.config('output'),
            moduleName = grunt.config('moduleName'),
            packMap = {};

        this.files.forEach(function(filePair){
            var concatRes = [],
                realDest = _getOutputPath(filePair.dest, moduleName, output);

            filePair.src.forEach(function(fileSrc){
                var fileExtName = path.extname(fileSrc);
                fileSrc = fileSrc
                    .replace(/\.dust$/, '.js')
                    .replace(/\.less$/, '.css');
                var outputPath = _getOutputPath(fileSrc, moduleName, output);
                if (fileExtName == '.dust'){
                    var fileBaseName = path.basename(fileSrc, '.js');
                    grunt.file.recurse(path.dirname(outputPath), 
                        function(abspath, rootdir, subdir, filename){
                        var baseName = path.basename(abspath),
                            extName = path.extname(abspath);
                        if (extName == '.js' && 
                            new RegExp('^' + fileBaseName).test(baseName)){
                            concatRes.push(grunt.file.read(abspath));
                            packMap['/' + 
                                moduleName + '/' + 
                                path.dirname(fileSrc).replace(sepReg, '/') + 
                                '/' + 
                                filename] = realDest;
                        }
                    });
                    if (fileBaseName == 'layout'){
                        var router = output + '/static/' + moduleName + 
                                '/js/router.js';
                        if (grunt.file.isFile(router)){
                            concatRes.push(grunt.file.read(router));
                        }
                        packMap['/' + moduleName + '/static/js/router.js'] = 
                            realDest;
                    }
                }
                else{
                    concatRes.push(grunt.file.read(outputPath));
                    packMap['/' + moduleName + '/' + fileSrc] = realDest;
                }
            });
            var packContent = concatRes.join('\n');
            grunt.file.write(realDest, packContent);
        });
        grunt.config.set('packMap', packMap);
    });

    var _getOutputPath = function(src, moduleName, output){
        var destPaths = src.split('/');
        destPaths[0] = output + '/' + destPaths[0] + '/' + moduleName;
        return destPaths.join('/');
    };
};