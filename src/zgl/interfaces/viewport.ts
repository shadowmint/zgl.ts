/// <reference path="__init__.ts"/>
module xn {

    /* Directions for mapping */
    export enum Target {
        WORLD,
        DISPLAY
    }

    /* Implement this interface for things with event listeners */
    export interface Viewport {

        /* The display size */
        display:xn.Point;

        /* The world size */
        world:xn.Point;

        /* Change the current view to that given */
        view(view:xn.Quad):void;

        /* Map a point in one domain to the other */
        point(p:xn.Point, target:Target):xn.Point;

        /* Map a size in one domain to the other */
        size(p:xn.Point, target:Target):xn.Point;
    }
}
