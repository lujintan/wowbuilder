/* 通用弹出框插件 by luzhe */
/* 支持dialog, alert, confirm三个方法，其中后两个为dialog的简易版*/

/* 
 * options: {
 *   title        标题
 *   content      内容，可以插入html标签
 *   btns: [{     支持多个自定义按钮
 *     btnText    按钮文字
 *     btnClass   加在dialog-btn之后, 最常用的为dialog-btn-blue
 *     closeFlag  点击是否关闭窗口
 *     btnAction  按钮响应事件
 *   }]
 *   closeAction  窗口关闭事件
 *   zIndex       窗口的z-index值
 *   wrapperClass 自定义的class，可以修改wrapper的样式
 * }
 */
var dialog = function(options) {
    var opt = options || {},
        title = opt.title || '',
        content = opt.content || '',
        btns = opt.btns,
        closeAction = opt.close,
        zIndex = opt.zIndex || 204
    wpClass = opt.wrapperClass ? opt.wrapperClass : '';

    var $dialogWrapper = $('<div class="dialog-wrapper ' + wpClass +
            '"></div>')
        .css({
            zIndex: zIndex
        })
        .appendTo(document.body);
    var $overlay = $('<div class="dialog-overlay"></div>')
        .appendTo(document.body);

    $dialogWrapper.bind('close.dialog', function() {
        _unbindEvents($dialogWrapper);
        $dialogWrapper.remove();
        $overlay.remove();
    })
        .bind('resize.dialog', function() {
            _setPosition($dialogWrapper);
        });

    $('<a href="#" class="dialog-close"></a>')
        .appendTo($dialogWrapper);
    $('.dialog-close, .dialog-overlay')
        .click(function(e) {
            e.preventDefault();
            $dialogWrapper.trigger('close.dialog');
            if (closeAction && typeof closeAction === 'function') {
                closeAction();
            }
        });

    $('<div class="dialog-title">' + title + '</div>')
        .appendTo($dialogWrapper);
    if (!!content) {
        $('<div class="dialog-content">' + content + '</div>')
            .appendTo($dialogWrapper);
    }
    var btns_box = $('<div class="dialog-btns"></div>')
        .appendTo($dialogWrapper);

    for (var i = 0, len = btns.length; i < len; i++) {
        (function(btn) {
            var class_name = btn.btnClass ? btn.btnClass : '';
            var $btn = $(
                '<a href="#" class="dialog-btn ' +
                btn.btnClass + '">' + btn.btnText + '</a>');
            $btn.appendTo(btns_box)
                .click(function(e) {
                    e.preventDefault();
                    var closeFlag = btn.closeFlag === false ? false :
                        true;
                    if (!!closeFlag) {
                        $dialogWrapper.trigger('close.dialog');
                    }
                    if (!!btn.btnAction && typeof btn.btnAction ===
                        'function') {
                        btn.btnAction();
                    }
                });
        })(btns[i]);
    }

    $(window)
        .resize(function() {
            $dialogWrapper.trigger('resize.dialog');
        });
    _setPosition($dialogWrapper);
}

/*
 * options 可以为字符串，表示弹窗内容
 *
 * options {
 *   okText   确定按钮的文字
 *   okAction 确定按钮的事件
 * }
 *
 * 与dialog方法相比只有一个参数不同
 * 不需要btns，只需传入okText和okAction即可
 */
var alert = function(options) {
    if (typeof options == 'string') {
        dialog({
            title: options,
            btns: [{
                btnText: '确定',
                btnClass: 'dialog-btn-blue'
            }]
        });
        return;
    }

    options.btns = [{
        btnText: options.okText || '确定',
        btnClass: 'dialog-btn-blue',
        btnAction: options.okAction
    }];

    dialog(options);
};

/*
 * options {
 *   okText       确定按钮的文字
 *   okAction     确定按钮的事件
 *   cancelText   取消按钮的文字
 *   cancelAction 取消按钮的事件
 * }
 *
 * 与dialog方法相比只有一个参数不同
 * 不需要btns，需传入okText,okAction,cancelText,cancelAction
 */
var confirm = function(options) {
    options.btns = [{
        btnText: options.okText,
        btnClass: 'dialog-btn-blue',
        btnAction: options.okAction
    }, {
        btnText: options.cancelText,
        btnAction: options.cancelAction
    }];

    dialog(options);
};

function _unbindEvents($dialogWrapper) {
    $dialogWrapper
        .unbind('.dialog')
        .find('.btn,.dialog-close')
        .unbind('click.dialog');
}

function _setPosition($dialogWrapper) {
    var width = $dialogWrapper.outerWidth();
    var height = $dialogWrapper.outerHeight();
    var left = ($(window)
        .width() - width) / 2;
    var top = ($(window)
        .height() - height) / 2;
    $dialogWrapper.css({
        left: left,
        top: top
    });
}

module.exports = {
    dialog: dialog,
    alert: alert,
    confirm: confirm
};
