/*
* param dom it is the target dom you want to get its size
* param until it is the most out dom wrap the target dom 
*/
function getActualRect(dom,until) {
        var current = dom,
            nodes = [dom],
            backUp = [],
            actual;

        while (current.parentNode) {
            nodes.push(current.parentNode);
            current = current.parentNode;
            if (current === until) {
              break;
            }
        }
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
