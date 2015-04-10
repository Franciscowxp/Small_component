(function($) {
    $.fn.extend({
        scrollTo: function(offset) {
            var config = {
                "speed": 600
            };
            var offset = offset || 0;
            return this.each(function() {
                jQuery(this).click(function(event) {
                    event.preventDefault();
                    var scrolltodom = jQuery(this).attr("data-scroll");
                    jQuery(this).addClass("active").parent("li").siblings().find("a").removeClass("active");
                    jQuery('html,body').animate({
                        scrollTop: jQuery(scrolltodom).offset().top - offset
                    }, config.speed);
                    return false;
                });
            })
        },
        vote: function(options) {
            var settings;
            settings = {
                voteSuccess: function(data) {}
            };
            settings = $.extend(settings, options);
            return this.each(function() {
                $(this).click(function(event) {
                    event.preventDefault();
                    url = $(this).attr('href');
                    var that = this;
                    if (!$(this).hasClass('active')) {
                        $.ajax({
                            url: url,
                            type: 'GET',
                            dataType: 'json',
                        })
                            .done(function(data) {
                                $(that).addClass('active');
                                $(that).next('span').text(data['num'])
                                settings.voteSuccess(data);
                                console.log("success");
                            })
                            .fail(function() {
                                console.log("error");
                            })
                            .always(function() {
                                console.log("complete");
                            });
                    }
                });
            });
        },
        rate: function(options) {
            var settings;
            settings = {
                getScore: function(score) {}
            };
            settings = $.extend(settings, options);
            var icons = $(this).find('.icon');
            var score = 0;
            return this.each(function(index, el) {
                var that = this;
                $(this).mouseover(function(event) {
                    if ($(event.target).hasClass('icon')) {
                        var index = $(event.target).index();
                        icons.slice(0, index + 1).addClass('hover');
                    }
                });
                $(this).mouseout(function(event) {
                    icons.removeClass('hover');
                });
                $(this).click(function(event) {
                    if ($(event.target).hasClass('icon')) {
                        var index = $(event.target).index();
                        score = index + 1;
                        settings.getScore(score);
                        icons.slice(0, index + 1).addClass('active');
                        icons.slice(index + 1).removeClass('active');
                    }
                });
            });
        }
    })
})(jQuery);

function SlideImg(object) {
    this.controllMethod = object.controllMethod;
    this.autoPlay = object.autoPlay;
    this.slideMethod = object.slideMethod;
    this.dom = object.dom;
    this.items = this.dom.find(object.slideItem);
    this.itemsContent = this.dom.find('.slideItems');
    this.itemsWidth = this.items.eq(0).width();
    this.itemsHeight = this.items.eq(0).height();
    this.points = this.dom.find("ul li");
    this.prev = this.dom.find(".prev");
    this.next = this.dom.find(".next");
    this.itemsLen = this.items.length;
    this.playhaddle = null;
    this.init();
}
SlideImg.prototype = {
    init: function() {
        this.items.hide().first().show();
        this.itemsContent.width(this.itemsWidth * 2);
        this.itemsContent.height(this.itemsHeight);
        this.lastItem = 0;
        if (this.controllMethod == "point") {
            this.blindIndex();
        }
        if (this.controllMethod == "prevnext") {
            this.blindLinear();
        }
        if (this.controllMethod == "both") {
            this.blindBoth();
        }
        this.Play();
    },
    pointer: function(index) {
        this.points.eq(this.lastItem).removeClass('active');
        this.points.eq(index).addClass('active');
    },
    invoke: function(index, derection) {
        var that = this,
            theLeft;
        if (this.slideMethod == 'slide') {
            this.itemsContent.css('position', 'relative');
            this.items.css({
                left: '0',
                top: '0'
            });
            if (derection == 'right') { /*next derection*/
                theLeft = this.itemsWidth;
            } else { /*prev derection*/
                theLeft = 0 - this.itemsWidth;
            }
            this.items.eq(index).css({
                left: theLeft,
                display: 'block'
            });
            this.itemsContent.animate({
                    left: 0 - theLeft
                },
                400, function() {
                    that.itemsContent.css('left', '0');
                    that.items.eq(index).css('left', '0');
                    that.items.eq(that.lastItem).css('display', 'none');
                    that.pointer(index);
                    that.lastItem = index;
                });
        };
        if (this.slideMethod == 'fade') {
            this.items.eq(this.lastItem).stop().fadeOut("fast", function() {
                that.items.eq(index).stop().fadeIn("fast", function() {
                    that.pointer(index);
                    that.lastItem = index;
                });
            });
        }
    },
    blindIndex: function() {
        var that = this,
            derection;
        this.points.eq(0).addClass('active');
        this.points.click(function(event) {
            if (jQuery(this).hasClass('active')) {
                return false;
            };
            window.clearInterval(that.playhaddle);
            event.preventDefault();
            var index = jQuery(event.target).index();
            if (index > that.lastItem) {
                derection = 'right';
            } else {
                derection = 'left'
            }
            that.invoke(index, derection);
            that.Play();

        });
    },
    blindLinear: function() {
        var that = this;
        this.prev.click(function(event) {
            window.clearInterval(that.playhaddle);
            if (that.lastItem - 1 < 0) {
                var index = that.itemsLen - 1;
            } else {
                var index = that.lastItem - 1;
            }
            that.invoke(index, 'left');
            that.Play();

        });

        this.next.click(function(event) {
            window.clearInterval(that.playhaddle);
            if (that.lastItem + 1 >= that.itemsLen) {
                var index = 0;
            } else {
                var index = that.lastItem + 1;
            }
            that.invoke(index, 'right');
            that.Play();
        });
    },
    blindBoth: function() {
        this.blindLinear();
        this.blindIndex();
    },
    Play: function() {
        var that = this;
        if (this.autoPlay) {
            function circle() {
                if (that.lastItem + 1 >= that.itemsLen) {
                    var index = 0;
                } else {
                    var index = that.lastItem + 1;
                }
                that.invoke(index, 'right');
            }
            that.playhaddle = setInterval(circle, 4000);
        };
    }
}

