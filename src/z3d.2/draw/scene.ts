module z3d {

    /* Keep a set of shader programs and render each of them */
    export class Scene {

        /* The set of shader programs to run */
        components:Renderer[] = [];

        /* Rendering context */
        private _glc:zgl.Context = null;

        /* Shared camera for the whole scene */
        public camera:z3d.Camera = null;

        /* The background color to use when rendering */
        public background:number[] = [1.0, 1.0, 1.0, 1.0];

        constructor(context:zgl.Context, u_proj:string = 'u_proj', u_modelview = 'u_modelview') {
            this._glc = context;
            this.camera = new z3d.Camera(u_proj, u_modelview);
        }

        /* Add a renderer */
        public renderer():Renderer {
            var r = new z3d.Renderer(this._glc);
            r.camera = this.camera;
            this.components.push(r);
            return r;
        }

        /* Render all the shader programs */
        public render(step:number):void {
            this._glc.check();
            var gl = this._glc.gl;
            gl.clearColor(this.background[0], this.background[1], this.background[2], this.background[3]);
            for (var i = 0; i < this.components.length; ++i) {
                this.components[i].render(step);
            }
            this._glc.check();
        }
    }
}
