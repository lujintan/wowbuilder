module.exports = function(grunt){
    'use strict';

    var path = require('path');
    
    grunt.registerMultiTask('addtpl', 'add tpl', function(o) {
        var options = this.options(),
            output = grunt.config('output'),
            moduleName = grunt.config('moduleName'),
            modulePath = grunt.config('modulePath').
                replace(/^\//, '').
                replace(/\//g, '_'),
            router = grunt.config('router'),
            isApi = !!options.isApi,
            isLocalHtml = !!options.isLocalHtml;

        if (isApi){
            this.files.forEach(function(filePair){
                var fileSrc = filePair.src[0],
                    original = grunt.file.read(fileSrc),
                    fileName = path.basename(fileSrc),
                    fileDirName = path.dirname(fileSrc).split(path.sep).pop(),
                    fileBaseName = path.basename(fileName, '.tpl');

                if (fileBaseName == fileDirName){
                    grunt.file.copy(fileSrc, 
                        './' + output + '/site/light_apis_' + fileBaseName + '.tpl');
                }
            });
        }
        else if (isLocalHtml){
            if (modulePath && 
                grunt.file.isFile('../output/index.html')){
                if (!grunt.file.isDir('../output/' + modulePath)){
                    grunt.file.mkdir('../output/' + modulePath);
                }

                for (var routerKey in router){
                    var routerVal = router[routerKey],
                        routerItem = null;
                    if (typeof routerVal == 'string'){
                        routerItem = {
                            tpl: routerVal
                        };
                    }
                    else{
                        routerItem = routerVal;
                    }
                    var src = routerItem.tpl;
                    if (/^\//.test(src)){
                        src = routerItem.tpl.replace('/' + moduleName + '/', '');
                    }
                    if (grunt.file.isFile(src)){
                        var fileName = path.basename(src, '.dust');
                        if (fileName == 'index'){
                            grunt.file.copy('../output/index.html', 
                                '../output/' + modulePath + '/index.html');
                        }
                        else{
                            var fileDir = fileName.replace(/_/g, '/');
                            if (!grunt.file.isDir(
                                '../output/' + modulePath + '/' + fileDir)){
                                grunt.file.mkdir(
                                    '../output/' + modulePath + '/' + fileDir);
                            }
                            grunt.file.copy(
                                '../output/index.html',
                                '../output/' + modulePath + 
                                '/' + fileDir + '/index.html');
                        }
                    }
                }
            }
        }
        else{
            for (var routerKey in router){
                var routerVal = router[routerKey],
                    routerItem = null;
                if (typeof routerVal == 'string'){
                    routerItem = {
                        tpl: routerVal
                    };
                }
                else{
                    routerItem = routerVal;
                }

                var src = routerItem.tpl;
                if (/^\//.test(src)){
                    src = routerItem.tpl.replace('/' + moduleName + '/', '');
                }
                if (grunt.file.isFile(src)){
                    var fileName = path.basename(src, '.dust'),
                        toName = fileName == 'index' ? 
                            modulePath : modulePath + '_' + fileName,
                        tplContent = [
                            '{{extends file="./light_index.tpl"}}',
                            '\n{{block name="block_assign" append}}',
                                '{{$pageType="' + moduleName + '"}}',
                            '{{/block}}'
                        ].join('');
                    if (routerItem.title){
                        tplContent += [
                            '\n{{block name="block_page_title"}}',
                                routerItem.title,
                            '{{/block}}'
                        ].join('');
                    }
                    grunt.file.write(
                        output + '/site/light_' + toName + '.tpl',
                        tplContent);
                }
            }
            this.files.forEach(function(filePair){
                var fileSrc = filePair.src[0],
                    original = grunt.file.read(fileSrc),
                    fileName = path.basename(fileSrc);

                var fileType = path.extname(fileSrc);
                if (fileType == '.tpl'){
                    var toFileName = 'light_' + modulePath + '_' + fileName;
                    
                    if (fileName == 'index.tpl'){
                        toFileName = 'light_' + modulePath + '.tpl';
                    }

                    grunt.file.write(
                        output + '/site/' + toFileName, original);
                }
            });
        }
    });
};