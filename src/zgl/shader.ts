/// <reference path="__init__.ts"/>
module zgl {

    /* A fragment and vertex shader combo */
    export interface Shaders {
        vertex:Shader;
        fragment:Shader;
    }

    /* Shader types */
    export enum ShaderType {
        VERTEX,
        FRAGMENT
    }

    /* Types of buffers that can be bound */
    export enum BufferType {
        UNIFORM_MAT4,
        VERTEX_FLOAT3
    }

    /* The currently held config for a buffer binding */
    interface BufferBinding {
        attribute:string;
        type:BufferType;
        location:any;
        buffer:any;
        dirty:boolean;
    }

    /* A shader instance */
    export class Shader {

        /* The actual shader instance */
        public shader:any = null;

        /* Type of this shader */
        public type:ShaderType;

        /* The source of this shader */
        private _src:string;

        /*
         * Create a new shader from a script block
         *
         * Notice that by default shader compile is deferred
         * until they are used in a program.
         *
         * @param gl The opengl context
         * @param source The raw shader program as a string.
         * @param type The type of shader this is.
         */
        constructor(source:string, type:ShaderType) {
            this.type = type;
            this._src = source;
        }

        /*
         * Reload the shader from saved values.
         * @param gl The opengl context
         */
        public reload(gl:any) {

            // Remove any shader program
            if (this.shader != null) {
                gl.deleteShader(this.shader);
                this.shader = null;
            }

            // GL enum for shader type
            var shaderType:string = '';
            switch (this.type) {
                case ShaderType.VERTEX:
                    shaderType = gl.VERTEX_SHADER;
                    break;
                case ShaderType.FRAGMENT:
                    shaderType = gl.FRAGMENT_SHADER;
                    break;
                default:
                    throw new Error('Unknown shader type');
            }

            // Create the shader object
            var shader = gl.createShader(shaderType);

            // Load the shader source
            gl.shaderSource(shader, this._src);

            // Compile the shader
            gl.compileShader(shader);

            // Check the compile status
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var lastError = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error('Error compiling shader "' + shader + '": ' + lastError);
            }

            this.shader = shader;
        }

        /* Helper to convert a <script> tag into a shader */
        public static fromScript(scriptTagId:string):Shader {
            var shaderScript = document.getElementById(scriptTagId);
            if (!shaderScript) {
                throw('Unable to find script element with id "' + scriptTagId + '"');
            }
            var shaderSource = shaderScript.textContent;
            var shaderType:ShaderType;
            if (shaderScript['type'] == "x-shader/x-vertex") {
                shaderType = ShaderType.VERTEX;
            }
            else if (shaderScript['type'] == "x-shader/x-fragment") {
                shaderType = ShaderType.FRAGMENT;
            }
            else {
                throw new Error('Invalid "type" value on script; must be "x-shader/x-vertex" or "x-shader/x-fragment""');
            }
            return new Shader(shaderSource, shaderType);
        }
    }

    /** A shader program */
    export class Program {

        /* The actual shader program */
        public program:any = null;

        /* The shaders used */
        public shaders:Shaders;

        /* Attribute binding */
        private _bindings:{[key:string]:BufferBinding} = {};

        /*
         * Create a program for a set of shaders
         * @param gl The gl context
         * @param shaders The set of shaders
         */
        constructor(gl, shaders:Shaders) {
            this.shaders = shaders;
            this.reload(gl);
        }

        /*
         * Reload the program from saved values.
         * @param gl The gl context
         */
        public reload(gl:any):void {

            // Remove any old program
            if (this.program != null) {
                gl.deleteProgram(this.program);
                this.program = null;
            }

            // Force shaders to reload for this program
            this.shaders.vertex.reload(gl);
            this.shaders.fragment.reload(gl);

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
        public bind(attribute:string, type:BufferType, buffer:any = null):void {
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

        /* Assign a buffer for this renderer */
        public buffer(attribute:string, buffer:any):void {
            if (!this._bindings[attribute]) {
                throw new Error('')
            }
            this._bindings[attribute].buffer = buffer;
            this._bindings[attribute].dirty = true;
        }

        /* Rebind buffers to the program */
        public load(gl:any):void {

            // Load the program
            gl.useProgram(this.program);

            // Now bind each buffer to each program location
            for (var key in this._bindings) {

                // Get the attribute binding
                var attrib = this._bindings[key];

                // Get the location
                switch(attrib.type) {
                    case BufferType.UNIFORM_MAT4:
                        attrib.location = gl.getUniformLocation(this.program, attrib.attribute);
                        break;

                    case BufferType.VERTEX_FLOAT3:
                        attrib.location = gl.getAttribLocation(this.program, attrib.attribute);
                        break;
                }

                // Bind buffer
                if (attrib.dirty) {
                    switch(attrib.type) {
                        case BufferType.UNIFORM_MAT4:
                            gl.uniformMatrix4fv(attrib.location, false, attrib.buffer);
                            break;

                        case BufferType.VERTEX_FLOAT3:
                            gl.enableVertexAttribArray(attrib.location);
                            gl.vertexAttribPointer(attrib.location, 3, gl.FLOAT, false, 0, 0);
                            break;
                    }
                }
            }
        }
    }
}
