module z3d {

    /* Geometry type */
    export interface Geometry {
        offset:number;
        size:number;
        mode:any;
        data():geom.Buffer[];
    }

    export module geom {

        /* Generates fields that can be rendered */
        export interface Buffer {
            attrib:string;
            data:zgl.Buffer<Float32Array>;
        }

        /* Generates geometry objects */
        export interface Generator {
            process(source:Geometry):Geometry;
        }
    }
}
