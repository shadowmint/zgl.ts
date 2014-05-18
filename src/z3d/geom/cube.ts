/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        export interface CubeConfig {
            a_vertex:string;
            a_color:string;
            a_uv:string;
            u_sampler:string;
            texture:HTMLImageElement;
            size:number[];
            position:number[];
        }

        export class Cube implements z3d.Geometry {

            public offset:number;
            public size:number;
            public mode:any;

            private _buffer:z3d.geom.Buffer[] = [];

            private _uv:zgl.Buffer<Float32Array>;
            private _vertex:zgl.Buffer<Float32Array>;
            private _color:zgl.Buffer<Float32Array>;
            private _texture:any;

            private _config:CubeConfig;

            constructor(config:CubeConfig) {
                this._config = config;
            }

            /* Compile this cube from it's config */
            public compile(glc:zgl.Context):Cube {
                var gl = glc.gl;
                if (this._buffer.length == 0) {

                    // Setup
                    this.offset = 0;
                    this.size = 6 * 6;
                    this.mode = gl.TRIANGLES;

                    // Bind texture
                    this._texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, this._texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._config.texture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.bindTexture(gl.TEXTURE_2D, null);

                    // Assign buffers
                    this._color = zgl.Buffer.factory(this.size * 4);
                    this._vertex = zgl.Buffer.factory(this.size * 3);
                    this._uv = zgl.Buffer.factory(this.size * 2);
                    this._buffer.push({attrib: this._config.a_color, data: this._color, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this._config.a_vertex, data: this._vertex, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this._config.a_uv, data: this._uv, mode: glc.gl.STATIC_DRAW});
                    this._buffer.push({attrib: this._config.u_sampler, data: this._texture, mode: null});

                    // Build UV's and colors
                    this._color.set([
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
                    ]);
                    this._uv.set([
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
                        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0
                    ]);

                    // Rebuild the vertex data
                    var FBL = [this._config.position[0] + this._config.size[0] * -0.5, this._config.position[1] + this._config.size[1] * -0.5, this._config.position[2] + this._config.size[2] * -0.5];
                    var FBR = [this._config.position[0] + this._config.size[0] *  0.5, this._config.position[1] + this._config.size[1] * -0.5, this._config.position[2] + this._config.size[2] * -0.5];
                    var FTL = [this._config.position[0] + this._config.size[0] * -0.5, this._config.position[1] + this._config.size[1] *  0.5, this._config.position[2] + this._config.size[2] * -0.5];
                    var FTR = [this._config.position[0] + this._config.size[0] *  0.5, this._config.position[1] + this._config.size[1] *  0.5, this._config.position[2] + this._config.size[2] * -0.5];
                    var BBL = [this._config.position[0] + this._config.size[0] * -0.5, this._config.position[1] + this._config.size[1] * -0.5, this._config.position[2] + this._config.size[2] *  0.5];
                    var BBR = [this._config.position[0] + this._config.size[0] *  0.5, this._config.position[1] + this._config.size[1] * -0.5, this._config.position[2] + this._config.size[2] *  0.5];
                    var BTL = [this._config.position[0] + this._config.size[0] * -0.5, this._config.position[1] + this._config.size[1] *  0.5, this._config.position[2] + this._config.size[2] *  0.5];
                    var BTR = [this._config.position[0] + this._config.size[0] *  0.5, this._config.position[1] + this._config.size[1] *  0.5, this._config.position[2] + this._config.size[2] *  0.5];
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

            public data():z3d.geom.Buffer[] {
                return this._buffer;
            }
        }
    }
}
