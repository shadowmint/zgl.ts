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
            transform:zgl.Mat4;
        }

        export class Cube implements z3d.Geometry {

            private _buffer:z3d.geom.Buffer[] = [];

            constructor(config:CubeConfig) {
            }

            /* Compile this cube from it's config */
            public compile():void {
            }

            public data():z3d.geom.Buffer[] {
                return this._buffer;
            }
        }
    }
}
