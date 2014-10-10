var qUiFollowNav = require('common/static/ui/q.ui.follownav/q.ui.follownav');

module.exports = {
    init: function() {
        $('.case-info .item')
            .mouseenter(function() {
                var $this = $(this),
                    name = $this.find('i')
                    .attr('class')
                    .split(' ')[1];

                if ($('.case-hover')
                    .hasClass(name)) {
                    $('.case-all' + ' ' + '.' + name)
                        .removeClass('dis')
                        .siblings()
                        .addClass('dis');
                }
                $this.parent()
                    .find('.jiantou')
                    .removeClass('dis');
                $this.parent()
                    .siblings()
                    .find('.jiantou')
                    .addClass('dis');
            });
        qUiFollowNav.init(
            $('.mod-ability-content .case-info'), {
                arrow: $('.mod-ability-content .case-info .case-list-arrow'),
                itemClass: 'item',
                currentClass: 'current',
                setCurrentEvent: 'mouseover'
            });
    }
}
