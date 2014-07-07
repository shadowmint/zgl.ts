module z3d {
    export module geom {

        /* A vector is just a point, but we distinguish it by other meta data */
        export interface Vector {
            pos:number[];
        }

        /* A single 3D point */
        export interface Point extends Vector {
            color:number[];
            uv:number[];
        }

        /* A single 3D face */
        export interface Face {
            points:Point[];
            normal:Vector;
        }

        /* Any collection of faces */
        export interface Mesh {
            faces():Face[];
        }

        /* A set of points, derived from a set of faces as a single array */
        export interface Points {
            count:number;
            vertex:number[];
            color:number[];
            uv:number[];
        }

        /* Export a set of faces as a triangle mesh */
        export function export_mesh(faces:Face[]):Points {
            // TODO: Normals should go in here too

            var vertex:number[] = [];
            var color:number[] = [];
            var uv:number[] = [];

            for (var i = 0; i < faces.length; ++i) {
                var face = faces[i];

                vertex.push.apply(vertex, face.points[0].pos);
                vertex.push.apply(vertex, face.points[1].pos);
                vertex.push.apply(vertex, face.points[2].pos);
                vertex.push.apply(vertex, face.points[1].pos);
                vertex.push.apply(vertex, face.points[2].pos);
                vertex.push.apply(vertex, face.points[3].pos);

                uv.push.apply(uv, face.points[0].uv);
                uv.push.apply(uv, face.points[1].uv);
                uv.push.apply(uv, face.points[2].uv);
                uv.push.apply(uv, face.points[1].uv);
                uv.push.apply(uv, face.points[2].uv);
                uv.push.apply(uv, face.points[3].uv);

                color.push.apply(color, face.points[0].color);
                color.push.apply(color, face.points[1].color);
                color.push.apply(color, face.points[2].color);
                color.push.apply(color, face.points[1].color);
                color.push.apply(color, face.points[2].color);
                color.push.apply(color, face.points[3].color);
            }
            return { vertex: vertex, uv: uv, color: color, count: faces.length * 6 };
        }
    }
}
