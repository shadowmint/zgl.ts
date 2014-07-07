module z3d {
    export module geom {

        /* A cube with a uniform texture on each face */
        export class Cube implements Mesh {

            /* The distinct points that comprise this cube */
            public points:Point[] = null;

            /* Faces for this cube */
            public _faces:Face[] = null;

            /* Position for this cube */
            public pos:number[] = [0.0, 0.0, 0.0];

            /* Size of this cube */
            public size:number[] = [1.0, 1.0, 1.0];

            /* Rebuild the faces for this cube */
            public compile():Cube {
                this._buffer();
                var pos = this.pos;
                var size = this.size;
                this.points[0].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
                this.points[1].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
                this.points[2].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
                this.points[3].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
                this.points[4].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
                this.points[5].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
                this.points[6].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
                this.points[7].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
                this.points[8].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
                this.points[9].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
                this.points[10].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
                this.points[11].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
                this.points[12].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
                this.points[13].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
                this.points[14].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
                this.points[15].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
                return this;
            }

            /* Return all the faces */
            public faces():Face[] {
                this.compile();
                return this._faces;
            }

            /* Create buffers */
            private _buffer():void {
                if (this.points == null) {
                    this.points = [
                        // Side faces
                        { pos: [-1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FTL
                        { pos: [ 1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // FTR
                        { pos: [-1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // BTL
                        { pos: [ 1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // BTR
                        { pos: [-1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FBL
                        { pos: [ 1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // FBR
                        { pos: [-1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BBL
                        { pos: [ 1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] },  // BBR

                        // Top and bottom faces
                        { pos: [-1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FTL
                        { pos: [ 1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FTR
                        { pos: [-1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BTL
                        { pos: [ 1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // BTR
                        { pos: [-1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FBL
                        { pos: [ 1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FBR
                        { pos: [-1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BBL
                        { pos: [ 1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] },  // BBR
                    ];
                    this._faces = [
                        // Sides
                        { normal: { pos: [ 0.0, 0.0, 1.0] }, points: [ this.points[0], this.points[1], this.points[4], this.points[5]]}, // F
                        { normal: { pos: [ 0.0, 0.0, -1.0 ]}, points: [ this.points[2], this.points[3], this.points[6], this.points[7]]}, // B
                        { normal: { pos: [ 1.0, 0.0, 0.0] }, points: [ this.points[1], this.points[3], this.points[5], this.points[7]]}, // L
                        { normal: { pos: [-1.0, 0.0, 0.0] }, points: [ this.points[0], this.points[2], this.points[4], this.points[6]]}, // R

                        // Top and bottom with custom UVs
                        { normal: { pos: [ 0.0, 1.0, 0.0] }, points: [ this.points[8], this.points[9], this.points[10], this.points[11]]},
                        { normal: { pos: [ 0.0, -1.0, 0.0] }, points: [ this.points[12], this.points[13], this.points[14], this.points[15]]}
                    ];
                }
            }
        }
    }
}
