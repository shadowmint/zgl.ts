/// <reference path="__init__.ts"/>
module zgl {

    /* A fragment and vertex shader combo */
    export interface Shaders {
        vertex:Shader;
        fragment:Shader;
    }

    /* Types of buffers that can be bound */
    export enum BufferType {
        UNIFORM_SAMPLER,
        UNIFORM_MAT4,
        UNIFORM_FLOAT,
        VERTEX_FLOAT2,
        VERTEX_FLOAT3,
        VERTEX_FLOAT4
    }

    /* The currently held config for a buffer binding */
    interface BufferBinding {
        attribute:string;
        type:BufferType;
        location:any;
        buffer:any;
        dirty:boolean;
        mode:any;
    }

    /** A shader program */
    export class Program {

        /* The actual shader program */
        public program:any = null;

        /* The shaders used */
        public shaders:Shaders;

        /* Attribute binding */
        private _bindings:{[key:string]:BufferBinding} = {};

        /* Keep a copy of the context to work with */
        private _glc:zgl.Context;

        /*
         * Create a program for a set of shaders
         * @param gl The gl context
         * @param shaders The set of shaders
         */
        constructor(glc:zgl.Context, shaders:Shaders) {
            this._glc = glc;
            this.shaders = shaders;
            this.reload();
        }

        /*
         * Reload the program from saved values.
         * @param gl The gl context
         */
        public reload():void {

            var gl = this._glc.gl;

            // Remove any old program
            if (this.program != null) {
                gl.deleteProgram(this.program);
                this.program = null;
            }

            // Force shaders to reload for this program
            this.shaders.vertex.reload(this._glc);
            this.shaders.fragment.reload(this._glc);

            // New program
            var program = gl.createProgram();
            gl.attachShader(program, this.shaders.vertex.shader);
            gl.attachShader(program, this.shaders.fragment.shader);
            gl.linkProgram(program);

            // Check the link status
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var lastError = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                throw new Error('Error linking program:' + lastError);
            }
            this.program = program;
            this.shaders = this.shaders;
        }

        /* Bind a buffer to an attribute for a shader */
        public bind(attribute:string, type:BufferType):void {
            if (this._bindings[attribute]) {
                throw new Error('Invalid attribute name "' + attribute + '" already in use');
            }
            this._bindings[attribute] = {
                attribute:attribute,
                type:type,
                buffer:null,
                location:null,
                dirty:true,
                mode:null
            }
        }

        /* Assign a buffer for this renderer */
        public buffer(attribute:string, buffer:zgl.Buffer<Float32Array>, mode:any = null):void {
            if (!this._bindings[attribute]) {
                throw new Error('Unable to buffer unknown attribute "' + attribute + '"');
            }
            this._bindings[attribute].buffer = buffer;
            this._bindings[attribute].dirty = true;
            this._bindings[attribute].mode = mode;
            this.update(attribute);
        }

        /* Convert this block into an opengl buffer */
        private _createBuffer(mem:zgl.Mem):void {
            var gl = this._glc.gl;
            mem.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mem.buffer);
            if (gl.getError() != gl.NO_ERROR) {
                throw new Error("Error creating data buffer");
            }
        }

        /*
         * Push the inner data into the gl buffer.
         * Notice this is only required for per-vertex attributes; for uniform values there
         * is no need to invoke this; and if the mode is not specified it does nothing.
         */
        public update(attribute:string):void {
            if (!this._bindings[attribute]) {
                throw new Error('Unable to buffer data for unknown attribute "' + attribute + '"');
            }
            var gl = this._glc.gl;
            var attrib = this._bindings[attribute];
            var buffer = attrib.buffer;
            var mode = attrib.mode;
            if (mode != null) {
                if (buffer.mem.buffer == null) {
                    this._createBuffer(buffer.mem);
                }
                gl.bufferData(gl.ARRAY_BUFFER, buffer.mem.data, mode);
                if (gl.getError() != gl.NO_ERROR) {
                    throw new Error("Error buffering data on array");
                }
            }
        }

        /* Release the buffer for a given attribute */
        public release(attribute:string):void {
            if (this._bindings[attribute]) {
                var buffer = this._bindings[attribute].buffer;
                if (buffer.mem.buffer) {
                    // gl.DestoryBuffer(buffer['buffer'])
                }
                delete this._bindings[attribute];
            }
        }

        /* Rebind buffers to the program */
        public load():void {

            var gl = this._glc.gl;

            // Load the program
            gl.useProgram(this.program);

            // Now bind each buffer to each program location
            for (var key in this._bindings) {

                // Get the attribute binding
                var attrib = this._bindings[key];
                if (attrib.buffer == null) {
                    throw new Error('No buffer has been bound to attribute "' + key + '"');
                }

                // Get the location
                switch(attrib.type) {
                    case BufferType.UNIFORM_SAMPLER:
                    case BufferType.UNIFORM_FLOAT:
                    case BufferType.UNIFORM_MAT4:
                        attrib.location = gl.getUniformLocation(this.program, attrib.attribute);
                        if (attrib.location == null) {
                            throw new Error('Invalid attribute: "' + attrib.attribute + '": ' + gl.getError());
                        }
                        break;

                    case BufferType.VERTEX_FLOAT2:
                    case BufferType.VERTEX_FLOAT3:
                    case BufferType.VERTEX_FLOAT4:
                        attrib.location = gl.getAttribLocation(this.program, attrib.attribute);
                        if (attrib.location == null) {
                            throw new Error('Invalid attribute: "' + attrib.attribute + '": ' + gl.getError());
                        }
                        break;
                }

                // Bind buffer; must be done every frame.
                switch(attrib.type) {
                    case BufferType.UNIFORM_SAMPLER:
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, attrib.buffer);
                        gl.uniform1i(attrib.location, 0);
                        break;

                    case BufferType.UNIFORM_MAT4:
                        gl.uniformMatrix4fv(attrib.location, false, attrib.buffer.data);
                        break;

                    case BufferType.UNIFORM_FLOAT:
                        gl.uniform1fv(attrib.location, attrib.buffer.data);
                        break;

                    case BufferType.VERTEX_FLOAT2:
                        gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer.mem.buffer);
                        gl.enableVertexAttribArray(attrib.location);
                        gl.vertexAttribPointer(attrib.location, 2, gl.FLOAT, false, 0, 0);
                        break;

                    case BufferType.VERTEX_FLOAT3:
                        gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer.mem.buffer);
                        gl.enableVertexAttribArray(attrib.location);
                        gl.vertexAttribPointer(attrib.location, 3, gl.FLOAT, false, 0, 0);
                        break;

                    case BufferType.VERTEX_FLOAT4:
                        gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer.mem.buffer);
                        gl.enableVertexAttribArray(attrib.location);
                        gl.vertexAttribPointer(attrib.location, 4, gl.FLOAT, false, 0, 0);
                        break;
                }
            }
        }
    }
}
