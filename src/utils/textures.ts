import c = require('../context');

/** Binding of a texture */
export interface Texture {
  src:HTMLElement;
  texture:any;
}

/** A common texture manager */
export class Textures {

  /** Texture instance cache */
  private static __cache:{[key:string]:Texture} = {};

  /** Release a texture */

  /** Release all textures */

  /** Get a cached texturing binding, or bind it if it doesn't exists */
  public bind(c:c.Context, texture:HTMLImageElement):any {
    var name = texture.src;
    if (!Textures.__cache[name]) {
      Textures.__cache[name] = {
        src: texture,
        texture: this._bind(c, texture)
      };
    }
    return Textures.__cache[name].texture;
  }

  /** Bind an actual texture */
  private _bind(c:c.Context, texture:HTMLImageElement):any {
    var gl = c.gl;
    var rtn = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rtn);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return rtn;
  }
}
