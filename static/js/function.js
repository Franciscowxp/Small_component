function getActualRect(dom) {
    var parent = dom.parentNode,
        nodes = [dom, parent],
        backUp = [],
        actual;
    style = "display:block!important;visibility:hidden!important;";
    nodes.forEach(function(el, index, array) {
        var cssText = el.style.cssText
        backUp.push(cssText);
        el.style.cssText = cssText + style;
    });
    actual = {
        'width': dom.clientWidth,
        'height': dom.clientHeight
    };
    nodes.forEach(function(el, index, array) {
        el.style.cssText = backUp[index];
    });
    return actual
}

function getType(o) {
    var s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase();
}

function getOffset(dom) {
    var left=0,top=0;
    function get(dom) {
        left+=dom.offsetLeft;
        top+=dom.offsetTop;
        if (dom.offsetParent) {
            get(dom.offsetParent)
        }
    }
    get(dom)
    return {"left":left,"top":top}
}