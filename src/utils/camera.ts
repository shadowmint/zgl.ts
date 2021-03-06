import m = require('../utils/matrix');
import g = require('../geom/geometry');

export class Camera {

  private _buffer:g.Data[] = [];

  public projection:m.Mat4;

  public modelview:m.Mat4;

  constructor(u_proj:string, u_modelview:string) {
    this.projection = new m.Mat4().perspective(45, 1, 0.1, 1000);
    this.modelview = new m.Mat4().unity();
    this._buffer.push({attrib: u_proj, data: this.projection.vp(), mode: null});
    this._buffer.push({attrib: u_modelview, data: this.modelview.vp(), mode: null});
  }

  /** Look at position */

  /** Set camera position */
  public position(x:number, y:number, z:number):void {
    this.modelview.translate(-x, -y, -z);
  }

  /** Set camera normal */

  /** Move forwards */

  /** Move backwards */

  /** Move left */

  /** Move right */

  /** Move forwards */

  /** Move backwards */

  /** Orbit left around target */

  /** Orbit right around target */

  public data():g.Data[] {
    return this._buffer;
  }
}
