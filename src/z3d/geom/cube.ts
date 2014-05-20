/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        /* Configuration for cube */
        export interface CubeConfig {
            a_vertex:string;
            a_color:string;
            a_uv:string;
            u_sampler:string;
            texture:HTMLImageElement;
            size:number[];
            position:number[];
        }

        /* A basic cube geometry */
        export class Cube extends Base implements z3d.Geometry {

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
            public config:CubeConfig;

            constructor(config:CubeConfig) {
                super();
                this.config = config;
            }

            /* Compile this cube from it's config */
            public compile(glc:zgl.Context):any {

                // Setup
                var gl = glc.gl;
                this.offset = 0;
                this.size = 6 * 6;
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

                    // Build colors
                    this._color.set([
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
                    ]);

                    // Build uvs
                    this._uv.set([
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0
                    ]);

                    // Rebuild the vertex data
                    var FBL = [this.config.position[0] + this.config.size[0] * -0.5, this.config.position[1] + this.config.size[1] * -0.5, this.config.position[2] + this.config.size[2] * -0.5];
                    var FBR = [this.config.position[0] + this.config.size[0] *  0.5, this.config.position[1] + this.config.size[1] * -0.5, this.config.position[2] + this.config.size[2] * -0.5];
                    var FTL = [this.config.position[0] + this.config.size[0] * -0.5, this.config.position[1] + this.config.size[1] *  0.5, this.config.position[2] + this.config.size[2] * -0.5];
                    var FTR = [this.config.position[0] + this.config.size[0] *  0.5, this.config.position[1] + this.config.size[1] *  0.5, this.config.position[2] + this.config.size[2] * -0.5];
                    var BBL = [this.config.position[0] + this.config.size[0] * -0.5, this.config.position[1] + this.config.size[1] * -0.5, this.config.position[2] + this.config.size[2] *  0.5];
                    var BBR = [this.config.position[0] + this.config.size[0] *  0.5, this.config.position[1] + this.config.size[1] * -0.5, this.config.position[2] + this.config.size[2] *  0.5];
                    var BTL = [this.config.position[0] + this.config.size[0] * -0.5, this.config.position[1] + this.config.size[1] *  0.5, this.config.position[2] + this.config.size[2] *  0.5];
                    var BTR = [this.config.position[0] + this.config.size[0] *  0.5, this.config.position[1] + this.config.size[1] *  0.5, this.config.position[2] + this.config.size[2] *  0.5];
                    this._vertex.set(this._combine(
                        FBL, FBR, FTL, // Front
                        FTL, FBR, FTR,
                        BBL, FBL, FTL,
                        BBL, FTL, BTL,
                        BBR, BBL, BTL,
                        BBR, BTL, BTR,
                        FBR, BBR, FTR,
                        BBR, FTR, BTR,
                        FTL, FTR, BTL,
                        FTR, BTL, BTR,
                        FBL, FBR, BBL,
                        FBR, BBL, BBR
                    ));
                }
                return this;
            }

            private _combine(...numbers: number[][]):number[] {
                var rtn = [];
                for (var i = 0; i < numbers.length; ++i) {
                    rtn = rtn.concat(numbers[i]);
                }
                return rtn;
            }
        }
    }
}
