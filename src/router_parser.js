/**
 * Created by lujintan on 12/12/14.
 */

var fs = require('fs');
var keyExtend = require('./keys/extend');
var keyBlock = require('./keys/block');
var keyTitle = require('./keys/title');

var delimiterReg;
var wowConfig;
var keywords = {
    'extend': keyExtend,
    'title': keyTitle,
    'block': keyBlock
};

var _getConfigInfo = function(configs){
    var type = 'start';
    var configs = configs.replace(/^\//, function(){
        type = 'end';
        return '';
    });
    var configInfos = configs.split(' ');
    var keyIndex = 0;
    var configKeyInfo = {
        type: type,
        param: {},
        tpl: ''
    };
    configInfos.forEach(function(configInfo, index){
        if (configInfo){
            if (keyIndex === 0){
                if (keywords[configInfo]){
                    configKeyInfo.keyword = configInfo;
                }
            } else {
                var paramInfo = configInfo.split('=');
                if (paramInfo[1]){
                    configKeyInfo.param[paramInfo[0]] = paramInfo[1].
                        replace(/(^['"]|['"]$)/g, '');
                } else{
                    configKeyInfo.param[paramInfo[0]] = paramInfo[0];
                }
            }

            keyIndex++;
        }
    });

    if (!configKeyInfo.keyword){
        throw new Error('Unknown keyword!');
    } else{
        return configKeyInfo;
    }
};

var _renderBlock = function(str, pageConf, fileSrc){
    var tpl = str;
    var temps = [];
    var env = {
        output: wowConfig.dist,
        base: wowConfig.base,
        fileSrc: fileSrc
    };

    while(delimiterReg.test(tpl)){
        tpl = tpl.replace(delimiterReg, function(target, str, s, configs){
            var configInfo = _getConfigInfo(configs);
            var keyInfo = keywords[configInfo.keyword];
            
            if (configInfo.type === 'start'){
                if (temps.length > 0){
                    temps[temps.length-1].tpl += str.trim();
                }
                if (keyInfo.type === 'single'){
                    keyInfo.handler && 
                        keyInfo.handler(configInfo, temps[temps.length-1], pageConf, env);
                } else{
                    temps.push(configInfo);
                }
            } else{
                if (keyInfo.type === 'double'){
                    var temp = temps.pop();
                    // console.log(temps);
                    if (temp.keyword === configInfo.keyword){
                        temp.tpl += str.trim();
                        var added = '';
                        if (keyInfo.handler){
                            var added = keyInfo.handler(temp, temps[temps.length-1], pageConf, env) || '';
                            temp.tpl += '';
                        }
                    } else{
                        throw new Error('block error');
                    }
                } else{
                    throw new Error('block error');
                }
            }
            return '';
        });
    }
    return str.trim();
};

/**
 * parse the file to the router config 
 * @return {Object}
 */
var _parse = function(src, config, cb){
    wowConfig = config;
    var ld = config.ld;
    var rd = config.rd;
    var pageConf = {
        block: {}
    };

    delimiterReg = new RegExp([
        '(',
            '((?!' + ld + ')[\\s\\S])*',
        ')',
        ld,
            '(',
                '((?!' + rd + ')[\\s\\S])+[\\s\\S]',
            ')',
        rd
        ].join(''));

    fs.readFile(src, {
        encoding: 'utf8'
    },function(err, content){
        if (err) throw err;
        _renderBlock(content, pageConf, src);
        cb && cb(pageConf);
    });
};

module.exports = {
    parse: _parse
};