/// <reference path="../__init__.ts"/>
module z3d {

    export class Camera implements z3d.Geometry {

        private _buffer:z3d.geom.Buffer[] = [];

        constructor(projection:string, modelview:string) {
        }

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
