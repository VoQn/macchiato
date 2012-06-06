// Utility

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
var is_list = function( object ) {
  /** @type {string|number} */
  var i = 0;
  /** @type {Array} */
  var classes = [ Array, NodeList, HTMLCollection ];
  /** @type {number} */
  var l = classes.length;

  for ( ; i < l; i++ ){
    if ( object instanceof classes[ i ] ){
      return true;
    }
  }

  return false;
};

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var is_empty = function( object ){
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
  /** @type {string|number} */
  var i = 0;

  /** @type {Array|Object} */
  var result = [];

  /**
   * @param {string|number} index of elements
   */
  var put = function( index ){
    result[ index ] = callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    /** @type {number} */
    var l = elements.length;
    for ( ; i < l; i++ ){
      put( i );
    }
  } else {
    result = {};
    for ( i in elements ){
      if ( elements.hasOwnProperty( i ) ){
        put( i );
      }
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
  var i = 0;
  /**
   * @param {string|number} index of elements
   */
  var call = function( index ){
    callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    /** @type {number} */
    var l = elements.length;
    for ( ; i < l; i++ ){
      call( i );
    }
  } else {
    for ( i in elements ) {
      if ( elements.hasOwnProperty( i ) ){
        call( i );
      }
    }
  }
};

/**
 * @param {function(Object, number=): boolean} callback
 * @param {!Array} elements
 * @return {!Array} new array list
 */
var filter = function( callback, elements ){
  /** @type {number} */
  var i = 0;
  /** @type {number} */
  var l = elements.length;
  /** @type {!Array} */
  var result = [];
  /** @type {Object} */
  var x;
  for ( ; i < l; i++ ){
    x = elements[ i ];
    if ( callback( x, i ) ){
      result.push( x );
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

