/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        export interface CubeConfig {
            a_vertex:string;
            a_color:string;
            a_uv:string;
            a_texture:string;
            texture:HTMLImageElement;
            width:number;
            height:number;
            position:number[];
        }

        export class Cube implements z3d.Geometry {

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
            public compile(glc:zgl.Context):void {
                var gl = glc.gl;
                if (this._buffer.length == 0) {

                    // Bind texture
                    this._texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, this._texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._config.texture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.bindTexture(gl.TEXTURE_2D, null);

                    // Assign buffers
                    this._color = zgl.Buffer.factory(6 * 6 * 4);
                    this._vertex = zgl.Buffer.factory(6 * 6 * 3);
                    this._uv = zgl.Buffer.factory(6 * 6 * 2);
                    this._buffer.push({attrib: this._config.a_color, data: this._color, mode: glc.gl.DRAW_STATIC});
                    this._buffer.push({attrib: this._config.a_vertex, data: this._vertex, mode: glc.gl.DRAW_STATIC});
                    this._buffer.push({attrib: this._config.a_uv, data: this._uv, mode: glc.gl.DRAW_STATIC});
                    this._buffer.push({attrib: this._config.a_texture, data: this._texture, mode: null});

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
                }

                // Rebuild the vertex data
            }

            public data():z3d.geom.Buffer[] {
                return this._buffer;
            }
        }
    }
}
