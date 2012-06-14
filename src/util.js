// Utilities

/**
 * @param {function() : Object} promise
 * @return {Object}
 */
var force = function( promise ){
  return promise();
};

/**
 * @param {function(Object, Object):Object}
 * @return {function(Object, Object):Object}
 */
var flip = function( func ){
  return function( b, a ){
    return func( a, b );
  };
};

/**
 * @param {!Object} object
 * @return {boolean} parameter is kind of list or not
 */
var isList = function( object ) {
  /** @type {Array} */
  var classes = [ Array, NodeList, HTMLCollection ];
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = classes.length;

  for ( ; index < length; index++ ){
    if ( object instanceof classes[ index ] ){
      return true;
    }
  }
  return false;
};

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var isEmpty = function( object ){
  /** @type {string} */
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 * @return {!Array|!Object} new array or object
 */
var map = function( callback, elements ){
  /** @type {Array|Object} */
  var result;
  /** @type {number|string} */
  var index;
  /** @type {number} */
  var length;

  if ( isList( elements ) ){
    result = [];
    for ( index = 0, length = elements.length; index < length; index++ ){
      result[ index ] = callback( elements[ index ], index );
    }
    return result;
  }

  result = {};
  for ( index in elements ){
    if ( elements.hasOwnProperty( index ) ){
      result[ index ] = callback( elements[ index ], index );
    }
  }
  return result;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 */
var each = function( callback, elements ){
  /** @type {string|number} */
  var index;
  /** @type {number} */
  var length;

  if ( isList( elements ) ){
    for ( index = 0, length = elements.length; index < length; index++ ){
      callback( elements[ index ], index );
    }
    return;
  }

  for ( index in elements ) {
    if ( elements.hasOwnProperty( index ) ){
      callback( elements[ index ], index );
    }
  }
};

/**
 * @param {function(Object, number=): boolean} callback
 * @param {!Array} elements
 * @return {!Array} new array list
 */
var filter = function( callback, elements ){
  /** @type {Array} */
  var result = [];
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = elements.length;
  /** @type {Object} */
  var element;

  for ( ; index < length; index++ ){
    element = elements[ index ];
    if ( callback( element, index ) ){
      result.push( element );
    }
  }
  return result;
};

/**
 * @param {function(Object, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAny = function( test, elements ){
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = elements.length;

  for ( ; index < length; index++ ){
    if ( test( elements[ index ], index ) ){
      return true;
    }
  }
  return false;
};

/**
 * @param {function(Object, number=):boolean} test
 * @param {!Array} elemnts
 * @return {boolean}
 */
var hasAll = function( test, elements ){
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = elements.length;

  for ( ; index < length; index++ ){
    if ( !test( elements[ index ], index ) ) {
      return false;
    }
  }
  return true;
};

/**
 * @param {Object}
 * @param {function(Object, Object):Object} collector
 * @param {!Array} elements
 * @return {Object}
 */
var foldLeft = function( init, collector, elements ){
  /** @type {Object} */
  var result = init;
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = elements.length;

  for ( ; index < length; index++ ){
    result = collector( elements[ index ], result );
  }
  return result;
};

/**
 * @param {Object}
 * @param {function(Object, Object):Object} collector
 * @param {!Array} elements
 * @return {Object}
 */
var foldRight = function( init, collector, elements ){
  /** @type {Object} */
  var result = init;
  /** @type {number} */
  var index = elements.length - 1;

  for ( ; index > -1; index-- ){
    result = collector( elements[ index ], result );
  }
  return result;
};

/**
 * sum of number array
 *
 * arbitrary( '[number]' ).property( function( numbers ){
 *   var add = function( a, b ){ return a + b; };
 *   return sumOf( numbers ) === foldLeft( 0, add, numbers );
 * }
 *
 * @param {!Array.<number>} numbers
 * @return {number}
 */
var sumOf = function( numbers ){
  /** @type {number} */
  var result = 0;
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var length = numbers.length;

  for ( ; index < length; index++ ){
    result += numbers[ index ];
  }
  return result;
};

/**
 * @param {!Object} object
 * @param {!Object} methods
 * @return {!Object} class instance
 */
var createSingleton = function( object, methods ){
  object.prototype = methods;
};

/**
 * @param {Object} default_value
 * @param {Object=} opt_arg
 * @param {(function(Object, Object):Object)=} opt_callback
 * @return {Object}
 */
var supplement = function( default_value, opt_arg, opt_callback ){
  if ( opt_arg === undefined ){
    return default_value;
  } else if ( opt_callback === undefined ) {
    return opt_arg;
  }
  return opt_callback( default_value, opt_arg );
};

