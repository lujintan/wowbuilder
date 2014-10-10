(function($){
function Carousel(options, element){
  this._options = options;
  this.element = $(element);
  this.initialize();
}
$.extend(Carousel.prototype, {
  initialize: function(){
    this.current = null;
    this._create();
    this.goTo(0);
  },
  _create: function(){
    this.element.addClass('mod-q-ui-carousel')
      .prepend([
          '<div class="carousel-wrapper">',
            '<div class="carousel-scenes"></div>',
            '<div class="carousel-scenes"></div>',
          '</div>'
        ].join(''));

    //\u6dfb\u52a0\u63a7\u5236\u70b9
    var items = this._options.items, _this = this;
    if(items && items.length > 1){
      var control = $('<div class="carousel-controls"></div>');

      $.each(items, function(i, items){
        control.append('<span class="item fade-in" data-index="'+i+'"></span>');
      })

      //\u6dfb\u52a0\u6ed1\u5757
      this.slider = $('<span class="item-selected"></span>').appendTo(control);

      control.appendTo(this.element);

      //\u4e3a\u5bfc\u822a\u6dfb\u52a0\u70b9\u51fb\u4e8b\u4ef6
      control.delegate('.item', 'click', function(e){
        _this.goTo($(this).attr('data-index'));
      });

      //resize\u65f6\u8c03\u6574\u6ed1\u5757\u4f4d\u7f6e
      $(window).on('resize.carousel', function(){
        _this.tabTo(_this.current);
      });
    }
  },
  //\u81ea\u52a8\u8f6e\u64ad
  autoChange: function(){
    var _this = this;

    clearTimeout(this.timer);
    this.timer = setTimeout(function(){
      _this.next();
    }, 5000);
  },
  prev: function(){
    var length = this._options.items.length;
    var prev = Number(this.current) - 1;
    prev = prev < 0 ? length - 1 : prev;
    this.goTo(prev);
  },
  next: function(){
    var length = this._options.items.length;
    var next = Number(this.current) + 1;
    next = next < length ? next : 0;
    this.goTo(next);
  },
  goTo: function(page){
    this.current = page;
    this.tabTo(page);
    this.fadeIn(page);
    this.autoChange();
  },
  tabTo: function(page){
    var items = this.element.find('.item').removeClass('current'),
        item = items.eq(page).addClass('current'),
        left = Number(item.position().left);

    this.slider.css('left', left);
  },
  fadeIn: function(page){
    var data = this._options.items[page];
    var item = this._setCurrentScenes(data);
  },
  _setCurrentScenes: function(data){
    var scene, 
        item,
        img = data['image'], 
        bgColor = data['background-color'],
        href = data['href'] || '',
        current = this.currentScenes,
        scenes = this.element.find('.carousel-scenes');
    if(current){
      scenes.each(function(){
        item = $(this);
        if(item[0] == current[0]){
          current.removeClass('fade-in');
        }else{
          scene = item;
        }
      })
    }else{
      scene = scenes.eq(0);
    }
    var innerHtml = [];
    if ('webkitTransition' in document.documentElement.style ||
        'MozTransition' in document.documentElement.style ||
        'msTransition' in document.documentElement.style || 
        'oTransition' in document.documentElement.style ||
        'transition'in document.documentElement.style ){
      if (data.top && data.top.height){
        var _height = parseInt(data.top.height, 10);
        innerHtml.push([
          '<div class="car-item car-top" style="',
            'height:' + _height + 'px;',
            'background-image:url(' + img + ')',
          '"></div>'
        ].join(''));
      }
      if (data.bottom && data.bottom.height){
        var _height = parseInt(data.bottom.height, 10);
        innerHtml.push([
          '<div class="car-item car-bottom" style="',
            'height:' + _height + 'px;',
            'background-image:url(' + img + ')',
          '"></div>'
        ].join(''));
      }
      if (data.left && data.left.width){
        var _width = parseInt(data.left.width, 10);
        innerHtml.push([
          '<div class="car-item car-left" style="',
            'width:' + _width + 'px;',
            'background-image:url(' + img + ')',
          '"></div>'
        ].join(''));
      }
      if (data.right && data.right.width){
        var _width = parseInt(data.right.width, 10);
        innerHtml.push([
          '<div class="car-item car-right" style="',
            'width:' + _width + 'px;',
            'background-image:url(' + img + ')',
          '"></div>'
        ].join(''));
      }
      if (data.bounce && data.bounce.width){
        var _width = parseInt(data.bounce.width, 10),
          _pos = data.pos || 'right';
        innerHtml.push([
          '<div class="car-item car-bounce" style="',
            'width:' + _width + 'px;',
            'height: 100%;',
            _pos == 'right' ? 
              'right:0;' : 'left:0;',
            'background-image:url(' + img + ');',
            'background-position: ' + _pos + ' center;',
          '"></div>'
        ].join(''));
      }
    }

    if (innerHtml.length){
      // console.log(data['background-image']);
      scene.html(innerHtml.join(''))
        .css('background-image', data['background-image'] ?
          'url(' + data['background-image'] + ')' : 'none');
    }
    else{
      scene.html([
        '<div class="car-cover" style="',
          'background-image:url(' + img + ');',
        '"></div>'
        ].join(''))
        .css({
          'background-image': data['background-image'] ?
          'url(' + data['background-image'] + ')' : 'none'
        })
    }
    this.element.css({
      'background-color': bgColor || 'transparent'
    }).attr('data-href', href);
    setTimeout(function(){
      scene.addClass('fade-in')
      [href ? 'addClass' : 'removeClass']('has-link');
    }, 0);
    this.currentScenes = scene;

    return scene;
  },
  option: function(options){

  }
});
$.fn.carousel = function(options){
  var ins = $(this).data('carousel');
  if(!ins){
    ins = new Carousel(options, this);
    $(this).data('carousel', ins);
  }else{
    ins.option(options);
  }
  return ins;
}
})(jQuery);