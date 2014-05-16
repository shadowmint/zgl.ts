/// <reference path="../__init__.ts"/>
module z3d {

    export class Camera implements z3d.Geometry {

        public offset:number = 0;
        public size:number = 1;
        public mode:number = 0;

        private _buffer:z3d.geom.Buffer[] = [];

        private projection:zgl.Mat4;

        private modelview:zgl.Mat4;

        constructor(a_proj:string, a_modelview:string) {
            this.projection = new zgl.Mat4().perspective(45, 1, 0.1, 100);
            this.modelview = new zgl.Mat4().unity();
            this._buffer.push({attrib: a_proj, data: this.projection.vp(), mode: null});
            this._buffer.push({attrib: a_modelview, data: this.modelview.vp(), mode: null});
        }

        /* Return the Mat4 objects for the

        /* Look at position */

        /* Set camera position */

        /* Set camera normal */

        /* Move forwards */

        /* Move backwards */

        /* Move left */

        /* Move right */

        /* Move forwards */

        /* Move backwards */

        /* Orbit left around target */

        /* Orbit right around target */

        /* Push internal state into local camera matrix */

        public data():z3d.geom.Buffer[] {
            return this._buffer;
        }
    }
}
