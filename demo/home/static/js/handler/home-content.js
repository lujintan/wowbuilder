require('home/static/ui/jquery.carousel/jquery.carousel');

var qUiFollowNav = require('common/static/ui/q.ui.follownav/q.ui.follownav'),
    $wrap = null;

var _addAttr = function() {
    $('.group1', $wrap)
        .addClass('current1');
    $('.group2', $wrap)
        .addClass('current2');
    $('.group3', $wrap)
        .addClass('current3');
    $('.group4', $wrap)
        .addClass('current4');
};

var _handlerWinScroll = function() {
    var a = document.getElementById('appworkssection')
        .offsetTop;
    if (a >= $(window)
        .scrollTop() && a < ($(window)
            .scrollTop() + $(window)
            .height())) {
        setTimeout(function() {
            _addAttr();
        }, 500);
    }
};

module.exports = {
    init: function($wp, data) {
        var self = this,
            $wrap = $wp;
        $('.case-info .item', $wrap)
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
            });

        qUiFollowNav.init(
            $('.case-info', $wrap), {
                arrow: $('.case-info .case-list-arrow', $wrap),
                itemClass: 'item',
                currentClass: 'current',
                setCurrentEvent: 'mouseover'
            });

        self.toggleActivityImage(0);
        self.renderBanner(data);
        $('#events .link', $wrap)
            .each(function(i, item) {
                $(item)
                    .mouseenter(function() {
                        self.toggleActivityImage(i);
                    });
            });
        $(window)
            .scroll(_handlerWinScroll);
    },
    destroy: function() {
        $(window)
            .unbind('scroll', _handlerWinScroll);
    },
    renderBanner: function(data) {
        var da = data.banner;
        $('.banner', $wrap)
            .carousel({
                items: da
            });
    },
    toggleActivityImage: function(index) {
        $('#events .link', $wrap)
            .each(function(i, item) {
                if (index == i) {
                    $(item)
                        .find('img')
                        .show();
                } else {
                    $(item)
                        .find('img')
                        .hide();
                }
            });

    }
}
