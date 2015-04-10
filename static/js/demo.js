$(function(){
    $(".vote a").vote({
        voteSuccess:function(data){
        }
    });
    $(".rate").rate({
        getScore:function(d){

        }
    });
    var slider = jQuery('.slider');
    new SlideImg({
        dom: slider,
        slideMethod:'slide',
        controllMethod: "point",
        autoPlay:true,
        slideItem:'img'
    });
    new scrollbyside(10, '.moreInfoBar', '.moreInfoAside', '.moreInfoCon');
})