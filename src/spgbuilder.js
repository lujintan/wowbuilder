var fs = require('fs');
var path = require('path');
var Config = require('./Config.js');
var routerParser = require('./router_parser.js');

var config;

var _readDir = function(src, ext){
    var isPathExists = fs.existsSync(src);
    if (isPathExists){
        var realPath =fs.realpathSync(src);
        var sta = fs.statSync(realPath);
        if (sta.isFile()){
            srcList.push(realPath + ext);
        } else if (sta.isDirectory()){
            var dirs = fs.readdirSync(src);
            dirs.forEach(function(dirName, index){
                _readDir(realPath + path.sep + dirName, ext);
            });
        }
    }
};

var _renderInfo = {};
var _renderIndex = 0;

var _renderPage = function(router, tpl, childRouter, cb){
    var parentRouter = {};
    if (childRouter){
        parentRouter = {
            block: {},
            router: {}
        }
        if (childRouter.layout){
            if (_renderInfo[childRouter.layout]){
                parentRouter = _renderInfo[childRouter.layout];
            }
            parentRouter.reg = parentRouter.reg ? parentRouter.reg + '|' + childRouter.reg : childRouter.reg;
            parentRouter.router[childRouter.reg] = {
                title: childRouter.title,
                block: childRouter.block
            };
        }
    }

    
    if (_renderInfo[tpl]){
        _renderIndex++;
        return;
    }
    _renderInfo[tpl] = parentRouter;

    routerParser.parse(tpl, config, function(pageConf){
        parentRouter.title = pageConf.title;
        parentRouter.block = pageConf.block;
        if (router !== null){
            parentRouter.reg = router;
        }
        if (pageConf.layout && pageConf.layout !== 'outer'){
            parentRouter.layout = pageConf.layout;
            _renderPage(null, pageConf.layout, parentRouter, cb);
        } else{
            _renderIndex++;
            cb && cb(parentRouter);
        }
    });
};

var _render = function(cb){
    var routerConfig = config.router;
    var rendercount = 0;
    var layouts = [];
    for (var router in routerConfig) {
        var tpl = routerConfig[router];
        rendercount++;

        if (path.extname(tpl) === ''){
            rendercount++;
            continue;
        }

        _renderPage(router, tpl, null, function(layout){
            layouts.push(layout);
            if (_renderIndex >= rendercount){
                cb && cb(layouts);
                _renderIndex = 0;
            }
        });
    }
};

var _compile = function(options){
    var opt = options || {};
    config = new Config(opt.base, 
        opt.ld, opt.rd, 
        opt.target, opt.router, opt.entrance,
        opt.dist);

    _render(function(layouts){
        var routerConf;
        if (layouts.length > 1){
            routerConf = {
                router: {}
            };
            layouts.forEach(function(layout){
                routerConf.router[layout.reg] = {
                    title: layout.title,
                    block: layout.block,
                    router: layout.router
                }
            });
        } else{
            var layout = layouts[0];
            routerConf = {
                title: layout.title,
                block: layout.block,
                router: layout.router
            };
        }

        //compile OK 
        fs.writeFileSync(config.router, [
            'define(function() {',
                'return ' + JSON.stringify(routerConf) + ';',
            '});'
        ].join(''), {
            encoding: 'utf8'
        });
    });
};

module.exports = {
    compile : _compile
}; 