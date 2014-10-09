module.exports = function(grunt){
    'use strict';

    var path = require('path');

    grunt.registerMultiTask('rename', 'File rename.', function() {
        var options = this.options(),
            moduleName = grunt.config('moduleName'),
            depsModule = grunt.config('depsModule'),
            output = grunt.config('output'),
            regReplaces = options.reg;

        this.files.forEach(function(filePair){
            var dest = path.basename(filePair.dest);
            if (regReplaces){
                for (var reg in regReplaces){
                    var regExp = new RegExp(reg, 'g');
                    dest = dest.replace(regExp, regReplaces[reg]);
                }
            }
            
            if (grunt.file.isFile(filePair.src[0])){
                grunt.file.copy(filePair.src[0], path.dirname(filePair.dest) + path.sep + dest);
            }
        });
        this.files.forEach(function(filePair){
            if (grunt.file.exists(filePair.src[0])){
                try{
                    grunt.file.delete(filePair.src[0], {
                        force: true
                    });
                }
                catch(e){}
            }
        });
    });
};