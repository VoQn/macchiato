// FUnctional programming utilities

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
  return function _reversed ( b, a ){
    return func( a, b );
  };
};


