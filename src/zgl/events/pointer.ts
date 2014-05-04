/// <reference path="__init__.ts"/>
module xn {
    export module pointer {

        /* Special helper to get absolute (page) pointer event coordinates */
        export function absolute(e:any):xn.Point {
            var pageX = e.pageX;
            var pageY = e.pageY;
            if (pageX === undefined) {
                pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return {x: pageX, y: pageY};
        }

        /* Special helper to get coordinates relative to given parent */
        export function relative(e:any, parent:HTMLElement):xn.Point {
            var bounds = parent.getBoundingClientRect();
            var abs = absolute(e);
            abs.x -= bounds.left;
            abs.y -= bounds.top;
            return abs;
        }
    }
}
