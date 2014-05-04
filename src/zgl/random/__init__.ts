/// <reference path="../__init__.ts"/>
module xn {
    export module random {

        /* Generate a random number between a and b, inclusive */
        export function int(a:number, b:number):number {
            var lower = Math.floor(a);
            var upper = Math.floor(b);
            var range = 1 + Math.abs(upper - lower);
            var step = Math.floor(Math.random() * range);
            return lower + step;
        }

        /* Select a random element from an array */
        export function select(a:any[]):any {
            if (a.length > 0) {
              var index = int(0, a.length - 1);
              return a[index];
            }
            return null;
        }

        /* Build a random hex code colour as an int */
        export function color():number {
            return ((int(0, 255) << 16) | (int(0, 255)) << 8) | int(0, 255);
        }
    }
}

