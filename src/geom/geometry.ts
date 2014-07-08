import b = require('../utils/buffer');
import c = require('../context');
import p = require('./primitives');

/** Generates fields that can be rendered */
export interface Data {

    /** The shader attribute to attach */
    attrib:string;

    /** Data buffer to bind */
    data:b.Buffer<Float32Array>;

    /** Rendering mode */
    mode:any;
}

/** Configuration for Gen type of Geometry */
export class Config {

    /** Vertex attribute name */
    public a_vertex:string = 'a_vertex';

    /** Color attribute name */
    public a_color:string = 'a_color';

    /** UV attribute name */
    public a_uv:string = 'a_uv';

    /** Sample attribute name */
    public u_sampler:string = 'u_sampler';

    /** Mesh to load faces from */
    public mesh:p.Mesh = null;

    /** Texture source */
    public texture:HTMLImageElement = null;

    /** Geometry cache */
    public geometry:Geometry = null;

    /** Compile this config into Geometry */
    public compile(context:c.Context):Geometry {
        if (this.geometry == null) {
            this.geometry = new Geometry(this);
            this.geometry.compile(context);
        }
        return this.geometry;
    }
}

/** Common base class for geometry types */
export class Geometry {

    /** Offset into arrays to use */
    public offset:number;

    /** Size of the arrays to use */
    public size:number;

    /** GL rendering mode to use */
    public mode:any;

    /** Is this geometry still valid? */
    public valid:boolean = true;

    /** Is this geometry still visible? */
    public visible:boolean = true;

    /** The actual texture object to render with */
    public texture:any = null;

    /** Internal gl arrays */
    private _uv:b.Buffer<Float32Array>;
    private _vertex:b.Buffer<Float32Array>;
    private _color:b.Buffer<Float32Array>;

    /** Cached copy of the config */
    public _config:Config;

    /** Actual buffers */
    public _buffers:b.Buffer<Float32Array>[] = null;

    /** Actual data buffers */
    public _buffer:Data[] = [];

    /** Requires a rebuild? */
    public _rebuild:boolean = true;

    /** Create passing a mesh to use */
    public constructor(config:Config) {
        this._config = config;
    }

    /** Reset to require a new rebuild */
    public touch():void {
        this._rebuild = true;
    }

    /** Return the data arrays for this object */
    public data():Data[] {
        return this._buffer;
    }

    /** Compile this object from it's internal state */
    public compile(context:c.Context):Geometry {
        if (this._rebuild) {

            // Setup
            var gl = context.gl;
            var faces = this._config.mesh.faces();
            this.offset = 0;
            this.size = faces.length * 6;
            this.mode = gl.TRIANGLES;

            // If no buffers have been provided, allocate new ones
            if (this._buffers == null) {
                this._buffers = [
                    b.factory(this.size * 4),
                    b.factory(this.size * 3),
                    b.factory(this.size * 2)
                ];
            }

            // If we're rebuilding, rebuild
            if (this._rebuild) {
                this._rebuild = false;

                // Arrays
                this._color = this._buffers[0];
                this._vertex = this._buffers[1];
                this._uv = this._buffers[2];

                // Bind texture
                if (this.texture == null) {
                    this.texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._config.texture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }

                // Assign buffers
                this._buffer.push({attrib: this._config.a_color, data: this._color, mode: gl.STATIC_DRAW});
                this._buffer.push({attrib: this._config.a_vertex, data: this._vertex, mode: gl.STATIC_DRAW});
                this._buffer.push({attrib: this._config.a_uv, data: this._uv, mode: gl.STATIC_DRAW});
                this._buffer.push({attrib: this._config.u_sampler, data: this.texture, mode: null});

                // Buid element arrays
                var points = p.export_mesh(faces);

                // Build buffers
                this._color.set(points.color);
                this._uv.set(points.uv);
                this._vertex.set(points.vertex);
            }
            return this;
        }
    }
}
