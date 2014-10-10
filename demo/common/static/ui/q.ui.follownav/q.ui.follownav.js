var _setArrowLeft = function($wrapper, $target, $arrow) {
    var wrapperOffset = $wrapper.offset(),
        targetOffset = $target.offset(),
        targetWidth = $target.width(),
        arrowWidth = $arrow.width();

    $arrow.css('left',
        targetOffset.left - wrapperOffset.left +
        (targetWidth - arrowWidth) / 2 + 'px');
};

var _init = function(wrapper, options) {
    var options = options || {},
        $wrapper = $(wrapper),
        $arrow = options.arrow ? $(options.arrow) : null,
        itemClass = options.itemClass,
        hoverClass = options.hoverClass || 'slider-hover',
        currentClass = options.currentClass || 'slider-current',
        setCurrentEvent = options.setCurrentEvent || 'click',
        itemSelector = ' .' + itemClass || '>a',
        $current = $wrapper.find(itemSelector + '.' + currentClass);

    if (!$arrow || !$arrow[0]) {
        return;
    }

    if ($current && $current[0]) {
        _setArrowLeft($wrapper, $current, $arrow);
    }

    $wrapper.addClass('q-ui-follownav');
    if ($arrow && $arrow[0]) {
        $arrow.addClass('slider-arrow');
    }
    $wrapper.on('mouseover', itemSelector, function(e) {
        var $this = $(this);
        $this.addClass(hoverClass);

        _setArrowLeft($wrapper, $this, $arrow);
        if (setCurrentEvent == 'mouseover') {
            $wrapper.find(itemSelector + '.' + currentClass)
                .
            removeClass(currentClass);
            $this.addClass(currentClass);
        }
    })
        .on('mouseout', itemSelector, function(e) {
            var $this = $(this);
            $this.removeClass(hoverClass);

            _setArrowLeft($wrapper, $this, $arrow);

            var $current = $wrapper.find(itemSelector + '.' +
                currentClass);
            if ($current && $current[0]) {
                _setArrowLeft($wrapper, $current, $arrow);
            }
        });
    if (setCurrentEvent != 'mouseover') {
        $wrapper.on(setCurrentEvent, itemSelector, function(e) {
            var $this = $(this);
            $wrapper.find(itemSelector + '.' + currentClass)
                .
            removeClass(currentClass);
            $this.addClass(currentClass);
        });
    }
};

module.exports = {
    init: _init
};
