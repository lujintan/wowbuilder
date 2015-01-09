var _handler = function(conf, parent, pageConf){
    var params = conf.param;
    var title = params.name;

    pageConf.title = title;

    return '';
};

module.exports = {
    key: 'extend',
    type: 'single',
    handler: _handler
};