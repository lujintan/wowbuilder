module.exports = function(grunt){
    'use strict';
    var path = require('path'),
        sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g'),
        moduleName = '',
        basePath = '',
        parentBlocks = [];

    var getParamKeys = function(result){
        if (typeof result != 'string'){
            return {};
        }
        var params = {},
            keyVals = result.replace(/(\S+)\=['"]([^'"]+)['"]/g, function(keyVal, key, val){
                params[key] = val;
                return '';
            });

        if (params.name && parentBlocks.indexOf(params.name) < 0) {
            params.name = moduleName + '_' + params.name;
        }

        return params;
    };

    var _getBlockInfo = function(str, ld, rd, fileSrc){
        var block = {},
            blockChildren = {},
            blockReg = new RegExp(ld + 
                'block(((?!' + rd + ')[\\s\\S])*[\\s\\S])' + rd),
            blockRegInner = new RegExp(ld + 'block(((?!' + rd + ')[\\s\\S])*[\\s\\S])' + rd +
                    '(((?!' + ld + ')[\\s\\S])*[\\s\\S]?)' + 
                    ld + '/block' + rd, 'mg'),
            depth = 0,
            lastDir = 1,
            parentBlockTpl = str.replace(blockRegInner, function(blockStr, param, e, tpl){
                var params = getParamKeys(param);
                if (!params.name){
                    return '';
                }
                var blockInfo = {
                    'class': params['class'],
                    'id': params.id,
                    'dt': null,
                    'css': [],
                    'handler': {
                        start: [],
                        ready: [],
                        usable: []
                    }
                };
                var realTpl = tpl.replace(
                    /<script[^<]+src=['"]?([^'"]+)['"]? *(handler=['"]?([^'"]+)['"]?)?><\/script>/g, 
                    function(script, src, o, handler, n){
                        blockInfo.handler = blockInfo.handler || {
                            start: [],
                            ready: [],
                            usable: []
                        };
                        if (/^\//.test(src)){
                            src = src.replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.js');
                        }
                        else{
                            src = path.resolve(fileSrc, src).
                                replace(sepReg, '/').
                                replace(basePath, '').
                                replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.js');
                        }
                        switch (handler){
                            case 'start':
                                blockInfo.handler.start.push(src);
                            break;
                            case 'usable':
                                blockInfo.handler.usable.push(src);
                            break;
                            case 'dt':
                                blockInfo.dt = src;
                            break;
                            default:
                                blockInfo.handler.ready.push(src);
                        }
                    return '';
                }).replace(
                    /(<link.+href=['"]?)([^'"]+)(['"]?.*)(>|\/>|><\/link>)/g,
                    function(scr, f, src, kuo,e){
                        src = src.replace(/\.less$/, '.css');
                        blockInfo.css = blockInfo.css || [];
                        if (/^\//.test(src)){
                            src = src.replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.css') + '_css';
                        }
                        else{
                            src = path.resolve(fileSrc, src).
                                replace(sepReg, '/').
                                replace(basePath, '').
                                replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.css') + '_css';
                        }
                        blockInfo.css.push(src);
                        return '';
                });
                blockInfo.tpl = realTpl;
                blockChildren[params.name] = blockInfo;
                return '!@#$%wow_block_' + params.name + '%$#@!';
            });
        var blockTpl = parentBlockTpl.
            replace(blockRegInner, function(blockStr, param, e, tpl){
            var params = getParamKeys(param);
            if (!params.name){
                return '';
            }
            
            var innerBlocks = {},
                blockName = params.name,
                blockCount = 0;
            block[blockName] = {};
            block[blockName].tpl = tpl.
                replace(
                    /<script[^<]+src=['"]?([^'"]+)['"]? *(handler=['"]?([^'"]+)['"]?)?><\/script>/g, 
                    function(script, src, o, handler, n){
                        block[blockName].handler = block[blockName].handler || {
                            start: [],
                            ready: [],
                            usable: []
                        };

                        if (/^\//.test(src)){
                            src = src.replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.js');
                        }
                        else{
                            src = path.resolve(fileSrc, src).
                                replace(sepReg, '/').
                                replace(basePath, '').
                                replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.js');
                        }
                        switch (handler){
                            case 'start':
                                block[blockName].handler.start.push(src);
                            break;
                            case 'usable':
                                block[blockName].handler.usable.push(src);
                            break;
                            case 'dt':
                                block[blockName].dt = src;
                            break;
                            default:
                                block[blockName].handler.ready.push(src);
                        }
                    return '';
                }).replace(
                    /(<link.+href=['"]?)([^'"]+)(['"]?.*)(>|\/>|><\/link>)/g,
                    function(scr, f, src, kuo,e){
                        src = src.replace(/\.less$/, '.css');
                        block[blockName].css = block[blockName].css || [];
                        if (/^\//.test(src)){
                            src = src.replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.css') + '_css';
                        }
                        else{
                            src = path.resolve(fileSrc, src).
                                replace(sepReg, '/').
                                replace(basePath, '').
                                replace(/^\//, '');
                            src = path.dirname(src) + '/' + path.basename(src, '.css') + '_css';
                        }
                        block[blockName].css.push(src);
                        return '';
                }).
                replace(/\!@#\$%wow_block_((?!%\$#@\!).+)%\$#@\!/g, 
                    function(tpl, name){
                    blockCount++;
                    var blockChild = blockChildren[name],
                        blockClass = 'mod-wow-' + name;

                    innerBlocks[name] = {
                        selector: '.' + blockClass
                    };

                    blockChild.tpl && (innerBlocks[name].tpl = blockChild.tpl);

                    return [
                        '<section ',
                            blockChild['class'] ? 
                                'class="' + blockChild['class'] + ' ' 
                                + blockClass + '" ' : 
                                'class="' + blockClass + '" ',
                            blockChild['id'] ?
                                'id="' + blockChild['id'] + '"' : '',
                            '>',
                        '</section>'
                    ].join('');
            });
            if (blockCount){
                block[blockName].block = innerBlocks;
            }
            return '';
        });
        
        blockTpl.replace(/\!@#\$%wow_block_((?!%\$#@\!).+)%\$#@\!/g, 
            function(tpl, name){
            var blockChild = blockChildren[name],
                blockClass = 'mod-wow-' + name;
            block[name] = {};
            blockChild.tpl && (block[name].tpl = blockChild.tpl);
            blockChild.handler && (block[name].handler = blockChild.handler);
            blockChild.dt && (block[name].dt = blockChild.dt);
            blockChild.css && (block[name].css = blockChild.css);
            return '';
        });
        return block;
    };

    grunt.registerMultiTask('tplbuild', 'build tpl.', function() {
        var options = this.options(),
            depsModule = grunt.config('depsModule'),
            output = grunt.config('output'),
            router = grunt.config('router'),
            layout = options.layout,
            routerJson = {},
            ld = options.leftDelimiter || '{%',
            rd = options.rightDelimiter || '%}',
            isUseLocalData = options.isLocalData,
            dataSrc = options.dataSrc || '';
        moduleName = grunt.config('moduleName');
        parentBlocks = options.parentBlocks || [];
        basePath = path.resolve('..').replace(sepReg, '/');

        if (moduleName == 'common'){
            return;
        }

        var routerBase = routerJson['.*'] = {
            block: {},
            router: {}
        };

        if (layout){
            if (grunt.file.isFile(layout)){
                var original = grunt.file.read(layout),
                    blocks = _getBlockInfo(original, ld, rd, path.dirname(layout));

                for (var blockName in blocks){
                    var block = blocks[blockName];
                    if (block.tpl){
                        var fileName = 'layout.' + blockName + '.dust';
                        grunt.file.write(
                            output + '/static/' + moduleName + 
                            '/js/tpl/' + fileName, 
                            block.tpl);
                        block.tpl = moduleName + '/static/js/tpl/' + 
                            path.basename(fileName, '.dust');
                    }
                    routerBase.block[blockName] = block;
                }
            }
            else{
                throw new Error('Do not have a layout file "' + layout + '"');
            }
        }

        var blockChildInfos = {};
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
            if (isUseLocalData){
                var fileName = path.basename(routerItem.tpl, '.dust') + '.json';
                dataSrc = /\/$/.test(dataSrc) ? dataSrc : dataSrc + '/';
                if (grunt.file.isFile(dataSrc + fileName)){
                    routerItem.ds = '/' + moduleName + '/' + dataSrc + fileName;
                }
            }
            if (routerItem.ds){
                if (routerItem.ds.indexOf('?') > -1){
                    routerItem.ds += '&req_id=' + new Date().getTime();
                }
                else{
                    routerItem.ds += '?req_id=' + new Date().getTime();
                }
            }
            var src = routerItem.tpl;
            if (/^\//.test(src)){
                src = routerItem.tpl.replace('/' + moduleName + '/', '');
            }

            if (grunt.file.isFile(src)){
                var original = grunt.file.read(src);

                original = original.replace(
                    /(<img.+src=['"]?)([^'"]+)(['"]?.*)(>|\/>|><\/img>)/g, 
                    function(scr, f, src, kuo,e){
                        if(/\{[^\{\}]+\}/.test(src)){
                            return f + src + kuo + e;
                        }
                        return f + '__url(' + src + ')' + kuo + e;
                });

                var blocks = _getBlockInfo(original, ld, rd, path.dirname(src));

                blockChildInfos[routerKey] = {
                    block: {}
                };
                for (var blockName in blocks){
                    var block = blocks[blockName];
                    if (block.tpl){
                        var fileName = path.basename(src, '.dust') + '.' + blockName + '.dust';
                        grunt.file.write(
                            output + '/static/' + moduleName + 
                            '/js/tpl/' + fileName, 
                            block.tpl);
                        block.tpl = moduleName + '/static/js/tpl/' + 
                            path.basename(fileName, '.dust');
                        routerItem.ds && (block.ds = routerItem.ds);
                        routerItem.title && (block.title = routerItem.title);
                    }
                    blockChildInfos[routerKey].block[blockName] = block;
                }
            }
            else{
                throw new Error('Do not have file "' + routerItem.tpl + '"');
            }
        }
        routerBase.router = blockChildInfos;
        grunt.file.write(
            'output/static/' + moduleName + '/js/router.js', 
            [
            'define("' + moduleName + '/static/js/router"',
                ', function(require, exports, module){\n\n',
                'return ' + JSON.stringify(routerJson) + ';',
            '\n\n});'
        ].join(''));
    });
};