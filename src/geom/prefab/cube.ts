import p = require('../primitives');
import geom = require('../geometry');


/** It's a cube */
export class Cube extends geom.Config {
    
  /** The distinct points that comprise this cube */
  public points:p.Point[] = null;
    
  /** Position for this cube */
  public pos:number[] = [0.0, 0.0, 0.0];

  /** Size of this cube */
  public size:number[] = [1.0, 1.0, 1.0];

  /** Export cube geometry */
  public constructor(params:any) {
      super();
      for (var key in params) {
          if (this[key] || (this[key] === null)) {
              this[key] = params[key];
          }
      }
      this.mesh = new CubeMesh(this);
  }
}

/** A cube with a uniform texture on each face */
export class CubeMesh implements p.Mesh {

  /** Source data */
  public config:Cube;

  /** Faces for this cube */
  public _faces:p.Face[] = null;

  /** Create mesh and record instance */
  public constructor(config:Cube) {
      this.config = config;
  }

  /** Return all the faces */
  public faces():p.Face[] {
    this._compile();
    return this._faces;
  }

  /** Rebuild the faces for this cube */
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
    this.config.points[6].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
    this.config.points[7].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
    this.config.points[8].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
    this.config.points[9].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * -0.5];
    this.config.points[10].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
    this.config.points[11].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * 0.5, pos[2] + size[2] * 0.5];
    this.config.points[12].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
    this.config.points[13].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * -0.5];
    this.config.points[14].pos = [pos[0] + size[0] * -0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
    this.config.points[15].pos = [pos[0] + size[0] * 0.5, pos[1] + size[1] * -0.5, pos[2] + size[2] * 0.5];
  }

  /** Create buffers */
  private _buffer():void {
    if (this.config.points == null) {
      this.config.points = [
        // Side faces
        { pos: [-1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FTL
        { pos: [ 1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // FTR
        { pos: [-1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // BTL
        { pos: [ 1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // BTR
        { pos: [-1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FBL
        { pos: [ 1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // FBR
        { pos: [-1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BBL
        { pos: [ 1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] },  // BBR

        // Top and bottom faces
        { pos: [-1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FTL
        { pos: [ 1.0, 1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FTR
        { pos: [-1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BTL
        { pos: [ 1.0, 1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] }, // BTR
        { pos: [-1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 0.0] }, // FBL
        { pos: [ 1.0, -1.0, -1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [0.0, 1.0] }, // FBR
        { pos: [-1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 0.0] }, // BBL
        { pos: [ 1.0, -1.0, 1.0], color: [1.0, 1.0, 1.0, 1.0], uv: [1.0, 1.0] },  // BBR
      ];
      this._faces = [
        // Sides
        { normal: { pos: [ 0.0, 0.0, 1.0] }, points: [ this.config.points[0], this.config.points[1], this.config.points[4], this.config.points[5]]}, // F
        { normal: { pos: [ 0.0, 0.0, -1.0 ]}, points: [ this.config.points[2], this.config.points[3], this.config.points[6], this.config.points[7]]}, // B
        { normal: { pos: [ 1.0, 0.0, 0.0] }, points: [ this.config.points[1], this.config.points[3], this.config.points[5], this.config.points[7]]}, // L
        { normal: { pos: [-1.0, 0.0, 0.0] }, points: [ this.config.points[0], this.config.points[2], this.config.points[4], this.config.points[6]]}, // R

        // Top and bottom with custom UVs
        { normal: { pos: [ 0.0, 1.0, 0.0] }, points: [ this.config.points[8], this.config.points[9], this.config.points[10], this.config.points[11]]},
        { normal: { pos: [ 0.0, -1.0, 0.0] }, points: [ this.config.points[12], this.config.points[13], this.config.points[14], this.config.points[15]]}
      ];
    }
  }
}
