module.exports = function(grunt){
    'use strict';

    var path = require('path'),
        sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g'),
        mapJson = {},
        isMapPath = false;

    grunt.registerMultiTask('urlfix', 'url fix.', function() {
        var options = this.options(),
            moduleName = grunt.config('moduleName'),
            depsModule = grunt.config('depsModule'),
            output = grunt.config('output');
        isMapPath = options.replace && options.replace == 'mappath';

        mapJson = grunt.file.readJSON('./' + output + 
                '/conf/' + moduleName + '_map.json');

        depsModule.forEach(function(mod){
            var mapUrl = '../' + mod + '/' + output + 
                '/conf/' + mod + '_map.json';
            if (!grunt.file.isFile(mapUrl)){
                return;
            }
            var mapJsonModule = grunt.file.readJSON(mapUrl),
                paths = mapJsonModule.paths;

            if (paths){
                for (var pa in paths){
                    mapJson.paths[pa] = paths[pa];
                }
            }
        });

        this.files.forEach(function(filePair){
            filePair.src[0] = filePair.src[0]
                    .replace(/\.dust$/, '.js')
                    .replace(/\.less$/, '.css');
            var fileType = path.extname(filePair.src[0]);
            switch(fileType){
                case '.html':
                case '.tpl':
                    _htmlHandler(filePair);
                break;
                case '.css':
                    _cssHandler(filePair);
                break;
                case '.js':
                    _jsHandler(filePair);
                break;
            }
        });
    });

    var _basePath = path.resolve('..').replace(sepReg, '/');
    var _removeOutputDir = function(src){
        var sourceDirs = src.split('/');
        sourceDirs.splice(0, 1);
        sourceDirs.splice(1, 1);
        return sourceDirs.join('/'); 
    };

    var _getRealPath = function(src, fileDir){
        var src = src
            .replace(/\.dust$/, '.js')
            .replace(/\.less$/, '.css'),
            sourceMapPath = src.charAt(0) == '/' ? 
            src : 
            path.resolve(fileDir, src)
                .replace(sepReg, '/')
                .replace(_basePath, '');

        if (mapJson.paths[sourceMapPath]){
            return isMapPath ? sourceMapPath : mapJson.paths[sourceMapPath];
        }
        else{
            return src;
        }
    };

    var _fixUrlTag = function(str, fileDir){
        return str.replace(/__url\((['"]?)([^'"\(\)]*)(['"]?)\)/g, 
            function(scr, lq, src, rq){
                var mapSrc = _getRealPath(src, fileDir),
                    lq = lq || '',
                    rq = rq || '',
                    backPath = lq + mapSrc + rq;

                if (isMapPath){
                    backPath = '__url(' + backPath + ')';
                }
                return backPath;
        });
    };

    var _htmlHandler = function(file){
        var fileSrc = file.src[0],
            fileDest = file.dest,
            original = grunt.file.read(fileSrc),
            fileOriPath = _removeOutputDir(fileSrc),
            fileDir = path.dirname(fileOriPath).replace(sepReg, '/');
        var jsList = [],
            cssList = [],
            proFile = original.replace(
                /(<script.+src=['"]?)([^'"]+)(['"]?><\/script>)/g, 
                function(scr, f, src, e){
                    var mapSrc = _getRealPath(src, fileDir);
                    if (jsList.indexOf(mapSrc) > -1){
                        return '';
                    }
                    jsList.push(mapSrc);
                    return f + mapSrc + e;
            }).replace(
                /(<link.+href=['"]?)([^'"]+)(['"]?.*)(>|\/>|><\/link>)/g,
                function(scr, f, src, kuo,e){
                    var mapSrc = _getRealPath(src.replace(/\.less$/, '.css'), fileDir);
                    if (cssList.indexOf(mapSrc) > -1){
                        return '';
                    }
                    cssList.push(mapSrc);
                    return f + mapSrc + kuo + e;
            }).replace(
                /(<img.+src=['"]?)([^'"]+)(['"]?.*)(>|\/>|><\/img>)/g,
                function(scr, f, src, kuo,e){
                    var mapSrc = _getRealPath(src, fileDir);
                    return f + mapSrc + kuo + e;
            });
        grunt.file.write(fileDest, _fixUrlTag(proFile, fileDir));
    };

    var _jsHandler = function(file){
        var fileSrc = file.src[0],
            fileDest = file.dest,
            original = grunt.file.read(fileSrc),
            fileOriPath = _removeOutputDir(fileSrc),
            fileDir = path.dirname(fileOriPath).replace(sepReg, '/');

        grunt.file.write(fileDest, _fixUrlTag(original, fileDir));
    };

    var _cssHandler = function(file){
        var fileSrc = file.src[0],
            fileDest = file.dest,
            original = grunt.file.read(fileSrc),
            fileOriPath = _removeOutputDir(fileSrc),
            fileDir = path.dirname(fileOriPath).replace(sepReg, '/'),
            proFile = original.replace(
                /(background\-image|background)(\s*:.*url\()['"]?([^'"\)]+\.png|[^'"\)]+\.jpg|[^'"\)]+\.gif])['"]?(\))/g, 
                function(scr, f, sec, src, e){
                    var mapSrc = _getRealPath(src, fileDir);
                    return f + sec + mapSrc + e;
            });
        grunt.file.write(fileDest, _fixUrlTag(proFile, fileDir));
    }
};