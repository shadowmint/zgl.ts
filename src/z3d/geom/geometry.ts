module z3d {

    /* Geometry type */
    export interface Geometry {
        offset:number;
        size:number;
        mode:any;
        valid:boolean;
        visible:boolean;
        data():Data[];
    }

    /* Generates fields that can be rendered */
    export interface Data {
        attrib:string;
        data:zgl.Buffer<Float32Array>;
        mode:any;
    }

    /* Common base class for geometry types */
    export class GeometryBase {

        /* Is this geometry still valid? */
        public valid:boolean = true;

        /* Is this geometry still visible? */
        public visible:boolean = true;

        /* Raw data buffers */
        public _buffers:zgl.Buffer<Float32Array>[] = null;

        /* Actual data buffers */
        public _buffer:z3d.Data[] = [];

        /* Requires a rebuild? */
        public _rebuild:boolean = true;

        /* Reset to require a new rebuild */
        public touch():void {
            this._rebuild = true;
        }

        /* Compile this object from it's internal state */
        public compile(glc:zgl.Context):GeometryBase {
            throw Error('Not implemented');
        }

        /* Use a set of provided buffers instead of creating new ones */
        public buffers(...buffers:zgl.Buffer<Float32Array>[]):void {
        }

        /* Return the data arrays for this object */
        public data():z3d.Data[] {
            return this._buffer;
        }
    }
}
