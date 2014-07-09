/** A webgl context with some extra bits */
export class Context {

  /** Height of the canvas */
  public height:number;

  /** Width of the canvas */
  public width:number;

  /** The canvas object itself */
  public canvas:HTMLCanvasElement;

  /** The opengl content */
  public gl:any;

  /** Debugging? */
  private _debug:boolean = false;

  /** Running the runner utility */
  private _running:boolean = false;

  /**
   * Create a new context from a canvas
   * NB. The canvas size is not the *style* size, it is given by:
   * <canvas id="webgl" width="300px" height="300px"></canvas>
   */
  constructor(c:HTMLCanvasElement) {
    this.canvas = c;
    this.height = c.height;
    this.width = c.width;
    this.gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!this.gl) {
      throw new Error("WebGL not supported");
    }
  }

  /**
   * Turn debugging on.
   * Notice that this requires the webgl debugging library to be loaded:
   * https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js
   */
  public debug():void {
    if (!this._debug) {
      if (!window['WebGLDebugUtils']) {
        throw new Error('Debugging is only possible if <script src="https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js"></script> is loaded');
      }
      this.gl = window['WebGLDebugUtils'].makeDebugContext(this.gl, (err, call, args) => {
        var error = window['WebGLDebugUtils'].glEnumToString(err);
        this.error(error, call, args);
      });
    }
  }

  /** Log debugging errors to console; monkey patch to update */
  private log(msg:string):void {
    if (window['console']) {
      window['console'].log(msg);
    }
  }

  /** Trace error stack */
  private trace(msg:string):void {
    if (window['console']) {
      window['console'].trace();
    }
  }

  /** Set the viewport to the size of the canvas */
  public viewport():void {
    this.gl.viewport(0, 0, this.width, this.height);
  }

  /** Run per-animation frame actions */
  public run(action:any):void {
    if (!this._running) {
      this._running = true;
      var last:number = null;
      var worker = (t:number) => {
        if (last == null) {
          action(0);
          last = t;
        }
        else {
          action(t - last);
          last = t;
        }
        if (this._running) {
          requestAnimationFrame(worker);
        }
      };
      requestAnimationFrame(worker);
    }
  }

  /** Error reporter */
  public error(...e:any[]):void {
    console.trace();
    for (var i = 0; i < e.length; ++i) {
      this.log(e[i]);
    }
    throw new Error('webgl state is not clean.');
  }

  /** Stop the animation handler */
  public stop():void {
    this._running = false;
  }

  /** Debuggering helper; trace the last zgl context and throw an error it errors */
  public check():void {
    var last = this.gl.getError();
    if (last != this.gl.NO_ERROR) {
      this.error(last);
    }
  }
}

/**
 * Return a GL interface for the given canvas element
 * If canvas is a string, getElementById is used to fetch it.
 * @param canvas A string or canvas object.
 * @param debug Turn debugging on for this context.
 */
export function context(canvas:any, debug:boolean = false):Context {
  if (typeof canvas == 'string') {
    canvas = document.getElementById(canvas);
    if (!canvas) {
      throw new Error('Unable to find element with id "' + canvas + '"');
    }
  }
  var rtn = new Context(canvas);
  if (debug) {
    rtn.debug();
  }
  return rtn;
}
