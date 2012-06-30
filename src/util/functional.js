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
  var _reversed_ = function( b, a ){
    return func( a, b );
  };
  return _reversed_;
};

var apply = function( arg ){
  var _application_ = function( func ){
        return func( arg );
      };
  return _application_;
};

var applies = function( arg, var_args ){
  var args_ = asArray( arguments ),
      _application_ = function( func ){
        return func.call( null, args );
      };
  return _application_;
};

/**
 * @param {function()} func
 * @param {...(*)} var_args
 * @return {*}
 */
var curry = function( func, var_args ){
  var length_ = func.length,
      args_ = arguments.length < 2 ? [] : asArray( arguments, 1 ),
      _curried_ = function(){
        var args__ = args_.concat( asArray( arguments ) );
        return curry.apply( null, [func].concat( args__ ));
      };

  if ( length_ <= args_.length ){
    return func.apply( null, args_ );
  }
  return _curried_;
};

