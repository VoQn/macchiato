// Object control utilities

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

