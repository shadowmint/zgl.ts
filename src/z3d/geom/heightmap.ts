module z3d {
    export module geom {

        /* A array of points */
        export interface HeightMapData {
            dx:number;
            dy:number;
            heights:number[];
            types:number[];
        }

        /* The UV binding for a mesh height value */
        export interface HeightMapType {
            uv:number[];
        }

        /* A cube with a uniform texture on each face */
        export class HeightMap implements Mesh {

            /* The top size of each cube */
            public block:number = 0.1;

            /* The Z-base for each cube */
            public base:number = 0;

            /* Source data */
            public data:HeightMapData;

            /* The set of cubes that are generated for each point in the active zone */
            private _cubes:Cube[] = null;

            /* Set of faces */
            private _faces:Face[] = null;

            /* The UV bindings a node types */
            private _types:any = {};

            /* Position for the origin of this heightmap */
            public pos:number[] = [0.0, 0.0, 0.0];

            /* Return all the faces from all cubes */
            public faces():Face[] {
                this.compile();
                return this._faces;
            }

            /* Define the UV for a specific height terrain data value */
            // TODO

            /* Rebuild the faces for this cube */
            public compile():void {
                if (this._faces == null) {
                    this._faces = [];
                    this._cubes = [];
                    for (var j = 0; j < this.data.dy; ++j) {
                        for (var i = 0; i < this.data.dx; ++i) {
                            var size = [this.block, this.block, this.data.heights[j * this.data.dx + i]];
                            var center = [
                                this.pos[0] - (this.data.dx / 2 * this.block) + (this.block * i),
                                this.pos[1] - (this.data.dy / 2 * this.block) + (this.block * j),
                                this.pos[2] + size[2] / 2
                            ];
                            var cube = new z3d.geom.Cube();
                            cube.size = size;
                            cube.pos = center;
                            this._cubes.push(cube);
                            this._faces.push.apply(this._faces, cube.faces());
                        }
                    }
                }
            }
        }
    }
}
