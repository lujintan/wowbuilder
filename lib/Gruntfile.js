/*global module:false*/
var path = require('path'),
    defaultTaskConf = require('./grunt_tasks_conf.js');

/**
 * set empty object when the target's property is undefined
 * @param  {Object} obj
 * @param  {Array} arrPro
 * @return {void}
 */
var _fnFixEmptyPro = function(obj, arrPro){
    arrPro.forEach(function(key){
        var val = obj[key];
        if (typeof val == 'undefined'){
            obj[key] = {};
        }
    });
};

/**
 * remove the repeat items in array
 * @param  {Array} arr
 * @return {Array}
 */
var _fnArrayUnique = function(arr){
    var arrUnique = arr.filter(function(item, index){
        if (arr.indexOf(item) === index){
            return true;
        }
    });
    return arrUnique;
};

module.exports = function(grunt) {
    //module base path
    var basePath = path.resolve('.'),
        //read the config
        pkg = grunt.file.readJSON(basePath + '/package.json'),
        //wow builder config
        wowConfig = pkg.wow || {},
        //module name
        moduleName = wowConfig.name;

    _fnFixEmptyPro(wowConfig, ['local', 'remote', 'online']);

    //must set a module name in package.json
    if (!moduleName) {
        throw new Error('You must set a name in package.json');
    }
        //module url path
    var modulePath = wowConfig.path || moduleName,
        //dependency of modules, all modules dependents on module common
        depsModule = _fnArrayUnique(wowConfig.deps ? 
            ['common'].concat(wowConfig.deps) : ['common']);
        //remote file receiver, will post file to this url when running remote task
        receiver = wowConfig.receiver || '',
        //set output directory
        output = wowConfig.output || 'output',
        //fe template extend file name
        feTplExt = wowConfig.feTplExt || 'dust',
        //js template extend file name
        beTplExt = wowConfig.beTplExt || 'tpl',

        //module local conf
        confLocal = wowConfig.local || {},
        //module remote conf
        confRemote = wowConfig.remote || {},
        //module online conf
        confOnline = wowConfig.online || {},
        //module router config
        confRouter = wowConfig.router || {},
        //package config
        confPack = wowConfig.pack || {},
        //keywords config
        confKeywords = ['name', 'path', 'pack', 'ds', 'router', 'options'],
        confTasksStep = {
            'local': ['local', 'dev', 'all'],
            'remote': ['remote', 'dev', 'server', 'all'],
            'online': ['online', 'server', 'all']
        },
        //data source config
        confDs = wowConfig.ds || {},
        confWow = {
            name: modulePath,
            deps: depsModule,
            receiver: receiver,
            output: output,
            local: confLocal,
            remote: confRemote,
            feTplExt: feTplExt,
            beTplExt: beTplExt,
            online: confOnline,
            ds: confDs
        },
        //default grunt config
        confDefault = defaultTaskConf.getConf(confWow),
        //default grunt task
        confDefaultTask = defaultTaskConf.getTask(confWow);

    //set real ds map path
    for (var ds in confDs){
        confDs[ds] = '/' + moduleName + '/' + confDs[ds];
    }

    //set grunt default config
    var gruntConfig = {};
    for (var cKey in confDefault){
        gruntConfig[cKey] = confDefault[cKey];
    }
    gruntConfig.moduleName = moduleName;
    gruntConfig.modulePath = modulePath;
    gruntConfig.output = output;
    gruntConfig.router = confRouter;
    gruntConfig.depsModule = depsModule;
    gruntConfig.confLocal = confLocal;
    gruntConfig.feTplExt = feTplExt;
    gruntConfig.beTplExt = beTplExt;


    var getRealTasks = function(tKey, taskName, task, defTaskItem, isHook){
        var taskHead = task.replace(/:.*/, ''),
            taskEnd = task.replace(taskHead, '').replace(':', '');
        if (gruntConfig[taskHead] || taskInfo[task]){
            for (var index = 0, dLen = defTaskItem.length ; index < dLen ; index++){
                var stepOrderList = confTasksStep[tKey],
                    runTask = defTaskItem[index];
                if (new RegExp(taskName + 
                    ':(' + stepOrderList.join('|') + ')').
                    test(runTask)){
                    var realTaskName = taskHead + ':' + tKey + taskEnd;
                    if (isHook){
                        defTaskItem = defTaskItem.slice(0, index).
                            concat(realTaskName, defTaskItem.slice(index, defTaskItem.length));
                        
                        break;
                    }
                    else{
                        if (stepOrderList){
                            for (var i = 0, len = stepOrderList.length ; 
                                i < len ; i++){
                                var renderKey = stepOrderList[i];
                                if (gruntConfig[taskHead] && 
                                    gruntConfig[taskHead][renderKey]){
                                    realTaskName = taskHead + ':' + renderKey
                                    break;
                                }
                            }
                        }
                        defTaskItem[index] = realTaskName;
                    }
                }
            }
        }
        return defTaskItem;
    };

    //set default grunt tasks config
    var gruntTasks = confDefaultTask;
    for (var tKey in wowConfig){
        if (confKeywords.indexOf(tKey) < 0){
            var taskItem = wowConfig[tKey],
                defTaskItem = gruntTasks[tKey];
            if (defTaskItem){
                var taskInfo = taskItem.tasks || {};
                taskInfo.compiletpl = taskInfo.compiletpl || 'dust';
                taskInfo.compilehtml = taskInfo.compilehtml || 'dusthtml';
                for (var taskName in taskInfo){
                    var task = taskInfo[taskName],
                        taskHead = taskName.replace(/:.*/, ''),
                        taskEnd = taskName.replace(taskHead, '').replace(':', '');

                    gruntDefConf = gruntConfig[taskHead] || {};

                    if (gruntDefConf == 'hook'){
                        var task = [].concat(task);
                        task.forEach(function(taski){
                            if (typeof taski == 'string'){
                                defTaskItem = getRealTasks(
                                    tKey, taskName, taski, defTaskItem, true);
                            }
                        });
                    }
                    else{
                        if (typeof task == 'string'){
                            defTaskItem = getRealTasks(
                                tKey, taskName, task, defTaskItem);
                        }
                        else{
                            gruntDefConf[tKey + taskEnd] = task;
                        }
                    }
                }
                gruntTasks[tKey] = defTaskItem;
            }
        }
    }

    //remove hook task
    for (var tType in gruntTasks){
        var typeInfo = gruntTasks[tType];
        for (var i = 0, len = typeInfo.length ; i < len ; i++){
            var taskName = typeInfo[i],
                taskHead = taskName.replace(/:.*/, ''),
                taskEnd = taskName.replace(taskHead, '').replace(':', '');

            if (gruntConfig[taskHead] && gruntConfig[taskHead] == 'hook'){
                typeInfo.splice(i--, 1);
                len = typeInfo.length;
            }
        }
        gruntTasks[tType] = typeInfo;
    }

    //init grunt config
    grunt.initConfig(gruntConfig);

    //default plugin dir
    var moduleDir = path.resolve(__dirname, '..');
    //load grunt plugin
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-copy/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-less/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-csslint/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-imagemin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-jshint/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-cssmin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-htmlmin/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-uglify/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-contrib-clean/tasks');
    
    grunt.loadTasks(moduleDir + '/node_modules/grunt-dust/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-dust-html/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-jsbeautifier/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-devserver/tasks');
    grunt.loadTasks(moduleDir + '/node_modules/grunt-http-upload/tasks');

    //load custom grunt plugin
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-tplbuild/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-urlfix/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-definewrap/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-filemap/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-replace/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-concat/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-importrequiremap/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-addtpl/tasks');
    grunt.loadTasks(moduleDir + '/lib/grunt_plugins/wow-rename/tasks');

    //regester grunt tasks
    for (var task in gruntTasks) {
        grunt.registerTask(task, gruntTasks[task]);
    }
};
