module.exports = function(grunt){
    'use strict';
    
    var path = require('path');

    grunt.registerMultiTask('definewrap', 'define wrap.', function() {
        var options = this.options();
        this.files.forEach(function(filePair){
            var paths = filePair.src[0].replace(/\.js$/, '').split('/');
                
            paths.splice(0, 1);

            var t = paths[0];
            paths[0] = paths[1];
            paths[1] = t;

            var mapPath = paths.join('/');

            var original = grunt.file.read(filePair.src[0]);
            if (/^\s*define\(/.test(original)){
                return;
            }
            original = original.replace(/(module\.)?exports ?= ?/g, 'return ');

            var depsCss = '';
            if (grunt.file.isFile(filePair.src[0].replace(/\.js$/, '.css'))){
                depsCss = 'css!' + mapPath + '_css';
            }

            var proFile = [
                'define("',
                    mapPath,
                    '",',
                    options.csswrap ? (depsCss ? '["' + depsCss + '"],' : '') : '',
                    'function(require, exports, module){\n\n',
                    original,
                '\n\n});'
            ].join('');
            grunt.file.write(filePair.dest, proFile);
        });
    });
};