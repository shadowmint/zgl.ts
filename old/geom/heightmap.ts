/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        export interface HeightmapConfig {

            // Shader data
            a_vertex:string;
            a_color:string;
            a_uv:string;
            u_sampler:string;

            // Terrain texture
            texture:HTMLImageElement;

            // Size of the entire cell grid
            width:number;
            height:number;

            // Cells to draw
            x_start:number;
            x_end:number;
            y_start:number;
            y_end:number;

            // Size of each cell in world units
            size:number;

            // Height and type data for each cell
            // NB. types must be registered separately
            heights:zgl.Buffer<Int8Array>;
            types:zgl.Buffer<Int8Array>;
        }

        export interface HeightmapCell {
            type:number;
            uv:zgl.Buffer<Float32Array>;
        }

        /* Cubic heightmap geometry */
        export class Heightmap extends Base implements z3d.Geometry {

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
            public config:HeightmapConfig;

            /* Set of cubes in this heightmap */
            public cubes:geom.Cube[] = [];

            /* Registered types */
            private _types:any = {};

            constructor(config:HeightmapConfig) {
                super();
                this.config = config;
            }

            /* Register a cell type */
            public register(t:HeightmapCell):void {
                this._types[t.type] = t;
            }

            /* Compile this cube from it's config */
            public compile(glc:zgl.Context):any {

                // Setup
                var gl = glc.gl;
                var cubes = this.config.width * this.config.height;
                this.offset = 0;
                this.size = cubes * 6 * 6;
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

                    // Create each cube out of our shared local data buffer~
                    for (var x = this.config.x_start; x <= this.config.x_end; ++x) {
                        for (var y = this.config.x_start; y <= this.config.x_end; ++y) {
                            var cube_config:geom.CubeConfig = <CubeConfig> {}; // TODO
                            var cube = new geom.Cube(cube_config);
                            cube.texture = this.texture;

                            // Create cube specific arrays and assign
                            cube.buffers(); // TODO

                            // Compile cube
                            cube.compile(glc);

                            // Save
                            this.cubes.push(cube);
                        }
                    }
                }
            }
        }
    }
}
