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
        UNIFORM_MAT4,
        VERTEX_FLOAT3,
        VERTEX_FLOAT2
    }

    /* The currently held config for a buffer binding */
    export interface BufferBinding {
        attribute:string;
        type:BufferType;
        location:any;
        buffer:any;
        dirty:boolean;
    }

    /* A renderer looks purely after assigning buffers to shaders */
    export class Renderer {

        /* The program used by this renderer */
        program:zgl.Program;

        /* Attribute binding */
        private _bindings:{[key:string]:BufferBinding} = {};

        /* Is this rendering active */
        private _active:boolean = false;

        constructor(program:zgl.Program) {
            this.program = program;
        }

        /* Bind a buffer to an attribute for a shader */
        public bind(gl:any, attribute:string, type:BufferType, buffer:any = null):void {
            if (this._bindings[attribute]) {
                throw new Error('Invalid attribute name "' + attribute + '" already in use');
            }
            this._bindings[attribute] = {
                attribute:attribute,
                type:type,
                buffer:buffer,
                location:null,
                dirty:true
            }
        }

        /* Load the buffers for this renderer */
        public buffer(attributes:string, buffer:any):void {
            if (!this._bindings[attribute]) {
                throw new Error('')
            }
            this._bindings[attributes].buffer = buffer;
            this._bindings[attributes].dirty = true;
        }

        /* Draw this renderer */
        public render(gl:any, use_cache:boolean = true):void {
            var reload = !this._active || !use_cache;

            // Load the program
            if (reload) { gl.useProgram(this.program.program); }

            // Now bind each buffer to each program location
            for (var key in this._bindings) {

                // Get the attribute binding
                var attrib = this._bindings[key];

                // Get the location
                var location = attrib.location;
                if (reload || !location) {
                    switch(attrib.type) {
                        case BufferType.UNIFORM_MAT4:
                            break;

                        case BufferType.VERTEX_FLOAT2:
                        case BufferType.VERTEX_FLOAT3:
                            break;
                    }
                }

                // Bind buffer
                if (reload || attrib.dirty) {
                    switch(attrib.type) {
                        case BufferType.UNIFORM_MAT4:
                            break;

                        case BufferType.VERTEX_FLOAT2:
                        case BufferType.VERTEX_FLOAT3:
                            break;
                    }
                }
            }

            // Push array
            // ...
        }
    }
}
