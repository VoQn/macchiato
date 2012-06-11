
/**
 * @param {string} name
 * @param {Array.<string>} methods
 * @constructor
 */
var Interface = function( name, methods ){
  if ( arguments.length != 2 ){
    throw new Error('Interface constructor called with ' + arguments.length + 'arguments, but expected exactly 2.');
  }
  this.name = name;
  this.methods = [];
  var i = 0, l = methods.length;
  for ( ; i < l; i++ ){
    if ( typeof methods[ i ] !== 'string' ){
      throw new Error('Interface constructor expects method names to be passed in as a string');
    }
    this.methods.push( methods[ i ]);
  }
};

/**
 * @param {Object} obj
 * @param {...Object} a_interface (optional)
 */
Interface.ensureImplements = function( object, a_interface ){
  if ( arguments.length < 2 ){
    throw new Error('Function Interface.ensureImplements called with ' + arguments.length + 'arguments, but expected at least 2.');
  }
  var i = 1, l = arguments.length, j, m;
  for ( ; i < l; i++ ){
    var _interface = arguments[ i ];
    if ( _interface.constructor !== Interface ) {
      throw new Error('Function Interface.ensureImplements expects arguments two and above to be instance of Interface.');
    }
    j = 0;
    m = _interface.methods.length;
    for ( ; j < m; j++ ){
      var method = _interface.methods[ j ];
      if ( !object[ method ] || typeof object[ method ] !== 'function' ) {
        throw new Error('Function Interface.ensureImplements: object does not implement the ' + _interface.name + ' interface. Method ' + method + ' was not found.');
      }
    }
  }
};

