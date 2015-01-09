/**
 * object extend
 * @param {Object} objOri original object
 * @param {Object} objTar target object
 */
var _fnObjExtend = function(child, parent){
    var i,
        toStr = Object.prototype.toString,
        astr = "[object Array]";
    child = child || {};
    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] === "object") {
                child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                _fnObjExtend(child[i], parent[i]);
            } else {
                child[i] = parent[i];
            }
        }
    }
    return child;
};

module.exports = {
    /**
     * Setting a empty object to the undefined variable
     * @param  {Object} obj    the object
     * @param  {Array} arrPro  attribute to fix
     * @return {[type]}        [description]
     */
    fnFixEmptyPro: function(obj, arrPro){
        arrPro.forEach(function(key){
            var val = obj[key];
            if (typeof val == 'undefined'){
                obj[key] = {};
            }
        });
    },

    /**
     * remove the repeat items in array
     * @param  {Array} arr
     * @return {Array}
     */
    fnArrayUnique: function(arr){
        var arrUnique = arr.filter(function(item, index){
            if (arr.indexOf(item) === index){
                return true;
            }
        });
        return arrUnique;
    },

    /**
     * load the grunt tasks
     * @param {Grunt} grunt   grunt object
     * @param {Array} file paths
     * @return {[type]} [description]
     */
    fnGruntPluginLoader: function(grunt, paths){
        paths.forEach(function(path){
            grunt.loadTasks(path + '/tasks');
        });
    },

    /**
     * object for in 
     * @param  {object}   obj 
     * @param  {Function} cb  callback
     * @return {void}
     */
    fnObjForin: function(obj, cb){
        for (var i in obj){
            if (obj.hasOwnProperty(i)){
                cb && cb(obj[i], i);
            }
        }
    },

    /**
     * object for in 
     * @param  {object}   obj 
     * @param  {Function} cb  callback
     * @return {void}
     */
    fnObjLength: function(obj) {
        var index = 0;
        for (var i in obj){
            if (obj.hasOwnProperty(i)){
                index++;
            }
        }
        return index;
    },

    /**
     * object extend
     * @param {Object} objOri original object
     * @param {Object} objTar target object
     */
    fnObjExtend: _fnObjExtend
};