
/**
 * @param {string} name
 * @param {Array.<string>} methods
 * @constructor
 */
function Interface( name, methods ){
  if ( arguments.length != 2 ){
    throw new Error('Interface constructor called with ' +
        arguments.length +
        'arguments, but expected exactly 2.');
  }
  this.name = name;
  this.methods = [];
  var i = 0, l = methods.length;
  for ( ; i < l; i++ ){
    if ( typeof methods[ i ] !== 'string' ){
      throw new Error('Interface constructor expects ' +
          'method names to be passed in as a string');
    }
    this.methods.push( methods[ i ]);
  }
}

/**
 * @param {Object} obj
 * @param {Interface} a_interface
 * @param {...Interface} var_args
 */
Interface.ensureImplements = function( object, a_interface, var_args ){
  if ( arguments.length < 2 ){
    throw new Error('Function Interface.ensureImplements called with ' +
        arguments.length +
        'arguments, but expected at least 2.');
  }
  var i = 1, j = 0, method, interface_;
  for ( ; interface_ = arguments[i]; i++ ){
    if ( interface_.constructor !== Interface ) {
      throw new Error('Function Interface.ensureImplements ' +
          'expects arguments two and above to be instance of Interface.');
    }
    for ( ; method = interface_.methods[ j ]; j++ ){
      if ( !object[ method ] || typeof object[ method ] !== 'function' ) {
        throw new Error('Function Interface.ensureImplements: ' +
            'object does not implement the ' + interface_.name + ' interface. ' +
            'Method ' + method + ' was not found.');
      }
    }
  }
};

