import b = require('./block');

/* Cached matrix values for fast operations */
module matrix {
  export var ready:boolean = false;
  export var unity:b.Buffer<Float32Array> = null;
  export var translate:b.Buffer<Float32Array> = null;
  export var rotatex:b.Buffer<Float32Array> = null;
  export var rotatey:b.Buffer<Float32Array> = null;
  export var rotatez:b.Buffer<Float32Array> = null;
  export var scale:b.Buffer<Float32Array> = null;

  /* Load matrix helpers */
  export function init():void {
    var factory = ():b.Buffer<Float32Array> => {
      return b.Buffer.factory(16).set([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
      ]);
    };
    unity = factory();
    translate = factory();
    rotatex = factory();
    rotatey = factory();
    rotatez = factory();
    scale = factory();
    ready = true;
  }
}

/* A 4x4 matrix for 3d operations */
export class Mat4 {

  /* The actual data for this matrix */
  public _data:b.Buffer<Float32Array>;

  constructor() {
    if (!matrix.ready) {
      matrix.init();
    }
    this._data = b.Buffer.factory(16);
    this.unity();
  }

  /* Return raw data item */
  public raw():Float32Array {
    return this._data.data;
  }

  /* Return the vp for this matrix */
  public vp():b.Buffer<Float32Array> {
    return this._data;
  }

  /* Reset to unity value */
  public unity():Mat4 {
    this._data.memset(0, matrix.unity, 0, 16);
    return this;
  }

  /* Apply an arbitrary matrix multiplication */
  public multiply(m:Mat4):Mat4 {
    return this._multiply(m._data.data);
  }

  /* Set the values of this matrix directly */
  public set(data:number[]):Mat4 {
    for (var i = 0; i < 16; ++i) {
      this._data.data[i] = data[i];
    }
    return this;
  }

  /* Apply an arbitrary matrix multiplication */
  private _multiply(m:Float32Array):Mat4 {
    var d = this._data.data;
    var s00 = d[0];
    var s10 = d[1];
    var s20 = d[2];
    var s30 = d[3];
    var s01 = d[4];
    var s11 = d[5];
    var s21 = d[6];
    var s31 = d[7];
    var s02 = d[8];
    var s12 = d[9];
    var s22 = d[10];
    var s32 = d[11];
    var s03 = d[12];
    var s13 = d[13];
    var s23 = d[14];
    var s33 = d[15];
    var m00 = m[0];
    var m10 = m[1];
    var m20 = m[2];
    var m30 = m[3];
    var m01 = m[4];
    var m11 = m[5];
    var m21 = m[6];
    var m31 = m[7];
    var m02 = m[8];
    var m12 = m[9];
    var m22 = m[10];
    var m32 = m[11];
    var m03 = m[12];
    var m13 = m[13];
    var m23 = m[14];
    var m33 = m[15];
    d[0] = s00 * m00 + s10 * m01 + s20 * m02 + s30 * m03;
    d[1] = s00 * m10 + s10 * m11 + s20 * m12 + s30 * m13;
    d[2] = s00 * m20 + s10 * m21 + s20 * m22 + s30 * m23;
    d[3] = s00 * m30 + s10 * m31 + s20 * m32 + s30 * m33;
    d[4] = s01 * m00 + s11 * m01 + s21 * m02 + s31 * m03;
    d[5] = s01 * m10 + s11 * m11 + s21 * m12 + s31 * m13;
    d[6] = s01 * m20 + s11 * m21 + s21 * m22 + s31 * m23;
    d[7] = s01 * m30 + s11 * m31 + s21 * m32 + s31 * m33;
    d[8] = s02 * m00 + s12 * m01 + s22 * m02 + s32 * m03;
    d[9] = s02 * m10 + s12 * m11 + s22 * m12 + s32 * m13;
    d[10] = s02 * m20 + s12 * m21 + s22 * m22 + s32 * m23;
    d[11] = s02 * m30 + s12 * m31 + s22 * m32 + s32 * m33;
    d[12] = s03 * m00 + s13 * m01 + s23 * m02 + s33 * m03;
    d[13] = s03 * m10 + s13 * m11 + s23 * m12 + s33 * m13;
    d[14] = s03 * m20 + s13 * m21 + s23 * m22 + s33 * m23;
    d[15] = s03 * m30 + s13 * m31 + s23 * m32 + s33 * m33;
    return this;
  }

  /* Apply a translate transformation */
  public translate(x:number = 0.0, y:number = 0.0, z:number = 0.0):Mat4 {
    matrix.translate.data[12] = 0.0 + x;
    matrix.translate.data[13] = 0.0 + y;
    matrix.translate.data[14] = 0.0 + z;
    return this._multiply(matrix.translate.data);
  }

  /* Apply a scale transformation */
  public scale(x:number = 0.0, y:number = 0.0, z:number = 0.0):Mat4 {
    matrix.scale.data[0] = x;
    matrix.scale.data[5] = y;
    matrix.scale.data[10] = z;
    return this._multiply(matrix.scale.data);
  }

  /* Apply an x-axis rotate transformation */
  public rotateX(radians:number = 0.0):Mat4 {
    var sv = Math.sin(radians);
    var cv = Math.cos(radians);
    matrix.rotatex.data[5] = cv;
    matrix.rotatex.data[6] = -sv;
    matrix.rotatex.data[9] = sv;
    matrix.rotatex.data[10] = cv;
    return this._multiply(matrix.rotatex.data);
  }

  /* Apply an y-axis rotate transformation */
  public rotateY(radians:number = 0.0):Mat4 {
    var sv = Math.sin(radians);
    var cv = Math.cos(radians);
    matrix.rotatey.data[0] = cv;
    matrix.rotatey.data[2] = sv;
    matrix.rotatey.data[8] = -sv;
    matrix.rotatey.data[10] = cv;
    return this._multiply(matrix.rotatey.data);
  }

  /* Apply an z-axis rotate transformation */
  public rotateZ(radians:number = 0.0):Mat4 {
    var sv = Math.sin(radians);
    var cv = Math.cos(radians);
    matrix.rotatez.data[0] = cv;
    matrix.rotatez.data[1] = -sv;
    matrix.rotatez.data[4] = sv;
    matrix.rotatez.data[5] = cv;
    return this._multiply(matrix.rotatez.data);
  }

  /* Frustum matrix */
  public frustum(left:number = -1, right:number = 1, bottom:number = -1, top:number = 1, near:number = 0.1, far:number = 1):Mat4 {
    var _m = this._data.data;
    var w = right - left;
    var h = top - bottom;
    var d = far - near;
    _m[0] = (2.0 * near) / w;
    _m[1] = 0;
    _m[2] = 0;
    _m[3] = 0;

    _m[4] = 0;
    _m[5] = 2.0 * near / h;
    _m[6] = 0;
    _m[7] = 0;

    _m[8] = (left + right) / w;
    _m[9] = (top + bottom) / h;
    _m[10] = -(far + near) / d;
    _m[11] = -1;

    _m[12] = 0;
    _m[13] = 0;
    _m[14] = -2.0 * far * near / d;
    _m[15] = 0;
    return this;
  }

  /*
   * Perspective matrix
   * @param fov Field of view in degrees
   * @param aspect The aspect ratio
   * @param near The near clip plane
   * @param far The far clip plane
   */
  public perspective(fov:number, aspect:number, near:number, far:number):Mat4 {
    var y = near * Math.tan(fov * Math.PI / 360);
    var x = y * aspect;
    return this.frustum(-x, x, -y, y, near, far);
  }
}
