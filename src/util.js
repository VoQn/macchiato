// Utilities

/**
 * @param {function() : Object} promise
 * @return {Object}
 */
var force = function( promise ){
  return promise();
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
  /** @type {!Array} */
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
 * @param {!Object} object
 * @param {!Object} methods
 * @return {!Object} class instance
 */
var createSingleton = function( object, methods ){
  object.prototype = methods;
};

/**
 * @enum {string}
 */
var SupplementMode = {
  MAX: 'max',
  MIN: 'min'
};

/**
 * @param {Object} alt
 * @param {Object=} opt_arg
 * @param {Supplement=} opt_mode
 * @return {(number|Object)}
 */
var supplement = function( alt, opt_arg, opt_mode ){
  if ( opt_arg === undefined ){
    return alt;
  } else if ( opt_mode === undefined ) {
    return opt_arg;
  }
  return Math[ opt_mode ]( alt, opt_arg );
};

