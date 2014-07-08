import r = require('./renderer');
import c = require('../context');
import cam = require('../utils/camera');

/** Keep a set of shader programs and render each of them */
export class Scene {

  /** The set of shader programs to run */
  components:r.Renderer[] = [];

  /** Rendering context */
  private _glc:c.Context = null;

  /** Shared camera for the whole scene */
  public camera:cam.Camera = null;

  /** The background color to use when rendering */
  public background:number[] = [1.0, 1.0, 1.0, 1.0];

  constructor(context:c.Context, u_proj:string = 'u_proj', u_modelview = 'u_model') {
    this._glc = context;
    this.camera = new cam.Camera(u_proj, u_modelview);
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
    this._glc.check();
    var gl = this._glc.gl;
    console.log(this._glc.gl);
    console.log(this.background);
    gl.clearColor(this.background[0], this.background[1], this.background[2], this.background[3]);
    for (var i = 0; i < this.components.length; ++i) {
      this.components[i].render(step);
    }
    this._glc.check();
  }
}
