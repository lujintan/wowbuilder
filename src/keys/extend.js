var _handler = function(conf, parent, pageConf){
    var params = conf.param;
    var file = params.file;

    pageConf.layout = file;

    return '';
};

module.exports = {
    key: 'extend',
    type: 'single',
    handler: _handler
};