/// <reference path="../__init__.ts"/>
module z3d {
    export module geom {

        export interface HeightmapConfig {
            a_vertex:string;
            a_color:string;
            a_uv:string;
            a_texture:string;
            texture:HTMLImageElement;
            width:number;
            height:number;
            data:zgl.Buffer<Int8Array>;
        }

        export interface HeightmapCell {
            type:number;
            uv:zgl.Buffer<Float32Array>;
        }

        export class Heightmap implements z3d.Geometry {

            private _buffer:z3d.geom.Buffer[] = [];

            constructor(config:HeightmapConfig) {
            }

            /* Configure a heightmap cell type */
            public configure(config:HeightmapCell):void {
            }

            /* Compile this heightmap from it's config */
            public compile():void {
            }

            public data():z3d.geom.Buffer[] {
                return this._buffer;
            }
        }
    }
}
