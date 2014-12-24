import p = require('../primitives');
import geom = require('../geometry');


/** It's a Quad */
export class Quad extends geom.Config {

  /** The distinct points that comprise this Quad */
  public points:p.Point[] = null;

  /** Position for this Quad */
  public pos:number[] = [0.0, 0.0, 0.0];

  /** Size of this Quad */
  public size:number[] = [1.0, 1.0, 1.0];

  /** Export Quad geometry */
  public constructor(params:any) {
      super();
      for (var key in params) {
          if (this[key] || (this[key] === null)) {
              this[key] = params[key];
          }
      }
      this.mesh = new QuadMesh(this);
  }
}

/** A Quad with a uniform texture on each face */
export class QuadMesh implements p.Mesh {

  /** Source data */
  public config:Quad;

  /** Faces for this Quad */
  public _faces:p.Face[] = null;

  /** Create mesh and record instance */
  public constructor(config:Quad) {
      this.config = config;
  }

  /** Return all the faces */
  public faces():p.Face[] {
    this._compile();
    return this._faces;
  }

  /** Rebuild the faces for this Quad */
  private _compile():void {
    this._buffer();
    var pos = this.config.pos;
    var size = this.config.size;
    this.config.points[0].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
    this.config.points[1].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
    this.config.points[2].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
    this.config.points[3].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
    this.config.points[4].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
    this.config.points[5].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
  }

  /** Create buffers */
  private _buffer():void {
    if (this.config.points == null) {
      this.config.points = [
        { pos: [-1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FTL
        { pos: [ 1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // FTR
        { pos: [-1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // BTL
        { pos: [ 1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // BTR
        { pos: [-1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FBL
        { pos: [ 1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // FBR
      ];
      this._faces = [
        { normal: { pos: [ 0.0, 0.0, 1.0] }, points: [ this.config.points[0], this.config.points[1], this.config.points[4], this.config.points[5]]}, // F
      ];
    }
  }
}
