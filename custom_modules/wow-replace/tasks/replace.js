module.exports = function(grunt){
    'use strict';

    var mapJson = {},
        domains = [];

    grunt.registerMultiTask('replace', 'string replace.', function() {
        var options = this.options(),
            moduleName = grunt.config('moduleName'),
            depsModule = grunt.config('depsModule'),
            output = grunt.config('output');

        this.files.forEach(function(filePair){
            var original = grunt.file.read(filePair.src[0]),
                originalResult = original;
            if (options.reg){
                for (var rule in options.reg){
                    originalResult = originalResult.
                        replace(new RegExp(rule, 'g'), options.reg[rule]);
                }
            }

            if (options.unicode){
                originalResult = originalResult.replace(/[^\x00-\xff]/g, function(cn){
                    return escape(cn).replace('%', '\\').toLowerCase();
                });
            }
            grunt.file.write(filePair.dest, originalResult);
        });
    });
};