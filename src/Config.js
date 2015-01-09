var fs = require('fs');
var path = require('path');

var Config = function(base, ld, rd, target, router, entrance, dist){
    this.base = base || './';
    this.base = path.resolve(this.base);
    this.ld = ld || '{%';
    this.rd = rd || '%}';
    this.target = target || 'router.js';
    this.target = path.resolve(this.target);
    this.router = router;
    this.entrance = entrance || [];
    this.dist = dist || './dist'

    if (!fs.existsSync(this.dist)){
        fs.mkdirSync(this.dist);
    }
    this.dist = fs.realpathSync(this.dist);
};

module.exports = Config;