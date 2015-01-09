var path = require('path');
var util = require('./utils.js');
var confCommon = require('./config_common.js');

var _grunt = function(grunt){
    var basePath = path.resolve('.');   //module base path
    var pkgConf = grunt.file.readJSON(basePath + '/package.json');  //read the config
    var wowConfig = pkgConf.wow || {};      //wow builder config
    var moduleName = wowConfig.name;    //module name

    util.fnFixEmptyPro(wowConfig, ['tasks']);   //fix empty property

    if (!moduleName) {  //must set a module name in package.json
        throw new Error('You must set a module name(wow.name) in package.json');
    }

    var modulePath = wowConfig.path || moduleName;  //module dist path
    var widgetPath = wowConfig.widget || 'src/widget';   //module's widget path
    var serverbase = wowConfig.serverbase || '../webroot';    //local server's webroot
    //the modules depends on
    var depsModule = util.fnArrayUnique(wowConfig.deps ? ['common'].concat(wowConfig.deps) : ['common']);
    //remote file receiver, will post file to this url when running remote task
    var receiver = wowConfig.receiver || '';
    var dist = wowConfig.dist || 'dist';
    var confTasks = wowConfig.tasks;    //module task conf
    var confRemote = wowConfig.remote;    //module remote conf
    var confOnline = wowConfig.online;      //module online conf
    var confRouter = wowConfig.router || {};    //module router config
    var confEntrance = wowConfig.entrance || [];    //module router config
    var confLayout = wowConfig.layout || '';
    var confRewrite = wowConfig.rewrite || {};
    var confPack = wowConfig.pack || {};    //package config

    //module base dir
    var moduleDir = path.resolve(__dirname, '..');

    var gruntConfig = {
        name: moduleName,
        path: modulePath,
        dist: dist,
        widget: widgetPath,
        serverbase: serverbase,
        deps: depsModule,
        entrance: confEntrance
    };

    util.fnObjExtend(gruntConfig, confCommon);

    //load grunt tasks
    util.fnGruntPluginLoader(grunt, [
        moduleDir + '/node_modules/grunt-contrib-copy',         //copy file
        moduleDir + '/node_modules/grunt-contrib-less',         //less compile
        moduleDir + '/node_modules/grunt-contrib-csslint',      //css lint
        moduleDir + '/node_modules/grunt-contrib-jshint',       //js hint
        moduleDir + '/node_modules/grunt-contrib-requirejs',    //js hint
        moduleDir + '/node_modules/grunt-contrib-watch',        //watch file
        moduleDir + '/node_modules/grunt-contrib-cssmin',       //css compress
        moduleDir + '/node_modules/grunt-contrib-htmlmin',      //html compress
        moduleDir + '/node_modules/grunt-contrib-uglify',       //js compress
        moduleDir + '/node_modules/grunt-contrib-clean',        //file clean
        moduleDir + '/node_modules/grunt-dust',                 //dust compile
        moduleDir + '/node_modules/grunt-string-replace',       //string replace
        moduleDir + '/node_modules/grunt-jsbeautifier',         //code beautifier

        moduleDir + '/src/grunt-wow-plugins/grunt-wow-wrap',            //add amd wrap
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-spg',             //compile wow template
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-httpserver',      //compile wow template
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-urlmap',          //generate the url map
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-urlfix',          //url fix
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-rewrite',         //generate the rewrite config file
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-httpupload',      //http upload
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-pack',            //file package
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-requiremap',      //generate the require map file
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-md5',             //generate file md5
        moduleDir + '/src/grunt-wow-plugins/grunt-wow-addrequiremap',   //add require map to entrance template
    ]);

    gruntConfig['wow-spg'].common.options.router = confRouter;
    gruntConfig['wow-spg'].common.options.layout = confLayout;
    var entrances = [];
    confEntrance.forEach(function(ent, index){
        entrances.push({
            tpl: ent,
            dist: path.join(dist, 'temp', ent)
        });
    });
    gruntConfig['wow-spg'].common.options.entrance = entrances;

    gruntConfig['wow-rewrite'].common.options.rewrite = confRewrite;
    gruntConfig['wow-rewrite'].common.options.target = 
        dist + '/build/rewrite/' + modulePath.replace(/\//g, '_') + '_rewrite.json';

    gruntConfig['wow-pack'].common.files = (function(){
        var files = [];
        var cwd = './' + dist + '/build/static/' + modulePath;

        util.fnObjForin(confPack, function(item, key){
            var dest = path.join(cwd, key);
            var filsConf = {
                cwd: cwd,
                dest: dest,
                src: []
            };

            item = [].concat(item);

            item.forEach(function(source, index){
                filsConf.src.push(source.
                    replace(/\.dust$/, '.js').
                    replace(/\.less$/, '.css'));
            });

            files.push(filsConf);
        });
        return files;
    })();
    
    var tasks = [
        'clean:common',
        'copy:totemp', 'less:common', 'csslint:common', 'jshint:common', 
        'wow-wrap', 'wow-spg:common', 'wow-urlfix:tplPreFix', 'dust:common', 
        'copy:tobuild', 'string-replace:common', 'wow-urlmap:common', 'wow-pack:common', 
        'uglify:common', 'cssmin:common', 'htmlmin:common', 'wow-md5:common',
        'wow-urlfix:html', 'wow-urlfix:css', 'wow-urlfix:js', 'wow-requiremap:common', 'wow-addrequiremap:common',
        'wow-rewrite:common', 'wow-httpupload:common'];
    var tasksMap = {};
    util.fnObjForin(confTasks, function(item, key){
        tasksMap[key] = {
            tasks: [].concat(tasks),
            isWatching: false
        }
        util.fnObjForin(item, function(task, taskKey){
            if (taskKey === 'localserver' && task){
                tasksMap[key].tasks.push('copy:towebroot');
            }

            if (!gruntConfig[taskKey]){
                return;
            }

            gruntConfig[taskKey][key] = gruntConfig[taskKey][key] || {};
            util.fnObjExtend(gruntConfig[taskKey][key], gruntConfig[taskKey].common);

            if (task.src){
                var srcs = [].concat(task.src);

                gruntConfig[taskKey][key].files[0].src = srcs;
            }
            if (task.options){
                (!gruntConfig[taskKey][key].options) && (gruntConfig[taskKey][key].options = {});
                util.fnObjExtend(gruntConfig[taskKey][key].options, task.options);
            }
            if (task.files){
                gruntConfig[taskKey][key].files = task.files;
            }

            if (!tasksMap[key].isWatching && taskKey === 'watch'){
                tasksMap[key].isWatching = true;
                gruntConfig[taskKey][key].tasks = tasksMap[key].tasks;
            }

            var taskIndex = tasksMap[key].tasks.indexOf(taskKey + ':common');

            if (taskIndex > -1){
                if (task === false){
                    tasksMap[key].tasks.splice(taskIndex, 1);
                } else{
                    tasksMap[key].tasks[taskIndex] = taskKey + ':' + key;
                }
            }
        });
    });
    //grunt init
    grunt.initConfig(gruntConfig);
    util.fnObjForin(tasksMap, function(item, key){
        grunt.registerTask(key, function(){
            grunt.task.run(item.tasks);
            if (item.isWatching){
                grunt.task.run(['watch' + ':' + key]);
            }
        });
    });
};

module.exports = _grunt;