import scene_ = require('./draw/scene')
import renderer_ = require('./draw/renderer')
import buffer_ = require('./utils/buffer');
import context_ = require('./context');
import cube_ = require('./geom/prefab/cube');
import heightmap_ = require('./geom/prefab/heightmap');
import quad_ = require('./geom/prefab/quad');
import shader_ = require('./shader');
import program_ = require('./program');
import textures_ = require('./utils/textures');
import geometry_ = require('./geom/geometry');

export module zgl {

  // Basic module exports
  export var renderer = renderer_;
  export var scene = scene_;
  export var buffer = buffer_;
  export var context = context_.context;
  export var program = program_;
  export var shader = shader_;
  export var textures = textures_;
  export var geometry = geometry_;

  // Special convenience exports
  export var BufferType = program_.BufferType;

  // Special prefab exports
  export var prefab = {
    Quad: quad_.Quad,
    Cube: cube_.Cube,
    Heightmap: heightmap_.Heightmap
  };
}

// Export module
declare var define:any;
try { define('zgl', function () { return zgl; }); } catch (e) {
  try { window['zgl'] = zgl; } catch(e) {}
}
