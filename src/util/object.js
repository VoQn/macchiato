// Object control utilities

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var isEmpty = function( object ){
  for ( var _ in object ){
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
  var copied_ = Object.create( Object.getPrototypeOf( object ) ),
      properties_ = Object.getOwnPropertyNames( object ),
      index_ = 0,
      name_;
  for ( ; name_ = properties_[ index_ ]; index_++ ){
    Object.defineProperty( copied_,
                           name_,
                           Object.getOwnPropertyDescriptor( object, name_ ) );
  }
  return copied_;
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
 * @param {*} args has "length" property
 * @param {number=} opt_from
 * @param {number=} opt_to
 * @return {Array}
 */
var asArray = function( args, opt_sub, opt_to ){
  var from_ = supplement( 0, opt_sub ),
      to_   = supplement( args.length ? args.length : 1,
                          opt_to );
  if ( args.length === undefined ){
    return [ args ];
  }
  return Array.prototype.slice.call( args, from_, to_ );
};


