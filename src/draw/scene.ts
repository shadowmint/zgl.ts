import r = require('./renderer');
import c = require('../context');
import cam = require('../utils/camera');
import tex = require('../utils/textures');

/** Keep a set of shader programs and render each of them */
export class Scene {

  /** The set of shader programs to run */
  components:r.Renderer[] = [];

  /** Rendering context */
  private _glc:c.Context = null;

  /** Shared camera for the whole scene */
  public camera:cam.Camera = null;

  /** The texture cache */
  public textures:tex.Textures;

  /** The background color to use when rendering */
  public background:number[] = [1.0, 1.0, 1.0, 1.0];

  /** Update call, if any */
  public update:{(step:number):void} = null;

  constructor(context:c.Context, u_proj:string = 'u_proj', u_modelview = 'u_model') {
    this._glc = context;
    this.camera = new cam.Camera(u_proj, u_modelview);
    this.textures = new tex.Textures();
  }

  /** Add a renderer */
  public renderer():r.Renderer {
    var rtn = new r.Renderer(this._glc);
    rtn.camera = this.camera;
    this.components.push(rtn);
    return rtn;
  }

  /** Render all the shader programs */
  public render(step:number):void {
    var gl = this._glc.gl;

    // Update scene state
    if (this.update) {
      this.update(step);
    }

    // Reset frame
    gl.clearColor(this.background[0], this.background[1], this.background[2], this.background[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Render each shader
    for (var i = 0; i < this.components.length; ++i) {
      this.components[i].render(step);
    }
  }
}
