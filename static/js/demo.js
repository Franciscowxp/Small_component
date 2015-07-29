$(function() {
    $(".vote a").vote({
        voteSuccess: function(data) {}
    });
    $(".rate").rate({
        getScore: function(d) {

        }
    });
    var slider = jQuery('.slider');
    new SlideImg({
        dom: slider,
        slideMethod: 'slide',
        controllMethod: "point",
        autoPlay: true,
        slideItem: 'img'
    });
    new scrollbyside('.moreInfoBar', '.moreInfoAside', '.moreInfoCon');

    var colors = ['#bb6249', '#459bc4', '#cb9a54', '#339fd1', '#41c3b4', '#54c6b7', '#c93a5c'],
        color = colors[Math.floor(Math.random() * colors.length)];
    can = new canvasBg('section canvas');
    can.renderAnimateRandom(color,20);

    new PopUp({
        dimmer:'.popDimmer',
        handler:'.popupbtn'
    })

})