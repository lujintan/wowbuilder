module.exports = function(grunt){
    'use strict';

    var path = require('path'),
        domains = [];

    grunt.registerMultiTask('importrequiremap', 'string replace.', function() {
        var options = this.options(),
            moduleName = grunt.config('moduleName'),
            depsModule = grunt.config('depsModule'),
            output = grunt.config('output'),
            type = options.type || 'tpl',
            mapJson = grunt.file.readJSON('./' + output + 
                '/conf/' + moduleName + '_map.json'),
            insertScript = ['<script type="text/javascript">var wowRequireMap={};</script>'];

        if (depsModule.indexOf(moduleName) < 0){
            depsModule.unshift(moduleName);
        }

        if (type == 'script'){
            depsModule.forEach(function(mod){
                var mapUrl = '../output/' + mod + '/' + output + 
                    '/conf/' + mod + '_map.json';

                insertScript.push('<script type="text/javascript" src="/' +
                    mod + '/' + output + '/conf/' + mod + '_require_map.js"></script>');
            });
        }
        else{
            insertScript.push('<script type="text/javascript">');
            depsModule.forEach(function(mod){
                insertScript.push([
                    '{{assign var="' + mod + 'RequireMap" ',
                    'value="`$smarty.current_dir`/../conf/' + mod + '_require_map.js"}}',
                    '{{if is_file($' + mod + 'RequireMap)}}',
                    '{{include file="../conf/' + mod + '_require_map.js"}}',
                    '{{/if}}'
                ].join(''));
            });
            insertScript.push('</script>');
        }
        insertScript.push([
            '<script type="text/javascript">',
                'var require={paths:{}};',
                'for(var n in wowRequireMap){',
                    'var pt=wowRequireMap[n];',
                    'for(pa in pt){',
                        'require.paths[pa]=pt[pa]',
                    '}',
                '}',
            '</script>'
        ].join(''));

        for (var key in mapJson.paths){
            if (path.extname(key) == '.js'){
                mapJson.paths[key.replace(/\.js$/, '').replace(/^\//, '')] = 
                    mapJson.paths[key].replace(/\.js$/, '');
            }
            delete mapJson.paths[key];
        }
        if (mapJson.deps){
            delete mapJson.deps;
        }

        this.files.forEach(function(filePair){
            var fileSrc = filePair.src[0],
                fileType = path.extname(fileSrc);
            // switch(fileType){
            //     case '.html':
                    var original = grunt.file.read(fileSrc),
                        proFile = original.replace(
                        /<script.+src=['"]?[^'"]+['"]?><\/script>/, 
                        function(scr){
                            return [
                                insertScript.join(''),
                                scr
                            ].join('\n');
                        });
                        
                    grunt.file.write(filePair.dest, proFile);
                    // break;
            //     case '.tpl':
                    
            //     break;
            // }
        });
    });
};