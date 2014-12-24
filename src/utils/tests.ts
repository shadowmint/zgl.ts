import sh = require("../shader");
import prog = require("../program");
import sc = require("../draw/scene");
import buffer = require("../utils/buffer");
import qu = require("../geom/prefab/quad");
import c = require("../context");

export function shader(canvas, vertex_shader, fragment_shader, texture):void {
  var glc;
  try {
    // Load webgl context
    try {
      glc = c.context(canvas);
      glc.debug();
      glc.viewport();
    }
    catch (e) {
      console.log('No webgl');
      console.log(e);
      return;
    }

    // Setup~
    var scene = new sc.Scene(glc);

    // Setup time
    var time_offset = buffer.factory(1);
    time_offset.data[0] = 0.0;

    // Create a set of renderers to use
    var renderer = scene.renderer();

    // Load program
    renderer.program = function (glc) {
      var gl = glc.gl;

      var vertexShader = sh.fromScript(vertex_shader);
      var fragmentShader = sh.fromScript(fragment_shader);
      var program = new prog.Program(glc, {vertex: vertexShader, fragment: fragmentShader});

      // Bind shader attributes
      program.bind('a_vertex', prog.BufferType.VERTEX_FLOAT3);
      program.bind('a_color', prog.BufferType.VERTEX_FLOAT4);
      program.bind('a_uv', prog.BufferType.VERTEX_FLOAT2);
      program.bind('u_proj', prog.BufferType.UNIFORM_MAT4);
      program.bind('u_model', prog.BufferType.UNIFORM_MAT4);
      program.bind('u_sampler', prog.BufferType.UNIFORM_SAMPLER);
      program.bind('u_time_offset', prog.BufferType.UNIFORM_FLOAT);

      // Timer is not generated from the geom source; make sure
      // we populate that shader attribute each frame.
      program.extra = function(p) { program.buffer('u_time_offset', time_offset); };
      return program;
    };

    // Set camera
    scene.camera.position(0, 2, -9);

    // Set background
    scene.background  = [0.0, 0.0, 0.0, 1.0];

    // Create some geometry
    var tex = document.getElementById(texture);
    var quad = new qu.Quad({
      texture: tex,
      size: [1.0, 1.0, 1.0],
      position: [0.0, -1.0, 0.0]
    });

    // Add geometry
    renderer.add(quad.compile(glc, scene.textures));
    glc.check();

    // Updater
    var timer = 0;
    scene.update = function(step) {
      timer += step; // Only update in first renderer
      time_offset.data[0] = timer * 0.001;
    };
    glc.check();

    // Turn depth testing on
    glc.gl.enable(glc.gl.DEPTH_TEST);
    glc.gl.depthFunc(glc.gl.LESS);

    // Set view for this scene
    scene.camera.modelview.unity().rotateX(0).rotateZ(3.14).translate(0, 0, -0.7);

    // Render each frame
    glc.run(function (step) { scene.render(step); });
  }
  catch (e) {
    console.log(e);
  }
}
