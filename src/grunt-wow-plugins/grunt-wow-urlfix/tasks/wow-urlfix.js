var path = require('path');
var sepReg = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
var urlMap = {};

var _replaceFlagUrl = function(str){
    return str.replace(/__url\((['"]?)([^'"\(\)]*)(['"]?)\)/g, function(scr, lq, src, rq){
        var mapSrc = urlMap[src];
        if (mapSrc){
            return lq + mapSrc + rq;
        }
        return src;
    });
};

var _replaceHandler = {
    html: function(str){
        var jsList = [];
        var cssList = [];

        return str.replace(/(<script[^>'"]+src=['"]?)([^'"]+)(['"]?[^>]*><\/script>)/g, function(scr, f, src, e){
            var mapSrc = urlMap[src];
            if (mapSrc){
                if (jsList.indexOf(mapSrc) > -1){
                    return '';
                }
                jsList.push(mapSrc);
                return f + mapSrc + e;
            }
            return scr;
        }).replace(/(<link[^>]+href=['"]?)([^'"]+)(['"]?[^>]*)(>|\/>|><\/link>)/g, function(scr, f, src, kuo,e){
            var mapSrc = urlMap[src.replace(/\.less$/, '.css')];
            if (mapSrc){
                if (cssList.indexOf(mapSrc) > -1){
                    return ''
                }
                cssList.push(mapSrc);
                return f + mapSrc + kuo + e;
            }
            return scr;
        }).replace(/(<img[^>]+src=['"]?)([^'"]+)(['"]?[^>]*)(>|\/>|><\/img>)/g, function(scr, f, src, kuo,e){
            var mapSrc = urlMap[src];
            if (mapSrc){
                return f + mapSrc + kuo + e;
            }
            return scr;
        });
    },
    css: function(str){
        return str.replace(
            /(background\-image|background)(\s*:[^;{}]*url\()['"]?([^'"\)]+\.png|[^'"\)]+\.jpg|[^'"\)]+\.gif)['"]?(\))/g, 
            function(scr, f, sec, src, e){
                var mapSrc = urlMap[src];
                if (mapSrc){
                    return f + sec + mapSrc + e;
                }
                return scr;
        });
    },
    js: function(str){
        return _replaceFlagUrl(str);
    },
    tpl: function(str){
        var jsList = [];
        var cssList = [];
        return str.replace(/(<img[^>='"]+src=['"]?)([^'"{}]+)(['"]?.*)(>|\/>|><\/img>)/g, function(scr, f, src, kuo,e){
            return f + '__url(' + src + ')' + kuo + e;
        });
    }
};

module.exports = function(grunt){
    grunt.registerMultiTask('wow-urlfix', 'fix the url', function() {
        urlMap = grunt.config('wowUrlMap');
        var options = this.options();
        this.files.forEach(function(filePair){
            var fileSrc = filePair.src[0];
            var original = grunt.file.read(fileSrc);

            if (_replaceHandler[options.type]){
                var targetFile = _replaceHandler[options.type](original);
                grunt.file.write(filePair.dest, targetFile);
            }
        });
    });
};