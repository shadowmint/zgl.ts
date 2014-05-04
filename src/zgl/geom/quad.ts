/// <reference path="__init__.ts"/>
module xn {

    /* Generic 2D block */
    export class Quad {
        public size:xn.Point;
        public pos:xn.Point;
        public angle:number;

        constructor(x:number = 0, y:number = 0, dx:number = 0, dy:number = 0, angle:number = 0) {
            this.pos = {x: x, y: y};
            this.size = {x: dx, y: dy};
            this.angle = angle;
        }

        /* Create a copy and return it */
        public clone():Quad {
            return new Quad(this.pos.x, this.pos.y, this.size.x, this.size.y, this.angle);
        }
    }
}
