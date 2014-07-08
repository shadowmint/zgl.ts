/*
import p = require('../primitives');
import gen = require('../gen');
import cube = require('./cube');

xxx A array of points yy
export class HeightMapConfig {

    xxx Cells wide yy
    dx:number;

    xxx Cells high yy
    dy:number;

    xxx Heights for each cell yy
    heights:number[];

    xxx Cell types yy
    types:number[];

    xxx The top size of each cube yy
    public block:number = 0.1;

    xxx The Z-base for each cube yy
    public base:number = 0;

    xxx Position for the origin of this heightmap yy
    public pos:number[] = [0.0, 0.0, 0.0];
    
    xxx The size of the cubes yy
    public size:number = 1.0;
}

xxx A cube with a uniform texture on each face yy
export class HeightMap extends gen.Gen {

    xxx Source data yy
    public config:HeightMapConfig;

    xxx The set of cubes that are generated for each point in the active zone yy
    private _cubes:cube.Cube[] = null;

    xxx Set of faces yy
    private _faces:p.Face[] = null;

    xxx Return all the faces from all cubes yy
    public faces():p.Face[] {
        this.compile();
        return this._faces;
    }

    xxx Rebuild the faces for this cube yy
    public compile():HeightMap {
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
                    var cube = new cube.Cube();
                    cube.size = c.size;
                    cube.pos = center;
                    this._cubes.push(cube);
                    this._faces.push.apply(this._faces, cube.faces());
                }
            }
        }
        return this;
    }
}
*/
