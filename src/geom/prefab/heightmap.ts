import p = require('../primitives');
import geom = require('../geometry');
import cube = require('./cube');

/** Heightmap is a 2d block of cubes */
export class Heightmap extends geom.Config {

    /** Cells wide */
    public dx:number = 1;

    /** Cells high */
    public dy:number = 1;

    /** Heights for each cell */
    public heights:number[] = [];

    /** Cell types */
    public types:number[] = [];

    /** The top size of each cube */
    public block:number = 0.1;

    /** The Z-base for each cube */
    public base:number = 0;

    /** Position for the origin of this heightmap */
    public pos:number[] = [0.0, 0.0, 0.0];

    /** The size of the cubes */
    public size:number[] = [1.0, 1.0, 1.0];

    /** Export cube geometry */
    public constructor(params:any) {
        super();
        for (var key in params) {
            if (this[key] || (this[key] === null)) {
                this[key] = params[key];
            }
        }
        this.mesh = new HeightmapMesh(this);
    }
}

/** A cube with a uniform texture on each face */
export class HeightmapMesh implements p.Mesh {

    /** Source data */
    public config:Heightmap;

    /** The set of cubes that are generated for each point in the active zone */
    private _cubes:cube.Cube[] = null;

    /** Set of faces */
    private _faces:p.Face[] = null;

    /** Create mesh and record instance */
      public constructor(config:Heightmap) {
          this.config = config;
      }

    /** Return all the faces from all cubes */
    public faces():p.Face[] {
        this.compile();
        return this._faces;
    }

    /** Rebuild the faces for this cube */
    public compile():void {
        var c = this.config;
        if (this._faces == null) {
            this._faces = [];
            this._cubes = [];
            for (var j = 0; j < c.dy; ++j) {
                for (var i = 0; i < c.dx; ++i) {
                    var size = [c.block, c.block, c.heights[j * c.dx + i]];
                    var center = [
                            c.pos[0] - (c.dx / 2 * c.block) + (c.block * i),
                            c.pos[1] - (c.dy / 2 * c.block) + (c.block * j),
                            c.pos[2] + size[2] / 2
                    ];
                    var child = new cube.Cube({
                        size: size,
                        pos: center
                    });
                    this._cubes.push(child);
                    this._faces.push.apply(this._faces, child.mesh.faces());
                }
            }
        }
    }
}
