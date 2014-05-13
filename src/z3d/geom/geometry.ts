module z3d {

    /* Geometry type */
    export interface Geometry {
        data():geom.Buffer[];
    }

    export module geom {

        /* Generates fields that can be rendered */
        export interface Buffer {
            attrib:string;
            type:zgl.BufferType;
            data:zgl.Buffer<Float32Array>;
            mode:any;
        }

        /* Generates geometry objects */
        export interface Generator {
            process(source:Geometry):Geometry;
        }
    }
}