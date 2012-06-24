
/**
 * @param {string} name
 * @param {Array.<string>} methods
 * @constructor
 */
var Interface = function Interface(name, methods) {
  if (arguments.length !== 2) {
    throw new Error('Interface constructor called with ' +
        arguments.length +
        'arguments, but expected exactly 2.');
  }
  this.name = name;
  this.methods = [];
  var i, l;
  for (i = 0, l = methods.length; i < l; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error('Interface constructor expects ' +
          'method names to be passed in as a string');
    }
    this.methods.push(methods[i]);
  }
};

/**
 * @param {Object} obj
 * @param {Interface} an_interface
 * @param {...Interface} var_args
 */
Interface.ensureImplements = function (object, an_interface, var_args) {
  var i, j, l, m, method, the_interface;
  if (arguments.length < 2) {
    throw new Error('Function Interface.ensureImplements called with ' +
        arguments.length +
        'arguments, but expected at least 2.');
  }
  for (i = 1, l = arguments.length; i < l; i++) {
    the_interface = arguments[i];
    if (the_interface.constructor !== Interface) {
      throw new Error('Function Interface.ensureImplements ' +
          'expects arguments two and ' +
          'above to be instance of Interface.');
    }
    for (j = 0, m = the_interface.methods.length; j < m; j++) {
      method = the_interface.methods[j];
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error('Function Interface.ensureImplements: ' +
            'object does not implement ' +
            'the ' + the_interface.name + ' interface. ' +
            'Method ' + method + ' was not found.');
      }
    }
  }
};

