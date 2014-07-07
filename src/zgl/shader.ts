import c = require('./context');

/* Shader types */
export enum ShaderType {
  VERTEX,
  FRAGMENT
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
   * @param glc The opengl context
   */
  public reload(glc:c.Context) {

    var gl = glc.gl;

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
