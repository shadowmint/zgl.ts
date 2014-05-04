/// <reference path="__init__.ts"/>
module zgl {

    /*

     What is a renderable?

     It's a: fragment shader + attributes + bindings for attributes [ buffers ]
     It's a: vertex shader + attributes + bindings for attributes [ buffers ]
     It's a: model view + projection matrix
     It's a: set of gl init calls?
     It's a: call to use program
     It's a: call to draw arrays

     */

    /* Types of buffers that can be bound */
    export enum BufferType {
        PROJECTION,
        MODELVIEW,
        VERTEX,
        FRAGMENT,
    }

    /* The currently held config for a buffer binding */
    export interface BufferBinding {
        attribute:string;
        location:any;
        shader:zgl.Shader;
        type:BufferType;
        buffer:any;
    }

    /* A renderer looks purely after assigning buffers to shaders */
    export class Renderer {

        /* The program used by this renderer */
        program:zgl.Program;

        constructor(program:zgl.Program) {
            this.program = program;
        }

        /* Bind a buffer to an attribute for a shader */
        public bind(gl:any):void {
        }

        /* Load the buffers for this renderer */
        public load(gl:any):void {
        }

        /* Draw this renderer */
        public render(gl:any):void {
        }
    }
}
