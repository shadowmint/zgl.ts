import c = require('../context');

/** A memory block of values */
export class Mem {

  /** The GL buffer target, or any other native binding */
  public buffer:any = null;

  /** A data block of memeory */
  public data:ArrayBuffer;

  /** Open gl context */
  private _glc:c.Context;

  /** Size of this memory block */
  public size:number;

  constructor(size:number) {
    this.data = new ArrayBuffer(size);
    this.size = size;
  }

  /** Replace a section of the data in this data block */
  public memset(offset:number, src:Mem, srcOffset:number, bytes:number) {
    var dstU8 = new Uint8Array(this.data, offset, bytes);
    var srcU8 = new Uint8Array(src.data, srcOffset, bytes);
    dstU8.set(srcU8);
  }
}

/** Minimal api we expect on typed arrays */
export interface TypedArray {
  set(data:any[]):void;
  length:number;
}

/** Vritual memory block point; A pointer to a section of a memory block */
export class Buffer<T extends TypedArray> {

  /** Data view only */
  public data:T;

  /** Size of each element in this view */
  public block:number;

  /** Number of elements in this buffer */
  public length:number;

  /** The actual memory block */
  public mem:Mem;

  /*
   * Construct a new public view to a memory block
   * @param T The type; eg. Float32Array
   * @param data The data block to use for this.
   * @param offset The offset into the data block to use for this.
   */
  constructor(T:any, data:Mem, length:number, offset:number = 0) {
    this.block = T['BYTES_PER_ELEMENT'];
    this.mem = data;
    this.data = this._factory(T, length, offset);
    this.length = length;
  }

  /** Returns as an array for debugging or whatever */
  public asArray():number[] {
    var rtn = [];
    for (var i = 0; i < this.data.length; ++i) {
      rtn.push(this.data[i]);
    }
    return rtn;
  }

  /*
   * Element factory
   * <p>
   * NB. that these are binary extensions, so using constructor.apply()
   * on a new object doesn't work; you have to manually check for types.
   * */
  private _factory(type:any, length:number, offset:number):T {
    var max = this.mem.size / this.block;
    if (length > max) {
      throw Error('Invalid length ' + length + ' when memory block is only ' + max + ' long');
    }
    switch (type) {
      case Float32Array:
        var rtn:any = new Float32Array(this.mem.data, this.block * offset, length);
        return <T> rtn;
    }
    throw new Error('Invalid type: ' + type);
  }

  /*
   * Replace a section of the data in this data block
   * @param offset The offset into this VP to set data from.
   * @param src The source to read new data from
   * @param srcOffset The offset into the source for elements
   * @param items The number of items to copy over
   */
  public memset(offset:number, src:Buffer<T>, srcOffset:number, items:number) {
    this.mem.memset(offset * this.block, src.mem, srcOffset * this.block, items * this.block);
  }

  /** Set values from an array of the correct type */
  public set(data:any[]):Buffer<T> {
    if (data.length != this.length) {
      throw Error('Invalid set length ' + data.length + ' != buffer size ' + this.length);
    }
    this.data.set(data);
    return this;
  }
}

/** Convenience function for a simple data element */
export function factory(length:number):Buffer<Float32Array> {
    var size = Float32Array['BYTES_PER_ELEMENT'] * length;
    var mem = new Mem(size);
    return new Buffer<Float32Array>(Float32Array, mem, length, 0);
}