function scrollbyside(padding, bar, aside, content) {
    this.bar = jQuery(bar);
    this.aside = jQuery(aside);
    this.content = jQuery(content);
    this.padding = padding;
    this.originHeight = this.bar.height();
    this.originAsideHeight = this.aside.height();
    this.bar.data('oldValue', 'static');
    this.init();
}
scrollbyside.prototype = {
    init: function() {
        this.bar.find('a').scrollTop();
        this.bind();
    },
    bind: function() {
        var that = this;
        jQuery(window).scroll(function() {
            var contentHeight = that.content.height();
            var barRect = that.bar.get(0).getBoundingClientRect();
            var contentRect = that.content.get(0).getBoundingClientRect();
            if (barRect.top <= 0) {
                that.bar.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '3'
                });
                that.aside.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '3'
                });
            }
            if (contentRect.bottom <= that.originHeight + that.padding) {
                that.bar.css({
                    position: 'absolute',
                    top: contentHeight - that.originHeight - that.padding
                });
            }
            if (contentRect.bottom >= that.originHeight + that.padding && contentRect.top <= 0) {
                that.bar.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '3'
                });
                that.aside.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '3'
                });
            }
            if (contentRect.bottom <= that.originAsideHeight) {
                that.aside.css({
                    position: 'absolute',
                    top: contentHeight - that.originAsideHeight - that.padding
                });
            }
            if (contentRect.top >= that.originHeight + that.padding) {
                that.bar.css({
                    position: 'static'
                });
                that.aside.css({
                    position: 'static'
                });
            }
            if (that.bar.data('oldValue') !== that.bar.css('position')) { //检测bar变化，重新给定事件
                that.bar.data('oldValue', that.bar.css('position'));
                that.bar.find('a').off();
                that.bar.find('a').scrollTo();
            };
            that.scrollBind();
        })

    },
    scrollBind: function() {
        var as = this.bar.find('a[data-scroll]')
        for (var i = 0; i < as.length; i++) {
            var aims = as.eq(i).attr('data-scroll');
            this.barActive(aims, as, this.originHeight);
        };
    },
    barActive: function(aim, as, height) {
        var rect = jQuery(aim).get(0).getBoundingClientRect();
        if (height < rect.bottom && rect.top <= height) {
            as.removeClass('active');
            jQuery("a[data-scroll='" + aim + "']").addClass('active')
        }
    }
}