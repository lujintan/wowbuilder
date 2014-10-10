module.exports = function(grunt){
    'use strict';
    var path = require('path');
    var crypto = require('crypto');
    
    grunt.registerMultiTask('filemap', 'file map.', function() {
        var options = this.options(),
            mapJson = {
                paths : {},
                deps : {}
            },
            moduleName = grunt.config('moduleName'),
            output = grunt.config('output'),
            packMap = grunt.config('packMap'),
            confPath = [
                output,
                'conf',
                moduleName + '_map.json'
            ].join('/'),
            requireMapPath = [
                output,
                'conf',
                moduleName + '_require_map.js'
            ].join('/'),
            domains = options.domain || [],
            deleteSrcs = [];
            
        this.files.forEach(function(filePair){
            var fileSrc = filePair.src[0],
                fileMapPath = '/' + moduleName + '/' + _removeOutputDir(fileSrc);

            if (packMap && packMap[fileMapPath]){
                fileSrc = packMap[fileMapPath];
            }

            var fileExtName = path.extname(fileSrc),
                original = grunt.file.read(fileSrc),
                fileBaseName = path.basename(fileSrc, fileExtName),
                realPath = '/' + moduleName + '/' + fileSrc;

            if (options.md5){
                var md5 = crypto.createHash('md5');
                md5.update(original);
                var d = md5.digest('hex').substring(0, 8),
                    genFileName = fileBaseName + '_' + d + fileExtName,
                    destFileName = fileSrc.replace(
                    fileBaseName + fileExtName, genFileName);

                if (!grunt.file.exists(destFileName)){
                    grunt.file.copy(fileSrc, destFileName);
                    deleteSrcs.push(fileSrc);
                }

                realPath = '/' + moduleName + '/' + destFileName;
            }

            if (domains.length){
                realPath = domains[original.length % domains.length] 
                    + realPath.replace(
                        new RegExp('^/' + moduleName + '/' + output), '');
            }
            mapJson.paths[fileMapPath] = realPath;
        });


        deleteSrcs.forEach(function(deleteSrc){
            if (grunt.file.exists(deleteSrc)){
                grunt.file.delete(deleteSrc);
            }
        });
        grunt.file.write(confPath, JSON.stringify(mapJson));
        var wowPaths = mapJson.paths;
        for (var pa in wowPaths){
            if (path.extname(pa) == '.js'){
                wowPaths[pa.replace(/\.js$/, '').replace(/^\//, '')] = 
                    wowPaths[pa].replace(/\.js$/, '');
            }
            else if (path.extname(pa) == '.css'){
                wowPaths[pa.replace(/\.css$/, '_css').replace(/^\//, '')] = 
                    wowPaths[pa].replace(/\.css$/, '');
            }
            delete wowPaths[pa];
        }
        grunt.file.write(requireMapPath, 'wowRequireMap["' + moduleName + '"]=' + JSON.stringify(wowPaths) + ';');
    });

    var _removeOutputDir = function(src){
        var sourceDirs = src.split('/');
        sourceDirs.splice(0, 1);
        sourceDirs.splice(1, 1);
        return sourceDirs.join('/'); 
    };
};