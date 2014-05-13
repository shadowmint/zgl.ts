module z3d {

    /* Geometry generator */
    export class Render {

        private _context:zgl.Context;

        /* Load a shader and bind it as a program with buffers */
        public program:{(glc:zgl.Context):zgl.Program} = null;

        /* Update to render before every render, if required */
        public update:{(step:number):void} = null;

        public constructor(canvasId:string) {
            this._context = new zgl.Context(canvasId);
        }

        /* Set the geometry to render */
        public geometry(geom:z3d.Geometry):void {
        }
    }
}