import b = require('../../zgl/math/block');
import c = require('../../zgl/context');

/* Geometry type */
export interface Geometry {
  offset:number;
  size:number;
  mode:any;
  valid:boolean;
  visible:boolean;
  data():Data[];
}

/* Generates fields that can be rendered */
export interface Data {
  attrib:string;
  data:b.Buffer<Float32Array>;
  mode:any;
}

/* Common base class for geometry types */
export class GeometryBase {

  /* Is this geometry still valid? */
  public valid:boolean = true;

  /* Is this geometry still visible? */
  public visible:boolean = true;

  /* Raw data buffers */
  public _buffers:b.Buffer<Float32Array>[] = null;

  /* Actual data buffers */
  public _buffer:Data[] = [];

  /* Requires a rebuild? */
  public _rebuild:boolean = true;

  /* Reset to require a new rebuild */
  public touch():void {
    this._rebuild = true;
  }

  /* Compile this object from it's internal state */
  public compile(glc:c.Context):GeometryBase {
    throw Error('Not implemented');
  }

  /* Use a set of provided buffers instead of creating new ones */
  public buffers(...buffers:b.Buffer<Float32Array>[]):void {
  }

  /* Return the data arrays for this object */
  public data():Data[] {
    return this._buffer;
  }
}
