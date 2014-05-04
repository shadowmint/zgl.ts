/// <reference path="__init__.ts"/>
module xn {

    /* Map between centralized 0,0 coordinates and top left viewport coordinates */
    export class StaticViewport {

        /* The world space coordinates the viewport represents */
        world:xn.Point;

        /* The display coordinates to use */
        display:xn.Point;

        /* The current viewport on the world side */
        viewport:xn.Quad;

        constructor(world:xn.Point, display:xn.Point) {
            this.world = world;
            this.display = display;
            this.all();
        }

        /* View the entire world space */
        public all():void {
            this.view(new xn.Quad(0, 0, this.world.x / 2, this.world.y / 2));
        }

        /* Change the current view to that given */
        public view(view:xn.Quad):void {
            this.viewport = view;
        }

        /*
         * Generate a new point to be relative to the viewport.
         * By default the output is in display space; to modify use target.
         * @param p The point to generate output from
         * @param target The output coordinate space
         * @return A new point in the target coordinate space.
         */
        public point(p:xn.Point, target:xn.Target = xn.Target.DISPLAY):xn.Point {
            var rtn = {x: p.x, y: p.y};
            if (target == xn.Target.DISPLAY) {
                this._vpoint(rtn, target);
                this._size(rtn, target);
            }
            else {
                this._size(rtn, target);
                this._vpoint(rtn, target);
            }
            return rtn;
        }

        /* Converts a point in world space to a point view port space from top left corner */
        private _vpoint(p:xn.Point, target:xn.Target):void {
            if (target == xn.Target.DISPLAY) {
                p.x = p.x - (this.viewport.pos.x - this.viewport.size.x);
                p.y = (this.viewport.pos.y + this.viewport.size.y) - p.y;
            }
            else {
                p.x = p.x + (this.viewport.pos.x - this.viewport.size.x);
                p.y = (this.viewport.pos.y + this.viewport.size.y) - p.y;
            }
        }

        /* Apply sizing on an existing point */
        private _size(p:xn.Point, target:xn.Target = xn.Target.DISPLAY):void {
            if (target == xn.Target.DISPLAY) {
                p.x = p.x * this.display.x / (this.viewport.size.x * 2);
                p.y = p.y * this.display.y / (this.viewport.size.y * 2);
            }
            else {
                p.x = p.x * (this.viewport.size.x * 2) / this.display.x;
                p.y = p.y * (this.viewport.size.y * 2) / this.display.y;
            }
        }

        /*
         * Generate a new size to be relative to the viewport.
         * By default the output is in display space; to modify use target.
         *
         * Notice that the distinction between size() and point() is that the
         * point assumes that display space is 0,0 based at the top left, and
         * corrects coordiantes accordingly.
         *
         * @param p The point to generate output from
         * @param target The output coordinate space
         * @return A new point in the target coordinate space.
         */
        public size(p:xn.Point, target:xn.Target = xn.Target.DISPLAY):xn.Point {
            var rtn = {x: p.x, y: p.y};
            this._size(rtn, target);
            return rtn;
        }
    }
}
