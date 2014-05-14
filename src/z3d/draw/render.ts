module z3d {

    /* Geometry generator */
    export class Render {

        /* The GL context */
        private _context:zgl.Context;

        /* The shader program */
        private _program:zgl.Program;

        /* Geometry source */
        private _geom:z3d.Geometry;
        private _gen:z3d.geom.Generator;

        /* Load a shader and bind it as a program with buffers */
        public program:{(glc:zgl.Context):zgl.Program} = null;

        /* Update to render before every render, if required */
        public update:{(step:number):void} = null;

        public constructor(canvasId:string) {
            this._context = new zgl.Context(canvasId);
        }

        /* Set a geometry generator */
        public generator(gen:z3d.geom.Generator):void {
            this._gen = gen;
        }

        /* Set the geometry to render */
        public geometry(geom:z3d.Geometry):void {
            this._geom = geom;
        }

        /* Render the content of this renderer */
        public render(step:number):void {

            // Update state
            if (this.update) {
                this.update(step);
            }

            // Load the program
            if (this._program == null) {
                if (this.program == null) {
                    throw Error("Invalid shader program");
                }
                else {
                    this._program = this.program(this._context);
                }
            }

            // Generate custom geometry if required
            var geom = this._geom;
            if (this._gen != null) {
                geom = this._gen.process(this._geom);
            }

            // Activate the program
            this._program.load();
            var buffers = geom.data();
            for (var i = 0; i < buffers.length; ++i) {
                var buffer = buffers[i];
                this._program.buffer(buffer.attrib, buffer.data);
            }

            // Clear & draw
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.drawArrays(geom.mode, geom.offset, geom.size);
        }
    }
}
