module z3d {

    /* Shader program and renderable geometry set */
    export class Renderer {

        /* The GL context */
        private _context:zgl.Context;

        /* The shader program */
        private _program:zgl.Program;

        /* Geometry source */
        public geometry:z3d.Geometry[] = [];
        private _updated:boolean = false;

        /* Camera to use */
        public camera:z3d.Camera;

        /* Load a shader and bind it as a program with buffers */
        public program:{(glc:zgl.Context):zgl.Program
        } = null;

        /* Update to render before every render, if required */
        public update:{(step:number):void
        } = null;

        public constructor(context:zgl.Context) {
            this._context = context;
        }

        /* Push content into vertex buffers for the attributes in the geometry */
        private _buffer(geom:z3d.Geometry):void {
            var buffers = geom.data();
            for (var i = 0; i < buffers.length; ++i) {
                this._program.update(buffers[i].attrib);
            }
        }

        /* A an item to the renderer geometry set */
        public add(geom:z3d.Geometry):void {
            this.geometry.push(geom);
        }

        /* Render the content of this renderer */
        public render(step:number):void {

            var gl = this._context.gl;
            var camera = this.camera;

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

            // Render each geometry
            for (var i = 0; i < this.geometry.length; ++i) {
                var geom = this.geometry[i];
                if (geom.visible && geom.valid) {
                    if (this._updated == false) {
                        this._updated = true;
                        this._buffer(geom);
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
                    gl.drawArrays(geom.mode, geom.offset, geom.size);
                }
            }
        }
    }
}
