module z3d {
    export module geom {

        /* A cube with a uniform texture on each face */
        export class HeightMap implements Mesh {

            /* The distinct points that comprise this heightmap */
            public points:Point[] = null;

            /* The set of cubes that are generated for each point in the active zone */
            private _cubes:Cube[] = null;

            /* Position for the origin of this heightmap */
            public pos:number[] = [0.0, 0.0, 0.0];

            /* Return all the faces from all cubes */
            public faces():Face[] {
                var rtn:Face[] = [];
                return rtn;
            }

            /* Define the UV for a specific height terrain data value */

            /* Rebuild the faces for this cube */
            public compile():void {
            }

            /* Create buffers */
            private _buffer():void {
                if (this.points == null) {
                }
            }
        }
    }
}
