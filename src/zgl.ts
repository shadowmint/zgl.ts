import tests_ = require('./utils/tests');

export module zgl {
  export var tests = tests_;
}

// Export module
declare var define:any;
try { define('zgl', function () { return zgl; }); } catch (e) {
  try { window['zgl'] = zgl; } catch(e) {}
}
