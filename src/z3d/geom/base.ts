/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        /* Common base class for geometry types */
        export class Base {

            /* Raw data buffers */
            public _buffers:zgl.Buffer<Float32Array>[] = null;

            /* Actual data buffers */
            public _buffer:z3d.geom.Buffer[] = [];

            /* Requires a rebuild? */
            public _rebuild:boolean = true;

            /* Reset to require a new rebuild */
            public touch():void {
                this._rebuild = true;
            }

            /* Compile this object from it's internal state */
            public compile(glc:zgl.Context):Base {
                throw Error('Not implemented');
            }

            /* Use a set of provided buffers instead of creating new ones */
            public buffers(...buffers:zgl.Buffer<Float32Array>[]):void {
            }

            /* Return the data arrays for this object */
            public data():z3d.geom.Buffer[] {
                return this._buffer;
            }
        }
    }
}
