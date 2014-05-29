/// <reference path="../__init__.ts"/>
module z3d {
    export module proc {

        /* Configuration for cube */
        export interface MeshConfig {
            a_vertex:string;
            a_color:string;
            a_uv:string;
            u_sampler:string;
            texture:HTMLImageElement;
            geom:z3d.geom.Mesh;
        }

        /* A basic mesh geometry for a shader with color, vertex, uv and sampler attributes */
        export class Mesh extends z3d.GeometryBase implements z3d.Geometry {

            /* Basic geom config */
            public offset:number;
            public size:number;
            public mode:any;

            /* The gl texture record for this geometry */
            public texture:any;

            /* Internal gl arrays */
            private _uv:zgl.Buffer<Float32Array>;
            private _vertex:zgl.Buffer<Float32Array>;
            private _color:zgl.Buffer<Float32Array>;

            /* Cached copy of the config */
            public config:MeshConfig;

            constructor(config:MeshConfig) {
                super();
                this.config = config;
            }

            /* Compile this cube from it's config */
            public compile(glc:zgl.Context):any {

                // Setup
                var gl = glc.gl;
                var faces = this.config.geom.faces();
                this.offset = 0;
                this.size = faces.length * 6;
                this.mode = gl.TRIANGLES;

                // If no buffers have been provided, allocate new ones
                if (this._buffers == null) {
                    this._buffers = [
                        zgl.Buffer.factory(this.size * 4),
                        zgl.Buffer.factory(this.size * 3),
                        zgl.Buffer.factory(this.size * 2)
                    ];
                }

                // If we're rebuilding, rebuild
                if (this._rebuild) {
                    this._rebuild = false;

                    // Arrays
                    this._color = this._buffers[0];
                    this._vertex = this._buffers[1];
                    this._uv = this._buffers[2];

                    // Bind texture
                    if (this.texture == null) {
                        this.texture = gl.createTexture();
                        gl.bindTexture(gl.TEXTURE_2D, this.texture);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.config.texture);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    }

                    // Assign buffers
                    this._buffer.push({attrib: this.config.a_color, data: this._color, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this.config.a_vertex, data: this._vertex, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this.config.a_uv, data: this._uv, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this.config.u_sampler, data: this.texture, mode: null});

                    // Buid element arrays
                    var points = z3d.geom.export_mesh(faces);

                    // Build buffers
                    this._color.set(points.color);
                    this._uv.set(points.uv);
                    this._vertex.set(points.vertex);
                }
                return this;
            }
        }
    }
}
