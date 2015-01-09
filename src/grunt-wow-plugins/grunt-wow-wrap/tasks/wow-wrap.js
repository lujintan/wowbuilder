module.exports = function(grunt){
    var path = require('path');
    var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');

    grunt.registerMultiTask('wow-wrap', 'add amd wraper', function() {
        var options = this.options();
        var moduleName = grunt.config('name');
        var modulePath = grunt.config('path');
        var isWidget = options.isWidget;
        var widgetCss = '';

        this.files.forEach(function(filePair){
            var fileSrc = filePair.src[0];
            var original = grunt.file.read(fileSrc);
            var fileExtName = path.extname(fileSrc);
            var fileDirName = path.dirname(fileSrc);
            var fileBaseName = path.basename(fileSrc, fileExtName);
            var widgetCssPath = path.join(fileDirName, fileBaseName) + '.css';
            var amdId = path.join(modulePath, 
                path.relative(filePair.orig.cwd, fileDirName)).replace(sepReg, '/');
            var destName = path.dirname(filePair.dest) + '.js';

            if (isWidget){
                if (grunt.file.exists(widgetCssPath)){
                    widgetCss = '"css!' + amdId + '/main"';
                    grunt.file.copy(widgetCssPath, path.dirname(filePair.dest) + path.sep + 'main.css');
                }
            } else{
                amdId = path.join(modulePath, 
                    path.relative(filePair.orig.cwd, fileDirName), fileBaseName).replace(sepReg, '/');
                destName = filePair.dest;
            }

            var r = [
                'var r = [];',
                'var require = function(id){',
                    'r.push(\'"\' + id + \'"\');',
                    'return {};',
                '};try{',
                original,
                '}catch(e){}',
                'module.exports=r;'
            ].join('');


            var requireAmdIds = eval(r);
            var ids = requireAmdIds ? ['"require"', '"exports"', '"module"'].concat(requireAmdIds) : 
                ['"require"', '"exports"', '"module"'];

            if (widgetCss){
                ids.push(widgetCss);
            }

            var cjtContent = original;

            if (!/$define\(/.test(original.trim())){
                cjtContent = [
                    'define("',
                        amdId,
                        '",',
                        '[' + ids.join(',') + ']',
                        ', function(require, exports, module){\n\n',
                        original.replace(/(module\.)?exports ?= ?/g, 'return '),
                    '\n\n});'
                ].join('');
            }
            
            grunt.file.write(destName, cjtContent);
        });
    });
};