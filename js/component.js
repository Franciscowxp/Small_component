(function($) {
    $.fn.extend({
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
        }
    });

    $.fn.extend({
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