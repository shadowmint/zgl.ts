module z3d {

    /* Geometry generator */
    export class Render {

        /* The GL context */
        private _context:zgl.Context;

        /* The shader program */
        private _program:zgl.Program;

        /* Geometry source */
        public geometry:z3d.Geometry;
        private _updated:boolean = false;

        /* Camera to use */
        public camera:z3d.Camera;

        /* Load a shader and bind it as a program with buffers */
        public program:{(glc:zgl.Context):zgl.Program} = null;

        /* Update to render before every render, if required */
        public update:{(step:number):void} = null;

        public constructor(context:zgl.Context) {
            this._context = context;
        }

        /* Push content into vertex buffers for the attributes in the geometry */
        public buffer(geom:z3d.Geometry = null):void {
            var buffers = geom ? geom.data() : this.geometry.data();
            for (var i = 0; i < buffers.length; ++i) {
                this._program.update(buffers[i].attrib);
            }
        }

        /* Render the content of this renderer */
        public render(step:number):void {

            var gl = this._context.gl;

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
            var camera = this.camera;
            var geom = this.geometry;
            if (this._updated == false) {
                this._updated = true;
                this.buffer();
            }

            // Load geometry arrays
            var buffers = geom.data();
            for (var i = 0; i < buffers.length; ++i) {
                var buffer = buffers[i];
                this._program.buffer(buffer.attrib, buffer.data, buffer.mode);
            }

            // Load camera data
            buffers = camera.data();
            for (var i = 0; i < buffers.length; ++i) {
                var buffer = buffers[i];
                this._program.buffer(buffer.attrib, buffer.data, buffer.mode);
            }

            // Activate the program
            this._program.load();

            // Clear & draw
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.drawArrays(geom.mode, geom.offset, geom.size);
        }
    }
}
