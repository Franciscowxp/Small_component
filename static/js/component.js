(function($) {
    $.fn.extend({
        scrollTo: function(offset) {
            var config = {
                "speed": 600
            };
            var offset = offset || 0;
            return this.each(function() {
                $(this).click(function(event) {
                    event.preventDefault();
                    var scrolltodom = $(this).attr("data-scroll");
                    if ($(scrolltodom).length) {
                        $(this).addClass("active").parent("li").siblings().find("a").removeClass("active");
                        $('html,body').animate({
                            scrollTop: $(scrolltodom).offset().top - offset
                        }, config.speed);
                        return false;
                    }
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
            var icons = $(this).find('i');
            var score = 0;
            return this.each(function(index, el) {
                var that = this;
                $(this).mouseover(function(event) {
                    if (/i/i.test(event.target.tagName)) {
                        var index = $(event.target).index();
                        icons.slice(0, index + 1).addClass('hover');
                    }
                });
                $(this).mouseout(function(event) {
                    icons.removeClass('hover');
                });
                $(this).click(function(event) {
                    if (/i/i.test(event.target.tagName)) {
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
            if ($(this).hasClass('active')) {
                return false;
            };
            window.clearInterval(that.playhaddle);
            event.preventDefault();
            var index = $(event.target).index();
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

function scrollbyside(bar, aside, content) {
    this.bar = $(bar);
    this.aside = $(aside);
    this.content = $(content);
    this.backUp = this.bar.prev('.backUp');
    this.originHeight = this.bar.height();
    this.originAsideHeight = this.aside.height();
    this.bar.data('oldValue', 'static');
    this.init();
}
scrollbyside.prototype = {
    init: function() {
        this.bar.find('a').scrollTo();
        this.bind();
    },
    bind: function() {
        var that = this;
        $(window).scroll(function() {
            var contentHeight = that.content.height();
            var barRect = that.bar.get(0).getBoundingClientRect();
            var contentRect = that.content.get(0).getBoundingClientRect();
            if (barRect.top <= 0) {
                $("#sticky").removeClass('active');
                that.backUp.addClass('active');
                that.bar.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '4'
                });
                that.aside.css({
                    position: 'fixed',
                    top: that.originHeight,
                    zIndex: '3'
                });
            }
            if (contentRect.bottom <= that.originHeight) {
                that.bar.css({
                    position: 'absolute',
                    top: contentHeight
                });
            }
            if (contentRect.bottom >= that.originHeight && contentRect.top <= 0) {
                that.bar.css({
                    position: 'fixed',
                    top: '0',
                    zIndex: '4'
                });
                that.aside.css({
                    position: 'fixed',
                    top: that.originHeight,
                    zIndex: '3'
                });
            }
            if (contentRect.bottom <= that.originAsideHeight + that.originHeight) {
                that.aside.css({
                    position: 'absolute',
                    top: contentHeight - that.originAsideHeight + that.originHeight
                });
            }
            if (contentRect.top >= that.originHeight) {
                that.backUp.removeClass('active');
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
        var dom = $(aim).get(0);
        if (dom) {
            var rect = dom.getBoundingClientRect();
            if (height < rect.bottom && rect.top <= height) {
                as.removeClass('active');
                $("a[data-scroll='" + aim + "']").addClass('active')
            }
        }
    }
}

function whichAnimationEvent() {
    var t,
        el = document.createElement("fakeelement");

    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

function whichTransitionEvent() {
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

function whichAnimationEventStart() {
    var t,
        el = document.createElement("fakeelement");

    var animations = {
        "animation": "animationstart",
        "OAnimation": "oAnimationStart",
        "MozAnimation": "animationstart",
        "WebkitAnimation": "webkitAnimationStart"
    }

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

function getFinalStyle(dom, property) {
    return (dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom, null))[property];
}

function getActualRect(dom) {
    var nodes = [dom],
        backUp = [],
        actual;

    function parents(dom) {
        var parent = dom.parentNode;
        if (getFinalStyle(parent, 'display') == 'none') {
            nodes.push(parent);
        } else {
            return false;
        }
        parents(parent);
    }
    parents(dom);
    style = "display:block!important;visibility:hidden!important;";
    inlineStyle = "display:inline-block!important;visibility:hidden!important;";
    nodes.forEach(function(el, index, array) {
        var cssText = el.style.cssText
        backUp.push(cssText);
        el.style.cssText = cssText + style;
    });
    for (var i = 0; i < nodes.length; i++) {
        var cssText = nodes[i].style.cssText;
        backUp.push(cssText);
        if (i == 0) {
            nodes[i].style.cssText = cssText + inlineStyle;
        } else {
            nodes[i].style.cssText = cssText + style;
        }
    };
    actual = {
        'width': dom.clientWidth,
        'height': dom.clientHeight
    };
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.cssText = backUp[i]
    };
    return actual
}

function PopUp(options) {
    /*
        handler, dimmer, onClose,width,height
    */
    this.dimmer = jQuery(options.dimmer);
    this.handler = jQuery(options.handler);
    this.contain = this.dimmer.find('.popUp');
    this.inner = this.dimmer.find('.popInner');
    this.afterClose = options.afterClose ? options.afterClose : function() {};
    this.afterShow = options.afterShow ? options.afterShow : function() {};
    this.init(options);
}
PopUp.prototype = {
    init: function(options) {
        var actualW, actualH;
        var actual = getActualRect(this.inner.get(0));
        if (options.width) {
            actualW = options.width;
        } else {
            actualW = actual.width;
        }
        if (options.height) {
            actualH = options.height;
        } else {
            actualH = actual.height;
        }
        this.contain.css({
            height: actualH,
            width: actualW
        });
        this.contain.css({
            opacity: 0,
            display: 'inline-block'
        });
        this.closeBtn();
        this.bind();
    },
    setActualRect: function() {
        var actual = getActualRect(this.inner.get(0));
        this.contain.css({
            height: actual.height,
            width: actual.width
        });
    },
    bind: function() {
        var that = this;
        this.handler.click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.showUp();
        });
        this.close.click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.hideDown();
        });
        this.dimmer.click(function(event) {
            if (event.target == that.dimmer.get(0)) {
                that.hideDown();
            }
        });
    },
    showUp: function() {
        var that = this;
        this.dimmer.fadeIn('fast', function() {
            that.contain.addClass('active');
            var animatEvent = whichAnimationEvent();
            that.contain.bind(animatEvent, function(event) {
                that.contain.css({
                    opacity: 1,
                    display: 'block'
                });
                that.afterShow();
                that.contain.off();
            });

        });
    },
    hideDown: function() {
        var that = this;
        var animatEvent = whichAnimationEvent();
        this.contain.removeClass('active').addClass('noactive');
        this.contain.bind(animatEvent, function(event) {
            that.contain.css({
                opacity: 0,
                display: 'block'
            });
            that.contain.removeClass('noactive');
            that.dimmer.fadeOut('fast');
            that.afterClose();
            that.contain.off();
        });

    },
    closeBtn: function() {
        this.close = jQuery("<i class='fa fa-times-circle'></i>");
        this.close.appendTo(this.contain);
    }
}