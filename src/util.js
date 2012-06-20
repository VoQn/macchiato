// Utilities

/**
 * @param {function() : *} promise
 * @return {*}
 */
var force = function( promise ){
  return promise();
};

/**
 * @param {function(*, *):*} func
 * @return {function(*, *):*}
 */
var flip = function( func ){
  return function reversed ( b, a ){
    return func( a, b );
  };
};

/**
 * @param {!Array|!Object} object
 * @return {boolean} parameter is kind of list or not
 */
var isList = (function(){
  if ( !!Array.isArray ){
    return Array.isArray;
  }
  return function isList ( object ){
    return Object.prototype.toString.call( object ) === '[object Array]';
  };
})();

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var isEmpty = function( object ){
  for (var _ in obj ){
    return false;
  }
  return true;
};

/**
 * @description Object clone
 * @param {!Object} object
 * @return {Object}
 */
var clone = function( object ) {
  var copied = Object.create( Object.getPrototypeOf( object ) ),
      properties = Object.getOwnPropertyNames( object ),
      index = 0,
      name;
  for ( ; name = properties[ index ]; index++ ){
    Object.defineProperty( copied,
                           name,
                           Object.getOwnPropertyDescriptor( object, name ) );
  }
  return copied;
};

/**
 * @param {function(*, (string|number)=)} callback
 * @param {!Array|*} elements
 * @return {Array|*} new array or object
 */
var map = function( callback, elements ){
  var newArray, newObject,
      index, name,
      length;

  if ( isList( elements ) ){
    newArray = [];
    for ( index = 0, length = elements.length; index < length; index++ ){
      newArray[ index ] = callback( elements[ index ], index );
    }
    return newArray;
  }

  newObject = Object.create( Object.getPrototypeOf( elements ) );
  for ( name in elements ){
    if ( elements.hasOwnProperty( name ) ){
      newObject[ name ] = callback( elements[ name ], name );
    }
  }
  return newObject;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 */
var each = function( callback, elements ){
  var index,
      length;

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
 * @return {Array} new array list
 */
var filter = function( callback, elements ){
  var result = [],
      index = 0,
      newIndex = 0,
      length = elements.length,
      element;

  for ( ; index < length; index++ ){
    element = elements[ index ];
    if ( callback( element, index ) ){
      result[ newIndex ] = element;
      newIndex++;
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
  var index = 0,
      length = elements.length;

  for ( ; index < length; index++ ){
    if ( test( elements[ index ], index ) ){
      return true;
    }
  }
  return false;
};

/**
 * @param {function(Object, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAll = function( test, elements ){
  var index = 0,
      length = elements.length;

  for ( ; index < length; index++ ){
    if ( !test( elements[ index ], index ) ) {
      return false;
    }
  }
  return true;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldLeft = function( init, collector, elements ){
  var result = init,
      index = 0,
      length = elements.length;

  for ( ; index < length; index++ ){
    result = collector( elements[ index ], result );
  }
  return result;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldRight = function( init, collector, elements ){
  var result = init,
      index = elements.length - 1;

  for ( ; index > -1; index-- ){
    result = collector( elements[ index ], result );
  }
  return result;
};

/**
 * @description sum of number array
 * <pre><code>arbitrary( '[number]' ).property( function( numbers ){
 *   var add = function( a, b ){ return a + b; };
 *   return sumOf( numbers ) === foldLeft( 0, add, numbers );
 * }</code></pre>
 * @param {!Array.<number>} numbers
 * @return {number}
 */
var sumOf = function( numbers ){
  var result = 0,
      index = 0,
      length = numbers.length;

  for ( ; index < length; index++ ){
    result += numbers[ index ];
  }
  return result;
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

/**
 * @param {*} fst
 * @param {*} snd
 * @constructor
 */
var Tuple = function Tuple ( fst, snd ){
  this.fst = fst;
  this.snd = snd;
};

/**
 * @param {*} a
 * @param {*} b
 * @return {Tuple}
 */
var tuple = function( a, b ){
  return new Tuple( a, b );
};

/**
 * @description getCurrent Unix time
 * @return {number}
 */
var whatTimeIsNow = function(){
  return new Date().getTime();
};

/**
 * @description pretty print for time span
 * @param {number} from
 * @param {number=} opt_to
 * @return {string}
 */
var printTime = function( from, opt_to ){
  var to = supplement( whatTimeIsNow(), opt_to ),
      time = to - from;
  if ( time > 6e4 ){
    return time / 6e4 + 'min';
  } else if ( time > 1e3 ){
    return time / 1e3 + 's';
  }
  return time + 'ms';
};

