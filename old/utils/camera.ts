/// <reference path="../__init__.ts"/>
module z3d {

    export class Camera implements z3d.Geometry {

        public offset:number = 0;
        public size:number = 1;
        public mode:number = 0;

        private _buffer:z3d.geom.Buffer[] = [];

        public projection:zgl.Mat4;

        public modelview:zgl.Mat4;

        constructor(u_proj:string, u_modelview:string) {
            this.projection = new zgl.Mat4().perspective(45, 1, 0.1, 1000);
            this.modelview = new zgl.Mat4().unity();
            this._buffer.push({attrib: u_proj, data: this.projection.vp(), mode: null});
            this._buffer.push({attrib: u_modelview, data: this.modelview.vp(), mode: null});
        }

        /* Look at position */

        /* Set camera position */
        public position(x:number, y:number, z:number):void {
            this.modelview.translate(-x, -y, -z);
        }

        /* Set camera normal */

        /* Move forwards */

        /* Move backwards */

        /* Move left */

        /* Move right */

        /* Move forwards */

        /* Move backwards */

        /* Orbit left around target */

        /* Orbit right around target */

        public data():z3d.geom.Buffer[] {
            return this._buffer;
        }
    }
}
