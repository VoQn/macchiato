// Utility

var force = function( promise ){
  return promise();
};

var is_list = function( obj ) {
  var i = 0,
      classes = [ Array, NodeList, HTMLCollection ],
      l = classes.length;

  for ( ; i < l; i++ ){
    if ( obj instanceof classes[ i ] ){
      return true;
    }
  }

  return false;
};

var is_empty = function( obj ){
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

var map = function( callback, elements ){
  var i = 0,
      l,
      result,
      put;

  put = function( index ){
    result[ index ] = callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    result = [];
    l = elements.length;
    for ( ; i < l; i++ ){
      put( i );
    }
  } else {
    result = {};
    for ( i in xs ){
      if ( xs.hasOwnProperty( i ) ){
        put( i );
      }
    }
  }

  return result;
};

var each = function( callback, elements ){
  var i = 0,
      l,
      call;

  call = function( index ){
    callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    l = elements.length;
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

var filter = function( callback, elements ){
  var i = 0,
      l = elements.length,
      r = [],
      x;
  for ( ; i < l; i++ ){
    x = elements[ i ];
    if ( callback( x, i ) ){
      r.push( x );
    }
  }
  return r;
};

var createSingleton = function( obj, methods ){
  obj.prototype = methods;
  return new obj();
};

