/// <reference path="__init__.ts"/>
module xn {

    /* 2D vector */
    export class Vector {

        x:number;
        y:number;

        constructor(x:number = 0, y:number = 0) {
            this.x = x;
            this.y = y;
        }

        /* Return the magnitude */
        magnitude():number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /* Convert into a unit vector and return self */
        unit():Vector {
            var magn:number = this.magnitude();
            if (magn == 0) {
                this.x = 0;
                this.y = 0;
            }
            else {
                this.x = this.x / magn;
                this.y = this.y / magn;
            }
            return this;
        }

        /* Multiple by constant factor and return self */
        multiply(factor:number):Vector {
            this.x = this.x * factor;
            this.y = this.y * factor;
            return this;
        }

        /* Add another vector to this one, with an optional factor and return self */
        add(other:Vector, factor:number = 1.0):Vector {
            this.x += other.x * factor;
            this.y += other.y * factor;
            return this;
        }

        /* Copy from another vector easily and return self */
        copy(other:Vector):Vector {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
    }
}
