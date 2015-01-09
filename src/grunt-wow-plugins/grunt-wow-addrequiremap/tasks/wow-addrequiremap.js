var path = require('path');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

module.exports = function(grunt){
    'use strict';

    var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    
    grunt.registerMultiTask('wow-addrequiremap', 'add the require map to the entrance', function() {
        var options = this.options();
        var moduleName = grunt.config('name');
        var moduleDist = grunt.config('dist');
        var modulePath = grunt.config('path');
        var entrances = grunt.config('entrance');
        var deps = grunt.config('deps');
        var urlMap = grunt.config('wowUrlMap');
        var basePath = grunt.config('wowCdnBase') || '/static';
        var wowRequireMapName = 'wowRequireMap' + new Date().getTime();
        var isSetBase = options.isSetBase;
        var insertScript = ['<script>var ' + wowRequireMapName + '={};</script><script>'];

        if (!entrances || !entrances.length){
            return;
        }

        if (!deps || !deps.length){
            return;
        }

        console.log(isSetBase);
        entrances.forEach(function(ent, index){
            var entPath = path.join(
                moduleDist, 'build/tpl', modulePath, 
                path.relative(path.join(modulePath, 'src'), ent)).replace(sepReg, '/');

            var original = grunt.file.read(entPath);

            if (!isSetBase){
                deps.forEach(function(depPath){
                    var depName = depPath.replace(/\//g, '_');
                    var reMapPath = path.join('./', depPath, 'conf', 'require_map.js').replace(sepReg, '/');
                    insertScript.push([
                        '{{assign var="' + depName + 'RequireMap" ',
                        'value="`$smarty.current_dir`/' + reMapPath + '"}}',
                        '{{if is_file($' + depName + 'RequireMap)}}',
                            wowRequireMapName + '["' + depName + '"]={{include file="./' + reMapPath + '"}};',
                        '{{/if}}'
                    ].join(''));
                });

                insertScript.push([
                    'var require={paths:{}};',
                    'for(var n in ' + wowRequireMapName + '){',
                        'var pt=' + wowRequireMapName + '[n];',
                        'for(pa in pt){',
                            'require.paths[pa]="' + basePath + '/"+pt[pa]',
                        '}',
                    '}'
                ].join(''));
            } else{
                insertScript.push('var require={baseUrl:"' + basePath + '"};');
            }

            insertScript.push('</script>');

            var proFile = original.replace(
                /<script.+src=['"]?[^'"]+['"]?><\/script>/, 
                function(scr){
                    return [
                        insertScript.join(''),
                        scr
                    ].join('\n');
                });
                
            grunt.file.write(entPath, proFile);
        });
    });
};